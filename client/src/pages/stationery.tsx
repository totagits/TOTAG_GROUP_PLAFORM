import SubsidiaryHeroCarousel from "@/components/subsidiary-hero-carousel";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Printer, 
  BookOpen, 
  CheckCircle, 
  ArrowRight,
  ShoppingBag,
  Calculator,
  Plus,
  Trash2,
  PackageCheck,
  Repeat
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// B2B Stationery Product Catalog
const STATIONERY_ITEMS = [
  { id: "ST-01", name: "Premium A4 Copy Paper (Box of 5 Reams)", category: "Paper", price: 28, unit: "Box" },
  { id: "ST-02", name: "Heavy Duty Lever Arch Binders (Box of 10)", category: "Filing", price: 35, unit: "Box" },
  { id: "ST-03", name: "Custom Corporate Letterheads (1,000 Sheets)", category: "Printing", price: 45, unit: "Pack" },
  { id: "ST-04", name: "Executive Ballpoint Pens (Box of 50)", category: "Writing", price: 18, unit: "Box" },
  { id: "ST-05", name: "HP Heavy Duty Toner Cartridge 85A", category: "Printer Supplies", price: 65, unit: "Unit" },
  { id: "ST-06", name: "Institutional Student Exercise Books (Pack of 100)", category: "School Supplies", price: 40, unit: "Pack" }
];

