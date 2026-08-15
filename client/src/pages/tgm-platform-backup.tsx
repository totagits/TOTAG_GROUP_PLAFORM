import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Package,
  BarChart3,
  ShoppingCart,
  Truck,
  Users,
  MapPin,
  TrendingUp,
  Database,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Building2,
  Store,
  Calendar,
  Star,
  Activity,
  Target,
  Globe,
  PieChart,
  BarChart
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function TGMPlatformPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("wholesale");

  // Enhanced v2 features with interoperability
  const [showWholesaleForm, setShowWholesaleForm] = useState(false);
  const [showRetailForm, setShowRetailForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [logisticsSubTab, setLogisticsSubTab] = useState('delivery');
  
  // Interoperability functions
  const handleViewWholesaleOrders = () => {
    setActiveTab("wholesale");
    toast({
      title: "Navigation",
      description: "Switched to Wholesale Distribution tab",
    });
  };

  const handleViewInventory = () => {
    setActiveTab("inventory");
    toast({
      title: "Navigation", 
      description: "Switched to Inventory Management tab",
    });
  };

  const handleViewSuppliers = () => {
    setActiveTab("suppliers");
    toast({
      title: "Navigation",
      description: "Switched to Supplier Partnerships tab",
    });
  };

  const handleViewLogistics = () => {
    setActiveTab("logistics");
    toast({
      title: "Navigation",
      description: "Switched to Logistics & Delivery tab",
    });
  };

  const handleCreateOrder = (orderType: string) => {
    if (orderType === "wholesale") {
      setShowWholesaleForm(true);
    } else if (orderType === "retail") {
      setShowRetailForm(true);
    }
  };

  // Mock data for demo purposes
  const dashboardStats = {
    totalProducts: 2847,
    totalOrders: 156,
    totalSuppliers: 89,
    pendingDeliveries: 23,
    lowStockItems: 12,
    monthlyRevenue: 145320
  };

  const inventoryData = [
    { id: 1, sku: "TGM-001", productName: "Premium Rice 50kg", quantity: 150, price: 45.00, category: "Food", status: "In Stock" },
    { id: 2, sku: "TGM-002", productName: "Construction Steel Bars", quantity: 5, price: 120.00, category: "Construction", status: "Low Stock" },
    { id: 3, sku: "TGM-003", productName: "Office Paper A4 (Pack)", quantity: 300, price: 8.50, category: "Office", status: "In Stock" },
    { id: 4, sku: "TGM-004", productName: "Cooking Oil 5L", quantity: 0, price: 18.00, category: "Food", status: "Out of Stock" },
    { id: 5, sku: "TGM-005", productName: "Cement Bags 50kg", quantity: 200, price: 12.50, category: "Construction", status: "In Stock" }
  ];

  const ordersData = [
    { id: 1, customer: "ABC Trading Ltd", items: 5, total: 1250.00, status: "Processing", date: "2024-01-15" },
    { id: 2, customer: "XYZ Construction", items: 12, total: 2800.00, status: "Shipped", date: "2024-01-14" },
    { id: 3, customer: "Quick Mart", items: 8, total: 680.00, status: "Delivered", date: "2024-01-13" },
    { id: 4, customer: "Office Plus", items: 15, total: 450.00, status: "Pending", date: "2024-01-15" }
  ];

  const suppliersData = [
    { id: 1, name: "West Africa Foods Ltd", email: "contact@wafoods.com", phone: "+231-123-4567", location: "Monrovia, Liberia" },
    { id: 2, name: "Steel Works International", email: "sales@steelworks.com", phone: "+231-234-5678", location: "Freetown, Sierra Leone" },
    { id: 3, name: "Office Solutions Group", email: "info@officesolutions.com", phone: "+231-345-6789", location: "Accra, Ghana" }
  ];

  const logisticsData = [
    { id: 1, orderId: 1, location: "Monrovia Port", latitude: 6.3106, longitude: -10.8048, status: "In Transit" },
    { id: 2, orderId: 2, location: "Freetown Warehouse", latitude: 8.4657, longitude: -13.2317, status: "Processing" },
    { id: 3, orderId: 3, location: "Accra Distribution", latitude: 5.6037, longitude: -0.1870, status: "Delivered" }
  ];

  // Enhanced v2 data structures
  const wholesaleOrders = [
    { id: 1, partner: "Regional Distribution Co.", product: "Premium Rice 50kg", quantity: 500, value: 22500, status: "Processing", date: "2024-01-15" },
    { id: 2, partner: "West Africa Trading", product: "Construction Steel Bars", quantity: 100, value: 12000, status: "Shipped", date: "2024-01-14" },
    { id: 3, partner: "Export Partners Ltd", product: "Office Paper A4", quantity: 1000, value: 8500, status: "Delivered", date: "2024-01-13" }
  ];

  const retailSales = [
    { id: 1, outlet: "Downtown Store", product: "Cooking Oil 5L", quantity: 25, value: 450, saleDate: "2024-01-15" },
    { id: 2, outlet: "Market Plaza", product: "Cement Bags 50kg", quantity: 40, value: 500, saleDate: "2024-01-15" },
    { id: 3, outlet: "Shopping Center", product: "Premium Rice 50kg", quantity: 15, value: 675, saleDate: "2024-01-14" }
  ];

  const supplierPartnerships = [
    { id: 1, name: "Global Supply Chain Ltd", category: "Food Products", rating: 4.8, orders: 156, value: 2400000 },
    { id: 2, name: "Industrial Materials Inc", category: "Construction", rating: 4.6, orders: 89, value: 1800000 },
    { id: 3, name: "Office Solutions Pro", category: "Office Supplies", rating: 4.9, orders: 234, value: 980000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/general-merchandise">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portal
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">TGM Platform Demo</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">Live Demo</Badge>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
            <TabsTrigger value="wholesale" className="flex items-center justify-center space-x-1 text-xs sm:text-sm px-2 py-2">
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Wholesale</span>
              <span className="sm:hidden">Wholesale</span>
            </TabsTrigger>
            <TabsTrigger value="retail" className="flex items-center justify-center space-x-1 text-xs sm:text-sm px-2 py-2">
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Retail</span>
              <span className="sm:hidden">Retail</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center justify-center space-x-1 text-xs sm:text-sm px-2 py-2">
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Inventory</span>
              <span className="sm:hidden">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center justify-center space-x-1 text-xs sm:text-sm px-2 py-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Suppliers</span>
              <span className="sm:hidden">Suppliers</span>
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center justify-center space-x-1 text-xs sm:text-sm px-2 py-2">
              <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Logistics</span>
              <span className="sm:hidden">Logistics</span>
            </TabsTrigger>
          </TabsList>

          {/* Wholesale Distribution Tab */}
          <TabsContent value="wholesale" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Wholesale Distribution</h2>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowWholesaleForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Wholesale Order
                </Button>
              </div>

              {/* Wholesale Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Partners</p>
                        <p className="text-2xl font-bold text-gray-900">45</p>
                      </div>
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Monthly Volume</p>
                        <p className="text-2xl font-bold text-gray-900">2,847</p>
                      </div>
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">$43,000</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Growth</p>
                        <p className="text-2xl font-bold text-green-600">+18%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Wholesale Orders Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Wholesale Orders</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {wholesaleOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.partner}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.value.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge 
                                variant={
                                  order.status === 'Delivered' ? 'default' :
                                  order.status === 'Shipped' ? 'secondary' :
                                  'outline'
                                }
                                className={
                                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={handleViewLogistics}
                                  title="Track in Logistics"
                                >
                                  <Truck className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Wholesale Order Form Modal */}
              {showWholesaleForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>New Wholesale Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Partner</label>
                          <input 
                            type="text" 
                            placeholder="Partner Company Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Product</option>
                            <option value="rice">Premium Rice 50kg</option>
                            <option value="steel">Construction Steel Bars</option>
                            <option value="paper">Office Paper A4</option>
                            <option value="carib-beer">Large Carib Beer Cartoon</option>
                            <option value="rockstone-wine">Rockstone Tonic Wine Cartoon</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                          <input 
                            type="number" 
                            placeholder="Order quantity"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setShowWholesaleForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={(e) => {
                              e.preventDefault();
                              toast({
                                title: "Wholesale Order Created",
                                description: "Order has been added to the system and partner notified.",
                              });
                              setShowWholesaleForm(false);
                            }}
                          >
                            Create Order
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Retail Operations Tab */}
          <TabsContent value="retail" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Retail Operations</h2>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setShowRetailForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Record Sale
                </Button>
              </div>

              {/* Retail Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Outlets</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                      </div>
                      <Store className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Daily Sales</p>
                        <p className="text-2xl font-bold text-gray-900">156</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">$1,625</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Growth</p>
                        <p className="text-2xl font-bold text-green-600">+12%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Retail Sales Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Retail Sales</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outlet</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {retailSales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.outlet}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.product}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.value}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.saleDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Retail Sale Form Modal */}
              {showRetailForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Record Retail Sale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Outlet</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">Select Outlet</option>
                            <option value="downtown">Downtown Store</option>
                            <option value="plaza">Market Plaza</option>
                            <option value="center">Shopping Center</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">Select Product</option>
                            <option value="oil">Cooking Oil 5L</option>
                            <option value="cement">Cement Bags 50kg</option>
                            <option value="rice">Premium Rice 50kg</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Sold</label>
                          <input 
                            type="number" 
                            placeholder="Units sold"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setShowRetailForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.preventDefault();
                              toast({
                                title: "Sale Recorded",
                                description: "Retail sale has been recorded and inventory updated.",
                              });
                              setShowRetailForm(false);
                            }}
                          >
                            Record Sale
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Inventory Management</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Inventory Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventoryData.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sku}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge 
                                variant={item.status === 'In Stock' ? 'default' : item.status === 'Low Stock' ? 'secondary' : 'destructive'}
                                className={
                                  item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                                  item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }
                              >
                                {item.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleCreateOrder("wholesale")}
                                  title="Create Wholesale Order"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={handleViewSuppliers}
                                  title="View Suppliers"
                                >
                                  <Users className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Retail Operations Tab */}
          <TabsContent value="retail" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Retail Operations</h2>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setShowRetailForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Record Sale
                </Button>
              </div>

              {/* Retail Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Outlets</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                      </div>
                      <Store className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Daily Sales</p>
                        <p className="text-2xl font-bold text-gray-900">156</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">$1,625</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Growth</p>
                        <p className="text-2xl font-bold text-green-600">+12%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Retail Sales Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Retail Sales</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outlet</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {retailSales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.outlet}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.product}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.value}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.saleDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Retail Sale Form Modal */}
              {showRetailForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Record Retail Sale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Outlet</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">Select Outlet</option>
                            <option value="downtown">Downtown Store</option>
                            <option value="plaza">Market Plaza</option>
                            <option value="center">Shopping Center</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">Select Product</option>
                            <option value="oil">Cooking Oil 5L</option>
                            <option value="cement">Cement Bags 50kg</option>
                            <option value="rice">Premium Rice 50kg</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Sold</label>
                          <input 
                            type="number" 
                            placeholder="Units sold"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setShowRetailForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.preventDefault();
                              toast({
                                title: "Sale Recorded",
                                description: "Retail sale has been recorded and inventory updated.",
                              });
                              setShowRetailForm(false);
                            }}
                          >
                            Record Sale
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </TabsContent>



          {/* Enhanced Suppliers Partnerships Tab */}
          <TabsContent value="suppliers" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Supplier Partnerships</h2>
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowSupplierForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>

              {/* Partnership Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Partners</p>
                        <p className="text-2xl font-bold text-gray-900">38</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                        <p className="text-2xl font-bold text-gray-900">4.7</p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">479</p>
                      </div>
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Partnership Value</p>
                        <p className="text-2xl font-bold text-gray-900">$5.2M</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Supplier Partnership Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {supplierPartnerships.map((partner) => (
                  <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {partner.name}
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{partner.rating}</span>
                        </div>
                      </CardTitle>
                      <Badge variant="outline" className="w-fit">{partner.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Orders:</span>
                          <span className="font-medium">{partner.orders}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Partnership Value:</span>
                          <span className="font-medium text-green-600">${(partner.value/1000000).toFixed(1)}M</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((partner.rating / 5) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Activity className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Supplier Contact List */}
              <Card>
                <CardHeader>
                  <CardTitle>All Supplier Contacts</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {suppliersData.map((supplier) => (
                          <tr key={supplier.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Users className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Supplier Form Modal */}
              {showSupplierForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Add New Supplier Partner</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                          <input 
                            type="text" 
                            placeholder="Supplier company name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="">Select Category</option>
                            <option value="food">Food Products</option>
                            <option value="construction">Construction Materials</option>
                            <option value="office">Office Supplies</option>
                            <option value="electronics">Electronics</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input 
                              type="email" 
                              placeholder="contact@supplier.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input 
                              type="tel" 
                              placeholder="+231-xxx-xxxx"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <textarea 
                            rows={3}
                            placeholder="Complete address including city and country"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          ></textarea>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setShowSupplierForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                            onClick={(e) => {
                              e.preventDefault();
                              toast({
                                title: "Supplier Added",
                                description: "New supplier partnership has been created successfully.",
                              });
                              setShowSupplierForm(false);
                            }}
                          >
                            Add Supplier
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Logistics Tab */}
          <TabsContent value="logistics" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Logistics & Delivery</h2>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Track Delivery
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => setShowSupplierForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Supplier
                  </Button>
                </div>
              </div>

              {/* Sub-navigation for Logistics sections */}
              <div className="flex space-x-4 mb-6 border-b">
                <button 
                  className={`pb-2 px-1 font-medium ${logisticsSubTab === 'delivery' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setLogisticsSubTab('delivery')}
                >
                  Delivery Tracking
                </button>
                <button 
                  className={`pb-2 px-1 font-medium ${logisticsSubTab === 'suppliers' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setLogisticsSubTab('suppliers')}
                >
                  Supplier Partnerships
                </button>
              </div>

              {/* Delivery Tracking Section */}
              {logisticsSubTab === 'delivery' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                            <p className="text-2xl font-bold text-gray-900">23</p>
                          </div>
                          <Truck className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Completed Today</p>
                            <p className="text-2xl font-bold text-gray-900">15</p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">On Time Rate</p>
                            <p className="text-2xl font-bold text-gray-900">94%</p>
                          </div>
                          <Clock className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Coverage</p>
                            <p className="text-2xl font-bold text-gray-900">3 Countries</p>
                          </div>
                          <Globe className="h-8 w-8 text-indigo-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Active Deliveries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {logisticsData.map((delivery) => (
                            <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">Order #{delivery.orderId.toString().padStart(4, '0')}</p>
                                <p className="text-sm text-gray-600">{delivery.location}</p>
                              </div>
                              <Badge 
                                variant={delivery.status === 'Delivered' ? 'default' : 'secondary'}
                                className={
                                  delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                  delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {delivery.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Interactive Map</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg font-medium">West Africa Region</p>
                            <p className="text-sm text-gray-500">Real-time delivery tracking across Liberia, Sierra Leone, and Ghana</p>
                            <Button className="mt-4" onClick={() => {
                              toast({
                                title: "Map Loading",
                                description: "Interactive map with real-time GPS tracking would load here in the full platform.",
                              });
                            }}>
                              <MapPin className="h-4 w-4 mr-2" />
                              View Full Map
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Supplier Partnerships Section */}
              {logisticsSubTab === 'suppliers' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
                            <p className="text-2xl font-bold text-gray-900">89</p>
                          </div>
                          <Users className="h-8 w-8 text-orange-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Active Partners</p>
                            <p className="text-2xl font-bold text-gray-900">67</p>
                          </div>
                          <Star className="h-8 w-8 text-yellow-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Partnership Value</p>
                            <p className="text-2xl font-bold text-gray-900">$127K</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Performance</p>
                            <p className="text-2xl font-bold text-gray-900">92%</p>
                          </div>
                          <Target className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Suppliers Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Supplier Partnerships</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partnership Value</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {supplierPartnerships.map((supplier) => (
                              <tr key={supplier.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                    {supplier.rating}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${supplier.value.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge 
                                    variant="default"
                                    className="bg-green-100 text-green-800"
                                  >
                                    Active
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Activity className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Supplier Form Modal */}
              {showSupplierForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Add New Supplier</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name</label>
                          <input 
                            type="text" 
                            placeholder="Company Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="">Select Category</option>
                            <option value="food">Food Products</option>
                            <option value="construction">Construction Materials</option>
                            <option value="office">Office Supplies</option>
                          </select>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setShowSupplierForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 bg-orange-600 hover:bg-orange-700"
                            onClick={(e) => {
                              e.preventDefault();
                              toast({
                                title: "Supplier Added",
                                description: "New supplier partnership has been created successfully.",
                              });
                              setShowSupplierForm(false);
                            }}
                          >
                            Add Supplier
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Logistics & Delivery Tab */}
          <TabsContent value="logistics" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Logistics & Delivery</h2>
                <Button 
                  size="sm" 
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Track Shipment
                </Button>
              </div>

              {/* Quick Actions Panel */}
              <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleViewWholesaleOrders}
                        className="flex items-center space-x-1"
                      >
                        <Building2 className="h-4 w-4" />
                        <span>View Orders</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleViewInventory}
                        className="flex items-center space-x-1"
                      >
                        <Package className="h-4 w-4" />
                        <span>Check Stock</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleViewSuppliers}
                        className="flex items-center space-x-1"
                      >
                        <Users className="h-4 w-4" />
                        <span>Contact Suppliers</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logistics Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Shipments</p>
                        <p className="text-2xl font-bold text-gray-900">28</p>
                      </div>
                      <Truck className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Delivery Routes</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                      </div>
                      <MapPin className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                        <p className="text-2xl font-bold text-green-600">96%</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">3</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Logistics Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Deliveries</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ETA</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {logisticsData.map((delivery) => (
                          <tr key={delivery.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TRK-{delivery.orderId.toString().padStart(4, '0')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{delivery.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Customer Location</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge 
                                variant={
                                  delivery.status === 'Delivered' ? 'default' :
                                  delivery.status === 'In Transit' ? 'secondary' :
                                  'outline'
                                }
                                className={
                                  delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                  delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {delivery.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2-3 days</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={handleViewWholesaleOrders}
                                  title="View Related Order"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  title="Track Location"
                                >
                                  <MapPin className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}