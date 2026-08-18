import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  ClipboardList,
  Headphones,
  Shield,
  CheckCircle,
  Phone,
  Settings
} from "lucide-react";
const cateringLogo = "/images/totag-logo.png";
import coordinationBg from "@assets/Event_1752617755645.jpg";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function OnsiteCoordinationPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const coordinationServices = [
    {
      title: "Event Setup & Management",
      description: "Complete event setup and real-time management",
      icon: Settings,
      features: ["Venue setup coordination", "Timeline management", "Vendor coordination", "Equipment management", "Last-minute adjustments", "Problem resolution"]
    },
    {
      title: "Service Staff Coordination",
      description: "Professional service team management",
      icon: Users,
      features: ["Service staff briefing", "Table service coordination", "Kitchen communication", "Guest assistance", "Special requests handling", "Professional presentation"]
    },
    {
      title: "Timeline Management",
      description: "Seamless event flow and scheduling",
      icon: Clock,
      features: ["Detailed event timeline", "Milestone coordination", "Speaker/entertainment timing", "Food service timing", "Break coordination", "Cleanup scheduling"]
    },
    {
      title: "Emergency Response",
      description: "Prepared for any situation that may arise",
      icon: Shield,
      features: ["Emergency action plans", "Medical emergency protocols", "Weather contingencies", "Equipment backup plans", "Communication systems", "Insurance coordination"]
    }
  ];

  const coordinationLevels = [
    {
      name: "Basic Coordination",
      price: "$200 flat fee",
      duration: "4-6 hours",
      includes: ["Setup supervision", "Basic timeline management", "Service coordination", "Cleanup oversight"]
    },
    {
      name: "Full Event Management",
      price: "$500 flat fee",
      duration: "8-12 hours",
      includes: ["Complete setup management", "Vendor coordination", "Timeline execution", "Problem resolution", "Guest assistance"]
    },
    {
      name: "Premium Coordination",
      price: "$800 flat fee",
      duration: "Full day",
      includes: ["Day-before setup", "Multiple coordinators", "VIP guest management", "Emergency response team", "Post-event breakdown"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header 
        className="relative bg-cover bg-center bg-no-repeat shadow-sm border-b"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${coordinationBg})`,
          minHeight: '200px'
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
              <img 
                src={cateringLogo} 
                alt="TOTAG Onsite Coordination" 
                className="w-[100px] h-[100px] object-contain"
              />
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-4xl font-bold text-white mb-2">Onsite Coordination</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Professional event coordination ensuring flawless execution from start to finish
              </p>
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
            Seamless Event Execution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our experienced coordination team ensures your event runs smoothly with professional oversight, 
            timeline management, and proactive problem-solving.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              navigate('/catering');
              setTimeout(() => {
                const contactTab = document.querySelector('[data-tab="contact"]') as HTMLElement;
                if (contactTab) {
                  contactTab.click();
                  setTimeout(() => {
                    const quoteButton = document.querySelector('button[data-quote-button="true"]') as HTMLElement;
                    if (quoteButton) {
                      quoteButton.click();
                    }
                  }, 200);
                }
              }, 300);
            }}
          >
            <ClipboardList className="h-5 w-5 mr-2" />
            Request Coordination Services
          </Button>
        </motion.div>

        {/* Coordination Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {coordinationServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <service.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Coordination Levels */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coordination Packages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the level of coordination support that matches your event needs and complexity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coordinationLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className={`h-full ${index === 1 ? 'border-blue-300 bg-blue-50' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{level.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">{level.price}</div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{level.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {level.includes.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Process Timeline */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Coordination Process</CardTitle>
            <p className="text-center text-gray-600">How we ensure your event runs smoothly</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Pre-Event Planning</h3>
                <p className="text-sm text-gray-600">Detailed timeline creation and vendor coordination meetings</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Setup Coordination</h3>
                <p className="text-sm text-gray-600">Oversee venue setup and equipment installation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Event Execution</h3>
                <p className="text-sm text-gray-600">Real-time management and problem resolution</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Post-Event</h3>
                <p className="text-sm text-gray-600">Cleanup coordination and vendor wrap-up</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Preparedness */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Always Prepared</h2>
          <p className="text-xl mb-8 opacity-90">
            Our coordination team is trained to handle any situation with professionalism and quick thinking
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <Shield className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Emergency Response</h3>
              <p className="text-sm opacity-90">Trained in emergency protocols and first aid</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <Phone className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Communication</h3>
              <p className="text-sm opacity-90">Constant communication with all vendors and staff</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <Headphones className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Technology</h3>
              <p className="text-sm opacity-90">Professional communication equipment and backup systems</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stress-Free Event Management</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Focus on enjoying your event while our professional coordinators handle all the details behind the scenes.
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                navigate('/catering');
                setTimeout(() => {
                  const contactTab = document.querySelector('[data-tab="contact"]') as HTMLElement;
                  if (contactTab) {
                    contactTab.click();
                    setTimeout(() => {
                      const quoteButton = document.querySelector('button[data-quote-button="true"]') as HTMLElement;
                      if (quoteButton) {
                        quoteButton.click();
                      }
                    }, 200);
                  }
                }, 300);
              }}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Coordination Consultation
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}