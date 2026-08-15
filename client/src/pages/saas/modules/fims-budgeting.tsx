import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Users, 
  TrendingUp, 
  BarChart3, 
  AlertTriangle, 
  Target,
  Plus,
  Download,
  Copy,
  Calendar,
  PieChart,
  Workflow
} from 'lucide-react';

export default function FIMSBudgetingPage() {
  const quickActions = [
    { label: 'Create Budget', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-budgeting/action/create-budget' },
    { label: 'Copy Last Year', icon: <Copy className="w-4 h-4" />, href: '/saas/modules/fims-budgeting/action/copy-budget' },
    { label: 'Variance Analysis', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/fims-budgeting/reports/variance' },
    { label: 'Forecast Update', icon: <TrendingUp className="w-4 h-4" />, href: '/saas/modules/fims-budgeting/action/update-forecast' },
    { label: 'Budget Report', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-budgeting/reports/summary' },
    { label: 'Scenario Planning', icon: <Target className="w-4 h-4" />, href: '/saas/modules/fims-budgeting/action/scenario-planning' }
  ];

  const stats = [
    { label: 'Annual Budget', value: '$2.8M', trend: 'up' as const },
    { label: 'YTD Actual', value: '$1.9M', trend: 'up' as const },
    { label: 'Budget Variance', value: '3.2%', trend: 'down' as const },
    { label: 'Departments', value: 12, trend: 'neutral' as const }
  ];

  return (
    <ModuleLayout
      moduleName="Budgeting & Forecasting"
      moduleDescription="Collaborative budgeting tools, scenario modeling, rolling forecasts, and budget vs. actuals analysis"
      category="FIMS"
      icon={<Calculator className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collaborative Budgeting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Collaborative Budgeting</span>
            </CardTitle>
            <CardDescription>
              Multi-department budget planning and approval workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">2025 Budget</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Annual budget planning cycle
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">$2.8M</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Completion</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Departments completed
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">83%</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Submitted Budgets</span>
                <Badge>10 of 12</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Under Review</span>
                <Badge variant="secondary">6 budgets</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Approved</span>
                <Badge variant="outline">4 budgets</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Department Status</h5>
              <div className="space-y-2">
                {[
                  { dept: 'Sales & Marketing', status: 'approved', amount: '$450K' },
                  { dept: 'Operations', status: 'review', amount: '$890K' },
                  { dept: 'IT Services', status: 'submitted', amount: '$320K' },
                  { dept: 'HR & Admin', status: 'pending', amount: '$280K' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{item.dept}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{item.amount}</span>
                      <Badge variant={
                        item.status === 'approved' ? 'default' :
                        item.status === 'review' ? 'secondary' :
                        item.status === 'submitted' ? 'outline' : 'destructive'
                      } size="sm">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full" data-testid="button-collaborative-budgeting">
              <Workflow className="w-4 h-4 mr-2" />
              Budget Workflow
            </Button>
          </CardContent>
        </Card>

        {/* Scenario Modeling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Scenario Modeling</span>
            </CardTitle>
            <CardDescription>
              Multiple scenario planning and what-if analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Base Case Scenario</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current business assumptions and growth projections
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Revenue Target</span>
                  <Badge>$3.2M (+15%)</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Optimistic Scenario</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Best-case performance with accelerated growth
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Revenue Target</span>
                  <Badge variant="secondary">$3.8M (+38%)</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Conservative Scenario</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cautious growth with risk mitigation measures
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Revenue Target</span>
                  <Badge variant="destructive">$2.6M (-5%)</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">$3.2M</p>
                <p className="text-xs text-gray-500">Base Case</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">$3.8M</p>
                <p className="text-xs text-gray-500">Optimistic</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-orange-600">$2.6M</p>
                <p className="text-xs text-gray-500">Conservative</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rolling Forecasts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Rolling Forecasts</span>
            </CardTitle>
            <CardDescription>
              Continuous 12-month forward-looking projections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span>Q1 2025 Forecast</span>
                </div>
                <Badge>$720K</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span>Q2 2025 Forecast</span>
                </div>
                <Badge variant="secondary">$850K</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span>Q3 2025 Forecast</span>
                </div>
                <Badge variant="outline">$920K</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span>Q4 2025 Forecast</span>
                </div>
                <Badge variant="secondary">$780K</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Forecast Accuracy</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Last Quarter Accuracy</span>
                  <span className="text-sm font-semibold text-green-600">96.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">YTD Average Accuracy</span>
                  <span className="text-sm font-semibold text-blue-600">94.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Forecast Frequency</span>
                  <span className="text-sm font-semibold text-purple-600">Monthly</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-update-forecast">
                <TrendingUp className="w-4 h-4 mr-2" />
                Update Forecast
              </Button>
              <Button variant="outline" size="sm" data-testid="button-forecast-history">
                <BarChart3 className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Budget vs. Actuals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Budget vs. Actuals</span>
            </CardTitle>
            <CardDescription>
              Real-time variance analysis and performance tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">YTD Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Actual vs. budget comparison year-to-date
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Budget Variance</span>
                  <Badge>3.2% under budget</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Key Variances</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Significant deviations requiring attention
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Items flagged</span>
                  <Badge variant="destructive">8 variances</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Revenue vs. Budget</span>
                <span className="text-sm font-semibold text-green-600">+2.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Expenses vs. Budget</span>
                <span className="text-sm font-semibold text-red-600">+5.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Net Income vs. Budget</span>
                <span className="text-sm font-semibold text-orange-600">-3.2%</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-variance-analysis">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Detailed Variance Analysis
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Budget Dashboard */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Budget Performance Dashboard</CardTitle>
          <CardDescription>Comprehensive budget analysis and key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Revenue Analysis */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Revenue</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Budget</span>
                  <span className="font-bold text-blue-600">$2.8M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Actual YTD</span>
                  <span className="font-bold text-green-600">$1.9M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Variance</span>
                  <span className="font-bold text-green-600">+2.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Forecast</span>
                  <span className="font-bold text-purple-600">$3.1M</span>
                </div>
              </div>
            </div>

            {/* Expense Analysis */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-900 dark:text-orange-100">Expenses</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Budget</span>
                  <span className="font-bold text-orange-600">$2.1M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Actual YTD</span>
                  <span className="font-bold text-red-600">$1.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Variance</span>
                  <span className="font-bold text-red-600">+5.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Forecast</span>
                  <span className="font-bold text-purple-600">$2.2M</span>
                </div>
              </div>
            </div>

            {/* Department Performance */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">Departments</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">On Budget</span>
                  <span className="font-bold text-green-600">8 depts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Over Budget</span>
                  <span className="font-bold text-red-600">3 depts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Under Budget</span>
                  <span className="font-bold text-blue-600">1 dept</span>
                </div>
              </div>
            </div>

            {/* Budget Cycle */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">Budget Cycle</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Planning Phase</span>
                  <span className="font-bold text-green-600">Complete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Review Phase</span>
                  <span className="font-bold text-blue-600">In Progress</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Approval Phase</span>
                  <span className="font-bold text-orange-600">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}