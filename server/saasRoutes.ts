import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes, createHmac } from 'crypto';
import { getSaasStorage, isUsingMemoryStorage } from './saasStorageFactory';

// Global type declarations for pending registrations
declare global {
  var pendingRegistrations: Map<string, any> | undefined;
}

// Verify Flutterwave webhook signature
function verifyFlutterwaveWebhook(payload: string, signature: string, secretHash: string): boolean {
  if (!signature || !secretHash) return false;
  // Flutterwave uses a simple hash comparison for webhook verification
  return signature === secretHash;
}
import { storage } from './storage';
import {
  hashPassword, verifyPassword, generateToken, generateResetToken, 
  generateEmailVerificationToken, verifyResetToken, verifyEmailVerificationToken,
  authenticateToken, requirePermission,
  type AuthenticatedRequest, type JWTPayload
} from './auth';
import { enforceStrictTenantIsolation, type TenantScopedRequest } from './tenantIsolation';
import { insertTenantSchema, insertSaasUserSchema, insertModuleSchema } from '@shared/schema';
import { generatePaymentConfirmationEmail, generateTrainingEmail, sendSaaSEmail } from './emailService';
import { stripeService } from './stripeService';
import { getStripePublishableKey } from './stripeClient';

const router = Router();
const saasStorage = getSaasStorage();

// ==== AUTHENTICATION ROUTES ====

// DEVELOPMENT ONLY: Reset user password
if (process.env.NODE_ENV === 'development') {
  router.post('/auth/dev-reset-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email is required' 
        });
      }

      // Get all users to find the one with this email (since we're in memory storage)
      const users = await saasStorage.listAllUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      // Generate new temporary password
      const newTempPassword = randomBytes(8).toString('base64url').toUpperCase();
      const hashedPassword = await hashPassword(newTempPassword);

      // Update user password
      await saasStorage.updateSaasUser(user.id, {
        password: hashedPassword,
        mustChangePassword: true
      });

      // Get tenant info
      const tenant = await saasStorage.getTenantById(user.tenantId);

      res.json({
        success: true,
        message: 'Password reset successfully (DEV MODE ONLY)',
        loginCredentials: {
          email: user.email,
          temporaryPassword: newTempPassword,
          tenant: tenant?.name,
          loginUrl: `${process.env.REPLIT_DOMAIN || 'http://localhost:5000'}/saas/login`
        },
        note: 'Change this password immediately after login'
      });

    } catch (error) {
      console.error('Dev password reset error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset password'
      });
    }
  });
}

// Portal-based registration schema
const frontendRegistrationSchema = z.object({
  companyName: z.string().min(2).max(100),
  businessType: z.string().min(1),
  employees: z.string().min(1),
  industry: z.string().min(1),
  businessAddress: z.string().min(3),
  representativeName: z.string().min(2).max(100),
  representativeEmail: z.string().email(),
  representativePhone: z.string().min(5, "Phone number required"),
  portalType: z.enum(['hr', 'financial', 'combined']),
  paymentMethod: z.enum(['bank_transfer', 'mobile_money', 'invoice', 'stripe']).default('bank_transfer'),
  monthlyPrice: z.number().min(0),
  firstPayment: z.number().min(0),
});

// Helper function to generate tenant slug from company name
function generateTenantSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50); // Limit length
}

