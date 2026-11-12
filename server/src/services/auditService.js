/**
 * Syed & Co. Chartered Accountants Standards Generator
 * Generates Contract Working Account, Profit & Loss, Balance Sheet, and Proprietor's Capital Account
 * Computes dynamically from active project records and ledger entries.
 */

export function generateAuditedFinancialStatements(mockData) {
  const activeContracts = mockData.projects || [];
  const totalContractValue = activeContracts.reduce((sum, p) => sum + (Number(p.totalValuePKR) || 0), 0);

  // Contract Working Account (Direct Project Execution)
  // When active contracts exist, compute based on executed percentage; otherwise 0
  const contractWorkExecuted = activeContracts.reduce((sum, p) => {
    const progress = (Number(p.currentProgressPercent) || 0) / 100;
    return sum + ((Number(p.totalValuePKR) || 0) * progress);
  }, 0);

  const openingWIP = 0;
  const materialConsumed = contractWorkExecuted * 0.55;
  const siteSalariesAndWages = contractWorkExecuted * 0.17;
  const machineryRentalAndFuel = contractWorkExecuted * 0.06;
  const siteOverheadsAndCampExpenses = contractWorkExecuted * 0.025;
  const plantAndMachineryDepreciation = (mockData.machineryFleet || []).reduce((sum, m) => sum + ((Number(m.wdvValuePKR) || 0) * 0.15), 0);
  const totalDirectCosts = materialConsumed + siteSalariesAndWages + machineryRentalAndFuel + siteOverheadsAndCampExpenses + plantAndMachineryDepreciation;
  const closingWIP = contractWorkExecuted * 0.15;
  const costOfBilledWork = Math.max(0, (openingWIP + totalDirectCosts) - closingWIP);
  const grossProfit = Math.max(0, contractWorkExecuted - costOfBilledWork);

  // Administrative / Office Overheads (P&L)
  const adminSalaries = contractWorkExecuted > 0 ? 3400000 : 0;
  const officeRentAndRates = contractWorkExecuted > 0 ? 1200000 : 0;
  const communicationAndUtilities = contractWorkExecuted > 0 ? 580000 : 0;
  const tenderAndBiddingExpenses = contractWorkExecuted > 0 ? 620000 : 0;
  const auditAndLegalFee = contractWorkExecuted > 0 ? 350000 : 0;
  const officeDepreciation = 0;
  const miscGeneralExpenses = contractWorkExecuted > 0 ? 440000 : 0;
  const totalAdminOverheads = adminSalaries + officeRentAndRates + communicationAndUtilities + tenderAndBiddingExpenses + auditAndLegalFee + officeDepreciation + miscGeneralExpenses;

  const netOperatingProfit = Math.max(0, grossProfit - totalAdminOverheads);
  const provisionForTaxation = netOperatingProfit * 0.29; // Corporate/Firm Tax
  const netProfitAfterTax = netOperatingProfit - provisionForTaxation;

  // Statement of Financial Position (Balance Sheet)
  const bankBalances = (mockData.company?.bankAccounts || []).reduce((sum, b) => sum + (Number(b.balancePKR) || 0), 0);
  const tradeReceivablesBilled = (mockData.invoices || []).filter(i => i.status !== 'Verified & Paid').reduce((sum, i) => sum + (Number(i.netPayablePKR) || 0), 0);
  const retentionReceivable = (mockData.retentionVault || []).reduce((sum, r) => sum + (Number(r.retentionAmountPKR) || 0), 0);
  const cdrDepositsHeldByClients = (mockData.tenders || []).reduce((sum, t) => sum + (Number(t.cdrAmountPKR) || 0), 0);
  const operatingFixedAssetsWDV = (mockData.machineryFleet || []).reduce((sum, m) => sum + (Number(m.wdvValuePKR) || 0), 0);

  const totalAssets = operatingFixedAssetsWDV + closingWIP + tradeReceivablesBilled + retentionReceivable + cdrDepositsHeldByClients + bankBalances;

  const tradePayablesAndAccruals = 0;
  const mobilizationAdvancePayable = 0;
  const taxLiabilitiesPayable = provisionForTaxation;
  const totalLiabilities = tradePayablesAndAccruals + mobilizationAdvancePayable + taxLiabilitiesPayable;

  const proprietorEquity = Math.max(0, totalAssets - totalLiabilities);

  return {
    period: "Financial Year 2026-2027",
    auditors: "Syed & Co. Chartered Accountants",
    legalEntity: mockData.company?.legalName || "M/S Tharcon Engineers & Contractors",
    contractWorkingAccount: {
      contractWorkExecuted,
      openingWIP,
      materialConsumed,
      siteSalariesAndWages,
      machineryRentalAndFuel,
      siteOverheadsAndCampExpenses,
      plantAndMachineryDepreciation,
      totalDirectCosts,
      closingWIP,
      costOfBilledWork,
      grossProfit,
      grossMarginPercent: contractWorkExecuted > 0 ? Number(((grossProfit / contractWorkExecuted) * 100).toFixed(2)) : 0
    },
    statementOfProfitOrLoss: {
      grossProfit,
      totalAdminOverheads,
      breakdown: {
        adminSalaries,
        officeRentAndRates,
        communicationAndUtilities,
        tenderAndBiddingExpenses,
        auditAndLegalFee,
        officeDepreciation,
        miscGeneralExpenses
      },
      netOperatingProfit,
      provisionForTaxation,
      netProfitAfterTax,
      netMarginPercent: contractWorkExecuted > 0 ? Number(((netProfitAfterTax / contractWorkExecuted) * 100).toFixed(2)) : 0
    },
    balanceSheet: {
      assets: {
        operatingFixedAssetsWDV,
        contractWIP: closingWIP,
        tradeReceivables: tradeReceivablesBilled,
        retentionMoneyReceivable: retentionReceivable,
        cdrDeposits: cdrDepositsHeldByClients,
        cashAndBankBalances: bankBalances,
        totalAssets
      },
      liabilitiesAndEquity: {
        tradePayablesAndAccruals,
        mobilizationAdvancePayable,
        taxLiabilitiesPayable,
        totalLiabilities,
        proprietorEquity,
        totalLiabilitiesAndEquity: totalLiabilities + proprietorEquity
      }
    }
  };
}
