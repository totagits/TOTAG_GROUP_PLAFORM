import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Lock, User, ArrowLeft } from "lucide-react";
import cateringLogo from "@assets/Logo for TOTAG Catering1(1)_1752602584482.png";

export default function CateringOpsLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/catering/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.success) {
        toast({ title: "Login Failed", description: data.error, variant: "destructive" });
        return;
      }
      localStorage.setItem("catering_token", data.token);
      localStorage.setItem("catering_user", JSON.stringify(data.user));
      toast({ title: "Welcome", description: `Logged in as ${data.user.firstName} ${data.user.lastName}` });
      navigate("/catering/ops/dashboard");
    } catch {
      toast({ title: "Error", description: "Connection failed. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={cateringLogo} alt="TOTAG Catering" className="w-20 h-20 mx-auto mb-3 object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">TOCEPS Staff Portal</h1>
          <p className="text-gray-600 text-sm">TOTAG Catering & Events Planning Services</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Staff Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="username" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-xs text-gray-400 mt-4 text-center">Contact your administrator for login credentials.</p>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/catering")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Catering
          </Button>
        </div>
      </div>
    </div>
  );
}
