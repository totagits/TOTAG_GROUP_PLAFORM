import os

stationery_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\stationery.tsx"

with open(stationery_path, "r", encoding="utf-8") as f:
    content = f.read()

gallery_component = '''
        {/* AUTHENTIC B2B STATIONERY & OFFICE SUPPLIES PHOTOGRAPHY GALLERY SHOWCASE (HIGH DEFINITION CLARITY) */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentic B2B Office Supplies & Stationery Gallery</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High-definition product photography from TOTAG Stationery Supplies inventory</p>
                </div>
              </div>
              <Badge className="bg-sky-500/20 text-sky-500 text-[10px] font-bold">
                5 Product Lines
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { title: "Office Essentials Set", img: "/images/stationery/stationery_office_supplies_set.png", tag: "Stationery Suite" },
                { title: "Desktop Organizer", img: "/images/stationery/stationery_desktop_organizer.png", tag: "Desk Accessories" },
                { title: "Double A Copy Box", img: "/images/stationery/stationery_double_a_box.png", tag: "A4 80gsm Paper" },
                { title: "Paper Ream Cartons", img: "/images/stationery/stationery_paper_cartons.png", tag: "Bulk Pallets" },
                { title: "Lever Arch Binders", img: "/images/stationery/stationery_lever_arch_binders.png", tag: "Archival Ring Files" }
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
                    <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block">{item.tag}</span>
                    <span className="text-xs font-black text-white truncate block">{item.title}</span>
                    <span className="text-[8px] text-slate-300 font-semibold block mt-0.5 group-hover:text-amber-400 transition-colors">Click for Full-Res HD ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
'''

target_marker = '{/* 1. B2B Stationery Bulk Procurement Catalog & Cart */}'

if target_marker in content:
    content = content.replace(target_marker, gallery_component + "\n\n        " + target_marker)
    with open(stationery_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added Stationery HD Gallery Showcase successfully!")
else:
    print("Warning: target_marker not found in stationery.tsx!")
