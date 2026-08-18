import os, re

header_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\components\header.tsx"

with open(header_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make top-right login button context-aware
old_auth_button = '''          {/* Quick Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <button 
              onClick={() => handleNavClick("/admin-login")}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl px-4 py-2 shadow-lg cursor-pointer transition-all"
            >
              Admin Login
            </button>
          </div>'''

new_auth_button = '''          {/* Quick Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {location.startsWith("/farm") ? (
              <button 
                onClick={() => handleNavClick("/farm/login")}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black rounded-xl px-4 py-2 shadow-lg cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Staff Login</span>
              </button>
            ) : (
              <button 
                onClick={() => handleNavClick("/admin-login")}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl px-4 py-2 shadow-lg cursor-pointer transition-all"
              >
                Admin Login
              </button>
            )}
          </div>'''

if "LogIn" not in content:
  content = content.replace("  Sparkles\n} from \"lucide-react\";", "  Sparkles,\n  LogIn\n} from \"lucide-react\";")

content = content.replace(old_auth_button, new_auth_button)

with open(header_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated Header.tsx with context-aware Staff Login button!")
