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
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Download,
  Printer
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "event" | "task" | "activity";
  priority: "low" | "medium" | "high";
  assignee: string;
  location?: string;
  completed?: boolean;
}

interface CalendarDay {
  date: Date;
  events: Event[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function ScheduleModule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");
  const [selectedUser, setSelectedUser] = useState("all");
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Morning Livestock Check",
      description: "Daily health check for cattle in Sector A",
      date: "2025-01-13",
      time: "07:00",
      type: "task",
      priority: "high",
      assignee: "John Smith",
      location: "Sector A",
      completed: false
    },
    {
      id: "2",
      title: "Irrigation System Maintenance",
      description: "Weekly maintenance of drip irrigation",
      date: "2025-01-13",
      time: "14:00",
      type: "task",
      priority: "medium",
      assignee: "Mike Johnson",
      location: "Field B",
      completed: false
    },
    {
      id: "3",
      title: "Harvest Planning Meeting",
      description: "Team meeting to discuss harvest schedule",
      date: "2025-01-14",
      time: "09:00",
      type: "event",
      priority: "medium",
      assignee: "Jane Doe",
      location: "Office",
      completed: false
    },
    {
      id: "4",
      title: "Fertilizer Application",
      description: "Apply organic fertilizer to crops",
      date: "2025-01-15",
      time: "06:00",
      type: "activity",
      priority: "high",
      assignee: "Sarah Wilson",
      location: "Field C",
      completed: false
    }
  ]);

  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "event" as const,
    priority: "medium" as const,
    assignee: "",
    location: ""
  });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "task" as const,
    priority: "medium" as const,
    assignee: "",
    location: ""
  });

  const users = [
    { id: "all", name: "All Users" },
    { id: "john", name: "John Smith" },
    { id: "jane", name: "Jane Doe" },
    { id: "mike", name: "Mike Johnson" },
    { id: "sarah", name: "Sarah Wilson" }
  ];

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
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
        events: getEventsForDate(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      days.push({
        date,
        events: getEventsForDate(date),
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const addEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      completed: false
    };
    setEvents([...events, event]);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "event",
      priority: "medium",
      assignee: "",
      location: ""
    });
    setShowAddEventDialog(false);
  };

  const addTask = () => {
    const task: Event = {
      id: Date.now().toString(),
      ...newTask,
      completed: false
    };
    setEvents([...events, task]);
    setNewTask({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "task",
      priority: "medium",
      assignee: "",
      location: ""
    });
    setShowAddTaskDialog(false);
  };

  const toggleEventCompletion = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, completed: !event.completed }
        : event
    ));
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

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle className="h-3 w-3" />;
      case 'event': return <Calendar className="h-3 w-3" />;
      case 'activity': return <Clock className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  const filteredEvents = selectedUser === "all" 
    ? events 
    : events.filter(event => event.assignee.toLowerCase().includes(selectedUser));

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Event description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({...newEvent, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="activity">Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newEvent.priority} onValueChange={(value: any) => setNewEvent({...newEvent, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={newEvent.assignee}
                    onChange={(e) => setNewEvent({...newEvent, assignee: e.target.value})}
                    placeholder="Assigned to"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Location"
                  />
                </div>
                <Button onClick={addEvent} className="w-full">
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => {
            setNewTask({ title: "", description: "", date: new Date().toISOString().split("T")[0], time: "", type: "task", priority: "medium", assignee: "", location: "" });
            setShowAddTaskDialog(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>

          {/* Add Task Dialog — controlled programmatically (also opened from calendar cells) */}
          <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
            <DialogContent className="sm:max-w-[460px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  {newTask.date
                    ? `Add Task — ${new Date(newTask.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
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
                    placeholder="What needs to be done?"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="task-date">Date</Label>
                    <Input
                      id="task-date"
                      type="date"
                      value={newTask.date}
                      onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-time">Time</Label>
                    <Input
                      id="task-time"
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="task-priority">Priority</Label>
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
                  <Label htmlFor="task-assignee">Assignee</Label>
                  <Input
                    id="task-assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    placeholder="Assigned to"
                  />
                </div>
                <div>
                  <Label htmlFor="task-location">Location / Area</Label>
                  <Input
                    id="task-location"
                    value={newTask.location}
                    onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                    placeholder="e.g. Pasture A, Field B"
                  />
                </div>
                <div className="flex gap-2 pt-1">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                const activity: Event = {
                  id: Date.now().toString(),
                  title: "Activity Journal Entry",
                  description: "Daily farm activity log",
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toTimeString().slice(0, 5),
                  type: "activity",
                  priority: "medium",
                  assignee: "Current User",
                  location: "Farm",
                  completed: false
                };
                setEvents([...events, activity]);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Activity Journal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const dataStr = JSON.stringify(events, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'farm-schedule-records.json';
                link.click();
                URL.revokeObjectURL(url);
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download All Records
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                {users.find(u => u.id === selectedUser)?.name || "All Users"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {users.map(user => (
                <DropdownMenuItem key={user.id} onClick={() => setSelectedUser(user.id)}>
                  {user.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => viewMode === "month" ? navigateMonth("prev") : navigateWeek("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {viewMode === "month" 
                ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              }
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => viewMode === "month" ? navigateMonth("next") : navigateWeek("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("day")}
          >
            Day
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {viewMode === "month" && (
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] border border-gray-200 p-2 ${
                    !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                  } ${day.isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <div className="text-sm font-medium mb-1">
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {day.events.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className={`p-1 rounded text-xs cursor-pointer ${getPriorityColor(event.priority)}`}
                        onClick={() => toggleEventCompletion(event.id)}
                      >
                        <div className="flex items-center gap-1">
                          {getTypeIcon(event.type)}
                          <span className={event.completed ? 'line-through' : ''}>
                            {event.title}
                          </span>
                        </div>
                      </div>
                    ))}
                    {day.events.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{day.events.length - 3} more
                      </div>
                    )}
                    {day.isCurrentMonth && (
                      <div
                        className="text-xs text-gray-400 hover:text-green-700 hover:bg-green-50 cursor-pointer px-1 py-0.5 rounded text-center transition-colors mt-1 border border-dashed border-gray-200 hover:border-green-300"
                        onClick={() => {
                          setNewTask({ title: "", description: "", date: day.date.toISOString().split("T")[0], time: "", type: "task", priority: "medium", assignee: "", location: "" });
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
          )}
          
          {viewMode === "week" && (
            <div className="grid grid-cols-8 gap-1">
              {/* Time column header */}
              <div className="p-2 text-center font-medium text-gray-500 text-sm">Time</div>
              
              {/* Day headers */}
              {getWeekDays().map(day => (
                <div key={day.date.toISOString()} className="p-2 text-center">
                  <div className="font-medium text-sm text-gray-500">
                    {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-semibold ${day.isToday ? 'text-blue-600' : ''}`}>
                    {day.date.getDate()}
                  </div>
                </div>
              ))}
              
              {/* Time slots */}
              {Array.from({ length: 12 }, (_, i) => i + 6).map(hour => (
                <div key={hour} className="contents">
                  <div className="p-2 text-xs text-gray-500 text-right">
                    {hour}:00
                  </div>
                  {getWeekDays().map(day => {
                    const slotEvents = day.events.filter(event => parseInt(event.time.split(':')[0]) === hour);
                    const slotDate = day.date.toISOString().split("T")[0];
                    const slotTime = `${String(hour).padStart(2, "0")}:00`;
                    return (
                      <div
                        key={`${day.date.toISOString()}-${hour}`}
                        className="min-h-[60px] border border-gray-200 p-1 group relative hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest("[data-event]")) return;
                          setNewTask({ title: "", description: "", date: slotDate, time: slotTime, type: "task", priority: "medium", assignee: "", location: "" });
                          setShowAddTaskDialog(true);
                        }}
                      >
                        {slotEvents.map(event => (
                          <div
                            key={event.id}
                            data-event="true"
                            className={`p-1 rounded text-xs cursor-pointer mb-1 ${getPriorityColor(event.priority)}`}
                            onClick={(e) => { e.stopPropagation(); toggleEventCompletion(event.id); }}
                          >
                            <div className="flex items-center gap-1">
                              {getTypeIcon(event.type)}
                              <span className={event.completed ? 'line-through' : ''}>
                                {event.title}
                              </span>
                            </div>
                          </div>
                        ))}
                        {slotEvents.length === 0 && (
                          <div className="text-xs text-gray-300 group-hover:text-green-600 text-center pt-1 transition-colors">
                            + Add task
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents
              .filter(event => !event.completed)
              .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(event.type)}
                      <Badge variant="outline" className={getPriorityColor(event.priority)}>
                        {event.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {event.date} at {event.time}
                        {event.location && (
                          <>
                            <MapPin className="h-3 w-3 ml-2" />
                            {event.location}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600">
                      <User className="h-3 w-3 inline mr-1" />
                      {event.assignee}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleEventCompletion(event.id)}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}