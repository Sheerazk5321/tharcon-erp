/**
 * Comprehensive Seed Data for Tharcon-ERP
 * M/S Tharcon Engineers & Contractors & Tharcon (Private) Limited
 */

export const mockData = {
  company: {
    legalName: "M/S Tharcon Engineers & Contractors",
    privateEntity: "Tharcon (Private) Limited",
    pecLicense: "C3/7901",
    pecLimitPKR: 500000000, // 500 Million
    pecSpecializations: ["CE01", "CE04", "CE09", "CE10", "EE04", "EE06", "EE11(iii)", "ME01"],
    ntn: "1863422-2",
    sntn: "S1863422-2", // SRB Sindh
    pntn: "P1863422-2", // PRA Punjab
    bntn: "B1863422-2", // BRA Balochistan
    lbsaReg: "KHP/G-III/5-145/2026", // Livestock Breeding Facility Khairpur
    headOffice: "Office B # 399, Street 1, Murree Road, Korang Road, LVL Colony, Islamabad",
    regionalOfficeSindh: "Flat # 09/A5, 2nd Floor, Al-Rehman Towers, Opp. Marvi Lawn, Wadhu Wah, Qasimabad, Hyderabad",
    kotriOffice: "Shop # B-1, T.P.S Colony, Sehwan Road, Kotri, Jamshoro",
    islamabadSubOffice: "Office # D/12, 1st Floor Riffat Plaza, Murree Road, Bhara Kahu, Islamabad",
    livestockFacility: "Village AdhoBhar, PO Box Baberlo Taluka, Khairpur Mir's (21,000 sq. ft.)",
    bankAccounts: [
      {
        id: "bank-01",
        bankName: "Askari Bank Limited",
        branch: "F-7 Markaz, Islamabad",
        accountNo: "0140789012345",
        title: "M/S Tharcon Engineers & Contractors",
        type: "Operations & IPC Working Account",
        balancePKR: 18450000,
        currency: "PKR"
      },
      {
        id: "bank-02",
        bankName: "BankIslami Pakistan Limited",
        branch: "Auto Bhan Road, Hyderabad",
        accountNo: "2055001298451",
        title: "M/S Tharcon Engineers & Contractors",
        type: "Toll Plaza & Escrow Guarantee Account",
        balancePKR: 9230000,
        currency: "PKR"
      }
    ]
  },

  users: [
    {
      id: "u-01",
      name: "Engr. Mujeeb ur Rehman Jatoi",
      role: "CEO / Executive",
      email: "ceo@tharcon.pk",
      phone: "+92 300 1234567",
      designation: "Chief Executive Officer",
      location: "Islamabad Head Office"
    },
    {
      id: "u-02",
      name: "Engr. Muneer Ahmed",
      role: "Lead Partner / Executive",
      email: "muneer@tharcon.pk",
      phone: "+92 300 7654321",
      designation: "Proprietor & Managing Partner",
      location: "Hyderabad Regional Office"
    },
    {
      id: "u-03",
      name: "Sheeraz Ali",
      role: "System Administrator",
      email: "sheeraz.ali@tharcon.pk",
      phone: "+92 333 9876543",
      designation: "Head of IT & Enterprise Systems",
      location: "Islamabad Head Office"
    },
    {
      id: "u-04",
      name: "Engr. Masroor Ahmed",
      role: "Project Manager",
      email: "masroor@tharcon.pk",
      pecNo: "CIVIL/31592",
      qualification: "B.E. Civil Engineering",
      phone: "+92 312 4567890",
      assignedProjects: ["PRJ-01", "PRJ-02"],
      location: "Hyderabad / Field Sites"
    },
    {
      id: "u-05",
      name: "Waseem Ahmed",
      role: "Site Engineer",
      email: "waseem.site@tharcon.pk",
      qualification: "DAE Civil Engineering",
      phone: "+92 345 1122334",
      assignedProjects: ["PRJ-01"],
      currentSite: "Mirpur Khas Housing Cluster",
      location: "Mirpur Khas"
    },
    {
      id: "u-06",
      name: "Habib-ur-Rehman",
      role: "Site Engineer",
      email: "habib.solar@tharcon.pk",
      pecNo: "ELECTRO/13903",
      qualification: "B.E. Electrical Engineering",
      phone: "+92 321 9988776",
      assignedProjects: ["PRJ-03"],
      currentSite: "Jafarabad Solar Sites",
      location: "Balochistan"
    },
    {
      id: "u-07",
      name: "Engr. Wardha Batool",
      role: "Tender / Estimator",
      email: "wardha.qs@tharcon.pk",
      qualification: "B.Arch / Quantity Surveying",
      phone: "+92 334 5566778",
      designation: "Lead Quantity Surveyor & Bidding Head",
      location: "Islamabad Head Office"
    },
    {
      id: "u-08",
      name: "Syed & Co. Audit Liaison / Finance",
      role: "Finance Manager",
      email: "finance@tharcon.pk",
      phone: "+92 300 4455667",
      designation: "Senior Finance & Tax Officer",
      location: "Islamabad Head Office"
    }
  ],

  tenders: [
    {
      id: "TND-2026-01",
      source: "UNGM / RFP Direct",
      clientOrg: "World Health Organization (WHO)",
      refNo: "LTA/WCO/PAK/2026/027",
      title: "1-Year Long Term Agreement for Building Maintenance Consumables",
      estimatedValuePKR: 24000000,
      scopeCategory: "Long-Term Agreement (LTA) / General Supply",
      submissionDeadline: "2026-11-20T14:00:00+05:00",
      bidOpeningDate: "2026-11-20T15:00:00+05:00",
      pecRequired: ["EE04", "ME01"],
      cdrRequiredPercent: 2,
      cdrAmountPKR: 480000,
      cdrInstrument: {
        bankName: "Askari Bank",
        instrumentNo: "CDR-782910",
        expiryDate: "2027-02-28",
        status: "Active / Submitted"
      },
      status: "Awarded / Active Contract",
      winProbability: 100,
      documentsCount: 6
    },
    {
      id: "TND-2026-02",
      source: "paperpk.com / Daily Jang",
      clientOrg: "Indus Hospital & Health Network (IHHN)",
      refNo: "IHHN/CW/INC-YR/2026/91",
      title: "Construction of Biomedical Waste Incinerator & Yellow Room Complex",
      estimatedValuePKR: 68000000,
      scopeCategory: "Civil, MEP & Healthcare Infrastructure",
      submissionDeadline: "2026-11-28T12:00:00+05:00",
      bidOpeningDate: "2026-11-28T13:30:00+05:00",
      pecRequired: ["CE01", "CE10", "EE11(iii)"],
      cdrRequiredPercent: 3,
      cdrAmountPKR: 2040000,
      cdrInstrument: {
        bankName: "Askari Bank",
        instrumentNo: "CDR-894102",
        expiryDate: "2027-03-31",
        status: "Submitted / Under Evaluation"
      },
      status: "Submitted",
      winProbability: 85,
      documentsCount: 12
    },
    {
      id: "TND-2026-03",
      source: "PPRA / Direct RFP",
      clientOrg: "National Highway Authority (NHA)",
      refNo: "LOA 20(08) NHA/DD(R-C)/2025/54",
      title: "Operations, Management & Revenue Collection at Hassanabdal Toll Plaza (N-35)",
      estimatedValuePKR: 164436000,
      scopeCategory: "Highway Toll Operations",
      submissionDeadline: "2026-10-15T11:00:00+05:00",
      bidOpeningDate: "2026-10-15T12:00:00+05:00",
      pecRequired: ["CE01"],
      cdrRequiredPercent: 5,
      cdrAmountPKR: 8221800,
      cdrInstrument: {
        bankName: "BankIslami",
        instrumentNo: "BG-NHA-9081",
        expiryDate: "2027-10-31",
        status: "Active / Handed Over"
      },
      status: "Awarded / Active Contract",
      winProbability: 100,
      documentsCount: 8
    },
    {
      id: "TND-2026-04",
      source: "Direct NGO RFP",
      clientOrg: "Muslim Aid Pakistan",
      refNo: "MAP/MAUK/2026-23/26/5930-8",
      title: "Construction of 47 Resilient Flood-Protected Smart Houses",
      estimatedValuePKR: 53982790,
      scopeCategory: "Civil & Humanitarian Shelter",
      submissionDeadline: "2026-08-10T15:00:00+05:00",
      bidOpeningDate: "2026-08-10T16:00:00+05:00",
      pecRequired: ["CE01", "CE10"],
      cdrRequiredPercent: 3,
      cdrAmountPKR: 1619483,
      cdrInstrument: {
        bankName: "Askari Bank",
        instrumentNo: "CDR-554120",
        expiryDate: "2027-04-15",
        status: "Active / Contract Ongoing"
      },
      status: "Awarded / Active Contract",
      winProbability: 100,
      documentsCount: 15
    },
    {
      id: "TND-2026-05",
      source: "paperpk.com / Daily Kawaish",
      clientOrg: "Save the Children International",
      refNo: "SCI/PK/EDU/2026/104",
      title: "Construction of Resilient Model School & WASH Facilities in Dadu",
      estimatedValuePKR: 42500000,
      scopeCategory: "Civil, MEP & Education Infrastructure",
      submissionDeadline: "2026-12-05T14:00:00+05:00",
      bidOpeningDate: "2026-12-05T15:00:00+05:00",
      pecRequired: ["CE01", "EE04"],
      cdrRequiredPercent: 2.5,
      cdrAmountPKR: 1062500,
      cdrInstrument: {
        bankName: "Askari Bank",
        instrumentNo: "CDR-990145",
        expiryDate: "2027-05-30",
        status: "In Preparation"
      },
      status: "Technical Bid Prepared",
      winProbability: 75,
      documentsCount: 9
    }
  ],

  projects: [
    {
      id: "PRJ-01",
      tenderId: "TND-2026-04",
      code: "MAP-SH-47",
      name: "47 Resilient Smart Houses Construction",
      clientOrg: "Muslim Aid Pakistan",
      contractRef: "MAP/MAUK/2026-23/26/5930-8",
      contractType: "Civil & Humanitarian Shelter",
      totalValuePKR: 53982790,
      startDate: "2026-08-25",
      targetEndDate: "2027-02-28",
      currentProgressPercent: 68,
      location: {
        province: "Sindh",
        district: "Mirpur Khas",
        tehsils: ["Digri", "Jhudo", "Kot Ghulam Muhammad"],
        gpsCenter: { lat: 25.5276, lng: 69.0125 }
      },
      pmName: "Engr. Masroor Ahmed",
      siteEngineers: ["Waseem Ahmed", "Iqbal Soomro"],
      liquidatedDamagesRatePerDay: 0.001, // 0.1% per day
      liquidatedDamagesMaxCapPercent: 10,
      retentionPercent: 10,
      dlpDays: 90, // 3 Months for 34/47 Smart houses
      status: "Active / In Progress",
      totalBeneficiaryUnits: 47,
      completedUnits: 28,
      inProgressUnits: 19
    },
    {
      id: "PRJ-02",
      tenderId: "TND-2026-02",
      code: "IHHN-INC-01",
      name: "Incinerator & Yellow Room Complex",
      clientOrg: "Indus Hospital & Health Network (IHHN)",
      contractRef: "IHHN/CW/INC-YR/2026/91",
      contractType: "Civil, MEP & Healthcare Infrastructure",
      totalValuePKR: 68000000,
      startDate: "2026-09-15",
      targetEndDate: "2027-04-30",
      currentProgressPercent: 42,
      location: {
        province: "Sindh",
        district: "Badin & Karachi",
        tehsils: ["Matli", "Korangi"],
        gpsCenter: { lat: 24.8607, lng: 67.0011 }
      },
      pmName: "Engr. Masroor Ahmed",
      siteEngineers: ["Farman Ali"],
      liquidatedDamagesRatePerDay: 0.001,
      liquidatedDamagesMaxCapPercent: 10,
      retentionPercent: 5,
      performanceGuaranteeChequePercent: 10,
      dlpDays: 365, // 12 Months
      status: "Active / In Progress",
      totalBeneficiaryUnits: 2,
      completedUnits: 0,
      inProgressUnits: 2
    },
    {
      id: "PRJ-03",
      tenderId: "TND-2024-ACF",
      code: "ACF-SOLAR-09",
      name: "9 Solarized Agricultural Water Tanks",
      clientOrg: "Action Against Hunger (ACF)",
      contractRef: "ACF/QTA/WASH/2024/77",
      contractType: "Sustainable Solar & Water Systems",
      totalValuePKR: 12518240,
      startDate: "2026-06-01",
      targetEndDate: "2026-12-15",
      currentProgressPercent: 88,
      location: {
        province: "Balochistan",
        district: "Jafarabad & Dera Bugti",
        tehsils: ["Usta Muhammad"],
        gpsCenter: { lat: 28.1833, lng: 68.05 }
      },
      pmName: "Engr. Rizwan",
      siteEngineers: ["Habib-ur-Rehman"],
      retentionPercent: 10,
      dlpDays: 180, // 6 Months pump warranty
      status: "Active / Near Completion",
      totalBeneficiaryUnits: 9,
      completedUnits: 7,
      inProgressUnits: 2
    },
    {
      id: "PRJ-04",
      tenderId: "TND-2026-03",
      code: "NHA-TOLL-N35",
      name: "Hassanabdal Toll Plaza Operations (N-35)",
      clientOrg: "National Highway Authority (NHA)",
      contractRef: "LOA 20(08) NHA/DD(R-C)/2025/54",
      contractType: "Highway Toll Operations",
      totalValuePKR: 164436000,
      startDate: "2026-01-01",
      targetEndDate: "2026-12-31",
      currentProgressPercent: 91,
      location: {
        province: "Punjab / KPK Border",
        district: "Attock / Rawalpindi",
        tehsils: ["Hassanabdal"],
        gpsCenter: { lat: 33.8214, lng: 72.6892 }
      },
      netMonthlyGuaranteedRevenuePKR: 13703000,
      dailyTargetCollectionPKR: 456766,
      pmName: "Engr. Masab",
      status: "Active Operational Vertical"
    },
    {
      id: "PRJ-05",
      tenderId: "TND-2026-01",
      code: "WHO-LTA-2026",
      name: "WHO Building Consumables Framework Agreement",
      clientOrg: "World Health Organization (WHO)",
      contractRef: "LTA/WCO/PAK/2026/027",
      contractType: "Long-Term Agreement (LTA)",
      totalValuePKR: 24000000,
      startDate: "2026-02-18",
      targetEndDate: "2027-01-17",
      currentProgressPercent: 78,
      location: {
        province: "ICT / Countrywide",
        district: "Islamabad & Countrywide UN Hubs",
        tehsils: ["Chak Shahzad WHO Warehouse"],
        gpsCenter: { lat: 33.6844, lng: 73.0479 }
      },
      pmName: "Naeem Ahmed",
      status: "Active Catalog Guard"
    }
  ],

  // Representative Household Units for PRJ-01 (Mirpur Khas Smart Houses)
  beneficiaryUnits: [
    {
      unitId: "SH-01",
      householdCode: "SH/L2/MPK/25/001",
      projectId: "PRJ-01",
      beneficiaryAlias: "Household 001 (Protected PII)",
      village: "Village Murad Jamali",
      unionCouncil: "UC Digri-1",
      tehsil: "Digri",
      gpsLat: 25.5281,
      gpsLng: 69.0131,
      currentMilestone: "Slab Casting / Finishing",
      foundationCompleted: true,
      plinthCompleted: true,
      lintelCompleted: true,
      slabCompleted: true,
      handoverStatus: "Snagging / Punch List",
      assignedEngineer: "Waseem Ahmed"
    },
    {
      unitId: "SH-02",
      householdCode: "SH/L2/MPK/25/002",
      projectId: "PRJ-01",
      beneficiaryAlias: "Household 002 (Protected PII)",
      village: "Village Murad Jamali",
      unionCouncil: "UC Digri-1",
      tehsil: "Digri",
      gpsLat: 25.529,
      gpsLng: 69.0142,
      currentMilestone: "Lintel Level / Superstructure",
      foundationCompleted: true,
      plinthCompleted: true,
      lintelCompleted: true,
      slabCompleted: false,
      handoverStatus: "Under Construction",
      assignedEngineer: "Waseem Ahmed"
    },
    {
      unitId: "SH-03",
      householdCode: "SH/L2/MPK/25/003",
      projectId: "PRJ-01",
      beneficiaryAlias: "Household 003 (Protected PII)",
      village: "Village Haji Bux Soomro",
      unionCouncil: "UC Jhudo-2",
      tehsil: "Jhudo",
      gpsLat: 25.512,
      gpsLng: 69.035,
      currentMilestone: "Plinth Level / DPC",
      foundationCompleted: true,
      plinthCompleted: true,
      lintelCompleted: false,
      slabCompleted: false,
      handoverStatus: "Under Construction",
      assignedEngineer: "Iqbal Soomro"
    }
  ],

  // Khairpur Livestock Breeding Farm
  livestockFarm: {
    facilityName: "Tharcon LBSA Breeding & Supply Facility",
    location: "Village AdhoBhar, Khairpur Mir's (21,000 sq. ft.)",
    registrationNo: "KHP/G-III/5-145/2026",
    manager: "Dr. Asif Baloch (DVM)",
    capacity: {
      buffaloes: 200,
      goats: 900,
      cows: 50
    },
    currentStock: {
      buffaloes: 172,
      goats: 840,
      cows: 38
    },
    goatBreedsBreakdown: [
      { breed: "Teddy", count: 260, targetAvgWeightKg: 28, healthStatus: "Excellent" },
      { breed: "Thari", count: 180, targetAvgWeightKg: 32, healthStatus: "Excellent" },
      { breed: "Tapri", count: 150, targetAvgWeightKg: 35, healthStatus: "Good" },
      { breed: "Bari", count: 110, targetAvgWeightKg: 30, healthStatus: "Excellent" },
      { breed: "Pateri", count: 90, targetAvgWeightKg: 40, healthStatus: "Vaccinated" },
      { breed: "Kamori", count: 50, targetAvgWeightKg: 45, healthStatus: "Show / Prime" }
    ],
    recentVaccinations: [
      { date: "2026-10-25", vaccine: "Enterotoxemia (ETV)", herdCovered: "840 Goats", nextDue: "2027-04-25" },
      { date: "2026-11-02", vaccine: "Foot and Mouth Disease (FMD)", herdCovered: "172 Buffaloes + 38 Cows", nextDue: "2027-05-02" }
    ],
    monthlyExpensesPKR: {
      fodderAndSilage: 780000,
      veterinaryMedicine: 145000,
      farmStaffWages: 320000,
      utilitiesAndSecurity: 95000
    }
  },

  // NHA Hassanabdal Toll Plaza Shift Collections (Representative Recent Week)
  tollOperations: {
    plazaName: "Hassanabdal Toll Plaza (N-35 Hazara Motorway Junction)",
    guaranteedMonthlyRevenuePKR: 13703000,
    dailyTargetPKR: 456766,
    recentDailyCollections: [
      { date: "2026-11-06", shift1: 154200, shift2: 189400, shift3: 132100, totalPKR: 475700, variancePKR: +18934, depositedBank: "BankIslami", challanNo: "CHL-99812" },
      { date: "2026-11-07", shift1: 162100, shift2: 198000, shift3: 141000, totalPKR: 501100, variancePKR: +44334, depositedBank: "BankIslami", challanNo: "CHL-99813" },
      { date: "2026-11-08", shift1: 171000, shift2: 210500, shift3: 149200, totalPKR: 530700, variancePKR: +73934, depositedBank: "BankIslami", challanNo: "CHL-99814" },
      { date: "2026-11-09", shift1: 148900, shift2: 176200, shift3: 128400, totalPKR: 453500, variancePKR: -3266, depositedBank: "BankIslami", challanNo: "CHL-99815" },
      { date: "2026-11-10", shift1: 151200, shift2: 182400, shift3: 130100, totalPKR: 463700, variancePKR: +6934, depositedBank: "BankIslami", challanNo: "CHL-99816" },
      { date: "2026-11-11", shift1: 153000, shift2: 184500, shift3: 131800, totalPKR: 469300, variancePKR: +12534, depositedBank: "BankIslami", challanNo: "CHL-99817" }
    ],
    nhaEscrowTransfersThisMonthPKR: 4000000
  },

  // Machinery & Equipment Fleet (Appendix D)
  machineryFleet: [
    { id: "MCH-01", name: "Concrete Mixer Machine (10/7 Cft)", qty: 2, condition: "Operational", assignedSite: "Mirpur Khas Smart Houses", ratePerHour: 800, wdvValuePKR: 650000, depRatePercent: 15 },
    { id: "MCH-02", name: "Concrete Vibrator with Needles", qty: 2, condition: "Operational", assignedSite: "Mirpur Khas Smart Houses", ratePerHour: 250, wdvValuePKR: 120000, depRatePercent: 15 },
    { id: "MCH-03", name: "HDPE Joint Heater / Electrofusion Machine", qty: 1, condition: "Operational", assignedSite: "Jafarabad Solar Sites", ratePerHour: 1200, wdvValuePKR: 950000, depRatePercent: 15 },
    { id: "MCH-04", name: "Excavator CAT 320D", qty: 1, condition: "Operational", assignedSite: "IHHN Incinerator Site", ratePerHour: 4500, wdvValuePKR: 7800000, depRatePercent: 15 },
    { id: "MCH-05", name: "Tractor with Front Blade & Trolley", qty: 2, condition: "Operational", assignedSite: "Khairpur Farm & Mirpur Khas", ratePerHour: 1500, wdvValuePKR: 3200000, depRatePercent: 15 },
    { id: "MCH-06", name: "Total Station Topcon & Auto Level", qty: 2, condition: "Operational", assignedSite: "Mirpur Khas / Badin", ratePerHour: 600, wdvValuePKR: 850000, depRatePercent: 15 },
    { id: "MCH-07", name: "Diesel Generator 30 kVA (Perkins)", qty: 2, condition: "Operational", assignedSite: "Mirpur Khas & Toll Plaza", ratePerHour: 1800, wdvValuePKR: 2100000, depRatePercent: 15 },
    { id: "MCH-08", name: "Steel Cutting & Bending Grinder Set", qty: 3, condition: "Operational", assignedSite: "Mirpur Khas Smart Houses", ratePerHour: 300, wdvValuePKR: 180000, depRatePercent: 15 }
  ],

  // Recent Financial Invoices & Tax Calculations (Module 4)
  invoices: [
    {
      id: "INV-2026-081",
      invoiceNo: "THAR/MAP/2026/03",
      projectId: "PRJ-01",
      projectName: "47 Resilient Smart Houses",
      clientOrg: "Muslim Aid Pakistan",
      milestone: "Batch-2 Plinth & Lintel Completion (19 Units)",
      grossAmountPKR: 11250000,
      retentionRatePercent: 10,
      retentionDeductedPKR: 1125000,
      taxRegime: "SRB (Sindh Revenue Board Tariff 54) + FBR WHT",
      fbrWhtPercent: 5.5,
      fbrWhtDeductedPKR: 618750,
      srbSstPercent: 13,
      srbWithheldByClientPKR: 365625, // 25% or 3% as per SRB withholding rules
      netPayablePKR: 9140625,
      submissionDate: "2026-10-20",
      status: "Verified & Paid",
      paidDate: "2026-11-05",
      creditedBank: "Askari Bank"
    },
    {
      id: "INV-2026-082",
      invoiceNo: "THAR/IHHN/2026/01",
      projectId: "PRJ-02",
      projectName: "Incinerator Complex Badin",
      clientOrg: "Indus Hospital & Health Network (IHHN)",
      milestone: "Mobilization Advance & Site Groundwork",
      grossAmountPKR: 6800000,
      retentionRatePercent: 5,
      retentionDeductedPKR: 340000,
      taxRegime: "IHHN Section VII GST Exempted + FBR WHT",
      gstExemptionCertAttached: true,
      fbrWhtPercent: 5.5,
      fbrWhtDeductedPKR: 374000,
      netPayablePKR: 6086000,
      submissionDate: "2026-11-01",
      status: "Under Client Processing (14-Day Cycle)",
      duePaymentDate: "2026-11-15",
      creditedBank: "Askari Bank"
    }
  ],

  // Defects Liability & Retention Money Register (Section 3.4.2)
  retentionVault: [
    {
      id: "RET-01",
      projectId: "PRJ-01",
      projectName: "47 Smart Houses (Muslim Aid)",
      retentionAmountPKR: 5398279,
      dlpPeriodDays: 90,
      dlpStartDate: "2027-02-28",
      dlpMaturityDate: "2027-05-29",
      bankHeld: "Client Retention Escrow",
      status: "Accumulating (Current: PKR 3,670,000)"
    },
    {
      id: "RET-02",
      projectId: "PRJ-02",
      projectName: "IHHN Incinerator Complex",
      retentionAmountPKR: 3400000,
      dlpPeriodDays: 365,
      dlpStartDate: "2027-04-30",
      dlpMaturityDate: "2028-04-30",
      bankHeld: "Indus Hospital Escrow / 10% Banker's Cheque",
      status: "Active (Current: PKR 340,000)"
    },
    {
      id: "RET-03",
      projectName: "Save the Children Model School (Past Contract)",
      retentionAmountPKR: 4250000,
      dlpPeriodDays: 120,
      dlpMaturityDate: "2026-12-10",
      bankHeld: "Save the Children Account",
      status: "Due for Release in 28 Days"
    }
  ]
};

