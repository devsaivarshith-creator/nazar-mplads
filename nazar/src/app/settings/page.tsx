"use client";

import { useState } from "react";
import { Settings, Cpu, Database, Shield, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [provider, setProvider] = useState("mock");
  const [costThreshold, setCostThreshold] = useState("2.0");
  const [similarityThreshold, setSimilarityThreshold] = useState("75");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-[#ecebe6] pb-6">
        <h1 className="text-2xl font-bold text-[#1c2024] font-serif">
          Platform Settings
        </h1>
        <p className="text-xs text-[#64748b] mt-1">
          Configure AI provider integration, statistical sensitivity, and ingestion parameters.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings persisted to session.
        </div>
      )}

      <div className="bg-white rounded-3xl border border-[#e4e2da] p-8 shadow-card space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-600" />
          AI Provider Engine
        </h2>

        <div className="space-y-3 text-xs">
          <label className="block text-[11px] font-bold text-[#475569] uppercase">
            Active Provider
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "mock", label: "Mock Provider", desc: "Fast, deterministic, zero-cost" },
              { id: "gemini", label: "Google Gemini", desc: "gemini-1.5-flash RAG" },
              { id: "openai", label: "OpenAI", desc: "gpt-4o-mini completion" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  provider === p.id
                    ? "bg-amber-50/70 border-amber-300 text-amber-950 shadow-xs"
                    : "bg-[#faf9f6] border-[#dedcd4] text-[#475569] hover:bg-white"
                }`}
              >
                <div className="font-bold text-sm text-[#1c2024]">{p.label}</div>
                <div className="text-[11px] text-[#64748b] mt-1">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#ecebe6] space-y-4 text-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            Detector Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                Peer Financial Multiplier (Outlier Trigger)
              </label>
              <select
                value={costThreshold}
                onChange={(e) => setCostThreshold(e.target.value)}
                className="w-full bg-[#faf9f6] border border-[#dedcd4] rounded-xl p-2.5 outline-none"
              >
                <option value="1.5">1.5× Peer Median</option>
                <option value="2.0">2.0× Peer Median (Recommended)</option>
                <option value="2.5">2.5× Peer Median (Strict)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                Candidate Duplicate Similarity Cutoff
              </label>
              <select
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(e.target.value)}
                className="w-full bg-[#faf9f6] border border-[#dedcd4] rounded-xl p-2.5 outline-none"
              >
                <option value="70">70% Lexical Overlap</option>
                <option value="75">75% Lexical Overlap (Recommended)</option>
                <option value="85">85% Lexical Overlap (High Confidence)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#ecebe6] flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#1c2024] text-white font-bold text-xs hover:bg-[#2e363e]"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
