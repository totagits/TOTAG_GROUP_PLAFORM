import re

dashboard_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\dashboard.tsx"

with open(dashboard_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace StaffDirectory implementation with complete user creation & management UI
new_staff_directory = '''function StaffDirectory({ staff, onRefresh }: { staff: any[]; onRefresh?: () => void }) {
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
}'''

# Replace function StaffDirectory in dashboard.tsx
pattern = r'function StaffDirectory\(\{ staff \}: \{ staff: any\[\] \}\) \{[\s\S]*?\n\}'
if re.search(pattern, content):
    updated_content = re.sub(pattern, new_staff_directory, content)
    with open(dashboard_path, "w", encoding="utf-8") as f:
        f.write(updated_content)
    print("Successfully replaced StaffDirectory with User & Role Management System!")
else:
    print("Could not find StaffDirectory pattern!")
