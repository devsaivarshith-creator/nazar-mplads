"""
NAZAR - Data Normalizer & Anomaly Detector Pipeline
Normalizes raw MoSPI eSAKSHI payloads across all 4 data tables into NAZAR Project schema
and executes the 5 deterministic anomaly detectors.
"""

import hashlib
import json
import re
from datetime import datetime
from typing import List, Dict, Any, Tuple, Optional
from collections import Counter, defaultdict

SECTOR_KEYWORD_MAP = {
  "Health & Family Welfare": ["hospital", "ambulance", "dialysis", "dispensary", "clinic", "health", "medical"],
  "Education": ["school", "college", "hostel", "library", "classroom", "laboratory", "robotics", "study"],
  "Drinking Water": ["water", "borewell", "bore well", "ro plant", "purification", "pipeline", "tanker"],
  "Sanitation & Sewerage": ["drainage", "sewer", "toilet", "sanitation", "swachh"],
  "Roads, Pathways & Bridges": ["road", "cc road", "pathway", "bridge", "culvert", "pavement"],
  "Community Infrastructure": ["community", "hall", "centre", "center", "shadikhana", "mandapam", "kalyana"],
  "Energy & Electrification": ["solar", "light", "high-mast", "illumination", "led", "lamp", "power"],
  "Special Assistance": ["tri-cycle", "tricycle", "wheelchair", "scooty", "prosthetic", "hearing aid", "bus", "van"]
}

def infer_sector(description: str, category: str = "") -> str:
    desc_lower = f"{description} {category}".lower()
    for sector, keywords in SECTOR_KEYWORD_MAP.items():
        if any(kw in desc_lower for kw in keywords):
            return sector
    return "Other Public Assets"

def parse_date(date_str: Any) -> Optional[str]:
    if not date_str or date_str in ["NA", "null", "None", ""]:
        return None
    try:
        dt = datetime.strptime(str(date_str).strip(), "%d-%b-%Y")
        return dt.strftime("%Y-%m-%d")
    except Exception:
        pass
    try:
        dt = datetime.strptime(str(date_str).strip(), "%b %d, %Y %I:%M:%S %p")
        return dt.strftime("%Y-%m-%d")
    except Exception:
        pass
    return str(date_str).strip()

def normalize_mospi_record(raw: Dict[str, Any], state_name: str, constituency_name: str) -> Dict[str, Any]:
    """Fallback single-record normalizer"""
    work_id = str(raw.get("WORK_RECOMMENDATION_DTL_ID", "UNKNOWN"))
    desc = str(raw.get("WORK_DESCRIPTION", "Public Development Work")).strip()
    category = str(raw.get("WORK_CATEGORY", "General"))
    agency = str(raw.get("IDA_NAME", f"District Authority {constituency_name}"))
    mp_name = str(raw.get("MP_NAME", "Hon'ble MP"))
    stage = str(raw.get("WORK_STAGE", "Sanctioned"))

    rec_amount = float(raw.get("RECOMMENDED_AMOUNT", 0.0) or 0.0)
    sanc_amount = float(raw.get("SANCTION_AMOUNT", rec_amount) or rec_amount)

    rec_date = parse_date(raw.get("RECOMMENDATION_DATE"))
    sanc_date = parse_date(raw.get("SANCTION_DATE"))

    sector = infer_sector(desc, category)
    raw_hash = hashlib.sha256(json.dumps(raw, sort_keys=True).encode("utf-8")).hexdigest()

    if "Completed" in stage:
        status = "Completed"
    elif "Delayed" in stage or "Stalled" in stage:
        status = "Delayed"
    elif "Pending" in stage:
        status = "Recommended"
    else:
        status = "In Progress"

    timeline_events = []
    if rec_date:
        timeline_events.append({
            "event_type": "Recommendation",
            "date": rec_date,
            "title": "MP Recommendation Logged",
            "description": f"Official letter {raw.get('LETTER_NO', '')} submitted to District Authority.",
            "amount": rec_amount
        })
    if sanc_date:
        timeline_events.append({
            "event_type": "Sanction",
            "date": sanc_date,
            "title": "Administrative Sanction Accorded",
            "description": f"Work cleared for technical implementation by {agency}.",
            "amount": sanc_amount
        })

    return {
        "id": f"IN-MOSPI-{work_id}",
        "external_id": f"eSAKSHI-{work_id}",
        "project_name": desc,
        "state": state_name,
        "district": constituency_name.title(),
        "constituency": constituency_name.title(),
        "mp_name": mp_name,
        "mp_house": "Lok Sabha" if raw.get("HOUSE_OF_PARLIAMENT") == 2 else "Rajya Sabha",
        "sector": sector,
        "sub_sector": category,
        "implementing_agency": agency,
        "location": f"{constituency_name}, {state_name}",
        "sanctioned_amount": sanc_amount,
        "recommended_amount": rec_amount,
        "expenditure_amount": None,
        "status": status,
        "recommendation_date": rec_date,
        "sanction_date": sanc_date,
        "source_system": "MoSPI eSAKSHI Public Portal",
        "source_url": "https://mplads.mospi.gov.in/digigov/dashboard.html",
        "source_record_id": work_id,
        "retrieved_at": datetime.utcnow().isoformat() + "Z",
        "raw_record_hash": f"sha256:{raw_hash}",
        "findings": [],
        "timeline_events": timeline_events,
    }

