import type { FarmerProfile, DuplicateAlert } from '../types';

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function nameSimilarityScore(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 100;
  const dist = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  return Math.round(((maxLen - dist) / maxLen) * 100);
}

export function checkForDuplicates(
  targetFarmer: FarmerProfile,
  allFarmers: FarmerProfile[]
): DuplicateAlert[] {
  const alerts: DuplicateAlert[] = [];

  for (const existing of allFarmers) {
    if (existing.id === targetFarmer.id) continue;

    let score = 0;
    const reasons: string[] = [];

    // 1. National ID exact match (Highest weight: 95%)
    if (
      targetFarmer.nationalIdNumber &&
      existing.nationalIdNumber &&
      targetFarmer.nationalIdNumber.trim() === existing.nationalIdNumber.trim()
    ) {
      score += 95;
      reasons.push(`Exact National ID Match (${targetFarmer.nationalIdNumber})`);
    }

    // 2. Phone number match (Weight: 75%)
    if (
      targetFarmer.primaryPhone &&
      existing.primaryPhone &&
      targetFarmer.primaryPhone.replace(/\s+/g, '') === existing.primaryPhone.replace(/\s+/g, '')
    ) {
      score += 75;
      reasons.push(`Matching Phone Number (${targetFarmer.primaryPhone})`);
    }

    // 3. Name & Date of Birth similarity
    const targetFullName = `${targetFarmer.firstName} ${targetFarmer.lastName}`;
    const existingFullName = `${existing.firstName} ${existing.lastName}`;
    const nameSim = nameSimilarityScore(targetFullName, existingFullName);
    if (nameSim > 70) {
      score += Math.round(nameSim * 0.4); // Add up to 40%
      reasons.push(`High Name Similarity (${nameSim}%: "${targetFullName}" vs "${existingFullName}")`);
    }

    if (targetFarmer.dateOfBirth && existing.dateOfBirth && targetFarmer.dateOfBirth === existing.dateOfBirth) {
      score += 25;
      reasons.push(`Matching Date of Birth (${targetFarmer.dateOfBirth})`);
    }

    // 4. Same County & District + Nearby GPS (Distance < 500m)
    if (targetFarmer.county === existing.county && targetFarmer.district === existing.district) {
      const latDiff = Math.abs(targetFarmer.gpsLatitude - existing.gpsLatitude);
      const lngDiff = Math.abs(targetFarmer.gpsLongitude - existing.gpsLongitude);
      if (latDiff < 0.005 && lngDiff < 0.005) {
        score += 30;
        reasons.push(`Close Proximity GPS Coordinates in ${targetFarmer.county} / ${targetFarmer.district}`);
      }
    }

    // Cap total score at 100
    const finalScore = Math.min(100, score);

    if (finalScore >= 50) {
      alerts.push({
        id: `dup-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        primaryFarmerId: existing.id,
        primaryFarmerName: `${existing.firstName} ${existing.lastName}`,
        secondaryFarmerId: targetFarmer.id,
        secondaryFarmerName: `${targetFarmer.firstName} ${targetFarmer.lastName}`,
        overallMatchScore: finalScore,
        matchingReasons: reasons,
        riskLevel: finalScore >= 80 ? 'HIGH' : 'MEDIUM',
        status: 'UNRESOLVED',
        createdAt: new Date().toISOString()
      });
    }
  }

  return alerts;
}
