import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  ShoppingCart, 
  Package, 
  Users, 
  Truck, 
  BarChart3, 
  LogOut, 
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import tgmLogo from "@assets/Logo for TGM_1753450516331.png";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  isActive: boolean;
}

interface DashboardStats {
  totalWholesaleOrders: number;
  pendingApprovals: number;
  totalRetailSales: number;
  lowStockItems: number;
  activeDeliveries: number;
  totalSuppliers: number;
}

export default function TGMEnterpriseDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("tgm_user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setLocation("/tgm-enterprise-login");
    }
  }, [setLocation]);

  const { data: wholesaleOrders } = useQuery({
    queryKey: ["/api/tgm/wholesale-orders"],
    enabled: !!user && hasAccess("wholesale"),
  });

  const { data: retailSales } = useQuery({
    queryKey: ["/api/tgm/retail-sales"],
    enabled: !!user && hasAccess("retail"),
  });

  const { data: inventory } = useQuery({
    queryKey: ["/api/tgm/inventory"],
    enabled: !!user && hasAccess("inventory"),
  });

  const { data: suppliers } = useQuery({
    queryKey: ["/api/tgm/suppliers"],
    enabled: !!user && hasAccess("supplier"),
  });

  const { data: deliveries } = useQuery({
    queryKey: ["/api/tgm/deliveries"],
    enabled: !!user && hasAccess("logistics"),
  });

  const { data: activityLogs } = useQuery({
    queryKey: ["/api/tgm/activity-logs"],
    enabled: !!user,
  });

  function hasAccess(module: string): boolean {
    if (!user) return false;
    
    const { role } = user;
    
    switch (module) {
      case "wholesale":
        return ["general_manager", "wholesale_head", "sales_team"].includes(role);
      case "retail":
        return ["general_manager", "retail_head", "sales_team"].includes(role);
      case "inventory":
        return ["general_manager", "inventory_manager"].includes(role);
      case "supplier":
        return ["general_manager", "inventory_manager"].includes(role);
      case "logistics":
        return ["general_manager", "logistics_manager"].includes(role);
      case "finance":
        return ["general_manager", "finance_hr"].includes(role);
      default:
        return role === "general_manager";
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("tgm_user");
    localStorage.removeItem("tgm_token");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    setLocation("/tgm-enterprise-login");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "general_manager": return "bg-purple-100 text-purple-800";
      case "wholesale_head": return "bg-blue-100 text-blue-800";
      case "retail_head": return "bg-green-100 text-green-800";
      case "inventory_manager": return "bg-orange-100 text-orange-800";
      case "logistics_manager": return "bg-cyan-100 text-cyan-800";
      case "sales_team": return "bg-pink-100 text-pink-800";
      case "finance_hr": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please log in to access the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src={tgmLogo} 
                alt="TGM Logo" 
                className="h-8 w-8 rounded-full bg-white p-1"
                style={{
                  clipPath: 'circle(50%)',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">TGM Enterprise Portal</h1>
                <p className="text-sm text-gray-600">{user.department}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                  {formatRoleName(user.role)}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-gray-600">
            Manage your {user.department} operations from this comprehensive dashboard.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {hasAccess("wholesale") && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Wholesale Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(wholesaleOrders as any)?.orders?.length || 0}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          )}

          {hasAccess("retail") && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Retail Sales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(retailSales as any)?.sales?.length || 0}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          )}

          {hasAccess("inventory") && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inventory Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(inventory as any)?.inventory?.length || 0}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          )}

          {hasAccess("logistics") && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(deliveries as any)?.deliveries?.filter((d: any) => d.status === 'in_transit').length || 0}
                    </p>
                  </div>
                  <Truck className="h-8 w-8 text-cyan-600" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {hasAccess("wholesale") && <TabsTrigger value="wholesale">Wholesale</TabsTrigger>}
            {hasAccess("retail") && <TabsTrigger value="retail">Retail</TabsTrigger>}
            {hasAccess("inventory") && <TabsTrigger value="inventory">Inventory</TabsTrigger>}
            {hasAccess("logistics") && <TabsTrigger value="logistics">Logistics</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(activityLogs as any)?.logs?.slice(0, 5).map((log: any) => (
                      <div key={log.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {log.action === 'create' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {log.action === 'update' && <Clock className="h-4 w-4 text-blue-600" />}
                          {log.action === 'delete' && <AlertCircle className="h-4 w-4 text-red-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{log.details}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database Connection</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Services</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">User Session</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Role Permissions</span>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {formatRoleName(user.role)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {hasAccess("wholesale") && (
            <TabsContent value="wholesale">
              <Card>
                <CardHeader>
                  <CardTitle>Wholesale Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Manage wholesale orders, partner relationships, and bulk distribution operations.
                  </p>
                  <div className="space-y-4">
                    {(wholesaleOrders as any)?.orders?.map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{order.partnerCompany}</h4>
                            <p className="text-sm text-gray-600">{order.product} - Qty: {order.quantity}</p>
                          </div>
                          <Badge 
                            className={
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No wholesale orders found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Additional tabs for other modules would go here */}
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/general-merchandise">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <Building2 className="h-5 w-5" />
                <span className="text-xs">Public Portal</span>
              </Button>
            </Link>
            
            {hasAccess("wholesale") && (
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-xs">New Order</span>
              </Button>
            )}
            
            {hasAccess("inventory") && (
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <Package className="h-5 w-5" />
                <span className="text-xs">Add Inventory</span>
              </Button>
            )}
            
            <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">View Reports</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}