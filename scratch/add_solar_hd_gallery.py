import os

solar_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\solar.tsx"

with open(solar_path, "r", encoding="utf-8") as f:
    content = f.read()

gallery_component = '''
        {/* AUTHENTIC SOLAR EPC INSTALLATION PHOTOGRAPHY GALLERY SHOWCASE (HIGH DEFINITION CLARITY) */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentic Solar EPC & Inverter Installations Gallery</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High-definition solar engineering & power room installation photography from TOTAG sites</p>
                </div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-500 text-[10px] font-bold">
                5 EPC Microgrids
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { title: "Senior Engineer & Dual Deye", img: "/images/solar/solar_engineer_deye_inverter.jpg", tag: "Power Room NOC" },
                { title: "Deye Hybrid Power Room", img: "/images/solar/solar_deye_inverter_room.jpg", tag: "Lithium Bank & AC/DC" },
                { title: "Rooftop Commercial PV", img: "/images/solar/solar_roof_installation_green.jpg", tag: "Green Metal Roof Mount" },
                { title: "Residential Array Mount", img: "/images/solar/solar_roof_installation_blue.jpg", tag: "Blue Metallic Roof" },
                { title: "PV Module Engineers", img: "/images/solar/solar_techs_mounting_panels.jpg", tag: "High-Efficiency PV" }
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

target_marker = '{/* MODULE 1: Solar CRM, Leads & Opportunity Management */}'

if target_marker in content:
    content = content.replace(target_marker, gallery_component + "\n\n            " + target_marker)
    with open(solar_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added Solar HD Gallery Showcase successfully!")
else:
    print("Warning: target_marker not found in solar.tsx!")
