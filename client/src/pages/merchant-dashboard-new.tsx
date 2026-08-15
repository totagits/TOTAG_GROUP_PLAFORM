import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  DollarSign,
  Edit,
  Save,
  X,
  Plus,
  ArrowLeft,
  Shield,
  Navigation,
  Building2,
  BarChart3,
  Users,
  ShoppingCart,
  Warehouse,
  FileText,
  TrendingUp,
  AlertTriangle,
  Settings,
  Store,
  Mail
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContentManagementSystem from "@/components/cms/ContentManagementSystem";
import { StaffManagementSystem } from "@/components/hrmis/StaffManagementSystem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import TGMLogo from "@assets/Logo for TGM_1753450516331.png";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  paymentMethod: string;
  total: string;
  subtotal: string;
  deliveryFee: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
  blockchainHash: string;
  orderType?: string;
}

interface Delivery {
  id: number;
  orderId: number;
  trackingNumber: string;
  status: string;
  driverName: string;
  driverPhone: string;
  vehicleInfo: string;
  currentLocation: string;
  estimatedArrival: string;
  actualDelivery: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function MerchantDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);

  // Import CMS component for General Manager
  const isGeneralManager = user?.role === "General Manager";
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("merchantUser");
    if (!storedUser) {
      window.location.href = "/merchant-login";
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Set default tab based on role
      if (userData.role === "Delivery Staff") {
        setActiveTab("deliveries");
      } else if (userData.role === "Sales Team") {
        setActiveTab("orders");
      } else if (userData.role === "Warehouse Staff") {
        setActiveTab("inventory");
      } else {
        setActiveTab("dashboard");
      }
      
      fetchOrders();
      fetchDeliveries();
    } catch (error) {
      localStorage.removeItem("merchantUser");
      window.location.href = "/merchant-login";
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("/api/deliveries");
      const data = await response.json();
      if (data.success) {
        setDeliveries(data.deliveries);
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId: number, updates: any) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchOrders(); // Refresh orders
        toast({
          title: "Order Updated",
          description: "Order status has been updated successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateDelivery = async (deliveryId: number, updates: any) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchDeliveries(); // Refresh deliveries
        toast({
          title: "Delivery Updated",
          description: "Delivery status has been updated successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update delivery.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
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
              <Link href="/general-merchandise">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Store
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <img src={TGMLogo} alt="TGM Logo" className="h-10 w-10 rounded-full" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TGM Administrative Portal</h1>
                  <p className="text-sm text-gray-500">{user?.role === "General Manager" ? "Complete Business Management" : "Staff Operations Center"}</p>

                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">{user.role} • {user.department}</p>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  localStorage.removeItem("merchantUser");
                  window.location.href = "/merchant-login";
                }}
              >
                Logout
              </Button>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Shield className="h-3 w-3 mr-1" />
                {user?.role || "Staff Access"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Navigation Tabs - Role-specific */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {(() => {
                  const allTabs = [
                    { id: "dashboard", label: "Dashboard", icon: BarChart3, roles: ["General Manager"] },
                    { id: "orders", label: "Orders", icon: ShoppingCart, roles: ["General Manager", "Sales Team"] },
                    { id: "credit", label: "Credit Management", icon: DollarSign, roles: ["General Manager", "Sales Team"] },
                    { id: "deliveries", label: "Deliveries", icon: Truck, roles: ["General Manager", "Delivery Staff"] },
                    { id: "inventory", label: "Inventory", icon: Warehouse, roles: ["General Manager", "Warehouse Staff"] },
                    { id: "users", label: "Staff", icon: Users, roles: ["General Manager"] },
                    { id: "reports", label: "Reports", icon: FileText, roles: ["General Manager"] },
                    { id: "settings", label: "Settings", icon: Settings, roles: ["General Manager"] },
                    ...(isGeneralManager ? [{ id: "cms", label: "Website CMS", icon: Edit, roles: ["General Manager"] }] : [])
                  ];
                  
                  return allTabs.filter(tab => 
                    tab.roles.includes(user?.role) || user?.role === "General Manager"
                  );
                })().map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                        <p className="text-xs text-green-600">+12% from last month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">$24,780</p>
                        <p className="text-xs text-green-600">+8% from last month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Truck className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                        <p className="text-2xl font-bold text-gray-900">{deliveries.filter(d => d.status === "in_transit").length}</p>
                        <p className="text-xs text-blue-600">Real-time tracking</p>
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
                        <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                        <p className="text-2xl font-bold text-gray-900">23%</p>
                        <p className="text-xs text-green-600">Monthly growth</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Administrative Quick Actions</CardTitle>
                  <CardDescription>Access all business management functions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col space-y-2"
                      onClick={() => setActiveTab("orders")}
                    >
                      <ShoppingCart className="h-6 w-6" />
                      <span>Manage Orders</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col space-y-2"
                      onClick={() => setActiveTab("inventory")}
                    >
                      <Warehouse className="h-6 w-6" />
                      <span>Inventory Control</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col space-y-2"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="h-6 w-6" />
                      <span>Staff Management</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col space-y-2"
                      onClick={() => setActiveTab("deliveries")}
                    >
                      <Truck className="h-6 w-6" />
                      <span>Delivery Operations</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col space-y-2"
                      onClick={() => setActiveTab("reports")}
                    >
                      <FileText className="h-6 w-6" />
                      <span>Business Reports</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col space-y-2"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-6 w-6" />
                      <span>System Settings</span>
                    </Button>

                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Business Activity</CardTitle>
                  <CardDescription>Latest system activity and important alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-gray-500">Order #ORD-2025-001 from Sarah Johnson - $125.50</p>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Low stock alert</p>
                        <p className="text-xs text-gray-500">Premium Rice (10 units remaining) - Reorder recommended</p>
                      </div>
                      <span className="text-xs text-gray-500">15 min ago</span>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Delivery completed</p>
                        <p className="text-xs text-gray-500">Order #ORD-2025-002 delivered successfully to Monrovia</p>
                      </div>
                      <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Management */}
          {activeTab === "orders" && <OrderManagementInterface orders={orders} user={user} onUpdateOrder={handleUpdateOrder} />}

          {/* Credit Management */}
          {activeTab === "credit" && <CreditManagementInterface user={user} />}

          {/* Inventory Management */}
          {activeTab === "inventory" && <InventoryManagementInterface user={user} />}

          {/* Staff Management */}
          {activeTab === "users" && (
            <StaffManagementSystem />
          )}

          {/* Delivery Operations */}
          {activeTab === "deliveries" && <DeliveryManagementInterface deliveries={deliveries} user={user} onUpdateDelivery={handleUpdateDelivery} />}

          {/* Business Reports */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Intelligence</CardTitle>
                  <CardDescription>Analytics, reports, and business insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Advanced reporting dashboard coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Content Management System - General Manager Only */}
          {activeTab === "cms" && isGeneralManager && (
            <ContentManagementSystem 
              onBack={() => setActiveTab("dashboard")}
            />
          )}

          {/* System Settings */}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system preferences and account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Account Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                      <p><strong>Role:</strong> {user?.role}</p>
                      <p><strong>Department:</strong> {user?.department}</p>
                    </div>
                  </div>
                  {isGeneralManager && (
                    <div>
                      <h4 className="font-medium mb-2">System Administration</h4>
                      <p className="text-sm text-gray-600">
                        As General Manager, you have full access to all system features including the Content Management System.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

// Order Management Interface - For Sales Team and General Manager
function OrderManagementInterface({ orders, user, onUpdateOrder }: { orders: Order[], user: any, onUpdateOrder: (id: number, updates: any) => void }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showInStoreModal, setShowInStoreModal] = useState(false);
  const [showAssignDeliveryModal, setShowAssignDeliveryModal] = useState(false);
  const [orderForDelivery, setOrderForDelivery] = useState<Order | null>(null);
  const [inStoreOrderForm, setInStoreOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    items: [{ name: "", quantity: 1, price: 0 }],
    paymentMethod: "cash",
    notes: "",
    downPayment: "",
    paymentTerms: "monthly",
    creditNotes: ""
  });
  const { toast } = useToast();

  const filteredOrders = orders.filter(order => 
    statusFilter === "all" || order.status.toLowerCase() === statusFilter
  );

  const canEditOrders = user?.role === "General Manager" || user?.role === "Sales Team";
  const isSalesTeam = user?.role === "Sales Team";

  // Create in-store order
  const createInStoreOrder = async () => {
    try {
      const total = inStoreOrderForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
      const orderData = {
        customerName: inStoreOrderForm.customerName,
        customerPhone: inStoreOrderForm.customerPhone,
        customerEmail: inStoreOrderForm.customerEmail || `${inStoreOrderForm.customerName.toLowerCase().replace(' ', '')}@instore.tgm`,
        items: inStoreOrderForm.items,
        total: total,
        paymentMethod: inStoreOrderForm.paymentMethod,
        deliveryOption: "in_store_pickup",
        deliveryAddress: "TGM Store - In-Store Pickup",
        city: "Monrovia",
        orderType: "in_store",
        processedBy: user?.firstName + " " + user?.lastName,
        notes: inStoreOrderForm.notes,
        ...(inStoreOrderForm.paymentMethod === "credit" && {
          downPayment: inStoreOrderForm.downPayment,
          paymentTerms: inStoreOrderForm.paymentTerms,
          creditNotes: inStoreOrderForm.creditNotes,
          createdBy: user?.id || 1
        })
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "In-Store Order Created",
          description: `Order ${result.orderNumber} has been processed successfully`,
        });
        setShowInStoreModal(false);
        setInStoreOrderForm({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          items: [{ name: "", quantity: 1, price: 0 }],
          paymentMethod: "cash",
          notes: "",
          downPayment: "",
          paymentTerms: "monthly",
          creditNotes: ""
        });
        // Refresh orders
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating in-store order:", error);
      toast({
        title: "Error",
        description: "Failed to create in-store order. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Assign order for delivery
  const assignOrderForDelivery = async (order: Order) => {
    try {
      // First update order status to "Shipped" if not already
      if (order.status !== "Shipped") {
        await onUpdateOrder(order.id, { status: "Shipped" });
      }

      toast({
        title: "Order Assigned for Delivery",
        description: `Order ${order.orderNumber} has been marked as ready for delivery assignment`,
      });
      setShowAssignDeliveryModal(false);
      setOrderForDelivery(null);
    } catch (error) {
      console.error("Error assigning order for delivery:", error);
      toast({
        title: "Error",
        description: "Failed to assign order for delivery. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addItemToOrder = () => {
    setInStoreOrderForm(prev => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: 0 }]
    }));
  };

  const removeItemFromOrder = (index: number) => {
    setInStoreOrderForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    setInStoreOrderForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Get orders that can be assigned for delivery
  const ordersForDelivery = orders.filter(order => 
    order.status === "Processing" || order.status === "Shipped"
  );

  return (
    <div className="space-y-6">
      {/* Sales Team Special Features */}
      {isSalesTeam && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                In-Store Order Processing
              </CardTitle>
              <CardDescription>
                Process walk-in customer orders directly in the store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowInStoreModal(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New In-Store Order
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Assignment
              </CardTitle>
              <CardDescription>
                Assign orders (online & in-store) for delivery pickup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowAssignDeliveryModal(true)}
                className="w-full"
                variant="outline"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Assign Orders for Delivery ({ordersForDelivery.length})
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-orange-600">
                  {orders.filter(o => o.status === "Processing").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready for Delivery</p>
                <p className="text-2xl font-bold text-blue-600">
                  {ordersForDelivery.length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === "Delivered").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Management */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isSalesTeam ? "Sales Order Management" : "All Order Management"}
          </CardTitle>
          <CardDescription>
            {isSalesTeam 
              ? "Process customer orders, handle in-store sales, and assign deliveries" 
              : "Complete order management and customer service"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button 
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              size="sm"
            >
              All Orders
            </Button>
            <Button 
              variant={statusFilter === "processing" ? "default" : "outline"}
              onClick={() => setStatusFilter("processing")}
              size="sm"
            >
              Processing
            </Button>
            <Button 
              variant={statusFilter === "shipped" ? "default" : "outline"}
              onClick={() => setStatusFilter("shipped")}
              size="sm"
            >
              Ready for Delivery
            </Button>
            <Button 
              variant={statusFilter === "delivered" ? "default" : "outline"}
              onClick={() => setStatusFilter("delivered")}
              size="sm"
            >
              Delivered
            </Button>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order #</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono text-sm">{order.orderNumber}</td>
                    <td className="p-2">{order.customerName}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="text-xs">
                        {order.orderType === "in_store" ? "In-Store" : "Online"}
                      </Badge>
                    </td>
                    <td className="p-2 font-semibold">${order.total}</td>
                    <td className="p-2">
                      <Badge variant={
                        order.status === "Delivered" ? "default" : 
                        order.status === "Shipped" ? "secondary" : "outline"
                      }>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View
                        </Button>
                        {canEditOrders && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                const newStatus = order.status === "Processing" ? "Shipped" : 
                                                order.status === "Shipped" ? "Delivered" : order.status;
                                if (newStatus !== order.status) {
                                  onUpdateOrder(order.id, { status: newStatus });
                                }
                              }}
                            >
                              {order.status === "Processing" ? "Ship" : 
                               order.status === "Shipped" ? "Deliver" : "Updated"}
                            </Button>
                            {isSalesTeam && (order.status === "Processing" || order.status === "Shipped") && (
                              <Button 
                                size="sm" 
                                onClick={() => {
                                  setOrderForDelivery(order);
                                  setShowAssignDeliveryModal(true);
                                }}
                              >
                                Assign Delivery
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* In-Store Order Modal */}
      <Dialog open={showInStoreModal} onOpenChange={setShowInStoreModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create In-Store Order</DialogTitle>
            <DialogDescription>
              Process a walk-in customer order directly in the store
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Name *</Label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={inStoreOrderForm.customerName}
                  onChange={(e) => setInStoreOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={inStoreOrderForm.customerPhone}
                  onChange={(e) => setInStoreOrderForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="+231-XXX-XXX-XXX"
                />
              </div>
            </div>

            <div>
              <Label>Email (Optional)</Label>
              <input
                type="email"
                className="w-full p-2 border rounded-lg"
                value={inStoreOrderForm.customerEmail}
                onChange={(e) => setInStoreOrderForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="customer@email.com"
              />
            </div>

            {/* Order Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Order Items</Label>
                <Button size="sm" onClick={addItemToOrder}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              
              {inStoreOrderForm.items.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 mb-3 p-3 border rounded-lg">
                  <div>
                    <Label className="text-xs">Product Name</Label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={item.name}
                      onChange={(e) => updateOrderItem(index, 'name', e.target.value)}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Quantity</Label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Price ($)</Label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={item.price}
                      onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="flex items-end">
                    {inStoreOrderForm.items.length > 1 && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => removeItemFromOrder(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment and Notes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Payment Method</Label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={inStoreOrderForm.paymentMethod}
                  onChange={(e) => setInStoreOrderForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="credit">Credit Payment</option>
                </select>
              </div>
              <div>
                <Label>Total Amount</Label>
                <div className="p-2 bg-gray-50 rounded-lg font-bold text-lg">
                  ${inStoreOrderForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Credit Payment Terms - Only shown when credit is selected */}
            {inStoreOrderForm.paymentMethod === "credit" && (
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-semibold mb-3 text-blue-800">Credit Payment Terms</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Down Payment ($)</Label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg"
                      value={inStoreOrderForm.downPayment || ""}
                      onChange={(e) => setInStoreOrderForm(prev => ({ ...prev, downPayment: e.target.value }))}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Payment Terms</Label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={inStoreOrderForm.paymentTerms || "monthly"}
                      onChange={(e) => setInStoreOrderForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    >
                      <option value="weekly">Weekly Payments</option>
                      <option value="bi_weekly">Bi-Weekly Payments</option>
                      <option value="monthly">Monthly Payments</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <Label>Credit Notes</Label>
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    rows={2}
                    value={inStoreOrderForm.creditNotes || ""}
                    onChange={(e) => setInStoreOrderForm(prev => ({ ...prev, creditNotes: e.target.value }))}
                    placeholder="Credit terms, agreements, or special conditions..."
                  />
                </div>
                <div className="mt-3 p-3 bg-white rounded border">
                  <div className="text-sm text-gray-700">
                    <strong>Outstanding Balance:</strong> ${((inStoreOrderForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)) - parseFloat(inStoreOrderForm.downPayment || "0")).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Order Notes (Optional)</Label>
              <textarea
                className="w-full p-2 border rounded-lg"
                rows={3}
                value={inStoreOrderForm.notes}
                onChange={(e) => setInStoreOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Special requests or notes..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowInStoreModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={createInStoreOrder}
                disabled={!inStoreOrderForm.customerName || !inStoreOrderForm.customerPhone || inStoreOrderForm.items.some(item => !item.name || item.price <= 0)}
              >
                Create Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Delivery Modal */}
      <Dialog open={showAssignDeliveryModal} onOpenChange={setShowAssignDeliveryModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Orders for Delivery</DialogTitle>
            <DialogDescription>
              Select orders to mark as ready for delivery assignment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ordersForDelivery.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No orders available for delivery assignment</p>
            ) : (
              ordersForDelivery.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{order.orderNumber}</h4>
                      <Badge variant="outline" className="text-xs">
                        {order.orderType === "in_store" ? "In-Store" : "Online"}
                      </Badge>
                      <Badge variant={order.status === "Shipped" ? "secondary" : "outline"}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.customerName} - {order.deliveryAddress}</p>
                    <p className="text-sm">Total: ${order.total} | Payment: {order.paymentMethod}</p>
                  </div>
                  <Button
                    onClick={() => assignOrderForDelivery(order)}
                    size="sm"
                  >
                    Assign for Delivery
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.orderNumber}</DialogTitle>
              <DialogDescription>
                Complete order information and customer details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Information</Label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">{selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                  </div>
                </div>
                <div>
                  <Label>Order Summary</Label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p>Subtotal: ${selectedOrder.subtotal}</p>
                    <p>Delivery: ${selectedOrder.deliveryFee}</p>
                    <p className="font-semibold">Total: ${selectedOrder.total}</p>
                  </div>
                </div>
              </div>
              <div>
                <Label>Delivery Address</Label>
                <p className="bg-gray-50 p-3 rounded-lg">{selectedOrder.deliveryAddress}</p>
              </div>
              <div>
                <Label>Payment Method</Label>
                <p className="bg-gray-50 p-3 rounded-lg">{selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <Label>Blockchain Hash</Label>
                <p className="bg-gray-50 p-3 rounded-lg font-mono text-xs break-all">
                  {selectedOrder.blockchainHash}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Inventory Management Interface - For Warehouse Staff and General Manager
function InventoryManagementInterface({ user }: { user: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockFilter, setStockFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (stockFilter === "low") return product.quantity < 20;
    if (stockFilter === "out") return product.quantity === 0;
    if (stockFilter === "available") return product.quantity > 0;
    return true;
  });

  const canEditInventory = user?.role === "General Manager" || user?.role === "Warehouse Staff";

  const handleStockUpdate = async (productId: number, newQuantity: number) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Inventory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">
                  {products.filter(p => p.quantity < 20 && p.quantity > 0).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.quantity === 0).length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ${products.reduce((sum, p) => sum + (p.quantity * p.price), 0).toFixed(0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Control</CardTitle>
          <CardDescription>
            {user?.role === "Warehouse Staff" 
              ? "Manage stock levels, track inventory movements, and process receipts" 
              : "Complete inventory oversight and warehouse management"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button 
              variant={stockFilter === "all" ? "default" : "outline"}
              onClick={() => setStockFilter("all")}
              size="sm"
            >
              All Items
            </Button>
            <Button 
              variant={stockFilter === "available" ? "default" : "outline"}
              onClick={() => setStockFilter("available")}
              size="sm"
            >
              In Stock
            </Button>
            <Button 
              variant={stockFilter === "low" ? "default" : "outline"}
              onClick={() => setStockFilter("low")}
              size="sm"
            >
              Low Stock
            </Button>
            <Button 
              variant={stockFilter === "out" ? "default" : "outline"}
              onClick={() => setStockFilter("out")}
              size="sm"
            >
              Out of Stock
            </Button>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">SKU</th>
                  <th className="text-left p-2">Product Name</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Current Stock</th>
                  <th className="text-left p-2">Unit Price</th>
                  <th className="text-left p-2">Total Value</th>
                  <th className="text-left p-2">Status</th>
                  {canEditInventory && <th className="text-left p-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono text-sm">{product.sku}</td>
                    <td className="p-2 font-semibold">{product.name}</td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2">
                      <span className={`font-semibold ${
                        product.quantity === 0 ? 'text-red-600' : 
                        product.quantity < 20 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="p-2">${product.price}</td>
                    <td className="p-2 font-semibold">${(product.quantity * product.price).toFixed(2)}</td>
                    <td className="p-2">
                      <Badge variant={
                        product.quantity === 0 ? "destructive" : 
                        product.quantity < 20 ? "secondary" : "default"
                      }>
                        {product.quantity === 0 ? "Out of Stock" : 
                         product.quantity < 20 ? "Low Stock" : "In Stock"}
                      </Badge>
                    </td>
                    {canEditInventory && (
                      <td className="p-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Update Stock
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stock Update Modal */}
      {selectedProduct && canEditInventory && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Stock - {selectedProduct.name}</DialogTitle>
              <DialogDescription>
                Adjust inventory levels for this product
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Stock Level</Label>
                <p className="text-2xl font-bold">{selectedProduct.quantity} units</p>
              </div>
              <div>
                <Label>Product Information</Label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                  <p><strong>Category:</strong> {selectedProduct.category}</p>
                  <p><strong>Unit Price:</strong> ${selectedProduct.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleStockUpdate(selectedProduct.id, selectedProduct.quantity + 10)}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add 10 Units
                </Button>
                <Button 
                  onClick={() => handleStockUpdate(selectedProduct.id, selectedProduct.quantity + 50)}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add 50 Units
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleStockUpdate(selectedProduct.id, Math.max(0, selectedProduct.quantity - 10))}
                  className="flex-1"
                >
                  Remove 10 Units
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStockUpdate(selectedProduct.id, 0)}
                  className="flex-1"
                >
                  Mark as Out of Stock
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Delivery Management Interface - For Delivery Staff and General Manager
function DeliveryManagementInterface({ deliveries, user, onUpdateDelivery }: { deliveries: Delivery[], user: any, onUpdateDelivery: (id: number, updates: any) => void }) {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<Order | null>(null);
  const { toast } = useToast();

  const deliveryStatusOptions = ["Preparing", "In Transit", "Out for Delivery", "Delivered"];
  
  // Fetch orders that need delivery assignment
  useEffect(() => {
    fetchOrdersForDelivery();
  }, []);

  const fetchOrdersForDelivery = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (data.success) {
        // Filter orders that are shipped but don't have delivery assigned yet
        const ordersNeedingDelivery = data.orders.filter((order: Order) => 
          order.status === "Shipped" || order.status === "Processing"
        );
        setOrders(ordersNeedingDelivery);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const initiateDelivery = async (order: Order) => {
    try {
      const trackingNumber = `TGM${Date.now()}`;
      const deliveryData = {
        orderId: order.id,
        trackingNumber,
        status: "Preparing",
        driverName: user?.firstName + " " + user?.lastName,
        driverPhone: "+231-XXX-XXXX", // This should come from user profile
        vehicleInfo: "TGM Delivery Vehicle",
        currentLocation: "TGM Warehouse, Monrovia",
        estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        notes: `Delivery initiated by ${user?.firstName} ${user?.lastName}`
      };

      const response = await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliveryData)
      });

      if (response.ok) {
        toast({
          title: "Delivery Initiated",
          description: `Delivery ${trackingNumber} has been created for order ${order.orderNumber}`,
        });
        setShowInitiateModal(false);
        setSelectedOrderForDelivery(null);
        // Refresh deliveries
        window.location.reload();
      }
    } catch (error) {
      console.error("Error initiating delivery:", error);
      toast({
        title: "Error",
        description: "Failed to initiate delivery. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => 
    statusFilter === "all" || delivery.status.toLowerCase() === statusFilter
  );

  const canEditDeliveries = user?.role === "General Manager" || user?.role === "Delivery Staff";
  const isDeliveryStaff = user?.role === "Delivery Staff";

  return (
    <div className="space-y-6">
      {/* Delivery Staff Special Section - Orders Awaiting Delivery */}
      {isDeliveryStaff && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Orders Awaiting Delivery Assignment</span>
              <Button
                onClick={() => setShowInitiateModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Initiate New Delivery
              </Button>
            </CardTitle>
            <CardDescription>
              These orders are ready to be assigned for delivery. Click "Initiate Delivery" to take responsibility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders awaiting delivery assignment</p>
            ) : (
              <div className="grid gap-3">
                {orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{order.orderNumber}</h4>
                      <p className="text-sm text-gray-600">{order.customerName} - {order.deliveryAddress}</p>
                      <p className="text-sm">Total: ${order.total} | Status: {order.status}</p>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedOrderForDelivery(order);
                        setShowInitiateModal(true);
                      }}
                      size="sm"
                    >
                      Initiate Delivery
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delivery Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold">{deliveries.length}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {deliveries.filter(d => d.status === "In Transit").length}
                </p>
              </div>
              <Navigation className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out for Delivery</p>
                <p className="text-2xl font-bold text-orange-600">
                  {deliveries.filter(d => d.status === "Out for Delivery").length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {deliveries.filter(d => d.status === "Delivered").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Deliveries Section - For Delivery Staff */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isDeliveryStaff ? "My Assigned Deliveries" : "All Delivery Operations"}
          </CardTitle>
          <CardDescription>
            {isDeliveryStaff 
              ? "Manage and track your assigned deliveries through completion" 
              : "Complete delivery fleet management and logistics oversight"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button 
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              size="sm"
            >
              All Deliveries
            </Button>
            <Button 
              variant={statusFilter === "preparing" ? "default" : "outline"}
              onClick={() => setStatusFilter("preparing")}
              size="sm"
            >
              Preparing
            </Button>
            <Button 
              variant={statusFilter === "in transit" ? "default" : "outline"}
              onClick={() => setStatusFilter("in transit")}
              size="sm"
            >
              In Transit
            </Button>
            <Button 
              variant={statusFilter === "out for delivery" ? "default" : "outline"}
              onClick={() => setStatusFilter("out for delivery")}
              size="sm"
            >
              Out for Delivery
            </Button>
            <Button 
              variant={statusFilter === "delivered" ? "default" : "outline"}
              onClick={() => setStatusFilter("delivered")}
              size="sm"
            >
              Delivered
            </Button>
          </div>

          {/* Deliveries Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tracking #</th>
                  <th className="text-left p-2">Order ID</th>
                  <th className="text-left p-2">Driver</th>
                  <th className="text-left p-2">Current Location</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">ETA</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map(delivery => (
                  <tr key={delivery.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono text-sm">{delivery.trackingNumber}</td>
                    <td className="p-2">#{delivery.orderId}</td>
                    <td className="p-2">
                      <div>
                        <p className="font-semibold">{delivery.driverName}</p>
                        <p className="text-xs text-gray-600">{delivery.driverPhone}</p>
                      </div>
                    </td>
                    <td className="p-2">{delivery.currentLocation}</td>
                    <td className="p-2">
                      <Badge variant={
                        delivery.status === "Delivered" ? "default" : 
                        delivery.status === "Out for Delivery" ? "secondary" : 
                        delivery.status === "In Transit" ? "outline" : "destructive"
                      }>
                        {delivery.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {delivery.estimatedArrival ? new Date(delivery.estimatedArrival).toLocaleString() : 'TBD'}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedDelivery(delivery)}
                        >
                          View
                        </Button>
                        {canEditDeliveries && delivery.status !== "Delivered" && (
                          <Button 
                            size="sm" 
                            onClick={() => {
                              const nextStatus = delivery.status === "Preparing" ? "In Transit" :
                                              delivery.status === "In Transit" ? "Out for Delivery" :
                                              delivery.status === "Out for Delivery" ? "Delivered" : delivery.status;
                              if (nextStatus !== delivery.status) {
                                onUpdateDelivery(delivery.id, { 
                                  status: nextStatus,
                                  actualDelivery: nextStatus === "Delivered" ? new Date().toISOString() : null
                                });
                              }
                            }}
                          >
                            {delivery.status === "Preparing" ? "Start Transit" :
                             delivery.status === "In Transit" ? "Out for Delivery" :
                             delivery.status === "Out for Delivery" ? "Mark Delivered" : "Update"}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Initiate Delivery Modal */}
      <Dialog open={showInitiateModal} onOpenChange={setShowInitiateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate New Delivery</DialogTitle>
            <DialogDescription>
              {selectedOrderForDelivery 
                ? `Confirm delivery initiation for order ${selectedOrderForDelivery.orderNumber}`
                : "Select an order to initiate delivery"}
            </DialogDescription>
          </DialogHeader>
          {selectedOrderForDelivery ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Order Details</h4>
                <p><strong>Order:</strong> {selectedOrderForDelivery.orderNumber}</p>
                <p><strong>Customer:</strong> {selectedOrderForDelivery.customerName}</p>
                <p><strong>Phone:</strong> {selectedOrderForDelivery.customerPhone}</p>
                <p><strong>Address:</strong> {selectedOrderForDelivery.deliveryAddress}</p>
                <p><strong>Total:</strong> ${selectedOrderForDelivery.total}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Delivery Assignment</h4>
                <p><strong>Driver:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Department:</strong> {user?.department}</p>
                <p><strong>Initial Status:</strong> Preparing</p>
                <p><strong>Estimated Delivery:</strong> Within 24 hours</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setShowInitiateModal(false);
                  setSelectedOrderForDelivery(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={() => initiateDelivery(selectedOrderForDelivery)}>
                  Confirm & Initiate Delivery
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p>Select an order from the list above to initiate delivery, or choose from available orders:</p>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {orders.map(order => (
                  <div 
                    key={order.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedOrderForDelivery(order)}
                  >
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    <p className="text-sm">Total: ${order.total}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delivery Detail Modal */}
      {selectedDelivery && (
        <Dialog open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Delivery Details - {selectedDelivery.trackingNumber}</DialogTitle>
              <DialogDescription>
                Complete delivery information and tracking history
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Driver Information</Label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">{selectedDelivery.driverName}</p>
                    <p className="text-sm text-gray-600">{selectedDelivery.driverPhone}</p>
                    <p className="text-sm text-gray-600">{selectedDelivery.vehicleInfo}</p>
                  </div>
                </div>
                <div>
                  <Label>Delivery Status</Label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Badge className="mb-2">{selectedDelivery.status}</Badge>
                    <p className="text-sm">Current: {selectedDelivery.currentLocation}</p>
                    <p className="text-sm">ETA: {selectedDelivery.estimatedArrival ? new Date(selectedDelivery.estimatedArrival).toLocaleString() : 'TBD'}</p>
                  </div>
                </div>
              </div>
              <div>
                <Label>Delivery Notes</Label>
                <p className="bg-gray-50 p-3 rounded-lg">{selectedDelivery.notes || "No notes available"}</p>
              </div>
              {selectedDelivery.actualDelivery && (
                <div>
                  <Label>Delivery Completed</Label>
                  <p className="bg-green-50 p-3 rounded-lg text-green-800">
                    Delivered on {new Date(selectedDelivery.actualDelivery).toLocaleString()}
                  </p>
                </div>
              )}
              {canEditDeliveries && selectedDelivery.status !== "Delivered" && (
                <div>
                  <Label>Quick Status Update</Label>
                  <div className="flex gap-2 mt-2">
                    {deliveryStatusOptions.map(status => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedDelivery.status === status ? "default" : "outline"}
                        onClick={() => {
                          onUpdateDelivery(selectedDelivery.id, {
                            status,
                            actualDelivery: status === "Delivered" ? new Date().toISOString() : null
                          });
                          setSelectedDelivery(null);
                        }}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Credit Management Interface - For Sales Team and General Manager
function CreditManagementInterface({ user }: { user: any }) {
  const [creditors, setCreditors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreditor, setSelectedCreditor] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentAmount: "",
    paymentMethod: "cash",
    transactionId: "",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCreditors();
  }, []);

  const fetchCreditors = async () => {
    try {
      const response = await fetch("/api/creditors");
      const data = await response.json();
      if (data.success) {
        setCreditors(data.creditors);
      }
    } catch (error) {
      console.error("Error fetching creditors:", error);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async () => {
    if (!selectedCreditor || !paymentForm.paymentAmount) return;

    try {
      const response = await fetch(`/api/creditors/${selectedCreditor.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAmount: parseFloat(paymentForm.paymentAmount),
          paymentMethod: paymentForm.paymentMethod,
          transactionId: paymentForm.transactionId,
          notes: paymentForm.notes,
          processedBy: user?.id || 1
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Payment Processed",
          description: `Payment of $${paymentForm.paymentAmount} processed successfully`,
        });
        setShowPaymentModal(false);
        setPaymentForm({
          paymentAmount: "",
          paymentMethod: "cash",
          transactionId: "",
          notes: ""
        });
        fetchCreditors(); // Refresh creditors list
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-yellow-100 text-yellow-800";
      case "paid_off": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Credit Management</CardTitle>
          <CardDescription>
            Manage customer credit accounts and process payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creditors.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No credit accounts found</p>
                <p className="text-sm text-gray-500">Credit accounts will appear here when customers make credit purchases</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Customer</th>
                      <th className="text-left p-3">Order ID</th>
                      <th className="text-left p-3">Total Amount</th>
                      <th className="text-left p-3">Outstanding</th>
                      <th className="text-left p-3">Next Payment</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditors.map(creditor => (
                      <tr key={creditor.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-semibold">{creditor.customerName}</p>
                            <p className="text-sm text-gray-600">{creditor.customerPhone}</p>
                            {creditor.customerEmail && (
                              <p className="text-xs text-gray-500">{creditor.customerEmail}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-mono text-sm">#{creditor.orderId}</td>
                        <td className="p-3 font-semibold">${creditor.totalAmount}</td>
                        <td className="p-3 font-semibold text-red-600">${creditor.outstandingBalance}</td>
                        <td className="p-3 text-sm">
                          {creditor.nextPaymentDate ? formatDate(creditor.nextPaymentDate) : "N/A"}
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(creditor.status || "active")}>
                            {creditor.status || "Active"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedCreditor(creditor)}
                            >
                              View Details
                            </Button>
                            {parseFloat(creditor.outstandingBalance) > 0 && (
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setSelectedCreditor(creditor);
                                  setShowPaymentModal(true);
                                }}
                              >
                                Process Payment
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Creditor Details Modal */}
      {selectedCreditor && !showPaymentModal && (
        <Dialog open={!!selectedCreditor} onOpenChange={() => setSelectedCreditor(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Credit Account Details</DialogTitle>
              <DialogDescription>
                Complete credit information for {selectedCreditor.customerName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Information</Label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">{selectedCreditor.customerName}</p>
                    <p className="text-sm text-gray-600">{selectedCreditor.customerPhone}</p>
                    {selectedCreditor.customerEmail && (
                      <p className="text-sm text-gray-600">{selectedCreditor.customerEmail}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Credit Summary</Label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold">${selectedCreditor.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment:</span>
                      <span className="text-green-600">${selectedCreditor.downPayment}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Outstanding:</span>
                      <span className="font-semibold text-red-600">${selectedCreditor.outstandingBalance}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label>Payment Terms</Label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm">Payment Schedule: </span>
                      <span className="font-medium capitalize">{selectedCreditor.paymentTerms?.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-sm">Installment Amount: </span>
                      <span className="font-medium">${selectedCreditor.installmentAmount}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm">Next Payment Due: </span>
                    <span className="font-medium">
                      {selectedCreditor.nextPaymentDate ? formatDate(selectedCreditor.nextPaymentDate) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              {selectedCreditor.notes && (
                <div>
                  <Label>Credit Notes</Label>
                  <p className="bg-gray-50 p-3 rounded-lg">{selectedCreditor.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Payment Processing Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Record payment for {selectedCreditor?.customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p><strong>Outstanding Balance:</strong> ${selectedCreditor?.outstandingBalance}</p>
              <p><strong>Next Payment Due:</strong> ${selectedCreditor?.installmentAmount}</p>
            </div>
            
            <div>
              <Label>Payment Amount ($) *</Label>
              <Input
                type="number"
                value={paymentForm.paymentAmount}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentAmount: e.target.value }))}
                placeholder="0.00"
                step="0.01"
                min="0"
                max={selectedCreditor?.outstandingBalance}
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <Select 
                value={paymentForm.paymentMethod} 
                onValueChange={(value) => setPaymentForm(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentForm.paymentMethod === "mobile_money" && (
              <div>
                <Label>Transaction ID</Label>
                <Input
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                  placeholder="Enter mobile money transaction ID"
                />
              </div>
            )}

            <div>
              <Label>Payment Notes (Optional)</Label>
              <Textarea
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this payment..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={processPayment}
                disabled={!paymentForm.paymentAmount || parseFloat(paymentForm.paymentAmount) <= 0}
              >
                Process Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}