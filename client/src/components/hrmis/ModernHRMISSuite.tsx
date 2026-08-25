import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Building2,
  FileText,
  DollarSign,
  Award,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Shield,
  Smartphone,
  Sparkles,
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  Target,
  HeartHandshake,
  CheckSquare,
  AlertTriangle,
  UserCheck,
  Zap,
  Printer,
  ChevronRight,
  Filter,
  Check,
  Send,
  FileCheck,
  Share2,
  Cpu,
  Laptop
} from "lucide-react";

// ==================== INTERFACES & SAMPLE SEED DATA ====================
export interface EmployeeRecord {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  employmentType: "Full-Time" | "Contract" | "Probationary" | "Part-Time";
  status: "Active" | "On Leave" | "Probation" | "Terminated";
  joinDate: string;
  baseSalaryUsd: number;
  manager: string;
  location: string;
  nationalId: string;
  nasscorpNumber: string;
  flightRisk: "Low" | "Medium" | "High";
  performanceScore: number; // 1-100
  attendanceRate: number; // 0-100%
  skills: string[];
  mobileSalaryCarrier: "Orange Money" | "Lonestar MTN MoMo" | "Direct Bank (Ecobank)";
  mobileSalaryNumber: string;
  mobileSalarySplit: "100% USD" | "50% USD / 50% LRD" | "100% LRD";
  mobileKycStatus: "Verified" | "Pending";
  lastMobilePayoutTx?: string;
}

const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: "EMP-001",
    employeeCode: "TOT-HR-101",
    firstName: "Emmanuel",
    lastName: "Doe",
    email: "e.doe@totaggroup.com",
    phone: "+231-777-666-101",
    department: "Executive & Operations",
    role: "Head of Operations",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2023-01-15",
    baseSalaryUsd: 2800,
    manager: "Executive Board",
    location: "Monrovia HQ",
    nationalId: "LR-984412-23",
    nasscorpNumber: "NASS-664401",
    flightRisk: "Low",
    performanceScore: 94,
    attendanceRate: 98,
    skills: ["Strategic Planning", "Supply Chain", "Budgeting", "Team Leadership"],
    mobileSalaryCarrier: "Orange Money",
    mobileSalaryNumber: "+231-777-666-999",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "ORANGE-SAL-2026-981"
  },
  {
    id: "EMP-002",
    employeeCode: "TOT-IT-204",
    firstName: "Martha",
    lastName: "Weah",
    email: "m.weah@totaggroup.com",
    phone: "+231-777-666-102",
    department: "Managed IT & SaaS",
    role: "Senior Cloud Architect",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2023-06-01",
    baseSalaryUsd: 2400,
    manager: "Emmanuel Doe",
    location: "Technology Center, Sinkor",
    nationalId: "LR-882310-91",
    nasscorpNumber: "NASS-664402",
    flightRisk: "Low",
    performanceScore: 96,
    attendanceRate: 99,
    skills: ["PostgreSQL", "Cloud Infrastructure", "Kubernetes", "Node.js"],
    mobileSalaryCarrier: "Orange Money",
    mobileSalaryNumber: "+231-777-666-102",
    mobileSalarySplit: "50% USD / 50% LRD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "ORANGE-SAL-2026-982"
  },
  {
    id: "EMP-003",
    employeeCode: "TOT-FIN-305",
    firstName: "James",
    lastName: "Kollie",
    email: "j.kollie@totaggroup.com",
    phone: "+231-887-666-103",
    department: "Finance & Accounting",
    role: "Financial Controller",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2022-11-10",
    baseSalaryUsd: 2200,
    manager: "Emmanuel Doe",
    location: "Monrovia HQ",
    nationalId: "LR-773412-44",
    nasscorpNumber: "NASS-664403",
    flightRisk: "Medium",
    performanceScore: 89,
    attendanceRate: 95,
    skills: ["IFRS Accounting", "Tax Compliance", "Payroll Auditing", "Risk Analysis"],
    mobileSalaryCarrier: "Lonestar MTN MoMo",
    mobileSalaryNumber: "+231-887-666-999",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "MTN-MOMO-2026-441"
  },
  {
    id: "EMP-004",
    employeeCode: "TOT-CAT-408",
    firstName: "Patience",
    lastName: "Johnson",
    email: "p.johnson@totaggroup.com",
    phone: "+231-777-666-104",
    department: "TOCEPS Catering",
    role: "Quality & Food Safety Manager",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2024-02-01",
    baseSalaryUsd: 1600,
    manager: "Emmanuel Doe",
    location: "TOCEPS Kitchen, Sinkor",
    nationalId: "LR-665123-12",
    nasscorpNumber: "NASS-664404",
    flightRisk: "Low",
    performanceScore: 92,
    attendanceRate: 97,
    skills: ["HACCP Standards", "Hygiene Auditing", "Vendor Logistics", "Menu Planning"],
    mobileSalaryCarrier: "Orange Money",
    mobileSalaryNumber: "+231-777-666-104",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "ORANGE-SAL-2026-984"
  },
  {
    id: "EMP-005",
    employeeCode: "TOT-FARM-512",
    firstName: "Samuel",
    lastName: "Flomo",
    email: "s.flomo@totaggroup.com",
    phone: "+231-887-666-105",
    department: "TOTAG Farm & Agribusiness",
    role: "Agronomy Field Supervisor",
    employmentType: "Full-Time",
    status: "On Leave",
    joinDate: "2023-08-15",
    baseSalaryUsd: 1450,
    manager: "Emmanuel Doe",
    location: "Grand Gedeh Hub",
    nationalId: "LR-554129-87",
    nasscorpNumber: "NASS-664405",
    flightRisk: "High",
    performanceScore: 82,
    attendanceRate: 91,
    skills: ["Mechanized Tillage", "Irrigation Systems", "Drone Crop Extension", "Crop Off-Take"],
    mobileSalaryCarrier: "Lonestar MTN MoMo",
    mobileSalaryNumber: "+231-887-666-105",
    mobileSalarySplit: "50% USD / 50% LRD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "MTN-MOMO-2026-445"
  },
  {
    id: "EMP-006",
    employeeCode: "TOT-LOG-619",
    firstName: "Grace",
    lastName: "Gbowee",
    email: "g.gbowee@totaggroup.com",
    phone: "+231-777-666-106",
    department: "Cargo & Logistics",
    role: "Customs Clearance Officer",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2024-04-10",
    baseSalaryUsd: 1550,
    manager: "James Kollie",
    location: "Freeport of Monrovia",
    nationalId: "LR-443190-33",
    nasscorpNumber: "NASS-664406",
    flightRisk: "Low",
    performanceScore: 91,
    attendanceRate: 96,
    skills: ["ASYCUDA", "Freight Forwarding", "Tariff Classification", "Warehousing"],
    mobileSalaryCarrier: "Orange Money",
    mobileSalaryNumber: "+231-777-666-106",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "ORANGE-SAL-2026-986"
  }
];

