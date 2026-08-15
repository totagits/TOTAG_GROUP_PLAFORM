import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FarmNavbar from "@/components/farm-navbar";
import { Play, Download, Calendar, Eye } from "lucide-react";

export default function FarmMedia() {
  const mediaItems = [
    {
      id: 1,
      title: "Farm Tour - Spring 2024",
      type: "video",
      thumbnail: "🎥",
      duration: "12:45",
      date: "March 2024",
      description: "Take a virtual tour of our facilities during spring planting season.",
      views: 1250
    },
    {
      id: 2,
      title: "Cattle Feeding Process",
      type: "video", 
      thumbnail: "🐄",
      duration: "8:30",
      date: "February 2024",
      description: "Learn about our systematic approach to cattle nutrition and feeding.",
      views: 890
    },
    {
      id: 3,
      title: "Organic Farming Practices",
      type: "video",
      thumbnail: "🌱",
      duration: "15:20",
      date: "January 2024", 
      description: "Discover our organic farming methods and sustainable practices.",
      views: 1560
    },
    {
      id: 4,
      title: "Harvest Season 2023",
      type: "photo",
      thumbnail: "📸",
      count: "25 photos",
      date: "November 2023",
      description: "Photo gallery from our successful 2023 harvest season.",
      views: 720
    },
    {
      id: 5,
      title: "Farm Equipment Showcase",
      type: "video",
      thumbnail: "🚜",
      duration: "10:15",
      date: "October 2023",
      description: "Overview of our modern farming equipment and technology.",
      views: 950
    },
    {
      id: 6,
      title: "Community Outreach Event",
      type: "photo",
      thumbnail: "🤝",
      count: "18 photos",
      date: "September 2023",
      description: "Photos from our community education and outreach programs.",
      views: 650
    }
  ];

  const getMediaIcon = (type: string) => {
    return type === "video" ? <Play className="h-4 w-4" /> : <Eye className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    return type === "video" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <FarmNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Farm Media Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our farm through videos and photos showcasing our operations, facilities, and community involvement.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
              <div className="text-gray-600">Videos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">120+</div>
              <div className="text-gray-600">Photos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">8.5K</div>
              <div className="text-gray-600">Total Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
              <div className="text-gray-600">Months Active</div>
            </CardContent>
          </Card>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                  <div className="text-6xl">{item.thumbnail}</div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-t-lg flex items-center justify-center">
                    <Button 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {getMediaIcon(item.type)}
                      <span className="ml-2">{item.type === "video" ? "Play" : "View"}</span>
                    </Button>
                  </div>
                  
                  {/* Duration/Count Badge */}
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-black bg-opacity-75 text-white">
                      {item.duration || item.count}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getTypeColor(item.type)}>
                      {item.type === "video" ? "Video" : "Photos"}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.date}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="h-3 w-3 mr-1" />
                      {item.views} views
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Video Section */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Featured: TOTAG FARM Documentary
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Watch our comprehensive documentary showcasing the journey of TOTAG FARM from a small operation to a leading agricultural enterprise in East Africa.
                </p>
                <div className="flex justify-center gap-4">
                  <Button size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Now
                  </Button>
                  <Button variant="outline" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Duration: 45:30 • Released: June 2024 • 4.2K views
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}