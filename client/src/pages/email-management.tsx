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
  Eye
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
      const data = await response.json();
      
      if (data.success) {
        setEmails(data.emails);
      }
    } catch (error) {
      console.error("Failed to fetch email history:", error);
      toast({
        title: "Error",
        description: "Failed to load email history",
        variant: "destructive",
      });
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
      const response = await apiRequest("POST", "/api/emails/send", newEmail);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Email Sent",
          description: "Email has been processed successfully",
        });
        setNewEmail({ to: "", subject: "", message: "", type: "notification" });
        setIsComposeOpen(false);
        fetchEmailHistory(); // Refresh email list
      } else {
        throw new Error(data.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Email sending error:", error);
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Sent</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeColors = {
      order_confirmation: "bg-blue-100 text-blue-800",
      contact_inquiry: "bg-purple-100 text-purple-800",
      notification: "bg-gray-100 text-gray-800",
      marketing: "bg-green-100 text-green-800"
    };
    
    return (
      <Badge className={typeColors[type as keyof typeof typeColors] || typeColors.notification}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to TOTAG Group
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Email Management</h1>
                <p className="text-gray-600">Professional communications for totaggroup.com</p>
              </div>
            </div>
            
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Compose Email
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Compose New Email</DialogTitle>
                  <DialogDescription>
                    Send professional emails from the totaggroup.com domain
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={sendEmail} className="space-y-4">
                  <div>
                    <Label htmlFor="to">To Email *</Label>
                    <Input
                      id="to"
                      type="email"
                      value={newEmail.to}
                      onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
                      placeholder="recipient@example.com"
                      required
                    />
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
                        <SelectItem value="contact_inquiry">Contact Response</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={newEmail.subject}
                      onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                      placeholder="Enter email subject"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={newEmail.message}
                      onChange={(e) => setNewEmail({...newEmail, message: e.target.value})}
                      placeholder="Enter your message..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSending}>
                      {isSending ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
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
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Email Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        {/* Email History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Email History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading emails...</p>
              </div>
            ) : emails.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No emails sent yet</p>
                <p className="text-sm text-gray-400">Compose your first email to get started</p>
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
                          <h3 className="font-semibold">{email.subject}</h3>
                          {getStatusBadge(email.status)}
                          {getTypeBadge(email.emailType)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">To:</span> {email.toEmail}</p>
                          <p><span className="font-medium">From:</span> {email.fromEmail}</p>
                          <p><span className="font-medium">Sent:</span> {new Date(email.sentAt).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedEmail(email)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{email.subject}</DialogTitle>
                            <DialogDescription>
                              Email sent from {email.fromEmail} to {email.toEmail}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="flex space-x-4">
                              {getStatusBadge(email.status)}
                              {getTypeBadge(email.emailType)}
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">Email Content:</h4>
                              <div 
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: email.htmlContent }} 
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}