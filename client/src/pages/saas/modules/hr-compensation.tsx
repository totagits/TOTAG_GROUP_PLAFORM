import { useState } from 'react';
import { calculatePayroll, calculateBulkPayroll, formatLRD, PayrollInput, PayrollBreakdown } from '@shared/payroll';
import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Smartphone, 
  Shield, 
  Calculator, 
  Gift, 
  TrendingUp,
  Plus,
  Download,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Settings,
  Users,
  BarChart3,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Award,
  Target
} from 'lucide-react';

export default function HRCompensationPage() {
  const [activeTab, setActiveTab] = useState('payroll');
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);
  const [isSalaryReviewModalOpen, setIsSalaryReviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const { toast } = useToast();

  // Mock data for demonstration
  const employees = [
    { id: 1, name: 'John Kamara', position: 'Software Engineer', department: 'IT', baseSalary: 2500, bonus: 500, benefits: 450, total: 3450, paymentMethod: 'MTN Money' },
    { id: 2, name: 'Sarah Tubman', position: 'HR Manager', department: 'Human Resources', baseSalary: 3200, bonus: 800, benefits: 580, total: 4580, paymentMethod: 'Orange Money' },
    { id: 3, name: 'Moses Johnson', position: 'Accountant', department: 'Finance', baseSalary: 2800, bonus: 400, benefits: 520, total: 3720, paymentMethod: 'Bank Transfer' },
    { id: 4, name: 'Grace Cooper', position: 'Marketing Lead', department: 'Marketing', baseSalary: 2900, bonus: 600, benefits: 490, total: 3990, paymentMethod: 'MTN Money' }
  ];

  const benefits = [
    { id: 1, name: 'Health Insurance', type: 'Medical', coverage: '100%', enrolled: 142, cost: 25600 },
    { id: 2, name: 'Life Insurance', type: 'Insurance', coverage: '2x Salary', enrolled: 138, cost: 8400 },
    { id: 3, name: 'Retirement Fund', type: 'Savings', coverage: '5% Match', enrolled: 124, cost: 18900 },
    { id: 4, name: 'Transportation Allowance', type: 'Allowance', coverage: '$50/month', enrolled: 156, cost: 7800 }
  ];

  const handleRunPayroll = () => {
    toast({
      title: "Payroll Processing Initiated",
      description: "Starting payroll calculations for 156 employees. This may take a few minutes.",
    });
    setIsPayrollModalOpen(false);
  };

  const handleEditEmployee = (employeeId: number) => {
    toast({
      title: "Employee Editor",
      description: `Opening compensation editor for employee ID: ${employeeId}`,
    });
  };

  const handleViewEmployee = (employeeId: number) => {
    toast({
      title: "Employee Details",
      description: `Viewing detailed compensation information for employee ID: ${employeeId}`,
    });
  };

  const handleEditBenefit = (benefitId: number) => {
    toast({
      title: "Benefit Editor",
      description: `Opening benefit program editor for benefit ID: ${benefitId}`,
    });
  };

  const handleViewEnrollments = (benefitId: number) => {
    toast({
      title: "Enrollment Details",
      description: `Viewing enrollment details for benefit ID: ${benefitId}`,
    });
  };

  const handleAddEmployee = () => {
    toast({
      title: "Add Employee",
      description: "Opening new employee compensation form.",
    });
  };

  const handleAddBenefit = () => {
    toast({
      title: "Add Benefit Program",
      description: "Opening new benefit program creation form.",
    });
  };

  const handleConfigureMobilePayments = () => {
    toast({
      title: "Mobile Payment Configuration",
      description: "Opening mobile payment integration settings.",
    });
  };

  const handleViewAllHistory = () => {
    toast({
      title: "Payroll History",
      description: "Loading complete payroll processing history.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Compensation data is being exported to Excel format.",
    });
  };

  const handleMobilePayment = () => {
    toast({
      title: "Mobile Payment Setup",
      description: "Opening mobile money integration portal.",
    });
  };

  const handleTaxReport = () => {
    toast({
      title: "Tax Report Generated",
      description: "Generating comprehensive tax compliance report.",
    });
  };

  const handleBenefitsSetup = () => {
    setIsBenefitsModalOpen(true);
  };

  const handleSalaryReview = () => {
    setIsSalaryReviewModalOpen(true);
  };

  const quickActions = [
    { label: 'Calculate Payroll', icon: <Calculator className="w-4 h-4" />, href: '/saas/modules/hr-compensation/action/calculate-payroll' },
    { label: 'Mobile Payments', icon: <Smartphone className="w-4 h-4" />, href: '/saas/modules/hr-compensation/action/mobile-payments' },
    { label: 'Tax Reports', icon: <FileText className="w-4 h-4" />, href: '/saas/modules/hr-compensation/action/tax-reports' },
    { label: 'Benefits Admin', icon: <Gift className="w-4 h-4" />, href: '/saas/modules/hr-compensation/action/benefits-admin' },
    { label: 'Salary Review', icon: <TrendingUp className="w-4 h-4" />, href: '/saas/modules/hr-compensation/action/salary-review' },
    { label: 'Export Data', icon: <Download className="w-4 h-4" />, href: '/saas/modules/hr-compensation/action/export-data' }
  ];

  const stats = [
    { label: 'Monthly Payroll', value: 'L$8.6M', trend: 'up' as const },
    { label: 'Employees Paid', value: 156, trend: 'neutral' as const },
    { label: 'Mobile Payments', value: '89%', trend: 'up' as const },
    { label: 'Tax Compliance', value: '100%', trend: 'neutral' as const }
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentMethod = !selectedPaymentMethod || selectedPaymentMethod === 'all' ||
      (selectedPaymentMethod === 'mtn' && emp.paymentMethod === 'MTN Money') ||
      (selectedPaymentMethod === 'orange' && emp.paymentMethod === 'Orange Money') ||
      (selectedPaymentMethod === 'bank' && emp.paymentMethod === 'Bank Transfer');
    
    return matchesSearch && matchesPaymentMethod;
  });

  // Sample payroll calculation for demonstration
  const samplePayrollInput: PayrollInput = {
    employeeId: 'EMP-2025-001',
    grossMonthlySalary: 45000, // LRD
    allowances: {
      transport: 5000,
      housing: 8000,
      meals: 3000,
      other: 2000
    },
    loanInstallment: 3500,
    overtimeHours: 10,
    overtimeRate: 850
  };

  const samplePayroll = calculatePayroll(samplePayrollInput);

  // Data Management Content
  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span>Liberian Payroll Calculator</span>
          </CardTitle>
          <CardDescription>
            Advanced payroll processing with Liberian tax regulations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Sample Calculation</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Gross Salary:</span>
                <span className="font-medium ml-2">{formatLRD(samplePayroll.earnings.totalGrossEarnings)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Income Tax:</span>
                <span className="font-medium ml-2">{formatLRD(samplePayroll.deductions.incomeTax.totalMonthlyTax)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">NASSCORP (3%):</span>
                <span className="font-medium ml-2">{formatLRD(samplePayroll.deductions.nasscorp.monthlyContribution)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">LPA (1%):</span>
                <span className="font-medium ml-2">{formatLRD(samplePayroll.deductions.lpa.monthlyContribution)}</span>
              </div>
              <div className="col-span-2 pt-2 border-t">
                <span className="text-gray-600 dark:text-gray-400">Net Pay:</span>
                <span className="font-bold ml-2 text-green-600">{formatLRD(samplePayroll.summary.netPay)}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Button className="w-full" data-testid="button-calculate-individual-payroll">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Individual Payroll
            </Button>
            <Button variant="outline" className="w-full" data-testid="button-bulk-payroll-processing">
              <Users className="w-4 h-4 mr-2" />
              Process Bulk Payroll (156 employees)
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-green-600" />
            <span>Mobile Money Integration</span>
          </CardTitle>
          <CardDescription>
            Liberian mobile payment system integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">O</span>
                </div>
                <span className="font-medium">Orange Money</span>
              </div>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">67 users</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <span className="font-medium">MTN Money</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">72 users</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <span className="font-medium">Bank Transfer</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">17 users</Badge>
            </div>
          </div>
          <Button className="w-full" data-testid="button-configure-mobile-payments">
            <Settings className="w-4 h-4 mr-2" />
            Configure Payment Methods
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-purple-600" />
            <span>Benefits Management</span>
          </CardTitle>
          <CardDescription>
            Employee benefits and allowance administration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Health Insurance</h4>
                <Badge variant="secondary">142 enrolled</Badge>
              </div>
              <p className="text-sm text-gray-500">Monthly premium: L$8,500 per employee</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Housing Allowance</h4>
                <Badge variant="secondary">156 eligible</Badge>
              </div>
              <p className="text-sm text-gray-500">Monthly allowance: L$8,000 average</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Transportation</h4>
                <Badge variant="secondary">134 enrolled</Badge>
              </div>
              <p className="text-sm text-gray-500">Monthly allowance: L$5,000 average</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" data-testid="button-manage-benefits">
            <Gift className="w-4 h-4 mr-2" />
            Manage Benefits Programs
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Tax Compliance</span>
          </CardTitle>
          <CardDescription>
            Liberian tax regulations and compliance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Income Tax Compliance</h4>
              <p className="text-sm text-green-700 dark:text-green-300">Progressive tax bands: 0%, 2%, 10%, 15%, 20%, 25%</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">NASSCORP Contributions</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">3% employee contribution (max L$50,000/month)</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">LPA Deduction</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">1% for Liberian Press Association</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-tax-compliance-report">
            <FileText className="w-4 h-4 mr-2" />
            Generate Compliance Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Reports & Analytics Content
  const reportsContent = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Payroll Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-monthly-payroll-report">
            <FileText className="w-4 h-4 mr-2" />
            Monthly Payroll Summary
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-tax-deduction-report">
            <Calculator className="w-4 h-4 mr-2" />
            Tax Deduction Analysis
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-nasscorp-report">
            <Shield className="w-4 h-4 mr-2" />
            NASSCORP Contribution Report
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-employee-payslip">
            <Users className="w-4 h-4 mr-2" />
            Individual Payslips
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Compensation Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-semibold">Salary Trends</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Department-wise compensation analysis
            </p>
          </div>
          <Button className="w-full" data-testid="button-salary-analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics Dashboard
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-purple-600" />
            <span>Export & Backup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-export-payroll-xlsx">
            <FileText className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-export-tax-csv">
            <Calculator className="w-4 h-4 mr-2" />
            Tax Report CSV
          </Button>
          <Button className="w-full" data-testid="button-backup-payroll-data">
            <Download className="w-4 h-4 mr-2" />
            Backup Payroll Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Settings & Configuration Content
  const settingsContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <span>Payroll Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure payroll calculation parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Tax Year</p>
                <p className="text-sm text-gray-500">2025 tax regulations</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-update-tax-year">
                Update
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">NASSCORP Rate</p>
                <p className="text-sm text-gray-500">3% employee contribution</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-configure-nasscorp">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Minimum Wage</p>
                <p className="text-sm text-gray-500">L$8,000/month</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-update-minimum-wage">
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Payment Methods</span>
          </CardTitle>
          <CardDescription>
            Configure mobile money and bank integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Orange Money API</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">Merchant ID: TOTAG-OM-2025</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">MTN Money API</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Merchant ID: TOTAG-MTN-2025</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-payment-api-settings">
            <Settings className="w-4 h-4 mr-2" />
            API Configuration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Access Control</span>
          </CardTitle>
          <CardDescription>
            Manage payroll access permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100">Payroll Administrator</h4>
              <p className="text-sm text-red-700 dark:text-red-300">Full payroll processing access</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">HR Manager</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">View and report generation</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Department Head</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">Department payroll view only</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-manage-payroll-permissions">
            <Shield className="w-4 h-4 mr-2" />
            Manage Permissions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span>Bonus & Incentives</span>
          </CardTitle>
          <CardDescription>
            Configure performance-based compensation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
            <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-semibold">Performance Bonuses</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Quarterly and annual bonus programs
            </p>
          </div>
          <Button className="w-full" data-testid="button-configure-bonuses">
            <Settings className="w-4 h-4 mr-2" />
            Configure Bonus Programs
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Compensation & Benefits"
      moduleDescription="Advanced Liberian payroll processing with tax calculations, mobile money integration, and benefits administration"
      category="HRMIS"
      icon={<DollarSign className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
      dataContent={dataContent}
      reportsContent={reportsContent}
      settingsContent={settingsContent}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="payroll" data-testid="tab-payroll">Payroll Management</TabsTrigger>
          <TabsTrigger value="employees" data-testid="tab-employees">Employee Compensation</TabsTrigger>
          <TabsTrigger value="benefits" data-testid="tab-benefits">Benefits Administration</TabsTrigger>
          <TabsTrigger value="mobile" data-testid="tab-mobile">Mobile Payments</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Pay Analytics</TabsTrigger>
        </TabsList>

        {/* Payroll Management Tab */}
        <TabsContent value="payroll" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Current Payroll Cycle</span>
                </CardTitle>
                <CardDescription>February 2025 payroll processing status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Total Amount</h4>
                    <p className="text-3xl font-bold text-green-600 mt-2">$485,720</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">156 employees</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Processing Status</h4>
                    <Progress value={75} className="mt-2" />
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">75% Complete</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Base Salary Calculations</span>
                    </div>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Tax & Deductions</span>
                    </div>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">Benefits Processing</span>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                </div>

                <Dialog open={isPayrollModalOpen} onOpenChange={setIsPayrollModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg" data-testid="button-process-payroll">
                      <Calculator className="w-4 h-4 mr-2" />
                      Process Payroll for February 2025
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Process Payroll</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to process payroll for February 2025? This action will calculate and distribute payments to all employees.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Payroll Summary</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Total Employees:</span>
                            <span className="font-medium ml-2">156</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                            <span className="font-medium ml-2">$485,720</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Tax Deductions:</span>
                            <span className="font-medium ml-2">$72,858</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Net Payout:</span>
                            <span className="font-medium ml-2">$412,862</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPayrollModalOpen(false)} data-testid="button-cancel-payroll">Cancel</Button>
                      <Button onClick={handleRunPayroll} data-testid="button-confirm-payroll">
                        <Calculator className="w-4 h-4 mr-2" />
                        Confirm & Process
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Payroll History</span>
                </CardTitle>
                <CardDescription>Recent payroll processing records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium">January 2025</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">156 employees • $485,720</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Completed</Badge>
                      <p className="text-xs text-gray-500 mt-1">2025-01-31</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium">December 2024</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">154 employees • $478,920</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Completed</Badge>
                      <p className="text-xs text-gray-500 mt-1">2024-12-31</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium">November 2024</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">151 employees • $465,880</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Completed</Badge>
                      <p className="text-xs text-gray-500 mt-1">2024-11-30</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={handleViewAllHistory} data-testid="button-view-all-history">
                  <Eye className="w-4 h-4 mr-2" />
                  View Complete History
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employee Compensation Tab */}
        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Employee Compensation Management</span>
                  </CardTitle>
                  <CardDescription>Manage individual employee salaries, bonuses, and benefits</CardDescription>
                </div>
                <Button onClick={handleAddEmployee} data-testid="button-add-employee-compensation">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search employees by name, department, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-employees"
                  />
                </div>
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger className="w-48" data-testid="select-payment-method">
                    <SelectValue placeholder="Filter by payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="mtn">MTN Money</SelectItem>
                    <SelectItem value="orange">Orange Money</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Benefits</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.position}</div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>${employee.baseSalary.toLocaleString()}</TableCell>
                        <TableCell>${employee.bonus.toLocaleString()}</TableCell>
                        <TableCell>${employee.benefits.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">${employee.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={employee.paymentMethod === 'MTN Money' ? 'default' : 
                                        employee.paymentMethod === 'Orange Money' ? 'secondary' : 'outline'}>
                            {employee.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee.id)} data-testid={`button-edit-employee-${employee.id}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleViewEmployee(employee.id)} data-testid={`button-view-employee-${employee.id}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Administration Tab */}
        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5" />
                    <span>Benefits Programs</span>
                  </CardTitle>
                  <CardDescription>Manage employee benefits and enrollment</CardDescription>
                </div>
                <Button onClick={handleAddBenefit} data-testid="button-add-benefit">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Benefit Program
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit) => (
                  <Card key={benefit.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{benefit.name}</CardTitle>
                        <Badge variant="outline">{benefit.type}</Badge>
                      </div>
                      <CardDescription>{benefit.coverage}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Enrolled</p>
                            <p className="text-2xl font-bold">{benefit.enrolled}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</p>
                            <p className="text-2xl font-bold">${benefit.cost.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditBenefit(benefit.id)} data-testid={`button-edit-benefit-${benefit.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewEnrollments(benefit.id)} data-testid={`button-view-enrollments-${benefit.id}`}>
                            <Users className="w-4 h-4 mr-2" />
                            View Enrollments
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mobile Payments Tab */}
        <TabsContent value="mobile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" />
                  <span>Mobile Money Integration</span>
                </CardTitle>
                <CardDescription>MTN Money and Orange Money for Liberia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">MTN Money</h4>
                      <Switch defaultChecked data-testid="switch-mtn-enabled" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Direct salary transfers to MTN mobile wallets
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Active Users:</span>
                        <span className="font-medium ml-2">89 employees</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                        <span className="font-medium ml-2">99.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Orange Money</h4>
                      <Switch defaultChecked data-testid="switch-orange-enabled" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Seamless payments through Orange mobile platform
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Active Users:</span>
                        <span className="font-medium ml-2">67 employees</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                        <span className="font-medium ml-2">98.8%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={handleConfigureMobilePayments} data-testid="button-configure-mobile-payments">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Mobile Payment Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Payment Analytics</span>
                </CardTitle>
                <CardDescription>Mobile payment performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">89%</p>
                      <p className="text-xs text-gray-500">Mobile Adoption</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">99.1%</p>
                      <p className="text-xs text-gray-500">Success Rate</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">24h</p>
                      <p className="text-xs text-gray-500">Avg. Processing</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Total Transactions</span>
                      <span className="text-lg font-bold">1,247</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Transaction Volume</span>
                      <span className="text-lg font-bold">$485,720</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Failed Transactions</span>
                      <span className="text-lg font-bold text-red-600">12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pay Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Pay Equity Analysis</span>
                </CardTitle>
                <CardDescription>Monitor pay gaps and ensure equitable compensation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Gender Pay Equity</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pay Gap</span>
                      <span className="text-lg font-bold text-green-600">2.1%</span>
                    </div>
                    <Progress value={97.9} className="mt-2" />
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">Within industry standards</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Department Equity Score</span>
                      <Badge>Excellent</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Position Level Equity</span>
                      <Badge>Good</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Experience-Based Pay</span>
                      <Badge variant="outline">Needs Review</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Compensation Trends</span>
                </CardTitle>
                <CardDescription>Track salary progression and market competitiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">+8.2%</p>
                      <p className="text-xs text-gray-500">Avg. Annual Increase</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">92%</p>
                      <p className="text-xs text-gray-500">Market Competitive</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Turnover Risk (High Pay)</span>
                      <span className="text-sm text-green-600">Low (3%)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Market Positioning</span>
                      <span className="text-sm text-blue-600">75th Percentile</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Pay Range Compression</span>
                      <span className="text-sm text-orange-600">Monitor</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Benefits Setup Modal */}
      <Dialog open={isBenefitsModalOpen} onOpenChange={setIsBenefitsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Benefits Program Setup</DialogTitle>
            <DialogDescription>
              Configure new benefit programs and enrollment options for employees.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="benefit-name">Benefit Name</Label>
                <Input id="benefit-name" placeholder="e.g., Health Insurance" data-testid="input-benefit-name" />
              </div>
              <div>
                <Label htmlFor="benefit-type">Benefit Type</Label>
                <Select>
                  <SelectTrigger data-testid="select-benefit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="allowance">Allowance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="coverage">Coverage Details</Label>
                <Input id="coverage" placeholder="e.g., 100% premium coverage" data-testid="input-coverage" />
              </div>
              <div>
                <Label htmlFor="monthly-cost">Monthly Cost ($)</Label>
                <Input id="monthly-cost" type="number" placeholder="0.00" data-testid="input-monthly-cost" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Detailed benefit description..." data-testid="textarea-description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBenefitsModalOpen(false)} data-testid="button-cancel-benefits">
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Benefit Program Created",
                description: "New benefit program has been successfully set up.",
              });
              setIsBenefitsModalOpen(false);
            }} data-testid="button-confirm-benefits">
              <Gift className="w-4 h-4 mr-2" />
              Create Benefit Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Salary Review Modal */}
      <Dialog open={isSalaryReviewModalOpen} onOpenChange={setIsSalaryReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salary Review Process</DialogTitle>
            <DialogDescription>
              Initiate company-wide salary review and adjustment process for performance-based compensation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="review-period">Review Period</Label>
                <Select>
                  <SelectTrigger data-testid="select-review-period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1-2025">Q1 2025</SelectItem>
                    <SelectItem value="annual-2024">Annual 2024</SelectItem>
                    <SelectItem value="mid-year-2024">Mid-Year 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="adjustment-type">Adjustment Type</Label>
                <Select>
                  <SelectTrigger data-testid="select-adjustment-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="merit">Merit Increase</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="market">Market Adjustment</SelectItem>
                    <SelectItem value="cost-of-living">Cost of Living</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget-limit">Budget Limit (%)</Label>
                <Input id="budget-limit" type="number" placeholder="5.0" data-testid="input-budget-limit" />
              </div>
              <div>
                <Label htmlFor="effective-date">Effective Date</Label>
                <Input id="effective-date" type="date" data-testid="input-effective-date" />
              </div>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Review Impact</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Employees Affected:</span>
                  <span className="font-medium ml-2">156</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Estimated Budget:</span>
                  <span className="font-medium ml-2">$24,286</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Annual Impact:</span>
                  <span className="font-medium ml-2">$291,432</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSalaryReviewModalOpen(false)} data-testid="button-cancel-salary-review">
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Salary Review Initiated",
                description: "Company-wide salary review process has been started successfully.",
              });
              setIsSalaryReviewModalOpen(false);
            }} data-testid="button-confirm-salary-review">
              <TrendingUp className="w-4 h-4 mr-2" />
              Start Salary Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
}