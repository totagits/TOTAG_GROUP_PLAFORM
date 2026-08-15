import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Award,
  Clock,
  Users,
  CheckCircle,
  Star,
  Calendar,
  BookOpen,
  Target,
  TrendingUp
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CertifiedTechnicalWorkshopsPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false);
  
  const [enrollmentForm, setEnrollmentForm] = useState({
    name: "",
    email: "",
    company: "",
    position: "",
    certification: "",
    experience: "",
    timeline: "",
    budget: "",
    goals: ""
  });

  const certificationTracks = [
    {
      title: "Microsoft Azure Certification Track",
      description: "Complete certification pathway from fundamentals to advanced Azure solutions",
      icon: "🔷",
      duration: "3-5 days per level",
      levels: ["AZ-900 Fundamentals", "AZ-104 Administrator", "AZ-303/304 Solutions Architect"],
      features: [
        "Hands-on Azure Portal training",
        "Virtual machine and storage management",
        "Azure networking and security",
        "DevOps and monitoring solutions",
        "Practice exams and labs",
        "Official Microsoft materials"
      ]
    },
    {
      title: "Amazon AWS Certification Track",
      description: "Comprehensive AWS training from cloud practitioner to professional level",
      icon: "🟠",
      duration: "2-5 days per level",
      levels: ["Cloud Practitioner", "Solutions Architect Associate", "Solutions Architect Professional"],
      features: [
        "AWS Console and CLI training",
        "EC2, S3, and RDS management",
        "VPC networking and security groups",
        "Lambda and serverless architecture",
        "Real-world project scenarios",
        "AWS official training materials"
      ]
    },
    {
      title: "Cisco Networking Certification Track",
      description: "Professional networking certifications for enterprise infrastructure",
      icon: "🔵",
      duration: "5-10 days per level",
      levels: ["CCNA", "CCNP Enterprise", "CCIE"],
      features: [
        "Network fundamentals and protocols",
        "Routing and switching configuration",
        "Network security and troubleshooting",
        "Wireless and automation technologies",
        "Hands-on lab equipment",
        "Cisco official curriculum"
      ]
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Industry Recognition",
      description: "Gain globally recognized certifications that validate your expertise"
    },
    {
      icon: TrendingUp,
      title: "Career Advancement",
      description: "Boost your earning potential and unlock new career opportunities"
    },
    {
      icon: BookOpen,
      title: "Expert Instruction",
      description: "Learn from certified professionals with real-world experience"
    },
    {
      icon: Target,
      title: "High Success Rate",
      description: "95% of our participants pass their certification exams on first attempt"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/it-services/training-capacity-building">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Training
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Certified Technical Workshops</h1>
                <p className="text-gray-600">Industry-leading certification programs for Azure, AWS, and Cisco technologies</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Master Cloud Technologies with Official Certifications
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Accelerate your career with hands-on training and official certifications from Microsoft Azure, 
            Amazon AWS, and Cisco. Our expert-led workshops ensure you're ready for real-world challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setShowEnrollmentDialog(true)}
            >
              <Award className="h-5 w-5 mr-2" />
              Enroll in Certification Track
            </Button>
            <Button variant="outline" size="lg">
              <Calendar className="h-5 w-5 mr-2" />
              View Schedule
            </Button>
          </div>
        </motion.div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Certification Tracks */}
        <div className="space-y-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certification Tracks</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive certification pathways designed to take you from beginner to expert.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {certificationTracks.map((track, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-4xl">{track.icon}</div>
                      <div>
                        <CardTitle className="text-xl">{track.title}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {track.duration}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{track.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Certification Levels:</h4>
                        <div className="space-y-1">
                          {track.levels.map((level, levelIndex) => (
                            <Badge key={levelIndex} variant="outline" className="mr-2 mb-1">
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">What You'll Learn:</h4>
                        <div className="space-y-2">
                          {track.features.slice(0, 4).map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                      onClick={() => setShowEnrollmentDialog(true)}
                    >
                      Select This Track
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Success Statistics */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Proven Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">First-time Pass Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-lg opacity-90">Professionals Certified</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">35%</div>
              <div className="text-lg opacity-90">Average Salary Increase</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Certified?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have advanced their careers with our certification programs.
            </p>
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setShowEnrollmentDialog(true)}
            >
              <Star className="h-5 w-5 mr-2" />
              Start Your Certification Journey
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Enrollment Dialog */}
      <Dialog open={showEnrollmentDialog} onOpenChange={setShowEnrollmentDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-600" />
              Certification Track Enrollment
            </DialogTitle>
            <DialogDescription>
              Choose your certification path and we'll design a customized training program for you.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cert-name">Full Name *</Label>
                <Input
                  id="cert-name"
                  value={enrollmentForm.name}
                  onChange={(e) => setEnrollmentForm({...enrollmentForm, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="cert-email">Email Address *</Label>
                <Input
                  id="cert-email"
                  type="email"
                  value={enrollmentForm.email}
                  onChange={(e) => setEnrollmentForm({...enrollmentForm, email: e.target.value})}
                  placeholder="john@company.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cert-company">Company Name *</Label>
                <Input
                  id="cert-company"
                  value={enrollmentForm.company}
                  onChange={(e) => setEnrollmentForm({...enrollmentForm, company: e.target.value})}
                  placeholder="Your Company Ltd"
                />
              </div>
              <div>
                <Label htmlFor="cert-position">Your Position</Label>
                <Input
                  id="cert-position"
                  value={enrollmentForm.position}
                  onChange={(e) => setEnrollmentForm({...enrollmentForm, position: e.target.value})}
                  placeholder="IT Professional"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cert-certification">Certification Track</Label>
                <Select value={enrollmentForm.certification} onValueChange={(value) => setEnrollmentForm({...enrollmentForm, certification: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select certification track" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] relative" side="bottom" align="start">
                    <SelectItem value="azure">Microsoft Azure Track</SelectItem>
                    <SelectItem value="aws">Amazon AWS Track</SelectItem>
                    <SelectItem value="cisco">Cisco Networking Track</SelectItem>
                    <SelectItem value="multiple">Multiple Tracks</SelectItem>
                    <SelectItem value="custom">Custom Certification Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cert-experience">Current Experience Level</Label>
                <Select value={enrollmentForm.experience} onValueChange={(value) => setEnrollmentForm({...enrollmentForm, experience: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] relative" side="bottom" align="start">
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                    <SelectItem value="expert">Expert (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cert-timeline">Preferred Timeline</Label>
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
              <div>
                <Label htmlFor="cert-budget">Budget Range</Label>
                <Select value={enrollmentForm.budget} onValueChange={(value) => setEnrollmentForm({...enrollmentForm, budget: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] relative" side="bottom" align="start">
                    <SelectItem value="under-5k">Under $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10k-20k">$10,000 - $20,000</SelectItem>
                    <SelectItem value="20k-50k">$20,000 - $50,000</SelectItem>
                    <SelectItem value="50k+">$50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="cert-goals">Certification Goals & Requirements</Label>
              <Textarea
                id="cert-goals"
                value={enrollmentForm.goals}
                onChange={(e) => setEnrollmentForm({...enrollmentForm, goals: e.target.value})}
                placeholder="Describe your certification goals, current skills, specific technologies you want to focus on, and any timeline constraints..."
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
                    projectType: "certified-technical-workshops",
                    timeline: enrollmentForm.timeline,
                    budget: enrollmentForm.budget,
                    features: `${enrollmentForm.certification || 'Certification track'}, ${enrollmentForm.experience || 'Professional training'}, Azure/AWS/Cisco`,
                    description: `${enrollmentForm.goals || 'Professional certification training program'} | Position: ${enrollmentForm.position || 'IT Professional'} | Experience Level: ${enrollmentForm.experience || 'Mixed'}`
                  };
                  
                  sessionStorage.setItem('projectRecommendationData', JSON.stringify(recommendationData));
                  
                  // Show success toast
                  toast({
                    title: "Certification Enrollment Submitted!",
                    description: `Redirecting to your personalized certification recommendations...`,
                  });
                  
                  // Reset form and close dialog
                  setEnrollmentForm({
                    name: "",
                    email: "",
                    company: "",
                    position: "",
                    certification: "",
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