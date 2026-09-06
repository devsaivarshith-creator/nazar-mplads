"""
NAZAR - Live MPLADS Web Ingestion CLI
Command-line tool to fetch exact live government records from https://mplads.mospi.gov.in,
reconcile across all 4 data tables (Recommended, Sanctioned, Completed, Expenditure),
normalize fields, run 5 deterministic detectors, and populate the NAZAR database.

Usage:
  py -m ingestion.cli --state "Telangana" --constituency "HYDERABAD"
  py -m ingestion.cli --state "Telangana" --constituency "KARIMNAGAR"
  py -m ingestion.cli --state "Telangana" --all-constituencies
  py -m ingestion.cli --national
  py -m ingestion.cli --list-states
  py -m ingestion.cli --state "Telangana" --list-constituencies
"""

import argparse
import json
import os
import sys
from pathlib import Path
from datetime import datetime

# Configure utf-8 stdout
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add parent directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from ingestion.source.mplads.client import MospiMpladsClient
from ingestion.pipeline.normalize import (
    merge_and_normalize_mospi_records,
    run_detectors_on_scraped,
)

OUTPUT_FILE = Path(__file__).parent.parent / "nazar" / "src" / "lib" / "data" / "liveScrapedData.json"
MASTER_EXPORT_FILE = Path(__file__).parent.parent / "mplads_exact_scraped_data.json"

NATIONAL_SPOTLIGHT = [
    ("Telangana", "HYDERABAD"),
    ("Telangana", "KARIMNAGAR"),
    ("Telangana", "SECUNDERABAD"),
    ("Uttar Pradesh", "VARANASI"),
    ("Karnataka", "BANGALORE RURAL"),
    ("Delhi", "CHANDINI CHOWK"),
]

def scrape_single_constituency(client: MospiMpladsClient, state_id: int, state_name: str, const_id: int, const_name: str):
    print(f"\n[+] Connecting to MoSPI eSAKSHI for {const_name}, {state_name} (ID: {const_id})...")
    
    cat_data = client.get_all_category_works(state_id, const_id)
    summary = cat_data.get("summary", {})
    mp_info = cat_data.get("mp")
    mp_name = mp_info.get("CAPTION") if mp_info else None

    rec_works = cat_data.get("works_recommended", [])
    sanc_works = cat_data.get("works_sanctioned", [])
    comp_works = cat_data.get("works_completed", [])
    exp_works = cat_data.get("expenditure_works", [])

    print(f"  -> Recommended: {len(rec_works)} | Sanctioned: {len(sanc_works)} | Completed: {len(comp_works)} | Expenditure Records: {len(exp_works)}")
    
    # Merge and reconcile
    normalized = merge_and_normalize_mospi_records(
        rec_works,
        sanc_works,
        comp_works,
        exp_works,
        state_name,
        const_name,
        mp_name_override=mp_name,
    )
    print(f"  [OK] Reconciled {len(normalized)} distinct government project records.")
    return normalized, summary, mp_name

