# NAZAR — Judge Walkthrough & Demo Guide

This document outlines the **3-Minute Judge Experience** demonstrating NAZAR's core capability: turning raw public data into grounded, explainable civic intelligence.

---

## The Golden Demo Scenario: Bandlaguda Community Center Pair

### Background
In Hyderabad constituency (represented by MP Asaduddin Owaisi), two multi-purpose community facilities were sanctioned within 60 days of each other in the same municipal ward (Bandlaguda).

- **Project A (`HYD-2023-0881`)**: "Construction of Multi-Purpose Community Hall & Skill Center at Bandlaguda, Chandrayangutta" (Sanctioned: ₹68.50 Lakh, Agency: TSEWIDC).
- **Project B (`HYD-2023-0894`)**: "Establishment of Multi-Purpose Community Centre and Skill Facility at Bandlaguda Khalsa" (Sanctioned: ₹65.00 Lakh, Agency: GHMC).

NAZAR automatically identifies **3 correlated signals** on Project A and links it directly to Project B.

---

## Step-by-Step Walkthrough

### 1. The Entry Experience (`/`)
1. Open `http://localhost:3000`.
2. Observe the Apple-inspired, civic-clean interface:
   - Sidebar with `NAZAR Beta` and the civic motto: *"Transparency Builds a Stronger India"*.
   - Centered hero: *"Ask NAZAR. Get the bigger picture."*
   - Clear disclaimer pill: *"Independent Civic Prototype · Not an official Gov of India website"*.

### 2. Natural Language Query & AI Grounding
1. Click the prompt chip: **`"Why is project HYD-2023-0881 flagged?"`** (or type it in the search bar).
2. Observe the **Evidence-Grounded Response Panel**:
   - **Chronology Error**: Completion date (01 Mar 2023) precedes start date (10 Apr 2023) by 40 days.
   - **Financial Anomaly**: Sanctioned cost (₹68.50L) is **2.11× above peer median** (₹32.40L).
   - **Duplicate Candidate**: 88% scope text similarity and 1.1 km proximity to `HYD-2023-0894`.
3. Notice: NAZAR never uses accusatory words like "fraud"; it recommends administrative review.

### 3. Deep Dive: Project Intelligence Page (`/projects/HYD-2023-0881`)
1. Click **`"Inspect Flagged Project →"`**.
2. Examine the 6 modular intelligence tabs:
   - **Overview**: Work specifications, MP sponsorship, verified provenance with immutable cryptographic hash (`sha256:...`).
   - **Timeline & Lifecycle**: Visual milestone sequence displaying the **-40 Day Inverted Chronology** alert.
   - **Financials & Peers**: Visual bar chart comparing this project against the peer median (₹32.40L) and 75th percentile (₹39.80L).
   - **Observations**: Breakdown of the 3 active detector findings.

### 4. Side-by-Side Duplicate Comparison
1. In the Observations tab or Evidence tab, click **`"Compare With Candidate: HYD-2023-0894"`**.
2. Inspect the side-by-side comparison modal:
   - Project A vs Project B specifications.
   - Lexical similarity: **88%**.
   - Spatial proximity: **1.1 km**.
   - Sanction interval: **62 days**.
3. Click **`"Launch Investigation for this Pair →"`**.

### 5. Investigation Case Dossier (`/investigations/INV-2025-0042`)
1. View the prioritized review dossier:
   - Case Number: `NZR-HYD-INV-0042` (High Priority).
   - Both works side-by-side with full evidence.
2. Test the **Reviewer Decision Actions**:
   - Click **`"Explain Exception"`** or **`"Request District Info"`**.
   - Enter a review reason: *"Requested revenue parcel survey demarcation from Hyderabad Collectorate."*
   - Click **`"Commit Audit Action"`**.
   - Notice the action instantly appears in the **Immutable Audit Trail Log**.

### 6. AI Report Generation & Live Editing (`/reports` & `/reports/REP-HYD-2024`)
1. Navigate to **Reports** in the sidebar.
2. Open the published review: *"Implementation & Anomaly Review: Hyderabad Parliamentary Constituency (2021–2024)"*.
3. Try the interactive report features:
   - Click **`"⚡ AI Summarize"`** on any section.
   - Click **`"Edit Text"`** to modify content directly.
   - Click **`"Print Dossier"`** or **`"Export Official PDF"`** to generate a clean printable document.
