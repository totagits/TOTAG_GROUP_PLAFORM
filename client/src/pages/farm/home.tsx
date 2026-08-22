import SubsidiaryHeroCarousel from "@/components/subsidiary-hero-carousel";
import { useState, useRef } from "react";
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
  Sprout, 
  Sun, 
  Droplets, 
  Wind, 
  Zap, 
  ShieldCheck, 
  Thermometer, 
  Activity, 
  Globe, 
  FileText, 
  QrCode, 
  BarChart3, 
  Layers, 
  Cpu, 
  Truck, 
  Building2, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Download, 
  Search, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Compass, 
  Radio, 
  ArrowRight, 
  Check, 
  X, 
  RefreshCw, 
  MapPin, 
  FileDown, 
  Scale, 
  Filter, 
  Sliders, 
  Leaf, 
  Sparkles, 
  Factory, 
  FileSpreadsheet, 
  Phone, 
  Mail, 
  FileCheck2, 
  ShieldAlert, 
  Clock, 
  Package, 
  Database,
  LogIn,
  Award,
  AlertCircle,
  FileSignature
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// -----------------------------------------------------------------------------
// 1. MOCK SEED-TO-SHELF BATCH PROVENANCE DATABASE
// -----------------------------------------------------------------------------

interface BatchProvenance {
  batchNumber: string;
  cropVariety: string;
  siteName: string;
  fieldPlot: string;
  geojsonPolygon: string;
  seedLotNumber: string;
  germinationRatePct: number;
  isNonGmo: boolean;
  harvestDate: string;
  harvestYieldKg: number;
  qualityGrade: string;
  millingRecoveryPct: number;
  pesticideResidueFree: boolean;
  coldStorageTempC: number;
  coldStorageRoom: string;
  reeferGpsLocation: string;
  phytosanitaryCertId: string;
  blockchainHash: string;
}

const PROVENANCE_DATABASE: Record<string, BatchProvenance> = {
  "BATCH-2026-RICE-091": {
    batchNumber: "BATCH-2026-RICE-091",
    cropVariety: "TOTAG Superba Polished Parboiled Rice",
    siteName: "TOTAG Central River Basin Estate (Sector B)",
    fieldPlot: "PLOT-B04 (PostGIS Spatial Polygon)",
    geojsonPolygon: "POLYGON((-10.7969 6.3156, -10.7950 6.3156, -10.7950 6.3170, -10.7969 6.3170, -10.7969 6.3156))",
    seedLotNumber: "SEED-LOT-NERICA-2026-04",
    germinationRatePct: 96.5,
    isNonGmo: true,
    harvestDate: "2026-08-10",
    harvestYieldKg: 14200,
    qualityGrade: "PREMIUM_EXPORT_GRADE_A",
    millingRecoveryPct: 68.4, // Standard 65%-70% tolerance
    pesticideResidueFree: true,
    coldStorageTempC: 3.2,
    coldStorageRoom: "SILO-WH-02 (Zone A)",
    reeferGpsLocation: "6.3156° N, 10.8074° W (Monrovia Freeport Depot)",
    phytosanitaryCertId: "MOA-PHYTO-2026-9921",
    blockchainHash: "0x8f9c2b1d4e6a8f0a2c4e6b8d0a2f4e6b8c0d2e4f6a8b0c2d4e6f8a0b2c4e6b8"
  },
  "BATCH-2026-TOMATO-042": {
    batchNumber: "BATCH-2026-TOMATO-042",
    cropVariety: "Vine-Ripened Roma Tomatoes (Greenhouse Cultivar)",
    siteName: "Smart Greenhouse Complex Unit 01",
    fieldPlot: "GH-ZONE-A1 (Automated Hydroponics)",
    geojsonPolygon: "POLYGON((-10.7920 6.3120, -10.7910 6.3120, -10.7910 6.3130, -10.7920 6.3130, -10.7920 6.3120))",
    seedLotNumber: "SEED-LOT-ROMA-2026-11",
    germinationRatePct: 98.0,
    isNonGmo: true,
    harvestDate: "2026-08-14",
    harvestYieldKg: 4850,
    qualityGrade: "GRADE_A_HORTICULTURE",
    millingRecoveryPct: 100.0, // Fresh horticulture
    pesticideResidueFree: true,
    coldStorageTempC: 2.8,
    coldStorageRoom: "REEFER-ROOM-04 (Cold Chain 2-4°C)",
    reeferGpsLocation: "5.8812° N, 10.0451° W (Buchanan Highway Transit)",
    phytosanitaryCertId: "MOA-PHYTO-2026-4402",
    blockchainHash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4"
  },
  "BATCH-2026-CATTLE-018": {
    batchNumber: "BATCH-2026-CATTLE-018",
    cropVariety: "Grass-Fed Ndama Beef Prime Cuts",
    siteName: "TOTAG Integrated Livestock Ranch",
    fieldPlot: "PASTURE-ZONE-03 (BLE Tracking)",
    geojsonPolygon: "POLYGON((-10.7980 6.3100, -10.7940 6.3100, -10.7940 6.3140, -10.7980 6.3140, -10.7980 6.3100))",
    seedLotNumber: "LIVESTOCK-GENETICS-NDAMA-88",
    germinationRatePct: 100.0,
    isNonGmo: true,
    harvestDate: "2026-08-12",
    harvestYieldKg: 680,
    qualityGrade: "PRIME_ORGANIC_MEAT",
    millingRecoveryPct: 62.0, // Meat processing yield ratio
    pesticideResidueFree: true,
    coldStorageTempC: 1.5,
    coldStorageRoom: "MEAT-LOCKER-01 (-2°C to 2°C)",
    reeferGpsLocation: "6.3156° N, 10.8074° W (Monrovia Cold Hub)",
    phytosanitaryCertId: "VET-CERT-2026-8801",
    blockchainHash: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
  }
};

// -----------------------------------------------------------------------------
// 2. LIVESTOCK BIOMETRIC TELEMETRY & VETERINARY HEALTH DATABASE
// -----------------------------------------------------------------------------

interface LivestockRecord {
  tagNumber: string;
  species: string;
  breed: string;
  birthDate: string;
  bodyTempC: number;
  ruminationMinutesToday: number;
  heartRateBpm: number;
  healthStatus: "HEALTHY" | "FEVER_ALERT" | "DIGESTIVE_DISTRESS" | "ISOLATED_QUARANTINE";
  withdrawalEndDate: string | null; // Critical export compliance safeguard
  isProcessingBlocked: boolean;
  location: string;
}

const INITIAL_LIVESTOCK: LivestockRecord[] = [
  {
    tagNumber: "COW-GH-9982",
    species: "CATTLE",
    breed: "Ndama / Senepol Hybrid",
    birthDate: "2024-03-15",
    bodyTempC: 38.6, // Normal (38.0 - 39.2°C)
    ruminationMinutesToday: 480, // Normal (400 - 600 min/day)
    heartRateBpm: 72,
    healthStatus: "HEALTHY",
    withdrawalEndDate: null,
    isProcessingBlocked: false,
    location: "Pasture Zone 03 (GPS: 6.3156° N, 10.7969° W)"
  },
  {
    tagNumber: "COW-GH-9983",
    species: "CATTLE",
    breed: "Ndama Purebred",
    birthDate: "2024-05-20",
    bodyTempC: 39.8, // CRITICAL SAFEGUARD: > 39.5°C FEVER TRIGGER!
    ruminationMinutesToday: 320,
    heartRateBpm: 88,
    healthStatus: "FEVER_ALERT",
    withdrawalEndDate: "2026-08-28", // Active antibiotic withdrawal!
    isProcessingBlocked: true, // AUTOMATICALLY BLOCKED FROM PROCESSING RUNS
    location: "Quarantine Barn B (Isolated)"
  },
  {
    tagNumber: "COW-GH-9984",
    species: "CATTLE",
    breed: "Brahman Cross",
    birthDate: "2023-11-10",
    bodyTempC: 38.8,
    ruminationMinutesToday: 260, // CRITICAL SAFEGUARD: < 300 min/day DIGESTIVE DISTRESS!
    heartRateBpm: 78,
    healthStatus: "DIGESTIVE_DISTRESS",
    withdrawalEndDate: null,
    isProcessingBlocked: true,
    location: "Pasture Zone 01 (Monitoring)"
  },
  {
    tagNumber: "GOAT-LR-4401",
    species: "GOAT",
    breed: "West African Dwarf",
    birthDate: "2025-01-08",
    bodyTempC: 38.9,
    ruminationMinutesToday: 410,
    heartRateBpm: 80,
    healthStatus: "HEALTHY",
    withdrawalEndDate: null,
    isProcessingBlocked: false,
    location: "Paddock 04"
  }
];

