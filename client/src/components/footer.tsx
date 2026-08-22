import { Link } from "wouter";
import { 
  Truck, 
  Wheat, 
  Briefcase, 
  HardHat, 
  ShoppingBag, 
  Laptop, 
  ChefHat, 
  FileText, 
  Zap,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

const subsidiariesLinks = [
  { name: "TOTAG Cargo Handling", href: "/cargo", icon: Truck },
  { name: "TOTAG FARM", href: "/farm", icon: Wheat },
  { name: "TOTAG Petroleum Services", href: "/petroleum", icon: Briefcase },
  { name: "TOTAG General Construction", href: "/construction", icon: HardHat },
  { name: "TOTAG General Merchandise", href: "/general-merchandise", icon: ShoppingBag },
  { name: "TOTAG Catering & Events", href: "/catering", icon: ChefHat },
  { name: "TOTAG IT Services", href: "/it-services", icon: Laptop },
  { name: "TOTAG Stationery Supplies", href: "/stationery", icon: FileText },
  { name: "TOTAG Solar Energy", href: "/solar", icon: Zap },
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
              <img 
                src="/images/totag-logo.png" 
                alt="TOTAG Group Logo" 
                className="h-16 w-auto object-contain bg-white/90 p-1.5 rounded-xl shadow-md" 
              />
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              TOTAG Group of Companies Ltd — Innovating Tomorrow, Empowering Today. A premier multi-sector enterprise operating nine specialized subsidiaries across cargo, agribusiness, petroleum, construction, retail, technology, catering, stationery, and solar power.
            </p>

            {/* Live Operational Status Indicator */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Platform Active • totaggroup.com</span>
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
                <Link href="/executive-dashboard" className="text-emerald-400 font-bold hover:text-white transition-colors flex items-center justify-between">
                  <span>Executive Command Center</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
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
            <span>Primary Portal: <strong className="text-emerald-400 font-semibold">totaggroup.com</strong></span>
            <span>Managed by <strong className="text-sky-400 font-semibold">TOTAG IT Services</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
}

