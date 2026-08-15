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
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle,
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

export default function CybersecurityPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [showAuditQuoteDialog, setShowAuditQuoteDialog] = useState(false);

  // Form states
  const [auditQuoteForm, setAuditQuoteForm] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    companySize: "",
    currentSecurity: "",
    auditType: "",
    complianceRequirements: "",
    timeline: "",
    budget: "",
    concerns: ""
  });

  const services = [
    {
      title: "Security Assessment & Auditing",
      description: "Comprehensive security evaluations to identify vulnerabilities and compliance gaps",
      icon: Eye,
      features: ["Penetration Testing", "Vulnerability Assessment", "Compliance Auditing", "Risk Analysis"]
    },
    {
      title: "Identity & Access Management",
      description: "Secure user authentication and authorization systems",
      icon: Lock,
      features: ["Multi-Factor Authentication", "Single Sign-On (SSO)", "Role-Based Access", "Identity Governance"]
    },
    {
      title: "Incident Response & Recovery",
      description: "24/7 monitoring and rapid response to security incidents",
      icon: AlertTriangle,
      features: ["SOC Monitoring", "Incident Response", "Forensic Analysis", "Recovery Planning"]
    }
  ];

  const threats = [
    { name: "Malware", percentage: "95%" },
    { name: "Phishing", percentage: "90%" },
    { name: "Ransomware", percentage: "85%" },
    { name: "Data Breaches", percentage: "80%" }
  ];

  const certifications = [
    "CISSP", "CISM", "CISA", "CEH", "GCIH", "GSEC", "ISO 27001", "SOC 2"
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
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cybersecurity Solutions</h1>
                <p className="text-gray-600">Protect your business from evolving cyber threats</p>
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
              { id: "threats", label: "Threat Landscape" },
              { id: "certifications", label: "Certifications" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-600"
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
                    <CardTitle>Comprehensive Cybersecurity Protection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      In today's digital landscape, cybersecurity is not optional—it's essential. Our comprehensive 
                      cybersecurity solutions protect your organization from sophisticated threats while ensuring 
                      compliance with industry regulations and standards.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Cybersecurity Statistics</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• 95% of successful cyberattacks are due to human error</li>
                        <li>• Average cost of a data breach is $4.45 million</li>
                        <li>• 43% of cyberattacks target small businesses</li>
                        <li>• It takes an average of 277 days to identify a breach</li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: Shield, title: "Proactive Defense", desc: "Advanced threat detection and prevention" },
                        { icon: Lock, title: "Data Protection", desc: "Encryption and secure data handling" },
                        { icon: Users, title: "User Training", desc: "Security awareness and best practices" },
                        { icon: Zap, title: "Rapid Response", desc: "24/7 monitoring and incident response" }
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <benefit.icon className="h-5 w-5 text-red-600" />
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
                    <CardTitle className="text-lg">Security Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Threat Detection Rate</span>
                      <span className="font-semibold">99.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold">&lt; 15 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compliance Rate</span>
                      <span className="font-semibold">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Certifications</span>
                      <span className="font-semibold">8+</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Security Framework</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        "Risk Assessment",
                        "Security Controls Implementation",
                        "Continuous Monitoring",
                        "Incident Response",
                        "Recovery & Improvement"
                      ].map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
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
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-red-600" />
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

        {/* Threats Tab */}
        {activeTab === "threats" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Threat Landscape</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Understanding the evolving threat landscape is crucial for effective cybersecurity strategy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Top Threats by Detection Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {threats.map((threat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{threat.name}</span>
                          <span className="text-sm text-gray-600">{threat.percentage}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ width: threat.percentage }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Regular security awareness training",
                      "Multi-factor authentication",
                      "Regular software updates",
                      "Network segmentation",
                      "Backup and recovery planning",
                      "Incident response procedures"
                    ].map((practice, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span className="text-sm text-gray-700">{practice}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Certifications Tab */}
        {activeTab === "certifications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Certifications</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our cybersecurity experts hold industry-leading certifications to ensure the highest level of expertise.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{cert}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Secure Your Business Today</h2>
              <p className="text-xl mb-8 opacity-90">
                Don't wait for a security breach. Let us assess your current security posture and implement robust protections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule Security Assessment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule Security Assessment</DialogTitle>
                      <DialogDescription>
                        Get a comprehensive security assessment to identify vulnerabilities and risks.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input id="name" placeholder="John Doe" required />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input id="email" type="email" placeholder="john@company.com" required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" placeholder="Company Name" />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999] relative" side="bottom" align="start">
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="concerns">Security Concerns</Label>
                        <Textarea
                          id="concerns"
                          placeholder="Describe your main security concerns or recent incidents..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowAssessmentDialog(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={(e) => {
                            e.preventDefault();
                            alert("Security assessment request submitted! Our team will contact you within 24 hours.");
                            setShowAssessmentDialog(false);
                          }}
                        >
                          Schedule Assessment
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={showAuditQuoteDialog} onOpenChange={setShowAuditQuoteDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                      <Calculator className="h-5 w-5 mr-2" />
                      Security Audit Quote
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-red-600" />
                        Security Audit Quote Request
                      </DialogTitle>
                      <DialogDescription>
                        Get a customized quote for your security audit. We'll analyze your requirements and provide a comprehensive proposal.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="audit-name">Full Name *</Label>
                          <Input
                            id="audit-name"
                            value={auditQuoteForm.name}
                            onChange={(e) => setAuditQuoteForm({...auditQuoteForm, name: e.target.value})}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="audit-email">Email Address *</Label>
                          <Input
                            id="audit-email"
                            type="email"
                            value={auditQuoteForm.email}
                            onChange={(e) => setAuditQuoteForm({...auditQuoteForm, email: e.target.value})}
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="audit-company">Company Name *</Label>
                        <Input
                          id="audit-company"
                          value={auditQuoteForm.company}
                          onChange={(e) => setAuditQuoteForm({...auditQuoteForm, company: e.target.value})}
                          placeholder="Your Company Ltd"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="audit-industry">Industry</Label>
                          <Select value={auditQuoteForm.industry} onValueChange={(value) => setAuditQuoteForm({...auditQuoteForm, industry: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999] relative" side="bottom" align="start">
                              <SelectItem value="financial">Financial Services</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="audit-size">Company Size</Label>
                          <Select value={auditQuoteForm.companySize} onValueChange={(value) => setAuditQuoteForm({...auditQuoteForm, companySize: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999] relative" side="bottom" align="start">
                              <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                              <SelectItem value="small">Small (11-50 employees)</SelectItem>
                              <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                              <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="audit-type">Audit Type</Label>
                          <Select value={auditQuoteForm.auditType} onValueChange={(value) => setAuditQuoteForm({...auditQuoteForm, auditType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select audit type" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999] relative" side="bottom" align="start">
                              <SelectItem value="penetration">Penetration Testing</SelectItem>
                              <SelectItem value="vulnerability">Vulnerability Assessment</SelectItem>
                              <SelectItem value="compliance">Compliance Audit</SelectItem>
                              <SelectItem value="risk">Risk Assessment</SelectItem>
                              <SelectItem value="comprehensive">Comprehensive Security Audit</SelectItem>
                              <SelectItem value="incident">Incident Response Planning</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="audit-current">Current Security Measures</Label>
                          <Select value={auditQuoteForm.currentSecurity} onValueChange={(value) => setAuditQuoteForm({...auditQuoteForm, currentSecurity: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select current level" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999] relative" side="bottom" align="start">
                              <SelectItem value="basic">Basic (Antivirus, Firewall)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (SIEM, Basic Policies)</SelectItem>
                              <SelectItem value="advanced">Advanced (Full SOC, Compliance)</SelectItem>
                              <SelectItem value="none">Minimal/None</SelectItem>
                              <SelectItem value="unknown">Not Sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="audit-timeline">Timeline</Label>
                          <Select value={auditQuoteForm.timeline} onValueChange={(value) => setAuditQuoteForm({...auditQuoteForm, timeline: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999] relative" side="bottom" align="start">
                              <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                              <SelectItem value="normal">Normal (3-4 weeks)</SelectItem>
                              <SelectItem value="flexible">Flexible (1-2 months)</SelectItem>
                              <SelectItem value="planned">Planned (3+ months)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="audit-budget">Budget Range</Label>
                          <Select value={auditQuoteForm.budget} onValueChange={(value) => setAuditQuoteForm({...auditQuoteForm, budget: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999] relative" side="bottom" align="start">
                              <SelectItem value="under-15k">Under $15,000</SelectItem>
                              <SelectItem value="15k-30k">$15,000 - $30,000</SelectItem>
                              <SelectItem value="30k-50k">$30,000 - $50,000</SelectItem>
                              <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                              <SelectItem value="100k+">$100,000+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="audit-compliance">Compliance Requirements</Label>
                        <Textarea
                          id="audit-compliance"
                          value={auditQuoteForm.complianceRequirements}
                          onChange={(e) => setAuditQuoteForm({...auditQuoteForm, complianceRequirements: e.target.value})}
                          placeholder="List any compliance standards you need to meet (HIPAA, SOX, PCI-DSS, ISO 27001, GDPR, etc.)"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="audit-concerns">Security Concerns & Goals</Label>
                        <Textarea
                          id="audit-concerns"
                          value={auditQuoteForm.concerns}
                          onChange={(e) => setAuditQuoteForm({...auditQuoteForm, concerns: e.target.value})}
                          placeholder="Describe your main security concerns, recent incidents, specific areas you want audited, or security goals..."
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowAuditQuoteDialog(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={(e) => {
                            e.preventDefault();
                            
                            // Validate required fields
                            if (!auditQuoteForm.name || !auditQuoteForm.email || !auditQuoteForm.company) {
                              toast({
                                title: "Missing Information",
                                description: "Please fill in your name, email, and company name.",
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            // Email validation
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(auditQuoteForm.email)) {
                              toast({
                                title: "Invalid Email",
                                description: "Please enter a valid email address.",
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            // Store data for recommendations page
                            const recommendationData = {
                              name: auditQuoteForm.name,
                              email: auditQuoteForm.email,
                              company: auditQuoteForm.company,
                              projectType: "cybersecurity-audit",
                              timeline: auditQuoteForm.timeline,
                              budget: auditQuoteForm.budget,
                              features: `${auditQuoteForm.auditType || 'Security audit'}, ${auditQuoteForm.industry || 'Industry'}, ${auditQuoteForm.companySize || 'Company size'}`,
                              description: `${auditQuoteForm.concerns || 'Cybersecurity audit project'} | Compliance: ${auditQuoteForm.complianceRequirements || 'Standard'} | Current Security: ${auditQuoteForm.currentSecurity || 'To be assessed'}`
                            };
                            
                            sessionStorage.setItem('projectRecommendationData', JSON.stringify(recommendationData));
                            
                            // Show success toast
                            toast({
                              title: "Security Audit Quote Requested!",
                              description: `Redirecting to your personalized cybersecurity recommendations...`,
                            });
                            
                            // Reset form and close dialog
                            setAuditQuoteForm({
                              name: "",
                              email: "",
                              company: "",
                              industry: "",
                              companySize: "",
                              currentSecurity: "",
                              auditType: "",
                              complianceRequirements: "",
                              timeline: "",
                              budget: "",
                              concerns: ""
                            });
                            setShowAuditQuoteDialog(false);
                            
                            // Navigate to recommendations page
                            setTimeout(() => {
                              navigate('/it-services/project-recommendations');
                            }, 1500);
                          }}
                        >
                          Get Security Audit Quote
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