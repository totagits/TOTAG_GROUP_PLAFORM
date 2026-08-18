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
  RotateCcw,
  MessageSquare,
  HelpCircle,
  Headphones
} from "lucide-react";
import { useLocation } from "wouter";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  links?: { label: string; url: string }[];
}

const TOTAG_KNOWLEDGE_PATOIS = [
  {
    keywords: ["hello", "hi", "hey", "who are you", "greeting", "start", "how you doing", "what's up", "kolo", "patois", "talk"],
    response: "Hello my people! Welcome to TOTAG Group of Companies Ltd! Da me your AI voice assistant right here in Monrovia, Liberia. We bringing the whole 9 big-big companies from Liberia all the way to Seattle, USA! You want Cargo, Farm produce, IT SaaS software, TOCEPS catering, Solar light, or Construction? Talk to me, I ready for you!",
    links: [
      { label: "See All 9 Companies", url: "/#services" },
      { label: "Talk to Corporate", url: "/#contact" }
    ]
  },
  {
    keywords: ["cargo", "shipping", "freight", "logistics", "seattle", "port", "tracking", "container", "vessel", "ship", "boat"],
    response: "Look here my people, TOTAG Cargo Handling and Logistics na small thing oh! We packing heavy containers and moving sea and air cargo straight from Monrovia port to Seattle, USA. We clearing customs fast-fast and tracking your container one time!",
    links: [
      { label: "Open Cargo Logistics", url: "/cargo" },
      { label: "Track Your Shipment", url: "/order-tracking" }
    ]
  },
  {
    keywords: ["it", "software", "saas", "fims", "hrmis", "tis", "tech", "cloud", "cyber", "computer", "app"],
    response: "Da IT software business you asking about? TOTAG IT Services running heavy enterprise tech, cybersecurity, and full 14 FIMS Financial and HRMIS modules for business! Hit our tech people direct on tis@totaggroup.com, they will fix you up one time!",
    links: [
      { label: "Open IT Services Portal", url: "/it-services" },
      { label: "14 FIMS/HRMIS SaaS Modules", url: "/saas" }
    ]
  },
  {
    keywords: ["catering", "toceps", "food", "event", "unido", "buffet", "meal", "wedding", "banquet", "invoice", "cook"],
    response: "Ah, TOCEPS Catering and Event Planning na master of sweet food and big-big programs! We catering for UNIDO contract deliverables, executive corporate meetings, and wedding banquets with proper protocol. For invoices and bookings, email our food desk on toceps@totaggroup.com!",
    links: [
      { label: "TOCEPS Catering Services", url: "/catering" },
      { label: "Executive Document Vault", url: "/catering/ops/dashboard" }
    ]
  },
  {
    keywords: ["farm", "agriculture", "livestock", "crops", "produce", "food supply", "cassava", "poultry", "chicken", "pig", "cow", "palm oil"],
    response: "TOTAG Farm doing serious agribusiness oh! Fresh cassava, rich palm oil, healthy livestock and poultry fresh from the soil right here in Liberia. Food security na play play business with we!",
    links: [
      { label: "Visit TOTAG Farm Hub", url: "/farm" }
    ]
  },
  {
    keywords: ["solar", "energy", "power", "deye", "inverter", "electricity", "renewable", "battery", "light", "generator", "current"],
    response: "No more darkness business! TOTAG Solar Energy and Deye hybrid inverters bringing clean 24/7 solar smart power with heavy battery storage straight to your home, office, and factory. Light will shine always!",
    links: [
      { label: "Solar Energy & Deye Inverters", url: "/solar" }
    ]
  },
  {
    keywords: ["petroleum", "fuel", "diesel", "gasoline", "depot", "oil", "gas"],
    response: "From bulk petroleum depot storage to heavy fuel haulage, TOTAG Petroleum supplying certified diesel, gasoline, and lubricants for commercial fleets and industries across Liberia.",
    links: [
      { label: "Petroleum Services", url: "/petroleum" }
    ]
  },
  {
    keywords: ["construction", "building", "civil", "roads", "infrastructure", "cement", "house"],
    response: "TOTAG General Construction doing the real heavy civil engineering! Roads, strong concrete foundations, and modern architectural buildings built to last long-long time.",
    links: [
      { label: "Construction Services", url: "/construction" }
    ]
  },
  {
    keywords: ["stationery", "office", "supplies", "printing", "paper", "pen", "books"],
    response: "TOTAG Stationery Supplies providing bulk B2B office materials, high-speed printing supplies, and school materials for business and institutions plenty-plenty.",
    links: [
      { label: "Stationery Supplies", url: "/stationery" }
    ]
  },
  {
    keywords: ["merchandise", "tgm", "retail", "wholesale", "goods", "market", "store"],
    response: "TOTAG General Merchandise (TGM) got all your wholesale and retail trading goods in town, supplying quality FMCG products and consumer goods across local markets.",
    links: [
      { label: "General Merchandise Hub", url: "/general-merchandise" }
    ]
  },
  {
    keywords: ["contact", "email", "phone", "address", "location", "office", "where", "call", "reach"],
    response: "You want to reach we? Head office right here in Monrovia, Liberia with connection to Seattle, USA. Send corporate mail to info@totaggroup.com, IT requests to tis@totaggroup.com, or Catering to toceps@totaggroup.com. We ready for you!",
    links: [
      { label: "Contact Information", url: "/#contact" }
    ]
  },
  {
    keywords: ["subsidiary", "subsidiaries", "companies", "services", "all", "nine", "9"],
    response: "TOTAG Group running 9 solid subsidiaries: 1. Cargo Logistics (Liberia to Seattle), 2. Farm & Agribusiness, 3. Petroleum, 4. General Construction, 5. General Merchandise, 6. TOCEPS Catering, 7. Managed IT & SaaS, 8. Stationery, and 9. Solar Smart Power!",
    links: [
      { label: "Explore All 9 Subsidiaries", url: "/#services" }
    ]
  }
];

