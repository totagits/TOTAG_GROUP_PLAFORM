import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowLeft, Shield, Mail } from "lucide-react";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Login attempt with:", credentials.username);
      
      // Admin credentials for TOTAG Group
      const adminAccounts = {
        "totag_admin": { password: "totag2025", role: "Corporate Administrator", department: "Executive Management" },
        "communication_manager": { password: "comm2025", role: "Communications Manager", department: "Corporate Communications" },
        "operations_director": { password: "ops2025", role: "Operations Director", department: "Operations Management" }
      };

      const account = adminAccounts[credentials.username as keyof typeof adminAccounts];
      console.log("Found account:", account ? "Yes" : "No");
      
      if (account && account.password === credentials.password) {
        console.log("Password match, creating session...");
        
        // Store admin session
        const adminUser = {
          id: credentials.username,
          username: credentials.username,
          role: account.role,
          department: account.department,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem("totagAdmin", JSON.stringify(adminUser));
        console.log("Session stored, redirecting...");
        
        toast({
          title: "Login Successful",
          description: `Welcome ${account.role}`,
        });

        // Small delay to ensure toast shows
        setTimeout(() => {
          window.location.href = "/admin-dashboard";
        }, 1000);
      } else {
        console.log("Login failed - invalid credentials");
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to TOTAG Group
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">TOTAG Group Admin</CardTitle>
            <CardDescription className="text-gray-600">
              Access the administrative dashboard for corporate management
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Signing In...
                  </div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Access Admin Dashboard
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Demo Admin Accounts:</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div><strong>totag_admin</strong> / totag2025 (Corporate Administrator)</div>
                <div><strong>communication_manager</strong> / comm2025 (Communications Manager)</div>
                <div><strong>operations_director</strong> / ops2025 (Operations Director)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}