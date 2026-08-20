import { useToast } from "@/hooks/use-toast";
import SubsidiaryHeroCarousel from "@/components/subsidiary-hero-carousel";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Video,
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
  ShieldAlert,
  Compass,
  Camera,
  Eye
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
// Approved Component Catalogue Master with 2-5 HD Photos per Item
const DETAILED_COMPONENT_CATALOGUE = [
  {
    id: "COMP-PV-550W",
    category: "PV Module",
    brand: "Jinko Solar / Longi",
    modelNo: "JKM550M-72HL4-V",
    priceUsd: 185,
    warranty: "25-Year Linear Performance",
    certifications: "IEC 61215, IEC 61730, TUV, CE, ISO 9001",
    specs: "550W • Voc: 49.8V • Vmp: 41.9V • Isc: 13.9A • Imp: 13.1A • 21.3% Efficiency",
    dimensions: "2278 x 1134 x 35 mm (27.5 kg)",
    description: "Tier-1 high-efficiency monocrystalline PERC solar panel engineered for harsh tropical climates, PID-resistant cell technology, and heavy anti-reflective glass.",
    image: "/images/pv/jinko-550w-tiger-pro.png",
    photos: [
      { url: "/images/pv/jinko-550w-tiger-pro.png", caption: "Jinko Tiger Pro 550-570W 72HL4-(V) Front & Back Specification Render" },
      { url: "/images/pv/jinko-solar-field-arrays.png", caption: "Jinko Solar Utility & Commercial Field Array Installations" }
    ]
  },
  {
    id: "COMP-PV-670W",
    name: "Trina Solar 670W N-Type TOPCon Bifacial Module",
    category: "PV Module",
    brand: "Trina Solar",
    modelNo: "TSM-DEG21C.20-670W",
    priceUsd: 235,
    warranty: "30-Year Bifacial Linear",
    certifications: "IEC 61215, IEC 61730, UL 61730, TUV, CE",
    specs: "670W • Voc: 45.4V • Vmp: 38.2V • Isc: 18.6A • Imp: 17.5A • 21.8% Efficiency",
    dimensions: "2384 x 1303 x 35 mm (33.9 kg)",
    description: "Ultra-high power N-Type TOPCon dual-glass bifacial panel delivering up to 30% additional energy gain from ground albedo reflection.",
    image: "/images/pv/jinko-550w-tiger-pro.png",
    photos: [
      { url: "/images/pv/jinko-550w-tiger-pro.png", caption: "Jinko Tiger Pro 550-570W 72HL4-(V) Front & Back Specification Render" },
      { url: "/images/pv/jinko-solar-field-arrays.png", caption: "Jinko Solar Utility & Commercial Field Array Installations" }
    ]
  },
  {
    id: "COMP-INV-DEYE10K",
    name: "Deye 10kW Three-Phase Hybrid Inverter",
    category: "Inverter",
    brand: "Deye Power",
    modelNo: "SUN-10K-SG04LP3-EU",
    priceUsd: 2450,
    warranty: "5-Year Factory (Extendable 10-Yr)",
    certifications: "CE, VDE-AR-N 4105, NRS 097-2-1, IEC 62109",
    specs: "10kVA • 48V Battery • 2 MPPT (1000V DC) • IP65 Outdoor Rating • 200% Surge",
    dimensions: "422 x 699 x 279 mm (33.6 kg)",
    description: "Smart 3-phase hybrid inverter featuring 48V low-voltage battery safety, 16-unit parallel capability, microgrid frequency control, and automatic generator start.",
    photos: [
      { url: "/images/deye/models/SUN-3_4_5_6_8_10_12K-SG05LP3-EU-SM2_.png", caption: "Front Casing: IP65 Weatherproof Housing & Color Touch LCD Interface" },
      { url: "/images/deye/deye-tp-lv-1.png", caption: "Bottom Connections: DC Isolator Switch, MC4 Ports & AC Glands" },
      { url: "/images/deye/deye-tp-hv-1.png", caption: "Internal Engineering: Heat Sink Fins, CANbus & RS485 Comm Ports" },
      { url: "/images/deye/deye-single-phase-lv-1.png", caption: "Wall Installation: 10kW Hybrid System Mounted in Telemetry Control Room" }
    ]
  },
  {
    id: "COMP-INV-VIC15K",
    name: "Victron Quattro 48/15000/200-100/100 277V 15kVA Inverter/Charger",
    category: "Inverter",
    brand: "Victron Energy (Blue Power)",
    modelNo: "Quattro 48/15000/200-100/100 277V",
    priceUsd: 3850,
    warranty: "5-Year Victron Global Warranty",
    certifications: "EN-IEC 60335-1, EN-IEC 60335-2-29, EN-IEC 62109-1, CE, ISO 9001",
    specs: "15,000 VA (15kVA / 12kW) Continuous • 25,000 W Peak Power • 48V DC Input • 200A Charger • 277V AC Output ± 2%",
    dimensions: "572 x 488 x 344 mm (22.6 x 19.2 x 13.6 in) • Weight: 72 kg (160 lb)",
    youtubeVideoUrl: "https://www.youtube.com/embed/mEN15Z_S4kE",
    description: "The Victron Quattro 48/15000 is an industrial-grade 15kVA inverter and 200A battery charger featuring dual independent AC inputs with an integrated automatic transfer switch (less than 20ms transfer), dual AC outputs with load shedding, PowerAssist peak shaving, PowerControl generator limiting, and 3-phase parallel scalability up to 180kVA (144kW).",
    features: [
      "Two Independent AC Inputs: Automatic connection to grid or generator (2x 100A max feed-through current)",
      "Two AC Outputs: Main output features no-break UPS functionality (<20ms transfer time); secondary output active only when AC input is available",
      "PowerAssist Technology: Prevents generator or shore power overload by supplementing battery power during peak surges",
      "PowerControl Generator Limiting: Sets maximum AC input current limit, prioritizing loads and using remaining power for battery charging",
      "Parallel & 3-Phase Scalability: Up to 4 sets of 3 units in parallel (12 units total) delivering up to 180 kVA (144 kW) output and 2400A charging capacity",
      "48V 200A Battery Charger: Adaptive 4-stage charge algorithm (Bulk, Absorption, Float, Storage) for Lead-Acid & Lithium (LiFePO4) chemistries",
      "Advanced System Telemetry: Full integration with Cerbo GX, Ekrano GX, VRM Online Portal, Bluetooth Smart, and VictronConnect app",
      "Robust Blue Aluminium Enclosure: IP21 protection category, four M8 DC connection bolts, M6 277 VAC connection bolts",
      "Programmable Relays (3x): Configurable for general alarms, DC under-voltage trip, or automatic generator start/stop",
      "Solar PV Integration: Compatible with off-grid and grid-tied solar systems with loss-of-mains detection software"
    ],
    photos: [
      { url: "/images/pv/victron-quattro-15kva-front.png", caption: "Victron Quattro 48/15000/200-100/100 277V Front View Panel & LED Status Display" },
      { url: "/images/pv/victron-quattro-15kva-angled.png", caption: "Victron Quattro 15kVA 3D Angled Blue RAL 5012 Heavy-Duty Aluminium Enclosure" },
      { url: "/images/pv/victron-quattro-15kva-datasheet-p1.png", caption: "Official Product Datasheet Page 1: Features, Dual AC Inputs/Outputs, VRM Remote Portal & System Architecture" },
      { url: "/images/pv/victron-quattro-15kva-datasheet-p2.png", caption: "Official Product Datasheet Page 2: Complete Technical Data Table, Electrical Ratings, Enclosure Specs & Accessories" }
    ]
  },
  {
    id: "COMP-BAT-PYLON",
    name: "Pylontech US5000-B 48V 100Ah 4.8kWh LiFePO4 Rack Module",
    category: "Battery",
    brand: "Pylontech Technologies",
    modelNo: "US5000-B",
    priceUsd: 1350,
    warranty: "10-Year Warranty (15+ Year Design Life)",
    certifications: "CE, UL1973, UKCA, UN38.3, IEC62619, IEC63056",
    specs: "48V 100Ah (4800Wh) • 4.56kWh Usable @ 95% DoD • 100A Max Continuous Discharge • >6000 Cycles @ 25°C",
    dimensions: "442 x 420 x 161 mm (4RU 19″ Rack Mount) • Weight: 39.0 kg (39,000g)",
    youtubeVideoUrl: "https://www.youtube.com/embed/TjMIbb7-u6Y?list=TLGGloi8bw1e1rExNjA4MjAyNg",
    description: "US5000-B is the latest and highest capacity version HESS battery system designed by Pylontech. Featuring long life characteristics (>6000 cycles @ 95% DoD), highest energy density, compact 4RU 19″ rack design, backward compatibility, pre-charge surge protection, and scalable parallel expansion up to 480 units (1.704MWh).",
    features: [
      "4RU Compact Size (161mm tall) fitting standard 19-inch brackets, racks or cabinets",
      "Cycle Life: >6000 cycles @ 25°C with 95% DoD for daily cyclic applications",
      "Usable Capacity of 4.56kWh @ 48 VDC (4.8kWh Nominal / 100Ah)",
      "High Discharge Current: 100A Maximum Continuous Discharge Current",
      "Pre-Charge Function to protect ESS from high inrush surge currents",
      "Communication Protocols: CAN, RS485, RS232 with integrated Smart BMS",
      "Modular Parallel Scaling: Up to 96 batteries per string/LV-Hub, up to 480 batteries in total parallel (1.704MWh)",
      "Backwards Compatible with existing Pylontech US series products (US2000 / US3000)",
      "Safety Certifications: CE, UL1973, UKCA, UN38.3, IEC62619, IEC63056",
      "Interlinking Kit: Each battery includes a 210mm long interlinking cable kit for parallel connection"
    ],
    photos: [
      { url: "/images/pv/pylontech-us5000-front.png", caption: "Pylontech US5000-B 48V 100Ah LiFePO4 4RU Rack Mounted Module" },
      { url: "/images/pv/pylontech-us5000-racks.png", caption: "Mounting & Rack Options: 3-Module Stack Brackets & Outdoor ESS Cabinet Integration" }
    ]
  },
  {
    id: "COMP-BAT-HUBBLE",
    name: "Hubble AM2+ 5.5kWh 48V 117Ah Lithium Battery Module",
    category: "Battery",
    brand: "Hubble Energy",
    modelNo: "Hubble AM2+",
    priceUsd: 1580,
    warranty: "10-Year Warranty (+/- 15 Years Design Life)",
    certifications: "CE, UN38.3, GBT31484-2015, GBT31485-2015, GBT31486-2015",
    specs: "48V 117Ah (5.5kWh Design Capacity) • 1.0C Rating (105A Max Charging/Discharging) • 100% DOD • +/- 1500 Cycles @ 100% DOD",
    dimensions: "375 x 145 x 467 mm (WxDxH) • Weight: Approx. 42.0 kg",
    description: "Hubble AM2+ is a high-performance 48V 117Ah 5.5kWh Li-ion Prismatic cell energy storage system featuring 1.0C continuous charging and discharging (105A), integrated 24/7 remote monitoring with Hubble Cloudlink, white bake lacquer steel case, and parallel expansion up to 15 packs with full communications.",
    features: [
      "Integrated 24/7 Remote Telemetry & Monitoring with Hubble Cloudlink",
      "1.0C High-Performance Lithium Battery with New Li-ion Prismatic Cells",
      "Advanced Smart BMS with Electronic Circuit Breaker, Voltage Protection & Current Limiting",
      "Max Continuous Charging & Discharging Current: 105A",
      "100% Depth of Discharge (DoD) capability (+/- 1500 Cycles @ 100% DOD)",
      "Easy Wall Mount or Shelf Rack Installation with Heavy Duty Side Handles",
      "Parallel Scalability: Connect up to 15 battery packs in parallel with full CAN-bus communication",
      "Outer Package Material: White bake lacquer heavy-duty steel protective enclosure",
      "Operating Temperature Range: Charging 0 to +55°C, Discharging -20 to +55°C",
      "Universal Compatibility: Fully integrates and communicates via CAN-bus with leading hybrid inverter brands"
    ],
    photos: [
      { url: "/images/pv/hubble-am2-battery.png", caption: "Hubble AM2+ 48V 117Ah 5.5kWh White Bake Lacquer Wall-Mount Enclosure & Cloudlink Antenna" },
      { url: "/images/pv/hubble-am2-datasheet-p1.png", caption: "Official Product Datasheet Page 1: Features, Nominal Voltage (48V), Capacity (5.5kWh), Rated Capacity (117Ah)" },
      { url: "/images/pv/hubble-am2-datasheet-p2.png", caption: "Official Product Datasheet Page 2: Technical Specifications Table, Electrical Characteristics & Dimensions" }
    ]
  },
  {
    id: "COMP-BOP-COMB",
    name: "4-String IP65 DC Combiner Box w/ SPDs & Fuses",
    category: "Balance of Plant",
    brand: "ABB / Schneider",
    modelNo: "PV-CB-4S-1000V",
    priceUsd: 240,
    warranty: "2-Year Factory Warranty",
    certifications: "IEC 61439-2, CE, IP65",
    specs: "1000V DC • 4 String In / 1 Out • 15A gPV DC Fuses • Type II DC Surge Arrestor (40kA)",
    dimensions: "300 x 400 x 180 mm (6.2 kg)",
    description: "Pre-wired outdoor polycarbonate combiner box equipped with ABB DC rotary isolator, touch-safe fuse holders, and lightning surge protection.",
    photos: [
      { url: "/images/deye/deye-tp-lv-1.png", caption: "Enclosure: Transparent Hinged Door, IP65 Waterproof Cable Glands" },
      { url: "/images/deye/models/SUN-3_4_5_6_8_10_12K-SG05LP3-EU-SM2_.png", caption: "Internal Layout: 1000V DC Fuses, Type II SPD Module & Copper Busbars" }
    ]
  },
  {
    id: "COMP-BOP-ATS",
    name: "4-Pole 250A Automatic Transfer Switch (ATS)",
    category: "Balance of Plant",
    brand: "Schneider Electric",
    modelNo: "ATS-4P-250A-230V",
    priceUsd: 480,
    warranty: "2-Year Factory Warranty",
    certifications: "IEC 60947-6-1, CE",
    specs: "4-Pole 250A • 400V AC • Dual Utility/Genset Motorized Interlock • Auto Start Contacts",
    dimensions: "450 x 350 x 220 mm (14.5 kg)",
    description: "Motorized dual-power automatic transfer switch providing fail-safe switching between solar inverter AC output, LEC grid utility, and backup diesel generator.",
    photos: [
      { url: "/images/deye/models/SUN-3_4_5_6_8_10_12K-SG05LP3-EU-SM2_.png", caption: "Front Switchgear: Motorized Mechanism & Manual Override Handle" },
      { url: "/images/deye/deye-tp-lv-1.png", caption: "Wiring Terminals: Phase L1/L2/L3/N Busbars & Generator Signal Relay" }
    ]
  }
];

const COMPONENT_CATALOGUE = [
  { name: "Tier-1 Mono PERC 550W Module", category: "PV Module", specs: "550W • 49.8 Voc • 13.1 Imp • 21.3% Efficiency", warranty: "25-Yr Linear", brand: "Jinko / Longi" },
  { name: "Deye 10kW Hybrid Three-Phase Inverter", category: "Inverter", specs: "10kVA • 48V Battery • 2 MPPT • Parallelable • IP65", warranty: "5-Yr Extended", brand: "Deye" },
  { name: "Victron Quattro 15kVA Inverter/Charger", category: "Inverter", specs: "15kVA • Dual AC Inputs • Auto Generator Start", warranty: "5-Yr Factory", brand: "Victron Energy" },
  { name: "LiFePO4 5.12kWh Rack Battery Module", category: "Battery", specs: "48V 100Ah • 6,000 Cycles @ 80% DoD • Smart BMS", warranty: "10-Yr Pro-rated", brand: "Hubble / Pylontech" },
  { name: "4-String PV Combiner Box w/ SPD", category: "Balance of Plant", specs: "1000V DC • 15A Fuses • Type II Surge Arrestor", warranty: "2-Yr", brand: "ABB / Schneider" }
];


// Deye Official OEM Catalogue Data (Single Phase LV, Split Phase, Three Phase)
const DEYE_CATALOGUE_CATEGORIES = [
  { id: "sp-lv", name: "Single Phase Low Voltage Hybrid Inverters", count: 10, source: "Deye Attachments 1, 2, 3" },
  { id: "split-phase", name: "Split Phase Hybrid Inverters", count: 6, source: "Deye Attachments 4, 5" },
  { id: "tp-lv", name: "Three-Phase Low Voltage Hybrid Inverters", count: 5, source: "Deye Attachments 6, 7" },
  { id: "tp-hv", name: "Three-Phase High Voltage Hybrid Inverters", count: 10, source: "Deye Attachments 8, 9, 10" },
  { id: "pv-modules", name: "PV Modules & Solar Panels", count: 2 },
  { id: "batteries", name: "LiFePO4 Energy Storage Banks", count: 2 },
  { id: "bop", name: "Balance of Plant & Switchgear", count: 2 },
];

