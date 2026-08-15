import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Brain, 
  CheckCircle, 
  Users, 
  Calendar, 
  TrendingDown,
  Plus,
  Download,
  Search,
  Upload,
  FileCheck,
  Clock
} from 'lucide-react';

export default function FIMSAccountsPayablePage() {
  const quickActions = [
    { label: 'New Invoice', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-accounts-payable/action/new-invoice' },
    { label: 'Process Payments', icon: <CreditCard className="w-4 h-4" />, href: '/saas/modules/fims-accounts-payable/action/process-payments' },
    { label: 'Vendor Search', icon: <Search className="w-4 h-4" />, href: '/saas/modules/fims-accounts-payable/data/vendors' },
    { label: 'Upload Bills', icon: <Upload className="w-4 h-4" />, href: '/saas/modules/fims-accounts-payable/action/upload-bills' },
    { label: '3-Way Match', icon: <FileCheck className="w-4 h-4" />, href: '/saas/modules/fims-accounts-payable/action/three-way-match' },
    { label: 'Payment Report', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-accounts-payable/reports/payments' }
  ];

  const stats = [
    { label: 'Outstanding Invoices', value: 89, trend: 'down' as const },
    { label: 'Total Payables', value: '$247K', trend: 'up' as const },
    { label: 'Payment Queue', value: 23, trend: 'down' as const },
    { label: 'Active Vendors', value: 156, trend: 'up' as const }
  ];

  return (
    <ModuleLayout
      moduleName="Accounts Payable"
      moduleDescription="AI invoice processing, 3-way matching, automated payments, and vendor management"
      category="FIMS"
      icon={<CreditCard className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Invoice Processing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Invoice Processing</span>
            </CardTitle>
            <CardDescription>
              Automated invoice capture and data extraction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">OCR Accuracy</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Smart data extraction from invoices
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">98.5%</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Auto-Approval</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Invoices processed without manual review
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">76%</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Processed Today</span>
                <Badge>24 invoices</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Pending Review</span>
                <Badge variant="secondary">8 invoices</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Failed Processing</span>
                <Badge variant="destructive">2 invoices</Badge>
              </div>
            </div>
            <Button className="w-full" data-testid="button-ai-processing">
              <Brain className="w-4 h-4 mr-2" />
              AI Processing Queue
            </Button>
          </CardContent>
        </Card>

        {/* 3-Way Matching */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5" />
              <span>3-Way Matching</span>
            </CardTitle>
            <CardDescription>
              Automated matching of PO, receipt, and invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Perfect Matches</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invoices with exact PO and receipt alignment
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Auto-approved</span>
                  <Badge>67 invoices</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Exceptions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Variances requiring manual review and approval
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Needs attention</span>
                  <Badge variant="destructive">8 exceptions</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">89%</p>
                <p className="text-xs text-gray-500">Match Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">75</p>
                <p className="text-xs text-gray-500">Total Matches</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">8</p>
                <p className="text-xs text-gray-500">Exceptions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Vendor Management</span>
            </CardTitle>
            <CardDescription>
              Comprehensive vendor profiles and relationship tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Active Vendors</span>
                </div>
                <Badge>156 vendors</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>Pending Approval</span>
                </div>
                <Badge variant="secondary">12 vendors</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span>Top Vendors (by Volume)</span>
                </div>
                <Badge variant="outline">View List</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Top Vendors This Month</h5>
              <div className="space-y-2">
                {[
                  { name: 'Office Supplies Ltd', amount: '$15,240' },
                  { name: 'Tech Solutions Inc', amount: '$12,850' },
                  { name: 'Catering Services', amount: '$8,920' }
                ].map((vendor, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{vendor.name}</span>
                    <span className="font-semibold text-blue-600">{vendor.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-add-vendor">
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
              </Button>
              <Button variant="outline" size="sm" data-testid="button-vendor-list">
                <Users className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Processing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Processing</span>
            </CardTitle>
            <CardDescription>
              Automated payment scheduling and cash flow optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Queue</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scheduled payments optimized for cash flow and early payment discounts
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Due This Week</span>
                  <Badge>23 payments</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Early Payment Discounts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Available discounts for early settlement of vendor invoices
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Potential Savings</span>
                  <Badge variant="secondary">$2,340</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total in Queue</span>
                <span className="text-sm font-semibold text-blue-600">$187,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Overdue Invoices</span>
                <span className="text-sm font-semibold text-red-600">$8,920</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Available Discounts</span>
                <span className="text-sm font-semibold text-green-600">$2,340</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-payment-queue">
              <Calendar className="w-4 h-4 mr-2" />
              Manage Payment Queue
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AP Dashboard */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Accounts Payable Overview</CardTitle>
          <CardDescription>Key metrics and aging analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Aging Analysis */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Aging Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Current (0-30)</span>
                  <span className="font-bold text-green-600">$189K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">31-60 Days</span>
                  <span className="font-bold text-blue-600">$45K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">61-90 Days</span>
                  <span className="font-bold text-orange-600">$13K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Over 90 Days</span>
                  <span className="font-bold text-red-600">$2K</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">Payment Methods</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">ACH/Wire</span>
                  <span className="font-bold text-green-600">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Check</span>
                  <span className="font-bold text-blue-600">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Credit Card</span>
                  <span className="font-bold text-purple-600">7%</span>
                </div>
              </div>
            </div>

            {/* Processing Metrics */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">Processing</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Processing Time</span>
                  <span className="font-bold text-purple-600">2.3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Auto-Approval Rate</span>
                  <span className="font-bold text-green-600">76%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Exception Rate</span>
                  <span className="font-bold text-orange-600">11%</span>
                </div>
              </div>
            </div>

            {/* Cost Savings */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-900 dark:text-orange-100">Savings</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Early Pay Discounts</span>
                  <span className="font-bold text-green-600">$15K YTD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Process Efficiency</span>
                  <span className="font-bold text-blue-600">67% faster</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Manual Reduction</span>
                  <span className="font-bold text-purple-600">85% less</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}