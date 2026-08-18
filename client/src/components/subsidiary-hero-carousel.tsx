import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export interface SubsidiarySlide {
  url: string;
  caption?: string;
}

export interface SubsidiaryHeroProps {
  badge: string;
  titlePrefix?: string;
  titleHighlight: string;
  titleSuffix?: string;
  subtitle: string;
  slides: SubsidiarySlide[];
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ElementType;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ElementType;
  };
  stats?: Array<{
    label: string;
    value: string;
  }>;
}

export default function SubsidiaryHeroCarousel({
  badge,
  titlePrefix = "TOTAG ",
  titleHighlight,
  titleSuffix = "",
  subtitle,
  slides,
  primaryAction,
  secondaryAction,
  stats
}: SubsidiaryHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div className="pt-24 sm:pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-slate-950 text-white min-h-[380px] sm:min-h-[440px] flex flex-col justify-between">
      
      {/* Background Image Carousel with Framer Motion Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${currentSlide?.url}')` }}
        />
      </AnimatePresence>

      {/* Dark Glass Morphic Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60 backdrop-blur-[2px]" />

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-6 sm:px-10 py-10 sm:py-14 flex flex-col justify-center h-full">
        
        {/* Badge */}
        <div className="mb-4">
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold rounded-full inline-flex items-center space-x-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{badge}</span>
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight mb-4">
          {titlePrefix}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-500">
            {titleHighlight}
          </span>
          {titleSuffix}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed font-medium mb-8">
          {subtitle}
        </p>

        {/* Action Buttons & Optional Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {primaryAction && (
            <Button
              size="lg"
              onClick={primaryAction.onClick}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black px-7 py-3.5 rounded-2xl shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center space-x-2 text-sm cursor-pointer"
            >
              {primaryAction.icon && <primaryAction.icon className="w-4 h-4" />}
              <span>{primaryAction.label}</span>
            </Button>
          )}

          {secondaryAction && (
            <Button
              size="lg"
              onClick={secondaryAction.onClick}
              className="bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 backdrop-blur-md px-7 py-3.5 rounded-2xl font-bold text-sm cursor-pointer flex items-center space-x-2 shadow-lg transition-all"
            >
              {secondaryAction.icon && <secondaryAction.icon className="w-4 h-4 text-emerald-400" />}
              <span>{secondaryAction.label}</span>
            </Button>
          )}

          {stats && stats.length > 0 && (
            <div className="flex items-center space-x-6 sm:ml-auto pt-4 sm:pt-0">
              {stats.map((st, idx) => (
                <div key={idx} className="border-l border-white/15 pl-4">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">{st.value}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">{st.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Carousel Navigation Controls & Slide Dots */}
      {slides.length > 1 && (
        <div className="relative z-20 px-6 pb-6 flex items-center justify-between">
          
          {/* Slide Caption */}
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            {currentSlide?.caption || `Photo ${currentIndex + 1} of ${slides.length}`}
          </div>

          {/* Dots & Arrow Controls */}
          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === currentIndex ? "w-6 bg-emerald-400" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  title={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
    </div>
  );
}
