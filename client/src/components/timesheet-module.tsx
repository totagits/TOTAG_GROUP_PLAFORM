import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Square, Clock, Calendar, DollarSign, User, MapPin, Plus, Edit, Trash2, Download, CheckCircle2, LogIn, LogOut
} from "lucide-react";

interface TimeEntry {
  id: string;
  worker: string;
  activity: string;
  location: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  hourlyRate: number;
  totalPay: number;
  date: string;
  status: "active" | "completed" | "approved" | "paid";
  notes?: string;
}

interface ActiveTimer {
  id: string;
  worker: string;
  activity: string;
  location: string;
  startTime: Date;
  hourlyRate: number;
}

interface StaffRate {
  name: string;
  hourlyRate: number;
}

const STORAGE_KEY = "farm_time_entries";
const TIMER_KEY = "farm_active_timer";
const RATES_KEY = "farm_staff_rates";

const DEFAULT_RATES: StaffRate[] = [
  { name: "Farm Staff", hourlyRate: 5.00 },
  { name: "Farm Manager", hourlyRate: 8.00 },
];

const ACTIVITIES = [
  "Feeding Animals", "Harvesting Crops", "Equipment Maintenance", "Field Preparation",
  "Irrigation", "Planting", "Weeding", "Pest Control", "Loading / Transport",
  "Cleaning / Sanitation", "Record Keeping", "Other"
];

interface TimesheetModuleProps {
  userRole?: string;
  currentUser?: { username?: string; firstName?: string; lastName?: string; role?: string; hourlyRate?: number };
}

