import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Search,
  Phone,
  Calendar,
  AlertCircle,
  Navigation,
  Building2,
  User,
  DollarSign,
  Shield,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import TGMLogo from "@assets/Logo for TGM_1753450516331.png";

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sample order data for demonstration
  const sampleOrders = [
    {
      orderNumber: "TGM-2025-001",
      customerName: "Michael Gwoah",
      phone: "+231777666999",
      address: "Thinkers Village, Monrovia",
      totalAmount: "47.50",
      paymentMethod: "MTN Mobile Money",
      orderDate: "2025-01-26",
      estimatedDelivery: "2025-01-28",
      currentStatus: "in_transit",
      items: [
        { name: "Premium Rice (50kg)", quantity: 1, price: "45.00" }
      ],
      deliveryHistory: [
        {
          status: "order_placed",
          title: "Order Placed",
          description: "Your order has been received and confirmed",
          timestamp: "2025-01-26 10:30 AM",
          location: "TOTAG Warehouse, Monrovia",
          completed: true
        },
        {
          status: "processing",
          title: "Order Processing",
          description: "Items are being prepared and packaged",
          timestamp: "2025-01-26 02:15 PM",
          location: "TOTAG Warehouse, Monrovia", 
          completed: true
        },
        {
          status: "dispatched",
          title: "Order Dispatched",
          description: "Package has left our warehouse",
          timestamp: "2025-01-26 04:45 PM",
          location: "TOTAG Distribution Center",
          completed: true
        },
        {
          status: "in_transit",
          title: "In Transit",
          description: "Package is on the way to your location",
          timestamp: "2025-01-26 08:20 PM",
          location: "En route to Monrovia",
          completed: false,
          current: true
        },
        {
          status: "out_for_delivery",
          title: "Out for Delivery",
          description: "Package is with delivery partner for final delivery",
          timestamp: "Expected: 2025-01-28 10:00 AM",
          location: "Monrovia Delivery Hub",
          completed: false
        },
        {
          status: "delivered",
          title: "Delivered",
          description: "Package has been delivered successfully",
          timestamp: "Expected: 2025-01-28 12:00 PM",
          location: "Thinkers Village, Monrovia",
          completed: false
        }
      ]
    }
  ];

  // Check for tracking number from payment completion
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('order') || sessionStorage.getItem('orderNumber');
    
    if (orderNumber) {
      setTrackingNumber(orderNumber);
      // Auto-search when component loads with order number
      setTimeout(() => handleTrackOrder(orderNumber), 100);
    }
  }, []);

  const handleTrackOrder = async (orderNum?: string) => {
    const searchNumber = orderNum || trackingNumber;
    
    if (!searchNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/orders/${searchNumber}`);
      const result = await response.json();

      if (result.success) {
        // Map database order to display format
        const mappedOrder = {
          orderNumber: result.order.orderNumber,
          customerName: "TGM Customer", // Privacy protection
          phone: "+231-XXX-XXX-XXX",
          address: result.order.deliveryAddress,
          totalAmount: result.order.total,
          paymentMethod: result.order.paymentMethod === 'mtn_money' ? 'MTN Mobile Money' : 
                        result.order.paymentMethod === 'orange_money' ? 'Orange Money' : 
                        result.order.paymentMethod,
          orderDate: new Date(result.order.createdAt).toISOString().split('T')[0],
          estimatedDelivery: new Date(result.order.estimatedDelivery).toISOString().split('T')[0],
          currentStatus: result.delivery?.status || "order_placed",
          trackingNumber: result.delivery?.trackingNumber || "",
          blockchainHash: result.order.blockchainHash,
          items: [
            { name: "Product Bundle", quantity: 1, price: result.order.subtotal }
          ],
          deliveryHistory: [
            {
              status: "order_placed",
              title: "Order Placed",
              description: "Your order has been received and confirmed",
              timestamp: new Date(result.order.createdAt).toLocaleString(),
              location: "TOTAG Warehouse, Monrovia",
              completed: true
            },
            {
              status: "processing",
              title: "Order Processing",
              description: "Items are being prepared and packaged",
              timestamp: new Date(result.order.createdAt).toLocaleString(),
              location: "TOTAG Warehouse, Monrovia",
              completed: result.delivery?.status !== "confirmed"
            },
            {
              status: "dispatched",
              title: "Order Dispatched",
              description: "Package has left our warehouse",
              timestamp: result.delivery?.status === "in_transit" || result.delivery?.status === "delivered" ? 
                        new Date(result.delivery.updatedAt).toLocaleString() : "Pending",
              location: "TOTAG Distribution Center",
              completed: result.delivery?.status === "in_transit" || result.delivery?.status === "delivered"
            },
            {
              status: "in_transit",
              title: "In Transit",
              description: `Package is on the way with ${result.delivery?.driverName || "our driver"}`,
              timestamp: result.delivery?.status === "in_transit" || result.delivery?.status === "delivered" ? 
                        "In Progress" : "Pending",
              location: result.delivery?.currentLocation || "En Route",
              completed: result.delivery?.status === "in_transit" || result.delivery?.status === "delivered",
              current: result.delivery?.status === "in_transit"
            },
            {
              status: "out_for_delivery",
              title: "Out for Delivery", 
              description: "Package is with delivery partner for final delivery",
              timestamp: result.delivery?.status === "delivered" ? 
                        new Date(result.delivery.actualDelivery).toLocaleString() : "Pending",
              location: "Near destination",
              completed: result.delivery?.status === "delivered"
            },
            {
              status: "delivered",
              title: "Delivered",
              description: "Package has been delivered successfully",
              timestamp: result.delivery?.status === "delivered" ? 
                        new Date(result.delivery.actualDelivery).toLocaleString() : "Pending",
              location: result.order.deliveryAddress,
              completed: result.delivery?.status === "delivered"
            }
          ]
        };
        
        setOrderData(mappedOrder);
        setError("");
      } else {
        // Fallback to sample data for demo
        const order = sampleOrders.find(o => 
          o.orderNumber.toLowerCase() === searchNumber.toLowerCase()
        );

        if (order) {
          setOrderData(order);
          setError("");
        } else {
          setError("Order not found. Please check your tracking number and try again.");
          setOrderData(null);
        }
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      
      // Fallback to sample data
      const order = sampleOrders.find(o => 
        o.orderNumber.toLowerCase() === searchNumber.toLowerCase()
      );

      if (order) {
        setOrderData(order);
        setError("");
      } else {
        setError("Unable to fetch order data. Please try again later.");
        setOrderData(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusProgress = (status: string) => {
    const statusOrder = ["order_placed", "processing", "dispatched", "in_transit", "out_for_delivery", "delivered"];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "order_placed": return "bg-blue-500";
      case "processing": return "bg-yellow-500";
      case "dispatched": return "bg-purple-500";
      case "in_transit": return "bg-orange-500";
      case "out_for_delivery": return "bg-green-500";
      case "delivered": return "bg-green-600";
      default: return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "order_placed": return Package;
      case "processing": return Clock;
      case "dispatched": return Building2;
      case "in_transit": return Truck;
      case "out_for_delivery": return Navigation;
      case "delivered": return CheckCircle;
      default: return AlertCircle;
    }
  };

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
                <img src={TGMLogo} alt="TGM Logo" className="h-24 w-24 rounded-full" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Order Tracking</h1>
                  <p className="text-sm text-gray-500">Track your TGM delivery</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Shield className="h-3 w-3 mr-1" />
              Blockchain Verified
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Tracking Search */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-purple-600" />
                Track Your Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="tracking">Order Number / Tracking ID</Label>
                  <Input
                    id="tracking"
                    placeholder="Enter your order number (e.g., TGM-2025-001)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => handleTrackOrder()} 
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {isLoading ? "Tracking..." : "Track Order"}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-700">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Order for Demo */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-medium text-blue-900 mb-2">Try Demo Tracking</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Use sample order number: <span className="font-mono font-bold">TGM-2025-001</span>
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setTrackingNumber("TGM-2025-001");
                    setTimeout(() => handleTrackOrder(), 100);
                  }}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Try Demo Order
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <AnimatePresence>
            {orderData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Order #{orderData.orderNumber}</span>
                      <Badge 
                        className={`${getStatusColor(orderData.currentStatus)} text-white`}
                      >
                        {orderData.currentStatus.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium">Customer</span>
                        </div>
                        <p className="text-sm text-gray-600">{orderData.customerName}</p>
                        <p className="text-sm text-gray-500">{orderData.phone}</p>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium">Delivery Address</span>
                        </div>
                        <p className="text-sm text-gray-600">{orderData.address}</p>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium">Order Value</span>
                        </div>
                        <p className="text-sm text-gray-600">${orderData.totalAmount}</p>
                        <p className="text-sm text-gray-500">{orderData.paymentMethod}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round(getStatusProgress(orderData.currentStatus))}%</span>
                      </div>
                      <Progress value={getStatusProgress(orderData.currentStatus)} className="h-3" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-500">Estimated Delivery:</span>
                        <span className="ml-2 font-medium">{orderData.estimatedDelivery}</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>On Schedule</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {orderData.deliveryHistory.map((step: any, index: number) => {
                        const IconComponent = getStatusIcon(step.status);
                        return (
                          <div key={index} className="flex items-start space-x-4">
                            <div className={`p-2 rounded-full ${
                              step.completed ? getStatusColor(step.status) : 
                              step.current ? 'bg-orange-500 animate-pulse' : 'bg-gray-200'
                            }`}>
                              <IconComponent className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className={`font-medium ${
                                  step.completed ? 'text-gray-900' :
                                  step.current ? 'text-orange-600' : 'text-gray-500'
                                }`}>
                                  {step.title}
                                </h4>
                                <span className="text-sm text-gray-500">{step.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                              <div className="flex items-center mt-2">
                                <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                                <span className="text-xs text-gray-500">{step.location}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orderData.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Package className="h-8 w-8 text-purple-600" />
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-medium">${item.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
                      <p className="text-sm text-blue-700 mb-4">
                        Contact our delivery support team for assistance
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Support
                        </Button>
                        <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                          <MapPin className="h-4 w-4 mr-2" />
                          Live Tracking
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}