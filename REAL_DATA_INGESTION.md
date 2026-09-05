# NAZAR — Real Government Data Ingestion & Live Scraper Guide

NAZAR is connected directly to the official **Ministry of Statistics and Programme Implementation (MoSPI) eSAKSHI Public Portal** (`https://mplads.mospi.gov.in`).

It ingests real public developmental works, computes cryptographic lineage hashes, executes 5 deterministic anomaly detectors, and loads the records live into the NAZAR application.

---

## 1. How to Try It Out

### Option A: From the Web UI (One-Click Live Scraper)
1. Open the application at **`http://localhost:3000`**.
2. Click **`Sources`** in the left sidebar (or go to `http://localhost:3000/sources`).
3. Under the **"Live Web Scraper: MoSPI eSAKSHI Government Register"** card:
   - Select any **State** (e.g. *Telangana*, *Maharashtra*, *Karnataka*, *Andhra Pradesh*).
   - Select a **Constituency** (e.g. *HYDERABAD*, *KARIMNAGAR*, *SECUNDERABAD*).
   - Click **`Fetch & Ingest Live Records`**.
4. Watch the real-time terminal output:
   - Direct connection to `https://mplads.mospi.gov.in/rest/PreLoginDashboardData`.
   - Real financial ceilings and actual works retrieved.
   - 5 deterministic detectors run on the live data.
   - Cryptographic lineage hashes (`sha256:...`) generated.
5. Click **`View Ingested Works in Registry →`** or open `http://localhost:3000/projects` to explore the actual live works.

---

### Option B: From the Terminal CLI
You can run the ingestion pipeline directly via Python CLI from the project root:

```bash
# Ingest live works for Hyderabad (Telangana)
py -m ingestion.cli --state "Telangana" --constituency "HYDERABAD"

# Ingest live works for Karimnagar (Telangana)
py -m ingestion.cli --state "Telangana" --constituency "KARIMNAGAR"

# Ingest live works for Secunderabad (Telangana)
py -m ingestion.cli --state "Telangana" --constituency "SECUNDERABAD"

# List all 36 Indian states retrieved live from the government portal
py -m ingestion.cli --list-states

# List all parliamentary constituencies in a state
py -m ingestion.cli --state "Telangana" --list-constituencies
```

---

## 2. Real Works Examples Scraped Live from MoSPI

Here are examples of real government records retrieved live by the scraper:

### Hyderabad Constituency (MP: Asaduddin Owaisi)
- **Work `IN-MOSPI-200883`**: *"Additional class room block in Ground Floor and 1st to Indira Priyadarshini Government Degree College for Women, Nampally, Hyderabad"*
  - Sanctioned Amount: **₹56.00 Lakh**
  - Agency: District Authority Hyderabad
  - NAZAR Observation: *Peer Financial Outlier (8.89× Sector Median)*
  - Lineage Hash: `sha256:0eed4875d3a13fedd7739a8...`

- **Work `IN-MOSPI-305195`**: *"Specialized vehicles and equipment for the fire stations in Hyderabad Parliamentary Constituency"*
  - Sanctioned Amount: **₹1.31 Crore** (₹1,31,49,854)
  - Letter No: `LN/MP762/2026-2027/16`
  - Lineage Hash: `sha256:0eed4875...`

- **Work `IN-MOSPI-278876`**: *"Drilling of power bore well at Girls Hostel, Nizam College, Hyderabad"*
  - Sanctioned Amount: **₹6.30 Lakh**
  - Sector: Drinking Water

### Karimnagar Constituency (MP: Sanjay Kumar Bandi)
- 634 real official work records totaling **₹16.71 Crore**
- Examples:
  - *"Drilling of Bore well and pump set at Burugupalli Village of Gangadhara Mandal"* (₹1.50 Lakh)
  - *"Construction of Community Hall at Cherlapalli village"* (₹3.00 Lakh)
  - *"Providing Open Gym Equipments at ZPHS Ganneruvaram"* (₹2.99 Lakh)

---

## 3. The Real Emblem Logo
The top-left of the sidebar now features the **State Emblem of India** (Ashoka Lion Capital with the three visible lions, chakra abacus, and the Sanskrit motto *"सत्यमेव जयते"*), positioned next to **NAZAR Beta** and **National Anomaly & Zone-based Review** in accordance with the reference design.
