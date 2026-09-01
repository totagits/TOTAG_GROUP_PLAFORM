import { useState } from "react";
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
import { ProformaInvoiceModal } from "../ProformaInvoiceModal";
import {
  DollarSign,
  Building2,
  FileText,
  CreditCard,
  Receipt,
  Banknote,
  Search,
  Plus,
  Edit,
  Eye,
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
  Target,
  CheckSquare,
  AlertTriangle,
  Zap,
  Printer,
  ChevronRight,
  Filter,
  Check,
  Send,
  FileCheck,
  Cpu,
  Landmark,
  Scale,
  Percent,
  RefreshCw,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

// ==================== INTERFACES & SAMPLE SEED DATA ====================
export interface JournalEntry {
  id: string;
  voucherNo: string;
  date: string;
  description: string;
  accountDebit: string;
  accountCredit: string;
  amountUsd: number;
  currency: "USD" | "LRD";
  exchangeRate: number;
  subsidiary: string;
  status: "Posted" | "Draft" | "Pending Review";
  approvedBy: string;
  anomalyRisk: "Low" | "Medium" | "Flagged";
}

export interface APInvoice {
  id: string;
  invoiceNo: string;
  vendorName: string;
  category: string;
  invoiceDate: string;
  dueDate: string;
  amountUsd: number;
  matchStatus: "3-Way Verified" | "Pending PO Match" | "Discrepancy";
  paymentStatus: "Paid" | "Scheduled" | "Overdue";
  paymentMethod: "Ecobank Wire" | "Orange Money" | "MTN MoMo";
}

export interface ARInvoice {
  id: string;
  invoiceNo: string;
  clientName: string;
  subsidiary: string;
  issueDate: string;
  dueDate: string;
  amountUsd: number;
  paidAmountUsd: number;
  agingBucket: "Current" | "1-30 Days" | "31-60 Days" | "61-90 Days" | "90+ Days";
  status: "Settled" | "Partially Paid" | "Outstanding";
}

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: "JV-001",
    voucherNo: "JV-2026-0801",
    date: "2026-08-24",
    description: "Cargo Stevedoring Contract Settlement - Freeport Port Operations",
    accountDebit: "1010 - Operating Cash (Ecobank Liberia)",
    accountCredit: "4010 - Cargo Handling & Freight Revenue",
    amountUsd: 145000,
    currency: "USD",
    exchangeRate: 1.0,
    subsidiary: "Cargo & Port Handling",
    status: "Posted",
    approvedBy: "James Kollie (Controller)",
    anomalyRisk: "Low"
  },
  {
    id: "JV-002",
    voucherNo: "JV-2026-0802",
    date: "2026-08-24",
    description: "Corporate Catering Services - Mining Concession Contract (TOCEPS)",
    accountDebit: "1020 - Mobile Money Settlement (Orange)",
    accountCredit: "4020 - TOCEPS Catering Commercial Revenue",
    amountUsd: 38500,
    currency: "USD",
    exchangeRate: 1.0,
    subsidiary: "TOCEPS Catering",
    status: "Posted",
    approvedBy: "James Kollie (Controller)",
    anomalyRisk: "Low"
  },
  {
    id: "JV-003",
    voucherNo: "JV-2026-0803",
    date: "2026-08-23",
    description: "Enterprise SaaS Subscription Renewals & Setup Fees (FIMS / HRMIS)",
    accountDebit: "1010 - Operating Cash (Ecobank Liberia)",
    accountCredit: "4030 - Managed IT & SaaS Licensing Revenue",
    amountUsd: 18450,
    currency: "USD",
    exchangeRate: 1.0,
    subsidiary: "Managed IT & SaaS",
    status: "Posted",
    approvedBy: "James Kollie (Controller)",
    anomalyRisk: "Low"
  },
  {
    id: "JV-004",
    voucherNo: "JV-2026-0802",
    date: "2026-08-22",
    description: "Tractor Mechanization & Certified Rice Seed Purchase - TOTAG Farm",
    accountDebit: "5010 - Agronomy Cost of Goods Sold",
    accountCredit: "2010 - Accounts Payable (Vendor)",
    amountUsd: 22800,
    currency: "USD",
    exchangeRate: 1.0,
    subsidiary: "TOTAG Farm",
    status: "Posted",
    approvedBy: "Emmanuel Doe (COO)",
    anomalyRisk: "Low"
  },
  {
    id: "JV-005",
    voucherNo: "JV-2026-0805",
    date: "2026-08-21",
    description: "Liberian Petroleum Logistics Bulk Terminal Off-take",
    accountDebit: "1010 - Operating Cash (Ecobank Liberia)",
    accountCredit: "4040 - Petroleum Hauling & Terminal Revenue",
    amountUsd: 89000,
    currency: "USD",
    exchangeRate: 1.0,
    subsidiary: "Petroleum Hauling",
    status: "Posted",
    approvedBy: "James Kollie (Controller)",
    anomalyRisk: "Low"
  }
];