export default function StationeryPage() {
  const { toast } = useToast();

  // Cart & Order Builder State
  const [cart, setCart] = useState<Record<string, number>>({ "ST-01": 5, "ST-02": 2 });
  const [discountCode, setDiscountCode] = useState("");

  // Printing Estimator State
  const [printType, setPrintType] = useState("business_cards");
  const [quantity, setQuantity] = useState(500);
  const [paperWeight, setPaperWeight] = useState("300gsm");
  const [calculatedPrintCost, setCalculatedPrintCost] = useState<number | null>(65);

  // Bulk Procurement Submission Form
  const [procurementForm, setProcurementForm] = useState({
    orgName: "",
    email: "",
    phone: "",
    deliveryFrequency: "Monthly",
    notes: ""
  });

  const handleUpdateCart = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const getSubtotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = STATIONERY_ITEMS.find((i) => i.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const handleCalculatePrintCost = (e: React.FormEvent) => {
    e.preventDefault();
    const unitPrice = printType === "business_cards" ? 0.12 : printType === "letterheads" ? 0.08 : 0.45;
    const total = Math.round(quantity * unitPrice);
    setCalculatedPrintCost(total);
    toast({ title: "Custom Printing Quote Calculated", description: `Estimated total: $${total.toLocaleString()} USD` });
  };

  const handleProcurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "B2B Procurement Request Submitted",
      description: "Our commercial stationery account manager will send invoice & schedule monthly delivery."
    });
    setProcurementForm({ orgName: "", email: "", phone: "", deliveryFrequency: "Monthly", notes: "" });
  };

  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pb-20">
        {/* Standardized Photo Carousel Hero Section */}
        <SubsidiaryHeroCarousel
          badge="TOTAG Subsidiary • B2B Office & Educational Procurement"
          titleHighlight="Stationery Supplies"
          subtitle="Wholesale corporate office procurement, educational supply bundles for schools & ministries, custom commercial printing, and automated recurring stationery replenishment."
          slides={[
            { url: "/images/stationery/stationery_office_supplies_set.png", caption: "Premium B2B Corporate Office Supplies & Executive Stationery Set" },
            { url: "/images/stationery/stationery_desktop_organizer.png", caption: "Executive Desktop Organization Suite & Office Accessories" },
            { url: "/images/stationery/stationery_double_a_box.png", caption: "Double A Premium 80gsm High-Whiteness A4 Copy Paper Reams" },
            { url: "/images/stationery/stationery_paper_cartons.png", caption: "Bulk Wholesale Double A Copy Paper Pallets & Boxed Cartons" },
            { url: "/images/stationery/stationery_lever_arch_binders.png", caption: "Heavy-Duty Lever Arch Binders & Archival Ring File Storage" }
          ]}
          stats={[
            { label: "Catalog Products", value: "3,200+" },
            { label: "Corporate Clients", value: "450+" },
            { label: "Fulfillment", value: "Same-Day" }
          ]}
        />

        
        {/* AUTHENTIC B2B STATIONERY & OFFICE SUPPLIES PHOTOGRAPHY GALLERY SHOWCASE (HIGH DEFINITION CLARITY) */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentic B2B Office Supplies & Stationery Gallery</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High-definition product photography from TOTAG Stationery Supplies inventory</p>
                </div>
              </div>
              <Badge className="bg-sky-500/20 text-sky-500 text-[10px] font-bold">
                5 Product Lines
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { title: "Office Essentials Set", img: "/images/stationery/stationery_office_supplies_set.png", tag: "Stationery Suite" },
                { title: "Desktop Organizer", img: "/images/stationery/stationery_desktop_organizer.png", tag: "Desk Accessories" },
                { title: "Double A Copy Box", img: "/images/stationery/stationery_double_a_box.png", tag: "A4 80gsm Paper" },
                { title: "Paper Ream Cartons", img: "/images/stationery/stationery_paper_cartons.png", tag: "Bulk Pallets" },
                { title: "Lever Arch Binders", img: "/images/stationery/stationery_lever_arch_binders.png", tag: "Archival Ring Files" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => window.open(item.img, '_blank')}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-950 aspect-video cursor-pointer shadow-md hover:shadow-2xl transition-all"
                >
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-2.5 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block">{item.tag}</span>
                    <span className="text-xs font-black text-white truncate block">{item.title}</span>
                    <span className="text-[8px] text-slate-300 font-semibold block mt-0.5 group-hover:text-amber-400 transition-colors">Click for Full-Res HD ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 1. B2B Stationery Bulk Procurement Catalog & Cart */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-sky-950/40 via-slate-900/50 to-teal-950/40 border-b border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                    <ShoppingBag className="w-6 h-6 text-sky-400" />
                    <span>B2B Corporate Stationery Bulk Procurement Catalog</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300 mt-1">
                    Build corporate supply orders with tier volume discounts for office papers, filing, toners, and school kits.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Product Catalog */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {STATIONERY_ITEMS.map((item) => {
                    const qty = cart[item.id] || 0;
                    return (
                      <div 
                        key={item.id}
                        className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{item.name}</h4>
                          <span className="text-lg font-extrabold text-sky-600 dark:text-sky-400 block mt-1">
                            ${item.price} <span className="text-xs font-normal text-slate-500">/ {item.unit}</span>
                          </span>
                        </div>

                        {/* Qty Controller */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                          <span className="text-xs text-slate-500 font-semibold">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateCart(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-white/10 font-bold text-xs flex items-center justify-center hover:bg-slate-300"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-6 text-center">{qty}</span>
                            <button
                              onClick={() => handleUpdateCart(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-sky-500 text-white font-bold text-xs flex items-center justify-center hover:bg-sky-400"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Procurement Order Summary */}
                <Card className="glass-card border-white/60 dark:border-white/10 p-5 space-y-4">
                  <h4 className="text-base font-bold flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-sky-500" />
                    <span>Procurement Order Cart</span>
                  </h4>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {Object.entries(cart).length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">Your procurement cart is empty.</p>
                    ) : (
                      Object.entries(cart).map(([id, qty]) => {
                        const item = STATIONERY_ITEMS.find((i) => i.id === id);
                        if (!item) return null;
                        return (
                          <div key={id} className="flex justify-between items-center text-xs p-2 rounded-xl bg-slate-100/50 dark:bg-white/5">
                            <div>
                              <span className="font-bold truncate block max-w-[150px]">{item.name}</span>
                              <span className="text-[10px] text-slate-400">{qty} x ${item.price}</span>
                            </div>
                            <span className="font-bold text-sky-600 dark:text-sky-400">${item.price * qty}</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Subtotal:</span>
                      <span>${getSubtotal().toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-emerald-500">
                      <span>Volume Discount (10%):</span>
                      <span>-${Math.round(getSubtotal() * 0.1).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold pt-2 text-slate-900 dark:text-white">
                      <span>Total Procurement:</span>
                      <span className="text-sky-600 dark:text-sky-400">
                        ${Math.round(getSubtotal() * 0.9).toLocaleString()} USD
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => toast({ title: "Order Checkout Ready", description: "Complete organizational details below to place order." })}
                    disabled={Object.entries(cart).length === 0}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white rounded-xl py-5 font-semibold"
                  >
                    Proceed to B2B Procurement Checkout
                  </Button>
                </Card>

              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Custom Printing Quoting Tool & Monthly Subscription Setup */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Commercial Printing Estimator */}
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Printer className="w-5 h-5 text-sky-500" />
                <span>Custom Commercial Printing Quoting Tool</span>
              </CardTitle>
              <CardDescription>
                Calculate instant prices for corporate business cards, letterheads, continuous forms, rubber stamps, and brochures.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCalculatePrintCost} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Print Product Type</Label>
                    <select
                      value={printType}
                      onChange={(e) => setPrintType(e.target.value)}
                      className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs font-semibold"
                    >
                      <option value="business_cards">Business Cards (Spot UV / Foil)</option>
                      <option value="letterheads">Corporate Letterheads (A4)</option>
                      <option value="brochures">Tri-fold Corporate Brochures</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Paper Weight / Finish</Label>
                    <select
                      value={paperWeight}
                      onChange={(e) => setPaperWeight(e.target.value)}
                      className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs font-semibold"
                    >
                      <option value="300gsm">300 GSM Matte / Gloss</option>
                      <option value="350gsm">350 GSM Heavy Cardstock</option>
                      <option value="100gsm">100 GSM Bond Paper</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Print Quantity (Units):</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">{quantity.toLocaleString()} Units</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-xl py-5 font-semibold">
                  Calculate Commercial Print Quote
                </Button>

                {calculatedPrintCost !== null && (
                  <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-center space-y-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Estimated Custom Printing Quote:</span>
                    <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
                      ${calculatedPrintCost.toLocaleString()} <span className="text-sm font-normal text-slate-500">USD</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Includes color proofing, high-resolution offset printing, and trimming.</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Monthly Supply Reorder Setup */}
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Repeat className="w-5 h-5 text-emerald-500" />
                <span>Automated Recurring Supply Replenishment</span>
              </CardTitle>
              <CardDescription>
                Setup monthly or quarterly automated stationery delivery for your office or school.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleProcurementSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Organization Name</Label>
                    <Input
                      required
                      value={procurementForm.orgName}
                      onChange={(e) => setProcurementForm({ ...procurementForm, orgName: e.target.value })}
                      placeholder="e.g. Central Bank of Liberia"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Account Email</Label>
                    <Input
                      required
                      type="email"
                      value={procurementForm.email}
                      onChange={(e) => setProcurementForm({ ...procurementForm, email: e.target.value })}
                      placeholder="procurement@organization.org"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Contact Phone</Label>
                    <Input
                      required
                      value={procurementForm.phone}
                      onChange={(e) => setProcurementForm({ ...procurementForm, phone: e.target.value })}
                      placeholder="+231 77 000 0000"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Delivery Frequency</Label>
                    <select
                      value={procurementForm.deliveryFrequency}
                      onChange={(e) => setProcurementForm({ ...procurementForm, deliveryFrequency: e.target.value })}
                      className="w-full mt-1.5 p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs font-semibold"
                    >
                      <option value="Monthly">Monthly Replenishment</option>
                      <option value="Bi-Weekly">Bi-Weekly Delivery</option>
                      <option value="Quarterly">Quarterly Bulk Supply</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Standing Order & Delivery Instructions</Label>
                  <textarea
                    rows={3}
                    value={procurementForm.notes}
                    onChange={(e) => setProcurementForm({ ...procurementForm, notes: e.target.value })}
                    placeholder="Specify building floor, authorized receiver name, standing items list..."
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-5 font-semibold">
                  Activate Recurring Stationery Supply
                </Button>
              </form>
            </CardContent>
          </Card>

        </section>
      </main>

      <Footer />
    </div>
  );
}
