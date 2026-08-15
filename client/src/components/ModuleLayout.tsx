import { ReactNode, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link, useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  BarChart3, 
  FileText, 
  Activity,
  Shield,
  Plus,
  Download,
  Search,
  ChevronRight,
  Menu,
  X,
  Home,
  User,
  Calculator,
  CreditCard,
  Receipt,
  Banknote,
  ShoppingCart,
  Eye,
  Brain,
  Calendar,
  Target,
  Smartphone,
  BookOpen
} from 'lucide-react';

interface ModuleLayoutProps {
  moduleName: string;
  moduleDescription: string;
  category: 'HRMIS' | 'FIMS';
  icon: ReactNode;
  children: ReactNode;
  dataContent?: ReactNode;
  reportsContent?: ReactNode;
  settingsContent?: ReactNode;
  quickActions?: Array<{
    label: string;
    icon: ReactNode;
    href: string;
  }>;
  stats?: Array<{
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  tenantInfo?: {
    name: string;
    address?: string;
    city?: string;
    country?: string;
  };
}

// All available modules with their metadata
const ALL_MODULES = [
  // HRMIS Layer 1: System of Record
  { id: 'hr_core', name: 'Core HR & Admin', category: 'HRMIS', icon: <User className="w-4 h-4" /> },
  { id: 'hr_position_control', name: 'Position Control', category: 'HRMIS', icon: <Target className="w-4 h-4" /> },
  
  // HRMIS Layer 2: Workforce Execution
  { id: 'hr_time_leave', name: 'Time, Leave & Scheduling', category: 'HRMIS', icon: <Calendar className="w-4 h-4" /> },
  { id: 'hr_biometrics_attendance', name: 'Biometrics & Attendance', category: 'HRMIS', icon: <Calendar className="w-4 h-4" /> },
  { id: 'hr_payroll', name: 'Payroll Interface', category: 'HRMIS', icon: <Calculator className="w-4 h-4" /> },
  { id: 'hr_recruitment', name: 'Recruitment & Onboarding', category: 'HRMIS', icon: <Users className="w-4 h-4" /> },
  { id: 'hr_offboarding', name: 'Offboarding & Exit', category: 'HRMIS', icon: <Users className="w-4 h-4" /> },
  { id: 'hr_employee_relations', name: 'Employee Relations', category: 'HRMIS', icon: <Users className="w-4 h-4" /> },
  
  // HRMIS Layer 3: Governance & Platform
  { id: 'hr_talent', name: 'Talent Management', category: 'HRMIS', icon: <Target className="w-4 h-4" /> },
  { id: 'hr_learning', name: 'Learning Management', category: 'HRMIS', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'hr_compensation', name: 'Compensation & Benefits', category: 'HRMIS', icon: <Calculator className="w-4 h-4" /> },
  { id: 'hr_self_service', name: 'Employee Self-Service', category: 'HRMIS', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'hr_analytics', name: 'HR Analytics & Insights', category: 'HRMIS', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'hr_documents', name: 'Document Management', category: 'HRMIS', icon: <FileText className="w-4 h-4" /> },
  { id: 'platform_governance', name: 'Platform Governance', category: 'HRMIS', icon: <Shield className="w-4 h-4" /> },
  
  // FIMS Modules
  { id: 'fims_general_ledger', name: 'General Ledger', category: 'FIMS', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'fims_accounts_payable', name: 'Accounts Payable', category: 'FIMS', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'fims_accounts_receivable', name: 'Accounts Receivable', category: 'FIMS', icon: <Receipt className="w-4 h-4" /> },
  { id: 'fims_treasury', name: 'Treasury & Cash Management', category: 'FIMS', icon: <Banknote className="w-4 h-4" /> },
  { id: 'fims_budgeting', name: 'Budgeting & Forecasting', category: 'FIMS', icon: <Calculator className="w-4 h-4" /> },
  { id: 'fims_procurement', name: 'Procurement & Expense Management', category: 'FIMS', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'fims_reporting', name: 'Financial Reporting & Analytics', category: 'FIMS', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'fims_compliance', name: 'Security, Compliance & Integration', category: 'FIMS', icon: <Shield className="w-4 h-4" /> },
];

// Default Data Content Component
function DefaultDataContent({ moduleName, category, currentModuleId }: { moduleName: string; category: string; currentModuleId: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  
  const getDataItems = () => {
    if (category === 'HRMIS') {
      return [
        { id: 'EMP001', name: 'John Smith', type: 'Employee', status: 'Active', date: '2024-01-15', email: 'john.smith@company.com', department: 'Engineering', phone: '+1 234-567-8901' },
        { id: 'EMP002', name: 'Sarah Johnson', type: 'Employee', status: 'Active', date: '2024-02-20', email: 'sarah.j@company.com', department: 'Marketing', phone: '+1 234-567-8902' },
        { id: 'EMP003', name: 'Michael Brown', type: 'Employee', status: 'On Leave', date: '2023-11-05', email: 'michael.b@company.com', department: 'Sales', phone: '+1 234-567-8903' },
        { id: 'EMP004', name: 'Emily Davis', type: 'Contractor', status: 'Active', date: '2024-03-10', email: 'emily.d@company.com', department: 'Design', phone: '+1 234-567-8904' },
        { id: 'EMP005', name: 'Robert Wilson', type: 'Employee', status: 'Inactive', date: '2023-08-22', email: 'robert.w@company.com', department: 'HR', phone: '+1 234-567-8905' }
      ];
    }
    return [
      { id: 'TXN001', name: 'Office Supplies Purchase', type: 'Expense', status: 'Approved', date: '2024-01-15', amount: '$2,450', vendor: 'Office Depot', category: 'Supplies' },
      { id: 'TXN002', name: 'Client Payment - ABC Corp', type: 'Revenue', status: 'Completed', date: '2024-02-20', amount: '$15,000', vendor: 'ABC Corporation', category: 'Services' },
      { id: 'TXN003', name: 'Monthly Rent', type: 'Expense', status: 'Pending', date: '2024-03-01', amount: '$8,500', vendor: 'Property Management Co', category: 'Facilities' },
      { id: 'TXN004', name: 'Software License', type: 'Expense', status: 'Approved', date: '2024-03-10', amount: '$1,200', vendor: 'Microsoft', category: 'Technology' },
      { id: 'TXN005', name: 'Consulting Fee', type: 'Revenue', status: 'Completed', date: '2024-03-15', amount: '$5,800', vendor: 'XYZ Consulting', category: 'Services' }
    ];
  };
  
  const items = getDataItems().filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFilter === 'all' || item.status.toLowerCase() === selectedFilter)
  );

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    setShowDetailPanel(true);
  };

  const handleClosePanel = () => {
    setShowDetailPanel(false);
    setSelectedRecord(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Data Management - {moduleName}</span>
          </CardTitle>
          <CardDescription>View, search, and manage your {moduleName.toLowerCase()} records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input type="text" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="approved">Approved</option>
            </select>
            <Link href={`/saas/modules/${currentModuleId}/action/export-data`}><Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button></Link>
            <Link href={`/saas/modules/${currentModuleId}/action/add-record`}><Button><Plus className="w-4 h-4 mr-2" /> Add New</Button></Link>
          </div>
          
          <div className="flex gap-4">
            <div className={`border rounded-lg overflow-hidden ${showDetailPanel ? 'flex-1' : 'w-full'}`}>
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item, i) => (
                    <tr key={i} className={`hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer ${selectedRecord?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`} onClick={() => handleViewRecord(item)}>
                      <td className="px-4 py-3 font-mono text-sm">{item.id}</td>
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">{item.type}</td>
                      <td className="px-4 py-3"><Badge variant={item.status === 'Active' || item.status === 'Approved' || item.status === 'Completed' ? 'default' : 'secondary'}>{item.status}</Badge></td>
                      <td className="px-4 py-3 text-gray-500">{item.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="ghost" onClick={() => handleViewRecord(item)} title="View Details"><Eye className="w-4 h-4" /></Button>
                          <Link href={`/saas/modules/${currentModuleId}/action/edit-record?id=${item.id}`}><Button size="sm" variant="ghost" title="Edit Record"><FileText className="w-4 h-4" /></Button></Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showDetailPanel && selectedRecord && (
              <div className="w-80 border rounded-lg bg-white dark:bg-gray-900 shadow-lg">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Record Details</h3>
                  <Button size="sm" variant="ghost" onClick={handleClosePanel}><X className="w-4 h-4" /></Button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">ID</p>
                    <p className="font-mono">{selectedRecord.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Name</p>
                    <p className="font-medium">{selectedRecord.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Type</p>
                    <p>{selectedRecord.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Status</p>
                    <Badge variant={selectedRecord.status === 'Active' || selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed' ? 'default' : 'secondary'}>{selectedRecord.status}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Date</p>
                    <p>{selectedRecord.date}</p>
                  </div>
                  {selectedRecord.email && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Email</p>
                      <p className="text-blue-600">{selectedRecord.email}</p>
                    </div>
                  )}
                  {selectedRecord.department && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Department</p>
                      <p>{selectedRecord.department}</p>
                    </div>
                  )}
                  {selectedRecord.phone && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Phone</p>
                      <p>{selectedRecord.phone}</p>
                    </div>
                  )}
                  {selectedRecord.amount && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Amount</p>
                      <p className="text-lg font-bold text-green-600">{selectedRecord.amount}</p>
                    </div>
                  )}
                  {selectedRecord.vendor && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Vendor</p>
                      <p>{selectedRecord.vendor}</p>
                    </div>
                  )}
                  {selectedRecord.category && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Category</p>
                      <p>{selectedRecord.category}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t flex gap-2">
                    <Link href={`/saas/modules/${currentModuleId}/action/edit-record?id=${selectedRecord.id}`} className="flex-1">
                      <Button size="sm" className="w-full"><FileText className="w-4 h-4 mr-2" /> Edit</Button>
                    </Link>
                    <Button size="sm" variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" /> Export</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>Showing {items.length} records</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled>Previous</Button>
              <Button size="sm" variant="outline">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Default Reports Content Component
function DefaultReportsContent({ moduleName, category, currentModuleId, tenantInfo }: { moduleName: string; category: string; currentModuleId: string; tenantInfo?: { name: string; address?: string; city?: string; country?: string } }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  
  const reports = category === 'HRMIS' ? [
    { id: 'headcount', name: 'Headcount Report', description: 'Employee count by department, role, and location', type: 'Summary', lastRun: '2 hours ago', totalRecords: 156, chartData: [45, 32, 28, 25, 18, 8] },
    { id: 'attendance', name: 'Attendance Summary', description: 'Attendance rates, absences, and leave utilization', type: 'Analytics', lastRun: '1 day ago', totalRecords: 1240, chartData: [92, 88, 95, 90, 87, 93] },
    { id: 'payroll', name: 'Payroll Report', description: 'Salary distribution, deductions, and net payments', type: 'Financial', lastRun: '3 days ago', totalRecords: 156, chartData: [125000, 98000, 87000, 75000, 62000] },
    { id: 'performance', name: 'Performance Review', description: 'Performance ratings and goal completion rates', type: 'Analytics', lastRun: '1 week ago', totalRecords: 89, chartData: [4.2, 3.8, 4.5, 3.9, 4.1] },
    { id: 'turnover', name: 'Turnover Analysis', description: 'Employee attrition and retention metrics', type: 'Trend', lastRun: '2 weeks ago', totalRecords: 24, chartData: [5, 3, 7, 4, 6, 2] }
  ] : [
    { id: 'financial', name: 'Financial Summary', description: 'Income, expenses, and profit/loss overview', type: 'Summary', lastRun: '2 hours ago', totalRecords: 342, chartData: [150000, 125000, 175000, 140000, 165000] },
    { id: 'cashflow', name: 'Cash Flow Statement', description: 'Cash inflows and outflows analysis', type: 'Financial', lastRun: '1 day ago', totalRecords: 128, chartData: [85000, 72000, 95000, 68000, 88000] },
    { id: 'budget', name: 'Budget vs Actual', description: 'Compare budgeted amounts with actual spending', type: 'Comparison', lastRun: '3 days ago', totalRecords: 56, chartData: [100, 95, 102, 88, 97] },
    { id: 'aging', name: 'Aged Receivables', description: 'Outstanding invoices by aging period', type: 'Analytics', lastRun: '1 week ago', totalRecords: 78, chartData: [45000, 28000, 15000, 8000, 4000] },
    { id: 'vendor', name: 'Vendor Spend Analysis', description: 'Spending breakdown by vendor and category', type: 'Analytics', lastRun: '2 weeks ago', totalRecords: 234, chartData: [35000, 28000, 22000, 18000, 12000] }
  ];

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setShowReportPreview(true);
  };

  const handleExportReport = (report: any) => {
    setIsExporting(report.id);
    setTimeout(() => {
      setIsExporting(null);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const periodLabel = selectedPeriod === 'week' ? 'This Week' : selectedPeriod === 'month' ? 'This Month' : selectedPeriod === 'quarter' ? 'This Quarter' : selectedPeriod === 'year' ? 'This Year' : 'Custom Range';
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const generateTableRows = () => {
          if (category === 'HRMIS') {
            if (report.id === 'headcount') {
              return '<tr><td>Administration</td><td>45</td><td>28.8%</td><td>+3</td></tr><tr><td>Operations</td><td>32</td><td>20.5%</td><td>+1</td></tr><tr><td>Finance</td><td>28</td><td>17.9%</td><td>0</td></tr><tr><td>IT Department</td><td>25</td><td>16.0%</td><td>+2</td></tr><tr><td>Human Resources</td><td>18</td><td>11.5%</td><td>-1</td></tr><tr><td>Marketing</td><td>8</td><td>5.1%</td><td>0</td></tr><tr class="total-row"><td><strong>Total</strong></td><td><strong>156</strong></td><td><strong>100%</strong></td><td><strong>+5</strong></td></tr>';
            } else if (report.id === 'payroll') {
              return '<tr><td>Gross Salaries</td><td>$485,000.00</td><td>$5,820,000.00</td></tr><tr><td>Tax Withholdings</td><td>($72,750.00)</td><td>($873,000.00)</td></tr><tr><td>Social Security</td><td>($30,070.00)</td><td>($360,840.00)</td></tr><tr><td>Health Insurance</td><td>($24,250.00)</td><td>($291,000.00)</td></tr><tr><td>Pension Contributions</td><td>($19,400.00)</td><td>($232,800.00)</td></tr><tr><td>Other Deductions</td><td>($9,700.00)</td><td>($116,400.00)</td></tr><tr class="total-row"><td><strong>Net Payroll</strong></td><td><strong>$328,830.00</strong></td><td><strong>$3,945,960.00</strong></td></tr>';
            } else {
              return '<tr><td>Category A</td><td>92</td><td>58.9%</td></tr><tr><td>Category B</td><td>88</td><td>56.4%</td></tr><tr><td>Category C</td><td>95</td><td>60.9%</td></tr><tr><td>Category D</td><td>90</td><td>57.7%</td></tr><tr><td>Category E</td><td>87</td><td>55.8%</td></tr>';
            }
          } else {
            if (report.id === 'financial') {
              return '<tr><td>Revenue</td><td>$755,000.00</td><td>$650,000.00</td><td class="positive">+16.2%</td></tr><tr><td>Cost of Goods Sold</td><td>($302,000.00)</td><td>($260,000.00)</td><td class="negative">+16.2%</td></tr><tr><td>Gross Profit</td><td>$453,000.00</td><td>$390,000.00</td><td class="positive">+16.2%</td></tr><tr><td>Operating Expenses</td><td>($181,200.00)</td><td>($175,500.00)</td><td class="negative">+3.2%</td></tr><tr><td>Operating Income</td><td>$271,800.00</td><td>$214,500.00</td><td class="positive">+26.7%</td></tr><tr><td>Interest & Taxes</td><td>($67,950.00)</td><td>($53,625.00)</td><td class="negative">+26.7%</td></tr><tr class="total-row"><td><strong>Net Income</strong></td><td><strong>$203,850.00</strong></td><td><strong>$160,875.00</strong></td><td class="positive"><strong>+26.7%</strong></td></tr>';
            } else if (report.id === 'cashflow') {
              return '<tr class="section-header"><td colspan="3"><strong>Operating Activities</strong></td></tr><tr><td>Cash from Operations</td><td>$125,000.00</td><td>Inflow</td></tr><tr><td>Payments to Suppliers</td><td>($45,000.00)</td><td>Outflow</td></tr><tr><td>Payments to Employees</td><td>($52,000.00)</td><td>Outflow</td></tr><tr class="section-header"><td colspan="3"><strong>Investing Activities</strong></td></tr><tr><td>Equipment Purchase</td><td>($15,000.00)</td><td>Outflow</td></tr><tr><td>Investment Income</td><td>$3,500.00</td><td>Inflow</td></tr><tr class="section-header"><td colspan="3"><strong>Financing Activities</strong></td></tr><tr><td>Loan Repayment</td><td>($8,000.00)</td><td>Outflow</td></tr><tr class="total-row"><td><strong>Net Cash Flow</strong></td><td><strong>$8,500.00</strong></td><td><strong>Net Inflow</strong></td></tr>';
            } else {
              return '<tr><td>Category 1</td><td>$45,000</td><td>35.0%</td></tr><tr><td>Category 2</td><td>$28,000</td><td>21.8%</td></tr><tr><td>Category 3</td><td>$22,000</td><td>17.1%</td></tr><tr><td>Category 4</td><td>$18,000</td><td>14.0%</td></tr><tr><td>Category 5</td><td>$15,000</td><td>11.7%</td></tr>';
            }
          }
        };

        const getTableHeaders = () => {
          if (category === 'HRMIS') {
            if (report.id === 'headcount') return '<th>Department</th><th>Count</th><th>Percentage</th><th>Change</th>';
            if (report.id === 'payroll') return '<th>Description</th><th>This Period</th><th>Year to Date</th>';
            return '<th>Category</th><th>Value</th><th>Percentage</th>';
          } else {
            if (report.id === 'financial') return '<th>Description</th><th>Current Period</th><th>Previous Period</th><th>Change</th>';
            if (report.id === 'cashflow') return '<th>Description</th><th>Amount</th><th>Type</th>';
            return '<th>Description</th><th>Amount</th><th>Percentage</th>';
          }
        };

        const chartBars = report.chartData.map((val: number, idx: number) => {
          const max = Math.max(...report.chartData);
          const height = Math.round((val / max) * 160);
          const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
          return '<div class="chart-bar" style="height: ' + height + 'px;"><span class="chart-label">' + (labels[idx] || 'P' + (idx+1)) + '</span></div>';
        }).join('');

        const companyName = tenantInfo?.name || 'Your Company';
        const companyAddress = tenantInfo?.address || '';
        const companyLocation = [tenantInfo?.city, tenantInfo?.country].filter(Boolean).join(', ') || '';

        const html = '<!DOCTYPE html><html><head><title>' + report.name + ' - ' + companyName + '</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Segoe UI",Tahoma,Geneva,Verdana,sans-serif;padding:40px;color:#333;background:white}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;padding-bottom:20px;border-bottom:3px solid #1a56db}.logo{font-size:24px;font-weight:bold;color:#1a56db}.logo span{color:#333}.company-info{text-align:right;font-size:12px;color:#666}.report-title{font-size:28px;font-weight:bold;color:#1a56db;margin-bottom:5px}.report-subtitle{font-size:14px;color:#666;margin-bottom:20px}.meta-info{display:flex;gap:40px;margin-bottom:30px;padding:15px;background:#f8fafc;border-radius:8px}.meta-label{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.5px}.meta-value{font-size:16px;font-weight:600;color:#333}.summary-cards{display:flex;gap:20px;margin-bottom:30px}.summary-card{flex:1;padding:20px;background:linear-gradient(135deg,#1a56db 0%,#1e40af 100%);color:white;border-radius:8px}.summary-card.secondary{background:linear-gradient(135deg,#059669 0%,#047857 100%)}.summary-card.tertiary{background:linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)}.summary-card-label{font-size:12px;opacity:.9;margin-bottom:5px}.summary-card-value{font-size:28px;font-weight:bold}.section{margin-bottom:30px}.section-title{font-size:18px;font-weight:600;color:#333;margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #e5e7eb}table{width:100%;border-collapse:collapse;margin-bottom:20px}th{background:#1a56db;color:white;padding:12px 15px;text-align:left;font-weight:600}td{padding:12px 15px;border-bottom:1px solid #e5e7eb}tr:nth-child(even){background:#f9fafb}tr:hover{background:#f3f4f6}.total-row{background:#1e3a5f!important;color:white;font-weight:bold}.total-row td{border-bottom:none}.section-header td{background:#e5e7eb;font-weight:600;padding:8px 15px}.positive{color:#059669}.negative{color:#dc2626}.chart-container{height:200px;display:flex;align-items:flex-end;gap:8px;padding:20px;background:#f8fafc;border-radius:8px;margin-bottom:20px}.chart-bar{flex:1;background:linear-gradient(180deg,#1a56db 0%,#3b82f6 100%);border-radius:4px 4px 0 0;position:relative}.chart-label{position:absolute;bottom:-25px;left:50%;transform:translateX(-50%);font-size:10px;color:#666}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:11px;color:#666}.confidential{color:#dc2626;font-weight:600}.print-btn{position:fixed;top:20px;right:20px;padding:12px 24px;background:#1a56db;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;box-shadow:0 4px 6px rgba(0,0,0,.1)}.print-btn:hover{background:#1e40af}@media print{.print-btn{display:none}body{padding:20px}}</style></head><body><button class="print-btn" onclick="window.print()">Print / Save as PDF</button><div class="header"><div><div class="logo">' + companyName + '</div><div style="font-size:12px;color:#666;margin-top:5px">' + (category === 'HRMIS' ? 'Human Resource Management' : 'Financial Management') + ' Report</div></div><div class="company-info">' + (companyAddress ? '<div>' + companyAddress + '</div>' : '') + (companyLocation ? '<div>' + companyLocation + '</div>' : '') + '<div>Generated: ' + currentDate + '</div></div></div><h1 class="report-title">' + report.name + '</h1><p class="report-subtitle">' + report.description + '</p><div class="meta-info"><div class="meta-item"><div class="meta-label">Report Period</div><div class="meta-value">' + periodLabel + '</div></div><div class="meta-item"><div class="meta-label">Generated On</div><div class="meta-value">' + currentDate + ' at ' + currentTime + '</div></div><div class="meta-item"><div class="meta-label">Report Type</div><div class="meta-value">' + report.type + '</div></div><div class="meta-item"><div class="meta-label">Total Records</div><div class="meta-value">' + report.totalRecords.toLocaleString() + '</div></div></div><div class="summary-cards"><div class="summary-card"><div class="summary-card-label">Total Records</div><div class="summary-card-value">' + report.totalRecords.toLocaleString() + '</div></div><div class="summary-card secondary"><div class="summary-card-label">Report Type</div><div class="summary-card-value">' + report.type + '</div></div><div class="summary-card tertiary"><div class="summary-card-label">Category</div><div class="summary-card-value">' + category + '</div></div></div><div class="section"><h2 class="section-title">Trend Analysis</h2><div class="chart-container">' + chartBars + '</div></div><div class="section"><h2 class="section-title">Detailed Breakdown</h2><table><thead><tr>' + getTableHeaders() + '</tr></thead><tbody>' + generateTableRows() + '</tbody></table></div><div class="footer"><div class="confidential">CONFIDENTIAL - For Internal Use Only</div><div>Generated by ' + companyName + ' | Page 1 of 1</div></div></body></html>';

        printWindow.document.write(html);
        printWindow.document.close();
      }
    }, 800);
  };

  const handleClosePreview = () => {
    setShowReportPreview(false);
    setSelectedReport(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Reports & Analytics - {moduleName}</span>
          </CardTitle>
          <CardDescription>Generate reports and analyze {moduleName.toLowerCase()} metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <Link href={`/saas/modules/${currentModuleId}/action/create-report`}><Button><Plus className="w-4 h-4 mr-2" /> Create Custom Report</Button></Link>
            <Link href={`/saas/modules/${currentModuleId}/action/schedule-report`}><Button variant="outline"><Calendar className="w-4 h-4 mr-2" /> Schedule Report</Button></Link>
          </div>
          
          <div className="flex gap-4">
            <div className={`grid grid-cols-1 ${showReportPreview ? '' : 'md:grid-cols-2'} gap-4 ${showReportPreview ? 'flex-1' : 'w-full'}`}>
              {reports.map((report, i) => (
                <div key={i} className={`p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer ${selectedReport?.id === report.id ? 'ring-2 ring-blue-500' : ''}`} onClick={() => handleViewReport(report)}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{report.name}</h4>
                    <Badge variant="outline">{report.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{report.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Last run: {report.lastRun}</span>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline" onClick={() => handleViewReport(report)}><Eye className="w-4 h-4 mr-1" /> View</Button>
                      <Button size="sm" onClick={() => handleExportReport(report)} disabled={isExporting === report.id}>
                        {isExporting === report.id ? <><span className="animate-spin mr-1">⏳</span> Exporting...</> : <><Download className="w-4 h-4 mr-1" /> Export</>}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showReportPreview && selectedReport && (
              <div className="w-96 border rounded-lg bg-white dark:bg-gray-900 shadow-lg">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">{selectedReport.name}</h3>
                  <Button size="sm" variant="ghost" onClick={handleClosePreview}><X className="w-4 h-4" /></Button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Report Period</p>
                    <p className="font-semibold capitalize">{selectedPeriod === 'week' ? 'This Week' : selectedPeriod === 'month' ? 'This Month' : selectedPeriod === 'quarter' ? 'This Quarter' : selectedPeriod === 'year' ? 'This Year' : 'Custom Range'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-500">Total Records</p>
                      <p className="text-xl font-bold">{selectedReport.totalRecords}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-xl font-bold">{selectedReport.type}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-2">Trend Preview</p>
                    <div className="h-20 flex items-end gap-1">
                      {selectedReport.chartData.map((val: number, idx: number) => {
                        const max = Math.max(...selectedReport.chartData);
                        const height = (val / max) * 100;
                        return <div key={idx} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${height}%` }} title={String(val)} />;
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-2">Description</p>
                    <p className="text-sm">{selectedReport.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Last Generated</p>
                    <p className="text-sm">{selectedReport.lastRun}</p>
                  </div>
                  <div className="pt-4 border-t flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => handleExportReport(selectedReport)} disabled={isExporting === selectedReport.id}>
                      {isExporting === selectedReport.id ? 'Exporting...' : <><Download className="w-4 h-4 mr-2" /> Export PDF</>}
                    </Button>
                    <Link href={`/saas/modules/${currentModuleId}/action/run-report?id=${selectedReport.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full"><BarChart3 className="w-4 h-4 mr-2" /> Run Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">Reports Generated</span><span className="font-bold">128</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Scheduled Reports</span><span className="font-bold">12</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shared Reports</span><span className="font-bold">45</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><span className="text-blue-600">Admin</span> exported Financial Summary</p>
              <p><span className="text-green-600">System</span> ran scheduled Headcount Report</p>
              <p><span className="text-purple-600">Manager</span> viewed Cash Flow Statement</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Popular Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Financial Summary</span><span className="text-gray-500">89 views</span></div>
              <div className="flex justify-between"><span>Headcount Report</span><span className="text-gray-500">67 views</span></div>
              <div className="flex justify-between"><span>Budget vs Actual</span><span className="text-gray-500">54 views</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Default Settings Content Component
function DefaultSettingsContent({ moduleName, category, currentModuleId }: { moduleName: string; category: string; currentModuleId: string }) {
  const [notifications, setNotifications] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Module Settings - {moduleName}</span>
          </CardTitle>
          <CardDescription>Configure {moduleName.toLowerCase()} preferences and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">General Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email alerts for important updates</p>
                </div>
                <Button variant={notifications ? 'default' : 'outline'} onClick={() => setNotifications(!notifications)}>{notifications ? 'Enabled' : 'Disabled'}</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Auto-Approve Requests</p>
                  <p className="text-sm text-gray-500">Automatically approve low-value requests</p>
                </div>
                <Button variant={autoApprove ? 'default' : 'outline'} onClick={() => setAutoApprove(!autoApprove)}>{autoApprove ? 'Enabled' : 'Disabled'}</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for sensitive operations</p>
                </div>
                <Button variant={twoFactor ? 'default' : 'outline'} onClick={() => setTwoFactor(!twoFactor)}>{twoFactor ? 'Enabled' : 'Disabled'}</Button>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Access Control</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">View</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Create</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Edit</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Delete</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Approve</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr><td className="px-4 py-3 font-medium">Admin</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Manager</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">-</td><td className="px-4 py-3">✓</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Staff</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">-</td><td className="px-4 py-3">-</td><td className="px-4 py-3">-</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Viewer</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">-</td><td className="px-4 py-3">-</td><td className="px-4 py-3">-</td><td className="px-4 py-3">-</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3"><Link href={`/saas/modules/${currentModuleId}/action/manage-roles`}><Button variant="outline" size="sm"><Users className="w-4 h-4 mr-2" /> Manage Roles</Button></Link></div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Data & Integration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Import Data</h5>
                <p className="text-sm text-gray-500 mb-3">Upload CSV or Excel files to import data</p>
                <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Import</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Export Data</h5>
                <p className="text-sm text-gray-500 mb-3">Download all module data</p>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">API Access</h5>
                <p className="text-sm text-gray-500 mb-3">Manage API keys and webhooks</p>
                <Button variant="outline" size="sm"><Shield className="w-4 h-4 mr-2" /> Configure</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Audit Log</h5>
                <p className="text-sm text-gray-500 mb-3">View activity history and changes</p>
                <Button variant="outline" size="sm"><Activity className="w-4 h-4 mr-2" /> View Logs</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ModuleLayout({ 
  moduleName, 
  moduleDescription, 
  category, 
  icon, 
  children,
  dataContent,
  reportsContent,
  settingsContent,
  quickActions = [],
  stats = [],
  tenantInfo: propTenantInfo
}: ModuleLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [location, setLocation] = useLocation();
  
  const [tenantInfo, setTenantInfo] = useState<{ name: string; address?: string; city?: string; country?: string } | undefined>(propTenantInfo);
  
  useEffect(() => {
    if (!propTenantInfo) {
      try {
        const storedTenant = localStorage.getItem('saas_tenant');
        if (storedTenant) {
          const tenant = JSON.parse(storedTenant);
          setTenantInfo({
            name: tenant.name || tenant.company_name || 'Your Company',
            address: tenant.address,
            city: tenant.city,
            country: tenant.country
          });
        }
      } catch (e) {
        console.error('Error parsing tenant info:', e);
      }
    }
  }, [propTenantInfo]);
  
  // Parse URL to get current module ID and tab
  const urlParts = location.split('/');
  // Extract module ID (always at index 3: /saas/modules/{moduleId}/tab or /saas/modules/{moduleId})
  const currentModuleId = urlParts[3] || '';
  const currentTab = urlParts.includes('data') ? 'data' : 
                   urlParts.includes('reports') ? 'reports' : 
                   urlParts.includes('settings') ? 'settings' : 'overview';
  
  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    const baseUrl = `/saas/modules/${currentModuleId}`;
    const newUrl = tab === 'overview' ? baseUrl : `${baseUrl}/${tab}`;
    setLocation(newUrl);
  };
  
  // Group modules by category
  const hrmisMoudles = ALL_MODULES.filter(m => m.category === 'HRMIS');
  const fimsModules = ALL_MODULES.filter(m => m.category === 'FIMS');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <Breadcrumb data-testid="module-breadcrumbs">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/saas/dashboard">
                    <Home className="w-4 h-4" />
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{category}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{moduleName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/saas/dashboard">
                <Button 
                  variant="ghost" 
                  size="sm"
                  data-testid="button-back-to-dashboard"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                data-testid="button-toggle-sidebar"
                className="lg:hidden"
              >
                <Menu className="w-4 h-4 mr-2" />
                Modules
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{moduleName}</h1>
                    <Badge variant={category === 'HRMIS' ? 'default' : 'secondary'}>
                      {category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{moduleDescription}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" data-testid="button-module-settings" onClick={() => handleTabChange('settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" data-testid="button-module-help" onClick={() => setShowHelpModal(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" data-testid="sidebar-overlay">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Modules</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-6">
              {/* HRMIS Modules */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">HRMIS</h3>
                <div className="space-y-1">
                  {hrmisMoudles.map((module) => (
                    <Link
                      key={module.id}
                      href={`/saas/modules/${module.id}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div 
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer data-testid-sidebar-module-${module.id} ${
                          currentModuleId === module.id 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        data-testid={`sidebar-module-${module.id}`}
                      >
                        {module.icon}
                        <span className="text-sm font-medium">{module.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* FIMS Modules */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">FIMS</h3>
                <div className="space-y-1">
                  {fimsModules.map((module) => (
                    <Link
                      key={module.id}
                      href={`/saas/modules/${module.id}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div 
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                          currentModuleId === module.id 
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        data-testid={`sidebar-module-${module.id}`}
                      >
                        {module.icon}
                        <span className="text-sm font-medium">{module.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-80 lg:bg-white/80 lg:dark:bg-gray-900/80 lg:backdrop-blur-md lg:border-r lg:shadow-sm lg:z-40">
        <div className="p-4 border-b">
          <Link href="/saas/dashboard">
            <Button variant="ghost" size="sm" data-testid="button-back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="p-4 space-y-6">
          {/* HRMIS Modules */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">HRMIS</h3>
            <div className="space-y-1">
              {hrmisMoudles.map((module) => (
                <Link key={module.id} href={`/saas/modules/${module.id}`}>
                  <div 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      currentModuleId === module.id 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    data-testid={`sidebar-module-${module.id}`}
                  >
                    {module.icon}
                    <span className="text-sm font-medium">{module.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* FIMS Modules */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">FIMS</h3>
            <div className="space-y-1">
              {fimsModules.map((module) => (
                <Link key={module.id} href={`/saas/modules/${module.id}`}>
                  <div 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      currentModuleId === module.id 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    data-testid={`sidebar-module-${module.id}`}
                  >
                    {module.icon}
                    <span className="text-sm font-medium">{module.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - adjusted for sidebar */}
      <div className="lg:ml-80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    {stat.trend && (
                      <div className={`p-2 rounded-full ${
                        stat.trend === 'up' ? 'bg-green-100 text-green-600' :
                        stat.trend === 'down' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Activity className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 w-full"
                      data-testid={`button-quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {action.icon}
                      <span className="text-xs text-center">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content with Tabs */}
        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="data" data-testid="tab-data">Data</TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">Reports</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {children}
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            {dataContent || <DefaultDataContent moduleName={moduleName} category={category} currentModuleId={currentModuleId} />}
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {reportsContent || <DefaultReportsContent moduleName={moduleName} category={category} currentModuleId={currentModuleId} tenantInfo={tenantInfo} />}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {settingsContent || <DefaultSettingsContent moduleName={moduleName} category={category} currentModuleId={currentModuleId} />}
          </TabsContent>
        </Tabs>
      </div>

      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowHelpModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {moduleName} - Help & Documentation
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowHelpModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Welcome to {moduleName}! This module helps you manage {category === 'HRMIS' ? 'human resource operations' : 'financial operations'} efficiently.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Key Features</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>View and manage data records in the <strong>Data</strong> tab</li>
                  <li>Generate and export reports in the <strong>Reports</strong> tab</li>
                  <li>Configure module settings in the <strong>Settings</strong> tab</li>
                  <li>Use Quick Actions for common tasks</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Navigation Tips</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Use the sidebar to switch between different modules</li>
                  <li>Click on table rows to view record details</li>
                  <li>Use the Edit button to modify existing records</li>
                  <li>Export reports as PDF for printing or sharing</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Need More Help?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Contact our support team for assistance with any questions or issues.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { window.location.href = 'mailto:support@totaggroup.com'; }}>
                    Email Support
                  </Button>
                  <Button size="sm" onClick={() => setShowHelpModal(false)}>
                    Got It
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}