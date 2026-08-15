import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Receipt,
  Phone,
  Mail,
  User,
  ShoppingBag,
  History
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import TGMLogo from "@assets/Logo for TGM_1753450516331.png";

interface CreditAccount {
  id: number;
  orderId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  downPayment: number;
  outstandingBalance: number;
  paymentTerms: string;
  installmentAmount: number;
  nextPaymentDate: string;
  status: string;
  notes: string;
  createdAt: string;
  payments?: Payment[];
}

interface Payment {
  id: number;
  paymentAmount: number;
  paymentMethod: string;
  transactionId: string;
  notes: string;
  createdAt: string;
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customer, setCustomer] = useState<any>(null);
  const [creditAccounts, setCreditAccounts] = useState<CreditAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<CreditAccount | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [previousOrders, setPreviousOrders] = useState<any[]>([]);
  const [loginForm, setLoginForm] = useState({
    customerPhone: "",
    customerName: ""
  });
  const [paymentForm, setPaymentForm] = useState({
    paymentAmount: "",
    paymentMethod: "",
    transactionId: "",
    notes: ""
  });
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState({
    carrier: "",
    phoneNumber: "",
    pin: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const fetchPreviousOrders = async (customerPhone: string, customerName: string) => {
    try {
      const response = await fetch(`/api/customer/orders?phone=${encodeURIComponent(customerPhone)}&name=${encodeURIComponent(customerName)}`);
      const result = await response.json();
      if (result.success) {
        setPreviousOrders(result.orders || []);
      }
    } catch (error) {
      console.error("Error fetching previous orders:", error);
    }
  };

  const authenticateCustomer = async () => {
    if (!loginForm.customerPhone || !loginForm.customerName) {
      toast({
        title: "Missing Information",
        description: "Please enter both your phone number and full name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });

      const result = await response.json();

      if (result.success) {
        setCustomer(result.customer);
        setCreditAccounts(result.creditAccounts || []);
        setShowLoginModal(false);
        
        // Fetch previous orders
        fetchPreviousOrders(result.customer.customerPhone, result.customer.customerName);
        toast({
          title: "Welcome Back",
          description: `Hello ${result.customer.customerName}`,
        });
      } else {
        toast({
          title: "Account Not Found",
          description: "No credit account found with those details. Please check your information.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error authenticating customer:", error);
      toast({
        title: "Login Failed",
        description: "Unable to access your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processPaymentStep = async () => {
    if (paymentForm.paymentMethod === "mobile_money") {
      if (paymentStep === 1) {
        // Step 1: Payment amount and method selection
        setPaymentStep(2);
      } else if (paymentStep === 2) {
        // Step 2: Carrier selection
        if (!paymentDetails.carrier) {
          toast({
            title: "Required Field",
            description: "Please select your mobile money carrier",
            variant: "destructive",
          });
          return;
        }
        setPaymentStep(3);
      } else if (paymentStep === 3) {
        // Step 3: Phone number entry
        if (!paymentDetails.phoneNumber) {
          toast({
            title: "Required Field",
            description: "Please enter your mobile money number",
            variant: "destructive",
          });
          return;
        }
        setPaymentStep(4);
      } else if (paymentStep === 4) {
        // Step 4: PIN entry and final processing
        if (!paymentDetails.pin) {
          toast({
            title: "Required Field",
            description: "Please enter your mobile money PIN",
            variant: "destructive",
          });
          return;
        }
        await completeMobileMoneyPayment();
      }
    } else if (paymentForm.paymentMethod === "card") {
      if (paymentStep === 1) {
        setPaymentStep(2);
      } else if (paymentStep === 2) {
        // Validate card details
        if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardholderName) {
          toast({
            title: "Required Fields",
            description: "Please fill in all card details",
            variant: "destructive",
          });
          return;
        }
        await completeCardPayment();
      }
    } else if (paymentForm.paymentMethod === "bank_transfer" || paymentForm.paymentMethod === "cash") {
      // For bank transfer and cash, process immediately after step 1
      if (paymentStep === 1) {
        await completeSimplePayment();
      }
    }
  };

  const completeMobileMoneyPayment = async () => {
    if (!selectedAccount || !paymentForm.paymentAmount) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/creditors/${selectedAccount.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAmount: parseFloat(paymentForm.paymentAmount),
          paymentMethod: "mobile_money",
          transactionId: `${paymentDetails.carrier}-${Date.now()}`,
          notes: `Mobile Money Payment via ${paymentDetails.carrier} (${paymentDetails.phoneNumber})`,
          isCustomerPayment: true,
          paymentDetails: {
            carrier: paymentDetails.carrier,
            phoneNumber: paymentDetails.phoneNumber
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Calculate correct remaining balance
        const paidAmount = parseFloat(paymentForm.paymentAmount);
        const previousBalance = parseFloat(selectedAccount.outstandingBalance);
        const correctRemainingBalance = Math.max(0, previousBalance - paidAmount);
        
        // Store receipt data for the receipt page
        const receiptData = {
          paymentId: result.payment.id,
          customerName: customer.customerName,
          customerPhone: customer.customerPhone,
          paymentAmount: paymentForm.paymentAmount,
          paymentMethod: "mobile_money",
          transactionId: `${paymentDetails.carrier}-${Date.now()}`,
          paymentDate: new Date().toISOString(),
          remainingBalance: correctRemainingBalance.toFixed(2),
          accountId: selectedAccount.id,
          carrier: paymentDetails.carrier,
          notes: `Mobile Money Payment via ${paymentDetails.carrier} (${paymentDetails.phoneNumber})`
        };
        
        sessionStorage.setItem('paymentReceipt', JSON.stringify(receiptData));
        resetPaymentModal();
        const updatedAccounts = creditAccounts.map(account => 
          account.id === selectedAccount.id 
            ? { ...account, outstandingBalance: parseFloat(result.updatedCreditor.outstandingBalance) }
            : account
        );
        setCreditAccounts(updatedAccounts);
        
        // Redirect to receipt page
        setLocation('/payment-receipt');
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeCardPayment = async () => {
    if (!selectedAccount || !paymentForm.paymentAmount) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/creditors/${selectedAccount.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAmount: parseFloat(paymentForm.paymentAmount),
          paymentMethod: "card",
          transactionId: `CARD-${Date.now()}`,
          notes: `Card Payment ending in ${paymentDetails.cardNumber.slice(-4)}`,
          isCustomerPayment: true,
          paymentDetails: {
            cardNumber: paymentDetails.cardNumber.slice(-4),
            cardholderName: paymentDetails.cardholderName
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Calculate correct remaining balance
        const paidAmount = parseFloat(paymentForm.paymentAmount);
        const previousBalance = parseFloat(selectedAccount.outstandingBalance);
        const correctRemainingBalance = Math.max(0, previousBalance - paidAmount);
        
        // Store receipt data for the receipt page
        const receiptData = {
          paymentId: result.payment.id,
          customerName: customer.customerName,
          customerPhone: customer.customerPhone,
          paymentAmount: paymentForm.paymentAmount,
          paymentMethod: "card",
          transactionId: `CARD-${Date.now()}`,
          paymentDate: new Date().toISOString(),
          remainingBalance: correctRemainingBalance.toFixed(2),
          accountId: selectedAccount.id,
          notes: `Card Payment ending in ${paymentDetails.cardNumber.slice(-4)}`
        };
        
        sessionStorage.setItem('paymentReceipt', JSON.stringify(receiptData));
        resetPaymentModal();
        const updatedAccounts = creditAccounts.map(account => 
          account.id === selectedAccount.id 
            ? { ...account, outstandingBalance: parseFloat(result.updatedCreditor.outstandingBalance) }
            : account
        );
        setCreditAccounts(updatedAccounts);
        
        // Redirect to receipt page
        setLocation('/payment-receipt');
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeSimplePayment = async () => {
    if (!selectedAccount || !paymentForm.paymentAmount) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/creditors/${selectedAccount.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAmount: parseFloat(paymentForm.paymentAmount),
          paymentMethod: paymentForm.paymentMethod,
          transactionId: `${paymentForm.paymentMethod.toUpperCase()}-${Date.now()}`,
          notes: `${paymentForm.paymentMethod.replace('_', ' ').toUpperCase()} Payment`,
          isCustomerPayment: true
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Calculate correct remaining balance
        const paidAmount = parseFloat(paymentForm.paymentAmount);
        const previousBalance = parseFloat(selectedAccount.outstandingBalance);
        const correctRemainingBalance = Math.max(0, previousBalance - paidAmount);
        
        // Store receipt data for the receipt page
        const receiptData = {
          paymentId: result.payment.id,
          customerName: customer.customerName,
          customerPhone: customer.customerPhone,
          paymentAmount: paymentForm.paymentAmount,
          paymentMethod: paymentForm.paymentMethod,
          transactionId: `${paymentForm.paymentMethod.toUpperCase()}-${Date.now()}`,
          paymentDate: new Date().toISOString(),
          remainingBalance: correctRemainingBalance.toFixed(2),
          accountId: selectedAccount.id,
          notes: `${paymentForm.paymentMethod.replace('_', ' ').toUpperCase()} Payment`
        };
        
        sessionStorage.setItem('paymentReceipt', JSON.stringify(receiptData));
        resetPaymentModal();
        const updatedAccounts = creditAccounts.map(account => 
          account.id === selectedAccount.id 
            ? { ...account, outstandingBalance: parseFloat(result.updatedCreditor.outstandingBalance) }
            : account
        );
        setCreditAccounts(updatedAccounts);
        
        // Redirect to receipt page
        setLocation('/payment-receipt');
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentStep(1);
    setPaymentForm({
      paymentAmount: "",
      paymentMethod: "",
      transactionId: "",
      notes: ""
    });
    setPaymentDetails({
      carrier: "",
      phoneNumber: "",
      pin: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: ""
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-yellow-100 text-yellow-800";
      case "paid_off": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalOutstanding = creditAccounts.reduce((sum, account) => sum + (parseFloat(account.outstandingBalance?.toString() || "0")), 0);
  const totalOriginal = creditAccounts.reduce((sum, account) => sum + (parseFloat(account.totalAmount?.toString() || "0")), 0);
  const totalPaid = totalOriginal - totalOutstanding;

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src={TGMLogo} alt="TGM Logo" className="h-16 w-16 mx-auto mb-4" />
            <CardTitle>Customer Account Access</CardTitle>
            <CardDescription>
              Enter your details to view your credit accounts and payment history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Phone Number *</Label>
              <Input
                type="tel"
                value={loginForm.customerPhone}
                onChange={(e) => setLoginForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="+231 XXX XXX XXX"
              />
            </div>
            <div>
              <Label>Full Name *</Label>
              <Input
                value={loginForm.customerName}
                onChange={(e) => setLoginForm(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter your full name as registered"
              />
            </div>
            <Button 
              onClick={authenticateCustomer} 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Accessing Account..." : "Access My Account"}
            </Button>
            <div className="text-center">
              <Link href="/general-merchandise">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Store
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={TGMLogo} alt="TGM Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Account</h1>
                <p className="text-sm text-gray-600">Welcome back, {customer?.customerName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/general-merchandise">
                <Button variant="outline">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowLoginModal(true);
                  setCustomer(null);
                  setCreditAccounts([]);
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Account Overview", icon: User },
                { id: "credit", label: "Credit Accounts", icon: CreditCard },
                { id: "payments", label: "Payment History", icon: History },
                { id: "purchases", label: "Previous Purchases", icon: ShoppingBag }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Account Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Credit Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">${(totalOriginal || 0).toFixed(2)}</div>
                  <p className="text-sm text-gray-600">Original purchase amount</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Amount Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">${(totalPaid || 0).toFixed(2)}</div>
                  <p className="text-sm text-gray-600">Total payments made</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Outstanding Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">${(totalOutstanding || 0).toFixed(2)}</div>
                  <p className="text-sm text-gray-600">Remaining to pay</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{customer?.customerName}</p>
                      <p className="text-sm text-gray-600">Full Name</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{customer?.customerPhone}</p>
                      <p className="text-sm text-gray-600">Phone Number</p>
                    </div>
                  </div>
                  {customer?.customerEmail && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{customer.customerEmail}</p>
                        <p className="text-sm text-gray-600">Email Address</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{creditAccounts.length} Active Account{creditAccounts.length !== 1 ? 's' : ''}</p>
                      <p className="text-sm text-gray-600">Credit Accounts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Credit Accounts */}
        {activeTab === "credit" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Credit Accounts</CardTitle>
                <CardDescription>
                  View and manage your credit purchases and payment schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                {creditAccounts.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No credit accounts found</p>
                    <p className="text-sm text-gray-500">Start shopping with credit to see your accounts here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {creditAccounts.map(account => (
                      <div key={account.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">Order #{account.orderId}</h3>
                            <p className="text-sm text-gray-600">Created: {formatDate(account.createdAt)}</p>
                          </div>
                          <Badge className={getStatusColor(account.status)}>
                            {account.status === "active" ? "Active" : 
                             account.status === "paid_off" ? "Paid Off" : 
                             account.status === "overdue" ? "Overdue" : account.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="font-semibold">${account.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Down Payment</p>
                            <p className="font-semibold text-green-600">${account.downPayment}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Outstanding</p>
                            <p className="font-semibold text-red-600">${account.outstandingBalance}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Next Payment</p>
                            <p className="font-semibold">${account.installmentAmount}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            Payment Terms: <span className="font-medium capitalize">{account.paymentTerms?.replace('_', ' ')}</span>
                            {account.nextPaymentDate && (
                              <span className="ml-4">
                                Due: <span className="font-medium">{formatDate(account.nextPaymentDate)}</span>
                              </span>
                            )}
                          </div>
                          {account.outstandingBalance > 0 && (
                            <Button 
                              onClick={() => {
                                setSelectedAccount(account);
                                setShowPaymentModal(true);
                              }}
                            >
                              Make Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment History */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View all your payment transactions and records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Payment history coming soon</p>
                  <p className="text-sm text-gray-500">Detailed payment records will be available here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Previous Purchases Tab */}
        {activeTab === "purchases" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Previous Purchases</CardTitle>
                <CardDescription>
                  View your complete order history and purchase details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {previousOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No previous orders found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {previousOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-lg">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.createdAt)} • {order.orderType?.replace('_', ' ').toUpperCase()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">${parseFloat(order.total || "0").toFixed(2)}</p>
                            <Badge className={getOrderStatusColor(order.status)}>
                              {order.status?.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Payment Method:</strong> {order.paymentMethod?.replace('_', ' ') || 'N/A'}</p>
                            <p><strong>Delivery:</strong> {order.deliveryOption?.replace('_', ' ') || 'N/A'}</p>
                          </div>
                          <div>
                            <p><strong>Status:</strong> {order.paymentStatus}</p>
                            <p><strong>Items:</strong> Multiple items</p>
                          </div>
                        </div>
                        
                        {order.deliveryAddress && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm"><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Multi-Step Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={(open) => {
        if (!open) resetPaymentModal();
      }}>
        <DialogContent className="max-w-lg" style={{ zIndex: 9999 }}>
          <DialogHeader>
            <DialogTitle>
              {paymentStep === 1 ? "Make Payment" : 
               paymentStep === 2 && paymentForm.paymentMethod === "mobile_money" ? "Select Mobile Money Carrier" :
               paymentStep === 2 && paymentForm.paymentMethod === "card" ? "Card Payment Details" :
               paymentStep === 3 ? "Enter Phone Number" :
               paymentStep === 4 ? "Enter PIN" : "Payment"}
            </DialogTitle>
            <DialogDescription>
              {paymentStep === 1 ? "Pay towards your credit account balance" :
               paymentStep === 2 && paymentForm.paymentMethod === "mobile_money" ? "Choose your mobile money provider" :
               paymentStep === 2 && paymentForm.paymentMethod === "card" ? "Enter your card information securely" :
               paymentStep === 3 ? "Enter your mobile money number" :
               paymentStep === 4 ? "Enter your mobile money PIN to confirm payment" : ""}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[1, 2, 3, 4].filter((_, i) => {
                if (paymentForm.paymentMethod === "card") return i < 2;
                if (paymentForm.paymentMethod === "mobile_money") return i < 4;
                return i < 1; // For bank_transfer and cash, only 1 step
              }).map((step) => (
                <div key={step} className={`w-3 h-3 rounded-full ${step <= paymentStep ? 'bg-blue-500' : 'bg-gray-300'}`} />
              ))}
            </div>

            {/* Step 1: Payment Amount and Method Selection */}
            {paymentStep === 1 && (
              <>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p><strong>Outstanding Balance:</strong> ${selectedAccount?.outstandingBalance}</p>
                  <p><strong>Recommended Payment:</strong> ${selectedAccount?.installmentAmount}</p>
                </div>
                
                <div>
                  <Label>Payment Amount ($) *</Label>
                  <Input
                    type="number"
                    value={paymentForm.paymentAmount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentAmount: e.target.value }))}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max={selectedAccount?.outstandingBalance}
                  />
                </div>

                <div>
                  <Label>Payment Method *</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ position: 'relative', zIndex: 10000 }}
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  >
                    <option value="">Choose your payment method</option>
                    <option value="mobile_money">📱 Mobile Money</option>
                    <option value="card">💳 Debit/Credit Card</option>
                    <option value="bank_transfer">🏦 Bank Transfer</option>
                    <option value="cash">💵 Cash Payment</option>
                  </select>
                </div>
              </>
            )}

            {/* Step 2: Mobile Money Carrier Selection */}
            {paymentStep === 2 && paymentForm.paymentMethod === "mobile_money" && (
              <div>
                <Label>Mobile Money Carrier *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ position: 'relative', zIndex: 10000 }}
                  value={paymentDetails.carrier}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, carrier: e.target.value }))}
                >
                  <option value="">Select your carrier</option>
                  <option value="MTN Money">MTN Money</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Lonestar Cell MTN">Lonestar Cell MTN</option>
                </select>
              </div>
            )}

            {/* Step 2: Card Payment Details */}
            {paymentStep === 2 && paymentForm.paymentMethod === "card" && (
              <>
                <div>
                  <Label>Cardholder Name *</Label>
                  <Input
                    value={paymentDetails.cardholderName}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <Label>Card Number *</Label>
                  <Input
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value.replace(/\s/g, '') }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry Date *</Label>
                    <Input
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label>CVV *</Label>
                    <Input
                      type="password"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Mobile Money Phone Number */}
            {paymentStep === 3 && (
              <div>
                <Label>Mobile Money Number *</Label>
                <Input
                  value={paymentDetails.phoneNumber}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+231 77 123 4567"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Enter the phone number linked to your {paymentDetails.carrier} account
                </p>
              </div>
            )}

            {/* Step 4: Mobile Money PIN */}
            {paymentStep === 4 && (
              <div>
                <Label>Mobile Money PIN *</Label>
                <Input
                  type="password"
                  value={paymentDetails.pin}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, pin: e.target.value }))}
                  placeholder="Enter your 4-digit PIN"
                  maxLength={4}
                />
                <div className="bg-yellow-50 p-3 rounded-lg mt-2">
                  <p className="text-sm text-yellow-800">
                    <strong>Confirm Payment:</strong> ${paymentForm.paymentAmount} via {paymentDetails.carrier} ({paymentDetails.phoneNumber})
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => resetPaymentModal()}>
                Cancel
              </Button>
              <Button 
                onClick={processPaymentStep}
                disabled={!paymentForm.paymentAmount || !paymentForm.paymentMethod || parseFloat(paymentForm.paymentAmount) <= 0 || loading}
              >
                {loading ? "Processing..." : 
                 paymentStep === 1 && (paymentForm.paymentMethod === "bank_transfer" || paymentForm.paymentMethod === "cash") ? "Process Payment" :
                 paymentStep === 1 ? "Continue" :
                 paymentStep === 2 && paymentForm.paymentMethod === "card" ? "Pay Now" :
                 paymentStep === 4 ? "Confirm Payment" : "Next"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}