import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import crypto from "node:crypto";
import { pool } from "./db";

// These endpoints are mounted beneath /api/kitchen/staff/inventory AFTER Kitchen staffAuth.
// Manager and food-safety approval remains separate from warehouse receiving.
type StaffRequest = Request & { staff?: { id: number; role: string } };
const router = Router();
const MANAGERS = ["account_manager","operations_supervisor"];
const STOCK = [...MANAGERS,"inventory_manager"];
const READERS = [...STOCK,"head_chef","food_safety_supervisor","logistics_coordinator"];
const approvers = [...MANAGERS,"food_safety_supervisor"];
const issueRoles = [...MANAGERS,"inventory_manager","head_chef"];
const categories = ["ingredient","beverage","packaging","cleaning","other"] as const;
const units = ["kg","g","l","ml","piece","pack"] as const;
const itemSchema = z.object({
  sku:z.string().trim().min(2).max(45).regex(/^[A-Za-z0-9][A-Za-z0-9_-]*$/),
  name:z.string().trim().min(2).max(120),
  category:z.enum(categories),unit:z.enum(units),
  reorderLevel:z.number().nonnegative().max(1000000).default(0)
}).strict();
const receiptSchema=z.object({
  itemId:z.string().uuid(),supplier:z.string().trim().min(2).max(150),
  batchNumber:z.string().trim().min(1).max(80),
  quantity:z.number().positive().max(1000000),
  expiryDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  note:z.string().trim().max(500).optional()
}).strict();
const movementSchema=z.object({
  batchId:z.string().uuid(),quantity:z.number().positive().max(1000000),
  note:z.string().trim().min(3).max(500)
}).strict();
const decisionSchema=z.object({decision:z.enum(["release","reject"]),note:z.string().trim().max(500).optional()}).strict();
const uuidSchema=z.string().uuid();
let initializing:Promise<void>|undefined;
function fail(res:Response,status:number,error:string){return res.status(status).json({success:false,error});}
const asyncRoute=(fn:(req:StaffRequest,res:Response,next:NextFunction)=>Promise<unknown>)=>
  (req:StaffRequest,res:Response,next:NextFunction)=>{Promise.resolve(fn(req,res,next)).catch(next);};
