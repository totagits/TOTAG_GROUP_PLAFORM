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
  HardHat, 
  Building, 
  ArrowRight, 
  Ruler, 
  ShieldCheck, 
  Hammer,
  Truck,
  Calculator,
  Calendar,
  CheckCircle2,
  Briefcase,
  FileCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Heavy Machinery Fleet Data
const MACHINERY_FLEET = [
  { id: "EQ-01", name: "CAT 330 Hydraulic Excavator", category: "Earthmoving", rate: 450, status: "Available", image: "https://images.unsplash.com/photo-1579412690850-bd41cd0af397?w=500&auto=format&fit=crop&q=60" },
  { id: "EQ-02", name: "Komatsu D85EX Crawler Bulldozer", category: "Land Clearing", rate: 550, status: "Available", image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=500&auto=format&fit=crop&q=60" },
  { id: "EQ-03", name: "CAT 140K Motor Grader", category: "Road Leveling", rate: 400, status: "Available", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60" },
  { id: "EQ-04", name: "SANY 50-Ton Mobile Hydraulic Crane", category: "Heavy Lifting", rate: 850, status: "Available", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60" },
  { id: "EQ-05", name: "HOWO 20-Ton Heavy Tipper Dump Truck", category: "Haulage", rate: 250, status: "Available", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=60" }
];

export default function ConstructionPage() {
  const { toast } = useToast();

  // Heavy Equipment Booking State
  const [selectedMachine, setSelectedMachine] = useState(MACHINERY_FLEET[0]);
  const [rentalDays, setRentalDays] = useState(5);
  const [withOperator, setWithOperator] = useState(true);

  // BOQ Calculator State
  const [buildingArea, setBuildingArea] = useState(250); // m2
  const [stories, setStories] = useState(2);
  const [calculatedBoq, setCalculatedBoq] = useState<number | null>(87500);

  // Tender Booking Form
  const [tenderForm, setTenderForm] = useState({
    clientName: "",
    email: "",
    phone: "",
    projectType: "Commercial Building",
    location: "Monrovia",
    notes: ""
  });

  const handleCalculateRental = (machine: typeof MACHINERY_FLEET[0], days: number, operator: boolean) => {
    const operatorFee = operator ? 50 : 0;
    return (machine.rate + operatorFee) * days;
  };

  const handleBookEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    const total = handleCalculateRental(selectedMachine, rentalDays, withOperator);
    toast({
      title: "Equipment Rental Reservation Submitted",
      description: `${selectedMachine.name} reserved for ${rentalDays} days. Estimated total: $${total.toLocaleString()} USD`
    });
  };

  const handleCalculateBoq = (e: React.FormEvent) => {
    e.preventDefault();
    const baseCostPerM2 = 350;
    const total = buildingArea * stories * baseCostPerM2;
    setCalculatedBoq(total);
    toast({ title: "BOQ Baseline Estimated", description: `Estimated Civil Works Budget: $${total.toLocaleString()} USD` });
  };

  const handleTenderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Civil Works Tender Inquiry Received",
      description: "Our chief structural engineer will contact you to review blueprints and bill of quantities."
    });
    setTenderForm({ clientName: "", email: "", phone: "", projectType: "Commercial Building", location: "Monrovia", notes: "" });
  };

  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-amber text-xs font-semibold">
              <HardHat className="w-4 h-4 text-amber-500" />
              <span>TOTAG Subsidiary • General Construction & Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              TOTAG <span className="text-gradient-gold">Construction</span> & Infrastructure
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Licensed civil engineering, road & bridge infrastructure development, commercial building construction, heavy equipment fleet rental, and project management.
            </p>
          </div>
        </section>

        {/* 1. Heavy Equipment Fleet Rental Booking Portal */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-amber-950/40 via-slate-900/50 to-yellow-900/40 border-b border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Truck className="w-6 h-6 text-amber-400" />
                    <span>Heavy Construction Equipment Fleet Rental</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300 mt-1">
                    Lease heavy machinery equipped with certified operator options for site clearance, road grading, and excavation.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Machine Fleet Selection */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MACHINERY_FLEET.map((machine) => (
                    <div 
                      key={machine.id}
                      onClick={() => setSelectedMachine(machine)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedMachine.id === machine.id 
                          ? "bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/50 shadow-lg" 
                          : "bg-slate-100/70 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          {machine.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{machine.status}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{machine.name}</h4>
                      <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                        ${machine.rate} <span className="text-xs font-normal text-slate-500">/ Day</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rental Reservation Summary */}
                <Card className="glass-card border-white/60 dark:border-white/10 p-5 space-y-4">
                  <h4 className="text-base font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span>Rental Reservation Summary</span>
                  </h4>

                  <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 space-y-1 text-xs">
                    <span className="text-slate-400 block">Selected Equipment:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block">{selectedMachine.name}</span>
                    <span className="text-slate-500 block">Base Rate: ${selectedMachine.rate} / Day</span>
                  </div>

                  <form onSubmit={handleBookEquipment} className="space-y-4">
                    <div>
                      <Label className="text-xs font-semibold">Rental Duration (Days)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="90"
                        value={rentalDays}
                        onChange={(e) => setRentalDays(Number(e.target.value))}
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="operator"
                        checked={withOperator}
                        onChange={(e) => setWithOperator(e.target.checked)}
                        className="rounded accent-amber-500 w-4 h-4"
                      />
                      <label htmlFor="operator" className="text-xs font-semibold">Include Certified Operator (+$50/Day)</label>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Estimated Total:</span>
                      <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                        ${handleCalculateRental(selectedMachine, rentalDays, withOperator).toLocaleString()} USD
                      </span>
                    </div>

                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-5 font-semibold">
                      Confirm Fleet Reservation
                    </Button>
                  </form>
                </Card>

              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Bill of Quantities (BOQ) Cost Estimator & Tender Application */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Civil BOQ Estimator */}
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-500" />
                <span>Civil Works Bill of Quantities (BOQ) Estimator</span>
              </CardTitle>
              <CardDescription>
                Calculate baseline structural material and labor budget for residential or commercial building projects.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCalculateBoq} className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Building Footprint Area:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{buildingArea} m²</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="25"
                    value={buildingArea}
                    onChange={(e) => setBuildingArea(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Number of Floors / Stories:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{stories} Floors</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stories}
                    onChange={(e) => setStories(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-white rounded-xl py-5 font-semibold">
                  Generate BOQ Baseline Estimate
                </Button>

                {calculatedBoq !== null && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Estimated Structural BOQ Budget:</span>
                    <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                      ${calculatedBoq.toLocaleString()} <span className="text-sm font-normal text-slate-500">USD</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Includes reinforced concrete, rebar steel, earthworks, and masonry labor.</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Tender Application Form */}
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-500" />
                <span>Subcontractor & Project Tender Application</span>
              </CardTitle>
              <CardDescription>
                Submit civil engineering bids, road construction proposals, or infrastructure tender documents.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleTenderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Client / Organization</Label>
                    <Input
                      required
                      value={tenderForm.clientName}
                      onChange={(e) => setTenderForm({ ...tenderForm, clientName: e.target.value })}
                      placeholder="e.g. Ministry of Public Works"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Contact Email</Label>
                    <Input
                      required
                      type="email"
                      value={tenderForm.email}
                      onChange={(e) => setTenderForm({ ...tenderForm, email: e.target.value })}
                      placeholder="engineering@gov.lr"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Project Category</Label>
                    <select
                      value={tenderForm.projectType}
                      onChange={(e) => setTenderForm({ ...tenderForm, projectType: e.target.value })}
                      className="w-full mt-1.5 p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs font-semibold"
                    >
                      <option value="Road Infrastructure">Road & Asphalt Paving</option>
                      <option value="Commercial Building">Commercial Multi-Story</option>
                      <option value="Bridge & Culvert">Bridge & Drainage Engineering</option>
                      <option value="Site Preparation">Land Clearing & Earthworks</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Project Location</Label>
                    <Input
                      required
                      value={tenderForm.location}
                      onChange={(e) => setTenderForm({ ...tenderForm, location: e.target.value })}
                      placeholder="County / City"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Project Specifications & BOQ Requirements</Label>
                  <textarea
                    rows={3}
                    value={tenderForm.notes}
                    onChange={(e) => setTenderForm({ ...tenderForm, notes: e.target.value })}
                    placeholder="Provide scope of works, completion timeline, material specs..."
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-5 font-semibold">
                  Submit Construction Tender Proposal
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
