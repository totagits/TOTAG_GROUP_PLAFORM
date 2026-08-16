import Header from "@/components/header";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  Package,
  ShoppingCart,
  Truck,
  MapPin,
  DollarSign,
  Building2,
  Store,
  Star,
  Plus,
  Minus,
  Eye,
  Search,
  Filter,
  Heart,
  CreditCard,
  Phone,
  Shield,
  Zap,
  X,
  Edit,
  Trash2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PaymentProcessing from "./payment-processing";
import TGMLogo from "@assets/Logo for TGM2_1753622327252.png";
import { useQuery } from "@tanstack/react-query";

// Liberian cities for delivery selection
const liberianCities = [
  "Monrovia", "Gbarnga", "Kakata", "Bensonville", "Harper", "Voinjama", 
  "Zwedru", "New Kru Town", "Pleebo", "Robertsport", "Tubmanburg", 
  "Sanniquellie", "Ganta", "Buchanan", "Greenville", "Barclayville",
  "Fish Town", "Edina", "Marshall", "Arthington", "Careysburg",
  "Harbel", "Margibi", "Bong Mines", "Yekepa", "Tappita", "Palala",
  "Cestos City", "River Cess", "Sagleipie", "Bopolu", "Kolahun",
  "Foya", "Lofa Bridge", "Zorzor", "Salayea"
];

