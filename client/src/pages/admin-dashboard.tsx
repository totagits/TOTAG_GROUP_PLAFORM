import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Shield, 
  Mail, 
  BarChart3, 
  Users, 
  FileText, 
  Settings,
  Building2,
  TrendingUp,
  Calendar,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  History,
  Send,
  AlertTriangle
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
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

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [emails, setEmails] = useState<Email[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isManageEmailsOpen, setIsManageEmailsOpen] = useState(false);
  const [subsidiaryEmails, setSubsidiaryEmails] = useState<any[]>([]);
  const [editingSubsidiary, setEditingSubsidiary] = useState<any>(null);
  const { toast } = useToast();

  // Email form state
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    message: "",
    type: "notification",
    subsidiary: "corporate"
  });

  const subsidiaries = [
    { id: "corporate", name: "TOTAG Group Corporate", email: "info@totaggroup.com" },
    { id: "cargo", name: "TOTAG Cargo Handling", email: "cargo@totaggroup.com" },
    { id: "farm", name: "TOTAG FARM", email: "farm@totaggroup.com" },
    { id: "petroleum", name: "TOTAG Petroleum Services", email: "petroleum@totaggroup.com" },
    { id: "construction", name: "TOTAG General Construction", email: "construction@totaggroup.com" },
    { id: "merchandise", name: "TOTAG General Merchandise", email: "merchandise@totaggroup.com" },
    { id: "it", name: "TOTAG IT Services", email: "it@totaggroup.com" },
    { id: "catering", name: "TOTAG Catering", email: "catering@totaggroup.com" }
  ];

  useEffect(() => {
    checkAdminAuth();
    if (activeTab === "communications") {
      fetchEmailHistory();
    }
  }, [activeTab]);

  const checkAdminAuth = () => {
    const adminData = localStorage.getItem("totagAdmin");
    if (!adminData) {
      window.location.href = "/admin-login";
      return;
    }
    
    try {
      const parsedUser = JSON.parse(adminData);
      setUser(parsedUser);
    } catch (error) {
      window.location.href = "/admin-login";
      return;
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailHistory = async () => {
    try {
      const response = await apiRequest("GET", "/api/emails/history");
      const data = await response.json();
      
      if (data.success) {
        setEmails(data.emails);
      }
    } catch (error) {
      console.error("Failed to fetch email history:", error);
    }
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.to || !newEmail.subject || !newEmail.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const selectedSubsidiary = subsidiaries.find(s => s.id === newEmail.subsidiary);
      const response = await apiRequest("POST", "/api/emails/send", {
        to: newEmail.to,
        subject: newEmail.subject,
        message: newEmail.message,
        type: newEmail.type,
        subsidiary: newEmail.subsidiary,
        fromEmail: selectedSubsidiary?.email || 'info@totaggroup.com',
        fromName: selectedSubsidiary?.name || 'TOTAG Group Corporate'
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Email Sent",
          description: `Email sent from ${selectedSubsidiary?.name || 'TOTAG Group Corporate'}`,
        });
        
        setNewEmail({ to: "", subject: "", message: "", type: "notification", subsidiary: "corporate" });
        setIsComposeOpen(false);
        fetchEmailHistory(); // Refresh email list
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error: any) {
      toast({
        title: "Email Failed",
        description: error.message || "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: { variant: "default" as const, color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800", icon: Clock },
      failed: { variant: "destructive" as const, color: "bg-red-100 text-red-800", icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeColors = {
      notification: "bg-blue-100 text-blue-800",
      marketing: "bg-purple-100 text-purple-800",
      contact_response: "bg-green-100 text-green-800",
      order_confirmation: "bg-orange-100 text-orange-800"
    };
    
    return (
      <Badge className={`${typeColors[type as keyof typeof typeColors] || typeColors.notification} border-0`}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("totagAdmin");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to TOTAG Group
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TOTAG Group Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Corporate Management & Communications</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.role} • {user.department}</p>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="h-3 w-3 mr-1" />
                {user?.role || "Admin Access"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Communications
            </TabsTrigger>
            <TabsTrigger value="subsidiaries" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Subsidiaries
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Subsidiaries</p>
                      <p className="text-2xl font-bold text-gray-900">7</p>
                      <p className="text-xs text-green-600">All operational</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                      <p className="text-2xl font-bold text-gray-900">{emails.length}</p>
                      <p className="text-xs text-green-600">This month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Business Growth</p>
                      <p className="text-2xl font-bold text-gray-900">+15%</p>
                      <p className="text-xs text-green-600">Quarter over quarter</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Staff</p>
                      <p className="text-2xl font-bold text-gray-900">150+</p>
                      <p className="text-xs text-green-600">Across all divisions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Weekly Executive Meeting</p>
                      <p className="text-sm text-gray-600">All subsidiary heads meeting scheduled for tomorrow</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">TGM Platform Launch</p>
                      <p className="text-sm text-gray-600">General Merchandise e-commerce platform successfully deployed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Communication System Active</p>
                      <p className="text-sm text-gray-600">Corporate email management system ready for use</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab - Email Management */}
          <TabsContent value="communications" className="space-y-6">
            {/* Email Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Mail className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Emails</p>
                      <p className="text-2xl font-bold">{emails.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sent</p>
                      <p className="text-2xl font-bold">{emails.filter(e => e.status === 'sent').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold">{emails.filter(e => e.status === 'pending').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Failed</p>
                      <p className="text-2xl font-bold">{emails.filter(e => e.status === 'failed').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compose Email Button and Subsidiary Email Management */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Corporate Communications</h3>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="bg-gray-50 hover:bg-gray-100"
                  onClick={() => window.location.href = '/subsidiary-email-management'}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Subsidiary Emails
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Send className="h-4 w-4 mr-2" />
                      Test Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Test Email</DialogTitle>
                      <DialogDescription>
                        Test the email delivery system while domain verification is in progress
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      console.log('Test email form submitted');
                      
                      const formData = new FormData(e.currentTarget);
                      const toEmail = formData.get('testEmail') as string;
                      
                      if (!toEmail) {
                        toast({
                          title: "Error",
                          description: "Please enter an email address",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      const testEmail = {
                        fromEmail: 'it@totaggroup.com',
                        toEmail: toEmail,
                        subject: 'Test Email from TOTAG IT Services',
                        message: 'This is a test email to verify our email delivery system is working properly.',
                        subsidiaryName: 'TOTAG IT Services'
                      };
                      
                      console.log('Sending test email:', testEmail);
                      
                      try {
                        const response = await fetch('/api/send-test-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(testEmail)
                        });
                        
                        console.log('Response status:', response.status);
                        const result = await response.json();
                        console.log('Response result:', result);
                        
                        if (result.success) {
                          toast({
                            title: "Email Sent Successfully",
                            description: `Test email sent to ${toEmail}. Check your inbox!`,
                          });
                          // Clear the form
                          (e.target as HTMLFormElement).reset();
                        } else {
                          toast({
                            title: "Email Failed",
                            description: result.message || "Failed to send test email",
                            variant: "destructive",
                          });
                        }
                      } catch (error) {
                        console.error('Email sending error:', error);
                        toast({
                          title: "Error",
                          description: "Network error - please try again",
                          variant: "destructive",
                        });
                      }
                    }} className="space-y-4">
                      <div>
                        <Label htmlFor="testEmail">Send Test Email To:</Label>
                        <Input 
                          name="testEmail" 
                          type="email" 
                          placeholder="totagfarm@gmail.com (recommended)" 
                          defaultValue="totagfarm@gmail.com"
                          required 
                        />
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                          <p className="text-sm font-medium text-green-800 mb-1">✅ Email System Active</p>
                          <p className="text-xs text-green-700 mb-2">
                            Using totagfarm@gmail.com as verified address - operational for internal testing
                          </p>
                          <div className="bg-white border border-green-200 rounded p-2">
                            <p className="text-xs font-medium text-gray-800 mb-1">Recommended Test Address:</p>
                            <p className="text-xs text-gray-700 font-mono bg-gray-100 p-1 rounded">totagfarm@gmail.com</p>
                            <p className="text-xs text-gray-600 mt-1">For wider email reach, domain verification may be needed</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button type="submit" className="w-full">
                          Send Test Email
                        </Button>
                        <Link href="/domain-verification-guide">
                          <Button variant="outline" className="w-full text-sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Email Setup Documentation
                          </Button>
                        </Link>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Compose Email
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Compose Corporate Email</DialogTitle>
                    <DialogDescription>
                      Send professional emails from the totaggroup.com domain
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={sendEmail} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subsidiary">Send From Subsidiary</Label>
                        <Select value={newEmail.subsidiary} onValueChange={(value) => setNewEmail({...newEmail, subsidiary: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {subsidiaries.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          From: {subsidiaries.find(s => s.id === newEmail.subsidiary)?.email || 'info@totaggroup.com'}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="type">Email Type</Label>
                        <Select value={newEmail.type} onValueChange={(value) => setNewEmail({...newEmail, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="notification">Notification</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="contact_response">Contact Response</SelectItem>
                            <SelectItem value="order_confirmation">Order Confirmation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="to">To Email Address</Label>
                      <Input
                        id="to"
                        type="email"
                        placeholder="recipient@example.com"
                        value={newEmail.to}
                        onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input
                        id="subject"
                        placeholder="Enter email subject"
                        value={newEmail.subject}
                        onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Email Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Enter your message here..."
                        value={newEmail.message}
                        onChange={(e) => setNewEmail({...newEmail, message: e.target.value})}
                        rows={8}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsComposeOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSending ? (
                          <div className="flex items-center">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Sending...
                          </div>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Email
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            {/* Email History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Email History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emails.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No emails sent yet</p>
                    <p className="text-sm text-gray-400">Compose your first corporate email to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emails.map((email) => (
                      <motion.div
                        key={email.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{email.subject}</h4>
                              {getStatusBadge(email.status)}
                              {getTypeBadge(email.emailType)}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p><strong>To:</strong> {email.toEmail}</p>
                              <p><strong>From:</strong> {email.fromEmail}</p>
                              <p><strong>Sent:</strong> {new Date(email.sentAt).toLocaleString()}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEmail(email)}
                          >
                            View Details
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subsidiaries Tab */}
          <TabsContent value="subsidiaries" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">TOTAG Group Subsidiaries</h3>
              <p className="text-gray-600">Manage communications and operations across all seven business divisions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subsidiaries.map((subsidiary, index) => {
                const emailCount = emails.filter(email => email.fromEmail === subsidiary.email).length;
                const subsidiaryColors = {
                  'info@totaggroup.com': 'blue',
                  'cargo@totaggroup.com': 'green',
                  'farm@totaggroup.com': 'emerald',
                  'petroleum@totaggroup.com': 'red',
                  'construction@totaggroup.com': 'orange',
                  'merchandise@totaggroup.com': 'purple',
                  'it@totaggroup.com': 'cyan',
                  'catering@totaggroup.com': 'rose'
                };
                const colorClass = subsidiaryColors[subsidiary.email as keyof typeof subsidiaryColors] || 'blue';
                
                return (
                  <Card key={subsidiary.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 bg-${colorClass}-100 rounded-lg`}>
                          <Building2 className={`h-6 w-6 text-${colorClass}-600`} />
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{subsidiary.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{subsidiary.email}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Emails Sent:</span>
                          <Badge variant="secondary" className={`bg-${colorClass}-50 text-${colorClass}-700`}>
                            {emailCount}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Status:</span>
                          <span className="text-xs font-medium text-green-600">Operational</span>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => {
                          setNewEmail({...newEmail, subsidiary: subsidiary.id});
                          setIsComposeOpen(true);
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Corporate Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Corporate reporting dashboard</p>
                  <p className="text-sm text-gray-400">Comprehensive analytics and performance metrics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Corporate system configuration</p>
                  <p className="text-sm text-gray-400">Administrative controls and system preferences</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Email Details</DialogTitle>
              <DialogDescription>
                Full email information and content
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex space-x-4">
                {getStatusBadge(selectedEmail.status)}
                {getTypeBadge(selectedEmail.emailType)}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Email Content:</h4>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }} 
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}