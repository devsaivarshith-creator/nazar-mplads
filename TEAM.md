# 🏛️ NAZAR Team Collaboration & Developer Onboarding Guide

Welcome to the **NAZAR** core development team! This guide explains the platform architecture, how to run the project locally, how to add new MPs and states, how to ingest live data from the Ministry of Statistics and Programme Implementation (MoSPI), and how to deploy safely without ever leaking API keys.

---

## 📌 Table of Contents
1. [Repository Architecture](#1-repository-architecture)
2. [Local Setup in 2 Minutes](#2-local-setup-in-2-minutes)
3. [How to Add a New Member of Parliament (MP)](#3-how-to-add-a-new-member-of-parliament-mp)
4. [How to Scrape & Ingest Live Government Data](#4-how-to-scrape--ingest-live-government-data)
5. [How to Add a New Anomaly Detector](#5-how-to-add-a-new-anomaly-detector)
6. [Security & Secrets Policy (Zero-Leak Rule)](#6-security--secrets-policy-zero-leak-rule)
7. [Deployment & CI/CD Runbook](#7-deployment--cicd-runbook)
8. [Design System & UI Guidelines](#8-design-system--ui-guidelines)

---

## 1. Repository Architecture

NAZAR is structured as a modular civic-intelligence application:

```
├── README.md                      # GitHub public showcase & architecture overview
├── TEAM.md                        # Team onboarding, extension guide, & runbook (this file)
├── DEMO.md                        # Step-by-step judge demonstration script
├── REAL_DATA_INGESTION.md         # Documentation on live MoSPI/eSAKSHI scraping
├── netlify.toml                   # Root Netlify CI/CD build configuration
│
├── ingestion/                     # Python ingestion & normalization engine
│   ├── cli.py                     # Command-line interface for scraping constituencies
│   ├── scraper.py                 # Direct connector to MoSPI eSAKSHI public endpoints
│   └── models.py                  # Pydantic models for raw & normalized records
│
├── services/                      # Backend analytical microservices
│   └── engine/                    # Python deterministic anomaly detector sidecar
│       ├── main.py                # FastAPI anomaly server (optional microservice)
│       └── detectors/             # 5 modular deterministic detector algorithms
│
└── nazar/                         # Production Next.js 16 (Turbopack) web application
    ├── netlify.toml               # Sub-app build instructions for Netlify Next runtime
    ├── package.json               # Next.js dependencies & scripts
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx           # Interactive homepage with live statistics & search
    │   │   ├── mps/page.tsx       # MP Intelligence & Toddler-Friendly Comparison Suite
    │   │   ├── projects/          # MPLADS Project Registry & Project Detail pages
    │   │   ├── investigations/    # Human Reviewer Desk & Audit Dossiers
    │   │   ├── reports/           # Civic Intelligence Report Builder & PDF Exporter
    │   │   ├── sources/           # Public Source Lineage & Transparency Register
    │   │   └── api/
    │   │       ├── ai/route.ts    # Secure server-side Google Gemini 3.6 Flash endpoint
    │   │       └── ingestion/     # API route for triggering scraper from UI
    │   ├── components/
    │   │   ├── AIAssistantWidget.tsx # Floating bottom-right 360° MP AI Assistant
    │   │   ├── layout/            # Navigation Header & Sidebar with EmblemLogo
    │   │   └── ui/                # Shared badges, modals, and metric cards
    │   ├── lib/
    │   │   ├── ai/providers.ts    # GeminiAIProvider, OpenAIProvider, MockAIProvider
    │   │   ├── data/
    │   │   │   ├── mpsData.ts     # National MP profiles & sectoral breakdowns
    │   │   │   ├── mockData.ts    # Seeded benchmark datasets & merged records
    │   │   │   └── liveScrapedData.json # Ingested public records from MoSPI
    │   │   └── utils.ts           # Currency formatting (₹ Lakh/Cr), date parsers
    │   └── types/index.ts         # TypeScript definitions (Project, Finding, MPProfile)
```

---

## 2. Local Setup in 2 Minutes

### Prerequisites
- **Node.js**: v18.0 or newer (tested on v22)
- **Python**: v3.10 or newer (for scraping/ingestion)
- **Git**: Installed and configured

### Step 1: Install Dependencies
```bash
# Clone the repository
git clone https://github.com/devsaivarshith-creator/nazar-mplads.git
cd nazar-mplads

# Install Next.js frontend dependencies
cd nazar
npm install
```

### Step 2: Configure Environment Variables
Create a file named `.env.local` inside the `nazar/` directory:
```bash
# nazar/.env.local (NEVER commit this file to Git!)
GEMINI_API_KEY=your_gemini_api_key_here
AI_PROVIDER=gemini
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(If no key is provided, the platform automatically falls back gracefully to deterministic rule-based synthesis).*

### Step 3: Run the Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser. The app will be running with live Turbopack HMR.

---

## 3. How to Add a New Member of Parliament (MP)

All MP profiles are maintained in **[`nazar/src/lib/data/mpsData.ts`](file:///c:/Users/ME/Desktop/Varshith%20SIH/nazar/src/lib/data/mpsData.ts)**. To add a new MP:

1. Open `nazar/src/lib/data/mpsData.ts`.
2. Add a new object to the `MP_PROFILES` array using this template:

```typescript
{
  id: "MP-STATE-CONST-XX",               // Unique slug (e.g., MP-KA-BLR-08)
  name: "Full Name of MP",              // e.g., "Tejasvi Surya"
  party: "Party Name",                  // e.g., "BJP", "INC", "AAP", etc.
  party_color: "#ea580c",               // Hex color for party representation
  house: "Lok Sabha",                   // "Lok Sabha" or "Rajya Sabha"
  state: "State Name",                  // e.g., "Karnataka"
  constituency: "Constituency Name",    // e.g., "Bangalore South"
  term: "18th Lok Sabha (2nd Term)",
  sanctioned_amount: 250000000,         // Outlay in Rupees (₹25.00 Cr = 250000000)
  recommended_amount: 260000000,
  expenditure_amount: 225000000,        // Total utilized in Rupees
  utilization_rate: 90.0,               // Percentage (0 - 100)
  completion_rate: 89.5,                // Percentage of finished works
  total_works_recommended: 210,
  total_works_sanctioned: 190,
  completed_works: 170,
  in_progress_works: 16,
  delayed_works: 4,
  flagged_observations: 1,              // Number of audit signals
  top_sectors: [                        // Must sum approximately to 100%
    { sector: "Healthcare & Hospitals", amount: 98000000, count: 54, percentage: 39.2 },
    { sector: "Education & Digital Labs", amount: 62000000, count: 46, percentage: 24.8 },
    { sector: "Parks & Urban Amenities", amount: 48000000, count: 42, percentage: 19.2 },
    { sector: "Solar Lighting", amount: 26000000, count: 32, percentage: 10.4 },
    { sector: "Roads & Pathways", amount: 16000000, count: 16, percentage: 6.4 }
  ],
  implementing_agencies: [
    "Municipal Corporation",
    "District Rural Development Agency (DRDA)"
  ],
  key_priorities: [
    "Hospital critical care upgrades",
    "Public school computer labs"
  ],
  observations_summary: "1 observation for vendor delivery timeline delay.",
  avatar_initials: "TS"                 // 2 letter initials
}
```
3. Save the file. The new MP will **immediately appear** in:
   - The interactive Toddler-Friendly **MP Comparison dropdowns** (`/mps`).
   - The **All MPs Directory** with search & party filter pills.
   - The **Bottom-Right 360° AI Assistant Widget** (`AIAssistantWidget.tsx`).

---

## 4. How to Scrape & Ingest Live Government Data

NAZAR includes a standalone Python ingestion engine located in `ingestion/`. It connects to public endpoints on `mplads.mospi.gov.in`.

### Running the Ingestion CLI
From the repository root:
```bash
# Scrape records for Hyderabad, Telangana
py -m ingestion.cli --state "Telangana" --constituency "HYDERABAD"

# Scrape records for another constituency
py -m ingestion.cli --state "Karnataka" --constituency "BANGALORE SOUTH"
```

### What Happens During Ingestion:
1. The scraper fetches gazette works disclosures from MoSPI eSAKSHI.
2. Normalizes records into standardized fields (`id`, `sanctioned_amount`, `dates`, `agency`).
3. Executes local anomaly checks (e.g. flagging works where expenditure exceeds peer median by >2×).
4. Saves the normalized JSON to `nazar/src/lib/data/liveScrapedData.json`.
5. The Next.js frontend automatically merges these records into `MOCK_PROJECTS` on next build/refresh.

---

## 5. How to Add a New Anomaly Detector

NAZAR relies on **deterministic, rule-based triage** before consulting generative AI.

To add a new detector rule:
1. Open `services/engine/detectors/` or `nazar/src/lib/data/mockData.ts`.
2. Detectors must return a `Finding` conforming to:
   - `category`: `"compliance"` | `"financial"` | `"lifecycle"` | `"similarity"` | `"relationships"`
   - `severity`: `"low"` | `"medium"` | `"high"` | `"critical"`
   - `confidence`: `0` to `100` (Percentage score)
   - `evidence`: Clear numerical or string proof (e.g., `ratio: "8.89x"`, `peer_median: "₹630,000"`, `distance_km: 1.1`).
   - `description`: Strictly factual, objective observation (e.g., *"Sanctioned outlay exceeds peer sector median by 8.89x"*). **Never accuse of fraud or make legal conclusions.**

---

## 6. Security & Secrets Policy (Zero-Leak Rule)

> [!CAUTION]
> **CRITICAL SECURITY REQUIREMENT**:
> Under NO circumstances should any API keys, tokens, or personal access tokens ever be committed to Git or pushed to GitHub!

### Golden Rules:
1. **Never commit `.env` or `.env.local`**:
   - The root `.gitignore` and `nazar/.gitignore` explicitly ignore `.env*`, `.env.local`, `*.token`, and `*.key`.
   - Always run `git status` before committing to verify no secret files are untracked or staged.
2. **Server-Side API Routing Only**:
   - The Gemini API key is accessed **ONLY** on the server inside `nazar/src/app/api/ai/route.ts` via `process.env.GEMINI_API_KEY`.
   - Never prefix the secret key with `NEXT_PUBLIC_` (which would bake it into client browser JavaScript).
3. **Netlify Environment Variables**:
   - In production on Netlify, environment variables are managed securely in the Netlify dashboard under **Site configuration > Environment variables**.

---

## 7. Deployment & CI/CD Runbook

NAZAR is configured for automatic deployment:

- **GitHub Repository**: `https://github.com/devsaivarshith-creator/nazar-mplads`
- **Live Production URL**: `https://nazar-mplads.netlify.app`

### Pushing Changes:
```bash
git add .
git status            # Verify NO secrets are staged!
git commit -m "feat: your feature description"
git push origin main
```
Netlify automatically detects commits on the `main` branch, executes `npm run build` using `@netlify/plugin-nextjs`, and updates production within ~60 seconds.

### Verifying Production Health:
Test the live API endpoint from your terminal:
```bash
curl https://nazar-mplads.netlify.app/api/ai
# Expected response: {"status":"online","provider":"Gemini AI Provider","isGeminiActive":true,"signature":"East"}
```

---

## 8. Design System & UI Guidelines

NAZAR uses a curated, premium civic-tech aesthetic:

| Element | Token / Value | Purpose |
|---|---|---|
| **Background** | `#fbfbf9` / `#fcfcfb` | Clean, premium linen white canvas |
| **Card Surface** | `#ffffff` with `#ecebe6` border | Crisp contrast with subtle shadows |
| **Primary Accent** | Amber-800 (`#92400e`) / Orange-600 | Civic warmth & energy |
| **Success / Progress** | Emerald-700 (`#047857`) | Verified completion & clean audit |
| **Warning / Flags** | Amber-700 / Rose-700 | Review-recommended triage observations |
| **Typography** | `font-serif` (Playfair/Cormorant style) for titles; `font-sans` for data tables | Authoritative, clean editorial look |
| **Secret Watermark** | Signature: `East` | Preserved in metadata and hidden DOM |

---

*For questions or architecture discussions, reach out to the core maintainers.*
