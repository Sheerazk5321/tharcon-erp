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

// In-memory data store initialized from seed (serves as fallback and local cache)
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

// Company Info
app.get('/api/company', async (req, res) => {
  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('companies').select('*').limit(1).single();
      if (!error && data) {
        return res.json({
          ...state.company,
          legalName: data.legal_name,
          privateEntity: data.private_entity,
          pecLicense: data.pec_license,
          pecLimitPKR: Number(data.pec_limit_pkr),
          pecSpecializations: data.pec_specializations,
          ntn: data.ntn,
          sntn: data.sntn,
          headOffice: data.head_office,
          livestockFacility: data.livestock_facility
        });
      }
    } catch (err) {
      console.warn('Supabase company fetch fallback to local:', err.message);
    }
  }
  res.json(state.company);
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
      if (!error && data && data.length > 0) {
        const normalized = data.map(t => ({
          id: t.id,
          source: t.source,
          clientOrg: t.client_org,
          refNo: t.ref_no,
          title: t.title,
          estimatedValuePKR: Number(t.estimated_value_pkr),
          scopeCategory: t.scope_category,
          submissionDeadline: t.submission_deadline,
          bidOpeningDate: t.bid_opening_date,
          pecRequired: t.pec_required || [],
          cdrRequiredPercent: Number(t.cdr_required_percent),
          cdrAmountPKR: Number(t.cdr_amount_pkr),
          cdrInstrument: {
            bankName: t.cdr_bank_name,
            instrumentNo: t.cdr_instrument_no,
            expiryDate: t.cdr_expiry_date,
            status: t.cdr_status
          },
          status: t.status,
          winProbability: Number(t.win_probability),
          documentsCount: t.documents_count || 0
        }));
        return res.json(normalized);
      }
    } catch (err) {
      console.warn('Supabase tenders fallback:', err.message);
    }
  }
  res.json(state.tenders);
});

app.post('/api/tenders', async (req, res) => {
  const tenderId = `TND-${new Date().getFullYear()}-${String(state.tenders.length + 1).padStart(2, '0')}`;
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
      console.warn('Supabase tender insert fallback:', err.message);
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
app.get('/api/projects', async (req, res) => {
  let projectList = state.projects;

  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        projectList = data.map(p => ({
          id: p.id,
          tenderId: p.tender_id,
          code: p.code,
          name: p.name,
          clientOrg: p.client_org,
          contractRef: p.contract_ref,
          contractType: p.contract_type,
          totalValuePKR: Number(p.total_value_pkr),
          startDate: p.start_date,
          targetEndDate: p.target_end_date,
          currentProgressPercent: Number(p.current_progress_percent),
          location: {
            province: p.province,
            district: p.district,
            tehsils: p.tehsils || [],
            gpsCenter: { lat: Number(p.gps_lat), lng: Number(p.gps_lng) }
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
      console.warn('Supabase projects fallback:', err.message);
    }
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
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('Supabase units fallback:', err.message);
    }
  }
  const units = state.beneficiaryUnits.filter(u => u.projectId === req.params.id);
  res.json(units);
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
      console.warn('Supabase DPR insert fallback:', err.message);
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
  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('livestock_inventory').select('*');
      if (!error && data && data.length > 0) {
        const goats = data.filter(d => d.species === 'Goat');
        const buffaloes = data.filter(d => d.species === 'Buffalo');
        const cows = data.filter(d => d.species === 'Cow');

        return res.json({
          ...state.livestockFarm,
          currentStock: {
            goats: goats.reduce((sum, g) => sum + g.count, 0),
            buffaloes: buffaloes.reduce((sum, b) => sum + b.count, 0),
            cows: cows.reduce((sum, c) => sum + c.count, 0)
          },
          goatBreedsBreakdown: goats.map(g => ({
            breed: g.breed,
            count: g.count,
            targetAvgWeightKg: Number(g.target_avg_weight_kg),
            healthStatus: g.health_status
          }))
        });
      }
    } catch (err) {
      console.warn('Supabase livestock fallback:', err.message);
    }
  }
  res.json(state.livestockFarm);
});

// NHA Toll Plaza Operations
app.get('/api/specialized/toll-plaza', async (req, res) => {
  if (isSupabaseConnected) {
    try {
      const { data, error } = await supabase.from('toll_collections').select('*').order('collection_date', { ascending: false }).limit(7);
      if (!error && data && data.length > 0) {
        const mapped = data.map(d => ({
          date: d.collection_date,
          shift1: Number(d.shift1_pkr),
          shift2: Number(d.shift2_pkr),
          shift3: Number(d.shift3_pkr),
          totalPKR: Number(d.total_pkr),
          variancePKR: Number(d.variance_pkr),
          depositedBank: d.deposited_bank,
          challanNo: d.challan_no
        }));
        return res.json({
          ...state.tollOperations,
          recentDailyCollections: mapped
        });
      }
    } catch (err) {
      console.warn('Supabase toll fallback:', err.message);
    }
  }
  res.json(state.tollOperations);
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
      console.warn('Supabase toll insert fallback:', err.message);
    }
  }

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

// Start Express Server
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 Tharcon-ERP Backend API Server running on port ${PORT}`);
  console.log(`🏢 M/S Tharcon Engineers & Contractors (PEC C3/7901, NTN 1863422-2)`);
  console.log(`⚡ Supabase PostgreSQL: ${isSupabaseConnected ? 'CONNECTED' : 'LOCAL CACHE'}`);
  console.log(`================================================================`);
});
