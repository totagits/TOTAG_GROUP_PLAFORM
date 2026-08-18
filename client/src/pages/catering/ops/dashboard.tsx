import { useState, useEffect } from "react";
import { CATERING_SERVICES, SERVICE_LINE_ITEMS, PARTICIPANT_RANGES, URGENCY_LEVELS, EVENT_TYPES, getPricingCountFromGuestCount, getUrgencySurcharge } from "@/lib/cateringConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LogOut, Bell, Users, Calendar, ClipboardList, AlertTriangle, FileText,
  Truck, ChefHat, Shield, UserCheck, Package, Plus, Eye, Edit, CheckCircle,
  Clock, BarChart3, RefreshCw, MapPin, Utensils, Thermometer, KeyRound,
  Send, FileCheck, TrendingUp, Phone, Mail, DollarSign, Clipboard,
  Settings, Wrench, Coffee, Star, HandMetal, Sparkles, CircleCheck,
  ArrowUpCircle, MessageSquare, ListChecks, CircleDot, ShieldCheck, UserPlus,
  Printer, Trash2, X, Receipt, Hash, Download, FileSpreadsheet
} from "lucide-react";
import cateringLogo from "@assets/Logo for TOTAG Catering1(1)_1752602584482.png";

const ROLE_LABELS: Record<string, string> = {
  account_manager: "LTA Account Manager",
  operations_supervisor: "General Manager",
  head_chef: "Catering Lead / Head Chef",
  food_safety_supervisor: "Food Safety & Quality Supervisor",
  team_lead: "Service Team Lead",
  logistics_coordinator: "Logistics & Transport Coordinator",
};

const ROLE_ICONS: Record<string, any> = {
  account_manager: FileText,
  operations_supervisor: ClipboardList,
  head_chef: ChefHat,
  food_safety_supervisor: Shield,
  team_lead: UserCheck,
  logistics_coordinator: Truck,
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewing: "bg-yellow-100 text-yellow-800",
  quoted: "bg-purple-100 text-purple-800",
  confirmed: "bg-green-100 text-green-800",
  in_progress: "bg-orange-100 text-orange-800",
  completed: "bg-emerald-100 text-emerald-800",
  closed: "bg-gray-100 text-gray-800",
  planning: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  live: "bg-orange-100 text-orange-800",
  open: "bg-yellow-100 text-yellow-800",
  in_progress_task: "bg-orange-100 text-orange-800",
  done: "bg-emerald-100 text-emerald-800",
  investigating: "bg-amber-100 text-amber-800",
  resolved: "bg-green-100 text-green-800",
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
  urgent: "bg-red-100 text-red-800",
  normal: "bg-blue-100 text-blue-800",
};

