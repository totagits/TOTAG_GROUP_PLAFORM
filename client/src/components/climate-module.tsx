import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CloudRain, 
  Plus, 
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Eye,
  Calendar,
  TrendingUp,
  AlertTriangle,
  MapPin,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";

interface WeatherReading {
  id: string;
  date: string;
  time: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  conditions: string;
  location: string;
  source: "Manual" | "Automatic" | "Weather Station";
}

interface ClimateLog {
  id: string;
  date: string;
  type: "Observation" | "Alert" | "Forecast";
  category: "Weather" | "Soil" | "Pest" | "Disease" | "General";
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  location: string;
  actionTaken?: string;
}

interface WeatherAlert {
  id: string;
  type: "Frost" | "Drought" | "Heavy Rain" | "Wind" | "Heat Wave";
  severity: "Watch" | "Warning" | "Critical";
  startDate: string;
  endDate?: string;
  description: string;
  affectedAreas: string[];
  recommendations: string[];
}

export default function ClimateModule() {
  const [weatherReadings, setWeatherReadings] = useState<WeatherReading[]>([]);
  const [climateLogs, setClimateLogs] = useState<ClimateLog[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddReadingDialog, setShowAddReadingDialog] = useState(false);
  const [showAddLogDialog, setShowAddLogDialog] = useState(false);

  const [newReading, setNewReading] = useState<Partial<WeatherReading>>({
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    temperature: 0,
    humidity: 0,
    rainfall: 0,
    windSpeed: 0,
    windDirection: "N",
    pressure: 0,
    conditions: "Clear",
    location: "Main Field",
    source: "Manual"
  });

  const [newLog, setNewLog] = useState<Partial<ClimateLog>>({
    date: format(new Date(), "yyyy-MM-dd"),
    type: "Observation",
    category: "Weather",
    title: "",
    description: "",
    severity: "Low",
    location: "",
    actionTaken: ""
  });

  // Sample data initialization
  useEffect(() => {
    const sampleReadings: WeatherReading[] = [
      {
        id: "1",
        date: "2024-07-14",
        time: "14:00",
        temperature: 78,
        humidity: 65,
        rainfall: 0.0,
        windSpeed: 8,
        windDirection: "SW",
        pressure: 30.15,
        conditions: "Partly Cloudy",
        location: "Main Field",
        source: "Weather Station"
      },
      {
        id: "2",
        date: "2024-07-14",
        time: "08:00",
        temperature: 68,
        humidity: 82,
        rainfall: 0.25,
        windSpeed: 5,
        windDirection: "E",
        pressure: 30.22,
        conditions: "Light Rain",
        location: "Main Field",
        source: "Weather Station"
      },
      {
        id: "3",
        date: "2024-07-13",
        time: "18:00",
        temperature: 85,
        humidity: 45,
        rainfall: 0.0,
        windSpeed: 12,
        windDirection: "W",
        pressure: 30.08,
        conditions: "Clear",
        location: "Main Field",
        source: "Manual"
      }
    ];

    const sampleLogs: ClimateLog[] = [
      {
        id: "1",
        date: "2024-07-14",
        type: "Observation",
        category: "Weather",
        title: "Morning Dew Heavy",
        description: "Heavy dew formation observed across all fields. Good moisture for recently planted seeds.",
        severity: "Low",
        location: "All Fields",
        actionTaken: "None required"
      },
      {
        id: "2",
        date: "2024-07-13",
        type: "Alert",
        category: "Pest",
        title: "Aphid Activity Increasing",
        description: "Noticed increased aphid activity on tomato plants, likely due to warm, humid conditions.",
        severity: "Medium",
        location: "Greenhouse 1",
        actionTaken: "Applied organic insecticide"
      },
      {
        id: "3",
        date: "2024-07-12",
        type: "Forecast",
        category: "Weather",
        title: "Rain Expected This Week",
        description: "Weather forecast shows 60% chance of rain Tuesday-Thursday, 0.5-1 inch expected.",
        severity: "Low",
        location: "Farm Wide"
      }
    ];

    const sampleAlerts: WeatherAlert[] = [
      {
        id: "1",
        type: "Heat Wave",
        severity: "Warning",
        startDate: "2024-07-16",
        endDate: "2024-07-20",
        description: "Temperatures expected to reach 95-100°F for 4 consecutive days",
        affectedAreas: ["All Fields", "Livestock Areas"],
        recommendations: [
          "Increase watering frequency for crops",
          "Provide additional shade for livestock",
          "Monitor animals for heat stress",
          "Harvest heat-sensitive crops early morning"
        ]
      },
      {
        id: "2",
        type: "Drought",
        severity: "Watch",
        startDate: "2024-07-10",
        description: "Below normal rainfall for the past 14 days, soil moisture declining",
        affectedAreas: ["Field A", "Field B"],
        recommendations: [
          "Implement water conservation measures",
          "Check irrigation systems",
          "Monitor crop stress indicators"
        ]
      }
    ];

    setWeatherReadings(sampleReadings);
    setClimateLogs(sampleLogs);
    setWeatherAlerts(sampleAlerts);
  }, []);

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "Watch": return "bg-yellow-100 text-yellow-800";
      case "Warning": return "bg-orange-100 text-orange-800";
      case "Critical": return "bg-red-100 text-red-800";
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear": case "sunny": return <Sun className="h-4 w-4" />;
      case "partly cloudy": case "cloudy": return <CloudRain className="h-4 w-4" />;
      case "rain": case "light rain": case "heavy rain": return <CloudRain className="h-4 w-4" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  const averageTemp = weatherReadings.length > 0 
    ? weatherReadings.reduce((sum, r) => sum + r.temperature, 0) / weatherReadings.length 
    : 0;

  const totalRainfall = weatherReadings.reduce((sum, r) => sum + r.rainfall, 0);
  const activeAlerts = weatherAlerts.filter(a => !a.endDate || new Date(a.endDate) > new Date()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Climate Management</h2>
          <p className="text-gray-600">Weather monitoring and climate tracking</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddReadingDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Reading
          </Button>
          <Button onClick={() => setShowAddLogDialog(true)} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Add Log
          </Button>
        </div>
      </div>

      {/* Weather Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Temperature</p>
                <p className="text-2xl font-bold text-gray-900">{averageTemp.toFixed(1)}°F</p>
              </div>
              <Thermometer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rainfall</p>
                <p className="text-2xl font-bold text-gray-900">{totalRainfall.toFixed(2)}"</p>
              </div>
              <Droplets className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{activeAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Climate Logs</p>
                <p className="text-2xl font-bold text-gray-900">{climateLogs.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Weather Alerts */}
      {weatherAlerts.filter(a => !a.endDate || new Date(a.endDate) > new Date()).length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Active Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weatherAlerts.filter(a => !a.endDate || new Date(a.endDate) > new Date()).map((alert) => (
                <div key={alert.id} className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getAlertColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <h4 className="font-semibold">{alert.type}</h4>
                    </div>
                    <span className="text-sm text-gray-600">{alert.startDate}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                  <div className="text-xs text-gray-600">
                    <p>Affected: {alert.affectedAreas.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="weather">Weather History</TabsTrigger>
          <TabsTrigger value="logs">Climate Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Recent Weather Readings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-blue-600" />
                Recent Weather Readings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weatherReadings.slice(0, 5).map((reading) => (
                  <div key={reading.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getConditionIcon(reading.conditions)}
                      <div>
                        <p className="font-medium">{reading.conditions}</p>
                        <p className="text-sm text-gray-600">{reading.date} at {reading.time}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Temp</p>
                        <p className="font-bold">{reading.temperature}°F</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Humidity</p>
                        <p className="font-bold">{reading.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rain</p>
                        <p className="font-bold">{reading.rainfall}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Climate Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Recent Climate Observations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {climateLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getAlertColor(log.severity)}>
                          {log.severity}
                        </Badge>
                        <Badge variant="outline">{log.type}</Badge>
                        <Badge variant="outline">{log.category}</Badge>
                      </div>
                      <span className="text-sm text-gray-600">{log.date}</span>
                    </div>
                    <h4 className="font-semibold mb-1">{log.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Location: {log.location}</span>
                      {log.actionTaken && <span>Action: {log.actionTaken}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weatherReadings.map((reading) => (
              <Card key={reading.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getConditionIcon(reading.conditions)}
                      {reading.conditions}
                    </CardTitle>
                    <Badge variant="outline">{reading.source}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{reading.date} at {reading.time}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="font-medium">{reading.temperature}°F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Humidity:</span>
                      <span className="font-medium">{reading.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rainfall:</span>
                      <span className="font-medium">{reading.rainfall}"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wind:</span>
                      <span className="font-medium">{reading.windSpeed}mph {reading.windDirection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pressure:</span>
                      <span className="font-medium">{reading.pressure}"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{reading.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <div className="space-y-3">
            {climateLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getAlertColor(log.severity)}>
                        {log.severity}
                      </Badge>
                      <Badge variant="outline">{log.type}</Badge>
                      <Badge variant="outline">{log.category}</Badge>
                    </div>
                    <span className="text-sm text-gray-600">{log.date}</span>
                  </div>
                  <h4 className="font-semibold mb-2">{log.title}</h4>
                  <p className="text-gray-600 mb-3">{log.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {log.location}
                    </span>
                    {log.actionTaken && (
                      <span className="text-green-600">Action: {log.actionTaken}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {weatherAlerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h4 className="font-semibold text-lg">{alert.type}</h4>
                      <Badge className={getAlertColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {alert.startDate} {alert.endDate && `- ${alert.endDate}`}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{alert.description}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Affected Areas:</p>
                      <p className="text-sm text-gray-600">{alert.affectedAreas.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {alert.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Weather Reading Dialog */}
      <Dialog open={showAddReadingDialog} onOpenChange={setShowAddReadingDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Weather Reading</DialogTitle>
            <DialogDescription>
              Record a new weather observation for your farm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newReading.date}
                  onChange={(e) => setNewReading({...newReading, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newReading.time}
                  onChange={(e) => setNewReading({...newReading, time: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={newReading.temperature}
                  onChange={(e) => setNewReading({...newReading, temperature: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  max="100"
                  value={newReading.humidity}
                  onChange={(e) => setNewReading({...newReading, humidity: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rainfall">Rainfall (inches)</Label>
                <Input
                  id="rainfall"
                  type="number"
                  step="0.01"
                  value={newReading.rainfall}
                  onChange={(e) => setNewReading({...newReading, rainfall: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="conditions">Conditions</Label>
                <Select value={newReading.conditions} onValueChange={(value) => setNewReading({...newReading, conditions: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clear">Clear</SelectItem>
                    <SelectItem value="Partly Cloudy">Partly Cloudy</SelectItem>
                    <SelectItem value="Cloudy">Cloudy</SelectItem>
                    <SelectItem value="Light Rain">Light Rain</SelectItem>
                    <SelectItem value="Heavy Rain">Heavy Rain</SelectItem>
                    <SelectItem value="Thunderstorm">Thunderstorm</SelectItem>
                    <SelectItem value="Snow">Snow</SelectItem>
                    <SelectItem value="Fog">Fog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddReadingDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Reading
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}