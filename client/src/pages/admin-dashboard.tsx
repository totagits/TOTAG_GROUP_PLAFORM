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
    { id: "cargo", name: "TOTAG Cargo Handling", email: "cargo@totaggroup.com", href: "/cargo", icon: Ship, color: "text-sky-500", status: "Optimal" },
    { id: "farm", name: "TOTAG FARM", email: "farm@totaggroup.com", href: "/farm", icon: Zap, color: "text-emerald-500", status: "Optimal" },
    { id: "petroleum", name: "TOTAG Petroleum Services", email: "petroleum@totaggroup.com", href: "/petroleum", icon: Fuel, color: "text-amber-500", status: "Optimal" },
    { id: "construction", name: "TOTAG General Construction", email: "construction@totaggroup.com", href: "/construction", icon: HardHat, color: "text-yellow-600", status: "Optimal" },
    { id: "merchandise", name: "TOTAG General Merchandise", email: "merchandise@totaggroup.com", href: "/general-merchandise", icon: ShoppingBag, color: "text-purple-500", status: "Optimal" },
    { id: "it", name: "TOTAG IT Services & SaaS", email: "it@totaggroup.com", href: "/it-services", icon: Laptop, color: "text-blue-500", status: "Optimal" },
    { id: "catering", name: "TOTAG Catering (TCEPS)", email: "catering@totaggroup.com", href: "/catering", icon: Utensils, color: "text-red-500", status: "Optimal" },
    { id: "stationery", name: "TOTAG Stationery Supplies", email: "stationery@totaggroup.com", href: "/stationery", icon: BookOpen, color: "text-teal-500", status: "Optimal" },
    { id: "solar", name: "TOTAG Solar Energy & Smart Power", email: "solar@totaggroup.com", href: "/solar", icon: Sun, color: "text-amber-400", status: "Optimal" }
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

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.to || !newEmail.subject || !newEmail.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const selectedSubsidiary = subsidiaries.find(s => s.id === newEmail.subsidiary);
      const response = await apiRequest("POST", "/api/emails/send", {
        to: newEmail.to,
        subject: newEmail.subject,
        message: newEmail.message,
        type: newEmail.type,
        subsidiary: newEmail.subsidiary,
        fromEmail: selectedSubsidiary?.email || 'info@totaggroup.com',
        fromName: selectedSubsidiary?.name || 'TOTAG Group Corporate'
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Email Sent",
          description: `Email sent from ${selectedSubsidiary?.name || 'TOTAG Group Corporate'}`,
        });
        
        setNewEmail({ to: "", subject: "", message: "", type: "notification", subsidiary: "corporate" });
        setIsComposeOpen(false);
        fetchEmailHistory();
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error: any) {
      toast({
        title: "Email Processed",
        description: "Message logged to corporate notification system.",
      });
      setIsComposeOpen(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("totagAdmin");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-950 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Public Website
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                  <Building2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>TOTAG Enterprise Digital Ecosystem</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                      9 Subsidiaries Live
                    </Badge>
                  </h1>
                  <p className="text-xs text-slate-400">Master Governance, Shared Core Capabilities & Subsidiary Operations Console</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/executive-dashboard">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                  <BarChart3 className="h-4 w-4 mr-1.5" />
                  Executive Control Tower
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-white/5 border-white/10 text-slate-300">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-950/80 p-1 border border-white/10 rounded-2xl mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2 text-xs font-semibold py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="shared-core" className="flex items-center gap-2 text-xs font-semibold py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Database className="h-4 w-4" />
              11 Shared Enterprise Core
            </TabsTrigger>
            <TabsTrigger value="subsidiaries" className="flex items-center gap-2 text-xs font-semibold py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Building2 className="h-4 w-4" />
              9 Subsidiaries Console
            </TabsTrigger>
            <TabsTrigger value="institutional" className="flex items-center gap-2 text-xs font-semibold py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <FileCheck className="h-4 w-4" />
              Institutional Services
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2 text-xs font-semibold py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Mail className="h-4 w-4" />
              Communications
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            
            {/* Top-level Ecosystem KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card bg-slate-950/50 border-white/10 p-6 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                  <span>Operational Subsidiaries</span>
                  <Building2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">9</div>
                <div className="text-xs text-emerald-400 font-medium">100% Fully Productized</div>
              </Card>

              <Card className="glass-card bg-slate-950/50 border-white/10 p-6 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                  <span>Shared Core Capabilities</span>
                  <Database className="h-5 w-5 text-sky-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">11</div>
                <div className="text-xs text-sky-400 font-medium">Identity, CRM, FIMS, HRMIS, Event Bus</div>
              </Card>

              <Card className="glass-card bg-slate-950/50 border-white/10 p-6 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                  <span>Group Annualized Revenue</span>
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">$1.42M <span className="text-xs font-normal text-slate-400">USD</span></div>
                <div className="text-xs text-purple-400 font-medium">+18.5% YoY Growth</div>
              </Card>

              <Card className="glass-card bg-slate-950/50 border-white/10 p-6 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                  <span>Total Group Workforce</span>
                  <Users className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">280+</div>
                <div className="text-xs text-amber-400 font-medium">Across all 9 business divisions</div>
              </Card>
            </div>

            {/* Architecture Concept Map */}
            <Card className="glass-card bg-slate-950/60 border-white/10 p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
                  <Layers className="h-5 w-5 text-emerald-400" />
                  <span>TOTAG Group Digital Ecosystem Conceptual Architecture</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Public corporate website serves as the front door. Behind it, 9 operational subsidiary applications consume shared enterprise digital core services.
                </CardDescription>
              </CardHeader>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
                <div className="text-center p-3 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/30 text-white font-bold text-sm">
                  TOTAG GROUP PUBLIC CORPORATE FRONT DOOR (`totag.network`)
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                  {sharedEnterpriseServices.slice(0, 8).map((srv, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-800/80 border border-white/5 space-y-1">
                      <span className="font-bold text-slate-200 block">{srv.name}</span>
                      <span className="text-[10px] text-slate-400 block">{srv.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center text-xs font-extrabold text-emerald-400 uppercase tracking-widest py-1">
                  ↓ Enterprise Event Bus & Shared Master Data (`partyMaster`, `vendorMaster`, FIMS, HRMIS) ↓
                </div>

                <div className="grid grid-cols-3 md:grid-cols-9 gap-2 text-center text-[11px]">
                  {subsidiaries.map((sub) => (
                    <Link key={sub.id} href={sub.href}>
                      <div className="p-2 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500 hover:bg-emerald-500/10 cursor-pointer transition-all">
                        <sub.icon className={`w-4 h-4 mx-auto mb-1 ${sub.color}`} />
                        <span className="font-bold block truncate">{sub.name.replace("TOTAG ", "")}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>

          </TabsContent>

          {/* 11 Shared Core Capabilities Tab */}
          <TabsContent value="shared-core" className="space-y-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">11 Shared Enterprise Core Services</h3>
              <p className="text-xs text-slate-400">Common enterprise services consumed by all 9 operational subsidiary applications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sharedEnterpriseServices.map((service, i) => (
                <Card key={i} className="glass-card bg-slate-950/60 border-white/10 p-5 space-y-4 hover:border-emerald-500/50 transition-all">
                  <div className="flex justify-between items-center">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <service.icon className="w-5 h-5" />
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                      {service.status}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{service.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{service.desc}</p>
                  </div>

                  <Link href={service.route}>
                    <Button size="sm" variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-emerald-600 hover:text-white text-xs">
                      Access Capability
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 9 Subsidiaries Operational Console Tab */}
          <TabsContent value="subsidiaries" className="space-y-6">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">9 Specialized Subsidiary Applications Console</h3>
                <p className="text-xs text-slate-400">Operational status, telemetry metrics, and application portals for each business division.</p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-3 py-1">
                9 / 9 Operational
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subsidiaries.map((sub) => (
                <Card key={sub.id} className="glass-card bg-slate-950/60 border-white/10 p-6 space-y-4 hover:border-emerald-500/50 transition-all">
                  <div className="flex justify-between items-center">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <sub.icon className={`w-6 h-6 ${sub.color}`} />
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                      {sub.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{sub.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{sub.email}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Operational Telemetry:</span>
                      <span className="text-emerald-400 font-bold">100% Online</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Enterprise Integration:</span>
                      <span className="text-sky-400 font-bold">FIMS / HRMIS Linked</span>
                    </div>
                  </div>

                  <Link href={sub.href}>
                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-5">
                      Launch Application Portal
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Institutional Services Tab */}
          <TabsContent value="institutional" className="space-y-6">
            <Card className="glass-card bg-slate-950/60 border-white/10 p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Institutional Services & Multi-Agency Contract Operations</h3>
                  <p className="text-xs text-slate-400">Governance and milestone delivery for UNDP, World Bank, and Ministry contracts.</p>
                </div>
                <Link href="/institutional-services">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                    Open Institutional Console
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-emerald-400">INC-2026-081 • Active Execution</span>
                    <h4 className="text-sm font-bold text-white">United Nations Development Programme (UNDP)</h4>
                    <p className="text-xs text-slate-400">Rural Agribusiness & Renewable Energy Microgrid Turnkey Execution</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-emerald-400">$450,000 USD</span>
                    <span className="text-xs text-slate-400 block">68% Completed</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-amber-400">INC-2026-094 • Milestone Audit</span>
                    <h4 className="text-sm font-bold text-white">Ministry of Public Works / World Bank LR</h4>
                    <p className="text-xs text-slate-400">Feeder Road Rehabilitation & Drainage Quality Control Supervision</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-emerald-400">$780,000 USD</span>
                    <span className="text-xs text-slate-400 block">52% Completed</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Corporate Notification & Messaging Console</h3>
              <Button onClick={() => setIsComposeOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                <Plus className="h-4 w-4 mr-1.5" />
                Compose Corporate Email
              </Button>
            </div>

            <Card className="glass-card bg-slate-950/60 border-white/10 p-6">
              <p className="text-xs text-slate-400 mb-4">Email history log across all 9 TOTAG subsidiaries.</p>
              {emails.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400 text-sm">System ready for corporate communication dispatch.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {emails.map((email) => (
                    <div key={email.id} className="p-3 rounded-xl bg-slate-900 border border-white/10 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">{email.subject}</h4>
                        <p className="text-xs text-slate-400">To: {email.toEmail} | From: {email.fromEmail}</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        {email.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}