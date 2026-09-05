"use client";

import Link from "next/link";
import {
  ShieldAlert,
  Clock,
  User,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { MOCK_INVESTIGATIONS, MOCK_PROJECTS } from "@/lib/data/mockData";
import { formatDate } from "@/lib/utils";

export default function InvestigationsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ecebe6] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1c2024] font-serif">
              Investigation Review Desk
            </h1>
            <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">
              {MOCK_INVESTIGATIONS.length} Active Cases
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-1">
            Human-in-the-loop review cases escalated from multi-detector NAZAR signals.
          </p>
        </div>

        <div className="text-xs text-[#8b95a1] bg-[#faf9f6] border border-[#e2e0d8] px-3.5 py-2 rounded-xl">
          <strong>Reviewer Principle:</strong> NAZAR triage signals recommend human review; they never accuse or declare guilt.
        </div>
      </div>

      {/* Investigations List */}
      <div className="space-y-4">
        {MOCK_INVESTIGATIONS.map((inv) => {
          const primary = MOCK_PROJECTS.find((p) => p.id === inv.primary_project_id);

          return (
            <Link
              key={inv.id}
              href={`/investigations/${inv.id}`}
              className="group block bg-white rounded-2xl border border-[#e4e2da] hover:border-amber-300 p-6 shadow-card hover:shadow-soft transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                      {inv.case_number}
                    </span>
                    <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      {inv.priority} Priority
                    </span>
                    <span className="text-xs text-[#8b95a1]">·</span>
                    <span className="text-xs text-[#475569] font-medium">
                      Status: <strong className="capitalize">{inv.status.replace("_", " ")}</strong>
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-[#1c2024] group-hover:text-amber-800 transition-colors">
                    {inv.title}
                  </h2>

                  <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
                    {inv.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748b] pt-1">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#8b95a1]" />
                      <strong>Assigned:</strong> {inv.assigned_reviewer}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8b95a1]" />
                      <strong>Opened:</strong> {formatDate(inv.created_at)}
                    </span>
                    <span>
                      <strong>Primary Work:</strong> {inv.primary_project_id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#f0eee8]">
                  <span className="text-xs font-bold text-amber-800 group-hover:underline">
                    Inspect Evidence Dossier →
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8b95a1] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Triangulation Highlight */}
              <div className="mt-4 pt-3 border-t border-[#f2f0eb] flex items-center justify-between text-xs text-[#64748b]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <strong className="text-[#334155]">Prioritization Basis:</strong>
                  <span className="text-[#64748b] truncate">{inv.reason_prioritized}</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {inv.actions.length} Audit Action(s)
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
