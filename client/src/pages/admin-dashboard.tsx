import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
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
  FileSpreadsheet,
  ExternalLink,
  Crown,
  KeyRound,
  Edit,
  Trash2
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
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // 9 Operational Subsidiaries with DIRECT ADMIN / OPERATIONS DASHBOARD ROUTES
  const subsidiaries = [
    { 
      id: "farm", 
      name: "TOTAG FARM ERP & Management", 
      desc: "Full CRUD: Crop cycles, livestock batches, farm inventory & sales", 
      email: "farm@totaggroup.com", 
      adminRoute: "/farm/dashboard", 
      icon: Zap, 
      color: "text-emerald-600 dark:text-emerald-400", 
      bg: "bg-emerald-500/10", 
      border: "border-emerald-500/30",
      badge: "Farm Admin Console"
    },
    { 
      id: "catering", 
      name: "TOCEPS Catering Operations & UNIDO", 
      desc: "Full CRUD: UNIDO deliverables, banquet invoices, contracts & menus", 
      email: "toceps@totaggroup.com", 
      adminRoute: "/catering/ops/dashboard", 
      icon: Utensils, 
      color: "text-rose-600 dark:text-rose-400", 
      bg: "bg-rose-500/10", 
      border: "border-rose-500/30",
      badge: "Catering Ops Console"
    },
    { 
      id: "it", 
      name: "IT Services & 14 SaaS Modules", 
      desc: "Full CRUD: FIMS financial ledger, HRMIS, multi-tenant DB & access", 
      email: "tis@totaggroup.com", 
      adminRoute: "/saas/dashboard", 
      icon: Laptop, 
      color: "text-blue-600 dark:text-blue-400", 
      bg: "bg-blue-500/10", 
      border: "border-blue-500/30",
      badge: "SaaS Admin Console"
    },
    { 
      id: "merchandise", 
      name: "General Merchandise (TGM)", 
      desc: "Full CRUD: FMCG inventory, wholesale purchase orders & POS catalog", 
      email: "merchandise@totaggroup.com", 
      adminRoute: "/tgm-enterprise-dashboard", 
      icon: ShoppingBag, 
      color: "text-purple-600 dark:text-purple-400", 
      bg: "bg-purple-500/10", 
      border: "border-purple-500/30",
      badge: "TGM Ops Console"
    },
    { 
      id: "cargo", 
      name: "Cargo Handling & Global Freight", 
      desc: "Full CRUD: Port logistics, sea/air manifests & real-time tracking", 
      email: "cargo@totaggroup.com", 
      adminRoute: "/cargo", 
      icon: Ship, 
      color: "text-sky-600 dark:text-sky-400", 
      bg: "bg-sky-500/10", 
      border: "border-sky-500/30",
      badge: "Logistics Dispatch"
    },
    { 
      id: "solar", 
      name: "Solar Smart Power & Deye Systems", 
      desc: "Full CRUD: Deye hybrid telemetry, microgrid status & NOC telemetry", 
      email: "solar@totaggroup.com", 
      adminRoute: "/solar", 
      icon: Sun, 
      color: "text-amber-500 dark:text-amber-300", 
      bg: "bg-amber-500/10", 
      border: "border-amber-500/30",
      badge: "Solar NOC Console"
    },
    { 
      id: "petroleum", 
      name: "Petroleum Services & Depot Haulage", 
      desc: "Full CRUD: Bulk fuel depots, commercial haulage & distribution", 
      email: "petroleum@totaggroup.com", 
      adminRoute: "/petroleum", 
      icon: Fuel, 
      color: "text-amber-600 dark:text-amber-400", 
      bg: "bg-amber-500/10", 
      border: "border-amber-500/30",
      badge: "Petroleum Ops"
    },
    { 
      id: "construction", 
      name: "General Civil Construction", 
      desc: "Full CRUD: Structural projects, civil engineering & contractor ops", 
      email: "construction@totaggroup.com", 
      adminRoute: "/construction", 
      icon: HardHat, 
      color: "text-orange-600 dark:text-orange-400", 
      bg: "bg-orange-500/10", 
      border: "border-orange-500/30",
      badge: "Construction Ops"
    },
    { 
      id: "stationery", 
      name: "Stationery & Office Supplies", 
      desc: "Full CRUD: B2B scholastic supplies, procurement & bulk paper orders", 
      email: "stationery@totaggroup.com", 
      adminRoute: "/stationery", 
      icon: BookOpen, 
      color: "text-teal-600 dark:text-teal-400", 
      bg: "bg-teal-500/10", 
      border: "border-teal-500/30",
      badge: "Procurement Ops"
    }
  ];

  // The 11 Shared Core Enterprise Capabilities with DIRECT SYSTEM ROUTES
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
      const defaultAdmin = { 
        username: "totag_master_admin", 
        role: "Corporate Super-Administrator", 
        department: "Executive Board",
        permissions: ["ALL_READ", "ALL_WRITE", "ALL_DELETE", "ALL_CONFIG"]
      };
      localStorage.setItem("totagAdmin", JSON.stringify(defaultAdmin));
      setUser(defaultAdmin);
      setLoading(false);
      return;
    }
    
    try {
      const parsedUser = JSON.parse(adminData);
      setUser(parsedUser);
    } catch (error) {
      setUser({ username: "totag_master_admin", role: "Corporate Super-Administrator", department: "Executive Board" });
    } finally {
      setLoading(false);
    }
  };

  // Master SSO Redirector: Automatically equips super-admin credentials and routes directly into subsidiary admin console
  const launchSubsidiaryAdmin = (adminRoute: string, name: string) => {
    // Equip universal super-admin credentials across all sub-systems
    localStorage.setItem("farm_user", JSON.stringify({ role: "admin", name: "Corporate Master Super-Admin", username: "master_admin" }));
    localStorage.setItem("catering_user", JSON.stringify({ id: 1, name: "Corporate Super-Admin", role: "operations_supervisor", email: "info@totaggroup.com" }));
    localStorage.setItem("catering_token", "corp_super_admin_master_token");
    localStorage.setItem("tgm_user", JSON.stringify({ role: "admin", email: "info@totaggroup.com", name: "Corporate Master Super-Admin" }));
    localStorage.setItem("saas_user", JSON.stringify({ id: "1", role: "super_admin", email: "info@totaggroup.com" }));

    toast({
      title: `Launching ${name} Admin Console`,
      description: "Redirecting with Master Super-Admin CRUD privileges...",
      duration: 1500
    });

    setTimeout(() => {
      setLocation(adminRoute);
    }, 200);
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
    localStorage.removeItem("farm_user");
    localStorage.removeItem("catering_user");
    localStorage.removeItem("catering_token");
    localStorage.removeItem("tgm_user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white pb-16">
      
      {/* Top Corporate Executive Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="rounded-xl border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Public Website
                </Button>
              </Link>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-1 flex items-center justify-center">
                  <img src="/images/totag-logo.png" alt="TOTAG Logo" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight flex items-center gap-2">
                    <span>TOTAG Corporate Master Governance</span>
                    <Badge className="bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black text-[10px] px-2 py-0.5 flex items-center gap-1 shadow-sm">
                      <Crown className="w-3 h-3 text-slate-950" />
                      Super-Admin Master Mode
                    </Badge>
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Universal Edit, Update & Delete Authority Across All 9 Subsidiaries</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/executive-dashboard">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md text-xs">
                  <BarChart3 className="h-4 w-4 mr-1.5" />
                  Executive Control Tower
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl border-slate-300 dark:border-slate-700 text-xs font-semibold">
                Logout
              </Button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        
        {/* Super-Admin Privileges Alert Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                Corporate Master Administrator Mode Active
              </span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Click any subsidiary card below to be redirected directly to its internal Administrative Back-Office with full CRUD (Create, Read, Update, Delete) permissions.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge className="bg-emerald-600 text-white font-bold text-[10px]">Universal SSO Active</Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          
          {/* Responsive Navigation Tabs Bar */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-white dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800 rounded-2xl mb-8 shadow-sm h-auto gap-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white shadow-none data-[state=active]:shadow-md"
            >
              <BarChart3 className="h-4 w-4" />
              Overview & Admin Launchers
            </TabsTrigger>
            <TabsTrigger 
              value="subsidiaries" 
              className="flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white shadow-none data-[state=active]:shadow-md"
            >
              <Building2 className="h-4 w-4" />
              9 Subsidiary Admin Portals
            </TabsTrigger>
            <TabsTrigger 
              value="shared-core" 
              className="flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white shadow-none data-[state=active]:shadow-md"
            >
              <Database className="h-4 w-4" />
              11 Core SaaS Services
            </TabsTrigger>
            <TabsTrigger 
              value="institutional" 
              className="flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white shadow-none data-[state=active]:shadow-md"
            >
              <FileCheck className="h-4 w-4" />
              Institutional Ops
            </TabsTrigger>
            <TabsTrigger 
              value="communications" 
              className="flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white shadow-none data-[state=active]:shadow-md col-span-2 sm:col-span-1"
            >
              <Mail className="h-4 w-4" />
              Communications
            </TabsTrigger>
          </TabsList>

          {/* ===================== OVERVIEW TAB ===================== */}
          <TabsContent value="overview" className="space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
                <CardContent className="p-5 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <span>Subsidiary Admin Consoles</span>
                    <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">9</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">100% Direct Admin Access</div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
                <CardContent className="p-5 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <span>SaaS Modules</span>
                    <Database className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">14</div>
                  <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold">FIMS & HRMIS Enterprise Suite</div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
                <CardContent className="p-5 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <span>Annual Revenue</span>
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">$1.42M <span className="text-xs font-normal text-slate-400">USD</span></div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">+18.5% YoY Growth</div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
                <CardContent className="p-5 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <span>Master Permissions</span>
                    <Crown className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-black text-amber-500">ROOT</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Full Read / Write / Delete</div>
                </CardContent>
              </Card>
            </div>

            {/* DIRECT SUBSIDIARY ADMIN DASHBOARDS LAUNCHPAD */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-transparent border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-500" />
                      9 Subsidiary Administrative Back-Offices
                    </CardTitle>
                    <CardDescription className="text-xs font-medium">
                      Click any subsidiary card to open its internal management dashboard with automatic Super-Admin write, edit, and delete permissions.
                    </CardDescription>
                  </div>
                  <Badge className="bg-amber-500 text-slate-950 font-black text-xs">
                    Admin SSO Ready
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subsidiaries.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => launchSubsidiaryAdmin(sub.adminRoute, sub.name)}
                      className={`p-4 rounded-2xl border ${sub.border} ${sub.bg} hover:shadow-lg hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-white/10 shrink-0">
                          <sub.icon className={`w-6 h-6 ${sub.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
                              {sub.name}
                            </h4>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                            {sub.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-white/60 dark:bg-slate-900/60 font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                          {sub.badge}
                        </span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-1">
                          Open Admin Console ➔
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 11 Shared Core Capabilities Interactive Grid */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 pb-4">
                <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                  <Database className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  11 Shared Enterprise Core Capabilities
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  Direct management consoles for cross-subsidiary enterprise systems.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {sharedEnterpriseServices.map((srv, idx) => (
                    <Link key={idx} href={srv.route}>
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors">
                              <srv.icon className="w-4 h-4" />
                            </div>
                            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold">
                              {srv.status}
                            </Badge>
                          </div>
                          <h5 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                            {srv.name}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                            {srv.desc}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <span>Launch System</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* ===================== SUBSIDIARIES TAB ===================== */}
          <TabsContent value="subsidiaries" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subsidiaries.map((sub) => (
                <Card key={sub.id} className="border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${sub.bg} border ${sub.border}`}>
                        <sub.icon className={`w-6 h-6 ${sub.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base font-extrabold">{sub.name}</CardTitle>
                        <CardDescription className="text-xs">{sub.badge}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {sub.desc}
                    </p>
                    <Button 
                      onClick={() => launchSubsidiaryAdmin(sub.adminRoute, sub.name)}
                      className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      <span>Open Admin Back-Office (Full CRUD) ➔</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ===================== 11 SHARED CORE TAB ===================== */}
          <TabsContent value="shared-core" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sharedEnterpriseServices.map((srv, idx) => (
                <Card key={idx} className="border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <srv.icon className="w-5 h-5" />
                    </div>
                    <Badge className="bg-emerald-600 text-white text-xs">{srv.status}</Badge>
                  </div>
                  <h4 className="font-extrabold text-sm">{srv.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{srv.desc}</p>
                  <Link href={srv.route}>
                    <Button variant="outline" size="sm" className="w-full rounded-xl mt-2 text-xs font-bold border-slate-300 dark:border-slate-700">
                      Launch System
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ===================== INSTITUTIONAL SERVICES TAB ===================== */}
          <TabsContent value="institutional" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <CardTitle className="text-lg font-extrabold mb-2">Institutional Operations & UNIDO Deliverables</CardTitle>
              <CardDescription className="text-xs mb-4">Centralized management for public sector and multilateral development contracts.</CardDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => launchSubsidiaryAdmin("/catering/ops/dashboard", "TOCEPS UNIDO")}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition-colors"
                >
                  <h5 className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">TOCEPS UNIDO Contract Admin Portal</h5>
                  <p className="text-xs text-slate-500 mt-1">Live document vault, milestone trackers, and invoice generator with Super-Admin edit rights.</p>
                </div>
                <Link href="/executive-dashboard">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition-colors">
                    <h5 className="font-extrabold text-sm text-sky-600 dark:text-sky-400">Executive Governance Tower</h5>
                    <p className="text-xs text-slate-500 mt-1">Multi-subsidiary KPI aggregation and telemetry control.</p>
                  </div>
                </Link>
              </div>
            </Card>
          </TabsContent>

          {/* ===================== COMMUNICATIONS TAB ===================== */}
          <TabsContent value="communications" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-lg font-extrabold">Corporate Email & Communications</CardTitle>
                  <CardDescription className="text-xs">Manage outbound corporate email notifications and transactional logs.</CardDescription>
                </div>
                <Link href="/email-management">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold">
                    Open Full Email Center ➔
                  </Button>
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                Active Mailboxes: Corporate (`info@totaggroup.com`), IT (`tis@totaggroup.com`), and Catering (`toceps@totaggroup.com`).
              </div>
            </Card>
          </TabsContent>

        </Tabs>

      </main>
    </div>
  );
}
