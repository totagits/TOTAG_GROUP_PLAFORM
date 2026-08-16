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
  CloudSun,
  FileText,
  Printer,
  Check,
  Truck,
  DollarSign,
  PackageCheck,
  Barcode,
  ClipboardList,
  FileSignature,
  BadgeCheck,
  ExternalLink,
  ChevronRight,
  Warehouse,
  Workflow,
  ClipboardCheck,
  FolderKanban,
  ShieldAlert
} from "lucide-react";
import { 
  EcosystemStateEngine, 
  SolarAuditItem, 
  SolarLeadItem, 
  SolarBoqItem, 
  SolarProcurementItem, 
  SolarSupplierRecord, 
  SolarSerializedAsset, 
  SolarProjectItem 
} from "@/lib/ecosystem-state";

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
  const [activeTab, setActiveTab] = useState("crm-leads");
  const [customerAccount, setCustomerAccount] = useState("monrovia-plaza");
  const [systemMode, setSystemMode] = useState("self-consumption");
  const [ticketSent, setTicketSent] = useState(false);
  const [custSurveyForm, setCustSurveyForm] = useState({
    name: "Monrovia Commercial Plaza",
    contact: "+231 770 123 456",
    peakLoad: "25",
    nightLoad: "10",
    autonomyHours: "12",
    roofType: "Corrugated Metal Sheet (South-West 15° Pitch)"
  });

  // Dynamic Persistent State
  const [auditsList, setAuditsList] = useState<SolarAuditItem[]>([]);
  const [leadsList, setLeadsList] = useState<SolarLeadItem[]>([]);
  const [leadCategoryFilter, setLeadCategoryFilter] = useState<string>("ALL");
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [newLead, setNewLead] = useState({
    customerName: "",
    contactPerson: "",
    phoneEmail: "",
    customerCategory: "Commercial Client" as SolarLeadItem["customerCategory"],
    county: "Montserrado",
    district: "Monrovia",
    siteAddress: "",
    gpsCoords: "6.3150° N, 10.8072° W",
    proposedApplication: "Hybrid Solar & Battery Storage",
    estimatedLoadKw: 25,
    electricitySource: "LEC Grid Only" as SolarLeadItem["electricitySource"],
    generatorKva: "100 kVA Genset",
    lecHoursPerDay: 10,
    requestedAutonomyHours: 12,
    budgetUsd: 55000,
    procurementMethod: "Direct Purchase" as SolarLeadItem["procurementMethod"],
    tenderNumber: "",
    submissionDeadline: "",
    leadSource: "Direct Web Inbound",
    assignedEngineer: "Eng. Tarkpor Williams",
    probabilityPct: 75,
    estimatedValueUsd: 50000
  });

  // Module 2 Field Assessment Tools State
  const [fieldAssessment, setFieldAssessment] = useState({
    gpsCaptured: "6.0719° N, 8.1281° W (Grand Gedeh)",
    roofStructure: "Corrugated Zinc (15° Pitch, South-Facing)",
    groundMountArea: "450 sq. meters available",
    shadingHorizon: "Clear 08:00 to 17:30 (5.1 Peak Sun Hours)",
    mdbPhaseRating: "Three-Phase 400V / 200A Main Breaker",
    generatorRating: "150 kVA Perkins Diesel (ATS Working)",
    gridStability: "LEC Grid Available ~6 hrs/day (Voltage fluctuations 180V-250V)",
    earthingOhms: "3.2 Ω Ground Rod (Compliant < 5Ω)",
    cableDistanceMeters: "35 meters to Main Distribution Board",
    batteryRoomEnv: "AC Conditioned 22°C (Ventilation Installed)",
    structuralRisk: "Low Risk - Heavy Steel Rafters Approved"
  });

  useEffect(() => {
    setAuditsList(EcosystemStateEngine.getSolarAudits());
    setLeadsList(EcosystemStateEngine.getSolarLeads());
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
                <span>10th Standalone Subsidiary • TOTAG Smart Energy Platform</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                TOTAG <span className="text-amber-400">Smart Energy Platform</span>
              </h1>
              <p className="text-sm text-slate-300 font-semibold mt-1 max-w-3xl">
                Solar EPC, Energy Management, Remote Monitoring & Lifecycle Services for UN Organizations, Health Facilities, Agribusiness Microgrids, Commercial Enterprises, and Residential Estates.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 text-center justify-center">
                Full EPC Lifecycle + NOC Live
              </Badge>
              <div className="text-right p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block font-bold">Monthly Diesel Avoided:</span>
                <span className="text-xl font-black text-emerald-400">${monthlyDieselSavedUsd.toLocaleString()} USD ({monthlyDieselSavedLiters.toLocaleString()} L)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Full Operating Lifecycle Sequence Indicator */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                End-to-End Enterprise Solar Operating Lifecycle
              </span>
              <span className="text-xs text-slate-400 font-bold">18 Integrated Stages</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">Lead</span> →
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">Site Assessment</span> →
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">Energy Audit</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">System Design</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">BOQ/Costing</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">Proposal</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">Contract</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">Procurement</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">Installation</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">QA/QC</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">Testing</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">Commissioning</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">Handover</span> →
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">Remote Monitoring</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">Preventive Maintenance</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">Warranty/Service</span> →
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">Asset Replacement/Expansion</span>
            </div>
          </div>
        </section>

        {/* Main Application Module Tabs */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-9 bg-slate-900 p-1.5 border-2 border-slate-800 rounded-2xl mb-8 shadow-2xl overflow-x-auto">
              <TabsTrigger value="crm-leads" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Building2 className="h-4 w-4" />
                1. CRM
              </TabsTrigger>
              <TabsTrigger value="site-assessment" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Compass className="h-4 w-4" />
                2. Audit
              </TabsTrigger>
              <TabsTrigger value="system-sizing" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Cpu className="h-4 w-4" />
                3. Design
              </TabsTrigger>
              <TabsTrigger value="catalogue-boq" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <FileSpreadsheet className="h-4 w-4" />
                4. Catalogue
              </TabsTrigger>
              <TabsTrigger value="auto-boq" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Calculator className="h-4 w-4" />
                5. Auto-BOQ
              </TabsTrigger>
              <TabsTrigger value="procurement" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Truck className="h-4 w-4" />
                6. Procurement
              </TabsTrigger>
              <TabsTrigger value="serialized-inventory" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Warehouse className="h-4 w-4" />
                7. Inventory
              </TabsTrigger>
              <TabsTrigger value="project-management" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <FolderKanban className="h-4 w-4" />
                8. Projects
              </TabsTrigger>
              <TabsTrigger value="customer-portal" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <Sun className="h-4 w-4" />
                9. NOC Portal
              </TabsTrigger>
            </TabsList>

            {/* MODULE 1: Solar CRM, Leads & Opportunity Management */}
            <TabsContent value="crm-leads" className="space-y-8">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Header & Pipeline KPI Cards */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        Module 1: Solar Opportunity CRM
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                        {leadsList.length} Active Leads & RFQs
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Solar CRM, Leads & Opportunity Pipeline</h2>
                    <p className="text-slate-400 text-xs mt-1">This is where every opportunity begins — Managing residential, commercial, government, UN, NGO, and RFQ tenders.</p>
                  </div>

                  <Button 
                    onClick={() => setShowNewLeadModal(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    New Solar Lead / Tender Opportunity
                  </Button>
                </div>

                {/* KPI Metrics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-slate-400">TOTAL PIPELINE VALUE</span>
                    <div className="text-2xl font-black text-amber-400">
                      ${leadsList.reduce((acc, l) => acc + (l.estimatedValueUsd || 0), 0).toLocaleString()} USD
                    </div>
                    <span className="text-[11px] text-slate-500">Unweighted Opportunity Sum</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-slate-400">WEIGHTED PIPELINE FORECAST</span>
                    <div className="text-2xl font-black text-emerald-400">
                      ${leadsList.reduce((acc, l) => acc + (l.estimatedValueUsd * (l.probabilityPct / 100)), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                    </div>
                    <span className="text-[11px] text-slate-500">Probability-Weighted Revenue</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-slate-400">UN & GOVT TENDERS / RFQs</span>
                    <div className="text-2xl font-black text-sky-400">
                      {leadsList.filter(l => l.customerCategory === 'UN Organization' || l.customerCategory === 'Government Agency' || l.customerCategory === 'Tender/RFQ/RFP').length}
                    </div>
                    <span className="text-[11px] text-slate-500">High-Value Institutional RFQs</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-slate-400">WIN CONVERSION PROBABILITY</span>
                    <div className="text-2xl font-black text-purple-400">
                      {Math.round(leadsList.reduce((acc, l) => acc + l.probabilityPct, 0) / (leadsList.length || 1))}%
                    </div>
                    <span className="text-[11px] text-slate-500">Average Weighted Win Probability</span>
                  </div>
                </div>

                {/* Interactive Opportunity Pipeline Stages Board */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Visual Solar Opportunity Pipeline Stages</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                    {["New Lead", "Qualified", "Site Assessment Required", "Technical Design", "Commercial Proposal", "Negotiation", "Won / Lost"].map((stage, idx) => {
                      const count = leadsList.filter(l => l.stage === stage || (stage === "Won / Lost" && (l.stage === "Won" || l.stage === "Lost"))).length;
                      return (
                        <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1 text-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{idx + 1}. {stage}</span>
                          <span className="text-lg font-black text-amber-400 block">{count} Leads</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Solar CRM Opportunities Table */}
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-white">Active Solar EPC Opportunities Registry</h3>
                    
                    {/* Category Filter Chips */}
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {["ALL", "Commercial Client", "UN Organization", "Government Agency", "NGO", "Health Facility", "Farm", "Individual Residential"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setLeadCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${leadCategoryFilter === cat ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3">Customer / Institution</th>
                          <th className="p-3">Category & Location</th>
                          <th className="p-3">Load (kW) & Source</th>
                          <th className="p-3">Procurement Method</th>
                          <th className="p-3">Assigned Engineer</th>
                          <th className="p-3">Est. Value ($)</th>
                          <th className="p-3">Pipeline Stage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200 font-semibold bg-slate-900">
                        {(leadsList || [])
                          .filter(l => l && (leadCategoryFilter === "ALL" || l.customerCategory === leadCategoryFilter))
                          .map((lead) => (
                            <tr key={lead.id || Math.random()} className="hover:bg-slate-800/50">
                              <td className="p-3">
                                <div className="font-black text-white">{lead.customerName || "Unnamed Client"}</div>
                                <div className="text-[11px] text-slate-400">{lead.contactPerson} ({lead.phoneEmail})</div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[11px]">{lead.customerCategory}</span>
                                <div className="text-[11px] text-slate-400 mt-0.5">{lead.county}, {lead.district}</div>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-amber-400">{lead.estimatedLoadKw} kW Peak</div>
                                <div className="text-[11px] text-slate-400">{lead.electricitySource}</div>
                              </td>
                              <td className="p-3">
                                <div>{lead.procurementMethod}</div>
                                {lead.tenderNumber && <div className="text-[10px] text-sky-400 font-mono">{lead.tenderNumber}</div>}
                              </td>
                              <td className="p-3 text-slate-300">{lead.assignedEngineer}</td>
                              <td className="p-3">
                                <div className="font-black text-emerald-400">${(lead.estimatedValueUsd || 0).toLocaleString()} USD</div>
                                <div className="text-[10px] text-slate-400">{lead.probabilityPct || 0}% Win Chance</div>
                              </td>
                              <td className="p-3">
                                <select
                                  value={lead.stage}
                                  onChange={(e) => {
                                    EcosystemStateEngine.updateSolarLeadStage(lead.id, e.target.value as SolarLeadItem["stage"]);
                                    setLeadsList(EcosystemStateEngine.getSolarLeads());
                                    toast({ title: "Stage Updated", description: `${lead.customerName} moved to ${e.target.value}` });
                                  }}
                                  className="bg-slate-950 border border-slate-700 text-amber-400 rounded p-1 text-[11px] font-bold"
                                >
                                  <option value="New Lead">New Lead</option>
                                  <option value="Qualified">Qualified</option>
                                  <option value="Site Assessment Required">Site Assessment Required</option>
                                  <option value="Technical Design">Technical Design</option>
                                  <option value="Commercial Proposal">Commercial Proposal</option>
                                  <option value="Negotiation">Negotiation</option>
                                  <option value="Won">Won</option>
                                  <option value="Lost">Lost</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Interactive New Solar Lead Capture Form Modal */}
                {showNewLeadModal && (
                  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                          <h3 className="text-xl font-black text-white">Create New Solar EPC Lead / Opportunity</h3>
                          <p className="text-xs text-slate-400">Capture comprehensive customer profile, GIS coordinates, electrical baseline, and budget.</p>
                        </div>
                        <button onClick={() => setShowNewLeadModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <Label className="text-slate-300">Customer / Institution Name *</Label>
                          <Input value={newLead.customerName} onChange={(e) => setNewLead({ ...newLead, customerName: e.target.value })} className="bg-slate-950 border-slate-800 text-white mt-1" placeholder="e.g. UNDP Liberia / Monrovia Plaza" />
                        </div>
                        <div>
                          <Label className="text-slate-300">Customer Category *</Label>
                          <select value={newLead.customerCategory} onChange={(e) => setNewLead({ ...newLead, customerCategory: e.target.value as SolarLeadItem["customerCategory"] })} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 mt-1 font-semibold">
                            <option value="Individual Residential">Individual Residential</option>
                            <option value="Commercial Client">Commercial Client</option>
                            <option value="Government Agency">Government Agency</option>
                            <option value="NGO">NGO</option>
                            <option value="UN Organization">UN Organization</option>
                            <option value="Health Facility">Health Facility</option>
                            <option value="School">School</option>
                            <option value="Farm">Farm / Agricultural Site</option>
                            <option value="Telecom Installation">Telecom Tower Installation</option>
                            <option value="Industrial Client">Industrial / Factory</option>
                            <option value="Tender/RFQ/RFP">Tender / RFQ / RFP</option>
                            <option value="Reseller Opportunity">Dealer / Reseller Opportunity</option>
                            <option value="Existing Customer Expansion">Existing Customer Expansion</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-slate-300">Contact Person Name</Label>
                          <Input value={newLead.contactPerson} onChange={(e) => setNewLead({ ...newLead, contactPerson: e.target.value })} className="bg-slate-950 border-slate-800 text-white mt-1" placeholder="e.g. Mr. Joseph Sirleaf" />
                        </div>
                        <div>
                          <Label className="text-slate-300">Phone / Email Contact</Label>
                          <Input value={newLead.phoneEmail} onChange={(e) => setNewLead({ ...newLead, phoneEmail: e.target.value })} className="bg-slate-950 border-slate-800 text-white mt-1" placeholder="+231 770 000 000 / email@domain.com" />
                        </div>

                        <div>
                          <Label className="text-slate-300">County & District</Label>
                          <Input value={`${newLead.county}, ${newLead.district}`} onChange={(e) => setNewLead({ ...newLead, county: e.target.value.split(',')[0] || 'Montserrado' })} className="bg-slate-950 border-slate-800 text-white mt-1" placeholder="e.g. Montserrado, Monrovia" />
                        </div>
                        <div>
                          <Label className="text-slate-300">GPS Coordinates</Label>
                          <Input value={newLead.gpsCoords} onChange={(e) => setNewLead({ ...newLead, gpsCoords: e.target.value })} className="bg-slate-950 border-slate-800 text-white mt-1" placeholder="6.3150° N, 10.8072° W" />
                        </div>

                        <div>
                          <Label className="text-slate-300">Estimated Peak Load (kW)</Label>
                          <Input type="number" value={newLead.estimatedLoadKw} onChange={(e) => setNewLead({ ...newLead, estimatedLoadKw: parseFloat(e.target.value) || 10 })} className="bg-slate-950 border-slate-800 text-white mt-1" />
                        </div>
                        <div>
                          <Label className="text-slate-300">Existing Electricity Source</Label>
                          <select value={newLead.electricitySource} onChange={(e) => setNewLead({ ...newLead, electricitySource: e.target.value as SolarLeadItem["electricitySource"] })} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 mt-1 font-semibold">
                            <option value="LEC Grid Only">LEC Grid Only</option>
                            <option value="Diesel Generator Only">Diesel Generator Only</option>
                            <option value="Off-Grid / None">Off-Grid / None</option>
                            <option value="Legacy Solar System">Legacy Solar System</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-slate-300">Procurement Method</Label>
                          <select value={newLead.procurementMethod} onChange={(e) => setNewLead({ ...newLead, procurementMethod: e.target.value as SolarLeadItem["procurementMethod"] })} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 mt-1 font-semibold">
                            <option value="Direct Purchase">Direct Purchase</option>
                            <option value="Tender / RFQ">Tender / RFQ</option>
                            <option value="Solar Lease">Solar Lease</option>
                            <option value="Power Purchase Agreement (PPA)">Power Purchase Agreement (PPA)</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-slate-300">Estimated Project Value ($ USD)</Label>
                          <Input type="number" value={newLead.estimatedValueUsd} onChange={(e) => setNewLead({ ...newLead, estimatedValueUsd: parseFloat(e.target.value) || 10000 })} className="bg-slate-950 border-slate-800 text-white mt-1" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                        <Button variant="outline" onClick={() => setShowNewLeadModal(false)} className="bg-slate-950 border-slate-800 text-slate-300">Cancel</Button>
                        <Button 
                          onClick={() => {
                            if (!newLead.customerName) {
                              alert("Please enter customer name");
                              return;
                            }
                            EcosystemStateEngine.addSolarLead({
                              ...newLead,
                              stage: "New Lead"
                            });
                            setLeadsList(EcosystemStateEngine.getSolarLeads());
                            setShowNewLeadModal(false);
                            toast({ title: "Solar Lead Added", description: `Opportunity for ${newLead.customerName} saved to pipeline.` });
                          }}
                          className="bg-amber-500 text-slate-950 font-black"
                        >
                          Save Lead to CRM Pipeline
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </TabsContent>

            {/* MODULE 2: Solar Site Assessment & Energy Audit */}
            <TabsContent value="site-assessment" className="space-y-8">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      Module 2: Field Engineering Assessment Suite
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
                      Mobile & Tablet Optimized
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white">Solar Site Assessment & Granular Energy Audit</h2>
                  <p className="text-slate-400 text-xs mt-1">Technicians perform on-site audits to inspect structural capacity, shading horizon, electrical MDB, earthing, and itemized load consumption.</p>
                </div>

                {/* 12 Field Inspection Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>1. GPS CAPTURE & SITE COORDS</span>
                      <MapPin className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.gpsCaptured} onChange={(e) => setFieldAssessment({ ...fieldAssessment, gpsCaptured: e.target.value })} className="bg-slate-900 border-slate-800 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Auto-geofenced coordinates for Liberian solar irradiance mapping (4.6 kWh/m²/day).</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>2. ROOF STRUCTURE ASSESSMENT</span>
                      <Building2 className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.roofStructure} onChange={(e) => setFieldAssessment({ ...fieldAssessment, roofStructure: e.target.value })} className="bg-slate-900 border-slate-800 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Corrugated zinc, concrete slab, tilt angle, structural rafter integrity.</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>3. GROUND-MOUNT FOOTPRINT</span>
                      <Compass className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.groundMountArea} onChange={(e) => setFieldAssessment({ ...fieldAssessment, groundMountArea: e.target.value })} className="bg-slate-900 border-slate-800 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Available land footprint, soil compaction, and drainage clearance.</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>4. SHADING & SUN PATH HORIZON</span>
                      <Sun className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.shadingHorizon} onChange={(e) => setFieldAssessment({ ...fieldAssessment, shadingHorizon: e.target.value })} className="bg-slate-900 border-slate-800 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Tree obstruction, adjacent building shadow analysis from 08:00 to 17:30.</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>5. MAIN DISTRIBUTION BOARD (MDB)</span>
                      <Cpu className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.mdbPhaseRating} onChange={(e) => setFieldAssessment({ ...fieldAssessment, mdbPhaseRating: e.target.value })} className="bg-slate-900 border-slate-800 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Single-phase 230V or Three-phase 400V breaker ratings & busbar capacity.</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>6. EARTHING & SURGE RESISTANCE</span>
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.earthingOhms} onChange={(e) => setFieldAssessment({ ...fieldAssessment, earthingOhms: e.target.value })} className="bg-slate-900 border-slate-800 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Grounding rod resistance measured in Ohms (Must be &lt; 5.0 Ω for inverter safety).</p>
                  </div>
                </div>

                {/* Granular Equipment Load Audit Table */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-amber-400" />
                        <span>Granular Itemized Load Audit Engine</span>
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">Every equipment item is entered separately to compute actual Peak Demand (kW), Daily kWh, and Autonomy Battery Storage.</p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                      <span className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-amber-400">
                        Connected: {(auditLoads.reduce((a, b) => a + (b.qty * b.watts), 0) / 1000).toFixed(2)} kW
                      </span>
                      <span className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-emerald-400">
                        Daily Energy: {auditLoads.reduce((a, b) => a + (b.qty * b.watts * b.hours * b.factor / 1000), 0).toFixed(1)} kWh/day
                      </span>
                    </div>
                  </div>

                  {/* Add Equipment Form */}
                  <form onSubmit={handleAddLoad} className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end text-xs font-semibold">
                    <div>
                      <Label className="text-slate-300">Equipment Name</Label>
                      <Input value={newLoad.name} onChange={(e) => setNewLoad({ ...newLoad, name: e.target.value })} placeholder="e.g. Cold Storage Freezer" className="bg-slate-900 border-slate-800 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-slate-300">Quantity</Label>
                      <Input type="number" min="1" value={newLoad.qty} onChange={(e) => setNewLoad({ ...newLead, qty: parseInt(e.target.value) || 1 })} className="bg-slate-900 border-slate-800 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-slate-300">Rated Watts (W)</Label>
                      <Input type="number" min="1" value={newLoad.watts} onChange={(e) => setNewLoad({ ...newLoad, watts: parseInt(e.target.value) || 100 })} className="bg-slate-900 border-slate-800 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-slate-300">Operating Hours/Day</Label>
                      <Input type="number" min="1" max="24" value={newLoad.hours} onChange={(e) => setNewLoad({ ...newLoad, hours: parseInt(e.target.value) || 8 })} className="bg-slate-900 border-slate-800 text-white mt-1" />
                    </div>
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black">
                      + Add Equipment
                    </Button>
                  </form>

                  {/* Audit Loads Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3">Equipment Item</th>
                          <th className="p-3">Qty</th>
                          <th className="p-3">Rated Watts</th>
                          <th className="p-3">Hours / Day</th>
                          <th className="p-3">Diversity (Simultaneous %)</th>
                          <th className="p-3">Peak Load (kW)</th>
                          <th className="p-3">Daily Energy (kWh)</th>
                          <th className="p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200 font-semibold bg-slate-900">
                        {auditLoads.map((item, idx) => {
                          const peakKw = ((item.qty * item.watts * item.factor) / 1000).toFixed(2);
                          const kwh = ((item.qty * item.watts * item.hours * item.factor) / 1000).toFixed(1);
                          return (
                            <tr key={idx} className="hover:bg-slate-800/50">
                              <td className="p-3 font-bold text-white">{item.name}</td>
                              <td className="p-3">{item.qty}</td>
                              <td className="p-3 text-amber-400 font-mono">{item.watts} W</td>
                              <td className="p-3">{item.hours} hrs</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-bold">{Math.round(item.factor * 100)}%</span>
                              </td>
                              <td className="p-3 font-black text-amber-400">{peakKw} kW</td>
                              <td className="p-3 font-black text-emerald-400">{kwh} kWh</td>
                              <td className="p-3">
                                <button onClick={() => handleDeleteLoad(idx)} className="text-rose-400 hover:text-rose-300 font-bold">Remove</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculated Platform Sizing Summary */}
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">CONNECTED LOAD</span>
                      <div className="text-xl font-black text-amber-400">
                        {(auditLoads.reduce((a, b) => a + (b.qty * b.watts), 0) / 1000).toFixed(2)} kW
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">PEAK DEMAND (DIVERSITY)</span>
                      <div className="text-xl font-black text-emerald-400">
                        {(auditLoads.reduce((a, b) => a + (b.qty * b.watts * b.factor), 0) / 1000).toFixed(2)} kW
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">REQUIRED INVERTER SURGE</span>
                      <div className="text-xl font-black text-sky-400">
                        {((auditLoads.reduce((a, b) => a + (b.qty * b.watts * b.factor), 0) / 1000) * 1.5).toFixed(1)} kVA
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">RECOMMENDED BATTERY (14H)</span>
                      <div className="text-xl font-black text-purple-400">
                        {((auditLoads.reduce((a, b) => a + (b.qty * b.watts * b.hours * b.factor / 1000), 0) * 0.6) / 0.8).toFixed(1)} kWh
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </TabsContent>

            {/* 3. Customer Solar Asset & Telemetry Portal */}
            <TabsContent value="customer-portal" className="space-y-8">

              
              {/* Account Selector & Live Status Header */}
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                        Live Customer Solar Asset Portal
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                        ● NOC TELEMETRY ONLINE
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Client Asset Monitoring & Solar Control Center</h2>
                    <p className="text-slate-400 text-xs mt-1">Real-time solar PV generation, LiFePO4 battery SoC, diesel cost savings, and on-demand site survey request engine.</p>
                  </div>

                  {/* Customer Account Switcher */}
                  <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-xl border border-slate-800 w-full md:w-auto">
                    <Label className="text-xs font-bold text-slate-300 whitespace-nowrap px-2">Client Site:</Label>
                    <select 
                      value={customerAccount} 
                      onChange={(e) => setCustomerAccount(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="monrovia-plaza">Monrovia Commercial Plaza (ID: SLR-9042)</option>
                      <option value="zwedru-un">Zwedru UN Field Ops Base (ID: SLR-8812)</option>
                      <option value="sinkor-residence">Sinkor Luxury Residential Villa (ID: SLR-7731)</option>
                      <option value="totag-farm-site">TOTAG Agribusiness Cold-Room (ID: SLR-6620)</option>
                    </select>
                  </div>
                </div>

                {/* 4 Telemetry Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                      <span>SOLAR PV GENERATION</span>
                      <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                    </div>
                    <div className="text-3xl font-black text-white">24.8 kW</div>
                    <div className="text-xs text-slate-400 font-medium">Yield Today: <span className="text-amber-400 font-bold">98.2 kWh</span> (8x 550W PERC)</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-amber-400 h-full w-[85%]" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                      <span>BATTERY STORAGE (SoC)</span>
                      <BatteryCharging className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-black text-white">94%</div>
                    <div className="text-xs text-slate-400 font-medium">Energy Stored: <span className="text-emerald-400 font-bold">48.1 kWh</span> / 51.2 kWh</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-emerald-400 h-full w-[94%]" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs text-sky-400 font-bold">
                      <span>FACILITY LOAD DEMAND</span>
                      <Cpu className="w-4 h-4 text-sky-400" />
                    </div>
                    <div className="text-3xl font-black text-white">16.4 kW</div>
                    <div className="text-xs text-slate-400 font-medium">Coverage: <span className="text-emerald-400 font-bold">100% Solar Driven</span></div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-sky-400 h-full w-[65%]" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs text-rose-400 font-bold">
                      <span>DIESEL GENSET / GRID</span>
                      <Fuel className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="text-3xl font-black text-white">0.0 kW</div>
                    <div className="text-xs text-slate-400 font-medium">Status: <span className="text-emerald-400 font-bold">Standby (Offset: $2,450/mo)</span></div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-rose-500 h-full w-[0%]" />
                    </div>
                  </div>
                </div>

                {/* Operating Mode Switcher */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <span>Select Power System Operating Strategy:</span>
                    </h3>
                    <p className="text-xs text-slate-400">Control how your hybrid inverter prioritizes solar generation, LiFePO4 battery storage, and grid/generator backup.</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={systemMode === 'self-consumption' ? 'default' : 'outline'}
                      onClick={() => setSystemMode('self-consumption')}
                      className={`text-xs font-bold ${systemMode === 'self-consumption' ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-900 text-slate-300 border-slate-700'}`}
                    >
                      <Zap className="w-3.5 h-3.5 mr-1" />
                      Self-Consumption Priority
                    </Button>
                    <Button 
                      variant={systemMode === 'backup-priority' ? 'default' : 'outline'}
                      onClick={() => setSystemMode('backup-priority')}
                      className={`text-xs font-bold ${systemMode === 'backup-priority' ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-slate-900 text-slate-300 border-slate-700'}`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      UPS Backup Priority
                    </Button>
                    <Button 
                      variant={systemMode === 'hybrid-generator' ? 'default' : 'outline'}
                      onClick={() => setSystemMode('hybrid-generator')}
                      className={`text-xs font-bold ${systemMode === 'hybrid-generator' ? 'bg-sky-500 text-slate-950 hover:bg-sky-400' : 'bg-slate-900 text-slate-300 border-slate-700'}`}
                    >
                      <Fuel className="w-3.5 h-3.5 mr-1" />
                      Genset Auto-Start (20% DoD)
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comprehensive Site Survey & Tailored Sizing Request Engine for Customers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Form to Request Tailored Site Survey */}
                <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-amber-400" />
                      <span>Request Comprehensive Site Survey & Engineering Quote</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Submit your facility energy profile. TOTAG Solar Engineers perform shading analysis and deliver tailored system sizing.</p>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-slate-300">
                    <div>
                      <Label className="text-slate-300 text-xs font-bold">Facility / Project Name:</Label>
                      <Input 
                        value={custSurveyForm.name}
                        onChange={(e) => setCustSurveyForm({ ...custSurveyForm, name: e.target.value })}
                        className="bg-slate-950 border-slate-800 text-white mt-1" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300 text-xs font-bold">Peak Daytime Load (kW):</Label>
                        <Input 
                          type="number"
                          value={custSurveyForm.peakLoad}
                          onChange={(e) => setCustSurveyForm({ ...custSurveyForm, peakLoad: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white mt-1" 
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300 text-xs font-bold">Night Load Demand (kW):</Label>
                        <Input 
                          type="number"
                          value={custSurveyForm.nightLoad}
                          onChange={(e) => setCustSurveyForm({ ...custSurveyForm, nightLoad: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white mt-1" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300 text-xs font-bold">Night Battery Autonomy (Hours):</Label>
                        <Input 
                          type="number"
                          value={custSurveyForm.autonomyHours}
                          onChange={(e) => setCustSurveyForm({ ...custSurveyForm, autonomyHours: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white mt-1" 
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300 text-xs font-bold">Direct Phone / WhatsApp:</Label>
                        <Input 
                          value={custSurveyForm.contact}
                          onChange={(e) => setCustSurveyForm({ ...custSurveyForm, contact: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white mt-1" 
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300 text-xs font-bold">Roof Structure & Pitch Orientation:</Label>
                      <Input 
                        value={custSurveyForm.roofType}
                        onChange={(e) => setCustSurveyForm({ ...custSurveyForm, roofType: e.target.value })}
                        className="bg-slate-950 border-slate-800 text-white mt-1" 
                      />
                    </div>

                    <Button 
                      onClick={() => {
                        const kwp = (parseFloat(custSurveyForm.peakLoad || '10') * 1.25).toFixed(1);
                        const kwh = (parseFloat(custSurveyForm.nightLoad || '5') * parseFloat(custSurveyForm.autonomyHours || '10') / 0.8).toFixed(1);
                        EcosystemStateEngine.addSolarAudit({
                          clientName: custSurveyForm.name,
                          location: "Monrovia / Grand Gedeh",
                          pvSizeKwp: parseFloat(kwp),
                          batteryStorageKwh: parseFloat(kwh),
                          annualKwh: parseFloat(kwp) * 4.6 * 365,
                          estimatedCostUsd: parseFloat(kwp) * 1150 + parseFloat(kwh) * 380,
                          roiPaybackYears: 3.2
                        });
                        setAuditsList(EcosystemStateEngine.getSolarAudits());
                        alert(`✅ Site Survey & Sizing Request Submitted!\n\nEngineered PV Array: ${kwp} kWp\nBattery Storage Sized: ${kwh} kWh LiFePO4\n\nTOTAG Solar EPC engineers have been notified for immediate shading study dispatch.`);
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Submit Detailed Site Survey & Load Sizing Request
                    </Button>
                  </div>
                </div>

                {/* Instant Engineered Sizing Preview & Financial Impact */}
                <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl flex flex-col justify-between">
                  <div>
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span>Instant Sizing Preview & Financial ROI</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Real-timeLiberian solar radiance model (4.6 PSH/day) calculated for your requested energy profile.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 font-bold">RECOMMENDED PV ARRAY</div>
                        <div className="text-2xl font-black text-amber-400 mt-1">
                          {(parseFloat(custSurveyForm.peakLoad || '10') * 1.25).toFixed(1)} kWp
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-1">
                          Requires {Math.ceil((parseFloat(custSurveyForm.peakLoad || '10') * 1.25 * 1000) / 550)}x Tier-1 550W Panels
                        </div>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 font-bold">LiFePO4 BATTERY STORAGE</div>
                        <div className="text-2xl font-black text-emerald-400 mt-1">
                          {(parseFloat(custSurveyForm.nightLoad || '5') * parseFloat(custSurveyForm.autonomyHours || '10') / 0.8).toFixed(1)} kWh
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-1">
                          48V 100Ah Rack Modules (80% DoD)
                        </div>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 font-bold">MONTHLY DIESEL SAVED</div>
                        <div className="text-2xl font-black text-sky-400 mt-1">
                          ${(parseFloat(custSurveyForm.peakLoad || '10') * 95).toFixed(0)} USD
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-1">
                          ~{Math.round(parseFloat(custSurveyForm.peakLoad || '10') * 58)} Liters fuel offset/month
                        </div>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 font-bold">ESTIMATED PAYBACK PERIOD</div>
                        <div className="text-2xl font-black text-purple-400 mt-1">
                          3.2 Years
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-1">
                          25-Year Panel Warranty Included
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance SLA & Quick Ticket */}
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        TOTAG 24/7 O&M Service SLA Active
                      </span>
                      <span className="text-slate-400">Next Service: Aug 28, 2026</span>
                    </div>

                    <Button 
                      variant="outline"
                      onClick={() => {
                        setTicketSent(true);
                        alert("✅ Emergency NOC Helpdesk Ticket Opened!\n\nDispatching TOTAG Certified Solar Technicians to your site for inspection.");
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 text-xs font-bold py-2 rounded-lg"
                    >
                      <Activity className="w-3.5 h-3.5 mr-2 text-amber-400" />
                      {ticketSent ? "✅ Dispatch Ticket Active (#TKT-9912)" : "Request Technician Site Visit / Panel Wash"}
                    </Button>
                  </div>
                </div>

              </div>

            </TabsContent>

            {/* MODULE 3: Solar System Sizing & Engineering Design */}
            <TabsContent value="system-sizing" className="space-y-8">
              
              {/* Module Header */}
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-amber-400" />
                        Module 3: Engineering Design Engine
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                        Multi-Scenario Consultative Generator
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Solar System Sizing & Multi-Scenario Engineering Design</h2>
                    <p className="text-slate-400 text-xs mt-1">Determines optimal PV array, hybrid inverter, LiFePO4 battery storage, DC/AC protection, cables, earthing, and ATS generator integration.</p>
                  </div>
                </div>

                {/* Sizing Parameters Engine Bar */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    Engineering Design Parameters & Environmental Coefficients
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-semibold">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">SOLAR IRRADIANCE</span>
                      <span className="text-white font-black text-sm">4.6 PSH / Day</span>
                      <span className="text-slate-500 block text-[10px]">Liberian Radiance</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">BATTERY USABLE DOD</span>
                      <span className="text-emerald-400 font-black text-sm">80% DoD</span>
                      <span className="text-slate-500 block text-[10px]">LiFePO4 Cycle Safe</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">INVERTER EFFICIENCY</span>
                      <span className="text-sky-400 font-black text-sm">96.5% Max</span>
                      <span className="text-slate-500 block text-[10px]">Dual MPPT Loss</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">SYSTEM LOSSFACTOR</span>
                      <span className="text-rose-400 font-black text-sm">14.0% Total</span>
                      <span className="text-slate-500 block text-[10px]">Dirt, Temp & Cable</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">TEMP DERATING</span>
                      <span className="text-amber-400 font-black text-sm">-0.35% / °C</span>
                      <span className="text-slate-500 block text-[10px]">Above 25°C Ambient</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">RESERVE MARGIN</span>
                      <span className="text-purple-400 font-black text-sm">+20% Reserve</span>
                      <span className="text-slate-500 block text-[10px]">Future Expansion</span>
                    </div>
                  </div>
                </div>

                {/* Consultative Sales Multi-Scenario Comparison Engine (Options A, B, C) */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>Consultative Sales Engineering Scenario Comparison</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-bold">3 Tailored Financial & Technical Options</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* OPTION A: Essential Backup */}
                    <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[10px] font-black uppercase">OPTION A</span>
                          <h4 className="text-lg font-black text-white mt-1">Essential Backup</h4>
                        </div>
                        <Badge className="bg-slate-900 text-sky-400 border-sky-500/40 text-xs">Critical Loads</Badge>
                      </div>

                      <p className="text-xs text-slate-400">Targeted backup for critical IT servers, security, LED lighting, and communications.</p>

                      <div className="space-y-2 text-xs font-semibold text-slate-300">
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Inverter Capacity:</span>
                          <span className="text-white font-bold">10 kVA Single-Phase</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>PV Array Capacity:</span>
                          <span className="text-amber-400 font-bold">11.0 kWp (20x 550W)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Battery Storage:</span>
                          <span className="text-emerald-400 font-bold">25.6 kWh LiFePO4</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Usable Energy (@80% DoD):</span>
                          <span className="text-white font-bold">20.5 kWh</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Estimated Autonomy:</span>
                          <span className="text-sky-400 font-bold">8.0 Hours</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Annual Energy Yield:</span>
                          <span className="text-white font-bold">18,469 kWh / yr</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Generator Fuel Offset:</span>
                          <span className="text-emerald-400 font-bold">4,100 L / yr ($5,535 USD)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Payback Period:</span>
                          <span className="text-purple-400 font-bold">3.4 Years</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>CO₂ Avoided:</span>
                          <span className="text-emerald-400 font-bold">12.5 Tons CO₂ / yr</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">CAPITAL INVESTMENT</span>
                          <span className="text-xl font-black text-sky-400">$24,500 USD</span>
                        </div>
                        <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs">
                          Select Option A
                        </Button>
                      </div>
                    </div>

                    {/* OPTION B: Recommended Hybrid (Highlight) */}
                    <div className="bg-slate-950 border-2 border-amber-500 rounded-xl p-5 space-y-4 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                        RECOMMENDED SOLUTON
                      </div>
                      
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase">OPTION B</span>
                          <h4 className="text-lg font-black text-white mt-1">Recommended Hybrid</h4>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300">Optimal balance of solar PV generation, 16-hour LiFePO4 battery autonomy, and auto-genset start integration.</p>

                      <div className="space-y-2 text-xs font-semibold text-slate-300">
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Inverter Capacity:</span>
                          <span className="text-white font-bold">30 kVA Three-Phase Hybrid</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>PV Array Capacity:</span>
                          <span className="text-amber-400 font-bold">33.0 kWp (60x 550W)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Battery Storage:</span>
                          <span className="text-emerald-400 font-bold">76.8 kWh LiFePO4</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Usable Energy (@80% DoD):</span>
                          <span className="text-white font-bold">61.4 kWh</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Estimated Autonomy:</span>
                          <span className="text-amber-400 font-bold">16.0 Hours</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Annual Energy Yield:</span>
                          <span className="text-white font-bold">55,407 kWh / yr</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Generator Fuel Offset:</span>
                          <span className="text-emerald-400 font-bold">12,300 L / yr ($16,605 USD)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Payback Period:</span>
                          <span className="text-purple-400 font-bold">3.2 Years</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>CO₂ Avoided:</span>
                          <span className="text-emerald-400 font-bold">37.4 Tons CO₂ / yr</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-amber-400 block font-bold">CAPITAL INVESTMENT</span>
                          <span className="text-2xl font-black text-amber-400">$62,000 USD</span>
                        </div>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs">
                          Select Option B
                        </Button>
                      </div>
                    </div>

                    {/* OPTION C: Full Energy Independence */}
                    <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">OPTION C</span>
                          <h4 className="text-lg font-black text-white mt-1">Full Independence</h4>
                        </div>
                        <Badge className="bg-slate-900 text-emerald-400 border-emerald-500/40 text-xs">100% Off-Grid</Badge>
                      </div>

                      <p className="text-xs text-slate-400">Complete 24/7 off-grid solar microgrid with zero generator reliance and maximum battery storage.</p>

                      <div className="space-y-2 text-xs font-semibold text-slate-300">
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Inverter Capacity:</span>
                          <span className="text-white font-bold">50 kVA Parallel Microgrid</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>PV Array Capacity:</span>
                          <span className="text-amber-400 font-bold">55.0 kWp (100x 550W)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Battery Storage:</span>
                          <span className="text-emerald-400 font-bold">128.0 kWh LiFePO4</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Usable Energy (@80% DoD):</span>
                          <span className="text-white font-bold">102.4 kWh</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Estimated Autonomy:</span>
                          <span className="text-emerald-400 font-bold">24.0 Hours</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Annual Energy Yield:</span>
                          <span className="text-white font-bold">92,345 kWh / yr</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Generator Fuel Offset:</span>
                          <span className="text-emerald-400 font-bold">20,500 L / yr ($27,675 USD)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>Payback Period:</span>
                          <span className="text-purple-400 font-bold">3.8 Years</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1">
                          <span>CO₂ Avoided:</span>
                          <span className="text-emerald-400 font-bold">62.3 Tons CO₂ / yr</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">CAPITAL INVESTMENT</span>
                          <span className="text-xl font-black text-emerald-400">$112,000 USD</span>
                        </div>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs">
                          Select Option C
                        </Button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Sized Components Engineering Specification Breakdown */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Sized Engineering Component Specifications (Option B Baseline)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-amber-400 font-bold block">1. PV Array & String Config</span>
                      <p className="text-slate-300">60x Tier-1 Mono PERC 550W Panels. 4 Strings of 15 Modules (Voc: 747V DC, Vmp: 628V DC). Compliant with MPPT 1000V DC input ceiling.</p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-emerald-400 font-bold block">2. Inverter & Protection</span>
                      <p className="text-slate-300">30 kVA Deye Three-Phase Hybrid Inverter (IP65 Outdoor). DC 1000V 32A Rotary Isolator, DC 15A Fuses, Type II DC & AC SPDs, 4-Pole 250A ATS.</p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-purple-400 font-bold block">3. Battery Bank & Cabling</span>
                      <p className="text-slate-300">15x LiFePO4 5.12kWh 48V Rack Modules (76.8 kWh total, Smart CANbus BMS). DC Cable: 10mm² UV-Resistant. AC Cable: 4-Core 35mm² XLPE Armored Copper. Earthing: &lt;3.2 Ω rod.</p>
                    </div>
                  </div>
                </div>

              </div>
            </TabsContent>

            {/* MODULE 4: Approved Technical Catalogue & Equipment Specification Database */}
            <TabsContent value="catalogue-boq" className="space-y-8">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                
                <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                        Module 4: Technical Equipment Catalogue
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                        UNICEF, UNDP, CRS & UNFPA Compliant
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white">TOTAG Approved Component & Technical Specification Catalogue</h2>
                    <p className="text-slate-400 text-xs mt-1">Pre-approved technical specifications for PV modules, inverters, LiFePO4 batteries, switchgear, ATS, and SPDs — eliminating repetitive spec creation for proposals.</p>
                  </div>
                </div>

                {/* Equipment Records Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Category 1: PV Modules */}
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-amber-400" />
                        PV MODULES (TIER-1 MONO PERC & TOPCON)
                      </span>
                      <Badge className="bg-slate-900 text-amber-400 text-[10px]">25-Yr Linear Warranty</Badge>
                    </div>

                    <div className="space-y-2 text-xs font-semibold text-slate-300">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex justify-between font-black text-white">
                          <span>Jinko / Longi 550W Mono PERC Module</span>
                          <span className="text-amber-400">$185 USD</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Voc: 49.8V • Vmp: 41.9V • Isc: 13.9A • Imp: 13.1A • 21.3% Efficiency</p>
                        <div className="text-[10px] text-emerald-400 font-mono">Dimensions: 2278x1134x35mm (27.5kg) | IEC 61215, IEC 61730, TUV, CE Certified</div>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex justify-between font-black text-white">
                          <span>Trina Solar 670W N-Type TOPCon Module</span>
                          <span className="text-amber-400 font-bold">$235 USD</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Voc: 45.4V • Vmp: 38.2V • Isc: 18.6A • Imp: 17.5A • 21.8% Efficiency</p>
                        <div className="text-[10px] text-emerald-400 font-mono">Dimensions: 2384x1303x35mm (33.9kg) | Dual Glass Bifacial N-Type</div>
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Inverters */}
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-emerald-400" />
                        INVERTERS (HYBRID THREE-PHASE & SINGLE-PHASE)
                      </span>
                      <Badge className="bg-slate-900 text-emerald-400 text-[10px]">5-Yr Factory Warranty</Badge>
                    </div>

                    <div className="space-y-2 text-xs font-semibold text-slate-300">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex justify-between font-black text-white">
                          <span>Deye 10kW Three-Phase Hybrid Inverter</span>
                          <span className="text-amber-400">$2,450 USD</span>
                        </div>
                        <p className="text-[11px] text-slate-400">10kVA • 48V Battery • 2 MPPT (1000V DC) • 200% Overload • IP65 Outdoor</p>
                        <div className="text-[10px] text-emerald-400 font-mono">Modbus RS485 / CANbus | Auto Genset Start | 16x Parallel Capable</div>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex justify-between font-black text-white">
                          <span>Victron Quattro 15kVA Inverter/Charger</span>
                          <span className="text-amber-400 font-bold">$3,850 USD</span>
                        </div>
                        <p className="text-[11px] text-slate-400">15kVA • Dual AC Inputs • 48V 200A Charger • PowerAssist Peak Shaving</p>
                        <div className="text-[10px] text-emerald-400 font-mono">VE.Bus / VE.Can Protocol | Seamless 20ms UPS Transfer</div>
                      </div>
                    </div>
                  </div>

                  {/* Category 3: Batteries */}
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BatteryCharging className="w-4 h-4 text-purple-400" />
                        BATTERY STORAGE (LIFEPO4 RACK MODULES)
                      </span>
                      <Badge className="bg-slate-900 text-purple-400 text-[10px]">10-Yr Pro-Rated Warranty</Badge>
                    </div>

                    <div className="space-y-2 text-xs font-semibold text-slate-300">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex justify-between font-black text-white">
                          <span>Pylontech US5000 4.8kWh LiFePO4 Rack Module</span>
                          <span className="text-amber-400">$1,350 USD</span>
                        </div>
                        <p className="text-[11px] text-slate-400">48V 100Ah • 3.84 kWh Usable (80% DoD) • 6,000 Cycles @ 90% DoD • Smart BMS</p>
                        <div className="text-[10px] text-emerald-400 font-mono">CANbus & RS485 Protocol | Compatible with Deye, Victron, Growatt</div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex justify-between font-black text-white">
                          <span>Hubble AM-2 5.5kWh 48V Lithium Battery</span>
                          <span className="text-amber-400 font-bold">$1,580 USD</span>
                        </div>
                        <p className="text-[11px] text-slate-400">51.2V 110Ah • 4.4 kWh Usable (80% DoD) • Cloud Monitoring Gateway Included</p>
                        <div className="text-[10px] text-emerald-400 font-mono">100A Continuous Discharge | Built-in Fire Suppression Aerosol</div>
                      </div>
                    </div>
                  </div>

                  {/* Category 4: Balance of Plant (BoP), Switchgear, ATS & SPDs */}
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-sky-400" />
                        BALANCE OF PLANT (SWITCHGEAR, ATS & SPDs)
                      </span>
                      <Badge className="bg-slate-900 text-sky-400 text-[10px]">IEC & CE Certified</Badge>
                    </div>

                    <div className="space-y-2 text-xs font-semibold text-slate-300">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">4-String IP65 DC Combiner Box w/ SPDs & Fuses</div>
                          <div className="text-[10px] text-slate-400">1000V DC • 15A Fuses • Type II DC Surge Arrestor • ABB Switchgear</div>
                        </div>
                        <span className="text-amber-400 font-black">$240 USD</span>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">4-Pole 250A Automatic Transfer Switch (ATS)</div>
                          <div className="text-[10px] text-slate-400">Dual Utility/Genset Transfer • Auto Dry Contacts • Schneider Electric</div>
                        </div>
                        <span className="text-amber-400 font-black">$480 USD</span>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">Solar DC Cable 10mm² UV-Resistant (100m Roll)</div>
                          <div className="text-[10px] text-slate-400">Double Insulated Tinned Copper • 1500V DC Rated • TÜV Approved</div>
                        </div>
                        <span className="text-amber-400 font-black">$165 USD</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </TabsContent>

            {/* MODULE 5: Automated BOQ & Financial Costing Engine */}
            <TabsContent value="auto-boq" className="space-y-8">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Module Header */}
                <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-amber-400" />
                        Module 5: Financial BOQ Costing Engine
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                        Landed Cost & Margin Analysis
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Automated Bill of Quantities (BOQ) & Tender Costing Engine</h2>
                    <p className="text-slate-400 text-xs mt-1">Calculates equipment FOB cost, freight, insurance, customs clearing, inland transport, site labor, overhead, contingency, and gross margin.</p>
                  </div>

                  <Button onClick={() => alert("✅ Tender BOQ Dossier Generated!\n\nExported complete itemized bill of quantities with landed logistics costing for client commercial submission.")} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-5 shadow-lg">
                    <Printer className="w-4 h-4 mr-2" /> Export Commercial Tender BOQ PDF
                  </Button>
                </div>

                {/* Management Financial KPI Cards: Equipment vs Landed vs Installed vs Contract vs Margin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">1. EQUIPMENT FOB COST</span>
                    <div className="text-xl font-black text-white">$38,400 USD</div>
                    <span className="text-[10px] text-slate-500 font-medium">Base Supplier Invoices</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-sky-400 uppercase">2. LANDED LOGISTICS COST</span>
                    <div className="text-xl font-black text-sky-400">$44,850 USD</div>
                    <span className="text-[10px] text-sky-300/80 font-medium">+Freight, Duty & Clearing</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase">3. TURNKEY INSTALLED COST</span>
                    <div className="text-xl font-black text-purple-400">$53,100 USD</div>
                    <span className="text-[10px] text-purple-300/80 font-medium">+Labor, Overhead & Cont.</span>
                  </div>

                  <div className="bg-slate-950 border border-amber-500/50 p-4 rounded-xl space-y-1 bg-amber-500/5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">4. CONTRACT SELLING PRICE</span>
                    <div className="text-xl font-black text-amber-400">$68,500 USD</div>
                    <span className="text-[10px] text-amber-300/80 font-medium">Final Tender Price</span>
                  </div>

                  <div className="bg-slate-950 border border-emerald-500/50 p-4 rounded-xl space-y-1 bg-emerald-500/5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">5. GROSS PROFIT MARGIN</span>
                    <div className="text-xl font-black text-emerald-400">$15,400 USD</div>
                    <span className="text-[10px] text-emerald-400 font-bold">22.5% Gross Margin</span>
                  </div>
                </div>

                {/* Detailed BOQ Cost Breakdown Table */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                      <span>Itemized BOQ Cost Engineering Breakdown</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-semibold">Project Ref: #BOQ-2026-MONROVIA-09</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                          <th className="py-2.5 px-3">Item Description</th>
                          <th className="py-2.5 px-2">Category</th>
                          <th className="py-2.5 px-2">Supplier</th>
                          <th className="py-2.5 px-2 text-center">Qty / Unit</th>
                          <th className="py-2.5 px-2 text-right">Base FOB ($)</th>
                          <th className="py-2.5 px-2 text-right">Freight & Duty ($)</th>
                          <th className="py-2.5 px-2 text-right">Landed Cost ($)</th>
                          <th className="py-2.5 px-2 text-right">Installed Cost ($)</th>
                          <th className="py-2.5 px-3 text-right">Selling Price ($)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 font-semibold text-slate-300">
                        
                        <tr>
                          <td className="py-2.5 px-3 text-white font-bold">20 × 550W Tier-1 Mono PERC Solar PV Modules</td>
                          <td className="py-2.5 px-2 text-amber-400">PV Modules</td>
                          <td className="py-2.5 px-2">Jinko Solar</td>
                          <td className="py-2.5 px-2 text-center font-bold">20 Pcs</td>
                          <td className="py-2.5 px-2 text-right">$3,700</td>
                          <td className="py-2.5 px-2 text-right">$640</td>
                          <td className="py-2.5 px-2 text-right text-sky-400 font-bold">$4,340</td>
                          <td className="py-2.5 px-2 text-right text-purple-400 font-bold">$5,100</td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-black">$6,580</td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 text-white font-bold">1 × 10kVA Three-Phase Hybrid Inverter w/ ATS Port</td>
                          <td className="py-2.5 px-2 text-emerald-400">Inverters</td>
                          <td className="py-2.5 px-2">Deye Energy</td>
                          <td className="py-2.5 px-2 text-center font-bold">1 Unit</td>
                          <td className="py-2.5 px-2 text-right">$2,450</td>
                          <td className="py-2.5 px-2 text-right">$320</td>
                          <td className="py-2.5 px-2 text-right text-sky-400 font-bold">$2,770</td>
                          <td className="py-2.5 px-2 text-right text-purple-400 font-bold">$3,300</td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-black">$4,250</td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 text-white font-bold">2 × 5.12kWh 48V LiFePO4 Rack Battery Modules (10.24 kWh)</td>
                          <td className="py-2.5 px-2 text-purple-400">Batteries</td>
                          <td className="py-2.5 px-2">Pylontech</td>
                          <td className="py-2.5 px-2 text-center font-bold">2 Units</td>
                          <td className="py-2.5 px-2 text-right">$2,700</td>
                          <td className="py-2.5 px-2 text-right">$410</td>
                          <td className="py-2.5 px-2 text-right text-sky-400 font-bold">$3,110</td>
                          <td className="py-2.5 px-2 text-right text-purple-400 font-bold">$3,650</td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-black">$4,700</td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 text-white font-bold">1 × 4-String IP65 Outdoor PV DC Combiner Box w/ SPDs</td>
                          <td className="py-2.5 px-2 text-sky-400">Balance of Plant</td>
                          <td className="py-2.5 px-2">ABB</td>
                          <td className="py-2.5 px-2 text-center font-bold">1 Set</td>
                          <td className="py-2.5 px-2 text-right">$240</td>
                          <td className="py-2.5 px-2 text-right">$45</td>
                          <td className="py-2.5 px-2 text-right text-sky-400 font-bold">$285</td>
                          <td className="py-2.5 px-2 text-right text-purple-400 font-bold">$380</td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-black">$510</td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 text-white font-bold">1 × 4-Pole 250A Automatic Transfer Switch (ATS)</td>
                          <td className="py-2.5 px-2 text-sky-400">Balance of Plant</td>
                          <td className="py-2.5 px-2">Schneider</td>
                          <td className="py-2.5 px-2 text-center font-bold">1 Unit</td>
                          <td className="py-2.5 px-2 text-right">$480</td>
                          <td className="py-2.5 px-2 text-right">$65</td>
                          <td className="py-2.5 px-2 text-right text-sky-400 font-bold">$545</td>
                          <td className="py-2.5 px-2 text-right text-purple-400 font-bold">$710</td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-black">$950</td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 text-white font-bold">100m DC 10mm² UV Solar Cable + 50m AC 35mm² Armored Cable</td>
                          <td className="py-2.5 px-2 text-slate-300">Cables & Wiring</td>
                          <td className="py-2.5 px-2">TÜV Approved</td>
                          <td className="py-2.5 px-2 text-center font-bold">150m</td>
                          <td className="py-2.5 px-2 text-right">$380</td>
                          <td className="py-2.5 px-2 text-right">$55</td>
                          <td className="py-2.5 px-2 text-right text-sky-400 font-bold">$435</td>
                          <td className="py-2.5 px-2 text-right text-purple-400 font-bold">$620</td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-black">$820</td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 text-white font-bold">Rooftop Mounting Structure + Copper Earthing Protection</td>
                          <td className="py-2.5 px-2 text-amber-400">Structure</td>
                          <td className="py-2.5 px-2">TOTAG Struct</td>
                          <td className="py-2.5 px-2 text-center font-bold">1 Lot</td>
                          <td className="py-2.5 px-2 text-right">$650</td>
                          <td className="py-2.5 px-2 text-right">$90</td>
                          <td className="py-2.5 px-2 text-right text-sky-400 font-bold">$740</td>
                          <td className="py-2.5 px-2 text-right text-purple-400 font-bold">$1,050</td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-black">$1,400</td>
                        </tr>

                        <tr className="bg-slate-900/80">
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">EPC Installation Labor, Mobilization & Civil Works</td>
                          <td className="py-2.5 px-2 text-emerald-400">Services</td>
                          <td className="py-2.5 px-2">TOTAG EPC</td>
                          <td className="py-2.5 px-2 text-center font-bold">1 Job</td>
                          <td className="py-2.5 px-2 text-right">$0</td>
                          <td className="py-2.5 px-2 text-right">$0</td>
                          <td className="py-2.5 px-2 text-right text-slate-400">$0</td>
                          <td className="py-2.5 px-2 text-right text-purple-400 font-bold">$2,800</td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-black">$3,800</td>
                        </tr>

                        <tr className="bg-slate-900/80">
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">QA/QC Testing, Digital Commissioning & Staff Training</td>
                          <td className="py-2.5 px-2 text-emerald-400">Services</td>
                          <td className="py-2.5 px-2">TOTAG Engineers</td>
                          <td className="py-2.5 px-2 text-center font-bold">1 Event</td>
                          <td className="py-2.5 px-2 text-right">$0</td>
                          <td className="py-2.5 px-2 text-right">$0</td>
                          <td className="py-2.5 px-2 text-right text-slate-400">$0</td>
                          <td className="py-2.5 px-2 text-right text-purple-400 font-bold">$1,200</td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-black">$1,600</td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </TabsContent>

            {/* MODULE 6: Solar Procurement & OEM Supplier Partnership Registry */}
            <TabsContent value="procurement" className="space-y-8">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Module Header */}
                <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        Module 6: Procurement & OEM Partnerships
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                        Automated Requisitions & Serial Intake
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Solar Procurement, Shipping & Manufacturer Partnership Registry</h2>
                    <p className="text-slate-400 text-xs mt-1">Triggers auto-requisitions for won projects, tracks PO status, captures serial numbers upon warehouse receipt, and manages official OEM dealer authorizations.</p>
                  </div>
                </div>

                {/* 8-Stage Procurement Workflow Stepper */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-amber-400" />
                    Automated Won Project Procurement Flow
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-8 gap-2 text-[10px] font-bold text-center">
                    <div className="bg-amber-500 text-slate-950 p-2 rounded-lg font-black">1. Requisition</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800">2. Supplier RFQ</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800">3. Quote Matrix</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800">4. PO Issued</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800">5. In Transit</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800">6. Customs Clearance</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800">7. Serial Intake</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800">8. Warehouse Receipt</div>
                  </div>
                </div>

                {/* Active Procurement Orders & Requisitions */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Barcode className="w-4 h-4 text-emerald-400" />
                      <span>Active Project Purchase Requisitions & Serial Intake</span>
                    </h3>
                    <Button onClick={() => alert("✅ Serial Number Intake Complete!\n\nCaptured 20x PV Module & 2x Battery Serial Barcodes into TOTAG Asset Ledger.")} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs">
                      <Barcode className="w-3.5 h-3.5 mr-1.5" /> Scan Warehouse Barcodes
                    </Button>
                  </div>

                  <div className="space-y-3 text-xs font-semibold text-slate-300">
                    
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30 text-[10px]">PO #PO-DEYE-9921</Badge>
                          <span className="text-white font-black">Monrovia Hospital 30kVA Solar Hybrid Microgrid</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">Supplier: Deye Energy • 1x 30kW Hybrid Inverter • Container #MSCU-881920</p>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Tracking: MSCU7719203 | Status: Customs Clearance @ Freeport of Monrovia</div>
                      </div>
                      <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 self-start md:self-center">Customs Clearance</Badge>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">PO #PO-JK-8824</Badge>
                          <span className="text-white font-black">UNICEF Regional Office Solar Backup System</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">Supplier: Jinko Solar • 60x 550W Mono PERC Modules • Serial Intake Complete</p>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Serials: JK-550W-2026-98124 through JK-550W-2026-98184 (Inspected & Verified)</div>
                      </div>
                      <Badge className="bg-sky-500 text-slate-950 font-black text-xs px-3 py-1 self-start md:self-center">Warehouse Intake Complete</Badge>
                    </div>

                  </div>
                </div>

                {/* TOTAG Official OEM Manufacturer & Supplier Partnership Registry */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <BadgeCheck className="w-5 h-5 text-amber-400" />
                      <span>Official OEM Manufacturer & Partnership Registry</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-bold">Authorized Dealer Credentials</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* OEM 1: Deye */}
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <div>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">AUTHORIZED DISTRIBUTOR</Badge>
                          <h4 className="text-base font-black text-white mt-1">Deye Energy Co., Ltd</h4>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold">Valid: Dec 2028</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 font-semibold">
                        <div className="flex justify-between">
                          <span className="text-slate-400">TOTAG Partner Role:</span>
                          <span className="text-white font-bold">Authorized Distributor & Service Partner</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Authorization Ref:</span>
                          <span className="text-amber-400 font-mono">DEYE-AFR-AUTH-2026-991</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Product Scope:</span>
                          <span className="text-slate-200">Single & Three-Phase Hybrid Inverters (3kW to 50kW)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Technical Support SLA:</span>
                          <span className="text-emerald-400 font-bold">Direct Factory Firmware & 5-Yr Replacement</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">OEM Contact Person:</span>
                          <span className="text-white">Chen Wei (Africa OEM Relations Lead)</span>
                        </div>
                      </div>
                    </div>

                    {/* OEM 2: Victron Energy */}
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <div>
                          <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30 text-[10px]">SYSTEM INTEGRATOR</Badge>
                          <h4 className="text-base font-black text-white mt-1">Victron Energy B.V.</h4>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold">Valid: Dec 2027</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 font-semibold">
                        <div className="flex justify-between">
                          <span className="text-slate-400">TOTAG Partner Role:</span>
                          <span className="text-white font-bold">Certified Dealer & Systems Integrator</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Authorization Ref:</span>
                          <span className="text-sky-400 font-mono">VIC-WESTAF-2025-081</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Product Scope:</span>
                          <span className="text-slate-200">Quattro/MultiPlus Inverters, SmartSolar MPPTs, Cerbo GX</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Technical Support SLA:</span>
                          <span className="text-emerald-400 font-bold">VE.Can Protocol Access & 5-Yr Warranty</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">OEM Contact Person:</span>
                          <span className="text-white">Jan van der Merwe (Regional Tech Lead)</span>
                        </div>
                      </div>
                    </div>

                    {/* OEM 3: Jinko Solar */}
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <div>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">DIRECT IMPORTER</Badge>
                          <h4 className="text-base font-black text-white mt-1">Jinko Solar Co., Ltd</h4>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold">Valid: Dec 2029</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 font-semibold">
                        <div className="flex justify-between">
                          <span className="text-slate-400">TOTAG Partner Role:</span>
                          <span className="text-white font-bold">Tier-1 Direct Importer & Distributor</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Authorization Ref:</span>
                          <span className="text-emerald-400 font-mono">JINKO-LIB-DIST-2026</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Product Scope:</span>
                          <span className="text-slate-200">Tiger Neo N-Type TOPCon & Mono PERC PV Panels (550W-670W)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Technical Support SLA:</span>
                          <span className="text-emerald-400 font-bold">25-Year Linear Performance Guarantee</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">OEM Contact Person:</span>
                          <span className="text-white">Grace Zhao (Global Sales Director)</span>
                        </div>
                      </div>
                    </div>

                    {/* OEM 4: Pylontech */}
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <div>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">STORAGE PARTNER</Badge>
                          <h4 className="text-base font-black text-white mt-1">Pylontech Technologies</h4>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold">Valid: Dec 2028</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 font-semibold">
                        <div className="flex justify-between">
                          <span className="text-slate-400">TOTAG Partner Role:</span>
                          <span className="text-white font-bold">Lithium Battery Storage Partner</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Authorization Ref:</span>
                          <span className="text-purple-400 font-mono">PYLON-AFR-DEALER-449</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Product Scope:</span>
                          <span className="text-slate-200">US2000C / US3000C / US5000 48V LiFePO4 Rack Storage</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Technical Support SLA:</span>
                          <span className="text-emerald-400 font-bold">6,000 Cycles @ 90% DoD & Smart BMS Protocol</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">OEM Contact Person:</span>
                          <span className="text-white">Marcus Thorne (Technical Sales Manager)</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </TabsContent>

            {/* MODULE 7: Solar Warehouse & Serialized Inventory Management */}
            <TabsContent value="serialized-inventory" className="space-y-8">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Module Header */}
                <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Warehouse className="w-3.5 h-3.5 text-amber-400" />
                        Module 7: Serialized Inventory Ledger
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                        100% Component Traceability
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Solar Warehouse & Serialized Asset Lifecycle Management</h2>
                    <p className="text-slate-400 text-xs mt-1">Tracks serial numbers, supplier POs, warehouse locations, project site allocations, installation dates, and manufacturer warranties for inverters, batteries, smart meters, and gateways.</p>
                  </div>

                  <Button onClick={() => alert("✅ Serialized Asset Recorded!\n\nCaptured new serial barcode into TOTAG Master Asset Registry.")} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-5 shadow-lg">
                    <Barcode className="w-4 h-4 mr-2" /> Register Serialized Equipment
                  </Button>
                </div>

                {/* Warehouse Serial Summary KPI Bar */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-semibold">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">TOTAL SERIALIZED ASSETS</span>
                    <div className="text-2xl font-black text-white">148 Units</div>
                    <span className="text-slate-500 block text-[10px]">Inverters, Batteries, Gateways</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">MONROVIA CENTRAL STOCK</span>
                    <div className="text-2xl font-black text-amber-400">62 Units</div>
                    <span className="text-slate-500 block text-[10px]">Bushrod Island Warehouse</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">PROJECT ALLOCATED</span>
                    <div className="text-2xl font-black text-sky-400">34 Units</div>
                    <span className="text-slate-500 block text-[10px]">Staged for Site Dispatch</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">INSTALLED ON-SITE</span>
                    <div className="text-2xl font-black text-emerald-400">48 Units</div>
                    <span className="text-slate-500 block text-[10px]">Active Customer Assets</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">WARRANTY COVERAGE</span>
                    <div className="text-2xl font-black text-purple-400">100% Active</div>
                    <span className="text-slate-500 block text-[10px]">Manufacturer Backed</span>
                  </div>
                </div>

                {/* Serialized Equipment Ledger Table */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Barcode className="w-4 h-4 text-emerald-400" />
                      <span>Serialized Equipment Master Ledger & Audit Trail</span>
                    </h3>
                    <Input 
                      placeholder="Search Serial Number, Model, PO#, or Site..." 
                      className="bg-slate-900 border-slate-800 text-xs text-white max-w-xs"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                          <th className="py-2.5 px-3">Equipment Category</th>
                          <th className="py-2.5 px-2">Manufacturer & Model</th>
                          <th className="py-2.5 px-2">Serial Number (S/N)</th>
                          <th className="py-2.5 px-2">Supplier & PO#</th>
                          <th className="py-2.5 px-2">Location / Site Allocation</th>
                          <th className="py-2.5 px-2">Installation Date</th>
                          <th className="py-2.5 px-2">Warranty Expiry</th>
                          <th className="py-2.5 px-3 text-right">Current Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 font-semibold text-slate-300">
                        
                        <tr>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5" /> Hybrid Inverter
                          </td>
                          <td className="py-2.5 px-2 text-white font-bold">Deye SUN-30K-SG01HP3</td>
                          <td className="py-2.5 px-2 text-amber-400 font-mono font-bold">SN-DEYE-30K-991823</td>
                          <td className="py-2.5 px-2">Deye Factory (PO #PO-DEYE-9921)</td>
                          <td className="py-2.5 px-2 text-slate-200">Redemption Hospital Rooftop</td>
                          <td className="py-2.5 px-2">Aug 12, 2026</td>
                          <td className="py-2.5 px-2 text-emerald-400 font-mono">Aug 12, 2031 (5 Yrs)</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge className="bg-emerald-500 text-slate-950 text-[10px] font-black">Installed & Active</Badge>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 text-purple-400 font-bold flex items-center gap-1.5">
                            <BatteryCharging className="w-3.5 h-3.5" /> LiFePO4 Battery
                          </td>
                          <td className="py-2.5 px-2 text-white font-bold">Pylontech US5000 4.8kWh</td>
                          <td className="py-2.5 px-2 text-amber-400 font-mono font-bold">SN-PYLON-5K-881920</td>
                          <td className="py-2.5 px-2">Pylontech (PO #PO-PYL-4412)</td>
                          <td className="py-2.5 px-2 text-slate-200">Redemption Hospital Battery Room</td>
                          <td className="py-2.5 px-2">Aug 12, 2026</td>
                          <td className="py-2.5 px-2 text-emerald-400 font-mono">Aug 12, 2036 (10 Yrs)</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge className="bg-emerald-500 text-slate-950 text-[10px] font-black">Installed & Active</Badge>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 text-purple-400 font-bold flex items-center gap-1.5">
                            <BatteryCharging className="w-3.5 h-3.5" /> LiFePO4 Battery
                          </td>
                          <td className="py-2.5 px-2 text-white font-bold">Hubble AM-2 5.5kWh 48V</td>
                          <td className="py-2.5 px-2 text-amber-400 font-mono font-bold">SN-HUBBLE-AM2-77123</td>
                          <td className="py-2.5 px-2">Hubble Energy (PO #PO-HUB-2201)</td>
                          <td className="py-2.5 px-2 text-slate-200">Monrovia Central Warehouse</td>
                          <td className="py-2.5 px-2 text-slate-500">Uninstalled</td>
                          <td className="py-2.5 px-2 text-emerald-400 font-mono">Jul 15, 2036 (10 Yrs)</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge className="bg-slate-800 text-amber-400 border-amber-500/30 text-[10px]">In Warehouse Stock</Badge>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 text-sky-400 font-bold flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" /> Monitoring Gateway
                          </td>
                          <td className="py-2.5 px-2 text-white font-bold">Victron Cerbo GX Gateway</td>
                          <td className="py-2.5 px-2 text-amber-400 font-mono font-bold">SN-VIC-CERBO-55102</td>
                          <td className="py-2.5 px-2">Victron B.V. (PO #PO-VIC-1182)</td>
                          <td className="py-2.5 px-2 text-slate-200">UNICEF Nimba Regional Office</td>
                          <td className="py-2.5 px-2">Aug 02, 2026</td>
                          <td className="py-2.5 px-2 text-emerald-400 font-mono">Aug 02, 2031 (5 Yrs)</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge className="bg-sky-500 text-slate-950 text-[10px] font-black">Installed & Active</Badge>
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 text-amber-400 font-bold flex items-center gap-1.5">
                            <Gauge className="w-3.5 h-3.5" /> Smart Meter
                          </td>
                          <td className="py-2.5 px-2 text-white font-bold">Eastron SDM630 Three-Phase Meter</td>
                          <td className="py-2.5 px-2 text-amber-400 font-mono font-bold">SN-EASTRON-630-4491</td>
                          <td className="py-2.5 px-2">Eastron (PO #PO-EAS-009)</td>
                          <td className="py-2.5 px-2 text-slate-200">Gbarnga Field Depot Yard</td>
                          <td className="py-2.5 px-2 text-slate-500">Uninstalled</td>
                          <td className="py-2.5 px-2 text-emerald-400 font-mono">Jun 10, 2028 (2 Yrs)</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge className="bg-slate-800 text-sky-400 border-sky-500/30 text-[10px]">Allocated to Project</Badge>
                          </td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </TabsContent>

            {/* MODULE 8: Project & 15-Stage Verified Installation Workflow Management */}
            <TabsContent value="project-management" className="space-y-8">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Module Header */}
                <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <FolderKanban className="w-3.5 h-3.5 text-amber-400" />
                        Module 8: Turnkey Project & Workflow Management
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                        15-Stage Verified Installation Pipeline
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Solar Project Execution & 15-Stage Evidence Installation Workflow</h2>
                    <p className="text-slate-400 text-xs mt-1">Monitors turnkey project budgets, actual costs, team assignments, risk status, and enforces evidence verification for each installation stage from Mobilization to Commissioning.</p>
                  </div>

                  <Button onClick={() => alert("✅ New Solar EPC Project Created!\n\nInitialized 15-Stage Installation Workflow Tracker for project team.")} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-5 shadow-lg">
                    <Plus className="w-4 h-4 mr-2" /> Initialize Won Contract Project
                  </Button>
                </div>

                {/* Project Executive Overview Dashboard Cards */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">ACTIVE EPC CONTRACT #PRJ-2026-001</span>
                      <h3 className="text-lg font-black text-white mt-0.5">Monrovia Regional Hospital 30kW Solar Hybrid Microgrid</h3>
                      <p className="text-xs text-slate-400">Client: Ministry of Health / USAID • Location: Bushrod Island, Montserrado County</p>
                    </div>
                    <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1">75% Installation Progress</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-semibold">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">CONTRACT VALUE</span>
                      <span className="text-amber-400 font-black text-sm">$68,500 USD</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">SYSTEM CAPACITY</span>
                      <span className="text-white font-black text-sm">33 kWp / 76.8 kWh</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">PROJECT MANAGER</span>
                      <span className="text-slate-200 font-bold text-xs">Eng. Tarkpor Toe</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">BUDGET vs ACTUAL</span>
                      <span className="text-emerald-400 font-black text-sm">$53.1k / $41.2k</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">TARGET COMPLETION</span>
                      <span className="text-sky-400 font-black text-xs">Aug 30, 2026</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">RISK STATUS</span>
                      <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Low Risk
                      </span>
                    </div>
                  </div>
                </div>

                {/* 15-Stage Verified Installation Workflow Tracker */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Workflow className="w-4 h-4 text-amber-400" />
                        <span>Mandatory 15-Stage Installation Workflow (Evidence Verification Required)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Each stage requires technician evidence sign-off before advancing to subsequent milestone.</p>
                    </div>
                    <span className="text-xs text-emerald-400 font-black">11 of 15 Stages Verified & Signed</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
                    
                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>1. Mobilization</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">Site team & vehicles dispatched to Bushrod Island site.</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: Eng. Toe • Aug 01, 2026</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>2. Site Verification</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">Structural roof load test & azimuth verified.</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: Tech Saye • Aug 02, 2026</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>3. Material Dispatch</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">Containers delivered & unboxed at site yard.</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: Logis. Kollie • Aug 03, 2026</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>4. Mounting Structure</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">Rooftop aluminum rails secured & ballasted.</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: Tech Saye • Aug 05, 2026</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>5. PV Module Array</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">60x 550W modules mounted & string-wired.</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: Eng. Flomo • Aug 07, 2026</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>6. Battery Installation</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">15x LiFePO4 rack modules wired & BMS linked.</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: Eng. Flomo • Aug 09, 2026</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>7. Inverter Mounting</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">30kW Deye Hybrid mounted on wall brackets.</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: Tech Saye • Aug 10, 2026</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>8. DC Electrical Wiring</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">10mm² solar cables routed in heavy conduit.</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: Tech Saye • Aug 11, 2026</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>9. AC Electrical Wiring</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">35mm² armored copper cable connected to MDB.</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: Eng. Toe • Aug 12, 2026</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>10. Generator / ATS Sync</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">4-Pole 250A ATS connected to standby diesel genset.</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: Eng. Toe • Aug 13, 2026</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-black">
                        <span>11. Earthing Ground Test</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300 text-[11px]">Grounding resistance measured at 3.1 Ω (PASSED).</p>
                      <span className="text-[10px] text-slate-500 block font-mono">Signed by: QA Inspector • Aug 14, 2026</span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border-2 border-amber-500 space-y-1">
                      <div className="flex justify-between items-center text-amber-400 font-black">
                        <span>12. Monitoring Gateway</span>
                        <Badge className="bg-amber-500 text-slate-950 text-[10px] font-black">IN PROGRESS</Badge>
                      </div>
                      <p className="text-slate-300 text-[11px]">Cerbo GX gateway SIM & Cloud NOC telemetry config.</p>
                      <Button onClick={() => alert("✅ Stage 12 Verified!\n\nCerbo GX IoT Telemetry Gateway verified live.")} size="sm" className="w-full mt-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px]">
                        Submit Stage 12 Evidence
                      </Button>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 opacity-70">
                      <div className="flex justify-between items-center text-slate-400 font-black">
                        <span>13. Site QA Inspection</span>
                        <Badge className="bg-slate-900 text-slate-400 text-[10px]">PENDING</Badge>
                      </div>
                      <p className="text-slate-400 text-[11px]">Comprehensive 50-point electrical safety audit.</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 opacity-70">
                      <div className="flex justify-between items-center text-slate-400 font-black">
                        <span>14. Pre-Commission Test</span>
                        <Badge className="bg-slate-900 text-slate-400 text-[10px]">PENDING</Badge>
                      </div>
                      <p className="text-slate-400 text-[11px]">24-Hour full-load endurance simulation.</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 opacity-70">
                      <div className="flex justify-between items-center text-slate-400 font-black">
                        <span>15. Handover & Certs</span>
                        <Badge className="bg-slate-900 text-slate-400 text-[10px]">PENDING</Badge>
                      </div>
                      <p className="text-slate-400 text-[11px]">Official client certificate issue & staff handover.</p>
                    </div>

                  </div>
                </div>

              </div>
            </TabsContent>

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
