import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Plus, 
  Wrench,
  Truck,
  AlertTriangle,
  Calendar,
  DollarSign,
  FileText,
  Shield
} from "lucide-react";
import { format } from "date-fns";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: "Active" | "Maintenance" | "Retired" | "Out of Service";
  brand: string;
  model: string;
  modelYear: number;
  idPlateNumber: string;
  serialNumber: string;
  electronicId: string;
  engine: string;
  transmission: string;
  trackUsageHours: number;
  currentHours: number;
  serviceReminderInterval: number;
  emailAlerts: string;
  estimatedUsageCost: number;
  usageCostUnit: "miles" | "hours";
  serviceManualLink: string;
  acquisitionType: "Leased" | "Purchased";
  dateAcquired: string;
  purchasePrice: number;
  isInsured: boolean;
  estimatedValue: number;
  description: string;
}

export default function EquipmentModule() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false);

  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: "",
    type: "",
    status: "Active",
    brand: "",
    model: "",
    modelYear: new Date().getFullYear(),
    idPlateNumber: "",
    serialNumber: "",
    electronicId: "",
    engine: "",
    transmission: "",
    trackUsageHours: 0,
    currentHours: 0.0,
    serviceReminderInterval: 0,
    emailAlerts: "",
    estimatedUsageCost: 0,
    usageCostUnit: "hours",
    serviceManualLink: "",
    acquisitionType: "Purchased",
    dateAcquired: format(new Date(), "yyyy-MM-dd"),
    purchasePrice: 0.00,
    isInsured: false,
    estimatedValue: 0.00,
    description: ""
  });

  // Sample data initialization
  useEffect(() => {
    const sampleEquipment: Equipment[] = [
      {
        id: "1",
        name: "Main Tractor",
        type: "Tractor",
        status: "Active",
        brand: "John Deere",
        model: "1023E",
        modelYear: 2022,
        idPlateNumber: "TD-001",
        serialNumber: "JD123456789",
        electronicId: "RFID001",
        engine: "2.9L 3-cyl diesel",
        transmission: "Collar shift Hi-Lo",
        trackUsageHours: 1250,
        currentHours: 1250.5,
        serviceReminderInterval: 100,
        emailAlerts: "farm@totag.com",
        estimatedUsageCost: 25.50,
        usageCostUnit: "hours",
        serviceManualLink: "https://manuals.deere.com/1023E",
        acquisitionType: "Purchased",
        dateAcquired: "2022-03-15",
        purchasePrice: 28500.00,
        isInsured: true,
        estimatedValue: 25000.00,
        description: "Primary field tractor for cultivation and harvest operations"
      },
      {
        id: "2",
        name: "Combine Harvester",
        type: "Harvester",
        status: "Active",
        brand: "Case IH",
        model: "240 Axial-Flow",
        modelYear: 2021,
        idPlateNumber: "CH-001",
        serialNumber: "CIH987654321",
        electronicId: "RFID002",
        engine: "6.7L 6-cyl diesel",
        transmission: "Hydrostatic",
        trackUsageHours: 485,
        currentHours: 485.2,
        serviceReminderInterval: 50,
        emailAlerts: "farm@totag.com",
        estimatedUsageCost: 45.75,
        usageCostUnit: "hours",
        serviceManualLink: "https://manuals.caseih.com/240",
        acquisitionType: "Leased",
        dateAcquired: "2021-06-01",
        purchasePrice: 0.00,
        isInsured: true,
        estimatedValue: 85000.00,
        description: "High-capacity combine for grain harvest operations"
      }
    ];
    setEquipment(sampleEquipment);
  }, []);

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800";
      case "Retired": return "bg-gray-100 text-gray-800";
      case "Out of Service": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMaintenanceStatus = (equipment: Equipment) => {
    const hoursUntilService = equipment.serviceReminderInterval - (equipment.currentHours % equipment.serviceReminderInterval);
    if (hoursUntilService <= 10) {
      return { status: "Due Soon", color: "text-red-600" };
    } else if (hoursUntilService <= 25) {
      return { status: "Upcoming", color: "text-yellow-600" };
    }
    return { status: "Good", color: "text-green-600" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Equipment Management</h2>
        </div>
        <Button onClick={() => setShowAddEquipmentDialog(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          New Equipment
        </Button>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {equipment.map((item) => {
          const maintenanceStatus = getMaintenanceStatus(item);
          return (
            <Card key={item.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-orange-600" />
                    {item.name}
                  </CardTitle>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{item.brand} {item.model}</span>
                  <span>•</span>
                  <span>{item.modelYear}</span>
                  <span>•</span>
                  <span>{item.type}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Usage and Maintenance */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Hours</p>
                    <p className="text-lg font-bold text-gray-900">{item.currentHours.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Next Service</p>
                    <p className={`text-sm font-medium ${maintenanceStatus.color}`}>
                      {maintenanceStatus.status}
                    </p>
                  </div>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">ID/Plate</p>
                    <p className="font-medium">{item.idPlateNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Serial Number</p>
                    <p className="font-medium">{item.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Engine</p>
                    <p className="font-medium">{item.engine}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Transmission</p>
                    <p className="font-medium">{item.transmission}</p>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t text-sm">
                  <div>
                    <p className="text-gray-600">Usage Cost</p>
                    <p className="font-bold text-green-600">
                      ${item.estimatedUsageCost}/{item.usageCostUnit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Est. Value</p>
                    <p className="font-bold text-blue-600">
                      ${item.estimatedValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {item.acquisitionType}
                    </Badge>
                    {item.isInsured && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Insured
                      </Badge>
                    )}
                  </div>
                  {item.serviceManualLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.serviceManualLink} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-3 w-3 mr-1" />
                        Manual
                      </a>
                    </Button>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {item.description}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Equipment Dialog */}
      <Dialog open={showAddEquipmentDialog} onOpenChange={setShowAddEquipmentDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>New Equipment</DialogTitle>
            <DialogDescription>
              Add new equipment to your farm management system with complete details and tracking information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4 max-h-[700px] overflow-y-auto">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipmentName">Name</Label>
                  <Input
                    id="equipmentName"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                    placeholder="Equipment name"
                  />
                </div>
                <div>
                  <Label htmlFor="equipmentType">Type</Label>
                  <Select value={newEquipment.type} onValueChange={(value) => setNewEquipment({...newEquipment, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tractor, Harvester, etc" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tractor">Tractor</SelectItem>
                      <SelectItem value="Harvester">Harvester</SelectItem>
                      <SelectItem value="Planter">Planter</SelectItem>
                      <SelectItem value="Cultivator">Cultivator</SelectItem>
                      <SelectItem value="Sprayer">Sprayer</SelectItem>
                      <SelectItem value="Mower">Mower</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Trailer">Trailer</SelectItem>
                      <SelectItem value="Implement">Implement</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipmentStatus">Status</Label>
                  <Select value={newEquipment.status} onValueChange={(value) => setNewEquipment({...newEquipment, status: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Out of Service">Out of Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="equipmentBrand">Brand/Model</Label>
                  <Input
                    id="equipmentBrand"
                    value={newEquipment.brand}
                    onChange={(e) => setNewEquipment({...newEquipment, brand: e.target.value})}
                    placeholder="John Deere, Kubota, etc"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipmentModel">Model (eg: 1023E)</Label>
                  <Input
                    id="equipmentModel"
                    value={newEquipment.model}
                    onChange={(e) => setNewEquipment({...newEquipment, model: e.target.value})}
                    placeholder="Model number"
                  />
                </div>
                <div>
                  <Label htmlFor="equipmentModelYear">Model Year</Label>
                  <Input
                    id="equipmentModelYear"
                    type="number"
                    value={newEquipment.modelYear}
                    onChange={(e) => setNewEquipment({...newEquipment, modelYear: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="equipmentIdPlate">ID/Plate Number</Label>
                  <Input
                    id="equipmentIdPlate"
                    value={newEquipment.idPlateNumber}
                    onChange={(e) => setNewEquipment({...newEquipment, idPlateNumber: e.target.value})}
                    placeholder="License or ID plate"
                  />
                </div>
                <div>
                  <Label htmlFor="equipmentSerial">Serial Number</Label>
                  <Input
                    id="equipmentSerial"
                    value={newEquipment.serialNumber}
                    onChange={(e) => setNewEquipment({...newEquipment, serialNumber: e.target.value})}
                    placeholder="Manufacturer serial"
                  />
                </div>
                <div>
                  <Label htmlFor="equipmentElectronicId">Electronic ID</Label>
                  <Input
                    id="equipmentElectronicId"
                    value={newEquipment.electronicId}
                    onChange={(e) => setNewEquipment({...newEquipment, electronicId: e.target.value})}
                    placeholder="RFID, barcode, etc"
                  />
                </div>
              </div>
            </div>

            {/* Engine/Transmission */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Engine/Transmission</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipmentEngine">Engine (eg: 2.9L 3-cyl diesel)</Label>
                  <Input
                    id="equipmentEngine"
                    value={newEquipment.engine}
                    onChange={(e) => setNewEquipment({...newEquipment, engine: e.target.value})}
                    placeholder="Engine specifications"
                  />
                </div>
                <div>
                  <Label htmlFor="equipmentTransmission">Transmission (eg: Collar shift Hi-Lo)</Label>
                  <Input
                    id="equipmentTransmission"
                    value={newEquipment.transmission}
                    onChange={(e) => setNewEquipment({...newEquipment, transmission: e.target.value})}
                    placeholder="Transmission type"
                  />
                </div>
              </div>
            </div>

            {/* Track Usage */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Track Usage (Miles/Hours)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="equipmentTrackHours">Hours</Label>
                  <Input
                    id="equipmentTrackHours"
                    type="number"
                    value={newEquipment.trackUsageHours}
                    onChange={(e) => setNewEquipment({...newEquipment, trackUsageHours: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="equipmentCurrentHours">Current (Miles/Hours)</Label>
                  <Input
                    id="equipmentCurrentHours"
                    type="number"
                    step="0.1"
                    value={newEquipment.currentHours}
                    onChange={(e) => setNewEquipment({...newEquipment, currentHours: Number(e.target.value)})}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="equipmentServiceInterval">Send Service Reminder every (Miles/Hours)</Label>
                  <Input
                    id="equipmentServiceInterval"
                    type="number"
                    value={newEquipment.serviceReminderInterval}
                    onChange={(e) => setNewEquipment({...newEquipment, serviceReminderInterval: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="equipmentEmailAlerts">Email Alerts to</Label>
                <Input
                  id="equipmentEmailAlerts"
                  type="email"
                  value={newEquipment.emailAlerts}
                  onChange={(e) => setNewEquipment({...newEquipment, emailAlerts: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Usage Cost and Manual */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipmentUsageCost">Estimated Usage Cost</Label>
                  <div className="flex gap-2">
                    <div className="flex">
                      <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l text-sm">$</span>
                      <Input
                        id="equipmentUsageCost"
                        type="number"
                        step="0.01"
                        value={newEquipment.estimatedUsageCost}
                        onChange={(e) => setNewEquipment({...newEquipment, estimatedUsageCost: Number(e.target.value)})}
                        className="rounded-l-none flex-1"
                      />
                    </div>
                    <Select value={newEquipment.usageCostUnit} onValueChange={(value) => setNewEquipment({...newEquipment, usageCostUnit: value as any})}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">per hours</SelectItem>
                        <SelectItem value="miles">per miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="equipmentServiceManual">Link to Service Manual</Label>
                  <Input
                    id="equipmentServiceManual"
                    type="url"
                    value={newEquipment.serviceManualLink}
                    onChange={(e) => setNewEquipment({...newEquipment, serviceManualLink: e.target.value})}
                    placeholder="http:// Paste link to manual here"
                  />
                </div>
              </div>
            </div>

            {/* Acquisition Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Acquisition Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="equipmentAcquisition">Leased or Purchased</Label>
                  <Select value={newEquipment.acquisitionType} onValueChange={(value) => setNewEquipment({...newEquipment, acquisitionType: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leased">Leased</SelectItem>
                      <SelectItem value="Purchased">Purchased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="equipmentDateAcquired">Date Acquired</Label>
                  <Input
                    id="equipmentDateAcquired"
                    type="date"
                    value={newEquipment.dateAcquired}
                    onChange={(e) => setNewEquipment({...newEquipment, dateAcquired: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="equipmentPurchasePrice">Purchase Price</Label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l text-sm">$</span>
                    <Input
                      id="equipmentPurchasePrice"
                      type="number"
                      step="0.01"
                      value={newEquipment.purchasePrice}
                      onChange={(e) => setNewEquipment({...newEquipment, purchasePrice: Number(e.target.value)})}
                      className="rounded-l-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance and Value */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="equipmentInsured"
                  checked={newEquipment.isInsured}
                  onChange={(e) => setNewEquipment({...newEquipment, isInsured: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="equipmentInsured" className="font-medium">
                  Equipment is Insured
                </Label>
              </div>

              <div>
                <Label htmlFor="equipmentEstimatedValue">Estimated Value</Label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l text-sm">$</span>
                  <Input
                    id="equipmentEstimatedValue"
                    type="number"
                    step="0.01"
                    value={newEquipment.estimatedValue}
                    onChange={(e) => setNewEquipment({...newEquipment, estimatedValue: Number(e.target.value)})}
                    className="rounded-l-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="equipmentDescription">Description</Label>
              <Textarea
                id="equipmentDescription"
                value={newEquipment.description}
                onChange={(e) => setNewEquipment({...newEquipment, description: e.target.value})}
                placeholder="Additional notes and description about this equipment..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddEquipmentDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => {
                const newEquipmentRecord: Equipment = {
                  id: Date.now().toString(),
                  name: newEquipment.name || "",
                  type: newEquipment.type || "",
                  status: newEquipment.status || "Active",
                  brand: newEquipment.brand || "",
                  model: newEquipment.model || "",
                  modelYear: newEquipment.modelYear || new Date().getFullYear(),
                  idPlateNumber: newEquipment.idPlateNumber || "",
                  serialNumber: newEquipment.serialNumber || "",
                  electronicId: newEquipment.electronicId || "",
                  engine: newEquipment.engine || "",
                  transmission: newEquipment.transmission || "",
                  trackUsageHours: newEquipment.trackUsageHours || 0,
                  currentHours: newEquipment.currentHours || 0.0,
                  serviceReminderInterval: newEquipment.serviceReminderInterval || 0,
                  emailAlerts: newEquipment.emailAlerts || "",
                  estimatedUsageCost: newEquipment.estimatedUsageCost || 0,
                  usageCostUnit: newEquipment.usageCostUnit || "hours",
                  serviceManualLink: newEquipment.serviceManualLink || "",
                  acquisitionType: newEquipment.acquisitionType || "Purchased",
                  dateAcquired: newEquipment.dateAcquired || format(new Date(), "yyyy-MM-dd"),
                  purchasePrice: newEquipment.purchasePrice || 0.00,
                  isInsured: newEquipment.isInsured || false,
                  estimatedValue: newEquipment.estimatedValue || 0.00,
                  description: newEquipment.description || ""
                };
                setEquipment([...equipment, newEquipmentRecord]);
                setNewEquipment({
                  name: "",
                  type: "",
                  status: "Active",
                  brand: "",
                  model: "",
                  modelYear: new Date().getFullYear(),
                  idPlateNumber: "",
                  serialNumber: "",
                  electronicId: "",
                  engine: "",
                  transmission: "",
                  trackUsageHours: 0,
                  currentHours: 0.0,
                  serviceReminderInterval: 0,
                  emailAlerts: "",
                  estimatedUsageCost: 0,
                  usageCostUnit: "hours",
                  serviceManualLink: "",
                  acquisitionType: "Purchased",
                  dateAcquired: format(new Date(), "yyyy-MM-dd"),
                  purchasePrice: 0.00,
                  isInsured: false,
                  estimatedValue: 0.00,
                  description: ""
                });
                setShowAddEquipmentDialog(false);
              }}
            >
              Add Equipment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}