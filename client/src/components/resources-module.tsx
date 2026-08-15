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
  Package, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  Truck,
  Wrench,
  Warehouse,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";

interface Equipment {
  id: string;
  name: string;
  type: "Tractor" | "Harvester" | "Planter" | "Cultivator" | "Sprayer" | "Other";
  brand: string;
  model: string;
  year: number;
  serialNumber: string;
  status: "Active" | "Maintenance" | "Repair" | "Retired";
  location: string;
  value: number;
  purchaseDate: string;
  hoursUsed: number;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelType: string;
  notes: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: "Seeds" | "Fertilizer" | "Chemicals" | "Feed" | "Supplies" | "Parts";
  brand: string;
  sku: string;
  currentStock: number;
  unit: "lbs" | "gallons" | "bags" | "boxes" | "pieces";
  minStock: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  location: string;
  supplier: string;
  lastRestocked: string;
  expirationDate?: string;
  notes: string;
}

interface Warehouse {
  id: string;
  name: string;
  location: string;
  type: "Storage" | "Feed Storage" | "Equipment Shed" | "Chemical Storage" | "Cold Storage";
  capacity: number;
  currentUtilization: number;
  temperature?: number;
  humidity?: number;
  ventilation: boolean;
  security: boolean;
  notes: string;
}

