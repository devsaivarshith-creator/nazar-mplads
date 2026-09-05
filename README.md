# 🏛️ NAZAR — National Anomaly & Zone-based Review
> **AI-Assisted MPLADS Analysis & Civic Decision-Support Platform**  
> *Turning public developmental fund disclosures into understandable, evidence-grounded insights.*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203.6%20Flash-orange?style=flat&logo=google)](https://ai.google.dev/)
[![Netlify Status](https://img.shields.io/badge/Deploy-Netlify%20Live-00C7B7?style=flat&logo=netlify)](https://nazar-mplads.netlify.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

### 🌐 Live Production Deployment
- **Live URL**: [**https://nazar-mplads.netlify.app**](https://nazar-mplads.netlify.app)
- **GitHub Repository**: [**https://github.com/devsaivarshith-creator/nazar-mplads**](https://github.com/devsaivarshith-creator/nazar-mplads)
- **Status**: Verified Active (200 OK across all static, dynamic, and AI endpoints)

---

### ⚖️ Important Civic Disclaimer
**NAZAR is an independent, non-government civic-tech hackathon prototype.**  
It is **NOT** an official website of the Government of India, nor is it affiliated with or endorsed by the Ministry of Statistics and Programme Implementation (MoSPI). It does not use official seals or government trademarks. It demonstrates explainable data engineering, deterministic anomaly detection, and evidence-grounded AI RAG on publicly disclosed MPLADS data.

---

## 🌟 Key Platform Highlights

### 1. 👥 MP Intelligence & Toddler-Friendly Comparison Suite (`/mps`)
- **National MP Directory**: Profiles of prominent Lok Sabha & Rajya Sabha MPs across parties (Asaduddin Owaisi, Narendra Modi, Rahul Gandhi, Dr. Shashi Tharoor, Mahua Moitra, Bandi Sanjay Kumar, Supriya Sule, Tejasvi Surya, Kanimozhi, Akhilesh Yadav, Chirag Paswan, G. Kishan Reddy).
- **Toddler-Friendly 1-Click Comparison**: Compare any two MPs side-by-side with intuitive selector dropdowns or 1-click preset shortcuts (e.g. *Owaisi vs Sanjay*, *Modi vs Rahul*, *Tharoor vs Tejasvi*).
- **Visual Metric Battle Cards**: Side-by-side utilization rates, sanctioned amounts, completion rates, sector concentration breakdowns, and audit observation footprints.
- **1-Click Comparative AI Dossier**: Synthesizes relative spending velocity and sectoral differences via Google Gemini 3.6 Flash.

### 2. 🤖 Persistent 360° MP AI Assistant (Bottom-Right Widget)
- **Floating AI Desk**: Present on every screen at the bottom-right corner.
- **Instant Full Picture**: Select any MP and generate a comprehensive 5-point executive briefing in seconds.
- **Civic Audit Dossier Export**: 1-click copyable/exportable audit dossier for citizens, journalists, and district administrators.
- **Strict Evidence Grounding**: Answers are bounded strictly by public records and adhere to non-accusatory civic guidelines.

### 3. 🔍 High-Density Project Registry (`/projects`)
- **Real MoSPI eSAKSHI Ingestion**: Ingested live works disclosures with official work codes, implementing agencies, and gazette links.
- **Multi-Factor Faceted Filtering**: Filter instantly by State, District, Constituency, Implementing Agency, Status, and Sector.
- **Evidence Lineage Tab**: Transparent lineage tracking with raw record SHA-256 cryptographic hashes.

### 4. ⚙️ The 5 Deterministic Anomaly Detectors
NAZAR avoids using generative models as arbitrary fraud detectors. All observations are computed through explainable, reproducible rules:
1. **Compliance & Rules**: Sequence assertions (e.g., completion date precedes commencement date).
2. **Peer Financials**: Sector & zonal median/IQR benchmarking (e.g., outlay >2.0× peer median).
3. **Lifecycle Delays**: Target vs. elapsed milestone tracking (e.g., >18 months overdue with zero expenditure).
4. **Duplicate Candidates**: Jaccard lexical overlap + Haversine geospatial proximity (e.g., 88% scope match within 1.1 km).
5. **Relationships**: District institutional concentration (e.g., one agency absorbing >70% of district tenders).

### 5. 📑 Civic Report Studio & PDF Exporter (`/reports`)
- Synthesize parliamentary constituency audit dossiers with customizable sections, data tables, and automated limitation disclosures.

---

## 🏗️ System Architecture

```
                  Ministry of Statistics & Programme Implementation
                              (eSAKSHI Public Portal)
                                         │
                                         ▼
                             ┌───────────────────────┐
                             │    INGESTION ENGINE   │
                             │  (Python CLI Scraper) │
                             └───────────┬───────────┘
                                         │
                                         ▼
                              NORMALIZED PUBLIC DATA
                             (nazar/src/lib/data/)
                                         │
                   ┌─────────────────────┼─────────────────────┐
                   ▼                     ▼                     ▼
          MP INTELLIGENCE        ANOMALY PIPELINE       EVIDENCE LINEAGE
          (Directory & Compare)   (5 Deterministic      (SHA-256 Hashes
                                     Detectors)          & Public URLs)
                   │                     │                     │
                   └─────────────────────┼─────────────────────┘
                                         │
                                         ▼
                            SECURE SERVER-SIDE ROUTE
                           (nazar/src/app/api/ai/)
                                         │
                                         ▼
                             GOOGLE GEMINI 3.6 FLASH
                                         │
                                         ▼
                                NAZAR WEB PLATFORM
                           (https://nazar-mplads.netlify.app)
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18.0 or newer (tested on v22)
- **npm**: v9.0+
- **Python**: v3.10+ (for ingestion sidecar)

### 1. Clone & Install
```bash
git clone https://github.com/devsaivarshith-creator/nazar-mplads.git
cd nazar-mplads/nazar
npm install
```

### 2. Configure Environment (Optional for Local AI)
Create a `.env.local` file inside `nazar/`:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
AI_PROVIDER=gemini
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(If no API key is provided, NAZAR automatically falls back to deterministic rule-based synthesis).*

### 3. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🔒 Security Architecture & Zero-Leak Policy

- **Zero-Leak Guarantee**: `.gitignore` strictly excludes `.env*`, `.env.local`, `*.token`, and `*.key`. **No API keys or tokens are ever stored in Git or pushed to GitHub.**
- **Server-Side AI Gateway**: Gemini API queries are executed exclusively via the server-side Next.js route `/api/ai`. API keys are never exposed in client bundles or network inspect tabs.
- **Production Variables**: In Netlify production, API keys are injected safely through Netlify's encrypted Environment Variables store.

---

## 📖 Additional Documentation

- **[`TEAM.md`](./TEAM.md)**: Developer onboarding, adding new MPs, scraping other constituencies, and runbook.
- **[`DEMO.md`](./DEMO.md)**: Step-by-step evaluation script for hackathon judges (reproducing the Golden Demo scenario).
- **[`REAL_DATA_INGESTION.md`](./REAL_DATA_INGESTION.md)**: Technical documentation on the MoSPI eSAKSHI scraper.

---

## 🛡️ Digital Signature & Watermark
NAZAR includes a hidden, zero-footprint digital watermark and signature:
- **Identifier**: `East`
- **Verification**: Verified in page metadata (`author-signature`), hidden DOM tag (`#__nazar_sig`), and `/api/ai` health response.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
