import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  Code2, 
  Smartphone, 
  Database, 
  Globe,
  ArrowLeft,
  Check,
  Star,
  Users,
  Zap,
  Shield,
  Calendar,
  Calculator
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CustomSoftwarePage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const [showEstimateDialog, setShowEstimateDialog] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState<string | null>(null);
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    preferredDate: "",
    timeSlot: "",
    projectType: "",
    message: ""
  });
  const [estimateForm, setEstimateForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    timeline: "",
    budget: "",
    features: "",
    description: ""
  });

  const services = [
    {
      title: "Web Application Development",
      description: "Modern, responsive web applications built with cutting-edge technologies",
      icon: Globe,
      features: ["React/Vue.js/Angular", "Node.js/Python backends", "Cloud deployment", "Progressive Web Apps"]
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android",
      icon: Smartphone,
      features: ["iOS (Swift)", "Android (Kotlin)", "React Native", "Flutter"]
    },
    {
      title: "Enterprise Integration",
      description: "Connect and modernize your existing systems and workflows",
      icon: Database,
      features: ["API development", "Legacy system integration", "Data migration", "Microservices architecture"]
    }
  ];

  const technologies = [
    { name: "React", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "Python", category: "Backend" },
    { name: "TypeScript", category: "Language" },
    { name: "PostgreSQL", category: "Database" },
    { name: "MongoDB", category: "Database" },
    { name: "AWS", category: "Cloud" },
    { name: "Docker", category: "DevOps" }
  ];

  const projects = [
    {
      id: "enterprise-erp",
      title: "Manufacturing ERP System",
      client: "TechManufacturing Ltd",
      description: "Complete ERP solution for manufacturing operations and supply chain management",
      duration: "12 months",
      team: "15 developers",
      detailedDescription: "Developed a comprehensive Enterprise Resource Planning system for a mid-size manufacturing company. Integrated modules include production planning, inventory management, procurement, quality control, financial accounting, and supply chain optimization. The system handles multi-location operations with real-time data synchronization.",
      technologies: ["Angular", "Spring Boot", "Oracle DB", "Apache Kafka", "Redis", "Microservices", "Docker"],
      features: ["Production planning", "Inventory tracking", "Quality management", "Financial reporting", "Supply chain optimization", "Multi-location support"],
      results: "35% reduction in production costs, 50% improvement in inventory turnover, 90% faster financial reporting"
    },
    {
      id: "crm-enterprise",
      title: "Enterprise CRM Platform",
      client: "GlobalSales Corp",
      description: "Advanced CRM system with AI-powered sales analytics and automation",
      duration: "8 months",
      team: "12 developers",
      detailedDescription: "Built a sophisticated Customer Relationship Management platform with AI-powered lead scoring, automated sales workflows, and comprehensive analytics. Features include contact management, opportunity tracking, email marketing automation, customer service integration, and predictive analytics for sales forecasting.",
      technologies: ["React", "Node.js", "PostgreSQL", "TensorFlow", "Elasticsearch", "AWS Lambda", "GraphQL"],
      features: ["AI lead scoring", "Sales automation", "Email campaigns", "Customer analytics", "Mobile CRM", "Integration APIs"],
      results: "65% increase in lead conversion, 40% reduction in sales cycle time, 80% improvement in customer retention"
    },
    {
      id: "hrmis-system",
      title: "Human Resource Management System",
      client: "Enterprise Solutions Inc",
      description: "Comprehensive HRMIS with payroll, performance management, and employee self-service",
      duration: "10 months",
      team: "10 developers",
      detailedDescription: "Developed a complete Human Resource Management Information System covering the entire employee lifecycle. Includes recruitment management, onboarding, payroll processing, performance evaluations, leave management, training modules, and compliance reporting. Features employee self-service portal and manager dashboards.",
      technologies: ["Vue.js", "Laravel", "MySQL", "Redis", "Elasticsearch", "PDF Generation", "SSO Integration"],
      features: ["Recruitment portal", "Payroll automation", "Performance tracking", "Leave management", "Training modules", "Compliance reporting"],
      results: "70% reduction in HR processing time, 85% employee satisfaction with self-service, 100% payroll accuracy"
    },
    {
      id: "ecommerce-platform",
      title: "E-commerce Platform",
      client: "Retail Corp",
      description: "Full-stack e-commerce solution with inventory management",
      duration: "6 months",
      team: "8 developers",
      detailedDescription: "Built a comprehensive e-commerce platform from scratch with modern React frontend and Node.js backend. Integrated with Stripe for payments, implemented real-time inventory tracking, and developed a custom admin dashboard for order management.",
      technologies: ["React", "Node.js", "PostgreSQL", "Redis", "Stripe API", "AWS S3"],
      features: ["Real-time inventory", "Multi-payment gateway", "Admin dashboard", "Order tracking", "Mobile responsive"],
      results: "40% increase in online sales, 25% reduction in cart abandonment"
    },
    {
      id: "healthcare-system",
      title: "Healthcare Management System",
      client: "Medical Center",
      description: "Patient management and scheduling system",
      duration: "4 months", 
      team: "6 developers",
      detailedDescription: "Developed a comprehensive healthcare management system to streamline patient appointments, medical records, and billing processes. Features include patient portal, doctor scheduling, prescription management, and integrated billing system.",
      technologies: ["Vue.js", "Express.js", "MySQL", "Chart.js", "Socket.io"],
      features: ["Patient portal", "Appointment scheduling", "Medical records", "Billing integration", "Real-time notifications"],
      results: "60% reduction in scheduling conflicts, 45% improvement in patient satisfaction"
    },
    {
      id: "financial-dashboard",
      title: "Financial Dashboard",
      client: "FinTech Startup",
      description: "Real-time analytics and reporting platform",
      duration: "3 months",
      team: "5 developers",
      detailedDescription: "Created a real-time financial analytics dashboard with advanced charting capabilities, customizable reports, and automated alerts. The platform processes millions of transactions daily and provides actionable insights for investment decisions.",
      technologies: ["React", "D3.js", "Node.js", "MongoDB", "WebSocket", "Redis"],
      features: ["Real-time charts", "Custom reports", "Automated alerts", "Data export", "Multi-currency support"],
      results: "90% faster report generation, 70% improvement in decision-making speed"
    }
  ];

  // Budget-based recommendation system
  const getBudgetRecommendation = (budget: string, projectType: string, timeline: string) => {
    const recommendations = {
      "under-25k": {
        suitable: ["web-app", "mobile-app"],
        features: ["Basic functionality", "Standard UI/UX", "Essential integrations", "Basic security"],
        examples: ["Simple business website", "Basic mobile app", "Small e-commerce site", "Portfolio website"],
        limitations: ["Limited custom features", "Basic scalability", "Standard third-party integrations"],
        timeline: "1-3 months typically optimal"
      },
      "25k-50k": {
        suitable: ["web-app", "mobile-app", "ecommerce", "crm"],
        features: ["Advanced functionality", "Custom UI/UX", "Multiple integrations", "Enhanced security", "Basic analytics"],
        examples: ["Advanced web application", "Feature-rich mobile app", "Small CRM system", "E-commerce platform"],
        limitations: ["Moderate scalability", "Limited enterprise features"],
        timeline: "3-6 months recommended"
      },
      "50k-100k": {
        suitable: ["web-app", "mobile-app", "ecommerce", "crm", "integration"],
        features: ["Complex functionality", "Premium UI/UX", "Advanced integrations", "High security", "Advanced analytics", "Multi-platform support"],
        examples: ["Complex web platform", "Multi-platform mobile app", "Advanced CRM", "Enterprise e-commerce"],
        limitations: ["Some enterprise limitations", "Moderate concurrent users"],
        timeline: "6-12 months optimal"
      },
      "100k-250k": {
        suitable: ["crm", "erp", "hrmis", "enterprise", "integration", "ecommerce"],
        features: ["Enterprise functionality", "Custom architecture", "Advanced integrations", "Enterprise security", "Comprehensive analytics", "High scalability"],
        examples: ["Enterprise CRM", "Manufacturing ERP", "Advanced HRMIS", "Large e-commerce platform"],
        limitations: ["May require phased implementation"],
        timeline: "6-12+ months recommended"
      },
      "250k+": {
        suitable: ["erp", "hrmis", "enterprise", "integration"],
        features: ["Full enterprise suite", "Custom architecture", "Complex integrations", "Enterprise-grade security", "Advanced analytics", "Unlimited scalability", "Multi-location support"],
        examples: ["Complete ERP system", "Enterprise HRMIS", "Complex integration platform", "Multi-system architecture"],
        limitations: ["None - full enterprise capability"],
        timeline: "12+ months typical"
      }
    };

    const budgetData = recommendations[budget as keyof typeof recommendations];
    if (!budgetData) return null;

    const isProjectSuitable = budgetData.suitable.includes(projectType);
    const timelineMatch = timeline && budgetData.timeline.includes(timeline);

    return {
      ...budgetData,
      isProjectSuitable,
      timelineMatch,
      recommendation: isProjectSuitable ? "Excellent fit" : "Consider alternative",
      budgetRange: budget
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/it-services">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Code2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Custom Software Development</h1>
                <p className="text-gray-600">Tailored solutions for your unique business needs</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "services", label: "Services" },
              { id: "technologies", label: "Technologies" },
              { id: "projects", label: "Case Studies" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Why Choose Custom Software?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      Off-the-shelf software often falls short of meeting specific business requirements. 
                      Our custom software development services ensure that your solution is perfectly 
                      aligned with your workflows, goals, and growth plans.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: Zap, title: "Performance", desc: "Optimized for your specific use case" },
                        { icon: Shield, title: "Security", desc: "Built with your security requirements" },
                        { icon: Users, title: "Scalability", desc: "Grows with your business" },
                        { icon: Star, title: "Integration", desc: "Seamlessly connects with existing systems" }
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <benefit.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                            <p className="text-sm text-gray-600">{benefit.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Facts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects Delivered</span>
                      <span className="font-semibold">150+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client Satisfaction</span>
                      <span className="font-semibold">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Timeline</span>
                      <span className="font-semibold">3-6 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Size</span>
                      <span className="font-semibold">4-12 developers</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Development Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        "Requirements Analysis",
                        "System Design",
                        "Development & Testing",
                        "Deployment & Training",
                        "Ongoing Support"
                      ].map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Technologies Tab */}
        {activeTab === "technologies" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Technology Stack</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We use modern, proven technologies to build scalable and maintainable software solutions.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(
                technologies.reduce((acc, tech) => {
                  if (!acc[tech.category]) acc[tech.category] = [];
                  acc[tech.category].push(tech.name);
                  return acc;
                }, {} as Record<string, string[]>)
              ).map(([category, techs]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {techs.map((tech) => (
                        <Badge key={tech} variant="outline" className="mr-2 mb-2">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Projects</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See how we've helped businesses transform their operations with custom software solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{project.client}</Badge>
                      <span className="text-sm text-gray-500">{project.duration}</span>
                    </div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Team: {project.team}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowProjectDetails(project.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Project Details Modal */}
        {showProjectDetails && (
          <Dialog open={!!showProjectDetails} onOpenChange={() => setShowProjectDetails(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {projects.find(p => p.id === showProjectDetails)?.title}
                </DialogTitle>
                <DialogDescription>
                  Client: {projects.find(p => p.id === showProjectDetails)?.client}
                </DialogDescription>
              </DialogHeader>
              {(() => {
                const project = projects.find(p => p.id === showProjectDetails);
                if (!project) return null;
                
                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-900">Duration</div>
                        <div className="text-blue-600">{project.duration}</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="font-semibold text-green-900">Team Size</div>
                        <div className="text-green-600">{project.team}</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-purple-900">Client</div>
                        <div className="text-purple-600">{project.client}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Project Overview</h3>
                      <p className="text-gray-600 leading-relaxed">{project.detailedDescription}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="bg-gray-50">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {project.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-green-900">Results</h3>
                      <p className="text-green-700">{project.results}</p>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowProjectDetails(null)}
                        className="flex-1"
                      >
                        Close
                      </Button>
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          setShowProjectDetails(null);
                          setShowConsultationDialog(true);
                        }}
                      >
                        Start Similar Project
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </DialogContent>
          </Dialog>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Let's discuss your custom software requirements and build something amazing together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={showConsultationDialog} onOpenChange={setShowConsultationDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule a Consultation</DialogTitle>
                      <DialogDescription>
                        Fill out this form to schedule a consultation with our team.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={consultationForm.name}
                            onChange={(e) => setConsultationForm({...consultationForm, name: e.target.value})}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={consultationForm.email}
                            onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                            placeholder="john@company.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={consultationForm.company}
                            onChange={(e) => setConsultationForm({...consultationForm, company: e.target.value})}
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={consultationForm.phone}
                            onChange={(e) => setConsultationForm({...consultationForm, phone: e.target.value})}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Preferred Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={consultationForm.preferredDate}
                            onChange={(e) => setConsultationForm({...consultationForm, preferredDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Time Slot</Label>
                          <Select value={consultationForm.timeSlot} onValueChange={(value) => setConsultationForm({...consultationForm, timeSlot: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999]" side="bottom" align="start">
                              <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (1PM - 5PM)</SelectItem>
                              <SelectItem value="evening">Evening (6PM - 8PM)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="projectType">Project Type</Label>
                        <Select value={consultationForm.projectType} onValueChange={(value) => setConsultationForm({...consultationForm, projectType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]" side="bottom" align="start">
                            <SelectItem value="web-app">Web Application</SelectItem>
                            <SelectItem value="mobile-app">Mobile Application</SelectItem>
                            <SelectItem value="erp">ERP System</SelectItem>
                            <SelectItem value="crm">CRM System</SelectItem>
                            <SelectItem value="hrmis">HRMIS System</SelectItem>
                            <SelectItem value="enterprise">Enterprise System</SelectItem>
                            <SelectItem value="integration">System Integration</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="message">Additional Notes</Label>
                        <Textarea
                          id="message"
                          value={consultationForm.message}
                          onChange={(e) => setConsultationForm({...consultationForm, message: e.target.value})}
                          placeholder="Tell us about your project requirements..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowConsultationDialog(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.preventDefault();
                            // Basic form validation
                            if (!consultationForm.name || !consultationForm.email) {
                              alert("Please fill in all required fields (Name and Email).");
                              return;
                            }
                            
                            // Email validation
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(consultationForm.email)) {
                              alert("Please enter a valid email address.");
                              return;
                            }
                            
                            // Show professional success toast
                            toast({
                              title: "Consultation Scheduled Successfully!",
                              description: `Thank you ${consultationForm.name}! We'll contact you within 24 hours to confirm your consultation.`,
                            });
                            
                            // Show additional details toast
                            setTimeout(() => {
                              toast({
                                title: "Consultation Details Confirmed",
                                description: `Project Type: ${consultationForm.projectType || 'To be discussed'} | Company: ${consultationForm.company || 'Individual'} | Preferred Date: ${consultationForm.preferredDate || 'Flexible'}`,
                                duration: 8000,
                              });
                            }, 1000);
                            
                            // Reset form
                            setConsultationForm({
                              name: "",
                              email: "",
                              company: "",
                              phone: "",
                              preferredDate: "",
                              timeSlot: "",
                              projectType: "",
                              message: ""
                            });
                            setShowConsultationDialog(false);
                          }}
                        >
                          Schedule Meeting
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={showEstimateDialog} onOpenChange={setShowEstimateDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      <Calculator className="h-5 w-5 mr-2" />
                      Get Estimate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Get Project Estimate</DialogTitle>
                      <DialogDescription>
                        Provide project details to receive a comprehensive estimate.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="est-name">Full Name *</Label>
                          <Input
                            id="est-name"
                            value={estimateForm.name}
                            onChange={(e) => setEstimateForm({...estimateForm, name: e.target.value})}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="est-email">Email *</Label>
                          <Input
                            id="est-email"
                            type="email"
                            value={estimateForm.email}
                            onChange={(e) => setEstimateForm({...estimateForm, email: e.target.value})}
                            placeholder="john@company.com"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="est-company">Company</Label>
                        <Input
                          id="est-company"
                          value={estimateForm.company}
                          onChange={(e) => setEstimateForm({...estimateForm, company: e.target.value})}
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="est-project">Project Type *</Label>
                          <Select value={estimateForm.projectType} onValueChange={(value) => setEstimateForm({...estimateForm, projectType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999]" side="bottom" align="start">
                              <SelectItem value="web-app">Web Application</SelectItem>
                              <SelectItem value="mobile-app">Mobile Application</SelectItem>
                              <SelectItem value="erp">ERP System</SelectItem>
                              <SelectItem value="crm">CRM System</SelectItem>
                              <SelectItem value="hrmis">HRMIS System</SelectItem>
                              <SelectItem value="enterprise">Enterprise System</SelectItem>
                              <SelectItem value="integration">System Integration</SelectItem>
                              <SelectItem value="ecommerce">E-commerce Platform</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="est-timeline">Timeline</Label>
                          <Select value={estimateForm.timeline} onValueChange={(value) => setEstimateForm({...estimateForm, timeline: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999]" side="bottom" align="start">
                              <SelectItem value="1-3">1-3 months</SelectItem>
                              <SelectItem value="3-6">3-6 months</SelectItem>
                              <SelectItem value="6-12">6-12 months</SelectItem>
                              <SelectItem value="12+">12+ months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="est-budget">Budget Range</Label>
                        <Select value={estimateForm.budget} onValueChange={(value) => setEstimateForm({...estimateForm, budget: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]" side="bottom" align="start">
                            <SelectItem value="under-25k">Under $25,000</SelectItem>
                            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                            <SelectItem value="250k+">$250,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="est-features">Key Features</Label>
                        <Textarea
                          id="est-features"
                          value={estimateForm.features}
                          onChange={(e) => setEstimateForm({...estimateForm, features: e.target.value})}
                          placeholder="List the main features you need (e.g., user authentication, payment processing, admin dashboard...)"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="est-description">Project Description</Label>
                        <Textarea
                          id="est-description"
                          value={estimateForm.description}
                          onChange={(e) => setEstimateForm({...estimateForm, description: e.target.value})}
                          placeholder="Describe your project goals, target audience, and any specific requirements..."
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowEstimateDialog(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.preventDefault();
                            // Basic form validation
                            if (!estimateForm.name || !estimateForm.email || !estimateForm.projectType) {
                              alert("Please fill in all required fields (Name, Email, and Project Type).");
                              return;
                            }
                            
                            // Email validation
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(estimateForm.email)) {
                              alert("Please enter a valid email address.");
                              return;
                            }
                            
                            // Generate budget-based recommendation
                            const recommendation = getBudgetRecommendation(estimateForm.budget, estimateForm.projectType, estimateForm.timeline);
                            
                            // Store data for recommendations page
                            const recommendationData = {
                              name: estimateForm.name,
                              email: estimateForm.email,
                              company: estimateForm.company,
                              projectType: estimateForm.projectType,
                              timeline: estimateForm.timeline,
                              budget: estimateForm.budget,
                              features: estimateForm.features,
                              description: estimateForm.description
                            };
                            
                            sessionStorage.setItem('projectRecommendationData', JSON.stringify(recommendationData));
                            
                            // Show success toast
                            toast({
                              title: "Estimate Request Submitted Successfully!",
                              description: `Redirecting to your personalized recommendations...`,
                            });
                            
                            // Navigate to recommendations page
                            setTimeout(() => {
                              navigate('/it-services/project-recommendations');
                            }, 1500);
                            
                            // Reset form
                            setEstimateForm({
                              name: "",
                              email: "",
                              company: "",
                              projectType: "",
                              timeline: "",
                              budget: "",
                              features: "",
                              description: ""
                            });
                            setShowEstimateDialog(false);
                          }}
                        >
                          Get Estimate
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}