function getBotResponse(userText: string): { response: string; links?: { label: string; url: string }[] } {
  const lower = userText.toLowerCase();

  for (const item of TOTAG_KNOWLEDGE_PATOIS) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return { response: item.response, links: item.links };
    }
  }

  return {
    response: `My people, I hear you about "${userText}"! TOTAG Group running 9 solid companies across Cargo, IT & SaaS, TOCEPS Catering, Agribusiness, Solar Power, Petroleum, Construction, General Merchandise, and Stationery from Liberia to Seattle. You want to see our services or send us a message direct?`,
    links: [
      { label: "Explore 9 Companies", url: "/#services" },
      { label: "Talk to Us Direct", url: "/#contact" }
    ]
  };
}

export default function VoiceChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello my people! Da TOTAG Voice Assistant right here in Monrovia, Liberia. Tap the mic or type to ask about any of our 9 companies, Seattle trade routes, or corporate services!",
      timestamp: "Just now",
      links: [
        { label: "Explore 9 Companies", url: "/#services" },
        { label: "Cargo (Liberia ↔ Seattle)", url: "/cargo" },
        { label: "Talk to Corporate", url: "/#contact" }
      ]
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
  }, [messages, isListening, isSpeaking]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Warm rhythmic speech rate for natural Liberian cadence
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    
    const voices = window.speechSynthesis.getVoices();
    // Prefer West African / African English / British English / natural voices
    const selectedVoice = 
      voices.find((v) => v.lang === "en-NG" || v.lang === "en-GH" || v.lang === "en-ZA") ||
      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Arthur"))) ||
      voices.find((v) => v.lang.startsWith("en"));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          handleUserQuery(transcriptText);
          setTranscript("");
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [voiceEnabled]);

  const toggleListening = () => {
    stopSpeaking();
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setTranscript("Listening... Talk now!");
        } catch (e) {
          console.warn("Mic start error:", e);
        }
      } else {
        alert("Speech recognition not supported in this browser. Please type your message.");
      }
    }
  };

  const handleUserQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    setTimeout(() => {
      const { response, links } = getBotResponse(queryText);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        links
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(response);
    }, 400);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserQuery(inputText.trim());
    }
  };

  const quickPrompts = [
    "Tell me about the 9 Companies",
    "Cargo from Monrovia to Seattle",
    "IT SaaS 14 modules",
    "TOCEPS sweet catering & UNIDO",
    "Solar light & Deye inverters",
    "How to reach we?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      
      {/* EXPANDED VOICE CHAT MODAL / PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[380px] sm:w-[410px] max-w-[92vw] h-[590px] max-h-[84vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header with TOTAG Logo & Liberian Kolokwa Badge */}
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
                    TOTAG Voice Assistant
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono">
                      🇱🇷 Kolokwa
                    </span>
                  </h4>
                  <p className="text-[11px] text-emerald-300/90 font-medium">Monrovia, Liberia ⟷ Seattle, USA</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Voice Mute / Unmute */}
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setVoiceEnabled(!voiceEnabled);
                  }}
                  className={`p-2 rounded-xl text-xs font-bold transition-all ${
                    voiceEnabled ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30" : "bg-white/10 text-slate-400 hover:bg-white/20"
                  }`}
                  title={voiceEnabled ? "Voice Speech Active" : "Voice Speech Muted"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    stopSpeaking();
                    if (isListening && recognitionRef.current) recognitionRef.current.stop();
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Speaking / Listening Audio Visualizer Bar */}
            {(isListening || isSpeaking) && (
              <div className="bg-emerald-500/10 dark:bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1 h-2 bg-emerald-300 rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="w-1 h-4 bg-emerald-500 rounded-full animate-bounce [animation-delay:450ms]" />
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {isListening ? (transcript || "Listening... Talk now!") : "Speaking Kolokwa response..."}
                  </span>
                </div>

                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="text-[10px] font-bold text-slate-500 hover:text-rose-500 underline"
                  >
                    Stop Talking
                  </button>
                )}
              </div>
            )}

            {/* Message Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.sender === "user"
                        ? "bg-sky-600 text-white font-bold text-[10px]"
                        : "bg-emerald-600/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <img src="/images/totag-logo.png" alt="TOTAG" className="w-4 h-4 object-contain" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[78%] rounded-2xl p-3 leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-sky-600 text-white rounded-tr-sm"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/5 rounded-tl-sm font-medium"
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Quick Action Navigation Links */}
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
                              setIsOpen(false);
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

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUserQuery(prompt)}
                    className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Voice Trigger Footer */}
            <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10">
              <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={toggleListening}
                  className={`w-10 h-10 rounded-2xl shrink-0 p-0 transition-all ${
                    isListening
                      ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-600/30"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                  }`}
                  title={isListening ? "Stop Listening" : "Tap to Speak Liberian Patois"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>

                <Input
                  type="text"
                  placeholder={isListening ? "Listening to your voice..." : "Talk or type to TOTAG Kolokwa AI..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10"
                />

                <Button
                  type="submit"
                  disabled={!inputText.trim()}
                  size="sm"
                  className="w-10 h-10 rounded-2xl shrink-0 p-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-400"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION TRIGGER BUTTON WITH TOTAG LOGO */}
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
            <span>🇱🇷 Talk with TOTAG AI (Kolokwa)</span>
          </motion.div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full p-2.5 shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-slate-900 text-white ring-4 ring-emerald-500/30"
              : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-emerald-500 ring-4 ring-emerald-500/20 hover:ring-emerald-500/40"
          }`}
          title="TOTAG Voice Assistant (Liberian Kolokwa)"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />

          {/* TOTAG GROUP LOGO */}
          <img
            src="/images/totag-logo.png"
            alt="TOTAG Group Logo"
            className="w-full h-full object-contain relative z-10"
          />

          {/* Small Microphone Indicator Badge */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 z-20">
            <Mic className="w-2.5 h-2.5" />
          </div>
        </button>
      </motion.div>
    </div>
  );
}
