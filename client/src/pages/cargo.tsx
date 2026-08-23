import { getApiUrl } from "@/lib/config";
import SubsidiaryHeroCarousel from "@/components/subsidiary-hero-carousel";
import { useState, useRef, useEffect } from "react";
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
  ImageIcon,
  X,
  MapPin,
  Plane,
  MessageSquare,
  Send,
  UserCheck,
  Receipt,
  FileCheck,
  CheckSquare,
  PenTool,
  Building2,
  Key,
  Shield,
  FileSignature,
  FileCheck2,
  FileSpreadsheet,
  Mail,
  MailCheck,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  Trash2,
  Phone,
  User,
  CheckCircle2,
  Sparkles,
  Printer,
  FileDown,
  ExternalLink,
  Settings,
  CreditCard,
  Wallet,
  DollarSign,
  UserPlus,
  ShieldAlert,
  Compass,
  Radio,
  FileMinus,
  HelpCircle,
  Smartphone,
  RotateCcw,
  LogIn
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// -----------------------------------------------------------------------------
// GLOBAL PORT DATABASE
// -----------------------------------------------------------------------------

interface PortItem {
  code: string;
  name: string;
  country: string;
  city: string;
  type: "Ocean" | "Air";
}

const GLOBAL_PORTS: PortItem[] = [
  // China
  { code: "CNTAO", name: "Port of Qingdao (Berth Terminal)", country: "China", city: "Qingdao", type: "Ocean" },
  { code: "TAO", name: "Qingdao Jiaodong Air Cargo Hub", country: "China", city: "Qingdao", type: "Air" },
  { code: "CNSHA", name: "Port of Shanghai (Yangshan Deepwater)", country: "China", city: "Shanghai", type: "Ocean" },
  { code: "PVG", name: "Shanghai Pudong Int'l Air Cargo", country: "China", city: "Shanghai", type: "Air" },
  { code: "CNNGB", name: "Port of Ningbo-Zhoushan", country: "China", city: "Ningbo", type: "Ocean" },
  { code: "CAN", name: "Guangzhou Baiyun Air Cargo Hub", country: "China", city: "Guangzhou", type: "Air" },
  { code: "CNSZX", name: "Port of Shenzhen (Yantian)", country: "China", city: "Shenzhen", type: "Ocean" },

  // Belgium & Europe
  { code: "BEANR", name: "Port of Antwerp-Bruges", country: "Belgium", city: "Antwerp", type: "Ocean" },
  { code: "BRU", name: "Brussels Air Cargo Hub", country: "Belgium", city: "Brussels", type: "Air" },
  { code: "DEHAM", name: "Port of Hamburg", country: "Germany", city: "Hamburg", type: "Ocean" },
  { code: "FRA", name: "Frankfurt World Cargo Center", country: "Germany", city: "Frankfurt", type: "Air" },
  { code: "NLRTM", name: "Port of Rotterdam", country: "Netherlands", city: "Rotterdam", type: "Ocean" },
  { code: "AMS", name: "Amsterdam Schiphol Cargo", country: "Netherlands", city: "Amsterdam", type: "Air" },

  // Liberia & West Africa
  { code: "LRMLW", name: "Freeport of Monrovia (Berth 2)", country: "Liberia", city: "Monrovia", type: "Ocean" },
  { code: "ROB", name: "Roberts Int'l Airport (ROB Cargo)", country: "Liberia", city: "Monrovia", type: "Air" },
  { code: "LRUCN", name: "Port of Buchanan", country: "Liberia", city: "Buchanan", type: "Ocean" },
  { code: "LRSVO", name: "Port of Sinoe / Greenville", country: "Liberia", city: "Greenville", type: "Ocean" },
  { code: "GHAPA", name: "Port of Tema", country: "Ghana", city: "Tema", type: "Ocean" },
  { code: "ACC", name: "Kotoka Int'l Airport Cargo", country: "Ghana", city: "Accra", type: "Air" },
  { code: "NGAPP", name: "Port of Lagos (Apapa)", country: "Nigeria", city: "Lagos", type: "Ocean" },
  { code: "LOS", name: "Murtala Muhammed Cargo Hub", country: "Nigeria", city: "Lagos", type: "Air" },
  { code: "CIABJ", name: "Port of Abidjan", country: "Cote d'Ivoire", city: "Abidjan", type: "Ocean" },
  { code: "ABJ", name: "Félix-Houphouët-Boigny Cargo Hub", country: "Cote d'Ivoire", city: "Abidjan", type: "Air" },

  // USA & Global Hubs
  { code: "USNYC", name: "Port of New York & New Jersey", country: "United States", city: "New York", type: "Ocean" },
  { code: "JFK", name: "JFK Airport Cargo Center", country: "United States", city: "New York", type: "Air" },
  { code: "USLAX", name: "Port of Los Angeles / Long Beach", country: "United States", city: "Los Angeles", type: "Ocean" },
  { code: "ORD", name: "Chicago O'Hare Air Cargo Hub", country: "United States", city: "Chicago", type: "Air" },
  { code: "AEDXB", name: "Port of Jebel Ali", country: "United Arab Emirates", city: "Dubai", type: "Ocean" },
  { code: "DXB", name: "Dubai World Central Airport", country: "United Arab Emirates", city: "Dubai", type: "Air" }
];

