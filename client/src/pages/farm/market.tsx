import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, Search, Grid, List, Plus, Minus, Star, Truck, Clock,
  Phone, Mail, MapPin, X, CheckCircle, Leaf, Shield, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FarmNavbar from "@/components/farm-navbar";
import totagFarmLogoPath from "@assets/TOTAG FARM  Logo_1752502100780.png";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MarketProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  emoji: string;
  isAvailable: boolean;
  organic: boolean;
  harvestDate?: string;
}

interface CartItem {
  product: MarketProduct;
  quantity: number;
}

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryMethod: "pickup" | "delivery";
  notes: string;
}

// ─── Shared Storage Keys (synced with dashboard market-module) ─────────────────
const PRODUCTS_KEY = "farm_market_products";
const ORDERS_KEY   = "farm_market_orders";

// ─── Default Products (seeded once) ───────────────────────────────────────────
const DEFAULT_PRODUCTS: MarketProduct[] = [
  { id: "p1",  name: "Fresh Cassava",        description: "Freshly harvested cassava roots, cleaned and ready to use. Ideal for fufu, gari, and boiled cassava.",  category: "roots",      price: 1.50, unit: "kg",    stock: 500, emoji: "🌿", isAvailable: true,  organic: true,  harvestDate: "2026-05-25" },
  { id: "p2",  name: "White Rice",           description: "Locally grown white rice — light, fluffy, and nutritious. Grown without chemical pesticides.",           category: "grains",     price: 2.00, unit: "kg",    stock: 300, emoji: "🌾", isAvailable: true,  organic: true  },
  { id: "p3",  name: "Sweet Corn",           description: "Sun-ripened sweet corn cobs. Great for roasting, boiling, or grinding into flour.",                       category: "vegetables", price: 0.80, unit: "cob",   stock: 200, emoji: "🌽", isAvailable: true,  organic: true,  harvestDate: "2026-05-26" },
  { id: "p4",  name: "Fresh Tomatoes",       description: "Vine-ripened farm tomatoes, juicy and full of flavour. Perfect for stews, soups, and sauces.",            category: "vegetables", price: 2.50, unit: "kg",    stock: 150, emoji: "🍅", isAvailable: true,  organic: false },
  { id: "p5",  name: "Hot Peppers",          description: "Mixed hot peppers — habanero and scotch bonnet. Adds heat and depth to any dish.",                        category: "vegetables", price: 1.80, unit: "kg",    stock: 80,  emoji: "🌶️", isAvailable: true,  organic: false },
  { id: "p6",  name: "Palm Oil",             description: "Pure, unrefined red palm oil pressed from our own oil palm trees. Rich in beta-carotene.",                category: "oils",       price: 3.00, unit: "L",     stock: 120, emoji: "🫙", isAvailable: true,  organic: true  },
  { id: "p7",  name: "Free-Range Eggs",      description: "Eggs from our free-range chickens — bright yolks, rich flavour. Collected fresh daily.",                  category: "poultry",    price: 4.00, unit: "dozen", stock: 60,  emoji: "🥚", isAvailable: true,  organic: true,  harvestDate: "2026-05-28" },
  { id: "p8",  name: "Live Broiler Chicken", description: "Healthy, grain-fed broiler chickens. Sold live or dressed on request. Price per bird.",                   category: "poultry",    price: 12.00, unit: "bird", stock: 30,  emoji: "🐔", isAvailable: true,  organic: false },
  { id: "p9",  name: "Maize (Corn)",         description: "Dried shelled maize grain suitable for flour, animal feed, or home cooking.",                              category: "grains",     price: 0.90, unit: "kg",    stock: 400, emoji: "🌽", isAvailable: true,  organic: true  },
  { id: "p10", name: "Groundnuts",           description: "Sun-dried shelled groundnuts, perfect for soup, paste, or snacking. High protein.",                       category: "nuts",       price: 3.50, unit: "kg",    stock: 90,  emoji: "🥜", isAvailable: true,  organic: true  },
  { id: "p11", name: "Fresh Plantains",      description: "Green and semi-ripe plantains. Great for frying, boiling, or making plantain chips.",                     category: "fruits",     price: 1.20, unit: "bunch", stock: 70,  emoji: "🍌", isAvailable: true,  organic: true,  harvestDate: "2026-05-24" },
  { id: "p12", name: "Rubber Sheet",         description: "Processed rubber sheets from our rubber plantation. For industrial buyers.",                               category: "industrial", price: 2.80, unit: "kg",    stock: 200, emoji: "🌳", isAvailable: true,  organic: false },
];

