import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Clock, 
  Calendar, 
  CalendarDays,
  Users, 
  Plus,
  Download,
  Settings,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Sun,
  Moon,
  Briefcase,
  Palmtree,
  Timer,
  CalendarCheck,
  CalendarX,
  TrendingUp,
  ClipboardList
} from 'lucide-react';

export default function TimeLeaveSchedulingPage() {
  const quickActions = [
    { label: 'Request Leave', icon: <Palmtree className="w-4 h-4" />, href: '/saas/modules/hr-time-leave/action/request-leave' },
    { label: 'Submit Timesheet', icon: <ClipboardList className="w-4 h-4" />, href: '/saas/modules/hr-time-leave/action/submit-timesheet' },
    { label: 'Approve Requests', icon: <CheckCircle className="w-4 h-4" />, href: '/saas/modules/hr-time-leave/action/approve-requests' },
    { label: 'View Schedule', icon: <Calendar className="w-4 h-4" />, href: '/saas/modules/hr-time-leave/action/view-schedule' },
    { label: 'Overtime Request', icon: <Clock className="w-4 h-4" />, href: '/saas/modules/hr-time-leave/action/overtime-request' },
    { label: 'Holiday Calendar', icon: <CalendarDays className="w-4 h-4" />, href: '/saas/modules/hr-time-leave/action/holiday-calendar' },
    { label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/hr-time-leave/action/reports' }
  ];

  const stats = [
    { label: 'Pending Approvals', value: 8, trend: 'neutral' as const },
    { label: 'On Leave Today', value: 12, trend: 'neutral' as const },
    { label: 'Overtime This Week', value: '45.5h', trend: 'up' as const },
    { label: 'Shift Coverage', value: '98%', trend: 'up' as const }
  ];

  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palmtree className="w-5 h-5 text-green-600" />
            <span>Leave Management</span>
          </CardTitle>
          <CardDescription>
            Configure leave types, accruals, and policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Leave Types</h4>
                <Badge className="bg-green-100 text-green-800">8 Active</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Annual, Sick, Maternity, etc.</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Accrual Rules</h4>
                <Badge variant="outline" className="border-blue-300 text-blue-700">5 Policies</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Monthly, yearly accruals</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-time-leave/data/leave-types">
              <Button className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Manage Leave Types
              </Button>
            </Link>
            <Link href="/saas/modules/hr-time-leave/data/leave-balances">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                View Leave Balances
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Timesheet Management</span>
          </CardTitle>
          <CardDescription>
            Track work hours and timesheet submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Pending</h4>
                <Badge className="bg-blue-100 text-blue-800">15</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Awaiting approval</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Approved</h4>
                <Badge className="bg-green-100 text-green-800">142</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">This pay period</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-time-leave/data/timesheets">
              <Button className="w-full">
                <ClipboardList className="w-4 h-4 mr-2" />
                View Timesheets
              </Button>
            </Link>
            <Link href="/saas/modules/hr-time-leave/data/overtime-approvals">
              <Button variant="outline" className="w-full">
                <Timer className="w-4 h-4 mr-2" />
                Overtime Approvals
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Shift Scheduling</span>
          </CardTitle>
          <CardDescription>
            Create and manage work schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <Sun className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Day Shift</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">85 assigned</p>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-center">
              <Moon className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">Night Shift</p>
              <p className="text-xs text-indigo-700 dark:text-indigo-300">42 assigned</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg text-center">
              <Briefcase className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Flexible</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">29 assigned</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-time-leave/data/shift-roster">
              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                View Shift Roster
              </Button>
            </Link>
            <Link href="/saas/modules/hr-time-leave/data/shift-patterns">
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Manage Shift Patterns
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-red-600" />
            <span>Holiday Calendar</span>
          </CardTitle>
          <CardDescription>
            Manage public holidays and observances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">Independence Day</p>
                <p className="text-sm text-red-700 dark:text-red-300">July 26, 2025</p>
              </div>
              <Badge className="bg-red-100 text-red-800">Upcoming</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Total Holidays 2025</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">15 public holidays</p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-time-leave/data/holiday-calendar">
              <Button className="w-full">
                <CalendarDays className="w-4 h-4 mr-2" />
                Manage Holidays
              </Button>
            </Link>
            <Link href="/saas/modules/hr-time-leave/data/location-calendars">
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Location Calendars
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
            <span>Leave Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-time-leave/reports/leave-summary">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Leave Summary Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/reports/leave-liability">
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Leave Liability Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/reports/leave-trends">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Leave Trends Analysis
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span>Time Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-time-leave/reports/timesheet-summary">
            <Button variant="outline" className="w-full justify-start">
              <ClipboardList className="w-4 h-4 mr-2" />
              Timesheet Summary
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/reports/overtime-report">
            <Button variant="outline" className="w-full justify-start">
              <Timer className="w-4 h-4 mr-2" />
              Overtime Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/reports/payroll-inputs">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Payroll Inputs Report
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Scheduling Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-time-leave/reports/shift-coverage">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Shift Coverage Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/reports/schedule-variance">
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Schedule Variance
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/reports/capacity-planning">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Capacity Planning
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
            <Palmtree className="w-5 h-5 text-green-600" />
            <span>Leave Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-time-leave/settings/leave-policies">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Leave Policies
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/settings/accrual-rules">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Accrual Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/settings/carryover-rules">
            <Button variant="outline" className="w-full justify-start">
              <CalendarCheck className="w-4 h-4 mr-2" />
              Carryover Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/settings/approval-workflows">
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
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Time Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-time-leave/settings/work-schedules">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Work Schedules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/settings/overtime-policies">
            <Button variant="outline" className="w-full justify-start">
              <Timer className="w-4 h-4 mr-2" />
              Overtime Policies
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/settings/timesheet-rules">
            <Button variant="outline" className="w-full justify-start">
              <ClipboardList className="w-4 h-4 mr-2" />
              Timesheet Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-time-leave/settings/pay-periods">
            <Button variant="outline" className="w-full justify-start">
              <CalendarDays className="w-4 h-4 mr-2" />
              Pay Periods
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Time, Leave & Scheduling"
      moduleDescription="Unified workforce time management - leave requests, timesheets, and shift scheduling"
      category="HRMIS"
      icon={<Clock className="w-6 h-6 text-blue-600" />}
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
