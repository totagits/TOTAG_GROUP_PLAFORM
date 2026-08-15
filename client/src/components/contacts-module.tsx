import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Search,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  Truck,
  Store,
  UserCheck,
  Edit,
  MoreVertical
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  company?: string;
  type: "Customer" | "Supplier" | "Vendor" | "Service Provider" | "Employee" | "Other";
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website?: string;
  notes: string;
  tags: string[];
  relationship: "Active" | "Inactive" | "Prospective";
  lastContact: string;
  totalTransactions?: number;
  totalAmount?: number;
}

export default function ContactsModule() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");

  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    company: "",
    type: "Customer",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA"
    },
    website: "",
    notes: "",
    tags: [],
    relationship: "Active",
    lastContact: new Date().toISOString().split('T')[0]
  });

  // Sample data initialization
  useEffect(() => {
    const sampleContacts: Contact[] = [
      {
        id: "1",
        name: "John Smith",
        company: "Smith Family Farm",
        type: "Customer",
        email: "john@smithfarm.com",
        phone: "(555) 123-4567",
        address: {
          street: "123 Farm Road",
          city: "Farmville",
          state: "ST",
          zipCode: "12345",
          country: "USA"
        },
        website: "www.smithfarm.com",
        notes: "Regular customer, orders weekly produce boxes",
        tags: ["vip", "organic"],
        relationship: "Active",
        lastContact: "2024-07-10",
        totalTransactions: 45,
        totalAmount: 2340.50
      },
      {
        id: "2",
        name: "Sarah Johnson",
        company: "Green Valley Seeds",
        type: "Supplier",
        email: "sarah@greenvalleyseeds.com",
        phone: "(555) 987-6543",
        address: {
          street: "456 Seed Avenue",
          city: "Seedtown",
          state: "ST",
          zipCode: "67890",
          country: "USA"
        },
        website: "www.greenvalleyseeds.com",
        notes: "Primary seed supplier, excellent organic varieties",
        tags: ["seeds", "organic", "reliable"],
        relationship: "Active",
        lastContact: "2024-07-08",
        totalTransactions: 23,
        totalAmount: 8750.00
      },
      {
        id: "3",
        name: "Mike Rodriguez",
        company: "Rodriguez Equipment Repair",
        type: "Service Provider",
        email: "mike@rodriguezrepair.com",
        phone: "(555) 456-7890",
        address: {
          street: "789 Repair Street",
          city: "Mechanic City",
          state: "ST",
          zipCode: "13579",
          country: "USA"
        },
        notes: "Tractor and equipment specialist, fast service",
        tags: ["equipment", "repair", "reliable"],
        relationship: "Active",
        lastContact: "2024-06-25",
        totalTransactions: 8,
        totalAmount: 3200.00
      },
      {
        id: "4",
        name: "Emma Wilson",
        company: "Farmers Market Co-op",
        type: "Customer",
        email: "emma@farmersmarketcoop.com",
        phone: "(555) 321-0987",
        address: {
          street: "321 Market Square",
          city: "Downtown",
          state: "ST",
          zipCode: "24680",
          country: "USA"
        },
        website: "www.farmersmarketcoop.com",
        notes: "Bulk orders for farmers market events",
        tags: ["wholesale", "events"],
        relationship: "Active",
        lastContact: "2024-07-12",
        totalTransactions: 12,
        totalAmount: 1890.75
      },
      {
        id: "5",
        name: "David Chen",
        company: "Chen Veterinary Services",
        type: "Service Provider",
        email: "david@chenvets.com",
        phone: "(555) 654-3210",
        address: {
          street: "654 Animal Care Lane",
          city: "Pet Town",
          state: "ST",
          zipCode: "97531",
          country: "USA"
        },
        website: "www.chenvets.com",
        notes: "Large animal veterinarian, emergency services available",
        tags: ["veterinary", "livestock", "emergency"],
        relationship: "Active",
        lastContact: "2024-07-05",
        totalTransactions: 15,
        totalAmount: 2500.00
      }
    ];

    setContacts(sampleContacts);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Customer": return <User className="h-4 w-4" />;
      case "Supplier": return <Truck className="h-4 w-4" />;
      case "Vendor": return <Store className="h-4 w-4" />;
      case "Service Provider": return <UserCheck className="h-4 w-4" />;
      case "Employee": return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Customer": return "bg-blue-100 text-blue-800";
      case "Supplier": return "bg-green-100 text-green-800";
      case "Vendor": return "bg-purple-100 text-purple-800";
      case "Service Provider": return "bg-orange-100 text-orange-800";
      case "Employee": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-red-100 text-red-800";
      case "Prospective": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "All" || contact.type === selectedType;
    const matchesTab = activeTab === "all" || contact.type.toLowerCase().replace(" ", "") === activeTab;

    return matchesSearch && matchesType && matchesTab;
  });

  const contactTypes = ["All", "Customer", "Supplier", "Vendor", "Service Provider", "Employee", "Other"];

  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(c => c.relationship === "Active").length;
  const customers = contacts.filter(c => c.type === "Customer").length;
  const suppliers = contacts.filter(c => c.type === "Supplier").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Contacts</h2>
          <p className="text-gray-600">Manage your farm's contacts and relationships</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddContactDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{activeContacts}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers}</p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{suppliers}</p>
              </div>
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {contactTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="customer">Customers</TabsTrigger>
          <TabsTrigger value="supplier">Suppliers</TabsTrigger>
          <TabsTrigger value="vendor">Vendors</TabsTrigger>
          <TabsTrigger value="serviceprovider">Services</TabsTrigger>
          <TabsTrigger value="employee">Employees</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(contact.type)}
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  {contact.company && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {contact.company}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(contact.type)}>
                      {contact.type}
                    </Badge>
                    <Badge className={getRelationshipColor(contact.relationship)} variant="outline">
                      {contact.relationship}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">
                        {contact.address.city}, {contact.address.state}
                      </span>
                    </div>
                  </div>

                  {(contact.totalTransactions || contact.totalAmount) && (
                    <div className="pt-2 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {contact.totalTransactions && (
                          <div>
                            <p className="text-gray-600">Transactions</p>
                            <p className="font-bold">{contact.totalTransactions}</p>
                          </div>
                        )}
                        {contact.totalAmount && (
                          <div>
                            <p className="text-gray-600">Total Amount</p>
                            <p className="font-bold">${contact.totalAmount.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{contact.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {contact.notes && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      {contact.notes.length > 100 
                        ? `${contact.notes.substring(0, 100)}...` 
                        : contact.notes}
                    </p>
                  )}

                  <div className="pt-2 text-xs text-gray-500">
                    Last contact: {contact.lastContact}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedType !== "All" 
                  ? "Try adjusting your search or filters."
                  : "Get started by adding your first contact."}
              </p>
              {!searchTerm && selectedType === "All" && (
                <Button onClick={() => setShowAddContactDialog(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Contact
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Contact Dialog */}
      <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Add a new contact to your farm's network.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Name</Label>
                <Input
                  id="contactName"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  value={newContact.company}
                  onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                  placeholder="Smith Family Farm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactType">Type</Label>
                <Select value={newContact.type} onValueChange={(value) => setNewContact({...newContact, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="Vendor">Vendor</SelectItem>
                    <SelectItem value="Service Provider">Service Provider</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Select value={newContact.relationship} onValueChange={(value) => setNewContact({...newContact, relationship: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Prospective">Prospective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  placeholder="john@smithfarm.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="street">Address</Label>
              <Input
                id="street"
                value={newContact.address?.street}
                onChange={(e) => setNewContact({
                  ...newContact, 
                  address: {...newContact.address!, street: e.target.value}
                })}
                placeholder="123 Farm Road"
                className="mb-2"
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={newContact.address?.city}
                  onChange={(e) => setNewContact({
                    ...newContact, 
                    address: {...newContact.address!, city: e.target.value}
                  })}
                  placeholder="City"
                />
                <Input
                  value={newContact.address?.state}
                  onChange={(e) => setNewContact({
                    ...newContact, 
                    address: {...newContact.address!, state: e.target.value}
                  })}
                  placeholder="State"
                />
                <Input
                  value={newContact.address?.zipCode}
                  onChange={(e) => setNewContact({
                    ...newContact, 
                    address: {...newContact.address!, zipCode: e.target.value}
                  })}
                  placeholder="ZIP"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newContact.notes}
                onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                placeholder="Additional notes about this contact..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddContactDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}