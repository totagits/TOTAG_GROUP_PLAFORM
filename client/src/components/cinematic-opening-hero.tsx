import { useState, useEffect, useRef } from "react";
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
  FileText
} from "lucide-react";
import { Link } from "wouter";

// 9 Subsidiaries Carousel Data (Ready for upcoming user uploaded images)
const HERO_SLIDES = [
  {
    id: "solar",
    title: "TOTAG Solar Energy & Smart Power",
    subtitle: "Tier-1 Deye Hybrid Inverters, Jinko 550W PV Modules & LiFePO4 Battery Banks for Resilient Microgrids.",
    href: "/solar",
    icon: Sun,
    gradient: "from-amber-500/30 via-orange-600/20 to-slate-950",
    badge: "Renewable Energy Leader",
    image: "/images/pv/jinko-solar-field-arrays.png"
  },
  {
    id: "cargo",
    title: "TOTAG Cargo Handling & Logistics",
    subtitle: "Heavy Port Terminal Operations, Freight Forwarding, Customs Clearance & Multimodal Transport.",
    href: "/cargo",
    icon: Truck,
    gradient: "from-blue-600/30 via-slate-900 to-slate-950",
    badge: "Pan-African Port Operations",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&h=800&fit=crop"
  },
  {
    id: "farm",
    title: "TOTAG FARM & Agribusiness",
    subtitle: "Sustainable Commercial Agriculture, Cold-Chain Logistics, Organic Produce & Agro-Processing.",
    href: "/farm",
    icon: Sprout,
    gradient: "from-emerald-600/30 via-teal-900 to-slate-950",
    badge: "Food Security & Agribusiness",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&h=800&fit=crop"
  },
  {
    id: "petroleum",
    title: "TOTAG Petroleum Services",
    subtitle: "Bulk Fuel Transport, Commercial Bunkering, Lubricants Distribution & Industrial Fleet Supply.",
    href: "/petroleum",
    icon: Fuel,
    gradient: "from-rose-600/30 via-amber-900 to-slate-950",
    badge: "Downstream Energy Logistics",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&h=800&fit=crop"
  },
  {
    id: "construction",
    title: "TOTAG General Construction",
    subtitle: "Civil Infrastructure, Road Works, Commercial Complexes & Structural Engineering.",
    href: "/construction",
    icon: Hammer,
    gradient: "from-amber-600/30 via-stone-900 to-slate-950",
    badge: "Civil Engineering Excellence",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=1600&h=800&fit=crop"
  },
  {
    id: "general-merchandise",
    title: "TOTAG General Merchandise",
    subtitle: "Wholesale Enterprise Supply Chain, Heavy Equipment Procurement & Industrial Materials.",
    href: "/general-merchandise",
    icon: ShoppingBag,
    gradient: "from-indigo-600/30 via-slate-900 to-slate-950",
    badge: "Global Enterprise Trading",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&h=800&fit=crop"
  },
  {
    id: "catering",
    title: "TOCEPS Catering & Events Planning",
    subtitle: "Corporate Catering, Diplomatic Banquets, Large-Scale Industrial Camp Dining & Event Management.",
    href: "/catering",
    icon: UtensilsCrossed,
    gradient: "from-orange-600/30 via-rose-950 to-slate-950",
    badge: "Enterprise Hospitality",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&h=800&fit=crop"
  },
  {
    id: "it-services",
    title: "TOTAG IT Services & SaaS",
    subtitle: "Custom Enterprise Software, Government HRMIS/FIMS SaaS Solutions & Cybersecurity Infrastructure.",
    href: "/it-services",
    icon: Cpu,
    gradient: "from-cyan-600/30 via-blue-950 to-slate-950",
    badge: "Digital Transformation & Cloud",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=800&fit=crop"
  },
  {
    id: "stationery",
    title: "TOTAG Stationery Supplies",
    subtitle: "Bulk Educational Supplies, Corporate Office Paper Products & Institutional Printing.",
    href: "/stationery",
    icon: FileText,
    gradient: "from-purple-600/30 via-slate-900 to-slate-950",
    badge: "Institutional Supply Leader",
    image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=1600&h=800&fit=crop"
  }
];

