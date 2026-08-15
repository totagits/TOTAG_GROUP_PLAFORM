import { Link } from "wouter";
import { 
  Building2, 
  Globe, 
  ShieldCheck, 
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
  ArrowUpRight
} from "lucide-react";

const subsidiariesLinks = [
  { name: "TOTAG Cargo & Logistics", href: "/cargo", icon: Truck },
  { name: "TOTAG Farm & Agribusiness", href: "/farm", icon: Wheat },
  { name: "TOTAG Petroleum & Energy", href: "/petroleum", icon: Briefcase },
  { name: "TOTAG Construction & Infra", href: "/construction", icon: HardHat },
  { name: "TOTAG General Merchandise", href: "/general-merchandise", icon: ShoppingBag },
  { name: "TOTAG IT Services & SaaS", href: "/it-services", icon: Laptop },
  { name: "TOTAG Catering Services", href: "/catering", icon: ChefHat },
  { name: "TOTAG Real Estate", href: "/real-estate", icon: Building },
  { name: "TOTAG Consulting", href: "/consulting", icon: TrendingUp },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-sky-600 to-amber-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-emerald-400 text-lg">T</span>
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                TOTAG <span className="text-gradient-emerald">GROUP</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              TOTAG Group of Companies Ltd is a premier multi-sector enterprise headquartered in Liberia, operating nine specialized subsidiaries across maritime logistics, agribusiness, petroleum, construction, retail, technology, hospitality, property, and consulting.
            </p>

            {/* Live Operational Status Indicator */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Platform Active • totag.network</span>
            </div>
          </div>

          {/* Col 2: 9 Subsidiaries (Part 1) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Subsidiaries (1-5)
            </h4>
            <ul className="space-y-2 text-xs">
              {subsidiariesLinks.slice(0, 5).map((sub) => (
                <li key={sub.name}>
                  <Link 
                    href={sub.href}
                    className="text-slate-400 hover:text-emerald-400 flex items-center space-x-2 transition-colors py-1"
                  >
                    <sub.icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{sub.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: 9 Subsidiaries (Part 2) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Subsidiaries (6-9)
            </h4>
            <ul className="space-y-2 text-xs">
              {subsidiariesLinks.slice(5).map((sub) => (
                <li key={sub.name}>
                  <Link 
                    href={sub.href}
                    className="text-slate-400 hover:text-emerald-400 flex items-center space-x-2 transition-colors py-1"
                  >
                    <sub.icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{sub.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/saas"
                  className="text-emerald-400 font-semibold flex items-center space-x-2 transition-colors py-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Enterprise SaaS Suite</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/admin-login" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Group Admin Console</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/merchant-login" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>TGM Merchant Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/catering/ops/login" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>TOCEPS Catering Ops</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/saas/login" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Enterprise SaaS Login</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} TOTAG Group of Companies Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Primary Portal: <strong className="text-emerald-400 font-semibold">totag.network</strong></span>
            <span>Managed by <strong className="text-sky-400 font-semibold">TOTAG IT Services</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
}

