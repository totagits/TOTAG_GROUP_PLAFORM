import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FarmAbout() {
  const teamMembers = [
    {
      name: "Dr. Samuel Ochieng",
      role: "Farm Director",
      image: "👨‍⚕️",
      description: "Leading agricultural innovation with 15+ years of experience in sustainable farming practices."
    },
    {
      name: "Maria Rodriguez",
      role: "Livestock Manager", 
      image: "👩‍🌾",
      description: "Expert in cattle breeding and livestock health management."
    },
    {
      name: "James Wilson",
      role: "Crop Production Manager",
      image: "👨‍🌾", 
      description: "Specializes in organic crop cultivation and yield optimization."
    },
    {
      name: "Dr. Sarah Kim",
      role: "Veterinarian",
      image: "👩‍⚕️",
      description: "Ensures the health and wellbeing of all farm animals."
    }
  ];

  const values = [
    {
      title: "Sustainability",
      description: "We are committed to environmentally responsible farming practices that preserve our land for future generations.",
      icon: "🌱"
    },
    {
      title: "Quality",
      description: "We maintain the highest standards in all our products, from farm to market.",
      icon: "⭐"
    },
    {
      title: "Innovation",
      description: "We embrace modern technology and techniques to improve efficiency and productivity.",
      icon: "💡"
    },
    {
      title: "Community",
      description: "We support local communities and contribute to food security in our region.",
      icon: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About TOTAG FARM
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A leading agricultural enterprise committed to sustainable farming, quality production, and community development in East Africa.
          </p>
        </div>

        {/* Our Story */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-4">
                TOTAG FARM was established in 2010 as part of the TOTAG Group of Companies Ltd, with a vision to revolutionize agriculture in East Africa through modern farming techniques and sustainable practices.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                What started as a small 50-acre farm has grown into a comprehensive agricultural operation spanning over 500 acres, featuring state-of-the-art facilities for livestock management, crop production, and agricultural research.
              </p>
              <p className="text-lg text-gray-700">
                Today, we proudly serve our community by providing fresh, high-quality agricultural products while maintaining our commitment to environmental stewardship and sustainable farming practices.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Our Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🐄</div>
                <h4 className="font-semibold mb-2">Livestock Units</h4>
                <p className="text-gray-600">Modern barns housing 250+ cattle, with automated feeding and monitoring systems.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🌾</div>
                <h4 className="font-semibold mb-2">Crop Fields</h4>
                <p className="text-gray-600">300 acres of cultivated land with advanced irrigation and crop management systems.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🚜</div>
                <h4 className="font-semibold mb-2">Equipment Fleet</h4>
                <p className="text-gray-600">State-of-the-art farming equipment including tractors, harvesters, and processing machinery.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🏪</div>
                <h4 className="font-semibold mb-2">Processing Center</h4>
                <p className="text-gray-600">On-site facilities for processing and packaging farm products for market distribution.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🔬</div>
                <h4 className="font-semibold mb-2">Research Lab</h4>
                <p className="text-gray-600">Dedicated research facility for developing improved farming techniques and crop varieties.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💧</div>
                <h4 className="font-semibold mb-2">Water Management</h4>
                <p className="text-gray-600">Advanced irrigation systems and water conservation technologies throughout the farm.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}