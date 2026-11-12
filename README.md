# Tharcon-ERP: Enterprise Resource Planning & Project Management System

**M/S Tharcon Engineers & Contractors (PEC Licence C3/7901, NTN 1863422-2) & Tharcon (Private) Limited**

---

## 🏗️ System Overview
**Tharcon-ERP** is a centralized, cloud-hosted, mobile-first enterprise resource planning and field management platform designed exclusively for M/S Tharcon Engineers & Contractors and Tharcon (Private) Limited. It digitizes, automates, and synchronizes the company's full operational lifecycle across its Islamabad Head Office, Sindh Regional Office (Hyderabad), Kotri Branch Office, Khairpur Mir's Livestock Breeding Facility, and dispersed field construction sites across all provinces of Pakistan (Sindh, Punjab, Balochistan, KPK, and ICT).

---

## 🎯 5 Core Business Verticals
1. **Civil, MEP & Healthcare Infrastructure Construction**: Hospitals, Yellow Rooms, Incinerator Areas (Indus Hospital & Health Network), Model Schools (Save the Children), Masjids & Quran Academies (Muslim Hands), Resilient Smart Houses & Shelters (Muslim Aid, Islamic Relief).
2. **Sustainable Solar & Water Systems**: Solarized water wells (2HP to 15HP submersible pumps), solarized agricultural water tanks (ACF Quetta), drip irrigation networks across desert villages (HANDS Sanghar), and shelter solar kits (Human Appeal).
3. **General Order Supply & Humanitarian Kits**: Emergency shelter construction material packages (bricks, cement, girders, bamboo, steel doors/windows), Cash-for-Work (CFW) village cleaning toolkits (ACTED), and tree plantation supplies (Moringa, Conocarpus, Eucalyptus, Acacia, Shesham, Jujube).
4. **Commercial Livestock Breeding & Agricultural Inputs**: Operation of a 21,000 sq. ft. LBSA-certified livestock farm in Khairpur Mir's (200 Buffaloes, 900 Goats across Teddy, Thari, Tapri, Bari, Pateri, and Kamori breeds) for Aqiqa and humanitarian distributions, alongside seeds and fertilizer supplies.
5. **Highway Toll Operations & Long-Term Agreements (LTAs)**: Management of National Highway Authority (NHA) toll plazas (e.g., Hassanabdal Toll Plaza N-35 with monthly guaranteed revenue reconciliation) and 1-year fixed-price LTAs with international bodies like WHO for building maintenance consumables.

---

## 📦 9 Integrated Modules

| Module | Core Functionality |
| :--- | :--- |
| **Module 1: Pre-Construction & Tender Bidding** | Opportunity Kanban pipeline, OCR document vault, PEC C3 limit (PKR 500M) & specialization code validator, CDR & bank guarantee maturity tracker, multi-mode BOQ estimator, physical sample log. |
| **Module 2: Project Execution & Multi-Site Monitoring** | Multi-hierarchy WBS (Province → District → Tehsil → UC → Village → Household Unit), Gantt scheduling, geofenced DPR with mandatory engineer GPS verification, geotagged 4-milestone photo/video evidence cards, digital Measurement Book (MB), liquidated damages penalty radar. |
| **Module 3: Supply Chain, Logistics & Specialized Verticals** | BOQ-linked requisitions with brand enforcement (Lucky/Falcon/Thatta Cement, Mughal/Amreli Steel), 24-hr advance logistics notice, mandatory 4:00 PM arrival rule, joint GRN & MQR signing, 24-hr defect replacement rule, Khairpur farm herd logs, WHO LTA price guard, NHA toll reconciliation. |
| **Module 4: Financial Management, Billing & Pakistani Tax Engine** | Milestone/Batch/IPC billing, client-specific retention money & DLP vault (30 to 365 days), multi-provincial tax split (FBR WHT ITO 2001, SRB Tariff 54, PRA Tariff 9809, BRA Tariff 9824, Labor tax split, GST exemptions), 6-month ATL filing guard, audited statements for Syed & Co. CA. |
| **Module 5: Machinery, Equipment & Asset Management** | Master machinery fleet inventory, live site deployment log, fuel/maintenance logs, diminishing balance depreciation (15% plant/machinery, 10% furniture/fixtures). |
| **Module 6: Workforce, HR, Labor & Subcontractors** | Staff directory & PEC quota compliance, daily labor muster roll with zero-delayed-wage safeguard, subcontractor task ledgers & payment accounts, HSE & PSEAH compliance. |
| **Module 7: Contract Closeout, Handover & Archiving** | Punch list / snagging management with before/after photos, Form P11 & NGO Substantial/Final completion certificates, retention money & CDR release tracking. |
| **Module 8: Notifications, Alerts & Reporting Engine** | Automated email, SMS, and WhatsApp alerts for tender countdowns, CDR maturity, 24-hr consignment notices, DLP releases, and executive KPI reporting. |
| **Module 9: System Administration, Audit Trails & RBAC** | Role-based access control across 9 distinct user personas (CEO, System Admin Sheeraz Ali, PM, Site Engineer, Finance, Estimator, Subcontractor, Client Inspector), immutable audit trails, and encrypted beneficiary PII. |

---

## 🛠️ Technology Architecture
- **Frontend / Client**: React 19 + Tailwind CSS + Lucide Icons + PWA Shell (offline IndexedDB queue for field DPRs and site photo caching).
- **Backend / API**: Node.js & Express RESTful API with modular architecture (Controllers, Middleware, Services, Models).
- **Database**: PostgreSQL (with SQLite development fallback for rapid zero-dependency local testing).
- **Security & Compliance**: JWT authentication, role-based route guards, PSEAH beneficiary data encryption, audit trail logging.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Git

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd "Tharcon ERP"

# Install dependencies (root, backend, and frontend)
npm install
cd server && npm install
cd ../client && npm install
```

### Running Locally
```bash
# Start backend server (Port 5000)
npm run server

# Start frontend development server (Port 5173)
npm run client

# Run both concurrently
npm run dev
```

---

## 👥 Stakeholders & Key Roles
- **Executive / CEO**: Engr. Mujeeb ur Rehman Jatoi & Engr. Muneer Ahmed
- **System Administrator & IT Lead**: Sheeraz Ali
- **Project Managers**: Engr. Masroor Ahmed, Engr. Rizwan, Engr. Masab
- **Site Engineers**: Waseem Ahmed, Habib-ur-Rehman, Iqbal Soomro, Farman Ali
- **Tender & Estimation**: Engr. Wardha Batool, Naeem Ahmed
- **External Auditors**: Syed & Co. Chartered Accountants

