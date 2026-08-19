import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ExternalLink,
  PhoneCall,
  PhoneOff,
  Radio,
  CheckCircle2,
  Building2,
  FileText,
  DollarSign,
  Sun,
  Truck,
  Utensils,
  Laptop,
  Wheat,
  ShieldCheck,
  Printer
} from "lucide-react";
import { useLocation } from "wouter";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  links?: { label: string; url: string }[];
  isQuote?: boolean;
  quoteData?: {
    title: string;
    target: string;
    totalPrice: string;
    items: { desc: string; specs: string; qty: string; estCost: string }[];
    notes: string;
  };
}

const TOTAG_COMPREHENSIVE_KNOWLEDGE = [
  // FAREWELL
  {
    keywords: ["bye", "goodbye", "that is all", "that's all", "nothing else", "no more", "im done", "i am done", "no thanks", "no thank you", "thank you", "thanks"],
    response: "Thank you for contacting TOTAG Group of Companies Ltd. It was our absolute pleasure assisting you. Remember our promise: 'Deliver the right solution, at the right standard, at the right time.' We look forward to serving you again. Have a wonderful day!",
    isFarewell: true
  },

  // LEADERSHIP / CEO / FOUNDERS
  {
    keywords: ["ceo", "chief executive officer", "founder", "co-founder", "leadership", "president", "owner", "tarwoyouberkowu", "gwoah", "tonieh", "deputy ceo", "who runs", "management"],
    response: "TOTAG Group of Companies Ltd is led by Co-Founder & Chief Executive Officer (CEO) M. Tarwoyouberkowu Gwoah, who provides strategic leadership, technology vision, and procurement oversight. The company is co-led by Co-Founder & Deputy CEO Mrs. Tonieh Alpha Gwoah, who directs executive administration, procurement documentation, client engagement, and women's empowerment initiatives.",
    links: [
      { label: "About TOTAG Leadership", url: "/#about" },
      { label: "Corporate Contact Desk", url: "/#contact" }
    ]
  },

  // HEADQUARTERS / LOCATION / CONTACT / PHONE NUMBERS
  {
    keywords: ["location", "address", "headquarters", "hq", "where are you", "where is totag", "phone", "number", "contact", "call", "office", "paynesville", "montserrado", "thinker's village"],
    response: "TOTAG Group is headquartered at Guest House Road, Thinker's Village Community, Paynesville, Montserrado County, Liberia. You can reach our executive team directly at +231 777 511 391, +231 777 666 999, +231 886 511 391, or +231 887 666 999. Our corporate email is info@totaggroup.com.",
    links: [
      { label: "Contact Corporate Office", url: "/#contact" },
      { label: "Corporate Email Management", url: "/email-management" }
    ]
  },

  // 1. 5 KVA SOLAR SYSTEM QUOTE (UNICEF CLINIC SPEC)
  {
    keywords: ["5 kva", "5kva", "5 kw", "5kw", "clinic", "phc", "health center", "clinic solar", "5kva solar"],
    response: "Here is your turnkey Bill of Quantities (BOQ) quotation for a 5 kVA / 5.5 kWp Solar Power System for Primary Healthcare Clinics. This complete package includes Tier-1 Monocrystalline solar panels, a 5kW Deye hybrid inverter, a 48V 200Ah (9.6 kWh) LiFePO4 lithium battery bank with smart BMS, aluminum mounting racks, pre-wired AC/DC protection switchgear, smart telemetry datalogger, and turnkey installation with a 5-year warranty for approximately $7,400 USD per clinic unit.",
    isQuote: true,
    quoteData: {
      title: "5 KVA Turnkey Solar Power System (PHC Clinics)",
      target: "Primary Healthcare Clinics / UNICEF Schedule Specification",
      totalPrice: "$7,400 USD (Per Clinic Unit)",
      items: [
        { desc: "Hybrid Inverter", specs: "5.0 kW Deye / Pure Sine Wave 48V Inverter (Dual MPPT, Auto-Transfer)", qty: "1 Unit", estCost: "$1,450" },
        { desc: "LiFePO4 Battery Bank", specs: "48V 200Ah (9.6 kWh) Lithium Iron Phosphate with Smart Integrated BMS", qty: "1 Unit", estCost: "$2,350" },
        { desc: "Solar PV Array", specs: "10x 550W Tier-1 Monocrystalline PERC Solar Panels (5.5 kWp Generation)", qty: "10 Pcs", estCost: "$1,650" },
        { desc: "Balance of System (BOS)", specs: "Anodized Aluminum Racks, 4mm²/6mm² UV DC Cables, MC4 Connectors", qty: "1 Set", estCost: "$480" },
        { desc: "Protection Switchgear", specs: "Pre-wired AC/DC Combiner Box, Type II SPD, DC Breakers, Earthing Rod", qty: "1 Set", estCost: "$380" },
        { desc: "Smart Telemetry", specs: "WiFi/GSM Datalogger with 24/7 NOC Cloud Monitoring & Battery Health App", qty: "1 Unit", estCost: "$140" },
        { desc: "Installation & Delivery", specs: "Field Delivery across Liberia, Mechanical & Electrical Labor, Testing & 5-Yr Warranty", qty: "Turnkey", estCost: "$950" }
      ],
      notes: "Turnkey operational standard compliant with UNICEF, UNGM, and Ministry of Health specifications."
    },
    links: [
      { label: "Request Formal PDF Proforma", url: "/#contact" },
      { label: "Explore TOTAG Solar Division", url: "/solar" }
    ]
  },

  // 2. 30 KVA SOLAR SYSTEM QUOTE (UNICEF HOSPITAL SPEC)
  {
    keywords: ["30 kva", "30kva", "30 kw", "30kw", "hospital", "hospital solar", "30kva solar", "30 kva solar", "50kw battery", "50 kw battery"],
    response: "Here is your turnkey Bill of Quantities (BOQ) quotation for a 30 kVA / 33 kWp Three-Phase Solar System for Hospitals. This complete system includes 60x 550W Tier-1 Mono PERC panels (33 kWp), a 30kW Deye 3-Phase Industrial Hybrid Inverter, a 50 kWh LiFePO4 rack-mounted lithium battery storage bank with master BMS, heavy-duty mounting, industrial 3-phase AC/DC protection switchgear, GSM remote telemetry, and turnkey hospital installation with 5-year warranty for approximately $38,800 USD.",
    isQuote: true,
    quoteData: {
      title: "30 KVA Industrial Solar Power System (Hospitals)",
      target: "Hospital / Medical Center 3-Phase Continuous Power",
      totalPrice: "$38,800 USD (Turnkey Installed)",
      items: [
        { desc: "3-Phase Hybrid Inverter", specs: "30.0 kW Deye Industrial 3-Phase Hybrid Power Converter (High Voltage)", qty: "1 Unit", estCost: "$6,800" },
        { desc: "High-Capacity LiFePO4 Bank", specs: "50 kWh - 60 kWh Rack-Mounted LiFePO4 Lithium Battery with Master BMS", qty: "1 Bank", estCost: "$12,500" },
        { desc: "Solar PV Generation Array", specs: "60x 550W Tier-1 Monocrystalline PERC Panels (33 kWp Total Capacity)", qty: "60 Pcs", estCost: "$9,900" },
        { desc: "Heavy-Duty BOS Racking", specs: "Structural Racking, Heavy-Duty DC Trays, Cabling & Cable Glands", qty: "1 Lot", estCost: "$2,400" },
        { desc: "Industrial Switchgear", specs: "3-Phase AC/DC Distribution, Surge Protection, Lightning Arrestors, Earth Grid", qty: "1 Set", estCost: "$1,950" },
        { desc: "Enterprise Telemetry NOC", specs: "Industrial GSM Cloud Datalogger with Automated Fault Alarms & Remote NOC", qty: "1 Unit", estCost: "$450" },
        { desc: "Hospital Commissioning", specs: "Heavy Logistics, Phase Balancing, Medical Equipment Safety Testing & 5-Yr Warranty", qty: "Turnkey", estCost: "$4,800" }
      ],
      notes: "Engineered for 24/7 continuous hospital operations (surgical suites, vaccine cold chain, maternity, and diagnostics)."
    },
    links: [
      { label: "Request Formal Hospital Tender Bid", url: "/#contact" },
      { label: "Solar Telemetry & Systems", url: "/solar" }
    ]
  },

  // 3. GENERAL SOLAR QUOTE
  {
    keywords: ["solar quote", "solar price", "solar quotation", "solar cost", "solar power price", "how much is solar"],
    response: "TOTAG Solar Smart Power provides turnkey solar packages for residential, commercial, health clinics, and industrial facilities: 1. 3 kVA Residential/Office ($4,200 USD), 2. 5 kVA PHC Clinic System ($7,400 USD), 3. 10 kVA Commercial System ($14,800 USD), and 4. 30 kVA Hospital System ($38,800 USD). Every system is quoted with panels, Deye inverter, LiFePO4 battery, BOS, switchgear, smart telemetry, and full installation. Which capacity fits your project?",
    links: [
      { label: "View 5 kVA Clinic Quote", url: "/#contact" },
      { label: "View 30 kVA Hospital Quote", url: "/#contact" },
      { label: "Solar Division Page", url: "/solar" }
    ]
  },

  // 4. TOCEPS CATERING QUOTE
  {
    keywords: ["catering quote", "catering price", "food quote", "wedding quote", "buffet quote", "event quote", "conference quote"],
    response: "TOCEPS Catering provides standardized institutional & banquet packages: 1. Institutional / UNIDO Workshop ($22 - $35 / person for buffet lunch, 2 coffee breaks, juices & service staff), 2. Executive Corporate Banquet ($45 - $65 / person with multi-course menu & beverage bar), 3. Social Celebrations & Weddings ($30 - $55 / person). We generate official proforma invoices with tax clearance. How many guests are you expecting?",
    links: [
      { label: "TOCEPS Catering Portal", url: "/catering" },
      { label: "UNIDO Deliverables & Invoice Builder", url: "/catering/ops/dashboard" }
    ]
  },

  // 5. CARGO & FREIGHT QUOTE
  {
    keywords: ["cargo quote", "freight quote", "shipping quote", "container price", "shipping price", "20ft container", "40ft container"],
    response: "TOTAG Cargo Handling offers competitive international freight and local port clearance: 1. 20ft Full Container (FCL) Ocean Freight from USA/Europe to Monrovia Free Port ($3,800 - $4,800 USD), 2. 40ft High Cube Container ($6,200 - $7,800 USD), 3. Air Cargo Consolidated ($7.50 - $9.50 / kg), and 4. Port Customs Clearance & County Inland Trucking. What cargo and route do you need?",
    links: [
      { label: "Cargo Logistics Portal", url: "/cargo" },
      { label: "Track Active Manifest", url: "/order-tracking" }
    ]
  },

  // 6. IT & SAAS ENTERPRISE SUITE QUOTE
  {
    keywords: ["it quote", "saas quote", "software quote", "hrmis quote", "fims quote", "app quote"],
    response: "TOTAG IT Services provides our 14-Module FIMS & HRMIS Enterprise Suite starting at $250 - $750 USD/month depending on user tiers, including payroll, biometrics, leave, and general ledger modules. Custom software and web application development packages range from $3,500 to $12,000 USD turnkey with full source code and hosting.",
    links: [
      { label: "Explore IT Services", url: "/it-services" },
      { label: "14 SaaS Enterprise Modules", url: "/saas" }
    ]
  },

  // 7. GENERAL QUOTE FALLBACK
  {
    keywords: ["quote", "quotation", "price", "pricing", "cost", "how much", "estimate", "proposal", "tender", "bid", "invoice", "proforma"],
    response: "TOTAG Group generates formal quotations, proforma invoices, technical proposals, and institutional tender responses across all 9 subsidiaries: 1. Solar Turnkey Systems (3kVA, 5kVA, 10kVA, 30kVA), 2. Cargo & Freight Forwarding, 3. TOCEPS Catering & Events, 4. IT & SaaS Enterprise Suite, 5. TOTAG Farm Produce & Inputs, 6. Petroleum Haulage, 7. Construction BOQs, 8. General Merchandise, and 9. Stationery Supplies. Which subsidiary would you like an itemized quote for?",
    links: [
      { label: "Request a Formal Quote", url: "/#contact" },
      { label: "View All 9 Subsidiaries", url: "/#services" }
    ]
  },

  // GREETING / OVERVIEW
  {
    keywords: ["hello", "hi", "hey", "who are you", "greeting", "start", "good morning", "good afternoon", "good evening", "company profile", "about"],
    response: "Hello! Welcome to TOTAG Group of Companies Ltd. Our motto is 'Innovating Tomorrow, Empowering Today.' Headquartered in Paynesville, Liberia, we deliver integrated solutions across 9 business divisions. I can generate instant turnkey quotations, provide company details, or connect you with executive leadership. How may I assist you today?",
    links: [
      { label: "Request a Turnkey Quote", url: "/#contact" },
      { label: "Explore All 9 Subsidiaries", url: "/#services" }
    ]
  },

  // CARGO GENERAL
  {
    keywords: ["cargo", "shipping", "freight", "logistics", "port", "tracking", "container", "vessel", "ship", "customs", "delivery"],
    response: "TOTAG Cargo Handling & Logistics provides international maritime freight forwarding, air cargo, port customs clearance, and nationwide field delivery across Liberia's 15 counties. We ensure complete packaging review, real-time shipment tracking, and secure delivery confirmation.",
    links: [
      { label: "Cargo Logistics Portal", url: "/cargo" },
      { label: "Track Your Shipment", url: "/order-tracking" }
    ]
  },

  // FARM GENERAL
  {
    keywords: ["farm", "agriculture", "agribusiness", "crops", "produce", "livestock", "cassava", "poultry", "palm oil", "fertilizer", "seeds"],
    response: "TOTAG FARM & Agribusiness leads sustainable agriculture, crop production, poultry, livestock, and post-harvest agro-processing in Liberia. We supply agricultural inputs, fertilizers, irrigation systems, and climate-smart farming solutions.",
    links: [
      { label: "TOTAG Farm Hub", url: "/farm" },
      { label: "Farm Management Console", url: "/farm/login" }
    ]
  },

  // SOLAR GENERAL
  {
    keywords: ["solar", "energy", "power", "deye", "inverter", "electricity", "renewable", "battery", "storage", "telemetry", "noc", "microgrid"],
    response: "TOTAG Solar Smart Power engineers turnkey solar microgrids, Deye hybrid inverter systems, lithium battery storage, solar irrigation pumps, and 24/7 telemetry Network Operations Center monitoring for commercial, agricultural, health clinic, and hospital facilities.",
    links: [
      { label: "Solar Energy & Deye Systems", url: "/solar" }
    ]
  },

  // IT GENERAL
  {
    keywords: ["it", "software", "saas", "fims", "hrmis", "tis", "tech", "cloud", "cyber", "cybersecurity"],
    response: "TOTAG IT Services (TIS) delivers managed enterprise IT infrastructure, cybersecurity, and our proprietary 14-module FIMS Financial & HRMIS Enterprise Suite (General Ledger, Payroll, Biometrics, Leave, Procurement, and Compliance). Reach IT directly at tis@totaggroup.com.",
    links: [
      { label: "IT Services Portal", url: "/it-services" },
      { label: "Enterprise SaaS Suite", url: "/saas" }
    ]
  },

  // TOCEPS CATERING GENERAL
  {
    keywords: ["catering", "toceps", "food", "event", "unido", "buffet", "meal", "wedding", "banquet", "hospitality"],
    response: "TOTAG Catering & Event Planning Services (TOCEPS) manages institutional catering, UNIDO contract deliverables, executive banquets, wedding receptions, and conference hospitality with certified food safety standards. Email toceps@totaggroup.com for bookings and event invoices.",
    links: [
      { label: "TOCEPS Catering Services", url: "/catering" },
      { label: "Document Vault & Dashboard", url: "/catering/ops/dashboard" }
    ]
  },

  // PETROLEUM GENERAL
  {
    keywords: ["petroleum", "fuel", "diesel", "gasoline", "depot", "oil", "haulage", "bulk fuel"],
    response: "TOTAG Petroleum Services operates certified bulk fuel storage facilities, commercial petroleum supply depots, and reliable fuel haulage logistics across Liberia with an emphasis on safety and dependable supply.",
    links: [
      { label: "Petroleum Services", url: "/petroleum" }
    ]
  },

  // CONSTRUCTION GENERAL
  {
    keywords: ["construction", "building", "civil", "roads", "infrastructure", "engineering", "renovation", "rehabilitation"],
    response: "TOTAG General Construction provides civil engineering, commercial building construction, road rehabilitation, facility improvement, and structural works delivered to international quality and safety standards.",
    links: [
      { label: "Construction Services", url: "/construction" }
    ]
  },

  // MERCHANDISE GENERAL
  {
    keywords: ["merchandise", "tgm", "retail", "wholesale", "goods", "fmcg", "consumer goods"],
    response: "TOTAG General Merchandise (TGM) manages large-scale wholesale procurement, FMCG distribution, and retail supply of consumer and commercial goods across regional markets.",
    links: [
      { label: "General Merchandise Hub", url: "/general-merchandise" }
    ]
  },

  // STATIONERY GENERAL
  {
    keywords: ["stationery", "office", "supplies", "printing", "paper", "procurement", "scholastic", "furniture"],
    response: "TOTAG Stationery Supplies provides bulk B2B office procurement, executive furniture, computer consumables, and scholastic printing materials for corporate, government, and institutional clients.",
    links: [
      { label: "Stationery Supplies", url: "/stationery" }
    ]
  },

  // COMPLIANCE / UNGM / QUANTUM
  {
    keywords: ["compliance", "ungm", "quantum", "tax", "registration", "documentation", "donor", "procurement readiness", "standards"],
    response: "TOTAG Group maintains complete procurement readiness for institutional tenders, Quantum, UNGM, government, NGO, and multilateral donor formats. We provide formal quotations, certified tax documentation, technical proposals, and warranty commitments.",
    links: [
      { label: "Corporate Governance Console", url: "/admin-dashboard" },
      { label: "Contact Procurement Desk", url: "/#contact" }
    ]
  },

  // ALL 9 SUBSIDIARIES
  {
    keywords: ["subsidiary", "subsidiaries", "companies", "services", "all", "nine", "9", "divisions"],
    response: "TOTAG Group encompasses 9 specialized subsidiaries: 1. Cargo Handling & Logistics, 2. TOTAG Farm & Agribusiness, 3. Solar Smart Power, 4. Managed IT Services & SaaS, 5. TOCEPS Catering & Events, 6. Petroleum Services, 7. General Construction, 8. General Merchandise, and 9. Stationery Supplies.",
    links: [
      { label: "View All 9 Subsidiaries", url: "/#services" }
    ]
  }
];

