# Tharcon-ERP: Unified Software Requirements & Architectural Baseline

## 1. Document Control & Purpose
- **System Name**: Tharcon Enterprise Resource Planning & Management System (Tharcon-ERP / TMS)
- **Document Version**: 2.0 (Synthesized Master Specification)
- **Primary Entities**: M/S Tharcon Engineers & Contractors (Proprietorship / AOP) and Tharcon (Private) Limited
- **Licence & Tax Identifiers**:
  - PEC Licence: C3/7901 (Civil, Electrical, Mechanical; Limit PKR 500 Million)
  - Federal NTN: 1863422-2 (FBR Income Tax Ordinance 2001)
  - Sindh Sales Tax (SRB): S1863422-2 (Sindh Sales Tax on Services Act 2011)
  - Punjab Revenue Authority (PRA) PNTN
  - Balochistan Revenue Authority (BRA) BNTN
  - Livestock Breeding & Services Authority (LBSA) Registration: KHP/G-III/5-145/2026 (Khairpur Mir's)

---

## 2. Executive Synthesis of the Two SRS Documents

| Dimension | Document 1: Tharcon_ERP_SRS.docx | Document 2: TMS SRS.docx | Unified Master Architecture |
| :--- | :--- | :--- | :--- |
| **Scope & Domain** | Detailed operational domain: 5 verticals, Khairpur Farm, WHO LTA, NHA Toll, 4:00 PM rule, 24-hr advance notice, Syed & Co. CA statements. | Formal IEEE 830 structure: FR-01 to FR-100+, P1/P2/P3 priority tagging, NFRs, RBAC Matrix, tech stack. | Integrates all business verticals with IEEE standard FR tagging, full RBAC, and audited accounting standards. |
| **Field Monitoring** | Geofencing (<500m), geostamped photo/video cards (Foundation, Plinth, Lintel, Slab), liquidated damages radar. | DPR form, muster roll, measurement book (MB), Gantt chart. | Complete offline-first PWA with GPS-enforced geofence, watermarked photo cards, digital MB, and penalty radar. |
| **Tax & Compliance** | Multi-provincial tax split (FBR WHT, SRB Tariff 54, PRA, BRA), labor tax split, GST exemption vault, 6-mo ATL guard. | WHT/GST ledger, invoice milestone billing, retention vault. | Fully automated Pakistani tax calculation engine with provincial routing, ATL status tracking, and audit-ready outputs. |
| **Specialized Verticals** | Khairpur Farm (Buffaloes/Goats/Aqiqa), WHO LTA Catalog price guard, NHA Hassanabdal Toll daily reconciliation, Tree plantation. | Generalized supply chain and material dispatch. | Dedicated specialized operational sub-modules integrated into Supply Chain & Operations. |
| **Workforce & Assets** | Diminishing balance depreciation (15%/10%), zero-delayed wage safeguard, PEC engineer quota compliance. | Asset inventory, staff allocation matrix, subcontractor ledger. | Real-time machinery deployment logs with depreciation schedules, PEC quota validator, and daily muster rolls. |

---

## 3. Detailed Functional Modules & Requirements Traceability

### 3.1 Module 1: Pre-Construction & Tender Bidding Management
- **FR-01 (Tender Discovery & Scraper)**: Scrape and log tender leads from paperpk.com, newspapers (Daily Jang, Daily Kawaish), PPRA, UNGM, and direct RFPs (Save the Children, Muslim Aid, Indus Hospital, Islamic Relief, ACF, ACTED, HANDS, WHO, NHA).
- **FR-02 (Tender Pipeline Kanban)**: Visual Kanban pipeline with stages: `Identified` → `Documents Downloaded` → `Technical Bid Prepared` → `Financial Bid Prepared` → `Submitted` → `Under Evaluation` → `Awarded / Lost / Cancelled`.
- **FR-03 (Automated Deadline Countdown)**: 4-stage alert countdown (7 days, 72 hours, 24 hours, 6 hours) via SMS, WhatsApp, and Email.
- **FR-04 (Tender OCR & Document Vault)**: Document repository supporting PDF, DOCX, XLSX, DWG, and image formats with automated OCR parsing of BOQ line items, units, quantities, and CDR terms.
- **FR-05 (PEC Limit & Specialization Validator)**: Automatic validation against Tharcon's PEC C3 limit (PKR 500M) and active engineering specialization codes (`CE01`, `CE04`, `CE09`, `CE10`, `EE04`, `EE06`, `EE11(iii)`, `ME01`).
- **FR-06 (Credentials Library & Proposal Compiler)**: Pre-approved credentials vault compiling 100+ page technical bids in under 15 seconds.
- **FR-07 (Multi-Mode BOQ Estimator & Rate Intelligence)**: Support for Item-rate, Cost-plus, Lump-sum, and Percentage-based BOQs with historical rate auto-fill.
- **FR-08 (CDR & Bank Guarantee Vault)**: Register tracking Call Deposit Receipts, Pay Orders, and Bank Guarantees with automated 14-day expiry alerts.
- **FR-09 (Physical Sample Submission Tracker)**: Track physical sample submittals, tagging, transmittal slips, and sample approval status.

### 3.2 Module 2: Project Execution & Multi-Site Progress Monitoring
- **FR-10 (Multi-Hierarchy WBS)**: Nested breakdown structure: `Province` → `District` → `Tehsil` → `Union Council` → `Village` → `Beneficiary Household Unit` (Annex-3 codes e.g. `SH/L2/MPK/25/066`).
- **FR-11 (Gantt Scheduling & Milestone Tracker)**: Interactive Gantt chart with critical path tracking across project phases.
- **FR-12 (Geofenced DPR & Mandatory Site Engineer Presence)**: Daily Progress Report submission gated by GPS coordinates verification within ~500 meters of the site.
- **FR-13 (Geotagged Photo & Video Evidence Cards)**: Automated watermarking with GPS lat/long, timestamp, project name, unit ID, and inspector name across 4 construction stages:
  1. Foundation / Earthwork
  2. Plinth Level / Damp Proof Course (DPC)
  3. Lintel Level / Superstructure
  4. Slab Casting / Roofing & Finishing
- **FR-14 (Digital Measurement Book - MB)**: Digital MB sheets linked to BOQ line items with auto-calculated cumulative quantities and joint sign-offs.
- **FR-15 (Penalty Risk Radar & Liquidated Damages Alert)**: Automated daily penalty tracking (0.1%/day, up to 10% contract cap) with executive early-warning notifications.
- **FR-16 (Variation & RFI Management)**: Scope variation change orders, cost impact analysis, client approvals, and technical query logs.

### 3.3 Module 3: Supply Chain, Logistics, Material Verification & Specialized Verticals
- **FR-17 (BOQ-Linked Requisition & Brand Enforcement)**: Material requisitions capped against approved BOQ quantities and restricted to approved brands (Lucky/Falcon/Thatta Cement, Mughal/Amreli Steel, Osaka Batteries, Komax pumps).
- **FR-18 (24-Hour Advance Dispatch Notice)**: Automated dispatch advisory (driver name, mobile, truck registration, itemized manifest) sent to NGO logistics focal persons.
- **FR-19 (4:00 PM Site Arrival Rule)**: Delivery tracking enforcing daytime arrival before 4:00 PM for safe unloading and joint inspection.
- **FR-20 (Joint GRN & Material Quality Report - MQR)**: Joint sign-off workflow between Tharcon site representative and client inspectors.
- **FR-21 (24-Hour Defect Replacement Rule)**: Automated timer and alert triggered upon material rejection to ensure compliant replacement within 24 hours.
- **FR-22 (Khairpur Livestock Farm & Aqiqa Module)**: Management of 21,000 sq ft facility in Khairpur Mir's (200 Buffaloes, 900 Goats across Teddy, Thari, Tapri, Bari, Pateri, Kamori breeds), animal health logs, vaccination schedules, fodder expenses, and distribution challans.
- **FR-23 (Tree Plantation & Agricultural Inputs)**: Nursery verification (5-7 ft height, pest-free), UC pathway tracking, seed & fertilizer supply logs.
- **FR-24 (WHO LTA Fixed-Price Catalog & Price Reduction Guard)**: Fixed-price Annex-1 building consumables catalog guard with automated alerts preventing quotes below LTA contracted prices.
- **FR-25 (NHA Hassanabdal Toll Plaza Operations)**: Shift-wise traffic count logs, gross cash collections, bank deposits to NHA Road Maintenance Account, and monthly revenue reconciliation against PKR 13,703,000 guaranteed net commitment.

### 3.4 Module 4: Financial Management, Billing & Pakistani Tax Compliance
- **FR-26 (Milestone & IPC Invoicing Engine)**: Automated billing based on verified MB quantities or project milestones with mobilization advance recovery deductions.
- **FR-27 (Retention Money & DLP Vault)**: Client-specific Defects Liability Period tracking:
  - 30 Days: Muslim Hands (10% retention)
  - 60 Days: Muslim Aid 5 Smart Houses
  - 90 Days: Muslim Aid 34 Smart Houses
  - 120 Days: Save the Children Model School
  - 180 Days: Solar equipment warranties (Osaka, Komax)
  - 365 Days / 12 Months: Indus Hospital & Health Network (5% retention / 10% banker's cheque)
- **FR-28 (Multi-Provincial Tax & Withholding Split Engine)**:
  - Federal Income Tax Withholding (FBR WHT under ITO 2001)
  - Sindh Revenue Board (SRB Tariff 54)
  - Punjab Revenue Authority (PRA Tariff 9809)
  - Balochistan Revenue Authority (BRA Tariff 9824)
  - Labor Tax Split (tax on labor component only)
  - Client GST Exemption Certificate Vault
- **FR-29 (6-Month Rolling ATL Filing Guard)**: Verification of monthly Sales Tax & Federal Excise return filings ensuring continuous Active Taxpayer List status across FBR, SRB, PRA, and BRA.
- **FR-30 (Audited Financial Statements for Syed & Co. CA)**:
  - Contract Working Account (WIP Opening, Material, Wages, Machine Rent, Overheads, WIP Closing, Gross Profit)
  - Statement of Profit or Loss
  - Statement of Financial Position (Balance Sheet) & Cash Flows
  - Proprietor's Capital Account (Opening + Net Profit - Drawings)
- **FR-31 (Multi-Bank Reconciliation & Petty Cash Imprest)**: Multi-bank reconciliation (Askari Bank, BankIslami) and site petty cash imprest ledgers.

### 3.5 Module 5: Machinery, Equipment & Fixed Asset Management
- **FR-32 (Master Machinery Inventory)**: Complete fleet register (mixers, vibrators, excavators, tractors, HDPE fusion machines, total stations, generators, steel cutters, safety kits).
- **FR-33 (Live Site Deployment & Dispatch)**: Equipment dispatch, inter-site transfers, and site assignment logs.
- **FR-34 (Maintenance, Fuel Logs & Diminishing Balance Depreciation)**:
  - Plant & Machinery: 15% diminishing balance
  - Furniture, Fixtures & Office Equipment: 10% diminishing balance
  - Automatic posting to Contract Working Account or P&L.

### 3.6 Module 6: Workforce, HR, Labor Compliance & Subcontractors
- **FR-35 (Staff & Engineer Allocation Matrix)**: Real-time site assignment matrix, qualification verification, and PEC registration renewal tracking (60-day alert).
- **FR-36 (Daily Labor Muster Roll)**: Mobile submission of daily headcount by trade (masons, carpenters, plumbers, bar benders, unskilled laborers) with wage calculation.
- **FR-37 (Zero-Delayed-Wage Safeguard)**: Automated alert if field labor wages remain unpaid beyond weekly/bi-weekly cut-off.
- **FR-38 (Subcontractor Management & Ledger)**: Specialized sub-agreements, scope, approved MB bills, payments, and balances.
- **FR-39 (HSE & PSEAH Compliance)**: Incident tracking, safety kit check, and strict beneficiary data protection safeguards.

### 3.7 Module 7: Contract Closeout, Handover & Archiving
- **FR-40 (Snagging / Punch List)**: Field punch list with before/after photos and formal sign-offs.
- **FR-41 (Substantial & Final Completion Certificates)**: Form P11 and standard NGO Works Final Completion certificate generation.
- **FR-42 (Retention & CDR Release Management)**: Expiry notifications and tracking of retention money refund and CDR return.

### 3.8 Module 8: Notifications, Alerts & Reporting Engine
- **FR-43 (Multi-Channel Alerts)**: Automated notifications via in-app dashboard, Email, SMS, and WhatsApp.
- **FR-44 (Executive Reporting & Analytics)**: Consolidated KPI dashboards, cash flow forecasting, tender win/loss analysis, and project margin reconciliation.

### 3.9 Module 9: System Administration, Audit Trails & Security
- **FR-45 (Role-Based Access Control)**: 9 distinct roles with granular module-level permissions.
- **FR-46 (Immutable Audit Log)**: Complete audit trail of all financial, contract, and measurement entries.
- **FR-47 (Beneficiary PII Encryption)**: Encryption of all beneficiary household PII in compliance with humanitarian donor data policies.
