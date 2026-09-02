import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  PhoneOff,
  Building2,
  FileText,
  CreditCard,
  Utensils,
  Laptop,
  Wheat,
  ShieldCheck,
  CheckCircle2,
  LifeBuoy,
  MessageSquare,
  HelpCircle,
  Clock,
  MapPin,
  ChevronRight
} from "lucide-react";
import { useLocation } from "wouter";
import { ProformaInvoiceModal } from "./ProformaInvoiceModal";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  links?: { label: string; url: string; isProformaModal?: boolean; isTicketForm?: boolean }[];
  isGreeting?: boolean;
  isTicketSuccess?: boolean;
  ticketData?: {
    id: string;
    name: string;
    email: string;
    department: string;
    subject: string;
  };
}

// COMPREHENSIVE TOTAG KNOWLEDGE BASE
const KNOWLEDGE_BASE = [
  // 1. PROFORMA INVOICE & BILLING
  {
    keywords: ["proforma", "invoice", "pro forma", "quote", "quotation", "billing", "estimate", "pricing", "cost", "how much", "payment terms", "bank details", "ecobank", "momo", "orange money"],
    response: "TOTAG Group generates official Proforma Invoices and quotations with breakdown of line items, GST tax, and payment terms for all 6 major divisions. You can generate an official Proforma Invoice right now, or view our wire transfer details (Ecobank USD Acc: 1010-09823-01, Orange Money: 0770554433, MTN MoMo: 0880554433).",
    links: [
      { label: "📄 Open Proforma Invoice Generator", url: "#proforma", isProformaModal: true },
      { label: "💳 View Accounts Receivable & FIMS Portal", url: "/saas/modules/fims-accounts-receivable" }
    ]
  },

  // 2. DIGITAL FARMER REGISTRY (FAO UN RFP 137641 & MOA LIBERIA)
  {
    keywords: ["farmer", "agriculture", "registry", "fao", "unido", "moa", "ministry of agriculture", "farm", "agribusiness", "crops", "produce", "livestock", "cassava", "poultry", "palm oil", "voucher", "gis", "cadastral", "tewor", "counties"],
    response: "The Liberia Digital Farmer Registry (FAO UN RFP 137641 initiative) is a digital platform for farmer registration, GIS cadastral boundary mapping, producer entity scale classification (Individual Farmers, Cooperatives, Commercial Plantations), 23 RBAC roles, and mobile money input voucher distribution across all 15 statutory Liberian counties.",
    links: [
      { label: "🌾 Launch Digital Farmer Registry Portal", url: "/farm" },
      { label: "📊 Open Farmer Registration Wizard", url: "/farm/dashboard" }
    ]
  },

  // 3. MANAGED IT SERVICES & SAAS SUITE
  {
    keywords: ["it", "software", "saas", "fims", "hrmis", "tis", "tech", "cloud", "cyber", "cybersecurity", "web development", "mobile app", "workshop", "training"],
    response: "TOTAG IT Services (TIS) delivers enterprise software engineering, cloud infrastructure, cybersecurity audits, certified technical workshops, and our 14-module SaaS HRMIS & FIMS Enterprise Suite (General Ledger, Accounts Payable/Receivable, Payroll, Biometrics Attendance, and Leave Management).",
    links: [
      { label: "💻 Explore IT & Cloud Solutions", url: "/it-services" },
      { label: "⚡ View 14 SaaS Enterprise Modules", url: "/saas" }
    ]
  },

  // 4. TOCEPS CATERING & EVENTS
  {
    keywords: ["catering", "toceps", "food", "event", "banquet", "buffet", "wedding", "conference", "haccp", "food safety", "menu", "hospitality"],
    response: "TOTAG Catering & Event Planning Services (TOCEPS) handles institutional UNIDO catering, executive mining concession banquets, wedding receptions, and corporate conference hospitality operating under international HACCP food safety standards.",
    links: [
      { label: "🍲 TOCEPS Catering & Events Portal", url: "/catering" },
      { label: "📋 Executive Banquet Menu Packages", url: "/catering/specialty-menus" }
    ]
  },

  // 5. CARGO, FREIGHT LOGISTICS & MERCHANDISE
  {
    keywords: ["cargo", "shipping", "freight", "logistics", "port", "container", "20ft", "40ft", "stevedoring", "petroleum", "haulage", "merchandise", "tgm", "wholesale"],
    response: "TOTAG Cargo & General Merchandise (TGM) provides 20ft/40ft ocean container shipping, air freight forwarding, Monrovia port stevedoring customs clearance, petroleum haulage, heavy equipment spare parts, and regional wholesale merchandise distribution.",
    links: [
      { label: "🚚 General Merchandise & Freight Hub", url: "/general-merchandise" },
      { label: "📦 Track Active Shipment", url: "/order-tracking" }
    ]
  },

  // 6. CORPORATE LEADERSHIP & HEADQUARTERS
  {
    keywords: ["ceo", "founder", "leadership", "tarwoyouberkowu", "gwoah", "tonieh", "president", "owner", "location", "address", "hq", "paynesville", "phone", "contact", "email"],
    response: "TOTAG Group of Companies Ltd is led by Co-Founder & CEO M. Tarwoyouberkowu Gwoah alongside Co-Founder & Deputy CEO Mrs. Tonieh Alpha Gwoah. Corporate HQ: Guest House Road, Thinker's Village, Paynesville, Montserrado County, Liberia. Phone: +231 777 511 391 / +231 777 666 999. Email: info@totaggroup.com.",
    links: [
      { label: "🏢 About TOTAG Corporate Leadership", url: "/#about" },
      { label: "✉️ Domain & Email Setup", url: "/email-management" }
    ]
  },

  // 7. SUPPORT TICKET & HELP DESK
  {
    keywords: ["ticket", "support", "help", "complaint", "issue", "customer service", "agent", "contact us", "problem", "bug"],
    response: "You can submit an official Customer Service Ticket directly to the TOTAG FIMS/CRM Help Desk. Our dedicated support team responds within 2 business hours.",
    links: [
      { label: "🎫 Submit a Customer Support Ticket", url: "#ticket", isTicketForm: true }
    ]
  }
];

