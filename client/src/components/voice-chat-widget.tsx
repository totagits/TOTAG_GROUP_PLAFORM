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
  DollarSign
} from "lucide-react";
import { useLocation } from "wouter";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  links?: { label: string; url: string }[];
}

const TOTAG_COMPREHENSIVE_KNOWLEDGE = [
  // FAREWELL
  {
    keywords: ["bye", "goodbye", "that is all", "that's all", "nothing else", "no more", "im done", "i am done", "no thanks", "no thank you", "thank you", "thanks"],
    response: "Thank you for contacting TOTAG Group of Companies Ltd. It was our absolute pleasure assisting you. Remember our promise: 'Deliver the right solution, at the right standard, at the right time.' We look forward to serving you again. Have a wonderful day!",
    isFarewell: true
  },

  // LEADERSHIP / CEO / FOUNDERS / MANAGEMENT
  {
    keywords: ["ceo", "chief executive officer", "founder", "co-founder", "leadership", "president", "owner", "tarwoyouberkowu", "gwoah", "tonieh", "deputy ceo", "who runs", "management"],
    response: "TOTAG Group of Companies Ltd is led by Co-Founder & Chief Executive Officer (CEO) M. Tarwoyouberkowu Gwoah, who provides strategic leadership, technology vision, and procurement oversight with an extensive background in IT, agriculture, and field operations. The company is co-led by Co-Founder & Deputy CEO Mrs. Tonieh Alpha Gwoah, who oversees executive administration, procurement documentation, client engagement, and women's leadership initiatives.",
    links: [
      { label: "About TOTAG Leadership", url: "/#about" },
      { label: "Corporate Contact Desk", url: "/#contact" }
    ]
  },

  // HEADQUARTERS / LOCATION / CONTACT / PHONE NUMBERS
  {
    keywords: ["location", "address", "headquarters", "hq", "where are you", "where is totag", "phone", "number", "contact", "call", "office", "paynesville", "montserrado", "thinker's village"],
    response: "TOTAG Group is headquartered at Guest House Road, Thinker's Village Community, Paynesville, Montserrado County, Liberia. You can reach us by phone at +231 777 511 391, +231 777 666 999, +231 886 511 391, or +231 887 666 999. Our corporate email is info@totaggroup.com.",
    links: [
      { label: "Contact Corporate Office", url: "/#contact" },
      { label: "Corporate Email Management", url: "/email-management" }
    ]
  },

  // QUOTE REQUESTS FOR ALL 9 SUBSIDIARIES
  {
    keywords: ["quote", "quotation", "price", "pricing", "cost", "how much", "estimate", "proposal", "tender", "bid", "invoice", "proforma"],
    response: "We provide formal quotations, proforma invoices, technical proposals, and institutional tender responses across all 9 subsidiaries. To request an instant quote, please specify the subsidiary (e.g., Cargo Logistics, Farm Produce, Solar Microgrids, IT SaaS, TOCEPS Catering, Construction, Petroleum, Stationery, or Merchandise) or contact our procurement desk at info@totaggroup.com or call +231 777 511 391.",
    links: [
      { label: "Request a Corporate Quote", url: "/#contact" },
      { label: "TOCEPS Catering Quote & Invoices", url: "/catering" },
      { label: "Cargo Logistics Quote", url: "/cargo" },
      { label: "Solar Energy Assessment", url: "/solar" }
    ]
  },

  // GREETING / OVERVIEW / COMPANY SNAPSHOT
  {
    keywords: ["hello", "hi", "hey", "who are you", "greeting", "start", "good morning", "good afternoon", "good evening", "company profile", "about"],
    response: "Hello! Welcome to TOTAG Group of Companies Ltd. Our motto is 'Innovating Tomorrow, Empowering Today.' Headquartered in Paynesville, Liberia, we deliver integrated solutions across 9 business divisions spanning Cargo Logistics, Agriculture, IT & SaaS, Solar Smart Power, Catering, Petroleum, Construction, General Merchandise, and Stationery Supplies. How may I assist you today?",
    links: [
      { label: "Explore All 9 Subsidiaries", url: "/#services" },
      { label: "Request a Formal Quote", url: "/#contact" }
    ]
  },

  // 1. CARGO HANDLING & LOGISTICS
  {
    keywords: ["cargo", "shipping", "freight", "logistics", "port", "tracking", "container", "vessel", "ship", "customs", "delivery", "field delivery"],
    response: "TOTAG Cargo Handling & Logistics provides international maritime freight forwarding, air cargo, port customs clearance, and nationwide field delivery across Liberia's 15 counties. We ensure complete packaging review, real-time shipment tracking, and secure delivery confirmation.",
    links: [
      { label: "Cargo Logistics Portal", url: "/cargo" },
      { label: "Track Your Shipment", url: "/order-tracking" }
    ]
  },

  // 2. TOTAG FARM & AGRIBUSINESS
  {
    keywords: ["farm", "agriculture", "agribusiness", "crops", "produce", "livestock", "cassava", "poultry", "palm oil", "fertilizer", "seeds", "farming tools", "irrigation"],
    response: "TOTAG FARM & Agribusiness leads sustainable agriculture, crop production, poultry, livestock, and post-harvest agro-processing in Liberia. We supply agricultural inputs, fertilizers, irrigation systems, and climate-smart farming solutions to strengthen food security.",
    links: [
      { label: "TOTAG Farm Hub", url: "/farm" },
      { label: "Farm Management Console", url: "/farm/login" }
    ]
  },

  // 3. SOLAR & SMART ENERGY
  {
    keywords: ["solar", "energy", "power", "deye", "inverter", "electricity", "renewable", "battery", "storage", "telemetry", "noc", "microgrid"],
    response: "TOTAG Solar Smart Power engineers turnkey solar microgrids, Deye hybrid inverter systems, lithium battery storage, solar irrigation pumps, and 24/7 telemetry Network Operations Center monitoring for commercial, agricultural, and residential facilities.",
    links: [
      { label: "Solar Energy & Deye Systems", url: "/solar" }
    ]
  },

  // 4. IT SERVICES & 14 SAAS MODULES
  {
    keywords: ["it", "software", "saas", "fims", "hrmis", "tis", "tech", "cloud", "cyber", "cybersecurity", "app", "custom software", "modules", "hrm"],
    response: "TOTAG IT Services (TIS) delivers managed enterprise IT infrastructure, cybersecurity, and our proprietary 14-module FIMS Financial & HRMIS Enterprise Suite (General Ledger, Payroll, Biometrics, Leave, Procurement, and Compliance). You can reach IT directly at tis@totaggroup.com.",
    links: [
      { label: "IT Services Portal", url: "/it-services" },
      { label: "Enterprise SaaS Suite", url: "/saas" }
    ]
  },

  // 5. TOCEPS CATERING & EVENTS (UNIDO)
  {
    keywords: ["catering", "toceps", "food", "event", "unido", "buffet", "meal", "wedding", "banquet", "hospitality", "conference catering"],
    response: "TOTAG Catering & Event Planning Services (TOCEPS) manages institutional catering, UNIDO contract deliverables, executive banquets, wedding receptions, and conference hospitality with certified food safety standards. Email toceps@totaggroup.com for bookings and event invoices.",
    links: [
      { label: "TOCEPS Catering Services", url: "/catering" },
      { label: "Document Vault & Dashboard", url: "/catering/ops/dashboard" }
    ]
  },

  // 6. PETROLEUM SERVICES
  {
    keywords: ["petroleum", "fuel", "diesel", "gasoline", "depot", "oil", "haulage", "bulk fuel"],
    response: "TOTAG Petroleum Services operates certified bulk fuel storage facilities, commercial petroleum supply depots, and reliable fuel haulage logistics across Liberia with an emphasis on safety and dependable supply.",
    links: [
      { label: "Petroleum Services", url: "/petroleum" }
    ]
  },

  // 7. GENERAL CONSTRUCTION
  {
    keywords: ["construction", "building", "civil", "roads", "infrastructure", "engineering", "renovation", "rehabilitation"],
    response: "TOTAG General Construction provides civil engineering, commercial building construction, road rehabilitation, facility improvement, and structural works delivered to international quality and safety standards.",
    links: [
      { label: "Construction Services", url: "/construction" }
    ]
  },

  // 8. GENERAL MERCHANDISE (TGM)
  {
    keywords: ["merchandise", "tgm", "retail", "wholesale", "goods", "fmcg", "consumer goods"],
    response: "TOTAG General Merchandise (TGM) manages large-scale wholesale procurement, FMCG distribution, and retail supply of consumer and commercial goods across regional markets.",
    links: [
      { label: "General Merchandise Hub", url: "/general-merchandise" }
    ]
  },

  // 9. STATIONERY & OFFICE SUPPLIES
  {
    keywords: ["stationery", "office", "supplies", "printing", "paper", "procurement", "scholastic", "furniture"],
    response: "TOTAG Stationery Supplies provides bulk B2B office procurement, executive furniture, computer consumables, and scholastic printing materials for corporate, government, and institutional clients.",
    links: [
      { label: "Stationery Supplies", url: "/stationery" }
    ]
  },

  // COMPLIANCE / UNGM / QUANTUM / PROCUREMENT READINESS
  {
    keywords: ["compliance", "ungm", "quantum", "tax", "registration", "documentation", "donor", "procurement readiness", "standards"],
    response: "TOTAG Group maintains complete procurement readiness for institutional tenders, Quantum, UNGM, government, NGO, and multilateral donor formats. We provide formal quotations, certified tax documentation, technical proposals, and warranty commitments.",
    links: [
      { label: "Corporate Governance Console", url: "/admin-dashboard" },
      { label: "Contact Procurement Desk", url: "/#contact" }
    ]
  },

  // ALL 9 SUBSIDIARIES SUMMARY
  {
    keywords: ["subsidiary", "subsidiaries", "companies", "services", "all", "nine", "9", "divisions"],
    response: "TOTAG Group encompasses 9 specialized subsidiaries: 1. Cargo Handling & Logistics, 2. TOTAG Farm & Agribusiness, 3. Solar Smart Power, 4. Managed IT Services & SaaS, 5. TOCEPS Catering & Events, 6. Petroleum Services, 7. General Construction, 8. General Merchandise, and 9. Stationery Supplies.",
    links: [
      { label: "View All 9 Subsidiaries", url: "/#services" }
    ]
  }
];