export function ModernHRMISSuite() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("core-hr");
  const [employees, setEmployees] = useState<EmployeeRecord[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Selected Employee for Detail/Edit Modal
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Adding Employee
  const [newEmployee, setNewEmployee] = useState<Partial<EmployeeRecord>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "Executive & Operations",
    role: "",
    employmentType: "Full-Time",
    status: "Active",
    baseSalaryUsd: 1500,
    location: "Monrovia HQ",
    manager: "Emmanuel Doe",
    nationalId: "",
    nasscorpNumber: "",
    flightRisk: "Low",
    performanceScore: 85,
    attendanceRate: 95,
    skills: ["Management", "Communications"]
  });

  // Candidate Pipeline Data (ATS)
  const [candidates, setCandidates] = useState([
    {
      id: "CAND-1",
      name: "Solomon K. Dennis",
      jobTitle: "Senior DevOps Engineer",
      department: "Managed IT & SaaS",
      appliedDate: "2026-08-20",
      stage: "Interview",
      aiMatchScore: 94,
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "PostgreSQL"],
      missingSkills: ["Terraform (Basic)"],
      experienceYears: 6,
      phone: "+231-777-900-111",
      email: "solomon.dennis@gmail.com"
    },
    {
      id: "CAND-2",
      name: "Helena Nimely",
      jobTitle: "Senior Accountant (FIMS)",
      department: "Finance & Accounting",
      appliedDate: "2026-08-22",
      stage: "Screening",
      aiMatchScore: 91,
      skills: ["IFRS Standards", "QuickBooks", "Tax Filing", "General Ledger"],
      missingSkills: ["Advanced Audit"],
      experienceYears: 5,
      phone: "+231-886-444-222",
      email: "helena.nimely@yahoo.com"
    },
    {
      id: "CAND-3",
      name: "Aaron B. Cooper",
      jobTitle: "Logistics Fleet Dispatcher",
      department: "Cargo & Logistics",
      appliedDate: "2026-08-23",
      stage: "Applied",
      aiMatchScore: 82,
      skills: ["Route Optimization", "GPS Tracking", "Customs Compliance"],
      missingSkills: ["Hazardous Cargo Cert"],
      experienceYears: 3,
      phone: "+231-777-333-888",
      email: "aaron.cooper@hotmail.com"
    },
    {
      id: "CAND-4",
      name: "Fatu K. Kamara",
      jobTitle: "Catering Head Chef",
      department: "TOCEPS Catering",
      appliedDate: "2026-08-18",
      stage: "Offer",
      aiMatchScore: 97,
      skills: ["Buffet Banquet Prep", "HACCP Safety", "Menu Costing", "Team Lead"],
      missingSkills: [],
      experienceYears: 8,
      phone: "+231-886-777-555",
      email: "fatu.kamara@gmail.com"
    }
  ]);

  // Digital Onboarding Tasks
  const [onboardingTasks, setOnboardingTasks] = useState([
    { id: "T1", candidate: "Fatu K. Kamara", title: "Sign Formal Employment Contract & NDA", completed: true, category: "Paperwork" },
    { id: "T2", candidate: "Fatu K. Kamara", title: "Submit NASSCORP & Tax Identity Proof", completed: true, category: "Statutory" },
    { id: "T3", candidate: "Fatu K. Kamara", title: "Provision Kitchen Security Keycard & Uniform", completed: false, category: "Equipment" },
    { id: "T4", candidate: "Fatu K. Kamara", title: "Complete HACCP & Hygiene Orientation Course", completed: false, category: "Training" },
    { id: "T5", candidate: "Fatu K. Kamara", title: "Day-1 Executive Mentor Meet & Welcome", completed: false, category: "Culture" }
  ]);

  // Payroll Processing Month
  const [payrollPeriod, setPayrollPeriod] = useState("August 2026");
  const [selectedPaystubEmployee, setSelectedPaystubEmployee] = useState<EmployeeRecord>(employees[0]);
  const [showPaystubModal, setShowPaystubModal] = useState(false);

  // Performance Goals (KPIs)
  const [goals, setGoals] = useState([
    { id: "G1", employee: "Martha Weah", title: "99.9% Uptime for Managed IT & SaaS Platforms", progress: 98, weight: 35, dueDate: "2026-09-30", status: "On Track" },
    { id: "G2", employee: "James Kollie", title: "Zero Statutory Tax Audit Discrepancies (Liberian Law)", progress: 92, weight: 30, dueDate: "2026-09-30", status: "On Track" },
    { id: "G3", employee: "Emmanuel Doe", title: "Reduce Multi-Subsidiary Operational Bottlenecks by 15%", progress: 85, weight: 35, dueDate: "2026-10-31", status: "On Track" },
    { id: "G4", employee: "Samuel Flomo", title: "Complete mechanized harvesting on 120-hectare parcel", progress: 60, weight: 25, dueDate: "2026-09-15", status: "At Risk" }
  ]);

  // LMS Courses
  const [courses, setCourses] = useState([
    { id: "C1", title: "Enterprise Cybersecurity & Data Privacy (GDPR/Liberian Privacy)", category: "Security", hours: 4, enrolledCount: 42, completionRate: 88, mandatory: true },
    { id: "C2", title: "HACCP Food Safety & Sanitation Masterclass", category: "Operations", hours: 6, enrolledCount: 28, completionRate: 96, mandatory: true },
    { id: "C3", title: "Advanced FIMS Financial Compliance & Ledger Standards", category: "Finance", hours: 8, enrolledCount: 16, completionRate: 75, mandatory: false },
    { id: "C4", title: "Executive Leadership & Team Alignment", category: "Leadership", hours: 10, enrolledCount: 12, completionRate: 90, mandatory: false }
  ]);

  // Mobile Salary Instant Payout Handler
  const handleInstantMobilePayout = (emp: EmployeeRecord) => {
    const nasscorpEmp = emp.baseSalaryUsd * 0.04;
    const paye = emp.baseSalaryUsd * 0.12;
    const net = emp.baseSalaryUsd - nasscorpEmp - paye + 100;
    const txId = `${emp.mobileSalaryCarrier.includes('Orange') ? 'ORANGE' : 'MTN'}-SAL-${Math.floor(1000 + Math.random() * 9000)}`;

    toast({
      title: "📱 Instant Mobile Salary Disbursed!",
      description: `Successfully paid $${net.toFixed(2)} USD to ${emp.firstName} ${emp.lastName} via ${emp.mobileSalaryCarrier} (${emp.mobileSalaryNumber}). Tx ID: ${txId}. SMS confirmation sent to employee.`,
    });
  };

  // Bulk Mobile Salary Payout Handler
  const handleBulkMobileSalaryPayout = () => {
    const mobileEmployees = employees.filter(e => e.mobileSalaryCarrier !== 'Direct Bank (Ecobank)');
    const totalMobileDisbursement = mobileEmployees.reduce((acc, emp) => {
      const nasscorpEmp = emp.baseSalaryUsd * 0.04;
      const paye = emp.baseSalaryUsd * 0.12;
      return acc + (emp.baseSalaryUsd - nasscorpEmp - paye + 100);
    }, 0);

    toast({
      title: "🚀 Batch Mobile Salary Gateway Completed",
      description: `Disbursed $${totalMobileDisbursement.toFixed(2)} USD across ${mobileEmployees.length} employee mobile wallets (Orange Money & MTN MoMo) with automated SMS settlement notifications.`,
    });
  };

  // Filtered Employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === "all" || emp.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Calculate Payroll Summary
  const totalBasePayroll = employees.reduce((acc, emp) => acc + emp.baseSalaryUsd, 0);
  const totalNasscorpEmployer = totalBasePayroll * 0.06; // 6% NASSCORP Employer
  const totalNasscorpEmployee = totalBasePayroll * 0.04; // 4% NASSCORP Employee
  const totalEstimatedPayeTax = totalBasePayroll * 0.12; // Approx PAYE
  const totalNetDisbursements = totalBasePayroll - totalNasscorpEmployee - totalEstimatedPayeTax;

  // Add Employee Handler
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
      toast({ title: "Validation Error", description: "Please enter first name, last name, and work email.", variant: "destructive" });
      return;
    }

    const created: EmployeeRecord = {
      id: `EMP-${Date.now().toString().slice(-3)}`,
      employeeCode: `TOT-${newEmployee.department?.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      firstName: newEmployee.firstName || "New",
      lastName: newEmployee.lastName || "Employee",
      email: newEmployee.email || "",
      phone: newEmployee.phone || "+231-777-000-000",
      department: newEmployee.department || "Executive & Operations",
      role: newEmployee.role || "Specialist",
      employmentType: newEmployee.employmentType || "Full-Time",
      status: (newEmployee.status as any) || "Active",
      joinDate: new Date().toISOString().split("T")[0],
      baseSalaryUsd: Number(newEmployee.baseSalaryUsd) || 1200,
      manager: newEmployee.manager || "Emmanuel Doe",
      location: newEmployee.location || "Monrovia HQ",
      nationalId: newEmployee.nationalId || `LR-${Math.floor(100000 + Math.random() * 900000)}`,
      nasscorpNumber: newEmployee.nasscorpNumber || `NASS-${Math.floor(100000 + Math.random() * 900000)}`,
      flightRisk: "Low",
      performanceScore: 85,
      attendanceRate: 95,
      skills: ["Onboarding", "Operations"]
    };

    setEmployees([created, ...employees]);
    setShowAddModal(false);
    toast({ title: "Employee Record Created", description: `${created.firstName} ${created.lastName} has been enrolled into the centralized database.` });
  };

  // Move candidate to next stage
  const handleAdvanceCandidate = (id: string, nextStage: string) => {
    setCandidates(
      candidates.map((c) => (c.id === id ? { ...c, stage: nextStage } : c))
    );
    toast({ title: "Candidate Advanced", description: `Candidate moved to ${nextStage} stage.` });
  };

  // Toggle Onboarding Task
  const toggleOnboardingTask = (id: string) => {
    setOnboardingTasks(
      onboardingTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Export Custom Report
  const handleExportReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Employee Code,Full Name,Department,Role,Status,Base Salary ($),Attendance Rate (%),Flight Risk,NASSCORP No"]
        .concat(
          filteredEmployees.map(
            (e) =>
              `${e.employeeCode},"${e.firstName} ${e.lastName}","${e.department}","${e.role}",${e.status},${e.baseSalaryUsd},${e.attendanceRate}%,${e.flightRisk},${e.nasscorpNumber}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Workforce_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Workforce Report Exported", description: "CSV data sheet downloaded successfully." });
  };

  return (
    <div className={`transition-all duration-300 ${isMobilePreview ? "max-w-md mx-auto border-8 border-slate-800 rounded-3xl p-3 shadow-2xl bg-white dark:bg-slate-950 my-6" : "w-full"}`}>
      
      {/* ==================== SUITE HERO & TOOLBAR ==================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/30 border border-blue-400/40 rounded-xl text-blue-400">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    {companyName} Modern HRMIS Enterprise Suite
                  </h2>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs">
                    ACTIVE CLOUD SUITE
                  </Badge>
                </div>
                <p className="text-slate-300 text-xs md:text-sm mt-0.5">
                  Centralized Employee Database &bull; ATS & AI Onboarding &bull; Automated Statutory Payroll &bull; OKR Performance &bull; Predictive Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Mobile Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMobilePreview(!isMobilePreview)}
              className="bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 text-xs"
            >
              <Smartphone className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              {isMobilePreview ? "Exit Mobile Simulator" : "Mobile View Simulator"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportReport}
              className="bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Export CSV Report
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Enroll Employee
            </Button>
          </div>
        </div>
      </div>

      {/* ==================== 6 TOP-LEVEL PILLAR TABS ==================== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border">
          <TabsTrigger value="core-hr" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>1. Core HR & Org</span>
          </TabsTrigger>
          <TabsTrigger value="talent-acquisition" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <Target className="w-3.5 h-3.5 text-purple-600" />
            <span>2. Talent & ATS</span>
          </TabsTrigger>
          <TabsTrigger value="payroll-benefits" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Payroll & Tax</span>
          </TabsTrigger>
          <TabsTrigger value="performance-lms" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>4. OKRs & LMS</span>
          </TabsTrigger>
          <TabsTrigger value="analytics-ai" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <BarChart3 className="w-3.5 h-3.5 text-rose-600" />
            <span>5. Workforce AI</span>
          </TabsTrigger>
          <TabsTrigger value="security-rbac" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <Shield className="w-3.5 h-3.5 text-cyan-600" />
            <span>6. RBAC & Mobile</span>
          </TabsTrigger>
        </TabsList>

        {/* ==================== PILLAR 1: CORE HR & EMPLOYEE DATABASE ==================== */}
        <TabsContent value="core-hr" className="space-y-6">
          
          {/* Sub-Header & Live Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase">Total Personnel</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{employees.length}</p>
                </div>
                <Users className="w-7 h-7 text-blue-500 opacity-75" />
              </CardContent>
            </Card>

            <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-600 font-bold uppercase">Active Duty</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {employees.filter((e) => e.status === "Active").length}
                  </p>
                </div>
                <CheckCircle className="w-7 h-7 text-emerald-500 opacity-75" />
              </CardContent>
            </Card>

            <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-600 font-bold uppercase">On Approved Leave</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {employees.filter((e) => e.status === "On Leave").length}
                  </p>
                </div>
                <Calendar className="w-7 h-7 text-amber-500 opacity-75" />
              </CardContent>
            </Card>

            <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-600 font-bold uppercase">Departments</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">6 Active</p>
                </div>
                <Building2 className="w-7 h-7 text-indigo-500 opacity-75" />
              </CardContent>
            </Card>
          </div>

          {/* Search, Filters and Employee Grid */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Centralized Personnel Directory
                  </CardTitle>
                  <CardDescription>
                    Cloud storage of all employee profiles, national IDs, job history, and emergency records.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-48 sm:w-64">
                    <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                    <Input
                      placeholder="Search name, code, role..."
                      className="pl-8 text-xs h-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-36 text-xs h-9">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Executive & Operations">Executive</SelectItem>
                      <SelectItem value="Managed IT & SaaS">IT & SaaS</SelectItem>
                      <SelectItem value="Finance & Accounting">Finance</SelectItem>
                      <SelectItem value="TOCEPS Catering">TOCEPS Catering</SelectItem>
                      <SelectItem value="TOTAG Farm & Agribusiness">TOTAG Farm</SelectItem>
                      <SelectItem value="Cargo & Logistics">Cargo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b">
                    <tr>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Department & Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Salary (USD)</th>
                      <th className="py-3 px-4">Performance</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                              {emp.firstName[0]}{emp.lastName[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{emp.employeeCode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-800 dark:text-slate-200">{emp.role}</p>
                          <p className="text-[11px] text-slate-500">{emp.department}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            className={`text-[10px] ${
                              emp.status === "Active"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : emp.status === "On Leave"
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {emp.location}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          ${emp.baseSalaryUsd.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <Progress value={emp.performanceScore} className="w-16 h-2" />
                            <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300">{emp.performanceScore}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-blue-600 hover:bg-blue-50"
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setShowDetailModal(true);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View Record
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-emerald-600 hover:bg-emerald-50"
                              onClick={() => {
                                setSelectedPaystubEmployee(emp);
                                setShowPaystubModal(true);
                              }}
                            >
                              <Printer className="w-3.5 h-3.5 mr-1" />
                              Pay Stub
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ==================== INTERACTIVE ORGANIZATIONAL CHART ==================== */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Live Visual Organizational Hierarchy Chart
              </CardTitle>
              <CardDescription>
                Real-time mapping of reporting lines, subsidiary leadership, and team structures.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-6">
                {/* Level 1: CEO / Executive Board */}
                <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-xl shadow-lg border-2 border-indigo-500 text-center w-72">
                  <p className="text-[10px] font-bold tracking-widest text-indigo-300 uppercase">Board &amp; CEO Office</p>
                  <h4 className="font-black text-sm mt-1">TOTAG Executive Leadership</h4>
                  <p className="text-xs text-slate-300">Monrovia Global Operations</p>
                  <div className="mt-2 pt-2 border-t border-indigo-700/50 flex justify-around text-[10px] text-indigo-200">
                    <span>9 Subsidiaries</span>
                    <span>156 Personnel</span>
                  </div>
                </div>

                <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700"></div>

                {/* Level 2: Head of Operations */}
                <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-400 rounded-xl shadow text-center w-64">
                  <Badge className="bg-blue-600 text-white text-[9px] mb-1">CHIEF OPERATING OFFICER</Badge>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Emmanuel Doe</h5>
                  <p className="text-[11px] text-blue-600">Head of Group Operations</p>
                </div>

                <div className="w-full max-w-2xl h-0.5 bg-slate-300 dark:bg-slate-700 relative">
                  <div className="absolute left-1/2 -top-3 w-0.5 h-3 bg-slate-300 dark:bg-slate-700 -translate-x-1/2"></div>
                </div>

                {/* Level 3: Department Directors */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-lg text-center">
                    <p className="text-[10px] text-purple-600 font-bold">Managed IT &amp; SaaS</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">Martha Weah</p>
                    <p className="text-[10px] text-slate-500">Lead Cloud Architect</p>
                    <span className="inline-block mt-1 text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">4 Direct Reports</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-lg text-center">
                    <p className="text-[10px] text-emerald-600 font-bold">Finance &amp; Audit</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">James Kollie</p>
                    <p className="text-[10px] text-slate-500">Financial Controller</p>
                    <span className="inline-block mt-1 text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">3 Direct Reports</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-lg text-center">
                    <p className="text-[10px] text-amber-600 font-bold">TOCEPS Catering</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">Patience Johnson</p>
                    <p className="text-[10px] text-slate-500">Food Safety Manager</p>
                    <span className="inline-block mt-1 text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">8 Kitchen Staff</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-lg text-center">
                    <p className="text-[10px] text-rose-600 font-bold">Agribusiness Hub</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">Samuel Flomo</p>
                    <p className="text-[10px] text-slate-500">Agronomy Supervisor</p>
                    <span className="inline-block mt-1 text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">14 Field Crew</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ==================== EMPLOYEE SELF-SERVICE (ESS) SIMULATOR ==================== */}
          <Card className="border shadow-sm bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/20">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-blue-600" />
                    Employee Self-Service (ESS) &amp; Policy Hub
                  </CardTitle>
                  <CardDescription>
                    Empowers employees to update personal records, view tax slips, and request leaves without manual HR bottlenecks.
                  </CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">24/7 SELF-SERVICE</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                  <Calendar className="w-4 h-4" />
                  <span>Request Time-Off / Leave</span>
                </div>
                <p className="text-xs text-slate-500">
                  Annual balance: <strong>14 days remaining</strong>. Instant supervisor notification upon submit.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs mt-2"
                  onClick={() => toast({ title: "Leave Request Submitted", description: "Your 3-day leave request has been routed to your supervisor for e-approval." })}
                >
                  Submit 3-Day Leave Request
                </Button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <FileText className="w-4 h-4" />
                  <span>Digital Pay Stubs</span>
                </div>
                <p className="text-xs text-slate-500">
                  View and download encrypted, itemized payslips with NASSCORP and PAYE statutory breakdowns.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs mt-2"
                  onClick={() => {
                    setSelectedPaystubEmployee(employees[0]);
                    setShowPaystubModal(true);
                  }}
                >
                  Download Latest Pay Stub
                </Button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>Company Policies &amp; Handbook</span>
                </div>
                <p className="text-xs text-slate-500">
                  Access official policies: Disciplinary code, Health &amp; Safety, Whistleblower protection.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs mt-2"
                  onClick={() => toast({ title: "Policy Handbook Opened", description: "Opening TOTAG Group Employee Handbook 2026 Edition." })}
                >
                  View 2026 Policy Manual
                </Button>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        {/* ==================== PILLAR 2: TALENT ACQUISITION & AI ONBOARDING ==================== */}
        <TabsContent value="talent-acquisition" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-200">
              <CardContent className="p-4">
                <p className="text-xs text-purple-600 font-bold uppercase">Active Requisitions</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">4 Vacancies</p>
                <p className="text-[11px] text-slate-500 mt-1">IT, Finance, Catering &amp; Logistics</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
              <CardContent className="p-4">
                <p className="text-xs text-blue-600 font-bold uppercase">Active Applicants</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{candidates.length} In Pipeline</p>
                <p className="text-[11px] text-slate-500 mt-1">Average AI Match Score: 91%</p>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200">
              <CardContent className="p-4">
                <p className="text-xs text-emerald-600 font-bold uppercase">Onboarding In Progress</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">1 New Hire</p>
                <p className="text-[11px] text-slate-500 mt-1">Fatu K. Kamara (Head Chef)</p>
              </CardContent>
            </Card>
          </div>

          {/* ==================== AI RESUME SCREENING & ATS PIPELINE ==================== */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Applicant Tracking System (ATS) &amp; AI Resume Matcher
                  </CardTitle>
                  <CardDescription>
                    Intelligent algorithm analyzes resume keywords, years of experience, and certifications against job requisitions.
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs font-bold">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Post New Requisition
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid gap-3">
                {candidates.map((cand) => (
                  <div key={cand.id} className="p-4 rounded-xl border bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cand.name}</h4>
                          <Badge className="bg-slate-100 text-slate-800 text-[10px]">{cand.experienceYears} Years Exp</Badge>
                          <Badge
                            className={`text-[10px] font-bold ${
                              cand.aiMatchScore >= 90
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-blue-100 text-blue-800 border-blue-300"
                            }`}
                          >
                            <Sparkles className="w-3 h-3 mr-1 inline" />
                            {cand.aiMatchScore}% AI Match
                          </Badge>
                        </div>
                        <p className="text-xs text-purple-600 font-medium mt-0.5">{cand.jobTitle} &bull; {cand.department}</p>
                        
                        {/* Skills Chips */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {cand.skills.map((s, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded">
                              ✓ {s}
                            </span>
                          ))}
                          {cand.missingSkills.map((ms, idx) => (
                            <span key={idx} className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] px-2 py-0.5 rounded">
                              ⚠ {ms}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stage Actions */}
                      <div className="flex flex-col sm:items-end gap-2">
                        <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded uppercase">
                          Stage: {cand.stage}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {cand.stage === "Applied" && (
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleAdvanceCandidate(cand.id, "Screening")}>
                              Move to Screen &rarr;
                            </Button>
                          )}
                          {cand.stage === "Screening" && (
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleAdvanceCandidate(cand.id, "Interview")}>
                              Schedule Interview &rarr;
                            </Button>
                          )}
                          {cand.stage === "Interview" && (
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleAdvanceCandidate(cand.id, "Offer")}>
                              Extend Offer &rarr;
                            </Button>
                          )}
                          {cand.stage === "Offer" && (
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 font-bold" onClick={() => handleAdvanceCandidate(cand.id, "Hired")}>
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Confirm Hire &amp; Onboard
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ==================== DIGITAL ONBOARDING WORKFLOW ==================== */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                    Digital Onboarding &amp; Provisioning Workflow
                  </CardTitle>
                  <CardDescription>
                    Automated checklist tracking e-signed contracts, statutory tax filings, IT equipment provisioning, and day-1 orientation.
                  </CardDescription>
                </div>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
                  {onboardingTasks.filter((t) => t.completed).length} / {onboardingTasks.length} Completed
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-3">
              {onboardingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleOnboardingTask(task.id)}
                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    task.completed ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300" : "bg-white dark:bg-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${task.completed ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"}`}>
                      {task.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${task.completed ? "line-through text-slate-500" : "text-slate-900 dark:text-white"}`}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-500">Candidate: {task.candidate} &bull; Category: {task.category}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {task.completed ? "Verified" : "Pending Action"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

        </TabsContent>

        {/* ==================== PILLAR 3: PAYROLL, TAX & BENEFITS ==================== */}
        <TabsContent value="payroll-benefits" className="space-y-6">
          
          {/* Statutory Financial Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-slate-50 dark:bg-slate-900 border">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-bold uppercase">Gross Monthly Payroll</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">${totalBasePayroll.toLocaleString()} USD</p>
                <p className="text-[10px] text-slate-500">{employees.length} Enrolled Employees</p>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200">
              <CardContent className="p-4">
                <p className="text-xs text-emerald-600 font-bold uppercase">NASSCORP (6% Employer)</p>
                <p className="text-xl font-black text-emerald-600 mt-1">${totalNasscorpEmployer.toFixed(2)} USD</p>
                <p className="text-[10px] text-slate-500">Statutory Social Security</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
              <CardContent className="p-4">
                <p className="text-xs text-blue-600 font-bold uppercase">PAYE Income Tax</p>
                <p className="text-xl font-black text-blue-600 mt-1">${totalEstimatedPayeTax.toFixed(2)} USD</p>
                <p className="text-[10px] text-slate-500">Liberian Revenue Authority (LRA)</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-200">
              <CardContent className="p-4">
                <p className="text-xs text-purple-600 font-bold uppercase">Net Disbursements</p>
                <p className="text-xl font-black text-purple-600 mt-1">${totalNetDisbursements.toFixed(2)} USD</p>
                <p className="text-[10px] text-slate-500">Ecobank / Mobile Money</p>
              </CardContent>
            </Card>
          </div>

          {/* Dedicated Mobile Salary Batch Engine */}
          <Card className="border-2 border-amber-300 dark:border-amber-800 bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-amber-50/30 dark:from-slate-950 dark:to-amber-950/20 shadow-md">
            <CardHeader className="pb-3 border-b border-amber-200 dark:border-amber-800/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-black text-amber-950 dark:text-amber-200 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-amber-600" />
                      Liberian Mobile Salary Disbursement Gateway (Orange &amp; MTN MoMo)
                    </CardTitle>
                    <Badge className="bg-amber-600 text-white text-[10px] font-bold">LIVE TELECOM INTEGRATION</Badge>
                  </div>
                  <CardDescription className="text-amber-900/80 dark:text-amber-300/80 text-xs mt-1">
                    Direct automated salary transmission to employee mobile wallets across Liberia (Orange Money &bull; MTN Mobile Money). Includes dual-currency USD/LRD split and automated SMS payslip dispatch.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-black shadow-lg shadow-orange-500/20"
                  onClick={handleBulkMobileSalaryPayout}
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Disburse All Mobile Salaries Batch &rarr;
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                <span className="text-[10px] font-bold text-amber-700 block uppercase">Orange Money Channel</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">4 Personnel</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Merchant: +231-777-666-999</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                <span className="text-[10px] font-bold text-yellow-700 block uppercase">MTN MoMo Channel</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">2 Personnel</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Merchant: +231-887-666-999</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                <span className="text-[10px] font-bold text-emerald-700 block uppercase">CBL Exchange Benchmark</span>
                <span className="font-bold text-sm text-emerald-600">1 USD = 194.50 LRD</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Dual-Currency Rate</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                <span className="text-[10px] font-bold text-blue-700 block uppercase">SMS Gateway Status</span>
                <span className="font-bold text-sm text-blue-600">100% Online</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Instant SMS Delivery</p>
              </div>
            </CardContent>
          </Card>

          {/* Automated Payroll Engine */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Automated Payroll Calculation &amp; Direct Deposit Batch
                  </CardTitle>
                  <CardDescription>
                    Automatically computes base salaries, overtime hours, NASSCORP statutory deductions, and tax withholdings.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Period: {payrollPeriod}</Badge>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                    onClick={() => toast({ title: "Payroll Batch Processed", description: `Payroll for ${payrollPeriod} approved. Total net disbursement: $${totalNetDisbursements.toFixed(2)} USD.` })}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Approve &amp; Dispatch Payroll
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b">
                    <tr>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Base Salary</th>
                      <th className="py-3 px-4">NASSCORP (4%)</th>
                      <th className="py-3 px-4">PAYE Tax (12%)</th>
                      <th className="py-3 px-4">Net Payout</th>
                      <th className="py-3 px-4">Mobile Salary Wallet</th>
                      <th className="py-3 px-4">Disbursement Action</th>
                      <th className="py-3 px-4 text-right">Pay Slip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {employees.map((emp) => {
                      const nasscorpEmp = emp.baseSalaryUsd * 0.04;
                      const paye = emp.baseSalaryUsd * 0.12;
                      const net = emp.baseSalaryUsd - nasscorpEmp - paye;
                      return (
                        <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</p>
                            <p className="text-[10px] text-slate-500">{emp.department}</p>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold">${emp.baseSalaryUsd.toLocaleString()}</td>
                          <td className="py-3 px-4 font-mono text-emerald-600">-${nasscorpEmp.toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono text-blue-600">-${paye.toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">${net.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                emp.mobileSalaryCarrier.includes('Orange')
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : emp.mobileSalaryCarrier.includes('MTN')
                                  ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                                  : 'bg-blue-100 text-blue-900 border border-blue-300'
                              }`}>
                                {emp.mobileSalaryCarrier.includes('Orange') ? '🟠 Orange' : emp.mobileSalaryCarrier.includes('MTN') ? '🟡 MTN MoMo' : '🏦 Bank'}
                              </span>
                              <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300">{emp.mobileSalaryNumber}</span>
                            </div>
                            <p className="text-[9px] text-emerald-600 font-medium mt-0.5">Split: {emp.mobileSalarySplit} &bull; KYC Verified</p>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              className="h-7 text-[11px] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-sm"
                              onClick={() => handleInstantMobilePayout(emp)}
                            >
                              <Smartphone className="w-3 h-3 mr-1" />
                              Instant Mobile Pay
                            </Button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-blue-600"
                              onClick={() => {
                                setSelectedPaystubEmployee(emp);
                                setShowPaystubModal(true);
                              }}
                            >
                              <Printer className="w-3.5 h-3.5 mr-1" />
                              Pay Slip
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Benefits & Wellness Tracking */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-600" />
                Employee Benefits, Health Insurance &amp; Wellness Perks
              </CardTitle>
              <CardDescription>
                Tiered healthcare packages, pension vesting, transport allowances, and meal subsidy programs.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Comprehensive Health Insurance</h4>
                <p className="text-xs text-slate-500 mt-1">In-patient &amp; Out-patient coverage across approved hospitals and clinics in Monrovia.</p>
                <div className="mt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Enrolled:</span>
                  <Badge className="bg-emerald-100 text-emerald-800">100% Workforce</Badge>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">NASSCORP Pension &amp; Retirement</h4>
                <p className="text-xs text-slate-500 mt-1">10% combined monthly statutory contribution deposited directly into National Social Security.</p>
                <div className="mt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Compliance:</span>
                  <Badge className="bg-blue-100 text-blue-800">Verified Legal</Badge>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">TOCEPS Catering Meal Subsidy</h4>
                <p className="text-xs text-slate-500 mt-1">Daily hot executive lunch provided across all operational centers and field hubs.</p>
                <div className="mt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Status:</span>
                  <Badge className="bg-amber-100 text-amber-800">Active Perk</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        {/* ==================== PILLAR 4: PERFORMANCE, OKRs & LMS ==================== */}
        <TabsContent value="performance-lms" className="space-y-6">
          
          {/* Goal & OKR Cascading */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-600" />
                    Strategic OKRs &amp; Individual KPI Targets
                  </CardTitle>
                  <CardDescription>
                    Quarterly milestone tracking, goal weights, and continuous progress metrics.
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Assign New Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              {goals.map((g) => (
                <div key={g.id} className="p-4 rounded-xl border bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{g.title}</h4>
                      <p className="text-[11px] text-slate-500">Owner: <strong>{g.employee}</strong> &bull; Weight: {g.weight}% &bull; Due: {g.dueDate}</p>
                    </div>
                    <Badge className={g.status === "On Track" ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-rose-100 text-rose-800 text-[10px]"}>
                      {g.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <Progress value={g.progress} className="h-2 flex-1" />
                    <span className="font-bold font-mono text-xs">{g.progress}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Learning Management System (LMS) */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    Learning Management System (LMS) &amp; Compliance Certifications
                  </CardTitle>
                  <CardDescription>
                    Online training courses, mandatory safety modules, quiz assessments, and verified credential badges.
                  </CardDescription>
                </div>
                <Badge className="bg-indigo-100 text-indigo-800 text-xs">4 Active Courses</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid sm:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="p-4 rounded-xl border bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5">{course.title}</h4>
                    </div>
                    {course.mandatory && (
                      <Badge className="bg-rose-100 text-rose-800 text-[9px]">MANDATORY</Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Completion Rate:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{course.completionRate}%</span>
                    </div>
                    <Progress value={course.completionRate} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t">
                    <span>⏱ {course.hours} Hours &bull; {course.enrolledCount} Enrolled</span>
                    <Button size="sm" variant="ghost" className="h-6 text-xs text-indigo-600">
                      Launch Course &rarr;
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </TabsContent>

        {/* ==================== PILLAR 5: WORKFORCE INTELLIGENCE & AI PREDICTIVE ==================== */}
        <TabsContent value="analytics-ai" className="space-y-6">
          
          {/* Predictive Flight-Risk Analysis Engine */}
          <Card className="border-2 border-rose-200 dark:border-rose-900 shadow-md bg-gradient-to-br from-rose-50/40 via-white to-orange-50/30 dark:from-slate-950 dark:to-rose-950/20">
            <CardHeader className="pb-3 border-b border-rose-100 dark:border-rose-900">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-rose-900 dark:text-rose-200">
                    <Cpu className="w-5 h-5 text-rose-600" />
                    Workforce Flight-Risk &amp; Attrition Predictive Intelligence
                  </CardTitle>
                  <CardDescription>
                    AI models analyze tenure, review trends, compensation parity, and overtime fatigue to alert leadership before key personnel resign.
                  </CardDescription>
                </div>
                <Badge className="bg-rose-600 text-white font-bold text-xs">PREDICTIVE AI ENGINE</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                {employees.map((emp) => (
                  <div key={emp.id} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</p>
                      <Badge
                        className={`text-[10px] ${
                          emp.flightRisk === "Low"
                            ? "bg-emerald-100 text-emerald-800"
                            : emp.flightRisk === "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800 animate-pulse"
                        }`}
                      >
                        {emp.flightRisk} Attrition Risk
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-500">{emp.role} &bull; {emp.department}</p>
                    <div className="text-[11px] bg-slate-50 dark:bg-slate-800 p-2 rounded text-slate-700 dark:text-slate-300">
                      {emp.flightRisk === "High" && "⚠ Alert: Overdue for compensation adjustment and remote hub assignment review."}
                      {emp.flightRisk === "Medium" && "ℹ Note: Market salary benchmark variance +5%; schedule 1-on-1 check-in."}
                      {emp.flightRisk === "Low" && "✓ Stable: High engagement, recent KPI milestone completed."}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Report Builder */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    Custom Executive Report Builder
                  </CardTitle>
                  <CardDescription>
                    Build tailored data sheets for board reviews, labor budget planning, and hiring forecasts.
                  </CardDescription>
                </div>
                <Button size="sm" onClick={handleExportReport} className="bg-blue-600 hover:bg-blue-700 text-xs font-bold">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Generate &amp; Download CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Select Department</Label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Executive & Operations">Executive &amp; Operations</SelectItem>
                    <SelectItem value="Managed IT & SaaS">Managed IT &amp; SaaS</SelectItem>
                    <SelectItem value="Finance & Accounting">Finance &amp; Accounting</SelectItem>
                    <SelectItem value="TOCEPS Catering">TOCEPS Catering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Employment Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active Only</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Report Timeframe</Label>
                <Select defaultValue="q3_2026">
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q3_2026">Q3 2026 (Current)</SelectItem>
                    <SelectItem value="ytd_2026">YTD 2026</SelectItem>
                    <SelectItem value="annual_2025">Full Year 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full text-xs h-9" onClick={() => toast({ title: "Filters Applied", description: `Displaying ${filteredEmployees.length} matching personnel records.` })}>
                  <Filter className="w-3.5 h-3.5 mr-1" />
                  Filter Records ({filteredEmployees.length})
                </Button>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        {/* ==================== PILLAR 6: SECURITY, RBAC & PRIVACY ==================== */}
        <TabsContent value="security-rbac" className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-600" />
                Role-Based Access Control (RBAC) &amp; Data Privacy Governance
              </CardTitle>
              <CardDescription>
                Granular permissions protect sensitive employee compensation, health records, and social security credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b">
                    <tr>
                      <th className="py-2.5 px-3">System Role</th>
                      <th className="py-2.5 px-3">View Directory</th>
                      <th className="py-2.5 px-3">Edit Records</th>
                      <th className="py-2.5 px-3">Approve Payroll</th>
                      <th className="py-2.5 px-3">View Tax &amp; NASSCORP</th>
                      <th className="py-2.5 px-3">Export CSV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-600 dark:text-slate-300">
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Super Administrator</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">HR Director</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                      <td className="py-3 px-3 text-blue-600">Review Only</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Payroll Controller</td>
                      <td className="py-3 px-3 text-blue-600">Read Only</td>
                      <td className="py-3 px-3 text-slate-400">✗ No</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Execute</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">✓ Full</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Department Manager</td>
                      <td className="py-3 px-3 text-blue-600">Own Team</td>
                      <td className="py-3 px-3 text-slate-400">✗ No</td>
                      <td className="py-3 px-3 text-slate-400">✗ No</td>
                      <td className="py-3 px-3 text-slate-400">✗ No</td>
                      <td className="py-3 px-3 text-blue-600">Team Only</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Standard Employee (ESS)</td>
                      <td className="py-3 px-3 text-blue-600">Self Only</td>
                      <td className="py-3 px-3 text-blue-600">Self Contact</td>
                      <td className="py-3 px-3 text-slate-400">✗ No</td>
                      <td className="py-3 px-3 text-blue-600">Own Slip</td>
                      <td className="py-3 px-3 text-slate-400">✗ No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* ==================== EMPLOYEE DETAIL MODAL ==================== */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Users className="w-5 h-5 text-blue-600" />
              Employee Master Record &bull; {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </DialogTitle>
            <DialogDescription>
              Code: {selectedEmployee?.employeeCode} &bull; Joined: {selectedEmployee?.joinDate}
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border">
                <div>
                  <span className="text-slate-500 block">Department:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedEmployee.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Job Role:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedEmployee.role}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Work Email:</span>
                  <span className="font-mono text-blue-600 font-bold">{selectedEmployee.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Phone Line:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{selectedEmployee.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">National ID:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{selectedEmployee.nationalId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">NASSCORP ID:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{selectedEmployee.nasscorpNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Base Salary:</span>
                  <span className="font-mono font-bold text-emerald-600">${selectedEmployee.baseSalaryUsd} USD/mo</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedEmployee.location}</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Key Verified Skills &amp; Qualifications:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmployee.skills.map((s, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-medium">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button size="sm" variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                  setShowDetailModal(false);
                  setSelectedPaystubEmployee(selectedEmployee);
                  setShowPaystubModal(true);
                }}>
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Generate Pay Slip
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================== DIGITAL PAYSLIP MODAL ==================== */}
      <Dialog open={showPaystubModal} onOpenChange={setShowPaystubModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Printer className="w-5 h-5 text-emerald-600" />
              Official Itemized Pay Stub ({payrollPeriod})
            </DialogTitle>
            <DialogDescription>
              {companyName} &bull; Statutory Payroll Voucher
            </DialogDescription>
          </DialogHeader>

          {selectedPaystubEmployee && (
            <div className="space-y-4 text-xs bg-white dark:bg-slate-950 p-4 border rounded-xl shadow-inner">
              <div className="flex justify-between border-b pb-3">
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">{companyName}</h4>
                  <p className="text-[10px] text-slate-500">Monrovia, Liberia &bull; TIN: 100984712</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">PAID &amp; SETTLED</Badge>
                  <p className="text-[10px] text-slate-500 mt-1">Period: {payrollPeriod}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-900 p-2.5 rounded">
                <div>
                  <span className="text-slate-500">Employee:</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedPaystubEmployee.firstName} {selectedPaystubEmployee.lastName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Code:</span>
                  <p className="font-mono font-bold">{selectedPaystubEmployee.employeeCode}</p>
                </div>
                <div>
                  <span className="text-slate-500">Department:</span>
                  <p className="font-bold">{selectedPaystubEmployee.department}</p>
                </div>
                <div>
                  <span className="text-slate-500">NASSCORP ID:</span>
                  <p className="font-mono">{selectedPaystubEmployee.nasscorpNumber}</p>
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold border-b pb-1">
                  <span>Earnings</span>
                  <span>Amount (USD)</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Base Salary</span>
                  <span className="font-mono">${selectedPaystubEmployee.baseSalaryUsd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Transport Allowance</span>
                  <span className="font-mono">$100.00</span>
                </div>

                <div className="flex justify-between font-bold border-b pt-2 pb-1">
                  <span>Statutory Deductions (Liberian Law)</span>
                  <span>Amount (USD)</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>NASSCORP Employee Contribution (4%)</span>
                  <span className="font-mono">-${(selectedPaystubEmployee.baseSalaryUsd * 0.04).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>PAYE Income Tax Withholding (12%)</span>
                  <span className="font-mono">-${(selectedPaystubEmployee.baseSalaryUsd * 0.12).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center font-black text-sm pt-3 border-t-2 border-slate-900 dark:border-white">
                  <span>NET SALARY DISBURSEMENT:</span>
                  <span className="font-mono text-emerald-600">
                    ${(selectedPaystubEmployee.baseSalaryUsd + 100 - selectedPaystubEmployee.baseSalaryUsd * 0.16).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" onClick={() => setShowPaystubModal(false)}>Close</Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  onClick={() => toast({ title: "Print Command Sent", description: "Sending official pay stub to default printer / PDF." })}
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print / Save PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================== ADD EMPLOYEE MODAL ==================== */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Plus className="w-5 h-5 text-blue-600" />
              Enroll New Employee Record
            </DialogTitle>
            <DialogDescription>
              Stores employee profile in the centralized cloud database with automated code assignment.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">First Name *</Label>
                <Input
                  required
                  placeholder="e.g. John"
                  value={newEmployee.firstName}
                  onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Last Name *</Label>
                <Input
                  required
                  placeholder="e.g. Doe"
                  value={newEmployee.lastName}
                  onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Work Email *</Label>
                <Input
                  required
                  type="email"
                  placeholder="name@totaggroup.com"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Phone Line *</Label>
                <Input
                  placeholder="+231-777-000-000"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Department *</Label>
                <Select
                  value={newEmployee.department}
                  onValueChange={(val) => setNewEmployee({ ...newEmployee, department: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Executive & Operations">Executive &amp; Operations</SelectItem>
                    <SelectItem value="Managed IT & SaaS">Managed IT &amp; SaaS</SelectItem>
                    <SelectItem value="Finance & Accounting">Finance &amp; Accounting</SelectItem>
                    <SelectItem value="TOCEPS Catering">TOCEPS Catering</SelectItem>
                    <SelectItem value="TOTAG Farm & Agribusiness">TOTAG Farm</SelectItem>
                    <SelectItem value="Cargo & Logistics">Cargo &amp; Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Job Title *</Label>
                <Input
                  placeholder="e.g. Operations Coordinator"
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Base Monthly Salary ($ USD)</Label>
                <Input
                  type="number"
                  placeholder="1500"
                  value={newEmployee.baseSalaryUsd}
                  onChange={(e) => setNewEmployee({ ...newEmployee, baseSalaryUsd: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Location</Label>
                <Input
                  placeholder="Monrovia HQ"
                  value={newEmployee.location}
                  onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Enroll Employee
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


      {/* ==================== 1. CLOCK IN / TIME LOG MODAL ==================== */}
      <Dialog open={showClockInModal} onOpenChange={setShowClockInModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Clock className="w-5 h-5 text-blue-600" />
              Employee Biometric &amp; Time Log Ingestion
            </DialogTitle>
            <DialogDescription>
              Captures work hours, punch-in timestamps, GPS location, and shifts for automated payroll calculation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleClockInSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Select Employee *</Label>
              <Select
                value={clockInRecord.employeeId}
                onValueChange={(val) => setClockInRecord({ ...clockInRecord, employeeId: val })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.employeeCode} - {e.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Shift &amp; Duty Schedule</Label>
              <Select
                value={clockInRecord.shiftType}
                onValueChange={(val) => setClockInRecord({ ...clockInRecord, shiftType: val })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning Shift (08:00 - 17:00)">Morning Standard (08:00 - 17:00)</SelectItem>
                  <SelectItem value="Night Security &amp; Logistics (20:00 - 06:00)">Night Duty (20:00 - 06:00)</SelectItem>
                  <SelectItem value="Field Agronomy Shift (06:00 - 14:00)">Field Shift (06:00 - 14:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Verified Geolocation / Terminal</Label>
              <Input
                readOnly
                value={clockInRecord.location}
                className="bg-slate-50 dark:bg-slate-900 font-mono text-[11px]"
              />
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <p className="font-bold">✓ Automated Statutory Compliance</p>
              <p className="text-[11px]">
                Overtime beyond 8 hours automatically feeds into the statutory payroll calculation engine with 1.5x hourly rate.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setShowClockInModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Confirm Clock-In Punch
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================== 2. LEAVE APPLICATION MODAL ==================== */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Employee Self-Service (ESS) Leave Application
            </DialogTitle>
            <DialogDescription>
              Submit formal leave requests. Automatically updates remaining leave balance upon supervisor sign-off.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Applying Employee *</Label>
              <Select
                value={leaveForm.employeeId}
                onValueChange={(val) => setLeaveForm({ ...leaveForm, employeeId: val })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Leave Category *</Label>
                <Select
                  value={leaveForm.leaveType}
                  onValueChange={(val) => setLeaveForm({ ...leaveForm, leaveType: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual Paid Leave">Annual Paid Leave</SelectItem>
                    <SelectItem value="Medical / Sick Leave">Medical / Sick Leave</SelectItem>
                    <SelectItem value="Maternity / Paternity">Maternity / Paternity</SelectItem>
                    <SelectItem value="Compassionate / Bereavement">Compassionate Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Duration (Days) *</Label>
                <Input
                  type="number"
                  required
                  value={leaveForm.daysCount}
                  onChange={(e) => setLeaveForm({ ...leaveForm, daysCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Start Date *</Label>
                <Input
                  type="date"
                  required
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End Date *</Label>
                <Input
                  type="date"
                  required
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Reason / Explanation</Label>
              <Textarea
                placeholder="Details of leave request..."
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setShowLeaveModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Submit Leave Application
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
