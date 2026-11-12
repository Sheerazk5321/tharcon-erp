/**
 * Clean Baseline Data for Tharcon-ERP
 * M/S Tharcon Engineers & Contractors & Tharcon (Private) Limited
 * Empty Operational State: Ready for real production data
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
    bankAccounts: []
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
    }
  ],

  tenders: [],
  projects: [],
  beneficiaryUnits: [],

  livestockFarm: {
    facilityName: "Tharcon LBSA Breeding & Supply Facility",
    location: "Village AdhoBhar, Khairpur Mir's (21,000 sq. ft.)",
    registrationNo: "KHP/G-III/5-145/2026",
    manager: "Farm Manager (LBSA Certified)",
    capacity: {
      buffaloes: 200,
      goats: 900,
      cows: 50
    },
    currentStock: {
      buffaloes: 0,
      goats: 0,
      cows: 0
    },
    goatBreedsBreakdown: [],
    recentVaccinations: [],
    monthlyExpensesPKR: {
      fodderAndSilage: 0,
      veterinaryMedicine: 0,
      farmStaffWages: 0,
      utilitiesAndSecurity: 0
    }
  },

  tollOperations: {
    plazaName: "Hassanabdal Toll Plaza (N-35 Hazara Motorway Junction)",
    guaranteedMonthlyRevenuePKR: 13703000,
    dailyTargetPKR: 456766,
    recentDailyCollections: [],
    nhaEscrowTransfersThisMonthPKR: 0
  },

  machineryFleet: [],
  invoices: [],
  retentionVault: []
};