export default function CinematicOpeningHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlayingIntro, setIsPlayingIntro] = useState<boolean>(true);
  const [introPhase, setIntroPhase] = useState<"map" | "burst" | "text" | "complete">("map");
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-play Hero Carousel after intro completes
  useEffect(() => {
    if (isPlayingIntro || isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlayingIntro, isPaused]);

  // Timeline driver for the Opening Video Animation
  useEffect(() => {
    if (!isPlayingIntro) return;

    setIntroPhase("map");
    const t1 = setTimeout(() => setIntroPhase("burst"), 2200);
    const t2 = setTimeout(() => setIntroPhase("text"), 4500);
    const t3 = setTimeout(() => {
      setIntroPhase("complete");
    }, 12000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isPlayingIntro]);

  // HTML5 Canvas Rendering for Illuminated Africa Vector Map & Horizon Sunburst
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 650;
    };
    window.addEventListener("resize", handleResize);

    // Simplified Africa Continent Coordinates relative to canvas center
    const africaPath = [
      [0.05, -0.35], [0.18, -0.32], [0.28, -0.22], [0.38, -0.05], [0.42, 0.12], 
      [0.32, 0.28], [0.22, 0.42], [0.12, 0.52], [-0.02, 0.48], [-0.12, 0.35], 
      [-0.18, 0.18], [-0.32, 0.05], [-0.35, -0.08], [-0.28, -0.22], [-0.15, -0.32], [0.05, -0.35]
    ];

    // Liberia exact relative position on West Africa coast
    const liberiaPos = [-0.26, 0.04];

    let pulseAngle = 0;
    let rayAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.45;
      const scale = Math.min(width, height) * 0.75;

      // 1. Draw Space Grid Stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      for (let i = 0; i < 40; i++) {
        const sx = (Math.sin(i * 99 + rayAngle * 0.01) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 33 + rayAngle * 0.01) * 0.5 + 0.5) * height;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.sin(i + rayAngle * 0.05) > 0 ? 1.5 : 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Illuminated Africa Map Contour
      ctx.beginPath();
      africaPath.forEach(([rx, ry], idx) => {
        const x = centerX + rx * scale;
        const y = centerY + ry * scale;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      // Ambient Map Fill
      const mapGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, scale * 0.6);
      mapGrad.addColorStop(0, "rgba(14, 165, 233, 0.15)");
      mapGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.1)");
      mapGrad.addColorStop(1, "rgba(15, 23, 42, 0.8)");
      ctx.fillStyle = mapGrad;
      ctx.fill();

      // Glowing Map Border Lines
      ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 15;
      ctx.stroke();

      const libX = centerX + liberiaPos[0] * scale;
      const libY = centerY + liberiaPos[1] * scale;

      // 3. Horizon Sunburst Rays emanating from Liberia across West Africa
      if (introPhase === "burst" || introPhase === "text" || introPhase === "complete") {
        rayAngle += 0.01;
        const numRays = 16;
        for (let r = 0; r < numRays; r++) {
          const angle = (r / numRays) * Math.PI * 2 + rayAngle * 0.2;
          const endX = libX + Math.cos(angle) * width;
          const endY = libY + Math.sin(angle) * height;

          const rayGrad = ctx.createLinearGradient(libX, libY, endX, endY);
          rayGrad.addColorStop(0, "rgba(245, 158, 11, 0.6)");
          rayGrad.addColorStop(0.3, "rgba(16, 185, 129, 0.3)");
          rayGrad.addColorStop(1, "transparent");

          ctx.beginPath();
          ctx.moveTo(libX, libY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = rayGrad;
          ctx.lineWidth = 12 + Math.sin(angle * 3) * 6;
          ctx.shadowBlur = 25;
          ctx.shadowColor = "#f59e0b";
          ctx.stroke();
        }

        // Broad Horizon Luminous Atmosphere
        const horizonGrad = ctx.createRadialGradient(libX, libY, 5, libX, libY, scale * 0.8);
        horizonGrad.addColorStop(0, "rgba(245, 158, 11, 0.8)");
        horizonGrad.addColorStop(0.4, "rgba(16, 185, 129, 0.4)");
        horizonGrad.addColorStop(0.8, "rgba(14, 165, 233, 0.15)");
        horizonGrad.addColorStop(1, "transparent");

        ctx.fillStyle = horizonGrad;
        ctx.beginPath();
        ctx.arc(libX, libY, scale * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Highlighted Liberia Beacon Pulse
      pulseAngle += 0.05;
      const pulseRadius = 12 + Math.sin(pulseAngle) * 8;

      ctx.beginPath();
      ctx.arc(libX, libY, pulseRadius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(libX, libY, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 30;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(libX, libY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Label "LIBERIA - TOTAG HQ"
      ctx.shadowBlur = 0;
      ctx.font = "900 11px Inter, sans-serif";
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("📍 LIBERIA (TOTAG HQ)", libX + 15, libY + 4);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlayingIntro, introPhase]);

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section className="relative w-full bg-slate-950 text-white overflow-hidden min-h-[750px] flex flex-col justify-between">

      {/* Background Canvas for Opening Sequence */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-85"
      />

      {/* Dark Ambient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 z-0 pointer-events-none" />

      {/* Top Header Overlay */}
      <div className="relative z-10 container mx-auto px-4 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            Liberia • West Africa Operation Center
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isPlayingIntro ? (
            <Button
              onClick={() => setIsPlayingIntro(false)}
              size="sm"
              variant="outline"
              className="bg-slate-900/80 border-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl backdrop-blur-md"
            >
              Skip Intro to Carousel →
            </Button>
          ) : (
            <Button
              onClick={() => setIsPlayingIntro(true)}
              size="sm"
              variant="outline"
              className="bg-slate-900/80 border-slate-700 text-amber-400 hover:text-amber-300 text-xs font-bold rounded-xl backdrop-blur-md"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Replay Liberia Horizon Opening
            </Button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex-1 flex flex-col justify-center max-w-5xl text-center">

        {/* INTRO ANIMATION DISPLAY MODE */}
        {isPlayingIntro ? (
          <div className="space-y-8 my-auto animate-fadeIn">
            
            {/* Luminous Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight"
            >
              Welcome to <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent drop-shadow-2xl">TOTAG Group</span>
            </motion.h1>

            {/* Wording coming through the Horizon Light */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="text-base sm:text-xl md:text-2xl text-slate-200 font-medium max-w-4xl mx-auto leading-relaxed drop-shadow-lg bg-slate-950/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md"
            >
              Delivering excellence across diverse industries through our specialized subsidiaries. From cargo handling, agribusiness, and petroleum services to construction, IT solutions, stationery supplies, and renewable energy, we provide comprehensive business solutions with unwavering commitment to quality.
            </motion.p>

            {/* Sub-status Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400"
            >
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Brightening Liberia & West Africa
              </span>
              <span>•</span>
              <span className="text-amber-400">9 Enterprise Subsidiaries</span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
              <Button
                onClick={() => setIsPlayingIntro(false)}
                size="lg"
                className="px-8 py-6 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-2xl hover:scale-105 transition-all"
              >
                <span>Explore 9 Operational Subsidiaries</span>
                <ArrowRight className="ml-2.5 w-5 h-5" />
              </Button>
            </motion.div>

          </div>
        ) : (
          /* HERO CAROUSEL ENGINE MODE */
          <div className="my-auto space-y-8 animate-fadeIn">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="glass-card border-white/20 dark:border-white/10 p-8 sm:p-12 rounded-3xl backdrop-blur-2xl relative overflow-hidden text-left bg-gradient-to-r shadow-2xl"
              >
                {/* Background Image / Overlay */}
                {currentSlide.image && (
                  <div className="absolute inset-0 z-0">
                    <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-full object-cover opacity-30" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient}`} />
                  </div>
                )}

                <div className="relative z-10 max-w-3xl space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-xs uppercase tracking-wider flex items-center gap-2">
                      <currentSlide.icon className="w-4 h-4 text-amber-400" />
                      {currentSlide.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold">
                      Slide {activeSlide + 1} of {HERO_SLIDES.length}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    {currentSlide.title}
                  </h2>

                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
                    {currentSlide.subtitle}
                  </p>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Link href={currentSlide.href}>
                      <Button
                        size="lg"
                        className="px-8 py-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-all"
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

      {/* BOTTOM SLIDE NAVIGATION & INDICATOR BAR */}
      <div className="relative z-10 container mx-auto px-4 pb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-4">
          
          {/* Quick Subsidiary Jump Tabs */}
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
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    !isPlayingIntro && activeSlide === idx
                      ? "bg-amber-500 text-slate-950 font-black shadow-lg"
                      : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{slide.title.split(" ")[1] || slide.title}</span>
                </button>
              );
            })}
          </div>

          {/* Controls */}
          {!isPlayingIntro && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center hover:bg-slate-800 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all"
              >
                {isPaused ? "▶ Auto-Play" : "⏸ Pause"}
              </button>

              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center hover:bg-slate-800 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>

    </section>
  );
}
