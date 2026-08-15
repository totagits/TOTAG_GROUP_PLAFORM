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
  GraduationCap, 
  ArrowLeft,
  Check,
  Star,
  Users,
  Award,
  Clock,
  Target,
  BookOpen,
  Zap,
  Calendar,
  TrendingUp,
  ChevronRight,
  Building,
  Globe
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function TrainingCapacityBuildingPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);

  // Form states
  const [enrollmentForm, setEnrollmentForm] = useState({
    name: "",
    email: "",
    company: "",
    position: "",
    trainingType: "",
    participants: "",
    experience: "",
    timeline: "",
    budget: "",
    goals: ""
  });

  const [consultationForm, setConsultationForm] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    trainingNeeds: ""
  });

  const programs = [
    {
      title: "Certified Technical Workshops",
      description: "Industry-leading certification programs for Azure, AWS, and Cisco technologies",
      icon: Award,
      duration: "2-5 days",
      participants: "8-20",
      features: [
        "Azure Fundamentals & Advanced Solutions",
        "AWS Cloud Practitioner to Professional",
        "Cisco Networking & Security",
        "Hands-on Lab Exercises",
        "Official Certification Preparation",
        "Expert Instructor-Led Training"
      ]
    },
    {
      title: "End-User IT Literacy Programs",
      description: "Comprehensive digital literacy training for non-technical staff",
      icon: Users,
      duration: "1-3 days",
      participants: "15-50",
      features: [
        "Microsoft Office 365 Mastery",
        "Digital Collaboration Tools",
        "Cybersecurity Awareness",
        "Email & Communication Best Practices",
        "Data Management & Organization",
        "Troubleshooting Common Issues"
      ]
    },
    {
      title: "Custom In-House Bootcamps",
      description: "Intensive training programs tailored to your specific technology stack and DevOps practices",
      icon: Zap,
      duration: "1-12 weeks",
      participants: "5-25",
      features: [
        "Full-Stack Development (React, Node.js, Python)",
        "DevOps & CI/CD Pipeline Implementation",
        "Container Technologies (Docker, Kubernetes)",
        "Cloud-Native Development",
        "Agile & Scrum Methodologies",
        "Project-Based Learning"
      ]
    },
    {
      title: "Mentorship & Internship Placement",
      description: "Structured mentorship programs connecting learners with industry experts",
      icon: Target,
      duration: "3-12 months",
      participants: "1-10",
      features: [
        "One-on-One Expert Mentorship",
        "Real-World Project Experience",
        "Career Development Planning",
        "Industry Network Building",
        "Skills Assessment & Feedback",
        "Job Placement Assistance"
      ]
    },
    {
      title: "Train-the-Trainer Programs",
      description: "Empower your internal team to become effective technical trainers and knowledge leaders",
      icon: BookOpen,
      duration: "5-10 days",
      participants: "3-15",
      features: [
        "Adult Learning Principles",
        "Technical Content Development",
        "Presentation & Facilitation Skills",
        "Assessment & Evaluation Methods",
        "Training Technology Tools",
        "Certification Program Design"
      ]
    }
  ];

  const technologies = [
    "Azure", "AWS", "Google Cloud", "Cisco", "Docker", "Kubernetes", 
    "React", "Node.js", "Python", "DevOps", "CI/CD", "Agile", 
    "Microsoft 365", "Cybersecurity", "ITIL", "Project Management"
  ];

  const certifications = [
    "Microsoft Azure Certified",
    "AWS Certified Solutions Architect", 
    "Cisco Certified Network Associate",
    "CompTIA Security+",
    "Certified Scrum Master",
    "Project Management Professional"
  ];

  const successMetrics = [
    { label: "Training Programs Delivered", value: "500+" },
    { label: "Professionals Trained", value: "15,000+" },
    { label: "Certification Success Rate", value: "95%" },
    { label: "Job Placement Rate", value: "88%" }
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
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Training & Capacity Building</h1>
                <p className="text-gray-600">Empowering teams with cutting-edge technical skills and certifications</p>
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
              { id: "programs", label: "Training Programs" },
              { id: "certifications", label: "Certifications" },
              { id: "success", label: "Success Stories" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
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
      <main className="container mx-auto px-4 py-12">
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Build Tomorrow's Tech Leaders Today
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Our comprehensive training programs combine industry expertise with hands-on learning to accelerate 
                your team's capabilities and drive organizational success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowEnrollmentDialog(true)}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Enroll Your Team
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowConsultationDialog(true)}>
                  <Calendar className="h-5 w-5 mr-2" />
                  Free Consultation
                </Button>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {successMetrics.map((metric, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="py-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Accelerated Growth</h3>
                  <p className="text-gray-600">Fast-track your team's technical capabilities with intensive, results-focused training programs.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Industry Certifications</h3>
                  <p className="text-gray-600">Earn recognized certifications from leading technology vendors and industry organizations.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Custom Solutions</h3>
                  <p className="text-gray-600">Tailored training programs designed to meet your specific business needs and technology stack.</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === "programs" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Training Programs</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive training solutions designed to meet diverse learning needs and skill levels.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {programs.map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <program.icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                          <p className="text-gray-600 mb-4">{program.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {program.duration}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {program.participants} people
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {program.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start space-x-2">
                            <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          if (index === 0) {
                            navigate('/it-services/training/certified-technical-workshops');
                          } else if (index === 1) {
                            navigate('/it-services/training/end-user-it-literacy');
                          } else if (index === 2) {
                            navigate('/it-services/training/custom-in-house-bootcamps');
                          } else if (index === 3) {
                            navigate('/it-services/training/mentorship-internship-placement');
                          } else if (index === 4) {
                            navigate('/it-services/training/train-the-trainer');
                          } else {
                            setShowEnrollmentDialog(true);
                          }
                        }}
                      >
                        Learn More
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "certifications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Industry Certifications</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Gain recognized credentials from leading technology vendors and industry organizations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{cert}</h3>
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      Available
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Certification Support</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our comprehensive certification programs include exam preparation, practice tests, 
                  hands-on labs, and post-certification career support to ensure your success.
                </p>
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowEnrollmentDialog(true)}
                >
                  <Star className="h-5 w-5 mr-2" />
                  Start Your Certification Journey
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real results from organizations that invested in their teams through our training programs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">TechCorp Solutions</h3>
                    <p className="text-gray-600">Fortune 500 Technology Company</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "TOTAG's custom DevOps bootcamp transformed our development team. We reduced deployment 
                  time by 70% and improved our release frequency from monthly to weekly deployments."
                </blockquote>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">70%</div>
                    <div className="text-sm text-gray-600">Faster Deployments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">85%</div>
                    <div className="text-sm text-gray-600">Team Retention</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">25</div>
                    <div className="text-sm text-gray-600">Developers Trained</div>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Global Manufacturing Inc.</h3>
                    <p className="text-gray-600">International Manufacturing</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "The Azure certification program helped our IT team modernize our infrastructure. 
                  100% of participants passed their exams, and we've saved $200K annually on cloud costs."
                </blockquote>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">100%</div>
                    <div className="text-sm text-gray-600">Certification Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">$200K</div>
                    <div className="text-sm text-gray-600">Annual Savings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-gray-600">IT Professionals</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setShowEnrollmentDialog(true)}
              >
                <Users className="h-5 w-5 mr-2" />
                Join Our Success Stories
              </Button>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Team?</h2>
              <p className="text-xl mb-8 opacity-90">
                Invest in your team's future with industry-leading training programs designed for real-world success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  onClick={() => setShowEnrollmentDialog(true)}
                >
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Start Training Program
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                  onClick={() => setShowConsultationDialog(true)}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Consultation Dialog */}
      <Dialog open={showConsultationDialog} onOpenChange={setShowConsultationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Free Training Consultation</DialogTitle>
            <DialogDescription>
              Get personalized training recommendations for your team and organization.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="consult-name">Full Name *</Label>
                <Input 
                  id="consult-name" 
                  placeholder="John Doe" 
                  value={consultationForm.name}
                  onChange={(e) => setConsultationForm({...consultationForm, name: e.target.value})}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="consult-email">Email *</Label>
                <Input 
                  id="consult-email" 
                  type="email" 
                  placeholder="john@company.com" 
                  value={consultationForm.email}
                  onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="consult-company">Company</Label>
              <Input 
                id="consult-company" 
                placeholder="Company Name" 
                value={consultationForm.company}
                onChange={(e) => setConsultationForm({...consultationForm, company: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="consult-team-size">Team Size</Label>
              <Select value={consultationForm.teamSize} onValueChange={(value) => setConsultationForm({...consultationForm, teamSize: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent className="z-[9999] relative" side="bottom" align="start">
                  <SelectItem value="1-10">1-10 people</SelectItem>
                  <SelectItem value="11-50">11-50 people</SelectItem>
                  <SelectItem value="51-200">51-200 people</SelectItem>
                  <SelectItem value="200+">200+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="consult-needs">Training Needs</Label>
              <Textarea
                id="consult-needs"
                placeholder="What skills or technologies does your team need to learn?"
                value={consultationForm.trainingNeeds}
                onChange={(e) => setConsultationForm({...consultationForm, trainingNeeds: e.target.value})}
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowConsultationDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
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
                  
                  // Store data for recommendations page
                  const recommendationData = {
                    name: consultationForm.name,
                    email: consultationForm.email,
                    company: consultationForm.company,
                    projectType: "training-consultation",
                    timeline: "consultation",
                    budget: "consultation",
                    features: `Training consultation, ${consultationForm.teamSize || 'Team'}, ${consultationForm.trainingNeeds || 'Professional development'}`,
                    description: `Training consultation request: ${consultationForm.trainingNeeds || 'Professional development and team training'} | Team Size: ${consultationForm.teamSize || 'To be determined'}`
                  };
                  
                  sessionStorage.setItem('projectRecommendationData', JSON.stringify(recommendationData));
                  
                  // Show success toast
                  toast({
                    title: "Consultation Requested!",
                    description: "Redirecting to your personalized training recommendations...",
                  });
                  
                  // Reset form and close dialog
                  setConsultationForm({
                    name: "",
                    email: "",
                    company: "",
                    teamSize: "",
                    trainingNeeds: ""
                  });
                  setShowConsultationDialog(false);
                  
                  // Navigate to recommendations page
                  setTimeout(() => {
                    navigate('/it-services/project-recommendations');
                  }, 1500);
                }}
              >
                Request Consultation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Enrollment Dialog */}
      <Dialog open={showEnrollmentDialog} onOpenChange={setShowEnrollmentDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
              Training Program Enrollment
            </DialogTitle>
            <DialogDescription>
              Tell us about your training needs and we'll design a custom program for your team.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="enroll-name">Full Name *</Label>
                <Input
                  id="enroll-name"
                  value={enrollmentForm.name}
                  onChange={(e) => setEnrollmentForm({...enrollmentForm, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="enroll-email">Email Address *</Label>
                <Input
                  id="enroll-email"
                  type="email"
                  value={enrollmentForm.email}
                  onChange={(e) => setEnrollmentForm({...enrollmentForm, email: e.target.value})}
                  placeholder="john@company.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="enroll-company">Company Name *</Label>
                <Input
                  id="enroll-company"
                  value={enrollmentForm.company}
                  onChange={(e) => setEnrollmentForm({...enrollmentForm, company: e.target.value})}
                  placeholder="Your Company Ltd"
                />
              </div>
              <div>
                <Label htmlFor="enroll-position">Your Position</Label>
                <Input
                  id="enroll-position"
                  value={enrollmentForm.position}
                  onChange={(e) => setEnrollmentForm({...enrollmentForm, position: e.target.value})}
                  placeholder="Training Manager"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="enroll-training">Training Type</Label>
                <Select value={enrollmentForm.trainingType} onValueChange={(value) => setEnrollmentForm({...enrollmentForm, trainingType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select training type" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] relative" side="bottom" align="start">
                    <SelectItem value="azure-aws-cisco">Certified Technical Workshops (Azure/AWS/Cisco)</SelectItem>
                    <SelectItem value="it-literacy">End-User IT Literacy Programs</SelectItem>
                    <SelectItem value="bootcamp">Custom In-House Bootcamps</SelectItem>
                    <SelectItem value="mentorship">Mentorship & Internship Placement</SelectItem>
                    <SelectItem value="train-trainer">Train-the-Trainer Programs</SelectItem>
                    <SelectItem value="custom">Custom Training Solution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="enroll-participants">Number of Participants</Label>
                <Select value={enrollmentForm.participants} onValueChange={(value) => setEnrollmentForm({...enrollmentForm, participants: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group size" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] relative" side="bottom" align="start">
                    <SelectItem value="1-5">1-5 participants</SelectItem>
                    <SelectItem value="6-15">6-15 participants</SelectItem>
                    <SelectItem value="16-25">16-25 participants</SelectItem>
                    <SelectItem value="26-50">26-50 participants</SelectItem>
                    <SelectItem value="50+">50+ participants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="enroll-experience">Team Experience Level</Label>
                <Select value={enrollmentForm.experience} onValueChange={(value) => setEnrollmentForm({...enrollmentForm, experience: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] relative" side="bottom" align="start">
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                    <SelectItem value="mixed">Mixed Experience Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="enroll-timeline">Preferred Timeline</Label>
                <Select value={enrollmentForm.timeline} onValueChange={(value) => setEnrollmentForm({...enrollmentForm, timeline: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] relative" side="bottom" align="start">
                    <SelectItem value="asap">ASAP (1-2 weeks)</SelectItem>
                    <SelectItem value="1-month">Within 1 month</SelectItem>
                    <SelectItem value="1-3-months">1-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="enroll-budget">Budget Range</Label>
              <Select value={enrollmentForm.budget} onValueChange={(value) => setEnrollmentForm({...enrollmentForm, budget: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent className="z-[9999] relative" side="bottom" align="start">
                  <SelectItem value="under-10k">Under $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k+">$100,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="enroll-goals">Training Goals & Requirements</Label>
              <Textarea
                id="enroll-goals"
                value={enrollmentForm.goals}
                onChange={(e) => setEnrollmentForm({...enrollmentForm, goals: e.target.value})}
                placeholder="Describe your team's current skills, learning objectives, specific technologies you want to focus on, and any special requirements..."
                rows={4}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEnrollmentDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={(e) => {
                  e.preventDefault();
                  
                  // Validate required fields
                  if (!enrollmentForm.name || !enrollmentForm.email || !enrollmentForm.company) {
                    toast({
                      title: "Missing Information",
                      description: "Please fill in your name, email, and company name.",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  // Email validation
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(enrollmentForm.email)) {
                    toast({
                      title: "Invalid Email",
                      description: "Please enter a valid email address.",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  // Store data for recommendations page
                  const recommendationData = {
                    name: enrollmentForm.name,
                    email: enrollmentForm.email,
                    company: enrollmentForm.company,
                    projectType: "training-capacity-building",
                    timeline: enrollmentForm.timeline,
                    budget: enrollmentForm.budget,
                    features: `${enrollmentForm.trainingType || 'Training program'}, ${enrollmentForm.participants || 'Team training'}, ${enrollmentForm.experience || 'Professional development'}`,
                    description: `${enrollmentForm.goals || 'Technical training and capacity building program'} | Position: ${enrollmentForm.position || 'Training coordinator'} | Experience Level: ${enrollmentForm.experience || 'Mixed'}`
                  };
                  
                  sessionStorage.setItem('projectRecommendationData', JSON.stringify(recommendationData));
                  
                  // Show success toast
                  toast({
                    title: "Training Program Enrollment Submitted!",
                    description: `Redirecting to your personalized training recommendations...`,
                  });
                  
                  // Reset form and close dialog
                  setEnrollmentForm({
                    name: "",
                    email: "",
                    company: "",
                    position: "",
                    trainingType: "",
                    participants: "",
                    experience: "",
                    timeline: "",
                    budget: "",
                    goals: ""
                  });
                  setShowEnrollmentDialog(false);
                  
                  // Navigate to recommendations page
                  setTimeout(() => {
                    navigate('/it-services/project-recommendations');
                  }, 1500);
                }}
              >
                Submit Enrollment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}