import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import totagFarmLogoPath from "@assets/TOTAG FARM  Logo_1752502100780.png";
import { 
  Home, 
  Info, 
  FolderOpen, 
  ShoppingCart, 
  Camera, 
  Phone, 
  LogIn,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function FarmNavbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/farm", icon: Home },
    { name: "About Us", href: "/farm/about", icon: Info },
    { name: "Projects", href: "/farm/projects", icon: FolderOpen },
    { name: "Market", href: "/farm/market", icon: ShoppingCart },
    { name: "Media", href: "/farm/media", icon: Camera },
    { name: "Contact Us", href: "/farm/contact", icon: Phone },
  ];

  const isActive = (href: string) => {
    if (href === "/farm") {
      return location === "/farm" || location === "/farm/";
    }
    return location.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-20">
          {/* Logo - Pushed to extreme left */}
          <Link href="/farm" className="flex items-center space-x-2 mr-8 flex-shrink-0">
            <img 
              src={totagFarmLogoPath} 
              alt="TOTAG FARM Logo" 
              className="w-16 h-16 object-contain"
            />
            <span className="text-xl font-bold text-gray-900 whitespace-nowrap">TOTAG FARM</span>
          </Link>

          {/* Desktop Navigation - Flex-grow to fill space */}
          <div className="hidden md:flex items-center space-x-1 flex-grow justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      isActive(item.href) 
                        ? "bg-green-600 text-white hover:bg-green-700" 
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Staff Login - Desktop - Pushed to right */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <Link href="/farm/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Staff Login</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className={`w-full justify-start flex items-center space-x-2 ${
                        isActive(item.href) 
                          ? "bg-green-600 text-white hover:bg-green-700" 
                          : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
              <Link href="/farm/login">
                <Button 
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 mt-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Staff Login</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}