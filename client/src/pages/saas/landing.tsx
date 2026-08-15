import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Building2, 
  Users, 
  DollarSign, 
  BarChart3, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Star,
  Zap
} from "lucide-react";

interface Module {
  id: string;
  name: string;
  category: 'HRMIS' | 'FIMS';
  description: string;
  features: string[];
  monthlyPrice: number;
  setupFee: number;
}

export default function SaaSLanding() {
  const { data: modulesData, isLoading } = useQuery<any>({
    queryKey: ['/api/saas/modules'],
  });

  const modules = modulesData?.data?.modules || [];
  const hrmisMoudles = modules.filter((m: Module) => m.category === 'HRMIS');
  const fimsModules = modules.filter((m: Module) => m.category === 'FIMS');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">TOTAG IT Services</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Enterprise FIMS & HRMIS</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/saas/login">
                <Button variant="outline" data-testid="button-login">
                  Login
                </Button>
              </Link>
              <Link href="/saas/register">
                <Button data-testid="button-get-started">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            <Star className="w-3 h-3 mr-1" />
            Powered by TOTAG Group of Companies Ltd
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Enterprise-Grade
            <span className="text-blue-600 dark:text-blue-400"> Financial</span> &
            <span className="text-purple-600 dark:text-purple-400"> HR</span> Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Comprehensive modular SaaS platform combining FIMS (Financial Information Management) 
            and HRMIS (Human Resource Management) systems. Built for Liberian businesses with 
            compliance, mobile money integration, and enterprise security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/saas/register">
              <Button size="lg" className="text-lg px-8" data-testid="button-start-trial">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-schedule-demo">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose TOTAG Enterprise Solutions?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <Shield className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Bank-grade security with multi-tenant isolation, audit logging, 
                  and Liberian compliance standards.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <Zap className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Modular Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Mix and match from 14 modules. Pay only for what you need, 
                  scale as you grow.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <DollarSign className="w-10 h-10 text-green-600 mb-2" />
                <CardTitle>Local Payment Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  MTN Money, Orange Money, Liberian bank transfers (Ecobank, LBDI, 
                  UBA, GTBank), and international payment methods supported.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* HRMIS Modules */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <Users className="w-3 h-3 mr-1" />
              HRMIS Modules
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Human Resource Management Information System
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Complete HR solutions for employee management, recruitment, payroll, and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              hrmisMoudles.map((module: Module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">
                          ${module.monthlyPrice}/mo
                        </span>
                        <Badge variant="secondary">${module.setupFee} setup</Badge>
                      </div>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {module.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FIMS Modules */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <BarChart3 className="w-3 h-3 mr-1" />
              FIMS Modules
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Financial Information Management System
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive financial management including accounting, reporting, and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              fimsModules.map((module: Module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-purple-600">
                          ${module.monthlyPrice}/mo
                        </span>
                        <Badge variant="secondary">${module.setupFee} setup</Badge>
                      </div>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {module.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join leading Liberian businesses using TOTAG Enterprise Solutions. 
            Start with a free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/saas/register">
              <Button size="lg" variant="secondary" className="text-lg px-8" data-testid="button-start-free-trial">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 text-white border-white hover:bg-white hover:text-blue-600" data-testid="button-contact-sales">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-lg">TOTAG IT Services</span>
              </div>
              <p className="text-gray-400 text-sm">
                Part of TOTAG Group of Companies Ltd<br />
                Managed IT Services Division
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/saas/hrmis" className="hover:text-white">HRMIS Modules</Link></li>
                <li><Link href="/saas/fims" className="hover:text-white">FIMS Modules</Link></li>
                <li><Link href="/saas/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/saas/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/saas/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/saas/support" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/saas/training" className="hover:text-white">Training</Link></li>
                <li><Link href="/saas/status" className="hover:text-white">System Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">TOTAG Group</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white">Main Website</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 TOTAG Group of Companies Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}