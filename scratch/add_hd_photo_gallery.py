import os

home_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\farm\home.tsx"

with open(home_path, "r", encoding="utf-8") as f:
    content = f.read()

gallery_component = '''
              {/* OPERATIONAL FIELD PHOTO GALLERY SHOWCASE (HIGH DEFINITION CLARITY) */}
              <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentic Agribusiness Operations Gallery</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">High-definition operational photography from TOTAG agricultural estates</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                    5 Active Field Sites
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { title: "Digital Agronomy & GIS", img: "/images/hero/farm_agronomist_gis.jpg", tag: "Field Mapping" },
                    { title: "Cocoa Pod Harvest", img: "/images/hero/farm_cocoa_harvest.jpg", tag: "Tree Crops" },
                    { title: "Paddy Rice Harvest", img: "/images/hero/farm_rice_paddy.jpg", tag: "Community Outgrower" },
                    { title: "Pepper Harvest Grading", img: "/images/hero/farm_pepper_sorting.jpg", tag: "Horticulture" },
                    { title: "Organic Row Crops", img: "/images/hero/farm_vegetable_field.jpg", tag: "Soil Cultivation" }
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
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">{item.tag}</span>
                        <span className="text-xs font-black text-white truncate block">{item.title}</span>
                        <span className="text-[8px] text-slate-300 font-semibold block mt-0.5 group-hover:text-amber-400 transition-colors">Click for Full-Res HD ↗</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
'''

target_marker = '              {/* SECTION: SEED-TO-SHELF PUBLIC BATCH PROVENANCE VERIFIER */}'

if target_marker in content:
    content = content.replace(target_marker, gallery_component + "\n\n" + target_marker)
    with open(home_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added Operational Field Photo Gallery Showcase successfully!")
else:
    print("Warning: target_marker not found in home.tsx!")
