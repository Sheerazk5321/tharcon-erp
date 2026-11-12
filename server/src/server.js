import express from 'express';
import cors from 'cors';
import { mockData } from './seed/mockData.js';
import { calculateInvoiceTaxes } from './services/taxEngine.js';
import { validatePecEligibility } from './services/pecValidator.js';
import { calculatePenaltyRisk, verifySiteGeofence } from './services/penaltyRadar.js';
import { generateAuditedFinancialStatements } from './services/auditService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store initialized from seed
let state = JSON.parse(JSON.stringify(mockData));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'Tharcon Enterprise Resource Planning & Project Management System',
    pecLicence: state.company.pecLicense,
    entities: [state.company.legalName, state.company.privateEntity]
  });
});

// Company Info
app.get('/api/company', (req, res) => {
  res.json(state.company);
});

// Users / Staff / Roles
app.get('/api/users', (req, res) => {
  res.json(state.users);
});

// MODULE 1: Tenders & Bidding Pipeline
app.get('/api/tenders', (req, res) => {
  res.json(state.tenders);
});

app.post('/api/tenders', (req, res) => {
  const newTender = {
    id: `TND-${new Date().getFullYear()}-${String(state.tenders.length + 1).padStart(2, '0')}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  state.tenders.unshift(newTender);
  res.status(201).json(newTender);
});

// Validate PEC Eligibility for a Tender
app.post('/api/tenders/validate-pec', (req, res) => {
  const { estimatedValuePKR, requiredCodes } = req.body;
  const evaluation = validatePecEligibility(estimatedValuePKR, requiredCodes);
  res.json(evaluation);
});

// Simulated OCR parser for Tender Documents / BOQs
app.post('/api/tenders/parse-ocr', (req, res) => {
  const { fileName } = req.body;
  res.json({
    success: true,
    fileName: fileName || 'Uploaded_BOQ_Tender.pdf',
    confidenceScore: 0.985,
    extractedData: {
      issuingAgency: "Indus Hospital & Health Network (IHHN)",
      tenderRef: "IHHN/CW/INC-YR/2026/91",
      estimatedValuePKR: 68000000,
      completionDays: 180,
      cdrPercent: 3,
      liquidatedDamagesRate: "0.1% per day up to 10% maximum cap",
      extractedItemsCount: 142,
      sampleBOQLines: [
        { code: "CIV-01", description: "Excavation in all types of soil for foundations", qty: 4500, uom: "Cft", estRatePKR: 45 },
        { code: "CIV-02", description: "Plain cement concrete (1:4:8) in foundation", qty: 1200, uom: "Cft", estRatePKR: 290 },
        { code: "CIV-03", description: "Reinforced cement concrete (1:2:4) in lintel and slab", qty: 3800, uom: "Cft", estRatePKR: 480 },
        { code: "MEP-01", description: "Heavy Duty High-Temperature Incinerator Chimney", qty: 1, uom: "Job", estRatePKR: 18500000 }
      ]
    }
  });
});

// MODULE 2: Projects, WBS & Field Execution
app.get('/api/projects', (req, res) => {
  // Augment projects with real-time penalty risk calculation
  const augmented = state.projects.map(p => {
    const penaltyEval = calculatePenaltyRisk({
      totalValuePKR: p.totalValuePKR,
      targetEndDate: p.targetEndDate,
      currentProgressPercent: p.currentProgressPercent,
      dailyPenaltyRate: p.liquidatedDamagesRatePerDay || 0.001,
      maxCapPercent: p.liquidatedDamagesMaxCapPercent || 10
    });
    return { ...p, penaltyRisk: penaltyEval };
  });
  res.json(augmented);
});

app.get('/api/projects/:id', (req, res) => {
  const project = state.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const penaltyEval = calculatePenaltyRisk({
    totalValuePKR: project.totalValuePKR,
    targetEndDate: project.targetEndDate,
    currentProgressPercent: project.currentProgressPercent
  });
  res.json({ ...project, penaltyRisk: penaltyEval });
});

// Beneficiary Household Units for Housing/Water/General Supply Projects
app.get('/api/projects/:id/units', (req, res) => {
  const units = state.beneficiaryUnits.filter(u => u.projectId === req.params.id);
  res.json(units);
});

// DPR Submission with Geofence Verification
app.post('/api/dpr/submit', (req, res) => {
  const { projectId, engineerCoords, siteCoords, dprDetails } = req.body;
  const project = state.projects.find(p => p.id === projectId);
  const targetSiteCoords = siteCoords || (project?.location?.gpsCenter);

  const geofenceResult = verifySiteGeofence(targetSiteCoords, engineerCoords, 500);

  if (!geofenceResult.isWithinSite) {
    return res.status(400).json({
      success: false,
      error: `Geofence violation: Site Engineer must be within 500 meters of the site. Current distance: ${geofenceResult.distanceMeters}m.`,
      geofence: geofenceResult
    });
  }

  const dprEntry = {
    id: `DPR-${Date.now()}`,
    projectId,
    projectName: project?.name,
    timestamp: new Date().toISOString(),
    geofenceVerified: true,
    distanceMeters: geofenceResult.distanceMeters,
    ...dprDetails,
    status: 'Submitted / Awaiting PM Sign-off'
  };

  res.status(201).json({
    success: true,
    message: 'DPR successfully verified and logged with GPS geostamp.',
    dpr: dprEntry
  });
});

// MODULE 3: Supply Chain & Specialized Operations
// Livestock Farm
app.get('/api/specialized/livestock', (req, res) => {
  res.json(state.livestockFarm);
});

// NHA Toll Plaza Operations
app.get('/api/specialized/toll-plaza', (req, res) => {
  res.json(state.tollOperations);
});

app.post('/api/specialized/toll-plaza/daily-collection', (req, res) => {
  const { date, shift1, shift2, shift3, depositedBank, challanNo } = req.body;
  const totalPKR = (Number(shift1) || 0) + (Number(shift2) || 0) + (Number(shift3) || 0);
  const variancePKR = totalPKR - state.tollOperations.dailyTargetPKR;

  const entry = {
    date: date || new Date().toISOString().split('T')[0],
    shift1: Number(shift1),
    shift2: Number(shift2),
    shift3: Number(shift3),
    totalPKR,
    variancePKR,
    depositedBank: depositedBank || "BankIslami",
    challanNo: challanNo || `CHL-${Date.now().toString().slice(-5)}`
  };

  state.tollOperations.recentDailyCollections.unshift(entry);
  res.status(201).json({ success: true, entry });
});

// WHO Long-Term Agreement Fixed Catalog Guard
app.get('/api/specialized/who-lta', (req, res) => {
  const ltaCatalog = [
    { itemCode: "WHO-01", description: "Submersible Pump 2HP Komax with Italian Motor", contractPricePKR: 145000, brand: "Komax" },
    { itemCode: "WHO-02", description: "Deep Cycle Solar Battery 200Ah 12V", contractPricePKR: 62000, brand: "Osaka / Phoenix" },
    { itemCode: "WHO-03", description: "Mono Crystalline Solar PV Panel 550W Tier-1", contractPricePKR: 38500, brand: "JA Solar / Longi" },
    { itemCode: "WHO-04", description: "HDPE Pipe 3-Inch PN-10 High Density Coil (100m)", contractPricePKR: 74000, brand: "Popular / BBJ" },
    { itemCode: "WHO-05", description: "Commercial Water Filtration Reverse Osmosis Membrane", contractPricePKR: 28000, brand: "Dow Filmtec" }
  ];
  res.json({
    agreementRef: "LTA/WCO/PAK/2026/027",
    client: "World Health Organization",
    validity: "18 Feb 2026 to 17 Jan 2027",
    catalog: ltaCatalog,
    priceGuardClause: "Mandatory price reduction rule active: Quoting lower to any client triggers auto-rebate."
  });
});

// 24-Hour Logistics Advance Notice Generator (Module 3.3.2)
app.post('/api/supply-chain/generate-dispatch-notice', (req, res) => {
  const { projectId, driverName, driverPhone, truckRegNo, arrivalDate, items } = req.body;
  const project = state.projects.find(p => p.id === projectId);

  const notice = {
    noticeId: `ADV-DISP-${Date.now()}`,
    timestamp: new Date().toISOString(),
    projectRef: project?.contractRef,
    clientOrg: project?.clientOrg,
    driverName: driverName || "Mohammad Ishaq",
    driverPhone: driverPhone || "+92 312 9087654",
    truckRegNo: truckRegNo || "TL-8491 (Bedford 10-Wheeler)",
    scheduledArrival: arrivalDate || new Date(Date.now() + 86400000).toISOString(),
    complianceRule4PM: "Mandatory: Consignment must arrive before 4:00 PM for daylight joint inspection.",
    materialsManifest: items || [
      { item: "Ordinary Portland Cement (Lucky/Falcon)", qty: "400 Bags" },
      { item: "Deformed Steel Rebar 60-Grade (Mughal/Amreli)", qty: "8.5 Metric Tons" }
    ],
    status: "Transmitted via SMS/WhatsApp to Client Logistics Focal Person"
  };

  res.json({ success: true, dispatchNotice: notice });
});

// MODULE 4: Financial Management, Pakistani Tax & Syed & Co. CA Statements
app.get('/api/finance/invoices', (req, res) => {
  res.json(state.invoices);
});

// Calculate Multi-Provincial Tax Splits
app.post('/api/finance/calculate-tax', (req, res) => {
  const calculation = calculateInvoiceTaxes(req.body);
  res.json(calculation);
});

// Retention Money & DLP Vault
app.get('/api/finance/retention-vault', (req, res) => {
  res.json(state.retentionVault);
});

// Syed & Co. Chartered Accountants Audited Financial Statements
app.get('/api/finance/audited-statements', (req, res) => {
  const statements = generateAuditedFinancialStatements(state);
  res.json(statements);
});

// MODULE 5: Machinery & Equipment
app.get('/api/machinery', (req, res) => {
  res.json(state.machineryFleet);
});

// MODULE 6: Workforce, HR & Labour Muster Roll
app.get('/api/workforce', (req, res) => {
  res.json(state.users);
});

app.post('/api/workforce/muster-roll', (req, res) => {
  const { projectId, date, musterLines, submittedBy } = req.body;
  const totalLabourHeadcount = (musterLines || []).reduce((sum, line) => sum + (Number(line.count) || 0), 0);
  const totalDailyWageBillPKR = (musterLines || []).reduce((sum, line) => sum + ((Number(line.count) || 0) * (Number(line.rate) || 0)), 0);

  res.status(201).json({
    success: true,
    musterRollId: `MSTR-${Date.now()}`,
    projectId,
    date: date || new Date().toISOString().split('T')[0],
    totalLabourHeadcount,
    totalDailyWageBillPKR,
    submittedBy: submittedBy || "Waseem Ahmed",
    status: "Logged & Posted to Contract Working Account"
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 Tharcon-ERP Backend API Server running on port ${PORT}`);
  console.log(`🏢 M/S Tharcon Engineers & Contractors (PEC C3/7901, NTN 1863422-2)`);
  console.log(`================================================================`);
});
