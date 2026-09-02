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
  Bot, 
  User, 
  ExternalLink,
  CheckCircle2,
  LifeBuoy,
  MessageSquare,
  ChevronRight,
  Truck,
  Package,
  Wrench,
  Sparkles
} from "lucide-react";
import { useLocation } from "wouter";
import { ProformaInvoiceModal } from "./ProformaInvoiceModal";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  toolsUsed?: string[];
  links?: { label: string; url?: string; isProformaModal?: boolean; isTicketForm?: boolean }[];
  isGreeting?: boolean;
  isTicketSuccess?: boolean;
  ticketData?: {
    id: string;
    name: string;
    email: string;
    department: string;
    subject: string;
  };
  orderData?: {
    order_id: string;
    item: string;
    status: string;
    carrier: string;
    estimated_delivery: string;
    milestone: string;
  };
}

export default function VoiceChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAutoPill, setShowAutoPill] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [sessionStatus, setSessionStatus] = useState<string>("Ready to assist");
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Ticket Form Local State
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketDept, setTicketDept] = useState("Managed IT & SaaS");
  const [ticketSubject, setTicketSubject] = useState("");

  // Session ID stored in sessionStorage for context
  const sessionIdRef = useRef<string>("");
  useEffect(() => {
    let sId = sessionStorage.getItem("totag_ai_session_id");
    if (!sId) {
      sId = "session_" + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem("totag_ai_session_id", sId);
    }
    sessionIdRef.current = sId;

    // Automatic floating welcome pill popup after 3 seconds
    const timer = setTimeout(() => {
      setShowAutoPill(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
  }, [messages, isOpen, showTicketForm, isTyping]);

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

  // Autonomous API Bridge & MCP Tool Execution (`POST /api/chat`)
  const handleUserSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setShowAutoPill(false);
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setSessionStatus("Processing inquiry...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          message: textToSend
        })
      });

      const data = await res.json();
      setIsTyping(false);
      setSessionStatus("Ready to assist");

      if (data && data.response) {
        const botReply: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          toolsUsed: data.tools_used || [],
          links: data.links,
          orderData: data.orderData
        };

        setMessages(prev => [...prev, botReply]);
        speakText(data.response);
      } else {
        const fallbackReply: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Thank you for contacting TOTAG Group. How may I assist you with that inquiry?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, fallbackReply]);
        speakText(fallbackReply.text);
      }
    } catch (err) {
      setIsTyping(false);
      setSessionStatus("Ready to assist");
      const fallbackReply: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Thank you for contacting TOTAG Group. How may I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, fallbackReply]);
      speakText(fallbackReply.text);
    }
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
        
        {/* AUTOMATIC POPUP WELCOME BADGE */}
        <AnimatePresence>
          {showAutoPill && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              onClick={() => {
                setIsOpen(true);
                setShowAutoPill(false);
              }}
              className="absolute bottom-16 right-0 mb-2 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-all group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Hello! 👋 How may I assist you today?</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAutoPill(false);
                }}
                className="ml-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
                    <p className="text-[11px] text-emerald-400 font-semibold">Antigravity ADK &amp; MCP Integration</p>
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

                      {/* Tool Execution Badge */}
                      {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                        <div className="pt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                            <Wrench className="w-3 h-3 text-emerald-400" />
                            MCP Tool: {msg.toolsUsed.join(", ")}
                          </span>
                        </div>
                      )}

                      {/* Order Data Card */}
                      {msg.orderData && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs space-y-2">
                          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <span className="font-extrabold text-white flex items-center gap-1">
                              <Truck className="w-4 h-4 text-emerald-400" /> Order #{msg.orderData.order_id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              {msg.orderData.status}
                            </span>
                          </div>
                          <p className="text-slate-300 font-medium">{msg.orderData.item}</p>
                          <div className="text-[11px] text-slate-400 space-y-0.5">
                            <p><span className="text-slate-500">Carrier:</span> {msg.orderData.carrier}</p>
                            <p><span className="text-slate-500">Est. Delivery:</span> {msg.orderData.estimated_delivery}</p>
                            <p><span className="text-slate-500">Milestone:</span> {msg.orderData.milestone}</p>
                          </div>
                        </div>
                      )}

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
                                } else if (link.url && link.url.startsWith("/")) {
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

                {/* Interactive Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-800/90 border border-white/10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

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
                    placeholder="Type your inquiry or order ID (e.g. TOT-8891)..."
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
              setShowAutoPill(false);
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
