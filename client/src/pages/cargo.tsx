import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Truck, 
  Ship, 
  Anchor, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Box, 
  Clock, 
  CheckCircle,
  FileText
} from "lucide-react";
import { Link } from "wouter";

export default function CargoPage() {
  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-sky text-xs font-semibold">
              <Ship className="w-4 h-4 text-sky-500" />
              <span>TOTAG Subsidiary • Maritime & Freight Logistics</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              TOTAG <span className="text-gradient-sky">Cargo Handling</span> & Logistics
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Premier port management, container shipping, stevedoring, bonded warehousing, and cross-border freight operations serving Liberia and West Africa.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/#contact">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-500 text-white rounded-2xl px-8 shadow-xl">
                  <span>Request Cargo Quote</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/order-tracking">
                <Button size="lg" variant="outline" className="glass-card text-slate-800 dark:text-white rounded-2xl px-8">
                  <span>Track Shipment</span>
                  <Box className="w-4 h-4 ml-2 text-sky-500" />
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
                  <Anchor className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Port & Terminal Operations</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Comprehensive vessel discharge, container yard management, and port stevedoring with ISO-compliant safety standards.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Inland Freight & Haulage</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Heavy truck fleets for containerized, bulk, and break-bulk cargo distribution to all fifteen Liberian counties and MRU borders.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Customs Clearance & Bonded Store</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Direct LRA customs integration, tariff classification, single-window clearance, and secure bonded warehouse storage.
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
