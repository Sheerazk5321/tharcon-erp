/**
 * Pakistani Multi-Provincial Tax & Withholding Engine (ITO 2001, SRB, PRA, BRA)
 * M/S Tharcon Engineers & Contractors
 */

export function calculateInvoiceTaxes({
  grossAmount = 0,
  province = "Sindh",
  scopeCategory = "Civil",
  clientOrg = "",
  retentionPercent = 10,
  mobilizationAdjustmentPercent = 0,
  isClientGstExempt = false,
  laborPortionPercent = 100 // for contracts taxing only the labor split
}) {
  const gross = Number(grossAmount) || 0;
  
  // 1. Mobilization Advance Recovery
  const mobilizationDeduction = (gross * (Number(mobilizationAdjustmentPercent) || 0)) / 100;
  
  // 2. Retention Money
  const retentionDeduction = (gross * (Number(retentionPercent) || 0)) / 100;
  
  // 3. Federal Withholding Tax (FBR ITO 2001, Section 153 - Active Filer)
  // Standard civil/engineering works: 5.5% (or 7.5% depending on specific code), supplies: 4.5%
  let fbrWhtRate = scopeCategory.toLowerCase().includes("supply") ? 4.5 : 5.5;
  const fbrWhtAmount = (gross * fbrWhtRate) / 100;
  
  // 4. Provincial Sales Tax on Services
  let provincialAuthority = "SRB";
  let statutorySalesTaxRate = 13; // SRB Tariff 54
  let clientWithholdingRate = 3;  // standard withholding at source by withholding agents
  
  const prov = province.toLowerCase();
  if (prov.includes("punjab")) {
    provincialAuthority = "PRA";
    statutorySalesTaxRate = 16;
    clientWithholdingRate = 4;
  } else if (prov.includes("balochistan")) {
    provincialAuthority = "BRA";
    statutorySalesTaxRate = 15;
    clientWithholdingRate = 3.75;
  } else if (prov.includes("ict") || prov.includes("islamabad") || prov.includes("kpk")) {
    provincialAuthority = "FBR/ICT";
    statutorySalesTaxRate = 16;
    clientWithholdingRate = 4;
  }

  // Handle client GST exemption (e.g. Indus Hospital Section VII or USAID/UN exemption)
  let salesTaxPayable = 0;
  let clientWithheldSalesTax = 0;
  let isExempt = isClientGstExempt;

  if (clientOrg.toLowerCase().includes("indus hospital") || clientOrg.toLowerCase().includes("who")) {
    isExempt = true;
  }

  if (!isExempt) {
    const taxableBase = (gross * (Number(laborPortionPercent) || 100)) / 100;
    salesTaxPayable = (taxableBase * statutorySalesTaxRate) / 100;
    clientWithheldSalesTax = (taxableBase * clientWithholdingRate) / 100;
  }

  // Net Receivable by Tharcon
  // Net = Gross - Mobilization - Retention - FBR WHT - Client Withheld Sales Tax
  const totalDeductions = mobilizationDeduction + retentionDeduction + fbrWhtAmount + clientWithheldSalesTax;
  const netReceivable = Math.max(0, gross - totalDeductions);

  return {
    grossAmount: gross,
    mobilizationDeduction,
    retentionDeduction,
    fbrWht: {
      section: "ITO 2001 Sec 153(1)(c)",
      ratePercent: fbrWhtRate,
      amount: fbrWhtAmount
    },
    provincialSalesTax: {
      authority: provincialAuthority,
      statutoryRatePercent: isExempt ? 0 : statutorySalesTaxRate,
      clientWithheldRatePercent: isExempt ? 0 : clientWithholdingRate,
      taxableBase: isExempt ? 0 : (gross * (Number(laborPortionPercent) || 100)) / 100,
      totalSalesTaxLiability: salesTaxPayable,
      withheldByClient: clientWithheldSalesTax,
      isExempt,
      exemptionReason: isExempt ? "Client Tax Exemption Certificate Attached" : null
    },
    totalDeductions,
    netReceivable,
    calculatedAt: new Date().toISOString()
  };
}

