import os, re

catering_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering.tsx"

with open(catering_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace activeTab === "..." conditionals with <TabsContent value="...">
content = content.replace('{activeTab === "overview" && (', '<TabsContent value="overview" className="space-y-10">')
content = content.replace('{activeTab === "services" && (', '<TabsContent value="services" className="space-y-10">')
content = content.replace('{activeTab === "food-safety" && (', '<TabsContent value="food-safety" className="space-y-10">')
content = content.replace('{activeTab === "menus" && (', '<TabsContent value="menus" className="space-y-10">')
content = content.replace('{activeTab === "gallery" && (', '<TabsContent value="gallery" className="space-y-10">')
content = content.replace('{activeTab === "contact" && (', '<TabsContent value="contact" className="space-y-10">')

# Replace closing conditional braces before next tab or end of tabs
# In old code, conditionals ended with `)</motion.div>}` or `)}`
# Let's replace `</motion.div>\n        )}` or similar with `</motion.div>\n        </TabsContent>`

content = re.sub(r'</motion\.div>\s*\)\}', '</motion.div>\n        </TabsContent>', content)

# Close </Tabs></section></main>` before Footer
if '</Tabs>\n        </section>\n      </main>' not in content:
    content = content.replace(
        '<Footer />',
        '</Tabs>\n        </section>\n      </main>\n      <Footer />'
    )

# Inject HD Gallery Box at top of Overview tab
gallery_box = '''
          {/* AUTHENTIC CULINARY & EVENT PHOTOGRAPHY GALLERY SHOWCASE (HIGH DEFINITION CLARITY) */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4 shadow-xl mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentic Luxury Catering & Events Gallery</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High-definition event & banquet photography from TOCEPS catering setups</p>
                </div>
              </div>
              <Badge className="bg-red-500/20 text-red-500 text-[10px] font-bold">
                5 Luxury Venues
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { title: "Luxury Grand Ballroom", img: "/images/catering/catering_ballroom_luxury.jpg", tag: "Crystal Gala" },
                { title: "State Banquet Canopy", img: "/images/catering/catering_gala_canopy.jpg", tag: "Outdoor Gala" },
                { title: "Executive Summit Dining", img: "/images/catering/catering_navy_banquet.jpg", tag: "Formal Banquet" },
                { title: "Illuminated Celebration Hall", img: "/images/catering/catering_gold_hall.jpg", tag: "Gold Hall Setup" },
                { title: "Gourmet International Buffet", img: "/images/catering/catering_buffet_setting.jpg", tag: "Buffet Spread" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => window.open(item.img, '_blank')}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-950 aspect-video cursor-pointer shadow-md hover:shadow-2xl transition-all"
                >
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-2.5 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider block">{item.tag}</span>
                    <span className="text-xs font-black text-white truncate block">{item.title}</span>
                    <span className="text-[8px] text-slate-300 font-semibold block mt-0.5 group-hover:text-amber-400 transition-colors">Click for Full-Res HD ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
'''

target_overview_header = '<div className="text-center">'
if gallery_box not in content:
    content = content.replace(
        '<TabsContent value="overview" className="space-y-10">\n          <motion.div\n            initial={{ opacity: 0, y: 20 }}\n            animate={{ opacity: 1, y: 0 }}\n            transition={{ duration: 0.6 }}\n            className="space-y-12"\n          >',
        '<TabsContent value="overview" className="space-y-10">\n          <motion.div\n            initial={{ opacity: 0, y: 20 }}\n            animate={{ opacity: 1, y: 0 }}\n            transition={{ duration: 0.6 }}\n            className="space-y-12"\n          >\n' + gallery_box
    )

with open(catering_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Converted catering tabs to standardized platform layout!")
