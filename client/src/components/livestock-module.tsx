import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Beef, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Heart,
  Scale,
  Calendar,
  MapPin,
  Users,
  Syringe,
  Cookie,
  Download,
  Upload,
  FileText,
  Printer,
  Eye,
  ChevronDown,
  X
} from "lucide-react";

interface Animal {
  id: string;
  name: string;
  tagNumber: string;
  type: string;
  breed: string;
  gender: "Male" | "Female";
  status: string;
  birthDate: string;
  weight: number;
  breedingStatus: string;
  location: string;
  estimatedValue: number;
  lastMeasurement: string;
  healthStatus: string;
  condition: number;
  notes: string;
  isBreedingStock: boolean;
  sire?: string;
  dam?: string;
  purchaseDate?: string;
  purchasePrice?: number;
}

const animalTypes = [
  "Cattle", "Sheep", "Goats", "Pigs", "Chickens", "Turkeys", "Ducks", "Geese", "Horses", "Donkeys", "Llamas", "Alpacas"
];

const animalStatuses = [
  "Active", "Dry", "Finishing", "Lactating", "Lost", "Quarantined", "Sick", "Weaning",
  "Archived", "Butchered", "Culled", "Deceased", "For Sale", "Off Farm", "Reference", "Sold"
];

const breedingStatuses = ["Open", "Exposed", "Pregnant"];

const healthStatuses = ["Excellent", "Good", "Fair", "Poor", "Sick"];

interface LivestockModuleProps {
  autoOpenGroupDialog?: boolean;
  onGroupDialogClose?: () => void;
}

