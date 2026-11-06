import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { ChefHat, LockKeyhole, ArrowLeft } from "lucide-react";
import { getApiUrl } from "@/lib/config";

export default function KitchenStaffLogin(){
  const [,navigate]=useLocation();
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setBusy(true);
    setError("");
    try{
      const response=await fetch(getApiUrl("/api/catering/auth/login"),{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username:username.trim(),password}),
      });
      const result=await response.json().catch(()=>({success:false,error:"Authentication service returned an invalid response"}));
      if(!response.ok||!result.success||!result.token||!result.user){
        throw new Error(result.error||"Unable to sign in with these credentials");
      }
      const permitted=["account_manager","operations_supervisor","head_chef","food_safety_supervisor","logistics_coordinator","inventory_manager","team_lead"];
      if(!permitted.includes(result.user.role)){
        throw new Error("This account is not authorized for the Kitchen Operations workspace");
      }
      localStorage.setItem("catering_token",result.token);
      localStorage.setItem("catering_user",JSON.stringify(result.user));
      navigate(result.user.role==="inventory_manager"?"/catering/kitchen/inventory":result.user.role==="team_lead"?"/catering/kitchen/staff":"/catering/kitchen/ops");
    }catch(err){
      setError(err instanceof Error?err.message:"Unable to sign in");
    }finally{
      setBusy(false);
    }
  }

  return <div className="min-h-screen bg-[#fffaf0] px-4 py-12 text-slate-900">
    <div className="mx-auto max-w-md">
      <Link href="/catering/kitchen" className="inline-flex items-center gap-2 text-sm font-bold text-green-900 hover:underline"><ArrowLeft size={16}/> Return to Kitchen menu</Link>
      <header className="mt-6 rounded-t-3xl bg-gradient-to-r from-green-950 to-green-800 p-7 text-white">
        <ChefHat className="mb-3 h-11 w-11 text-amber-200" strokeWidth={1.6} aria-hidden="true"/>
        <h1 className="text-2xl font-black">TOTAG Kitchen Staff Login</h1>
        <p className="mt-2 text-sm text-green-100">Access quotations, orders, verified payments, food preparation and delivery operations.</p>
      </header>
      <form onSubmit={submit} className="space-y-5 rounded-b-3xl border border-green-100 bg-white p-7 shadow-md">
        <label className="block text-sm font-bold" htmlFor="kitchen-staff-username">Staff username
          <input id="kitchen-staff-username" value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required className="mt-2 block w-full rounded-xl border border-gray-300 p-3"/>
        </label>
        <label className="block text-sm font-bold" htmlFor="kitchen-staff-password">Password
          <input id="kitchen-staff-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required className="mt-2 block w-full rounded-xl border border-gray-300 p-3"/>
        </label>
        {error&&<p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700 disabled:opacity-50"><LockKeyhole size={18} aria-hidden="true"/>{busy?"Signing in...":"Open Kitchen Operations Workspace"}</button>
        <p className="text-xs text-gray-600">Authorized staff only. Request individual credentials from the TOTAG Catering administrator. Never share account passwords.</p>
      </form>
    </div>
  </div>;
}
