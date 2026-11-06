import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import inventoryRoutes from "../server/kitchenInventoryRoutes";
import { pool } from "../server/db";

test("TOTAG Kitchen inventory role protection, quarantine, independent release, stock ledger",async()=>{
  assert.ok(process.env.DATABASE_URL,"Tests require disposable PostgreSQL");
  const app=express();
  app.use(express.json());
  // Test-only identity injector: production uses signed Catering staff JWT middleware instead.
  app.use("/test-stock",(req,res,next)=>{
    (req as any).staff={id:Number(req.header("X-Test-Staff-Id")||1),role:req.header("X-Test-Role")||"unauthorized"};
    next();
  },inventoryRoutes);
  const server=app.listen(0,"127.0.0.1");
  await new Promise<void>(resolve=>server.once("listening",resolve));
  const address=server.address();
  assert.ok(address && typeof address!=="string");
  const base="http://127.0.0.1:"+address.port+"/test-stock";
  async function call(path:string,role:string,staffId:number,method="GET",body?:unknown){
    const response=await fetch(base+path,{
      method,headers:{"Content-Type":"application/json","X-Test-Role":role,"X-Test-Staff-Id":String(staffId)},
      ...(body===undefined?{}:{body:JSON.stringify(body)})
    });
    return {status:response.status,data:await response.json()};
  }
  try{
    assert.equal((await call("/overview","delivery_rider",2)).status,403);
    const item=await call("/items","inventory_manager",11,"POST",{
      sku:"TEST-STOCK-001",name:"Test Kitchen Ingredient",category:"ingredient",unit:"kg",reorderLevel:2
    });
    assert.equal(item.status,201,JSON.stringify(item.data));
    assert.equal((await call("/items","head_chef",12,"POST",{
      sku:"UNAUTHORIZED-001",name:"Disallowed",category:"ingredient",unit:"kg",reorderLevel:2
    })).status,403);
    const receipt=await call("/receipts","inventory_manager",11,"POST",{
      itemId:item.data.id,supplier:"Verified Test Supplier",batchNumber:"TEST-BATCH-001",quantity:5,note:"Test delivery"
    });
    assert.equal(receipt.status,201,JSON.stringify(receipt.data));
    assert.equal(receipt.data.status,"quarantine");
    const before=(await call("/overview","head_chef",13)).data.items.find((x:any)=>x.id===item.data.id);
    assert.equal(before.availableQty,0,"Quarantined inventory must not be usable");
    assert.equal(before.quarantinedQty,5);
    assert.equal((await call("/batches/"+receipt.data.id+"/decision","account_manager",11,"PATCH",{
      decision:"release",note:"Self approval attempt"
    })).status,403,"A receiver cannot approve their own inventory batch");
    assert.equal((await call("/movements/issue","head_chef",13,"POST",{
      batchId:receipt.data.id,quantity:1,note:"Must not issue before QA"
    })).status,409);
    const release=await call("/batches/"+receipt.data.id+"/decision","food_safety_supervisor",20,"PATCH",{
      decision:"release",note:"Labels, temperature and seals inspected"
    });
    assert.equal(release.status,200,JSON.stringify(release.data));
    assert.equal((await call("/movements/issue","food_safety_supervisor",20,"POST",{
      batchId:receipt.data.id,quantity:1,note:"Not kitchen issue role"
    })).status,403);
    const issue=await call("/movements/issue","head_chef",13,"POST",{
      batchId:receipt.data.id,quantity:2,note:"Prepared test menu production"
    });
    assert.equal(issue.status,200,JSON.stringify(issue.data));
    assert.equal((await call("/movements/issue","head_chef",13,"POST",{
      batchId:receipt.data.id,quantity:8,note:"Test over issue"
    })).status,409);
    assert.equal((await call("/movements/waste","inventory_manager",11,"POST",{
      batchId:receipt.data.id,quantity:1,note:"Test writeoff without approval"
    })).status,403);
    assert.equal((await call("/movements/waste","food_safety_supervisor",20,"POST",{
      batchId:receipt.data.id,quantity:1,note:"Authorized food safety spoilage"
    })).status,200);
    const after=(await call("/overview","inventory_manager",11)).data.items.find((x:any)=>x.id===item.data.id);
    assert.equal(after.availableQty,2);
    assert.equal(after.lowStock,true);
    const events=(await call("/events","account_manager",21)).data.events;
    assert.ok(events.some((e:any)=>e.action==="received_quarantine"));
    assert.ok(events.some((e:any)=>e.action==="released"));
    assert.ok(events.some((e:any)=>e.action==="issue"));
    assert.ok(events.some((e:any)=>e.action==="waste"));
    assert.equal((await call("/overview","unauthorized",100)).status,403);
  } finally {
    await new Promise<void>((resolve,reject)=>server.close(err=>err?reject(err):resolve()));
    await pool.end();
  }
});
