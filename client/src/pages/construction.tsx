import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HardHat, 
  Building, 
  ArrowRight, 
  Ruler, 
  ShieldCheck, 
  Hammer,
  Truck
} from "lucide-react";
import { Link } from "wouter";

export default function ConstructionPage() {
  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-amber text-xs font-semibold">
              <HardHat className="w-4 h-4 text-amber-500" />
              <span>TOTAG Subsidiary • Construction & Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              TOTAG <span className="text-gradient-gold">Construction</span> & Infra
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Licensed civil engineering, road & bridge construction, commercial building development, heavy machinery rental, and project management.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/#contact">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-500 text-white rounded-2xl px-8 shadow-xl">
                  <span>Project Consultation</span>
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
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Civil & Structural Works</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Full-scope commercial buildings, institutional facilities, residential complexes, and reinforced concrete foundations.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Ruler className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Infrastructure & Roads</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Highway paving, drainage culverts, earthworks, site preparation, and municipal infrastructure projects across Liberia.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Heavy Machinery Fleet</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Excavators, bulldozers, motor graders, dump trucks, and compaction equipment available for lease with certified operators.
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
