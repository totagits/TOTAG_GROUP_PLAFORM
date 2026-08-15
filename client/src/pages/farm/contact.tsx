import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FarmNavbar from "@/components/farm-navbar";
import { Phone, Mail, MapPin, Clock, MessageCircle, Users } from "lucide-react";

export default function FarmContact() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      details: "+231-777-666-999",
      description: "Call us during business hours",
      color: "text-blue-600"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@totaggroup.com",
      description: "Send us an email anytime",
      color: "text-green-600"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Pukunu, Bo Chiefdom Tewor District, Grand Cape Mount County, Liberia",
      description: "Visit our farm facilities",
      color: "text-purple-600"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 7AM-6PM",
      description: "Saturday: 8AM-4PM",
      color: "text-orange-600"
    }
  ];

  const departments = [
    {
      name: "Farm Operations",
      manager: "John Kamau",
      phone: "+254 700 123 401",
      email: "operations@totagfarm.com",
      description: "Daily farm activities, livestock, and crop management"
    },
    {
      name: "Sales & Marketing",
      manager: "Sarah Wanjiku",
      phone: "+254 700 123 402",
      email: "sales@totagfarm.com",
      description: "Product sales, market orders, and customer relations"
    },
    {
      name: "Research & Development",
      manager: "Dr. Peter Ochieng",
      phone: "+254 700 123 403", 
      email: "research@totagfarm.com",
      description: "Agricultural research, innovation, and development"
    },
    {
      name: "Administration",
      manager: "Mary Mutuku",
      phone: "+254 700 123 404",
      email: "admin@totagfarm.com",
      description: "General inquiries, partnerships, and administration"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <FarmNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact TOTAG FARM
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team for inquiries about our products, farm visits, partnerships, or any other questions.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Icon className={`h-12 w-12 ${method.color} mx-auto mb-4`} />
                  <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="font-medium text-gray-800 mb-1">{method.details}</p>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input placeholder="Your first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input placeholder="Your last name" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input type="email" placeholder="your.email@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input type="tel" placeholder="+254 700 000 000" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">Farm Operations</SelectItem>
                    <SelectItem value="sales">Sales & Marketing</SelectItem>
                    <SelectItem value="research">Research & Development</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input placeholder="Brief subject of your message" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea 
                  placeholder="Please provide details about your inquiry..."
                  rows={5}
                />
              </div>
              
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Map and Location */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Visit Our Farm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-gray-600">Interactive Farm Map</p>
                    <p className="text-sm text-gray-500">Click to view detailed location</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Address:</strong> Pukunu, Bo Chiefdom Tewor District, Grand Cape Mount County, Liberia</p>
                  <p><strong>GPS Coordinates:</strong> 7.0465° N, 11.0748° W</p>
                  <p><strong>Nearest Town:</strong> Robertsport (25km)</p>
                  <p><strong>Accessibility:</strong> All-weather road access</p>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farm Visit Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p>Farm visits available Monday-Friday, 9AM-4PM</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p>Please book in advance for guided tours</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p>Bring identification and closed-toe shoes</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p>Photography allowed in designated areas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Department Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Department Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Manager:</strong> {dept.manager}</p>
                    <p><strong>Phone:</strong> {dept.phone}</p>
                    <p><strong>Email:</strong> {dept.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}