function getAuthHeaders() {
  const token = localStorage.getItem("catering_token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function cateringFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, { ...options, headers: { ...getAuthHeaders(), ...options?.headers } });
  if (res.status === 401) {
    localStorage.removeItem("catering_token");
    localStorage.removeItem("catering_user");
    window.location.href = "/catering/ops/login";
    throw new Error("Session expired");
  }
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export default function CateringDashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("catering_user");
    if (!stored) { window.location.href = "/catering/ops/login"; return; }
    try {
      setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem("catering_user");
      localStorage.removeItem("catering_token");
      window.location.href = "/catering/ops/login";
    }
  }, []);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("catering_token");
    localStorage.removeItem("catering_user");
    navigate("/catering/ops/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/catering/auth/change-password", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        toast({ title: "Failed", description: data.error, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Password changed successfully" });
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast({ title: "Error", description: "Failed to change password", variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  const { data: statsData } = useQuery({
    queryKey: ["/api/catering/stats"],
    queryFn: () => cateringFetch("/api/catering/stats"),
    enabled: !!user,
    refetchInterval: 30000,
  });

  const { data: requestsData, isLoading: loadingRequests } = useQuery({
    queryKey: ["/api/catering/requests"],
    queryFn: () => cateringFetch("/api/catering/requests"),
    enabled: !!user,
  });

  const { data: eventsData, isLoading: loadingEvents } = useQuery({
    queryKey: ["/api/catering/events"],
    queryFn: () => cateringFetch("/api/catering/events"),
    enabled: !!user,
  });

  const { data: tasksData, isLoading: loadingTasks } = useQuery({
    queryKey: ["/api/catering/tasks"],
    queryFn: () => cateringFetch("/api/catering/tasks"),
    enabled: !!user,
  });

  const { data: incidentsData } = useQuery({
    queryKey: ["/api/catering/incidents"],
    queryFn: () => cateringFetch("/api/catering/incidents"),
    enabled: !!user,
  });

  const { data: staffData } = useQuery({
    queryKey: ["/api/catering/staff"],
    queryFn: () => cateringFetch("/api/catering/staff"),
    enabled: !!user,
  });

  const { data: quotationsData } = useQuery({
    queryKey: ["/api/catering/quotations"],
    queryFn: () => cateringFetch("/api/catering/quotations"),
    enabled: !!user && ["account_manager", "operations_supervisor"].includes(user.role),
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      cateringFetch(`/api/catering/requests/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/stats"] });
      toast({ title: "Updated", description: "Request updated successfully" });
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: (id: number) =>
      cateringFetch(`/api/catering/requests/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/stats"] });
      toast({ title: "Deleted", description: "Request removed successfully" });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: (eventData: any) =>
      cateringFetch("/api/catering/events", { method: "POST", body: JSON.stringify(eventData) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/stats"] });
      toast({ title: "Created", description: "Event created successfully" });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      cateringFetch(`/api/catering/events/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/stats"] });
      toast({ title: "Updated", description: "Event updated successfully" });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData: any) =>
      cateringFetch("/api/catering/tasks", { method: "POST", body: JSON.stringify(taskData) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/stats"] });
      toast({ title: "Created", description: "Task created successfully" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      cateringFetch(`/api/catering/tasks/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/stats"] });
      toast({ title: "Updated", description: "Task updated" });
    },
  });

  const createIncidentMutation = useMutation({
    mutationFn: (data: any) =>
      cateringFetch("/api/catering/incidents", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/incidents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/stats"] });
      toast({ title: "Reported", description: "Incident reported successfully" });
    },
  });

  const updateIncidentMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      cateringFetch(`/api/catering/incidents/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/incidents"] });
      toast({ title: "Updated", description: "Incident updated" });
    },
  });

  const createQuotationMutation = useMutation({
    mutationFn: (data: any) =>
      cateringFetch("/api/catering/quotations", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/quotations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/stats"] });
      toast({ title: "Quotation Created", description: "Quotation has been generated and saved" });
    },
  });

  const updateQuotationMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      cateringFetch(`/api/catering/quotations/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/quotations"] });
      toast({ title: "Updated", description: "Quotation updated" });
    },
  });

  const sendQuotationMutation = useMutation({
    mutationFn: (quotationId: number) =>
      cateringFetch(`/api/catering/quotations/${quotationId}/send`, { method: "POST", body: JSON.stringify({}) }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/quotations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/requests"] });
      toast({ title: "Quotation Sent!", description: data?.message || "Quotation emailed to customer and saved." });
    },
    onError: () => {
      toast({ title: "Send Failed", description: "Could not email the quotation. It has been saved — check email configuration.", variant: "destructive" });
    }
  });

  const createAndSendQuotationMutation = useMutation({
    mutationFn: async (data: any) => {
      const created = await cateringFetch("/api/catering/quotations", { method: "POST", body: JSON.stringify(data) });
      if (created?.quotation?.id) {
        await cateringFetch(`/api/catering/quotations/${created.quotation.id}/send`, { method: "POST", body: JSON.stringify({}) });
        return { ...created, sent: true };
      }
      return created;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/catering/quotations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catering/stats"] });
      if (data?.sent) {
        toast({ title: "Quotation Saved & Sent!", description: "Quotation saved and emailed to the customer." });
      } else {
        toast({ title: "Quotation Saved", description: "Quotation saved. Email service may not be configured." });
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create quotation.", variant: "destructive" });
    }
  });

  const token = localStorage.getItem("catering_token") || "";

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  const stats = statsData?.stats || {};
  const requests = requestsData?.requests || [];
  const events = eventsData?.events || [];
  const allTasks = tasksData?.tasks || [];
  const myTasks = allTasks.filter((t: any) => t.role === user.role);
  const incidents = incidentsData?.incidents || [];
  const staff = staffData?.staff || [];
  const quotations = quotationsData?.quotations || [];

  const RoleIcon = ROLE_ICONS[user.role] || FileText;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={cateringLogo} alt="TOCEPS" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">TOCEPS Operations</h1>
              <p className="text-xs text-gray-500">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-600 border-0">
              <RoleIcon className="h-3 w-3 mr-1" />
              {user.firstName} {user.lastName}
            </Badge>
            <Dialog open={showChangePassword} onOpenChange={(open) => { setShowChangePassword(open); if (!open) { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); } }}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="Change Password">
                  <KeyRound className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPwd">Current Password</Label>
                    <Input id="currentPwd" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="newPwd">New Password</Label>
                    <Input id="newPwd" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPwd">Confirm New Password</Label>
                    <Input id="confirmPwd" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} className="mt-1" />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={changingPassword}>
                    {changingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Bell} label="New Requests" value={stats.newRequests || 0} color="text-blue-600" />
          <StatCard icon={Calendar} label="Active Events" value={stats.activeEvents || 0} color="text-green-600" />
          <StatCard icon={ClipboardList} label="My Open Tasks" value={myTasks.filter((t: any) => t.status !== 'done').length} color="text-orange-600" />
          <StatCard icon={AlertTriangle} label="Open Incidents" value={stats.openIncidents || 0} color="text-orange-600" />
        </div>

        {user.role === "account_manager" && (
          <AccountManagerView requests={requests} events={events} staff={staff} allTasks={allTasks} quotations={quotations} loading={loadingRequests}
            onUpdateRequest={(id: number, updates: any) => updateRequestMutation.mutate({ id, updates })}
            onCreateEvent={(data: any) => createEventMutation.mutate(data)}
            onCreateTask={(data: any) => createTaskMutation.mutate(data)}
            onCreateQuotation={(data: any) => createQuotationMutation.mutate(data)}
            onUpdateQuotation={(id: number, updates: any) => updateQuotationMutation.mutate({ id, updates })}
          />
        )}

        {user.role === "operations_supervisor" && (
          <OperationsSupervisorView events={events} allTasks={allTasks} staff={staff} requests={requests}
            quotations={quotations} loading={loadingRequests}
            onUpdateRequest={(id: number, updates: any) => updateRequestMutation.mutate({ id, updates })}
            onDeleteRequest={(id: number) => deleteRequestMutation.mutate(id)}
            onCreateTask={(data: any) => createTaskMutation.mutate(data)}
            onUpdateTask={(id: number, updates: any) => updateTaskMutation.mutate({ id, updates })}
            onUpdateEvent={(id: number, updates: any) => updateEventMutation.mutate({ id, updates })}
            onCreateEvent={(data: any) => createEventMutation.mutate(data)}
            onCreateQuotation={(data: any) => createQuotationMutation.mutate(data)}
            onUpdateQuotation={(id: number, updates: any) => updateQuotationMutation.mutate({ id, updates })}
            onSaveAndSendQuotation={(data: any) => createAndSendQuotationMutation.mutate(data)}
            onSendQuotation={(id: number) => sendQuotationMutation.mutate(id)}
            isSending={createAndSendQuotationMutation.isPending || sendQuotationMutation.isPending}
          />
        )}

        {user.role === "head_chef" && (
          <HeadChefView events={events} myTasks={myTasks} allTasks={allTasks} loading={loadingTasks}
            onCreateTask={(data: any) => createTaskMutation.mutate(data)}
            onUpdateTask={(id: number, updates: any) => updateTaskMutation.mutate({ id, updates })}
            onUpdateEvent={(id: number, updates: any) => updateEventMutation.mutate({ id, updates })}
          />
        )}

        {user.role === "food_safety_supervisor" && (
          <FoodSafetyView events={events} incidents={incidents} myTasks={myTasks} allTasks={allTasks} loading={loadingTasks}
            onCreateIncident={(data: any) => createIncidentMutation.mutate(data)}
            onUpdateIncident={(id: number, updates: any) => updateIncidentMutation.mutate({ id, updates })}
            onUpdateTask={(id: number, updates: any) => updateTaskMutation.mutate({ id, updates })}
            onCreateTask={(data: any) => createTaskMutation.mutate(data)}
          />
        )}

        {user.role === "team_lead" && (
          <TeamLeadView events={events} myTasks={myTasks} allTasks={allTasks} staff={staff} loading={loadingTasks}
            onCreateTask={(data: any) => createTaskMutation.mutate(data)}
            onUpdateTask={(id: number, updates: any) => updateTaskMutation.mutate({ id, updates })}
          />
        )}

        {user.role === "logistics_coordinator" && (
          <LogisticsView events={events} myTasks={myTasks} allTasks={allTasks} loading={loadingTasks}
            onCreateTask={(data: any) => createTaskMutation.mutate(data)}
            onUpdateTask={(id: number, updates: any) => updateTaskMutation.mutate({ id, updates })}
            onUpdateEvent={(id: number, updates: any) => updateEventMutation.mutate({ id, updates })}
          />
        )}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3 px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color} opacity-70`} />
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ icon: Icon, title, description, color, onClick }: { icon: any; title: string; description: string; color: string; onClick?: () => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-l-4" style={{ borderLeftColor: color }} onClick={onClick}>
      <CardContent className="py-3 px-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + '18' }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== ACCOUNT MANAGER VIEW =====
function AccountManagerView({ requests, events, staff, allTasks, quotations, loading, onUpdateRequest, onCreateEvent, onCreateTask, onCreateQuotation, onUpdateQuotation }: any) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("quick-actions");
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState({ eventId: "", role: "", title: "", description: "", priority: "normal", dueDate: "" });
  const [quotationRequest, setQuotationRequest] = useState<any>(null);
  const [previewQuotation, setPreviewQuotation] = useState<any>(null);

  const pendingRequests = requests.filter((r: any) => ["new", "reviewing"].includes(r.status));
  const quotedRequests = requests.filter((r: any) => r.status === "quoted");
  const confirmedRequests = requests.filter((r: any) => r.status === "confirmed");
  const activeEvents = events.filter((e: any) => ["planning", "ready", "live"].includes(e.status));

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 flex-wrap h-auto gap-1">
        <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        <TabsTrigger value="requests">Requests ({requests.length})</TabsTrigger>
        <TabsTrigger value="quotation-builder">Quotation Builder</TabsTrigger>
        <TabsTrigger value="quotations">Quotations ({quotations.length})</TabsTrigger>
        <TabsTrigger value="approvals">Approvals</TabsTrigger>
        <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="staff">Staff</TabsTrigger>
      </TabsList>

      <TabsContent value="quick-actions">
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-1">Welcome back! Here's your overview.</h3>
          <p className="text-sm text-gray-500">Single point of contact for clients — manage requests, build quotations, track approvals</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <QuickActionCard icon={Bell} title={`Review New Requests (${pendingRequests.length})`} description="Incoming client requests awaiting your review" color="#3b82f6" onClick={() => setActiveTab("requests")} />
          <QuickActionCard icon={Receipt} title="Build Quotation" description="Create detailed itemized quotation from a request" color="#8b5cf6" onClick={() => setActiveTab("quotation-builder")} />
          <QuickActionCard icon={FileSpreadsheet} title={`All Quotations (${quotations.length})`} description="View, edit, and print saved quotations" color="#06b6d4" onClick={() => setActiveTab("quotations")} />
          <QuickActionCard icon={CheckCircle} title={`Confirmed Orders (${confirmedRequests.length})`} description="Create events from confirmed requests" color="#22c55e" onClick={() => setActiveTab("approvals")} />
          <QuickActionCard icon={Calendar} title={`Active Events (${activeEvents.length})`} description="Monitor ongoing event progress" color="#f59e0b" onClick={() => setActiveTab("events")} />
          <QuickActionCard icon={ClipboardList} title="Assign Task to Team" description="Create and delegate tasks to any role" color="#ef4444" onClick={() => { setShowCreateTask(true); setActiveTab("quick-actions"); }} />
        </div>

        {showCreateTask && (
          <Card className="mb-6">
            <CardHeader className="pb-2"><CardTitle className="text-base">Create & Assign Task</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Event</Label>
                  <Select onValueChange={v => setNewTask({ ...newTask, eventId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                    <SelectContent>{events.map((e: any) => <SelectItem key={e.id} value={String(e.id)}>{e.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Assign to Role</Label>
                  <Select onValueChange={v => setNewTask({ ...newTask, role: v })}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>{Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <Input value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" />
              <Textarea value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} rows={2} placeholder="Description" />
              <div className="grid grid-cols-2 gap-3">
                <Select onValueChange={v => setNewTask({ ...newTask, priority: v })}>
                  <SelectTrigger><SelectValue placeholder="Priority: Normal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                  if (!newTask.eventId || !newTask.role || !newTask.title) return;
                  onCreateTask({ ...newTask, eventId: parseInt(newTask.eventId) });
                  setNewTask({ eventId: "", role: "", title: "", description: "", priority: "normal", dueDate: "" });
                  setShowCreateTask(false);
                }}><Plus className="h-4 w-4 mr-1" /> Create Task</Button>
                <Button variant="outline" onClick={() => setShowCreateTask(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            {requests.slice(0, 5).map((r: any) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{r.name} {r.company ? `(${r.company})` : ''}</p>
                  <p className="text-xs text-gray-500">{r.eventType} - {r.guestCount} guests</p>
                </div>
                <Badge className={STATUS_COLORS[r.status]}>{r.status}</Badge>
              </div>
            ))}
            {requests.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No activity yet</p>}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="requests">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-semibold text-lg">Incoming Requests</h3>
            {loading ? <p className="text-gray-500">Loading...</p> : requests.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-gray-500">No service requests yet</CardContent></Card>
            ) : requests.map((req: any) => (
              <Card key={req.id} className={`cursor-pointer hover:shadow-md transition-shadow ${selectedRequest?.id === req.id ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => setSelectedRequest(req)}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{req.name} {req.company ? `(${req.company})` : ''}</p>
                      <p className="text-sm text-gray-500">{req.eventType} - {req.guestCount || '?'} guests - {req.eventDate || 'TBD'}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={STATUS_COLORS[req.priority] || "bg-gray-100"}>{req.priority}</Badge>
                      <Badge className={STATUS_COLORS[req.status] || "bg-gray-100"}>{req.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            {selectedRequest ? (
              <Card className="sticky top-20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Request #{selectedRequest.id}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div><span className="text-gray-500">Client:</span> <span className="font-medium">{selectedRequest.name}</span></div>
                  <div><span className="text-gray-500">Email:</span> {selectedRequest.email}</div>
                  <div><span className="text-gray-500">Phone:</span> {selectedRequest.phone || 'N/A'}</div>
                  <div><span className="text-gray-500">Company:</span> {selectedRequest.company || 'N/A'}</div>
                  <div><span className="text-gray-500">Event Type:</span> {selectedRequest.eventType}</div>
                  <div><span className="text-gray-500">Date:</span> {selectedRequest.eventDate || 'TBD'}</div>
                  <div><span className="text-gray-500">Guests:</span> {selectedRequest.guestCount || 'TBD'}</div>
                  <div><span className="text-gray-500">Venue:</span> {selectedRequest.venue || 'TBD'}</div>
                  <div><span className="text-gray-500">Budget:</span> {selectedRequest.budget || 'Not specified'}</div>
                  {selectedRequest.dietaryRequirements && <div><span className="text-gray-500">Dietary:</span> {selectedRequest.dietaryRequirements}</div>}
                  {selectedRequest.details && <div><span className="text-gray-500">Details:</span> {selectedRequest.details}</div>}
                  {selectedRequest.services?.length > 0 && <div><span className="text-gray-500">Services:</span> {selectedRequest.services.join(', ')}</div>}

                  <div className="border-t pt-3 space-y-2">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => { setQuotationRequest(selectedRequest); setActiveTab("quotation-builder"); }}>
                      <Receipt className="h-4 w-4 mr-1" /> Build Quotation for This Request
                    </Button>

                    <Select onValueChange={(val) => onUpdateRequest(selectedRequest.id, { status: val })}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Update Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="quoted">Mark as Quoted</SelectItem>
                        <SelectItem value="confirmed">Confirm</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="closed">Close</SelectItem>
                      </SelectContent>
                    </Select>

                    {selectedRequest.status === "confirmed" && (
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => {
                        onCreateEvent({
                          requestId: selectedRequest.id,
                          title: `${selectedRequest.eventType} - ${selectedRequest.name}`,
                          eventDate: selectedRequest.eventDate || new Date().toISOString().split('T')[0],
                          venue: selectedRequest.venue || "TBD",
                          guestCount: selectedRequest.guestCount || 0,
                          status: "planning",
                        });
                      }}>
                        <Plus className="h-3 w-3 mr-1" /> Create Event
                      </Button>
                    )}
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex gap-2">
                      {selectedRequest.email && (
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => window.open(`mailto:${selectedRequest.email}?subject=RE: ${selectedRequest.eventType} Service Request - TOCEPS`)}>
                          <Mail className="h-3 w-3 mr-1" /> Email
                        </Button>
                      )}
                      {selectedRequest.phone && (
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => window.open(`tel:${selectedRequest.phone}`)}>
                          <Phone className="h-3 w-3 mr-1" /> Call
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-20">
                <CardContent className="py-8 text-center text-gray-500">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Select a request to view details
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="quotation-builder">
        <QuotationBuilder
          request={quotationRequest}
          requests={requests}
          onSelectRequest={setQuotationRequest}
          onSave={(data: any) => { onCreateQuotation(data); setQuotationRequest(null); }}
        />
      </TabsContent>

      <TabsContent value="quotations">
        <QuotationsList quotations={quotations} onPreview={setPreviewQuotation} onUpdateQuotation={onUpdateQuotation} />
        {previewQuotation && (
          <Dialog open={!!previewQuotation} onOpenChange={() => setPreviewQuotation(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <QuotationPreview quotation={previewQuotation} onClose={() => setPreviewQuotation(null)} />
            </DialogContent>
          </Dialog>
        )}
      </TabsContent>

      <TabsContent value="approvals">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><ArrowUpCircle className="h-5 w-5 text-purple-600" /> Pending Quotations</h3>
            {quotedRequests.length === 0 ? <Card><CardContent className="py-4 text-center text-gray-500 text-sm">No pending quotations</CardContent></Card> : quotedRequests.map((r: any) => (
              <Card key={r.id} className="mb-2">
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{r.name} - {r.eventType}</p>
                    <p className="text-xs text-gray-500">Quoted: ${r.quotationAmount || 'N/A'} | {r.eventDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs h-7" onClick={() => onUpdateRequest(r.id, { status: "confirmed" })}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Confirm
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { setSelectedRequest(r); setActiveTab("requests"); }}>Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /> Confirmed - Ready to Create Event</h3>
            {confirmedRequests.length === 0 ? <Card><CardContent className="py-4 text-center text-gray-500 text-sm">No confirmed requests awaiting event creation</CardContent></Card> : confirmedRequests.map((r: any) => (
              <Card key={r.id} className="mb-2">
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{r.name} - {r.eventType}</p>
                    <p className="text-xs text-gray-500">{r.guestCount} guests | {r.venue || 'Venue TBD'} | {r.eventDate}</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs h-7" onClick={() => {
                    onCreateEvent({
                      requestId: r.id, title: `${r.eventType} - ${r.name}`,
                      eventDate: r.eventDate || new Date().toISOString().split('T')[0],
                      venue: r.venue || "TBD", guestCount: r.guestCount || 0, status: "planning",
                    });
                  }}><Plus className="h-3 w-3 mr-1" /> Create Event</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="events">
        <EventsList events={events} />
      </TabsContent>

      <TabsContent value="reports">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Request Pipeline</CardTitle></CardHeader>
            <CardContent>
              {["new","reviewing","quoted","confirmed","in_progress","completed","closed"].map(s => {
                const count = requests.filter((r: any) => r.status === s).length;
                return (
                  <div key={s} className="flex items-center justify-between py-1.5 border-b last:border-0">
                    <Badge className={STATUS_COLORS[s] + " text-xs"}>{s.replace(/_/g, ' ')}</Badge>
                    <span className="font-semibold">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Quotation Summary</CardTitle></CardHeader>
            <CardContent>
              {["draft","sent","accepted","rejected","expired"].map(s => {
                const count = quotations.filter((q: any) => q.status === s).length;
                return (
                  <div key={s} className="flex items-center justify-between py-1.5 border-b last:border-0">
                    <Badge className={s === "accepted" ? "bg-green-100 text-green-800 text-xs" : s === "rejected" ? "bg-red-100 text-red-800 text-xs" : s === "sent" ? "bg-blue-100 text-blue-800 text-xs" : "bg-gray-100 text-gray-800 text-xs"}>{s}</Badge>
                    <span className="font-semibold">{count}</span>
                  </div>
                );
              })}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Total Quotation Value</span><span className="font-bold">${quotations.reduce((sum: number, q: any) => sum + parseFloat(q.totalAmount || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Task Completion by Role</CardTitle></CardHeader>
          <CardContent>
            {Object.entries(ROLE_LABELS).map(([role, label]) => {
              const roleTasks = allTasks.filter((t: any) => t.role === role);
              const done = roleTasks.filter((t: any) => t.status === "done").length;
              const pct = roleTasks.length > 0 ? Math.round((done / roleTasks.length) * 100) : 0;
              return (
                <div key={role} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <span className="text-xs w-40 shrink-0">{label}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${pct}%` }} /></div>
                  <span className="text-xs text-gray-500 w-16 text-right">{done}/{roleTasks.length}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="staff">
        <StaffDirectory staff={staff} onRefresh={() => queryClient.invalidateQueries({ queryKey: ["/api/catering/staff"] })} />
      </TabsContent>
    </Tabs>
  );
}

// ===== QUOTATION BUILDER =====
// Service pricing config is in client/src/lib/cateringConfig.ts

interface LineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  total: number;
}

function generateItemsFromServices(serviceIds: string[], guestCount: number): LineItem[] {
  const seen = new Set<string>();
  const items: LineItem[] = [];
  serviceIds.forEach(serviceId => {
    const templates = SERVICE_LINE_ITEMS[serviceId] || [];
    templates.forEach(tpl => {
      if (!seen.has(tpl.name)) {
        seen.add(tpl.name);
        const qty = tpl.scaledByParticipants ? guestCount : 1;
        items.push({
          id: `auto-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          category: tpl.category,
          description: tpl.name,
          quantity: qty,
          unitPrice: tpl.unitPrice,
          unit: tpl.unit,
          total: qty * tpl.unitPrice,
        });
      }
    });
  });
  return items;
}

function ResourcePlanBuilder({ request, requests, onSelectRequest, token }: any) {
  const { toast } = useToast();
  const [selectedReq, setSelectedReq] = useState<any>(request);
  const [isSending, setIsSending] = useState(false);
  const [eventBrief, setEventBrief] = useState("");
  const [menuPlan, setMenuPlan] = useState("");
  const [staffingPlan, setStaffingPlan] = useState("- Head Chef: 1\n- Sous Chef: 2\n- Service Staff: 4\n- Logistics Staff: 2\n- Food Safety Officer: 1");
  const [equipmentList, setEquipmentList] = useState("- Chafing dishes (6)\n- Serving utensils (full set)\n- Tablecloths and napkins\n- Portable food warmers\n- Water dispensers\n- Food safety thermometers");
  const [serviceTimeline, setServiceTimeline] = useState("- T-2 days: Final menu confirmation and ingredient procurement\n- T-1 day: Food prep, equipment check, staff briefing\n- Event day (3 hrs before): Setup, venue preparation\n- Event day (1 hr before): Food heating, plating prep, safety checks\n- During event: Service delivery and monitoring\n- Post-event: Cleanup, equipment collection, incident report");
  const [foodSafetyNotes, setFoodSafetyNotes] = useState("All food prepared under HACCP guidelines. Temperature logs maintained throughout. Allergen information displayed. Staff hold valid food handler certificates.");
  const [additionalNotes, setAdditionalNotes] = useState("");

  useEffect(() => {
    if (request) {
      setSelectedReq(request);
      const services = Array.isArray(request.services) && request.services.length > 0
        ? request.services.map((s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())).join(", ")
        : "To be determined";
      setEventBrief(`Event Type: ${request.eventType}\nDate: ${request.eventDate || "TBD"}\nVenue: ${request.venue || "TBD"}\nGuest Count: ${request.guestCount || "TBD"}\nServices: ${services}${request.dietaryRequirements ? `\nDietary Requirements: ${request.dietaryRequirements}` : ""}`);
      const menuBase = Array.isArray(request.services) && request.services.length > 0
        ? request.services.map((s: string) => `- ${s.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}: [Menu items to be finalized with Head Chef]`).join("\n")
        : "- Full service menu to be determined\n- Dietary requirements will be accommodated";
      setMenuPlan(menuBase);
    }
  }, [request]);

  const handleSelect = (req: any) => {
    setSelectedReq(req);
    onSelectRequest(req);
  };

  const handleSend = async () => {
    if (!selectedReq) { toast({ title: "No Request Selected", description: "Please select a customer request first.", variant: "destructive" }); return; }
    if (!eventBrief.trim()) { toast({ title: "Event Brief Required", description: "Please fill in the event brief.", variant: "destructive" }); return; }
    setIsSending(true);
    try {
      const res = await fetch(`/api/catering/requests/${selectedReq.id}/resource-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ eventBrief, menuPlan, staffingPlan, equipmentList, serviceTimeline, foodSafetyNotes, additionalNotes }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Resource Plan Sent!", description: `Resource plan emailed to ${selectedReq.email}` });
      } else {
        throw new Error(data.error || "Failed to send");
      }
    } catch (err: any) {
      toast({ title: "Send Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h3 className="font-semibold text-lg">Resource Plan Builder</h3>
        <p className="text-sm text-gray-500">Create a professional operational resource plan and send it directly to the customer — covers menu, staffing, equipment, timeline, and food safety</p>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">Select Customer Request</CardTitle></CardHeader>
        <CardContent>
          <select className="w-full border rounded-md p-2 text-sm" value={selectedReq?.id || ""} onChange={e => { const r = (requests || []).find((x: any) => x.id === Number(e.target.value)); if (r) handleSelect(r); }}>
            <option value="">— Select a request —</option>
            {(requests || []).map((r: any) => (
              <option key={r.id} value={r.id}>{r.name} ({r.company || "Individual"}) — {r.eventType} | {r.eventDate || "Date TBD"} | #{r.id}</option>
            ))}
          </select>
          {selectedReq && (
            <div className="mt-3 p-3 bg-green-50 rounded-md text-sm">
              <p className="font-medium text-green-800">{selectedReq.name} — {selectedReq.eventType}</p>
              <p className="text-green-700 text-xs mt-0.5">{selectedReq.email} | {selectedReq.guestCount} guests | {selectedReq.venue || "Venue TBD"}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1"><FileSpreadsheet className="h-4 w-4 text-green-700" /> Event Brief</CardTitle></CardHeader>
          <CardContent>
            <textarea className="w-full border rounded-md p-2 text-sm font-mono" rows={6} value={eventBrief} onChange={e => setEventBrief(e.target.value)} placeholder="Auto-populated from request. Edit as needed." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1"><ClipboardList className="h-4 w-4 text-orange-600" /> Proposed Menu / Service Plan</CardTitle></CardHeader>
          <CardContent>
            <textarea className="w-full border rounded-md p-2 text-sm font-mono" rows={6} value={menuPlan} onChange={e => setMenuPlan(e.target.value)} placeholder="List proposed menu items per service category..." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1"><Users className="h-4 w-4 text-blue-600" /> Staffing Plan</CardTitle></CardHeader>
          <CardContent>
            <textarea className="w-full border rounded-md p-2 text-sm font-mono" rows={6} value={staffingPlan} onChange={e => setStaffingPlan(e.target.value)} placeholder="List staff roles and headcount..." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1"><Settings className="h-4 w-4 text-purple-600" /> Equipment & Logistics</CardTitle></CardHeader>
          <CardContent>
            <textarea className="w-full border rounded-md p-2 text-sm font-mono" rows={6} value={equipmentList} onChange={e => setEquipmentList(e.target.value)} placeholder="List equipment, vehicles, setup requirements..." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1"><Calendar className="h-4 w-4 text-indigo-600" /> Service Timeline</CardTitle></CardHeader>
          <CardContent>
            <textarea className="w-full border rounded-md p-2 text-sm font-mono" rows={6} value={serviceTimeline} onChange={e => setServiceTimeline(e.target.value)} placeholder="List key milestones and times..." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1"><CheckCircle className="h-4 w-4 text-red-600" /> Food Safety & HACCP Notes</CardTitle></CardHeader>
          <CardContent>
            <textarea className="w-full border rounded-md p-2 text-sm font-mono" rows={6} value={foodSafetyNotes} onChange={e => setFoodSafetyNotes(e.target.value)} placeholder="HACCP compliance, allergen management, temperature controls..." />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Additional Notes</CardTitle></CardHeader>
        <CardContent>
          <textarea className="w-full border rounded-md p-2 text-sm" rows={3} value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} placeholder="Any additional information for the customer..." />
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="outline" onClick={() => { setEventBrief(""); setMenuPlan(""); setAdditionalNotes(""); setSelectedReq(null); onSelectRequest(null); }}>
          Reset
        </Button>
        <Button className="bg-green-700 hover:bg-green-800 text-white gap-2" onClick={handleSend} disabled={isSending || !selectedReq}>
          {isSending ? <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Sending...</> : <><Send className="h-4 w-4" /> Send Resource Plan to Customer</>}
        </Button>
      </div>
    </div>
  );
}

function QuotationBuilder({ request, requests, onSelectRequest, onSave, onSaveAndSend, isSending }: any) {
  const [selectedReq, setSelectedReq] = useState<any>(request);
  const [manualClient, setManualClient] = useState({ name: "", email: "", phone: "", company: "", eventType: "", eventDate: "", venue: "", guestCount: 0, urgency: "", details: "" });
  const [manualServices, setManualServices] = useState<string[]>([]);
  const [reqServices, setReqServices] = useState<string[]>([]);
  const [useManual, setUseManual] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("fixed");
  const [currency, setCurrency] = useState("USD");
  const [validDays, setValidDays] = useState(30);
  const [paymentTerms, setPaymentTerms] = useState("50% deposit upon confirmation, balance due 3 business days before event date.");
  const [terms, setTerms] = useState("1. Prices are subject to change if event details are modified after quotation acceptance.\n2. Cancellation within 7 days of event: 50% cancellation fee applies.\n3. Menu changes must be communicated at least 5 business days before event.\n4. Final guest count confirmation required 3 business days before event.\n5. TOCEPS maintains HACCP food safety compliance on all catering services.\n6. Equipment rental includes delivery, setup, and collection.");
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [includeCoverNote, setIncludeCoverNote] = useState(true);

  useEffect(() => {
    if (request) {
      setSelectedReq(request);
      setUseManual(false);
      if (request.durationDays && request.durationDays > 1) {
        setNumberOfDays(request.durationDays);
      }
      const services = Array.isArray(request.services) ? request.services : [];
      setReqServices(services);
      if (services.length > 0) {
        const guestCount = getPricingCountFromGuestCount(request.guestCount);
        const surcharge = getUrgencySurcharge(request.budget);
        const autoItems = generateItemsFromServices(services, guestCount).map(item => ({
          ...item,
          unitPrice: surcharge > 0 ? parseFloat((item.unitPrice * (1 + surcharge / 100)).toFixed(2)) : item.unitPrice,
          total: surcharge > 0 ? parseFloat((item.total * (1 + surcharge / 100)).toFixed(2)) : item.total,
        }));
        if (autoItems.length > 0) setLineItems(autoItems);
      }
    }
  }, [request]);

  const addCustomItem = () => {
    setLineItems([...lineItems, {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      category: "custom",
      description: "",
      quantity: 1,
      unitPrice: 0,
      unit: "per unit",
      total: 0,
    }]);
  };

  const updateItem = (id: string, field: string, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        updated.total = updated.quantity * updated.unitPrice;
      }
      return updated;
    }));
  };

  const removeItem = (id: string) => setLineItems(lineItems.filter(i => i.id !== id));

  const perDaySubtotal = lineItems.reduce((sum, i) => sum + i.total, 0);
  const subtotal = perDaySubtotal * numberOfDays;
  const discountAmount = discountType === "percentage" ? subtotal * (discount / 100) : discount;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxRate / 100);
  const totalAmount = taxableAmount + taxAmount;

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + validDays);

  const generateQuotationNumber = () => {
    const now = new Date();
    return `TOCEPS-Q-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  };

  const activeSource = useManual ? manualClient : selectedReq;

  const isRevision = !useManual && selectedReq?.status === "quoted";

  const generateCoverNote = () => {
    const src = useManual ? manualClient : selectedReq;
    const clientName = src?.name || "Client";
    const eventType = (src?.eventType || "event").replace(/_/g, " ");
    const eventDate = src?.eventDate ? ` on ${src.eventDate}` : "";
    const daysLine = numberOfDays > 1 ? ` covering ${numberOfDays} days` : "";
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    if (isRevision) {
      const prevDays = src?.durationDays || 1;
      const durationCorrected = numberOfDays > 1 && prevDays <= 1;
      return `Dear ${clientName},

Please find attached a revised quotation${eventDate}. We wish to inform you that our initial quotation was prepared in error and did not correctly reflect ${durationCorrected ? `the full ${numberOfDays}-day duration of your event` : "all the details of your event"}.

This revised quotation${daysLine} supersedes the one previously submitted and reflects the correct pricing and event parameters.

We sincerely apologise for any inconvenience this may have caused. Please do not hesitate to contact us should you need any clarification or wish to discuss the details further.

Warm regards,
TOCEPS Operations Team
TOTAG Group of Companies Ltd
Email: toceps@totaggroup.com`;
    }

    return `Dear ${clientName},

Thank you for your interest in TOCEPS Catering & Events Planning Services. Please find attached your quotation for the upcoming ${eventType}${eventDate}${daysLine}.

This quotation outlines all services, pricing, and applicable terms. It is valid for ${validDays} days from the date of issue.

To confirm this booking or for any queries, please reach us at toceps@totaggroup.com or visit totaggroup.com.

We look forward to serving you.

Warm regards,
TOCEPS Operations Team
TOTAG Group of Companies Ltd`;
  };

  const buildQuotData = () => {
    const src = useManual ? manualClient : selectedReq;
    return {
      requestId: useManual ? (requests[0]?.id || 1) : selectedReq.id,
      quotationNumber: generateQuotationNumber(),
      clientName: src.name || "Walk-in Client",
      clientEmail: src.email || "",
      clientPhone: src.phone || "",
      clientCompany: src.company || "",
      eventType: src.eventType || "Custom",
      eventDate: src.eventDate || "",
      venue: src.venue || "",
      guestCount: src.guestCount || 0,
      lineItems: lineItems,
      numberOfDays,
      subtotal: subtotal.toFixed(2),
      perDaySubtotal: perDaySubtotal.toFixed(2),
      taxRate: taxRate.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discount: discountAmount.toFixed(2),
      discountType,
      totalAmount: totalAmount.toFixed(2),
      currency,
      validUntil: validUntil.toISOString().split('T')[0],
      paymentTerms,
      termsAndConditions: terms,
      notes,
      coverNote: includeCoverNote ? coverNote : "",
      isRevision: isRevision ? 1 : 0,
      status: "draft",
    };
  };

  const resetForm = () => {
    setLineItems([]);
    setSelectedReq(null);
    setUseManual(false);
    setManualServices([]);
    setReqServices([]);
    setManualClient({ name: "", email: "", phone: "", company: "", eventType: "", eventDate: "", venue: "", guestCount: 0, urgency: "", details: "" });
    setNotes("");
    setNumberOfDays(1);
  };

  const handleSave = () => {
    if ((!selectedReq && !useManual) || lineItems.length === 0) return;
    if (useManual && !manualClient.name) return;
    onSave(buildQuotData());
    resetForm();
  };

  const openSendDialog = () => {
    if ((!selectedReq && !useManual) || lineItems.length === 0) return;
    if (useManual && !manualClient.name) return;
    setCoverNote(generateCoverNote());
    setIncludeCoverNote(true);
    setShowSendDialog(true);
  };

  const handleSaveAndSend = () => {
    if (onSaveAndSend) {
      onSaveAndSend(buildQuotData());
      resetForm();
      setShowSendDialog(false);
    } else {
      handleSave();
      setShowSendDialog(false);
    }
  };

  const quotationForPreview = {
    quotationNumber: generateQuotationNumber(),
    clientName: activeSource?.name || "",
    clientEmail: activeSource?.email || "",
    clientPhone: activeSource?.phone || "",
    clientCompany: activeSource?.company || "",
    eventType: activeSource?.eventType || "",
    eventDate: activeSource?.eventDate || "",
    venue: activeSource?.venue || "",
    guestCount: activeSource?.guestCount || 0,
    lineItems,
    numberOfDays,
    perDaySubtotal: perDaySubtotal.toFixed(2),
    subtotal: subtotal.toFixed(2),
    taxRate: taxRate.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    discount: discountAmount.toFixed(2),
    discountType,
    totalAmount: totalAmount.toFixed(2),
    currency,
    validUntil: validUntil.toISOString().split('T')[0],
    paymentTerms,
    termsAndConditions: terms,
    notes,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2"><Receipt className="h-5 w-5 text-purple-600" /> Quotation Builder</h3>
          <p className="text-sm text-gray-500">Create detailed, itemized quotations from client requests</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {lineItems.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                <Eye className="h-4 w-4 mr-1" /> Preview
              </Button>
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50" size="sm" onClick={handleSave}>
                <FileCheck className="h-4 w-4 mr-1" /> Save Draft
              </Button>
              {onSaveAndSend && (
                <Button className="bg-green-700 hover:bg-green-800 text-white" size="sm" onClick={openSendDialog} disabled={isSending}>
                  <Send className="h-4 w-4 mr-1" /> Save & Send to {activeSource?.email || "Customer"}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {!selectedReq && !useManual ? (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Step 1: Select a Request or Enter Client Details</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">Choose a client request to build a quotation for, or enter client details manually.</p>
                <Button variant="outline" size="sm" onClick={() => setUseManual(true)}>
                  <Plus className="h-3 w-3 mr-1" /> New Client (Manual)
                </Button>
              </div>
              <div className="space-y-2">
                {requests.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No requests available. Click "New Client" above to create a standalone quotation.</p>
                ) : requests.map((r: any) => (
                  <Card key={r.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedReq(r); onSelectRequest(r); }}>
                    <CardContent className="py-3 px-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{r.name} {r.company ? `(${r.company})` : ''}</p>
                        <p className="text-xs text-gray-500">{EVENT_TYPES.find(e => e.value === r.eventType)?.label || r.eventType} | {r.guestCount || '?'} participants | {r.eventDate || 'TBD'}</p>
                        {r.services?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {r.services.map((sid: string) => (
                              <span key={sid} className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{CATERING_SERVICES.find(s => s.id === sid)?.label ?? sid}</span>
                            ))}
                          </div>
                        )}
                        {r.budget && <p className="text-xs text-amber-700 mt-0.5">Urgency: {URGENCY_LEVELS.find(u => u.value === r.budget)?.label || r.budget}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={STATUS_COLORS[r.status]}>{r.status}</Badge>
                        <Button size="sm" variant="outline" className="text-xs h-7"><Receipt className="h-3 w-3 mr-1" /> Quote</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : useManual && !selectedReq ? (
        <>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Client Details (Manual Entry)</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setUseManual(false); setLineItems([]); }}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Client Name *</Label>
                  <Input value={manualClient.name} onChange={e => setManualClient({ ...manualClient, name: e.target.value })} placeholder="Full name" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input value={manualClient.email} onChange={e => setManualClient({ ...manualClient, email: e.target.value })} placeholder="email@example.com" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input value={manualClient.phone} onChange={e => setManualClient({ ...manualClient, phone: e.target.value })} placeholder="+231..." className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Company / Organization</Label>
                  <Input value={manualClient.company} onChange={e => setManualClient({ ...manualClient, company: e.target.value })} placeholder="Company name" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Event Type</Label>
                  <Select value={manualClient.eventType} onValueChange={v => setManualClient({ ...manualClient, eventType: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select event type" /></SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map(et => <SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Event Date</Label>
                  <Input type="date" value={manualClient.eventDate} onChange={e => setManualClient({ ...manualClient, eventDate: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Venue Location</Label>
                  <Input value={manualClient.venue} onChange={e => setManualClient({ ...manualClient, venue: e.target.value })} placeholder="Event venue or 'Need recommendation'" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Expected Participants</Label>
                  <Select value={PARTICIPANT_RANGES.find(r => r.pricingCount === manualClient.guestCount)?.value || ""} onValueChange={v => {
                    const range = PARTICIPANT_RANGES.find(r => r.value === v);
                    setManualClient({ ...manualClient, guestCount: range?.pricingCount ?? 0 });
                  }}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select participant range" /></SelectTrigger>
                    <SelectContent>
                      {PARTICIPANT_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Urgency</Label>
                  <Select value={manualClient.urgency} onValueChange={v => setManualClient({ ...manualClient, urgency: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select urgency" /></SelectTrigger>
                    <SelectContent>
                      {URGENCY_LEVELS.map(u => <SelectItem key={u.value} value={u.value}>{u.label}{u.surchargePercent > 0 ? ` (+${u.surchargePercent}% surcharge)` : ""}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-3">
                <Label className="text-xs">Additional Details / Special Requirements</Label>
                <Textarea value={manualClient.details} onChange={e => setManualClient({ ...manualClient, details: e.target.value })} rows={2} placeholder="Dietary needs, AV requirements, seating arrangement, transportation..." className="mt-1" />
              </div>
              <div className="mt-4 border-t pt-4">
                <Label className="text-xs font-semibold text-gray-700">Services Required</Label>
                <p className="text-xs text-gray-500 mb-2">Select all services that apply — line items will be auto-generated from your selection</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {CATERING_SERVICES.map(svc => (
                    <label key={svc.id} className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-sm transition-colors ${manualServices.includes(svc.id) ? "bg-green-50 border-green-400 text-green-800" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
                      <input type="checkbox" checked={manualServices.includes(svc.id)}
                        onChange={() => setManualServices(prev => prev.includes(svc.id) ? prev.filter(id => id !== svc.id) : [...prev, svc.id])}
                        className="rounded border-gray-300" />
                      {svc.label}
                    </label>
                  ))}
                </div>
                <Button className="mt-3 w-full bg-purple-700 hover:bg-purple-800" size="sm"
                  disabled={manualServices.length === 0 || !manualClient.name}
                  onClick={() => {
                    const pricingCount = manualClient.guestCount || 50;
                    const surcharge = getUrgencySurcharge(manualClient.urgency);
                    const items = generateItemsFromServices(manualServices, pricingCount).map(item => ({
                      ...item,
                      unitPrice: surcharge > 0 ? parseFloat((item.unitPrice * (1 + surcharge / 100)).toFixed(2)) : item.unitPrice,
                      total: surcharge > 0 ? parseFloat((item.total * (1 + surcharge / 100)).toFixed(2)) : item.total,
                    }));
                    setLineItems(items);
                  }}>
                  <Sparkles className="h-4 w-4 mr-1" /> Generate Quotation Items ({manualServices.length} service{manualServices.length !== 1 ? "s" : ""} selected)
                </Button>
                {lineItems.length > 0 && (
                  <p className="text-xs text-green-700 mt-1 font-medium">✓ {lineItems.length} line items generated — review and adjust prices below</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Line Items</CardTitle>
                    <Button variant="outline" size="sm" onClick={addCustomItem}><Plus className="h-3 w-3 mr-1" /> Custom Item</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {lineItems.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">Select services above and click Generate to auto-populate line items, or click "+ Custom Item" to add manually.</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
                        <div className="col-span-5">Description</div>
                        <div className="col-span-2">Qty</div>
                        <div className="col-span-2">Unit Price</div>
                        <div className="col-span-2 text-right">Total</div>
                        <div className="col-span-1"></div>
                      </div>
                      {lineItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-lg p-2">
                          <div className="col-span-5">
                            <Input value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)} placeholder="Item description" className="h-8 text-sm" />
                            <span className="text-[10px] text-gray-400">{item.unit}</span>
                          </div>
                          <div className="col-span-2">
                            <Input type="number" value={item.quantity} onChange={e => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)} className="h-8 text-sm" min="0" />
                          </div>
                          <div className="col-span-2">
                            <Input type="number" value={item.unitPrice} onChange={e => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)} className="h-8 text-sm" min="0" step="0.01" />
                          </div>
                          <div className="col-span-2 text-right font-semibold text-sm">
                            ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="col-span-1 text-center">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            <div className="space-y-4">
              <Card className="sticky top-20">
                <CardHeader className="pb-2"><CardTitle className="text-base">Pricing Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs font-semibold text-blue-700">Event Duration (Days)</Label>
                    <Input type="number" value={numberOfDays} min="1" step="1"
                      onChange={e => setNumberOfDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-8 text-sm mt-1" />
                    {numberOfDays > 1 && (
                      <p className="text-xs text-blue-600 mt-1">Line item prices are per day × {numberOfDays} days</p>
                    )}
                  </div>
                  {numberOfDays > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Per Day ({lineItems.length} items)</span>
                      <span>${perDaySubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {numberOfDays > 1 ? `${numberOfDays}-Day Subtotal` : `Subtotal (${lineItems.length} items)`}
                    </span>
                    <span className="font-medium">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <Label className="text-xs">Discount</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="h-8 text-sm" min="0" step="0.01" />
                      <Select value={discountType} onValueChange={setDiscountType}>
                        <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="fixed">USD</SelectItem><SelectItem value="percentage">%</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  {discountAmount > 0 && <div className="flex justify-between text-sm text-red-600"><span>Discount</span><span>-${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>}
                  <div>
                    <Label className="text-xs">Tax Rate (%)</Label>
                    <Input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="h-8 text-sm mt-1" min="0" max="100" step="0.5" />
                  </div>
                  {taxAmount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax ({taxRate}%)</span><span>${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-green-700">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
                  </div>
                  <div className="border-t pt-3 space-y-2">
                    <div>
                      <Label className="text-xs">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="h-8 text-sm mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="USD">USD - US Dollar</SelectItem><SelectItem value="LRD">LRD - Liberian Dollar</SelectItem><SelectItem value="EUR">EUR - Euro</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Valid For (days)</Label>
                      <Input type="number" value={validDays} onChange={e => setValidDays(parseInt(e.target.value) || 30)} className="h-8 text-sm mt-1" min="1" />
                      <p className="text-[10px] text-gray-400 mt-1">Expires: {validUntil.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="border-t pt-3 space-y-2">
                    <div>
                      <Label className="text-xs">Payment Terms</Label>
                      <Textarea value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} rows={2} className="text-xs mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Additional Notes</Label>
                      <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="text-xs mt-1" placeholder="Any special notes..." />
                    </div>
                  </div>
                  <div className="border-t pt-3 space-y-2">
                    <Button variant="outline" className="w-full" size="sm" onClick={() => setShowPreview(true)} disabled={lineItems.length === 0}>
                      <Eye className="h-4 w-4 mr-1" /> Preview Quotation
                    </Button>
                    <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50" size="sm" onClick={handleSave} disabled={lineItems.length === 0 || !manualClient.name}>
                      <FileCheck className="h-4 w-4 mr-1" /> Save Draft
                    </Button>
                    {onSaveAndSend && (
                      <Button className="w-full bg-green-700 hover:bg-green-800" size="sm" onClick={openSendDialog} disabled={lineItems.length === 0 || !manualClient.name || isSending}>
                        <Send className="h-4 w-4 mr-1" /> Save & Send to {manualClient.email || "Customer"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Terms & Conditions</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={terms} onChange={e => setTerms(e.target.value)} rows={6} className="text-xs" />
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold">{selectedReq.name} {selectedReq.company ? `(${selectedReq.company})` : ''}</p>
                  <p className="text-sm text-gray-500">{selectedReq.eventType} | {selectedReq.guestCount || '?'} guests | {selectedReq.eventDate || 'TBD'} | {selectedReq.venue || 'TBD'}</p>
                  {selectedReq.email && <p className="text-xs text-blue-600 mt-0.5"><Mail className="h-3 w-3 inline mr-0.5" />{selectedReq.email}</p>}
                  {selectedReq.services?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-xs text-gray-500 mr-1">Customer selected:</span>
                      {selectedReq.services.map((s: string) => (
                        <span key={s} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          {s.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedReq.dietaryRequirements && <p className="text-xs text-amber-700 mt-1">Dietary: {selectedReq.dietaryRequirements}</p>}
                  {selectedReq.details && <p className="text-xs text-gray-500 mt-0.5">{selectedReq.details}</p>}
                  {selectedReq.budget && <p className="text-xs text-green-600 mt-0.5 font-medium">Client Budget/Urgency: {selectedReq.budget}</p>}
                  {lineItems.length > 0 && selectedReq.services?.length > 0 && (
                    <p className="text-xs text-green-700 mt-1 font-medium">✓ {lineItems.length} line items auto-populated from requested services</p>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedReq(null); onSelectRequest(null); setLineItems([]); }}>
                  <X className="h-4 w-4" /> Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Service selection panel — always visible so supervisor can adjust or generate from scratch */}
          <Card className="border border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-purple-800">
                {reqServices.length > 0 ? "Services Requested by Customer" : "Select Services to Quote"}
              </CardTitle>
              <p className="text-xs text-purple-600 mt-0.5">
                {reqServices.length > 0
                  ? "Pre-checked from customer's submission. Adjust if needed, then click Generate."
                  : "This request has no pre-selected services. Check all applicable services below, then click Generate."}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {CATERING_SERVICES.map(svc => (
                  <label key={svc.id} className={`flex items-center gap-2 text-sm p-2 rounded border cursor-pointer transition-colors ${reqServices.includes(svc.id) ? "bg-purple-100 border-purple-400 text-purple-800 font-medium" : "bg-white border-gray-200 text-gray-700 hover:bg-purple-50"}`}>
                    <input type="checkbox" className="rounded" checked={reqServices.includes(svc.id)}
                      onChange={e => setReqServices(prev => e.target.checked ? [...prev, svc.id] : prev.filter(id => id !== svc.id))} />
                    {svc.label}
                  </label>
                ))}
              </div>
              <Button className="w-full bg-purple-700 hover:bg-purple-800" size="sm"
                disabled={reqServices.length === 0}
                onClick={() => {
                  const guestCount = getPricingCountFromGuestCount(selectedReq.guestCount);
                  const surcharge = getUrgencySurcharge(selectedReq.budget);
                  const items = generateItemsFromServices(reqServices, guestCount).map(item => ({
                    ...item,
                    unitPrice: surcharge > 0 ? parseFloat((item.unitPrice * (1 + surcharge / 100)).toFixed(2)) : item.unitPrice,
                    total: surcharge > 0 ? parseFloat((item.total * (1 + surcharge / 100)).toFixed(2)) : item.total,
                  }));
                  setLineItems(items);
                }}>
                <Sparkles className="h-4 w-4 mr-1" />
                {lineItems.length > 0
                  ? `Regenerate Items (${reqServices.length} service${reqServices.length !== 1 ? "s" : ""})`
                  : `Generate Quotation Items (${reqServices.length} service${reqServices.length !== 1 ? "s" : ""})`}
              </Button>
              {lineItems.length > 0 && (
                <p className="text-xs text-green-700 mt-2 font-medium">✓ {lineItems.length} line items generated — review and adjust prices in the table below</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Line Items</CardTitle>
                    <Button variant="outline" size="sm" onClick={addCustomItem}><Plus className="h-3 w-3 mr-1" /> Custom Item</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {lineItems.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">Select services above and click Generate to populate line items, or click "+ Custom Item" to add items one by one.</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
                        <div className="col-span-5">Description</div>
                        <div className="col-span-2">Qty</div>
                        <div className="col-span-2">Unit Price</div>
                        <div className="col-span-2 text-right">Total</div>
                        <div className="col-span-1"></div>
                      </div>
                      {lineItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-lg p-2">
                          <div className="col-span-5">
                            <Input value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)} placeholder="Item description" className="h-8 text-sm" />
                            <span className="text-[10px] text-gray-400">{item.unit}</span>
                          </div>
                          <div className="col-span-2">
                            <Input type="number" value={item.quantity} onChange={e => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)} className="h-8 text-sm" min="0" />
                          </div>
                          <div className="col-span-2">
                            <Input type="number" value={item.unitPrice} onChange={e => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)} className="h-8 text-sm" min="0" step="0.01" />
                          </div>
                          <div className="col-span-2 text-right font-semibold text-sm">
                            ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="col-span-1 text-center">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            <div className="space-y-4">
              <Card className="sticky top-20">
                <CardHeader className="pb-2"><CardTitle className="text-base">Pricing Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs font-semibold text-blue-700">Event Duration (Days)</Label>
                    <Input type="number" value={numberOfDays} min="1" step="1"
                      onChange={e => setNumberOfDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-8 text-sm mt-1" />
                    {numberOfDays > 1 && (
                      <p className="text-xs text-blue-600 mt-1">Line item prices are per day × {numberOfDays} days</p>
                    )}
                  </div>
                  {numberOfDays > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Per Day ({lineItems.length} items)</span>
                      <span>${perDaySubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {numberOfDays > 1 ? `${numberOfDays}-Day Subtotal` : `Subtotal (${lineItems.length} items)`}
                    </span>
                    <span className="font-medium">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div>
                    <Label className="text-xs">Discount</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="h-8 text-sm" min="0" step="0.01" />
                      <Select value={discountType} onValueChange={setDiscountType}>
                        <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">USD</SelectItem>
                          <SelectItem value="percentage">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {discountAmount > 0 && <div className="flex justify-between text-sm text-red-600"><span>Discount</span><span>-${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>}

                  <div>
                    <Label className="text-xs">Tax Rate (%)</Label>
                    <Input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="h-8 text-sm mt-1" min="0" max="100" step="0.5" />
                  </div>
                  {taxAmount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax ({taxRate}%)</span><span>${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-green-700">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div>
                      <Label className="text-xs">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="h-8 text-sm mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="LRD">LRD - Liberian Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Valid For (days)</Label>
                      <Input type="number" value={validDays} onChange={e => setValidDays(parseInt(e.target.value) || 30)} className="h-8 text-sm mt-1" min="1" />
                      <p className="text-[10px] text-gray-400 mt-1">Expires: {validUntil.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div>
                      <Label className="text-xs">Payment Terms</Label>
                      <Textarea value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} rows={2} className="text-xs mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Additional Notes</Label>
                      <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="text-xs mt-1" placeholder="Any special notes for this quotation..." />
                    </div>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <Button variant="outline" className="w-full" size="sm" onClick={() => setShowPreview(true)} disabled={lineItems.length === 0}>
                      <Eye className="h-4 w-4 mr-1" /> Preview Quotation
                    </Button>
                    <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50" size="sm" onClick={handleSave} disabled={lineItems.length === 0}>
                      <FileCheck className="h-4 w-4 mr-1" /> Save Draft
                    </Button>
                    {onSaveAndSend && (
                      <Button className="w-full bg-green-700 hover:bg-green-800" size="sm" onClick={openSendDialog} disabled={lineItems.length === 0 || isSending}>
                        <Send className="h-4 w-4 mr-1" /> Save & Send to {selectedReq?.email || "Customer"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Terms & Conditions</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={terms} onChange={e => setTerms(e.target.value)} rows={6} className="text-xs" />
            </CardContent>
          </Card>
        </>
      )}

      {showPreview && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <QuotationPreview quotation={quotationForPreview} onClose={() => setShowPreview(false)} />
          </DialogContent>
        </Dialog>
      )}

      {showSendDialog && (
        <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-green-700" />
                {isRevision ? "Send Revised Quotation" : "Send Quotation"}
              </DialogTitle>
            </DialogHeader>

            {isRevision && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>This is a <strong>revised quotation</strong> — the client already received a previous version. A correction note has been pre-written below.</span>
              </div>
            )}

            <div className="space-y-4 mt-1">
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Sending to</p>
                <p className="font-semibold">{activeSource?.name || "—"}</p>
                {activeSource?.company && <p className="text-gray-500 text-xs">{activeSource.company}</p>}
                <p className="text-green-700 font-mono text-xs mt-0.5">{activeSource?.email || "No email"}</p>
                {numberOfDays > 1 && (
                  <p className="text-blue-600 text-xs mt-1 font-medium">Multi-day event: {numberOfDays} days × per-day pricing</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">Cover Note / Message</Label>
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={includeCoverNote}
                      onChange={e => setIncludeCoverNote(e.target.checked)}
                      className="rounded border-gray-300" />
                    Include in email
                  </label>
                </div>
                {includeCoverNote ? (
                  <>
                    <Textarea
                      value={coverNote}
                      onChange={e => setCoverNote(e.target.value)}
                      rows={10}
                      className="text-sm font-mono leading-relaxed"
                      placeholder="Cover note will appear at the top of the quotation email…"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">You can edit this message before sending.</p>
                      <Button variant="ghost" size="sm" className="text-xs text-blue-600 h-6 px-2"
                        onClick={() => setCoverNote(generateCoverNote())}>
                        ↺ Regenerate
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 italic py-2">Cover note excluded — quotation will be sent without a personal message.</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowSendDialog(false)}>Cancel</Button>
                <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white gap-2"
                  onClick={handleSaveAndSend} disabled={isSending}>
                  {isSending
                    ? <><span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> Sending…</>
                    : <><Send className="h-3 w-3" /> Confirm & Send</>}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ===== QUOTATION PREVIEW (Professional Print Layout) =====
function QuotationPreview({ quotation, onClose }: { quotation: any; onClose: () => void }) {
  const items = Array.isArray(quotation.lineItems) ? quotation.lineItems : (typeof quotation.lineItems === 'string' ? JSON.parse(quotation.lineItems) : []);

  const handlePrint = () => {
    const printContent = document.getElementById('quotation-print-area');
    if (!printContent) return;
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).map(el => el.outerHTML).join('\n');
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Quotation ${quotation.quotationNumber}</title>
      ${stylesheets}
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 0; max-width: 800px; margin: 0 auto; }
        @media print {
          body { padding: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      </style>
    </head><body>${printContent.innerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 print:hidden">
        <DialogHeader>
          <DialogTitle className="text-lg">Quotation Preview</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> Print / PDF
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>

      <div id="quotation-print-area" className="bg-white border rounded-lg overflow-hidden relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
          <img src="/images/totag-logo.png" alt="" className="w-80 opacity-[0.04] object-contain" />
        </div>

        {/* Top decorative bar — mirrors letterhead */}
        <div className="flex h-3">
          <div className="bg-green-900 flex-1"></div>
          <div className="bg-orange-500 w-24"></div>
        </div>

        {/* Letterhead header */}
        <div className="flex justify-between items-center px-8 py-4 border-b-2 border-orange-400 relative" style={{ zIndex: 1 }}>
          <img src="/images/totag-logo.png" alt="TOTAG Group of Companies Ltd" className="h-32 w-auto object-contain" />
          <div className="text-right space-y-1">
            <div className="flex items-start justify-end gap-1.5">
              <span className="text-[11px] text-gray-600">Guest House Road, Thinker's Village Community</span>
              <span className="text-gray-400 text-[11px]">🏠</span>
            </div>
            <div className="flex items-start justify-end gap-1.5">
              <span className="text-[11px] text-gray-600">Paynesville, Montserrado, Liberia</span>
              <span className="text-gray-400 text-[11px]">📍</span>
            </div>
            <div className="flex items-start justify-end gap-1.5">
              <span className="text-[11px] text-gray-600">777511391 / 777666999 / 886511391 / 887666999</span>
              <span className="text-gray-400 text-[11px]">📞</span>
            </div>
            <div className="flex items-start justify-end gap-1.5">
              <span className="text-[11px] text-gray-600">info@totaggroup.com</span>
              <span className="text-gray-400 text-[11px]">✉️</span>
            </div>
            <div className="flex items-start justify-end gap-1.5">
              <span className="text-[11px] text-gray-600">www.totaggroup.com</span>
              <span className="text-gray-400 text-[11px]">🌐</span>
            </div>
          </div>
        </div>

        {/* Document title bar */}
        <div className="bg-green-800 px-8 py-3 flex justify-between items-center relative" style={{ zIndex: 1 }}>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-green-300 mb-0.5">Issued by</p>
            <p className="text-sm font-bold text-white">TOCEPS — Catering & Events Planning Services</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-white tracking-wide">QUOTATION</h2>
            <p className="text-[11px] text-green-200 mt-0.5">{quotation.quotationNumber}</p>
          </div>
        </div>

        <div className="px-8 pt-4 pb-2 relative" style={{ zIndex: 1 }}>
          <div className="flex justify-between text-xs text-gray-500 border-b border-green-100 pb-3 mb-5">
            <span>Date: {new Date(quotation.createdAt).toLocaleDateString()}</span>
            <span>Valid Until: {quotation.validUntil}</span>
            <span>Monrovia, Liberia</span>
          </div>
        </div>

        <div className="px-8">
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border-l-[3px] border-l-green-600">
              <h4 className="text-[10px] uppercase tracking-wider text-green-700 font-bold mb-2">Bill To</h4>
              <p className="text-sm font-semibold">{quotation.clientName}</p>
              {quotation.clientCompany && <p className="text-xs text-gray-600">{quotation.clientCompany}</p>}
              <p className="text-xs text-gray-500">{quotation.clientEmail}</p>
              {quotation.clientPhone && <p className="text-xs text-gray-500">{quotation.clientPhone}</p>}
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-l-[3px] border-l-blue-600">
              <h4 className="text-[10px] uppercase tracking-wider text-blue-700 font-bold mb-2">Event Details</h4>
              <p className="text-xs"><strong>Type:</strong> {quotation.eventType}</p>
              <p className="text-xs"><strong>Date:</strong> {quotation.eventDate || 'TBD'}</p>
              {quotation.numberOfDays > 1 && <p className="text-xs font-semibold text-blue-700"><strong>Duration:</strong> {quotation.numberOfDays} days</p>}
              <p className="text-xs"><strong>Venue:</strong> {quotation.venue || 'TBD'}</p>
              <p className="text-xs"><strong>Guests:</strong> {quotation.guestCount || 'TBD'}</p>
            </div>
          </div>

          <table className="w-full mb-5">
            <thead>
              <tr className="bg-gradient-to-r from-green-700 to-green-800 text-white">
                <th className="py-2.5 px-3 text-left text-[10px] uppercase tracking-wider font-semibold rounded-tl-lg">#</th>
                <th className="py-2.5 px-3 text-left text-[10px] uppercase tracking-wider font-semibold">Description</th>
                <th className="py-2.5 px-3 text-center text-[10px] uppercase tracking-wider font-semibold">Qty</th>
                <th className="py-2.5 px-3 text-right text-[10px] uppercase tracking-wider font-semibold">Unit Price</th>
                <th className="py-2.5 px-3 text-right text-[10px] uppercase tracking-wider font-semibold rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? '' : 'bg-green-50/50'}>
                  <td className="py-2 px-3 text-xs text-gray-400">{idx + 1}</td>
                  <td className="py-2 px-3 text-xs">
                    <span className="font-medium">{item.description}</span>
                    <span className="text-gray-400 text-[10px] ml-1">({item.unit})</span>
                  </td>
                  <td className="py-2 px-3 text-xs text-center">{item.quantity}</td>
                  <td className="py-2 px-3 text-xs text-right">{quotation.currency} {parseFloat(item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 px-3 text-xs text-right font-medium">{quotation.currency} {parseFloat(item.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-6">
            <div className="w-72 space-y-1">
              {quotation.numberOfDays > 1 && quotation.perDaySubtotal && (
                <>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-gray-500">Per Day Subtotal</span>
                    <span>{quotation.currency} {parseFloat(quotation.perDaySubtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 text-blue-700 font-medium">
                    <span>× {quotation.numberOfDays} Days</span>
                    <span>{quotation.currency} {parseFloat(quotation.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </>
              )}
              {!(quotation.numberOfDays > 1) && (
                <div className="flex justify-between text-xs py-1"><span className="text-gray-500">Subtotal</span><span>{quotation.currency} {parseFloat(quotation.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
              )}
              {parseFloat(quotation.discount) > 0 && <div className="flex justify-between text-xs py-1 text-orange-600"><span>Discount</span><span>-{quotation.currency} {parseFloat(quotation.discount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>}
              {parseFloat(quotation.taxAmount) > 0 && <div className="flex justify-between text-xs py-1"><span className="text-gray-500">Tax ({quotation.taxRate}%)</span><span>{quotation.currency} {parseFloat(quotation.taxAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>}
              <div className="flex justify-between text-base font-bold pt-2 border-t-2 border-green-700 mt-1">
                <span>Total Amount</span>
                <span className="text-green-700">{quotation.currency} {parseFloat(quotation.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {quotation.paymentTerms && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-[3px] border-l-blue-600">
              <h4 className="text-xs font-bold mb-1 text-blue-800">Payment Terms</h4>
              <p className="text-[11px] text-gray-600">{quotation.paymentTerms}</p>
            </div>
          )}

          {quotation.termsAndConditions && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-[3px] border-l-blue-600">
              <h4 className="text-xs font-bold mb-1 text-blue-800">Terms & Conditions</h4>
              <p className="text-[10px] text-gray-500 whitespace-pre-line leading-relaxed">{quotation.termsAndConditions}</p>
            </div>
          )}

          {quotation.notes && (
            <div className="bg-orange-50 rounded-lg p-4 mb-4 border-l-[3px] border-l-orange-500">
              <h4 className="text-xs font-bold mb-1 text-orange-800">Notes</h4>
              <p className="text-[11px] text-gray-600">{quotation.notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-10 mt-8 mb-6">
            <div>
              <div className="relative">
                <div className="flex items-end gap-3 mb-1 h-16">
                  <img src="/ops-signature.png" alt="Authorized Signature" className="h-14 object-contain" style={{ filter: 'opacity(0.85)' }} />
                </div>
                <div className="border-t-2 border-green-600 pt-2">
                  <p className="text-[10px] text-gray-400">Authorized Signature (TOCEPS)</p>
                  <p className="text-xs font-semibold mt-0.5">General Manager</p>
                  <p className="text-[10px] text-gray-500">TOTAG Catering & Events Planning Services</p>
                </div>
              </div>
            </div>
            <div>
              <div className="border-t-2 border-green-600 pt-2 mt-16">
                <p className="text-[10px] text-gray-400">Client Acceptance Signature</p>
                <p className="text-xs font-medium mt-1">{quotation.clientName}</p>
                {quotation.clientCompany && <p className="text-[10px] text-gray-500">{quotation.clientCompany}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-3 border-t border-gray-200 text-center relative" style={{ zIndex: 1 }}>
          <p className="text-[10px] text-gray-500">TOCEPS — TOTAG Catering & Events Planning Services | HACCP & ISO 22000 Compliant</p>
          <p className="text-[10px] text-gray-400 mt-0.5">A subsidiary of TOTAG Group of Companies Ltd | Monrovia, Liberia</p>
        </div>
        {/* Bottom decorative bar — inverted from top */}
        <div className="flex h-3">
          <div className="bg-orange-500 w-24"></div>
          <div className="bg-green-900 flex-1"></div>
        </div>
      </div>
    </div>
  );
}

// ===== QUOTATIONS LIST =====
function QuotationsList({ quotations, onPreview, onUpdateQuotation }: any) {
  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-yellow-100 text-yellow-800",
  };

  if (quotations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No quotations yet</p>
          <p className="text-sm mt-1">Go to the Quotation Builder to create your first quotation from a client request.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-green-700" /> All Quotations</h3>
        <p className="text-sm text-gray-500">{quotations.length} total</p>
      </div>
      {quotations.map((q: any) => {
        const items = Array.isArray(q.lineItems) ? q.lineItems : [];
        return (
          <Card key={q.id} className="hover:shadow-md transition-shadow">
            <CardContent className="py-4 px-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-3 w-3 text-gray-400" />
                    <span className="font-mono text-sm font-medium">{q.quotationNumber}</span>
                    <Badge className={statusColors[q.status] || "bg-gray-100"}>{q.status}</Badge>
                  </div>
                  <p className="text-sm font-medium">{q.clientName} {q.clientCompany ? `(${q.clientCompany})` : ''}</p>
                  <p className="text-xs text-gray-500">{q.eventType} | {q.guestCount} guests | {q.eventDate || 'TBD'}</p>
                  <p className="text-xs text-gray-400 mt-1">{items.length} items | Created: {new Date(q.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-700">{q.currency} {parseFloat(q.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-gray-400">Valid until: {q.validUntil}</p>
                  <div className="flex gap-1 mt-2 justify-end">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onPreview(q)}>
                      <Eye className="h-3 w-3 mr-1" /> View
                    </Button>
                    <Select onValueChange={v => onUpdateQuotation(q.id, { status: v })}>
                      <SelectTrigger className="h-7 w-24 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ===== OPERATIONS SUPERVISOR VIEW =====
function OperationsSupervisorView({ events, allTasks, staff, requests, quotations, loading, onCreateTask, onUpdateTask, onUpdateEvent, onCreateEvent, onUpdateRequest, onDeleteRequest, onCreateQuotation, onUpdateQuotation, onSaveAndSendQuotation, onSendQuotation, isSending }: any) {
  const token = localStorage.getItem("catering_token") || "";
  const [newTask, setNewTask] = useState({ eventId: "", role: "", title: "", description: "", priority: "normal", dueDate: "" });
  const [activeTab, setActiveTab] = useState("quick-actions");
  const [opsStatus, setOpsStatus] = useState({ kitchen: "not_started", venue: "not_started", transport: "not_started", staff: "not_started" });
  const [readinessScores, setReadinessScores] = useState({ kitchen: "not_started", venue: "not_started", equipment: "not_started", transport: "not_started", staff: "not_started" });
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastPriority, setBroadcastPriority] = useState("info");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [quotationRequest, setQuotationRequest] = useState<any>(null);
  const [resourcePlanRequest, setResourcePlanRequest] = useState<any>(null);
  const [viewQuotation, setViewQuotation] = useState<any>(null);
  const [editRequest, setEditRequest] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

  const planningEvents = events.filter((e: any) => e.status === "planning");
  const readyEvents = events.filter((e: any) => e.status === "ready");
  const liveEvents = events.filter((e: any) => e.status === "live");
  const openTasks = allTasks.filter((t: any) => t.status !== "done");
  const pendingRequests = (requests || []).filter((r: any) => ["new", "reviewing"].includes(r.status));
  const allRequests = requests || [];
  const allQuotations = quotations || [];

  return (
    <>
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 flex-wrap h-auto gap-1">
        <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        <TabsTrigger value="service-requests" className="relative">
          Service Requests
          {pendingRequests.length > 0 && (
            <span className="ml-1 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{pendingRequests.length}</span>
          )}
        </TabsTrigger>
        <TabsTrigger value="quotation-builder">Quotation Builder</TabsTrigger>
        <TabsTrigger value="resource-plan">Resource Plan</TabsTrigger>
        <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
        <TabsTrigger value="coordination">On-Site Coordination</TabsTrigger>
        <TabsTrigger value="tasks">All Tasks ({allTasks.length})</TabsTrigger>
        <TabsTrigger value="assign">Assign Tasks</TabsTrigger>
        <TabsTrigger value="readiness">Venue Readiness</TabsTrigger>
      </TabsList>

      <TabsContent value="quick-actions">
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-1">Operations Command Center</h3>
          <p className="text-sm text-gray-500">Venue readiness, logistics, equipment, and on-site coordination</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <QuickActionCard icon={Bell} title={`Service Requests (${pendingRequests.length} pending)`} description="Review customer requests and prepare quotations" color="#f59e0b" onClick={() => setActiveTab("service-requests")} />
          <QuickActionCard icon={Receipt} title="Build Quotation" description="Create itemized quotation from a customer request" color="#8b5cf6" onClick={() => setActiveTab("quotation-builder")} />
          <QuickActionCard icon={Calendar} title={`Planning Events (${planningEvents.length})`} description="Events in planning phase needing coordination" color="#3b82f6" onClick={() => setActiveTab("events")} />
          <QuickActionCard icon={CheckCircle} title={`Ready Events (${readyEvents.length})`} description="Events ready for execution" color="#22c55e" onClick={() => setActiveTab("readiness")} />
          <QuickActionCard icon={AlertTriangle} title={`Live Events (${liveEvents.length})`} description="Currently active events to monitor" color="#ef4444" onClick={() => setActiveTab("coordination")} />
          <QuickActionCard icon={ClipboardList} title={`Open Tasks (${openTasks.length})`} description="Tasks pending completion across all roles" color="#f59e0b" onClick={() => setActiveTab("tasks")} />
          <QuickActionCard icon={Plus} title="Assign New Task" description="Create and delegate tasks to team members" color="#8b5cf6" onClick={() => setActiveTab("assign")} />
          <QuickActionCard icon={Settings} title="Venue Readiness Check" description="Pre-event venue and equipment checklist" color="#06b6d4" onClick={() => setActiveTab("readiness")} />
          <QuickActionCard icon={FileSpreadsheet} title="Build Resource Plan" description="Create and send operational resource plan to customer" color="#059669" onClick={() => setActiveTab("resource-plan")} />
        </div>

        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Daily Operations Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {([
                { key: "kitchen" as const, label: "Kitchen Status", icon: ChefHat },
                { key: "venue" as const, label: "Venue Status", icon: MapPin },
                { key: "transport" as const, label: "Transport Status", icon: Truck },
                { key: "staff" as const, label: "Staff Status", icon: Users },
              ] as const).map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      opsStatus[item.key] === "on_track" ? "bg-green-100 text-green-800" :
                      opsStatus[item.key] === "delayed" ? "bg-red-100 text-red-800" :
                      opsStatus[item.key] === "complete" ? "bg-emerald-100 text-emerald-800" :
                      "bg-gray-100 text-gray-800"
                    }>
                      {opsStatus[item.key] === "not_started" ? "Not Started" :
                       opsStatus[item.key] === "on_track" ? "On Track" :
                       opsStatus[item.key] === "delayed" ? "Delayed" : "Complete"}
                    </Badge>
                    <Select value={opsStatus[item.key]} onValueChange={(v) => setOpsStatus({ ...opsStatus, [item.key]: v })}>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="on_track">On Track</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Task Overview by Role</CardTitle></CardHeader>
          <CardContent>
            {Object.entries(ROLE_LABELS).map(([role, label]) => {
              const roleTasks = allTasks.filter((t: any) => t.role === role);
              const done = roleTasks.filter((t: any) => t.status === "done").length;
              const inProgress = roleTasks.filter((t: any) => t.status === "in_progress").length;
              return (
                <div key={role} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{label}</span>
                  <div className="flex gap-2">
                    {inProgress > 0 && <Badge className="bg-orange-100 text-orange-800">{inProgress} active</Badge>}
                    <Badge className="bg-emerald-100 text-emerald-800">{done}/{roleTasks.length} done</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="service-requests">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Customer Service Requests</h3>
            <p className="text-sm text-gray-500">Review incoming requests, update status, and create quotations for customers</p>
          </div>
          <Badge className="bg-orange-100 text-orange-800">{pendingRequests.length} Pending</Badge>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading requests...</p>
        ) : allRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No service requests yet</p>
              <p className="text-sm text-gray-400 mt-1">Customer requests submitted via the website will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {allRequests.map((req: any) => (
              <Card key={req.id} className={`border-l-4 ${req.status === "new" ? "border-l-orange-500" : req.status === "reviewing" ? "border-l-blue-500" : req.status === "quoted" ? "border-l-purple-500" : req.status === "confirmed" ? "border-l-green-500" : "border-l-gray-300"}`}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{req.name}</h4>
                      {req.company && <p className="text-xs text-gray-400 font-medium">{req.company}</p>}
                      <p className="text-sm text-gray-500">{req.email} {req.phone && `| ${req.phone}`}</p>
                      <p className="text-sm font-medium mt-1 capitalize">{req.eventType?.replace(/_/g, " ")} — {req.guestCount ? `${req.guestCount} guests` : "Guest count TBD"}</p>
                      <p className="text-sm text-gray-500">{req.eventDate || "Date TBD"} {req.venue && `| ${req.venue}`}</p>
                      {req.budget && <p className="text-xs text-green-700 font-medium mt-1">Budget: {req.budget}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={req.status === "new" ? "bg-orange-100 text-orange-800" : req.status === "reviewing" ? "bg-blue-100 text-blue-800" : req.status === "quoted" ? "bg-purple-100 text-purple-800" : req.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                      </Badge>
                      <Badge className={req.priority === "urgent" ? "bg-red-100 text-red-800" : req.priority === "high" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-600"}>
                        {req.priority || "normal"} priority
                      </Badge>
                      <span className="text-xs text-gray-400">#{req.id} · {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "—"}</span>
                    </div>
                  </div>
                  {req.dietaryRequirements && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3">
                      <p className="text-xs text-amber-800"><span className="font-semibold">Dietary / Special Requirements:</span> {req.dietaryRequirements}</p>
                    </div>
                  )}
                  {req.details && (
                    <div className="bg-gray-50 rounded p-2 mb-3">
                      <p className="text-xs text-gray-600"><span className="font-semibold">Details:</span> {req.details}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select value={req.status} onValueChange={(val) => onUpdateRequest(req.id, { status: val })}>
                      <SelectTrigger className="w-40 h-8 text-xs">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white h-8 text-xs"
                      onClick={() => { setResourcePlanRequest(req); setActiveTab("resource-plan"); }}>
                      <FileSpreadsheet className="h-3 w-3 mr-1" /> Resource Plan
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs"
                      onClick={() => { setQuotationRequest(req); setActiveTab("quotation-builder"); }}>
                      <Receipt className="h-3 w-3 mr-1" /> Build Quotation
                    </Button>
                    {(() => {
                      const linkedQuotation = allQuotations.find((q: any) =>
                        String(q.requestId) === String(req.id) ||
                        String(q.request_id) === String(req.id)
                      );
                      const showBtn = linkedQuotation || req.status === "quoted";
                      return showBtn ? (
                        <Button size="sm" variant="outline"
                          className="border-purple-400 text-purple-700 hover:bg-purple-50 h-8 text-xs"
                          onClick={() => linkedQuotation && setViewQuotation(linkedQuotation)}>
                          <Eye className="h-3 w-3 mr-1" /> View Quotation
                        </Button>
                      ) : null;
                    })()}
                    <Button size="sm" variant="outline"
                      className="border-blue-400 text-blue-700 hover:bg-blue-50 h-8 text-xs"
                      onClick={() => { setEditRequest(req); setEditForm({ name: req.name, company: req.company || "", email: req.email || "", phone: req.phone || "", eventType: req.eventType || "", guestCount: req.guestCount || "", eventDate: req.eventDate || "", venue: req.venue || "", budget: req.budget || "", dietaryRequirements: req.dietaryRequirements || "", details: req.details || "", durationDays: req.durationDays || 1 }); }}>
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 text-xs ml-auto"
                      onClick={() => {
                        if (window.confirm(`Delete request from ${req.name}? This cannot be undone.`)) {
                          onDeleteRequest(req.id);
                        }
                      }}>
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="quotation-builder">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Quotation Builder</h3>
          <p className="text-sm text-gray-500">Create an itemized quotation based on the customer's selected services — then send directly to their email</p>
        </div>
        <QuotationBuilder
          request={quotationRequest}
          requests={allRequests}
          onSelectRequest={(req: any) => setQuotationRequest(req)}
          onSave={(data: any) => {
            onCreateQuotation(data);
          }}
          onSaveAndSend={(data: any) => {
            onSaveAndSendQuotation(data);
            setQuotationRequest(null);
          }}
          isSending={isSending}
        />
      </TabsContent>

      <TabsContent value="resource-plan">
        <ResourcePlanBuilder
          request={resourcePlanRequest}
          requests={allRequests}
          onSelectRequest={(req: any) => setResourcePlanRequest(req)}
          token={token}
        />
      </TabsContent>

      <TabsContent value="events">
        <div className="space-y-4">
          {loading ? <p className="text-gray-500">Loading...</p> : events.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-gray-500">No events created yet.</CardContent></Card>
          ) : events.map((event: any) => (
            <Card key={event.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-gray-500"><MapPin className="h-3 w-3 inline mr-1" />{event.venue} | <Calendar className="h-3 w-3 inline mr-1" />{event.eventDate} | <Users className="h-3 w-3 inline mr-1" />{event.guestCount} guests</p>
                  </div>
                  <Badge className={STATUS_COLORS[event.status]}>{event.status}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">Setup:</span><p className="mt-1">{event.setupPlan || 'Not set'}</p></div>
                  <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">Staff:</span><p className="mt-1">{event.staffRoster || 'Not set'}</p></div>
                  <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">Equipment:</span><p className="mt-1">{event.equipmentList || 'Not set'}</p></div>
                  <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">Transport:</span><p className="mt-1">{event.transportPlan || 'Not set'}</p></div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Select onValueChange={(val) => onUpdateEvent(event.id, { status: val })}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Update Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea className="flex-1 min-w-[200px]" defaultValue={event.opsNotes || ''} placeholder="Add operations notes..." rows={1}
                    onBlur={e => { if (e.target.value !== (event.opsNotes || '')) onUpdateEvent(event.id, { opsNotes: e.target.value }); }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="coordination">
        <Card className="mb-6 border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-orange-500" />
              Quick Communication Board
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Broadcast to All Roles</p>
            <Textarea
              placeholder="Type your message to all team roles..."
              rows={3}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label className="text-xs">Priority</Label>
                <Select value={broadcastPriority} onValueChange={setBroadcastPriority}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700 mt-4" onClick={() => { setBroadcastMessage(""); setBroadcastPriority("info"); }}>
                <Send className="h-4 w-4 mr-1" /> Send Broadcast
              </Button>
            </div>
            <p className="text-xs text-gray-400 italic">Messages will appear in all role dashboards</p>
          </CardContent>
        </Card>

        <h3 className="font-semibold text-lg mb-3">Live Event Coordination Board</h3>
        {liveEvents.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-gray-500">No events currently live. Mark an event as "Live" to coordinate.</CardContent></Card>
        ) : liveEvents.map((event: any) => {
          const eventTasks = allTasks.filter((t: any) => t.eventId === event.id);
          const done = eventTasks.filter((t: any) => t.status === "done").length;
          return (
            <Card key={event.id} className="mb-4 border-l-4 border-l-orange-500">
              <CardContent className="py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{event.title}</h4>
                    <p className="text-sm text-gray-500"><MapPin className="h-3 w-3 inline mr-1" />{event.venue} | {event.guestCount} guests</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 animate-pulse">LIVE</Badge>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1"><span>Task Progress</span><span>{done}/{eventTasks.length}</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full transition-all" style={{ width: `${eventTasks.length > 0 ? (done / eventTasks.length * 100) : 0}%` }} /></div>
                </div>
                <div className="space-y-1">
                  {eventTasks.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                      <div className="flex items-center gap-2">
                        {t.status === 'done' ? <CheckCircle className="h-3 w-3 text-green-600" /> : <CircleDot className="h-3 w-3 text-orange-500" />}
                        <span className={t.status === 'done' ? 'line-through text-gray-400' : ''}>{t.title}</span>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-[10px]">{ROLE_LABELS[t.role]?.split(' ')[0]}</Badge>
                        {t.status !== 'done' && (
                          <Button size="sm" variant="ghost" className="h-5 px-1 text-[10px]" onClick={() => onUpdateTask(t.id, { status: "done" })}>
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </TabsContent>

      <TabsContent value="tasks">
        <TaskList tasks={allTasks} onUpdateTask={onUpdateTask} showRole />
      </TabsContent>

      <TabsContent value="assign">
        <Card>
          <CardHeader><CardTitle className="text-base">Create & Assign Task</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Event</Label>
                <Select onValueChange={v => setNewTask({ ...newTask, eventId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                  <SelectContent>{events.map((e: any) => <SelectItem key={e.id} value={String(e.id)}>{e.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Assign to Role</Label>
                <Select onValueChange={v => setNewTask({ ...newTask, role: v })}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>{Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Input value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" />
            <Textarea value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} rows={2} placeholder="Description" />
            <div className="grid grid-cols-2 gap-3">
              <Select onValueChange={v => setNewTask({ ...newTask, priority: v })}>
                <SelectTrigger><SelectValue placeholder="Priority: Normal" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
            </div>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
              if (!newTask.eventId || !newTask.role || !newTask.title) return;
              onCreateTask({ ...newTask, eventId: parseInt(newTask.eventId) });
              setNewTask({ eventId: "", role: "", title: "", description: "", priority: "normal", dueDate: "" });
            }}><Plus className="h-4 w-4 mr-1" /> Create Task</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="readiness">
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-green-500" />
              Pre-Event Readiness Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {([
                { key: "kitchen" as const, label: "Kitchen", icon: ChefHat },
                { key: "venue" as const, label: "Venue", icon: MapPin },
                { key: "equipment" as const, label: "Equipment", icon: Wrench },
                { key: "transport" as const, label: "Transport", icon: Truck },
                { key: "staff" as const, label: "Staff", icon: Users },
              ] as const).map((item) => (
                <div key={item.key} className="text-center space-y-2">
                  <div className="flex flex-col items-center gap-1">
                    <item.icon className="h-5 w-5 text-gray-500" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  <Badge className={
                    readinessScores[item.key] === "ready" ? "bg-green-100 text-green-800" :
                    readinessScores[item.key] === "partial" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }>
                    {readinessScores[item.key] === "ready" ? "Ready" :
                     readinessScores[item.key] === "partial" ? "Partial" : "Not Started"}
                  </Badge>
                  <Select value={readinessScores[item.key]} onValueChange={(v) => setReadinessScores({ ...readinessScores, [item.key]: v })}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <h3 className="font-semibold text-lg mb-3">Venue Readiness Checklist</h3>
        {events.filter((e: any) => ["planning", "ready"].includes(e.status)).length === 0 ? (
          <Card><CardContent className="py-8 text-center text-gray-500">No events in planning/ready phase</CardContent></Card>
        ) : events.filter((e: any) => ["planning", "ready"].includes(e.status)).map((event: any) => (
          <Card key={event.id} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{event.title} - {event.venue}</CardTitle>
              <p className="text-sm text-gray-500">{event.eventDate} | {event.guestCount} guests</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Venue Setup", items: ["Tables & chairs arranged", "Stage/podium set up", "Decorations in place", "Lighting checked", "Power supply confirmed", "Registration area ready"] },
                  { title: "Equipment Check", items: ["PA/sound system tested", "Projector & screen ready", "Microphones working", "Extension cords available", "Backup generator ready"] },
                  { title: "Catering Setup", items: ["Serving stations positioned", "Buffet/table layout ready", "Chafing dishes available", "Beverage station set up", "Ice & coolers available"] },
                  { title: "Safety & Logistics", items: ["Fire exits clear", "First aid kit available", "Security briefed", "Parking arranged", "Signage in place", "Restrooms clean"] },
                ].map((section, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                    <div className="space-y-1">
                      {section.items.map((item, i) => (
                        <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300" />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <Label className="text-xs">Setup Notes</Label>
                  <Textarea defaultValue={event.setupPlan || ''} placeholder="Layout, setup sequence, timing..." rows={2}
                    onBlur={e => { if (e.target.value !== (event.setupPlan || '')) onUpdateEvent(event.id, { setupPlan: e.target.value }); }} />
                </div>
                <div>
                  <Label className="text-xs">Equipment List</Label>
                  <Textarea defaultValue={event.equipmentList || ''} placeholder="PA, projector, screens, chairs..." rows={2}
                    onBlur={e => { if (e.target.value !== (event.equipmentList || '')) onUpdateEvent(event.id, { equipmentList: e.target.value }); }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>

    {viewQuotation && (
      <Dialog open={!!viewQuotation} onOpenChange={() => setViewQuotation(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <QuotationPreview quotation={viewQuotation} onClose={() => setViewQuotation(null)} />
        </DialogContent>
      </Dialog>
    )}

    {editRequest && (
      <Dialog open={!!editRequest} onOpenChange={() => setEditRequest(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Request — {editRequest.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Client Name</Label>
                <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="h-8 text-sm mt-1" />
              </div>
              <div>
                <Label className="text-xs">Company</Label>
                <Input value={editForm.company} onChange={e => setEditForm({ ...editForm, company: e.target.value })} className="h-8 text-sm mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="h-8 text-sm mt-1" />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="h-8 text-sm mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Event Date</Label>
                <Input type="date" value={editForm.eventDate} onChange={e => setEditForm({ ...editForm, eventDate: e.target.value })} className="h-8 text-sm mt-1" />
              </div>
              <div>
                <Label className="text-xs">Guest Count</Label>
                <Input type="number" value={editForm.guestCount} onChange={e => setEditForm({ ...editForm, guestCount: e.target.value })} className="h-8 text-sm mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Venue</Label>
              <Input value={editForm.venue} onChange={e => setEditForm({ ...editForm, venue: e.target.value })} className="h-8 text-sm mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Budget / Urgency</Label>
                <Input value={editForm.budget} onChange={e => setEditForm({ ...editForm, budget: e.target.value })} className="h-8 text-sm mt-1" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-blue-700">Event Duration (Days)</Label>
                <Input type="number" min="1" step="1" value={editForm.durationDays}
                  onChange={e => setEditForm({ ...editForm, durationDays: parseInt(e.target.value) || 1 })}
                  className="h-8 text-sm mt-1 border-blue-300 focus:border-blue-500" />
                {editForm.durationDays > 1 && (
                  <p className="text-xs text-blue-600 mt-1">Multi-day event — pricing will be × {editForm.durationDays} days</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-xs">Dietary / Special Requirements</Label>
              <Textarea value={editForm.dietaryRequirements} onChange={e => setEditForm({ ...editForm, dietaryRequirements: e.target.value })} rows={2} className="text-sm mt-1" />
            </div>
            <div>
              <Label className="text-xs">Additional Details</Label>
              <Textarea value={editForm.details} onChange={e => setEditForm({ ...editForm, details: e.target.value })} rows={2} className="text-sm mt-1" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditRequest(null)}>Cancel</Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  onUpdateRequest(editRequest.id, editForm);
                  setEditRequest(null);
                }}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}
    </>
  );
}

// ===== HEAD CHEF VIEW =====
function HeadChefView({ events, myTasks, allTasks, loading, onCreateTask, onUpdateTask, onUpdateEvent }: any) {
  const [activeTab, setActiveTab] = useState("quick-actions");
  const activePrepEvents = events.filter((e: any) => ["planning", "ready"].includes(e.status));
  const openTasks = myTasks.filter((t: any) => t.status !== "done");

  const [standaloneMenu, setStandaloneMenu] = useState({ name: "", type: "", cuisine: "", starters: "", mains: "", sides: "", desserts: "", beverages: "", costPerHead: "", dietaryNotes: "", notes: "" });
  const [tempLogs, setTempLogs] = useState<Record<string, string>>({ fridge: "", freezer: "", hotHolding: "", cookingStation: "" });
  const [hygieneStatus, setHygieneStatus] = useState<Record<string, string>>({ personalHygiene: "Pending", kitchenSanitation: "Pending", foodSafety: "Pending", equipment: "Pending" });
  const [hygieneLog, setHygieneLog] = useState({ area: "", inspector: "", findings: "", actionRequired: "" });

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 flex-wrap h-auto gap-1">
        <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        <TabsTrigger value="tasks">My Tasks ({myTasks.length})</TabsTrigger>
        <TabsTrigger value="menu">Menu Planning</TabsTrigger>
        <TabsTrigger value="prep">Kitchen Prep</TabsTrigger>
        <TabsTrigger value="hygiene">Hygiene Controls</TabsTrigger>
        <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="quick-actions">
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-1">Kitchen Command</h3>
          <p className="text-sm text-gray-500">Menu execution, hygiene controls, food quality, and pre-service checks</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <QuickActionCard icon={Utensils} title={`Menu Planning (${activePrepEvents.length} events)`} description="Design menus for upcoming events" color="#ef4444" onClick={() => setActiveTab("menu")} />
          <QuickActionCard icon={ClipboardList} title={`My Tasks (${openTasks.length} open)`} description="View and complete assigned tasks" color="#f59e0b" onClick={() => setActiveTab("tasks")} />
          <QuickActionCard icon={Coffee} title="Kitchen Prep Tracker" description="Track prep stages for each event" color="#8b5cf6" onClick={() => setActiveTab("prep")} />
          <QuickActionCard icon={ShieldCheck} title="Hygiene Controls" description="Pre-service hygiene checklist" color="#22c55e" onClick={() => setActiveTab("hygiene")} />
          <QuickActionCard icon={Thermometer} title="Temperature Logs" description="Record food temperature readings" color="#3b82f6" onClick={() => setActiveTab("prep")} />
          <QuickActionCard icon={Users} title="Kitchen Staff Roster" description="Manage kitchen team assignments" color="#06b6d4" onClick={() => setActiveTab("menu")} />
        </div>
      </TabsContent>

      <TabsContent value="tasks">
        <TaskList tasks={myTasks} onUpdateTask={onUpdateTask} />
      </TabsContent>

      <TabsContent value="menu">
        <div className="space-y-4">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4 text-red-500" />Create Standalone Menu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Menu Name</Label>
                  <Input placeholder="e.g. Weekend Special" value={standaloneMenu.name} onChange={e => setStandaloneMenu({ ...standaloneMenu, name: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Menu Type</Label>
                  <Select value={standaloneMenu.type} onValueChange={v => setStandaloneMenu({ ...standaloneMenu, type: v })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="cocktail">Cocktail</SelectItem>
                      <SelectItem value="banquet">Banquet</SelectItem>
                      <SelectItem value="buffet">Buffet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Cuisine Type</Label>
                  <Select value={standaloneMenu.cuisine} onValueChange={v => setStandaloneMenu({ ...standaloneMenu, cuisine: v })}>
                    <SelectTrigger><SelectValue placeholder="Select cuisine" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liberian_traditional">Liberian Traditional</SelectItem>
                      <SelectItem value="continental">Continental</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Starters</Label>
                  <Textarea placeholder="List starter items..." rows={2} value={standaloneMenu.starters} onChange={e => setStandaloneMenu({ ...standaloneMenu, starters: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Main Courses</Label>
                  <Textarea placeholder="List main course items..." rows={2} value={standaloneMenu.mains} onChange={e => setStandaloneMenu({ ...standaloneMenu, mains: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Side Dishes</Label>
                  <Textarea placeholder="List side dishes..." rows={2} value={standaloneMenu.sides} onChange={e => setStandaloneMenu({ ...standaloneMenu, sides: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Desserts</Label>
                  <Textarea placeholder="List dessert items..." rows={2} value={standaloneMenu.desserts} onChange={e => setStandaloneMenu({ ...standaloneMenu, desserts: e.target.value })} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Beverages</Label>
                <Textarea placeholder="List beverages..." rows={2} value={standaloneMenu.beverages} onChange={e => setStandaloneMenu({ ...standaloneMenu, beverages: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Estimated Cost per Head (USD)</Label>
                  <Input type="number" placeholder="0.00" value={standaloneMenu.costPerHead} onChange={e => setStandaloneMenu({ ...standaloneMenu, costPerHead: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Dietary Notes</Label>
                  <Textarea placeholder="Vegetarian, halal, allergies..." rows={2} value={standaloneMenu.dietaryNotes} onChange={e => setStandaloneMenu({ ...standaloneMenu, dietaryNotes: e.target.value })} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Notes</Label>
                <Textarea placeholder="Additional notes..." rows={2} value={standaloneMenu.notes} onChange={e => setStandaloneMenu({ ...standaloneMenu, notes: e.target.value })} />
              </div>
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => { setStandaloneMenu({ name: "", type: "", cuisine: "", starters: "", mains: "", sides: "", desserts: "", beverages: "", costPerHead: "", dietaryNotes: "", notes: "" }); }}>
                <Sparkles className="h-4 w-4 mr-1" />Save Menu
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-purple-500" />Standard Menu Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="border border-green-200 bg-green-50/50">
                  <CardContent className="pt-4 pb-3 px-4">
                    <h5 className="font-medium text-sm text-green-800 mb-2 flex items-center gap-1"><Utensils className="h-3 w-3" />Liberian Traditional</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Jollof Rice</li>
                      <li>• Cassava Leaf</li>
                      <li>• Palava Sauce</li>
                      <li>• Potato Greens</li>
                      <li>• Palm Butter</li>
                      <li>• Fufu</li>
                      <li>• Ginger Beer</li>
                      <li>• Bissap</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border border-blue-200 bg-blue-50/50">
                  <CardContent className="pt-4 pb-3 px-4">
                    <h5 className="font-medium text-sm text-blue-800 mb-2 flex items-center gap-1"><Utensils className="h-3 w-3" />Continental Buffet</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Grilled Chicken</li>
                      <li>• Pasta</li>
                      <li>• Salads</li>
                      <li>• Roasted Vegetables</li>
                      <li>• Rice Pilaf</li>
                      <li>• Fresh Juices</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border border-amber-200 bg-amber-50/50">
                  <CardContent className="pt-4 pb-3 px-4">
                    <h5 className="font-medium text-sm text-amber-800 mb-2 flex items-center gap-1"><Star className="h-3 w-3" />Premium Banquet</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• 3-Course Plated Service</li>
                      <li>• Appetizer Selection</li>
                      <li>• Main Course Choice</li>
                      <li>• Dessert Finale</li>
                      <li>• Wine Pairing</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {activePrepEvents.length > 0 && <h3 className="font-semibold text-sm text-gray-500 mt-6">Event-Based Menu Planning</h3>}
          {activePrepEvents.map((event: any) => (
            <Card key={event.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><ChefHat className="h-4 w-4 text-green-600" />{event.title}</CardTitle>
                <p className="text-sm text-gray-500">{event.eventDate} | {event.guestCount} guests | {event.venue}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Menu Plan (Starters, Mains, Desserts, Beverages)</Label>
                  <Textarea defaultValue={event.menuPlan || ''} placeholder="Liberian: Jollof rice, cassava leaf, palava sauce, potato greens&#10;Continental: Grilled chicken, pasta, salads&#10;Beverages: Ginger beer, bissap juice, water" rows={5}
                    onBlur={e => { if (e.target.value !== event.menuPlan) onUpdateEvent(event.id, { menuPlan: e.target.value }); }} />
                </div>
                <div>
                  <Label className="text-xs">Dietary Accommodations</Label>
                  <Textarea defaultValue={event.dietaryNotes || ''} placeholder="Vegetarian options, non-pork alternatives, allergies..." rows={2}
                    onBlur={e => { if (e.target.value !== (event.dietaryNotes || '')) onUpdateEvent(event.id, { dietaryNotes: e.target.value }); }} />
                </div>
                <div>
                  <Label className="text-xs">Kitchen Staff Roster</Label>
                  <Textarea defaultValue={event.staffRoster || ''} placeholder="Head Chef, Sous Chef, Prep Cooks, Servers..." rows={2}
                    onBlur={e => { if (e.target.value !== event.staffRoster) onUpdateEvent(event.id, { staffRoster: e.target.value }); }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="prep">
        <div className="space-y-4">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><ListChecks className="h-4 w-4 text-purple-500" />Daily Kitchen Prep Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Morning Opening", color: "#f59e0b", items: ["Station sanitization", "Equipment check", "Ingredient mise en place", "Stock rotation check"] },
                  { title: "Active Prep", color: "#ef4444", items: ["Batch cooking schedule", "Temperature monitoring", "Cross-contamination prevention", "Portion control"] },
                  { title: "Service Ready", color: "#22c55e", items: ["Hot holding setup", "Garnish station", "Service utensils clean", "Staff briefed"] },
                  { title: "Closing", color: "#3b82f6", items: ["Equipment cleaned", "Leftover handling", "Waste log", "Next day prep list"] },
                ].map((section, idx) => (
                  <div key={idx} className="border rounded-lg p-3" style={{ borderLeftColor: section.color, borderLeftWidth: 3 }}>
                    <h5 className="font-medium text-sm mb-2" style={{ color: section.color }}>{section.title}</h5>
                    <div className="space-y-1">
                      {section.items.map((item, i) => (
                        <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 rounded p-1">
                          <input type="checkbox" className="rounded border-gray-300" />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Thermometer className="h-4 w-4 text-blue-500" />Temperature Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { key: "fridge", name: "Walk-in Fridge", target: "< 5°C", icon: "❄️" },
                  { key: "freezer", name: "Freezer", target: "< -18°C", icon: "🧊" },
                  { key: "hotHolding", name: "Hot Holding", target: "> 63°C", icon: "🔥" },
                  { key: "cookingStation", name: "Cooking Station", target: "Varies", icon: "🍳" },
                ].map((equip) => {
                  const val = parseFloat(tempLogs[equip.key] || "");
                  let status = "pending";
                  let statusColor = "bg-gray-100 text-gray-600";
                  if (!isNaN(val)) {
                    if (equip.key === "fridge") { status = val < 5 ? "OK" : "HIGH"; statusColor = val < 5 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"; }
                    else if (equip.key === "freezer") { status = val < -18 ? "OK" : "HIGH"; statusColor = val < -18 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"; }
                    else if (equip.key === "hotHolding") { status = val > 63 ? "OK" : "LOW"; statusColor = val > 63 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"; }
                    else { status = "Logged"; statusColor = "bg-blue-100 text-blue-700"; }
                  }
                  return (
                    <div key={equip.key} className="flex items-center gap-3 border rounded-lg p-3">
                      <span className="text-lg">{equip.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{equip.name}</p>
                        <p className="text-xs text-gray-500">Target: {equip.target}</p>
                      </div>
                      <Input type="number" placeholder="°C" className="w-24" value={tempLogs[equip.key]} onChange={e => setTempLogs({ ...tempLogs, [equip.key]: e.target.value })} />
                      <Badge className={statusColor}>{isNaN(val) ? "Pending" : status}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {activePrepEvents.length > 0 && <h3 className="font-semibold text-sm text-gray-500 mt-6">Event-Based Prep Tracker</h3>}
          {activePrepEvents.map((event: any) => (
            <Card key={event.id} className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{event.title} - {event.eventDate}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Procurement", items: ["Ingredient list finalized", "Suppliers contacted", "Orders placed", "Delivery confirmed", "Budget approved"] },
                    { title: "Pre-Prep (Day Before)", items: ["Proteins marinated", "Vegetables washed & cut", "Sauces prepared", "Rice/grains soaked", "Spice mixes ready"] },
                    { title: "Day-Of Cooking", items: ["Batch cooking on schedule", "Temperature checks done", "Seasoning tasted & approved", "Plating samples ready", "Hot holding set up"] },
                    { title: "Quality Check", items: ["Food appearance check", "Taste test completed", "Portion sizes verified", "Allergen labels placed", "Presentation finalized"] },
                  ].map((section, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                      <div className="space-y-1">
                        {section.items.map((item, i) => (
                          <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="hygiene">
        <div className="space-y-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-500" />Daily Hygiene Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: "personalHygiene", label: "Personal Hygiene" },
                  { key: "kitchenSanitation", label: "Kitchen Sanitation" },
                  { key: "foodSafety", label: "Food Safety" },
                  { key: "equipment", label: "Equipment" },
                ].map((item) => (
                  <div key={item.key} className="text-center space-y-2">
                    <p className="text-xs font-medium text-gray-700">{item.label}</p>
                    <Select value={hygieneStatus[item.key]} onValueChange={v => setHygieneStatus({ ...hygieneStatus, [item.key]: v })}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Checked">Checked</SelectItem>
                        <SelectItem value="Issue Found">Issue Found</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={hygieneStatus[item.key] === "Checked" ? "bg-green-100 text-green-700" : hygieneStatus[item.key] === "Issue Found" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}>
                      {hygieneStatus[item.key]}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><FileCheck className="h-4 w-4 text-orange-500" />Hygiene Log Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Area</Label>
                  <Select value={hygieneLog.area} onValueChange={v => setHygieneLog({ ...hygieneLog, area: v })}>
                    <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                      <SelectItem value="serving">Serving</SelectItem>
                      <SelectItem value="staff_area">Staff Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Inspector Name</Label>
                  <Input placeholder="Enter inspector name" value={hygieneLog.inspector} onChange={e => setHygieneLog({ ...hygieneLog, inspector: e.target.value })} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Findings</Label>
                <Textarea placeholder="Describe inspection findings..." rows={3} value={hygieneLog.findings} onChange={e => setHygieneLog({ ...hygieneLog, findings: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Action Required</Label>
                <Select value={hygieneLog.actionRequired} onValueChange={v => setHygieneLog({ ...hygieneLog, actionRequired: v })}>
                  <SelectTrigger><SelectValue placeholder="Select action level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setHygieneLog({ area: "", inspector: "", findings: "", actionRequired: "" })}>
                <CircleCheck className="h-4 w-4 mr-1" />Submit Log Entry
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Pre-Service Hygiene Controls</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Personal Hygiene", color: "#22c55e", items: ["All staff hands washed & sanitized", "Clean uniforms worn", "Hair nets/caps on", "No jewelry/watches worn", "Cuts/wounds covered with blue bandages", "Illness declaration completed"] },
                  { title: "Kitchen Sanitation", color: "#3b82f6", items: ["Surfaces cleaned and sanitized", "Cutting boards color-coded", "Utensils sanitized", "Floors swept and mopped", "Waste bins emptied", "Sanitizer solution at correct concentration"] },
                  { title: "Food Safety", color: "#ef4444", items: ["Fridge temperatures logged (below 5°C)", "Freezer temperatures logged (below -18°C)", "Raw/cooked separation maintained", "FIFO rotation checked", "Expiry dates verified", "Cross-contamination barriers in place"] },
                  { title: "Equipment Check", color: "#f59e0b", items: ["Thermometers calibrated", "Cooking equipment functioning", "Chafing dishes fueled", "Serving utensils clean", "Gas/electric connections safe", "Fire extinguisher accessible"] },
                ].map((section, idx) => (
                  <div key={idx} className="border rounded-lg p-3" style={{ borderLeftColor: section.color, borderLeftWidth: 3 }}>
                    <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                    <div className="space-y-1">
                      {section.items.map((item, i) => (
                        <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300" />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="events">
        <EventsList events={events} />
      </TabsContent>
    </Tabs>
  );
}

// ===== FOOD SAFETY VIEW =====
function FoodSafetyView({ events, incidents, myTasks, allTasks, loading, onCreateIncident, onUpdateIncident, onUpdateTask, onCreateTask }: any) {
  const [newIncident, setNewIncident] = useState({ eventId: "", type: "food_safety", severity: "low", description: "", actionTaken: "" });
  const [activeTab, setActiveTab] = useState("quick-actions");
  const [complianceStatus, setComplianceStatus] = useState<Record<string, string>>({ haccp: "not_checked", hygiene: "not_checked", temperature: "not_checked", staff: "not_checked" });
  const [spotCheckLog, setSpotCheckLog] = useState({ inspector: "", area: "", rating: "", findings: "", followUp: "No" });
  const [correctiveAction, setCorrectiveAction] = useState({ issue: "", rootCause: "", action: "", responsible: "", targetDate: "", status: "Open" });

  const openIncidents = incidents.filter((i: any) => !["resolved", "closed"].includes(i.status));
  const resolvedIncidents = incidents.filter((i: any) => ["resolved", "closed"].includes(i.status));

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 flex-wrap h-auto gap-1">
        <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        <TabsTrigger value="incidents">Incidents ({incidents.length})</TabsTrigger>
        <TabsTrigger value="checklist">HACCP Checklist</TabsTrigger>
        <TabsTrigger value="spot-checks">Spot Checks</TabsTrigger>
        <TabsTrigger value="corrective">Corrective Actions</TabsTrigger>
        <TabsTrigger value="tasks">My Tasks ({myTasks.length})</TabsTrigger>
        <TabsTrigger value="report">Report Incident</TabsTrigger>
      </TabsList>

      <TabsContent value="quick-actions">
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-1">Food Safety Command</h3>
          <p className="text-sm text-gray-500">HACCP compliance, log reviews, spot checks, corrective-action tracking</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <QuickActionCard icon={AlertTriangle} title={`Open Incidents (${openIncidents.length})`} description="Unresolved food safety incidents" color="#ef4444" onClick={() => setActiveTab("incidents")} />
          <QuickActionCard icon={ListChecks} title="HACCP Checklist" description="8-stage HACCP control verification" color="#22c55e" onClick={() => setActiveTab("checklist")} />
          <QuickActionCard icon={Eye} title="Conduct Spot Check" description="Random kitchen/serving area inspections" color="#3b82f6" onClick={() => setActiveTab("spot-checks")} />
          <QuickActionCard icon={Wrench} title="Corrective Actions" description="Track corrective measures and follow-ups" color="#f59e0b" onClick={() => setActiveTab("corrective")} />
          <QuickActionCard icon={Plus} title="Report New Incident" description="Log food safety or hygiene incident" color="#8b5cf6" onClick={() => setActiveTab("report")} />
          <QuickActionCard icon={ShieldCheck} title={`Resolved (${resolvedIncidents.length})`} description="Closed incidents and audit trail" color="#06b6d4" onClick={() => setActiveTab("incidents")} />
        </div>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-600" />Compliance Dashboard</CardTitle>
            <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: "haccp", label: "HACCP Controls" },
                { key: "hygiene", label: "Kitchen Hygiene" },
                { key: "temperature", label: "Temperature Monitoring" },
                { key: "staff", label: "Staff Compliance" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between border rounded-lg p-3">
                  <p className="text-sm font-medium">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <Select value={complianceStatus[item.key]} onValueChange={v => setComplianceStatus({ ...complianceStatus, [item.key]: v })}>
                      <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliant">Compliant</SelectItem>
                        <SelectItem value="needs_attention">Needs Attention</SelectItem>
                        <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                        <SelectItem value="not_checked">Not Checked</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={
                      complianceStatus[item.key] === "compliant" ? "bg-green-100 text-green-700" :
                      complianceStatus[item.key] === "needs_attention" ? "bg-yellow-100 text-yellow-700" :
                      complianceStatus[item.key] === "non_compliant" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }>
                      {complianceStatus[item.key] === "compliant" ? "Compliant" :
                       complianceStatus[item.key] === "needs_attention" ? "Needs Attention" :
                       complianceStatus[item.key] === "non_compliant" ? "Non-Compliant" :
                       "Not Checked"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="incidents">
        <div className="space-y-3">
          {incidents.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-gray-500">No incidents reported</CardContent></Card>
          ) : incidents.map((inc: any) => (
            <Card key={inc.id} className={`border-l-4 ${inc.severity === 'critical' ? 'border-l-red-500' : inc.severity === 'high' ? 'border-l-orange-500' : 'border-l-yellow-500'}`}>
              <CardContent className="py-3 px-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{inc.type.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-sm text-gray-600 mt-1">{inc.description}</p>
                    {inc.actionTaken && <p className="text-sm text-green-700 mt-1"><CheckCircle className="h-3 w-3 inline mr-1" />Action: {inc.actionTaken}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(inc.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={STATUS_COLORS[inc.severity]}>{inc.severity}</Badge>
                    <Badge className={STATUS_COLORS[inc.status]}>{inc.status}</Badge>
                  </div>
                </div>
                {inc.status !== "resolved" && inc.status !== "closed" && (
                  <div className="flex gap-2 mt-3">
                    <Select onValueChange={v => onUpdateIncident(inc.id, { status: v })}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Update" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Add corrective action note..." className="flex-1"
                      onKeyDown={e => { if (e.key === 'Enter') { onUpdateIncident(inc.id, { actionTaken: (e.target as HTMLInputElement).value }); (e.target as HTMLInputElement).value = ''; } }} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="checklist">
        <Card>
          <CardHeader><CardTitle className="text-base">HACCP 8-Stage Control Checklist</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { stage: "1. Receiving & Inspection", color: "#3b82f6", items: ["Supplier credentials verified", "Temperature checked on arrival (cold chain)", "Visual inspection for damage/spoilage", "Delivery log signed and dated", "Rejected items documented"] },
                { stage: "2. Storage", color: "#22c55e", items: ["Cold storage below 5°C verified", "Frozen storage below -18°C verified", "FIFO rotation applied", "Raw/cooked separated", "Dry goods sealed and labeled", "Storage area clean and organized"] },
                { stage: "3. Preparation", color: "#f59e0b", items: ["Hands washed and sanitized (20 sec)", "Clean uniforms and hair nets worn", "Color-coded boards: red=raw meat, green=vegetables, blue=fish", "No personal items in prep area", "Prep surfaces sanitized between tasks"] },
                { stage: "4. Cooking & Reheating (CCP)", color: "#ef4444", items: ["Internal temp verified: poultry 74°C, beef 63°C, fish 63°C", "Core temperature probe calibrated", "Batch check recorded with time stamp", "Reheating reached 74°C within 2 hours", "Cooking log completed and signed"] },
                { stage: "5. Holding & Transport", color: "#8b5cf6", items: ["Hot food maintained above 63°C", "Cold food maintained below 5°C", "Transport containers sealed and insulated", "Temperature log maintained during transit", "Maximum holding time: 4 hours (2-hour rule applied)"] },
                { stage: "6. Serving", color: "#06b6d4", items: ["Serving area sanitized before use", "Utensils clean and sanitized", "Food covered when not actively serving", "Time limits monitored (discard after 4hrs at room temp)", "Allergen information displayed"] },
                { stage: "7. Waste Disposal", color: "#64748b", items: ["Waste segregated: organic, recyclable, general", "Bins emptied before overflow", "No waste stored near food preparation areas", "Disposal records maintained", "Sharps disposed safely"] },
                { stage: "8. Cleaning & Sanitation", color: "#14b8a6", items: ["Clean-as-you-go protocol followed", "End-of-service deep clean completed", "Equipment disassembled and sanitized", "Cleaning chemicals stored separately from food", "Cleaning schedule signed off"] },
              ].map((section, idx) => (
                <div key={idx} className="border rounded-lg p-3" style={{ borderLeftColor: section.color, borderLeftWidth: 4 }}>
                  <h4 className="font-medium text-sm mb-2" style={{ color: section.color }}>{section.stage}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {section.items.map((item, i) => (
                      <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 rounded p-1">
                        <input type="checkbox" className="rounded border-gray-300" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="spot-checks">
        <Card className="border-l-4 border-l-blue-500 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4 text-blue-600" />Spot Check Log</CardTitle>
            <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Inspector Name</Label>
                <Input value={spotCheckLog.inspector} onChange={e => setSpotCheckLog({ ...spotCheckLog, inspector: e.target.value })} placeholder="Enter inspector name" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Area Inspected</Label>
                <Select value={spotCheckLog.area} onValueChange={v => setSpotCheckLog({ ...spotCheckLog, area: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select area" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kitchen">Kitchen</SelectItem>
                    <SelectItem value="Cold Storage">Cold Storage</SelectItem>
                    <SelectItem value="Dry Storage">Dry Storage</SelectItem>
                    <SelectItem value="Serving Area">Serving Area</SelectItem>
                    <SelectItem value="Dishwashing">Dishwashing</SelectItem>
                    <SelectItem value="Staff Changing Room">Staff Changing Room</SelectItem>
                    <SelectItem value="Loading Dock">Loading Dock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Overall Rating</Label>
              <Select value={spotCheckLog.rating} onValueChange={v => setSpotCheckLog({ ...spotCheckLog, rating: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select rating" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Conditional Pass">Conditional Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Findings Summary</Label>
              <Textarea value={spotCheckLog.findings} onChange={e => setSpotCheckLog({ ...spotCheckLog, findings: e.target.value })} rows={3} placeholder="Describe findings, observations, and any non-conformances..." className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Follow-up Required</Label>
              <div className="flex gap-2 mt-1">
                <Button variant={spotCheckLog.followUp === "Yes" ? "default" : "outline"} size="sm" className={spotCheckLog.followUp === "Yes" ? "bg-red-600 hover:bg-red-700" : ""} onClick={() => setSpotCheckLog({ ...spotCheckLog, followUp: "Yes" })}>Yes</Button>
                <Button variant={spotCheckLog.followUp === "No" ? "default" : "outline"} size="sm" className={spotCheckLog.followUp === "No" ? "bg-green-600 hover:bg-green-700" : ""} onClick={() => setSpotCheckLog({ ...spotCheckLog, followUp: "No" })}>No</Button>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              if (!spotCheckLog.inspector || !spotCheckLog.area || !spotCheckLog.rating) return;
              setSpotCheckLog({ inspector: "", area: "", rating: "", findings: "", followUp: "No" });
            }}>
              <FileCheck className="h-4 w-4 mr-1" /> Save Spot Check
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Spot Check Inspection</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { area: "Kitchen Area", items: ["Floors clean and dry", "Surfaces sanitized", "No food on floor", "Waste bins not overflowing", "Staff wearing proper PPE", "Hand wash stations stocked", "Temperature display visible"] },
                { area: "Storage Rooms", items: ["Temperature within range", "FIFO labels current", "No expired items", "Shelves clean", "Doors closing properly", "No pest evidence"] },
                { area: "Serving Area", items: ["Buffet covers in place", "Sneeze guards positioned", "Clean utensils available", "Allergen cards displayed", "Hand sanitizer available for guests"] },
                { area: "Staff Compliance", items: ["All staff in clean uniforms", "Hair properly covered", "No jewelry worn", "Handwashing observed", "Illness declaration current"] },
              ].map((section, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-2">{section.area}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {section.items.map((item, i) => (
                      <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 rounded p-1">
                        <input type="checkbox" className="rounded border-gray-300" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <Label className="text-xs">Spot Check Notes / Findings</Label>
                <Textarea placeholder="Record any observations, non-conformances, or commendations..." rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="corrective">
        <Card className="border-l-4 border-l-orange-500 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Wrench className="h-4 w-4 text-orange-600" />Corrective Action Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Issue Description</Label>
              <Textarea value={correctiveAction.issue} onChange={e => setCorrectiveAction({ ...correctiveAction, issue: e.target.value })} rows={2} placeholder="Describe the issue identified..." className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Root Cause</Label>
              <Textarea value={correctiveAction.rootCause} onChange={e => setCorrectiveAction({ ...correctiveAction, rootCause: e.target.value })} rows={2} placeholder="What is the root cause of this issue?" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Corrective Action</Label>
              <Textarea value={correctiveAction.action} onChange={e => setCorrectiveAction({ ...correctiveAction, action: e.target.value })} rows={2} placeholder="What corrective action will be taken?" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Responsible Person</Label>
                <Input value={correctiveAction.responsible} onChange={e => setCorrectiveAction({ ...correctiveAction, responsible: e.target.value })} placeholder="Name of responsible person" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Target Completion Date</Label>
                <Input type="date" value={correctiveAction.targetDate} onChange={e => setCorrectiveAction({ ...correctiveAction, targetDate: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={correctiveAction.status} onValueChange={v => setCorrectiveAction({ ...correctiveAction, status: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => {
              if (!correctiveAction.issue || !correctiveAction.action) return;
              setCorrectiveAction({ issue: "", rootCause: "", action: "", responsible: "", targetDate: "", status: "Open" });
            }}>
              <Wrench className="h-4 w-4 mr-1" /> Log Corrective Action
            </Button>
          </CardContent>
        </Card>

        <h3 className="font-semibold text-lg mb-3">Corrective Action Tracker</h3>
        {incidents.filter((i: any) => i.actionTaken).length === 0 && openIncidents.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-gray-500">No corrective actions recorded. Report incidents to begin tracking.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {openIncidents.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 text-orange-600">Requiring Action</h4>
                {openIncidents.map((inc: any) => (
                  <Card key={inc.id} className="mb-2 border-l-4 border-l-orange-500">
                    <CardContent className="py-3 px-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{inc.type.replace(/_/g, ' ')} - {inc.severity}</p>
                          <p className="text-xs text-gray-600">{inc.description}</p>
                        </div>
                        <Select onValueChange={v => onUpdateIncident(inc.id, { status: v })}>
                          <SelectTrigger className="w-32 h-7 text-xs"><SelectValue placeholder="Action" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="investigating">Investigating</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {resolvedIncidents.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 text-green-600">Resolved</h4>
                {resolvedIncidents.map((inc: any) => (
                  <Card key={inc.id} className="mb-2 border-l-4 border-l-green-500">
                    <CardContent className="py-3 px-4">
                      <p className="font-medium text-sm">{inc.type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-gray-600">{inc.description}</p>
                      {inc.actionTaken && <p className="text-xs text-green-700 mt-1">Action: {inc.actionTaken}</p>}
                      <p className="text-xs text-gray-400 mt-1">Resolved: {inc.resolvedAt ? new Date(inc.resolvedAt).toLocaleString() : 'N/A'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="tasks">
        <TaskList tasks={myTasks} onUpdateTask={onUpdateTask} />
      </TabsContent>

      <TabsContent value="report">
        <Card>
          <CardHeader><CardTitle className="text-base">Report New Incident</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Event (optional)</Label>
                <Select onValueChange={v => setNewIncident({ ...newIncident, eventId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                  <SelectContent>{events.map((e: any) => <SelectItem key={e.id} value={String(e.id)}>{e.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select onValueChange={v => setNewIncident({ ...newIncident, type: v })}>
                  <SelectTrigger><SelectValue placeholder="food_safety" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food_safety">Food Safety</SelectItem>
                    <SelectItem value="hygiene">Hygiene</SelectItem>
                    <SelectItem value="temperature">Temperature Deviation</SelectItem>
                    <SelectItem value="contamination">Cross-Contamination</SelectItem>
                    <SelectItem value="equipment">Equipment Failure</SelectItem>
                    <SelectItem value="pest">Pest Sighting</SelectItem>
                    <SelectItem value="staff">Staff Non-Compliance</SelectItem>
                    <SelectItem value="client_complaint">Client Complaint</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Severity</Label>
              <Select onValueChange={v => setNewIncident({ ...newIncident, severity: v })}>
                <SelectTrigger><SelectValue placeholder="Low" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minor issue, no immediate risk</SelectItem>
                  <SelectItem value="medium">Medium - Needs attention within shift</SelectItem>
                  <SelectItem value="high">High - Immediate corrective action needed</SelectItem>
                  <SelectItem value="critical">Critical - Stop operations, escalate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea value={newIncident.description} onChange={e => setNewIncident({ ...newIncident, description: e.target.value })} rows={3} placeholder="What happened? Where? When? Who was involved?" />
            </div>
            <div>
              <Label className="text-xs">Immediate Action Taken</Label>
              <Textarea value={newIncident.actionTaken} onChange={e => setNewIncident({ ...newIncident, actionTaken: e.target.value })} rows={2} placeholder="What corrective action was taken immediately?" />
            </div>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
              if (!newIncident.description) return;
              onCreateIncident({ ...newIncident, eventId: newIncident.eventId ? parseInt(newIncident.eventId) : null });
              setNewIncident({ eventId: "", type: "food_safety", severity: "low", description: "", actionTaken: "" });
            }}>
              <AlertTriangle className="h-4 w-4 mr-1" /> Submit Incident Report
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// ===== TEAM LEAD VIEW =====
function TeamLeadView({ events, myTasks, allTasks, staff, loading, onCreateTask, onUpdateTask }: any) {
  const [activeTab, setActiveTab] = useState("quick-actions");
  const activeEvents = events.filter((e: any) => ["ready", "live"].includes(e.status));
  const openTasks = myTasks.filter((t: any) => t.status !== "done");
  const [replenishmentStatus, setReplenishmentStatus] = useState<Record<string, string>>({
    mainCourse: "Full", saladBar: "Full", dessertTable: "Full",
    beverageStation: "Full", breadBasket: "Full", condiments: "Full",
  });
  const [guestRequest, setGuestRequest] = useState({ guestName: "", requestType: "", description: "", priority: "Normal" });
  const [satisfactionRatings, setSatisfactionRatings] = useState<Record<string, string>>({
    foodQuality: "", serviceSpeed: "", presentation: "", staffCourtesy: "", overall: "",
  });

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 flex-wrap h-auto gap-1">
        <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        <TabsTrigger value="tasks">My Tasks ({myTasks.length})</TabsTrigger>
        <TabsTrigger value="runsheet">Event Run Sheet</TabsTrigger>
        <TabsTrigger value="service">Service Checklist</TabsTrigger>
        <TabsTrigger value="guest">Guest Support</TabsTrigger>
        <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="quick-actions">
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-1">Front-of-House Command</h3>
          <p className="text-sm text-gray-500">Table service, replenishment, guest support, and professional presentation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <QuickActionCard icon={ClipboardList} title={`My Tasks (${openTasks.length} open)`} description="View and complete assigned tasks" color="#f59e0b" onClick={() => setActiveTab("tasks")} />
          <QuickActionCard icon={Calendar} title={`Active Events (${activeEvents.length})`} description="Events in execution phase" color="#ef4444" onClick={() => setActiveTab("runsheet")} />
          <QuickActionCard icon={Star} title="Service Standards Checklist" description="Table service and presentation checks" color="#22c55e" onClick={() => setActiveTab("service")} />
          <QuickActionCard icon={Users} title="Guest Support Log" description="Track guest requests and feedback" color="#3b82f6" onClick={() => setActiveTab("guest")} />
          <QuickActionCard icon={RefreshCw} title="Replenishment Tracker" description="Monitor buffet and beverage refills" color="#8b5cf6" onClick={() => setActiveTab("service")} />
          <QuickActionCard icon={Eye} title="Event Run Sheet" description="Live task progress for active events" color="#06b6d4" onClick={() => setActiveTab("runsheet")} />
        </div>
      </TabsContent>

      <TabsContent value="tasks">
        <TaskList tasks={myTasks} onUpdateTask={onUpdateTask} />
      </TabsContent>

      <TabsContent value="runsheet">
        <h3 className="font-semibold text-lg mb-3">Event Run Sheet</h3>
        {activeEvents.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-gray-500">No events currently in execution phase</CardContent></Card>
        ) : activeEvents.map((event: any) => {
          const eventTasks = allTasks.filter((t: any) => t.eventId === event.id);
          const done = eventTasks.filter((t: any) => t.status === "done").length;
          return (
            <Card key={event.id} className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-600" />{event.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={STATUS_COLORS[event.status]}>{event.status}</Badge>
                  <span className="text-sm text-gray-500">{event.eventDate} | {event.guestCount} guests | {event.venue}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1"><span>Overall Progress</span><span>{done}/{eventTasks.length}</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-green-600 h-2.5 rounded-full transition-all" style={{ width: `${eventTasks.length > 0 ? (done / eventTasks.length * 100) : 0}%` }} /></div>
                </div>
                <div className="space-y-1">
                  {eventTasks.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                      <div className="flex items-center gap-2">
                        {t.status === 'done' ? <CheckCircle className="h-3 w-3 text-green-600" /> : <CircleDot className="h-3 w-3 text-orange-500" />}
                        <span className={t.status === 'done' ? 'line-through text-gray-400' : ''}>{t.title}</span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <Badge variant="outline" className="text-[10px]">{ROLE_LABELS[t.role]?.split(' ')[0]}</Badge>
                        <Badge className={STATUS_COLORS[t.status] + " text-[10px]"}>{t.status}</Badge>
                      </div>
                    </div>
                  ))}
                  {eventTasks.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No tasks assigned yet</p>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </TabsContent>

      <TabsContent value="service">
        <div className="space-y-4">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><RefreshCw className="h-4 w-4 text-purple-500" />Replenishment Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: "mainCourse", label: "Main Course Station" },
                  { key: "saladBar", label: "Salad Bar" },
                  { key: "dessertTable", label: "Dessert Table" },
                  { key: "beverageStation", label: "Beverage Station" },
                  { key: "breadBasket", label: "Bread Basket" },
                  { key: "condiments", label: "Condiments" },
                ].map((item) => (
                  <div key={item.key} className="border rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium">{item.label}</p>
                    <Select value={replenishmentStatus[item.key]} onValueChange={v => setReplenishmentStatus({ ...replenishmentStatus, [item.key]: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full">Full</SelectItem>
                        <SelectItem value="Half">Half</SelectItem>
                        <SelectItem value="Low - Refill Now">Low - Refill Now</SelectItem>
                        <SelectItem value="Empty - Urgent">Empty - Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={
                      replenishmentStatus[item.key] === "Full" ? "bg-green-100 text-green-700" :
                      replenishmentStatus[item.key] === "Half" ? "bg-yellow-100 text-yellow-700" :
                      replenishmentStatus[item.key] === "Low - Refill Now" ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }>{replenishmentStatus[item.key]}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Service Standards Checklist</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Table Service", color: "#ef4444", items: ["Tables set with clean linens", "Cutlery & glassware polished", "Water glasses pre-filled", "Place cards set (if applicable)", "Centerpieces positioned", "Chairs aligned and clean"] },
                  { title: "Buffet/Serving Station", color: "#f59e0b", items: ["Buffet layout arranged per plan", "Sneeze guards in position", "Serving utensils at each dish", "Labels/menu cards displayed", "Chafing dish flames lit", "Ice bed for cold items ready"] },
                  { title: "Replenishment Schedule", color: "#22c55e", items: ["Initial stock levels checked", "Refill threshold set (50% rule)", "Backup trays in warming area", "Beverage station fully stocked", "Dessert trays staged", "Clean plates/utensils restocked"] },
                  { title: "Professional Presentation", color: "#3b82f6", items: ["All staff in clean, pressed uniform", "Name badges worn", "Team briefing completed", "Service sequence reviewed", "Special dietary requests noted", "VIP guests identified"] },
                ].map((section, idx) => (
                  <div key={idx} className="border rounded-lg p-3" style={{ borderLeftColor: section.color, borderLeftWidth: 3 }}>
                    <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                    <div className="space-y-1">
                      {section.items.map((item, i) => (
                        <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 rounded p-1">
                          <input type="checkbox" className="rounded border-gray-300" />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="guest">
        <div className="space-y-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4 text-blue-500" />Log Guest Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Guest Name / Table</Label>
                  <Input placeholder="Guest name or table number" value={guestRequest.guestName} onChange={e => setGuestRequest({ ...guestRequest, guestName: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Request Type</Label>
                  <Select value={guestRequest.requestType} onValueChange={v => setGuestRequest({ ...guestRequest, requestType: v })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dietary Need">Dietary Need</SelectItem>
                      <SelectItem value="Seating Change">Seating Change</SelectItem>
                      <SelectItem value="Temperature">Temperature</SelectItem>
                      <SelectItem value="Special Beverage">Special Beverage</SelectItem>
                      <SelectItem value="Complaint">Complaint</SelectItem>
                      <SelectItem value="Compliment">Compliment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea placeholder="Describe the guest request..." rows={3} value={guestRequest.description} onChange={e => setGuestRequest({ ...guestRequest, description: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <Select value={guestRequest.priority} onValueChange={v => setGuestRequest({ ...guestRequest, priority: v })}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setGuestRequest({ guestName: "", requestType: "", description: "", priority: "Normal" })}>
                <Send className="h-4 w-4 mr-1" />Log Request
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-green-500" />Guest Satisfaction Quick Poll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: "foodQuality", label: "Food Quality" },
                  { key: "serviceSpeed", label: "Service Speed" },
                  { key: "presentation", label: "Presentation" },
                  { key: "staffCourtesy", label: "Staff Courtesy" },
                  { key: "overall", label: "Overall" },
                ].map((item) => (
                  <div key={item.key} className="border rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium">{item.label}</p>
                    <Select value={satisfactionRatings[item.key]} onValueChange={v => setSatisfactionRatings({ ...satisfactionRatings, [item.key]: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Rate..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Guest Support & Feedback Log</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Common Guest Requests", items: ["Dietary accommodation needed", "Extra seating required", "Temperature adjustment (AC/fans)", "Audio/visual assistance", "Special beverage request", "Accessibility support needed"] },
                { title: "Service Issues to Monitor", items: ["Long wait times at buffet", "Food temperature complaint", "Spills or breakage", "Seating arrangement issues", "Noise level concerns", "Restroom supplies needed"] },
              ].map((section, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                  <div className="space-y-1">
                    {section.items.map((item, i) => (
                      <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 rounded p-1">
                        <input type="checkbox" className="rounded border-gray-300" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Label className="text-xs">Guest Feedback / Notes</Label>
              <Textarea placeholder="Record guest feedback, complaints, or compliments for post-event review..." rows={3} />
            </div>
          </CardContent>
        </Card>
        </div>
      </TabsContent>

      <TabsContent value="events">
        <EventsList events={events} />
      </TabsContent>
    </Tabs>
  );
}

// ===== LOGISTICS VIEW =====
function LogisticsView({ events, myTasks, allTasks, loading, onCreateTask, onUpdateTask, onUpdateEvent }: any) {
  const [activeTab, setActiveTab] = useState("quick-actions");
  const activePlanEvents = events.filter((e: any) => ["planning", "ready"].includes(e.status));
  const openTasks = myTasks.filter((t: any) => t.status !== "done");
  const [equipmentAvailability, setEquipmentAvailability] = useState<Record<string, { quantity: string; condition: string }>>({
    cookingEquipment: { quantity: "", condition: "Good" },
    servingEquipment: { quantity: "", condition: "Good" },
    tablesChairs: { quantity: "", condition: "Good" },
    avEquipment: { quantity: "", condition: "Good" },
    generators: { quantity: "", condition: "Good" },
    coldStorage: { quantity: "", condition: "Good" },
  });
  const [fleetStatus, setFleetStatus] = useState<Record<string, { status: string; driver: string; nextAvailable: string }>>({
    van1: { status: "Available", driver: "", nextAvailable: "" },
    van2: { status: "Available", driver: "", nextAvailable: "" },
    pickupTruck: { status: "Available", driver: "", nextAvailable: "" },
    refrigeratedVan: { status: "Available", driver: "", nextAvailable: "" },
  });
  const [routePlan, setRoutePlan] = useState({ from: "", to: "", departure: "", duration: "", instructions: "" });
  const [setupInventory, setSetupInventory] = useState<Record<string, string>>({
    roundTables: "", rectangularTables: "", paddedChairs: "", plasticChairs: "",
    whiteTablecloths: "", coloredOverlays: "", chairCovers: "", centerpieceSets: "",
  });

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 flex-wrap h-auto gap-1">
        <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        <TabsTrigger value="tasks">My Tasks ({myTasks.length})</TabsTrigger>
        <TabsTrigger value="delivery">Delivery Runs</TabsTrigger>
        <TabsTrigger value="equipment">Equipment Inventory</TabsTrigger>
        <TabsTrigger value="transport">Transport Schedule</TabsTrigger>
        <TabsTrigger value="setup">Venue Setup</TabsTrigger>
        <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="quick-actions">
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-1">Logistics Hub</h3>
          <p className="text-sm text-gray-500">Delivery runs, venue setup, equipment, and participant transport</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <QuickActionCard icon={Truck} title={`Delivery Runs (${activePlanEvents.length} events)`} description="Plan and track delivery schedules" color="#ef4444" onClick={() => setActiveTab("delivery")} />
          <QuickActionCard icon={ClipboardList} title={`My Tasks (${openTasks.length} open)`} description="View and complete assigned tasks" color="#f59e0b" onClick={() => setActiveTab("tasks")} />
          <QuickActionCard icon={Package} title="Equipment Inventory" description="Track equipment availability and condition" color="#22c55e" onClick={() => setActiveTab("equipment")} />
          <QuickActionCard icon={MapPin} title="Transport Schedule" description="Vehicle assignments and route plans" color="#3b82f6" onClick={() => setActiveTab("transport")} />
          <QuickActionCard icon={Settings} title="Venue Setup Checklist" description="Pre-event setup verification" color="#8b5cf6" onClick={() => setActiveTab("setup")} />
          <QuickActionCard icon={Calendar} title="All Events" description="View all upcoming events" color="#06b6d4" onClick={() => setActiveTab("events")} />
        </div>
      </TabsContent>

      <TabsContent value="tasks">
        <TaskList tasks={myTasks} onUpdateTask={onUpdateTask} />
      </TabsContent>

      <TabsContent value="delivery">
        <h3 className="font-semibold text-lg mb-3">Delivery Run Planner</h3>
        {activePlanEvents.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-gray-500">No events requiring delivery coordination</CardContent></Card>
        ) : activePlanEvents.map((event: any) => (
          <Card key={event.id} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Truck className="h-4 w-4 text-blue-600" />{event.title}</CardTitle>
              <p className="text-sm text-gray-500">{event.venue} | {event.eventDate} | {event.guestCount} guests</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  { title: "Pre-Event Delivery", items: ["Equipment loaded on vehicle", "Food containers sealed & labeled", "Cold chain maintained (ice packs/cooler)", "Delivery route confirmed", "Arrival time communicated to venue", "Unloading plan ready"] },
                  { title: "Post-Event Pickup", items: ["Equipment inventory before loading", "Leftover food handled per policy", "Waste disposed properly at venue", "Vehicle inspection completed", "Return route planned", "All items accounted for"] },
                ].map((section, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                    <div className="space-y-1">
                      {section.items.map((item, i) => (
                        <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 rounded p-1">
                          <input type="checkbox" className="rounded border-gray-300" />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <Label className="text-xs">Delivery Notes</Label>
                <Textarea defaultValue={event.transportPlan || ''} placeholder="Vehicle assignments, pickup times, routes, special instructions..." rows={3}
                  onBlur={e => { if (e.target.value !== (event.transportPlan || '')) onUpdateEvent(event.id, { transportPlan: e.target.value }); }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="equipment">
        <div className="space-y-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-green-500" />Equipment Availability Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: "cookingEquipment", label: "Cooking Equipment" },
                { key: "servingEquipment", label: "Serving Equipment" },
                { key: "tablesChairs", label: "Tables & Chairs" },
                { key: "avEquipment", label: "AV Equipment" },
                { key: "generators", label: "Generators" },
                { key: "coldStorage", label: "Cold Storage" },
              ].map((item) => (
                <div key={item.key} className="border rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium">{item.label}</p>
                  <div>
                    <Label className="text-xs">Qty Available</Label>
                    <Input type="number" placeholder="0" className="h-8" value={equipmentAvailability[item.key].quantity} onChange={e => setEquipmentAvailability({ ...equipmentAvailability, [item.key]: { ...equipmentAvailability[item.key], quantity: e.target.value } })} />
                  </div>
                  <div>
                    <Label className="text-xs">Condition</Label>
                    <Select value={equipmentAvailability[item.key].condition} onValueChange={v => setEquipmentAvailability({ ...equipmentAvailability, [item.key]: { ...equipmentAvailability[item.key], condition: v } })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                        <SelectItem value="Out of Service">Out of Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Badge className={
                    equipmentAvailability[item.key].condition === "Good" ? "bg-green-100 text-green-700" :
                    equipmentAvailability[item.key].condition === "Needs Repair" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }>{equipmentAvailability[item.key].condition}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Equipment Inventory Tracker</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { title: "Cooking Equipment", items: ["Gas burners (industrial)", "Chafing dishes & stands", "Large cooking pots", "Frying pans (assorted)", "Baking trays & oven racks", "Food warmers"] },
                { title: "Serving Equipment", items: ["Serving trays (round/rectangular)", "Buffet serving spoons & tongs", "Water dispensers / coolers", "Glass/cup sets", "Plate sets (dinner/dessert)", "Cutlery sets"] },
                { title: "Furniture & Setup", items: ["Round tables (10-seater)", "Rectangular tables", "Chairs (padded/plastic)", "Table cloths & overlays", "Chair covers & sashes", "Stage/podium"] },
                { title: "AV & Electrical", items: ["PA system & speakers", "Microphones (wireless/wired)", "Projector & screen", "Extension cords & power strips", "Backup generator", "Lighting equipment"] },
              ].map((section, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                  <div className="space-y-1">
                    {section.items.map((item, i) => (
                      <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 rounded p-1">
                        <input type="checkbox" className="rounded border-gray-300" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {activePlanEvents.map((event: any) => (
              <div key={event.id} className="mt-4">
                <Label className="text-xs">{event.title} - Equipment List</Label>
                <Textarea defaultValue={event.equipmentList || ''} placeholder="List all equipment needed for this event..." rows={3}
                  onBlur={e => { if (e.target.value !== (event.equipmentList || '')) onUpdateEvent(event.id, { equipmentList: e.target.value }); }} />
              </div>
            ))}
          </CardContent>
        </Card>
        </div>
      </TabsContent>

      <TabsContent value="transport">
        <div className="space-y-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Truck className="h-4 w-4 text-blue-500" />Vehicle Fleet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: "van1", label: "Delivery Van 1" },
                { key: "van2", label: "Delivery Van 2" },
                { key: "pickupTruck", label: "Pickup Truck" },
                { key: "refrigeratedVan", label: "Refrigerated Van" },
              ].map((vehicle) => (
                <div key={vehicle.key} className="flex flex-wrap items-center gap-3 border rounded-lg p-3">
                  <p className="text-sm font-medium w-36">{vehicle.label}</p>
                  <Select value={fleetStatus[vehicle.key].status} onValueChange={v => setFleetStatus({ ...fleetStatus, [vehicle.key]: { ...fleetStatus[vehicle.key], status: v } })}>
                    <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="In Use">In Use</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Booked">Booked</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Driver" className="w-36 h-8 text-xs" value={fleetStatus[vehicle.key].driver} onChange={e => setFleetStatus({ ...fleetStatus, [vehicle.key]: { ...fleetStatus[vehicle.key], driver: e.target.value } })} />
                  <Input type="date" className="w-40 h-8 text-xs" value={fleetStatus[vehicle.key].nextAvailable} onChange={e => setFleetStatus({ ...fleetStatus, [vehicle.key]: { ...fleetStatus[vehicle.key], nextAvailable: e.target.value } })} />
                  <Badge className={
                    fleetStatus[vehicle.key].status === "Available" ? "bg-green-100 text-green-700" :
                    fleetStatus[vehicle.key].status === "In Use" ? "bg-blue-100 text-blue-700" :
                    fleetStatus[vehicle.key].status === "Maintenance" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }>{fleetStatus[vehicle.key].status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4 text-orange-500" />Route Planning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">From Location</Label>
                <Input placeholder="Departure location" value={routePlan.from} onChange={e => setRoutePlan({ ...routePlan, from: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">To Location</Label>
                <Input placeholder="Destination" value={routePlan.to} onChange={e => setRoutePlan({ ...routePlan, to: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Departure Time</Label>
                <Input type="time" value={routePlan.departure} onChange={e => setRoutePlan({ ...routePlan, departure: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Estimated Duration</Label>
                <Input placeholder="e.g., 45 minutes" value={routePlan.duration} onChange={e => setRoutePlan({ ...routePlan, duration: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Special Instructions</Label>
              <Textarea placeholder="Road conditions, checkpoint details, loading/unloading notes..." rows={3} value={routePlan.instructions} onChange={e => setRoutePlan({ ...routePlan, instructions: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <h3 className="font-semibold text-lg mb-3">Transport Schedule</h3>
        {activePlanEvents.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-gray-500">No events requiring transport planning</CardContent></Card>
        ) : activePlanEvents.map((event: any) => (
          <Card key={event.id} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{event.title}</CardTitle>
              <p className="text-sm text-gray-500"><MapPin className="h-3 w-3 inline mr-1" />{event.venue} | {event.eventDate}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Vehicle Assignment", items: ["Primary vehicle assigned", "Backup vehicle available", "Driver confirmed", "Fuel level checked", "Vehicle cleaned and inspected", "Loading capacity verified"] },
                  { title: "Participant Transport", items: ["Pickup points confirmed", "Schedule communicated to participants", "Special needs accommodated", "Route planned with alternatives", "Contact list shared with driver"] },
                ].map((section, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                    <div className="space-y-1">
                      {section.items.map((item, i) => (
                        <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 rounded p-1">
                          <input type="checkbox" className="rounded border-gray-300" />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <Label className="text-xs">Transport Plan Notes</Label>
                <Textarea defaultValue={event.transportPlan || ''} placeholder="Departure times, routes, pickup/drop-off points, driver contacts..." rows={3}
                  onBlur={e => { if (e.target.value !== (event.transportPlan || '')) onUpdateEvent(event.id, { transportPlan: e.target.value }); }} />
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </TabsContent>

      <TabsContent value="setup">
        <div className="space-y-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-purple-500" />General Setup Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: "roundTables", label: "Round Tables (10-seat)" },
                { key: "rectangularTables", label: "Rectangular Tables" },
                { key: "paddedChairs", label: "Padded Chairs" },
                { key: "plasticChairs", label: "Plastic Chairs" },
                { key: "whiteTablecloths", label: "White Tablecloths" },
                { key: "coloredOverlays", label: "Colored Overlays" },
                { key: "chairCovers", label: "Chair Covers" },
                { key: "centerpieceSets", label: "Centerpiece Sets" },
              ].map((item) => (
                <div key={item.key} className="border rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium">{item.label}</p>
                  <div>
                    <Label className="text-xs">Qty On-Hand</Label>
                    <Input type="number" placeholder="0" className="h-8" value={setupInventory[item.key]} onChange={e => setSetupInventory({ ...setupInventory, [item.key]: e.target.value })} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <h3 className="font-semibold text-lg mb-3">Venue Setup Checklist</h3>
        {activePlanEvents.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-gray-500">No events requiring setup coordination</CardContent></Card>
        ) : activePlanEvents.map((event: any) => (
          <Card key={event.id} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{event.title} - {event.venue}</CardTitle>
              <p className="text-sm text-gray-500">{event.eventDate} | {event.guestCount} guests</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  { title: "Pre-Setup (Day Before)", items: ["Venue access confirmed", "Floor plan reviewed", "Heavy equipment pre-positioned", "Power outlets tested", "Water access verified", "Waste disposal arranged"] },
                  { title: "Day-Of Setup", items: ["Tables positioned per layout", "Chairs set at each table", "Linens and covers placed", "Buffet station assembled", "Beverage station ready", "Registration/welcome area set"] },
                  { title: "Decoration & Ambiance", items: ["Centerpieces placed", "Balloons/banners hung", "Lighting adjusted", "Background music set up", "Program display/banner visible", "Photo backdrop ready"] },
                  { title: "Final Walkthrough", items: ["All areas clean and tidy", "Restrooms stocked", "Parking signs placed", "Emergency exits clear", "Staff positions assigned", "Client approval obtained"] },
                ].map((section, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                    <div className="space-y-1">
                      {section.items.map((item, i) => (
                        <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 rounded p-1">
                          <input type="checkbox" className="rounded border-gray-300" />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <Label className="text-xs">Setup Plan Notes</Label>
                <Textarea defaultValue={event.setupPlan || ''} placeholder="Layout details, setup sequence, timing, special requirements..." rows={3}
                  onBlur={e => { if (e.target.value !== (event.setupPlan || '')) onUpdateEvent(event.id, { setupPlan: e.target.value }); }} />
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </TabsContent>

      <TabsContent value="events">
        <EventsList events={events} />
      </TabsContent>
    </Tabs>
  );
}

// ===== SHARED COMPONENTS =====
function TaskList({ tasks, onUpdateTask, showRole = false }: { tasks: any[]; onUpdateTask: (id: number, updates: any) => void; showRole?: boolean }) {
  if (tasks.length === 0) {
    return <Card><CardContent className="py-8 text-center text-gray-500">No tasks assigned</CardContent></Card>;
  }
  return (
    <div className="space-y-2">
      {tasks.map((task: any) => (
        <Card key={task.id}>
          <CardContent className="py-3 px-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`font-medium text-sm ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
                <div className="flex gap-2 mt-1">
                  {task.dueDate && <span className="text-xs text-gray-400"><Clock className="h-3 w-3 inline mr-1" />{task.dueDate}</span>}
                  {showRole && <Badge variant="outline" className="text-xs">{ROLE_LABELS[task.role]?.split(' ').slice(0, 2).join(' ') || task.role}</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={STATUS_COLORS[task.priority]}>{task.priority}</Badge>
                <Badge className={STATUS_COLORS[task.status]}>{task.status}</Badge>
                {task.status !== "done" && (
                  <Select onValueChange={v => onUpdateTask(task.id, { status: v })}>
                    <SelectTrigger className="w-28 h-7 text-xs"><SelectValue placeholder="Update" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EventsList({ events }: { events: any[] }) {
  if (events.length === 0) {
    return <Card><CardContent className="py-8 text-center text-gray-500">No events yet</CardContent></Card>;
  }
  return (
    <div className="space-y-3">
      {events.map((event: any) => (
        <Card key={event.id}>
          <CardContent className="py-3 px-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-500">
                  <MapPin className="h-3 w-3 inline mr-1" />{event.venue} | 
                  <Calendar className="h-3 w-3 inline mx-1" />{event.eventDate} | 
                  <Users className="h-3 w-3 inline mx-1" />{event.guestCount} guests
                </p>
              </div>
              <Badge className={STATUS_COLORS[event.status]}>{event.status}</Badge>
            </div>
            {event.opsNotes && <p className="text-xs text-gray-500 mt-2">{event.opsNotes}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StaffDirectory({ staff, onRefresh }: { staff: any[]; onRefresh?: () => void }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [taskStaff, setTaskStaff] = useState<any | null>(null);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("operations_supervisor");
  const [submitting, setSubmitting] = useState(false);
  
  // Task assignment modal state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState("high");
  const [taskDueDate, setTaskDueDate] = useState("");
  const { toast } = useToast();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await cateringFetch("/api/catering/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, firstName, lastName, phone, role }),
      });
      if (res && res.success) {
        toast({ title: "User Account Created", description: `Created user ${username} with role ${ROLE_LABELS[role] || role}` });
        setCreateOpen(false);
        resetForm();
        if (onRefresh) onRefresh();
      } else {
        toast({ title: "Error Creating User", description: res?.error || "Failed to create user", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to connect to staff API", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setSubmitting(true);
    try {
      const payload: any = { role, email, firstName, lastName, phone };
      if (password) payload.password = password;
      
      const res = await cateringFetch(`/api/catering/staff/${editingStaff.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res && res.success) {
        toast({ title: "Staff Member Updated", description: `Updated role to ${ROLE_LABELS[role] || role}` });
        setEditingStaff(null);
        resetForm();
        if (onRefresh) onRefresh();
      } else {
        toast({ title: "Update Failed", description: res?.error || "Failed to update staff member", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update staff member", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskStaff) return;
    setSubmitting(true);
    try {
      const res = await cateringFetch("/api/catering/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDesc,
          priority: taskPriority,
          role: taskStaff.role,
          dueDate: taskDueDate || new Date().toISOString(),
          status: "pending",
        }),
      });
      if (res && res.success) {
        toast({ title: "Task Assigned", description: `Task assigned to ${taskStaff.firstName} (${ROLE_LABELS[taskStaff.role]})` });
        setTaskStaff(null);
        setTaskTitle("");
        setTaskDesc("");
        if (onRefresh) onRefresh();
      } else {
        toast({ title: "Task Assignment Failed", description: res?.error || "Could not assign task", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Connection error", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setRole("operations_supervisor");
  };

  const startEdit = (s: any) => {
    setEditingStaff(s);
    setFirstName(s.firstName || "");
    setLastName(s.lastName || "");
    setEmail(s.email || "");
    setPhone(s.phone || "");
    setRole(s.role || "operations_supervisor");
    setPassword("");
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Action Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-xl">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            TOCEPS User & Role Management Directory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create staff accounts, assign operational roles, dispatch tasks, and manage credentials
          </p>
        </div>
        <Button 
          onClick={() => { resetForm(); setCreateOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New User & Assign Role
        </Button>
      </div>

      {/* Staff Grid */}
      {staff.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-gray-500">No staff members found</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s: any) => {
            const RIcon = ROLE_ICONS[s.role] || Users;
            return (
              <Card key={s.id} className="border border-slate-200 dark:border-white/10 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden bg-white/90 dark:bg-slate-900/90">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <RIcon className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{s.firstName} {s.lastName}</h4>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{ROLE_LABELS[s.role] || s.role}</p>
                        <p className="text-[11px] text-slate-400 font-mono">@{s.username}</p>
                      </div>
                    </div>
                    <Badge className={s.isActive !== false ? "bg-emerald-500/20 text-emerald-500 text-[10px] font-bold" : "bg-red-500/20 text-red-500 text-[10px] font-bold"}>
                      {s.isActive !== false ? "Active" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {s.email}</p>
                    {s.phone && <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {s.phone}</p>}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => startEdit(s)}
                      className="w-1/2 text-xs font-bold rounded-xl border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                      Edit & Role
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setTaskStaff(s)}
                      className="w-1/2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950"
                    >
                      <ClipboardList className="w-3.5 h-3.5 mr-1" />
                      Assign Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* CREATE USER DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md bg-slate-900 text-white border border-white/10 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-emerald-400 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Create User & Assign Operational Role
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Add a new staff member to TOCEPS and assign their system access level.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-300">First Name</Label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="e.g. Samuel" className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" required />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-300">Last Name</Label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="e.g. Flomo" className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-300">Username</Label>
                <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. s.flomo" className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" required />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-300">Password</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Set password" className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" required />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-300">Email Address</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@totaggroup.com" className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" required />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-300">Phone Number</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+231-777-000-000" className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-300">Assign Operational Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white border-white/10">
                  <SelectItem value="account_manager">Account Manager / Admin (Full Portal Edit)</SelectItem>
                  <SelectItem value="operations_supervisor">Operations Supervisor (Event & Staffing Dispatch)</SelectItem>
                  <SelectItem value="head_chef">Head Chef (Culinary & Recipe Planning)</SelectItem>
                  <SelectItem value="food_safety_supervisor">Food Safety Supervisor (HACCP & Hygiene Audits)</SelectItem>
                  <SelectItem value="team_lead">Team Lead (Banquet Floor & Service Delivery)</SelectItem>
                  <SelectItem value="logistics_coordinator">Logistics Coordinator (Fleet & Venue Setup)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl">
              {submitting ? "Creating User..." : "Create User & Assign Role"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT USER DIALOG */}
      <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
        <DialogContent className="max-w-md bg-slate-900 text-white border border-white/10 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-sky-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Edit User & Change Role: {editingStaff?.firstName} {editingStaff?.lastName}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Update details, change assigned role, or set a new password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateUser} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-300">First Name</Label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" required />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-300">Last Name</Label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" required />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-300">Assign New Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white border-white/10">
                  <SelectItem value="account_manager">Account Manager / Admin (Full Portal Edit)</SelectItem>
                  <SelectItem value="operations_supervisor">Operations Supervisor (Event & Staffing Dispatch)</SelectItem>
                  <SelectItem value="head_chef">Head Chef (Culinary & Recipe Planning)</SelectItem>
                  <SelectItem value="food_safety_supervisor">Food Safety Supervisor (HACCP & Hygiene Audits)</SelectItem>
                  <SelectItem value="team_lead">Team Lead (Banquet Floor & Service Delivery)</SelectItem>
                  <SelectItem value="logistics_coordinator">Logistics Coordinator (Fleet & Venue Setup)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-300">Email Address</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" required />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-300">Phone Number</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-300">New Password (leave blank to keep current)</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password..." className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl">
              {submitting ? "Saving Changes..." : "Save User & Role Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ASSIGN TASK DIALOG */}
      <Dialog open={!!taskStaff} onOpenChange={() => setTaskStaff(null)}>
        <DialogContent className="max-w-md bg-slate-900 text-white border border-white/10 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-amber-400 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Assign Task to {taskStaff?.firstName} ({ROLE_LABELS[taskStaff?.role]})
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Dispatch an operational task directly to this staff user's queue.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignTask} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-bold text-slate-300">Task Title</Label>
              <Input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="e.g. Inspect refrigeration units before event" className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" required />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-300">Task Description</Label>
              <Textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)} placeholder="Detailed operational instructions..." rows={3} className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-300">Priority Level</Label>
                <Select value={taskPriority} onValueChange={setTaskPriority}>
                  <SelectTrigger className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 text-white border-white/10">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-300">Due Date</Label>
                <Input type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} className="bg-slate-800 border-white/10 text-xs rounded-xl mt-1" />
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl">
              {submitting ? "Dispatching Task..." : "Dispatch Task to Staff"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
