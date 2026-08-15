import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Target,
  Users,
  Calendar,
  Lightbulb,
  TrendingUp,
  Shield,
  Code,
  Database,
  Globe
} from "lucide-react";

interface RecommendationData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  timeline: string;
  budget: string;
  features: string;
  description: string;
}

export default function ProjectRecommendationsPage() {
  const [location] = useLocation();
  const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null);
  
  useEffect(() => {
    // Get data from URL parameters or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const storedData = sessionStorage.getItem('projectRecommendationData');
    
    if (storedData) {
      setRecommendationData(JSON.parse(storedData));
      // Clear the data after use for security
      sessionStorage.removeItem('projectRecommendationData');
    }
  }, []);

  // Budget-based recommendation system
  const getBudgetRecommendation = (budget: string, projectType: string, timeline: string) => {
    const recommendations = {
      "under-25k": {
        suitable: ["web-app", "mobile-app"],
        features: ["Basic functionality", "Standard UI/UX", "Essential integrations", "Basic security", "Responsive design"],
        examples: ["Simple business website", "Basic mobile app", "Small e-commerce site", "Portfolio website", "Landing pages"],
        limitations: ["Limited custom features", "Basic scalability", "Standard third-party integrations", "Limited concurrent users"],
        timeline: "1-3 months typically optimal",
        teamSize: "2-4 developers",
        technologies: ["React", "Node.js", "WordPress", "Shopify", "Basic hosting"],
        deliverables: ["Source code", "Basic documentation", "Deployment guide", "3 months support"]
      },
      "25k-50k": {
        suitable: ["web-app", "mobile-app", "ecommerce", "crm"],
        features: ["Advanced functionality", "Custom UI/UX", "Multiple integrations", "Enhanced security", "Basic analytics", "Admin dashboard"],
        examples: ["Advanced web application", "Feature-rich mobile app", "Small CRM system", "E-commerce platform", "Business management tools"],
        limitations: ["Moderate scalability", "Limited enterprise features", "Basic reporting capabilities"],
        timeline: "3-6 months recommended",
        teamSize: "4-6 developers",
        technologies: ["React/Vue", "Node.js/Django", "PostgreSQL", "AWS/Azure", "Payment gateways"],
        deliverables: ["Full source code", "Detailed documentation", "Testing suite", "6 months support", "Training materials"]
      },
      "50k-100k": {
        suitable: ["web-app", "mobile-app", "ecommerce", "crm", "integration"],
        features: ["Complex functionality", "Premium UI/UX", "Advanced integrations", "High security", "Advanced analytics", "Multi-platform support", "API development"],
        examples: ["Complex web platform", "Multi-platform mobile app", "Advanced CRM", "Enterprise e-commerce", "Integration platforms"],
        limitations: ["Some enterprise limitations", "Moderate concurrent users", "Limited AI/ML features"],
        timeline: "6-12 months optimal",
        teamSize: "6-10 developers",
        technologies: ["React/Angular", "Microservices", "Cloud infrastructure", "Advanced databases", "CI/CD pipelines"],
        deliverables: ["Enterprise-grade code", "Comprehensive docs", "Automated testing", "12 months support", "Performance monitoring"]
      },
      "100k-250k": {
        suitable: ["crm", "erp", "hrmis", "enterprise", "integration", "ecommerce"],
        features: ["Enterprise functionality", "Custom architecture", "Advanced integrations", "Enterprise security", "Comprehensive analytics", "High scalability", "Multi-location support"],
        examples: ["Enterprise CRM", "Manufacturing ERP", "Advanced HRMIS", "Large e-commerce platform", "Multi-system integration"],
        limitations: ["May require phased implementation", "Complex deployment requirements"],
        timeline: "6-12+ months recommended",
        teamSize: "10-15 developers",
        technologies: ["Enterprise frameworks", "Cloud-native architecture", "Advanced security", "Big data solutions", "AI/ML integration"],
        deliverables: ["Enterprise solution", "Full documentation suite", "Training program", "24/7 support", "Maintenance plan"]
      },
      "250k+": {
        suitable: ["erp", "hrmis", "enterprise", "integration"],
        features: ["Full enterprise suite", "Custom architecture", "Complex integrations", "Enterprise-grade security", "Advanced analytics", "Unlimited scalability", "Multi-location support", "AI/ML capabilities"],
        examples: ["Complete ERP system", "Enterprise HRMIS", "Complex integration platform", "Multi-system architecture", "Industry-specific solutions"],
        limitations: ["None - full enterprise capability"],
        timeline: "12+ months typical",
        teamSize: "15+ developers",
        technologies: ["Cutting-edge tech stack", "Distributed systems", "Advanced AI/ML", "Enterprise security", "Global infrastructure"],
        deliverables: ["Complete enterprise solution", "Executive documentation", "Comprehensive training", "Dedicated support team", "Strategic consulting"]
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

  if (!recommendationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Recommendation Data Found</h2>
            <p className="text-gray-600 mb-4">Please submit an estimate request to view your personalized recommendations.</p>
            <Link href="/it-services/custom-software">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Custom Software
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recommendation = getBudgetRecommendation(recommendationData.budget, recommendationData.projectType, recommendationData.timeline);
  const budgetFormatted = recommendationData.budget.replace('-', ' - ').replace('k', ',000').replace('+', '+');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/it-services/custom-software">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Custom Software
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Recommendations</h1>
                <p className="text-gray-600">Personalized analysis for {recommendationData.name}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Request ID: {Date.now().toString().slice(-8)}</div>
              <div className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-bold">{budgetFormatted}</div>
                  <div className="text-sm opacity-80">Budget Range</div>
                </div>
                <div className="text-center">
                  <Code className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-bold">{recommendationData.projectType.toUpperCase()}</div>
                  <div className="text-sm opacity-80">Project Type</div>
                </div>
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl font-bold">{recommendationData.timeline || 'Flexible'}</div>
                  <div className="text-sm opacity-80">Timeline</div>
                </div>
                <div className="text-center">
                  {recommendation?.isProjectSuitable ? 
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-300" /> : 
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                  }
                  <div className="text-2xl font-bold">{recommendation?.recommendation}</div>
                  <div className="text-sm opacity-80">Compatibility</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compatibility Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-600" />
                    Project Compatibility Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendation?.isProjectSuitable ? (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">Excellent Match!</span>
                      </div>
                      <p className="text-green-700">
                        Your {recommendationData.projectType} project aligns perfectly with your {budgetFormatted} budget. 
                        This combination allows for a robust solution with the features and quality you expect.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="font-semibold text-yellow-800">Consider Alternatives</span>
                      </div>
                      <p className="text-yellow-700 mb-3">
                        Your budget may be better suited for these project types: <strong>{recommendation?.suitable.join(', ')}</strong>
                      </p>
                      <p className="text-yellow-700">
                        We can still work on your preferred project type, but it may require a phased approach or adjusted scope.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Features & Capabilities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                    Features & Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendation?.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Example Applications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Example Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendation?.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-gray-900">{example}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Technology Stack */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-blue-600" />
                    Recommended Technology Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recommendation?.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Client</div>
                    <div>{recommendationData.name}</div>
                    {recommendationData.company && (
                      <div className="text-sm text-gray-600">{recommendationData.company}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Contact</div>
                    <div className="text-sm">{recommendationData.email}</div>
                  </div>
                  {recommendationData.features && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">Key Features Requested</div>
                      <div className="text-sm">{recommendationData.features}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Timeline & Team */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Timeline & Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Recommended Timeline</div>
                    <div className="text-lg font-semibold">{recommendation?.timeline}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Team Size</div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{recommendation?.teamSize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Deliverables */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Deliverables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recommendation?.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-blue-800">
                    <div>✓ Review this comprehensive analysis</div>
                    <div>✓ We'll send detailed proposal within 48 hours</div>
                    <div>✓ Schedule a consultation to discuss specifics</div>
                    <div>✓ Finalize project scope and timeline</div>
                  </div>
                  <Link href="/it-services/custom-software">
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      Schedule Consultation
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Limitations Section */}
        {recommendation?.limitations[0] !== "None - full enterprise capability" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Important Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendation?.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-yellow-800">{limitation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}