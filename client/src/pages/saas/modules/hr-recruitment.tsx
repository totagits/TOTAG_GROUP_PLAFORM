import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Briefcase, 
  Search, 
  Calendar, 
  MessageCircle, 
  FileCheck,
  Users,
  Plus,
  Send,
  Upload,
  CheckCircle,
  Clock,
  Star,
  Settings,
  BarChart3,
  Download,
  Target,
  TrendingUp,
  Eye,
  Filter,
  Award
} from 'lucide-react';

export default function HRRecruitmentPage() {
  const quickActions = [
    { label: 'Post New Job', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/hr-recruitment/action/post-job' },
    { label: 'Review Applications', icon: <FileCheck className="w-4 h-4" />, href: '/saas/modules/hr-recruitment/action/review-applications' },
    { label: 'Schedule Interview', icon: <Calendar className="w-4 h-4" />, href: '/saas/modules/hr-recruitment/action/schedule-interview' },
    { label: 'Send Offer', icon: <Send className="w-4 h-4" />, href: '/saas/modules/hr-recruitment/action/send-offer' },
    { label: 'Candidate Search', icon: <Search className="w-4 h-4" />, href: '/saas/modules/hr-recruitment/action/candidate-search' },
    { label: 'Export Data', icon: <Download className="w-4 h-4" />, href: '/saas/modules/hr-recruitment/action/export-data' }
  ];

  const stats = [
    { label: 'Active Job Posts', value: 12, trend: 'up' as const },
    { label: 'Applications Received', value: 89, trend: 'up' as const },
    { label: 'Interviews Scheduled', value: 24, trend: 'neutral' as const },
    { label: 'Offers Pending', value: 5, trend: 'down' as const }
  ];

  // Data Management Content
  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span>Job Posting Management</span>
          </CardTitle>
          <CardDescription>
            Create and manage job requisitions and postings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Active Jobs</h4>
              <p className="text-2xl font-bold text-blue-600 mt-1">12</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Currently accepting applications</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Draft Jobs</h4>
              <p className="text-2xl font-bold text-green-600 mt-1">3</p>
              <p className="text-sm text-green-700 dark:text-green-300">Pending approval to post</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button className="w-full" data-testid="button-create-job-posting">
              <Plus className="w-4 h-4 mr-2" />
              Create New Job Posting
            </Button>
            <Button variant="outline" className="w-full" data-testid="button-manage-job-templates">
              <FileCheck className="w-4 h-4 mr-2" />
              Manage Job Templates
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Candidate Management</span>
          </CardTitle>
          <CardDescription>
            Track applications and candidate pipeline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">New Applications</span>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">23</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Under Review</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">41</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Interview Stage</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">24</Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full" data-testid="button-view-candidate-pipeline">
            <Eye className="w-4 h-4 mr-2" />
            View Full Pipeline
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Interview Scheduling</span>
          </CardTitle>
          <CardDescription>
            Coordinate interviews and assessment activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Today's Interviews</h4>
                <Badge variant="secondary">4 scheduled</Badge>
              </div>
              <p className="text-sm text-gray-500">9:00 AM - Software Engineer (2 candidates)</p>
              <p className="text-sm text-gray-500">2:00 PM - Marketing Manager (2 candidates)</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">This Week</h4>
                <Badge variant="secondary">12 interviews</Badge>
              </div>
              <p className="text-sm text-gray-500">Mix of phone, video, and in-person interviews</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-schedule-interview">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule New Interview
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-orange-600" />
            <span>Offer Management</span>
          </CardTitle>
          <CardDescription>
            Generate and track employment offers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold">5 Pending</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Awaiting response</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold">3 Accepted</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">This month</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-generate-offer">
            <Send className="w-4 h-4 mr-2" />
            Generate Employment Offer
          </Button>
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
            <span>Recruitment Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-hiring-funnel-report">
            <TrendingUp className="w-4 h-4 mr-2" />
            Hiring Funnel Analysis
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-source-effectiveness">
            <Target className="w-4 h-4 mr-2" />
            Source Effectiveness
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-time-to-hire">
            <Clock className="w-4 h-4 mr-2" />
            Time to Hire Metrics
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-interviewer-feedback">
            <MessageCircle className="w-4 h-4 mr-2" />
            Interviewer Feedback
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Performance Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-semibold">Recruitment Metrics</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Cost per hire, quality metrics, retention rates
            </p>
          </div>
          <Button className="w-full" data-testid="button-recruitment-analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics Dashboard
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-purple-600" />
            <span>Export & Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-export-candidate-data">
            <Download className="w-4 h-4 mr-2" />
            Export Candidate Data
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-interview-templates">
            <FileCheck className="w-4 h-4 mr-2" />
            Interview Templates
          </Button>
          <Button className="w-full" data-testid="button-custom-recruitment-report">
            <Plus className="w-4 h-4 mr-2" />
            Create Custom Report
          </Button>
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
            <span>Recruitment Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure recruitment process settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Application Deadline</p>
                <p className="text-sm text-gray-500">30 days default for job postings</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-configure-deadlines">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Interview Rounds</p>
                <p className="text-sm text-gray-500">Phone → Video → Panel → Final</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-configure-interview-rounds">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Approval Workflow</p>
                <p className="text-sm text-gray-500">Department Head → HR → CEO</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-configure-approvals">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span>Screening & Assessment</span>
          </CardTitle>
          <CardDescription>
            Configure automated screening criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">AI Resume Screening</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">Keyword matching and skill extraction</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Skill Assessments</h4>
              <p className="text-sm text-green-700 dark:text-green-300">Technical and behavioral evaluations</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Background Checks</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">Automated verification processes</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-assessment-settings">
            <Settings className="w-4 h-4 mr-2" />
            Assessment Configuration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-green-600" />
            <span>Job Board Integration</span>
          </CardTitle>
          <CardDescription>
            Configure external job board connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">LinkedIn Jobs</h4>
                <Badge variant="secondary">Connected</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Premium job posting integration</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Indeed</h4>
                <Badge variant="secondary">Connected</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Sponsored job distribution</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-job-board-settings">
            <Settings className="w-4 h-4 mr-2" />
            Integration Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <span>Communication Templates</span>
          </CardTitle>
          <CardDescription>
            Manage email templates and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-semibold">Email Templates</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Application confirmations, interview invites, rejections
            </p>
          </div>
          <Button className="w-full" data-testid="button-template-editor">
            <Settings className="w-4 h-4 mr-2" />
            Template Editor
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Recruitment & Onboarding"
      moduleDescription="Advanced applicant tracking system with AI resume screening, interview coordination, and onboarding workflows"
      category="HRMIS"
      icon={<UserPlus className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
      dataContent={dataContent}
      reportsContent={reportsContent}
      settingsContent={settingsContent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Requisition & Posting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Job Management</span>
            </CardTitle>
            <CardDescription>
              Streamlined job requisition and multi-channel posting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Requisition</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Approval workflows for new roles with budget validation
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Distribution</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Multi-channel posting to job boards, LinkedIn, social media
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Active Jobs</span>
                <Badge>12 Live</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Draft Posts</span>
                <Badge variant="secondary">3 Pending</Badge>
              </div>
            </div>
            <Button className="w-full" data-testid="button-manage-jobs">
              <Briefcase className="w-4 h-4 mr-2" />
              Manage Job Posts
            </Button>
          </CardContent>
        </Card>

        {/* Applicant Tracking System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Applicant Tracking</span>
            </CardTitle>
            <CardDescription>
              AI-powered screening and candidate management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">AI Resume Screening</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated keyword and skills extraction with matching scores
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Candidate Pipeline</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track progress from application to hire with automated notifications
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">42</p>
                <p className="text-xs text-gray-500">Shortlisted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">24</p>
                <p className="text-xs text-gray-500">Interviewed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">8</p>
                <p className="text-xs text-gray-500">Final Round</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Interview Management</span>
            </CardTitle>
            <CardDescription>
              Scheduling, panel coordination, and assessment tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span>Today's Interviews</span>
                </div>
                <Badge>6 Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-500" />
                  <span>Panel Coordination</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-orange-500" />
                  <span>Assessment Tools</span>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-schedule-interview">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" size="sm" data-testid="button-interview-templates">
                <FileCheck className="w-4 h-4 mr-2" />
                Templates
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Digital Onboarding</span>
            </CardTitle>
            <CardDescription>
              Paperless onboarding with automated workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Pre-boarding</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Digital welcome kits and paperwork completion before Day 1
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">First 90 Days</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Milestone tracking with pulse surveys and manager check-ins
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Onboarding Progress</span>
                <span className="text-sm text-gray-500">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-onboarding-dashboard">
              <UserPlus className="w-4 h-4 mr-2" />
              Onboarding Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Pipeline */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recruitment Pipeline</CardTitle>
          <CardDescription>Current hiring funnel and candidate progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { stage: 'Applications', count: 89, color: 'bg-blue-500' },
              { stage: 'Screening', count: 42, color: 'bg-green-500' },
              { stage: 'Interview', count: 24, color: 'bg-orange-500' },
              { stage: 'Final Round', count: 8, color: 'bg-purple-500' },
              { stage: 'Offers', count: 5, color: 'bg-red-500' }
            ].map((stage, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-12 h-12 ${stage.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold">{stage.count}</span>
                </div>
                <h4 className="font-semibold">{stage.stage}</h4>
                <p className="text-xs text-gray-500 mt-1">Active candidates</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}