router.post('/auth/register-tenant', async (req: Request, res: Response) => {
  try {
    console.log('🚀 Tenant registration attempt:', req.body);
    const frontendData = frontendRegistrationSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await saasStorage.getSaasUserByEmail(frontendData.representativeEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'A user with this email address already exists. Please login or use a different email.'
      });
    }

    // Generate unique tenant slug
    let tenantSlug = generateTenantSlug(frontendData.companyName);
    const existingTenant = await saasStorage.getTenantBySlug(tenantSlug);
    if (existingTenant) {
      const timestamp = Date.now().toString().slice(-4);
      tenantSlug = `${tenantSlug}-${timestamp}`;
    }

    // Generate secure temporary password
    const temporaryPassword = randomBytes(8).toString('base64url').toUpperCase();
    const hashedPassword = await hashPassword(temporaryPassword);

    const isDirectActivation = frontendData.paymentMethod !== 'stripe' || !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder');
    const tenantStatus = isDirectActivation ? 'active' : 'pending_payment';
    const userActive = isDirectActivation;

    // Create tenant
    const tenantId = uuidv4();
    const tenant = await saasStorage.createTenant({
      id: tenantId,
      name: frontendData.companyName,
      slug: tenantSlug,
      contactEmail: frontendData.representativeEmail,
      contactPhone: frontendData.representativePhone,
      address: frontendData.businessAddress,
      status: tenantStatus
    });

    // Create admin user
    const userId = uuidv4();
    const adminUser = await saasStorage.createSaasUser({
      id: userId,
      tenantId,
      email: frontendData.representativeEmail,
      password: hashedPassword,
      firstName: frontendData.representativeName.split(' ')[0] || frontendData.representativeName,
      lastName: frontendData.representativeName.split(' ').slice(1).join(' ') || '',
      role: 'admin',
      isTenantAdmin: true,
      permissions: ['tenant_admin', 'user_management', 'billing_read', 'billing_write'],
      isActive: userActive,
      phone: frontendData.representativePhone,
      mustChangePassword: true
    });

    // Portal pricing
    const FIRST_PAYMENT = 125;
    const monthlyPrice = frontendData.portalType === 'combined' ? 37 : 20;

    // Create subscription
    const subscriptionId = uuidv4();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = await saasStorage.createSubscription({
      id: subscriptionId,
      tenantId,
      status: isDirectActivation ? 'active' : 'pending_payment',
      currentPeriodStart: startDate,
      currentPeriodEnd: endDate,
      totalAmount: monthlyPrice.toString(),
      nextPaymentDate: endDate,
      billingCycle: 'monthly'
    });

    const portalNames: Record<string, string> = {
      hr: 'HR Management Information System (HRMIS)',
      financial: 'Financial Information Management System (FIMS)',
      combined: 'Combined HRMIS & FIMS Enterprise Suite'
    };

    const paymentMethodTitles: Record<string, string> = {
      bank_transfer: 'Commercial Bank Wire (Ecobank Liberia)',
      mobile_money: 'Liberian Mobile Money (Orange: +231-777-666-999 | MTN: +231-887-666-999)',
      invoice: 'Corporate Net-30 Invoice',
      stripe: 'Credit / Debit Card'
    };

    // If direct activation (Bank Transfer, Mobile Money, Corporate Invoice, or Stripe offline)
    if (isDirectActivation) {
      console.log(`✅ Tenant directly provisioned and activated: ${frontendData.companyName} (${tenantSlug})`);

      // Dispatch welcome email with login credentials and settlement instructions
      try {
        const welcomeHtml = `
          <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;margin:0;">
          <div style="max-width:680px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #cbd5e1;">
            
            <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:24px 28px;color:#ffffff;">
              <h1 style="margin:0;font-size:20px;color:#ffffff;">TOTAG IT Services & SaaS Platform</h1>
              <p style="color:#38bdf8;margin:4px 0 0;font-size:13px;font-weight:bold;">Enterprise Portal Activation Confirmation</p>
            </div>

            <div style="padding:28px 32px;">
              <p style="margin:0 0 14px;font-size:15px;font-weight:bold;color:#0f172a;">
                Dear ${frontendData.representativeName} (${frontendData.companyName}),
              </p>
              <p style="margin:0 0 14px;font-size:14px;color:#334155;line-height:1.6;">
                Welcome to <strong>TOTAG IT Services</strong>! Your enterprise subscription for the <strong>${portalNames[frontendData.portalType]}</strong> has been provisioned and is ready for immediate access.
              </p>

              <!-- CREDENTIALS BOX -->
              <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:18px;margin:20px 0;">
                <h4 style="margin:0 0 10px;font-size:12px;color:#166534;text-transform:uppercase;letter-spacing:0.5px;">🔑 Your Portal Login Credentials</h4>
                <table style="width:100%;font-size:13px;border-collapse:collapse;">
                  <tr><td style="color:#166534;font-weight:bold;padding:4px 0;width:35%;">Portal Login URL:</td><td style="padding:4px 0;"><a href="https://totaggroup.com/saas/login" style="color:#0284c7;font-weight:bold;text-decoration:none;">https://totaggroup.com/saas/login</a></td></tr>
                  <tr><td style="color:#166534;font-weight:bold;padding:4px 0;">Organization Slug:</td><td style="padding:4px 0;font-family:monospace;font-weight:bold;color:#0f172a;">${tenantSlug}</td></tr>
                  <tr><td style="color:#166534;font-weight:bold;padding:4px 0;">Admin Email:</td><td style="padding:4px 0;font-family:monospace;color:#0f172a;">${frontendData.representativeEmail}</td></tr>
                  <tr><td style="color:#166534;font-weight:bold;padding:4px 0;">Temporary Password:</td><td style="padding:4px 0;font-family:monospace;font-weight:bold;color:#166534;font-size:15px;">${temporaryPassword}</td></tr>
                </table>
              </div>

              <!-- SUBSCRIPTION & SETTLEMENT DETAILS -->
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:18px;margin-bottom:20px;">
                <h4 style="margin:0 0 10px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">📋 Subscription & Settlement Summary</h4>
                <table style="width:100%;font-size:13px;border-collapse:collapse;">
                  <tr><td style="color:#64748b;padding:3px 0;">Selected Portal:</td><td style="font-weight:bold;color:#0f172a;text-align:right;">${portalNames[frontendData.portalType]}</td></tr>
                  <tr><td style="color:#64748b;padding:3px 0;">Initial Payment (Setup + Month 1):</td><td style="font-weight:bold;color:#166534;text-align:right;">$125.00 USD</td></tr>
                  <tr><td style="color:#64748b;padding:3px 0;">Monthly Renewal:</td><td style="font-weight:bold;color:#0284c7;text-align:right;">$${monthlyPrice}.00 USD/month</td></tr>
                  <tr><td style="color:#64748b;padding:3px 0;">Selected Settlement Method:</td><td style="font-weight:bold;color:#475569;text-align:right;">${paymentMethodTitles[frontendData.paymentMethod] || frontendData.paymentMethod}</td></tr>
                </table>
              </div>

              <!-- BANK INSTRUCTIONS -->
              <div style="background:#fefce8;border:1px solid #fef08a;border-radius:8px;padding:16px;margin-bottom:20px;">
                <h4 style="margin:0 0 8px;font-size:12px;color:#854d0e;text-transform:uppercase;letter-spacing:0.5px;">🏦 Settlement Instructions</h4>
                <p style="margin:0;font-size:12px;color:#713f12;line-height:1.6;">
                  <strong>Bank Transfer:</strong> TOTAG Group of Companies Ltd<br/>
                  <strong>Bank:</strong> Ecobank Liberia Limited<br/>
                  <strong>Account Number:</strong> 6103394551<br/>
                  <strong>SWIFT Code:</strong> ECOCLRLM<br/>
                  <strong>Mobile Money:</strong> Orange: +231-777-666-999 | MTN MoMo: +231-887-666-999<br/>
                  <em>Please use reference: <strong>SaaS-${tenantSlug.toUpperCase()}</strong> upon settlement.</em>
                </p>
              </div>

              <div style="text-align:center;margin-top:24px;">
                <a href="https://totaggroup.com/saas/login" style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;">Log In to Your SaaS Portal &rarr;</a>
              </div>

            </div>
          </div></body></html>
        `;

        await sendSaaSEmail({
          to: frontendData.representativeEmail,
          subject: `[ACCOUNT READY] Welcome to TOTAG IT Services — ${frontendData.companyName}`,
          htmlContent: welcomeHtml,
          text: `Welcome to TOTAG IT Services!

Your ${portalNames[frontendData.portalType]} is now ready.

Login URL: https://totaggroup.com/saas/login
Tenant: ${tenantSlug}
Email: ${frontendData.representativeEmail}
Temporary Password: ${temporaryPassword}

Bank Settlement: Ecobank Liberia Limited | Acc: 6103394551 | SWIFT: ECOCLRLM | Ref: SaaS-${tenantSlug.toUpperCase()}

Best regards,
TOTAG IT Services Team`,
          type: 'notification'
        });

        // Send internal copy to info@totaggroup.com
        await sendSaaSEmail({
          to: 'info@totaggroup.com',
          subject: `[NEW SAAS TENANT] ${frontendData.companyName} registered (${frontendData.portalType})`,
          htmlContent: welcomeHtml,
          text: `New SaaS Tenant Registered: ${frontendData.companyName} (${tenantSlug})
Email: ${frontendData.representativeEmail}
Payment Method: ${frontendData.paymentMethod}`,
          type: 'notification'
        }).catch(() => {});

      } catch (emailErr: any) {
        console.warn('Welcome email warning:', emailErr.message);
      }

      return res.status(201).json({
        success: true,
        directActivation: true,
        data: {
          companyName: frontendData.companyName,
          tenantSlug,
          portalType: frontendData.portalType,
          monthlyPrice,
          firstPayment: FIRST_PAYMENT,
          paymentMethod: frontendData.paymentMethod,
          email: frontendData.representativeEmail,
          temporaryPassword,
          loginUrl: '/saas/login'
        }
      });
    }

    // Otherwise create Stripe Checkout Session
    try {
      const { getUncachableStripeClient } = await import('./stripeClient');
      const stripe = await getUncachableStripeClient();

      const product = await stripe.products.create({
        name: `TOTAG IT Services - ${portalNames[frontendData.portalType]}`,
        description: `Enterprise SaaS subscription for ${portalNames[frontendData.portalType]}`,
      });

      const recurringPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: monthlyPrice * 100,
        currency: 'usd',
        recurring: { interval: 'month' },
      });

      const setupFee = FIRST_PAYMENT - monthlyPrice;
      const setupPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: setupFee * 100,
        currency: 'usd',
      });

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || req.get('host') || 'totaggroup.com'}`;
      const pendingRegistrationId = uuidv4();

      if (!global.pendingRegistrations) {
        global.pendingRegistrations = new Map();
      }
      global.pendingRegistrations.set(pendingRegistrationId, {
        id: pendingRegistrationId,
        tenantId,
        userId,
        subscriptionId,
        portalType: frontendData.portalType,
        companyName: frontendData.companyName,
        representativeName: frontendData.representativeName,
        representativeEmail: frontendData.representativeEmail,
        monthlyPrice,
        firstPayment: FIRST_PAYMENT,
        temporaryPassword,
        createdAt: new Date()
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: frontendData.representativeEmail,
        line_items: [
          { price: recurringPrice.id, quantity: 1 },
          { price: setupPrice.id, quantity: 1 },
        ],
        success_url: `${baseUrl}/saas/payment-success?session_id={CHECKOUT_SESSION_ID}&registration_id=${pendingRegistrationId}`,
        cancel_url: `${baseUrl}/saas/register?cancelled=true`,
      });

      res.status(201).json({
        success: true,
        data: {
          checkoutUrl: session.url,
          sessionId: session.id,
          pendingRegistrationId,
          tenant: { id: tenantId, name: frontendData.companyName, slug: tenantSlug },
        }
      });

    } catch (stripeErr: any) {
      console.warn('Stripe checkout fallback to direct provisioning:', stripeErr.message);
      // If Stripe throws, fallback to direct activation so the user isn't stuck
      await saasStorage.updateTenant(tenantId, { status: 'active' });
      await saasStorage.updateSaasUser(userId, { isActive: true });
      await saasStorage.updateSubscription(subscriptionId, { status: 'active' });

      res.status(201).json({
        success: true,
        directActivation: true,
        data: {
          companyName: frontendData.companyName,
          tenantSlug,
          portalType: frontendData.portalType,
          monthlyPrice,
          firstPayment: FIRST_PAYMENT,
          paymentMethod: 'invoice',
          email: frontendData.representativeEmail,
          temporaryPassword,
          loginUrl: '/saas/login'
        }
      });
    }

  } catch (error) {
    console.error('Tenant registration error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof z.ZodError ? error.errors : 'Registration failed'
    });
  }
});

// Verify payment and activate tenant
router.post('/auth/verify-payment', async (req: Request, res: Response) => {
  try {
    const { sessionId, registrationId } = req.body;

    if (!sessionId || !registrationId) {
      return res.status(400).json({
        success: false,
        error: 'Missing session ID or registration ID'
      });
    }

    // Get pending registration data
    if (!global.pendingRegistrations) {
      return res.status(400).json({
        success: false,
        error: 'Registration not found'
      });
    }

    const registrationData = global.pendingRegistrations.get(registrationId);
    if (!registrationData) {
      return res.status(400).json({
        success: false,
        error: 'Registration not found or expired'
      });
    }

    // Verify payment with Stripe
    const { getUncachableStripeClient } = await import('./stripeClient');
    const stripe = await getUncachableStripeClient();
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Payment not completed'
      });
    }

    // Activate the tenant
    const tenant = await saasStorage.getTenantById(registrationData.tenantId);
    if (tenant) {
      await saasStorage.updateTenant(registrationData.tenantId, { status: 'active' });
    }

    // Activate the user
    await saasStorage.updateSaasUser(registrationData.userId, { isActive: true });

    // Activate the subscription
    await saasStorage.updateSubscription(registrationData.subscriptionId, { status: 'active' });

    // Remove from pending registrations
    global.pendingRegistrations.delete(registrationId);

    console.log('✅ Payment verified and account activated:', registrationData.representativeEmail);

    // Send welcome email with credentials
    try {
      const welcomeEmail = {
        to: registrationData.representativeEmail,
        subject: 'Welcome to TOTAG IT Services - Your Account is Ready!',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to TOTAG IT Services!</h1>
            <p>Dear ${registrationData.representativeName},</p>
            <p>Your payment has been processed and your account is now active.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Login Credentials</h3>
              <p><strong>Email:</strong> ${registrationData.representativeEmail}</p>
              <p><strong>Temporary Password:</strong> ${registrationData.temporaryPassword}</p>
            </div>
            <p>Please change your password upon first login.</p>
            <p>Best regards,<br>TOTAG IT Services Team</p>
          </div>
        `
      };
      await sendSaaSEmail(welcomeEmail);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.json({
      success: true,
      data: {
        companyName: registrationData.companyName,
        portalType: registrationData.portalType,
        monthlyPrice: registrationData.monthlyPrice,
        email: registrationData.representativeEmail,
        temporaryPassword: registrationData.temporaryPassword
      }
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment verification failed'
    });
  }
});

