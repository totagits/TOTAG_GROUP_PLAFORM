import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Building2, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight,
  Sliders,
  Layers,
  Award,
  FileText,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample active institutional assignments
const ACTIVE_CONTRACTS = [
  {
    id: "INC-2026-081",
    client: "United Nations Development Programme (UNDP Liberia)",
    title: "Rural Agribusiness & Renewable Energy Microgrid Turnkey Execution",
    value: 450000,
    startDate: "2026-03-01",
    endDate: "2026-11-30",
    status: "Active Execution",
    progress: 68,
    workPackages: [
      { name: "Solar Microgrid Installation", status: "Completed", deliverables: "125 kW Array" },
      { name: "Cold-Chain Storage Setup", status: "In Progress", deliverables: "2 Ref Depots" },
      { name: "Farmer Cooperative Training", status: "Pending", deliverables: "300 Farmers" }
    ]
  },
  {
    id: "INC-2026-094",
    client: "Ministry of Public Works / World Bank LR",
    title: "Feeder Road Rehabilitation & Drainage Quality Control Supervision",
    value: 780000,
    startDate: "2026-01-15",
    endDate: "2026-12-31",
    status: "Milestone Audit",
    progress: 52,
    workPackages: [
      { name: "Culvert Concrete Pouring", status: "Completed", deliverables: "45 Culverts" },
      { name: "Asphalt Compaction Testing", status: "In Progress", deliverables: "28 km Section" },
      { name: "Environmental Compliance", status: "In Progress", deliverables: "Quarterly Log" }
    ]
  }
];

export default function InstitutionalServicesPage() {
  const { toast } = useToast();

  const [selectedContract, setSelectedContract] = useState(ACTIVE_CONTRACTS[0]);

  // Tender RFP Configurator State
  const [rfpForm, setRfpForm] = useState({
    agencyName: "",
    email: "",
    phone: "",
    tenderTitle: "",
    estimatedBudgetUsd: "250000",
    scopeDetails: ""
  });

  const handleRfpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Institutional RFP Proposal Submitted",
      description: "Our Institutional Contracts & Governance Directorate will review the SOW and prepare technical proposal."
    });
    setRfpForm({ agencyName: "", email: "", phone: "", tenderTitle: "", estimatedBudgetUsd: "250000", scopeDetails: "" });
  };

  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-emerald text-xs font-semibold">
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>TOTAG Subsidiary • Institutional Services & Contract Operations</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              TOTAG <span className="text-gradient-emerald">Institutional Services</span> Platform
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              A configurable contract operations platform designed for government ministries, international NGOs, multilateral development agencies, and corporate institutional assignments.
            </p>
          </div>
        </section>

        {/* 1. Active Institutional Assignment Operations Console */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-emerald-950/40 via-slate-900/50 to-teal-950/40 border-b border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                    <FileCheck className="w-6 h-6 text-emerald-400" />
                    <span>Institutional Contract Operations & Deliverables Portal</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300 mt-1">
                    Manage multi-stakeholder work packages, milestone sign-offs, evidence attachments, and SLA compliance.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Contract Selector List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Agency Contracts</h4>
                  {ACTIVE_CONTRACTS.map((contract) => (
                    <div 
                      key={contract.id}
                      onClick={() => setSelectedContract(contract)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedContract.id === contract.id 
                          ? "bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg" 
                          : "bg-slate-100/70 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        {contract.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{contract.client}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{contract.title}</p>
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-200 dark:border-white/10">
                        <span className="text-xs font-semibold text-slate-400">Value: ${contract.value.toLocaleString()} USD</span>
                        <span className="text-xs font-bold text-emerald-500">{contract.progress}% Done</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contract Work Packages & Deliverables Console */}
                <Card className="lg:col-span-2 glass-card border-white/60 dark:border-white/10 p-6 space-y-6">
                  <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{selectedContract.id} • {selectedContract.status}</span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedContract.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">Client: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedContract.client}</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">${selectedContract.value.toLocaleString()} USD</span>
                      <span className="text-xs text-slate-400 block">{selectedContract.startDate} to {selectedContract.endDate}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Milestone Execution Progress</span>
                      <span className="text-emerald-500">{selectedContract.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" 
                        style={{ width: `${selectedContract.progress}%` }} 
                      />
                    </div>
                  </div>

                  {/* Work Packages Table */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Work Package Deliverables Breakdown</h4>
                    <div className="space-y-2">
                      {selectedContract.workPackages.map((wp, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                          <div className="flex items-center space-x-3">
                            <CheckCircle2 className={`w-4 h-4 ${wp.status === "Completed" ? "text-emerald-500" : "text-amber-500"}`} />
                            <div>
                              <span className="text-xs font-bold block">{wp.name}</span>
                              <span className="text-[10px] text-slate-400">Deliverable Spec: {wp.deliverables}</span>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            wp.status === "Completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                          }`}>
                            {wp.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. RFP & Tender Configurator Form */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mb-20">
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" />
                <span>Submit Institutional RFP & Contract Proposal Request</span>
              </CardTitle>
              <CardDescription>
                Configure custom institutional assignments for technical assistance, infrastructure development, or multi-sector turn-key services.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRfpSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Agency / Ministry Name</Label>
                    <Input
                      required
                      value={rfpForm.agencyName}
                      onChange={(e) => setRfpForm({ ...rfpForm, agencyName: e.target.value })}
                      placeholder="e.g. USAID / World Bank"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Official Contact Email</Label>
                    <Input
                      required
                      type="email"
                      value={rfpForm.email}
                      onChange={(e) => setRfpForm({ ...rfpForm, email: e.target.value })}
                      placeholder="procurement@agency.org"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Assignment Title</Label>
                    <Input
                      required
                      value={rfpForm.tenderTitle}
                      onChange={(e) => setRfpForm({ ...rfpForm, tenderTitle: e.target.value })}
                      placeholder="e.g. National Healthcare IT Infrastructure Upgrade"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Estimated Budget (USD)</Label>
                    <Input
                      type="number"
                      value={rfpForm.estimatedBudgetUsd}
                      onChange={(e) => setRfpForm({ ...rfpForm, estimatedBudgetUsd: e.target.value })}
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Scope of Work (SOW) & SLA Deliverables</Label>
                  <textarea
                    rows={4}
                    value={rfpForm.scopeDetails}
                    onChange={(e) => setRfpForm({ ...rfpForm, scopeDetails: e.target.value })}
                    placeholder="Specify project milestones, geographic coverage, required personnel qualifications, and SLA targets..."
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-5 font-semibold">
                  Submit Institutional Proposal Request
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
