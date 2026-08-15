import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, ShoppingBag, Laptop, ChefHat, Wheat, Truck, HardHat, Briefcase } from "lucide-react";
import { useLocation } from "wouter";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  tags: string;
  slug?: string;
}

const colorClasses = {
  primary: {
    iconBg: "bg-green-100 group-hover:bg-totag-green",
    iconText: "text-totag-green group-hover:text-white",
    tags: "text-totag-green"
  },
  green: {
    iconBg: "bg-green-100 group-hover:bg-totag-green",
    iconText: "text-totag-green group-hover:text-white",
    tags: "text-totag-green"
  },
  orange: {
    iconBg: "bg-orange-100 group-hover:bg-totag-orange",
    iconText: "text-totag-orange group-hover:text-white",
    tags: "text-totag-orange"
  },
  yellow: {
    iconBg: "bg-orange-100 group-hover:bg-totag-orange",
    iconText: "text-totag-orange group-hover:text-white",
    tags: "text-totag-orange"
  },
  purple: {
    iconBg: "bg-blue-100 group-hover:bg-totag-blue",
    iconText: "text-totag-blue group-hover:text-white",
    tags: "text-totag-blue"
  },
  blue: {
    iconBg: "bg-blue-100 group-hover:bg-totag-blue",
    iconText: "text-totag-blue group-hover:text-white",
    tags: "text-totag-blue"
  },
  red: {
    iconBg: "bg-orange-100 group-hover:bg-totag-orange",
    iconText: "text-totag-orange group-hover:text-white",
    tags: "text-totag-orange"
  },
  cyan: {
    iconBg: "bg-cyan-100 group-hover:bg-cyan-600",
    iconText: "text-cyan-600 group-hover:text-white",
    tags: "text-cyan-600"
  }
};

// Icon mapping for TOTAG services
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    'ShoppingBag': ShoppingBag,
    'Laptop': Laptop,
    'ChefHat': ChefHat,
    'Wheat': Wheat,
    'Truck': Truck,
    'HardHat': HardHat,
    'Briefcase': Briefcase
  };
  const IconComponent = icons[iconName] || Briefcase;
  return <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />;
};

// TOTAG Service URLs - farm and IT go to internal platforms
const getServiceUrl = (slug: string): string => {
  const urls: Record<string, string> = {
    'general-merchandise': '/general-merchandise', // Internal TOTAG General Merchandise platform
    'merchandise': '/general-merchandise', // Database slug variant
    'it-services': '/it-services', // Internal TOTAG IT Services overview page
    'it': '/it-services', // Database slug variant
    'catering': '/catering',
    'farm': '/farm', // Internal TOTAG FARM platform
    'logistics': 'https://www.dhl.com/logistics',
    'construction': 'https://www.turner.com/services',
    'consulting': '/consulting',
    'cargo': '/cargo', // Database slug for cargo
    'petroleum': '/petroleum' // Database slug for petroleum
  };
  return urls[slug] || '#';
};

export default function ServiceCard({ id, title, description, icon, color, tags, slug }: ServiceCardProps) {
  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;
  const [, setLocation] = useLocation();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (slug) {
      const url = getServiceUrl(slug);
      if (url.startsWith('/')) {
        // Internal navigation using Wouter
        setLocation(url);
      } else {
        // External URL
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card 
        id={id} 
        onClick={handleCardClick}
        className="h-full bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer
                   p-4 sm:p-6 lg:p-8
                   transform hover:-translate-y-1"
      >
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 mb-4 sm:mb-6">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${colorClass.iconBg} rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-300`}>
              <div className={`${colorClass.iconText} transition-colors duration-300`}>
                {getIconComponent(icon)}
              </div>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base line-clamp-3 lg:line-clamp-4">{description}</p>
          </div>
          
          <div className="pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className={`text-xs sm:text-sm font-medium ${colorClass.tags} line-clamp-1 flex-1`}>{tags}</span>
            <ExternalLink className={`w-4 h-4 sm:w-5 sm:h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colorClass.iconText}`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
