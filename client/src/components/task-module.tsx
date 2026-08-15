import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar, 
  Plus, 
  Clock, 
  User, 
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  Edit,
  Trash2,
  Copy,
  Calendar as CalendarIcon,
  List,
  Kanban,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "not_started" | "in_progress" | "completed" | "on_hold";
  assignee: string;
  dueDate: string;
  dueTime?: string;
  estimatedHours?: number;
  createdDate: string;
  category: string;
  location?: string;
  tags: string[];
  completed?: boolean;
}

interface TaskModuleProps {
  userRole?: string;
  currentUser?: { username?: string; firstName?: string; lastName?: string; role?: string };
}

interface CalendarDay {
  date: Date;
  tasks: Task[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function TaskModule({ userRole = "manager", currentUser }: TaskModuleProps) {
  const isManager = userRole === "manager" || userRole === "admin" || userRole === "General Manager";
  const currentUserFullName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || currentUser.username || ""
    : "";

  const [viewMode, setViewMode] = useState<"list" | "board" | "calendar">("list");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Weekly Livestock Health Check",
      description: "Perform comprehensive health inspection of all cattle and sheep",
      priority: "high",
      status: "not_started",
      assignee: "John Smith",
      dueDate: "2025-01-15",
      createdDate: "2025-01-10",
      category: "Livestock",
      location: "Pasture A",
      tags: ["health", "routine", "livestock"],
      completed: false
    },
    {
      id: "2",
      title: "Irrigation System Maintenance",
      description: "Replace damaged sprinkler heads and check water pressure",
      priority: "medium",
      status: "in_progress",
      assignee: "Mike Johnson",
      dueDate: "2025-01-16",
      createdDate: "2025-01-08",
      category: "Equipment",
      location: "Field B",
      tags: ["maintenance", "irrigation", "crops"],
      completed: false
    },
    {
      id: "3",
      title: "Fertilizer Application - Corn Field",
      description: "Apply organic fertilizer to the north corn field",
      priority: "high",
      status: "completed",
      assignee: "Sarah Wilson",
      dueDate: "2025-01-12",
      createdDate: "2025-01-05",
      category: "Crops",
      location: "North Corn Field",
      tags: ["fertilizer", "crops", "corn"],
      completed: true
    },
    {
      id: "4",
      title: "Equipment Cleaning",
      description: "Deep clean and sanitize all harvesting equipment",
      priority: "low",
      status: "on_hold",
      assignee: "Jane Doe",
      dueDate: "2025-01-20",
      createdDate: "2025-01-11",
      category: "Equipment",
      location: "Equipment Shed",
      tags: ["cleaning", "equipment", "maintenance"],
      completed: false
    },
    {
      id: "5",
      title: "Crop Harvest Planning",
      description: "Plan harvest schedule for winter wheat",
      priority: "medium",
      status: "not_started",
      assignee: "John Smith",
      dueDate: new Date().toISOString().split("T")[0],
      createdDate: new Date().toISOString().split("T")[0],
      category: "Crops",
      location: "West Field",
      tags: ["planning", "harvest", "wheat"],
      estimatedHours: 3,
      completed: false
    },
    {
      id: "6",
      title: "Morning Livestock Feed & Water Check",
      description: "Feed all livestock in Sector A and B, check water troughs and refill as needed",
      priority: "high",
      status: "not_started",
      assignee: "Farm Staff",
      dueDate: new Date().toISOString().split("T")[0],
      dueTime: "07:00",
      createdDate: new Date().toISOString().split("T")[0],
      category: "Livestock",
      location: "Sector A & B",
      tags: ["daily", "livestock", "feeding"],
      estimatedHours: 2,
      completed: false
    },
    {
      id: "7",
      title: "Irrigation Line Inspection – Field C",
      description: "Walk the drip lines in Field C, flag any leaks or clogged emitters for repair",
      priority: "medium",
      status: "in_progress",
      assignee: "Farm Staff",
      dueDate: new Date().toISOString().split("T")[0],
      dueTime: "10:00",
      createdDate: new Date().toISOString().split("T")[0],
      category: "Equipment",
      location: "Field C",
      tags: ["irrigation", "maintenance"],
      estimatedHours: 1.5,
      completed: false
    },
    {
      id: "8",
      title: "Harvest Tomatoes – Greenhouse Row 3",
      description: "Pick ripe tomatoes from greenhouse row 3 and transport to packing shed",
      priority: "high",
      status: "not_started",
      assignee: "Farm Staff",
      dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      dueTime: "08:00",
      createdDate: new Date().toISOString().split("T")[0],
      category: "Crops",
      location: "Greenhouse Row 3",
      tags: ["harvest", "tomatoes", "greenhouse"],
      estimatedHours: 3,
      completed: false
    },
    {
      id: "9",
      title: "Weekly Staff Performance Review",
      description: "Review task completion rates and hold 1:1 check-ins with field team",
      priority: "medium",
      status: "not_started",
      assignee: "Farm Manager",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      createdDate: new Date().toISOString().split("T")[0],
      category: "Planning",
      location: "Office",
      tags: ["management", "review", "team"],
      estimatedHours: 2,
      completed: false
    },
    {
      id: "10",
      title: "Update Livestock Health Records",
      description: "Enter vaccination and health check data into the farm management system",
      priority: "low",
      status: "not_started",
      assignee: "Farm Manager",
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
      createdDate: new Date().toISOString().split("T")[0],
      category: "Livestock",
      location: "Office",
      tags: ["records", "health", "livestock"],
      estimatedHours: 1,
      completed: false
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    status: "not_started" as const,
    assignee: "",
    dueDate: "",
    dueTime: "",
    estimatedHours: 0,
    category: "",
    location: "",
    tags: ""
  });

