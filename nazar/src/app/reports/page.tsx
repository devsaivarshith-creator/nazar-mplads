"use client";

import Link from "next/link";
import {
  FileText,
  Plus,
  Calendar,
  Sparkles,
  ChevronRight,
  Download,
  Building,
  ShieldAlert,
} from "lucide-react";
import { MOCK_PREPARED_REPORTS } from "@/lib/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ReportsIndexPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ecebe6] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1c2024] font-serif">
              Intelligence Reports
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
              AI-Assisted & Grounded
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-1">
            Synthesized civic reviews combining structured MPLADS data, deterministic anomaly detectors, and source citations.
          </p>
        </div>

        <Link
          href="/reports/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c2024] text-white font-bold text-xs hover:bg-[#2e363e] shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Report</span>
        </Link>
      </div>

      {/* Reports Grid */}
      <div className="space-y-4">
        {MOCK_PREPARED_REPORTS.map((report) => (
          <Link
            key={report.id}
            href={`/reports/${report.id}`}
            className="group block bg-white rounded-2xl border border-[#e4e2da] hover:border-amber-300 p-6 shadow-card hover:shadow-soft transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {report.scope_type}: {report.scope_name}
                  </span>
                  <span className="text-xs text-[#8b95a1]">·</span>
                  <span className="text-xs text-[#64748b] font-medium">
                    Period: {report.period}
                  </span>
                  <span className="text-xs text-[#8b95a1]">·</span>
                  <span className="text-xs text-[#8b95a1]">
                    Published: {formatDate(report.created_at)}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[#1c2024] group-hover:text-amber-800 transition-colors">
                  {report.title}
                </h2>

                <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                  {report.executive_summary}
                </p>

                {/* Topics covered */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-[#faf9f5] border border-[#e5e3db] px-2.5 py-0.5 rounded-full text-[#64748b] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex flex-row lg:flex-col lg:items-end justify-between items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#f0eee8] shrink-0">
                <div className="text-left lg:text-right">
                  <div className="text-xs text-[#8b95a1]">Scope Coverage</div>
                  <div className="text-sm font-bold text-[#1c2024]">
                    {report.project_count} Projects
                  </div>
                  <div className="text-[11px] text-amber-800 font-semibold">
                    {report.flagged_count} Flagged Items
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-800 group-hover:underline">
                    Read & Edit Report →
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8b95a1] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
