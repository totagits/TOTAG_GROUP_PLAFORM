import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  UserMinus, 
  ClipboardCheck, 
  Key,
  Users, 
  Plus,
  FileText,
  Settings,
  CheckCircle,
  BarChart3,
  Clock,
  MessageSquare,
  Package,
  CreditCard,
  TrendingDown,
  Calendar,
  Building2
} from 'lucide-react';

export default function OffboardingPage() {
  const quickActions = [
    { label: 'Initiate Exit', icon: <UserMinus className="w-4 h-4" />, href: '/saas/modules/hr-offboarding/action/initiate-exit' },
    { label: 'Clearance Checklist', icon: <ClipboardCheck className="w-4 h-4" />, href: '/saas/modules/hr-offboarding/action/clearance-checklist' },
    { label: 'Exit Interview', icon: <MessageSquare className="w-4 h-4" />, href: '/saas/modules/hr-offboarding/action/exit-interview' },
    { label: 'Asset Return', icon: <Package className="w-4 h-4" />, href: '/saas/modules/hr-offboarding/action/asset-return' },
    { label: 'Access Revoke', icon: <Key className="w-4 h-4" />, href: '/saas/modules/hr-offboarding/action/access-revoke' },
    { label: 'Final Settlement', icon: <CreditCard className="w-4 h-4" />, href: '/saas/modules/hr-offboarding/action/final-settlement' },
    { label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/hr-offboarding/action/reports' }
  ];

  const stats = [
    { label: 'In Progress', value: 5, trend: 'neutral' as const },
    { label: 'Pending Clearance', value: 3, trend: 'down' as const },
    { label: 'Completed MTD', value: 8, trend: 'neutral' as const },
    { label: 'Avg Processing', value: '5.2d', trend: 'up' as const }
  ];

  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserMinus className="w-5 h-5 text-red-600" />
            <span>Exit Processing</span>
          </CardTitle>
          <CardDescription>
            Manage employee separations and exits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">In Progress</h4>
                <Badge className="bg-yellow-100 text-yellow-800">5</Badge>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Active exits</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Completed</h4>
                <Badge className="bg-green-100 text-green-800">42</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">This year</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-offboarding/data/active-exits">
              <Button className="w-full">
                <UserMinus className="w-4 h-4 mr-2" />
                View Active Exits
              </Button>
            </Link>
            <Link href="/saas/modules/hr-offboarding/data/exit-history">
              <Button variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Exit History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            <span>Clearance Workflow</span>
          </CardTitle>
          <CardDescription>
            Track clearance approvals across departments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">Pending IT</p>
                <p className="text-sm text-red-700 dark:text-red-300">2 employees awaiting IT clearance</p>
              </div>
              <Badge className="bg-red-100 text-red-800">Blocked</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Pending Finance</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">1 employee awaiting final settlement</p>
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">In Progress</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-offboarding/data/clearance-status">
              <Button className="w-full">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Clearance Status
              </Button>
            </Link>
            <Link href="/saas/modules/hr-offboarding/data/department-approvals">
              <Button variant="outline" className="w-full">
                <Building2 className="w-4 h-4 mr-2" />
                Department Approvals
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span>Exit Interviews</span>
          </CardTitle>
          <CardDescription>
            Capture feedback and attrition insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Scheduled</h4>
                <Badge className="bg-purple-100 text-purple-800">3</Badge>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">This week</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Completed</h4>
                <Badge variant="outline" className="border-blue-300 text-blue-700">38</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">This year</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-offboarding/data/exit-interviews">
              <Button className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                View Exit Interviews
              </Button>
            </Link>
            <Link href="/saas/modules/hr-offboarding/data/feedback-analysis">
              <Button variant="outline" className="w-full">
                <TrendingDown className="w-4 h-4 mr-2" />
                Feedback Analysis
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-orange-600" />
            <span>Asset & Access</span>
          </CardTitle>
          <CardDescription>
            Track asset returns and access revocation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-orange-900 dark:text-orange-100">Pending Returns</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">4 laptops, 2 access cards</p>
              </div>
              <Badge variant="outline" className="border-orange-300 text-orange-700">6 Items</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">Access to Revoke</p>
                <p className="text-sm text-red-700 dark:text-red-300">3 employees pending</p>
              </div>
              <Badge className="bg-red-100 text-red-800">Urgent</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-offboarding/data/asset-returns">
              <Button className="w-full">
                <Package className="w-4 h-4 mr-2" />
                Asset Returns
              </Button>
            </Link>
            <Link href="/saas/modules/hr-offboarding/data/access-revocation">
              <Button variant="outline" className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Access Revocation
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
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span>Attrition Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-offboarding/reports/attrition-analysis">
            <Button variant="outline" className="w-full justify-start">
              <TrendingDown className="w-4 h-4 mr-2" />
              Attrition Analysis
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/reports/turnover-rate">
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              Turnover Rate
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/reports/exit-reasons">
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Exit Reasons
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            <span>Process Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-offboarding/reports/clearance-status">
            <Button variant="outline" className="w-full justify-start">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Clearance Status
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/reports/processing-times">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Processing Times
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/reports/bottleneck-analysis">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Bottleneck Analysis
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <span>Settlement Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-offboarding/reports/final-settlements">
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              Final Settlements
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/reports/pending-payments">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Pending Payments
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/reports/cost-of-turnover">
            <Button variant="outline" className="w-full justify-start">
              <TrendingDown className="w-4 h-4 mr-2" />
              Cost of Turnover
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
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            <span>Workflow Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-offboarding/settings/clearance-workflow">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Clearance Workflow
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/settings/department-checklist">
            <Button variant="outline" className="w-full justify-start">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Department Checklists
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/settings/notification-rules">
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Notification Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/settings/exit-reasons">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Exit Reason Codes
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span>Exit Interview Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-offboarding/settings/interview-templates">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Interview Templates
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/settings/feedback-categories">
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback Categories
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/settings/scheduling-rules">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Scheduling Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-offboarding/settings/confidentiality-settings">
            <Button variant="outline" className="w-full justify-start">
              <Key className="w-4 h-4 mr-2" />
              Confidentiality Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Offboarding & Exit Management"
      moduleDescription="Employee separations, clearance workflows, exit interviews, and attrition analytics"
      category="HRMIS"
      icon={<UserMinus className="w-6 h-6 text-red-600" />}
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
