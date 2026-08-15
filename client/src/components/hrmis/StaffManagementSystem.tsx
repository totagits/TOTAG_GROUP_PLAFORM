import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  UserPlus, 
  Clock, 
  Calendar, 
  DollarSign, 
  Award, 
  Search,
  Plus,
  Edit,
  Eye,
  FileText,
  MapPin,
  Phone,
  Mail,
  Building2,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  department: string;
  position: string;
  jobTitle: string;
  employmentType: string;
  employmentStatus: string;
  startDate: string;
  baseSalary: string;
  managerId?: number;
  profilePhoto?: string;
}

interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  clockIn?: string;
  clockOut?: string;
  hoursWorked?: string;
  status: string;
  location?: string;
}

interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: string;
  appliedDate: string;
}

interface Payroll {
  id: number;
  employeeId: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  baseSalary: string;
  grossPay: string;
  totalDeductions: string;
  netPay: string;
  status: string;
  paymentDate?: string;
}

interface PerformanceReview {
  id: number;
  employeeId: number;
  reviewerId: number;
  reviewPeriod: string;
  overallRating?: number;
  status: string;
  reviewDate: string;
}

export function StaffManagementSystem() {
  const [activeModule, setActiveModule] = useState("overview");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { toast } = useToast();

  // Sample data for demonstration
  const sampleEmployees: Employee[] = [
    {
      id: 1,
      employeeId: "TGM001",
      firstName: "John",
      lastName: "Karngar",
      email: "john.karngar@tgm.totag.com",
      phone: "+231 77 123 4567",
      department: "Management",
      position: "General Manager",
      jobTitle: "General Manager",
      employmentType: "full_time",
      employmentStatus: "active",
      startDate: "2023-01-15",
      baseSalary: "5000.00",
      profilePhoto: undefined
    },
    {
      id: 2,
      employeeId: "TGM002",
      firstName: "Mary",
      lastName: "Johnson",
      email: "mary.johnson@tgm.totag.com",
      phone: "+231 77 234 5678",
      department: "HR",
      position: "HR Manager",
      jobTitle: "Human Resources Manager",
      employmentType: "full_time",
      employmentStatus: "active",
      startDate: "2023-02-01",
      baseSalary: "3500.00"
    },
    {
      id: 3,
      employeeId: "TGM003",
      firstName: "David",
      lastName: "Williams",
      email: "david.williams@tgm.totag.com",
      phone: "+231 77 345 6789",
      department: "Warehouse",
      position: "Warehouse Supervisor",
      jobTitle: "Warehouse Operations Supervisor",
      employmentType: "full_time",
      employmentStatus: "active",
      startDate: "2023-03-01",
      baseSalary: "2800.00"
    },
    {
      id: 4,
      employeeId: "TGM004",
      firstName: "Sarah",
      lastName: "Davis",
      email: "sarah.davis@tgm.totag.com",
      phone: "+231 77 456 7890",
      department: "Sales",
      position: "Sales Representative",
      jobTitle: "Senior Sales Representative",
      employmentType: "full_time",
      employmentStatus: "active",
      startDate: "2023-04-15",
      baseSalary: "2200.00"
    },
    {
      id: 5,
      employeeId: "TGM005",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@tgm.totag.com",
      phone: "+231 77 567 8901",
      department: "Delivery",
      position: "Delivery Driver",
      jobTitle: "Senior Delivery Driver",
      employmentType: "full_time",
      employmentStatus: "active",
      startDate: "2023-05-01",
      baseSalary: "1800.00"
    }
  ];

  // Initialize sample data
  useState(() => {
    setEmployees(sampleEmployees);
  });

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "on_leave": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "terminated": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case "full_time": return "bg-blue-100 text-blue-800";
      case "part_time": return "bg-purple-100 text-purple-800";
      case "contract": return "bg-orange-100 text-orange-800";
      case "internship": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* HRMIS Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Staff Management System</h2>
          <p className="text-gray-600">Human Resource Management Information System (HRMIS)</p>
        </div>
        <Button onClick={() => setShowAddEmployeeModal(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Employee
        </Button>
      </div>

      {/* Module Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "overview", label: "Overview", icon: Users },
          { id: "employees", label: "Employee Management", icon: Users },
          { id: "attendance", label: "Attendance", icon: Clock },
          { id: "leave", label: "Leave Management", icon: Calendar },
          { id: "payroll", label: "Payroll", icon: DollarSign },
          { id: "performance", label: "Performance Reviews", icon: Award }
        ].map(module => (
          <Button
            key={module.id}
            variant={activeModule === module.id ? "default" : "outline"}
            onClick={() => setActiveModule(module.id)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <module.icon className="h-4 w-4" />
            {module.label}
          </Button>
        ))}
      </div>

      {/* Overview Module */}
      {activeModule === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Employees</p>
                    <p className="text-3xl font-bold">{employees.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Employees</p>
                    <p className="text-3xl font-bold text-green-600">
                      {employees.filter(emp => emp.employmentStatus === "active").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Departments</p>
                    <p className="text-3xl font-bold">{departments.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Salary</p>
                    <p className="text-3xl font-bold">
                      ${Math.round(employees.reduce((sum, emp) => sum + parseFloat(emp.baseSalary), 0) / employees.length).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>Employee distribution across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map(dept => {
                  const deptEmployees = employees.filter(emp => emp.department === dept);
                  const percentage = (deptEmployees.length / employees.length) * 100;
                  return (
                    <div key={dept} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium">{dept}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-16">
                          {deptEmployees.length} ({Math.round(percentage)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Employee Management Module */}
      {activeModule === "employees" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Manage all employee records and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <select
                  className="px-4 py-2 border rounded-lg"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Employee Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Employee</th>
                      <th className="text-left p-3">ID</th>
                      <th className="text-left p-3">Department</th>
                      <th className="text-left p-3">Position</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Salary</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(employee => (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                              <p className="text-sm text-gray-600">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-sm">{employee.employeeId}</td>
                        <td className="p-3">{employee.department}</td>
                        <td className="p-3">{employee.position}</td>
                        <td className="p-3">
                          <Badge className={getEmploymentTypeColor(employee.employmentType)}>
                            {employee.employmentType.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(employee.employmentStatus)}>
                            {employee.employmentStatus.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-3 font-semibold">${parseFloat(employee.baseSalary).toLocaleString()}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setShowEmployeeModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Module */}
      {activeModule === "attendance" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Management</CardTitle>
              <CardDescription>Track employee attendance and working hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance System</h3>
                <p className="text-gray-600 mb-4">
                  Track daily attendance, clock in/out times, and working hours for all employees.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leave Management Module */}
      {activeModule === "leave" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Management</CardTitle>
              <CardDescription>Manage employee leave requests and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Leave Management System</h3>
                <p className="text-gray-600 mb-4">
                  Process leave requests, track vacation days, and manage employee time off.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Leave Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payroll Module */}
      {activeModule === "payroll" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Management</CardTitle>
              <CardDescription>Process salaries, deductions, and payment records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payroll Processing System</h3>
                <p className="text-gray-600 mb-4">
                  Calculate salaries, manage deductions, and process monthly payroll for all employees.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Process Payroll
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Reviews Module */}
      {activeModule === "performance" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>Manage employee performance evaluations and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Management System</h3>
                <p className="text-gray-600 mb-4">
                  Conduct performance reviews, set goals, and track employee development progress.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Performance Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Employee Detail Modal */}
      <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>Complete employee information and records</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">
                    {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedEmployee.jobTitle}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getStatusColor(selectedEmployee.employmentStatus)}>
                      {selectedEmployee.employmentStatus.replace('_', ' ')}
                    </Badge>
                    <Badge className={getEmploymentTypeColor(selectedEmployee.employmentType)}>
                      {selectedEmployee.employmentType.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Employee Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Employee ID</Label>
                  <p className="font-mono">{selectedEmployee.employeeId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Department</Label>
                  <p>{selectedEmployee.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedEmployee.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedEmployee.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Start Date</Label>
                  <p>{new Date(selectedEmployee.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Base Salary</Label>
                  <p className="font-semibold">${parseFloat(selectedEmployee.baseSalary).toLocaleString()}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Employee
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Records
                </Button>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Attendance
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Employee Modal */}
      <Dialog open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Create a new employee record in the HRMIS system</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center py-8">
              <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Registration Form</h3>
              <p className="text-gray-600 mb-4">
                Complete employee registration form will be available here with all required fields.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Registration Form
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}