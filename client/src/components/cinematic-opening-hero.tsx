import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ChevronLeft,
  ChevronRight,
  Sun,
  Truck,
  Sprout,
  Fuel,
  Hammer,
  ShoppingBag,
  UtensilsCrossed,
  Cpu,
  FileText,
  MapPin
} from "lucide-react";
import { Link } from "wouter";

// 9 Subsidiaries Carousel Data with User Uploaded Real Operational Assets
const HERO_SLIDES = [
  {
    id: "solar-rooftop",
    title: "TOTAG Solar Energy & Rooftop Microgrids",
    subtitle: "Turnkey Commercial & Residential Solar Installations, Tier-1 Deye Inverters & High-Efficiency PV Arrays.",
    href: "/solar",
    icon: Sun,
    gradient: "from-amber-500/40 via-orange-600/20 to-slate-950",
    badge: "Renewable Energy Installation",
    image: "/images/hero/solar-rooftop-team.jpg"
  },
  {
    id: "farm-rice",
    title: "TOTAG FARM Rice Production",
    subtitle: "Sustainable Commercial Rice Agriculture & Grain Processing Empowering Liberian Farmers.",
    href: "/farm",
    icon: Sprout,
    gradient: "from-emerald-600/40 via-teal-900 to-slate-950",
    badge: "Liberia Agribusiness Leader",
    image: "/images/hero/farm-rice-harvest.jpg"
  },
  {
    id: "farm-cocoa",
    title: "TOTAG Cocoa & Tree Crops Division",
    subtitle: "High-Yield Export Cocoa Cultivation, Agro-Forestry & Organic Farming in Liberia.",
    href: "/farm",
    icon: Sprout,
    gradient: "from-amber-700/40 via-stone-900 to-slate-950",
    badge: "Export Agribusiness",
    image: "/images/hero/farm-cocoa-harvest.jpg"
  },
  {
    id: "farm-precision",
    title: "TOTAG Precision Agritech & Monitoring",
    subtitle: "Digital Crop Mapping, Soil Analytics & Tech-Driven Agriculture Management in West Africa.",
    href: "/farm",
    icon: Sprout,
    gradient: "from-cyan-600/40 via-blue-950 to-slate-950",
    badge: "Smart Agritech Solutions",
    image: "/images/hero/farm-surveyor-field.jpg"
  },
  {
    id: "solar-battery",
    title: "TOTAG Energy Storage & Battery Systems",
    subtitle: "Rackmounted Pylontech US5000 48V LiFePO4 Battery Banks for Continuous 24/7 Clean Power.",
    href: "/solar",
    icon: Sun,
    gradient: "from-sky-600/40 via-slate-900 to-slate-950",
    badge: "LiFePO4 Storage Systems",
    image: "/images/pv/pylontech-us5000-battery.png"
  },
  {
    id: "cargo",
    title: "TOTAG Cargo Handling & Logistics",
    subtitle: "Heavy Port Terminal Operations, Freight Forwarding, Customs Clearance & Multimodal Transport.",
    href: "/cargo",
    icon: Truck,
    gradient: "from-blue-600/30 via-slate-900 to-slate-950",
    badge: "Pan-African Port Operations",
    image: "/images/hero/solar-rooftop-team.jpg"
  },
  {
    id: "petroleum",
    title: "TOTAG Petroleum Services",
    subtitle: "Bulk Fuel Transport, Commercial Bunkering, Lubricants Distribution & Industrial Fleet Supply.",
    href: "/petroleum",
    icon: Fuel,
    gradient: "from-rose-600/30 via-amber-900 to-slate-950",
    badge: "Downstream Energy Logistics",
    image: "/images/hero/solar-rooftop-team.jpg"
  },
  {
    id: "construction",
    title: "TOTAG General Construction",
    subtitle: "Civil Infrastructure, Road Works, Commercial Complexes & Structural Engineering.",
    href: "/construction",
    icon: Hammer,
    gradient: "from-amber-600/30 via-stone-900 to-slate-950",
    badge: "Civil Engineering Excellence",
    image: "/images/hero/solar-rooftop-team.jpg"
  },
  {
    id: "it-services",
    title: "TOTAG IT Services & SaaS",
    subtitle: "Custom Enterprise Software, Government HRMIS/FIMS SaaS Solutions & Cybersecurity Infrastructure.",
    href: "/it-services",
    icon: Cpu,
    gradient: "from-cyan-600/30 via-blue-950 to-slate-950",
    badge: "Digital Transformation & Cloud",
    image: "/images/hero/solar-rooftop-team.jpg"
  }
];

