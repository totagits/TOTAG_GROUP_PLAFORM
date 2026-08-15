import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Building2, UserCircle, Lock, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import tgmLogo from "@assets/Logo for TGM_1753450516331.png";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    department: string;
    isActive: boolean;
  };
  token: string;
}

export default function TGMEnterpriseLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials): Promise<LoginResponse> => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Store user session data
      localStorage.setItem("tgm_user", JSON.stringify(data.user));
      localStorage.setItem("tgm_token", data.token);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.firstName}!`,
      });

      // Redirect based on user role
      setLocation("/tgm-enterprise-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate(credentials);
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Demo accounts for different roles
  const demoAccounts = [
    { role: "General Manager", username: "gm_admin", department: "Management" },
    { role: "Wholesale Head", username: "wholesale_head", department: "Wholesale Operations" },
    { role: "Retail Head", username: "retail_head", department: "Retail & Merchandising" },
    { role: "Inventory Manager", username: "inventory_mgr", department: "Inventory & Procurement" },
    { role: "Logistics Manager", username: "logistics_mgr", department: "Logistics & Distribution" },
    { role: "Sales Team", username: "sales_team", department: "Sales & Customer Relations" },
    { role: "Finance/HR", username: "finance_hr", department: "Finance, HR & Administration" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/general-merchandise" className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to TGM Platform</span>
            </Link>
            <div className="flex items-center space-x-3">
              <img 
                src={tgmLogo} 
                alt="TGM Logo" 
                className="h-8 w-8 rounded-full bg-white p-1"
                style={{
                  clipPath: 'circle(50%)',
                  objectFit: 'cover'
                }}
              />
              <span className="text-lg font-semibold text-gray-900">TGM Enterprise Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Login Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-emerald-100 rounded-full w-fit">
                  <Building2 className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Employee Access Portal
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to access your TGM Enterprise dashboard with role-based permissions
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={credentials.username}
                        onChange={handleInputChange("username")}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={handleInputChange("password")}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <Alert className="mt-4">
                  <AlertDescription className="text-sm text-gray-600">
                    For demo purposes, use any username from the role list with password: <code className="bg-gray-100 px-1 rounded">demo123</code>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Role Information */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Enterprise Role-Based Access Control
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our comprehensive platform provides specialized access based on your role within TGM operations.
              </p>
            </div>

            <div className="grid gap-4">
              {demoAccounts.map((account, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setCredentials({ username: account.username, password: "demo123" })}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.role}</h3>
                      <p className="text-sm text-gray-600">{account.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-emerald-600">{account.username}</p>
                      <p className="text-xs text-gray-500">Click to auto-fill</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-900 mb-2">Access Features Include:</h3>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li>• Wholesale order management and approval workflows</li>
                <li>• Retail sales tracking across multiple outlets</li>
                <li>• Real-time inventory management with automated alerts</li>
                <li>• Supplier relationship and rating management</li>
                <li>• Logistics tracking across West Africa regions</li>
                <li>• Comprehensive activity logging and audit trails</li>
                <li>• Role-specific dashboards and analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}