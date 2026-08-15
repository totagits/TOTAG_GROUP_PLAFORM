import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
// Client-only Zod schemas (no server dependencies)
const clientLeaveRequestSchema = z.object({
  employeeId: z.number(),
  leaveType: z.string().min(1, "Leave type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"), 
  totalDays: z.number().min(1, "Total days must be at least 1"),
  reason: z.string().optional(),
  emergencyContact: z.string().optional()
});

const clientHrRequestSchema = z.object({
  employeeId: z.number(),
  requestType: z.string().min(1, "Request type is required"),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required")
});

const clientProfileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number required"),
  personalPhone: z.string().optional(),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  emergencyPhone: z.string().min(10, "Emergency phone is required"),
  address: z.string().min(5, "Complete address required")
});

const clientTimesheetSchema = z.object({
  weekStartDate: z.string().min(1, "Week start date is required"),
  mondayHours: z.number().min(0).max(24),
  tuesdayHours: z.number().min(0).max(24),
  wednesdayHours: z.number().min(0).max(24),
  thursdayHours: z.number().min(0).max(24),
  fridayHours: z.number().min(0).max(24),
  saturdayHours: z.number().min(0).max(24),
  sundayHours: z.number().min(0).max(24),
  notes: z.string().optional()
});
import { 
  Smartphone, 
  User, 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  Plus,
  Edit,
  Check,
  Bell,
  Settings,
  MessageSquare,
  DollarSign
} from 'lucide-react';

// Use client schemas for forms
const leaveRequestFormSchema = clientLeaveRequestSchema;
const profileUpdateFormSchema = clientProfileUpdateSchema;
const hrRequestFormSchema = clientHrRequestSchema;
const timesheetFormSchema = clientTimesheetSchema;