export default function CinematicOpeningHero() {
  const [isPlayingIntro, setIsPlayingIntro] = useState<boolean>(true);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-play Hero Carousel after intro completes
  useEffect(() => {
    if (isPlayingIntro || isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPlayingIntro, isPaused]);

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section className="relative w-full bg-slate-950 text-white overflow-hidden min-h-[720px] flex flex-col justify-between select-none">

      {/* DEYE-STYLE HORIZON LIGHT ATMOSPHERE & RAYS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* Deep Space / Dark Ambient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />

        {/* Dynamic Horizon Light Flare emanating from West Africa / Liberia */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-amber-500/20 via-emerald-500/25 to-sky-500/20 rounded-full blur-[120px] animate-pulse" />

        {/* Horizon Light Rays Sweep */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] opacity-30">
          <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,#f59e0b_15deg,transparent_30deg,#10b981_45deg,transparent_60deg,#06b6d4_75deg,transparent_90deg)] animate-[spin_60s_linear_infinite]" />
        </div>

        {/* Ambient Grid Mesh */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: "32px 32px"
          }}
        />

      </div>

      {/* TOP BAR / CONTROL OVERLAY */}
      <div className="relative z-20 container mx-auto px-4 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900/90 text-amber-400 border border-amber-500/40 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            Liberia • West Africa Operation Center
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isPlayingIntro ? (
            <Button
              onClick={() => setIsPlayingIntro(false)}
              size="sm"
              variant="outline"
              className="bg-slate-900/90 border-slate-700 text-slate-200 hover:text-white hover:border-amber-500 text-xs font-bold rounded-xl backdrop-blur-md shadow-xl"
            >
              Skip Intro to Carousel →
            </Button>
          ) : (
            <Button
              onClick={() => setIsPlayingIntro(true)}
              size="sm"
              variant="outline"
              className="bg-slate-900/90 border-slate-700 text-amber-400 hover:text-amber-300 text-xs font-bold rounded-xl backdrop-blur-md shadow-xl"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Replay Liberia Horizon Opening
            </Button>
          )}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 container mx-auto px-4 py-8 flex-1 flex flex-col justify-center max-w-6xl">

        {/* DEYE-INSPIRED OPENING SEQUENCE: AFRICA MAP + LIBERIA BEACON + HORIZON TEXT REVEAL */}
        {isPlayingIntro ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
            
            {/* LEFT COLUMN: TEXT REVEAL COMING THROUGH THE HORIZON LIGHT */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Brightening Liberia & Diverse Enterprise Sectors
              </div>

              {/* Exact Headline Requested */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Welcome to <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent drop-shadow-2xl">TOTAG Group</span>
              </h1>

              {/* Exact Subheadline Text Requested */}
              <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed bg-slate-900/60 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
                Delivering excellence across diverse industries through our specialized subsidiaries. From cargo handling, agribusiness, and petroleum services to construction, IT solutions, stationery supplies, and renewable energy, we provide comprehensive business solutions with unwavering commitment to quality.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  onClick={() => setIsPlayingIntro(false)}
                  size="lg"
                  className="px-8 py-6 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-2xl hover:scale-105 transition-all"
                >
                  <span>Explore Operational Subsidiaries</span>
                  <ArrowRight className="ml-2.5 w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: HIGH-PRECISION ILLUMINATED VECTOR SVG MAP OF AFRICA WITH LIBERIA HIGHLIGHT */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5 relative flex items-center justify-center"
            >
              
              {/* Radial Glowing Light Aura behind Africa */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-emerald-500/30 to-cyan-500/20 rounded-full blur-3xl" />

              {/* VECTOR SVG MAP OF AFRICA */}
              <div className="relative w-full max-w-[420px] aspect-square p-4 glass-card rounded-3xl border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl flex items-center justify-center">
                
                <svg 
                  viewBox="0 0 800 800" 
                  className="w-full h-full drop-shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Africa Continental Vector Path */}
                  <path 
                    d="M380,120 C420,120 480,130 520,160 C560,190 620,240 640,300 C660,360 630,420 590,470 C550,520 500,580 460,640 C440,670 410,720 380,740 C360,720 340,660 320,620 C300,580 270,540 250,500 C230,460 200,420 180,380 C160,340 140,300 160,270 C180,240 240,220 280,220 C310,220 340,180 350,150 Z" 
                    fill="url(#africaGrad)" 
                    stroke="#38bdf8" 
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />

                  {/* SVG Gradients */}
                  <defs>
                    <radialGradient id="africaGrad" cx="300" cy="420" r="400" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                      <stop offset="30%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="70%" stopColor="#0f172a" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
                    </radialGradient>

                    <radialGradient id="liberiaLightBurst" cx="260" cy="420" r="300" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                      <stop offset="40%" stopColor="#10b981" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Latitude / Longitude Network Lines */}
                  <line x1="150" y1="420" x2="650" y2="420" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1.5" />
                  <line x1="260" y1="150" x2="260" y2="700" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1.5" />

                  {/* Horizon Light Rays emanated from Liberia Coordinates (x: 260, y: 420) */}
                  <circle cx="260" cy="420" r="280" fill="url(#liberiaLightBurst)" />

                  {/* Expanding Pulse Rings over Liberia */}
                  <circle cx="260" cy="420" r="40" stroke="#f59e0b" strokeWidth="2" opacity="0.6">
                    <animate attributeName="r" values="10;80" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="3s" repeatCount="indefinite" />
                  </circle>
                  
                  <circle cx="260" cy="420" r="25" stroke="#10b981" strokeWidth="2.5" opacity="0.8">
                    <animate attributeName="r" values="5;50" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* Glowing Liberia Core Pin */}
                  <circle cx="260" cy="420" r="12" fill="#10b981" />
                  <circle cx="260" cy="420" r="6" fill="#ffffff" />

                  {/* Luminous Callout Pin for Liberia */}
                  <g transform="translate(280, 395)">
                    <rect x="0" y="0" width="210" height="42" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                    <text x="14" y="26" fill="#f59e0b" fontSize="15" fontWeight="900" fontFamily="Inter, sans-serif">
                      📍 LIBERIA (TOTAG HQ)
                    </text>
                  </g>
                </svg>

                {/* Sub-badge below map */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider whitespace-nowrap shadow-xl">
                  Global Reach • Pan-African Operational Base
                </div>

              </div>

            </motion.div>

          </div>
        ) : (
          /* HERO CAROUSEL ENGINE loaded with REAL USER UPLOADED PHOTOS */
          <div className="my-auto animate-fadeIn">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="glass-card border-white/20 p-6 sm:p-10 rounded-3xl backdrop-blur-2xl relative overflow-hidden text-left shadow-2xl min-h-[460px] flex flex-col justify-end"
              >
                {/* Real Operational Photo Background */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={currentSlide.image} 
                    alt={currentSlide.title} 
                    className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${currentSlide.gradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
                </div>

                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur-md shadow-lg">
                      <currentSlide.icon className="w-4 h-4 text-amber-400" />
                      {currentSlide.badge}
                    </span>
                    <span className="text-xs text-slate-300 font-mono font-bold bg-slate-950/60 px-2.5 py-1 rounded-lg border border-white/10">
                      Slide {activeSlide + 1} of {HERO_SLIDES.length}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                    {currentSlide.title}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium max-w-2xl drop-shadow-md">
                    {currentSlide.subtitle}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link href={currentSlide.href}>
                      <Button
                        size="lg"
                        className="px-8 py-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-2xl hover:scale-105 transition-all"
                      >
                        <span>Access Subsidiary Portal</span>
                        <ArrowRight className="ml-2.5 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>
        )}

      </div>

      {/* BOTTOM CAROUSEL THUMBNAIL NAVIGATION BAR */}
      <div className="relative z-20 container mx-auto px-4 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
          
          {/* Quick Jump Buttons for User Uploaded Images */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {HERO_SLIDES.map((slide, idx) => {
              const IconComp = slide.icon;
              return (
                <button
                  key={slide.id}
                  onClick={() => {
                    setIsPlayingIntro(false);
                    setActiveSlide(idx);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    !isPlayingIntro && activeSlide === idx
                      ? "bg-amber-500 text-slate-950 font-black shadow-xl scale-105"
                      : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{slide.title.split(" ")[1] || slide.title}</span>
                </button>
              );
            })}
          </div>

          {/* Pause / Play Controls */}
          {!isPlayingIntro && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-lg"
              >
                {isPaused ? "▶ Auto-Play" : "⏸ Pause"}
              </button>

              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>

    </section>
  );
}
