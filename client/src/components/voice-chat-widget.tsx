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
  Headphones,
  AlertCircle,
  CheckCircle2,
  Radio,
  Globe
} from "lucide-react";
import { useLocation } from "wouter";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  links?: { label: string; url: string }[];
}

const TOTAG_KNOWLEDGE_STANDARD = [
  {
    keywords: ["hello", "hi", "hey", "who are you", "greeting", "start", "good morning", "good afternoon", "good evening"],
    response: "Hello! Welcome to TOTAG Group of Companies Ltd. I am your corporate voice assistant based in Monrovia, Liberia. We deliver industry-leading enterprise solutions across our nine specialized subsidiaries, connecting West Africa to global markets worldwide. How may I assist you today?",
    links: [
      { label: "Explore All 9 Subsidiaries", url: "/#services" },
      { label: "Contact Corporate Office", url: "/#contact" }
    ]
  },
  {
    keywords: ["cargo", "shipping", "freight", "logistics", "global", "port", "tracking", "container", "vessel", "ship", "customs", "international"],
    response: "TOTAG Cargo Handling & Logistics provides comprehensive maritime freight, international air cargo, and customs clearance bridging Liberia's commercial ports with global trade centers across North America, Europe, Asia, and Africa. We offer real-time shipment tracking and secure bonded warehousing.",
    links: [
      { label: "Cargo Logistics Portal", url: "/cargo" },
      { label: "Track Shipment", url: "/order-tracking" }
    ]
  },
  {
    keywords: ["it", "software", "saas", "fims", "hrmis", "tis", "tech", "cloud", "cyber", "cybersecurity", "app", "custom software"],
    response: "TOTAG IT Services & SaaS delivers enterprise managed IT infrastructure, cybersecurity, and our proprietary 14-module FIMS Financial & HRMIS Enterprise Suite. You can reach our IT department directly at tis@totaggroup.com.",
    links: [
      { label: "IT Services Portal", url: "/it-services" },
      { label: "Enterprise SaaS Modules", url: "/saas" }
    ]
  },
  {
    keywords: ["catering", "toceps", "food", "event", "unido", "buffet", "meal", "wedding", "banquet", "invoice", "hospitality"],
    response: "TOTAG Catering & Event Planning Services (TOCEPS) manages institutional catering, UNIDO contract deliverables, executive banquets, and social event hospitality. For billing, invoices, or event reservations, please email toceps@totaggroup.com.",
    links: [
      { label: "TOCEPS Catering Services", url: "/catering" },
      { label: "Document Vault & Dashboard", url: "/catering/ops/dashboard" }
    ]
  },
  {
    keywords: ["farm", "agriculture", "livestock", "crops", "produce", "food supply", "cassava", "poultry", "palm oil", "agribusiness"],
    response: "TOTAG FARM & Agribusiness leads sustainable agriculture, organic crop production, poultry, and livestock farming in Liberia, strengthening food security and local commercial agro-processing.",
    links: [
      { label: "TOTAG Farm Hub", url: "/farm" }
    ]
  },
  {
    keywords: ["solar", "energy", "power", "deye", "inverter", "electricity", "renewable", "battery", "telemetry", "noc"],
    response: "TOTAG Solar Energy & Smart Power engineers turnkey commercial and residential solar microgrids, Deye hybrid inverter systems, lithium battery storage, and 24/7 telemetry Network Operations Center monitoring.",
    links: [
      { label: "Solar Energy & Deye Systems", url: "/solar" }
    ]
  },
  {
    keywords: ["petroleum", "fuel", "diesel", "gasoline", "depot", "oil", "haulage"],
    response: "TOTAG Petroleum Services operates certified bulk fuel storage facilities, commercial petroleum supply depots, and reliable fuel haulage logistics across Liberia.",
    links: [
      { label: "Petroleum Services", url: "/petroleum" }
    ]
  },
  {
    keywords: ["construction", "building", "civil", "roads", "infrastructure", "engineering"],
    response: "TOTAG General Construction delivers civil engineering, structural construction, road rehabilitation, and modern commercial facilities built to international safety standards.",
    links: [
      { label: "Construction Services", url: "/construction" }
    ]
  },
  {
    keywords: ["stationery", "office", "supplies", "printing", "paper", "procurement"],
    response: "TOTAG Stationery Supplies provides bulk B2B office procurement, enterprise printing materials, and scholastic supplies for corporate and institutional clients.",
    links: [
      { label: "Stationery Supplies", url: "/stationery" }
    ]
  },
  {
    keywords: ["merchandise", "tgm", "retail", "wholesale", "goods", "fmcg"],
    response: "TOTAG General Merchandise (TGM) manages large-scale wholesale and retail distribution of quality consumer goods and commercial merchandise across regional markets.",
    links: [
      { label: "General Merchandise Hub", url: "/general-merchandise" }
    ]
  },
  {
    keywords: ["contact", "email", "phone", "address", "location", "office", "where", "headquarters", "monrovia"],
    response: "TOTAG Group of Companies Ltd is headquartered in Monrovia, Liberia with global enterprise trade networks worldwide. You can contact our corporate desk at info@totaggroup.com, IT services at tis@totaggroup.com, or Catering at toceps@totaggroup.com.",
    links: [
      { label: "Corporate Contact Form", url: "/#contact" }
    ]
  },
  {
    keywords: ["subsidiary", "subsidiaries", "companies", "services", "all", "nine", "9"],
    response: "TOTAG Group encompasses 9 specialized subsidiaries: 1. Cargo Handling & Logistics, 2. Farm & Agribusiness, 3. Petroleum Services, 4. General Construction, 5. General Merchandise, 6. TOCEPS Catering & Event Planning, 7. Managed IT Services & SaaS, 8. Stationery Supplies, and 9. Solar Smart Power.",
    links: [
      { label: "View All 9 Subsidiaries", url: "/#services" }
    ]
  }
];

