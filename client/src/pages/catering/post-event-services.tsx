import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Calendar,
  Trash2,
  Camera,
  FileText,
  Heart,
  Star,
  CheckCircle,
  Gift,
  Award
} from "lucide-react";
const cateringLogo = "/images/totag-logo.png";
import postEventBg from "@assets/Event2_1752617755646.jpg";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function PostEventServicesPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const postEventServices = [
    {
      title: "Cleanup & Breakdown",
      description: "Complete venue restoration and equipment removal",
      icon: Trash2,
      features: ["Full venue cleanup", "Equipment breakdown", "Waste management", "Table and chair removal", "Kitchen cleanup", "Venue restoration"]
    },
    {
      title: "Photography & Documentation",
      description: "Professional event photography and memory preservation",
      icon: Camera,
      features: ["Professional event photography", "Guest candid photos", "Food presentation shots", "Venue decoration photos", "Digital gallery delivery", "Photo editing and enhancement"]
    },
    {
      title: "Thank You Services",
      description: "Guest appreciation and follow-up coordination",
      icon: Heart,
      features: ["Thank you card coordination", "Guest feedback collection", "Gift arrangement and delivery", "Follow-up communication", "Special occasion reminders", "Anniversary planning"]
    },
    {
      title: "Event Analysis & Reports",
      description: "Comprehensive event evaluation and insights",
      icon: FileText,
      features: ["Event success metrics", "Guest satisfaction analysis", "Budget breakdown reports", "Vendor performance review", "Improvement recommendations", "Future planning insights"]
    }
  ];

  const servicePackages = [
    {
      name: "Essential Post-Event",
      price: "$150 flat fee",
      includes: ["Basic cleanup supervision", "Equipment breakdown", "Waste removal", "Final venue check"]
    },
    {
      name: "Complete Post-Event",
      price: "$350 flat fee", 
      includes: ["Full cleanup service", "Photography package", "Thank you coordination", "Basic event report"]
    },
    {
      name: "Premium Post-Event",
      price: "$600 flat fee",
      includes: ["Comprehensive cleanup", "Professional photography", "Guest appreciation services", "Detailed analysis report", "Future planning session"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header 
        className="relative bg-cover bg-center bg-no-repeat shadow-sm border-b"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${postEventBg})`,
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
                alt="TOTAG Post-Event Services" 
                className="w-[100px] h-[100px] object-contain"
              />
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-4xl font-bold text-white mb-2">Post-Event Services</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Complete event wrap-up services ensuring lasting memories and hassle-free cleanup
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
            Comprehensive Event Wrap-Up
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            After your successful event, we handle everything from cleanup to memory preservation, 
            ensuring you can focus on cherishing the moments while we take care of the details.
          </p>
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700"
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
            <FileText className="h-5 w-5 mr-2" />
            Plan Post-Event Services
          </Button>
        </motion.div>

        {/* Post-Event Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {postEventServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <service.icon className="h-5 w-5 text-green-600" />
                    </div>
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Post-Event Packages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the level of post-event support that best suits your needs and budget
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
                <Card className={`h-full ${index === 1 ? 'border-green-300 bg-green-50' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-green-600">{pkg.price}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pkg.includes.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
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

        {/* Cleanup Process */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Cleanup Process</CardTitle>
            <p className="text-center text-gray-600">Systematic approach to venue restoration</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Guest Area Cleanup</h3>
                <p className="text-sm text-gray-600">Clear tables, collect linens, remove decorations</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Kitchen & Service</h3>
                <p className="text-sm text-gray-600">Deep clean kitchen equipment and service areas</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Equipment Breakdown</h3>
                <p className="text-sm text-gray-600">Pack and remove all catering equipment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Final Inspection</h3>
                <p className="text-sm text-gray-600">Ensure venue is restored to original condition</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Preservation */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Preserve Your Memories</h2>
          <p className="text-xl mb-8 opacity-90">
            Professional photography and documentation services to capture every special moment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <Camera className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Professional Photos</h3>
              <p className="text-sm opacity-90">High-quality photography throughout your event</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <Gift className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Digital Gallery</h3>
              <p className="text-sm opacity-90">Organized online gallery for easy sharing</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <Award className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Custom Albums</h3>
              <p className="text-sm opacity-90">Professional photo albums and keepsakes</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Event Experience</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let us handle the post-event details so you can relax and enjoy the memories you've created.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700"
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
                Include Post-Event Services
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const postEventGuide = `
TOTAG POST-EVENT SERVICES COMPREHENSIVE GUIDE

CLEANUP & BREAKDOWN SERVICES:

VENUE RESTORATION CHECKLIST:
Guest Areas:
□ Clear all tables and remove linens
□ Pack chairs and table equipment
□ Remove centerpieces and decorations
□ Vacuum/sweep dining areas
□ Clean restroom facilities
□ Remove trash and recycling

Kitchen and Service Areas:
□ Deep clean all cooking equipment
□ Sanitize food preparation surfaces
□ Pack catering equipment and utensils
□ Clean serving stations and bars
□ Remove food storage containers
□ Final kitchen inspection

Equipment Breakdown:
□ Disassemble temporary structures
□ Pack audio/visual equipment
□ Remove lighting installations
□ Transport rented equipment
□ Inventory all items
□ Return security deposits

PHOTOGRAPHY & DOCUMENTATION:

PROFESSIONAL PHOTOGRAPHY PACKAGE:
Event Coverage:
- Arrival and setup documentation
- Guest interactions and candid moments
- Food presentation and service
- Entertainment and activities
- Special moments and speeches
- Departure and farewell shots

Photo Delivery Options:
- Digital gallery within 48 hours
- High-resolution downloads available
- Professional photo editing included
- Custom photo albums and prints
- Social media ready formats
- USB drives with full collection

Video Documentation:
- Event highlight reel creation
- Speech and toast recordings
- Time-lapse setup and breakdown
- Guest message compilation
- Live streaming documentation
- Anniversary video creation

THANK YOU & FOLLOW-UP SERVICES:

GUEST APPRECIATION:
Thank You Cards:
- Custom design and printing
- Personalized messages
- Photo inclusion from event
- Mailing coordination
- Address verification
- Delivery confirmation

Gift Coordination:
- Welcome gift arrangement
- Appreciation gift selection
- Corporate branding inclusion
- Packaging and presentation
- Delivery scheduling
- Thank you note inclusion

Follow-Up Communication:
- Guest satisfaction surveys
- Event feedback collection
- Photo sharing coordination
- Future event reminders
- Relationship maintenance
- Special occasion tracking

EVENT ANALYSIS & REPORTING:

COMPREHENSIVE EVENT REPORTS:
Success Metrics:
- Guest attendance analysis
- Menu popularity statistics
- Service timing evaluation
- Budget variance analysis
- Vendor performance review
- Overall satisfaction scores

Guest Feedback Analysis:
- Survey response compilation
- Comment categorization
- Satisfaction rating analysis
- Improvement recommendation
- Trend identification
- Follow-up action items

Financial Reporting:
- Final budget breakdown
- Cost per guest analysis
- Vendor payment reconciliation
- Tax documentation
- Expense categorization
- ROI analysis for corporate events

FUTURE PLANNING INSIGHTS:
Recommendations:
- Menu optimization suggestions
- Service improvement opportunities
- Cost reduction strategies
- Guest experience enhancements
- Vendor relationship insights
- Timeline refinements

Planning Tools:
- Event planning checklist
- Vendor contact database
- Timeline templates
- Budget planning guides
- Guest list management
- Anniversary reminders

POST-EVENT SERVICE PACKAGES:

ESSENTIAL PACKAGE ($150):
Included Services:
- Basic cleanup supervision
- Equipment breakdown coordination
- Waste removal management
- Final venue inspection
- Equipment inventory check
- Basic photo collection

Timeline: 2-4 hours post-event

COMPLETE PACKAGE ($350):
Included Services:
- Full cleanup service
- Professional photography (50+ photos)
- Thank you card coordination
- Guest feedback collection
- Basic event analysis report
- Digital photo gallery

Timeline: Same day + 1 week follow-up

PREMIUM PACKAGE ($600):
Included Services:
- Comprehensive cleanup
- Professional photography (100+ photos)
- Video highlight reel
- Guest appreciation services
- Detailed analysis report
- Future planning consultation
- Custom photo album
- Anniversary planning reminder

Timeline: Same day + 2 weeks follow-up

SPECIALIZED SERVICES:

Memory Preservation:
- Custom scrapbook creation
- Photo booth picture compilation
- Guest book digitization
- Social media content curation
- Anniversary video creation
- Time capsule coordination

Corporate Events:
- Client satisfaction reporting
- ROI analysis and metrics
- Brand exposure evaluation
- Lead generation tracking
- Networking outcome analysis
- Corporate relationship building

Social Events:
- Family photo coordination
- Recipe sharing from event
- Guest contact exchange
- Anniversary planning
- Gift tracking and thanks
- Memory sharing platforms

ENVIRONMENTAL RESPONSIBILITY:

Sustainable Cleanup:
- Eco-friendly cleaning products
- Waste reduction strategies
- Recycling coordination
- Compost program inclusion
- Donation of leftover food
- Sustainable disposal methods

Green Documentation:
- Digital-first photo delivery
- Paperless thank you options
- Electronic surveys and feedback
- Online gallery sharing
- Reduced printing where possible
- Environmental impact reporting

CONTACT INFORMATION:
Post-Event Services Coordinator: (555) 123-4567
Email: postevent@totag-group.com
Emergency Cleanup Line: (555) 987-6543
Photography Department: photos@totag-group.com

SCHEDULING:
- Post-event services must be booked with initial catering contract
- Emergency cleanup available 24/7
- Photography services require 48-hour advance notice
- Thank you services can be added up to 24 hours post-event
- Annual service packages available for recurring events

All post-event services include professional coordination and 24/7 support hotline.
                  `;
                  
                  const blob = new Blob([postEventGuide], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'TOTAG-Post-Event-Services-Guide.txt';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  
                  toast({
                    title: "Post-Event Guide Downloaded",
                    description: "Comprehensive post-event services guide with cleanup, photography, and follow-up details has been saved.",
                  });
                }}
              >
                <FileText className="h-5 w-5 mr-2" />
                Download Services Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}