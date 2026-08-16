import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Info, 
  FolderOpen, 
  ShoppingCart, 
  Camera, 
  Phone, 
  LogIn,
  Menu,
  X,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";

export default function FarmNavbar() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/farm", icon: Home },
    { name: "About Us", href: "/farm/about", icon: Info },
    { name: "Projects", href: "/farm/projects", icon: FolderOpen },
    { name: "Market", href: "/farm/market", icon: ShoppingCart },
    { name: "Media", href: "/farm/media", icon: Camera },
    { name: "Contact Us", href: "/farm/contact", icon: Phone },
  ];

  const handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "/";
      window.history.pushState(null, "", "/");
    }
    setLocation("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (href: string) => {
    if (href === "/farm") {
      return location === "/farm" || location === "/farm/";
    }
    return location.startsWith(href);
  };

  return (
    <nav className="bg-slate-950 text-white border-b border-white/10 sticky top-0 z-50 shadow-2xl backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Official TOTAG Corporate Logo + Back Button */}
          <div className="flex items-center space-x-4">
            <div onClick={handleGoHome} className="flex items-center space-x-3 cursor-pointer">
              <img 
                src="/images/totag-logo.png" 
                alt="TOTAG Group Logo" 
                className="w-14 h-14 object-contain bg-white/90 p-1 rounded-xl shadow-md"
              />
              <div>
                <span className="text-base font-black text-white block">TOTAG <span className="text-emerald-400">FARM</span></span>
                <span className="text-[10px] text-slate-300 font-semibold">Subsidiary of TOTAG Group Ltd</span>
              </div>
            </div>

            <Button
              onClick={handleGoHome}
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-lg flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Ecosystem Landing</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`flex items-center space-x-2 text-xs font-bold ${
                      isActive(item.href) 
                        ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                        : "text-slate-200 hover:text-emerald-400 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Staff Login */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/farm/login">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 rounded-xl">
                <LogIn className="h-4 w-4" />
                <span>Staff Login</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-2">
            <Button 
              onClick={handleGoHome}
              className="w-full bg-amber-500 text-slate-950 font-black text-xs py-2.5 rounded-xl flex items-center justify-center space-x-2 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Ecosystem Landing</span>
            </Button>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start flex items-center space-x-2 text-xs font-bold ${
                      isActive(item.href) 
                        ? "bg-emerald-600 text-white" 
                        : "text-slate-200 hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
