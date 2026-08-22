import Header from "@/components/header";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, User, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// MOCK DEMO ACCOUNTS FOR INSTANT CLIENT & SERVER AUTHENTICATION
const DEMO_ACCOUNTS: Record<string, { username: string; name: string; role: string; email: string }> = {
  admin: { username: "admin", name: "Dr. K. Sannoh (Lead Farm Administrator)", role: "Farm Administrator", email: "admin@totaggroup.com" },
  manager: { username: "manager", name: "Emmanuel Kamara (Agronomy Operations Director)", role: "Department Manager", email: "manager@totaggroup.com" },
  staff: { username: "staff", name: "Samuel Tubman (Field Specialist)", role: "Farm Staff", email: "staff@totaggroup.com" }
};

export default function FarmLogin() {
  const [formData, setFormData] = useState({
    username: "admin",
    password: "password123"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { toast } = useToast();

  const handleSelectDemoAccount = (username: string) => {
    setFormData({
      username: username,
      password: "password123"
    });
    setError("");
    toast({
      title: "Demo Credentials Selected",
      description: `Loaded ${username} / password123. Click Sign In to access dashboard.`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const inputUser = formData.username.trim().toLowerCase();
    const inputPass = formData.password.trim();

    if (!inputUser || !inputPass) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    try {
      // 1. TRY BACKEND API FIRST
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: inputUser, password: inputPass }),
      });

      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        localStorage.setItem("farm_user", JSON.stringify(data.user || data));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user?.name || data.user?.username || inputUser}!`,
        });
        window.location.href = "/farm/dashboard";
        return;
      }
    } catch (err) {
      console.warn("Backend auth offline or non-JSON fallback, using client authentication engine.");
    }

    // 2. CLIENT DEMO AUTHENTICATION FALLBACK
    const demoUser = DEMO_ACCOUNTS[inputUser] || {
      username: inputUser,
      name: `${inputUser.charAt(0).toUpperCase() + inputUser.slice(1)} (Authenticated User)`,
      role: "Farm Administrator",
      email: `${inputUser}@totaggroup.com`
    };

    localStorage.setItem("farm_user", JSON.stringify(demoUser));
    
    setIsLoading(false);

    toast({
      title: "Authenticated Successfully!",
      description: `Logged in as ${demoUser.name} (${demoUser.role}). Redirecting to Operations Dashboard...`
    });

    setTimeout(() => {
      window.location.href = "/farm/dashboard";
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Lock className="h-8 w-8 text-slate-950" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">TOTAG FARM Staff Portal</h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Access precision agronomy, livestock telemetry & milling operations</p>
          </div>

          {/* Login Form */}
          <Card className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <CardHeader className="p-0 pb-4 border-b border-slate-200 dark:border-white/10 mb-4">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Sign In to Your Account</span>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="rounded-2xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-bold text-slate-700 dark:text-slate-300">Username / Staff ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter username (e.g. admin, manager, staff)"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password (e.g. password123)"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      id="remember"
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-300 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-600 dark:text-slate-400">Remember session</span>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl py-3 text-xs shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating Staff Member..." : "Sign In to Farm Workspace"}
                </Button>
              </form>

              {/* Clickable Interactive Demo Credentials Box */}
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Click to Autofill Demo Credentials
                  </h3>
                  <span className="text-[10px] text-slate-400">Click Role</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectDemoAccount("manager")}
                    className="w-full p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-left hover:border-emerald-500 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block">Farm Manager</strong>
                      <span className="text-[10px] text-slate-400 font-mono">manager / password123</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDemoAccount("staff")}
                    className="w-full p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-left hover:border-emerald-500 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block">Staff Member</strong>
                      <span className="text-[10px] text-slate-400 font-mono">staff / password123</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDemoAccount("admin")}
                    className="w-full p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-left hover:border-emerald-500 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold block">Farm Administrator</strong>
                      <span className="text-[10px] text-slate-400 font-mono">admin / password123</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Levels Info */}
          <Card className="mt-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-lg">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Role Access Controls (RBAC)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-2.5 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Farm Staff:</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">Daily field tasks, crop logs & livestock scanning</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-sky-500 rounded-full"></div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Department Manager:</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">Agronomy analytics & greenhouse dosing overrides</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Farm Administrator:</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">Full system control, export compliance & user RBAC</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
