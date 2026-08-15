import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Zap, 
  Sun, 
  ShieldCheck, 
  ArrowRight,
  BatteryCharging,
  Cpu,
  Calculator,
  Activity,
  Gauge,
  CheckCircle2,
  Sliders,
  FileCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SolarPage() {
  const { toast } = useToast();

  // Solar Sizing Calculator State
  const [dailyKwh, setDailyKwh] = useState(25); // kWh per day
  const [backupHours, setBackupHours] = useState(12); // hours
  const [systemType, setSystemType] = useState("hybrid");

  // Audit Request Form State
  const [auditForm, setAuditForm] = useState({
    clientName: "",
    email: "",
    phone: "",
    propertyType: "Commercial Building",
    location: "Monrovia",
    notes: ""
  });

  // Solar Sizing Math Calculation
  const calculateSystemSpecs = () => {
    // Average peak sun hours in Liberia: 4.8 hours/day
    const pvKwNeeded = Math.round((dailyKwh / 4.8) * 1.2 * 10) / 10; // 20% system loss buffer
    const inverterKva = Math.ceil(pvKwNeeded * 1.25);
    const batteryKwh = Math.round((dailyKwh * (backupHours / 24)) * 1.2 * 10) / 10;
    
    const costPv = pvKwNeeded * 750;
    const costInverter = inverterKva * 400;
    const costBattery = batteryKwh * 380;
    const totalEstimate = Math.round(costPv + costInverter + costBattery + 1200);

    return {
      pvKwNeeded,
      inverterKva,
      batteryKwh,
      totalEstimate
    };
  };

  const systemSpecs = calculateSystemSpecs();

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Solar Site Audit Requested",
      description: "Our renewable energy engineers will conduct on-site irradiance & electrical load assessment."
    });
    setAuditForm({ clientName: "", email: "", phone: "", propertyType: "Commercial Building", location: "Monrovia", notes: "" });
  };

  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-amber text-xs font-semibold">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>TOTAG Subsidiary • Solar Photovoltaic & Smart Power Systems</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              TOTAG <span className="text-gradient-gold">Solar Energy</span> & Smart Power
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Engineering, installation, commissioning, IoT remote monitoring, and maintenance of solar PV and LiFePO4 battery energy storage systems (BESS) for commercial, industrial, and residential clients.
            </p>
          </div>
        </section>

        {/* 1. Real-Time Solar Microgrid IoT Telemetry Dashboard */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-amber-950/40 via-slate-900/50 to-yellow-900/40 border-b border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Activity className="w-6 h-6 text-amber-400" />
                    <span>Live Solar Microgrid Telemetry & Power Production</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300 mt-1">
                    Real-time IoT telemetry monitor showing active solar generation, battery state of charge (SOC), and facility load demand.
                  </CardDescription>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                  <span>Solar Array Generating Live</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                  <Sun className="w-6 h-6 text-amber-500 mx-auto mb-1 animate-spin-slow" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Active Solar PV Power</span>
                  <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">18.4 kW</div>
                  <span className="text-[10px] text-slate-400">920 W/m² Solar Irradiance</span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                  <BatteryCharging className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Battery State of Charge (SOC)</span>
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">92%</div>
                  <span className="text-[10px] text-slate-400">LiFePO4 48V Storage Bank</span>
                </div>

                <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center space-y-1">
                  <Cpu className="w-6 h-6 text-sky-500 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Facility Load Consumption</span>
                  <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">11.6 kW</div>
                  <span className="text-[10px] text-slate-400">Pure Sine Wave Output</span>
                </div>

                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center space-y-1">
                  <ShieldCheck className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">CO₂ Offset Today</span>
                  <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">142 kg</div>
                  <span className="text-[10px] text-slate-400">Zero-Emission Renewable Energy</span>
                </div>

              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Solar PV Sizing Calculator & Site Audit Request */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Solar PV Sizing Calculator */}
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-500" />
                <span>Interactive Solar PV & Battery System Sizing Tool</span>
              </CardTitle>
              <CardDescription>
                Input your daily energy consumption and desired backup hours to calculate required solar array capacity and battery storage.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Daily Electricity Consumption:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{dailyKwh} kWh / Day</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={dailyKwh}
                  onChange={(e) => setDailyKwh(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Battery Backup Duration Required:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{backupHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="2"
                  value={backupHours}
                  onChange={(e) => setBackupHours(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Calculated System Specifications */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Solar PV Array</span>
                  <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">{systemSpecs.pvKwNeeded} kWp</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Hybrid Inverter</span>
                  <span className="text-lg font-extrabold text-sky-600 dark:text-sky-400">{systemSpecs.inverterKva} kVA</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">LiFePO4 Storage</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{systemSpecs.batteryKwh} kWh</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Estimated Turnkey Installation Cost:</span>
                <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  ${systemSpecs.totalEstimate.toLocaleString()} <span className="text-sm font-normal text-slate-500">USD</span>
                </div>
                <p className="text-[11px] text-slate-400">Includes Tier-1 Mono PERC panels, smart hybrid inverter, LiFePO4 battery bank, mounting structure, and commissioning.</p>
              </div>
            </CardContent>
          </Card>

          {/* Audit Request Form */}
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-500" />
                <span>On-Site Solar Audit & Microgrid Consultation</span>
              </CardTitle>
              <CardDescription>
                Schedule an expert renewable energy engineer to evaluate your roof orientation, electrical distribution panel, and load profile.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleAuditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Client Name / Organization</Label>
                    <Input
                      required
                      value={auditForm.clientName}
                      onChange={(e) => setAuditForm({ ...auditForm, clientName: e.target.value })}
                      placeholder="e.g. Royal Hotel Monrovia"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Contact Email</Label>
                    <Input
                      required
                      type="email"
                      value={auditForm.email}
                      onChange={(e) => setAuditForm({ ...auditForm, email: e.target.value })}
                      placeholder="operations@hotel.com"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Property Type</Label>
                    <select
                      value={auditForm.propertyType}
                      onChange={(e) => setAuditForm({ ...auditForm, propertyType: e.target.value })}
                      className="w-full mt-1.5 p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs font-semibold"
                    >
                      <option value="Commercial Building">Commercial Building</option>
                      <option value="Industrial Facility">Industrial Facility</option>
                      <option value="Residential Estate">Residential Estate</option>
                      <option value="Agricultural Farm">Agricultural Farm Microgrid</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Location / City</Label>
                    <Input
                      required
                      value={auditForm.location}
                      onChange={(e) => setAuditForm({ ...auditForm, location: e.target.value })}
                      placeholder="e.g. Sinkor, Monrovia"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Electrical Load & Power Goals</Label>
                  <textarea
                    rows={3}
                    value={auditForm.notes}
                    onChange={(e) => setAuditForm({ ...auditForm, notes: e.target.value })}
                    placeholder="Mention critical loads (e.g. air conditioners, cold storage, pumps), current LEC grid stability, generator fuel costs..."
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-5 font-semibold">
                  Schedule Free On-Site Solar Audit
                </Button>
              </form>
            </CardContent>
          </Card>

        </section>
      </main>

      <Footer />
    </div>
  );
}
