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
  CheckCircle2
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
  const [micError, setMicError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello my people! Da TOTAG Voice Assistant right here in Monrovia, Liberia. Tap the green microphone button and speak freely, or type your question!",
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isListening, isSpeaking, transcript]);

  // Text-To-Speech
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

  // Cleanup Web Audio & MediaStream
  const stopAudioCapture = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // Start Real-time Microphone Audio Level Monitor
  const startAudioMonitor = async (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (e) {
      console.warn("Audio visualizer error:", e);
    }
  };

  // Handle Speech Query Submission
  const handleUserQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    // Reset listening state
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    stopAudioCapture();
    setIsListening(false);
    setTranscript("");

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

  // Start Voice Listening with getUserMedia prompt & continuous Web Speech
  const startListening = async () => {
    stopSpeaking();
    setMicError(null);
    setTranscript("");

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    try {
      // 1. Explicitly request microphone stream to trigger browser prompt and ensure mic is active
      let stream: MediaStream | null = null;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        mediaStreamRef.current = stream;
        startAudioMonitor(stream);
      }

      // 2. Instantiate and configure SpeechRecognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      let accumulatedText = "";

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentSaid = (finalTranscript || interimTranscript).trim();
        if (currentSaid) {
          accumulatedText = currentSaid;
          setTranscript(accumulatedText);
          setInputText(accumulatedText);

          // Reset silence timer on every spoken word (submits after 2 seconds of silence)
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            if (accumulatedText.trim().length > 1) {
              handleUserQuery(accumulatedText.trim());
            }
          }, 2200);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setMicError("Microphone access denied. Please click the lock icon in your browser address bar and allow Microphone access.");
        } else if (event.error === "no-speech") {
          // Keep listening or allow user to speak
        } else if (event.error !== "aborted") {
          setMicError(`Voice error: ${event.error}. You can still type below.`);
        }
      };

      recognition.onend = () => {
        // If still flagged as listening without error, don't abort abruptly
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Mic access error:", err);
      stopAudioCapture();
      setIsListening(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicError("Microphone permission was blocked. Please enable microphone permissions in your browser settings to speak.");
      } else {
        setMicError("Could not access microphone. Please check your microphone connection or type below.");
      }
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    stopAudioCapture();
    setIsListening(false);

    // If there is transcript captured, submit it
    if (transcript.trim().length > 1) {
      handleUserQuery(transcript.trim());
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
            className="w-[380px] sm:w-[410px] max-w-[92vw] h-[610px] max-h-[85vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden mb-4"
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
                  {/* Real-time Voice Audio Visualizer */}
                  <div className="flex items-end gap-1 h-5">
                    <span 
                      className="w-1 bg-emerald-500 rounded-full transition-all duration-75" 
                      style={{ height: `${Math.max(4, audioLevel * 0.2)}px` }} 
                    />
                    <span 
                      className="w-1 bg-emerald-400 rounded-full transition-all duration-75" 
                      style={{ height: `${Math.max(6, audioLevel * 0.35)}px` }} 
                    />
                    <span 
                      className="w-1 bg-emerald-300 rounded-full transition-all duration-75" 
                      style={{ height: `${Math.max(4, audioLevel * 0.25)}px` }} 
                    />
                    <span 
                      className="w-1 bg-emerald-500 rounded-full transition-all duration-75" 
                      style={{ height: `${Math.max(8, audioLevel * 0.45)}px` }} 
                    />
                    <span 
                      className="w-1 bg-emerald-400 rounded-full transition-all duration-75" 
                      style={{ height: `${Math.max(4, audioLevel * 0.2)}px` }} 
                    />
                  </div>

                  <div className="truncate">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      🔴 Hearing You:
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-200 truncate italic">
                      "{transcript || "Talk freely, I am listening..."}"
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
                  <span className="font-bold text-sky-600 dark:text-sky-400">Speaking Kolokwa response...</span>
                </div>

                <button
                  onClick={stopSpeaking}
                  className="text-[10px] font-bold text-slate-500 hover:text-rose-500 underline"
                >
                  Stop Talking
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
                        ? "bg-sky-600 text-white rounded-tr-sm shadow-md"
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
                  className={`w-11 h-11 rounded-2xl shrink-0 p-0 transition-all ${
                    isListening
                      ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-600/40 ring-4 ring-rose-500/20"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/20"
                  }`}
                  title={isListening ? "Stop / Done Speaking" : "Click to Speak Liberian Kolokwa"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>

                <Input
                  type="text"
                  placeholder={isListening ? "Listening to your voice now..." : "Speak or type your question..."}
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
            <span>🇱🇷 Talk with TOTAG AI</span>
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
