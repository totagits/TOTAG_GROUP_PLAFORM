import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Sun, 
  ShieldCheck, 
  ArrowRight,
  BatteryCharging,
  Cpu,
  Calculator,
  Activity,
  Gauge,
  CheckCircle2,
  Sliders,
  FileCheck,
  Building2,
  Layers,
  Sparkles,
  MapPin,
  TrendingUp,
  Fuel,
  Ship,
  HardHat,
  ShoppingBag,
  Laptop,
  Utensils,
  BookOpen,
  Wrench,
  AlertTriangle,
  FileSpreadsheet,
  Award,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Approved Component Catalogue Master
const COMPONENT_CATALOGUE = [
  { name: "Tier-1 Mono PERC 550W Module", category: "PV Module", specs: "550W • 49.8 Voc • 13.1 Imp • 21.3% Efficiency", warranty: "25-Yr Linear", brand: "Jinko / Longi" },
  { name: "Deye 10kW Hybrid Three-Phase Inverter", category: "Inverter", specs: "10kVA • 48V Battery • 2 MPPT • Parallelable • IP65", warranty: "5-Yr Extended", brand: "Deye" },
  { name: "Victron Quattro 15kVA Inverter/Charger", category: "Inverter", specs: "15kVA • Dual AC Inputs • Auto Generator Start", warranty: "5-Yr Factory", brand: "Victron Energy" },
  { name: "LiFePO4 5.12kWh Rack Battery Module", category: "Battery", specs: "48V 100Ah • 6,000 Cycles @ 80% DoD • Smart BMS", warranty: "10-Yr Pro-rated", brand: "Hubble / Pylontech" },
  { name: "4-String PV Combiner Box w/ SPD", category: "Balance of Plant", specs: "1000V DC • 15A Fuses • Type II Surge Arrestor", warranty: "2-Yr", brand: "ABB / Schneider" }
];

// Active Solar EPC & Operations Projects
const ACTIVE_SOLAR_PROJECTS = [
  {
    id: "SOL-2026-041",
    client: "CRS / UNFPA Health Facilities Solarization",
    location: "Zwedru & Harper Sites",
    capacity: "45.0 kWp PV • 90.0 kWh BESS",
    status: "Commissioning",
    dieselAvoidedLitersMonth: 2450,
    ncrCount: 0
  },
  {
    id: "SOL-2026-088",
    client: "UNDP Agribusiness Processing Microgrid",
    location: "Gbarnga, Bong County",
    capacity: "125.0 kWp PV • 240.0 kWh BESS",
    status: "Remote Monitoring NOC",
    dieselAvoidedLitersMonth: 5800,
    ncrCount: 0
  }
];

