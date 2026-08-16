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
  Truck, 
  Ship, 
  Anchor, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Box, 
  Clock, 
  CheckCircle,
  FileText,
  Search,
  Calculator,
  Container,
  Navigation
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample mock tracked shipments database
const MOCK_SHIPMENTS: Record<string, {
  blNumber: string;
  containerId: string;
  shipper: string;
  consignee: string;
  origin: string;
  destination: string;
  vessel: string;
  status: "In Transit" | "Customs Clearance" | "Port Terminal Arrived" | "Delivered";
  progress: number;
  eta: string;
  history: Array<{ step: string; location: string; time: string; completed: boolean }>;
}> = {
  "TOTAG-BL-8841": {
    blNumber: "TOTAG-BL-8841",
    containerId: "TGHU-940218-4",
    shipper: "Global Logistics Co. Antwerp",
    consignee: "TOTAG General Merchandise",
    origin: "Port of Antwerp (BE)",
    destination: "Freeport of Monrovia (LR)",
    vessel: "MSC MIRIAM v.2410",
    status: "In Transit",
    progress: 65,
    eta: "2026-08-22",
    history: [
      { step: "Container Loaded at Origin Port", location: "Antwerp Terminal 1700", time: "2026-08-04 14:30", completed: true },
      { step: "Vessel Departure & Ocean Voyage", location: "Atlantic Ocean Southbound", time: "2026-08-06 08:15", completed: true },
      { step: "Customs Manifest Submission", location: "LRA ASYCUDA System", time: "2026-08-12 11:00", completed: true },
      { step: "Port Terminal Arrival & Unloading", location: "Freeport of Monrovia Berth 2", time: "Estimated Aug 22", completed: false },
      { step: "Final Bonded Delivery", location: "TOTAG Central Warehouse", time: "Pending", completed: false }
    ]
  },
  "TOTAG-BL-9102": {
    blNumber: "TOTAG-BL-9102",
    containerId: "TGHU-112094-1",
    shipper: "Sinotruk Heavy Industry Qingdao",
    consignee: "TOTAG General Construction",
    origin: "Port of Qingdao (CN)",
    destination: "Port of Buchanan (LR)",
    vessel: "CMA CGM RIVOLI",
    status: "Customs Clearance",
    progress: 85,
    eta: "2026-08-17",
    history: [
      { step: "Container Loaded at Origin Port", location: "Qingdao Port", time: "2026-07-28 09:00", completed: true },
      { step: "Ocean Voyage & Transit", location: "Gulf of Guinea", time: "2026-08-10 16:40", completed: true },
      { step: "Discharged at Terminal", location: "Port of Buchanan Yard", time: "2026-08-14 10:20", completed: true },
      { step: "LRA Single-Window Customs Assessment", location: "Buchanan Customs Yard", time: "In Progress", completed: false },
      { step: "Release & Equipment Delivery", location: "Construction Site Monrovia", time: "Pending", completed: false }
    ]
  }
};

