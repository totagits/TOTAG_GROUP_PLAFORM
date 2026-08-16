import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowLeft, Shield, KeyRound, Sparkles, CheckCircle2 } from "lucide-react";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLoginSuccess = (userKey: string, role: string, department: string) => {
    const adminUser = {
      id: userKey,
      username: userKey,
      role: role,
      department: department,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem("totagAdmin", JSON.stringify(adminUser));
    
    toast({
      title: "Login Successful",
      description: `Welcome to TOTAG Ecosystem as ${role}`,
    });

    setTimeout(() => {
      window.location.href = "/admin-dashboard";
    }, 400);
  };

  const handleQuickLogin = (username: string) => {
    setIsLoading(true);
    if (username === "totag_admin") {
      handleLoginSuccess("totag_admin", "Corporate Administrator", "Executive Management");
    } else if (username === "communication_manager") {
      handleLoginSuccess("communication_manager", "Communications Manager", "Corporate Communications");
    } else if (username === "operations_director") {
      handleLoginSuccess("operations_director", "Operations Director", "Operations Management");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const inputUser = credentials.username.trim().toLowerCase();
    const inputPass = credentials.password.trim();

    if (
      (inputUser === "totag_admin" || inputUser === "admin") && 
      (inputPass === "totag2025" || inputPass === "admin" || inputPass === "totag")
    ) {
      handleLoginSuccess("totag_admin", "Corporate Administrator", "Executive Management");
      return;
    }

    if (inputUser === "communication_manager" && (inputPass === "comm2025" || inputPass === "comm")) {
      handleLoginSuccess("communication_manager", "Communications Manager", "Corporate Communications");
      return;
    }

    if (inputUser === "operations_director" && (inputPass === "ops2025" || inputPass === "ops")) {
      handleLoginSuccess("operations_director", "Operations Director", "Operations Management");
      return;
    }

    // Default fallback to allow access for demo purposes
    if (inputUser.length > 0) {
      handleLoginSuccess(inputUser, "Corporate Administrator", "Executive Management");
      return;
    }

    toast({
      title: "Login Failed",
      description: "Please enter your username and password",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        
        {/* Back Button */}
        <div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to TOTAG Corporate Front Door
            </Button>
          </Link>
        </div>

        <Card className="glass-card bg-slate-950/80 border-white/10 shadow-2xl p-2">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto p-3 bg-emerald-500/20 rounded-2xl w-14 h-14 flex items-center justify-center border border-emerald-500/30">
              <Shield className="h-7 w-7 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">TOTAG Group Admin Portal</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Access the TOTAG Enterprise Digital Ecosystem Control Center
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-semibold text-slate-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="totag_admin"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="w-full bg-slate-900 border-white/10 text-white text-xs"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="totag2025"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full bg-slate-900 border-white/10 text-white text-xs"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-5 text-xs rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Ecosystem Control Center"}
              </Button>
            </form>

            {/* One-Click Quick Login Demo Accounts */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> One-Click Quick Demo Login:
                </h4>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={() => handleQuickLogin("totag_admin")}
                  variant="outline"
                  size="sm"
                  className="w-full justify-between bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-white text-xs py-4"
                >
                  <span className="font-bold">totag_admin</span>
                  <span className="text-[10px]">Corporate Administrator →</span>
                </Button>

                <Button 
                  onClick={() => handleQuickLogin("communication_manager")}
                  variant="outline"
                  size="sm"
                  className="w-full justify-between bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 text-xs py-4"
                >
                  <span className="font-bold">communication_manager</span>
                  <span className="text-[10px]">Comms Manager →</span>
                </Button>

                <Button 
                  onClick={() => handleQuickLogin("operations_director")}
                  variant="outline"
                  size="sm"
                  className="w-full justify-between bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 text-xs py-4"
                >
                  <span className="font-bold">operations_director</span>
                  <span className="text-[10px]">Ops Director →</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}