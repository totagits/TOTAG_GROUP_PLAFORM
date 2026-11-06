import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { getApiUrl } from "@/lib/config";
import { kitchenMoney } from "@shared/kitchenCatalog";
import { ChefHat, Truck, RefreshCw, ClipboardCheck, DollarSign, Users, LogOut } from "lucide-react";

type Item={productId:string;name:string;variantId:string;variant:string;quantity:number;unitPriceCents:number|null;sides:string[]};
type Order={id:string;customer_name:string;phone:string;email:string|null;delivery_address:string|null;notes:string|null;
  fulfillment:string;items:Item[];subtotal_cents:number|null;delivery_fee_cents:number|null;total_cents:number|null;
  status:string;payment_status:string;payment_method:string|null;driver_name:string|null;driver_phone:string|null;created_at:string};
const NEXT:Record<string,string>={paid:"accepted",accepted:"preparing",preparing:"ready",ready:"dispatched",dispatched:"delivered"};
const titleStyle="font-bold text-green-950 text-2xl";
async function secured(path:string,init?:RequestInit){
  const token=localStorage.getItem("catering_token");
  if(!token)throw new Error("Sign in through the Catering Operations portal");
  const res=await fetch(getApiUrl("/api/kitchen"+path),{...init,headers:{"Content-Type":"application/json","Authorization":"Bearer "+token,...init?.headers}});
  const data=await res.json().catch(()=>({success:false,error:"Invalid server response"}));
  if(!res.ok||!data.success)throw new Error(data.error||"Operation failed");
  return data;
}
function USD(v:number|null){return v===null?"Quote pending":kitchenMoney(v);}
export default function KitchenOperations(){
  const [,navigate]=useLocation();
  const [orders,setOrders]=useState<Order[]>([]);
  const [selected,setSelected]=useState<string|null>(null);
  const [filter,setFilter]=useState("all");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const [fees,setFees]=useState<Record<string,string>>({});
  const [juices,setJuices]=useState<Record<string,string>>({});
  const [drivers,setDrivers]=useState<Record<string,string>>({});
  const [tab,setTab]=useState("orders");
  const active=orders.find(o=>o.id===selected);
  const visible=orders.filter(o=>filter==="all"||o.status===filter);
  const gross=orders.filter(o=>o.payment_status==="paid").reduce((n,o)=>n+(o.total_cents||0),0);
  const summary=useMemo(()=>({
    pending:orders.filter(o=>o.status==="awaiting_quote"||o.status==="awaiting_payment").length,
    kitchen:orders.filter(o=>["paid","accepted","preparing"].includes(o.status)).length,
    dispatch:orders.filter(o=>["ready","dispatched"].includes(o.status)).length,
    delivered:orders.filter(o=>o.status==="delivered").length
  }),[orders]);
  async function reload(){
    try{const data=await secured("/staff/orders");setOrders(data.orders);setMessage("");}
    catch(e:any){setMessage(e.message);if(/sign in|401|session|token/i.test(e.message))navigate("/catering/ops/login");}
  }
  useEffect(()=>{reload();const t=setInterval(reload,20000);return()=>clearInterval(t);},[]);
  async function run(path:string,body:any){
    setBusy(true);setMessage("");
    try{await secured(path,{method:"PATCH",body:JSON.stringify(body)});await reload();setMessage("Saved successfully.");}
    catch(e:any){setMessage(e.message);}finally{setBusy(false);}
  }
  async function reconcile(orderId:string){
    setBusy(true);try{await secured("/staff/orders/"+orderId+"/reconcile",{method:"POST"});await reload();setMessage("Payment status checked with provider.");}
    catch(e:any){setMessage(e.message);}finally{setBusy(false);}
  }
  function quote(order:Order){
    const juicePrices:Record<string,number>={};
    for(const item of order.items){
      const k=item.productId+":"+item.variantId;
      if(item.unitPriceCents===null&&juices[k]!==undefined&&juices[k].trim()!=="") juicePrices[k]=Math.round(Number(juices[k])*100);
    }
    const body:{deliveryFeeCents?:number;juicePrices:Record<string,number>}={juicePrices};
    if(order.fulfillment==="delivery"&&fees[order.id]!==undefined&&fees[order.id].trim()!=="")body.deliveryFeeCents=Math.round(Number(fees[order.id])*100);
    run("/staff/orders/"+order.id+"/quote",body);
  }
  function logout(){localStorage.removeItem("catering_token");localStorage.removeItem("catering_user");navigate("/catering/ops/login");}
  return <div className="min-h-screen bg-[#f8faf5] text-slate-900">
    <header className="bg-green-950 text-white px-5 py-5">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3"><div className="flex items-center gap-3">
        <img src="/images/totag-logo.png" className="h-14 w-14 object-contain bg-white rounded-lg" alt="TOTAG logo"/>
        <div><h1 className="text-2xl font-extrabold">TOTAG Kitchen Operations</h1><p className="text-xs text-green-200">Integrated with TOTAG Catering & Event Planning</p></div></div>
        <div className="flex gap-2"><Link className="px-3 py-2 bg-white/10 rounded-lg" href="/catering/ops/dashboard">Catering ERP</Link>
          <button onClick={reload} className="px-3 py-2 bg-white/10 rounded-lg"><RefreshCw className="inline mr-1" size={16}/> Refresh</button>
          <button onClick={logout} className="px-3 py-2 bg-orange-600 rounded-lg"><LogOut className="inline mr-1" size={16}/> Logout</button></div>
      </div>
    </header>
    <main className="max-w-7xl mx-auto p-4 md:p-7">
      {message&&<p role="status" className="mb-5 rounded-xl bg-yellow-100 text-yellow-950 p-3">{message}</p>}
      <section aria-label="Order-to-delivery process" className="mb-6 rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
        <h2 className="font-bold text-green-950">Kitchen operations workflow</h2>
        <ol className="mt-3 grid gap-2 text-sm md:grid-cols-5">
          {["1. Confirm quote","2. Verify payment","3. Accept order","4. Prepare & mark ready","5. Dispatch or hand over"].map(step=><li key={step} className="rounded-xl bg-green-50 px-3 py-3 font-medium text-green-950">{step}</li>)}
        </ol>
        <p className="mt-2 text-xs text-gray-600">Payment verification is automatic through approved providers. Staff cannot manually mark unpaid orders as paid.</p>
      </section>
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-7">
        {[[ "Quote / Payment",summary.pending],["In Kitchen",summary.kitchen],["Dispatch Queue",summary.dispatch],["Delivered",summary.delivered],["Verified Revenue",kitchenMoney(gross)]].map(([name,value])=>
          <div key={name} className="p-4 bg-white rounded-xl border shadow-sm"><p className="text-xs font-bold text-gray-500">{name}</p><strong className="text-2xl text-green-900">{value}</strong></div>)}
      </section>
      <div className="flex gap-2 mb-5 flex-wrap">{[["orders","All Orders"],["payments","Quotes & Payments"],["kitchen","Kitchen Queue"],["delivery","Delivery Desk"],["reports","Sales Summary"]].map(([id,name])=>
        <button key={id} className={"rounded-full px-4 py-2 text-sm font-bold "+(tab===id?"bg-green-800 text-white":"bg-white border")} onClick={()=>setTab(id)}>{name}</button>)}</div>
      {tab==="reports"?<section className="bg-white border rounded-2xl p-6 space-y-4"><h2 className={titleStyle}>Kitchen sales overview</h2>
        <p>Paid orders: <strong>{orders.filter(o=>o.payment_status==="paid").length}</strong></p>
        <p>Verified order value: <strong>{kitchenMoney(gross)}</strong></p>
        <p>Fulfilled orders: <strong>{summary.delivered}</strong></p>
        <p className="text-sm text-gray-600">Based on the most recent 200 orders. No simulated payments are included. This is an operations snapshot, not a reconciled financial statement.</p>
      </section>:
      <div className="grid lg:grid-cols-[340px_1fr] gap-5">
        <aside className="bg-white rounded-2xl border shadow-sm p-3 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center p-2"><h2 className="font-extrabold">Orders ({visible.length})</h2>
            {tab==="orders"&&<select className="text-sm border rounded p-1" value={filter} onChange={e=>setFilter(e.target.value)}>
              {["all","awaiting_quote","awaiting_payment","paid","accepted","preparing","ready","dispatched","delivered"].map(s=><option key={s} value={s}>{s.replace("_"," ")}</option>)}
            </select>}</div>
          {visible.filter(o=>tab==="payments"?["awaiting_quote","awaiting_payment"].includes(o.status)||o.payment_status==="pending":tab==="kitchen"?["paid","accepted","preparing","ready"].includes(o.status):tab==="delivery"?o.fulfillment==="delivery":true).map(o=>
            <button key={o.id} onClick={()=>setSelected(o.id)} className={"w-full text-left border rounded-xl p-3 mb-2 "+(selected===o.id?"border-green-700 bg-green-50":"border-gray-100 hover:bg-gray-50")}>
              <div className="flex justify-between"><strong className="text-sm">{o.customer_name}</strong><span className="text-xs font-bold text-orange-700">{o.status.replace(/_/g," ")}</span></div>
              <p className="text-xs text-gray-500 mt-1">{new Date(o.created_at).toLocaleString()} · {o.fulfillment}</p>
              <p className="font-bold text-green-900 mt-1">{USD(o.total_cents)}</p>
            </button>)}
        </aside>
        <section className="bg-white rounded-2xl border shadow-sm p-5 md:p-7">
          {!active?<div className="text-center p-10"><ChefHat className="mx-auto text-green-700" size={44}/><h2 className={titleStyle}>Select an order</h2><p>Choose an order from the left to view details and perform your authorized workflow actions.</p></div>:
            <div className="space-y-5">
              <div className="flex flex-wrap justify-between gap-4"><div><p className="text-xs text-gray-600">Order {active.id}</p><h2 className="text-xl font-black">{active.customer_name}</h2>
                <p className="text-sm">{active.phone} · {active.email||"No email"}</p></div>
                <div><p className="font-bold text-orange-700 capitalize">{active.status.replace(/_/g," ")}</p>
                  <p className="text-sm">Payment: {active.payment_status} {active.payment_method&&"("+active.payment_method+")"}</p></div></div>
              <div className="border rounded-xl overflow-hidden"><div className="bg-green-50 px-4 py-2 font-bold">Items for preparation</div>
                <div className="divide-y">{active.items.map((item,i)=><div key={i} className="p-3 text-sm flex justify-between gap-3"><div><b>{item.quantity} × {item.name}</b> · {item.variant}
                  {!!item.sides?.length&&<p className="text-gray-600">Sides: {item.sides.join(", ")}</p>}</div><b>{USD(item.unitPriceCents===null?null:item.unitPriceCents*item.quantity)}</b></div>)}</div>
              </div>
              {active.notes&&<p className="p-3 bg-amber-50 text-sm rounded-xl"><b>Customer notes / allergies:</b> {active.notes}</p>}
              {active.fulfillment==="delivery"&&<p className="p-3 bg-blue-50 rounded-xl"><Truck className="inline" size={16}/> <b>Delivery:</b> {active.delivery_address}</p>}
              <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl text-sm">
                <div>Items <strong className="block">{USD(active.subtotal_cents)}</strong></div>
                <div>Delivery <strong className="block">{USD(active.delivery_fee_cents)}</strong></div>
                <div>Total <strong className="block text-lg">{USD(active.total_cents)}</strong></div></div>
              {active.status==="awaiting_quote"&&<div className="p-4 rounded-xl border border-orange-200 space-y-3">
                <h3 className="font-bold text-green-900">Manager: finalize order quotation</h3>
                {active.items.filter(i=>i.unitPriceCents===null).map((item,i)=>{
                  const key=item.productId+":"+item.variantId;return <label className="block text-sm" key={i}>{item.name} · {item.variant} (USD per unit)
                    <input type="number" min=".01" step=".01" value={juices[key]||""} onChange={e=>setJuices(s=>({...s,[key]:e.target.value}))} className="block w-full border rounded-lg p-2 mt-1" placeholder="Enter approved juice price"/></label>;
                })}
                {active.fulfillment==="delivery"&&<label className="block text-sm">Delivery fee (USD)
                  <input type="number" min="0" step=".01" value={fees[active.id]||""} onChange={e=>setFees(s=>({...s,[active.id]:e.target.value}))} className="block w-full border rounded-lg p-2 mt-1" placeholder="Enter confirmed delivery fee"/></label>}
                <p className="text-xs text-gray-600">The customer receives access to payment only after all food prices and the delivery fee are confirmed. Enter 0 for complimentary delivery.</p>
                <button disabled={busy} onClick={()=>quote(active)} className="bg-green-800 text-white rounded-xl px-4 py-2 font-bold disabled:opacity-40">Save approved quotation</button>
              </div>}
              {active.status==="awaiting_payment"&&<p className="text-sm border border-orange-200 bg-orange-50 p-3 rounded-lg">Awaiting real payment. Do not prepare or dispatch until the payment provider verifies success.</p>}
              {active.payment_status==="pending"&&<button disabled={busy} className="bg-blue-800 text-white p-3 rounded-lg font-bold" onClick={()=>reconcile(active.id)}>Reconcile MTN payment</button>}
              {NEXT[active.status]&&<div className="p-4 border border-green-200 rounded-xl">
                <h3 className="font-bold mb-3"><ClipboardCheck className="inline" size={18}/> Next operational step</h3>
                <button disabled={busy} className="bg-orange-600 text-white px-5 py-3 rounded-xl font-extrabold disabled:opacity-40 capitalize"
                  onClick={()=>run("/staff/orders/"+active.id+"/status",{status:NEXT[active.status]})}>Mark as {NEXT[active.status]}</button>
              </div>}
              {active.fulfillment==="delivery"&&["ready","dispatched"].includes(active.status)&&<div className="border p-4 rounded-xl space-y-2">
                <h3 className="font-bold">Assign delivery rider</h3>
                <input className="border rounded-lg p-2 w-full" placeholder="Rider name" value={drivers[active.id+":name"]||active.driver_name||""} onChange={e=>setDrivers(s=>({...s,[active.id+":name"]:e.target.value}))}/>
                <input className="border rounded-lg p-2 w-full" placeholder="Rider phone" value={drivers[active.id+":phone"]||active.driver_phone||""} onChange={e=>setDrivers(s=>({...s,[active.id+":phone"]:e.target.value}))}/>
                <button disabled={busy} className="border border-green-800 text-green-800 rounded-lg px-4 py-2" onClick={()=>run("/staff/orders/"+active.id+"/driver",{name:drivers[active.id+":name"]||active.driver_name||"",phone:drivers[active.id+":phone"]||active.driver_phone||""})}>Save rider details</button>
              </div>}
            </div>}
        </section>
      </div>}
      <p className="text-xs text-gray-500 mt-7">Kitchen staff must use individual catering credentials. Refunds and cancellations require separate manager-controlled workflows; never mark an order paid manually.</p>
    </main>
  </div>;
}
