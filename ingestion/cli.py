"""
NAZAR - Live MPLADS Web Ingestion CLI
Command-line tool to fetch live government records from https://mplads.mospi.gov.in,
normalize fields, run 5 deterministic detectors, and populate the NAZAR database.

Usage:
  py -m ingestion.cli --state "Telangana" --constituency "HYDERABAD"
  py -m ingestion.cli --state "Telangana" --constituency "KARIMNAGAR"
  py -m ingestion.cli --list-states
"""

import argparse
import json
import os
import sys
from pathlib import Path

# Configure utf-8 stdout
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add parent directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from ingestion.source.mplads.client import MospiMpladsClient
from ingestion.pipeline.normalize import normalize_mospi_record, run_detectors_on_scraped

OUTPUT_FILE = Path(__file__).parent.parent / "nazar" / "src" / "lib" / "data" / "liveScrapedData.json"

def main():
    parser = argparse.ArgumentParser(description="NAZAR Live MPLADS Ingestion Tool")
    parser.add_argument("--state", default="Telangana", help="Target Indian State (e.g. Telangana, Maharashtra)")
    parser.add_argument("--constituency", default="HYDERABAD", help="Target Parliamentary Constituency")
    parser.add_argument("--list-states", action="store_true", help="List all 36 Indian states from MoSPI portal")
    parser.add_argument("--list-constituencies", action="store_true", help="List constituencies for the specified state")

    args = parser.parse_args()

    client = MospiMpladsClient()

    print("=" * 65)
    print("NAZAR -- Live Public MPLADS Data Ingestion Tool")
    print("Connecting to official MoSPI eSAKSHI Public Register...")
    print("=" * 65)

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

    matched_const = next((c for c in constituencies if args.constituency.lower() in c["CAPTION"].lower()), None)
    if not matched_const:
        print(f"[!] Constituency '{args.constituency}' not found in {state_name}. Try --list-constituencies")
        return

    const_id = matched_const["ID"]
    const_name = matched_const["CAPTION"]
    print(f"[OK] Target Constituency: {const_name} (ID: {const_id})")

    # Fetch live summary tiles
    print("\n[+] Fetching live financial allocations & work counts...")
    summary = client.get_tiles_summary(state_id, const_id)
    for k, v in summary.items():
        if isinstance(v, list) and len(v) >= 2:
            print(f"  * {k}: {v[1]} (Count/Amt: {v[0]})")

    # Fetch live work items
    print(f"\n[+] Scraping live work items for {const_name}...")
    raw_works = client.get_works(state_id, const_id, key="Works Recommended")
    
    # Filter out summary row if present
    work_items = [w for w in raw_works if "WORK_DESCRIPTION" in w]
    print(f"[OK] Successfully retrieved {len(work_items)} official work records.")

    # Normalize records
    print("[+] Normalizing fields and building cryptographic lineage hashes...")
    normalized = [normalize_mospi_record(w, state_name, const_name) for w in work_items]

    # Run deterministic detectors
    print("[+] Executing NAZAR 5 deterministic anomaly detectors...")
    processed = run_detectors_on_scraped(normalized)

    # Count findings
    flagged_count = sum(1 for p in processed if p["findings"])
    print(f"[OK] Analysis complete: {flagged_count} observation(s) surfaced across {len(processed)} works.")

    # Save to liveScrapedData.json
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump({
            "scraped_at": processed[0]["retrieved_at"] if processed else None,
            "source_authority": "Ministry of Statistics and Programme Implementation (MoSPI) - eSAKSHI",
            "state": state_name,
            "constituency": const_name,
            "total_records": len(processed),
            "flagged_records": flagged_count,
            "projects": processed
        }, f, indent=2)

    print(f"\n[OK] Data successfully loaded into NAZAR app:")
    print(f"    -> {OUTPUT_FILE}")

    # Print preview table
    print("\n--- SAMPLE SCRAPED WORKS FROM LIVE PORTAL ---")
    for i, p in enumerate(processed[:4], 1):
        print(f"\n{i}. {p['project_name'][:70]}...")
        print(f"   Sector: {p['sector']} | Sanctioned: Rs. {p['sanctioned_amount']:,.0f} | Stage: {p['status']}")
        if p["findings"]:
            print(f"   [!] NAZAR Observation: {p['findings'][0]['title']}")
        print(f"   Lineage Hash: {p['raw_record_hash'][:30]}...")

    print("\n[OK] Live government data is now loaded into NAZAR!")

if __name__ == "__main__":
    main()
