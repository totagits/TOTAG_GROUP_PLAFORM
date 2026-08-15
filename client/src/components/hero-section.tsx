import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Building2, 
  Briefcase, 
  CheckCircle2,
  TrendingUp,
  Award
} from "lucide-react";
import { Link } from "wouter";

const stats = [
  { label: "Specialized Subsidiaries", value: "9", icon: Building2, color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Enterprise Modules", value: "50+", icon: Sparkles, color: "text-sky-600 dark:text-sky-400" },
  { label: "Operational Reliability", value: "99.9%", icon: ShieldCheck, color: "text-amber-600 dark:text-amber-400" },
  { label: "Global Reach & Ports", value: "Pan-African", icon: Globe, color: "text-purple-600 dark:text-purple-400" },
];

export default function HeroSection() {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative bg-mesh-glass pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      
      {/* Decorative Luminous Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-emerald shadow-sm mb-8"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-emerald-500" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              TOTAG Group 2.0 • 9 Specialized Subsidiaries Platform
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight"
          >
            Empowering Modern Commerce Across <br className="hidden sm:inline" />
            <span className="text-gradient-primary">Nine Specialized Subsidiaries</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            TOTAG Group of Companies Ltd delivers industry-leading enterprise solutions spanning Cargo Maritime Logistics, Integrated Agribusiness, Petroleum, General Construction, Retail Merchandise, Managed IT & SaaS, TOCEPS Catering, Real Estate, and Financial Consulting.
          </motion.p>
          
          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              onClick={() => handleNavClick("#services")}
              size="lg"
              className="w-full sm:w-auto px-8 py-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-semibold text-base rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
            >
              <span>Explore All 9 Subsidiaries</span>
              <ArrowRight className="ml-2.5 h-5 w-5" />
            </Button>
            
            <Link href="/saas">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 glass-card border-white/60 dark:border-white/20 text-slate-800 dark:text-white font-semibold text-base rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-200"
              >
                <span>Enterprise SaaS Platform</span>
                <Sparkles className="ml-2.5 h-5 w-5 text-emerald-500" />
              </Button>
            </Link>
          </motion.div>

          {/* Glass Metrics Stat Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="glass-card p-5 backdrop-blur-xl border border-white/60 dark:border-white/10 text-center flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className={`w-6 h-6 mb-2 ${stat.color}`} />
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

