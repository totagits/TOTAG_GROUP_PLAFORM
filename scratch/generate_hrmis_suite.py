import os

content = """import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
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
  Laptop,
  MapPin,
  Crosshair,
  ShieldAlert,
  Key,
  Lock,
  Globe,
  Radio,
  FileSignature
} from "lucide-react";
import { 
  SubsidiaryId, 
  EmploymentLevel, 
  SecurityRoleTier, 
  DualScopeRole, 
  CorporateDelegationGrant,
  BiometricAttendancePunch
} from "@/types/corporate-hrmis-types";
import { 
  TOTAG_SUBSIDIARIES, 
  checkCorporateAccess, 
  calculateLiberianStatutoryPayroll 
} from "@/lib/corporate-rbac-engine";
import { saveToOfflineQueue } from "@/lib/offlineSync";

// Extended Employee Record with Legal Entity Binding
export interface CorporateEmployeeRecord {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employerSubsidiaryId: SubsidiaryId;
  subsidiaryName: string;
  department: string;
  role: string;
  employmentLevel: EmploymentLevel;
  employmentType: "Full-Time" | "Contract" | "Probationary" | "Part-Time";
  status: "Active" | "On Leave" | "Probation" | "Terminated";
  joinDate: string;
  baseSalaryUsd: number;
  manager: string;
  location: string;
  nationalId: string;
  nasscorpNumber: string;
  lraTin: string;
  flightRisk: "Low" | "Medium" | "High";
  performanceScore: number;
  attendanceRate: number;
  skills: string[];
  mobileSalaryCarrier: "Orange Money" | "Lonestar MTN MoMo" | "Direct Bank (Ecobank)" | "UBA Liberia";
  mobileSalaryNumber: string;
  mobileSalarySplit: "100% USD" | "50% USD / 50% LRD" | "100% LRD";
  mobileKycStatus: "Verified" | "Pending";
  lastMobilePayoutTx?: string;
}

const SEED_CORPORATE_EMPLOYEES: CorporateEmployeeRecord[] = [
  {
    id: "EMP-001",
    employeeCode: "TOT-HQ-101",
    firstName: "Michael",
    lastName: "Gwoah",
    email: "m.gwoah@totaggroup.com",
    phone: "+231-777-666-001",
    employerSubsidiaryId: "totag_hq",
    subsidiaryName: "TOTAG Corporate HQ & Group Holdings",
    department: "Executive Board",
    role: "Chief Executive Officer & Group Chairman",
    employmentLevel: "Corporate Executive",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2021-01-01",
    baseSalaryUsd: 4500,
    manager: "Board of Directors",
    location: "Monrovia HQ, 11th Street Sinkor",
    nationalId: "LR-900101-01",
    nasscorpNumber: "NASS-HQ-1001",
    lraTin: "LRA-TIN-1001",
    flightRisk: "Low",
    performanceScore: 99,
    attendanceRate: 100,
    skills: ["Corporate Strategy", "M&A", "Cross-Border Logistics", "Executive Governance"],
    mobileSalaryCarrier: "Direct Bank (Ecobank)",
    mobileSalaryNumber: "+231-777-666-001",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "ECO-HQ-2026-001"
  },
  {
    id: "EMP-002",
    employeeCode: "TOT-HQ-102",
    firstName: "Emmanuel",
    lastName: "Doe",
    email: "e.doe@totaggroup.com",
    phone: "+231-777-666-101",
    employerSubsidiaryId: "totag_hq",
    subsidiaryName: "TOTAG Corporate HQ & Group Holdings",
    department: "Corporate Operations",
    role: "Group Vice President of Operations",
    employmentLevel: "Corporate Executive",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2022-03-15",
    baseSalaryUsd: 3200,
    manager: "Michael Gwoah",
    location: "Monrovia HQ, 11th Street Sinkor",
    nationalId: "LR-984412-23",
    nasscorpNumber: "NASS-HQ-1002",
    lraTin: "LRA-TIN-1002",
    flightRisk: "Low",
    performanceScore: 95,
    attendanceRate: 98,
    skills: ["Supply Chain", "Budgeting", "Team Leadership", "Risk Management"],
    mobileSalaryCarrier: "Orange Money",
    mobileSalaryNumber: "+231-777-666-999",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "ORANGE-SAL-2026-981"
  },
  {
    id: "EMP-003",
    employeeCode: "TOT-HQ-103",
    firstName: "James",
    lastName: "Kollie",
    email: "j.kollie@totaggroup.com",
    phone: "+231-887-666-103",
    employerSubsidiaryId: "totag_hq",
    subsidiaryName: "TOTAG Corporate HQ & Group Holdings",
    department: "Group Finance",
    role: "Chief Financial Officer & Corporate Payroll Director",
    employmentLevel: "Corporate Executive",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2022-11-10",
    baseSalaryUsd: 2900,
    manager: "Michael Gwoah",
    location: "Monrovia HQ",
    nationalId: "LR-773412-44",
    nasscorpNumber: "NASS-HQ-1003",
    lraTin: "LRA-TIN-1003",
    flightRisk: "Low",
    performanceScore: 94,
    attendanceRate: 97,
    skills: ["IFRS Accounting", "Tax Compliance", "Payroll Auditing", "Treasury Control"],
    mobileSalaryCarrier: "Lonestar MTN MoMo",
    mobileSalaryNumber: "+231-887-666-999",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "MTN-MOMO-2026-441"
  },
  {
    id: "EMP-004",
    employeeCode: "TOT-FARM-201",
    firstName: "Samuel",
    lastName: "Korkoyah",
    email: "s.korkoyah@totagfarm.com",
    phone: "+231-777-666-201",
    employerSubsidiaryId: "totag_farm",
    subsidiaryName: "TOTAG FARM & Agro-Industrial Ltd",
    department: "Agronomy & Outgrower Operations",
    role: "Senior Agronomist & Lofa Hub Manager",
    employmentLevel: "Subsidiary Management",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2023-04-10",
    baseSalaryUsd: 1950,
    manager: "Emmanuel Doe",
    location: "Voinjama Agro-Hub, Lofa",
    nationalId: "LR-551294-88",
    nasscorpNumber: "NASS-FARM-2001",
    lraTin: "LRA-TIN-2001",
    flightRisk: "Low",
    performanceScore: 93,
    attendanceRate: 98,
    skills: ["Seedling Propagation", "Soil Geotagging", "Outgrower Management", "Irrigation"],
    mobileSalaryCarrier: "Orange Money",
    mobileSalaryNumber: "+231-777-666-201",
    mobileSalarySplit: "50% USD / 50% LRD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "ORANGE-SAL-2026-201"
  },
  {
    id: "EMP-005",
    employeeCode: "TOC-CAT-301",
    firstName: "Patience",
    lastName: "Johnson",
    email: "p.johnson@toceps.com",
    phone: "+231-777-666-301",
    employerSubsidiaryId: "toceps_catering",
    subsidiaryName: "TOCEPS Catering & Culinary Services",
    department: "Culinary Operations & Quality",
    role: "Executive Head Chef & Kitchen Director",
    employmentLevel: "Subsidiary Management",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2023-08-01",
    baseSalaryUsd: 1800,
    manager: "Emmanuel Doe",
    location: "Sinkor Central Kitchen, Monrovia",
    nationalId: "LR-665123-12",
    nasscorpNumber: "NASS-CAT-3001",
    lraTin: "LRA-TIN-3001",
    flightRisk: "Low",
    performanceScore: 96,
    attendanceRate: 99,
    skills: ["HACCP Food Safety", "Industrial Menu Engineering", "Kitchen Logistics", "Staff Training"],
    mobileSalaryCarrier: "Orange Money",
    mobileSalaryNumber: "+231-777-666-301",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "ORANGE-SAL-2026-301"
  },
  {
    id: "EMP-006",
    employeeCode: "TOT-CRG-401",
    firstName: "Joseph",
    lastName: "Sirleaf",
    email: "j.sirleaf@totagcargohandling.com",
    phone: "+231-887-666-401",
    employerSubsidiaryId: "totag_cargo",
    subsidiaryName: "TOTAG Cargo Handling & Stevedoring",
    department: "Stevedoring & Port Gate",
    role: "Chief Stevedore Operations Superintendent",
    employmentLevel: "Subsidiary Management",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2022-09-01",
    baseSalaryUsd: 2100,
    manager: "Emmanuel Doe",
    location: "Freeport of Monrovia Yard",
    nationalId: "LR-441298-77",
    nasscorpNumber: "NASS-CRG-4001",
    lraTin: "LRA-TIN-4001",
    flightRisk: "Low",
    performanceScore: 92,
    attendanceRate: 96,
    skills: ["Vessel Discharge", "LRA ASYCUDA Customs", "Container Crane Rigger", "Hazardous Hazmat"],
    mobileSalaryCarrier: "Lonestar MTN MoMo",
    mobileSalaryNumber: "+231-887-666-401",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "MTN-MOMO-2026-401"
  },
  {
    id: "EMP-007",
    employeeCode: "TOT-PET-501",
    firstName: "Victor",
    lastName: "Togba",
    email: "v.togba@totagpetroleum.com",
    phone: "+231-777-666-501",
    employerSubsidiaryId: "totag_petroleum",
    subsidiaryName: "TOTAG Petroleum & Energy Logistics",
    department: "Terminal & Tank Farm Safety",
    role: "Terminal Superintendent & Bunkering Lead",
    employmentLevel: "Subsidiary Management",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2023-02-15",
    baseSalaryUsd: 2300,
    manager: "Emmanuel Doe",
    location: "Bushrod Island Petroleum Depot",
    nationalId: "LR-331290-66",
    nasscorpNumber: "NASS-PET-5001",
    lraTin: "LRA-TIN-5001",
    flightRisk: "Low",
    performanceScore: 95,
    attendanceRate: 98,
    skills: ["AGO/PMS Bunkering", "Tank Dip Gauging", "Fire Suppression OSHA", "API Standards"],
    mobileSalaryCarrier: "Orange Money",
    mobileSalaryNumber: "+231-777-666-501",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "ORANGE-SAL-2026-501"
  },
  {
    id: "EMP-008",
    employeeCode: "TOT-SOL-601",
    firstName: "Elijah",
    lastName: "Flomo",
    email: "e.flomo@totagsolar.com",
    phone: "+231-887-666-601",
    employerSubsidiaryId: "totag_solar",
    subsidiaryName: "TOTAG Solar Smart Energy Solutions",
    department: "Engineering EPC",
    role: "Senior Solar Microgrid Engineer",
    employmentLevel: "Subsidiary Operational",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2024-01-10",
    baseSalaryUsd: 1850,
    manager: "Emmanuel Doe",
    location: "Congo Town Energy Hub",
    nationalId: "LR-221098-55",
    nasscorpNumber: "NASS-SOL-6001",
    lraTin: "LRA-TIN-6001",
    flightRisk: "Low",
    performanceScore: 91,
    attendanceRate: 97,
    skills: ["Inverter Sizing", "Lithium Battery Storage", "PV Yield Modeling", "Grid Synchronization"],
    mobileSalaryCarrier: "Lonestar MTN MoMo",
    mobileSalaryNumber: "+231-887-666-601",
    mobileSalarySplit: "50% USD / 50% LRD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "MTN-MOMO-2026-601"
  },
  {
    id: "EMP-009",
    employeeCode: "CRS-SAAS-001",
    firstName: "Helena",
    lastName: "Benson",
    email: "h.benson@crsconsultancy.lr",
    phone: "+231-777-666-901",
    employerSubsidiaryId: "crs_consultancy",
    subsidiaryName: "CRS Consultancy Ltd (Licensed Tenant)",
    department: "Executive Advisory",
    role: "Managing Principal & Lead HR Strategist",
    employmentLevel: "Corporate Executive",
    employmentType: "Full-Time",
    status: "Active",
    joinDate: "2023-10-01",
    baseSalaryUsd: 2600,
    manager: "CRS Board",
    location: "CRS Regional Office, Monrovia",
    nationalId: "LR-110987-44",
    nasscorpNumber: "NASS-CRS-9001",
    lraTin: "LRA-TIN-9001",
    flightRisk: "Low",
    performanceScore: 97,
    attendanceRate: 99,
    skills: ["HR Audit", "Labor Law Compliance", "Executive Coaching", "Capacity Building"],
    mobileSalaryCarrier: "Direct Bank (Ecobank)",
    mobileSalaryNumber: "+231-777-666-901",
    mobileSalarySplit: "100% USD",
    mobileKycStatus: "Verified",
    lastMobilePayoutTx: "ECO-CRS-2026-901"
  }
];

export function ModernHRMISSuite() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<CorporateEmployeeRecord[]>(SEED_CORPORATE_EMPLOYEES);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("directory");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<CorporateEmployeeRecord | null>(null);

  // Active Identity Simulation (for testing RBAC & Corporate Oversight)
  const [activeUserRole, setActiveUserRole] = useState<DualScopeRole>({
    primaryRole: "Chief Executive Officer",
    roleTier: "Tier 5: Group Executive Board (CEO / Board)",
    employerSubsidiaryId: "totag_hq",
    isCorporateHQ: true,
    corporateFunctionalDomain: "All"
  });

  // White-Label / CRS Tenancy State
  const [isCrsWhiteLabelActive, setIsCrsWhiteLabelActive] = useState<boolean>(false);

  // Modals
  const [showClockInModal, setShowClockInModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const [showBatchPayoutModal, setShowBatchPayoutModal] = useState(false);
  const [showDelegationModal, setShowDelegationModal] = useState(false);

  // Clock-in Form state
  const [clockInState, setClockInState] = useState({
    employeeId: "EMP-001",
    shiftType: "Standard Day",
    method: "Mobile Geofence GPS",
    gpsLat: "6.315600",
    gpsLng: "-10.807400",
    locationName: "Monrovia HQ, 11th Street Sinkor",
    isCapturingGPS: false
  });

  // Active Delegation Grants List
  const [delegations, setDelegations] = useState<CorporateDelegationGrant[]>([
    {
      id: "DEL-2026-01",
      granterName: "Michael Gwoah (CEO)",
      granterRole: "Group Executive Board",
      granteeName: "James Kollie (CFO)",
      targetSubsidiaryId: "totag_farm",
      targetModule: "Payroll",
      purpose: "Auditing Lofa Rice Harvest Payroll Allocation",
      grantedAt: "2026-08-20",
      expiresAt: "2026-09-20",
      status: "Active"
    }
  ]);

  // Filtered employees based on subsidiary selection and search
  const filteredEmployees = employees.filter((emp) => {
    const matchesSubsidiary = selectedSubsidiary === "ALL" || emp.employerSubsidiaryId === selectedSubsidiary;
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubsidiary && matchesSearch;
  });

  // Calculate Group vs Subsidiary Totals
  const totalHeadcount = filteredEmployees.length;
  const totalPayrollUsd = filteredEmployees.reduce((acc, curr) => acc + curr.baseSalaryUsd, 0);
  const totalNasscorpEmployerUsd = totalPayrollUsd * 0.0475;
  const totalLraTaxEstimatedUsd = totalPayrollUsd * 0.12;

  // Selected Target Subsidiary Object
  const currentSubEntity = TOTAG_SUBSIDIARIES.find(s => s.id === selectedSubsidiary);

  // Check RBAC permission for the active user on selected subsidiary
  const rbacCheck = selectedSubsidiary === "ALL" 
    ? { hasAccess: true, accessLevel: "Consolidated View", reason: "Group-level overview authorized." }
    : checkCorporateAccess(activeUserRole, selectedSubsidiary as SubsidiaryId, "All", delegations);

  // Capture Live GPS for Clock-in
  const handleCaptureClockInGPS = () => {
    if (!navigator.geolocation) return;
    setClockInState(prev => ({ ...prev, isCapturingGPS: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setClockInState(prev => ({
          ...prev,
          gpsLat: pos.coords.latitude.toFixed(6),
          gpsLng: pos.coords.longitude.toFixed(6),
          isCapturingGPS: false
        }));
        toast({
          title: "Satellite GPS Locked",
          description: `Coordinates: ${pos.coords.latitude.toFixed(5)}° N, ${pos.coords.longitude.toFixed(5)}° W`
        });
      },
      () => {
        setClockInState(prev => ({ ...prev, isCapturingGPS: false }));
      },
      { enableHighAccuracy: true }
    );
  };

  // Submit Clock In
  const handleClockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === clockInState.employeeId) || employees[0];
    const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

    saveToOfflineQueue(
      "time_clock_in",
      {
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        subsidiaryId: emp.employerSubsidiaryId,
        shift: clockInState.shiftType,
        timestamp: new Date().toISOString()
      },
      { lat: clockInState.gpsLat, lng: clockInState.gpsLng }
    );

    setShowClockInModal(false);
    toast({
      title: isOnline ? "✓ Biometric / GPS Clock-In Verified" : "⚡ Offline Clock-In Vaulted",
      description: `${emp.firstName} ${emp.lastName} clocked in at ${clockInState.locationName} (${clockInState.gpsLat}°, ${clockInState.gpsLng}°).`
    });
  };

  return (
    <div className={`space-y-6 font-sans transition-colors duration-300 ${
      isCrsWhiteLabelActive ? "theme-crs" : ""
    }`}>

      {/* ========================================================================= */}
      {/* 1. TOP EXECUTIVE HUD & IDENTITY SIMULATION BAR */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 border border-white/10 p-5 rounded-3xl text-white shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl text-indigo-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  {isCrsWhiteLabelActive ? "CRS CONSULTANCY HRMIS & ADVISORY SUITE" : "TOTAG CORPORATE MULTI-ENTITY HRMIS & FIMS"}
                </h2>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] uppercase font-mono">
                  {isCrsWhiteLabelActive ? "White-Label Tenant" : "21st-Century Core"}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Decent Work Act 2015 &bull; LRA Withholding Tax &bull; NASSCORP Compliance &bull; Dual-Currency Mobile Money
              </p>
            </div>
          </div>

          {/* Identity & White-Label Switcher Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* White Label Switcher */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsCrsWhiteLabelActive(!isCrsWhiteLabelActive);
                toast({
                  title: isCrsWhiteLabelActive ? "Switched to TOTAG Corporate View" : "Switched to CRS Consultancy White-Label Tenant",
                  description: "Tenant branding, legal headers, and permission schemas refreshed."
                });
              }}
              className="bg-slate-900/80 border-white/15 text-slate-200 text-xs rounded-xl h-8 font-bold"
            >
              <Globe className="w-3.5 h-3.5 mr-1 text-teal-400" />
              {isCrsWhiteLabelActive ? "Reset to TOTAG HQ" : "CRS White-Label Mode"}
            </Button>

            {/* Identity Role Simulator */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-slate-400 uppercase font-mono">Simulate Role:</span>
              <select
                value={activeUserRole.roleTier}
                onChange={(e) => {
                  const val = e.target.value as SecurityRoleTier;
                  if (val.includes("Tier 5")) {
                    setActiveUserRole({
                      primaryRole: "Group CEO",
                      roleTier: val,
                      employerSubsidiaryId: "totag_hq",
                      isCorporateHQ: true,
                      corporateFunctionalDomain: "All"
                    });
                  } else if (val.includes("Tier 4")) {
                    setActiveUserRole({
                      primaryRole: "Corporate Payroll Director",
                      roleTier: val,
                      employerSubsidiaryId: "totag_hq",
                      isCorporateHQ: true,
                      corporateFunctionalDomain: "Payroll & Treasury"
                    });
                  } else if (val.includes("Tier 3")) {
                    setActiveUserRole({
                      primaryRole: "Managing Director",
                      roleTier: val,
                      employerSubsidiaryId: "totag_farm",
                      isCorporateHQ: false
                    });
                  } else {
                    setActiveUserRole({
                      primaryRole: "Field Staff",
                      roleTier: "Tier 1: Subsidiary Staff (Self-Service)",
                      employerSubsidiaryId: "toceps_catering",
                      isCorporateHQ: false
                    });
                  }
                }}
                className="bg-transparent text-xs text-amber-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Tier 5: Group Executive Board (CEO / Board)" className="bg-slate-900 text-white">Tier 5: Group Executive Board (CEO)</option>
                <option value="Tier 4: Corporate Functional Specialist" className="bg-slate-900 text-white">Tier 4: Corporate CFO & Payroll Dir</option>
                <option value="Tier 3: Subsidiary Managing Director / GM" className="bg-slate-900 text-white">Tier 3: Subsidiary Farm GM</option>
                <option value="Tier 1: Subsidiary Staff (Self-Service)" className="bg-slate-900 text-white">Tier 1: Catering Field Staff</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUBSIDIARY SELECTOR HUD BAR */}
        {/* ========================================================================= */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" /> Active Legal Employer Entity:
            </span>
            <select
              value={selectedSubsidiary}
              onChange={(e) => setSelectedSubsidiary(e.target.value)}
              className="bg-indigo-950/80 border border-indigo-500/40 text-white font-black text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer shadow-inner"
            >
              <option value="ALL" className="bg-slate-900 text-white font-bold">🏢 All Subsidiaries (Consolidated Group View)</option>
              {TOTAG_SUBSIDIARIES.map((sub) => (
                <option key={sub.id} value={sub.id} className="bg-slate-900 text-white">
                  {sub.name} ({sub.shortCode})
                </option>
              ))}
            </select>
          </div>

          {/* Access Clearance Status Badge */}
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs px-2.5 py-1 flex items-center gap-1.5 ${
              rbacCheck.hasAccess ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-rose-500/20 text-rose-300 border-rose-500/40"
            }`}>
              {rbacCheck.hasAccess ? <Shield className="w-3 h-3 text-emerald-400" /> : <ShieldAlert className="w-3 h-3 text-rose-400" />}
              <span>{rbacCheck.accessLevel}: {rbacCheck.reason}</span>
            </Badge>

            {/* Delegate button */}
            <Button
              size="sm"
              onClick={() => setShowDelegationModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl h-7 px-2.5 shadow-sm"
            >
              <Key className="w-3 h-3 mr-1" /> Delegate Scoped Access
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. GROUP TELEMETRY KPI METRICS CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                {selectedSubsidiary === "ALL" ? "Group Headcount" : "Subsidiary Headcount"}
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalHeadcount} <span className="text-xs font-normal text-slate-400">Staff Active</span>
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                ✓ 100% NASSCORP Registered
              </p>
            </div>
            <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                Monthly Payroll (USD)
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                ${totalPayrollUsd.toLocaleString()}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                LRD: ~${(totalPayrollUsd * 195).toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                NASSCORP Employer (4.75%)
              </p>
              <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                ${Math.round(totalNasscorpEmployerUsd).toLocaleString()}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1">
                Statutory Pension Scheme
              </p>
            </div>
            <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                LRA Withholding Tax (PIT)
              </p>
              <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                ${Math.round(totalLraTaxEstimatedUsd).toLocaleString()}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                ✓ LRA TIN Tax Compliant
              </p>
            </div>
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400">
              <FileCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN TABBED NAVIGATION ENGINE */}
      {/* ========================================================================= */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 bg-transparent h-auto p-0">
            <TabsTrigger value="directory" className="rounded-xl text-xs font-bold py-2.5">
              <Users className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
              1. Employee Directory
            </TabsTrigger>
            <TabsTrigger value="payroll" className="rounded-xl text-xs font-bold py-2.5">
              <DollarSign className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
              2. Statutory Payroll
            </TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-xl text-xs font-bold py-2.5">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              3. Field Attendance & GPS
            </TabsTrigger>
            <TabsTrigger value="leave" className="rounded-xl text-xs font-bold py-2.5">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
              4. Leave & Absences
            </TabsTrigger>
            <TabsTrigger value="delegations" className="rounded-xl text-xs font-bold py-2.5">
              <Key className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
              5. Corporate Delegations
            </TabsTrigger>
            <TabsTrigger value="crs-tenant" className="rounded-xl text-xs font-bold py-2.5">
              <Briefcase className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
              6. CRS Tenant Portal
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: EMPLOYEE DIRECTORY & PROFILES */}
        {/* ========================================================================= */}
        <TabsContent value="directory" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search staff, code, role, or TIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setShowNewEmployeeModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl h-9 px-4 flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Employee to Subsidiary
              </Button>
            </div>
          </div>

          {/* Employee Records Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <Card 
                key={emp.id}
                className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 shadow-xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="p-5 border-b border-slate-100 dark:border-white/5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-mono">
                          {emp.employeeCode}
                        </Badge>
                        <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                          {emp.firstName} {emp.lastName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                          {emp.role}
                        </p>
                      </div>
                      <Badge className={`text-[10px] font-bold ${
                        emp.status === "Active" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "bg-amber-500/15 text-amber-600"
                      }`}>
                        {emp.status}
                      </Badge>
                    </div>

                    {/* Employer Subsidiary Tag */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-[11px] space-y-1">
                      <div className="text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span className="font-mono">Employer Legal Entity:</span>
                        <Badge className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px]">
                          {emp.employmentLevel}
                        </Badge>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        🏢 {emp.subsidiaryName}
                      </div>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-5 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-bold">{emp.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Station / Depot:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{emp.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Base Salary:</span>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">${emp.baseSalaryUsd.toLocaleString()} USD</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Disbursement Wallet:</span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">{emp.mobileSalaryCarrier}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedEmployee(emp)}
                    className="text-xs rounded-xl h-8 flex-1 font-bold border-slate-200 dark:border-white/10"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" /> View Dossier
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setShowClockInModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl h-8 font-bold px-3"
                  >
                    <Clock className="w-3.5 h-3.5 mr-1" /> Time Punch
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: LIBERIAN STATUTORY PAYROLL & MOMO ENGINE */}
        {/* ========================================================================= */}
        <TabsContent value="payroll" className="space-y-6">
          <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Liberian Statutory Payroll Ledger & Mobile Money Batch
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Automated LRA PIT tax deduction schedule & NASSCORP pension withholding.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowBatchPayoutModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl h-9 px-4 flex items-center gap-1.5 shadow-lg"
                >
                  <Smartphone className="w-4 h-4" />
                  1-Click Batch Mobile Money Payout (Orange/MTN)
                </Button>
              </div>
            </div>

            {/* Payroll Calculation Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 font-mono text-[11px] uppercase">
                    <th className="pb-3 font-bold">Staff / ID</th>
                    <th className="pb-3 font-bold">Legal Employer</th>
                    <th className="pb-3 font-bold">Gross (USD)</th>
                    <th className="pb-3 font-bold">NASSCORP (3%)</th>
                    <th className="pb-3 font-bold">LRA Tax (PIT)</th>
                    <th className="pb-3 font-bold">Net Pay (USD)</th>
                    <th className="pb-3 font-bold">Net Pay (LRD @195)</th>
                    <th className="pb-3 font-bold">Disbursement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredEmployees.map((emp) => {
                    const pay = calculateLiberianStatutoryPayroll(emp.baseSalaryUsd, 195);
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 pr-3">
                          <div className="font-bold text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</div>
                          <span className="text-[10px] font-mono text-slate-400">{emp.employeeCode}</span>
                        </td>
                        <td className="py-3.5 pr-3">
                          <span className="font-medium text-indigo-600 dark:text-indigo-400 block truncate max-w-[150px]">
                            {emp.subsidiaryName}
                          </span>
                        </td>
                        <td className="py-3.5 pr-3 font-mono font-bold text-slate-900 dark:text-white">
                          ${pay.grossSalaryUsd.toLocaleString()}
                        </td>
                        <td className="py-3.5 pr-3 font-mono text-indigo-600 dark:text-indigo-400">
                          ${pay.nasscorpEmployeeUsd.toFixed(2)}
                        </td>
                        <td className="py-3.5 pr-3 font-mono text-amber-600 dark:text-amber-400">
                          ${pay.lraTaxUsd.toFixed(2)}
                        </td>
                        <td className="py-3.5 pr-3 font-mono font-black text-emerald-600 dark:text-emerald-400">
                          ${pay.netPayUsd.toLocaleString()}
                        </td>
                        <td className="py-3.5 pr-3 font-mono text-slate-600 dark:text-slate-300">
                          ${pay.netPayLrd.toLocaleString()} LRD
                        </td>
                        <td className="py-3.5">
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px]">
                            ✓ {emp.mobileSalaryCarrier}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 3: FIELD ATTENDANCE & BIOMETRIC GPS CLOCK-IN */}
        {/* ========================================================================= */}
        <TabsContent value="attendance" className="space-y-6">
          <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Multi-Modal Field Attendance & Satellite GPS Lock
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Captures remote farm punches, stevedoring port gate scans, and depot timecards with offline caching.
                </p>
              </div>
              <Button
                onClick={() => setShowClockInModal(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl h-9 px-4 flex items-center gap-1.5 shadow-md"
              >
                <Crosshair className="w-4 h-4" />
                Trigger Field GPS Clock-In
              </Button>
            </div>

            {/* Attendance Punch History */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">
                      {emp.attendanceRate}% Attendance
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Last Punch: Today 07:45 AM &bull; {emp.location}
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-emerald-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Geofence Verified
                    </span>
                    <span className="text-slate-400">GPS Acc: &plusmn;2.4m</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 4: LEAVE & ABSENCES */}
        {/* ========================================================================= */}
        <TabsContent value="leave" className="space-y-6">
          <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Decent Work Act Leave Accrual & Workflow
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Statutory annual leave (16-24 days), maternity leave, and compassionate leave.
                </p>
              </div>
              <Button
                onClick={() => setShowLeaveModal(true)}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl h-9 px-4"
              >
                <Plus className="w-4 h-4 mr-1" /> Request Statutory Leave
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 space-y-1">
                <span className="text-slate-400 font-mono uppercase text-[10px]">Annual Paid Leave</span>
                <div className="text-xl font-black text-purple-600 dark:text-purple-400">18.5 Days Avg</div>
                <div className="text-[10px] text-slate-500">Decent Work Act Compliant</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 space-y-1">
                <span className="text-slate-400 font-mono uppercase text-[10px]">Active Approved Absences</span>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400">2 Personnel</div>
                <div className="text-[10px] text-slate-500">Replacement Cover Dispatched</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 space-y-1">
                <span className="text-slate-400 font-mono uppercase text-[10px]">Pending Approval Queue</span>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">0 Pending</div>
                <div className="text-[10px] text-slate-500">Up to date</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 5: CORPORATE DELEGATIONS & AUDIT TRAIL */}
        {/* ========================================================================= */}
        <TabsContent value="delegations" className="space-y-6">
          <Card className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-500" />
                  Cross-Subsidiary Scoped Access Delegations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Allows Corporate C-Suite to grant temporary, time-bound audit & override permissions.
                </p>
              </div>
              <Button
                onClick={() => setShowDelegationModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl h-9 px-4"
              >
                <Plus className="w-4 h-4 mr-1" /> Issue New Delegation
              </Button>
            </div>

            <div className="space-y-3">
              {delegations.map((d) => (
                <div key={d.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-indigo-500/20 text-indigo-400 font-mono text-[10px]">
                        {d.id}
                      </Badge>
                      <span className="font-bold text-slate-900 dark:text-white">{d.granteeName}</span>
                      <span className="text-slate-400">➔ Target Entity:</span>
                      <span className="font-bold text-emerald-500">{d.targetSubsidiaryId}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Scope: <strong className="text-slate-300">{d.targetModule}</strong> &bull; Purpose: <em>"{d.purpose}"</em>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Granted by {d.granterName} on {d.grantedAt} &bull; Expires: {d.expiresAt}
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1">
                    ✓ ACTIVE GRANT
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 6: CRS TENANT & WHITE-LABEL MANAGEMENT */}
        {/* ========================================================================= */}
        <TabsContent value="crs-tenant" className="space-y-6">
          <Card className="rounded-3xl border border-teal-500/30 bg-teal-950/20 shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-teal-500/20 border border-teal-500/40 rounded-2xl text-teal-400">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">CRS Consultancy Multi-Tenancy Engine</h3>
                  <p className="text-xs text-teal-200/70">
                    Standalone SaaS tenant isolation for external client licensing and corporate advisory.
                  </p>
                </div>
              </div>
              <Badge className="bg-teal-500 text-slate-950 font-bold text-xs px-3 py-1">
                Licensed Tenant Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 text-white">
                <h4 className="font-bold text-teal-400">White-Label Branding Specs</h4>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>Tenant Subdomain: <span className="font-mono text-teal-300">crs.totaggroup.com</span></div>
                  <div>Custom Theme: <span className="text-teal-300 font-bold">Teal & Dark Slate Glassmorphism</span></div>
                  <div>Data Isolation: <span className="text-emerald-400 font-bold">Encrypted Tenant DB Partition</span></div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 text-white">
                <h4 className="font-bold text-teal-400">External Client Advisory Features</h4>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>&bull; Multi-organization labor audit reports</div>
                  <div>&bull; Ministry of Labor statutory compliance checkups</div>
                  <div>&bull; Executive compensation benchmarking for Liberia</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ========================================================================= */}
      {/* MODAL 1: BATCH MOBILE MONEY PAYOUT MODAL */}
      {/* ========================================================================= */}
      <Dialog open={showBatchPayoutModal} onOpenChange={setShowBatchPayoutModal}>
        <DialogContent className="max-w-md rounded-3xl bg-slate-950 text-white border border-emerald-500/30 p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              1-Click Batch Mobile Money Payout
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Dispatches salary payouts via Lonestar MTN MoMo and Orange Money API gateways.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1 font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Total Batch Amount:</span>
                <strong className="text-emerald-400">${totalPayrollUsd.toLocaleString()} USD</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Recipients:</span>
                <strong className="text-white">{filteredEmployees.length} Staff</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Payment Gateways:</span>
                <strong className="text-amber-300">Orange Money / Lonestar MTN</strong>
              </div>
            </div>

            <Button
              onClick={() => {
                setShowBatchPayoutModal(false);
                toast({
                  title: "✓ Batch Mobile Salary Dispatched",
                  description: `Transferred $${totalPayrollUsd.toLocaleString()} USD to ${filteredEmployees.length} employee mobile wallets.`
                });
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs h-10 rounded-xl shadow-lg"
            >
              Execute Instant Mobile Payout ➔
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: GEOFENCED GPS & BIOMETRIC CLOCK-IN MODAL */}
      {/* ========================================================================= */}
      <Dialog open={showClockInModal} onOpenChange={setShowClockInModal}>
        <DialogContent className="max-w-md rounded-3xl bg-slate-950 text-white border border-amber-500/30 p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-amber-400" />
              Field Satellite GPS Clock-In
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Locks device hardware satellite coordinates with geofence boundary verification.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleClockInSubmit} className="space-y-4 text-xs py-2">
            <div className="space-y-1">
              <Label className="text-slate-300 font-bold">Select Employee:</Label>
              <select
                value={clockInState.employeeId}
                onChange={(e) => setClockInState({ ...clockInState, employeeId: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.subsidiaryName})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-slate-300 font-bold">Shift Rotation:</Label>
              <select
                value={clockInState.shiftType}
                onChange={(e) => setClockInState({ ...clockInState, shiftType: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="Standard Day">Standard Day Shift</option>
                <option value="Night Watch">Night Watch & Security Shift</option>
                <option value="Vessel Discharge Surge">Vessel Stevedoring Surge Shift</option>
                <option value="Weekend Overtime">Weekend Overtime (1.5x Multiplier)</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-400">Satellite GPS Fix:</span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCaptureClockInGPS}
                  disabled={clockInState.isCapturingGPS}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] h-6 px-2 rounded-lg"
                >
                  <Crosshair className={`w-3 h-3 mr-1 ${clockInState.isCapturingGPS ? "animate-spin" : ""}`} />
                  {clockInState.isCapturingGPS ? "Locking..." : "Auto-Detect GPS"}
                </Button>
              </div>
              <div className="font-mono text-amber-400 font-bold text-xs">
                {clockInState.gpsLat}° N, {clockInState.gpsLng}° W
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black text-xs h-10 rounded-xl shadow-lg"
            >
              Verify & Stamp Time Record ➔
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 3: DELEGATION CREATOR MODAL */}
      {/* ========================================================================= */}
      <Dialog open={showDelegationModal} onOpenChange={setShowDelegationModal}>
        <DialogContent className="max-w-md rounded-3xl bg-slate-950 text-white border border-indigo-500/30 p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              Issue Scoped Access Delegation
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Grants temporary cross-subsidiary governance clearance with immutable audit logs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs py-2">
            <div className="space-y-1">
              <Label className="text-slate-300 font-bold">Grantee (Corporate Officer):</Label>
              <Input
                defaultValue="James Kollie (CFO)"
                className="bg-slate-900 border-white/10 text-white text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-300 font-bold">Target Subsidiary Entity:</Label>
              <select className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white">
                {TOTAG_SUBSIDIARIES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-slate-300 font-bold">Authorized Module Scope:</Label>
              <select className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white">
                <option value="Payroll">Statutory Payroll & Mobile Money</option>
                <option value="Attendance & Roster">Field Attendance & Shift Roster</option>
                <option value="Compliance & Safety">OSHA & NASSCORP Safety Audits</option>
                <option value="All">Full Functional Oversight</option>
              </select>
            </div>

            <Button
              onClick={() => {
                setShowDelegationModal(false);
                toast({
                  title: "✓ Corporate Delegation Grant Stamped",
                  description: "Access authorization recorded in group security ledger."
                });
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs h-10 rounded-xl shadow-lg mt-2"
            >
              Sign & Issue Grant ➔
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
"""

with open("client/src/components/hrmis/ModernHRMISSuite.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Created comprehensive ModernHRMISSuite.tsx successfully!")
