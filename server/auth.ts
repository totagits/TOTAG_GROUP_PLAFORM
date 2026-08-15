import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { SaasUser, Tenant } from '@shared/schema';

const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'your-secret-key-here') {
    console.error('CRITICAL: JWT_SECRET environment variable is not set or using default value!');
    console.error('Please set JWT_SECRET to a secure random string for production use.');
    // Allow default only in development
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production environment');
    }
    return 'dev-secret-key-change-in-production';
  }
  return secret;
})();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthenticatedRequest extends Request {
  user?: SaasUser;
  tenant?: Tenant;
}

export interface JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  permissions: string[];
  isTenantAdmin: boolean;
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token with user and tenant info
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'totag-it-services',
    audience: 'totag-enterprise-clients'
  });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'totag-it-services',
      audience: 'totag-enterprise-clients'
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

/**
 * Middleware to authenticate requests with JWT
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }

  // Add user info to request object
  req.user = {
    id: payload.userId,
    tenantId: payload.tenantId,
    email: payload.email,
    role: payload.role,
    permissions: payload.permissions,
    isTenantAdmin: payload.isTenantAdmin
  } as SaasUser;

  next();
}

/**
 * Middleware to check if user has required permission
 */
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    // Tenant admins have all permissions
    if (req.user.isTenantAdmin) {
      return next();
    }

    // Check specific permission
    if (!req.user.permissions?.includes(permission)) {
      return res.status(403).json({ 
        success: false, 
        error: `Permission '${permission}' required` 
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: `Role '${role}' required` 
      });
    }

    next();
  };
}

/**
 * Middleware to enforce tenant isolation
 */
export function enforceTenantIsolation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || !req.user.tenantId) {
    return res.status(401).json({ 
      success: false, 
      error: 'Tenant context required' 
    });
  }

  // Add tenant filter to query params for data isolation
  req.query.tenantId = req.user.tenantId;
  
  next();
}

/**
 * Generate secure random password reset token
 */
export function generateResetToken(): string {
  return jwt.sign(
    { type: 'password_reset', timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

/**
 * Verify password reset token
 */
export function verifyResetToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.type === 'password_reset';
  } catch (error) {
    return false;
  }
}

/**
 * Generate email verification token
 */
export function generateEmailVerificationToken(email: string, tenantId: string): string {
  return jwt.sign(
    { email, tenantId, type: 'email_verification' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Verify email verification token
 */
export function verifyEmailVerificationToken(token: string): { email: string; tenantId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type === 'email_verification') {
      return { email: decoded.email, tenantId: decoded.tenantId };
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Module permissions for FIMS and HRMIS
 */
export const MODULE_PERMISSIONS = {
  // HRMIS Permissions
  'hr_core_read': 'View HR core data',
  'hr_core_write': 'Manage HR core data',
  'hr_recruitment_read': 'View recruitment data',
  'hr_recruitment_write': 'Manage recruitment',
  'hr_talent_read': 'View talent management',
  'hr_talent_write': 'Manage talent',
  'hr_compensation_read': 'View compensation data',
  'hr_compensation_write': 'Manage compensation',
  'hr_self_service': 'Employee self-service access',
  'hr_analytics_read': 'View HR analytics',
  
  // FIMS Permissions
  'fims_gl_read': 'View general ledger',
  'fims_gl_write': 'Manage general ledger',
  'fims_ap_read': 'View accounts payable',
  'fims_ap_write': 'Manage accounts payable',
  'fims_ar_read': 'View accounts receivable',
  'fims_ar_write': 'Manage accounts receivable',
  'fims_treasury_read': 'View treasury data',
  'fims_treasury_write': 'Manage treasury',
  'fims_budget_read': 'View budgets',
  'fims_budget_write': 'Manage budgets',
  'fims_reporting_read': 'View financial reports',
  
  // System Permissions
  'tenant_admin': 'Full tenant administration',
  'user_management': 'Manage users and permissions',
  'billing_read': 'View billing information',
  'billing_write': 'Manage billing and subscriptions'
} as const;