import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Settings,
  CheckCircle,
  Star,
  Clock,
  Users,
  Monitor,
  Wifi,
  Truck,
  ClipboardCheck,
  Target,
  FileText,
  Phone,
  Zap,
  Building
} from "lucide-react";
import cateringLogo from "@assets/Logo for TOTAG Catering1(1)_1752602584482.png";
import eventPlanningBg from "@assets/Event3_1752617755646.jpg";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function EventPlanningPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const serviceDeliveryModel = [
    {
      title: "On-Call Service Desk",
      description: "Centralized request management and coordination",
      icon: Phone,
      features: [
        "LTA Account Manager as single point of contact",
        "Requests logged, acknowledged, costed, and resourced",
        "Standardized checklists and service packs",
        "Unique service file for each event",
        "Post-event documentation for invoicing"
      ]
    },
    {
      title: "Venue Sourcing & Management",
      description: "Conference facilities from 10 to 500 participants",
      icon: MapPin,
      features: [
        "TOTAG-managed facilities and partner venue network",
        "Meeting halls, breakout rooms, and sub-rooms",
        "Theatre, classroom, U-shape, and round table layouts",
        "Reliable internet and modern AV equipment",
        "Accessibility for persons with disabilities"
      ]
    },
    {
      title: "Equipment & Technical Support",
      description: "Professional AV and conference equipment provisioning",
      icon: Monitor,
      features: [
        "PA systems and microphones",
        "Projectors, screens, and laptops",
        "Extension power and backup lighting",
        "Translation support when required",
        "Professional technical support on-site"
      ]
    },
    {
      title: "Logistics & Transportation",
      description: "Complete logistics coordination for events",
      icon: Truck,
      features: [
        "Transportation coordination for participants",
        "Equipment delivery and setup",
        "Pre-arranged access to event equipment",
        "Setup plan and staff roster per event",
        "Signage, room branding, and flower arrangements"
      ]
    }
  ];

  const responseTimeline = [
    {
      type: "Routine Requests",
      color: "bg-green-600",
      acknowledgement: "Within 2 business hours",
      confirmation: "Confirmed resource plan and quotation within 24 hours"
    },
    {
      type: "Short-Notice (48hrs or less)",
      color: "bg-amber-600",
      acknowledgement: "Within 1 hour",
      confirmation: "Confirmation within 6-12 hours (subject to venue availability)"
    },
    {
      type: "Emergency (Same-Day)",
      color: "bg-red-600",
      acknowledgement: "Immediate",
      confirmation: "In-house: 2-4 hours | External: 4-6 hours"
    }
  ];

  const planningProcess = [
    {
      step: 1,
      title: "Request & Acknowledgement",
      description: "Service Desk receives, logs, and acknowledges client request"
    },
    {
      step: 2,
      title: "Resource Planning & Quotation",
      description: "Event costed, resourced, and confirmed with approved quotation"
    },
    {
      step: 3,
      title: "Event File & Coordination",
      description: "Setup plan, catering plan, staff roster, and logistics coordinated"
    },
    {
      step: 4,
      title: "Execution & Documentation",
      description: "Professional execution with post-event reports and invoicing support"
    }
  ];

  const eventDocumentation = [
    "Approved quote and service agreement",
    "Setup plan with layout diagrams",
    "Catering plan with menu and dietary details",
    "Staff roster and assignments",
    "Signed attendance sheets",
    "Signed activity reports",
    "Post-event feedback summary",
    "Invoice with supporting evidence"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header 
        className="relative bg-cover bg-center bg-no-repeat shadow-sm border-b"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${eventPlanningBg})`,
          minHeight: '220px'
        }}
      >
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <Link href="/catering">
              <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Catering
              </Button>
            </Link>
          </div>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 -ml-6">
              <img src={cateringLogo} alt="TOTAG Catering & Event Planning" className="w-[100px] h-[100px] object-contain" />
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-4xl font-bold text-white mb-2">Event Planning & Logistics</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                End-to-end event coordination with rapid deployment capability and institutional-grade documentation
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-green-600 text-white border-0">On-Call Service Desk</Badge>
                <Badge className="bg-blue-600 text-white border-0">Rapid Deployment</Badge>
                <Badge className="bg-purple-600 text-white border-0">Full Documentation</Badge>
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
            Professional Event Management
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            TOTAG operates an on-call Service Desk led by an LTA Account Manager, supported by an 
            Operations Supervisor, Catering Lead, and logistics staff. Each event receives a unique 
            service file with approved quote, setup plan, catering plan, staff roster, and complete 
            post-event documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                navigate('/catering');
                toast({ title: "Event Planning Request", description: "Redirecting to service request form..." });
              }}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Request Event Services
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {serviceDeliveryModel.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <service.icon className="h-5 w-5 text-red-600" />
                    </div>
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
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

        <Card className="mb-16 border-red-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Zap className="h-6 w-6 text-red-600 mr-2" />
              Response Commitments
            </CardTitle>
            <p className="text-gray-600">Lead time and response standards for event requests</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {responseTimeline.map((rt, idx) => (
                <div key={idx} className={`rounded-lg p-5 text-white ${rt.color}`}>
                  <h4 className="font-semibold text-lg mb-3">{rt.type}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span><strong>Acknowledgement:</strong> {rt.acknowledgement}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span><strong>Confirmation:</strong> {rt.confirmation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Delivery Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A systematic approach to ensure every event is planned, executed, and documented professionally
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {planningProcess.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {phase.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{phase.title}</h3>
                <p className="text-gray-600 text-sm">{phase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <FileText className="h-5 w-5 text-gray-600 mr-2" />
              Event Documentation Package
            </CardTitle>
            <p className="text-gray-600">Each event produces a complete service file for accountability and invoicing</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {eventDocumentation.map((doc, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                  <ClipboardCheck className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{doc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Resourcing & Readiness</h2>
          <p className="text-lg opacity-90 mb-8">
            TOTAG maintains standby resources for rapid deployment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <Users className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Trained Staff Roster</h3>
              <p className="text-sm opacity-90">Pre-vetted service staff with minimum 2 years' relevant experience, available on-call</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <Monitor className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Pre-Arranged Equipment</h3>
              <p className="text-sm opacity-90">PA systems, microphones, projectors, screens, extension power, and backup lighting</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <Building className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Curated Venue Network</h3>
              <p className="text-sm opacity-90">Partner venues in Monrovia and surrounding areas with pre-approved access agreements</p>
            </div>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Plan Your Event?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Contact our Service Desk to discuss your event requirements. We'll provide a complete 
              resource plan and quotation, handling everything from venue sourcing to post-event documentation.
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
                Request Event Services
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
