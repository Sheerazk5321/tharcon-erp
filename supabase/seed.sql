-- ==============================================================================
-- THARCON-ERP: SUPABASE INITIAL SEED DATA
-- M/S Tharcon Engineers & Contractors
-- ==============================================================================

-- 1. Insert Company Profile
INSERT INTO companies (
    id, legal_name, private_entity, pec_license, pec_limit_pkr, pec_specializations,
    ntn, sntn, pntn, bntn, lbsa_reg, head_office, regional_office_sindh, kotri_office,
    islamabad_sub_office, livestock_facility
) VALUES (
    'tharcon-main',
    'M/S Tharcon Engineers & Contractors',
    'Tharcon (Private) Limited',
    'C3/7901',
    500000000,
    ARRAY['CE01', 'CE04', 'CE09', 'CE10', 'EE04', 'EE06', 'EE11(iii)', 'ME01'],
    '1863422-2',
    'S1863422-2',
    'P1863422-2',
    'B1863422-2',
    'KHP/G-III/5-145/2026',
    'Office B # 399, Street 1, Murree Road, Korang Road, LVL Colony, Islamabad',
    'Flat # 09/A5, 2nd Floor, Al-Rehman Towers, Opp. Marvi Lawn, Wadhu Wah, Qasimabad, Hyderabad',
    'Shop # B-1, T.P.S Colony, Sehwan Road, Kotri, Jamshoro',
    'Office # D/12, 1st Floor Riffat Plaza, Murree Road, Bhara Kahu, Islamabad',
    'Village AdhoBhar, PO Box Baberlo Taluka, Khairpur Mir''s (21,000 sq. ft.)'
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Bank Accounts
INSERT INTO bank_accounts (id, bank_name, branch, account_no, title, type, balance_pkr, currency) VALUES
('bank-01', 'Askari Bank Limited', 'F-7 Markaz, Islamabad', '0140789012345', 'M/S Tharcon Engineers & Contractors', 'Operations & IPC Working Account', 18450000, 'PKR'),
('bank-02', 'BankIslami Pakistan Limited', 'Auto Bhan Road, Hyderabad', '2055001298451', 'M/S Tharcon Engineers & Contractors', 'Toll Plaza & Escrow Guarantee Account', 9230000, 'PKR')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Tenders
INSERT INTO tenders (
    id, source, client_org, ref_no, title, estimated_value_pkr, scope_category,
    submission_deadline, bid_opening_date, pec_required, cdr_required_percent, cdr_amount_pkr,
    cdr_bank_name, cdr_instrument_no, cdr_expiry_date, cdr_status, status, win_probability, documents_count
) VALUES
('TND-2026-01', 'UNGM / Direct RFP', 'World Health Organization (WHO)', 'LTA/WCO/PAK/2026/027', '1-Year Long Term Agreement for Building Maintenance Consumables', 24000000, 'Long-Term Agreement (LTA)', '2026-11-20 14:00:00+05', '2026-11-20 15:00:00+05', ARRAY['EE04', 'ME01'], 2.0, 480000, 'Askari Bank', 'CDR-782910', '2027-02-28', 'Active / Submitted', 'Awarded / Active Contract', 100, 6),
('TND-2026-02', 'paperpk.com / Daily Jang', 'Indus Hospital & Health Network (IHHN)', 'IHHN/CW/INC-YR/2026/91', 'Construction of Biomedical Waste Incinerator & Yellow Room Complex', 68000000, 'Civil, MEP & Healthcare Infrastructure', '2026-11-28 12:00:00+05', '2026-11-28 13:30:00+05', ARRAY['CE01', 'CE10', 'EE11(iii)'], 3.0, 2040000, 'Askari Bank', 'CDR-894102', '2027-03-31', 'Submitted / Under Evaluation', 'Submitted', 85, 12),
('TND-2026-03', 'PPRA / Direct RFP', 'National Highway Authority (NHA)', 'LOA 20(08) NHA/DD(R-C)/2025/54', 'Operations, Management & Revenue Collection at Hassanabdal Toll Plaza (N-35)', 164436000, 'Highway Toll Operations', '2026-10-15 11:00:00+05', '2026-10-15 12:00:00+05', ARRAY['CE01'], 5.0, 8221800, 'BankIslami', 'BG-NHA-9081', '2027-10-31', 'Active / Handed Over', 'Awarded / Active Contract', 100, 8),
('TND-2026-04', 'Direct NGO RFP', 'Muslim Aid Pakistan', 'MAP/MAUK/2026-23/26/5930-8', 'Construction of 47 Resilient Flood-Protected Smart Houses', 53982790, 'Civil & Humanitarian Shelter', '2026-08-10 15:00:00+05', '2026-08-10 16:00:00+05', ARRAY['CE01', 'CE10'], 3.0, 1619483, 'Askari Bank', 'CDR-554120', '2027-04-15', 'Active / Contract Ongoing', 'Awarded / Active Contract', 100, 15),
('TND-2026-05', 'Daily Kawaish', 'Save the Children International', 'SCI/PK/EDU/2026/104', 'Construction of Resilient Model School & WASH Facilities in Dadu', 42500000, 'Civil, MEP & Education Infrastructure', '2026-12-05 14:00:00+05', '2026-12-05 15:00:00+05', ARRAY['CE01', 'EE04'], 2.5, 1062500, 'Askari Bank', 'CDR-990145', '2027-05-30', 'In Preparation', 'Technical Bid Prepared', 75, 9)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Projects
INSERT INTO projects (
    id, tender_id, code, name, client_org, contract_ref, contract_type, total_value_pkr,
    start_date, target_end_date, current_progress_percent, province, district, tehsils,
    gps_lat, gps_lng, pm_name, site_engineers, ld_rate_per_day, ld_max_cap_percent, retention_percent, dlp_days,
    total_beneficiary_units, completed_units, in_progress_units, status
) VALUES
('PRJ-01', 'TND-2026-04', 'MAP-SH-47', '47 Resilient Smart Houses Construction', 'Muslim Aid Pakistan', 'MAP/MAUK/2026-23/26/5930-8', 'Civil & Humanitarian Shelter', 53982790, '2026-08-25', '2027-02-28', 68, 'Sindh', 'Mirpur Khas', ARRAY['Digri', 'Jhudo', 'Kot Ghulam Muhammad'], 25.5276, 69.0125, 'Engr. Masroor Ahmed', ARRAY['Waseem Ahmed', 'Iqbal Soomro'], 0.001, 10, 10, 90, 47, 28, 19, 'Active / In Progress'),
('PRJ-02', 'TND-2026-02', 'IHHN-INC-01', 'Incinerator & Yellow Room Complex', 'Indus Hospital & Health Network (IHHN)', 'IHHN/CW/INC-YR/2026/91', 'Civil, MEP & Healthcare Infrastructure', 68000000, '2026-09-15', '2027-04-30', 42, 'Sindh', 'Badin & Karachi', ARRAY['Matli', 'Korangi'], 24.8607, 67.0011, 'Engr. Masroor Ahmed', ARRAY['Farman Ali'], 0.001, 10, 5, 365, 2, 0, 2, 'Active / In Progress'),
('PRJ-04', 'TND-2026-03', 'NHA-TOLL-N35', 'Hassanabdal Toll Plaza Operations (N-35)', 'National Highway Authority (NHA)', 'LOA 20(08) NHA/DD(R-C)/2025/54', 'Highway Toll Operations', 164436000, '2026-01-01', '2026-12-31', 91, 'Punjab / KPK Border', 'Attock / Rawalpindi', ARRAY['Hassanabdal'], 33.8214, 72.6892, 'Engr. Masab', ARRAY[], 0.001, 10, 0, 0, 0, 0, 0, 'Active Operational Vertical')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Khairpur Livestock Breeds
INSERT INTO livestock_inventory (species, breed, count, target_avg_weight_kg, health_status, last_vaccination_date, next_vaccination_due) VALUES
('Goat', 'Teddy', 260, 28, 'Excellent', '2026-10-25', '2027-04-25'),
('Goat', 'Thari', 180, 32, 'Excellent', '2026-10-25', '2027-04-25'),
('Goat', 'Tapri', 150, 35, 'Good', '2026-10-25', '2027-04-25'),
('Goat', 'Bari', 110, 30, 'Excellent', '2026-10-25', '2027-04-25'),
('Goat', 'Pateri', 90, 40, 'Vaccinated', '2026-10-25', '2027-04-25'),
('Goat', 'Kamori', 50, 45, 'Show / Prime', '2026-10-25', '2027-04-25'),
('Buffalo', 'Kundi / Nili-Ravi', 172, 450, 'Excellent', '2026-11-02', '2027-05-02'),
('Cow', 'Tharparkar Red Sindhi', 38, 380, 'Excellent', '2026-11-02', '2027-05-02');
