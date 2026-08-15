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
  MapPin,
  Calendar,
  TrendingUp,
  BarChart3,
  Map,
  Target,
  Search,
  Filter,
  Edit,
  Eye,
  TreePine,
  Leaf
} from "lucide-react";
import { format } from "date-fns";

interface Planting {
  id: string;
  cropType: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  location: string;
  area: number; // in acres
  seedSource: string;
  plantingMethod: "Direct Seed" | "Transplant" | "Cutting";
  spacing: string;
  rowSpacing: string;
  population: number;
  stage: "Planted" | "Germinated" | "Vegetative" | "Flowering" | "Fruiting" | "Harvested" | "Complete";
  status: "Healthy" | "Stressed" | "Disease" | "Pest Issues" | "Drought";
  notes: string;
  estimatedYield: number;
  actualYield?: number;
  costPerAcre: number;
  expectedRevenue: number;
}

interface CropType {
  id: string;
  name: string;
  variety: string;
  category: "Vegetable" | "Grain" | "Fruit" | "Herb" | "Cover Crop" | "Forage";
  daysToMaturity: number;
  plantingWindow: string;
  harvestWindow: string;
  soilRequirements: string;
  waterRequirements: string;
  lightRequirements: string;
  spacing: string;
  isPerennial: boolean;
  notes: string;
}

interface GrowLocation {
  id: string;
  name: string;
  type: "Field" | "Greenhouse" | "High Tunnel" | "Garden Bed" | "Container";
  area: number;
  soilType: string;
  drainageStatus: string;
  irrigationAvailable: boolean;
  lastSoilTest: string;
  phLevel: number;
  organicMatter: number;
  currentPlantings: string[];
  rotationHistory: Array<{year: string, crop: string}>;
  notes: string;
}

interface CropPlan {
  id: string;
  year: number;
  season: "Spring" | "Summer" | "Fall" | "Winter";
  cropType: string;
  variety: string;
  plannedLocation: string;
  plannedArea: number;
  plannedPlantingDate: string;
  plannedHarvestDate: string;
  estimatedYield: number;
  estimatedRevenue: number;
  estimatedCosts: number;
  status: "Planned" | "In Progress" | "Completed" | "Cancelled";
  notes: string;
}

