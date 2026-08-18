import os

catering_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering.tsx"

with open(catering_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace root div className
content = content.replace(
    '<div className="min-h-screen bg-gray-50">',
    '<div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">'
)

# Replace old hero & old navbar section with standardized SubsidiaryHeroCarousel & TabsList
old_hero_and_nav = '''      <SubsidiaryHeroCarousel
        badge="TOTAG Subsidiary • Institutional & Event Hospitality"
        titleHighlight="Catering & Events Services"
        subtitle="Premier institutional culinary management, corporate event catering, luxury banquet spreads, and professional event coordination across West Africa."
        slides={[
          { url: "/images/catering/catering_ballroom_luxury.jpg", caption: "TOCEPS Luxury Grand Ballroom & Crystal Centerpiece Setup" },
          { url: "/images/catering/catering_gala_canopy.jpg", caption: "State Banquet & Wedding Gala Draped Canopy Venue" },
          { url: "/images/catering/catering_navy_banquet.jpg", caption: "Corporate Executive Summit & Formal Dinner Reception" },
          { url: "/images/catering/catering_gold_hall.jpg", caption: "Grand Illuminated Celebration Hall & Gold Accents" },
          { url: "/images/catering/catering_buffet_setting.jpg", caption: "Premium Gourmet Buffet Line & Fine Tableware Service" }
        ]}
        stats={[
          { label: "Events Served", value: "850+" },
          { label: "Meals Daily", value: "5,000+" },
          { label: "Client Rating", value: "4.9 / 5.0" }
        ]}
      />

      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <div className="flex space-x-4 lg:space-x-8 overflow-x-auto">
              {[
                { id: "overview", label: "Overview" },
                { id: "services", label: "Services" },
                { id: "food-safety", label: "Food Safety" },
                { id: "menus", label: "Menus" },
                { id: "gallery", label: "Gallery" },
                { id: "contact", label: "Contact" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-tab={tab.id}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 border-gray-300 ml-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/catering/ops/login">
              <Button variant="outline" size="sm" className="bg-red-600 hover:bg-red-700 text-white border-0 ml-2">
                Staff Portal
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">'''

new_hero_and_nav = '''      <main className="pb-20">
        
        {/* Standardized Photo Carousel Hero Section */}
        <section className="mb-10">
          <SubsidiaryHeroCarousel
            badge="TOTAG Subsidiary • Institutional & Event Hospitality"
            titleHighlight="Catering & Events Services"
            subtitle="Premier institutional culinary management, corporate event catering, luxury banquet spreads, HACCP food safety compliance, and professional venue coordination across West Africa."
            slides={[
              { url: "/images/catering/catering_ballroom_luxury.jpg", caption: "TOCEPS Luxury Grand Ballroom & Crystal Centerpiece Setup" },
              { url: "/images/catering/catering_gala_canopy.jpg", caption: "State Banquet & Wedding Gala Draped Canopy Venue" },
              { url: "/images/catering/catering_navy_banquet.jpg", caption: "Corporate Executive Summit & Formal Dinner Reception" },
              { url: "/images/catering/catering_gold_hall.jpg", caption: "Grand Illuminated Celebration Hall & Gold Accents" },
              { url: "/images/catering/catering_buffet_setting.jpg", caption: "Premium Gourmet Buffet Line & Fine Tableware Service" }
            ]}
            stats={[
              { label: "Events Served", value: "850+" },
              { label: "Meals Daily", value: "5,000+" },
              { label: "Client Rating", value: "4.9 / 5.0" }
            ]}
          />
        </section>

        {/* Standardized Platform Navigation Tabs Bar */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full max-w-5xl mx-auto h-auto p-1.5 bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl backdrop-blur-xl shadow-lg">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Overview</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="services"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Services</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="food-safety"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>Food Safety</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="menus"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Menus</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="gallery"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Gallery</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="contact"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-slate-700 dark:text-slate-300 font-bold rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contact & Quote</span>
                </TabsTrigger>
              </TabsList>
            </div>'''

if old_hero_and_nav in content:
    content = content.replace(old_hero_and_nav, new_hero_and_nav)
    print("Replaced hero & nav section successfully!")
else:
    print("Warning: old_hero_and_nav not found!")

with open(catering_path, "w", encoding="utf-8") as f:
    f.write(content)
