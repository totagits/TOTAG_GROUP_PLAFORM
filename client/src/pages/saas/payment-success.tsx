import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Building2, Mail, Key, ArrowRight, Loader2, XCircle, Copy, Check, ShieldCheck, Landmark } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccessPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isDirect = urlParams.get('direct') === 'true';
    const sessionId = urlParams.get('session_id');
    const registrationId = urlParams.get('registration_id');

    // 1. Direct activation from Bank Transfer, Mobile Money, or Corporate Invoice
    if (isDirect) {
      try {
        const stored = sessionStorage.getItem('saas_registration_result');
        if (stored) {
          const data = JSON.parse(stored);
          setRegistrationData(data);
          setStatus('success');
          return;
        }
      } catch (e) {}
    }

    // 2. Stripe checkout return
    if (sessionId && registrationId) {
      const verifyPayment = async () => {
        try {
          const data = await apiRequest('/api/saas/auth/verify-payment', {
            method: 'POST',
            body: JSON.stringify({ sessionId, registrationId }),
          });

          if (data.success) {
            setRegistrationData(data.data);
            setStatus('success');
          } else {
            setStatus('error');
            setError(data.error || 'Payment verification failed.');
          }
        } catch (err: any) {
          setStatus('error');
          setError(err.message || 'Failed to verify payment.');
        }
      };
      verifyPayment();
      return;
    }

    // Fallback: check if stored session exists anyway
    try {
      const stored = sessionStorage.getItem('saas_registration_result');
      if (stored) {
        setRegistrationData(JSON.parse(stored));
        setStatus('success');
        return;
      }
    } catch (e) {}

    setStatus('error');
    setError('No active registration session found. Please complete the registration process.');
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast({ title: 'Copied!', description: `${type} copied to clipboard.` });
    setTimeout(() => setCopied(null), 2000);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-6 shadow-xl">
          <CardContent className="pt-6">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Activating Your Portal Account</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Please wait while our system provisions your enterprise modules and database...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-3">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600 font-bold">Registration Verification Notice</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              You can restart your subscription registration or proceed directly to the sign-in portal.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/saas/register">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Return to SaaS Registration</Button>
              </Link>
              <Link href="/saas/login">
                <Button variant="outline" className="w-full">Go to Portal Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const portalTitle = registrationData?.portalType === 'combined' 
    ? 'Combined HRMIS & Financial Enterprise Suite' 
    : registrationData?.portalType === 'financial' 
      ? 'Financial Information Management System (FIMS)' 
      : 'Human Resource Management Information System (HRMIS)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 py-8 px-4">
      {/* Brand Header */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center bg-white/90 dark:bg-gray-900/90 p-4 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">TOTAG IT Services & SaaS Platform</h1>
            <p className="text-xs text-gray-500">Enterprise Digital Operations</p>
          </div>
        </div>
        <Link href="/saas">
          <Button variant="ghost" size="sm">Back to SaaS Overview</Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-emerald-200 dark:border-emerald-900 shadow-2xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-8 text-center relative overflow-hidden">
            <div className="mx-auto w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Subscription Successfully Activated!
            </h2>
            <p className="text-emerald-300 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Your enterprise organization is provisioned and ready for immediate deployment.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            
            {/* Account & Subscription Overview */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-gray-900/50 p-4 rounded-xl border">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Organization Name</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{registrationData?.companyName}</p>
                <p className="text-xs text-slate-500 mt-1">Tenant Slug: <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{registrationData?.tenantSlug}</span></p>
              </div>

              <div className="bg-slate-50 dark:bg-gray-900/50 p-4 rounded-xl border">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected Portal</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{portalTitle}</p>
                <p className="text-xs text-emerald-600 font-bold mt-1">Initial Rate: $125.00 | Renewal: ${registrationData?.monthlyPrice}/mo</p>
              </div>
            </div>

            {/* Login Credentials Box */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-base flex items-center gap-2">
                  <Key className="w-5 h-5 text-emerald-600" />
                  Your Administrator Login Credentials
                </h3>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">READY TO USE</span>
              </div>

              <div className="space-y-3 bg-white dark:bg-gray-900 p-4 rounded-lg border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Portal Login URL</p>
                    <p className="font-mono text-sm font-bold text-blue-600">https://totaggroup.com/saas/login</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard('https://totaggroup.com/saas/login', 'Login URL')}>
                    {copied === 'Login URL' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </Button>
                </div>

                <div className="border-t pt-2 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Admin Email</p>
                    <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">{registrationData?.email}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(registrationData?.email, 'Email')}>
                    {copied === 'Email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </Button>
                </div>

                <div className="border-t pt-2 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Temporary Password</p>
                    <p className="font-mono text-base font-black text-emerald-600 tracking-wider">{registrationData?.temporaryPassword}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(registrationData?.temporaryPassword, 'Password')}>
                    {copied === 'Password' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                These credentials have also been dispatched to <strong>{registrationData?.email}</strong>. You will be prompted to set your permanent password upon first sign-in.
              </p>
            </div>

            {/* Bank Settlement Reference Box */}
            <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-5 text-sm">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 mb-2">
                <Landmark className="w-4 h-4 text-amber-600" />
                Official Bank Settlement Instructions (Ecobank Liberia)
              </h4>
              <p className="text-amber-900 dark:text-amber-300 text-xs leading-relaxed">
                <strong>Bank Transfer:</strong> TOTAG Group of Companies Ltd | <strong>Bank:</strong> Ecobank Liberia Limited<br/>
                <strong>Account Number:</strong> 6103394551 | <strong>SWIFT:</strong> ECOCLRLM | <strong>Branch:</strong> 11th Street Sinkor, Monrovia<br/>
                <strong>Mobile Money:</strong> +231-777-100-001 (Orange / MTN) | <strong>Ref:</strong> SaaS-{registrationData?.tenantSlug?.toUpperCase()}
              </p>
            </div>

            {/* Launch Button */}
            <div className="pt-2">
              <Link href="/saas/login">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold py-6 shadow-lg shadow-blue-500/20 rounded-xl">
                  Launch Enterprise Portal &amp; Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
