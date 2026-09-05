export type FindingSeverity = "low" | "medium" | "high" | "critical";

export type FindingCategory = 
  | "compliance"
  | "financial"
  | "lifecycle"
  | "similarity"
  | "relationships";

export type FindingStatus =
  | "new"
  | "reviewing"
  | "explained"
  | "data_error"
  | "duplicate"
  | "resolved"
  | "escalated"
  | "insufficient_evidence";

export interface FindingEvidence {
  metric?: string;
  value?: string | number;
  peer_median?: string | number;
  ratio?: string;
  similar_project_id?: string;
  similar_project_name?: string;
  similarity_score?: number;
  distance_km?: number;
  dates_conflicting?: {
    start_date?: string;
    completion_date?: string;
    sanction_date?: string;
  };
  details: string;
  source_record_ids?: string[];
}

export interface Finding {
  id: string;
  project_id: string;
  title: string;
  category: FindingCategory;
  severity: FindingSeverity;
  confidence: number; // 0 - 100%
  description: string;
  reason_code: string;
  detector: "rules" | "financial" | "lifecycle" | "similarity" | "relationships";
  detector_version: string;
  evidence: FindingEvidence;
  status: FindingStatus;
  created_at: string;
  reviewed_by?: string;
  review_notes?: string;
}

export type ProjectStatus = 
  | "Recommended"
  | "Sanctioned"
  | "In Progress"
  | "Completed"
  | "Delayed"
  | "Stalled"
  | "Closed";

export interface ProjectTimelineEvent {
  event_type: string;
  date: string;
  title: string;
  description: string;
  amount?: number;
  source_id?: string;
}

export interface Project {
  id: string;
  external_id: string;
  project_name: string;
  state: string;
  district: string;
  constituency: string;
  mp_name: string;
  mp_party?: string;
  mp_house?: "Lok Sabha" | "Rajya Sabha";
  sector: string;
  sub_sector?: string;
  implementing_agency: string;
  location: string;
  village?: string;
  block?: string;
  sanctioned_amount: number;
  recommended_amount?: number;
  expenditure_amount: number | null; // explicitly null if missing! Never 0.
  status: ProjectStatus;
  recommendation_date?: string;
  sanction_date?: string;
  start_date?: string;
  expected_completion_date?: string;
  completion_date?: string;
  source_system: string;
  source_url: string;
  source_record_id: string;
  retrieved_at: string;
  findings: Finding[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  similar_project_ids?: string[];
  timeline_events?: ProjectTimelineEvent[];
}

export interface InvestigationAction {
  id: string;
  action_type: 
    | "explain_exception"
    | "mark_data_error"
    | "mark_duplicate"
    | "request_information"
    | "assign_inspection"
    | "escalate"
    | "close_investigation";
  user_name: string;
  user_role: string;
  previous_state: string;
  new_state: string;
  reason: string;
  timestamp: string;
}

export interface Investigation {
  id: string;
  case_number: string;
  title: string;
  primary_project_id: string;
  related_project_ids: string[];
  status: "new" | "under_review" | "inspection_assigned" | "explained" | "data_error" | "resolved" | "escalated";
  priority: "low" | "medium" | "high" | "critical";
  assigned_reviewer?: string;
  summary: string;
  reason_prioritized: string;
  created_at: string;
  updated_at: string;
  actions: InvestigationAction[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  data_table?: {
    headers: string[];
    rows: (string | number)[][];
  };
  metrics?: { label: string; value: string; delta?: string }[];
  sources: string[];
}

export interface GeneratedReport {
  id: string;
  title: string;
  scope_type: "State" | "District" | "Constituency" | "MP" | "National";
  scope_name: string;
  period: string;
  topics: string[];
  executive_summary: string;
  sections: ReportSection[];
  limitations: string[];
  sources: {
    title: string;
    url: string;
    type: string;
    retrieved_at: string;
  }[];
  status: "draft" | "generating" | "finalized";
  created_at: string;
  project_count: number;
  flagged_count: number;
  total_expenditure: number;
}

export interface IssueReport {
  id: string;
  tracking_id: string;
  project_id: string;
  project_name: string;
  category: 
    | "Incorrect project information"
    | "Location issue"
    | "Completion issue"
    | "Financial information"
    | "Possible duplicate"
    | "Documentation"
    | "Other";
  description: string;
  reporter_name?: string;
  reporter_email?: string;
  status: "Submitted" | "Under Review" | "Information Requested" | "Resolved";
  created_at: string;
  notes?: string;
}

export interface SourceRecord {
  id: string;
  source_system: string;
  source_url: string;
  source_record_id: string;
  retrieved_at: string;
  source_type: "Official Portal Export" | "Public Disclosures" | "District Notification" | "Audit Report";
  raw_data: Record<string, any>;
  verification_status: "Verified Public Record" | "Third-party Mirror" | "Pending Recrawl";
}

export interface MPSectorBreakdown {
  sector: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface MPProfile {
  id: string;
  name: string;
  party: string;
  party_color: string;
  house: "Lok Sabha" | "Rajya Sabha";
  state: string;
  constituency: string;
  term: string;
  sanctioned_amount: number;
  recommended_amount: number;
  expenditure_amount: number;
  utilization_rate: number; // percentage e.g. 78.4
  completion_rate: number; // percentage e.g. 82.1
  total_works_recommended: number;
  total_works_sanctioned: number;
  completed_works: number;
  in_progress_works: number;
  delayed_works: number;
  flagged_observations: number;
  top_sectors: MPSectorBreakdown[];
  implementing_agencies: string[];
  key_priorities: string[];
  observations_summary: string;
  avatar_initials: string;
}

export interface MPDelayedProject {
  id: string;
  title: string;
  sector: string;
  sanctioned_amount: number;
  sanction_date: string;
  target_completion: string;
  days_overdue: number;
  agency: string;
  cause: string;
  risk_level: "HIGH" | "MEDIUM" | "LOW";
  status: string;
}

export interface InvestigationDossier {
  dossier_id: string;
  generated_at: string;
  subject_name: string;
  subject_constituency: string;
  subject_state: string;
  subject_party: string;
  executive_summary: string;
  financial_overview: {
    sanctioned: number;
    expended: number;
    unspent: number;
    utilization_rate: number;
    completion_rate: number;
  };
  delayed_projects: MPDelayedProject[];
  anomalies: {
    type: string;
    description: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    recommended_action: string;
  }[];
  web_search_evidence: {
    source_title: string;
    source_url: string;
    verified_status: string;
    relevance_note: string;
  }[];
  investigation_notes: string[];
  recommendations: string[];
}
