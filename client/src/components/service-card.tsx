import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  ShoppingBag, 
  Laptop, 
  ChefHat, 
  Wheat, 
  Truck, 
  HardHat, 
  Briefcase,
  Building,
  TrendingUp,
  Fuel,
  Ship,
  Sparkles
} from "lucide-react";
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
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white border-emerald-500/20",
    badge: "glass-badge-emerald",
    accent: "text-emerald-600 dark:text-emerald-400"
  },
  green: {
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white border-emerald-500/20",
    badge: "glass-badge-emerald",
    accent: "text-emerald-600 dark:text-emerald-400"
  },
  orange: {
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white border-amber-500/20",
    badge: "glass-badge-amber",
    accent: "text-amber-600 dark:text-amber-400"
  },
  yellow: {
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white border-amber-500/20",
    badge: "glass-badge-amber",
    accent: "text-amber-600 dark:text-amber-400"
  },
  purple: {
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white border-purple-500/20",
    badge: "glass-badge-purple",
    accent: "text-purple-600 dark:text-purple-400"
  },
  blue: {
    iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white border-sky-500/20",
    badge: "glass-badge-sky",
    accent: "text-sky-600 dark:text-sky-400"
  },
  red: {
    iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white border-rose-500/20",
    badge: "glass-badge-amber",
    accent: "text-rose-600 dark:text-rose-400"
  },
  cyan: {
    iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white border-cyan-500/20",
    badge: "glass-badge-sky",
    accent: "text-cyan-600 dark:text-cyan-400"
  }
};

// Icon mapping for all 9 TOTAG subsidiaries
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    'ShoppingBag': ShoppingBag,
    'Laptop': Laptop,
    'ChefHat': ChefHat,
    'Wheat': Wheat,
    'Truck': Truck,
    'HardHat': HardHat,
    'Briefcase': Briefcase,
    'Building': Building,
    'TrendingUp': TrendingUp,
    'Fuel': Fuel,
    'Ship': Ship
  };
  const IconComponent = icons[iconName] || Briefcase;
  return <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />;
};

// Service URLs mapping for all 9 specialized subsidiaries
const getServiceUrl = (slug: string): string => {
  const urls: Record<string, string> = {
    'cargo': '/cargo',
    'farm': '/farm',
    'petroleum': '/petroleum',
    'construction': '/construction',
    'general-merchandise': '/general-merchandise',
    'merchandise': '/general-merchandise',
    'it-services': '/it-services',
    'it': '/it-services',
    'catering': '/catering',
    'real-estate': '/real-estate',
    'consulting': '/consulting',
    'saas': '/saas'
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
        setLocation(url);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Card 
        id={id} 
        onClick={handleCardClick}
        className="h-full glass-card-interactive backdrop-blur-xl border border-white/60 dark:border-white/10 group cursor-pointer p-6 flex flex-col justify-between relative overflow-hidden"
      >
        {/* Subtle Background Glow Mesh */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/10 to-sky-500/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
        
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className={`w-14 h-14 rounded-2xl border ${colorClass.iconBg} flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-110`}>
              {getIconComponent(icon)}
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${colorClass.badge}`}>
              Subsidiary
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200/60 dark:border-white/10 flex items-center justify-between mt-auto">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate max-w-[70%]">
            {tags}
          </span>
          <div className="flex items-center space-x-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-200">
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

