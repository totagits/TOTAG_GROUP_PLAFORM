import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Users, 
  Building2, 
  FileText, 
  Workflow, 
  UserCheck,
  Plus,
  Search,
  Download,
  Settings,
  Shield,
  Clock,
  CheckCircle,
  BarChart3
} from 'lucide-react';

export default function HRCorePage() {
  const quickActions = [
    { label: 'Add Employee', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/hr-core/action/add-employee' },
    { label: 'View Org Chart', icon: <Building2 className="w-4 h-4" />, href: '/saas/modules/hr-core/action/org-chart' },
    { label: 'Upload Documents', icon: <FileText className="w-4 h-4" />, href: '/saas/modules/hr-core/action/upload-documents' },
    { label: 'Create Workflow', icon: <Workflow className="w-4 h-4" />, href: '/saas/modules/hr-core/action/create-workflow' },
    { label: 'Employee Search', icon: <Search className="w-4 h-4" />, href: '/saas/modules/hr-core/action/employee-search' },
    { label: 'Bulk Import', icon: <Download className="w-4 h-4" />, href: '/saas/modules/hr-core/action/bulk-import' }
  ];

  const stats = [
    { label: 'Total Employees', value: 156, trend: 'up' as const },
    { label: 'Active Departments', value: 12, trend: 'neutral' as const },
    { label: 'Pending Approvals', value: 8, trend: 'down' as const },
    { label: 'Documents Stored', value: '2.4K', trend: 'up' as const }
  ];

  // Data Management Content
  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Employee Database</span>
          </CardTitle>
          <CardDescription>
            Manage complete employee records and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/saas/modules/hr-core/data/employees">
              <Button className="h-16 flex flex-col items-center justify-center space-y-2" data-testid="button-view-all-employees">
                <Users className="w-5 h-5" />
                <span className="text-xs">View All (156)</span>
              </Button>
            </Link>
            <Link href="/saas/modules/hr-core/data/search">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2" data-testid="button-advanced-search">
                <Search className="w-5 h-5" />
                <span className="text-xs">Advanced Search</span>
              </Button>
            </Link>
            <Link href="/saas/modules/hr-core/data/bulk-operations">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2" data-testid="button-bulk-operations">
                <Download className="w-5 h-5" />
                <span className="text-xs">Bulk Operations</span>
              </Button>
            </Link>
            <Link href="/saas/modules/hr-core/data/export">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2" data-testid="button-data-export">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Export Data</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-green-600" />
            <span>Organization Management</span>
          </CardTitle>
          <CardDescription>
            Structure, departments, and organizational hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="font-medium">Departments</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">12 Active</Badge>
                <Link href="/saas/modules/hr-core/data/departments">
                  <Button size="sm" variant="ghost" data-testid="button-manage-departments">
                    <Settings className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="font-medium">Job Positions</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">45 Defined</Badge>
                <Link href="/saas/modules/hr-core/data/positions">
                  <Button size="sm" variant="ghost" data-testid="button-manage-positions">
                    <Settings className="w-3 h-3" />
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
          <Link href="/saas/modules/hr-core/reports/employee-roster">
            <Button variant="outline" className="w-full justify-start" data-testid="button-employee-roster">
              <Users className="w-4 h-4 mr-2" />
              Employee Roster
            </Button>
          </Link>
          <Link href="/saas/modules/hr-core/reports/org-structure">
            <Button variant="outline" className="w-full justify-start" data-testid="button-org-structure">
              <Building2 className="w-4 h-4 mr-2" />
              Organizational Structure
            </Button>
          </Link>
          <Link href="/saas/modules/hr-core/reports/headcount-analysis">
            <Button variant="outline" className="w-full justify-start" data-testid="button-headcount-analysis">
              <BarChart3 className="w-4 h-4 mr-2" />
              Headcount Analysis
            </Button>
          </Link>
          <Link href="/saas/modules/hr-core/reports/demographic-report">
            <Button variant="outline" className="w-full justify-start" data-testid="button-demographic-report">
              <Users className="w-4 h-4 mr-2" />
              Demographic Report
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <span>Analytics Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="font-semibold">Advanced Analytics</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Coming Soon - AI-powered insights
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-green-600" />
            <span>Report Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-core/reports/create-custom">
            <Button className="w-full" data-testid="button-create-custom-report">
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-core/reports/scheduled">
            <Button variant="outline" className="w-full" data-testid="button-scheduled-reports">
              <Clock className="w-4 h-4 mr-2" />
              Scheduled Reports
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
            <Settings className="w-5 h-5 text-gray-600" />
            <span>Module Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure HR Core module preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Employee ID Format</p>
                <p className="text-sm text-gray-500">EMP-{new Date().getFullYear()}-XXXX</p>
              </div>
              <Link href="/saas/modules/hr-core/settings/id-format">
                <Button size="sm" variant="outline" data-testid="button-configure-id-format">
                  Configure
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Approval Workflows</p>
                <p className="text-sm text-gray-500">3 Active workflows</p>
              </div>
              <Link href="/saas/modules/hr-core/settings/workflows">
                <Button size="sm" variant="outline" data-testid="button-manage-workflows">
                  Manage
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Document Templates</p>
                <p className="text-sm text-gray-500">12 Templates available</p>
              </div>
              <Link href="/saas/modules/hr-core/settings/templates">
                <Button size="sm" variant="outline" data-testid="button-manage-templates">
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
            <Shield className="w-5 h-5 text-red-600" />
            <span>Access Control</span>
          </CardTitle>
          <CardDescription>
            Manage permissions and user roles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100">HR Admin</h4>
              <p className="text-sm text-red-700 dark:text-red-300">Full access to all HR functions</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">HR Manager</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Department-level management</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">HR Staff</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">Basic employee management</p>
            </div>
          </div>
          <Link href="/saas/modules/hr-core/settings/permissions">
            <Button className="w-full" data-testid="button-manage-permissions">
              <Shield className="w-4 h-4 mr-2" />
              Manage Permissions
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Core HR & Administration"
      moduleDescription="Employee database, organizational chart, workflow automation, and secure document management"
      category="HRMIS"
      icon={<Users className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
      dataContent={dataContent}
      reportsContent={reportsContent}
      settingsContent={settingsContent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Master Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5" />
              <span>Employee Master Data</span>
            </CardTitle>
            <CardDescription>
              Centralized employee records and lifecycle management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Personal Info</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Complete employee profiles with contact details, emergency contacts, and personal documents
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Job Details</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Position, department, reporting structure, and employment contracts
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Skills Matrix</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Track competencies, certifications, and professional development
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Lifecycle</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Hire → Transfer → Promotion → Exit tracking with audit trails
                </p>
              </div>
            </div>
            <Button className="w-full" data-testid="button-manage-employees">
              <Users className="w-4 h-4 mr-2" />
              Manage Employees
            </Button>
          </CardContent>
        </Card>

        {/* Organizational Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Organizational Structure</span>
            </CardTitle>
            <CardDescription>
              Dynamic org charts and workforce planning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Departments</span>
                <Badge variant="secondary">12 Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Positions</span>
                <Badge variant="secondary">45 Defined</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Reporting Lines</span>
                <Badge variant="secondary">All Mapped</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-org-chart">
                <Building2 className="w-4 h-4 mr-2" />
                View Org Chart
              </Button>
              <Button variant="outline" size="sm" data-testid="button-workforce-planning">
                <Users className="w-4 h-4 mr-2" />
                Workforce Planning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* HR Administration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>HR Administration</span>
            </CardTitle>
            <CardDescription>
              Contracts, policies, and compliance tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Employment Contracts</span>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>Policy Acknowledgments</span>
                </div>
                <Badge variant="secondary">8 Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>Disciplinary Actions</span>
                </div>
                <Badge variant="outline">2 Open</Badge>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-admin-tools">
              <Settings className="w-4 h-4 mr-2" />
              Administration Tools
            </Button>
          </CardContent>
        </Card>

        {/* Workflow Automation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Workflow className="w-5 h-5" />
              <span>Workflow Automation</span>
            </CardTitle>
            <CardDescription>
              Automated processes and approval workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Onboarding Automation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated checklists, IT setup, and compliance workflows for new hires
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Approval Workflows</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Multi-level approvals for HR letters, verification requests, and policy changes
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-create-workflow">
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
              <Button variant="outline" size="sm" data-testid="button-workflow-templates">
                <FileText className="w-4 h-4 mr-2" />
                Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates in Core HR & Administration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'New employee John Doe added to Marketing department', time: '2 hours ago', type: 'employee' },
              { action: 'Organizational chart updated with new reporting structure', time: '4 hours ago', type: 'structure' },
              { action: 'Policy acknowledgment workflow completed for Q4 policies', time: '1 day ago', type: 'policy' },
              { action: 'Bulk employee data import completed successfully', time: '2 days ago', type: 'system' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'employee' ? 'bg-green-500' :
                  activity.type === 'structure' ? 'bg-blue-500' :
                  activity.type === 'policy' ? 'bg-orange-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}