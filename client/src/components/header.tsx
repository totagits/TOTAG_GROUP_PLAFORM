import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Mail, Shield } from "lucide-react";
import { Link } from "wouter";

const navigation = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Cargo", href: "#cargo" },
  { name: "Petroleum", href: "#petroleum" },
  { name: "Construction", href: "#construction" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`fixed w-full z-50 border-b border-gray-100 transition-all duration-200 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavClick("#home")}
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200"
            >
              <img 
                src="/images/totag-logo.png" 
                alt="TOTAG Group Logo" 
                className="w-auto"
                style={{ height: '120px' }}
              />
              <span className="text-xl font-bold hidden sm:block">
                <span className="text-totag-green">TOTAG</span> <span className="text-totag-blue">Group</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
            
            {/* Admin Login Button */}
            <button 
              className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors"
              onClick={() => window.location.href = "/admin-login"}
            >
              Admin Login
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-totag-green"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left text-gray-700 hover:text-totag-green transition-colors duration-200 font-medium py-2"
              >
                {item.name}
              </button>
            ))}
            
            {/* Mobile Admin Login Button */}
            <Button 
              size="sm" 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 mt-4 py-2 rounded-md font-medium"
              onClick={() => {
                setIsMenuOpen(false);
                window.location.href = "/admin-login";
              }}
            >
              Admin Login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