export default function VoiceChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [sessionStatus, setSessionStatus] = useState<string>("Ready to assist");
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);

  // Ticket Form Local State
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketDept, setTicketDept] = useState("Managed IT & SaaS");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello and welcome to TOTAG Group of Companies Ltd. How may I assist you today?",
      timestamp: "Just now",
      isGreeting: true
    }
  ]);

  const [_, setLocation] = useLocation();
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, showTicketForm]);

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[^\w\s.,?!]/gi, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Enforce Standard US / UK English Received Pronunciation Voice
    const voices = window.speechSynthesis.getVoices();
    const standardVoice = 
      voices.find((v) => (v.lang === "en-US" || v.lang === "en-GB") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Karen") || v.name.includes("Alex"))) ||
      voices.find((v) => v.lang === "en-US" || v.lang === "en-GB") ||
      voices.find((v) => v.lang.startsWith("en"));

    if (standardVoice) {
      utterance.voice = standardVoice;
      utterance.lang = standardVoice.lang;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Bot Response Logic
  const getBotResponse = (userText: string): Message => {
    const lower = userText.toLowerCase().trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Clean, Professional Standard English Greeting
    const greetingWords = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings", "salut", "start"];
    if (greetingWords.some(w => lower === w || lower.startsWith(w + " ") || lower.endsWith(" " + w))) {
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Hello! How may I assist you today?",
        timestamp,
        isGreeting: true
      };
    }

    // 2. Ticket / Help Desk Query
    if (lower.includes("ticket") || lower.includes("complaint") || lower.includes("help desk") || lower.includes("open ticket")) {
      setShowTicketForm(true);
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "I can help you log an official Customer Support Ticket directly into our FIMS Help Desk. Please fill out the quick support form below:",
        timestamp,
        links: [
          { label: "🎫 Open Support Ticket Form", url: "#ticket", isTicketForm: true }
        ]
      };
    }

    // 3. Proforma Query
    if (lower.includes("proforma") || lower.includes("invoice") || lower.includes("quote") || lower.includes("quotation")) {
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "You can generate an official TOTAG Group Proforma Invoice right now with custom line items, tax rate, and Ecobank / Mobile Money wire instructions. Click the button below to open the interactive generator:",
        timestamp,
        links: [
          { label: "📄 Open Proforma Invoice Generator", url: "#proforma", isProformaModal: true },
          { label: "💳 FIMS Accounts Receivable Suite", url: "/saas/modules/fims-accounts-receivable" }
        ]
      };
    }

    // 4. Knowledge Base Keyword Search
    for (const entry of KNOWLEDGE_BASE) {
      if (entry.keywords.some(kw => lower.includes(kw))) {
        return {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: entry.response,
          timestamp,
          links: entry.links
        };
      }
    }

    // 5. Intelligent Fallback Response
    return {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: `Thank you for inquiring about "${userText}". TOTAG Group of Companies Ltd provides turnkey solutions across 6 major divisions under CEO M. Tarwoyouberkowu Gwoah. You can generate a formal Proforma Invoice, speak directly with our team at +231 777 511 391, or file a support ticket. How else can I assist you?`,
      timestamp,
      links: [
        { label: "📄 Generate Proforma Invoice", url: "#proforma", isProformaModal: true },
        { label: "🎫 Submit Support Ticket", url: "#ticket", isTicketForm: true },
        { label: "🏢 Explore All Divisions", url: "/#services" }
      ]
    };
  };

  const handleUserSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    setTimeout(() => {
      const botReply = getBotResponse(textToSend);
      setMessages(prev => [...prev, botReply]);
      speakText(botReply.text);
    }, 400);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketSubject) return;

    const ticketId = `TOT-TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const ticketSuccessMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: `Support Ticket [${ticketId}] logged successfully for ${ticketName}! Our customer support team for ${ticketDept} will contact you at ${ticketEmail} within 2 business hours.`,
      timestamp,
      isTicketSuccess: true,
      ticketData: {
        id: ticketId,
        name: ticketName,
        email: ticketEmail,
        department: ticketDept,
        subject: ticketSubject
      }
    };

    setMessages(prev => [...prev, ticketSuccessMsg]);
    setShowTicketForm(false);
    setTicketSubject("");
    setTicketMessage("");
    speakText(`Support Ticket ${ticketId} logged successfully. We will contact you at ${ticketEmail}.`);
  };

  const toggleMic = () => {
    const SpeechClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechClass) {
      alert("Voice recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setSessionStatus("Listening...");
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setIsListening(false);
        setSessionStatus("Ready to assist");
        handleUserSend(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSessionStatus("Voice error. Try typing.");
      };

      recognition.onend = () => {
        setIsListening(false);
        setSessionStatus("Ready to assist");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* FLOATING WIDGET CONTAINER */}
      <div className="fixed bottom-6 right-6 z-[9999] font-sans">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-[380px] sm:w-[440px] max-w-[94vw] h-[640px] max-h-[85vh] bg-slate-900 text-slate-100 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-3 backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="glass-header p-4 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20">
                      <img src="/images/totag-logo.png" alt="TOTAG Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      TOTAG AI Customer Concierge
                    </h4>
                    <p className="text-[11px] text-emerald-400 font-semibold">Live 24/7 Service &amp; Support</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (isSpeaking) stopSpeaking();
                      setVoiceEnabled(!voiceEnabled);
                    }}
                    className={`p-2 rounded-xl text-xs transition-colors ${voiceEnabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"}`}
                    title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      stopSpeaking();
                      setIsOpen(false);
                    }}
                    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-slate-950 px-4 py-1.5 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{sessionStatus}</span>
                </span>
                <span className="text-[10px] text-slate-500">ISO/IEC Compliant Assistant</span>
              </div>

              {/* Chat Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        msg.sender === "user" ? "bg-sky-600 text-white font-bold text-[10px]" : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                        msg.sender === "user"
                          ? "bg-sky-600 text-white rounded-tr-sm font-medium"
                          : "bg-slate-800/90 text-slate-100 border border-white/10 rounded-tl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Ticket Confirmation Card */}
                      {msg.isTicketSuccess && msg.ticketData && (
                        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 space-y-1 font-mono text-[11px]">
                          <p className="font-extrabold text-white flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ticket Logged #{msg.ticketData.id}
                          </p>
                          <p><span className="text-slate-400">Name:</span> {msg.ticketData.name}</p>
                          <p><span className="text-slate-400">Dept:</span> {msg.ticketData.department}</p>
                          <p><span className="text-slate-400">Email:</span> {msg.ticketData.email}</p>
                        </div>
                      )}

                      {/* Action Links & Buttons */}
                      {msg.links && msg.links.length > 0 && (
                        <div className="pt-2 border-t border-white/10 space-y-1.5">
                          {msg.links.map((link, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (link.isProformaModal) {
                                  setShowProformaModal(true);
                                } else if (link.isTicketForm) {
                                  setShowTicketForm(true);
                                } else if (link.url.startsWith("#")) {
                                  // internal action
                                } else {
                                  setLocation(link.url);
                                  setIsOpen(false);
                                }
                              }}
                              className="w-full text-left text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all group"
                            >
                              <span className="flex items-center gap-1.5">
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                {link.label}
                              </span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 block text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Inline Support Ticket Form */}
                {showTicketForm && (
                  <form onSubmit={handleTicketSubmit} className="glass-card p-4 rounded-2xl border border-white/15 space-y-3 bg-slate-800/90 text-xs">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h5 className="font-extrabold text-white flex items-center gap-1.5">
                        <LifeBuoy className="w-4 h-4 text-emerald-400" /> Create Customer Support Ticket
                      </h5>
                      <button type="button" onClick={() => setShowTicketForm(false)} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Your Name</label>
                        <input
                          type="text"
                          required
                          value={ticketName}
                          onChange={e => setTicketName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full glass-input rounded-lg p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Your Email</label>
                        <input
                          type="email"
                          required
                          value={ticketEmail}
                          onChange={e => setTicketEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full glass-input rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold">Subsidiary / Department</label>
                      <select
                        value={ticketDept}
                        onChange={e => setTicketDept(e.target.value)}
                        className="w-full glass-input rounded-lg p-2 text-xs bg-slate-950 text-white"
                      >
                        <option value="Managed IT & SaaS">Managed IT &amp; SaaS Solutions</option>
                        <option value="Digital Farmer Registry">Digital Farmer Registry (FAO UN)</option>
                        <option value="TOCEPS Catering">TOCEPS Catering Services</option>
                        <option value="FIMS Payment & Proforma">FIMS Payment &amp; Billing</option>
                        <option value="Cargo & Logistics">Cargo &amp; Freight Logistics</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold">Subject / Topic</label>
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={e => setTicketSubject(e.target.value)}
                        placeholder="Inquiry about platform services..."
                        className="w-full glass-input rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Button type="button" variant="outline" onClick={() => setShowTicketForm(false)} className="h-8 text-xs border-white/10">
                        Cancel
                      </Button>
                      <Button type="submit" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 font-bold text-white">
                        Submit Ticket
                      </Button>
                    </div>
                  </form>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2 border-t border-white/10 bg-slate-950/80 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    onClick={() => setShowProformaModal(true)}
                    className="shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Generate Proforma</span>
                  </button>

                  <button
                    onClick={() => handleUserSend("Digital Farmer Registry FAO UN")}
                    className="shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-1"
                  >
                    <Wheat className="w-3 h-3" />
                    <span>Farmer Registry</span>
                  </button>

                  <button
                    onClick={() => handleUserSend("IT & SaaS Solutions")}
                    className="shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 transition-all flex items-center gap-1"
                  >
                    <Laptop className="w-3 h-3" />
                    <span>IT &amp; SaaS</span>
                  </button>

                  <button
                    onClick={() => setShowTicketForm(true)}
                    className="shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all flex items-center gap-1"
                  >
                    <LifeBuoy className="w-3 h-3" />
                    <span>File Ticket</span>
                  </button>
                </div>
              </div>

              {/* Input Footer */}
              <div className="p-3 glass-header border-t border-white/10 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUserSend(inputText);
                  }}
                  className="flex items-center gap-2"
                >
                  <Button
                    type="button"
                    onClick={toggleMic}
                    className={`w-10 h-10 rounded-xl shrink-0 p-0 transition-colors ${
                      isListening ? "bg-rose-600 text-white animate-pulse" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                    title={isListening ? "Stop Listening" : "Speak Message"}
                  >
                    {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>

                  <Input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message or query..."
                    className="glass-input rounded-xl text-xs flex-1"
                  />

                  <Button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING CONCIERGE BUTTON */}
        <button
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
              stopSpeaking();
            }
          }}
          className={`w-14 h-14 rounded-full p-2.5 shadow-2xl flex items-center justify-center transition-all duration-300 border-2 ${
            isOpen
              ? "bg-slate-900 text-white border-emerald-500 ring-4 ring-emerald-500/20"
              : "bg-slate-900 text-white border-emerald-400 ring-4 ring-emerald-500/30 hover:scale-105"
          }`}
          title="TOTAG AI Customer Concierge"
        >
          <img src="/images/totag-logo.png" alt="TOTAG Logo" className="w-full h-full object-contain" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-md border border-slate-900">
            <MessageSquare className="w-3 h-3" />
          </div>
        </button>
      </div>

      {/* RENDER PROFORMA INVOICE MODAL DIRECTLY */}
      <ProformaInvoiceModal
        isOpen={showProformaModal}
        onClose={() => setShowProformaModal(false)}
      />
    </>
  );
}
