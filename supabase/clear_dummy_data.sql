-- ==============================================================================
-- THARCON-ERP: PURGE ALL DUMMY / SEED DATA
-- Clears all operational records while preserving table schemas and RLS policies.
-- ==============================================================================

-- 1. Clear Dependent Child Tables First
DELETE FROM beneficiary_household_units;
DELETE FROM dpr_reports;
DELETE FROM invoices;
DELETE FROM retention_vault;
DELETE FROM toll_collections;
DELETE FROM livestock_inventory;
DELETE FROM machinery_fleet;

-- 2. Clear Core Parent Tables
DELETE FROM projects;
DELETE FROM tenders;
DELETE FROM bank_accounts;

-- 3. Verify All Tables Are Clean (Should return 0 for all)
SELECT 'beneficiary_household_units' AS table_name, COUNT(*) AS remaining_records FROM beneficiary_household_units
UNION ALL SELECT 'dpr_reports', COUNT(*) FROM dpr_reports
UNION ALL SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL SELECT 'retention_vault', COUNT(*) FROM retention_vault
UNION ALL SELECT 'toll_collections', COUNT(*) FROM toll_collections
UNION ALL SELECT 'livestock_inventory', COUNT(*) FROM livestock_inventory
UNION ALL SELECT 'machinery_fleet', COUNT(*) FROM machinery_fleet
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'tenders', COUNT(*) FROM tenders
UNION ALL SELECT 'bank_accounts', COUNT(*) FROM bank_accounts;