def main():
    parser = argparse.ArgumentParser(description="NAZAR Live MPLADS Ingestion Tool")
    parser.add_argument("--state", default="Telangana", help="Target Indian State (e.g. Telangana, Maharashtra, Uttar Pradesh)")
    parser.add_argument("--constituency", default="HYDERABAD", help="Target Parliamentary Constituency")
    parser.add_argument("--all-constituencies", action="store_true", help="Scrape all constituencies in the specified state")
    parser.add_argument("--national", action="store_true", help="Scrape spotlight constituencies nationwide")
    parser.add_argument("--list-states", action="store_true", help="List all 36 Indian states from MoSPI portal")
    parser.add_argument("--list-constituencies", action="store_true", help="List constituencies for the specified state")
    parser.add_argument("--export", help="Custom path to save JSON export")

    args = parser.parse_args()

    client = MospiMpladsClient()

    print("=" * 68)
    print("NAZAR -- Live Public Government MPLADS Data Web Scraper")
    print("Direct connection: https://mplads.mospi.gov.in/rest/PreLoginDashboardData")
    print("=" * 68)

    try:
        states = client.get_states()
    except Exception as e:
        print(f"[!] Network error connecting to MoSPI portal: {e}")
        return

    if args.list_states:
        print(f"\n[+] Total States on Government Portal: {len(states)}\n")
        for s in states:
            print(f"  [{s['STATE_ID']}] {s['STATE_NAME']}")
        return

    if args.national:
        print("\n[+] Initiating National Spotlight Ingestion across India...")
        all_projects = []
        for s_name, c_name in NATIONAL_SPOTLIGHT:
            matched_s = next((s for s in states if s["STATE_NAME"].lower() == s_name.lower()), None)
            if not matched_s:
                continue
            s_id = matched_s["STATE_ID"]
            consts = client.get_constituencies(s_id)
            matched_c = next((c for c in consts if c_name.lower() in c["CAPTION"].lower()), None)
            if not matched_c:
                continue
            c_id = matched_c["ID"]
            proj, _, _ = scrape_single_constituency(client, s_id, s_name, c_id, matched_c["CAPTION"])
            all_projects.extend(proj)

        print(f"\n[+] Running NAZAR 5 deterministic detectors on {len(all_projects)} national works...")
        processed = run_detectors_on_scraped(all_projects)
        flagged_count = sum(1 for p in processed if p["findings"])

        output_payload = {
            "scraped_at": datetime.utcnow().isoformat() + "Z",
            "source_authority": "Ministry of Statistics and Programme Implementation (MoSPI) - eSAKSHI",
            "state": "National Spotlight",
            "constituency": "Multi-Constituency",
            "total_records": len(processed),
            "flagged_records": flagged_count,
            "projects": processed
        }

        OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_payload, f, indent=2)

        with open(MASTER_EXPORT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_payload, f, indent=2)

        print(f"\n[OK] Successfully ingested {len(processed)} live works ({flagged_count} observations).")
        print(f"     Saved to: {OUTPUT_FILE}")
        print(f"     Master Export: {MASTER_EXPORT_FILE}")
        return

    # Find matching state
    matched_state = next((s for s in states if s["STATE_NAME"].lower() == args.state.lower()), None)
    if not matched_state:
        print(f"[!] State '{args.state}' not found. Try --list-states")
        return

    state_id = matched_state["STATE_ID"]
    state_name = matched_state["STATE_NAME"]
    print(f"\n[OK] Connected to State: {state_name} (ID: {state_id})")

    # Fetch constituencies
    constituencies = client.get_constituencies(state_id)
    if args.list_constituencies:
        print(f"\n[+] Parliamentary Constituencies in {state_name}: {len(constituencies)}\n")
        for c in constituencies:
            print(f"  [{c['ID']}] {c['CAPTION']}")
        return

    all_scraped_projects = []

    if args.all_constituencies:
        print(f"\n[+] Ingesting ALL {len(constituencies)} Parliamentary Constituencies in {state_name}...")
        for c in constituencies:
            c_id = c["ID"]
            c_name = c["CAPTION"]
            proj, _, _ = scrape_single_constituency(client, state_id, state_name, c_id, c_name)
            all_scraped_projects.extend(proj)
        target_const_label = f"All {len(constituencies)} Constituencies"
    else:
        matched_const = next((c for c in constituencies if args.constituency.lower() in c["CAPTION"].lower()), None)
        if not matched_const:
            print(f"[!] Constituency '{args.constituency}' not found in {state_name}. Try --list-constituencies")
            return

        const_id = matched_const["ID"]
        const_name = matched_const["CAPTION"]
        proj, _, mp_name = scrape_single_constituency(client, state_id, state_name, const_id, const_name)
        all_scraped_projects.extend(proj)
        target_const_label = const_name

    # Run deterministic detectors
    print(f"\n[+] Executing NAZAR 5 deterministic anomaly detectors on {len(all_scraped_projects)} records...")
    processed = run_detectors_on_scraped(all_scraped_projects)
    flagged_count = sum(1 for p in processed if p["findings"])
    print(f"[OK] Analysis complete: {flagged_count} observation(s) surfaced across {len(processed)} works.")

    # Save output
    output_payload = {
        "scraped_at": datetime.utcnow().isoformat() + "Z",
        "source_authority": "Ministry of Statistics and Programme Implementation (MoSPI) - eSAKSHI",
        "state": state_name,
        "constituency": target_const_label,
        "total_records": len(processed),
        "flagged_records": flagged_count,
        "projects": processed
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2)

    export_path = Path(args.export) if args.export else MASTER_EXPORT_FILE
    with open(export_path, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2)

    print(f"\n[OK] Exact government records successfully loaded into NAZAR app:")
    print(f"    -> {OUTPUT_FILE}")
    print(f"    -> Export: {export_path}")

    # Print summary statistics
    total_sanctioned = sum(p["sanctioned_amount"] for p in processed)
    total_expended = sum(p["expenditure_amount"] or 0 for p in processed)
    completed_count = sum(1 for p in processed if p["status"] == "Completed")
    in_progress_count = sum(1 for p in processed if p["status"] == "In Progress")

    print("\n" + "=" * 50)
    print(f"EXACT GOVERNMENT SUMMARY: {target_const_label.upper()}")
    print("=" * 50)
    print(f"  * Total Works Analyzed:      {len(processed)}")
    print(f"  * Total Sanctioned Outlay:   ₹{total_sanctioned:,.0f} (₹{total_sanctioned/10000000:.2f} Cr)")
    print(f"  * Recorded Ground Outflow:   ₹{total_expended:,.0f} (₹{total_expended/10000000:.2f} Cr)")
    print(f"  * Completed Works:           {completed_count}")
    print(f"  * In-Progress Works:         {in_progress_count}")
    print(f"  * Flagged Observations:      {flagged_count}")
    print("=" * 50)

    # Print sample preview
    print("\n--- SAMPLE SCRAPED WORKS FROM OFFICIAL GOVERNMENT REGISTER ---")
    for i, p in enumerate(processed[:4], 1):
        print(f"\n{i}. {p['project_name'][:75]}...")
        exp_str = f"₹{p['expenditure_amount']:,.0f}" if p['expenditure_amount'] else "Not Disbursed"
        print(f"   Sector: {p['sector']} | Sanctioned: ₹{p['sanctioned_amount']:,.0f} | Expended: {exp_str} | Status: {p['status']}")
        if p.get("vendors"):
            print(f"   Vendor: {', '.join(p['vendors'][:2])}")
        if p["findings"]:
            print(f"   [!] Observation: {p['findings'][0]['title']}")
        print(f"   Lineage Hash: {p['raw_record_hash'][:32]}...")

    print("\n[OK] Scraped exact live data from MPLADS successfully.")

if __name__ == "__main__":
    main()
