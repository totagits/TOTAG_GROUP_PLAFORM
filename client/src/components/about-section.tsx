import { motion } from "framer-motion";
import { Target, Award, ShieldCheck, Users, Sparkles, Building2 } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-badge-emerald mb-4 text-xs font-semibold uppercase tracking-wider"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>About TOTAG Group • Est. Feb 2019</span>
          </motion.div>


          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight"
          >
            Innovating Tomorrow, <span className="text-gradient-emerald">Empowering Today</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            TOTAG Group of Companies Ltd is a diversified multi-sector business group committed to delivering operational excellence across nine specialized subsidiaries in Liberia and internationally.
          </motion.p>
        </div>

        {/* 3 Core Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To provide industry-leading commercial solutions with integrity, innovation, and unwavering dedication to driving economic growth and client success across all operational sectors.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Vision</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To be West Africa's premier multi-industry conglomerate, recognized globally for operational efficiency, sustainable agribusiness, tech innovation, and community empowerment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Core Commitment</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Uncompromising quality control, customer-first service delivery, environmental responsibility, and adherence to highest international standards across all subsidiaries.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
