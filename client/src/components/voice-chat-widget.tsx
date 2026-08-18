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

const TOTAG_KNOWLEDGE = [
  {
    keywords: ["hello", "hi", "hey", "who are you", "greeting", "start"],
    response: "Hello! Welcome to TOTAG Group of Companies Ltd. I am your intelligent voice assistant. I can guide you through our 9 specialized enterprise subsidiaries, international trade routes from Liberia to Seattle, customer services, or connect you directly with our departments. What can I assist you with today?",
    links: [
      { label: "Explore 9 Subsidiaries", url: "/#services" },
      { label: "Contact Corporate", url: "/#contact" }
    ]
  },
  {
    keywords: ["cargo", "shipping", "freight", "logistics", "seattle", "port", "tracking", "container", "vessel"],
    response: "TOTAG Cargo Handling & Logistics provides end-to-end maritime freight, air cargo, and customs clearance bridging Liberia's ports with global trade hubs including Seattle, USA. We manage container freight, warehousing, and real-time cargo tracking.",
    links: [
      { label: "Cargo Logistics Portal", url: "/cargo" },
      { label: "Track Shipment", url: "/order-tracking" }
    ]
  },
  {
    keywords: ["it", "software", "saas", "fims", "hrmis", "tis", "tech", "cloud", "cyber"],
    response: "TOTAG IT Services & SaaS delivers enterprise managed IT, cybersecurity, and our proprietary 14-module FIMS Financial & HRMIS Enterprise Suite. You can reach our IT department directly at tis@totaggroup.com.",
    links: [
      { label: "IT Services Portal", url: "/it-services" },
      { label: "Enterprise SaaS Suite", url: "/saas" }
    ]
  },
  {
    keywords: ["catering", "toceps", "food", "event", "unido", "buffet", "meal", "wedding", "banquet", "invoice"],
    response: "TOTAG Catering & Event Planning Services (TOCEPS) handles corporate catering, UNIDO contract deliverable hospitality, executive banquets, and high-volume meal distribution. You can reach our billing and operations team at toceps@totaggroup.com.",
    links: [
      { label: "TOCEPS Catering", url: "/catering" },
      { label: "Catering Ops Dashboard", url: "/catering/ops/dashboard" }
    ]
  },
  {
    keywords: ["farm", "agriculture", "livestock", "crops", "produce", "food supply", "cassava", "poultry"],
    response: "TOTAG FARM & Agribusiness manages sustainable crop farming, poultry, livestock, and commercial agricultural supply chains across West Africa, ensuring premium food security and organic distribution.",
    links: [
      { label: "TOTAG Farm Hub", url: "/farm" }
    ]
  },
  {
    keywords: ["solar", "energy", "power", "deye", "inverter", "electricity", "renewable", "battery"],
    response: "TOTAG Solar Energy & Smart Power engineers turnkey solar microgrids, Deye hybrid inverter architectures, industrial battery storage, and 24/7 telemetry Network Operations Center monitoring.",
    links: [
      { label: "Solar Energy & Deye", url: "/solar" }
    ]
  },
  {
    keywords: ["petroleum", "fuel", "diesel", "gasoline", "depot", "oil"],
    response: "TOTAG Petroleum Services operates certified bulk fuel storage, commercial supply depots, and haulage logistics for industrial clients across Liberia.",
    links: [
      { label: "Petroleum Services", url: "/petroleum" }
    ]
  },
  {
    keywords: ["construction", "building", "civil", "roads", "infrastructure"],
    response: "TOTAG General Construction delivers civil engineering, structural construction, commercial facilities, and residential infrastructure with modern architectural standards.",
    links: [
      { label: "Construction Services", url: "/construction" }
    ]
  },
  {
    keywords: ["stationery", "office", "supplies", "printing", "paper"],
    response: "TOTAG Stationery Supplies provides comprehensive B2B office procurement, enterprise printing materials, and educational supplies.",
    links: [
      { label: "Stationery Supplies", url: "/stationery" }
    ]
  },
  {
    keywords: ["merchandise", "tgm", "retail", "wholesale", "goods"],
    response: "TOTAG General Merchandise (TGM) is our wholesale and retail trading subsidiary managing bulk consumer products and FMCG inventory across local and regional markets.",
    links: [
      { label: "General Merchandise", url: "/general-merchandise" }
    ]
  },
  {
    keywords: ["contact", "email", "phone", "address", "location", "office", "where"],
    response: "TOTAG Group of Companies Ltd is headquartered in Monrovia, Liberia with international trade channels to Seattle, USA. You can email corporate inquiries to info@totaggroup.com, IT requests to tis@totaggroup.com, and Catering inquiries to toceps@totaggroup.com.",
    links: [
      { label: "Contact Us", url: "/#contact" }
    ]
  },
  {
    keywords: ["subsidiary", "subsidiaries", "companies", "services", "all"],
    response: "TOTAG Group operates 9 specialized subsidiaries: 1. Cargo Logistics, 2. Farm & Agribusiness, 3. Petroleum, 4. General Construction, 5. General Merchandise, 6. TOCEPS Catering, 7. Managed IT & SaaS, 8. Stationery, and 9. Solar Smart Energy.",
    links: [
      { label: "View All 9 Subsidiaries", url: "/#services" }
    ]
  }
];

