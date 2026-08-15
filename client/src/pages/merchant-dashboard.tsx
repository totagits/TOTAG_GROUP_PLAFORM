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
  Settings
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInitiatingDelivery, setIsInitiatingDelivery] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    driverName: "",
    driverPhone: "",
    vehicleInfo: "",
    estimatedArrival: "",
    notes: ""
  });
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
      fetchOrders();
      fetchDeliveries();
    } catch (error) {
      localStorage.removeItem("merchantUser");
      window.location.href = "/merchant-login";
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();
      if (result.success) {
        setOrders(result.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries');
      const result = await response.json();
      if (result.success) {
        setDeliveries(result.deliveries);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    }
  };

  const initiateDelivery = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          driverName: deliveryForm.driverName,
          driverPhone: deliveryForm.driverPhone,
          vehicleInfo: deliveryForm.vehicleInfo,
          estimatedArrival: deliveryForm.estimatedArrival,
          notes: deliveryForm.notes
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Delivery Initiated",
          description: `Delivery started for order ${selectedOrder.orderNumber}`,
        });
        
        // Refresh data
        fetchOrders();
        fetchDeliveries();
        
        // Reset form
        setIsInitiatingDelivery(false);
        setSelectedOrder(null);
        setDeliveryForm({
          driverName: "",
          driverPhone: "",
          vehicleInfo: "",
          estimatedArrival: "",
          notes: ""
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to initiate delivery",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate delivery",
        variant: "destructive",
      });
    }
  };

  const updateDeliveryStatus = async (deliveryId: number, newStatus: string, location?: string) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          currentLocation: location || ""
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Delivery status updated to ${newStatus}`,
        });
        fetchDeliveries();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update delivery status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "packed": return "bg-yellow-100 text-yellow-800";
      case "in_transit": return "bg-orange-100 text-orange-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return Package;
      case "packed": return Clock;
      case "in_transit": return Truck;
      case "delivered": return CheckCircle;
      default: return Package;
    }
  };

  const filterOrders = (status: string) => {
    if (status === "pending") {
      return orders.filter(order => !deliveries.find(d => d.orderId === order.id));
    } else if (status === "in_transit") {
      return orders.filter(order => 
        deliveries.find(d => d.orderId === order.id && d.status === "in_transit")
      );
    } else if (status === "delivered") {
      return orders.filter(order => 
        deliveries.find(d => d.orderId === order.id && d.status === "delivered")
      );
    }
    return orders;
  };

  const getDeliveryForOrder = (orderId: number) => {
    return deliveries.find(d => d.orderId === orderId);
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
                  <h1 className="text-xl font-bold text-gray-900">TGM Merchant Dashboard</h1>
                  <p className="text-sm text-gray-500">Delivery Management Center</p>
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
          
          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {[
                  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                  { id: "orders", label: "Orders", icon: ShoppingCart },
                  { id: "inventory", label: "Inventory", icon: Warehouse },
                  { id: "users", label: "Staff", icon: Users },
                  { id: "deliveries", label: "Deliveries", icon: Truck },
                  { id: "reports", label: "Reports", icon: FileText },
                  { id: "settings", label: "Settings", icon: Settings }
                ].map((tab) => (
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
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
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
                      <span>Check Inventory</span>
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
                      onClick={() => setActiveTab("reports")}
                    >
                      <FileText className="h-6 w-6" />
                      <span>View Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activity and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-gray-500">Order #ORD-2025-001 from Sarah Johnson</p>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Low stock alert</p>
                        <p className="text-xs text-gray-500">Premium Rice (10 units remaining)</p>
                      </div>
                      <span className="text-xs text-gray-500">15 min ago</span>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Delivery completed</p>
                        <p className="text-xs text-gray-500">Order #ORD-2025-002 delivered to Monrovia</p>
                      </div>
                      <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Management Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: "pending", label: "Pending Orders", count: filterOrders("pending").length },
                  { id: "in_transit", label: "In Transit", count: filterOrders("in_transit").length },
                  { id: "delivered", label: "Delivered", count: filterOrders("delivered").length },
                  { id: "all", label: "All Orders", count: orders.length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-purple-700 shadow"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {orders.map(order => {
              const delivery = getDeliveryForOrder(order.id);
              const StatusIcon = getStatusIcon(delivery?.status || "confirmed");
              
              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="h-5 w-5 text-gray-500" />
                            <span className="font-semibold text-lg">{order.orderNumber}</span>
                            <Badge className={getStatusColor(delivery?.status || "confirmed")}>
                              {delivery?.status || "Confirmed"}
                            </Badge>
                          </div>
                          {delivery && (
                            <span className="text-sm text-gray-500">
                              Tracking: {delivery.trackingNumber}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{order.customerName}</p>
                              <p className="text-xs text-gray-500">{order.customerEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{order.customerPhone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">${order.total}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{order.deliveryAddress}</span>
                        </div>

                        {delivery && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium mb-2">Delivery Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Driver:</span> {delivery.driverName}
                              </div>
                              <div>
                                <span className="text-gray-600">Phone:</span> {delivery.driverPhone}
                              </div>
                              <div>
                                <span className="text-gray-600">Vehicle:</span> {delivery.vehicleInfo}
                              </div>
                              <div>
                                <span className="text-gray-600">Location:</span> {delivery.currentLocation}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        {!delivery ? (
                          <Dialog open={isInitiatingDelivery && selectedOrder?.id === order.id} onOpenChange={(open) => {
                            setIsInitiatingDelivery(open);
                            if (open) setSelectedOrder(order);
                            else setSelectedOrder(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Initiate Delivery
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Initiate Delivery</DialogTitle>
                                <DialogDescription>
                                  Set up delivery details for order {order.orderNumber}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="driverName">Driver Name</Label>
                                  <Input
                                    id="driverName"
                                    value={deliveryForm.driverName}
                                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, driverName: e.target.value }))}
                                    placeholder="Enter driver name"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="driverPhone">Driver Phone</Label>
                                  <Input
                                    id="driverPhone"
                                    value={deliveryForm.driverPhone}
                                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, driverPhone: e.target.value }))}
                                    placeholder="+231-XXX-XXX-XXX"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="vehicleInfo">Vehicle Information</Label>
                                  <Input
                                    id="vehicleInfo"
                                    value={deliveryForm.vehicleInfo}
                                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, vehicleInfo: e.target.value }))}
                                    placeholder="Vehicle type and license plate"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="estimatedArrival">Estimated Arrival</Label>
                                  <Input
                                    id="estimatedArrival"
                                    type="datetime-local"
                                    value={deliveryForm.estimatedArrival}
                                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, estimatedArrival: e.target.value }))}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="notes">Notes</Label>
                                  <Textarea
                                    id="notes"
                                    value={deliveryForm.notes}
                                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Additional delivery instructions"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsInitiatingDelivery(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={initiateDelivery} className="bg-purple-600 hover:bg-purple-700">
                                  Start Delivery
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <div className="space-y-2">
                            {delivery.status === "in_transit" && (
                              <Button
                                size="sm"
                                onClick={() => updateDeliveryStatus(delivery.id, "delivered", order.deliveryAddress)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Delivered
                              </Button>
                            )}
                            {delivery.status === "confirmed" && (
                              <Button
                                size="sm"
                                onClick={() => updateDeliveryStatus(delivery.id, "in_transit", "En route")}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                <Truck className="h-4 w-4 mr-2" />
                                Start Transit
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filterOrders(activeTab).length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {activeTab === "pending" && "All orders have been assigned for delivery."}
                  {activeTab === "in_transit" && "No orders are currently in transit."}
                  {activeTab === "delivered" && "No completed deliveries yet."}
                  {activeTab === "all" && "No orders have been placed yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}