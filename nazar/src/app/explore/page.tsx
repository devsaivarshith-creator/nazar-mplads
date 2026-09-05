"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  MapPin,
  Users,
  User,
  Layers,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/data/mockData";
import { formatCurrency } from "@/lib/utils";

const TABS = [
  { id: "state", label: "State", icon: FileText },
  { id: "district", label: "District", icon: MapPin },
  { id: "constituency", label: "Constituency", icon: Users },
  { id: "mp", label: "Member of Parliament", icon: User },
  { id: "sector", label: "Sector", icon: Layers },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialBy = searchParams.get("by") || "district";
  const [activeTab, setActiveTab] = useState(initialBy);

  // Groupings
  const groups: Record<string, { count: number; sanctioned: number; flagged: number; link: string }> = {};

  MOCK_PROJECTS.forEach((p) => {
    let key = "";
    let link = "";

    if (activeTab === "state") {
      key = p.state;
      link = `/projects?q=${encodeURIComponent(p.state)}`;
    } else if (activeTab === "district") {
      key = `${p.district}, ${p.state}`;
      link = `/projects?district=${encodeURIComponent(p.district)}`;
    } else if (activeTab === "constituency") {
      key = `${p.constituency} (${p.state})`;
      link = `/projects?q=${encodeURIComponent(p.constituency)}`;
    } else if (activeTab === "mp") {
      key = `${p.mp_name} (${p.mp_party || "LS"})`;
      link = `/projects?q=${encodeURIComponent(p.mp_name)}`;
    } else if (activeTab === "sector") {
      key = p.sector;
      link = `/projects?sector=${encodeURIComponent(p.sector)}`;
    }

    if (!groups[key]) {
      groups[key] = { count: 0, sanctioned: 0, flagged: 0, link };
    }
    groups[key].count += 1;
    groups[key].sanctioned += p.sanctioned_amount;
    groups[key].flagged += p.findings.length;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-[#ecebe6] pb-6">
        <h1 className="text-2xl font-bold text-[#1c2024] font-serif">
          Explore Public Allocations
        </h1>
        <p className="text-xs text-[#64748b] mt-1">
          Navigate MPLADS projects through geographical hierarchies, parliamentary representation, or civic sectors.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ecebe6]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                isActive
                  ? "border-[#c25e00] text-[#1c2024]"
                  : "border-transparent text-[#64748b] hover:text-[#1c2024]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of entities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groups).map(([entityName, data]) => (
          <Link
            key={entityName}
            href={data.link}
            className="group bg-white rounded-2xl border border-[#e4e2da] hover:border-amber-300 p-5 shadow-card hover:shadow-soft transition-all duration-200 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-[#1c2024] group-hover:text-amber-800 transition-colors">
                {entityName}
              </h3>
              <ArrowUpRight className="w-4 h-4 text-[#8b95a1] group-hover:text-amber-800 transition-colors shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#f0eee8]">
              <div>
                <span className="text-[#8b95a1] block">Projects</span>
                <span className="font-bold text-[#1c2024]">{data.count} Works</span>
              </div>
              <div>
                <span className="text-[#8b95a1] block">Sanctioned</span>
                <span className="font-bold text-[#1c2024]">{formatCurrency(data.sanctioned)}</span>
              </div>
            </div>

            {data.flagged > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                <span>{data.flagged} Observation(s) requiring review</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#8b95a1]">Loading explorer...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
