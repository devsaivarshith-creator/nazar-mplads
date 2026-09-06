"""
NAZAR - MoSPI eSAKSHI Public MPLADS Client
Connects to legitimate public endpoints on https://mplads.mospi.gov.in
"""

import urllib.request
import ssl
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("nazar.ingestion.client")

class MospiMpladsClient:
    BASE_URL = "https://mplads.mospi.gov.in/rest/PreLoginDashboardData"

    def __init__(self, timeout: int = 25):
        self.timeout = timeout
        self.ssl_context = ssl.create_default_context()
        self.ssl_context.check_hostname = False
        self.ssl_context.verify_mode = ssl.CERT_NONE
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Origin": "https://mplads.mospi.gov.in",
            "Referer": "https://mplads.mospi.gov.in/digigov/dashboard.html",
        }

    def _post(self, endpoint: str, payload: Any) -> Any:
        url = f"{self.BASE_URL}/{endpoint}"
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=self.headers, method="POST")
        try:
            with urllib.request.urlopen(req, context=self.ssl_context, timeout=self.timeout) as resp:
                raw = resp.read().decode("utf-8", errors="ignore")
                return json.loads(raw)
        except Exception as e:
            logger.error(f"Error calling {url}: {e}")
            raise

    def get_states(self) -> List[Dict[str, Any]]:
        """Fetches list of all 36 Indian States and Union Territories"""
        return self._post("getStateData", {})

    def get_constituencies(self, state_id: int) -> List[Dict[str, Any]]:
        """Fetches all parliamentary constituencies for a state"""
        return self._post("getConstituencyData", {"id": str(state_id)})

    def get_mp(self, constituency_id: int, house: int = 0, tenure: int = 7) -> List[Dict[str, Any]]:
        """Fetches MP representing the constituency"""
        combo = f"{constituency_id},{house},{tenure}"
        return self._post("getMpAndConstCombo", {"const_combo": combo})

    def get_tiles_summary(self, state_id: int = 0, constituency_id: int = 0) -> Dict[str, Any]:
        """Fetches high-level financial limits, recommended, and sanctioned totals"""
        uname = f"{state_id},{constituency_id},0,2"
        return self._post("getTilesData", {"uname": uname})

    def get_works(self, state_id: int, constituency_id: int, key: str = "Works Recommended") -> List[Dict[str, Any]]:
        """Fetches individual work records for a constituency under a specific category"""
        combo = f"{state_id},{constituency_id},0,2"
        raw_res = self._post("getTilesReportData", {"combo": combo, "key": key})
        
        # Unpack nested JSON string returned by Java servlet
        if isinstance(raw_res, dict):
            for k, val in raw_res.items():
                if isinstance(val, str) and val.strip().startswith("["):
                    try:
                        return json.loads(val)
                    except Exception:
                        pass
                elif isinstance(val, list):
                    return val
        elif isinstance(raw_res, list):
            return raw_res
        return []

    def get_all_category_works(self, state_id: int, constituency_id: int) -> Dict[str, Any]:
        """
        Fetches all 4 work-level datasets from MoSPI eSAKSHI for a constituency:
        - Works Recommended
        - Works Sanctioned
        - Works Completed
        - Expenditure on Completed and On-going Works as on Date
        Plus live summary tiles and MP metadata.
        """
        summary = self.get_tiles_summary(state_id, constituency_id)
        
        mp_info = None
        try:
            mp_res = self.get_mp(constituency_id)
            if mp_res and len(mp_res) > 0:
                mp_info = mp_res[0]
        except Exception:
            pass

        categories = [
            "Works Recommended",
            "Works Sanctioned",
            "Works Completed",
            "Expenditure on Completed and On-going Works as on Date",
        ]

        results = {
            "summary": summary,
            "mp": mp_info,
            "works_recommended": [],
            "works_sanctioned": [],
            "works_completed": [],
            "expenditure_works": [],
        }

        for cat in categories:
            try:
                works = self.get_works(state_id, constituency_id, key=cat)
                # Filter out summary row if present (e.g. Total row)
                clean_works = [w for w in works if isinstance(w, dict) and ("WORK_RECOMMENDATION_DTL_ID" in w or "WORK_DESCRIPTION" in w)]
                if cat == "Works Recommended":
                    results["works_recommended"] = clean_works
                elif cat == "Works Sanctioned":
                    results["works_sanctioned"] = clean_works
                elif cat == "Works Completed":
                    results["works_completed"] = clean_works
                elif cat == "Expenditure on Completed and On-going Works as on Date":
                    results["expenditure_works"] = clean_works
            except Exception as e:
                logger.warning(f"Failed to fetch {cat} for state {state_id}, const {constituency_id}: {e}")

        return results

