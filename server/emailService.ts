import axios from 'axios';
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent?: string;
  html?: string;
  text?: string;
  from?: string;
  type?: string;
}

// Zoho Email Service for TOTAG IT Services
class ZohoEmailService {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private authBaseUrl: string;
  private mailBaseUrl: string;

  constructor() {
    this.clientId = process.env.ZOHO_CLIENT_ID!;
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET!;
    this.refreshToken = process.env.ZOHO_REFRESH_TOKEN!;

    // Support ZOHO_REGION env var: com (US, default), eu, in, com.au, jp, ca
    const region = process.env.ZOHO_REGION || 'com';
    this.authBaseUrl = `https://accounts.zoho.${region}`;
    this.mailBaseUrl = `https://mail.zoho.${region}`;
    console.log(`📧 Zoho email service using region: .${region}`);

    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      console.warn('⚠️ Zoho credentials not found. Email functionality will be limited.');
    }
  }

  private async getAccessToken(): Promise<string> {
    // Check if current token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      // Use URLSearchParams for proper form-encoded body
      const body = new URLSearchParams({
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
      });

      const response = await axios.post(this.authBaseUrl + '/oauth/v2/token', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data && response.data.access_token && typeof response.data.access_token === 'string') {
        this.accessToken = response.data.access_token;
        // Set expiry to 5 minutes before actual expiry for safety
        this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
        
        console.log('✅ Zoho access token refreshed successfully');
        return this.accessToken;
      } else {
        // Log Zoho's actual error so it's visible in deployment logs
        const zohoError = response.data?.error || response.data?.message || JSON.stringify(response.data);
        console.error('❌ Zoho token response error:', zohoError);
        throw new Error(`Zoho rejected token refresh: ${zohoError}`);
      }
    } catch (error: any) {
      const zohoBody = error.response?.data;
      const zohoError = zohoBody?.error || zohoBody?.message || error.message;
      console.error('❌ Zoho token refresh failed:', error.response?.status, zohoError);
      if (zohoBody) console.error('   Zoho response body:', JSON.stringify(zohoBody));
      throw new Error(`Failed to authenticate with Zoho: ${zohoError}`);
    }
  }

  private async sendViaSMTP(options: EmailOptions): Promise<boolean> {
    const smtpUser = process.env.ZOHO_FROM_EMAIL || 'info@totaggroup.com';
    const smtpPass = process.env.ZOHO_SMTP_PASS;
    if (!smtpPass) return false;

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const htmlBody = options.htmlContent || options.html;

    await transporter.sendMail({
      from: `"TOTAG Group of Companies" <${smtpUser}>`,
      to: options.to,
      subject: options.subject,
      html: htmlBody,
      text: options.text,
    });

    console.log(`✅ Email sent via SMTP to ${options.to}: ${options.subject}`);
    return true;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    // Try SMTP first (simpler, no OAuth tokens needed)
    if (process.env.ZOHO_SMTP_PASS) {
      try {
        return await this.sendViaSMTP(options);
      } catch (err: any) {
        console.error('❌ SMTP send failed:', err.message, '— falling back to OAuth');
      }
    }

    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      console.log('📧 Email skipped (no credentials configured):', {
        to: options.to,
        subject: options.subject
      });
      return false;
    }

    try {
      const accessToken = await this.getAccessToken();
      
      // Strict validation - never proceed with falsy token
      if (!accessToken || typeof accessToken !== 'string') {
        throw new Error('No valid access token available');
      }

      // Get account details first to get the account key
      let accountResponse;
      try {
        accountResponse = await axios.get(`${this.mailBaseUrl}/api/accounts`, {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Accept': 'application/json',
          },
        });
      } catch (error) {
        // If 401, try once more with fresh token
        if (error.response?.status === 401) {
          console.log('🔄 401 error, forcing token refresh');
          this.accessToken = null;
          this.tokenExpiry = 0;
          const freshToken = await this.getAccessToken();
          
          accountResponse = await axios.get(`${this.mailBaseUrl}/api/accounts`, {
            headers: {
              'Authorization': `Zoho-oauthtoken ${freshToken}`,
              'Accept': 'application/json',
            },
          });
        } else {
          throw error;
        }
      }

      const accountKey = accountResponse.data.data[0].accountId;
      
      // Send the email — fromAddress must match the account that generated the OAuth token
      const fromAddress = process.env.ZOHO_FROM_EMAIL || 'info@totaggroup.com';
      const emailData = {
        fromAddress,
        toAddress: options.to,
        subject: options.subject,
        content: options.htmlContent || options.html,
        contentType: 'html',
      };

      let response;
      try {
        response = await axios.post(
          `${this.mailBaseUrl}/api/accounts/${accountKey}/messages`,
          emailData,
          {
            headers: {
              'Authorization': `Zoho-oauthtoken ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );
      } catch (error) {
        // If 401, try once more with fresh token
        if (error.response?.status === 401) {
          console.log('🔄 401 error on send, forcing token refresh');
          this.accessToken = null;
          this.tokenExpiry = 0;
          const freshToken = await this.getAccessToken();
          
          response = await axios.post(
            `${this.mailBaseUrl}/api/accounts/${accountKey}/messages`,
            emailData,
            {
              headers: {
                'Authorization': `Zoho-oauthtoken ${freshToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            }
          );
        } else {
          throw error;
        }
      }

      console.log('✅ Email sent successfully via Zoho:', {
        to: options.to,
        subject: options.subject,
        messageId: response.data?.data?.messageId
      });
      return true;
    } catch (error) {
      console.error('❌ Failed to send email via Zoho:', error.response?.status || error.message);
      return false;
    }
  }
}

