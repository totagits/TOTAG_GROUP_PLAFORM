import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users, Target } from "lucide-react";

export default function FarmProjects() {
  const activeProjects = [
    {
      id: 1,
      title: "Organic Vegetable Expansion",
      description: "Expanding organic vegetable production to 50 acres with new greenhouse facilities and sustainable farming practices.",
      status: "In Progress",
      progress: 75,
      startDate: "Jan 2024",
      endDate: "Dec 2024",
      budget: "$150,000",
      team: "6 members",
      location: "North Field Complex",
      category: "Crop Production"
    },
    {
      id: 2,
      title: "Cattle Breeding Program",
      description: "Developing a premium cattle breeding program focusing on Holstein and Angus breeds for improved milk and meat production.",
      status: "In Progress", 
      progress: 60,
      startDate: "Mar 2024",
      endDate: "Mar 2026",
      budget: "$280,000",
      team: "4 members",
      location: "Livestock Complex A",
      category: "Livestock"
    },
    {
      id: 3,
      title: "Smart Irrigation System",
      description: "Installing IoT-based smart irrigation system across all crop fields for optimal water usage and crop monitoring.",
      status: "Planning",
      progress: 25,
      startDate: "Aug 2024",
      endDate: "Nov 2024", 
      budget: "$95,000",
      team: "3 members",
      location: "All Crop Fields",
      category: "Technology"
    }
  ];

  const completedProjects = [
    {
      id: 4,
      title: "Solar Power Installation",
      description: "Installed 200kW solar power system to provide renewable energy for farm operations.",
      completedDate: "Jun 2024",
      budget: "$120,000",
      impact: "60% reduction in energy costs",
      category: "Infrastructure"
    },
    {
      id: 5,
      title: "Equipment Modernization",
      description: "Upgraded farm equipment fleet with modern tractors and harvesting machinery.",
      completedDate: "Apr 2024",
      budget: "$350,000",
      impact: "40% increase in operational efficiency",
      category: "Equipment"
    },
    {
      id: 6,
      title: "Water Conservation Initiative",
      description: "Implemented rainwater harvesting and drip irrigation systems across the farm.",
      completedDate: "Feb 2024",
      budget: "$75,000",
      impact: "35% reduction in water usage",
      category: "Sustainability"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Planning": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Crop Production": return "bg-green-100 text-green-800";
      case "Livestock": return "bg-blue-100 text-blue-800";
      case "Technology": return "bg-purple-100 text-purple-800";
      case "Infrastructure": return "bg-orange-100 text-orange-800";
      case "Equipment": return "bg-red-100 text-red-800";
      case "Sustainability": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Farm Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our ongoing and completed projects that drive innovation and sustainability in our farming operations.
          </p>
        </div>

        {/* Active Projects */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Active Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                      <div className="flex gap-2 mb-3">
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        <Badge className={getCategoryColor(project.category)}>{project.category}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{project.startDate} - {project.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span>Budget: {project.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Team: {project.team}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Projects */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Completed Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    <Badge className={getCategoryColor(project.category)}>{project.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Completed:</span>
                      <span className="font-medium">{project.completedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Budget:</span>
                      <span className="font-medium">{project.budget}</span>
                    </div>
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Impact: </span>
                      <span className="text-sm text-green-700">{project.impact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-gray-600">Active Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">6</div>
              <div className="text-gray-600">Completed Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">$1.2M</div>
              <div className="text-gray-600">Total Investment</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}