// -----------------------------------------------------------------------------
// 3. GIS MULTI-SPECTRAL FIELD PLOTS (POSTGIS SPATIAL BOUNDING BOX INDEXED)
// -----------------------------------------------------------------------------

interface FieldPlotItem {
  plotId: string;
  siteName: string;
  cropVariety: string;
  areaHectares: number;
  stage: string;
  ndviScore: number; // 0.0 to 1.0 (Vegetative Vigor)
  ndreScore: number;
  soilMoisturePct: number;
  irrigationType: string;
  spatialBoundingBox: string; // PostGIS && operator indexed
  pestRisk: "LOW" | "MODERATE" | "HIGH_ACTION_REQUIRED";
}

const MOCK_FIELD_PLOTS: FieldPlotItem[] = [
  {
    plotId: "PLOT-B04",
    siteName: "Central River Basin Estate",
    cropVariety: "NERICA Polished Paddy Rice",
    areaHectares: 120.5,
    stage: "RIPENING",
    ndviScore: 0.84, // Excellent vigor
    ndreScore: 0.78,
    soilMoisturePct: 38.5,
    irrigationType: "CENTER_PIVOT_AUTOMATED",
    spatialBoundingBox: "BOX(-10.7969 6.3156, -10.7950 6.3170) [PostGIS Index]",
    pestRisk: "LOW"
  },
  {
    plotId: "PLOT-A02",
    siteName: "Highland Terrace Farm",
    cropVariety: "Yellow Hybrid Maize (Corn)",
    areaHectares: 85.0,
    stage: "VEGETATIVE",
    ndviScore: 0.72,
    ndreScore: 0.65,
    soilMoisturePct: 29.0,
    irrigationType: "DRIP_FERTIGATION",
    spatialBoundingBox: "BOX(-10.7980 6.3110, -10.7960 6.3130) [PostGIS Index]",
    pestRisk: "MODERATE"
  },
  {
    plotId: "GH-ZONE-A1",
    siteName: "Smart Greenhouse Complex",
    cropVariety: "Roma Tomatoes (Hydroponic)",
    areaHectares: 4.2,
    stage: "HARVEST_READY",
    ndviScore: 0.92,
    ndreScore: 0.88,
    soilMoisturePct: 45.0,
    irrigationType: "AUTONOMOUS_VRA_FERTIGATION",
    spatialBoundingBox: "BOX(-10.7920 6.3120, -10.7910 6.3130) [PostGIS Index]",
    pestRisk: "LOW"
  }
];

