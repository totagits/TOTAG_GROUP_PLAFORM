import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  ShoppingCart, 
  Smartphone, 
  Package, 
  Star, 
  FileText, 
  TrendingDown,
  Plus,
  Download,
  Search,
  Upload,
  Clock,
  DollarSign
} from 'lucide-react';

export default function FIMSProcurementPage() {
  const quickActions = [
    { label: 'Create PO', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-procurement/action/create-po' },
    { label: 'Submit Expense', icon: <Smartphone className="w-4 h-4" />, href: '/saas/modules/fims-procurement/action/add-expense' },
    { label: 'Vendor Search', icon: <Search className="w-4 h-4" />, href: '/saas/modules/fims-procurement/action/vendor-search' },
    { label: 'Asset Register', icon: <Package className="w-4 h-4" />, href: '/saas/modules/fims-procurement/action/register-asset' },
    { label: 'Expense Report', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-procurement/reports/expense-summary' },
    { label: 'Vendor Eval', icon: <Star className="w-4 h-4" />, href: '/saas/modules/fims-procurement/data/vendors' }
  ];

  const stats = [
    { label: 'Active POs', value: 45, trend: 'up' as const },
    { label: 'Monthly Spend', value: '$127K', trend: 'down' as const },
    { label: 'Asset Value', value: '$890K', trend: 'up' as const },
    { label: 'Vendor Count', value: 89, trend: 'neutral' as const }
  ];

  return (
    <ModuleLayout
      moduleName="Procurement & Expense Management"
      moduleDescription="Purchase order management, mobile expense tracking, and asset lifecycle management"
      category="FIMS"
      icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Order Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Purchase Orders</span>
            </CardTitle>
            <CardDescription>
              Complete PO lifecycle from requisition to receipt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Active POs</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Open purchase orders
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">45</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Total Value</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Outstanding PO value
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">$247K</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Pending Approval</span>
                <Badge>12 POs</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Awaiting Receipt</span>
                <Badge variant="secondary">28 POs</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Overdue Deliveries</span>
                <Badge variant="destructive">5 POs</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Recent Purchase Orders</h5>
              <div className="space-y-2">
                {[
                  { po: 'PO-2025-001', vendor: 'Office Supplies Ltd', amount: '$2,340', status: 'received' },
                  { po: 'PO-2025-002', vendor: 'Tech Solutions Inc', amount: '$15,670', status: 'pending' },
                  { po: 'PO-2025-003', vendor: 'Catering Services', amount: '$1,890', status: 'approved' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{item.po}</span>
                      <p className="text-gray-500">{item.vendor}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{item.amount}</span>
                      <Badge variant={
                        item.status === 'received' ? 'default' :
                        item.status === 'approved' ? 'secondary' : 'outline'
                      } className="ml-2 text-xs">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/saas/modules/fims-procurement/action/create-po">
              <Button className="w-full" data-testid="button-create-po">
                <Plus className="w-4 h-4 mr-2" />
                Create Purchase Order
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Mobile Expense Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Mobile Expenses</span>
            </CardTitle>
            <CardDescription>
              Mobile-first expense capture and approval workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Receipt Capture</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered receipt scanning and data extraction
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">This Month</span>
                  <Badge>287 receipts</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Expense Reports</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated expense report generation and submission
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Pending Approval</span>
                  <Badge variant="secondary">34 reports</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">$45K</p>
                <p className="text-xs text-gray-500">Monthly Total</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">2.3</p>
                <p className="text-xs text-gray-500">Avg Days</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">96%</p>
                <p className="text-xs text-gray-500">Auto-Match</p>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Expense Categories</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Travel & Meals</span>
                  <span className="text-sm font-semibold text-blue-600">$18.5K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Office Supplies</span>
                  <span className="text-sm font-semibold text-green-600">$12.8K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Software & Tools</span>
                  <span className="text-sm font-semibold text-purple-600">$8.9K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Professional Services</span>
                  <span className="text-sm font-semibold text-orange-600">$4.8K</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Lifecycle Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Asset Management</span>
            </CardTitle>
            <CardDescription>
              Complete asset tracking from acquisition to disposal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span>IT Equipment</span>
                </div>
                <Badge>$450K (156 assets)</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-green-500" />
                  <span>Office Furniture</span>
                </div>
                <Badge variant="secondary">$125K (89 assets)</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-purple-500" />
                  <span>Vehicles</span>
                </div>
                <Badge variant="outline">$285K (12 assets)</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-orange-500" />
                  <span>Machinery</span>
                </div>
                <Badge variant="secondary">$30K (8 assets)</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Asset Health</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Active Assets</span>
                  <span className="text-sm font-semibold text-green-600">265 items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Under Maintenance</span>
                  <span className="text-sm font-semibold text-orange-600">8 items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Depreciation YTD</span>
                  <span className="text-sm font-semibold text-red-600">$67K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Replacement Due</span>
                  <span className="text-sm font-semibold text-blue-600">12 items</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/saas/modules/fims-procurement/action/register-asset">
                <Button variant="outline" size="sm" data-testid="button-asset-register" className="w-full">
                  <Package className="w-4 h-4 mr-2" />
                  Asset Register
                </Button>
              </Link>
              <Link href="/saas/modules/fims-procurement/action/track-assets">
                <Button variant="outline" size="sm" data-testid="button-asset-tracking" className="w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  Track Assets
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Evaluation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Vendor Management</span>
            </CardTitle>
            <CardDescription>
              Vendor performance evaluation and relationship management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Vendor Scoring</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated vendor performance evaluation based on KPIs
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Avg. Score</span>
                  <Badge>4.2/5.0</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Contract Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contract lifecycle tracking and renewal management
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Expiring Soon</span>
                  <Badge variant="destructive">8 contracts</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Top Vendors by Performance</h5>
              <div className="space-y-2">
                {[
                  { vendor: 'Tech Solutions Inc', score: '4.8', spend: '$45K' },
                  { vendor: 'Office Supplies Ltd', score: '4.6', spend: '$32K' },
                  { vendor: 'Catering Services', score: '4.3', spend: '$28K' }
                ].map((vendor, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{vendor.vendor}</span>
                      <div className="flex items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span className="text-gray-500">{vendor.score}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-blue-600">{vendor.spend}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/saas/modules/fims-procurement/action/vendor-evaluation">
              <Button className="w-full" variant="outline" data-testid="button-vendor-evaluation">
                <Star className="w-4 h-4 mr-2" />
                Evaluate Vendors
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Procurement Analytics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Procurement Analytics</CardTitle>
          <CardDescription>Spending insights and procurement performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Spending Analysis */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Spending</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">This Month</span>
                  <span className="font-bold text-blue-600">$127K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">YTD Total</span>
                  <span className="font-bold text-green-600">$890K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">vs. Budget</span>
                  <span className="font-bold text-orange-600">-8.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Savings</span>
                  <span className="font-bold text-green-600">$45K</span>
                </div>
              </div>
            </div>

            {/* Process Efficiency */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">Efficiency</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Avg. PO Cycle Time</span>
                  <span className="font-bold text-green-600">3.2 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Auto-Approval Rate</span>
                  <span className="font-bold text-blue-600">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">On-Time Delivery</span>
                  <span className="font-bold text-purple-600">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Invoice Accuracy</span>
                  <span className="font-bold text-green-600">96.8%</span>
                </div>
              </div>
            </div>

            {/* Vendor Performance */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">Vendors</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Active Vendors</span>
                  <span className="font-bold text-purple-600">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Rating</span>
                  <span className="font-bold text-green-600">4.2/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Top 10 Spend</span>
                  <span className="font-bold text-blue-600">68%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">New Vendors</span>
                  <span className="font-bold text-orange-600">6 this month</span>
                </div>
              </div>
            </div>

            {/* Asset Management */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-900 dark:text-orange-100">Assets</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Assets</span>
                  <span className="font-bold text-orange-600">265</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Asset Value</span>
                  <span className="font-bold text-green-600">$890K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Utilization Rate</span>
                  <span className="font-bold text-blue-600">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Maintenance Due</span>
                  <span className="font-bold text-red-600">8 items</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}