const zohoEmailService = new ZohoEmailService();

// SaaS Email Templates
export function generatePaymentConfirmationEmail(data: {
  representativeName: string;
  representativeEmail: string;
  companyName: string;
  selectedModules: any[];
  totalMonthly: number;
  totalSetup: number;
  paymentMethod: string;
  temporaryPassword: string;
}): { to: string; subject: string; htmlContent: string; } {
  const subject = `Payment Confirmed - TOTAG IT Services Enterprise Platform`;
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .module-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .credentials { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Payment Confirmed!</h1>
            <p>Welcome to TOTAG IT Services Enterprise Platform</p>
        </div>
        
        <div class="content">
            <h2>Hello ${data.representativeName},</h2>
            
            <p>Thank you for subscribing to TOTAG IT Services! Your payment has been successfully processed.</p>
            
            <div class="module-list">
                <h3>📦 Your Subscribed Modules (${data.selectedModules.length})</h3>
                <ul>
                    ${data.selectedModules.map(module => `<li><strong>${module.name}</strong> - ${module.description}</li>`).join('')}
                </ul>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p><strong>Monthly Subscription:</strong> $${data.totalMonthly}/month</p>
                    <p><strong>One-time Setup Fee:</strong> $${data.totalSetup}</p>
                    <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                </div>
            </div>
            
            <div class="credentials">
                <h3>🔐 Your Temporary Login Credentials</h3>
                <p><strong>Email:</strong> ${data.representativeEmail}</p>
                <p><strong>Temporary Password:</strong> <code style="background: #fee2e2; padding: 4px 8px; border-radius: 4px;">${data.temporaryPassword}</code></p>
                
                <p><strong>⚠️ IMPORTANT:</strong> You must change this temporary password immediately upon first login for security purposes.</p>
                
                <a href="${process.env.REPLIT_DOMAIN || 'http://localhost:5000'}/saas/login" class="button">Login to Your Account</a>
            </div>
            
            <p>Your account is now active and ready to use. Training videos and setup guides will be sent in a separate email.</p>
            
            <p>If you have any questions, please contact our support team:</p>
            <ul>
                <li>📧 Email: info@totaggroup.com</li>
                <li>📞 Phone: +(231) 777-666-999</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© 2025 TOTAG Group of Companies Ltd. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;

  return {
    to: data.representativeEmail,
    subject,
    htmlContent,
  };
}

export function generateTrainingEmail(data: {
  representativeName: string;
  representativeEmail: string;
  companyName: string;
  selectedModules: any[];
}): { to: string; subject: string; htmlContent: string; } {
  const subject = `Your Training Resources - TOTAG IT Services Platform`;
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .training-section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .video-list { list-style: none; padding: 0; }
        .video-item { background: #f3f4f6; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 Your Training Resources</h1>
            <p>Get started with TOTAG IT Services Platform</p>
        </div>
        
        <div class="content">
            <h2>Hello ${data.representativeName},</h2>
            
            <p>Welcome to TOTAG IT Services! Your account has been successfully created and your modules are ready to use.</p>
            
            <div class="training-section">
                <h3>🎥 Training Videos for Your Modules</h3>
                
                <ul class="video-list">
                    ${data.selectedModules.map(module => `
                        <li class="video-item">
                            <strong>${module.name}</strong><br>
                            <small>Duration: 15-20 minutes</small><br>
                            <em>Learn how to set up and use ${module.name} effectively for your business</em>
                        </li>
                    `).join('')}
                </ul>
                
                <a href="${process.env.REPLIT_DOMAIN || 'http://localhost:5000'}/saas/training" class="button">Access Training Portal</a>
            </div>
            
            <div class="training-section">
                <h3>📖 Quick Start Guide</h3>
                <ol>
                    <li><strong>Login to your account</strong> using the credentials sent in your confirmation email</li>
                    <li><strong>Change your password</strong> immediately for security</li>
                    <li><strong>Complete your company profile</strong> in the settings section</li>
                    <li><strong>Watch the training videos</strong> for your subscribed modules</li>
                    <li><strong>Start using the platform</strong> to manage your business operations</li>
                </ol>
            </div>
            
            <div class="training-section">
                <h3>🎯 Support & Resources</h3>
                <ul>
                    <li>📞 <strong>Phone Support:</strong> +(231) 777-666-999</li>
                    <li>📧 <strong>Email Support:</strong> info@totaggroup.com</li>
                    <li>💬 <strong>Live Chat:</strong> Available in your dashboard</li>
                    <li>📚 <strong>Documentation:</strong> Comprehensive guides available online</li>
                </ul>
            </div>
            
            <p>Our support team is here to help you every step of the way. Don't hesitate to reach out if you need assistance!</p>
        </div>
        
        <div class="footer">
            <p>© 2025 TOTAG Group of Companies Ltd. All rights reserved.</p>
            <p>You're receiving this because you subscribed to TOTAG IT Services.</p>
        </div>
    </div>
</body>
</html>`;

  return {
    to: data.representativeEmail,
    subject,
    htmlContent,
  };
}

// Zoho email sending function for SaaS
export async function sendSaaSEmail(options: { to: string; subject: string; htmlContent: string; }): Promise<boolean> {
  return await zohoEmailService.sendEmail(options);
}

export interface EmailData {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  type: 'order_confirmation' | 'contact_inquiry' | 'notification' | 'marketing';
}

export class EmailService {
  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      let emailStatus = 'pending';
      let emailId = null;

      // Attempt to send email via Zoho
      if (process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN) {
        try {
          const success = await zohoEmailService.sendEmail({
            to: emailData.to,
            subject: emailData.subject,
            htmlContent: emailData.html,
          });

          if (success) {
            emailStatus = 'sent';
            console.log('✅ Email sent successfully via Zoho:', {
              to: emailData.to,
              subject: emailData.subject
            });
          } else {
            emailStatus = 'failed';
          }
        } catch (emailError) {
          console.error('❌ Zoho email error:', emailError);
          emailStatus = 'failed';
        }
      } else {
        console.log('📧 Email would be sent (no Zoho credentials):', {
          to: emailData.to,
          from: emailData.from,
          subject: emailData.subject,
          type: emailData.type
        });
      }

      // For now, just log email tracking (no database integration in memory mode)
      console.log('📧 Email tracking:', {
        to: emailData.to,
        from: emailData.from,
        subject: emailData.subject,
        type: emailData.type,
        status: emailStatus,
        sentAt: new Date().toISOString()
      });

      return emailStatus === 'sent';
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  static async getEmailHistory(limit = 50) {
    // For memory mode, return empty array (no database integration)
    return [];
  }

  // Professional email templates
  static generateOrderConfirmationEmail(order: any, customer: any): EmailData {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .order-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TOTAG General Merchandise</h1>
          <p>Order Confirmation</p>
        </div>
        <div class="content">
          <h2>Thank you for your order, ${customer.firstName}!</h2>
          <p>Your order has been received and is being processed.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
          </div>
          
          <p>We'll notify you when your order is ready for delivery.</p>
          <p>Track your order: <a href="https://totaggroup.com/order-tracking">totaggroup.com/order-tracking</a></p>
        </div>
        <div class="footer">
          <p>TOTAG General Merchandise<br>
          Leading wholesale and retail distributor in West Africa<br>
          Email: orders@totaggroup.com | Phone: +231-XXX-XXXX</p>
        </div>
      </body>
      </html>
    `;

    return {
      to: customer.email,
      from: 'orders@totaggroup.com',
      subject: `Order Confirmation - ${order.orderNumber}`,
      html,
      text: `Thank you for your order ${order.orderNumber}. Total: $${order.totalAmount}. We'll notify you when ready for delivery.`,
      type: 'order_confirmation'
    };
  }

  static generateContactInquiryEmail(inquiry: any): EmailData {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .inquiry-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TOTAG Group of Companies</h1>
          <p>New Contact Inquiry</p>
        </div>
        <div class="content">
          <h2>New Contact Inquiry Received</h2>
          
          <div class="inquiry-details">
            <p><strong>Name:</strong> ${inquiry.name}</p>
            <p><strong>Email:</strong> ${inquiry.email}</p>
            <p><strong>Service:</strong> ${inquiry.service}</p>
            <p><strong>Message:</strong></p>
            <p>${inquiry.message}</p>
          </div>
          
          <p>Please respond to this inquiry within 24 hours.</p>
        </div>
      </body>
      </html>
    `;

    return {
      to: 'info@totaggroup.com',
      from: 'noreply@totaggroup.com',
      subject: `New Contact Inquiry - ${inquiry.service}`,
      html,
      text: `New inquiry from ${inquiry.name} (${inquiry.email}) regarding ${inquiry.service}`,
      type: 'contact_inquiry'
    };
  }

  static generateNotificationEmail(recipient: string, subject: string, message: string): EmailData {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TOTAG Group of Companies</h1>
        </div>
        <div class="content">
          <h2>${subject}</h2>
          <p>${message}</p>
        </div>
        <div class="footer">
          <p>TOTAG Group of Companies Ltd<br>
          Professional Business Solutions Across Seven Specialized Divisions<br>
          Website: totaggroup.com</p>
        </div>
      </body>
      </html>
    `;

    return {
      to: recipient,
      from: 'noreply@totaggroup.com',
      subject,
      html,
      text: message,
      type: 'notification'
    };
  }

  static generateSubsidiaryEmail(
    recipient: string, 
    subject: string, 
    message: string, 
    type: string = 'notification',
    fromEmail: string = 'info@totaggroup.com',
    fromName: string = 'TOTAG Group Corporate',
    subsidiary: string = 'corporate'
  ): EmailData {
    const subsidiaryColors = {
      corporate: '#3b82f6',
      cargo: '#059669',
      farm: '#16a34a',
      petroleum: '#dc2626',
      construction: '#ea580c',
      merchandise: '#7c3aed',
      it: '#0891b2',
      catering: '#be123c'
    };

    const color = subsidiaryColors[subsidiary as keyof typeof subsidiaryColors] || '#3b82f6';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .header { background: linear-gradient(135deg, ${color}, #1e40af); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; max-width: 600px; margin: 0 auto; }
          .subsidiary-badge { background: ${color}; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
          .message-content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${color}; }
          .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .cta-button { background: ${color}; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TOTAG Group of Companies</h1>
          <p>Professional Business Solutions</p>
        </div>
        <div class="content">
          <div class="subsidiary-badge">${fromName.toUpperCase()}</div>
          <h2>${subject}</h2>
          
          <div class="message-content">
            ${message.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
          </div>
          
          <p>Best regards,<br>
          <strong>${fromName}</strong><br>
          TOTAG Group of Companies Ltd</p>
          
          <a href="https://totaggroup.com" class="cta-button">Visit Our Website</a>
        </div>
        <div class="footer">
          <p><strong>${fromName}</strong><br>
          TOTAG Group of Companies Ltd<br>
          Leading Business Solutions Provider in West Africa<br>
          Email: ${fromEmail} | Website: totaggroup.com</p>
          
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            This email was sent from ${fromName}, a subsidiary of TOTAG Group of Companies Ltd.
          </p>
        </div>
      </body>
      </html>
    `;

    return {
      to: recipient,
      from: fromEmail,
      subject: `[${fromName}] ${subject}`,
      html,
      text: `${subject}\n\n${message}\n\nBest regards,\n${fromName}\nTOTAG Group of Companies Ltd\nEmail: ${fromEmail}`,
      type: type as 'order_confirmation' | 'contact_inquiry' | 'notification' | 'marketing'
    };
  }
}