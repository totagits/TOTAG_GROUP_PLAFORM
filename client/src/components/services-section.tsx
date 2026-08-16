import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ServiceCard from "./service-card";
import type { Service } from "@shared/schema";
import { Sparkles, Building2, Grid } from "lucide-react";

// Default static list of all 9 TOTAG Group specialized subsidiaries to guarantee fast initial render
const defaultSubsidiaries: Service[] = [
  {
    id: 1,
    name: "TOTAG Cargo Handling",
    description: "Efficient and secure cargo logistics and port management services. We handle comprehensive freight forwarding, warehousing, and distribution solutions for businesses of all sizes.",
    icon: "Truck",
    color: "blue",
    tags: "Port Management • Logistics • Warehousing",
    slug: "cargo",
    isActive: true
  },
  {
    id: 2,
    name: "TOTAG FARM",
    description: "Integrated agribusiness solutions from seed to market. Our comprehensive farming operations include crop production, livestock management, and agricultural technology implementation.",
    icon: "Wheat",
    color: "green",
    tags: "Agriculture • Livestock • Technology",
    slug: "farm",
    isActive: true
  },
  {
    id: 3,
    name: "TOTAG Petroleum Services",
    description: "Professional fuel distribution and petroleum logistics. We provide reliable fuel supply, storage solutions, and distribution networks for commercial and industrial clients.",
    icon: "Briefcase",
    color: "orange",
    tags: "Fuel Distribution • Storage • Logistics",
    slug: "petroleum",
    isActive: true
  },
  {
    id: 4,
    name: "TOTAG General Construction",
    description: "Quality civil works, infrastructure development, and comprehensive project management. From residential buildings to large-scale infrastructure projects.",
    icon: "HardHat",
    color: "yellow",
    tags: "Infrastructure • Project Management • Civil Works",
    slug: "construction",
    isActive: true
  },
  {
    id: 5,
    name: "TOTAG General Merchandise",
    description: "Wholesale and retail supply of diversified goods. We maintain extensive inventory and distribution networks for consumer goods, industrial supplies, and specialty products.",
    icon: "ShoppingBag",
    color: "purple",
    tags: "Wholesale • Retail • Distribution",
    slug: "general-merchandise",
    isActive: true
  },
  {
    id: 6,
    name: "TOTAG Catering & Events Planning Services",
    description: "Professional catering and event hospitality services. From corporate events to large-scale celebrations, we deliver exceptional culinary experiences.",
    icon: "ChefHat",
    color: "red",
    tags: "Event Catering • Corporate Services • Hospitality",
    slug: "catering",
    isActive: true
  },
  {
    id: 7,
    name: "TOTAG IT Services - Managed IT Services",
    description: "Enterprise SaaS solutions including 14 modular FIMS & HRMIS platform ($35-$75/month per module), custom software development, system integration, and digital transformation services.",
    icon: "Laptop",
    color: "cyan",
    tags: "SaaS Platform • FIMS/HRMIS • Software Development",
    slug: "it-services",
    isActive: true
  },
  {
    id: 8,
    name: "TOTAG Stationery Supplies",
    description: "Comprehensive office and educational stationery supply services for businesses, institutions, and individuals.",
    icon: "FileText",
    color: "blue",
    tags: "stationery, office supplies, printing",
    slug: "stationery",
    isActive: true
  },
  {
    id: 9,
    name: "TOTAG Solar Energy & Smart Power Solutions",
    description: "Supply, installation, commissioning, monitoring, and maintenance of solar photovoltaic and energy-storage systems for residential, commercial, institutional, industrial, and public-sector clients.",
    icon: "Zap",
    color: "amber",
    tags: "Solar EPC • NOC Telemetry • Off-Grid Microgrids",
    slug: "solar",
    isActive: true
  },
  {
    id: 10,
    name: "TOTAG Institutional Services",
    description: "Specialized UN, donor agency, diplomatic mission, and NGO work package execution, procurement, logistics, and field operations management across West Africa.",
    icon: "Building2",
    color: "purple",
    tags: "UN & Donor Contracts • NGO Logistics • Procurement",
    slug: "institutional-services",
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
        console.log("Using default 10 subsidiaries list");
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
            Our <span className="text-gradient-emerald">Ten Specialized Subsidiaries</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Ten distinct business divisions operating synergistically to deliver end-to-end commercial solutions across key industries in Liberia and internationally.
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

