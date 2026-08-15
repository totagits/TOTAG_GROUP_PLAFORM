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
  MapPin, 
  Plus, 
  Calendar, 
  Clock,
  ArrowRight,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Sprout,
  BarChart3,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

interface Pasture {
  id: string;
  name: string;
  location: string;
  size: number; // in acres
  grassType: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  capacity: number; // max animals
  currentOccupancy: number;
  waterSource: boolean;
  fencing: "Good" | "Needs Repair" | "Poor";
  notes: string;
  restPeriod: number; // days
  lastGrazed: string;
  nextAvailable: string;
}

interface GrazingMove {
  id: string;
  fromPasture: string;
  toPasture: string;
  animals: string[];
  animalCount: number;
  moveDate: string;
  moveTime: string;
  reason: string;
  duration: number; // planned days
  status: "Planned" | "Active" | "Completed";
  notes: string;
  createdBy: string;
  createdDate: string;
}

interface GrazingRotation {
  id: string;
  name: string;
  pastures: string[];
  animalGroups: string[];
  rotationDays: number;
  startDate: string;
  status: "Active" | "Planned" | "Paused" | "Completed";
  currentPasture: string;
  nextMove: string;
  notes: string;
}

export default function GrazingModule() {
  const [pastures, setPastures] = useState<Pasture[]>([]);
  const [grazingMoves, setGrazingMoves] = useState<GrazingMove[]>([]);
  const [rotations, setRotations] = useState<GrazingRotation[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddPastureDialog, setShowAddPastureDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showRotationDialog, setShowRotationDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPasture, setSelectedPasture] = useState<Pasture | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [newPasture, setNewPasture] = useState<Partial<Pasture>>({
    name: "",
    location: "",
    size: 0,
    grassType: "",
    condition: "Good",
    capacity: 0,
    currentOccupancy: 0,
    waterSource: true,
    fencing: "Good",
    notes: "",
    restPeriod: 30
  });

  const [newMove, setNewMove] = useState<Partial<GrazingMove>>({
    fromPasture: "",
    toPasture: "",
    animals: [],
    animalCount: 0,
    moveDate: format(new Date(), "yyyy-MM-dd"),
    moveTime: "08:00",
    reason: "",
    duration: 14,
    status: "Planned",
    notes: "",
    createdBy: "Current User"
  });

  const [newRotation, setNewRotation] = useState<Partial<GrazingRotation>>({
    name: "",
    pastures: [],
    animalGroups: [],
    rotationDays: 14,
    startDate: format(new Date(), "yyyy-MM-dd"),
    status: "Planned",
    notes: ""
  });

  // Sample data initialization
  useEffect(() => {
    const samplePastures: Pasture[] = [
      {
        id: "1",
        name: "North Pasture",
        location: "Section A",
        size: 25,
        grassType: "Timothy/Clover Mix",
        condition: "Excellent",
        capacity: 40,
        currentOccupancy: 0,
        waterSource: true,
        fencing: "Good",
        notes: "Recently reseeded, excellent grass quality",
        restPeriod: 30,
        lastGrazed: "2024-06-15",
        nextAvailable: "2024-07-15"
      },
      {
        id: "2",
        name: "South Meadow",
        location: "Section B",
        size: 35,
        grassType: "Bermuda Grass",
        condition: "Good",
        capacity: 60,
        currentOccupancy: 25,
        waterSource: true,
        fencing: "Good",
        notes: "Currently grazing - Dairy Herd A",
        restPeriod: 28,
        lastGrazed: "2024-07-01",
        nextAvailable: "2024-07-29"
      },
      {
        id: "3",
        name: "East Field",
        location: "Section C",
        size: 18,
        grassType: "Fescue",
        condition: "Fair",
        capacity: 30,
        currentOccupancy: 0,
        waterSource: false,
        fencing: "Needs Repair",
        notes: "Needs water tank installation and fence repair",
        restPeriod: 35,
        lastGrazed: "2024-05-20",
        nextAvailable: "2024-06-24"
      },
      {
        id: "4",
        name: "West Paddock",
        location: "Section D",
        size: 12,
        grassType: "Mixed Grasses",
        condition: "Good",
        capacity: 20,
        currentOccupancy: 15,
        waterSource: true,
        fencing: "Good",
        notes: "Good for young stock",
        restPeriod: 21,
        lastGrazed: "2024-06-28",
        nextAvailable: "2024-07-19"
      }
    ];

    const sampleMoves: GrazingMove[] = [
      {
        id: "1",
        fromPasture: "South Meadow",
        toPasture: "North Pasture",
        animals: ["Dairy Herd A"],
        animalCount: 25,
        moveDate: "2024-07-15",
        moveTime: "08:00",
        reason: "Rotation schedule",
        duration: 14,
        status: "Planned",
        notes: "Move to fresh pasture after rest period",
        createdBy: "Farm Manager",
        createdDate: "2024-07-10"
      },
      {
        id: "2",
        fromPasture: "West Paddock",
        toPasture: "East Field",
        animals: ["Young Stock Group"],
        animalCount: 15,
        moveDate: "2024-07-20",
        moveTime: "09:00",
        reason: "Pasture rest needed",
        duration: 10,
        status: "Planned",
        notes: "After fence repairs are completed",
        createdBy: "Assistant Manager",
        createdDate: "2024-07-12"
      }
    ];

    const sampleRotations: GrazingRotation[] = [
      {
        id: "1",
        name: "Dairy Herd Rotation",
        pastures: ["South Meadow", "North Pasture", "West Paddock"],
        animalGroups: ["Dairy Herd A"],
        rotationDays: 14,
        startDate: "2024-07-01",
        status: "Active",
        currentPasture: "South Meadow",
        nextMove: "2024-07-15",
        notes: "Standard dairy rotation schedule"
      }
    ];

    setPastures(samplePastures);
    setGrazingMoves(sampleMoves);
    setRotations(sampleRotations);
  }, []);

  const addPasture = () => {
    if (newPasture.name && newPasture.location) {
      const pasture: Pasture = {
        id: (pastures.length + 1).toString(),
        name: newPasture.name,
        location: newPasture.location || "",
        size: newPasture.size || 0,
        grassType: newPasture.grassType || "",
        condition: newPasture.condition || "Good",
        capacity: newPasture.capacity || 0,
        currentOccupancy: 0,
        waterSource: newPasture.waterSource || false,
        fencing: newPasture.fencing || "Good",
        notes: newPasture.notes || "",
        restPeriod: newPasture.restPeriod || 30,
        lastGrazed: "",
        nextAvailable: ""
      };

      setPastures([...pastures, pasture]);
      setNewPasture({
        name: "",
        location: "",
        size: 0,
        grassType: "",
        condition: "Good",
        capacity: 0,
        currentOccupancy: 0,
        waterSource: true,
        fencing: "Good",
        notes: "",
        restPeriod: 30
      });
      setShowAddPastureDialog(false);
    }
  };

  const addGrazingMove = () => {
    if (newMove.fromPasture && newMove.toPasture && newMove.moveDate) {
      const move: GrazingMove = {
        id: (grazingMoves.length + 1).toString(),
        fromPasture: newMove.fromPasture,
        toPasture: newMove.toPasture,
        animals: newMove.animals || [],
        animalCount: newMove.animalCount || 0,
        moveDate: newMove.moveDate,
        moveTime: newMove.moveTime || "08:00",
        reason: newMove.reason || "",
        duration: newMove.duration || 14,
        status: newMove.status || "Planned",
        notes: newMove.notes || "",
        createdBy: newMove.createdBy || "Current User",
        createdDate: format(new Date(), "yyyy-MM-dd")
      };

      setGrazingMoves([...grazingMoves, move]);
      setNewMove({
        fromPasture: "",
        toPasture: "",
        animals: [],
        animalCount: 0,
        moveDate: format(new Date(), "yyyy-MM-dd"),
        moveTime: "08:00",
        reason: "",
        duration: 14,
        status: "Planned",
        notes: "",
        createdBy: "Current User"
      });
      setShowMoveDialog(false);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Good": return "bg-blue-100 text-blue-800";
      case "Fair": return "bg-yellow-100 text-yellow-800";
      case "Poor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Planned": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-gray-100 text-gray-800";
      case "Paused": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPastures = pastures.filter(pasture =>
    pasture.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pasture.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Grazing Management</h2>
          <p className="text-gray-600">Manage pastures, rotations, and livestock movements</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddPastureDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Pasture
          </Button>
          <Button onClick={() => setShowMoveDialog(true)} variant="outline">
            <ArrowRight className="h-4 w-4 mr-2" />
            Move Animals
          </Button>
          <Button onClick={() => setShowRotationDialog(true)} variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            New Rotation
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pastures</p>
                <p className="text-2xl font-bold text-gray-900">{pastures.length}</p>
              </div>
              <Sprout className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Currently Occupied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pastures.filter(p => p.currentOccupancy > 0).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Acres</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pastures.reduce((sum, p) => sum + p.size, 0)}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planned Moves</p>
                <p className="text-2xl font-bold text-gray-900">
                  {grazingMoves.filter(m => m.status === "Planned").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pastures">Pastures</TabsTrigger>
          <TabsTrigger value="moves">Moves</TabsTrigger>
          <TabsTrigger value="rotations">Rotations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Grazing Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Current Grazing Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastures.filter(p => p.currentOccupancy > 0).map((pasture) => (
                  <div key={pasture.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{pasture.name}</h4>
                      <Badge className={getConditionColor(pasture.condition)}>
                        {pasture.condition}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Animals: {pasture.currentOccupancy}/{pasture.capacity}</p>
                      <p>Size: {pasture.size} acres</p>
                      <p>Grass: {pasture.grassType}</p>
                      {pasture.notes && <p className="text-blue-600">{pasture.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Moves */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Moves
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {grazingMoves.filter(m => m.status === "Planned").slice(0, 5).map((move) => (
                  <div key={move.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{move.fromPasture} → {move.toPasture}</p>
                        <p className="text-sm text-gray-600">
                          {move.animalCount} animals • {move.moveDate} at {move.moveTime}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(move.status)}>
                      {move.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pastures" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pastures..."
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

          {/* Pastures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPastures.map((pasture) => (
              <Card key={pasture.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pasture.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPasture(pasture);
                        setShowEditDialog(true);
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{pasture.location}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getConditionColor(pasture.condition)}>
                      {pasture.condition}
                    </Badge>
                    <span className="text-sm text-gray-600">{pasture.size} acres</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Occupancy:</span>
                      <span className="font-medium">
                        {pasture.currentOccupancy}/{pasture.capacity} animals
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((pasture.currentOccupancy / pasture.capacity) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Grass:</span> {pasture.grassType}</p>
                    <p><span className="text-gray-600">Water:</span> {pasture.waterSource ? "Yes" : "No"}</p>
                    <p><span className="text-gray-600">Fencing:</span> {pasture.fencing}</p>
                  </div>

                  {pasture.currentOccupancy === 0 && (
                    <p className="text-xs text-green-600">Available for grazing</p>
                  )}
                  
                  {pasture.notes && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      {pasture.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="moves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grazing Moves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {grazingMoves.map((move) => (
                  <div key={move.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <h4 className="font-semibold">
                          {move.fromPasture} → {move.toPasture}
                        </h4>
                      </div>
                      <Badge className={getStatusColor(move.status)}>
                        {move.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Animals</p>
                        <p className="font-medium">{move.animalCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Move Date</p>
                        <p className="font-medium">{move.moveDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-medium">{move.duration} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reason</p>
                        <p className="font-medium">{move.reason}</p>
                      </div>
                    </div>
                    {move.notes && (
                      <p className="text-sm text-gray-600 mt-2">{move.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rotations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grazing Rotations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rotations.map((rotation) => (
                  <div key={rotation.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{rotation.name}</h4>
                      <Badge className={getStatusColor(rotation.status)}>
                        {rotation.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Current Pasture</p>
                        <p className="font-medium">{rotation.currentPasture}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rotation Days</p>
                        <p className="font-medium">{rotation.rotationDays}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Move</p>
                        <p className="font-medium">{rotation.nextMove}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Pastures</p>
                        <p className="font-medium">{rotation.pastures.length}</p>
                      </div>
                    </div>
                    {rotation.notes && (
                      <p className="text-sm text-gray-600 mt-2">{rotation.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Pasture Dialog */}
      <Dialog open={showAddPastureDialog} onOpenChange={setShowAddPastureDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Pasture</DialogTitle>
            <DialogDescription>
              Create a new pasture for your grazing management system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newPasture.name}
                onChange={(e) => setNewPasture({...newPasture, name: e.target.value})}
                className="col-span-3"
                placeholder="e.g., North Pasture"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input
                id="location"
                value={newPasture.location}
                onChange={(e) => setNewPasture({...newPasture, location: e.target.value})}
                className="col-span-3"
                placeholder="e.g., Section A"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">Size (acres)</Label>
              <Input
                id="size"
                type="number"
                value={newPasture.size}
                onChange={(e) => setNewPasture({...newPasture, size: Number(e.target.value)})}
                className="col-span-3"
                placeholder="25"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grassType" className="text-right">Grass Type</Label>
              <Input
                id="grassType"
                value={newPasture.grassType}
                onChange={(e) => setNewPasture({...newPasture, grassType: e.target.value})}
                className="col-span-3"
                placeholder="e.g., Timothy/Clover Mix"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={newPasture.capacity}
                onChange={(e) => setNewPasture({...newPasture, capacity: Number(e.target.value)})}
                className="col-span-3"
                placeholder="40"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">Condition</Label>
              <Select value={newPasture.condition} onValueChange={(value) => setNewPasture({...newPasture, condition: value as any})}>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <Textarea
                id="notes"
                value={newPasture.notes}
                onChange={(e) => setNewPasture({...newPasture, notes: e.target.value})}
                className="col-span-3"
                placeholder="Additional notes about this pasture..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddPastureDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addPasture} className="bg-green-600 hover:bg-green-700">
              Add Pasture
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Move Animals Dialog */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Move Animals</DialogTitle>
            <DialogDescription>
              Plan or execute a movement of animals between pastures.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fromPasture" className="text-right">From</Label>
              <Select value={newMove.fromPasture} onValueChange={(value) => setNewMove({...newMove, fromPasture: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select source pasture" />
                </SelectTrigger>
                <SelectContent>
                  {pastures.filter(p => p.currentOccupancy > 0).map((pasture) => (
                    <SelectItem key={pasture.id} value={pasture.name}>
                      {pasture.name} ({pasture.currentOccupancy} animals)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="toPasture" className="text-right">To</Label>
              <Select value={newMove.toPasture} onValueChange={(value) => setNewMove({...newMove, toPasture: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select destination pasture" />
                </SelectTrigger>
                <SelectContent>
                  {pastures.filter(p => p.currentOccupancy === 0).map((pasture) => (
                    <SelectItem key={pasture.id} value={pasture.name}>
                      {pasture.name} (Available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animalCount" className="text-right">Animal Count</Label>
              <Input
                id="animalCount"
                type="number"
                value={newMove.animalCount}
                onChange={(e) => setNewMove({...newMove, animalCount: Number(e.target.value)})}
                className="col-span-3"
                placeholder="25"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="moveDate" className="text-right">Move Date</Label>
              <Input
                id="moveDate"
                type="date"
                value={newMove.moveDate}
                onChange={(e) => setNewMove({...newMove, moveDate: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={newMove.duration}
                onChange={(e) => setNewMove({...newMove, duration: Number(e.target.value)})}
                className="col-span-3"
                placeholder="14"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">Reason</Label>
              <Input
                id="reason"
                value={newMove.reason}
                onChange={(e) => setNewMove({...newMove, reason: e.target.value})}
                className="col-span-3"
                placeholder="e.g., Rotation schedule"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowMoveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addGrazingMove} className="bg-green-600 hover:bg-green-700">
              Schedule Move
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}