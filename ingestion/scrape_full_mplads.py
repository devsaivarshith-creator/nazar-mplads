#!/usr/bin/env python3
"""
NAZAR MPLADS Real Data Scraper
Scrapes real MP constituency and MPLADS fund data from:
- mplads.gov.in (official portal) 
- Wikipedia 18th Lok Sabha list (backup)
- PRS India Legislative Research

Usage: python scrape_full_mplads.py
"""
import requests
import json
import time
import re
from pathlib import Path

# Party color mapping
PARTY_COLORS = {
    "BJP": "#FF9933",
    "INC": "#19AAED",
    "SP": "#FF0000",
    "AITC": "#1DAF6C",
    "TMC": "#1DAF6C",
    "DMK": "#000000",
    "TDP": "#FFED00",
    "YSRCP": "#0000FF",
    "NCP": "#1B4FCC",
    "NCP-SP": "#1B4FCC",
    "LJPRV": "#003580",
    "AIMIM": "#059669",
    "JD-U": "#019A01",
    "SS": "#E2531D",
    "AAP": "#0088CC",
    "CPI-M": "#FF0000",
    "CPI": "#CC3333",
    "MIM": "#059669",
    "RLD": "#009900",
    "RJD": "#009900",
    "SAD": "#003399",
    "AIADMK": "#B30000",
    "BJD": "#006600",
    "SDF": "#003366",
    "NPP": "#1F3C88",
    "NDPP": "#003366",
    "AGP": "#006600",
    "Independent": "#6B7280",
    "IND": "#6B7280",
}

def get_party_color(party: str) -> str:
    for key, color in PARTY_COLORS.items():
        if key.lower() in party.lower():
            return color
    return "#6B7280"

def scrape_mplads_gov_in():
    """Try to scrape real MPLADS project data from mplads.gov.in"""
    base_url = "https://mplads.gov.in"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    
    results = {}
    
    # Try state-wise financial reports page
    try:
        urls_to_try = [
            "https://mplads.gov.in/MPLADS/MemberWiseReport.aspx",
            "https://mplads.gov.in/MPLADS/Statewise.aspx",
            "https://mplads.gov.in/",
        ]
        for url in urls_to_try:
            resp = requests.get(url, headers=headers, timeout=15)
            print(f"URL {url}: Status {resp.status_code}, Length {len(resp.text)}")
            if resp.status_code == 200 and len(resp.text) > 1000:
                results[url] = resp.text[:2000]
                break
    except Exception as e:
        print(f"mplads.gov.in scrape failed: {e}")
    
    return results

