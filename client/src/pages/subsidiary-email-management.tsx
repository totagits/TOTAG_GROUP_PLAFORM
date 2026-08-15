import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, Plus, Edit, Trash2, Building2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface SubsidiaryEmail {
  id: number;
  subsidiaryId: string;
  subsidiaryName: string;
  emailAddress: string;
  description?: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

const subsidiaries = [
  { id: "corporate", name: "TOTAG Corporate", color: "blue" },
  { id: "cargo", name: "TOTAG Cargo Handling", color: "green" },
  { id: "farm", name: "TOTAG FARM", color: "emerald" },
  { id: "petroleum", name: "TOTAG Petroleum Services", color: "orange" },
  { id: "construction", name: "TOTAG General Construction", color: "yellow" },
  { id: "merchandise", name: "TOTAG General Merchandise", color: "purple" },
  { id: "it", name: "TOTAG IT Services", color: "blue" },
  { id: "catering", name: "TOTAG Catering & Events", color: "red" }
];

export default function SubsidiaryEmailManagement() {
  const [subsidiaryEmails, setSubsidiaryEmails] = useState<SubsidiaryEmail[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<SubsidiaryEmail | null>(null);
  const [formData, setFormData] = useState({
    subsidiaryId: "",
    subsidiaryName: "",
    emailAddress: "",
    description: "",
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubsidiaryEmails();
  }, []);

  const fetchSubsidiaryEmails = async () => {
    try {
      const response = await fetch("/api/subsidiary-emails");
      const data = await response.json();
      if (data.success) {
        setSubsidiaryEmails(data.subsidiaryEmails);
      }
    } catch (error) {
      console.error("Error fetching subsidiary emails:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subsidiary emails",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingEmail ? "PUT" : "POST";
      const url = editingEmail 
        ? `/api/subsidiary-emails/${editingEmail.id}`
        : "/api/subsidiary-emails";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: editingEmail 
            ? "Subsidiary email updated successfully"
            : "Subsidiary email created successfully"
        });
        
        setIsDialogOpen(false);
        resetForm();
        fetchSubsidiaryEmails();
      } else {
        throw new Error(data.error || "Failed to save subsidiary email");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save subsidiary email",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (email: SubsidiaryEmail) => {
    setEditingEmail(email);
    setFormData({
      subsidiaryId: email.subsidiaryId,
      subsidiaryName: email.subsidiaryName,
      emailAddress: email.emailAddress,
      description: email.description || "",
      isActive: email.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subsidiary email?")) {
      return;
    }

    try {
      const response = await fetch(`/api/subsidiary-emails/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Subsidiary email deleted successfully"
        });
        fetchSubsidiaryEmails();
      } else {
        throw new Error("Failed to delete subsidiary email");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subsidiary email",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      subsidiaryId: "",
      subsidiaryName: "",
      emailAddress: "",
      description: "",
      isActive: true
    });
    setEditingEmail(null);
  };

  const handleSubsidiarySelect = (subsidiaryId: string) => {
    const subsidiary = subsidiaries.find(s => s.id === subsidiaryId);
    if (subsidiary) {
      setFormData(prev => ({
        ...prev,
        subsidiaryId,
        subsidiaryName: subsidiary.name
      }));
    }
  };

  const getSubsidiaryColor = (subsidiaryId: string) => {
    const subsidiary = subsidiaries.find(s => s.id === subsidiaryId);
    return subsidiary?.color || "gray";
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin-dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Building2 className="w-8 h-8 mr-3 text-blue-600" />
                Subsidiary Email Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage email addresses for all TOTAG Group subsidiaries under totaggroup.com domain
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subsidiary Email
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingEmail ? "Edit Subsidiary Email" : "Add New Subsidiary Email"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subsidiary">Subsidiary</Label>
                  <Select 
                    value={formData.subsidiaryId} 
                    onValueChange={handleSubsidiarySelect}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subsidiary" />
                    </SelectTrigger>
                    <SelectContent>
                      {subsidiaries.map((subsidiary) => (
                        <SelectItem key={subsidiary.id} value={subsidiary.id}>
                          {subsidiary.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, emailAddress: e.target.value }))}
                    placeholder="subsidiary@totaggroup.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this email address usage"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingEmail ? "Update" : "Create"} Email
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Email List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subsidiaryEmails.map((email) => (
            <Card key={email.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={`bg-${getSubsidiaryColor(email.subsidiaryId)}-100 text-${getSubsidiaryColor(email.subsidiaryId)}-800`}
                  >
                    {email.subsidiaryName}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(email)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(email.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  {email.emailAddress}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {email.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {email.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${email.isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
                    {email.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <div>
                    Created: {new Date(email.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {subsidiaryEmails.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No subsidiary emails configured
            </h3>
            <p className="text-gray-500 mb-6">
              Create email addresses for TOTAG Group subsidiaries under the totaggroup.com domain.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Subsidiary Email
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}