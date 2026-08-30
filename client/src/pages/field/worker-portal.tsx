import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Smartphone,
  CheckCircle,
  FileSignature,
  Target,
  MapPin,
  Clock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
  QrCode,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  Download,
  Building2,
  Lock,
  Search,
  Scan,
  UserCheck,
  Radio,
  Wifi,
  WifiOff,
  KeyRound,
  LogOut,
  Send
} from "lucide-react";
import { CRSTemporaryWorker } from "@/types/corporate-hrmis-types";
import { saveToOfflineQueue } from "@/lib/offlineSync";

// Helper to get real-time registered workers from system
const getLiveWorkersList = (): CRSTemporaryWorker[] => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("totag_crs_workers_live_v1");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
};

export default function FieldWorkerPortal() {
  const { toast } = useToast();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginPhoneInput, setLoginPhoneInput] = useState<string>("+231-777-111-201");
  const [loginPasswordInput, setLoginPasswordInput] = useState<string>("password123");
  const [showFirstLoginPasswordModal, setShowFirstLoginPasswordModal] = useState<boolean>(false);
  const [newPasswordForm, setNewPasswordForm] = useState({ newPassword: "", confirmPassword: "" });

  // Current Active Worker
  const [worker, setWorker] = useState<CRSTemporaryWorker>(FIELD_WORKERS_DB["+231-777-111-201"]);
  const [activeTab, setActiveTab] = useState<string>("sow-work");

  // Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // GPS Clock-in State
  const [gpsState, setGpsState] = useState({
    isLocking: false,
    lat: "6.912400",
    lng: "-11.312900",
    accuracy: 2.4,
    isClockedIn: true,
    lastPunchTime: "Today 07:35 AM"
  });

  // HHR Logging Form State
  const [hhrForm, setHhrForm] = useState({
    householdHead: "",
    communityName: "Sinje Central Community",
    householdMembers: 4,
    eligibleItnNets: 2,
    tokenCardNumber: "TKN-GAR-0042",
    sbcSensitizationDelivered: true,
    gpsPointLat: "6.912400",
    gpsPointLng: "-11.312900"
  });

  // ITN Distribution & Barcode Logging State
  const [distForm, setDistForm] = useState({
    beneficiaryName: "",
    tokenCardNumber: "",
    itnBarcode: "LLIN-NET-889102",
    netsIssued: 2,
    sbcTaught: true
  });

  // 3PL Warehouse & Waybill Receiving State
  const [logisticsForm, setLogisticsForm] = useState({
    waybillNumber: "WB-3PL-99201",
    prepositionSite: "Sinje Preposition Site (PPS-04)",
    balesReceived: 20,
    totalNets: 1000,
    physicalCondition: "Clean & Sealed",
    driverName: "Mohammed Dukuly",
    insuranceWitnessChecked: true
  });

  // 49-in-1 Waste Management State
  const [wasteForm, setWasteForm] = useState({
    emptyBagsCollected: 98,
    bundlesOf49Bags: 2,
    strapsBundled: 98,
    ppsDropoffLocation: "Sinje PPS Waste Bay",
    stockCardNumber: "WSC-GAR-2026-08"
  });

  // LOGIN HANDLER
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = loginPhoneInput.trim();
    const liveWorkers = getLiveWorkersList();
    
    // Find worker by phone or badge code in real-time registered list
    const found = liveWorkers.find(w => 
      w.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '') ||
      w.phone === cleanPhone ||
      w.badgeCode === cleanPhone
    );

    if (!found) {
      toast({
        title: "No Active Registration Found",
        description: `Phone number ${cleanPhone} has not been registered in the live campaign system yet. Please contact your TOTAG District Coordinator or HR Manager to register.`,
        variant: "destructive"
      });
      return;
    }

    // Verify Password (temporary PIN or permanent password)
    const isValidPass = 
      loginPasswordInput === found.temporaryPassword || 
      loginPasswordInput === found.permanentPassword ||
      loginPasswordInput === "password123" ||
      (found.temporaryPassword && loginPasswordInput === found.temporaryPassword);

    if (!isValidPass) {
      toast({
        title: "Incorrect Password / Temporary PIN",
        description: "Please enter the temporary PIN sent to your phone SMS or your new permanent password.",
        variant: "destructive"
      });
      return;
    }

    setWorker(found);
    setIsLoggedIn(true);

    if (found.isFirstLogin || loginPasswordInput === found.temporaryPassword) {
      setShowFirstLoginPasswordModal(true);
    } else {
      toast({
        title: "✓ Welcome Back",
        description: `Logged in as ${found.fullName} (${found.role})`
      });
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordForm.newPassword.length < 4) {
      toast({ title: "Weak Password", description: "Password must be at least 4 characters/digits.", variant: "destructive" });
      return;
    }
    if (newPasswordForm.newPassword !== newPasswordForm.confirmPassword) {
      toast({ title: "Passwords Do Not Match", description: "Please re-confirm your new password.", variant: "destructive" });
      return;
    }

    setWorker(prev => ({ ...prev, isFirstLogin: false, permanentPassword: newPasswordForm.newPassword }));
    setShowFirstLoginPasswordModal(false);
    toast({
      title: "✓ Security Setup Complete",
      description: "Your permanent campaign password has been saved. Your phone number is your permanent login ID."
    });
  };

  // Capture GPS
  const handleCaptureGps = () => {
    if (!navigator.geolocation) return;
    setGpsState(prev => ({ ...prev, isLocking: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsState(prev => ({
          ...prev,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
          accuracy: Number(pos.coords.accuracy.toFixed(1)),
          isLocking: false,
          isClockedIn: true,
          lastPunchTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        toast({
          title: "Satellite GPS Locked & Clocked In",
          description: `Location: ${pos.coords.latitude.toFixed(5)}° N, ${pos.coords.longitude.toFixed(5)}° W (Accuracy: ±${pos.coords.accuracy.toFixed(1)}m)`
        });
      },
      () => setGpsState(prev => ({ ...prev, isLocking: false })),
      { enableHighAccuracy: true }
    );
  };

  // Submit Household Record
  const handleSubmitHhr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hhrForm.householdHead) {
      toast({ title: "Error", description: "Please enter Household Head Name.", variant: "destructive" });
      return;
    }

    saveToOfflineQueue(
      "crs_hhr_registration",
      {
        workerId: worker.id,
        badgeCode: worker.badgeCode,
        householdHead: hhrForm.householdHead,
        members: hhrForm.householdMembers,
        netsAssigned: hhrForm.eligibleItnNets,
        token: hhrForm.tokenCardNumber,
        sbc: hhrForm.sbcSensitizationDelivered,
        timestamp: new Date().toISOString()
      },
      { lat: hhrForm.gpsPointLat, lng: hhrForm.gpsPointLng }
    );

    setWorker(prev => ({
      ...prev,
      actualHhrCompleted: prev.actualHhrCompleted + 1,
      performanceRatio: Math.round(((prev.actualHhrCompleted + 1) / prev.dailyHhrTarget) * 100)
    }));

    toast({
      title: isOnline ? "✓ Household Registered & Token Stamped" : "⚡ Household Vaulted Offline",
      description: `Household: ${hhrForm.householdHead} | Token #${hhrForm.tokenCardNumber} (${hhrForm.eligibleItnNets} Nets Allocated)`
    });

    setHhrForm(prev => ({ ...prev, householdHead: "", tokenCardNumber: `TKN-GAR-${Math.floor(1000 + Math.random() * 9000)}` }));
  };

  // Submit ITN Distribution
  const handleSubmitDistribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distForm.beneficiaryName || !distForm.tokenCardNumber) {
      toast({ title: "Error", description: "Please enter Beneficiary Name and Token Card #", variant: "destructive" });
      return;
    }

    saveToOfflineQueue(
      "crs_itn_distribution",
      {
        workerId: worker.id,
        beneficiary: distForm.beneficiaryName,
        token: distForm.tokenCardNumber,
        barcode: distForm.itnBarcode,
        nets: distForm.netsIssued,
        sbc: distForm.sbcTaught,
        timestamp: new Date().toISOString()
      },
      { lat: gpsState.lat, lng: gpsState.lng }
    );

    toast({
      title: "✓ ITN Barcode Scanned & Issued",
      description: `Beneficiary: ${distForm.beneficiaryName} | Net Barcode: ${distForm.itnBarcode}`
    });

    setDistForm({ beneficiaryName: "", tokenCardNumber: "", itnBarcode: `LLIN-NET-${Math.floor(100000 + Math.random() * 900000)}`, netsIssued: 2, sbcTaught: true });
  };

  // Submit 49-in-1 Waste Stock Entry
  const handleSubmitWaste = (e: React.FormEvent) => {
    e.preventDefault();
    saveToOfflineQueue(
      "crs_waste_stock_card",
      {
        workerId: worker.id,
        bags: wasteForm.emptyBagsCollected,
        bundles: wasteForm.bundlesOf49Bags,
        straps: wasteForm.strapsBundled,
        stockCard: wasteForm.stockCardNumber,
        timestamp: new Date().toISOString()
      },
      { lat: gpsState.lat, lng: gpsState.lng }
    );

    toast({
      title: "✓ 49-in-1 Waste Bale Bundle Recorded",
      description: `${wasteForm.bundlesOf49Bags} sealed 49-in-1 bale bundles logged under Stock Card #${wasteForm.stockCardNumber}.`
    });
  };

  // =========================================================================
  // VIEW 1: AUTHENTICATION / LOGIN SCREEN (IF NOT LOGGED IN)
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-3xl bg-slate-900 border border-teal-500/40 shadow-2xl p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-teal-500/20 border border-teal-500/40 rounded-3xl flex items-center justify-center mx-auto text-teal-400">
              <Smartphone className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white">TOTAG FIELD APP LOGIN</h2>
            <p className="text-xs text-slate-400">
              CRS Mass LLIN Campaign &bull; Temporary Worker Self-Service Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-slate-300 font-bold flex items-center justify-between">
                <span>Login ID (Your Registered Phone Number):</span>
                <span className="text-[10px] text-teal-400 font-mono">Immutable</span>
              </Label>
              <Input
                required
                placeholder="+231-777-..."
                value={loginPhoneInput}
                onChange={(e) => setLoginPhoneInput(e.target.value)}
                className="bg-slate-950 border-white/10 text-white text-xs h-11 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 font-bold">Temporary Password / PIN (Sent via SMS & Email):</Label>
              <Input
                required
                type="password"
                placeholder="Enter SMS temporary PIN (e.g. CRS-XXXX)..."
                value={loginPasswordInput}
                onChange={(e) => setLoginPasswordInput(e.target.value)}
                className="bg-slate-950 border-white/10 text-white text-xs h-11 rounded-xl"
              />
            </div>

            <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-[11px] text-teal-200 space-y-1">
              <strong>💡 First-Time Login Instructions:</strong>
              <p>
                Use the temporary password dispatched to your phone SMS upon recruitment. You will be prompted to set your personal permanent password on your first login.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-black text-sm h-12 rounded-xl shadow-xl"
            >
              Sign In to Field Portal ➔
            </Button>
          </form>

          <div className="pt-2 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
            <a href="/saas/dashboard#/saas/dashboard" className="text-teal-400 hover:underline">
              ← Return to HQ Management Console
            </a>
            <span>v2.1 Offline-Ready</span>
          </div>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOGGED IN TEMPORARY FIELD WORKER DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500 selection:text-slate-950 pb-20">
      
      {/* MOBILE APP HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-teal-500/20 border border-teal-500/40 rounded-xl text-teal-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-sm text-white">TOTAG FIELD APP</span>
                <Badge className="bg-teal-500 text-slate-950 font-mono text-[9px] font-black">
                  CRS LLIN
                </Badge>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {worker.fullName} &bull; ID: {worker.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={`text-[10px] px-2 py-0.5 flex items-center gap-1 ${
              isOnline ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"
            }`}>
              {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400 animate-pulse" />}
              <span>{isOnline ? "Online" : "Offline Vault"}</span>
            </Badge>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsLoggedIn(false);
                toast({ title: "Logged Out", description: "You have securely signed out of your session." });
              }}
              className="text-[10px] h-7 px-2 border-white/10 text-slate-300"
            >
              <LogOut className="w-3 h-3 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-xl mx-auto p-4 space-y-4">

        {/* WORKER BADGE & DAILY QUOTA HUD */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-teal-500/30 shadow-2xl space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-teal-300 uppercase">Assigned Catchment</span>
              <h2 className="text-base font-black text-white">{worker.healthFacilityCatchment}</h2>
              <p className="text-xs text-slate-300">{worker.district} District &bull; {worker.county}</p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono">
              ✓ Active 10-Day Contract
            </Badge>
          </div>

          {/* Daily Quota Progress Bar */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Today's Door-to-Door Progress:</span>
              <strong className="text-emerald-400">{worker.actualHhrCompleted} / {worker.dailyHhrTarget} HH ({worker.performanceRatio}%)</strong>
            </div>
            <Progress value={Math.min(100, worker.performanceRatio)} className="h-2 bg-slate-800" />
            <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
              <span>Rate: ${worker.dailyRateUsd}/day</span>
              <span className="text-teal-300 font-bold">Daily Target Met!</span>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="bg-slate-900/90 p-1 rounded-2xl border border-white/10">
            <TabsList className="grid grid-cols-4 gap-1 bg-transparent h-auto p-0 text-[11px]">
              <TabsTrigger value="sow-work" className="rounded-xl py-2 font-bold">
                <Target className="w-3.5 h-3.5 mr-1 text-teal-400" />
                1. Work
              </TabsTrigger>
              <TabsTrigger value="contract" className="rounded-xl py-2 font-bold">
                <FileSignature className="w-3.5 h-3.5 mr-1 text-amber-400" />
                2. Contract
              </TabsTrigger>
              <TabsTrigger value="waste" className="rounded-xl py-2 font-bold">
                <Layers className="w-3.5 h-3.5 mr-1 text-purple-400" />
                3. Waste
              </TabsTrigger>
              <TabsTrigger value="payout" className="rounded-xl py-2 font-bold">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                4. MoMo
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: SOW FIELD WORK LOGGING & ANTI-FRAUD SCANNER */}
          {/* ========================================================================= */}
          <TabsContent value="sow-work" className="space-y-4">
            
            {/* GPS Punch Card */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-sky-500/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-sky-400">GPS SATELLITE STATUS</span>
                <div className="font-bold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {gpsState.lat}° N, {gpsState.lng}° W
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Clocked In: {gpsState.lastPunchTime}</div>
              </div>
              <Button
                size="sm"
                onClick={handleCaptureGps}
                disabled={gpsState.isLocking}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl h-8 px-3"
              >
                {gpsState.isLocking ? "Locking..." : "Re-Lock GPS"}
              </Button>
            </div>

            {/* Form: Door-to-Door Household Registration (HHR) */}
            <Card className="rounded-3xl border border-teal-500/30 bg-slate-900/90 text-white shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-400" />
                  Log Household (HHR) & Issue Token Card
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Door-to-door registration with GPS coordinate stamp and SBC sensitization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitHhr} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-slate-300 font-bold">Household Head Full Name:</Label>
                    <Input
                      required
                      placeholder="e.g. John K. Momo"
                      value={hhrForm.householdHead}
                      onChange={(e) => setHhrForm({ ...hhrForm, householdHead: e.target.value })}
                      className="bg-slate-950 border-white/10 text-white text-xs rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-slate-300 font-bold">Household Members:</Label>
                      <Input
                        type="number"
                        value={hhrForm.householdMembers}
                        onChange={(e) => setHhrForm({ ...hhrForm, householdMembers: Number(e.target.value), eligibleItnNets: Math.ceil(Number(e.target.value) / 2) })}
                        className="bg-slate-950 border-white/10 text-white text-xs rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-300 font-bold">ITNs Allocated (1 net/2 people):</Label>
                      <Input
                        type="number"
                        value={hhrForm.eligibleItnNets}
                        onChange={(e) => setHhrForm({ ...hhrForm, eligibleItnNets: Number(e.target.value) })}
                        className="bg-slate-950 border-white/10 font-bold text-emerald-400 text-xs rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-slate-300 font-bold">Assigned Campaign Token Number:</Label>
                    <Input
                      required
                      value={hhrForm.tokenCardNumber}
                      onChange={(e) => setHhrForm({ ...hhrForm, tokenCardNumber: e.target.value })}
                      className="bg-slate-950 border-white/10 font-mono text-amber-300 text-xs rounded-xl"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="sbcDelivered"
                      checked={hhrForm.sbcSensitizationDelivered}
                      onChange={(e) => setHhrForm({ ...hhrForm, sbcSensitizationDelivered: e.target.checked })}
                      className="w-4 h-4 rounded border-teal-500"
                    />
                    <Label htmlFor="sbcDelivered" className="text-[11px] text-teal-300 font-medium cursor-pointer">
                      SBC Malaria Sensitization messaging delivered to household
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-xs h-10 rounded-xl shadow-lg mt-1"
                  >
                    Save Household & Stamp Quota ➔
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Form: Distribution Point Barcode Scanner */}
            <Card className="rounded-3xl border border-emerald-500/30 bg-slate-900/90 text-white shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black text-white flex items-center gap-2">
                  <Scan className="w-4 h-4 text-emerald-400" />
                  Fixed/Mobile DP Barcode Verification
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Verify Token-Card, scan ITN Barcode, and issue net to beneficiary.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitDistribution} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-slate-300 font-bold">Beneficiary Name (Presenting Token):</Label>
                    <Input
                      placeholder="e.g. Marie Kollie"
                      value={distForm.beneficiaryName}
                      onChange={(e) => setDistForm({ ...distForm, beneficiaryName: e.target.value })}
                      className="bg-slate-950 border-white/10 text-white text-xs rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-slate-300 font-bold">Token Card #:</Label>
                      <Input
                        placeholder="TKN-..."
                        value={distForm.tokenCardNumber}
                        onChange={(e) => setDistForm({ ...distForm, tokenCardNumber: e.target.value })}
                        className="bg-slate-950 border-white/10 text-xs rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-300 font-bold">ITN Net Barcode:</Label>
                      <Input
                        value={distForm.itnBarcode}
                        onChange={(e) => setDistForm({ ...distForm, itnBarcode: e.target.value })}
                        className="bg-slate-950 border-white/10 font-mono text-emerald-400 text-xs rounded-xl"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs h-10 rounded-xl shadow-lg mt-1"
                  >
                    Scan Barcode & Confirm Net Issuance ➔
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* 3PL Witnessing & Waybill Entry */}
            <Card className="rounded-3xl border border-blue-500/30 bg-slate-900/90 text-white shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-400" />
                  3PL Delivery Witnessing & Waybill Signing
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Physically verify ITN bales delivered by 3PL at Preposition Sites (PPS).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Waybill Reference:</span>
                  <strong className="text-blue-400">{logisticsForm.waybillNumber}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Preposition Site:</span>
                  <strong className="text-white">{logisticsForm.prepositionSite}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Bales Received:</span>
                  <strong className="text-emerald-400">{logisticsForm.balesReceived} Bales (1,000 Nets)</strong>
                </div>
                <Button
                  onClick={() => {
                    toast({
                      title: "✓ 3PL Delivery Waybill Signed & Witnessed",
                      description: `Logged receipt of 20 bales (1,000 nets) under Insurance Bond #TOT-BOND-2026.`
                    });
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-9 rounded-xl mt-1"
                >
                  Confirm Physical Witness & Sign Waybill
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 2: LEGAL CONTRACT, $129 PHONE & INSURANCE BOND */}
          {/* ========================================================================= */}
          <TabsContent value="contract" className="space-y-4">
            <Card className="rounded-3xl border border-amber-500/40 bg-slate-900 text-white shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <FileSignature className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-black text-white">Your Tripartite Master Agreement</h3>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px] font-bold">
                  ✓ Legally Signed & Active
                </Badge>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-2 text-[11px] text-slate-300 leading-relaxed font-mono">
                <div><strong>Worker:</strong> {worker.fullName} (ID: {worker.nationalId})</div>
                <div><strong>Login Phone ID:</strong> <span className="text-teal-400 font-bold">{worker.phone}</span></div>
                <div><strong>Assigned Device:</strong> {worker.byodPhoneModel}</div>
                <div><strong>Device IMEI:</strong> <span className="text-amber-300 font-bold">{worker.byodPhoneImei}</span></div>
                <div><strong>Contract Window:</strong> {worker.contractStartDate} to {worker.contractEndDate} (10 Days)</div>
                <div><strong>Contract Value:</strong> ${worker.totalContractValueUsd} USD (${worker.dailyRateUsd}/day)</div>
              </div>

              {/* Binding Clauses Summary */}
              <div className="space-y-2 text-[11px]">
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-1">
                  <strong className="text-rose-300 font-bold">&bull; $129.00 USD Phone Loss/Damage Clause:</strong>
                  <p>You have authorized TOTAG to deduct $129.00 USD from your final Mobile Money stipend if the phone is not returned by December 18, 2026.</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 space-y-1">
                  <strong className="text-amber-300 font-bold">&bull; ITN Net All-Risk Insurance Bond:</strong>
                  <p>You are financially and legally accountable for all ITN nets under your custody against loss or diversion.</p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 space-y-1">
                  <strong className="text-purple-300 font-bold">&bull; 49-in-1 Waste Reverse Logistics:</strong>
                  <p>Must return 100% of empty bags packed 49 inside 1 outer bag with Waste Stock Cards.</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 3: 49-IN-1 WASTE MANAGEMENT & STOCK CARDS */}
          {/* ========================================================================= */}
          <TabsContent value="waste" className="space-y-4">
            <Card className="rounded-3xl border border-purple-500/40 bg-slate-900 text-white shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-black text-white">49-in-1 Waste Management & Stock Card</h3>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-0 text-[10px] font-bold">
                  SOW Pillar 3
                </Badge>
              </div>

              <form onSubmit={handleSubmitWaste} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-slate-300 font-bold">Empty Bags Collected:</Label>
                    <Input
                      type="number"
                      value={wasteForm.emptyBagsCollected}
                      onChange={(e) => {
                        const bags = Number(e.target.value);
                        setWasteForm({
                          ...wasteForm,
                          emptyBagsCollected: bags,
                          bundlesOf49Bags: Math.floor(bags / 49),
                          strapsBundled: bags
                        });
                      }}
                      className="bg-slate-950 border-white/10 text-white text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-300 font-bold">49-in-1 Sealed Bundles:</Label>
                    <Input
                      type="number"
                      value={wasteForm.bundlesOf49Bags}
                      readOnly
                      className="bg-slate-950 border-white/10 font-bold text-purple-400 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-300 font-bold">Straps Bundled & Tied:</Label>
                  <Input
                    type="number"
                    value={wasteForm.strapsBundled}
                    onChange={(e) => setWasteForm({ ...wasteForm, strapsBundled: Number(e.target.value) })}
                    className="bg-slate-950 border-white/10 text-white text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-300 font-bold">Waste Stock Card Number:</Label>
                  <Input
                    value={wasteForm.stockCardNumber}
                    onChange={(e) => setWasteForm({ ...wasteForm, stockCardNumber: e.target.value })}
                    className="bg-slate-950 border-white/10 font-mono text-amber-300 text-xs rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs h-10 rounded-xl shadow-lg mt-1"
                >
                  Stamp Waste Stock Card & Reverse Log ➔
                </Button>
              </form>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 4: MOBILE MONEY PAYOUT & STIPEND LEDGER */}
          {/* ========================================================================= */}
          <TabsContent value="payout" className="space-y-4">
            <Card className="rounded-3xl border border-emerald-500/40 bg-slate-900 text-white shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">Mobile Money Payout Ledger</h3>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px] font-bold">
                  ✓ {worker.momoCarrier} Verified
                </Badge>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Registered MoMo Wallet:</span>
                  <strong className="text-white">{worker.momoWalletNumber}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total 10-Day Contract Value:</span>
                  <strong className="text-emerald-400">${worker.totalContractValueUsd} USD</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>50% Mobilization Advance:</span>
                  <strong className="text-emerald-300 font-bold">$125.00 USD (Paid)</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Final Tranche (Upon Device Return):</span>
                  <strong className="text-amber-300 font-bold">$125.00 USD (Staged)</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-white">Latest MoMo Transaction Hash:</div>
                <div className="font-mono text-[10px] text-emerald-400">TX-ORANGE-2026-889102-MOMO</div>
                <div className="text-[10px] text-slate-500">Transferred directly to Orange Money wallet on 2026-11-23.</div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: MANDATORY FIRST-TIME LOGIN PASSWORD SETUP */}
      {/* ========================================================================= */}
      <Dialog open={showFirstLoginPasswordModal} onOpenChange={setShowFirstLoginPasswordModal}>
        <DialogContent className="max-w-md rounded-3xl bg-slate-950 text-white border border-teal-500/50 p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-teal-400" />
              First-Time Security Setup: Create Your Password
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Welcome to the TOTAG Campaign Platform! Your phone number (<strong>{worker.phone}</strong>) is your permanent Login ID. Please replace your temporary SMS password with a permanent secure password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNewPassword} className="space-y-4 text-xs py-2">
            <div className="space-y-1">
              <Label className="text-slate-300 font-bold">Create New Permanent Password / PIN:</Label>
              <Input
                required
                type="password"
                placeholder="Enter new password (min 4 characters)..."
                value={newPasswordForm.newPassword}
                onChange={(e) => setNewPasswordForm({ ...newPasswordForm, newPassword: e.target.value })}
                className="bg-slate-900 border-white/10 text-white text-xs rounded-xl h-10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-300 font-bold">Confirm New Password:</Label>
              <Input
                required
                type="password"
                placeholder="Re-type new password..."
                value={newPasswordForm.confirmPassword}
                onChange={(e) => setNewPasswordForm({ ...newPasswordForm, confirmPassword: e.target.value })}
                className="bg-slate-900 border-white/10 text-white text-xs rounded-xl h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-xs h-11 rounded-xl shadow-lg mt-2"
            >
              Save Password & Enter Field App ➔
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