function roles(allowed:string[]){
  return (req:StaffRequest,res:Response,next:NextFunction)=>{
    if(!req.staff || !allowed.includes(req.staff.role))return fail(res,403,"Kitchen inventory permission denied");
    next();
  };
}
async function setup(){
  await pool.query(`CREATE TABLE IF NOT EXISTS kitchen_inventory_items (
    id UUID PRIMARY KEY,sku TEXT UNIQUE NOT NULL,name TEXT NOT NULL,category TEXT NOT NULL,
    unit TEXT NOT NULL,reorder_level NUMERIC(14,3) NOT NULL DEFAULT 0 CHECK(reorder_level>=0),
    active BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS kitchen_inventory_batches (
    id UUID PRIMARY KEY,item_id UUID NOT NULL REFERENCES kitchen_inventory_items(id),
    supplier TEXT NOT NULL,batch_number TEXT NOT NULL,expiry_date DATE,
    quantity_received NUMERIC(14,3) NOT NULL CHECK(quantity_received>0),
    quantity_available NUMERIC(14,3) NOT NULL CHECK(quantity_available>=0),
    status TEXT NOT NULL DEFAULT 'quarantine' CHECK(status IN ('quarantine','released','rejected','exhausted')),
    received_by INTEGER NOT NULL,verified_by INTEGER,verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS kitchen_inventory_events (
    id BIGSERIAL PRIMARY KEY,item_id UUID NOT NULL REFERENCES kitchen_inventory_items(id),
    batch_id UUID REFERENCES kitchen_inventory_batches(id),action TEXT NOT NULL,
    quantity NUMERIC(14,3),note TEXT NOT NULL DEFAULT '',actor_staff_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query("CREATE INDEX IF NOT EXISTS kitchen_inventory_batch_item_idx ON kitchen_inventory_batches(item_id,status,expiry_date)");
  await pool.query("CREATE INDEX IF NOT EXISTS kitchen_inventory_event_date_idx ON kitchen_inventory_events(created_at DESC)");
}
function ensure(){if(!initializing)initializing=setup().catch(e=>{initializing=undefined;throw e;});return initializing;}
router.get("/overview",roles(READERS),asyncRoute(async(_req,res)=>{
  await ensure();
  const items=(await pool.query(`SELECT i.id,i.sku,i.name,i.category,i.unit,i.active,
    i.reorder_level::float AS "reorderLevel",
    COALESCE(SUM(CASE WHEN b.status='released' AND (b.expiry_date IS NULL OR b.expiry_date>CURRENT_DATE)
      THEN b.quantity_available ELSE 0 END),0)::float AS "availableQty",
    COALESCE(SUM(CASE WHEN b.status='quarantine' THEN b.quantity_available ELSE 0 END),0)::float AS "quarantinedQty",
    COUNT(b.id) FILTER(WHERE b.status='released' AND b.quantity_available>0 AND
      b.expiry_date IS NOT NULL AND b.expiry_date<=CURRENT_DATE+INTERVAL '7 days')::integer AS "expiringSoonBatches"
    FROM kitchen_inventory_items i LEFT JOIN kitchen_inventory_batches b ON b.item_id=i.id
    GROUP BY i.id ORDER BY i.name`)).rows;
  return res.json({success:true,items:items.map(i=>({...i,
    lowStock:i.active && i.availableQty<=i.reorderLevel}))});
}));
router.get("/batches",roles(READERS),asyncRoute(async(req,res)=>{
  await ensure();
  const q=req.query.itemId;
  if(q!==undefined && (typeof q!=="string" || !uuidSchema.safeParse(q).success))return fail(res,400,"Invalid item identifier");
  const rows=(await pool.query(`SELECT b.id,b.item_id AS "itemId",i.name AS "itemName",i.unit,
    b.supplier,b.batch_number AS "batchNumber",b.expiry_date AS "expiryDate",b.status,
    b.quantity_received::float AS "receivedQty",b.quantity_available::float AS "availableQty",
    b.received_by AS "receivedBy",b.verified_by AS "verifiedBy",b.created_at AS "receivedAt"
    FROM kitchen_inventory_batches b JOIN kitchen_inventory_items i ON i.id=b.item_id
    WHERE ($1::uuid IS NULL OR b.item_id=$1::uuid)
    ORDER BY b.created_at DESC LIMIT 200`,[q||null])).rows;
  return res.json({success:true,batches:rows});
}));
router.get("/events",roles(READERS),asyncRoute(async(_req,res)=>{
  await ensure();
  const events=(await pool.query(`SELECT e.id,e.action,e.quantity::float AS quantity,
    e.note,e.actor_staff_id AS "actorStaffId",e.created_at AS "createdAt",i.name AS "itemName",
    b.batch_number AS "batchNumber"
    FROM kitchen_inventory_events e JOIN kitchen_inventory_items i ON i.id=e.item_id
    LEFT JOIN kitchen_inventory_batches b ON b.id=e.batch_id
    ORDER BY e.id DESC LIMIT 150`)).rows;
  return res.json({success:true,events});
}));
router.post("/items",roles(STOCK),asyncRoute(async(req,res)=>{
  await ensure();
  const parsed=itemSchema.safeParse(req.body);
  if(!parsed.success)return fail(res,400,"Enter valid SKU, name, category, unit and reorder level");
  const v=parsed.data,id=crypto.randomUUID();
  try{
    const result=await pool.query(`INSERT INTO kitchen_inventory_items
      (id,sku,name,category,unit,reorder_level) VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
      [id,v.sku.toUpperCase(),v.name,v.category,v.unit,v.reorderLevel]);
    await pool.query(`INSERT INTO kitchen_inventory_events(item_id,action,note,actor_staff_id)
      VALUES($1,'item_created',$2,$3)`,[id,"New stock item registered",(req.staff!).id]);
    return res.status(201).json({success:true,id:result.rows[0].id});
  }catch(e:any){
    if(e?.code==="23505")return fail(res,409,"This inventory SKU already exists");
    throw e;
  }
}));
router.post("/receipts",roles(STOCK),asyncRoute(async(req,res)=>{
  await ensure();
  const parsed=receiptSchema.safeParse(req.body);
  if(!parsed.success)return fail(res,400,"Provide valid stock receipt and supplier details");
  const v=parsed.data;
  // Reject invalid or past expiry dates. Do not allow receipt directly into available stock.
  if(v.expiryDate && (!Number.isFinite(Date.parse(v.expiryDate))||v.expiryDate<=new Date().toISOString().slice(0,10)))
    return fail(res,400,"Expiry date must be a valid future date");
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const i=(await client.query("SELECT id FROM kitchen_inventory_items WHERE id=$1 AND active=TRUE",[v.itemId])).rows[0];
    if(!i){await client.query("ROLLBACK");return fail(res,404,"Active inventory item not found");}
    const id=crypto.randomUUID();
    await client.query(`INSERT INTO kitchen_inventory_batches(id,item_id,supplier,batch_number,expiry_date,
      quantity_received,quantity_available,received_by)
      VALUES($1,$2,$3,$4,$5,$6,$6,$7)`,
      [id,v.itemId,v.supplier,v.batchNumber,v.expiryDate||null,v.quantity,req.staff!.id]);
    await client.query(`INSERT INTO kitchen_inventory_events(item_id,batch_id,action,quantity,note,actor_staff_id)
      VALUES($1,$2,'received_quarantine',$3,$4,$5)`,
      [v.itemId,id,v.quantity,v.note||"Awaiting food-safety release",req.staff!.id]);
    await client.query("COMMIT");
    return res.status(201).json({success:true,id,status:"quarantine"});
  }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
}));
router.patch("/batches/:id/decision",roles(approvers),asyncRoute(async(req,res)=>{
  await ensure();
  if(!uuidSchema.safeParse(req.params.id).success)return fail(res,400,"Invalid batch ID");
  const p=decisionSchema.safeParse(req.body);
  if(!p.success)return fail(res,400,"Choose release or reject");
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const b=(await client.query("SELECT * FROM kitchen_inventory_batches WHERE id=$1 FOR UPDATE",[req.params.id])).rows[0];
    if(!b||b.status!=="quarantine"){await client.query("ROLLBACK");return fail(res,409,"Batch is not awaiting inspection");}
    if(b.received_by===req.staff!.id){await client.query("ROLLBACK");return fail(res,403,"Receiver must not approve their own batch");}
    if(p.data.decision==="release"&&b.expiry_date&&new Date(b.expiry_date).toISOString().slice(0,10)<=new Date().toISOString().slice(0,10)){
      await client.query("ROLLBACK");return fail(res,409,"Expired inventory cannot be released");
    }
    const status=p.data.decision==="release"?"released":"rejected";
    await client.query(`UPDATE kitchen_inventory_batches SET status=$2,verified_by=$3,verified_at=NOW() WHERE id=$1`,
      [b.id,status,req.staff!.id]);
    await client.query(`INSERT INTO kitchen_inventory_events(item_id,batch_id,action,quantity,note,actor_staff_id)
      VALUES($1,$2,$3,$4,$5,$6)`,[b.item_id,b.id,status,b.quantity_available,p.data.note||"Batch inspection completed",req.staff!.id]);
    await client.query("COMMIT");
    return res.json({success:true,id:b.id,status});
  }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
}));
router.post("/movements/:action",roles([...issueRoles,"food_safety_supervisor"]),asyncRoute(async(req,res)=>{
  await ensure();
  const action=req.params.action;
  if(action!=="issue"&&action!=="waste")return fail(res,400,"Invalid movement action");
  if(action==="issue"&&!issueRoles.includes(req.staff!.role))return fail(res,403,"Only authorized kitchen or inventory staff may issue stock");
  const p=movementSchema.safeParse(req.body);
  if(!p.success)return fail(res,400,"Provide batch ID, quantity and documented reason");
  // Waste approval must be undertaken by a manager or food-safety supervisor.
  if(action==="waste" && ![...MANAGERS,"food_safety_supervisor"].includes(req.staff!.role))
    return fail(res,403,"Waste write-off requires management or food-safety approval");
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const b=(await client.query("SELECT * FROM kitchen_inventory_batches WHERE id=$1 FOR UPDATE",[p.data.batchId])).rows[0];
    if(!b||b.status!=="released"){await client.query("ROLLBACK");return fail(res,409,"Batch is not available for issue");}
    if(b.expiry_date&&new Date(b.expiry_date).toISOString().slice(0,10)<=new Date().toISOString().slice(0,10)){
      await client.query("ROLLBACK");return fail(res,409,"Expired batch cannot be issued");
    }
    if(Number(b.quantity_available)<p.data.quantity){await client.query("ROLLBACK");return fail(res,409,"Insufficient stock in selected batch");}
    await client.query(`UPDATE kitchen_inventory_batches SET
      quantity_available=quantity_available-$2::numeric,
      status=CASE WHEN quantity_available-$2::numeric=0 THEN 'exhausted' ELSE 'released' END
      WHERE id=$1`,[b.id,p.data.quantity]);
    await client.query(`INSERT INTO kitchen_inventory_events(item_id,batch_id,action,quantity,note,actor_staff_id)
      VALUES($1,$2,$3,$4,$5,$6)`,
      [b.item_id,b.id,action,p.data.quantity,p.data.note,req.staff!.id]);
    await client.query("COMMIT");
    return res.json({success:true,id:b.id,action,quantity:p.data.quantity});
  }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
}));
export default router;
