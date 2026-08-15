import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export default function HeroSection() {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative bg-white py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-hero-overlay"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Welcome to <span className="text-totag-green font-extrabold">TOTAG</span> <span className="text-totag-blue">Group</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Delivering excellence across diverse industries through our seven specialized subsidiaries. 
            From cargo handling to IT services, we provide comprehensive business solutions with unwavering commitment to quality.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => handleNavClick("#services")}
              className="inline-flex items-center px-8 py-4 bg-totag-green text-white font-semibold rounded-lg hover:bg-totag-green/90 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => handleNavClick("#contact")}
              variant="outline"
              className="inline-flex items-center px-8 py-4 bg-white text-totag-blue font-semibold rounded-lg border-2 border-totag-blue hover:bg-totag-blue/5 transition-all duration-200 hover:scale-105"
            >
              <span>Get in Touch</span>
              <Phone className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