export default function FarmHome() {
  const { toast } = useToast();

  // Active Main Workspace Tab
  const [activeTab, setActiveTab] = useState("public-esg");

  // 1. PUBLIC SEED-TO-SHELF BATCH PROVENANCE STATE
  const [searchBatchNumber, setSearchBatchNumber] = useState("BATCH-2026-RICE-091");
  const [activeProvenance, setActiveProvenance] = useState<BatchProvenance | null>(PROVENANCE_DATABASE["BATCH-2026-RICE-091"]);
  const [isProvenanceModalOpen, setIsProvenanceModalOpen] = useState(false);

  // 2. B2B CONTRACT & FUTURES PURCHASING STATE
  const [b2bContractForm, setB2bContractForm] = useState({
    buyerCompany: "Monrovia Supermarkets & Food Distributors",
    commodity: "TOTAG Superba Polished Rice (50kg Bags)",
    contractType: "FORWARD_CONTRACT",
    orderQuantityTons: 50,
    unitPriceUsd: 420, // Discounted for forward contract vs $500 spot
    targetDeliveryDate: "2026-09-30",
    escrowPaymentMethod: "LETTER_OF_CREDIT",
    lcNumber: "LC-ECOBANK-2026-8821",
    contactEmail: "procurement@monroviasupermarket.lr"
  });

  const [executedContractReceipt, setExecutedContractReceipt] = useState<{
    contractId: string;
    totalAmountUsd: number;
    timestamp: string;
  } | null>(null);

  // 3. SMART GREENHOUSE AUTONOMOUS CONTROL & ESP32 EDGE FALLBACK STATE
  const [greenhouseState, setGreenhouseState] = useState({
    unitCode: "GH-UNIT-01 (Hydroponics Zone A)",
    vpdKpa: 1.15, // Vapor Pressure Deficit (Target: 1.20)
    ambientTempC: 24.5,
    humidityPct: 68.2,
    co2Ppm: 850,
    parLightUmol: 420,
    phLevel: 6.2,
    ecDsm: 2.1,
    npkRatio: "14-7-21 (High Potash Fruiting Stage)",
    isCloudConnected: true,
    isEdgeFallbackActive: true, // CRITICAL SAFEGUARD: Local ESP32 / Raspberry Pi node active
    edgeNodeId: "ESP32-EDGE-GH01-MAC8892"
  });

  const [isFertigationModalOpen, setIsFertigationModalOpen] = useState(false);

  // 4. SOLAR MICROGRID NOC TELEMETRY STATE
  const [solarNoc, setSolarNoc] = useState({
    pvGenerationKw: 145.8,
    batterySocPct: 89.5,
    loadDemandKw: 92.4,
    gridExportKw: 53.4,
    inverterEfficiencyPct: 98.2,
    co2SavedTonsMonth: 42.8,
    waterRecycledLitersDay: 84500
  });

  // 5. LIVESTOCK BIOMETRIC TELEMETRY STATE (WITH CRITICAL SAFEGUARDS)
  const [livestockList, setLivestockList] = useState<LivestockRecord[]>(INITIAL_LIVESTOCK);
  const [selectedLivestock, setSelectedLivestock] = useState<LivestockRecord | null>(null);
  const [isLivestockModalOpen, setIsLivestockModalOpen] = useState(false);

  // 6. AGRO-PROCESSING & MILLING RECOVERY YIELD RECONCILIATION STATE (WITH SAFEGUARD)
  const [millingRunForm, setMillingRunForm] = useState({
    runNumber: "RUN-MILL-2026-904",
    sourceBatch: "BATCH-2026-RICE-091",
    processingType: "RICE_PARBOILING_AND_POLISHING",
    inputRawKg: 10000,
    outputFinishedKg: 6840, // 68.4% yield recovery (within 65%-70% standard)
    moistureContentPct: 12.8,
    qaInspector: "Dr. K. Sannoh (Lead Quality Auditor)"
  });

  const calculatedMillingYieldRatio = (millingRunForm.outputFinishedKg / millingRunForm.inputRawKg) * 100;
  const isMillingYieldOutsideTolerance = calculatedMillingYieldRatio < 65 || calculatedMillingYieldRatio > 72;

  // 7. COMPREHENSIVE OUTGROWER & SMALLHOLDER PORTAL STATE
  const [outgrowerSubTab, setOutgrowerSubTab] = useState<"enrollment" | "calculator" | "mechanization" | "deliveries">("calculator");
  
  // Registration Form
  const [outgrowerForm, setOutgrowerForm] = useState({
    cooperativeName: "Voinjama Progressive Rice Farmers Union",
    leadFarmerName: "Emmanuel Kamara",
    phone: "+231 88 444 5566",
    momoProvider: "Lonestar MTN MoMo",
    momoNumber: "0884445566",
    county: "Lofa",
    district: "Voinjama District",
    communityTown: "Konia Clan, Plot #12",
    cropType: "NERICA Certified Paddy Rice",
    farmSizeAcres: 15,
    householdMembers: 8,
    requestedServices: ["Certified Seeds", "Bio-Fertilizer", "Tractor Plowing", "Guaranteed Off-Take"],
    preferredPayment: "Instant Mobile Money (USD/LRD Split)"
  });
  const [enrolledReceipt, setEnrolledReceipt] = useState<{ id: string; date: string } | null>(null);

  // Revenue & Floor Price Calculator State
  const [calcCrop, setCalcCrop] = useState<string>("NERICA_RICE");
  const [calcAcreage, setCalcAcreage] = useState<number>(10);
  const [calcYieldTonsPerAcre, setCalcYieldTonsPerAcre] = useState<number>(2.2);

  // Mechanization & Service Request State
  const [mechanizationForm, setMechanizationForm] = useState({
    farmerName: "Kollie Mulbah",
    phone: "+231 77 655 4321",
    county: "Bong",
    serviceType: "Tractor Plowing & Harrowing (John Deere 4WD)",
    targetAcres: 8,
    requestedStartDate: "2026-09-01",
    notes: "Wetland valley field preparation before heavy rains."
  });
  const [mechBookedRef, setMechBookedRef] = useState<string | null>(null);

  // Live Cooperative Delivery Intake Ledger (Interactive)
  const [outgrowerDeliveries, setOutgrowerDeliveries] = useState([
    {
      id: "DLV-2026-0941",
      cooperative: "Voinjama Rice Growers Union",
      county: "Lofa",
      crop: "NERICA Paddy Rice",
      tonnage: 142.5,
      moisturePct: 13.8,
      qualityGrade: "Grade A Premium",
      unitPriceUsd: 380,
      totalPayoutUsd: 54150,
      paymentMethod: "Lonestar MTN MoMo (Settled)",
      status: "COMPLETED_PAID"
    },
    {
      id: "DLV-2026-0942",
      cooperative: "Ganta Cassava Starch Alliance",
      county: "Nimba",
      crop: "High-Starch Cassava Tubers",
      tonnage: 88.0,
      moisturePct: 62.0,
      qualityGrade: "Industrial Grade",
      unitPriceUsd: 290,
      totalPayoutUsd: 25520,
      paymentMethod: "Orange Money (Settled)",
      status: "COMPLETED_PAID"
    },
    {
      id: "DLV-2026-0943",
      cooperative: "Suakoko Maize & Feed Producers",
      county: "Bong",
      crop: "Yellow Feed Maize",
      tonnage: 64.2,
      moisturePct: 14.1,
      qualityGrade: "Feed Mill Standard",
      unitPriceUsd: 420,
      totalPayoutUsd: 26964,
      paymentMethod: "Ecobank Direct Transfer (Processing)",
      status: "PROCESSING_INTAKE"
    },
    {
      id: "DLV-2026-0944",
      cooperative: "Tchien Sustainable Cocoa Cluster",
      county: "Grand Gedeh",
      crop: "Fermented Sun-Dried Cocoa",
      tonnage: 35.0,
      moisturePct: 7.2,
      qualityGrade: "Export Grade 1",
      unitPriceUsd: 1400,
      totalPayoutUsd: 49000,
      paymentMethod: "Lonestar MTN MoMo (Settled)",
      status: "COMPLETED_PAID"
    }
  ]);
  const [deliverySearchQuery, setDeliverySearchQuery] = useState("");

  // SEARCH PROVENANCE BATCH LOOKUP HANDLER
  const handleSearchProvenance = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchBatchNumber.trim().toUpperCase();
    if (PROVENANCE_DATABASE[query]) {
      setActiveProvenance(PROVENANCE_DATABASE[query]);
      toast({
        title: "Seed-to-Shelf Provenance Verified!",
        description: `Located tamper-evident batch ${query}. Blockchain hash verified.`
      });
    } else {
      toast({
        title: "Batch ID Not Found",
        description: "Available demo batch codes: BATCH-2026-RICE-091, BATCH-2026-TOMATO-042, BATCH-2026-CATTLE-018",
        variant: "destructive"
      });
    }
  };

  // EXECUTE B2B FUTURES / FORWARD CONTRACT
  const handleExecuteB2bContract = (e: React.FormEvent) => {
    e.preventDefault();
    const totalUsd = b2bContractForm.orderQuantityTons * b2bContractForm.unitPriceUsd;
    const receiptId = `CONTRACT-TOTAG-FARM-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleString();

    setExecutedContractReceipt({
      contractId: receiptId,
      totalAmountUsd: totalUsd,
      timestamp: now
    });

    toast({
      title: "B2B Forward Off-Take Contract Executed!",
      description: `Issued Contract ${receiptId} for ${b2bContractForm.orderQuantityTons} Tons ($${totalUsd.toLocaleString()} USD). Escrow locked.`
    });
  };

  // EXECUTE MILLING RECOVERY YIELD RUN (SAFEGUARD ENFORCED)
  const handleExecuteMillingRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMillingYieldOutsideTolerance) {
      toast({
        title: "Milling Recovery Exception Flagged!",
        description: `Calculated recovery rate ${calculatedMillingYieldRatio.toFixed(1)}% deviates from standard 65%-70% tolerance. Requires Master Agronomist Override.`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Agro-Processing Yield Reconciled & Logged!",
      description: `Run ${millingRunForm.runNumber} passed. Processed ${millingRunForm.inputRawKg.toLocaleString()}kg raw into ${millingRunForm.outputFinishedKg.toLocaleString()}kg finished product (${calculatedMillingYieldRatio.toFixed(1)}% recovery).`
    });
  };

  // FERTIGATION DOSING ADJUSTMENT OVERRIDE
  const handleUpdateFertigation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFertigationModalOpen(false);
    toast({
      title: "Fertigation Parameters Dispatched to ESP32 Edge Node",
      description: `Target pH set to ${greenhouseState.phLevel}, EC to ${greenhouseState.ecDsm} dS/m. Local fallback controller synchronized.`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors">
      <Header />

      {/* Main Content Area */}
      <main className="pb-20">
        
        {/* Standardized Photo Carousel Hero Section */}
        <SubsidiaryHeroCarousel
          badge="TOTAG Subsidiary • Vertically Integrated Agribusiness, Solar & Precision Farming"
          titleHighlight="FARM & Agribusiness Ecosystem"
          subtitle="Commercial grain cultivation, smart climate-controlled greenhouses, IoT livestock biometrics, solar microgrids, industrial milling, cold-chain logistics, and tamper-evident seed-to-shelf provenance."
          slides={[
            { url: "/images/hero/farm_agronomist_gis.jpg", caption: "Precision GIS Field Mapping & Digital Agronomy Operations" },
            { url: "/images/hero/farm_cocoa_harvest.jpg", caption: "Commercial Tree Crops & Sustainable Cocoa Harvest" },
            { url: "/images/hero/farm_rice_paddy.jpg", caption: "Community Outgrower Rice Paddy Harvest & Seed Support" },
            { url: "/images/hero/farm_pepper_sorting.jpg", caption: "Horticulture Harvest Sorting, Quality Grading & Cold Storage" },
            { url: "/images/hero/farm_vegetable_field.jpg", caption: "Organic Vegetable Field Cultivation & Drip Irrigation" }
          ]}
          stats={[
            { label: "Cultivated Acres", value: "2,500+ Acres" },
            { label: "Solar Microgrid", value: "145.8 kW PV" },
            { label: "Annual Grain Yield", value: "1,200+ Tons" }
          ]}
          primaryAction={{
            label: "Verify Seed-to-Shelf Batch",
            icon: QrCode,
            onClick: () => setActiveTab("public-esg")
          }}
          secondaryAction={{
            label: "Open B2B Futures Booking",
            icon: DollarSign,
            onClick: () => setActiveTab("b2b-commerce")
          }}
        />

        {/* Core Multi-Tenant Platform Workspace */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            
            {/* Navigation Tab Controller */}
            <div className="flex justify-center">
              <TabsList className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-2 w-full max-w-4xl shadow-xl backdrop-blur-xl">
                <TabsTrigger 
                  value="public-esg" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Public ESG & Batch Provenance</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="b2b-commerce" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>B2B Commodity Commerce</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="operations-command" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Enterprise Ops Command</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* =================================================================== */}
            {/* TAB 1: PUBLIC DISCOVERY, ESG TELEMETRY & BATCH PROVENANCE           */}
            {/* =================================================================== */}
            <TabsContent value="public-esg" className="space-y-10">
              
              {/* REAL-TIME SUSTAINABILITY & ESG TELEMETRY COUNTER */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-5 text-slate-900 dark:text-white space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">CARBON OFFSET SAVINGS</span>
                    <Leaf className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{solarNoc.co2SavedTonsMonth}</span>
                    <span className="text-xs font-bold text-slate-500">tCO₂ / Month</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Verified via Solar Microgrid NOC</span>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-5 text-slate-900 dark:text-white space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">SOLAR ENERGY GENERATION</span>
                    <Sun className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{solarNoc.pvGenerationKw}</span>
                    <span className="text-xs font-bold text-slate-500">kW PV Capacity</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Battery SoC: {solarNoc.batterySocPct}%</span>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-5 text-slate-900 dark:text-white space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">CLOSED-LOOP WATER RECYCLED</span>
                    <Droplets className="w-5 h-5 text-sky-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-sky-600 dark:text-sky-400">84,500</span>
                    <span className="text-xs font-bold text-slate-500">Liters / Day</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Hydroponic Recirculation Rate: 94%</span>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-5 text-slate-900 dark:text-white space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">ORGANIC FERTILIZER UTILIZATION</span>
                    <Sprout className="w-5 h-5 text-teal-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-teal-600 dark:text-teal-400">98%</span>
                    <span className="text-xs font-bold text-slate-500">Chemical Free</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">USDA Organic Certified</span>
                </Card>
              </div>


              {/* OPERATIONAL FIELD PHOTO GALLERY SHOWCASE (HIGH DEFINITION CLARITY) */}
              <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentic Agribusiness Operations Gallery</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">High-definition operational photography from TOTAG agricultural estates</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                    5 Active Field Sites
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { title: "Digital Agronomy & GIS", img: "/images/hero/farm_agronomist_gis.jpg", tag: "Field Mapping" },
                    { title: "Cocoa Pod Harvest", img: "/images/hero/farm_cocoa_harvest.jpg", tag: "Tree Crops" },
                    { title: "Paddy Rice Harvest", img: "/images/hero/farm_rice_paddy.jpg", tag: "Community Outgrower" },
                    { title: "Pepper Harvest Grading", img: "/images/hero/farm_pepper_sorting.jpg", tag: "Horticulture" },
                    { title: "Organic Row Crops", img: "/images/hero/farm_vegetable_field.jpg", tag: "Soil Cultivation" }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => window.open(item.img, '_blank')}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-950 aspect-video cursor-pointer shadow-md hover:shadow-2xl transition-all"
                    >
                      <img 
                        src={item.img} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-2.5 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">{item.tag}</span>
                        <span className="text-xs font-black text-white truncate block">{item.title}</span>
                        <span className="text-[8px] text-slate-300 font-semibold block mt-0.5 group-hover:text-amber-400 transition-colors">Click for Full-Res HD ↗</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* SECTION: SEED-TO-SHELF PUBLIC BATCH PROVENANCE VERIFIER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <Card className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500">
                        <QrCode className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Public Seed-to-Shelf Batch Provenance Verifier</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Scan consumer QR code or enter product lot batch number</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                      Hyperledger Immutable Log
                    </Badge>
                  </div>

                  <form onSubmit={handleSearchProvenance} className="flex space-x-2">
                    <Input 
                      value={searchBatchNumber} 
                      onChange={(e) => setSearchBatchNumber(e.target.value)}
                      placeholder="Enter Batch ID (e.g. BATCH-2026-RICE-091)"
                      className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-sm font-mono font-bold"
                    />
                    <Button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl px-6">
                      Verify Lot
                    </Button>
                  </form>

                  {activeProvenance && (
                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">VERIFIED COMMODITY BATCH</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">{activeProvenance.cropVariety}</span>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                          {activeProvenance.qualityGrade}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                        <div><span className="text-slate-400">Farm Estate / Site:</span> <strong className="text-slate-900 dark:text-white block">{activeProvenance.siteName}</strong></div>
                        <div><span className="text-slate-400">Field Plot & GeoJSON:</span> <strong className="text-slate-900 dark:text-white block font-mono text-[11px]">{activeProvenance.fieldPlot}</strong></div>
                        <div><span className="text-slate-400">Seed Lot & Non-GMO:</span> <strong className="text-slate-900 dark:text-white block">{activeProvenance.seedLotNumber} ({activeProvenance.germinationRatePct}% Germination)</strong></div>
                        <div><span className="text-slate-400">Harvest Date & Yield:</span> <strong className="text-slate-900 dark:text-white block">{activeProvenance.harvestDate} ({activeProvenance.harvestYieldKg.toLocaleString()} kg)</strong></div>
                        <div><span className="text-slate-400">Cold Chain Storage:</span> <strong className="text-sky-600 dark:text-sky-400 block">{activeProvenance.coldStorageTempC}°C in {activeProvenance.coldStorageRoom}</strong></div>
                        <div><span className="text-slate-400">Phytosanitary Cert #:</span> <strong className="text-emerald-600 dark:text-emerald-400 block font-mono">{activeProvenance.phytosanitaryCertId}</strong></div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">Hash: {activeProvenance.blockchainHash.slice(0, 24)}...</span>
                        <Button 
                          onClick={() => {
                            toast({ title: "Certificate Downloaded", description: `Saved Phytosanitary & Provenance Certificate for ${activeProvenance.batchNumber}` });
                          }}
                          className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-emerald-500 hover:text-slate-950 font-bold rounded-xl text-xs px-3 py-1.5 flex items-center space-x-1"
                        >
                          <FileDown className="w-3.5 h-3.5 mr-1" />
                          <span>Download Export Cert PDF</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* CORPORATE & REGULATORY CERTIFICATIONS VAULT */}
                <Card className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <Award className="w-6 h-6 text-amber-500" />
                      <div>
                        <h3 className="text-xl font-bold">Regulatory & Compliance Vault</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Publicly verifiable international certificates</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">GlobalG.A.P. Certified Farm</span>
                          <span className="text-[10px] text-slate-400">Good Agricultural Practices • Cert #GAP-99402</span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">VERIFIED</Badge>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <Leaf className="w-5 h-5 text-emerald-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">USDA Organic Accreditation</span>
                          <span className="text-[10px] text-slate-400">Pesticide & Chemical-Free • Cert #ORG-2026</span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">VERIFIED</Badge>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-sky-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">ISO 22000 / HACCP Food Safety</span>
                          <span className="text-[10px] text-slate-400">Agro-Processing & Milling Safety Standard</span>
                        </div>
                      </div>
                      <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400 text-[10px]">VERIFIED</Badge>
                    </div>
                  </div>
                </Card>

              </div>

              {/* COMPREHENSIVE INTERACTIVE OUTGROWER & SMALLHOLDER COMMUNITY PORTAL */}
              <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 text-slate-900 dark:text-white space-y-6 shadow-2xl backdrop-blur-xl">
                
                {/* Portal Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
                  <div className="flex items-start space-x-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-500">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-emerald-600 text-white font-black text-xs">
                          National Smallholder Outgrower Network
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                          15 Liberian Counties • 3,200+ Contracted Farmers
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Outgrower Scheme & Community Smallholder Portal
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                        Access certified seeds, tractor mechanization pooling, agronomy drone extension, and guaranteed off-take contracts with instant Mobile Money payouts.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Paddy Rice Floor Price</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">$380 USD / Metric Ton</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Yellow Maize Floor Price</span>
                      <span className="font-black text-amber-600 dark:text-amber-400 text-sm">$420 USD / Metric Ton</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                  <button
                    onClick={() => setOutgrowerSubTab("calculator")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      outgrowerSubTab === "calculator"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>1. Guaranteed Floor Price & Revenue Calculator</span>
                  </button>

                  <button
                    onClick={() => setOutgrowerSubTab("enrollment")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      outgrowerSubTab === "enrollment"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <FileSignature className="w-4 h-4" />
                    <span>2. Cooperative & Farmer Enrollment</span>
                  </button>

                  <button
                    onClick={() => setOutgrowerSubTab("mechanization")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      outgrowerSubTab === "mechanization"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>3. Tractor Mechanization & Inputs Booking</span>
                  </button>

                  <button
                    onClick={() => setOutgrowerSubTab("deliveries")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      outgrowerSubTab === "deliveries"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>4. Active Deliveries & Weighbridge Ledger ({outgrowerDeliveries.length})</span>
                  </button>
                </div>

                {/* TAB CONTENT 1: GUARANTEED REVENUE & PAYOUT CALCULATOR */}
                {outgrowerSubTab === "calculator" && (() => {
                  const cropPricingMap: Record<string, { name: string; pricePerTonUsd: number; defaultYield: number; unit: string; desc: string }> = {
                    NERICA_RICE: { name: "NERICA Certified Paddy Rice", pricePerTonUsd: 380, defaultYield: 2.2, unit: "Metric Tons", desc: "Non-GMO high-yield certified paddy grain with 14% target moisture." },
                    CASSAVA_TUBERS: { name: "High-Starch Cassava (TME 419)", pricePerTonUsd: 290, defaultYield: 8.5, unit: "Metric Tons", desc: "Industrial starch and fufu processing flour tubers." },
                    YELLOW_MAIZE: { name: "Yellow Feed Maize Grain", pricePerTonUsd: 420, defaultYield: 3.0, unit: "Metric Tons", desc: "Commercial poultry feed & livestock meal grade grain." },
                    ORGANIC_CHILI: { name: "Organic Chili Pepper & Horticulture", pricePerTonUsd: 850, defaultYield: 4.0, unit: "Metric Tons", desc: "Fresh harvest graded and vacuum packed for cold chain." },
                    COCOA_BEANS: { name: "Fermented Premium Cocoa Beans", pricePerTonUsd: 1400, defaultYield: 0.8, unit: "Metric Tons", desc: "Traceable organic tree crop beans for international export." }
                  };

                  const selCrop = cropPricingMap[calcCrop] || cropPricingMap.NERICA_RICE;
                  const estimatedTotalTons = calcAcreage * (calcYieldTonsPerAcre || selCrop.defaultYield);
                  const grossRevenueUsd = estimatedTotalTons * selCrop.pricePerTonUsd;
                  const inputAdvanceDeductionUsd = calcAcreage * 65; // $65/acre for seed & bio-fertilizer credit
                  const netFarmerPayoutUsd = Math.max(0, grossRevenueUsd - inputAdvanceDeductionUsd);
                  const lrdExchangeRate = 195; // 1 USD = 195 LRD
                  const netFarmerPayoutLrd = netFarmerPayoutUsd * lrdExchangeRate;

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Interactive Input Controls */}
                      <div className="lg:col-span-6 space-y-5 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-3">
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <Scale className="w-5 h-5 text-emerald-500" />
                            <span>Select Your Crop & Cultivated Acreage</span>
                          </h4>
                          <p className="text-xs text-slate-500">Calculate your guaranteed contract off-take revenue based on TOTAG floor prices.</p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Commodity Crop:</Label>
                          <select
                            value={calcCrop}
                            onChange={(e) => {
                              const c = e.target.value;
                              setCalcCrop(c);
                              if (cropPricingMap[c]) {
                                setCalcYieldTonsPerAcre(cropPricingMap[c].defaultYield);
                              }
                            }}
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                          >
                            <option value="NERICA_RICE">🌾 NERICA Certified Paddy Rice ($380 USD / Ton)</option>
                            <option value="CASSAVA_TUBERS">🥔 High-Starch Cassava TME 419 ($290 USD / Ton)</option>
                            <option value="YELLOW_MAIZE">🌽 Yellow Feed Maize Grain ($420 USD / Ton)</option>
                            <option value="ORGANIC_CHILI">🌶️ Organic Hot Chili Pepper ($850 USD / Ton)</option>
                            <option value="COCOA_BEANS">🍫 Fermented Premium Cocoa ($1,400 USD / Ton)</option>
                          </select>
                          <p className="text-[11px] text-slate-500 italic">{selCrop.desc}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cultivated Farm Size:</Label>
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">{calcAcreage} Acres</span>
                            </div>
                            <Input
                              type="number"
                              min="1"
                              max="500"
                              value={calcAcreage}
                              onChange={(e) => setCalcAcreage(Math.max(1, Number(e.target.value)))}
                              className="rounded-xl text-xs font-bold bg-white dark:bg-slate-900"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expected Yield / Acre:</Label>
                              <span className="font-mono font-bold text-amber-500 text-xs">{calcYieldTonsPerAcre} Tons/Acre</span>
                            </div>
                            <Input
                              type="number"
                              step="0.1"
                              min="0.1"
                              max="30"
                              value={calcYieldTonsPerAcre}
                              onChange={(e) => setCalcYieldTonsPerAcre(Math.max(0.1, parseFloat(e.target.value) || selCrop.defaultYield))}
                              className="rounded-xl text-xs font-bold bg-white dark:bg-slate-900"
                            />
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-600 dark:text-slate-300">Estimated Harvest Output:</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono">{estimatedTotalTons.toFixed(1)} Metric Tons</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-600 dark:text-slate-300">Guaranteed Floor Price:</span>
                            <span className="text-slate-900 dark:text-white font-mono">${selCrop.pricePerTonUsd} USD / Ton</span>
                          </div>
                          <div className="flex justify-between text-slate-500 text-[11px]">
                            <span>Input Credit & Seed Advance ($65/Acre):</span>
                            <span className="text-rose-500 font-mono">-${inputAdvanceDeductionUsd.toLocaleString()} USD</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Revenue Payout & MoMo Settlement Breakdown */}
                      <div className="lg:col-span-6 space-y-5 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-900/40 p-6 rounded-2xl border border-emerald-500/30">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-3 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400">
                            Net Harvest Cash Settlement
                          </span>
                          <Badge className="bg-emerald-600 text-white font-bold text-[10px]">
                            Guaranteed Contract Off-Take
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Total Projected Payout:</span>
                          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            ${netFarmerPayoutUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">USD</span>
                          </div>
                          <div className="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono">
                            ≈ {netFarmerPayoutLrd.toLocaleString(undefined, { maximumFractionDigits: 0 })} LRD (Liberian Dollars @ 195 LRD/USD)
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Payment Timeline</span>
                            <span className="font-extrabold text-slate-900 dark:text-white">Instant at Mill Weighbridge</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Disbursement Channel</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Lonestar MoMo / Orange</span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <Button
                            onClick={() => {
                              setOutgrowerForm(prev => ({
                                ...prev,
                                cropType: selCrop.name,
                                farmSizeAcres: calcAcreage
                              }));
                              setOutgrowerSubTab("enrollment");
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
                          >
                            <FileSignature className="w-4 h-4" />
                            <span>Lock This Floor Price & Enroll Cooperative ➔</span>
                          </Button>
                        </div>
                      </div>

                    </div>
                  );
                })()}

                {/* TAB CONTENT 2: COOPERATIVE & FARMER ENROLLMENT FORM */}
                {outgrowerSubTab === "enrollment" && (
                  <div className="space-y-6">
                    {enrolledReceipt ? (
                      <div className="p-8 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-3xl shadow-xl">
                          ✓
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                          Cooperative Enrolled in TOTAG Off-Take Program!
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                          Membership Pass <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">#{enrolledReceipt.id}</span> issued for <span className="font-bold">{outgrowerForm.cooperativeName}</span> ({outgrowerForm.farmSizeAcres} Acres of {outgrowerForm.cropType}). Input allocation and agronomy team dispatched.
                        </p>
                        <div className="flex justify-center gap-3 pt-2">
                          <Button
                            onClick={() => setEnrolledReceipt(null)}
                            variant="outline"
                            className="rounded-xl text-xs font-bold"
                          >
                            Enroll Another Farmer Group
                          </Button>
                          <Button
                            onClick={() => setOutgrowerSubTab("deliveries")}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                          >
                            View Intake Deliveries Ledger ➔
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const passId = `OUTGROWER-LIB-${Math.floor(10000 + Math.random() * 90000)}`;
                          setEnrolledReceipt({ id: passId, date: new Date().toLocaleDateString() });
                          toast({
                            title: "Outgrower Registration Confirmed",
                            description: `Cooperative ${outgrowerForm.cooperativeName} assigned ID ${passId}.`
                          });
                        }}
                        className="space-y-6"
                      >
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-4 text-xs">
                          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">
                            <Building2 className="w-4 h-4 text-emerald-500" />
                            <span>1. Farmer Group & Primary Contact</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cooperative / Farm Name *</Label>
                              <Input
                                value={outgrowerForm.cooperativeName}
                                onChange={(e) => setOutgrowerForm({ ...outgrowerForm, cooperativeName: e.target.value })}
                                className="rounded-xl text-xs bg-white dark:bg-slate-900"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lead Farmer / Chair Person *</Label>
                              <Input
                                value={outgrowerForm.leadFarmerName}
                                onChange={(e) => setOutgrowerForm({ ...outgrowerForm, leadFarmerName: e.target.value })}
                                className="rounded-xl text-xs bg-white dark:bg-slate-900"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Phone / WhatsApp *</Label>
                              <Input
                                value={outgrowerForm.phone}
                                onChange={(e) => setOutgrowerForm({ ...outgrowerForm, phone: e.target.value })}
                                className="rounded-xl text-xs bg-white dark:bg-slate-900"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-4 text-xs">
                          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            <span>2. Farm Location & Crop Profile in Liberia</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">County in Liberia *</Label>
                              <select
                                value={outgrowerForm.county}
                                onChange={(e) => setOutgrowerForm({ ...outgrowerForm, county: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                              >
                                {["Lofa", "Nimba", "Bong", "Margibi", "Grand Bassa", "Grand Gedeh", "Maryland", "Sinoe", "Bomi", "Grand Cape Mount", "Rivercess", "River Gee", "Gbarpolu", "Grand Kru", "Montserrado"].map(c => (
                                  <option key={c} value={c}>{c} County</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">District / Clan *</Label>
                              <Input
                                value={outgrowerForm.district}
                                onChange={(e) => setOutgrowerForm({ ...outgrowerForm, district: e.target.value })}
                                className="rounded-xl text-xs bg-white dark:bg-slate-900"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Commodity Crop *</Label>
                              <select
                                value={outgrowerForm.cropType}
                                onChange={(e) => setOutgrowerForm({ ...outgrowerForm, cropType: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                              >
                                <option value="NERICA Certified Paddy Rice">NERICA Certified Paddy Rice</option>
                                <option value="High-Starch Cassava (TME 419)">High-Starch Cassava (TME 419)</option>
                                <option value="Yellow Feed Maize Grain">Yellow Feed Maize Grain</option>
                                <option value="Organic Hot Chili Pepper">Organic Hot Chili Pepper</option>
                                <option value="Fermented Premium Cocoa">Fermented Premium Cocoa</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Farm Size (Acres) *</Label>
                              <Input
                                type="number"
                                min="1"
                                value={outgrowerForm.farmSizeAcres}
                                onChange={(e) => setOutgrowerForm({ ...outgrowerForm, farmSizeAcres: Number(e.target.value) })}
                                className="rounded-xl text-xs bg-white dark:bg-slate-900"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-4 text-xs">
                          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">
                            <CreditCard className="w-4 h-4 text-sky-500" />
                            <span>3. Mobile Money Payout Account (Guaranteed Instant Payout)</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Money Provider *</Label>
                              <select
                                value={outgrowerForm.momoProvider}
                                onChange={(e) => setOutgrowerForm({ ...outgrowerForm, momoProvider: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                              >
                                <option value="Lonestar MTN MoMo">Lonestar MTN Mobile Money (MoMo)</option>
                                <option value="Orange Money">Orange Money Liberia</option>
                                <option value="Direct Bank Wire (Ecobank/UBA)">Direct Commercial Bank Wire</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Registered MoMo Number *</Label>
                              <Input
                                value={outgrowerForm.momoNumber}
                                onChange={(e) => setOutgrowerForm({ ...outgrowerForm, momoNumber: e.target.value })}
                                placeholder="0884445566"
                                className="rounded-xl text-xs bg-white dark:bg-slate-900 font-mono"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Payment Currency Preference</Label>
                              <select
                                value={outgrowerForm.preferredPayment}
                                onChange={(e) => setOutgrowerForm({ ...outgrowerForm, preferredPayment: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                              >
                                <option value="100% USD Cash/MoMo">100% United States Dollars (USD)</option>
                                <option value="50% USD / 50% LRD Split">50% USD / 50% LRD Split</option>
                                <option value="100% LRD (Liberian Dollars)">100% Liberian Dollars (LRD)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 px-8 rounded-xl shadow-xl flex items-center gap-2"
                          >
                            <FileSignature className="w-4 h-4" />
                            <span>Enroll Cooperative in Guaranteed Off-Take Scheme ➔</span>
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* TAB CONTENT 3: TRACTOR MECHANIZATION & INPUTS BOOKING */}
                {outgrowerSubTab === "mechanization" && (
                  <div className="space-y-6">
                    {mechBookedRef ? (
                      <div className="p-8 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-3xl shadow-xl">
                          🚜
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                          Mechanization Equipment Booked!
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                          Booking reference <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">#{mechBookedRef}</span> logged for <span className="font-bold">{mechanizationForm.serviceType}</span> ({mechanizationForm.targetAcres} Acres in {mechanizationForm.county} County). The regional hub operator will arrive on schedule.
                        </p>
                        <div className="pt-2">
                          <Button
                            onClick={() => setMechBookedRef(null)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                          >
                            Book Another Service
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Booking Form */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const ref = `MECH-HUB-${Math.floor(1000 + Math.random() * 9000)}`;
                            setMechBookedRef(ref);
                            toast({
                              title: "Equipment Scheduled",
                              description: `Service scheduled under Booking #${ref}.`
                            });
                          }}
                          className="lg:col-span-7 space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs"
                        >
                          <div className="border-b border-slate-200 dark:border-white/10 pb-3">
                            <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                              <Truck className="w-5 h-5 text-amber-500" />
                              <span>Book Regional Mechanization & Input Dispatch</span>
                            </h4>
                            <p className="text-xs text-slate-500">Shared equipment pooling program supporting smallholder farm productivity.</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Farmer / Cooperative Lead *</Label>
                              <Input
                                value={mechanizationForm.farmerName}
                                onChange={(e) => setMechanizationForm({ ...mechanizationForm, farmerName: e.target.value })}
                                className="rounded-xl text-xs bg-white dark:bg-slate-900"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone / WhatsApp *</Label>
                              <Input
                                value={mechanizationForm.phone}
                                onChange={(e) => setMechanizationForm({ ...mechanizationForm, phone: e.target.value })}
                                className="rounded-xl text-xs bg-white dark:bg-slate-900"
                                required
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Mechanization Service *</Label>
                              <select
                                value={mechanizationForm.serviceType}
                                onChange={(e) => setMechanizationForm({ ...mechanizationForm, serviceType: e.target.value })}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                              >
                                <option value="Tractor Plowing & Harrowing (John Deere 4WD)">🚜 Tractor Heavy Plowing & Harrowing ($45/Acre)</option>
                                <option value="Combine Harvester & Grain Threshing Unit">🌾 Combine Harvester & De-stoner Unit ($40/Acre)</option>
                                <option value="Multi-Spectral Drone Soil & Canopy Scouting">🛰️ Drone Multi-Spectral Soil & Crop Scouting ($15/Acre)</option>
                                <option value="Certified NERICA Seed Distribution & Bio-Fertilizer Delivery">🌱 Certified Seed & Bio-Fertilizer Direct Delivery</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Acreage to Plow/Harvest</Label>
                              <Input
                                type="number"
                                min="1"
                                value={mechanizationForm.targetAcres}
                                onChange={(e) => setMechanizationForm({ ...mechanizationForm, targetAcres: Number(e.target.value) })}
                                className="rounded-xl text-xs bg-white dark:bg-slate-900"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Requested Start Date</Label>
                              <Input
                                type="date"
                                value={mechanizationForm.requestedStartDate}
                                onChange={(e) => setMechanizationForm({ ...mechanizationForm, requestedStartDate: e.target.value })}
                                className="rounded-xl text-xs bg-white dark:bg-slate-900"
                                required
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Confirm Mechanization Equipment Booking ➔</span>
                          </Button>
                        </form>

                        {/* Equipment Pool Live Status */}
                        <div className="lg:col-span-5 space-y-4">
                          <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                            Regional Hub Equipment Availability:
                          </h5>
                          <div className="space-y-2.5 text-xs">
                            {[
                              { name: "John Deere 5075E 4WD (Lofa Hub)", status: "AVAILABLE", eta: "Same Day Dispatch", icon: "🚜" },
                              { name: "Yanmar Heavy Rice Combine (Bong Hub)", status: "AVAILABLE", eta: "24-Hr Booking", icon: "🌾" },
                              { name: "DJI Agras T40 Spray & Scouting Drone", status: "ONLINE", eta: "Autonomous Mission", icon: "🛰️" },
                              { name: "Mobile Grain Dryer & Moisture Tester", status: "DEPLOYED", eta: "Active at Ganta Mill", icon: "🔥" }
                            ].map((eq, idx) => (
                              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{eq.icon}</span>
                                  <div>
                                    <h6 className="font-bold text-slate-900 dark:text-white text-xs">{eq.name}</h6>
                                    <span className="text-[10px] text-slate-500">{eq.eta}</span>
                                  </div>
                                </div>
                                <Badge className={eq.status === "AVAILABLE" || eq.status === "ONLINE" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]" : "bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px]"}>
                                  {eq.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT 4: ACTIVE DELIVERIES & WEIGHBRIDGE LEDGER */}
                {outgrowerSubTab === "deliveries" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
                      <div>
                        <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-emerald-500" />
                          <span>Live Smallholder Grain Deliveries & Payout Settlement Ledger</span>
                        </h4>
                        <p className="text-xs text-slate-500">Real-time intake records from TOTAG central weighbridges and processing elevators.</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Search cooperative, county, crop..."
                          value={deliverySearchQuery}
                          onChange={(e) => setDeliverySearchQuery(e.target.value)}
                          className="h-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 w-60 font-medium"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-black text-[10px] border-b border-slate-200 dark:border-white/10">
                          <tr>
                            <th className="p-3.5">Intake Batch ID</th>
                            <th className="p-3.5">Cooperative / Location</th>
                            <th className="p-3.5">Commodity Crop</th>
                            <th className="p-3.5">Weighbridge Tonnage</th>
                            <th className="p-3.5">Moisture / Grade</th>
                            <th className="p-3.5">Total Settlement</th>
                            <th className="p-3.5">Payment Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-900 dark:text-slate-200">
                          {outgrowerDeliveries
                            .filter(d => 
                              d.cooperative.toLowerCase().includes(deliverySearchQuery.toLowerCase()) ||
                              d.county.toLowerCase().includes(deliverySearchQuery.toLowerCase()) ||
                              d.crop.toLowerCase().includes(deliverySearchQuery.toLowerCase())
                            )
                            .map((dlv) => (
                              <tr key={dlv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{dlv.id}</td>
                                <td className="p-3.5">
                                  <div className="font-bold text-slate-900 dark:text-white">{dlv.cooperative}</div>
                                  <span className="text-[10px] text-slate-500">{dlv.county} County, Liberia</span>
                                </td>
                                <td className="p-3.5 font-semibold">{dlv.crop}</td>
                                <td className="p-3.5 font-mono font-extrabold">{dlv.tonnage} Metric Tons</td>
                                <td className="p-3.5">
                                  <span className="font-mono text-amber-500 font-bold">{dlv.moisturePct}% Moisture</span>
                                  <span className="block text-[10px] text-slate-400">{dlv.qualityGrade}</span>
                                </td>
                                <td className="p-3.5 font-mono font-black text-slate-900 dark:text-white">
                                  ${dlv.totalPayoutUsd.toLocaleString()} USD
                                </td>
                                <td className="p-3.5">
                                  <Badge className={dlv.status === "COMPLETED_PAID" ? "bg-emerald-600 text-white text-[10px] font-bold" : "bg-amber-500 text-slate-950 text-[10px] font-bold"}>
                                    {dlv.status === "COMPLETED_PAID" ? "✓ Paid via MoMo" : "Intake Verification"}
                                  </Badge>
                                  <span className="block text-[10px] text-slate-500 mt-0.5">{dlv.paymentMethod}</span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            </TabsContent>

            {/* =================================================================== */}
            {/* TAB 2: B2B OFF-TAKER COMMERCE & SUPPLY CHAIN                       */}
            {/* =================================================================== */}
            <TabsContent value="b2b-commerce" className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Contract Farming & Futures Booking Engine */}
                <Card className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-6 h-6 text-emerald-500" />
                      <div>
                        <h3 className="text-xl font-bold">Contract Farming & Futures Purchasing Engine</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Volume forward contracts, off-take agreements & spot purchasing</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">Tiered Volume Pricing</Badge>
                  </div>

                  <form onSubmit={handleExecuteB2bContract} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Buyer Company / Entity *</Label>
                        <Input 
                          value={b2bContractForm.buyerCompany} 
                          onChange={(e) => setB2bContractForm({...b2bContractForm, buyerCompany: e.target.value})}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Official Contact Email *</Label>
                        <Input 
                          type="email"
                          value={b2bContractForm.contactEmail} 
                          onChange={(e) => setB2bContractForm({...b2bContractForm, contactEmail: e.target.value})}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Commodity Variety</Label>
                        <select 
                          value={b2bContractForm.commodity}
                          onChange={(e) => setB2bContractForm({...b2bContractForm, commodity: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1"
                        >
                          <option value="TOTAG Superba Polished Rice (50kg Bags)">TOTAG Superba Polished Rice (50kg)</option>
                          <option value="Yellow Hybrid Maize Grain (Bulk)">Yellow Hybrid Maize Grain (Bulk)</option>
                          <option value="Roma Hydroponic Tomatoes">Roma Hydroponic Tomatoes (Crates)</option>
                          <option value="Grass-Fed Ndama Beef Prime Cuts">Grass-Fed Ndama Beef Cuts</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Contract Type</Label>
                        <select 
                          value={b2bContractForm.contractType}
                          onChange={(e) => {
                            const ct = e.target.value;
                            setB2bContractForm({
                              ...b2bContractForm, 
                              contractType: ct,
                              unitPriceUsd: ct === "FORWARD_CONTRACT" ? 420 : 500
                            });
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1"
                        >
                          <option value="FORWARD_CONTRACT">FORWARD CONTRACT ($420/Ton)</option>
                          <option value="OFF_TAKE_AGREEMENT">OFF-TAKE AGREEMENT ($400/Ton)</option>
                          <option value="SPOT_ORDER">SPOT MARKET ORDER ($500/Ton)</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Order Quantity (Tons)</Label>
                        <Input 
                          type="number" 
                          value={b2bContractForm.orderQuantityTons} 
                          onChange={(e) => setB2bContractForm({...b2bContractForm, orderQuantityTons: Number(e.target.value)})}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">Total Contract Valuation</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          ${(b2bContractForm.orderQuantityTons * b2bContractForm.unitPriceUsd).toLocaleString()} USD
                        </span>
                      </div>
                      <Badge className="bg-emerald-500 text-slate-950 font-bold">Escrow Protection</Badge>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl py-3 text-xs shadow-lg flex items-center justify-center space-x-2">
                      <FileSignature className="w-4 h-4" />
                      <span>Execute Forward Contract & Lock Escrow Pricing</span>
                    </Button>
                  </form>
                </Card>

                {/* Live Cold-Chain Reefer Telematics Track & Trace */}
                <Card className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-6 h-6 text-sky-500" />
                      <div>
                        <h3 className="text-xl font-bold">Live Reefer Cold-Chain Telematics</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Refrigerated transport location & environmental monitoring</p>
                      </div>
                    </div>
                    <Radio className="w-6 h-6 text-emerald-500 animate-pulse" />
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 grid grid-cols-3 gap-3 text-center">
                      <div>
                        <span className="text-slate-400 block text-[10px]">CONTAINER TEMP</span>
                        <span className="font-bold text-sky-500 text-sm flex items-center justify-center space-x-1 mt-0.5">
                          <Thermometer className="w-3.5 h-3.5" />
                          <span>2.8 °C</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">HUMIDITY %</span>
                        <span className="font-bold text-emerald-500 text-sm flex items-center justify-center space-x-1 mt-0.5">
                          <Droplets className="w-3.5 h-3.5" />
                          <span>68 %</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">SHOCK G-FORCE</span>
                        <span className="font-bold text-teal-400 text-sm flex items-center justify-center space-x-1 mt-0.5">
                          <Activity className="w-3.5 h-3.5" />
                          <span>0.3 G</span>
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">GPS ROUTE & DESTINATION</span>
                      <span className="font-bold text-slate-900 dark:text-white block">Reefer Container #REEFER-TOTAG-904</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono block">6.3156° N, 10.8074° W (En Route to Monrovia Freeport Depot)</span>
                    </div>
                  </div>
                </Card>

              </div>

            </TabsContent>

            {/* =================================================================== */}
            {/* TAB 3: ENTERPRISE OPERATIONS COMMAND CENTER                         */}
            {/* =================================================================== */}
            <TabsContent value="operations-command" className="space-y-8">
              
              {/* STAFF & WORKER ACCESS BANNER */}
              <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/20 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-xl text-white">TOTAG FARM Operations Command Center</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                        Staff & Worker Access
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                      Precision agronomy, PostGIS spatial field mapping, smart greenhouse fertigation, solar microgrid NOC, and livestock bio-telemetry.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <Button 
                    onClick={() => window.location.href = "/farm/login"}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black rounded-xl px-5 py-2.5 shadow-lg flex items-center space-x-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Open Staff Login Portal</span>
                  </Button>
                </div>
              </div>
              
              {/* SECTION 1: GIS MULTI-SPECTRAL FIELD MAPPING & SMART GREENHOUSE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* GIS Multi-Spectral Field Plots (PostGIS Spatial Index) */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-6 h-6 text-emerald-500" />
                      <div>
                        <h3 className="text-xl font-bold">GIS Multi-Spectral Field Mapping</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">PostGIS spatial bounding box (&&) indexed field plots</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">PostGIS Spatial Index</Badge>
                  </div>

                  <div className="space-y-3">
                    {MOCK_FIELD_PLOTS.map((plot) => (
                      <div key={plot.plotId} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{plot.plotId} • {plot.cropVariety}</span>
                          <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">NDVI Vigor: {plot.ndviScore}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-500 dark:text-slate-400">
                          <div>Area: <strong className="text-slate-900 dark:text-white">{plot.areaHectares} Ha</strong></div>
                          <div>Stage: <strong className="text-slate-900 dark:text-white">{plot.stage}</strong></div>
                          <div>Soil Moisture: <strong className="text-sky-600 dark:text-sky-400">{plot.soilMoisturePct}%</strong></div>
                          <div>Spatial Index: <strong className="text-slate-900 dark:text-white font-mono text-[10px]">{plot.spatialBoundingBox}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Smart Greenhouse & Autonomous Fertigation Command (ESP32 Fallback Safeguard) */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <Sliders className="w-6 h-6 text-sky-500" />
                      <div>
                        <h3 className="text-xl font-bold">Autonomous Smart Greenhouse & Fertigation</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">VPD, PAR, N-P-K & pH dosing automation</p>
                      </div>
                    </div>

                    {/* CRITICAL SAFEGUARD: ESP32 / Raspberry Pi Local Edge Fallback Status */}
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] flex items-center space-x-1">
                      <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                      <span>ESP32 Edge Fallback ACTIVE</span>
                    </Badge>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 grid grid-cols-3 gap-3 text-center">
                      <div>
                        <span className="text-slate-400 block text-[10px]">VPD (VAPOR DEFICIT)</span>
                        <span className="font-bold text-sky-500 text-sm">{greenhouseState.vpdKpa} kPa</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">TARGET pH</span>
                        <span className="font-bold text-emerald-500 text-sm">{greenhouseState.phLevel}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">TARGET EC (dS/m)</span>
                        <span className="font-bold text-amber-500 text-sm">{greenhouseState.ecDsm}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-[11px]">Local Edge Computing Node Protection</span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                        Local ESP32 node ({greenhouseState.edgeNodeId}) maintains autonomous irrigation and ventilation schedules if cloud link drops.
                      </p>
                    </div>

                    <Button 
                      onClick={() => setIsFertigationModalOpen(true)}
                      className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl py-3"
                    >
                      Adjust Fertigation Dosing & N-P-K Schedule
                    </Button>
                  </div>
                </Card>

              </div>

              {/* SECTION 2: LIVESTOCK BIOMETRIC TELEMETRY (WITH CRITICAL SAFEGUARDS) */}
              <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-rose-500" />
                    <div>
                      <h3 className="text-xl font-bold">Livestock Bio-Telemetry & Export Safeguard Monitor</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">BLE ear-tag temp (&gt;39.5°C fever), rumination (&lt;300m distress) & withdrawal locks</p>
                    </div>
                  </div>
                  <Badge className="bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px]">
                    Export Safeguards Enforced
                  </Badge>
                </div>

                <div className="space-y-3">
                  {livestockList.map((animal) => (
                    <div 
                      key={animal.tagNumber} 
                      className={`p-4 rounded-2xl border space-y-2 text-xs transition-all ${
                        animal.healthStatus === "FEVER_ALERT" 
                          ? "bg-rose-500/10 border-rose-500/40" 
                          : animal.healthStatus === "DIGESTIVE_DISTRESS" 
                          ? "bg-amber-500/10 border-amber-500/40" 
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{animal.tagNumber}</span>
                          <span className="text-slate-500">{animal.breed} ({animal.species})</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {animal.isProcessingBlocked && (
                            <Badge className="bg-rose-500 text-white font-bold text-[10px] flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span>PROCESSING BLOCKED</span>
                            </Badge>
                          )}
                          <Badge className={
                            animal.healthStatus === "HEALTHY" 
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                              : animal.healthStatus === "FEVER_ALERT" 
                              ? "bg-rose-500 text-white animate-pulse" 
                              : "bg-amber-500 text-slate-950 font-bold"
                          }>
                            {animal.healthStatus}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-slate-600 dark:text-slate-300">
                        <div>Body Temp: <strong className={animal.bodyTempC > 39.5 ? "text-rose-600 dark:text-rose-400 font-bold" : "text-slate-900 dark:text-white"}>{animal.bodyTempC}°C {animal.bodyTempC > 39.5 ? "(>39.5°C Fever Trigger!)" : ""}</strong></div>
                        <div>Rumination: <strong className={animal.ruminationMinutesToday < 300 ? "text-amber-600 dark:text-amber-400 font-bold" : "text-slate-900 dark:text-white"}>{animal.ruminationMinutesToday} min/day {animal.ruminationMinutesToday < 300 ? "(<300m Distress!)" : ""}</strong></div>
                        <div>Withdrawal End Date: <strong className="text-slate-900 dark:text-white">{animal.withdrawalEndDate || "None (Export Compliant)"}</strong></div>
                        <div>Location: <strong className="text-slate-900 dark:text-white">{animal.location}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* SECTION 3: INDUSTRIAL AGRO-PROCESSING & MILLING YIELD RECONCILIATION */}
              <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <Factory className="w-6 h-6 text-amber-500" />
                    <div>
                      <h3 className="text-xl font-bold">Industrial Agro-Processing & Milling Run Console</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Batch yield reconciliation (Standard rice milling recovery tolerance: 65% - 70%)</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                    Standard Recovery 65%-70%
                  </Badge>
                </div>

                <form onSubmit={handleExecuteMillingRun} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Processing Run #</Label>
                      <Input value={millingRunForm.runNumber} onChange={(e) => setMillingRunForm({...millingRunForm, runNumber: e.target.value})} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-mono" />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Input Raw Grain (kg)</Label>
                      <Input type="number" value={millingRunForm.inputRawKg} onChange={(e) => setMillingRunForm({...millingRunForm, inputRawKg: Number(e.target.value)})} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Output Finished Grain (kg)</Label>
                      <Input type="number" value={millingRunForm.outputFinishedKg} onChange={(e) => setMillingRunForm({...millingRunForm, outputFinishedKg: Number(e.target.value)})} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Moisture Content (%)</Label>
                      <Input type="number" step="0.1" value={millingRunForm.moistureContentPct} onChange={(e) => setMillingRunForm({...millingRunForm, moistureContentPct: Number(e.target.value)})} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                    isMillingYieldOutsideTolerance 
                      ? "bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400" 
                      : "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                  }`}>
                    <div>
                      <span className="block text-sm">Calculated Recovery Rate: {calculatedMillingYieldRatio.toFixed(1)}%</span>
                      <span className="text-[10px] font-normal block">Standard Milling Tolerance Range: 65.0% - 70.0%</span>
                    </div>

                    {isMillingYieldOutsideTolerance ? (
                      <Badge className="bg-rose-500 text-white font-bold">EXCEPTION FLAGGED</Badge>
                    ) : (
                      <Badge className="bg-emerald-500 text-slate-950 font-bold">PASSED QA RECOVERY</Badge>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl py-3 text-xs shadow-lg">
                    Log Milling Run & Reconcile Yield Output
                  </Button>
                </form>
              </Card>

            </TabsContent>

          </Tabs>
        </div>

        {/* MODAL 1: SMART GREENHOUSE FERTIGATION CONTROL MODAL */}
        <AnimatePresence>
          {isFertigationModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 text-slate-900 dark:text-white relative"
              >
                <button 
                  onClick={() => setIsFertigationModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-500">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Greenhouse Fertigation Dosing Override</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Target pH, Electrical Conductivity (EC) & N-P-K Dosing</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateFertigation} className="space-y-4">
                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Target Substrate pH Level (5.8 - 6.5)</Label>
                    <Input 
                      type="number" step="0.1"
                      value={greenhouseState.phLevel} 
                      onChange={(e) => setGreenhouseState({...greenhouseState, phLevel: Number(e.target.value)})}
                      className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-bold"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Target Electrical Conductivity EC (dS/m)</Label>
                    <Input 
                      type="number" step="0.1"
                      value={greenhouseState.ecDsm} 
                      onChange={(e) => setGreenhouseState({...greenhouseState, ecDsm: Number(e.target.value)})}
                      className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-bold"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl py-3 text-xs shadow-lg">
                    Dispatch Dosing Schedule to ESP32 Edge Node
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}