export default function SolarPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("noc-monitoring");

  // Load Audit State Calculator
  const [auditLoads, setAuditLoads] = useState([
    { name: "Servers & IT Network", qty: 4, watts: 400, hours: 24, factor: 1.0 },
    { name: "Inverter Air Conditioner", qty: 3, watts: 1500, hours: 8, factor: 0.8 },
    { name: "LED Office Illumination", qty: 25, watts: 15, hours: 10, factor: 1.0 },
    { name: "Cold Storage / Refrigeration", qty: 2, watts: 1200, hours: 24, factor: 0.7 }
  ]);

  const totalConnectedWatts = auditLoads.reduce((sum, item) => sum + (item.qty * item.watts), 0);
  const totalDailyKwh = Math.round(auditLoads.reduce((sum, item) => sum + (item.qty * item.watts * item.hours * item.factor) / 1000, 0) * 10) / 10;
  const peakDemandKw = Math.round((totalConnectedWatts / 1000) * 1.25 * 10) / 10;

  // Engineering Sizing Results
  const pvArrayKw = Math.round((totalDailyKwh / 4.6) * 1.25 * 10) / 10;
  const inverterKva = Math.ceil(peakDemandKw * 1.2);
  const batteryKwh = Math.round(totalDailyKwh * 1.3 * 10) / 10;

  // Tender Proposal Form State
  const [proposalForm, setProposalForm] = useState({
    clientName: "",
    agencyType: "UN / NGO Agency",
    contactEmail: "",
    targetLocation: "",
    estimatedDailyKwh: totalDailyKwh.toString(),
    requiredAutonomyHours: "16"
  });

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Solar EPC Proposal Request Generated",
      description: "Our Smart Energy Engineering Directorate will finalize the single-line diagram, BOQ, and landed cost matrix."
    });
    setProposalForm({ clientName: "", agencyType: "UN / NGO Agency", contactEmail: "", targetLocation: "", estimatedDailyKwh: totalDailyKwh.toString(), requiredAutonomyHours: "16" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950">
      <Header />
      
      <main className="pt-28 pb-20">
        
        {/* Banner Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-yellow-950 border-2 border-slate-800 text-white shadow-2xl">
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black mb-3">
                <Sun className="w-4 h-4" />
                <span>10th Standalone Service Vertical • TOTAG Smart Energy Platform</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                TOTAG <span className="text-amber-400">Solar Energy</span> & Smart Power
              </h1>
              <p className="text-sm text-slate-300 font-semibold mt-1 max-w-3xl">
                Full-lifecycle Solar EPC, Energy Asset Management, IoT Remote Monitoring, and O&M Platform for UN agencies, health facilities, agribusiness microgrids, and commercial enterprises.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 text-center justify-center">
                Solar EPC + NOC Live
              </Badge>
              <div className="text-right p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block font-bold">Diesel Saved This Month:</span>
                <span className="text-xl font-black text-emerald-400">8,250 Liters</span>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Lifecycle Indicator */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 space-y-2 shadow-xl">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Enterprise Operating Lifecycle</span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">1. Lead CRM</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">2. Energy Audit</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">3. System Sizing</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">4. BOQ & Costing</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">5. Procurement</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">6. Installation QA/QC</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">7. Commissioning</span> →
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-md">8. NOC Remote Monitoring</span>
            </div>
          </div>
        </section>

        {/* Main Application Module Tabs */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-slate-900 p-1.5 border-2 border-slate-800 rounded-2xl mb-8 shadow-2xl">
              <TabsTrigger value="noc-monitoring" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Activity className="h-4 w-4" />
                1. NOC Telemetry
              </TabsTrigger>
              <TabsTrigger value="energy-audit" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Calculator className="h-4 w-4" />
                2. Energy Audit
              </TabsTrigger>
              <TabsTrigger value="system-sizing" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Cpu className="h-4 w-4" />
                3. Design & Sizing
              </TabsTrigger>
              <TabsTrigger value="catalogue-boq" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <FileSpreadsheet className="h-4 w-4" />
                4. BOQ & Catalogue
              </TabsTrigger>
              <TabsTrigger value="commissioning" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Award className="h-4 w-4" />
                5. QA/QC Certificate
              </TabsTrigger>
              <TabsTrigger value="interoperability" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Layers className="h-4 w-4" />
                6. Ecosystem Sync
              </TabsTrigger>
            </TabsList>

            {/* 1. NOC Remote Monitoring Command Center */}
            <TabsContent value="noc-monitoring" className="space-y-8">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <Activity className="w-6 h-6 text-amber-400" />
                      <span>Smart Energy Network Operations Center (NOC)</span>
                    </h2>
                    <p className="text-xs text-slate-300 font-semibold mt-1">
                      Real-time IoT telemetry monitoring PV array generation, battery state of charge (SOC), load demand, and generator hours avoided.
                    </p>
                  </div>
                  <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1">
                    Live Telemetry Stream Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 text-center space-y-1">
                    <Sun className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-spin-slow" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Live PV Power Output</span>
                    <div className="text-3xl font-black text-amber-400">42.8 kW</div>
                    <span className="text-[10px] text-emerald-400 font-bold">Irradiance: 940 W/m²</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 text-center space-y-1">
                    <BatteryCharging className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Battery State of Charge (SOC)</span>
                    <div className="text-3xl font-black text-emerald-400">94%</div>
                    <span className="text-[10px] text-slate-300 font-bold">LiFePO4 48V Storage Bank</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 text-center space-y-1">
                    <Cpu className="w-6 h-6 text-sky-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Active Facility Load</span>
                    <div className="text-3xl font-black text-sky-400">28.4 kW</div>
                    <span className="text-[10px] text-slate-300 font-bold">Pure Sine Wave Output</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 text-center space-y-1">
                    <Fuel className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Generator Run Reduction</span>
                    <div className="text-3xl font-black text-purple-400">-77%</div>
                    <span className="text-[10px] text-purple-300 font-bold">From 14h/day down to 3.2h/day</span>
                  </div>

                </div>

                {/* AI Energy Assistant Recommendation Box */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-black text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>AI ENERGY ASSISTANT OPTIMIZATION ALERTS</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    "PV production at Site SOL-2026-088 (Gbarnga Microgrid) is generating 98.4% of expected yield. Diesel generator runtime was automatically suppressed for 18.5 hours yesterday, saving 285 liters of fuel."
                  </p>
                </div>

              </div>
            </TabsContent>

            {/* 2. Solar Site Assessment & Energy Audit Engine */}
            <TabsContent value="energy-audit" className="space-y-6">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-amber-400" />
                    <span>Itemized Load Audit & Connected Power Engine</span>
                  </h2>
                  <p className="text-xs text-slate-300 font-semibold mt-1">
                    Enter individual equipment wattage, quantity, and operating hours to calculate daily kWh, maximum demand, and peak surge.
                  </p>
                </div>

                {/* Audit Load Items Table */}
                <div className="space-y-3">
                  <div className="grid grid-cols-5 text-xs font-black uppercase text-slate-400 px-3 py-1">
                    <span className="col-span-2">Equipment Description</span>
                    <span>Qty × Watts</span>
                    <span>Operating Hrs</span>
                    <span className="text-right">Daily kWh</span>
                  </div>

                  {auditLoads.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-5 items-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
                      <span className="col-span-2 text-white font-extrabold">{item.name}</span>
                      <span className="text-slate-300">{item.qty} × {item.watts}W</span>
                      <span className="text-slate-300">{item.hours} hrs/day</span>
                      <span className="text-right text-emerald-400 font-extrabold">
                        {Math.round((item.qty * item.watts * item.hours * item.factor) / 1000 * 10) / 10} kWh
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculated Energy Audit Metrics */}
                <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 text-center">
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase block">Total Connected Load</span>
                    <span className="text-2xl font-black text-white">{totalConnectedWatts.toLocaleString()} W</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase block">Daily kWh Energy Demand</span>
                    <span className="text-2xl font-black text-emerald-400">{totalDailyKwh} kWh / Day</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase block">Estimated Peak Demand</span>
                    <span className="text-2xl font-black text-amber-400">{peakDemandKw} kW</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 3. Solar System Sizing & Engineering Design Engine */}
            <TabsContent value="system-sizing" className="space-y-6">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-amber-400" />
                    <span>Engineering System Sizing & 3 Design Scenarios</span>
                  </h2>
                  <p className="text-xs text-slate-300 font-semibold mt-1">
                    Multi-tier engineering options comparing essential backup vs. hybrid microgrid vs. full energy independence.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Option A */}
                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-3">
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Option A • Essential Backup
                    </span>
                    <h3 className="text-lg font-black text-white">Critical Load Solar</h3>
                    <div className="space-y-1 text-xs text-slate-300 font-semibold">
                      <p>PV Capacity: <span className="text-white font-bold">{Math.round(pvArrayKw * 0.6 * 10) / 10} kWp</span></p>
                      <p>Inverter: <span className="text-white font-bold">{Math.round(inverterKva * 0.7)} kVA</span></p>
                      <p>LiFePO4 Storage: <span className="text-white font-bold">{Math.round(batteryKwh * 0.5 * 10) / 10} kWh</span></p>
                      <p>Diesel Reduction: <span className="text-emerald-400 font-bold">45% Avoided</span></p>
                    </div>
                    <div className="pt-2 text-xl font-black text-amber-400">${Math.round(pvArrayKw * 700 + batteryKwh * 350).toLocaleString()} USD</div>
                  </div>

                  {/* Option B */}
                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/60 space-y-3 shadow-lg">
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                      Option B • Recommended Hybrid (Best ROI)
                    </span>
                    <h3 className="text-lg font-black text-white">Full Facility Microgrid</h3>
                    <div className="space-y-1 text-xs text-slate-300 font-semibold">
                      <p>PV Capacity: <span className="text-white font-bold">{pvArrayKw} kWp</span></p>
                      <p>Inverter: <span className="text-white font-bold">{inverterKva} kVA</span></p>
                      <p>LiFePO4 Storage: <span className="text-white font-bold">{batteryKwh} kWh</span></p>
                      <p>Diesel Reduction: <span className="text-emerald-400 font-bold">85% Avoided</span></p>
                    </div>
                    <div className="pt-2 text-xl font-black text-emerald-400">${Math.round(pvArrayKw * 750 + batteryKwh * 380 + inverterKva * 400).toLocaleString()} USD</div>
                  </div>

                  {/* Option C */}
                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-purple-500/50 space-y-3">
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                      Option C • 100% Energy Independence
                    </span>
                    <h3 className="text-lg font-black text-white">Zero-Emission Island</h3>
                    <div className="space-y-1 text-slate-300 text-xs font-semibold">
                      <p>PV Capacity: <span className="text-white font-bold">{Math.round(pvArrayKw * 1.4 * 10) / 10} kWp</span></p>
                      <p>Inverter: <span className="text-white font-bold">{Math.round(inverterKva * 1.5)} kVA</span></p>
                      <p>LiFePO4 Storage: <span className="text-white font-bold">{Math.round(batteryKwh * 1.8 * 10) / 10} kWh</span></p>
                      <p>Diesel Reduction: <span className="text-emerald-400 font-bold">100% Avoided</span></p>
                    </div>
                    <div className="pt-2 text-xl font-black text-purple-400">${Math.round(pvArrayKw * 1000 + batteryKwh * 500).toLocaleString()} USD</div>
                  </div>

                </div>
              </div>
            </TabsContent>

            {/* 4. BOQ & Component Catalogue Engine */}
            <TabsContent value="catalogue-boq" className="space-y-6">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6 text-amber-400" />
                    <span>Approved Component Master & Automated BOQ Engine</span>
                  </h2>
                  <p className="text-xs text-slate-300 font-semibold mt-1">
                    Approved technical catalogue for Tier-1 PV modules, Deye/Victron hybrid inverters, LiFePO4 batteries, and balance-of-plant accessories.
                  </p>
                </div>

                <div className="space-y-3">
                  {COMPONENT_CATALOGUE.map((comp, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] font-black text-amber-400 uppercase px-2 py-0.5 bg-slate-900 rounded">
                          {comp.category} • {comp.brand}
                        </span>
                        <h4 className="text-sm font-black text-white mt-1">{comp.name}</h4>
                        <p className="text-slate-300 text-xs font-medium">{comp.specs}</p>
                      </div>
                      <Badge className="bg-slate-800 text-slate-200 border-slate-700 text-xs">
                        {comp.warranty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 5. QA/QC & Commissioning Certificate Generator */}
            <TabsContent value="commissioning" className="space-y-6">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <Award className="w-6 h-6 text-emerald-400" />
                      <span>Digital Testing & Commissioning Certificate Engine</span>
                    </h2>
                    <p className="text-xs text-slate-300 font-semibold mt-1">
                      Generate official electrical testing certificates with Voc/Isc measurements, BMS status, and ATS transfer verification.
                    </p>
                  </div>
                  <Button onClick={() => toast({ title: "Commissioning Certificate Generated", description: "Official PDF testing certificate issued." })} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs">
                    Issue Commissioning Certificate
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-amber-400 font-extrabold uppercase">1. PV Array Insulation & String Test</span>
                    <p className="text-slate-300">String 1 Voc: 482.4 V | Isc: 12.8 A | Insulation Resistance: &gt;200 MΩ (PASSED)</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-emerald-400 font-extrabold uppercase">2. LiFePO4 Battery BMS Integration</span>
                    <p className="text-slate-300">Pack Voltage: 51.2V | CAN Bus Comms: Active | Cell Delta: 0.012V (PASSED)</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 6. Interoperability & Ecosystem Sync */}
            <TabsContent value="interoperability" className="space-y-6">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Layers className="w-6 h-6 text-sky-400" />
                    <span>Cross-Subsidiary Service Workflows</span>
                  </h2>
                  <p className="text-xs text-slate-300 font-semibold mt-1">
                    How TOTAG Solar Energy integrates with Construction, Petroleum, Farm, Cargo, IT Services, and FIMS.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-2 text-amber-400 font-black">
                      <Fuel className="w-4 h-4" />
                      <span>Solar ↔ Petroleum</span>
                    </div>
                    <p className="text-slate-300">Diesel generator fuel telemetry triggers automatic Solar CRM leads to convert high-fuel sites into solar/hybrid microgrids.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-2 text-emerald-400 font-black">
                      <Zap className="w-4 h-4" />
                      <span>Solar ↔ TOTAG FARM</span>
                    </div>
                    <p className="text-slate-300">Power design for solar irrigation pumps, cold-room refrigeration, and crop drying infrastructure.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-2 text-sky-400 font-black">
                      <Ship className="w-4 h-4" />
                      <span>Solar ↔ Cargo Handling</span>
                    </div>
                    <p className="text-slate-300">Auto-triggers port clearance, stevedoring, and freight dispatch for containerized solar panels & LiFePO4 batteries.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </section>

      </main>

      <Footer />
    </div>
  );
}
