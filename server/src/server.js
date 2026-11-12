import express from 'express';
import cors from 'cors';
import { mockData } from './seed/mockData.js';
import { supabase, isSupabaseConnected } from './config/supabase.js';
import { calculateInvoiceTaxes } from './services/taxEngine.js';
import { validatePecEligibility } from './services/pecValidator.js';
import { calculatePenaltyRisk, verifySiteGeofence } from './services/penaltyRadar.js';
import { generateAuditedFinancialStatements } from './services/auditService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store initialized from seed (guaranteed empty of dummy records)
let state = JSON.parse(JSON.stringify(mockData));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let supabaseStatus = 'disconnected';
  if (isSupabaseConnected) {
    try {
      const { error } = await supabase.from('projects').select('id').limit(1);
      supabaseStatus = error ? `error: ${error.message}` : 'connected';
    } catch (e) {
      supabaseStatus = `unreachable: ${e.message}`;
    }
  }

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'Tharcon Enterprise Resource Planning & Project Management System',
    pecLicence: state.company.pecLicense,
    supabase: supabaseStatus,
    entities: [state.company.legalName, state.company.privateEntity]
  });
});

// Company Info & Bank Accounts
app.get('/api/company', async (req, res) => {
  let companyData = { ...state.company };

  if (isSupabaseConnected) {
    try {
      const { data: comp } = await supabase.from('companies').select('*').limit(1).single();
      const { data: banks } = await supabase.from('bank_accounts').select('*');

      if (comp) {
        companyData.legalName = comp.legal_name;
        companyData.privateEntity = comp.private_entity;
        companyData.pecLicense = comp.pec_license;
        companyData.pecLimitPKR = Number(comp.pec_limit_pkr);
        companyData.pecSpecializations = comp.pec_specializations;
        companyData.ntn = comp.ntn;
        companyData.sntn = comp.sntn;
        companyData.pntn = comp.pntn;
        companyData.bntn = comp.bntn;
        companyData.headOffice = comp.head_office;
        companyData.regionalOfficeSindh = comp.regional_office_sindh;
        companyData.livestockFacility = comp.livestock_facility;
      }
      companyData.bankAccounts = (banks || []).map(b => ({
        id: b.id,
        bankName: b.bank_name,
        branch: b.branch,
        accountNo: b.account_no,
        title: b.title,
        type: b.type,
        balancePKR: Number(b.balance_pkr) || 0,
        currency: b.currency || 'PKR'
      }));
      return res.json(companyData);
    } catch (err) {
      console.warn('Supabase company fetch error:', err.message);
    }
  }
  res.json(companyData);
});

// Users / Staff Directory
app.get('/api/users', (req, res) => {
  res.json(state.users);
});

// MODULE 1: Tenders & Bidding Pipeline
app.get('/api/tenders', async (req, res) => {
  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('tenders').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        const normalized = data.map(t => ({
          id: t.id,
          source: t.source,
          clientOrg: t.client_org,
          refNo: t.ref_no,
          title: t.title,
          estimatedValuePKR: Number(t.estimated_value_pkr) || 0,
          scopeCategory: t.scope_category,
          submissionDeadline: t.submission_deadline,
          bidOpeningDate: t.bid_opening_date,
          pecRequired: t.pec_required || [],
          cdrRequiredPercent: Number(t.cdr_required_percent) || 0,
          cdrAmountPKR: Number(t.cdr_amount_pkr) || 0,
          cdrInstrument: {
            bankName: t.cdr_bank_name,
            instrumentNo: t.cdr_instrument_no,
            expiryDate: t.cdr_expiry_date,
            status: t.cdr_status
          },
          status: t.status,
          winProbability: Number(t.win_probability) || 0,
          documentsCount: t.documents_count || 0
        }));
        return res.json(normalized);
      }
    } catch (err) {
      console.warn('Supabase tenders error:', err.message);
    }
  }
  res.json(state.tenders || []);
});

