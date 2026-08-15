import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  FileText,
  Plus,
  Download,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  ShoppingCart,
  Clock,
  XCircle,
  ArrowRight
} from 'lucide-react';

export default function FIMSCommitmentControlPage() {
  const quickActions = [
    { label: 'Create Commitment', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-commitment-control/action/create-commitment' },
    { label: 'Reserve Budget', icon: <Lock className="w-4 h-4" />, href: '/saas/modules/fims-commitment-control/action/reserve-budget' },
    { label: 'Release Funds', icon: <Unlock className="w-4 h-4" />, href: '/saas/modules/fims-commitment-control/action/release-funds' },
    { label: 'Check Availability', icon: <CheckCircle2 className="w-4 h-4" />, href: '/saas/modules/fims-commitment-control/action/check-availability' },
    { label: 'Commitment Report', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-commitment-control/reports/commitments' },
    { label: 'Overspend Alerts', icon: <AlertTriangle className="w-4 h-4" />, href: '/saas/modules/fims-commitment-control/reports/overspend-alerts' }
  ];

  const stats = [
    { label: 'Total Budget', value: '$5.2M', trend: 'neutral' as const },
    { label: 'Committed', value: '$3.8M', trend: 'up' as const },
    { label: 'Available', value: '$1.4M', trend: 'down' as const },
    { label: 'Pending Approval', value: 12, trend: 'neutral' as const }
  ];

  const commitments = [
    { id: 'CMT-2025-001', description: 'Office Equipment Purchase', budgetLine: 'Capital Expenditure', amount: '$45,000', stage: 'PO Issued', status: 'Active' },
    { id: 'CMT-2025-002', description: 'IT Consulting Services', budgetLine: 'Professional Services', amount: '$120,000', stage: 'Contract Signed', status: 'Active' },
    { id: 'CMT-2025-003', description: 'Vehicle Fleet Maintenance', budgetLine: 'Operating Expenses', amount: '$28,500', stage: 'Invoice Received', status: 'Pending Payment' },
    { id: 'CMT-2025-004', description: 'Training Program Q1', budgetLine: 'Staff Development', amount: '$15,000', stage: 'Requisition', status: 'Pending Approval' },
  ];

  const budgetLines = [
    { name: 'Salaries & Wages', budget: 2500000, committed: 2100000, actual: 1850000 },
    { name: 'Operating Expenses', budget: 850000, committed: 620000, actual: 480000 },
    { name: 'Capital Expenditure', budget: 1200000, committed: 780000, actual: 350000 },
    { name: 'Professional Services', budget: 450000, committed: 280000, actual: 150000 },
    { name: 'Travel & Subsistence', budget: 200000, committed: 85000, actual: 62000 },
  ];

  return (
    <ModuleLayout
      moduleName="Commitment Control"
      moduleDescription="Budget reservation, funds control, and commitment lifecycle management with real-time availability checks"
      category="FIMS"
      icon={<Lock className="w-6 h-6 text-purple-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Budget Execution Summary</span>
            </CardTitle>
            <CardDescription>
              Real-time budget vs commitments vs actuals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Budget</p>
                <p className="text-lg font-bold text-blue-600">$5.2M</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Committed</p>
                <p className="text-lg font-bold text-yellow-600">$3.8M</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Available</p>
                <p className="text-lg font-bold text-green-600">$1.4M</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {budgetLines.map((line, i) => {
                const utilization = ((line.committed / line.budget) * 100).toFixed(0);
                const actualPct = ((line.actual / line.budget) * 100).toFixed(0);
                return (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{line.name}</span>
                      <Badge variant={Number(utilization) > 90 ? 'destructive' : Number(utilization) > 70 ? 'default' : 'secondary'}>
                        {utilization}% committed
                      </Badge>
                    </div>
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute h-full bg-yellow-400" style={{width: `${utilization}%`}}></div>
                      <div className="absolute h-full bg-green-500" style={{width: `${actualPct}%`}}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Actual: ${(line.actual / 1000).toFixed(0)}K</span>
                      <span>Budget: ${(line.budget / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Link href="/saas/modules/fims-commitment-control/reports/budget-execution">
              <Button className="w-full mt-2">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Full Budget Execution Report
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Active Commitments</span>
            </CardTitle>
            <CardDescription>
              Track commitment lifecycle from requisition to payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {commitments.map((c) => (
              <div key={c.id} className="p-3 border rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-mono text-xs text-blue-600">{c.id}</span>
                    <h4 className="font-medium">{c.description}</h4>
                  </div>
                  <Badge variant={c.status === 'Active' ? 'default' : c.status === 'Pending Payment' ? 'secondary' : 'outline'}>
                    {c.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{c.budgetLine}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{c.stage}</Badge>
                    <span className="font-semibold">{c.amount}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 mt-4">
              <Link href="/saas/modules/fims-commitment-control/data/commitments">
                <Button variant="outline" className="flex-1">View All Commitments</Button>
              </Link>
              <Link href="/saas/modules/fims-commitment-control/action/create-commitment">
                <Button className="flex-1"><Plus className="w-4 h-4 mr-2" /> New Commitment</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>Commitment Lifecycle</span>
            </CardTitle>
            <CardDescription>
              Multi-stage commitment tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Requisition Stage</p>
                    <p className="text-xs text-gray-500">Budget reserved at request</p>
                  </div>
                </div>
                <Badge>5 pending</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Purchase Order</p>
                    <p className="text-xs text-gray-500">Commitment confirmed</p>
                  </div>
                </div>
                <Badge variant="secondary">12 active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Invoice/Liability</p>
                    <p className="text-xs text-gray-500">Awaiting payment approval</p>
                  </div>
                </div>
                <Badge variant="outline">8 pending</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Payment</p>
                    <p className="text-xs text-gray-500">Commitment cleared</p>
                  </div>
                </div>
                <Badge className="bg-green-600">156 completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Budget Alerts & Controls</span>
            </CardTitle>
            <CardDescription>
              Overspend prevention and exception management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100">2 Budget Lines Near Limit</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Salaries (92% committed) and Capital Expenditure (85% committed) require attention
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Review Now</Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">5 Pending Approvals</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Commitments awaiting budget availability confirmation
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Process Approvals</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Control Settings</h4>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm">Hard Stop at 100%</span>
                <Badge className="bg-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm">Warning at 80%</span>
                <Badge className="bg-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm">Override Requires CFO</span>
                <Badge className="bg-green-600">Active</Badge>
              </div>
            </div>
            
            <Link href="/saas/modules/fims-commitment-control/settings/controls">
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" /> Configure Controls
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}
