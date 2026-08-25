import { ModernHRMISSuite } from "@/components/hrmis/ModernHRMISSuite";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  Building2, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings,
  LogOut,
  Bell,
  CreditCard,
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  User,
  Shield
} from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
}

interface Module {
  id: string;
  name: string;
  category: 'HRMIS' | 'FIMS';
  description: string;
  monthlyPrice: number;
}

export default function SaaSDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeDashboardView, setActiveDashboardView] = useState<'overview' | 'hrmis-suite'>('overview');
  const [, setLocation] = useLocation();

  // Check authentication and get user from token
  useEffect(() => {
    const token = localStorage.getItem('saas_token');
    if (!token) {
      setLocation('/saas/login');
      return;
    }

    // Decode JWT payload (simple base64 decode for demo)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.userId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        tenantId: payload.tenantId
      });
    } catch (error) {
      localStorage.removeItem('saas_token');
      setLocation('/saas/login');
    }
  }, [setLocation]);

  // Fetch tenant's accessible modules based on subscription
  const { data: tenantModulesData } = useQuery<any>({
    queryKey: ['/api/saas/tenant/modules'],
    enabled: !!user,
  });

  // Fetch real subscription status
  const { data: subscriptionData } = useQuery<any>({
    queryKey: ['/api/saas/subscription/status'],
    enabled: !!user,
  });

  const subscription = subscriptionData?.data || {
    isActive: false,
    portalType: 'none',
    subscriptionStatus: 'trial',
    plan: 'No Subscription',
    amount: 0,
    modules: []
  };

  // Dashboard stats (can be connected to real data later)
  const dashboardStats = {
    activeEmployees: 156,
    monthlyRevenue: 485000,
    pendingInvoices: 12,
    systemHealth: 98
  };

  const recentActivity = [
    { type: 'user', message: 'New employee Sarah Johnson added to HR system', time: '2 hours ago' },
    { type: 'finance', message: 'Monthly financial report generated', time: '4 hours ago' },
    { type: 'system', message: 'Payroll processing completed successfully', time: '1 day ago' },
    { type: 'security', message: 'System backup completed', time: '2 days ago' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('saas_token');
    setLocation('/saas/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use tenant's accessible modules based on their subscription
  const hasSubscription = tenantModulesData?.data?.hasSubscription || false;
  const accessibleModules = tenantModulesData?.data?.modules || [];
  const hrmisMoudles = accessibleModules.filter((m: Module) => m.category === 'HRMIS');
  const fimsModules = accessibleModules.filter((m: Module) => m.category === 'FIMS');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Top Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">TOTAG Enterprise</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back, {user.firstName || 'User'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation('/saas/notifications')}
                data-testid="button-notifications"
              >
                <Bell className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {(user.firstName?.[0] || 'T')}{(user.lastName?.[0] || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-user-name">
                    {user.firstName || 'TOTAG'} {user.lastName || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300" data-testid="text-user-role">
                    {user.role === 'client_admin' ? 'Administrator' : user.role}
                  </p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Monitor your business operations and system performance
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
              <Button 
                variant={activeDashboardView === 'hrmis-suite' ? "default" : "outline"}
                className={activeDashboardView === 'hrmis-suite' ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold" : "border-blue-300 text-blue-700 dark:text-blue-300"}
                onClick={() => setActiveDashboardView(activeDashboardView === 'hrmis-suite' ? 'overview' : 'hrmis-suite')}
                data-testid="button-toggle-hrmis-suite"
              >
                <Users className="w-4 h-4 mr-2" />
                {activeDashboardView === 'hrmis-suite' ? "Back to Dashboard Overview" : "Modern HRMIS Enterprise Suite"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/saas/reports')}
                data-testid="button-reports"
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </Button>
              <Button 
                onClick={() => setLocation('/saas/settings')}
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {activeDashboardView === 'hrmis-suite' ? (
          <div className="space-y-6">
            <ModernHRMISSuite />
          </div>
        ) : (
          <>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-employees">{dashboardStats.activeEmployees}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-revenue">${dashboardStats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-invoices">{dashboardStats.pendingInvoices}</div>
              <p className="text-xs text-muted-foreground">-3 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-health">{dashboardStats.systemHealth}%</div>
              <Progress value={dashboardStats.systemHealth} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Modules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Your Active Modules</span>
                </CardTitle>
                <CardDescription>
                  {hasSubscription 
                    ? 'Access your subscribed FIMS and HRMIS modules' 
                    : 'Subscribe to unlock powerful business modules'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!hasSubscription ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Subscribe to access HR Management, Financial Management, or both portals.
                    </p>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setLocation('/saas/subscription')}
                      data-testid="button-subscribe-now"
                    >
                      View Subscription Plans
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      {hrmisMoudles.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <Users className="w-4 h-4 text-blue-600" />
                            <h4 className="font-semibold">HRMIS Modules</h4>
                            <Badge variant="outline">{hrmisMoudles.length}</Badge>
                          </div>
                          <div className="space-y-2">
                            {hrmisMoudles.map((module: Module) => (
                              <div 
                                key={module.id} 
                                className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                                onClick={() => setLocation(`/saas/modules/${module.id.replace(/_/g, '-')}`)}
                                data-testid={`module-card-${module.id}`}
                              >
                                <span className="text-sm font-medium">{module.name}</span>
                                <Badge variant="secondary">Active</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {fimsModules.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <BarChart3 className="w-4 h-4 text-purple-600" />
                            <h4 className="font-semibold">FIMS Modules</h4>
                            <Badge variant="outline">{fimsModules.length}</Badge>
                          </div>
                          <div className="space-y-2">
                            {fimsModules.map((module: Module) => (
                              <div 
                                key={module.id} 
                                className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors"
                                onClick={() => setLocation(`/saas/modules/${module.id.replace(/_/g, '-')}`)}
                                data-testid={`module-card-${module.id}`}
                              >
                                <span className="text-sm font-medium">{module.name}</span>
                                <Badge variant="secondary">Active</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setLocation('/saas/subscription')}
                        data-testid="button-manage-modules"
                      >
                        Manage Subscription
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2" 
                    onClick={() => setLocation('/saas/modules/hr-core')}
                    data-testid="button-add-employee"
                  >
                    <User className="w-6 h-6" />
                    <span className="text-xs">Add Employee</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2" 
                    onClick={() => setLocation('/saas/modules/fims-reporting')}
                    data-testid="button-generate-report"
                  >
                    <FileText className="w-6 h-6" />
                    <span className="text-xs">Generate Report</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2" 
                    onClick={() => setLocation('/saas/modules/hr-compensation')}
                    data-testid="button-process-payroll"
                  >
                    <DollarSign className="w-6 h-6" />
                    <span className="text-xs">Process Payroll</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2" 
                    onClick={() => setLocation('/saas/users')}
                    data-testid="button-manage-users"
                  >
                    <Users className="w-6 h-6" />
                    <span className="text-xs">Manage Users</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'finance' ? 'bg-green-500' :
                      activity.type === 'system' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Subscription</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Plan</span>
                  <span className="font-semibold text-blue-600" data-testid="subscription-plan">{subscription.plan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge 
                    className={subscription.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 
                               subscription.subscriptionStatus === 'trial' ? 'bg-blue-100 text-blue-800' : 
                               'bg-yellow-100 text-yellow-800'}
                    data-testid="subscription-status"
                  >
                    {subscription.subscriptionStatus === 'trial' ? 'Trial' : 
                     subscription.subscriptionStatus === 'active' ? 'Active' : 
                     subscription.subscriptionStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monthly Cost</span>
                  <span className="font-semibold" data-testid="subscription-amount">
                    ${subscription.amount}/month
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Available Modules</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {subscription.modules?.length || 0} modules
                  </span>
                </div>
                {subscription.nextBillingDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Billing</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(subscription.nextBillingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {subscription.portalType === 'none' ? (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => setLocation('/saas/subscription')}
                    data-testid="button-subscribe"
                  >
                    Subscribe Now
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setLocation('/saas/billing')}
                    data-testid="button-billing-details"
                  >
                    Manage Subscription
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get support from our TOTAG IT Services team
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setLocation('/saas/support')}
                    data-testid="button-contact-support"
                  >
                    Contact Support
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setLocation('/saas/documentation')}
                    data-testid="button-documentation"
                  >
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}