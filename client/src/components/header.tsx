import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Shield, 
  Globe, 
  Truck, 
  Wheat, 
  Briefcase, 
  HardHat, 
  ShoppingBag, 
  Laptop, 
  ChefHat, 
  Building, 
  TrendingUp,
  Sparkles,
  Lock
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const subsidiariesList = [
  { name: "TOTAG Cargo & Logistics", href: "/cargo", icon: Truck, tag: "Maritime & Freight" },
  { name: "TOTAG Farm & Agribusiness", href: "/farm", icon: Wheat, tag: "Agri-Tech & Produce" },
  { name: "TOTAG Petroleum & Energy", href: "/petroleum", icon: Briefcase, tag: "Fuel & Energy" },
  { name: "TOTAG Construction & Infra", href: "/construction", icon: HardHat, tag: "Civil Works" },
  { name: "TOTAG General Merchandise", href: "/general-merchandise", icon: ShoppingBag, tag: "Retail & Wholesale" },
  { name: "TOTAG IT Services & SaaS", href: "/it-services", icon: Laptop, tag: "Software & Cloud" },
  { name: "TOTAG Catering Services", href: "/catering", icon: ChefHat, tag: "Institutional & Events" },
  { name: "TOTAG Real Estate", href: "/real-estate", icon: Building, tag: "Property & Facilities" },
  { name: "TOTAG Consulting", href: "/consulting", icon: TrendingUp, tag: "Advisory & Strategy" },
  { name: "TOTAG Stationery Supplies", href: "/stationery", icon: Briefcase, tag: "Office & School Supplies" },
  { name: "TOTAG Solar Energy", href: "/solar", icon: Sparkles, tag: "Solar EPC & Telemetry" },
  { name: "TOTAG Institutional Services", href: "/institutional-services", icon: Building, tag: "UN & Donor Contracts" }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("#")) {
      if (location !== "/" && location !== "/home") {
        if (window.location.hash || window.location.host.includes("github.io")) {
          window.location.hash = "/";
        }
        setLocation("/");
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 150);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } else {
      if (window.location.hash || window.location.host.includes("github.io")) {
        window.location.hash = href;
      }
      setLocation(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-md border-b border-gray-200/50 dark:border-white/10 py-2.5"
          : "bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg border-b border-gray-100/30 dark:border-white/5 py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick("#home")}
            className="flex items-center space-x-3.5 group cursor-pointer py-1"
          >
            <img 
              src="/images/totag-logo.png" 
              alt="TOTAG Group Logo" 
              className="h-14 sm:h-18 w-auto object-contain hover:scale-105 transition-transform duration-200" 
            />
            <div className="flex flex-col justify-center">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                <span className="text-emerald-600 dark:text-emerald-400">TOTAG</span>{" "}
                <span className="text-sky-600 dark:text-sky-400">Group</span>{" "}
                <span className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 block sm:inline">of Companies Ltd</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide mt-0.5">
                Innovating Tomorrow, Empowering Today
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-2 font-semibold text-sm text-slate-700 dark:text-slate-200">
            <button
              onClick={() => handleNavClick("#home")}
              className="px-3.5 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick("#about")}
              className="px-3.5 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              About Us
            </button>

            <button
              onClick={() => handleNavClick("#services")}
              className="px-3.5 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Services
            </button>

            {/* Subsidiaries Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-1 px-3.5 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all cursor-pointer">
                  <span>Subsidiaries</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl p-2 rounded-2xl">
                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  10 Specialized Divisions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto space-y-1">
                  {subsidiariesList.map((sub) => (
                    <DropdownMenuItem 
                      key={sub.href}
                      onClick={() => handleNavClick(sub.href)}
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                    >
                      <sub.icon className="w-4 h-4 text-emerald-500" />
                      <div>
                        <span className="text-xs font-bold block">{sub.name}</span>
                        <span className="text-[10px] text-slate-400">{sub.tag}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => handleNavClick("#contact")}
              className="px-3.5 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Quick Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <button 
              onClick={() => handleNavClick("/admin-login")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg px-5 py-2.5 shadow-md cursor-pointer transition-all"
            >
              Admin Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 px-4 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-2 font-semibold text-slate-700 dark:text-slate-200">
            <button onClick={() => handleNavClick("#home")} className="text-left px-4 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">Home</button>
            <button onClick={() => handleNavClick("#about")} className="text-left px-4 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">About Us</button>
            <button onClick={() => handleNavClick("#services")} className="text-left px-4 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">Services</button>
            <button onClick={() => handleNavClick("#contact")} className="text-left px-4 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">Contact</button>
            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-4">Subsidiary Platforms</span>
              <div className="grid grid-cols-2 gap-2">
                {subsidiariesList.map((sub) => (
                  <button key={sub.href} onClick={() => handleNavClick(sub.href)} className="text-left px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 dark:bg-white/5 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => handleNavClick("/admin-login")} className="w-full mt-4 bg-blue-600 text-white font-bold text-xs py-3 rounded-xl">
              Admin Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
