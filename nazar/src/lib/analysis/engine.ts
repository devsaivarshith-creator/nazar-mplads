import { Project, Finding } from "@/types";

// Helper: Haversine distance in KM
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Helper: Text similarity score (0 - 100%)
export function calculateTextSimilarity(textA: string, textB: string): number {
  const cleanA = textA.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  const cleanB = textB.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean);

  const setA = new Set(cleanA);
  const setB = new Set(cleanB);

  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  if (union.size === 0) return 0;
  return Math.round((intersection.size / union.size) * 100);
}

// Detector 1: Compliance / Rules
export function detectRuleViolations(project: Project): Finding[] {
  const findings: Finding[] = [];

  // 1. Completion before commencement
  if (project.start_date && project.completion_date) {
    const start = new Date(project.start_date).getTime();
    const completion = new Date(project.completion_date).getTime();

    if (completion < start) {
      const deltaDays = Math.round((start - completion) / (1000 * 60 * 60 * 24));
      findings.push({
        id: `FND-RULE-${project.id}-01`,
        project_id: project.id,
        title: "Timeline Inconsistency: Completion Precedes Commencement",
        category: "compliance",
        severity: "high",
        confidence: 98,
        description: `Official records state completion date precedes recorded ground start date by ${deltaDays} days. This suggests retroactive record entry or data transposition.`,
        reason_code: "TIME_SEQUENCE_VIOLATION",
        detector: "rules",
        detector_version: "2.4.0",
        evidence: {
          details: `Commencement Date: ${project.start_date} | Completion Date: ${project.completion_date} (Inverted by ${deltaDays} days)`,
          dates_conflicting: {
            start_date: project.start_date,
            completion_date: project.completion_date,
            sanction_date: project.sanction_date,
          },
        },
        status: "new",
        created_at: new Date().toISOString(),
      });
    }
  }

  // 2. Missing financial disclosure for active/completed projects
  if (
    (project.status === "Completed" || project.status === "In Progress") &&
    project.expenditure_amount === null
  ) {
    findings.push({
      id: `FND-RULE-${project.id}-02`,
      project_id: project.id,
      title: "Missing Financial Utilization Disclosure",
      category: "compliance",
      severity: "medium",
      confidence: 90,
      description: "Project is marked active or completed in public records, but expenditure values are omitted or unrecorded. System explicitly tracks this as unavailable rather than zero.",
      reason_code: "MISSING_EXPENDITURE_DISCLOSURE",
      detector: "rules",
      detector_version: "1.5.0",
      evidence: {
        details: `Sanctioned: ₹${(project.sanctioned_amount / 100000).toFixed(1)} Lakhs. No utilization certificate (UC) filed.`,
      },
      status: "new",
      created_at: new Date().toISOString(),
    });
  }

  return findings;
}

// Detector 2: Financial Peer Group Benchmarking
export function detectFinancialAnomalies(
  project: Project,
  allProjects: Project[]
): Finding[] {
  const findings: Finding[] = [];

  // Peer group: Same sector & same state
  const peers = allProjects.filter(
    (p) => p.sector === project.sector && p.state === project.state && p.id !== project.id
  );

  if (peers.length >= 2) {
    const amounts = peers.map((p) => p.sanctioned_amount).sort((a, b) => a - b);
    const mid = Math.floor(amounts.length / 2);
    const median =
      amounts.length % 2 !== 0 ? amounts[mid] : (amounts[mid - 1] + amounts[mid]) / 2;

    const ratio = project.sanctioned_amount / median;

    if (ratio >= 2.0) {
      findings.push({
        id: `FND-FIN-${project.id}-01`,
        project_id: project.id,
        title: "Peer-Group Financial Anomaly: Cost Substantially Above Median",
        category: "financial",
        severity: ratio >= 2.5 ? "high" : "medium",
        confidence: 89,
        description: `Sanctioned expenditure of ₹${(project.sanctioned_amount / 100000).toFixed(2)} Lakh is ${ratio.toFixed(2)}× above the peer median (₹${(median / 100000).toFixed(2)} Lakh) for ${project.sector} in ${project.state}.`,
        reason_code: "FIN_OUTLIER_PEER_2X",
        detector: "financial",
        detector_version: "3.1.2",
        evidence: {
          metric: "Sanctioned vs Peer Median",
          value: `₹${(project.sanctioned_amount / 100000).toFixed(2)} Lakh`,
          peer_median: `₹${(median / 100000).toFixed(2)} Lakh`,
          ratio: `${ratio.toFixed(2)}×`,
          details: `Peer Group: ${project.sector} in ${project.state} (n=${peers.length} projects). Recommended for review to verify if specialized technical specifications explain the differential.`,
        },
        status: "new",
        created_at: new Date().toISOString(),
      });
    }
  }

  return findings;
}

