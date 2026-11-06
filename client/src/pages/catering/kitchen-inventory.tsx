import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { getApiUrl } from "@/lib/config";
import { Boxes, ClipboardCheck, ClipboardList, AlertTriangle, PackagePlus, RefreshCw, ChefHat } from "lucide-react";

type Item={id:string;sku:string;name:string;category:string;unit:string;active:boolean;reorderLevel:number;availableQty:number;quarantinedQty:number;expiringSoonBatches:number;lowStock:boolean};
type Batch={id:string;itemId:string;itemName:string;unit:string;supplier:string;batchNumber:string;expiryDate:string|null;status:string;receivedQty:number;availableQty:number;receivedBy:number;verifiedBy:number|null;receivedAt:string};
type Event={id:number;itemName:string;batchNumber:string|null;action:string;quantity:number|null;note:string;actorStaffId:number;createdAt:string};
const managerRoles=["account_manager","operations_supervisor"];
const readRoles=[...managerRoles,"inventory_manager","head_chef","food_safety_supervisor","logistics_coordinator"];
const field="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-950 focus:border-green-700 focus:outline-none";
const section="rounded-2xl border border-green-100 bg-white p-5 shadow-sm";
const primary="rounded-xl bg-green-800 px-5 py-3 text-sm font-bold text-white hover:bg-green-900 disabled:opacity-50";
const tabs=[["stock","Stock overview"],["receive","Receive supplies"],["inspect","Quality approval"],["consume","Kitchen issue & waste"],["audit","Audit trail"]] as const;

