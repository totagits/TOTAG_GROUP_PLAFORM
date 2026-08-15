import { useState, useEffect } from "react";
import { EVENT_TYPES, PARTICIPANT_RANGES, URGENCY_LEVELS } from "@/lib/cateringConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  ChefHat,
  Calendar,
  Users,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  CheckCircle,
  Heart,
  Building,
  Utensils,
  Wine,
  Camera,
  Gift,
  FileText,
  Sparkles,
  Shield,
  Thermometer,
  ClipboardCheck,
  Award,
  Leaf,
  AlertTriangle,
  BookOpen,
  Target,
  Zap,
  Globe,
  Truck,
  MonitorCheck
} from "lucide-react";
import cateringLogo from "@assets/Logo for TOTAG Catering1(1)_1752602584482.png";
import headerBackground from "@assets/image_1752600437126.png";
import event1 from "@assets/Event_1752617755645.jpg";
import event2 from "@assets/Event1_1752617755645.jpg";
import event3 from "@assets/Event2_1752617755646.jpg";
import event4 from "@assets/Event3_1752617755646.jpg";
import event5 from "@assets/Event4_1752617755646.jpg";
import event6 from "@assets/Event5_1752617755647.jpg";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CateringPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const headerImages = [
    headerBackground,
    event1,
    event2,
    event3,
    event4,
    event5,
    event6
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % headerImages.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [headerImages.length]);
  
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    venue: "",
    services: [] as string[],
    budget: "",
    dietaryRequirements: "",
    details: ""
  });

  const services = [
    {
      id: "institutional-catering",
      title: "Institutional & Corporate Catering",
      description: "HACCP-aligned catering for UN agencies, INGOs, government, and corporate clients",
      icon: Building,
      features: [
        "In-house catering at client offices (UNICEF, LERC, etc.)",
        "External catering at partner venues and client-selected sites",
        "AM/PM tea/coffee breaks, snacks, warm/cold lunches, dinners",
        "Vegetarian, non-pork, and customizable dietary options",
        "HACCP critical control points with temperature monitoring",
        "No minimum order requirements"
      ],
      duration: "2-12 hours",
      capacity: "10-500 participants"
    },
    {
      id: "venue-hall-rental",
      title: "Venue, Hall Rental & Conference Facilities",
      description: "Conference rooms, meeting halls, and breakout spaces for all event sizes",
      icon: MapPin,
      features: [
        "Meeting halls for 10 to 500 participants",
        "Breakout rooms for 10-30 person sub-sessions",
        "Reliable internet, sound systems, and AV equipment",
        "Theatre, classroom, U-shape, and round table layouts",
        "Accessibility for persons with disabilities",
        "Fire safety, evacuation routes, and security measures"
      ],
      duration: "Half-day to multi-day",
      capacity: "10-500 participants"
    },
    {
      id: "event-planning",
      title: "Event Planning & Logistics Management",
      description: "End-to-end event coordination with rapid deployment capability",
      icon: Calendar,
      features: [
        "On-call Service Desk with LTA Account Manager",
        "Routine requests: confirmed quotation within 24 hours",
        "Emergency requests: rapid deployment within 2-4 hours",
        "PA systems, projectors, laptops, translation support",
        "Transportation coordination for participants",
        "Post-event documentation and invoicing support"
      ],
      duration: "Planning: 24hrs to 6 months",
      capacity: "Any size event"
    },
    {
      id: "specialty-menus",
      title: "Liberian & Continental Menus",
      description: "Culturally diverse menu options meeting international dietary standards",
      icon: Utensils,
      features: [
        "Liberian: jollof rice, cassava leaf, palava sauce, potato greens",
        "Continental: grilled chicken/fish, pasta, salads, desserts",
        "Breakfast: eggs, sausages, beans, toast, fruit, cereals",
        "Reception/cocktail with finger foods and appetizers",
        "Allergen management and cross-contact prevention",
        "FIFO/FEFO storage with daily temperature checks"
      ],
      duration: "Menu dependent",
      capacity: "Flexible"
    },
    {
      id: "food-safety",
      title: "Food Safety & Quality Assurance",
      description: "HACCP-aligned food safety management with ISO 22000-style controls",
      icon: Shield,
      features: [
        "HACCP critical control points at every stage",
        "Codex Alimentarius/WHO Good Hygiene Practices (GHP)",
        "Approved supplier verification and receiving inspection",
        "Cooking/reheating temperature verification and batch logging",
        "Cleaning & sanitation schedules with pest prevention",
        "Incident response: isolation, documentation, corrective actions"
      ],
      duration: "Continuous",
      capacity: "All operations"
    },
    {
      id: "beverage-services",
      title: "Beverage Services",
      description: "Non-alcoholic and premium beverage management for all events",
      icon: Wine,
      features: [
        "Water via dispensers and jugs (no single-use plastics)",
        "Fresh juices, soft drinks, tea, and coffee service",
        "Coffee and espresso bars with skilled baristas",
        "Cocktail and reception drink packages",
        "Signature non-alcoholic specialty beverages",
        "Safe water sourcing and dispensing protocols"
      ],
      duration: "2-8 hours",
      capacity: "Any size event"
    },
    {
      id: "onsite-coordination",
      title: "On-Site Coordination & Staff Deployment",
      description: "Uniformed professional staff with UNICEF-grade service standards",
      icon: CheckCircle,
      features: [
        "Catering Lead performs pre-service checks",
        "Uniformed staff with good spoken English",
        "Food presentation, portioning, and replenishment oversight",
        "Setup, serving, and breakdown supervision",
        "Guest services and special dietary assistance",
        "Post-event feedback capture and continuous improvement"
      ],
      duration: "Full event day",
      capacity: "Any size event"
    },
    {
      id: "sustainability",
      title: "Sustainability & Greening Practices",
      description: "Eco-friendly operations aligned with UNICEF greening objectives",
      icon: Leaf,
      features: [
        "Eliminating single-use plastics across all services",
        "Water via jugs and dispensers (no plastic bottles)",
        "Reusable service ware and cutlery wherever possible",
        "Biodegradable alternatives when disposables are required",
        "Covered waste removal and responsible disposal",
        "Sustainable sourcing and local ingredient prioritization"
      ],
      duration: "All operations",
      capacity: "Company-wide"
    }
  ];

  const haccpControls = [
    {
      stage: "Receiving & Procurement",
      icon: ClipboardCheck,
      controls: [
        "Approved suppliers only; receiving inspection (freshness, expiry, seals)",
        "Reject compromised items immediately",
        "Record all inspections in Receiving Log"
      ]
    },
    {
      stage: "Storage & Segregation",
      icon: Thermometer,
      controls: [
        "FIFO/FEFO stock rotation enforced",
        "Segregate raw vs ready-to-eat items",
        "Label containers; keep storage clean, dry, pest-protected",
        "Daily temperature and condition checks logged"
      ]
    },
    {
      stage: "Preparation & Hygiene",
      icon: ChefHat,
      controls: [
        "Mandatory handwashing, hair covering, clean uniform",
        "Separate utensils/boards for raw vs ready-to-eat",
        "Sanitize between tasks; no jewelry during food handling"
      ]
    },
    {
      stage: "Cooking & Reheating (CCP)",
      icon: AlertTriangle,
      controls: [
        "Cook thoroughly; reheat rapidly to safe temperatures",
        "Verify internal temperatures appropriate to the food",
        "Record batch checks in Cooking/Batch Log"
      ]
    },
    {
      stage: "Holding & Transport",
      icon: Truck,
      controls: [
        "Hot foods kept hot; cold foods kept cold",
        "Minimize time in danger zone; discard unsafe items",
        "Food-grade packaging; covered transport",
        "Dispatch checklist and delivery handover confirmation"
      ]
    },
    {
      stage: "Cleaning & Sanitation",
      icon: Sparkles,
      controls: [
        "Clean then sanitize all food-contact surfaces",
        "Daily sanitation schedule strictly followed",
        "Covered waste removal; pest prevention actions recorded"
      ]
    }
  ];

  const keyPersonnel = [
    {
      role: "LTA Account Manager",
      responsibility: "Single point of contact for clients; planning, approvals, and reporting"
    },
    {
      role: "Operations Supervisor",
      responsibility: "Venue readiness, logistics, equipment, and on-site coordination"
    },
    {
      role: "Catering Lead / Head Chef",
      responsibility: "Menu execution, hygiene controls, food quality, and pre-service checks"
    },
    {
      role: "Food Safety & Quality Supervisor",
      responsibility: "HACCP compliance, log reviews, spot checks, corrective-action tracking"
    },
    {
      role: "Service Team Leads (Front-of-House)",
      responsibility: "Table service, replenishment, guest support, and professional presentation"
    },
    {
      role: "Logistics & Transport Coordinator",
      responsibility: "Delivery runs, venue setup, equipment, and participant transport"
    }
  ];

  const complianceRecords = [
    "Approved Supplier List",
    "Receiving Inspection Log",
    "Storage Temperature Log",
    "Cooking/Batch Temperature Log",
    "Cleaning & Sanitation Log",
    "Delivery Confirmation Log",
    "Incident/Corrective Action Log",
    "Training Register"
  ];

  const responseCommitments = [
    {
      type: "Routine Requests",
      acknowledgement: "Within 2 business hours",
      confirmation: "Confirmed resource plan and quotation within 24 hours"
    },
    {
      type: "Short-Notice (48hrs or less)",
      acknowledgement: "Within 1 hour",
      confirmation: "Confirmation within 6-12 hours (subject to venue availability)"
    },
    {
      type: "Emergency (Same-Day)",
      acknowledgement: "Immediate",
      confirmation: "Rapid deployment within 2-4 hours (in-house) / 4-6 hours (external)"
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setQuoteForm({...quoteForm, services: [serviceId]});
    setShowQuoteDialog(true);
  };

  const handleServiceToggle = (serviceId: string) => {
    const svcs = quoteForm.services.includes(serviceId)
      ? quoteForm.services.filter(s => s !== serviceId)
      : [...quoteForm.services, serviceId];
    setQuoteForm({...quoteForm, services: svcs});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative shadow-sm border-b overflow-hidden">
        <div className="slider absolute inset-0">
          {headerImages.map((image, index) => (
            <div
              key={index}
              className={`slider-item absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {headerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white scale-110 shadow-lg' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-black/50 rounded px-2 py-1">
            <span className="text-white text-sm">{currentImageIndex + 1} / {headerImages.length}</span>
          </div>
        </div>
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-8 -ml-6">
              <img 
                src={cateringLogo} 
                alt="TOTAG Catering & Event Planning" 
                className="block"
                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
              />
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-4xl font-bold text-white mb-2">
                TOTAG Catering & Events Planning Services
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                HACCP-Aligned | ISO 22000-Style Controls | Codex/WHO Good Hygiene Practices
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-green-600 text-white border-0">HACCP Certified</Badge>
                <Badge className="bg-blue-600 text-white border-0">WHO/Codex GHP</Badge>
                <Badge className="bg-purple-600 text-white border-0">ISO 22000 Controls</Badge>
                <Badge className="bg-orange-600 text-white border-0">UNGM Registered</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <div className="flex space-x-4 lg:space-x-8 overflow-x-auto">
              {[
                { id: "overview", label: "Overview" },
                { id: "services", label: "Services" },
                { id: "food-safety", label: "Food Safety" },
                { id: "menus", label: "Menus" },
                { id: "gallery", label: "Gallery" },
                { id: "contact", label: "Contact" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-tab={tab.id}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 border-gray-300 ml-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/catering/ops/login">
              <Button variant="outline" size="sm" className="bg-red-600 hover:bg-red-700 text-white border-0 ml-2">
                Staff Portal
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Institutional-Grade Catering & Event Services
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4">
                TOTAG provides safe, dignified, sustainable, and high-quality meeting and event services covering 
                in-house catering at client offices, external catering, venue arrangements, and full event logistics 
                — delivered with professional staff, dependable operations, and robust food safety controls.
              </p>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
                Our food safety system is aligned to HACCP principles, Codex/WHO Good Hygiene Practices (GHP), 
                and ISO 22000-style controls — covering procedures, competence, verification, and records.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={() => setShowQuoteDialog(true)}
                  data-quote-button
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Request Service Quote
                </Button>
                <Button variant="outline" size="lg" onClick={() => setActiveTab("food-safety")}>
                  <Shield className="h-5 w-5 mr-2" />
                  View Food Safety Standards
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-7 w-7 text-green-700" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">HACCP Aligned</h3>
                  <p className="text-sm text-gray-600">Critical control points at every stage from receiving to delivery</p>
                </CardContent>
              </Card>
              <Card className="text-center border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-7 w-7 text-blue-700" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">WHO/Codex GHP</h3>
                  <p className="text-sm text-gray-600">Codex Alimentarius and WHO Good Hygiene Practices compliance</p>
                </CardContent>
              </Card>
              <Card className="text-center border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="h-7 w-7 text-purple-700" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Rapid Deployment</h3>
                  <p className="text-sm text-gray-600">Emergency same-day service within 2-4 hours for in-house catering</p>
                </CardContent>
              </Card>
              <Card className="text-center border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-7 w-7 text-orange-700" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Sustainability</h3>
                  <p className="text-sm text-gray-600">Zero single-use plastics, reusable service ware, biodegradable alternatives</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Zap className="h-5 w-5 text-red-600 mr-2" />
                  Response Commitments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {responseCommitments.map((rc, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{rc.type}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Acknowledgement:</strong> {rc.acknowledgement}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Confirmation:</strong> {rc.confirmation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Service Capability Overview</h2>
              <p className="text-lg opacity-90 mb-8">Trusted by UN agencies, INGOs, government, and corporate clients across Liberia</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-sm opacity-90">Max Participants per Event</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">2-4 hrs</div>
                  <div className="text-sm opacity-90">Emergency Deployment</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">8</div>
                  <div className="text-sm opacity-90">HACCP Control Records</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-sm opacity-90">Service Desk Availability</div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Users className="h-5 w-5 text-red-600 mr-2" />
                  Professional Staffing Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {keyPersonnel.map((person, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{person.role}</h4>
                      <p className="text-sm text-gray-600">{person.responsibility}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  All staff complete induction before assignment and periodic refreshers. On-site service staff 
                  wear clean, consistent uniforms and communicate effectively in English. Staff members whose 
                  performance does not meet client expectations are replaced promptly.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "services" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Portfolio</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive catering, venue management, and event services aligned with international 
                best practices and institutional procurement standards.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                          <service.icon className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{service.title}</CardTitle>
                          <p className="text-gray-600 text-sm">{service.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {service.duration}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {service.capacity}
                          </div>
                        </div>
                        <div>
                          <div className="grid grid-cols-1 gap-2">
                            {service.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-6">
                        <Button 
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={() => handleServiceSelect(service.id)}
                        >
                          Get Quote
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            const routes: Record<string, string> = {
                              "institutional-catering": "/catering/corporate-catering",
                              "venue-hall-rental": "/catering/event-planning",
                              "event-planning": "/catering/event-planning",
                              "specialty-menus": "/catering/specialty-menus",
                              "food-safety": "/catering/food-safety",
                              "beverage-services": "/catering/beverage-services",
                              "onsite-coordination": "/catering/onsite-coordination",
                              "sustainability": "/catering/post-event-services",
                            };
                            const route = routes[service.id];
                            if (route) navigate(route);
                          }}
                        >
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "food-safety" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Food Safety & Hygiene Standards</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our food safety management system is aligned with HACCP principles, Codex/WHO Good Hygiene 
                Practices (GHP), and ISO 22000-style controls to ensure foods and beverages are safe, 
                hygienic, traceable, and suitable for institutional clients.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <Badge className="bg-green-600 text-white border-0 text-sm px-3 py-1">HACCP Principles</Badge>
                <Badge className="bg-blue-600 text-white border-0 text-sm px-3 py-1">Codex/WHO GHP</Badge>
                <Badge className="bg-purple-600 text-white border-0 text-sm px-3 py-1">ISO 22000-Style Controls</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {haccpControls.map((control, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <control.icon className="h-5 w-5 text-green-700" />
                        </div>
                        {control.stage}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {control.controls.map((item, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                  Staff Hygiene Policy (Food Handlers)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Mandatory Rules</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        "No food handling with vomiting, diarrhea, fever, or infected wounds",
                        "Clean uniform/apron daily; hair fully covered; nails short/clean",
                        "Handwashing before work, before ready-to-eat food, after toilet use",
                        "Change gloves between tasks or when contaminated/torn",
                        "No jewelry on hands/wrists during food handling",
                        "No smoking, gum, or eating while handling food"
                      ].map((rule, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Client-Site Professionalism</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        "Keep serving stations clean at all times",
                        "Handle waste discreetly; prompt clean-down after service",
                        "Do not enter restricted areas without authorization",
                        "Protect client property and confidentiality",
                        "Cuts/wounds covered with waterproof dressing plus gloves",
                        "Enforcement: coaching, written warning, removal for serious breaches"
                      ].map((rule, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                  Allergen & Special Diet Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Cross-Contact Prevention</h4>
                    <p className="text-sm text-gray-600">Separate preparation areas, dedicated utensils, and strict protocols to prevent allergen cross-contact</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Clear Labeling</h4>
                    <p className="text-sm text-gray-600">All allergens clearly labeled on containers and serving stations; requirements confirmed during order intake</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Dietary Diversity</h4>
                    <p className="text-sm text-gray-600">Vegetarian, non-pork, low-salt/low-sugar, and customizable options without minimum order requirements</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <FileText className="h-5 w-5 text-gray-600 mr-2" />
                  Compliance Records & Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {complianceRecords.map((record, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 text-center">
                      <FileText className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                      <span className="text-sm font-medium text-gray-700">{record}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  The Food Safety & Quality Supervisor verifies compliance via log reviews, spot checks, and 
                  corrective-action tracking. All records are retained for audit and available to clients upon request.
                </p>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Incident Response Protocol</h2>
              <p className="text-lg mb-8 opacity-90">
                If a food safety concern arises, our protocol activates immediately
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["Stop Service", "Isolate Product", "Notify Supervisor", "Document & Investigate", "Corrective Action"].map((step, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">{i+1}</div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "menus" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Menu Options</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Culturally appropriate menus featuring both Liberian and Continental cuisine, 
                with healthy options and flexible dietary accommodations.
              </p>
            </div>

            <Tabs defaultValue="liberian" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="liberian">Liberian Cuisine</TabsTrigger>
                <TabsTrigger value="continental">Continental/Global</TabsTrigger>
                <TabsTrigger value="packages">Meeting Packages</TabsTrigger>
                <TabsTrigger value="reception">Reception/Cocktail</TabsTrigger>
              </TabsList>
              <TabsContent value="liberian" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Liberian Menu Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-red-700 mb-3">Lunch & Dinner Entrees</h4>
                        <div className="space-y-2 text-sm">
                          {[
                            "Jollof Rice with grilled chicken or fish",
                            "Fried Rice with mixed vegetables and protein",
                            "Cassava Leaf with fufu or rice",
                            "Palava Sauce with traditional sides",
                            "Potato Greens with smoked fish",
                            "Grilled Fish/Chicken with mixed vegetables",
                            "Plantain with appropriate accompaniments"
                          ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <Utensils className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-3">Accompaniments & Sides</h4>
                        <div className="space-y-2 text-sm">
                          {[
                            "Fresh mixed salads with local vegetables",
                            "Seasonal tropical fruits",
                            "Fresh-squeezed juices and local beverages",
                            "Traditional sides and condiments",
                            "Non-pork options always available",
                            "Vegetarian selections included as standard"
                          ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="continental" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Continental/Global Menu Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-3">Breakfast Service</h4>
                        <div className="space-y-2 text-sm">
                          {[
                            "Eggs (scrambled or boiled) with toast",
                            "Sausages and baked beans",
                            "Fresh fruit platter and yogurt",
                            "Cereals and granola options",
                            "Tea, coffee, and fresh juices"
                          ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <Utensils className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-3">Lunch & Dinner Service</h4>
                        <div className="space-y-2 text-sm">
                          {[
                            "Grilled chicken or fish entrees",
                            "Pasta and rice-based dishes",
                            "Seasonal roasted vegetables",
                            "Fresh salads with dressings",
                            "Desserts and pastry selections"
                          ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <Utensils className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="packages" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Standard Meeting Packages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">AM/PM Tea & Coffee Break</h4>
                        <p className="text-sm text-gray-600 mb-3">Hot beverages, snacks, and light refreshments</p>
                        <div className="space-y-1 text-sm">
                          <div>- Tea, coffee, and hot chocolate</div>
                          <div>- Assorted pastries and biscuits</div>
                          <div>- Fresh fruit and juices</div>
                          <div>- Water service via dispensers</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Working Lunch Package</h4>
                        <p className="text-sm text-gray-600 mb-3">Full lunch service for meetings and workshops</p>
                        <div className="space-y-1 text-sm">
                          <div>- Choice of Liberian or Continental menu</div>
                          <div>- Warm and cold options available</div>
                          <div>- Vegetarian and non-pork included</div>
                          <div>- Beverages and dessert</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Full-Day Conference Package</h4>
                        <p className="text-sm text-gray-600 mb-3">AM break, lunch, PM break for full-day events</p>
                        <div className="space-y-1 text-sm">
                          <div>- Morning tea/coffee and snacks</div>
                          <div>- Full lunch service (hot or cold)</div>
                          <div>- Afternoon refreshments</div>
                          <div>- Stationery: notepads, pens, markers</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reception" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Reception & Cocktail Service</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-3">Food Options</h4>
                        <div className="space-y-2 text-sm">
                          {[
                            "Liberian and Continental finger foods",
                            "Hot and cold appetizers",
                            "Fresh fruit displays and platters",
                            "Multiple dessert choices",
                            "Customizable to client preferences"
                          ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <Star className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-3">Beverage Service</h4>
                        <div className="space-y-2 text-sm">
                          {[
                            "Non-alcoholic drinks: water, juices, soft drinks",
                            "Tea and coffee service",
                            "Fresh-squeezed juices",
                            "Cocktail options available on request",
                            "Water via jugs and dispensers (no plastic bottles)"
                          ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <Wine className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Leaf className="h-6 w-6 text-green-700" />
                  <h3 className="text-xl font-semibold text-green-900">Sustainability Commitment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Eliminating single-use plastics; water via jugs and dispensers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Reusable service ware and cutlery wherever possible</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Biodegradable alternatives when disposables are required</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "gallery" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Gallery</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A showcase of our institutional and corporate event services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { src: event1, title: "Conference Catering", desc: "Professional catering for workshops and conferences" },
                { src: event2, title: "Corporate Events", desc: "Full-service corporate meeting and event support" },
                { src: event3, title: "Venue Setup", desc: "Conference room setup with AV and catering" },
                { src: event4, title: "Institutional Service", desc: "Catering for UN agencies and INGO partners" },
                { src: event5, title: "Reception Service", desc: "Professional cocktail and reception events" },
                { src: event6, title: "Outdoor Events", desc: "Catering for outdoor events and field operations" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img src={item.src} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "contact" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ready to plan your next event? Contact our Service Desk for a personalized consultation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-red-600" />
                      <span>+231-777-511-391 / +231-777-666-999</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-red-600" />
                      <span>toceps@totaggroup.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-red-600" />
                      <span>www.totaggroup.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <span>Guest House Road, Thinker's Village Community, Paynesville, Montserrado, Liberia</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-red-600" />
                      <span>Mon-Fri: 8:00 AM - 6:00 PM | Emergency: 24/7</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-red-600" />
                      <span>UNGM No.: 1185811</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-900">Why Choose TOTAG Catering?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        "HACCP-aligned food safety with full audit trail",
                        "Codex/WHO Good Hygiene Practices (GHP) compliant",
                        "Emergency deployment within 2-4 hours",
                        "Institutional experience (UN, INGO, Government)",
                        "Zero single-use plastics — sustainability commitment",
                        "Professional uniformed staff with English fluency",
                        "Venues for 10-500 participants with AV support",
                        "No minimum order requirements"
                      ].map((item, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Button 
                  size="lg" 
                  className="w-full bg-red-600 hover:bg-red-700 mb-6"
                  data-quote-button="true"
                  onClick={() => setShowQuoteDialog(true)}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Request Service Quote
                </Button>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Service Request Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: "Event date, time, and duration", icon: Calendar },
                        { label: "Expected participant count", icon: Users },
                        { label: "Venue requirements (in-house or external)", icon: MapPin },
                        { label: "Catering type (Liberian, Continental, or mixed)", icon: Utensils },
                        { label: "Dietary restrictions (vegetarian, non-pork, allergies)", icon: AlertTriangle },
                        { label: "AV and equipment needs", icon: MonitorCheck },
                        { label: "Seating arrangement preference", icon: Building },
                        { label: "Transportation requirements", icon: Truck },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <item.icon className="h-4 w-4 text-red-600" />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ChefHat className="h-5 w-5 mr-2 text-red-600" />
              Service Quote Request
            </DialogTitle>
            <DialogDescription>
              Provide your event details and our Service Desk will respond with a confirmed resource plan 
              and quotation within 24 hours for routine requests, or within 6-12 hours for short-notice requests.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quote-name">Full Name *</Label>
                <Input
                  id="quote-name"
                  value={quoteForm.name}
                  onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="quote-email">Email Address *</Label>
                <Input
                  id="quote-email"
                  type="email"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                  placeholder="email@organization.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quote-phone">Phone Number *</Label>
                <Input
                  id="quote-phone"
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                  placeholder="+231-XXX-XXX-XXX"
                />
              </div>
              <div>
                <Label htmlFor="quote-company">Organization</Label>
                <Input
                  id="quote-company"
                  value={quoteForm.company}
                  onChange={(e) => setQuoteForm({...quoteForm, company: e.target.value})}
                  placeholder="Your Organization Name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quote-event-type">Event Type *</Label>
                <Select value={quoteForm.eventType} onValueChange={(value) => setQuoteForm({...quoteForm, eventType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map(et => <SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quote-event-date">Event Date *</Label>
                <Input
                  id="quote-event-date"
                  type="date"
                  value={quoteForm.eventDate}
                  onChange={(e) => setQuoteForm({...quoteForm, eventDate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quote-guest-count">Expected Participants *</Label>
                <Select value={quoteForm.guestCount} onValueChange={(value) => setQuoteForm({...quoteForm, guestCount: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select participant count" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTICIPANT_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quote-budget">Urgency</Label>
                <Select value={quoteForm.budget} onValueChange={(value) => setQuoteForm({...quoteForm, budget: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCY_LEVELS.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="quote-venue">Venue Location</Label>
              <Input
                id="quote-venue"
                value={quoteForm.venue}
                onChange={(e) => setQuoteForm({...quoteForm, venue: e.target.value})}
                placeholder="Event venue address or 'Need venue recommendation'"
              />
            </div>
            <div>
              <Label>Services Needed</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={service.id}
                      checked={quoteForm.services.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={service.id} className="text-sm">{service.title}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="quote-dietary">Dietary Requirements</Label>
              <Input
                id="quote-dietary"
                value={quoteForm.dietaryRequirements}
                onChange={(e) => setQuoteForm({...quoteForm, dietaryRequirements: e.target.value})}
                placeholder="Vegetarian, non-pork, allergies, low-salt, etc."
              />
            </div>
            <div>
              <Label htmlFor="quote-details">Additional Details</Label>
              <Textarea
                id="quote-details"
                value={quoteForm.details}
                onChange={(e) => setQuoteForm({...quoteForm, details: e.target.value})}
                placeholder="AV requirements, seating arrangement, transportation needs, breakout rooms, etc."
                rows={4}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowQuoteDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={(e) => {
                  e.preventDefault();
                  if (!quoteForm.name || !quoteForm.email || !quoteForm.phone || !quoteForm.eventType || !quoteForm.eventDate || !quoteForm.guestCount) {
                    toast({
                      title: "Missing Information",
                      description: "Please fill in all required fields marked with *",
                      variant: "destructive",
                    });
                    return;
                  }
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(quoteForm.email)) {
                    toast({
                      title: "Invalid Email",
                      description: "Please enter a valid email address.",
                      variant: "destructive",
                    });
                    return;
                  }
                  fetch("/api/catering/requests", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: quoteForm.name,
                      email: quoteForm.email,
                      phone: quoteForm.phone,
                      company: quoteForm.company,
                      eventType: quoteForm.eventType,
                      eventDate: quoteForm.eventDate,
                      guestCount: quoteForm.guestCount ? parseInt(quoteForm.guestCount) : null,
                      venue: quoteForm.venue,
                      services: quoteForm.services,
                      budget: quoteForm.budget,
                      dietaryRequirements: quoteForm.dietaryRequirements,
                      details: quoteForm.details,
                    }),
                  }).then(r => r.json()).then(data => {
                    if (data.success) {
                      toast({
                        title: "Service Request Submitted!",
                        description: "Our Service Desk will respond with a confirmed resource plan and quotation within 24 hours.",
                      });
                    } else {
                      toast({ title: "Submitted", description: "Your request has been received." });
                    }
                  }).catch(() => {
                    toast({ title: "Submitted", description: "Your request has been received." });
                  });
                  setQuoteForm({
                    name: "", email: "", phone: "", company: "", eventType: "",
                    eventDate: "", guestCount: "", venue: "", services: [],
                    budget: "", dietaryRequirements: "", details: ""
                  });
                  setShowQuoteDialog(false);
                }}
              >
                Submit Service Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
