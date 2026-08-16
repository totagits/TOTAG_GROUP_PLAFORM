import SubsidiaryHeroCarousel from "@/components/subsidiary-hero-carousel";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Fuel, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Truck, 
  Flame, 
  Zap,
  Building2,
  Gauge,
  Droplets,
  Activity,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Ship,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Depot Storage Tank Records
const DEPOT_TANKS = [
  { id: "TANK-01", fuel: "AGO (Automative Gas Oil / Diesel)", current: 412000, capacity: 500000, temp: "28.4°C", apiGravity: "34.2°", status: "Optimal", color: "from-amber-500 to-yellow-600" },
  { id: "TANK-02", fuel: "PMS (Premium Motor Spirit / Gasoline)", current: 378000, capacity: 450000, temp: "27.1°C", apiGravity: "58.1°", status: "Optimal", color: "from-sky-500 to-blue-600" },
  { id: "TANK-03", fuel: "Jet A-1 Aviation Fuel", current: 195000, capacity: 250000, temp: "25.8°C", apiGravity: "42.5°", status: "Optimal", color: "from-emerald-500 to-teal-600" },
  { id: "TANK-04", fuel: "Marine Heavy Fuel Oil (Bunkering)", current: 490000, capacity: 600000, temp: "38.2°C", apiGravity: "18.4°", status: "Heating Active", color: "from-purple-500 to-indigo-600" }
];

export default function PetroleumPage() {
  const { toast } = useToast();

  // Price Estimator State
  const [fuelType, setFuelType] = useState("AGO");
  const [quantityLiters, setQuantityLiters] = useState(10000);
  const [deliveryType, setDeliveryType] = useState("tanker_dispatch");
  const [deliveryLocation, setDeliveryLocation] = useState("Monrovia Industrial Zone");

  // Bulk Order Form
  const [orderForm, setOrderForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    deliveryDate: "",
    notes: ""
  });

  const getPricePerLiter = () => {
    switch (fuelType) {
      case "PMS": return 1.28;
      case "JetA1": return 1.42;
      case "Bunkering": return 1.15;
      default: return 1.24; // AGO
    }
  };

  const calculateEstimate = () => {
    const base = quantityLiters * getPricePerLiter();
    const logisticsFee = deliveryType === "tanker_dispatch" ? 350 : deliveryType === "bunkering" ? 850 : 0;
    return base + logisticsFee;
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Bulk Fuel Order Submitted",
      description: "Our petroleum logistics dispatch team will verify fuel quality specs and confirm delivery timetable."
    });
    setOrderForm({ companyName: "", email: "", phone: "", deliveryDate: "", notes: "" });
  };

  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Standardized Photo Carousel Hero Section */}
        <section className="mb-12">
          <SubsidiaryHeroCarousel
            badge="TOTAG Subsidiary • Bulk Fuel Distribution & Marine Bunkering"
            titleHighlight="Petroleum Services"
            subtitle="Industrial bulk fuel distribution, high-capacity terminal tank depot storage, GPS-tracked tanker logistics, and offshore marine vessel bunkering across Liberia."
            slides={[
              { url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&h=800&fit=crop", caption: "TOTAG Central Fuel Terminal & Storage Tanks" },
              { url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&h=800&fit=crop", caption: "Heavy AGO & PMS Bulk Tanker Delivery" },
              { url: "https://images.unsplash.com/photo-1508873696983-2df515122519?w=1600&h=800&fit=crop", caption: "Offshore Bunkering & Marine Fuel Transshipment" }
            ]}
            stats={[
              { label: "Depot Capacity", value: "15M Liters" },
              { label: "Tanker Fleet", value: "45 Units" },
              { label: "Delivery Reliability", value: "99.8%" }
            ]}
          />
        </section>

        {/* 1. Terminal Storage Depot Tank Level Telemetry Portal */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-amber-950/40 via-slate-900/50 to-amber-900/40 border-b border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Gauge className="w-6 h-6 text-amber-400" />
                    <span>Freeport Terminal Bulk Fuel Storage Telemetry</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300 mt-1">
                    Live operational telemetry showing tank storage levels, fuel temperature, and API gravity quality metrics.
                  </CardDescription>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>Depot Live Sync Active</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {DEPOT_TANKS.map((tank) => {
                  const fillPercentage = Math.round((tank.current / tank.capacity) * 100);
                  return (
                    <div 
                      key={tank.id} 
                      className="p-5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4 hover:scale-[1.02] transition-transform"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">{tank.id}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                          {tank.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold truncate text-slate-900 dark:text-white">{tank.fuel}</h4>

                      {/* Tank Capacity Gauge */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Volume</span>
                          <span className="text-amber-600 dark:text-amber-400">{fillPercentage}% ({tank.current.toLocaleString()} L)</span>
                        </div>
                        <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${tank.color}`}
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Quality Specs */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                        <div>
                          <span>Temp: </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{tank.temp}</span>
                        </div>
                        <div>
                          <span>API Gravity: </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{tank.apiGravity}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Bulk Fuel Order Portal & Pricing Calculator */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Fuel Quote Calculator */}
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-500" />
                <span>Bulk Fuel Pricing & Volume Estimator</span>
              </CardTitle>
              <CardDescription>
                Select product specification and order volume for instant bulk fuel pricing.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCalculateFuelCost} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Petroleum Fuel Type</Label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs font-semibold"
                    >
                      <option value="AGO">AGO Diesel ($1.24/L)</option>
                      <option value="PMS">PMS Gasoline ($1.28/L)</option>
                      <option value="JetA1">Jet A-1 Aviation ($1.42/L)</option>
                      <option value="Bunkering">Marine Bunkering HFO ($1.15/L)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Delivery Destination</Label>
                    <input
                      type="text"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full mt-1.5 p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs font-semibold"
                      placeholder="e.g. Monrovia Port Depot"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Order Volume (Liters):</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{quantityLiters.toLocaleString()} Liters</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="100000"
                    step="1000"
                    value={quantityLiters}
                    onChange={(e) => setQuantityLiters(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 via-gold-500 to-yellow-600 text-white rounded-xl py-5 font-semibold">
                  Calculate Bulk Fuel Quote
                </Button>

                {calculatedQuote !== null && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Estimated Bulk Order Cost:</span>
                    <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                      ${calculatedQuote.toLocaleString()} <span className="text-sm font-normal text-slate-500">USD</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Includes terminal loading, flowmeter metering, and GPS tanker transport.</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Bulk Order Submission Form */}
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-500" />
                <span>Bulk Fuel Order & Tanker Dispatch Request</span>
              </CardTitle>
              <CardDescription>
                Place commercial orders for mining sites, power stations, commercial fleets, or marine vessel bunkering.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Company / Organization</Label>
                    <Input
                      required
                      value={orderForm.companyName}
                      onChange={(e) => setOrderForm({ ...orderForm, companyName: e.target.value })}
                      placeholder="e.g. Liberian Power Utility"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Contact Email</Label>
                    <Input
                      required
                      type="email"
                      value={orderForm.email}
                      onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                      placeholder="fuel@company.com"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Phone Number</Label>
                    <Input
                      required
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      placeholder="+231 88 000 0000"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Requested Delivery Date</Label>
                    <Input
                      type="date"
                      value={orderForm.deliveryDate}
                      onChange={(e) => setOrderForm({ ...orderForm, deliveryDate: e.target.value })}
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Delivery & Quality Specifications</Label>
                  <textarea
                    rows={3}
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                    placeholder="Specify delivery site access conditions, discharge pump requirements, laboratory test certificates..."
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-5 font-semibold">
                  Confirm Tanker Dispatch Request
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
