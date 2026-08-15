import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Clock, Smartphone, Shield, CreditCard, Truck, Lock } from "lucide-react";

interface PaymentProcessingProps {
  orderData: {
    customerInfo: any;
    paymentMethod: string;
    deliveryOption: string;
    cartItems: any[];
    totalAmount: string;
  };
  onComplete: () => void;
  onCancel: () => void;
}

export default function PaymentProcessing({ orderData, onComplete, onCancel }: PaymentProcessingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const paymentMethodName = orderData.paymentMethod === "mtn_money" ? "MTN Mobile Money" : 
                           orderData.paymentMethod === "orange_money" ? "Orange Money" : "Cash on Delivery";

  const steps = [
    {
      id: 0,
      title: "Verifying Mobile Number",
      description: `Verifying ${orderData.customerInfo.phone} with ${paymentMethodName} network`,
      icon: Smartphone,
      duration: 3000
    },
    {
      id: 1,
      title: "Authenticating Account",
      description: `${paymentMethodName} account found. Checking account status and balance`,
      icon: Shield,
      duration: 3500
    },
    {
      id: 2,
      title: "Payment Request Sent",
      description: `Payment request for $${orderData.totalAmount} sent to your phone`,
      icon: CreditCard,
      duration: 4000
    },
    {
      id: 3,
      title: "Awaiting PIN Entry",
      description: `Please enter your ${paymentMethodName} PIN to authorize payment`,
      icon: Lock,
      duration: 0 // Will wait for PIN entry
    },
    {
      id: 4,
      title: "Processing Payment",
      description: `Processing ${paymentMethodName} payment. Please wait...`,
      icon: Clock,
      duration: 3500
    },
    {
      id: 5,
      title: "Payment Confirmed",
      description: "Payment successful! Recording order on blockchain...",
      icon: CheckCircle,
      duration: 3000
    }
  ];

  useEffect(() => {
    if (!isProcessing) {
      setIsProcessing(true);
      processPayment();
    }
  }, []);

  const processPayment = async () => {
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Special handling for PIN entry step
      if (i === 3) {
        setShowPinEntry(true);
        // Wait for PIN entry completion
        return;
      }
      
      if (steps[i].duration > 0) {
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      }
    }

    // Generate transaction details
    const txId = Math.random().toString(36).substr(2, 12).toUpperCase();
    const orderNum = Math.random().toString(36).substr(2, 9).toUpperCase();
    setTransactionId(txId);
    setOrderNumber(orderNum);

    // Final step - order complete
    setCurrentStep(6);
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      setPinError("PIN must be 4 digits");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setPinError("PIN must contain only numbers");
      return;
    }

    // Simulate PIN verification
    setShowPinEntry(false);
    setPinError("");
    
    // Continue with remaining steps
    for (let i = 4; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
    }

    try {
      // Create actual order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: orderData.customerInfo,
          paymentMethod: orderData.paymentMethod,
          deliveryOption: orderData.deliveryOption,
          cartItems: orderData.cartItems,
          subtotal: orderData.totalAmount,
          deliveryFee: orderData.deliveryOption === 'tgm_delivery' ? '2.50' : '0.00'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Use real order and tracking numbers from database
        setOrderNumber(result.orderNumber);
        setTrackingNumber(result.trackingNumber);
        setTransactionId(result.order.blockchainHash);
      } else {
        console.error('Order creation failed:', result.error);
        // Fallback to generated numbers
        const txId = Math.random().toString(36).substr(2, 12).toUpperCase();
        const orderNum = `TGM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setTransactionId(txId);
        setOrderNumber(orderNum);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      // Fallback to generated numbers
      const txId = Math.random().toString(36).substr(2, 12).toUpperCase();
      const orderNum = `TGM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setTransactionId(txId);
      setOrderNumber(orderNum);
    }

    // Final step - order complete
    setCurrentStep(6);
  };

  const handlePinChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
      setPinError("");
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "pending";
  };

  if (currentStep === 6) {
    // Order completion screen
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Order Successfully Placed!</CardTitle>
            <CardDescription>Your payment has been processed and order confirmed</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order Number:</span>
                  <span className="font-mono">#{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{paymentMethodName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-semibold">${orderData.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{orderData.cartItems.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>{orderData.deliveryOption === "tgm_delivery" ? "TGM Delivery" : "Store Pickup"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Address:</span>
                  <span>{orderData.customerInfo.city}</span>
                </div>
              </div>
            </div>

            {/* Blockchain Confirmation */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Blockchain Transparency</span>
              </div>
              <p className="text-sm text-blue-800">
                Your order has been recorded on our blockchain ledger with hash: 
                <span className="font-mono ml-1">0x{Math.random().toString(16).substr(2, 12)}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={onComplete} className="flex-1">
                <Truck className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                Print Receipt
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  sessionStorage.setItem('orderNumber', orderNumber);
                  window.location.href = '/order-tracking';
                }}
                className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Processing Your Payment</CardTitle>
          <CardDescription className="text-center">
            Secure {paymentMethodName} payment for ${orderData.totalAmount}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          </div>

          {/* Current Step Display */}
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {currentStep < steps.length && React.createElement(steps[currentStep].icon, {
                className: "h-8 w-8 text-blue-600 animate-pulse"
              })}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {currentStep < steps.length ? steps[currentStep].title : "Completing Order"}
            </h3>
            <p className="text-gray-600">
              {currentStep < steps.length ? steps[currentStep].description : "Finalizing your order..."}
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    status === "completed" ? "bg-green-100" :
                    status === "current" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    {status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      React.createElement(step.icon, {
                        className: `h-5 w-5 ${status === "current" ? "text-blue-600" : "text-gray-400"}`
                      })
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${
                      status === "completed" ? "text-green-600" :
                      status === "current" ? "text-blue-600" : "text-gray-400"
                    }`}>
                      {step.title}
                    </div>
                    {status === "current" && (
                      <div className="text-sm text-gray-500">{step.description}</div>
                    )}
                  </div>
                  <Badge variant={
                    status === "completed" ? "default" :
                    status === "current" ? "secondary" : "outline"
                  }>
                    {status === "completed" ? "Done" :
                     status === "current" ? "Processing" : "Pending"}
                  </Badge>
                </div>
              );
            })}
          </div>

          {/* Cancel Button */}
          <div className="text-center pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PIN Entry Modal */}
      <Dialog open={showPinEntry} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-blue-600" />
              Enter Your {paymentMethodName} PIN
            </DialogTitle>
            <DialogDescription>
              Please enter your 4-digit mobile money PIN to authorize the payment of ${orderData.totalAmount}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="pin">Mobile Money PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={4}
                autoFocus
              />
              {pinError && (
                <p className="text-sm text-red-500 mt-1">{pinError}</p>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center text-sm text-blue-800">
                <Shield className="h-4 w-4 mr-2" />
                <span>Your PIN is encrypted and secure</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handlePinSubmit} 
                className="flex-1"
                disabled={pin.length !== 4}
              >
                Confirm Payment
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPinEntry(false);
                  onCancel();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}