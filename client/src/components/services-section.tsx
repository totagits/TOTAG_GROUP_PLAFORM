import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ServiceCard from "./service-card";
import type { Service } from "@shared/schema";
import { Sparkles, Building2, Grid } from "lucide-react";

// Default static list of all 9 TOTAG Group specialized subsidiaries to guarantee fast initial render
const defaultSubsidiaries: Service[] = [
  {
    id: 1,
    name: "TOTAG Cargo Handling & Maritime Logistics",
    description: "Port management, container freight forwarding, customs clearance, and global supply chain tracking.",
    icon: "Truck",
    color: "blue",
    tags: "logistics, cargo, maritime, shipping",
    slug: "cargo",
    isActive: true
  },
  {
    id: 2,
    name: "TOTAG Farm & Agribusiness",
    description: "Integrated agricultural operations, livestock management, crop farming, and fresh organic produce market.",
    icon: "Wheat",
    color: "green",
    tags: "agriculture, farming, livestock, organic",
    slug: "farm",
    isActive: true
  },
  {
    id: 3,
    name: "TOTAG Petroleum & Energy Services",
    description: "Bulk fuel distribution, petroleum storage facilities, energy logistics, and marine bunkering.",
    icon: "Briefcase",
    color: "orange",
    tags: "petroleum, fuel, energy, oil",
    slug: "petroleum",
    isActive: true
  },
  {
    id: 4,
    name: "TOTAG General Construction & Infrastructure",
    description: "Civil engineering works, infrastructure development, heavy machinery fleet, and structural building.",
    icon: "HardHat",
    color: "yellow",
    tags: "construction, infrastructure, engineering",
    slug: "construction",
    isActive: true
  },
  {
    id: 5,
    name: "TOTAG General Merchandise & Supply Chain",
    description: "Wholesale distribution, retail outlets, merchant network, and e-commerce supply chain.",
    icon: "ShoppingBag",
    color: "purple",
    tags: "retail, wholesale, merchandise, commerce",
    slug: "general-merchandise",
    isActive: true
  },
  {
    id: 6,
    name: "TOTAG IT Services & Enterprise SaaS",
    description: "Managed IT services, cloud infrastructure, cybersecurity, and enterprise FIMS & HRMIS software.",
    icon: "Laptop",
    color: "cyan",
    tags: "technology, IT, SaaS, enterprise",
    slug: "it-services",
    isActive: true
  },
  {
    id: 7,
    name: "TOTAG Catering & Hospitality Services",
    description: "Institutional and corporate catering, event planning, hall rentals, and HACCP-certified food safety.",
    icon: "ChefHat",
    color: "red",
    tags: "catering, food, events, hospitality",
    slug: "catering",
    isActive: true
  },
  {
    id: 8,
    name: "TOTAG Real Estate & Property Management",
    description: "Commercial and residential property management, land development, facility management, and leasing.",
    icon: "Building",
    color: "green",
    tags: "real-estate, property, leasing, facilities",
    slug: "real-estate",
    isActive: true
  },
  {
    id: 9,
    name: "TOTAG Consulting & Financial Advisory Services",
    description: "Corporate management consulting, financial audit advisory, business process optimization, and strategy.",
    icon: "TrendingUp",
    color: "blue",
    tags: "consulting, advisory, finance, strategy",
    slug: "consulting",
    isActive: true
  }
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(defaultSubsidiaries);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.services && data.services.length > 0) {
            setServices(data.services);
          }
        }
      } catch (err) {
        console.log("Using default 9 subsidiaries list");
      }
    }

    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 bg-mesh-glass relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-badge-sky mb-4 text-xs font-semibold uppercase tracking-wider"
          >
            <Grid className="w-3.5 h-3.5 text-sky-500" />
            <span>Corporate Ecosystem</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight"
          >
            Our <span className="text-gradient-emerald">Nine Specialized Subsidiaries</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Nine distinct business divisions operating synergistically to deliver end-to-end commercial solutions across key industries in Liberia and internationally.
          </motion.p>
        </div>

        {/* 9 Subsidiaries Glass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.slug || service.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <ServiceCard 
                id={service.slug}
                title={service.name}
                description={service.description}
                icon={service.icon}
                color={service.color}
                tags={service.tags}
                slug={service.slug}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

