import { MPProfile } from "@/types";

export const MP_PROFILES: MPProfile[] = [
  {
    id: "MP-TS-HYD-01",
    name: "Asaduddin Owaisi",
    party: "AIMIM",
    party_color: "#059669",
    house: "Lok Sabha",
    state: "Telangana",
    constituency: "Hyderabad",
    term: "18th Lok Sabha (5th Term)",
    sanctioned_amount: 253000000,
    recommended_amount: 280000000,
    expenditure_amount: 198400000,
    utilization_rate: 78.4,
    completion_rate: 81.6,
    total_works_recommended: 312,
    total_works_sanctioned: 284,
    completed_works: 232,
    in_progress_works: 38,
    delayed_works: 14,
    flagged_observations: 4,
    top_sectors: [
      { sector: "Community Infrastructure", amount: 96500000, count: 92, percentage: 38.1 },
      { sector: "Health & Family Welfare", amount: 61000000, count: 54, percentage: 24.1 },
      { sector: "Roads & Pathways", amount: 49200000, count: 68, percentage: 19.4 },
      { sector: "Drinking Water", amount: 30800000, count: 42, percentage: 12.2 },
      { sector: "Education & STEM", amount: 15500000, count: 28, percentage: 6.2 },
    ],
    implementing_agencies: [
      "Telangana State Education & Welfare Infrastructure Dev Corp (TSEWIDC)",
      "Greater Hyderabad Municipal Corporation (GHMC)",
      "District Collector Hyderabad (IDA)",
      "TSREDCO (Renewable Energy)"
    ],
    key_priorities: [
      "Community halls & multi-purpose youth centers",
      "Government maternity hospital medical equipment",
      "Underground storm drainage & nala restorations"
    ],
    observations_summary: "3 automated observations flagged: 1 timeline sequence mismatch (completion date preceding start date on HYD-2023-0881), 1 high spatial proximity duplicate candidate (88% overlap), and 1 stalled solar high-mast installation.",
    avatar_initials: "AO"
  },
  {
    id: "MP-TS-KRN-02",
    name: "Bandi Sanjay Kumar",
    party: "BJP",
    party_color: "#ea580c",
    house: "Lok Sabha",
    state: "Telangana",
    constituency: "Karimnagar",
    term: "18th Lok Sabha (2nd Term)",
    sanctioned_amount: 248000000,
    recommended_amount: 265000000,
    expenditure_amount: 215000000,
    utilization_rate: 86.7,
    completion_rate: 88.2,
    total_works_recommended: 265,
    total_works_sanctioned: 245,
    completed_works: 216,
    in_progress_works: 21,
    delayed_works: 8,
    flagged_observations: 2,
    top_sectors: [
      { sector: "Roads, Pathways & Bridges", amount: 104000000, count: 108, percentage: 41.9 },
      { sector: "Sanitation & Sewerage", amount: 58000000, count: 46, percentage: 23.4 },
      { sector: "Drinking Water", amount: 42000000, count: 44, percentage: 16.9 },
      { sector: "Community Assets", amount: 26000000, count: 31, percentage: 10.5 },
      { sector: "Education", amount: 18000000, count: 16, percentage: 7.3 }
    ],
    implementing_agencies: [
      "Panchayat Raj & Rural Engineering Div-2, Karimnagar",
      "Karimnagar Municipal Corporation (KMC)",
      "Irrigation & CAD Department"
    ],
    key_priorities: [
      "Rural connectivity & CC roads in mandals",
      "Underground drainage augmentation in urban wards",
      "Overhead water tank infrastructure"
    ],
    observations_summary: "High implementing agency concentration detected: 71% of rural civil works routed through Panchayat Raj Div-2 against district peer median of 22.5%.",
    avatar_initials: "BS"
  },
  {
    id: "MP-UP-VAR-03",
    name: "Narendra Modi",
    party: "BJP",
    party_color: "#ea580c",
    house: "Lok Sabha",
    state: "Uttar Pradesh",
    constituency: "Varanasi",
    term: "18th Lok Sabha (3rd Term)",
    sanctioned_amount: 250000000,
    recommended_amount: 250000000,
    expenditure_amount: 246500000,
    utilization_rate: 98.6,
    completion_rate: 95.4,
    total_works_recommended: 184,
    total_works_sanctioned: 184,
    completed_works: 176,
    in_progress_works: 7,
    delayed_works: 1,
    flagged_observations: 0,
    top_sectors: [
      { sector: "Heritage, Tourism & Ghats", amount: 92000000, count: 52, percentage: 36.8 },
      { sector: "Healthcare & Diagnostics", amount: 68000000, count: 41, percentage: 27.2 },
      { sector: "Urban Infrastructure & Roads", amount: 48000000, count: 48, percentage: 19.2 },
      { sector: "Education & Anganwadis", amount: 24000000, count: 26, percentage: 9.6 },
      { sector: "Clean Energy & Lighting", amount: 18000000, count: 17, percentage: 7.2 }
    ],
    implementing_agencies: [
      "Varanasi Development Authority (VDA)",
      "UP Jal Nigam (Urban)",
      "Public Works Department (PWD Varanasi)",
      "National Health Mission UP"
    ],
    key_priorities: [
      "Ghat illumination & pilgrim community facilities",
      "Primary health centers diagnostic upgradations",
      "Solar streetlights in peri-urban village clusters"
    ],
    observations_summary: "Zero high-severity anomalies detected. Consistently high expenditure utilization (98.6%) with regular quarterly Utilization Certificate (UC) submissions.",
    avatar_initials: "NM"
  },
  {
    id: "MP-UP-RBL-04",
    name: "Rahul Gandhi",
    party: "INC",
    party_color: "#0284c7",
    house: "Lok Sabha",
    state: "Uttar Pradesh",
    constituency: "Rae Bareli",
    term: "18th Lok Sabha (5th Term)",
    sanctioned_amount: 250000000,
    recommended_amount: 272000000,
    expenditure_amount: 187500000,
    utilization_rate: 75.0,
    completion_rate: 79.2,
    total_works_recommended: 228,
    total_works_sanctioned: 198,
    completed_works: 157,
    in_progress_works: 31,
    delayed_works: 10,
    flagged_observations: 2,
    top_sectors: [
      { sector: "Rural Roads & Link Paths", amount: 98000000, count: 88, percentage: 39.2 },
      { sector: "Education & School Upgrades", amount: 56000000, count: 42, percentage: 22.4 },
      { sector: "Drinking Water & Handpumps", amount: 44000000, count: 38, percentage: 17.6 },
      { sector: "Health Clinics & Ambulances", amount: 32000000, count: 19, percentage: 12.8 },
      { sector: "Community Halls", amount: 20000000, count: 11, percentage: 8.0 }
    ],
    implementing_agencies: [
      "Rural Engineering Services (RES Rae Bareli)",
      "Zila Panchayat Rae Bareli",
      "UP Jal Nigam (Rural)"
    ],
    key_priorities: [
      "Inter-village connectivity and link bridges",
      "Govt school smart classrooms and sanitation",
      "Solar deep borewells in drought-prone blocks"
    ],
    observations_summary: "2 moderate delay observations flagged on rural link road packages where sanction-to-tender elapsed time exceeded 180 days.",
    avatar_initials: "RG"
  },
  {
    id: "MP-KL-TVM-05",
    name: "Dr. Shashi Tharoor",
    party: "INC",
    party_color: "#0284c7",
    house: "Lok Sabha",
    state: "Kerala",
    constituency: "Thiruvananthapuram",
    term: "18th Lok Sabha (4th Term)",
    sanctioned_amount: 251000000,
    recommended_amount: 275000000,
    expenditure_amount: 236000000,
    utilization_rate: 94.0,
    completion_rate: 93.1,
    total_works_recommended: 294,
    total_works_sanctioned: 276,
    completed_works: 257,
    in_progress_works: 16,
    delayed_works: 3,
    flagged_observations: 1,
    top_sectors: [
      { sector: "Education & Digital Libraries", amount: 84000000, count: 86, percentage: 33.5 },
      { sector: "Healthcare & Dialysis Units", amount: 76000000, count: 68, percentage: 30.3 },
      { sector: "Fisheries & Coastal Infrastructure", amount: 46000000, count: 52, percentage: 18.3 },
      { sector: "Drinking Water RO Plants", amount: 28000000, count: 41, percentage: 11.2 },
      { sector: "Sports & Youth Arenas", amount: 17000000, count: 29, percentage: 6.7 }
    ],
    implementing_agencies: [
      "Kerala State Construction Corporation (KSCC)",
      "Thiruvananthapuram Municipal Corporation",
      "Harbour Engineering Department",
      "District Nirmithi Kendra"
    ],
    key_priorities: [
      "Hospital dialysis machines & cancer palliative centers",
      "High school STEM laboratories & libraries",
      "Coastal community shelters for fishing communities"
    ],
    observations_summary: "1 observation for minor cost variance in specialized biomedical procurement, reconciled via state technical sanction.",
    avatar_initials: "ST"
  },
  {
    id: "MP-WB-KRN-06",
    name: "Mahua Moitra",
    party: "AITC",
    party_color: "#16a34a",
    house: "Lok Sabha",
    state: "West Bengal",
    constituency: "Krishnanagar",
    term: "18th Lok Sabha (2nd Term)",
    sanctioned_amount: 245000000,
    recommended_amount: 260000000,
    expenditure_amount: 191000000,
    utilization_rate: 78.0,
    completion_rate: 80.5,
    total_works_recommended: 215,
    total_works_sanctioned: 195,
    completed_works: 157,
    in_progress_works: 30,
    delayed_works: 8,
    flagged_observations: 2,
    top_sectors: [
      { sector: "Flood Relief & Embankment Roads", amount: 92000000, count: 74, percentage: 37.6 },
      { sector: "Drinking Water Pipelines", amount: 62000000, count: 49, percentage: 25.3 },
      { sector: "Primary Education Classrooms", amount: 44000000, count: 38, percentage: 18.0 },
      { sector: "Community Centers", amount: 28000000, count: 21, percentage: 11.4 },
      { sector: "Public Sanitation", amount: 19000000, count: 13, percentage: 7.7 }
    ],
    implementing_agencies: [
      "Nadia Zilla Parishad",
      "West Bengal Irrigation & Waterways Directorate",
      "Krishnanagar Municipality"
    ],
    key_priorities: [
      "River embankment stabilization & concrete rural roads",
      "Arsenic-free piped drinking water facilities",
      "Girls secondary schools science labs & toilets"
    ],
    observations_summary: "2 observations relating to monsoon execution delays on low-lying riverbank path projects.",
    avatar_initials: "MM"
  },
  {
    id: "MP-MH-BRM-07",
    name: "Supriya Sule",
    party: "NCP-SP",
    party_color: "#0d9488",
    house: "Lok Sabha",
    state: "Maharashtra",
    constituency: "Baramati",
    term: "18th Lok Sabha (4th Term)",
    sanctioned_amount: 250000000,
    recommended_amount: 270000000,
    expenditure_amount: 231000000,
    utilization_rate: 92.4,
    completion_rate: 94.0,
    total_works_recommended: 268,
    total_works_sanctioned: 250,
    completed_works: 235,
    in_progress_works: 12,
    delayed_works: 3,
    flagged_observations: 1,
    top_sectors: [
      { sector: "Water Conservation & Check Dams", amount: 95000000, count: 82, percentage: 38.0 },
      { sector: "Education & Girls Hostels", amount: 68000000, count: 64, percentage: 27.2 },
      { sector: "Rural Health & ICU Vans", amount: 45000000, count: 42, percentage: 18.0 },
      { sector: "Agriculture Infrastructure", amount: 25000000, count: 38, percentage: 10.0 },
      { sector: "Village Roads", amount: 17000000, count: 24, percentage: 6.8 }
    ],
    implementing_agencies: [
      "Pune Zilla Parishad",
      "Maharashtra Jeevan Pradhikaran (MJP)",
      "Public Works Division Pune"
    ],
    key_priorities: [
      "Micro-irrigation & percolation tank deepening",
      "Primary health centers and mobile clinics",
      "Skill training centers for women self-help groups"
    ],
    observations_summary: "High financial utilization with strong documentation compliance across Pune district authority audits.",
    avatar_initials: "SS"
  },
  {
    id: "MP-KA-BLR-08",
    name: "Tejasvi Surya",
    party: "BJP",
    party_color: "#ea580c",
    house: "Lok Sabha",
    state: "Karnataka",
    constituency: "Bangalore South",
    term: "18th Lok Sabha (2nd Term)",
    sanctioned_amount: 249000000,
    recommended_amount: 262000000,
    expenditure_amount: 224000000,
    utilization_rate: 90.0,
    completion_rate: 89.5,
    total_works_recommended: 210,
    total_works_sanctioned: 190,
    completed_works: 170,
    in_progress_works: 16,
    delayed_works: 4,
    flagged_observations: 1,
    top_sectors: [
      { sector: "Urban Healthcare & Oxygen Plants", amount: 98000000, count: 54, percentage: 39.4 },
      { sector: "Education & Digital Labs", amount: 62000000, count: 46, percentage: 24.9 },
      { sector: "Parks & Lake Rejuvenation", amount: 48000000, count: 42, percentage: 19.3 },
      { sector: "Solar Energy & Smart Lighting", amount: 26000000, count: 32, percentage: 10.4 },
      { sector: "Traffic & Pedestrian Upgrades", amount: 15000000, count: 16, percentage: 6.0 }
    ],
    implementing_agencies: [
      "Bruhat Bengaluru Mahanagara Palike (BBMP)",
      "Karnataka Health System Development Project",
      "Bengaluru Smart City Ltd"
    ],
    key_priorities: [
      "Hospital critical care & dialysis center upgrades",
      "Public school science/computer laboratories",
      "Urban lung spaces & neighborhood park amenities"
    ],
    observations_summary: "1 observation for vendor supply delays during municipal medical device delivery window.",
    avatar_initials: "TS"
  },
  {
    id: "MP-TN-TUT-09",
    name: "Kanimozhi Karunanidhi",
    party: "DMK",
    party_color: "#b91c1c",
    house: "Lok Sabha",
    state: "Tamil Nadu",
    constituency: "Thoothukkudi",
    term: "18th Lok Sabha (2nd Term)",
    sanctioned_amount: 248000000,
    recommended_amount: 265000000,
    expenditure_amount: 218000000,
    utilization_rate: 87.9,
    completion_rate: 88.6,
    total_works_recommended: 240,
    total_works_sanctioned: 220,
    completed_works: 195,
    in_progress_works: 19,
    delayed_works: 6,
    flagged_observations: 1,
    top_sectors: [
      { sector: "Education & School Infrastructure", amount: 90000000, count: 78, percentage: 36.3 },
      { sector: "Desalination & Clean Water", amount: 65000000, count: 52, percentage: 26.2 },
      { sector: "Fishermen Infrastructure & Cold Storage", amount: 48000000, count: 41, percentage: 19.4 },
      { sector: "Primary Health & Ambulances", amount: 28000000, count: 31, percentage: 11.3 },
      { sector: "Solar Lighting", amount: 17000000, count: 18, percentage: 6.8 }
    ],
    implementing_agencies: [
      "Thoothukkudi District Rural Development Agency (DRDA)",
      "Tamil Nadu Water Supply and Drainage Board (TWAD)",
      "Thoothukkudi City Municipal Corporation"
    ],
    key_priorities: [
      "Government school libraries & smart classrooms",
      "Reverse osmosis plants in coastal salinity zones",
      "Fish landing center fish drying & storage sheds"
    ],
    observations_summary: "1 observation noted for localized groundwater clearance timing on coastal RO project.",
    avatar_initials: "KK"
  },
  {
    id: "MP-UP-KNJ-10",
    name: "Akhilesh Yadav",
    party: "SP",
    party_color: "#dc2626",
    house: "Lok Sabha",
    state: "Uttar Pradesh",
    constituency: "Kannauj",
    term: "18th Lok Sabha (4th Term)",
    sanctioned_amount: 250000000,
    recommended_amount: 270000000,
    expenditure_amount: 192000000,
    utilization_rate: 76.8,
    completion_rate: 82.0,
    total_works_recommended: 220,
    total_works_sanctioned: 200,
    completed_works: 164,
    in_progress_works: 26,
    delayed_works: 10,
    flagged_observations: 2,
    top_sectors: [
      { sector: "Rural Roads & Agro Connectivity", amount: 98000000, count: 82, percentage: 39.2 },
      { sector: "Agro Markets & Perfume Cluster Assets", amount: 64000000, count: 48, percentage: 25.6 },
      { sector: "Healthcare & Trauma Units", amount: 42000000, count: 32, percentage: 16.8 },
      { sector: "Education & Degree Colleges", amount: 28000000, count: 24, percentage: 11.2 },
      { sector: "Drinking Water", amount: 18000000, count: 14, percentage: 7.2 }
    ],
    implementing_agencies: [
      "Public Works Department (PWD Kannauj)",
      "Mandi Parishad UP",
      "UP Jal Nigam"
    ],
    key_priorities: [
      "Agro-logistics roads connecting farms to GT Road",
      "Traditional perfumery skill and testing amenities",
      "Rural health clinic diagnostic equipment"
    ],
    observations_summary: "2 observations regarding slow release of second stage installments on mandi link roads.",
    avatar_initials: "AY"
  },
  {
    id: "MP-TS-SEC-11",
    name: "G. Kishan Reddy",
    party: "BJP",
    party_color: "#ea580c",
    house: "Lok Sabha",
    state: "Telangana",
    constituency: "Secunderabad",
    term: "18th Lok Sabha (2nd Term)",
    sanctioned_amount: 250000000,
    recommended_amount: 260000000,
    expenditure_amount: 228000000,
    utilization_rate: 91.2,
    completion_rate: 91.8,
    total_works_recommended: 215,
    total_works_sanctioned: 195,
    completed_works: 179,
    in_progress_works: 12,
    delayed_works: 4,
    flagged_observations: 1,
    top_sectors: [
      { sector: "Urban Infrastructure & Flyover Lighting", amount: 94000000, count: 64, percentage: 37.6 },
      { sector: "Healthcare & Military Hospital Support", amount: 62000000, count: 45, percentage: 24.8 },
      { sector: "Railway Cantonment Roads", amount: 48000000, count: 39, percentage: 19.2 },
      { sector: "Community Skill Centers", amount: 28000000, count: 28, percentage: 11.2 },
      { sector: "Water Pipelines & Borewells", amount: 18000000, count: 19, percentage: 7.2 }
    ],
    implementing_agencies: [
      "Secunderabad Cantonment Board (SCB)",
      "Greater Hyderabad Municipal Corporation (GHMC)",
      "TSEWIDC"
    ],
    key_priorities: [
      "Cantonment civil amenities and lighting",
      "Government hospital diagnostic machines",
      "Youth digital education libraries"
    ],
    observations_summary: "1 observation for cantonment jurisdiction approval coordination delay.",
    avatar_initials: "KR"
  },
  {
    id: "MP-BR-HAJ-12",
    name: "Chirag Paswan",
    party: "LJP-RV",
    party_color: "#3b82f6",
    house: "Lok Sabha",
    state: "Bihar",
    constituency: "Hajipur",
    term: "18th Lok Sabha (3rd Term)",
    sanctioned_amount: 246000000,
    recommended_amount: 265000000,
    expenditure_amount: 185000000,
    utilization_rate: 75.2,
    completion_rate: 77.0,
    total_works_recommended: 235,
    total_works_sanctioned: 200,
    completed_works: 154,
    in_progress_works: 34,
    delayed_works: 12,
    flagged_observations: 3,
    top_sectors: [
      { sector: "Flood Resistant Roads & Culverts", amount: 96000000, count: 88, percentage: 39.0 },
      { sector: "Food Processing & Banana Cluster Amenities", amount: 58000000, count: 42, percentage: 23.6 },
      { sector: "Rural Drinking Water", amount: 44000000, count: 35, percentage: 17.9 },
      { sector: "Education & Intermediate Colleges", amount: 30000000, count: 21, percentage: 12.2 },
      { sector: "Solar Lighting in Wards", amount: 18000000, count: 14, percentage: 7.3 }
    ],
    implementing_agencies: [
      "Rural Works Department (RWD Vaishali)",
      "District Board Hajipur",
      "PHED Bihar"
    ],
    key_priorities: [
      "Low-lying flood culverts and raised link paths",
      "Banana and horticulture agro-storage sheds",
      "Secondary school lab equipment and boundaries"
    ],
    observations_summary: "3 observations on recurrent monsoon inundation work stoppages resulting in extended completion horizons.",
    avatar_initials: "CP"
  }
];

export function getMPById(id: string): MPProfile | undefined {
  return MP_PROFILES.find((mp) => mp.id === id);
}

export function searchMPs(query: string): MPProfile[] {
  if (!query.trim()) return MP_PROFILES;
  const q = query.toLowerCase();
  return MP_PROFILES.filter(
    (mp) =>
      mp.name.toLowerCase().includes(q) ||
      mp.constituency.toLowerCase().includes(q) ||
      mp.state.toLowerCase().includes(q) ||
      mp.party.toLowerCase().includes(q)
  );
}