export default function GeneralMerchandisePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch carousel slides from database
  const { data: carouselData, isLoading: carouselLoading } = useQuery({
    queryKey: ["/api/carousel-slides"],
  });
  
  const carouselSlides = (carouselData as any)?.slides || [];
  
  // E-commerce state
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    isWholesalePartner: false,
    partnerCompany: ""
  });
  
  // Payment and delivery state
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Enhanced v2 features with interoperability
  const [showWholesaleForm, setShowWholesaleForm] = useState(false);
  const [showRetailForm, setShowRetailForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [logisticsSubTab, setLogisticsSubTab] = useState('delivery');



  // Fetch products from database
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/admin/products"],
  });
  
  const products = (productsData as any)?.products || [];

  // Categories for filtering - dynamically generated from products
  const categories = Array.from(new Set(products.map((product: any) => product.category).filter(Boolean)));

  // Payment methods for Liberia
  const paymentMethods = [
    {
      id: "mtn_money",
      name: "MTN Mobile Money",
      description: "Pay with your MTN Mobile Money account",
      icon: Phone,
      fees: "2% transaction fee",
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      id: "orange_money", 
      name: "Orange Money",
      description: "Pay with your Orange Money account",
      icon: Phone,
      fees: "2.5% transaction fee",
      color: "bg-orange-50 border-orange-200"
    },
    {
      id: "cash",
      name: "Cash on Delivery",
      description: "Pay cash when your order is delivered",
      icon: DollarSign,
      fees: "No additional fees",
      color: "bg-green-50 border-green-200"
    }
  ];

  // Delivery options
  const deliveryOptions = [
    {
      id: "tgm_delivery",
      name: "TGM Delivery",
      description: "Delivered by our professional drivers",
      time: "2-5 business days",
      fee: "$2.50 delivery fee",
      feeAmount: 2.50,
      tracking: true
    },
    {
      id: "pickup",
      name: "Store Pickup",
      description: "Pick up from our Monrovia location",
      time: "Available immediately",
      fee: "Free",
      feeAmount: 0,
      tracking: false
    }
  ];
  
  // E-commerce functions
  const addToCart = (product: any, quantity: number = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart",
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + (price * item.quantity);
    }, 0);
  };

  const getDeliveryFee = () => {
    const selectedDelivery = deliveryOptions.find(option => option.id === deliveryOption);
    return selectedDelivery ? selectedDelivery.feeAmount : 0;
  };

  const getTotalPrice = () => {
    return (getSubtotal() + getDeliveryFee()).toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = products.filter((product: any) => {
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const processOrder = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Step 1: Validate customer information
      const missingFields = [];
      if (!customerInfo.firstName) missingFields.push("First Name");
      if (!customerInfo.lastName) missingFields.push("Last Name");
      if (!customerInfo.phone) missingFields.push("Phone Number");
      if (!customerInfo.address) missingFields.push("Address");
      if (!customerInfo.city) missingFields.push("City");
      if (!paymentMethod) missingFields.push("Payment Method");
      if (!deliveryOption) missingFields.push("Delivery Option");
      
      if (missingFields.length > 0) {
        toast({
          title: "⚠️ Missing Information",
          description: `Please fill in: ${missingFields.join(", ")}`,
          variant: "destructive",
          duration: 5000,
        });
        setIsProcessingPayment(false);
        return;
      }

      // Step 2: Prepare order data
      const orderData = {
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email || `${customerInfo.firstName.toLowerCase()}${customerInfo.lastName.toLowerCase()}@customer.tgm`,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          isWholesalePartner: customerInfo.isWholesalePartner
        },
        paymentMethod,
        deliveryOption,
        cartItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: customerInfo.isWholesalePartner ? item.wholeSalePrice : item.price,
          quantity: item.quantity
        })),
        subtotal: getSubtotal().toFixed(2),
        deliveryFee: getDeliveryFee().toFixed(2)
      };

      console.log("🚀 Processing order with data:", orderData);
      console.log("🌐 Current domain:", window.location.hostname);
      console.log("📡 API URL will be:", import.meta.env.PROD ? 'https://totaggroup.com/api/orders' : 'http://localhost:5000/api/orders');

      // Show progress toast
      toast({
        title: "Processing Order...",
        description: "Connecting to TGM server and processing your order",
        duration: 2000,
      });

      // Step 3: Make API call to place order with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        const response = await apiRequest("POST", "/api/orders", orderData);
        clearTimeout(timeoutId);
        
        console.log("✅ API Response received");
        const result = await response.json();

        if (result.success) {
          console.log("🎉 Order placed successfully:", result);
          
          // Step 4: Show payment processing page with order details
          setIsCheckoutOpen(false);
          setShowPaymentProcessing(true);
          
          // Store order details for payment processing
          setOrderDetails({
            orderNumber: result.orderNumber,
            trackingNumber: result.trackingNumber,
            orderId: result.order.id
          });
          
          toast({
            title: "✅ Order Placed Successfully",
            description: `Order ${result.orderNumber} has been created and is being processed.`,
            duration: 3000,
          });
        } else {
          throw new Error(result.message || "Failed to place order");
        }
      } catch (apiError) {
        clearTimeout(timeoutId);
        throw apiError;
      }
      
    } catch (error: any) {
      console.error("❌ Order placement error:", error);
      
      let errorMessage = "There was an error processing your order. Please try again.";
      let errorTitle = "Order Failed";
      
      // Provide specific error messages based on error type
      if (error.message.includes('Network error') || error.message.includes('fetch')) {
        errorTitle = "Connection Problem";
        errorMessage = "Unable to connect to TGM servers. Please check your internet connection and try again. If the problem persists, the service may be temporarily unavailable.";
      } else if (error.message.includes('timeout') || error.name === 'AbortError') {
        errorTitle = "Request Timeout";
        errorMessage = "The order is taking longer than expected to process. Please try again or contact customer service if the problem continues.";
      } else if (error.message.includes('404') || error.message.includes('Not Found')) {
        errorTitle = "Service Unavailable";
        errorMessage = "TGM order processing service is currently unavailable. Please try again later or contact customer support.";
      } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        errorTitle = "Server Error";
        errorMessage = "There's a temporary issue with our servers. Please try again in a few minutes.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
      
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentComplete = () => {
    // Clear cart and reset forms
    setCartItems([]);
    setIsCartOpen(false);
    setShowPaymentProcessing(false);
    setCustomerInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      isWholesalePartner: false,
      partnerCompany: ""
    });
    setPaymentMethod("");
    setDeliveryOption("");
  };

  const handlePaymentCancel = () => {
    setShowPaymentProcessing(false);
    setIsCheckoutOpen(true);
    setIsProcessingPayment(false);
  };

  // Handle place order
  const handlePlaceOrder = () => {
    processOrder();
  };

  // Auto-rotate carousel using database slides
  useEffect(() => {
    if (carouselSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
      }, 4000); // Change every 4 seconds
      return () => clearInterval(interval);
    }
  }, [carouselSlides.length]);
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

  // Show payment processing page if in payment flow
  if (showPaymentProcessing) {
    return (
      <PaymentProcessing
        orderData={{
          customerInfo,
          paymentMethod,
          deliveryOption,
          cartItems,
          totalAmount: getTotalPrice()
        }}
        onComplete={handlePaymentComplete}
        onCancel={handlePaymentCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Full Header with Product Background Carousel */}
      <header className="relative h-40 overflow-hidden sticky top-0 z-50 shadow-lg">
        {/* Background Image Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCarouselIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Product Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${carouselSlides[currentCarouselIndex]?.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=400&fit=crop&crop=center'})`,
              }}
            >
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Clean Header Content */}
        <div className="relative z-10 h-full">
          {/* Back Button - Extreme Upper Left */}
          <div className="absolute top-2 left-2 z-50">
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/90 text-gray-900 hover:bg-white shadow-lg"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Logo and Title - Centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <img 
                src="/images/totag-logo.png" 
                alt="TGM Logo" 
                className="h-[100px] w-[100px] mx-auto mb-3 object-contain"
              />
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">TOTAG General Merchandise</h1>
              <p className="text-base text-gray-200">Quality Products-Timely Delivery</p>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselSlides.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentCarouselIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentCarouselIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </header>
      {/* Hero Section with Product Gallery */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Comprehensive <span className="text-purple-600">Wholesale & Retail</span> Solutions
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
                TOTAG General Merchandise operates as a leading wholesale and retail distributor across West Africa, 
                providing comprehensive supply chain solutions, multi-outlet retail management, and strategic partnerships 
                that drive business growth.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  onClick={() => document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Explore Our Platform
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/order-tracking'}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3"
                >
                  <Truck className="h-5 w-5 mr-2" />
                  Track Your Order
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/merchant-login'}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Staff Login
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/customer-dashboard'}
                  className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-3"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  My Credit Account
                </Button>
              </div>
              
              {/* Key Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Multi-Outlet Network</h4>
                  <p className="text-sm text-gray-600">Strategic retail locations across major West African cities</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Product Diversity</h4>
                  <p className="text-sm text-gray-600">From essential goods to premium products across 25+ categories</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Logistics Excellence</h4>
                  <p className="text-sm text-gray-600">Advanced supply chain management with real-time tracking capabilities</p>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">150+</div>
                <div className="text-gray-600">Active Partners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">$2.4M</div>
                <div className="text-gray-600">Monthly Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">25+</div>
                <div className="text-gray-600">Product Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">50+</div>
                <div className="text-gray-600">Delivery Locations</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* E-commerce Storefront Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-40 z-40" data-section="storefront">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-gray-900">TGM Storefront</h1>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Wholesale Partner Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="wholesale"
                  checked={customerInfo.isWholesalePartner}
                  onChange={(e) => setCustomerInfo({...customerInfo, isWholesalePartner: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="wholesale" className="text-sm font-medium">Wholesale Partner</Label>
              </div>

              {/* Shopping Cart Button - ONLY ONE */}
              <Button
                variant="outline"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({getTotalItems()})
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500">{getTotalItems()}</Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="flex items-center space-x-2"
            >
              <Package className="h-4 w-4" />
              <span>All Products</span>
            </Button>
            {categories.map((category: string, index: number) => (
              <Button
                key={`cat-${index}`}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center space-x-2"
              >
                <Store className="h-4 w-4" />
                <span>{category}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Product Grid */}
        <section className="mb-8" id="product-catalog">
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or category filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.imageUrl || "/api/placeholder/400/300"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${product.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center mb-3">
                      <Badge variant="outline" className="mr-2">
                        {product.sku}
                      </Badge>
                      <span className="text-xs text-gray-500">Stock: {product.stockQuantity}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-green-600">
                          LRD ${parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => setSelectedProduct(product)}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        <Eye className="h-3 w-3 mr-2" />
                        View Details
                      </Button>
                      
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={product.stockQuantity === 0}
                        className="w-full"
                        size="sm"
                      >
                        {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>





      {/* Shopping Cart Modal */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shopping Cart</DialogTitle>
            <DialogDescription>
              Review your items and proceed to checkout
            </DialogDescription>
          </DialogHeader>
          
          {cartItems.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img src={item.imageUrl || "/api/placeholder/80/80"} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="font-bold text-green-600">
                        LRD ${parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                    {deliveryOption && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Delivery Fee:</span>
                        <span>${getDeliveryFee().toFixed(2)}</span>
                      </div>
                    )}
                    {!deliveryOption && (
                      <div className="text-sm text-gray-500">
                        * Delivery fee will be calculated at checkout
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total: ${getTotalPrice()}</span>
                    <Button onClick={() => setIsCheckoutOpen(true)} size="lg">
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Checkout Modal */}
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
              <DialogDescription>
                Complete your order with mobile money payment
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+231 77 123 4567 (for mobile money)"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your MTN or Orange Money number for payment processing
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Select value={customerInfo.city} onValueChange={(value) => setCustomerInfo({...customerInfo, city: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Major Cities */}
                        <SelectItem value="monrovia">Monrovia (Capital)</SelectItem>
                        <SelectItem value="gbarnga">Gbarnga</SelectItem>
                        <SelectItem value="kakata">Kakata</SelectItem>
                        <SelectItem value="voinjama">Voinjama</SelectItem>
                        <SelectItem value="harper">Harper</SelectItem>
                        <SelectItem value="zwedru">Zwedru</SelectItem>
                        <SelectItem value="buchanan">Buchanan</SelectItem>
                        <SelectItem value="tubmanburg">Tubmanburg</SelectItem>
                        <SelectItem value="robertsport">Robertsport</SelectItem>
                        <SelectItem value="greenville">Greenville</SelectItem>
                        <SelectItem value="fish_town">Fish Town</SelectItem>
                        <SelectItem value="river_cess">River Cess</SelectItem>
                        <SelectItem value="barclayville">Barclayville</SelectItem>
                        <SelectItem value="bensonville">Bensonville</SelectItem>
                        <SelectItem value="pleebo">Pleebo</SelectItem>
                        {/* County Capitals */}
                        <SelectItem value="sanniquellie">Sanniquellie</SelectItem>
                        <SelectItem value="tappita">Tappita</SelectItem>
                        <SelectItem value="sagleipie">Sagleipie</SelectItem>
                        <SelectItem value="yekepa">Yekepa</SelectItem>
                        <SelectItem value="ganta">Ganta</SelectItem>
                        <SelectItem value="saclepea">Saclepea</SelectItem>
                        <SelectItem value="harbel">Harbel</SelectItem>
                        <SelectItem value="careysburg">Careysburg</SelectItem>
                        <SelectItem value="marshall">Marshall</SelectItem>
                        <SelectItem value="paynesville">Paynesville</SelectItem>
                        <SelectItem value="new_kru_town">New Kru Town</SelectItem>
                        <SelectItem value="caldwell">Caldwell</SelectItem>
                        <SelectItem value="red_light">Red Light</SelectItem>
                        <SelectItem value="virginia">Virginia</SelectItem>
                        <SelectItem value="congo_town">Congo Town</SelectItem>
                        {/* Additional Towns */}
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="johnsonville">Johnsonville</SelectItem>
                        <SelectItem value="duport_road">Duport Road</SelectItem>
                        <SelectItem value="soul_clinic">Soul Clinic</SelectItem>
                        <SelectItem value="brewersville">Brewersville</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {customerInfo.isWholesalePartner && (
                    <div>
                      <Label htmlFor="partnerCompany">Partner Company</Label>
                      <Input
                        id="partnerCompany"
                        value={customerInfo.partnerCompany}
                        onChange={(e) => setCustomerInfo({...customerInfo, partnerCompany: e.target.value})}
                      />
                    </div>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : method.color
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <method.icon className="h-6 w-6 mr-3" />
                        <div className="flex-1">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                          <div className="text-xs text-gray-500">{method.fees}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Delivery Option</h3>
                  <div className="space-y-3">
                    {deliveryOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          deliveryOption === option.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={deliveryOption === option.id}
                          onChange={(e) => setDeliveryOption(e.target.value)}
                          className="mr-3"
                        />
                        <Truck className="h-6 w-6 mr-3" />
                        <div className="flex-1">
                          <div className="font-medium">{option.name}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                          <div className="text-xs text-gray-500">
                            {option.time} • {option.fee}
                            {option.tracking && " • GPS Tracking Available"}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(customerInfo.isWholesalePartner ? item.wholeSalePrice * item.quantity : item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                    {deliveryOption && (
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>${getDeliveryFee().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Transparency Notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">Blockchain Transparency</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Your order will be recorded on our blockchain ledger for complete transparency and traceability. 
                    This ensures supply chain integrity and enables you to track your products from source to delivery.
                  </p>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={processOrder}
                  disabled={isProcessingPayment || cartItems.length === 0}
                  className="w-full mt-6"
                  size="lg"
                >
                  {isProcessingPayment ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Place Order (${getTotalPrice()})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>Product Details</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Badge className={selectedProduct.statusColor}>
                      {selectedProduct.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600">{selectedProduct.description}</p>
                  
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedProduct.rating) 
                              ? "text-yellow-400 fill-current" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Specifications:</strong>
                    <p>{selectedProduct.specifications}</p>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>SKU:</strong> {selectedProduct.sku}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Stock:</strong> {selectedProduct.stock} units available
                  </div>
                  
                  <div className="text-2xl font-bold text-green-600">
                    ${customerInfo.isWholesalePartner ? selectedProduct.wholeSalePrice.toFixed(2) : selectedProduct.price.toFixed(2)}
                    {customerInfo.isWholesalePartner && (
                      <div className="text-sm text-gray-500 line-through">
                        Regular: ${selectedProduct.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock === 0}
                    className="w-full"
                  >
                    {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TGM Storefront</h3>
              <p className="text-gray-400">
                Your trusted partner for quality products across West Africa with blockchain transparency 
                and mobile money convenience.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
              <ul className="text-gray-400 space-y-2">
                <li>MTN Mobile Money</li>
                <li>Orange Money</li>
                <li>Cash on Delivery</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="text-gray-400 space-y-2">
                <li>Order Tracking</li>
                <li>Customer Service</li>
                <li>Wholesale Partnerships</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TOTAG General Merchandise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