const DEYE_CATALOGUE_ITEMS = [
  // --- SINGLE PHASE LOW VOLTAGE HYBRID INVERTERS ---
  {
    id: "DEYE-SP-01",
    catId: "sp-lv",
    seriesCode: "SUN-3.6/5/6/7/7.6/8/10K-SG05LP1-EU-AM2-P",
    powerRange: "3.6-10kW",
    phase: "Single Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "/images/deye/models/SUN-3_6_5_6_7_7_6_8_10K-SG05LP1-EU-AM2-P.png",
    photos: [
      { url: "/images/deye/models/SUN-3_6_5_6_7_7_6_8_10K-SG05LP1-EU-AM2-P.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-3.6/5/6/7/7.6/8/10K-SG05LP1-EU-AM2-P)" }
    ],
    
    
    priceUsd: 1450,
    specs: "3.6-10 kW Output • 48V LV Battery • 2 MPPT (500V DC) • 1.3 DC/AC Ratio • IP65 Weatherproof",
    description: "Single-phase low voltage hybrid inverter with color touchscreen, 6 time periods for battery charging/discharging, and max 16pcs parallel operation.",
    
  },
  {
    id: "DEYE-SP-02",
    catId: "sp-lv",
    seriesCode: "SUN-3.6/5/6/7/7.6/8/10K-SG05LP1-EU-SM2-P",
    powerRange: "3.6-10kW",
    phase: "Single Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "/images/deye/models/SUN-3_6_5_6_7_7_6_8_10K-SG05LP1-EU-SM2-P.png",
    photos: [
      { url: "/images/deye/models/SUN-3_6_5_6_7_7_6_8_10K-SG05LP1-EU-SM2-P.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-3.6/5/6/7/7.6/8/10K-SG05LP1-EU-SM2-P)" }
    ],
    
    
    priceUsd: 1550,
    specs: "3.6-10 kW Output • 48V LV Battery • 2 MPPT • Frequency Droop Control • 6 Time Periods",
    description: "Enhanced SG05 Series single-phase LV hybrid inverter optimized for smart load management and diesel generator synchronization.",
    
  },
  {
    id: "DEYE-SP-03",
    catId: "sp-lv",
    seriesCode: "SUN-7/7.6/8/10K-SG05LP1-EU-SM2",
    powerRange: "7-10kW",
    phase: "Single Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "/images/deye/models/SUN-7_7_6_8_10K-SG05LP1-EU-SM2.png",
    photos: [
      { url: "/images/deye/models/SUN-7_7_6_8_10K-SG05LP1-EU-SM2.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-7/7.6/8/10K-SG05LP1-EU-SM2)" }
    ],
    
    
    priceUsd: 1850,
    specs: "7-10 kW Output • 48V LV Battery • 2 MPPT • AC Couple Retrofit Capable • Zero Export Control",
    description: "High-capacity single-phase hybrid inverter designed for large residential and commercial off-grid/hybrid installations.",
    
  },
  {
    id: "DEYE-SP-04",
    catId: "sp-lv",
    seriesCode: "SUN-7/7.6/8/10/12K-SG06LP1-EU-CM3",
    powerRange: "7-12kW",
    phase: "Single Phase",
    mppt: "3 MPPT",
    batterySupport: "LV Battery Supported",
    badge: "NEW",
    image: "/images/deye/models/SUN-7_7_6_8_10_12K-SG06LP1-EU-CM3.png",
    photos: [
      { url: "/images/deye/models/SUN-7_7_6_8_10_12K-SG06LP1-EU-CM3.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-7/7.6/8/10/12K-SG06LP1-EU-CM3)" }
    ],
    
    
    priceUsd: 2150,
    specs: "7-12 kW Output • 48V LV Battery • 3 MPPT • Triple String Tracking • 200% Overload",
    description: "Latest 2026 flagship single-phase hybrid inverter with 3 MPPT trackers for multi-orientated rooftop arrays.",
    
  },
  {
    id: "DEYE-SP-05",
    catId: "sp-lv",
    seriesCode: "SUN-7.6/8/10/12K-SG02LP1-EU-AM2/AM3-P",
    powerRange: "7.6-12kW",
    phase: "Single Phase",
    mppt: "2/3 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "/images/deye/models/SUN-7_6_8_10_12K-SG02LP1-EU-AM2_AM3-P.png",
    photos: [
      { url: "/images/deye/models/SUN-7_6_8_10_12K-SG02LP1-EU-AM2_AM3-P.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-7.6/8/10/12K-SG02LP1-EU-AM2/AM3-P)" }
    ],
    
    
    priceUsd: 2250,
    specs: "7.6-12 kW Output • 48V Battery • 2/3 MPPT • Microgrid Frequency Control",
    description: "Heavy-duty SG02 series single phase hybrid inverter with high charge/discharge current capacity.",
    
  },
  {
    id: "DEYE-SP-06",
    catId: "sp-lv",
    seriesCode: "SUN-12/14/16/18K-SG01LP1-EU-AM3-P",
    powerRange: "12-18kW",
    phase: "Single Phase",
    mppt: "3 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "/images/deye/models/SUN-12_14_16_18K-SG01LP1-EU-AM3-P.png",
    photos: [
      { url: "/images/deye/models/SUN-12_14_16_18K-SG01LP1-EU-AM3-P.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-12/14/16/18K-SG01LP1-EU-AM3-P)" }
    ],
    
    
    priceUsd: 2950,
    specs: "12-18 kW High Power • 48V Battery • 3 MPPT • 250A Battery Charge/Discharge",
    description: "Ultra-high power single phase LV hybrid inverter powering up to 18kW continuous load for heavy industrial facilities.",
    
  },
  {
    id: "DEYE-SP-07",
    catId: "sp-lv",
    seriesCode: "SUN-3/3.6/4/4.6/5/6K-SG06LP1-EU-BM1/BM2",
    powerRange: "3-6kW",
    phase: "Single Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: "NEW",
    image: "/images/deye/models/SUN-3_3_6_4_4_6_5_6K-SG06LP1-EU-BM1_BM2.png",
    photos: [
      { url: "/images/deye/models/SUN-3_3_6_4_4_6_5_6K-SG06LP1-EU-BM1_BM2.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-3/3.6/4/4.6/5/6K-SG06LP1-EU-BM1/BM2)" }
    ],
    
    
    priceUsd: 1150,
    specs: "3-6 kW Output • 48V Battery • 2 MPPT • Compact Light Weight Design",
    description: "Compact 3-6kW residential hybrid inverter with fast UPS response time under 4ms.",
    
  },
  {
    id: "DEYE-SP-08",
    catId: "sp-lv",
    seriesCode: "SUN-3/3.6/4/4.6/5/6K-SG06LP1-EU-CM1/CM2",
    powerRange: "3-6kW",
    phase: "Single Phase",
    mppt: "1/2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: "NEW",
    image: "/images/deye/models/SUN-3_3_6_4_4_6_5_6K-SG06LP1-EU-CM1_CM2.png",
    photos: [
      { url: "/images/deye/models/SUN-3_3_6_4_4_6_5_6K-SG06LP1-EU-CM1_CM2.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-3/3.6/4/4.6/5/6K-SG06LP1-EU-CM1/CM2)" }
    ],
    
    
    priceUsd: 1250,
    specs: "3-6 kW Output • 48V Battery • 1/2 MPPT • Smart Load & Generator Port",
    description: "Residential hybrid inverter with dedicated smart load output for high-surge appliances.",
    
  },
  {
    id: "DEYE-SP-09",
    catId: "sp-lv",
    seriesCode: "SUN-3/3.6/5/6K-SG04LP1-SM1/SM2",
    powerRange: "3-6kW",
    phase: "Single Phase",
    mppt: "1/2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2025/05/29/6.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2025/05/29/6.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-3/3.6/5/6K-SG04LP1-SM1/SM2)" }
    ],
    
    
    priceUsd: 1180,
    specs: "3-6 kW Output • 48V Battery • 1/2 MPPT • Low Noise Passive Cooling",
    description: "Silent operation single-phase hybrid inverter for home office & clinic deployments.",
    
  },
  {
    id: "DEYE-SP-10",
    catId: "sp-lv",
    seriesCode: "SUN-3/3.6/5/6K-SG04LP1-EU",
    powerRange: "3-6kW",
    phase: "Single Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "/images/deye/models/SUN-3_3_6_5_6K-SG04LP1-EU-SM1_SM2.png",
    photos: [
      { url: "/images/deye/models/SUN-3_3_6_5_6K-SG04LP1-EU-SM1_SM2.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-3/3.6/5/6K-SG04LP1-EU)" }
    ],
    
    
    priceUsd: 1220,
    specs: "3-6 kW Output • 48V Battery • 2 MPPT • CE & VDE Certified",
    description: "Standard EU-certified single-phase hybrid inverter with integrated DC switch.",
    
  },


  // --- THREE-PHASE LOW VOLTAGE HYBRID INVERTERS (5 Series Models) ---
  {
    id: "DEYE-TP-LV-01",
    catId: "tp-lv",
    seriesCode: "SUN-3/4/5/6/8K-SG06LP3-EU-CM2",
    powerRange: "3-8kW",
    phase: "Three Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: "NEW",
    image: "/images/deye/models/SUN-3_4_5_6_8K-SG06LP3-EU-CM2.png",
    photos: [
      { url: "/images/deye/models/SUN-3_4_5_6_8K-SG06LP3-EU-CM2.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-3/4/5/6/8K-SG06LP3-EU-CM2)" }
    ],
    
    
    priceUsd: 1980,
    specs: "3-8 kW Output • 48V LV Battery • 2 MPPT • 100% Unbalanced Output • IP65 Weatherproof",
    description: "New 2026 compact three-phase low voltage hybrid inverter with 100% unbalanced phase output capability (each phase max output up to 50% rated power).",
    
  },
  {
    id: "DEYE-TP-LV-02",
    catId: "tp-lv",
    seriesCode: "SUN-3/4/5/6/8K-SG06LP3-EU-BM2",
    powerRange: "3-8kW",
    phase: "Three Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: "NEW",
    image: "/images/deye/models/SUN-3_4_5_6_8K-SG06LP3-EU-BM2.png",
    photos: [
      { url: "/images/deye/models/SUN-3_4_5_6_8K-SG06LP3-EU-BM2.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-3/4/5/6/8K-SG06LP3-EU-BM2)" }
    ],
    
    
    priceUsd: 2050,
    specs: "3-8 kW Output • 48V LV Battery • 2 MPPT • Frequency Droop Control • Max 10pcs Parallel",
    description: "Commercial 3-phase hybrid inverter with generator port for integrated automatic diesel generator synchronization.",
    
  },
  {
    id: "DEYE-TP-LV-03",
    catId: "tp-lv",
    seriesCode: "SUN-3/4/5/6/8/10/12K-SG05LP3-EU-SM2",
    powerRange: "3-12kW",
    phase: "Three Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "/images/deye/models/SUN-3_4_5_6_8_10_12K-SG05LP3-EU-SM2_.png",
    photos: [
      { url: "/images/deye/models/SUN-3_4_5_6_8_10_12K-SG05LP3-EU-SM2_.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-3/4/5/6/8/10/12K-SG05LP3-EU-SM2)" }
    ],
    
    
    priceUsd: 2650,
    specs: "3-12 kW Output • 48V LV Battery • 2 MPPT • AC Couple Retrofit • 6 Time Periods",
    description: "Versatile 3-12kW three-phase hybrid inverter supporting both AC coupling for existing solar arrays and DC coupling for new battery storage.",
    
  },
  {
    id: "DEYE-TP-LV-04",
    catId: "tp-lv",
    seriesCode: "SUN-14/15/16/18/20K-SG05LP3-EU-SM2",
    powerRange: "14-20kW",
    phase: "Three Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "/images/deye/models/SUN-14_15_16_18_20K-SG05LP3-EU-SM2.png",
    photos: [
      { url: "/images/deye/models/SUN-14_15_16_18_20K-SG05LP3-EU-SM2.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-14/15/16/18/20K-SG05LP3-EU-SM2)" }
    ],
    
    
    priceUsd: 3450,
    specs: "14-20 kW Output • 48V LV Battery • 2 MPPT • 350A Max Battery Charge/Discharge",
    description: "High-power 20kW three-phase LV hybrid inverter featuring 350A continuous battery charging for rapid commercial battery recovery.",
    
  },
  {
    id: "DEYE-TP-LV-05",
    catId: "tp-lv",
    seriesCode: "SUN-5/6/8/10/12K-SG04LP3-EU-AM2-P",
    powerRange: "5-12kW",
    phase: "Three Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-5/6/8/10/12K-SG04LP3-EU-AM2-P)" }
    ],
    
    
    priceUsd: 2550,
    specs: "5-12 kW Output • 48V LV Battery • 2 MPPT • IP65 Weatherproof • Modbus RS485",
    description: "Heavy-duty SG04 series 3-phase hybrid inverter with die-cast IP65 aluminum casing.",
    
  },

  // --- THREE-PHASE HIGH VOLTAGE HYBRID INVERTERS (10 Series Models) ---
  {
    id: "DEYE-TP-HV-01",
    catId: "tp-hv",
    seriesCode: "SUN-5/6/8/10/12K-SG01HP3-EU-DM2",
    powerRange: "5-12kW",
    phase: "Three Phase",
    mppt: "2 MPPT",
    batterySupport: "HV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-5/6/8/10/12K-SG01HP3-EU-DM2)" }
    ],
    
    
    priceUsd: 2850,
    specs: "5-12 kW Output • 160V-800V High Voltage Battery • 2 MPPT • >97.6% Efficiency",
    description: "High-voltage battery 3-phase hybrid inverter with ultra-high round-trip efficiency and reduced cable losses.",
    
  },
  {
    id: "DEYE-TP-HV-02",
    catId: "tp-hv",
    seriesCode: "SUN-8/10/12/15K-SG01HP3-US-AM2",
    powerRange: "8-15kW",
    phase: "Three Phase",
    mppt: "2 MPPT",
    batterySupport: "HV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-8/10/12/15K-SG01HP3-US-AM2)" }
    ],
    
    
    priceUsd: 3150,
    specs: "8-15 kW Output • 160V-800V HV Battery • 2 MPPT • UL1741 & IEEE 1547 Certified",
    description: "North American & international compliant HV battery 3-phase hybrid inverter with rapid shutdown integration.",
    
  },
  {
    id: "DEYE-TP-HV-03",
    catId: "tp-hv",
    seriesCode: "SUN-5/6/8/10/12/15/20/25K-SG01HP3-EU-AM2",
    powerRange: "5-25kW",
    phase: "Three Phase",
    mppt: "2 MPPT",
    batterySupport: "HV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-5/6/8/10/12/15/20/25K-SG01HP3-EU-AM2)" }
    ],
    
    
    priceUsd: 3850,
    specs: "5-25 kW Output • HV Battery • 2 MPPT • 100% Unbalanced Load • 10 Units Parallel",
    description: "Commercial 25kW HV hybrid inverter capable of paralleling up to 10 units for 250kW microgrid systems.",
    
  },
  {
    id: "DEYE-TP-HV-04",
    catId: "tp-hv",
    seriesCode: "SUN-25/29.9/30K-SG02HP3-EU-AM3",
    powerRange: "25-30kW",
    phase: "Three Phase",
    mppt: "3 MPPT",
    batterySupport: "HV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-25/29.9/30K-SG02HP3-EU-AM3)" }
    ],
    
    
    priceUsd: 4650,
    specs: "25-30 kW Output • HV Battery • 3 MPPT • Triple String Tracking • Smart Load Port",
    description: "Industrial 30kW HV hybrid inverter featuring 3 independent MPPT trackers for complex commercial roofs.",
    
  },
  {
    id: "DEYE-TP-HV-05",
    catId: "tp-hv",
    seriesCode: "SUN-29.9/30/35/40/50K-SG01HP3-EU-BM3/BM4",
    powerRange: "29.9-50kW",
    phase: "Three Phase",
    mppt: "3/4 MPPT",
    batterySupport: "HV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-29.9/30/35/40/50K-SG01HP3-EU-BM3/BM4)" }
    ],
    
    
    priceUsd: 5950,
    specs: "29.9-50 kW Output • HV Battery • 3/4 MPPT • 100A Max Battery Charge • IP65",
    description: "50kW commercial & industrial HV hybrid inverter supporting high-capacity containerized energy storage systems.",
    
  },
  {
    id: "DEYE-TP-HV-06",
    catId: "tp-hv",
    seriesCode: "SUN-29.9/30/35/40/50K-SG02HP3-EU-BM3/BM4-P",
    powerRange: "29.9-50kW",
    phase: "Three Phase",
    mppt: "3/4 MPPT",
    batterySupport: "HV Battery Supported",
    badge: "NEW",
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-29.9/30/35/40/50K-SG02HP3-EU-BM3/BM4-P)" }
    ],
    
    
    priceUsd: 6250,
    specs: "29.9-50 kW Output • HV Battery • 3/4 MPPT • Next-Gen Power Module • Active Cooling",
    description: "Flagship 2026 50kW HV hybrid inverter with high current input density for 650W+ TOPCon solar panels.",
    
  },
  {
    id: "DEYE-TP-HV-07",
    catId: "tp-hv",
    seriesCode: "SUN-60/70/75/80K-SG02HP3-EU-EM6",
    powerRange: "60-80kW",
    phase: "Three Phase",
    mppt: "6 MPPT",
    batterySupport: "HV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-60/70/75/80K-SG02HP3-EU-EM6)" }
    ],
    
    
    priceUsd: 8950,
    specs: "60-80 kW Output • HV Battery • 6 MPPT • 6 Independent String Trackers • SCADA Ready",
    description: "Utility-scale 80kW HV hybrid inverter with 6 MPPTs and Modbus TCP/RTU SCADA integration.",
    
  },
  {
    id: "DEYE-TP-HV-08",
    catId: "tp-hv",
    seriesCode: "SUN-100/125K-SG02HP3-EU-GM8/GM10",
    powerRange: "100-125kW",
    phase: "Three Phase",
    mppt: "8/10 MPPT",
    batterySupport: "HV Battery Supported",
    badge: "NEW",
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-100/125K-SG02HP3-EU-GM8/GM10)" }
    ],
    
    
    priceUsd: 12850,
    specs: "100-125 kW Mega Power • HV Battery • 8/10 MPPT • 10 Independent String Trackers • Utility Microgrid",
    description: "Mega-scale 125kW HV hybrid inverter engineered for mini-grids, rural electrification, and mining facilities.",
    
  },
  {
    id: "DEYE-TP-HV-09",
    catId: "tp-hv",
    seriesCode: "SUN-15/20/25K-SG02HP3-EU-DM3",
    powerRange: "15-25kW",
    phase: "Three Phase",
    mppt: "3 MPPT",
    batterySupport: "HV Battery Supported",
    badge: "NEW",
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-15/20/25K-SG02HP3-EU-DM3)" }
    ],
    
    
    priceUsd: 3950,
    specs: "15-25 kW Output • HV Battery • 3 MPPT • Compact Commercial Design",
    description: "Compact 25kW HV hybrid inverter with Deye signature arc fault circuit interrupter (AFCI).",
    
  },
  {
    id: "DEYE-TP-HV-10",
    catId: "tp-hv",
    seriesCode: "SUN-5/6/8/10/12K-SG02HP3-EU-DM2",
    powerRange: "5-12kW",
    phase: "Three Phase",
    mppt: "2 MPPT",
    batterySupport: "HV Battery Supported",
    badge: "NEW",
    image: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2026/01/29/15.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-5/6/8/10/12K-SG02HP3-EU-DM2)" }
    ],
    
    
    priceUsd: 2950,
    specs: "5-12 kW Output • HV Battery • 2 MPPT • Light Weight High Efficiency",
    description: "High-efficiency 12kW HV hybrid inverter with smart frequency droop control for mini-grids.",
    
  },

  // --- SPLIT PHASE HYBRID INVERTERS ---
  {
    id: "DEYE-SPLIT-01",
    catId: "split-phase",
    seriesCode: "SUN-5/6/7.6/8K-SG01LP1-US",
    powerRange: "5-8kW",
    phase: "Split Phase",
    mppt: "2 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "/images/deye/models/SUN-5_6_7_6_8K-SG01LP1-US.png",
    photos: [
      { url: "/images/deye/models/SUN-5_6_7_6_8K-SG01LP1-US.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-5/6/7.6/8K-SG01LP1-US)" }
    ],
    
    
    priceUsd: 1950,
    specs: "5-8 kW Output • 120/240V Split Phase • 48V Battery • 2 MPPT • UL1741 & IEEE 1547",
    description: "Split phase hybrid inverter engineered for 120V/240V dual line grid standards with automatic generator start.",
    
  },
  {
    id: "DEYE-SPLIT-02",
    catId: "split-phase",
    seriesCode: "SUN-8/10/12/15K-SG01HP2-US-AM2",
    powerRange: "8-15kW",
    phase: "Split Phase",
    mppt: "2 MPPT",
    batterySupport: "HV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2025/07/21/101.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2025/07/21/101.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-8/10/12/15K-SG01HP2-US-AM2)" }
    ],
    
    
    priceUsd: 2850,
    specs: "8-15 kW High Output • 120/240V Split Phase • High Voltage HV Battery (160V-800V) • 2 MPPT",
    description: "High-voltage battery split-phase hybrid inverter delivering maximum charge/discharge efficiency above 97.6%.",
    
  },
  {
    id: "DEYE-SPLIT-03",
    catId: "split-phase",
    seriesCode: "SUN-7.6/8/10/12K-SG02LP2-US-AM2/AM3-P",
    powerRange: "7.6-12kW",
    phase: "Split Phase",
    mppt: "2/3 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2025/07/21/101.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2025/07/21/101.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-7.6/8/10/12K-SG02LP2-US-AM2/AM3-P)" }
    ],
    
    
    priceUsd: 2450,
    specs: "7.6-12 kW • 120/240V Split Phase • 48V LV Battery • 2/3 MPPT • 200A Pass Through",
    description: "Flagship 200A service entrance split phase hybrid inverter with whole-home backup switch.",
    
  },
  {
    id: "DEYE-SPLIT-04",
    catId: "split-phase",
    seriesCode: "SUN-5/6/7.6/8/10/12K-SG02LP2-US-AM2/AM3",
    powerRange: "5-12kW",
    phase: "Split Phase",
    mppt: "2/3 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2025/07/21/101.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2025/07/21/101.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-5/6/7.6/8/10/12K-SG02LP2-US-AM2/AM3)" }
    ],
    
    
    priceUsd: 2350,
    specs: "5-12 kW • 120/240V Split Phase • 48V Battery • 2/3 MPPT • Rapid Shutdown Ready",
    description: "Rapid shutdown compliant split-phase inverter for North American and regional grid codes.",
    
  },
  {
    id: "DEYE-SPLIT-05",
    catId: "split-phase",
    seriesCode: "SUN-5/6/8/10/12K-SG05LP2-US-SM2/SM3",
    powerRange: "5-12kW",
    phase: "Split Phase",
    mppt: "2/3 MPPT",
    batterySupport: "LV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2025/07/21/101.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2025/07/21/101.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-5/6/8/10/12K-SG05LP2-US-SM2/SM3)" }
    ],
    
    
    priceUsd: 2550,
    specs: "5-12 kW • 120/240V Split Phase • 48V Battery • 2/3 MPPT • Color LCD Touch Screen",
    description: "Sleek SG05 series split phase inverter with intuitive graphic user interface.",
    
  },
  {
    id: "DEYE-SPLIT-06",
    catId: "split-phase",
    seriesCode: "SUN-4.95/5.5/8K-SG02HP2-JP-FM4",
    powerRange: "4.95-8kW",
    phase: "Split Phase",
    mppt: "4 MPPT",
    batterySupport: "HV Battery Supported",
    badge: null,
    image: "https://www.deyeinverter.com/deyeinverter/2025/07/21/101.png",
    photos: [
      { url: "https://www.deyeinverter.com/deyeinverter/2025/07/21/101.png", caption: "Official Deye OEM Single Inverter High-Res Render (SUN-4.95/5.5/8K-SG02HP2-JP-FM4)" }
    ],
    
    
    priceUsd: 2650,
    specs: "4.95-8 kW • 4 MPPT • High Voltage HV Battery • Circular Status LED Gauge",
    description: "Quad-MPPT high voltage battery hybrid inverter featuring Deye signature circular LED status ring.",
    
  }
];

