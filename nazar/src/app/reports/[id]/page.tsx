"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Printer,
  Sparkles,
  Edit3,
  Check,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Info,
  Calendar,
  Building,
} from "lucide-react";
import { MOCK_PREPARED_REPORTS, generateDynamicReport } from "@/lib/data/mockData";
import { formatDate } from "@/lib/utils";
import { GeneratedReport, ReportSection } from "@/types";

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const reportId = resolvedParams.id;

  const initialReport =
    MOCK_PREPARED_REPORTS.find((r) => r.id.toLowerCase() === reportId.toLowerCase()) ||
    generateDynamicReport(reportId);

  const [report, setReport] = useState<GeneratedReport>(initialReport);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [aiWorkingSectionId, setAiWorkingSectionId] = useState<string | null>(null);

  const handleStartEdit = (section: ReportSection) => {
    setEditingSectionId(section.id);
    setEditedContent(section.content);
  };

  const handleSaveEdit = (sectionId: string) => {
    setReport((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, content: editedContent } : s
      ),
    }));
    setEditingSectionId(null);
  };

  const handleAISummarize = (sectionId: string) => {
    setAiWorkingSectionId(sectionId);
    setTimeout(() => {
      setReport((prev) => ({
        ...prev,
        sections: prev.sections.map((s) => {
          if (s.id === sectionId) {
            return {
              ...s,
              content: `[AI Summary]: ${s.content.slice(0, 180)}... Key focus lies on immediate site verification and reconciliation of administrative timestamps.`,
            };
          }
          return s;
        }),
      }));
      setAiWorkingSectionId(null);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8 print:p-0 print:max-w-none">
      {/* Top Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#1c2024]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#dedcd4] bg-white text-xs font-semibold text-[#475569] hover:bg-[#faf9f6] shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c2024] text-white text-xs font-bold hover:bg-[#2e363e] shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Document Container */}
      <article className="bg-white rounded-3xl border border-[#e4e2da] p-8 sm:p-12 shadow-card space-y-8 print:border-none print:shadow-none print:p-4">
        {/* Document Header */}
        <div className="border-b border-[#ecebe6] pb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-[#1c2024]">NAZAR</span>
              <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Civic Review Dossier
              </span>
            </div>
            <span className="text-xs text-[#8b95a1] font-mono">
              Ref: {report.id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#1c2024] leading-tight">
            {report.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#64748b] pt-2">
            <span>
              <strong>Scope:</strong> {report.scope_type} ({report.scope_name})
            </span>
            <span>·</span>
            <span>
              <strong>Period:</strong> {report.period}
            </span>
            <span>·</span>
            <span>
              <strong>Compiled:</strong> {formatDate(report.created_at)}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-3 py-1 rounded-md inline-block">
            Executive Summary
          </h2>
          <p className="text-sm text-[#334155] leading-relaxed">
            {report.executive_summary}
          </p>
        </section>

        {/* Dynamic Report Sections */}
        {report.sections.map((section) => {
          const isEditing = editingSectionId === section.id;
          const isWorking = aiWorkingSectionId === section.id;

          return (
            <section
              key={section.id}
              className="space-y-4 pt-6 border-t border-[#f0eee8] group"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#1c2024]">
                  {section.title}
                </h2>

                {/* Section Edit & AI Actions (Hidden in Print) */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => handleAISummarize(section.id)}
                        disabled={isWorking}
                        title="AI Summarize section"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{isWorking ? "Working..." : "AI Summarize"}</span>
                      </button>

                      <button
                        onClick={() => handleStartEdit(section)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748b] hover:text-[#1c2024] bg-[#faf9f6] border border-[#dedcd4] px-2.5 py-1 rounded-lg"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Text</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Section Content */}
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    rows={6}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-3 text-xs bg-[#faf9f6] border border-[#dedcd4] rounded-xl outline-none font-sans leading-relaxed text-[#1c2024] focus:border-amber-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingSectionId(null)}
                      className="px-3 py-1 rounded-lg text-xs text-[#64748b] hover:bg-[#f0eee8]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(section.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#1c2024]"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              )}

              {/* Embedded Metrics if available */}
              {section.metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {section.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#faf9f6] border border-[#e5e3db] text-center"
                    >
                      <div className="text-[10px] uppercase font-bold text-[#8b95a1]">
                        {m.label}
                      </div>
                      <div className="text-base font-bold text-[#1c2024] mt-0.5">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Embedded Data Table if available */}
              {section.data_table && (
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs border border-[#e5e3db] rounded-xl overflow-hidden">
                    <thead className="bg-[#f5f4ee] text-[#475569] font-bold border-b border-[#e5e3db]">
                      <tr>
                        {section.data_table.headers.map((h, i) => (
                          <th key={i} className="p-2.5">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ecebe6]">
                      {section.data_table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#faf9f6]">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5 text-[#334155]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Section Sources */}
              {section.sources && section.sources.length > 0 && (
                <div className="text-[11px] text-[#8b95a1] pt-1">
                  <em>Sources:</em> {section.sources.join(" · ")}
                </div>
              )}
            </section>
          );
        })}

        {/* Data Limitations & Boundaries */}
        <section className="pt-6 border-t border-[#ecebe6] space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#8b95a1]" />
            Methodological Limitations & Caveats
          </h2>
          <ul className="text-xs text-[#64748b] space-y-1 list-disc pl-5">
            {report.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </section>

        {/* Provenance Footnote */}
        <footer className="pt-6 border-t border-[#ecebe6] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8b95a1] gap-2">
          <span>NAZAR Independent Civic Prototype · Not an official Gov of India website</span>
          <span>Source: eSAKSHI Gazette Disclosures (MoSPI)</span>
        </footer>
      </article>
    </div>
  );
}
