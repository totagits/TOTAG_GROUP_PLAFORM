import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  GraduationCap, 
  BookOpen, 
  Award,
  Users, 
  Plus,
  Download,
  Settings,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Calendar,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Video,
  FileQuestion,
  Star
} from 'lucide-react';

export default function LearningManagementPage() {
  const quickActions = [
    { label: 'Browse Courses', icon: <BookOpen className="w-4 h-4" />, href: '/saas/modules/hr-learning/action/browse-courses' },
    { label: 'My Learning', icon: <GraduationCap className="w-4 h-4" />, href: '/saas/modules/hr-learning/action/my-learning' },
    { label: 'Assign Training', icon: <Users className="w-4 h-4" />, href: '/saas/modules/hr-learning/action/assign-training' },
    { label: 'Create Course', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/hr-learning/action/create-course' },
    { label: 'Certifications', icon: <Award className="w-4 h-4" />, href: '/saas/modules/hr-learning/action/certifications' },
    { label: 'Compliance Training', icon: <CheckCircle className="w-4 h-4" />, href: '/saas/modules/hr-learning/action/compliance-training' },
    { label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/hr-learning/action/reports' }
  ];

  const stats = [
    { label: 'Active Courses', value: 45, trend: 'up' as const },
    { label: 'Completions MTD', value: 234, trend: 'up' as const },
    { label: 'Overdue Training', value: 12, trend: 'down' as const },
    { label: 'Certifications', value: 89, trend: 'neutral' as const }
  ];

  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Course Catalog</span>
          </CardTitle>
          <CardDescription>
            Manage training courses and learning paths
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Published</h4>
                <Badge className="bg-blue-100 text-blue-800">45 Courses</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Available for enrollment</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Draft</h4>
                <Badge variant="outline" className="border-yellow-300 text-yellow-700">8 Courses</Badge>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">In development</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-learning/data/courses">
              <Button className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Courses
              </Button>
            </Link>
            <Link href="/saas/modules/hr-learning/data/learning-paths">
              <Button variant="outline" className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Learning Paths
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <span>Certifications</span>
          </CardTitle>
          <CardDescription>
            Track certifications and renewals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Valid</h4>
                <Badge className="bg-green-100 text-green-800">89</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Active certifications</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-red-900 dark:text-red-100">Expiring</h4>
                <Badge variant="outline" className="border-red-300 text-red-700">15</Badge>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">Within 30 days</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-learning/data/certifications">
              <Button className="w-full">
                <Award className="w-4 h-4 mr-2" />
                View Certifications
              </Button>
            </Link>
            <Link href="/saas/modules/hr-learning/data/renewals">
              <Button variant="outline" className="w-full">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Pending Renewals
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Compliance Training</span>
          </CardTitle>
          <CardDescription>
            Mandatory training and compliance tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">Safety Training</p>
                <p className="text-sm text-green-700 dark:text-green-300">98% complete</p>
              </div>
              <Badge className="bg-green-100 text-green-800">On Track</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Data Privacy</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">85% complete</p>
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">Attention</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">Anti-Harassment</p>
                <p className="text-sm text-red-700 dark:text-red-300">72% complete</p>
              </div>
              <Badge className="bg-red-100 text-red-800">Overdue</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-learning/data/compliance-status">
              <Button className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Compliance Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-purple-600" />
            <span>Learning Content</span>
          </CardTitle>
          <CardDescription>
            Manage learning materials and resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <Video className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Videos</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">124 files</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Documents</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">89 files</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <FileQuestion className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-900 dark:text-green-100">Quizzes</p>
              <p className="text-xs text-green-700 dark:text-green-300">45 tests</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-learning/data/content-library">
              <Button className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Content Library
              </Button>
            </Link>
            <Link href="/saas/modules/hr-learning/data/assessments">
              <Button variant="outline" className="w-full">
                <FileQuestion className="w-4 h-4 mr-2" />
                Manage Assessments
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
            <span>Training Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-learning/reports/training-completion">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completion Report
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/reports/training-hours">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Training Hours
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/reports/enrollment-status">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Enrollment Status
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <span>Certification Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-learning/reports/certification-status">
            <Button variant="outline" className="w-full justify-start">
              <Award className="w-4 h-4 mr-2" />
              Certification Status
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/reports/expiry-forecast">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Expiry Forecast
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/reports/skills-matrix">
            <Button variant="outline" className="w-full justify-start">
              <Target className="w-4 h-4 mr-2" />
              Skills Matrix
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-learning/reports/learning-effectiveness">
            <Button variant="outline" className="w-full justify-start">
              <Star className="w-4 h-4 mr-2" />
              Learning Effectiveness
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/reports/course-ratings">
            <Button variant="outline" className="w-full justify-start">
              <Trophy className="w-4 h-4 mr-2" />
              Course Ratings
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/reports/roi-analysis">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              ROI Analysis
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
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Course Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-learning/settings/course-categories">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Course Categories
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/settings/completion-rules">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completion Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/settings/notification-rules">
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Notification Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/settings/enrollment-rules">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Enrollment Rules
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <span>Certification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-learning/settings/certification-types">
            <Button variant="outline" className="w-full justify-start">
              <Award className="w-4 h-4 mr-2" />
              Certification Types
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/settings/renewal-rules">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Renewal Rules
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/settings/compliance-requirements">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="w-4 h-4 mr-2" />
              Compliance Requirements
            </Button>
          </Link>
          <Link href="/saas/modules/hr-learning/settings/badge-templates">
            <Button variant="outline" className="w-full justify-start">
              <Trophy className="w-4 h-4 mr-2" />
              Badge Templates
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Learning Management System"
      moduleDescription="Course catalog, certifications, compliance training, and skills development"
      category="HRMIS"
      icon={<GraduationCap className="w-6 h-6 text-purple-600" />}
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
