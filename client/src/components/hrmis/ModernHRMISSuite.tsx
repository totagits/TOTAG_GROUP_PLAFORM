import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  RotateCcw,
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
  FileSignature,
  ArrowRight,
  Scan
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


const SEED_CRS_CAMPAIGN_WORKERS: CRSTemporaryWorker[] = [];

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
  // CRS Campaign Workforce State & Modals
  const [crsWorkers, setCrsWorkers] = useState<CRSTemporaryWorker[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("totag_crs_workers_live_v1");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("totag_crs_workers_live_v1", JSON.stringify(crsWorkers));
    }
  }, [crsWorkers]);

  // SOW Sub-Module Interactive Views State
  const [activeSowPillar, setActiveSowPillar] = useState<"overview" | "logistics" | "distribution" | "waste" | "admin">("overview");
  const [showExportAuditModal, setShowExportAuditModal] = useState(false);
  const [showWaybillModal, setShowWaybillModal] = useState(false);
  const [showWasteManifestModal, setShowWasteManifestModal] = useState(false);

  // Live 3PL Waybills List
  const [waybills, setWaybills] = useState<Array<{ id: string; waybillNo: string; site: string; bales: number; nets: number; driver: string; status: string; date: string }>>([
    { id: "WB-01", waybillNo: "WB-3PL-99201", site: "Sinje Preposition Site (PPS-04)", bales: 20, nets: 1000, driver: "Mohammed Dukuly", status: "Witnessed & Bonded", date: "2026-11-20" }
  ]);

  // Live Waste Manifests List
  const [wasteManifests, setWasteManifests] = useState<Array<{ id: string; manifestNo: string; pps: string; bundles49: number; totalBags: number; straps: number; status: string; date: string }>>([
    { id: "WM-01", manifestNo: "WSC-GAR-2026-08", pps: "Sinje PPS Waste Bay", bundles49: 2, totalBags: 98, straps: 98, status: "Handed to 3PL", date: "2026-11-25" }
  ]);

  const [selectedCrsWorker, setSelectedCrsWorker] = useState<CRSTemporaryWorker | null>(null);
  const [showCrsRecruitModal, setShowCrsRecruitModal] = useState(false);
  const [showCrsPhoneContractModal, setShowCrsPhoneContractModal] = useState(false);
  const [showCrsQuotaModal, setShowCrsQuotaModal] = useState(false);
  const [showCrsSupervisorClockInModal, setShowCrsSupervisorClockInModal] = useState(false);

  // New Worker Recruitment Form
  const [newCrsWorkerForm, setNewCrsWorkerForm] = useState({
    fullName: "",
    phone: "",
    nationalId: "",
    role: "HHR Registration Agent" as CRSTemporaryWorker["role"],
    county: "Grand Cape Mount",
    district: "Garwula" as CRSTemporaryWorker["district"],
    healthFacilityCatchment: "Sinje Health Center (HF-04)",
    contractWindowDays: 10,
    dailyRateUsd: 25,
    momoCarrier: "Orange Money" as CRSTemporaryWorker["momoCarrier"],
    momoWalletNumber: "",
    byodPhoneModel: "Samsung Galaxy A14 (Android 13)",
    byodPhoneImei: ""
  });

  // Quota Update Form
  const [quotaUpdateForm, setQuotaUpdateForm] = useState({
    workerId: "",
    todayHhrRegistered: 25,
    todayItnDistributed: 0,
    notes: "All households geotagged per CRS SOP."
  });

  // Digital Phone Contract State ($129 Liability Clause)
  const [phoneContractSignature, setPhoneContractSignature] = useState({
    workerName: "",
    workerNationalId: "",
    phoneImei: "",
    agreedTo129Deduction: true,
    signatureName: ""
  });

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
  // Handle Recruitment Submit
  const handleRecruitCrsWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrsWorkerForm.fullName || !newCrsWorkerForm.phone) {
      toast({ title: "Error", description: "Please enter candidate full name and phone number.", variant: "destructive" });
      return;
    }
    const newWorker: CRSTemporaryWorker = {
      id: `CRS-W-${String(crsWorkers.length + 1).padStart(3, '0')}`,
      badgeCode: `TOT-CRS-${newCrsWorkerForm.role.includes("HHR") ? "HHR" : newCrsWorkerForm.role.includes("Supervisor") ? "SUP" : "DP"}-${100 + crsWorkers.length + 1}`,
      fullName: newCrsWorkerForm.fullName,
      phone: newCrsWorkerForm.phone,
      nationalId: newCrsWorkerForm.nationalId || "LR-PENDING-00",
      role: newCrsWorkerForm.role,
      county: newCrsWorkerForm.county,
      district: newCrsWorkerForm.district,
      healthFacilityCatchment: newCrsWorkerForm.healthFacilityCatchment,
      contractWindowDays: Number(newCrsWorkerForm.contractWindowDays),
      contractStartDate: "2026-11-23",
      contractEndDate: "2026-12-02",
      dailyRateUsd: Number(newCrsWorkerForm.dailyRateUsd),
      totalContractValueUsd: Number(newCrsWorkerForm.contractWindowDays) * Number(newCrsWorkerForm.dailyRateUsd),
      momoCarrier: newCrsWorkerForm.momoCarrier,
      momoWalletNumber: newCrsWorkerForm.momoWalletNumber || newCrsWorkerForm.phone,
      momoKycVerified: true,
      byodPhoneModel: newCrsWorkerForm.byodPhoneModel,
      byodPhoneImei: newCrsWorkerForm.byodPhoneImei || "IMEI-PENDING-CHECK",
      byodConsentSigned: false,
      pseaCodeOfConductSigned: true,
      dailyHhrTarget: newCrsWorkerForm.role.includes("HHR") ? 25 : 0,
      actualHhrCompleted: 0,
      dailyItnTarget: newCrsWorkerForm.role.includes("Distribution") ? 50 : 0,
      actualItnDistributed: 0,
      performanceRatio: 100,
      materialsReturnedStatus: "Pending Campaign Completion",
      disbursementStatus: "Daily Staged",
      loginPhone: newCrsWorkerForm.phone,
      temporaryPassword: `CRS-${Math.floor(1000 + Math.random() * 9000)}`,
      isFirstLogin: true,
      credentialsDispatchedSms: true
    };

    setCrsWorkers(prev => [newWorker, ...prev]);
    setShowCrsRecruitModal(false);
    toast({
      title: "✓ Temporary Worker Registered & Credentials Dispatched",
      description: `SMS & Email sent to ${newWorker.phone}: Login ID: ${newWorker.phone} | Temporary PIN: ${newWorker.temporaryPassword}. Worker will set permanent password on first login.`
    });
  };

  // Handle Sign $129 Phone Custody Contract
  const handleSignPhoneContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrsWorker) return;
    setCrsWorkers(prev => prev.map(w => {
      if (w.id === selectedCrsWorker.id) {
        return {
          ...w,
          byodPhoneImei: phoneContractSignature.phoneImei || w.byodPhoneImei,
          byodConsentSigned: true
        };
      }
      return w;
    }));
    setShowCrsPhoneContractModal(false);
    toast({
      title: "✓ $129.00 Device Liability Contract Signed & Sealed",
      description: `${selectedCrsWorker.fullName} signed legal custody for device IMEI: ${phoneContractSignature.phoneImei || selectedCrsWorker.byodPhoneImei}. $129 deduction clause active.`
    });
  };

  // Handle Log Daily Quota
  const handleLogDailyQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotaUpdateForm.workerId) return;
    setCrsWorkers(prev => prev.map(w => {
      if (w.id === quotaUpdateForm.workerId) {
        const done = Number(quotaUpdateForm.todayHhrRegistered) || Number(quotaUpdateForm.todayItnDistributed);
        const target = w.dailyHhrTarget > 0 ? w.dailyHhrTarget : w.dailyItnTarget;
        const ratio = target > 0 ? Math.round((done / target) * 100) : 100;
        return {
          ...w,
          actualHhrCompleted: w.dailyHhrTarget > 0 ? done : 0,
          actualItnDistributed: w.dailyItnTarget > 0 ? done : 0,
          performanceRatio: ratio
        };
      }
      return w;
    }));
    setShowCrsQuotaModal(false);
    toast({
      title: "✓ Daily Quota Progress Stamped",
      description: "Supervisor verification logged in CRS Daily Progress Registry."
    });
  };


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
            {/* Field Worker Portal Direct Launcher */}
            <a
              href="/field#/field"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-950" />
              <span>Open Field Worker App ➔</span>
            </a>

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
            <TabsTrigger value="crs-campaign" className="rounded-xl text-xs font-black py-2.5 text-teal-700 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20">
              <Briefcase className="w-3.5 h-3.5 mr-1.5 text-teal-500 animate-pulse" />
              6. CRS Campaign (10-14D Temporary Staff)
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
        {/* TAB 6: CRS CONSULTANCY 10-14 DAY CAMPAIGN WORKFORCE & OPERATIONS HUB */}
        {/* ========================================================================= */}
        <TabsContent value="crs-campaign" className="space-y-6">
          <Card className="rounded-3xl border border-teal-500/40 bg-slate-950 text-white shadow-2xl p-6 space-y-6">
            
            {/* CAMPAIGN HEADER & SCOPE OVERVIEW */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center space-x-3.5">
                <div className="p-3.5 bg-teal-500/20 border border-teal-500/40 rounded-2xl text-teal-400">
                  <Briefcase className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black text-white">
                      CRS LLIN CAMPAIGN — TEMPORARY WORKFORCE & SOW OPERATIONS HUB
                    </h3>
                    <Badge className="bg-emerald-500 text-slate-950 font-mono font-black text-[10px]">
                      LIVE REAL-TIME MODE
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Client: <strong>Catholic Relief Services (CRS) / Global Fund / NMCP / MOH</strong> &bull; Contractor: <strong>TOTAG GROUP</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-3 py-1">
                  📅 Nov 16 - Dec 18, 2026 Window
                </Badge>
                <Button
                  size="sm"
                  onClick={() => setShowExportAuditModal(true)}
                  className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-xs rounded-xl h-8 px-3 shadow-md"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> Open Official CRS Daily Audit Report
                </Button>
              </div>
            </div>

            {/* REAL-TIME CAMPAIGN TELEMETRY KPI HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Live Headcount</span>
                <div className="text-2xl font-black text-teal-400">{crsWorkers.length} <span className="text-xs font-normal text-slate-400">Staff</span></div>
                <div className="text-[10px] text-slate-400">Target: 202 Field/Command</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Signed $129 Contracts</span>
                <div className="text-2xl font-black text-amber-400">{crsWorkers.filter(w => w.byodConsentSigned).length} / {crsWorkers.length || 0}</div>
                <div className="text-[10px] text-amber-300 font-bold">{crsWorkers.length > 0 ? `${Math.round((crsWorkers.filter(w => w.byodConsentSigned).length / crsWorkers.length) * 100)}% Signed` : "Awaiting Recruits"}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">HHR Door-to-Door Quota</span>
                <div className="text-2xl font-black text-emerald-400">
                  {crsWorkers.reduce((acc, curr) => acc + (curr.actualHhrCompleted || 0), 0)} <span className="text-xs font-normal text-slate-400">HH Done</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">Target: 38,291 Households</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">3PL Waybill Bales</span>
                <div className="text-2xl font-black text-sky-400">{waybills.reduce((acc, curr) => acc + curr.bales, 0)} <span className="text-xs font-normal text-slate-400">Bales</span></div>
                <div className="text-[10px] text-slate-400">{waybills.reduce((acc, curr) => acc + curr.nets, 0)} Nets Witnessed</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 space-y-1 col-span-2 lg:col-span-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">49-in-1 Waste Bundles</span>
                <div className="text-2xl font-black text-purple-400">{wasteManifests.reduce((acc, curr) => acc + curr.bundles49, 0)} <span className="text-xs font-normal text-slate-400">Bundles</span></div>
                <div className="text-[10px] text-purple-400 font-bold">{wasteManifests.reduce((acc, curr) => acc + curr.totalBags, 0)} Empty Bags Returned</div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* TOTAG 4 SCOPE OF WORK (SOW) INTERACTIVE PILLARS CONSOLE */}
            {/* ========================================================================= */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-teal-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-400" />
                    TOTAG SERVICE PROVIDER SCOPE OF WORK (SOW) COMMAND & CONTROL CONSOLE
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Click any SOW Pillar to open its dedicated operational console, waybill ledger, or reverse manifest.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant={activeSowPillar === "overview" ? "default" : "outline"}
                    onClick={() => setActiveSowPillar("overview")}
                    className="text-[10px] h-7 px-2.5 rounded-xl font-bold"
                  >
                    All 4 Pillars
                  </Button>
                  <Button
                    size="sm"
                    variant={activeSowPillar === "logistics" ? "default" : "outline"}
                    onClick={() => setActiveSowPillar("logistics")}
                    className="text-[10px] h-7 px-2.5 rounded-xl font-bold text-blue-300"
                  >
                    1. Logistics (3PL)
                  </Button>
                  <Button
                    size="sm"
                    variant={activeSowPillar === "distribution" ? "default" : "outline"}
                    onClick={() => setActiveSowPillar("distribution")}
                    className="text-[10px] h-7 px-2.5 rounded-xl font-bold text-emerald-300"
                  >
                    2. Distribution
                  </Button>
                  <Button
                    size="sm"
                    variant={activeSowPillar === "waste" ? "default" : "outline"}
                    onClick={() => setActiveSowPillar("waste")}
                    className="text-[10px] h-7 px-2.5 rounded-xl font-bold text-purple-300"
                  >
                    3. Waste (49-in-1)
                  </Button>
                  <Button
                    size="sm"
                    variant={activeSowPillar === "admin" ? "default" : "outline"}
                    onClick={() => setActiveSowPillar("admin")}
                    className="text-[10px] h-7 px-2.5 rounded-xl font-bold text-amber-300"
                  >
                    4. Governance
                  </Button>
                </div>
              </div>

              {/* PILLAR SUB-VIEWS */}
              {activeSowPillar === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                  
                  {/* Pillar 1: Logistics & 3PL Receiving */}
                  <div 
                    onClick={() => setActiveSowPillar("logistics")}
                    className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-500/20 text-blue-300 border-0 text-[10px] font-bold">
                        1. Logistics & 3PL
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h5 className="font-bold text-white text-xs">Logistics & Insurance Bond</h5>
                    <ul className="text-[11px] text-slate-400 space-y-1">
                      <li>&bull; BYOD Consent & digital app deployed</li>
                      <li>&bull; 3PL delivery waybill verification at PPS/DPs</li>
                      <li>&bull; <strong>All-Risk Insurance Bond</strong> active on 84.9k nets</li>
                      <li>&bull; Weekly CMT inventory reconciliation</li>
                    </ul>
                    <div className="pt-1 font-mono text-[10px] text-blue-400 font-bold">
                      Open Logistics Console ➔
                    </div>
                  </div>

                  {/* Pillar 2: Distribution Requirements */}
                  <div 
                    onClick={() => setActiveSowPillar("distribution")}
                    className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px] font-bold">
                        2. Distribution
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h5 className="font-bold text-white text-xs">HHR & ITN Issuance</h5>
                    <ul className="text-[11px] text-slate-400 space-y-1">
                      <li>&bull; Urban door-to-door (Montserrado/Margibi)</li>
                      <li>&bull; Rural 2-phase: HHR + 91 Fixed/Mobile DPs</li>
                      <li>&bull; <strong>Token-card verification</strong> before issue</li>
                      <li>&bull; Mandatory barcode scan & SBC sensitization</li>
                    </ul>
                    <div className="pt-1 font-mono text-[10px] text-emerald-400 font-bold">
                      Open Distribution Console ➔
                    </div>
                  </div>

                  {/* Pillar 3: Waste Management (49-in-1) */}
                  <div 
                    onClick={() => setActiveSowPillar("waste")}
                    className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-500/20 text-purple-300 border-0 text-[10px] font-bold">
                        3. Waste Reverse
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h5 className="font-bold text-white text-xs">49-in-1 Bale Reverse Logistics</h5>
                    <ul className="text-[11px] text-slate-400 space-y-1">
                      <li>&bull; 100% empty bag & strap retrieval</li>
                      <li>&bull; <strong>49 bags packed into 1 outer bag</strong></li>
                      <li>&bull; Bundled straps with numbered tallies</li>
                      <li>&bull; Dedicated Waste Stock Cards for 3PL</li>
                    </ul>
                    <div className="pt-1 font-mono text-[10px] text-purple-400 font-bold">
                      Open Waste Console ➔
                    </div>
                  </div>

                  {/* Pillar 4: Admin & Governance */}
                  <div 
                    onClick={() => setActiveSowPillar("admin")}
                    className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <Badge className="bg-amber-500/20 text-amber-300 border-0 text-[10px] font-bold">
                        4. Administration
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h5 className="font-bold text-white text-xs">Global Fund & CHT Oversight</h5>
                    <ul className="text-[11px] text-slate-400 space-y-1">
                      <li>&bull; Global Fund financial procedure compliance</li>
                      <li>&bull; Local recruitment of field personnel</li>
                      <li>&bull; Daily escalation to CMT/CHTs & MOH</li>
                      <li>&bull; Decent Work Act & PSEA safeguarding</li>
                    </ul>
                    <div className="pt-1 font-mono text-[10px] text-amber-400 font-bold">
                      Open Governance Console ➔
                    </div>
                  </div>
                </div>
              )}

              {/* PILLAR 1 EXPANDED: 3PL LOGISTICS & WAYBILL CONSOLE */}
              {activeSowPillar === "logistics" && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h5 className="font-black text-white text-sm flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-400" />
                        Pillar 1: 3PL Delivery Witnessing & All-Risk Insurance Bond Ledger
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        Tracks physical delivery receipts from 3PL at District Warehouses, Preposition Sites (PPS), and Distribution Points (DPs).
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowWaybillModal(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-8 px-3 rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Record 3PL Waybill Receipt
                    </Button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase bg-slate-900">
                          <th className="p-3">Waybill #</th>
                          <th className="p-3">Preposition Site (PPS)</th>
                          <th className="p-3">Bales Received</th>
                          <th className="p-3">Total Nets</th>
                          <th className="p-3">3PL Driver</th>
                          <th className="p-3">Insurance Bond Status</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono">
                        {waybills.map((wb) => (
                          <tr key={wb.id} className="hover:bg-slate-800/40">
                            <td className="p-3 text-blue-400 font-bold">{wb.waybillNo}</td>
                            <td className="p-3 text-slate-200">{wb.site}</td>
                            <td className="p-3 text-white font-bold">{wb.bales} Bales</td>
                            <td className="p-3 text-emerald-400 font-bold">{wb.nets.toLocaleString()} Nets</td>
                            <td className="p-3 text-slate-300">{wb.driver}</td>
                            <td className="p-3">
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px]">
                                ✓ {wb.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-slate-400">{wb.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PILLAR 2 EXPANDED: DISTRIBUTION & BARCODE CONSOLE */}
              {activeSowPillar === "distribution" && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-black text-white text-sm flex items-center gap-2">
                        <Scan className="w-4 h-4 text-emerald-400" />
                        Pillar 2: Distribution Operations & Anti-Fraud Token/Barcode Scanner
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        Tracks double-phase rural model (HHR registration + Fixed/Mobile DP net issuance) with token verification.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono">Total Planned Households:</span>
                      <div className="text-xl font-bold text-white">38,291 HH</div>
                      <div className="text-[10px] text-emerald-400 font-bold">50 HH / 2-person team / day</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono">Total Planned ITN Nets:</span>
                      <div className="text-xl font-bold text-white">84,952 Nets</div>
                      <div className="text-[10px] text-sky-400 font-bold">200 Nets / 4-person team / day</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono">Distribution Locations:</span>
                      <div className="text-xl font-bold text-white">91 Fixed / Mobile DPs</div>
                      <div className="text-[10px] text-purple-400 font-bold">Sequenced across 5 Districts</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PILLAR 3 EXPANDED: 49-IN-1 WASTE CONSOLE */}
              {activeSowPillar === "waste" && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h5 className="font-black text-white text-sm flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-400" />
                        Pillar 3: 49-in-1 Waste Reverse Logistics & Stock Cards Ledger
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        Mandatory stacking of 49 empty bale bags inside 1 outer sealed bag (50 total) for 3PL collection.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowWasteManifestModal(true)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-8 px-3 rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Log Waste Return Manifest
                    </Button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase bg-slate-900">
                          <th className="p-3">Waste Manifest #</th>
                          <th className="p-3">PPS Return Location</th>
                          <th className="p-3">49-in-1 Bundles</th>
                          <th className="p-3">Total Empty Bags</th>
                          <th className="p-3">Straps Tied</th>
                          <th className="p-3">3PL Handover Status</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono">
                        {wasteManifests.map((wm) => (
                          <tr key={wm.id} className="hover:bg-slate-800/40">
                            <td className="p-3 text-purple-400 font-bold">{wm.manifestNo}</td>
                            <td className="p-3 text-slate-200">{wm.pps}</td>
                            <td className="p-3 text-white font-bold">{wm.bundles49} Bundles</td>
                            <td className="p-3 text-emerald-400 font-bold">{wm.totalBags} Bags</td>
                            <td className="p-3 text-amber-300">{wm.straps} Straps</td>
                            <td className="p-3">
                              <Badge className="bg-purple-500/20 text-purple-300 border-0 text-[10px]">
                                ✓ {wm.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-slate-400">{wm.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PILLAR 4 EXPANDED: GOVERNANCE & PSEA CONSOLE */}
              {activeSowPillar === "admin" && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-black text-white text-sm flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Pillar 4: Organizational Governance, Global Fund Compliance & PSEA
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        Operational compliance with Decent Work Act 2015, CMT Joint Supervision, and Zero-Tolerance PSEA protocols.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Safeguarding & PSEA Incident Escalation Queue:</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">0 Active Infractions</Badge>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Global Fund Financial Audit Status:</span>
                      <strong className="text-emerald-400">100% Compliant & Reconciled</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>County Health Team (CHT) Joint Sign-off:</span>
                      <strong className="text-teal-300">Signed Daily Briefing Registers Active</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION: 4 INTERACTIVE CAMPAIGN ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Action 1: Recruit Worker */}
              <Button
                onClick={() => setShowCrsRecruitModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl h-12 flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                1. Recruit Temporary Worker
              </Button>

              {/* Action 2: Sign $129 Phone Contract */}
              <Button
                onClick={() => {
                  if (crsWorkers.length === 0) {
                    toast({ title: "No Workers Registered", description: "Please recruit a temporary worker first before signing contract.", variant: "destructive" });
                    return;
                  }
                  const target = crsWorkers.find(w => !w.byodConsentSigned) || crsWorkers[0];
                  setSelectedCrsWorker(target);
                  setPhoneContractSignature({
                    workerName: target.fullName,
                    workerNationalId: target.nationalId,
                    phoneImei: target.byodPhoneImei,
                    agreedTo129Deduction: true,
                    signatureName: target.fullName
                  });
                  setShowCrsPhoneContractModal(true);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-2xl h-12 flex items-center justify-center gap-2 shadow-lg"
              >
                <FileSignature className="w-4 h-4" />
                2. Sign $129 Phone Contract
              </Button>

              {/* Action 3: Field GPS Clock-In */}
              <Button
                onClick={() => setShowCrsSupervisorClockInModal(true)}
                className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-2xl h-12 flex items-center justify-center gap-2 shadow-lg"
              >
                <MapPin className="w-4 h-4" />
                3. Field GPS Clock-In Punch
              </Button>

              {/* Action 4: Log Quota */}
              <Button
                onClick={() => {
                  if (crsWorkers.length === 0) {
                    toast({ title: "No Workers Registered", description: "Please recruit a temporary worker first before logging quota.", variant: "destructive" });
                    return;
                  }
                  setQuotaUpdateForm({
                    workerId: crsWorkers[0].id,
                    todayHhrRegistered: 25,
                    todayItnDistributed: 0,
                    notes: "All households geotagged per CRS SOP."
                  });
                  setShowCrsQuotaModal(true);
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-2xl h-12 flex items-center justify-center gap-2 shadow-lg"
              >
                <Target className="w-4 h-4" />
                4. Log Daily Quota & Output
              </Button>
            </div>

            {/* SECTION: TEMPORARY WORKFORCE ROSTER TABLE WITH LIVE ACTION BUTTONS */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-400" />
                    Temporary Campaign Personnel Roster ({crsWorkers.length} Field Staff Onboarded)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Grand Cape Mount, Montserrado & Margibi &bull; Mandatory $129 Phone Contract, Daily Quotas & MoMo Wallets
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (crsWorkers.length === 0) {
                        toast({ title: "No Staff to Disburse", description: "Please recruit temporary workers before running batch Mobile Money.", variant: "destructive" });
                        return;
                      }
                      toast({
                        title: "✓ Batch Staged Mobile DSA Dispatched",
                        description: `Disbursed $${crsWorkers.reduce((acc, curr) => acc + (curr.dailyRateUsd * 5), 0)} USD advance via Orange Money / MTN MoMo to ${crsWorkers.length} personnel.`
                      });
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl h-8 px-3 shadow-md"
                  >
                    <Smartphone className="w-3.5 h-3.5 mr-1" /> Pay Staged Mobile DSA
                  </Button>
                </div>
              </div>

              {crsWorkers.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-white/10 bg-slate-900/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white">No Temporary Campaign Staff Registered Yet</h5>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Click <strong>"+ 1. Recruit Temporary Worker"</strong> above to onboard HHR agents, distribution leads, and field supervisors with automated SMS credentials.
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowCrsRecruitModal(true)}
                    className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-xs h-9 px-4 rounded-xl shadow-md"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Register First Campaign Worker
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase bg-slate-900">
                        <th className="p-3 font-bold">Badge / Worker</th>
                        <th className="p-3 font-bold">Role & District</th>
                        <th className="p-3 font-bold">Health Facility Catchment</th>
                        <th className="p-3 font-bold">$129 Phone Custody</th>
                        <th className="p-3 font-bold">Daily Quota Status</th>
                        <th className="p-3 font-bold">Contract (Days/Rate)</th>
                        <th className="p-3 font-bold">MoMo Wallet</th>
                        <th className="p-3 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {crsWorkers.map((worker) => (
                        <tr key={worker.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-white">{worker.fullName}</div>
                            <span className="font-mono text-[10px] text-teal-400">{worker.badgeCode}</span>
                          </td>
                          <td className="p-3">
                            <Badge className="bg-slate-800 text-slate-200 text-[10px] border-0 font-bold">
                              {worker.role}
                            </Badge>
                            <div className="text-[10px] text-slate-400 mt-0.5">{worker.district} ({worker.county})</div>
                          </td>
                          <td className="p-3">
                            <span className="text-slate-300 text-[11px] block max-w-[150px] truncate">
                              {worker.healthFacilityCatchment}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[11px]">
                            {worker.byodConsentSigned ? (
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px] flex items-center gap-1 w-fit">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <span>$129 Contract Signed</span>
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedCrsWorker(worker);
                                  setPhoneContractSignature({
                                    workerName: worker.fullName,
                                    workerNationalId: worker.nationalId,
                                    phoneImei: worker.byodPhoneImei,
                                    agreedTo129Deduction: true,
                                    signatureName: worker.fullName
                                  });
                                  setShowCrsPhoneContractModal(true);
                                }}
                                className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] h-6 px-2 rounded-lg font-bold"
                              >
                                <FileSignature className="w-3 h-3 mr-1" /> Sign Contract
                              </Button>
                            )}
                            <span className="text-[9px] text-slate-500 block mt-0.5">IMEI: {worker.byodPhoneImei}</span>
                          </td>
                          <td className="p-3 font-mono">
                            <div className={`font-bold ${worker.performanceRatio >= 90 ? "text-emerald-400" : "text-rose-400"}`}>
                              {worker.dailyHhrTarget > 0 
                                ? `${worker.actualHhrCompleted}/${worker.dailyHhrTarget} HH/day` 
                                : `${worker.actualItnDistributed}/${worker.dailyItnTarget} Nets/day`}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px] text-slate-400">{worker.performanceRatio}%</span>
                              {worker.performanceRatio < 90 && (
                                <Badge className="bg-rose-500/20 text-rose-300 text-[8px] border-0 animate-pulse">
                                  Under Quota &bull; Reserve Trigger
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-mono">
                            <div className="text-white font-bold">${worker.totalContractValueUsd} USD</div>
                            <span className="text-[10px] text-slate-400">{worker.contractWindowDays}D @ ${worker.dailyRateUsd}/day</span>
                          </td>
                          <td className="p-3">
                            <Badge className="bg-emerald-500/15 text-emerald-300 border-0 text-[10px]">
                              ✓ {worker.momoCarrier}
                            </Badge>
                            <div className="text-[9px] text-slate-400 font-mono mt-0.5">{worker.momoWalletNumber}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setQuotaUpdateForm({
                                    workerId: worker.id,
                                    todayHhrRegistered: worker.actualHhrCompleted || 25,
                                    todayItnDistributed: worker.actualItnDistributed || 50,
                                    notes: "Field output validated."
                                  });
                                  setShowCrsQuotaModal(true);
                                }}
                                className="text-[10px] h-6 px-2 rounded-lg bg-slate-800 border-white/10 text-white font-bold"
                              >
                                Log Quota
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

      {/* ========================================================================= */}
      {/* CRS MODAL 1: RECRUIT & ONBOARD TEMPORARY CAMPAIGN WORKER */}
      {/* ========================================================================= */}
      <Dialog open={showCrsRecruitModal} onOpenChange={setShowCrsRecruitModal}>
        <DialogContent className="max-w-xl rounded-3xl bg-slate-950 text-white border border-teal-500/40 p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-400" />
              Recruit & Onboard Temporary Campaign Worker (10-14 Days)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Onboards field staff for the CRS Mass LLIN / HHR Campaign in Grand Cape Mount & rural districts.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRecruitCrsWorker} className="space-y-3.5 text-xs py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">Full Name of Candidate:</Label>
                <Input
                  required
                  placeholder="e.g. Sando Varney"
                  value={newCrsWorkerForm.fullName}
                  onChange={(e) => setNewCrsWorkerForm({ ...newCrsWorkerForm, fullName: e.target.value })}
                  className="bg-slate-900 border-white/10 text-white text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">Contact Phone Number:</Label>
                <Input
                  required
                  placeholder="+231-777-..."
                  value={newCrsWorkerForm.phone}
                  onChange={(e) => setNewCrsWorkerForm({ ...newCrsWorkerForm, phone: e.target.value })}
                  className="bg-slate-900 border-white/10 text-white text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">National ID / Voter Card #:</Label>
                <Input
                  placeholder="LR-..."
                  value={newCrsWorkerForm.nationalId}
                  onChange={(e) => setNewCrsWorkerForm({ ...newCrsWorkerForm, nationalId: e.target.value })}
                  className="bg-slate-900 border-white/10 text-white text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">Campaign Field Role:</Label>
                <select
                  value={newCrsWorkerForm.role}
                  onChange={(e) => setNewCrsWorkerForm({ ...newCrsWorkerForm, role: e.target.value as any })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="HHR Registration Agent">HHR Registration Agent (Door-to-Door)</option>
                  <option value="ITN Distribution Lead">ITN Distribution Lead (Fixed/Mobile DP)</option>
                  <option value="Field Supervisor">Field Supervisor (1:5 Teams)</option>
                  <option value="District Coordinator">District Coordinator (Command Cell)</option>
                  <option value="Logistics & Site-Readiness">Logistics & Site-Readiness Lead</option>
                  <option value="QA / Data Monitor">QA & Data Quality Monitor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">Assigned District:</Label>
                <select
                  value={newCrsWorkerForm.district}
                  onChange={(e) => setNewCrsWorkerForm({ ...newCrsWorkerForm, district: e.target.value as any })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="Commonwealth">Commonwealth (7 HHR / 4 Dist Teams)</option>
                  <option value="Gola Konneh">Gola Konneh (9 HHR / 5 Dist Teams)</option>
                  <option value="Garwula">Garwula (19 HHR / 11 Dist Teams)</option>
                  <option value="Porkpah">Porkpah (23 HHR / 13 Dist Teams)</option>
                  <option value="Tewor">Tewor (21 HHR / 12 Dist Teams)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">Health Facility (HF) Catchment / DP:</Label>
                <Input
                  placeholder="e.g. Sinje Health Center (HF-04)"
                  value={newCrsWorkerForm.healthFacilityCatchment}
                  onChange={(e) => setNewCrsWorkerForm({ ...newCrsWorkerForm, healthFacilityCatchment: e.target.value })}
                  className="bg-slate-900 border-white/10 text-white text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">Contract Window (Days):</Label>
                <select
                  value={newCrsWorkerForm.contractWindowDays}
                  onChange={(e) => setNewCrsWorkerForm({ ...newCrsWorkerForm, contractWindowDays: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value={10}>10 Field Days (Standard HHR/Distribution)</option>
                  <option value={12}>12 Days (Supervisors + Mop-up)</option>
                  <option value={14}>14 Days (Command Cell & Logistics Closeout)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">Daily DSA / Stipend Rate (USD):</Label>
                <Input
                  type="number"
                  value={newCrsWorkerForm.dailyRateUsd}
                  onChange={(e) => setNewCrsWorkerForm({ ...newCrsWorkerForm, dailyRateUsd: Number(e.target.value) })}
                  className="bg-slate-900 border-white/10 text-white text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">Mobile Money Carrier:</Label>
                <select
                  value={newCrsWorkerForm.momoCarrier}
                  onChange={(e) => setNewCrsWorkerForm({ ...newCrsWorkerForm, momoCarrier: e.target.value as any })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="Orange Money">Orange Money Liberia</option>
                  <option value="Lonestar MTN MoMo">Lonestar MTN MoMo</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">BYOD Phone Model & IMEI:</Label>
                <Input
                  placeholder="e.g. Tecno Spark 10 / IMEI: 867..."
                  value={newCrsWorkerForm.byodPhoneImei}
                  onChange={(e) => setNewCrsWorkerForm({ ...newCrsWorkerForm, byodPhoneImei: e.target.value })}
                  className="bg-slate-900 border-white/10 text-white text-xs rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-xs h-10 rounded-xl shadow-lg mt-2"
            >
              Confirm Recruitment & Generate Contract ➔
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* CRS MODAL 2: MASTER LEGAL CAMPAIGN CONTRACT (ITN INSURANCE BOND, $129 DEVICE & WASTE REVERSE) */}
      {/* ========================================================================= */}
      <Dialog open={showCrsPhoneContractModal} onOpenChange={setShowCrsPhoneContractModal}>
        <DialogContent className="max-w-2xl rounded-3xl bg-slate-950 text-white border border-amber-500/50 p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-amber-400" />
              CRS & TOTAG Master Legal Temporary Employment & Asset Liability Contract
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Mandatory tripartite binding agreement covering ITN Net Insurance Bonds, $129 Smartphone Custody, and 49-in-1 Waste Reverse Logistics.
            </DialogDescription>
          </DialogHeader>

          {selectedCrsWorker && (
            <form onSubmit={handleSignPhoneContract} className="space-y-4 text-xs py-2">
              
              {/* LEGAL CONTRACT TERMS BOX */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3 text-slate-300 leading-relaxed font-sans max-h-72 overflow-y-auto">
                <div className="text-amber-400 font-bold text-xs uppercase flex items-center gap-1.5 border-b border-white/10 pb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Legal Liability, Asset Custody & Insurance Bond Clauses
                </div>

                <div className="space-y-1">
                  <strong className="text-white text-xs">CLAUSE 1: Scope of Employment & Daily Quotas</strong>
                  <p>
                    The Worker (<strong>{selectedCrsWorker.fullName}</strong>, National ID: <strong>{selectedCrsWorker.nationalId}</strong>) is employed on a temporary campaign contract ({selectedCrsWorker.contractWindowDays} days) assigned to {selectedCrsWorker.district} ({selectedCrsWorker.healthFacilityCatchment}). The Worker agrees to maintain the mandatory daily productivity of 25 Households/day (HHR) or 50 ITNs/day (Distribution).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px] space-y-1.5">
                  <strong className="text-amber-300 text-xs">CLAUSE 2: ITN Net Custody, All-Risk Insurance & Loss Indemnity</strong>
                  <p>
                    TOTAG GROUP is contractually bound to provide an All-Risk Insurance Bond for every Long-Lasting Insecticidal Net (ITN) received from 3PL preposition sites (PPS) and distribution points (DPs).
                  </p>
                  <p className="font-semibold text-white">
                    The Worker assumes full personal and financial liability for all ITN bales and individual nets under their custody. In the event of unauthorized diversion, theft, unaccounted loss, damaged packaging, or issuance without token-card validation, the Worker explicitly authorizes TOTAG GROUP to deduct the full replacement cost of each net directly from their Mobile Money stipend and initiate legal recovery under the Decent Work Act and Liberian Penal Code.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-[11px] space-y-1.5">
                  <strong className="text-rose-300 text-xs">CLAUSE 3: $129.00 USD Smartphone Loss/Damage Withholding Penalty</strong>
                  <p>
                    The Worker acknowledges physical receipt and custody of one (1) Android campaign smartphone (IMEI: <span className="font-mono text-amber-300 font-bold">{phoneContractSignature.phoneImei || selectedCrsWorker.byodPhoneImei}</span>). Under the CRS Global Fund Agreement, TOTAG is penalized <strong>$129.00 USD</strong> for any unreturned, lost, stolen, or damaged device.
                  </p>
                  <p className="font-bold text-amber-300">
                    The Worker explicitly and irrevocably authorizes TOTAG to withhold 100% of their final campaign pay tranche and deduct $129.00 USD if the device and original accessories are not returned in certified working condition on or before December 18, 2026.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-[11px] space-y-1.5">
                  <strong className="text-purple-300 text-xs">CLAUSE 4: Waste Management & 49-in-1 Bale Reverse Logistics</strong>
                  <p>
                    The Worker is legally required to collect 100% of empty ITN bale bags and packaging straps. The Worker must bundle exactly <strong>49 empty bale bags inside 1 outer sealed bag (50 total)</strong> and return tied strap bundles to PPS/DPs with signed Waste Stock Cards. Failure to account for empty bags will result in waste-clearance withholdings.
                  </p>
                </div>

                <div className="space-y-1">
                  <strong className="text-white text-xs">CLAUSE 5: Safeguarding, PSEA & Anti-Fraud Compliance</strong>
                  <p>
                    Zero tolerance for Protection from Sexual Exploitation & Abuse (PSEA), extortion of beneficiaries, or falsified household GPS logs. Immediate termination and reporting to CMT/CHTs upon infraction.
                  </p>
                </div>
              </div>

              {/* IMEI & SIGNATURE CONFIRMATION */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-slate-300 font-bold">Confirmed Campaign Smartphone IMEI Number:</Label>
                  <Input
                    required
                    value={phoneContractSignature.phoneImei}
                    onChange={(e) => setPhoneContractSignature({ ...phoneContractSignature, phoneImei: e.target.value })}
                    className="bg-slate-900 border-white/10 font-mono text-amber-300 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-300 font-bold">Worker Digital Signature (Type Full Legal Name):</Label>
                  <Input
                    required
                    placeholder="Type legal name to e-sign and execute contract..."
                    value={phoneContractSignature.signatureName}
                    onChange={(e) => setPhoneContractSignature({ ...phoneContractSignature, signatureName: e.target.value })}
                    className="bg-slate-900 border-teal-500/40 text-teal-300 font-bold text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="netBondAgree"
                      defaultChecked={true}
                      className="w-4 h-4 rounded border-amber-500 mt-0.5"
                    />
                    <Label htmlFor="netBondAgree" className="text-[11px] text-slate-300 font-medium cursor-pointer">
                      I accept legal custody of assigned ITN nets and agree to financial liability for lost/diverted nets under TOTAG's Insurance Bond.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="deductAgree"
                      checked={phoneContractSignature.agreedTo129Deduction}
                      onChange={(e) => setPhoneContractSignature({ ...phoneContractSignature, agreedTo129Deduction: e.target.checked })}
                      className="w-4 h-4 rounded border-rose-500 mt-0.5"
                    />
                    <Label htmlFor="deductAgree" className="text-[11px] text-slate-300 font-medium cursor-pointer">
                      I agree to the mandatory <strong>$129.00 USD</strong> salary deduction clause for lost, broken, or unreturned smartphone devices.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="wasteAgree"
                      defaultChecked={true}
                      className="w-4 h-4 rounded border-purple-500 mt-0.5"
                    />
                    <Label htmlFor="wasteAgree" className="text-[11px] text-slate-300 font-medium cursor-pointer">
                      I agree to collect all waste and return <strong>49 empty bale bags inside 1 outer sealed bag</strong> with tied straps to the PPS/DP.
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!phoneContractSignature.agreedTo129Deduction || !phoneContractSignature.signatureName}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black text-xs h-11 rounded-xl shadow-lg mt-2"
              >
                Legally Sign & Execute Tripartite Campaign Contract ➔
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* CRS MODAL 3: LOG DAILY QUOTA & FIELD OUTPUT */}
      {/* ========================================================================= */}
      <Dialog open={showCrsQuotaModal} onOpenChange={setShowCrsQuotaModal}>
        <DialogContent className="max-w-md rounded-3xl bg-slate-950 text-white border border-purple-500/40 p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Log Daily Household (HHR) & ITN Quota
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Records validated field output against the daily CRS target (25 HH/agent/day or 50 Nets/agent/day).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogDailyQuota} className="space-y-4 text-xs py-2">
            <div className="space-y-1">
              <Label className="text-slate-300 font-bold">Select Campaign Worker:</Label>
              <select
                value={quotaUpdateForm.workerId}
                onChange={(e) => setQuotaUpdateForm({ ...quotaUpdateForm, workerId: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
              >
                {crsWorkers.map(w => (
                  <option key={w.id} value={w.id}>{w.fullName} ({w.role} &bull; {w.district})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">Households Registered Today:</Label>
                <Input
                  type="number"
                  value={quotaUpdateForm.todayHhrRegistered}
                  onChange={(e) => setQuotaUpdateForm({ ...quotaUpdateForm, todayHhrRegistered: Number(e.target.value) })}
                  className="bg-slate-900 border-white/10 text-white text-xs rounded-xl"
                />
                <span className="text-[10px] text-slate-500">Target: 25 HH / day</span>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold">ITNs Distributed Today:</Label>
                <Input
                  type="number"
                  value={quotaUpdateForm.todayItnDistributed}
                  onChange={(e) => setQuotaUpdateForm({ ...quotaUpdateForm, todayItnDistributed: Number(e.target.value) })}
                  className="bg-slate-900 border-white/10 text-white text-xs rounded-xl"
                />
                <span className="text-[10px] text-slate-500">Target: 50 Nets / day</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 space-y-1 text-[11px]">
              <span className="font-bold text-amber-400">&lt;90% Performance Policy:</span>
              <p className="text-slate-400">
                If daily output falls below 22 households (88%), supervisor triggers immediate reinforcement from the 5% reserve personnel pool.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs h-10 rounded-xl shadow-lg"
            >
              Verify & Stamp Daily Output Record ➔
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* CRS MODAL 4: SUPERVISOR MORNING BRIEFING & FIELD GPS CLOCK-IN */}
      {/* ========================================================================= */}
      <Dialog open={showCrsSupervisorClockInModal} onOpenChange={setShowCrsSupervisorClockInModal}>
        <DialogContent className="max-w-md rounded-3xl bg-slate-950 text-white border border-sky-500/40 p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              Supervisor Field GPS & Roster Clock-In
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Batch clocks in the 5 assigned 2-person HHR teams during the 07:30 AM morning briefing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-sky-500/30 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Catchment Hub:</span>
                <strong className="text-white">Sinje Health Center (HF-04)</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Assigned Field Teams:</span>
                <strong className="text-sky-400">5 Teams (10 Personnel)</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Satellite GPS Coordinates:</span>
                <strong className="text-emerald-400 font-mono">6.912400° N, -11.312900° W</strong>
              </div>
            </div>

            <Button
              onClick={() => {
                setShowCrsSupervisorClockInModal(false);
                toast({
                  title: "✓ Supervisor Field Roster Verified",
                  description: "10 HHR field personnel clocked in at Garwula Hub with satellite GPS lock."
                });
              }}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black text-xs h-10 rounded-xl shadow-lg"
            >
              Authorize Route Release & Clock In Teams ➔
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
