"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldAlert,
  Building,
  Calendar,
  IndianRupee,
  MapPin,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  ShieldCheck,
  Send,
  GitCompare,
  ArrowRight,
  Database,
  Info,
} from "lucide-react";
import { MOCK_PROJECTS, MOCK_INVESTIGATIONS } from "@/lib/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MockAIProvider } from "@/lib/ai/providers";
import { Project, Finding } from "@/types";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const projectId = resolvedParams.id;

  const project = MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];
  const relatedProjects = MOCK_PROJECTS.filter((p) =>
    project.similar_project_ids?.includes(p.id)
  );

  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "financials" | "findings" | "evidence" | "sources"
  >("overview");

  // AI Q&A State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<{
    answer: string;
    sources: string[];
    keyPoints?: string[];
  } | null>(null);

  // Issue Reporting Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [issueCategory, setIssueCategory] = useState("Incorrect project information");
  const [issueDescription, setIssueDescription] = useState("");
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  // Compare Modal State
  const [compareProject, setCompareProject] = useState<Project | null>(null);

  const handleAskNazar = async () => {
    setAiLoading(true);
    const ai = new MockAIProvider();
    const res = await ai.answerQuestion(
      `Why did NAZAR flag project ${project.id}?`,
      { project, findings: project.findings }
    );
    setAiExplanation(res);
    setAiLoading(false);
    setActiveTab("findings");
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIssueSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setIssueSubmitted(false);
      setIssueDescription("");
    }, 2000);
  };

  const hasTimelineInversion = project.start_date && project.completion_date && new Date(project.completion_date) < new Date(project.start_date);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#1c2024] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project Registry</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-[#475569] bg-white border border-[#dedcd4] hover:bg-[#faf9f6] rounded-xl transition-all shadow-xs"
          >
            Report an Issue
          </button>

          <Link
            href={`/investigations/INV-2025-0042`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1c2024] hover:bg-[#2e363e] rounded-xl transition-all shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Investigation</span>
          </Link>
        </div>
      </div>

      {/* Project Header Banner */}
      <div className="bg-white rounded-3xl border border-[#e4e2da] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#64748b] bg-[#f5f4ee] px-2.5 py-1 rounded-md border border-[#dedcd4]">
                {project.id}
              </span>
              <span className="text-xs font-semibold text-[#475569]">
                {project.district}, {project.state}
              </span>
              <span className="text-xs text-[#8b95a1]">·</span>
              <span className="text-xs font-medium text-[#475569]">
                Constituency: {project.constituency}
              </span>
              <span className="text-xs text-[#8b95a1]">·</span>
              <span className="text-xs font-medium text-[#475569]">
                MP: {project.mp_name} ({project.mp_party || "Lok Sabha"})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c2024] leading-snug">
              {project.project_name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748b] pt-1">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#8b95a1]" />
                <strong>Implementing Agency:</strong> {project.implementing_agency}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8b95a1]" />
                <strong>Location:</strong> {project.location}
              </span>
            </div>
          </div>

          {/* Key Metric Highlight Box */}
          <div className="bg-[#faf9f5] border border-[#ebe8df] rounded-2xl p-5 min-w-[240px] space-y-3">
            <div>
              <div className="text-[11px] font-bold uppercase text-[#8b95a1] tracking-wider">
                Sanctioned Amount
              </div>
              <div className="text-2xl font-bold text-[#1c2024]">
                {formatCurrency(project.sanctioned_amount)}
              </div>
              <div className="text-xs text-[#64748b]">
                Expended: <span className="font-semibold text-[#334155]">{formatCurrency(project.expenditure_amount)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e8e5dc] flex items-center justify-between">
              <span className="text-xs text-[#64748b]">Status</span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  project.status === "Completed"
                    ? "bg-emerald-100 text-emerald-800"
                    : project.status === "Delayed"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* AI Triage Banner if Flagged */}
        {project.findings.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  NAZAR Analysis: {project.findings.length} Automated Observation(s)
                  <span className="text-[10px] font-normal uppercase bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
                    Review Recommended
                  </span>
                </div>
                <div className="text-xs text-amber-900/80 mt-0.5">
                  Automated checks detected timeline, peer-cost, or similarity items requiring administrative review.
                </div>
              </div>
            </div>

            <button
              onClick={handleAskNazar}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-amber-950 border border-amber-300 font-semibold text-xs hover:bg-amber-100/50 shadow-xs transition-all shrink-0 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{aiLoading ? "Consulting Engine..." : "Ask NAZAR: Why Flagged?"}</span>
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-[#ecebe6] overflow-x-auto pt-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "timeline", label: "Timeline & Lifecycle" },
            { id: "financials", label: "Financials & Peers" },
            { id: "findings", label: `Observations (${project.findings.length})` },
            { id: "evidence", label: "Evidence & Related Works" },
            { id: "sources", label: "Public Source Lineage" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#c25e00] text-[#1c2024]"
                  : "border-transparent text-[#64748b] hover:text-[#1c2024]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-[#e4e2da] p-6 shadow-card space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#64748b]">
                Work Specifications
              </h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8b95a1] block">Primary Sector</span>
                  <span className="font-semibold text-[#1c2024]">{project.sector}</span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">Sub-Sector</span>
                  <span className="font-semibold text-[#1c2024]">{project.sub_sector || "General"}</span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">Block / Mandal</span>
                  <span className="font-semibold text-[#1c2024]">{project.block || "Urban District"}</span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">Village / Revenue Ward</span>
                  <span className="font-semibold text-[#1c2024]">{project.village || project.location}</span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">External Gazette ID</span>
                  <span className="font-mono font-medium text-[#1c2024]">{project.external_id}</span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">eSAKSHI Work Code</span>
                  <span className="font-mono font-medium text-[#1c2024]">{project.source_record_id}</span>
                </div>
              </div>
            </div>

            {/* Implementing Agency Information */}
            <div className="bg-white rounded-2xl border border-[#e4e2da] p-6 shadow-card space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#64748b]">
                Executive Oversight & Agency
              </h2>
              <p className="text-xs text-[#334155] leading-relaxed">
                Work execution assigned by District Nodal Authority to{" "}
                <strong className="text-[#1c2024]">{project.implementing_agency}</strong> under standard state public works terms.
              </p>
            </div>
          </div>

          {/* Right Column: MP & Provenance Snapshot */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#e4e2da] p-6 shadow-card space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#64748b]">
                Parliamentary Sponsorship
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#f2efe9] flex items-center justify-center text-sm font-bold text-[#1c2024]">
                  {project.mp_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1c2024]">{project.mp_name}</div>
                  <div className="text-xs text-[#64748b]">
                    {project.constituency} ({project.mp_house || "Lok Sabha"})
                  </div>
                  <div className="text-[11px] font-semibold text-amber-800">
                    Party: {project.mp_party}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#faf9f6] rounded-2xl border border-[#e4e2da] p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#475569] uppercase tracking-wider">
                <Database className="w-4 h-4 text-emerald-600" />
                Verified Provenance
              </div>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Ingested from {project.source_system}. Retrieved on {formatDate(project.retrieved_at)}.
              </p>
              <a
                href={project.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:underline pt-1"
              >
                Inspect Official Public Portal Record <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Timeline & Lifecycle */}
      {activeTab === "timeline" && (
        <div className="bg-white rounded-2xl border border-[#e4e2da] p-8 shadow-card space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1c2024] font-serif">
                Project Lifecycle Stages
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Full chronological trajectory from MP recommendation to ground certification.
              </p>
            </div>
            {hasTimelineInversion && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-900 border border-rose-200 text-xs font-bold rounded-full">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Inverted Chronology Flagged
              </span>
            )}
          </div>

          {/* Stepper View */}
          <div className="relative border-l-2 border-[#ecebe6] ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 py-2">
            {project.timeline_events?.map((evt, idx) => {
              const isInconsistent =
                evt.event_type.includes("Completion") &&
                hasTimelineInversion;

              return (
                <div key={idx} className="relative group">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                      isInconsistent
                        ? "bg-rose-100 border-rose-500 text-rose-800 ring-4 ring-rose-50"
                        : "bg-white border-amber-600 text-amber-700"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#1c2024]">
                        {evt.title}
                      </span>
                      <span className="text-xs font-mono text-[#8b95a1] bg-[#f5f4ee] px-2 py-0.5 rounded">
                        {formatDate(evt.date)}
                      </span>
                      {isInconsistent && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                          Precedes Start Date
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748b] max-w-2xl leading-relaxed">
                      {evt.description}
                    </p>
                    {evt.amount && (
                      <div className="text-xs font-semibold text-[#334155] pt-0.5">
                        Amount: {formatCurrency(evt.amount)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Financials & Peer Group Benchmarking */}
      {activeTab === "financials" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#e4e2da] p-6 shadow-card space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b95a1]">
                Sanctioned Amount
              </span>
              <div className="text-3xl font-bold text-[#1c2024]">
                {formatCurrency(project.sanctioned_amount)}
              </div>
              <span className="text-xs text-[#64748b] block">Approved by District Authority</span>
            </div>

            <div className="bg-white rounded-2xl border border-[#e4e2da] p-6 shadow-card space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b95a1]">
                Expended Amount
              </span>
              <div className="text-3xl font-bold text-[#1c2024]">
                {formatCurrency(project.expenditure_amount)}
              </div>
              <span className="text-xs text-[#64748b] block">
                {project.expenditure_amount
                  ? `${Math.round(
                      (project.expenditure_amount / project.sanctioned_amount) * 100
                    )}% of Sanctioned`
                  : "Data unavailable in portal"}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#e4e2da] p-6 shadow-card space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b95a1]">
                Peer Group Median
              </span>
              <div className="text-3xl font-bold text-amber-900">
                ₹32.40 Lakh
              </div>
              <span className="text-xs text-amber-700 font-semibold block">
                This project is ~2.11× above median
              </span>
            </div>
          </div>

          {/* Peer Comparison Visualization */}
          <div className="bg-white rounded-2xl border border-[#e4e2da] p-8 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-[#1c2024] font-serif">
              Peer-Group Cost Distribution
            </h2>
            <p className="text-xs text-[#64748b]">
              Benchmarked against 142 comparable urban community halls across Telangana.
            </p>

            {/* Visual Bar Comparison */}
            <div className="space-y-4 max-w-2xl">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>This Project ({project.id})</span>
                  <span className="text-[#1c2024] font-bold">₹68.50 Lakh</span>
                </div>
                <div className="w-full h-5 bg-[#f2efe9] rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full w-[95%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Peer Group 75th Percentile</span>
                  <span className="text-[#64748b]">₹39.80 Lakh</span>
                </div>
                <div className="w-full h-4 bg-[#f2efe9] rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-[#8b95a1] rounded-full w-[55%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Peer Group Median</span>
                  <span className="text-[#64748b]">₹32.40 Lakh</span>
                </div>
                <div className="w-full h-4 bg-[#f2efe9] rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-[#cbd5e1] rounded-full w-[45%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-[#fcfaf7] border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-1">
              <strong className="block font-bold">NAZAR Statistical Observation:</strong>
              <p className="text-[#475569]">
                Reported cost falls beyond the 90th percentile of typical civil work allocations for single-tier community structures in this administrative tier.
                A technical review is recommended to ascertain if equipment outfitting or multi-floor scope accounts for the differential.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Observations / Findings */}
      {activeTab === "findings" && (
        <div className="space-y-6">
          {/* AI Grounded Explanation Drawer/Card if requested */}
          {aiExplanation && (
            <div className="bg-gradient-to-br from-white to-[#faf8f4] rounded-2xl border-2 border-amber-300 p-6 shadow-soft space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  NAZAR AI Evidence Grounding
                </div>
                <span className="text-[11px] font-mono text-[#8b95a1]">
                  Model: Grounded Civic RAG
                </span>
              </div>
              <div className="text-sm text-[#334155] leading-relaxed whitespace-pre-line">
                {aiExplanation.answer}
              </div>
              <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between text-xs text-[#64748b]">
                <div>
                  <strong>Evidence Sources:</strong> {aiExplanation.sources.join(" · ")}
                </div>
                <Link
                  href="/investigations/INV-2025-0042"
                  className="font-bold text-amber-800 hover:underline"
                >
                  View Active Investigation Case →
                </Link>
              </div>
            </div>
          )}

          {project.findings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#e4e2da] p-8 space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-[#1c2024]">No Observations Flagged</h3>
              <p className="text-xs text-[#64748b]">
                This project satisfies standard lifecycle sequence checks, peer financial thresholds, and has no candidate duplicate works.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {project.findings.map((f) => (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl border border-[#e4e2da] p-6 shadow-card space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0eee8] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          f.severity === "high" || f.severity === "critical"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {f.severity} Severity
                      </span>
                      <span className="text-xs font-mono text-[#8b95a1]">
                        {f.reason_code}
                      </span>
                      <span className="text-xs text-[#8b95a1]">·</span>
                      <span className="text-xs text-[#64748b] capitalize">
                        Detector: {f.detector} (v{f.detector_version})
                      </span>
                    </div>

                    <div className="text-xs text-[#64748b] font-medium">
                      Confidence: <strong className="text-[#1c2024]">{f.confidence}%</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#1c2024]">{f.title}</h3>
                    <p className="text-xs text-[#334155] leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  {f.evidence && (
                    <div className="bg-[#faf9f6] rounded-xl p-4 border border-[#e8e6de] text-xs space-y-2">
                      <div className="font-bold text-[#475569] uppercase tracking-wider text-[10px]">
                        Underlying Evidence Record
                      </div>
                      <p className="text-[#334155]">{f.evidence.details}</p>

                      {f.evidence.similar_project_id && (
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              const peer = MOCK_PROJECTS.find(
                                (p) => p.id === f.evidence.similar_project_id
                              );
                              if (peer) setCompareProject(peer);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                            <span>Compare With Candidate: {f.evidence.similar_project_id}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Evidence & Related Works */}
      {activeTab === "evidence" && (
        <div className="bg-white rounded-2xl border border-[#e4e2da] p-8 shadow-card space-y-6">
          <h2 className="text-lg font-bold text-[#1c2024] font-serif">
            Related & Neighboring Projects
          </h2>
          <p className="text-xs text-[#64748b]">
            Projects within the same administrative block or displaying thematic overlap.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedProjects.map((rel) => (
              <div
                key={rel.id}
                className="bg-[#faf9f6] rounded-2xl border border-[#e2e0d8] p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#64748b]">
                    {rel.id}
                  </span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    88% Lexical Overlap
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#1c2024]">{rel.project_name}</h3>
                <div className="text-xs text-[#64748b]">
                  Sanctioned: {formatCurrency(rel.sanctioned_amount)} · Agency: {rel.implementing_agency}
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setCompareProject(rel)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline"
                  >
                    Side-by-Side Comparison <ArrowRight className="w-3 h-3" />
                  </button>
                  <Link
                    href={`/projects/${rel.id}`}
                    className="text-xs font-semibold text-[#475569] hover:underline"
                  >
                    View Project Page →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Public Source Lineage */}
      {activeTab === "sources" && (
        <div className="bg-white rounded-2xl border border-[#e4e2da] p-8 shadow-card space-y-6">
          <h2 className="text-lg font-bold text-[#1c2024] font-serif">
            Data Source Provenance
          </h2>
          <p className="text-xs text-[#64748b]">
            Every data point in NAZAR retains strict traceability to verified public registries.
          </p>

          <div className="space-y-4 text-xs">
            <div className="bg-[#faf9f6] p-4 rounded-xl border border-[#e5e3db] space-y-2">
              <div className="font-bold text-[#1c2024]">Primary Source Authority</div>
              <div className="text-[#64748b]">{project.source_system}</div>
              <div className="font-mono text-[11px] text-[#475569]">
                Source URL: {project.source_url}
              </div>
              <div className="font-mono text-[11px] text-[#475569]">
                Record Identifier: {project.source_record_id}
              </div>
              <div className="text-[11px] text-[#8b95a1]">
                Crawled & Stored: {formatDate(project.retrieved_at)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e5e3db] space-y-2">
              <div className="font-bold text-[#1c2024]">Cryptographic Lineage Hash</div>
              <div className="font-mono text-[11px] text-[#64748b] break-all bg-[#f5f4ee] p-2 rounded">
                sha256:4a8b79210eac93129841bb2f491c103984ab2109849201948ba281903e1982b1
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified Immutable Ingestion Hash
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {compareProject && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e4e2da] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#ecebe6] pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#1c2024]">
                  Candidate Duplicate Work Comparison
                </h3>
                <p className="text-xs text-[#64748b]">
                  Comparing Project A ({project.id}) with Project B ({compareProject.id})
                </p>
              </div>
              <button
                onClick={() => setCompareProject(null)}
                className="text-xs font-bold text-[#8b95a1] hover:text-[#1c2024] px-3 py-1 bg-[#f2efe9] rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs">
              {/* Left project */}
              <div className="space-y-3 bg-[#faf9f6] p-5 rounded-2xl border border-[#e2e0d8]">
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Project A: {project.id}
                </span>
                <h4 className="text-sm font-bold text-[#1c2024]">{project.project_name}</h4>
                <div>
                  <span className="text-[#8b95a1] block">Sanctioned</span>
                  <span className="font-bold text-sm text-[#1c2024]">
                    {formatCurrency(project.sanctioned_amount)}
                  </span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">Location</span>
                  <span className="font-medium text-[#334155]">{project.location}</span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">Agency</span>
                  <span className="font-medium text-[#334155]">{project.implementing_agency}</span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">Sanction Date</span>
                  <span className="font-medium text-[#334155]">{formatDate(project.sanction_date)}</span>
                </div>
              </div>

              {/* Right project */}
              <div className="space-y-3 bg-[#faf9f6] p-5 rounded-2xl border border-[#e2e0d8]">
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Project B: {compareProject.id}
                </span>
                <h4 className="text-sm font-bold text-[#1c2024]">{compareProject.project_name}</h4>
                <div>
                  <span className="text-[#8b95a1] block">Sanctioned</span>
                  <span className="font-bold text-sm text-[#1c2024]">
                    {formatCurrency(compareProject.sanctioned_amount)}
                  </span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">Location</span>
                  <span className="font-medium text-[#334155]">{compareProject.location}</span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">Agency</span>
                  <span className="font-medium text-[#334155]">{compareProject.implementing_agency}</span>
                </div>
                <div>
                  <span className="text-[#8b95a1] block">Sanction Date</span>
                  <span className="font-medium text-[#334155]">{formatDate(compareProject.sanction_date)}</span>
                </div>
              </div>
            </div>

            {/* Analysis Box */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
              <div className="font-bold uppercase text-[10px] tracking-wider text-amber-900">
                NAZAR Similarity Metric Breakdown
              </div>
              <div className="grid grid-cols-3 gap-4 font-semibold">
                <div>Lexical Similarity: <span className="text-amber-900 font-bold">88%</span></div>
                <div>Geographical Distance: <span className="text-amber-900 font-bold">1.1 km</span></div>
                <div>Sanction Interval: <span className="text-amber-900 font-bold">62 days</span></div>
              </div>
              <p className="text-xs text-[#555e68] pt-1">
                Both works provide multi-purpose skill and community rooms in Bandlaguda. Human reviewer should examine municipal parcel survey records to verify whether two separate physical structures exist.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href="/investigations/INV-2025-0042"
                className="px-4 py-2 text-xs font-bold text-white bg-[#1c2024] hover:bg-[#2e363e] rounded-xl transition-all"
              >
                Launch Investigation for this Pair →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Report an Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e4e2da] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#1c2024]">
                Report an Issue / Correction
              </h3>
              <p className="text-xs text-[#64748b]">
                Submit a citizen feedback or factual correction regarding {project.id}.
              </p>
            </div>

            {issueSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-[#1c2024]">Report Logged Successfully</h4>
                <p className="text-xs text-[#64748b]">
                  Tracking ID: <strong>NZR-ISSUE-{(Math.random() * 9000 + 1000).toFixed(0)}</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Issue Category
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-[#dedcd4] rounded-xl p-2.5 outline-none text-[#334155]"
                  >
                    <option>Incorrect project information</option>
                    <option>Location issue</option>
                    <option>Completion issue</option>
                    <option>Financial information</option>
                    <option>Possible duplicate</option>
                    <option>Documentation</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Description & Ground Evidence
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Provide specific details, photos, or official notices..."
                    className="w-full bg-[#faf9f6] border border-[#dedcd4] rounded-xl p-3 outline-none text-[#1c2024]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748b] hover:bg-[#f2efe9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1c2024] hover:bg-[#2e363e]"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
