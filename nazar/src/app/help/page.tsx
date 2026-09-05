"use client";

import {
  HelpCircle,
  ShieldCheck,
  Cpu,
  Database,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

export default function HelpPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-[#ecebe6] pb-6">
        <h1 className="text-2xl font-bold text-[#1c2024] font-serif">
          Methodology & Platform Transparency
        </h1>
        <p className="text-xs text-[#64748b] mt-1">
          Understanding how NAZAR parses public MPLADS data and computes explainable observations.
        </p>
      </div>

      {/* Official Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Independent Hackathon Prototype Notice
        </div>
        <p className="leading-relaxed text-[#475569]">
          <strong>NAZAR is NOT an official Government of India website</strong>, nor does it represent the Ministry of Statistics and Programme Implementation (MoSPI). It is an independent civic-technology prototype designed to demonstrate how deterministic analysis, graph relationships, and evidence-grounded AI can enhance public transparency over community developmental funds.
        </p>
      </div>

      {/* 5 Detectors Explanation */}
      <div className="bg-white rounded-3xl border border-[#e4e2da] p-8 shadow-card space-y-6">
        <h2 className="text-lg font-bold font-serif text-[#1c2024]">
          The 5 Deterministic Detectors
        </h2>
        <p className="text-xs text-[#64748b]">
          NAZAR does NOT use generative AI as an arbitrary anomaly detector. All triage signals are computed deterministically.
        </p>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#e5e3db] space-y-1">
            <h3 className="font-bold text-[#1c2024]">
              1. Compliance & Rule Violations (Detector 1)
            </h3>
            <p className="text-[#64748b]">
              Scans for chronological sequence contradictions (such as completion stamped prior to ground commencement), absent financial disclosures on completed contracts, and missing administrative milestones.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#e5e3db] space-y-1">
            <h3 className="font-bold text-[#1c2024]">
              2. Peer-Group Financial Benchmarking (Detector 2)
            </h3>
            <p className="text-[#64748b]">
              Computes statistical distributions (median, interquartile range, 75th percentile) for identical sectors within the same administrative zone. Works exceeding 2.0× peer median are flagged for technical scope verification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#e5e3db] space-y-1">
            <h3 className="font-bold text-[#1c2024]">
              3. Lifecycle Stagnation & Timeline Delays (Detector 3)
            </h3>
            <p className="text-[#64748b]">
              Detects works exceeding target completion deadlines by &gt;180 days without recorded extension orders, as well as dormant works lacking expenditure updates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#e5e3db] space-y-1">
            <h3 className="font-bold text-[#1c2024]">
              4. Candidate Duplicate Projects (Detector 4)
            </h3>
            <p className="text-[#64748b]">
              Identifies high lexical similarity (&gt;75%) paired with geographic proximity (&lt;3 km) to surface concurrently sanctioned works that share scope or location descriptors for reviewer validation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#e5e3db] space-y-1">
            <h3 className="font-bold text-[#1c2024]">
              5. Agency & Vendor Concentration (Detector 5)
            </h3>
            <p className="text-[#64748b]">
              Evaluates institutional distribution shares per district, identifying when single implementing divisions absorb &gt;50% of local developmental contracts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