function getBotResponse(userText: string): { response: string; links?: { label: string; url: string }[]; isFarewell?: boolean } {
  const lower = userText.toLowerCase().trim();

  for (const item of TOTAG_COMPREHENSIVE_KNOWLEDGE) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return { response: item.response, links: item.links, isFarewell: (item as any).isFarewell };
    }
  }

  return {
    response: `Thank you for asking about "${userText}". TOTAG Group of Companies Ltd provides solutions across our 9 subsidiaries under CEO M. Tarwoyouberkowu Gwoah. You can request a quote, speak directly with our team at +231 777 511 391, or email info@totaggroup.com. How else may I assist you?`,
    links: [
      { label: "Explore Our Subsidiaries", url: "/#services" },
      { label: "Request a Formal Quote", url: "/#contact" }
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
      text: "Welcome to TOTAG Group of Companies Ltd. I am your corporate voice assistant in Monrovia, Liberia. I can provide quotes, details on our 9 subsidiaries, leadership information, and contact numbers. How may I assist you?",
      timestamp: "Just now",
      links: [
        { label: "Request a Formal Quote", url: "/#contact" },
        { label: "Explore 9 Subsidiaries", url: "/#services" },
        { label: "Leadership & Company Profile", url: "/#about" }
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
    setSessionStatus("Processing question...");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    setTimeout(() => {
      const { response, links, isFarewell } = getBotResponse(queryText);

      if (isFarewell) {
        triggerFarewellAndClose(response);
        return;
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        links
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
        setSessionStatus("Listening... (Speak your question)");

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
    "Who is the CEO of TOTAG Group?",
    "How do I request a quote?",
    "What are the 9 Subsidiaries?",
    "What are your phone numbers & HQ?",
    "Tell me about Cargo Logistics",
    "TOCEPS Catering & UNIDO contracts"
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
            className="w-[380px] sm:w-[420px] max-w-[92vw] h-[620px] max-h-[85vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden mb-4"
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
                  <p className="text-[11px] text-emerald-300/90 font-medium">Paynesville, Liberia ⟷ Global Reach</p>
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
            <div className="bg-slate-950/80 border-b border-emerald-500/20 px-4 py-2.5 flex items-center justify-between text-xs text-white">
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
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
                    className={`max-w-[80%] rounded-2xl p-3.5 leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-sky-600 text-white rounded-tr-sm shadow-md font-medium"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/5 rounded-tl-sm font-normal"
                    }`}
                  >
                    <p>{msg.text}</p>

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
                Tap to Ask in 1-Click:
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
                  placeholder={isListening ? "Listening... or type message" : "Ask about CEO, quotes, or services..."}
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
            <span>Speak with TOTAG AI</span>
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
