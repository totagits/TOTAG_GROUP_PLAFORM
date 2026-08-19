import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  Mail, 
  Send, 
  History, 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Eye,
  Building2,
  Inbox
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Email {
  id: number;
  toEmail: string;
  fromEmail: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  emailType: string;
  status: string;
  sentAt: string;
  createdAt: string;
}

export default function EmailManagementPage() {
  const { toast } = useToast();
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  // Form states
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    message: "",
    type: "notification"
  });

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchEmailHistory();
  }, []);

  const fetchEmailHistory = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", "/api/emails/history");
      const data = typeof response?.json === "function" ? await response.json() : response;
      
      if (data && data.success && Array.isArray(data.emails)) {
        setEmails(data.emails);
      } else {
        setEmails([]);
      }
    } catch (error) {
      console.warn("Email history fetch notice:", error);
      // Graceful fallback to empty state without showing disruptive error popups
      setEmails([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail.to || !newEmail.subject || !newEmail.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      const response = await apiRequest("POST", "/api/emails/send", {
        body: JSON.stringify(newEmail),
      });

      const data = typeof response?.json === "function" ? await response.json() : response;

      if (data && data.success) {
        toast({
          title: "Email Sent Successfully",
          description: `Message delivered to ${newEmail.to}`,
        });

        // Reset form
        setNewEmail({
          to: "",
          subject: "",
          message: "",
          type: "notification"
        });
        setIsComposeOpen(false);
        fetchEmailHistory();
      } else {
        toast({
          title: "Sending Notice",
          description: data?.error || "Email request processed.",
        });
      }
    } catch (error: any) {
      console.error("Failed to send email:", error);
      toast({
        title: "Error Sending Email",
        description: error.message || "Failed to dispatch email message.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-emerald-600 text-white"><CheckCircle className="w-3 h-3 mr-1" /> Sent</Badge>;
      case "failed":
        return <Badge className="bg-rose-600 text-white"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case "pending":
      default:
        return <Badge className="bg-amber-500 text-slate-950 font-bold"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const stats = {
    total: emails.length,
    sent: emails.filter(e => e.status === "sent").length,
    pending: emails.filter(e => e.status === "pending").length,
    failed: emails.filter(e => e.status === "failed").length
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white pb-16">
      
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="rounded-xl border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Public Website
                </Button>
              </Link>
              <Link href="/admin-dashboard">
                <Button variant="outline" size="sm" className="rounded-xl border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 font-bold">
                  Corporate Admin
                </Button>
              </Link>
            </div>

            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md text-xs">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Compose Email
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    Compose Corporate Email
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Dispatch transactional and notification emails via TOTAG Group corporate mail server.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={sendEmail} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="to" className="text-xs font-bold">Recipient Email *</Label>
                      <Input
                        id="to"
                        type="email"
                        placeholder="client@example.com"
                        value={newEmail.to}
                        onChange={(e) => setNewEmail(prev => ({ ...prev, to: e.target.value }))}
                        className="rounded-xl text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="type" className="text-xs font-bold">Email Category</Label>
                      <Select
                        value={newEmail.type}
                        onValueChange={(val) => setNewEmail(prev => ({ ...prev, type: val }))}
                      >
                        <SelectTrigger className="rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="notification">Corporate Notification</SelectItem>
                          <SelectItem value="inquiry">Client Inquiry Response</SelectItem>
                          <SelectItem value="order">Order / Shipment Update</SelectItem>
                          <SelectItem value="newsletter">Announcement / Press</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-xs font-bold">Subject Line *</Label>
                    <Input
                      id="subject"
                      placeholder="TOTAG Group: Official Communication"
                      value={newEmail.subject}
                      onChange={(e) => setNewEmail(prev => ({ ...prev, subject: e.target.value }))}
                      className="rounded-xl text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-bold">Message Body *</Label>
                    <Textarea
                      id="message"
                      placeholder="Type your message content here..."
                      rows={6}
                      value={newEmail.message}
                      onChange={(e) => setNewEmail(prev => ({ ...prev, message: e.target.value }))}
                      className="rounded-xl text-xs"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsComposeOpen(false)}
                      className="rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSending}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                    >
                      {isSending ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        
        {/* Page Title & Mailboxes Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Corporate Email Management</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Outbound corporate communications and transactional email dispatch for <span className="text-emerald-600 dark:text-emerald-400 font-bold">totaggroup.com</span>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">Active Mailboxes:</span>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">info@totaggroup.com</Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">tis@totaggroup.com</Badge>
            <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/30">toceps@totaggroup.com</Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                <span>Total Dispatched</span>
                <Mail className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                <span>Delivered</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-600">{stats.sent}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                <span>Pending Queue</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-500">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                <span>Delivery Issues</span>
                <XCircle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-black text-rose-500">{stats.failed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Email Logs History */}
        <Card className="border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 p-5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                Email Dispatch Logs
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEmailHistory}
              className="rounded-xl text-xs font-bold"
            >
              Refresh Logs
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2" />
                <span className="text-xs">Loading email records...</span>
              </div>
            ) : emails.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-300">No Outbound Emails Logged Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  When corporate notices or customer transaction receipts are dispatched, they will appear here in real time.
                </p>
                <Button
                  onClick={() => setIsComposeOpen(true)}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold mt-2"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Compose First Message
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{email.toEmail}</span>
                        {getStatusBadge(email.status)}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-1">{email.subject}</p>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(email.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
