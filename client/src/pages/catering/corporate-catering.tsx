import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Building,
  Clock,
  Users,
  CheckCircle,
  Star,
  Calendar,
  Shield,
  Utensils,
  Award,
  MapPin,
  Globe,
  Monitor,
  Wifi,
  Accessibility,
  Thermometer,
  ClipboardCheck,
  Target
} from "lucide-react";
const cateringLogo = "/images/totag-logo.png";
import corporateEventImage from "@assets/Event2_1752617755646.jpg";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CorporateCateringPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const serviceDeliveryModel = [
    {
      title: "In-House Catering at Client Offices",
      description: "Professional catering delivered directly to your office or facility",
      features: [
        "AM/PM tea/coffee breaks with snacks",
        "Working lunches for meetings and workshops",
        "Warm and cold meal options",
        "Vegetarian and non-pork options always available",
        "No minimum order requirements",
        "HACCP-aligned food handling throughout"
      ]
    },
    {
      title: "External Catering at Venues",
      description: "Catering services at partner venues or client-selected locations",
      features: [
        "Full-service buffet or plated meals",
        "Conference catering for 10-500 participants",
        "Multi-day event catering packages",
        "Dietary accommodation for all restrictions",
        "Temperature monitoring from kitchen to delivery",
        "Dispatch checklist and delivery handover confirmation"
      ]
    },
    {
      title: "Full Package (Catering + Venue)",
      description: "Complete event solution with venue sourcing and catering",
      features: [
        "Venue selection based on event requirements",
        "Conference rooms with AV equipment",
        "Breakout rooms for parallel sessions",
        "Full catering service included",
        "Transportation coordination available",
        "Post-event documentation and invoicing"
      ]
    }
  ];

  const venueCapabilities = [
    {
      title: "Conference Halls",
      capacity: "Up to 500 participants",
      features: ["Reliable internet", "Sound systems & PA", "Projector & screens", "Multiple seating layouts"]
    },
    {
      title: "Meeting Rooms",
      capacity: "10-50 participants",
      features: ["Video conferencing", "Whiteboard/flip charts", "Breakout capability", "Water & refreshments"]
    },
    {
      title: "Breakout Rooms",
      capacity: "10-30 per room",
      features: ["Proximate to main hall", "Well ventilated", "Minimal disruption", "Separate AV if needed"]
    }
  ];

  const seatingLayouts = [
    "Theatre style (large presentations)",
    "Classroom style (workshops/training)",
    "U-shape (interactive discussions)",
    "Round tables (group work/dining)",
    "Boardroom (executive meetings)",
    "Custom arrangements on request"
  ];

  const institutionalExperience = [
    "UN agencies (UNICEF, WFP, UNDP)",
    "International NGOs and development partners",
    "Government ministries and agencies",
    "Corporate conferences and retreats",
    "Training workshops and seminars",
    "Diplomatic events and receptions"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative bg-gray-100 shadow-sm border-b overflow-hidden min-h-[250px]">
        <div className="absolute inset-0 z-0">
          <img 
            src={corporateEventImage} 
            alt="Corporate Event Setup" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
        </div>
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/catering">
              <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Catering
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-[100px] h-[100px] flex items-center justify-center">
              <img src={cateringLogo} alt="TOTAG Catering" className="w-[100px] h-[100px] object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Institutional & Corporate Catering</h1>
              <p className="text-white/90">HACCP-aligned catering for UN agencies, INGOs, government, and corporate clients</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-green-600 text-white border-0">HACCP Aligned</Badge>
                <Badge className="bg-blue-600 text-white border-0">WHO/Codex GHP</Badge>
                <Badge className="bg-orange-600 text-white border-0">UNGM Registered</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Institutional-Grade Catering & Venue Services
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            TOTAG provides safe, dignified, and high-quality catering services for institutional clients, 
            combining HACCP-aligned food safety with professional service delivery. We support meetings, 
            workshops, conferences, and events from 10 to 500 participants with flexible menu options and 
            rapid deployment capability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                navigate('/catering');
                toast({ title: "Service Request", description: "Redirecting to service request form..." });
              }}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Request Service Quote
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/catering/food-safety')}>
              <Shield className="h-5 w-5 mr-2" />
              View Food Safety Standards
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {serviceDeliveryModel.map((model, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{model.title}</CardTitle>
                  <p className="text-sm text-gray-600">{model.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {model.features.map((feature, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Building className="h-6 w-6 text-red-600 mr-2" />
              Venue & Conference Facilities
            </CardTitle>
            <p className="text-gray-600">TOTAG provides suitable venues through managed facilities and contracted partner venues</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {venueCapabilities.map((venue, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-1">{venue.title}</h4>
                  <Badge variant="secondary" className="mb-3">{venue.capacity}</Badge>
                  <div className="space-y-2">
                    {venue.features.map((f, j) => (
                      <div key={j} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Seating Arrangements</h4>
                <div className="space-y-2">
                  {seatingLayouts.map((layout, i) => (
                    <div key={i} className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>{layout}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Standard Venue Package Includes</h4>
                <div className="space-y-2">
                  {[
                    "Reliable internet connectivity",
                    "Up-to-date sound systems and PA",
                    "Water service via dispensers/jugs",
                    "Meeting stationery (notepads, pens, flip charts)",
                    "Flower arrangements and signage on request",
                    "Fire safety and evacuation routes confirmed"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Accessibility className="h-5 w-5 text-blue-700 mr-2" />
              Accessibility & Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold mb-2">Disability Access</h4>
                <p className="text-sm text-gray-600">Venues prioritized for accessible entrances and restrooms for persons with disabilities and special needs</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold mb-2">Fire Safety</h4>
                <p className="text-sm text-gray-600">Fire safety arrangements, evacuation routes, and basic security measures confirmed for each venue</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold mb-2">Security Measures</h4>
                <p className="text-sm text-gray-600">Security details provided to clients upon request; coordination with client security teams available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 text-red-600 mr-2" />
              Response Commitments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900">Routine Requests</h4>
                <p className="text-sm text-gray-600 mt-1">Acknowledgement within 2 business hours</p>
                <p className="text-sm text-gray-600">Confirmed quotation within 24 hours</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h4 className="font-semibold text-amber-900">Short-Notice (48hrs or less)</h4>
                <p className="text-sm text-gray-600 mt-1">Acknowledgement within 1 hour</p>
                <p className="text-sm text-gray-600">Confirmation within 6-12 hours</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900">Emergency (Same-Day)</h4>
                <p className="text-sm text-gray-600 mt-1">Rapid deployment within 2-4 hours (in-house)</p>
                <p className="text-sm text-gray-600">Within 4-6 hours (external venue)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Institutional Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutionalExperience.map((exp, i) => (
              <div key={i} className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                <Globe className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{exp}</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm opacity-90">UNGM Registration No.: 1185811</p>
        </div>

        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Request Catering Services?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our Service Desk will provide a confirmed resource plan and quotation for your event. 
              We handle everything from menu planning to venue setup and post-event documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  navigate('/catering');
                  toast({ title: "Service Request", description: "Opening service request form..." });
                }}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Request Service Quote
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/catering')}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                View All Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
