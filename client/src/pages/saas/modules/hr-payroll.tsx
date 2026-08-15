import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  DollarSign, 
  Calculator, 
  FileText,
  Users, 
  Plus,
  Download,
  Settings,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  CreditCard,
  Banknote,
  Receipt,
  TrendingUp,
  Clock,
  Building2,
  ArrowRightLeft
} from 'lucide-react';

export default function PayrollInterfacePage() {
  const quickActions = [
    { label: 'Run Payroll', icon: <Calculator className="w-4 h-4" />, href: '/saas/modules/hr-payroll/action/run-payroll' },
    { label: 'Process Payments', icon: <Banknote className="w-4 h-4" />, href: '/saas/modules/hr-payroll/action/process-payments' },
    { label: 'Generate Payslips', icon: <Receipt className="w-4 h-4" />, href: '/saas/modules/hr-payroll/action/generate-payslips' },
    { label: 'Tax Filing', icon: <FileText className="w-4 h-4" />, href: '/saas/modules/hr-payroll/action/tax-filing' },
    { label: 'Adjustments', icon: <ArrowRightLeft className="w-4 h-4" />, href: '/saas/modules/hr-payroll/action/adjustments' },
    { label: 'Export to Finance', icon: <Download className="w-4 h-4" />, href: '/saas/modules/hr-payroll/action/export-finance' },
    { label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/hr-payroll/action/reports' }
  ];

  const stats = [
    { label: 'Monthly Payroll', value: '$485,000', trend: 'neutral' as const },
    { label: 'Employees Paid', value: 156, trend: 'up' as const },
    { label: 'Pending Adj.', value: 8, trend: 'down' as const },
    { label: 'Next Run', value: 'Jan 25', trend: 'neutral' as const }
  ];

  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-green-600" />
            <span>Payroll Processing</span>
          </CardTitle>
          <CardDescription>
            Run and manage payroll cycles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Last Run</h4>
                <Badge className="bg-green-100 text-green-800">Complete</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Dec 25, 2025</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Next Run</h4>
                <Badge variant="outline" className="border-blue-300 text-blue-700">Scheduled</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Jan 25, 2026</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-payroll/data/payroll-runs">
              <Button className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                View Payroll Runs
              </Button>
            </Link>
            <Link href="/saas/modules/hr-payroll/data/payroll-inputs">
              <Button variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Review Payroll Inputs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span>Earnings & Deductions</span>
          </CardTitle>
          <CardDescription>
            Manage pay elements and calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Earnings</h4>
                <Badge className="bg-blue-100 text-blue-800">12 Types</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Base, OT, Allowances</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Deductions</h4>
                <Badge variant="outline" className="border-orange-300 text-orange-700">8 Types</Badge>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">Tax, Pension, Loans</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-payroll/data/earnings-elements">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Manage Earnings
              </Button>
            </Link>
            <Link href="/saas/modules/hr-payroll/data/deduction-elements">
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Manage Deductions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-purple-600" />
            <span>Payslips & Statements</span>
          </CardTitle>
          <CardDescription>
            Generate and distribute pay documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-purple-900 dark:text-purple-100">December 2025</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">156 payslips generated</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Distributed</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Annual Summaries</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Year-end statements ready</p>
              </div>
              <Badge variant="outline">Available</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-payroll/data/payslips">
              <Button className="w-full">
                <Receipt className="w-4 h-4 mr-2" />
                View Payslips
              </Button>
            </Link>
            <Link href="/saas/modules/hr-payroll/data/annual-statements">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Annual Statements
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <span>Statutory Compliance</span>
          </CardTitle>
          <CardDescription>
            Tax filings and regulatory submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-teal-900 dark:text-teal-100">Tax Returns</h4>
                <Badge className="bg-teal-100 text-teal-800">Filed</Badge>
              </div>
              <p className="text-sm text-teal-700 dark:text-teal-300">Q4 2025 complete</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Pension</h4>
                <Badge variant="outline" className="border-yellow-300 text-yellow-700">Due Soon</Badge>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Jan 31 deadline</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-payroll/data/tax-submissions">
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Tax Submissions
              </Button>
            </Link>
            <Link href="/saas/modules/hr-payroll/data/pension-contributions">
              <Button variant="outline" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Pension Contributions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const reportsContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Payroll Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-payroll/reports/payroll-summary">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Payroll Summary
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/reports/payroll-register">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Payroll Register
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/reports/payroll-variance">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Variance Analysis
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-green-600" />
            <span>Statutory Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-payroll/reports/tax-report">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Tax Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/reports/pension-report">
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              Pension Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/reports/regulatory-filings">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="w-4 h-4 mr-2" />
              Regulatory Filings
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-purple-600" />
            <span>Integration Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-payroll/reports/gl-journal">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              GL Journal Export
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/reports/bank-file">
            <Button variant="outline" className="w-full justify-start">
              <Banknote className="w-4 h-4 mr-2" />
              Bank File Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/reports/cost-allocation">
            <Button variant="outline" className="w-full justify-start">
              <Calculator className="w-4 h-4 mr-2" />
              Cost Allocation
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  const settingsContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-green-600" />
            <span>Payroll Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-payroll/settings/pay-calendars">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Pay Calendars
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/settings/calculation-rules">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Calculation Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/settings/pay-groups">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Pay Groups
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/settings/retro-rules">
            <Button variant="outline" className="w-full justify-start">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Retro Processing Rules
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Compliance Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-payroll/settings/tax-tables">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Tax Tables
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/settings/pension-schemes">
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              Pension Schemes
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/settings/statutory-elements">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="w-4 h-4 mr-2" />
              Statutory Elements
            </Button>
          </Link>
          <Link href="/saas/modules/hr-payroll/settings/integration-mappings">
            <Button variant="outline" className="w-full justify-start">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Integration Mappings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Payroll Interface"
      moduleDescription="Payroll processing, statutory compliance, and finance integration"
      category="HRMIS"
      icon={<Calculator className="w-6 h-6 text-green-600" />}
      quickActions={quickActions}
      stats={stats}
      dataContent={dataContent}
      reportsContent={reportsContent}
      settingsContent={settingsContent}
    >
      <div className="text-center py-8 text-gray-500">
        Select a quick action or tab above to get started
      </div>
    </ModuleLayout>
  );
}
