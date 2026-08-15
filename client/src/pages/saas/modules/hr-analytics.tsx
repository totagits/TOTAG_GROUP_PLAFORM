import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  AlertTriangle, 
  Target, 
  Users,
  Plus,
  Download,
  Filter,
  Calendar,
  Brain,
  Eye,
  Settings,
  FileText,
  Zap,
  Activity,
  Shield,
  Database
} from 'lucide-react';

export default function HRAnalyticsPage() {
  const quickActions = [
    { label: 'Create Dashboard', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/hr-analytics/action/create-dashboard' },
    { label: 'Generate Report', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/hr-analytics/action/generate-report' },
    { label: 'Export Data', icon: <Download className="w-4 h-4" />, href: '/saas/modules/hr-analytics/action/export-data' },
    { label: 'Set KPI Alert', icon: <AlertTriangle className="w-4 h-4" />, href: '/saas/modules/hr-analytics/action/kpi-alert' },
    { label: 'Predictive Analytics', icon: <Brain className="w-4 h-4" />, href: '/saas/modules/hr-analytics/action/predictive-analytics' },
    { label: 'Compliance Reports', icon: <Eye className="w-4 h-4" />, href: '/saas/modules/hr-analytics/action/compliance-reports' }
  ];

  const stats = [
    { label: 'Active Dashboards', value: 15, trend: 'up' as const },
    { label: 'KPI Alerts', value: 8, trend: 'down' as const },
    { label: 'Data Accuracy', value: '98.5%', trend: 'up' as const },
    { label: 'Reports Generated', value: 247, trend: 'up' as const }
  ];

  // Data Management Content
  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Dashboard Management</span>
          </CardTitle>
          <CardDescription>
            Create and manage real-time HR dashboards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Active</h4>
              <p className="text-2xl font-bold text-blue-600 mt-1">15</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Live dashboards</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Templates</h4>
              <p className="text-2xl font-bold text-green-600 mt-1">8</p>
              <p className="text-sm text-green-700 dark:text-green-300">Pre-built layouts</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button className="w-full" data-testid="button-create-custom-dashboard">
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Dashboard
            </Button>
            <Button variant="outline" className="w-full" data-testid="button-dashboard-gallery">
              <Eye className="w-4 h-4 mr-2" />
              Browse Dashboard Gallery
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-purple-600" />
            <span>Data Sources</span>
          </CardTitle>
          <CardDescription>
            Manage and configure data connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-green-600" />
                <span className="font-medium">Live Data Feeds</span>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">7 Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Database Connections</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">3 Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-orange-600" />
                <span className="font-medium">API Integrations</span>
              </div>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">12 APIs</Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full" data-testid="button-configure-data-sources">
            <Settings className="w-4 h-4 mr-2" />
            Configure Data Sources
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-green-600" />
            <span>Predictive Analytics</span>
          </CardTitle>
          <CardDescription>
            AI-powered insights and forecasting models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Turnover Prediction</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-sm text-gray-500">ML model accuracy: 94.2%</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Performance Forecasting</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-sm text-gray-500">Quarterly performance predictions</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Recruitment Optimization</h4>
                <Badge variant="outline">Beta</Badge>
              </div>
              <p className="text-sm text-gray-500">Source effectiveness prediction</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-predictive-models">
            <Brain className="w-4 h-4 mr-2" />
            Manage Predictive Models
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>KPI Monitoring</span>
          </CardTitle>
          <CardDescription>
            Real-time alerts and threshold monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="font-semibold">3 Critical</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Require immediate attention</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Eye className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="font-semibold">5 Watching</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Threshold monitoring</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" data-testid="button-configure-alerts">
            <Settings className="w-4 h-4 mr-2" />
            Configure KPI Alerts
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
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Standard Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-workforce-analytics">
            <Users className="w-4 h-4 mr-2" />
            Workforce Analytics
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-performance-metrics">
            <Target className="w-4 h-4 mr-2" />
            Performance Metrics
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-turnover-analysis">
            <TrendingUp className="w-4 h-4 mr-2" />
            Turnover Analysis
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-compensation-benchmarks">
            <BarChart3 className="w-4 h-4 mr-2" />
            Compensation Benchmarks
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-green-600" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
            <Brain className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-semibold">Smart Analytics</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              AI-generated insights and recommendations
            </p>
          </div>
          <Button className="w-full" data-testid="button-ai-insights-dashboard">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights Dashboard
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-purple-600" />
            <span>Export & Automation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-scheduled-reports">
            <Calendar className="w-4 h-4 mr-2" />
            Scheduled Reports
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-data-export">
            <Download className="w-4 h-4 mr-2" />
            Export Raw Data
          </Button>
          <Button className="w-full" data-testid="button-report-automation">
            <Zap className="w-4 h-4 mr-2" />
            Report Automation
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
            <span>Analytics Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure analytics engine and data processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Data Refresh Rate</p>
                <p className="text-sm text-gray-500">Real-time updates every 5 minutes</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-configure-refresh-rate">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Historical Data Retention</p>
                <p className="text-sm text-gray-500">5 years of historical analytics</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-configure-data-retention">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Analytics Engine</p>
                <p className="text-sm text-gray-500">Advanced ML and statistical models</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-engine-settings">
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Data Governance</span>
          </CardTitle>
          <CardDescription>
            Data privacy, security, and compliance settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100">Data Security</h4>
              <p className="text-sm text-red-700 dark:text-red-300">End-to-end encryption, role-based access</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Privacy Compliance</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">GDPR, CCPA, data anonymization</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Audit Trail</h4>
              <p className="text-sm text-green-700 dark:text-green-300">Complete data access logging</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-data-governance-settings">
            <Shield className="w-4 h-4 mr-2" />
            Data Governance Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span>Report Templates</span>
          </CardTitle>
          <CardDescription>
            Manage and customize report templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Executive Dashboard</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-sm text-gray-500">C-level metrics and KPIs</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Department Analytics</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-sm text-gray-500">Team-specific performance metrics</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Compliance Reports</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-sm text-gray-500">Regulatory and audit reports</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-template-editor">
            <Plus className="w-4 h-4 mr-2" />
            Create Custom Template
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span>Integration & APIs</span>
          </CardTitle>
          <CardDescription>
            External system integrations and API management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <p className="font-semibold">API Connections</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Connect to external systems and data sources
            </p>
          </div>
          <Button className="w-full" data-testid="button-api-management">
            <Settings className="w-4 h-4 mr-2" />
            API Management Console
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Analytics & Reporting"
      moduleDescription="Advanced HR analytics with real-time dashboards, predictive insights, and comprehensive reporting capabilities"
      category="HRMIS"
      icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
      dataContent={dataContent}
      reportsContent={reportsContent}
      settingsContent={settingsContent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Dashboards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Real-time Dashboards</span>
            </CardTitle>
            <CardDescription>
              Interactive dashboards with live HR metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="group relative p-6 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100/80 dark:from-blue-950/30 dark:via-blue-900/40 dark:to-indigo-800/30 rounded-xl border border-blue-200/50 dark:border-blue-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg">Workforce Analytics</h4>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    Comprehensive headcount analysis, turnover insights, and demographic intelligence
                  </p>
                </div>
              </div>
              <div className="group relative p-6 bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-100/80 dark:from-emerald-950/30 dark:via-emerald-900/40 dark:to-teal-800/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                      <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">Performance Metrics</h4>
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                    Goal achievement tracking and comprehensive review completion analytics
                  </p>
                </div>
              </div>
              <div className="group relative p-6 bg-gradient-to-br from-violet-50 via-violet-50 to-purple-100/80 dark:from-violet-950/30 dark:via-violet-900/40 dark:to-purple-800/30 rounded-xl border border-violet-200/50 dark:border-violet-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h4 className="font-bold text-violet-900 dark:text-violet-100 text-lg">Engagement Intelligence</h4>
                  </div>
                  <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">
                    Advanced survey analytics and employee satisfaction scoring
                  </p>
                </div>
              </div>
              <div className="group relative p-6 bg-gradient-to-br from-amber-50 via-amber-50 to-orange-100/80 dark:from-amber-950/30 dark:via-amber-900/40 dark:to-orange-800/30 rounded-xl border border-amber-200/50 dark:border-amber-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                      <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-100 text-lg">Recruiting Analytics</h4>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                    Time-to-hire optimization and candidate pipeline intelligence
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100/80 dark:from-slate-950/30 dark:via-slate-900/40 dark:to-slate-800/30 rounded-xl p-6 border border-slate-200/50 dark:border-slate-800/30 space-y-4">
              <h5 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-4">Active Dashboards</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Executive Dashboard</span>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 font-semibold">Live</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Department Views</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 font-semibold">12 Active</Badge>
                </div>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="button-view-dashboards">
              <BarChart3 className="w-4 h-4 mr-2" />
              View All Dashboards
            </Button>
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
              AI-powered insights and forecasting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Attrition Risk</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Predict which employees are at risk of leaving
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">High Risk</span>
                  <Badge variant="destructive">8 employees</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Performance Trends</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Forecast future performance and identify improvement opportunities
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Trending Up</span>
                  <Badge>67% of team</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">8</p>
                <p className="text-xs text-gray-500">At Risk</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">15</p>
                <p className="text-xs text-gray-500">Watch List</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">133</p>
                <p className="text-xs text-gray-500">Stable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Report Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Custom Reports</span>
            </CardTitle>
            <CardDescription>
              Build and schedule custom HR reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>Headcount Report</span>
                </div>
                <Badge>Monthly</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Turnover Analysis</span>
                </div>
                <Badge variant="secondary">Quarterly</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span>Performance Summary</span>
                </div>
                <Badge variant="outline">Custom</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-orange-500" />
                  <span>Compliance Audit</span>
                </div>
                <Badge variant="destructive">Due</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-create-report">
                <Plus className="w-4 h-4 mr-2" />
                Create Report
              </Button>
              <Button variant="outline" size="sm" data-testid="button-report-templates">
                <Filter className="w-4 h-4 mr-2" />
                Templates
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPI Tracking & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>KPI Tracking</span>
            </CardTitle>
            <CardDescription>
              Monitor key performance indicators with alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Real-time Monitoring</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track critical HR metrics with automated alerts and thresholds
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Custom Metrics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Define and track organization-specific KPIs and benchmarks
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Employee Satisfaction</span>
                <span className="text-sm font-semibold text-green-600">4.2/5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Time to Fill</span>
                <span className="text-sm font-semibold text-blue-600">28 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Training Completion</span>
                <span className="text-sm font-semibold text-purple-600">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Annual Turnover</span>
                <span className="text-sm font-semibold text-orange-600">8.5%</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-kpi-settings">
              <Target className="w-4 h-4 mr-2" />
              Manage KPIs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>HR Analytics Overview</CardTitle>
          <CardDescription>Key insights and trends across all HR functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Workforce Metrics */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Workforce</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Employees</span>
                  <span className="font-bold text-blue-600">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">New Hires (YTD)</span>
                  <span className="font-bold text-green-600">+24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Departures (YTD)</span>
                  <span className="font-bold text-red-600">-11</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Reviews Complete</span>
                  <span className="font-bold text-green-600">89%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Goals Achieved</span>
                  <span className="font-bold text-blue-600">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Top Performers</span>
                  <span className="font-bold text-purple-600">25%</span>
                </div>
              </div>
            </div>

            {/* Learning & Development */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">Learning</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Training Hours</span>
                  <span className="font-bold text-purple-600">2,340</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Completion Rate</span>
                  <span className="font-bold text-green-600">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Certifications</span>
                  <span className="font-bold text-blue-600">67</span>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-900 dark:text-orange-100">Engagement</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Satisfaction Score</span>
                  <span className="font-bold text-green-600">4.2/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Survey Response</span>
                  <span className="font-bold text-blue-600">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">eNPS Score</span>
                  <span className="font-bold text-purple-600">+45</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}