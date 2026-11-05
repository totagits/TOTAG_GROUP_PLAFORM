import { useEffect, useState } from "react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getApiUrl } from "@/lib/config";
import { kitchenMoney } from "@shared/kitchenCatalog";
import { Copy, Truck, CheckCircle, WalletCards, RefreshCw } from "lucide-react";

type Order = {id:string;status:string;paymentStatus:string;paymentMethod?:string;fulfillment:string;
  items:{name:string;variant:string;quantity:number;unitPriceCents:number|null;sides:string[]}[];
  subtotalCents:number|null;deliveryFeeCents:number|null;totalCents:number|null;
  driverName:string|null;driverPhone:string|null;createdAt:string;
  paymentCurrency?:string|null;paymentAmountMinor?:number|null;cblRateDate?:string|null;cblRateSource?:string|null;exchangeRate?:number|null;
  events:{status:string;note:string|null;at:string}[]};
const flow=["awaiting_quote","awaiting_payment","paid","accepted","preparing","ready","dispatched","delivered"];
function price(n:number|null){return n===null?"To be confirmed":kitchenMoney(n);}
function readRef(){
  const q=new URLSearchParams(window.location.search||window.location.hash.split("?")[1]||"");
  const id=q.get("order"),token=q.get("token");
  if(id&&token)return{id,token};
  try{return JSON.parse(sessionStorage.getItem("totag_kitchen_order")||"null");}catch{return null;}
}
async function send(path:string,init?:RequestInit){
  const r=await fetch(getApiUrl("/api/kitchen"+path),{...init,headers:{"Content-Type":"application/json",...init?.headers}});
  const data=await r.json().catch(()=>({success:false,error:"Unexpected server response"}));
  if(!r.ok||!data.success)throw new Error(data.error||"Request failed");
  return data;
}
export default function KitchenTracking(){
  const [ref,setRef]=useState<{id:string;token:string}|null>(null);
  const [lookup,setLookup]=useState("");const [secret,setSecret]=useState("");
  const [order,setOrder]=useState<Order|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [payment,setPayment]=useState<"card"|"mtn">("mtn");
  const [mtnPhone,setMtnPhone]=useState("");
  const [methods,setMethods]=useState<{card:boolean;mtn:boolean;orange:boolean}>({card:false,mtn:false,orange:false});
  const [cbl,setCbl]=useState<{date:string;buying:number;selling:number;sourceUrl:string}|null>(null);
  const [fxWarning,setFxWarning]=useState("Checking CBL exchange rates...");
  const loadCbl=async()=>{try{const rate=await send("/fx");setCbl(rate.cbl);setFxWarning("");}
    catch{setCbl(null);setFxWarning("CBL rates are not currently verifiable. LRD payments are disabled.");}};
  useEffect(()=>{const r=readRef();if(r)setRef(r);
    send("/catalog").then(x=>setMethods(x.payments)).catch(()=>{});
    loadCbl();
  },[]);
  useEffect(()=>{if(!ref)return;let active=true;
    const refresh=async()=>{try{const data=await send("/orders/"+encodeURIComponent(ref.id)+"/track?token="+encodeURIComponent(ref.token));if(active){setOrder(data.order);setError("");}}catch(e:any){if(active)setError(e.message);}};
    refresh();const t=setInterval(refresh,15000);return()=>{active=false;clearInterval(t);};
  },[ref]);
  function useLookup(e:React.FormEvent){e.preventDefault();setError("");setOrder(null);setRef({id:lookup.trim(),token:secret.trim()});}
  async function verify(){
    if(!ref)return;setLoading(true);
    try{const data=await send("/orders/"+ref.id+"/verify",{method:"POST",body:JSON.stringify({token:ref.token})});setOrder(data.order);setError("");}
    catch(e:any){setError(e.message);}finally{setLoading(false);}
  }
  async function pay(){
    if(!ref)return;setLoading(true);setError("");
    try{
      if(payment==="mtn" && (!cbl || !order || order.totalCents===null))
        throw new Error("CBL exchange rate cannot be verified. Refresh the CBL rate before paying in LRD.");
      const amount=payment==="mtn"&&order?.totalCents!==null&&cbl
        ? Math.round(order!.totalCents*Math.round(cbl.selling*10000)/10000)
        : undefined;
      const data=await send("/orders/"+ref.id+"/pay",{method:"POST",body:JSON.stringify({
        token:ref.token,method:payment,phone:mtnPhone,expectedLrdAmountMinor:amount,
        cblDate:payment==="mtn"?cbl?.date:undefined,cblSellingRate:payment==="mtn"?cbl?.selling:undefined
      })});
      if(data.checkoutUrl){window.location.assign(data.checkoutUrl);return;}
      await verify();
      setError(data.message||"Payment initiated. Confirm the prompt on your phone, then verify payment.");
    }catch(e:any){setError(e.message);}finally{setLoading(false);}
  }
  function copyLink(){
    if(!ref)return;
    const url=window.location.origin+"/catering/kitchen/track?order="+encodeURIComponent(ref.id)+"&token="+encodeURIComponent(ref.token);
    navigator.clipboard?.writeText(url).then(()=>setError("Private tracking link copied. Keep it secure.")).catch(()=>setError("Unable to copy automatically."));
  }
  return <div className="min-h-screen bg-[#fffaf0]"><Header/>
    <header className="bg-green-900 text-white p-8 text-center"><img src="/images/totag-logo.png" className="w-20 h-20 object-contain bg-white rounded-xl p-1 mx-auto" alt="TOTAG"/><h1 className="text-3xl font-black mt-3">TOTAG Kitchen Order Tracking</h1>
      <p className="text-green-100 mt-1">See your quotation, payment verification, kitchen progress and delivery status.</p></header>
    <main className="max-w-3xl mx-auto px-4 py-10">
      {!ref&&<form onSubmit={useLookup} className="bg-white p-6 rounded-2xl border space-y-3">
        <p className="font-bold">Open your private order tracking link, or enter the two details saved when you ordered.</p>
        <input className="border rounded-lg p-3 w-full" required placeholder="Order ID" value={lookup} onChange={e=>setLookup(e.target.value)}/>
        <input className="border rounded-lg p-3 w-full" required placeholder="Private tracking token" value={secret} onChange={e=>setSecret(e.target.value)}/>
        <button className="rounded-xl bg-green-800 text-white px-5 py-3 font-bold">Track order</button>
      </form>}
      {error&&<p role="status" className="my-4 p-4 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">{error}</p>}
      {ref&&!order&&!error&&<p className="text-center p-6">Loading order...</p>}
      {ref&&order&&<div className="space-y-5">
        <section className="bg-white rounded-2xl shadow border p-6">
          <div className="flex gap-3 justify-between items-start"><div><span className="text-xs uppercase font-bold text-orange-700">Order reference</span>
            <p className="font-mono break-all text-sm">{order.id}</p><h2 className="font-black text-2xl text-green-950 capitalize mt-2">{order.status.replace(/_/g," ")}</h2></div>
            <button onClick={copyLink} className="border rounded-xl p-2 text-sm" title="Copy private tracking link"><Copy size={18}/></button>
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">{flow.map((step,i)=>{
            const current=flow.indexOf(order.status),active=current>=i;
            return <div key={step} className={"rounded-lg px-2 py-3 text-xs font-bold text-center "+(active?"bg-green-800 text-white":"bg-gray-100 text-gray-500")}>{step.replace(/_/g," ")}</div>;
          })}</div>
        </section>
        <section className="rounded-2xl bg-white border p-6">
          <h3 className="font-bold text-xl mb-3">Order details</h3>
          <div className="divide-y">{order.items.map((item,i)=><div key={i} className="py-2 flex justify-between gap-3 text-sm"><div><strong>{item.name}</strong> · {item.variant} × {item.quantity}
            {!!item.sides.length&&<div className="text-gray-500">{item.sides.join(", ")}</div>}</div><strong>{price(item.unitPriceCents===null?null:item.unitPriceCents*item.quantity)}</strong></div>)}</div>
          <div className="pt-4 text-sm space-y-2">
            <div className="flex justify-between"><span>Food and juices</span><strong>{price(order.subtotalCents)}</strong></div>
            <div className="flex justify-between"><span>{order.fulfillment==="delivery"?"Delivery fee":"Pickup"}</span><strong>{price(order.deliveryFeeCents)}</strong></div>
            <div className="flex justify-between text-lg border-t pt-3 font-black"><span>Total (USD)</span><strong>{price(order.totalCents)}</strong></div>
            {order.paymentCurrency==="LRD"&&order.paymentAmountMinor!=null?
              <div className="flex justify-between text-lg font-bold text-green-800"><span>Paid or pending (LRD)</span><strong>L$ {(order.paymentAmountMinor/100).toFixed(2)}</strong></div>
            :cbl&&order.totalCents!==null?
              <div className="flex justify-between text-lg font-bold text-green-800"><span>CBL indicative LRD total</span><strong>L$ {(Math.round(order.totalCents*Math.round(cbl.selling*10000)/10000)/100).toFixed(2)}</strong></div>
            :<p className="text-amber-900 text-sm">LRD equivalent requires a verified official CBL rate.</p>}
            {order.cblRateDate&&order.exchangeRate?
              <p className="text-xs text-green-800">Checkout rate fixed at L$ {order.exchangeRate.toFixed(4)} / US$1 (CBL selling, published {order.cblRateDate}). <a className="underline" target="_blank" rel="noopener noreferrer" href={order.cblRateSource||"https://www.cbl.org.lr/research/buying-selling-rates?page=0"}>CBL source</a></p>
            :cbl&&<p className="text-xs text-gray-600">CBL selling rate L$ {cbl.selling.toFixed(4)} / US$1, published {cbl.date}. <a className="underline" href={cbl.sourceUrl} target="_blank" rel="noopener noreferrer">Verify rate</a>. Final amount confirmed when you initiate payment.</p>}
          </div>
        </section>
        {order.status==="awaiting_quote"&&<section className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <h3 className="font-bold">TOTAG is preparing your final quote</h3><p className="text-sm mt-2">Your order is saved. Return to this page for the confirmed juice and/or delivery fee before paying. Contact +231 777 511 391 if you need help.</p>
        </section>}
        {order.status==="awaiting_payment"&&<section className="bg-white rounded-2xl border p-6 space-y-3">
          <h3 className="font-black text-xl"><WalletCards className="inline"/> Secure checkout</h3>
          {order.paymentStatus==="pending"? <><p>Payment request sent; do not start a duplicate payment.</p>
            <button disabled={loading} onClick={verify} className="rounded-lg bg-green-700 text-white px-4 py-2">Verify payment with provider</button></>:
            <><div className="space-y-2"><label className="flex gap-2 items-center"><input type="radio" checked={payment==="mtn"} disabled={!methods.mtn} onChange={()=>setPayment("mtn")}/> MTN Mobile Money (LRD) {!methods.mtn&&"(not activated)"}</label>
              <label className="flex gap-2 items-center"><input type="radio" checked={payment==="card"} disabled={!methods.card} onChange={()=>setPayment("card")}/> Credit/debit card (USD) {!methods.card&&"(not activated)"}</label></div>
              {payment==="mtn"&&<><input className="border rounded-xl p-3 w-full" placeholder="MTN MoMo number: 231XXXXXXXXX" value={mtnPhone} onChange={e=>setMtnPhone(e.target.value)}/>
                {cbl&&order.totalCents!==null?<p className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm font-semibold">MTN will request LRD {(Math.round(order.totalCents*Math.round(cbl.selling*10000)/10000)/100).toFixed(2)} at the official CBL selling rate L$ {cbl.selling.toFixed(4)} / US$1, published {cbl.date}. Approve only if the phone prompt shows this exact amount.</p>
                :<p className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-800">{fxWarning} <button className="underline" type="button" onClick={loadCbl}>Retry CBL verification</button></p>}</>}
              <button disabled={loading||!(payment==="mtn"?methods.mtn&&!!cbl:methods.card)} onClick={pay} className="rounded-xl bg-orange-600 text-white font-bold px-5 py-3 disabled:opacity-40">Pay {payment==="mtn"&&cbl&&order.totalCents!==null?"L$ "+(Math.round(order.totalCents*Math.round(cbl.selling*10000)/10000)/100).toFixed(2):"US"+price(order.totalCents)} securely</button>
              {!methods.card&&!methods.mtn&&<p className="text-sm text-red-700">Digital payments are not yet configured. TOTAG will activate verified providers before accepting payment.</p>}</>}
        </section>}
        {(order.status==="dispatched"||order.status==="delivered")&&<section className="bg-green-50 rounded-2xl p-5 border border-green-200">
          <h3 className="font-black"><Truck className="inline"/> Delivery update</h3>
          <p>{order.driverName?("Assigned courier: "+order.driverName):"Courier details will be shared when available."} {order.driverPhone&&<a href={"tel:"+order.driverPhone} className="underline">{order.driverPhone}</a>}</p>
          <p className="text-sm text-gray-700 mt-2">Tracking is milestone-based; live courier GPS is not currently enabled.</p>
        </section>}
        <section className="rounded-2xl border bg-white p-6"><h3 className="font-bold text-lg mb-3"><CheckCircle className="inline text-green-700"/> Progress history</h3>
          <ol className="border-l-2 border-green-300 pl-4 space-y-3">{order.events.map((ev,i)=><li key={i}><strong className="capitalize">{ev.status.replace(/_/g," ")}</strong> <span className="text-xs text-gray-500">{new Date(ev.at).toLocaleString()}</span><p className="text-sm">{ev.note||""}</p></li>)}</ol>
          <button onClick={verify} disabled={loading} className="mt-4 px-4 py-2 border rounded-lg text-green-900"><RefreshCw className="inline" size={16}/> Refresh status</button></section>
      </div>}
      <div className="text-center mt-7"><Link href="/catering/kitchen" className="text-green-800 underline font-bold">Back to TOTAG Kitchen menu</Link></div>
    </main><Footer/></div>;
}
