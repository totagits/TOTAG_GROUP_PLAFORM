import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { 
  Building2, 
  ArrowLeft,
  LogIn,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function SaaSLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => apiRequest('/api/saas/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (response) => {
      // Check if password change is required
      if (response.requirePasswordChange) {
        toast({
          title: "Password Change Required",
          description: response.data.message,
          variant: "default",
        });
        
        // Redirect to change password page with user info - use window.location for query params
        window.location.href = `/saas/change-password?userId=${response.data.userId}&email=${encodeURIComponent(response.data.email)}`;
        return;
      }

      // Store the JWT token and user data
      localStorage.setItem('saas_token', response.data.token);
      localStorage.setItem('saas_user', JSON.stringify(response.data.user));
      localStorage.setItem('saas_tenant', JSON.stringify(response.data.tenant));
      
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${response.data.user.firstName}!`,
      });
      
      // Redirect to tenant dashboard
      setLocation('/saas/dashboard');
    },
    onError: (error: any) => {
      console.log("Login error:", error);
      
      // Handle authentication errors gracefully
      const message = error?.isAuthError || error?.status === 401
        ? "Invalid email or password. Please check your credentials and try again."
        : error?.message || "Login failed. Please try again.";
        
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">Enterprise Login</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">New to TOTAG Enterprise?</span>
              <Link href="/saas/register">
                <Button variant="outline" data-testid="button-register">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Access your TOTAG Enterprise FIMS & HRMIS platform
            </p>
          </div>

          {/* Login Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LogIn className="w-5 h-5" />
                <span>Enterprise Login</span>
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your organization's systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@company.com"
                            data-testid="input-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              data-testid="input-password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              data-testid="button-toggle-password"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link href="/saas/forgot-password" className="text-blue-600 hover:text-blue-500">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loginMutation.isPending}
                    data-testid="button-sign-in"
                  >
                    {loginMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Important Notice - Development Mode */}
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-sm text-amber-800 dark:text-amber-200 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Development Mode Notice
              </CardTitle>
              <CardDescription className="text-xs text-amber-700 dark:text-amber-300">
                In-memory storage means tenant data resets on server restart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-amber-800 dark:text-amber-200">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded border">
                <p className="font-medium mb-2">If you just subscribed:</p>
                <p>Your tenant data may have been reset due to server restart. You have two options:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-xs">
                  <li>Use the demo credentials below to explore the platform</li>
                  <li>Re-register your tenant through the subscription process</li>
                </ol>
              </div>
              
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded border">
                <p className="font-medium mb-2">If you have existing credentials:</p>
                <p>Enter them above. If you forgot your password or didn't receive your credentials email, contact support.</p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-sm text-green-800 dark:text-green-200">Demo Credentials (Acme Corp Tenant)</CardTitle>
              <CardDescription className="text-xs text-green-700 dark:text-green-300">
                Use these to explore the full platform functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs">
                <p className="font-medium">Email:</p>
                <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded text-xs">admin@acme-corp.com</code>
              </div>
              <div className="text-xs">
                <p className="font-medium">Password:</p>
                <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded text-xs">password123</code>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-green-300 text-green-700 hover:bg-green-100"
                onClick={() => {
                  form.setValue('email', 'admin@acme-corp.com');
                  form.setValue('password', 'password123');
                }}
                data-testid="button-use-demo"
              >
                Use Demo Credentials
              </Button>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Need help accessing your account?{' '}
              <Link href="/saas/support" className="text-blue-600 hover:text-blue-500">
                Contact Support
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              Powered by{' '}
              <Link href="/" className="text-blue-600 hover:text-blue-500">
                TOTAG Group of Companies Ltd
              </Link>
            </p>
            <p className="mt-1">Managed IT Services Division</p>
          </div>
        </div>
      </div>
    </div>
  );
}