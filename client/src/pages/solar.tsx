import { useState, useEffect } from "react";
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
  ArrowUpRight,
  Plus,
  Trash2,
  Compass,
  CloudSun,
  FileText,
  Printer,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EcosystemStateEngine, SolarAuditItem } from "@/lib/ecosystem-state";

// Approved Component Catalogue Master
const COMPONENT_CATALOGUE = [
  { name: "Tier-1 Mono PERC 550W Module", category: "PV Module", specs: "550W • 49.8 Voc • 13.1 Imp • 21.3% Efficiency", warranty: "25-Yr Linear", brand: "Jinko / Longi" },
  { name: "Deye 10kW Hybrid Three-Phase Inverter", category: "Inverter", specs: "10kVA • 48V Battery • 2 MPPT • Parallelable • IP65", warranty: "5-Yr Extended", brand: "Deye" },
  { name: "Victron Quattro 15kVA Inverter/Charger", category: "Inverter", specs: "15kVA • Dual AC Inputs • Auto Generator Start", warranty: "5-Yr Factory", brand: "Victron Energy" },
  { name: "LiFePO4 5.12kWh Rack Battery Module", category: "Battery", specs: "48V 100Ah • 6,000 Cycles @ 80% DoD • Smart BMS", warranty: "10-Yr Pro-rated", brand: "Hubble / Pylontech" },
  { name: "4-String PV Combiner Box w/ SPD", category: "Balance of Plant", specs: "1000V DC • 15A Fuses • Type II Surge Arrestor", warranty: "2-Yr", brand: "ABB / Schneider" }
];

