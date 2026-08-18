import os

cargo_code = '''import SubsidiaryHeroCarousel from "@/components/subsidiary-hero-carousel";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Truck, 
  Ship, 
  Anchor, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Box, 
  Clock, 
  CheckCircle,
  FileText,
  Search,
  Calculator,
  Container,
  Navigation,
  Activity,
  AlertTriangle,
  Layers,
  Cpu,
  QrCode,
  Server,
  Zap,
  Thermometer,
  Database,
  Upload,
  Download,
  RefreshCw,
  FileCode,
  Users,
  Scale,
  Terminal,
  Lock,
  BarChart3,
  AlertCircle,
  HardHat,
  Camera,
  Image as ImageIcon,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// -----------------------------------------------------------------------------
// MOCK DATA & SCHEMAS (Based on PostgreSQL Blueprint & OpenAPI Spec)
// -----------------------------------------------------------------------------

interface ShipmentData {
  awbNumber: string;
  containerId: string;
  shipper: string;
  consignee: string;
  originPort: string;
  destinationPort: string;
  vesselOrFlight: string;
  totalPieces: number;
  totalWeightKg: number;
  totalVolumeCbm: number;
  natureOfGoods: string;
  isHazmat: boolean;
  hazmatClass?: string;
  currentStatus: string;
  temperatureCelsius: number;
  humidityPercent: number;
  demurrageRiskDays: number;
  history: Array<{ step: string; location: string; time: string; completed: boolean; scanType?: string }>;
}

const MOCK_SHIPMENTS: Record<string, ShipmentData> = {
  "020-12345675": {
    awbNumber: "020-12345675",
    containerId: "AKE98231AA",
    shipper: "Global Pharma & Freight Antwerp NV",
    consignee: "TOTAG Medical & General Merchandise",
    originPort: "Port of Antwerp (BE)",
    destinationPort: "Freeport of Monrovia (LR)",
    vesselOrFlight: "MSC MIRIAM v.2410",
    totalPieces: 120,
    totalWeightKg: 4850.5,
    totalVolumeCbm: 18.4,
    natureOfGoods: "Pharmaceuticals & Cold-Chain Supplies",
    isHazmat: false,
    currentStatus: "IN_STORAGE",
    temperatureCelsius: 4.2,
    humidityPercent: 55,
    demurrageRiskDays: 1,
    history: [
      { step: "Cargo Booking & Manifest Created", location: "Antwerp Air-Cargo Terminal", time: "2026-08-12 09:15", completed: true, scanType: "DRAFT" },
      { step: "Received at Origin Terminal (SCAN_RECEIVE)", location: "Antwerp Cargo Gate 4", time: "2026-08-13 14:20", completed: true, scanType: "RECEIVE" },
      { step: "Allocated to Cold Storage Bin (BIN_ASSIGN)", location: "WH-JFK-01 / Zone A-04", time: "2026-08-14 08:30", completed: true, scanType: "BIN_ASSIGN" },
      { step: "Customs Hold Cleared (LRA ASYCUDA)", location: "Monrovia Customs Office", time: "2026-08-15 11:00", completed: true, scanType: "CUSTOMS_INSPECT" },
      { step: "Loaded to Aircraft ULD (ULD_LOAD)", location: "Ramp Staging Pad 2", time: "In Progress", completed: false, scanType: "ULD_LOAD" },
      { step: "Final Delivery to Consignee", location: "TOTAG Freeport Depot", time: "Pending", completed: false, scanType: "DISPATCH" }
    ]
  },
  "020-88419203": {
    awbNumber: "020-88419203",
    containerId: "TGHU-940218-4",
    shipper: "Sinotruk Heavy Industry Qingdao",
    consignee: "TOTAG General Construction Ltd",
    originPort: "Port of Qingdao (CN)",
    destinationPort: "Port of Buchanan (LR)",
    vesselOrFlight: "CMA CGM RIVOLI",
    totalPieces: 45,
    totalWeightKg: 18200.0,
    totalVolumeCbm: 42.0,
    natureOfGoods: "Heavy Machinery Spare Parts & Steel Beams",
    isHazmat: true,
    hazmatClass: "Class 9 - Misc Dangerous",
    currentStatus: "CUSTOMS_HOLD",
    temperatureCelsius: 28.5,
    humidityPercent: 78,
    demurrageRiskDays: 4,
    history: [
      { step: "Cargo Booking & Bill of Lading Issued", location: "Qingdao Maritime Yard", time: "2026-07-28 10:00", completed: true },
      { step: "Ocean Transit & Vessel Departure", location: "South China Sea", time: "2026-08-02 16:40", completed: true },
      { step: "Port Terminal Arrival & Discharge", location: "Port of Buchanan Berth 1", time: "2026-08-14 10:20", completed: true },
      { step: "Customs Hold Inspection (LRA Hold)", location: "Buchanan Bonded Yard", time: "Under Review", completed: false },
      { step: "Dispatch & Heavy Transport Delivery", location: "Monrovia Construction Hub", time: "Pending", completed: false }
    ]
  }
};

const ULD_CONTAINERS = [
  { uldNumber: "AKE98231AA", type: "AKE", maxPayloadKg: 1588, tareWeightKg: 78, currentWeightKg: 1120, pieces: 42, isServiceable: true },
  { uldNumber: "PMC44102DL", type: "PMC", maxPayloadKg: 6800, tareWeightKg: 120, currentWeightKg: 5200, pieces: 110, isServiceable: true },
  { uldNumber: "PAG77239AF", type: "PAG", maxPayloadKg: 4626, tareWeightKg: 110, currentWeightKg: 4500, pieces: 88, isServiceable: true },
  { uldNumber: "BULK-BAY-01", type: "BULK", maxPayloadKg: 12000, tareWeightKg: 0, currentWeightKg: 3100, pieces: 15, isServiceable: true }
];

export default function CargoPage() {
  const { toast } = useToast();

  // Active Main Workspace Tab
  const [activeTab, setActiveTab] = useState("public-discovery");

  // 1. PUBLIC DISCOVERY & RATE CALCULATOR STATE
  const [calcMode, setCalcMode] = useState<"air" | "ocean">("air");
  const [origin, setOrigin] = useState("Antwerp (BE)");
  const [destination, setDestination] = useState("Monrovia (LR)");
  const [grossWeight, setGrossWeight] = useState(250);
  const [lengthCm, setLengthCm] = useState(120);
  const [widthCm, setWidthCm] = useState(80);
  const [heightCm, setHeightCm] = useState(100);
  const [isHazmat, setIsHazmat] = useState(false);
  const [isColdChain, setIsColdChain] = useState(false);

  // 2. PUBLIC TRACKING STATE
  const [searchAwb, setSearchAwb] = useState("020-12345675");
  const [trackedCargo, setTrackedCargo] = useState<ShipmentData | null>(MOCK_SHIPMENTS["020-12345675"]);

  // 3. WMS & RAMP SCANNER SIMULATOR STATE
  const [isScannerOnline, setIsScannerOnline] = useState(true);
  const [scanBarcode, setScanBarcode] = useState("020-12345675-001");
  const [scanType, setScanType] = useState<"RECEIVE" | "BIN_ASSIGN" | "ULD_LOAD" | "DISPATCH">("BIN_ASSIGN");
  const [warehouseCode, setWarehouseCode] = useState("WH-JFK-01");
  const [locationBarcode, setLocationBarcode] = useState("LOC-Z01-A04-R02-S01");
  const [scanLogs, setScanLogs] = useState<Array<{ id: string; barcode: string; type: string; status: string; time: string }>>([
    { id: "EVT-9021", barcode: "020-12345675-001", type: "BIN_ASSIGN", status: "ACCEPTED", time: "19:42:10" },
    { id: "EVT-9020", barcode: "020-88419203-012", type: "RECEIVE", status: "ACCEPTED", time: "19:35:04" }
  ]);

  // 4. ULD BUILD-UP WEIGHT SAFETY ENGINE STATE
  const [selectedUld, setSelectedUld] = useState(ULD_CONTAINERS[0]);
  const [newItemWeight, setNewItemWeight] = useState(350);
  const [uldValidationResult, setUldValidationResult] = useState<{ status: "IDLE" | "ACCEPTED" | "REJECTED"; message: string }>({ status: "IDLE", message: "" });

  // 5. DISCREPANCY & CLAIMS REPORT STATE WITH PHOTO DROPZONE
  const [discrepancyForm, setDiscrepancyForm] = useState({
    awbNumber: "020-88419203",
    pieceBarcode: "020-88419203-004",
    type: "DAMAGED_CARTON",
    description: "Crushed outer packaging with seal breach upon unloading at berth 1."
  });
  const [attachedPhotos, setAttachedPhotos] = useState<Array<{ id: string; name: string; url: string }>>([
    { id: "IMG-01", name: "damaged_carton_berth1.jpg", url: "/images/hero/solar-rooftop-team.jpg" },
    { id: "IMG-02", name: "seal_breach_inspection.jpg", url: "/images/hero/solar-rooftop-team.jpg" }
  ]);

  // 6. OPENAPI LIVE CONSOLE STATE
  const [apiEndpoint, setApiEndpoint] = useState("/tracking/020-12345675");
  const [apiMethod, setApiMethod] = useState("GET");
  const [apiResponse, setApiResponse] = useState<string>(JSON.stringify(MOCK_SHIPMENTS["020-12345675"], null, 2));

  // -----------------------------------------------------------------------------
  // CALCULATOR ENGINE: IATA Volumetric Formula Calculation
  // -----------------------------------------------------------------------------
  const volumetricWeight = (lengthCm * widthCm * heightCm) / 5000;
  const chargeableWeight = Math.max(grossWeight, volumetricWeight);
  const baseRatePerKg = calcMode === "air" ? 4.85 : 1.65;
  const hazmatSurcharge = isHazmat ? 185 : 0;
  const coldChainSurcharge = isColdChain ? 240 : 0;
  const totalFreightEstimate = Math.round(chargeableWeight * baseRatePerKg + hazmatSurcharge + coldChainSurcharge);

  // ULD Weight Calculations & Dynamic Progress Bar Logic
  const totalPotentialWeight = selectedUld.currentWeightKg + selectedUld.tareWeightKg + newItemWeight;
  const uldPercentage = Math.min(100, Math.round((totalPotentialWeight / selectedUld.maxPayloadKg) * 100));
  const isUldOverload = totalPotentialWeight > selectedUld.maxPayloadKg;

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchAwb.trim();
    if (MOCK_SHIPMENTS[query]) {
      setTrackedCargo(MOCK_SHIPMENTS[query]);
      toast({ title: "AWB Located", description: `Displaying live telemetry & audit log for AWB ${query}` });
    } else {
      toast({ title: "AWB Not Found", description: "Demo AWBs available: 020-12345675 or 020-88419203", variant: "destructive" });
    }
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isScannerOnline) {
      const newLog = { id: `OFFLINE-${Date.now().toString().slice(-4)}`, barcode: scanBarcode, type: scanType, status: "QUEUED_OFFLINE", time: new Date().toLocaleTimeString() };
      setScanLogs([newLog, ...scanLogs]);
      toast({ title: "Offline Scan Queued", description: "Network disconnected. Scan stored locally in scanner SQLite cache." });
      return;
    }

    if (scanType === "ULD_LOAD" && scanBarcode.includes("88419203")) {
      const errLog = { id: `ERR-${Date.now().toString().slice(-4)}`, barcode: scanBarcode, type: scanType, status: "REJECTED_SEQUENCE_ERR", time: new Date().toLocaleTimeString() };
      setScanLogs([errLog, ...scanLogs]);
      toast({ title: "Scan Rejected!", description: "Sequence Error: Piece must be logged RECEIVE at terminal before ULD_LOAD.", variant: "destructive" });
      return;
    }

    const successLog = { id: `EVT-${Date.now().toString().slice(-4)}`, barcode: scanBarcode, type: scanType, status: "ACCEPTED", time: new Date().toLocaleTimeString() };
    setScanLogs([successLog, ...scanLogs]);
    toast({ title: "Scan Processed", description: `Successfully ingested ${scanType} for ${scanBarcode}` });
  };

  const handleUldWeightValidation = () => {
    if (isUldOverload) {
      setUldValidationResult({
        status: "REJECTED",
        message: `OVERLOAD REJECTED! Total ${totalPotentialWeight}kg exceeds Max Payload Limit of ${selectedUld.maxPayloadKg}kg for ULD ${selectedUld.uldNumber}.`
      });
      toast({ title: "ULD Overload Safety Stop", description: "Weight threshold exceeded! Device haptic alarm triggered.", variant: "destructive" });
    } else {
      setUldValidationResult({
        status: "ACCEPTED",
        message: `VALIDATED & LOADED! New total weight ${totalPotentialWeight}kg is within safe payload capacity (${uldPercentage}% fill).`
      });
      toast({ title: "ULD Piece Loaded", description: `Manifest updated for ${selectedUld.uldNumber}` });
    }
  };

  const handleAddPhoto = () => {
    const photoId = `IMG-${Date.now().toString().slice(-4)}`;
    const newPhoto = { id: photoId, name: `warehouse_photo_${photoId}.jpg`, url: "/images/hero/solar-rooftop-team.jpg" };
    setAttachedPhotos([...attachedPhotos, newPhoto]);
    toast({ title: "Photo Evidence Attached", description: `Added ${newPhoto.name}` });
  };

  const handleRemovePhoto = (id: string) => {
    setAttachedPhotos(attachedPhotos.filter(p => p.id !== id));
    toast({ title: "Photo Removed", description: "Evidence file detached." });
  };

  const handleDiscrepancySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Discrepancy Incident Reported", description: `Ticket generated for AWB ${discrepancyForm.awbNumber} with ${attachedPhotos.length} photo attachments.` });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors">
      <Header />

      {/* Main Content Area */}
      <main className="pb-20">
        
        {/* Standardized Photo Carousel Hero Section */}
        <SubsidiaryHeroCarousel
          badge="TOTAG Subsidiary • Port Operations, Cargo Stevedoring & Telematics NOC"
          titleHighlight="Cargo Handling & Logistics"
          subtitle="Enterprise multi-tenant cargo platform featuring real-time IATA AWB tracking, cold-chain IoT telematics, WMS warehouse bin allocation, and ramp ULD safety staging across Liberia and West Africa."
          slides={[
            { url: "/images/hero/solar-rooftop-team.jpg", caption: "Freeport of Monrovia Berth Stevedoring & Heavy Lift" },
            { url: "/images/hero/solar-rooftop-team.jpg", caption: "TOTAG Bonded Container Freight Terminal & WMS Yard" },
            { url: "/images/hero/solar-rooftop-team.jpg", caption: "Air Cargo Cold-Chain Ramp Staging (2°C - 8°C)" }
          ]}
          stats={[
            { label: "Cargo Stevedored", value: "3.5M+ Tons" },
            { label: "TEUs Processed", value: "45,000+" },
            { label: "On-Time Clearance", value: "99.8%" }
          ]}
          primaryAction={{
            label: "Open Operations Console",
            icon: Terminal,
            onClick: () => setActiveTab("operations-center")
          }}
          secondaryAction={{
            label: "Track AWB / Container",
            icon: Search,
            onClick: () => setActiveTab("public-discovery")
          }}
        />

        {/* Core Multi-Tenant Platform Workspace */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            
            {/* Navigation Tab Controller */}
            <div className="flex justify-center">
              <TabsList className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-4xl shadow-xl backdrop-blur-xl">
                <TabsTrigger 
                  value="public-discovery" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs sm:text-sm transition-all flex items-center justify-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Public Discovery & Tracking</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="b2b-portal" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs sm:text-sm transition-all flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>B2B Customer Portal</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="operations-center" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs sm:text-sm transition-all flex items-center justify-center space-x-2"
                >
                  <HardHat className="w-4 h-4" />
                  <span>WMS & Ramp Command</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="developer-console" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs sm:text-sm transition-all flex items-center justify-center space-x-2"
                >
                  <FileCode className="w-4 h-4" />
                  <span>OpenAPI & Kafka Logs</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* =================================================================== */}
            {/* TAB 1: PUBLIC DISCOVERY, RATE CALCULATOR & TRACKING                */}
            {/* =================================================================== */}
            <TabsContent value="public-discovery" className="space-y-10">
              
              {/* Row 1: Freight Calculator & Track/Trace Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* IATA Freight Rate Engine */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl backdrop-blur-xl shadow-xl text-slate-900 dark:text-white">
                  <CardHeader className="border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
                          <Calculator className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">IATA Instant Freight Calculator</CardTitle>
                          <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">Volumetric Chargeable Weight Engine</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold">
                        <button onClick={() => setCalcMode("air")} className={`px-3 py-1 rounded-lg transition-all ${calcMode === "air" ? "bg-emerald-500 text-slate-950" : "text-slate-600 dark:text-slate-400"}`}>Air Cargo</button>
                        <button onClick={() => setCalcMode("ocean")} className={`px-3 py-1 rounded-lg transition-all ${calcMode === "ocean" ? "bg-emerald-500 text-slate-950" : "text-slate-600 dark:text-slate-400"}`}>Maritime Ocean</button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">Origin Port</Label>
                        <Input value={origin} onChange={(e) => setOrigin(e.target.value)} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">Destination Port</Label>
                        <Input value={destination} onChange={(e) => setDestination(e.target.value)} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                      </div>
                    </div>

                    {/* Weight & Dimensions Grid */}
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">Gross (kg)</Label>
                        <Input type="number" value={grossWeight} onChange={(e) => setGrossWeight(Number(e.target.value))} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">L (cm)</Label>
                        <Input type="number" value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">W (cm)</Label>
                        <Input type="number" value={widthCm} onChange={(e) => setWidthCm(Number(e.target.value))} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">H (cm)</Label>
                        <Input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                      </div>
                    </div>

                    {/* Special Handling Surcharge Toggles */}
                    <div className="flex items-center space-x-6 bg-slate-100 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                      <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer text-slate-800 dark:text-slate-200">
                        <input type="checkbox" checked={isHazmat} onChange={(e) => setIsHazmat(e.target.checked)} className="rounded text-emerald-500 focus:ring-0" />
                        <span>Hazmat / Dangerous Goods</span>
                      </label>
                      <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer text-slate-800 dark:text-slate-200">
                        <input type="checkbox" checked={isColdChain} onChange={(e) => setIsColdChain(e.target.checked)} className="rounded text-emerald-500 focus:ring-0" />
                        <span>Cold-Chain 2-8°C Storage</span>
                      </label>
                    </div>

                    {/* Output Chargeable Calculation Box */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">IATA Volumetric Chargeable Weight</span>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-black text-slate-900 dark:text-white">{chargeableWeight.toFixed(1)} kg</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">(Volumetric: {volumetricWeight.toFixed(1)}kg)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">Estimated Total</span>
                        <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${totalFreightEstimate.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Public AWB / Container Track-and-Trace */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl backdrop-blur-xl shadow-xl text-slate-900 dark:text-white">
                  <CardHeader className="border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-600 dark:text-sky-400">
                          <Search className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">Public AWB & Container Tracking</CardTitle>
                          <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">Real-Time Telematics & Milestone Inspection</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">11-Digit AWB Compliant</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <form onSubmit={handleTrackSearch} className="flex space-x-2">
                      <Input 
                        value={searchAwb}
                        onChange={(e) => setSearchAwb(e.target.value)}
                        placeholder="Enter AWB (e.g. 020-12345675)"
                        className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-sm font-semibold"
                      />
                      <Button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl px-6">
                        Track
                      </Button>
                    </form>

                    {trackedCargo && (
                      <div className="space-y-4">
                        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">AWB / CONTAINER</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{trackedCargo.awbNumber} / {trackedCargo.containerId}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">LIFECYCLE STATUS</span>
                            <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold">{trackedCargo.currentStatus}</Badge>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">COLD CHAIN TELEMETRY</span>
                            <span className="font-bold text-sky-600 dark:text-sky-400 flex items-center space-x-1">
                              <Thermometer className="w-3.5 h-3.5" />
                              <span>{trackedCargo.temperatureCelsius}°C ({trackedCargo.humidityPercent}% RH)</span>
                            </span>
                          </div>
                        </div>

                        {/* Interactive Timeline Stepper */}
                        <div className="space-y-3 pt-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Milestone Audit Log</span>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {trackedCargo.history.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-xs">
                                <div className="flex items-center space-x-3">
                                  {item.completed ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-slate-400" />}
                                  <div>
                                    <span className={`font-semibold block ${item.completed ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>{item.step}</span>
                                    <span className="text-[10px] text-slate-400">{item.location}</span>
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>

              {/* Row 2: Port & Terminal Coverage Map & Regulatory Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-3 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Anchor className="w-6 h-6 text-emerald-500" />
                    <h3 className="font-bold text-lg">Freeport of Monrovia Berth 2</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">24/7 Deepwater stevedoring, gantry crane container handling, and bonded customs warehouse facility.</p>
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">ISO 9001 Certified</Badge>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-3 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Ship className="w-6 h-6 text-sky-500" />
                    <h3 className="font-bold text-lg">Port of Buchanan Terminal</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Heavy equipment, mining ore breakbulk handling, and maritime fuel bunkering infrastructure.</p>
                  <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30 text-[10px]">FIATA Accredited</Badge>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-3 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-6 h-6 text-amber-500" />
                    <h3 className="font-bold text-lg">IATA Dangerous Goods (DGR)</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Class 1-9 Hazmat certified handling, specialized cold chain storage (2-8°C), and LRA single-window clearance.</p>
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">IATA Cargo Agent</Badge>
                </Card>
              </div>

            </TabsContent>

            {/* =================================================================== */}
            {/* TAB 2: B2B CUSTOMER PORTAL                                         */}
            {/* =================================================================== */}
            <TabsContent value="b2b-portal" className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Automated Shipment Booking Engine & Document Upload */}
                <Card className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold">B2B Cargo Booking & Document Vault</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Create new shipment booking, upload manifests & generate AWB</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Multi-User RBAC</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Shipper Organization</Label>
                      <Input defaultValue="Global Pharma Freight Antwerp NV" className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Consignee Entity</Label>
                      <Input defaultValue="TOTAG General Merchandise Ltd" className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Nature of Goods</Label>
                      <Input defaultValue="Medical Supplies" className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Total Pieces</Label>
                      <Input type="number" defaultValue={120} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Total Weight (kg)</Label>
                      <Input type="number" defaultValue={4850} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>
                  </div>

                  {/* Document Dropzone Simulator */}
                  <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-950/50">
                    <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Drop Commercial Invoice, Packing List & Customs Declarations</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">PDF, PNG, TIFF up to 25MB (Asynchronous OCR & Virus Scanned)</span>
                  </div>

                  <Button onClick={() => toast({ title: "Booking Created", description: "Issued AWB: 020-99412034. Confirmation sent to shipper." })} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl py-3">
                    Generate Booking & Issue AWB
                  </Button>
                </Card>

                {/* Demurrage Risk & Exception Alert Center */}
                <Card className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold">Exception Alerts & Demurrage Risk</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Proactive milestone risk management</p>
                    </div>
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                          <AlertCircle className="w-4 h-4" />
                          <span>Demurrage Risk Warning</span>
                        </span>
                        <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px]">1 Day Remaining</Badge>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-200">Container TGHU-940218-4 at Buchanan Terminal is approaching free storage limit. Clearance required by Aug 18.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                          <Lock className="w-4 h-4" />
                          <span>Customs Hold Active</span>
                        </span>
                        <Badge className="bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px]">LRA Inspection</Badge>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-200">AWB 020-88419203 requires Class 9 Hazmat compliance documentation verification.</p>
                    </div>
                  </div>
                </Card>

              </div>

            </TabsContent>

            {/* =================================================================== */}
            {/* TAB 3: WMS & RAMP COMMAND CENTER                                   */}
            {/* =================================================================== */}
            <TabsContent value="operations-center" className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* WMS Barcode Scanner Terminal & Sequence Validator */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <QrCode className="w-6 h-6 text-emerald-500" />
                      <div>
                        <h3 className="text-xl font-bold">WMS Scanner Ingest Terminal</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Offline-first barcode scan validator & bin assign</p>
                      </div>
                    </div>

                    {/* Network Online/Offline Simulator Toggle */}
                    <button 
                      onClick={() => setIsScannerOnline(!isScannerOnline)} 
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
                        isScannerOnline ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30"
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{isScannerOnline ? "Network ONLINE" : "Network OFFLINE (Local Queue)"}</span>
                    </button>
                  </div>

                  <form onSubmit={handleScanSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">Cargo Piece Barcode</Label>
                        <Input value={scanBarcode} onChange={(e) => setScanBarcode(e.target.value)} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">Operation Type</Label>
                        <select 
                          value={scanType} 
                          onChange={(e) => setScanType(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1"
                        >
                          <option value="RECEIVE">RECEIVE (Terminal Gate)</option>
                          <option value="BIN_ASSIGN">BIN_ASSIGN (Warehouse Rack)</option>
                          <option value="ULD_LOAD">ULD_LOAD (Ramp Staging)</option>
                          <option value="DISPATCH">DISPATCH (Release)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">Warehouse Code</Label>
                        <Input value={warehouseCode} onChange={(e) => setWarehouseCode(e.target.value)} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">Location Barcode</Label>
                        <Input value={locationBarcode} onChange={(e) => setLocationBarcode(e.target.value)} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl py-3">
                      Execute Scanner Ingest Event
                    </Button>
                  </form>

                  {/* Scan Stream Log Roster */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Recent Handheld Scans</span>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {scanLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-xs">
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">{log.id}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{log.barcode}</span>
                          <Badge className={log.status === "ACCEPTED" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : log.status === "QUEUED_OFFLINE" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-rose-500/20 text-rose-600 dark:text-rose-400"}>
                            {log.status}
                          </Badge>
                          <span className="text-[10px] text-slate-400">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* ULD Staging Engine with Dynamic Color-Changing Progress Bar */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <Container className="w-6 h-6 text-sky-500" />
                      <div>
                        <h3 className="text-xl font-bold">ULD Ramp Container Builder</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Structural tare & payload safety validation engine</p>
                      </div>
                    </div>
                    <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30">Safety Code Enforced</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Select Target ULD Container</Label>
                      <select 
                        value={selectedUld.uldNumber}
                        onChange={(e) => setSelectedUld(ULD_CONTAINERS.find(u => u.uldNumber === e.target.value) || ULD_CONTAINERS[0])}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1"
                      >
                        {ULD_CONTAINERS.map(u => (
                          <option key={u.uldNumber} value={u.uldNumber}>{u.uldNumber} ({u.type}) - Max {u.maxPayloadKg}kg</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 grid grid-cols-3 gap-3 text-xs text-center">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px]">CURRENT WEIGHT</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedUld.currentWeightKg} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px]">TARE WEIGHT</span>
                        <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">{selectedUld.tareWeightKg} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px]">MAX PAYLOAD</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{selectedUld.maxPayloadKg} kg</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Incoming Cargo Piece Weight (kg)</Label>
                      <Input type="number" value={newItemWeight} onChange={(e) => setNewItemWeight(Number(e.target.value))} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>

                    {/* DYNAMIC COLOR-CHANGING WEIGHT PROGRESS BAR (Green -> Amber -> Red) */}
                    <div className="space-y-2 pt-1 bg-slate-100 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                          <Scale className="w-4 h-4 text-emerald-500" />
                          <span>Total Calculated Gross: {totalPotentialWeight.toLocaleString()} kg / {selectedUld.maxPayloadKg.toLocaleString()} kg</span>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          isUldOverload ? "bg-rose-500 text-white animate-pulse" : uldPercentage > 75 ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        }`}>
                          {uldPercentage}% Capacity {isUldOverload ? "• OVERLOAD REJECTED" : ""}
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-200 dark:bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-white/10">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUldOverload ? "bg-rose-500 shadow-rose-500/50" : uldPercentage > 75 ? "bg-amber-500 shadow-amber-500/50" : "bg-emerald-500 shadow-emerald-500/50"
                          }`}
                          style={{ width: `${Math.min(100, uldPercentage)}%` }}
                        />
                      </div>
                    </div>

                    <Button onClick={handleUldWeightValidation} className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl py-3">
                      Validate & Attach Cargo to ULD
                    </Button>

                    {uldValidationResult.status !== "IDLE" && (
                      <div className={`p-4 rounded-2xl border text-xs font-bold ${
                        uldValidationResult.status === "ACCEPTED" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                      }`}>
                        {uldValidationResult.message}
                      </div>
                    )}
                  </div>
                </Card>

              </div>

              {/* Discrepancy & Photo Claims Incident Engine with Interactive Photo Dropzone */}
              <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                    <div>
                      <h3 className="text-xl font-bold">Discrepancy & Claims Damage Logging Engine</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Timestamped incident reports & photo evidence dropzone</p>
                    </div>
                  </div>
                  <Badge className="bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30">
                    {attachedPhotos.length} Photo Evidence Attached
                  </Badge>
                </div>

                <form onSubmit={handleDiscrepancySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">AWB / Cargo Barcode</Label>
                      <Input value={discrepancyForm.pieceBarcode} onChange={(e) => setDiscrepancyForm({...discrepancyForm, pieceBarcode: e.target.value})} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Discrepancy Category</Label>
                      <select 
                        value={discrepancyForm.type}
                        onChange={(e) => setDiscrepancyForm({...discrepancyForm, type: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1"
                      >
                        <option value="DAMAGED_CARTON">DAMAGED_CARTON</option>
                        <option value="TEMPERATURE_EXCURSION">TEMPERATURE_EXCURSION</option>
                        <option value="SEAL_BROKEN">SEAL_BROKEN</option>
                        <option value="WEIGHT_MISMATCH">WEIGHT_MISMATCH</option>
                        <option value="HAZMAT_VIOLATION">HAZMAT_VIOLATION</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Detailed Description & Evidence Log</Label>
                      <Input value={discrepancyForm.description} onChange={(e) => setDiscrepancyForm({...discrepancyForm, description: e.target.value})} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>
                  </div>

                  {/* INTERACTIVE MULTI-FILE PHOTO ATTACHMENT DROPZONE */}
                  <div className="space-y-3">
                    <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold flex items-center space-x-1.5">
                      <Camera className="w-4 h-4 text-rose-500" />
                      <span>Visual Evidence & Photo Capture Dropzone</span>
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Upload / Capture Trigger Button */}
                      <div 
                        onClick={handleAddPhoto}
                        className="border-2 border-dashed border-rose-500/40 hover:border-rose-500 bg-rose-500/5 p-4 rounded-2xl text-center flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02] min-h-[110px]"
                      >
                        <Camera className="w-6 h-6 text-rose-500 mb-1" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Snap / Attach Photo</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Click to add evidence</span>
                      </div>

                      {/* Photo Thumbnail Roster */}
                      {attachedPhotos.map((photo) => (
                        <div key={photo.id} className="relative group bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-300 dark:border-white/10 p-2 flex items-center space-x-3 overflow-hidden min-h-[110px]">
                          <img src={photo.url} alt={photo.name} className="w-14 h-14 rounded-xl object-cover border border-white/20 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{photo.name}</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block">GPS + Time Logged</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-rose-500 text-white opacity-90 hover:opacity-100 transition-opacity"
                            title="Remove Photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Button type="submit" className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-black rounded-xl px-6 py-3 text-xs">
                      Submit Discrepancy & Initiate Claims Ticket ({attachedPhotos.length} Photos Attached)
                    </Button>
                  </div>
                </form>
              </Card>

            </TabsContent>

            {/* =================================================================== */}
            {/* TAB 4: OPENAPI CONSOLE & KAFKA LOG STREAM                           */}
            {/* =================================================================== */}
            <TabsContent value="developer-console" className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Live OpenAPI 3.0.3 Interactive Console */}
                <Card className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <FileCode className="w-6 h-6 text-emerald-500" />
                      <div>
                        <h3 className="text-xl font-bold">OpenAPI 3.0.3 Live Endpoint Console</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Interactive REST API testing interface</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">v1.0.0 Spec</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <select 
                        value={apiEndpoint}
                        onChange={(e) => {
                          const ep = e.target.value;
                          setApiEndpoint(ep);
                          if (ep.includes("tracking")) {
                            setApiMethod("GET");
                            setApiResponse(JSON.stringify(MOCK_SHIPMENTS["020-12345675"], null, 2));
                          } else if (ep.includes("scan")) {
                            setApiMethod("POST");
                            setApiResponse(JSON.stringify({ eventId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", status: "QUEUED", timestamp: new Date().toISOString() }, null, 2));
                          } else if (ep.includes("manifest")) {
                            setApiMethod("POST");
                            setApiResponse(JSON.stringify({ uldNumber: "AKE98231AA", currentWeightKg: 1470, maxPayloadKg: 1588, piecesCount: 43 }, null, 2));
                          }
                        }}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 w-full"
                      >
                        <option value="/tracking/020-12345675">GET /tracking/{'{awbNumber}'}</option>
                        <option value="/wms/scan">POST /wms/scan</option>
                        <option value="/wms/uld/AKE98231AA/manifest">POST /wms/uld/{'{uldNumber}'}/manifest</option>
                        <option value="/wms/discrepancies">POST /wms/discrepancies</option>
                      </select>

                      <Button className="bg-emerald-500 text-slate-950 font-black rounded-xl px-6">
                        Execute
                      </Button>
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300 block mb-1">Live JSON Response Payload</Label>
                      <pre className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 font-mono text-xs overflow-x-auto max-h-64">
                        {apiResponse}
                      </pre>
                    </div>
                  </div>
                </Card>

                {/* Kafka Event Stream Live Ingest Monitor */}
                <Card className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <Cpu className="w-6 h-6 text-amber-500" />
                      <div>
                        <h3 className="text-xl font-bold">Kafka Event Stream Monitor</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">High-throughput topic ingestion</p>
                      </div>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30">Topic: cargo.scans.raw</Badge>
                  </div>

                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block">PARTITION 0 | OFFSET 409218</span>
                      <p className="text-slate-700 dark:text-slate-300">{`{"barcode":"020-12345675-001","scanType":"BIN_ASSIGN","wh":"WH-JFK-01"}`}</p>
                    </div>

                    <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                      <span className="text-sky-600 dark:text-sky-400 font-bold block">PARTITION 1 | OFFSET 409219</span>
                      <p className="text-slate-700 dark:text-slate-300">{`{"uldNumber":"AKE98231AA","event":"ULD_CARGO_ATTACHED","weightKg":350}`}</p>
                    </div>

                    <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                      <span className="text-rose-600 dark:text-rose-400 font-bold block">PARTITION 2 | OFFSET 409220</span>
                      <p className="text-slate-700 dark:text-slate-300">{`{"awbNumber":"020-88419203","event":"CUSTOMS_HOLD","reason":"CLASS_9_HAZMAT"}`}</p>
                    </div>
                  </div>
                </Card>

              </div>

            </TabsContent>

          </Tabs>
        </div>

      </main>

      <Footer />
    </div>
  );
}
'''

with open(r'c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\cargo.tsx', 'w', encoding='utf-8') as f:
    f.write(cargo_code)

print("Cargo page updated with 4 recommended UI enhancements successfully!")
