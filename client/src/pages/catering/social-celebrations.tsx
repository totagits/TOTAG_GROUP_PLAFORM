import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Calendar,
  Users,
  Gift,
  Heart,
  Star,
  CheckCircle,
  Camera,
  Music,
  Cake
} from "lucide-react";
const cateringLogo = "/images/totag-logo.png";
import socialEventBg from "@assets/Event4_1752617755646.jpg";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function SocialCelebrationsPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const celebrations = [
    {
      title: "Birthday Celebrations",
      description: "Memorable birthday parties for all ages",
      icon: Cake,
      features: ["Custom themed decorations", "Age-appropriate entertainment", "Birthday cake and desserts", "Photo booth setup", "Party favor coordination", "Timeline management"]
    },
    {
      title: "Anniversary Parties",
      description: "Romantic celebrations of love and commitment",
      icon: Heart,
      features: ["Elegant romantic décor", "Memory display coordination", "Special anniversary cake", "Music from your era", "Guest book alternatives", "Professional photography"]
    },
    {
      title: "Graduation Celebrations",
      description: "Honor academic achievements with style",
      icon: Star,
      features: ["School colors and themes", "Achievement displays", "Graduate recognition", "Family-style dining", "Photo opportunities", "Keepsake coordination"]
    },
    {
      title: "Holiday Gatherings",
      description: "Festive celebrations for any season",
      icon: Gift,
      features: ["Seasonal decorations", "Holiday-themed menus", "Traditional and modern dishes", "Gift exchange coordination", "Family entertainment", "Cultural traditions honored"]
    }
  ];

  const partyTypes = [
    {
      type: "Intimate Gatherings",
      guests: "10-30 people",
      setting: "Home or small venue",
      style: "Personal and cozy atmosphere"
    },
    {
      type: "Family Celebrations",
      guests: "30-75 people",
      setting: "Private venue or garden",
      style: "Warm and welcoming environment"
    },
    {
      type: "Grand Celebrations",
      guests: "75-200 people",
      setting: "Event hall or large venue",
      style: "Elegant and festive atmosphere"
    }
  ];

  const menuOptions = [
    "Comfort food favorites and family recipes",
    "International cuisine stations",
    "Dessert bars and custom cakes",
    "Cocktail receptions with passed hors d'oeuvres",
    "Buffet-style dining with variety",
    "Family-style sharing platters"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Background */}
      <header 
        className="relative bg-cover bg-center bg-no-repeat shadow-sm border-b"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${socialEventBg})`,
          minHeight: '200px'
        }}
        onLoad={() => console.log('Social celebrations image loaded successfully')}
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
                alt="TOTAG Catering & Social Celebrations" 
                className="w-[100px] h-[100px] object-contain"
              />
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-4xl font-bold text-white mb-2">Social Celebrations</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Creating joyful memories for life's special moments and milestones
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
            Celebrate Life's Special Moments
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            From intimate birthday parties to grand anniversary celebrations, we create personalized experiences 
            that bring families and friends together with exceptional food and thoughtful service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-pink-600 hover:bg-pink-700"
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
                toast({
                  title: "Celebration Planning",
                  description: "Let's plan your special celebration together...",
                });
              }}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Plan Your Celebration
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                const celebrationIdeas = `
TOTAG SOCIAL CELEBRATIONS INSPIRATION GUIDE

BIRTHDAY CELEBRATION IDEAS:

Children's Birthday Parties (Ages 3-12):
- Themed parties: Superhero, Princess, Animal Safari, Space Adventure
- Interactive entertainment: Magic shows, face painting, games
- Kid-friendly menu: Mini sandwiches, fruit kabobs, themed cupcakes
- Party favors and take-home treats

Teen Birthday Celebrations (Ages 13-17):
- Modern themes: Music festival, Sports, Gaming, Social media
- Age-appropriate activities: DJ, photo booth, gaming stations
- Trendy food: Taco bar, pizza party, dessert buffet
- Social media-worthy decorations and backdrops

Adult Birthday Parties (18+):
- Elegant themes: Vintage, Garden party, Cocktail celebration
- Sophisticated entertainment: Live music, wine tasting, dancing
- Gourmet menu options: Appetizer stations, signature cocktails
- Milestone birthday specialties (30th, 40th, 50th, etc.)

ANNIVERSARY CELEBRATION CONCEPTS:

1st-10th Anniversaries:
- Romantic dinner parties with close friends and family
- Recreate wedding menu favorites
- Photo timeline displays of relationship milestones
- Dancing to "your song" and wedding playlist

25th Silver Anniversary:
- Silver-themed decorations and table settings
- Renewal of vows ceremony with reception
- Memory lane photo displays and guest stories
- Classic menu from your wedding era

50th Golden Anniversary:
- Golden elegance with formal dining
- Multi-generational family gathering
- Legacy celebration with family traditions
- Live music from the couple's courtship era

GRADUATION CELEBRATION IDEAS:

