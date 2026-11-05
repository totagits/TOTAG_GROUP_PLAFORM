import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getApiUrl } from "@/lib/config";
import { KITCHEN_CATALOG, KITCHEN_SIDES, kitchenMoney, type KitchenProduct } from "@shared/kitchenCatalog";
import { ShoppingBag, Truck, ChefHat, Phone, CreditCard, Search, ArrowRight } from "lucide-react";

type Line = { productId:string; variantId:string; quantity:number; sides:string[] };
const ALL_SIDES = [...KITCHEN_SIDES];
const heading="text-2xl font-extrabold tracking-tight text-green-950";
function cash(n:number|null|undefined){return n===null || n===undefined?"Pending quote":kitchenMoney(n);}
async function api(path:string,init?:RequestInit){
  const r=await fetch(getApiUrl("/api/kitchen"+path),{...init,headers:{"Content-Type":"application/json",...init?.headers}});
  const data=await r.json().catch(()=>({success:false,error:"Service returned an unexpected response"}));
  if(!r.ok||!data.success)throw new Error(data.error||"Kitchen service unavailable");
  return data;
}
function ItemCard({item,onAdd,displayPrice}:{item:KitchenProduct;onAdd:(v:Line)=>void;displayPrice:(cents:number|null)=>string}){
  const [variant,setVariant]=useState(item.variants[0].id);
  const [quantity,setQuantity]=useState(1);
  const [sides,setSides]=useState<string[]>(["Plantain","Cuscus","Vegetable Salad"]);
  const selected=item.variants.find(v=>v.id===variant)!;
  const toggleSide=(name:string)=>{
    const group=name==="Plantain"||name==="Fries"?0:name==="Cuscus"||name==="Ajika"?1:2;
    setSides(prev=>[...prev.filter(s=> (s==="Plantain"||s==="Fries"?0:s==="Cuscus"||s==="Ajika"?1:2)!==group),name]);
  };
  return <article className="rounded-2xl overflow-hidden border border-orange-100 bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="h-32 bg-gradient-to-br from-green-50 via-amber-50 to-orange-100 flex items-center justify-center relative">
      <span className="text-6xl" aria-hidden>{item.emoji}</span>
      <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-green-800">{item.category==="juice"?"Fresh Juice":item.category==="tray"?"Party Tray":"Hot Meal"}</span>
    </div>
    <div className="p-4 space-y-3">
      <div><h3 className="text-lg font-bold text-green-950">{item.name}</h3><p className="text-sm text-gray-600">{item.description}</p></div>
      <label className="block text-sm font-semibold text-gray-800">Size or choice
        <select className="mt-1 w-full rounded-xl border border-gray-300 p-2.5" value={variant} onChange={e=>setVariant(e.target.value)}>
          {item.variants.map(v=><option value={v.id} key={v.id}>{v.label} — {displayPrice(v.priceCents)}</option>)}
        </select>
      </label>
      {item.sidesEligible && <details className="rounded-xl bg-orange-50 p-3 text-sm">
        <summary className="font-bold cursor-pointer">Choose your 3 sides</summary>
        <p className="text-gray-600 my-2">One from each group. No additional price is listed.</p>
        {([["Plantain","Fries"],["Cuscus","Ajika"],["Vegetable Salad"]] as string[][]).map((group,i)=>
          <div key={i} className="flex gap-2 flex-wrap mb-2">{group.map(side=><label key={side} className="flex items-center gap-1">
            <input type="checkbox" checked={sides.includes(side)} onChange={()=>toggleSide(side)}/>{side}</label>)}</div>)}
      </details>}
      <div className="flex items-center gap-2 justify-between">
        <strong className="text-lg text-orange-600">{displayPrice(selected.priceCents)}</strong>
        <label className="text-sm">Qty <input type="number" min="1" max="50" value={quantity} onChange={e=>setQuantity(Math.min(50,Math.max(1,Number(e.target.value)||1)))} className="border rounded-lg p-2 w-16 ml-1"/></label>
      </div>
      <button onClick={()=>onAdd({productId:item.id,variantId:variant,quantity,sides:item.sidesEligible?sides:[]})} className="w-full bg-green-800 text-white rounded-xl p-3 font-bold hover:bg-green-700">{selected.priceCents===null?"Add for quotation":"Add to order"}</button>
    </div>
  </article>;
}
export default function KitchenPage(){
  const [cart,setCart]=useState<Line[]>([]);
  const [currency,setCurrency]=useState<"USD"|"LRD">("USD");
  const [cbl,setCbl]=useState<{date:string;buying:number;selling:number;sourceUrl:string}|null>(null);
  const [fxError,setFxError]=useState("");
  useEffect(()=>{let active=true;
    api("/fx").then(result=>{if(active){setCbl(result.cbl);setFxError("");}}).catch(()=>{
      if(active){setCbl(null);setFxError("CBL rate could not be verified: LRD display and checkout unavailable.");}
    });
    return ()=>{active=false};
  },[]);
  const displayPrice=(cents:number|null):string=>{
    if(cents===null)return "Quote required";
    if(currency==="LRD" && cbl) return "L$"+(Math.round(cents*Math.round(cbl.selling*10000)/10000)/100).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
    return "US"+kitchenMoney(cents);
  };
  const [filter,setFilter]=useState<"all"|"meal"|"tray"|"juice">("all");
  const [fulfillment,setFulfillment]=useState<"pickup"|"delivery">("pickup");
  const [name,setName]=useState("");const [phone,setPhone]=useState("");const [email,setEmail]=useState("");
  const [address,setAddress]=useState("");const [notes,setNotes]=useState("");
  const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
  const [,navigate]=useLocation();
  const lines=useMemo(()=>cart.map(item=>{
    const product=KITCHEN_CATALOG.find(p=>p.id===item.productId)!;
    const variant=product.variants.find(v=>v.id===item.variantId)!;
    return {item,product,variant};
  }),[cart]);
  const subtotal=lines.reduce((total,x)=>total+(x.variant.priceCents??0)*x.item.quantity,0);
  const hasQuote=lines.some(x=>x.variant.priceCents===null);
  const add=(line:Line)=>{setCart(current=>[...current,line]);setMessage(line.productId.startsWith("juice")?"Juice added for a price quotation.":"Added to your order.");};
  async function submit(e:React.FormEvent){
    e.preventDefault();setMessage("");setBusy(true);
    try{
      if(!cart.length)throw new Error("Add at least one item before checkout.");
      const result=await api("/orders",{method:"POST",body:JSON.stringify({customerName:name,phone,email,address,notes,fulfillment,items:cart})});
      sessionStorage.setItem("totag_kitchen_order",JSON.stringify({id:result.id,token:result.trackingToken}));
      navigate("/catering/kitchen/track");
    }catch(e:any){setMessage(e.message);}finally{setBusy(false);}
  }
  return <div className="min-h-screen bg-[#fffaf0] text-slate-900"><Header/>
    <section className="bg-gradient-to-r from-green-950 via-green-800 to-green-700 text-white py-12 px-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
        <div><img src="/images/totag-logo.png" alt="TOTAG Group logo" className="h-20 w-20 object-contain bg-white rounded-xl p-2 mb-4"/>
          <p className="text-orange-300 uppercase text-xs tracking-[.28em] font-bold">TOTAG Catering & Event Planning</p>
          <h1 className="text-4xl md:text-6xl font-black my-3">TOTAG <span className="text-orange-400">Kitchen</span></h1>
          <p className="max-w-xl text-green-50">Order freshly prepared meals, party trays and natural juices. Arrange pickup or request a delivery quote.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/catering/kitchen/track" className="rounded-full bg-white text-green-900 px-5 py-3 font-bold inline-flex gap-2"><Search size={18}/> Track an order</Link>
          <Link href="/catering/ops/login" className="rounded-full border border-white/50 px-5 py-3 text-center text-white">Staff sign-in</Link>
        </div>
      </div>
    </section>
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-5 rounded-2xl bg-white p-4 border border-green-100 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div><strong className="text-green-900">Choose display currency</strong>
          <p className="text-xs text-gray-600">Base menu prices are USD. All LRD equivalents use CBL's published selling rate.</p></div>
        <div className="flex gap-2"><button onClick={()=>setCurrency("USD")} className={"px-4 py-2 rounded-lg font-bold "+(currency==="USD"?"bg-green-800 text-white":"border bg-white")}>US Dollars (USD)</button>
          <button disabled={!cbl} onClick={()=>setCurrency("LRD")} className={"px-4 py-2 rounded-lg font-bold disabled:opacity-40 "+(currency==="LRD"?"bg-green-800 text-white":"border bg-white")}>Liberian Dollars (LRD)</button></div>
      </div>
      {cbl?<p className="mb-5 text-sm text-green-800">CBL official buying: L$ {cbl.buying.toFixed(4)} / US$1 · selling: L$ {cbl.selling.toFixed(4)} / US$1 (used for pricing) · published {cbl.date}. <a href={cbl.sourceUrl} className="underline" target="_blank" rel="noopener noreferrer">Verify source</a>. Converted prices are indicative until checkout.</p>
        :<p className="mb-5 text-sm text-amber-800">{fxError||"Checking official Central Bank of Liberia rates…"} USD ordering remains available; LRD quotations require verified CBL rates.</p>}
      <div className="flex gap-2 flex-wrap mb-8">
        {([["all","All menu"],["meal","Meals & Platters"],["tray","Party Trays"],["juice","Fresh Juices"]] as const).map(([id,label])=>
          <button key={id} onClick={()=>setFilter(id)} className={"px-4 py-2 rounded-full text-sm font-bold "+(filter===id?"bg-green-800 text-white":"bg-white border text-green-800")}>{label}</button>)}
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">{KITCHEN_CATALOG.filter(p=>filter==="all"||p.category===filter).map(p=><ItemCard key={p.id} item={p} onAdd={add} displayPrice={displayPrice}/>)}</div>
      <p className="mt-5 text-sm text-gray-600">Bread is available. Juice prices vary by 500ml, 1L and gallon; prices are confirmed before payment. Fresh food images may be added by TOTAG for each dish.</p>
      <section id="checkout" className="mt-12 bg-white rounded-3xl border shadow-md p-5 md:p-8">
        <h2 className={heading}><ShoppingBag className="inline mr-2"/> Your order</h2>
        {!lines.length?<p className="mt-4 text-gray-600">Select your meals or drinks above to begin.</p>:
          <div className="mt-4 divide-y">{lines.map((row,i)=><div key={i} className="py-3 flex items-center justify-between gap-2">
            <div><strong>{row.product.name}</strong><span className="text-sm text-gray-600"> · {row.variant.label} · ×{row.item.quantity}</span>
              {!!row.item.sides.length && <p className="text-xs text-gray-500">{row.item.sides.join(", ")}</p>}</div>
            <div className="flex gap-3 items-center"><b>{row.variant.priceCents===null?"Quote":displayPrice(row.variant.priceCents*row.item.quantity)}</b>
              <button aria-label={"Remove "+row.product.name} className="text-red-700 text-sm font-bold" onClick={()=>setCart(c=>c.filter((_,j)=>j!==i))}>Remove</button></div>
          </div>)}</div>}
        <div className="text-right mt-4 font-bold">Priced items subtotal: {displayPrice(subtotal)} {cbl && <span className="text-sm text-gray-500 font-normal ml-2">(US{kitchenMoney(subtotal)} · L${(Math.round(subtotal*Math.round(cbl.selling*10000)/10000)/100).toFixed(2)})</span>}</div>
        {(hasQuote||fulfillment==="delivery")&&<p className="text-amber-800 text-sm mt-2">Final total will be available once TOTAG confirms {hasQuote?"juice prices ":""}{hasQuote&&fulfillment==="delivery"?"and ":""}{fulfillment==="delivery"?"delivery fees":""}.</p>}
        <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-4">
          <label className="font-semibold text-sm">Full name<input required minLength={2} value={name} onChange={e=>setName(e.target.value)} className="block w-full border rounded-xl p-3 mt-1"/></label>
          <label className="font-semibold text-sm">Phone / WhatsApp<input required value={phone} onChange={e=>setPhone(e.target.value)} className="block w-full border rounded-xl p-3 mt-1"/></label>
          <label className="font-semibold text-sm">Email (optional)<input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="block w-full border rounded-xl p-3 mt-1"/></label>
          <label className="font-semibold text-sm">Fulfillment<select value={fulfillment} onChange={e=>setFulfillment(e.target.value as "pickup"|"delivery")} className="block w-full border rounded-xl p-3 mt-1"><option value="pickup">Pick up at TOTAG Kitchen</option><option value="delivery">Delivery (fee to be confirmed)</option></select></label>
          {fulfillment==="delivery"&&<label className="md:col-span-2 font-semibold text-sm">Delivery address<input required value={address} onChange={e=>setAddress(e.target.value)} className="block w-full border rounded-xl p-3 mt-1"/></label>}
          <label className="md:col-span-2 font-semibold text-sm">Special instructions / allergies<textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} className="block w-full border rounded-xl p-3 mt-1"/></label>
          {message&&<p role="alert" className="md:col-span-2 text-sm text-orange-800">{message}</p>}
          <button disabled={busy||!cart.length} className="md:col-span-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white p-4 rounded-xl font-bold">{busy?"Placing order...":"Submit order & continue to payment"} <ArrowRight className="inline ml-2" size={18}/></button>
        </form>
      </section>
      <p className="mt-7 text-center text-sm"><Phone className="inline" size={16}/> Call/WhatsApp: <a href="https://wa.me/231777511391" className="font-bold underline">+231 777 511 391</a> · info@totaggroup.com · <a href="https://totaggroup.com" className="underline">totaggroup.com</a></p>
    </main><Footer/></div>;
}
