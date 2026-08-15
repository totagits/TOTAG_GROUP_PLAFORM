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
      if (location !== "/") {
        setLocation("/");
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setLocation(href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-950/85 backdrop-blur-xl shadow-md border-b border-gray-200/50 dark:border-white/10 py-2.5"
          : "bg-white/60 dark:bg-slate-950/60 backdrop-blur-lg border-b border-gray-100/30 dark:border-white/5 py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <img 
              src="/images/totag-logo.png" 
              alt="TOTAG Group Logo" 
              className="h-12 sm:h-14 w-auto object-contain hover:scale-105 transition-transform duration-200" 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1 font-semibold text-sm text-slate-700 dark:text-slate-200">
            <button
              onClick={() => handleNavClick("#home")}
              className="px-3 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all"
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick("#about")}
              className="px-3 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all"
            >
              About Us
            </button>

            <button
              onClick={() => handleNavClick("#services")}
              className="px-3 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all"
            >
              Services
            </button>

            <Link href="/cargo">
              <span className="px-3 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all cursor-pointer">
                Cargo
              </span>
            </Link>

            <Link href="/petroleum">
              <span className="px-3 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all cursor-pointer">
                Petroleum
              </span>
            </Link>

            <Link href="/construction">
              <span className="px-3 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all cursor-pointer">
                Construction
              </span>
            </Link>

            <button
              onClick={() => handleNavClick("#contact")}
              className="px-3 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all"
            >
              Contact
            </button>
          </nav>

          {/* Quick Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/admin-login">
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg px-5 py-2.5 shadow-md"
              >
                Admin Login
              </Button>
            </Link>
          </div>


          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700 dark:text-slate-200 p-2 rounded-xl"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden glass-panel-light dark:glass-panel border-t border-gray-200/60 dark:border-white/10 shadow-2xl px-4 py-6 mt-2 animate-in slide-in-from-top-5">
          <div className="space-y-4">
            <div className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-2">
              Navigation & 9 Subsidiaries
            </div>

            <div className="grid grid-cols-2 gap-2">
              {subsidiariesList.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setLocation(sub.href);
                  }}
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-100/70 dark:bg-white/5 text-left text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10"
                >
                  <sub.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{sub.name.replace("TOTAG ", "")}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setIsMenuOpen(false);
                  setLocation("/merchant-login");
                }}
              >
                Merchant
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-emerald-600 border-emerald-500/30"
                onClick={() => {
                  setIsMenuOpen(false);
                  setLocation("/saas/login");
                }}
              >
                SaaS
              </Button>
              <Button
                size="sm"
                className="text-xs bg-emerald-600 text-white"
                onClick={() => {
                  setIsMenuOpen(false);
                  setLocation("/admin-login");
                }}
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

