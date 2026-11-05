import { Router, type Request, type Response, type NextFunction } from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import { z } from "zod";
import { pool } from "./db";
import { storage } from "./storage";
import { KITCHEN_CATALOG, KITCHEN_SIDES } from "../shared/kitchenCatalog";

const router = Router();
const STAFF_ROLES = ["account_manager","operations_supervisor","head_chef","logistics_coordinator","food_safety_supervisor"];
const MANAGERS = ["account_manager","operations_supervisor"];
const JWT_SECRET = process.env.JWT_SECRET;
const stripeSecret = process.env.KITCHEN_STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;
const MTN_API_BASE = process.env.KITCHEN_MTN_BASE_URL || "https://sandbox.momodeveloper.mtn.com";
const MTN_ENVIRONMENT = process.env.KITCHEN_MTN_ENVIRONMENT || "sandbox";
const MTN_CURRENCY = process.env.KITCHEN_MTN_CURRENCY || "EUR";

let initPromise: Promise<void> | undefined;
async function initDb() {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS kitchen_orders (" +
      "id UUID PRIMARY KEY, tracking_token_hash TEXT NOT NULL, customer_name TEXT NOT NULL, " +
      "phone TEXT NOT NULL, email TEXT, delivery_address TEXT, notes TEXT, fulfillment TEXT NOT NULL, " +
      "items JSONB NOT NULL, subtotal_cents INTEGER, delivery_fee_cents INTEGER, total_cents INTEGER, " +
      "currency TEXT NOT NULL DEFAULT 'USD', status TEXT NOT NULL, payment_status TEXT NOT NULL, " +
      "payment_method TEXT, payment_reference TEXT, provider_transaction_id TEXT, " +
      "driver_name TEXT, driver_phone TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), " +
      "updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())"
  );
  await pool.query(
    "CREATE TABLE IF NOT EXISTS kitchen_order_events (" +
      "id BIGSERIAL PRIMARY KEY, order_id UUID NOT NULL REFERENCES kitchen_orders(id) ON DELETE CASCADE, " +
      "status TEXT NOT NULL, note TEXT, staff_id INTEGER, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())"
  );
  await pool.query("CREATE INDEX IF NOT EXISTS kitchen_orders_status_idx ON kitchen_orders(status, created_at DESC)");
  await pool.query("CREATE INDEX IF NOT EXISTS kitchen_events_order_idx ON kitchen_order_events(order_id, created_at)");
  await pool.query("CREATE UNIQUE INDEX IF NOT EXISTS kitchen_orders_payment_reference_idx ON kitchen_orders(payment_reference) WHERE payment_reference IS NOT NULL");
}
function ensureDb() { if (!initPromise) initPromise = initDb().catch(err => { initPromise = undefined; throw err; }); return initPromise; }
const asyncRoute = (fn: (req: Request,res: Response,next: NextFunction)=>Promise<unknown>) =>
  (req: Request,res: Response,next: NextFunction)=>{ Promise.resolve(fn(req,res,next)).catch(next); };
