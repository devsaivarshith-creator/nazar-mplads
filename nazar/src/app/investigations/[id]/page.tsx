"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldAlert,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  FileCheck,
  Send,
  GitCompare,
  ArrowRight,
} from "lucide-react";
import { MOCK_INVESTIGATIONS, MOCK_PROJECTS } from "@/lib/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvestigationAction } from "@/types";

export default function InvestigationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const investigationId = resolvedParams.id;

  const initialInv =
    MOCK_INVESTIGATIONS.find((i) => i.id === investigationId) ||
    MOCK_INVESTIGATIONS[0];

  const [investigation, setInvestigation] = useState(initialInv);
  const [actions, setActions] = useState<InvestigationAction[]>(initialInv.actions);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const primaryProject = MOCK_PROJECTS.find(
    (p) => p.id === investigation.primary_project_id
  );
  const relatedProject = MOCK_PROJECTS.find(
    (p) => p.id === investigation.related_project_ids[0]
  );

  const handleExecuteAction = (actionType: string) => {
    if (!actionReason.trim()) return;

    const actionLabels: Record<string, string> = {
      explain_exception: "Explained Exception",
      mark_data_error: "Marked as Data / Clerical Error",
      mark_duplicate: "Confirmed Potential Duplicate",
      request_information: "Requested District Clarification",
      assign_inspection: "Assigned Physical Site Inspection",
      escalate: "Escalated to Vigilance Officer",
      close_investigation: "Closed Case",
    };

    const newAction: InvestigationAction = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      action_type: actionType as any,
      user_name: "Arjun Singh",
      user_role: "Senior Civic Analyst",
      previous_state: investigation.status,
      new_state:
        actionType === "close_investigation"
          ? "resolved"
          : actionType === "explain_exception"
          ? "explained"
          : actionType === "mark_data_error"
          ? "data_error"
          : "under_review",
      reason: actionReason,
      timestamp: new Date().toISOString(),
    };

    setActions([newAction, ...actions]);
    setInvestigation((prev) => ({
      ...prev,
      status: newAction.new_state as any,
      updated_at: new Date().toISOString(),
    }));

    setStatusMessage(`Action logged successfully: ${actionLabels[actionType]}`);
    setActionReason("");
    setSelectedAction(null);

    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Back Link */}
      <Link
        href="/investigations"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#1c2024] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Investigation Review Desk</span>
      </Link>

      {/* Case Header Card */}
      <div className="bg-white rounded-3xl border border-[#e4e2da] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                {investigation.case_number}
              </span>
              <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                {investigation.priority} Priority
              </span>
              <span className="text-xs text-[#8b95a1]">·</span>
              <span className="text-xs font-semibold text-[#475569]">
                Reviewer: <strong>{investigation.assigned_reviewer}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c2024]">
              {investigation.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {investigation.summary}
            </p>
          </div>

          <div className="bg-[#faf9f5] border border-[#e8e5dc] rounded-2xl p-5 min-w-[220px] space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#8b95a1] tracking-wider block">
              Case Status
            </span>
            <span className="text-base font-bold capitalize text-[#1c2024] block">
              {investigation.status.replace("_", " ")}
            </span>
            <span className="text-[11px] text-[#64748b] block">
              Last updated: {formatDate(investigation.updated_at)}
            </span>
          </div>
        </div>

        {/* Prioritization Highlight */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-1">
          <strong className="block font-bold uppercase tracking-wide text-[10px] text-amber-900">
            Why this case was prioritised for human review
          </strong>
          <p className="text-[#334155] leading-relaxed">
            {investigation.reason_prioritized}
          </p>
        </div>

        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {statusMessage}
          </div>
        )}
      </div>

      {/* Linked Projects Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Project */}
        {primaryProject && (
          <div className="bg-white rounded-2xl border border-[#e4e2da] p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#ecebe6] pb-3">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Primary Flagged Work: {primaryProject.id}
              </span>
              <Link
                href={`/projects/${primaryProject.id}`}
                className="text-xs font-bold text-amber-800 hover:underline inline-flex items-center gap-1"
              >
                Inspect Project <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <h3 className="text-sm font-bold text-[#1c2024]">
              {primaryProject.project_name}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#8b95a1] block">Sanctioned Cost</span>
                <span className="font-bold text-[#1c2024]">
                  {formatCurrency(primaryProject.sanctioned_amount)}
                </span>
              </div>
              <div>
                <span className="text-[#8b95a1] block">Recorded Status</span>
                <span className="font-semibold text-emerald-700">{primaryProject.status}</span>
              </div>
              <div>
                <span className="text-[#8b95a1] block">Commencement</span>
                <span className="font-mono font-medium text-[#334155]">{formatDate(primaryProject.start_date)}</span>
              </div>
              <div>
                <span className="text-[#8b95a1] block">Completion Stamp</span>
                <span className="font-mono font-bold text-rose-700">{formatDate(primaryProject.completion_date)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#f0eee8]">
              <span className="text-[10px] font-bold uppercase text-[#8b95a1] tracking-wider">
                Correlated NAZAR Observations
              </span>
              {primaryProject.findings.map((f) => (
                <div key={f.id} className="p-3 rounded-xl bg-[#faf9f5] border border-[#e8e5dc] text-xs space-y-1">
                  <div className="font-bold text-[#1c2024]">{f.title}</div>
                  <div className="text-[#64748b] text-[11px]">{f.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Duplicate Candidate */}
        {relatedProject && (
          <div className="bg-white rounded-2xl border border-[#e4e2da] p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#ecebe6] pb-3">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Correlated Candidate: {relatedProject.id}
              </span>
              <Link
                href={`/projects/${relatedProject.id}`}
                className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
              >
                Inspect Project <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <h3 className="text-sm font-bold text-[#1c2024]">
              {relatedProject.project_name}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#8b95a1] block">Sanctioned Cost</span>
                <span className="font-bold text-[#1c2024]">
                  {formatCurrency(relatedProject.sanctioned_amount)}
                </span>
              </div>
              <div>
                <span className="text-[#8b95a1] block">Recorded Status</span>
                <span className="font-semibold text-blue-700">{relatedProject.status}</span>
              </div>
              <div>
                <span className="text-[#8b95a1] block">Commencement</span>
                <span className="font-mono font-medium text-[#334155]">{formatDate(relatedProject.start_date)}</span>
              </div>
              <div>
                <span className="text-[#8b95a1] block">Agency</span>
                <span className="font-medium text-[#334155]">{relatedProject.implementing_agency}</span>
              </div>
            </div>

            <div className="bg-[#faf9f5] border border-[#e8e5dc] rounded-xl p-4 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#8b95a1] tracking-wider">
                Cross-Project Overlap Signal
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <div>Distance: <strong>1.1 km</strong></div>
                <div>Lexical Overlap: <strong>88%</strong></div>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Both assets serve the Bandlaguda municipal zone. Investigation seeks to ensure separate land survey parcels were allocated.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reviewer Action Workflow Panel */}
      <div className="bg-white rounded-3xl border border-[#e4e2da] p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#1c2024] font-serif">
            Reviewer Decision & Actions
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Log an official review determination. All decisions create an immutable cryptographic audit record.
          </p>
        </div>

        {/* Action Button Grid */}
        <div className="flex flex-wrap gap-2.5">
          {[
            { id: "explain_exception", label: "Explain Exception", color: "hover:bg-blue-50 hover:text-blue-900 border-blue-200" },
            { id: "mark_data_error", label: "Mark Clerical / Data Error", color: "hover:bg-amber-50 hover:text-amber-900 border-amber-200" },
            { id: "mark_duplicate", label: "Mark Duplicate Candidate", color: "hover:bg-purple-50 hover:text-purple-900 border-purple-200" },
            { id: "request_information", label: "Request District Info", color: "hover:bg-teal-50 hover:text-teal-900 border-teal-200" },
            { id: "assign_inspection", label: "Assign Site Inspection", color: "hover:bg-emerald-50 hover:text-emerald-900 border-emerald-200" },
            { id: "escalate", label: "Escalate to Vigilance", color: "hover:bg-rose-50 hover:text-rose-900 border-rose-200" },
            { id: "close_investigation", label: "Close Case", color: "hover:bg-gray-100 hover:text-gray-900 border-gray-300" },
          ].map((act) => (
            <button
              key={act.id}
              onClick={() => setSelectedAction(act.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedAction === act.id
                  ? "bg-[#1c2024] text-white border-[#1c2024] shadow-xs"
                  : `bg-[#faf9f6] text-[#475569] ${act.color}`
              }`}
            >
              {act.label}
            </button>
          ))}
        </div>

        {/* Action Input Form */}
        {selectedAction && (
          <div className="bg-[#faf9f6] rounded-2xl border border-[#dedcd4] p-5 space-y-4 animate-in fade-in duration-200">
            <div className="text-xs font-bold text-[#1c2024] uppercase tracking-wider">
              Reason & Substantiating Notes for Action: {selectedAction.replace("_", " ")}
            </div>
            <textarea
              rows={3}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="State the rationale, reference numbers, or verified documentation..."
              className="w-full bg-white border border-[#dedcd4] rounded-xl p-3 text-xs outline-none text-[#1c2024] focus:border-amber-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedAction(null);
                  setActionReason("");
                }}
                className="px-4 py-1.5 text-xs text-[#64748b] hover:bg-[#eae8e1] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecuteAction(selectedAction)}
                disabled={!actionReason.trim()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#1c2024] hover:bg-[#2e363e] rounded-lg disabled:opacity-40"
              >
                Commit Audit Action
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Immutable Audit Trail Log */}
      <div className="bg-white rounded-3xl border border-[#e4e2da] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-[#ecebe6] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1c2024] font-serif">
              Investigation Audit Log
            </h2>
            <p className="text-xs text-[#64748b]">
              Immutable chronological trail of reviewer actions and administrative determinations.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {actions.length} Logged Action(s)
          </span>
        </div>

        <div className="space-y-4">
          {actions.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-[#faf9f6] border border-[#e5e3db] flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1c2024]">{act.user_name}</span>
                  <span className="text-[#8b95a1]">({act.user_role})</span>
                  <span className="text-[#8b95a1]">·</span>
                  <span className="font-semibold text-amber-800 uppercase text-[10px]">
                    {act.action_type.replace("_", " ")}
                  </span>
                </div>
                <p className="text-[#334155] leading-relaxed">{act.reason}</p>
              </div>

              <div className="text-right shrink-0 text-[#8b95a1] text-[11px] font-mono">
                {formatDate(act.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
