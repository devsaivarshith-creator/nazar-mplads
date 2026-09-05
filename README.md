# 🏛️ NAZAR — National Anomaly & Zone-based Review
> **AI-Powered Civic Oversight & Deterministic Anomaly Detection System for the MPLAD Scheme**  
> *Developed for Smart India Hackathon (SIH) 2026*

[![SIH 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026%20Finalist-blue?style=for-the-badge&logo=target)](https://sih.gov.in)
[![MoSPI Problem Statement](https://img.shields.io/badge/MoSPI%20PS%20ID-SIH26102-orange?style=for-the-badge)](https://sih.gov.in)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Live Netlify](https://img.shields.io/badge/Deploy-Netlify%20Live%20Production-00C7B7?style=for-the-badge&logo=netlify)](https://nazar-mplads.netlify.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

### 🌐 Live Production Links & Repositories
- **Live Production Application**: [**https://nazar-mplads.netlify.app**](https://nazar-mplads.netlify.app)
- **Official GitHub Repository**: [**https://github.com/devsaivarshith-creator/nazar-mplads**](https://github.com/devsaivarshith-creator/nazar-mplads)
- **Status**: ✅ **100% Active & Verified** (Next.js 16 Turbopack + Gemini 3.6 / Flash AI + Live Real Data Ingestion)

---

## 🎯 Smart India Hackathon 2026 Problem Alignment

| Attribute | Hackathon Submission Details |
| :--- | :--- |
| **Problem Statement ID** | **SIH26102** |
| **Problem Statement Title** | **Development of an AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation** |
| **Ministry / Department** | **Ministry of Statistics and Programme Implementation (MoSPI)** |
| **Theme / Category** | **Smart Governance, Public Accountability & Citizen Empowerment (Software Edition)** |
| **Project Codename** | **NAZAR (National Anomaly & Zone-based Review)** |
| **Target End-Users** | District Collectors, MoSPI Programme Officers, Citizens, Investigative Journalists, Audit Committees |

---

### ⚖️ Important Civic Disclaimer
**NAZAR is an independent, non-government civic-tech hackathon prototype developed for SIH 2026.**  
It is **NOT** an official website of the Government of India, nor is it endorsed by the Ministry of Statistics and Programme Implementation (MoSPI). It does not use official seals or national trademarks. It demonstrates explainable data engineering, deterministic anomaly detection, and evidence-grounded AI RAG on publicly disclosed MPLADS data.

---

## 📖 Executive Summary & Problem Understanding

Under the **Members of Parliament Local Area Development Scheme (MPLADS)**, each MP is allocated **₹5 Crore per year** to recommend developmental works creating durable community assets (drinking water, primary education, healthcare, sanitation, and roads). 

Despite digital monitoring platforms like **eSAKSHI**, public audits and CAG reports consistently highlight several key bottlenecks:
1. **Prolonged Lifecycle Delays**: Stalled infrastructure projects running 180 to 365+ days past sanctioned deadlines with zero interim expenditure disclosures.
2. **Timeline Inversions & Data Entry Anomalies**: Completion dates entered earlier than commencement dates, pointing to clerical oversight or retroactive compliance.
3. **Geospatial & Lexical Duplications**: Redundant proposals with high text similarity located within 1 to 3 km of existing sanctioned works.
4. **Institutional Contractor Concentration**: Over-reliance on single state agencies or specific private contractors (>50% to 70% of district works).
5. **Citizen-Administration Disconnect**: Massive raw CSVs and fragmented gazettes that are impenetrable to everyday citizens and local stakeholders.

### 💡 The NAZAR Solution
NAZAR bridges this gap by combining **5 deterministic mathematical anomaly engines** with **evidence-grounded AI retrieval (RAG)**. It ingests official eSAKSHI project registries, PRS Legislative Research parliamentary attendance/question logs, and MyNeta/ADR asset and education affidavits into a unified, high-performance civic oversight workspace.

---

## ⚡ Key System Capabilities

### 1. 🤖 Conversational AI Investigation Studio (Homepage Hero)
- **Natural Language Inquiry**: Query any MP, constituency, project code, or general date information directly (e.g., *"Why is project HYD-2023-0881 flagged?"*, *"who is the mp of srikakulam"*, *"list all mps of telanagana"*, or *"tell me about today"*).
- **Rich Formatted Markdown Rendering**: Automatically renders headers, bullet points, interactive tables, links, and bold typography without showing raw tags.
- **Dynamic Context Switching**: Seamlessly switch between MPs without session locking.
- **Automated Investigation Dossier Export**: Generate a multi-page, evidence-backed dossier ready to download or copy in Markdown.

### 2. ⚙️ The 5 Deterministic Anomaly Detectors
NAZAR strictly avoids speculative LLM "hallucinated fraud" accusations. All signals are computed mathematically:
1. **Rule & Compliance Validator**: Detects sequence inversions (e.g. completion recorded before commencement) and missing milestone expenditure disclosures.
2. **Peer Financial Benchmarking**: Evaluates local projects against IQR (Interquartile Range) cost distributions; flags projects exceeding 2.0× peer median cost.
3. **Lifecycle Overdue Engine**: Compares sanctioned schedules with elapsed calendar days (>180 or >300 days overdue).
4. **Spatial & Lexical Duplicate Detector**: Uses Haversine geospatial proximity (<3 km) and Jaccard lexical overlap (>75%) to detect redundant works.
5. **Institutional Concentration Analyzer**: Computes the Herfindahl-Hirschman Index (HHI) of executing agencies to flag monopoly bottlenecks (>50% share).

### 3. 👥 Toddler-Friendly MP Intelligence & 1-Click Comparison (`/mps`)
- **Comprehensive National MP Profiles**: Verified coverage of MPs across India (Dr. Shashi Tharoor, Kinjarapu Ram Mohan Naidu, Asaduddin Owaisi, Narendra Modi, Rahul Gandhi, Bandi Sanjay Kumar, G. Kishan Reddy, etc.).
- **1-Click Side-by-Side Comparison**: Compare any two MPs on fund utilization, attendance, questions asked, debates, declared assets, education, and delayed works.
- **Pre-Configured Battle Cards**: Quick presets like *Owaisi vs Sanjay*, *Modi vs Rahul*, and *Tharoor vs Tejasvi*.

### 4. 🔍 High-Density Project Registry (`/projects`)
- Browse real and synthesized MPLADS projects with live status badges (`Completed`, `In Progress`, `Delayed`, `Flagged`).
- Filter dynamically by State, District, Constituency, Implementing Agency, and Category.
- Direct links to project inspection pages (`/projects/[id]`) with milestone lifecycle visualizers and financial peer group box plots.

### 5. 📑 Human-in-the-Loop Investigation Desk & Report Studio (`/reports`)
- **Reviewer Desk (`/investigations/[id]`)**: Case management for district reviewers with 7 actionable triage options (*Explain Exception*, *Mark Clerical Error*, *Mark Duplicate*, *Request Info*, *Assign Inspection*, *Escalate*, *Close*).
- **Parliamentary Constituency Audit Dossier**: 1-click printable and exportable audit report with limitation disclosures.

---

## 🏗️ Technical Architecture

```
                    DATA SOURCES (Public Registers)
        ┌───────────────────┬───────────────────┬───────────────────┐
        │   MoSPI eSAKSHI   │   PRS Sansad.in   │   ADR / MyNeta    │
        │  (Project Works)  │ (Attendance/Q's)  │(Assets/Education) │
        └─────────┬─────────┴─────────┬─────────┴─────────┬─────────┘
                  │                   │                   │
                  ▼                   ▼                   ▼
       ┌─────────────────────────────────────────────────────────────┐
       │             DATA INGESTION & NORMALIZATION                  │
       │       Python Scraper (BeautifulSoup4 + Requests + Pandas)   │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
       ┌─────────────────────────────────────────────────────────────┐
       │               5 DETERMINISTIC ANOMALY ENGINES               │
       │  1. Compliance  2. Financial  3. Delays  4. Duplicates  5. Agency │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
       ┌─────────────────────────────────────────────────────────────┐
       │             NEXT.JS 16 SERVER-SIDE AI GATEWAY               │
       │                   (/api/ai & /api/ingestion)                │
       │          - Context Resolution & Typos Normalization         │
       │          - Google Gemini 3.6 / Flash Lite Integration       │
       │          - Cryptographic SHA-256 Evidence Provenance        │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
       ┌─────────────────────────────────────────────────────────────┐
       │                    NAZAR WEB WORKSPACE                      │
       │     - Tailwind CSS + Lucide Icons + Recharts Analytics      │
       │     - Custom MarkdownRenderer (Zero-Dependency)             │
       │     - Responsive Desktop / Tablet / Mobile UI               │
       └─────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack & Dependencies

| Component | Technology | Version / Specification |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router, Turbopack) | `v16.3.4` |
| **Language** | TypeScript | `v5.0+` |
| **UI Library** | React | `v19.2.8` |
| **Styling** | Tailwind CSS + PostCSS | `v4.0` |
| **Icons** | Lucide React | `v1.41.0` |
| **Data Visuals** | Recharts | `v3.10.1` |
| **AI LLM Gateway** | Google Gemini API (`gemini-flash-lite-latest`) | REST Server Gateway |
| **Data Processing**| Python (BeautifulSoup4, Pandas) | `v3.10+` |
| **Deployment** | Netlify Edge Functions | Production CI/CD |

---

## 🚀 How to Clone, Install & Run Locally

### Prerequisites
Before getting started, make sure you have the following installed:
- **Node.js**: `v18.0.0` or newer (recommended `v20` or `v22 LTS`)
- **npm**: `v9.0.0` or newer
- **Git**: Installed and accessible from your terminal
- **Python**: `v3.10+` (optional, only required if running the raw web scraper)

---

### Step 1: Clone the Repository
Clone the repository using HTTPS:
```bash
git clone https://github.com/devsaivarshith-creator/nazar-mplads.git
cd nazar-mplads
```

---

### Step 2: Install Frontend Dependencies
Navigate into the `nazar` directory and install the required npm packages:
```bash
cd nazar
npm install
```

---

### Step 3: Configure Environment Variables
Inside the `nazar` folder, create a `.env.local` file:
```bash
# On Linux / macOS:
touch .env.local

# On Windows PowerShell:
New-Item -ItemType File .env.local
```

Populate `.env.local` with your configuration:
```env
# Optional: Provide Google Gemini API Key for live AI synthesis.
# If omitted, NAZAR automatically falls back to its deterministic rule engine!
GEMINI_API_KEY=your_gemini_api_key_here
AI_PROVIDER=gemini

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Security Note**: Never commit `.env.local` or secret keys to Git. The repository includes strict `.gitignore` protection.

---

### Step 4: Run the Development Server
Launch the Next.js development server:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

### Step 5: (Optional) Ingest Real Public Data via Python Sidecar
To scrape and update real-world constituency records from public portals:
```bash
# From repository root
cd ingestion
pip install -r requirements.txt
python scrape_esakshi.py --constituency "Hyderabad" --limit 50
```

---

### Step 6: Build for Production
To verify the production build locally:
```bash
cd nazar
npm run build
npm run start
```

---

## 🧪 Interactive Evaluation Script for SIH Judges

To test and evaluate NAZAR during the SIH evaluation rounds, follow this test matrix:

| Test Case | Steps to Execute | Expected Behavior |
| :--- | :--- | :--- |
| **1. Inquire on Stalled Works** | On the homepage hero, type: `Incomplete projects by MP Asaduddin Owaisi in Hyderabad` | Displays Asaduddin Owaisi's card, Hyderabad metrics, 2 flagged overdue projects with root causes, and multi-source citations. |
| **2. Test Anomaly Detection** | Click on project `HYD-2023-0881` or query `Why is project HYD-2023-0881 flagged?` | Highlights the **-40 day timeline inversion**, **2.11× cost benchmark flag**, and **88% duplicate overlap** with project `HYD-2023-0894`. |
| **3. Constituency MP Lookup** | In the search bar, ask: `who is the mp of srikakulam` | Instantly identifies **Kinjarapu Ram Mohan Naidu** (TDP), Union Civil Aviation Minister, with Srikakulam delayed works. |
| **4. State-Wide MP Roster** | In the search bar, ask: `list all mps of telanagana` (with typo) | Parses typo tolerance and outputs a formatted 17-seat markdown table of all Telangana MPs. |
| **5. Toddler MP Comparison** | Go to `/mps`, click the preset button **"Owaisi vs Sanjay"** | Renders side-by-side battle cards with utilization rates, attendance, questions, assets, and AI comparative analysis. |
| **6. Investigation Review Desk** | Open `/investigations/INV-2025-0042` and click **"Request Agency Info"** | Appends the action into an immutable audit timeline in real time. |
| **7. Export Dossier** | Go to `/reports`, select **"REP-HYD-2024"**, and click **"Copy Markdown"** or **"Print / Save PDF"** | Generates an exportable parliamentary constituency audit report. |

---

## 🔒 Security Architecture & Zero-Leak Policy

- **Zero API Key Leakage**: `.gitignore` strictly blocks all `.env*`, `.token`, and private configuration files.
- **Server-Side API Gateway**: All AI queries are executed exclusively inside server-side Next.js route handlers (`/api/ai`). Secrets are never bundled into client JavaScript.
- **Cryptographic Provenance**: Raw records include SHA-256 digest verification to ensure evidence tamper-proofing.
- **Hidden Digital Signature**: Verified watermark `East` embedded across page metadata, hidden DOM attributes (`#__nazar_sig`), and API response health checks.

---

## 👥 Team & Development Credits

- **Team Name**: NAZAR Innovation Squad (SIH 2026)
- **Problem Statement ID**: SIH26102
- **Lead Developer**: Dev Sai Varshith
- **Documentation**: See [`TEAM.md`](./TEAM.md) for full role breakdowns, contribution runbook, and coding conventions.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