const orderSchema = z.object({
  customerName:z.string().trim().min(2).max(120), phone:z.string().trim().min(8).max(24),
  email:z.string().email().max(180).optional().or(z.literal("")),
  address:z.string().trim().max(600).optional(), notes:z.string().trim().max(1500).optional(),
  fulfillment:z.enum(["pickup","delivery"]),
  items:z.array(z.object({
    productId:z.string().min(1).max(80), variantId:z.string().min(1).max(80),
    quantity:z.number().int().min(1).max(50),
    sides:z.array(z.enum(KITCHEN_SIDES)).max(3).optional()
  })).min(1).max(30),
}).strict();
function problem(res:Response, code:number, error:string) { return res.status(code).json({success:false,error}); }
function scrubOrder(order:any, events:any[]) {
  return { id:order.id, items:order.items, subtotalCents:order.subtotal_cents,
    deliveryFeeCents:order.delivery_fee_cents,totalCents:order.total_cents,
    fulfillment:order.fulfillment,status:order.status,paymentStatus:order.payment_status,
    paymentMethod:order.payment_method,driverName:order.driver_name,
    driverPhone:order.driver_phone,events:events.map(e=>({status:e.status,note:e.note,at:e.created_at})),
    createdAt:order.created_at,updatedAt:order.updated_at };
}
async function loadOrder(id:string) {
  const q = await pool.query("SELECT * FROM kitchen_orders WHERE id=$1",[id]); return q.rows[0];
}
async function eventsFor(id:string) {
  return (await pool.query("SELECT status,note,created_at FROM kitchen_order_events WHERE order_id=$1 ORDER BY id",[id])).rows;
}
function tokenMatches(order:any, token:string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return false;
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hash,"hex"), Buffer.from(order.tracking_token_hash,"hex"));
}
function isReadyToCharge(order:any) {
  return order.status === "awaiting_payment" && order.payment_status === "unpaid" &&
    Number.isInteger(order.total_cents) && order.total_cents > 0;
}
type StaffRequest = Request & { staff?: {id:number;role:string} };
async function staffAuth(req:StaffRequest,res:Response,next:NextFunction) {
  if (!JWT_SECRET || JWT_SECRET.length < 32) return problem(res,503,"Staff authentication is not configured");
  const token = (req.headers.authorization || "").replace(/^Bearer /,"");
  try {
    const payload:any = jwt.verify(token, JWT_SECRET);
    if (payload.type !== "catering_staff" || !Number.isInteger(payload.staffId)) return problem(res,401,"Invalid staff session");
    const account = await storage.getCateringStaffById(payload.staffId);
    if (!account || !account.isActive || !STAFF_ROLES.includes(account.role)) return problem(res,403,"Staff access denied");
    req.staff = {id:account.id,role:account.role};
    next();
  } catch { return problem(res,401,"Sign in to Catering Operations to continue"); }
}
function allow(...roles:string[]) {
  return (req:StaffRequest,res:Response,next:NextFunction) => req.staff && roles.includes(req.staff.role) ? next() : problem(res,403,"This kitchen action is restricted to authorized staff");
}
async function addEvent(id:string,status:string,note:string|null,staffId:number|null) {
  await pool.query("INSERT INTO kitchen_order_events(order_id,status,note,staff_id) VALUES ($1,$2,$3,$4)",[id,status,note,staffId]);
}
function mtnConfigured() {
  return !!(process.env.KITCHEN_MTN_API_USER && process.env.KITCHEN_MTN_API_KEY && process.env.KITCHEN_MTN_SUBSCRIPTION_KEY &&
    MTN_ENVIRONMENT === "mtnliberia" && MTN_CURRENCY === "USD" && !MTN_API_BASE.includes("sandbox"));
}
async function mtnToken() {
  const encoded = Buffer.from(process.env.KITCHEN_MTN_API_USER + ":" + process.env.KITCHEN_MTN_API_KEY).toString("base64");
  const r=await fetch(MTN_API_BASE+"/collection/token/",{method:"POST",headers:{"Authorization":"Basic "+encoded,"Ocp-Apim-Subscription-Key":process.env.KITCHEN_MTN_SUBSCRIPTION_KEY!}});
  if(!r.ok) throw new Error("MTN authorization failed");
  const body:any=await r.json();
  if(!body.access_token) throw new Error("MTN access token missing");
  return body.access_token as string;
}
async function reconcileMtn(order:any) {
  if(!mtnConfigured() || order.payment_method!=="mtn" || !order.payment_reference || order.payment_status!=="pending") return order;
  const bearer=await mtnToken();
  const r=await fetch(MTN_API_BASE+"/collection/v1_0/requesttopay/"+encodeURIComponent(order.payment_reference),{
    headers:{"Authorization":"Bearer "+bearer,"X-Target-Environment":MTN_ENVIRONMENT,"Ocp-Apim-Subscription-Key":process.env.KITCHEN_MTN_SUBSCRIPTION_KEY!}
  });
  if(!r.ok) throw new Error("MTN payment status unavailable");
  const info:any=await r.json();
  if(info.status==="SUCCESSFUL" && Number(info.amount)===order.total_cents/100 && info.currency==="USD") {
    await pool.query("UPDATE kitchen_orders SET payment_status='paid',status='paid',provider_transaction_id=$2,updated_at=NOW() WHERE id=$1 AND payment_status='pending' AND status='awaiting_payment'",[order.id,info.financialTransactionId||order.payment_reference]);
    await addEvent(order.id,"paid","MTN payment verified with provider",null);
  } else if(["FAILED","REJECTED","EXPIRED"].includes(info.status)) {
    await pool.query("UPDATE kitchen_orders SET payment_status='unpaid',payment_reference=NULL,updated_at=NOW() WHERE id=$1 AND payment_status='pending'",[order.id]);
  }
  return loadOrder(order.id);
}
router.get("/catalog",(_req,res)=>{
  res.json({success:true,products:KITCHEN_CATALOG,sides:KITCHEN_SIDES,
    payments:{card:!!stripe,mtn:mtnConfigured(),orange:false},
    note:"Juice prices and delivery fees require confirmation before checkout. No live payment is claimed without provider verification."});
});
router.post("/orders",asyncRoute(async(req,res)=>{
  await ensureDb();
  const data=orderSchema.safeParse(req.body);
  if(!data.success) return problem(res,400,"Please review order details and required fields");
  if(data.data.fulfillment==="delivery" && !data.data.address?.trim()) return problem(res,400,"Delivery address is required");
  const snapshot:any[]=[];
  let subtotal=0; let quoteRequired=false;
  for(const item of data.data.items){
    const product=KITCHEN_CATALOG.find(p=>p.id===item.productId);
    const variant=product?.variants.find(v=>v.id===item.variantId);
    if(!product || !variant) return problem(res,400,"An item or size is no longer available");
    const sides=item.sides || [];
    if(sides.length && !product.sidesEligible) return problem(res,400,"Side selections are not available for this item");
    if(new Set(sides).size !== sides.length) return problem(res,400,"Choose distinct side items");
    if(sides.length && sides.length!==3) return problem(res,400,"Select exactly three sides or none");
    // One from each advertised group for eligible meals.
    if(sides.length && (!sides.some(s=>s==="Plantain"||s==="Fries") ||
      !sides.some(s=>s==="Cuscus"||s==="Ajika") || !sides.includes("Vegetable Salad"))) {
      return problem(res,400,"Choose one starch, one traditional side, and vegetable salad");
    }
    if(variant.priceCents===null) quoteRequired=true;
    else subtotal+=variant.priceCents*item.quantity;
    snapshot.push({productId:product.id,name:product.name,variantId:variant.id,variant:variant.label,
      unitPriceCents:variant.priceCents,quantity:item.quantity,sides});
  }
  if(subtotal>20000000) return problem(res,400,"Please contact Catering for large orders");
  const id=crypto.randomUUID(), token=crypto.randomBytes(32).toString("hex");
  const tokenHash=crypto.createHash("sha256").update(token).digest("hex");
  const needsQuote=quoteRequired || data.data.fulfillment==="delivery";
  const status=needsQuote?"awaiting_quote":"awaiting_payment";
  const total=needsQuote?null:subtotal;
  await pool.query(
    "INSERT INTO kitchen_orders(id,tracking_token_hash,customer_name,phone,email,delivery_address,notes,fulfillment,items,subtotal_cents,delivery_fee_cents,total_cents,status,payment_status) "+
    "VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,'unpaid')",
    [id,tokenHash,data.data.customerName,data.data.phone,data.data.email||null,data.data.address||null,
      data.data.notes||null,data.data.fulfillment,JSON.stringify(snapshot),quoteRequired?null:subtotal,
      data.data.fulfillment==="pickup"?0:null,total,status]
  );
  await addEvent(id,status,needsQuote?"Awaiting final juice pricing and/or delivery fee":"Order placed, awaiting payment",null);
  return res.status(201).json({success:true,id,trackingToken:token,order:await loadOrder(id)});
}));
router.get("/orders/:id/track",asyncRoute(async(req,res)=>{
  await ensureDb();
  const order=await loadOrder(req.params.id);
  if(!order || !tokenMatches(order,String(req.query.token||""))) return problem(res,404,"Order not found");
  return res.json({success:true,order:scrubOrder(order,await eventsFor(order.id))});
}));
router.post("/orders/:id/pay",asyncRoute(async(req,res)=>{
  await ensureDb();
  const order=await loadOrder(req.params.id);
  if(!order || !tokenMatches(order,String(req.body?.token||""))) return problem(res,404,"Order not found");
  if(!isReadyToCharge(order)) return problem(res,409,"Order must have final prices and no payment in progress");
  const method = req.body?.method;
  if(method!=="card" && method!=="mtn") return problem(res,400,"Select a supported payment method");
  if(method==="card" && !stripe) return problem(res,503,"Card checkout is not activated for this merchant");
  if(method==="mtn" && !mtnConfigured()) return problem(res,503,"MTN Mobile Money checkout is not activated");
  const ref=crypto.randomUUID();
  const claimed=await pool.query("UPDATE kitchen_orders SET payment_status='pending',payment_method=$2,payment_reference=$3,updated_at=NOW() WHERE id=$1 AND status='awaiting_payment' AND payment_status='unpaid' AND payment_reference IS NULL RETURNING id",[order.id,method,ref]);
  if(!claimed.rowCount) return problem(res,409,"Payment has already been initiated");
  try {
    if(method==="card" && stripe) {
      const host=(process.env.KITCHEN_PUBLIC_ORIGIN||"https://totaggroup.com").replace(/\/$/,"");
      const session=await stripe.checkout.sessions.create({
        mode:"payment",client_reference_id:order.id,
        line_items:[{price_data:{currency:"usd",unit_amount:order.total_cents,
          product_data:{name:"TOTAG Kitchen order "+order.id}},quantity:1}],
        success_url:host+"/catering/kitchen/track?order="+order.id+"&token="+req.body.token,
        cancel_url:host+"/catering/kitchen/track?order="+order.id+"&token="+req.body.token,
        metadata:{kitchen_order_id:order.id,kitchen_payment_ref:ref},
      },{idempotencyKey:"kitchen-"+ref});
      await pool.query("UPDATE kitchen_orders SET provider_transaction_id=$2 WHERE id=$1",[order.id,session.id]);
      return res.json({success:true,paymentStatus:"pending",checkoutUrl:session.url});
    }
    if(method==="mtn") {
      const phone=String(req.body.phone||order.phone).replace(/[\s()+-]/g,"");
      if(!/^231\d{9}$/.test(phone)) throw new Error("Enter a valid Liberia mobile money number (231XXXXXXXXX)");
      const bearer=await mtnToken();
      const response=await fetch(MTN_API_BASE+"/collection/v1_0/requesttopay",{
        method:"POST",
        headers:{"Authorization":"Bearer "+bearer,"X-Target-Environment":MTN_ENVIRONMENT,
          "Ocp-Apim-Subscription-Key":process.env.KITCHEN_MTN_SUBSCRIPTION_KEY!,
          "X-Reference-Id":ref,"Content-Type":"application/json"},
        body:JSON.stringify({amount:(order.total_cents/100).toFixed(2),currency:"USD",externalId:order.id,
          payer:{partyIdType:"MSISDN",partyId:phone},payerMessage:"TOTAG Kitchen order",payeeNote:"TOTAG Kitchen"})
      });
      if(response.status!==202) throw new Error("MTN did not accept the payment request");
      return res.json({success:true,paymentStatus:"pending",message:"Approve the MTN MoMo prompt, then verify payment status in your tracking page."});
    }
  } catch(err:any) {
    await pool.query("UPDATE kitchen_orders SET payment_status='unpaid',payment_reference=NULL,payment_method=NULL,updated_at=NOW() WHERE id=$1 AND payment_reference=$2 AND payment_status='pending'",[order.id,ref]);
    return problem(res,502,err.message||"Payment initiation failed");
  }
}));
router.post("/orders/:id/verify",asyncRoute(async(req,res)=>{
  await ensureDb();
  const order=await loadOrder(req.params.id);
  if(!order || !tokenMatches(order,String(req.body?.token||""))) return problem(res,404,"Order not found");
  let latest=order;
  if(order.payment_method==="mtn" && order.payment_status==="pending") latest=await reconcileMtn(order);
  return res.json({success:true,order:scrubOrder(latest,await eventsFor(order.id))});
}));
router.get("/staff/orders",staffAuth,asyncRoute(async(req,res)=>{
  await ensureDb();
  const rows=(await pool.query("SELECT id,customer_name,phone,email,delivery_address,notes,fulfillment,items,subtotal_cents,delivery_fee_cents,total_cents,status,payment_status,payment_method,driver_name,driver_phone,created_at FROM kitchen_orders ORDER BY created_at DESC LIMIT 200")).rows;
  return res.json({success:true,orders:rows});
}));
router.patch("/staff/orders/:id/quote",staffAuth,allow(...MANAGERS),asyncRoute(async(req,res)=>{
  await ensureDb();
  const input=z.object({deliveryFeeCents:z.number().int().nonnegative().max(200000).optional(),
    juicePrices:z.record(z.number().int().min(1).max(100000)).optional()}).safeParse(req.body);
  if(!input.success) return problem(res,400,"Invalid quote values");
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const row=(await client.query("SELECT * FROM kitchen_orders WHERE id=$1 FOR UPDATE",[req.params.id])).rows[0];
    if(!row || row.status!=="awaiting_quote") {await client.query("ROLLBACK");return problem(res,409,"Order is not awaiting a quote");}
    const items=row.items.map((item:any)=>({...item}));
    for(const item of items) if(item.unitPriceCents===null && input.data.juicePrices?.[item.productId+":"+item.variantId]!==undefined)
      item.unitPriceCents=input.data.juicePrices[item.productId+":"+item.variantId];
    const unresolved=items.some((x:any)=>x.unitPriceCents===null);
    const delivery=row.fulfillment==="pickup"?0:(input.data.deliveryFeeCents??row.delivery_fee_cents);
    const subtotal=unresolved?null:items.reduce((sum:number,x:any)=>sum+x.unitPriceCents*x.quantity,0);
    const ready=!unresolved && delivery!==null;
    const status=ready?"awaiting_payment":"awaiting_quote";
    await client.query("UPDATE kitchen_orders SET items=$2::jsonb,subtotal_cents=$3,delivery_fee_cents=$4,total_cents=$5,status=$6,updated_at=NOW() WHERE id=$1",
      [row.id,JSON.stringify(items),subtotal,delivery,ready?subtotal+delivery:null,status]);
    await client.query("INSERT INTO kitchen_order_events(order_id,status,note,staff_id) VALUES ($1,$2,$3,$4)",
      [row.id,status,ready?"Final price and delivery fee confirmed":"Quote partially updated",(req as StaffRequest).staff!.id]);
    await client.query("COMMIT");
    return res.json({success:true,order:await loadOrder(row.id)});
  } catch(e){await client.query("ROLLBACK");throw e;} finally {client.release();}
}));
router.patch("/staff/orders/:id/status",staffAuth,asyncRoute(async(req,res)=>{
  await ensureDb();
  const staff=(req as StaffRequest).staff!;
  const status=String(req.body?.status||"");
  const note=String(req.body?.note||"").slice(0,400);
  const allowed:Record<string,string[]>={paid:["accepted"],accepted:["preparing"],preparing:["ready"],ready:["dispatched"],dispatched:["delivered"]};
  const roleByStatus:Record<string,string[]>={accepted:MANAGERS,preparing:[...MANAGERS,"head_chef"],ready:[...MANAGERS,"head_chef","food_safety_supervisor"],dispatched:[...MANAGERS,"logistics_coordinator"],delivered:[...MANAGERS,"logistics_coordinator"]};
  if(!roleByStatus[status]?.includes(staff.role)) return problem(res,403,"You cannot make that status change");
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const current=(await client.query("SELECT * FROM kitchen_orders WHERE id=$1 FOR UPDATE",[req.params.id])).rows[0];
    if(!current || !allowed[current.status]?.includes(status) || current.payment_status!=="paid") {await client.query("ROLLBACK");return problem(res,409,"Invalid order transition or unverified payment");}
    await client.query("UPDATE kitchen_orders SET status=$2,updated_at=NOW() WHERE id=$1",[current.id,status]);
    await client.query("INSERT INTO kitchen_order_events(order_id,status,note,staff_id) VALUES($1,$2,$3,$4)",[current.id,status,note||null,staff.id]);
    await client.query("COMMIT");
    return res.json({success:true});
  }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
}));
router.patch("/staff/orders/:id/driver",staffAuth,allow(...MANAGERS,"logistics_coordinator"),asyncRoute(async(req,res)=>{
  await ensureDb();
  const body=z.object({name:z.string().min(2).max(100),phone:z.string().min(8).max(24)}).safeParse(req.body);
  if(!body.success) return problem(res,400,"Enter delivery staff name and phone");
  const r=await pool.query("UPDATE kitchen_orders SET driver_name=$2,driver_phone=$3,updated_at=NOW() WHERE id=$1 AND fulfillment='delivery' AND payment_status='paid' AND status IN ('ready','dispatched') RETURNING id",[req.params.id,body.data.name,body.data.phone]);
  if(!r.rowCount) return problem(res,409,"Order must be paid and ready for dispatch");
  await addEvent(req.params.id,"driver_assigned","Courier assigned",(req as StaffRequest).staff!.id);
  return res.json({success:true});
}));
router.post("/staff/orders/:id/reconcile",staffAuth,allow(...MANAGERS),asyncRoute(async(req,res)=>{
  await ensureDb();
  const order=await loadOrder(req.params.id);
  if(!order) return problem(res,404,"Order not found");
  const latest=await reconcileMtn(order);
  return res.json({success:true,order:latest});
}));
export async function kitchenStripeWebhook(req:Request,res:Response) {
  if(!stripe || !process.env.KITCHEN_STRIPE_WEBHOOK_SECRET) return problem(res,503,"Card webhook is not configured");
  let event:Stripe.Event;
  try {
    event=stripe.webhooks.constructEvent(req.body, String(req.headers["stripe-signature"]||""),process.env.KITCHEN_STRIPE_WEBHOOK_SECRET);
  }catch{return problem(res,400,"Invalid Stripe webhook signature");}
  if(event.type==="checkout.session.completed"){
    const session=event.data.object as Stripe.Checkout.Session;
    if(session.payment_status==="paid" && session.currency==="usd" && session.metadata?.kitchen_order_id && session.metadata.kitchen_payment_ref){
      try {
        await ensureDb();
        const update=await pool.query(
          "UPDATE kitchen_orders SET payment_status='paid',status='paid',updated_at=NOW() WHERE id=$1 AND payment_reference=$2 AND provider_transaction_id=$3 AND total_cents=$4 AND payment_status='pending' AND status='awaiting_payment' RETURNING id",
          [session.metadata.kitchen_order_id,session.metadata.kitchen_payment_ref,session.id,session.amount_total]);
        if(update.rowCount) await addEvent(update.rows[0].id,"paid","Card payment verified by signed provider webhook",null);
      } catch(e) {console.error("Kitchen webhook database error",e);return problem(res,500,"Webhook could not be persisted");}
    }
  }
  if(event.type==="checkout.session.expired"){
    const session=event.data.object as Stripe.Checkout.Session;
    if(session.metadata?.kitchen_order_id && session.metadata.kitchen_payment_ref){
      try{
        await ensureDb();
        await pool.query("UPDATE kitchen_orders SET payment_status='unpaid',payment_reference=NULL,payment_method=NULL,provider_transaction_id=NULL,updated_at=NOW() WHERE id=$1 AND payment_reference=$2 AND provider_transaction_id=$3 AND payment_status='pending' AND status='awaiting_payment'",[session.metadata.kitchen_order_id,session.metadata.kitchen_payment_ref,session.id]);
      }catch(e){console.error("Kitchen expiration webhook persistence error");return problem(res,500,"Unable to persist payment expiration");}
    }
  }
  return res.json({received:true});
}
router.use((_err:any,_req:Request,res:Response,_next:NextFunction)=>problem(res,500,"Kitchen service temporarily unavailable"));
export default router;
