import type { FarmerProfile, Parcel, AgriculturalProgram } from '../types';

export interface EligibilityResult {
  isEligible: boolean;
  scorePercentage: number;
  reasons: string[];
  missingCriteria: string[];
}

export function evaluateEligibility(
  farmer: FarmerProfile,
  parcels: Parcel[],
  program: AgriculturalProgram
): EligibilityResult {
  const reasons: string[] = [];
  const missingCriteria: string[] = [];
  let criteriaMet = 0;
  let totalCriteria = 0;

  // 1. County geographic targeting check
  totalCriteria++;
  if (program.targetCounties.length === 0 || program.targetCounties.includes(farmer.county)) {
    criteriaMet++;
    reasons.push(`Located in targeted county: ${farmer.county}`);
  } else {
    missingCriteria.push(`County (${farmer.county}) is not targeted by this program (${program.targetCounties.join(', ')})`);
  }

  // 2. Verification status check
  totalCriteria++;
  if (farmer.verificationStatus === 'APPROVED' || farmer.verificationStatus === 'FIELD_VERIFIED') {
    criteriaMet++;
    reasons.push(`Farmer is verified (${farmer.verificationStatus})`);
  } else {
    missingCriteria.push(`Farmer verification status (${farmer.verificationStatus}) is not approved`);
  }

  // 3. Farm size rules
  const farmerParcels = parcels.filter((p) => p.farmerId === farmer.id);
  const totalAreaHa = farmerParcels.reduce((sum, p) => sum + p.calculatedAreaHectares, 0);

  if (program.eligibilityRules.minFarmSizeHa !== undefined) {
    totalCriteria++;
    if (totalAreaHa >= program.eligibilityRules.minFarmSizeHa) {
      criteriaMet++;
      reasons.push(`Total farm size (${totalAreaHa.toFixed(2)} Ha) meets minimum requirement (${program.eligibilityRules.minFarmSizeHa} Ha)`);
    } else {
      missingCriteria.push(`Farm size (${totalAreaHa.toFixed(2)} Ha) below required minimum (${program.eligibilityRules.minFarmSizeHa} Ha)`);
    }
  }

  if (program.eligibilityRules.maxFarmSizeHa !== undefined) {
    totalCriteria++;
    if (totalAreaHa <= program.eligibilityRules.maxFarmSizeHa) {
      criteriaMet++;
      reasons.push(`Total farm size (${totalAreaHa.toFixed(2)} Ha) within maximum ceiling (${program.eligibilityRules.maxFarmSizeHa} Ha)`);
    } else {
      missingCriteria.push(`Farm size (${totalAreaHa.toFixed(2)} Ha) exceeds maximum allowed (${program.eligibilityRules.maxFarmSizeHa} Ha)`);
    }
  }

  // 4. Target crops check
  if (program.eligibilityRules.targetCrops && program.eligibilityRules.targetCrops.length > 0) {
    totalCriteria++;
    const farmerCrops = farmerParcels.map((p) => p.primaryCrop);
    const matchesCrop = program.eligibilityRules.targetCrops.some((tc) => farmerCrops.includes(tc));
    if (matchesCrop) {
      criteriaMet++;
      reasons.push(`Cultivates required targeted crop(s)`);
    } else {
      missingCriteria.push(`Does not cultivate required crop(s): ${program.eligibilityRules.targetCrops.join(', ')}`);
    }
  }

  // 5. Demographics (Female Headed Household / Youth)
  if (program.eligibilityRules.requireFemaleHeaded) {
    totalCriteria++;
    if (farmer.isFemaleHeadedHousehold) {
      criteriaMet++;
      reasons.push(`Meets female-headed household requirement`);
    } else {
      missingCriteria.push(`Requires female-headed household status`);
    }
  }

  if (program.eligibilityRules.requireYouth) {
    totalCriteria++;
    if (farmer.isYouth) {
      criteriaMet++;
      reasons.push(`Meets youth classification requirement (Under 35 years)`);
    } else {
      missingCriteria.push(`Requires youth classification (Under 35 years)`);
    }
  }

  // 6. Farm-to-market road access requirement
  if (program.eligibilityRules.requireRoadAccess) {
    totalCriteria++;
    if (farmer.farmConditions?.farmToMarketRoad?.hasRoadAccess) {
      criteriaMet++;
      reasons.push(`Meets farm-to-market road accessibility requirement`);
    } else {
      missingCriteria.push(`Requires confirmed farm-to-market road access`);
    }
  }

  const scorePercentage = totalCriteria > 0 ? Math.round((criteriaMet / totalCriteria) * 100) : 100;
  const isEligible = missingCriteria.length === 0;

  return {
    isEligible,
    scorePercentage,
    reasons,
    missingCriteria
  };
}