function getBotResponse(userText: string): { response: string; links?: { label: string; url: string }[] } {
  const lower = userText.toLowerCase();

  for (const item of TOTAG_KNOWLEDGE) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return { response: item.response, links: item.links };
    }
  }

  return {
    response: `Thank you for asking about "${userText}". TOTAG Group delivers excellence across Cargo Handling, IT & SaaS, TOCEPS Catering, Agribusiness, Solar Power, Petroleum, Construction, General Merchandise, and Stationery. Would you like to connect with a department or explore our service catalog?`,
    links: [
      { label: "Explore Services", url: "/#services" },
      { label: "Contact Us", url: "/#contact" }
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
      text: "Hello! I am the TOTAG Voice Assistant. Tap the microphone to speak or type your question about any of our 9 subsidiaries, trade routes, or corporate services.",
      timestamp: "Just now",
      links: [
        { label: "Explore 9 Subsidiaries", url: "/#services" },
        { label: "Cargo Logistics (Liberia ↔ Seattle)", url: "/cargo" },
        { label: "Contact Corporate", url: "/#contact" }
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
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"))) || voices.find((v) => v.lang.startsWith("en"));
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
          setTranscript("Listening...");
        } catch (e) {
          console.warn("Mic start error:", e);
        }
      } else {
        alert("Speech recognition is not supported in this browser. Please type your message.");
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
    "What services do you offer?",
    "Cargo routes to Seattle",
    "IT Services & SaaS modules",
    "TOCEPS Catering & UNIDO",
    "Solar Power Solutions",
    "How do I contact you?"
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
            className="w-[380px] sm:w-[410px] max-w-[92vw] h-[580px] max-h-[82vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header with TOTAG Logo */}
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
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  </h4>
                  <p className="text-[11px] text-emerald-300/90 font-medium">9 Subsidiaries • Liberia ↔ Seattle</p>
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
                  title={voiceEnabled ? "Voice Output Active" : "Voice Output Muted"}
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
                    {isListening ? (transcript || "Listening... Speak now") : "Speaking response..."}
                  </span>
                </div>

                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="text-[10px] font-bold text-slate-500 hover:text-rose-500 underline"
                  >
                    Stop Speaking
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
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/5 rounded-tl-sm"
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
                  title={isListening ? "Stop Listening" : "Tap to Speak"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>

                <Input
                  type="text"
                  placeholder={isListening ? "Listening to your voice..." : "Type or speak to TOTAG AI..."}
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
            <span>Speak with TOTAG AI</span>
          </motion.div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full p-2.5 shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-slate-900 text-white ring-4 ring-emerald-500/30"
              : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-emerald-500 ring-4 ring-emerald-500/20 hover:ring-emerald-500/40"
          }`}
          title="TOTAG Intelligent Voice Assistant"
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
