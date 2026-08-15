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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-sky-600 to-amber-500 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">T</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                <span>TOTAG</span>
                <span className="text-gradient-emerald">GROUP</span>
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                9 Specialized Subsidiaries
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm">
            <button
              onClick={() => handleNavClick("#home")}
              className="px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all"
            >
              Home
            </button>

            {/* 9 Subsidiaries Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all group">
                  <span>9 Subsidiaries</span>
                  <ChevronDown className="w-4 h-4 group-data-[state=open]:rotate-180 transition-transform duration-200 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-80 p-2 glass-panel-light dark:glass-panel border-white/60 dark:border-white/10 shadow-2xl rounded-2xl animate-in fade-in-80 zoom-in-95"
              >
                <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  TOTAG Business Divisions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200/60 dark:bg-white/10" />
                <div className="grid grid-cols-1 gap-1 max-h-[380px] overflow-y-auto">
                  {subsidiariesList.map((sub) => (
                    <DropdownMenuItem
                      key={sub.name}
                      onClick={() => setLocation(sub.href)}
                      className="flex items-center space-x-3 p-2.5 rounded-xl cursor-pointer hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-slate-800 dark:text-slate-100 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <sub.icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          {sub.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {sub.tag}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator className="bg-slate-200/60 dark:bg-white/10 my-1" />
                <DropdownMenuItem
                  onClick={() => setLocation("/saas")}
                  className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer bg-gradient-to-r from-emerald-600/10 to-sky-600/10 text-emerald-700 dark:text-emerald-300 hover:from-emerald-600/20 hover:to-sky-600/20"
                >
                  <span className="font-semibold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    Enterprise SaaS (HRMIS & FIMS)
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                    Platform
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => handleNavClick("#services")}
              className="px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all"
            >
              Divisions
            </button>

            <button
              onClick={() => handleNavClick("#contact")}
              className="px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all"
            >
              Contact
            </button>
          </nav>

          {/* Quick Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/merchant-login">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Merchant Portal
              </Button>
            </Link>

            <Link href="/saas/login">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs font-semibold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
              >
                SaaS Portal
              </Button>
            </Link>

            <Link href="/admin-login">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Lock className="w-3.5 h-3.5 mr-1.5" />
                Admin
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