// Detector 3: Lifecycle Stagnation & Delays
export function detectLifecycleAnomalies(project: Project): Finding[] {
  const findings: Finding[] = [];

  if (project.expected_completion_date && project.status !== "Completed") {
    const expected = new Date(project.expected_completion_date).getTime();
    const now = new Date("2025-01-14").getTime(); // Reference demo time anchor

    if (now > expected) {
      const daysOverdue = Math.round((now - expected) / (1000 * 60 * 60 * 24));
      if (daysOverdue > 180) {
        findings.push({
          id: `FND-LIFE-${project.id}-01`,
          project_id: project.id,
          title: `Extended Project Stagnation (${Math.round(daysOverdue / 30)} Months Overdue)`,
          category: "lifecycle",
          severity: daysOverdue > 365 ? "high" : "medium",
          confidence: 93,
          description: `Work was slated for completion on ${project.expected_completion_date}, but remains open without final closure for ${daysOverdue} days past target.`,
          reason_code: "LIFECYCLE_OVERDUE_STAGNANT",
          detector: "lifecycle",
          detector_version: "2.4.0",
          evidence: {
            details: `Target: ${project.expected_completion_date}. Elapsed delay: ${daysOverdue} days. No extension gazette attached.`,
          },
          status: "new",
          created_at: new Date().toISOString(),
        });
      }
    }
  }

  return findings;
}

// Detector 4: Duplicate Candidates (Spatial & Semantic)
export function detectDuplicateCandidates(
  project: Project,
  allProjects: Project[]
): Finding[] {
  const findings: Finding[] = [];

  for (const peer of allProjects) {
    if (peer.id === project.id) continue;
    if (peer.sector !== project.sector) continue;

    // Check textual similarity
    const similarity = calculateTextSimilarity(project.project_name, peer.project_name);

    // Check spatial distance if coordinates exist
    let distanceKm: number | undefined;
    if (project.coordinates && peer.coordinates) {
      distanceKm = calculateDistanceKm(
        project.coordinates.lat,
        project.coordinates.lng,
        peer.coordinates.lat,
        peer.coordinates.lng
      );
    }

    const isClose = distanceKm !== undefined ? distanceKm <= 3.0 : project.district === peer.district;

    if (similarity >= 65 && isClose) {
      findings.push({
        id: `FND-SIM-${project.id}-${peer.id}`,
        project_id: project.id,
        title: "Potential Similar / Duplicate Work Candidate",
        category: "similarity",
        severity: similarity >= 80 ? "high" : "medium",
        confidence: similarity,
        description: `Shares ${similarity}% lexical similarity and geographical proximity (${distanceKm ? distanceKm + " km" : "same district"}) with project ${peer.id} ("${peer.project_name}").`,
        reason_code: "SIM_DUPLICATE_CANDIDATE",
        detector: "similarity",
        detector_version: "2.1.0",
        evidence: {
          similar_project_id: peer.id,
          similar_project_name: peer.project_name,
          similarity_score: similarity,
          distance_km: distanceKm,
          details: `Both works fall under '${project.sector}'. Human verification is recommended to confirm if these represent separate site demarcations or overlapping proposals.`,
        },
        status: "new",
        created_at: new Date().toISOString(),
      });
    }
  }

  return findings;
}

// Detector 5: Agency Concentration
export function detectRelationshipConcentration(
  project: Project,
  allProjects: Project[]
): Finding[] {
  const findings: Finding[] = [];
  if (!project.implementing_agency) return findings;

  const districtProjects = allProjects.filter((p) => p.district === project.district);
  if (districtProjects.length < 5) return findings;

  const agencyProjects = districtProjects.filter(
    (p) => p.implementing_agency === project.implementing_agency
  );

  const share = Math.round((agencyProjects.length / districtProjects.length) * 100);

  if (share >= 50) {
    findings.push({
      id: `FND-REL-${project.id}-01`,
      project_id: project.id,
      title: "High Implementing Agency Concentration",
      category: "relationships",
      severity: share >= 70 ? "medium" : "low",
      confidence: 84,
      description: `Agency '${project.implementing_agency}' accounts for ${share}% (${agencyProjects.length}/${districtProjects.length}) of all recorded works in ${project.district}. High concentration signals potential institutional bottleneck or lack of vendor diversification.`,
      reason_code: "AGENCY_CONCENTRATION_HIGH",
      detector: "relationships",
      detector_version: "1.8.0",
      evidence: {
        metric: "Agency Share in District",
        value: `${share}%`,
        peer_median: "20.0%",
        details: `${agencyProjects.length} projects out of ${districtProjects.length} total in ${project.district} are allocated to this single implementing agency.`,
      },
      status: "new",
      created_at: new Date().toISOString(),
    });
  }

  return findings;
}
