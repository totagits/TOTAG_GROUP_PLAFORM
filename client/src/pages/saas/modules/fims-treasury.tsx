import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Banknote, 
  TrendingUp, 
  Landmark, 
  Globe, 
  ShieldCheck, 
  Calendar,
  Plus,
  Download,
  RefreshCw,
  AlertTriangle,
  BarChart3,
  CreditCard
} from 'lucide-react';

export default function FIMSTreasuryPage() {
  const quickActions = [
    { label: 'Bank Transfer', icon: <Banknote className="w-4 h-4" />, href: '/saas/modules/fims-treasury/action/bank-transfer' },
    { label: 'Cash Forecast', icon: <TrendingUp className="w-4 h-4" />, href: '/saas/modules/fims-treasury/reports/cash-forecast' },
    { label: 'Add Bank Account', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-treasury/action/add-bank-account' },
    { label: 'Currency Exchange', icon: <RefreshCw className="w-4 h-4" />, href: '/saas/modules/fims-treasury/action/currency-exchange' },
    { label: 'Liquidity Report', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-treasury/reports/liquidity' },
    { label: 'Risk Assessment', icon: <AlertTriangle className="w-4 h-4" />, href: '/saas/modules/fims-treasury/reports/risk-assessment' }
  ];

  const stats = [
    { label: 'Total Cash Position', value: '$1.85M', trend: 'up' as const },
    { label: 'Bank Accounts', value: 8, trend: 'neutral' as const },
    { label: 'Investment Portfolio', value: '$450K', trend: 'up' as const },
    { label: 'FX Exposure', value: '$125K', trend: 'down' as const }
  ];

  return (
    <ModuleLayout
      moduleName="Treasury & Cash Management"
      moduleDescription="Real-time cash position dashboard, cash flow forecasting, and debt/investment management"
      category="FIMS"
      icon={<Banknote className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Cash Position */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Banknote className="w-5 h-5" />
              <span>Cash Position Dashboard</span>
            </CardTitle>
            <CardDescription>
              Live cash balances across all bank accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Operating Cash</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Available for daily operations
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">$1.2M</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Restricted Cash</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Reserved funds and deposits
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">$650K</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Primary Bank - USD</span>
                <Badge>$850K</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Business Bank - LRD</span>
                <Badge variant="secondary">L$185M (≈$1M)</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Investment Account</span>
                <Badge variant="outline">$450K</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily Inflow</span>
                <span className="text-sm font-semibold text-green-600">+$45K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily Outflow</span>
                <span className="text-sm font-semibold text-red-600">-$38K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Net Change</span>
                <span className="text-sm font-semibold text-blue-600">+$7K</span>
              </div>
            </div>
            <Button className="w-full" data-testid="button-cash-dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Detailed Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Cash Flow Forecasting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Cash Flow Forecasting</span>
            </CardTitle>
            <CardDescription>
              Predictive cash flow analysis and planning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">7-Day Forecast</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Short-term cash position projection
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Projected Balance</span>
                  <Badge>$1.9M (+$50K)</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">30-Day Outlook</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Medium-term liquidity planning
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Expected Position</span>
                  <Badge variant="secondary">$2.1M (+$250K)</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">+$50K</p>
                <p className="text-xs text-gray-500">Next 7 Days</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">+$250K</p>
                <p className="text-xs text-gray-500">Next 30 Days</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">95%</p>
                <p className="text-xs text-gray-500">Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Account Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Landmark className="w-5 h-5" />
              <span>Bank Accounts</span>
            </CardTitle>
            <CardDescription>
              Multi-bank account management and monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Landmark className="w-5 h-5 text-blue-500" />
                  <span>Ecobank Liberia - Primary</span>
                </div>
                <Badge>$850K USD</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Landmark className="w-5 h-5 text-green-500" />
                  <span>LBDI Bank - Operations</span>
                </div>
                <Badge variant="secondary">L$185M (≈$1M)</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Landmark className="w-5 h-5 text-purple-500" />
                  <span>United Bank - Payroll</span>
                </div>
                <Badge variant="outline">$125K USD</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Landmark className="w-5 h-5 text-orange-500" />
                  <span>Investment Account</span>
                </div>
                <Badge variant="secondary">$450K USD</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Account Performance</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Balance</span>
                  <span className="text-sm font-semibold text-blue-600">$1.85M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Transactions</span>
                  <span className="text-sm font-semibold text-green-600">2,340</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bank Fees (Monthly)</span>
                  <span className="text-sm font-semibold text-orange-600">$1,250</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-add-bank">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
              <Button variant="outline" size="sm" data-testid="button-bank-reconcile">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reconcile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Investment & Debt Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Investments & Debt</span>
            </CardTitle>
            <CardDescription>
              Portfolio tracking and debt management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Investment Portfolio</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fixed deposits and short-term investments
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Total Value</span>
                  <Badge>$450K (+2.8% YTD)</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Outstanding Debt</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Loans and credit facilities
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Total Outstanding</span>
                  <Badge variant="destructive">$285K</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Fixed Deposits</span>
                <span className="text-sm font-semibold text-green-600">$350K @ 4.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Treasury Bills</span>
                <span className="text-sm font-semibold text-blue-600">$100K @ 6.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Business Loan</span>
                <span className="text-sm font-semibold text-red-600">$285K @ 8.5%</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-portfolio-management">
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Portfolio
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Treasury Analytics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Treasury Analytics</CardTitle>
          <CardDescription>Comprehensive treasury performance and risk metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Liquidity Metrics */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Liquidity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Quick Ratio</span>
                  <span className="font-bold text-green-600">2.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Current Ratio</span>
                  <span className="font-bold text-blue-600">3.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cash Runway</span>
                  <span className="font-bold text-purple-600">18 months</span>
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-900 dark:text-orange-100">Risk Profile</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">FX Exposure</span>
                  <span className="font-bold text-orange-600">$125K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Interest Rate Risk</span>
                  <span className="font-bold text-blue-600">Low</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Credit Risk</span>
                  <span className="font-bold text-green-600">Minimal</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Investment Return</span>
                  <span className="font-bold text-green-600">+2.8% YTD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cost of Capital</span>
                  <span className="font-bold text-blue-600">6.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Net Interest Margin</span>
                  <span className="font-bold text-purple-600">1.2%</span>
                </div>
              </div>
            </div>

            {/* Currency Analysis */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">Currency</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">USD Position</span>
                  <span className="font-bold text-green-600">$1.4M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">LRD Position</span>
                  <span className="font-bold text-blue-600">L$185M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">FX Gain/Loss MTD</span>
                  <span className="font-bold text-orange-600">+$2.4K</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}