const CATEGORIES = [
  { id: "all",        name: "All",        emoji: "🛒" },
  { id: "vegetables", name: "Vegetables", emoji: "🥕" },
  { id: "fruits",     name: "Fruits",     emoji: "🍎" },
  { id: "grains",     name: "Grains",     emoji: "🌾" },
  { id: "roots",      name: "Roots",      emoji: "🌿" },
  { id: "poultry",    name: "Poultry",    emoji: "🐔" },
  { id: "oils",       name: "Oils",       emoji: "🫙" },
  { id: "nuts",       name: "Nuts",       emoji: "🥜" },
  { id: "industrial", name: "Industrial", emoji: "🌳" },
];

function getCategoryEmoji(category: string) {
  return CATEGORIES.find(c => c.id === category)?.emoji || "📦";
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarketPage() {
  const [products, setProducts]           = useState<MarketProduct[]>([]);
  const [cart, setCart]                   = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode]           = useState<"grid" | "list">("grid");
  const [showCart, setShowCart]           = useState(false);
  const [showCheckout, setShowCheckout]   = useState(false);
  const [orderPlaced, setOrderPlaced]     = useState<string | null>(null);
  const [checkoutForm, setCheckoutForm]   = useState<CheckoutForm>({
    name: "", email: "", phone: "", address: "", deliveryMethod: "pickup", notes: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) {
      try { setProducts(JSON.parse(saved)); return; } catch {}
    }
    setProducts(DEFAULT_PRODUCTS);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  }, []);

  const addToCart = (product: MarketProduct) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === productId);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter(i => i.product.id !== productId);
      return prev.map(i => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const getCartQty = (productId: string) => cart.find(i => i.product.id === productId)?.quantity || 0;

  const cartTotal     = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const filteredProducts = products.filter(p => {
    if (!p.isAvailable || p.stock === 0) return false;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = selectedCategory === "all" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const placeOrder = () => {
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone) return;
    const orderId = `TF-${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderId,
      customer: checkoutForm,
      items: cart,
      total: cartTotal,
      status: "Pending",
      date: new Date().toISOString(),
      paymentMethod: "Pay on Delivery / Pickup",
    };
    const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...existing]));

    // Deduct stock
    const updatedProducts = products.map(p => {
      const item = cart.find(i => i.product.id === p.id);
      return item ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p;
    });
    setProducts(updatedProducts);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));

    setCart([]);
    setShowCheckout(false);
    setOrderPlaced(orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmNavbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <img src={totagFarmLogoPath} alt="TOTAG Farm" className="h-16 mx-auto mb-4 rounded-lg" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">TOTAG FARM Market</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Fresh, sustainably grown produce directly from our farm in Liberia — harvested and delivered to you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-green-200">
            <span className="flex items-center gap-1"><Leaf className="h-4 w-4" /> Organic Options Available</span>
            <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> Secure Checkout</span>
            <span className="flex items-center gap-1"><Truck className="h-4 w-4" /> Delivery or Pickup</span>
          </div>
        </div>
      </div>

      {/* Sticky cart bar */}
      {cartItemCount > 0 && (
        <div className="sticky top-0 z-40 bg-white border-b shadow-sm py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{cartItemCount} item{cartItemCount > 1 ? "s" : ""} in cart</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-green-700">${cartTotal.toFixed(2)}</span>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setShowCart(true)}>
                <ShoppingCart className="h-4 w-4 mr-1" /> View Cart
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="track">Track Order</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* ── Products Tab ── */}
          <TabsContent value="products" className="space-y-6">
            {/* Search + View Toggle */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search produce…" className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}><Grid className="h-4 w-4" /></Button>
                <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <Button key={cat.id} variant={selectedCategory === cat.id ? "default" : "outline"} size="sm"
                  className={selectedCategory === cat.id ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => setSelectedCategory(cat.id)}>
                  {cat.emoji} {cat.name}
                </Button>
              ))}
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    qty={getCartQty(product.id)}
                    onAdd={() => addToCart(product)}
                    onRemove={() => removeFromCart(product.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Track Order Tab ── */}
          <TabsContent value="track" className="space-y-6">
            <TrackOrder />
          </TabsContent>

          {/* ── About Tab ── */}
          <TabsContent value="about">
            <AboutFarm />
          </TabsContent>

          {/* ── Contact Tab ── */}
          <TabsContent value="contact">
            <ContactInfo />
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Cart Drawer ── */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Your Cart</DialogTitle>
          </DialogHeader>
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 border-b pb-3">
                  <div className="text-3xl">{item.product.emoji}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} / {item.product.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => removeFromCart(item.product.id)}><Minus className="h-3 w-3" /></Button>
                    <span className="font-medium w-5 text-center">{item.quantity}</span>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => addToCart(item.product)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <span className="font-semibold text-sm w-16 text-right">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center font-bold text-lg pt-2">
                <span>Total</span>
                <span className="text-green-700">${cartTotal.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base" onClick={() => { setShowCart(false); setShowCheckout(true); }}>
                Proceed to Checkout →
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Checkout Dialog ── */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Complete your order. Payment is collected on delivery or pickup.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Order summary */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-1 mt-1">
                <span>Total</span>
                <span className="text-green-700">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Full Name *</Label>
                <Input value={checkoutForm.name} onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={checkoutForm.email} onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })} placeholder="you@email.com" />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} placeholder="+231 xxx xxxx" />
              </div>
              <div className="col-span-2">
                <Label>Delivery Method</Label>
                <Select value={checkoutForm.deliveryMethod} onValueChange={v => setCheckoutForm({ ...checkoutForm, deliveryMethod: v as "pickup" | "delivery" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Farm Pickup (Free)</SelectItem>
                    <SelectItem value="delivery">Home Delivery (fee applies)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {checkoutForm.deliveryMethod === "delivery" && (
                <div className="col-span-2">
                  <Label>Delivery Address</Label>
                  <Textarea value={checkoutForm.address} onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })} rows={2} placeholder="Street, City, County" />
                </div>
              )}
              <div className="col-span-2">
                <Label>Order Notes (optional)</Label>
                <Textarea value={checkoutForm.notes} onChange={e => setCheckoutForm({ ...checkoutForm, notes: e.target.value })} rows={2} placeholder="Any special requests?" />
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              <strong>Payment:</strong> Pay on {checkoutForm.deliveryMethod === "pickup" ? "farm pickup" : "delivery"}. We accept cash and MTN Mobile Money.
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
              disabled={!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone}
              onClick={placeOrder}
            >
              Place Order — ${cartTotal.toFixed(2)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Order Confirmed ── */}
      <Dialog open={!!orderPlaced} onOpenChange={() => setOrderPlaced(null)}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <div className="py-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
            <p className="text-gray-600">Your order <strong>{orderPlaced}</strong> has been received.</p>
            <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800 space-y-1">
              <p>We will contact you to confirm your order and arrange {checkoutForm.deliveryMethod}.</p>
              <p className="font-medium mt-2">📞 +231-770-000-000 &nbsp; ✉ farm@totag.lr</p>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setOrderPlaced(null)}>Continue Shopping</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, qty, onAdd, onRemove, viewMode }: {
  product: MarketProduct;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  viewMode: "grid" | "list";
}) {
  const lowStock = product.stock > 0 && product.stock <= 20;
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Card className={`hover:shadow-md transition-shadow h-full ${viewMode === "list" ? "flex" : ""}`}>
        <div className={`bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center ${viewMode === "list" ? "w-32 shrink-0 rounded-l-lg" : "h-44 rounded-t-lg"}`}>
          <span className="text-6xl select-none">{product.emoji}</span>
        </div>
        <CardContent className={`p-4 flex flex-col justify-between ${viewMode === "list" ? "flex-1" : ""}`}>
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <div className="flex flex-col gap-1 items-end shrink-0">
                {product.organic && <Badge className="bg-green-100 text-green-800 text-xs">Organic</Badge>}
                {lowStock && <Badge className="bg-orange-100 text-orange-700 text-xs">Low Stock</Badge>}
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
            {product.harvestDate && (
              <p className="text-xs text-gray-400 mb-2">🗓 Harvested {new Date(product.harvestDate + "T00:00:00").toLocaleDateString()}</p>
            )}
            <p className="text-xs text-gray-400 mb-3">{product.stock} {product.unit} available</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-green-700">${product.price.toFixed(2)}</span>
              <span className="text-xs text-gray-400">/{product.unit}</span>
            </div>
            {qty > 0 ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={onRemove}><Minus className="h-3.5 w-3.5" /></Button>
                <span className="font-semibold w-5 text-center">{qty}</span>
                <Button size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700" onClick={onAdd}><Plus className="h-3.5 w-3.5" /></Button>
              </div>
            ) : (
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={onAdd}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Track Order ──────────────────────────────────────────────────────────────

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult]   = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const search = () => {
    setNotFound(false);
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    const found = orders.find((o: any) => o.id === orderId.trim().toUpperCase());
    if (found) { setResult(found); }
    else { setResult(null); setNotFound(true); }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h3>
        <p className="text-gray-500">Enter your order ID to see the latest status.</p>
      </div>
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex gap-2">
            <Input value={orderId} onChange={e => setOrderId(e.target.value.toUpperCase())} placeholder="e.g. TF-123456" onKeyDown={e => e.key === "Enter" && search()} />
            <Button className="bg-green-600 hover:bg-green-700 shrink-0" onClick={search}>Track</Button>
          </div>
          {notFound && <p className="text-sm text-red-500">Order not found. Check your order ID and try again.</p>}
          {result && (
            <div className="space-y-3 border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{result.id}</span>
                <Badge className="bg-orange-100 text-orange-800">{result.status}</Badge>
              </div>
              <p className="text-sm text-gray-600">Ordered: {new Date(result.date).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Customer: {result.customer.name}</p>
              <p className="text-sm text-gray-600">Method: {result.customer.deliveryMethod === "pickup" ? "Farm Pickup" : "Home Delivery"}</p>
              <div className="border-t pt-2">
                {result.items.map((item: CartItem) => (
                  <div key={item.product.id} className="flex justify-between text-sm py-1">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-1 mt-1">
                  <span>Total</span>
                  <span>${result.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Clock,     color: "text-orange-500", label: "Processing",  desc: "Orders confirmed within 24 hrs" },
          { icon: Package,   color: "text-blue-500",   label: "Preparing",   desc: "Fresh produce packed for you" },
          { icon: Truck,     color: "text-green-600",  label: "Delivery",    desc: "2–3 days delivery to your door" },
        ].map(({ icon: Icon, color, label, desc }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <Icon className={`h-8 w-8 mx-auto mb-2 ${color}`} />
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutFarm() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">About TOTAG FARM</h3>
        <p className="text-lg text-gray-600">
          Part of TOTAG Group of Companies Ltd, our farm delivers sustainable, quality-grown produce to families and businesses across Liberia.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { emoji: "🌱", title: "Sustainable Farming",  desc: "Environmentally responsible practices to protect our land and ecosystem for future generations." },
          { emoji: "🏆", title: "Quality Assurance",    desc: "Every product is handled with care from field to your door." },
          { emoji: "🤝", title: "Community First",      desc: "Supporting local employment and fair pay for our farm workers." },
        ].map(({ emoji, title, desc }) => (
          <Card key={title}><CardContent className="p-6"><div className="text-4xl mb-3">{emoji}</div><h4 className="font-bold text-lg mb-2">{title}</h4><p className="text-gray-600 text-sm">{desc}</p></CardContent></Card>
        ))}
      </div>
    </div>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactInfo() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h3>
        <p className="text-gray-500">Questions about orders or produce? We're happy to help.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Phone,   color: "text-green-600",  label: "Phone",    value: "+231-770-000-000" },
          { icon: Mail,    color: "text-blue-600",   label: "Email",    value: "farm@totag.lr" },
          { icon: MapPin,  color: "text-red-500",    label: "Location", value: "Montserrado County, Liberia" },
        ].map(({ icon: Icon, color, label, value }) => (
          <Card key={label}><CardContent className="p-5 text-center"><Icon className={`h-8 w-8 mx-auto mb-2 ${color}`} /><p className="font-semibold text-sm">{label}</p><p className="text-xs text-gray-500 mt-1">{value}</p></CardContent></Card>
        ))}
      </div>
    </div>
  );
}