export default function SolarPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("system-sizing");

  // Dynamic Persistent Audits State
  const [auditsList, setAuditsList] = useState<SolarAuditItem[]>([]);

  useEffect(() => {
    setAuditsList(EcosystemStateEngine.getSolarAudits());
  }, []);

  // 1. Dynamic Interactive Energy Audit Loads State
  const [auditLoads, setAuditLoads] = useState([
    { name: "Servers & IT Network", qty: 4, watts: 400, hours: 24, factor: 1.0 },
    { name: "Inverter Air Conditioner", qty: 3, watts: 1500, hours: 8, factor: 0.8 },
    { name: "LED Office Illumination", qty: 25, watts: 15, hours: 10, factor: 1.0 },
    { name: "Cold Storage / Refrigeration", qty: 2, watts: 1200, hours: 24, factor: 0.7 }
  ]);

  // Form State for Adding New Load Item
  const [newLoad, setNewLoad] = useState({ name: "", qty: 1, watts: 100, hours: 8 });

  const handleAddLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoad.name) return;
    setAuditLoads([...auditLoads, { ...newLoad, factor: 0.9 }]);
    setNewLoad({ name: "", qty: 1, watts: 100, hours: 8 });
    toast({ title: "Equipment Added", description: "Audit load table and system sizing recalculated dynamically." });
  };

  const handleDeleteLoad = (index: number) => {
    setAuditLoads(auditLoads.filter((_, i) => i !== index));
    toast({ title: "Equipment Removed", description: "System sizing recalculated." });
  };

  // 2. Comprehensive Site Survey & Environmental Parameters
  const [siteSurvey, setSiteSurvey] = useState({
    clientName: "UNDP Health Facility Zwedru",
    location: "Zwedru, Grand Gedeh County",
    propertyType: "Health Facility",
    roofOrientation: "South-Facing (180° Optimal)",
    roofTilt: "15° Optimal Pitch",
    shadingFactor: "10% Partial Shading",
    gridStatus: "Unstable LEC Grid (12h Outage)",
    autonomyHours: 16,
    dieselPricePerLiter: 1.35
  });

  // Math Sizing Engine with Environmental & Shading Calculations
  const totalConnectedWatts = auditLoads.reduce((sum, item) => sum + (item.qty * item.watts), 0);
  const totalDailyKwh = Math.round(auditLoads.reduce((sum, item) => sum + (item.qty * item.watts * item.hours * item.factor) / 1000, 0) * 10) / 10;
  const peakDemandKw = Math.round((totalConnectedWatts / 1000) * 1.25 * 10) / 10;

  // Shading Factor Derating multiplier
  const shadingMultiplier = siteSurvey.shadingFactor.includes("20%") ? 1.25 : siteSurvey.shadingFactor.includes("10%") ? 1.12 : 1.05;
  const baseIrradiance = 4.6; // Peak Sun Hours in Liberia
  const adjustedIrradiance = Math.round((baseIrradiance / shadingMultiplier) * 10) / 10;

  // Engineering Sizing Results
  const pvArrayKw = Math.round((totalDailyKwh / adjustedIrradiance) * 1.25 * 10) / 10;
  const inverterKva = Math.ceil(peakDemandKw * 1.25);
  const batteryKwh = Math.round((totalDailyKwh * (siteSurvey.autonomyHours / 24) / 0.8) * 10) / 10; // 80% DoD

  // Bill of Quantities Details
  const panelCount550W = Math.ceil((pvArrayKw * 1000) / 550);
  const batteryModuleCount = Math.ceil(batteryKwh / 5.12);
  const annualKwhProduction = Math.round(pvArrayKw * adjustedIrradiance * 365);
  const monthlyDieselSavedLiters = Math.round(totalDailyKwh * 0.35 * 30); // 0.35L per kWh
  const monthlyDieselSavedUsd = Math.round(monthlyDieselSavedLiters * siteSurvey.dieselPricePerLiter);
  
  const totalTurnkeyCost = Math.round((panelCount550W * 280) + (inverterKva * 420) + (batteryModuleCount * 1450) + 2400); // Including BoP & Labor
  const simplePaybackYears = Math.round((totalTurnkeyCost / (monthlyDieselSavedUsd * 12)) * 10) / 10;

  // Tailored Proposal Submission Handler
  const handleGenerateProposal = () => {
    const created = EcosystemStateEngine.addSolarAudit({
      clientName: siteSurvey.clientName,
      location: siteSurvey.location,
      propertyType: siteSurvey.propertyType,
      connectedWatts: totalConnectedWatts,
      dailyKwh: totalDailyKwh,
      recommendedPvKw: pvArrayKw,
      recommendedBatteryKwh: batteryKwh,
      status: "Engineering Design V2"
    });

    setAuditsList([created, ...auditsList]);

    toast({
      title: "Tailored Solar Engineering Proposal Generated",
      description: `Proposal #${created.id} saved for ${siteSurvey.clientName}. Published to Executive Control Tower.`
    });
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
                Comprehensive Site Surveys, Load Analysis, Shading Studies, and Tailored Solar PV Engineering Design Engine for UN Agencies, Health Facilities, Agribusiness Microgrids, and Commercial Enterprises.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 text-center justify-center">
                Solar EPC + NOC Live ({auditsList.length} Active Proposals)
              </Badge>
              <div className="text-right p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block font-bold">Monthly Diesel Avoided:</span>
                <span className="text-xl font-black text-emerald-400">${monthlyDieselSavedUsd.toLocaleString()} USD ({monthlyDieselSavedLiters.toLocaleString()} L)</span>
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
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-md">3. Shading & Tailored System Sizing</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">4. BOQ & Costing</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">5. Procurement</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">6. Installation QA/QC</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">7. Commissioning</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">8. NOC Remote Monitoring</span>
            </div>
          </div>
        </section>

        {/* Main Application Module Tabs */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-slate-900 p-1.5 border-2 border-slate-800 rounded-2xl mb-8 shadow-2xl">
              <TabsTrigger value="system-sizing" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Cpu className="h-4 w-4" />
                1. Tailored Design & Shading
              </TabsTrigger>
              <TabsTrigger value="energy-audit" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Calculator className="h-4 w-4" />
                2. Load Analysis Audit
              </TabsTrigger>
              <TabsTrigger value="noc-monitoring" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Activity className="h-4 w-4" />
                3. NOC Telemetry
              </TabsTrigger>
              <TabsTrigger value="catalogue-boq" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <FileSpreadsheet className="h-4 w-4" />
                4. BOQ & Proposals
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

            {/* 1. Tailored Engineering System Sizing, Site Survey & Shading Study Engine */}
            <TabsContent value="system-sizing" className="space-y-8">
              
              {/* Site Survey Input Parameters Panel */}
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Compass className="w-6 h-6 text-amber-400" />
                    <span>Comprehensive Site Survey & Environmental Parameters Input</span>
                  </h2>
                  <p className="text-xs text-slate-300 font-semibold mt-1">
                    Input client location, roof pitch/orientation, shading obstacles, and battery autonomy to calculate optimal tailored system specifications.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  
                  <div>
                    <Label className="text-xs font-bold text-slate-300">Client / Institution Name</Label>
                    <Input 
                      value={siteSurvey.clientName}
                      onChange={(e) => setSiteSurvey({ ...siteSurvey, clientName: e.target.value })}
                      className="mt-1 bg-slate-950 border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-300">Location / County</Label>
                    <Input 
                      value={siteSurvey.location}
                      onChange={(e) => setSiteSurvey({ ...siteSurvey, location: e.target.value })}
                      className="mt-1 bg-slate-950 border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-300">Property / Application Type</Label>
                    <select
                      value={siteSurvey.propertyType}
                      onChange={(e) => setSiteSurvey({ ...siteSurvey, propertyType: e.target.value })}
                      className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold"
                    >
                      <option value="Health Facility">Health Facility / Hospital</option>
                      <option value="UN / NGO Office">UN / NGO Regional Office</option>
                      <option value="Commercial Building">Commercial Building</option>
                      <option value="Agribusiness Farm">Agribusiness Farm Microgrid</option>
                      <option value="Telecom Tower">Telecom Tower Installation</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-300">Roof Orientation & Azimuth</Label>
                    <select
                      value={siteSurvey.roofOrientation}
                      onChange={(e) => setSiteSurvey({ ...siteSurvey, roofOrientation: e.target.value })}
                      className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold"
                    >
                      <option value="South-Facing (180° Optimal)">South-Facing (180° Optimal)</option>
                      <option value="East / West Facing (-12% Yield)">East / West Facing (-12% Yield)</option>
                      <option value="Ground Mount Ballasted">Ground Mount Ballasted (0° Azimuth)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-300">Shading Obstacle Assessment</Label>
                    <select
                      value={siteSurvey.shadingFactor}
                      onChange={(e) => setSiteSurvey({ ...siteSurvey, shadingFactor: e.target.value })}
                      className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold"
                    >
                      <option value="0% Minimal Shading">0% Minimal Shading (Clear Horizon)</option>
                      <option value="10% Partial Shading">10% Partial Shading (Trees/Parapet)</option>
                      <option value="20% Significant Shading">20% Significant Shading (Dense Foliage)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-300">Night Autonomy Duration (Hours)</Label>
                    <select
                      value={siteSurvey.autonomyHours}
                      onChange={(e) => setSiteSurvey({ ...siteSurvey, autonomyHours: Number(e.target.value) })}
                      className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold"
                    >
                      <option value={8}>8 Hours Backup</option>
                      <option value={12}>12 Hours Backup</option>
                      <option value={16}>16 Hours Backup (Recommended)</option>
                      <option value={24}>24 Hours Full Autonomy</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Calculated Tailored Engineering Report Output */}
              <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AUTOMATED TAILORED ENGINEERING REPORT GENERATED</span>
                    </div>
                    <h3 className="text-2xl font-black text-white">
                      Tailored Engineering Design for <span className="text-emerald-400">{siteSurvey.clientName}</span>
                    </h3>
                  </div>

                  <Button onClick={handleGenerateProposal} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-5 shadow-lg">
                    <FileText className="w-4 h-4 mr-2" /> Save & Export Tailored Proposal Dossier
                  </Button>
                </div>

                {/* Top Sizing Output Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 text-center space-y-1">
                    <Sun className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Tailored PV Array</span>
                    <div className="text-3xl font-black text-amber-400">{pvArrayKw} kWp</div>
                    <span className="text-[11px] text-slate-300 font-bold">{panelCount550W} × 550W Tier-1 Modules</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 text-center space-y-1">
                    <BatteryCharging className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">LiFePO4 Storage Bank</span>
                    <div className="text-3xl font-black text-emerald-400">{batteryKwh} kWh</div>
                    <span className="text-[11px] text-slate-300 font-bold">{batteryModuleCount} × 5.12kWh Rack Batteries ({siteSurvey.autonomyHours}h Autonomy)</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 text-center space-y-1">
                    <Cpu className="w-6 h-6 text-sky-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Hybrid Inverter</span>
                    <div className="text-3xl font-black text-sky-400">{inverterKva} kVA</div>
                    <span className="text-[11px] text-slate-300 font-bold">Pure Sine Wave + ATS Generator Port</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 text-center space-y-1">
                    <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Turnkey Investment</span>
                    <div className="text-3xl font-black text-purple-400">${totalTurnkeyCost.toLocaleString()} USD</div>
                    <span className="text-[11px] text-emerald-400 font-bold">{simplePaybackYears} Yrs Simple Payback</span>
                  </div>

                </div>

                {/* Detailed Engineering Breakdown Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                  
                  {/* Solar Irradiance & Shading Study Summary */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
                      <CloudSun className="w-4 h-4 text-amber-400" />
                      <span>Irradiance & Shading Analysis</span>
                    </h4>
                    <div className="space-y-2 text-xs text-slate-300 font-semibold">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Base Peak Sun Hours (Liberia):</span>
                        <span className="text-white font-bold">4.6 kWh/m²/day</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Shading Obstacle Derating:</span>
                        <span className="text-amber-400 font-bold">{siteSurvey.shadingFactor}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Adjusted Net Sun Hours:</span>
                        <span className="text-emerald-400 font-bold">{adjustedIrradiance} PSH / Day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Annual PV Generation:</span>
                        <span className="text-emerald-400 font-black text-sm">{annualKwhProduction.toLocaleString()} kWh / Year</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Return & Diesel Avoidance Matrix */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-emerald-400" />
                      <span>Financial & Diesel Displacement Matrix</span>
                    </h4>
                    <div className="space-y-2 text-xs text-slate-300 font-semibold">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Monthly Diesel Avoided:</span>
                        <span className="text-emerald-400 font-bold">{monthlyDieselSavedLiters.toLocaleString()} Liters / Month</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Monthly Fuel Expense Saved:</span>
                        <span className="text-emerald-400 font-bold">${monthlyDieselSavedUsd.toLocaleString()} USD / Month</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Annual Fuel Expense Saved:</span>
                        <span className="text-emerald-400 font-black text-sm">${(monthlyDieselSavedUsd * 12).toLocaleString()} USD / Year</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated ROI Payback Period:</span>
                        <span className="text-amber-400 font-black">{simplePaybackYears} Years</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </TabsContent>

            {/* 2. Interactive Energy Audit Engine */}
            <TabsContent value="energy-audit" className="space-y-6">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-amber-400" />
                    <span>Dynamic Interactive Energy Load Audit Engine</span>
                  </h2>
                  <p className="text-xs text-slate-300 font-semibold mt-1">
                    Add or remove equipment items dynamically. The platform recalculates total connected watts, daily kWh energy demand, and peak inverter surge in real time.
                  </p>
                </div>

                {/* Add Equipment Form */}
                <form onSubmit={handleAddLoad} className="grid grid-cols-5 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="col-span-2">
                    <Label className="text-[10px] font-bold text-slate-300">Equipment Name</Label>
                    <Input 
                      value={newLoad.name} 
                      onChange={(e) => setNewLoad({ ...newLoad, name: e.target.value })} 
                      placeholder="e.g. Solar Water Pump"
                      className="mt-1 bg-slate-900 border-slate-800 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-slate-300">Quantity</Label>
                    <Input 
                      type="number" 
                      value={newLoad.qty} 
                      onChange={(e) => setNewLoad({ ...newLoad, qty: Number(e.target.value) })} 
                      className="mt-1 bg-slate-900 border-slate-800 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-slate-300">Watts Each</Label>
                    <Input 
                      type="number" 
                      value={newLoad.watts} 
                      onChange={(e) => setNewLoad({ ...newLoad, watts: Number(e.target.value) })} 
                      className="mt-1 bg-slate-900 border-slate-800 text-white text-xs"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs">
                      <Plus className="w-4 h-4 mr-1" /> Add Item
                    </Button>
                  </div>
                </form>

                {/* Audit Load Items Table */}
                <div className="space-y-3">
                  <div className="grid grid-cols-6 text-xs font-black uppercase text-slate-400 px-3 py-1">
                    <span className="col-span-2">Equipment Description</span>
                    <span>Qty × Watts</span>
                    <span>Operating Hrs</span>
                    <span>Daily kWh</span>
                    <span className="text-right">Action</span>
                  </div>

                  {auditLoads.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-6 items-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
                      <span className="col-span-2 text-white font-extrabold">{item.name}</span>
                      <span className="text-slate-300">{item.qty} × {item.watts}W</span>
                      <span className="text-slate-300">{item.hours} hrs/day</span>
                      <span className="text-emerald-400 font-extrabold">
                        {Math.round((item.qty * item.watts * item.hours * item.factor) / 1000 * 10) / 10} kWh
                      </span>
                      <div className="text-right">
                        <Button onClick={() => handleDeleteLoad(idx)} variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20 hover:text-red-300 p-1.5 h-auto">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

            {/* 3. NOC Remote Monitoring Command Center */}
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
              </div>
            </TabsContent>

            {/* 4. BOQ & Proposals Engine */}
            <TabsContent value="catalogue-boq" className="space-y-6">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                  <span>Approved Component Master</span>
                </h3>
                <div className="space-y-3">
                  {COMPONENT_CATALOGUE.map((comp, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
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
                    How TOTAG Solar Energy integrates dynamically with Construction, Petroleum, Farm, Cargo, IT Services, and FIMS.
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