  const users = ["John Smith", "Jane Doe", "Mike Johnson", "Sarah Wilson", "Farm Staff", "Farm Manager"];
  const categories = ["Livestock", "Crops", "Equipment", "General", "Planning"];
  const statuses = [
    { value: "not_started", label: "Not Started", color: "bg-gray-100 text-gray-800" },
    { value: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
    { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
    { value: "on_hold", label: "On Hold", color: "bg-yellow-100 text-yellow-800" }
  ];

  const addTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      createdDate: new Date().toISOString().split('T')[0],
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      status: "not_started",
      assignee: "",
      dueDate: "",
      dueTime: "",
      estimatedHours: 0,
      category: "",
      location: "",
      tags: ""
    });
    setShowAddTaskDialog(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setShowEditDialog(false);
    setSelectedTask(null);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            status: !task.completed ? "completed" : "not_started"
          }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || "bg-gray-100 text-gray-800";
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = selectedFilter === "all" || task.status === selectedFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    // Staff only see tasks assigned to them
    const matchesRole = isManager || (
      currentUserFullName &&
      task.assignee.toLowerCase().includes(currentUserFullName.split(" ")[0].toLowerCase())
    ) || (
      currentUser?.username &&
      task.assignee.toLowerCase().includes(currentUser.username.toLowerCase())
    );
    return matchesFilter && matchesSearch && matchesRole;
  });

  const tasksByStatus = {
    not_started: filteredTasks.filter(task => task.status === "not_started"),
    in_progress: filteredTasks.filter(task => task.status === "in_progress"),
    completed: filteredTasks.filter(task => task.status === "completed"),
    on_hold: filteredTasks.filter(task => task.status === "on_hold")
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredTasks.filter(task => task.dueDate === dateStr);
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstCalendarDay = new Date(firstDayOfMonth);
    firstCalendarDay.setDate(firstCalendarDay.getDate() - firstDayOfMonth.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(firstCalendarDay);
      date.setDate(firstCalendarDay.getDate() + i);
      
      days.push({
        date,
        tasks: getTasksForDate(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{isManager ? "All Tasks" : "My Tasks"}</h1>
          {!isManager && (
            <p className="text-sm text-gray-500 mt-0.5">Showing tasks assigned to you</p>
          )}
        </div>
        
        <div className="flex gap-2">
          {isManager && (
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
              setNewTask({ title: "", description: "", priority: "medium", status: "not_started", assignee: "", dueDate: new Date().toISOString().split("T")[0], dueTime: "", estimatedHours: 0, category: "", location: "", tags: "" });
              setShowAddTaskDialog(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Assign Task
            </Button>
          )}
        </div>
      </div>

      {/* ── Add Task Dialog (controlled, opened from button OR calendar cell) ── */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              {newTask.dueDate
                ? `Add Task — ${new Date(newTask.dueDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
                : "Add New Task"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div>
              <Label htmlFor="task-title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="e.g. Feed cattle in Pasture A"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="What needs to be done? Include any important details."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Low</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="high">🔴 High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={newTask.status} onValueChange={(value: any) => setNewTask({...newTask, status: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Assignee</Label>
                <Select value={newTask.assignee} onValueChange={(value) => setNewTask({...newTask, assignee: value})}>
                  <SelectTrigger><SelectValue placeholder="Select person" /></SelectTrigger>
                  <SelectContent>
                    {users.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
              <div>
                <Label>Due Time</Label>
                <Input type="time" value={newTask.dueTime} onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estimated Hours</Label>
                <Input type="number" step="0.5" min="0" value={newTask.estimatedHours || ""} placeholder="e.g. 2.5" onChange={(e) => setNewTask({...newTask, estimatedHours: Number(e.target.value)})} />
              </div>
              <div>
                <Label>Location / Area</Label>
                <Input value={newTask.location} onChange={(e) => setNewTask({...newTask, location: e.target.value})} placeholder="e.g. Pasture A, Field B" />
              </div>
            </div>
            <div>
              <Label>Tags <span className="text-gray-400 text-xs">(comma separated)</span></Label>
              <Input value={newTask.tags} onChange={(e) => setNewTask({...newTask, tags: e.target.value})} placeholder="livestock, routine, urgent" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddTaskDialog(false)}>Cancel</Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={addTask}
                disabled={!newTask.title.trim()}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === "board" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("board")}
          >
            <Kanban className="h-4 w-4 mr-2" />
            Board
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="p-1"
                    >
                      <CheckCircle className={`h-5 w-5 ${task.completed ? 'text-green-600' : 'text-gray-400'}`} />
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h3>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(task.status)}>
                          {statuses.find(s => s.value === task.status)?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due: {task.dueDate}{task.dueTime ? ` at ${task.dueTime}` : ""}
                        </span>
                        {task.estimatedHours ? (
                          <span className="flex items-center gap-1">
                            ⏱ {task.estimatedHours}h
                          </span>
                        ) : null}
                        {task.location && (
                          <span>📍 {task.location}</span>
                        )}
                      </div>
                      <div className="flex gap-1 mt-2">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setSelectedTask(task);
                        setShowEditDialog(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        {isManager ? "Edit" : "Update Status"}
                      </DropdownMenuItem>
                      {isManager && <>
                        <DropdownMenuItem onClick={() => {
                          const newTaskCopy = { ...task, id: Date.now().toString(), title: `${task.title} (Copy)` };
                          setTasks([...tasks, newTaskCopy]);
                        }}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tasks found. {searchTerm && "Try adjusting your search criteria."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statuses.map(status => (
            <Card key={status.value}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>{status.label}</span>
                  <Badge variant="secondary">{tasksByStatus[status.value as keyof typeof tasksByStatus].length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasksByStatus[status.value as keyof typeof tasksByStatus].map(task => (
                    <div key={task.id} className="p-3 border rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Badge variant="outline" className={getPriorityColor(task.priority) + " text-xs"}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.dueDate}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {task.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{task.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === "calendar" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Task Calendar</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold min-w-[160px] text-center">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center font-medium text-gray-500 text-sm border-b">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] border border-gray-200 p-2 ${
                    !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                  } ${day.isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                >
                  <div className={`text-sm font-medium mb-2 ${day.isToday ? 'text-blue-600' : ''}`}>
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {day.tasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 ${getPriorityColor(task.priority)}`}
                        onClick={() => {
                          setSelectedTask(task);
                          setShowEditDialog(true);
                        }}
                        title={`${task.title} - ${task.description}`}
                      >
                        <div className="flex items-center gap-1">
                          <CheckCircle className={`h-3 w-3 ${task.completed ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={`truncate ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {task.assignee}
                        </div>
                      </div>
                    ))}
                    {day.tasks.length > 3 && (
                      <div
                        className="text-xs text-blue-500 font-medium cursor-pointer hover:underline"
                        onClick={() => {
                          setSelectedTask(day.tasks[3]);
                          setShowEditDialog(true);
                        }}
                      >
                        +{day.tasks.length - 3} more
                      </div>
                    )}
                    {day.isCurrentMonth && isManager && (
                      <div
                        className="text-xs text-gray-400 hover:text-green-700 hover:bg-green-50 cursor-pointer px-1 py-0.5 rounded text-center transition-colors mt-1 border border-dashed border-gray-200 hover:border-green-300"
                        onClick={() => {
                          setNewTask({
                            title: "", description: "", priority: "medium", status: "not_started",
                            assignee: "", dueDate: day.date.toISOString().split('T')[0],
                            dueTime: "", estimatedHours: 0, category: "", location: "", tags: ""
                          });
                          setShowAddTaskDialog(true);
                        }}
                      >
                        + Add task
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Calendar Legend */}
            <div className="flex items-center gap-6 mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                <span className="text-xs text-gray-600">High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                <span className="text-xs text-gray-600">Medium Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-xs text-gray-600">Low Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs text-gray-600">Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Task Dialog */}
      {selectedTask && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {isManager ? (
                <>
                  <div>
                    <Label htmlFor="edit-title">Title</Label>
                    <Input id="edit-title" value={selectedTask.title} onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea id="edit-description" value={selectedTask.description} onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Priority</Label>
                      <Select value={selectedTask.priority} onValueChange={(value: any) => setSelectedTask({...selectedTask, priority: value})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={selectedTask.status} onValueChange={(value: any) => setSelectedTask({...selectedTask, status: value})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Due Time</Label>
                      <Input type="time" value={selectedTask.dueTime || ""} onChange={(e) => setSelectedTask({...selectedTask, dueTime: e.target.value})} />
                    </div>
                    <div>
                      <Label>Estimated Hours</Label>
                      <Input type="number" step="0.5" min="0" value={selectedTask.estimatedHours || ""} onChange={(e) => setSelectedTask({...selectedTask, estimatedHours: Number(e.target.value)})} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{selectedTask.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedTask.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 py-2 border-y border-gray-100">
                    {selectedTask.location && <span>📍 {selectedTask.location}</span>}
                    {selectedTask.estimatedHours ? <span>⏱ {selectedTask.estimatedHours}h estimated</span> : null}
                    {selectedTask.dueTime && <span>🕐 Start by {selectedTask.dueTime}</span>}
                    <span>📅 Due {selectedTask.dueDate}</span>
                  </div>
                  <div>
                    <Label>Update Your Status</Label>
                    <Select value={selectedTask.status} onValueChange={(value: any) => setSelectedTask({...selectedTask, status: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <Button onClick={() => updateTask(selectedTask)} className="w-full bg-green-600 hover:bg-green-700">
                {isManager ? "Save Changes" : "Update My Status"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}