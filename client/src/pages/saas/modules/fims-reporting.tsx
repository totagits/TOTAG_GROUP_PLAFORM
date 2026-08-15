import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Brain, 
  Eye, 
  PieChart,
  Plus,
  Download,
  Filter,
  Calendar,
  Search,
  Share
} from 'lucide-react';

export default function FIMSReportingPage() {
  const quickActions = [
    { label: 'Create Dashboard', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-reporting/action/create-dashboard' },
    { label: 'Generate Report', icon: <FileText className="w-4 h-4" />, href: '/saas/modules/fims-reporting/action/generate-report' },
    { label: 'Export Data', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-reporting/action/export-data' },
    { label: 'Schedule Report', icon: <Calendar className="w-4 h-4" />, href: '/saas/modules/fims-reporting/action/schedule-report' },
    { label: 'Share Dashboard', icon: <Share className="w-4 h-4" />, href: '/saas/modules/fims-reporting/action/share-dashboard' },
    { label: 'Data Explorer', icon: <Search className="w-4 h-4" />, href: '/saas/modules/fims-reporting/data/explorer' }
  ];

  const stats = [
    { label: 'Active Dashboards', value: 24, trend: 'up' as const },
    { label: 'Reports Generated', value: 156, trend: 'up' as const },
    { label: 'Data Sources', value: 12, trend: 'neutral' as const },
    { label: 'Scheduled Reports', value: 45, trend: 'up' as const }
  ];

  return (
    <ModuleLayout
      moduleName="Financial Reporting & Analytics"
      moduleDescription="Custom financial dashboards, automated financial statements, drill-down analysis, and predictive analytics"
      category="FIMS"
      icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custom Financial Dashboards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Financial Dashboards</span>
            </CardTitle>
            <CardDescription>
              Interactive real-time financial performance dashboards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Executive</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  High-level KPIs and trends
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">Live</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Operational</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Daily operations metrics
                </p>
                <p className="text-lg font-bold text-green-600 mt-2">Active</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Departmental</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Department-specific views
                </p>
                <p className="text-lg font-bold text-purple-600 mt-2">12 Active</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Custom</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  User-defined dashboards
                </p>
                <p className="text-lg font-bold text-orange-600 mt-2">8 Custom</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Real-time Updates</span>
                <Badge>Every 5 min</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Data Sources</span>
                <Badge variant="secondary">12 connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Mobile Optimized</span>
                <Badge variant="outline">100% responsive</Badge>
              </div>
            </div>
            <Button className="w-full" data-testid="button-dashboard-builder">
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Automated Financial Statements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Financial Statements</span>
            </CardTitle>
            <CardDescription>
              Automated generation of standard financial reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Income Statement</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated P&L generation with variance analysis
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Last Generated</span>
                  <Badge>Dec 2024</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Balance Sheet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time balance sheet with asset/liability tracking
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">As of</span>
                  <Badge variant="secondary">Today</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Cash Flow Statement</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Operating, investing, and financing activities
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">98%</p>
                <p className="text-xs text-gray-500">Automation</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">&lt; 1min</p>
                <p className="text-xs text-gray-500">Generation</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">24/7</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drill-down Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Drill-down Analysis</span>
            </CardTitle>
            <CardDescription>
              Interactive data exploration and detailed analysis tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <PieChart className="w-5 h-5 text-blue-500" />
                  <span>Revenue Breakdown</span>
                </div>
                <Badge>By Product/Service</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <span>Expense Analysis</span>
                </div>
                <Badge variant="secondary">By Department</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span>Trend Analysis</span>
                </div>
                <Badge variant="outline">Multi-period</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-orange-500" />
                  <span>Variance Analysis</span>
                </div>
                <Badge variant="secondary">Budget vs Actual</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Analysis Features</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Interactive Charts</span>
                  <span className="text-sm font-semibold text-green-600">✓ Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Data Filtering</span>
                  <span className="text-sm font-semibold text-blue-600">✓ Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Export Options</span>
                  <span className="text-sm font-semibold text-purple-600">✓ Multiple formats</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-explore-data">
                <Search className="w-4 h-4 mr-2" />
                Explore Data
              </Button>
              <Button variant="outline" size="sm" data-testid="button-custom-analysis">
                <Filter className="w-4 h-4 mr-2" />
                Custom Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Predictive Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Predictive Analytics</span>
            </CardTitle>
            <CardDescription>
              AI-powered financial forecasting and predictive insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Revenue Forecasting</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ML-based revenue predictions with confidence intervals
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Next Quarter</span>
                  <Badge>$750K ±8%</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Risk Assessment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated risk scoring and early warning indicators
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Risk Level</span>
                  <Badge variant="secondary">Low</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Anomaly Detection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time detection of unusual financial patterns
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Alerts Today</span>
                  <Badge variant="destructive">2 anomalies</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Forecast Accuracy</span>
                <span className="text-sm font-semibold text-green-600">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Models Active</span>
                <span className="text-sm font-semibold text-blue-600">8 models</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Training Data</span>
                <span className="text-sm font-semibold text-purple-600">36 months</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-predictive-models">
              <Brain className="w-4 h-4 mr-2" />
              Configure Models
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reporting Center */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Financial Reporting Center</CardTitle>
          <CardDescription>Comprehensive reporting suite and scheduled deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Standard Reports */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Standard Reports</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Income Statement</span>
                  <Badge size="sm">Monthly</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Balance Sheet</span>
                  <Badge size="sm" variant="secondary">Weekly</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cash Flow</span>
                  <Badge size="sm" variant="outline">Monthly</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Trial Balance</span>
                  <Badge size="sm" variant="secondary">Daily</Badge>
                </div>
              </div>
            </div>

            {/* Management Reports */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">Management</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Executive Summary</span>
                  <Badge size="sm">Weekly</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">KPI Dashboard</span>
                  <Badge size="sm" variant="secondary">Daily</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Budget Variance</span>
                  <Badge size="sm" variant="outline">Monthly</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Profitability</span>
                  <Badge size="sm" variant="secondary">Monthly</Badge>
                </div>
              </div>
            </div>

            {/* Regulatory Reports */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">Regulatory</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Tax Returns</span>
                  <Badge size="sm">Quarterly</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Audit Package</span>
                  <Badge size="sm" variant="secondary">Annual</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Statutory Filings</span>
                  <Badge size="sm" variant="outline">As Required</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Compliance Check</span>
                  <Badge size="sm" variant="secondary">Monthly</Badge>
                </div>
              </div>
            </div>

            {/* Custom Reports */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-900 dark:text-orange-100">Custom</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Department P&L</span>
                  <Badge size="sm">Monthly</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Project Costing</span>
                  <Badge size="sm" variant="secondary">Weekly</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Vendor Analysis</span>
                  <Badge size="sm" variant="outline">Quarterly</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">User-defined</span>
                  <Badge size="sm" variant="secondary">15 reports</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}