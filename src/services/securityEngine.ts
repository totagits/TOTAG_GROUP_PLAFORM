import type {
  UserAssignment,
  DataSensitivityLevel,
  PermissionAction,
  FarmerProfile,
  Parcel
} from '../types';

// ==========================================
// 1. DATA SENSITIVITY & FIELD MASKING ENGINE
// ==========================================

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return '***';
  const clean = phone.trim();
  if (clean.startsWith('+231')) {
    return `+231 ${clean.slice(4, 6)}***${clean.slice(-3)}`;
  }
  return `${clean.slice(0, 3)}****${clean.slice(-3)}`;
}

export function maskNationalID(nin: string): string {
  if (!nin || nin.length < 4) return '********';
  const clean = nin.trim();
  return `********${clean.slice(-4)}`;
}

export function maskBankAccount(acc: string): string {
  if (!acc || acc.length < 4) return '****';
  const clean = acc.trim();
  return `****${clean.slice(-4)}`;
}

export function maskMobileMoneyNumber(num: string): string {
  if (!num || num.length < 5) return '077****';
  const clean = num.trim();
  return `${clean.slice(0, 3)}****${clean.slice(-3)}`;
}

export function isSensitivityAllowed(
  userLevel: DataSensitivityLevel,
  fieldLevel: DataSensitivityLevel
): boolean {
  const levels: Record<DataSensitivityLevel, number> = {
    PUBLIC: 1,
    INTERNAL: 2,
    CONFIDENTIAL: 3,
    HIGHLY_RESTRICTED: 4,
    AUDIT_RESTRICTED: 5
  };
  return levels[userLevel] >= levels[fieldLevel];
}

// ==========================================
// 2. SEPARATION OF DUTIES (SoD) RULES ENGINE
// ==========================================

export interface SoDCheckResult {
  allowed: boolean;
  ruleName: string;
  reason?: string;
}

export const SOD_RULES = {
  RECORD_CREATION_VS_VERIFICATION: 'RECORD_CREATION_VS_VERIFICATION',
  ELIGIBILITY_REC_VS_APPROVAL: 'ELIGIBILITY_REC_VS_APPROVAL',
  PAYMENT_PREP_VS_APPROVAL: 'PAYMENT_PREP_VS_APPROVAL',
  PAYMENT_APPROVAL_VS_RECONCILIATION: 'PAYMENT_APPROVAL_VS_RECONCILIATION',
  VOUCHER_GEN_VS_REDEMPTION: 'VOUCHER_GEN_VS_REDEMPTION',
  STOCK_RECEIPT_VS_RECONCILIATION: 'STOCK_RECEIPT_VS_RECONCILIATION',
  ROLE_CONFIG_VS_SELF_AUDIT: 'ROLE_CONFIG_VS_SELF_AUDIT',
  SYS_ADMIN_VS_AUDIT_MUTATION: 'SYS_ADMIN_VS_AUDIT_MUTATION'
};

export function evaluateSoDRule(
  action: PermissionAction,
  actorUserId: string,
  recordCreatorUserId?: string,
  recordRecommenderUserId?: string,
  recordApproverUserId?: string
): SoDCheckResult {
  // Rule 1: Creating a record separates from final verification/approval of that SAME record
  if (
    (action === 'VERIFY' || action === 'APPROVE') &&
    recordCreatorUserId &&
    actorUserId === recordCreatorUserId
  ) {
    return {
      allowed: false,
      ruleName: SOD_RULES.RECORD_CREATION_VS_VERIFICATION,
      reason: 'Separation of Duties Violation: You cannot approve or verify a record created by yourself.'
    };
  }

  // Rule 2: Recommender separates from final approval
  if (
    action === 'APPROVE' &&
    recordRecommenderUserId &&
    actorUserId === recordRecommenderUserId
  ) {
    return {
      allowed: false,
      ruleName: SOD_RULES.ELIGIBILITY_REC_VS_APPROVAL,
      reason: 'Separation of Duties Violation: You cannot issue final approval for a recommendation made by yourself.'
    };
  }

  // Rule 3: Payment Approver separates from Reconciliation
  if (
    action === 'RECONCILE' &&
    recordApproverUserId &&
    actorUserId === recordApproverUserId
  ) {
    return {
      allowed: false,
      ruleName: SOD_RULES.PAYMENT_APPROVAL_VS_RECONCILIATION,
      reason: 'Separation of Duties Violation: Approver cannot perform financial reconciliation on the same batch.'
    };
  }

  return { allowed: true, ruleName: 'PASSED' };
}

// ==========================================
// 3. ABAC SCOPE FILTERING (ORGANIZATION, PROGRAM, COUNTY, DISTRICT)
// ==========================================

export function filterFarmersByAssignment(
  farmers: FarmerProfile[],
  assignment: UserAssignment
): FarmerProfile[] {
  return farmers.filter((f) => {
    // Geographic County check
    if (
      assignment.county !== 'All Counties (National)' &&
      assignment.county !== f.county
    ) {
      return false;
    }
    // Geographic District check
    if (
      assignment.district &&
      assignment.district !== 'All Districts' &&
      assignment.district !== f.district
    ) {
      return false;
    }
    // Program match check if assigned to specific program
    if (
      assignment.programId &&
      assignment.programId !== 'ALL_PROGRAMS' &&
      assignment.programId !== 'PRG-2026-RICE' &&
      assignment.programId !== 'PRG-2026-CASSAVA'
    ) {
      return false;
    }
    return true;
  });
}

export function filterParcelsByAssignment(
  parcels: Parcel[],
  assignment: UserAssignment
): Parcel[] {
  return parcels.filter((p) => {
    if (
      assignment.county !== 'All Counties (National)' &&
      assignment.county !== p.county
    ) {
      return false;
    }
    if (
      assignment.district &&
      assignment.district !== 'All Districts' &&
      assignment.district !== p.district
    ) {
      return false;
    }
    return true;
  });
}
