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
  Sprout, 
  Plus, 
  Calendar, 
  MapPin,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  TrendingUp,
  Droplets,
  Sun,
  CloudRain,
  Thermometer,
  BarChart3,
  Package
} from "lucide-react";
import { format } from "date-fns";

interface Crop {
  id: string;
  name: string;
  variety: string;
  plantingDate: string;
  expectedHarvest: string;
  location: string;
  area: number; // in acres
  stage: "Seed" | "Germination" | "Vegetative" | "Flowering" | "Fruiting" | "Harvest" | "Complete";
  status: "Healthy" | "Stressed" | "Disease" | "Pest Issues" | "Drought";
  plantingMethod: "Direct Seed" | "Transplant" | "Cutting";
  spacing: string;
  rowSpacing: string;
  population: number;
  notes: string;
  estimatedYield: number;
  actualYield?: number;
  costPerAcre: number;
  expectedRevenue: number;
}

interface Treatment {
  id: string;
  cropId: string;
  type: "Fertilizer" | "Pesticide" | "Herbicide" | "Irrigation" | "Cultivation";
  product: string;
  application: string;
  rate: string;
  date: string;
  cost: number;
  notes: string;
  weather: string;
}

interface Harvest {
  id: string;
  cropId: string;
  date: string;
  quantity: number;
  unit: "lbs" | "tons" | "bushels" | "boxes" | "kg";
  quality: "Premium" | "Standard" | "Processing" | "Damaged";
  pricePerUnit: number;
  totalRevenue: number;
  laborHours: number;
  notes: string;
}

