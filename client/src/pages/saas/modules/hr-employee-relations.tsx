import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  MessageSquare, 
  AlertTriangle, 
  Scale,
  Users, 
  Plus,
  FileText,
  Settings,
  CheckCircle,
  BarChart3,
  Clock,
  Shield,
  Eye,
  Search,
  Flag,
  Archive,
  Gavel,
  TrendingUp
} from 'lucide-react';

export default function EmployeeRelationsPage() {
  const quickActions = [
    { label: 'New Case', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/hr-employee-relations/action/new-case' },
    { label: 'My Cases', icon: <MessageSquare className="w-4 h-4" />, href: '/saas/modules/hr-employee-relations/action/my-cases' },
    { label: 'Grievances', icon: <AlertTriangle className="w-4 h-4" />, href: '/saas/modules/hr-employee-relations/action/grievances' },
    { label: 'Investigations', icon: <Search className="w-4 h-4" />, href: '/saas/modules/hr-employee-relations/action/investigations' },
    { label: 'Disciplinary', icon: <Gavel className="w-4 h-4" />, href: '/saas/modules/hr-employee-relations/action/disciplinary' },
    { label: 'Policy Breaches', icon: <Shield className="w-4 h-4" />, href: '/saas/modules/hr-employee-relations/action/policy-breaches' },
    { label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/hr-employee-relations/action/reports' }
  ];

  const stats = [
    { label: 'Open Cases', value: 18, trend: 'neutral' as const },
    { label: 'Pending Review', value: 5, trend: 'down' as const },
    { label: 'Resolved MTD', value: 12, trend: 'up' as const },
    { label: 'Avg Resolution', value: '4.2d', trend: 'up' as const }
  ];

  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Case Management</span>
          </CardTitle>
          <CardDescription>
            Track and manage employee cases and requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Open</h4>
                <Badge className="bg-blue-100 text-blue-800">18</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Active cases</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Resolved</h4>
                <Badge className="bg-green-100 text-green-800">142</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">This year</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-employee-relations/data/all-cases">
              <Button className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                View All Cases
              </Button>
            </Link>
            <Link href="/saas/modules/hr-employee-relations/data/case-queue">
              <Button variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Case Queue
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Grievances</span>
          </CardTitle>
          <CardDescription>
            Handle employee grievances and complaints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">High Priority</p>
                <p className="text-sm text-red-700 dark:text-red-300">2 cases require immediate attention</p>
              </div>
              <Badge className="bg-red-100 text-red-800">Urgent</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Medium Priority</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">5 cases in progress</p>
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">Active</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-employee-relations/data/grievances">
              <Button className="w-full">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Manage Grievances
              </Button>
            </Link>
            <Link href="/saas/modules/hr-employee-relations/data/grievance-history">
              <Button variant="outline" className="w-full">
                <Archive className="w-4 h-4 mr-2" />
                Grievance History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-purple-600" />
            <span>Investigations</span>
          </CardTitle>
          <CardDescription>
            Conduct and track workplace investigations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <Flag className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Active</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">4 cases</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <Eye className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Review</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">2 cases</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-900 dark:text-green-100">Closed</p>
              <p className="text-xs text-green-700 dark:text-green-300">28 cases</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-employee-relations/data/investigations">
              <Button className="w-full">
                <Search className="w-4 h-4 mr-2" />
                View Investigations
              </Button>
            </Link>
            <Link href="/saas/modules/hr-employee-relations/data/investigation-evidence">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Evidence Repository
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gavel className="w-5 h-5 text-red-600" />
            <span>Disciplinary Actions</span>
          </CardTitle>
          <CardDescription>
            Manage disciplinary processes and outcomes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Warnings Issued</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">8 verbal, 3 written this year</p>
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">11 Total</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">PIPs Active</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Performance improvement plans</p>
              </div>
              <Badge variant="outline">4 Active</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-employee-relations/data/disciplinary-records">
              <Button className="w-full">
                <Gavel className="w-4 h-4 mr-2" />
                Disciplinary Records
              </Button>
            </Link>
            <Link href="/saas/modules/hr-employee-relations/data/pips">
              <Button variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Performance Improvement Plans
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
            <span>Case Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-employee-relations/reports/case-summary">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Case Summary
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/reports/case-trends">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Case Trends
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/reports/resolution-times">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Resolution Times
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Incident Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-employee-relations/reports/incident-log">
            <Button variant="outline" className="w-full justify-start">
              <Flag className="w-4 h-4 mr-2" />
              Incident Log
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/reports/grievance-analysis">
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Grievance Analysis
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/reports/root-cause">
            <Button variant="outline" className="w-full justify-start">
              <Search className="w-4 h-4 mr-2" />
              Root Cause Analysis
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Scale className="w-5 h-5 text-purple-600" />
            <span>Compliance Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-employee-relations/reports/audit-trail">
            <Button variant="outline" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              Audit Trail
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/reports/disciplinary-summary">
            <Button variant="outline" className="w-full justify-start">
              <Gavel className="w-4 h-4 mr-2" />
              Disciplinary Summary
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/reports/policy-compliance">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Policy Compliance
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
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Case Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-employee-relations/settings/case-types">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Case Types
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/settings/priority-levels">
            <Button variant="outline" className="w-full justify-start">
              <Flag className="w-4 h-4 mr-2" />
              Priority Levels
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/settings/workflow-rules">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Workflow Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/settings/escalation-paths">
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Escalation Paths
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gavel className="w-5 h-5 text-red-600" />
            <span>Disciplinary Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-employee-relations/settings/disciplinary-policies">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Disciplinary Policies
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/settings/warning-levels">
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Warning Levels
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/settings/investigation-templates">
            <Button variant="outline" className="w-full justify-start">
              <Search className="w-4 h-4 mr-2" />
              Investigation Templates
            </Button>
          </Link>
          <Link href="/saas/modules/hr-employee-relations/settings/pip-templates">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              PIP Templates
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Employee Relations"
      moduleDescription="Case management, grievances, investigations, and disciplinary processes"
      category="HRMIS"
      icon={<MessageSquare className="w-6 h-6 text-orange-600" />}
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
