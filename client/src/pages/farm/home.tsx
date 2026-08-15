import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Wind, Sun, Cloud, CloudRain } from "lucide-react";
import FarmNavbar from "@/components/farm-navbar";

export default function FarmHome() {
  const [currentWeather] = useState({
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy",
    forecast: [
      { day: "Today", high: 26, low: 18, condition: "Partly Cloudy", icon: "partly-cloudy" },
      { day: "Tomorrow", high: 28, low: 20, condition: "Sunny", icon: "sunny" },
      { day: "Wednesday", high: 23, low: 16, condition: "Rainy", icon: "rainy" },
      { day: "Thursday", high: 25, low: 19, condition: "Cloudy", icon: "cloudy" },
      { day: "Friday", high: 27, low: 21, condition: "Sunny", icon: "sunny" }
    ]
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny": return <Sun className="h-8 w-8 text-yellow-500" />;
      case "cloudy": return <Cloud className="h-8 w-8 text-gray-500" />;
      case "partly-cloudy": return <Cloud className="h-8 w-8 text-blue-400" />;
      case "rainy": return <CloudRain className="h-8 w-8 text-blue-600" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const quickStats = [
    { label: "Total Livestock", value: "247", color: "bg-green-100 text-green-800" },
    { label: "Active Crops", value: "8", color: "bg-blue-100 text-blue-800" },
    { label: "Pending Tasks", value: "12", color: "bg-orange-100 text-orange-800" },
    { label: "Equipment Available", value: "15", color: "bg-purple-100 text-purple-800" }
  ];

  const recentActivities = [
    { id: 1, activity: "Fed cattle in Sector A", time: "2 hours ago", user: "John Smith" },
    { id: 2, activity: "Harvested tomatoes from Field B", time: "4 hours ago", user: "Maria Garcia" },
    { id: 3, activity: "Maintenance on John Deere Tractor", time: "6 hours ago", user: "Mike Johnson" },
    { id: 4, activity: "Planted new corn seeds", time: "1 day ago", user: "Sarah Wilson" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <FarmNavbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 mt-0">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to TOTAG FARM
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your complete farm management solution - Track livestock, manage crops, monitor equipment, and grow your agricultural business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                View Dashboard
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Weather Dashboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-6 w-6 text-blue-600" />
              Weather Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Current Weather */}
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{currentWeather.temperature}°C</div>
                <div className="text-gray-600">{currentWeather.condition}</div>
                <div className="mt-2">
                  <Cloud className="h-12 w-12 text-blue-400 mx-auto" />
                </div>
              </div>

              {/* Weather Stats */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span>Humidity: {currentWeather.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-gray-500" />
                  <span>Wind: {currentWeather.windSpeed} km/h</span>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-3">5-Day Forecast</h4>
                <div className="grid grid-cols-5 gap-2">
                  {currentWeather.forecast.map((day, index) => (
                    <div key={index} className="text-center text-sm">
                      <div className="font-medium">{day.day}</div>
                      <div className="my-2">{getWeatherIcon(day.icon)}</div>
                      <div className="text-xs">
                        <div>{day.high}°</div>
                        <div className="text-gray-500">{day.low}°</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <Badge className={stat.color}>{stat.label}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Farm Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{activity.activity}</div>
                    <div className="text-sm text-gray-500">by {activity.user}</div>
                  </div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">View All Activities</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}