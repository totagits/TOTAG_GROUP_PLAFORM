import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Printer, 
  BookOpen, 
  CheckCircle, 
  ArrowRight,
  ShoppingBag
} from "lucide-react";
import { Link } from "wouter";

export default function StationeryPage() {
  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-badge-sky text-xs font-semibold">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>TOTAG Subsidiary • Office & Educational Supplies</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              TOTAG <span className="text-gradient-sky">Stationery Supplies</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive office and educational stationery supply services for businesses, institutions, and individuals across Liberia.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/#contact">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-500 text-white rounded-2xl px-8 shadow-xl">
                  <span>Bulk Supply Order</span>
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
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Office Paper & Printing Media</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Premium A4/A3 copy paper, letterheads, continuous stationery, cardstock, and specialized printing consumables.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Educational & Institutional Supplies</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Notebooks, filing binders, writing instruments, school kits, and office organization supplies for schools and government ministries.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-interactive p-6 border-white/60 dark:border-white/10">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Printer className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Custom Commercial Printing</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  High-volume digital printing, corporate brochures, stamps, binding, and promotional printing services.
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
