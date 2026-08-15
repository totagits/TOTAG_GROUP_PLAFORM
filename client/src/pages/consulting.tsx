import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  BarChart3, 
  FileText, 
  Users,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";

export default function ConsultingPage() {
  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-sky text-xs font-semibold">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              <span>TOTAG Subsidiary • Consulting & Financial Advisory</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              TOTAG <span className="text-gradient-sky">Consulting</span> & Financial Advisory
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Corporate management advisory, financial auditing preparation, Liberian tax compliance, business process automation, and strategic growth planning.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/#contact">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-500 text-white rounded-2xl px-8 shadow-xl">
                  <span>Schedule Advisory Call</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Financial Advisory & Audit Prep</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Financial modeling, IFRS accounting alignment, internal audit readiness, and cash flow optimization for growing enterprises.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Regulatory & Tax Compliance</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Liberia Revenue Authority (LRA) tax filings, corporate governance frameworks, business registration, and statutory reporting.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Corporate Strategy & Restructuring</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Operational restructuring, digital transformation strategies, merger & acquisition feasibility studies, and market expansion.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