High School Graduation:
- School colors and spirit decorations
- Future goals and college celebration
- Scholarship and achievement recognition
- Young adult menu preferences

College Graduation:
- Professional celebration marking career beginning
- Academic achievement displays
- Network building with family and mentors
- Sophisticated menu with international options

Graduate School/Advanced Degrees:
- Professional networking celebration
- Academic field-specific themes
- Career milestone recognition
- Elegant reception-style gathering

HOLIDAY GATHERING CONCEPTS:

Traditional Holiday Celebrations:
- Thanksgiving: Family-style dining with traditional favorites
- Christmas: Festive decorations with seasonal menu
- Easter: Spring celebration with brunch options
- New Year's: Countdown party with champagne service

Cultural Holiday Celebrations:
- Customize decorations and menu to honor traditions
- Include traditional foods and customs
- Accommodate dietary and religious requirements
- Create inclusive celebration atmosphere

PARTY SIZE RECOMMENDATIONS:

Intimate Celebrations (10-30 guests):
- Home setting or private dining room
- Personal service and attention to detail
- Family-style or plated service
- Cozy atmosphere with personal touches

Medium Celebrations (30-75 guests):
- Private venue or event space
- Buffet or station-style service
- Mixed seating arrangements
- Balance of formal and casual elements

Large Celebrations (75+ guests):
- Event hall or large venue space
- Multiple food stations and bars
- Entertainment and activity zones
- Professional coordination required

MENU PLANNING TIPS:
- Consider guest ages and dietary preferences
- Balance familiar favorites with new experiences
- Plan for dietary restrictions and allergies
- Include special celebration cake or dessert
- Coordinate beverage service for all ages

DECORATION AND AMBIANCE:
- Color schemes that match the celebration theme
- Lighting to create appropriate mood
- Photo displays and memory sharing
- Music playlist that fits the crowd and occasion
- Special seating for guests of honor

Contact TOTAG Catering to plan your perfect social celebration:
Phone: (555) 123-4567
Email: celebrations@totag-group.com
Website: totag-group.com/catering/social-celebrations
                `;
                
                const blob = new Blob([celebrationIdeas], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'TOTAG-Social-Celebrations-Ideas.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                toast({
                  title: "Celebration Ideas Downloaded",
                  description: "Comprehensive celebration planning guide with themes and ideas has been saved to your downloads.",
                });
              }}
            >
              <Gift className="h-5 w-5 mr-2" />
              Download Ideas Guide
            </Button>
          </div>
        </motion.div>

        {/* Celebration Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {celebrations.map((celebration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <celebration.icon className="h-5 w-5 text-pink-600" />
                    </div>
                    {celebration.title}
                  </CardTitle>
                  <p className="text-gray-600">{celebration.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {celebration.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Party Size Options */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Celebration Sizes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We accommodate celebrations of all sizes with appropriate venues and service styles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partyTypes.map((party, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-xl text-pink-600">{party.type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2">
                        <Users className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{party.guests}</span>
                      </div>
                      <p className="text-sm text-gray-600">{party.setting}</p>
                      <p className="text-sm text-gray-700 italic">{party.style}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Menu Highlights */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Popular Menu Options</CardTitle>
            <p className="text-center text-gray-600">Delicious food options perfect for social celebrations</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuOptions.map((option, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Celebration Packages</h2>
          <p className="text-xl mb-8 opacity-90">
            Affordable celebration catering starting from $20 per person
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Essential Package</h3>
              <div className="text-3xl font-bold mb-4">$20<span className="text-lg">/person</span></div>
              <ul className="text-sm space-y-2">
                <li>• Buffet-style service</li>
                <li>• Basic decorations</li>
                <li>• 2-hour service</li>
              </ul>
            </div>
            <div className="bg-white/20 rounded-lg p-6 border-2 border-white/30">
              <h3 className="text-xl font-semibold mb-2">Deluxe Package</h3>
              <div className="text-3xl font-bold mb-4">$35<span className="text-lg">/person</span></div>
              <ul className="text-sm space-y-2">
                <li>• Station-style dining</li>
                <li>• Themed decorations</li>
                <li>• 4-hour full service</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Premium Package</h3>
              <div className="text-3xl font-bold mb-4">$55<span className="text-lg">/person</span></div>
              <ul className="text-sm space-y-2">
                <li>• Plated service</li>
                <li>• Custom decorations</li>
                <li>• Full-day coordination</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Celebrate Together</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Every celebration is unique, and we're here to make yours unforgettable with personalized service and attention to detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-pink-600 hover:bg-pink-700"
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
                Start Planning
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  navigate('/catering');
                  setTimeout(() => {
                    const galleryTab = document.querySelector('[data-tab="gallery"]') as HTMLElement;
                    if (galleryTab) {
                      galleryTab.click();
                    }
                  }, 100);
                }}
              >
                <Camera className="h-5 w-5 mr-2" />
                View Celebration Gallery
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}