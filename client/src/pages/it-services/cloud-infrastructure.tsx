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
  Cloud, 
  Server, 
  Database, 
  Shield,
  ArrowLeft,
  Check,
  Star,
  Users,
  Zap,
  Globe,
  Calendar,
  Calculator
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CloudInfrastructurePage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const [showEstimateDialog, setShowEstimateDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Form states
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    timeline: "",
    cloudPlatform: "",
    message: ""
  });
  
  const [estimateForm, setEstimateForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    currentInfrastructure: "",
    estimatedUsers: "",
    budget: "",
    timeline: "",
    requirements: ""
  });

  const services = [
    {
      title: "Cloud Migration & Strategy",
      description: "Seamless migration to AWS, Azure, or Google Cloud with minimal downtime",
      icon: Cloud,
      features: ["Assessment & Planning", "Migration Execution", "Performance Optimization", "Cost Management"]
    },
    {
      title: "DevOps & CI/CD",
      description: "Automated deployment pipelines and infrastructure management",
      icon: Server,
      features: ["Continuous Integration", "Automated Deployment", "Infrastructure as Code", "Monitoring & Alerts"]
    },
    {
      title: "Database Management",
      description: "Scalable database solutions with high availability and backup strategies",
      icon: Database,
      features: ["Database Design", "Performance Tuning", "Backup & Recovery", "Scaling Solutions"]
    }
  ];

  const technologies = [
    { name: "AWS", category: "Cloud Platform" },
    { name: "Azure", category: "Cloud Platform" },
    { name: "Google Cloud", category: "Cloud Platform" },
    { name: "Docker", category: "Containerization" },
    { name: "Kubernetes", category: "Orchestration" },
    { name: "Terraform", category: "Infrastructure" },
    { name: "Jenkins", category: "CI/CD" },
    { name: "GitLab CI", category: "CI/CD" }
  ];

  const projects = [
    {
      id: 1,
      title: "E-commerce Platform Migration",
      client: "RetailCorp",
      description: "Migrated legacy e-commerce platform to AWS with 99.9% uptime",
      duration: "4 months",
      team: "6 engineers",
      challenge: "Legacy monolithic e-commerce system with 500K+ daily users experiencing downtime and scalability issues during peak shopping seasons.",
      solution: "Complete migration to AWS using microservices architecture with containerized applications, auto-scaling groups, and multi-AZ deployment for high availability.",
      technologies: ["AWS EC2", "Docker", "Kubernetes", "RDS", "CloudFront", "Load Balancer"],
      results: [
        "99.9% uptime achieved (up from 95%)",
        "50% reduction in page load times",
        "40% cost savings on infrastructure",
        "Seamless scaling during Black Friday (300% traffic spike)"
      ],
      metrics: {
        uptime: "99.9%",
        performance: "50% faster",
        cost: "40% savings",
        scalability: "Auto-scaling to 300% capacity"
      }
    },
    {
      id: 2,
      title: "Microservices Architecture",
      client: "FinTech Inc",
      description: "Transformed monolithic application to microservices on Kubernetes",
      duration: "6 months", 
      team: "8 engineers",
      challenge: "Large monolithic financial application causing deployment bottlenecks, difficult maintenance, and limited scalability for growing user base.",
      solution: "Decomposed monolith into 15 microservices with Kubernetes orchestration, implemented API gateway, and established CI/CD pipelines for independent deployments.",
      technologies: ["Kubernetes", "Docker", "API Gateway", "MongoDB", "Redis", "Jenkins", "GitLab CI"],
      results: [
        "80% faster deployment cycles",
        "Independent service scaling",
        "Improved fault isolation",
        "Enhanced developer productivity"
      ],
      metrics: {
        deployment: "80% faster",
        scalability: "Independent scaling",
        reliability: "99.95% uptime",
        productivity: "3x deployment frequency"
      }
    },
    {
      id: 3,
      title: "Multi-Cloud Strategy",
      client: "Global Corp",
      description: "Implemented hybrid cloud solution across AWS and Azure",
      duration: "8 months",
      team: "10 engineers",
      challenge: "Single cloud dependency risk with need for disaster recovery, compliance requirements across different regions, and vendor lock-in concerns.",
      solution: "Designed and implemented multi-cloud architecture with workload distribution across AWS and Azure, unified monitoring, and automated failover mechanisms.",
      technologies: ["AWS", "Azure", "Terraform", "Kubernetes", "Consul", "Prometheus", "Grafana"],
      results: [
        "Zero single-point-of-failure",
        "99.99% disaster recovery capability",
        "Compliance across 12 countries",
        "30% cost optimization through cloud arbitrage"
      ],
      metrics: {
        availability: "99.99%",
        recovery: "< 5 minutes RTO",
        compliance: "12 regions",
        cost: "30% optimization"
      }
    }
  ];

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
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <Cloud className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cloud & Infrastructure</h1>
                <p className="text-gray-600">Scalable, secure, and reliable cloud solutions</p>
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
                    ? "border-sky-500 text-sky-600"
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
                    <CardTitle>Transform Your Infrastructure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      Modern businesses require agile, scalable infrastructure that can adapt to changing demands. 
                      Our cloud and infrastructure services help you migrate, optimize, and manage your IT environment 
                      for maximum performance and cost efficiency.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: Zap, title: "Performance", desc: "99.9% uptime with optimized performance" },
                        { icon: Shield, title: "Security", desc: "Enterprise-grade security and compliance" },
                        { icon: Users, title: "Scalability", desc: "Auto-scaling based on demand" },
                        { icon: Star, title: "Cost Efficiency", desc: "Optimized resource utilization" }
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                            <benefit.icon className="h-5 w-5 text-sky-600" />
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
                    <CardTitle className="text-lg">Our Expertise</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cloud Migrations</span>
                      <span className="font-semibold">200+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uptime Guarantee</span>
                      <span className="font-semibold">99.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost Reduction</span>
                      <span className="font-semibold">30-60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certified Engineers</span>
                      <span className="font-semibold">15+</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Migration Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        "Infrastructure Assessment",
                        "Migration Strategy",
                        "Pilot Migration",
                        "Full Migration",
                        "Optimization & Monitoring"
                      ].map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
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
                  <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-sky-600" />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cloud Technologies We Use</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We leverage industry-leading cloud platforms and tools to deliver robust, scalable solutions.
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See how we've helped organizations transform their infrastructure and accelerate their digital journey.
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
                        onClick={() => setSelectedProject(project)}
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

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-sky-600 to-blue-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Infrastructure?</h2>
              <p className="text-xl mb-8 opacity-90">
                Let's discuss your cloud migration and infrastructure optimization needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={showConsultationDialog} onOpenChange={setShowConsultationDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-100">
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule Assessment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule Infrastructure Assessment</DialogTitle>
                      <DialogDescription>
                        Get a free assessment of your current infrastructure and migration opportunities.
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
                        <Label htmlFor="infrastructure">Current Infrastructure</Label>
                        <Select value={consultationForm.cloudPlatform} onValueChange={(value) => setConsultationForm({...consultationForm, cloudPlatform: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select current setup" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999] relative" side="bottom" align="start">
                            <SelectItem value="on-premise">On-Premise</SelectItem>
                            <SelectItem value="hybrid">Hybrid Cloud</SelectItem>
                            <SelectItem value="aws">AWS</SelectItem>
                            <SelectItem value="azure">Azure</SelectItem>
                            <SelectItem value="gcp">Google Cloud</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="message">Assessment Goals</Label>
                        <Textarea
                          id="message"
                          value={consultationForm.message}
                          onChange={(e) => setConsultationForm({...consultationForm, message: e.target.value})}
                          placeholder="What are your main infrastructure challenges or goals?"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowConsultationDialog(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-sky-600 hover:bg-sky-700"
                          onClick={(e) => {
                            e.preventDefault();
                            
                            // Validate required fields
                            if (!consultationForm.name || !consultationForm.email) {
                              toast({
                                title: "Missing Information",
                                description: "Please fill in your name and email address.",
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            // Email validation
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(consultationForm.email)) {
                              toast({
                                title: "Invalid Email",
                                description: "Please enter a valid email address.",
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            // Show success toast
                            toast({
                              title: "Assessment Scheduled Successfully!",
                              description: `Thank you ${consultationForm.name}! We'll contact you within 24 hours to schedule your cloud assessment.`,
                            });
                            
                            // Show additional details toast
                            setTimeout(() => {
                              toast({
                                title: "Assessment Details Confirmed",
                                description: `Platform: ${consultationForm.cloudPlatform || 'To be discussed'} | Timeline: ${consultationForm.timeline || 'Flexible'} | Company: ${consultationForm.company || 'Individual'}`,
                                duration: 8000,
                              });
                            }, 1000);
                            
                            // Reset form and close dialog
                            setConsultationForm({
                              name: "",
                              email: "",
                              company: "",
                              phone: "",
                              timeline: "",
                              cloudPlatform: "",
                              message: ""
                            });
                            setShowConsultationDialog(false);
                          }}
                        >
                          Schedule Assessment
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={showEstimateDialog} onOpenChange={setShowEstimateDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sky-600">
                      <Calculator className="h-5 w-5 mr-2" />
                      Get Cost Estimate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Calculator className="h-5 w-5 mr-2 text-sky-600" />
                        Cloud Infrastructure Cost Estimate
                      </DialogTitle>
                      <DialogDescription>
                        Get a detailed cost estimate for your cloud infrastructure project. We'll analyze your requirements and provide a comprehensive proposal.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="est-name">Full Name *</Label>
                          <Input
                            id="est-name"
                            value={estimateForm.name}
                            onChange={(e) => setEstimateForm({...estimateForm, name: e.target.value})}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="est-email">Email Address *</Label>
                          <Input
                            id="est-email"
                            type="email"
                            value={estimateForm.email}
                            onChange={(e) => setEstimateForm({...estimateForm, email: e.target.value})}
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="est-company">Company Name</Label>
                        <Input
                          id="est-company"
                          value={estimateForm.company}
                          onChange={(e) => setEstimateForm({...estimateForm, company: e.target.value})}
                          placeholder="Your Company Ltd"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="project-type">Project Type</Label>
                          <Select value={estimateForm.projectType} onValueChange={(value) => setEstimateForm({...estimateForm, projectType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999] relative" side="bottom" align="start">
                              <SelectItem value="migration">Cloud Migration</SelectItem>
                              <SelectItem value="new-infrastructure">New Infrastructure</SelectItem>
                              <SelectItem value="optimization">Infrastructure Optimization</SelectItem>
                              <SelectItem value="devops">DevOps Implementation</SelectItem>
                              <SelectItem value="disaster-recovery">Disaster Recovery</SelectItem>
                              <SelectItem value="multi-cloud">Multi-Cloud Strategy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="current-infrastructure">Current Infrastructure</Label>
                          <Select value={estimateForm.currentInfrastructure} onValueChange={(value) => setEstimateForm({...estimateForm, currentInfrastructure: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select current setup" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999] relative" side="bottom" align="start">
                              <SelectItem value="on-premise">On-Premise Servers</SelectItem>
                              <SelectItem value="hybrid">Hybrid Cloud</SelectItem>
                              <SelectItem value="aws">AWS</SelectItem>
                              <SelectItem value="azure">Microsoft Azure</SelectItem>
                              <SelectItem value="gcp">Google Cloud</SelectItem>
                              <SelectItem value="other-cloud">Other Cloud Provider</SelectItem>
                              <SelectItem value="none">Starting from scratch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="estimated-users">Estimated Users/Load</Label>
                          <Select value={estimateForm.estimatedUsers} onValueChange={(value) => setEstimateForm({...estimateForm, estimatedUsers: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user count" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999] relative" side="bottom" align="start">
                              <SelectItem value="small">Small (1-100 users)</SelectItem>
                              <SelectItem value="medium">Medium (100-1,000 users)</SelectItem>
                              <SelectItem value="large">Large (1,000-10,000 users)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (10,000+ users)</SelectItem>
                              <SelectItem value="variable">Variable load</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="budget">Budget Range</Label>
                          <Select value={estimateForm.budget} onValueChange={(value) => setEstimateForm({...estimateForm, budget: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999] relative" side="bottom" align="start">
                              <SelectItem value="under-25k">Under $25,000</SelectItem>
                              <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                              <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                              <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                              <SelectItem value="250k+">$250,000+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="timeline">Project Timeline</Label>
                        <Select value={estimateForm.timeline} onValueChange={(value) => setEstimateForm({...estimateForm, timeline: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999] relative" side="bottom" align="start">
                            <SelectItem value="urgent">Urgent (1-3 months)</SelectItem>
                            <SelectItem value="normal">Normal (3-6 months)</SelectItem>
                            <SelectItem value="flexible">Flexible (6+ months)</SelectItem>
                            <SelectItem value="phased">Phased approach</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="requirements">Specific Requirements</Label>
                        <Textarea
                          id="requirements"
                          value={estimateForm.requirements}
                          onChange={(e) => setEstimateForm({...estimateForm, requirements: e.target.value})}
                          placeholder="Describe your specific infrastructure needs, compliance requirements, performance expectations, etc."
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowEstimateDialog(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-sky-600 hover:bg-sky-700"
                          onClick={(e) => {
                            e.preventDefault();
                            
                            // Validate required fields
                            if (!estimateForm.name || !estimateForm.email) {
                              toast({
                                title: "Missing Information",
                                description: "Please fill in your name and email address.",
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            // Email validation
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(estimateForm.email)) {
                              toast({
                                title: "Invalid Email",
                                description: "Please enter a valid email address.",
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            // Store data for recommendations page
                            const recommendationData = {
                              name: estimateForm.name,
                              email: estimateForm.email,
                              company: estimateForm.company,
                              projectType: estimateForm.projectType || "cloud-infrastructure",
                              timeline: estimateForm.timeline,
                              budget: estimateForm.budget,
                              features: `${estimateForm.currentInfrastructure || 'Current setup'}, ${estimateForm.estimatedUsers || 'User load'}, ${estimateForm.projectType || 'Cloud project'}`,
                              description: estimateForm.requirements || "Cloud infrastructure project"
                            };
                            
                            sessionStorage.setItem('projectRecommendationData', JSON.stringify(recommendationData));
                            
                            // Show success toast
                            toast({
                              title: "Cost Estimate Request Submitted!",
                              description: `Redirecting to your personalized cloud infrastructure recommendations...`,
                            });
                            
                            // Reset form and close dialog
                            setEstimateForm({
                              name: "",
                              email: "",
                              company: "",
                              projectType: "",
                              currentInfrastructure: "",
                              estimatedUsers: "",
                              budget: "",
                              timeline: "",
                              requirements: ""
                            });
                            setShowEstimateDialog(false);
                            
                            // Navigate to recommendations page
                            setTimeout(() => {
                              navigate('/it-services/project-recommendations');
                            }, 1500);
                          }}
                        >
                          Get Detailed Estimate
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

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center">
                  <Server className="h-6 w-6 mr-2 text-sky-600" />
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-lg">
                  {selectedProject.client} • {selectedProject.duration} • {selectedProject.team}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-6">
                {/* Project Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-sky-600" />
                      Challenge
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProject.challenge}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-sky-600" />
                      Solution
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProject.solution}
                    </p>
                  </div>
                </div>

                {/* Technologies Used */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-sky-600" />
                    Technologies & Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-sky-50 border-sky-200 text-sky-700">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Key Results */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-sky-600" />
                    Key Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProject.results.map((result, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-sky-600" />
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(selectedProject.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-4 bg-sky-50 rounded-lg">
                        <div className="text-2xl font-bold text-sky-600">{value}</div>
                        <div className="text-sm text-gray-600 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold mb-3">Interested in Similar Results?</h4>
                  <p className="text-gray-600 mb-4">
                    Our cloud infrastructure team can help you achieve similar transformations. Let's discuss your specific needs and challenges.
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        setSelectedProject(null);
                        setShowConsultationDialog(true);
                      }}
                      className="bg-sky-600 hover:bg-sky-700"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Consultation
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedProject(null);
                        setShowEstimateDialog(true);
                      }}
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Get Estimate
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}