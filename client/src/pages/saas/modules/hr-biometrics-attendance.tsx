import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Fingerprint, 
  Clock, 
  Calendar, 
  Users, 
  Shield,
  Plus,
  Download,
  Settings,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Monitor,
  Smartphone,
  MapPin,
  Eye,
  Activity,
  Target,
  TrendingUp,
  Database,
  Wifi
} from 'lucide-react';

export default function BiometricsAttendancePage() {
  const quickActions = [
    { label: 'Punch In/Out', icon: <Fingerprint className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/action/punch-clock' },
    { label: 'Register Device', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/action/register-device' },
    { label: 'View Attendance', icon: <Clock className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/action/view-attendance' },
    { label: 'Export Timesheet', icon: <Download className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/action/export-timesheet' },
    { label: 'Shift Schedule', icon: <Calendar className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/action/shift-schedule' },
    { label: 'Device Settings', icon: <Settings className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/action/device-settings' },
    { label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/action/reports' }
  ];

  const stats = [
    { label: 'Active Devices', value: 8, trend: 'up' as const },
    { label: 'Today\'s Attendance', value: '142/156', trend: 'neutral' as const },
    { label: 'Late Arrivals', value: 12, trend: 'down' as const },
    { label: 'Overtime Hours', value: '24.5h', trend: 'up' as const }
  ];

  // Data Management Content
  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Fingerprint className="w-5 h-5 text-blue-600" />
            <span>Biometric Device Management</span>
          </CardTitle>
          <CardDescription>
            Register, configure, and monitor biometric devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Online Devices</h4>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">6 Active</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Main entrance, warehouse, office floors
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Offline Devices</h4>
                <Badge variant="outline" className="border-orange-300 text-orange-700">2 Offline</Badge>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Conference room, parking area
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-biometrics-attendance/data/register-device">
              <Button className="w-full" data-testid="button-register-new-device">
                <Plus className="w-4 h-4 mr-2" />
                Register New Device
              </Button>
            </Link>
            <Link href="/saas/modules/hr-biometrics-attendance/data/device-diagnostics">
              <Button variant="outline" className="w-full" data-testid="button-device-diagnostics">
                <Monitor className="w-4 h-4 mr-2" />
                Device Diagnostics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span>Attendance Data</span>
          </CardTitle>
          <CardDescription>
            Real-time attendance tracking and management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Present Today</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">142/156</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium">Absent</span>
              </div>
              <Badge variant="destructive">14</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Late Arrivals</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">12</Badge>
            </div>
          </div>
          <Link href="/saas/modules/hr-biometrics-attendance/data/live-attendance">
            <Button variant="outline" className="w-full" data-testid="button-view-live-attendance">
              <Eye className="w-4 h-4 mr-2" />
              View Live Attendance Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Shift Management</span>
          </CardTitle>
          <CardDescription>
            Configure shifts, schedules, and work patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Morning Shift</h4>
                  <p className="text-sm text-gray-500">08:00 - 16:00 (62 employees)</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Evening Shift</h4>
                  <p className="text-sm text-gray-500">16:00 - 00:00 (48 employees)</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Night Shift</h4>
                  <p className="text-sm text-gray-500">00:00 - 08:00 (28 employees)</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </div>
          <Link href="/saas/modules/hr-biometrics-attendance/data/manage-shifts">
            <Button className="w-full" data-testid="button-manage-shifts">
              <Settings className="w-4 h-4 mr-2" />
              Manage Shift Schedules
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <span>Data Export & Backup</span>
          </CardTitle>
          <CardDescription>
            Export attendance data and manage backups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Link href="/saas/modules/hr-biometrics-attendance/data/export-daily">
              <Button variant="outline" className="w-full justify-start" data-testid="button-export-daily">
                <FileText className="w-4 h-4 mr-2" />
                Export Daily Attendance
              </Button>
            </Link>
            <Link href="/saas/modules/hr-biometrics-attendance/data/export-weekly">
              <Button variant="outline" className="w-full justify-start" data-testid="button-export-weekly">
                <Calendar className="w-4 h-4 mr-2" />
                Export Weekly Report
              </Button>
            </Link>
            <Link href="/saas/modules/hr-biometrics-attendance/data/export-monthly">
              <Button variant="outline" className="w-full justify-start" data-testid="button-export-monthly">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Monthly Summary
              </Button>
            </Link>
            <Link href="/saas/modules/hr-biometrics-attendance/data/backup">
              <Button variant="outline" className="w-full justify-start" data-testid="button-backup-data">
                <Download className="w-4 h-4 mr-2" />
                Backup All Data
              </Button>
            </Link>
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
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Attendance Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-biometrics-attendance/reports/daily-attendance">
            <Button variant="outline" className="w-full justify-start" data-testid="button-daily-attendance-report">
              <Clock className="w-4 h-4 mr-2" />
              Daily Attendance Summary
            </Button>
          </Link>
          <Link href="/saas/modules/hr-biometrics-attendance/reports/employee-timesheet">
            <Button variant="outline" className="w-full justify-start" data-testid="button-employee-timesheet">
              <Users className="w-4 h-4 mr-2" />
              Employee Timesheet Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-biometrics-attendance/reports/tardiness">
            <Button variant="outline" className="w-full justify-start" data-testid="button-tardiness-report">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Tardiness & Absence Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-biometrics-attendance/reports/overtime">
            <Button variant="outline" className="w-full justify-start" data-testid="button-overtime-report">
              <TrendingUp className="w-4 h-4 mr-2" />
              Overtime Analysis
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span>Performance Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-semibold">Department Metrics</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Productivity & attendance patterns
            </p>
          </div>
          <Link href="/saas/modules/hr-biometrics-attendance/reports/performance-dashboard">
            <Button className="w-full" data-testid="button-performance-dashboard">
              <Target className="w-4 h-4 mr-2" />
              Performance Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Compliance Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-biometrics-attendance/reports/labor-law-compliance">
            <Button variant="outline" className="w-full justify-start" data-testid="button-labor-law-compliance">
              <Shield className="w-4 h-4 mr-2" />
              Labor Law Compliance
            </Button>
          </Link>
          <Link href="/saas/modules/hr-biometrics-attendance/reports/audit-trail">
            <Button variant="outline" className="w-full justify-start" data-testid="button-audit-trail">
              <FileText className="w-4 h-4 mr-2" />
              Audit Trail Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-biometrics-attendance/reports/create-custom">
            <Button className="w-full" data-testid="button-custom-report">
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Report
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
            <span>System Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure biometric system settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Grace Period</p>
                <p className="text-sm text-gray-500">15 minutes late arrival tolerance</p>
              </div>
              <Link href="/saas/modules/hr-biometrics-attendance/settings/grace-period">
                <Button size="sm" variant="outline" data-testid="button-configure-grace-period">
                  Configure
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Overtime Threshold</p>
                <p className="text-sm text-gray-500">8 hours per day, 40 hours per week</p>
              </div>
              <Link href="/saas/modules/hr-biometrics-attendance/settings/overtime-rules">
                <Button size="sm" variant="outline" data-testid="button-configure-overtime">
                  Configure
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Break Time Rules</p>
                <p className="text-sm text-gray-500">1 hour lunch, 2x 15min breaks</p>
              </div>
              <Link href="/saas/modules/hr-biometrics-attendance/settings/break-rules">
                <Button size="sm" variant="outline" data-testid="button-configure-breaks">
                  Configure
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-blue-600" />
            <span>Device Network Settings</span>
          </CardTitle>
          <CardDescription>
            Network and connectivity configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Main Office Network</h4>
              <p className="text-sm text-green-700 dark:text-green-300">192.168.1.0/24 - 6 devices connected</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Warehouse Network</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">192.168.2.0/24 - 2 devices connected</p>
            </div>
          </div>
          <Link href="/saas/modules/hr-biometrics-attendance/settings/network-diagnostics">
            <Button className="w-full" data-testid="button-network-diagnostics">
              <Activity className="w-4 h-4 mr-2" />
              Run Network Diagnostics
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Security & Access Control</span>
          </CardTitle>
          <CardDescription>
            Biometric security and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100">Administrative Access</h4>
              <p className="text-sm text-red-700 dark:text-red-300">Full system configuration access</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Supervisor Access</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Department attendance monitoring</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Employee Access</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">Personal attendance data only</p>
            </div>
          </div>
          <Link href="/saas/modules/hr-biometrics-attendance/settings/security-configuration">
            <Button className="w-full" data-testid="button-security-settings">
              <Shield className="w-4 h-4 mr-2" />
              Security Configuration
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <span>Mobile App Integration</span>
          </CardTitle>
          <CardDescription>
            Mobile attendance and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
            <Smartphone className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-semibold">Mobile Attendance App</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              GPS-based clock-in for remote workers
            </p>
          </div>
          <Link href="/saas/modules/hr-biometrics-attendance/settings/mobile-app">
            <Button className="w-full" data-testid="button-mobile-app-settings">
              <Settings className="w-4 h-4 mr-2" />
              Configure Mobile App
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Biometric & Attendance Recording"
      moduleDescription="Advanced biometric attendance tracking with device management, shift scheduling, and comprehensive reporting"
      category="HRMIS"
      icon={<Fingerprint className="w-6 h-6 text-purple-600" />}
      quickActions={quickActions}
      stats={stats}
      dataContent={dataContent}
      reportsContent={reportsContent}
      settingsContent={settingsContent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Attendance Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Live Attendance Monitor</span>
            </CardTitle>
            <CardDescription>
              Real-time employee check-ins and activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Sarah Johnson</span>
                </div>
                <span className="text-sm text-gray-500">Checked in - 08:15</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Michael Chen</span>
                </div>
                <span className="text-sm text-gray-500">Checked in - 08:22</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">Emma Davis</span>
                </div>
                <span className="text-sm text-gray-500">Break - 10:30</span>
              </div>
            </div>
            <Button className="w-full" data-testid="button-full-attendance-view">
              <Eye className="w-4 h-4 mr-2" />
              View Full Attendance Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Device Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>Device Status Overview</span>
            </CardTitle>
            <CardDescription>
              Biometric device health and connectivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="font-semibold text-green-900 dark:text-green-100">6 Online</p>
                <p className="text-xs text-green-600">All systems operational</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <p className="font-semibold text-red-900 dark:text-red-100">2 Offline</p>
                <p className="text-xs text-red-600">Requires attention</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" data-testid="button-device-management">
              <Settings className="w-4 h-4 mr-2" />
              Device Management Console
            </Button>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}