// User login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  tenantSlug: z.string().optional() // For multi-tenant login
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password, tenantSlug } = loginSchema.parse(req.body);
    console.log(`🔐 Login attempt: email=${email}, tenantSlug=${tenantSlug || 'auto-detect'}`);

    let tenant: any = null;
    let user: any = null;

    if (tenantSlug) {
      // Login with specific tenant slug
      tenant = await saasStorage.getTenantBySlug(tenantSlug);
      if (!tenant) {
        console.log(`❌ Tenant not found: ${tenantSlug}`);
        return res.status(401).json({
          success: false,
          error: 'Invalid tenant'
        });
      }
      user = await saasStorage.getSaasUserByEmail(email, tenant.id);
    } else {
      // Find user by email across all tenants (improved UX)
      const allUsers = await saasStorage.listAllUsers();
      console.log(`🔍 Searching ${allUsers.length} users for email: ${email}`);
      const matchedUser = allUsers.find((u: any) => u.email === email && u.isActive);
      
      if (matchedUser) {
        user = matchedUser;
        tenant = await saasStorage.getTenantById(user.tenantId);
        console.log(`✅ Found user: ${user.firstName} ${user.lastName} in tenant: ${tenant?.name}`);
      } else {
        console.log(`❌ No active user found with email: ${email}`);
      }
    }

    if (!user || !user.isActive) {
      console.log(`❌ User not found or inactive: user=${!!user}, isActive=${user?.isActive}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    console.log(`🔍 Verifying password for user: ${user.email}`);
    const isValidPassword = await verifyPassword(password, user.password);
    console.log(`🔐 Password verification result: ${isValidPassword}`);
    
    if (!isValidPassword) {
      console.log(`❌ Password verification failed for user: ${user.email}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await saasStorage.updateUserLastLogin(user.id);

    // Check if user must change password
    if (user.mustChangePassword) {
      return res.json({
        success: true,
        requirePasswordChange: true,
        data: {
          userId: user.id,
          email: user.email,
          message: 'You must change your temporary password before accessing the platform'
        }
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: user.permissions,
      isTenantAdmin: user.isTenantAdmin
    });

    res.json({
      success: true,
      data: {
        user: { ...user, password: undefined },
        tenant,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof z.ZodError ? error.errors : 'Login failed'
    });
  }
});

// Change password (for temporary password flow)
const changePasswordSchema = z.object({
  userId: z.string().uuid(),
  currentPassword: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

router.post('/auth/change-password', async (req: Request, res: Response) => {
  try {
    const { userId, currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    // Get user
    const user = await saasStorage.getSaasUserById(userId);
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password and clear mustChangePassword flag
    await saasStorage.updateSaasUser(userId, {
      password: hashedNewPassword,
      mustChangePassword: false
    });

    // Generate token for successful login
    const token = generateToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: user.permissions,
      isTenantAdmin: user.isTenantAdmin
    });

    // Get tenant info
    const tenant = await saasStorage.getTenantById(user.tenantId);

    res.json({
      success: true,
      data: {
        user: { ...user, password: undefined, mustChangePassword: false },
        tenant,
        token,
        message: 'Password changed successfully'
      }
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof z.ZodError ? error.errors : 'Password change failed'
    });
  }
});

// Get current user profile
router.get('/auth/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await saasStorage.getSaasUserById(req.user!.id);
    const tenant = await saasStorage.getTenantById(req.user!.tenantId);

    if (!user || !tenant) {
      return res.status(404).json({
        success: false,
        error: 'User or tenant not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: { ...user, password: undefined },
        tenant
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// ==== TENANT MANAGEMENT ROUTES ====

// Get tenant profile & white-label branding
router.get('/tenant/profile', authenticateToken, enforceStrictTenantIsolation, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = (req as TenantScopedRequest).tenantId;
    const tenant = await saasStorage.getTenantById(tenantId);
    if (!tenant) {
      return res.status(404).json({ success: false, error: 'Tenant not found' });
    }

    res.json({
      success: true,
      data: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        contactEmail: tenant.contactEmail,
        contactPhone: tenant.contactPhone,
        address: tenant.address,
        status: tenant.status,
        portalType: (tenant as any).portalType || 'combined',
        brandColor: (tenant as any).brandColor || '#1e40af',
        taxId: (tenant as any).taxId || 'TIN-100984712',
        customLogoUrl: (tenant as any).customLogoUrl || ''
      }
    });
  } catch (error) {
    console.error('Tenant profile fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tenant profile' });
  }
});

// Update tenant profile & white-label branding
router.patch('/tenant/profile', authenticateToken, enforceStrictTenantIsolation, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = (req as TenantScopedRequest).tenantId;
    const { name, address, contactPhone, brandColor, taxId, customLogoUrl } = req.body;

    const updated = await saasStorage.updateTenant(tenantId, {
      name,
      address,
      contactPhone,
      ...(brandColor && { brandColor }),
      ...(taxId && { taxId }),
      ...(customLogoUrl && { customLogoUrl })
    } as any);

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Tenant profile update error:', error);
    res.status(500).json({ success: false, error: 'Failed to update tenant profile' });
  }
});

// Get tenant dashboard stats
router.get('/tenant/dashboard', authenticateToken, enforceStrictTenantIsolation, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = (req as TenantScopedRequest).tenantId;
    
    const stats = await saasStorage.getTenantStats(tenantId);
    const activeModules = await saasStorage.getActiveTenantModules(tenantId);
    const subscription = await saasStorage.getTenantSubscription(tenantId);
    const recentInvoices = await saasStorage.getTenantInvoices(tenantId);

    res.json({
      success: true,
      data: {
        stats,
        activeModules,
        subscription,
        recentInvoices: recentInvoices.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

// ==== MODULE MANAGEMENT ROUTES ====

// Get available modules
router.get('/modules', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    let modules;
    if (category) {
      modules = await saasStorage.getModulesByCategory(category as string);
    } else {
      modules = await saasStorage.listActiveModules();
    }

    // Group modules by category
    const groupedModules = modules.reduce((acc, module) => {
      if (!acc[module.category]) {
        acc[module.category] = [];
      }
      acc[module.category].push(module);
      return acc;
    }, {} as Record<string, any[]>);

    res.json({
      success: true,
      data: {
        modules,
        groupedModules
      }
    });

  } catch (error) {
    console.error('Modules fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch modules'
    });
  }
});

// Get tenant's subscribed modules
router.get('/tenant/modules', authenticateToken, enforceStrictTenantIsolation, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = (req as TenantScopedRequest).tenantId;
    const tenant = await saasStorage.getTenantById(tenantId);
    if (!tenant) {
      return res.status(401).json({ success: false, error: 'Tenant not found' });
    }

    // Get portal type and determine accessible modules
    const portalType = (tenant as any).portalType || 'none';
    
    // Define which modules are accessible for each portal type
    const hrModules = [
      'hr_core', 'hr_recruitment', 'hr_talent', 'hr_compensation', 'hr_self_service', 'hr_analytics', 'hr_biometrics_attendance',
      'hr_time_leave', 'hr_payroll', 'hr_learning', 'hr_employee_relations', 'hr_offboarding', 'hr_position_control', 'hr_documents', 'platform_governance'
    ];
    const fimsModules = [
      'fims_general_ledger', 'fims_accounts_payable', 'fims_accounts_receivable', 'fims_treasury', 'fims_budgeting', 'fims_procurement', 'fims_reporting', 'fims_compliance', 'fims_commitment_control', 'fims_fixed_assets', 'fims_contracts', 'fims_projects'
    ];
    const portalModules: Record<string, string[]> = {
      'hr': hrModules,
      'financial': fimsModules,
      'combined': [...hrModules, ...fimsModules],
      'none': [] // No subscription = no modules
    };

    const accessibleModuleIds = portalModules[portalType] || [];
    
    // Get all modules and filter based on portal type
    const allModules = await saasStorage.listActiveModules();
    const accessibleModules = allModules.filter((m: any) => accessibleModuleIds.includes(m.id));

    res.json({
      success: true,
      data: {
        portalType,
        modules: accessibleModules,
        hasSubscription: portalType !== 'none'
      }
    });

  } catch (error) {
    console.error('Tenant modules fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tenant modules'
    });
  }
});