export default function CargoPage() {
  const { toast } = useToast();

  // Waybill Tracker State
  const [searchCode, setSearchCode] = useState("TOTAG-BL-8841");
  const [trackedShipment, setTrackedShipment] = useState<typeof MOCK_SHIPMENTS["TOTAG-BL-8841"] | null>(MOCK_SHIPMENTS["TOTAG-BL-8841"]);

  // Shipping Rate Calculator State
  const [containerType, setContainerType] = useState("20ft");
  const [originPort, setOriginPort] = useState("Antwerp");
  const [cargoWeight, setCargoWeight] = useState(15);
  const [calculatedFreight, setCalculatedFreight] = useState<number | null>(3450);

  // Clearance Request Booking Form State
  const [bookingForm, setBookingForm] = useState({
    shipperName: "",
    email: "",
    phone: "",
    blNumber: "",
    containerCount: "1",
    notes: ""
  });

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const code = searchCode.trim().toUpperCase();
    if (MOCK_SHIPMENTS[code]) {
      setTrackedShipment(MOCK_SHIPMENTS[code]);
      toast({ title: "Shipment Found", description: `Displaying live status for ${code}` });
    } else {
      toast({ 
        title: "Tracking Code Not Found", 
        description: "Try searching with demo code: TOTAG-BL-8841 or TOTAG-BL-9102",
        variant: "destructive"
      });
    }
  };

  const handleCalculateRate = (e: React.FormEvent) => {
    e.preventDefault();
    const baseRate = containerType === "40ft" ? 5200 : containerType === "breakbulk" ? 4100 : 3100;
    const weightCost = cargoWeight * 45;
    const total = baseRate + weightCost;
    setCalculatedFreight(total);
    toast({ title: "Freight Estimate Calculated", description: `Estimated total: $${total.toLocaleString()} USD` });
  };

  const handleClearanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cargo Clearance Booking Submitted",
      description: "Our port stevedoring & LRA customs team will contact you within 2 business hours."
    });
    setBookingForm({ shipperName: "", email: "", phone: "", blNumber: "", containerCount: "1", notes: "" });
  };

  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Standardized Photo Carousel Hero Section */}
        <SubsidiaryHeroCarousel
          badge="TOTAG Subsidiary • Port Operations & Cargo Logistics"
          titleHighlight="Cargo Handling & Logistics"
          subtitle="Enterprise port stevedoring, container freight forwarding, LRA customs clearance, bonded warehousing, and cross-border haulage across Liberia and West Africa."
          slides={[
            { url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&h=800&fit=crop", caption: "Freeport of Monrovia Berth Stevedoring Operations" },
            { url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&h=800&fit=crop", caption: "TOTAG Bonded Container Freight Terminal" },
            { url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600&h=800&fit=crop", caption: "Cross-Border Fleet Haulage & Inland Logistics" }
          ]}
          stats={[
            { label: "Active Waybills", value: "1,240+" },
            { label: "Container TEUs", value: "8,500+" },
            { label: "LRA Clearance", value: "99.4%" }
          ]}
        />

        {/* 1. Live Waybill & Bill of Lading (BL) Tracking Application */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-900/40 via-slate-900/50 to-teal-900/40 border-b border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Navigation className="w-6 h-6 text-sky-400" />
                    <span>Container & Bill of Lading Live Tracking Portal</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300 mt-1">
                    Enter your TOTAG Waybill or Bill of Lading (BL) number to view real-time port telemetry & vessel status.
                  </CardDescription>
                </div>

                <form onSubmit={handleTrackSearch} className="flex gap-2 max-w-md w-full">
                  <Input
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="Enter BL Number (e.g. TOTAG-BL-8841)"
                    className="bg-white/10 text-white placeholder:text-slate-400 border-white/20 rounded-xl"
                  />
                  <Button type="submit" className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl px-6">
                    <Search className="w-4 h-4 mr-2" />
                    <span>Track</span>
                  </Button>
                </form>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {trackedShipment ? (
                <div className="space-y-8">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">BL / Waybill</span>
                      <span className="text-sm font-bold text-sky-600 dark:text-sky-400">{trackedShipment.blNumber}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Container ID</span>
                      <span className="text-sm font-bold">{trackedShipment.containerId}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Vessel & Voyage</span>
                      <span className="text-sm font-bold">{trackedShipment.vessel}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Estimated Arrival</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{trackedShipment.eta}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Origin: {trackedShipment.origin}</span>
                      <span className="text-sky-600 dark:text-sky-400">Status: {trackedShipment.status} ({trackedShipment.progress}%)</span>
                      <span>Destination: {trackedShipment.destination}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 transition-all duration-500" 
                        style={{ width: `${trackedShipment.progress}%` }} 
                      />
                    </div>
                  </div>

                  {/* Timeline History */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Shipment Milestones Timeline</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {trackedShipment.history.map((h, i) => (
                        <div 
                          key={i} 
                          className={`p-3.5 rounded-xl border ${
                            h.completed 
                              ? "bg-emerald-500/10 border-emerald-500/30 text-slate-900 dark:text-white" 
                              : "bg-slate-100/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className={`w-4 h-4 ${h.completed ? "text-emerald-500" : "text-slate-400"}`} />
                            <span className="text-xs font-bold truncate">{h.step}</span>
                          </div>
                          <span className="text-[11px] block text-slate-500">{h.location}</span>
                          <span className="text-[10px] text-slate-400">{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>

        {/* 2. Interactive Freight Shipping Rate Calculator & Customs Clearance Request */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Freight Rate Calculator */}
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-sky-500" />
                <span>Ocean & Overland Shipping Rate Estimator</span>
              </CardTitle>
              <CardDescription>
                Calculate instant freight rates for containerized or breakbulk cargo shipping to Freeport of Monrovia or Port of Buchanan.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCalculateRate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Container / Cargo Type</Label>
                    <select
                      value={containerType}
                      onChange={(e) => setContainerType(e.target.value)}
                      className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs font-semibold"
                    >
                      <option value="20ft">20ft Standard Container</option>
                      <option value="40ft">40ft High Cube Container</option>
                      <option value="breakbulk">Heavy Equipment Breakbulk</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Origin Port</Label>
                    <select
                      value={originPort}
                      onChange={(e) => setOriginPort(e.target.value)}
                      className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs font-semibold"
                    >
                      <option value="Antwerp">Port of Antwerp (Europe)</option>
                      <option value="Qingdao">Port of Qingdao (China)</option>
                      <option value="Houston">Port of Houston (USA)</option>
                      <option value="Abidjan">Port of Abidjan (West Africa)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Cargo Weight (Metric Tons):</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">{cargoWeight} Tons</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="35"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(Number(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-xl py-5 font-semibold">
                  Calculate Freight Quote
                </Button>

                {calculatedFreight !== null && (
                  <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-center space-y-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Estimated Total Shipping & Freight:</span>
                    <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
                      ${calculatedFreight.toLocaleString()} <span className="text-sm font-normal text-slate-500">USD</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Includes terminal handling, port stevedoring, and fuel surcharge.</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Port Clearance Booking Form */}
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <span>Customs Clearance & Stevedoring Booking</span>
              </CardTitle>
              <CardDescription>
                Request LRA customs tariff clearance, bonded storage, or container yard pickup dispatch.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleClearanceSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Shipper / Company Name</Label>
                    <Input
                      required
                      value={bookingForm.shipperName}
                      onChange={(e) => setBookingForm({ ...bookingForm, shipperName: e.target.value })}
                      placeholder="e.g. West Coast Trading Ltd"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Email Address</Label>
                    <Input
                      required
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="logistics@company.com"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Bill of Lading / Manifest #</Label>
                    <Input
                      required
                      value={bookingForm.blNumber}
                      onChange={(e) => setBookingForm({ ...bookingForm, blNumber: e.target.value })}
                      placeholder="BL-99201"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Container Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={bookingForm.containerCount}
                      onChange={(e) => setBookingForm({ ...bookingForm, containerCount: e.target.value })}
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Clearance & Bonded Storage Details</Label>
                  <textarea
                    rows={3}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Specify special handling (e.g. refrigerated reefer plug-in, oversized cargo, urgent customs clearance)..."
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-5 font-semibold">
                  Submit Clearance Request
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
