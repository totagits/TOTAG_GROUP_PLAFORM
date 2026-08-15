import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Fuel, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Truck, 
  Flame, 
  Zap,
  Building2
} from "lucide-react";
import { Link } from "wouter";

export default function PetroleumPage() {
  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-amber text-xs font-semibold">
              <Fuel className="w-4 h-4 text-amber-500" />
              <span>TOTAG Subsidiary • Energy & Fuel Distribution</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              TOTAG <span className="text-gradient-gold">Petroleum Services</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Wholesale fuel distribution, diesel and gasoline supply, petroleum storage tank facilities, industrial energy logistics, and marine vessel bunkering.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/#contact">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-500 text-white rounded-2xl px-8 shadow-xl">
                  <span>Bulk Fuel Inquiry</span>
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
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Fuel className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Bulk Fuel Supply</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Reliable delivery of AGO (Diesel), PMS (Gasoline), and Jet A-1 fuel for industrial generators, mining operations, and commercial fleets.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Terminal Storage Facilities</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  High-capacity bulk petroleum storage depots equipped with automated metering, quality testing labs, and environmental containment.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Specialized Tanker Transport</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  GPS-monitored fuel tanker trucks equipped with anti-tamper seals, spill-control protocols, and emergency safety equipment.
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
