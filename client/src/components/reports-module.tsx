import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Plus, 
  Download,
  Eye,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  FileBarChart,
  FileSpreadsheet,
  Filter,
  Share,
  Settings
} from "lucide-react";
import { format } from "date-fns";

interface Report {
  id: string;
  name: string;
  type: "Standard" | "Custom";
  category: "Financial" | "Production" | "Livestock" | "Crops" | "Inventory" | "General";
  description: string;
  parameters: ReportParameter[];
  lastGenerated?: string;
  frequency: "On Demand" | "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";
  format: "PDF" | "Excel" | "CSV" | "Web";
  status: "Available" | "Generating" | "Error";
}

interface ReportParameter {
  name: string;
  type: "date" | "dateRange" | "select" | "multiSelect" | "number";
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

interface ReportInstance {
  id: string;
  reportId: string;
  reportName: string;
  generatedDate: string;
  parameters: Record<string, any>;
  format: string;
  fileSize: string;
  status: "Ready" | "Generating" | "Failed";
}

export default function ReportsModule() {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportInstances, setReportInstances] = useState<ReportInstance[]>([]);
  const [activeTab, setActiveTab] = useState("standard");
  const [showCreateReportDialog, setShowCreateReportDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [newReport, setNewReport] = useState<Partial<Report>>({
    name: "",
    type: "Custom",
    category: "General",
    description: "",
    parameters: [],
    frequency: "On Demand",
    format: "PDF",
    status: "Available"
  });

  // Sample data initialization
  useEffect(() => {
    const sampleReports: Report[] = [
      {
        id: "1",
        name: "Financial Summary",
        type: "Standard",
        category: "Financial",
        description: "Complete financial overview including income, expenses, and profit/loss",
        parameters: [
          {
            name: "dateRange",
            type: "dateRange",
            label: "Date Range",
            required: true
          },
          {
            name: "includeDetails",
            type: "select",
            label: "Detail Level",
            required: false,
            options: ["Summary", "Detailed", "Line Items"],
            defaultValue: "Summary"
          }
        ],
        lastGenerated: "2024-07-10",
        frequency: "Monthly",
        format: "PDF",
        status: "Available"
      },
      {
        id: "2",
        name: "Crop Production Report",
        type: "Standard",
        category: "Crops",
        description: "Detailed analysis of crop yields, costs, and profitability by field and variety",
        parameters: [
          {
            name: "season",
            type: "select",
            label: "Growing Season",
            required: true,
            options: ["2024", "2023", "2022"],
            defaultValue: "2024"
          },
          {
            name: "crops",
            type: "multiSelect",
            label: "Crops to Include",
            required: false,
            options: ["Corn", "Soybeans", "Wheat", "Tomatoes", "All"]
          }
        ],
        lastGenerated: "2024-07-08",
        frequency: "Quarterly",
        format: "Excel",
        status: "Available"
      },
      {
        id: "3",
        name: "Livestock Health & Performance",
        type: "Standard",
        category: "Livestock",
        description: "Health records, breeding performance, and production metrics for all livestock",
        parameters: [
          {
            name: "dateRange",
            type: "dateRange",
            label: "Date Range",
            required: true
          },
          {
            name: "animalType",
            type: "select",
            label: "Animal Type",
            required: false,
            options: ["All", "Cattle", "Pigs", "Poultry", "Sheep"],
            defaultValue: "All"
          }
        ],
        lastGenerated: "2024-07-05",
        frequency: "Monthly",
        format: "PDF",
        status: "Available"
      },
      {
        id: "4",
        name: "Inventory Valuation",
        type: "Standard",
        category: "Inventory",
        description: "Current inventory levels, values, and turnover analysis",
        parameters: [
          {
            name: "asOfDate",
            type: "date",
            label: "As of Date",
            required: true,
            defaultValue: format(new Date(), "yyyy-MM-dd")
          },
          {
            name: "category",
            type: "multiSelect",
            label: "Categories",
            required: false,
            options: ["Seeds", "Fertilizer", "Chemicals", "Feed", "Equipment Parts"]
          }
        ],
        lastGenerated: "2024-07-12",
        frequency: "Weekly",
        format: "Excel",
        status: "Available"
      },
      {
        id: "5",
        name: "Labor & Activity Summary",
        type: "Standard",
        category: "General",
        description: "Time tracking, labor costs, and activity analysis across all farm operations",
        parameters: [
          {
            name: "dateRange",
            type: "dateRange",
            label: "Date Range",
            required: true
          },
          {
            name: "department",
            type: "select",
            label: "Department",
            required: false,
            options: ["All", "Crops", "Livestock", "Equipment", "General"],
            defaultValue: "All"
          }
        ],
        lastGenerated: "2024-07-07",
        frequency: "Monthly",
        format: "PDF",
        status: "Available"
      },
      {
        id: "6",
        name: "Custom Market Analysis",
        type: "Custom",
        category: "Financial",
        description: "Custom analysis of market trends and pricing for farm products",
        parameters: [
          {
            name: "products",
            type: "multiSelect",
            label: "Products",
            required: true,
            options: ["Corn", "Soybeans", "Milk", "Beef", "Eggs"]
          },
          {
            name: "period",
            type: "select",
            label: "Analysis Period",
            required: true,
            options: ["6 Months", "1 Year", "2 Years", "5 Years"],
            defaultValue: "1 Year"
          }
        ],
        frequency: "On Demand",
        format: "Excel",
        status: "Available"
      }
    ];

    const sampleInstances: ReportInstance[] = [
      {
        id: "1",
        reportId: "1",
        reportName: "Financial Summary",
        generatedDate: "2024-07-10T14:30:00",
        parameters: { dateRange: "June 2024", includeDetails: "Summary" },
        format: "PDF",
        fileSize: "2.3 MB",
        status: "Ready"
      },
      {
        id: "2",
        reportId: "2",
        reportName: "Crop Production Report",
        generatedDate: "2024-07-08T09:15:00",
        parameters: { season: "2024", crops: ["Corn", "Soybeans"] },
        format: "Excel",
        fileSize: "5.7 MB",
        status: "Ready"
      },
      {
        id: "3",
        reportId: "4",
        reportName: "Inventory Valuation",
        generatedDate: "2024-07-12T16:45:00",
        parameters: { asOfDate: "2024-07-12", category: ["All"] },
        format: "Excel",
        fileSize: "1.8 MB",
        status: "Ready"
      }
    ];

    setReports(sampleReports);
    setReportInstances(sampleInstances);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Financial": return "bg-green-100 text-green-800";
      case "Production": return "bg-blue-100 text-blue-800";
      case "Livestock": return "bg-purple-100 text-purple-800";
      case "Crops": return "bg-yellow-100 text-yellow-800";
      case "Inventory": return "bg-orange-100 text-orange-800";
      case "General": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": case "Ready": return "bg-green-100 text-green-800";
      case "Generating": return "bg-yellow-100 text-yellow-800";
      case "Error": case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "PDF": return <FileText className="h-4 w-4" />;
      case "Excel": return <FileSpreadsheet className="h-4 w-4" />;
      case "CSV": return <FileBarChart className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const standardReports = reports.filter(r => r.type === "Standard");
  const customReports = reports.filter(r => r.type === "Custom");
  const recentInstances = reportInstances.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600">Generate and manage farm reports and analytics</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowCreateReportDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Standard Reports</p>
                <p className="text-2xl font-bold text-gray-900">{standardReports.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custom Reports</p>
                <p className="text-2xl font-bold text-gray-900">{customReports.length}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Instances</p>
                <p className="text-2xl font-bold text-gray-900">{reportInstances.length}</p>
              </div>
              <Download className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Report Instances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Recent Report Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInstances.map((instance) => (
              <div key={instance.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {getFormatIcon(instance.format)}
                  <div>
                    <p className="font-medium">{instance.reportName}</p>
                    <p className="text-sm text-gray-600">
                      Generated {format(new Date(instance.generatedDate), "MMM dd, yyyy 'at' HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-sm">
                    <p className="font-medium">{instance.fileSize}</p>
                    <Badge className={getStatusColor(instance.status)} variant="outline">
                      {instance.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standard">Standard Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standardReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => { setSelectedReport(report); setShowGenerateDialog(true); }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(report.category)}>
                      {report.category}
                    </Badge>
                    <Badge variant="outline">{report.frequency}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{report.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <div className="flex items-center gap-1">
                        {getFormatIcon(report.format)}
                        <span className="font-medium">{report.format}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parameters:</span>
                      <span className="font-medium">{report.parameters.length}</span>
                    </div>
                    {report.lastGenerated && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Generated:</span>
                        <span className="font-medium">{report.lastGenerated}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => { setSelectedReport(report); setShowGenerateDialog(true); }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(report.category)}>
                      {report.category}
                    </Badge>
                    <Badge variant="outline">{report.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{report.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <div className="flex items-center gap-1">
                        {getFormatIcon(report.format)}
                        <span className="font-medium">{report.format}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parameters:</span>
                      <span className="font-medium">{report.parameters.length}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {customReports.length === 0 && (
            <div className="text-center py-12">
              <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Custom Reports</h3>
              <p className="text-gray-500 mb-4">Create custom reports tailored to your specific needs.</p>
              <Button onClick={() => setShowCreateReportDialog(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Custom Report
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Financial Trends</h3>
                <p className="text-gray-600 text-sm">Analyze financial performance over time</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Production Analytics</h3>
                <p className="text-gray-600 text-sm">Track yields and production efficiency</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <PieChart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Cost Analysis</h3>
                <p className="text-gray-600 text-sm">Break down costs by category and operation</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Report: {selectedReport?.name}</DialogTitle>
            <DialogDescription>
              Configure parameters for this report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedReport?.parameters.map((param, index) => (
              <div key={index}>
                <Label htmlFor={param.name}>{param.label}</Label>
                {param.type === "select" && (
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${param.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {param.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {param.type === "date" && (
                  <Input type="date" defaultValue={param.defaultValue} />
                )}
                {param.type === "dateRange" && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="Start Date" />
                    <Input type="date" placeholder="End Date" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Generate Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}