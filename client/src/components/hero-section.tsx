import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  ArrowRight, 
  Phone, 
  ShieldCheck, 
  Globe, 
  Building2, 
  Award,
  Play,
  Sparkles,
  MapPin,
  X,
  Volume2,
  VolumeX,
  RotateCcw
} from "lucide-react";

const estYear = 2019;
const currentYear = new Date().getFullYear();
const yearsOfExperience = `${Math.max(1, currentYear - estYear)}+ Yrs`;

const stats = [
  { label: "Specialized Subsidiaries", value: "9", icon: Building2, color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Enterprise Experience", value: yearsOfExperience, icon: Award, color: "text-sky-600 dark:text-sky-400" },
  { label: "Operational Reliability", value: "99.9%", icon: ShieldCheck, color: "text-amber-600 dark:text-amber-400" },
  { label: "Global Reach & Ports", value: "Liberia ↔ USA", icon: Globe, color: "text-purple-600 dark:text-purple-400" },
];

const narrativeFrames = [
  {
    title: "The Beacon of West Africa",
    subtitle: "From Monrovia, Liberia to the Global Stage",
    desc: "TOTAG GROUP OF COMPANIES LTD emerges as a radiant light of enterprise, technology, and economic transformation.",
    highlight: "HQ: Monrovia, Liberia",
  },
  {
    title: "Global Trade & Technological Bridge",
    subtitle: "Connecting West Africa with Seattle & Global Hubs",
    desc: "Uniting Maritime Cargo, Clean Solar Energy, Managed IT & SaaS, Commercial Agriculture, Petroleum, and Institutional Catering.",
    highlight: "Trade Route: Liberia ↔ Seattle, USA",
  },
  {
    title: "Empowering Africa's Tomorrow",
    subtitle: "Nine Unified Subsidiaries. One Vision of Excellence.",
    desc: "Delivering sustainable infrastructure, reliable supply chains, and transformative business platforms.",
    highlight: "9 Industry Divisions",
  }
];

export default function HeroSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-slate-950">
      
      {/* 3D Master Concept 1 Background with Ken Burns slow motion effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 0.5, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/totag-globe-illumination.jpg')",
            filter: "brightness(0.65) contrast(1.15)",
          }}
        />

        {/* Ambient Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/50 to-slate-950/90" />

        {/* Luminous Glow Particles */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Beacon Location Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-300 tracking-wide">
              Global Enterprise Gateway • Liberia (HQ) ⟷ Seattle, USA
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-lg"
          >
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">TOTAG</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Group</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow"
          >
            Emerging as a beacon of enterprise and technological illumination from Liberia across West Africa to Seattle, USA. Powering 9 specialized subsidiaries across Cargo Logistics, Petroleum, Solar Energy, Agribusiness, IT & SaaS, Construction, and Institutional Services.
          </motion.p>
          
          {/* Action CTAs & Watch Brand Film Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3.5 justify-center items-center mb-16"
          >
            <Button
              onClick={() => handleNavClick("#services")}
              size="lg"
              className="w-full sm:w-auto px-7 py-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-900/30 hover:scale-[1.02] transition-all"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Watch Brand Film / Origin Story Button */}
            <Button
              onClick={() => setIsVideoModalOpen(true)}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-7 py-6 bg-slate-900/80 border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-600/30 font-bold text-sm rounded-2xl backdrop-blur-md shadow-xl hover:scale-[1.02] transition-all group"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                <Play className="h-3 w-3 text-emerald-400 fill-emerald-400 ml-0.5" />
              </div>
              <span>Watch Brand Film</span>
            </Button>
            
            <Button
              onClick={() => handleNavClick("#contact")}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-7 py-6 bg-white/5 border-white/20 text-slate-200 hover:text-white hover:bg-white/10 font-bold text-sm rounded-2xl backdrop-blur-md transition-all"
            >
              <span>Get in Touch</span>
              <Phone className="ml-2 h-4 w-4 text-sky-400" />
            </Button>
          </motion.div>

          {/* Glass Metrics Stat Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-5xl mx-auto"
          >
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="p-4 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 text-center flex flex-col items-center justify-center hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-300 shadow-xl"
              >
                <stat.icon className={`w-5 h-5 mb-1.5 ${stat.color}`} />
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* BRAND FILM CINEMATIC MODAL */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] bg-slate-950 text-white border border-emerald-500/30 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <DialogTitle className="sr-only">TOTAG Group Brand Film - The Beacon of Enterprise</DialogTitle>
          <DialogDescription className="sr-only">Cinematic story of TOTAG Group illuminating Liberia and connecting with Seattle</DialogDescription>
          
          <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
            {/* Cinematic Background Render */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/totag-globe-illumination.jpg')",
              }}
            />

            {/* Dark Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/40 to-slate-950/80" />

            {/* Interactive Narrative Overlay */}
            <div className="relative z-10 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFrame}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-3"
                >
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {narrativeFrames[activeFrame].highlight}
                  </span>
                  
                  <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    {narrativeFrames[activeFrame].title}
                  </h3>
                  
                  <p className="text-emerald-300 font-semibold text-xs sm:text-sm">
                    {narrativeFrames[activeFrame].subtitle}
                  </p>
                  
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                    {narrativeFrames[activeFrame].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Video Player Timeline Controls */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-slate-950 to-transparent flex items-center justify-between gap-4 z-20">
              <div className="flex items-center gap-2">
                {narrativeFrames.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFrame(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeFrame === idx ? "w-8 bg-emerald-400" : "w-2.5 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveFrame((prev) => (prev + 1) % narrativeFrames.length)}
                  className="text-xs font-bold bg-slate-900/80 border-white/20 text-white hover:bg-emerald-600 rounded-xl"
                >
                  Next Chapter →
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-white rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

