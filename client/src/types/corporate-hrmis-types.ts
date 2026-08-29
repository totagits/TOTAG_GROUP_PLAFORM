/**
 * TOTAG GROUP & CRS CONSULTANCY MULTI-ENTITY HRMIS DATA SCHEMAS
 */

export type SubsidiaryId = 
  | "totag_hq"
  | "totag_farm"
  | "toceps_catering"
  | "totag_cargo"
  | "totag_petroleum"
  | "totag_solar"
  | "totag_construction"
  | "totag_merchandise"
  | "totag_stationery"
  | "totag_it_saas"
  | "crs_consultancy";

export interface SubsidiaryEntity {
  id: SubsidiaryId;
  name: string;
  shortCode: string;
  sector: string;
  headquarters: string;
  headcount: number;
  monthlyPayrollUsd: number;
  nasscorpRegistrationNo: string;
  lraTaxIdNo: string;
  primaryColor: string;
  iconName: string;
}

export type EmploymentLevel = 
  | "Corporate Executive"
  | "Corporate Shared Service"
  | "Subsidiary Management"
  | "Subsidiary Operational"
  | "Field Outgrower / Contractor";

export type SecurityRoleTier = 
  | "Tier 1: Subsidiary Staff (Self-Service)"
  | "Tier 2: Subsidiary Department Head"
  | "Tier 3: Subsidiary Managing Director / GM"
  | "Tier 4: Corporate Functional Specialist"
  | "Tier 5: Group Executive Board (CEO / Board)";

export interface DualScopeRole {
  primaryRole: string;
  roleTier: SecurityRoleTier;
  employerSubsidiaryId: SubsidiaryId;
  isCorporateHQ: boolean;
  corporateFunctionalDomain?: "Payroll & Treasury" | "Safety & Compliance" | "Recruitment & Onboarding" | "Audit & Governance" | "All";
  delegatedSubsidiaries?: SubsidiaryId[];
}

export interface CorporateDelegationGrant {
  id: string;
  granterName: string;
  granterRole: string;
  granteeName: string;
  targetSubsidiaryId: SubsidiaryId;
  targetModule: "Payroll" | "Attendance & Roster" | "Appraisals" | "Compliance & Safety" | "All";
  purpose: string;
  grantedAt: string;
  expiresAt: string;
  status: "Active" | "Expired" | "Revoked";
}

export interface LiberianPayrollRecord {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employerSubsidiaryId: SubsidiaryId;
  grossSalaryUsd: number;
  grossSalaryLrd: number;
  nasscorpEmployeeContributionUsd: number; // 3%
  nasscorpEmployerContributionUsd: number; // 4.75%
  lraWithholdingTaxUsd: number;
  medicalDeductionsUsd: number;
  netPayUsd: number;
  netPayLrd: number;
  payoutMethod: "Orange Money" | "Lonestar MTN MoMo" | "Direct Bank (Ecobank)" | "UBA Liberia";
  mobileWalletNumber: string;
  disbursementStatus: "Pending Approval" | "Audited" | "Disbursed" | "Reconciled";
  disbursementTxHash?: string;
}

export interface BiometricAttendancePunch {
  id: string;
  employeeId: string;
  employeeName: string;
  employerSubsidiaryId: SubsidiaryId;
  timestamp: string;
  type: "Clock In" | "Clock Out" | "Field Break" | "Shift Handover";
  method: "Web 1-Tap" | "Mobile Geofence GPS" | "Biometric Fingerprint" | "Facial AI Scan";
  gpsLatitude: string;
  gpsLongitude: string;
  gpsAccuracyMeters: number;
  geofenceMatch: boolean;
  locationName: string;
  shiftType: "Standard Day" | "Night Watch" | "Vessel Discharge Surge" | "Weekend Overtime";
  isOfflineSynced: boolean;
}