export default function LivestockModule({ autoOpenGroupDialog = false, onGroupDialogClose }: LivestockModuleProps) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<any>({
    type: "",
    status: ["Active", "Dry", "Finishing", "Lactating", "Lost", "Quarantined", "Sick", "Weaning"],
    gender: [],
    breed: "",
    breedingStatus: []
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newAnimal, setNewAnimal] = useState<Partial<Animal>>({
    name: "",
    tagNumber: "",
    type: "",
    breed: "",
    gender: "Female",
    status: "Active",
    birthDate: "",
    weight: 0,
    breedingStatus: "Open",
    location: "",
    estimatedValue: 0,
    healthStatus: "Good",
    condition: 5,
    notes: "",
    isBreedingStock: false
  });

  // Handle auto-open group dialog
  useEffect(() => {
    if (autoOpenGroupDialog) {
      setShowGroupDialog(true);
    }
  }, [autoOpenGroupDialog]);

  // Sample livestock data
  useEffect(() => {
    const sampleAnimals: Animal[] = [
      {
        id: "1",
        name: "Bessie",
        tagNumber: "C001",
        type: "Cattle",
        breed: "Holstein",
        gender: "Female",
        status: "Lactating",
        birthDate: "2022-03-15",
        weight: 650,
        breedingStatus: "Open",
        location: "Pasture A",
        estimatedValue: 1200,
        lastMeasurement: "2024-07-01",
        healthStatus: "Good",
        condition: 7,
        notes: "High milk producer",
        isBreedingStock: true,
        sire: "Bull Alpha",
        dam: "Cow Beta"
      },
      {
        id: "2",
        name: "Charlie",
        tagNumber: "C002",
        type: "Cattle",
        breed: "Angus",
        gender: "Male",
        status: "Finishing",
        birthDate: "2023-01-20",
        weight: 580,
        breedingStatus: "Open",
        location: "Feedlot B",
        estimatedValue: 950,
        lastMeasurement: "2024-06-15",
        healthStatus: "Excellent",
        condition: 8,
        notes: "Ready for market soon",
        isBreedingStock: false
      },
      {
        id: "3",
        name: "Dolly",
        tagNumber: "S001",
        type: "Sheep",
        breed: "Merino",
        gender: "Female",
        status: "Pregnant",
        birthDate: "2021-09-10",
        weight: 85,
        breedingStatus: "Pregnant",
        location: "Pasture C",
        estimatedValue: 180,
        lastMeasurement: "2024-06-30",
        healthStatus: "Good",
        condition: 6,
        notes: "Due in 4 weeks",
        isBreedingStock: true,
        purchaseDate: "2021-11-15",
        purchasePrice: 150
      },
      {
        id: "4",
        name: "Porky",
        tagNumber: "P001",
        type: "Pigs",
        breed: "Yorkshire",
        gender: "Male",
        status: "Active",
        birthDate: "2024-02-28",
        weight: 120,
        breedingStatus: "Open",
        location: "Pig Pen 1",
        estimatedValue: 300,
        lastMeasurement: "2024-07-10",
        healthStatus: "Good",
        condition: 7,
        notes: "Fast growing piglet",
        isBreedingStock: false
      },
      {
        id: "5",
        name: "Henrietta",
        tagNumber: "CH001",
        type: "Chickens",
        breed: "Rhode Island Red",
        gender: "Female",
        status: "Active",
        birthDate: "2023-04-05",
        weight: 2.5,
        breedingStatus: "Open",
        location: "Chicken Coop A",
        estimatedValue: 25,
        lastMeasurement: "2024-07-08",
        healthStatus: "Excellent",
        condition: 8,
        notes: "Good egg layer",
        isBreedingStock: false
      }
    ];
    setAnimals(sampleAnimals);
    setFilteredAnimals(sampleAnimals);
  }, []);

  // Filter animals based on search and filters
  useEffect(() => {
    let filtered = animals.filter(animal => {
      const matchesSearch = !searchTerm || 
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !selectedFilters.type || animal.type === selectedFilters.type;
      const matchesStatus = selectedFilters.status.length === 0 || selectedFilters.status.includes(animal.status);
      const matchesGender = selectedFilters.gender.length === 0 || selectedFilters.gender.includes(animal.gender);
      const matchesBreed = !selectedFilters.breed || animal.breed.toLowerCase().includes(selectedFilters.breed.toLowerCase());
      const matchesBreedingStatus = selectedFilters.breedingStatus.length === 0 || selectedFilters.breedingStatus.includes(animal.breedingStatus);

      return matchesSearch && matchesType && matchesStatus && matchesGender && matchesBreed && matchesBreedingStatus;
    });

    setFilteredAnimals(filtered);
  }, [animals, searchTerm, selectedFilters]);

  const addAnimal = () => {
    if (newAnimal.name && newAnimal.tagNumber && newAnimal.type) {
      const animal: Animal = {
        id: Date.now().toString(),
        name: newAnimal.name!,
        tagNumber: newAnimal.tagNumber!,
        type: newAnimal.type!,
        breed: newAnimal.breed || "",
        gender: newAnimal.gender as "Male" | "Female",
        status: newAnimal.status || "Active",
        birthDate: newAnimal.birthDate || "",
        weight: newAnimal.weight || 0,
        breedingStatus: newAnimal.breedingStatus || "Open",
        location: newAnimal.location || "",
        estimatedValue: newAnimal.estimatedValue || 0,
        lastMeasurement: new Date().toISOString().split('T')[0],
        healthStatus: newAnimal.healthStatus || "Good",
        condition: newAnimal.condition || 5,
        notes: newAnimal.notes || "",
        isBreedingStock: newAnimal.isBreedingStock || false
      };
      setAnimals([...animals, animal]);
      setNewAnimal({
        name: "",
        tagNumber: "",
        type: "",
        breed: "",
        gender: "Female",
        status: "Active",
        birthDate: "",
        weight: 0,
        breedingStatus: "Open",
        location: "",
        estimatedValue: 0,
        healthStatus: "Good",
        condition: 5,
        notes: "",
        isBreedingStock: false
      });
      setShowAddDialog(false);
    }
  };

  const updateAnimal = (updatedAnimal: Animal) => {
    setAnimals(animals.map(animal => 
      animal.id === updatedAnimal.id ? updatedAnimal : animal
    ));
    setShowEditDialog(false);
    setSelectedAnimal(null);
  };

  const deleteAnimal = (id: string) => {
    setAnimals(animals.filter(animal => animal.id !== id));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Active": "bg-green-100 text-green-800",
      "Lactating": "bg-blue-100 text-blue-800",
      "Pregnant": "bg-purple-100 text-purple-800",
      "Finishing": "bg-orange-100 text-orange-800",
      "Sick": "bg-red-100 text-red-800",
      "Quarantined": "bg-yellow-100 text-yellow-800",
      "Dry": "bg-gray-100 text-gray-800",
      "Weaning": "bg-indigo-100 text-indigo-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getHealthStatusColor = (health: string) => {
    const colors: Record<string, string> = {
      "Excellent": "text-green-600",
      "Good": "text-blue-600",
      "Fair": "text-yellow-600",
      "Poor": "text-orange-600",
      "Sick": "text-red-600"
    };
    return colors[health] || "text-gray-600";
  };

  const clearFilters = () => {
    setSelectedFilters({
      type: "",
      status: ["Active", "Dry", "Finishing", "Lactating", "Lost", "Quarantined", "Sick", "Weaning"],
      gender: [],
      breed: "",
      breedingStatus: []
    });
  };

  const resetFilters = () => {
    setSelectedFilters({
      type: "",
      status: ["Active", "Dry", "Finishing", "Lactating", "Lost", "Quarantined", "Sick", "Weaning"],
      gender: [],
      breed: "",
      breedingStatus: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Livestock</h1>
          <p className="text-gray-600">Manage your farm animals and livestock groups</p>
        </div>
      </div>

      {/* Action Buttons and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Animal
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Livestock Group</DialogTitle>
                <DialogDescription>
                  Create a new group to organize your animals for easier management and tracking.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="groupName">Group Name *</Label>
                  <Input
                    id="groupName"
                    placeholder="e.g., Breeding Herd, Young Stock, Market Ready"
                  />
                </div>
                <div>
                  <Label htmlFor="groupDescription">Description</Label>
                  <Textarea
                    id="groupDescription"
                    placeholder="Optional description of this group's purpose"
                  />
                </div>
                <div>
                  <Label htmlFor="groupType">Group Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breeding">Breeding Group</SelectItem>
                      <SelectItem value="production">Production Group</SelectItem>
                      <SelectItem value="age">Age Group</SelectItem>
                      <SelectItem value="location">Location Group</SelectItem>
                      <SelectItem value="health">Health Group</SelectItem>
                      <SelectItem value="custom">Custom Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowGroupDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Add group logic here
                  setShowGroupDialog(false);
                }}>
                  Create Group
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Upload className="h-4 w-4 mr-2" />
                Import Records
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Bulk Add Animals
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download Records
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2 items-center w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search Animals"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Animal Type</Label>
                <Select value={selectedFilters.type} onValueChange={(value) => 
                  setSelectedFilters({...selectedFilters, type: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {animalTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Breed</Label>
                <Input
                  placeholder="Enter breed"
                  value={selectedFilters.breed}
                  onChange={(e) => setSelectedFilters({...selectedFilters, breed: e.target.value})}
                />
              </div>

              <div>
                <Label>Gender</Label>
                <div className="flex gap-4 mt-2">
                  {["Male", "Female"].map(gender => (
                    <label key={gender} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.gender.includes(gender)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFilters({
                              ...selectedFilters,
                              gender: [...selectedFilters.gender, gender]
                            });
                          } else {
                            setSelectedFilters({
                              ...selectedFilters,
                              gender: selectedFilters.gender.filter((g: string) => g !== gender)
                            });
                          }
                        }}
                      />
                      <span>{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Label>Status</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-2">
                {animalStatuses.map(status => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.status.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFilters({
                            ...selectedFilters,
                            status: [...selectedFilters.status, status]
                          });
                        } else {
                          setSelectedFilters({
                            ...selectedFilters,
                            status: selectedFilters.status.filter((s: string) => s !== status)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={resetFilters} variant="outline">
                Reset
              </Button>
              <Button onClick={clearFilters} variant="outline" className="text-red-600">
                Clear
              </Button>
              <Button onClick={() => setShowFilters(false)}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Animals</p>
                <p className="text-2xl font-bold">{filteredAnimals.length}</p>
              </div>
              <Beef className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Breeding Stock</p>
                <p className="text-2xl font-bold">{filteredAnimals.filter(a => a.isBreedingStock).length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pregnant</p>
                <p className="text-2xl font-bold">{filteredAnimals.filter(a => a.breedingStatus === "Pregnant").length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sick/Quarantined</p>
                <p className="text-2xl font-bold">{filteredAnimals.filter(a => a.status === "Sick" || a.status === "Quarantined").length}</p>
              </div>
              <Syringe className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animals List */}
      {filteredAnimals.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Beef className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No animals yet?</h3>
            <p className="text-gray-500 mb-4">Add a new animal and they'll show up here.</p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Animal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAnimals.map(animal => (
            <Card key={animal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold">{animal.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {animal.tagNumber}
                      </Badge>
                      <Badge className={getStatusColor(animal.status)}>
                        {animal.status}
                      </Badge>
                      {animal.isBreedingStock && (
                        <Badge variant="secondary">
                          <Heart className="h-3 w-3 mr-1" />
                          Breeding Stock
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-medium">{animal.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Breed:</span>
                        <p className="font-medium">{animal.breed}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Gender:</span>
                        <p className="font-medium">{animal.gender}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <p className="font-medium flex items-center">
                          <Scale className="h-3 w-3 mr-1" />
                          {animal.weight} {animal.type === "Chickens" ? "lbs" : "lbs"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="font-medium flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {animal.location}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Health:</span>
                        <p className={`font-medium ${getHealthStatusColor(animal.healthStatus)}`}>
                          {animal.healthStatus}
                        </p>
                      </div>
                    </div>

                    {animal.notes && (
                      <p className="text-sm text-gray-600 mt-3 italic">{animal.notes}</p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setSelectedAnimal(animal);
                        setShowEditDialog(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Syringe className="h-4 w-4 mr-2" />
                        Add Treatment
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Cookie className="h-4 w-4 mr-2" />
                        Record Feeding
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Scale className="h-4 w-4 mr-2" />
                        Record Weight
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        const newAnimal = { ...animal, id: Date.now().toString(), name: `${animal.name} (Copy)`, tagNumber: `${animal.tagNumber}-COPY` };
                        setAnimals([...animals, newAnimal]);
                      }}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteAnimal(animal.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Animal Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Animal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newAnimal.name}
                  onChange={(e) => setNewAnimal({...newAnimal, name: e.target.value})}
                  placeholder="Animal name"
                />
              </div>
              <div>
                <Label htmlFor="tag">Tag Number *</Label>
                <Input
                  id="tag"
                  value={newAnimal.tagNumber}
                  onChange={(e) => setNewAnimal({...newAnimal, tagNumber: e.target.value})}
                  placeholder="Tag/ID number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Animal Type *</Label>
                <Select value={newAnimal.type} onValueChange={(value) => setNewAnimal({...newAnimal, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {animalTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  value={newAnimal.breed}
                  onChange={(e) => setNewAnimal({...newAnimal, breed: e.target.value})}
                  placeholder="Breed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={newAnimal.gender} onValueChange={(value: any) => setNewAnimal({...newAnimal, gender: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newAnimal.status} onValueChange={(value) => setNewAnimal({...newAnimal, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {animalStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={newAnimal.birthDate}
                  onChange={(e) => setNewAnimal({...newAnimal, birthDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  value={newAnimal.weight}
                  onChange={(e) => setNewAnimal({...newAnimal, weight: parseFloat(e.target.value) || 0})}
                  placeholder="Weight in lbs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newAnimal.location}
                  onChange={(e) => setNewAnimal({...newAnimal, location: e.target.value})}
                  placeholder="Pasture, pen, etc."
                />
              </div>
              <div>
                <Label htmlFor="value">Estimated Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={newAnimal.estimatedValue}
                  onChange={(e) => setNewAnimal({...newAnimal, estimatedValue: parseFloat(e.target.value) || 0})}
                  placeholder="Dollar amount"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newAnimal.notes}
                onChange={(e) => setNewAnimal({...newAnimal, notes: e.target.value})}
                placeholder="Additional notes about this animal"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="breeding"
                checked={newAnimal.isBreedingStock}
                onChange={(e) => setNewAnimal({...newAnimal, isBreedingStock: e.target.checked})}
              />
              <Label htmlFor="breeding">This is breeding stock</Label>
            </div>

            <Button onClick={addAnimal} className="w-full bg-green-600 hover:bg-green-700">
              Add Animal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Animal Dialog */}
      {selectedAnimal && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Animal - {selectedAnimal.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedAnimal.name}
                    onChange={(e) => setSelectedAnimal({...selectedAnimal, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tag">Tag Number</Label>
                  <Input
                    id="edit-tag"
                    value={selectedAnimal.tagNumber}
                    onChange={(e) => setSelectedAnimal({...selectedAnimal, tagNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-weight">Weight</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    value={selectedAnimal.weight}
                    onChange={(e) => setSelectedAnimal({...selectedAnimal, weight: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={selectedAnimal.status} onValueChange={(value) => setSelectedAnimal({...selectedAnimal, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {animalStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={selectedAnimal.notes}
                  onChange={(e) => setSelectedAnimal({...selectedAnimal, notes: e.target.value})}
                />
              </div>

              <Button onClick={() => updateAnimal(selectedAnimal)} className="w-full">
                Update Animal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Group Dialog */}
      <Dialog open={showGroupDialog} onOpenChange={(open) => {
        setShowGroupDialog(open);
        if (!open && onGroupDialogClose) {
          onGroupDialogClose();
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Livestock Group</DialogTitle>
            <DialogDescription>
              Create a new group to organize your animals for easier management.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupName" className="text-right">
                Group Name
              </Label>
              <Input
                id="groupName"
                placeholder="e.g., Dairy Herd A"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupType" className="text-right">
                Type
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select animal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cattle">Cattle</SelectItem>
                  <SelectItem value="sheep">Sheep</SelectItem>
                  <SelectItem value="goats">Goats</SelectItem>
                  <SelectItem value="pigs">Pigs</SelectItem>
                  <SelectItem value="chickens">Chickens</SelectItem>
                  <SelectItem value="horses">Horses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupDescription" className="text-right">
                Description
              </Label>
              <Textarea
                id="groupDescription"
                placeholder="Optional description"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupLocation" className="text-right">
                Location
              </Label>
              <Input
                id="groupLocation"
                placeholder="e.g., Pasture A"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowGroupDialog(false);
              if (onGroupDialogClose) {
                onGroupDialogClose();
              }
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowGroupDialog(false);
              if (onGroupDialogClose) {
                onGroupDialogClose();
              }
              // Add group creation logic here
            }} className="bg-green-600 hover:bg-green-700">
              Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}