export default function PlantingModule() {
  const [plantings, setPlantings] = useState<Planting[]>([]);
  const [cropTypes, setCropTypes] = useState<CropType[]>([]);
  const [growLocations, setGrowLocations] = useState<GrowLocation[]>([]);
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [activeSubmenu, setActiveSubmenu] = useState("plantings");
  const [showAddPlantingDialog, setShowAddPlantingDialog] = useState(false);
  const [showAddCropDialog, setShowAddCropDialog] = useState(false);
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false);

  const [newPlanting, setNewPlanting] = useState<Partial<Planting>>({
    cropType: "",
    variety: "",
    plantingDate: format(new Date(), "yyyy-MM-dd"),
    expectedHarvestDate: "",
    location: "",
    area: 0,
    seedSource: "",
    plantingMethod: "Direct Seed",
    spacing: "",
    rowSpacing: "",
    population: 0,
    stage: "Planted",
    status: "Healthy",
    notes: "",
    estimatedYield: 0,
    costPerAcre: 0,
    expectedRevenue: 0
  });

  const [newCropType, setNewCropType] = useState<Partial<CropType>>({
    name: "",
    variety: "",
    category: "Vegetable",
    daysToMaturity: 0,
    plantingWindow: "",
    harvestWindow: "",
    soilRequirements: "",
    waterRequirements: "",
    lightRequirements: "",
    spacing: "",
    isPerennial: false,
    notes: ""
  });

  const [newLocation, setNewLocation] = useState<Partial<GrowLocation>>({
    name: "",
    type: "Field",
    area: 0,
    soilType: "",
    drainageStatus: "Good",
    irrigationAvailable: false,
    lastSoilTest: format(new Date(), "yyyy-MM-dd"),
    phLevel: 7.0,
    organicMatter: 0,
    currentPlantings: [],
    rotationHistory: [],
    notes: ""
  });

  const [locationForm, setLocationForm] = useState({
    internalId: "",
    electronicId: "",
    plantingFormat: "Planted in Beds",
    numberOfBeds: 5,
    bedLength: 100,
    bedWidth: 3,
    estimatedLandValue: 0,
    status: "Active",
    lightProfile: "Full Sun",
    grazingRestDays: 0
  });

  const [newCropPlan, setNewCropPlan] = useState<Partial<CropPlan>>({
    year: new Date().getFullYear(),
    season: "Spring",
    cropType: "",
    variety: "",
    plannedLocation: "",
    plannedArea: 0,
    plannedPlantingDate: format(new Date(), "yyyy-MM-dd"),
    plannedHarvestDate: "",
    estimatedYield: 0,
    estimatedRevenue: 0,
    estimatedCosts: 0,
    status: "Planned",
    notes: ""
  });

  // Sample data initialization
  useEffect(() => {
    const samplePlantings: Planting[] = [
      {
        id: "1",
        cropType: "Tomato",
        variety: "Cherokee Purple",
        plantingDate: "2024-05-15",
        expectedHarvestDate: "2024-08-15",
        location: "Greenhouse 1",
        area: 0.25,
        seedSource: "Johnny's Seeds",
        plantingMethod: "Transplant",
        spacing: "18 inches",
        rowSpacing: "3 feet",
        population: 48,
        stage: "Fruiting",
        status: "Healthy",
        notes: "Excellent growth, good fruit set",
        estimatedYield: 500,
        actualYield: 475,
        costPerAcre: 2800,
        expectedRevenue: 3500
      },
      {
        id: "2",
        cropType: "Corn",
        variety: "Silver Queen",
        plantingDate: "2024-06-01",
        expectedHarvestDate: "2024-09-01",
        location: "North Field",
        area: 5.0,
        seedSource: "Local Co-op",
        plantingMethod: "Direct Seed",
        spacing: "6 inches",
        rowSpacing: "30 inches",
        population: 24000,
        stage: "Vegetative",
        status: "Healthy",
        notes: "Good germination rate, even stand",
        estimatedYield: 8000,
        costPerAcre: 450,
        expectedRevenue: 3200
      },
      {
        id: "3",
        cropType: "Lettuce",
        variety: "Buttercrunch",
        plantingDate: "2024-07-01",
        expectedHarvestDate: "2024-08-01",
        location: "High Tunnel A",
        area: 0.1,
        seedSource: "Baker Creek",
        plantingMethod: "Transplant",
        spacing: "8 inches",
        rowSpacing: "12 inches",
        population: 200,
        stage: "Vegetative",
        status: "Healthy",
        notes: "Summer succession planting",
        estimatedYield: 150,
        costPerAcre: 3200,
        expectedRevenue: 800
      }
    ];

    const sampleCropTypes: CropType[] = [
      {
        id: "1",
        name: "Tomato",
        variety: "Cherokee Purple",
        category: "Vegetable",
        daysToMaturity: 90,
        plantingWindow: "May 15 - June 15",
        harvestWindow: "August 1 - October 15",
        soilRequirements: "Well-drained, pH 6.0-6.8",
        waterRequirements: "1-2 inches per week",
        lightRequirements: "Full sun",
        spacing: "18-24 inches",
        isPerennial: false,
        notes: "Indeterminate heirloom variety, excellent flavor"
      },
      {
        id: "2",
        name: "Corn",
        variety: "Silver Queen",
        category: "Grain",
        daysToMaturity: 92,
        plantingWindow: "May 1 - June 30",
        harvestWindow: "August 15 - September 30",
        soilRequirements: "Rich, well-drained, pH 6.0-7.0",
        waterRequirements: "1 inch per week",
        lightRequirements: "Full sun",
        spacing: "6-8 inches",
        isPerennial: false,
        notes: "White sweet corn, excellent eating quality"
      },
      {
        id: "3",
        name: "Lettuce",
        variety: "Buttercrunch",
        category: "Vegetable",
        daysToMaturity: 30,
        plantingWindow: "March 15 - September 15",
        harvestWindow: "April 15 - November 1",
        soilRequirements: "Cool, moist, pH 6.0-7.0",
        waterRequirements: "1 inch per week",
        lightRequirements: "Partial shade in summer",
        spacing: "8-10 inches",
        isPerennial: false,
        notes: "Heat tolerant butterhead type"
      }
    ];

    const sampleLocations: GrowLocation[] = [
      {
        id: "1",
        name: "North Field",
        type: "Field",
        area: 15.0,
        soilType: "Loamy clay",
        drainageStatus: "Good",
        irrigationAvailable: true,
        lastSoilTest: "2024-03-15",
        phLevel: 6.5,
        organicMatter: 3.2,
        currentPlantings: ["Corn", "Soybeans"],
        rotationHistory: [
          {year: "2023", crop: "Wheat"},
          {year: "2022", crop: "Corn"},
          {year: "2021", crop: "Soybeans"}
        ],
        notes: "Primary field crop area, excellent for grains"
      },
      {
        id: "2",
        name: "Greenhouse 1",
        type: "Greenhouse",
        area: 0.5,
        soilType: "Growing medium",
        drainageStatus: "Excellent",
        irrigationAvailable: true,
        lastSoilTest: "2024-02-01",
        phLevel: 6.2,
        organicMatter: 4.5,
        currentPlantings: ["Tomatoes", "Peppers"],
        rotationHistory: [
          {year: "2023", crop: "Cucumbers"},
          {year: "2022", crop: "Tomatoes"}
        ],
        notes: "Climate controlled, year-round production"
      },
      {
        id: "3",
        name: "High Tunnel A",
        type: "High Tunnel",
        area: 0.25,
        soilType: "Sandy loam",
        drainageStatus: "Good",
        irrigationAvailable: true,
        lastSoilTest: "2024-04-01",
        phLevel: 6.8,
        organicMatter: 3.8,
        currentPlantings: ["Lettuce", "Spinach"],
        rotationHistory: [
          {year: "2023", crop: "Kale"},
          {year: "2022", crop: "Lettuce"}
        ],
        notes: "Season extension structure for greens"
      }
    ];

    const samplePlans: CropPlan[] = [
      {
        id: "1",
        year: 2024,
        season: "Fall",
        cropType: "Winter Wheat",
        variety: "Red Turkey",
        plannedLocation: "South Field",
        plannedArea: 12.0,
        plannedPlantingDate: "2024-09-15",
        plannedHarvestDate: "2025-06-15",
        estimatedYield: 2400,
        estimatedRevenue: 7200,
        estimatedCosts: 3600,
        status: "Planned",
        notes: "Cover crop and grain production"
      },
      {
        id: "2",
        year: 2024,
        season: "Spring",
        cropType: "Peas",
        variety: "Sugar Snap",
        plannedLocation: "Garden Bed 1",
        plannedArea: 0.1,
        plannedPlantingDate: "2024-03-15",
        plannedHarvestDate: "2024-06-01",
        estimatedYield: 50,
        estimatedRevenue: 300,
        estimatedCosts: 75,
        status: "Completed",
        notes: "Early spring planting for fresh market"
      }
    ];

    setPlantings(samplePlantings);
    setCropTypes(sampleCropTypes);
    setGrowLocations(sampleLocations);
    setCropPlans(samplePlans);
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Planted": return "bg-blue-100 text-blue-800";
      case "Germinated": return "bg-green-100 text-green-800";
      case "Vegetative": return "bg-emerald-100 text-emerald-800";
      case "Flowering": return "bg-yellow-100 text-yellow-800";
      case "Fruiting": return "bg-orange-100 text-orange-800";
      case "Harvested": return "bg-purple-100 text-purple-800";
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
      case "Drought": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalPlantedArea = plantings.reduce((sum, p) => sum + p.area, 0);
  const activePlantings = plantings.filter(p => p.stage !== "Complete").length;
  const totalLocations = growLocations.length;
  const plannedCrops = cropPlans.filter(p => p.status === "Planned").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Plantings</h2>
          <p className="text-gray-600">Manage crops, plantings, and growing locations</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddPlantingDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Planting
          </Button>
          <Button onClick={() => setShowAddCropDialog(true)} variant="outline">
            <Sprout className="h-4 w-4 mr-2" />
            New Crop Type
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planted Area</p>
                <p className="text-2xl font-bold text-gray-900">{totalPlantedArea.toFixed(1)} acres</p>
              </div>
              <Sprout className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plantings</p>
                <p className="text-2xl font-bold text-gray-900">{activePlantings}</p>
              </div>
              <Sprout className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Grow Locations</p>
                <p className="text-2xl font-bold text-gray-900">{totalLocations}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planned Crops</p>
                <p className="text-2xl font-bold text-gray-900">{plannedCrops}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submenu Tabs */}
      <Tabs value={activeSubmenu} onValueChange={setActiveSubmenu} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="plantings">Plantings</TabsTrigger>
          <TabsTrigger value="mycrops">My Crops</TabsTrigger>
          <TabsTrigger value="growlocations">Grow Locations</TabsTrigger>
          <TabsTrigger value="cropplan">Crop Plan</TabsTrigger>
          <TabsTrigger value="locationmap">Location Map</TabsTrigger>
          <TabsTrigger value="yieldcomparison">Yield Comparison</TabsTrigger>
        </TabsList>

        {/* Plantings Tab */}
        <TabsContent value="plantings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plantings.map((planting) => (
              <Card key={planting.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{planting.cropType}</CardTitle>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{planting.variety}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getStageColor(planting.stage)}>
                      {planting.stage}
                    </Badge>
                    <Badge className={getStatusColor(planting.status)} variant="outline">
                      {planting.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{planting.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{planting.area} acres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Planted:</span>
                      <span className="font-medium">{planting.plantingDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Harvest:</span>
                      <span className="font-medium">{planting.expectedHarvestDate}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">Est. Yield</p>
                        <p className="font-bold">{planting.estimatedYield} lbs</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Population</p>
                        <p className="font-bold">{planting.population.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {planting.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {planting.notes.length > 80 
                        ? `${planting.notes.substring(0, 80)}...` 
                        : planting.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Crops Tab */}
        <TabsContent value="mycrops" className="space-y-4">
          <div className="flex justify-end gap-3 mb-4">
            <Button onClick={() => setShowAddPlantingDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Planting
            </Button>
            <Button onClick={() => setShowAddCropDialog(true)} variant="outline">
              <Sprout className="h-4 w-4 mr-2" />
              New Crop Type
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cropTypes.map((crop) => (
              <Card key={crop.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{crop.name}</CardTitle>
                    <Badge variant="outline">{crop.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{crop.variety}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Days to Maturity</p>
                      <p className="font-medium">{crop.daysToMaturity} days</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Spacing</p>
                      <p className="font-medium">{crop.spacing}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Planting Window</p>
                      <p className="font-medium">{crop.plantingWindow}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Harvest Window</p>
                      <p className="font-medium">{crop.harvestWindow}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Soil Requirements</p>
                      <p className="text-xs">{crop.soilRequirements}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Water Requirements</p>
                      <p className="text-xs">{crop.waterRequirements}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Light Requirements</p>
                      <p className="text-xs">{crop.lightRequirements}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={crop.isPerennial ? "default" : "outline"}>
                      {crop.isPerennial ? "Perennial" : "Annual"}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Grow Locations Tab */}
        <TabsContent value="growlocations" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowAddLocationDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {growLocations.map((location) => (
              <Card key={location.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                    <Badge variant="outline">{location.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Area: {location.area} acres</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Soil Type</p>
                      <p className="font-medium">{location.soilType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Drainage</p>
                      <p className="font-medium">{location.drainageStatus}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">pH Level</p>
                      <p className="font-medium">{location.phLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Organic Matter</p>
                      <p className="font-medium">{location.organicMatter}%</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Current Plantings:</p>
                    <div className="flex flex-wrap gap-1">
                      {location.currentPlantings.map((crop, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Rotation History:</p>
                    <div className="space-y-1">
                      {location.rotationHistory.slice(0, 3).map((entry, index) => (
                        <div key={index} className="text-xs text-gray-600 flex justify-between">
                          <span>{entry.year}</span>
                          <span>{entry.crop}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {location.irrigationAvailable && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          Irrigation
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Last soil test: {location.lastSoilTest}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Crop Plan Tab */}
        <TabsContent value="cropplan" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowAddPlanDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </div>
          <div className="space-y-3">
            {cropPlans.map((plan) => (
              <Card key={plan.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">{plan.cropType} - {plan.variety}</h4>
                        <p className="text-sm text-gray-600">{plan.season} {plan.year}</p>
                      </div>
                    </div>
                    <Badge variant={plan.status === "Completed" ? "default" : "outline"}>
                      {plan.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-medium">{plan.plannedLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Area</p>
                      <p className="font-medium">{plan.plannedArea} acres</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Planting Date</p>
                      <p className="font-medium">{plan.plannedPlantingDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Harvest Date</p>
                      <p className="font-medium">{plan.plannedHarvestDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t text-sm">
                    <div>
                      <p className="text-gray-600">Est. Yield</p>
                      <p className="font-bold text-green-600">{plan.estimatedYield} lbs</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Est. Revenue</p>
                      <p className="font-bold text-blue-600">${plan.estimatedRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Est. Profit</p>
                      <p className="font-bold text-purple-600">
                        ${(plan.estimatedRevenue - plan.estimatedCosts).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {plan.notes && (
                    <p className="text-xs text-gray-600 mt-3 bg-gray-50 p-2 rounded">
                      {plan.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Location Map Tab */}
        <TabsContent value="locationmap" className="space-y-4">
          <Card className="h-96">
            <CardContent className="p-6 h-full flex items-center justify-center">
              <div className="text-center">
                <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Location Map</h3>
                <p className="text-gray-500 mb-4">
                  Visual map showing all growing locations with current plantings and status.
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <MapPin className="h-4 w-4 mr-2" />
                  Load Map View
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Location Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Active Growing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">Planned Planting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Irrigation Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm">Fallow/Resting</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Yield Comparison Tab */}
        <TabsContent value="yieldcomparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Yield Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plantings.filter(p => p.actualYield).map((planting) => (
                  <div key={planting.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{planting.cropType} - {planting.variety}</h4>
                      <Badge variant="outline">{planting.location}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Estimated Yield</p>
                        <p className="font-bold">{planting.estimatedYield} lbs</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Actual Yield</p>
                        <p className="font-bold">{planting.actualYield} lbs</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Variance</p>
                        <p className={`font-bold ${
                          (planting.actualYield || 0) >= planting.estimatedYield 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {((((planting.actualYield || 0) - planting.estimatedYield) / planting.estimatedYield) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          (planting.actualYield || 0) >= planting.estimatedYield 
                            ? 'bg-green-600' 
                            : 'bg-orange-600'
                        }`}
                        style={{ 
                          width: `${Math.min(((planting.actualYield || 0) / planting.estimatedYield) * 100, 100)}%` 
                        }}
                      />
                    </div>

                    <div className="mt-3 text-xs text-gray-600">
                      <p>Area: {planting.area} acres • Planted: {planting.plantingDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Average Yield Performance</p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Best Performing Crop</p>
                <p className="text-lg font-bold text-gray-900">Lettuce</p>
                <p className="text-sm text-green-600">+12.5% vs target</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Production</p>
                <p className="text-2xl font-bold text-gray-900">1,125 lbs</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Planting Dialog */}
      <Dialog open={showAddPlantingDialog} onOpenChange={setShowAddPlantingDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Planting</DialogTitle>
            <DialogDescription>
              Record a new planting in your farm management system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cropType">Crop Type</Label>
                <Input
                  id="cropType"
                  value={newPlanting.cropType}
                  onChange={(e) => setNewPlanting({...newPlanting, cropType: e.target.value})}
                  placeholder="e.g., Tomato"
                />
              </div>
              <div>
                <Label htmlFor="variety">Variety</Label>
                <Input
                  id="variety"
                  value={newPlanting.variety}
                  onChange={(e) => setNewPlanting({...newPlanting, variety: e.target.value})}
                  placeholder="e.g., Cherokee Purple"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plantingDate">Planting Date</Label>
                <Input
                  id="plantingDate"
                  type="date"
                  value={newPlanting.plantingDate}
                  onChange={(e) => setNewPlanting({...newPlanting, plantingDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="expectedHarvestDate">Expected Harvest</Label>
                <Input
                  id="expectedHarvestDate"
                  type="date"
                  value={newPlanting.expectedHarvestDate}
                  onChange={(e) => setNewPlanting({...newPlanting, expectedHarvestDate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={newPlanting.location} onValueChange={(value) => setNewPlanting({...newPlanting, location: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {growLocations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="area">Area (acres)</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  value={newPlanting.area}
                  onChange={(e) => setNewPlanting({...newPlanting, area: Number(e.target.value)})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newPlanting.notes}
                onChange={(e) => setNewPlanting({...newPlanting, notes: e.target.value})}
                placeholder="Additional notes about this planting..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddPlantingDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                const newPlantingRecord: Planting = {
                  id: Date.now().toString(),
                  cropType: newPlanting.cropType || "",
                  variety: newPlanting.variety || "",
                  plantingDate: newPlanting.plantingDate || format(new Date(), "yyyy-MM-dd"),
                  expectedHarvestDate: newPlanting.expectedHarvestDate || "",
                  location: newPlanting.location || "",
                  area: newPlanting.area || 0,
                  seedSource: newPlanting.seedSource || "",
                  plantingMethod: newPlanting.plantingMethod || "Direct Seed",
                  spacing: newPlanting.spacing || "",
                  rowSpacing: newPlanting.rowSpacing || "",
                  population: newPlanting.population || 0,
                  stage: newPlanting.stage || "Planted",
                  status: newPlanting.status || "Healthy",
                  notes: newPlanting.notes || "",
                  estimatedYield: newPlanting.estimatedYield || 0,
                  costPerAcre: newPlanting.costPerAcre || 0,
                  expectedRevenue: newPlanting.expectedRevenue || 0
                };
                setPlantings([...plantings, newPlantingRecord]);
                setNewPlanting({
                  cropType: "",
                  variety: "",
                  plantingDate: format(new Date(), "yyyy-MM-dd"),
                  expectedHarvestDate: "",
                  location: "",
                  area: 0,
                  seedSource: "",
                  plantingMethod: "Direct Seed",
                  spacing: "",
                  rowSpacing: "",
                  population: 0,
                  stage: "Planted",
                  status: "Healthy",
                  notes: "",
                  estimatedYield: 0,
                  costPerAcre: 0,
                  expectedRevenue: 0
                });
                setShowAddPlantingDialog(false);
              }}
            >
              Add Planting
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Crop Type Dialog */}
      <Dialog open={showAddCropDialog} onOpenChange={setShowAddCropDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Crop Type</DialogTitle>
            <DialogDescription>
              Create a new crop type with growing specifications and requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cropName">Crop Name</Label>
                <Input
                  id="cropName"
                  value={newCropType.name}
                  onChange={(e) => setNewCropType({...newCropType, name: e.target.value})}
                  placeholder="e.g., Tomato"
                />
              </div>
              <div>
                <Label htmlFor="cropVariety">Variety</Label>
                <Input
                  id="cropVariety"
                  value={newCropType.variety}
                  onChange={(e) => setNewCropType({...newCropType, variety: e.target.value})}
                  placeholder="e.g., Cherokee Purple"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newCropType.category} onValueChange={(value) => setNewCropType({...newCropType, category: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vegetable">Vegetable</SelectItem>
                    <SelectItem value="Grain">Grain</SelectItem>
                    <SelectItem value="Fruit">Fruit</SelectItem>
                    <SelectItem value="Herb">Herb</SelectItem>
                    <SelectItem value="Cover Crop">Cover Crop</SelectItem>
                    <SelectItem value="Forage">Forage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="daysToMaturity">Days to Maturity</Label>
                <Input
                  id="daysToMaturity"
                  type="number"
                  value={newCropType.daysToMaturity}
                  onChange={(e) => setNewCropType({...newCropType, daysToMaturity: Number(e.target.value)})}
                  placeholder="e.g., 90"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plantingWindow">Planting Window</Label>
                <Input
                  id="plantingWindow"
                  value={newCropType.plantingWindow}
                  onChange={(e) => setNewCropType({...newCropType, plantingWindow: e.target.value})}
                  placeholder="e.g., May 15 - June 15"
                />
              </div>
              <div>
                <Label htmlFor="harvestWindow">Harvest Window</Label>
                <Input
                  id="harvestWindow"
                  value={newCropType.harvestWindow}
                  onChange={(e) => setNewCropType({...newCropType, harvestWindow: e.target.value})}
                  placeholder="e.g., August 1 - October 15"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="spacing">Spacing</Label>
              <Input
                id="spacing"
                value={newCropType.spacing}
                onChange={(e) => setNewCropType({...newCropType, spacing: e.target.value})}
                placeholder="e.g., 18 inches apart"
              />
            </div>
            <div>
              <Label htmlFor="soilRequirements">Soil Requirements</Label>
              <Textarea
                id="soilRequirements"
                value={newCropType.soilRequirements}
                onChange={(e) => setNewCropType({...newCropType, soilRequirements: e.target.value})}
                placeholder="Describe soil pH, drainage, and nutrient requirements..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="waterRequirements">Water Requirements</Label>
                <Input
                  id="waterRequirements"
                  value={newCropType.waterRequirements}
                  onChange={(e) => setNewCropType({...newCropType, waterRequirements: e.target.value})}
                  placeholder="e.g., Moderate, consistent moisture"
                />
              </div>
              <div>
                <Label htmlFor="lightRequirements">Light Requirements</Label>
                <Input
                  id="lightRequirements"
                  value={newCropType.lightRequirements}
                  onChange={(e) => setNewCropType({...newCropType, lightRequirements: e.target.value})}
                  placeholder="e.g., Full sun (6-8 hours)"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cropNotes">Notes</Label>
              <Textarea
                id="cropNotes"
                value={newCropType.notes}
                onChange={(e) => setNewCropType({...newCropType, notes: e.target.value})}
                placeholder="Additional growing tips and notes..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddCropDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                const newCrop: CropType = {
                  id: Date.now().toString(),
                  name: newCropType.name || "",
                  variety: newCropType.variety || "",
                  category: newCropType.category || "Vegetable",
                  daysToMaturity: newCropType.daysToMaturity || 0,
                  plantingWindow: newCropType.plantingWindow || "",
                  harvestWindow: newCropType.harvestWindow || "",
                  soilRequirements: newCropType.soilRequirements || "",
                  waterRequirements: newCropType.waterRequirements || "",
                  lightRequirements: newCropType.lightRequirements || "",
                  spacing: newCropType.spacing || "",
                  isPerennial: newCropType.isPerennial || false,
                  notes: newCropType.notes || ""
                };
                setCropTypes([...cropTypes, newCrop]);
                setNewCropType({
                  name: "",
                  variety: "",
                  category: "Vegetable",
                  daysToMaturity: 0,
                  plantingWindow: "",
                  harvestWindow: "",
                  soilRequirements: "",
                  waterRequirements: "",
                  lightRequirements: "",
                  spacing: "",
                  isPerennial: false,
                  notes: ""
                });
                setShowAddCropDialog(false);
              }}
            >
              Add Crop Type
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Location Dialog */}
      <Dialog open={showAddLocationDialog} onOpenChange={setShowAddLocationDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>New Grow Location</DialogTitle>
            <DialogDescription>
              1 Details 2 Map Location 3 Add Plantings ✔ Complete
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4 max-h-[700px] overflow-y-auto">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationName">Name</Label>
                <Input
                  id="locationName"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  placeholder="Example: Northwest Field"
                />
              </div>
              <div>
                <Label htmlFor="internalId">Internal ID</Label>
                <Input
                  id="internalId"
                  value={locationForm.internalId}
                  onChange={(e) => setLocationForm({...locationForm, internalId: e.target.value})}
                  placeholder="Example: F001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="electronicId">Electronic ID</Label>
                <Input
                  id="electronicId"
                  value={locationForm.electronicId}
                  onChange={(e) => setLocationForm({...locationForm, electronicId: e.target.value})}
                  placeholder="Optional barcode/RFID"
                />
              </div>
              <div>
                <Label htmlFor="locationType">Location Type</Label>
                <Select value={newLocation.type} onValueChange={(value) => setNewLocation({...newLocation, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Field">Field</SelectItem>
                    <SelectItem value="Greenhouse">Greenhouse</SelectItem>
                    <SelectItem value="High Tunnel">High Tunnel</SelectItem>
                    <SelectItem value="Garden Bed">Garden Bed</SelectItem>
                    <SelectItem value="Pasture">Pasture</SelectItem>
                    <SelectItem value="Orchard">Orchard</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Planting Format */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Planting Format</Label>
              <div className="space-y-3">
                {[
                  {
                    value: "Planted in Beds",
                    title: "🛏️ Planted in Beds",
                    description: "Distinct number of beds for diverse crops. Often 100' length. Example: Carrots, Tomatos, Spinach, etc. Plantings based on row length and count."
                  },
                  {
                    value: "Cover Crop",
                    title: "🌾 Cover Crop", 
                    description: "Complete crop coverage or grazing location. Example: Alfalfa, Hay, Rye, Wheat, Pasture, etc; Planting coverage based on location area."
                  },
                  {
                    value: "Row Crop",
                    title: "🚜 Row Crop",
                    description: "One crop planted in rows wide enough to to be cultivated by machinery. Example: Corn, Soy Beans, Hemp, Potatos, etc. Planting coverage based on location area."
                  },
                  {
                    value: "Other",
                    title: "🔧 Other",
                    description: "Any alternative growing method. Example: Shelves, aquaponics, trays, etc. Plantings based on specified amount planted."
                  }
                ].map((format) => (
                  <div key={format.value} className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id={format.value}
                      name="plantingFormat"
                      value={format.value}
                      checked={locationForm.plantingFormat === format.value}
                      onChange={(e) => setLocationForm({...locationForm, plantingFormat: e.target.value})}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={format.value} className="font-medium cursor-pointer">
                        {format.title}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bed Configuration (only show if "Planted in Beds" is selected) */}
            {locationForm.plantingFormat === "Planted in Beds" && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="numberOfBeds">Number of Beds</Label>
                  <Input
                    id="numberOfBeds"
                    type="number"
                    value={locationForm.numberOfBeds}
                    onChange={(e) => setLocationForm({...locationForm, numberOfBeds: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="bedLength">Bed Length</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bedLength"
                      type="number"
                      value={locationForm.bedLength}
                      onChange={(e) => setLocationForm({...locationForm, bedLength: Number(e.target.value)})}
                    />
                    <span className="flex items-center text-sm text-gray-600">Feet</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="bedWidth">Bed Width</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bedWidth"
                      type="number"
                      value={locationForm.bedWidth}
                      onChange={(e) => setLocationForm({...locationForm, bedWidth: Number(e.target.value)})}
                    />
                    <span className="flex items-center text-sm text-gray-600">Feet</span>
                  </div>
                </div>
              </div>
            )}

            {/* Area and Value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationArea">Area/size (acre)</Label>
                <Input
                  id="locationArea"
                  type="number"
                  step="0.1"
                  value={newLocation.area}
                  onChange={(e) => setNewLocation({...newLocation, area: Number(e.target.value)})}
                  placeholder="e.g., 2.5"
                />
              </div>
              <div>
                <Label htmlFor="estimatedLandValue">Estimated Land Value</Label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l text-sm">$</span>
                  <Input
                    id="estimatedLandValue"
                    type="number"
                    step="0.01"
                    value={locationForm.estimatedLandValue}
                    onChange={(e) => setLocationForm({...locationForm, estimatedLandValue: Number(e.target.value)})}
                    className="rounded-l-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={locationForm.status} onValueChange={(value) => setLocationForm({...locationForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lightProfile">Light Profile</Label>
                <Select value={locationForm.lightProfile} onValueChange={(value) => setLocationForm({...locationForm, lightProfile: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Sun">Full Sun</SelectItem>
                    <SelectItem value="Partial Sun">Partial Sun</SelectItem>
                    <SelectItem value="Partial Shade">Partial Shade</SelectItem>
                    <SelectItem value="Full Shade">Full Shade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(locationForm.plantingFormat === "Cover Crop" || newLocation.type === "Pasture") && (
              <div>
                <Label htmlFor="grazingRestDays">Grazing Rest Days</Label>
                <Input
                  id="grazingRestDays"
                  type="number"
                  value={locationForm.grazingRestDays}
                  onChange={(e) => setLocationForm({...locationForm, grazingRestDays: Number(e.target.value)})}
                  placeholder="Number of days for rest"
                />
              </div>
            )}

            {/* Soil Information */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Soil Information</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Input
                    id="soilType"
                    value={newLocation.soilType}
                    onChange={(e) => setNewLocation({...newLocation, soilType: e.target.value})}
                    placeholder="e.g., Sandy Loam"
                  />
                </div>
                <div>
                  <Label htmlFor="drainageStatus">Drainage Status</Label>
                  <Select value={newLocation.drainageStatus} onValueChange={(value) => setNewLocation({...newLocation, drainageStatus: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phLevel">pH Level</Label>
                  <Input
                    id="phLevel"
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={newLocation.phLevel}
                    onChange={(e) => setNewLocation({...newLocation, phLevel: Number(e.target.value)})}
                    placeholder="e.g., 6.8"
                  />
                </div>
                <div>
                  <Label htmlFor="organicMatter">Organic Matter (%)</Label>
                  <Input
                    id="organicMatter"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={newLocation.organicMatter}
                    onChange={(e) => setNewLocation({...newLocation, organicMatter: Number(e.target.value)})}
                    placeholder="e.g., 3.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lastSoilTest">Last Soil Test</Label>
                  <Input
                    id="lastSoilTest"
                    type="date"
                    value={newLocation.lastSoilTest}
                    onChange={(e) => setNewLocation({...newLocation, lastSoilTest: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="irrigation"
                  checked={newLocation.irrigationAvailable}
                  onChange={(e) => setNewLocation({...newLocation, irrigationAvailable: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="irrigation" className="text-sm font-medium">
                  Irrigation Available
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="locationNotes">Description</Label>
              <Textarea
                id="locationNotes"
                value={newLocation.notes}
                onChange={(e) => setNewLocation({...newLocation, notes: e.target.value})}
                placeholder="Additional information about this location..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddLocationDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                const newLocationRecord: GrowLocation = {
                  id: Date.now().toString(),
                  name: newLocation.name || "",
                  type: newLocation.type || "Field",
                  area: newLocation.area || 0,
                  soilType: newLocation.soilType || "",
                  drainageStatus: newLocation.drainageStatus || "Good",
                  irrigationAvailable: newLocation.irrigationAvailable || false,
                  lastSoilTest: newLocation.lastSoilTest || format(new Date(), "yyyy-MM-dd"),
                  phLevel: newLocation.phLevel || 7.0,
                  organicMatter: newLocation.organicMatter || 0,
                  currentPlantings: newLocation.currentPlantings || [],
                  rotationHistory: newLocation.rotationHistory || [],
                  notes: newLocation.notes || ""
                };
                setGrowLocations([...growLocations, newLocationRecord]);
                setNewLocation({
                  name: "",
                  type: "Field",
                  area: 0,
                  soilType: "",
                  drainageStatus: "Good",
                  irrigationAvailable: false,
                  lastSoilTest: format(new Date(), "yyyy-MM-dd"),
                  phLevel: 7.0,
                  organicMatter: 0,
                  currentPlantings: [],
                  rotationHistory: [],
                  notes: ""
                });
                setLocationForm({
                  internalId: "",
                  electronicId: "",
                  plantingFormat: "Planted in Beds",
                  numberOfBeds: 5,
                  bedLength: 100,
                  bedWidth: 3,
                  estimatedLandValue: 0,
                  status: "Active",
                  lightProfile: "Full Sun",
                  grazingRestDays: 0
                });
                setShowAddLocationDialog(false);
              }}
            >
              Add Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Plan Dialog */}
      <Dialog open={showAddPlanDialog} onOpenChange={setShowAddPlanDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Crop Plan</DialogTitle>
            <DialogDescription>
              Create a seasonal crop plan with yield and revenue projections.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="planYear">Year</Label>
                <Input
                  id="planYear"
                  type="number"
                  value={newCropPlan.year}
                  onChange={(e) => setNewCropPlan({...newCropPlan, year: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="planSeason">Season</Label>
                <Select value={newCropPlan.season} onValueChange={(value) => setNewCropPlan({...newCropPlan, season: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                    <SelectItem value="Winter">Winter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="planCropType">Crop Type</Label>
                <Input
                  id="planCropType"
                  value={newCropPlan.cropType}
                  onChange={(e) => setNewCropPlan({...newCropPlan, cropType: e.target.value})}
                  placeholder="e.g., Tomato"
                />
              </div>
              <div>
                <Label htmlFor="planVariety">Variety</Label>
                <Input
                  id="planVariety"
                  value={newCropPlan.variety}
                  onChange={(e) => setNewCropPlan({...newCropPlan, variety: e.target.value})}
                  placeholder="e.g., Cherokee Purple"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="planLocation">Planned Location</Label>
                <Select value={newCropPlan.plannedLocation} onValueChange={(value) => setNewCropPlan({...newCropPlan, plannedLocation: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {growLocations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="planArea">Planned Area (acres)</Label>
                <Input
                  id="planArea"
                  type="number"
                  step="0.1"
                  value={newCropPlan.plannedArea}
                  onChange={(e) => setNewCropPlan({...newCropPlan, plannedArea: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="planPlantingDate">Planned Planting Date</Label>
                <Input
                  id="planPlantingDate"
                  type="date"
                  value={newCropPlan.plannedPlantingDate}
                  onChange={(e) => setNewCropPlan({...newCropPlan, plannedPlantingDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="planHarvestDate">Planned Harvest Date</Label>
                <Input
                  id="planHarvestDate"
                  type="date"
                  value={newCropPlan.plannedHarvestDate}
                  onChange={(e) => setNewCropPlan({...newCropPlan, plannedHarvestDate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="planYield">Estimated Yield (lbs)</Label>
                <Input
                  id="planYield"
                  type="number"
                  value={newCropPlan.estimatedYield}
                  onChange={(e) => setNewCropPlan({...newCropPlan, estimatedYield: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="planRevenue">Estimated Revenue ($)</Label>
                <Input
                  id="planRevenue"
                  type="number"
                  value={newCropPlan.estimatedRevenue}
                  onChange={(e) => setNewCropPlan({...newCropPlan, estimatedRevenue: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="planCosts">Estimated Costs ($)</Label>
                <Input
                  id="planCosts"
                  type="number"
                  value={newCropPlan.estimatedCosts}
                  onChange={(e) => setNewCropPlan({...newCropPlan, estimatedCosts: Number(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="planStatus">Status</Label>
              <Select value={newCropPlan.status} onValueChange={(value) => setNewCropPlan({...newCropPlan, status: value as any})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="planNotes">Notes</Label>
              <Textarea
                id="planNotes"
                value={newCropPlan.notes}
                onChange={(e) => setNewCropPlan({...newCropPlan, notes: e.target.value})}
                placeholder="Additional planning notes and considerations..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddPlanDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                const newPlan: CropPlan = {
                  id: Date.now().toString(),
                  year: newCropPlan.year || new Date().getFullYear(),
                  season: newCropPlan.season || "Spring",
                  cropType: newCropPlan.cropType || "",
                  variety: newCropPlan.variety || "",
                  plannedLocation: newCropPlan.plannedLocation || "",
                  plannedArea: newCropPlan.plannedArea || 0,
                  plannedPlantingDate: newCropPlan.plannedPlantingDate || format(new Date(), "yyyy-MM-dd"),
                  plannedHarvestDate: newCropPlan.plannedHarvestDate || "",
                  estimatedYield: newCropPlan.estimatedYield || 0,
                  estimatedRevenue: newCropPlan.estimatedRevenue || 0,
                  estimatedCosts: newCropPlan.estimatedCosts || 0,
                  status: newCropPlan.status || "Planned",
                  notes: newCropPlan.notes || ""
                };
                setCropPlans([...cropPlans, newPlan]);
                setNewCropPlan({
                  year: new Date().getFullYear(),
                  season: "Spring",
                  cropType: "",
                  variety: "",
                  plannedLocation: "",
                  plannedArea: 0,
                  plannedPlantingDate: format(new Date(), "yyyy-MM-dd"),
                  plannedHarvestDate: "",
                  estimatedYield: 0,
                  estimatedRevenue: 0,
                  estimatedCosts: 0,
                  status: "Planned",
                  notes: ""
                });
                setShowAddPlanDialog(false);
              }}
            >
              Add Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}