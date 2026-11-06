import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { getApiUrl } from "@/lib/config";
import { Users, CalendarClock, Timer, ClipboardCheck, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";

type Staff={id:number;name:string;role:string;email:string;phone:string|null;isActive:boolean};
type Shift={id:string;staffId:number;station:string;startsAt:string;endsAt:string;duty:string;
  status:string;assignedBy:number;createdAt:string;clockIn:string|null;clockOut:string|null;
  approvedBy:number|null;approvedAt:string|null;hoursWorked:number|null};
type Audit={id:number;shiftId:string;action:string;note:string;actorStaffId:number;createdAt:string};
const managers=["account_manager","operations_supervisor"];
const input="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900";
const panel="rounded-2xl border border-green-100 bg-white p-5 shadow-sm";
const mainButton="rounded-xl bg-green-800 px-4 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-green-900";
function formatDate(v:string|null){return v?new Date(v).toLocaleString("en-LR",{dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Monrovia"}):"—";}

export default function KitchenStaffWorkspace(){
 const [me,setMe]=useState<{id:number;role:string;firstName:string;lastName:string}|null>(null);
 const [staff,setStaff]=useState<Staff[]>([]);
 const [shifts,setShifts]=useState<Shift[]>([]);
 const [audit,setAudit]=useState<Audit[]>([]);
 const [view,setView]=useState("roster");
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");const [notice,setNotice]=useState("");
 const [employeeId,setEmployeeId]=useState("");
 const [station,setStation]=useState("Hot Kitchen");
 const [duty,setDuty]=useState("");
 const [start,setStart]=useState("");const [end,setEnd]=useState("");
 useEffect(()=>{
  try{setMe(JSON.parse(localStorage.getItem("catering_user")||"null"));}
  catch{setMe(null);}
 },[]);
 const manager=!!me&&managers.includes(me.role);
 const api=useCallback(async(path:string,init?:RequestInit)=>{
  const token=localStorage.getItem("catering_token");
  if(!token)throw new Error("Please sign in to Kitchen Staff first");
  const response=await fetch(getApiUrl("/api/kitchen/staff/team"+path),{
   ...init,headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json",...init?.headers}
  });
  const result=await response.json().catch(()=>({success:false,error:"Invalid server response"}));
  if(!response.ok||!result.success)throw new Error(result.error||"Staff workspace request failed");
  return result;
 },[]);
 const reload=useCallback(async()=>{
  setError("");
  try{
   const user=JSON.parse(localStorage.getItem("catering_user")||"null");
   const isManager=managers.includes(user?.role);
   const [roster,people,log]=await Promise.all([
    api("/shifts"),isManager?api("/members"):Promise.resolve({members:[]}),
    isManager?api("/audit"):Promise.resolve({events:[]})
   ]);
   setShifts(roster.shifts);setStaff(people.members);setAudit(log.events);
  }catch(e){setError(e instanceof Error?e.message:"Staff records unavailable");}
 },[api]);
 useEffect(()=>{reload();},[reload]);
 const execute=async(path:string,method:"POST"|"PATCH",body?:unknown)=>{
  setBusy(true);setNotice("");setError("");
  try{
   await api(path,{method,...(body===undefined?{}:{body:JSON.stringify(body)})});
   setNotice("Staff workflow updated and recorded.");
   await reload();
  }catch(e){setError(e instanceof Error?e.message:"Staff operation failed");}
  finally{setBusy(false);}
 };
 const createShift=(e:FormEvent)=>{
  e.preventDefault();
  if(!start||!end||!employeeId){setError("Choose an employee and shift times");return;}
  const startsAt=new Date(start).toISOString(),endsAt=new Date(end).toISOString();
  execute("/shifts","POST",{staffId:Number(employeeId),station,duty,startsAt,endsAt});
 };
 const getEmployee=(id:number)=>staff.find(s=>s.id===id)?.name||(me?.id===id?[me.firstName,me.lastName].filter(Boolean).join(" "):"Staff #"+id);
 const pending=shifts.filter(s=>s.clockOut&&!s.approvedAt);
 const upcoming=shifts.filter(s=>s.status==="published"&&new Date(s.endsAt).getTime()>=Date.now());
 const mine=shifts.filter(s=>s.staffId===me?.id);
 const cards=useMemo(()=>[
  ["Visible shifts",shifts.length],["Published / upcoming",upcoming.length],["Timecards pending approval",manager?pending.length:mine.filter(x=>x.clockOut&&!x.approvedAt).length],
  ["Approved timecards",shifts.filter(s=>!!s.approvedAt).length]
 ],[shifts,upcoming,mine,pending,manager]);
 return <div className="min-h-screen bg-[#f8faf5] text-slate-900">
  <header className="bg-green-950 px-5 py-5 text-white">
   <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-3"><CalendarClock size={38} className="text-amber-300"/><div>
     <h1 className="text-2xl font-black">TOTAG Kitchen Staff & Rosters</h1>
     <p className="text-xs text-green-200">Duty assignments, shift clocking, approvals and staff oversight</p>
    </div></div>
    <div className="flex flex-wrap gap-2 text-sm">
     <Link className="rounded-xl bg-white/10 px-3 py-2" href="/catering/kitchen/ops">Kitchen orders</Link>
     <Link className="rounded-xl bg-white/10 px-3 py-2" href="/catering/kitchen/inventory">Inventory</Link>
     {manager&&<Link className="rounded-xl bg-white/10 px-3 py-2" href="/catering/ops/dashboard">Catering employee administration</Link>}
     <button onClick={reload} className="rounded-xl bg-white/10 px-3 py-2"><RefreshCw size={16} className="mr-1 inline"/>Refresh</button>
    </div>
   </div>
  </header>
  <main className="mx-auto max-w-7xl space-y-5 px-4 py-7">
   <section className={panel}>
    <h2 className="text-lg font-bold text-green-950">Employee shift workflow</h2>
    <ol className="mt-3 grid gap-2 md:grid-cols-5">
     {["1. Verify staff account","2. Draft duty roster","3. Publish assignment","4. Staff clock in & out","5. Manager approves timecard"].map(v=>
      <li key={v} className="rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-950">{v}</li>)}
    </ol>
    <p className="mt-3 text-xs text-gray-600">Attendance uses server timestamps, and staff cannot approve their own timecards. This produces approved hours for later payroll preparation; no salary calculation or automatic payment is made here.</p>
   </section>
   {error&&<p role="alert" className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"><AlertCircle size={18}/>{error}</p>}
   {notice&&<p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">{notice}</p>}
   <section className="grid gap-3 sm:grid-cols-4">{cards.map(([label,val])=><div key={String(label)} className={panel}>
    <p className="text-xs font-semibold text-slate-600">{label}</p><p className="mt-1 text-2xl font-black text-green-900">{val}</p>
   </div>)}</section>
   <nav className="flex flex-wrap gap-2" aria-label="Staff workspace views">
    {([["roster","Duty roster"],["clock","My timecards"],...(manager?[["people","Staff directory"],["audit","Approval history"]]:[])] as string[][]).map(([id,name])=>
     <button key={id} onClick={()=>setView(id)} className={"rounded-full px-4 py-2 text-sm font-bold "+(view===id?"bg-green-800 text-white":"border bg-white text-green-950")}>{name}</button>)}
   </nav>
   {view==="roster"&&<section className={panel}>
    <h2 className="flex items-center gap-2 text-xl font-black text-green-950"><CalendarClock size={24}/> Duty roster</h2>
    {manager&&<form onSubmit={createShift} className="mt-4 grid gap-4 rounded-xl bg-green-50 p-4 md:grid-cols-2">
     <h3 className="font-bold md:col-span-2">Create a staff duty shift</h3>
     <label className="text-sm">Assigned staff<select className={input} required value={employeeId} onChange={e=>setEmployeeId(e.target.value)}>
      <option value="">Select employee</option>{staff.filter(s=>s.isActive).map(s=><option key={s.id} value={s.id}>{s.name} ({s.role.replaceAll("_"," ")})</option>)}
     </select></label>
     <label className="text-sm">Kitchen station<input className={input} required value={station} onChange={e=>setStation(e.target.value)}/></label>
     <label className="text-sm">Shift starts (Liberia time)<input className={input} required type="datetime-local" value={start} onChange={e=>setStart(e.target.value)}/></label>
     <label className="text-sm">Shift ends (Liberia time)<input className={input} required type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)}/></label>
     <label className="text-sm md:col-span-2">Assignments / instructions<textarea rows={2} className={input} value={duty} onChange={e=>setDuty(e.target.value)} placeholder="Food prep shift, cleaning or dispatch duty"/></label>
     <div className="md:col-span-2"><button disabled={busy||!employeeId||!start||!end} className={mainButton}>Save shift draft</button></div>
    </form>}
    <div className="mt-5 space-y-3">
     {shifts.map(s=><article key={s.id} className="rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
       <div><h3 className="font-bold">{getEmployee(s.staffId)} · {s.station}</h3>
        <p className="text-sm text-gray-600">{formatDate(s.startsAt)} – {formatDate(s.endsAt)}</p>
        <p className="mt-1 text-sm">{s.duty||"General Kitchen duty"}</p>
        <p className="mt-1 text-xs font-semibold text-green-900">Status: {s.status} {s.approvedAt?"· timecard approved":""}</p>
       </div>
       <div className="flex flex-wrap gap-2">
        {manager&&s.status==="draft"&&<button disabled={busy} className={mainButton} onClick={()=>execute("/shifts/"+s.id+"/publish","PATCH")}>Publish shift</button>}
        {manager&&s.clockOut&&!s.approvedAt&&s.staffId!==me?.id&&<button disabled={busy} className={mainButton} onClick={()=>execute("/shifts/"+s.id+"/approve","PATCH")}>Approve timecard</button>}
        {s.staffId===me?.id&&s.status==="published"&&!s.clockIn&&<button disabled={busy} className={mainButton} onClick={()=>execute("/shifts/"+s.id+"/clock-in","POST")}>Clock in</button>}
        {s.staffId===me?.id&&s.clockIn&&!s.clockOut&&<button disabled={busy} className={mainButton} onClick={()=>execute("/shifts/"+s.id+"/clock-out","POST")}>Clock out</button>}
       </div>
      </div>
     </article>)}
     {shifts.length===0&&<p className="text-sm text-gray-600">No shifts registered for this account. A Kitchen manager can publish the first duty roster.</p>}
    </div>
   </section>}
   {view==="clock"&&<section className={panel}>
    <h2 className="flex items-center gap-2 text-xl font-black"><Timer/> My attendance and approved hours</h2>
    <div className="mt-4 space-y-3">{mine.map(s=><div key={s.id} className="rounded-xl border p-4">
     <strong>{s.station} · {formatDate(s.startsAt)}</strong>
     <p className="mt-2 text-sm">Clock-in: {formatDate(s.clockIn)} · Clock-out: {formatDate(s.clockOut)}</p>
     <p className="mt-1 text-sm">Hours: {s.hoursWorked??"Pending"} · Approval: {s.approvedAt?"Approved":"Pending"}</p>
    </div>)}
    {mine.length===0&&<p className="text-sm text-gray-600">Your published duty shifts will appear here.</p>}</div>
   </section>}
   {view==="people"&&manager&&<section className={panel}>
    <h2 className="flex items-center gap-2 text-xl font-black"><Users/> Existing Catering employee accounts</h2>
    <p className="mt-2 text-sm text-gray-600">These accounts are shared with Catering ERP; there is no duplicate Kitchen employee database. Only the authorized administrator can create or deactivate accounts.</p>
    <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
     <thead className="bg-green-50"><tr>{["Employee","Role","Contact","Status"].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead>
     <tbody>{staff.map(s=><tr key={s.id} className="border-b"><td className="p-3 font-bold">{s.name}</td><td className="p-3">{s.role.replaceAll("_"," ")}</td><td className="p-3">{s.email} {s.phone||""}</td><td className="p-3">{s.isActive?"Active":"Inactive"}</td></tr>)}</tbody>
    </table></div>
    <Link href="/catering/ops/dashboard" className="mt-4 inline-flex rounded-xl bg-green-800 px-4 py-3 text-sm font-bold text-white">Open staff account administration</Link>
   </section>}
   {view==="audit"&&manager&&<section className={panel}>
    <h2 className="flex items-center gap-2 text-xl font-black"><ShieldCheck/> Duty and attendance audit</h2>
    <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
     <thead className="bg-green-50"><tr>{["Timestamp","Action","Shift","Staff actor","Note"].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead>
     <tbody>{audit.map(e=><tr key={e.id} className="border-b"><td className="p-3">{formatDate(e.createdAt)}</td><td className="p-3">{e.action.replaceAll("_"," ")}</td><td className="p-3 font-mono text-xs">{e.shiftId.slice(0,8)}</td><td className="p-3">#{e.actorStaffId}</td><td className="p-3">{e.note}</td></tr>)}</tbody>
    </table></div>
   </section>}
   <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Next HR controls:</strong> verified employee photograph and particulars, certification expiry, leave requests, manager shift amendments, payroll rules and payslip export. These do not yet exist in this Kitchen workspace and must be separately implemented and tested before release.</p>
  </main>
 </div>;
}
