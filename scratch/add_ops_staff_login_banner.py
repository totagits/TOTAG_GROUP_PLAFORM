import os

home_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\farm\home.tsx"

with open(home_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add LogIn to lucide imports if needed
if "LogIn" not in content:
    content = content.replace("  Database,\n", "  Database,\n  LogIn,\n")

# Add staff login banner at top of operations-command tab
old_ops_tab = '<TabsContent value="operations-command" className="space-y-8">'

new_ops_tab = '''<TabsContent value="operations-command" className="space-y-8">
              
              {/* STAFF & WORKER ACCESS BANNER */}
              <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/20 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-xl text-white">TOTAG FARM Operations Command Center</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                        Staff & Worker Access
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                      Precision agronomy, PostGIS spatial field mapping, smart greenhouse fertigation, solar microgrid NOC, and livestock bio-telemetry.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <Button 
                    onClick={() => window.location.href = "/farm/login"}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black rounded-xl px-5 py-2.5 shadow-lg flex items-center space-x-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Open Staff Login Portal</span>
                  </Button>
                </div>
              </div>'''

content = content.replace(old_ops_tab, new_ops_tab)

with open(home_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Added Staff Login Banner to Enterprise Ops Command tab!")