export default function KitchenInventory(){
  const [,navigate]=useLocation();
  const [items,setItems]=useState<Item[]>([]);
  const [batches,setBatches]=useState<Batch[]>([]);
  const [events,setEvents]=useState<Event[]>([]);
  const [tab,setTab]=useState<string>("stock");
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);
  const [role,setRole]=useState("");
  const [sku,setSku]=useState("");const [name,setName]=useState("");
  const [category,setCategory]=useState("ingredient");const [unit,setUnit]=useState("kg");
  const [reorder,setReorder]=useState("0");
  const [itemId,setItemId]=useState("");
  const [supplier,setSupplier]=useState("");const [batchNumber,setBatchNumber]=useState("");
  const [receivedQty,setReceivedQty]=useState("");const [expiryDate,setExpiryDate]=useState("");
  const [receiveNote,setReceiveNote]=useState("");
  const [batchId,setBatchId]=useState("");const [movementQty,setMovementQty]=useState("");
  const [movementNote,setMovementNote]=useState("");const [movementType,setMovementType]=useState("issue");

  useEffect(()=>{
    try{
      const user=JSON.parse(localStorage.getItem("catering_user")||"null");
      if(user?.role)setRole(user.role);
    }catch{setRole("");}
  },[]);
  const api=useCallback(async(path:string,init?:RequestInit)=>{
    const token=localStorage.getItem("catering_token");
    if(!token)throw new Error("Sign in to TOTAG Kitchen before accessing inventory");
    const response=await fetch(getApiUrl("/api/kitchen/staff/inventory"+path),{
      ...init,headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json",...init?.headers}
    });
    const data=await response.json().catch(()=>({success:false,error:"Invalid server response"}));
    if(!response.ok||!data.success)throw new Error(data.error||"Inventory request failed");
    return data;
  },[]);
  const refresh=useCallback(async()=>{
    setError("");
    try{
      const [stock,lotLog,audit]=await Promise.all([api("/overview"),api("/batches"),api("/events")]);
      setItems(stock.items);setBatches(lotLog.batches);setEvents(audit.events);
    }catch(e){
      setError(e instanceof Error?e.message:"Unable to retrieve stock");
    }
  },[api]);
  useEffect(()=>{refresh();},[refresh]);
  const act=async(path:string,method:"POST"|"PATCH",body:unknown,after?:()=>void)=>{
    setBusy(true);setNotice("");setError("");
    try{
      await api(path,{method,body:JSON.stringify(body)});
      setNotice("Saved with an auditable inventory movement.");
      if(after)after();
      await refresh();
    }catch(e){setError(e instanceof Error?e.message:"Inventory operation failed");}
    finally{setBusy(false);}
  };
  const submitItem=(event:FormEvent)=>{
    event.preventDefault();
    act("/items","POST",{sku,name,category,unit,reorderLevel:Number(reorder)},()=>{
      setSku("");setName("");setReorder("0");
    });
  };
  const submitReceipt=(event:FormEvent)=>{
    event.preventDefault();
    act("/receipts","POST",{itemId,supplier,batchNumber,quantity:Number(receivedQty),expiryDate:expiryDate||null,note:receiveNote},()=>{
      setBatchNumber("");setReceivedQty("");setExpiryDate("");setReceiveNote("");
    });
  };
  const submitMovement=(event:FormEvent)=>{
    event.preventDefault();
    act("/movements/"+movementType,"POST",{batchId,quantity:Number(movementQty),note:movementNote},()=>{
      setMovementQty("");setMovementNote("");
    });
  };
  const canStock=[...managerRoles,"inventory_manager"].includes(role);
  const canApprove=[...managerRoles,"food_safety_supervisor"].includes(role);
  const canIssue=[...managerRoles,"inventory_manager","head_chef"].includes(role);
  const canWaste=canApprove;
  const low=items.filter(item=>item.lowStock);
  const quarantine=batches.filter(b=>b.status==="quarantine");
  const expiring=batches.filter(b=>b.status==="released"&&b.availableQty>0&&b.expiryDate&&new Date(b.expiryDate).getTime()<=Date.now()+7*86400000);
  const availableBatches=batches.filter(b=>b.status==="released"&&b.availableQty>0&&(!b.expiryDate||new Date(b.expiryDate).getTime()>Date.now()));
  const unitsById=Object.fromEntries(items.map(i=>[i.id,i.unit]));
  return <div className="min-h-screen bg-[#f8faf5] text-slate-900">
    <header className="bg-green-950 px-5 py-5 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3"><Boxes size={38} className="text-amber-300"/><div>
          <h1 className="text-2xl font-black">TOTAG Kitchen Inventory</h1>
          <p className="text-xs text-green-200">Ingredients, supplies, batch safety and stock accountability</p>
        </div></div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/catering/kitchen/ops" className="rounded-lg bg-white/10 px-3 py-2">Kitchen orders</Link>
          <Link href="/catering/ops/dashboard" className="rounded-lg bg-white/10 px-3 py-2">Catering staff & ERP</Link>
          <button type="button" onClick={refresh} className="rounded-lg bg-white/10 px-3 py-2"><RefreshCw size={16} className="mr-1 inline"/> Refresh stock</button>
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-7">
      <div className={section}>
        <h2 className="text-lg font-bold text-green-950">Stock-control workflow</h2>
        <ol className="mt-3 grid gap-2 text-sm md:grid-cols-5">
          {["1. Register SKU","2. Receive into quarantine","3. Independent quality approval","4. Issue ingredients to kitchen","5. Audit, count & reorder"].map(t=>
            <li key={t} className="rounded-xl bg-green-50 p-3 font-medium text-green-950">{t}</li>)}
        </ol>
        <p className="mt-3 text-xs text-gray-600">Batches cannot be used before an independent release. Counts represent approved stock only; menu orders do not automatically deduct ingredients until tested recipes and production reservations are implemented.</p>
      </div>
      {error&&<p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">{error}</p>}
      {notice&&<p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">{notice}</p>}
      {role&&(!readRoles.includes(role))&&<p className="rounded-xl bg-yellow-100 p-4 text-yellow-900">Your account role does not have Kitchen inventory access.</p>}
      <section aria-label="Inventory summary" className="grid gap-3 sm:grid-cols-4">
        {[[ "Registered items",items.length ],[ "Low-stock warnings",low.length ],[ "Quarantined batches",quarantine.length ],[ "Batches expiring within 7 days",expiring.length ]].map(([label,value])=>
          <div key={label} className={section}><p className="text-xs font-bold text-gray-600">{label}</p><p className="mt-1 text-2xl font-black text-green-900">{value}</p></div>)}
      </section>
      <nav aria-label="Inventory workspaces" className="flex flex-wrap gap-2">
        {tabs.map(([id,label])=><button key={id} type="button" onClick={()=>setTab(id)}
          className={"rounded-full px-4 py-2 text-sm font-bold "+(tab===id?"bg-green-800 text-white":"border bg-white text-green-950")}>{label}</button>)}
      </nav>

      {tab==="stock"&&<section className={section}>
        <div className="flex items-center gap-2"><ClipboardList className="text-green-900"/><h2 className="text-xl font-bold">Stock register</h2></div>
        {low.length>0&&<p className="my-3 rounded-lg border border-orange-300 bg-orange-50 p-3 text-sm text-orange-900"><AlertTriangle className="mr-2 inline" size={17}/> {low.length} item(s) at or below reorder point. Raise a purchase requisition before stock-out.</p>}
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-green-50 text-green-950"><tr>{["SKU","Item","Type","Available","Quarantine","Reorder at","Status"].map(h=><th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{items.map(i=><tr key={i.id} className="border-b"><td className="p-3 font-mono text-xs">{i.sku}</td><td className="p-3 font-semibold">{i.name}</td><td className="p-3">{i.category}</td><td className="p-3">{i.availableQty} {i.unit}</td><td className="p-3">{i.quarantinedQty} {i.unit}</td><td className="p-3">{i.reorderLevel} {i.unit}</td><td className="p-3 font-bold">{i.lowStock?"Reorder":i.expiringSoonBatches?"Expiry warning":"In stock"}</td></tr>)}</tbody>
        </table></div>
        {items.length===0&&<p className="mt-4 text-sm text-gray-600">No inventory items have been registered. Begin with the approved SKU list; do not add test stock to production.</p>}
        {canStock&&<form onSubmit={submitItem} className="mt-6 grid gap-3 rounded-xl bg-green-50 p-4 md:grid-cols-3">
          <h3 className="font-bold text-green-950 md:col-span-3">Register an ingredient or supply</h3>
          <label className="text-sm">SKU <input className={field} required value={sku} onChange={e=>setSku(e.target.value)} placeholder="SNAIL-RAW-001"/></label>
          <label className="text-sm">Description <input className={field} required value={name} onChange={e=>setName(e.target.value)} placeholder="Raw snail meat"/></label>
          <label className="text-sm">Category <select className={field} value={category} onChange={e=>setCategory(e.target.value)}>{["ingredient","beverage","packaging","cleaning","other"].map(v=><option key={v}>{v}</option>)}</select></label>
          <label className="text-sm">Unit <select className={field} value={unit} onChange={e=>setUnit(e.target.value)}>{["kg","g","l","ml","piece","pack"].map(v=><option key={v}>{v}</option>)}</select></label>
          <label className="text-sm">Reorder level <input className={field} required type="number" min="0" step=".001" value={reorder} onChange={e=>setReorder(e.target.value)}/></label>
          <div className="flex items-end"><button className={primary} disabled={busy||!name.trim()||!sku.trim()}>Register stock item</button></div>
        </form>}
      </section>}

      {tab==="receive"&&<section className={section}>
        <h2 className="flex items-center gap-2 text-xl font-bold"><PackagePlus/> Receive supplier delivery</h2>
        <p className="mt-2 text-sm text-gray-600">Receiving records arrive in quarantine and are unavailable to the kitchen until inspected by someone other than the receiver.</p>
        {canStock?<form onSubmit={submitReceipt} className="mt-5 grid gap-4 md:grid-cols-2">
          <label>Stock item <select required className={field} value={itemId} onChange={e=>setItemId(e.target.value)}><option value="">Select an item</option>{items.filter(i=>i.active).map(i=><option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}</select></label>
          <label>Supplier name <input className={field} required value={supplier} onChange={e=>setSupplier(e.target.value)}/></label>
          <label>Supplier batch / lot number <input className={field} required value={batchNumber} onChange={e=>setBatchNumber(e.target.value)}/></label>
          <label>Quantity (unit from register) <input type="number" min=".001" step=".001" className={field} required value={receivedQty} onChange={e=>setReceivedQty(e.target.value)}/></label>
          <label>Expiry / use-by date <input type="date" className={field} value={expiryDate} onChange={e=>setExpiryDate(e.target.value)}/></label>
          <label>Delivery/condition note <input className={field} value={receiveNote} onChange={e=>setReceiveNote(e.target.value)}/></label>
          <div className="md:col-span-2"><button className={primary} disabled={busy||!itemId}>Record receipt in quarantine</button></div>
        </form>:<p className="mt-5 text-sm text-gray-600">Receiving access is reserved for authorized inventory and management staff.</p>}
      </section>}

      {tab==="inspect"&&<section className={section}>
        <h2 className="flex items-center gap-2 text-xl font-bold"><ClipboardCheck/> Food-safety batch inspection</h2>
        <p className="my-3 text-sm text-gray-600">Check labels, supplier, packaging integrity, temperatures and expiry before releasing. You cannot approve a batch you received yourself.</p>
        {quarantine.length===0&&<p className="text-sm text-gray-600">No batches currently awaiting inspection.</p>}
        <div className="space-y-3">{quarantine.map(b=><article key={b.id} className="rounded-xl border p-4">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold">{b.itemName} — {b.availableQty} {b.unit}</p>
            <p className="text-sm text-gray-600">{b.supplier} · Batch {b.batchNumber} · Expiry {b.expiryDate?String(b.expiryDate).slice(0,10):"Not recorded"}</p></div>
            {canApprove?<div className="flex gap-2"><button disabled={busy} onClick={()=>act("/batches/"+b.id+"/decision","PATCH",{decision:"release",note:"Inspected and approved"})} className={primary}>Release</button><button disabled={busy} onClick={()=>act("/batches/"+b.id+"/decision","PATCH",{decision:"reject",note:"Rejected after food safety inspection"})} className="rounded-xl bg-red-100 px-4 py-2 font-bold text-red-800">Reject</button></div>:<span className="text-xs text-gray-600">Food-safety approver required</span>}
          </div></article>)}</div>
      </section>}

      {tab==="consume"&&<section className={section}>
        <h2 className="flex items-center gap-2 text-xl font-bold"><ChefHat/> Stock issue and waste log</h2>
        <p className="mt-2 text-sm text-gray-600">Only approved, unexpired lots are available. An issue must identify the kitchen production purpose; write-offs require manager or food-safety authorization.</p>
        {canIssue||canWaste?<form onSubmit={submitMovement} className="mt-5 grid gap-4 md:grid-cols-2">
          <label>Movement <select className={field} value={movementType} onChange={e=>setMovementType(e.target.value)}>
            {canIssue&&<option value="issue">Issue to kitchen</option>}{canWaste&&<option value="waste">Approved spoilage / waste</option>}
          </select></label>
          <label>Approved stock batch <select className={field} required value={batchId} onChange={e=>setBatchId(e.target.value)}><option value="">Select available batch</option>{availableBatches.map(b=><option key={b.id} value={b.id}>{b.itemName} — {b.batchNumber} ({b.availableQty} {unitsById[b.itemId]||b.unit})</option>)}</select></label>
          <label>Quantity <input className={field} type="number" min=".001" step=".001" required value={movementQty} onChange={e=>setMovementQty(e.target.value)}/></label>
          <label>Production job / waste explanation <input className={field} required minLength={3} value={movementNote} onChange={e=>setMovementNote(e.target.value)} placeholder="Order or prep batch reference"/></label>
          <div className="md:col-span-2"><button disabled={busy||!batchId||!movementQty} className={primary}>Record auditable movement</button></div>
        </form>:<p className="mt-4 text-gray-600">You have read-only inventory access.</p>}
      </section>}

      {tab==="audit"&&<section className={section}>
        <h2 className="text-xl font-bold">Inventory activity history</h2>
        <p className="mt-2 text-sm text-gray-600">Latest 150 recorded changes, including the acting staff ID and documented note.</p>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[750px] text-left text-sm">
          <thead className="bg-green-50"><tr>{["When","Item","Batch","Action","Quantity","Recorded by","Note"].map(h=><th className="p-3" key={h}>{h}</th>)}</tr></thead>
          <tbody>{events.map(e=><tr key={e.id} className="border-b"><td className="p-3">{new Date(e.createdAt).toLocaleString()}</td><td className="p-3">{e.itemName}</td><td className="p-3">{e.batchNumber||"—"}</td><td className="p-3 font-semibold">{e.action.replaceAll("_"," ")}</td><td className="p-3">{e.quantity??"—"}</td><td className="p-3">#{e.actorStaffId}</td><td className="p-3">{e.note}</td></tr>)}</tbody>
        </table></div>
      </section>}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Next integration stage:</strong> Approved recipes and supplier purchase orders will connect each paid kitchen production batch to ingredient requirements, reserved quantities, procurement approvals and real-time food-cost calculations. These functions are not yet automated; the stock ledger above records only explicit authorized movements.
      </div>
    </main>
  </div>;
}
