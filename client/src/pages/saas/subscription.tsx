import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Link, useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Check, 
  CreditCard,
  Shield,
  DollarSign,
  Clock,
  Settings,
  ExternalLink,
  Users,
  Wallet,
  Sparkles
} from 'lucide-react';

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

// $125 is the total for setup + first month (not charged separately)
const FIRST_PAYMENT = 125;

export default function SubscriptionPage() {
  const [selectedPortal, setSelectedPortal] = useState<PortalType>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      toast({
        title: 'Subscription Successful!',
        description: 'Your portal has been activated. Welcome to TOTAG SaaS!',
      });
      setLocation('/saas/dashboard');
    }
  }, [toast, setLocation]);

  const checkoutMutation = useMutation({
    mutationFn: async (portalType: PortalType) => {
      const response = await apiRequest('/api/saas/stripe/portal-checkout', { 
        method: 'POST', 
        body: JSON.stringify({ portalType }) 
      });
      return response;
    },
    onSuccess: (data: any) => {
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast({
          title: 'Checkout Error',
          description: data.error || 'Unable to create checkout session. Please try again.',
          variant: 'destructive'
        });
        setIsProcessing(false);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Checkout Error',
        description: error.message || 'Failed to initialize checkout',
        variant: 'destructive'
      });
      setIsProcessing(false);
    }
  });

  const portalMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/saas/stripe/portal', { 
        method: 'POST', 
        body: JSON.stringify({}) 
      });
      return response;
    },
    onSuccess: (data: any) => {
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast({
          title: 'Portal Error',
          description: 'Unable to open billing portal. Please try again.',
          variant: 'destructive'
        });
      }
    },
    onError: () => {
      toast({
        title: 'Portal Error',
        description: 'Failed to open billing portal',
        variant: 'destructive'
      });
    }
  });

  const selectedOption = PORTAL_OPTIONS.find(p => p.id === selectedPortal);
  const totalFirstMonth = FIRST_PAYMENT; // $125 includes setup + first month
  const monthlyAfter = selectedOption?.monthlyPrice || 0;

  const handleCheckout = async () => {
    if (!selectedPortal) {
      toast({
        title: 'Select a Portal',
        description: 'Please select a portal subscription to proceed.',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    checkoutMutation.mutate(selectedPortal);
  };

  const handleManageSubscription = () => {
    portalMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/saas/dashboard">
              <Button variant="outline" size="sm" data-testid="button-back-to-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManageSubscription}
              disabled={portalMutation.isPending}
              data-testid="button-manage-subscription"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            TOTAG SaaS Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Choose your portal and subscribe with secure Stripe payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span>Choose Your Portal</span>
                </CardTitle>
                <CardDescription>
                  Select the portal that best fits your organization's needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {PORTAL_OPTIONS.map((portal) => {
                  const Icon = portal.icon;
                  const isSelected = selectedPortal === portal.id;
                  
                  return (
                    <div
                      key={portal.id}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      } ${portal.isBestValue ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}
                      onClick={() => setSelectedPortal(portal.id)}
                      data-testid={`portal-${portal.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${
                            portal.color === 'green' ? 'bg-green-100 text-green-600' :
                            portal.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                {portal.name}
                              </h3>
                              {portal.isBestValue && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  Best Value
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {portal.description}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {portal.modules.map((module, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {module}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            ${portal.monthlyPrice}
                          </div>
                          <div className="text-sm text-gray-500">/month</div>
                          {isSelected && (
                            <Check className="w-6 h-6 text-green-600 mt-2 ml-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span>Secure Payment with Stripe</span>
                </CardTitle>
                <CardDescription>
                  Your payment is processed securely by Stripe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                  <CreditCard className="w-8 h-8 text-indigo-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Credit or Debit Card
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pay securely with Visa, Mastercard, American Express, or Discover
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Secure
                  </Badge>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>256-bit SSL encryption | PCI-DSS compliant</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedOption ? (
                  <p className="text-gray-500 text-center py-4">
                    Select a portal to see pricing
                  </p>
                ) : (
                  <>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {selectedOption.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedOption.description}
                      </p>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Subscription + First Month</span>
                      <span>${FIRST_PAYMENT.toFixed(2)} USD</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      (includes setup and first month access)
                    </div>

                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mt-4">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Then ${monthlyAfter.toFixed(2)}/month starting next billing cycle
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span>What You Get</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Platform setup and configuration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Recurring monthly billing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>24/7 customer support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Regular updates & new features</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Cancel anytime from billing portal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full"
              onClick={handleCheckout}
              disabled={!selectedPortal || isProcessing}
              data-testid="button-subscribe"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Subscribe - ${totalFirstMonth.toFixed(2)} Today
                  <ExternalLink className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-gray-500">
              You'll be redirected to Stripe's secure checkout to complete payment
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Portal</th>
                      <th className="text-center py-3 px-4">Setup + First Month</th>
                      <th className="text-center py-3 px-4">Monthly After</th>
                      <th className="text-center py-3 px-4">Modules</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">HR Management Portal</td>
                      <td className="text-center py-3 px-4">${FIRST_PAYMENT}.00</td>
                      <td className="text-center py-3 px-4">$20.00/month</td>
                      <td className="text-center py-3 px-4">7 modules</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Financial Management Portal</td>
                      <td className="text-center py-3 px-4">${FIRST_PAYMENT}.00</td>
                      <td className="text-center py-3 px-4">$20.00/month</td>
                      <td className="text-center py-3 px-4">8 modules</td>
                    </tr>
                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                      <td className="py-3 px-4 font-medium">
                        Combined Portals
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800">Best Value</Badge>
                      </td>
                      <td className="text-center py-3 px-4">${FIRST_PAYMENT}.00</td>
                      <td className="text-center py-3 px-4">$37.00/month</td>
                      <td className="text-center py-3 px-4">15 modules</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
