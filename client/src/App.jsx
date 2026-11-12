import React, { useState, useEffect } from 'react';
import {
  Building2,
  HardHat,
  FileText,
  DollarSign,
  Truck,
  Wrench,
  Users,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Camera,
  Download,
  Plus,
  RefreshCw,
  Search,
  Check,
  Percent,
  TrendingUp,
  FileCheck,
  ChevronRight,
  Compass,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState('executive');
  const [activeRole, setActiveRole] = useState('CEO / Executive');
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Module 1: PEC Validator Form State
  const [pecTenderValue, setPecTenderValue] = useState(68000000);
  const [pecCodes, setPecCodes] = useState(['CE01', 'CE10', 'EE11(iii)']);
  const [pecResult, setPecResult] = useState(null);

  // Module 4: Tax Calculator Form State
  const [taxGross, setTaxGross] = useState(10000000);
  const [taxProvince, setTaxProvince] = useState('Sindh');
  const [taxScope, setTaxScope] = useState('Civil Works');
  const [taxRetention, setTaxRetention] = useState(10);
  const [taxMobAdvance, setTaxMobAdvance] = useState(0);
  const [taxExempt, setTaxExempt] = useState(false);
  const [taxLaborPortion, setTaxLaborPortion] = useState(100);
  const [taxCalcResult, setTaxCalcResult] = useState(null);

  // Module 2: Field DPR Geofence Test State
  const [engineerLat, setEngineerLat] = useState(25.5281);
  const [engineerLng, setEngineerLng] = useState(69.0131);
  const [dprStatus, setDprStatus] = useState(null);

  // Module 3: Toll Plaza Collection State
  const [tollShift1, setTollShift1] = useState(155000);
  const [tollShift2, setTollShift2] = useState(192000);
  const [tollShift3, setTollShift3] = useState(134000);
  const [tollStatusMsg, setTollStatusMsg] = useState(null);

  // Fetch initial data from local API
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(projects => {
        return Promise.all([
          fetch('/api/company').then(r => r.json()),
          fetch('/api/tenders').then(r => r.json()),
          fetch('/api/specialized/livestock').then(r => r.json()),
          fetch('/api/specialized/toll-plaza').then(r => r.json()),
          fetch('/api/finance/audited-statements').then(r => r.json()),
          fetch('/api/machinery').then(r => r.json()),
          fetch('/api/users').then(r => r.json())
        ]).then(([company, tenders, livestock, toll, audited, machinery, users]) => {
          setSystemData({
            company,
            tenders,
            projects,
            livestock,
            toll,
            audited,
            machinery,
            users
          });
          setLoading(false);
        });
      })
      .catch(err => {
        console.warn('API fetch error, using local fallback state:', err);
        setLoading(false);
      });
  }, []);

  // Run initial calculations
  useEffect(() => {
    calculatePec();
    calculateTax();
  }, []);

  const calculatePec = () => {
    fetch('/api/tenders/validate-pec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estimatedValuePKR: pecTenderValue, requiredCodes: pecCodes })
    })
      .then(r => r.json())
      .then(data => setPecResult(data))
      .catch(() => {
        // Local calculation fallback
        const limit = 500000000;
        const validCodes = ["CE01", "CE04", "CE09", "CE10", "EE04", "EE06", "EE11(iii)", "ME01"];
        const missing = pecCodes.filter(c => !validCodes.includes(c));
        setPecResult({
          isFullyEligible: pecTenderValue <= limit && missing.length === 0,
          isWithinFinancialLimit: pecTenderValue <= limit,
          financialLimitPKR: limit,
          headroomPKR: limit - pecTenderValue,
          missingCodes: missing,
          pecLicenseNo: "7901 (C3)"
        });
      });
  };

  const calculateTax = () => {
    fetch('/api/finance/calculate-tax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grossAmount: taxGross,
        province: taxProvince,
        scopeCategory: taxScope,
        retentionPercent: taxRetention,
        mobilizationAdjustmentPercent: taxMobAdvance,
        isClientGstExempt: taxExempt,
        laborPortionPercent: taxLaborPortion
      })
    })
      .then(r => r.json())
        .then(data => setTaxCalcResult(data))
        .catch(() => {
          // Local calculation fallback
          const retention = (taxGross * taxRetention) / 100;
          const wht = (taxGross * 5.5) / 100;
          const srbWithheld = taxExempt ? 0 : (taxGross * 3) / 100;
          const net = taxGross - retention - wht - srbWithheld;
          setTaxCalcResult({
            grossAmount: taxGross,
            retentionDeduction: retention,
            fbrWht: { ratePercent: 5.5, amount: wht },
            provincialSalesTax: { authority: taxProvince === 'Sindh' ? 'SRB' : 'PRA', statutoryRatePercent: 13, withheldByClient: srbWithheld },
            netReceivable: net
          });
        });
  };

  const submitTestDPR = () => {
    fetch('/api/dpr/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'PRJ-01',
        engineerCoords: { lat: engineerLat, lng: engineerLng },
        siteCoords: { lat: 25.5276, lng: 69.0125 },
        dprDetails: {
          weather: 'Clear / 32°C',
          labourCount: 24,
          milestoneProgress: 'Plinth Complete, 12 Lintel columns casted'
        }
      })
    })
      .then(r => r.json())
        .then(res => {
          setDprStatus(res);
        })
        .catch(err => {
          setDprStatus({ success: false, error: err.message });
        });
  };

  const submitTollEntry = () => {
    fetch('/api/specialized/toll-plaza/daily-collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shift1: tollShift1,
        shift2: tollShift2,
        shift3: tollShift3,
        depositedBank: 'BankIslami',
        challanNo: `CHL-${Date.now().toString().slice(-5)}`
      })
    })
      .then(r => r.json())
        .then(res => {
          setTollStatusMsg(`Successfully recorded PKR ${(Number(tollShift1)+Number(tollShift2)+Number(tollShift3)).toLocaleString()} into BankIslami NHA Escrow Account.`);
        });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      {/* TOP CORPORATE BAR */}
      <header className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white border-b border-teal-800/40 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Entity Details */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-900/50">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-wider text-lg text-white">THARCON-ERP</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded font-mono font-medium">
                  PEC C3/7901
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono">
                  NTN 1863422-2
                </span>
              </div>
              <div className="text-xs text-slate-400">
                M/S Tharcon Engineers & Contractors • Tharcon (Private) Limited
              </div>
            </div>
          </div>

          {/* Bank Accounts Ticker */}
          <div className="hidden lg:flex items-center space-x-4 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs">
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-slate-400">Askari Bank (Ops):</span>
              <span className="font-mono font-semibold text-emerald-300">PKR 18.45M</span>
            </div>
            <div className="h-3 w-px bg-slate-700"></div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <span className="text-slate-400">BankIslami (Toll/Escrow):</span>
              <span className="font-mono font-semibold text-cyan-300">PKR 9.23M</span>
            </div>
          </div>

          {/* Live Persona / Role Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Active Role:</span>
            <select
              value={activeRole}
              onChange={e => setActiveRole(e.target.value)}
              className="bg-slate-800 text-teal-300 border border-teal-700/50 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              <option value="CEO / Executive">CEO / Executive (Engr. Mujeeb ur Rehman)</option>
              <option value="Project Manager">Project Manager (Engr. Masroor Ahmed)</option>
              <option value="Site Engineer">Site Engineer (Waseem Ahmed - Mobile DPR)</option>
              <option value="Finance & Accounts">Finance Manager (Syed & Co. CA Liaison)</option>
              <option value="Tender / Estimator">Tender / Estimator (Engr. Wardha Batool)</option>
              <option value="System Administrator">System Admin (Sheeraz Ali)</option>
            </select>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 overflow-x-auto text-xs font-medium scrollbar-none border-t border-slate-800/80 pt-1">
          {[
            { id: 'executive', label: 'Executive KPI Radar', icon: TrendingUp },
            { id: 'tenders', label: 'Tenders & Bidding (M1)', icon: FileText },
            { id: 'execution', label: 'Multi-Site Execution (M2)', icon: HardHat },
            { id: 'supply', label: 'Supply Chain & Logistics (M3)', icon: Truck },
            { id: 'specialized', label: 'Specialized Verticals', icon: Compass },
            { id: 'finance', label: 'Finance & Pakistani Tax (M4)', icon: DollarSign },
            { id: 'assets', label: 'Machinery & Assets (M5)', icon: Wrench },
            { id: 'workforce', label: 'Workforce & Labour (M6)', icon: Users },
            { id: 'closeout', label: 'Handover & Closeout (M7)', icon: ShieldCheck },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-teal-400 text-teal-300 font-bold bg-teal-950/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* 1. EXECUTIVE RADAR TAB */}
        {activeTab === 'executive' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Executive Performance & Enterprise Radar</h1>
                <p className="text-xs text-slate-500">
                  Real-time operational summary across Islamabad, Hyderabad, Kotri, Khairpur Farm, and all field sites
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1 rounded font-medium flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> All Systems Online
                </span>
                <span className="text-slate-400">Sync: Just now</span>
              </div>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Contract Portfolio</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">PKR 323.0M</div>
                  </div>
                  <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500 flex items-center">
                  <span className="text-teal-600 font-semibold mr-1">5 Major Contracts</span> across 4 Provinces
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tender Pipeline (Pre-Bid)</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">PKR 110.5M</div>
                  </div>
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500 flex items-center">
                  <span className="text-blue-600 font-semibold mr-1">2 Bids Under Eval</span> (IHHN, Save the Children)
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Liquid Cash Balances</div>
                    <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">PKR 27.68M</div>
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Askari: 18.45M • BankIslami: 9.23M
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Retention Money Vault</div>
                    <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">PKR 13.04M</div>
                  </div>
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  <span className="text-amber-700 font-medium">4.25M Due in 28 Days</span> (Save Children)
                </div>
              </div>
            </div>

            {/* Active Projects Quick Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold text-slate-900 text-sm">Active Project Portfolio & Liquidated Damages Radar</h2>
                <span className="text-xs text-slate-500">Updated from Field DPRs</span>
              </div>
              <div className="divide-y divide-slate-200">
                {(systemData?.projects || []).map(prj => (
                  <div key={prj.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{prj.name}</span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-slate-600">
                            {prj.contractRef}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex flex-wrap gap-x-4">
                          <span>Client: <strong className="text-slate-700">{prj.clientOrg}</strong></span>
                          <span>Location: <strong className="text-slate-700">{prj.location.district}, {prj.location.province}</strong></span>
                          <span>PM: <strong className="text-slate-700">{prj.pmName}</strong></span>
                          <span>Contract: <strong className="text-slate-700 font-mono">PKR {(prj.totalValuePKR / 1000000).toFixed(2)}M</strong></span>
                        </div>
                      </div>

                      {/* Progress & LD Risk */}
                      <div className="flex items-center space-x-4 min-w-[240px]">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Milestone Progress</span>
                            <span className="font-bold text-slate-800">{prj.currentProgressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full"
                              style={{ width: `${prj.currentProgressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                            LD Risk: Safe
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Overview of Audited Financials (Syed & Co. CA) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-sm text-slate-900">Contract Working Account (WIP Audit)</h3>
                  <span className="text-[11px] text-teal-700 font-medium">Syed & Co. CA Standard</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Contract Work Executed</span>
                    <span className="font-mono font-semibold text-slate-800">PKR 84,500,000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Direct Materials & Labour</span>
                    <span className="font-mono text-slate-800">PKR 60,550,000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Machinery Rental & Depreciation (15%)</span>
                    <span className="font-mono text-slate-800">PKR 6,270,000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Cost of Billed Work</span>
                    <span className="font-mono text-slate-800">PKR 64,650,000</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-bold text-teal-800 bg-teal-50/50 px-2 rounded">
                    <span>Gross Profit Carried to P&L</span>
                    <span className="font-mono">PKR 19,850,000 (23.5%)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-sm text-slate-900">Specialized Verticals Snapshot</h3>
                  <span className="text-[11px] text-slate-500">Live Field Operations</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-800">Khairpur Livestock Farm (21k sq.ft)</div>
                      <div className="text-[11px] text-slate-500">840 Goats (6 Breeds) • 172 Buffaloes • 38 Cows</div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      LBSA Certified
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-800">Hassanabdal Toll Plaza (N-35)</div>
                      <div className="text-[11px] text-slate-500">Monthly Guaranteed: PKR 13.70M • Shift Cash Daily</div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                      NHA Target Met
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-800">WHO Long-Term Agreement (LTA)</div>
                      <div className="text-[11px] text-slate-500">Fixed-Price Annex-1 Consumables Guard</div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                      Price Guard Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TENDERS & BIDDING (MODULE 1) */}
        {activeTab === 'tenders' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Module 1: Tender & Bidding Management</h1>
                <p className="text-xs text-slate-500">
                  Pre-construction opportunity discovery, automated PEC C3 compliance, OCR BOQ import & CDR tracking
                </p>
              </div>
              <button className="self-start md:self-auto bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-2 rounded-lg font-medium flex items-center space-x-1.5 shadow-sm">
                <Plus className="w-4 h-4" />
                <span>Log New Tender Lead</span>
              </button>
            </div>

            {/* Interactive PEC C3 Specialization Validator Tool */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-900">PEC Licence C3 Limit & Specialization Validator (FR-1.7)</h3>
                </div>
                <span className="text-xs font-mono font-medium text-slate-500">Max Limit: PKR 500,000,000</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Estimated Tender Value (PKR)</label>
                  <input
                    type="number"
                    value={pecTenderValue}
                    onChange={e => setPecTenderValue(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-sm focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Required PEC Codes (Comma-separated)</label>
                  <input
                    type="text"
                    value={pecCodes.join(', ')}
                    onChange={e => setPecCodes(e.target.value.split(',').map(s => s.trim()))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-sm focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="e.g. CE01, CE10, EE11(iii)"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={calculatePec}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-lg font-medium flex items-center justify-center space-x-1.5 text-xs h-[38px]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Validate Tharcon Eligibility</span>
                  </button>
                </div>
              </div>

              {pecResult && (
                <div className={`p-4 rounded-lg border text-xs ${
                  pecResult.isFullyEligible
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-center space-x-2 font-bold mb-1">
                    {pecResult.isFullyEligible ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>
                      {pecResult.isFullyEligible
                        ? 'Tender fully compliant with Tharcon PEC C3 Licence (PKR 500M Cap)'
                        : 'Eligibility Warning: Tender exceeds limit or requires unverified codes'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-emerald-200/60 font-mono text-[11px]">
                    <div>Licence: <strong>C3 / 7901</strong></div>
                    <div>Value: <strong>PKR {pecTenderValue.toLocaleString()}</strong></div>
                    <div>Remaining Headroom: <strong>PKR {(pecResult.headroomPKR || 0).toLocaleString()}</strong></div>
                    <div>Status: <strong>{pecResult.isFullyEligible ? 'Authorized to Bid' : 'Review Required'}</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Tender Pipeline Kanban / List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-900">Active Bidding Pipeline & Countdown Alerts</h3>
                <span className="text-xs text-slate-500">4-Stage Alert Engine (7d, 72h, 24h, 6h)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Tender Ref & Client</th>
                      <th className="py-3 px-4">Title & Scope</th>
                      <th className="py-3 px-4">Est. Value (PKR)</th>
                      <th className="py-3 px-4">Bid Bond / CDR</th>
                      <th className="py-3 px-4">Submission Deadline</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(systemData?.tenders || []).map(tnd => (
                      <tr key={tnd.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{tnd.clientOrg}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{tnd.refNo}</div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-medium text-slate-800 truncate">{tnd.title}</div>
                          <div className="text-[11px] text-teal-700">{tnd.scopeCategory}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold">
                          PKR {(tnd.estimatedValuePKR).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-slate-700">{tnd.cdrRequiredPercent}% (PKR {(tnd.cdrAmountPKR || 0).toLocaleString()})</div>
                          <div className="text-[10px] text-slate-400">{tnd.cdrInstrument?.bankName} ({tnd.cdrInstrument?.status})</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">
                            {new Date(tnd.submissionDeadline).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-amber-700 flex items-center">
                            <Clock className="w-3 h-3 mr-0.5" /> Countdown active
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            tnd.status.includes('Awarded')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {tnd.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. MULTI-SITE EXECUTION (MODULE 2) */}
        {activeTab === 'execution' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Module 2: Project Execution & Multi-Site Progress</h1>
                <p className="text-xs text-slate-500">
                  Multi-hierarchy WBS (Annex-3 Household Units), Geofenced DPR presence check & Digital Measurement Book (MB)
                </p>
              </div>
            </div>

            {/* Geofence DPR Submission Simulator */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-900">Mobile Geofenced DPR Presence Verification (FR-2.4)</h3>
                </div>
                <span className="text-xs text-slate-500">Enforces Site Engineer presence within 500m of project coordinates</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs mb-4">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Selected Project Site</label>
                  <select className="w-full border border-slate-300 rounded-lg p-2 font-medium bg-slate-50">
                    <option>PRJ-01: Mirpur Khas 47 Smart Houses (25.5276, 69.0125)</option>
                    <option>PRJ-02: Badin IHHN Incinerator Site (24.8607, 67.0011)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Engineer Phone GPS Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={engineerLat}
                    onChange={e => setEngineerLat(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Engineer Phone GPS Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={engineerLng}
                    onChange={e => setEngineerLng(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={submitTestDPR}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg font-medium flex items-center justify-center space-x-1.5 h-[38px]"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Submit Geostamped DPR</span>
                  </button>
                </div>
              </div>

              {dprStatus && (
                <div className={`p-4 rounded-lg border text-xs ${
                  dprStatus.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="font-bold flex items-center space-x-1.5">
                    {dprStatus.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                    <span>{dprStatus.success ? dprStatus.message : dprStatus.error}</span>
                  </div>
                  {dprStatus.geofence && (
                    <div className="mt-2 text-[11px] font-mono">
                      Distance to site center: <strong>{dprStatus.geofence.distanceMeters} meters</strong> (Maximum allowed: 500m)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Annex-3 Household Units Progress Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-900">Annex-3 Beneficiary Household Unit Progress (Mirpur Khas Cluster)</h3>
                <span className="text-xs text-slate-500 font-mono">4-Milestone Photographic Chain</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Household Code</th>
                      <th className="py-3 px-4">Village & Tehsil</th>
                      <th className="py-3 px-4">GPS Coordinates</th>
                      <th className="py-3 px-4">Stage 1: Foundation</th>
                      <th className="py-3 px-4">Stage 2: Plinth</th>
                      <th className="py-3 px-4">Stage 3: Lintel</th>
                      <th className="py-3 px-4">Stage 4: Slab</th>
                      <th className="py-3 px-4">Handover Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { code: 'SH/L2/MPK/25/001', village: 'Village Murad Jamali', tehsil: 'Digri', coords: '25.5281, 69.0131', f: true, p: true, l: true, s: true, status: 'Snagging / Punch List' },
                      { code: 'SH/L2/MPK/25/002', village: 'Village Murad Jamali', tehsil: 'Digri', coords: '25.5290, 69.0142', f: true, p: true, l: true, s: false, status: 'Superstructure Underway' },
                      { code: 'SH/L2/MPK/25/003', village: 'Village Haji Bux Soomro', tehsil: 'Jhudo', coords: '25.5120, 69.0350', f: true, p: true, l: false, s: false, status: 'Plinth Complete' },
                      { code: 'SH/L2/MPK/25/004', village: 'Village Haji Bux Soomro', tehsil: 'Jhudo', coords: '25.5135, 69.0365', f: true, p: false, l: false, s: false, status: 'Excavation & PCC' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-teal-800">{row.code}</td>
                        <td className="py-3 px-4">{row.village}, {row.tehsil}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{row.coords}</td>
                        <td className="py-3 px-4 text-center">{row.f ? '✅' : '⏳'}</td>
                        <td className="py-3 px-4 text-center">{row.p ? '✅' : '⏳'}</td>
                        <td className="py-3 px-4 text-center">{row.l ? '✅' : '⏳'}</td>
                        <td className="py-3 px-4 text-center">{row.s ? '✅' : '⏳'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium border border-slate-200">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. SUPPLY CHAIN & LOGISTICS (MODULE 3) */}
        {activeTab === 'supply' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Module 3: Supply Chain, Logistics & Material Verification</h1>
                <p className="text-xs text-slate-500">
                  24-Hour advance consignment notice, mandatory 4:00 PM site arrival rule, joint GRN/MQR & 24-hr defect replacement
                </p>
              </div>
            </div>

            {/* Rules Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 text-teal-700 font-bold text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  <span>24-Hour Advance Notice</span>
                </div>
                <p className="text-xs text-slate-600">
                  Consignment advisories must be transmitted to client logistics officers 24h prior, containing driver name, cell number, truck registration, and manifest.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>4:00 PM Site Arrival Rule</span>
                </div>
                <p className="text-xs text-slate-600">
                  All supply trucks must reach remote project warehouses before 4:00 PM to ensure daytime unloading and joint engineering verification.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm mb-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>24-Hour Defect Replacement</span>
                </div>
                <p className="text-xs text-slate-600">
                  Any materials rejected during joint MQR inspection must be removed from site within 24 hours and compliant replacement dispatched immediately.
                </p>
              </div>
            </div>

            {/* Approved Brand Control Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Approved Vendor List & Brand Specifications (FR-3.1)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">Cement</div>
                  <div className="text-teal-700 font-medium">Lucky, Falcon, Thatta Cement</div>
                  <div className="text-[11px] text-slate-500 mt-1">Fresh batch, moisture-free 50kg bags</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">Deformed Steel Rebar</div>
                  <div className="text-teal-700 font-medium">Mughal Steel, Amreli Steels</div>
                  <div className="text-[11px] text-slate-500 mt-1">Grade 60, Mill test certificate attached</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">Submersible Pumps</div>
                  <div className="text-teal-700 font-medium">Komax (Italian Motor)</div>
                  <div className="text-[11px] text-slate-500 mt-1">2HP, 3HP, 5HP, 15HP models with warranty</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">Deep Cycle Solar Batteries</div>
                  <div className="text-teal-700 font-medium">Osaka, Phoenix</div>
                  <div className="text-[11px] text-slate-500 mt-1">12V 200Ah deep-discharge tubular plates</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SPECIALIZED VERTICALS */}
        {activeTab === 'specialized' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Specialized Business Verticals</h1>
                <p className="text-xs text-slate-500">
                  Khairpur Mir's LBSA Livestock Facility, NHA Hassanabdal Toll Plaza & WHO Long-Term Agreement Catalog
                </p>
              </div>
            </div>

            {/* Vertical 1: Khairpur Farm */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-900">1. Khairpur Mir's Livestock Breeding & Supply Farm (FR-3.8)</h3>
                </div>
                <span className="text-xs font-mono font-medium text-teal-700">LBSA Reg: KHP/G-III/5-145/2026 (21,000 sq.ft)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500">Goat Herd (6 Verified Breeds)</div>
                  <div className="text-xl font-bold font-mono text-slate-800 mt-1">840 / 900 Cap</div>
                  <div className="text-[11px] text-slate-500 mt-1">Teddy, Thari, Tapri, Bari, Pateri, Kamori</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500">Buffaloes (Kundi / Nili-Ravi)</div>
                  <div className="text-xl font-bold font-mono text-slate-800 mt-1">172 / 200 Cap</div>
                  <div className="text-[11px] text-slate-500 mt-1">Dairy & Aqiqa / Humanitarian Orders</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500">Veterinary Compliance</div>
                  <div className="text-xl font-bold text-emerald-700 mt-1">100% Vaccinated</div>
                  <div className="text-[11px] text-slate-500 mt-1">ETV & FMD completed, next due May 2027</div>
                </div>
              </div>
            </div>

            {/* Vertical 2: NHA Hassanabdal Toll Plaza */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">2. NHA Hassanabdal Toll Plaza (N-35) Daily Revenue Ops (FR-3.11)</h3>
                </div>
                <span className="text-xs font-mono font-medium text-slate-500">Guaranteed Monthly: PKR 13,703,000</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs mb-4">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Shift 1 Cash (PKR)</label>
                  <input
                    type="number"
                    value={tollShift1}
                    onChange={e => setTollShift1(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Shift 2 Cash (PKR)</label>
                  <input
                    type="number"
                    value={tollShift2}
                    onChange={e => setTollShift2(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Shift 3 Cash (PKR)</label>
                  <input
                    type="number"
                    value={tollShift3}
                    onChange={e => setTollShift3(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={submitTollEntry}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg font-medium flex items-center justify-center space-x-1.5 text-xs h-[38px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log Bank Deposit</span>
                  </button>
                </div>
              </div>

              {tollStatusMsg && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs font-medium">
                  {tollStatusMsg}
                </div>
              )}
            </div>

            {/* Vertical 3: WHO LTA Price Guard */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-sm text-slate-900">3. WHO Long-Term Agreement (LTA) Catalog Price Guard (FR-3.10)</h3>
                </div>
                <span className="text-xs font-mono font-medium text-purple-700">Agreement Ref: LTA/WCO/PAK/2026/027</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Protects Annex-1 building consumables rates. Enforces mandatory alert preventing quoting lower to any client, preserving WHO Most-Favored Customer compliance.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Item Code</th>
                      <th className="py-2.5 px-3">Consumable Description</th>
                      <th className="py-2.5 px-3">Approved Brand</th>
                      <th className="py-2.5 px-3">Contract Rate (PKR)</th>
                      <th className="py-2.5 px-3">Guard Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-mono">WHO-01</td>
                      <td className="py-2.5 px-3">Komax Submersible Pump 2HP with Italian Motor</td>
                      <td className="py-2.5 px-3 font-medium">Komax</td>
                      <td className="py-2.5 px-3 font-mono font-semibold">PKR 145,000</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-medium">Active Locked</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono">WHO-02</td>
                      <td className="py-2.5 px-3">Deep Cycle Solar Battery 200Ah 12V Tubular</td>
                      <td className="py-2.5 px-3 font-medium">Osaka / Phoenix</td>
                      <td className="py-2.5 px-3 font-mono font-semibold">PKR 62,000</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-medium">Active Locked</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono">WHO-03</td>
                      <td className="py-2.5 px-3">Tier-1 Mono PERC Solar PV Panel 550W</td>
                      <td className="py-2.5 px-3 font-medium">JA Solar / Longi</td>
                      <td className="py-2.5 px-3 font-mono font-semibold">PKR 38,500</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-medium">Active Locked</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. FINANCE & PAKISTANI TAX (MODULE 4) */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Module 4: Financial Management, Billing & Pakistani Tax Compliance</h1>
                <p className="text-xs text-slate-500">
                  Multi-provincial tax split (FBR WHT, SRB Tariff 54, PRA, BRA), client GST exemptions, and Syed & Co. CA statements
                </p>
              </div>
            </div>

            {/* Interactive Pakistani Tax Calculator */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Percent className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-900">Multi-Provincial Tax & Withholding Calculator (FR-4.5)</h3>
                </div>
                <span className="text-xs text-slate-500">FBR Active Taxpayer Status: 6/6 Periods E-Filed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-4">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Gross Invoice Amount (PKR)</label>
                  <input
                    type="number"
                    value={taxGross}
                    onChange={e => setTaxGross(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Project Jurisdiction (Province)</label>
                  <select
                    value={taxProvince}
                    onChange={e => setTaxProvince(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="Sindh">Sindh (SRB Tariff 54 - 13%)</option>
                    <option value="Punjab">Punjab (PRA Tariff 9809 - 16%)</option>
                    <option value="Balochistan">Balochistan (BRA Tariff 9824 - 15%)</option>
                    <option value="ICT">Islamabad (FBR / ICT - 16%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Contract Retention %</label>
                  <input
                    type="number"
                    value={taxRetention}
                    onChange={e => setTaxRetention(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taxExempt}
                      onChange={e => setTaxExempt(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="text-slate-700 font-medium">Client GST Exempt (e.g. IHHN)</span>
                  </label>
                </div>
              </div>

              <button
                onClick={calculateTax}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-xs mb-4"
              >
                Recalculate Tax & Net Receivable
              </button>

              {taxCalcResult && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <div className="text-slate-500">Gross Billed</div>
                      <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                        PKR {taxGross.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Retention Deducted ({taxRetention}%)</div>
                      <div className="font-mono font-semibold text-amber-700 text-sm mt-0.5">
                        - PKR {(taxCalcResult.retentionDeduction || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Federal WHT (ITO 2001 Sec 153)</div>
                      <div className="font-mono font-semibold text-rose-700 text-sm mt-0.5">
                        - PKR {(taxCalcResult.fbrWht?.amount || 0).toLocaleString()} (5.5%)
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Net Cash Receivable</div>
                      <div className="font-mono font-bold text-emerald-700 text-base mt-0.5">
                        PKR {(taxCalcResult.netReceivable || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Retention Money & DLP Maturity Register */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Defects Liability Period (DLP) & Retention Vault (FR-4.2)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Contract / Project</th>
                      <th className="py-2.5 px-3">Retention Amount</th>
                      <th className="py-2.5 px-3">DLP Period</th>
                      <th className="py-2.5 px-3">Maturity Date</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="py-2.5 px-3 font-sans font-medium">Save the Children Primary School</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">PKR 4,250,000</td>
                      <td className="py-2.5 px-3 font-sans">120 Days</td>
                      <td className="py-2.5 px-3 text-amber-700 font-bold">10 Dec 2026</td>
                      <td className="py-2.5 px-3 font-sans"><span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">Due in 28 Days</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-sans font-medium">Muslim Aid 47 Smart Houses</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">PKR 5,398,279</td>
                      <td className="py-2.5 px-3 font-sans">90 Days</td>
                      <td className="py-2.5 px-3">29 May 2027</td>
                      <td className="py-2.5 px-3 font-sans"><span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px]">Accumulating</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-sans font-medium">IHHN Incinerator Complex</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">PKR 3,400,000</td>
                      <td className="py-2.5 px-3 font-sans">365 Days (12 Mo)</td>
                      <td className="py-2.5 px-3">30 Apr 2028</td>
                      <td className="py-2.5 px-3 font-sans"><span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[10px]">Banker's Cheque</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. MACHINERY & ASSETS (MODULE 5) */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Module 5: Machinery, Equipment & Fixed Asset Management</h1>
                <p className="text-xs text-slate-500">
                  Fleet inventory (Appendix D), live site deployment & 15% diminishing balance depreciation
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Asset ID</th>
                      <th className="py-3 px-4">Equipment Description</th>
                      <th className="py-3 px-4">Qty</th>
                      <th className="py-3 px-4">Current Site Deployment</th>
                      <th className="py-3 px-4">Opening WDV (PKR)</th>
                      <th className="py-3 px-4">Depreciation (15%)</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(systemData?.machinery || []).map(mch => (
                      <tr key={mch.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{mch.id}</td>
                        <td className="py-3 px-4 font-medium text-slate-900">{mch.name}</td>
                        <td className="py-3 px-4 font-mono">{mch.qty}</td>
                        <td className="py-3 px-4 text-teal-700 font-medium">{mch.assignedSite}</td>
                        <td className="py-3 px-4 font-mono">PKR {mch.wdvValuePKR.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">15% Diminishing</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-semibold">
                            {mch.condition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 8. WORKFORCE & MUSTER ROLL (MODULE 6) */}
        {activeTab === 'workforce' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Module 6: Workforce, HR & Labour Compliance</h1>
                <p className="text-xs text-slate-500">
                  PEC engineer quota, mobile daily labour muster roll & zero-delayed-wage safeguards
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Engineers Roster */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 mb-3">PEC Registered Engineers Directory (Appendix C)</h3>
                <div className="space-y-2.5 text-xs">
                  {(systemData?.users || []).filter(u => u.pecNo || u.qualification?.includes('Engineering')).map(eng => (
                    <div key={eng.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-800">{eng.name}</div>
                        <div className="text-slate-500">{eng.qualification} • {eng.pecNo || 'DAE Certified'}</div>
                      </div>
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 font-semibold rounded text-[11px]">
                        {eng.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Labour Muster Roll Summary */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 mb-3">Today's Field Labour Headcount (Mirpur Khas Site)</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Skilled Masons (Raj)</span>
                    <span className="font-mono font-bold text-slate-800">8 Present @ PKR 2,200/day</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Steel Bar Benders</span>
                    <span className="font-mono font-bold text-slate-800">4 Present @ PKR 2,000/day</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Carpenters / Shuttering</span>
                    <span className="font-mono font-bold text-slate-800">4 Present @ PKR 2,000/day</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Unskilled Labourers (Mazdoor)</span>
                    <span className="font-mono font-bold text-slate-800">14 Present @ PKR 1,200/day</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-slate-900 bg-slate-50 px-2 rounded mt-2">
                    <span>Total Daily Wage Bill</span>
                    <span className="font-mono text-teal-800">PKR 50,400 (Zero Delayed Wage Compliant)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. HANDOVER & CLOSEOUT (MODULE 7) */}
        {activeTab === 'closeout' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Module 7: Contract Closeout, Handover & Archiving</h1>
                <p className="text-xs text-slate-500">
                  Defect clearance punch lists, Form P11 Substantial/Final Completion Certificates & CDR release
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Form P11 Completion Certificate & Snagging Tracker</h3>
              <p className="text-xs text-slate-600 mb-4">
                Generates formal Works Final Completion Certificate (Form P11) for client joint verification (Field Engineer, District Coordinator, Project Manager, APM) before retention release.
              </p>
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-teal-900">Muslim Hands Form P11 Template Ready</div>
                  <div className="text-teal-700">Jamia Masjid & Quran Academy, Sanghar Contract</div>
                </div>
                <button className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded font-medium flex items-center space-x-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Form P11</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © 2026 <strong>Tharcon Engineers & Contractors</strong> • Tharcon (Private) Limited. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>Islamabad Head Office</span>
            <span>•</span>
            <span>Hyderabad Regional Office</span>
            <span>•</span>
            <span>Khairpur Livestock Facility</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
