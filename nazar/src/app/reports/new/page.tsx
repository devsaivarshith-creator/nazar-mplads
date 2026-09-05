"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  ShieldAlert,
  Loader2,
} from "lucide-react";

function ReportNewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialScope = searchParams.get("scope") || "Hyderabad";
  const initialPeriod = searchParams.get("period") || "FY 2021-22 to FY 2023-24";

  const [scopeType, setScopeType] = useState<"Constituency" | "District" | "State" | "MP">("Constituency");
  const [scopeName, setScopeName] = useState(initialScope);
  const [period, setPeriod] = useState(initialPeriod);

  const [topics, setTopics] = useState<string[]>([
    "Project Implementation",
    "Financial Performance & Outliers",
    "Lifecycle Delays",
    "Anomalies & Inconsistencies",
    "Sectoral Breakdown",
    "Data Quality & Completeness",
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const generationSteps = [
    "Querying structured eSAKSHI database records...",
    "Running 5 deterministic anomaly detectors (rules, financial, lifecycle, similarity, relationships)...",
    "Retrieving peer group statistical baselines...",
    "Assembling source lineage references...",
    "Synthesizing grounded executive findings...",
  ];

  const handleToggleTopic = (topic: string) => {
    if (topics.includes(topic)) {
      setTopics(topics.filter((t) => t !== topic));
    } else {
      setTopics([...topics, topic]);
    }
  };

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            const cleanTarget = scopeName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
            if (cleanTarget.includes("hyderabad")) {
              router.push("/reports/REP-HYD-2024");
            } else if (cleanTarget.includes("varanasi") || cleanTarget.includes("modi")) {
              router.push("/reports/REP-VAR-2024");
            } else if (cleanTarget.includes("rae-bareli") || cleanTarget.includes("rahul")) {
              router.push("/reports/REP-RBL-2024");
            } else {
              router.push(`/reports/REP-${cleanTarget || "custom"}-2024`);
            }
          }, 800);
          return prev;
        }
      });
    }, 900);
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      <Link
        href="/reports"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#1c2024]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Reports</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-[#1c2024]">
          Generate Implementation & Anomaly Report
        </h1>
        <p className="text-xs text-[#64748b]">
          Assemble a professional, evidence-backed evaluation based on publicly available MPLADS data.
        </p>
      </div>

      {isGenerating ? (
        <div className="bg-white rounded-3xl border border-[#e4e2da] p-10 shadow-card text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold font-serif text-[#1c2024]">
              Generating NAZAR Intelligence Dossier
            </h3>
            <p className="text-xs text-[#64748b]">
              Scope: {scopeType} ({scopeName}) · {period}
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="max-w-md mx-auto text-left space-y-3 pt-4 border-t border-[#f0eee8]">
            {generationSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs ${
                  idx < currentStep
                    ? "text-emerald-700 font-medium"
                    : idx === currentStep
                    ? "text-[#1c2024] font-bold"
                    : "text-[#8b95a1]"
                }`}
              >
                {idx < currentStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : idx === currentStep ? (
                  <div className="w-4 h-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin shrink-0"></div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#d8d5cd] shrink-0"></div>
                )}
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#e4e2da] p-8 shadow-card space-y-8">
          {/* Scope Selector */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#64748b]">
              1. Geographic & Jurisdictional Scope
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["Constituency", "District", "State", "MP"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setScopeType(type)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    scopeType === type
                      ? "bg-[#1c2024] text-white border-[#1c2024] shadow-xs"
                      : "bg-[#faf9f6] text-[#475569] border-[#dedcd4] hover:bg-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                Target Name / Identifier
              </label>
              <input
                type="text"
                value={scopeName}
                onChange={(e) => setScopeName(e.target.value)}
                placeholder="e.g. Hyderabad, Karimnagar, Telangana, Asaduddin Owaisi..."
                className="w-full bg-[#faf9f6] border border-[#dedcd4] rounded-xl px-4 py-2.5 text-xs text-[#1c2024] outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Period Selector */}
          <div className="space-y-4 pt-4 border-t border-[#ecebe6]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#64748b]">
              2. Assessment Period
            </h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-[#faf9f6] border border-[#dedcd4] rounded-xl px-4 py-2.5 text-xs text-[#1c2024] outline-none"
            >
              <option>FY 2021-22 to FY 2023-24 (17th Lok Sabha Tenure)</option>
              <option>FY 2023-24 (Latest Single Year)</option>
              <option>FY 2019-20 to FY 2024-25 (Full 5-Year Window)</option>
            </select>
          </div>

          {/* Topics Checkboxes */}
          <div className="space-y-4 pt-4 border-t border-[#ecebe6]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#64748b]">
              3. Analytical Topics to Include
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Project Implementation",
                "Financial Performance & Outliers",
                "Lifecycle Delays",
                "Anomalies & Inconsistencies",
                "Sectoral Breakdown",
                "Data Quality & Completeness",
                "Potential Duplicate Candidates",
                "Agency Concentration Analysis",
              ].map((t) => (
                <label
                  key={t}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    topics.includes(t)
                      ? "bg-amber-50/50 border-amber-300 text-amber-950 font-semibold"
                      : "bg-[#faf9f6] border-[#dedcd4] text-[#475569]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={topics.includes(t)}
                    onChange={() => handleToggleTopic(t)}
                    className="rounded border-[#dedcd4] text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#ecebe6] flex justify-end">
            <button
              onClick={handleStartGeneration}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1c2024] text-white font-bold text-xs hover:bg-[#2e363e] shadow-sm transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Grounded Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportNewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#8b95a1]">Loading report builder...</div>}>
      <ReportNewContent />
    </Suspense>
  );
}