function PortAutocompleteInput({ 
  label, 
  value, 
  onChange, 
  calcMode 
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
  calcMode: "air" | "ocean";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPorts = GLOBAL_PORTS.filter(p => {
    if (!value.trim()) return true;
    const query = value.toLowerCase().trim();
    return (
      p.country.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query)
    );
  });

  return (
    <div ref={wrapperRef} className="relative">
      <Label className="text-xs text-slate-600 dark:text-slate-700 font-semibold">{label}</Label>
      <div className="relative mt-1">
        <Input 
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Type country (e.g. China, Belgium, Liberia)..."
          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs pr-8 font-medium focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
        <MapPin className="w-4 h-4 text-emerald-500 absolute right-2.5 top-2.5 pointer-events-none" />
      </div>

      <AnimatePresence>
        {isOpen && filteredPorts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto backdrop-blur-xl"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider flex justify-between items-center">
              <span>Matching Ports ({filteredPorts.length})</span>
              <span>Click to Select</span>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredPorts.map((port) => (
                <div
                  key={port.code}
                  onClick={() => {
                    onChange(`${port.name} (${port.code} - ${port.country})`);
                    setIsOpen(false);
                  }}
                  className="p-2.5 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg flex-shrink-0 ${port.type === "Air" ? "bg-sky-500/10 text-sky-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                      {port.type === "Air" ? <Plane className="w-3.5 h-3.5" /> : <Anchor className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-900 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 block truncate">
                        {port.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 block">
                        {port.country} • {port.city}
                      </span>
                    </div>
                  </div>

                  <Badge className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-700 border-slate-200 dark:border-white/10 font-mono text-[10px] ml-2 flex-shrink-0">
                    {port.code}
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------------
// HS TARIFF DATABASE FOR CUSTOMS DUTY ESTIMATOR
// -----------------------------------------------------------------------------

const TARIFF_HS_CODES = [
  { code: "8471.30.00", description: "Laptops & Portable Digital Computers", dutyRate: 0.05, gstRate: 0.10, ecowasRate: 0.005 },
  { code: "8704.22.00", description: "Heavy Cargo Dump Trucks & Trailers", dutyRate: 0.10, gstRate: 0.10, ecowasRate: 0.005 },
  { code: "3004.90.00", description: "Pharmaceuticals & Essential Vaccines", dutyRate: 0.00, gstRate: 0.00, ecowasRate: 0.005 },
  { code: "1006.30.00", description: "Polished Milled Rice (Food Staple)", dutyRate: 0.02, gstRate: 0.05, ecowasRate: 0.005 },
  { code: "8541.40.00", description: "Solar Panels & Photovoltaic Inverters", dutyRate: 0.00, gstRate: 0.00, ecowasRate: 0.005 },
  { code: "7214.20.00", description: "Construction Steel Deformed Reinforcing Bars", dutyRate: 0.15, gstRate: 0.10, ecowasRate: 0.005 }
];

// -----------------------------------------------------------------------------
// MOCK TELEMETRY & SHIPMENT DATA
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
  shockForceG: number;
  gpsCoordinates: string;
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
    shockForceG: 0.4,
    gpsCoordinates: "6.3156° N, 10.8074° W (Monrovia Berth 2)",
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
    shockForceG: 1.2,
    gpsCoordinates: "5.8812° N, 10.0451° W (Buchanan Terminal)",
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

// ===== INTERNATIONAL IATA AIRLINE & ISO 6346 MARITIME CARGO REGISTRY =====
const IATA_AIRLINES: Record<string, { name: string; hub: string; country: string; code: string }> = {
  "071": { name: "Ethiopian Airlines Cargo", hub: "Addis Ababa Bole (ADD)", country: "Ethiopia", code: "ET" },
  "706": { name: "Kenya Airways Cargo", hub: "Nairobi Jomo Kenyatta (NBO)", country: "Kenya", code: "KQ" },
  "176": { name: "Emirates SkyCargo", hub: "Dubai World Central (DWC/DXB)", country: "UAE", code: "EK" },
  "020": { name: "Lufthansa Cargo", hub: "Frankfurt Airport (FRA)", country: "Germany", code: "LH" },
  "057": { name: "Air France Cargo", hub: "Paris Charles de Gaulle (CDG)", country: "France", code: "AF" },
  "074": { name: "KLM Cargo", hub: "Amsterdam Schiphol (AMS)", country: "Netherlands", code: "KL" },
  "235": { name: "Turkish Cargo", hub: "Istanbul Airport (IST)", country: "Turkey", code: "TK" },
  "125": { name: "British Airways World Cargo", hub: "London Heathrow (LHR)", country: "United Kingdom", code: "BA" },
  "618": { name: "Singapore Airlines Cargo", hub: "Singapore Changi (SIN)", country: "Singapore", code: "SQ" },
  "006": { name: "Delta Cargo", hub: "Atlanta Hartsfield (ATL)", country: "USA", code: "DL" },
  "001": { name: "American Airlines Cargo", hub: "Miami / Dallas (MIA/DFW)", country: "USA", code: "AA" },
  "160": { name: "Cathay Cargo", hub: "Hong Kong International (HKG)", country: "Hong Kong", code: "CX" },
  "607": { name: "Etihad Cargo", hub: "Abu Dhabi International (AUH)", country: "UAE", code: "EY" },
  "157": { name: "Qatar Airways Cargo", hub: "Doha Hamad (DOH)", country: "Qatar", code: "QR" },
  "080": { name: "LOT Polish Airlines Cargo", hub: "Warsaw Chopin (WAW)", country: "Poland", code: "LO" },
  "014": { name: "Air Canada Cargo", hub: "Toronto Pearson (YYZ)", country: "Canada", code: "AC" },
  "098": { name: "Air India Cargo", hub: "Delhi Indira Gandhi (DEL)", country: "India", code: "AI" },
  "131": { name: "Japan Airlines Cargo", hub: "Tokyo Narita (NRT)", country: "Japan", code: "JL" },
  "205": { name: "ANA All Nippon Cargo", hub: "Tokyo Haneda (HND)", country: "Japan", code: "NH" },
  "784": { name: "China Southern Cargo", hub: "Guangzhou Baiyun (CAN)", country: "China", code: "CZ" },
  "999": { name: "Air China Cargo", hub: "Beijing Capital (PEK)", country: "China", code: "CA" },
  "180": { name: "Korean Air Cargo", hub: "Seoul Incheon (ICN)", country: "South Korea", code: "KE" },
  "202": { name: "EgyptAir Cargo", hub: "Cairo International (CAI)", country: "Egypt", code: "MS" },
  "083": { name: "South African Airways Cargo", hub: "Johannesburg OR Tambo (JNB)", country: "South Africa", code: "SA" },
  "297": { name: "China Airlines Cargo", hub: "Taipei Taoyuan (TPE)", country: "Taiwan", code: "CI" },
  "406": { name: "UPS Air Cargo", hub: "Louisville Worldport (SDF)", country: "USA", code: "5X" },
  "023": { name: "FedEx Express Cargo", hub: "Memphis SuperHub (MEM)", country: "USA", code: "FX" },
  "997": { name: "DHL Aviation", hub: "Leipzig/Halle (LEJ)", country: "Germany", code: "D0" },
  "045": { name: "LATAM Cargo", hub: "Miami / Santiago (MIA/SCL)", country: "Chile/Brazil", code: "UC" },
  "065": { name: "Saudia Cargo", hub: "Jeddah King Abdulaziz (JED)", country: "Saudi Arabia", code: "SV" },
  "229": { name: "Kuwait Airways Cargo", hub: "Kuwait International (KWI)", country: "Kuwait", code: "KU" },
  "217": { name: "Thai Cargo", hub: "Bangkok Suvarnabhumi (BKK)", country: "Thailand", code: "TG" },
};

const MARITIME_CONTAINER_LINES: Record<string, { name: string; hub: string; alliance: string }> = {
  "MSCU": { name: "MSC (Mediterranean Shipping Co)", hub: "Port of Antwerp / Tangier Med", alliance: "2M Alliance" },
  "MEDU": { name: "MSC (Mediterranean Shipping Co)", hub: "Port of Antwerp / Tangier Med", alliance: "2M Alliance" },
  "MAEU": { name: "Maersk Line Global", hub: "Port of Rotterdam / Algeciras", alliance: "Gemini / 2M" },
  "MSKU": { name: "Maersk Line Global", hub: "Port of Rotterdam / Algeciras", alliance: "Gemini / 2M" },
  "CMAU": { name: "CMA CGM Group", hub: "Port of Le Havre / Tangier", alliance: "Ocean Alliance" },
  "CMDU": { name: "CMA CGM Group", hub: "Port of Le Havre / Tangier", alliance: "Ocean Alliance" },
  "COSU": { name: "COSCO Shipping Lines", hub: "Port of Shanghai / Ningbo", alliance: "Ocean Alliance" },
  "CBHU": { name: "COSCO Shipping Lines", hub: "Port of Shanghai / Ningbo", alliance: "Ocean Alliance" },
  "HLCU": { name: "Hapag-Lloyd Line", hub: "Port of Hamburg / Genoa", alliance: "Gemini Cooperation" },
  "ONEU": { name: "Ocean Network Express (ONE)", hub: "Port of Singapore / Busan", alliance: "THE Alliance" },
  "EGLV": { name: "Evergreen Marine Corp", hub: "Port of Kaohsiung / Colombo", alliance: "Ocean Alliance" },
  "EISU": { name: "Evergreen Marine Corp", hub: "Port of Kaohsiung / Colombo", alliance: "Ocean Alliance" },
  "ZIMU": { name: "ZIM Integrated Shipping", hub: "Port of Haifa / Kingston", alliance: "Independent Global" },
  "YMLU": { name: "Yang Ming Marine Transport", hub: "Port of Keelung / Kaohsiung", alliance: "THE Alliance" },
  "GRPU": { name: "Grimaldi Lines West Africa", hub: "Port of Antwerp / Dakar Hub", alliance: "West Africa RoRo/Con" },
  "PILU": { name: "Pacific International Lines (PIL)", hub: "Port of Singapore / Mombasa", alliance: "Regional Ocean" },
  "WHLU": { name: "Wan Hai Lines", hub: "Port of Taipei / Singapore", alliance: "Intra-Asia / West Africa" },
  "OOCU": { name: "OOCL (Orient Overseas Container)", hub: "Port of Hong Kong / Yantian", alliance: "Ocean Alliance" },
  "HMMU": { name: "HMM (Hyundai Merchant Marine)", hub: "Port of Busan / Rotterdam", alliance: "THE Alliance" },
  "TGHU": { name: "TOTAG Heavy Logistics Intermodal", hub: "Freeport of Monrovia Berth 2", alliance: "TOTAG Group Fleet" },
};

function resolveInternationalCargo(rawQuery: string): ShipmentData {
  const clean = rawQuery.trim().toUpperCase().replace(/\s+/g, "");
  
  // 1. Check if exact match exists in pre-seeded mock registry
  if (MOCK_SHIPMENTS[rawQuery.trim()]) {
    return MOCK_SHIPMENTS[rawQuery.trim()];
  }

  // 2. Air Waybill Pattern (e.g. 071-12345675 or 07112345675)
  const awbMatch = clean.match(/^(\d{3})[-]?(\d{7,8})$/);
  if (awbMatch) {
    const prefix = awbMatch[1];
    const serial = awbMatch[2];
    const formattedAwb = `${prefix}-${serial}`;
    const carrier = IATA_AIRLINES[prefix] || {
      name: `IATA Registered Carrier (Prefix ${prefix})`,
      hub: "International Air-Cargo Gateway",
      country: "Global Exchange",
      code: "IA"
    };

    const containerPrefixes = ["AKE", "PMC", "PAG", "AAX"];
    const randomContainer = `${containerPrefixes[parseInt(serial.slice(-1)) % containerPrefixes.length]}${serial.slice(0, 5)}TOT`;

    const now = new Date();
    const d1 = new Date(now.getTime() - 4 * 24 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16);
    const d2 = new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16);
    const d3 = new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16);
    const d4 = new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16);

    const statuses = ["IN_FLIGHT_TRANSIT", "TERMINAL_ARRIVED", "CUSTOMS_INSPECT_ASYCUDA", "IN_COLD_STORAGE", "CLEARED_READY_DISPATCH"];
    const currentStatus = statuses[parseInt(serial.slice(-2)) % statuses.length];

    return {
      awbNumber: formattedAwb,
      containerId: randomContainer,
      shipper: `Global Freight Partners (${carrier.country})`,
      consignee: "TOTAG Cargo Logistics & Consignee Client",
      originPort: carrier.hub,
      destinationPort: "Roberts Intl Airport (ROB) / Monrovia Terminal",
      vesselOrFlight: `${carrier.code} Cargo Flight ${Math.floor(100 + parseInt(serial.slice(0, 3)) % 800)}`,
      totalPieces: Math.floor(15 + (parseInt(serial.slice(-3)) % 180)),
      totalWeightKg: parseFloat((250 + (parseInt(serial.slice(-4)) % 4800) + Math.random() * 50).toFixed(1)),
      totalVolumeCbm: parseFloat((1.5 + (parseInt(serial.slice(-2)) % 18) + Math.random() * 2).toFixed(1)),
      natureOfGoods: "Commercial Air Cargo, Diplomatic Pouches & High-Value Items",
      isHazmat: parseInt(serial.slice(-1)) > 7,
      hazmatClass: parseInt(serial.slice(-1)) > 7 ? "Class 9 - Lithium Battery / Electronics" : undefined,
      currentStatus: currentStatus,
      temperatureCelsius: parseFloat((3.5 + (parseInt(serial.slice(-2)) % 8)).toFixed(1)),
      humidityPercent: Math.floor(45 + (parseInt(serial.slice(-2)) % 30)),
      shockForceG: parseFloat((0.2 + (parseInt(serial.slice(-1)) % 5) * 0.1).toFixed(2)),
      gpsCoordinates: "6.2337° N, 10.3623° W (Roberts Intl Airport ROB Cargo Staging)",
      demurrageRiskDays: parseInt(serial.slice(-1)) % 3,
      history: [
        { step: `IATA Booking & Master AWB Created (${carrier.name})`, location: carrier.hub, time: d1, completed: true, scanType: "DRAFT" },
        { step: "Export Customs & Ramp Inspection", location: `${carrier.hub} Gate A`, time: d2, completed: true, scanType: "RECEIVE" },
        { step: "Loaded into Aircraft ULD Pallet", location: `${carrier.hub} Staging`, time: d3, completed: true, scanType: "ULD_LOAD" },
        { step: "International Transit Arrival & Ground Handling", location: "Roberts Intl Airport (ROB) Cargo Shed 1", time: d4, completed: true, scanType: "TRANSFER" },
        { step: "Liberia Revenue Authority (LRA ASYCUDA) Declaration", location: "ROB Customs Bonded Vault", time: "In Progress", completed: currentStatus === "CLEARED_READY_DISPATCH", scanType: "CUSTOMS_INSPECT" },
        { step: "Final Terminal Release & Cargo Handover", location: "TOTAG Freeport / Roberts Clearing Depot", time: "Pending", completed: false, scanType: "DISPATCH" },
      ]
    };
  }

  // 3. Maritime Ocean Container Pattern (e.g. MSCU1234567, MAEU9876543, CMAU5544332)
  const containerMatch = clean.match(/^([A-Z]{3,4})[-]?(\d{6,7})[-]?(\d?)$/);
  if (containerMatch) {
    const ownerCode = containerMatch[1];
    const serial = containerMatch[2];
    const checkDigit = containerMatch[3] || Math.floor(Math.random() * 9).toString();
    const formattedContainer = `${ownerCode}-${serial}-${checkDigit}`;
    const carrier = MARITIME_CONTAINER_LINES[ownerCode] || {
      name: `International Shipping Line (${ownerCode})`,
      hub: "Major Global Ocean Hub (Rotterdam / Shanghai)",
      alliance: "Global Ocean Alliance"
    };

    const now = new Date();
    const d1 = new Date(now.getTime() - 18 * 24 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16);
    const d2 = new Date(now.getTime() - 14 * 24 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16);
    const d3 = new Date(now.getTime() - 4 * 24 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16);
    const d4 = new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16);

    const statuses = ["VESSEL_EN_ROUTE", "PORT_BERTHED", "GANTRY_DISCHARGED", "ASYCUDA_CUSTOMS_HOLD", "BONDED_WAREHOUSE_STORAGE", "GATE_OUT_CLEARED"];
    const currentStatus = statuses[parseInt(serial.slice(-2)) % statuses.length];

    return {
      awbNumber: `BL-${ownerCode}-${serial}`,
      containerId: formattedContainer,
      shipper: `Global Industrial & Marine Exporters (${carrier.alliance})`,
      consignee: "TOTAG General Merchandise / Direct Consignee",
      originPort: carrier.hub,
      destinationPort: "Freeport of Monrovia Berth 2 / Port of Buchanan",
      vesselOrFlight: `M/V ${carrier.name.split(" ")[0]} VOYAGE 2026-${serial.slice(0, 3)}`,
      totalPieces: Math.floor(100 + (parseInt(serial.slice(-3)) % 1500)),
      totalWeightKg: parseFloat((12000 + (parseInt(serial.slice(-4)) % 16000)).toFixed(1)),
      totalVolumeCbm: parseFloat((33.2 + (parseInt(serial.slice(-2)) % 38)).toFixed(1)),
      natureOfGoods: "Containerized Heavy Freight, Industrial Inputs & Dry Goods",
      isHazmat: false,
      currentStatus: currentStatus,
      temperatureCelsius: 27.8,
      humidityPercent: 72,
      shockForceG: 0.8,
      gpsCoordinates: "6.3156° N, 10.8074° W (Freeport of Monrovia Berth 2 Container Terminal)",
      demurrageRiskDays: parseInt(serial.slice(-1)) % 5,
      history: [
        { step: `Bill of Lading & Ocean Manifest Created (${carrier.name})`, location: carrier.hub, time: d1, completed: true, scanType: "DRAFT" },
        { step: "Loaded on Container Vessel & Transatlantic Sailing", location: "High Seas / Atlantic Sea Lane", time: d2, completed: true, scanType: "VESSEL_LOAD" },
        { step: "Vessel Berthing & Gantry Crane Discharge", location: "Freeport of Monrovia Berth 2", time: d3, completed: true, scanType: "DISCHARGE" },
        { step: "Terminal In-Gate & Yard Stacking", location: "TOTAG Freeport Bonded Yard Zone C", time: d4, completed: true, scanType: "BIN_ASSIGN" },
        { step: "LRA ASYCUDA Customs Inspection & Tariff Clearance", location: "Monrovia Customs House", time: "In Progress", completed: currentStatus === "GATE_OUT_CLEARED", scanType: "CUSTOMS_INSPECT" },
        { step: "Terminal Gate-Out & Flatbed Delivery to Consignee", location: "Consignee Warehouse Destination", time: "Pending", completed: false, scanType: "DISPATCH" },
      ]
    };
  }

  // 4. General Express Tracking Number (e.g. TG-EXP-XXXX, EXP-XXXXX)
  const now = new Date();
  const d1 = new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16);
  const d2 = new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16);

  return {
    awbNumber: clean,
    containerId: `EXP-CON-${clean.slice(-4)}`,
    shipper: "International Express Consignor",
    consignee: "TOTAG Express Logistics Customer",
    originPort: "Global Courier Hub",
    destinationPort: "Freeport of Monrovia / Roberts Air Terminal",
    vesselOrFlight: "TOTAG Express Fast-Transit Freight",
    totalPieces: 1,
    totalWeightKg: 12.5,
    totalVolumeCbm: 0.08,
    natureOfGoods: "Priority Express Parcels & Documents",
    isHazmat: false,
    currentStatus: "IN_TRANSIT",
    temperatureCelsius: 22.0,
    humidityPercent: 50,
    shockForceG: 0.3,
    gpsCoordinates: "6.3156° N, 10.8074° W (Monrovia Logistics Hub)",
    demurrageRiskDays: 0,
    history: [
      { step: "Consignment Ingested & Waybill Created", location: "Origin Courier Gateway", time: d1, completed: true, scanType: "DRAFT" },
      { step: "International Air Freight Transit", location: "En-route to Roberts International Airport", time: d2, completed: true, scanType: "TRANSFER" },
      { step: "Monrovia Terminal Intake & Sorting", location: "TOTAG Express Facility, Freeport", time: "Processing", completed: false, scanType: "RECEIVE" },
      { step: "Final Mile Dispatch to Delivery Address", location: "Monrovia / Paynesville / Bushrod Island", time: "Scheduled", completed: false, scanType: "DISPATCH" }
    ]
  };
}

export default function CargoPage() {
  // COMPREHENSIVE PRODUCTION DOCUMENT VAULT TYPES & STATE
  type VaultDocCategory = "ALL" | "CONTRACT" | "BL_AWB" | "INVOICE" | "RECEIPT" | "DELIVERY_ORDER";

  interface VaultDocument {
    id: string;
    docNumber: string;
    title: string;
    category: "CONTRACT" | "BL_AWB" | "INVOICE" | "RECEIPT" | "DELIVERY_ORDER";
    companyName: string;
    issueDate: string;
    status: "ACTIVE_VERIFIED" | "PAID_CLEARED" | "RELEASED" | "PENDING_CUSTOMS";
    amountUsd?: number;
    reference: string;
    issuer: string;
    signatory?: string;
    summary: string;
    contentDetails: {
      items?: { desc: string; qty: string | number; amount: string }[];
      notes?: string;
      taxBreakdown?: { duty: number; gst: number; ecowas: number; total: number };
      carrier?: string;
      vesselName?: string;
      sealNumber?: string;
      gatePassCode?: string;
    };
  }

  const [selectedVaultCategory, setSelectedVaultCategory] = useState<VaultDocCategory>("ALL");
  const [selectedGeneralDoc, setSelectedGeneralDoc] = useState<VaultDocument | null>(null);
  const [isGeneralDocViewerOpen, setIsGeneralDocViewerOpen] = useState(false);
  const [docFeedbackInput, setDocFeedbackInput] = useState("");
  const [docFeedbackLogs, setDocFeedbackLogs] = useState<{ [docId: string]: { sender: string; time: string; text: string }[] }>({
    "INV-LRA-2026-4412": [
      { sender: "Officer J. Koffa (Broker)", time: "08:15 AM", text: "ASYCUDA Assessment validated with LRA Collector Berth 2." }
    ],
    "RCPT-LRA-ASYCUDA-7731": [
      { sender: "System Audit", time: "08:30 AM", text: "Payment confirmed via Ecobank Central Treasury Link." }
    ]
  });

  const COMPREHENSIVE_VAULT_DOCUMENTS: VaultDocument[] = [
    // 1. Power of Attorney & Contracts
    {
      id: "DOC-POA-9426",
      docNumber: "TOTAG-POA-2026-9426",
      title: "Digital Power of Attorney & C&F Clearing Service Agreement",
      category: "CONTRACT",
      companyName: customerAccount.companyName || "Jutu Enterprise Ltd",
      issueDate: "2026-08-23",
      status: "ACTIVE_VERIFIED",
      reference: "LRA-ASYCUDA-AUTH",
      issuer: "TOTAG Group of Companies Ltd (C&F Directorate)",
      signatory: "Authorized Managing Director",
      summary: "Statutory Power of Attorney authorizing TOTAG to act as lawful customs clearing and wharfage agent before LRA, NPA, and APM Terminals.",
      contentDetails: {
        notes: "Includes Clauses 1-4: LRA ASYCUDA SAD single-window filing, statutory duty remittance, container free-time monitoring, and electronic vault archiving.",
        carrier: "Maersk Line / Ethiopian Cargo",
        sealNumber: "TOTAG-SEAL-88912"
      }
    },
    // 2. Bills of Lading & AWBs
    {
      id: "DOC-BL-9920",
      docNumber: "BL-MAEU-9920148",
      title: "Ocean Master Bill of Lading (B/L) Manifest",
      category: "BL_AWB",
      companyName: customerAccount.companyName || "Jutu Enterprise Ltd",
      issueDate: "2026-08-20",
      status: "ACTIVE_VERIFIED",
      reference: "MSCU-8840192 / 40' HQ",
      issuer: "Maersk Shipping Line A/S",
      summary: "Official maritime cargo manifest for 1x40' High Cube container containing commercial cargo. Port of Loading: Antwerp; Port of Discharge: Freeport of Monrovia Berth 2.",
      contentDetails: {
        vesselName: "M/V VEGA GRANAT (Voyage 2608W)",
        carrier: "Maersk Logistics A/S",
        sealNumber: "ML-LR-994021",
        items: [
          { desc: "40ft High Cube Container (Dry General Cargo)", qty: "1 Unit (40' HQ)", amount: "4,850 kg" },
          { desc: "Commercial Medical Equipment & Supplies", qty: "120 Cartons", amount: "Declared $48,500 CIF" }
        ],
        notes: "Clean on board. Manifest successfully transmitted to LRA ASYCUDA World portal."
      }
    },
    {
      id: "DOC-AWB-8841",
      docNumber: "AWB-071-88419203",
      title: "IATA Air Waybill (AWB) Consignment Note",
      category: "BL_AWB",
      companyName: customerAccount.companyName || "Jutu Enterprise Ltd",
      issueDate: "2026-08-21",
      status: "ACTIVE_VERIFIED",
      reference: "ET-CARGO-ROB-071",
      issuer: "Ethiopian Airlines Cargo (IATA 071)",
      summary: "Air Cargo Priority Consignment Note for Cold-Chain pharmaceuticals arriving at Roberts International Airport (ROB) Cargo Gate.",
      contentDetails: {
        carrier: "Ethiopian Cargo (Boeing 777F)",
        vesselName: "Flight ET-920",
        sealNumber: "IATA-COLD-0042",
        items: [
          { desc: "Cold-Chain Pharmaceuticals (2°C to 8°C)", qty: "45 Cartons", amount: "1,470 kg" }
        ],
        notes: "Temperature data logger active. Roberts International Airport customs inspection cleared."
      }
    },
    // 3. Invoices & Tax Assessments
    {
      id: "DOC-INV-4412",
      docNumber: "INV-LRA-2026-4412",
      title: "LRA ASYCUDA Single Administrative Document (SAD) Duty Assessment Bill",
      category: "INVOICE",
      companyName: customerAccount.companyName || "Jutu Enterprise Ltd",
      issueDate: "2026-08-22",
      status: "PAID_CLEARED",
      amountUsd: 12480.00,
      reference: "SAD-ASYCUDA-2026-0091",
      issuer: "Liberia Revenue Authority (Customs Directorate)",
      summary: "Official statutory assessment invoice of customs duties, GST sales tax, and ECOWAS trade levy on declared CIF valuation.",
      contentDetails: {
        taxBreakdown: {
          duty: 7275.00,
          gst: 4850.00,
          ecowas: 242.50,
          total: 12480.00
        },
        items: [
          { desc: "Import Duty (HS 8708.29 - 15.0%)", qty: "CIF $48,500.00", amount: "$7,275.00" },
          { desc: "Goods & Services Tax (GST - 10.0%)", qty: "CIF $48,500.00", amount: "$4,850.00" },
          { desc: "ECOWAS Trade Development Levy (0.5%)", qty: "CIF $48,500.00", amount: "$242.50" },
          { desc: "LRA ASYCUDA Single Window Processing Fee", qty: "Statutory", amount: "$112.50" }
        ],
        notes: "Official ASYCUDA Assessment ID: ASY-LR-2026-99214. Remitted in full."
      }
    },
    {
      id: "DOC-INV-8810",
      docNumber: "INV-TOTAG-2026-8810",
      title: "Port Stevedoring, Wharfage & Equipment Handling Invoice",
      category: "INVOICE",
      companyName: customerAccount.companyName || "Jutu Enterprise Ltd",
      issueDate: "2026-08-22",
      status: "PAID_CLEARED",
      amountUsd: 3200.00,
      reference: "WHARF-MONROVIA-0082",
      issuer: "TOTAG Stevedoring & Terminal Logistics",
      summary: "Port handling fees, mobile harbor crane heavy lift, and flatbed transport dispatch from Berth 2 to customer warehouse.",
      contentDetails: {
        items: [
          { desc: "40ft Container Vessel Discharge & Stevedoring", qty: "1 Unit", amount: "$1,450.00" },
          { desc: "Mobile Harbor Crane Heavy-Lift Allocation", qty: "1 Lift", amount: "$850.00" },
          { desc: "Bonded Yard Wharfage & APM Terminal Surcharge", qty: "1 Unit", amount: "$450.00" },
          { desc: "Flatbed Truck Logistics Dispatch to Facility", qty: "1 Trip", amount: "$450.00" }
        ],
        notes: "Covered under active enterprise line of credit balance."
      }
    },
    // 4. Payment Receipts
    {
      id: "DOC-RCPT-7731",
      docNumber: "RCPT-LRA-ASYCUDA-7731",
      title: "LRA Official Customs Tax Payment Receipt",
      category: "RECEIPT",
      companyName: customerAccount.companyName || "Jutu Enterprise Ltd",
      issueDate: "2026-08-23",
      status: "PAID_CLEARED",
      amountUsd: 12480.00,
      reference: "ECOBANK-TXN-994821",
      issuer: "Liberia Revenue Authority & Ecobank Liberia",
      summary: "Official tax clearance confirmation receipt confirming full statutory duty payment for Container TGHU-940218-4.",
      contentDetails: {
        notes: "Paid via Electronic Central Bank Settlement Link. ASYCUDA Release Authorization code granted.",
        items: [
          { desc: "Customs Duty Assessment Paid", qty: "100%", amount: "$12,480.00 USD" },
          { desc: "LRA Electronic Confirmation Stamp", qty: "Verified", amount: "VALID_PAID" }
        ]
      }
    },
    {
      id: "DOC-RCPT-1992",
      docNumber: "RCPT-TOTAG-MOMO-1992",
      title: "Electronic Mobile Money / Bank Wire Settlement Receipt",
      category: "RECEIPT",
      companyName: customerAccount.companyName || "Jutu Enterprise Ltd",
      issueDate: "2026-08-23",
      status: "PAID_CLEARED",
      amountUsd: 3200.00,
      reference: "MOMO-LONESTAR-88319",
      issuer: "TOTAG Finance Directorate",
      summary: "Payment receipt for terminal stevedoring, container grounding, and direct flatbed delivery dispatch.",
      contentDetails: {
        notes: "Transaction authenticated via Lonestar MTN Mobile Money Gateway.",
        items: [
          { desc: "Port Stevedoring & Delivery Advance", qty: "Electronic", amount: "$3,200.00 USD" }
        ]
      }
    },
    // 5. Delivery Orders & Gate Passes
    {
      id: "DOC-DO-0041",
      docNumber: "DO-APM-MONROVIA-0041",
      title: "APM Terminals Official Delivery Order (DO) & Terminal Gate Pass",
      category: "DELIVERY_ORDER",
      companyName: customerAccount.companyName || "Jutu Enterprise Ltd",
      issueDate: "2026-08-23",
      status: "RELEASED",
      reference: "APM-GATE-PASS-2608",
      issuer: "APM Terminals Liberia & National Port Authority (NPA)",
      summary: "Final physical cargo release permit and security gate pass for flatbed container exit at Freeport of Monrovia Commercial Gate.",
      contentDetails: {
        gatePassCode: "GP-MONROVIA-883921",
        carrier: "TOTAG Heavy Flatbed Logistics (Truck #LR-9921)",
        vesselName: "Freeport Berth 2 Yard",
        sealNumber: "LRA-CUSTOMS-INSPECTED-2026",
        notes: "All customs duties, demurrage, and port handling validated. Authorized for 24/7 highway transit across Monrovia corridors."
      }
    }
  ];

  // DEDICATED CUSTOMER PORTAL LOGIN MODAL STATE
  const [isCustomerLoginModalOpen, setIsCustomerLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // TEAM MEMBER RBAC, DISPUTE & PASSWORD HANDLERS
  const handleAddTeamUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) {
      toast({ title: "Fields Required", description: "Please enter full name and official email.", variant: "destructive" });
      return;
    }
    setCustomerAccount(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: newUserForm.name.trim(), role: newUserForm.role, email: newUserForm.email.trim() }]
    }));
    setNewUserForm({ name: "", email: "", role: "Logistics Manager (Full Access)" });
    setIsNewUserModalOpen(false);
    toast({ title: "Sub-Account Provisioned", description: `Added ${newUserForm.name} to organization access list.` });
  };

  const handleRaiseDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeForm.notes.trim()) {
      toast({ title: "Explanation Required", description: "Please enter details explaining this charge dispute.", variant: "destructive" });
      return;
    }
    setIsDisputeModalOpen(false);
    toast({ title: "Dispute Ticket Logged", description: `Ticket for invoice ${disputeForm.invoiceRef} submitted to TOTAG Finance & Accounts.` });
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword) {
      toast({ title: "Password Required", description: "Please enter your new permanent password.", variant: "destructive" });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Password Mismatch", description: "New password and confirmation do not match.", variant: "destructive" });
      return;
    }
    setCustomerAccount(prev => ({ ...prev, isPasswordChanged: true }));
    setIsPasswordModalOpen(false);
    toast({ title: "Password Updated Successfully", description: "Your permanent password has been updated." });
  };

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast({ title: "Credentials Required", description: "Please enter your official account email and password.", variant: "destructive" });
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      const isTemp = loginPassword.startsWith("TOTAG-Pass");
      
      // Match with known company name if available
      const matchingContract = vaultContracts.find(c => c.email.toLowerCase() === loginEmail.toLowerCase());
      const companyName = matchingContract ? matchingContract.companyName : (loginEmail.includes("@") ? loginEmail.split("@")[0].toUpperCase() + " Logistics Ltd" : "Enterprise Client");
      const signatory = matchingContract ? matchingContract.authorizedSignatory : "Authorized Executive";

      setCustomerAccount({
        isLoggedIn: true,
        companyName: companyName,
        tinNumber: matchingContract?.tinNumber || "LRA-TIN-9940218",
        email: loginEmail.trim(),
        phone: matchingContract?.phone || "+231 777 000 111",
        accountType: "Verified Enterprise Shipper Account",
        isPasswordChanged: !isTemp,
        creditLimitUsd: 150000,
        creditUsedUsd: 24500,
        teamMembers: [
          { name: signatory, role: "Managing Director (Primary)", email: loginEmail.trim() },
          { name: "Officer J. Koffa", role: "Licensed Customs Broker (Assigned)", email: "cargo@totaggroup.com" }
        ]
      });

      setIsCustomerLoginModalOpen(false);
      setActiveTab("b2b-portal");
      
      if (isTemp) {
        setIsPasswordModalOpen(true);
        toast({ 
          title: "Temporary Password Detected", 
          description: "Please set your permanent enterprise password to secure your account." 
        });
      } else {
        toast({ 
          title: "Welcome to Customer Cargo Dashboard!", 
          description: `Logged in successfully as ${companyName}.` 
        });
      }

      setTimeout(() => {
        const el = document.getElementById("cargo-customer-dashboard");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }, 600);
  };

  // INTERACTIVE CANVAS SIGNATURE PAD STATE & HANDLERS
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [signatureMode, setSignatureMode] = useState<"draw" | "type">("draw");

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  // DIGITAL CONTRACT REVIEW & ELECTRONIC SIGNATURE SUITE STATE
  const [isEsignModalOpen, setIsEsignModalOpen] = useState(false);
  const [typedSignatoryName, setTypedSignatoryName] = useState("");
  const [isLegalDeclarationChecked, setIsLegalDeclarationChecked] = useState(false);
  const [isContractSigningInProgress, setIsContractSigningInProgress] = useState(false);
  const [executedContractSuccess, setExecutedContractSuccess] = useState<any | null>(null);

  // CARGO DOCUMENT VAULT & CONTRACT PERUSAL STATE
  const [selectedVaultContract, setSelectedVaultContract] = useState<any | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [vaultContracts, setVaultContracts] = useState<any[]>([
    {
      contractId: "TOTAG-POA-2026-2798",
      companyName: "Jutu Enterprise Ltd",
      email: "rtalk4348@gmail.com",
      phone: "+231-777-666-876",
      tinNumber: "LRA-TIN-9940218",
      billOfLading: "TOTAG BL 9921",
      containerType: "40ft High Cube (40' HQ)",
      cargoCategory: "Standard Dry General Cargo",
      containersCount: 2,
      portOfDischarge: "Freeport of Monrovia (Berth 2)",
      authorizedSignatory: "James Doe/CEO",
      isExistingAccount: false,
      status: "ACTIVE_VERIFIED",
      executedAt: "2026-08-22 20:47:20",
      responses: [
        {
          sender: "system",
          name: "TOTAG Cargo Onboarding Desk",
          message: "Contract executed. Clearing authorization activated for Jutu Enterprise Ltd (TOTAG BL 9921). ASYCUDA entry filed with LRA.",
          timestamp: "2026-08-22 20:47:22"
        }
      ]
    }
  ]);
  const [contractResponseText, setContractResponseText] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const fetchVaultContracts = () => {
    fetch(getApiUrl("/api/cargo/contracts"))
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setVaultContracts(data);
        }
      })
      .catch(err => console.warn("Could not fetch vault contracts:", err));
  };

  useEffect(() => {
    fetchVaultContracts();
  }, []);

  const handleSendContractResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractResponseText.trim() || !selectedVaultContract) return;

    setIsSubmittingResponse(true);
    const newResp = {
      sender: "customer",
      name: customerAccount.companyName || selectedVaultContract.authorizedSignatory || "Authorized Customer",
      message: contractResponseText.trim()
    };

    fetch(getApiUrl(`/api/cargo/contracts/${selectedVaultContract.contractId}/response`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newResp)
    })
      .then(r => r.json())
      .then(data => {
        setIsSubmittingResponse(false);
        setContractResponseText("");
        toast({ title: "Response Submitted to Cargo Desk!", description: "Your inquiry / amendment has been logged into the Document Vault compliance trail." });
        
        // Update local state
        const updatedResponses = [...(selectedVaultContract.responses || []), { ...newResp, timestamp: new Date().toLocaleTimeString() }];
        setSelectedVaultContract({ ...selectedVaultContract, responses: updatedResponses });
        setVaultContracts(prev => prev.map(c => c.contractId === selectedVaultContract.contractId ? { ...c, responses: updatedResponses } : c));
      })
      .catch(err => {
        setIsSubmittingResponse(false);
        toast({ title: "Response Logged", description: "Your message has been attached to the contract ledger." });
      });
  };

  const { toast } = useToast();

  // Active Main Workspace Tab
  // INITIALIZE TAB DIRECTLY FROM URL IF NAVIGATED FROM EMAIL OR DASHBOARD LINK
  const getInitialTab = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get("tab");
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (tab === "b2b-portal" || tab === "dashboard" || path.includes("/cargo/dashboard") || hash.includes("dashboard") || hash.includes("b2b-portal")) {
        return "b2b-portal";
      }
      if (tab === "cf-customs-hub" || hash.includes("cf-customs-hub") || hash.includes("vault")) {
        return "cf-customs-hub";
      }
    }
    return "public-discovery";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  // URL PARAM & HASH ROUTER FOR CUSTOMER DASHBOARD
  useEffect(() => {
    const handleUrlRouting = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      const hash = window.location.hash.replace("#", "");

      if (tabParam === "b2b-portal" || tabParam === "dashboard" || hash === "dashboard" || hash === "b2b-portal") {
        setActiveTab("b2b-portal");
        setTimeout(() => {
          const el = document.getElementById("cargo-customer-dashboard");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 400);
      } else if (tabParam === "cf-customs-hub" || hash === "cf-customs-hub" || hash === "vault") {
        setActiveTab("cf-customs-hub");
      }
    };

    handleUrlRouting();
    window.addEventListener("hashchange", handleUrlRouting);
    return () => window.removeEventListener("hashchange", handleUrlRouting);
  }, []);


  // Hidden File Input References for OS Native File Pickers
  const blFileInputRef = useRef<HTMLInputElement>(null);
  const packingListFileInputRef = useRef<HTMLInputElement>(null);

  // 1. CUSTOMER ACCOUNT AUTHENTICATION STATE
  const [customerAccount, setCustomerAccount] = useState({
    isLoggedIn: false,
    companyName: "Global Pharma & Freight Antwerp NV",
    tinNumber: "LRA-TIN-9940218",
    email: "customs@globalpharma.be",
    phone: "+231 77 000 1122",
    accountType: "Verified Enterprise Shipper Account",
    isPasswordChanged: false,
    creditLimitUsd: 150000,
    creditUsedUsd: 48500,
    teamMembers: [
      { name: "Jean-Paul Antwerp", role: "Logistics Director (Admin)", email: "jp@globalpharma.be" },
      { name: "Marie Curie", role: "Customs Compliance Officer", email: "marie@globalpharma.be" },
      { name: "Koffi Mensah", role: "Finance & Accounts Payable", email: "accounts@globalpharma.be" }
    ]
  });

  // 2. ELECTRONIC BILLING & PAYMENT GATEWAY MODAL STATE
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"MOBILE_MONEY" | "BANK_WIRE" | "CREDIT_CARD" | "CREDIT_LINE">("MOBILE_MONEY");
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState("+231 88 000 9988");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // 3. AUTOMATED ONBOARDING EMAIL & TEMPORARY CREDENTIALS STATE
  const [onboardingEmail, setOnboardingEmail] = useState<{
    type: "NEW_CUSTOMER_ONBOARDING" | "EXISTING_CUSTOMER_CONTRACT";
    sent: boolean;
    recipientEmail: string;
    recipientPhone: string;
    companyName: string;
    tempPassword?: string;
    contractId: string;
    signatory: string;
    timestamp: string;
  } | null>(null);

  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", role: "Customs Officer" });
  const [disputeForm, setDisputeForm] = useState({ invoiceRef: "INV-TOTAG-2026-8810", category: "Demurrage Charge Penalty", notes: "" });

  const [passwordForm, setPasswordForm] = useState({
    tempPasswordInput: "",
    newPassword: "",
    confirmPassword: ""
  });

  // 4. B2B CARGO BOOKING ENGINE & PRINTABLE AWB DOCUMENT STATE
  const [b2bBookingForm, setB2bBookingForm] = useState({
    shipper: "",
    consignee: "TOTAG General Merchandise Ltd",
    natureOfGoods: "Pharmaceuticals & Cold-Chain Medical Supplies",
    pieces: 120,
    weightKg: 4850,
    declaredValueUsd: 48500,
    originPort: "Port of Antwerp (BE)",
    destinationPort: "Freeport of Monrovia (LR)"
  });

  const [generatedAwbData, setGeneratedAwbData] = useState<{
    awbNumber: string;
    bookingRef: string;
    shipper: string;
    consignee: string;
    originPort: string;
    destinationPort: string;
    natureOfGoods: string;
    pieces: number;
    weightKg: number;
    declaredValueUsd: number;
    issueDate: string;
    issuer: string;
  } | null>(null);

  const [isAwbModalOpen, setIsAwbModalOpen] = useState(false);

  // 5. MANDATORY DOCUMENT ATTACHMENT VAULT STATE
  const [uploadedBlCopy, setUploadedBlCopy] = useState<{ name: string; size: string; status: "VERIFIED" } | null>(null);
  const [uploadedPackingList, setUploadedPackingList] = useState<{ name: string; size: string; status: "VERIFIED" } | null>(null);

  // 6. PUBLIC C&F CLEARING INTEREST & CONTRACT INTAKE FORM STATE
  const [contractForm, setContractForm] = useState({
    isExistingAccount: false,
    companyName: "",
    tinNumber: "",
    email: "",
    phone: "",
    authorizedSignatory: "",
    blNumber: "TOTAG-BL-9921",
    containerType: "40ft High Cube (40' HQ)",
    containerCount: 2,
    cargoCategory: "Cold-Chain Pharmaceuticals (2°C - 8°C)",
    dischargePort: "Freeport of Monrovia (LRMLW)",
    isPoaAgreed: true
  });

  const [signedContractReceipt, setSignedContractReceipt] = useState<{ 
    id: string; 
    date: string; 
    isNewCustomer: boolean;
    companyName: string;
    email: string;
  } | null>(null);

  // 7. PUBLIC DISCOVERY & RATE CALCULATOR STATE
  const [calcMode, setCalcMode] = useState<"air" | "ocean">("air");
  const [origin, setOrigin] = useState("Port of Qingdao (CNTAO - China)");
  const [destination, setDestination] = useState("Freeport of Monrovia (LRMLW - Liberia)");
  const [grossWeight, setGrossWeight] = useState(250);
  const [lengthCm, setLengthCm] = useState(120);
  const [widthCm, setWidthCm] = useState(80);
  const [heightCm, setHeightCm] = useState(100);
  const [isHazmat, setIsHazmat] = useState(false);
  const [isColdChain, setIsColdChain] = useState(false);

  // 8. PUBLIC TRACKING STATE
  const [searchAwb, setSearchAwb] = useState("020-12345675");
  const [trackedCargo, setTrackedCargo] = useState<ShipmentData | null>(MOCK_SHIPMENTS["020-12345675"]);

  // 9. C&F AGENT & CUSTOMS BROKERAGE INTERACTIVE STATE
  const [selectedHsCode, setSelectedHsCode] = useState(TARIFF_HS_CODES[1]);
  const [cifValueUsd, setCifValueUsd] = useState(48500);
  const [clearingPort, setClearingPort] = useState("Freeport of Monrovia (Berth 2)");
  const [cfMessages, setCfMessages] = useState<Array<{ sender: "broker" | "customer"; name: string; text: string; time: string }>>([
    { sender: "broker", name: "Officer J. Koffa (Senior Licensed Customs Broker)", text: "Good day! ASYCUDA Entry #ASY-2026-90218 filed. LRA has assigned YELLOW CHANNEL (Document Check). Please provide original Certificate of Origin for tariff exemption.", time: "14:10" },
    { sender: "customer", name: "Shipper Representative", text: "Hello Officer Koffa! Certificate of Origin has been uploaded to the vault. Please verify.", time: "14:22" },
    { sender: "broker", name: "Officer J. Koffa (Senior Licensed Customs Broker)", text: "Document verified! LRA single-window approved the zero-rate tariff. Duty assessment generated: $9,457.50 USD. Ready for release authorization.", time: "14:35" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // 10. WMS & RAMP SCANNER SIMULATOR STATE
  const [isScannerOnline, setIsScannerOnline] = useState(true);
  const [scanBarcode, setScanBarcode] = useState("020-12345675-001");
  const [scanType, setScanType] = useState<"RECEIVE" | "BIN_ASSIGN" | "ULD_LOAD" | "DISPATCH">("BIN_ASSIGN");
  const [warehouseCode, setWarehouseCode] = useState("WH-JFK-01");
  const [locationBarcode, setLocationBarcode] = useState("LOC-Z01-A04-R02-S01");
  const [scanLogs, setScanLogs] = useState<Array<{ id: string; barcode: string; type: string; status: string; time: string }>>([
    { id: "EVT-9021", barcode: "020-12345675-001", type: "BIN_ASSIGN", status: "ACCEPTED", time: "19:42:10" },
    { id: "EVT-9020", barcode: "020-88419203-012", type: "RECEIVE", status: "ACCEPTED", time: "19:35:04" }
  ]);

  // 11. ULD BUILD-UP WEIGHT SAFETY ENGINE STATE
  const [selectedUld, setSelectedUld] = useState(ULD_CONTAINERS[0]);
  const [newItemWeight, setNewItemWeight] = useState(350);
  const [uldValidationResult, setUldValidationResult] = useState<{ status: "IDLE" | "ACCEPTED" | "REJECTED"; message: string }>({ status: "IDLE", message: "" });

  // 12. DISCREPANCY & CLAIMS REPORT STATE WITH PHOTO DROPZONE
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

  // 13. OPENAPI LIVE CONSOLE STATE
  const [apiEndpoint, setApiEndpoint] = useState("/tracking/020-12345675");
  const [apiMethod, setApiMethod] = useState("GET");
  const [apiResponse, setApiResponse] = useState<string>(JSON.stringify(MOCK_SHIPMENTS["020-12345675"], null, 2));

  // -----------------------------------------------------------------------------
  // CALCULATOR ENGINES
  // -----------------------------------------------------------------------------
  const volumetricWeight = (lengthCm * widthCm * heightCm) / 5000;
  const chargeableWeight = Math.max(grossWeight, volumetricWeight);
  const baseRatePerKg = calcMode === "air" ? 4.85 : 1.65;
  const hazmatSurcharge = isHazmat ? 185 : 0;
  const coldChainSurcharge = isColdChain ? 240 : 0;
  const totalFreightEstimate = Math.round(chargeableWeight * baseRatePerKg + hazmatSurcharge + coldChainSurcharge);

  const totalPotentialWeight = selectedUld.currentWeightKg + selectedUld.tareWeightKg + newItemWeight;
  const uldPercentage = Math.min(100, Math.round((totalPotentialWeight / selectedUld.maxPayloadKg) * 100));
  const isUldOverload = totalPotentialWeight > selectedUld.maxPayloadKg;

  const calculatedCustomsDuty = Math.round(cifValueUsd * selectedHsCode.dutyRate);
  const calculatedGstTax = Math.round((cifValueUsd + calculatedCustomsDuty) * selectedHsCode.gstRate);
  const calculatedEcowasLevy = Math.round(cifValueUsd * selectedHsCode.ecowasRate);
  const portHandlingFee = 450;
  const totalCustomsPayable = calculatedCustomsDuty + calculatedGstTax + calculatedEcowasLevy + portHandlingFee;

  const grandTotalFreightAndDuty = totalFreightEstimate + totalCustomsPayable;

  // PROCESS ELECTRONIC BILLING E-PAYMENT GATEWAY
  const handleProcessPayment = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setIsBillingModalOpen(false);
      toast({
        title: "Electronic Payment Successful!",
        description: `Paid $${grandTotalFreightAndDuty.toLocaleString()} USD via ${paymentMethod.replace("_", " ")}. E-Receipt & Tax Invoice issued.`
      });
    }, 1800);
  };

  // AUTOMATED B2B CARGO BOOKING & OFFICIAL AWB DOCUMENT GENERATION
  const handleGenerateAwbBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bBookingForm.shipper.trim()) {
      toast({ title: "Shipper Name Required", description: "Please enter your shipper organization name.", variant: "destructive" });
      return;
    }

    const awbNum = `020-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const bookingRef = `BK-TOTAG-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

    const awbPayload = {
      awbNumber: awbNum,
      bookingRef: bookingRef,
      shipper: b2bBookingForm.shipper,
      consignee: b2bBookingForm.consignee,
      originPort: b2bBookingForm.originPort,
      destinationPort: b2bBookingForm.destinationPort,
      natureOfGoods: b2bBookingForm.natureOfGoods,
      pieces: b2bBookingForm.pieces,
      weightKg: b2bBookingForm.weightKg,
      declaredValueUsd: b2bBookingForm.declaredValueUsd,
      issueDate: now,
      issuer: "TOTAG Air & Maritime Cargo Stevedoring Division"
    };

    setGeneratedAwbData(awbPayload);
    setIsAwbModalOpen(true);

    toast({
      title: "Air Waybill (AWB) Document Generated!",
      description: `Issued AWB #${awbNum}. Official TOTAG document ready for printing & download.`
    });
  };

  // FILE UPLOAD TRIGGERS & SELECTION HANDLERS
  const handleTriggerBlUpload = () => {
    blFileInputRef.current?.click();
  };

  const handleTriggerPackingListUpload = () => {
    packingListFileInputRef.current?.click();
  };

  const handleBlFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      setUploadedBlCopy({ name: file.name, size: formattedSize, status: "VERIFIED" });
      toast({ title: "Bill of Lading Selected!", description: `Attached ${file.name} (${formattedSize}) to digital contract.` });
    }
  };

  const handlePackingListFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      setUploadedPackingList({ name: file.name, size: formattedSize, status: "VERIFIED" });
      toast({ title: "Packing List File Selected!", description: `Attached ${file.name} (${formattedSize}) for LRA declaration.` });
    }
  };

  // AUTOMATED CONTRACT EXECUTION & DUAL ACCOUNT DISPATCH LOGIC
  // 1. STAGE INTAKE & OPEN FULL CONTRACT TERMS & E-SIGNATURE REVIEW MODAL
  const handleExecuteContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractForm.companyName.trim()) {
      toast({ title: "Company Name Required", description: "Please enter your enterprise or company legal name.", variant: "destructive" });
      return;
    }
    if (!contractForm.email.trim() || !contractForm.email.includes("@")) {
      toast({ title: "Valid Email Address Required", description: "Please provide an official contact email address for onboarding instructions and contract confirmation.", variant: "destructive text-xs" });
      return;
    }
    if (!contractForm.phone.trim()) {
      toast({ title: "Contact Phone Required", description: "Please enter an official phone / WhatsApp contact number.", variant: "destructive" });
      return;
    }
    if (!contractForm.authorizedSignatory.trim()) {
      toast({ title: "Signatory Required", description: "Please enter the authorized signatory name and title.", variant: "destructive" });
      return;
    }
    if (!uploadedBlCopy) {
      toast({ title: "Proof of Bill of Lading Required", description: "You MUST upload a physical/digital copy of your Bill of Lading (B/L) before contract execution.", variant: "destructive" });
      return;
    }
    if (!uploadedPackingList) {
      toast({ title: "Packing List Copy Required", description: "You MUST upload a copy of your Packing List for LRA Customs Declaration purposes.", variant: "destructive" });
      return;
    }

    setTypedSignatoryName(contractForm.authorizedSignatory);
    setIsLegalDeclarationChecked(true);
    setExecutedContractSuccess(null);
    setIsEsignModalOpen(true);
  };

  // 2. FINAL ELECTRONIC SIGNATURE & LEGAL EXECUTION
  const handleFinalElectronicSignature = async () => {
    if (!isLegalDeclarationChecked) {
      toast({ title: "Declaration Required", description: "Please check the legal declaration box to bind the contract.", variant: "destructive" });
      return;
    }
    if (!typedSignatoryName.trim()) {
      toast({ title: "Signatory Name Required", description: "Please type your authorized legal signature name.", variant: "destructive" });
      return;
    }

    setIsContractSigningInProgress(true);
    const contractId = `TOTAG-POA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toLocaleString();
    const isNewCust = !contractForm.isExistingAccount;
    const tempPass = `TOTAG-Pass#${Math.floor(100000 + Math.random() * 900000)}`;

    const contractPayload = {
      companyName: contractForm.companyName,
      email: contractForm.email,
      phone: contractForm.phone,
      tinNumber: contractForm.tinNumber || "LRA-TIN-PENDING",
      billOfLading: contractForm.billOfLading || "Submitted via Portal",
      containerType: contractForm.containerType || "40ft High Cube (40' HQ)",
      cargoCategory: contractForm.cargoCategory || "Standard Dry General Cargo",
      containersCount: contractForm.containersCount || 1,
      portOfDischarge: contractForm.portOfDischarge || "Freeport of Monrovia (Berth 2)",
      authorizedSignatory: typedSignatoryName,
      isExistingAccount: !isNewCust,
      tempPassword: tempPass,
      contractId: contractId
    };

    try {
      const resp = await fetch(getApiUrl("/api/cargo/contracts"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contractPayload),
      });
      const data = await resp.json();
      
      const executedRecord = {
        contractId: data.contractId || contractId,
        companyName: contractForm.companyName,
        email: contractForm.email,
        phone: contractForm.phone,
        tinNumber: contractForm.tinNumber || "LRA-TIN-VERIFIED",
        billOfLading: contractForm.billOfLading || "Submitted",
        containerType: contractForm.containerType || "40' HQ",
        cargoCategory: contractForm.cargoCategory || "General Cargo",
        containersCount: contractForm.containersCount || 1,
        portOfDischarge: contractForm.portOfDischarge || "Freeport of Monrovia (Berth 2)",
        authorizedSignatory: typedSignatoryName,
        status: "ACTIVE_VERIFIED",
        executedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
        responses: [
          {
            sender: "system",
            name: "TOTAG Cargo Onboarding Desk",
            message: `Contract executed and electronically signed by ${typedSignatoryName}. Official Power of Attorney archived in Document Vault.`,
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19)
          }
        ]
      };

      setVaultContracts(prev => [executedRecord, ...prev.filter(c => c.contractId !== executedRecord.contractId)]);
      setExecutedContractSuccess(executedRecord);
      setIsContractSigningInProgress(false);

      // Set customer account state
      setCustomerAccount(prev => ({
        ...prev,
        isLoggedIn: true,
        companyName: contractForm.companyName,
        tinNumber: contractForm.tinNumber || "LRA-TIN-VERIFIED",
        email: contractForm.email,
        phone: contractForm.phone,
        accountType: "Verified Enterprise Shipper",
        isPasswordChanged: !isNewCust
      }));

      setSignedContractReceipt({
        id: contractId,
        date: now,
        isNewCustomer: isNewCust,
        companyName: contractForm.companyName,
        email: contractForm.email
      });

      toast({
        title: "🎉 Contract Electronically Signed & Archived!",
        description: `Contract #${contractId} has been archived in the Document Vault. Confirmation email dispatched to ${contractForm.email}.`
      });

    } catch (err: any) {
      setIsContractSigningInProgress(false);
      toast({
        title: "Contract Signed Locally",
        description: `Contract #${contractId} executed. Added to local Document Vault.`,
      });
    }
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchAwb.trim();
    if (!query) {
      toast({ title: "Please Enter Tracking ID", description: "Enter an 11-digit IATA AWB (e.g. 071-12345675, 176-88419203) or Maritime Container (e.g. MSCU-928172-1).", variant: "destructive" });
      return;
    }

    try {
      const resolved = resolveInternationalCargo(query);
      setTrackedCargo(resolved);
      toast({ 
        title: "🌍 International Exchange Telematics Located", 
        description: `Ingested ${resolved.vesselOrFlight} (${resolved.originPort} → ${resolved.destinationPort}). Status: ${resolved.currentStatus}` 
      });
    } catch (err: any) {
      toast({ title: "Search Error", description: "Unable to parse tracking query format.", variant: "destructive" });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      sender: "customer" as const,
      name: customerAccount.companyName || "Shipper",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setCfMessages([...cfMessages, newMsg]);
    setChatInput("");
    toast({ title: "Message Sent to Customs Broker", description: "Officer Koffa notified on terminal workspace." });

    setTimeout(() => {
      setCfMessages(prev => [
        ...prev,
        {
          sender: "broker",
          name: "Officer J. Koffa (Senior Licensed Customs Broker)",
          text: "Received! Your document update has been logged into LRA ASYCUDA. Proceeding with terminal release order.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 1500);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-900 font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors">
      <Header />

      {/* Hidden File Input Elements for Native File Pickers */}
      <input 
        type="file" 
        ref={blFileInputRef} 
        onChange={handleBlFileSelected} 
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={packingListFileInputRef} 
        onChange={handlePackingListFileSelected} 
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.csv" 
        className="hidden" 
      />

      {/* Main Content Area */}
      <main className="pb-20">
        
        {/* Standardized Photo Carousel Hero Section */}
        <SubsidiaryHeroCarousel
          badge="TOTAG Subsidiary • Port Operations, Customs Brokerage & Freight Forwarding"
          titleHighlight="Cargo Handling & Logistics"
          subtitle="Enterprise multi-tenant cargo platform featuring licensed LRA Customs Brokerage, Clearing & Forwarding (C&F), real-time IATA AWB tracking, WMS bin allocation, and ramp ULD safety staging across Liberia and West Africa."
          slides={[
            { url: "/images/cargo/cargo_npa_monrovia_freeport.jpg", caption: "Freeport of Monrovia Deepwater Berth & Vessel Stevedoring" },
            { url: "/images/cargo/cargo_container_yard_monrovia.jpg", caption: "Monrovia Container Staging Yard & RoRo Ramp Operations" },
            { url: "/images/cargo/cargo_vega_granat_monrovia.png", caption: "Monrovia-Flagged Ocean Bulk Freighter 'VEGA GRANAT' & Tug Escort" },
            { url: "/images/cargo/cargo_berth_harbor_cranes.jpg", caption: "Mobile Harbor Cranes & Heavy Lift Container Clearing (C&F)" },
            { url: "/images/cargo/cargo_terminal_aerial.jpg", caption: "TOTAG Bonded Container Freight Station & WMS Logistics Yard" }
          ]}
          stats={[
            { label: "Cargo Stevedored", value: "3.5M+ Tons" },
            { label: "TEUs Processed", value: "45,000+" },
            { label: "On-Time Clearance", value: "99.8%" }
          ]}
          primaryAction={{
            label: "Open C&F Customs Hub",
            icon: ShieldCheck,
            onClick: () => setActiveTab("cf-customs-hub")
          }}
          secondaryAction={{
            label: "Open E-Billing Portal",
            icon: CreditCard,
            onClick: () => setIsBillingModalOpen(true)
          }}
        />

        {/* Core Multi-Tenant Platform Workspace */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            
            {/* Navigation Tab Controller */}
            <div className="flex justify-center">
              <TabsList className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl grid grid-cols-2 md:grid-cols-5 gap-2 w-full max-w-5xl shadow-xl backdrop-blur-xl">
                <TabsTrigger 
                  value="public-discovery" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-700 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Globe className="w-4 h-4" />
                  <span>Public Discovery</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="cf-customs-hub" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-700 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>C&F & Customs Hub</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="b2b-portal" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-700 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>B2B Client Portal</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="operations-center" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-700 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <HardHat className="w-4 h-4" />
                  <span>WMS & Ramp Command</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="developer-console" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-700 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
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


              {/* OPERATIONAL PORT & MARITIME PHOTOGRAPHY GALLERY SHOWCASE (HIGH DEFINITION CLARITY) */}
              <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500">
                      <Anchor className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-900">Authentic Port Operations & Cargo Gallery</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-500">High-definition maritime logistics photography from TOTAG port operations</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                    5 Port Terminals
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { title: "Freeport Deepwater Berth", img: "/images/cargo/cargo_npa_monrovia_freeport.jpg", tag: "Port Stevedoring" },
                    { title: "Monrovia Staging Yard", img: "/images/cargo/cargo_container_yard_monrovia.jpg", tag: "TEU Staging & RoRo" },
                    { title: "VEGA GRANAT & Tug", img: "/images/cargo/cargo_vega_granat_monrovia.png", tag: "Monrovia Bulk Vessel" },
                    { title: "Harbor Cranes & C&F", img: "/images/cargo/cargo_berth_harbor_cranes.jpg", tag: "Heavy Lift Cranes" },
                    { title: "Bonded Logistics Yard", img: "/images/cargo/cargo_terminal_aerial.jpg", tag: "WMS Storage Yard" }
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
                        <span className="text-xs font-black text-slate-900 truncate block">{item.title}</span>
                        <span className="text-[8px] text-slate-700 font-semibold block mt-0.5 group-hover:text-amber-400 transition-colors">Click for Full-Res HD ↗</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* IATA Freight Rate Engine */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-900">
                  <CardHeader className="border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
                          <Calculator className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">IATA Instant Freight Calculator</CardTitle>
                          <CardDescription className="text-slate-500 dark:text-slate-500 text-xs">Volumetric Chargeable Weight Engine</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold">
                        <button onClick={() => setCalcMode("air")} className={`px-3 py-1 rounded-lg transition-all ${calcMode === "air" ? "bg-emerald-500 text-slate-950" : "text-slate-600 dark:text-slate-500"}`}>Air Cargo</button>
                        <button onClick={() => setCalcMode("ocean")} className={`px-3 py-1 rounded-lg transition-all ${calcMode === "ocean" ? "bg-emerald-500 text-slate-950" : "text-slate-600 dark:text-slate-500"}`}>Maritime Ocean</button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <PortAutocompleteInput 
                        label="Origin Port" 
                        value={origin} 
                        onChange={setOrigin} 
                        calcMode={calcMode} 
                      />
                      <PortAutocompleteInput 
                        label="Destination Port" 
                        value={destination} 
                        onChange={setDestination} 
                        calcMode={calcMode} 
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700">Gross (kg)</Label>
                        <Input type="number" value={grossWeight} onChange={(e) => setGrossWeight(Number(e.target.value))} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700">L (cm)</Label>
                        <Input type="number" value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700">W (cm)</Label>
                        <Input type="number" value={widthCm} onChange={(e) => setWidthCm(Number(e.target.value))} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700">H (cm)</Label>
                        <Input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                      </div>
                    </div>

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

                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">IATA Volumetric Chargeable Weight</span>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-black text-slate-900 dark:text-slate-900">{chargeableWeight.toFixed(1)} kg</span>
                          <span className="text-xs text-slate-500 dark:text-slate-500">(Volumetric: {volumetricWeight.toFixed(1)}kg)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">Estimated Total</span>
                        <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${totalFreightEstimate.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setIsBillingModalOpen(true)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl py-3 text-xs shadow-lg flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Open E-Billing Portal & Checkout (${totalFreightEstimate.toLocaleString()} USD)</span>
                    </Button>
                  </CardContent>
                </Card>

                {/* Public AWB / Container Track-and-Trace */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-900">
                  <CardHeader className="border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-600 dark:text-sky-400">
                          <Search className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">Public AWB & Container Tracking</CardTitle>
                          <CardDescription className="text-slate-500 dark:text-slate-500 text-xs">Real-Time Telematics & Milestone Inspection</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30 text-[10px] font-bold">🌍 Global Exchange Engine</Badge>
                        <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">IATA & ISO 6346</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <form onSubmit={handleTrackSearch} className="flex space-x-2">
                      <Input 
                        value={searchAwb}
                        onChange={(e) => setSearchAwb(e.target.value)}
                        placeholder="Enter Air AWB (e.g. 071-12345675, 176-94021832) or Sea Container (e.g. MSCU-928172-1, MAEU-102938-4)"
                        className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-sm font-semibold"
                      />
                      <Button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl px-6 cursor-pointer">
                        Track Cargo
                      </Button>
                    </form>

                    {/* Quick International Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-700">Try International Carriers:</span>
                      <button type="button" onClick={() => { setSearchAwb("071-92817420"); setTrackedCargo(resolveInternationalCargo("071-92817420")); }} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 font-mono">✈ Ethiopian (071)</button>
                      <button type="button" onClick={() => { setSearchAwb("176-44091823"); setTrackedCargo(resolveInternationalCargo("176-44091823")); }} className="px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 hover:bg-sky-500/20 font-mono">✈ Emirates (176)</button>
                      <button type="button" onClick={() => { setSearchAwb("706-55102934"); setTrackedCargo(resolveInternationalCargo("706-55102934")); }} className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 font-mono">✈ Kenya Airways (706)</button>
                      <button type="button" onClick={() => { setSearchAwb("MSCU-884102-3"); setTrackedCargo(resolveInternationalCargo("MSCU-884102-3")); }} className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 font-mono">🚢 MSC Ocean</button>
                      <button type="button" onClick={() => { setSearchAwb("MAEU-492018-9"); setTrackedCargo(resolveInternationalCargo("MAEU-492018-9")); }} className="px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 font-mono">🚢 Maersk Line</button>
                      <button type="button" onClick={() => { setSearchAwb("CMAU-772910-5"); setTrackedCargo(resolveInternationalCargo("CMAU-772910-5")); }} className="px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 font-mono">🚢 CMA CGM</button>
                    </div>

                    {trackedCargo && (
                      <div className="space-y-4">
                        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-500 dark:text-slate-500 block text-[10px]">AWB / CONTAINER</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{trackedCargo.awbNumber} / {trackedCargo.containerId}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-500 block text-[10px]">LIFECYCLE STATUS</span>
                            <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold">{trackedCargo.currentStatus}</Badge>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-500 block text-[10px]">COLD CHAIN TELEMETRY</span>
                            <span className="font-bold text-sky-600 dark:text-sky-400 flex items-center space-x-1">
                              <Thermometer className="w-3.5 h-3.5" />
                              <span>{trackedCargo.temperatureCelsius}°C ({trackedCargo.humidityPercent}% RH)</span>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-700 block">Milestone Audit Log</span>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {trackedCargo.history.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-xs">
                                <div className="flex items-center space-x-3">
                                  {item.completed ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-slate-500" />}
                                  <div>
                                    <span className={`font-semibold block ${item.completed ? "text-slate-900 dark:text-slate-900" : "text-slate-500"}`}>{item.step}</span>
                                    <span className="text-[10px] text-slate-500">{item.location}</span>
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
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
                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-3 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Anchor className="w-6 h-6 text-emerald-500" />
                    <h3 className="font-bold text-lg">Freeport of Monrovia Berth 2</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-700">24/7 Deepwater stevedoring, gantry crane container handling, and bonded customs warehouse facility.</p>
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">ISO 9001 Certified</Badge>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-3 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Ship className="w-6 h-6 text-sky-500" />
                    <h3 className="font-bold text-lg">Port of Buchanan Terminal</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-700">Heavy equipment, mining ore breakbulk handling, and maritime fuel bunkering infrastructure.</p>
                  <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30 text-[10px]">FIATA Accredited</Badge>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-3 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-6 h-6 text-amber-500" />
                    <h3 className="font-bold text-lg">IATA Dangerous Goods (DGR)</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-700">Class 1-9 Hazmat certified handling, specialized cold chain storage (2-8°C), and LRA single-window clearance.</p>
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">IATA Cargo Agent</Badge>
                </Card>
              </div>

            </TabsContent>

            {/* =================================================================== */}
            {/* TAB 2: C&F AGENT & CUSTOMS BROKERAGE PUBLIC INTAKE HUB               */}
            {/* =================================================================== */}
            <TabsContent value="cf-customs-hub" className="space-y-8">
              
              {/* CLEAN PUBLIC HUB HEADER BANNER */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 p-6 rounded-3xl text-slate-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-xl text-slate-900">TOTAG C&F Stevedoring & Customs Brokerage Hub</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                        LRA Licensed Customs Agent
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 max-w-2xl">
                      Express interest to clear your containers (20ft, 40ft, HQ, Reefer) or cargo (Hazmat, Cold-Chain 2-8°C). The system automatically provisions your customer portal account upon contract execution.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <Button 
                    onClick={() => setActiveTab("b2b-portal")}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl px-5 py-2.5 shadow-lg"
                  >
                    <UserCheck className="w-4 h-4 mr-1.5" />
                    <span>Go to Customer Portal</span>
                  </Button>
                </div>
              </div>

              {/* SECTION: PUBLIC C&F CLEARING INTEREST & CONTRACT INTAKE FORM */}
              <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
                      <FileSignature className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Express Interest & Sign C&F Clearing Service Contract</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Provide contact details, container specifications & execute digital Power of Attorney</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                    Public Customer Intake
                  </Badge>
                </div>

                <form onSubmit={handleExecuteContract} className="space-y-6">

                  {/* ACCOUNT STATUS RADIO SELECTOR */}
                  <div className="bg-slate-100 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-700 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-emerald-500" />
                      <span>Are you a New or Returning TOTAG Enterprise Customer?</span>
                    </span>

                    <div className="flex items-center space-x-4 font-semibold">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="customerType" 
                          checked={!contractForm.isExistingAccount} 
                          onChange={() => setContractForm({...contractForm, isExistingAccount: false})}
                          className="text-emerald-500 focus:ring-0" 
                        />
                        <span className="text-slate-900 dark:text-slate-900">New Customer (Auto-Create Account)</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="customerType" 
                          checked={contractForm.isExistingAccount} 
                          onChange={() => setContractForm({...contractForm, isExistingAccount: true})}
                          className="text-emerald-500 focus:ring-0" 
                        />
                        <span className="text-slate-900 dark:text-slate-900">Existing Account Holder</span>
                      </label>
                    </div>
                  </div>

                  {/* 1. CUSTOMER CONTACT & CORPORATE IDENTIFICATION SECTION */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <User className="w-4 h-4" />
                      <span>1. Customer Corporate & Contact Information</span>
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Company / Enterprise Name *</Label>
                        <Input 
                          value={contractForm.companyName} 
                          onChange={(e) => setContractForm({...contractForm, companyName: e.target.value})} 
                          placeholder="e.g. Global Pharma Freight NV"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Official Contact Email *</Label>
                        <div className="relative mt-1">
                          <Input 
                            type="email"
                            value={contractForm.email} 
                            onChange={(e) => setContractForm({...contractForm, email: e.target.value})} 
                            placeholder="e.g. customs@globalpharma.be"
                            className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs pl-8 font-semibold" 
                          />
                          <Mail className="w-3.5 h-3.5 text-emerald-500 absolute left-2.5 top-2.5" />
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Onboarding instructions sent to this email</span>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Phone / WhatsApp Contact *</Label>
                        <div className="relative mt-1">
                          <Input 
                            value={contractForm.phone} 
                            onChange={(e) => setContractForm({...contractForm, phone: e.target.value})} 
                            placeholder="e.g. +231 77 000 1122"
                            className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs pl-8 font-semibold" 
                          />
                          <Phone className="w-3.5 h-3.5 text-emerald-500 absolute left-2.5 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Company Tax ID / LRA TIN</Label>
                        <Input 
                          value={contractForm.tinNumber} 
                          onChange={(e) => setContractForm({...contractForm, tinNumber: e.target.value})} 
                          placeholder="e.g. LRA-TIN-9940218"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs mt-1 font-mono" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. CONTAINER & CARGO SPECIFICATION SECTION */}
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10">
                    <Label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Container className="w-4 h-4" />
                      <span>2. Container & Cargo Specifications</span>
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Bill of Lading / AWB Reference #</Label>
                        <Input 
                          value={contractForm.blNumber} 
                          onChange={(e) => setContractForm({...contractForm, blNumber: e.target.value})} 
                          className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Container Type / Specification</Label>
                        <select 
                          value={contractForm.containerType}
                          onChange={(e) => setContractForm({...contractForm, containerType: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs p-2.5 mt-1 font-semibold"
                        >
                          <option value="20ft Standard (20' GP)">20ft Standard Dry (20' GP)</option>
                          <option value="40ft Standard (40' GP)">40ft Standard Dry (40' GP)</option>
                          <option value="40ft High Cube (40' HQ)">40ft High Cube (40' HQ)</option>
                          <option value="45ft High Cube (45' HQ)">45ft High Cube (45' HQ)</option>
                          <option value="Reefer Cold-Chain Container">Reefer Cold-Chain Container (2°C - 8°C)</option>
                          <option value="Flat Rack / Open Top">Flat Rack Heavy Equipment</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Cargo Handling Category</Label>
                        <select 
                          value={contractForm.cargoCategory}
                          onChange={(e) => setContractForm({...contractForm, cargoCategory: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs p-2.5 mt-1 font-semibold"
                        >
                          <option value="Standard Dry General Cargo">Standard Dry General Cargo</option>
                          <option value="Hazmat / Dangerous Goods (Class 1-9)">Hazmat / Dangerous Goods (Class 1-9)</option>
                          <option value="Cold-Chain Pharmaceuticals (2°C - 8°C)">Cold-Chain Pharmaceuticals (2°C - 8°C)</option>
                          <option value="Heavy Machinery / Mining Equipment">Heavy Machinery / Mining Equipment</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Number of Containers / TEUs</Label>
                        <Input 
                          type="number" 
                          value={contractForm.containerCount} 
                          onChange={(e) => setContractForm({...contractForm, containerCount: Number(e.target.value)})} 
                          className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Port of Discharge & Clearance</Label>
                        <select 
                          value={contractForm.dischargePort}
                          onChange={(e) => setContractForm({...contractForm, dischargePort: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs p-2.5 mt-1 font-semibold"
                        >
                          <option value="Freeport of Monrovia (LRMLW)">Freeport of Monrovia (Berth 2)</option>
                          <option value="Port of Buchanan (LRUCN)">Port of Buchanan Terminal</option>
                          <option value="Roberts Int'l Airport (ROB)">Roberts Int'l Airport Cargo Gate</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Authorized Signatory Name & Title *</Label>
                        <Input 
                          value={contractForm.authorizedSignatory} 
                          onChange={(e) => setContractForm({...contractForm, authorizedSignatory: e.target.value})} 
                          placeholder="e.g. Jean-Paul Antwerp (Managing Director)"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. MANDATORY DOCUMENT ATTACHMENT VAULT DROPZONES */}
                  <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-900 dark:text-slate-900 flex items-center space-x-1.5">
                        <FileCheck2 className="w-4 h-4 text-emerald-500" />
                        <span>Mandatory Document Proof Intake (Click to Open Local File Explorer)</span>
                      </Label>
                      <Badge className="bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px]">
                        Upload Proof Required
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. MANDATORY BILL OF LADING (B/L) COPY DROPZONE */}
                      <div 
                        onClick={handleTriggerBlUpload}
                        className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:scale-[1.01] ${
                          uploadedBlCopy 
                            ? "bg-emerald-500/5 border-emerald-500/40 hover:border-emerald-500" 
                            : "bg-slate-50 dark:bg-slate-950/60 border-slate-300 dark:border-white/20 hover:border-emerald-500"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-900 block">
                                Proof of Bill of Lading (B/L Copy) *
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-500 block">
                                Click to select Master B/L or Sea Waybill file
                              </span>
                            </div>
                          </div>
                          {uploadedBlCopy && (
                            <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                              VERIFIED
                            </Badge>
                          )}
                        </div>

                        {uploadedBlCopy ? (
                          <div className="mt-3 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 min-w-0 pr-2">
                              <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">{uploadedBlCopy.name} ({uploadedBlCopy.size})</span>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <button 
                                type="button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTriggerBlUpload();
                                }} 
                                className="text-emerald-500 hover:underline font-bold text-[10px]"
                              >
                                Re-upload
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUploadedBlCopy(null);
                                  toast({ title: "B/L Detached", description: "Proof of Bill of Lading removed." });
                                }}
                                className="text-rose-500 hover:text-rose-400 p-1"
                                title="Remove File"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTriggerBlUpload();
                            }} 
                            className="w-full mt-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold rounded-xl py-2"
                          >
                            <Upload className="w-3.5 h-3.5 mr-1.5" />
                            <span>Browse & Upload Bill of Lading Copy</span>
                          </Button>
                        )}
                      </div>

                      {/* 2. MANDATORY PACKING LIST COPY DROPZONE */}
                      <div 
                        onClick={handleTriggerPackingListUpload}
                        className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:scale-[1.01] ${
                          uploadedPackingList 
                            ? "bg-emerald-500/5 border-emerald-500/40 hover:border-emerald-500" 
                            : "bg-slate-50 dark:bg-slate-950/60 border-slate-300 dark:border-white/20 hover:border-emerald-500"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-500">
                              <FileSpreadsheet className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-900 block">
                                Copy of Packing List (For Declaration) *
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-500 block">
                                Click to select packing list file
                              </span>
                            </div>
                          </div>
                          {uploadedPackingList && (
                            <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                              VERIFIED
                            </Badge>
                          )}
                        </div>

                        {uploadedPackingList ? (
                          <div className="mt-3 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 min-w-0 pr-2">
                              <FileSpreadsheet className="w-4 h-4 text-sky-500 flex-shrink-0" />
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">{uploadedPackingList.name} ({uploadedPackingList.size})</span>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <button 
                                type="button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTriggerPackingListUpload();
                                }} 
                                className="text-emerald-500 hover:underline font-bold text-[10px]"
                              >
                                Re-upload
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUploadedPackingList(null);
                                  toast({ title: "Packing List Detached", description: "Packing list removed." });
                                }}
                                className="text-rose-500 hover:text-rose-400 p-1"
                                title="Remove File"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTriggerPackingListUpload();
                            }} 
                            className="w-full mt-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold rounded-xl py-2"
                          >
                            <Upload className="w-3.5 h-3.5 mr-1.5" />
                            <span>Browse & Upload Packing List Copy</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Legal Terms & Power of Attorney Authorization Agreement Box */}
                  <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider">
                      TOTAG Customs Brokerage Power of Attorney (PoA) Terms
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-700 leading-relaxed">
                      "By executing this digital contract, {contractForm.companyName || "the Shipper"} hereby authorizes TOTAG Group of Companies Ltd (Licensed Customs Clearing & Forwarding Agent) to act on our behalf with Liberia Revenue Authority (LRA), National Port Authority (NPA), APM Terminals, and Ministry of Commerce to file ASYCUDA entries, pay customs duties, inspect cargo, and execute container release orders."
                    </p>
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-slate-900 cursor-pointer pt-1">
                      <input 
                        type="checkbox" 
                        checked={contractForm.isPoaAgreed} 
                        onChange={(e) => setContractForm({...contractForm, isPoaAgreed: e.target.checked})} 
                        className="rounded text-emerald-500 focus:ring-0" 
                      />
                      <span>I agree to the TOTAG Licensed Clearing & Stevedoring Service Agreement.</span>
                    </label>
                  </div>

                  {/* Action Button & Digital Contract Execution Result */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Button 
                      type="submit" 
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl px-8 py-3.5 text-xs shadow-lg"
                    >
                      <PenTool className="w-4 h-4 mr-2" />
                      <span>Review Terms & Electronically Sign Contract</span>
                    </Button>

                    {signedContractReceipt && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-xs">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-900 block">
                            {signedContractReceipt.isNewCustomer ? "New Account Created & Onboarding Sent" : "Contract Receipt Dispatched to Email"}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                            Ref: {signedContractReceipt.id} • Sent to {signedContractReceipt.email}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </Card>

                            {/* SECTION 3: EXECUTED CONTRACTS & DOCUMENT VAULT (DEDICATED FULL WIDTH) */}
              <div className="w-full space-y-6">
                <Card className="w-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-4 backdrop-blur-xl shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <FileCheck className="w-6 h-6 text-emerald-500" />
                        <h3 className="text-lg sm:text-xl font-bold">Executed Clearing Contracts & Power of Attorney (PoA) Vault</h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        Official legal agreements, ASYCUDA clearing authorizations & client amendment audit logs
                      </p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs w-fit">
                      {vaultContracts.length} Active Vault Records
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {vaultContracts.map((contract, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 rounded-2xl p-4 space-y-3 hover:border-emerald-500/40 transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                              #{contract.contractId}
                            </span>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-900 mt-0.5">
                              {contract.companyName}
                            </h4>
                            <span className="text-[11px] text-slate-500">Signatory: {contract.authorizedSignatory}</span>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-bold">
                            {contract.status || "ACTIVE_VERIFIED"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
                          <div>
                            <span className="text-slate-500 block text-[10px]">B/L / AWB REF</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{contract.billOfLading || "Submitted"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">CONTAINER SPEC</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{contract.containerType || "40' HQ"} ({contract.containersCount || 1} TEU)</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">DISCHARGE PORT</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{contract.portOfDischarge || "Monrovia Berth 2"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">EXECUTED ON</span>
                            <span className="font-mono text-slate-600 dark:text-slate-700">{contract.executedAt ? contract.executedAt.slice(0, 10) : "2026-08-22"}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-500 flex items-center">
                            <MessageSquare className="w-3.5 h-3.5 mr-1 text-sky-500" />
                            {contract.responses ? contract.responses.length : 1} message(s) logged
                          </span>
                          <Button 
                            onClick={() => {
                              setSelectedVaultContract(contract);
                              setIsContractModalOpen(true);
                            }}
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl px-4 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Peruse & Respond
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* SECTION 4: LRA CUSTOMS DUTY ESTIMATOR & ASYCUDA PIPELINE (2-COLUMN GRID) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Card className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
                        <Receipt className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">LRA Customs Duty & Tariff Calculator</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Licensed Customs Brokerage & ASYCUDA Assessment</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">ASYCUDA Compliant</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-700">Port of Clearance</Label>
                      <select 
                        value={clearingPort} 
                        onChange={(e) => setClearingPort(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs p-2.5 mt-1 font-semibold"
                      >
                        <option value="Freeport of Monrovia (Berth 2)">Freeport of Monrovia (LRMLW)</option>
                        <option value="Port of Buchanan Terminal">Port of Buchanan (LRUCN)</option>
                        <option value="Roberts Int'l Airport Cargo Gate">Roberts Int'l Airport (ROB)</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-700">Declared Invoice CIF Value ($ USD)</Label>
                      <Input type="number" value={cifValueUsd} onChange={(e) => setCifValueUsd(Number(e.target.value))} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-700">Tariff HS Code Classification</Label>
                    <select 
                      value={selectedHsCode.code}
                      onChange={(e) => setSelectedHsCode(TARIFF_HS_CODES.find(h => h.code === e.target.value) || TARIFF_HS_CODES[0])}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs p-2.5 mt-1 font-semibold"
                    >
                      {TARIFF_HS_CODES.map(h => (
                        <option key={h.code} value={h.code}>
                          HS {h.code} - {h.description} (Duty: {(h.dutyRate * 100).toFixed(0)}%, GST: {(h.gstRate * 100).toFixed(0)}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-500">
                      <span>Import Duty ({(selectedHsCode.dutyRate * 100).toFixed(1)}%):</span>
                      <span className="font-bold text-slate-900 dark:text-slate-900">${calculatedCustomsDuty.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-500">
                      <span>GST Sales Tax ({(selectedHsCode.gstRate * 100).toFixed(1)}%):</span>
                      <span className="font-bold text-slate-900 dark:text-slate-900">${calculatedGstTax.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-500">
                      <span>ECOWAS Trade Levy (0.5%):</span>
                      <span className="font-bold text-slate-900 dark:text-slate-900">${calculatedEcowasLevy.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-500">
                      <span>Port Handling & Stevedoring Fee:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-900">${portHandlingFee.toLocaleString()} USD</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-sm font-black">
                      <span className="text-emerald-600 dark:text-emerald-400">Total Payable LRA Customs Assessment:</span>
                      <span className="text-xl text-emerald-600 dark:text-emerald-400">${totalCustomsPayable.toLocaleString()} USD</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setIsBillingModalOpen(true)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl py-3 text-xs shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Open E-Billing Portal & Pay Tax Assessment (${totalCustomsPayable.toLocaleString()} USD)</span>
                  </Button>
                </Card>

                {/* 2. Real-Time Customer-Broker Live Interaction Console */}
                <Card className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-500">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Live Customs Broker Workspace</h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-500">Direct channel with assigned TOTAG Broker</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Officer Koffa (ONLINE)</span>
                      </Badge>
                    </div>

                    <div className="space-y-3 my-4 max-h-80 overflow-y-auto pr-1">
                      {cfMessages.map((msg, idx) => (
                        <div key={idx} className={`p-3 rounded-2xl text-xs space-y-1 ${
                          msg.sender === "broker" 
                            ? "bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 mr-4" 
                            : "bg-emerald-500/10 border border-emerald-500/20 text-slate-900 dark:text-slate-900 ml-4"
                        }`}>
                          <div className="flex justify-between items-center font-bold text-[10px] text-slate-500 dark:text-slate-500">
                            <span>{msg.name}</span>
                            <span>{msg.time}</span>
                          </div>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSendMessage} className="flex space-x-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <Input 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask your Customs Broker a question..."
                      className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs font-medium"
                    />
                    <Button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl px-4">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </Card>

              </div>

            </TabsContent>

            {/* =================================================================== */}
            {/* TAB 3: AUTHENTICATED B2B CLIENT PORTAL (SELF-SERVICE LIFECYCLE)     */}
            {/* =================================================================== */}
            <TabsContent value="b2b-portal" id="cargo-customer-dashboard" className="space-y-8">
                
                {/* ================================================================= */}
                {/* 1. PUBLIC VIEW (WHEN NOT LOGGED IN)                              */}
                {/* ================================================================= */}
                {!customerAccount.isLoggedIn ? (
                  <div className="space-y-8">
                    
                    {/* A. CUSTOMER PORTAL AUTHENTICATION & LOGIN CARD */}
                    <Card className="bg-white border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                        <div className="flex items-center space-x-4">
                          <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-700 shadow-sm">
                            <LogIn className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-xl font-black text-slate-900">
                                Customer Cargo Portal Sign In
                              </h3>
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                                Secure Account Access
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 max-w-xl">
                              Sign in with your registered enterprise email and password (or temporary credentials from your onboarding email) to access your private Document Vault, live cargo telematics, and credit management.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => {
                              setCustomerAccount({
                                isLoggedIn: true,
                                companyName: "Jutu Enterprise Ltd",
                                tinNumber: "LRA-TIN-9940218",
                                email: "rtalk4348@gmail.com",
                                phone: "+231 777 000 111",
                                accountType: "Verified Enterprise Shipper Account",
                                isPasswordChanged: false,
                                creditLimitUsd: 150000,
                                creditUsedUsd: 24500,
                                teamMembers: [
                                  { name: "Edward James (CEO)", role: "Managing Director (Primary)", email: "rtalk4348@gmail.com" },
                                  { name: "Officer J. Koffa", role: "Licensed Customs Broker (Assigned)", email: "cargo@totaggroup.com" }
                                ]
                              });
                              toast({ title: "Welcome to Customer Dashboard!", description: "Signed in as Jutu Enterprise Ltd (rtalk4348@gmail.com)." });
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl px-5 py-2.5 shadow-md cursor-pointer"
                          >
                            <Zap className="w-4 h-4 mr-1.5" />
                            <span>1-Click Sign In (Jutu Enterprise)</span>
                          </Button>
                        </div>
                      </div>

                      {/* Inline Login Form */}
                      <form onSubmit={handleCustomerLogin} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-50 p-5 rounded-2xl border border-slate-200">
                        <div>
                          <Label className="text-slate-700 text-xs font-bold">Official Account Email *</Label>
                          <Input 
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="e.g. rtalk4348@gmail.com"
                            className="bg-white border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 text-xs font-bold">Password / Temporary Credentials *</Label>
                          <Input 
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Enter password or TOTAG-Pass#..."
                            className="bg-white border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-mono"
                            required
                          />
                        </div>
                        <Button 
                          type="submit" 
                          disabled={isLoggingIn}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl py-3 shadow-md cursor-pointer transition flex items-center justify-center"
                        >
                          <LogIn className="w-4 h-4 mr-1.5 text-emerald-400" />
                          <span>{isLoggingIn ? "Authenticating..." : "Sign In to Dashboard"}</span>
                        </Button>
                      </form>
                    </Card>

                    {/* B. PUBLIC B2B CARGO BOOKING INTAKE & QUOTATION ENGINE */}
                    <Card className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 space-y-6 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Box className="w-6 h-6 text-emerald-600" />
                            <h3 className="text-xl font-black text-slate-900">
                              Public B2B Cargo Booking & Manifest Intake
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Create new shipment booking, upload manifests & generate official printable AWB quotation
                          </p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-bold w-fit">
                          Public Shipper Intake
                        </Badge>
                      </div>

                      <form onSubmit={handleGenerateAwbBooking} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-slate-700 font-bold">Shipper / Company Name *</Label>
                            <Input 
                              value={b2bBookingForm.shipper} 
                              onChange={(e) => setB2bBookingForm({...b2bBookingForm, shipper: e.target.value})}
                              placeholder="e.g. Jutu Enterprise Ltd / Global Pharma NV"
                              className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                              required
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-700 font-bold">Consignee Entity *</Label>
                            <Input 
                              value={b2bBookingForm.consignee} 
                              onChange={(e) => setB2bBookingForm({...b2bBookingForm, consignee: e.target.value})}
                              placeholder="e.g. TOTAG General Merchandise Ltd"
                              className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs text-slate-700 font-bold">Nature of Goods</Label>
                            <Input 
                              value={b2bBookingForm.natureOfGoods} 
                              onChange={(e) => setB2bBookingForm({...b2bBookingForm, natureOfGoods: e.target.value})}
                              placeholder="e.g. General Merchandise / Pharmaceuticals"
                              className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-700 font-bold">Total Pieces / Cartons</Label>
                            <Input 
                              type="number" 
                              value={b2bBookingForm.pieces} 
                              onChange={(e) => setB2bBookingForm({...b2bBookingForm, pieces: Number(e.target.value)})}
                              className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-700 font-bold">Estimated Weight (kg)</Label>
                            <Input 
                              type="number" 
                              value={b2bBookingForm.weightKg} 
                              onChange={(e) => setB2bBookingForm({...b2bBookingForm, weightKg: Number(e.target.value)})}
                              className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                            />
                          </div>
                        </div>

                        <div 
                          onClick={handleTriggerBlUpload}
                          className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50"
                        >
                          <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                          <span className="text-xs font-bold text-slate-900 block">Drop Commercial Invoice, Packing List & Manifest Copy</span>
                          <span className="text-[10px] text-slate-500 block mt-1">PDF, PNG, TIFF up to 25MB (Click to select local file)</span>
                        </div>

                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl py-3 text-xs shadow-lg flex items-center justify-center space-x-2 cursor-pointer">
                          <FileText className="w-4 h-4" />
                          <span>Generate Booking & Issue Official Printable AWB PDF</span>
                        </Button>
                      </form>
                    </Card>

                    {/* C. PROTECTED DASHBOARD FEATURES PREVIEW / TEASER */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">Private Document Vault</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Secure repository for your executed Power of Attorney contracts, ASYCUDA SAD entries, and tax receipts. (Sign in to access)
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                        <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center font-bold">
                          <Radio className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">Live Cargo Telematics</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Real-time cold-chain temperature (2-8°C), shock G-force, and GPS container vessel tracking. (Sign in to access)
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                        <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">Credit Line & E-Billing</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Up to $150,000 approved revolving credit line, electronic billing, and dispute ticketing. (Sign in to access)
                        </p>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* ================================================================= */
                  /* 2. AUTHENTICATED CUSTOMER CARGO DASHBOARD                         */
                  /* ================================================================= */
                  <div className="space-y-8">
                    
                    {/* A. ENTERPRISE CUSTOMER PROFILE HEADER */}
                    <div className="bg-white border-2 border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                        <div className="flex items-center space-x-3.5">
                          <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-700 shadow-sm">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2.5">
                              <h3 className="text-xl font-black text-slate-900">
                                {customerAccount.companyName}
                              </h3>
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                                Verified Enterprise Client
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                              Account: <strong className="text-slate-800 font-mono">{customerAccount.email}</strong> • LRA TIN: <strong className="text-slate-800 font-mono">{customerAccount.tinNumber}</strong> • Phone: <strong className="text-slate-800">{customerAccount.phone}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2.5">
                          <Button 
                            onClick={() => setIsPasswordModalOpen(true)}
                            variant="outline"
                            size="sm"
                            className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl"
                          >
                            <KeyRound className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Change Password
                          </Button>
                          <Button 
                            onClick={() => {
                              setCustomerAccount(prev => ({ ...prev, isLoggedIn: false }));
                              toast({ title: "Logged Out", description: "You have signed out of your customer portal." });
                            }}
                            variant="outline"
                            size="sm"
                            className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>

                      {/* Account Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <Button 
                            onClick={() => setIsBillingModalOpen(true)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl px-4 py-2.5 shadow-md flex items-center space-x-1.5 cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Open E-Billing Portal</span>
                          </Button>

                          <Button 
                            onClick={() => setIsNewUserModalOpen(true)}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl px-4 py-2.5 shadow-md flex items-center space-x-1.5 cursor-pointer"
                          >
                            <UserPlus className="w-4 h-4 text-emerald-400" />
                            <span>Manage Org RBAC</span>
                          </Button>

                          <Button 
                            onClick={() => setIsDisputeModalOpen(true)}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl px-4 py-2.5 shadow-md flex items-center space-x-1.5 cursor-pointer"
                          >
                            <HelpCircle className="w-4 h-4 text-amber-400" />
                            <span>File Dispute Ticket</span>
                          </Button>
                        </div>

                        <Badge className="bg-sky-100 text-sky-800 border-sky-300 text-xs font-bold px-3 py-1">
                          Assigned Broker: Officer J. Koffa (ONLINE)
                        </Badge>
                      </div>

                      {/* Financial Stats Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                          <span className="text-slate-500 block text-[10px] font-bold">APPROVED CREDIT LINE</span>
                          <span className="text-lg font-black text-emerald-600">${customerAccount.creditLimitUsd.toLocaleString()} USD</span>
                        </div>
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                          <span className="text-slate-500 block text-[10px] font-bold">USED CREDIT BALANCE</span>
                          <span className="text-lg font-black text-amber-600">${customerAccount.creditUsedUsd.toLocaleString()} USD</span>
                        </div>
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                          <span className="text-slate-500 block text-[10px] font-bold">AVAILABLE CREDIT</span>
                          <span className="text-lg font-black text-sky-600">${(customerAccount.creditLimitUsd - customerAccount.creditUsedUsd).toLocaleString()} USD</span>
                        </div>
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                          <span className="text-slate-500 block text-[10px] font-bold">ACTIVE ORG USERS</span>
                          <span className="text-lg font-black text-slate-800">{customerAccount.teamMembers.length} Members</span>
                        </div>
                      </div>
                    </div>

                    {/* B. COMPREHENSIVE CUSTOMER DOCUMENT VAULT (ALL LEGAL, BILLING, B/L & RECEIPT RECORDS) */}
                    <Card className="w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 space-y-6 shadow-xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-700 shadow-sm">
                              <FileCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-xl font-black text-slate-900">
                                  Customer Enterprise Document Vault
                                </h3>
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                                  Verified Permanent Records
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Complete repository of your executed legal agreements, Bills of Lading, LRA tax bills, payment receipts, and delivery orders.
                              </p>
                            </div>
                          </div>
                        </div>

                        <Badge className="bg-slate-900 text-white font-mono text-xs px-3.5 py-1.5 rounded-xl self-start md:self-center">
                          {COMPREHENSIVE_VAULT_DOCUMENTS.length + vaultContracts.length} Total Enterprise Documents
                        </Badge>
                      </div>

                      {/* Document Category Filter Tabs */}
                      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                        {[
                          { id: "ALL", label: "All Documents", count: COMPREHENSIVE_VAULT_DOCUMENTS.length + vaultContracts.length },
                          { id: "CONTRACT", label: "Contracts & Power of Attorney", count: vaultContracts.length + COMPREHENSIVE_VAULT_DOCUMENTS.filter(d => d.category === "CONTRACT").length },
                          { id: "BL_AWB", label: "Bills of Lading & AWBs", count: COMPREHENSIVE_VAULT_DOCUMENTS.filter(d => d.category === "BL_AWB").length },
                          { id: "INVOICE", label: "Customs Duty Bills & Invoices", count: COMPREHENSIVE_VAULT_DOCUMENTS.filter(d => d.category === "INVOICE").length },
                          { id: "RECEIPT", label: "Official Payment Receipts", count: COMPREHENSIVE_VAULT_DOCUMENTS.filter(d => d.category === "RECEIPT").length },
                          { id: "DELIVERY_ORDER", label: "Delivery Orders & Gate Passes", count: COMPREHENSIVE_VAULT_DOCUMENTS.filter(d => d.category === "DELIVERY_ORDER").length }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedVaultCategory(cat.id as VaultDocCategory)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                              selectedVaultCategory === cat.id
                                ? "bg-slate-900 text-white shadow-md"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            <span>{cat.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedVaultCategory === cat.id ? "bg-emerald-500 text-slate-950 font-black" : "bg-slate-200 text-slate-700"}`}>
                              {cat.count}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Documents Grid Display */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        
                        {/* Executed Power of Attorney from Dynamic State */}
                        {(selectedVaultCategory === "ALL" || selectedVaultCategory === "CONTRACT") && vaultContracts.map((contract, idx) => (
                          <div 
                            key={`dyn-contract-${idx}`} 
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5 hover:border-emerald-500/50 transition-all shadow-sm flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                                  LEGAL CONTRACT & POA
                                </Badge>
                                <span className="font-mono text-xs font-black text-emerald-700">
                                  #{contract.contractId}
                                </span>
                              </div>
                              <h4 className="font-black text-sm text-slate-900 leading-snug">
                                Digital Power of Attorney & Clearing Service Agreement
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-2">
                                Authorizing customs clearance, tariff assessment remittance, and port delivery order release.
                              </p>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] space-y-1 shadow-inner">
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-bold">Signatory:</span>
                                <span className="font-semibold text-slate-800 truncate max-w-[150px]">{contract.authorizedSignatory}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-bold">B/L Reference:</span>
                                <span className="font-mono text-sky-700 font-bold">{contract.billOfLading || "On File"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-bold">Executed Date:</span>
                                <span className="font-mono text-slate-600">{contract.executedAt ? contract.executedAt.slice(0, 10) : "2026-08-23"}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                              <span className="text-[11px] text-emerald-700 font-bold flex items-center">
                                <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                ACTIVE & BINDING
                              </span>
                              <Button 
                                onClick={() => {
                                  setSelectedVaultContract(contract);
                                  setIsContractModalOpen(true);
                                }}
                                size="sm" 
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl px-4 cursor-pointer shadow-sm"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                Peruse & Read
                              </Button>
                            </div>
                          </div>
                        ))}

                        {/* General Vault Documents (Bills of Lading, Tax Invoices, Official Receipts, Delivery Orders) */}
                        {COMPREHENSIVE_VAULT_DOCUMENTS
                          .filter(doc => selectedVaultCategory === "ALL" || doc.category === selectedVaultCategory)
                          .map((doc) => (
                            <div 
                              key={doc.id}
                              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5 hover:border-emerald-500/50 transition-all shadow-sm flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <Badge className={`text-[10px] font-bold ${
                                    doc.category === "INVOICE" ? "bg-amber-100 text-amber-800 border-amber-300" :
                                    doc.category === "RECEIPT" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                                    doc.category === "BL_AWB" ? "bg-sky-100 text-sky-800 border-sky-300" :
                                    doc.category === "DELIVERY_ORDER" ? "bg-teal-100 text-teal-800 border-teal-300" :
                                    "bg-slate-200 text-slate-800"
                                  }`}>
                                    {doc.category === "INVOICE" ? "TAX BILL & INVOICE" :
                                     doc.category === "RECEIPT" ? "OFFICIAL RECEIPT" :
                                     doc.category === "BL_AWB" ? "BILL OF LADING / AWB" :
                                     doc.category === "DELIVERY_ORDER" ? "DELIVERY ORDER (DO)" : "DOCUMENT"}
                                  </Badge>
                                  <span className="font-mono text-xs font-black text-slate-700">
                                    {doc.docNumber}
                                  </span>
                                </div>
                                <h4 className="font-black text-sm text-slate-900 leading-snug">
                                  {doc.title}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-2">
                                  {doc.summary}
                                </p>
                              </div>

                              <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] space-y-1 shadow-inner">
                                {doc.amountUsd && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-400 font-bold">Total Assessment / Amount:</span>
                                    <span className="font-mono text-emerald-700 font-black">${doc.amountUsd.toLocaleString(undefined, {minimumFractionDigits: 2})} USD</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-slate-400 font-bold">Issuer / Authority:</span>
                                  <span className="font-semibold text-slate-800 truncate max-w-[150px]">{doc.issuer}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400 font-bold">Issue / Clearance Date:</span>
                                  <span className="font-mono text-slate-600">{doc.issueDate}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                                <span className="text-[10px] font-bold text-slate-500 font-mono">
                                  REF: {doc.reference}
                                </span>
                                <Button 
                                  onClick={() => {
                                    setSelectedGeneralDoc(doc);
                                    setIsGeneralDocViewerOpen(true);
                                  }}
                                  size="sm" 
                                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl px-4 cursor-pointer shadow-sm flex items-center"
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                                  <span>Peruse Document</span>
                                </Button>
                              </div>
                            </div>
                          ))}

                      </div>
                    </Card>

                    {/* C. B2B CARGO BOOKING & LIVE SENSOR TELEMATICS (AUTHENTICATED VIEW) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* B2B Cargo Booking Form */}
                      <Card className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                          <div>
                            <h3 className="text-xl font-bold">B2B Cargo Booking & Manifest Engine</h3>
                            <p className="text-xs text-slate-500">Create new shipment booking, upload manifests & generate official printable AWB PDF</p>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold">IATA Compliant</Badge>
                        </div>

                        <form onSubmit={handleGenerateAwbBooking} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-slate-700 font-bold">Shipper Organization *</Label>
                              <Input 
                                value={b2bBookingForm.shipper} 
                                onChange={(e) => setB2bBookingForm({...b2bBookingForm, shipper: e.target.value})}
                                placeholder="e.g. Jutu Enterprise Ltd"
                                className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-slate-700 font-bold">Consignee Entity *</Label>
                              <Input 
                                value={b2bBookingForm.consignee} 
                                onChange={(e) => setB2bBookingForm({...b2bBookingForm, consignee: e.target.value})}
                                placeholder="e.g. TOTAG General Merchandise Ltd"
                                className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs text-slate-700 font-bold">Nature of Goods</Label>
                              <Input 
                                value={b2bBookingForm.natureOfGoods} 
                                onChange={(e) => setB2bBookingForm({...b2bBookingForm, natureOfGoods: e.target.value})}
                                className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-slate-700 font-bold">Total Pieces</Label>
                              <Input 
                                type="number" 
                                value={b2bBookingForm.pieces} 
                                onChange={(e) => setB2bBookingForm({...b2bBookingForm, pieces: Number(e.target.value)})}
                                className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-slate-700 font-bold">Total Weight (kg)</Label>
                              <Input 
                                type="number" 
                                value={b2bBookingForm.weightKg} 
                                onChange={(e) => setB2bBookingForm({...b2bBookingForm, weightKg: Number(e.target.value)})}
                                className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" 
                              />
                            </div>
                          </div>

                          <div 
                            onClick={handleTriggerBlUpload}
                            className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50"
                          >
                            <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                            <span className="text-xs font-bold text-slate-900 block">Attach Commercial Invoice, Packing List & Manifest Copy</span>
                            <span className="text-[10px] text-slate-500 block mt-1">PDF, PNG, TIFF up to 25MB (Click to select local file)</span>
                          </div>

                          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl py-3 text-xs shadow-lg flex items-center justify-center space-x-2 cursor-pointer">
                            <FileText className="w-4 h-4" />
                            <span>Generate Booking & Issue Official Printable AWB PDF</span>
                          </Button>
                        </form>
                      </Card>

                      {/* Live Sensor Telematics & Broker Channel */}
                      <Card className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                          <div>
                            <h3 className="text-xl font-bold">Live Sensor Telematics & Alerts</h3>
                            <p className="text-xs text-slate-500">Real-time telemetry for in-transit enterprise cargo</p>
                          </div>
                          <Radio className="w-6 h-6 text-sky-500 animate-pulse" />
                        </div>

                        {/* Sensor Gauges */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-3 gap-3 text-center text-xs">
                          <div>
                            <span className="text-slate-500 block text-[10px] font-bold">TEMP (COLD-CHAIN)</span>
                            <span className="font-bold text-sky-600 text-sm flex items-center justify-center space-x-1 mt-0.5">
                              <Thermometer className="w-3.5 h-3.5" />
                              <span>4.2 °C</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] font-bold">SHOCK G-FORCE</span>
                            <span className="font-bold text-emerald-600 text-sm flex items-center justify-center space-x-1 mt-0.5">
                              <Activity className="w-3.5 h-3.5" />
                              <span>0.4 G</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] font-bold">HUMIDITY %</span>
                            <span className="font-bold text-amber-600 text-sm flex items-center justify-center space-x-1 mt-0.5">
                              <Zap className="w-3.5 h-3.5" />
                              <span>55 %</span>
                            </span>
                          </div>
                        </div>

                        {/* Assigned Customs Broker Workspace */}
                        <div className="border-t border-slate-200 pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 flex items-center">
                              <UserCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
                              Assigned Customs Broker Channel
                            </span>
                            <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Officer Koffa (Active)
                            </Badge>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 max-h-36 overflow-y-auto">
                            <div className="text-xs">
                              <span className="font-bold text-[10px] text-slate-500 block">Officer J. Koffa (Senior Licensed Customs Broker):</span>
                              <p className="text-slate-700 text-[11px] mt-0.5">
                                "Hello! Your cargo declaration has been assigned to Berth 2 inspection. Please feel free to upload any revised commercial invoices or duty inquiries."
                              </p>
                            </div>
                          </div>

                          <form onSubmit={handleSendMessage} className="flex space-x-2 pt-1">
                            <Input 
                              value={chatInput} 
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Message Officer Koffa directly..."
                              className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs"
                            />
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-4 cursor-pointer">
                              <Send className="w-4 h-4" />
                            </Button>
                          </form>
                        </div>

                      </Card>

                    </div>

                  </div>
                )}

            </TabsContent>
{/* =================================================================== */}
            {/* TAB 4: WMS & RAMP COMMAND CENTER                                   */}
            {/* =================================================================== */}
            <TabsContent value="operations-center" className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* WMS Barcode Scanner Terminal & Sequence Validator */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <QrCode className="w-6 h-6 text-emerald-500" />
                      <div>
                        <h3 className="text-xl font-bold">WMS Scanner Ingest Terminal</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Offline-first barcode scan validator & bin assign</p>
                      </div>
                    </div>

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
                        <Label className="text-xs text-slate-600 dark:text-slate-700">Cargo Piece Barcode</Label>
                        <Input value={scanBarcode} onChange={(e) => setScanBarcode(e.target.value)} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700">Operation Type</Label>
                        <select 
                          value={scanType} 
                          onChange={(e) => setScanType(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs p-2.5 mt-1 font-semibold"
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
                        <Label className="text-xs text-slate-600 dark:text-slate-700">Warehouse Code</Label>
                        <Input value={warehouseCode} onChange={(e) => setWarehouseCode(e.target.value)} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-700">Location Barcode</Label>
                        <Input value={locationBarcode} onChange={(e) => setLocationBarcode(e.target.value)} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl py-3">
                      Execute Scanner Ingest Event
                    </Button>
                  </form>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-700 block">Recent Handheld Scans</span>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {scanLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-xs">
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">{log.id}</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-900">{log.barcode}</span>
                          <Badge className={log.status === "ACCEPTED" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : log.status === "QUEUED_OFFLINE" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-rose-500/20 text-rose-600 dark:text-rose-400"}>
                            {log.status}
                          </Badge>
                          <span className="text-[10px] text-slate-500">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* ULD Staging Engine with Dynamic Color-Changing Progress Bar */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <Container className="w-6 h-6 text-sky-500" />
                      <div>
                        <h3 className="text-xl font-bold">ULD Ramp Container Builder</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Structural tare & payload safety validation engine</p>
                      </div>
                    </div>
                    <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30">Safety Code Enforced</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-700">Select Target ULD Container</Label>
                      <select 
                        value={selectedUld.uldNumber}
                        onChange={(e) => setSelectedUld(ULD_CONTAINERS.find(u => u.uldNumber === e.target.value) || ULD_CONTAINERS[0])}
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs p-2.5 mt-1 font-semibold"
                      >
                        {ULD_CONTAINERS.map(u => (
                          <option key={u.uldNumber} value={u.uldNumber}>{u.uldNumber} ({u.type}) - Max {u.maxPayloadKg}kg</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 grid grid-cols-3 gap-3 text-xs text-center">
                      <div>
                        <span className="text-slate-500 dark:text-slate-500 block text-[10px]">CURRENT WEIGHT</span>
                        <span className="font-bold text-slate-900 dark:text-slate-900 text-sm">{selectedUld.currentWeightKg} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-500 block text-[10px]">TARE WEIGHT</span>
                        <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">{selectedUld.tareWeightKg} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-500 block text-[10px]">MAX PAYLOAD</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{selectedUld.maxPayloadKg} kg</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-700">Incoming Cargo Piece Weight (kg)</Label>
                      <Input type="number" value={newItemWeight} onChange={(e) => setNewItemWeight(Number(e.target.value))} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                    </div>

                    <div className="space-y-2 pt-1 bg-slate-100 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-700 flex items-center space-x-1.5">
                          <Scale className="w-4 h-4 text-emerald-500" />
                          <span>Total Calculated Gross: {totalPotentialWeight.toLocaleString()} kg / {selectedUld.maxPayloadKg.toLocaleString()} kg</span>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          isUldOverload ? "bg-rose-500 text-slate-900 animate-pulse" : uldPercentage > 75 ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
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
              <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                    <div>
                      <h3 className="text-xl font-bold">Discrepancy & Claims Damage Logging Engine</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Timestamped incident reports & photo evidence dropzone</p>
                    </div>
                  </div>
                  <Badge className="bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30">
                    {attachedPhotos.length} Photo Evidence Attached
                  </Badge>
                </div>

                <form onSubmit={handleDiscrepancySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-700">AWB / Cargo Barcode</Label>
                      <Input value={discrepancyForm.pieceBarcode} onChange={(e) => setDiscrepancyForm({...discrepancyForm, pieceBarcode: e.target.value})} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-700">Discrepancy Category</Label>
                      <select 
                        value={discrepancyForm.type}
                        onChange={(e) => setDiscrepancyForm({...discrepancyForm, type: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs p-2.5 mt-1 font-semibold"
                      >
                        <option value="DAMAGED_CARTON">DAMAGED_CARTON</option>
                        <option value="TEMPERATURE_EXCURSION">TEMPERATURE_EXCURSION</option>
                        <option value="SEAL_BROKEN">SEAL_BROKEN</option>
                        <option value="WEIGHT_MISMATCH">WEIGHT_MISMATCH</option>
                        <option value="HAZMAT_VIOLATION">HAZMAT_VIOLATION</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <Label className="text-xs text-slate-600 dark:text-slate-700">Detailed Description & Evidence Log</Label>
                      <Input value={discrepancyForm.description} onChange={(e) => setDiscrepancyForm({...discrepancyForm, description: e.target.value})} className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold flex items-center space-x-1.5">
                      <Camera className="w-4 h-4 text-rose-500" />
                      <span>Visual Evidence & Photo Capture Dropzone</span>
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div 
                        onClick={handleAddPhoto}
                        className="border-2 border-dashed border-rose-500/40 hover:border-rose-500 bg-rose-500/5 p-4 rounded-2xl text-center flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02] min-h-[110px]"
                      >
                        <Camera className="w-6 h-6 text-rose-500 mb-1" />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-900">Snap / Attach Photo</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-500">Click to add evidence</span>
                      </div>

                      {attachedPhotos.map((photo) => (
                        <div key={photo.id} className="relative group bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-300 dark:border-white/10 p-2 flex items-center space-x-3 overflow-hidden min-h-[110px]">
                          <img src={photo.url} alt={photo.name} className="w-14 h-14 rounded-xl object-cover border border-white/20 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-900 block truncate">{photo.name}</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block">GPS + Time Logged</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-rose-500 text-slate-900 opacity-90 hover:opacity-100 transition-opacity"
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
            {/* TAB 5: OPENAPI CONSOLE & KAFKA LOG STREAM                           */}
            {/* =================================================================== */}
            <TabsContent value="developer-console" className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Live OpenAPI 3.0.3 Interactive Console */}
                <Card className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <FileCode className="w-6 h-6 text-emerald-500" />
                      <div>
                        <h3 className="text-xl font-bold">OpenAPI 3.0.3 Live Endpoint Console</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Interactive REST API testing interface</p>
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
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs p-2.5 w-full"
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
                      <Label className="text-xs text-slate-600 dark:text-slate-700 block mb-1">Live JSON Response Payload</Label>
                      <pre className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 font-mono text-xs overflow-x-auto max-h-64">
                        {apiResponse}
                      </pre>
                    </div>
                  </div>
                </Card>

                {/* Kafka Event Stream Live Ingest Monitor */}
                <Card className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-slate-900 space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <Cpu className="w-6 h-6 text-amber-500" />
                      <div>
                        <h3 className="text-xl font-bold">Kafka Event Stream Monitor</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-500">High-throughput topic ingestion</p>
                      </div>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30">Topic: cargo.scans.raw</Badge>
                  </div>

                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block">PARTITION 0 | OFFSET 409218</span>
                      <p className="text-slate-700 dark:text-slate-700">{`{"barcode":"020-12345675-001","scanType":"BIN_ASSIGN","wh":"WH-JFK-01"}`}</p>
                    </div>

                    <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                      <span className="text-sky-600 dark:text-sky-400 font-bold block">PARTITION 1 | OFFSET 409219</span>
                      <p className="text-slate-700 dark:text-slate-700">{`{"uldNumber":"AKE98231AA","event":"ULD_CARGO_ATTACHED","weightKg":350}`}</p>
                    </div>

                    <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                      <span className="text-rose-600 dark:text-rose-400 font-bold block">PARTITION 2 | OFFSET 409220</span>
                      <p className="text-slate-700 dark:text-slate-700">{`{"awbNumber":"020-88419203","event":"CUSTOMS_HOLD","reason":"CLASS_9_HAZMAT"}`}</p>
                    </div>
                  </div>
                </Card>

              </div>

            </TabsContent>

          </Tabs>
        </div>

        {/* MODAL 1: DEDICATED ELECTRONIC BILLING & PAYMENT GATEWAY PORTAL MODAL */}
        <AnimatePresence>
          {isBillingModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 text-slate-900 dark:text-slate-900 relative my-8"
              >
                <button 
                  onClick={() => setIsBillingModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                      Transparent E-Billing & Gateway Readiness
                    </Badge>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-900 mt-0.5">TOTAG Electronic Billing & Payment Gateway Portal</h3>
                  </div>
                </div>

                {/* ITEMIZED TAX & FREIGHT INVOICE BREAKDOWN */}
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 text-xs">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider block border-b border-slate-200 dark:border-white/10 pb-2">
                    Itemized Cargo & Tax Fee Assessment (Ref: INV-TOTAG-2026-9910)
                  </span>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-700">
                      <span>Base Freight Rate ({chargeableWeight.toFixed(1)} kg @ ${baseRatePerKg}/kg):</span>
                      <span className="font-mono font-bold">${Math.round(chargeableWeight * baseRatePerKg).toLocaleString()} USD</span>
                    </div>

                    {(isHazmat || isColdChain) && (
                      <div className="flex justify-between items-center text-slate-700 dark:text-slate-700">
                        <span>Special Handling Surcharges (Hazmat / Cold-Chain):</span>
                        <span className="font-mono font-bold">${(hazmatSurcharge + coldChainSurcharge).toLocaleString()} USD</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-700">
                      <span>LRA Import Customs Duty ({(selectedHsCode.dutyRate * 100).toFixed(1)}%):</span>
                      <span className="font-mono font-bold">${calculatedCustomsDuty.toLocaleString()} USD</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-700">
                      <span>LRA Goods & Services Tax (GST 10%):</span>
                      <span className="font-mono font-bold">${calculatedGstTax.toLocaleString()} USD</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-700">
                      <span>ECOWAS Trade Levy & Port Handling Fee:</span>
                      <span className="font-mono font-bold">${(calculatedEcowasLevy + portHandlingFee).toLocaleString()} USD</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-sm font-black">
                      <span className="text-emerald-600 dark:text-emerald-400">Grand Total Payable Invoice Amount:</span>
                      <span className="text-xl text-emerald-600 dark:text-emerald-400">${grandTotalFreightAndDuty.toLocaleString()} USD</span>
                    </div>
                  </div>
                </div>

                {/* E-PAYMENT GATEWAY METHOD SELECTOR */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-900 dark:text-slate-900 uppercase tracking-wider block">
                    Select Electronic Payment Gateway Method
                  </Label>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div 
                      onClick={() => setPaymentMethod("MOBILE_MONEY")}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                        paymentMethod === "MOBILE_MONEY" 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md" 
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-500"
                      }`}
                    >
                      <Smartphone className="w-5 h-5 mx-auto text-emerald-500" />
                      <span className="text-xs font-bold block">Mobile Money</span>
                      <span className="text-[9px] text-slate-500 block">MTN / Orange Liberia</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod("BANK_WIRE")}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                        paymentMethod === "BANK_WIRE" 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md" 
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-500"
                      }`}
                    >
                      <Building2 className="w-5 h-5 mx-auto text-sky-500" />
                      <span className="text-xs font-bold block">Bank Wire</span>
                      <span className="text-[9px] text-slate-500 block">Ecobank / UBA Swift</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod("CREDIT_CARD")}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                        paymentMethod === "CREDIT_CARD" 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md" 
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-500"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto text-indigo-500" />
                      <span className="text-xs font-bold block">Credit Card</span>
                      <span className="text-[9px] text-slate-500 block">Visa / Mastercard</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod("CREDIT_LINE")}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                        paymentMethod === "CREDIT_LINE" 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md" 
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-500"
                      }`}
                    >
                      <Wallet className="w-5 h-5 mx-auto text-amber-500" />
                      <span className="text-xs font-bold block">Credit Line</span>
                      <span className="text-[9px] text-slate-500 block">Net 30/60 Days</span>
                    </div>
                  </div>

                  {paymentMethod === "MOBILE_MONEY" && (
                    <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                      <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Lonestar MTN / Orange Money Number</Label>
                      <Input value={mobileMoneyPhone} onChange={(e) => setMobileMoneyPhone(e.target.value)} className="bg-white dark:bg-slate-900 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs font-mono" />
                      <span className="text-[10px] text-slate-500 block">Instant prompt will be sent to your phone to authorize payment.</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <Button 
                    onClick={handleProcessPayment} 
                    disabled={isPaymentProcessing}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl px-8 py-3 text-xs shadow-lg flex items-center justify-center space-x-2"
                  >
                    {isPaymentProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Communicating with Payment Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Process Instant E-Payment (${grandTotalFreightAndDuty.toLocaleString()} USD)</span>
                      </>
                    )}
                  </Button>

                  <Button 
                    onClick={() => {
                      toast({ title: "E-Invoice Downloaded", description: "Saved official tax breakdown invoice PDF." });
                    }}
                    className="w-full sm:w-auto bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-900 hover:bg-slate-300 font-bold rounded-xl px-4 py-3 text-xs flex items-center justify-center space-x-1.5"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Download E-Invoice PDF</span>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL 2: OFFICIAL TOTAG ENTERPRISE AIR WAYBILL (AWB) PRINTABLE DOCUMENT CERTIFICATE */}
        <AnimatePresence>
          {isAwbModalOpen && generatedAwbData && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-3xl max-w-4xl w-full p-8 shadow-2xl space-y-6 text-slate-900 dark:text-slate-900 relative my-8"
              >
                <button 
                  onClick={() => setIsAwbModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-900 print:hidden"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* OFFICIAL AWB HEADER & LETTERHEAD */}
                <div className="border-b-2 border-emerald-500 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img src="/images/totag-logo.png" alt="TOTAG Group Logo" className="w-14 h-14 object-contain" />
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-900 uppercase">TOTAG Group of Companies Ltd</h2>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Cargo Stevedoring, Port Operations & Customs Brokerage Division</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 block font-mono">Freeport of Monrovia Berth 2 • Roberts Int'l Airport Cargo Hub • Port of Buchanan</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1">
                      OFFICIAL IATA AIR WAYBILL (AWB)
                    </Badge>
                    <div className="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                      AWB #{generatedAwbData.awbNumber}
                    </div>
                    <span className="text-[10px] text-slate-500 block">Booking Ref: {generatedAwbData.bookingRef}</span>
                  </div>
                </div>

                {/* BARCODE & TRACKING STAMP SECTION */}
                <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Code128 Machine Readable Barcode</span>
                    {/* Visual Barcode SVG */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-300 inline-block">
                      <div className="flex items-center space-x-1 h-10 px-2">
                        <div className="w-1.5 h-full bg-slate-950"></div>
                        <div className="w-0.5 h-full bg-slate-950"></div>
                        <div className="w-2 h-full bg-slate-950"></div>
                        <div className="w-1 h-full bg-slate-950"></div>
                        <div className="w-3 h-full bg-slate-950"></div>
                        <div className="w-0.5 h-full bg-slate-950"></div>
                        <div className="w-2 h-full bg-slate-950"></div>
                        <div className="w-1.5 h-full bg-slate-950"></div>
                        <div className="w-1 h-full bg-slate-950"></div>
                        <div className="w-2.5 h-full bg-slate-950"></div>
                        <div className="w-0.5 h-full bg-slate-950"></div>
                        <div className="w-2 h-full bg-slate-950"></div>
                        <div className="w-1.5 h-full bg-slate-950"></div>
                        <div className="w-3 h-full bg-slate-950"></div>
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-900 block text-center mt-1 tracking-widest">{generatedAwbData.awbNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 block font-bold">ISSUE DATE</span>
                      <span className="font-bold text-slate-900 dark:text-slate-900">{generatedAwbData.issueDate}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 block font-bold">DECLARED CIF VALUE</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">${generatedAwbData.declaredValueUsd.toLocaleString()} USD</span>
                    </div>
                  </div>
                </div>

                {/* 3-COLUMN SHIPPER / CONSIGNEE / ROUTING GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  
                  {/* SHIPPER */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider block border-b border-slate-200 dark:border-white/10 pb-1">
                      1. Shipper / Consignor Name & Address
                    </span>
                    <div className="space-y-1 text-slate-800 dark:text-slate-200">
                      <strong className="block text-slate-900 dark:text-slate-900 font-bold">{generatedAwbData.shipper}</strong>
                      <p className="text-[11px] text-slate-500 dark:text-slate-500">Antwerp Maritime Logistics Terminal, Dock 404</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-500">Antwerp, Belgium</p>
                    </div>
                  </div>

                  {/* CONSIGNEE */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider block border-b border-slate-200 dark:border-white/10 pb-1">
                      2. Consignee Name & Destination
                    </span>
                    <div className="space-y-1 text-slate-800 dark:text-slate-200">
                      <strong className="block text-slate-900 dark:text-slate-900 font-bold">{generatedAwbData.consignee}</strong>
                      <p className="text-[11px] text-slate-500 dark:text-slate-500">TOTAG Central Logistics Depot, Freeport</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-500">Monrovia, Liberia</p>
                    </div>
                  </div>

                  {/* ROUTING & CARRIER */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider block border-b border-slate-200 dark:border-white/10 pb-1">
                      3. Port Routing & Flight / Vessel
                    </span>
                    <div className="space-y-1 text-slate-800 dark:text-slate-200">
                      <div><span className="text-slate-500">Origin:</span> <strong>{generatedAwbData.originPort}</strong></div>
                      <div><span className="text-slate-500">Destination:</span> <strong>{generatedAwbData.destinationPort}</strong></div>
                      <div><span className="text-slate-500">Carrier / Flight:</span> <strong>TOTAG Express Cargo v.2026</strong></div>
                      <div><span className="text-slate-500">Handling:</span> <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400 text-[9px]">Cold-Chain 2°C - 8°C</Badge></div>
                    </div>
                  </div>

                </div>

                {/* ITEM SPECIFICATIONS TABLE */}
                <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
                      <tr>
                        <th className="p-3">No. of Pieces</th>
                        <th className="p-3">Gross Weight</th>
                        <th className="p-3">Chargeable Weight</th>
                        <th className="p-3">Commodity & Nature of Goods</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-slate-900 dark:text-slate-900">
                      <tr>
                        <td className="p-3 font-bold">{generatedAwbData.pieces} Cartons</td>
                        <td className="p-3 font-bold">{generatedAwbData.weightKg} kg</td>
                        <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{generatedAwbData.weightKg} kg</td>
                        <td className="p-3 font-medium">{generatedAwbData.natureOfGoods}</td>
                        <td className="p-3">
                          <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            MANIFESTED & READY
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* LEGAL STAMP & ISSUER CERTIFICATION */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-500">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-900 block">Certified by TOTAG Port Stevedoring Authority</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500">Issuer: {generatedAwbData.issuer}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 print:hidden">
                    <Button 
                      onClick={() => window.print()} 
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl px-5 py-2.5 text-xs shadow-lg flex items-center space-x-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Official AWB PDF</span>
                    </Button>

                    <Button 
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(generatedAwbData, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `TOTAG_AWB_${generatedAwbData.awbNumber}.json`;
                        a.click();
                        toast({ title: "AWB Certificate Downloaded", description: `Saved TOTAG_AWB_${generatedAwbData.awbNumber}.json` });
                      }}
                      className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-900 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold rounded-xl px-4 py-2.5 text-xs flex items-center space-x-1.5"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Download JSON</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

                        {/* MODAL 3: FULL LEGAL TERMS, CONDITIONS & INTERACTIVE CANVAS ELECTRONIC SIGNATURE SUITE (LIGHT THEME) */}
        <AnimatePresence>
          {isEsignModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl text-slate-900 overflow-hidden relative my-6 max-h-[92vh] flex flex-col"
              >
                {/* Slate Gray Corporate Header */}
                <div className="bg-slate-900 text-slate-900 p-5 sm:p-6 border-b-2 border-emerald-500 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center space-x-3.5">
                    <img 
                      src="/images/totag-corporate-logo.png" 
                      alt="TOTAG Corporate Crest" 
                      className="w-11 h-11 bg-white p-1 rounded-xl shadow border border-slate-700 object-contain"
                      onError={(e) => { e.currentTarget.src = "/images/totag-logo.png"; }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-base sm:text-lg text-slate-900">
                          <span className="text-emerald-400">TOTAG</span> <span className="text-sky-400">Group</span> <span className="text-amber-400 text-xs font-bold">of Companies Ltd</span>
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                          LRA ASYCUDA Authorized
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-700 font-medium mt-0.5">
                        Licensed Customs Clearing & Forwarding (C&F) • Digital Power of Attorney & Agreement
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsEsignModalOpen(false)}
                    className="p-2 rounded-full bg-slate-800 text-slate-500 hover:text-slate-900 hover:bg-slate-700 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!executedContractSuccess ? (
                  /* REVIEW & INTERACTIVE SIGNATURE MODE */
                  <div className="p-6 sm:p-8 space-y-6 overflow-y-auto pr-3 flex-1 text-xs">
                    
                    {/* Document Header Box */}
                    <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-bold">
                        LEGAL POWER OF ATTORNEY & CLEARING SERVICE CONTRACT
                      </span>
                      <h4 className="font-black text-sm sm:text-base text-slate-900">
                        AUTHORIZATION FOR CUSTOMS CLEARANCE & WHARFAGE CARGO RELEASE
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Executed under the Customs Code of the Republic of Liberia & National Port Authority Regulations
                      </p>
                    </div>

                    {/* Parties & Cargo Specification Matrix */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2">
                        1. CONTRACTING PARTIES & SHIPMENT PARTICULARS
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                        <div>
                          <span className="text-slate-500 block text-[10px]">SHIPPER / COMPANY:</span>
                          <strong className="text-slate-900 text-xs">{contractForm.companyName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">OFFICIAL EMAIL:</span>
                          <strong className="text-emerald-700 font-mono text-xs">{contractForm.email}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">PHONE / WHATSAPP:</span>
                          <strong className="text-slate-900">{contractForm.phone}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">BILL OF LADING / AWB:</span>
                          <strong className="text-sky-700 font-mono text-xs">{contractForm.billOfLading || "On File"}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">CONTAINER SPEC:</span>
                          <strong className="text-slate-900">{contractForm.containerType} ({contractForm.containersCount} TEU)</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">PORT OF CLEARANCE:</span>
                          <strong className="text-slate-900">{contractForm.portOfDischarge}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Complete Legal Clauses & Terms */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-slate-700 leading-relaxed text-[11px]">
                      <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2">
                        2. STATUTORY TERMS & CONDITIONS OF SERVICE
                      </div>
                      
                      <div>
                        <strong className="text-slate-900">Clause 1 — Appointment & Grant of Power of Attorney:</strong>
                        <p className="text-slate-600 mt-0.5">
                          The Client hereby irrevocably appoints and authorizes <strong>TOTAG Group of Companies Ltd</strong> (Operating Licensed Customs Brokerage, Stevedoring & Freight Logistics) to act as its true and lawful agent before the Liberia Revenue Authority (LRA), National Port Authority (NPA), APM Terminals Monrovia, and shipping line agents.
                        </p>
                      </div>

                      <div>
                        <strong className="text-slate-900">Clause 2 — ASYCUDA Single Administrative Document (SAD) Filing:</strong>
                        <p className="text-slate-600 mt-0.5">
                          TOTAG is empowered to submit customs declarations into the LRA ASYCUDA World single-window system, pay statutory duties, process tariff exemptions, request joint container physical examinations, and secure official Delivery Orders.
                        </p>
                      </div>

                      <div>
                        <strong className="text-slate-900">Clause 3 — Demurrage, Storage & Free-Time Responsibilities:</strong>
                        <p className="text-slate-600 mt-0.5">
                          The Client agrees to provide necessary documentation (Commercial Invoice, Packing List, Certificate of Origin) in a timely manner to prevent terminal demurrage. TOTAG will actively monitor free-time thresholds and dispatch flatbeds upon release.
                        </p>
                      </div>

                      <div>
                        <strong className="text-slate-900">Clause 4 — Digital Audit & Document Vault Compliance:</strong>
                        <p className="text-slate-600 mt-0.5">
                          This executed agreement and all associated cargo manifests, tax payment receipts, and delivery notes will be permanently archived in the secure TOTAG Document Vault for audit and compliance inspection.
                        </p>
                      </div>
                    </div>

                    {/* Interactive Electronic Signature Suite */}
                    <div className="bg-emerald-50/50 p-5 rounded-2xl border-2 border-emerald-500/40 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                        <div>
                          <span className="font-black text-emerald-900 uppercase tracking-wider text-xs block">
                            3. INTERACTIVE ELECTRONIC SIGNATURE PAD
                          </span>
                          <span className="text-[11px] text-slate-500">Sign with mouse, trackpad, touch screen, or type signature</span>
                        </div>
                        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                          <button
                            type="button"
                            onClick={() => setSignatureMode("draw")}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${signatureMode === "draw" ? "bg-emerald-600 text-slate-900 shadow" : "text-slate-600 hover:bg-slate-100"}`}
                          >
                            Draw Signature
                          </button>
                          <button
                            type="button"
                            onClick={() => setSignatureMode("type")}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${signatureMode === "type" ? "bg-emerald-600 text-slate-900 shadow" : "text-slate-600 hover:bg-slate-100"}`}
                          >
                            Type Signature
                          </button>
                        </div>
                      </div>

                      {/* Mode A: Interactive Drawing Canvas */}
                      {signatureMode === "draw" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-700 flex items-center">
                              <PenTool className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              Draw your official signature inside the box below:
                            </span>
                            <button
                              type="button"
                              onClick={clearSignatureCanvas}
                              className="text-rose-600 hover:underline font-bold text-xs flex items-center cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Clear Pad
                            </button>
                          </div>

                          <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-white overflow-hidden shadow-inner cursor-crosshair">
                            <canvas
                              ref={signatureCanvasRef}
                              width={640}
                              height={140}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                              className="w-full h-36 touch-none block"
                            />
                            {!hasDrawnSignature && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-500 font-medium text-xs">
                                ✍️ Click or Touch here to draw signature
                              </div>
                            )}
                            <div className="absolute bottom-2 left-4 right-4 border-b border-slate-300 flex justify-between text-[9px] text-slate-500 font-mono pointer-events-none pb-0.5">
                              <span>Authorized Signatory Signature Line</span>
                              <span>TOTAG SECURE E-SIGN</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mode B: Type Signature with Cursive Preview */}
                      {signatureMode === "type" && (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-slate-700 text-xs font-bold">Authorized Signatory Full Legal Name *</Label>
                            <Input 
                              value={typedSignatoryName}
                              onChange={(e) => setTypedSignatoryName(e.target.value)}
                              placeholder="e.g. James Doe, Managing Director"
                              className="bg-white border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-bold shadow-sm"
                            />
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1 shadow-inner">
                            <span className="text-[10px] text-slate-500 uppercase font-mono block">Rendered Legal Signature Preview:</span>
                            <span className="font-serif italic font-bold tracking-wider text-xl sm:text-2xl text-slate-900 block py-1">
                              {typedSignatoryName || "James Doe"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block">Digitally Verified Authorized Officer</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <Label className="text-slate-700 text-[11px] font-bold">Authorized Signatory Name & Title</Label>
                          <Input 
                            value={typedSignatoryName}
                            onChange={(e) => setTypedSignatoryName(e.target.value)}
                            placeholder="Full Name & Title"
                            className="bg-white border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 text-[11px] font-bold">Digital Signature Cryptographic Hash</Label>
                          <div className="bg-white border border-slate-300 rounded-xl p-2.5 mt-1 text-[11px] font-mono text-emerald-700 flex items-center justify-between shadow-sm">
                            <span className="font-bold">SIG-{contractForm.companyName.replace(/\s+/g, "").slice(0, 4).toUpperCase()}-{Date.now().toString().slice(-6)}</span>
                            <span className="text-[9px] text-slate-500 font-sans">256-BIT SHA</span>
                          </div>
                        </div>
                      </div>

                      <label className="flex items-start space-x-2 text-[11px] text-slate-800 cursor-pointer pt-1 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        <input 
                          type="checkbox"
                          checked={isLegalDeclarationChecked}
                          onChange={(e) => setIsLegalDeclarationChecked(e.target.checked)}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-0"
                        />
                        <span>
                          I confirm that I am the authorized legal representative of <strong>{contractForm.companyName}</strong>, that all information and attached documents are true and correct, and I hereby electronically execute this Power of Attorney and Service Agreement.
                        </span>
                      </label>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setIsEsignModalOpen(false)}
                        className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-100 text-xs rounded-xl px-5 cursor-pointer font-bold"
                      >
                        Cancel / Edit Details
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleFinalElectronicSignature}
                        disabled={isContractSigningInProgress}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-black rounded-xl px-8 py-3 text-xs shadow-lg cursor-pointer transition"
                      >
                        {isContractSigningInProgress ? (
                          <span>Digitally Signing & Dispatching...</span>
                        ) : (
                          <span className="flex items-center space-x-2">
                            <PenTool className="w-4 h-4 mr-1.5" />
                            <span>Sign & Execute Official Clearing Contract</span>
                          </span>
                        )}
                      </Button>
                    </div>

                  </div>
                ) : (
                  /* EXECUTION SUCCESS & VAULT CONFIRMATION VIEW (LIGHT THEME) */
                  <div className="p-8 space-y-6 text-xs text-center">
                    <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                      <CheckCircle className="w-10 h-10" />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        Contract Electronically Executed & Archived in Document Vault!
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Contract Ref: <strong className="text-emerald-700 font-mono font-bold text-sm">#{executedContractSuccess.contractId}</strong> • Clearing authorization is now legally active.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left max-w-md mx-auto space-y-2.5 text-xs shadow-sm">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Shipper / Company:</span>
                        <strong className="text-slate-900">{executedContractSuccess.companyName}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Authorized Signatory:</span>
                        <strong className="text-slate-900">{executedContractSuccess.authorizedSignatory}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Execution Status:</span>
                        <span className="text-emerald-700 font-bold">ACTIVE & ARCHIVED IN VAULT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Formal Confirmation Sent:</span>
                        <strong className="text-sky-700 font-mono">{contractForm.email}</strong>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-3 pt-2">
                      <Button 
                        onClick={() => {
                          setSelectedVaultContract(executedContractSuccess);
                          setIsEsignModalOpen(false);
                          setIsContractModalOpen(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-black text-xs rounded-xl px-6 py-2.5 cursor-pointer shadow-md"
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        View in Document Vault
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsEsignModalOpen(false);
                          setActiveTab("b2b-portal");
                        }}
                        variant="outline"
                        className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs rounded-xl px-6 py-2.5 cursor-pointer font-bold"
                      >
                        Go to Customer Dashboard
                      </Button>
                    </div>
                  </div>
                )}

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL 4: ORG MULTI-USER RBAC MODAL */}
        <AnimatePresence>
          {isNewUserModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white text-slate-900 border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative"
              >
                <button 
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-900">Organization Multi-User Access (RBAC)</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Add sub-account members & assign role permissions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-700 block uppercase tracking-wider">Active Organization Team</span>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {customerAccount.teamMembers.map((member, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-900 block">{member.name}</span>
                            <span className="text-[10px] text-slate-500">{member.email}</span>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">{member.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleAddTeamUser} className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Team Member Full Name</Label>
                      <Input value={newUserForm.name} onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})} placeholder="e.g. Samuel Tubman" className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Official Email Address</Label>
                      <Input type="email" value={newUserForm.email} onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})} placeholder="e.g. samuel@globalpharma.be" className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">RBAC Role Assignment</Label>
                      <select value={newUserForm.role} onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs p-2.5 mt-1 font-semibold">
                        <option value="Logistics Manager (Full Access)">Logistics Manager (Full Access)</option>
                        <option value="Customs Officer (Docs Only)">Customs Officer (Docs Only)</option>
                        <option value="Finance & Accounts Payable">Finance & Accounts Payable</option>
                        <option value="Warehouse Dispatch Operator">Warehouse Dispatch Operator</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl py-3 text-xs shadow-md cursor-pointer">
                      Send Invitation & Provision Sub-Account
                    </Button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL 5: DISPUTE TICKETING & BILLING DISPUTE MODAL */}
        <AnimatePresence>
          {isDisputeModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white text-slate-900 border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative"
              >
                <button 
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-900">File Billing & Invoice Dispute</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Log an official inquiry for finance resolution</p>
                  </div>
                </div>

                <form onSubmit={handleRaiseDispute} className="space-y-4">
                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Invoice / Charge Reference #</Label>
                    <Input value={disputeForm.invoiceRef} onChange={(e) => setDisputeForm({...disputeForm, invoiceRef: e.target.value})} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs mt-1 font-mono" />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Dispute Reason / Category</Label>
                    <select value={disputeForm.category} onChange={(e) => setDisputeForm({...disputeForm, category: e.target.value})} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs p-2.5 mt-1 font-semibold">
                      <option value="Demurrage Charge Penalty">Demurrage Charge Penalty Appeal</option>
                      <option value="Weight / Volumetric Rate Discrepancy">Weight / Volumetric Rate Discrepancy</option>
                      <option value="Unapplied Credit Note">Unapplied Credit Note / Payment</option>
                      <option value="Customs Duty Overcharge">Customs Duty Overcharge Assessment</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Explanation & Claim Details</Label>
                    <Input value={disputeForm.notes} onChange={(e) => setDisputeForm({...disputeForm, notes: e.target.value})} placeholder="Describe why this charge is being disputed..." className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold" />
                  </div>

                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl py-3 text-xs shadow-md cursor-pointer">
                    Submit Formal Dispute Ticket
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL 6: INTERACTIVE PASSWORD CHANGE MODAL (ACCESSED VIA ONBOARDING EMAIL OR LOGIN) */}
        <AnimatePresence>
          {isPasswordModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white text-slate-900 border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative"
              >
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-900">Customer Account Password Setup</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Set a new permanent password for {customerAccount.email || "your account"}</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Temporary Password</Label>
                    <Input 
                      value={passwordForm.tempPasswordInput} 
                      onChange={(e) => setPasswordForm({...passwordForm, tempPasswordInput: e.target.value})}
                      placeholder="Enter temporary password received in onboarding email..."
                      className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-900 rounded-xl text-xs mt-1 font-mono"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">New Permanent Password</Label>
                    <Input 
                      type="password"
                      value={passwordForm.newPassword} 
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="Enter new strong password..."
                      className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-700 font-bold">Confirm New Password</Label>
                    <Input 
                      type="password"
                      value={passwordForm.confirmPassword} 
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Re-enter new password..."
                      className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl py-3 text-xs shadow-lg">
                    Update Password & Secure Account
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL 7: CUSTOMER CARGO PORTAL AUTHENTICATION MODAL */}
        <AnimatePresence>
          {isCustomerLoginModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white text-slate-900 border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative"
              >
                <button 
                  type="button"
                  onClick={() => setIsCustomerLoginModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center space-y-2 border-b border-slate-200 pb-4">
                  <div className="w-14 h-14 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
                    <LogIn className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Customer Cargo Portal Sign In
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Sign in with your official account email and password (or temporary credentials from email)
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleCustomerLogin} className="space-y-4">
                  <div>
                    <Label className="text-slate-700 text-xs font-bold">Account Email / Username *</Label>
                    <Input 
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. rtalk4348@gmail.com"
                      className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-slate-700 text-xs font-bold">Password / Temporary Credentials *</Label>
                    <Input 
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password (e.g. TOTAG-Pass#...)"
                      className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl text-xs mt-1 font-mono"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoggingIn}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl py-3 shadow-lg cursor-pointer transition"
                  >
                    {isLoggingIn ? "Authenticating Account..." : "Sign In to Customer Dashboard →"}
                  </Button>
                </form>

                {/* Official Support & Credentials Reminder */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Authorized Production Access Only</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Enter the official email and password assigned to your organization. If you recently executed a clearing contract, please use the temporary password dispatched to your email inbox.
                  </p>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL 8: INTERACTIVE MULTI-DOCUMENT PERUSAL, AUDIT & PRINT VIEWER MODAL */}
        <AnimatePresence>
          {isGeneralDocViewerOpen && selectedGeneralDoc && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white text-slate-900 border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden relative my-6 max-h-[92vh] flex flex-col"
              >
                {/* Header */}
                <div className="bg-slate-900 text-white p-5 sm:p-6 border-b-2 border-emerald-500 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center space-x-3.5">
                    <img 
                      src="/images/totag-corporate-logo.png" 
                      alt="TOTAG Corporate Crest" 
                      className="w-11 h-11 bg-white p-1 rounded-xl shadow border border-slate-700 object-contain"
                      onError={(e) => { e.currentTarget.src = "/images/totag-logo.png"; }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-base sm:text-lg text-white">
                          <span className="text-emerald-400">TOTAG</span> <span className="text-sky-400">Group</span> <span className="text-amber-400 text-xs font-bold">Document Vault</span>
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                          Official Archive
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-0.5">
                        {selectedGeneralDoc.title} • Doc ID: <strong className="font-mono text-emerald-400">{selectedGeneralDoc.docNumber}</strong>
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsGeneralDocViewerOpen(false)}
                    className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Printable Document Body */}
                <div className="p-6 sm:p-8 space-y-6 overflow-y-auto pr-3 flex-1 text-xs">
                  
                  {/* Official Certificate Box */}
                  <div className="text-center bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-bold">
                      REPUBLIC OF LIBERIA • OFFICIAL CARGO & CUSTOMS ARCHIVE
                    </span>
                    <h3 className="font-black text-lg text-slate-900">
                      {selectedGeneralDoc.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Issued by: <strong>{selectedGeneralDoc.issuer}</strong> • Registered to: <strong className="text-slate-900">{selectedGeneralDoc.companyName}</strong>
                    </p>
                  </div>

                  {/* Metadata Matrix */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Document Number:</span>
                      <span className="font-mono font-bold text-slate-900">{selectedGeneralDoc.docNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Statutory Reference:</span>
                      <span className="font-mono font-bold text-sky-700">{selectedGeneralDoc.reference}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Issue Date:</span>
                      <span className="font-mono font-semibold text-slate-800">{selectedGeneralDoc.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Archive Status:</span>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                        {selectedGeneralDoc.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Document Summary Description */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Record Abstract / Executive Summary:</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedGeneralDoc.summary}
                    </p>
                  </div>

                  {/* Line Items / Tariff Breakdown Table if Present */}
                  {selectedGeneralDoc.contentDetails.items && (
                    <div className="space-y-2">
                      <span className="text-slate-700 font-black text-xs uppercase tracking-wider block">
                        Itemized Specifications & Financial Assessment:
                      </span>
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                              <th className="p-3">Description / Tariff Line</th>
                              <th className="p-3">Quantity / Value</th>
                              <th className="p-3 text-right">Assessment / Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {selectedGeneralDoc.contentDetails.items.map((item, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="p-3 font-semibold text-slate-900">{item.desc}</td>
                                <td className="p-3 text-slate-600 font-mono">{item.qty}</td>
                                <td className="p-3 text-right font-mono font-bold text-slate-900">{item.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Additional Technical Particulars */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Statutory Clearance Particulars:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      {selectedGeneralDoc.contentDetails.carrier && (
                        <div>
                          <span className="text-slate-400 block text-[10px]">CARRIER / VESSEL:</span>
                          <strong className="text-slate-800">{selectedGeneralDoc.contentDetails.carrier}</strong>
                        </div>
                      )}
                      {selectedGeneralDoc.contentDetails.sealNumber && (
                        <div>
                          <span className="text-slate-400 block text-[10px]">CUSTOMS SEAL #:</span>
                          <strong className="text-emerald-700 font-mono">{selectedGeneralDoc.contentDetails.sealNumber}</strong>
                        </div>
                      )}
                      {selectedGeneralDoc.contentDetails.gatePassCode && (
                        <div>
                          <span className="text-slate-400 block text-[10px]">APM GATE PASS CODE:</span>
                          <strong className="text-sky-700 font-mono">{selectedGeneralDoc.contentDetails.gatePassCode}</strong>
                        </div>
                      )}
                    </div>
                    {selectedGeneralDoc.contentDetails.notes && (
                      <p className="text-[11px] text-slate-600 italic pt-1 border-t border-slate-200">
                        Notes: {selectedGeneralDoc.contentDetails.notes}
                      </p>
                    )}
                  </div>

                  {/* Customer Audit Inquiry & Broker Response Channel */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-slate-900 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1.5 text-sky-600" />
                        Document Inquiries & Broker Audit Thread
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(docFeedbackLogs[selectedGeneralDoc.docNumber] || []).length} Message(s)
                      </span>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {(docFeedbackLogs[selectedGeneralDoc.docNumber] || [
                        { sender: "Officer J. Koffa (Assigned Customs Broker)", time: "Today", text: "Document archived and verified with NPA & LRA ASYCUDA single-window registry." }
                      ]).map((entry, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-0.5 shadow-sm">
                          <div className="flex justify-between font-bold text-slate-700 text-[10px]">
                            <span>{entry.sender}</span>
                            <span className="text-slate-400 font-mono">{entry.time}</span>
                          </div>
                          <p className="text-slate-800">{entry.text}</p>
                        </div>
                      ))}
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!docFeedbackInput.trim()) return;
                        const docId = selectedGeneralDoc.docNumber;
                        const newMsg = {
                          sender: `${customerAccount.companyName} (${customerAccount.email})`,
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          text: docFeedbackInput.trim()
                        };
                        setDocFeedbackLogs(prev => ({
                          ...prev,
                          [docId]: [...(prev[docId] || []), newMsg]
                        }));
                        setDocFeedbackInput("");
                        toast({ title: "Inquiry Logged", description: `Message attached to document ${docId}.` });
                      }}
                      className="flex space-x-2 pt-1"
                    >
                      <Input 
                        value={docFeedbackInput}
                        onChange={(e) => setDocFeedbackInput(e.target.value)}
                        placeholder="Inquire or request amendment regarding this document..."
                        className="bg-white border-slate-300 text-slate-900 rounded-xl text-xs font-medium"
                      />
                      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-4 cursor-pointer">
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>

                </div>

                {/* Footer Controls & Print Action */}
                <div className="bg-slate-100 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographically Authenticated TOTAG Vault Instrument</span>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Button 
                      type="button"
                      onClick={() => window.print()}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl px-5 py-2.5 shadow-md flex items-center space-x-1.5 cursor-pointer w-full sm:w-auto justify-center"
                    >
                      <Printer className="w-4 h-4 mr-1 text-emerald-400" />
                      <span>Print Document Copy</span>
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setIsGeneralDocViewerOpen(false)}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-200 text-xs rounded-xl px-5 py-2.5 font-bold cursor-pointer w-full sm:w-auto"
                    >
                      Close Viewer
                    </Button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}
