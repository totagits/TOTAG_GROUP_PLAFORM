import Header from "@/components/header";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Cloud, 
  Shield, 
  Settings, 
  BarChart3, 
  Cpu, 
  GraduationCap,
  Laptop,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Send,
  ArrowLeft,
  Zap,
  Database
} from "lucide-react";
import { Link } from "wouter";
import techBgImage from '@assets/image_1753797161040.png';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  features: string[];
  technologies: string[];
  colorClass: {
    iconBg: string;
    iconText: string;
    tags: string;
  };
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
}

export default function ITServicesPortal() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const services: Service[] = [
    {
      id: "custom-software",
      title: "Custom Software Development",
      description: "Tailored web and mobile applications, enterprise systems (ERP, CRM, HRMIS), API integrations, and legacy system modernization.",
      icon: Code2,
      href: "/custom-software",
      features: [
        "Web and Mobile Applications",
        "Enterprise Systems (ERP, CRM, HRMIS)",
        "API & Microservices Integrations", 
        "Legacy System Modernization",
        "Multi-tenant Architecture Solutions",
        "Integration with Third-party Systems"
      ],
      technologies: ["React", "Node.js", "Python", "Java", "Swift", "Kotlin", "PostgreSQL", "MongoDB"],
      colorClass: {
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        tags: "text-blue-600"
      }
    },
    {
      id: "cloud-infrastructure",
      title: "Cloud & Infrastructure Solutions",
      description: "Comprehensive cloud migration (AWS, Azure, hybrid), virtualization, containerization, DevOps, and disaster recovery planning.",
      icon: Cloud,
      href: "/cloud-infrastructure",
      features: [
        "Cloud Migration (AWS, Azure, Hybrid Solutions)",
        "Virtualization & Containerization (Docker, Kubernetes)",
        "DevOps and CI/CD Pipelines",
        "Disaster Recovery & Business Continuity Planning",
        "Infrastructure as Code",
        "Network Architecture & Security"
      ],
      technologies: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitLab CI"],
      colorClass: {
        iconBg: "bg-sky-100",
        iconText: "text-sky-600",
        tags: "text-sky-600"
      }
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity & Compliance",
      description: "Advanced security solutions including penetration testing, identity management, SIEM integration, and data privacy compliance.",
      icon: Shield,
      href: "/cybersecurity",
      features: [
        "Penetration Testing & Vulnerability Assessments",
        "Identity & Access Management",
        "SIEM Integration & Monitoring",
        "Data Privacy and Regulatory Compliance Solutions",
        "Incident Response & Forensics",
        "Security Awareness Training"
      ],
      technologies: ["Splunk", "CrowdStrike", "Okta", "Nessus", "Wireshark", "Metasploit", "OWASP", "NIST"],
      colorClass: {
        iconBg: "bg-red-100",
        iconText: "text-red-600",
        tags: "text-red-600"
      }
    },
    {
      id: "managed-it-services",
      title: "Managed IT Services",
      description: "Comprehensive 24/7 IT support including network monitoring, help desk, vendor management, and ITIL-aligned operations.",
      icon: Settings,
      href: "/managed-it-services",
      features: [
        "24/7 Network and Server Monitoring",
        "IT Help Desk and Remote Support",
        "Vendor and License Management",
        "ITIL-aligned Change and Incident Management",
        "IT Asset Management",
        "Service Level Agreement (SLA) Management"
      ],
      technologies: ["ServiceNow", "ITSM", "Monitoring Tools", "RMM", "SIEM", "Backup Solutions"],
      colorClass: {
        iconBg: "bg-orange-100",
        iconText: "text-orange-600",
        tags: "text-orange-600"
      }
    },
    {
      id: "data-analytics",
      title: "Data & Analytics",
      description: "Advanced data warehousing, business intelligence dashboards, predictive analytics, and GIS mapping solutions.",
      icon: Database,
      href: "/data-analytics",
      features: [
        "Data Warehousing & ETL Pipelines",
        "Business Intelligence Dashboards",
        "Predictive Analytics and Reporting",
        "GIS Mapping and Spatial Data Analysis",
        "Machine Learning & AI Development",
        "Big Data Processing"
      ],
      technologies: ["Python", "R", "TensorFlow", "Power BI", "Tableau", "Apache Spark", "Hadoop", "SQL"],
      colorClass: {
        iconBg: "bg-indigo-100",
        iconText: "text-indigo-600",
        tags: "text-indigo-600"
      }
    },
    {
      id: "digital-transformation",
      title: "Digital Transformation & Emerging Technologies",
      description: "Strategic process automation (RPA), IoT solutions, blockchain concepts, and comprehensive digital strategy consulting.",
      icon: Zap,
      href: "/digital-transformation",
      features: [
        "Process Automation (RPA)",
        "Internet of Things (IoT) Solutions",
        "Blockchain Proof-of-concepts",
        "Digital Strategy and Consulting",
        "Technology Assessment & Roadmapping",
        "Performance Optimization"
      ],
      technologies: ["RPA Tools", "IoT Platforms", "Blockchain", "TOGAF", "ITIL", "Agile", "Scrum", "PMI"],
      colorClass: {
        iconBg: "bg-green-100",
        iconText: "text-green-600",
        tags: "text-green-600"
      }
    },
    {
      id: "saas-enterprise-platform",
      title: "SaaS Enterprise Platform",
      description: "Comprehensive 14-module FIMS & HRMIS cloud-based enterprise software suite designed for multi-tenant organizations with Liberian payment integration.",
      icon: Database,
      href: "/saas",
      features: [
        "14 Modular FIMS & HRMIS Platform ($20/month per module)",
        "Minimum 4 modules required, 10% discount for all modules",
        "Multi-tenant Architecture with Liberian Payment Integration",
        "Real-time Analytics & Reporting",
        "Mobile-first Employee Self-Service Portal",
        "Biometric Integration & Attendance Management",
        "Complete HR Lifecycle Management",
        "Financial Management & Compliance"
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "Multi-tenant SaaS", "Mobile Money", "Biometrics", "Real-time Analytics"],
      colorClass: {
        iconBg: "bg-emerald-100",
        iconText: "text-emerald-600",
        tags: "text-emerald-600"
      }
    },
    {
      id: "training-capacity-building",
      title: "Training & Capacity Building",
      description: "Certified technical workshops, IT literacy programs, custom bootcamps, and mentorship programs to enhance team capabilities.",
      icon: GraduationCap,
      href: "/training-capacity-building",
      features: [
        "Certified Technical Workshops (Cloud, Security, Software Dev)",
        "End-user IT Literacy Programs",
        "Custom Bootcamps for Organizations",
        "Mentorship and Internship Programs",
        "Train-the-Trainer Programs",
        "Skills Assessment & Career Development"
      ],
      technologies: ["Azure", "AWS", "Cisco", "Docker", "Kubernetes", "React", "Python", "DevOps", "Agile", "ITIL"],
      colorClass: {
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        tags: "text-purple-600"
      }
    }
  ];

  const handleServiceClick = (service: Service) => {
    // For services with detailed pages, navigate to them
    if (service.id === "custom-software") {
      setSelectedService(service);
      return;
    }
    if (service.id === "saas-enterprise-platform") {
      window.location.href = "/saas";
      return;
    }
    if (service.id === "cloud-infrastructure") {
      window.location.href = "/it-services/cloud-infrastructure";
      return;
    }
    if (service.id === "cybersecurity") {
      window.location.href = "/it-services/cybersecurity";
      return;
    }
    if (service.id === "training-capacity-building") {
      window.location.href = "/it-services/training-capacity-building";
      return;
    }
    // For other services, show the modal
    setSelectedService(service);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setContactForm({
        name: "",
        email: "",
        company: "",
        service: "",
        message: ""
      });
      setTimeout(() => {
        setShowContactDialog(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to TOTAG Group</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="text-2xl font-bold text-blue-600">
                TOTAG IT Services
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium">
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-80 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-4 space-y-2">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceClick(service)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <service.icon className={`h-5 w-5 ${service.colorClass.iconText}`} />
                          <span className="text-sm font-medium text-gray-900">{service.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
              <Button 
                onClick={() => setShowContactDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Quote
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      handleServiceClick(service);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <service.icon className={`h-5 w-5 ${service.colorClass.iconText}`} />
                      <span className="text-sm font-medium text-gray-900">{service.title}</span>
                    </div>
                  </button>
                ))}
                <div className="pt-3 border-t border-gray-200">
                  <Button 
                    onClick={() => {
                      setShowContactDialog(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section 
          className="relative text-white py-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(13, 31, 99, 0.4), rgba(67, 56, 202, 0.4)), url(${techBgImage})`
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                TOTAG IT Services
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Empowering digital transformation with tailored IT solutions that drive innovation and growth
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowContactDialog(true)}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <a href="#services">Explore Services</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Seven core service areas providing comprehensive technology solutions for your business transformation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  <Card 
                    onClick={() => handleServiceClick(service)}
                    className="h-full bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer p-6 transform hover:-translate-y-1"
                  >
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="flex-1 mb-6">
                        <div className={`w-16 h-16 ${service.colorClass.iconBg} rounded-xl flex items-center justify-center mb-4 transition-colors duration-300`}>
                          <service.icon className={`h-8 w-8 ${service.colorClass.iconText}`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{service.title}</h3>
                        <p className="text-gray-600 leading-relaxed line-clamp-3">{service.description}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className={`text-sm font-medium ${service.colorClass.tags} line-clamp-1 flex-1`}>
                          Learn More
                        </span>
                        <ExternalLink className={`w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${service.colorClass.iconText}`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ready to transform your business with cutting-edge IT solutions? Let's discuss your project.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">tis@totaggroup.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">+231-777-666-999</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Office</p>
                        <p className="text-gray-600">Guest House Road, Thinker's Village Community, Paynesville, Montserrado, Liberia</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Office Hours</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 2:00 PM</p>
                    <p>Sunday: Closed</p>
                    <p className="text-blue-600 font-medium">24/7 Emergency Support Available</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact Form */}
              <Card className="p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl">Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input 
                          id="name" 
                          required 
                          placeholder="Your name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          required 
                          placeholder="your@email.com"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        placeholder="Your company name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="service">Service Interest</Label>
                      <select 
                        id="service" 
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a service</option>
                        {services.map(service => (
                          <option key={service.id} value={service.id}>{service.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message" 
                        required 
                        placeholder="Tell us about your project..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Service Detail Dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 ${selectedService.colorClass.iconBg} rounded-xl flex items-center justify-center`}>
                    <selectedService.icon className={`h-8 w-8 ${selectedService.colorClass.iconText}`} />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedService.title}</DialogTitle>
                    <DialogDescription className="text-lg mt-2">
                      {selectedService.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedService.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${selectedService.colorClass.iconBg}`}></div>
                        {feature.includes("Featured: 14 Modular FIMS & HRMIS SaaS Platform") ? (
                          <span className="text-sm text-gray-700">
                            <span className="font-semibold">Featured:</span>{" "}
                            <button
                              onClick={() => window.location.href = "/saas"}
                              className="text-blue-600 hover:text-blue-800 underline font-medium"
                              data-testid="saas-platform-link"
                            >
                              14 Modular FIMS & HRMIS SaaS Platform
                            </button>
                            <span className="text-gray-500 ml-1">($35-$75/month per module)</span>
                          </span>
                        ) : (
                          <span className="text-sm text-gray-700">{feature}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Technologies & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => {
                      setSelectedService(null);
                      setShowContactDialog(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Get Quote
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedService(null)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request a Quote</DialogTitle>
            <DialogDescription>
              Tell us about your project and we'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleContactSubmit} className="space-y-4">
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">Thank you! We'll be in touch soon.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">Something went wrong. Please try again.</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Name *</Label>
                <Input
                  id="contactName"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="contactCompany">Company</Label>
              <Input
                id="contactCompany"
                value={contactForm.company}
                onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="contactService">Service</Label>
              <select 
                id="contactService"
                value={contactForm.service}
                onChange={(e) => setContactForm({...contactForm, service: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="contactMessage">Message *</Label>
              <Textarea
                id="contactMessage"
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                rows={4}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowContactDialog(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}