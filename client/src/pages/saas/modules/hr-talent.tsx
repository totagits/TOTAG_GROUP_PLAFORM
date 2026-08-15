import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  GraduationCap, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Users,
  Plus,
  Star,
  Calendar,
  FileText,
  CheckCircle,
  BarChart3,
  Settings,
  Download,
  Eye,
  Brain,
  Lightbulb,
  Rocket,
  Crown,
  Shield
} from 'lucide-react';

export default function HRTalentPage() {
  const quickActions = [
    { label: 'Performance Review', icon: <Star className="w-4 h-4" />, href: '/saas/modules/hr-talent/action/performance-review' },
    { label: 'Learning Paths', icon: <GraduationCap className="w-4 h-4" />, href: '/saas/modules/hr-talent/action/learning-paths' },
    { label: 'Assign Training', icon: <BookOpen className="w-4 h-4" />, href: '/saas/modules/hr-talent/action/assign-training' },
    { label: 'Skills Gap Analysis', icon: <TrendingUp className="w-4 h-4" />, href: '/saas/modules/hr-talent/action/skills-gap-analysis' },
    { label: 'Create Learning Path', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/hr-talent/action/create-learning-path' },
    { label: 'Goal Setting', icon: <Target className="w-4 h-4" />, href: '/saas/modules/hr-talent/action/goal-setting' },
    { label: 'Skills Assessment', icon: <Award className="w-4 h-4" />, href: '/saas/modules/hr-talent/action/skills-assessment' },
    { label: 'Succession Planning', icon: <Users className="w-4 h-4" />, href: '/saas/modules/hr-talent/action/succession-planning' }
  ];

  const stats = [
    { label: 'Performance Reviews', value: 45, trend: 'up' as const },
    { label: 'Learning Paths', value: 28, trend: 'up' as const },
    { label: 'Skills Assessed', value: 156, trend: 'neutral' as const },
    { label: 'Succession Plans', value: 8, trend: 'up' as const }
  ];

  // Data Management Content
  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-blue-600" />
            <span>Performance Management</span>
          </CardTitle>
          <CardDescription>
            Continuous performance tracking and 360-degree reviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Active Reviews</h4>
              <p className="text-2xl font-bold text-blue-600 mt-1">45</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">In progress this quarter</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Completed</h4>
              <p className="text-2xl font-bold text-green-600 mt-1">128</p>
              <p className="text-sm text-green-700 dark:text-green-300">This year so far</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button className="w-full" data-testid="button-start-performance-review">
              <Star className="w-4 h-4 mr-2" />
              Start Performance Review
            </Button>
            <Button variant="outline" className="w-full" data-testid="button-360-feedback">
              <Users className="w-4 h-4 mr-2" />
              360-Degree Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span>Goals & OKRs</span>
          </CardTitle>
          <CardDescription>
            Objectives and key results tracking system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">On Track Goals</span>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">89</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">At Risk Goals</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">12</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Overdue Reviews</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">5</Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full" data-testid="button-set-okrs">
            <Target className="w-4 h-4 mr-2" />
            Set OKRs for Team
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <span>Learning & Development</span>
          </CardTitle>
          <CardDescription>
            Skills development and learning path management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Active Learning Paths</h4>
                <Badge variant="secondary">28 paths</Badge>
              </div>
              <p className="text-sm text-gray-500">Technical skills, leadership, soft skills</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Course Completions</h4>
                <Badge variant="secondary">342 this month</Badge>
              </div>
              <p className="text-sm text-gray-500">Average completion rate: 87%</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-create-learning-path">
            <GraduationCap className="w-4 h-4 mr-2" />
            Create Learning Path
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-orange-600" />
            <span>Skills Matrix</span>
          </CardTitle>
          <CardDescription>
            Comprehensive skills assessment and tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="font-semibold text-red-900 dark:text-red-100">Beginner</p>
              <p className="text-lg font-bold text-red-600">24</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="font-semibold text-yellow-900 dark:text-yellow-100">Intermediate</p>
              <p className="text-lg font-bold text-yellow-600">89</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="font-semibold text-green-900 dark:text-green-100">Expert</p>
              <p className="text-lg font-bold text-green-600">43</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" data-testid="button-skills-assessment">
            <Award className="w-4 h-4 mr-2" />
            Conduct Skills Assessment
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
            <span>Performance Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-performance-trends">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance Trends
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-goal-completion">
            <Target className="w-4 h-4 mr-2" />
            Goal Completion Rates
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-competency-gaps">
            <Brain className="w-4 h-4 mr-2" />
            Competency Gap Analysis
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-learning-roi">
            <GraduationCap className="w-4 h-4 mr-2" />
            Learning ROI Report
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-green-600" />
            <span>Talent Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
            <Rocket className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-semibold">Talent Insights</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              High-potential identification and retention metrics
            </p>
          </div>
          <Button className="w-full" data-testid="button-talent-dashboard">
            <BarChart3 className="w-4 h-4 mr-2" />
            Talent Analytics Dashboard
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-purple-600" />
            <span>Data Export</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-export-performance">
            <FileText className="w-4 h-4 mr-2" />
            Performance Data Export
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-export-skills">
            <Award className="w-4 h-4 mr-2" />
            Skills Matrix Export
          </Button>
          <Button className="w-full" data-testid="button-custom-talent-report">
            <Plus className="w-4 h-4 mr-2" />
            Custom Analytics Report
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
            <span>Performance Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure performance review cycles and criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Review Cycle</p>
                <p className="text-sm text-gray-500">Quarterly reviews with annual summaries</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-configure-review-cycle">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Rating Scale</p>
                <p className="text-sm text-gray-500">1-5 scale with competency mapping</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-configure-rating-scale">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Review Templates</p>
                <p className="text-sm text-gray-500">Role-specific evaluation forms</p>
              </div>
              <Button size="sm" variant="outline" data-testid="button-manage-review-templates">
                Manage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span>Learning Management</span>
          </CardTitle>
          <CardDescription>
            Configure learning paths and skill development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Learning Platforms</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">LinkedIn Learning, Coursera, internal content</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Skill Categories</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">Technical, Leadership, Communication, Domain</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-learning-settings">
            <Settings className="w-4 h-4 mr-2" />
            Learning Platform Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-purple-600" />
            <span>Succession Planning</span>
          </CardTitle>
          <CardDescription>
            Configure leadership pipeline and succession matrices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Key Positions</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">C-level, directors, critical technical roles</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">High Potentials</h4>
              <p className="text-sm text-green-700 dark:text-green-300">Identified successors and development plans</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-succession-planning">
            <Crown className="w-4 h-4 mr-2" />
            Succession Matrix Configuration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Access & Privacy</span>
          </CardTitle>
          <CardDescription>
            Manage performance data access and confidentiality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100">HR Administrator</h4>
              <p className="text-sm text-red-700 dark:text-red-300">Full access to all performance data</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Manager</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Direct reports and team analytics</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Employee</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">Personal performance and development data</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-privacy-settings">
            <Shield className="w-4 h-4 mr-2" />
            Privacy & Access Control
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Talent Management"
      moduleDescription="Advanced performance management, learning & development, skills assessment, and succession planning"
      category="HRMIS"
      icon={<Award className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
      dataContent={dataContent}
      reportsContent={reportsContent}
      settingsContent={settingsContent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Performance Management</span>
            </CardTitle>
            <CardDescription>
              Continuous feedback and 360-degree reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">OKRs</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Objectives & Key Results with real-time tracking
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">360 Reviews</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Multi-source feedback from peers and managers
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Due Reviews</span>
                <Badge variant="destructive">12 Overdue</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">In Progress</span>
                <Badge>33 Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Completed</span>
                <Badge variant="secondary">89 Done</Badge>
              </div>
            </div>
            <Button className="w-full" data-testid="button-performance-reviews">
              <Star className="w-4 h-4 mr-2" />
              Manage Reviews
            </Button>
          </CardContent>
        </Card>

        {/* Learning & Development */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span>Learning Management</span>
            </CardTitle>
            <CardDescription>
              Personalized learning paths and skill development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">AI-Powered Paths</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personalized learning recommendations based on role and career goals
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Microlearning</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mobile-friendly bite-sized content for continuous learning
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">28</p>
                <p className="text-xs text-gray-500">Active Paths</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">156</p>
                <p className="text-xs text-gray-500">Enrolled</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">89%</p>
                <p className="text-xs text-gray-500">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Matrix & Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Skills Matrix</span>
            </CardTitle>
            <CardDescription>
              Competency tracking and gap analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Technical Skills</span>
                </div>
                <Badge>85% Mapped</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-blue-500" />
                  <span>Soft Skills</span>
                </div>
                <Badge variant="secondary">78% Mapped</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-orange-500" />
                  <span>Certifications</span>
                </div>
                <Badge variant="outline">24 Active</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-skills-assessment">
                <Award className="w-4 h-4 mr-2" />
                Assess Skills
              </Button>
              <Button variant="outline" size="sm" data-testid="button-skills-matrix">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Matrix
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Succession Planning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Succession Planning</span>
            </CardTitle>
            <CardDescription>
              Leadership pipeline and career development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Leadership Pipeline</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Identify and develop future leaders across key positions
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Career Mobility</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Internal promotion pathways and skill-based opportunities
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ready Now</span>
                <span className="text-sm font-semibold text-green-600">8 candidates</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Ready in 1-2 years</span>
                <span className="text-sm font-semibold text-blue-600">15 candidates</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Development needed</span>
                <span className="text-sm font-semibold text-orange-600">22 candidates</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-succession-planning">
              <Users className="w-4 h-4 mr-2" />
              View Succession Plans
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Talent Analytics Dashboard */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Talent Analytics</CardTitle>
          <CardDescription>Performance trends and development insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Performance Distribution */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-3">Performance Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Exceeds Expectations</span>
                  <span className="text-sm font-semibold text-green-600">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Meets Expectations</span>
                  <span className="text-sm font-semibold text-blue-600">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Needs Improvement</span>
                  <span className="text-sm font-semibold text-orange-600">10%</span>
                </div>
              </div>
            </div>

            {/* Learning Engagement */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-3">Learning Engagement</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Learners</span>
                  <span className="text-sm font-semibold text-green-600">89%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Course Completion</span>
                  <span className="text-sm font-semibold text-blue-600">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Certification Rate</span>
                  <span className="text-sm font-semibold text-purple-600">45%</span>
                </div>
              </div>
            </div>

            {/* Career Progression */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-3">Career Progression</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Internal Promotions</span>
                  <span className="text-sm font-semibold text-green-600">12 YTD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Career Moves</span>
                  <span className="text-sm font-semibold text-blue-600">18 YTD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Retention Rate</span>
                  <span className="text-sm font-semibold text-purple-600">92%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}