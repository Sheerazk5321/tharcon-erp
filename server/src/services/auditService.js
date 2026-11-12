/**
 * Syed & Co. Chartered Accountants Standards Generator
 * Generates Contract Working Account, Profit & Loss, Balance Sheet, and Proprietor's Capital Account
 */

export function generateAuditedFinancialStatements(mockData) {
  // Aggregate contract billing and costs
  const activeContracts = mockData.projects;
  const totalContractValue = activeContracts.reduce((sum, p) => sum + p.totalValuePKR, 0);

  // Contract Working Account (Direct Project Execution)
  const contractWorkExecuted = 84500000;
  const openingWIP = 12400000;
  const materialConsumed = 46200000;
  const siteSalariesAndWages = 14350000;
  const machineryRentalAndFuel = 4850000;
  const siteOverheadsAndCampExpenses = 2100000;
  const plantAndMachineryDepreciation = 1420000; // 15% Diminishing Balance
  const totalDirectCosts = materialConsumed + siteSalariesAndWages + machineryRentalAndFuel + siteOverheadsAndCampExpenses + plantAndMachineryDepreciation;
  const closingWIP = 16820000;
  const costOfBilledWork = (openingWIP + totalDirectCosts) - closingWIP;
  const grossProfit = contractWorkExecuted - costOfBilledWork;

  // Administrative / Office Overheads (P&L)
  const adminSalaries = 3400000;
  const officeRentAndRates = 1200000; // Islamabad & Hyderabad
  const communicationAndUtilities = 580000;
  const tenderAndBiddingExpenses = 620000;
  const auditAndLegalFee = 350000;
  const officeDepreciation = 310000; // 10% Diminishing Balance
  const miscGeneralExpenses = 440000;
  const totalAdminOverheads = adminSalaries + officeRentAndRates + communicationAndUtilities + tenderAndBiddingExpenses + auditAndLegalFee + officeDepreciation + miscGeneralExpenses;

  const netOperatingProfit = grossProfit - totalAdminOverheads;
  const provisionForTaxation = netOperatingProfit * 0.29; // Corporate/Firm Tax
  const netProfitAfterTax = netOperatingProfit - provisionForTaxation;

  // Statement of Financial Position (Balance Sheet)
  const bankBalances = mockData.company.bankAccounts.reduce((sum, b) => sum + b.balancePKR, 0);
  const tradeReceivablesBilled = 15226625;
  const retentionReceivable = mockData.retentionVault.reduce((sum, r) => sum + r.retentionAmountPKR, 0);
  const cdrDepositsHeldByClients = mockData.tenders.reduce((sum, t) => sum + (t.cdrAmountPKR || 0), 0);
  const operatingFixedAssetsWDV = 16800000;

  const totalAssets = operatingFixedAssetsWDV + closingWIP + tradeReceivablesBilled + retentionReceivable + cdrDepositsHeldByClients + bankBalances;

  const tradePayablesAndAccruals = 12800000;
  const mobilizationAdvancePayable = 5400000;
  const taxLiabilitiesPayable = provisionForTaxation + 1400000;
  const totalLiabilities = tradePayablesAndAccruals + mobilizationAdvancePayable + taxLiabilitiesPayable;

  const proprietorEquity = totalAssets - totalLiabilities;

  return {
    period: "For the Period Ended November 11, 2026",
    auditors: "Syed & Co. Chartered Accountants",
    legalEntity: mockData.company.legalName,
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
      grossMarginPercent: Number(((grossProfit / contractWorkExecuted) * 100).toFixed(2))
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
      netMarginPercent: Number(((netProfitAfterTax / contractWorkExecuted) * 100).toFixed(2))
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

