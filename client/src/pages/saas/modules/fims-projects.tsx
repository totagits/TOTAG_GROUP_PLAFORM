import { ModuleLayout } from '@/components/ModuleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  FolderOpen,
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
  Globe,
  Building2,
  FileText,
  PieChart,
  Briefcase
} from 'lucide-react';

export default function FIMSProjectsPage() {
  const quickActions = [
    { label: 'New Project', icon: <Plus className="w-4 h-4" />, href: '/saas/modules/fims-projects/action/new-project' },
    { label: 'Add Grant', icon: <Globe className="w-4 h-4" />, href: '/saas/modules/fims-projects/action/add-grant' },
    { label: 'Record Expense', icon: <DollarSign className="w-4 h-4" />, href: '/saas/modules/fims-projects/action/record-expense' },
    { label: 'Allocate Costs', icon: <PieChart className="w-4 h-4" />, href: '/saas/modules/fims-projects/action/allocate-costs' },
    { label: 'Donor Report', icon: <Download className="w-4 h-4" />, href: '/saas/modules/fims-projects/reports/donor-report' },
    { label: 'Budget vs Actual', icon: <BarChart3 className="w-4 h-4" />, href: '/saas/modules/fims-projects/reports/budget-actual' }
  ];

  const stats = [
    { label: 'Active Projects', value: 23, trend: 'up' as const },
    { label: 'Total Budget', value: '$12.5M', trend: 'neutral' as const },
    { label: 'Funds Utilized', value: '62%', trend: 'up' as const },
    { label: 'Active Grants', value: 15, trend: 'neutral' as const }
  ];

  const projects = [
    { id: 'PRJ-2024-001', name: 'Rural Education Initiative', donor: 'World Bank', budget: '$2.5M', spent: '$1.8M', status: 'Active', endDate: 'Dec 2025' },
    { id: 'PRJ-2024-002', name: 'Healthcare Infrastructure', donor: 'USAID', budget: '$3.2M', spent: '$1.2M', status: 'Active', endDate: 'Jun 2026' },
    { id: 'PRJ-2024-003', name: 'Clean Water Access', donor: 'EU Development Fund', budget: '$1.8M', spent: '$1.5M', status: 'Closing', endDate: 'Mar 2025' },
    { id: 'PRJ-2023-015', name: 'Digital Literacy Program', donor: 'Gates Foundation', budget: '$850K', spent: '$720K', status: 'Active', endDate: 'Sep 2025' },
  ];

  const grants = [
    { id: 'GRT-2024-008', donor: 'World Bank', amount: '$2.5M', disbursed: '$2.1M', restrictions: 'Education only', status: 'Active' },
    { id: 'GRT-2024-007', donor: 'USAID', amount: '$3.2M', disbursed: '$1.8M', restrictions: 'Healthcare capital', status: 'Active' },
    { id: 'GRT-2024-006', donor: 'EU Development', amount: '$1.8M', disbursed: '$1.8M', restrictions: 'Water infrastructure', status: 'Fully Disbursed' },
  ];

  const fundingSources = [
    { source: 'Donor Grants', amount: 8500000, percentage: 68 },
    { source: 'Government Co-funding', amount: 2500000, percentage: 20 },
    { source: 'Internal Budget', amount: 1000000, percentage: 8 },
    { source: 'Other Sources', amount: 500000, percentage: 4 },
  ];

  return (
    <ModuleLayout
      moduleName="Project & Grant Accounting"
      moduleDescription="Project budgets, funding sources, donor restrictions, cost allocation, and program reporting"
      category="FIMS"
      icon={<FolderOpen className="w-6 h-6 text-emerald-600" />}
      quickActions={quickActions}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <span>Active Projects</span>
                </CardTitle>
                <CardDescription>
                  Project portfolio with budget utilization
                </CardDescription>
              </div>
              <Link href="/saas/modules/fims-projects/action/new-project">
                <Button size="sm"><Plus className="w-4 h-4 mr-2" /> New Project</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((p) => {
                const utilization = (parseInt(p.spent.replace(/[$M]/g, '')) / parseInt(p.budget.replace(/[$M]/g, ''))) * 100;
                return (
                  <div key={p.id} className="p-4 border rounded-lg hover:border-emerald-400 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-mono text-xs text-emerald-600">{p.id}</span>
                        <h4 className="font-medium">{p.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline"><Globe className="w-3 h-3 mr-1" />{p.donor}</Badge>
                          <span className="text-xs text-gray-500">Ends: {p.endDate}</span>
                        </div>
                      </div>
                      <Badge variant={p.status === 'Active' ? 'default' : p.status === 'Closing' ? 'secondary' : 'outline'}>
                        {p.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budget: {p.budget}</span>
                        <span>Spent: {p.spent} ({utilization.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${utilization > 90 ? 'bg-red-500' : utilization > 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                          style={{width: `${Math.min(utilization, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Showing 4 of 23 projects</p>
              <Link href="/saas/modules/fims-projects/data/projects">
                <Button variant="outline">View All Projects</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Grant Management</span>
            </CardTitle>
            <CardDescription>
              Funding sources and donor restrictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {grants.map((g) => (
              <div key={g.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-mono text-xs text-blue-600">{g.id}</span>
                    <h4 className="font-medium">{g.donor}</h4>
                  </div>
                  <Badge variant={g.status === 'Active' ? 'default' : 'secondary'}>{g.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-semibold ml-1">{g.amount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Disbursed:</span>
                    <span className="font-semibold ml-1">{g.disbursed}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Restriction: {g.restrictions}</span>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 mt-4">
              <Link href="/saas/modules/fims-projects/data/grants">
                <Button variant="outline" className="flex-1">All Grants</Button>
              </Link>
              <Link href="/saas/modules/fims-projects/action/add-grant">
                <Button className="flex-1"><Plus className="w-4 h-4 mr-2" /> Add Grant</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <span>Funding Sources</span>
            </CardTitle>
            <CardDescription>
              Portfolio funding breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-500">Total Funding</p>
                <p className="text-xl font-bold text-emerald-600">$12.5M</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-500">Utilized</p>
                <p className="text-xl font-bold text-blue-600">$7.8M</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {fundingSources.map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{f.source}</span>
                    <span>${(f.amount / 1000000).toFixed(1)}M ({f.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-2 bg-purple-500 rounded-full"
                      style={{width: `${f.percentage}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/saas/modules/fims-projects/reports/funding-analysis">
              <Button variant="outline" className="w-full">
                <PieChart className="w-4 h-4 mr-2" /> Funding Analysis
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span>Cost Allocation</span>
            </CardTitle>
            <CardDescription>
              Expense allocation across projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100">Pending Allocations</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    12 shared expenses ($45K) awaiting project allocation
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Allocate Now</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Allocation Methods</h4>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm">Direct Costs</span>
                <Badge className="bg-green-600">Automatic</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm">Indirect/Overhead</span>
                <Badge variant="outline">Rate-based</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm">Shared Services</span>
                <Badge variant="outline">Usage-based</Badge>
              </div>
            </div>
            
            <Link href="/saas/modules/fims-projects/action/allocate-costs">
              <Button className="w-full">
                <PieChart className="w-4 h-4 mr-2" /> Allocate Costs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Donor Reporting</span>
            </CardTitle>
            <CardDescription>
              Compliance reports and financial statements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium">World Bank Q4 Report</h4>
                <p className="text-xs text-gray-500">Due: Jan 31, 2025</p>
              </div>
              <Badge variant="destructive">Overdue</Badge>
            </div>
            
            <div className="p-3 border rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium">USAID Annual Statement</h4>
                <p className="text-xs text-gray-500">Due: Feb 15, 2025</p>
              </div>
              <Badge variant="secondary">In Progress</Badge>
            </div>
            
            <div className="p-3 border rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium">EU Fund Utilization</h4>
                <p className="text-xs text-gray-500">Due: Mar 1, 2025</p>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Link href="/saas/modules/fims-projects/reports/donor-report">
                <Button variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" /> Generate</Button>
              </Link>
              <Link href="/saas/modules/fims-projects/data/reports">
                <Button className="flex-1">All Reports</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}
