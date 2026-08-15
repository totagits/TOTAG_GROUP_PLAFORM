import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Fingerprint, 
  Eye, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Download,
  Settings,
  Users,
  Timer,
  TrendingUp
} from 'lucide-react';

export default function HRBiometricsPage() {
  const quickActions = [
    { label: 'Register Device', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/action/register-device' },
    { label: 'View Attendance', icon: <Clock className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/data/attendance' },
    { label: 'Export Timesheet', icon: <Download className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/reports/timesheet' },
    { label: 'Shift Schedule', icon: <Calendar className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/action/shift-schedule' },
    { label: 'Device Settings', icon: <Settings className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/settings/devices' },
    { label: 'Reports', icon: <TrendingUp className="w-4 h-4" />, href: '/saas/modules/hr-biometrics-attendance/reports/summary' }
  ];

  const stats = [
    { label: 'Active Devices', value: 8, trend: 'up' as const },
    { label: "Today's Check-ins", value: 147, trend: 'up' as const },
    { label: 'On-Time Rate', value: '94%', trend: 'up' as const },
    { label: 'Overtime Hours', value: 45, trend: 'down' as const }
  ];

  return (
    <ModuleLayout
      moduleName="Biometrics & Attendance"
      moduleDescription="Biometric time tracking, attendance monitoring, shift management, and automated timesheet generation"
      category="HRMIS"
      icon={<Fingerprint className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biometric Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Fingerprint className="w-5 h-5" />
              <span>Biometric Systems</span>
            </CardTitle>
            <CardDescription>
              Fingerprint and face recognition for secure time tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Fingerprint</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Advanced fingerprint scanning with liveness detection
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Face Recognition</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  AI-powered facial recognition with anti-spoofing
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Enrolled Users</span>
                <Badge>156 employees</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Recognition Rate</span>
                <Badge variant="secondary">99.8%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Active Devices</span>
                <Badge variant="outline">8 terminals</Badge>
              </div>
            </div>
            <Button className="w-full" data-testid="button-biometric-setup">
              <Fingerprint className="w-4 h-4 mr-2" />
              Manage Biometric Data
            </Button>
          </CardContent>
        </Card>

        {/* Real-time Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Real-time Tracking</span>
            </CardTitle>
            <CardDescription>
              Live attendance monitoring and status updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Currently Present</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Live headcount and location tracking across all sites
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">In Office</span>
                  <Badge>147 employees</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Late Arrivals</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatic alerts for late check-ins and absences
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Late Today</span>
                  <Badge variant="destructive">9 employees</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">147</p>
                <p className="text-xs text-gray-500">Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">9</p>
                <p className="text-xs text-gray-500">Late</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">0</p>
                <p className="text-xs text-gray-500">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shift Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Shift Scheduling</span>
            </CardTitle>
            <CardDescription>
              Advanced shift planning and rotation management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Timer className="w-5 h-5 text-blue-500" />
                  <span>Morning Shift (6AM-2PM)</span>
                </div>
                <Badge>45 assigned</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Timer className="w-5 h-5 text-green-500" />
                  <span>Day Shift (8AM-5PM)</span>
                </div>
                <Badge variant="secondary">78 assigned</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Timer className="w-5 h-5 text-orange-500" />
                  <span>Evening Shift (2PM-10PM)</span>
                </div>
                <Badge variant="outline">33 assigned</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Timer className="w-5 h-5 text-purple-500" />
                  <span>Night Shift (10PM-6AM)</span>
                </div>
                <Badge variant="destructive">0 assigned</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-create-shift">
                <Plus className="w-4 h-4 mr-2" />
                Create Shift
              </Button>
              <Button variant="outline" size="sm" data-testid="button-shift-calendar">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Automated Timesheets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Automated Timesheets</span>
            </CardTitle>
            <CardDescription>
              Auto-generated timesheets with overtime calculations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Smart Generation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatic timesheet creation from biometric data with validation
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Overtime Alerts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time overtime tracking with cost projections and alerts
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">This Week's Overtime</span>
                <span className="text-sm font-semibold text-orange-600">45 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Timesheets Pending</span>
                <span className="text-sm font-semibold text-blue-600">12 reviews</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-approved Rate</span>
                <span className="text-sm font-semibold text-green-600">89%</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-timesheet-review">
              <CheckCircle className="w-4 h-4 mr-2" />
              Review Timesheets
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Analytics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Attendance Analytics</CardTitle>
          <CardDescription>Comprehensive attendance patterns and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Daily Patterns */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Daily Patterns</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Peak Hours</span>
                  <span className="font-bold text-blue-600">9AM-11AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Arrival</span>
                  <span className="font-bold text-green-600">8:15 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">On-time Rate</span>
                  <span className="font-bold text-purple-600">94%</span>
                </div>
              </div>
            </div>

            {/* Weekly Trends */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">Weekly Trends</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Monday Attendance</span>
                  <span className="font-bold text-green-600">96%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Friday Attendance</span>
                  <span className="font-bold text-orange-600">89%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Weekend Work</span>
                  <span className="font-bold text-blue-600">12 hrs</span>
                </div>
              </div>
            </div>

            {/* Department Performance */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">By Department</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Best: IT</span>
                  <span className="font-bold text-green-600">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">HR Department</span>
                  <span className="font-bold text-blue-600">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sales Team</span>
                  <span className="font-bold text-orange-600">91%</span>
                </div>
              </div>
            </div>

            {/* Overtime Analysis */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-900 dark:text-orange-100">Overtime</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">This Month</span>
                  <span className="font-bold text-orange-600">180 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cost Impact</span>
                  <span className="font-bold text-red-600">$4,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Top Contributor</span>
                  <span className="font-bold text-purple-600">Engineering</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}