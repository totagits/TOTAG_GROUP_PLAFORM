import { useState, useEffect, useCallback } from "react";
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
  Map, 
  Plus, 
  MapPin,
  Square,
  Home,
  Barn,
  Tractor,
  Trees,
  Droplets,
  Edit,
  Eye,
  Layers,
  Compass,
  Pencil,
  X,
  CheckCircle2
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix default Leaflet marker icons (Vite asset handling)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface DrawnArea {
  id: string;
  name: string;
  type: string;
  points: [number, number][];
  color: string;
}

// Component to handle map click events for drawing
function DrawingLayer({
  mode,
  onPolygonPoint,
  onMarkerPlace,
}: {
  mode: "none" | "polygon" | "marker";
  onPolygonPoint: (pt: [number, number]) => void;
  onMarkerPlace: (pt: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      if (mode === "polygon") onPolygonPoint([e.latlng.lat, e.latlng.lng]);
      if (mode === "marker") onMarkerPlace([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

interface Location {
  id: string;
  name: string;
  type: "Field" | "Pasture" | "Building" | "Equipment Area" | "Water Source" | "Road" | "Boundary" | "Other";
  coordinates: {
    latitude: number;
    longitude: number;
  };
  area?: number; // in acres
  description: string;
  features: string[];
  status: "Active" | "Inactive" | "Under Development";
  crops?: string[];
  livestock?: string[];
  equipment?: string[];
  lastUpdated: string;
  notes: string;
}

interface Zone {
  id: string;
  name: string;
  type: "Production" | "Grazing" | "Storage" | "Processing" | "Residential" | "Conservation";
  locations: string[]; // location IDs
  totalArea: number;
  description: string;
  color: string;
}

interface FarmMapModuleProps {
  userRole?: string;
}

export default function FarmMapModule({ userRole = "manager" }: FarmMapModuleProps) {
  const isManager = userRole === "manager" || userRole === "admin";
  const [locations, setLocations] = useState<Location[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [activeTab, setActiveTab] = useState("map");
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [showAddZoneDialog, setShowAddZoneDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Leaflet drawing state
  const [drawMode, setDrawMode] = useState<"none" | "polygon" | "marker">("none");
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState<[number, number][]>([]);
  const [drawnAreas, setDrawnAreas] = useState<DrawnArea[]>([
    {
      id: "1",
      name: "North Crop Field",
      type: "Field",
      color: "#16a34a",
      points: [[6.305, -10.795], [6.310, -10.795], [6.310, -10.788], [6.305, -10.788]],
    },
    {
      id: "2",
      name: "South Pasture",
      type: "Pasture",
      color: "#2563eb",
      points: [[6.298, -10.800], [6.303, -10.800], [6.303, -10.793], [6.298, -10.793]],
    },
  ]);
  const [pendingAreaName, setPendingAreaName] = useState("");
  const [pendingAreaType, setPendingAreaType] = useState("Field");
  const [showAreaNameDialog, setShowAreaNameDialog] = useState(false);
  const AREA_COLORS = ["#16a34a", "#2563eb", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

  const handlePolygonPoint = useCallback((pt: [number, number]) => {
    setCurrentPolygonPoints(prev => [...prev, pt]);
  }, []);

  const handleMarkerPlace = useCallback((pt: [number, number]) => {
    if (drawMode !== "marker") return;
    const name = prompt("Enter marker name:") || "New Marker";
    setDrawnAreas(prev => [...prev, {
      id: Date.now().toString(), name, type: "Marker",
      color: "#dc2626", points: [pt],
    }]);
    setDrawMode("none");
  }, [drawMode]);

  const finishPolygon = () => {
    if (currentPolygonPoints.length < 3) return;
    setShowAreaNameDialog(true);
  };

  const savePolygon = () => {
    const color = AREA_COLORS[drawnAreas.length % AREA_COLORS.length];
    setDrawnAreas(prev => [...prev, {
      id: Date.now().toString(),
      name: pendingAreaName || "New Area",
      type: pendingAreaType,
      color,
      points: currentPolygonPoints,
    }]);
    setCurrentPolygonPoints([]);
    setPendingAreaName("");
    setPendingAreaType("Field");
    setShowAreaNameDialog(false);
    setDrawMode("none");
  };

  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: "",
    type: "Field",
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    area: 0,
    description: "",
    features: [],
    status: "Active",
    crops: [],
    livestock: [],
    equipment: [],
    lastUpdated: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const [newZone, setNewZone] = useState<Partial<Zone>>({
    name: "",
    type: "Production",
    locations: [],
    totalArea: 0,
    description: "",
    color: "#22c55e"
  });

  // Sample data initialization
  useEffect(() => {
    const sampleLocations: Location[] = [
      {
        id: "1",
        name: "North Field",
        type: "Field",
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        area: 15.5,
        description: "Primary crop production field",
        features: ["Irrigation System", "Drainage", "Soil Testing Points"],
        status: "Active",
        crops: ["Corn", "Soybeans"],
        equipment: ["Tractor", "Planter"],
        lastUpdated: "2024-07-10",
        notes: "Excellent soil quality, high organic matter content"
      },
      {
        id: "2",
        name: "South Pasture",
        type: "Pasture",
        coordinates: {
          latitude: 40.7100,
          longitude: -74.0080
        },
        area: 12.0,
        description: "Rotational grazing area for cattle",
        features: ["Water Trough", "Shade Trees", "Fencing"],
        status: "Active",
        livestock: ["Cattle - 25 head"],
        lastUpdated: "2024-07-08",
        notes: "Currently in rotation cycle 3 of 4"
      },
      {
        id: "3",
        name: "Equipment Barn",
        type: "Building",
        coordinates: {
          latitude: 40.7120,
          longitude: -74.0070
        },
        description: "Main storage for farm equipment",
        features: ["Concrete Floor", "Electric Power", "Large Doors"],
        status: "Active",
        equipment: ["Combine Harvester", "Cultivator", "Sprayer"],
        lastUpdated: "2024-07-05",
        notes: "Needs roof repair by winter"
      },
      {
        id: "4",
        name: "East Greenhouse",
        type: "Building",
        coordinates: {
          latitude: 40.7135,
          longitude: -74.0055
        },
        area: 0.5,
        description: "Climate-controlled growing facility",
        features: ["Climate Control", "Irrigation", "Benches"],
        status: "Active",
        crops: ["Tomatoes", "Peppers", "Herbs"],
        lastUpdated: "2024-07-12",
        notes: "Peak production season"
      },
      {
        id: "5",
        name: "Farm Pond",
        type: "Water Source",
        coordinates: {
          latitude: 40.7110,
          longitude: -74.0090
        },
        area: 2.0,
        description: "Primary water source for irrigation",
        features: ["Fish Population", "Pump Station", "Emergency Water"],
        status: "Active",
        lastUpdated: "2024-06-28",
        notes: "Water levels good, pump maintenance due next month"
      }
    ];

    const sampleZones: Zone[] = [
      {
        id: "1",
        name: "Crop Production Zone",
        type: "Production",
        locations: ["1", "4"],
        totalArea: 16.0,
        description: "Primary area for crop cultivation",
        color: "#22c55e"
      },
      {
        id: "2",
        name: "Livestock Zone",
        type: "Grazing",
        locations: ["2"],
        totalArea: 12.0,
        description: "Grazing and livestock management area",
        color: "#3b82f6"
      },
      {
        id: "3",
        name: "Infrastructure Zone",
        type: "Storage",
        locations: ["3", "5"],
        totalArea: 2.5,
        description: "Equipment storage and utilities",
        color: "#f59e0b"
      }
    ];

    setLocations(sampleLocations);
    setZones(sampleZones);
  }, []);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "Field": return <Square className="h-4 w-4" />;
      case "Pasture": return <Trees className="h-4 w-4" />;
      case "Building": return <Home className="h-4 w-4" />;
      case "Equipment Area": return <Tractor className="h-4 w-4" />;
      case "Water Source": return <Droplets className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Field": return "bg-green-100 text-green-800";
      case "Pasture": return "bg-blue-100 text-blue-800";
      case "Building": return "bg-gray-100 text-gray-800";
      case "Equipment Area": return "bg-yellow-100 text-yellow-800";
      case "Water Source": return "bg-cyan-100 text-cyan-800";
      case "Road": return "bg-stone-100 text-stone-800";
      case "Boundary": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-red-100 text-red-800";
      case "Under Development": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalArea = locations.reduce((sum, loc) => sum + (loc.area || 0), 0);
  const activeLocations = locations.filter(loc => loc.status === "Active").length;
  const totalZones = zones.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Farm Map</h2>
          <p className="text-gray-600">Manage farm locations and spatial planning</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddLocationDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
          <Button onClick={() => setShowAddZoneDialog(true)} variant="outline">
            <Layers className="h-4 w-4 mr-2" />
            Add Zone
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Area</p>
                <p className="text-2xl font-bold text-gray-900">{totalArea.toFixed(1)} acres</p>
              </div>
              <Square className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeLocations}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Zones</p>
                <p className="text-2xl font-bold text-gray-900">{totalZones}</p>
              </div>
              <Layers className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="map">Interactive Map</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          {/* Drawing toolbar — only for managers */}
          {isManager && (
            <Card>
              <CardContent className="p-3 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700 mr-1">Draw:</span>
                <Button
                  size="sm"
                  variant={drawMode === "polygon" ? "default" : "outline"}
                  className={drawMode === "polygon" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => { setDrawMode(drawMode === "polygon" ? "none" : "polygon"); setCurrentPolygonPoints([]); }}
                >
                  <Square className="h-4 w-4 mr-1" /> Area / Polygon
                </Button>
                <Button
                  size="sm"
                  variant={drawMode === "marker" ? "default" : "outline"}
                  className={drawMode === "marker" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => setDrawMode(drawMode === "marker" ? "none" : "marker")}
                >
                  <MapPin className="h-4 w-4 mr-1" /> Place Marker
                </Button>
                {drawMode === "polygon" && currentPolygonPoints.length >= 3 && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={finishPolygon}>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Finish ({currentPolygonPoints.length} pts)
                  </Button>
                )}
                {drawMode !== "none" && (
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => { setDrawMode("none"); setCurrentPolygonPoints([]); }}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                )}
                {drawMode === "polygon" && (
                  <span className="text-xs text-gray-500 ml-1">
                    Click on the map to add points ({currentPolygonPoints.length} so far)
                  </span>
                )}
                {drawMode === "marker" && (
                  <span className="text-xs text-gray-500 ml-1">Click on the map to place a marker</span>
                )}
              </CardContent>
            </Card>
          )}

          {/* Leaflet Map */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div style={{ height: 480, cursor: drawMode !== "none" ? "crosshair" : "grab" }}>
                <MapContainer
                  center={[6.303, -10.795]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DrawingLayer
                    mode={drawMode}
                    onPolygonPoint={handlePolygonPoint}
                    onMarkerPlace={handleMarkerPlace}
                  />
                  {/* Drawn areas */}
                  {drawnAreas.filter(a => a.points.length >= 3).map(area => (
                    <Polygon
                      key={area.id}
                      positions={area.points}
                      pathOptions={{ color: area.color, fillColor: area.color, fillOpacity: 0.2, weight: 2 }}
                    >
                      <Popup>
                        <strong>{area.name}</strong><br />{area.type}
                        {isManager && (
                          <div className="mt-1">
                            <button
                              style={{ color: "red", fontSize: 12, cursor: "pointer" }}
                              onClick={() => setDrawnAreas(prev => prev.filter(a => a.id !== area.id))}
                            >Remove</button>
                          </div>
                        )}
                      </Popup>
                    </Polygon>
                  ))}
                  {/* Single-point markers */}
                  {drawnAreas.filter(a => a.points.length === 1).map(area => (
                    <Marker key={area.id} position={area.points[0]}>
                      <Popup>
                        <strong>{area.name}</strong><br />{area.type}
                        {isManager && (
                          <div className="mt-1">
                            <button
                              style={{ color: "red", fontSize: 12, cursor: "pointer" }}
                              onClick={() => setDrawnAreas(prev => prev.filter(a => a.id !== area.id))}
                            >Remove</button>
                          </div>
                        )}
                      </Popup>
                    </Marker>
                  ))}
                  {/* In-progress polygon preview */}
                  {currentPolygonPoints.length >= 2 && (
                    <Polygon
                      positions={currentPolygonPoints}
                      pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.15, weight: 2, dashArray: "6 4" }}
                    />
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Map Legend + Drawn Areas list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Map Legend</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Square, color: "text-green-600", label: "Crop Fields" },
                    { icon: Trees, color: "text-blue-600", label: "Pastures" },
                    { icon: Home, color: "text-gray-600", label: "Buildings" },
                    { icon: Droplets, color: "text-cyan-600", label: "Water Sources" },
                  ].map(({ icon: Icon, color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${color}`} />
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Drawn Areas ({drawnAreas.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {drawnAreas.length === 0 && <p className="text-xs text-gray-400">No areas drawn yet.</p>}
                  {drawnAreas.map(area => (
                    <div key={area.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ background: area.color }} />
                        <span>{area.name}</span>
                        <Badge variant="secondary" className="text-xs">{area.type}</Badge>
                      </div>
                      {isManager && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500" onClick={() => setDrawnAreas(prev => prev.filter(a => a.id !== area.id))}>
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Area Name Dialog */}
          <Dialog open={showAreaNameDialog} onOpenChange={setShowAreaNameDialog}>
            <DialogContent className="sm:max-w-[380px]">
              <DialogHeader>
                <DialogTitle>Name This Area</DialogTitle>
                <DialogDescription>Add a name and type for the area you drew.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Area Name</Label>
                  <Input value={pendingAreaName} onChange={e => setPendingAreaName(e.target.value)} placeholder="e.g. North Crop Field" />
                </div>
                <div>
                  <Label>Area Type</Label>
                  <Select value={pendingAreaType} onValueChange={setPendingAreaType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Field", "Pasture", "Building", "Equipment Area", "Water Source", "Road", "Boundary", "Other"].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={savePolygon} className="w-full bg-green-600 hover:bg-green-700">Save Area</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getLocationIcon(location.type)}
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedLocation(location)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{location.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(location.type)}>
                      {location.type}
                    </Badge>
                    <Badge className={getStatusColor(location.status)} variant="outline">
                      {location.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {location.area && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-medium">{location.area} acres</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coordinates:</span>
                      <span className="font-medium text-xs">
                        {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{location.lastUpdated}</span>
                    </div>
                  </div>

                  {location.features.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {location.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {location.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{location.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {(location.crops && location.crops.length > 0) && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Current Crops:</p>
                      <p className="text-xs text-green-600">{location.crops.join(", ")}</p>
                    </div>
                  )}

                  {(location.livestock && location.livestock.length > 0) && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Livestock:</p>
                      <p className="text-xs text-blue-600">{location.livestock.join(", ")}</p>
                    </div>
                  )}

                  {location.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {location.notes.length > 100 
                        ? `${location.notes.substring(0, 100)}...` 
                        : location.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: zone.color }}
                      />
                      {zone.name}
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge variant="outline">{zone.type}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{zone.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Area:</span>
                      <span className="font-medium">{zone.totalArea} acres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Locations:</span>
                      <span className="font-medium">{zone.locations.length}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Included Locations:</p>
                    <div className="space-y-1">
                      {zone.locations.map((locationId) => {
                        const location = locations.find(l => l.id === locationId);
                        return location ? (
                          <div key={locationId} className="text-xs text-gray-600 flex items-center gap-1">
                            {getLocationIcon(location.type)}
                            {location.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Farm Planning Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Square className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Field Layout</h3>
                    <p className="text-gray-600 text-sm">Plan crop rotations and field usage</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Trees className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Grazing Plans</h3>
                    <p className="text-gray-600 text-sm">Design rotational grazing systems</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Droplets className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Irrigation Design</h3>
                    <p className="text-gray-600 text-sm">Plan water distribution systems</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Home className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Infrastructure</h3>
                    <p className="text-gray-600 text-sm">Plan building and facility placement</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Compass className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Site Analysis</h3>
                    <p className="text-gray-600 text-sm">Analyze topography and soil conditions</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Layers className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Zone Management</h3>
                    <p className="text-gray-600 text-sm">Organize areas by function and use</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Location Dialog */}
      <Dialog open={showAddLocationDialog} onOpenChange={setShowAddLocationDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Add a new location to your farm map.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationName">Location Name</Label>
                <Input
                  id="locationName"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  placeholder="North Field"
                />
              </div>
              <div>
                <Label htmlFor="locationType">Type</Label>
                <Select value={newLocation.type} onValueChange={(value) => setNewLocation({...newLocation, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Field">Field</SelectItem>
                    <SelectItem value="Pasture">Pasture</SelectItem>
                    <SelectItem value="Building">Building</SelectItem>
                    <SelectItem value="Equipment Area">Equipment Area</SelectItem>
                    <SelectItem value="Water Source">Water Source</SelectItem>
                    <SelectItem value="Road">Road</SelectItem>
                    <SelectItem value="Boundary">Boundary</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newLocation.description}
                onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                placeholder="Describe this location..."
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={newLocation.coordinates?.latitude}
                  onChange={(e) => setNewLocation({
                    ...newLocation, 
                    coordinates: {...newLocation.coordinates!, latitude: Number(e.target.value)}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={newLocation.coordinates?.longitude}
                  onChange={(e) => setNewLocation({
                    ...newLocation, 
                    coordinates: {...newLocation.coordinates!, longitude: Number(e.target.value)}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="area">Area (acres)</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  value={newLocation.area}
                  onChange={(e) => setNewLocation({...newLocation, area: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddLocationDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}