// ==== FIMS ROUTES (Sample Implementation) ====

// Get chart of accounts
router.get('/fims/chart-of-accounts', 
  authenticateToken, 
  enforceStrictTenantIsolation,
  requirePermission('fims_gl_read'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const accounts = await saasStorage.getChartOfAccounts(tenantId);

      res.json({
        success: true,
        data: accounts
      });

    } catch (error) {
      console.error('Chart of accounts error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch chart of accounts'
      });
    }
  }
);

// Create chart of account
const createAccountSchema = z.object({
  accountCode: z.string().min(1).max(20),
  accountName: z.string().min(1).max(100),
  accountType: z.enum(['asset', 'liability', 'equity', 'revenue', 'expense']),
  parentAccountId: z.string().optional(),
  description: z.string().optional(),
  balanceType: z.enum(['debit', 'credit'])
});

router.post('/fims/chart-of-accounts',
  authenticateToken,
  enforceStrictTenantIsolation,
  requirePermission('fims_gl_write'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const data = createAccountSchema.parse(req.body);

      const account = await saasStorage.createChartOfAccount({
        id: uuidv4(),
        tenantId,
        ...data
      });

      res.status(201).json({
        success: true,
        data: account
      });

    } catch (error) {
      console.error('Create account error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof z.ZodError ? error.errors : 'Failed to create account'
      });
    }
  }
);

// ==== USER MANAGEMENT ROUTES ====

// Get tenant users
router.get('/tenant/users',
  authenticateToken,
  enforceStrictTenantIsolation,
  requirePermission('user_management'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const users = await saasStorage.getTenantUsers(tenantId);
      
      // Remove passwords from response
      const safeUsers = users.map(user => ({ ...user, password: undefined }));

      res.json({
        success: true,
        data: safeUsers
      });

    } catch (error) {
      console.error('Users fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  }
);

// Create new user
const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().optional(),
  role: z.enum(['admin', 'manager', 'user', 'viewer']),
  permissions: z.array(z.string()).default([])
});

router.post('/tenant/users',
  authenticateToken,
  enforceStrictTenantIsolation,
  requirePermission('user_management'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const data = createUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await saasStorage.getSaasUserByEmail(data.email, tenantId);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashPassword(tempPassword);

      const user = await saasStorage.createSaasUser({
        id: uuidv4(),
        tenantId,
        password: hashedPassword,
        invitedBy: req.user!.id,
        invitedAt: new Date(),
        ...data
      });

      // TODO: Send invitation email with temporary password

      res.status(201).json({
        success: true,
        data: {
          user: { ...user, password: undefined },
          temporaryPassword: tempPassword // In production, send via email
        }
      });

    } catch (error) {
      console.error('Create user error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof z.ZodError ? error.errors : 'Failed to create user'
      });
    }
  }
);

// ==== SELF-SERVICE ROUTES ====
import { insertLeaveRequestSchema, insertHrRequestSchema, insertAttendanceSchema } from '@shared/schema';

// Helper function to get employee ID from authenticated SaaS user (tenant-scoped)
async function getEmployeeIdFromSaasUser(user: any): Promise<number> {
  try {
    // SECURITY: Tenant-scoped lookup to prevent cross-tenant data leakage
    // Look up employee by email AND tenantId for proper multi-tenant isolation
    const employees = await storage.getAllEmployees();
    const employee = employees.find((emp: any) => 
      emp.email === user.email && emp.tenantId === user.tenantId
    );
    
    if (!employee) {
      throw new Error(`No employee found for email: ${user.email} in tenant: ${user.tenantId}`);
    }
    
    return employee.id; // This is the serial ID from employees table
  } catch (error) {
    console.error('Error mapping SaaS user to employee:', error);
    throw new Error('Failed to map user to employee record');
  }
}

// Submit Leave Request
router.post('/self-service/leave-request',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Parse date strings and get proper employee ID via email lookup
      const employeeId = await getEmployeeIdFromSaasUser(req.user!);
      const requestData = {
        ...req.body,
        startDate: typeof req.body.startDate === 'string' ? new Date(req.body.startDate) : req.body.startDate,
        endDate: typeof req.body.endDate === 'string' ? new Date(req.body.endDate) : req.body.endDate,
        employeeId
      };
      
      const data = insertLeaveRequestSchema.parse(requestData);
      
      // Create leave request
      const leaveRequest = await saasStorage.createLeaveRequest(data);
      
      res.status(201).json({
        success: true,
        data: leaveRequest,
        message: 'Leave request submitted successfully'
      });

    } catch (error) {
      console.error('Leave request error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof z.ZodError ? error.errors : 'Failed to submit leave request'
      });
    }
  }
);

// Submit HR Request
router.post('/self-service/hr-request',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Get proper employee ID via email lookup, ignore client-provided employeeId
      const employeeId = await getEmployeeIdFromSaasUser(req.user!);
      const requestData = {
        ...req.body,
        employeeId
      };
      
      const data = insertHrRequestSchema.parse(requestData);
      
      // Create HR request
      const hrRequest = await saasStorage.createHrRequest(data);
      
      res.status(201).json({
        success: true,
        data: hrRequest,
        message: 'HR request submitted successfully'
      });

    } catch (error) {
      console.error('HR request error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof z.ZodError ? error.errors : 'Failed to submit HR request'
      });
    }
  }
);

// Submit Timesheet Entry
router.post('/self-service/timesheet',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Parse date strings and get proper employee ID via email lookup
      const employeeId = await getEmployeeIdFromSaasUser(req.user!);
      const requestData = {
        ...req.body,
        date: typeof req.body.date === 'string' ? new Date(req.body.date) : req.body.date,
        employeeId
      };
      
      const data = insertAttendanceSchema.parse(requestData);
      
      // Create attendance/timesheet entry
      const attendance = await saasStorage.createAttendance(data);
      
      res.status(201).json({
        success: true,
        data: attendance,
        message: 'Timesheet submitted successfully'
      });

    } catch (error) {
      console.error('Timesheet error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof z.ZodError ? error.errors : 'Failed to submit timesheet'
      });
    }
  }
);

// Update Employee Profile
const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  personalPhone: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  address: z.string().optional()
});

router.patch('/self-service/profile',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const data = updateProfileSchema.parse(req.body);
      // SECURITY: Get proper employee ID via email lookup, ignore client-provided employeeId
      const employeeId = await getEmployeeIdFromSaasUser(req.user!);
      
      // Update employee profile
      const employee = await saasStorage.updateEmployeeProfile(employeeId, data);
      
      res.json({
        success: true,
        data: employee,
        message: 'Profile updated successfully'
      });

    } catch (error) {
      console.error('Profile update error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof z.ZodError ? error.errors : 'Failed to update profile'
      });
    }
  }
);

// Get Recent Activity for Dashboard
router.get('/self-service/activity',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // SECURITY: Get proper employee ID via email lookup, ignore client-provided employeeId
      const employeeId = await getEmployeeIdFromSaasUser(req.user!);
      
      // Get recent activity (leave requests, attendance, etc.) from main storage
      const leaveRequests = await storage.getLeaveRequestsByEmployee(employeeId);
      const attendance = await storage.getAttendanceByEmployee(employeeId);
      const payroll = await storage.getPayrollByEmployee(employeeId);
      
      // Combine activity data
      const activity = {
        leaveRequests: leaveRequests.slice(0, 5), // Last 5 leave requests
        attendance: attendance.slice(0, 10), // Last 10 attendance records
        payroll: payroll.slice(0, 3) // Last 3 payroll records
      };
      
      res.json({
        success: true,
        data: activity
      });

    } catch (error) {
      console.error('Activity fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch activity'
      });
    }
  }
);

