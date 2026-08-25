import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { 
  Building2, 
  Users, 
  DollarSign, 
  BarChart3, 
  CheckCircle, 
  ArrowLeft,
  CreditCard,
  Zap,
  Shield,
  Wallet,
  Sparkles,
  Check
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type PortalType = 'hr' | 'financial' | 'combined' | null;

const PORTAL_OPTIONS = [
  {
    id: 'hr' as const,
    name: 'HR Management Portal',
    description: 'Complete Human Resource Management Information System',
    monthlyPrice: 20,
    icon: Users,
    color: 'green',
    modules: [
      'Core HR & Admin',
      'Recruitment & Onboarding',
      'Talent Management',
      'Compensation & Benefits',
      'Employee Self-Service',
      'Analytics & Reporting',
      'Biometrics & Attendance'
    ]
  },
  {
    id: 'financial' as const,
    name: 'Financial Management Portal',
    description: 'Complete Financial Information Management System',
    monthlyPrice: 20,
    icon: Wallet,
    color: 'purple',
    modules: [
      'General Ledger',
      'Accounts Payable',
      'Accounts Receivable',
      'Treasury & Cash Management',
      'Budgeting & Forecasting',
      'Procurement & Expense Management',
      'Financial Reporting & Analytics',
      'Security & Compliance'
    ]
  },
  {
    id: 'combined' as const,
    name: 'Combined HR & Financial Portals',
    description: 'Full enterprise suite with both HR and Financial management',
    monthlyPrice: 37,
    icon: Sparkles,
    color: 'blue',
    modules: [
      'All 7 HR Management modules',
      'All 8 Financial Management modules',
      '15 total integrated modules',
      'Cross-system reporting',
      'Unified dashboard'
    ],
    isBestValue: true
  }
];

// $125 is the total for setup + first month
const FIRST_PAYMENT = 125;

const registrationSchema = z.object({
  // Company Information
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  businessType: z.string().min(1, "Please select business type"),
  employees: z.string().min(1, "Please select employee count"),
  industry: z.string().min(1, "Please select industry"),
  
  // Business Representative Information (required for new flow)
  representativeName: z.string().min(2, "Representative name must be at least 2 characters"),
  representativeEmail: z.string().email("Please enter a valid email address"),
  representativePhone: z.string().min(10, "Please enter a valid phone number"),
  businessAddress: z.string().min(5, "Please enter a complete business address"),
  
  // Selected modules and payment method will be handled separately
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function SaaSRegister() {
  const [selectedPortal, setSelectedPortal] = useState<PortalType>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bank_transfer' | 'mobile_money' | 'stripe' | 'invoice'>('bank_transfer');
  const [step, setStep] = useState<'portal' | 'details' | 'payment' | 'review'>('portal');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const selectedOption = PORTAL_OPTIONS.find(p => p.id === selectedPortal);
  const monthlyAfter = selectedOption?.monthlyPrice || 0;

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      companyName: "",
      businessType: "",
      employees: "",
      industry: "",
      representativeName: "",
      representativeEmail: "",
      representativePhone: "",
      businessAddress: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/saas/auth/register-tenant', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (response: any) => {
      if (response.success && response.directActivation) {
        toast({
          title: "Account Provisioned Successfully!",
          description: "Your portal is activated and ready to launch.",
        });
        try {
          sessionStorage.setItem('saas_registration_result', JSON.stringify(response.data));
        } catch (e) {}
        window.location.href = '/saas/payment-success?direct=true';
        return;
      }

      if (response.success && response.data?.checkoutUrl) {
        toast({
          title: "Opening Payment Page",
          description: "A new tab will open for secure payment with Stripe. Please complete the payment there.",
        });
        const stripeWindow = window.open(response.data.checkoutUrl, '_blank');
        if (!stripeWindow) {
          window.location.href = response.data.checkoutUrl;
        }
      } else if (response.success && response.data) {
        try {
          sessionStorage.setItem('saas_registration_result', JSON.stringify(response.data));
        } catch (e) {}
        window.location.href = '/saas/payment-success?direct=true';
      } else {
        toast({
          title: "Registration Error",
          description: response.error || "Failed to complete registration.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: RegistrationForm) => {
    if (!selectedPortal) {
      toast({
        title: "Portal Selection Required",
        description: "Please select a portal to continue with your subscription.",
        variant: "destructive",
      });
      return;
    }

    await registerMutation.mutateAsync({
      ...data,
      portalType: selectedPortal,
      paymentMethod: selectedPaymentMethod,
      monthlyPrice: monthlyAfter,
      firstPayment: FIRST_PAYMENT,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/saas" className="flex items-center space-x-4">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">TOTAG IT Services</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Enterprise Registration</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Already have an account?</span>
              <Link href="/saas/login">
                <Button variant="outline" data-testid="button-login">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'portal' ? 'text-blue-600' : step === 'details' || step === 'payment' || step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'portal' ? 'bg-blue-600 text-white' : step === 'details' || step === 'payment' || step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                1
              </div>
              <span className="font-medium">Select Portal</span>
            </div>
            <div className={`h-px bg-gray-300 dark:bg-gray-600 flex-1 ${step === 'details' || step === 'payment' || step === 'review' ? 'bg-green-600' : ''}`}></div>
            <div className={`flex items-center space-x-2 ${step === 'details' ? 'text-blue-600' : step === 'payment' || step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-blue-600 text-white' : step === 'payment' || step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                2
              </div>
              <span className="font-medium">Business Details</span>
            </div>
            <div className={`h-px bg-gray-300 dark:bg-gray-600 flex-1 ${step === 'payment' || step === 'review' ? 'bg-green-600' : ''}`}></div>
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-blue-600' : step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-blue-600 text-white' : step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                3
              </div>
              <span className="font-medium">Payment</span>
            </div>
            <div className={`h-px bg-gray-300 dark:bg-gray-600 flex-1 ${step === 'review' ? 'bg-green-600' : ''}`}></div>
            <div className={`flex items-center space-x-2 ${step === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                4
              </div>
              <span className="font-medium">Review & Confirm</span>
            </div>
          </div>
        </div>

        {/* Step 1: Module Selection */}
        {step === 'portal' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Portal
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Select the portal that best fits your organization's needs. 
                Each portal includes all modules within its category.
              </p>
            </div>

            {/* Pricing Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Simple Portal-Based Pricing</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                One flat fee of <span className="font-bold text-blue-600">$125</span> for subscription + first month, 
                then simple monthly pricing based on your portal selection.
              </p>
              <div className="flex justify-center gap-8 text-sm">
                <div>
                  <span className="font-semibold text-green-600">HR Portal:</span> $20/mo
                </div>
                <div>
                  <span className="font-semibold text-purple-600">Financial Portal:</span> $20/mo
                </div>
                <div>
                  <span className="font-semibold text-blue-600">Combined:</span> $37/mo
                </div>
              </div>
            </div>

            {/* Portal Options */}
            <div className="grid lg:grid-cols-3 gap-6">
              {PORTAL_OPTIONS.map((portal) => {
                const Icon = portal.icon;
                const isSelected = selectedPortal === portal.id;
                
                return (
                  <Card
                    key={portal.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                        : 'hover:shadow-md'
                    } ${portal.isBestValue ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}
                    onClick={() => setSelectedPortal(portal.id)}
                    data-testid={`portal-${portal.id}`}
                  >
                    <CardHeader className="text-center pb-2">
                      {portal.isBestValue && (
                        <Badge className="w-fit mx-auto mb-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                          Best Value
                        </Badge>
                      )}
                      <div className={`mx-auto p-4 rounded-full ${
                        portal.color === 'green' ? 'bg-green-100 text-green-600' :
                        portal.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl">{portal.name}</CardTitle>
                      <CardDescription>{portal.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-blue-600">
                          ${portal.monthlyPrice}
                        </div>
                        <div className="text-sm text-gray-500">/month after first payment</div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Includes:</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {portal.modules.map((module, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                              {module}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {isSelected && (
                        <div className="mt-4 flex justify-center">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Selected Summary */}
            {selectedOption && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Subscription Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Selected Portal</h4>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{selectedOption.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedOption.description}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>First Payment (Setup + Month 1):</span>
                        <span className="text-2xl font-bold text-green-600">${FIRST_PAYMENT}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span>Monthly after first payment:</span>
                          <span className="text-xl font-bold text-blue-600">${monthlyAfter}/mo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={() => setStep('details')} 
                disabled={!selectedPortal}
                size="lg"
                data-testid="button-next"
              >
                Next: Business Details
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Company Details */}
        {step === 'details' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Business Representative Information
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Provide details about your business representative who will manage this account.
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5" />
                      <span>Business Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corporation" data-testid="input-company-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type *</FormLabel>
                            <FormControl>
                              <select className="w-full p-2 border rounded-md" data-testid="select-business-type" {...field}>
                                <option value="">Select business type</option>
                                <option value="corporation">Corporation</option>
                                <option value="llc">Limited Liability Company</option>
                                <option value="partnership">Partnership</option>
                                <option value="sole_proprietorship">Sole Proprietorship</option>
                                <option value="ngo">Non-Governmental Organization</option>
                                <option value="government">Government Agency</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Employees *</FormLabel>
                            <FormControl>
                              <select className="w-full p-2 border rounded-md" data-testid="select-employees" {...field}>
                                <option value="">Select employee count</option>
                                <option value="1-10">1-10</option>
                                <option value="11-50">11-50</option>
                                <option value="51-200">51-200</option>
                                <option value="201-1000">201-1000</option>
                                <option value="1000+">1000+</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry *</FormLabel>
                          <FormControl>
                            <select className="w-full p-2 border rounded-md" data-testid="select-industry" {...field}>
                              <option value="">Select industry</option>
                              <option value="agriculture">Agriculture</option>
                              <option value="mining">Mining</option>
                              <option value="manufacturing">Manufacturing</option>
                              <option value="construction">Construction</option>
                              <option value="retail">Retail</option>
                              <option value="hospitality">Hospitality</option>
                              <option value="healthcare">Healthcare</option>
                              <option value="education">Education</option>
                              <option value="government">Government</option>
                              <option value="ngo">Non-Profit / NGO</option>
                              <option value="technology">Technology</option>
                              <option value="finance">Finance</option>
                              <option value="other">Other</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Complete business address including city and country" data-testid="textarea-business-address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Business Representative</span>
                    </CardTitle>
                    <CardDescription>
                      Information about the person who will be the primary contact for this account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="representativeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Representative Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" data-testid="input-representative-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="representativeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Representative Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@company.com" data-testid="input-representative-email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="representativePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Representative Phone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+231 777 666 999" data-testid="input-representative-phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('portal')}
                    data-testid="button-back-to-portal"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Portal Selection
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep('payment')}
                    size="lg"
                    data-testid="button-continue-to-payment"
                  >
                    Continue to Payment
                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Step 3: Payment Method Selection */}
        {step === 'payment' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Select Settlement & Payment Method
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Choose your preferred payment method. All options include instant portal activation.
              </p>
            </div>

            <div className="space-y-6">
              {/* Payment Summary */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-2 border-blue-200 dark:border-blue-900">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span>Subscription Rate Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white/80 dark:bg-gray-900/80 p-3 rounded-lg border">
                      <span className="text-xs text-gray-500 block">Initial Setup + 1st Month:</span>
                      <span className="text-2xl font-black text-emerald-600">${FIRST_PAYMENT} USD</span>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-900/80 p-3 rounded-lg border">
                      <span className="text-xs text-gray-500 block">Monthly Renewal After Month 1:</span>
                      <span className="text-2xl font-black text-blue-600">${monthlyAfter}/month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4 Selectable Payment Methods */}
              <div className="space-y-3">
                
                {/* 1. Direct Bank Wire */}
                <div 
                  onClick={() => setSelectedPaymentMethod('bank_transfer')}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'bank_transfer'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-600/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 mt-0.5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">Commercial Bank Wire (Ecobank Liberia)</h4>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">RECOMMENDED</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          Direct corporate transfer to <strong>Ecobank Liberia Limited</strong> (Account: <strong>6103394551</strong> | SWIFT: <strong>ECOCLRLM</strong>).
                        </p>
                        <p className="text-[11px] text-emerald-600 font-medium mt-1.5">
                          ✓ Instant account provisioning + Net-15 official invoice dispatched to your email
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPaymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                      {selectedPaymentMethod === 'bank_transfer' && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

                {/* 2. Mobile Money */}
                <div 
                  onClick={() => setSelectedPaymentMethod('mobile_money')}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'mobile_money'
                      ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-600/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 mt-0.5">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">Liberian Mobile Money (Orange / MTN)</h4>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">INSTANT</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          Pay via Orange Money (<strong>+231-777-666-999</strong>) or MTN Mobile Money (<strong>+231-887-666-999</strong>).
                        </p>
                        <p className="text-[11px] text-emerald-600 font-medium mt-1.5">
                          ✓ Instant account provisioning + SMS and email confirmation
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPaymentMethod === 'mobile_money' ? 'border-amber-600 bg-amber-600 text-white' : 'border-gray-300'}`}>
                      {selectedPaymentMethod === 'mobile_money' && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

                {/* 3. Credit or Debit Card */}
                <div 
                  onClick={() => setSelectedPaymentMethod('stripe')}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'stripe'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md ring-2 ring-indigo-600/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 mt-0.5">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">Credit / Debit Card (Stripe)</h4>
                          <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">INTERNATIONAL</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          Visa, Mastercard, American Express, or Discover with encrypted checkout.
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPaymentMethod === 'stripe' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'}`}>
                      {selectedPaymentMethod === 'stripe' && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

                {/* 4. Corporate Net 30 Invoice */}
                <div 
                  onClick={() => setSelectedPaymentMethod('invoice')}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'invoice'
                      ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 shadow-md ring-2 ring-purple-600/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 mt-0.5">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">Corporate Invoice Billing (Net 30)</h4>
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">ENTERPRISE</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          Receive an official corporate PO invoice with Net 30 payment terms for finance departments.
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPaymentMethod === 'invoice' ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'}`}>
                      {selectedPaymentMethod === 'invoice' && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep('details')}
                  data-testid="button-back-to-details"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Details
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setStep('review')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="button-review-order"
                >
                  Review Order
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 'review' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Review Your Order
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Please review your selections and company information before completing registration.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>Company Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-300">Company Name</Label>
                    <p className="font-medium" data-testid="review-company-name">{form.watch('companyName') || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-300">Business Type</Label>
                    <p className="font-medium" data-testid="review-business-type">{form.watch('businessType') || 'Not selected'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-300">Industry</Label>
                    <p className="font-medium" data-testid="review-industry">{form.watch('industry') || 'Not selected'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-300">Employees</Label>
                    <p className="font-medium" data-testid="review-employees">{form.watch('employees') || 'Not selected'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-300">Business Address</Label>
                    <p className="font-medium" data-testid="review-business-address">{form.watch('businessAddress') || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-300">Business Representative</Label>
                    <p className="font-medium" data-testid="review-representative">
                      {form.watch('representativeName')} ({form.watch('representativeEmail')})
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300" data-testid="review-representative-phone">
                      {form.watch('representativePhone')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                      Selected Portal
                    </Label>
                    {selectedOption && (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm" data-testid="review-portal">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="font-medium">{selectedOption.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                          {selectedOption.description}
                        </p>
                        <div className="mt-2 ml-6">
                          <span className="text-xs font-medium text-gray-500">Includes:</span>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-0.5">
                            {selectedOption.modules.slice(0, 5).map((module, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle className="w-2 h-2 text-green-500 mr-1" />
                                {module}
                              </li>
                            ))}
                            {selectedOption.modules.length > 5 && (
                              <li className="text-gray-500">+ {selectedOption.modules.length - 5} more modules</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>First Payment (Setup + Month 1):</span>
                      <span className="font-medium text-green-600" data-testid="review-first-payment">${FIRST_PAYMENT}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Monthly after first payment:</span>
                      <span className="text-blue-600" data-testid="review-monthly-total">${monthlyAfter}/month</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Selected Settlement Method</h4>
                        <p className="text-sm font-bold text-blue-600" data-testid="review-payment-method">
                          {selectedPaymentMethod === 'bank_transfer' && 'Commercial Bank Wire (Ecobank Liberia - 6103394551)'}
                          {selectedPaymentMethod === 'mobile_money' && 'Liberian Mobile Money (Orange: +231-777-666-999 | MTN: +231-887-666-999)'}
                          {selectedPaymentMethod === 'stripe' && 'International Credit / Debit Card (Stripe)'}
                          {selectedPaymentMethod === 'invoice' && 'Corporate Net 30 Invoice Billing'}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium mt-1">
                          ✓ Your account and login credentials will be generated immediately upon submission.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep('payment')}
                className="w-full sm:w-auto order-2 sm:order-1"
                data-testid="button-back-to-payment"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Payment
              </Button>
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={registerMutation.isPending}
                size="lg"
                className="w-full sm:w-auto sm:px-8 order-1 sm:order-2"
                data-testid="button-complete-registration"
              >
                {registerMutation.isPending ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Creating Account...</span>
                    <span className="sm:hidden">Creating...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Complete Registration</span>
                    <span className="sm:hidden">Register</span>
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}