export default function CropsModule() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddCropDialog, setShowAddCropDialog] = useState(false);
  const [showTreatmentDialog, setShowTreatmentDialog] = useState(false);
  const [showHarvestDialog, setShowHarvestDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  const [newCrop, setNewCrop] = useState<Partial<Crop>>({
    name: "",
    variety: "",
    plantingDate: format(new Date(), "yyyy-MM-dd"),
    expectedHarvest: "",
    location: "",
    area: 0,
    stage: "Seed",
    status: "Healthy",
    plantingMethod: "Direct Seed",
    spacing: "",
    rowSpacing: "",
    population: 0,
    notes: "",
    estimatedYield: 0,
    costPerAcre: 0,
    expectedRevenue: 0
  });

  const [newTreatment, setNewTreatment] = useState<Partial<Treatment>>({
    cropId: "",
    type: "Fertilizer",
    product: "",
    application: "",
    rate: "",
    date: format(new Date(), "yyyy-MM-dd"),
    cost: 0,
    notes: "",
    weather: ""
  });

  const [newHarvest, setNewHarvest] = useState<Partial<Harvest>>({
    cropId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    quantity: 0,
    unit: "lbs",
    quality: "Standard",
    pricePerUnit: 0,
    totalRevenue: 0,
    laborHours: 0,
    notes: ""
  });

  // Sample data initialization
  useEffect(() => {
    const sampleCrops: Crop[] = [
      {
        id: "1",
        name: "Corn",
        variety: "Sweet Corn Golden Bantam",
        plantingDate: "2024-04-15",
        expectedHarvest: "2024-07-20",
        location: "Field A",
        area: 5.5,
        stage: "Vegetative",
        status: "Healthy",
        plantingMethod: "Direct Seed",
        spacing: "12 inches",
        rowSpacing: "30 inches",
        population: 22000,
        notes: "Good germination rate, regular watering schedule",
        estimatedYield: 8000,
        costPerAcre: 450,
        expectedRevenue: 2400
      },
      {
        id: "2",
        name: "Tomatoes",
        variety: "Roma",
        plantingDate: "2024-05-01",
        expectedHarvest: "2024-08-15",
        location: "Greenhouse 1",
        area: 2.0,
        stage: "Flowering",
        status: "Healthy",
        plantingMethod: "Transplant",
        spacing: "18 inches",
        rowSpacing: "4 feet",
        population: 1200,
        notes: "Staked and pruned regularly, drip irrigation installed",
        estimatedYield: 15000,
        costPerAcre: 1200,
        expectedRevenue: 8000
      },
      {
        id: "3",
        name: "Wheat",
        variety: "Winter Wheat",
        plantingDate: "2023-10-15",
        expectedHarvest: "2024-07-10",
        location: "Field B",
        area: 15.0,
        stage: "Fruiting",
        status: "Healthy",
        plantingMethod: "Direct Seed",
        spacing: "7 inches",
        rowSpacing: "7 inches",
        population: 1500000,
        notes: "Excellent winter survival, good stand density",
        estimatedYield: 45000,
        actualYield: 42000,
        costPerAcre: 320,
        expectedRevenue: 24000
      }
    ];

    const sampleTreatments: Treatment[] = [
      {
        id: "1",
        cropId: "1",
        type: "Fertilizer",
        product: "10-10-10 NPK",
        application: "Broadcast",
        rate: "200 lbs/acre",
        date: "2024-05-01",
        cost: 150,
        notes: "Applied before rain forecast",
        weather: "Cloudy, 65°F"
      },
      {
        id: "2",
        cropId: "2",
        type: "Pesticide",
        product: "Organic Insect Spray",
        application: "Foliar",
        rate: "2 oz/gallon",
        date: "2024-06-15",
        cost: 85,
        notes: "Applied for aphid control",
        weather: "Clear, 72°F"
      }
    ];

    const sampleHarvests: Harvest[] = [
      {
        id: "1",
        cropId: "3",
        date: "2024-07-10",
        quantity: 42000,
        unit: "lbs",
        quality: "Premium",
        pricePerUnit: 0.15,
        totalRevenue: 6300,
        laborHours: 24,
        notes: "Excellent quality, good moisture content"
      }
    ];

    setCrops(sampleCrops);
    setTreatments(sampleTreatments);
    setHarvests(sampleHarvests);
  }, []);

  const addCrop = () => {
    if (newCrop.name && newCrop.variety && newCrop.plantingDate) {
      const crop: Crop = {
        id: (crops.length + 1).toString(),
        name: newCrop.name,
        variety: newCrop.variety || "",
        plantingDate: newCrop.plantingDate,
        expectedHarvest: newCrop.expectedHarvest || "",
        location: newCrop.location || "",
        area: newCrop.area || 0,
        stage: newCrop.stage || "Seed",
        status: newCrop.status || "Healthy",
        plantingMethod: newCrop.plantingMethod || "Direct Seed",
        spacing: newCrop.spacing || "",
        rowSpacing: newCrop.rowSpacing || "",
        population: newCrop.population || 0,
        notes: newCrop.notes || "",
        estimatedYield: newCrop.estimatedYield || 0,
        costPerAcre: newCrop.costPerAcre || 0,
        expectedRevenue: newCrop.expectedRevenue || 0
      };

      setCrops([...crops, crop]);
      setNewCrop({
        name: "",
        variety: "",
        plantingDate: format(new Date(), "yyyy-MM-dd"),
        expectedHarvest: "",
        location: "",
        area: 0,
        stage: "Seed",
        status: "Healthy",
        plantingMethod: "Direct Seed",
        spacing: "",
        rowSpacing: "",
        population: 0,
        notes: "",
        estimatedYield: 0,
        costPerAcre: 0,
        expectedRevenue: 0
      });
      setShowAddCropDialog(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Seed": return "bg-gray-100 text-gray-800";
      case "Germination": return "bg-yellow-100 text-yellow-800";
      case "Vegetative": return "bg-green-100 text-green-800";
      case "Flowering": return "bg-purple-100 text-purple-800";
      case "Fruiting": return "bg-orange-100 text-orange-800";
      case "Harvest": return "bg-blue-100 text-blue-800";
      case "Complete": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy": return "bg-green-100 text-green-800";
      case "Stressed": return "bg-yellow-100 text-yellow-800";
      case "Disease": return "bg-red-100 text-red-800";
      case "Pest Issues": return "bg-orange-100 text-orange-800";
      case "Drought": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAcres = crops.reduce((sum, crop) => sum + crop.area, 0);
  const totalRevenue = harvests.reduce((sum, harvest) => sum + harvest.totalRevenue, 0);
  const activeCrops = crops.filter(crop => crop.stage !== "Complete").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Crop Management</h2>
          <p className="text-gray-600">Manage plantings, treatments, and harvests</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddCropDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Planting
          </Button>
          <Button onClick={() => setShowTreatmentDialog(true)} variant="outline">
            <Droplets className="h-4 w-4 mr-2" />
            Add Treatment
          </Button>
          <Button onClick={() => setShowHarvestDialog(true)} variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Record Harvest
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Acres</p>
                <p className="text-2xl font-bold text-gray-900">{totalAcres}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Crops</p>
                <p className="text-2xl font-bold text-gray-900">{activeCrops}</p>
              </div>
              <Sprout className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Treatments</p>
                <p className="text-2xl font-bold text-gray-900">{treatments.length}</p>
              </div>
              <Droplets className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="crops">My Crops</TabsTrigger>
          <TabsTrigger value="treatments">Treatments</TabsTrigger>
          <TabsTrigger value="harvests">Harvests</TabsTrigger>
          <TabsTrigger value="planning">Crop Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Season Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Current Season Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {crops.filter(crop => crop.stage !== "Complete").slice(0, 6).map((crop) => (
                  <div key={crop.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{crop.name}</h4>
                      <Badge className={getStageColor(crop.stage)}>
                        {crop.stage}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Variety: {crop.variety}</p>
                      <p>Location: {crop.location}</p>
                      <p>Area: {crop.area} acres</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(crop.status)} variant="outline">
                          {crop.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {treatments.slice(0, 5).map((treatment) => (
                  <div key={treatment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="font-medium">{treatment.type}: {treatment.product}</p>
                        <p className="text-sm text-gray-600">
                          {crops.find(c => c.id === treatment.cropId)?.name} • {treatment.date}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">${treatment.cost}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crops" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search crops..."
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

          {/* Crops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrops.map((crop) => (
              <Card key={crop.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{crop.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCrop(crop)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{crop.variety}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getStageColor(crop.stage)}>
                      {crop.stage}
                    </Badge>
                    <Badge className={getStatusColor(crop.status)} variant="outline">
                      {crop.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{crop.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{crop.area} acres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Planted:</span>
                      <span className="font-medium">{crop.plantingDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Harvest:</span>
                      <span className="font-medium">{crop.expectedHarvest}</span>
                    </div>
                  </div>

                  {crop.notes && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      {crop.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="treatments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {treatments.map((treatment) => (
                  <div key={treatment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Droplets className="h-4 w-4 text-blue-400" />
                        <h4 className="font-semibold">
                          {treatment.type}: {treatment.product}
                        </h4>
                      </div>
                      <span className="text-sm font-medium">${treatment.cost}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Crop</p>
                        <p className="font-medium">
                          {crops.find(c => c.id === treatment.cropId)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Application</p>
                        <p className="font-medium">{treatment.application}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rate</p>
                        <p className="font-medium">{treatment.rate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-medium">{treatment.date}</p>
                      </div>
                    </div>
                    {treatment.notes && (
                      <p className="text-sm text-gray-600 mt-2">{treatment.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="harvests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Harvest Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {harvests.map((harvest) => (
                  <div key={harvest.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">
                        {crops.find(c => c.id === harvest.cropId)?.name}
                      </h4>
                      <Badge className="bg-green-100 text-green-800">
                        {harvest.quality}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-medium">{harvest.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Quantity</p>
                        <p className="font-medium">{harvest.quantity} {harvest.unit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Price/Unit</p>
                        <p className="font-medium">${harvest.pricePerUnit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Revenue</p>
                        <p className="font-medium">${harvest.totalRevenue}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Labor Hours</p>
                        <p className="font-medium">{harvest.laborHours}h</p>
                      </div>
                    </div>
                    {harvest.notes && (
                      <p className="text-sm text-gray-600 mt-2">{harvest.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crop Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Crop Planning</h3>
                <p className="text-gray-500 mb-4">Plan your crop rotations and seasonal plantings.</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Crop Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Crop Dialog */}
      <Dialog open={showAddCropDialog} onOpenChange={setShowAddCropDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Planting</DialogTitle>
            <DialogDescription>
              Create a new crop planting record for your farm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Crop Name</Label>
                <Input
                  id="name"
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                  placeholder="e.g., Corn"
                />
              </div>
              <div>
                <Label htmlFor="variety">Variety</Label>
                <Input
                  id="variety"
                  value={newCrop.variety}
                  onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                  placeholder="e.g., Sweet Corn Golden Bantam"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plantingDate">Planting Date</Label>
                <Input
                  id="plantingDate"
                  type="date"
                  value={newCrop.plantingDate}
                  onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="expectedHarvest">Expected Harvest</Label>
                <Input
                  id="expectedHarvest"
                  type="date"
                  value={newCrop.expectedHarvest}
                  onChange={(e) => setNewCrop({...newCrop, expectedHarvest: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newCrop.location}
                  onChange={(e) => setNewCrop({...newCrop, location: e.target.value})}
                  placeholder="e.g., Field A"
                />
              </div>
              <div>
                <Label htmlFor="area">Area (acres)</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  value={newCrop.area}
                  onChange={(e) => setNewCrop({...newCrop, area: Number(e.target.value)})}
                  placeholder="5.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plantingMethod">Planting Method</Label>
                <Select value={newCrop.plantingMethod} onValueChange={(value) => setNewCrop({...newCrop, plantingMethod: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct Seed">Direct Seed</SelectItem>
                    <SelectItem value="Transplant">Transplant</SelectItem>
                    <SelectItem value="Cutting">Cutting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estimatedYield">Estimated Yield (lbs)</Label>
                <Input
                  id="estimatedYield"
                  type="number"
                  value={newCrop.estimatedYield}
                  onChange={(e) => setNewCrop({...newCrop, estimatedYield: Number(e.target.value)})}
                  placeholder="8000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newCrop.notes}
                onChange={(e) => setNewCrop({...newCrop, notes: e.target.value})}
                placeholder="Additional notes about this planting..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddCropDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addCrop} className="bg-green-600 hover:bg-green-700">
              Add Planting
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}