function getBotResponse(userText: string): { response: string; links?: { label: string; url: string }[] } {
  const lower = userText.toLowerCase();

  for (const item of TOTAG_KNOWLEDGE_STANDARD) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return { response: item.response, links: item.links };
    }
  }

  return {
    response: `Thank you for your inquiry regarding "${userText}". TOTAG Group delivers enterprise solutions across Cargo Handling, IT & SaaS, TOCEPS Catering, Agribusiness, Solar Power, Petroleum, Construction, General Merchandise, and Stationery Supplies. Would you like to connect directly with our corporate team or explore our subsidiary portals?`,
    links: [
      { label: "Explore Our Subsidiaries", url: "/#services" },
      { label: "Contact Us Directly", url: "/#contact" }
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
  const [micStatus, setMicStatus] = useState<string>("Ready");
  const [micError, setMicError] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Welcome to TOTAG Group of Companies Ltd. I am your corporate voice assistant in Monrovia, Liberia. Click the green microphone and speak, type your question, or tap any quick topic below.",
      timestamp: "Just now",
      links: [
        { label: "Explore 9 Subsidiaries", url: "/#services" },
        { label: "Global Cargo Logistics", url: "/cargo" },
        { label: "Contact Corporate Office", url: "/#contact" }
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
  }, [messages, isListening, isSpeaking, liveTranscript]);

  // Text-To-Speech with warm West African vocal tone
  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

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

  // Handle Query Submission
  const handleUserQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
    }

    setIsListening(false);
    setLiveTranscript("");
    setMicStatus("Ready");

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

  // Direct, clean speech recognition
  const startListening = () => {
    stopSpeaking();
    setMicError(null);
    setLiveTranscript("");

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setMicError("Speech recognition is not supported in your browser. Please use Chrome, Edge, or type your question below.");
      setMicStatus("Not Supported");
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

      let capturedPhrase = "";

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
        setMicStatus("Listening... Speak now");
      };

      recognition.onspeechstart = () => {
        setMicStatus("Hearing your voice...");
      };

      recognition.onresult = (event: any) => {
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
          capturedPhrase = spoken;
          setLiveTranscript(spoken);
          setInputText(spoken);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition event:", event.error);
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setMicError("Microphone permission was blocked. Please click the lock icon in your browser address bar and allow Microphone access for totag.network.");
          setIsListening(false);
          setMicStatus("Permission Blocked");
        } else if (event.error === "no-speech") {
          setMicStatus("No speech detected. Tap mic to try again.");
          setIsListening(false);
        } else if (event.error === "audio-capture") {
          setMicError("Microphone not detected or in use by another app. Please check your mic connection.");
          setIsListening(false);
          setMicStatus("Audio Device Busy");
        } else if (event.error !== "aborted") {
          setMicError(`Voice notice: ${event.error}. You can also type your message below.`);
          setIsListening(false);
          setMicStatus("Ready");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setMicStatus("Ready");
        if (capturedPhrase.trim().length > 1) {
          handleUserQuery(capturedPhrase.trim());
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("SpeechRecognition start exception:", err);
      setIsListening(false);
      setMicStatus("Ready");
      setMicError("Could not start microphone. Please check your browser permissions or type your question below.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    setIsListening(false);
    setMicStatus("Ready");

    if (liveTranscript.trim().length > 1) {
      handleUserQuery(liveTranscript.trim());
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserQuery(inputText.trim());
    }
  };

  const quickPrompts = [
    "Tell me about the 9 Subsidiaries",
    "Global Cargo & Freight routes",
    "IT Services & SaaS modules",
    "TOCEPS Catering & UNIDO contracts",
    "Solar Power & Deye inverters",
    "Contact Corporate Office"
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
            className="w-[380px] sm:w-[415px] max-w-[92vw] h-[610px] max-h-[85vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header with Official TOTAG Logo */}
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
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-medium">
                      Liberia HQ
                    </span>
                  </h4>
                  <p className="text-[11px] text-emerald-300/90 font-medium">Monrovia, Liberia ⟷ Global Reach</p>
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
                  title={voiceEnabled ? "Spoken Voice Active" : "Spoken Voice Muted"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    stopSpeaking();
                    stopListening();
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Notification Banner */}
            {micError && (
              <div className="bg-rose-500/10 border-b border-rose-500/30 px-3 py-2 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{micError}</p>
                </div>
                <button onClick={() => setMicError(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* LIVE SOUNDWAVE & LISTENING STATUS */}
            {isListening && (
              <div className="bg-emerald-500/15 dark:bg-emerald-950/60 border-b border-emerald-500/30 px-4 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-4 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-6 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-3 bg-emerald-300 rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="w-1.5 h-5 bg-emerald-500 rounded-full animate-bounce [animation-delay:450ms]" />
                  </div>

                  <div className="truncate">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      🔴 {micStatus}
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-200 truncate italic">
                      "{liveTranscript || "Listening... Speak your question now"}"
                    </p>
                  </div>
                </div>

                <Button
                  onClick={stopListening}
                  size="sm"
                  className="px-2.5 py-1 h-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shrink-0 ml-2"
                >
                  Done / Send ➔
                </Button>
              </div>
            )}

            {/* Speaking State Visualizer */}
            {isSpeaking && (
              <div className="bg-sky-500/10 dark:bg-sky-950/40 border-b border-sky-500/20 px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1 h-5 bg-sky-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1 h-2 bg-sky-300 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="font-bold text-sky-600 dark:text-sky-400">Responding with Liberian accent...</span>
                </div>

                <button
                  onClick={stopSpeaking}
                  className="text-[10px] font-bold text-slate-500 hover:text-rose-500 underline"
                >
                  Stop Voice
                </button>
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
                        ? "bg-sky-600 text-white rounded-tr-sm shadow-md font-medium"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/5 rounded-tl-sm font-normal"
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
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Tap to Inquire in 1-Click:
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUserQuery(prompt)}
                    className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>{prompt}</span>
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
                  className={`w-11 h-11 rounded-2xl shrink-0 p-0 transition-all ${
                    isListening
                      ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-600/40 ring-4 ring-rose-500/20"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/20"
                  }`}
                  title={isListening ? "Click to Send / Stop" : "Click to Speak"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>

                <Input
                  type="text"
                  placeholder={isListening ? "Listening to your voice..." : "Click mic to speak or type..."}
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
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
            } else {
              stopSpeaking();
              stopListening();
              setIsOpen(false);
            }
          }}
          className={`relative w-14 h-14 rounded-full p-2.5 shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-slate-900 text-white ring-4 ring-emerald-500/30"
              : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-emerald-500 ring-4 ring-emerald-500/20 hover:ring-emerald-500/40"
          }`}
          title="TOTAG Corporate Voice Assistant"
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
