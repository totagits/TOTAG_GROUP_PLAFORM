import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import kitchenRoutes from "../server/kitchenRoutes";
import { pool } from "../server/db";

test("TOTAG Kitchen PostgreSQL public order/quote/tracking security smoke", async () => {
  assert.ok(process.env.DATABASE_URL, "A disposable test PostgreSQL database is required");
  const app=express();
  app.use(express.json());
  app.use("/api/kitchen", kitchenRoutes);
  const server=app.listen(0,"127.0.0.1");
  await new Promise<void>(resolve=>server.once("listening",resolve));
  const info=server.address();
  assert.ok(info && typeof info!=="string");
  const base="http://127.0.0.1:"+info.port+"/api/kitchen";
  async function request(url:string, init?:RequestInit){
    const res=await fetch(base+url,{...init,headers:{"Content-Type":"application/json",...init?.headers}});
    const body:any=await res.json();
    return {status:res.status,body};
  }
  try{
    const catalog=await request("/catalog");
    assert.equal(catalog.status,200);
    assert.equal(catalog.body.products.find((p:any)=>p.id==="fried-rice-tray").variants[0].priceCents,3500);
    assert.equal(catalog.body.payments.mtn,false);
    const order=await request("/orders",{method:"POST",body:JSON.stringify({
      customerName:"Test Buyer",phone:"231777000000",fulfillment:"pickup",
      items:[{productId:"fried-rice-tray",variantId:"small",quantity:2}]
    })});
    assert.equal(order.status,201,JSON.stringify(order.body));
    assert.equal(order.body.order.subtotalCents,7000);
    assert.equal(order.body.order.totalCents,7000);
    assert.equal(order.body.order.status,"awaiting_payment");
    assert.match(order.body.trackingToken,/^[a-f0-9]{64}$/);
    const id=order.body.id, token=order.body.trackingToken;
    const valid=await request("/orders/"+id+"/track?token="+token);
    assert.equal(valid.status,200);
    assert.equal(valid.body.order.totalCents,7000);
    const wrong=await request("/orders/"+id+"/track?token="+"0".repeat(64));
    assert.equal(wrong.status,404);
    const unpaid=await request("/orders/"+id+"/pay",{method:"POST",body:JSON.stringify({token,method:"mtn"})});
    assert.equal(unpaid.status,503);
    const still=await request("/orders/"+id+"/track?token="+token);
    assert.equal(still.body.order.paymentStatus,"unpaid");
    const anonymous=await request("/staff/orders");
    assert.ok([401,503].includes(anonymous.status));
    const delivery=await request("/orders",{method:"POST",body:JSON.stringify({
      customerName:"Test Delivery",phone:"231777000001",address:"Test Street, Paynesville",
      fulfillment:"delivery",items:[{productId:"grill-chicken",variantId:"regular",quantity:1,
        sides:["Plantain","Cuscus","Vegetable Salad"]}]
    })});
    assert.equal(delivery.status,201);
    assert.equal(delivery.body.order.status,"awaiting_quote");
    assert.equal(delivery.body.order.totalCents,null);
    // Pending delivery quotes must not be charged, even with a valid customer token.
    const prematurePayment=await request("/orders/"+delivery.body.id+"/pay",{method:"POST",body:JSON.stringify({
      token:delivery.body.trackingToken,method:"mtn"
    })});
    assert.equal(prematurePayment.status,409,"Payment is blocked until a manager confirms the delivery fee");
    // Future PWA customers and riders must never access internal order queues without staff authorization.
    const privateOrder=await request("/orders/"+delivery.body.id+"/track");
    assert.equal(privateOrder.status,404,"Public tracking requires the secret customer token");
    for(const [action,method,body] of [
      ["quote","PATCH",{deliveryFeeCents:0}],
      ["status","PATCH",{status:"ready"}],
      ["driver","PATCH",{name:"Unauthorised Rider",phone:"231777000004"}],
      ["reconcile","POST",{}]
    ] as const){
      const route=action==="reconcile"?"/staff/orders/"+delivery.body.id+"/reconcile":"/staff/orders/"+delivery.body.id+"/"+action;
      const response=await request(route,{method,body:JSON.stringify(body)});
      assert.equal(response.status,401,action+" must reject unauthenticated access");
    }
    const juice=await request("/orders",{method:"POST",body:JSON.stringify({
      customerName:"Test Juice",phone:"231777000002",fulfillment:"pickup",
      items:[{productId:"juice-watermelon",variantId:"500ml",quantity:1}]
    })});
    assert.equal(juice.status,201);
    assert.equal(juice.body.order.status,"awaiting_payment");
    assert.equal(juice.body.order.subtotalCents,500);
    assert.equal(juice.body.order.totalCents,500,"Published 500ml juice is US$5.00 and requires no quote for pickup");
    const forged=await request("/orders",{method:"POST",body:JSON.stringify({
      customerName:"Malicious Tester",phone:"231777000003",fulfillment:"pickup",
      items:[{productId:"snail",variantId:"regular",quantity:1,unitPriceCents:1}]
    })});
    assert.equal(forged.status,201);
    assert.equal(forged.body.order.totalCents,1500,"Server must ignore client-supplied prices");
    const invalidSides=await request("/orders",{method:"POST",body:JSON.stringify({
      customerName:"Invalid Sides",phone:"231777000004",fulfillment:"pickup",
      items:[{productId:"snail",variantId:"regular",quantity:1,sides:["Fries","Plantain","Vegetable Salad"]}]
    })});
    assert.equal(invalidSides.status,400);
  } finally {
    await new Promise<void>((resolve,reject)=>server.close(err=>err?reject(err):resolve()));
    await pool.end();
  }
});
