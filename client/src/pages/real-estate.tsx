import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building, 
  Home, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Key, 
  FileText,
  Users
} from "lucide-react";
import { Link } from "wouter";

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-emerald text-xs font-semibold">
              <Building className="w-4 h-4 text-emerald-500" />
              <span>TOTAG Subsidiary • Real Estate & Property Management</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              TOTAG <span className="text-gradient-emerald">Real Estate</span> & Property
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Commercial office spaces, prime residential developments, land acquisitions, facility management, and tenant leasing services.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/#contact">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-8 shadow-xl">
                  <span>Property Inquiry</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Commercial Leasing</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Modern office suites, retail storefronts, and industrial warehouse facilities in prime commercial districts.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Residential Properties</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Luxury apartments, gated community villas, and executive housing rentals with 24/7 security and backup power utilities.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Facility Management</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Comprehensive building maintenance, HVAC servicing, janitorial management, security access control, and tenant relations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
