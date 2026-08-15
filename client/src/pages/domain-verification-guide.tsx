import { ArrowLeft, Mail, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DomainVerificationGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin-dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Domain Verification Guide</h1>
              <p className="text-gray-600">Complete setup for totaggroup.com email delivery</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          
          {/* Current Status */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-800">Current Status</CardTitle>
                <Badge variant="outline" className="text-orange-700 border-orange-300">Verification Pending</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-orange-700">
              <p className="mb-2">
                <strong>Issue:</strong> Resend verification email was sent to it@totaggroup.com, but you cannot access this mailbox.
              </p>
              <p>
                <strong>Impact:</strong> Email delivery is currently limited to totagfarm@gmail.com only.
              </p>
            </CardContent>
          </Card>

          {/* Solution Options */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Option 1: Email Forwarding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Option 1: Email Forwarding
                  <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Set up email forwarding so verification emails automatically go to your accessible inbox.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-medium text-blue-800 mb-2">Steps to Follow:</p>
                    <ol className="text-sm text-blue-700 space-y-2 ml-4 list-decimal">
                      <li>Log into your domain hosting provider (GoDaddy, Namecheap, etc.)</li>
                      <li>Navigate to Email settings or Email forwarding</li>
                      <li>Create forwarding rule:
                        <div className="bg-white border rounded p-2 mt-1 font-mono text-xs">
                          it@totaggroup.com → totagfarm@gmail.com
                        </div>
                      </li>
                      <li>Save the forwarding rule</li>
                      <li>Check totagfarm@gmail.com for the verification email</li>
                      <li>Click the verification link in the email</li>
                    </ol>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      <strong>Benefit:</strong> Quick setup, no new mailbox needed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Option 2: Create Mailbox */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Option 2: Create IT Mailbox
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Create a dedicated IT department mailbox for professional communication.
                  </p>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="font-medium text-purple-800 mb-2">Steps to Follow:</p>
                    <ol className="text-sm text-purple-700 space-y-2 ml-4 list-decimal">
                      <li>Log into your hosting provider's control panel</li>
                      <li>Navigate to Email accounts or Email management</li>
                      <li>Create new email account: it@totaggroup.com</li>
                      <li>Set a secure password</li>
                      <li>Access the new mailbox via webmail or email client</li>
                      <li>Find and click the Resend verification email</li>
                    </ol>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      <strong>Benefit:</strong> Professional IT department email address
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Hosting Providers */}
          <Card>
            <CardHeader>
              <CardTitle>Common Hosting Provider Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">GoDaddy</h4>
                  <p className="text-sm text-gray-600 mb-2">Email Forwarding Location:</p>
                  <p className="text-xs text-gray-700">My Products → Domain → Email Forwarding</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Namecheap</h4>
                  <p className="text-sm text-gray-600 mb-2">Email Forwarding Location:</p>
                  <p className="text-xs text-gray-700">Domain List → Manage → Mail Settings → Email Forwarding</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Bluehost</h4>
                  <p className="text-sm text-gray-600 mb-2">Email Forwarding Location:</p>
                  <p className="text-xs text-gray-700">cPanel → Email → Forwarders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* After Verification */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                After Successful Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-700">
              <div className="space-y-2">
                <p>Once domain verification is complete, you will be able to:</p>
                <ul className="ml-4 space-y-1 text-sm list-disc">
                  <li>Send emails to any address worldwide</li>
                  <li>Use all seven subsidiary email addresses</li>
                  <li>Professional email delivery with totaggroup.com branding</li>
                  <li>Full corporate communication capabilities</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card>
            <CardHeader>
              <CardTitle>Need Additional Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">If you need assistance with your hosting provider:</p>
                  <p className="text-sm text-gray-500">Contact your hosting provider's support team for email setup guidance</p>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}