import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Shield, 
  Users, 
  Key,
  Settings,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Lock,
  Network,
  Server,
  Database,
  Activity,
  RefreshCw,
  Workflow,
  UserCheck
} from 'lucide-react';

export default function PlatformGovernancePage() {
  const quickActions = [
    { label: 'User Management', icon: <Users className="w-4 h-4" />, href: '/saas/modules/platform-governance/action/user-management' },
    { label: 'Role Management', icon: <UserCheck className="w-4 h-4" />, href: '/saas/modules/platform-governance/action/role-management' },
    { label: 'Audit Log', icon: <Eye className="w-4 h-4" />, href: '/saas/modules/platform-governance/action/audit-log' },
    { label: 'Workflows', icon: <Workflow className="w-4 h-4" />, href: '/saas/modules/platform-governance/action/workflows' },
    { label: 'Security Settings', icon: <Shield className="w-4 h-4" />, href: '/saas/modules/platform-governance/action/security' },
    { label: 'Integrations', icon: <Network className="w-4 h-4" />, href: '/saas/modules/platform-governance/action/integrations' },
    { label: 'System Health', icon: <Activity className="w-4 h-4" />, href: '/saas/modules/platform-governance/action/system-health' }
  ];

  const stats = [
    { label: 'Active Users', value: 156, trend: 'up' as const },
    { label: 'Security Score', value: '94%', trend: 'up' as const },
    { label: 'Pending Approvals', value: 8, trend: 'neutral' as const },
    { label: 'System Uptime', value: '99.9%', trend: 'up' as const }
  ];

  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Access Management</span>
          </CardTitle>
          <CardDescription>
            Users, roles, and permissions (RBAC/ABAC)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Active Users</h4>
                <Badge className="bg-blue-100 text-blue-800">156</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">System users</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Roles</h4>
                <Badge className="bg-purple-100 text-purple-800">12</Badge>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">Active roles</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/platform-governance/data/users">
              <Button className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link href="/saas/modules/platform-governance/data/roles">
              <Button variant="outline" className="w-full">
                <UserCheck className="w-4 h-4 mr-2" />
                Manage Roles
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-green-600" />
            <span>Workflow Engine</span>
          </CardTitle>
          <CardDescription>
            Configurable approvals, SLAs, and escalations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">Active Workflows</p>
                <p className="text-sm text-green-700 dark:text-green-300">Leave, expense, hiring approvals</p>
              </div>
              <Badge className="bg-green-100 text-green-800">24</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Pending Items</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Awaiting approval</p>
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">8</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/platform-governance/data/workflows">
              <Button className="w-full">
                <Workflow className="w-4 h-4 mr-2" />
                Workflow Designer
              </Button>
            </Link>
            <Link href="/saas/modules/platform-governance/data/pending-approvals">
              <Button variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Pending Approvals
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-orange-600" />
            <span>Audit & Compliance</span>
          </CardTitle>
          <CardDescription>
            Complete audit trail and compliance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
              <Eye className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Today</p>
              <p className="text-xs text-orange-700 dark:text-orange-300">1,234 events</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">This Week</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">8,456 events</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-900 dark:text-green-100">Compliance</p>
              <p className="text-xs text-green-700 dark:text-green-300">94% score</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/platform-governance/data/audit-log">
              <Button className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Audit Log
              </Button>
            </Link>
            <Link href="/saas/modules/platform-governance/data/compliance-dashboard">
              <Button variant="outline" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Compliance Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Security Controls</span>
          </CardTitle>
          <CardDescription>
            SSO, MFA, encryption, and data protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">SSO/SAML</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Configured</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">MFA</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Enforced for admins</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">Encryption</p>
                  <p className="text-sm text-green-700 dark:text-green-300">At rest & in transit</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/platform-governance/data/security-settings">
              <Button className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-indigo-600" />
            <span>Integrations</span>
          </CardTitle>
          <CardDescription>
            APIs, webhooks, and external connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Connected</h4>
                <Badge className="bg-green-100 text-green-800">8</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Active integrations</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Available</h4>
                <Badge variant="outline" className="border-blue-300 text-blue-700">24</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Ready to connect</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/platform-governance/data/integrations">
              <Button className="w-full">
                <Network className="w-4 h-4 mr-2" />
                Manage Integrations
              </Button>
            </Link>
            <Link href="/saas/modules/platform-governance/data/api-keys">
              <Button variant="outline" className="w-full">
                <Key className="w-4 h-4 mr-2" />
                API Keys
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-teal-600" />
            <span>System Administration</span>
          </CardTitle>
          <CardDescription>
            Backup, DR, and system health
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-teal-900 dark:text-teal-100">Last Backup</p>
                <p className="text-sm text-teal-700 dark:text-teal-300">Today at 03:00 AM</p>
              </div>
              <Badge className="bg-teal-100 text-teal-800">Success</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">System Status</p>
                <p className="text-sm text-green-700 dark:text-green-300">All services operational</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/platform-governance/data/system-health">
              <Button className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                System Health
              </Button>
            </Link>
            <Link href="/saas/modules/platform-governance/data/backup-restore">
              <Button variant="outline" className="w-full">
                <Database className="w-4 h-4 mr-2" />
                Backup & Restore
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
            <Eye className="w-5 h-5 text-orange-600" />
            <span>Audit Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/platform-governance/reports/audit-summary">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Audit Summary
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/reports/user-activity">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              User Activity Report
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/reports/data-changes">
            <Button variant="outline" className="w-full justify-start">
              <RefreshCw className="w-4 h-4 mr-2" />
              Data Changes Report
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Security Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/platform-governance/reports/access-report">
            <Button variant="outline" className="w-full justify-start">
              <Key className="w-4 h-4 mr-2" />
              Access Report
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/reports/login-history">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Login History
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/reports/security-incidents">
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Security Incidents
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span>System Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/platform-governance/reports/performance-metrics">
            <Button variant="outline" className="w-full justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Performance Metrics
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/reports/integration-status">
            <Button variant="outline" className="w-full justify-start">
              <Network className="w-4 h-4 mr-2" />
              Integration Status
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/reports/backup-report">
            <Button variant="outline" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              Backup Report
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
            <Shield className="w-5 h-5 text-red-600" />
            <span>Security Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/platform-governance/settings/authentication">
            <Button variant="outline" className="w-full justify-start">
              <Key className="w-4 h-4 mr-2" />
              Authentication Settings
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/settings/password-policy">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="w-4 h-4 mr-2" />
              Password Policy
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/settings/session-management">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Session Management
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/settings/data-protection">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Data Protection
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>Platform Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/platform-governance/settings/tenant-settings">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Tenant Settings
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/settings/notification-settings">
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Notification Settings
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/settings/backup-schedule">
            <Button variant="outline" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              Backup Schedule
            </Button>
          </Link>
          <Link href="/saas/modules/platform-governance/settings/api-configuration">
            <Button variant="outline" className="w-full justify-start">
              <Network className="w-4 h-4 mr-2" />
              API Configuration
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Platform Governance"
      moduleDescription="Security, workflows, audit logs, integrations, and system administration"
      category="HRMIS"
      icon={<Shield className="w-6 h-6 text-red-600" />}
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
