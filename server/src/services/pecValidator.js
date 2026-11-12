/**
 * PEC License & Specialization Code Validator (C3/7901 - PKR 500 Million Limit)
 */

export const THARCON_PEC_PROFILE = {
  licenseNo: "7901",
  category: "C3",
  financialLimitPKR: 500000000, // 500M
  expiryDate: "2027-06-30",
  activeCodes: [
    { code: "CE01", name: "Road and Pavements, Drainage & Bridges" },
    { code: "CE04", name: "Irrigation & Flood Control Works" },
    { code: "CE09", name: "Structural Engineering & Pre-stressed Works" },
    { code: "CE10", name: "General Civil Engineering Works" },
    { code: "EE04", name: "Low Voltage Electrical Installation" },
    { code: "EE06", name: "High Voltage Electrical & Substations" },
    { code: "EE11(iii)", name: "Solar Energy & Photovoltaic Power Systems" },
    { code: "ME01", name: "HVAC & Mechanical Plant Installations" }
  ]
};

export function validatePecEligibility(estimatedValuePKR, requiredCodes = []) {
  const value = Number(estimatedValuePKR) || 0;
  const isWithinFinancialLimit = value <= THARCON_PEC_PROFILE.financialLimitPKR;
  const activeCodesList = THARCON_PEC_PROFILE.activeCodes.map(c => c.code);

  const codeEvaluations = (requiredCodes || []).map(reqCode => {
    const isSupported = activeCodesList.includes(reqCode);
    const detail = THARCON_PEC_PROFILE.activeCodes.find(c => c.code === reqCode);
    return {
      code: reqCode,
      name: detail ? detail.name : "Unrecognized / Not in License",
      isSupported
    };
  });

  const missingCodes = codeEvaluations.filter(c => !c.isSupported).map(c => c.code);
  const isFullyEligible = isWithinFinancialLimit && missingCodes.length === 0;

  return {
    isFullyEligible,
    isWithinFinancialLimit,
    financialLimitPKR: THARCON_PEC_PROFILE.financialLimitPKR,
    tenderValuePKR: value,
    headroomPKR: THARCON_PEC_PROFILE.financialLimitPKR - value,
    codesSummary: codeEvaluations,
    missingCodes,
    pecLicenseNo: THARCON_PEC_PROFILE.licenseNo,
    pecCategory: THARCON_PEC_PROFILE.category
  };
}

