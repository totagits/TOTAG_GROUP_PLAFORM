import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Package,
  Building2,
  Truck,
  Monitor,
  Wrench,
  Plus,
  Download,
  Settings,
  BarChart3,
  Calendar,
  MapPin,
  QrCode,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  Search,
  FileText
} from 'lucide-react';

export default function FIMSFixedAssetsPage() {
  const quickActions = [
    { label: 'Add Asset', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-fixed-assets/action/add-asset' },
    { label: 'Asset Transfer', icon: <Truck className="w-4 h-4" />, href: '/saas/modules/fims-fixed-assets/action/transfer' },
    { label: 'Run Depreciation', icon: <TrendingDown className="w-4 h-4" />, href: '/saas/modules/fims-fixed-assets/action/run-depreciation' },
    { label: 'Physical Verification', icon: <QrCode className="w-4 h-4" />, href: '/saas/modules/fims-fixed-assets/action/physical-verification' },
    { label: 'Asset Register', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-fixed-assets/reports/register' },
    { label: 'Disposal Request', icon: <FileText className="w-4 h-4" />, href: '/saas/modules/fims-fixed-assets/action/disposal' }
  ];

  const stats = [
    { label: 'Total Assets', value: 1247, trend: 'up' as const },
    { label: 'Net Book Value', value: '$4.2M', trend: 'down' as const },
    { label: 'MTD Depreciation', value: '$85K', trend: 'neutral' as const },
    { label: 'Pending Verification', value: 45, trend: 'neutral' as const }
  ];

  const assetCategories = [
    { name: 'Land & Buildings', icon: <Building2 className="w-5 h-5" />, count: 12, value: '$2.8M', depreciation: '$15K/mo' },
    { name: 'Vehicles & Fleet', icon: <Truck className="w-5 h-5" />, count: 35, value: '$650K', depreciation: '$18K/mo' },
    { name: 'IT Equipment', icon: <Monitor className="w-5 h-5" />, count: 456, value: '$380K', depreciation: '$32K/mo' },
    { name: 'Machinery & Equipment', icon: <Wrench className="w-5 h-5" />, count: 89, value: '$420K', depreciation: '$12K/mo' },
    { name: 'Furniture & Fixtures', icon: <Package className="w-5 h-5" />, count: 655, value: '$95K', depreciation: '$8K/mo' },
  ];

  const recentAssets = [
    { id: 'AST-2025-0089', name: 'Dell PowerEdge Server', category: 'IT Equipment', location: 'HQ Data Center', value: '$12,500', status: 'Active' },
    { id: 'AST-2025-0088', name: 'Toyota Land Cruiser', category: 'Vehicles', location: 'Field Operations', value: '$45,000', status: 'Active' },
    { id: 'AST-2025-0087', name: 'Office Furniture Set', category: 'Furniture', location: 'Branch Office', value: '$3,200', status: 'Active' },
    { id: 'AST-2025-0086', name: 'Generator 50KVA', category: 'Equipment', location: 'HQ Building', value: '$18,000', status: 'Active' },
  ];

  return (
    <ModuleLayout
      moduleName="Fixed Assets Management"
      moduleDescription="Asset register, depreciation, lifecycle tracking, physical verification, and disposal management"
      category="FIMS"
      icon={<Package className="w-6 h-6 text-teal-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-teal-600" />
              <span>Asset Categories</span>
            </CardTitle>
            <CardDescription>
              Assets by category with values and depreciation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {assetCategories.map((cat, i) => (
              <div key={i} className="p-4 border rounded-lg hover:border-teal-400 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600">
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{cat.name}</h4>
                      <p className="text-sm text-gray-500">{cat.count} assets</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{cat.value}</p>
                    <p className="text-xs text-gray-500">{cat.depreciation}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <Link href="/saas/modules/fims-fixed-assets/data/assets">
              <Button variant="outline" className="w-full mt-2">
                <Search className="w-4 h-4 mr-2" /> Browse All Assets
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <span>Depreciation Summary</span>
            </CardTitle>
            <CardDescription>
              Monthly depreciation and net book value trends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-500">Gross Value</p>
                <p className="text-2xl font-bold text-blue-600">$6.8M</p>
                <p className="text-xs text-gray-500 mt-1">Original cost basis</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-500">Net Book Value</p>
                <p className="text-2xl font-bold text-green-600">$4.2M</p>
                <p className="text-xs text-gray-500 mt-1">After depreciation</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-3">Depreciation by Method</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Straight Line</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">892 assets</Badge>
                    <span className="font-semibold">$65K/mo</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Declining Balance</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">355 assets</Badge>
                    <span className="font-semibold">$20K/mo</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link href="/saas/modules/fims-fixed-assets/action/run-depreciation">
                <Button className="flex-1"><TrendingDown className="w-4 h-4 mr-2" /> Run Depreciation</Button>
              </Link>
              <Link href="/saas/modules/fims-fixed-assets/reports/depreciation">
                <Button variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" /> Report</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Recently Added Assets</span>
            </CardTitle>
            <CardDescription>
              Latest acquisitions and capitalizations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAssets.map((asset) => (
              <div key={asset.id} className="p-3 border rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-purple-600">{asset.id}</span>
                    <h4 className="font-medium">{asset.name}</h4>
                    <p className="text-sm text-gray-500">{asset.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{asset.value}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" /> {asset.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 mt-4">
              <Link href="/saas/modules/fims-fixed-assets/data/assets">
                <Button variant="outline" className="flex-1">View All</Button>
              </Link>
              <Link href="/saas/modules/fims-fixed-assets/action/add-asset">
                <Button className="flex-1"><Plus className="w-4 h-4 mr-2" /> Add Asset</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-orange-600" />
              <span>Physical Verification</span>
            </CardTitle>
            <CardDescription>
              Asset tagging, verification, and audit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100">Verification Due</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    45 assets pending annual physical verification. Last verification: 6 months ago.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <p className="text-lg font-bold text-green-600">1,202</p>
                <p className="text-xs text-gray-500">Verified</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <AlertTriangle className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
                <p className="text-lg font-bold text-yellow-600">45</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm">QR/Barcode Tagging</span>
                <Badge className="bg-green-600">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm">GPS Tracking</span>
                <Badge variant="outline">Vehicles Only</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm">Mobile App Scanning</span>
                <Badge className="bg-green-600">Active</Badge>
              </div>
            </div>
            
            <Link href="/saas/modules/fims-fixed-assets/action/physical-verification">
              <Button className="w-full">
                <QrCode className="w-4 h-4 mr-2" /> Start Verification
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}