// ==== STRIPE PAYMENT ROUTES ====

// Get Stripe publishable key for frontend
router.get('/stripe/config', async (req: Request, res: Response) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({
      success: true,
      data: {
        publishableKey
      }
    });
  } catch (error) {
    console.error('Stripe config error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Stripe configuration'
    });
  }
});

// Get Stripe products with prices for SaaS modules
router.get('/stripe/products', async (req: Request, res: Response) => {
  try {
    const rows = await stripeService.listProductsWithPrices();
    
    // Group prices by product
    const productsMap = new Map();
    for (const row of rows as any[]) {
      if (!productsMap.has(row.product_id)) {
        productsMap.set(row.product_id, {
          id: row.product_id,
          name: row.product_name,
          description: row.product_description,
          active: row.product_active,
          metadata: row.product_metadata,
          prices: []
        });
      }
      if (row.price_id) {
        productsMap.get(row.product_id).prices.push({
          id: row.price_id,
          unit_amount: row.unit_amount,
          currency: row.currency,
          recurring: row.recurring,
          active: row.price_active,
        });
      }
    }

    res.json({
      success: true,
      data: Array.from(productsMap.values())
    });
  } catch (error) {
    console.error('Stripe products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Stripe products'
    });
  }
});

// Create Stripe checkout session for portal subscription
router.post('/stripe/portal-checkout',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { portalType } = req.body;
      
      if (!portalType || !['hr', 'financial', 'combined'].includes(portalType)) {
        return res.status(400).json({
          success: false,
          error: 'Valid portal type required (hr, financial, or combined)'
        });
      }

      const tenantId = (req as TenantScopedRequest).tenantId;
      const tenant = await saasStorage.getTenantById(tenantId);
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: 'Tenant not found'
        });
      }

      // Get or create Stripe customer
      let stripeCustomerId = tenant.stripeCustomerId;
      
      if (!stripeCustomerId) {
        const customer = await stripeService.createCustomer(
          tenant.contactEmail,
          tenantId,
          tenant.name
        );
        stripeCustomerId = customer.id;
        await saasStorage.updateTenant(tenantId, { stripeCustomerId: customer.id });
      }

      // Get first month payment price ($125 one-time)
      const firstMonthPrice = await stripeService.getPriceForPortal('first_month_payment');
      
      // Get subscription price based on portal type
      let subscriptionPortalId: string;
      if (portalType === 'hr') {
        subscriptionPortalId = 'hr_portal';
      } else if (portalType === 'financial') {
        subscriptionPortalId = 'financial_portal';
      } else {
        subscriptionPortalId = 'combined_portals';
      }
      
      const subscriptionPrice = await stripeService.getPriceForPortal(subscriptionPortalId);
      
      if (!subscriptionPrice) {
        return res.status(400).json({
          success: false,
          error: 'Subscription price not found. Please run the seed script.'
        });
      }

      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;

      const session = await stripeService.createPortalCheckoutSession(
        stripeCustomerId,
        (firstMonthPrice?.id as string) || null,
        subscriptionPrice.id as string,
        `${baseUrl}/saas/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        `${baseUrl}/saas/subscription`,
        tenantId,
        portalType
      );

      res.json({
        success: true,
        data: {
          url: session.url,
          sessionId: session.id
        }
      });

    } catch (error) {
      console.error('Stripe portal checkout error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create Stripe checkout session'
      });
    }
  }
);

// Create Stripe checkout session for SaaS subscription (legacy module-based)
router.post('/stripe/checkout',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { moduleIds } = req.body;
      
      if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Module IDs are required'
        });
      }

      // Enforce minimum 4 modules
      if (moduleIds.length < 4) {
        return res.status(400).json({
          success: false,
          error: 'Minimum 4 modules required for subscription'
        });
      }

      const tenantId = (req as TenantScopedRequest).tenantId;
      const tenant = await saasStorage.getTenantById(tenantId);
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: 'Tenant not found'
        });
      }

      // Get or create Stripe customer
      let stripeCustomerId = tenant.stripeCustomerId;
      
      if (!stripeCustomerId) {
        const customer = await stripeService.createCustomer(
          tenant.contactEmail,
          tenantId,
          tenant.name
        );
        stripeCustomerId = customer.id;
        
        // Store customer ID with tenant
        await saasStorage.updateTenant(tenantId, { stripeCustomerId: customer.id });
      }

      // Get Stripe prices for selected modules
      const priceIds: string[] = [];
      for (const moduleId of moduleIds) {
        const price = await stripeService.getPriceForModule(moduleId);
        if (price) {
          priceIds.push(price.id as string);
        }
      }

      if (priceIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid Stripe prices found for selected modules. Please run the seed script first.'
        });
      }

      // Build success/cancel URLs
      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;

      const session = await stripeService.createCheckoutSession(
        stripeCustomerId,
        priceIds,
        `${baseUrl}/saas/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        `${baseUrl}/saas/subscription`,
        tenantId,
        moduleIds
      );

      res.json({
        success: true,
        data: {
          url: session.url,
          sessionId: session.id
        }
      });

    } catch (error) {
      console.error('Stripe checkout error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create Stripe checkout session'
      });
    }
  }
);

// Create Stripe customer portal session for managing subscription
router.post('/stripe/portal',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const tenant = await saasStorage.getTenantById(tenantId);
      
      if (!tenant || !tenant.stripeCustomerId) {
        return res.status(400).json({
          success: false,
          error: 'No active subscription found'
        });
      }

      const protocol = req.protocol;
      const host = req.get('host');
      const returnUrl = `${protocol}://${host}/saas/subscription`;

      const session = await stripeService.createCustomerPortalSession(
        tenant.stripeCustomerId,
        returnUrl
      );

      res.json({
        success: true,
        data: {
          url: session.url
        }
      });

    } catch (error) {
      console.error('Stripe portal error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create billing portal session'
      });
    }
  }
);

// ==== MTN MOMOPAY PAYMENT ROUTES ====

import {
  initializeMtnMomoPayment,
  checkMtnMomoPaymentStatus,
  createMtnMomoSubscription,
  getMtnMomoPaymentMethods,
  createMtnMomoSubscriptionPlans,
  formatPhoneForMtnMomo,
  validateLiberianPhone,
  convertCurrency,
  formatLiberianCurrency,
  generateReferenceId,
  DEFAULT_MTN_MOMO_CONFIG,
  type MtnMomoConfig,
  type MtnMomoPaymentInput
} from '@shared/mtn-momopay';

// MTN MoMo configuration
const getMtnMomoConfig = (): MtnMomoConfig => ({
  ...DEFAULT_MTN_MOMO_CONFIG,
  subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY || '',
  apiUserId: process.env.MTN_MOMO_API_USER_ID || '',
  apiKey: process.env.MTN_MOMO_API_KEY || ''
});

// Initialize payment for subscription
router.post('/payments/initialize',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { moduleIds, currency = 'USD', phoneNumber } = req.body;
      
      if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Module IDs are required'
        });
      }

      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          error: 'Phone number is required for MTN MoMo payment'
        });
      }

      // Validate and format phone number
      const formattedPhone = formatPhoneForMtnMomo(phoneNumber);
      if (!validateLiberianPhone(formattedPhone)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Liberian phone number format. Use +231XXXXXXXX'
        });
      }

      // Get modules to calculate total amount
      const modules = await saasStorage.listActiveModules();
      const selectedModules = modules.filter(m => moduleIds.includes(m.id));
      
      if (selectedModules.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid modules found'
        });
      }

      // Apply minimum 4 modules rule
      if (selectedModules.length < 4) {
        return res.status(400).json({
          success: false,
          error: 'Minimum 4 modules required for subscription'
        });
      }

      // Calculate total monthly amount in USD first
      const totalAmountUSD = selectedModules.reduce((sum, module) => {
        return sum + parseFloat(module.monthlyPrice);
      }, 0);

      // Apply 10% discount if all modules selected
      const allModulesCount = modules.length;
      const isAllModules = selectedModules.length === allModulesCount;
      const finalAmountUSD = isAllModules ? totalAmountUSD * 0.9 : totalAmountUSD;

      // Convert to requested currency
      const finalAmount = currency === 'LRD' ? 
        convertCurrency(finalAmountUSD, 'USD', 'LRD') : finalAmountUSD;

      // Create payment reference
      const referenceId = generateReferenceId();
      const externalId = `TOTAG_${req.user!.tenantId}_${Date.now()}`;

      const paymentData: MtnMomoPaymentInput = {
        amount: finalAmount.toFixed(2),
        currency: currency as 'USD' | 'LRD',
        externalId: externalId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: formattedPhone
        },
        payerMessage: `TOTAG SaaS Subscription - ${selectedModules.length} modules`,
        payeeNote: `Monthly subscription payment for ${req.user!.firstName} ${req.user!.lastName}`,
        referenceId: referenceId
      };

      const config = getMtnMomoConfig();
      const result = await initializeMtnMomoPayment(paymentData, config);

      if (result.status === 'success') {
        // Store payment reference for tracking
        // TODO: Store in database for webhook processing
        
        res.json({
          success: true,
          data: {
            referenceId: referenceId,
            externalId: externalId,
            amount: finalAmount,
            currency: currency,
            phoneNumber: formattedPhone,
            modules: selectedModules.map(m => ({ id: m.id, name: m.name, price: m.monthlyPrice })),
            discount: isAllModules ? '10%' : 'None',
            paymentMethod: 'MTN Mobile Money',
            instructions: 'Please check your phone for MTN MoMo payment request and confirm the payment.'
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.message
        });
      }

    } catch (error) {
      console.error('Payment initialization error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initialize MTN MoMo payment'
      });
    }
  }
);

