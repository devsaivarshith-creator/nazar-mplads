export function resolveAnyMP(query: string): MPProfile | undefined {
  return findMPByQuery(query);
}

export const CONSTITUENCY_TO_MP_MAP: Record<string, string> = Object.fromEntries(
  ALL_INDIA_MPS.map(mp => [mp.constituency.toLowerCase(), mp.name])
);

export function isGeneralQuery(q: string): boolean {
  const gen = [
    "what is nazar", "hello", "hi ", "hey ", "today", "about nazar",
    "how are you", "what can you do", "introduce", "good morning",
    "good evening", "good afternoon", "tell me about today", "smth",
    "something", "help me", "what do", "explain nazar"
  ];
  const lower = q.toLowerCase();
  return gen.some(g => lower.includes(g)) &&
    !lower.includes("mp") &&
    !lower.includes("constituency") &&
    !lower.includes("mplads") &&
    lower.length < 80;
}

export function isStateMPListQuery(q: string): { isStateList: boolean; stateName?: string } {
  const lower = q.toLowerCase();
  const stateAliases: Record<string, string> = {
    "telangana": "Telangana", "telanagana": "Telangana", "telengana": "Telangana",
    "andhra": "Andhra Pradesh", "andhra pradesh": "Andhra Pradesh",
    "kerala": "Kerala", "karnataka": "Karnataka",
    "tamil nadu": "Tamil Nadu", "tamilnadu": "Tamil Nadu",
    "maharashtra": "Maharashtra", "uttar pradesh": "Uttar Pradesh",
    "up": "Uttar Pradesh", "bihar": "Bihar",
    "west bengal": "West Bengal", "odisha": "Odisha",
    "rajasthan": "Rajasthan", "madhya pradesh": "Madhya Pradesh",
    "gujarat": "Gujarat", "delhi": "Delhi",
    "haryana": "Haryana", "punjab": "Punjab",
    "assam": "Assam", "jharkhand": "Jharkhand",
    "chhattisgarh": "Chhattisgarh", "himachal": "Himachal Pradesh",
    "uttarakhand": "Uttarakhand", "goa": "Goa",
    "manipur": "Manipur", "nagaland": "Nagaland",
    "tripura": "Tripura", "sikkim": "Sikkim",
    "arunachal": "Arunachal Pradesh", "mizoram": "Mizoram",
    "meghalaya": "Meghalaya", "puducherry": "Puducherry",
    "ladakh": "Ladakh", "jammu": "Jammu And Kashmir",
    "kashmir": "Jammu And Kashmir", "chandigarh": "Chandigarh"
  };
  const listIndicators = ["list", "all mps", "all mp", "mps of", "mp of", "all the mps", "show mps", "roster of"];
  const hasListIntent = listIndicators.some(li => lower.includes(li));
  if (!hasListIntent) return { isStateList: false };
  for (const [alias, stateName] of Object.entries(stateAliases)) {
    if (lower.includes(alias)) return { isStateList: true, stateName };
  }
  return { isStateList: false };
}

export function generateStateMPsRoster(stateName: string): string {
  const stateMPs = ALL_INDIA_MPS.filter(mp => mp.state.toLowerCase() === stateName.toLowerCase());
  if (stateMPs.length === 0) {
    return `No MPs found for state: ${stateName}. The database currently covers ${ALL_INDIA_MPS.length} MPs across India.`;
  }
  const rows = stateMPs.map((mp, i) =>
    `| ${i + 1} | **${mp.constituency}** | ${mp.name} | ${mp.party} (${mp.house}) | ${mp.utilization_rate}% utilized |`
  );
  return [
    `### 🏛️ Complete Roster: MPs representing **${stateName}** (${stateMPs.length} MPs)`,
    ``,
    `Below is the complete official listing of Lok Sabha and Rajya Sabha representatives for **${stateName}** with verified MPLADS utilization figures from MoSPI eSAKSHI:`,
    ``,
    `| No. | Constituency / Seat | Elected MP | Political Party | MPLADS Utilization |`,
    `| :--- | :--- | :--- | :--- | :--- |`,
    rows.join('\n'),
    ``,
    `*Data sourced directly from official MoSPI MPLADS eSAKSHI reporting data.*`
  ].join('\n');
}

export function generateGeneralQueryAnswer(q: string): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return [
    `### 📅 NAZAR Daily Intelligence Briefing · **${dateStr}**`,
    ``,
    `Welcome to **NAZAR (National Anomaly & Zone-based Review)** — India's independent, AI-assisted public oversight copilot for parliamentary accountability and MPLADS developmental expenditure.`,
    ``,
    `#### 📊 Current Public Monitoring Coverage`,
    `- **Members of Parliament tracked:** ${ALL_INDIA_MPS.length} Lok Sabha & Rajya Sabha MPs`,
    `- **States covered:** 28 States + 8 Union Territories`,
    `- **MPLADS works tracked:** Across all Parliamentary Constituencies`,
    `- **Anomaly detection engines:** 5 deterministic mathematical detectors (Timeline, Financial, Duplicates, Delays, Agency Concentration)`,
    ``,
    `#### 🎯 What NAZAR Can Help You With`,
    `- **Search any MP** by name or constituency (e.g., "Asaduddin Owaisi", "Varanasi", "Kishan Reddy")`,
    `- **Query MPLADS project status** (e.g., "stalled projects in Hyderabad")`,
    `- **List all MPs** of any Indian state (e.g., "list all mps of telangana")`,
    `- **Find constituency representative** (e.g., "who is the mp of varanasi")`,
    `- **Compare MPs** side by side with real CSV fund utilization data`,
    ``,
    `*NAZAR is an independent civic-tech prototype built for SIH 2026 (Problem Statement SIH26102). Not an official Government of India website.*`
  ].join('\n');
}
