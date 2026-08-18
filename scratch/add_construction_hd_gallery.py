import os

construction_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\construction.tsx"

with open(construction_path, "r", encoding="utf-8") as f:
    content = f.read()

gallery_component = '''
        {/* AUTHENTIC CIVIL ENGINEERING & CONSTRUCTION PHOTOGRAPHY GALLERY SHOWCASE (HIGH DEFINITION CLARITY) */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentic Construction & Civil Engineering Gallery</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High-definition site photography from TOTAG General Construction projects</p>
                </div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-500 text-[10px] font-bold">
                5 Active Sites
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { title: "Modern Architectural Villa", img: "/images/construction/construction_modern_villa_pool.png", tag: "Luxury Residential" },
                { title: "Rebar Deep Foundation", img: "/images/construction/construction_rebar_foundation.jpg", tag: "Civil Engineering" },
                { title: "Column Formwork Erection", img: "/images/construction/construction_column_formwork.png", tag: "Structural Concrete" },
                { title: "Completed Townhouse Complex", img: "/images/construction/construction_townhouses_completed.jpg", tag: "Multi-Family Housing" },
                { title: "Master-Planned Estate", img: "/images/construction/construction_housing_estate.png", tag: "Estate Earthworks" }
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
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">{item.tag}</span>
                    <span className="text-xs font-black text-white truncate block">{item.title}</span>
                    <span className="text-[8px] text-slate-300 font-semibold block mt-0.5 group-hover:text-amber-400 transition-colors">Click for Full-Res HD ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
'''

target_marker = '{/* 1. Heavy Equipment Fleet Rental Booking Portal */}'

if target_marker in content:
    content = content.replace(target_marker, gallery_component + "\n\n        " + target_marker)
    with open(construction_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added Construction HD Gallery Showcase successfully!")
else:
    print("Warning: target_marker not found in construction.tsx!")