// Check payment status
router.post('/payments/status',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { referenceId } = req.body;
      
      if (!referenceId) {
        return res.status(400).json({
          success: false,
          error: 'Reference ID is required'
        });
      }

      const config = getMtnMomoConfig();
      const result = await checkMtnMomoPaymentStatus(referenceId, config);

      if (result.status === 'success' && result.data) {
        // Payment completed successfully
        // TODO: Create or update subscription record in database
        // This would typically involve:
        // 1. Creating a subscription record
        // 2. Activating the selected modules for the tenant
        // 3. Setting billing cycle start date
        // 4. Sending confirmation email

        res.json({
          success: true,
          data: {
            verified: true,
            status: result.data.status,
            amount: result.data.amount,
            currency: result.data.currency,
            referenceId: result.data.referenceId,
            financialTransactionId: result.data.financialTransactionId,
            externalId: result.data.externalId,
            paymentMethod: 'MTN Mobile Money'
          }
        });
      } else if (result.status === 'pending') {
        res.json({
          success: true,
          data: {
            verified: false,
            status: 'PENDING',
            message: 'Payment is still pending. Please complete the payment on your phone.'
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.message || 'Payment verification failed'
        });
      }

    } catch (error) {
      console.error('Payment status check error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check payment status'
      });
    }
  }
);

// Webhook endpoint for Flutterwave notifications
router.post('/payments/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['verif-hash'] as string;
    const payload = JSON.stringify(req.body);
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH || '';

    // Verify webhook signature
    if (!verifyFlutterwaveWebhook(payload, signature, secretHash)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid webhook signature'
      });
    }

    const webhookData = req.body;
    
    // Handle different webhook events
    switch (webhookData.event) {
      case 'charge.completed':
        // Handle successful payment
        console.log('Payment completed:', webhookData.data);
        // TODO: Update subscription status, activate modules, send confirmation
        break;
        
      case 'subscription.cancelled':
        // Handle subscription cancellation
        console.log('Subscription cancelled:', webhookData.data);
        // TODO: Deactivate modules, update subscription status
        break;
        
      default:
        console.log('Unhandled webhook event:', webhookData.event);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

// Get available payment methods for Liberian market
router.get('/payments/methods', async (req: Request, res: Response) => {
  try {
    const paymentMethods = getMtnMomoPaymentMethods();
    
    res.json({
      success: true,
      data: {
        methods: paymentMethods,
        currencies: ['USD', 'LRD'],
        exchangeRate: '1 USD = 190 LRD (approx)',
        features: {
          recurringBilling: true,
          mobileMoneySupport: true,
          realTimePayments: true,
          phoneVerification: true
        },
        instructions: {
          payment: 'Enter your MTN Mobile Money phone number to receive payment request',
          format: 'Use format: +231XXXXXXXX or 231XXXXXXXX',
          support: 'For issues, contact MTN Liberia customer service'
        }
      }
    });

  } catch (error) {
    console.error('Payment methods error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment methods'
    });
  }
});

// Get subscription status
router.get('/subscription/status',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const tenant = await saasStorage.getTenantById(tenantId);
      if (!tenant) {
        return res.status(401).json({ success: false, error: 'Tenant not found' });
      }

      // Get portal pricing
      const portalPricing: Record<string, { monthly: number, modules: string[] }> = {
        'hr': { 
          monthly: 20, 
          modules: ['hr_core', 'hr_recruitment', 'hr_talent', 'hr_compensation', 'hr_self_service', 'hr_analytics', 'hr_biometrics_attendance', 'hr_time_leave', 'hr_payroll', 'hr_learning', 'hr_employee_relations', 'hr_offboarding', 'hr_position_control', 'hr_documents', 'platform_governance'] 
        },
        'financial': { 
          monthly: 20, 
          modules: ['fims_general_ledger', 'fims_accounts_payable', 'fims_accounts_receivable', 'fims_treasury', 'fims_budgeting', 'fims_procurement', 'fims_reporting', 'fims_compliance', 'fims_commitment_control', 'fims_fixed_assets', 'fims_contracts', 'fims_projects'] 
        },
        'combined': { 
          monthly: 37, 
          modules: ['hr_core', 'hr_recruitment', 'hr_talent', 'hr_compensation', 'hr_self_service', 'hr_analytics', 'hr_biometrics_attendance', 'hr_time_leave', 'hr_payroll', 'hr_learning', 'hr_employee_relations', 'hr_offboarding', 'hr_position_control', 'hr_documents', 'platform_governance',
                    'fims_general_ledger', 'fims_accounts_payable', 'fims_accounts_receivable', 'fims_treasury', 'fims_budgeting', 'fims_procurement', 'fims_reporting', 'fims_compliance', 'fims_commitment_control', 'fims_fixed_assets', 'fims_contracts', 'fims_projects'] 
        },
        'none': { monthly: 0, modules: [] }
      };

      const portalType = (tenant as any).portalType || 'none';
      const subscriptionStatus = (tenant as any).subscriptionStatus || 'trial';
      const pricing = portalPricing[portalType] || portalPricing['none'];
      
      // Calculate billing dates
      const startDate = (tenant as any).subscriptionStartDate || null;
      const nextBillingDate = startDate 
        ? new Date(new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000)
        : null;

      res.json({
        success: true,
        data: {
          isActive: subscriptionStatus === 'active' || subscriptionStatus === 'trial',
          portalType,
          subscriptionStatus,
          plan: portalType === 'combined' ? 'Combined HR & Financial' : 
                portalType === 'hr' ? 'HR Management' : 
                portalType === 'financial' ? 'Financial Management' : 'No Subscription',
          nextBillingDate,
          amount: pricing.monthly,
          firstMonthFee: 125,
          currency: 'USD',
          paymentMethod: (tenant as any).stripeSubscriptionId ? 'card' : 'none',
          modules: pricing.modules,
          stripeCustomerId: (tenant as any).stripeCustomerId || null,
          stripeSubscriptionId: (tenant as any).stripeSubscriptionId || null
        }
      });

    } catch (error) {
      console.error('Subscription status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get subscription status'
      });
    }
  }
);

// ==== HR MODULE ENDPOINTS ====

// Employees CRUD
router.get('/hr/employees',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const employees = await saasStorage.listEmployees(tenantId);
      res.json({ success: true, data: employees });
    } catch (error) {
      console.error('List employees error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch employees' });
    }
  }
);

router.post('/hr/employees',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const employeeData = { ...req.body, tenantId };
      const employee = await saasStorage.createEmployee(employeeData);
      res.json({ success: true, data: employee });
    } catch (error) {
      console.error('Create employee error:', error);
      res.status(500).json({ success: false, error: 'Failed to create employee' });
    }
  }
);

router.patch('/hr/employees/:id',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const employeeId = req.params.id;
      const employee = await saasStorage.updateEmployee(tenantId, employeeId, req.body);
      res.json({ success: true, data: employee });
    } catch (error) {
      console.error('Update employee error:', error);
      res.status(500).json({ success: false, error: 'Failed to update employee' });
    }
  }
);

// Departments CRUD
router.get('/hr/departments',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const departments = await saasStorage.listDepartments(tenantId);
      res.json({ success: true, data: departments });
    } catch (error) {
      console.error('List departments error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch departments' });
    }
  }
);

