import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Calendar,
  ChefHat,
  Leaf,
  Fish,
  Cookie,
  UtensilsCrossed,
  Star,
  CheckCircle,
  Download
} from "lucide-react";
import cateringLogo from "@assets/Logo for TOTAG Catering1(1)_1752602584482.png";
import specialtyBg from "@assets/Event5_1752617755647.jpg";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function SpecialtyMenusPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const menuCategories = [
    {
      title: "International Cuisine",
      description: "Authentic flavors from around the world",
      icon: UtensilsCrossed,
      specialties: ["Italian: Fresh pasta and authentic sauces", "Asian: Sushi, stir-fry, and dim sum", "Mediterranean: Grilled meats and fresh vegetables", "Mexican: Authentic tacos and traditional sides", "French: Classic techniques and refined presentation", "Indian: Traditional spices and curry dishes"]
    },
    {
      title: "Dietary Accommodations",
      description: "Specialized menus for all dietary needs",
      icon: Leaf,
      specialties: ["Vegetarian and vegan options", "Gluten-free and celiac-safe dishes", "Keto and low-carb selections", "Dairy-free and lactose intolerant", "Nut-free and allergy-conscious", "Diabetic-friendly and low-sugar"]
    },
    {
      title: "Gourmet Selections",
      description: "Premium ingredients and sophisticated preparation",
      icon: Star,
      specialties: ["Wagyu beef and premium steaks", "Fresh seafood and shellfish", "Artisanal cheese and charcuterie", "Truffle and luxury ingredients", "Wine-paired multi-course dining", "Chef's tasting menu experiences"]
    },
    {
      title: "Comfort Classics",
      description: "Elevated versions of beloved favorites",
      icon: Cookie,
      specialties: ["Gourmet mac and cheese variations", "Artisan grilled cheese and soups", "Premium burger and sandwich bar", "Elevated BBQ and smokehouse", "Comfort food mashups", "Nostalgic desserts with modern twists"]
    }
  ];

  const featuredMenus = [
    {
      name: "Farm-to-Table Experience",
      description: "Seasonal menu featuring locally sourced ingredients",
      price: "$45/person",
      courses: 4,
      highlights: ["Locally sourced vegetables", "Grass-fed meats", "Artisan bread", "Seasonal desserts"]
    },
    {
      name: "Mediterranean Feast",
      description: "Fresh and healthy Mediterranean-inspired dining",
      price: "$38/person",
      courses: 3,
      highlights: ["Olive oil tastings", "Fresh seafood", "Traditional mezze", "Baklava dessert"]
    },
    {
      name: "Asian Fusion Journey",
      description: "Modern interpretations of classic Asian dishes",
      price: "$42/person",
      courses: 5,
      highlights: ["Sushi and sashimi", "Dim sum variety", "Wok-tossed specialties", "Green tea desserts"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Background */}
      <header 
        className="relative bg-cover bg-center bg-no-repeat shadow-sm border-b"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${specialtyBg})`,
          minHeight: '200px'
        }}
        onLoad={() => console.log('Specialty menus image loaded successfully')}
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
                alt="TOTAG Catering & Specialty Menus" 
                className="w-[100px] h-[100px] object-contain"
              />
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-4xl font-bold text-white mb-2">Specialty Menus</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Curated culinary experiences featuring unique flavors and dietary accommodations
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
            Exceptional Culinary Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            From international cuisine to dietary accommodations, our specialty menus showcase culinary expertise 
            and attention to detail that transforms any event into a memorable dining experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700"
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
                  title: "Custom Menu Planning",
                  description: "Let's design your perfect specialty menu...",
                });
              }}
            >
              <ChefHat className="h-5 w-5 mr-2" />
              Request Custom Menu
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                const menuCollection = `
TOTAG SPECIALTY MENUS COMPLETE COLLECTION

INTERNATIONAL CUISINE SPECIALTIES:

ITALIAN MENU COLLECTION:
Antipasti Selection:
- Bruschetta trio with tomato, olive tapenade, and ricotta
- Antipasto platter with cured meats, cheeses, and olives
- Caprese skewers with fresh mozzarella and basil

Primi Piatti (First Courses):
- Handmade pasta with seasonal sauces
- Risotto with wild mushrooms and truffle oil
- Italian wedding soup with homemade meatballs

Secondi Piatti (Main Courses):
- Osso buco with saffron risotto
- Chicken saltimbocca with prosciutto and sage
- Seafood cioppino with crusty bread

Dolci (Desserts):
- Traditional tiramisu
- Cannoli with sweet ricotta filling
- Panna cotta with berry compote

ASIAN FUSION MENU:
Appetizers:
- Pot stickers with ginger soy dipping sauce
- Fresh spring rolls with peanut sauce
- Miso glazed eggplant bites

Sushi Station:
- California rolls and spicy tuna rolls
- Salmon and tuna sashimi selection
- Vegetarian rolls with cucumber and avocado

Main Dishes:
- Teriyaki glazed salmon with jasmine rice
- Kung pao chicken with cashews
- Vegetable pad thai with tofu

Desserts:
- Green tea ice cream
- Mango sticky rice
- Fortune cookies with custom messages

MEDITERRANEAN FEAST:
Mezze Platters:
- Hummus, baba ganoush, and tzatziki with pita
- Dolmas and marinated olives
- Feta and olive tapenade

Grilled Specialties:
- Lamb kebabs with herb marinade
- Grilled branzino with lemon and herbs
- Vegetarian moussaka

Sides and Salads:
- Greek village salad with feta
- Tabbouleh with fresh herbs
- Roasted vegetables with olive oil

DIETARY ACCOMMODATION MENUS:

VEGAN MENU SELECTION:
Appetizers:
- Stuffed mushroom caps with quinoa
- Roasted red pepper hummus
- Vegetable crudité with tahini dip

Main Courses:
- Lentil walnut loaf with mushroom gravy
- Stuffed bell peppers with wild rice
- Eggplant parmesan with cashew cheese

Desserts:
- Chocolate avocado mousse
- Coconut milk panna cotta
- Fresh fruit tart with almond crust

GLUTEN-FREE MENU OPTIONS:
Starters:
- Stuffed portobello mushrooms
- Shrimp cocktail with cocktail sauce
- Caprese salad with balsamic reduction

Entrees:
- Grilled salmon with quinoa pilaf
- Herb-crusted chicken with roasted vegetables
- Risotto with seasonal vegetables

Desserts:
- Flourless chocolate cake
- Fresh berry parfait
- Coconut macaroons

KETO-FRIENDLY SELECTIONS:
Appetizers:
- Bacon-wrapped scallops
- Cheese and charcuterie board
- Stuffed avocados with crab

Main Dishes:
- Grilled ribeye with compound butter
- Salmon with cauliflower mash
- Chicken thighs with green beans

Low-Carb Desserts:
- Sugar-free cheesecake
- Chocolate fat bombs
- Berry and cream parfait

GOURMET PREMIUM MENUS:

LUXURY DINING EXPERIENCE:
Amuse-Bouche:
- Caviar and crème fraîche on potato chips
- Duck liver mousse on brioche
- Oyster shooters with mignonette

First Course:
- Lobster bisque with cognac cream
- Foie gras with fig compote
- Tuna tartare with avocado

Second Course:
- Wagyu beef tenderloin with truffle sauce
- Chilean sea bass with saffron beurre blanc
- Rack of lamb with herb crust

Dessert Course:
- Chocolate soufflé with gold leaf
- Crème brûlée with vanilla bean
- Fresh fruit tart with pastry cream

CHEF'S TASTING MENU (7 COURSES):
1. Amuse-bouche: Surprise from the chef
2. Crudo: Fresh raw fish preparation
3. Soup: Seasonal soup with local ingredients
4. Pasta: Handmade pasta with signature sauce
5. Fish: Fresh catch with complementary sides
6. Meat: Premium cut with seasonal vegetables
7. Dessert: Multi-component dessert creation

COMFORT FOOD ELEVATED:

GOURMET MAC AND CHEESE BAR:
Base Options:
- Classic cheddar and gruyere
- Truffle and wild mushroom
- Bacon and jalapeño

Toppings:
- Breadcrumb varieties (panko, herb, parmesan)
- Protein additions (lobster, short rib, chicken)
- Vegetable mix-ins (roasted tomatoes, caramelized onions)

ARTISAN GRILLED CHEESE STATION:
Bread Options:
- Sourdough, brioche, whole grain
- Gluten-free options available

Cheese Selections:
- Aged cheddar, brie, goat cheese
- Swiss, provolone, smoked gouda

Add-ons:
- Applewood bacon, roasted peppers
- Caramelized onions, fresh herbs
- Tomato, avocado, arugula

SPECIALTY BEVERAGE PAIRINGS:
Wine Selections:
- Curated wine list for each menu
- Professional sommelier service
- Wine education and tasting notes

Craft Cocktails:
- Menu-specific signature drinks
- Premium spirits and fresh mixers
- Non-alcoholic specialty mocktails

Coffee and Tea Service:
- Artisan coffee bar with skilled baristas
- Premium tea selection with proper service
- After-dinner liqueurs and digestifs

PRICING GUIDE:
- International Cuisine: $32-48 per person
- Dietary Accommodations: $28-42 per person
- Gourmet Premium: $55-85 per person
- Comfort Food Elevated: $25-35 per person

All menus include:
- Professional chef preparation
- Service staff and coordination
- Table setup and presentation
- Dietary modification capabilities

Contact Information:
Phone: (555) 123-4567
Email: specialtymenus@totag-group.com
Website: totag-group.com/catering/specialty-menus

Custom menu development available for unique dietary needs and cultural preferences.
                `;
                
                const blob = new Blob([menuCollection], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'TOTAG-Specialty-Menus-Collection.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                toast({
                  title: "Menu Collection Downloaded",
                  description: "Complete specialty menus collection with international cuisine, dietary accommodations, and gourmet options has been saved.",
                });
              }}
            >
              <Download className="h-5 w-5 mr-2" />
              Download Menu Collection
            </Button>
          </div>
        </motion.div>

        {/* Menu Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {menuCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <category.icon className="h-5 w-5 text-orange-600" />
                    </div>
                    {category.title}
                  </CardTitle>
                  <p className="text-gray-600">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.specialties.map((specialty, specialtyIndex) => (
                      <div key={specialtyIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Featured Menus */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Menu Packages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Popular specialty menu combinations that showcase our culinary expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMenus.map((menu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{menu.name}</CardTitle>
                      <Badge variant="secondary">{menu.courses} courses</Badge>
                    </div>
                    <p className="text-gray-600">{menu.description}</p>
                    <div className="text-2xl font-bold text-orange-600">{menu.price}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {menu.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-start space-x-2">
                          <Star className="h-4 w-4 text-orange-600 mt-0.5 fill-current" />
                          <span className="text-sm text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dietary Accommodations Detail */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Dietary Accommodations</CardTitle>
            <p className="text-center text-gray-600">We cater to all dietary needs and restrictions</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="allergies" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="allergies">Allergies</TabsTrigger>
                <TabsTrigger value="dietary">Dietary</TabsTrigger>
                <TabsTrigger value="religious">Religious</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
              </TabsList>
              <TabsContent value="allergies" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-3">Common Allergies We Accommodate:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Nut and peanut allergies</li>
                      <li>• Shellfish and seafood allergies</li>
                      <li>• Dairy and lactose intolerance</li>
                      <li>• Gluten and wheat allergies</li>
                      <li>• Egg allergies</li>
                      <li>• Soy allergies</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Safety Protocols:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Separate preparation areas</li>
                      <li>• Dedicated cooking utensils</li>
                      <li>• Clear labeling systems</li>
                      <li>• Staff allergy training</li>
                      <li>• Emergency action plans</li>
                      <li>• Guest communication protocols</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="dietary" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-3">Plant-Based Options:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Vegan and vegetarian menus</li>
                      <li>• Raw food preparations</li>
                      <li>• Organic and locally sourced</li>
                      <li>• Plant-based protein alternatives</li>
                      <li>• Dairy-free cheese and milk options</li>
                      <li>• Egg-free baking alternatives</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Special Diets:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Ketogenic and low-carb</li>
                      <li>• Paleo and Whole30</li>
                      <li>• Mediterranean diet</li>
                      <li>• Low-sodium preparations</li>
                      <li>• High-protein options</li>
                      <li>• Anti-inflammatory foods</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="religious" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-3">Religious Dietary Laws:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Kosher meal preparation</li>
                      <li>• Halal certified options</li>
                      <li>• Hindu vegetarian requirements</li>
                      <li>• Buddhist vegan preparations</li>
                      <li>• Jain dietary restrictions</li>
                      <li>• Christian fasting accommodations</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Certification and Oversight:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Certified kosher supervision</li>
                      <li>• Halal certification verification</li>
                      <li>• Religious authority consultation</li>
                      <li>• Proper ingredient sourcing</li>
                      <li>• Preparation method compliance</li>
                      <li>• Documentation and tracking</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="medical" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-3">Medical Dietary Needs:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Diabetic-friendly low sugar</li>
                      <li>• Heart-healthy low sodium</li>
                      <li>• Kidney diet restrictions</li>
                      <li>• GERD and acid reflux safe</li>
                      <li>• Pureed and soft texture</li>
                      <li>• Liquid diet preparations</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Medical Consultation:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Nutritionist consultation</li>
                      <li>• Doctor-approved modifications</li>
                      <li>• Medication interaction awareness</li>
                      <li>• Calorie and portion control</li>
                      <li>• Nutrient density optimization</li>
                      <li>• Medical emergency preparedness</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Create Your Custom Menu?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Our executive chefs work with you to design the perfect specialty menu that meets your event requirements 
              and exceeds your guests' expectations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700"
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
                Discuss Menu Options
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  toast({
                    title: "Chef Consultation",
                    description: "A culinary specialist will contact you within 24 hours to discuss your menu preferences.",
                  });
                }}
              >
                <ChefHat className="h-5 w-5 mr-2" />
                Schedule Chef Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}