function getBotResponse(userText: string): { 
  response: string; 
  links?: { label: string; url: string }[]; 
  isFarewell?: boolean;
  isQuote?: boolean;
  quoteData?: any;
} {
  const lower = userText.toLowerCase().trim();

  for (const item of TOTAG_COMPREHENSIVE_KNOWLEDGE) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return { 
        response: item.response, 
        links: item.links, 
        isFarewell: (item as any).isFarewell,
        isQuote: (item as any).isQuote,
        quoteData: (item as any).quoteData
      };
    }
  }

  return {
    response: `Thank you for inquiring about "${userText}". TOTAG Group of Companies Ltd delivers turnkey solutions across our 9 business divisions under CEO M. Tarwoyouberkowu Gwoah. You can request a complete itemized quotation, speak directly with our team at +231 777 511 391, or email info@totaggroup.com. How else may I assist you?`,
    links: [
      { label: "Request an Itemized Quote", url: "/#contact" },
      { label: "Explore All 9 Subsidiaries", url: "/#services" }
    ]
  };
}

export default function VoiceChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [sessionStatus, setSessionStatus] = useState<string>("Ready");
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Welcome to TOTAG Group of Companies Ltd. I am your corporate voice assistant in Monrovia, Liberia. I can generate complete Bill of Quantities (BOQ) quotations (such as 5 kVA Clinic or 30 kVA Hospital solar systems), explain our 9 subsidiaries, or provide executive contact details. How may I assist you?",
      timestamp: "Just now",
      links: [
        { label: "5 kVA Clinic Solar Quote", url: "/#contact" },
        { label: "30 kVA Hospital Solar Quote", url: "/#contact" },
        { label: "TOCEPS Catering Quote", url: "/catering" }
      ]
    }
  ]);

  const [_, setLocation] = useLocation();
  const recognitionRef = useRef<any>(null);
  const autoCloseTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isAgentActiveRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isListening, isSpeaking, liveTranscript]);

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const clearSilenceTimers = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setSilenceCountdown(null);
  };

  // Automated graceful farewell and widget close
  const triggerFarewellAndClose = (customText?: string) => {
    clearSilenceTimers();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
    }
    setIsListening(false);
    isAgentActiveRef.current = false;

    const farewellText = customText || "Thank you for reaching out to TOTAG Group of Companies Ltd. 'Deliver the right solution, at the right standard, at the right time.' Have a wonderful day!";
    
    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: farewellText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages((prev) => [...prev, botMsg]);
    setSessionStatus("Closing session...");

    speakText(farewellText, () => {
      setTimeout(() => {
        setIsOpen(false);
        setSessionStatus("Ready");
      }, 800);
    });
  };

  // Text-To-Speech with Liberian/West African Vocal Cadence
  const speakText = (text: string, onEndCallback?: () => void) => {
    if (!voiceEnabled || !window.speechSynthesis) {
      if (onEndCallback) onEndCallback();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = 
      voices.find((v) => v.lang === "en-NG" || v.lang === "en-GH" || v.lang === "en-ZA") ||
      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Arthur"))) ||
      voices.find((v) => v.lang.startsWith("en"));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSessionStatus("Answering in voice...");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      if (onEndCallback) {
        onEndCallback();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle Query Submission
  const handleUserQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    clearSilenceTimers();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
    }

    setIsListening(false);
    setLiveTranscript("");
    setSessionStatus("Generating turnkey response...");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    setTimeout(() => {
      const { response, links, isFarewell, isQuote, quoteData } = getBotResponse(queryText);

      if (isFarewell) {
        triggerFarewellAndClose(response);
        return;
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        links,
        isQuote,
        quoteData
      };

      setMessages((prev) => [...prev, botMsg]);

      speakText(response, () => {
        if (isAgentActiveRef.current) {
          startListeningLoop();
        }
      });
    }, 350);
  };

  // Autonomous Listening Loop
  const startListeningLoop = () => {
    clearSilenceTimers();
    stopSpeaking();
    setLiveTranscript("");

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setSessionStatus("Voice ready (Text mode)");
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      let capturedText = "";

      recognition.onstart = () => {
        setIsListening(true);
        setSessionStatus("Listening... (Speak your quote request or question)");

        let timeLeft = 9;
        setSilenceCountdown(timeLeft);
        countdownIntervalRef.current = setInterval(() => {
          timeLeft -= 1;
          if (timeLeft > 0) {
            setSilenceCountdown(timeLeft);
          } else {
            clearInterval(countdownIntervalRef.current);
          }
        }, 1000);

        autoCloseTimerRef.current = setTimeout(() => {
          if (isAgentActiveRef.current && !capturedText.trim()) {
            triggerFarewellAndClose();
          }
        }, 9000);
      };

      recognition.onspeechstart = () => {
        clearSilenceTimers();
        setSessionStatus("Hearing your speech...");
      };

      recognition.onresult = (event: any) => {
        clearSilenceTimers();
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const spoken = (final || interim).trim();
        if (spoken) {
          capturedText = spoken;
          setLiveTranscript(spoken);
          setInputText(spoken);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event.error);
        if (event.error === "not-allowed") {
          setIsListening(false);
          setSessionStatus("Microphone access blocked");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (capturedText.trim().length > 1) {
          clearSilenceTimers();
          handleUserQuery(capturedText.trim());
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn("Speech loop exception:", err);
      setIsListening(false);
    }
  };

  const openConversationSession = () => {
    setIsOpen(true);
    isAgentActiveRef.current = true;
    setTimeout(() => {
      startListeningLoop();
    }, 400);
  };

  const closeConversationSession = () => {
    isAgentActiveRef.current = false;
    clearSilenceTimers();
    stopSpeaking();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
    }
    setIsListening(false);
    setIsOpen(false);
    setSessionStatus("Ready");
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      isAgentActiveRef.current = true;
      handleUserQuery(inputText.trim());
    }
  };

  const quickPrompts = [
    "Quote 5 kVA Solar for PHC Clinics",
    "Quote 30 kVA Solar for Hospitals",
    "TOCEPS Catering Quote for 100 people",
    "20ft Container Cargo Shipping Quote",
    "Who is the CEO of TOTAG Group?",
    "What are your phone numbers & HQ?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      
      {/* EXPANDED AUTONOMOUS CONVERSATIONAL PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[390px] sm:w-[460px] max-w-[94vw] h-[660px] max-h-[88vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-emerald-400/40 p-1 flex items-center justify-center backdrop-blur-md">
                    <img src="/images/totag-logo.png" alt="TOTAG Logo" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    TOTAG Corporate Assistant
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live AI
                    </span>
                  </h4>
                  <p className="text-[11px] text-emerald-300/90 font-medium">Turnkey BOQ & Instant Quotes</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setVoiceEnabled(!voiceEnabled);
                  }}
                  className={`p-2 rounded-xl text-xs font-bold transition-all ${
                    voiceEnabled ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30" : "bg-white/10 text-slate-400 hover:bg-white/20"
                  }`}
                  title={voiceEnabled ? "Voice Output Active" : "Voice Output Muted"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={closeConversationSession}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Bar */}
            <div className="bg-slate-950/80 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {isListening ? (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-6 bg-emerald-300 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="w-1.5 h-5 bg-emerald-300 rounded-full animate-bounce [animation-delay:450ms]" />
                  </div>
                ) : isSpeaking ? (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-4 bg-sky-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-6 bg-sky-300 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-4 bg-sky-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}

                <div className="truncate">
                  <span className="font-bold text-[11px] text-emerald-400 block truncate">
                    {sessionStatus}
                  </span>
                  {liveTranscript && (
                    <p className="text-[11px] text-slate-300 truncate italic">
                      "{liveTranscript}"
                    </p>
                  )}
                </div>
              </div>

              {isListening && silenceCountdown !== null && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono shrink-0 ml-2">
                  Auto-closes in {silenceCountdown}s
                </span>
              )}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.sender === "user"
                        ? "bg-sky-600 text-white font-bold text-[10px]"
                        : "bg-emerald-600/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <img src="/images/totag-logo.png" alt="TOTAG" className="w-4 h-4 object-contain" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2.5 ${
                      msg.sender === "user"
                        ? "bg-sky-600 text-white rounded-tr-sm shadow-md font-medium"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/5 rounded-tl-sm font-normal"
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* DYNAMIC TURNKEY BILL OF QUANTITIES (BOQ) CARD */}
                    {msg.isQuote && msg.quoteData && (
                      <div className="mt-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-sm space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                              {msg.quoteData.title}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {msg.quoteData.target}
                            </span>
                          </div>
                          <span className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                            {msg.quoteData.totalPrice}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-[11px]">
                          {msg.quoteData.items.map((item, idx) => (
                            <div key={idx} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5 flex flex-col gap-0.5">
                              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                                <span>{item.desc} ({item.qty})</span>
                                <span className="text-emerald-600 dark:text-emerald-400">{item.estCost}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                {item.specs}
                              </span>
                            </div>
                          ))}
                        </div>

                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                          {msg.quoteData.notes}
                        </p>
                      </div>
                    )}

                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-white/10 space-y-1.5">
                        {msg.links.map((link, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (link.url.startsWith("/#")) {
                                const id = link.url.replace("/#", "");
                                const el = document.getElementById(id);
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                              } else {
                                setLocation(link.url);
                              }
                              closeConversationSession();
                            }}
                            className="w-full text-left text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 flex items-center justify-between p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="w-3 h-3 ml-1 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block text-right mt-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Tap to Generate Quotes in 1-Click:
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      isAgentActiveRef.current = true;
                      handleUserQuery(prompt);
                    }}
                    className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10">
              <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    if (isListening) {
                      clearSilenceTimers();
                      if (recognitionRef.current) {
                        try { recognitionRef.current.stop(); } catch (_) {}
                      }
                      setIsListening(false);
                    } else {
                      isAgentActiveRef.current = true;
                      startListeningLoop();
                    }
                  }}
                  className={`w-11 h-11 rounded-2xl shrink-0 p-0 transition-all ${
                    isListening
                      ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-600/40 ring-4 ring-rose-500/20"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/20"
                  }`}
                  title={isListening ? "Pause Mic" : "Tap to Speak"}
                >
                  {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5 text-white/80" />}
                </Button>

                <Input
                  type="text"
                  placeholder={isListening ? "Listening... or type quote request" : "e.g., Quote 5 kVA solar for clinic..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10"
                />

                <Button
                  type="submit"
                  disabled={!inputText.trim()}
                  size="sm"
                  className="w-11 h-11 rounded-2xl shrink-0 p-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-400"
                >
                  <Send className="w-4 h-4" />
                </Button>

                <Button
                  type="button"
                  onClick={() => triggerFarewellAndClose()}
                  size="sm"
                  variant="outline"
                  className="h-11 px-3 rounded-2xl border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-bold shrink-0"
                  title="Say Goodbye"
                >
                  <PhoneOff className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">End Call</span>
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TRIGGER BUTTON */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-end"
      >
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-16 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 font-bold text-xs shadow-xl border border-white/20 backdrop-blur-md whitespace-nowrap pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Speak with TOTAG AI (Instant Quotes)</span>
          </motion.div>
        )}

        <button
          onClick={() => {
            if (!isOpen) {
              openConversationSession();
            } else {
              closeConversationSession();
            }
          }}
          className={`relative w-14 h-14 rounded-full p-2.5 shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-slate-900 text-white ring-4 ring-emerald-500/30"
              : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-emerald-500 ring-4 ring-emerald-500/20 hover:ring-emerald-500/40"
          }`}
          title="TOTAG Corporate AI Assistant"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
          <img
            src="/images/totag-logo.png"
            alt="TOTAG Group Logo"
            className="w-full h-full object-contain relative z-10"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 z-20">
            <Mic className="w-2.5 h-2.5" />
          </div>
        </button>
      </motion.div>
    </div>
  );
}
