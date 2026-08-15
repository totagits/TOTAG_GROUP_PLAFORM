import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Printer, ArrowLeft, CreditCard, Building2, Calendar, DollarSign, User, Phone, Hash } from "lucide-react";
import { useLocation } from "wouter";
import TGMLogo from "@assets/Logo for TGM2_1753622327252.png";

interface PaymentReceipt {
  paymentId: string;
  customerName: string;
  customerPhone: string;
  paymentAmount: string;
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  remainingBalance: string;
  accountId: string;
  carrier?: string;
  notes?: string;
}

export default function PaymentReceipt() {
  const [, setLocation] = useLocation();
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  useEffect(() => {
    // Get receipt data from sessionStorage
    const receiptData = sessionStorage.getItem('paymentReceipt');
    if (receiptData) {
      setReceipt(JSON.parse(receiptData));
      // Clear the data after loading
      sessionStorage.removeItem('paymentReceipt');
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodDisplay = (method: string, carrier?: string) => {
    switch (method) {
      case 'mobile_money':
        return `Mobile Money${carrier ? ` (${carrier})` : ''}`;
      case 'card':
        return 'Debit/Credit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash Payment';
      default:
        return method;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text receipt for download
    if (!receipt) return;
    
    const receiptText = `
====================================================
          TOTAG GENERAL MERCHANDISE
     A Division of TOTAG Group of Companies Ltd.
        Wholesale & Retail Distribution
             West Africa - Liberia
====================================================

              OFFICIAL PAYMENT RECEIPT

Receipt #: ${receipt.paymentId}
Date: ${formatDate(receipt.paymentDate)}
Generated: TGM Payment System

----------------------------------------------------
              CUSTOMER INFORMATION
----------------------------------------------------
Customer Name: ${receipt.customerName}
Phone Number: ${receipt.customerPhone}
Account ID: #${receipt.accountId}

----------------------------------------------------
               PAYMENT DETAILS
----------------------------------------------------
Amount Paid: $${receipt.paymentAmount}
Payment Method: ${getPaymentMethodDisplay(receipt.paymentMethod, receipt.carrier)}
Transaction ID: ${receipt.transactionId}
Remaining Balance: $${receipt.remainingBalance}

Additional Notes: ${receipt.notes || 'None'}

----------------------------------------------------
              COMPANY INFORMATION
----------------------------------------------------
TOTAG General Merchandise
Head Office: Monrovia, Liberia
Services: Wholesale Distribution, Retail Operations
Parent Company: TOTAG Group of Companies Ltd.

Thank you for choosing TOTAG General Merchandise!
This is an official payment receipt.
Keep this for your records and warranty purposes.

For inquiries: Contact TGM Customer Service
====================================================
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TGM-Receipt-${receipt.paymentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <CreditCard className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Receipt Found</h2>
            <p className="text-gray-600 mb-4">
              Unable to load payment receipt data.
            </p>
            <Button onClick={() => setLocation('/customer-dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:py-0 print:bg-white">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header - Hide on print */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/customer-dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Receipt Card */}
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="text-center border-b print:border-gray-300 bg-gradient-to-br from-purple-50 to-blue-50 print:bg-white">
            {/* TGM Logo and Company Header */}
            <div className="text-center mb-6 bg-white rounded-lg p-4 border-2 border-purple-200">
              <div className="bg-purple-50 rounded-full p-4 w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <img 
                  src={TGMLogo} 
                  alt="TOTAG General Merchandise Logo" 
                  className="h-24 w-24 object-contain"
                  onError={(e) => {
                    console.log("Logo failed to load:", e);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => console.log("Logo loaded successfully")}
                />
              </div>
              <h1 className="text-3xl font-bold text-purple-900 print:text-black mb-2">TOTAG GENERAL MERCHANDISE</h1>
              <p className="text-xl text-purple-700 print:text-gray-700 font-semibold">A Division of TOTAG Group of Companies Ltd.</p>
              <p className="text-base text-gray-700 mt-2 font-medium">Wholesale & Retail Distribution • West Africa</p>
              <div className="mt-3 text-sm text-purple-600 bg-purple-100 py-2 px-4 rounded-lg inline-block">
                Official Business Receipt
              </div>
            </div>
            
            {/* Receipt Header */}
            <div className="border-t border-b py-4 my-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center print:bg-gray-100">
                  <CheckCircle className="h-8 w-8 text-green-600 print:text-gray-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-green-600 print:text-black">
                Payment Successful
              </CardTitle>
              <p className="text-lg font-semibold text-purple-800 print:text-black mt-2">OFFICIAL PAYMENT RECEIPT</p>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Receipt Information */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-gray-600">Receipt #</p>
                <p className="font-semibold">{receipt.paymentId}</p>
              </div>
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-semibold">{formatDate(receipt.paymentDate)}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-semibold">{receipt.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold">{receipt.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Account ID</p>
                    <p className="font-semibold">#{receipt.accountId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg print:bg-gray-50">
                  <div>
                    <p className="text-gray-600">Amount Paid</p>
                    <p className="text-2xl font-bold text-green-600 print:text-black">
                      ${receipt.paymentAmount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Remaining Balance</p>
                    <p className="text-lg font-semibold">${receipt.remainingBalance}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-semibold">
                        {getPaymentMethodDisplay(receipt.paymentMethod, receipt.carrier)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Transaction ID</p>
                      <p className="font-semibold">{receipt.transactionId}</p>
                    </div>
                  </div>
                </div>

                {receipt.notes && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Notes</p>
                    <p className="font-medium">{receipt.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Footer with Company Information */}
            <div className="border-t pt-6 mt-6">
              <div className="text-center mb-4 bg-purple-50 py-4 px-6 rounded-lg">
                <div className="bg-white rounded-full p-3 w-20 h-20 mx-auto mb-3 flex items-center justify-center shadow-lg">
                  <img 
                    src={TGMLogo} 
                    alt="TGM Logo" 
                    className="h-14 w-14 object-contain"
                  />
                </div>
                <p className="font-bold text-purple-900 print:text-black text-xl">TOTAG GENERAL MERCHANDISE</p>
                <p className="text-base font-semibold text-purple-700 print:text-gray-700">A Division of TOTAG Group of Companies Ltd.</p>
                <p className="text-sm text-purple-600 mt-1">Official Business Entity</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-center mb-4">
                <div>
                  <p className="font-semibold text-purple-800 print:text-black">Head Office</p>
                  <p>Monrovia, Liberia</p>
                  <p>West Africa</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-800 print:text-black">Services</p>
                  <p>Wholesale Distribution</p>
                  <p>Retail Operations</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-800 print:text-black">Contact</p>
                  <p>Customer Service</p>
                  <p>Business Inquiries</p>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t">
                <p className="font-semibold text-green-600 print:text-black mb-2">Thank you for choosing TOTAG General Merchandise!</p>
                <p className="text-xs text-gray-600">
                  This is an official payment receipt. Keep this for your records and warranty purposes.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Receipt generated on {formatDate(receipt.paymentDate)} • TGM Payment System
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}