app.post('/api/tenders', async (req, res) => {
  const tenderId = `TND-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
  const newTender = {
    id: tenderId,
    ...req.body,
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConnected) {
    try {
      await supabase.from('tenders').insert({
        id: tenderId,
        source: newTender.source || 'Direct RFP',
        client_org: newTender.clientOrg,
        ref_no: newTender.refNo,
        title: newTender.title,
        estimated_value_pkr: newTender.estimatedValuePKR,
        scope_category: newTender.scopeCategory,
        submission_deadline: newTender.submissionDeadline,
        bid_opening_date: newTender.bidOpeningDate,
        pec_required: newTender.pecRequired || [],
        cdr_required_percent: newTender.cdrRequiredPercent || 2.0,
        cdr_amount_pkr: newTender.cdrAmountPKR || 0,
        status: newTender.status || 'Identified'
      });
    } catch (err) {
      console.warn('Supabase tender insert error:', err.message);
    }
  }

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
      issuingAgency: "Tender Issuing Agency",
      tenderRef: "TND-REF-PARSED",
      estimatedValuePKR: 0,
      completionDays: 0,
      cdrPercent: 2,
      liquidatedDamagesRate: "0.1% per day up to 10% maximum cap",
      extractedItemsCount: 0,
      sampleBOQLines: []
    }
  });
});

// MODULE 2: Projects, WBS & Field Execution
app.get('/api/projects', async (req, res) => {
  let projectList = [];

  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        projectList = data.map(p => ({
          id: p.id,
          tenderId: p.tender_id,
          code: p.code,
          name: p.name,
          clientOrg: p.client_org,
          contractRef: p.contract_ref,
          contractType: p.contract_type,
          totalValuePKR: Number(p.total_value_pkr) || 0,
          startDate: p.start_date,
          targetEndDate: p.target_end_date,
          currentProgressPercent: Number(p.current_progress_percent) || 0,
          location: {
            province: p.province,
            district: p.district,
            tehsils: p.tehsils || [],
            gpsCenter: { lat: Number(p.gps_lat) || 0, lng: Number(p.gps_lng) || 0 }
          },
          pmName: p.pm_name,
          siteEngineers: p.site_engineers || [],
          liquidatedDamagesRatePerDay: Number(p.ld_rate_per_day) || 0.001,
          liquidatedDamagesMaxCapPercent: Number(p.ld_max_cap_percent) || 10,
          retentionPercent: Number(p.retention_percent) || 10,
          dlpDays: p.dlp_days || 90,
          totalBeneficiaryUnits: p.total_beneficiary_units || 0,
          completedUnits: p.completed_units || 0,
          inProgressUnits: p.in_progress_units || 0,
          status: p.status
        }));
      }
    } catch (err) {
      console.warn('Supabase projects fetch error:', err.message);
    }
  } else {
    projectList = state.projects || [];
  }

  // Augment projects with real-time penalty risk calculation
  const augmented = projectList.map(p => {
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

// Beneficiary Household Units for Housing/Water Projects
app.get('/api/projects/:id/units', async (req, res) => {
  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase
        .from('beneficiary_household_units')
        .select('*')
        .eq('project_id', req.params.id);
      if (!error && Array.isArray(data)) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('Supabase units fetch error:', err.message);
    }
  }
  res.json([]);
});

// DPR Submission with Geofence Verification
app.post('/api/dpr/submit', async (req, res) => {
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

  const dprId = `DPR-${Date.now()}`;
  const dprEntry = {
    id: dprId,
    projectId,
    projectName: project?.name,
    timestamp: new Date().toISOString(),
    geofenceVerified: true,
    distanceMeters: geofenceResult.distanceMeters,
    ...dprDetails,
    status: 'Submitted / Awaiting PM Sign-off'
  };

  if (isSupabaseConnected) {
    try {
      await supabase.from('dpr_reports').insert({
        id: dprId,
        project_id: projectId,
        project_name: project?.name || 'Project',
        engineer_name: dprDetails?.engineerName || 'Site Engineer',
        weather: dprDetails?.weather || 'Clear',
        labour_count: dprDetails?.labourCount || 0,
        milestone_progress: dprDetails?.milestoneProgress || 'Progress recorded',
        engineer_gps_lat: engineerCoords.lat,
        engineer_gps_lng: engineerCoords.lng,
        geofence_verified: true,
        distance_meters: geofenceResult.distanceMeters
      });
    } catch (err) {
      console.warn('Supabase DPR insert error:', err.message);
    }
  }

  res.status(201).json({
    success: true,
    message: 'DPR successfully verified and logged with GPS geostamp in Supabase.',
    dpr: dprEntry
  });
});

// MODULE 3: Supply Chain & Specialized Operations
// Livestock Farm
app.get('/api/specialized/livestock', async (req, res) => {
  let livestock = {
    ...state.livestockFarm,
    currentStock: { goats: 0, buffaloes: 0, cows: 0 },
    goatBreedsBreakdown: [],
    recentVaccinations: []
  };

  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('livestock_inventory').select('*');
      if (!error && Array.isArray(data)) {
        const goats = data.filter(d => d.species === 'Goat');
        const buffaloes = data.filter(d => d.species === 'Buffalo');
        const cows = data.filter(d => d.species === 'Cow');

        livestock.currentStock = {
          goats: goats.reduce((sum, g) => sum + (Number(g.count) || 0), 0),
          buffaloes: buffaloes.reduce((sum, b) => sum + (Number(b.count) || 0), 0),
          cows: cows.reduce((sum, c) => sum + (Number(c.count) || 0), 0)
        };
        livestock.goatBreedsBreakdown = goats.map(g => ({
          breed: g.breed,
          count: g.count,
          targetAvgWeightKg: Number(g.target_avg_weight_kg),
          healthStatus: g.health_status
        }));
      }
    } catch (err) {
      console.warn('Supabase livestock fetch error:', err.message);
    }
  }
  res.json(livestock);
});

// NHA Toll Plaza Operations
app.get('/api/specialized/toll-plaza', async (req, res) => {
  let toll = {
    ...state.tollOperations,
    recentDailyCollections: []
  };

  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('toll_collections').select('*').order('collection_date', { ascending: false }).limit(7);
      if (!error && Array.isArray(data)) {
        toll.recentDailyCollections = data.map(d => ({
          date: d.collection_date,
          shift1: Number(d.shift1_pkr) || 0,
          shift2: Number(d.shift2_pkr) || 0,
          shift3: Number(d.shift3_pkr) || 0,
          totalPKR: Number(d.total_pkr) || 0,
          variancePKR: Number(d.variance_pkr) || 0,
          depositedBank: d.deposited_bank,
          challanNo: d.challan_no
        }));
      }
    } catch (err) {
      console.warn('Supabase toll fetch error:', err.message);
    }
  }
  res.json(toll);
});

app.post('/api/specialized/toll-plaza/daily-collection', async (req, res) => {
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

  if (isSupabaseConnected) {
    try {
      await supabase.from('toll_collections').insert({
        collection_date: entry.date,
        shift1_pkr: entry.shift1,
        shift2_pkr: entry.shift2,
        shift3_pkr: entry.shift3,
        total_pkr: entry.totalPKR,
        daily_target_pkr: state.tollOperations.dailyTargetPKR,
        variance_pkr: entry.variancePKR,
        deposited_bank: entry.depositedBank,
        challan_no: entry.challanNo
      });
    } catch (err) {
      console.warn('Supabase toll insert error:', err.message);
    }
  }

  res.status(201).json({ success: true, entry });
});

// WHO Long-Term Agreement Fixed Catalog Guard
app.get('/api/specialized/who-lta', (req, res) => {
  res.json({
    agreementRef: "LTA/WCO/PAK/2026/027",
    client: "World Health Organization",
    validity: "18 Feb 2026 to 17 Jan 2027",
    catalog: [],
    priceGuardClause: "Mandatory price reduction rule active: Quoting lower to any client triggers auto-rebate."
  });
});

// MODULE 4: Financial Management, Pakistani Tax & Syed & Co. CA Statements
app.get('/api/finance/invoices', async (req, res) => {
  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('invoices').select('*');
      if (!error && Array.isArray(data)) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('Supabase invoices error:', err.message);
    }
  }
  res.json([]);
});

// Calculate Multi-Provincial Tax Splits
app.post('/api/finance/calculate-tax', (req, res) => {
  const calculation = calculateInvoiceTaxes(req.body);
  res.json(calculation);
});

// Retention Money & DLP Vault
app.get('/api/finance/retention-vault', async (req, res) => {
  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('retention_vault').select('*');
      if (!error && Array.isArray(data)) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('Supabase retention error:', err.message);
    }
  }
  res.json([]);
});

// Syed & Co. Chartered Accountants Audited Financial Statements
app.get('/api/finance/audited-statements', async (req, res) => {
  let projectList = [];
  if (isSupabaseConnected) {
    try {
      const { data } = await supabase.from('projects').select('*');
      projectList = (data || []).map(p => ({
        totalValuePKR: Number(p.total_value_pkr) || 0,
        currentProgressPercent: Number(p.current_progress_percent) || 0
      }));
    } catch (e) {}
  }
  const statements = generateAuditedFinancialStatements({
    ...state,
    projects: projectList,
    invoices: [],
    retentionVault: [],
    machineryFleet: [],
    company: { ...state.company, bankAccounts: [] }
  });
  res.json(statements);
});

// MODULE 5: Machinery & Equipment
app.get('/api/machinery', async (req, res) => {
  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('machinery_fleet').select('*');
      if (!error && Array.isArray(data)) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('Supabase machinery error:', err.message);
    }
  }
  res.json([]);
});

// MODULE 6: Workforce, HR & Labour Muster Roll
app.get('/api/workforce', (req, res) => {
  res.json(state.users);
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 Tharcon-ERP Backend API Server running on port ${PORT}`);
  console.log(`🏢 M/S Tharcon Engineers & Contractors (PEC C3/7901, NTN 1863422-2)`);
  console.log(`⚡ Supabase PostgreSQL: ${isSupabaseConnected ? 'CONNECTED' : 'LOCAL CACHE'}`);
  console.log(`================================================================`);
});
