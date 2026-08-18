import Header from "@/components/header";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ScheduleModule from "@/components/schedule-module";
import TaskModule from "@/components/task-module";
import LivestockModule from "@/components/livestock-module";
import TimesheetModule from "@/components/timesheet-module";
import FarmCostsModule from "@/components/farm-costs-module";
import GrazingModule from "@/components/grazing-module";
import PlantingModule from "@/components/planting-module";
import PlantingTest from "@/components/planting-test";
import CropsModule from "@/components/crops-module";
import ResourcesModule from "@/components/resources-module";
import AccountingModule from "@/components/accounting-module";
import MarketModule from "@/components/market-module";
import ClimateModule from "@/components/climate-module";
import ContactsModule from "@/components/contacts-module";
import FarmMapModule from "@/components/farm-map-module";
import ReportsModule from "@/components/reports-module";
import EquipmentModule from "@/components/equipment-module";
import { 
  Home, 
  Users, 
  Beef, 
  Sprout, 
  Folder, 
  Calculator, 
  ShoppingCart, 
  CheckSquare, 
  Activity, 
  Package, 
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Calendar,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Cloud,
  Contact,
  ChevronDown,
  ChevronRight,
  Clock,
  LogIn,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";
import totagFarmLogoPath from "@assets/TOTAG FARM  Logo_1752502100780.png";

export default function FarmDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [livestockExpanded, setLivestockExpanded] = useState(false);
  const [livestockSubView, setLivestockSubView] = useState("animals");
  const [autoOpenGroupDialog, setAutoOpenGroupDialog] = useState(false);
  const [scheduleExpanded, setScheduleExpanded] = useState(false);
  const [scheduleSubView, setScheduleSubView] = useState("calendar");


  useEffect(() => {
    const userData = localStorage.getItem("farm_user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = "/farm/login";
    }
  }, []);

  const isManager = user?.role === "manager" || user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("farm_user");
    window.location.href = "/farm";
  };

  const handleQuickAdd = () => {
    setShowQuickAddModal(true);
  };



  const getQuickAddOptions = () => {
    const quickAddMap = {
      schedule: [
        { label: "New Event", action: () => console.log("Add Event") },
        { label: "New Meeting", action: () => console.log("Add Meeting") },
        { label: "New Reminder", action: () => console.log("Add Reminder") }
      ],
      tasks: [
        { label: "New Task", action: () => console.log("Add Task") },
        { label: "New Assignment", action: () => console.log("Add Assignment") }
      ],
      livestock: [
        { label: "New Animal", action: () => console.log("Add Animal") },
        { label: "New Breed", action: () => console.log("Add Breed") }
      ],
      planting: [
        { label: "New Planting", action: () => console.log("Add Planting") },
        { label: "New Crop", action: () => console.log("Add Crop") }
      ],
      resources: [
        { label: "New Resource", action: () => console.log("Add Resource") },
        { label: "New Equipment", action: () => console.log("Add Equipment") }
      ],
      accounting: [
        { label: "New Transaction", action: () => console.log("Add Transaction") },
        { label: "New Invoice", action: () => console.log("Add Invoice") }
      ],
      market: [
        { label: "New Product", action: () => console.log("Add Product") },
        { label: "New Order", action: () => console.log("Add Order") }
      ],
      contacts: [
        { label: "New Contact", action: () => console.log("Add Contact") },
        { label: "New Supplier", action: () => console.log("Add Supplier") }
      ],
      "farm-map": [
        { label: "New Location", action: () => console.log("Add Location") },
        { label: "New Field", action: () => console.log("Add Field") }
      ],
      climate: [
        { label: "New Reading", action: () => console.log("Add Reading") },
        { label: "New Alert", action: () => console.log("Add Alert") }
      ],
      reports: [
        { label: "New Report", action: () => console.log("Add Report") },
        { label: "New Analysis", action: () => console.log("Add Analysis") }
      ]
    };
    return quickAddMap[activeView as keyof typeof quickAddMap] || [];
  };

  const allSidebarItems = [
    { id: "overview", name: "Overview", icon: Home, color: "text-green-700", staffAllowed: true },
    { 
      id: "schedule", 
      name: "Schedule", 
      icon: Calendar, 
      color: "text-blue-600",
      hasSubmenu: true,
      staffAllowed: true,
      submenu: [
        { id: "calendar", name: "Calendar", icon: Calendar },
        { id: "timesheets", name: "Timesheets", icon: CheckSquare }
      ]
    },
    { id: "tasks", name: "Tasks", icon: CheckSquare, color: "text-purple-600", staffAllowed: true },
    { 
      id: "livestock", 
      name: "Livestock", 
      icon: Beef, 
      color: "text-green-600",
      hasSubmenu: true,
      staffAllowed: false,
      submenu: [
        { id: "animals", name: "Animals", icon: Beef },
        { id: "livestock-groups", name: "Livestock Groups", icon: Users },
        { id: "grazing", name: "Grazing", icon: MapPin }
      ]
    },
    { id: "planting", name: "Plantings", icon: Sprout, color: "text-green-500", staffAllowed: false },
    { id: "equipment", name: "Equipment", icon: Settings, color: "text-orange-500", staffAllowed: false },
    { id: "resources", name: "Resources", icon: Folder, color: "text-orange-600", staffAllowed: false },
    { id: "accounting", name: "Accounting", icon: Calculator, color: "text-blue-500", staffAllowed: false },
    { id: "market", name: "Market", icon: ShoppingCart, color: "text-indigo-600", staffAllowed: false },
    { id: "contacts", name: "Contacts", icon: Contact, color: "text-gray-600", staffAllowed: false },
    { id: "farm-map", name: "Farm Map", icon: MapPin, color: "text-red-500", staffAllowed: false },
    { id: "climate", name: "Climate", icon: Cloud, color: "text-sky-500", staffAllowed: false },
    { id: "reports", name: "Reports", icon: BarChart3, color: "text-red-600", staffAllowed: false },
    { id: "costs-pl", name: "Costs & P&L", icon: TrendingUp, color: "text-pink-600", staffAllowed: false },
  ];

  const sidebarItems = isManager
    ? allSidebarItems
    : allSidebarItems.filter(item => item.staffAllowed);

  const statsCards = [
    { title: "Total Livestock", value: "247", change: "+12", color: "bg-green-100 text-green-800", icon: Beef },
    { title: "Active Plantings", value: "8", change: "+2", color: "bg-green-50 text-green-700", icon: Sprout },
    { title: "Pending Tasks", value: "12", change: "-3", color: "bg-orange-100 text-orange-800", icon: CheckSquare },
    { title: "Scheduled Events", value: "6", change: "+1", color: "bg-blue-100 text-blue-800", icon: Calendar },
  ];

  const urgentTasks = [
    { id: 1, task: "Vaccinate cattle in Sector B", priority: "high", dueDate: "Today", assignee: "John Smith" },
    { id: 2, task: "Harvest tomatoes in Field A", priority: "medium", dueDate: "Tomorrow", assignee: "Jane Doe" },
    { id: 3, task: "Service irrigation system", priority: "high", dueDate: "Today", assignee: "Mike Johnson" },
  ];

  const recentActivities = [
    { id: 1, activity: "Fed cattle in Sector A", time: "2 hours ago", user: "John Smith", type: "feeding" },
    { id: 2, activity: "Harvested 500kg tomatoes", time: "4 hours ago", user: "Jane Doe", type: "harvest" },
    { id: 3, activity: "Tractor maintenance completed", time: "6 hours ago", user: "Mike Johnson", type: "maintenance" },
    { id: 4, activity: "Planted new corn seeds", time: "1 day ago", user: "Sarah Wilson", type: "planting" },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center space-x-3">
                <img 
                  src={totagFarmLogoPath} 
                  alt="TOTAG FARM Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-lg font-bold text-gray-900">TOTAG FARM</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1"
            >
              {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* User Info */}
        {isSidebarOpen && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user.firstName?.[0] || user.username[0].toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role} • {user.department}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id || (item.hasSubmenu && activeView.startsWith(item.id));
              
              if (item.hasSubmenu) {
                const isExpanded = item.id === "livestock" ? livestockExpanded : scheduleExpanded;
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => {
                        if (item.id === "livestock") {
                          setLivestockExpanded(!livestockExpanded);
                          if (!livestockExpanded) {
                            setActiveView("livestock");
                          }
                        } else if (item.id === "schedule") {
                          setScheduleExpanded(!scheduleExpanded);
                          if (!scheduleExpanded) {
                            setActiveView("schedule");
                          }
                        }
                      }}
                      className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-3' : 'justify-center px-2'} py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`flex items-center ${isSidebarOpen ? 'space-x-3' : ''}`}>
                        <Icon className={`h-5 w-5 ${item.color}`} />
                        {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                      </div>
                      {isSidebarOpen && (
                        isExpanded ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {isExpanded && isSidebarOpen && (
                      <div className="ml-6 space-y-1">
                        {item.submenu?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          let isSubActive = false;
                          
                          if (item.id === "livestock") {
                            isSubActive = 
                              (subItem.id === "animals" && activeView === "livestock") ||
                              activeView === `livestock-${subItem.id}`;
                          } else if (item.id === "schedule") {
                            isSubActive = 
                              (subItem.id === "calendar" && activeView === "schedule") ||
                              activeView === `schedule-${subItem.id}`;
                          }
                          
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                if (item.id === "livestock") {
                                  if (subItem.id === "animals") {
                                    setActiveView("livestock");
                                    setLivestockSubView("animals");
                                  } else {
                                    setActiveView(`livestock-${subItem.id}`);
                                    setLivestockSubView(subItem.id);
                                  }
                                } else if (item.id === "schedule") {
                                  if (subItem.id === "calendar") {
                                    setActiveView("schedule");
                                    setScheduleSubView("calendar");
                                  } else {
                                    setActiveView(`schedule-${subItem.id}`);
                                    setScheduleSubView(subItem.id);
                                  }
                                }
                              }}
                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isSubActive 
                                  ? 'bg-blue-100 text-blue-600 border border-blue-300' 
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <SubIcon className={`h-4 w-4 ${isSubActive ? "text-blue-600" : "text-gray-400"}`} />
                              <span>{subItem.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center ${isSidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'} py-2 rounded-lg transition-colors ${
                    activeView === item.id 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              onClick={() => setActiveView("settings")}
            >
              <Settings className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Settings</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-red-600 hover:text-red-700 hover:bg-red-50`}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {activeView === "overview" ? "Dashboard Overview" :
                 activeView === "livestock-livestock-groups" ? "Livestock Groups" :
                 activeView === "livestock-grazing" ? "Grazing Management" :
                 activeView === "schedule-timesheets" ? "Timesheets" :
                 activeView === "planting" ? "Plantings Management" :
                 activeView === "crops" ? "Crop Management" :
                 activeView === "resources" ? "Resource Management" :
                 activeView === "accounting" ? "Accounting" :
                 activeView === "market" ? "Market Management" :
                 activeView === "climate" ? "Climate Management" :
                 activeView === "contacts" ? "Contacts" :
                 activeView === "farm-map" ? "Farm Map" :
                 activeView === "reports" ? "Reports" :
                 activeView}
              </h1>
              <p className="text-gray-600">Farm Management Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {getQuickAddOptions().map((option, index) => (
                    <DropdownMenuItem key={index} onClick={option.action}>
                      <Plus className="h-4 w-4 mr-2" />
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/farm">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Public View
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {activeView === "overview" && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-1">
                  Welcome back, {user?.firstName || user?.username}!
                </h2>
                <p className="text-green-100 text-sm">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} &nbsp;·&nbsp; TOTAG Farm Management System
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button size="sm" className="bg-white text-green-700 hover:bg-green-50" onClick={() => setActiveView("tasks")}>
                    <CheckSquare className="h-4 w-4 mr-2" /> View Tasks
                  </Button>
                  <Button size="sm" className="bg-white text-green-700 hover:bg-green-50" onClick={() => setActiveView("schedule")}>
                    <Calendar className="h-4 w-4 mr-2" /> Open Schedule
                  </Button>
                  {isManager && (
                    <Button size="sm" className="bg-white text-green-700 hover:bg-green-50" onClick={() => setActiveView("livestock")}>
                      <Beef className="h-4 w-4 mr-2" /> Livestock
                    </Button>
                  )}
                </div>
              </div>

              {/* ── Clock-In Widget (prominent for staff) ── */}
              <ClockInWidget currentUser={user} isManager={isManager} onGoToTimesheets={() => setActiveView("schedule-timesheets")} />

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView(idx === 0 ? "livestock" : idx === 1 ? "planting" : idx === 2 ? "tasks" : "schedule")}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.color}`}>{stat.title}</span>
                          <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-500"}>{stat.change}</span> from last week
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Urgent Tasks + Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Urgent Tasks */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Urgent Tasks
                      </div>
                      <Button size="sm" variant="ghost" className="text-green-600 text-xs" onClick={() => setActiveView("tasks")}>
                        View All →
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {urgentTasks.map(task => (
                      <div key={task.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">{task.task}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{task.assignee} · Due: {task.dueDate}</p>
                        </div>
                        <Badge className={`ml-3 shrink-0 text-xs ${task.priority === "high" ? "bg-red-100 text-red-700 border-red-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}`} variant="outline">
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        Recent Activity
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivities.map(item => (
                      <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 font-medium truncate">{item.activity}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.user} · {item.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Access Modules */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-5 w-5 text-gray-500" />
                    Quick Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { id: "livestock", label: "Livestock", icon: Beef, color: "bg-green-50 text-green-700 hover:bg-green-100" },
                      { id: "planting", label: "Plantings", icon: Sprout, color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
                      { id: "equipment", label: "Equipment", icon: Settings, color: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
                      { id: "accounting", label: "Accounting", icon: Calculator, color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
                      { id: "market", label: "Market", icon: ShoppingCart, color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" },
                      { id: "reports", label: "Reports", icon: BarChart3, color: "bg-red-50 text-red-700 hover:bg-red-100" },
                    ].map(mod => {
                      const Icon = mod.icon;
                      return (
                        <button key={mod.id} onClick={() => setActiveView(mod.id)}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-100 transition-colors ${mod.color}`}>
                          <Icon className="h-6 w-6" />
                          <span className="text-xs font-medium">{mod.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {activeView === "schedule" && (
            <ScheduleModule />
          )}
          {activeView === "schedule-timesheets" && (
            <TimesheetModule userRole={user?.role} currentUser={user} />
          )}
          {activeView === "tasks" && (
            <TaskModule userRole={user?.role} currentUser={user} />
          )}
          {activeView === "livestock" && (
            <LivestockModule autoOpenGroupDialog={autoOpenGroupDialog} onGroupDialogClose={() => setAutoOpenGroupDialog(false)} />
          )}
          {activeView === "livestock-livestock-groups" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-600" />
                  Livestock Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Livestock Groups</h3>
                  <p className="text-gray-500 mb-4">Manage and organize your animals into groups for easier management.</p>
                  <Button onClick={() => {
                    setActiveView("livestock");
                    setLivestockSubView("animals");
                    setAutoOpenGroupDialog(true);
                  }} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {activeView === "livestock-grazing" && (
            <GrazingModule />
          )}
          {activeView === "planting" && (
            <PlantingModule />
          )}
          {activeView === "equipment" && (
            <EquipmentModule />
          )}
          {activeView === "crops" && (
            <CropsModule />
          )}
          {activeView === "resources" && (
            <ResourcesModule />
          )}
          {activeView === "accounting" && (
            <AccountingModule />
          )}
          {activeView === "market" && (
            <MarketModule />
          )}
          {activeView === "climate" && (
            <ClimateModule />
          )}
          {activeView === "contacts" && (
            <ContactsModule />
          )}
          {activeView === "farm-map" && (
            <FarmMapModule userRole={user?.role} />
          )}
          {activeView === "reports" && (
            <ReportsModule />
          )}
          {activeView === "costs-pl" && (
            <FarmCostsModule userRole={user?.role} />
          )}

          {/* Placeholder content for other views */}
          {activeView !== "overview" && activeView !== "schedule" && activeView !== "schedule-timesheets" && activeView !== "tasks" && activeView !== "livestock" && !activeView.startsWith("livestock-") && activeView !== "planting" && activeView !== "equipment" && activeView !== "crops" && activeView !== "resources" && activeView !== "accounting" && activeView !== "market" && activeView !== "climate" && activeView !== "contacts" && activeView !== "farm-map" && activeView !== "reports" && activeView !== "costs-pl" && (
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeView} Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {sidebarItems.find(item => item.id === activeView)?.icon && (
                      <div className="h-8 w-8 text-gray-400">
                        {(() => {
                          const IconComponent = sidebarItems.find(item => item.id === activeView)?.icon;
                          return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
                        })()}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeView.charAt(0).toUpperCase() + activeView.slice(1)} Module
                  </h3>
                  <p className="text-gray-500 mb-4">
                    This section is being developed. Full {activeView} management features coming soon.
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New {activeView === "farm-map" ? "Location" : activeView.slice(0, -1)}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48">
                      {getQuickAddOptions().map((option, index) => (
                        <DropdownMenuItem key={index} onClick={option.action}>
                          <Plus className="h-4 w-4 mr-2" />
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>


    </div>
  );
}

// ─── Clock-In Widget (shown on Overview) ─────────────────────────────────────

const ACTIVITIES = [
  "Feeding Animals", "Harvesting Crops", "Equipment Maintenance", "Field Preparation",
  "Irrigation", "Planting", "Weeding", "Pest Control", "Loading / Transport",
  "Cleaning / Sanitation", "Record Keeping", "Other"
];

function ClockInWidget({ currentUser, isManager, onGoToTimesheets }: {
  currentUser: any;
  isManager: boolean;
  onGoToTimesheets: () => void;
}) {
  const TIMER_KEY = "farm_active_timer";
  const STORAGE_KEY = "farm_time_entries";
  const RATES_KEY = "farm_staff_rates";

  const [activeTimer, setActiveTimer] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [activity, setActivity] = useState("Feeding Animals");
  const [location, setLocation] = useState("Main Farm");

  const workerName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || currentUser.username || "Farm Staff"
    : "Farm Staff";

  useEffect(() => {
    const saved = localStorage.getItem(TIMER_KEY);
    if (saved) {
      try {
        const t = JSON.parse(saved);
        t.startTime = new Date(t.startTime);
        setActiveTimer(t);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!activeTimer) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(activeTimer.startTime).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const getRate = (name: string) => {
    try {
      const rates = JSON.parse(localStorage.getItem(RATES_KEY) || "[]");
      const found = rates.find((r: any) => r.name.toLowerCase() === name.toLowerCase());
      return found ? found.hourlyRate : 5.00;
    } catch { return 5.00; }
  };

  const clockIn = () => {
    const rate = getRate(workerName);
    const timer = { id: Date.now().toString(), worker: workerName, activity, location, startTime: new Date().toISOString(), hourlyRate: rate };
    localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
    setActiveTimer({ ...timer, startTime: new Date(timer.startTime) });
    setShowDialog(false);
  };

  const clockOut = () => {
    if (!activeTimer) return;
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - new Date(activeTimer.startTime).getTime()) / (1000 * 60));
    const totalPay = Math.round((duration / 60) * activeTimer.hourlyRate * 100) / 100;
    const entry = {
      id: activeTimer.id, worker: activeTimer.worker, activity: activeTimer.activity,
      location: activeTimer.location, startTime: new Date(activeTimer.startTime).toISOString(),
      endTime: endTime.toISOString(), duration, hourlyRate: activeTimer.hourlyRate,
      totalPay, date: new Date(activeTimer.startTime).toISOString().split("T")[0], status: "completed",
    };
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]));
    localStorage.removeItem(TIMER_KEY);
    setActiveTimer(null);
    setElapsed(0);
    onGoToTimesheets();
  };

  const fmt = (secs: number) => {
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };
  const earned = activeTimer ? ((elapsed / 3600) * activeTimer.hourlyRate).toFixed(2) : "0.00";

  if (activeTimer) {
    return (
      <Card className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-green-900">You're Clocked In</p>
                <p className="text-sm text-green-700">{activeTimer.activity} · {activeTimer.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold font-mono text-green-800">{fmt(elapsed)}</p>
                <p className="text-xs text-green-600">time worked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">${earned}</p>
                <p className="text-xs text-green-600">earned</p>
              </div>
              <Button onClick={clockOut} className="bg-red-600 hover:bg-red-700 text-white h-11 px-5">
                <LogOut className="h-4 w-4 mr-2" /> Clock Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-dashed border-2 border-green-300 bg-green-50/50">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-green-200">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">You are not clocked in</p>
              <p className="text-sm text-gray-500">Clock in to start tracking your work hours and pay.</p>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 h-11 px-6 shrink-0" onClick={() => setShowDialog(true)}>
            <LogIn className="h-5 w-5 mr-2" /> Clock In Now
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[380px]">
          <div className="flex items-center gap-2 mb-1">
            <LogIn className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">Clock In</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Clocking in as <strong>{workerName}</strong> — your hours will be tracked automatically.
          </p>
          <div className="space-y-3">
            <div>
              <Label>Activity</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACTIVITIES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location / Area</Label>
              <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Sector A, Field B" />
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
              Rate: <strong>${getRate(workerName).toFixed(2)}/hr</strong>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={clockIn}>
              <LogIn className="h-4 w-4 mr-2" /> Clock In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
