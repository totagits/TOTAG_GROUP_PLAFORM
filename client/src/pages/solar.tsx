import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  Sun, 
  ShieldCheck, 
  ArrowRight,
  BatteryCharging,
  Cpu
} from "lucide-react";
import { Link } from "wouter";

export default function SolarPage() {
  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-amber text-xs font-semibold">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>TOTAG Subsidiary • Renewable Energy & Smart Power</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              TOTAG <span className="text-gradient-gold">Solar Energy</span> & Smart Power
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Supply, installation, commissioning, monitoring, and maintenance of solar photovoltaic and energy-storage systems for residential, commercial, institutional, industrial, and public-sector clients.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/#contact">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-500 text-white rounded-2xl px-8 shadow-xl">
                  <span>Solar Audit & Consultation</span>
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
                  <Sun className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Solar PV Systems Installation</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Rooftop and ground-mounted high-efficiency tier-1 solar panel installations for off-grid and hybrid power backup.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <BatteryCharging className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Smart Energy Storage (BESS)</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Lithium LiFePO4 battery storage banks, intelligent inverters, and automatic transfer switches for 24/7 continuous electricity.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Commercial & Industrial Power</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Custom microgrid engineering, Remote IoT power telemetry, preventive maintenance, and utility cost reduction solutions.
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