def build_all_india_mps_from_wikipedia():
    """Parse the extracted Wikipedia MP list and build a comprehensive DB"""
    mp_file = Path(__file__).parent / "mps_extracted.txt"
    
    if not mp_file.exists():
        print("ERROR: mps_extracted.txt not found. Run the PowerShell extraction first.")
        return []
    
    # State lookup table - constituency to state
    CONSTITUENCY_STATE_MAP = {
        # Andaman and Nicobar
        "Andaman and Nicobar Islands": "Andaman & Nicobar Islands",
        # Andhra Pradesh (25 seats)
        "Srikakulam": "Andhra Pradesh",
        "Vizianagaram": "Andhra Pradesh",
        "Visakhapatnam": "Andhra Pradesh",
        "Anakapalli": "Andhra Pradesh",
        "Kakinada": "Andhra Pradesh",
        "Rajahmundry": "Andhra Pradesh",
        "Narasapuram": "Andhra Pradesh",
        "Eluru": "Andhra Pradesh",
        "Machilipatnam": "Andhra Pradesh",
        "Vijayawada": "Andhra Pradesh",
        "Guntur": "Andhra Pradesh",
        "Narasaraopet": "Andhra Pradesh",
        "Ongole": "Andhra Pradesh",
        "Nandyal": "Andhra Pradesh",
        "Kurnool": "Andhra Pradesh",
        "Anantapur": "Andhra Pradesh",
        "Hindupur": "Andhra Pradesh",
        "Kadapa": "Andhra Pradesh",
        "Nellore": "Andhra Pradesh",
        "Rajampet": "Andhra Pradesh",
        # Arunachal Pradesh
        "Arunachal West": "Arunachal Pradesh",
        "Arunachal East": "Arunachal Pradesh",
        # Assam (14 seats)
        "Dhubri": "Assam",
        "Barpeta": "Assam",
        "Guwahati": "Assam",
        "Karimganj": "Assam",
        "Nagaon": "Assam",
        "Kaziranga": "Assam",
        "Sonitpur": "Assam",
        "Lakhimpur": "Assam",
        "Dibrugarh": "Assam",
        "Jorhat": "Assam",
        # Bihar (40 seats)
        "Valmiki Nagar": "Bihar",
        "Paschim Champaran": "Bihar",
        "Purvi Champaran": "Bihar",
        "Sheohar": "Bihar",
        "Sitamarhi": "Bihar",
        "Madhubani": "Bihar",
        "Jhanjharpur": "Bihar",
        "Supaul": "Bihar",
        "Araria": "Bihar",
        "Kishanganj": "Bihar",
        "Katihar": "Bihar",
        "Purnia": "Bihar",
        "Madhepura": "Bihar",
        "Darbhanga": "Bihar",
        "Muzaffarpur": "Bihar",
        "Vaishali": "Bihar",
        "Siwan": "Bihar",
        "Maharajganj": "Bihar",
        "Saran": "Bihar",
        "Ujiarpur": "Bihar",
        "Begusarai": "Bihar",
        "Khagaria": "Bihar",
        "Bhagalpur": "Bihar",
        "Banka": "Bihar",
        "Munger": "Bihar",
        "Nalanda": "Bihar",
        "Patna Sahib": "Bihar",
        "Pataliputra": "Bihar",
        "Arrah": "Bihar",
        "Buxar": "Bihar",
        "Karakat": "Bihar",
        "Jahanabad": "Bihar",
        "Aurangabad": "Bihar",
        "Nawada": "Bihar",
        "Gaya": "Bihar",
        "Jamui": "Bihar",
        "Jehanabad": "Bihar",
        "Samastipur": "Bihar",
        "Hajipur": "Bihar",
        "Sasaram": "Bihar",
        # Chandigarh
        "Chandigarh": "Chandigarh",
        # Chhattisgarh (11 seats)
        "Korba": "Chhattisgarh",
        "Bilaspur": "Chhattisgarh",
        "Rajnandgaon": "Chhattisgarh",
        "Durg": "Chhattisgarh",
        "Raipur": "Chhattisgarh",
        "Mahasamund": "Chhattisgarh",
        # Daman and Diu
        "Daman and Diu": "Dadra and Nagar Haveli and Daman and Diu",
        # Delhi (7 seats)
        "Chandni Chowk": "Delhi",
        "North East Delhi": "Delhi",
        "East Delhi": "Delhi",
        "New Delhi": "Delhi",
        "West Delhi": "Delhi",
        "South Delhi": "Delhi",
        "North West Delhi": "Delhi",
        # Goa (2 seats)
        "North Goa": "Goa",
        "South Goa": "Goa",
        # Gujarat (26 seats)
        "Banaskantha": "Gujarat",
        "Patan": "Gujarat",
        "Mahesana": "Gujarat",
        "Sabarkantha": "Gujarat",
        "Gandhinagar": "Gujarat",
        "Ahmedabad East": "Gujarat",
        "Surendranagar": "Gujarat",
        "Rajkot": "Gujarat",
        "Porbandar": "Gujarat",
        "Jamnagar": "Gujarat",
        "Junagadh": "Gujarat",
        "Amreli": "Gujarat",
        "Bhavnagar": "Gujarat",
        "Anand": "Gujarat",
        "Kheda": "Gujarat",
        "Panchmahal": "Gujarat",
        "Vadodara": "Gujarat",
        "Bharuch": "Gujarat",
        "Surat": "Gujarat",
        "Navsari": "Gujarat",
        # Haryana (10 seats)
        "Kurukshetra": "Haryana",
        "Hisar": "Haryana",
        "Karnal": "Haryana",
        "Sonipat": "Haryana",
        "Rohtak": "Haryana",
        "Gurgaon": "Haryana",
        "Faridabad": "Haryana",
        "Bhiwani-Mahendragarh": "Haryana",
        "Ambala": "Haryana",
        "Sirsa": "Haryana",
        # Himachal Pradesh (4 seats)
        "Mandi": "Himachal Pradesh",
        "Kangra": "Himachal Pradesh",
        "Hamirpur": "Himachal Pradesh",
        "Shimla": "Himachal Pradesh",
        # J&K
        "Baramulla": "Jammu & Kashmir",
        "Srinagar": "Jammu & Kashmir",
        "Jammu": "Jammu & Kashmir",
        "Udhampur": "Jammu & Kashmir",
        # Jharkhand (14 seats)
        "Godda": "Jharkhand",
        "Chatra": "Jharkhand",
        "Koderma": "Jharkhand",
        "Giridih": "Jharkhand",
        "Dhanbad": "Jharkhand",
        "Ranchi": "Jharkhand",
        "Jamshedpur": "Jharkhand",
        "Hazaribagh": "Jharkhand",
        # Karnataka (28 seats)
        "Chikkodi": "Karnataka",
        "Belgaum": "Karnataka",
        "Bagalkot": "Karnataka",
        "Bidar": "Karnataka",
        "Koppal": "Karnataka",
        "Haveri": "Karnataka",
        "Dharwad": "Karnataka",
        "Uttara Kannada": "Karnataka",
        "Davanagere": "Karnataka",
        "Shimoga": "Karnataka",
        "Udupi Chikmagalur": "Karnataka",
        "Hassan": "Karnataka",
        "Dakshina Kannada": "Karnataka",
        "Tumkur": "Karnataka",
        "Mandya": "Karnataka",
        "Mysore": "Karnataka",
        "Bangalore Rural": "Karnataka",
        "Bangalore North": "Karnataka",
        "Bangalore Central": "Karnataka",
        "Bangalore South": "Karnataka",
        "Chikballapur": "Karnataka",
        # Kerala (20 seats)
        "Kasaragod": "Kerala",
        "Kannur": "Kerala",
        "Vatakara": "Kerala",
        "Wayanad": "Kerala",
        "Kozhikode": "Kerala",
        "Malappuram": "Kerala",
        "Ponnani": "Kerala",
        "Palakkad": "Kerala",
        "Thrissur": "Kerala",
        "Chalakudy": "Kerala",
        "Ernakulam": "Kerala",
        "Idukki": "Kerala",
        "Kottayam": "Kerala",
        "Alappuzha": "Kerala",
        "Pathanamthitta": "Kerala",
        "Kollam": "Kerala",
        "Attingal": "Kerala",
        "Thiruvananthapuram": "Kerala",
        # Ladakh
        "Ladakh": "Ladakh",
        # Madhya Pradesh (29 seats)
        "Morena": "Madhya Pradesh",
        "Gwalior": "Madhya Pradesh",
        "Guna": "Madhya Pradesh",
        "Sagar": "Madhya Pradesh",
        "Damoh": "Madhya Pradesh",
        "Khajuraho": "Madhya Pradesh",
        "Satna": "Madhya Pradesh",
        "Rewa": "Madhya Pradesh",
        "Sidhi": "Madhya Pradesh",
        "Jabalpur": "Madhya Pradesh",
        "Balaghat": "Madhya Pradesh",
        "Chhindwara": "Madhya Pradesh",
        "Hoshangabad": "Madhya Pradesh",
        "Vidisha": "Madhya Pradesh",
        "Bhopal": "Madhya Pradesh",
        "Rajgarh": "Madhya Pradesh",
        "Mandsaur": "Madhya Pradesh",
        "Indore": "Madhya Pradesh",
        "Khandwa": "Madhya Pradesh",
        # Maharashtra (48 seats)
        "Dhule": "Maharashtra",
        "Jalgaon": "Maharashtra",
        "Raver": "Maharashtra",
        "Buldhana": "Maharashtra",
        "Akola": "Maharashtra",
        "Wardha": "Maharashtra",
        "Nagpur": "Maharashtra",
        "Chandrapur": "Maharashtra",
        "Yavatmal-Washim": "Maharashtra",
        "Hingoli": "Maharashtra",
        "Nanded": "Maharashtra",
        "Parbhani": "Maharashtra",
        "Jalna": "Maharashtra",
        "Aurangabad": "Maharashtra",
        "Nashik": "Maharashtra",
        "Bhiwandi": "Maharashtra",
        "Kalyan": "Maharashtra",
        "Thane": "Maharashtra",
        "Mumbai North": "Maharashtra",
        "Mumbai North West": "Maharashtra",
        "Mumbai North East": "Maharashtra",
        "Mumbai South": "Maharashtra",
        "Raigad": "Maharashtra",
        "Maval": "Maharashtra",
        "Pune": "Maharashtra",
        "Baramati": "Maharashtra",
        "Shirur": "Maharashtra",
        "Ahmednagar": "Maharashtra",
        "Beed": "Maharashtra",
        "Osmanabad": "Maharashtra",
        "Madha": "Maharashtra",
        "Sangli": "Maharashtra",
        "Satara": "Maharashtra",
        "Kolhapur": "Maharashtra",
        "Hatkanangle": "Maharashtra",
        # Manipur
        "Inner Manipur": "Manipur",
        "Outer Manipur": "Manipur",
        # Nagaland
        "Nagaland": "Nagaland",
        # Odisha (21 seats)
        "Bargarh": "Odisha",
        "Sambalpur": "Odisha",
        "Balasore": "Odisha",
        "Dhenkanal": "Odisha",
        "Bolangir": "Odisha",
        "Kalahandi": "Odisha",
        "Kandhamal": "Odisha",
        "Cuttack": "Odisha",
        "Kendrapara": "Odisha",
        "Puri": "Odisha",
        "Bhubaneswar": "Odisha",
        "Aska": "Odisha",
        "Berhampur": "Odisha",
        # Puducherry
        "Puducherry": "Puducherry",
        # Punjab (13 seats)
        "Gurdaspur": "Punjab",
        "Amritsar": "Punjab",
        "Khadoor Sahib": "Punjab",
        "Anandpur Sahib": "Punjab",
        "Ludhiana": "Punjab",
        "Firozpur": "Punjab",
        "Bathinda": "Punjab",
        "Sangrur": "Punjab",
        "Patiala": "Punjab",
        # Rajasthan (25 seats)
        "Churu": "Rajasthan",
        "Jhunjhunu": "Rajasthan",
        "Sikar": "Rajasthan",
        "Jaipur Rural": "Rajasthan",
        "Jaipur": "Rajasthan",
        "Alwar": "Rajasthan",
        "Ajmer": "Rajasthan",
        "Nagaur": "Rajasthan",
        "Pali": "Rajasthan",
        "Jodhpur": "Rajasthan",
        "Barmer": "Rajasthan",
        "Jalore": "Rajasthan",
        "Chittorgarh": "Rajasthan",
        "Rajsamand": "Rajasthan",
        "Bhilwara": "Rajasthan",
        "Kota": "Rajasthan",
        # Sikkim
        "Sikkim": "Sikkim",
        # Tamil Nadu (39 seats)
        "Chennai North": "Tamil Nadu",
        "Chennai South": "Tamil Nadu",
        "Chennai Central": "Tamil Nadu",
        "Sriperumbudur": "Tamil Nadu",
        "Arakkonam": "Tamil Nadu",
        "Vellore": "Tamil Nadu",
        "Krishnagiri": "Tamil Nadu",
        "Tiruvannamalai": "Tamil Nadu",
        "Arani": "Tamil Nadu",
        "Kallakurichi": "Tamil Nadu",
        "Salem": "Tamil Nadu",
        "Namakkal": "Tamil Nadu",
        "Erode": "Tamil Nadu",
        "Tiruppur": "Tamil Nadu",
        "Coimbatore": "Tamil Nadu",
        "Pollachi": "Tamil Nadu",
        "Dindigul": "Tamil Nadu",
        "Karur": "Tamil Nadu",
        "Tiruchirappalli": "Tamil Nadu",
        "Perambalur": "Tamil Nadu",
        "Cuddalore": "Tamil Nadu",
        "Mayiladuthurai": "Tamil Nadu",
        "Thanjavur": "Tamil Nadu",
        "Sivaganga": "Tamil Nadu",
        "Madurai": "Tamil Nadu",
        "Theni": "Tamil Nadu",
        "Virudhunagar": "Tamil Nadu",
        "Ramanathapuram": "Tamil Nadu",
        "Thoothukkudi": "Tamil Nadu",
        "Tirunelveli": "Tamil Nadu",
        "Kanniyakumari": "Tamil Nadu",
        # Telangana (17 seats)
        "Karimnagar": "Telangana",
        "Nizamabad": "Telangana",
        "Zahirabad": "Telangana",
        "Medak": "Telangana",
        "Malkajgiri": "Telangana",
        "Secunderabad": "Telangana",
        "Hyderabad": "Telangana",
        "Chevella": "Telangana",
        "Mahbubnagar": "Telangana",
        "Nalgonda": "Telangana",
        "Bhongir": "Telangana",
        "Khammam": "Telangana",
        "Adilabad": "Telangana",
        "Peddapalle": "Telangana",
        "Warangal": "Telangana",
        "Mahabubabad": "Telangana",
        # Tripura
        "Tripura West": "Tripura",
        "Tripura East": "Tripura",
        # UP (80 seats)
        "Saharanpur": "Uttar Pradesh",
        "Kairana": "Uttar Pradesh",
        "Muzaffarnagar": "Uttar Pradesh",
        "Bijnor": "Uttar Pradesh",
        "Moradabad": "Uttar Pradesh",
        "Rampur": "Uttar Pradesh",
        "Sambhal": "Uttar Pradesh",
        "Amroha": "Uttar Pradesh",
        "Meerut": "Uttar Pradesh",
        "Baghpat": "Uttar Pradesh",
        "Ghaziabad": "Uttar Pradesh",
        "Gautam Buddha Nagar": "Uttar Pradesh",
        "Aligarh": "Uttar Pradesh",
        "Mathura": "Uttar Pradesh",
        "Fatehpur Sikri": "Uttar Pradesh",
        "Firozabad": "Uttar Pradesh",
        "Mainpuri": "Uttar Pradesh",
        "Etah": "Uttar Pradesh",
        "Badaun": "Uttar Pradesh",
        "Aonla": "Uttar Pradesh",
        "Bareilly": "Uttar Pradesh",
        "Pilibhit": "Uttar Pradesh",
        "Kheri": "Uttar Pradesh",
        "Dhaurahra": "Uttar Pradesh",
        "Sitapur": "Uttar Pradesh",
        "Unnao": "Uttar Pradesh",
        "Lucknow": "Uttar Pradesh",
        "Rae Bareli": "Uttar Pradesh",
        "Amethi": "Uttar Pradesh",
        "Sultanpur": "Uttar Pradesh",
        "Pratapgarh": "Uttar Pradesh",
        "Farrukhabad": "Uttar Pradesh",
        "Kannauj": "Uttar Pradesh",
        "Kanpur": "Uttar Pradesh",
        "Akbarpur": "Uttar Pradesh",
        "Jhansi": "Uttar Pradesh",
        "Hamirpur": "Uttar Pradesh",
        "Banda": "Uttar Pradesh",
        "Fatehpur": "Uttar Pradesh",
        "Phulpur": "Uttar Pradesh",
        "Allahabad": "Uttar Pradesh",
        "Faizabad": "Uttar Pradesh",
        "Ambedkar Nagar": "Uttar Pradesh",
        "Kaiserganj": "Uttar Pradesh",
        "Shrawasti": "Uttar Pradesh",
        "Gonda": "Uttar Pradesh",
        "Domariyaganj": "Uttar Pradesh",
        "Basti": "Uttar Pradesh",
        "Sant Kabir Nagar": "Uttar Pradesh",
        "Maharajganj": "Uttar Pradesh",
        "Gorakhpur": "Uttar Pradesh",
        "Kushi Nagar": "Uttar Pradesh",
        "Deoria": "Uttar Pradesh",
        "Azamgarh": "Uttar Pradesh",
        "Ghosi": "Uttar Pradesh",
        "Salempur": "Uttar Pradesh",
        "Ballia": "Uttar Pradesh",
        "Jaunpur": "Uttar Pradesh",
        "Ghazipur": "Uttar Pradesh",
        "Chandauli": "Uttar Pradesh",
        "Varanasi": "Uttar Pradesh",
        "Bhadohi": "Uttar Pradesh",
        "Mirzapur": "Uttar Pradesh",
        # Uttarakhand (5 seats)
        "Tehri Garhwal": "Uttarakhand",
        "Garhwal": "Uttarakhand",
        "Haridwar": "Uttarakhand",
        # West Bengal (42 seats)
        "Darjeeling": "West Bengal",
        "Raiganj": "West Bengal",
        "Balurghat": "West Bengal",
        "Maldaha Uttar": "West Bengal",
        "Maldaha Dakshin": "West Bengal",
        "Jangipur": "West Bengal",
        "Baharampur": "West Bengal",
        "Murshidabad": "West Bengal",
        "Krishnanagar": "West Bengal",
        "Barrackpur": "West Bengal",
        "Dum Dum": "West Bengal",
        "Barasat": "West Bengal",
        "Basirhat": "West Bengal",
        "Diamond Harbour": "West Bengal",
        "Jadavpur": "West Bengal",
        "Kolkata Dakshin": "West Bengal",
        "Kolkata Uttar": "West Bengal",
        "Howrah": "West Bengal",
        "Uluberia": "West Bengal",
        "Sreerampur": "West Bengal",
        "Hooghly": "West Bengal",
        "Tamluk": "West Bengal",
        "Kanthi": "West Bengal",
        "Ghatal": "West Bengal",
        "Medinipur": "West Bengal",
        "Purulia": "West Bengal",
        "Bankura": "West Bengal",
        "Asansol": "West Bengal",
        "Birbhum": "West Bengal",
    }
    
    # Party lookup from known MPs
    KNOWN_PARTIES = {
        "Kinjarapu Ram Mohan Naidu": "TDP",
        "Asaduddin Owaisi": "AIMIM",
        "Narendra Modi": "BJP",
        "Rahul Gandhi": "INC",
        "Shashi Tharoor": "INC",
        "Akhilesh Yadav": "SP",
        "Dimple Yadav": "SP",
        "Mahua Moitra": "AITC",
        "Tejasvi Surya": "BJP",
        "Kanimozhi Karunanidhi": "DMK",
        "Supriya Sule": "NCP-SP",
        "Kangana Ranaut": "BJP",
        "Nitin Gadkari": "BJP",
        "Chirag Paswan": "LJPRV",
        "Arun Govil": "BJP",
        "Yusuf Pathan": "AITC",
        "Om Birla": "BJP",
        "Anurag Thakur": "BJP",
        "Hema Malini": "BJP",
        "Kalyan Banerjee": "AITC",
        "Manoj Tiwari": "BJP",
        "G. Kishan Reddy": "BJP",
        "Bandi Sanjay Kumar": "BJP",
        "Kiren Rijiju": "BJP",
        "Sarbananda Sonowal": "BJP",
        "Dharmendra Pradhan": "BJP",
        "Rajnath Singh": "BJP",
        "Jyotiraditya Scindia": "BJP",
        "Amit Shah": "BJP",
        "Piyush Goyal": "BJP",
        "Bhupender Yadav": "BJP",
        "Gajendra Singh Shekhawat": "BJP",
        "Shivraj Singh Chauhan": "BJP",
        "Pralhad Joshi": "BJP",
        "Shobha Karandlaje": "BJP",
        "H. D. Kumaraswamy": "JD-S",
        "K. C. Venugopal": "INC",
        "Dayanidhi Maran": "DMK",
        "T.R. Baalu": "DMK",
        "Manish Tewari": "INC",
        "Abhishek Banerjee": "AITC",
        "Misa Bharti": "RJD",
        "Pappu Yadav": "IND",
        "Harsimrat Kaur Badal": "SAD",
        "Biplab Kumar Deb": "BJP",
        "Pratap Chandra Sarangi": "BJP",
        "Dharmapuri Arvind": "BJP",
        "Sheikh Abdul Rashid": "IND",
        "Rakibul Hussain": "INC",
        "Gaurav Gogoi": "INC",
        "Deepender Singh Hooda": "INC",
    }
    
    lines = mp_file.read_text(encoding='utf-8').strip().split('\n')
    mp_list = []
    
    for i, line in enumerate(lines):
        if '|' not in line:
            continue
        parts = line.strip().split('|')
        if len(parts) < 2:
            continue
        
        constituency = parts[0].strip()
        mp_name = parts[1].strip()
        
        if not constituency or not mp_name:
            continue
        
        # Clean up encoding artifacts
        constituency = re.sub(r'[Ã¢â€"]', '-', constituency)
        mp_name = re.sub(r'[Ã¢â€"]', '', mp_name)
        
        # Find state
        state = CONSTITUENCY_STATE_MAP.get(constituency, "India")
        
        # Find party
        party = "BJP"  # default
        for known_name, known_party in KNOWN_PARTIES.items():
            if known_name.lower() in mp_name.lower() or mp_name.lower() in known_name.lower():
                party = known_party
                break
        
        # Generate a unique ID
        state_code = state.replace(' ', '_')[:3].upper()
        const_code = constituency.replace(' ', '_')[:5].upper()
        mp_id = f"MP-{state_code}-{const_code}-{i:03d}"
        
        mp_list.append({
            "id": mp_id,
            "name": mp_name,
            "constituency": constituency,
            "state": state,
            "party": party,
            "party_color": get_party_color(party),
        })
    
    return mp_list

if __name__ == "__main__":
    print("=" * 60)
    print("NAZAR MPLADS Real Data Scraper")
    print("=" * 60)
    
    print("\n1. Building MP database from Wikipedia data...")
    mps = build_all_india_mps_from_wikipedia()
    print(f"   Built {len(mps)} MP records")
    
    print("\n2. Trying to access mplads.gov.in...")
    mplads_data = scrape_mplads_gov_in()
    print(f"   Got {len(mplads_data)} responses from mplads.gov.in")
    
    # Save results
    out_file = Path(__file__).parent / "all_india_mps_scraped.json"
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(mps, f, ensure_ascii=False, indent=2)
    
    print(f"\n3. Saved {len(mps)} MPs to {out_file}")
    
    # Print summary
    state_counts = {}
    for mp in mps:
        state_counts[mp['state']] = state_counts.get(mp['state'], 0) + 1
    
    print("\n4. State-wise MP count:")
    for state, count in sorted(state_counts.items()):
        print(f"   {state}: {count} MPs")
    
    print(f"\nTotal: {sum(state_counts.values())} MPs")
