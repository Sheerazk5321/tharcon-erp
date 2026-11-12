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
  Info,
  FolderPlus
} from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState('executive');
  const [activeRole, setActiveRole] = useState('CEO / Executive');
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Tender Modal State
  const [showNewTenderModal, setShowNewTenderModal] = useState(false);
  const [newTenderClient, setNewTenderClient] = useState('');
  const [newTenderRef, setNewTenderRef] = useState('');
  const [newTenderTitle, setNewTenderTitle] = useState('');
  const [newTenderValue, setNewTenderValue] = useState(50000000);
  const [newTenderScope, setNewTenderScope] = useState('Civil Works');
  const [newTenderDeadline, setNewTenderDeadline] = useState('2027-01-15T14:00');

  // Module 1: PEC Validator Form State
  const [pecTenderValue, setPecTenderValue] = useState(50000000);
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
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [engineerLat, setEngineerLat] = useState(25.5281);
  const [engineerLng, setEngineerLng] = useState(69.0131);
  const [dprStatus, setDprStatus] = useState(null);

  // Module 3: Toll Plaza Collection State
  const [tollShift1, setTollShift1] = useState(0);
  const [tollShift2, setTollShift2] = useState(0);
  const [tollShift3, setTollShift3] = useState(0);
  const [tollStatusMsg, setTollStatusMsg] = useState(null);

  // Fetch initial data from local API & Supabase
  const loadSystemData = () => {
    setLoading(true);
    fetch('/api/projects')
      .then(res => res.json())
      .then(projects => {
        return Promise.all([
          fetch('/api/company').then(r => r.json()),
          fetch('/api/tenders').then(r => r.json()),
          fetch('/api/specialized/livestock').then(r => r.json()),
          fetch('/api/specialized/toll-plaza').then(r => r.json()),
          fetch('/api/finance/audited-statements').then(r => r.json()),
          fetch('/api/finance/retention-vault').then(r => r.json()),
          fetch('/api/machinery').then(r => r.json()),
          fetch('/api/users').then(r => r.json())
        ]).then(([company, tenders, livestock, toll, audited, retentionVault, machinery, users]) => {
          setSystemData({
            company,
            tenders: tenders || [],
            projects: projects || [],
            livestock,
            toll,
            audited,
            retentionVault: retentionVault || [],
            machinery: machinery || [],
            users: users || []
          });
          if (projects && projects.length > 0) {
            setSelectedProjectId(projects[0].id);
          }
          setLoading(false);
        });
      })
      .catch(err => {
        console.warn('API fetch error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSystemData();
  }, []);

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

  const handleCreateTender = (e) => {
    e.preventDefault();
    fetch('/api/tenders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientOrg: newTenderClient,
        refNo: newTenderRef,
        title: newTenderTitle,
        estimatedValuePKR: Number(newTenderValue),
        scopeCategory: newTenderScope,
        submissionDeadline: new Date(newTenderDeadline).toISOString(),
        bidOpeningDate: new Date(newTenderDeadline).toISOString(),
        pecRequired: ['CE01', 'CE10'],
        cdrRequiredPercent: 2,
        cdrAmountPKR: Number(newTenderValue) * 0.02,
        status: 'Identified'
      })
    })
      .then(r => r.json())
      .then(() => {
        setShowNewTenderModal(false);
        setNewTenderClient('');
        setNewTenderRef('');
        setNewTenderTitle('');
        loadSystemData();
      });
  };

  const submitTestDPR = () => {
    if (!selectedProjectId) {
      setDprStatus({ success: false, error: 'Please create or select an active project first.' });
      return;
    }
    fetch('/api/dpr/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: selectedProjectId,
        engineerCoords: { lat: engineerLat, lng: engineerLng },
        siteCoords: { lat: 25.5276, lng: 69.0125 },
        dprDetails: {
          weather: 'Clear / 32°C',
          labourCount: 18,
          milestoneProgress: 'Progress inspection logged'
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
      .then(() => {
        setTollStatusMsg(`Successfully recorded PKR ${(Number(tollShift1) + Number(tollShift2) + Number(tollShift3)).toLocaleString()} into BankIslami NHA Escrow Account in Supabase.`);
        loadSystemData();
      });
  };

  // Aggregate metrics dynamically
  const totalContractValue = (systemData?.projects || []).reduce((sum, p) => sum + (Number(p.totalValuePKR) || 0), 0);
  const totalTenderValue = (systemData?.tenders || []).reduce((sum, t) => sum + (Number(t.estimatedValuePKR) || 0), 0);
  const totalBankBalances = (systemData?.company?.bankAccounts || []).reduce((sum, b) => sum + (Number(b.balancePKR) || 0), 0);
  const totalRetention = (systemData?.retentionVault || []).reduce((sum, r) => sum + (Number(r.retentionAmountPKR) || 0), 0);

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

          {/* Bank Accounts Ticker (Dynamic) */}
          <div className="hidden lg:flex items-center space-x-4 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs">
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-400">Askari Bank (Ops):</span>
              <span className="font-mono font-semibold text-emerald-300">
                PKR {((systemData?.company?.bankAccounts || []).find(b => b.bankName?.includes('Askari'))?.balancePKR || 0).toLocaleString()}
              </span>
            </div>
            <div className="h-3 w-px bg-slate-700"></div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <span className="text-slate-400">BankIslami (Escrow):</span>
              <span className="font-mono font-semibold text-cyan-300">
                PKR {((systemData?.company?.bankAccounts || []).find(b => b.bankName?.includes('Islami'))?.balancePKR || 0).toLocaleString()}
              </span>
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
              <option value="Site Engineer">Site Engineer (Mobile DPR)</option>
              <option value="Finance & Accounts">Finance Manager (Syed & Co. CA Liaison)</option>
              <option value="Tender / Estimator">Tender / Estimator</option>
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
                  Live operational state synchronized with Supabase database
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1 rounded font-medium flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Supabase Connected
                </span>
                <button
                  onClick={loadSystemData}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Top Metric Cards (Calculated dynamically) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Contracts</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                      PKR {(totalContractValue / 1000000).toFixed(2)}M
                    </div>
                  </div>
                  <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  <strong className="text-teal-700">{(systemData?.projects || []).length}</strong> Active Contracts
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tender Pipeline</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                      PKR {(totalTenderValue / 1000000).toFixed(2)}M
                    </div>
                  </div>
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  <strong className="text-blue-700">{(systemData?.tenders || []).length}</strong> Bids in Pipeline
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Liquid Cash Balances</div>
                    <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
                      PKR {(totalBankBalances / 1000000).toFixed(2)}M
                    </div>
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Askari + BankIslami Accounts
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Retention Money Vault</div>
                    <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">
                      PKR {(totalRetention / 1000000).toFixed(2)}M
                    </div>
                  </div>
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  <strong className="text-amber-700">{(systemData?.retentionVault || []).length}</strong> Contracts in DLP
                </div>
              </div>
            </div>

            {/* Active Projects Quick Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold text-slate-900 text-sm">Active Project Portfolio & Liquidated Damages Radar</h2>
                <span className="text-xs text-slate-500">Live Database Feed</span>
              </div>
              <div className="divide-y divide-slate-200">
                {(systemData?.projects || []).length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    <HardHat className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div className="font-semibold text-slate-700 text-sm">No Active Projects in Database</div>
                    <p className="mt-1">When tenders are awarded and converted to projects, execution and penalty radars will display here.</p>
                  </div>
                ) : (
                  (systemData?.projects || []).map(prj => (
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
                            <span>Location: <strong className="text-slate-700">{prj.location?.district}, {prj.location?.province}</strong></span>
                            <span>Contract: <strong className="text-slate-700 font-mono">PKR {((prj.totalValuePKR || 0) / 1000000).toFixed(2)}M</strong></span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center space-x-4 min-w-[240px]">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500">Progress</span>
                              <span className="font-bold text-slate-800">{prj.currentProgressPercent || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div
                                className="bg-teal-600 h-2 rounded-full"
                                style={{ width: `${prj.currentProgressPercent || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                              Safe
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Audited Financials Snapshot (Syed & Co. CA) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-sm text-slate-900">Contract Working Account (WIP Audit)</h3>
                  <span className="text-[11px] text-teal-700 font-medium">Syed & Co. CA Standard</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Contract Work Executed</span>
                    <span className="font-mono font-semibold text-slate-800">
                      PKR {(systemData?.audited?.contractWorkingAccount?.contractWorkExecuted || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Direct Materials & Labour</span>
                    <span className="font-mono text-slate-800">
                      PKR {((systemData?.audited?.contractWorkingAccount?.materialConsumed || 0) + (systemData?.audited?.contractWorkingAccount?.siteSalariesAndWages || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Machinery Rental & Depreciation (15%)</span>
                    <span className="font-mono text-slate-800">
                      PKR {(systemData?.audited?.contractWorkingAccount?.plantAndMachineryDepreciation || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Cost of Billed Work</span>
                    <span className="font-mono text-slate-800">
                      PKR {(systemData?.audited?.contractWorkingAccount?.costOfBilledWork || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-bold text-teal-800 bg-teal-50/50 px-2 rounded">
                    <span>Gross Profit Carried to P&L</span>
                    <span className="font-mono">
                      PKR {(systemData?.audited?.contractWorkingAccount?.grossProfit || 0).toLocaleString()} ({systemData?.audited?.contractWorkingAccount?.grossMarginPercent || 0}%)
                    </span>
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
                      <div className="text-[11px] text-slate-500">
                        {systemData?.livestock?.currentStock?.goats || 0} Goats • {systemData?.livestock?.currentStock?.buffaloes || 0} Buffaloes
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      LBSA Certified
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-800">Hassanabdal Toll Plaza (N-35)</div>
                      <div className="text-[11px] text-slate-500">
                        {(systemData?.toll?.recentDailyCollections || []).length} Daily Collections Logged
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                      NHA Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-800">WHO Long-Term Agreement (LTA)</div>
                      <div className="text-[11px] text-slate-500">Annex-1 Building Consumables Catalog</div>
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
                  Pre-construction opportunity discovery, automated PEC C3 compliance, and CDR tracking
                </p>
              </div>
              <button
                onClick={() => setShowNewTenderModal(true)}
                className="self-start md:self-auto bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-2 rounded-lg font-medium flex items-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Tender Lead</span>
              </button>
            </div>

            {/* Modal for Creating New Tender Lead */}
            {showNewTenderModal && (
              <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">Log New Tender Opportunity</h3>
                    <button onClick={() => setShowNewTenderModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>
                  <form onSubmit={handleCreateTender} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Issuing Client / Organization</label>
                      <input
                        type="text"
                        required
                        value={newTenderClient}
                        onChange={e => setNewTenderClient(e.target.value)}
                        placeholder="e.g. Indus Hospital, Muslim Aid, Save the Children"
                        className="w-full border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Tender Reference Number</label>
                      <input
                        type="text"
                        required
                        value={newTenderRef}
                        onChange={e => setNewTenderRef(e.target.value)}
                        placeholder="e.g. IHHN/CW/2026/01"
                        className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Tender Title & Scope</label>
                      <input
                        type="text"
                        required
                        value={newTenderTitle}
                        onChange={e => setNewTenderTitle(e.target.value)}
                        placeholder="e.g. Construction of Resilient Smart Houses"
                        className="w-full border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Estimated Value (PKR)</label>
                        <input
                          type="number"
                          required
                          value={newTenderValue}
                          onChange={e => setNewTenderValue(Number(e.target.value))}
                          className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Scope Category</label>
                        <select
                          value={newTenderScope}
                          onChange={e => setNewTenderScope(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2"
                        >
                          <option>Civil Works</option>
                          <option>MEP & Solar</option>
                          <option>General Supply</option>
                          <option>Livestock Supply</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Submission Deadline</label>
                      <input
                        type="datetime-local"
                        required
                        value={newTenderDeadline}
                        onChange={e => setNewTenderDeadline(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowNewTenderModal(false)}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
                      >
                        Save to Supabase
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Interactive PEC C3 Specialization Validator Tool */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-900">PEC Licence C3 Limit & Specialization Validator (FR-1.7)</h3>
                </div>
                <span className="text-xs font-mono font-medium text-slate-500">Max Cap: PKR 500,000,000</span>
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

            {/* Tender Pipeline Table (Clean Dynamic State) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-900">Active Bidding Pipeline</h3>
                <span className="text-xs text-slate-500">Live Supabase Database Feed</span>
              </div>
              <div className="overflow-x-auto">
                {(systemData?.tenders || []).length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div className="font-semibold text-slate-700 text-sm">No Tender Records Found</div>
                    <p className="mt-1">Click the button above to log your first tender lead.</p>
                  </div>
                ) : (
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
                            PKR {(tnd.estimatedValuePKR || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-mono text-slate-700">{tnd.cdrRequiredPercent}%</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">
                              {new Date(tnd.submissionDeadline).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                              {tnd.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
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
                  Multi-hierarchy WBS, Geofenced DPR presence verification & Measurement Book (MB)
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
                <span className="text-xs text-slate-500">500-meter GPS proximity threshold</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs mb-4">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Selected Project Site</label>
                  <select
                    value={selectedProjectId}
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium bg-slate-50"
                  >
                    {(systemData?.projects || []).length === 0 ? (
                      <option value="">No Active Projects</option>
                    ) : (
                      (systemData?.projects || []).map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.location?.district})</option>
                      ))
                    )}
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
                </div>
              )}
            </div>

            {/* Annex-3 Household Units (Dynamic) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-900">Annex-3 Beneficiary Household Units</h3>
                <span className="text-xs text-slate-500">4-Stage Photographic Chain</span>
              </div>
              <div className="p-8 text-center text-slate-500 text-xs">
                <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <div className="font-semibold text-slate-700 text-sm">No Household Units Logged Yet</div>
                <p className="mt-1">When shelter or water tank contracts are created, household units will display milestone verification here.</p>
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
                  24-Hour advance notice, mandatory 4:00 PM arrival rule, and joint GRN/MQR inspection
                </p>
              </div>
            </div>

            {/* Operational Policies */}
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
                  Khairpur Mir's LBSA Livestock Facility, NHA Hassanabdal Toll Plaza & WHO Long-Term Agreement
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500">Goat Herd Stock</div>
                  <div className="text-xl font-bold font-mono text-slate-800 mt-1">
                    {systemData?.livestock?.currentStock?.goats || 0} / 900 Cap
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Teddy, Thari, Tapri, Bari, Pateri, Kamori</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500">Buffaloes</div>
                  <div className="text-xl font-bold font-mono text-slate-800 mt-1">
                    {systemData?.livestock?.currentStock?.buffaloes || 0} / 200 Cap
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Dairy & Aqiqa / Humanitarian Orders</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500">Cows</div>
                  <div className="text-xl font-bold font-mono text-slate-800 mt-1">
                    {systemData?.livestock?.currentStock?.cows || 0} / 50 Cap
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Tharparkar Red Sindhi</div>
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
          </div>
        )}

        {/* 6. FINANCE & PAKISTANI TAX (MODULE 4) */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Module 4: Financial Management, Billing & Pakistani Tax Compliance</h1>
                <p className="text-xs text-slate-500">
                  Multi-provincial tax split (FBR WHT, SRB Tariff 54, PRA, BRA), and Syed & Co. CA statements
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
                    <span className="text-slate-700 font-medium">Client GST Exempt</span>
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

            {/* Retention Vault (Dynamic) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Defects Liability Period (DLP) & Retention Vault (FR-4.2)</h3>
              {(systemData?.retentionVault || []).length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="font-semibold text-slate-700 text-sm">No Active Retention Records</div>
                  <p className="mt-1">Retention amounts deducted from contract invoices will accumulate here automatically.</p>
                </div>
              ) : null}
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
                  Fleet inventory, live site deployment & 15% diminishing balance depreciation
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {(systemData?.machinery || []).length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="font-semibold text-slate-700 text-sm">No Machinery Registered in Fleet</div>
                  <p className="mt-1">Add plant, mixers, excavators, or generators to track site deployment and depreciation.</p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* 8. WORKFORCE & LABOUR (MODULE 6) */}
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
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 mb-3">Key Technical Personnel Directory</h3>
                <div className="space-y-2.5 text-xs">
                  {(systemData?.users || []).map(eng => (
                    <div key={eng.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-800">{eng.name}</div>
                        <div className="text-slate-500">{eng.designation} • {eng.location}</div>
                      </div>
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 font-semibold rounded text-[11px]">
                        {eng.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 mb-3">Today's Field Labour Headcount</h3>
                <div className="p-6 text-center text-slate-500 text-xs">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="font-semibold text-slate-700 text-sm">No Muster Rolls Submitted Today</div>
                  <p className="mt-1">Site engineers submit headcounts daily via mobile DPR.</p>
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
                Generates formal Works Final Completion Certificate (Form P11) for client joint verification before retention release.
              </p>
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <div className="font-semibold text-slate-700 text-sm">No Contracts Currently in Closeout Stage</div>
                <p className="mt-1">When active projects reach 100% completion, punch lists and Form P11 certificates will appear here.</p>
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