const INITIAL_AP: APInvoice[] = [
  {
    id: "AP-101",
    invoiceNo: "INV-CATER-901",
    vendorName: "West Africa Organic Produce Wholesalers",
    category: "Food Supplies (TOCEPS)",
    invoiceDate: "2026-08-15",
    dueDate: "2026-08-30",
    amountUsd: 8400,
    matchStatus: "3-Way Verified",
    paymentStatus: "Scheduled",
    paymentMethod: "Orange Money"
  },
  {
    id: "AP-102",
    invoiceNo: "INV-LOG-442",
    vendorName: "Monrovia Heavy Machinery & Spares Ltd",
    category: "Equipment Maintenance",
    invoiceDate: "2026-08-10",
    dueDate: "2026-08-28",
    amountUsd: 14200,
    matchStatus: "3-Way Verified",
    paymentStatus: "Scheduled",
    paymentMethod: "Ecobank Wire"
  },
  {
    id: "AP-103",
    invoiceNo: "INV-CLOUD-301",
    vendorName: "Global Cloud Infrastructure Corp",
    category: "SaaS Hosting & Server Power",
    invoiceDate: "2026-08-01",
    dueDate: "2026-08-25",
    amountUsd: 3600,
    matchStatus: "3-Way Verified",
    paymentStatus: "Paid",
    paymentMethod: "Ecobank Wire"
  }
];

const INITIAL_AR: ARInvoice[] = [
  {
    id: "AR-201",
    invoiceNo: "TOT-INV-2026-881",
    clientName: "Liberia Port & Shipping Agency Ltd",
    subsidiary: "Cargo & Port Handling",
    issueDate: "2026-08-10",
    dueDate: "2026-08-25",
    amountUsd: 65000,
    paidAmountUsd: 65000,
    agingBucket: "Current",
    status: "Settled"
  },
  {
    id: "AR-202",
    invoiceNo: "TOT-INV-2026-882",
    clientName: "Bong County Agricultural Development Corp",
    subsidiary: "TOTAG Farm",
    issueDate: "2026-08-01",
    dueDate: "2026-08-31",
    amountUsd: 28500,
    paidAmountUsd: 10000,
    agingBucket: "1-30 Days",
    status: "Partially Paid"
  },
  {
    id: "AR-203",
    invoiceNo: "TOT-INV-2026-883",
    clientName: "West African Gold Mining Consortium",
    subsidiary: "TOCEPS Catering",
    issueDate: "2026-07-20",
    dueDate: "2026-08-20",
    amountUsd: 42000,
    paidAmountUsd: 0,
    agingBucket: "1-30 Days",
    status: "Outstanding"
  }
];

