import { SubsidiaryId, DualScopeRole, CorporateDelegationGrant } from "@/types/corporate-hrmis-types";

export const TOTAG_SUBSIDIARIES = [
  {
    id: "totag_hq" as SubsidiaryId,
    name: "TOTAG Corporate HQ & Group Holdings",
    shortCode: "TOT-HQ",
    sector: "Group Governance & Shared Services",
    headquarters: "Monrovia HQ, 11th Street Sinkor",
    headcount: 14,
    monthlyPayrollUsd: 38500,
    nasscorpRegistrationNo: "NASS-HQ-00101",
    lraTaxIdNo: "LRA-TIN-88901",
    primaryColor: "#0f172a",
    iconName: "Building2"
  },
  {
    id: "totag_farm" as SubsidiaryId,
    name: "TOTAG FARM & Agro-Industrial Ltd",
    shortCode: "TOT-FARM",
    sector: "Commercial Agriculture & Outgrowers",
    headquarters: "Voinjama & Foya Agro-Hub, Lofa County",
    headcount: 48,
    monthlyPayrollUsd: 28400,
    nasscorpRegistrationNo: "NASS-FARM-00204",
    lraTaxIdNo: "LRA-TIN-88902",
    primaryColor: "#10b981",
    iconName: "Sprout"
  },
  {
    id: "toceps_catering" as SubsidiaryId,
    name: "TOCEPS Catering & Culinary Services",
    shortCode: "TOCEPS",
    sector: "Industrial & Corporate Catering",
    headquarters: "Sinkor Central Kitchen, Monrovia",
    headcount: 32,
    monthlyPayrollUsd: 19800,
    nasscorpRegistrationNo: "NASS-CAT-00305",
    lraTaxIdNo: "LRA-TIN-88903",
    primaryColor: "#f59e0b",
    iconName: "Utensils"
  },
  {
    id: "totag_cargo" as SubsidiaryId,
    name: "TOTAG Cargo Handling & Stevedoring",
    shortCode: "TOT-CARGO",
    sector: "Port Stevedoring & Customs Brokerage",
    headquarters: "Freeport of Monrovia Yard",
    headcount: 56,
    monthlyPayrollUsd: 42300,
    nasscorpRegistrationNo: "NASS-CRG-00406",
    lraTaxIdNo: "LRA-TIN-88904",
    primaryColor: "#0284c7",
    iconName: "Ship"
  },
  {
    id: "totag_petroleum" as SubsidiaryId,
    name: "TOTAG Petroleum & Energy Logistics",
    shortCode: "TOT-PETRO",
    sector: "Bunkering, AGO / PMS Terminal Operations",
    headquarters: "Bushrod Island Petroleum Depot",
    headcount: 24,
    monthlyPayrollUsd: 31200,
    nasscorpRegistrationNo: "NASS-PET-00507",
    lraTaxIdNo: "LRA-TIN-88905",
    primaryColor: "#dc2626",
    iconName: "Fuel"
  },
  {
    id: "totag_solar" as SubsidiaryId,
    name: "TOTAG Solar Smart Energy Solutions",
    shortCode: "TOT-SOLAR",
    sector: "Mini-Grids, C&I Solar EPC & Storage",
    headquarters: "Congo Town Energy Hub",
    headcount: 19,
    monthlyPayrollUsd: 22600,
    nasscorpRegistrationNo: "NASS-SOL-00608",
    lraTaxIdNo: "LRA-TIN-88906",
    primaryColor: "#eab308",
    iconName: "Sun"
  },
  {
    id: "totag_construction" as SubsidiaryId,
    name: "TOTAG General Construction & Civil Works",
    shortCode: "TOT-CONST",
    sector: "Roads, Bridges & Commercial Structures",
    headquarters: "Paynesville Heavy Plant Yard",
    headcount: 42,
    monthlyPayrollUsd: 36700,
    nasscorpRegistrationNo: "NASS-CON-00709",
    lraTaxIdNo: "LRA-TIN-88907",
    primaryColor: "#ea580c",
    iconName: "HardHat"
  },
  {
    id: "totag_merchandise" as SubsidiaryId,
    name: "TOTAG General Merchandise (TGM)",
    shortCode: "TGM",
    sector: "Wholesale & FMCG Distribution",
    headquarters: "Waterside Commercial District",
    headcount: 28,
    monthlyPayrollUsd: 18400,
    nasscorpRegistrationNo: "NASS-TGM-00810",
    lraTaxIdNo: "LRA-TIN-88908",
    primaryColor: "#8b5cf6",
    iconName: "ShoppingBag"
  },
  {
    id: "totag_stationery" as SubsidiaryId,
    name: "TOTAG Stationery Supplies & Print",
    shortCode: "TOT-STAT",
    sector: "Corporate Printing & School Supplies",
    headquarters: "Benson Street Retail & Press Hub",
    headcount: 15,
    monthlyPayrollUsd: 11200,
    nasscorpRegistrationNo: "NASS-STA-00911",
    lraTaxIdNo: "LRA-TIN-88909",
    primaryColor: "#06b6d4",
    iconName: "BookOpen"
  },
  {
    id: "totag_it_saas" as SubsidiaryId,
    name: "TOTAG Managed IT, Cloud & SaaS",
    shortCode: "TOT-TECH",
    sector: "Enterprise Software & Cyber Defense",
    headquarters: "Technology Park, Sinkor",
    headcount: 18,
    monthlyPayrollUsd: 26500,
    nasscorpRegistrationNo: "NASS-ITC-01012",
    lraTaxIdNo: "LRA-TIN-88910",
    primaryColor: "#6366f1",
    iconName: "Cpu"
  },
  {
    id: "crs_consultancy" as SubsidiaryId,
    name: "CRS Consultancy Ltd (Licensed Tenant)",
    shortCode: "CRS-SAAS",
    sector: "Management Consulting & HR Advisory",
    headquarters: "CRS Regional Office, Monrovia",
    headcount: 22,
    monthlyPayrollUsd: 24800,
    nasscorpRegistrationNo: "NASS-CRS-01113",
    lraTaxIdNo: "LRA-TIN-88911",
    primaryColor: "#14b8a6",
    iconName: "Briefcase"
  }
];

