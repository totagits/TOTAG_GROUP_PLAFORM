import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Calendar,
  Wine,
  Coffee,
  Grape,
  Martini,
  Users,
  CheckCircle,
  Clock,
  Award
} from "lucide-react";
const cateringLogo = "/images/totag-logo.png";
import beverageBg from "@assets/Event1_1752617755645.jpg";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function BeverageServicesPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const beverageServices = [
    {
      title: "Full Bar Service",
      description: "Professional bartenders with premium spirits",
      icon: Martini,
      features: ["Licensed professional bartenders", "Premium liquor selection", "Custom cocktail menu", "Bar setup and breakdown", "Glassware and equipment", "Responsible service protocols"]
    },
    {
      title: "Wine Service",
      description: "Curated wine selections with expert sommelier",
      icon: Wine,
      features: ["Wine pairings with menu", "Sommelier consultation", "Wine tasting experiences", "Premium wine selection", "Proper glassware service", "Educational wine presentations"]
    },
    {
      title: "Coffee & Tea Service",
      description: "Artisan coffee and premium tea selections",
      icon: Coffee,
      features: ["Professional barista service", "Espresso and specialty drinks", "Premium tea selection", "Hot and cold preparations", "Latte art and presentations", "Coffee station setup"]
    },
    {
      title: "Specialty Beverages",
      description: "Signature drinks and non-alcoholic options",
      icon: Grape,
      features: ["Custom signature cocktails", "Mocktails and virgin drinks", "Fresh juice preparations", "Smoothie and health drinks", "Themed beverage presentations", "Interactive drink stations"]
    }
  ];

  const servicePackages = [
    {
      name: "Essential Bar Package",
      price: "$8/person",
      duration: "4 hours",
      includes: ["Basic liquor selection", "Beer and wine", "Standard mixers", "Professional bartender"]
    },
    {
      name: "Premium Bar Package", 
      price: "$15/person",
      duration: "5 hours",
      includes: ["Top-shelf spirits", "Craft beer selection", "Premium wine list", "Signature cocktails", "Garnish station"]
    },
    {
      name: "Luxury Bar Experience",
      price: "$25/person", 
      duration: "6 hours",
      includes: ["Ultra-premium spirits", "Champagne service", "Wine sommelier", "Custom cocktail creation", "Interactive bartending"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header 
        className="relative bg-cover bg-center bg-no-repeat shadow-sm border-b"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${beverageBg})`,
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
                alt="TOTAG Beverage Services" 
                className="w-[100px] h-[100px] object-contain"
              />
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-4xl font-bold text-white mb-2">Beverage Services</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Professional beverage service with expert bartenders and premium selections
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
            Exceptional Beverage Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            From craft cocktails to wine pairings, our beverage service elevates every event with professional service and premium selections.
          </p>
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700"
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
            <Wine className="h-5 w-5 mr-2" />
            Plan Beverage Service
          </Button>
        </motion.div>

        {/* Service Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {beverageServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <service.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Service Packages */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Packages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our tiered beverage service packages designed for different event types and budgets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicePackages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className={`h-full ${index === 1 ? 'border-purple-300 bg-purple-50' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-purple-600">{pkg.price}</div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pkg.includes.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
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

        {/* Features */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Beverage Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 rounded-lg p-6">
              <Award className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Licensed Professionals</h3>
              <p className="text-sm opacity-90">Certified bartenders with responsible service training</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <Wine className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Premium Selection</h3>
              <p className="text-sm opacity-90">Top-shelf spirits and curated wine collections</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <Users className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Custom Service</h3>
              <p className="text-sm opacity-90">Tailored beverage menus for your specific event</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Enhance Your Event?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let our beverage specialists design the perfect drink menu and service for your event.
            </p>
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700"
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
              Request Beverage Consultation
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}