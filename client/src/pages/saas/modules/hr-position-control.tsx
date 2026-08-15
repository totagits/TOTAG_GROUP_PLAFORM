import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Building2, 
  Users, 
  Briefcase,
  Plus,
  FileText,
  Settings,
  CheckCircle,
  BarChart3,
  DollarSign,
  Target,
  TrendingUp,
  AlertTriangle,
  Network,
  UserCheck,
  Lock,
  Archive
} from 'lucide-react';

export default function PositionControlPage() {
  const quickActions = [
    { label: 'Create Position', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/hr-position-control/action/create-position' },
    { label: 'View Establishment', icon: <Building2 className="w-4 h-4" />, href: '/saas/modules/hr-position-control/action/view-establishment' },
    { label: 'Vacancy Request', icon: <Briefcase className="w-4 h-4" />, href: '/saas/modules/hr-position-control/action/vacancy-request' },
    { label: 'Budget Allocation', icon: <DollarSign className="w-4 h-4" />, href: '/saas/modules/hr-position-control/action/budget-allocation' },
    { label: 'Org Chart', icon: <Network className="w-4 h-4" />, href: '/saas/modules/hr-position-control/action/org-chart' },
    { label: 'Approval Queue', icon: <CheckCircle className="w-4 h-4" />, href: '/saas/modules/hr-position-control/action/approval-queue' },
    { label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/hr-position-control/action/reports' }
  ];

  const stats = [
    { label: 'Approved Posts', value: 175, trend: 'neutral' as const },
    { label: 'Filled', value: 156, trend: 'up' as const },
    { label: 'Vacant', value: 19, trend: 'down' as const },
    { label: 'Budget Utilized', value: '89%', trend: 'neutral' as const }
  ];

  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Establishment Register</span>
          </CardTitle>
          <CardDescription>
            Approved positions and headcount allocation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">175</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Approved</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">156</p>
              <p className="text-sm text-green-700 dark:text-green-300">Filled</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">19</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">Vacant</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-position-control/data/establishment">
              <Button className="w-full">
                <Building2 className="w-4 h-4 mr-2" />
                View Establishment
              </Button>
            </Link>
            <Link href="/saas/modules/hr-position-control/data/position-list">
              <Button variant="outline" className="w-full">
                <Briefcase className="w-4 h-4 mr-2" />
                Position List
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span>Budget Control</span>
          </CardTitle>
          <CardDescription>
            Link positions to budget lines and cost centers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Allocated</h4>
                <Badge className="bg-green-100 text-green-800">$4.2M</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Annual budget</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Utilized</h4>
                <Badge variant="outline" className="border-blue-300 text-blue-700">89%</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">YTD spending</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-position-control/data/budget-allocation">
              <Button className="w-full">
                <DollarSign className="w-4 h-4 mr-2" />
                Budget Allocation
              </Button>
            </Link>
            <Link href="/saas/modules/hr-position-control/data/cost-centers">
              <Button variant="outline" className="w-full">
                <Building2 className="w-4 h-4 mr-2" />
                Cost Centers
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <span>Vacancy Management</span>
          </CardTitle>
          <CardDescription>
            Track and approve vacancy requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Pending Approval</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">3 vacancy requests awaiting review</p>
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">3</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">Open Vacancies</p>
                <p className="text-sm text-green-700 dark:text-green-300">Active positions in recruitment</p>
              </div>
              <Badge className="bg-green-100 text-green-800">12</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-position-control/data/vacancies">
              <Button className="w-full">
                <Briefcase className="w-4 h-4 mr-2" />
                View Vacancies
              </Button>
            </Link>
            <Link href="/saas/modules/hr-position-control/data/vacancy-approvals">
              <Button variant="outline" className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approval Queue
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-red-600" />
            <span>Position Controls</span>
          </CardTitle>
          <CardDescription>
            Freeze, abolish, or modify positions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <Lock className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-red-900 dark:text-red-100">Frozen</p>
              <p className="text-xs text-red-700 dark:text-red-300">5 positions</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg text-center">
              <Archive className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Abolished</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">8 positions</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Pending</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">2 changes</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-position-control/data/position-actions">
              <Button className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Position Actions
              </Button>
            </Link>
            <Link href="/saas/modules/hr-position-control/data/action-history">
              <Button variant="outline" className="w-full">
                <Archive className="w-4 h-4 mr-2" />
                Action History
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
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Establishment Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-position-control/reports/establishment-summary">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Establishment Summary
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/reports/vacancy-rate">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Vacancy Rate
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/reports/position-history">
            <Button variant="outline" className="w-full justify-start">
              <Archive className="w-4 h-4 mr-2" />
              Position History
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span>Budget Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-position-control/reports/budget-vs-actual">
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="w-4 h-4 mr-2" />
              Budget vs Actual
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/reports/cost-center-analysis">
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="w-4 h-4 mr-2" />
              Cost Center Analysis
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/reports/personnel-costs">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Personnel Costs
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span>Planning Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-position-control/reports/workforce-planning">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Workforce Planning
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/reports/headcount-forecast">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Headcount Forecast
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/reports/span-of-control">
            <Button variant="outline" className="w-full justify-start">
              <Network className="w-4 h-4 mr-2" />
              Span of Control
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
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Position Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-position-control/settings/job-families">
            <Button variant="outline" className="w-full justify-start">
              <Briefcase className="w-4 h-4 mr-2" />
              Job Families
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/settings/grade-structure">
            <Button variant="outline" className="w-full justify-start">
              <Target className="w-4 h-4 mr-2" />
              Grade Structure
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/settings/position-types">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Position Types
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/settings/approval-workflows">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approval Workflows
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span>Budget Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-position-control/settings/budget-rules">
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="w-4 h-4 mr-2" />
              Budget Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/settings/cost-elements">
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="w-4 h-4 mr-2" />
              Cost Elements
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/settings/fiscal-year">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Fiscal Year Setup
            </Button>
          </Link>
          <Link href="/saas/modules/hr-position-control/settings/control-limits">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="w-4 h-4 mr-2" />
              Control Limits
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Position Control & Establishment"
      moduleDescription="Establishment register, vacancy control, budget links, and workforce planning"
      category="HRMIS"
      icon={<Building2 className="w-6 h-6 text-blue-600" />}
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