/**
 * Checks whether an active user has permission to access or override a target subsidiary module
 */
export function checkCorporateAccess(
  userRole: DualScopeRole,
  targetSubsidiaryId: SubsidiaryId,
  targetModule: "Payroll" | "Attendance & Roster" | "Appraisals" | "Compliance & Safety" | "All",
  activeDelegations: CorporateDelegationGrant[] = []
): { hasAccess: boolean; accessLevel: "Full HQ Override" | "Functional Oversight" | "Subsidiary Native" | "Delegated Guest" | "Denied"; reason: string } {
  // 1. Group Executive Board (Tier 5) has universal oversight
  if (userRole.roleTier === "Tier 5: Group Executive Board (CEO / Board)") {
    return {
      hasAccess: true,
      accessLevel: "Full HQ Override",
      reason: "Executive Board holds universal governance across all group entities."
    };
  }

  // 2. Subsidiary Native Access: Employee is accessing their own legal employer
  if (userRole.employerSubsidiaryId === targetSubsidiaryId) {
    return {
      hasAccess: true,
      accessLevel: "Subsidiary Native",
      reason: "Native employee authorized for home subsidiary entity."
    };
  }

  // 3. Corporate Functional Specialist (Tier 4)
  if (userRole.isCorporateHQ && userRole.roleTier === "Tier 4: Corporate Functional Specialist") {
    if (userRole.corporateFunctionalDomain === "All") {
      return { hasAccess: true, accessLevel: "Functional Oversight", reason: "Corporate functional domain clearance active." };
    }
    if (userRole.corporateFunctionalDomain === "Payroll & Treasury" && targetModule === "Payroll") {
      return { hasAccess: true, accessLevel: "Functional Oversight", reason: "Corporate Payroll Director cross-entity clearance." };
    }
    if (userRole.corporateFunctionalDomain === "Safety & Compliance" && targetModule === "Compliance & Safety") {
      return { hasAccess: true, accessLevel: "Functional Oversight", reason: "Corporate Safety Officer cross-entity inspection clearance." };
    }
  }

  // 4. Temporary Delegated Grants
  const delegation = activeDelegations.find(
    d => d.status === "Active" && d.targetSubsidiaryId === targetSubsidiaryId && (d.targetModule === "All" || d.targetModule === targetModule)
  );

  if (delegation) {
    return {
      hasAccess: true,
      accessLevel: "Delegated Guest",
      reason: `Authorized under Active Corporate Delegation #${delegation.id} (${delegation.purpose}).`
    };
  }

  return {
    hasAccess: false,
    accessLevel: "Denied",
    reason: `Access restricted. User employer is [${userRole.employerSubsidiaryId}] without active corporate clearance for [${targetSubsidiaryId}].`
  };
}

/**
 * Calculates Liberian Statutory Tax (LRA Personal Income Tax Brackets) & NASSCORP
 */
export function calculateLiberianStatutoryPayroll(grossSalaryUsd: number, exchangeRateLrd: number = 195) {
  // NASSCORP Employee = 3%
  const nasscorpEmployeeUsd = grossSalaryUsd * 0.03;
  // NASSCORP Employer = 4.75%
  const nasscorpEmployerUsd = grossSalaryUsd * 0.0475;

  // Taxable Income = Gross - NASSCORP Employee
  const taxableIncomeUsd = Math.max(0, grossSalaryUsd - nasscorpEmployeeUsd);

  // Progressive Liberian LRA PIT Brackets (Annualized equivalent in USD)
  let lraTaxUsd = 0;
  if (taxableIncomeUsd <= 350) {
    lraTaxUsd = taxableIncomeUsd * 0.02;
  } else if (taxableIncomeUsd <= 1200) {
    lraTaxUsd = (350 * 0.02) + ((taxableIncomeUsd - 350) * 0.08);
  } else if (taxableIncomeUsd <= 3000) {
    lraTaxUsd = (350 * 0.02) + (850 * 0.08) + ((taxableIncomeUsd - 1200) * 0.15);
  } else {
    lraTaxUsd = (350 * 0.02) + (850 * 0.08) + (1800 * 0.15) + ((taxableIncomeUsd - 3000) * 0.25);
  }

  const medicalDeductionsUsd = 25; // Standard group health plan
  const netPayUsd = Math.max(0, grossSalaryUsd - nasscorpEmployeeUsd - lraTaxUsd - medicalDeductionsUsd);
  const netPayLrd = netPayUsd * exchangeRateLrd;

  return {
    grossSalaryUsd,
    nasscorpEmployeeUsd: Math.round(nasscorpEmployeeUsd * 100) / 100,
    nasscorpEmployerUsd: Math.round(nasscorpEmployerUsd * 100) / 100,
    lraTaxUsd: Math.round(lraTaxUsd * 100) / 100,
    medicalDeductionsUsd,
    netPayUsd: Math.round(netPayUsd * 100) / 100,
    netPayLrd: Math.round(netPayLrd),
    exchangeRateLrd
  };
}