export default function HRSelfServicePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLeaveRequestOpen, setIsLeaveRequestOpen] = useState(false);
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false);
  const [isTimesheetOpen, setIsTimesheetOpen] = useState(false);
  const [isHRRequestOpen, setIsHRRequestOpen] = useState(false);

  // Form hooks
  const leaveForm = useForm<z.infer<typeof leaveRequestFormSchema>>({
    resolver: zodResolver(leaveRequestFormSchema),
    defaultValues: {
      employeeId: 0, // Server will derive from JWT token
      leaveType: '',
      startDate: '',
      endDate: '',
      totalDays: 0,
      reason: ''
    }
  });

  const profileForm = useForm<z.infer<typeof profileUpdateFormSchema>>({
    resolver: zodResolver(profileUpdateFormSchema),
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+231-555-0123',
      personalPhone: '',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+231-555-0124',
      address: '123 Main St, Monrovia, Liberia'
    }
  });

  const hrRequestForm = useForm<z.infer<typeof hrRequestFormSchema>>({
    resolver: zodResolver(hrRequestFormSchema),
    defaultValues: {
      employeeId: 0, // Server will derive from JWT token
      requestType: '',
      priority: 'medium',
      subject: '',
      description: ''
    }
  });

  const timesheetForm = useForm<z.infer<typeof timesheetFormSchema>>({
    resolver: zodResolver(timesheetFormSchema),
    defaultValues: {
      weekStartDate: '',
      mondayHours: 0,
      tuesdayHours: 0,
      wednesdayHours: 0,
      thursdayHours: 0,
      fridayHours: 0,
      saturdayHours: 0,
      sundayHours: 0,
      notes: ''
    }
  });

  // Mutations
  const leaveRequestMutation = useMutation({
    mutationFn: (data: z.infer<typeof leaveRequestFormSchema>) => 
      apiRequest('/api/saas/self-service/leave-request', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate)
        })
      }),
    onSuccess: () => {
      toast({
        title: "Leave Request Submitted",
        description: "Your leave request has been submitted for manager approval.",
      });
      setIsLeaveRequestOpen(false);
      leaveForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/saas/self-service/activity'] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit leave request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const profileUpdateMutation = useMutation({
    mutationFn: (data: z.infer<typeof profileUpdateFormSchema>) => 
      apiRequest('/api/saas/self-service/profile', {
        method: 'PATCH',
        body: JSON.stringify(data) // Server derives employeeId from JWT
      }),
    onSuccess: () => {
      toast({
        title: "Profile Updated Successfully",
        description: "Your profile information has been updated and saved.",
      });
      setIsProfileUpdateOpen(false);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const hrRequestMutation = useMutation({
    mutationFn: (data: z.infer<typeof hrRequestFormSchema>) => 
      apiRequest('/api/saas/self-service/hr-request', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      toast({
        title: "HR Request Submitted",
        description: "Your HR request has been submitted and will be reviewed within 2 business days.",
      });
      setIsHRRequestOpen(false);
      hrRequestForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/saas/self-service/activity'] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit HR request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const timesheetMutation = useMutation({
    mutationFn: (data: z.infer<typeof timesheetFormSchema>) => 
      apiRequest('/api/saas/self-service/timesheet', {
        method: 'POST',
        body: JSON.stringify({
          // Server derives employeeId from JWT token
          date: new Date(data.weekStartDate),
          hoursWorked: data.mondayHours + data.tuesdayHours + data.wednesdayHours + 
                      data.thursdayHours + data.fridayHours + data.saturdayHours + data.sundayHours,
          notes: data.notes,
          status: 'present'
        })
      }),
    onSuccess: () => {
      toast({
        title: "Timesheet Submitted",
        description: "Your timesheet for this week has been submitted successfully.",
      });
      setIsTimesheetOpen(false);
      timesheetForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/saas/self-service/activity'] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit timesheet. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Form submit handlers
  const handleLeaveRequest = (data: z.infer<typeof leaveRequestFormSchema>) => {
    leaveRequestMutation.mutate(data);
  };

  const handleProfileUpdate = (data: z.infer<typeof profileUpdateFormSchema>) => {
    profileUpdateMutation.mutate(data);
  };

  const handleTimesheetSubmit = (data: z.infer<typeof timesheetFormSchema>) => {
    timesheetMutation.mutate(data);
  };

  const handleHRRequest = (data: z.infer<typeof hrRequestFormSchema>) => {
    hrRequestMutation.mutate(data);
  };

  const handleViewPayslip = () => {
    toast({
      title: "Payslip Access",
      description: "Redirecting to secure payslip portal...",
    });
  };

  const handleTeamDirectory = () => {
    toast({
      title: "Team Directory",
      description: "Opening company team directory and contact information.",
    });
  };

  const quickActions = [
    { label: 'Request Leave', icon: <Calendar className="w-4 h-4" />, href: '/saas/modules/hr-self-service/action/request-leave' },
    { label: 'Update Profile', icon: <Edit className="w-4 h-4" />, href: '/saas/modules/hr-self-service/action/update-profile' },
    { label: 'Submit Timesheet', icon: <Clock className="w-4 h-4" />, href: '/saas/modules/hr-self-service/action/submit-timesheet' },
    { label: 'View Payslip', icon: <FileText className="w-4 h-4" />, href: '/saas/modules/hr-self-service/action/view-payslip' },
    { label: 'Team Directory', icon: <Users className="w-4 h-4" />, href: '/saas/modules/hr-self-service/data/team-directory' },
    { label: 'HR Request', icon: <MessageSquare className="w-4 h-4" />, href: '/saas/modules/hr-self-service/action/hr-request' }
  ];

  const stats = [
    { label: 'Active Users', value: 156, trend: 'up' as const },
    { label: 'Pending Requests', value: 23, trend: 'down' as const },
    { label: 'Mobile Usage', value: '92%', trend: 'up' as const },
    { label: 'Self-Service Rate', value: '85%', trend: 'up' as const }
  ];

  return (
    <ModuleLayout
      moduleName="Employee & Manager Self-Service"
      moduleDescription="Mobile-first employee portal, manager dashboard, and leave management system"
      category="HRMIS"
      icon={<Smartphone className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Self-Service Portal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Employee Portal</span>
            </CardTitle>
            <CardDescription>
              Mobile-first self-service for employees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="group relative p-6 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100/80 dark:from-blue-950/30 dark:via-blue-900/40 dark:to-blue-800/30 rounded-xl border border-blue-200/50 dark:border-blue-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg">Profile Management</h4>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    Update personal information, emergency contacts, and important documents with ease
                  </p>
                </div>
              </div>
              <div className="group relative p-6 bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100/80 dark:from-emerald-950/30 dark:via-emerald-900/40 dark:to-emerald-800/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">Pay & Benefits</h4>
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                    Access payslips, tax documents, and manage benefits enrollment seamlessly
                  </p>
                </div>
              </div>
              <div className="group relative p-6 bg-gradient-to-br from-violet-50 via-violet-50 to-violet-100/80 dark:from-violet-950/30 dark:via-violet-900/40 dark:to-violet-800/30 rounded-xl border border-violet-200/50 dark:border-violet-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                      <Clock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h4 className="font-bold text-violet-900 dark:text-violet-100 text-lg">Time Tracking</h4>
                  </div>
                  <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">
                    Submit accurate timesheets and track work hours effortlessly
                  </p>
                </div>
              </div>
              <div className="group relative p-6 bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100/80 dark:from-amber-950/30 dark:via-amber-900/40 dark:to-amber-800/30 rounded-xl border border-amber-200/50 dark:border-amber-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                      <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-100 text-lg">HR Requests</h4>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                    Submit HR requests and track approval status in real-time
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-slate-200/50 dark:border-slate-800/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mobile App Adoption</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">92%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{width: '92%'}}></div>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="button-employee-portal">
              <Smartphone className="w-4 h-4 mr-2" />
              Access Employee Portal
            </Button>
          </CardContent>
        </Card>

        {/* Manager Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Manager Dashboard</span>
            </CardTitle>
            <CardDescription>
              Team management and approval workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="group relative p-6 bg-gradient-to-br from-violet-50 via-violet-50 to-indigo-100/80 dark:from-violet-950/30 dark:via-violet-900/40 dark:to-indigo-800/30 rounded-xl border border-violet-200/50 dark:border-violet-800/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                    <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h4 className="font-bold text-violet-900 dark:text-violet-100 text-lg">Team Overview</h4>
                </div>
                <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">
                  Real-time team status, attendance tracking, and comprehensive performance metrics
                </p>
              </div>
              <div className="group relative p-6 bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-100/80 dark:from-emerald-950/30 dark:via-emerald-900/40 dark:to-teal-800/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">Approval Center</h4>
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  Centralized workflow for leave requests, expense approvals, and timesheet validation
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">12</p>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Team Size</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">8</p>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">Pending</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/20 dark:to-violet-900/30 rounded-xl border border-violet-200/50 dark:border-violet-800/30">
                <p className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-1">95%</p>
                <p className="text-xs font-medium text-violet-700 dark:text-violet-300 uppercase tracking-wide">Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Leave Management</span>
            </CardTitle>
            <CardDescription>
              Automated leave requests and approval system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="group relative flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-100/80 dark:from-blue-950/30 dark:via-blue-900/40 dark:to-indigo-800/30 rounded-xl border border-blue-200/50 dark:border-blue-800/30 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-blue-900 dark:text-blue-100">Pending Requests</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 font-semibold">8 requests</Badge>
              </div>
              <div className="group relative flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 via-emerald-50 to-teal-100/80 dark:from-emerald-950/30 dark:via-emerald-900/40 dark:to-teal-800/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="font-medium text-emerald-900 dark:text-emerald-100">Approved Today</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 font-semibold">5 requests</Badge>
              </div>
              <div className="group relative flex items-center justify-between p-5 bg-gradient-to-r from-amber-50 via-amber-50 to-orange-100/80 dark:from-amber-950/30 dark:via-amber-900/40 dark:to-orange-800/30 rounded-xl border border-amber-200/50 dark:border-amber-800/30 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                    <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="font-medium text-amber-900 dark:text-amber-100">Urgent Reviews</span>
                </div>
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 font-semibold">2 requests</Badge>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100/80 dark:from-slate-950/30 dark:via-slate-900/40 dark:to-slate-800/30 rounded-xl p-6 border border-slate-200/50 dark:border-slate-800/30">
              <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-lg">Leave Types Usage</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Annual Leave</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">45 days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Sick Leave</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">12 days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Personal Leave</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">8 days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Parental Leave</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">3 requests</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-request-leave">
                <Plus className="w-4 h-4 mr-2" />
                Request Leave
              </Button>
              <Button variant="outline" size="sm" data-testid="button-leave-calendar">
                <Calendar className="w-4 h-4 mr-2" />
                Leave Calendar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employee Directory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Employee Directory</span>
            </CardTitle>
            <CardDescription>
              Searchable company directory and org chart
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Smart Search</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find colleagues by name, department, skills, or location
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Up-to-date contact details, office locations, and reporting lines
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Employees</span>
                <span className="text-sm font-semibold text-blue-600">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Departments</span>
                <span className="text-sm font-semibold text-green-600">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Office Locations</span>
                <span className="text-sm font-semibold text-purple-600">3</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-employee-directory">
              <Users className="w-4 h-4 mr-2" />
              Browse Directory
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Self-Service Activity</CardTitle>
          <CardDescription>Latest employee and manager actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { user: 'Sarah Johnson', action: 'submitted leave request for vacation (5 days)', time: '2 hours ago', type: 'leave' },
              { user: 'Manager Mike Chen', action: 'approved timesheet for team member John Doe', time: '3 hours ago', type: 'approval' },
              { user: 'Emily Davis', action: 'updated emergency contact information', time: '5 hours ago', type: 'profile' },
              { user: 'Alex Wilson', action: 'downloaded payslip for December 2024', time: '1 day ago', type: 'document' },
              { user: 'Manager Lisa Park', action: 'reviewed team attendance report', time: '1 day ago', type: 'report' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'leave' ? 'bg-blue-500' :
                  activity.type === 'approval' ? 'bg-green-500' :
                  activity.type === 'profile' ? 'bg-purple-500' :
                  activity.type === 'document' ? 'bg-orange-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave Request Modal */}
      <Dialog open={isLeaveRequestOpen} onOpenChange={setIsLeaveRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Leave Request</DialogTitle>
            <DialogDescription>
              Request time off for vacation, sick leave, or personal reasons.
            </DialogDescription>
          </DialogHeader>
          <Form {...leaveForm}>
            <form onSubmit={leaveForm.handleSubmit(handleLeaveRequest)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={leaveForm.control}
                  name="leaveType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger data-testid="select-leave-type">
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual">Annual Leave</SelectItem>
                            <SelectItem value="sick">Sick Leave</SelectItem>
                            <SelectItem value="personal">Personal Leave</SelectItem>
                            <SelectItem value="maternity">Maternity Leave</SelectItem>
                            <SelectItem value="paternity">Paternity Leave</SelectItem>
                            <SelectItem value="emergency">Emergency Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={leaveForm.control}
                  name="totalDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Days</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5" data-testid="input-total-days" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={leaveForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" data-testid="input-start-date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={leaveForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" data-testid="input-end-date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={leaveForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide additional details..." data-testid="textarea-leave-reason" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsLeaveRequestOpen(false)} data-testid="button-cancel-leave">
                  Cancel
                </Button>
                <Button type="submit" disabled={leaveRequestMutation.isPending} data-testid="button-submit-leave">
                  <Calendar className="w-4 h-4 mr-2" />
                  {leaveRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Profile Update Modal */}
      <Dialog open={isProfileUpdateOpen} onOpenChange={setIsProfileUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Update your personal information, contact details, and emergency contacts.
            </DialogDescription>
          </DialogHeader>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" data-testid="input-first-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" data-testid="input-last-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@company.com" data-testid="input-email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+231-555-0123" data-testid="input-phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" data-testid="input-emergency-contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+231-555-0124" data-testid="input-emergency-phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={profileForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Monrovia, Liberia" data-testid="input-address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsProfileUpdateOpen(false)} data-testid="button-cancel-profile">
                  Cancel
                </Button>
                <Button type="submit" disabled={profileUpdateMutation.isPending} data-testid="button-save-profile">
                  <User className="w-4 h-4 mr-2" />
                  {profileUpdateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Timesheet Submission Modal */}
      <Dialog open={isTimesheetOpen} onOpenChange={setIsTimesheetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Timesheet</DialogTitle>
            <DialogDescription>
              Submit your weekly timesheet for approval and payroll processing.
            </DialogDescription>
          </DialogHeader>
          <Form {...timesheetForm}>
            <form onSubmit={timesheetForm.handleSubmit(handleTimesheetSubmit)} className="space-y-4">
              <FormField
                control={timesheetForm.control}
                name="weekStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Week Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" data-testid="input-week-ending" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-3">
                <FormLabel>Daily Hours Breakdown</FormLabel>
                <div className="grid grid-cols-7 gap-2 text-xs">
                  <div className="text-center font-medium">Mon</div>
                  <div className="text-center font-medium">Tue</div>
                  <div className="text-center font-medium">Wed</div>
                  <div className="text-center font-medium">Thu</div>
                  <div className="text-center font-medium">Fri</div>
                  <div className="text-center font-medium">Sat</div>
                  <div className="text-center font-medium">Sun</div>
                  <FormField
                    control={timesheetForm.control}
                    name="mondayHours"
                    render={({ field }) => (
                      <FormControl>
                        <Input type="number" placeholder="8" className="text-center" data-testid="input-hours-mon" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={timesheetForm.control}
                    name="tuesdayHours"
                    render={({ field }) => (
                      <FormControl>
                        <Input type="number" placeholder="8" className="text-center" data-testid="input-hours-tue" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={timesheetForm.control}
                    name="wednesdayHours"
                    render={({ field }) => (
                      <FormControl>
                        <Input type="number" placeholder="8" className="text-center" data-testid="input-hours-wed" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={timesheetForm.control}
                    name="thursdayHours"
                    render={({ field }) => (
                      <FormControl>
                        <Input type="number" placeholder="8" className="text-center" data-testid="input-hours-thu" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={timesheetForm.control}
                    name="fridayHours"
                    render={({ field }) => (
                      <FormControl>
                        <Input type="number" placeholder="8" className="text-center" data-testid="input-hours-fri" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={timesheetForm.control}
                    name="saturdayHours"
                    render={({ field }) => (
                      <FormControl>
                        <Input type="number" placeholder="0" className="text-center" data-testid="input-hours-sat" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={timesheetForm.control}
                    name="sundayHours"
                    render={({ field }) => (
                      <FormControl>
                        <Input type="number" placeholder="0" className="text-center" data-testid="input-hours-sun" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={timesheetForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any additional notes about your timesheet..." data-testid="textarea-timesheet-notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsTimesheetOpen(false)} data-testid="button-cancel-timesheet">
                  Cancel
                </Button>
                <Button type="submit" disabled={timesheetMutation.isPending} data-testid="button-submit-timesheet">
                  <Clock className="w-4 h-4 mr-2" />
                  {timesheetMutation.isPending ? 'Submitting...' : 'Submit Timesheet'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* HR Request Modal */}
      <Dialog open={isHRRequestOpen} onOpenChange={setIsHRRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit HR Request</DialogTitle>
            <DialogDescription>
              Submit a request to HR for assistance, policy questions, or administrative support.
            </DialogDescription>
          </DialogHeader>
          <Form {...hrRequestForm}>
            <form onSubmit={hrRequestForm.handleSubmit(handleHRRequest)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={hrRequestForm.control}
                  name="requestType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger data-testid="select-request-type">
                            <SelectValue placeholder="Select request type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="policy_inquiry">Policy Question</SelectItem>
                            <SelectItem value="benefits_question">Benefits Inquiry</SelectItem>
                            <SelectItem value="document_request">Document Request</SelectItem>
                            <SelectItem value="grievance">Complaint/Concern</SelectItem>
                            <SelectItem value="training_request">Training Request</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={hrRequestForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Level</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger data-testid="select-priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={hrRequestForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of your request" data-testid="input-request-subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={hrRequestForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Please provide detailed information about your request..." data-testid="textarea-request-details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsHRRequestOpen(false)} data-testid="button-cancel-hr-request">
                  Cancel
                </Button>
                <Button type="submit" disabled={hrRequestMutation.isPending} data-testid="button-submit-hr-request">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {hrRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
}