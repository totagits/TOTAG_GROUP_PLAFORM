import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, ArrowRight, Play } from "lucide-react";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const handlePlayIntro = () => {
      setShowIntro(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("totag-play-intro", handlePlayIntro);
    return () => window.removeEventListener("totag-play-intro", handlePlayIntro);
  }, []);

  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShowIntro(false);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* CINEMATIC OPENING VIDEO OVERLAY */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              ref={videoRef}
              src="/videos/totag-brand-story.mp4"
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={() => setShowIntro(false)}
              className="w-full h-full object-cover"
            />

            {/* Top Floating Controls */}
            <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="px-3 py-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 backdrop-blur-md text-xs font-bold transition-all flex items-center gap-1.5"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-emerald-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span className="hidden sm:inline">{isMuted ? "Unmute" : "Muted"}</span>
              </button>

              <button
                onClick={handleSkipIntro}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-1.5 group"
              >
                <span>Enter Site</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Bottom Subtle Brand Watermark */}
            <div className="absolute bottom-6 inset-x-0 text-center z-20 pointer-events-none">
              <p className="text-white/80 font-bold text-xs uppercase tracking-widest drop-shadow-md">
                TOTAG GROUP OF COMPANIES LTD • LIBERIA ⟷ GLOBAL REACH
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
