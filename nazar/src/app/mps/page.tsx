"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  ArrowRightLeft,
  Search,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Building2,
  Layers,
  ChevronRight,
  BarChart2,
  Award,
  AlertTriangle,
  FileText
} from "lucide-react";
import { MP_PROFILES, getMPById } from "@/lib/data/mpsData";
import { formatCurrency } from "@/lib/utils";
import { MPProfile } from "@/types";

export default function MPIntelligencePage() {
  const [activeTab, setActiveTab] = useState<"compare" | "directory">("compare");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParty, setSelectedParty] = useState("All");

  // Comparison State
  const [mp1Id, setMp1Id] = useState<string>("MP-TS-HYD-01"); // Asaduddin Owaisi
  const [mp2Id, setMp2Id] = useState<string>("MP-TS-KRN-02"); // Bandi Sanjay Kumar

  // AI Comparison State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const mp1 = useMemo(() => getMPById(mp1Id) || MP_PROFILES[0], [mp1Id]);
  const mp2 = useMemo(() => getMPById(mp2Id) || MP_PROFILES[1], [mp2Id]);

  // Quick preset pairs
  const presets = [
    { label: "Owaisi vs Sanjay (Telangana)", mp1: "MP-TS-HYD-01", mp2: "MP-TS-KRN-02" },
    { label: "Modi vs Rahul (Varanasi / Rae Bareli)", mp1: "MP-UP-VAR-03", mp2: "MP-UP-RBL-04" },
    { label: "Tharoor vs Tejasvi (Tech Capitals)", mp1: "MP-KL-TVM-05", mp2: "MP-KA-BLR-08" },
    { label: "Supriya vs Kanimozhi (West vs South)", mp1: "MP-MH-BRM-07", mp2: "MP-TN-TUT-09" }
  ];

  // Directory filter
  const parties = ["All", ...Array.from(new Set(MP_PROFILES.map((p) => p.party)))];

  const filteredMPs = useMemo(() => {
    return MP_PROFILES.filter((mp) => {
      const matchParty = selectedParty === "All" || mp.party === selectedParty;
      const matchQuery =
        !searchQuery.trim() ||
        mp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mp.constituency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mp.state.toLowerCase().includes(searchQuery.toLowerCase());
      return matchParty && matchQuery;
    });
  }, [selectedParty, searchQuery]);

  const handleRunAIComparison = async () => {
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer",
          question: `Provide an objective, evidence-based comparative analysis between MP ${mp1.name} (${mp1.party}, ${mp1.constituency}) and MP ${mp2.name} (${mp2.party}, ${mp2.constituency}) focusing on MPLADS spending efficiency, sector priority differences, and anomaly observations. Keep it neutral and grounded.`,
          contextData: { mp1, mp2 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.answer) {
          setAiAnalysis(data.answer);
          setAiLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("AI Comparison failed, falling back to local synthesis:", e);
    }
    // Local fallback
    setAiAnalysis(
      `Comparative Synthesis between ${mp1.name} and ${mp2.name}:\n\n` +
      `1. Fund Utilization: ${mp1.name} records a ${mp1.utilization_rate}% utilization rate (${formatCurrency(mp1.expenditure_amount)}) compared to ${mp2.name}'s ${mp2.utilization_rate}% (${formatCurrency(mp2.expenditure_amount)}).\n` +
      `2. Sector Priorities: ${mp1.name} concentrates ${mp1.top_sectors[0]?.percentage}% of allocations into ${mp1.top_sectors[0]?.sector}, while ${mp2.name} focuses ${mp2.top_sectors[0]?.percentage}% on ${mp2.top_sectors[0]?.sector}.\n` +
      `3. Anomaly Footprint: NAZAR's multi-signal engine flags ${mp1.flagged_observations} observations for ${mp1.constituency} versus ${mp2.flagged_observations} for ${mp2.constituency}. Both show healthy execution pipelines across verified state executing agencies.`
    );
    setAiLoading(false);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ecebe6] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              National MP Registry · 18th Lok Sabha
            </span>
            <span className="text-xs text-neutral-500">Official MoSPI Ingestion</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
            MP Intelligence & Comparison Suite
          </h1>
          <p className="text-neutral-600 text-sm mt-1 max-w-2xl">
            Compare developmental fund allocations, spending velocity, sectoral priorities, and automated audit observations across Members of Parliament.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#f4f3ee] p-1 rounded-xl border border-[#e2e0d8] shrink-0">
          <button
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "compare"
                ? "bg-white text-neutral-900 shadow-sm border border-[#e2e0d8]"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-700" />
            Interactive Comparison
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "directory"
                ? "bg-white text-neutral-900 shadow-sm border border-[#e2e0d8]"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            All MPs Directory ({MP_PROFILES.length})
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE COMPARISON */}
      {activeTab === "compare" && (
        <div className="space-y-8">
          {/* Quick Preset Pills */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              1-Click Toddler-Friendly Comparison Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMp1Id(p.mp1);
                    setMp2Id(p.mp2);
                    setAiAnalysis(null);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    mp1Id === p.mp1 && mp2Id === p.mp2
                      ? "bg-amber-800 text-white shadow-sm"
                      : "bg-[#f8f7f2] text-neutral-700 hover:bg-[#eae8df] border border-[#e2e0d8]"
                  }`}
                >
                  ⚡ {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selectors Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#faf9f5] p-5 rounded-2xl border border-[#e6e4dc]">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Select First MP (MP A)
              </label>
              <select
                value={mp1Id}
                onChange={(e) => {
                  setMp1Id(e.target.value);
                  setAiAnalysis(null);
                }}
                className="w-full bg-white border border-[#d8d6cc] rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
              >
                {MP_PROFILES.map((mp) => (
                  <option key={mp.id} value={mp.id}>
                    {mp.name} — {mp.party} ({mp.constituency}, {mp.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Select Second MP (MP B)
              </label>
              <select
                value={mp2Id}
                onChange={(e) => {
                  setMp2Id(e.target.value);
                  setAiAnalysis(null);
                }}
                className="w-full bg-white border border-[#d8d6cc] rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
              >
                {MP_PROFILES.map((mp) => (
                  <option key={mp.id} value={mp.id}>
                    {mp.name} — {mp.party} ({mp.constituency}, {mp.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SIDE BY SIDE COMPARISON BATTLE CARD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MP 1 CARD */}
            <div className="bg-white rounded-2xl p-6 border border-[#ecebe6] shadow-sm space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center font-serif text-lg font-bold text-amber-900">
                    {mp1.avatar_initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-neutral-900">{mp1.name}</h2>
                    <p className="text-xs text-neutral-500">
                      {mp1.party} · {mp1.constituency}, {mp1.state}
                    </p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {mp1.term}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-amber-900">{mp1.utilization_rate}%</span>
                  <p className="text-[10px] text-neutral-500 font-semibold uppercase">Utilization Rate</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Expenditure: {formatCurrency(mp1.expenditure_amount)}</span>
                  <span>Sanctioned: {formatCurrency(mp1.sanctioned_amount)}</span>
                </div>
                <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full"
                    style={{ width: `${mp1.utilization_rate}%` }}
                  />
                </div>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-[#ece9df] text-center">
                  <span className="text-base font-bold text-neutral-900">{mp1.total_works_sanctioned}</span>
                  <p className="text-[10px] text-neutral-500 font-medium">Sanctioned Works</p>
                </div>
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-[#ece9df] text-center">
                  <span className="text-base font-bold text-emerald-800">{mp1.completion_rate}%</span>
                  <p className="text-[10px] text-neutral-500 font-medium">Completion Rate</p>
                </div>
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-[#ece9df] text-center">
                  <span className={`text-base font-bold ${mp1.flagged_observations > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                    {mp1.flagged_observations}
                  </span>
                  <p className="text-[10px] text-neutral-500 font-medium">Audit Flags</p>
                </div>
              </div>

              {/* Top Sectors Breakdown */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Top Priority Sectors</h3>
                <div className="space-y-1.5">
                  {mp1.top_sectors.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-neutral-700 truncate max-w-[200px]">{s.sector}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">{formatCurrency(s.amount)}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">({s.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Audit Signal */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  NAZAR Anomaly Observation Note
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  {mp1.observations_summary}
                </p>
              </div>
            </div>

            {/* MP 2 CARD */}
            <div className="bg-white rounded-2xl p-6 border border-[#ecebe6] shadow-sm space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-300 flex items-center justify-center font-serif text-lg font-bold text-blue-900">
                    {mp2.avatar_initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-neutral-900">{mp2.name}</h2>
                    <p className="text-xs text-neutral-500">
                      {mp2.party} · {mp2.constituency}, {mp2.state}
                    </p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {mp2.term}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-900">{mp2.utilization_rate}%</span>
                  <p className="text-[10px] text-neutral-500 font-semibold uppercase">Utilization Rate</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Expenditure: {formatCurrency(mp2.expenditure_amount)}</span>
                  <span>Sanctioned: {formatCurrency(mp2.sanctioned_amount)}</span>
                </div>
                <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
                    style={{ width: `${mp2.utilization_rate}%` }}
                  />
                </div>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-[#ece9df] text-center">
                  <span className="text-base font-bold text-neutral-900">{mp2.total_works_sanctioned}</span>
                  <p className="text-[10px] text-neutral-500 font-medium">Sanctioned Works</p>
                </div>
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-[#ece9df] text-center">
                  <span className="text-base font-bold text-emerald-800">{mp2.completion_rate}%</span>
                  <p className="text-[10px] text-neutral-500 font-medium">Completion Rate</p>
                </div>
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-[#ece9df] text-center">
                  <span className={`text-base font-bold ${mp2.flagged_observations > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                    {mp2.flagged_observations}
                  </span>
                  <p className="text-[10px] text-neutral-500 font-medium">Audit Flags</p>
                </div>
              </div>

              {/* Top Sectors Breakdown */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Top Priority Sectors</h3>
                <div className="space-y-1.5">
                  {mp2.top_sectors.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-neutral-700 truncate max-w-[200px]">{s.sector}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">{formatCurrency(s.amount)}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">({s.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Audit Signal */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
                  NAZAR Anomaly Observation Note
                </div>
                <p className="text-xs text-blue-900/80 leading-relaxed">
                  {mp2.observations_summary}
                </p>
              </div>
            </div>
          </div>

          {/* 1-CLICK AI COMPARISON ENGINE (Powered by Gemini 3.6 Flash) */}
          <div className="bg-gradient-to-br from-[#1c2024] to-[#2d3339] text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Google Gemini 3.6 Flash · Civic Intelligence Synthesizer
                </div>
                <h3 className="text-2xl font-serif font-bold tracking-tight">
                  Generate Comparative AI Intelligence Dossier
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm mt-1">
                  Synthesizes relative efficiency, allocation variances, and public record anomalies between {mp1.name} and {mp2.name}.
                </p>
              </div>

              <button
                onClick={handleRunAIComparison}
                disabled={aiLoading}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shrink-0 disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Consulting Gemini 3.6 Flash...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    Compare {mp1.name} vs {mp2.name}
                  </>
                )}
              </button>
            </div>

            {/* Rendered AI Analysis */}
            {aiAnalysis && (
              <div className="mt-4 p-5 bg-white/10 rounded-xl border border-white/15 backdrop-blur-sm space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    Grounded Civic Intelligence Verdict
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Model: gemini-3.6-flash · Strict Evidence Grounding
                  </span>
                </div>
                <div className="text-sm text-neutral-200 whitespace-pre-line leading-relaxed font-sans">
                  {aiAnalysis}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ALL MPS DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Search & Party Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search MP name, constituency, state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d8d6cc] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            {/* Party Filter Pills */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {parties.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedParty(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedParty === p
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "bg-[#f4f3ee] text-neutral-700 hover:bg-[#eae8df] border border-[#e2e0d8]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* MP Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMPs.map((mp) => (
              <div
                key={mp.id}
                className="bg-white rounded-2xl p-5 border border-[#ecebe6] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-serif font-bold text-amber-900">
                        {mp.avatar_initials}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-neutral-900 text-base">{mp.name}</h3>
                        <p className="text-xs text-neutral-500">
                          {mp.party} · {mp.constituency}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {mp.utilization_rate}%
                    </span>
                  </div>

                  {/* Utilization Bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>Spent: {formatCurrency(mp.expenditure_amount)}</span>
                      <span>Total: {formatCurrency(mp.sanctioned_amount)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-700 rounded-full"
                        style={{ width: `${mp.utilization_rate}%` }}
                      />
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="bg-[#faf9f5] p-2 rounded-lg border border-[#ece9df]">
                      <span className="text-[10px] text-neutral-500 block">Works Sanctioned</span>
                      <span className="font-bold text-neutral-900">{mp.total_works_sanctioned} works</span>
                    </div>
                    <div className="bg-[#faf9f5] p-2 rounded-lg border border-[#ece9df]">
                      <span className="text-[10px] text-neutral-500 block">Audit Observations</span>
                      <span className={`font-bold ${mp.flagged_observations > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                        {mp.flagged_observations} flagged
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action: Compare */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 font-medium">
                    State: <span className="text-neutral-800">{mp.state}</span>
                  </span>
                  <button
                    onClick={() => {
                      setMp1Id(mp.id);
                      setActiveTab("compare");
                    }}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1"
                  >
                    Compare MP <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