export default function SolarPage() {
  // Fullscreen Expandable Datasheet Zoom Modal State
  const [showExpandDatasheetModal, setShowExpandDatasheetModal] = useState<boolean>(false);
  const [expandDatasheetImg, setExpandDatasheetImg] = useState<string>("");
  const [expandDatasheetTitle, setExpandDatasheetTitle] = useState<string>("");
  const [zoomScale, setZoomScale] = useState<number>(1);

  // Rich PDF OEM Datasheet & Technical Specification Generator
  const handleDownloadOemDatasheetPdf = (item: any) => {
    if (!item) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups for totag.network to download the PDF datasheet.");
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TOTAG Technical Datasheet - ${item.seriesCode || item.name}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 20px; background: #ffffff; line-height: 1.5; }
    .header { display: flex; align-items: center; justify-content: space-between; border-b: 3px solid #f59e0b; padding-bottom: 15px; margin-bottom: 20px; }
    .logo-title { font-size: 22px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
    .subtitle { font-size: 11px; color: #64748b; font-weight: 600; }
    .doc-meta { text-align: right; font-size: 10px; color: #475569; font-family: monospace; }
    .badge { background: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 4px; font-weight: 800; font-size: 10px; text-transform: uppercase; border: 1px solid #fde68a; }
    .hero-banner { display: flex; gap: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; align-items: center; }
    .hero-img { max-height: 180px; max-width: 220px; object-fit: contain; }
    .hero-details { flex: 1; }
    .product-name { font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
    .model-code { font-family: monospace; font-size: 12px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 4px 8px; border-radius: 6px; display: inline-block; margin-bottom: 10px; }
    .specs-pill-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
    .spec-pill { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: 600; text-align: center; }
    .spec-pill-title { font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 800; display: block; }
    .section-title { font-size: 14px; font-weight: 900; color: #0f172a; border-left: 4px solid #f59e0b; padding-left: 8px; margin: 20px 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
    th { background: #0f172a; color: #ffffff; text-align: left; padding: 8px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 500; }
    tr:nth-child(even) { background: #f8fafc; }
    .table-key { font-weight: 700; color: #334155; width: 40%; }
    .table-val { color: #0f172a; font-weight: 600; }
    .footer { border-t: 2px solid #e2e8f0; padding-top: 15px; margin-top: 30px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b; }
    .stamp { border: 2px dashed #10b981; color: #047857; padding: 6px 12px; border-radius: 8px; font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <div class="no-print" style="margin-bottom: 15px; text-align: right;">
    <button onclick="window.print()" style="background: #f59e0b; color: #0f172a; border: none; padding: 10px 20px; font-weight: 900; border-radius: 8px; cursor: pointer; font-size: 12px;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="header">
    <div>
      <div class="logo-title">TOTAG Solar EPC & Smart Power</div>
      <div class="subtitle">Official OEM Partner Technical Specification Datasheet</div>
    </div>
    <div class="doc-meta">
      <div>REF: TOTAG-DS-2026-${(item.seriesCode || item.id || 'EQUIP').replace(/[^a-zA-Z0-9]/g, '-')}</div>
      <div>DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
      <div style="margin-top: 4px;"><span class="badge">UNICEF & UNDP COMPLIANT</span></div>
    </div>
  </div>

  <div class="hero-banner">
    <img src="${item.image || item.photos?.[0]?.url || 'https://www.deyeinverter.com/uploads/product/hybrid-inverter-1/single-phase-low-voltage-hybrid-inverter/SUN-3.6-10K-SG05LP1-EU-AM2-P.png'}" alt="${item.name}" class="hero-img" />
    <div class="hero-details">
      <h1 class="product-name">${item.name || 'Deye Hybrid Inverter Series'}</h1>
      <div class="model-code">MODEL: ${item.seriesCode || item.modelNo || item.id}</div>
      <p style="font-size: 11px; color: #475569; margin: 0;">${item.description || 'Tier-1 commercial grade smart hybrid inverter engineered for off-grid, grid-tied, and diesel generator integration.'}</p>
      
      <div class="specs-pill-grid">
        <div class="spec-pill">
          <span class="spec-pill-title">Power Range</span>
          <strong>${item.powerRange || '3.6 - 125 kW'}</strong>
        </div>
        <div class="spec-pill">
          <span class="spec-pill-title">Phase Type</span>
          <strong>${item.phase || item.category}</strong>
        </div>
        <div class="spec-pill">
          <span class="spec-pill-title">MPPT Tracker</span>
          <strong>${item.mppt || '2/3 MPPT'}</strong>
        </div>
      </div>
    </div>
  </div>

  <div class="section-title">1. Technical & Electrical Specifications</div>
  <table>
    <thead>
      <tr>
        <th>Parameter Category</th>
        <th>Engineering Parameter & Operational Range</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="table-key">Manufacturer Brand & Origin</td>
        <td class="table-val">${item.brand || 'Deye Power Technologies'} (Authorized TOTAG Systems Integrator)</td>
      </tr>
      <tr>
        <td class="table-key">Series Model Number</td>
        <td class="table-val" style="font-family: monospace;">${item.seriesCode || item.modelNo || item.id}</td>
      </tr>
      <tr>
        <td class="table-key">Power Output Capacity</td>
        <td class="table-val">${item.powerRange || 'Rated Continuous Output'} (200% Surge Capacity for 10s)</td>
      </tr>
      <tr>
        <td class="table-key">Grid / Phase Configuration</td>
        <td class="table-val">${item.phase || 'Single / Split / Three Phase 50Hz/60Hz'}</td>
      </tr>
      <tr>
        <td class="table-key">MPPT Input Voltage Range</td>
        <td class="table-val">${item.mppt || 'Dual MPPT'} (150V - 850V DC Operating Range, Max 1000V DC)</td>
      </tr>
      <tr>
        <td class="table-key">Battery Chemistry & Voltage</td>
        <td class="table-val">${item.batterySupport || '48V LV / High Voltage Lithium Storage'} (Smart CANbus & RS485 BMS)</td>
      </tr>
      <tr>
        <td class="table-key">Max Conversion Efficiency</td>
        <td class="table-val">97.6% Peak Efficiency (99.9% MPPT Efficiency)</td>
      </tr>
      <tr>
        <td class="table-key">Enclosure & Protection Rating</td>
        <td class="table-val">IP65 Outdoor Weatherproof Housing (Die-Cast Aluminum)</td>
      </tr>
      <tr>
        <td class="table-key">UPS Transfer Time</td>
        <td class="table-val">&lt; 4ms (Seamless Critical Load Backup)</td>
      </tr>
      <tr>
        <td class="table-key">Warranty & Service SLA</td>
        <td class="table-val">${item.warranty || '5-Year Factory Warranty (Extendable 10-Yr with 24/7 O&M)'}</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">2. Operational Features & Grid Compliance</div>
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>System Scope & Functional Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="table-key">Generator Synchronization</td>
        <td class="table-val">Auto Genset Dry Contact Start/Stop Signal & Frequency Droop Control</td>
      </tr>
      <tr>
        <td class="table-key">Unbalanced Output</td>
        <td class="table-val">100% Phase Output Unbalance Capability (Phase Output up to 50% Rated Power)</td>
      </tr>
      <tr>
        <td class="table-key">Parallel Capability</td>
        <td class="table-val">Up to 16 Units Parallelable for Commercial Microgrid Scaling</td>
      </tr>
      <tr>
        <td class="table-key">Compliance Certifications</td>
        <td class="table-val">${item.certifications || 'CE, VDE-AR-N 4105, NRS 097-2-1, IEC 62109-1/-2, UL1741, IEEE 1547'}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <div>
      <div><strong>TOTAG Group of Companies Ltd — Solar EPC Division</strong></div>
      <div>Monrovia Plaza, Montserrado, Liberia | Email: sales@totag.network | Web: www.totag.network</div>
    </div>
    <div class="stamp">
      ✔ TOTAG AUTHORIZED DATASHEET
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // RFQ Modal State
  const [showRfqModal, setShowRfqModal] = useState<boolean>(false);
  const [rfqItem, setRfqItem] = useState<any | null>(null);
  const [rfqForm, setRfqForm] = useState({
    clientName: "",
    contactPhone: "",
    email: "",
    quantity: "1",
    projectLocation: "Monrovia",
    notes: ""
  });

  const [selectedComponentGallery, setSelectedComponentGallery] = useState<any | null>(null);
  const [deyeActiveCat, setDeyeActiveCat] = useState<string>('sp-lv');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  const { toast } = useToast();
  // Secure Staff Authentication State (Only unlocked for authenticated staff/admin)
  const [isAdminUser, setIsAdminUser] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("totagAdmin") === "true";
    }
    return false;
  });
  const [staffMode, setStaffMode] = useState<boolean>(false);
  const [showStaffLoginModal, setShowStaffLoginModal] = useState<boolean>(false);
  const [staffPassword, setStaffPassword] = useState<string>("");
  const [staffAuthError, setStaffAuthError] = useState<string>("");

  // Comprehensive Engineering Site Survey & Load Sizing Form State
  const [comprehensiveSurvey, setComprehensiveSurvey] = useState({
    facilityName: "",
    contactPerson: "",
    phone: "",
    email: "",
    county: "Montserrado",
    district: "Monrovia",
    siteAddress: "",
    gpsCoords: "",
    facilityType: "Residential (House / Villa)",
    mountingType: "Rooftop (Corrugated Metal / Zinc)",
    availableAreaSqM: "120",
    shadingCondition: "Zero Shading (Full Unobstructed Sunlight)",
    roofCondition: "Sound & Weatherproof (&lt; 5 Years Old)",
    roofOrientation: "South-Facing (15° Optimal Tilt)",
    gridStatus: "LEC Grid Available (Intermittent / Load-Shedding)",
    existingGeneratorKva: "None",
    atsRequired: "Yes - Automatic Generator Start & Transfer",
    targetCapacityKva: "10",
    autonomyHours: "12 - 16 Hours (Full Night Autonomy)",
    systemType: "Hybrid Solar + LiFePO4 Battery + LEC Sync",
    // Major Load Inventory
    inverterAcCount: "2",
    standardAcCount: "0",
    freezerCount: "2",
    waterPumpHp: "1.5 HP Submersible",
    medicalServerLoad: "Standard Office & Home Electronics",
    installationTimeline: "Immediate (Within 1-2 Weeks)",
    specialNotes: ""
  });
  const [surveySubmitting, setSurveySubmitting] = useState<boolean>(false);
  const [customerAccount, setCustomerAccount] = useState<string>("monrovia-plaza");
  const [ticketSent, setTicketSent] = useState<boolean>(false);
  const [surveySubmittedRef, setSurveySubmittedRef] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("system-sizing");
const [custSurveyForm, setCustSurveyForm] = useState({
    name: "Monrovia Commercial Plaza",
    contact: "+231 770 123 456",
    peakLoad: "25",
    nightLoad: "10",
    autonomyHours: "12",
    roofType: "Corrugated Metal Sheet (South-West 15° Pitch)"
  });

  // Unified Product Detail Formatter for Deye OEM Catalogue Items
  const getUnifiedProductDetails = (item: any) => {
    if (!item) return null;
    const name = item.name || item.seriesCode || item.modelNo || "Deye Smart Inverter";
    const modelNo = item.modelNo || item.seriesCode || item.id || "SUN-SERIES";
    const brand = item.brand || "Deye Inverter Technology Co., Ltd. (TOTAG Approved OEM)";
    const category = item.category || (item.phase ? `${item.phase} Hybrid Inverter` : "Solar Energy System");
    const warranty = item.warranty || "5-Year Manufacturer Warranty (25-Year Life Expectancy)";
    const powerRange = item.powerRange || item.specs?.split("•")[0]?.trim() || "Turnkey Sized";
    const phase = item.phase || (item.specs?.includes("Three-Phase") || item.specs?.includes("3-Phase") ? "Three-Phase 380/400V" : "Single-Phase 120/240V Split-Phase");
    const mppt = item.mppt || "2/3/4 MPPT High-Efficiency Trackers";
    const batterySupport = item.batterySupport || (item.specs?.includes("HV") ? "High-Voltage (160V-800V) LiFePO4" : "48V Low-Voltage (40V-60V) LiFePO4 & Lead-Acid");
    const dimensions = item.dimensions || "420 x 670 x 233 mm (32.0 kg Net Weight)";
    const certifications = item.certifications || "IEC/EN 62109-1/2, IEC/EN 61000-6-1/2/3/4, UL1741, IEEE 1547, CSA C22.2, IP65, CE, ISO 9001";
    const description = item.description || "State-of-the-art Deye hybrid inverter engineered for off-grid, grid-tied, and microgrid solar energy systems with seamless battery management and generator synchronization.";
    
    const photos = item.photos && item.photos.length > 0 
      ? item.photos 
      : [{ url: item.image || "/images/pv/jinko-550w-tiger-pro.png", caption: `${name} Official Render` }];

    const features = item.features || [
      "Colorful Touch LCD display with multi-language user-friendly graphical interface",
      "6 programmable time periods for smart battery charging and discharging scheduling",
      "Max. charging/discharging current up to 190A-250A with adaptive CAN/RS485 BMS communication",
      "AC coupling capability to easily retrofit existing on-grid or generator-powered systems",
      "Automatic generator start (ATS) support and smart load frequency droop control",
      "Up to 16 inverters in parallel for utility-grade scalable microgrids (on-grid & off-grid)",
      "Rugged IP65 weatherproof enclosure engineered for humid and tropical operating conditions",
      "24/7 real-time remote monitoring and automated firmware updates via Deye Cloud Telemetry & App"
    ];

    return {
      ...item,
      name,
      modelNo,
      brand,
      category,
      warranty,
      powerRange,
      phase,
      mppt,
      batterySupport,
      dimensions,
      certifications,
      description,
      photos,
      features
    };
  };

  // Interactive Solar Engineering Sizing Wizard Calculation
  const getWizardEngineeringDesign = () => {
    const effectiveCap = wizardCustomKva ? parseFloat(wizardCustomKva) || wizardCapacity : wizardCapacity;
    const is3Phase = effectiveCap >= 20;

    const facilityMap: Record<string, { label: string; icon: string; desc: string }> = {
      residential: { label: "Residential (House / Villa)", icon: "🏠", desc: "Household lighting, refrigeration, inverter ACs, water pumping & security" },
      commercial: { label: "Commercial Office / Retail Store", icon: "🏢", desc: "POS, refrigeration display, LED lights, computers, IT servers & ACs" },
      clinic: { label: "Healthcare Clinic / PHC", icon: "🏥", desc: "Vaccine cold chain, laboratory analyzers, maternity ward lighting & medical tools" },
      hospital: { label: "Hospital / Medical Center", icon: "🏥", desc: "24/7 Surgical theaters, ICU monitors, emergency diagnostics & 3-phase cooling" },
      farm: { label: "Farm & Solar Irrigation", icon: "🌾", desc: "Solar deep-well pumping, poultry incubators, processing & farm quarters" },
      industrial: { label: "Industrial Facility / Warehouse", icon: "🏭", desc: "Heavy machinery, cold storage warehouses, 3-phase motors & high bays" },
      institution: { label: "School / Church / NGO Compound", icon: "🏛️", desc: "Classroom power, computer labs, staff quarters, water supply & offices" }
    };

    const currentFacility = facilityMap[wizardFacility] || facilityMap.residential;

    let batteryMultiplier = 1.6;
    let autonomyHours = "12 - 16 Hours (Full Night)";
    if (wizardAutonomy === "essential") {
      batteryMultiplier = 1.2;
      autonomyHours = "4 - 6 Hours (Critical Loads)";
    } else if (wizardAutonomy === "offgrid") {
      batteryMultiplier = 2.5;
      autonomyHours = "24+ Hours (100% Off-Grid Independence)";
    }

    const panelKwp = (effectiveCap * 1.1).toFixed(1);
    const panelCount = Math.ceil((effectiveCap * 1100) / 550);
    const batteryKwh = (effectiveCap * batteryMultiplier).toFixed(1);

    const inverterCost = Math.round(effectiveCap * 260 + 200);
    const batteryCost = Math.round(parseFloat(batteryKwh) * 235);
    const panelCost = Math.round(panelCount * 165);
    const bosCost = Math.round(effectiveCap * 80 + 120);
    const switchgearCost = Math.round(effectiveCap * 60 + 100);
    const telemetryCost = 140;
    const installCost = Math.round(effectiveCap * 160 + 250);

    const totalCost = inverterCost + batteryCost + panelCost + bosCost + switchgearCost + telemetryCost + installCost;
    const annualKwh = Math.round(effectiveCap * 4.6 * 365 * 0.86);
    const annualFuelOffsetUsd = Math.round(annualKwh * 0.32);
    const paybackYears = (totalCost / Math.max(annualFuelOffsetUsd, 1000)).toFixed(1);
    const co2Tons = (annualKwh * 0.00067).toFixed(1);

    return {
      effectiveCap,
      is3Phase,
      currentFacility,
      autonomyHours,
      panelKwp,
      panelCount,
      batteryKwh,
      inverterCost,
      batteryCost,
      panelCost,
      bosCost,
      switchgearCost,
      telemetryCost,
      installCost,
      totalCost,
      annualKwh,
      annualFuelOffsetUsd,
      paybackYears,
      co2Tons
    };
  };

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
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pb-20">
        
        {/* Standardized Photo Carousel Hero Section */}
        <section className="mb-10">
          <SubsidiaryHeroCarousel
            badge="TOTAG Subsidiary • Solar EPC, Remote NOC & 18-Stage Lifecycle"
            titleHighlight="Solar Energy & Smart Power"
            subtitle="Turnkey solar PV EPC, lithium storage microgrids, automated BOQ costing, serialized inventory ledger, and 24/7 NOC remote monitoring telemetry."
            slides={[
              { url: "/images/solar/solar_engineer_deye_inverter.jpg", caption: "Senior Solar Engineer & Dual Deye Hybrid Inverter Power Room" },
              { url: "/images/solar/solar_deye_inverter_room.jpg", caption: "Enterprise Microgrid Power Room with Deye Inverters & Lithium Storage" },
              { url: "/images/solar/solar_roof_installation_green.jpg", caption: "Rooftop Commercial Solar Array Installation (Green Metal Roof)" },
              { url: "/images/solar/solar_roof_installation_blue.jpg", caption: "Commercial & Residential Rooftop Solar Panel Array Mount" },
              { url: "/images/solar/solar_techs_mounting_panels.jpg", caption: "Certified Solar Technicians Mounting High-Efficiency PV Modules" }
            ]}
            stats={[
              { label: "Installed Capacity", value: "18.5 MWp" },
              { label: "Storage Deployed", value: "42 MWh" },
              { label: "CO₂ Avoided", value: "14,200 Tons" }
            ]}
          />
        </section>



        {/* Main Application Module Tabs */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Dynamic Public Customer Tabs vs Internal Staff Back-Office Tabs */}
            {isAdminUser && (
              <div className="flex items-center justify-between p-3.5 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500 text-slate-950 font-black text-xs">
                    Staff & Super-Admin Console Active
                  </Badge>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    {staffMode ? "Viewing 9 Full Operational Back-Office Modules" : "Viewing Public Customer Portal"}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const next = !staffMode;
                    setStaffMode(next);
                    setActiveTab(next ? "crm-leads" : "system-sizing");
                  }}
                  className="rounded-xl text-xs font-bold border-amber-500/40 text-amber-500 hover:bg-amber-500/20"
                >
                  {staffMode ? "Switch to Customer Portal View ➔" : "Access 9 Staff Back-Office Modules ➔"}
                </Button>
              </div>
            )}

            {staffMode && isAdminUser ? (
              /* FULL 9-MODULE STAFF OPERATIONAL TABS (STRICTLY FOR AUTHENTICATED STAFF/ADMIN) */
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-9 glass-card p-1.5 border-white/60 dark:border-white/10 rounded-2xl mb-8 shadow-2xl overflow-x-auto">
                <TabsTrigger value="crm-leads" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg">
                  <Building2 className="h-4 w-4" />
                  1. CRM Leads
                </TabsTrigger>
                <TabsTrigger value="site-assessment" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg">
                  <Compass className="h-4 w-4" />
                  2. Site Audits
                </TabsTrigger>
                <TabsTrigger value="system-sizing" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg">
                  <Cpu className="h-4 w-4" />
                  3. Sizing Engine
                </TabsTrigger>
                <TabsTrigger value="catalogue-boq" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg">
                  <FileSpreadsheet className="h-4 w-4" />
                  4. Catalogue
                </TabsTrigger>
                <TabsTrigger value="auto-boq" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg">
                  <Calculator className="h-4 w-4" />
                  5. Auto-BOQ
                </TabsTrigger>
                <TabsTrigger value="procurement" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg">
                  <Truck className="h-4 w-4" />
                  6. Procurement
                </TabsTrigger>
                <TabsTrigger value="serialized-inventory" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg">
                  <Warehouse className="h-4 w-4" />
                  7. Inventory
                </TabsTrigger>
                <TabsTrigger value="project-management" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg">
                  <FolderKanban className="h-4 w-4" />
                  8. EPC Projects
                </TabsTrigger>
                <TabsTrigger value="customer-portal" className="flex items-center gap-1.5 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg">
                  <Sun className="h-4 w-4" />
                  9. NOC Telemetry
                </TabsTrigger>
              </TabsList>
            ) : (
              /* CLEAN 4-TAB PUBLIC CUSTOMER SOLUTIONS PORTAL (NOC TELEMETRY MOVED TO BACK-OFFICE) */
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 glass-card p-1.5 border-white/60 dark:border-white/10 rounded-2xl mb-8 shadow-2xl gap-1">
                <TabsTrigger value="system-sizing" className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black py-3.5 rounded-xl text-slate-700 dark:text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                  <Sparkles className="h-4 w-4" />
                  <span>1. Sizing Wizard & Instant Quotes</span>
                </TabsTrigger>
                <TabsTrigger value="catalogue-boq" className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black py-3.5 rounded-xl text-slate-700 dark:text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>2. Approved Deye Catalogue</span>
                </TabsTrigger>
                <TabsTrigger value="site-survey" className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black py-3.5 rounded-xl text-slate-700 dark:text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                  <Compass className="h-4 w-4" />
                  <span>3. Engineering Site Survey</span>
                </TabsTrigger>
                <TabsTrigger value="gallery-view" className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black py-3.5 rounded-xl text-slate-700 dark:text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                  <Camera className="h-4 w-4" />
                  <span>4. Authentic Installations</span>
                </TabsTrigger>
              </TabsList>
            )}

        {/* AUTHENTIC SOLAR EPC INSTALLATION PHOTOGRAPHY GALLERY SHOWCASE (HIGH DEFINITION CLARITY) */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentic Solar EPC & Inverter Installations Gallery</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High-definition solar engineering & power room installation photography from TOTAG sites</p>
                </div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-500 text-[10px] font-bold">
                5 EPC Microgrids
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { title: "Senior Engineer & Dual Deye", img: "/images/solar/solar_engineer_deye_inverter.jpg", tag: "Power Room NOC" },
                { title: "Deye Hybrid Power Room", img: "/images/solar/solar_deye_inverter_room.jpg", tag: "Lithium Bank & AC/DC" },
                { title: "Rooftop Commercial PV", img: "/images/solar/solar_roof_installation_green.jpg", tag: "Green Metal Roof Mount" },
                { title: "Residential Array Mount", img: "/images/solar/solar_roof_installation_blue.jpg", tag: "Blue Metallic Roof" },
                { title: "PV Module Engineers", img: "/images/solar/solar_techs_mounting_panels.jpg", tag: "High-Efficiency PV" }
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
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">{item.tag}</span>
                    <span className="text-xs font-black text-white truncate block">{item.title}</span>
                    <span className="text-[8px] text-slate-300 font-semibold block mt-0.5 group-hover:text-amber-400 transition-colors">Click for Full-Res HD ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


            {/* MODULE 1: Solar CRM, Leads & Opportunity Management */}
            <TabsContent value="crm-leads" className="space-y-8">
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Header & Pipeline KPI Cards */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
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
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Solar CRM, Leads & Opportunity Pipeline</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">This is where every opportunity begins — Managing residential, commercial, government, UN, NGO, and RFQ tenders.</p>
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
                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-slate-400">TOTAL PIPELINE VALUE</span>
                    <div className="text-2xl font-black text-amber-400">
                      ${leadsList.reduce((acc, l) => acc + (l.estimatedValueUsd || 0), 0).toLocaleString()} USD
                    </div>
                    <span className="text-[11px] text-slate-500">Unweighted Opportunity Sum</span>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-slate-400">WEIGHTED PIPELINE FORECAST</span>
                    <div className="text-2xl font-black text-emerald-400">
                      ${leadsList.reduce((acc, l) => acc + (l.estimatedValueUsd * (l.probabilityPct / 100)), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                    </div>
                    <span className="text-[11px] text-slate-500">Probability-Weighted Revenue</span>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-slate-400">UN & GOVT TENDERS / RFQs</span>
                    <div className="text-2xl font-black text-sky-400">
                      {leadsList.filter(l => l.customerCategory === 'UN Organization' || l.customerCategory === 'Government Agency' || l.customerCategory === 'Tender/RFQ/RFP').length}
                    </div>
                    <span className="text-[11px] text-slate-500">High-Value Institutional RFQs</span>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
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
                        <div key={idx} className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 rounded-xl space-y-1 text-center">
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
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${leadCategoryFilter === cat ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-200 dark:border-white/10'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 dark:border-white/10">
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
                                <div className="font-black text-slate-900 dark:text-white">{lead.customerName || "Unnamed Client"}</div>
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
                                  className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-amber-400 font-medium rounded p-1 text-[11px] font-bold"
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
                    <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white">Create New Solar EPC Lead / Opportunity</h3>
                          <p className="text-xs text-slate-400">Capture comprehensive customer profile, GIS coordinates, electrical baseline, and budget.</p>
                        </div>
                        <button onClick={() => setShowNewLeadModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold">Customer / Institution Name *</Label>
                          <Input value={newLead.customerName} onChange={(e) => setNewLead({ ...newLead, customerName: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" placeholder="e.g. UNDP Liberia / Monrovia Plaza" />
                        </div>
                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold">Customer Category *</Label>
                          <select value={newLead.customerCategory} onChange={(e) => setNewLead({ ...newLead, customerCategory: e.target.value as SolarLeadItem["customerCategory"] })} className="w-full bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-white rounded-lg p-2.5 mt-1 font-semibold">
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
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold">Contact Person Name</Label>
                          <Input value={newLead.contactPerson} onChange={(e) => setNewLead({ ...newLead, contactPerson: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" placeholder="e.g. Mr. Joseph Sirleaf" />
                        </div>
                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold">Phone / Email Contact</Label>
                          <Input value={newLead.phoneEmail} onChange={(e) => setNewLead({ ...newLead, phoneEmail: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" placeholder="+231 770 000 000 / email@domain.com" />
                        </div>

                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold">County & District</Label>
                          <Input value={`${newLead.county}, ${newLead.district}`} onChange={(e) => setNewLead({ ...newLead, county: e.target.value.split(',')[0] || 'Montserrado' })} className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" placeholder="e.g. Montserrado, Monrovia" />
                        </div>
                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold">GPS Coordinates</Label>
                          <Input value={newLead.gpsCoords} onChange={(e) => setNewLead({ ...newLead, gpsCoords: e.target.value })} className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" placeholder="6.3150° N, 10.8072° W" />
                        </div>

                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold">Estimated Peak Load (kW)</Label>
                          <Input type="number" value={newLead.estimatedLoadKw} onChange={(e) => setNewLead({ ...newLead, estimatedLoadKw: parseFloat(e.target.value) || 10 })} className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" />
                        </div>
                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold">Existing Electricity Source</Label>
                          <select value={newLead.electricitySource} onChange={(e) => setNewLead({ ...newLead, electricitySource: e.target.value as SolarLeadItem["electricitySource"] })} className="w-full bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-white rounded-lg p-2.5 mt-1 font-semibold">
                            <option value="LEC Grid Only">LEC Grid Only</option>
                            <option value="Diesel Generator Only">Diesel Generator Only</option>
                            <option value="Off-Grid / None">Off-Grid / None</option>
                            <option value="Legacy Solar System">Legacy Solar System</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold">Procurement Method</Label>
                          <select value={newLead.procurementMethod} onChange={(e) => setNewLead({ ...newLead, procurementMethod: e.target.value as SolarLeadItem["procurementMethod"] })} className="w-full bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-white rounded-lg p-2.5 mt-1 font-semibold">
                            <option value="Direct Purchase">Direct Purchase</option>
                            <option value="Tender / RFQ">Tender / RFQ</option>
                            <option value="Solar Lease">Solar Lease</option>
                            <option value="Power Purchase Agreement (PPA)">Power Purchase Agreement (PPA)</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold">Estimated Project Value ($ USD)</Label>
                          <Input type="number" value={newLead.estimatedValueUsd} onChange={(e) => setNewLead({ ...newLead, estimatedValueUsd: parseFloat(e.target.value) || 10000 })} className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-white/10 pt-4">
                        <Button variant="outline" onClick={() => setShowNewLeadModal(false)} className="bg-slate-950 border-slate-200 dark:border-white/10 text-slate-300">Cancel</Button>
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
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                
                <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      Module 2: Field Engineering Assessment Suite
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
                      Mobile & Tablet Optimized
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Solar Site Assessment & Granular Energy Audit</h2>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Technicians perform on-site audits to inspect structural capacity, shading horizon, electrical MDB, earthing, and itemized load consumption.</p>
                </div>

                {/* 12 Field Inspection Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>1. GPS CAPTURE & SITE COORDS</span>
                      <MapPin className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.gpsCaptured} onChange={(e) => setFieldAssessment({ ...fieldAssessment, gpsCaptured: e.target.value })} className="bg-slate-900 border-slate-200 dark:border-white/10 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Auto-geofenced coordinates for Liberian solar irradiance mapping (4.6 kWh/m²/day).</p>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>2. ROOF STRUCTURE ASSESSMENT</span>
                      <Building2 className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.roofStructure} onChange={(e) => setFieldAssessment({ ...fieldAssessment, roofStructure: e.target.value })} className="bg-slate-900 border-slate-200 dark:border-white/10 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Corrugated zinc, concrete slab, tilt angle, structural rafter integrity.</p>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>3. GROUND-MOUNT FOOTPRINT</span>
                      <Compass className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.groundMountArea} onChange={(e) => setFieldAssessment({ ...fieldAssessment, groundMountArea: e.target.value })} className="bg-slate-900 border-slate-200 dark:border-white/10 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Available land footprint, soil compaction, and drainage clearance.</p>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>4. SHADING & SUN PATH HORIZON</span>
                      <Sun className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.shadingHorizon} onChange={(e) => setFieldAssessment({ ...fieldAssessment, shadingHorizon: e.target.value })} className="bg-slate-900 border-slate-200 dark:border-white/10 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Tree obstruction, adjacent building shadow analysis from 08:00 to 17:30.</p>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>5. MAIN DISTRIBUTION BOARD (MDB)</span>
                      <Cpu className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.mdbPhaseRating} onChange={(e) => setFieldAssessment({ ...fieldAssessment, mdbPhaseRating: e.target.value })} className="bg-slate-900 border-slate-200 dark:border-white/10 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Single-phase 230V or Three-phase 400V breaker ratings & busbar capacity.</p>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>6. EARTHING & SURGE RESISTANCE</span>
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                    </div>
                    <Input value={fieldAssessment.earthingOhms} onChange={(e) => setFieldAssessment({ ...fieldAssessment, earthingOhms: e.target.value })} className="bg-slate-900 border-slate-200 dark:border-white/10 text-xs text-white" />
                    <p className="text-[11px] text-slate-400">Grounding rod resistance measured in Ohms (Must be &lt; 5.0 Ω for inverter safety).</p>
                  </div>
                </div>

                {/* Granular Equipment Load Audit Table */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-amber-400" />
                        <span>Granular Itemized Load Audit Engine</span>
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Every equipment item is entered separately to compute actual Peak Demand (kW), Daily kWh, and Autonomy Battery Storage.</p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                      <span className="bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-white/10 text-amber-400">
                        Connected: {(auditLoads.reduce((a, b) => a + (b.qty * b.watts), 0) / 1000).toFixed(2)} kW
                      </span>
                      <span className="bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-white/10 text-emerald-400">
                        Daily Energy: {auditLoads.reduce((a, b) => a + (b.qty * b.watts * b.hours * b.factor / 1000), 0).toFixed(1)} kWh/day
                      </span>
                    </div>
                  </div>

                  {/* Add Equipment Form */}
                  <form onSubmit={handleAddLoad} className="bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end text-xs font-semibold">
                    <div>
                      <Label className="text-slate-700 dark:text-slate-300 font-semibold">Equipment Name</Label>
                      <Input value={newLoad.name} onChange={(e) => setNewLoad({ ...newLoad, name: e.target.value })} placeholder="e.g. Cold Storage Freezer" className="bg-slate-900 border-slate-200 dark:border-white/10 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-slate-700 dark:text-slate-300 font-semibold">Quantity</Label>
                      <Input type="number" min="1" value={newLoad.qty} onChange={(e) => setNewLoad({ ...newLead, qty: parseInt(e.target.value) || 1 })} className="bg-slate-900 border-slate-200 dark:border-white/10 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-slate-700 dark:text-slate-300 font-semibold">Rated Watts (W)</Label>
                      <Input type="number" min="1" value={newLoad.watts} onChange={(e) => setNewLoad({ ...newLoad, watts: parseInt(e.target.value) || 100 })} className="bg-slate-900 border-slate-200 dark:border-white/10 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-slate-700 dark:text-slate-300 font-semibold">Operating Hours/Day</Label>
                      <Input type="number" min="1" max="24" value={newLoad.hours} onChange={(e) => setNewLoad({ ...newLoad, hours: parseInt(e.target.value) || 8 })} className="bg-slate-900 border-slate-200 dark:border-white/10 text-white mt-1" />
                    </div>
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black">
                      + Add Equipment
                    </Button>
                  </form>

                  {/* Audit Loads Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 dark:border-white/10">
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
                                <span className="px-2 py-0.5 rounded bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-emerald-400 font-bold">{Math.round(item.factor * 100)}%</span>
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
                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
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
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Client Asset Monitoring & Solar Control Center</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Real-time solar PV generation, LiFePO4 battery SoC, diesel cost savings, and on-demand site survey request engine.</p>
                  </div>

                  {/* Customer Account Switcher */}
                  <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-white/10 w-full md:w-auto">
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
                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-2 relative overflow-hidden">
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

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-2 relative overflow-hidden">
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

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-2 relative overflow-hidden">
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

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-2 relative overflow-hidden">
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
                <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
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
                <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
                  <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-amber-400" />
                      <span>Request Comprehensive Site Survey & Engineering Quote</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Submit your facility energy profile. TOTAG Solar Engineers perform shading analysis and deliver tailored system sizing.</p>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-slate-300">
                    <div>
                      <Label className="text-slate-300 text-xs font-bold">Facility / Project Name:</Label>
                      <Input 
                        value={custSurveyForm.name}
                        onChange={(e) => setCustSurveyForm({ ...custSurveyForm, name: e.target.value })}
                        className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300 text-xs font-bold">Peak Daytime Load (kW):</Label>
                        <Input 
                          type="number"
                          value={custSurveyForm.peakLoad}
                          onChange={(e) => setCustSurveyForm({ ...custSurveyForm, peakLoad: e.target.value })}
                          className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" 
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300 text-xs font-bold">Night Load Demand (kW):</Label>
                        <Input 
                          type="number"
                          value={custSurveyForm.nightLoad}
                          onChange={(e) => setCustSurveyForm({ ...custSurveyForm, nightLoad: e.target.value })}
                          className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" 
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
                          className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" 
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300 text-xs font-bold">Direct Phone / WhatsApp:</Label>
                        <Input 
                          value={custSurveyForm.contact}
                          onChange={(e) => setCustSurveyForm({ ...custSurveyForm, contact: e.target.value })}
                          className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" 
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300 text-xs font-bold">Roof Structure & Pitch Orientation:</Label>
                      <Input 
                        value={custSurveyForm.roofType}
                        onChange={(e) => setCustSurveyForm({ ...custSurveyForm, roofType: e.target.value })}
                        className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-medium" 
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
                <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl flex flex-col justify-between">
                  <div>
                    <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span>Instant Sizing Preview & Financial ROI</span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Real-timeLiberian solar radiance model (4.6 PSH/day) calculated for your requested energy profile.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 font-bold">RECOMMENDED PV ARRAY</div>
                        <div className="text-2xl font-black text-amber-400 mt-1">
                          {(parseFloat(custSurveyForm.peakLoad || '10') * 1.25).toFixed(1)} kWp
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-1">
                          Requires {Math.ceil((parseFloat(custSurveyForm.peakLoad || '10') * 1.25 * 1000) / 550)}x Tier-1 550W Panels
                        </div>
                      </div>

                      <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 font-bold">LiFePO4 BATTERY STORAGE</div>
                        <div className="text-2xl font-black text-emerald-400 mt-1">
                          {(parseFloat(custSurveyForm.nightLoad || '5') * parseFloat(custSurveyForm.autonomyHours || '10') / 0.8).toFixed(1)} kWh
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-1">
                          48V 100Ah Rack Modules (80% DoD)
                        </div>
                      </div>

                      <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 font-bold">MONTHLY DIESEL SAVED</div>
                        <div className="text-2xl font-black text-sky-400 mt-1">
                          ${(parseFloat(custSurveyForm.peakLoad || '10') * 95).toFixed(0)} USD
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-1">
                          ~{Math.round(parseFloat(custSurveyForm.peakLoad || '10') * 58)} Liters fuel offset/month
                        </div>
                      </div>

                      <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl">
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
                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-3">
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

            {/* MODULE 3: Interactive Smart Solar System Sizing & Custom Engineering Wizard */}
            <TabsContent value="system-sizing" className="space-y-8">
              
              {/* Clean Sizing Wizard Container */}
              <div className="glass-card border-white/60 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 bg-white/95 dark:bg-slate-950/95">
                
                {/* Header Banner */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Custom Solar Engineering Design Wizard
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-black">
                        Dynamic Question Flow (Zero Clutter)
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Interactive Solar Power Sizing & Custom Design</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">Answer 4 quick questions below to generate an exact, custom-engineered Bill of Quantities (BOQ), equipment sizing, and turnkey investment.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => {
                        setWizardFacility("residential");
                        setWizardCapacity(5);
                        setWizardCustomKva("");
                        setWizardAutonomy("overnight");
                        setWizardGridMode("hybrid");
                        setWizardStep(1);
                        toast({ title: "Wizard Reset", description: "Design parameters cleared." });
                      }}
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl text-xs font-bold border-slate-300 dark:border-slate-700"
                    >
                      Reset Questionnaire
                    </Button>
                  </div>
                </div>

                {/* 4-STEP INTERACTIVE QUESTIONNAIRE */}
                <div className="space-y-6 bg-slate-50 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/5">
                  
                  {/* STEP 1: Facility Type */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                      <span>Where will this solar system be installed? (Facility Type)</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                      {[
                        { id: "residential", label: "House / Home", icon: "🏠" },
                        { id: "commercial", label: "Store / Office", icon: "🏢" },
                        { id: "clinic", label: "Health Clinic", icon: "🏥" },
                        { id: "hospital", label: "Hospital", icon: "🏥" },
                        { id: "farm", label: "Farm / Pump", icon: "🌾" },
                        { id: "industrial", label: "Industrial", icon: "🏭" },
                        { id: "institution", label: "School / NGO", icon: "🏛️" }
                      ].map((fac) => (
                        <div
                          key={fac.id}
                          onClick={() => setWizardFacility(fac.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-1.5 ${
                            wizardFacility === fac.id
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-md scale-105"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300 font-semibold"
                          }`}
                        >
                          <span className="text-2xl">{fac.icon}</span>
                          <span className="text-xs">{fac.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STEP 2: Desired Capacity / Load */}
                  <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                        <span>Select your target capacity (kVA / kW):</span>
                      </div>
                      {wizardCustomKva && (
                        <Badge className="bg-amber-500 text-slate-950 font-bold text-xs">Custom {wizardCustomKva} kVA Active</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-2.5">
                      {[3, 5, 10, 15, 30, 50, 100].map((capVal) => (
                        <button
                          key={capVal}
                          type="button"
                          onClick={() => {
                            setWizardCapacity(capVal);
                            setWizardCustomKva("");
                          }}
                          className={`py-3 px-2 rounded-2xl border text-xs transition-all flex flex-col items-center justify-center ${
                            wizardCapacity === capVal && !wizardCustomKva
                              ? "bg-emerald-600 text-white font-extrabold shadow-lg scale-105 border-emerald-600"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-slate-800 dark:text-slate-200 font-semibold"
                          }`}
                        >
                          <span className="text-sm font-black">{capVal} kVA</span>
                          <span className="text-[10px] opacity-80">{capVal} kW</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Capacity Input */}
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xs text-slate-500 font-bold whitespace-nowrap">Or specify custom capacity:</span>
                      <Input
                        type="number"
                        placeholder="e.g. 8, 20, 45 kVA"
                        value={wizardCustomKva}
                        onChange={(e) => setWizardCustomKva(e.target.value)}
                        className="max-w-[180px] rounded-xl text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                      />
                      <span className="text-xs text-slate-400 font-medium">kVA</span>
                    </div>
                  </div>

                  {/* STEP 3: Storage Autonomy */}
                  <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
                      <span>What is your battery backup duration goal?</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "essential", title: "🌙 Essential Evening Backup", desc: "4 to 6 hours for nighttime lighting, refrigeration & security", badge: "1.2x Battery" },
                        { id: "overnight", title: "🔋 Full Overnight Autonomy", desc: "12 to 16 hours for continuous evening ACs, TV, pumps & refrigeration", badge: "1.6x Battery (Recommended)" },
                        { id: "offgrid", title: "⚡ 24/7 100% Off-Grid Independence", desc: "24+ hours complete autonomy with zero generator reliance", badge: "2.5x Heavy Battery" }
                      ].map((auto) => (
                        <div
                          key={auto.id}
                          onClick={() => setWizardAutonomy(auto.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                            wizardAutonomy === auto.id
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md font-extrabold"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300 font-semibold"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-black">{auto.title}</h5>
                            <Badge variant="outline" className="text-[9px]">{auto.badge}</Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">{auto.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STEP 4: Power Source Integration */}
                  <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
                      <span>How should the system connect with grid or generator?</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "hybrid", title: "☀️ Hybrid Solar + LEC Grid Sync", desc: "Syncs with LEC grid, prioritizes solar first, exports or cuts bills" },
                        { id: "generator", title: "⚙️ Solar + Auto-Generator Start (ATS)", desc: "Auto-starts generator only during prolonged rain storms when batteries reach 20%" },
                        { id: "pure_offgrid", title: "🌿 100% Pure Off-Grid Solar", desc: "Completely standalone microgrid with zero grid or generator dependence" }
                      ].map((grid) => (
                        <div
                          key={grid.id}
                          onClick={() => setWizardGridMode(grid.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                            wizardGridMode === grid.id
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md font-extrabold"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300 font-semibold"
                          }`}
                        >
                          <h5 className="text-xs font-black">{grid.title}</h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">{grid.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* DYNAMICALLY GENERATED CUSTOM ENGINEERING DESIGN CARD */}
                {(() => {
                  const eng = getWizardEngineeringDesign();
                  return (
                    <div className="space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl">
                      
                      {/* Title & Investment Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{eng.currentFacility.icon}</span>
                            <Badge className="bg-emerald-600 text-white font-black text-xs">Custom Engineered Solution</Badge>
                            <Badge variant="outline" className="text-xs">{eng.autonomyHours}</Badge>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                            {eng.effectiveCap} kVA Turnkey Solar Power System ({eng.currentFacility.label})
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            {eng.currentFacility.desc}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right shrink-0">
                          <span className="text-[10px] uppercase font-extrabold text-slate-500 dark:text-slate-400 block">
                            ESTIMATED TURNKEY INVESTMENT
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                            ${eng.totalCost.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold mt-0.5">
                            All-Inclusive: Panels, Inverter, Battery, BOS & Labor
                          </span>
                        </div>
                      </div>

                      {/* Equipment Bill of Quantities (BOQ) Breakdown */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          <span>Custom Sized Bill of Quantities & Engineering Components:</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                          
                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                            <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                              <span>1. {eng.is3Phase ? "3-Phase Inverter" : "Hybrid Inverter"} (1 Unit)</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black">${eng.inverterCost.toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {eng.effectiveCap}.0 kW Deye / Pure Sine Wave {eng.is3Phase ? "3-Phase 380V" : "48V"} Inverter (Dual MPPT, Auto-Transfer)
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                            <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                              <span>2. LiFePO4 Battery Bank (1 Bank)</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black">${eng.batteryCost.toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {eng.batteryKwh} kWh LiFePO4 Lithium Iron Phosphate Storage with Smart Integrated BMS ({eng.autonomyHours})
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                            <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                              <span>3. Solar PV Array ({eng.panelCount} Pcs)</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black">${eng.panelCost.toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {eng.panelCount}x 550W Tier-1 Monocrystalline PERC Solar Panels ({eng.panelKwp} kWp Total Generation)
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                            <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                              <span>4. Balance of System (1 Set)</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black">${eng.bosCost.toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              Anodized Aluminum Mounting Racks, 4mm²/6mm² UV DC Solar Cabling, MC4 Connectors & Cable Trays
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                            <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                              <span>5. Protection Switchgear (1 Set)</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black">${eng.switchgearCost.toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              Pre-wired AC/DC Combiner Distribution Box, Type II Surge Protection (SPD), DC Breakers & Copper Ground Earthing
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                            <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                              <span>6. Telemetry & Labor (Turnkey)</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black">${(eng.telemetryCost + eng.installCost).toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              24/7 Deye WiFi/GSM NOC Telemetry, Delivery across Liberia, Installation, Testing & 5-Year Warranty
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* Performance & Financial Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Annual Generation</span>
                          <span className="text-base font-black text-slate-900 dark:text-white">{eng.annualKwh.toLocaleString()} kWh/yr</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Annual Fuel Savings</span>
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">${eng.annualFuelOffsetUsd.toLocaleString()} USD/yr</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Estimated Payback</span>
                          <span className="text-base font-black text-purple-600 dark:text-purple-400">{eng.paybackYears} Years</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Carbon Avoided</span>
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{eng.co2Tons} Tons CO₂/yr</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                        <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
                          Compliant with international IEC standards, UNGM, and Ministry of Energy regulations.
                        </p>

                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                          <Button 
                            onClick={() => {
                              setShowProformaModal(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs w-full sm:w-auto shadow-md"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            Request Official Proforma Invoice
                          </Button>
                          <Button 
                            onClick={() => {
                              window.location.href = `tel:+231777511391`;
                            }}
                            variant="outline" 
                            className="border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold w-full sm:w-auto"
                          >
                            Call Solar Engineering Desk
                          </Button>
                        </div>
                      </div>

                    </div>
                  );
                })()}

              </div>
            </TabsContent>

                        {/* MODULE: Comprehensive Engineering Site Survey & Feasibility Request (Customer Tab 3) */}
            <TabsContent value="site-survey" className="space-y-8">
              <div className="glass-card border-white/60 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 bg-white/95 dark:bg-slate-950/95">
                
                {/* Header Banner */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-emerald-500" />
                        Comprehensive Site Survey & Engineering Feasibility
                      </span>
                      <Badge className="bg-amber-500 text-slate-950 font-black text-xs">
                        Free Technical Evaluation
                      </Badge>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      Request a Professional Solar Engineering Site Survey
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                      Provide your facility's mounting structure, surface dimensions, shading, existing grid/generator setup, and major loads. Our certified engineers will deliver a certified PVsyst yield analysis and turnkey proposal.
                    </p>
                  </div>
                </div>

                {surveySubmittedRef ? (
                  /* Success Confirmation Banner */
                  <div className="p-8 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-3xl shadow-xl">
                      ✓
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Site Survey Request Successfully Logged!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                      Your technical survey dossier has been assigned Reference Number <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">#{surveySubmittedRef}</span> and dispatched to our Lead Solar Engineering Desk. A certified technician will reach out to schedule site inspection.
                    </p>
                    <div className="pt-2">
                      <Button
                        onClick={() => setSurveySubmittedRef(null)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                      >
                        Submit Another Survey Request
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Comprehensive Multi-Section Engineering Survey Form */
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSurveySubmitting(true);
                      const refId = `SURV-LIB-${Date.now().toString().slice(-6)}`;
                      setTimeout(() => {
                        setSurveySubmitting(false);
                        setSurveySubmittedRef(refId);
                        toast({
                          title: "Site Survey Dossier Logged",
                          description: `Survey Reference #${refId} created and dispatched to Engineering Team.`,
                        });
                      }, 700);
                    }} 
                    className="space-y-8"
                  >
                    
                    {/* SECTION 1: Client & Installation Site Location */}
                    <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>1. Client Information & Geographical Location</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Facility / Project Name *</Label>
                          <Input
                            placeholder="e.g. Mamba Point Hotel / Private Residence"
                            value={comprehensiveSurvey.facilityName}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, facilityName: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Person Name *</Label>
                          <Input
                            placeholder="e.g. John Doe / Facilities Manager"
                            value={comprehensiveSurvey.contactPerson}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, contactPerson: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Direct Phone / WhatsApp *</Label>
                          <Input
                            placeholder="+231 777 511 391"
                            value={comprehensiveSurvey.phone}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, phone: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</Label>
                          <Input
                            type="email"
                            placeholder="client@organization.com"
                            value={comprehensiveSurvey.email}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, email: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">County Location in Liberia *</Label>
                          <select
                            value={comprehensiveSurvey.county}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, county: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
                          >
                            {["Montserrado", "Nimba", "Bong", "Margibi", "Grand Bassa", "Lofa", "Maryland", "Sinoe", "Grand Gedeh", "Bomi", "Grand Cape Mount", "Rivercess", "River Gee", "Gbarpolu", "Grand Kru"].map((c) => (
                              <option key={c} value={c}>{c} County</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">City / District / Community *</Label>
                          <Input
                            placeholder="e.g. Paynesville, Sinkor, Buchanan, Ganta"
                            value={comprehensiveSurvey.district}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, district: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                            required
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Street Address & Landmark *</Label>
                          <Input
                            placeholder="e.g. Thinker's Village Community, Near Total Gas Station"
                            value={comprehensiveSurvey.siteAddress}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, siteAddress: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: Mounting Type, Roof Specs & Shading Assessment */}
                    <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">
                        <HardHat className="w-4 h-4 text-amber-500" />
                        <span>2. Mounting Structure, Roof Type & Surface Area</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mounting Installation Type *</Label>
                          <select
                            value={comprehensiveSurvey.mountingType}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, mountingType: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
                          >
                            <option value="Rooftop (Corrugated Metal / Zinc)">🏠 Rooftop — Corrugated Zinc / Metal Sheet</option>
                            <option value="Rooftop (Clay Tile / Decra)">🏠 Rooftop — Decra / Clay Tile</option>
                            <option value="Rooftop (Concrete Flat Roof / Ballasted)">🏢 Rooftop — Flat Concrete Slab (Ballasted Racks)</option>
                            <option value="Ground Mount / Open Field">🌾 Ground Mount — Open Field / Yard Mount</option>
                            <option value="Solar Carport / Parking Canopy">🚗 Solar Carport / Parking Canopy Structure</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Estimated Usable Surface Area (m²)</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 80, 150, 300 m²"
                            value={comprehensiveSurvey.availableAreaSqM}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, availableAreaSqM: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Shading & Sun Obstruction Assessment *</Label>
                          <select
                            value={comprehensiveSurvey.shadingCondition}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, shadingCondition: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
                          >
                            <option value="Zero Shading (Full Unobstructed Sunlight)">☀️ Zero Shading (Full Unobstructed 100% Sun All Day)</option>
                            <option value="Partial Morning Shading (Nearby Trees)">🌤️ Partial Morning Shading (Trees/Buildings)</option>
                            <option value="Partial Afternoon Shading">🌤️ Partial Late Afternoon Shading</option>
                            <option value="Heavy Shading (Requires Tree Trimming)">🌳 Heavy Shading (Requires Tree Trimming)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Roof Structural Age & Integrity</Label>
                          <select
                            value={comprehensiveSurvey.roofCondition}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, roofCondition: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
                          >
                            <option value="Sound & Weatherproof (&lt; 5 Years Old)">✅ Sound & Weatherproof (&lt; 5 Years Old)</option>
                            <option value="Good Condition (5-15 Years Old)">⚠️ Good Condition (5-15 Years Old)</option>
                            <option value="Older Roof (May Require Rafter Reinforcement)">🔨 Older Roof (May Require Rafter Reinforcement)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Roof Pitch & Azimuth Orientation</Label>
                          <select
                            value={comprehensiveSurvey.roofOrientation}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, roofOrientation: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
                          >
                            <option value="South-Facing (15° Optimal Tilt)">🧭 Facing South (Optimal 15° Pitch)</option>
                            <option value="East / West Dual Pitch">🧭 East / West Dual Pitch</option>
                            <option value="Flat Surface (Adjustable Aluminum Racks)">🧭 Flat Roof (Custom Tilt Racks Required)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Facility Type</Label>
                          <select
                            value={comprehensiveSurvey.facilityType}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, facilityType: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
                          >
                            <option value="Residential (House / Villa)">🏠 Residential (House / Villa)</option>
                            <option value="Commercial (Store / Office / Plaza)">🏢 Commercial (Store / Office / Plaza)</option>
                            <option value="Healthcare (Clinic / Hospital)">🏥 Healthcare (Clinic / Hospital)</option>
                            <option value="Farm / Solar Water Pumping">🌾 Farm / Solar Water Pumping</option>
                            <option value="Industrial / Warehouse">🏭 Industrial / Warehouse</option>
                            <option value="School / NGO Compound">🏛️ School / NGO Compound</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: Current Electricity Source & Generator Integration */}
                    <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">
                        <Zap className="w-4 h-4 text-sky-500" />
                        <span>3. Existing Electricity Grid, Genset & Backup Profile</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current LEC Grid Status *</Label>
                          <select
                            value={comprehensiveSurvey.gridStatus}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, gridStatus: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
                          >
                            <option value="LEC Grid Available (Intermittent / Load-Shedding)">⚡ LEC Grid Available (Intermittent / Daily Outages)</option>
                            <option value="LEC Grid Available (Stable 18+ Hours)">⚡ LEC Grid Available (Stable 18+ Hours)</option>
                            <option value="Zero Grid (100% Standalone Off-Grid Site)">🌿 Zero LEC Grid (100% Standalone Off-Grid Site)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Existing Backup Generator (kVA / kW)</Label>
                          <Input
                            placeholder="e.g. 15 kVA Perkins Diesel / None"
                            value={comprehensiveSurvey.existingGeneratorKva}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, existingGeneratorKva: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Automatic Generator ATS Integration</Label>
                          <select
                            value={comprehensiveSurvey.atsRequired}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, atsRequired: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
                          >
                            <option value="Yes - Automatic Generator Start & Transfer">⚙️ Yes — Auto Generator Start & Smart ATS</option>
                            <option value="No - Manual Transfer Switch Only">🔧 No — Manual Transfer Switch Only</option>
                            <option value="Not Applicable (Pure Solar & Battery)">🌿 Not Applicable (Pure Solar & Battery Only)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: Major Electrical Loads Inventory */}
                    <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">
                        <Cpu className="w-4 h-4 text-purple-500" />
                        <span>4. Critical Heavy Equipment & Appliance Inventory</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Inverter Air Conditioners (Qty)</Label>
                          <Input
                            placeholder="e.g. 2 Units (1.5 HP each)"
                            value={comprehensiveSurvey.inverterAcCount}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, inverterAcCount: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Deep Freezers / Refrigerators</Label>
                          <Input
                            placeholder="e.g. 2 Chest Freezers"
                            value={comprehensiveSurvey.freezerCount}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, freezerCount: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Submersible Water Pumps (HP)</Label>
                          <Input
                            placeholder="e.g. 1.0 HP or 2.0 HP Pump"
                            value={comprehensiveSurvey.waterPumpHp}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, waterPumpHp: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Solar Capacity (kVA)</Label>
                          <Input
                            placeholder="e.g. 5, 10, 15, 30 kVA"
                            value={comprehensiveSurvey.targetCapacityKva}
                            onChange={(e) => setComprehensiveSurvey({ ...comprehensiveSurvey, targetCapacityKva: e.target.value })}
                            className="rounded-xl text-xs bg-white dark:bg-slate-950"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 5: Submission & Scheduling */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                      <p className="text-xs text-slate-500 font-medium">
                        TOTAG Engineers adhere to IEEE 1547 and Liberian Electrical Code guidelines. Site visits scheduled within 48 business hours.
                      </p>

                      <Button
                        type="submit"
                        disabled={surveySubmitting}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 px-8 rounded-2xl shadow-xl flex items-center justify-center gap-2 shrink-0"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>{surveySubmitting ? "Logging Survey Dossier..." : "Submit Site Survey & Feasibility Request ➔"}</span>
                      </Button>
                    </div>

                  </form>
                )}

              </div>
            </TabsContent>

            {/* MODULE: Authentic Installations Gallery (Customer Tab 4) */}
            <TabsContent value="gallery-view" className="space-y-8">
              <div className="bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
                <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                      <Camera className="w-6 h-6 text-amber-500" />
                      <span>Authentic Solar EPC & Inverter Installations Gallery</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      High-definition solar engineering & power room installation photography from completed TOTAG projects across Liberia.
                    </p>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-black text-xs px-3 py-1 self-start sm:self-auto">
                    Verified TOTAG EPC Sites
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { title: "Senior Engineer & Dual Deye", img: "/images/solar/solar_engineer_deye_inverter.jpg", tag: "Power Room NOC" },
                    { title: "Deye Hybrid Power Room", img: "/images/solar/solar_deye_inverter_room.jpg", tag: "Lithium Bank & AC/DC" },
                    { title: "Rooftop Commercial PV", img: "/images/solar/solar_worker_green_roof.jpg", tag: "Green Metal Roof Mount" },
                    { title: "Residential Array Mount", img: "/images/solar/solar_worker_blue_roof.jpg", tag: "Blue Metallic Roof" },
                    { title: "PV Module Engineers", img: "/images/solar/solar_workers_blue_roof_angle2.jpg", tag: "High-Efficiency PV" },
                  ].map((item, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-950 aspect-[4/3] shadow-md hover:scale-[1.02] transition-transform">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-3.5">
                        <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">{item.tag}</span>
                        <h4 className="text-white font-bold text-xs">{item.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* MODULE 4: Approved Technical Catalogue & Equipment Specification Database */}
            {/* MODULE 4: Approved Technical Catalogue & Equipment Specification Database (Deye OEM Architecture) */}
            <TabsContent value="catalogue-boq" className="space-y-8">
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Header Banner */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
                        Module 4: Technical Equipment Catalogue
                      </span>
                      <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-black">
                        Official Deye OEM Partner Showcase
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">TOTAG Approved Component & Technical Specification Catalogue</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Certified technical specifications, power ranges, MPPT configurations, and high-resolution photo render galleries for Deye hybrid inverters, PV modules, LiFePO4 batteries, and switchgear.</p>
                  </div>
                </div>

                {/* Deye OEM Category Filter Navigation Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {DEYE_CATALOGUE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setDeyeActiveCat(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                        deyeActiveCat === cat.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg scale-[1.02]'
                          : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.pending ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[10px] font-black uppercase animate-pulse">
                          Pending Upload
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          deyeActiveCat === cat.id ? 'bg-slate-950 text-amber-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {cat.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Prompt Banner for Three-Phase Inverters Pending Upload */}
                {(deyeActiveCat === 'tp-lv' || deyeActiveCat === 'tp-hv') && (
                  <div className="bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-purple-500/10 border-2 border-dashed border-amber-500/50 p-6 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6 text-amber-500 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Ready for {deyeActiveCat === 'tp-lv' ? 'Three-Phase Low Voltage' : 'Three-Phase High Voltage'} Deye Hybrid Inverter Photos!
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-1 font-medium">
                        The Deye Design Architecture grid is ready to receive your photos for {deyeActiveCat === 'tp-lv' ? 'Three-Phase Low Voltage Hybrid Inverters' : 'Three-Phase High Voltage Hybrid Inverters'}. Please upload your screenshot files when ready!
                      </p>
                    </div>
                    <Button 
                      onClick={() => alert(`📷 Ready! You can upload your ${deyeActiveCat === 'tp-lv' ? 'Three-Phase Low Voltage' : 'Three-Phase High Voltage'} Deye photos in the chat anytime.`)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg"
                    >
                      Prompt Received — Ready for Photo Upload
                    </Button>
                  </div>
                )}

                {/* DEYE OFFICIAL DESIGN ARCHITECTURE PHOTO DISPLAY CANVAS */}
                {(deyeActiveCat === 'sp-lv' || deyeActiveCat === 'split-phase' || deyeActiveCat === 'tp-lv' || deyeActiveCat === 'tp-hv') && (
                  <div className="bg-[#f5f6f8] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-6 shadow-inner">
                    <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-800 pb-3">
                      <div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest block">DEYE OFFICIAL PRODUCT LINEUP</span>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                          {deyeActiveCat === 'sp-lv' ? 'Single Phase Low Voltage Hybrid Inverters' : 'Split Phase Hybrid Inverters'}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {DEYE_CATALOGUE_ITEMS.filter(item => item.catId === deyeActiveCat).length} Official Series Models
                      </span>
                    </div>

                    {/* Deye 4-Column Card Display Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {DEYE_CATALOGUE_ITEMS.filter(item => item.catId === deyeActiveCat).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedComponentGallery(item);
                            setActivePhotoIdx(0);
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-2xl hover:border-amber-500/60 transition-all cursor-pointer group relative overflow-hidden"
                        >
                          {/* NEW Badge if present */}
                          {item.badge && (
                            <div className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm z-10">
                              {item.badge}
                            </div>
                          )}

                          {/* Top Section: Side-by-Side Inverter Image + Spec Pill Card */}
                          <div className="flex items-start gap-3 pt-2">
                            {/* Product Render Image */}
                            <div className="w-1/2 h-44 flex items-center justify-center p-1 relative">
                              <img
                                src={item.image}
                                alt={item.seriesCode}
                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                              />
                            </div>

                            {/* Deye Official Spec Card Badge */}
                            <div className="w-1/2 bg-[#f8f9fa] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 p-2.5 rounded-xl space-y-1 text-center shadow-sm">
                              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                                Hybrid Inverter
                              </span>
                              
                              {/* Blue Power Range Pill */}
                              <div className="bg-[#2d62c4] text-white font-black text-xs py-1 px-2 rounded-lg shadow-sm">
                                {item.powerRange}
                              </div>

                              <div className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold pt-0.5">
                                {item.phase}
                              </div>
                              <div className="text-[10px] text-slate-500 font-bold">
                                {item.mppt}
                              </div>
                              <div className="text-[9px] text-slate-500 font-medium">
                                {item.batterySupport}
                              </div>
                            </div>
                          </div>

                          {/* Bottom Section: Charcoal Model Code Pill Button */}
                          <div className="mt-4">
                            <div className="bg-[#36383a] group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-200 font-mono text-[10px] font-bold py-2 px-3 rounded-full text-center truncate transition-colors shadow-md">
                              {item.seriesCode}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy Catalogue Items for PV Modules, Batteries & BOP */}
                
                {/* PV MODULES & SOLAR PANELS DEDICATED HIGH-RES PHOTO & VIDEO SHOWCASE */}
                {deyeActiveCat === 'pv-modules' && (
                  <div className="space-y-6">
                    {/* Factory Tour Video & High-Res Product Banner */}
                    <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                            Tier-1 OEM Manufacturing & Quality Assurance
                          </span>
                          <h3 className="text-xl font-black text-white mt-1">
                            Jinko Solar Automated Factory Tour & Automated EL Testing
                          </h3>
                          <p className="text-xs text-slate-400">
                            Watch automated robotic assembly, double EL electroluminescence crack inspection, and flash testing for Jinko Tiger Pro 550-570W modules.
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold whitespace-nowrap">
                          🎬 Official Factory Video Stream
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Video Player */}
                        <div className="lg:col-span-7 bg-black rounded-xl overflow-hidden border border-slate-800 shadow-xl relative group">
                          <video 
                            controls 
                            poster="/images/pv/jinko-550w-tiger-pro.png" 
                            src="/images/pv/jinko-solar-factory-tour.mp4" 
                            className="w-full h-64 md:h-80 object-cover" 
                          />
                        </div>

                        {/* High-Res Image Thumbnails */}
                        <div className="lg:col-span-5 space-y-3">
                          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">ATTACHED PHOTO GALLERY</span>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <div 
                              onClick={() => {
                                const item = (DETAILED_COMPONENT_CATALOGUE.find(i => i.id === "COMP-PV-550W") || DETAILED_COMPONENT_CATALOGUE.find(i => i.category === "PV Module"));
                                if (item) { setSelectedComponentGallery(item); setActivePhotoIdx(0); }
                              }}
                              className="bg-slate-900 border border-slate-700 rounded-xl p-1 cursor-pointer hover:border-amber-500 transition-all group"
                            >
                              <img src="/images/pv/jinko-550w-tiger-pro.png" alt="Render" className="w-full h-20 object-contain rounded-lg group-hover:scale-105 transition-transform" />
                              <span className="text-[9px] text-slate-300 font-bold block text-center mt-1 truncate">550-570W Render</span>
                            </div>

                            <div 
                              onClick={() => {
                                const item = (DETAILED_COMPONENT_CATALOGUE.find(i => i.id === "COMP-PV-550W") || DETAILED_COMPONENT_CATALOGUE.find(i => i.category === "PV Module"));
                                if (item) { setSelectedComponentGallery(item); setActivePhotoIdx(1); }
                              }}
                              className="bg-slate-900 border border-slate-700 rounded-xl p-1 cursor-pointer hover:border-amber-500 transition-all group"
                            >
                              <img src="/images/pv/jinko-datasheet-label.png" alt="Datasheet" className="w-full h-20 object-contain rounded-lg group-hover:scale-105 transition-transform bg-slate-950 p-1" />
                              <span className="text-[9px] text-slate-300 font-bold block text-center mt-1 truncate">Datasheet Label</span>
                            </div>

                            <div 
                              onClick={() => {
                                const item = (DETAILED_COMPONENT_CATALOGUE.find(i => i.id === "COMP-PV-550W") || DETAILED_COMPONENT_CATALOGUE.find(i => i.category === "PV Module"));
                                if (item) { setSelectedComponentGallery(item); setActivePhotoIdx(2); }
                              }}
                              className="bg-slate-900 border border-slate-700 rounded-xl p-1 cursor-pointer hover:border-amber-500 transition-all group"
                            >
                              <img src="/images/pv/jinko-solar-field-arrays.png" alt="Field" className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                              <span className="text-[9px] text-slate-300 font-bold block text-center mt-1 truncate">Utility Solar Array</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => {
                              const item = (DETAILED_COMPONENT_CATALOGUE.find(i => i.id === "COMP-PV-550W") || DETAILED_COMPONENT_CATALOGUE.find(i => i.category === "PV Module"));
                              if (item) { setSelectedComponentGallery(item); setActivePhotoIdx(0); }
                            }}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-lg mt-2"
                          >
                            Launch Jinko Tiger Pro Photo & Spec Gallery
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(deyeActiveCat === 'pv-modules' || deyeActiveCat === 'batteries' || deyeActiveCat === 'bop') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {DETAILED_COMPONENT_CATALOGUE
                      .filter(item => {
                        if (deyeActiveCat === 'pv-modules') return item.category === 'PV Module';
                        if (deyeActiveCat === 'batteries') return item.category === 'Battery';
                        if (deyeActiveCat === 'bop') return item.category === 'Balance of Plant' || item.category === 'Inverter';
                        return true;
                      })
                      .map((item) => (
                        <div 
                          key={item.id}
                          className="glass-card border-white/60 dark:border-white/10 p-5 rounded-2xl space-y-4 hover:shadow-2xl transition-all border border-slate-200 dark:border-white/10"
                        >
                          <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
                            <div>
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold text-[10px] uppercase">
                                {item.category}
                              </span>
                              <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                                {item.name}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                                Brand: <span className="text-amber-500 font-bold">{item.brand}</span>
                              </p>
                            </div>
                            <Button onClick={() => { setRfqItem(item); setShowRfqModal(true); }} size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] px-3 py-1 rounded-lg">Request Quotation</Button>
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            {item.photos.map((photo, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedComponentGallery(item);
                                  setActivePhotoIdx(idx);
                                }}
                                className="relative h-16 rounded-xl overflow-hidden border border-slate-200 group"
                              >
                                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              </button>
                            ))}
                          </div>

                          <Button
                            onClick={() => {
                              setSelectedComponentGallery(item);
                              setActivePhotoIdx(0);
                            }}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl"
                          >
                            <Eye className="w-4 h-4 mr-2 text-amber-400" />
                            Inspect Specs & Photos
                          </Button>
                        </div>
                      ))}
                  </div>
                )}

              </div>
            </TabsContent>

            {/* MODULE 5: Automated BOQ & Financial Costing Engine */}
            <TabsContent value="auto-boq" className="space-y-8">
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Module Header */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Automated Bill of Quantities (BOQ) & Tender Costing Engine</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Calculates equipment FOB cost, freight, insurance, customs clearing, inland transport, site labor, overhead, contingency, and gross margin.</p>
                  </div>

                  <Button onClick={() => alert("✅ Tender BOQ Dossier Generated!\n\nExported complete itemized bill of quantities with landed logistics costing for client commercial submission.")} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-5 shadow-lg">
                    <Printer className="w-4 h-4 mr-2" /> Export Commercial Tender BOQ PDF
                  </Button>
                </div>

                {/* Management Financial KPI Cards: Equipment vs Landed vs Installed vs Contract vs Margin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">1. EQUIPMENT FOB COST</span>
                    <div className="text-xl font-black text-slate-900 dark:text-white">$38,400 USD</div>
                    <span className="text-[10px] text-slate-500 font-medium">Base Supplier Invoices</span>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-sky-400 uppercase">2. LANDED LOGISTICS COST</span>
                    <div className="text-xl font-black text-sky-400">$44,850 USD</div>
                    <span className="text-[10px] text-sky-300/80 font-medium">+Freight, Duty & Clearing</span>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
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
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                      <span>Itemized BOQ Cost Engineering Breakdown</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-semibold">Project Ref: #BOQ-2026-MONROVIA-09</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 font-bold uppercase text-[10px]">
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
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Module Header */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Solar Procurement, Shipping & Manufacturer Partnership Registry</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Triggers auto-requisitions for won projects, tracks PO status, captures serial numbers upon warehouse receipt, and manages official OEM dealer authorizations.</p>
                  </div>
                </div>

                {/* 8-Stage Procurement Workflow Stepper */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-white/10 space-y-3">
                  <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-amber-400" />
                    Automated Won Project Procurement Flow
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-8 gap-2 text-[10px] font-bold text-center">
                    <div className="bg-amber-500 text-slate-950 p-2 rounded-lg font-black">1. Requisition</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-200 dark:border-white/10">2. Supplier RFQ</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-200 dark:border-white/10">3. Quote Matrix</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-200 dark:border-white/10">4. PO Issued</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-200 dark:border-white/10">5. In Transit</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-200 dark:border-white/10">6. Customs Clearance</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-200 dark:border-white/10">7. Serial Intake</div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-200 dark:border-white/10">8. Warehouse Receipt</div>
                  </div>
                </div>

                {/* Active Procurement Orders & Requisitions */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Barcode className="w-4 h-4 text-emerald-400" />
                      <span>Active Project Purchase Requisitions & Serial Intake</span>
                    </h3>
                    <Button onClick={() => alert("✅ Serial Number Intake Complete!\n\nCaptured 20x PV Module & 2x Battery Serial Barcodes into TOTAG Asset Ledger.")} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs">
                      <Barcode className="w-3.5 h-3.5 mr-1.5" /> Scan Warehouse Barcodes
                    </Button>
                  </div>

                  <div className="space-y-3 text-xs font-semibold text-slate-300">
                    
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30 text-[10px]">PO #PO-DEYE-9921</Badge>
                          <span className="text-white font-black">Monrovia Hospital 30kVA Solar Hybrid Microgrid</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">Supplier: Deye Energy • 1x 30kW Hybrid Inverter • Container #MSCU-881920</p>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Tracking: MSCU7719203 | Status: Customs Clearance @ Freeport of Monrovia</div>
                      </div>
                      <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 self-start md:self-center">Customs Clearance</Badge>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">PO #PO-JK-8824</Badge>
                          <span className="text-white font-black">UNICEF Regional Office Solar Backup System</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">Supplier: Jinko Solar • 60x 550W Mono PERC Modules • Serial Intake Complete</p>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Serials: JK-550W-2026-98124 through JK-550W-2026-98184 (Inspected & Verified)</div>
                      </div>
                      <Badge className="bg-sky-500 text-slate-950 font-black text-xs px-3 py-1 self-start md:self-center">Warehouse Intake Complete</Badge>
                    </div>

                  </div>
                </div>

                {/* TOTAG Official OEM Manufacturer & Supplier Partnership Registry */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <BadgeCheck className="w-5 h-5 text-amber-400" />
                      <span>Official OEM Manufacturer & Partnership Registry</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-bold">Authorized Dealer Credentials</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* OEM 1: Deye */}
                    <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
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
                    <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
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
                    <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
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
                    <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
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
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Module Header */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Solar Warehouse & Serialized Asset Lifecycle Management</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Tracks serial numbers, supplier POs, warehouse locations, project site allocations, installation dates, and manufacturer warranties for inverters, batteries, smart meters, and gateways.</p>
                  </div>

                  <Button onClick={() => alert("✅ Serialized Asset Recorded!\n\nCaptured new serial barcode into TOTAG Master Asset Registry.")} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-5 shadow-lg">
                    <Barcode className="w-4 h-4 mr-2" /> Register Serialized Equipment
                  </Button>
                </div>

                {/* Warehouse Serial Summary KPI Bar */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-semibold">
                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">TOTAL SERIALIZED ASSETS</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">148 Units</div>
                    <span className="text-slate-500 block text-[10px]">Inverters, Batteries, Gateways</span>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">MONROVIA CENTRAL STOCK</span>
                    <div className="text-2xl font-black text-amber-400">62 Units</div>
                    <span className="text-slate-500 block text-[10px]">Bushrod Island Warehouse</span>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">PROJECT ALLOCATED</span>
                    <div className="text-2xl font-black text-sky-400">34 Units</div>
                    <span className="text-slate-500 block text-[10px]">Staged for Site Dispatch</span>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">INSTALLED ON-SITE</span>
                    <div className="text-2xl font-black text-emerald-400">48 Units</div>
                    <span className="text-slate-500 block text-[10px]">Active Customer Assets</span>
                  </div>

                  <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">WARRANTY COVERAGE</span>
                    <div className="text-2xl font-black text-purple-400">100% Active</div>
                    <span className="text-slate-500 block text-[10px]">Manufacturer Backed</span>
                  </div>
                </div>

                {/* Serialized Equipment Ledger Table */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Barcode className="w-4 h-4 text-emerald-400" />
                      <span>Serialized Equipment Master Ledger & Audit Trail</span>
                    </h3>
                    <Input 
                      placeholder="Search Serial Number, Model, PO#, or Site..." 
                      className="bg-slate-900 border-slate-200 dark:border-white/10 text-xs text-white max-w-xs"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 font-bold uppercase text-[10px]">
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
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Module Header */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Solar Project Execution & 15-Stage Evidence Installation Workflow</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Monitors turnkey project budgets, actual costs, team assignments, risk status, and enforces evidence verification for each installation stage from Mobilization to Commissioning.</p>
                  </div>

                  <Button onClick={() => alert("✅ New Solar EPC Project Created!\n\nInitialized 15-Stage Installation Workflow Tracker for project team.")} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-5 shadow-lg">
                    <Plus className="w-4 h-4 mr-2" /> Initialize Won Contract Project
                  </Button>
                </div>

                {/* Project Executive Overview Dashboard Cards */}
                <div className="bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">ACTIVE EPC CONTRACT #PRJ-2026-001</span>
                      <h3 className="text-lg font-black text-white mt-0.5">Monrovia Regional Hospital 30kW Solar Hybrid Microgrid</h3>
                      <p className="text-xs text-slate-400">Client: Ministry of Health / USAID • Location: Bushrod Island, Montserrado County</p>
                    </div>
                    <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1">75% Installation Progress</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-semibold">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">CONTRACT VALUE</span>
                      <span className="text-amber-400 font-black text-sm">$68,500 USD</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">SYSTEM CAPACITY</span>
                      <span className="text-white font-black text-sm">33 kWp / 76.8 kWh</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">PROJECT MANAGER</span>
                      <span className="text-slate-200 font-bold text-xs">Eng. Tarkpor Toe</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">BUDGET vs ACTUAL</span>
                      <span className="text-emerald-400 font-black text-sm">$53.1k / $41.2k</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">TARGET COMPLETION</span>
                      <span className="text-sky-400 font-black text-xs">Aug 30, 2026</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">RISK STATUS</span>
                      <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Low Risk
                      </span>
                    </div>
                  </div>
                </div>

                {/* 15-Stage Verified Installation Workflow Tracker */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
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

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-white/10 space-y-1 opacity-70">
                      <div className="flex justify-between items-center text-slate-400 font-black">
                        <span>13. Site QA Inspection</span>
                        <Badge className="bg-slate-900 text-slate-400 text-[10px]">PENDING</Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">Comprehensive 50-point electrical safety audit.</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-white/10 space-y-1 opacity-70">
                      <div className="flex justify-between items-center text-slate-400 font-black">
                        <span>14. Pre-Commission Test</span>
                        <Badge className="bg-slate-900 text-slate-400 text-[10px]">PENDING</Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">24-Hour full-load endurance simulation.</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-white/10 space-y-1 opacity-70">
                      <div className="flex justify-between items-center text-slate-400 font-black">
                        <span>15. Handover & Certs</span>
                        <Badge className="bg-slate-900 text-slate-400 text-[10px]">PENDING</Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">Official client certificate issue & staff handover.</p>
                    </div>

                  </div>
                </div>

              </div>
            </TabsContent>

            <TabsContent value="energy-audit" className="space-y-6">
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
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
                <form onSubmit={handleAddLoad} className="grid grid-cols-5 gap-3 p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                  <div className="col-span-2">
                    <Label className="text-[10px] font-bold text-slate-300">Equipment Name</Label>
                    <Input 
                      value={newLoad.name} 
                      onChange={(e) => setNewLoad({ ...newLoad, name: e.target.value })} 
                      placeholder="e.g. Solar Water Pump"
                      className="mt-1 bg-slate-900 border-slate-200 dark:border-white/10 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-slate-300">Quantity</Label>
                    <Input 
                      type="number" 
                      value={newLoad.qty} 
                      onChange={(e) => setNewLoad({ ...newLoad, qty: Number(e.target.value) })} 
                      className="mt-1 bg-slate-900 border-slate-200 dark:border-white/10 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-slate-300">Watts Each</Label>
                    <Input 
                      type="number" 
                      value={newLoad.watts} 
                      onChange={(e) => setNewLoad({ ...newLoad, watts: Number(e.target.value) })} 
                      className="mt-1 bg-slate-900 border-slate-200 dark:border-white/10 text-white text-xs"
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
                    <div key={idx} className="grid grid-cols-6 items-center p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold">
                      <span className="col-span-2 text-white font-extrabold">{item.name}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.qty} × {item.watts}W</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.hours} hrs/day</span>
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
                <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950 border-2 border-slate-200 dark:border-white/10 text-center">
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase block">Total Connected Load</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{totalConnectedWatts.toLocaleString()} W</span>
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
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
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
                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-200 dark:border-white/10 text-center space-y-1">
                    <Sun className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-spin-slow" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Live PV Power Output</span>
                    <div className="text-3xl font-black text-amber-400">42.8 kW</div>
                    <span className="text-[10px] text-emerald-400 font-bold">Irradiance: 940 W/m²</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-200 dark:border-white/10 text-center space-y-1">
                    <BatteryCharging className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Battery State of Charge (SOC)</span>
                    <div className="text-3xl font-black text-emerald-400">94%</div>
                    <span className="text-[10px] text-slate-300 font-bold">LiFePO4 48V Storage Bank</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-200 dark:border-white/10 text-center space-y-1">
                    <Cpu className="w-6 h-6 text-sky-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Active Facility Load</span>
                    <div className="text-3xl font-black text-sky-400">28.4 kW</div>
                    <span className="text-[10px] text-slate-300 font-bold">Pure Sine Wave Output</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-200 dark:border-white/10 text-center space-y-1">
                    <Fuel className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block font-extrabold uppercase">Generator Run Reduction</span>
                    <div className="text-3xl font-black text-purple-400">-77%</div>
                    <span className="text-[10px] text-purple-300 font-bold">From 14h/day down to 3.2h/day</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            

            {/* 5. QA/QC & Commissioning Certificate Generator */}
            <TabsContent value="commissioning" className="space-y-6">
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4">
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
                  <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                    <span className="text-amber-400 font-extrabold uppercase">1. PV Array Insulation & String Test</span>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold">String 1 Voc: 482.4 V | Isc: 12.8 A | Insulation Resistance: &gt;200 MΩ (PASSED)</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                    <span className="text-emerald-400 font-extrabold uppercase">2. LiFePO4 Battery BMS Integration</span>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold">Pack Voltage: 51.2V | CAN Bus Comms: Active | Cell Delta: 0.012V (PASSED)</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 6. Interoperability & Ecosystem Sync */}
            <TabsContent value="interoperability" className="space-y-6">
              <div className="glass-card border-white/60 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
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
                  <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <div className="flex items-center space-x-2 text-amber-400 font-black">
                      <Fuel className="w-4 h-4" />
                      <span>Solar ↔ Petroleum</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold">Diesel generator fuel telemetry triggers automatic Solar CRM leads to convert high-fuel sites into solar/hybrid microgrids.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <div className="flex items-center space-x-2 text-emerald-400 font-black">
                      <Zap className="w-4 h-4" />
                      <span>Solar ↔ TOTAG FARM</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold">Power design for solar irrigation pumps, cold-room refrigeration, and crop drying infrastructure.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <div className="flex items-center space-x-2 text-sky-400 font-black">
                      <Ship className="w-4 h-4" />
                      <span>Solar ↔ Cargo Handling</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold">Auto-triggers port clearance, stevedoring, and freight dispatch for containerized solar panels & LiFePO4 batteries.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </section>

      </main>

      {/* EXECUTIVE PROFORMA INVOICE & BOQ MODAL */}
      <Dialog open={showProformaModal} onOpenChange={setShowProformaModal}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 p-6 sm:p-8">
          {(() => {
            const eng = getWizardEngineeringDesign();
            const invoiceNo = `PROFORMA-SOL-${eng.effectiveCap}KVA-${Date.now().toString().slice(-6)}`;
            const invoiceDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            const handleProformaSubmit = (e: React.FormEvent) => {
              e.preventDefault();
              setProformaSubmitting(true);
              setTimeout(() => {
                setProformaSubmitting(false);
                setShowProformaModal(false);
                toast({
                  title: "Proforma Invoice Dispatched",
                  description: `Official Quotation #${invoiceNo} sent to ${proformaClient.email || "sales desk"} & logged in system.`,
                });
              }, 600);
            };

            return (
              <div className="space-y-6 text-slate-900 dark:text-slate-100">
                
                {/* Official Letterhead Header */}
                <div className="border-b-2 border-slate-900 dark:border-white/20 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-2 flex items-center justify-center">
                      <img src="/images/totag-logo.png" alt="TOTAG Logo" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                        TOTAG GROUP OF COMPANIES LTD
                      </h3>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">
                        Solar Energy & Smart Power Division
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Thinker's Village, Paynesville, Montserrado County, Liberia | Tel: +231 777 511 391
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <Badge className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 mb-1">
                      OFFICIAL PROFORMA INVOICE
                    </Badge>
                    <div className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                      Ref: {invoiceNo}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Date: {invoiceDate}
                    </div>
                  </div>
                </div>

                {/* Scope & Facility Banner */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                      Scope: {eng.effectiveCap} kVA Turnkey Solar Power System
                    </span>
                    <span className="text-slate-500 font-medium">
                      Application: {eng.currentFacility.label} ({eng.autonomyHours})
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-600 font-bold self-start sm:self-auto">
                    Turnkey EPC Standard (5-Yr Warranty)
                  </Badge>
                </div>

                {/* Client Information Form */}
                <form onSubmit={handleProformaSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <Label htmlFor="cname" className="text-[11px] font-bold">Client / Recipient Name *</Label>
                      <Input
                        id="cname"
                        placeholder="e.g. John Doe / Procurement Officer"
                        value={proformaClient.name}
                        onChange={(e) => setProformaClient(prev => ({ ...prev, name: e.target.value }))}
                        className="rounded-xl text-xs h-9"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="corg" className="text-[11px] font-bold">Company / Organization</Label>
                      <Input
                        id="corg"
                        placeholder="e.g. Clinic, NGO, Business, or Residence"
                        value={proformaClient.org}
                        onChange={(e) => setProformaClient(prev => ({ ...prev, org: e.target.value }))}
                        className="rounded-xl text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cphone" className="text-[11px] font-bold">Phone Number *</Label>
                      <Input
                        id="cphone"
                        placeholder="+231 777..."
                        value={proformaClient.phone}
                        onChange={(e) => setProformaClient(prev => ({ ...prev, phone: e.target.value }))}
                        className="rounded-xl text-xs h-9"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cemail" className="text-[11px] font-bold">Email Address *</Label>
                      <Input
                        id="cemail"
                        type="email"
                        placeholder="client@example.com"
                        value={proformaClient.email}
                        onChange={(e) => setProformaClient(prev => ({ ...prev, email: e.target.value }))}
                        className="rounded-xl text-xs h-9"
                        required
                      />
                    </div>
                  </div>

                  {/* Itemized BOQ Table */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 text-[10px] uppercase font-black text-slate-600 dark:text-slate-300">
                        <tr>
                          <th className="p-2.5">Item & Description</th>
                          <th className="p-2.5">Specifications</th>
                          <th className="p-2.5 text-center">Qty</th>
                          <th className="p-2.5 text-right">Amount (USD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                        <tr>
                          <td className="p-2.5 font-bold">{eng.is3Phase ? "3-Phase Hybrid Inverter" : "Hybrid Inverter"}</td>
                          <td className="p-2.5 text-slate-500">{eng.effectiveCap}.0 kW Deye Pure Sine Wave {eng.is3Phase ? "380V" : "48V"} MPPT Inverter</td>
                          <td className="p-2.5 text-center font-bold">1 Unit</td>
                          <td className="p-2.5 text-right font-black">${eng.inverterCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">LiFePO4 Lithium Battery Bank</td>
                          <td className="p-2.5 text-slate-500">{eng.batteryKwh} kWh LiFePO4 Battery with Integrated Smart CANbus BMS</td>
                          <td className="p-2.5 text-center font-bold">1 Bank</td>
                          <td className="p-2.5 text-right font-black">${eng.batteryCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Solar PV Generation Array</td>
                          <td className="p-2.5 text-slate-500">{eng.panelCount}x 550W Tier-1 Monocrystalline PERC Solar Panels ({eng.panelKwp} kWp)</td>
                          <td className="p-2.5 text-center font-bold">{eng.panelCount} Pcs</td>
                          <td className="p-2.5 text-right font-black">${eng.panelCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Balance of System (BOS)</td>
                          <td className="p-2.5 text-slate-500">Anodized Aluminum Racking, 4mm²/6mm² UV DC Cables & MC4 Connectors</td>
                          <td className="p-2.5 text-center font-bold">1 Set</td>
                          <td className="p-2.5 text-right font-black">${eng.bosCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Protection Switchgear</td>
                          <td className="p-2.5 text-slate-500">Pre-wired AC/DC Combiner Box, Type II SPD Surge Protection & Earth Rod</td>
                          <td className="p-2.5 text-center font-bold">1 Set</td>
                          <td className="p-2.5 text-right font-black">${eng.switchgearCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">24/7 Smart Telemetry</td>
                          <td className="p-2.5 text-slate-500">WiFi/GSM Datalogger with Real-time NOC Cloud Telemetry & App Monitoring</td>
                          <td className="p-2.5 text-center font-bold">1 Unit</td>
                          <td className="p-2.5 text-right font-black">${eng.telemetryCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Turnkey Installation & Commissioning</td>
                          <td className="p-2.5 text-slate-500">Delivery, Mechanical/Electrical Labor, Load Testing & 5-Year Full Warranty</td>
                          <td className="p-2.5 text-center font-bold">Turnkey</td>
                          <td className="p-2.5 text-right font-black">${eng.installCost.toLocaleString()}</td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-slate-50 dark:bg-slate-900/80 border-t-2 border-slate-900 dark:border-white/20 font-black">
                        <tr>
                          <td colSpan={3} className="p-3 text-right text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                            TOTAL TURNKEY INVESTMENT (USD):
                          </td>
                          <td className="p-3 text-right text-base text-emerald-600 dark:text-emerald-400">
                            ${eng.totalCost.toLocaleString()} USD
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.print()}
                      className="w-full sm:w-auto rounded-xl text-xs font-bold border-slate-300 dark:border-slate-700"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1.5" />
                      Print / Save as PDF
                    </Button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowProformaModal(false)}
                        className="rounded-xl text-xs font-bold"
                      >
                        Close
                      </Button>
                      <Button
                        type="submit"
                        disabled={proformaSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md w-full sm:w-auto"
                      >
                        {proformaSubmitting ? "Dispatching..." : "Submit Proforma Request ➔"}
                      </Button>
                    </div>
                  </div>

                </form>

              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Footer />

      {/* Comprehensive Deye OEM Product Specification & Engineering Modal */}
      {selectedComponentGallery && (() => {
        const prod = getUnifiedProductDetails(selectedComponentGallery);
        if (!prod) return null;

        return (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-3xl max-w-6xl w-full max-h-[94vh] overflow-y-auto p-5 sm:p-8 space-y-8 shadow-2xl my-auto">
              
              {/* Top Navigation & Breadcrumbs Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>TOTAG Solar Catalogue</span>
                  <span>/</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{prod.category}</span>
                  <span>/</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">{prod.modelNo}</span>
                </div>

                <button 
                  onClick={() => setSelectedComponentGallery(null)} 
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Main Product Hero Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: HD Photo Showcase & Multi-Angle Carousel */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                    <img 
                      src={prod.photos[activePhotoIdx]?.url || prod.image} 
                      alt={prod.photos[activePhotoIdx]?.caption || prod.name} 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-1.5">
                      <Badge className="bg-emerald-600 text-white font-black text-xs">
                        Official Deye OEM Hardware
                      </Badge>
                      {prod.powerRange && (
                        <Badge variant="outline" className="bg-white/80 dark:bg-slate-900/80 font-bold text-xs">
                          {prod.powerRange}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {prod.photos && prod.photos.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {prod.photos.map((photo: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all p-1 bg-slate-50 dark:bg-slate-900 ${
                            idx === activePhotoIdx 
                              ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105' 
                              : 'border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={photo.url} alt={photo.caption} className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-xs text-slate-500 text-center font-medium">
                    {prod.photos[activePhotoIdx]?.caption || `${prod.name} High-Resolution Specification Render`}
                  </div>
                </div>

                {/* Right: Technical Overview & Procurement Card */}
                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                        {prod.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                        {prod.mppt}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 font-extrabold text-xs">
                        {prod.batterySupport}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {prod.name}
                    </h1>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {prod.phase} • {prod.powerRange} • {prod.batterySupport}
                    </p>
                  </div>

                  {/* Manufacturer & Warranty Pill Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Manufacturer</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">Deye OEM</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Warranty</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">5-Yr Standard</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Protection</span>
                      <span className="font-extrabold text-sky-600 dark:text-sky-400">IP65 Outdoor</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Core Deye Key Features */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                      Core Engineering Capabilities:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {prod.features.slice(0, 6).map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300 font-medium leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Procurement Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <Button
                      onClick={() => {
                        setRfqItem(prod);
                        setShowRfqModal(true);
                      }}
                      className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Request Official Quotation (RFQ)</span>
                    </Button>
                    <Button
                      onClick={() => handleDownloadOemDatasheetPdf(prod)}
                      variant="outline"
                      className="w-full sm:w-auto border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-bold py-3.5"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                      Download Datasheet PDF
                    </Button>
                  </div>
                </div>

              </div>

              {/* Comprehensive Technical Specifications Tables (Deye Inverter Benchmark) */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-emerald-600" />
                    <span>Complete Technical Specifications & Engineering Data</span>
                  </h3>
                  <Badge variant="outline" className="text-xs font-mono">
                    Standard: IEC/EN 62109 • IP65
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  
                  {/* Table 1: Battery Input Data */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-slate-900/60">
                    <div className="bg-slate-200/80 dark:bg-slate-800 p-3 font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <BatteryCharging className="w-4 h-4 text-emerald-500" />
                      <span>Battery Input Data</span>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800 p-3 space-y-2 text-[11px]">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Battery Chemistry:</span>
                        <span className="font-bold text-slate-900 dark:text-white">LiFePO4 Lithium / Lead-Acid</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Battery Voltage Range:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{prod.specs?.includes("HV") ? "160V - 800V DC (High Voltage)" : "40V - 60V DC (48V Low Voltage)"}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Max Charge/Discharge:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">120A - 250A Max Continuous</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Charging Strategy:</span>
                        <span className="font-bold text-slate-900 dark:text-white">Self-Adaption with Smart CANbus BMS</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Parallel Battery Support:</span>
                        <span className="font-bold text-slate-900 dark:text-white">Up to 32 Packs in Parallel</span>
                      </div>
                    </div>
                  </div>

                  {/* Table 2: PV String Input Data */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-slate-900/60">
                    <div className="bg-slate-200/80 dark:bg-slate-800 p-3 font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>PV String Input Data</span>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800 p-3 space-y-2 text-[11px]">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Max PV Input Voltage:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{prod.specs?.includes("HV") ? "1000V DC" : "500V DC"}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">MPPT Voltage Range:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{prod.specs?.includes("HV") ? "200V - 850V DC" : "125V - 425V DC"}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Start-Up Voltage:</span>
                        <span className="font-bold text-slate-900 dark:text-white">125V DC Fast Wake</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">MPPT Trackers / Strings:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{prod.mppt} (High Density)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Max Operating PV Current:</span>
                        <span className="font-bold text-slate-900 dark:text-white">13A + 13A / 26A + 26A</span>
                      </div>
                    </div>
                  </div>

                  {/* Table 3: AC Output & Grid Specs */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-slate-900/60">
                    <div className="bg-slate-200/80 dark:bg-slate-800 p-3 font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-sky-500" />
                      <span>AC Output & Grid Integration</span>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800 p-3 space-y-2 text-[11px]">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Nominal AC Voltage:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{prod.phase}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Grid Frequency:</span>
                        <span className="font-bold text-slate-900 dark:text-white">50Hz / 60Hz Auto-Detect</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">UPS Transfer Time:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">&lt; 4ms (Seamless Zero-Flicker)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Peak Surge Power:</span>
                        <span className="font-bold text-slate-900 dark:text-white">2.0x Rated Power (10s Overload)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Generator Synchronization:</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">Integrated Auto-Start & ATS</span>
                      </div>
                    </div>
                  </div>

                  {/* Table 4: Physical, Protection & Environmental */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-slate-900/60 lg:col-span-3">
                    <div className="bg-slate-200/80 dark:bg-slate-800 p-3 font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Dimensions, Protection & International Compliance</span>
                    </div>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">DIMENSIONS (WXHXD)</span>
                        <span className="font-extrabold text-slate-900 dark:text-white font-mono">{prod.dimensions}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">OPERATING TEMPERATURE</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">-40°C to +60°C (&gt;45°C Derating)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">INGRESS PROTECTION</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">IP65 (Outdoor Certified)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">COMPLIANCE STANDARDS</span>
                        <span className="font-extrabold text-slate-900 dark:text-white font-mono text-[10px]">{prod.certifications}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        );
      })()}

{/* Interactive Request for Quotation (RFQ) Form Modal */}
      {showRfqModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                  Official EPC Sales Quotation Request
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Request Official Quotation (RFQ)
                </h3>
                <p className="text-xs text-slate-400">
                  Item: <span className="text-amber-400 font-bold">{rfqItem?.seriesCode || rfqItem?.name}</span> ({rfqItem?.powerRange || rfqItem?.category})
                </p>
              </div>
              <button onClick={() => setShowRfqModal(false)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              toast({
                title: "✅ RFQ Submitted Successfully!",
                description: `Official quotation for ${rfqItem?.seriesCode || rfqItem?.name} requested by ${rfqForm.clientName}. Our EPC sales engineers will contact you shortly.`
              });
              setShowRfqModal(false);
            }} className="space-y-4 text-xs font-semibold">
              <div>
                <Label className="text-slate-300">Customer / Institution Name *</Label>
                <Input 
                  required
                  value={rfqForm.clientName} 
                  onChange={(e) => setRfqForm({ ...rfqForm, clientName: e.target.value })} 
                  className="bg-slate-950 border-slate-700 text-white mt-1" 
                  placeholder="e.g. UNDP Liberia / Monrovia Plaza Ltd" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-slate-300">Phone / WhatsApp Contact *</Label>
                  <Input 
                    required
                    value={rfqForm.contactPhone} 
                    onChange={(e) => setRfqForm({ ...rfqForm, contactPhone: e.target.value })} 
                    className="bg-slate-950 border-slate-700 text-white mt-1" 
                    placeholder="+231 770 000 000" 
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Email Address *</Label>
                  <Input 
                    required
                    type="email"
                    value={rfqForm.email} 
                    onChange={(e) => setRfqForm({ ...rfqForm, email: e.target.value })} 
                    className="bg-slate-950 border-slate-700 text-white mt-1" 
                    placeholder="client@domain.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-slate-300">Quantity Required (Units/Sets) *</Label>
                  <Input 
                    required
                    type="number"
                    min="1"
                    value={rfqForm.quantity} 
                    onChange={(e) => setRfqForm({ ...rfqForm, quantity: e.target.value })} 
                    className="bg-slate-950 border-slate-700 text-white mt-1" 
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Delivery / Project Location *</Label>
                  <Input 
                    required
                    value={rfqForm.projectLocation} 
                    onChange={(e) => setRfqForm({ ...rfqForm, projectLocation: e.target.value })} 
                    className="bg-slate-950 border-slate-700 text-white mt-1" 
                    placeholder="Monrovia, Zwedru, Buchanan..." 
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Project Requirements / Notes</Label>
                <textarea 
                  value={rfqForm.notes} 
                  onChange={(e) => setRfqForm({ ...rfqForm, notes: e.target.value })} 
                  className="w-full h-20 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 mt-1 focus:outline-none focus:border-amber-500" 
                  placeholder="Specify grid voltage, battery size preference, or installation timeline..." 
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" onClick={() => setShowRfqModal(false)} variant="outline" className="border-slate-700 text-slate-300 text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6">
                  Submit RFQ to TOTAG Solar EPC Sales
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}


      {/* Interactive Fullscreen Expandable Technical Datasheet Lightbox Zoom Modal */}
      {showExpandDatasheetModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex flex-col items-center justify-between p-4 md:p-6 animate-fadeIn">
          
          {/* Top Control Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-black text-[10px] uppercase tracking-wider">
                High-Resolution Technical Datasheet Inspection
              </span>
              <h3 className="text-lg font-black text-white mt-0.5 truncate max-w-xl">
                {expandDatasheetTitle}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setZoomScale(prev => Math.min(prev + 0.3, 3))}
                size="sm"
                variant="outline"
                className="bg-slate-900 border-slate-700 text-slate-200 text-xs font-bold"
              >
                + Zoom In
              </Button>
              <Button
                onClick={() => setZoomScale(prev => Math.max(prev - 0.3, 0.7))}
                size="sm"
                variant="outline"
                className="bg-slate-900 border-slate-700 text-slate-200 text-xs font-bold"
              >
                - Zoom Out
              </Button>
              <Button
                onClick={() => setZoomScale(1)}
                size="sm"
                variant="outline"
                className="bg-slate-900 border-slate-700 text-slate-200 text-xs font-bold"
              >
                Reset Zoom
              </Button>

              <button 
                onClick={() => setShowExpandDatasheetModal(false)}
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white font-bold text-lg flex items-center justify-center hover:bg-slate-800 transition-all"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main Expanded Image Viewport */}
          <div className="flex-1 w-full max-w-6xl flex items-center justify-center overflow-auto p-4 my-2 scrollbar-thin">
            <img 
              src={expandDatasheetImg} 
              alt="Expanded Datasheet" 
              style={{ transform: `scale(${zoomScale})`, transition: 'transform 0.2s ease-out' }}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800" 
            />
          </div>

          {/* Bottom Guidance Footer */}
          <div className="w-full max-w-6xl flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
            <span className="flex items-center gap-2 text-emerald-400 font-bold">
              ✔ Original High-Definition Factory Specification Label (2008 × 1002 × 40 mm, 1500 VDC)
            </span>
            <span className="font-mono text-slate-500">Zoom Level: {Math.round(zoomScale * 100)}%</span>
          </div>

        </div>
      )}

    </div>
  );
}
