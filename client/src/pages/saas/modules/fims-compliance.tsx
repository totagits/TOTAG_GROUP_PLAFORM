import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileCheck, 
  Globe, 
  Link, 
  Lock, 
  Eye,
  Plus,
  Download,
  CheckCircle,
  AlertTriangle,
  Settings,
  Users
} from 'lucide-react';

export default function FIMSCompliancePage() {
  const quickActions = [
    { label: 'Access Control', icon: <Shield className="w-4 h-4" />, href: '/saas/modules/fims-compliance/action/access-control' },
    { label: 'Audit Trail', icon: <Eye className="w-4 h-4" />, href: '/saas/modules/fims-compliance/data/audit-trail' },
    { label: 'Compliance Report', icon: <FileCheck className="w-4 h-4" />, href: '/saas/modules/fims-compliance/reports/compliance' },
    { label: 'Setup Integration', icon: <Link className="w-4 h-4" />, href: '/saas/modules/fims-compliance/action/setup-integration' },
    { label: 'Security Scan', icon: <Lock className="w-4 h-4" />, href: '/saas/modules/fims-compliance/action/security-scan' },
    { label: 'Export Logs', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-compliance/reports/logs' }
  ];

  const stats = [
    { label: 'Security Score', value: '98%', trend: 'up' as const },
    { label: 'Active Integrations', value: 12, trend: 'up' as const },
    { label: 'Audit Events', value: '1.2K', trend: 'neutral' as const },
    { label: 'Compliance Rate', value: '100%', trend: 'neutral' as const }
  ];

  return (
    <ModuleLayout
      moduleName="Security, Compliance & Integration"
      moduleDescription="Role-based access control, audit trails, IFRS compliance, and API integrations"
      category="FIMS"
      icon={<Shield className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role-based Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Access Control (RBAC)</span>
            </CardTitle>
            <CardDescription>
              Granular permissions and role-based security framework
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Active Users</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Users with system access
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">156</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Security Score</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Overall security rating
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">98%</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Administrator</span>
                <Badge>8 users</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Finance Manager</span>
                <Badge variant="secondary">12 users</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Accountant</span>
                <Badge variant="outline">45 users</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Viewer</span>
                <Badge variant="secondary">91 users</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Permission Matrix</h5>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Financial Data Access</span>
                  <span className="text-green-600">✓ 65 users</span>
                </div>
                <div className="flex justify-between">
                  <span>GL Posting Rights</span>
                  <span className="text-blue-600">✓ 20 users</span>
                </div>
                <div className="flex justify-between">
                  <span>Admin Functions</span>
                  <span className="text-purple-600">✓ 8 users</span>
                </div>
                <div className="flex justify-between">
                  <span>Report Generation</span>
                  <span className="text-orange-600">✓ 125 users</span>
                </div>
              </div>
            </div>
            <Button className="w-full" data-testid="button-access-management">
              <Users className="w-4 h-4 mr-2" />
              Manage Access Rights
            </Button>
          </CardContent>
        </Card>

        {/* Comprehensive Audit Trails */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Audit Trails</span>
            </CardTitle>
            <CardDescription>
              Complete activity logging and forensic audit capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Activity Monitoring</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time logging of all user actions and system events
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Today's Events</span>
                  <Badge>1,247 logged</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Data Integrity</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Immutable audit logs with cryptographic verification
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Integrity Status</span>
                  <Badge variant="secondary">100% Verified</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">1.2K</p>
                <p className="text-xs text-gray-500">Events Today</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">100%</p>
                <p className="text-xs text-gray-500">Capture Rate</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">7 Years</p>
                <p className="text-xs text-gray-500">Retention</p>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Recent Audit Events</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>User Login: john.doe@company.com</span>
                  <span className="text-gray-500">2 min ago</span>
                </div>
                <div className="flex justify-between">
                  <span>GL Entry Modified: JE-2025-001</span>
                  <span className="text-gray-500">15 min ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Report Generated: Balance Sheet</span>
                  <span className="text-gray-500">1 hour ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Permission Changed: sarah.wilson</span>
                  <span className="text-gray-500">2 hours ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IFRS Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5" />
              <span>IFRS Compliance</span>
            </CardTitle>
            <CardDescription>
              International financial reporting standards compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>IFRS 15 - Revenue Recognition</span>
                </div>
                <Badge>Compliant</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>IFRS 16 - Leases</span>
                </div>
                <Badge variant="secondary">Implemented</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>IFRS 9 - Financial Instruments</span>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span>IFRS 17 - Insurance Contracts</span>
                </div>
                <Badge variant="destructive">Not Applicable</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Compliance Status</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Standards Implemented</span>
                  <span className="text-sm font-semibold text-green-600">12 of 15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Compliance Rate</span>
                  <span className="text-sm font-semibold text-blue-600">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Assessment</span>
                  <span className="text-sm font-semibold text-purple-600">Dec 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Next Review</span>
                  <span className="text-sm font-semibold text-orange-600">Jun 2025</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-compliance-check">
                <FileCheck className="w-4 h-4 mr-2" />
                Run Check
              </Button>
              <Button variant="outline" size="sm" data-testid="button-compliance-report">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Integrations Platform */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Link className="w-5 h-5" />
              <span>API Integrations</span>
            </CardTitle>
            <CardDescription>
              Seamless integration with third-party systems and services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Integration Hub</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Centralized management of all system integrations
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Active Connections</span>
                  <Badge>12 integrations</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Real-time Sync</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Live data synchronization with external systems
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Sync Status</span>
                  <Badge variant="secondary">All Active</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Connected Systems</h5>
              <div className="space-y-2">
                {[
                  { system: 'Payroll System', status: 'active', lastSync: '2 min ago' },
                  { system: 'Banking API', status: 'active', lastSync: '5 min ago' },
                  { system: 'CRM Platform', status: 'active', lastSync: '1 hour ago' },
                  { system: 'E-commerce Store', status: 'pending', lastSync: '2 hours ago' }
                ].map((integration, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{integration.system}</span>
                      <p className="text-gray-500">Last sync: {integration.lastSync}</p>
                    </div>
                    <Badge variant={integration.status === 'active' ? 'default' : 'destructive'} size="sm">
                      {integration.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-integration-center">
              <Link className="w-4 h-4 mr-2" />
              Integration Center
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security & Compliance Dashboard */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Security & Compliance Overview</CardTitle>
          <CardDescription>Comprehensive security posture and compliance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Security Metrics */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Security</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Security Score</span>
                  <span className="font-bold text-green-600">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Failed Logins</span>
                  <span className="font-bold text-orange-600">3 today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Sessions</span>
                  <span className="font-bold text-blue-600">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Password Strength</span>
                  <span className="font-bold text-green-600">Strong</span>
                </div>
              </div>
            </div>

            {/* Audit Metrics */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">Audit</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Events Logged</span>
                  <span className="font-bold text-green-600">1.2K today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Storage Used</span>
                  <span className="font-bold text-blue-600">2.8 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Retention Period</span>
                  <span className="font-bold text-purple-600">7 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Integrity Check</span>
                  <span className="font-bold text-green-600">✓ Passed</span>
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">Compliance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">IFRS Standards</span>
                  <span className="font-bold text-green-600">12/15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Compliance Rate</span>
                  <span className="font-bold text-green-600">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Audit</span>
                  <span className="font-bold text-blue-600">Dec 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Next Review</span>
                  <span className="font-bold text-orange-600">Jun 2025</span>
                </div>
              </div>
            </div>

            {/* Integration Health */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-900 dark:text-orange-100">Integrations</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Active APIs</span>
                  <span className="font-bold text-green-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Uptime</span>
                  <span className="font-bold text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Data Sync</span>
                  <span className="font-bold text-blue-600">Real-time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Error Rate</span>
                  <span className="font-bold text-green-600">0.01%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}