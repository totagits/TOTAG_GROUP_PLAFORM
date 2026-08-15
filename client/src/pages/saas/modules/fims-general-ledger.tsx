import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  BookOpen, 
  Globe, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign,
  Plus,
  Download,
  Search,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function FIMSGeneralLedgerPage() {
  const quickActions = [
    { label: 'New Journal Entry', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-general-ledger/action/new-journal-entry' },
    { label: 'Account Search', icon: <Search className="w-4 h-4" />, href: '/saas/modules/fims-general-ledger/action/account-search' },
    { label: 'Trial Balance', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/fims-general-ledger/action/trial-balance' },
    { label: 'Reconciliation', icon: <CheckCircle2 className="w-4 h-4" />, href: '/saas/modules/fims-general-ledger/action/reconciliation' },
    { label: 'Export GL', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-general-ledger/action/export-gl' },
    { label: 'Period Close', icon: <Calendar className="w-4 h-4" />, href: '/saas/modules/fims-general-ledger/action/period-close' }
  ];

  const stats = [
    { label: 'Total Accounts', value: 485, trend: 'up' as const },
    { label: 'Journal Entries', value: '1.2K', trend: 'up' as const },
    { label: 'Unreconciled Items', value: 23, trend: 'down' as const },
    { label: 'Period Balance', value: '$2.4M', trend: 'up' as const }
  ];

  // Data Management Content
  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Chart of Accounts</span>
          </CardTitle>
          <CardDescription>
            Manage account structure and classifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/saas/modules/fims-general-ledger/data/accounts/view">
              <Button className="h-16 flex flex-col items-center justify-center space-y-2" data-testid="button-view-accounts">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs">View All (485)</span>
              </Button>
            </Link>
            <Link href="/saas/modules/fims-general-ledger/data/accounts/add">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2" data-testid="button-add-account">
                <Plus className="w-5 h-5" />
                <span className="text-xs">Add Account</span>
              </Button>
            </Link>
            <Link href="/saas/modules/fims-general-ledger/data/accounts/reconcile">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2" data-testid="button-reconcile-accounts">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs">Reconcile</span>
              </Button>
            </Link>
            <Link href="/saas/modules/fims-general-ledger/data/accounts/bulk">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2" data-testid="button-bulk-account-operations">
                <Download className="w-5 h-5" />
                <span className="text-xs">Bulk Operations</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span>Journal Entry Management</span>
          </CardTitle>
          <CardDescription>
            Create and manage journal entries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="font-medium">Manual Entries</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">12 Pending</Badge>
                <Link href="/saas/modules/fims-general-ledger/data/journal/manual">
                  <Button size="sm" variant="ghost" data-testid="button-manage-manual-entries">
                    <FileText className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="font-medium">Automated Entries</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">847 This Month</Badge>
                <Link href="/saas/modules/fims-general-ledger/data/journal/automated">
                  <Button size="sm" variant="ghost" data-testid="button-view-automated-entries">
                    <BarChart3 className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
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
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Standard Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/fims-general-ledger/reports/trial-balance">
            <Button variant="outline" className="w-full justify-start" data-testid="button-trial-balance-report">
              <BarChart3 className="w-4 h-4 mr-2" />
              Trial Balance
            </Button>
          </Link>
          <Link href="/saas/modules/fims-general-ledger/reports/general-ledger">
            <Button variant="outline" className="w-full justify-start" data-testid="button-general-ledger-report">
              <BookOpen className="w-4 h-4 mr-2" />
              General Ledger
            </Button>
          </Link>
          <Link href="/saas/modules/fims-general-ledger/reports/chart-accounts">
            <Button variant="outline" className="w-full justify-start" data-testid="button-chart-accounts-report">
              <FileText className="w-4 h-4 mr-2" />
              Chart of Accounts
            </Button>
          </Link>
          <Link href="/saas/modules/fims-general-ledger/reports/journal-summary">
            <Button variant="outline" className="w-full justify-start" data-testid="button-journal-summary-report">
              <BookOpen className="w-4 h-4 mr-2" />
              Journal Summary
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <span>Advanced Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="font-semibold">GL Analytics</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Transaction patterns and insights
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-green-600" />
            <span>Export & Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/fims-general-ledger/reports/create-custom">
            <Button className="w-full" data-testid="button-create-custom-gl-report">
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Report
            </Button>
          </Link>
          <Link href="/saas/modules/fims-general-ledger/reports/export">
            <Button variant="outline" className="w-full" data-testid="button-export-gl-data">
              <Download className="w-4 h-4 mr-2" />
              Export GL Data
            </Button>
          </Link>
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
            <BookOpen className="w-5 h-5 text-gray-600" />
            <span>General Ledger Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure GL module preferences and rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Account Number Format</p>
                <p className="text-sm text-gray-500">XXXX-XX-XX (Asset-Type-Detail)</p>
              </div>
              <Link href="/saas/modules/fims-general-ledger/settings/account-format">
                <Button size="sm" variant="outline" data-testid="button-configure-account-format">
                  Configure
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Journal Entry Approval</p>
                <p className="text-sm text-gray-500">2-level approval workflow</p>
              </div>
              <Link href="/saas/modules/fims-general-ledger/settings/approval-workflow">
                <Button size="sm" variant="outline" data-testid="button-manage-approval-workflow">
                  Manage
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Period Controls</p>
                <p className="text-sm text-gray-500">Monthly closing procedures</p>
              </div>
              <Link href="/saas/modules/fims-general-ledger/settings/period-controls">
                <Button size="sm" variant="outline" data-testid="button-manage-period-controls">
                  Manage
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Multi-Currency Settings</span>
          </CardTitle>
          <CardDescription>
            Manage currencies and exchange rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Base Currency</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">USD - United States Dollar</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Active Currencies</h4>
              <p className="text-sm text-green-700 dark:text-green-300">LRD, EUR, GBP (3 additional)</p>
            </div>
          </div>
          <Link href="/saas/modules/fims-general-ledger/settings/currency-management">
            <Button className="w-full" data-testid="button-manage-currencies">
              <Globe className="w-4 h-4 mr-2" />
              Manage Currencies
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="General Ledger"
      moduleDescription="Unified general ledger, automated journal entries, multi-currency support, and flexible chart of accounts"
      category="FIMS"
      icon={<BookOpen className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
      dataContent={dataContent}
      reportsContent={reportsContent}
      settingsContent={settingsContent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart of Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Chart of Accounts</span>
            </CardTitle>
            <CardDescription>
              Flexible account structure with automated categorization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Assets</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Current and fixed asset accounts
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">$1.8M</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Liabilities</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Current and long-term liabilities
                </p>
                <p className="text-lg font-bold text-green-600 mt-2">$450K</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Equity</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Owner's equity and retained earnings
                </p>
                <p className="text-lg font-bold text-purple-600 mt-2">$1.35M</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Revenue</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Income and revenue accounts
                </p>
                <p className="text-lg font-bold text-orange-600 mt-2">$2.1M</p>
              </div>
            </div>
            <Link href="/saas/modules/fims-general-ledger/data/chart-of-accounts">
              <Button className="w-full" data-testid="button-chart-accounts">
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Chart of Accounts
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Journal Entries</span>
            </CardTitle>
            <CardDescription>
              Automated and manual journal entry processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Automated Entries</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  System-generated entries from AP, AR, and payroll processing
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">This Month</span>
                  <Badge>847 entries</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Manual Entries</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manual adjustments and corrections with approval workflow
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Pending Approval</span>
                  <Badge variant="secondary">12 entries</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">859</p>
                <p className="text-xs text-gray-500">Total Entries</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">12</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">100%</p>
                <p className="text-xs text-gray-500">Balanced</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Currency Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Multi-Currency</span>
            </CardTitle>
            <CardDescription>
              Global currency support with real-time conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span>USD (Base Currency)</span>
                </div>
                <Badge>Primary</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span>LRD (Liberian Dollar)</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-purple-500" />
                  <span>EUR (Euro)</span>
                </div>
                <Badge variant="outline">Available</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-orange-500" />
                  <span>GBP (British Pound)</span>
                </div>
                <Badge variant="outline">Available</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Exchange Rates (Live)</h5>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>USD/LRD</span>
                  <span className="text-green-600">185.50</span>
                </div>
                <div className="flex justify-between">
                  <span>USD/EUR</span>
                  <span className="text-blue-600">0.85</span>
                </div>
                <div className="flex justify-between">
                  <span>USD/GBP</span>
                  <span className="text-purple-600">0.79</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/saas/modules/fims-general-ledger/settings/currency-setup">
                <Button variant="outline" size="sm" data-testid="button-currency-setup">
                  <Globe className="w-4 h-4 mr-2" />
                  Setup Currency
                </Button>
              </Link>
              <Link href="/saas/modules/fims-general-ledger/data/exchange-rates">
                <Button variant="outline" size="sm" data-testid="button-exchange-rates">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Rate History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Account Reconciliation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Reconciliation</span>
            </CardTitle>
            <CardDescription>
              Automated bank and account reconciliation tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Bank Reconciliation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated matching of bank statements with GL transactions
                </p>
                <div className="mt-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-green-600">December 2024 - Complete</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Outstanding Items</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unmatched transactions requiring manual review
                </p>
                <div className="mt-2 flex items-center">
                  <FileText className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-sm text-orange-600">23 items pending</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Reconciliation Rate</span>
                <span className="text-sm font-semibold text-green-600">97.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '97.2%'}}></div>
              </div>
            </div>
            <Link href="/saas/modules/fims-general-ledger/action/start-reconciliation">
              <Button className="w-full" variant="outline" data-testid="button-reconciliation">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Start Reconciliation
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* GL Activity Feed */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent General Ledger Activity</CardTitle>
          <CardDescription>Latest journal entries and account movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { entry: 'Automated payroll journal entry posted', amount: '$45,230', time: '2 hours ago', type: 'automated' },
              { entry: 'Bank reconciliation completed for December', amount: '$1.2M matched', time: '4 hours ago', type: 'reconciliation' },
              { entry: 'Manual adjustment for inventory valuation', amount: '$8,750', time: '1 day ago', type: 'manual' },
              { entry: 'Multi-currency revaluation performed', amount: '$2,340 FX gain', time: '2 days ago', type: 'currency' },
              { entry: 'Period-end accrual entries posted', amount: '$15,600', time: '3 days ago', type: 'automated' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'automated' ? 'bg-green-500' :
                    activity.type === 'reconciliation' ? 'bg-blue-500' :
                    activity.type === 'manual' ? 'bg-orange-500' : 'bg-purple-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.entry}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <Badge variant="outline">{activity.amount}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}