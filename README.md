# NAZAR — National Anomaly & Zone-based Review
> **Independent Hackathon Prototype · AI-Assisted MPLADS Analysis Platform**

---

### Important Disclaimer
**NAZAR is NOT an official Government of India website**, nor is it associated with or endorsed by the Ministry of Statistics and Programme Implementation (MoSPI). It does not use official seals, national emblems, or government trademarks. It is an independent civic-tech prototype demonstrating explainable data engineering and evidence-grounded AI on public developmental records.

---

## 1. Product Vision
*"Public data tells us what happened. NAZAR helps us understand what it means."*

The Member of Parliament Local Area Development Scheme (MPLADS) enables MPs to recommend developmental works to address community needs. NAZAR turns large amounts of fragmented public portal disclosures into understandable, evidence-backed insights through:

1. **Search / Ask**: Natural-language inquiries or faceted exploration (State, District, MP, Sector).
2. **Deterministic Triage**: 5 explainable detectors scanning for lifecycle inconsistencies, financial outliers, and scope overlaps.
3. **Evidence Grounding**: Direct traceability to official eSAKSHI disclosures with cryptographic hashes.
4. **Human Review Workflow**: Case prioritization desk with immutable audit trails.
5. **AI Report Generation**: Scoped, synthesized intelligence dossiers with live section editing and PDF export.

---

## 2. Quick Start

### Prerequisites
- Node.js 18+ (Tested on Node.js v22)
- npm 9+
- Python 3.10+ (for sidecar engine)

### Running NAZAR Web Application
```bash
# Navigate to web app
cd nazar

# Install dependencies
npm install

# Start development server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### Running Python Analysis Engine (Optional Sidecar)
```bash
cd services/engine
pip install -r requirements.txt
python main.py
```
Engine operates at `http://localhost:8000`.

---

## 3. Core Architecture
NAZAR operates as a modular monolith:

```
                  MPLADS.GOV.IN / Public Disclosures
                                │
                                ▼
                       ┌─────────────────┐
                       │  DATA INGESTOR  │
                       │ Public Parser   │
                       └────────┬────────┘
                                │
                                ▼
                        NORMALIZED DATA
                                │
                                ▼
                  PostgreSQL / SQLite / Prisma
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
     SEARCH & RAG        ANALYSIS ENGINE      INVESTIGATIONS
   (Deterministic +    (5 Modular Detectors)  (Human Review
   Provider Fallback)                          Audit Trails)
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                ▼
                    NAZAR WEB INTERFACE
```

---

## 4. The 5 Deterministic Detectors

NAZAR deliberately avoids using generative LLMs as arbitrary anomaly detectors. All observations are computed deterministically:

| Detector | Method | Example Flag |
|---|---|---|
| **1. Compliance & Rules** | Relational sequence assertions | Completion date precedes commencement date |
| **2. Peer Financials** | Sector & zonal median/IQR benchmarking | Sanctioned cost is >2.0× peer group median |
| **3. Lifecycle Delays** | Target vs. elapsed milestone tracking | Work is >18 months overdue with zero expenditure |
| **4. Duplicate Works** | Jaccard text overlap + Haversine distance | 88% lexical match within 1.1 km radius |
| **5. Relationships** | District institutional concentration | Implementing agency absorbs >50% of contracts |

---

## 5. End-to-End Judge Walkthrough
See **[`DEMO.md`](./DEMO.md)** for step-by-step instructions to reproduce the golden demo scenario (Project `HYD-2023-0881` vs `HYD-2023-0894`).
