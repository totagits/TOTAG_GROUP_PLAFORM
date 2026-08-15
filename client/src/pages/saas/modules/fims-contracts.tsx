import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  FileText,
  Plus,
  Download,
  Settings,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Shield,
  Bell,
  Eye
} from 'lucide-react';

export default function FIMSContractsPage() {
  const quickActions = [
    { label: 'New Contract', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-contracts/action/new-contract' },
    { label: 'Add Milestone', icon: <Target className="w-4 h-4" />, href: '/saas/modules/fims-contracts/action/add-milestone' },
    { label: 'Record Variation', icon: <FileText className="w-4 h-4" />, href: '/saas/modules/fims-contracts/action/variation' },
    { label: 'Expiry Alerts', icon: <Bell className="w-4 h-4" />, href: '/saas/modules/fims-contracts/reports/expiry-alerts' },
    { label: 'Spend Analysis', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/fims-contracts/reports/spend-analysis' },
    { label: 'Contract Register', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-contracts/reports/register' }
  ];

  const stats = [
    { label: 'Active Contracts', value: 47, trend: 'up' as const },
    { label: 'Total Value', value: '$8.5M', trend: 'neutral' as const },
    { label: 'Expiring Soon', value: 8, trend: 'down' as const },
    { label: 'Pending Renewals', value: 5, trend: 'neutral' as const }
  ];

  const contracts = [
    { id: 'CTR-2024-045', name: 'IT Infrastructure Support', vendor: 'TechCorp Solutions', value: '$450K', spent: '$280K', status: 'Active', expiry: 'Jun 30, 2025' },
    { id: 'CTR-2024-038', name: 'Office Cleaning Services', vendor: 'CleanPro Ltd', value: '$85K', spent: '$52K', status: 'Active', expiry: 'Dec 31, 2025' },
    { id: 'CTR-2024-032', name: 'Security Services', vendor: 'Guardian Security', value: '$120K', spent: '$95K', status: 'Expiring Soon', expiry: 'Feb 28, 2025' },
    { id: 'CTR-2024-028', name: 'Fleet Maintenance', vendor: 'AutoCare Plus', value: '$200K', spent: '$145K', status: 'Active', expiry: 'Sep 30, 2025' },
  ];

  const milestones = [
    { contract: 'IT Infrastructure Support', milestone: 'Phase 2 Delivery', due: 'Feb 15, 2025', value: '$75K', status: 'In Progress' },
    { contract: 'Construction Project', milestone: 'Foundation Complete', due: 'Feb 28, 2025', value: '$150K', status: 'Pending Review' },
    { contract: 'Software Implementation', milestone: 'User Training', due: 'Mar 10, 2025', value: '$25K', status: 'Scheduled' },
  ];

  return (
    <ModuleLayout
      moduleName="Contract Management"
      moduleDescription="Contract registry, milestones, deliverables, variations, performance tracking, and spend analysis"
      category="FIMS"
      icon={<FileText className="w-6 h-6 text-indigo-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Active Contracts</span>
                </CardTitle>
                <CardDescription>
                  Contract registry with spend tracking and status
                </CardDescription>
              </div>
              <Link href="/saas/modules/fims-contracts/action/new-contract">
                <Button size="sm"><Plus className="w-4 h-4 mr-2" /> New Contract</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Contract</th>
                    <th className="text-left py-3 px-4 font-medium">Vendor</th>
                    <th className="text-right py-3 px-4 font-medium">Value</th>
                    <th className="text-right py-3 px-4 font-medium">Spent</th>
                    <th className="text-center py-3 px-4 font-medium">Status</th>
                    <th className="text-center py-3 px-4 font-medium">Expiry</th>
                    <th className="text-center py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => {
                    const spentPct = (parseInt(c.spent.replace(/[$K]/g, '')) / parseInt(c.value.replace(/[$K]/g, ''))) * 100;
                    return (
                      <tr key={c.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-indigo-600 block">{c.id}</span>
                          <span className="font-medium">{c.name}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{c.vendor}</td>
                        <td className="py-3 px-4 text-right font-semibold">{c.value}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-medium">{c.spent}</span>
                          <span className="text-xs text-gray-500 block">{spentPct.toFixed(0)}% used</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={c.status === 'Active' ? 'default' : 'destructive'}>{c.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-sm">{c.expiry}</td>
                        <td className="py-3 px-4 text-center">
                          <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Showing 4 of 47 contracts</p>
              <Link href="/saas/modules/fims-contracts/data/contracts">
                <Button variant="outline">View All Contracts</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <span>Upcoming Milestones</span>
            </CardTitle>
            <CardDescription>
              Deliverables and payment milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {milestones.map((m, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{m.milestone}</h4>
                    <p className="text-sm text-gray-500">{m.contract}</p>
                  </div>
                  <Badge variant={m.status === 'In Progress' ? 'default' : m.status === 'Pending Review' ? 'secondary' : 'outline'}>
                    {m.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-4 h-4" /> Due: {m.due}
                  </div>
                  <span className="font-semibold text-green-600">{m.value}</span>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 mt-4">
              <Link href="/saas/modules/fims-contracts/data/milestones">
                <Button variant="outline" className="flex-1">All Milestones</Button>
              </Link>
              <Link href="/saas/modules/fims-contracts/action/add-milestone">
                <Button className="flex-1"><Plus className="w-4 h-4 mr-2" /> Add</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-red-600" />
              <span>Alerts & Renewals</span>
            </CardTitle>
            <CardDescription>
              Expiring contracts and renewal reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100">3 Contracts Expiring</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Security Services, Cleaning Contract, and IT Support expire within 60 days
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Review Now</Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">5 Renewals Pending</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Annual contracts awaiting renewal decision
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Process Renewals</Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <Shield className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <p className="text-lg font-bold text-green-600">$85K</p>
                <p className="text-xs text-gray-500">Retention Held</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <DollarSign className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                <p className="text-lg font-bold text-blue-600">$120K</p>
                <p className="text-xs text-gray-500">Performance Bonds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Spend Analysis</span>
            </CardTitle>
            <CardDescription>
              Contract spend vs budget tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-500">Total Value</p>
                <p className="text-lg font-bold text-blue-600">$8.5M</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-500">Spent YTD</p>
                <p className="text-lg font-bold text-green-600">$4.2M</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-500">Committed</p>
                <p className="text-lg font-bold text-yellow-600">$2.8M</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">By Category</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>IT Services</span>
                    <span>$2.1M (25%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Facilities</span>
                    <span>$1.5M (45%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Professional Services</span>
                    <span>$650K (60%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <Link href="/saas/modules/fims-contracts/reports/spend-analysis">
              <Button variant="outline" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" /> Full Spend Report
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span>Vendor Performance</span>
            </CardTitle>
            <CardDescription>
              Contract performance and supplier ratings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">TechCorp Solutions</span>
                <Badge className="bg-green-600">4.8/5</Badge>
              </div>
              <div className="flex gap-2 text-xs">
                <Badge variant="outline">On-Time: 95%</Badge>
                <Badge variant="outline">Quality: 92%</Badge>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Guardian Security</span>
                <Badge className="bg-green-600">4.5/5</Badge>
              </div>
              <div className="flex gap-2 text-xs">
                <Badge variant="outline">On-Time: 100%</Badge>
                <Badge variant="outline">Quality: 88%</Badge>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">CleanPro Ltd</span>
                <Badge className="bg-yellow-600">3.8/5</Badge>
              </div>
              <div className="flex gap-2 text-xs">
                <Badge variant="outline">On-Time: 85%</Badge>
                <Badge variant="outline">Quality: 80%</Badge>
              </div>
            </div>
            
            <Link href="/saas/modules/fims-contracts/reports/vendor-performance">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" /> All Vendors
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}
