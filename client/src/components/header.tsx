import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  X, 
  ChevronDown, 
  LogIn, 
  ArrowLeft,
  Ship,
  Fuel,
  HardHat,
  ShoppingBag,
  Laptop,
  Utensils,
  Wheat,
  BookOpen,
  Sun,
  Shield,
  ChefHat
} from "lucide-react";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const official9Subsidiaries = [
    { name: "TOTAG Cargo Handling", href: "/cargo", tag: "Maritime & Global Freight", icon: Ship },
    { name: "TOTAG FARM", href: "/farm", tag: "Sustainable Agribusiness", icon: Wheat },
    { name: "TOTAG Petroleum Services", href: "/petroleum", tag: "Energy & Depot Haulage", icon: Fuel },
    { name: "TOTAG General Construction", href: "/construction", tag: "Civil & Infrastructure", icon: HardHat },
    { name: "TOTAG General Merchandise", href: "/general-merchandise", tag: "FMCG Wholesale & Retail", icon: ShoppingBag },
    { name: "TOTAG IT Services & SaaS", href: "/it-services", tag: "Enterprise Managed IT & FIMS", icon: Laptop },
    { name: "TOTAG Catering & Events (TOCEPS)", href: "/catering", tag: "Executive Banquets & UNIDO", icon: Utensils },
    { name: "TOTAG Stationery Supplies", href: "/stationery", tag: "Office & Scholastic Procurement", icon: BookOpen },
    { name: "TOTAG Solar Smart Power", href: "/solar", tag: "Microgrids & Deye Inverters", icon: Sun },
  ];

  const isSubPage = location !== "/" && location !== "/home";

  const handleGoHome = () => {
    setIsMenuOpen(false);
    setLocation("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("totag-play-intro"));
  };

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href === "/" || href === "/home" || href === "#home" || href === "#") {
      window.dispatchEvent(new CustomEvent("totag-play-intro"));
    }
    if (href.startsWith("#")) {
      if (isSubPage) {
        setLocation("/");
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 200);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } else {
      setLocation(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-xl shadow-2xl border-b border-white/10 py-2.5 text-white"
          : "bg-slate-950/75 backdrop-blur-lg border-b border-white/10 py-3 text-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Back Button */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div 
              onClick={handleGoHome}
              className="flex items-center space-x-3 group cursor-pointer py-1"
            >
              <img 
                src="/images/totag-logo.png" 
                alt="TOTAG Group Logo" 
                className="h-12 sm:h-14 w-auto object-contain hover:scale-105 transition-transform duration-200 bg-white/90 p-1 rounded-xl shadow-md" 
              />
              <div className="flex flex-col justify-center">
                <span className="text-base sm:text-lg font-black tracking-tight text-white leading-none">
                  <span className="text-emerald-400">TOTAG</span>{" "}
                  <span className="text-sky-400">Group</span>{" "}
                  <span className="text-xs font-bold text-amber-400 block sm:inline">of Companies Ltd</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-300 tracking-wide mt-0.5 hidden sm:block">
                  Innovating Tomorrow, Empowering Today
                </span>
              </div>
            </div>

            {/* Prominent Back Button on Subsidiary Pages */}
            {isSubPage && (
              <Button
                onClick={handleGoHome}
                size="sm"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-lg flex items-center space-x-1.5 transition-all cursor-pointer border border-amber-400"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Ecosystem Landing</span>
                <span className="sm:hidden">Back</span>
              </Button>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1.5 font-bold text-xs text-slate-200">
            <button
              onClick={() => handleNavClick("#home")}
              className="px-3 py-2 rounded-lg hover:text-emerald-400 hover:bg-white/10 transition-all cursor-pointer"
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick("#about")}
              className="px-3 py-2 rounded-lg hover:text-emerald-400 hover:bg-white/10 transition-all cursor-pointer"
            >
              About Us
            </button>

            <button
              onClick={() => handleNavClick("#services")}
              className="px-3 py-2 rounded-lg hover:text-emerald-400 hover:bg-white/10 transition-all cursor-pointer"
            >
              Services
            </button>

            {/* Subsidiaries Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:text-emerald-400 hover:bg-white/10 transition-all cursor-pointer text-amber-400">
                  <span>Subsidiaries</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 rounded-2xl text-white">
                <DropdownMenuLabel className="text-xs font-black uppercase tracking-wider text-amber-400 px-3 py-1.5">
                  Official Specialized Divisions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <div className="max-h-80 overflow-y-auto space-y-1">
                  {official9Subsidiaries.map((sub) => (
                    <DropdownMenuItem 
                      key={sub.href}
                      onSelect={() => {
                        handleNavClick(sub.href);
                      }}
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-400 cursor-pointer w-full"
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <sub.icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-bold block text-white">{sub.name}</span>
                          <span className="text-[10px] text-slate-400">{sub.tag}</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => handleNavClick("#contact")}
              className="px-3 py-2 rounded-lg hover:text-emerald-400 hover:bg-white/10 transition-all cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* DEDICATED PORTAL-RESTRICTED AUTH ACTIONS */}
          <div className="hidden lg:flex items-center space-x-3">
            {location.startsWith("/farm") ? (
              // Dedicated FARM Staff Login
              <button 
                onClick={() => handleNavClick("/farm/login")}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black rounded-xl px-4 py-2 shadow-lg cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <Wheat className="w-3.5 h-3.5" />
                <span>FARM Staff Portal</span>
              </button>
            ) : location.startsWith("/catering") ? (
              // Dedicated TOCEPS Catering Operations Login
              <button 
                onClick={() => handleNavClick("/catering/ops/login")}
                className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white text-xs font-black rounded-xl px-4 py-2 shadow-lg cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Catering Operations Login</span>
              </button>
            ) : location.startsWith("/it-services") || location.startsWith("/saas") ? (
              // Dedicated IT & SaaS Console
              <button 
                onClick={() => handleNavClick("/saas")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-xs font-black rounded-xl px-4 py-2 shadow-lg cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>IT & SaaS Console</span>
              </button>
            ) : (
              // Main Public Corporate Login (Direct Admin Login - No Multi-Portal Clutter)
              <button 
                onClick={() => handleNavClick("/admin-login")}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl px-4 py-2 shadow-lg cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Corporate Staff Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:bg-white/10"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-4 py-6 space-y-4 shadow-2xl text-white">
          <div className="flex flex-col space-y-2 font-bold text-sm">
            {isSubPage && (
              <button onClick={handleGoHome} className="text-left px-4 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Ecosystem Main Landing</span>
              </button>
            )}
            <button onClick={() => handleNavClick("#home")} className="text-left px-4 py-2 rounded-lg hover:bg-white/10">Home</button>
            <button onClick={() => handleNavClick("#about")} className="text-left px-4 py-2 rounded-lg hover:bg-white/10">About Us</button>
            <button onClick={() => handleNavClick("#services")} className="text-left px-4 py-2 rounded-lg hover:bg-white/10">Services</button>
            <button onClick={() => handleNavClick("#contact")} className="text-left px-4 py-2 rounded-lg hover:bg-white/10">Contact</button>
            <div className="pt-2 border-t border-white/10">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider block mb-2 px-4">Official Subsidiaries</span>
              <div className="grid grid-cols-1 gap-1.5">
                {official9Subsidiaries.map((sub) => (
                  <button key={sub.href} onClick={() => handleNavClick(sub.href)} className="text-left px-3 py-2 rounded-lg text-xs font-bold bg-white/5 hover:bg-emerald-500/20 text-emerald-400 flex items-center space-x-2">
                    <sub.icon className="w-3.5 h-3.5" />
                    <span>{sub.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Context-aware Mobile Staff Login */}
            {location.startsWith("/farm") ? (
              <button onClick={() => handleNavClick("/farm/login")} className="w-full mt-4 bg-emerald-500 text-slate-950 font-black text-xs py-3 rounded-xl flex items-center justify-center space-x-1.5">
                <Wheat className="w-4 h-4" />
                <span>FARM Staff Portal</span>
              </button>
            ) : location.startsWith("/catering") ? (
              <button onClick={() => handleNavClick("/catering/ops/login")} className="w-full mt-4 bg-rose-500 text-white font-black text-xs py-3 rounded-xl flex items-center justify-center space-x-1.5">
                <ChefHat className="w-4 h-4" />
                <span>Catering Operations Login</span>
              </button>
            ) : (
              <button onClick={() => handleNavClick("/admin-login")} className="w-full mt-4 bg-emerald-500 text-slate-950 font-black text-xs py-3 rounded-xl">
                Corporate Staff Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
