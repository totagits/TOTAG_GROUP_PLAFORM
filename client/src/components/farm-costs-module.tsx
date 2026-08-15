import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Plus, Trash2, TrendingUp, TrendingDown, DollarSign, BarChart3,
  Users, Sprout, Beef, Zap, Truck, Droplets, Wrench, Edit
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type CostCategory =
  | "Labor"
  | "Seeds & Planting"
  | "Animal Feed & Vet"
  | "Fertilizers & Pesticides"
  | "Fuel & Equipment"
  | "Utilities"
  | "Transport & Logistics";

interface CostEntry {
  id: string;
  category: CostCategory;
  description: string;
  amount: number;
  date: string;
  crop?: string;
  notes?: string;
  source: "manual" | "auto-labor";
}

interface SaleEntry {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalRevenue: number;
  date: string;
  buyer?: string;
  notes?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const COSTS_KEY = "farm_cost_entries";
const SALES_KEY = "farm_sale_entries";

const CATEGORIES: { value: CostCategory; icon: any; color: string }[] = [
  { value: "Labor",                    icon: Users,   color: "bg-blue-100 text-blue-800" },
  { value: "Seeds & Planting",         icon: Sprout,  color: "bg-green-100 text-green-800" },
  { value: "Animal Feed & Vet",        icon: Beef,    color: "bg-yellow-100 text-yellow-800" },
  { value: "Fertilizers & Pesticides", icon: Droplets,color: "bg-emerald-100 text-emerald-800" },
  { value: "Fuel & Equipment",         icon: Wrench,  color: "bg-orange-100 text-orange-800" },
  { value: "Utilities",                icon: Zap,     color: "bg-purple-100 text-purple-800" },
  { value: "Transport & Logistics",    icon: Truck,   color: "bg-indigo-100 text-indigo-800" },
];

const CROPS = ["Cassava", "Rice", "Maize", "Vegetables", "Palm Oil", "Rubber", "Livestock", "Poultry", "General / Mixed"];

const DEMO_COSTS: CostEntry[] = [
  { id: "c1", category: "Seeds & Planting",         description: "Cassava stems – 2 bags",        amount: 120,  date: "2026-05-01", crop: "Cassava",     source: "manual" },
  { id: "c2", category: "Fertilizers & Pesticides", description: "NPK fertilizer 50kg",           amount: 85,   date: "2026-05-03", crop: "Rice",        source: "manual" },
  { id: "c3", category: "Animal Feed & Vet",        description: "Cattle feed supplement – 5 bags",amount: 210, date: "2026-05-05", crop: "Livestock",   source: "manual" },
  { id: "c4", category: "Fuel & Equipment",         description: "Diesel for tractor – 40L",       amount: 62,  date: "2026-05-08", crop: "General / Mixed", source: "manual" },
  { id: "c5", category: "Utilities",                description: "Electricity (irrigation pump)",  amount: 45,  date: "2026-05-10", crop: "General / Mixed", source: "manual" },
  { id: "c6", category: "Transport & Logistics",    description: "Market delivery – Monrovia",     amount: 55,  date: "2026-05-15", crop: "Vegetables",  source: "manual" },
  { id: "c7", category: "Labor",                    description: "Auto: Farm Staff – 96 hrs @ $5", amount: 480, date: "2026-05-27", crop: "General / Mixed", source: "auto-labor" },
  { id: "c8", category: "Labor",                    description: "Auto: Farm Manager – 40 hrs @ $8",amount: 320,date: "2026-05-27", crop: "General / Mixed", source: "auto-labor" },
];

const DEMO_SALES: SaleEntry[] = [
  { id: "s1", product: "Cassava",    quantity: 200,  unit: "kg",  pricePerUnit: 1.20, totalRevenue: 240,  date: "2026-05-20", buyer: "Local Market" },
  { id: "s2", product: "Vegetables", quantity: 50,   unit: "kg",  pricePerUnit: 2.50, totalRevenue: 125,  date: "2026-05-22", buyer: "Buyers Co-op" },
  { id: "s3", product: "Livestock",  quantity: 3,    unit: "head",pricePerUnit: 180,  totalRevenue: 540,  date: "2026-05-24", buyer: "Direct Sale" },
  { id: "s4", product: "Palm Oil",   quantity: 100,  unit: "L",   pricePerUnit: 2.00, totalRevenue: 200,  date: "2026-05-25", buyer: "Online Order #TF-001" },
];

// ─── Component ──────────────────────────────────────────────────────────────

interface FarmCostsModuleProps {
  userRole?: string;
}

export default function FarmCostsModule({ userRole = "manager" }: FarmCostsModuleProps) {
  const isManager = userRole === "manager" || userRole === "admin";

  const [costs, setCosts]   = useState<CostEntry[]>([]);
  const [sales, setSales]   = useState<SaleEntry[]>([]);
  const [showCostDialog,  setShowCostDialog]  = useState(false);
  const [showSaleDialog,  setShowSaleDialog]  = useState(false);
  const [editCost, setEditCost] = useState<Partial<CostEntry>>({});
  const [editSale, setEditSale] = useState<Partial<SaleEntry>>({});
  const [filterCrop, setFilterCrop] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  useEffect(() => {
    const savedCosts = localStorage.getItem(COSTS_KEY);
    const savedSales = localStorage.getItem(SALES_KEY);
    setCosts(savedCosts ? JSON.parse(savedCosts) : DEMO_COSTS);
    setSales(savedSales ? JSON.parse(savedSales) : DEMO_SALES);
    if (!savedCosts) localStorage.setItem(COSTS_KEY, JSON.stringify(DEMO_COSTS));
    if (!savedSales) localStorage.setItem(SALES_KEY, JSON.stringify(DEMO_SALES));
  }, []);

  // Pull labor costs from timesheet entries automatically
  useEffect(() => {
    try {
      const tsEntries = JSON.parse(localStorage.getItem("farm_time_entries") || "[]");
      const approvedOrPaid = tsEntries.filter((e: any) => e.status === "approved" || e.status === "paid");
      const byWorker: Record<string, { hours: number; pay: number; rate: number }> = {};
      approvedOrPaid.forEach((e: any) => {
        if (!byWorker[e.worker]) byWorker[e.worker] = { hours: 0, pay: 0, rate: e.hourlyRate };
        byWorker[e.worker].hours += (e.duration || 0) / 60;
        byWorker[e.worker].pay   += e.totalPay;
      });
      const autoLabor: CostEntry[] = Object.entries(byWorker).map(([worker, data], i) => ({
        id: `auto-labor-${worker.replace(/\s/g, "-").toLowerCase()}`,
        category: "Labor" as CostCategory,
        description: `Auto: ${worker} – ${data.hours.toFixed(1)}h @ $${data.rate.toFixed(2)}/hr`,
        amount: Math.round(data.pay * 100) / 100,
        date: new Date().toISOString().split("T")[0],
        crop: "General / Mixed",
        source: "auto-labor" as const,
      }));
      if (autoLabor.length > 0) {
        setCosts(prev => {
          const withoutOldAuto = prev.filter(c => c.source !== "auto-labor");
          return [...withoutOldAuto, ...autoLabor];
        });
      }
    } catch {}
  }, []);

  const persist = (c: CostEntry[], s: SaleEntry[]) => {
    localStorage.setItem(COSTS_KEY, JSON.stringify(c));
    localStorage.setItem(SALES_KEY, JSON.stringify(s));
  };

  const saveCost = () => {
    if (!editCost.description || !editCost.amount || !editCost.category) return;
    const entry: CostEntry = {
      id: editCost.id || Date.now().toString(),
      category: editCost.category as CostCategory,
      description: editCost.description!,
      amount: Number(editCost.amount),
      date: editCost.date || new Date().toISOString().split("T")[0],
      crop: editCost.crop || "General / Mixed",
      notes: editCost.notes,
      source: "manual",
    };
    const updated = editCost.id
      ? costs.map(c => c.id === entry.id ? entry : c)
      : [entry, ...costs];
    setCosts(updated);
    persist(updated, sales);
    setShowCostDialog(false);
    setEditCost({});
  };

  const saveSale = () => {
    if (!editSale.product || !editSale.quantity || !editSale.pricePerUnit) return;
    const entry: SaleEntry = {
      id: editSale.id || Date.now().toString(),
      product: editSale.product!,
      quantity: Number(editSale.quantity),
      unit: editSale.unit || "kg",
      pricePerUnit: Number(editSale.pricePerUnit),
      totalRevenue: Number(editSale.quantity) * Number(editSale.pricePerUnit),
      date: editSale.date || new Date().toISOString().split("T")[0],
      buyer: editSale.buyer,
      notes: editSale.notes,
    };
    const updated = editSale.id
      ? sales.map(s => s.id === entry.id ? entry : s)
      : [entry, ...sales];
    setSales(updated);
    persist(costs, updated);
    setShowSaleDialog(false);
    setEditSale({});
  };

  const deleteCost = (id: string) => { const u = costs.filter(c => c.id !== id); setCosts(u); persist(u, sales); };
  const deleteSale = (id: string) => { const u = sales.filter(s => s.id !== id); setSales(u); persist(costs, u); };

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filterByPeriod = <T extends { date: string }>(arr: T[]) => {
    if (filterPeriod === "all") return arr;
    const now = new Date();
    return arr.filter(item => {
      const d = new Date(item.date);
      if (filterPeriod === "week") {
        const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      if (filterPeriod === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      return true;
    });
  };

  const filteredCosts = filterByPeriod(costs).filter(c => filterCrop === "all" || c.crop === filterCrop);
  const filteredSales = filterByPeriod(sales);

  const totalCosts   = filteredCosts.reduce((s, c) => s + c.amount, 0);
  const totalRevenue = filteredSales.reduce((s, r) => s + r.totalRevenue, 0);
  const grossProfit  = totalRevenue - totalCosts;
  const margin       = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Costs by category
  const byCat = CATEGORIES.map(cat => ({
    ...cat,
    total: filteredCosts.filter(c => c.category === cat.value).reduce((s, c) => s + c.amount, 0),
  })).filter(c => c.total > 0);

  const getCatStyle = (cat: string) => CATEGORIES.find(c => c.value === cat)?.color || "bg-gray-100 text-gray-700";
  const getCatIcon  = (cat: string) => CATEGORIES.find(c => c.value === cat)?.icon || DollarSign;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Production Costs & Profit/Loss</h2>
          <p className="text-sm text-gray-500">Track all inputs and revenue to calculate real farm profitability.</p>
        </div>
        {isManager && (
          <div className="flex gap-2">
            <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => { setEditCost({}); setShowCostDialog(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Cost
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => { setEditSale({}); setShowSaleDialog(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Record Sale
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Period" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCrop} onValueChange={setFilterCrop}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Crop / Product" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crops</SelectItem>
            {CROPS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* P&L Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-5 text-center">
            <p className="text-xs font-medium text-red-600 mb-1">Total Costs</p>
            <p className="text-2xl font-bold text-red-700">${totalCosts.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-5 text-center">
            <p className="text-xs font-medium text-green-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-700">${totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className={`${grossProfit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-orange-50 border-orange-200"}`}>
          <CardContent className="p-5 text-center">
            <p className={`text-xs font-medium mb-1 ${grossProfit >= 0 ? "text-emerald-600" : "text-orange-600"}`}>
              {grossProfit >= 0 ? "Gross Profit" : "Net Loss"}
            </p>
            <p className={`text-2xl font-bold flex items-center justify-center gap-1 ${grossProfit >= 0 ? "text-emerald-700" : "text-orange-700"}`}>
              {grossProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              ${Math.abs(grossProfit).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-5 text-center">
            <p className="text-xs font-medium text-blue-600 mb-1">Profit Margin</p>
            <p className={`text-2xl font-bold ${margin >= 0 ? "text-blue-700" : "text-red-600"}`}>{margin.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown Mini Chart */}
      {byCat.length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Cost Breakdown by Category</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {byCat.sort((a, b) => b.total - a.total).map(cat => {
                const pct = totalCosts > 0 ? (cat.total / totalCosts) * 100 : 0;
                const Icon = cat.icon;
                return (
                  <div key={cat.value}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-sm font-medium">{cat.value}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{pct.toFixed(1)}%</span>
                        <span className="text-sm font-semibold">${cat.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="costs">
        <TabsList>
          <TabsTrigger value="costs">Cost Entries ({filteredCosts.length})</TabsTrigger>
          <TabsTrigger value="sales">Sales / Revenue ({filteredSales.length})</TabsTrigger>
          <TabsTrigger value="pl">P&amp;L Report</TabsTrigger>
        </TabsList>

        {/* ── Cost Entries ────────────────────────────────────────────────── */}
        <TabsContent value="costs" className="space-y-3">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Crop / Product</TableHead>
                    <TableHead>Amount</TableHead>
                    {isManager && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCosts.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400">No cost entries found.</TableCell></TableRow>
                  )}
                  {filteredCosts.map(cost => {
                    const Icon = getCatIcon(cost.category);
                    return (
                      <TableRow key={cost.id}>
                        <TableCell className="text-xs whitespace-nowrap">{new Date(cost.date + "T00:00:00").toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getCatStyle(cost.category)}`}>
                            {cost.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {cost.source === "auto-labor" && <span className="text-blue-600 text-xs mr-1">[Auto]</span>}
                          {cost.description}
                        </TableCell>
                        <TableCell className="text-sm">{cost.crop || "—"}</TableCell>
                        <TableCell className="font-semibold text-red-600">${cost.amount.toFixed(2)}</TableCell>
                        {isManager && (
                          <TableCell>
                            {cost.source !== "auto-labor" && (
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditCost(cost); setShowCostDialog(true); }}><Edit className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteCost(cost.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                              </div>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Sales ────────────────────────────────────────────────────────── */}
        <TabsContent value="sales" className="space-y-3">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price/Unit</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Buyer</TableHead>
                    {isManager && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">No sales recorded.</TableCell></TableRow>
                  )}
                  {filteredSales.map(sale => (
                    <TableRow key={sale.id}>
                      <TableCell className="text-xs whitespace-nowrap">{new Date(sale.date + "T00:00:00").toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{sale.product}</TableCell>
                      <TableCell>{sale.quantity} {sale.unit}</TableCell>
                      <TableCell>${sale.pricePerUnit.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold text-green-600">${sale.totalRevenue.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-gray-500">{sale.buyer || "—"}</TableCell>
                      {isManager && (
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditSale(sale); setShowSaleDialog(true); }}><Edit className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteSale(sale.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── P&L Report ──────────────────────────────────────────────────── */}
        <TabsContent value="pl" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Profit & Loss Statement</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableBody>
                  <TableRow className="bg-green-50">
                    <TableCell colSpan={2} className="font-bold text-green-800 text-sm">REVENUE</TableCell>
                  </TableRow>
                  {filteredSales.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="pl-6 text-sm">{s.product} — {s.quantity} {s.unit}</TableCell>
                      <TableCell className="text-right font-medium text-green-700">${s.totalRevenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 font-bold">
                    <TableCell className="pl-6">Total Revenue</TableCell>
                    <TableCell className="text-right text-green-700">${totalRevenue.toFixed(2)}</TableCell>
                  </TableRow>

                  <TableRow className="bg-red-50 border-t-4">
                    <TableCell colSpan={2} className="font-bold text-red-800 text-sm">COSTS</TableCell>
                  </TableRow>
                  {CATEGORIES.map(cat => {
                    const catTotal = filteredCosts.filter(c => c.category === cat.value).reduce((s, c) => s + c.amount, 0);
                    if (catTotal === 0) return null;
                    return (
                      <TableRow key={cat.value}>
                        <TableCell className="pl-6 text-sm">{cat.value}</TableCell>
                        <TableCell className="text-right font-medium text-red-600">${catTotal.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="border-t-2 font-bold">
                    <TableCell className="pl-6">Total Costs</TableCell>
                    <TableCell className="text-right text-red-600">${totalCosts.toFixed(2)}</TableCell>
                  </TableRow>

                  <TableRow className={`border-t-4 text-lg font-bold ${grossProfit >= 0 ? "bg-emerald-50" : "bg-orange-50"}`}>
                    <TableCell>{grossProfit >= 0 ? "NET PROFIT" : "NET LOSS"}</TableCell>
                    <TableCell className={`text-right text-xl ${grossProfit >= 0 ? "text-emerald-700" : "text-orange-700"}`}>
                      {grossProfit >= 0 ? "+" : "-"}${Math.abs(grossProfit).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="text-sm text-gray-500">
                    <TableCell>Profit Margin</TableCell>
                    <TableCell className="text-right">{margin.toFixed(1)}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add / Edit Cost Dialog */}
      <Dialog open={showCostDialog} onOpenChange={v => { setShowCostDialog(v); if (!v) setEditCost({}); }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>{editCost.id ? "Edit Cost Entry" : "Add Cost Entry"}</DialogTitle>
            <DialogDescription>Record a farm expense. Labor costs are auto-populated from approved timesheets.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={editCost.category} onValueChange={v => setEditCost({ ...editCost, category: v as CostCategory })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.value}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Crop / Product</Label>
                <Select value={editCost.crop} onValueChange={v => setEditCost({ ...editCost, crop: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{CROPS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input value={editCost.description || ""} onChange={e => setEditCost({ ...editCost, description: e.target.value })} placeholder="e.g. NPK fertilizer 50kg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Amount ($)</Label>
                <Input type="number" step="0.01" min="0" value={editCost.amount || ""} onChange={e => setEditCost({ ...editCost, amount: Number(e.target.value) })} placeholder="0.00" />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={editCost.date || new Date().toISOString().split("T")[0]} onChange={e => setEditCost({ ...editCost, date: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea value={editCost.notes || ""} onChange={e => setEditCost({ ...editCost, notes: e.target.value })} rows={2} />
            </div>
            <Button onClick={saveCost} className="w-full bg-red-600 hover:bg-red-700">
              {editCost.id ? "Update Cost" : "Add Cost Entry"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Sale Dialog */}
      <Dialog open={showSaleDialog} onOpenChange={v => { setShowSaleDialog(v); if (!v) setEditSale({}); }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>{editSale.id ? "Edit Sale" : "Record a Sale"}</DialogTitle>
            <DialogDescription>Record revenue from produce sold at the market or directly.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Product</Label>
                <Input value={editSale.product || ""} onChange={e => setEditSale({ ...editSale, product: e.target.value })} placeholder="e.g. Cassava" />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={editSale.unit || "kg"} onValueChange={v => setEditSale({ ...editSale, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["kg", "L", "bag", "head", "dozen", "crate", "tonne"].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Quantity</Label>
                <Input type="number" min="0" value={editSale.quantity || ""} onChange={e => setEditSale({ ...editSale, quantity: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Price per Unit ($)</Label>
                <Input type="number" step="0.01" min="0" value={editSale.pricePerUnit || ""} onChange={e => setEditSale({ ...editSale, pricePerUnit: Number(e.target.value) })} />
              </div>
            </div>
            {editSale.quantity && editSale.pricePerUnit && (
              <div className="p-3 bg-green-50 rounded text-sm text-green-800 font-medium">
                Total Revenue: ${(Number(editSale.quantity) * Number(editSale.pricePerUnit)).toFixed(2)}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Buyer / Channel</Label>
                <Input value={editSale.buyer || ""} onChange={e => setEditSale({ ...editSale, buyer: e.target.value })} placeholder="e.g. Local Market" />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={editSale.date || new Date().toISOString().split("T")[0]} onChange={e => setEditSale({ ...editSale, date: e.target.value })} />
              </div>
            </div>
            <Button onClick={saveSale} className="w-full bg-green-600 hover:bg-green-700">
              {editSale.id ? "Update Sale" : "Record Sale"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
