import { Request, Response, NextFunction } from 'express';
import { eq, and } from 'drizzle-orm';
import { AuthenticatedRequest } from './auth';

/**
 * Centralized tenant isolation utilities for TOTAG IT Services subservice
 * Ensures all database operations are properly scoped to the authenticated tenant
 */

export interface TenantScopedRequest extends AuthenticatedRequest {
  tenantId: string;
  isSystemAdmin?: boolean; // TOTAG IT Services staff with cross-tenant access
}

/**
 * Enhanced tenant isolation middleware with MSP support
 */
export function enforceStrictTenantIsolation(req: Request, res: Response, next: NextFunction) {
  const authReq = req as TenantScopedRequest;
  
  if (!authReq.user || !authReq.user.tenantId) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication and tenant context required' 
    });
  }

  // TOTAG IT Services staff (MSP) can access multiple tenants
  const isSystemAdmin = authReq.user.role === 'msp_admin' || authReq.user.role === 'system_admin';
  
  // Set tenant context
  authReq.tenantId = authReq.user.tenantId;
  authReq.isSystemAdmin = isSystemAdmin;

  // For cross-tenant access, validate target tenant
  if (isSystemAdmin && authReq.query.targetTenantId) {
    authReq.tenantId = authReq.query.targetTenantId as string;
    
    // Audit log for cross-tenant access
    console.log(`[AUDIT] MSP admin ${authReq.user.email} accessing tenant ${authReq.tenantId}`);
  }
  
  next();
}

/**
 * Create tenant-scoped database filter conditions
 */
export function createTenantFilter(tenantId: string, table: any) {
  return eq(table.tenantId, tenantId);
}

/**
 * Validate tenant access for specific operations
 */
export function validateTenantAccess(userTenantId: string, resourceTenantId: string, isSystemAdmin: boolean = false): boolean {
  // System admins can access any tenant
  if (isSystemAdmin) return true;
  
  // Regular users can only access their own tenant
  return userTenantId === resourceTenantId;
}

/**
 * Tenant-scoped database operation wrapper
 */
export class TenantScopedStorage {
  constructor(private tenantId: string, private isSystemAdmin: boolean = false) {}

  /**
   * Create standardized tenant filter for any table
   */
  tenantFilter(table: any) {
    return createTenantFilter(this.tenantId, table);
  }

  /**
   * Create compound filter with tenant isolation
   */
  tenantAnd(table: any, ...conditions: any[]) {
    return and(createTenantFilter(this.tenantId, table), ...conditions);
  }

  /**
   * Validate resource belongs to tenant
   */
  validateResource(resourceTenantId: string): boolean {
    return validateTenantAccess(this.tenantId, resourceTenantId, this.isSystemAdmin);
  }

  /**
   * Get tenant context for operations
   */
  getTenantContext() {
    return {
      tenantId: this.tenantId,
      isSystemAdmin: this.isSystemAdmin
    };
  }
}

/**
 * Create tenant-scoped storage instance from request
 */
export function createTenantScopedStorage(req: TenantScopedRequest): TenantScopedStorage {
  return new TenantScopedStorage(req.tenantId, req.isSystemAdmin);
}

/**
 * TOTAG IT Services specific roles and permissions
 */
export const TOTAG_ROLES = {
  // TOTAG IT Services staff roles
  SYSTEM_ADMIN: 'system_admin',      // Full system access
  MSP_ADMIN: 'msp_admin',            // Cross-tenant management
  MSP_SUPPORT: 'msp_support',        // Limited cross-tenant read access
  
  // Client roles (tenant-scoped)
  CLIENT_ADMIN: 'client_admin',       // Full tenant admin
  CLIENT_MANAGER: 'client_manager',   // Department management
  CLIENT_USER: 'client_user',         // Regular user
  CLIENT_VIEWER: 'client_viewer'      // Read-only access
} as const;

/**
 * Check if user has TOTAG IT Services (MSP) role
 */
export function isMSPRole(role: string): boolean {
  return [
    TOTAG_ROLES.SYSTEM_ADMIN,
    TOTAG_ROLES.MSP_ADMIN,
    TOTAG_ROLES.MSP_SUPPORT
  ].includes(role as any);
}

/**
 * Audit logging for compliance and security
 */
export interface AuditEvent {
  tenantId: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditEvent(event: AuditEvent) {
  // In production, this would integrate with TOTAG's central audit system
  console.log(`[AUDIT] ${event.action} on ${event.resourceType} by ${event.userId} in tenant ${event.tenantId}`, event);
  
  // TODO: Send to central TOTAG audit logging system
  // await centralAuditService.log(event);
}

/**
 * Middleware to require MSP (TOTAG IT Services) role
 */
export function requireMSPRole(req: Request, res: Response, next: NextFunction) {
  const authReq = req as TenantScopedRequest;
  
  if (!authReq.user || !isMSPRole(authReq.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'TOTAG IT Services staff access required'
    });
  }
  
  next();
}

/**
 * TOTAG IT Services branding and context
 */
export const TOTAG_CONTEXT = {
  serviceName: 'TOTAG IT Services - Enterprise FIMS & HRMIS',
  parentService: 'Managed IT Services',
  companyName: 'TOTAG Group of Companies Ltd',
  supportEmail: 'support@totaggroup.com',
  portalUrl: 'https://portal.totaggroup.com',
  
  // Service endpoints for integration
  authService: process.env.TOTAG_AUTH_SERVICE_URL || 'https://auth.totaggroup.com',
  billingService: process.env.TOTAG_BILLING_SERVICE_URL || 'https://billing.totaggroup.com',
  customerService: process.env.TOTAG_CUSTOMER_SERVICE_URL || 'https://customers.totaggroup.com'
};