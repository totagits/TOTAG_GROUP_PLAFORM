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
  ShoppingCart, 
  Plus, 
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  Calendar,
  Clock,
  Check,
  X
} from "lucide-react";
import { format } from "date-fns";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stockQuantity: number;
  minStock: number;
  images: string[];
  status: "Active" | "Draft" | "Out of Stock";
  featured: boolean;
  tags: string[];
  harvestDate?: string;
  expirationDate?: string;
  organicCertified: boolean;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  deliveryDate?: string;
  status: "Pending" | "Confirmed" | "Preparing" | "Ready" | "Delivered" | "Cancelled";
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: "Pending" | "Paid" | "Refunded";
  deliveryMethod: "Pickup" | "Delivery" | "Farmers Market";
  notes: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  preferredDelivery: string;
}

export default function MarketModule() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "",
    price: 0,
    unit: "lb",
    stockQuantity: 0,
    minStock: 0,
    status: "Active",
    featured: false,
    tags: [],
    organicCertified: false
  });

  // Sample data initialization
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Fresh Organic Tomatoes",
        description: "Vine-ripened organic tomatoes, perfect for salads and cooking",
        category: "Vegetables",
        price: 4.50,
        unit: "lb",
        stockQuantity: 150,
        minStock: 20,
        images: [],
        status: "Active",
        featured: true,
        tags: ["organic", "fresh", "local"],
        harvestDate: "2024-07-10",
        expirationDate: "2024-07-20",
        organicCertified: true
      },
      {
        id: "2",
        name: "Farm Fresh Eggs",
        description: "Free-range chicken eggs from happy hens",
        category: "Dairy & Eggs",
        price: 6.00,
        unit: "dozen",
        stockQuantity: 48,
        minStock: 10,
        images: [],
        status: "Active",
        featured: true,
        tags: ["free-range", "fresh", "protein"],
        organicCertified: false
      },
      {
        id: "3",
        name: "Raw Honey",
        description: "Pure, unfiltered honey from our beehives",
        category: "Pantry",
        price: 12.00,
        unit: "jar",
        stockQuantity: 25,
        minStock: 5,
        images: [],
        status: "Active",
        featured: false,
        tags: ["honey", "natural", "local"],
        organicCertified: true
      },
      {
        id: "4",
        name: "Sweet Corn",
        description: "Freshly picked sweet corn, perfect for grilling",
        category: "Vegetables",
        price: 0.75,
        unit: "ear",
        stockQuantity: 200,
        minStock: 50,
        images: [],
        status: "Active",
        featured: false,
        tags: ["sweet", "fresh", "seasonal"],
        harvestDate: "2024-07-12",
        organicCertified: false
      }
    ];

    const sampleOrders: Order[] = [
      {
        id: "ORD-001",
        customerName: "Sarah Johnson",
        customerEmail: "sarah.j@email.com",
        customerPhone: "(555) 123-4567",
        orderDate: "2024-07-14",
        deliveryDate: "2024-07-16",
        status: "Confirmed",
        items: [
          {
            productId: "1",
            productName: "Fresh Organic Tomatoes",
            quantity: 3,
            unitPrice: 4.50,
            totalPrice: 13.50
          },
          {
            productId: "2",
            productName: "Farm Fresh Eggs",
            quantity: 2,
            unitPrice: 6.00,
            totalPrice: 12.00
          }
        ],
        totalAmount: 25.50,
        paymentStatus: "Paid",
        deliveryMethod: "Pickup",
        notes: "Please have ready by 10 AM"
      },
      {
        id: "ORD-002",
        customerName: "Mike Chen",
        customerEmail: "mike.chen@email.com",
        customerPhone: "(555) 987-6543",
        orderDate: "2024-07-13",
        status: "Preparing",
        items: [
          {
            productId: "3",
            productName: "Raw Honey",
            quantity: 1,
            unitPrice: 12.00,
            totalPrice: 12.00
          },
          {
            productId: "4",
            productName: "Sweet Corn",
            quantity: 12,
            unitPrice: 0.75,
            totalPrice: 9.00
          }
        ],
        totalAmount: 21.00,
        paymentStatus: "Pending",
        deliveryMethod: "Farmers Market",
        notes: "Will pick up at Saturday market"
      }
    ];

    const sampleCustomers: Customer[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "(555) 123-4567",
        address: "123 Main St, Farmville, ST 12345",
        totalOrders: 8,
        totalSpent: 145.50,
        lastOrderDate: "2024-07-14",
        preferredDelivery: "Pickup"
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike.chen@email.com",
        phone: "(555) 987-6543",
        address: "456 Oak Ave, Farmville, ST 12345",
        totalOrders: 3,
        totalSpent: 67.25,
        lastOrderDate: "2024-07-13",
        preferredDelivery: "Farmers Market"
      }
    ];

    setProducts(sampleProducts);
    setOrders(sampleOrders);
    setCustomers(sampleCustomers);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      case "Out of Stock": return "bg-red-100 text-red-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Confirmed": return "bg-blue-100 text-blue-800";
      case "Preparing": return "bg-orange-100 text-orange-800";
      case "Ready": return "bg-green-100 text-green-800";
      case "Delivered": return "bg-gray-100 text-gray-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      case "Paid": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = orders
    .filter(o => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Confirmed").length;
  const activeProducts = products.filter(p => p.status === "Active").length;
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.minStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Market Management</h2>
          <p className="text-gray-600">Manage your farm store and online sales</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddProductDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Store
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                       onClick={() => { setSelectedOrder(order); setShowOrderDetailsDialog(true); }}>
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="font-medium">{order.id} - {order.customerName}</p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} items • {order.orderDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Featured Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.filter(p => p.featured).map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{product.name}</h4>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Price: ${product.price}/{product.unit}</p>
                      <p>Stock: {product.stockQuantity} {product.unit}s</p>
                      <p>Category: {product.category}</p>
                      {product.organicCertified && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Organic
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex gap-2">
                      {product.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                    {product.organicCertified && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Organic
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${product.price}/{product.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-medium ${product.stockQuantity <= product.minStock ? 'text-red-600' : ''}`}>
                        {product.stockQuantity} {product.unit}s
                      </span>
                    </div>
                    {product.harvestDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Harvested:</span>
                        <span className="font-medium">{product.harvestDate}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-600">{product.description}</p>

                  {product.stockQuantity <= product.minStock && (
                    <Badge className="bg-red-100 text-red-800 w-full justify-center">
                      Low Stock Warning
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => { setSelectedOrder(order); setShowOrderDetailsDialog(true); }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-semibold">{order.id}</h4>
                        <p className="text-sm text-gray-600">{order.customerName} • {order.customerEmail}</p>
                        <p className="text-xs text-gray-500">
                          {order.items.length} items • {order.deliveryMethod}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${order.totalAmount.toFixed(2)}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge className={getStatusColor(order.paymentStatus)} variant="outline">
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{order.orderDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Orders</p>
                      <p className="font-bold">{customer.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Spent</p>
                      <p className="font-bold">${customer.totalSpent.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Order</p>
                      <p className="font-medium">{customer.lastOrderDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Preferred Delivery</p>
                      <p className="font-medium">{customer.preferredDelivery}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-gray-600">{customer.address}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Order placed on {selectedOrder?.orderDate}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <Label>Order Status</Label>
                  <div className="flex gap-2 mt-1">
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                    <Badge className={getStatusColor(selectedOrder.paymentStatus)} variant="outline">
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Delivery: {selectedOrder.deliveryMethod}
                  </p>
                </div>
              </div>
              
              <div>
                <Label>Order Items</Label>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold">${item.totalPrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t mt-2">
                  <p className="font-bold">Total</p>
                  <p className="font-bold text-lg">${selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowOrderDetailsDialog(false)}>
              Close
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Update Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your farm store.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="e.g., Fresh Organic Tomatoes"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Dairy & Eggs">Dairy & Eggs</SelectItem>
                    <SelectItem value="Meat">Meat</SelectItem>
                    <SelectItem value="Pantry">Pantry</SelectItem>
                    <SelectItem value="Herbs">Herbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Describe your product..."
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({...newProduct, unit: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lb">per lb</SelectItem>
                    <SelectItem value="each">each</SelectItem>
                    <SelectItem value="dozen">dozen</SelectItem>
                    <SelectItem value="pint">pint</SelectItem>
                    <SelectItem value="quart">quart</SelectItem>
                    <SelectItem value="jar">jar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({...newProduct, stockQuantity: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddProductDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}