export default function ResourcesModule() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false);
  const [showAddInventoryDialog, setShowAddInventoryDialog] = useState(false);
  const [showAddWarehouseDialog, setShowAddWarehouseDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: "",
    type: "Tractor",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    serialNumber: "",
    status: "Active",
    location: "",
    value: 0,
    purchaseDate: format(new Date(), "yyyy-MM-dd"),
    hoursUsed: 0,
    lastMaintenance: "",
    nextMaintenance: "",
    fuelType: "",
    notes: ""
  });

  const [newInventoryItem, setNewInventoryItem] = useState<Partial<InventoryItem>>({
    name: "",
    category: "Seeds",
    brand: "",
    sku: "",
    currentStock: 0,
    unit: "lbs",
    minStock: 0,
    maxStock: 0,
    unitCost: 0,
    totalValue: 0,
    location: "",
    supplier: "",
    lastRestocked: format(new Date(), "yyyy-MM-dd"),
    expirationDate: "",
    notes: ""
  });

  const [newWarehouse, setNewWarehouse] = useState<Partial<Warehouse>>({
    name: "",
    location: "",
    type: "Storage",
    capacity: 0,
    currentUtilization: 0,
    temperature: 0,
    humidity: 0,
    ventilation: true,
    security: true,
    notes: ""
  });

  // Sample data initialization
  useEffect(() => {
    const sampleEquipment: Equipment[] = [
      {
        id: "1",
        name: "John Deere 6120R",
        type: "Tractor",
        brand: "John Deere",
        model: "6120R",
        year: 2020,
        serialNumber: "JD123456789",
        status: "Active",
        location: "Equipment Shed A",
        value: 85000,
        purchaseDate: "2020-03-15",
        hoursUsed: 1245,
        lastMaintenance: "2024-06-15",
        nextMaintenance: "2024-08-15",
        fuelType: "Diesel",
        notes: "Primary field tractor, excellent condition"
      },
      {
        id: "2",
        name: "Case IH 7240",
        type: "Harvester",
        brand: "Case IH",
        model: "7240",
        year: 2018,
        serialNumber: "CIH987654321",
        status: "Maintenance",
        location: "Equipment Shed B",
        value: 320000,
        purchaseDate: "2018-08-22",
        hoursUsed: 2890,
        lastMaintenance: "2024-07-01",
        nextMaintenance: "2024-07-15",
        fuelType: "Diesel",
        notes: "Annual maintenance in progress"
      },
      {
        id: "3",
        name: "Kinze 3660",
        type: "Planter",
        brand: "Kinze",
        model: "3660",
        year: 2019,
        serialNumber: "KZ555666777",
        status: "Active",
        location: "Equipment Shed A",
        value: 145000,
        purchaseDate: "2019-02-10",
        hoursUsed: 456,
        lastMaintenance: "2024-04-01",
        nextMaintenance: "2025-04-01",
        fuelType: "Hydraulic",
        notes: "16-row planter, GPS enabled"
      }
    ];

    const sampleInventory: InventoryItem[] = [
      {
        id: "1",
        name: "Corn Seed - Pioneer P1234",
        category: "Seeds",
        brand: "Pioneer",
        sku: "P1234-50LB",
        currentStock: 25,
        unit: "bags",
        minStock: 10,
        maxStock: 50,
        unitCost: 280,
        totalValue: 7000,
        location: "Warehouse A",
        supplier: "Pioneer Hi-Bred",
        lastRestocked: "2024-03-01",
        expirationDate: "2025-12-31",
        notes: "High-yield corn variety for wet conditions"
      },
      {
        id: "2",
        name: "10-10-10 Fertilizer",
        category: "Fertilizer",
        brand: "Agrium",
        sku: "AGR-101010-50",
        currentStock: 150,
        unit: "bags",
        minStock: 50,
        maxStock: 200,
        unitCost: 25,
        totalValue: 3750,
        location: "Fertilizer Storage",
        supplier: "Agrium Inc.",
        lastRestocked: "2024-04-15",
        notes: "General purpose NPK fertilizer"
      },
      {
        id: "3",
        name: "2,4-D Herbicide",
        category: "Chemicals",
        brand: "Dow AgroSciences",
        sku: "DOW-24D-2.5GAL",
        currentStock: 8,
        unit: "gallons",
        minStock: 5,
        maxStock: 20,
        unitCost: 45,
        totalValue: 360,
        location: "Chemical Storage",
        supplier: "Dow AgroSciences",
        lastRestocked: "2024-05-10",
        expirationDate: "2026-05-01",
        notes: "Broadleaf herbicide - handle with care"
      },
      {
        id: "4",
        name: "Dairy Feed Mix",
        category: "Feed",
        brand: "Purina",
        sku: "PUR-DAIRY-50LB",
        currentStock: 45,
        unit: "bags",
        minStock: 20,
        maxStock: 100,
        unitCost: 18,
        totalValue: 810,
        location: "Feed Storage",
        supplier: "Purina Mills",
        lastRestocked: "2024-07-05",
        notes: "Complete nutrition for lactating dairy cows"
      }
    ];

    const sampleWarehouses: Warehouse[] = [
      {
        id: "1",
        name: "Warehouse A",
        location: "North Section",
        type: "Storage",
        capacity: 5000,
        currentUtilization: 3200,
        temperature: 72,
        humidity: 45,
        ventilation: true,
        security: true,
        notes: "Main storage for seeds and general supplies"
      },
      {
        id: "2",
        name: "Chemical Storage",
        location: "South Section",
        type: "Chemical Storage",
        capacity: 500,
        currentUtilization: 150,
        temperature: 68,
        humidity: 40,
        ventilation: true,
        security: true,
        notes: "Climate-controlled chemical storage with safety systems"
      },
      {
        id: "3",
        name: "Equipment Shed A",
        location: "Central Area",
        type: "Equipment Shed",
        capacity: 10000,
        currentUtilization: 7500,
        ventilation: false,
        security: true,
        notes: "Primary equipment storage and maintenance area"
      }
    ];

    setEquipment(sampleEquipment);
    setInventory(sampleInventory);
    setWarehouses(sampleWarehouses);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800";
      case "Repair": return "bg-red-100 text-red-800";
      case "Retired": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.currentStock <= item.minStock);
  };

  const getStockStatusColor = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return "bg-red-100 text-red-800";
    if (item.currentStock <= item.minStock * 1.5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const totalEquipmentValue = equipment.reduce((sum, eq) => sum + eq.value, 0);
  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const activeEquipment = equipment.filter(eq => eq.status === "Active").length;
  const lowStockCount = getLowStockItems().length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Resource Management</h2>
          <p className="text-gray-600">Manage equipment, inventory, and warehouses</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddEquipmentDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
          <Button onClick={() => setShowAddInventoryDialog(true)} variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Add Inventory
          </Button>
          <Button onClick={() => setShowAddWarehouseDialog(true)} variant="outline">
            <Warehouse className="h-4 w-4 mr-2" />
            Add Warehouse
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Equipment Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalEquipmentValue.toLocaleString()}</p>
              </div>
              <Truck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Equipment</p>
                <p className="text-2xl font-bold text-gray-900">{activeEquipment}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalInventoryValue.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Alerts and Notifications */}
          {lowStockCount > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 mb-3">
                  {lowStockCount} item(s) are running low on stock:
                </p>
                <div className="space-y-2">
                  {getLowStockItems().slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-orange-600">
                        {item.currentStock} {item.unit} (Min: {item.minStock})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Equipment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                Equipment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {equipment.slice(0, 6).map((eq) => (
                  <div key={eq.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{eq.name}</h4>
                      <Badge className={getStatusColor(eq.status)}>
                        {eq.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Type: {eq.type}</p>
                      <p>Hours: {eq.hoursUsed.toLocaleString()}</p>
                      <p>Location: {eq.location}</p>
                      <p>Value: ${eq.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Inventory Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {inventory.slice(0, 8).map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-sm">{item.name}</h5>
                      <Badge className={getStockStatusColor(item)} variant="outline">
                        {item.currentStock <= item.minStock ? "Low" : "OK"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>Stock: {item.currentStock} {item.unit}</p>
                      <p>Value: ${item.totalValue}</p>
                      <p>Location: {item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((eq) => (
              <Card key={eq.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{eq.name}</CardTitle>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{eq.brand} {eq.model}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(eq.status)}>
                      {eq.status}
                    </Badge>
                    <span className="text-sm text-gray-600">{eq.year}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{eq.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hours:</span>
                      <span className="font-medium">{eq.hoursUsed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{eq.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">${eq.value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Maintenance:</span>
                      <span className="font-medium">{eq.nextMaintenance}</span>
                    </div>
                  </div>

                  {eq.notes && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      {eq.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{item.brand}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{item.category}</Badge>
                    <Badge className={getStockStatusColor(item)}>
                      {item.currentStock <= item.minStock ? "Low Stock" : "In Stock"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Stock:</span>
                      <span className="font-medium">{item.currentStock} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Stock:</span>
                      <span className="font-medium">{item.minStock} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unit Cost:</span>
                      <span className="font-medium">${item.unitCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-medium">${item.totalValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{item.location}</span>
                    </div>
                  </div>

                  {item.expirationDate && (
                    <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                      Expires: {item.expirationDate}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouses.map((warehouse) => (
              <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{warehouse.location}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="outline">{warehouse.type}</Badge>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Utilization:</span>
                      <span className="font-medium">
                        {warehouse.currentUtilization}/{warehouse.capacity} sq ft
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((warehouse.currentUtilization / warehouse.capacity) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    {warehouse.temperature && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temperature:</span>
                        <span className="font-medium">{warehouse.temperature}°F</span>
                      </div>
                    )}
                    {warehouse.humidity && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Humidity:</span>
                        <span className="font-medium">{warehouse.humidity}%</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ventilation:</span>
                      <span className="font-medium">{warehouse.ventilation ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security:</span>
                      <span className="font-medium">{warehouse.security ? "Yes" : "No"}</span>
                    </div>
                  </div>

                  {warehouse.notes && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      {warehouse.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Equipment Dialog */}
      <Dialog open={showAddEquipmentDialog} onOpenChange={setShowAddEquipmentDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
            <DialogDescription>
              Add new equipment to your farm inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipmentName">Equipment Name</Label>
                <Input
                  id="equipmentName"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                  placeholder="e.g., John Deere 6120R"
                />
              </div>
              <div>
                <Label htmlFor="equipmentType">Type</Label>
                <Select value={newEquipment.type} onValueChange={(value) => setNewEquipment({...newEquipment, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tractor">Tractor</SelectItem>
                    <SelectItem value="Harvester">Harvester</SelectItem>
                    <SelectItem value="Planter">Planter</SelectItem>
                    <SelectItem value="Cultivator">Cultivator</SelectItem>
                    <SelectItem value="Sprayer">Sprayer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={newEquipment.brand}
                  onChange={(e) => setNewEquipment({...newEquipment, brand: e.target.value})}
                  placeholder="e.g., John Deere"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={newEquipment.model}
                  onChange={(e) => setNewEquipment({...newEquipment, model: e.target.value})}
                  placeholder="e.g., 6120R"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={newEquipment.year}
                  onChange={(e) => setNewEquipment({...newEquipment, year: Number(e.target.value)})}
                  placeholder="2020"
                />
              </div>
              <div>
                <Label htmlFor="value">Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  value={newEquipment.value}
                  onChange={(e) => setNewEquipment({...newEquipment, value: Number(e.target.value)})}
                  placeholder="85000"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddEquipmentDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Equipment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}