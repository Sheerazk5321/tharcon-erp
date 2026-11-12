-- ==============================================================================
-- THARCON-ERP: COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- M/S Tharcon Engineers & Contractors (PEC C3/7901, NTN 1863422-2)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES & LEGAL ENTITIES
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY DEFAULT 'tharcon-main',
    legal_name TEXT NOT NULL,
    private_entity TEXT NOT NULL,
    pec_license TEXT NOT NULL,
    pec_limit_pkr NUMERIC NOT NULL DEFAULT 500000000,
    pec_specializations TEXT[] NOT NULL DEFAULT ARRAY['CE01', 'CE04', 'CE09', 'CE10', 'EE04', 'EE06', 'EE11(iii)', 'ME01'],
    ntn TEXT NOT NULL,
    sntn TEXT NOT NULL,
    pntn TEXT NOT NULL,
    bntn TEXT NOT NULL,
    lbsa_reg TEXT NOT NULL,
    head_office TEXT NOT NULL,
    regional_office_sindh TEXT NOT NULL,
    kotri_office TEXT NOT NULL,
    islamabad_sub_office TEXT NOT NULL,
    livestock_facility TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BANK ACCOUNTS & ESCROWS
CREATE TABLE IF NOT EXISTS bank_accounts (
    id TEXT PRIMARY KEY,
    bank_name TEXT NOT NULL,
    branch TEXT NOT NULL,
    account_no TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    balance_pkr NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'PKR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS & STAFF DIRECTORY
CREATE TABLE IF NOT EXISTS users_directory (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    designation TEXT,
    pec_no TEXT,
    qualification TEXT,
    phone TEXT,
    assigned_projects TEXT[],
    current_site TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TENDERS & PRE-BID PIPELINE
CREATE TABLE IF NOT EXISTS tenders (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    client_org TEXT NOT NULL,
    ref_no TEXT NOT NULL,
    title TEXT NOT NULL,
    estimated_value_pkr NUMERIC NOT NULL,
    scope_category TEXT NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL,
    bid_opening_date TIMESTAMPTZ NOT NULL,
    pec_required TEXT[] DEFAULT ARRAY[]::TEXT[],
    cdr_required_percent NUMERIC NOT NULL DEFAULT 2.0,
    cdr_amount_pkr NUMERIC NOT NULL DEFAULT 0,
    cdr_bank_name TEXT,
    cdr_instrument_no TEXT,
    cdr_expiry_date DATE,
    cdr_status TEXT DEFAULT 'Active / Submitted',
    status TEXT NOT NULL DEFAULT 'Identified',
    win_probability NUMERIC DEFAULT 50,
    documents_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROJECTS & CONTRACTS
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    tender_id TEXT REFERENCES tenders(id),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    client_org TEXT NOT NULL,
    contract_ref TEXT NOT NULL,
    contract_type TEXT NOT NULL,
    total_value_pkr NUMERIC NOT NULL,
    start_date DATE NOT NULL,
    target_end_date DATE NOT NULL,
    current_progress_percent NUMERIC NOT NULL DEFAULT 0,
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    tehsils TEXT[] DEFAULT ARRAY[]::TEXT[],
    gps_lat NUMERIC NOT NULL,
    gps_lng NUMERIC NOT NULL,
    pm_name TEXT NOT NULL,
    site_engineers TEXT[] DEFAULT ARRAY[]::TEXT[],
    ld_rate_per_day NUMERIC DEFAULT 0.001,
    ld_max_cap_percent NUMERIC DEFAULT 10,
    retention_percent NUMERIC DEFAULT 10,
    dlp_days INT DEFAULT 90,
    total_beneficiary_units INT DEFAULT 0,
    completed_units INT DEFAULT 0,
    in_progress_units INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active / In Progress',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BENEFICIARY HOUSEHOLD UNITS (ANNEX-3 HOUSING & WATER)
CREATE TABLE IF NOT EXISTS beneficiary_household_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id TEXT NOT NULL,
    household_code TEXT NOT NULL,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    beneficiary_alias TEXT NOT NULL,
    village TEXT NOT NULL,
    union_council TEXT NOT NULL,
    tehsil TEXT NOT NULL,
    gps_lat NUMERIC NOT NULL,
    gps_lng NUMERIC NOT NULL,
    current_milestone TEXT NOT NULL,
    foundation_completed BOOLEAN DEFAULT FALSE,
    plinth_completed BOOLEAN DEFAULT FALSE,
    lintel_completed BOOLEAN DEFAULT FALSE,
    slab_completed BOOLEAN DEFAULT FALSE,
    handover_status TEXT DEFAULT 'Under Construction',
    assigned_engineer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DAILY PROGRESS REPORTS (DPR) WITH GEOFENCE VALIDATION
CREATE TABLE IF NOT EXISTS dpr_reports (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id),
    project_name TEXT NOT NULL,
    engineer_name TEXT NOT NULL,
    submission_timestamp TIMESTAMPTZ DEFAULT NOW(),
    weather TEXT,
    labour_count INT DEFAULT 0,
    milestone_progress TEXT NOT NULL,
    engineer_gps_lat NUMERIC NOT NULL,
    engineer_gps_lng NUMERIC NOT NULL,
    geofence_verified BOOLEAN DEFAULT TRUE,
    distance_meters INT DEFAULT 0,
    photos_count INT DEFAULT 0,
    status TEXT DEFAULT 'Submitted / Awaiting PM Sign-off',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FINANCIAL INVOICES & PAKISTANI TAX RECORDS
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    invoice_no TEXT UNIQUE NOT NULL,
    project_id TEXT REFERENCES projects(id),
    project_name TEXT NOT NULL,
    client_org TEXT NOT NULL,
    milestone TEXT NOT NULL,
    gross_amount_pkr NUMERIC NOT NULL,
    retention_rate_percent NUMERIC DEFAULT 10,
    retention_deducted_pkr NUMERIC NOT NULL,
    tax_regime TEXT NOT NULL,
    fbr_wht_percent NUMERIC DEFAULT 5.5,
    fbr_wht_deducted_pkr NUMERIC NOT NULL,
    provincial_authority TEXT DEFAULT 'SRB',
    provincial_sst_percent NUMERIC DEFAULT 13,
    client_withheld_sst_pkr NUMERIC DEFAULT 0,
    gst_exemption_cert_attached BOOLEAN DEFAULT FALSE,
    net_payable_pkr NUMERIC NOT NULL,
    submission_date DATE NOT NULL,
    paid_date DATE,
    due_payment_date DATE,
    status TEXT NOT NULL DEFAULT 'Under Processing',
    credited_bank TEXT NOT NULL DEFAULT 'Askari Bank',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RETENTION MONEY & DEFECTS LIABILITY PERIOD (DLP) VAULT
CREATE TABLE IF NOT EXISTS retention_vault (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id),
    project_name TEXT NOT NULL,
    retention_amount_pkr NUMERIC NOT NULL,
    dlp_period_days INT NOT NULL,
    dlp_start_date DATE,
    dlp_maturity_date DATE NOT NULL,
    bank_held TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MACHINERY & EQUIPMENT ASSET FLEET
CREATE TABLE IF NOT EXISTS machinery_fleet (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    qty INT NOT NULL DEFAULT 1,
    condition TEXT NOT NULL DEFAULT 'Operational',
    assigned_site TEXT NOT NULL,
    rate_per_hour NUMERIC NOT NULL DEFAULT 500,
    wdv_value_pkr NUMERIC NOT NULL,
    dep_rate_percent NUMERIC NOT NULL DEFAULT 15,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. KHAIRPUR MIR'S LIVESTOCK BREEDING FACILITY
CREATE TABLE IF NOT EXISTS livestock_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    species TEXT NOT NULL, -- Goat, Buffalo, Cow
    breed TEXT NOT NULL,   -- Teddy, Thari, Tapri, Bari, Pateri, Kamori, Kundi
    count INT NOT NULL DEFAULT 0,
    target_avg_weight_kg NUMERIC NOT NULL,
    health_status TEXT NOT NULL DEFAULT 'Excellent',
    last_vaccination_date DATE,
    next_vaccination_due DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NHA HASSANABDAL TOLL PLAZA COLLECTIONS
CREATE TABLE IF NOT EXISTS toll_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plaza_name TEXT NOT NULL DEFAULT 'Hassanabdal Toll Plaza (N-35)',
    collection_date DATE NOT NULL,
    shift1_pkr NUMERIC NOT NULL DEFAULT 0,
    shift2_pkr NUMERIC NOT NULL DEFAULT 0,
    shift3_pkr NUMERIC NOT NULL DEFAULT 0,
    total_pkr NUMERIC NOT NULL,
    daily_target_pkr NUMERIC NOT NULL DEFAULT 456766,
    variance_pkr NUMERIC NOT NULL,
    deposited_bank TEXT NOT NULL DEFAULT 'BankIslami',
    challan_no TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW-LEVEL SECURITY (RLS) FOR PRODUCTION COMPLIANCE
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiary_household_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE dpr_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE retention_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE machinery_fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE toll_collections ENABLE ROW LEVEL SECURITY;

-- Default Read-Access policies for authenticated users
CREATE POLICY "Allow authenticated read on companies" ON companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on tenders" ON tenders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on units" ON beneficiary_household_units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on invoices" ON invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on machinery" ON machinery_fleet FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on livestock" ON livestock_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on toll" ON toll_collections FOR SELECT TO authenticated USING (true);

-- Public / Anonymous Read Policy for demo/development environments
CREATE POLICY "Allow anon read for dev on tenders" ON tenders FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read for dev on projects" ON projects FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read for dev on units" ON beneficiary_household_units FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read for dev on invoices" ON invoices FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read for dev on livestock" ON livestock_inventory FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read for dev on toll" ON toll_collections FOR SELECT TO anon USING (true);

