import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Globe, 
  Bell, 
  Shield, 
  Clock, 
  TrendingUp,
  Plus,
  Download,
  Send,
  Users,
  CreditCard,
  BarChart3
} from 'lucide-react';

export default function FIMSAccountsReceivablePage() {
  const quickActions = [
    { label: 'Create Invoice', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-accounts-receivable/action/new-invoice' },
    { label: 'Send Statement', icon: <Send className="w-4 h-4" />, href: '/saas/modules/fims-accounts-receivable/action/send-statement' },
    { label: 'Record Payment', icon: <CreditCard className="w-4 h-4" />, href: '/saas/modules/fims-accounts-receivable/action/record-payment' },
    { label: 'Customer Lookup', icon: <Users className="w-4 h-4" />, href: '/saas/modules/fims-accounts-receivable/data/customers' },
    { label: 'Dunning Process', icon: <Bell className="w-4 h-4" />, href: '/saas/modules/fims-accounts-receivable/action/dunning' },
    { label: 'AR Aging Report', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-accounts-receivable/reports/aging' }
  ];

  const stats = [
    { label: 'Outstanding AR', value: '$385K', trend: 'up' as const },
    { label: 'Overdue Invoices', value: 34, trend: 'down' as const },
    { label: 'Collection Rate', value: '94%', trend: 'up' as const },
    { label: 'Active Customers', value: 287, trend: 'up' as const }
  ];

  return (
    <ModuleLayout
      moduleName="Accounts Receivable"
      moduleDescription="AR invoicing, online payment portal, automated dunning, and customer credit management"
      category="FIMS"
      icon={<Receipt className="w-6 h-6 text-blue-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AR Invoicing & Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Invoicing & Billing</span>
            </CardTitle>
            <CardDescription>
              Automated invoice generation and billing management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">This Month</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Invoices generated and sent
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">247</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Total Value</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Invoice amount this month
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">$582K</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Draft Invoices</span>
                <Badge>12 pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Sent Today</span>
                <Badge variant="secondary">18 invoices</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Recurring Billing</span>
                <Badge variant="outline">89 active</Badge>
              </div>
            </div>
            <Button className="w-full" data-testid="button-create-invoice">
              <Receipt className="w-4 h-4 mr-2" />
              Create New Invoice
            </Button>
          </CardContent>
        </Card>

        {/* Online Payment Portal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Payment Portal</span>
            </CardTitle>
            <CardDescription>
              Customer self-service payment platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Online Payments</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Secure payment gateway with multiple payment methods
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">This Month</span>
                  <Badge>$289K collected</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Customer Portal</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Self-service account management and payment history
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Active Users</span>
                  <Badge variant="secondary">189 customers</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">78%</p>
                <p className="text-xs text-gray-500">Online Adoption</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">2.1</p>
                <p className="text-xs text-gray-500">Avg Days to Pay</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">94%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automated Dunning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Automated Dunning</span>
            </CardTitle>
            <CardDescription>
              Smart collection workflows and communication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>First Notice (15 days)</span>
                </div>
                <Badge>12 sent</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-orange-500" />
                  <span>Second Notice (30 days)</span>
                </div>
                <Badge variant="secondary">8 sent</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-red-500" />
                  <span>Final Notice (45 days)</span>
                </div>
                <Badge variant="destructive">3 sent</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span>Collections Agency</span>
                </div>
                <Badge variant="outline">1 referred</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Dunning Effectiveness</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Response Rate</span>
                  <span className="text-sm font-semibold text-green-600">67%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Payment Rate</span>
                  <span className="text-sm font-semibold text-blue-600">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Collection Time</span>
                  <span className="text-sm font-semibold text-purple-600">18 days</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" data-testid="button-dunning-setup">
                <Bell className="w-4 h-4 mr-2" />
                Setup Rules
              </Button>
              <Button variant="outline" size="sm" data-testid="button-dunning-reports">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customer Credit Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Credit Management</span>
            </CardTitle>
            <CardDescription>
              Customer creditworthiness and risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Credit Limits</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated credit limit management and monitoring
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">Total Credit Extended</span>
                  <Badge>$1.2M</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Risk Assessment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered credit risk scoring and alerts
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">High Risk Customers</span>
                  <Badge variant="destructive">8 accounts</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. Credit Limit</span>
                <span className="text-sm font-semibold text-blue-600">$4,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Credit Utilization</span>
                <span className="text-sm font-semibold text-green-600">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Default Rate</span>
                <span className="text-sm font-semibold text-orange-600">2.1%</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-credit-management">
              <Shield className="w-4 h-4 mr-2" />
              Manage Credit Limits
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AR Analytics Dashboard */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Accounts Receivable Analytics</CardTitle>
          <CardDescription>Collection performance and customer insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Aging Analysis */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">AR Aging</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Current (0-30)</span>
                  <span className="font-bold text-green-600">$285K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">31-60 Days</span>
                  <span className="font-bold text-blue-600">$78K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">61-90 Days</span>
                  <span className="font-bold text-orange-600">$22K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Over 90 Days</span>
                  <span className="font-bold text-red-600">$8K</span>
                </div>
              </div>
            </div>

            {/* Collection Performance */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">Collections</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Collection Rate</span>
                  <span className="font-bold text-green-600">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Days to Pay</span>
                  <span className="font-bold text-blue-600">28 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bad Debt Rate</span>
                  <span className="font-bold text-orange-600">1.8%</span>
                </div>
              </div>
            </div>

            {/* Customer Insights */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">Customers</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Top 10 Customers</span>
                  <span className="font-bold text-purple-600">68% of AR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">New Customers</span>
                  <span className="font-bold text-green-600">15 this month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Credit Risk</span>
                  <span className="font-bold text-orange-600">8 high risk</span>
                </div>
              </div>
            </div>

            {/* Payment Trends */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-900 dark:text-orange-100">Payment Trends</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Online Payments</span>
                  <span className="font-bold text-green-600">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Early Payment Disc.</span>
                  <span className="font-bold text-blue-600">$12K saved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Payment Methods</span>
                  <span className="font-bold text-purple-600">6 active</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}