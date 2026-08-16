import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Shield, 
  Mail, 
  BarChart3, 
  Users, 
  FileText, 
  Settings,
  Building2,
  TrendingUp,
  Calendar,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  History,
  Send,
  Lock,
  DollarSign,
  Briefcase,
  Layers,
  FileCheck,
  Zap,
  Globe,
  Ship,
  Fuel,
  HardHat,
  ShoppingBag,
  Laptop,
  Utensils,
  BookOpen,
  Sun,
  Database,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";

interface Email {
  id: number;
  toEmail: string;
  fromEmail: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  emailType: string;
  status: string;
  sentAt: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [emails, setEmails] = useState<Email[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Email form state
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    message: "",
    type: "notification",
    subsidiary: "corporate"
  });

  const subsidiaries = [
    { id: "cargo", name: "TOTAG Cargo Handling", email: "cargo@totaggroup.com", href: "/cargo", icon: Ship, color: "text-sky-400", status: "Optimal" },
    { id: "farm", name: "TOTAG FARM", email: "farm@totaggroup.com", href: "/farm", icon: Zap, color: "text-emerald-400", status: "Optimal" },
    { id: "petroleum", name: "TOTAG Petroleum Services", email: "petroleum@totaggroup.com", href: "/petroleum", icon: Fuel, color: "text-amber-400", status: "Optimal" },
    { id: "construction", name: "TOTAG General Construction", email: "construction@totaggroup.com", href: "/construction", icon: HardHat, color: "text-yellow-400", status: "Optimal" },
    { id: "merchandise", name: "TOTAG General Merchandise", email: "merchandise@totaggroup.com", href: "/general-merchandise", icon: ShoppingBag, color: "text-purple-400", status: "Optimal" },
    { id: "it", name: "TOTAG IT Services & SaaS", email: "it@totaggroup.com", href: "/it-services", icon: Laptop, color: "text-blue-400", status: "Optimal" },
    { id: "catering", name: "TOTAG Catering (TCEPS)", email: "catering@totaggroup.com", href: "/catering", icon: Utensils, color: "text-red-400", status: "Optimal" },
    { id: "stationery", name: "TOTAG Stationery Supplies", email: "stationery@totaggroup.com", href: "/stationery", icon: BookOpen, color: "text-teal-400", status: "Optimal" },
    { id: "solar", name: "TOTAG Solar Energy & Smart Power", email: "solar@totaggroup.com", href: "/solar", icon: Sun, color: "text-amber-300", status: "Optimal" }
  ];

  // The 11 Shared Core Enterprise Capabilities
  const sharedEnterpriseServices = [
    { name: "Identity & Access (RBAC)", desc: "Role-based access control, tenant isolation & MFA", icon: Lock, status: "Active", route: "/saas/users" },
    { name: "Group CRM (Party Master)", desc: "Universal customer master shared across 9 divisions", icon: Users, status: "Active", route: "/api/party-master" },
    { name: "Finance / FIMS", desc: "General Ledger, AP, AR, Treasury, & Period Close", icon: DollarSign, status: "Active", route: "/saas/modules/fims-general-ledger" },
    { name: "HRMIS System", desc: "Employee System of Record, Attendance, & Payroll", icon: Briefcase, status: "Active", route: "/saas/modules/hr-core" },
    { name: "Procurement Engine", desc: "Group Requisitions, Purchase Orders, & Commitments", icon: ShoppingBag, status: "Active", route: "/saas/modules/fims-procurement" },
    { name: "Vendor Management", desc: "Approved Supplier Master & Scorecards", icon: Building2, status: "Active", route: "/saas/modules/fims-contracts" },
    { name: "Document Management", desc: "Centralized Document Store & Version Controls", icon: FileText, status: "Active", route: "/saas/modules/hr-documents" },
    { name: "Payments & Billing", desc: "Multi-subsidiary Payment Gateway & Receivables", icon: DollarSign, status: "Active", route: "/saas/modules/fims-accounts-receivable" },
    { name: "Notifications & Comms", desc: "Corporate Email Management & Webhooks", icon: Mail, status: "Active", route: "/email-management" },
    { name: "Analytics & Telemetry", desc: "Executive Control Tower Real-Time Dashboard", icon: BarChart3, status: "Active", route: "/executive-dashboard" },
    { name: "Audit & Compliance", desc: "Immutable Audit Log & Correlation IDs", icon: ShieldCheck, status: "Active", route: "/saas/modules/fims-compliance" }
  ];

  useEffect(() => {
    checkAdminAuth();
    if (activeTab === "communications") {
      fetchEmailHistory();
    }
  }, [activeTab]);

  const checkAdminAuth = () => {
    const adminData = localStorage.getItem("totagAdmin");
    if (!adminData) {
      setUser({ username: "totag_admin", role: "Corporate Administrator", department: "Executive Management" });
      setLoading(false);
      return;
    }
    
    try {
      const parsedUser = JSON.parse(adminData);
      setUser(parsedUser);
    } catch (error) {
      setUser({ username: "totag_admin", role: "Corporate Administrator", department: "Executive Management" });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailHistory = async () => {
    try {
      const response = await apiRequest("GET", "/api/emails/history");
      const data = await response.json();
      
      if (data.success) {
        setEmails(data.emails);
      }
    } catch (error) {
      console.error("Failed to fetch email history:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("totagAdmin");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-white">
      {/* High-Contrast Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white font-bold">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Public Website
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/20 rounded-full border border-emerald-500/50">
                  <Building2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>TOTAG Enterprise Digital Ecosystem</span>
                    <Badge className="bg-emerald-500 text-slate-950 font-black text-[11px] px-2.5 py-0.5">
                      9 Subsidiaries Live
                    </Badge>
                  </h1>
                  <p className="text-xs text-slate-300 font-semibold">Master Governance, Shared Core Capabilities & Subsidiary Operations Console</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/executive-dashboard">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg">
                  <BarChart3 className="h-4 w-4 mr-1.5" />
                  Executive Control Tower
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-slate-800 border-slate-700 text-slate-200 font-bold hover:bg-slate-700">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* High Contrast Navigation Tabs Bar */}
          <TabsList className="grid w-full grid-cols-5 bg-slate-900 p-1.5 border-2 border-slate-800 rounded-2xl mb-8 shadow-2xl">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="shared-core" 
              className="flex items-center gap-2 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Database className="h-4 w-4" />
              11 Shared Enterprise Core
            </TabsTrigger>
            <TabsTrigger 
              value="subsidiaries" 
              className="flex items-center gap-2 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Building2 className="h-4 w-4" />
              9 Subsidiaries Console
            </TabsTrigger>
            <TabsTrigger 
              value="institutional" 
              className="flex items-center gap-2 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <FileCheck className="h-4 w-4" />
              Institutional Services
            </TabsTrigger>
            <TabsTrigger 
              value="communications" 
              className="flex items-center gap-2 text-xs font-black py-3 rounded-xl text-slate-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Mail className="h-4 w-4" />
              Communications
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            
            {/* Top-level High-Contrast KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-2 shadow-xl">
                <div className="flex justify-between items-center text-xs text-slate-300 font-extrabold uppercase tracking-wider">
                  <span>Operational Subsidiaries</span>
                  <Building2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-4xl font-black text-white">9</div>
                <div className="text-xs text-emerald-400 font-bold">100% Fully Productized</div>
              </div>

              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-2 shadow-xl">
                <div className="flex justify-between items-center text-xs text-slate-300 font-extrabold uppercase tracking-wider">
                  <span>Shared Core Capabilities</span>
                  <Database className="h-5 w-5 text-sky-400" />
                </div>
                <div className="text-4xl font-black text-white">11</div>
                <div className="text-xs text-sky-400 font-bold">Identity, CRM, FIMS, HRMIS, Event Bus</div>
              </div>

              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-2 shadow-xl">
                <div className="flex justify-between items-center text-xs text-slate-300 font-extrabold uppercase tracking-wider">
                  <span>Group Annualized Revenue</span>
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <div className="text-4xl font-black text-white">$1.42M <span className="text-xs font-normal text-slate-400">USD</span></div>
                <div className="text-xs text-purple-400 font-bold">+18.5% YoY Growth</div>
              </div>

              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-2 shadow-xl">
                <div className="flex justify-between items-center text-xs text-slate-300 font-extrabold uppercase tracking-wider">
                  <span>Total Group Workforce</span>
                  <Users className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-4xl font-black text-white">280+</div>
                <div className="text-xs text-amber-400 font-bold">Across all 9 business divisions</div>
              </div>
            </div>

            {/* Architecture Concept Map - Ultra High Contrast */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Layers className="h-6 w-6 text-emerald-400" />
                  <span>TOTAG Group Digital Ecosystem Conceptual Architecture</span>
                </h2>
                <p className="text-sm text-slate-300 font-semibold mt-1">
                  Public corporate website serves as the front door (`totag.network`). Behind it, 9 operational subsidiary applications consume shared enterprise digital core capabilities.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-5 shadow-inner">
                
                {/* Corporate Front Door Banner */}
                <div className="text-center p-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 border-2 border-emerald-400 text-white font-black text-base shadow-lg tracking-wide">
                  TOTAG GROUP PUBLIC CORPORATE FRONT DOOR (`totag.network`)
                </div>

                {/* 8 Core Capabilities Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sharedEnterpriseServices.slice(0, 8).map((srv, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border-2 border-slate-800 space-y-1 hover:border-emerald-500 transition-all">
                      <span className="font-extrabold text-white text-sm block">{srv.name}</span>
                      <span className="text-xs text-slate-300 font-medium block leading-tight">{srv.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Enterprise Event Bus Banner */}
                <div className="text-center text-xs font-black text-emerald-400 uppercase tracking-widest py-2 bg-slate-900 rounded-xl border border-emerald-500/40">
                  ↓ ENTERPRISE EVENT BUS & SHARED MASTER DATA (`partyMaster`, `vendorMaster`, FIMS, HRMIS) ↓
                </div>

                {/* 9 Subsidiaries Grid */}
                <div className="grid grid-cols-3 md:grid-cols-9 gap-2.5">
                  {subsidiaries.map((sub) => (
                    <Link key={sub.id} href={sub.href}>
                      <div className="p-3 rounded-xl bg-slate-900 border-2 border-slate-800 hover:border-emerald-400 hover:bg-slate-800 cursor-pointer transition-all text-center">
                        <sub.icon className={`w-5 h-5 mx-auto mb-1.5 ${sub.color}`} />
                        <span className="font-extrabold text-white text-xs block truncate">{sub.name.replace("TOTAG ", "")}</span>
                      </div>
                    </Link>
                  ))}
                </div>

              </div>
            </div>

          </TabsContent>

          {/* 11 Shared Core Capabilities Tab */}
          <TabsContent value="shared-core" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-black text-white">11 Shared Enterprise Core Services</h2>
              <p className="text-sm text-slate-300 font-semibold mt-1">Common enterprise services consumed by all 9 operational subsidiary applications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sharedEnterpriseServices.map((service, i) => (
                <div key={i} className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500 transition-all shadow-xl">
                  <div className="flex justify-between items-center">
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <Badge className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-0.5">
                      {service.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{service.name}</h3>
                    <p className="text-xs text-slate-300 font-medium mt-1">{service.desc}</p>
                  </div>

                  <Link href={service.route}>
                    <Button size="sm" className="w-full bg-slate-800 hover:bg-emerald-600 border border-slate-700 text-white font-bold text-xs py-5">
                      Access Capability
                      <ArrowUpRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 9 Subsidiaries Operational Console Tab */}
          <TabsContent value="subsidiaries" className="space-y-6">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white">9 Specialized Subsidiary Applications Console</h2>
                <p className="text-sm text-slate-300 font-semibold mt-1">Operational status, telemetry metrics, and direct application portals for each business division.</p>
              </div>
              <Badge className="bg-emerald-500 text-slate-950 font-black text-sm px-3.5 py-1">
                9 / 9 Operational
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subsidiaries.map((sub) => (
                <div key={sub.id} className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500 transition-all shadow-xl">
                  <div className="flex justify-between items-center">
                    <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700">
                      <sub.icon className={`w-7 h-7 ${sub.color}`} />
                    </div>
                    <Badge className="bg-emerald-500 text-slate-950 font-black text-xs">
                      {sub.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{sub.name}</h3>
                    <p className="text-xs text-slate-300 font-semibold mt-0.5">{sub.email}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-bold">Operational Status:</span>
                      <span className="text-emerald-400 font-black">100% Online</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-bold">Enterprise Integration:</span>
                      <span className="text-sky-400 font-black">FIMS / HRMIS Linked</span>
                    </div>
                  </div>

                  <Link href={sub.href}>
                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-5 shadow-lg">
                      Launch Application Portal
                      <ArrowUpRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Institutional Services Tab */}
          <TabsContent value="institutional" className="space-y-6">
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Institutional Services & Multi-Agency Contract Operations</h2>
                  <p className="text-xs text-slate-300 font-semibold mt-1">Governance and milestone delivery for UNDP, World Bank, and Ministry contracts.</p>
                </div>
                <Link href="/institutional-services">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs">
                    Open Institutional Console
                    <ArrowUpRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-black text-emerald-400">INC-2026-081 • Active Execution</span>
                    <h3 className="text-base font-black text-white mt-1">United Nations Development Programme (UNDP)</h3>
                    <p className="text-xs text-slate-300 font-medium">Rural Agribusiness & Renewable Energy Microgrid Turnkey Execution</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400">$450,000 USD</span>
                    <span className="text-xs text-slate-300 font-bold block">68% Completed</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-black text-amber-400">INC-2026-094 • Milestone Audit</span>
                    <h3 className="text-base font-black text-white mt-1">Ministry of Public Works / World Bank LR</h3>
                    <p className="text-xs text-slate-300 font-medium">Feeder Road Rehabilitation & Drainage Quality Control Supervision</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400">$780,000 USD</span>
                    <span className="text-xs text-slate-300 font-bold block">52% Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">Corporate Notification & Messaging Console</h2>
            </div>

            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
              <p className="text-xs text-slate-300 font-semibold">Corporate email dispatch and history logs across all 9 TOTAG subsidiaries.</p>
              {emails.length === 0 ? (
                <div className="text-center py-10">
                  <Mail className="h-14 w-14 mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-300 font-bold text-base">Notification system ready for corporate communications dispatch.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {emails.map((email) => (
                    <div key={email.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-black text-white">{email.subject}</h4>
                        <p className="text-xs text-slate-300 font-medium">To: {email.toEmail} | From: {email.fromEmail}</p>
                      </div>
                      <Badge className="bg-emerald-500 text-slate-950 font-black text-xs">
                        {email.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}