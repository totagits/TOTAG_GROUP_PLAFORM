import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  FileText, 
  FolderOpen, 
  PenTool,
  Plus,
  Download,
  Settings,
  CheckCircle,
  BarChart3,
  Clock,
  Shield,
  Search,
  Archive,
  Upload,
  Eye,
  Lock,
  FileCheck
} from 'lucide-react';

export default function DocumentManagementPage() {
  const quickActions = [
    { label: 'Upload Document', icon: <Upload className="w-4 h-4" />, href: '/saas/modules/hr-documents/action/upload' },
    { label: 'Generate Letter', icon: <FileText className="w-4 h-4" />, href: '/saas/modules/hr-documents/action/generate-letter' },
    { label: 'Request Signature', icon: <PenTool className="w-4 h-4" />, href: '/saas/modules/hr-documents/action/request-signature' },
    { label: 'Search Documents', icon: <Search className="w-4 h-4" />, href: '/saas/modules/hr-documents/action/search' },
    { label: 'My Documents', icon: <FolderOpen className="w-4 h-4" />, href: '/saas/modules/hr-documents/action/my-documents' },
    { label: 'Pending Signatures', icon: <PenTool className="w-4 h-4" />, href: '/saas/modules/hr-documents/action/pending-signatures' },
    { label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/hr-documents/action/reports' }
  ];

  const stats = [
    { label: 'Total Documents', value: '2,456', trend: 'up' as const },
    { label: 'Pending Signatures', value: 12, trend: 'neutral' as const },
    { label: 'This Month', value: 89, trend: 'up' as const },
    { label: 'Storage Used', value: '4.2 GB', trend: 'neutral' as const }
  ];

  const dataContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <span>Document Repository</span>
          </CardTitle>
          <CardDescription>
            Centralized storage for all HR documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Employee Files</h4>
                <Badge className="bg-blue-100 text-blue-800">1,248</Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Personal documents</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Policies</h4>
                <Badge className="bg-green-100 text-green-800">156</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Company policies</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-documents/data/employee-files">
              <Button className="w-full">
                <FolderOpen className="w-4 h-4 mr-2" />
                Employee Files
              </Button>
            </Link>
            <Link href="/saas/modules/hr-documents/data/policy-library">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Policy Library
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Letter Templates</span>
          </CardTitle>
          <CardDescription>
            Generate templated letters and contracts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-purple-900 dark:text-purple-100">Offer Letters</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">Employment offers</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">5 Templates</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">Contracts</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Employment contracts</p>
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700">8 Templates</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-documents/data/templates">
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Manage Templates
              </Button>
            </Link>
            <Link href="/saas/modules/hr-documents/data/generated-letters">
              <Button variant="outline" className="w-full">
                <Archive className="w-4 h-4 mr-2" />
                Generated Letters
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PenTool className="w-5 h-5 text-green-600" />
            <span>E-Signature</span>
          </CardTitle>
          <CardDescription>
            Digital signatures and document signing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Pending</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">12 docs</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-900 dark:text-green-100">Signed</p>
              <p className="text-xs text-green-700 dark:text-green-300">234 docs</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <Clock className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-red-900 dark:text-red-100">Expired</p>
              <p className="text-xs text-red-700 dark:text-red-300">3 docs</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-documents/data/signature-requests">
              <Button className="w-full">
                <PenTool className="w-4 h-4 mr-2" />
                Signature Requests
              </Button>
            </Link>
            <Link href="/saas/modules/hr-documents/data/signed-documents">
              <Button variant="outline" className="w-full">
                <FileCheck className="w-4 h-4 mr-2" />
                Signed Documents
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <span>Policy Acknowledgements</span>
          </CardTitle>
          <CardDescription>
            Track policy reviews and acknowledgements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">Code of Conduct</p>
                <p className="text-sm text-green-700 dark:text-green-300">98% acknowledged</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Complete</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">IT Security Policy</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">85% acknowledged</p>
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">In Progress</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Link href="/saas/modules/hr-documents/data/acknowledgements">
              <Button className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                View Acknowledgements
              </Button>
            </Link>
            <Link href="/saas/modules/hr-documents/data/pending-reviews">
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Pending Reviews
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
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <span>Document Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-documents/reports/document-inventory">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Document Inventory
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/reports/expiring-documents">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Expiring Documents
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/reports/missing-documents">
            <Button variant="outline" className="w-full justify-start">
              <Search className="w-4 h-4 mr-2" />
              Missing Documents
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <PenTool className="w-5 h-5 text-green-600" />
            <span>Signature Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-documents/reports/signature-status">
            <Button variant="outline" className="w-full justify-start">
              <PenTool className="w-4 h-4 mr-2" />
              Signature Status
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/reports/pending-signatures">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Pending Signatures
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/reports/signature-audit">
            <Button variant="outline" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              Signature Audit Trail
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <span>Compliance Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-documents/reports/policy-compliance">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Policy Compliance
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/reports/acknowledgement-status">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="w-4 h-4 mr-2" />
              Acknowledgement Status
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/reports/retention-report">
            <Button variant="outline" className="w-full justify-start">
              <Archive className="w-4 h-4 mr-2" />
              Retention Report
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
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <span>Document Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-documents/settings/document-categories">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Document Categories
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/settings/retention-policies">
            <Button variant="outline" className="w-full justify-start">
              <Archive className="w-4 h-4 mr-2" />
              Retention Policies
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/settings/access-controls">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="w-4 h-4 mr-2" />
              Access Controls
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/settings/storage-settings">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Storage Settings
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Template Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/saas/modules/hr-documents/settings/template-categories">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Template Categories
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/settings/merge-fields">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Merge Fields
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/settings/signature-settings">
            <Button variant="outline" className="w-full justify-start">
              <PenTool className="w-4 h-4 mr-2" />
              Signature Settings
            </Button>
          </Link>
          <Link href="/saas/modules/hr-documents/settings/notification-rules">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Notification Rules
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModuleLayout
      moduleName="Document Management"
      moduleDescription="Document repository, letter templates, e-signatures, and policy acknowledgements"
      category="HRMIS"
      icon={<FileText className="w-6 h-6 text-blue-600" />}
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
