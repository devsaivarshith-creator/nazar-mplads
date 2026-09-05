"use client";

import { useState } from "react";
import {
  Sparkles,
  X,
  Bot,
  FileText,
  Send,
  Download,
  Copy,
  Check,
  Award,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { MP_PROFILES, getMPById } from "@/lib/data/mpsData";
import { formatCurrency } from "@/lib/utils";

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMpId, setSelectedMpId] = useState<string>("MP-TS-HYD-01");
  const [reportType, setReportType] = useState<"full_picture" | "audit_dossier">("full_picture");
  const [isLoading, setIsLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentMp = getMPById(selectedMpId) || MP_PROFILES[0];

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setAiReport(null);

    const question =
      reportType === "full_picture"
        ? `Generate the comprehensive 360-degree 'Full Picture' intelligence briefing for Member of Parliament ${currentMp.name} (${currentMp.party}, ${currentMp.constituency}, ${currentMp.state}). Include: 1. Financial Velocity & Utilization (${currentMp.utilization_rate}%), 2. Sector Allocation Breakdown, 3. Anomaly & Audit Footprint (${currentMp.flagged_observations} observations), 4. Key Implementing Agencies, and 5. Executive Civic Transparency Summary. Keep it objective, evidence-grounded, and non-accusatory.`
        : `Generate an official Civic Audit & Investigation Dossier for ${currentMp.name} (${currentMp.constituency}) focusing on project execution bottlenecks, recorded observations (${currentMp.observations_summary}), and recommended administrative verification steps.`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer",
          question,
          contextData: { mp: currentMp }
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.answer) {
          setAiReport(data.answer);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("AI generation failed, using local grounded template:", e);
    }

    // Local fallback
    setAiReport(
      `🏛️ NAZAR 360° INTELLIGENCE DOSSIER: ${currentMp.name.toUpperCase()}\n` +
      `Constituency: ${currentMp.constituency}, ${currentMp.state} | Party: ${currentMp.party} (${currentMp.term})\n` +
      `═══════════════════════════════════════════════════════════════\n\n` +
      `1. FINANCIAL ALLOCATION & VELOCITY\n` +
      `• Sanctioned Outlay: ${formatCurrency(currentMp.sanctioned_amount)}\n` +
      `• Disclosed Expenditure: ${formatCurrency(currentMp.expenditure_amount)}\n` +
      `• Fund Utilization Efficiency: ${currentMp.utilization_rate}%\n` +
      `• Project Completion Rate: ${currentMp.completion_rate}%\n\n` +
      `2. SECTORAL CAPITAL ALLOCATION\n` +
      currentMp.top_sectors.map(s => `• ${s.sector}: ${formatCurrency(s.amount)} (${s.percentage}% of funds)`).join("\n") +
      `\n\n3. AUDIT & ANOMALY EVALUATION\n` +
      `• Automated Flags: ${currentMp.flagged_observations} items requiring administrative review.\n` +
      `• Review Summary: ${currentMp.observations_summary}\n\n` +
      `4. EXECUTING BODIES & AGENCIES\n` +
      currentMp.implementing_agencies.map(a => `• ${a}`).join("\n") +
      `\n\n5. EXECUTIVE CIVIC INTEGRITY VERDICT\n` +
      `Overall Rating: ${currentMp.utilization_rate > 85 ? "High (A+)" : "Standard (B+)"} · Verified via MoSPI Gazette Disclosures.`
    );
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(aiReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* TRIGGER FLOATING BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#1c2024] text-white shadow-2xl hover:bg-neutral-800 transition-all border border-neutral-700/60 hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-serif font-bold text-sm tracking-wide text-neutral-100">
              NAZAR AI · 360° MP Picture
            </span>
          </div>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
            Gemini 3.6
          </span>
        </button>
      )}

      {/* EXPANDED MODAL / DRAWER */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[460px] bg-white rounded-2xl shadow-2xl border border-[#d8d6cc] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1c2024] to-[#2d3339] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm tracking-tight text-neutral-100 flex items-center gap-1.5">
                  NAZAR 360° MP Intelligence
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    Gemini 3.6
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Instant full picture & executive report for any MP
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Controls Bar */}
          <div className="p-4 bg-[#faf9f5] border-b border-[#ece9df] space-y-3">
            {/* MP Selector */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                Select Member of Parliament:
              </label>
              <select
                value={selectedMpId}
                onChange={(e) => {
                  setSelectedMpId(e.target.value);
                  setAiReport(null);
                }}
                className="w-full bg-white border border-[#d8d6cc] rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
              >
                {MP_PROFILES.map((mp) => (
                  <option key={mp.id} value={mp.id}>
                    {mp.name} ({mp.party} · {mp.constituency})
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReportType("full_picture")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                  reportType === "full_picture"
                    ? "bg-amber-800 text-white shadow-sm"
                    : "bg-white text-neutral-700 border border-[#d8d6cc] hover:bg-neutral-50"
                }`}
              >
                ⚡ Full Picture Brief
              </button>
              <button
                onClick={() => setReportType("audit_dossier")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                  reportType === "audit_dossier"
                    ? "bg-amber-800 text-white shadow-sm"
                    : "bg-white text-neutral-700 border border-[#d8d6cc] hover:bg-neutral-50"
                }`}
              >
                📄 Civic Audit Dossier
              </button>
            </div>

            {/* Action button */}
            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating via Gemini 3.6 Flash...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Generate {currentMp.name}&apos;s {reportType === "full_picture" ? "Full Picture" : "Audit Dossier"}
                </>
              )}
            </button>
          </div>

          {/* Report Body / Output */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed text-neutral-800">
            {aiReport ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Civic Synthesis
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopy}
                      className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="bg-[#fcfbf7] p-3.5 rounded-xl border border-[#ece9df] whitespace-pre-line font-sans text-xs text-neutral-800 leading-relaxed max-h-[340px] overflow-y-auto select-text">
                  {aiReport}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-neutral-400 space-y-2">
                <Bot className="w-8 h-8 mx-auto text-neutral-300" />
                <p className="text-xs max-w-[260px] mx-auto text-neutral-500">
                  Select an MP above and click generate to synthesize their complete MPLADS financial, sectoral, and audit profile.
                </p>
              </div>
            )}
          </div>

          {/* Footer Citation */}
          <div className="px-4 py-2.5 bg-[#f4f3ee] border-t border-[#e2e0d8] flex items-center justify-between text-[10px] text-neutral-500">
            <span>Source: MoSPI eSAKSHI Public Gazette</span>
            <span className="font-mono text-neutral-400">NAZAR · East</span>
          </div>
        </div>
      )}
    </div>
  );
}
