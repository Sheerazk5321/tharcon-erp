/**
 * Liquidated Damages (LD) Penalty Radar & Geofence Validator
 */

export function calculatePenaltyRisk({
  totalValuePKR,
  targetEndDate,
  currentProgressPercent,
  dailyPenaltyRate = 0.001, // 0.1% per day
  maxCapPercent = 10,
  currentDate = new Date().toISOString()
}) {
  const target = new Date(targetEndDate);
  const now = new Date(currentDate);
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  const progress = Number(currentProgressPercent) || 0;
  const value = Number(totalValuePKR) || 0;

  const dailyPenaltyPKR = value * dailyPenaltyRate;
  const maxCapPenaltyPKR = value * (maxCapPercent / 100);

  let riskLevel = "LOW";
  let daysOverdue = 0;
  let accruedPenaltyPKR = 0;

  if (diffDays < 0) {
    daysOverdue = Math.abs(diffDays);
    accruedPenaltyPKR = Math.min(daysOverdue * dailyPenaltyPKR, maxCapPenaltyPKR);
    riskLevel = "CRITICAL / ACCRUING PENALTY";
  } else if (diffDays <= 14 && progress < 85) {
    riskLevel = "HIGH / IMMINENT RISK";
  } else if (diffDays <= 30 && progress < 60) {
    riskLevel = "MEDIUM / MONITOR";
  }

  return {
    daysRemaining: Math.max(0, diffDays),
    daysOverdue,
    riskLevel,
    dailyPenaltyPKR,
    accruedPenaltyPKR,
    maxCapPenaltyPKR,
    progressPercent: progress,
    projectValuePKR: value
  };
}

export function verifySiteGeofence(siteCoords, engineerCoords, maxDistanceMeters = 500) {
  if (!siteCoords || !engineerCoords) {
    return { isWithinSite: false, distanceMeters: null, error: "Missing GPS coordinates" };
  }

  // Haversine formula
  const R = 6371e3; // Earth radius in meters
  const φ1 = (siteCoords.lat * Math.PI) / 180;
  const φ2 = (engineerCoords.lat * Math.PI) / 180;
  const Δφ = ((engineerCoords.lat - siteCoords.lat) * Math.PI) / 180;
  const Δλ = ((engineerCoords.lng - siteCoords.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMeters = Math.round(R * c);

  return {
    isWithinSite: distanceMeters <= maxDistanceMeters,
    distanceMeters,
    allowedRadiusMeters: maxDistanceMeters,
    siteLocation: siteCoords,
    engineerLocation: engineerCoords
  };
}