router.post('/hr/departments',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const departmentData = { ...req.body, tenantId, id: crypto.randomUUID() };
      const department = await saasStorage.createDepartment(departmentData);
      res.json({ success: true, data: department });
    } catch (error) {
      console.error('Create department error:', error);
      res.status(500).json({ success: false, error: 'Failed to create department' });
    }
  }
);

// Documents CRUD
router.get('/hr/documents',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const category = req.query.category as string | undefined;
      const documents = await saasStorage.listDocuments(tenantId, category);
      res.json({ success: true, data: documents });
    } catch (error) {
      console.error('List documents error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch documents' });
    }
  }
);

router.post('/hr/documents',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const userId = (req as TenantScopedRequest).userId;
      const documentData = { ...req.body, tenantId, id: crypto.randomUUID(), uploadedBy: userId };
      const document = await saasStorage.createDocument(documentData);
      res.json({ success: true, data: document });
    } catch (error) {
      console.error('Create document error:', error);
      res.status(500).json({ success: false, error: 'Failed to create document' });
    }
  }
);

// Workflows CRUD
router.get('/hr/workflows',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const workflows = await saasStorage.listWorkflows(tenantId);
      res.json({ success: true, data: workflows });
    } catch (error) {
      console.error('List workflows error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch workflows' });
    }
  }
);

router.post('/hr/workflows',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const userId = (req as TenantScopedRequest).userId;
      const workflowData = { ...req.body, tenantId, id: crypto.randomUUID(), createdBy: userId };
      const workflow = await saasStorage.createWorkflow(workflowData);
      res.json({ success: true, data: workflow });
    } catch (error) {
      console.error('Create workflow error:', error);
      res.status(500).json({ success: false, error: 'Failed to create workflow' });
    }
  }
);

// Applicants CRUD (Recruitment)
router.get('/hr/applicants',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const status = req.query.status as string | undefined;
      const applicants = await saasStorage.listApplicants(tenantId, status);
      res.json({ success: true, data: applicants });
    } catch (error) {
      console.error('List applicants error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch applicants' });
    }
  }
);

router.post('/hr/applicants',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const applicantData = { ...req.body, tenantId, id: crypto.randomUUID() };
      const applicant = await saasStorage.createApplicant(applicantData);
      res.json({ success: true, data: applicant });
    } catch (error) {
      console.error('Create applicant error:', error);
      res.status(500).json({ success: false, error: 'Failed to create applicant' });
    }
  }
);

router.patch('/hr/applicants/:id',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const applicantId = req.params.id;
      const applicant = await saasStorage.updateApplicant(tenantId, applicantId, req.body);
      res.json({ success: true, data: applicant });
    } catch (error) {
      console.error('Update applicant error:', error);
      res.status(500).json({ success: false, error: 'Failed to update applicant' });
    }
  }
);

// Training Programs CRUD
router.get('/hr/training',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const programs = await saasStorage.listTrainingPrograms(tenantId);
      res.json({ success: true, data: programs });
    } catch (error) {
      console.error('List training programs error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch training programs' });
    }
  }
);

router.post('/hr/training',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const programData = { ...req.body, tenantId, id: crypto.randomUUID() };
      const program = await saasStorage.createTrainingProgram(programData);
      res.json({ success: true, data: program });
    } catch (error) {
      console.error('Create training program error:', error);
      res.status(500).json({ success: false, error: 'Failed to create training program' });
    }
  }
);

// Attendance
router.get('/hr/attendance',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const date = req.query.date as string | undefined;
      const attendance = await saasStorage.listAttendance(tenantId, date);
      res.json({ success: true, data: attendance });
    } catch (error) {
      console.error('List attendance error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch attendance' });
    }
  }
);

router.post('/hr/attendance',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const attendanceData = req.body;
      const attendance = await saasStorage.recordAttendance(attendanceData);
      res.json({ success: true, data: attendance });
    } catch (error) {
      console.error('Record attendance error:', error);
      res.status(500).json({ success: false, error: 'Failed to record attendance' });
    }
  }
);

// Leave Requests
router.get('/hr/leave-requests',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const status = req.query.status as string | undefined;
      const leaveRequests = await saasStorage.listLeaveRequests(tenantId, status);
      res.json({ success: true, data: leaveRequests });
    } catch (error) {
      console.error('List leave requests error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch leave requests' });
    }
  }
);

router.patch('/hr/leave-requests/:id',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const requestId = parseInt(req.params.id);
      const result = await saasStorage.updateLeaveRequest(tenantId, requestId, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Update leave request error:', error);
      res.status(500).json({ success: false, error: 'Failed to update leave request' });
    }
  }
);

// Payroll
router.get('/hr/payroll',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const period = req.query.period as string | undefined;
      const payroll = await saasStorage.listPayroll(tenantId, period);
      res.json({ success: true, data: payroll });
    } catch (error) {
      console.error('List payroll error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch payroll' });
    }
  }
);

router.post('/hr/payroll/process',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const payrollData = { ...req.body, tenantId };
      const result = await saasStorage.processPayroll(payrollData);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Process payroll error:', error);
      res.status(500).json({ success: false, error: 'Failed to process payroll' });
    }
  }
);

// Performance Reviews
router.get('/hr/performance-reviews',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const reviews = await saasStorage.listPerformanceReviews(tenantId);
      res.json({ success: true, data: reviews });
    } catch (error) {
      console.error('List performance reviews error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch performance reviews' });
    }
  }
);

router.post('/hr/performance-reviews',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const reviewData = req.body;
      const review = await saasStorage.createPerformanceReview(reviewData);
      res.json({ success: true, data: review });
    } catch (error) {
      console.error('Create performance review error:', error);
      res.status(500).json({ success: false, error: 'Failed to create performance review' });
    }
  }
);

// ==== FIMS MODULE ENDPOINTS ====

// Vendors CRUD
router.get('/fims/vendors',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const vendors = await saasStorage.listVendors(tenantId);
      res.json({ success: true, data: vendors });
    } catch (error) {
      console.error('List vendors error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch vendors' });
    }
  }
);

router.post('/fims/vendors',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const vendorData = { ...req.body, tenantId, id: crypto.randomUUID() };
      const vendor = await saasStorage.createVendor(vendorData);
      res.json({ success: true, data: vendor });
    } catch (error) {
      console.error('Create vendor error:', error);
      res.status(500).json({ success: false, error: 'Failed to create vendor' });
    }
  }
);

// Purchase Orders CRUD
router.get('/fims/purchase-orders',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const status = req.query.status as string | undefined;
      const purchaseOrders = await saasStorage.listPurchaseOrders(tenantId, status);
      res.json({ success: true, data: purchaseOrders });
    } catch (error) {
      console.error('List purchase orders error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch purchase orders' });
    }
  }
);

router.post('/fims/purchase-orders',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const userId = (req as TenantScopedRequest).userId;
      const poData = { ...req.body, tenantId, id: crypto.randomUUID(), createdBy: userId };
      const purchaseOrder = await saasStorage.createPurchaseOrder(poData);
      res.json({ success: true, data: purchaseOrder });
    } catch (error) {
      console.error('Create purchase order error:', error);
      res.status(500).json({ success: false, error: 'Failed to create purchase order' });
    }
  }
);

router.patch('/fims/purchase-orders/:id',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const poId = req.params.id;
      const purchaseOrder = await saasStorage.updatePurchaseOrder(tenantId, poId, req.body);
      res.json({ success: true, data: purchaseOrder });
    } catch (error) {
      console.error('Update purchase order error:', error);
      res.status(500).json({ success: false, error: 'Failed to update purchase order' });
    }
  }
);

// Expenses CRUD
router.get('/fims/expenses',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const status = req.query.status as string | undefined;
      const category = req.query.category as string | undefined;
      const expenses = await saasStorage.listExpenses(tenantId, status, category);
      res.json({ success: true, data: expenses });
    } catch (error) {
      console.error('List expenses error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch expenses' });
    }
  }
);

router.post('/fims/expenses',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const userId = (req as TenantScopedRequest).userId;
      const expenseData = { ...req.body, tenantId, id: crypto.randomUUID(), createdBy: userId };
      const expense = await saasStorage.createExpense(expenseData);
      res.json({ success: true, data: expense });
    } catch (error) {
      console.error('Create expense error:', error);
      res.status(500).json({ success: false, error: 'Failed to create expense' });
    }
  }
);

