import os

# Update types in client/src/types/corporate-hrmis-types.ts
types_file = "client/src/types/corporate-hrmis-types.ts"
with open(types_file, "r", encoding="utf-8") as f:
    types_content = f.read()

crs_types = """
export interface CRSTemporaryWorker {
  id: string;
  badgeCode: string;
  fullName: string;
  phone: string;
  nationalId: string;
  role: "HHR Registration Agent" | "ITN Distribution Lead" | "Field Supervisor" | "District Coordinator" | "Logistics & Site-Readiness" | "QA / Data Monitor" | "Community Mobilizer";
  county: string;
  district: "Commonwealth" | "Gola Konneh" | "Garwula" | "Porkpah" | "Tewor" | "Montserrado Urban" | "Margibi Rural";
  healthFacilityCatchment: string;
  contractWindowDays: number; // 10-14 days
  contractStartDate: string;
  contractEndDate: string;
  dailyRateUsd: number;
  totalContractValueUsd: number;
  momoCarrier: "Orange Money" | "Lonestar MTN MoMo";
  momoWalletNumber: string;
  momoKycVerified: boolean;
  byodPhoneModel: string;
  byodPhoneImei: string;
  byodConsentSigned: boolean;
  pseaCodeOfConductSigned: boolean;
  dailyHhrTarget: number; // e.g. 25 households/agent/day
  actualHhrCompleted: number;
  dailyItnTarget: number; // e.g. 50 nets/agent/day
  actualItnDistributed: number;
  performanceRatio: number; // %
  materialsReturnedStatus: "Pending Campaign Completion" | "All Returned & Reconciled" | "Discrepancy / Deducted";
  disbursementStatus: "Daily Staged" | "50% Advance Paid" | "Final Tranche Released" | "Disbursed";
}
"""

if "CRSTemporaryWorker" not in types_content:
    with open(types_file, "a", encoding="utf-8") as f:
        f.write(crs_types)

print("Updated corporate-hrmis-types.ts with CRS Campaign Types")