export default function TimesheetModule({ userRole = "manager", currentUser }: TimesheetModuleProps) {
  const isManager = userRole === "manager" || userRole === "admin";
  const currentUserFullName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || currentUser.username || ""
    : "";

  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterWorker, setFilterWorker] = useState<string>("all");
  const [staffRates, setStaffRates] = useState<StaffRate[]>(DEFAULT_RATES);
  const [showRateDialog, setShowRateDialog] = useState(false);
  const [editRate, setEditRate] = useState<StaffRate>({ name: "", hourlyRate: 5 });
  const [clockActivity, setClockActivity] = useState("Feeding Animals");
  const [clockLocation, setClockLocation] = useState("Main Farm");

  // Load persisted data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setTimeEntries(JSON.parse(saved)); } catch {}
    } else {
      const demo: TimeEntry[] = [
        {
          id: "demo1", worker: "Farm Staff", activity: "Feeding Animals", location: "Sector A",
          startTime: "2026-05-27T08:00:00", endTime: "2026-05-27T12:00:00",
          duration: 240, hourlyRate: 5.00, totalPay: 20.00,
          date: "2026-05-27", status: "approved", notes: "Fed cattle and checked water"
        },
        {
          id: "demo2", worker: "Farm Staff", activity: "Harvesting Crops", location: "Field B",
          startTime: "2026-05-26T06:00:00", endTime: "2026-05-26T14:00:00",
          duration: 480, hourlyRate: 5.00, totalPay: 40.00,
          date: "2026-05-26", status: "paid"
        },
        {
          id: "demo3", worker: "Farm Manager", activity: "Equipment Maintenance", location: "Workshop",
          startTime: "2026-05-26T09:00:00", endTime: "2026-05-26T17:00:00",
          duration: 480, hourlyRate: 8.00, totalPay: 64.00,
          date: "2026-05-26", status: "completed"
        }
      ];
      setTimeEntries(demo);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    }

    const savedRates = localStorage.getItem(RATES_KEY);
    if (savedRates) {
      try { setStaffRates(JSON.parse(savedRates)); } catch {}
    }

    // Restore active timer
    const savedTimer = localStorage.getItem(TIMER_KEY);
    if (savedTimer) {
      try {
        const t = JSON.parse(savedTimer);
        t.startTime = new Date(t.startTime);
        setActiveTimer(t);
      } catch {}
    }
  }, []);

  // Persist entries
  useEffect(() => {
    if (timeEntries.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(timeEntries));
  }, [timeEntries]);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getHourlyRate = (workerName: string) => {
    const found = staffRates.find(r => r.name.toLowerCase() === workerName.toLowerCase());
    return found ? found.hourlyRate : 5.00;
  };

  const clockIn = (activity: string, location: string) => {
    const workerName = isManager ? "Farm Manager" : currentUserFullName || "Farm Staff";
    const rate = getHourlyRate(workerName);
    const timer: ActiveTimer = {
      id: Date.now().toString(),
      worker: workerName,
      activity,
      location,
      startTime: new Date(),
      hourlyRate: rate,
    };
    setActiveTimer(timer);
    localStorage.setItem(TIMER_KEY, JSON.stringify({ ...timer, startTime: timer.startTime.toISOString() }));
    setShowStartModal(false);
  };

  const clockOut = () => {
    if (!activeTimer) return;
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeTimer.startTime.getTime()) / (1000 * 60));
    const totalPay = Math.round((duration / 60) * activeTimer.hourlyRate * 100) / 100;
    const newEntry: TimeEntry = {
      id: activeTimer.id,
      worker: activeTimer.worker,
      activity: activeTimer.activity,
      location: activeTimer.location,
      startTime: activeTimer.startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      hourlyRate: activeTimer.hourlyRate,
      totalPay,
      date: activeTimer.startTime.toISOString().split("T")[0],
      status: "completed",
    };
    const updated = [newEntry, ...timeEntries];
    setTimeEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setActiveTimer(null);
    localStorage.removeItem(TIMER_KEY);
  };

  const approveEntry = (id: string) => {
    const updated = timeEntries.map(e => e.id === id ? { ...e, status: "approved" as const } : e);
    setTimeEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const markPaid = (id: string) => {
    const updated = timeEntries.map(e => e.id === id ? { ...e, status: "paid" as const } : e);
    setTimeEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteEntry = (id: string) => {
    const updated = timeEntries.filter(e => e.id !== id);
    setTimeEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const saveRate = () => {
    const updated = staffRates.some(r => r.name === editRate.name)
      ? staffRates.map(r => r.name === editRate.name ? editRate : r)
      : [...staffRates, editRate];
    setStaffRates(updated);
    localStorage.setItem(RATES_KEY, JSON.stringify(updated));
    setShowRateDialog(false);
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const getLiveDuration = () => {
    if (!activeTimer) return 0;
    return Math.floor((currentTime.getTime() - activeTimer.startTime.getTime()) / (1000 * 60));
  };

  const getLivePay = () => {
    const mins = getLiveDuration();
    return ((mins / 60) * (activeTimer?.hourlyRate || 0)).toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-purple-100 text-purple-800";
      case "paid": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const visibleEntries = isManager
    ? timeEntries
    : timeEntries.filter(e => e.worker.toLowerCase().includes((currentUserFullName || "").split(" ")[0].toLowerCase()));

  const filteredEntries = visibleEntries.filter(entry => {
    if (filterStatus !== "all" && entry.status !== filterStatus) return false;
    if (filterWorker !== "all" && entry.worker !== filterWorker) return false;
    return true;
  });

  const totalHours = filteredEntries.reduce((sum, e) => sum + (e.duration || 0), 0) / 60;
  const totalPay = filteredEntries.reduce((sum, e) => sum + e.totalPay, 0);
  const workers = [...new Set(timeEntries.map(e => e.worker))];

  // Payroll grouped by worker
  const payrollByWorker = workers.map(worker => {
    const entries = timeEntries.filter(e => e.worker === worker);
    const hours = entries.reduce((s, e) => s + (e.duration || 0), 0) / 60;
    const paid = entries.filter(e => e.status === "paid").reduce((s, e) => s + e.totalPay, 0);
    const pending = entries.filter(e => e.status !== "paid").reduce((s, e) => s + e.totalPay, 0);
    const rate = getHourlyRate(worker);
    return { worker, hours, paid, pending, total: paid + pending, rate };
  });

  return (
    <div className="space-y-6">
      {/* Active Clock-In Banner */}
      {activeTimer && (
        <Card className="border-green-300 bg-green-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="font-semibold text-green-900 text-sm">Clocked In — {activeTimer.worker}</p>
                  <p className="text-xs text-green-700">{activeTimer.activity} · {activeTimer.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-800 font-mono">{formatDuration(getLiveDuration())}</p>
                  <p className="text-xs text-green-600">elapsed</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-800">${getLivePay()}</p>
                  <p className="text-xs text-green-600">earned so far</p>
                </div>
                <Button onClick={clockOut} className="bg-red-600 hover:bg-red-700 text-white">
                  <LogOut className="h-4 w-4 mr-2" /> Clock Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clock-In Button (when no active timer) */}
      {!activeTimer && (
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowStartModal(true)} className="bg-green-600 hover:bg-green-700 text-white h-11 px-6">
            <LogIn className="h-5 w-5 mr-2" /> Clock In
          </Button>
          <span className="text-sm text-gray-500">You are not clocked in.</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-5 flex items-center gap-3">
          <Clock className="h-8 w-8 text-blue-600 shrink-0" />
          <div><p className="text-xs text-gray-500">Total Hours</p><p className="text-2xl font-bold">{totalHours.toFixed(1)}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-green-600 shrink-0" />
          <div><p className="text-xs text-gray-500">Total Pay</p><p className="text-2xl font-bold">${totalPay.toFixed(2)}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <User className="h-8 w-8 text-purple-600 shrink-0" />
          <div><p className="text-xs text-gray-500">{isManager ? "Active Workers" : "Your Entries"}</p>
          <p className="text-2xl font-bold">{isManager ? workers.length : filteredEntries.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <Calendar className="h-8 w-8 text-orange-600 shrink-0" />
          <div><p className="text-xs text-gray-500">Records</p><p className="text-2xl font-bold">{filteredEntries.length}</p></div>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="timesheets">
        <TabsList>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          {isManager && <TabsTrigger value="rates">Staff Rates</TabsTrigger>}
        </TabsList>

        <TabsContent value="timesheets" className="space-y-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              {isManager && (
                <Select value={filterWorker} onValueChange={setFilterWorker}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="Worker" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workers</SelectItem>
                    {workers.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Pay</TableHead>
                    <TableHead>Status</TableHead>
                    {isManager && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 && (
                    <TableRow><TableCell colSpan={10} className="text-center py-8 text-gray-400">No records found.</TableCell></TableRow>
                  )}
                  {filteredEntries.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.worker}</TableCell>
                      <TableCell>{entry.activity}</TableCell>
                      <TableCell>{new Date(entry.date + "T00:00:00").toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs">{new Date(entry.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                      <TableCell className="text-xs">{entry.endTime ? new Date(entry.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : <span className="text-green-600 font-medium">Active</span>}</TableCell>
                      <TableCell>{entry.duration ? formatDuration(entry.duration) : "—"}</TableCell>
                      <TableCell>${entry.hourlyRate.toFixed(2)}/hr</TableCell>
                      <TableCell className="font-semibold text-green-700">${entry.totalPay.toFixed(2)}</TableCell>
                      <TableCell><Badge className={getStatusColor(entry.status)}>{entry.status}</Badge></TableCell>
                      {isManager && (
                        <TableCell>
                          <div className="flex gap-1">
                            {entry.status === "completed" && (
                              <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 text-xs h-7 px-2" onClick={() => approveEntry(entry.id)}>
                                Approve
                              </Button>
                            )}
                            {entry.status === "approved" && (
                              <Button variant="outline" size="sm" className="text-green-700 border-green-200 text-xs h-7 px-2" onClick={() => markPaid(entry.id)}>
                                Mark Paid
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteEntry(entry.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Payroll Summary by Worker</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Gross Earned</TableHead>
                    <TableHead>Paid Out</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollByWorker.map(row => (
                    <TableRow key={row.worker}>
                      <TableCell className="font-medium">{row.worker}</TableCell>
                      <TableCell>${row.rate.toFixed(2)}/hr</TableCell>
                      <TableCell>{row.hours.toFixed(1)}h</TableCell>
                      <TableCell className="font-semibold">${row.total.toFixed(2)}</TableCell>
                      <TableCell className="text-green-700">${row.paid.toFixed(2)}</TableCell>
                      <TableCell className={row.pending > 0 ? "text-orange-600 font-semibold" : "text-gray-400"}>${row.pending.toFixed(2)}</TableCell>
                      <TableCell>
                        {row.pending === 0
                          ? <Badge className="bg-green-100 text-green-800">Fully Paid</Badge>
                          : <Badge className="bg-orange-100 text-orange-800">Payment Due</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 font-bold bg-gray-50">
                    <TableCell colSpan={3}>Totals</TableCell>
                    <TableCell>${payrollByWorker.reduce((s, r) => s + r.total, 0).toFixed(2)}</TableCell>
                    <TableCell className="text-green-700">${payrollByWorker.reduce((s, r) => s + r.paid, 0).toFixed(2)}</TableCell>
                    <TableCell className="text-orange-600">${payrollByWorker.reduce((s, r) => s + r.pending, 0).toFixed(2)}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-green-700 mb-1">Total Labor Cost This Period</p>
                <p className="text-3xl font-bold text-green-800">${payrollByWorker.reduce((s, r) => s + r.total, 0).toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-blue-700 mb-1">Already Paid</p>
                <p className="text-3xl font-bold text-blue-800">${payrollByWorker.reduce((s, r) => s + r.paid, 0).toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-orange-700 mb-1">Outstanding / Unpaid</p>
                <p className="text-3xl font-bold text-orange-800">${payrollByWorker.reduce((s, r) => s + r.pending, 0).toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {isManager && (
          <TabsContent value="rates" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Set hourly pay rates for each staff member. These rates are used to auto-calculate pay from clock-in data.</p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => { setEditRate({ name: "", hourlyRate: 5 }); setShowRateDialog(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Add Staff Rate
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Name / Role</TableHead>
                      <TableHead>Hourly Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffRates.map(rate => (
                      <TableRow key={rate.name}>
                        <TableCell className="font-medium">{rate.name}</TableCell>
                        <TableCell className="font-semibold text-green-700">${rate.hourlyRate.toFixed(2)}/hr</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => { setEditRate(rate); setShowRateDialog(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Clock-In Dialog */}
      <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><LogIn className="h-5 w-5 text-green-600" /> Clock In</DialogTitle>
            <DialogDescription>
              Clocking in as <strong>{isManager ? "Farm Manager" : currentUserFullName || "Farm Staff"}</strong>.
              Your time will be tracked automatically until you clock out.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Activity</Label>
              <Select value={clockActivity} onValueChange={setClockActivity}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACTIVITIES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location / Area</Label>
              <Input value={clockLocation} onChange={e => setClockLocation(e.target.value)} placeholder="e.g. Sector A, Field B" />
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
              Hourly rate: <strong>${getHourlyRate(isManager ? "Farm Manager" : currentUserFullName || "Farm Staff").toFixed(2)}/hr</strong>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowStartModal(false)}>Cancel</Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => clockIn(clockActivity, clockLocation)}>
              <LogIn className="h-4 w-4 mr-2" /> Clock In Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Rate Dialog */}
      <Dialog open={showRateDialog} onOpenChange={setShowRateDialog}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Set Hourly Rate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Staff Name / Role</Label>
              <Input value={editRate.name} onChange={e => setEditRate({ ...editRate, name: e.target.value })} placeholder="e.g. Farm Staff" />
            </div>
            <div>
              <Label>Hourly Rate ($)</Label>
              <Input type="number" step="0.50" min="0" value={editRate.hourlyRate} onChange={e => setEditRate({ ...editRate, hourlyRate: Number(e.target.value) })} />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={saveRate}>Save Rate</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