router.patch('/fims/expenses/:id',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const expenseId = req.params.id;
      const expense = await saasStorage.updateExpense(tenantId, expenseId, req.body);
      res.json({ success: true, data: expense });
    } catch (error) {
      console.error('Update expense error:', error);
      res.status(500).json({ success: false, error: 'Failed to update expense' });
    }
  }
);

// Procurement Records CRUD
router.get('/fims/procurement-records',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const recordType = req.query.recordType as string | undefined;
      const status = req.query.status as string | undefined;
      const records = await saasStorage.listProcurementRecords(tenantId, recordType, status);
      res.json({ success: true, data: records });
    } catch (error) {
      console.error('List procurement records error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch procurement records' });
    }
  }
);

router.post('/fims/procurement-records',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const userId = (req as TenantScopedRequest).userId;
      const recordData = { ...req.body, tenantId, id: crypto.randomUUID(), createdBy: userId, createdAt: new Date().toISOString() };
      const record = await saasStorage.createProcurementRecord(recordData);
      res.json({ success: true, data: record });
    } catch (error) {
      console.error('Create procurement record error:', error);
      res.status(500).json({ success: false, error: 'Failed to create procurement record' });
    }
  }
);

router.patch('/fims/procurement-records/:id',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const recordId = req.params.id;
      const record = await saasStorage.updateProcurementRecord(tenantId, recordId, req.body);
      res.json({ success: true, data: record });
    } catch (error) {
      console.error('Update procurement record error:', error);
      res.status(500).json({ success: false, error: 'Failed to update procurement record' });
    }
  }
);

// Assets CRUD
router.get('/fims/assets',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const category = req.query.category as string | undefined;
      const status = req.query.status as string | undefined;
      const assets = await saasStorage.listAssets(tenantId, category, status);
      res.json({ success: true, data: assets });
    } catch (error) {
      console.error('List assets error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch assets' });
    }
  }
);

router.post('/fims/assets',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const assetData = { ...req.body, tenantId, id: crypto.randomUUID() };
      const asset = await saasStorage.createAsset(assetData);
      res.json({ success: true, data: asset });
    } catch (error) {
      console.error('Create asset error:', error);
      res.status(500).json({ success: false, error: 'Failed to create asset' });
    }
  }
);

router.patch('/fims/assets/:id',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const assetId = req.params.id;
      const asset = await saasStorage.updateAsset(tenantId, assetId, req.body);
      res.json({ success: true, data: asset });
    } catch (error) {
      console.error('Update asset error:', error);
      res.status(500).json({ success: false, error: 'Failed to update asset' });
    }
  }
);

// Asset Maintenance
router.post('/fims/assets/:id/maintenance',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const assetId = req.params.id;
      const maintenanceData = { ...req.body, tenantId, id: crypto.randomUUID(), assetId };
      const maintenance = await saasStorage.createAssetMaintenance(maintenanceData);
      res.json({ success: true, data: maintenance });
    } catch (error) {
      console.error('Create asset maintenance error:', error);
      res.status(500).json({ success: false, error: 'Failed to create asset maintenance' });
    }
  }
);

// Bank Accounts CRUD (Treasury)
router.get('/fims/bank-accounts',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const bankAccounts = await saasStorage.listBankAccounts(tenantId);
      res.json({ success: true, data: bankAccounts });
    } catch (error) {
      console.error('List bank accounts error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch bank accounts' });
    }
  }
);

router.post('/fims/bank-accounts',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const accountData = { ...req.body, tenantId, id: crypto.randomUUID() };
      const bankAccount = await saasStorage.createBankAccount(accountData);
      res.json({ success: true, data: bankAccount });
    } catch (error) {
      console.error('Create bank account error:', error);
      res.status(500).json({ success: false, error: 'Failed to create bank account' });
    }
  }
);

// Bank Transactions
router.get('/fims/bank-accounts/:id/transactions',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const accountId = req.params.id;
      const transactions = await saasStorage.listBankTransactions(tenantId, accountId);
      res.json({ success: true, data: transactions });
    } catch (error) {
      console.error('List bank transactions error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch bank transactions' });
    }
  }
);

router.post('/fims/bank-accounts/:id/transactions',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const accountId = req.params.id;
      const transactionData = { ...req.body, tenantId, id: crypto.randomUUID(), bankAccountId: accountId };
      const transaction = await saasStorage.createBankTransaction(transactionData);
      res.json({ success: true, data: transaction });
    } catch (error) {
      console.error('Create bank transaction error:', error);
      res.status(500).json({ success: false, error: 'Failed to create bank transaction' });
    }
  }
);

// General Ledger Entries
router.get('/fims/general-ledger',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const entries = await saasStorage.listGeneralLedgerEntries(tenantId);
      res.json({ success: true, data: entries });
    } catch (error) {
      console.error('List GL entries error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch GL entries' });
    }
  }
);

router.post('/fims/general-ledger',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const userId = (req as TenantScopedRequest).userId;
      const entryData = { ...req.body, tenantId, id: crypto.randomUUID(), createdBy: userId };
      const entry = await saasStorage.createGeneralLedgerEntry(entryData);
      res.json({ success: true, data: entry });
    } catch (error) {
      console.error('Create GL entry error:', error);
      res.status(500).json({ success: false, error: 'Failed to create GL entry' });
    }
  }
);

// Accounts Payable
router.get('/fims/accounts-payable',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const status = req.query.status as string | undefined;
      const payables = await saasStorage.listAccountsPayable(tenantId, status);
      res.json({ success: true, data: payables });
    } catch (error) {
      console.error('List accounts payable error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch accounts payable' });
    }
  }
);

router.post('/fims/accounts-payable',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const userId = (req as TenantScopedRequest).userId;
      const payableData = { ...req.body, tenantId, id: crypto.randomUUID(), createdBy: userId };
      const payable = await saasStorage.createAccountsPayable(payableData);
      res.json({ success: true, data: payable });
    } catch (error) {
      console.error('Create accounts payable error:', error);
      res.status(500).json({ success: false, error: 'Failed to create accounts payable' });
    }
  }
);

// Accounts Receivable
router.get('/fims/accounts-receivable',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const status = req.query.status as string | undefined;
      const receivables = await saasStorage.listAccountsReceivable(tenantId, status);
      res.json({ success: true, data: receivables });
    } catch (error) {
      console.error('List accounts receivable error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch accounts receivable' });
    }
  }
);

router.post('/fims/accounts-receivable',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const userId = (req as TenantScopedRequest).userId;
      const receivableData = { ...req.body, tenantId, id: crypto.randomUUID(), createdBy: userId };
      const receivable = await saasStorage.createAccountsReceivable(receivableData);
      res.json({ success: true, data: receivable });
    } catch (error) {
      console.error('Create accounts receivable error:', error);
      res.status(500).json({ success: false, error: 'Failed to create accounts receivable' });
    }
  }
);

// Budgets CRUD
router.get('/fims/budgets',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const budgets = await saasStorage.listBudgets(tenantId, year);
      res.json({ success: true, data: budgets });
    } catch (error) {
      console.error('List budgets error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch budgets' });
    }
  }
);

router.post('/fims/budgets',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const userId = (req as TenantScopedRequest).userId;
      const budgetData = { ...req.body, tenantId, id: crypto.randomUUID(), createdBy: userId };
      const budget = await saasStorage.createBudget(budgetData);
      res.json({ success: true, data: budget });
    } catch (error) {
      console.error('Create budget error:', error);
      res.status(500).json({ success: false, error: 'Failed to create budget' });
    }
  }
);

// Cash Flow
router.get('/fims/cash-flow',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const category = req.query.category as string | undefined;
      const entries = await saasStorage.listCashFlowEntries(tenantId, category);
      res.json({ success: true, data: entries });
    } catch (error) {
      console.error('List cash flow entries error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch cash flow entries' });
    }
  }
);

router.post('/fims/cash-flow',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const userId = (req as TenantScopedRequest).userId;
      const entryData = { ...req.body, tenantId, id: crypto.randomUUID(), createdBy: userId };
      const entry = await saasStorage.createCashFlowEntry(entryData);
      res.json({ success: true, data: entry });
    } catch (error) {
      console.error('Create cash flow entry error:', error);
      res.status(500).json({ success: false, error: 'Failed to create cash flow entry' });
    }
  }
);

// Audit Logs
router.get('/fims/audit-logs',
  authenticateToken,
  enforceStrictTenantIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantId = (req as TenantScopedRequest).tenantId;
      const resourceType = req.query.resourceType as string | undefined;
      const logs = await saasStorage.listAuditLogs(tenantId, resourceType);
      res.json({ success: true, data: logs });
    } catch (error) {
      console.error('List audit logs error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
    }
  }
);

export default router;