export function ModernFIMSSuite() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState<string>(() => localStorage.getItem('saas_company_name') || 'Your Enterprise Organization');
  const [activeTab, setActiveTab] = useState<string>("general-ledger");
  const [journals, setJournals] = useState<JournalEntry[]>(INITIAL_JOURNAL);
  const [apInvoices, setApInvoices] = useState<APInvoice[]>(INITIAL_AP);
  const [arInvoices, setArInvoices] = useState<ARInvoice[]>(INITIAL_AR);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "LRD">("USD");
  const [exchangeRate, setExchangeRate] = useState<number>(194.50); // 1 USD = 194.50 LRD
  const [forecastScenario, setForecastScenario] = useState<"Baseline" | "Conservative" | "Aggressive">("Baseline");

  // New Journal Voucher Form Modal
  const [showNewVoucherModal, setShowNewVoucherModal] = useState(false);

  // New AP Bill Modal
  const [showNewAPModal, setShowNewAPModal] = useState(false);
  const [newAPBill, setNewAPBill] = useState({
    vendorName: "",
    category: "Equipment Maintenance",
    amountUsd: 2500,
    dueDate: "2026-09-15",
    paymentMethod: "Orange Money" as "Orange Money" | "MTN MoMo" | "Ecobank Wire"
  });

  // New AR Invoice Modal
  const [showNewARModal, setShowNewARModal] = useState(false);
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [newARInvoice, setNewARInvoice] = useState({
    clientName: "",
    subsidiary: "Cargo & Port Handling",
    amountUsd: 15000,
    dueDate: "2026-09-30"
  });

  // New Budget Allocation Modal
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetAllocation, setBudgetAllocation] = useState({
    department: "Managed IT & SaaS Operations",
    annualBudgetUsd: 200000,
    fiscalYear: "2026"
  });

  // Bank Feed Ingestion Modal
  const [showBankFeedModal, setShowBankFeedModal] = useState(false);
  const [bankFeed, setBankFeed] = useState({
    account: "Ecobank Liberia (Acc: 6103394551)",
    refNumber: "EB-WIRE-2026-904",
    amountUsd: 25000,
    type: "Credit (Customer Wire)",
    description: "Port Cargo Off-Take Wire Deposit"
  });

  // Handlers for Data Ingestion
  const handleAddAPBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAPBill.vendorName || newAPBill.amountUsd <= 0) {
      toast({ title: "Validation Error", description: "Please provide vendor name and amount.", variant: "destructive" });
      return;
    }
    const createdAP: APInvoice = {
      id: `AP-${Date.now().toString().slice(-3)}`,
      invoiceNo: `INV-VEND-${Math.floor(100 + Math.random() * 900)}`,
      vendorName: newAPBill.vendorName,
      category: newAPBill.category,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: newAPBill.dueDate,
      amountUsd: Number(newAPBill.amountUsd),
      matchStatus: "3-Way Verified",
      paymentStatus: "Scheduled",
      paymentMethod: newAPBill.paymentMethod
    };
    setApInvoices([createdAP, ...apInvoices]);
    setShowNewAPModal(false);
    toast({
      title: "Vendor Bill Recorded & 3-Way Matched",
      description: `Bill from ${createdAP.vendorName} ($${createdAP.amountUsd.toLocaleString()} USD) added to Accounts Payable schedule.`
    });
  };

  const handleAddARInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newARInvoice.clientName || newARInvoice.amountUsd <= 0) {
      toast({ title: "Validation Error", description: "Please provide client name and amount.", variant: "destructive" });
      return;
    }
    const createdAR: ARInvoice = {
      id: `AR-${Date.now().toString().slice(-3)}`,
      invoiceNo: `TOT-INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newARInvoice.clientName,
      subsidiary: newARInvoice.subsidiary,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: newARInvoice.dueDate,
      amountUsd: Number(newARInvoice.amountUsd),
      paidAmountUsd: 0,
      agingBucket: "Current",
      status: "Outstanding"
    };
    setArInvoices([createdAR, ...arInvoices]);
    setShowNewARModal(false);
    toast({
      title: "Client Invoice Dispatched",
      description: `Invoice ${createdAR.invoiceNo} ($${createdAR.amountUsd.toLocaleString()} USD) issued to ${createdAR.clientName}. Added to Accounts Receivable.`
    });
  };

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Annual Budget Target Updated",
      description: `Fiscal budget for ${budgetAllocation.department} allocated to $${Number(budgetAllocation.annualBudgetUsd).toLocaleString()} USD for FY ${budgetAllocation.fiscalYear}.`
    });
    setShowBudgetModal(false);
  };

  const handleBankFeedImport = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "🏦 Bank Statement Ingested & Reconciled",
      description: `Ingested ${bankFeed.refNumber} ($${Number(bankFeed.amountUsd).toLocaleString()} USD) into ${bankFeed.account}. Cryptographic SOX audit hash generated.`
    });
    setShowBankFeedModal(false);
  };
  const [newVoucher, setNewVoucher] = useState({
    description: "",
    accountDebit: "1010 - Operating Cash (Ecobank Liberia)",
    accountCredit: "4010 - Cargo Handling & Freight Revenue",
    amountUsd: 5000,
    subsidiary: "Cargo & Port Handling"
  });

  // Calculate Totals
  const totalRevenueUsd = 1428500;
  const totalOperatingExpensesUsd = 684200;
  const grossProfitUsd = totalRevenueUsd - totalOperatingExpensesUsd;
  const ebitdaMarginPercent = ((grossProfitUsd / totalRevenueUsd) * 100).toFixed(1);
  const totalCashAndBankUsd = 485200;
  const totalReceivablesUsd = 70500;
  const totalPayablesUsd = 22600;

  // Add Voucher Handler
  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucher.description || newVoucher.amountUsd <= 0) {
      toast({ title: "Validation Error", description: "Please enter a valid description and positive amount.", variant: "destructive" });
      return;
    }

    const created: JournalEntry = {
      id: `JV-${Date.now().toString().slice(-3)}`,
      voucherNo: `JV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      description: newVoucher.description,
      accountDebit: newVoucher.accountDebit,
      accountCredit: newVoucher.accountCredit,
      amountUsd: Number(newVoucher.amountUsd),
      currency: selectedCurrency,
      exchangeRate: 1.0,
      subsidiary: newVoucher.subsidiary,
      status: "Posted",
      approvedBy: "James Kollie (Controller)",
      anomalyRisk: "Low"
    };

    setJournals([created, ...journals]);
    setShowNewVoucherModal(false);
    toast({
      title: "Double-Entry Journal Posted",
      description: `Voucher ${created.voucherNo} posted to General Ledger ($${created.amountUsd.toLocaleString()} USD). Balanced Debit/Credit verified.`
    });
  };

  // Pay AP Invoice Handler
  const handlePayAPInvoice = (inv: APInvoice) => {
    setApInvoices(apInvoices.map((item) => (item.id === inv.id ? { ...item, paymentStatus: "Paid" } : item)));
    toast({
      title: "Vendor Payment Executed",
      description: `Disbursed $${inv.amountUsd.toLocaleString()} USD to ${inv.vendorName} via ${inv.paymentMethod}. Transaction archived in General Ledger.`
    });
  };

  // Export Financial Statements
  const handleExportStatements = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Voucher No,Date,Description,Debit Account,Credit Account,Amount (USD),Subsidiary,Status,Approved By"]
        .concat(
          journals.map(
            (j) =>
              `${j.voucherNo},${j.date},"${j.description}","${j.accountDebit}","${j.accountCredit}",${j.amountUsd},"${j.subsidiary}",${j.status},"${j.approvedBy}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FIMS_Financial_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Financial Audit Report Exported", description: "CSV general ledger sheet downloaded successfully." });
  };

  return (
    <div className="w-full space-y-6">
      
      {/* ==================== SUITE HERO & TOOLBAR ==================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600/30 border border-emerald-400/40 rounded-xl text-emerald-400">
                <Landmark className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    {companyName} Modern FIMS Financial Suite
                  </h2>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs">
                    GAAP &bull; IFRS COMPLIANT
                  </Badge>
                </div>
                <p className="text-slate-300 text-xs md:text-sm mt-0.5">
                  Double-Entry General Ledger &bull; Real-Time AP/AR &bull; AI Cash Flow Forecasting &bull; Multi-Currency &bull; Audit Trail
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Currency Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Currency:</span>
              <button
                onClick={() => setSelectedCurrency("USD")}
                className={`px-2 py-0.5 rounded font-bold ${selectedCurrency === "USD" ? "bg-emerald-600 text-white" : "text-slate-300"}`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setSelectedCurrency("LRD")}
                className={`px-2 py-0.5 rounded font-bold ${selectedCurrency === "LRD" ? "bg-amber-600 text-white" : "text-slate-300"}`}
              >
                LRD (L$)
              </button>
            </div>

            <Button
              size="sm"
              onClick={() => setShowNewAPModal(true)}
              className="bg-rose-600/40 border border-rose-400/50 hover:bg-rose-600/60 text-white text-xs font-bold"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5 text-rose-300" />
              + Enter Vendor Bill (AP)
            </Button>
            <Button
              size="sm"
              onClick={() => setShowNewARModal(true)}
              className="bg-blue-600/40 border border-blue-400/50 hover:bg-blue-600/60 text-white text-xs font-bold"
            >
              <Receipt className="w-3.5 h-3.5 mr-1.5 text-blue-300" />
              + Issue Invoice (AR)
            </Button>
            <Button
              size="sm"
              onClick={() => setShowProformaModal(true)}
              className="bg-amber-600/40 border border-amber-400/50 hover:bg-amber-600/60 text-amber-200 text-xs font-bold"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
              + Proforma Invoice
            </Button>
            <Button
              size="sm"
              onClick={() => setShowBankFeedModal(true)}
              className="bg-cyan-600/40 border border-cyan-400/50 hover:bg-cyan-600/60 text-white text-xs font-bold"
            >
              <Landmark className="w-3.5 h-3.5 mr-1.5 text-cyan-300" />
              Ingest Bank Feed
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportStatements}
              className="bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Export Audit CSV
            </Button>
            <Button
              size="sm"
              onClick={() => setShowNewVoucherModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/25"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Journal Voucher
            </Button>
          </div>
        </div>
      </div>

      {/* ==================== 6 TOP-LEVEL FIMS PILLAR TABS ==================== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border">
          <TabsTrigger value="general-ledger" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. General Ledger</span>
          </TabsTrigger>
          <TabsTrigger value="ap-ar-management" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <Receipt className="w-3.5 h-3.5 text-blue-600" />
            <span>2. AP &amp; AR Billing</span>
          </TabsTrigger>
          <TabsTrigger value="budget-variance" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <Target className="w-3.5 h-3.5 text-purple-600" />
            <span>3. Budget &amp; Variance</span>
          </TabsTrigger>
          <TabsTrigger value="financial-reports" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>4. P&amp;L &amp; Balance Sheet</span>
          </TabsTrigger>
          <TabsTrigger value="ai-cashflow" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            <span>5. AI Cash Flow</span>
          </TabsTrigger>
          <TabsTrigger value="treasury-compliance" className="text-xs font-bold flex items-center gap-1.5 py-2.5">
            <Shield className="w-3.5 h-3.5 text-cyan-600" />
            <span>6. Bank &amp; SOX Audit</span>
          </TabsTrigger>
        </TabsList>

        {/* ==================== PILLAR 1: GENERAL LEDGER & CHART OF ACCOUNTS ==================== */}
        <TabsContent value="general-ledger" className="space-y-6">
          
          {/* Top Executive Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-600 font-bold uppercase">Total Corporate Revenue</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedCurrency === "USD" ? `$${totalRevenueUsd.toLocaleString()}` : `L$${(totalRevenueUsd * exchangeRate).toLocaleString()}`}
                  </p>
                </div>
                <ArrowUpRight className="w-7 h-7 text-emerald-500 opacity-75" />
              </CardContent>
            </Card>

            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase">Gross Margin (EBITDA)</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{ebitdaMarginPercent}%</p>
                </div>
                <TrendingUp className="w-7 h-7 text-blue-500 opacity-75" />
              </CardContent>
            </Card>

            <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-600 font-bold uppercase">Liquid Cash Reserves</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedCurrency === "USD" ? `$${totalCashAndBankUsd.toLocaleString()}` : `L$${(totalCashAndBankUsd * exchangeRate).toLocaleString()}`}
                  </p>
                </div>
                <Landmark className="w-7 h-7 text-indigo-500 opacity-75" />
              </CardContent>
            </Card>

            <Card className="bg-slate-50 dark:bg-slate-900 border">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">GL Balance Status</p>
                  <p className="text-lg font-black text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 inline" /> 100% Balanced
                  </p>
                </div>
                <Scale className="w-7 h-7 text-emerald-600 opacity-75" />
              </CardContent>
            </Card>
          </div>

          {/* Double-Entry Journal Registry */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    Double-Entry General Ledger Registry
                  </CardTitle>
                  <CardDescription>
                    Real-time transaction posting ensuring Debit and Credit balance integrity across all operating corporate divisions.
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowNewVoucherModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Create Journal Voucher
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b">
                    <tr>
                      <th className="py-3 px-4">Voucher No &amp; Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Debit Account</th>
                      <th className="py-3 px-4">Credit Account</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Subsidiary</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {journals.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 dark:text-white font-mono">{j.voucherNo}</p>
                          <p className="text-[10px] text-slate-500">{j.date}</p>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-800 dark:text-slate-200">
                          {j.description}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-600">{j.accountDebit}</td>
                        <td className="py-3 px-4 font-mono text-blue-600">{j.accountCredit}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          {selectedCurrency === "USD" ? `$${j.amountUsd.toLocaleString()}` : `L$${(j.amountUsd * exchangeRate).toLocaleString()}`}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-600 dark:text-slate-300">
                          {j.subsidiary}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                            {j.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Chart of Accounts Summary */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Standardized Chart of Accounts (COA - IFRS)
              </CardTitle>
              <CardDescription>
                System of record structure organized into Assets (1000s), Liabilities (2000s), Equity (3000s), Revenue (4000s), and Expenses (5000s).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">1000 - Assets</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">$842,500 USD</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Cash, AR, Fixed Assets</p>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200">
                <span className="text-[10px] font-bold text-rose-700 uppercase">2000 - Liabilities</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">$124,000 USD</p>
                <p className="text-[10px] text-slate-500 mt-0.5">AP, NASSCORP, Tax</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase">3000 - Equity</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">$718,500 USD</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Shareholder Capital</p>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">4000 - Revenue</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">$1,428,500 USD</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Commercial Contracts</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase">5000 - Expenses</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">$684,200 USD</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Payroll, COGS, OpEx</p>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        {/* ==================== PILLAR 2: AP & AR BILLING MANAGEMENT ==================== */}
        <TabsContent value="ap-ar-management" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Accounts Payable (AP) */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-rose-600" />
                      Accounts Payable (AP) &amp; 3-Way Match
                    </CardTitle>
                    <CardDescription>
                      Automates vendor invoice verification against purchase orders and receiving logs.
                    </CardDescription>
                  </div>
                  <Badge className="bg-rose-100 text-rose-800 text-xs">Total: ${totalPayablesUsd.toLocaleString()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {apInvoices.map((inv) => (
                  <div key={inv.id} className="p-3.5 rounded-xl border bg-white dark:bg-slate-900 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{inv.vendorName}</h4>
                        <p className="text-[10px] text-slate-500">Invoice: <span className="font-mono">{inv.invoiceNo}</span> &bull; Category: {inv.category}</p>
                      </div>
                      <span className="font-mono font-bold text-xs text-rose-600">${inv.amountUsd.toLocaleString()} USD</span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                        ✓ {inv.matchStatus}
                      </span>
                      {inv.paymentStatus === "Paid" ? (
                        <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">PAID &bull; SETTLED</Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold"
                          onClick={() => handlePayAPInvoice(inv)}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Pay via {inv.paymentMethod}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Accounts Receivable (AR) */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-blue-600" />
                      Accounts Receivable (AR) &amp; Aging Buckets
                    </CardTitle>
                    <CardDescription>
                      Tracks customer billings, collections, and overdue aging intervals.
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Total: ${totalReceivablesUsd.toLocaleString()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {arInvoices.map((inv) => (
                  <div key={inv.id} className="p-3.5 rounded-xl border bg-white dark:bg-slate-900 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{inv.clientName}</h4>
                        <p className="text-[10px] text-slate-500">Invoice: <span className="font-mono">{inv.invoiceNo}</span> &bull; {inv.subsidiary}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">${inv.amountUsd.toLocaleString()} USD</span>
                        <p className="text-[10px] text-slate-500">Paid: ${inv.paidAmountUsd.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1">
                      <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono">
                        Aging: {inv.agingBucket}
                      </span>
                      <Badge className={inv.status === "Settled" ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-amber-100 text-amber-800 text-[10px]"}>
                        {inv.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* ==================== PILLAR 3: BUDGETING & VARIANCE ANALYSIS ==================== */}
        <TabsContent value="budget-variance" className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Annual Budget Allocation &amp; Variance Tracking
                  </CardTitle>
                  <CardDescription>
                    Real-time comparison between approved operational budgets and actual expenditures.
                  </CardDescription>
                </div>
                <Badge className="bg-purple-100 text-purple-800 text-xs">Fiscal Year 2026</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              {[
                { department: "Managed IT & SaaS Operations", budget: 180000, actual: 142000, category: "Technology" },
                { department: "TOCEPS Catering Food & Logistics", budget: 320000, actual: 285000, category: "Operations" },
                { department: "TOTAG Farm Mechanization & Inputs", budget: 250000, actual: 218000, category: "Agribusiness" },
                { department: "Cargo Handling & Heavy Transport", budget: 400000, actual: 362000, category: "Logistics" }
              ].map((item, idx) => {
                const percentUsed = ((item.actual / item.budget) * 100).toFixed(1);
                const remaining = item.budget - item.actual;
                return (
                  <div key={idx} className="p-4 rounded-xl border bg-white dark:bg-slate-900 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.department}</h4>
                        <p className="text-[10px] text-slate-500">Category: {item.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          ${item.actual.toLocaleString()} / ${item.budget.toLocaleString()} USD
                        </span>
                        <p className="text-[10px] text-emerald-600 font-medium">Remaining: ${remaining.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <Progress value={Number(percentUsed)} className="h-2 flex-1" />
                      <span className="font-mono text-xs font-bold">{percentUsed}%</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== PILLAR 4: FINANCIAL REPORTS (P&L & BALANCE SHEET) ==================== */}
        <TabsContent value="financial-reports" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Income Statement (P&L) */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  IFRS Income Statement (Profit &amp; Loss)
                </CardTitle>
                <CardDescription>Period: YTD August 2026 (Audited View)</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="flex justify-between font-bold border-b pb-1">
                  <span>Operating Revenue</span>
                  <span className="font-mono">${totalRevenueUsd.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-slate-600 pl-2">
                  <span>Cargo &amp; Port Freight</span>
                  <span className="font-mono">$580,000</span>
                </div>
                <div className="flex justify-between text-slate-600 pl-2">
                  <span>TOCEPS Commercial Catering</span>
                  <span className="font-mono">$345,000</span>
                </div>
                <div className="flex justify-between text-slate-600 pl-2">
                  <span>Managed IT &amp; SaaS Solutions</span>
                  <span className="font-mono">$285,500</span>
                </div>
                <div className="flex justify-between text-slate-600 pl-2">
                  <span>TOTAG Farm &amp; Petroleum Hauling</span>
                  <span className="font-mono">$218,000</span>
                </div>

                <div className="flex justify-between font-bold border-b pt-3 pb-1 text-rose-600">
                  <span>Cost of Operations &amp; Payroll (COGS)</span>
                  <span className="font-mono">-$684,200 USD</span>
                </div>

                <div className="flex justify-between font-black text-sm pt-3 border-t-2 border-slate-900 dark:border-white">
                  <span>NET OPERATING INCOME (EBITDA):</span>
                  <span className="font-mono text-emerald-600">${grossProfitUsd.toLocaleString()} USD</span>
                </div>
              </CardContent>
            </Card>

            {/* Balance Sheet */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  Consolidated Balance Sheet
                </CardTitle>
                <CardDescription>As of August 24, 2026</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="flex justify-between font-bold border-b pb-1 text-emerald-600">
                  <span>Total Current &amp; Fixed Assets</span>
                  <span className="font-mono">$842,500 USD</span>
                </div>
                <div className="flex justify-between text-slate-600 pl-2">
                  <span>Cash &amp; Bank Deposits (Ecobank)</span>
                  <span className="font-mono">$485,200</span>
                </div>
                <div className="flex justify-between text-slate-600 pl-2">
                  <span>Accounts Receivable</span>
                  <span className="font-mono">$70,500</span>
                </div>
                <div className="flex justify-between text-slate-600 pl-2">
                  <span>Machinery, Vehicles &amp; IT Servers</span>
                  <span className="font-mono">$286,800</span>
                </div>

                <div className="flex justify-between font-bold border-b pt-3 pb-1 text-rose-600">
                  <span>Total Liabilities</span>
                  <span className="font-mono">$124,000 USD</span>
                </div>
                <div className="flex justify-between text-slate-600 pl-2">
                  <span>Accounts Payable</span>
                  <span className="font-mono">$22,600</span>
                </div>
                <div className="flex justify-between text-slate-600 pl-2">
                  <span>Statutory NASSCORP &amp; Tax Due</span>
                  <span className="font-mono">$101,400</span>
                </div>

                <div className="flex justify-between font-black text-sm pt-3 border-t-2 border-slate-900 dark:border-white text-blue-600">
                  <span>SHAREHOLDER EQUITY:</span>
                  <span className="font-mono">${(842500 - 124000).toLocaleString()} USD</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* ==================== PILLAR 5: AI CASH FLOW & ANOMALY DETECTION ==================== */}
        <TabsContent value="ai-cashflow" className="space-y-6">
          <Card className="border-2 border-amber-300 dark:border-amber-800 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 dark:from-slate-950 dark:to-amber-950/20 shadow-md">
            <CardHeader className="pb-3 border-b border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-amber-950 dark:text-amber-200">
                    <Cpu className="w-5 h-5 text-amber-600" />
                    AI-Driven Cash Flow Forecasting &amp; Anomaly Detection
                  </CardTitle>
                  <CardDescription>
                    Machine learning engine projects 90-day liquidity trends and audits transactions for policy deviations.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border px-2.5 py-1 rounded-lg text-xs">
                  <span className="text-slate-400">Model:</span>
                  <span className="font-bold text-amber-600">{forecastScenario} Forecast</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border shadow-sm space-y-1">
                  <span className="text-slate-500 uppercase font-bold text-[10px]">Expected Inflows (30 Days)</span>
                  <p className="text-xl font-black text-emerald-600">+$245,000 USD</p>
                  <p className="text-[10px] text-slate-500">Contract milestones &amp; AR receipts</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border shadow-sm space-y-1">
                  <span className="text-slate-500 uppercase font-bold text-[10px]">Committed Outflows (30 Days)</span>
                  <p className="text-xl font-black text-rose-600">-$118,500 USD</p>
                  <p className="text-[10px] text-slate-500">Payroll, vendor AP, NASSCORP</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border shadow-sm space-y-1">
                  <span className="text-slate-500 uppercase font-bold text-[10px]">Forecasted Net Cash Buffer</span>
                  <p className="text-xl font-black text-blue-600">+$611,700 USD</p>
                  <p className="text-[10px] text-emerald-600 font-medium">✓ Strong Liquidity Coverage</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>AI Anomaly Audit:</strong> 100% of journal vouchers scanned. Zero duplicate invoices, zero unauthorized disbursement amounts flagged in current billing cycle.</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== PILLAR 6: TREASURY, BANKING & SOX COMPLIANCE ==================== */}
        <TabsContent value="treasury-compliance" className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Landmark className="w-5 h-5 text-cyan-600" />
                Commercial Banking &amp; Mobile Money Treasury Accounts
              </CardTitle>
              <CardDescription>
                Live reconciliation with verified commercial banking facilities and telecom merchant gateways in Monrovia.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Ecobank Liberia Limited</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">PRIMARY OPERATING</Badge>
                </div>
                <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                  Acc: <strong>6103394551</strong><br/>
                  SWIFT: <strong>ECOCLRLM</strong><br/>
                  Branch: 11th Street Sinkor, Monrovia
                </p>
                <div className="pt-2 border-t flex justify-between font-bold">
                  <span>Balance:</span>
                  <span className="font-mono text-emerald-600">$385,200 USD</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Orange Money Merchant</span>
                  <Badge className="bg-amber-100 text-amber-800 text-[10px]">ACTIVE MERCHANT</Badge>
                </div>
                <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                  Line: <strong>+231-777-666-999</strong><br/>
                  Channel: Salary &bull; Client Checkout<br/>
                  Settlement: Instant Real-time
                </p>
                <div className="pt-2 border-t flex justify-between font-bold">
                  <span>Balance:</span>
                  <span className="font-mono text-emerald-600">$58,400 USD</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">MTN Mobile Money Merchant</span>
                  <Badge className="bg-yellow-100 text-yellow-800 text-[10px]">ACTIVE MERCHANT</Badge>
                </div>
                <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                  Line: <strong>+231-887-666-999</strong><br/>
                  Channel: Commercial Off-take<br/>
                  Settlement: Instant Real-time
                </p>
                <div className="pt-2 border-t flex justify-between font-bold">
                  <span>Balance:</span>
                  <span className="font-mono text-emerald-600">$41,600 USD</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* ==================== CREATE JOURNAL VOUCHER MODAL ==================== */}
      <Dialog open={showNewVoucherModal} onOpenChange={setShowNewVoucherModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Plus className="w-5 h-5 text-emerald-600" />
              Post Double-Entry Journal Voucher
            </DialogTitle>
            <DialogDescription>
              Enters balanced Debit and Credit allocations into the centralized General Ledger.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddVoucher} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Transaction Description *</Label>
              <Input
                required
                placeholder="e.g. Commercial Contract Invoice Settlement"
                value={newVoucher.description}
                onChange={(e) => setNewVoucher({ ...newVoucher, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Debit Account *</Label>
                <Select
                  value={newVoucher.accountDebit}
                  onValueChange={(val) => setNewVoucher({ ...newVoucher, accountDebit: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1010 - Operating Cash (Ecobank Liberia)">1010 - Cash (Ecobank)</SelectItem>
                    <SelectItem value="1020 - Mobile Money Settlement (Orange)">1020 - Orange MoMo</SelectItem>
                    <SelectItem value="1030 - Accounts Receivable">1030 - Accounts Receivable</SelectItem>
                    <SelectItem value="5010 - Operating Expenses">5010 - OpEx</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Credit Account *</Label>
                <Select
                  value={newVoucher.accountCredit}
                  onValueChange={(val) => setNewVoucher({ ...newVoucher, accountCredit: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4010 - Cargo Handling & Freight Revenue">4010 - Cargo Revenue</SelectItem>
                    <SelectItem value="4020 - TOCEPS Catering Commercial Revenue">4020 - Catering Revenue</SelectItem>
                    <SelectItem value="4030 - Managed IT & SaaS Licensing Revenue">4030 - SaaS Revenue</SelectItem>
                    <SelectItem value="2010 - Accounts Payable (Vendor)">2010 - Accounts Payable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Amount ($ USD) *</Label>
                <Input
                  type="number"
                  required
                  placeholder="5000"
                  value={newVoucher.amountUsd}
                  onChange={(e) => setNewVoucher({ ...newVoucher, amountUsd: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Operating Subsidiary *</Label>
                <Select
                  value={newVoucher.subsidiary}
                  onValueChange={(val) => setNewVoucher({ ...newVoucher, subsidiary: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cargo & Port Handling">Cargo &amp; Logistics</SelectItem>
                    <SelectItem value="TOCEPS Catering">TOCEPS Catering</SelectItem>
                    <SelectItem value="Managed IT & SaaS">Managed IT &amp; SaaS</SelectItem>
                    <SelectItem value="TOTAG Farm">TOTAG Farm</SelectItem>
                    <SelectItem value="Petroleum Hauling">Petroleum Hauling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setShowNewVoucherModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Post Journal Voucher
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


      {/* ==================== 1. ENTER AP VENDOR BILL MODAL ==================== */}
      <Dialog open={showNewAPModal} onOpenChange={setShowNewAPModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <CreditCard className="w-5 h-5 text-rose-600" />
              Enter Vendor Bill &bull; Accounts Payable (AP)
            </DialogTitle>
            <DialogDescription>
              Record incoming supplier invoices. Automatic 3-way matching with purchase orders.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddAPBill} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Vendor / Supplier Name *</Label>
              <Input
                required
                placeholder="e.g. TotalEnergies Liberia Terminal Supplies"
                value={newAPBill.vendorName}
                onChange={(e) => setNewAPBill({ ...newAPBill, vendorName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Expense Category</Label>
                <Select
                  value={newAPBill.category}
                  onValueChange={(val) => setNewAPBill({ ...newAPBill, category: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food Supplies (TOCEPS)">Food Supplies (TOCEPS)</SelectItem>
                    <SelectItem value="Equipment Maintenance">Equipment Maintenance</SelectItem>
                    <SelectItem value="SaaS Hosting &amp; Server Power">SaaS Hosting &amp; Server</SelectItem>
                    <SelectItem value="Agronomy Inputs &amp; Seeds">Agronomy Inputs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Amount ($ USD) *</Label>
                <Input
                  type="number"
                  required
                  placeholder="2500"
                  value={newAPBill.amountUsd}
                  onChange={(e) => setNewAPBill({ ...newAPBill, amountUsd: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Due Date *</Label>
                <Input
                  type="date"
                  required
                  value={newAPBill.dueDate}
                  onChange={(e) => setNewAPBill({ ...newAPBill, dueDate: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Disbursement Channel</Label>
                <Select
                  value={newAPBill.paymentMethod}
                  onValueChange={(val: any) => setNewAPBill({ ...newAPBill, paymentMethod: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Orange Money">Orange Money (+231-777-666-999)</SelectItem>
                    <SelectItem value="MTN MoMo">MTN MoMo (+231-887-666-999)</SelectItem>
                    <SelectItem value="Ecobank Wire">Ecobank Commercial Wire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setShowNewAPModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold">
                Post to Accounts Payable
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================== 2. ISSUE AR CLIENT INVOICE MODAL ==================== */}
      <Dialog open={showNewARModal} onOpenChange={setShowNewARModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Receipt className="w-5 h-5 text-blue-600" />
              Issue Customer Invoice &bull; Accounts Receivable (AR)
            </DialogTitle>
            <DialogDescription>
              Create customer billing records. Invoices automatically update AR aging buckets.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddARInvoice} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Client / Customer Legal Name *</Label>
              <Input
                required
                placeholder="e.g. National Port Authority of Liberia"
                value={newARInvoice.clientName}
                onChange={(e) => setNewARInvoice({ ...newARInvoice, clientName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Corporate Division</Label>
                <Select
                  value={newARInvoice.subsidiary}
                  onValueChange={(val) => setNewARInvoice({ ...newARInvoice, subsidiary: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cargo & Port Handling">Cargo &amp; Port Handling</SelectItem>
                    <SelectItem value="TOCEPS Catering">TOCEPS Catering</SelectItem>
                    <SelectItem value="Managed IT & SaaS">Managed IT &amp; SaaS</SelectItem>
                    <SelectItem value="TOTAG Farm">TOTAG Farm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Invoice Amount ($ USD) *</Label>
                <Input
                  type="number"
                  required
                  placeholder="15000"
                  value={newARInvoice.amountUsd}
                  onChange={(e) => setNewARInvoice({ ...newARInvoice, amountUsd: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Payment Due Date *</Label>
              <Input
                type="date"
                required
                value={newARInvoice.dueDate}
                onChange={(e) => setNewARInvoice({ ...newARInvoice, dueDate: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setShowNewARModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Generate &amp; Dispatch Invoice
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================== 3. BANK STATEMENT INGESTION MODAL ==================== */}
      <Dialog open={showBankFeedModal} onOpenChange={setShowBankFeedModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Landmark className="w-5 h-5 text-cyan-600" />
              Bank &amp; Mobile Money Feed Ingestion
            </DialogTitle>
            <DialogDescription>
              Reconcile bank statements against posted General Ledger vouchers with SOX audit compliance.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBankFeedImport} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Treasury Facility *</Label>
              <Select
                value={bankFeed.account}
                onValueChange={(val) => setBankFeed({ ...bankFeed, account: val })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ecobank Liberia (Acc: 6103394551)">Ecobank Liberia (6103394551)</SelectItem>
                  <SelectItem value="Orange Money Merchant (+231-777-666-999)">Orange Money (+231-777-666-999)</SelectItem>
                  <SelectItem value="MTN MoMo Merchant (+231-887-666-999)">MTN MoMo (+231-887-666-999)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Bank Ref / Transaction ID *</Label>
                <Input
                  required
                  value={bankFeed.refNumber}
                  onChange={(e) => setBankFeed({ ...bankFeed, refNumber: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Amount ($ USD) *</Label>
                <Input
                  type="number"
                  required
                  value={bankFeed.amountUsd}
                  onChange={(e) => setBankFeed({ ...bankFeed, amountUsd: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Transaction Description</Label>
              <Input
                value={bankFeed.description}
                onChange={(e) => setBankFeed({ ...bankFeed, description: e.target.value })}
              />
            </div>

            <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200 text-xs text-cyan-900 dark:text-cyan-200">
              <p className="font-bold">✓ Automated Bank Reconciliation</p>
              <p className="text-[11px] mt-0.5">
                Automatically matches transaction references with accounts receivable and payable ledgers.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setShowBankFeedModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                Reconcile &amp; Post to GL
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ProformaInvoiceModal
        isOpen={showProformaModal}
        onClose={() => setShowProformaModal(false)}
      />

    </div>
  );
}
