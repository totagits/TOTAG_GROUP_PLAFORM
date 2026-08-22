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
  Smartphone
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
      <Label className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{label}</Label>
      <div className="relative mt-1">
        <Input 
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Type country (e.g. China, Belgium, Liberia)..."
          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs pr-8 font-medium focus:ring-2 focus:ring-emerald-500/50 transition-all"
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
            <div className="p-2 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex justify-between items-center">
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
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 block truncate">
                        {port.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        {port.country} • {port.city}
                      </span>
                    </div>
                  </div>

                  <Badge className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 font-mono text-[10px] ml-2 flex-shrink-0">
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

export default function CargoPage() {
  const { toast } = useToast();

  // Active Main Workspace Tab
  const [activeTab, setActiveTab] = useState("public-discovery");

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

  // AUTOMATED CONTRACT EXECUTION & DUAL ACCOUNT DISPATCH LOGIC
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
    if (!contractForm.isPoaAgreed) {
      toast({ title: "Authorization Required", description: "You must agree to the TOTAG Power of Attorney clearing terms.", variant: "destructive" });
      return;
    }

    const contractId = `TOTAG-POA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toLocaleString();

    const isNewCust = !contractForm.isExistingAccount;

    if (isNewCust) {
      // NEW CUSTOMER: CREATE ACCOUNT & GENERATE TEMPORARY CREDENTIALS
      const tempPass = `TOTAG-Pass#${Math.floor(100000 + Math.random() * 900000)}`;
      
      setCustomerAccount(prev => ({
        ...prev,
        isLoggedIn: true,
        companyName: contractForm.companyName,
        tinNumber: contractForm.tinNumber || "LRA-TIN-PENDING",
        email: contractForm.email,
        phone: contractForm.phone,
        accountType: "Verified Enterprise Shipper",
        isPasswordChanged: false
      }));

      setB2bBookingForm(prev => ({ ...prev, shipper: contractForm.companyName }));

      const emailPayload = {
        type: "NEW_CUSTOMER_ONBOARDING" as const,
        sent: true,
        recipientEmail: contractForm.email,
        recipientPhone: contractForm.phone,
        companyName: contractForm.companyName,
        tempPassword: tempPass,
        contractId: contractId,
        signatory: contractForm.authorizedSignatory,
        timestamp: now
      };

      setOnboardingEmail(emailPayload);
      setPasswordForm({ ...passwordForm, tempPasswordInput: tempPass });
      setSignedContractReceipt({ 
        id: contractId, 
        date: now, 
        isNewCustomer: true,
        companyName: contractForm.companyName,
        email: contractForm.email
      });

      setIsEmailDrawerOpen(true);

      toast({ 
        title: "Account Created & Onboarding Email Sent!", 
        description: `Dispatched welcome instructions and temporary login password to ${contractForm.email}.` 
      });

    } else {
      // EXISTING CUSTOMER: THANK CUSTOMER & ATTACH CONTRACT TO EXISTING ACCOUNT
      setCustomerAccount(prev => ({
        ...prev,
        isLoggedIn: true,
        companyName: contractForm.companyName,
        tinNumber: contractForm.tinNumber || "LRA-TIN-VERIFIED",
        email: contractForm.email,
        phone: contractForm.phone,
        accountType: "Verified Enterprise Shipper",
        isPasswordChanged: true
      }));

      setB2bBookingForm(prev => ({ ...prev, shipper: contractForm.companyName }));

      const emailPayload = {
        type: "EXISTING_CUSTOMER_CONTRACT" as const,
        sent: true,
        recipientEmail: contractForm.email,
        recipientPhone: contractForm.phone,
        companyName: contractForm.companyName,
        contractId: contractId,
        signatory: contractForm.authorizedSignatory,
        timestamp: now
      };

      setOnboardingEmail(emailPayload);
      setSignedContractReceipt({ 
        id: contractId, 
        date: now, 
        isNewCustomer: false,
        companyName: contractForm.companyName,
        email: contractForm.email
      });

      setIsEmailDrawerOpen(true);

      toast({ 
        title: "Thank You for Doing Business with TOTAG Group!", 
        description: `Contract ${contractId} has been successfully logged under your active account. Confirmation sent to ${contractForm.email}.` 
      });
    }
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast({ title: "Password Too Short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Password Mismatch", description: "New password and confirmation do not match.", variant: "destructive" });
      return;
    }

    setCustomerAccount(prev => ({
      ...prev,
      isPasswordChanged: true
    }));
    setIsPasswordModalOpen(false);
    toast({ 
      title: "Password Updated Successfully!", 
      description: "Your account password is now secured. Use your new password for future logins." 
    });
  };

  const handleAddTeamUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;
    setCustomerAccount(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: newUserForm.name, email: newUserForm.email, role: newUserForm.role }]
    }));
    setIsNewUserModalOpen(false);
    setNewUserForm({ name: "", email: "", role: "Customs Officer" });
    toast({ title: "Team Member Added", description: `Assigned ${newUserForm.role} permissions to ${newUserForm.email}.` });
  };

  const handleRaiseDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisputeModalOpen(false);
    toast({ title: "Dispute Ticket Submitted", description: `Logged ticket for ${disputeForm.invoiceRef}. Assigned to Accounts Manager.` });
  };

  // REAL OS NATIVE FILE PICKER TRIGGERS & SELECTION HANDLERS
  const handleTriggerBlUpload = () => {
    if (blFileInputRef.current) {
      blFileInputRef.current.click();
    }
  };

  const handleTriggerPackingListUpload = () => {
    if (packingListFileInputRef.current) {
      packingListFileInputRef.current.click();
    }
  };

  const handleBlFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      setUploadedBlCopy({ name: file.name, size: formattedSize, status: "VERIFIED" });
      toast({ title: "Bill of Lading File Selected!", description: `Attached ${file.name} (${formattedSize}) to C&F contract.` });
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors">
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
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Globe className="w-4 h-4" />
                  <span>Public Discovery</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="cf-customs-hub" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>C&F & Customs Hub</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="b2b-portal" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>B2B Client Portal</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="operations-center" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <HardHat className="w-4 h-4" />
                  <span>WMS & Ramp Command</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="developer-console" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-slate-950 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
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
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentic Port Operations & Cargo Gallery</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">High-definition maritime logistics photography from TOTAG port operations</p>
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
                        <span className="text-xs font-black text-white truncate block">{item.title}</span>
                        <span className="text-[8px] text-slate-300 font-semibold block mt-0.5 group-hover:text-amber-400 transition-colors">Click for Full-Res HD ↗</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
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
                          <span className="text-2xl font-black text-slate-900 dark:text-white">{chargeableWeight.toFixed(1)} kg</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">(Volumetric: {volumetricWeight.toFixed(1)}kg)</span>
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
            {/* TAB 2: C&F AGENT & CUSTOMS BROKERAGE PUBLIC INTAKE HUB               */}
            {/* =================================================================== */}
            <TabsContent value="cf-customs-hub" className="space-y-8">
              
              {/* CLEAN PUBLIC HUB HEADER BANNER */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-xl text-white">TOTAG C&F Stevedoring & Customs Brokerage Hub</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                        LRA Licensed Customs Agent
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl">
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
              <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
                      <FileSignature className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Express Interest & Sign C&F Clearing Service Contract</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Provide contact details, container specifications & execute digital Power of Attorney</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                    Public Customer Intake
                  </Badge>
                </div>

                <form onSubmit={handleExecuteContract} className="space-y-6">

                  {/* ACCOUNT STATUS RADIO SELECTOR */}
                  <div className="bg-slate-100 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
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
                        <span className="text-slate-900 dark:text-white">New Customer (Auto-Create Account)</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="customerType" 
                          checked={contractForm.isExistingAccount} 
                          onChange={() => setContractForm({...contractForm, isExistingAccount: true})}
                          className="text-emerald-500 focus:ring-0" 
                        />
                        <span className="text-slate-900 dark:text-white">Existing Account Holder</span>
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
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Company / Enterprise Name *</Label>
                        <Input 
                          value={contractForm.companyName} 
                          onChange={(e) => setContractForm({...contractForm, companyName: e.target.value})} 
                          placeholder="e.g. Global Pharma Freight NV"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Official Contact Email *</Label>
                        <div className="relative mt-1">
                          <Input 
                            type="email"
                            value={contractForm.email} 
                            onChange={(e) => setContractForm({...contractForm, email: e.target.value})} 
                            placeholder="e.g. customs@globalpharma.be"
                            className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs pl-8 font-semibold" 
                          />
                          <Mail className="w-3.5 h-3.5 text-emerald-500 absolute left-2.5 top-2.5" />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Onboarding instructions sent to this email</span>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Phone / WhatsApp Contact *</Label>
                        <div className="relative mt-1">
                          <Input 
                            value={contractForm.phone} 
                            onChange={(e) => setContractForm({...contractForm, phone: e.target.value})} 
                            placeholder="e.g. +231 77 000 1122"
                            className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs pl-8 font-semibold" 
                          />
                          <Phone className="w-3.5 h-3.5 text-emerald-500 absolute left-2.5 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Company Tax ID / LRA TIN</Label>
                        <Input 
                          value={contractForm.tinNumber} 
                          onChange={(e) => setContractForm({...contractForm, tinNumber: e.target.value})} 
                          placeholder="e.g. LRA-TIN-9940218"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-mono" 
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
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Bill of Lading / AWB Reference #</Label>
                        <Input 
                          value={contractForm.blNumber} 
                          onChange={(e) => setContractForm({...contractForm, blNumber: e.target.value})} 
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" 
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Container Type / Specification</Label>
                        <select 
                          value={contractForm.containerType}
                          onChange={(e) => setContractForm({...contractForm, containerType: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1"
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
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Cargo Handling Category</Label>
                        <select 
                          value={contractForm.cargoCategory}
                          onChange={(e) => setContractForm({...contractForm, cargoCategory: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1"
                        >
                          <option value="Standard Dry General Cargo">Standard Dry General Cargo</option>
                          <option value="Hazmat / Dangerous Goods (Class 1-9)">Hazmat / Dangerous Goods (Class 1-9)</option>
                          <option value="Cold-Chain Pharmaceuticals (2°C - 8°C)">Cold-Chain Pharmaceuticals (2°C - 8°C)</option>
                          <option value="Heavy Machinery / Mining Equipment">Heavy Machinery / Mining Equipment</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Number of Containers / TEUs</Label>
                        <Input 
                          type="number" 
                          value={contractForm.containerCount} 
                          onChange={(e) => setContractForm({...contractForm, containerCount: Number(e.target.value)})} 
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" 
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Port of Discharge & Clearance</Label>
                        <select 
                          value={contractForm.dischargePort}
                          onChange={(e) => setContractForm({...contractForm, dischargePort: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1"
                        >
                          <option value="Freeport of Monrovia (LRMLW)">Freeport of Monrovia (Berth 2)</option>
                          <option value="Port of Buchanan (LRUCN)">Port of Buchanan Terminal</option>
                          <option value="Roberts Int'l Airport (ROB)">Roberts Int'l Airport Cargo Gate</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Authorized Signatory Name & Title *</Label>
                        <Input 
                          value={contractForm.authorizedSignatory} 
                          onChange={(e) => setContractForm({...contractForm, authorizedSignatory: e.target.value})} 
                          placeholder="e.g. Jean-Paul Antwerp (Managing Director)"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. MANDATORY DOCUMENT ATTACHMENT VAULT DROPZONES */}
                  <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
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
                              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                Proof of Bill of Lading (B/L Copy) *
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
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
                            className="w-full mt-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold rounded-xl py-2"
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
                              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                Copy of Packing List (For Declaration) *
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
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
                            className="w-full mt-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold rounded-xl py-2"
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
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      "By executing this digital contract, {contractForm.companyName || "the Shipper"} hereby authorizes TOTAG Group of Companies Ltd (Licensed Customs Clearing & Forwarding Agent) to act on our behalf with Liberia Revenue Authority (LRA), National Port Authority (NPA), APM Terminals, and Ministry of Commerce to file ASYCUDA entries, pay customs duties, inspect cargo, and execute container release orders."
                    </p>
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer pt-1">
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
                      <span>Sign Contract & Submit Clearing Authorization</span>
                    </Button>

                    {signedContractReceipt && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-xs">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
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

              {/* 1. LRA Customs Duty Estimator & Document Intake Vault */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <Card className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
                        <Receipt className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">LRA Customs Duty & Tariff Calculator</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Licensed Customs Brokerage & ASYCUDA Assessment</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">ASYCUDA Compliant</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Port of Clearance</Label>
                      <select 
                        value={clearingPort} 
                        onChange={(e) => setClearingPort(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1"
                      >
                        <option value="Freeport of Monrovia (Berth 2)">Freeport of Monrovia (LRMLW)</option>
                        <option value="Port of Buchanan Terminal">Port of Buchanan (LRUCN)</option>
                        <option value="Roberts Int'l Airport Cargo Gate">Roberts Int'l Airport (ROB)</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300">Declared Invoice CIF Value ($ USD)</Label>
                      <Input type="number" value={cifValueUsd} onChange={(e) => setCifValueUsd(Number(e.target.value))} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-300">Tariff HS Code Classification</Label>
                    <select 
                      value={selectedHsCode.code}
                      onChange={(e) => setSelectedHsCode(TARIFF_HS_CODES.find(h => h.code === e.target.value) || TARIFF_HS_CODES[0])}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1"
                    >
                      {TARIFF_HS_CODES.map(h => (
                        <option key={h.code} value={h.code}>
                          HS {h.code} - {h.description} (Duty: {(h.dutyRate * 100).toFixed(0)}%, GST: {(h.gstRate * 100).toFixed(0)}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Import Duty ({(selectedHsCode.dutyRate * 100).toFixed(1)}%):</span>
                      <span className="font-bold text-slate-900 dark:text-white">${calculatedCustomsDuty.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>GST Sales Tax ({(selectedHsCode.gstRate * 100).toFixed(1)}%):</span>
                      <span className="font-bold text-slate-900 dark:text-white">${calculatedGstTax.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>ECOWAS Trade Levy (0.5%):</span>
                      <span className="font-bold text-slate-900 dark:text-white">${calculatedEcowasLevy.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Port Handling & Stevedoring Fee:</span>
                      <span className="font-bold text-slate-900 dark:text-white">${portHandlingFee.toLocaleString()} USD</span>
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
                <Card className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-500">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Live Customs Broker Workspace</h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct channel with assigned TOTAG Broker</p>
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
                            : "bg-emerald-500/10 border border-emerald-500/20 text-slate-900 dark:text-white ml-4"
                        }`}>
                          <div className="flex justify-between items-center font-bold text-[10px] text-slate-500 dark:text-slate-400">
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
                      className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium"
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
            <TabsContent value="b2b-portal" className="space-y-8">
              
              {/* CLEAN B2B PORTAL BANNER & USER ACCOUNT CONTROL */}
              <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/20 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-xl text-white">TOTAG Authenticated B2B Client Portal</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                        Multi-User RBAC & Telematics Enabled
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                      Self-service lifecycle management: End-to-end cargo visibility, live telematics (temperature, shock, GPS), ASYCUDA customs clearance status, and credit e-billing.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={() => setIsBillingModalOpen(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-xs font-black rounded-xl px-4 py-2.5 shadow-lg flex items-center space-x-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Open E-Billing Portal</span>
                  </Button>

                  <Button 
                    onClick={() => setIsNewUserModalOpen(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl px-4 py-2.5 border border-white/10 flex items-center space-x-1.5"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>Manage Org RBAC</span>
                  </Button>

                  <Button 
                    onClick={() => setIsDisputeModalOpen(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl px-4 py-2.5 border border-white/10 flex items-center space-x-1.5"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>File Dispute Ticket</span>
                  </Button>
                </div>
              </div>

              {/* SECTION 1: FINANCIAL & CREDIT MANAGEMENT SUMMARY BAR */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white space-y-1 shadow-md">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">APPROVED CREDIT LINE</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${customerAccount.creditLimitUsd.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">USD</span>
                  </div>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white space-y-1 shadow-md">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">USED CREDIT BALANCE</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">${customerAccount.creditUsedUsd.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">USD</span>
                  </div>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white space-y-1 shadow-md">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">AVAILABLE CREDIT</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-sky-600 dark:text-sky-400">${(customerAccount.creditLimitUsd - customerAccount.creditUsedUsd).toLocaleString()}</span>
                    <span className="text-xs text-slate-400">USD</span>
                  </div>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white space-y-1 shadow-md">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">ACTIVE ORG USERS</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{customerAccount.teamMembers.length} Team Members</span>
                  </div>
                </Card>
              </div>

              {/* SECTION 2: END-TO-END TELEMATICS & CUSTOMS CLEARANCE CONTROL ROOM */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. Automated Booking Engine & Printable AWB Generator */}
                <Card className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold">B2B Cargo Booking & Document Vault</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Create new shipment booking, upload manifests & generate official printable AWB PDF</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Multi-User RBAC</Badge>
                  </div>

                  <form onSubmit={handleGenerateAwbBooking} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Shipper Organization *</Label>
                        <Input 
                          value={b2bBookingForm.shipper} 
                          onChange={(e) => setB2bBookingForm({...b2bBookingForm, shipper: e.target.value})}
                          placeholder="e.g. Global Pharma & Freight NV"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Consignee Entity *</Label>
                        <Input 
                          value={b2bBookingForm.consignee} 
                          onChange={(e) => setB2bBookingForm({...b2bBookingForm, consignee: e.target.value})}
                          placeholder="e.g. TOTAG General Merchandise Ltd"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Nature of Goods</Label>
                        <Input 
                          value={b2bBookingForm.natureOfGoods} 
                          onChange={(e) => setB2bBookingForm({...b2bBookingForm, natureOfGoods: e.target.value})}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Total Pieces</Label>
                        <Input 
                          type="number" 
                          value={b2bBookingForm.pieces} 
                          onChange={(e) => setB2bBookingForm({...b2bBookingForm, pieces: Number(e.target.value)})}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Total Weight (kg)</Label>
                        <Input 
                          type="number" 
                          value={b2bBookingForm.weightKg} 
                          onChange={(e) => setB2bBookingForm({...b2bBookingForm, weightKg: Number(e.target.value)})}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-semibold" 
                        />
                      </div>
                    </div>

                    <div 
                      onClick={handleTriggerBlUpload}
                      className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-950/50"
                    >
                      <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Drop Commercial Invoice, Packing List & Customs Declarations</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">PDF, PNG, TIFF up to 25MB (Click to select local file)</span>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl py-3 text-xs shadow-lg flex items-center justify-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Generate Booking & Issue Official Printable AWB PDF</span>
                    </Button>
                  </form>
                </Card>

                {/* 2. Real-Time Telematics & Exception Alerts */}
                <Card className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-slate-900 dark:text-white space-y-6 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold">Live Sensor Telematics & Exception Alerts</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Proactive milestone & environmental risk monitoring</p>
                    </div>
                    <Radio className="w-6 h-6 text-sky-500 animate-pulse" />
                  </div>

                  <div className="space-y-4">
                    {/* Live Sensor Gauges */}
                    <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 grid grid-cols-3 gap-3 text-center text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">TEMP (COLD-CHAIN)</span>
                        <span className="font-bold text-sky-500 text-sm flex items-center justify-center space-x-1 mt-0.5">
                          <Thermometer className="w-3.5 h-3.5" />
                          <span>4.2 °C</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">SHOCK G-FORCE</span>
                        <span className="font-bold text-emerald-500 text-sm flex items-center justify-center space-x-1 mt-0.5">
                          <Activity className="w-3.5 h-3.5" />
                          <span>0.4 G</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">HUMIDITY %</span>
                        <span className="font-bold text-teal-400 text-sm flex items-center justify-center space-x-1 mt-0.5">
                          <Compass className="w-3.5 h-3.5" />
                          <span>55 %</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                            <AlertCircle className="w-4 h-4" />
                            <span>Demurrage Storage Risk Warning</span>
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
                  </div>
                </Card>

              </div>

            </TabsContent>

            {/* =================================================================== */}
            {/* TAB 4: WMS & RAMP COMMAND CENTER                                   */}
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

                  <div className="space-y-3">
                    <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold flex items-center space-x-1.5">
                      <Camera className="w-4 h-4 text-rose-500" />
                      <span>Visual Evidence & Photo Capture Dropzone</span>
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div 
                        onClick={handleAddPhoto}
                        className="border-2 border-dashed border-rose-500/40 hover:border-rose-500 bg-rose-500/5 p-4 rounded-2xl text-center flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02] min-h-[110px]"
                      >
                        <Camera className="w-6 h-6 text-rose-500 mb-1" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Snap / Attach Photo</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Click to add evidence</span>
                      </div>

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
            {/* TAB 5: OPENAPI CONSOLE & KAFKA LOG STREAM                           */}
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
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 text-slate-900 dark:text-white relative my-8"
              >
                <button 
                  onClick={() => setIsBillingModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
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
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">TOTAG Electronic Billing & Payment Gateway Portal</h3>
                  </div>
                </div>

                {/* ITEMIZED TAX & FREIGHT INVOICE BREAKDOWN */}
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 text-xs">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider block border-b border-slate-200 dark:border-white/10 pb-2">
                    Itemized Cargo & Tax Fee Assessment (Ref: INV-TOTAG-2026-9910)
                  </span>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>Base Freight Rate ({chargeableWeight.toFixed(1)} kg @ ${baseRatePerKg}/kg):</span>
                      <span className="font-mono font-bold">${Math.round(chargeableWeight * baseRatePerKg).toLocaleString()} USD</span>
                    </div>

                    {(isHazmat || isColdChain) && (
                      <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                        <span>Special Handling Surcharges (Hazmat / Cold-Chain):</span>
                        <span className="font-mono font-bold">${(hazmatSurcharge + coldChainSurcharge).toLocaleString()} USD</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>LRA Import Customs Duty ({(selectedHsCode.dutyRate * 100).toFixed(1)}%):</span>
                      <span className="font-mono font-bold">${calculatedCustomsDuty.toLocaleString()} USD</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>LRA Goods & Services Tax (GST 10%):</span>
                      <span className="font-mono font-bold">${calculatedGstTax.toLocaleString()} USD</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
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
                  <Label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Select Electronic Payment Gateway Method
                  </Label>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div 
                      onClick={() => setPaymentMethod("MOBILE_MONEY")}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                        paymentMethod === "MOBILE_MONEY" 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md" 
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Smartphone className="w-5 h-5 mx-auto text-emerald-500" />
                      <span className="text-xs font-bold block">Mobile Money</span>
                      <span className="text-[9px] text-slate-400 block">MTN / Orange Liberia</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod("BANK_WIRE")}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                        paymentMethod === "BANK_WIRE" 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md" 
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Building2 className="w-5 h-5 mx-auto text-sky-500" />
                      <span className="text-xs font-bold block">Bank Wire</span>
                      <span className="text-[9px] text-slate-400 block">Ecobank / UBA Swift</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod("CREDIT_CARD")}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                        paymentMethod === "CREDIT_CARD" 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md" 
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto text-indigo-500" />
                      <span className="text-xs font-bold block">Credit Card</span>
                      <span className="text-[9px] text-slate-400 block">Visa / Mastercard</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod("CREDIT_LINE")}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
                        paymentMethod === "CREDIT_LINE" 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md" 
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Wallet className="w-5 h-5 mx-auto text-amber-500" />
                      <span className="text-xs font-bold block">Credit Line</span>
                      <span className="text-[9px] text-slate-400 block">Net 30/60 Days</span>
                    </div>
                  </div>

                  {paymentMethod === "MOBILE_MONEY" && (
                    <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                      <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Lonestar MTN / Orange Money Number</Label>
                      <Input value={mobileMoneyPhone} onChange={(e) => setMobileMoneyPhone(e.target.value)} className="bg-white dark:bg-slate-900 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-mono" />
                      <span className="text-[10px] text-slate-400 block">Instant prompt will be sent to your phone to authorize payment.</span>
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
                    className="w-full sm:w-auto bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 font-bold rounded-xl px-4 py-3 text-xs flex items-center justify-center space-x-1.5"
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
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-3xl max-w-4xl w-full p-8 shadow-2xl space-y-6 text-slate-900 dark:text-white relative my-8"
              >
                <button 
                  onClick={() => setIsAwbModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white print:hidden"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* OFFICIAL AWB HEADER & LETTERHEAD */}
                <div className="border-b-2 border-emerald-500 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img src="/images/totag-logo.png" alt="TOTAG Group Logo" className="w-14 h-14 object-contain" />
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">TOTAG Group of Companies Ltd</h2>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Cargo Stevedoring, Port Operations & Customs Brokerage Division</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">Freeport of Monrovia Berth 2 • Roberts Int'l Airport Cargo Hub • Port of Buchanan</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1">
                      OFFICIAL IATA AIR WAYBILL (AWB)
                    </Badge>
                    <div className="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                      AWB #{generatedAwbData.awbNumber}
                    </div>
                    <span className="text-[10px] text-slate-400 block">Booking Ref: {generatedAwbData.bookingRef}</span>
                  </div>
                </div>

                {/* BARCODE & TRACKING STAMP SECTION */}
                <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Code128 Machine Readable Barcode</span>
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
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">ISSUE DATE</span>
                      <span className="font-bold text-slate-900 dark:text-white">{generatedAwbData.issueDate}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">DECLARED CIF VALUE</span>
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
                      <strong className="block text-slate-900 dark:text-white font-bold">{generatedAwbData.shipper}</strong>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Antwerp Maritime Logistics Terminal, Dock 404</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Antwerp, Belgium</p>
                    </div>
                  </div>

                  {/* CONSIGNEE */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider block border-b border-slate-200 dark:border-white/10 pb-1">
                      2. Consignee Name & Destination
                    </span>
                    <div className="space-y-1 text-slate-800 dark:text-slate-200">
                      <strong className="block text-slate-900 dark:text-white font-bold">{generatedAwbData.consignee}</strong>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">TOTAG Central Logistics Depot, Freeport</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Monrovia, Liberia</p>
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
                    <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
                      <tr>
                        <th className="p-3">No. of Pieces</th>
                        <th className="p-3">Gross Weight</th>
                        <th className="p-3">Chargeable Weight</th>
                        <th className="p-3">Commodity & Nature of Goods</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-slate-900 dark:text-white">
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
                      <span className="font-bold text-slate-900 dark:text-white block">Certified by TOTAG Port Stevedoring Authority</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Issuer: {generatedAwbData.issuer}</span>
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
                      className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 font-bold rounded-xl px-4 py-2.5 text-xs flex items-center space-x-1.5"
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

        {/* MODAL 3: AUTOMATED ONBOARDING / CONTRACT EMAIL INBOX PREVIEW */}
        <AnimatePresence>
          {isEmailDrawerOpen && onboardingEmail && (
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
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 text-slate-900 dark:text-white overflow-hidden relative"
              >
                <button 
                  onClick={() => setIsEmailDrawerOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-500">
                    <MailCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30 text-[10px]">
                      Automated System Email Notification
                    </Badge>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {onboardingEmail.type === "NEW_CUSTOMER_ONBOARDING" 
                        ? "New Customer Onboarding & Temporary Credentials Email" 
                        : "Existing Customer Contract Receipt & Thank You Email"}
                    </h3>
                  </div>
                </div>

                {/* Email Content Box */}
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 text-xs">
                  <div className="space-y-1 text-slate-500 dark:text-slate-400 font-mono text-[11px] border-b border-slate-200 dark:border-white/10 pb-3">
                    <div><strong className="text-slate-900 dark:text-white">From:</strong> onboarding@totaggroup.com (TOTAG Enterprise Portal)</div>
                    <div><strong className="text-slate-900 dark:text-white">To:</strong> {onboardingEmail.recipientEmail}</div>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Subject:</strong> {
                        onboardingEmail.type === "NEW_CUSTOMER_ONBOARDING"
                          ? `Welcome to TOTAG Cargo Platform – Temporary Login Credentials (Contract #${onboardingEmail.contractId})`
                          : `Thank You for Doing Business with TOTAG Group – Contract #${onboardingEmail.contractId} Confirmation`
                      }
                    </div>
                    <div><strong className="text-slate-900 dark:text-white">Date:</strong> {onboardingEmail.timestamp}</div>
                  </div>

                  {onboardingEmail.type === "NEW_CUSTOMER_ONBOARDING" ? (
                    <div className="space-y-3 leading-relaxed text-slate-700 dark:text-slate-300">
                      <p>Dear <strong>{onboardingEmail.signatory}</strong> ({onboardingEmail.companyName}),</p>
                      <p>Thank you for executing your C&F Clearing Service Contract & Power of Attorney with TOTAG Group of Companies Ltd. Your clearing authorization is now active with Liberia Revenue Authority (LRA) and National Port Authority (NPA).</p>

                      {/* Temporary Credentials Box */}
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs block uppercase tracking-wider">Your Automatically Provisioned Customer Portal Credentials</span>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">USERNAME / EMAIL</span>
                            <span className="font-bold text-slate-900 dark:text-white">{onboardingEmail.recipientEmail}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">TEMPORARY PASSWORD</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-500/20 px-2 py-0.5 rounded">{onboardingEmail.tempPassword}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">Please click the button below to log into your customer account and set your permanent password.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 leading-relaxed text-slate-700 dark:text-slate-300">
                      <p>Dear <strong>{onboardingEmail.signatory}</strong> ({onboardingEmail.companyName}),</p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">Thank you for your continued business with TOTAG Group of Companies Ltd!</p>
                      <p>We have successfully received and registered your new C&F Clearing Service Contract (Ref: <strong>{onboardingEmail.contractId}</strong>) under your active TOTAG Enterprise account.</p>
                      <p>Our licensed Customs Brokers (led by Officer J. Koffa) have initiated your LRA ASYCUDA single-window clearance declaration. You can log into your account anytime at <strong>totaggroup.com/cargo</strong> to track progress.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  {onboardingEmail.type === "NEW_CUSTOMER_ONBOARDING" && (
                    <Button 
                      onClick={() => {
                        setIsEmailDrawerOpen(false);
                        setActiveTab("b2b-portal");
                        setIsPasswordModalOpen(true);
                      }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black rounded-xl px-6 py-2.5 text-xs shadow-lg"
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      <span>Log In & Set Permanent Password</span>
                    </Button>
                  )}
                  {onboardingEmail.type === "EXISTING_CUSTOMER_CONTRACT" && (
                    <Button 
                      onClick={() => {
                        setIsEmailDrawerOpen(false);
                        setActiveTab("b2b-portal");
                      }}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl px-6 py-2.5 text-xs shadow-lg"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      <span>Open Customer Portal Account</span>
                    </Button>
                  )}
                </div>
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
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-slate-900 dark:text-white relative"
              >
                <button 
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Organization Multi-User Access (RBAC)</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Add sub-account members & assign role permissions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">Active Organization Team</span>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {customerAccount.teamMembers.map((member, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{member.name}</span>
                            <span className="text-[10px] text-slate-400">{member.email}</span>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">{member.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleAddTeamUser} className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Team Member Full Name</Label>
                      <Input value={newUserForm.name} onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})} placeholder="e.g. Samuel Tubman" className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Official Email Address</Label>
                      <Input type="email" value={newUserForm.email} onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})} placeholder="e.g. samuel@globalpharma.be" className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                    </div>

                    <div>
                      <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">RBAC Role Assignment</Label>
                      <select value={newUserForm.role} onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1">
                        <option value="Logistics Manager (Full Access)">Logistics Manager (Full Access)</option>
                        <option value="Customs Officer (Docs Only)">Customs Officer (Docs Only)</option>
                        <option value="Finance & Accounts Payable">Finance & Accounts Payable</option>
                        <option value="Warehouse Dispatch Operator">Warehouse Dispatch Operator</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl py-3 text-xs">
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
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 text-slate-900 dark:text-white relative"
              >
                <button 
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">File Billing & Invoice Dispute</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Log an official inquiry for finance resolution</p>
                  </div>
                </div>

                <form onSubmit={handleRaiseDispute} className="space-y-4">
                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Invoice / Charge Reference #</Label>
                    <Input value={disputeForm.invoiceRef} onChange={(e) => setDisputeForm({...disputeForm, invoiceRef: e.target.value})} className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-mono" />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Dispute Reason / Category</Label>
                    <select value={disputeForm.category} onChange={(e) => setDisputeForm({...disputeForm, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs p-2.5 mt-1">
                      <option value="Demurrage Charge Penalty">Demurrage Charge Penalty Appeal</option>
                      <option value="Weight / Volumetric Rate Discrepancy">Weight / Volumetric Rate Discrepancy</option>
                      <option value="Unapplied Credit Note">Unapplied Credit Note / Payment</option>
                      <option value="Customs Duty Overcharge">Customs Duty Overcharge Assessment</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Explanation & Claim Details</Label>
                    <Input value={disputeForm.notes} onChange={(e) => setDisputeForm({...disputeForm, notes: e.target.value})} placeholder="Describe why this charge is being disputed..." className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1" />
                  </div>

                  <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl py-3 text-xs shadow-lg">
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
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 text-slate-900 dark:text-white relative"
              >
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customer Account Password Setup</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Set a new permanent password for {customerAccount.email || "your account"}</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Temporary Password</Label>
                    <Input 
                      value={passwordForm.tempPasswordInput} 
                      onChange={(e) => setPasswordForm({...passwordForm, tempPasswordInput: e.target.value})}
                      placeholder="Enter temporary password received in onboarding email..."
                      className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1 font-mono"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">New Permanent Password</Label>
                    <Input 
                      type="password"
                      value={passwordForm.newPassword} 
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="Enter new strong password..."
                      className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-300 font-bold">Confirm New Password</Label>
                    <Input 
                      type="password"
                      value={passwordForm.confirmPassword} 
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Re-enter new password..."
                      className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs mt-1"
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

      </main>

      <Footer />
    </div>
  );
}