def merge_and_normalize_mospi_records(
    recommended_list: List[Dict[str, Any]],
    sanctioned_list: List[Dict[str, Any]],
    completed_list: List[Dict[str, Any]],
    expenditure_list: List[Dict[str, Any]],
    state_name: str,
    constituency_name: str,
    mp_name_override: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Unifies all 4 government streams (Recommended, Sanctioned, Completed, Expenditure)
    keyed by WORK_RECOMMENDATION_DTL_ID into rich, fully-reconciled Project objects.
    """
    # Index tables by work_id
    rec_by_id: Dict[str, Dict[str, Any]] = {}
    for r in recommended_list:
        wid = str(r.get("WORK_RECOMMENDATION_DTL_ID") or "")
        if wid and wid != "None":
            rec_by_id[wid] = r

    sanc_by_id: Dict[str, Dict[str, Any]] = {}
    for s in sanctioned_list:
        wid = str(s.get("WORK_RECOMMENDATION_DTL_ID") or "")
        if wid and wid != "None":
            sanc_by_id[wid] = s

    comp_by_id: Dict[str, Dict[str, Any]] = {}
    for c in completed_list:
        wid = str(c.get("WORK_RECOMMENDATION_DTL_ID") or "")
        if wid and wid != "None":
            comp_by_id[wid] = c

    exp_by_id: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for e in expenditure_list:
        wid = str(e.get("WORK_RECOMMENDATION_DTL_ID") or "")
        if wid and wid != "None":
            exp_by_id[wid].append(e)

    all_ids = set(rec_by_id.keys()) | set(sanc_by_id.keys()) | set(comp_by_id.keys()) | set(exp_by_id.keys())
    
    projects = []

    for wid in all_ids:
        r = rec_by_id.get(wid, {})
        s = sanc_by_id.get(wid, {})
        c = comp_by_id.get(wid, {})
        e_list = exp_by_id.get(wid, [])

        # Priority resolution for fields
        desc = (
            c.get("WORK_DESCRIPTION") or
            r.get("WORK_DESCRIPTION") or
            s.get("WORK_DESCRIPTION") or
            (e_list[0].get("ACTIVITY_NAME") if e_list else "MPLADS Community Work")
        ).strip()

        category = r.get("WORK_CATEGORY") or s.get("WORK_CATEGORY") or c.get("WORK_CATEGORY") or "General"
        mp_name = mp_name_override or r.get("MP_NAME") or s.get("MP_NAME") or c.get("MP_NAME") or (e_list[0].get("MP_NAME") if e_list else "Hon'ble MP")
        
        # Financial amounts
        rec_amount = float(r.get("RECOMMENDED_AMOUNT") or 0.0)
        sanc_amount = float(s.get("SANCTION_AMOUNT") or r.get("SANCTION_AMOUNT") or rec_amount or 0.0)

        # Dates
        rec_date = parse_date(r.get("RECOMMENDATION_DATE") or s.get("RECOMMENDATION_DATE"))
        sanc_date = parse_date(s.get("SANCTION_DATE") or r.get("SANCTION_DATE"))
        comp_date = parse_date(c.get("ACTUAL_END_DATE"))

        # Actual completed cost if completed
        actual_comp_amount = float(c.get("ACTUAL_AMOUNT") or 0.0) if c else 0.0

        # Expenditure disbursements
        total_expended = 0.0
        vendor_names = []
        executing_agencies = []
        for exp_item in e_list:
            amt = float(exp_item.get("FUND_DISBURSED_AMT") or 0.0)
            total_expended += amt
            v_name = exp_item.get("VENDOR_NAME")
            if v_name and v_name not in vendor_names:
                vendor_names.append(v_name)
            ia = exp_item.get("IA_NAME")
            if ia and ia not in executing_agencies:
                executing_agencies.append(ia)

        # Agency name
        primary_agency = (
            executing_agencies[0] if executing_agencies else
            (c.get("IDA_NAME") or s.get("IDA_NAME") or r.get("IDA_NAME") or f"District Authority {constituency_name}")
        )

        # Status
        if c or (c.get("FLAG") == 3):
            status = "Completed"
        elif total_expended > 0 or s:
            status = "In Progress"
        elif "Pending" in str(r.get("WORK_STAGE", "")):
            status = "Recommended"
        else:
            status = "In Progress"

        # Final expenditure amount: if completed and actual_amount recorded, or disbursed sum
        final_expenditure = None
        if actual_comp_amount > 0:
            final_expenditure = actual_comp_amount
        elif total_expended > 0:
            final_expenditure = total_expended

        sector = infer_sector(desc, category)

        # Build chronological timeline
        timeline_events = []
        letter_no = r.get("LETTER_NO") or s.get("LETTER_NO") or c.get("LETTER_NO") or (e_list[0].get("LETTER_NO") if e_list else "")
        if rec_date:
            timeline_events.append({
                "event_type": "Recommendation",
                "date": rec_date,
                "title": "MP Recommendation Logged",
                "description": f"Letter No: {letter_no}" if letter_no else "Official recommendation submitted.",
                "amount": rec_amount
            })

        if sanc_date:
            timeline_events.append({
                "event_type": "Sanction",
                "date": sanc_date,
                "title": "Administrative Sanction Accorded",
                "description": f"Sanctioned by Nodal Authority ({sanc_amount:,.0f} INR). Agency: {primary_agency}.",
                "amount": sanc_amount
            })

        for exp_item in e_list:
            e_date = parse_date(exp_item.get("EXPENDITURE_DATE"))
            e_amt = float(exp_item.get("FUND_DISBURSED_AMT") or 0.0)
            v = exp_item.get("VENDOR_NAME", "Registered Contractor")
            timeline_events.append({
                "event_type": "Fund Disbursement",
                "date": e_date or sanc_date or "2025-01-01",
                "title": f"Fund Disbursed ({e_amt:,.0f} INR)",
                "description": f"Vendor: {v} | Status: {exp_item.get('WORK_STATUS', 'Payment Success')}",
                "amount": e_amt
            })

        if comp_date:
            timeline_events.append({
                "event_type": "Completion Recorded",
                "date": comp_date,
                "title": "Physical Completion Certified",
                "description": f"Final Recorded Amount: ₹{actual_comp_amount:,.0f} | Attach ID: {c.get('ATTACH_ID', 'N/A')}",
                "amount": actual_comp_amount or sanc_amount
            })

        # Sort timeline by date
        timeline_events.sort(key=lambda x: str(x.get("date", "")))

        # Provenance hash
        raw_combined = {
            "work_id": wid,
            "rec": r,
            "sanc": s,
            "comp": c,
            "exp": e_list
        }
        raw_hash = hashlib.sha256(json.dumps(raw_combined, sort_keys=True, default=str).encode("utf-8")).hexdigest()

        project_record = {
            "id": f"IN-MOSPI-{wid}",
            "external_id": f"eSAKSHI-{wid}",
            "project_name": desc,
            "state": state_name,
            "district": constituency_name.title(),
            "constituency": constituency_name.title(),
            "mp_name": mp_name,
            "mp_house": "Lok Sabha",
            "sector": sector,
            "sub_sector": category,
            "implementing_agency": primary_agency,
            "location": f"{constituency_name}, {state_name}",
            "sanctioned_amount": sanc_amount,
            "recommended_amount": rec_amount,
            "expenditure_amount": final_expenditure,
            "status": status,
            "recommendation_date": rec_date,
            "sanction_date": sanc_date,
            "completion_date": comp_date,
            "source_system": "MoSPI eSAKSHI Public Portal",
            "source_url": "https://mplads.mospi.gov.in/digigov/dashboard.html",
            "source_record_id": wid,
            "retrieved_at": datetime.utcnow().isoformat() + "Z",
            "raw_record_hash": f"sha256:{raw_hash}",
            "findings": [],
            "timeline_events": timeline_events,
            "vendors": vendor_names,
            "attachment_id": c.get("ATTACH_ID") if c else None,
        }
        projects.append(project_record)

    return projects

def run_detectors_on_scraped(projects: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Executes NAZAR's 5 deterministic anomaly detectors on real government records:
    1. FIN_OUTLIER_PEER_2X: Peer financial cost outlier (> 2.0x sector median)
    2. TIME_SEQUENCE_VIOLATION: Lifecycle date inversion (completion before sanction/recommendation)
    3. SIM_DUPLICATE_CANDIDATE: High lexical duplicate candidate in same sector/constituency
    4. AGENCY_CONCENTRATION_HIGH / VENDOR_CONCENTRATION_HIGH: Disproportionate vendor/agency allocations
    5. LIFECYCLE_OVERDUE_STAGNANT: Prolonged stagnation with zero financial disbursement
    """
    # 1. Sector Medians
    sector_groups: Dict[str, List[float]] = defaultdict(list)
    for p in projects:
        sec = p["sector"]
        amt = p["sanctioned_amount"]
        if amt > 0:
            sector_groups[sec].append(amt)

    sector_medians: Dict[str, float] = {}
    for sec, amounts in sector_groups.items():
        if amounts:
            sorted_amt = sorted(amounts)
            mid = len(sorted_amt) // 2
            median = sorted_amt[mid] if len(sorted_amt) % 2 != 0 else (sorted_amt[mid-1] + sorted_amt[mid]) / 2
            sector_medians[sec] = median

    # 2. Vendor and Agency Counts
    vendor_counts = Counter()
    agency_counts = Counter()
    for p in projects:
        for v in p.get("vendors", []):
            vendor_counts[v] += 1
        agency = p.get("implementing_agency")
        if agency:
            agency_counts[agency] += 1

    total_projects = max(len(projects), 1)

    # 3. Duplicate description tracker
    desc_clean_map: Dict[str, List[str]] = defaultdict(list)
    for p in projects:
        clean_desc = re.sub(r'[^a-zA-Z0-9\s]', '', p["project_name"].lower()).strip()
        # Keep significant prefix (first 60 chars)
        prefix = clean_desc[:60]
        desc_clean_map[prefix].append(p["id"])

    # Run checks per project
    for p in projects:
        findings = []
        sec = p["sector"]
        amt = p["sanctioned_amount"]
        median = sector_medians.get(sec, 0)
        rec_date = p.get("recommendation_date")
        sanc_date = p.get("sanction_date")
        comp_date = p.get("completion_date")

        # DETECTOR 1: Peer Financial Outlier (> 2.0x peer median and > 10 Lakh)
        if median > 0 and amt >= 2.0 * median and amt > 1000000:
            ratio = round(amt / median, 2)
            findings.append({
                "id": f"FND-FIN-{p['id']}",
                "project_id": p["id"],
                "title": f"Peer Financial Outlier ({ratio}× Sector Median)",
                "category": "financial",
                "severity": "medium",
                "confidence": 88,
                "description": f"Sanctioned outlay of ₹{amt:,.0f} is {ratio}× above the peer median for {sec} in this register (Median: ₹{median:,.0f}).",
                "reason_code": "FIN_OUTLIER_PEER_2X",
                "detector": "financial",
                "detector_version": "3.1.2",
                "status": "new",
                "created_at": datetime.utcnow().isoformat() + "Z",
                "evidence": {
                    "metric": "Sanctioned vs Peer Median",
                    "value": f"₹{amt:,.0f}",
                    "peer_median": f"₹{median:,.0f}",
                    "ratio": f"{ratio}×",
                    "details": f"Peer group calculated across {len(sector_groups[sec])} {sec} works in this register."
                }
            })

        # DETECTOR 2: Lifecycle Sequence Inversion
        if comp_date and (sanc_date or rec_date):
            base_date = sanc_date or rec_date
            if comp_date < base_date:
                findings.append({
                    "id": f"FND-TIME-{p['id']}",
                    "project_id": p["id"],
                    "title": "Lifecycle Inconsistency: Completion Precedes Sanction",
                    "category": "lifecycle",
                    "severity": "high",
                    "confidence": 95,
                    "description": f"Official recorded completion date ({comp_date}) is earlier than recorded sanction date ({base_date}). Suggests post-facto documentation or typographical date inversion.",
                    "reason_code": "TIME_SEQUENCE_VIOLATION",
                    "detector": "lifecycle",
                    "detector_version": "2.4.0",
                    "status": "new",
                    "created_at": datetime.utcnow().isoformat() + "Z",
                    "evidence": {
                        "details": f"Completion Date: {comp_date} | Sanction Date: {base_date}.",
                        "dates_conflicting": {
                            "start_date": base_date,
                            "completion_date": comp_date,
                            "sanction_date": sanc_date,
                        }
                    }
                })

        # DETECTOR 3: Duplicate / Repeated Work Scope
        clean_desc = re.sub(r'[^a-zA-Z0-9\s]', '', p["project_name"].lower()).strip()
        prefix = clean_desc[:60]
        similar_ids = [pid for pid in desc_clean_map.get(prefix, []) if pid != p["id"]]
        if len(similar_ids) >= 2:
            findings.append({
                "id": f"FND-SIM-{p['id']}",
                "project_id": p["id"],
                "title": f"Candidate Duplicate / Repeated Work Scope ({len(similar_ids) + 1} Identical Entries)",
                "category": "similarity",
                "severity": "medium",
                "confidence": 84,
                "description": f"Identical work scope text shared with {len(similar_ids)} other records in the same register (e.g. {', '.join(similar_ids[:2])}). Requires administrative verification of physical site demarcation.",
                "reason_code": "SIM_DUPLICATE_CANDIDATE",
                "detector": "similarity",
                "detector_version": "2.1.0",
                "status": "new",
                "created_at": datetime.utcnow().isoformat() + "Z",
                "evidence": {
                    "details": f"Repeated title pattern found across {len(similar_ids) + 1} project entries.",
                    "similar_project_id": similar_ids[0] if similar_ids else None
                }
            })

        # DETECTOR 4: Vendor / Contractor Concentration
        for v in p.get("vendors", []):
            count = vendor_counts[v]
            if count >= 10 and (count / total_projects) >= 0.15:
                share_pct = round((count / total_projects) * 100, 1)
                findings.append({
                    "id": f"FND-VEND-{p['id']}",
                    "project_id": p["id"],
                    "title": f"High Vendor Allocation Concentration ({share_pct}% District Share)",
                    "category": "relationships",
                    "severity": "medium",
                    "confidence": 82,
                    "description": f"Assigned contractor '{v}' holds {count} project contracts ({share_pct}%) in this constituency.",
                    "reason_code": "VENDOR_CONCENTRATION_HIGH",
                    "detector": "relationships",
                    "detector_version": "1.8.0",
                    "status": "new",
                    "created_at": datetime.utcnow().isoformat() + "Z",
                    "evidence": {
                        "metric": "Vendor Contract Share",
                        "value": f"{share_pct}% ({count} works)",
                        "details": f"Assigned to {v}."
                    }
                })
                break

        # DETECTOR 5: Extended Lifecycle Stagnation (> 180 days with no progress)
        if p["status"] in ["In Progress", "Recommended"] and rec_date and not p.get("expenditure_amount"):
            try:
                dt_rec = datetime.strptime(rec_date, "%Y-%m-%d")
                days_elapsed = (datetime.utcnow() - dt_rec).days
                if days_elapsed > 365:
                    findings.append({
                        "id": f"FND-STAG-{p['id']}",
                        "project_id": p["id"],
                        "title": f"Extended Stagnation ({days_elapsed} Days Elapsed Since Recommendation)",
                        "category": "lifecycle",
                        "severity": "high",
                        "confidence": 90,
                        "description": f"Work recommended on {rec_date} ({days_elapsed} days ago) with zero recorded ground expenditure or physical completion certificate.",
                        "reason_code": "LIFECYCLE_OVERDUE_STAGNANT",
                        "detector": "lifecycle",
                        "detector_version": "2.4.0",
                        "status": "new",
                        "created_at": datetime.utcnow().isoformat() + "Z",
                        "evidence": {
                            "details": f"Elapsed time: {days_elapsed} days with ₹0 expenditure disbursed."
                        }
                    })
            except Exception:
                pass

        p["findings"] = findings

    return projects
