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
import { ALL_INDIAN_STATES } from "@/lib/data/statesData";
import { MP_PROFILES } from "@/lib/data/mpsData";
import { MOCK_PROJECTS } from "@/lib/data/mockData";
import { formatCurrency } from "@/lib/utils";

const TABS = [
  { id: "state", label: "States & UTs (36)", icon: FileText },
  { id: "mp", label: "Members of Parliament", icon: User },
  { id: "district", label: "Districts", icon: MapPin },
  { id: "constituency", label: "Constituency", icon: Users },
  { id: "sector", label: "Sectors", icon: Layers },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialBy = searchParams.get("by") || "state";
  const [activeTab, setActiveTab] = useState(initialBy);
  const [filterQuery, setFilterQuery] = useState("");
  const [stateTypeFilter, setStateTypeFilter] = useState<"all" | "State" | "Union Territory">("all");

  // Filtered States
  const filteredStates = ALL_INDIAN_STATES.filter((st) => {
    const matchesType = stateTypeFilter === "all" || st.type === stateTypeFilter;
    const matchesQuery = !filterQuery.trim() || st.name.toLowerCase().includes(filterQuery.toLowerCase()) || st.capital.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  // Filtered MPs
  const filteredMPs = MP_PROFILES.filter((mp) => {
    return !filterQuery.trim() ||
      mp.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      mp.constituency.toLowerCase().includes(filterQuery.toLowerCase()) ||
      mp.state.toLowerCase().includes(filterQuery.toLowerCase()) ||
      mp.party.toLowerCase().includes(filterQuery.toLowerCase());
  });

  // Project groups for District, Constituency, Sector
  const groups: Record<string, { count: number; sanctioned: number; flagged: number; link: string }> = {};
  MOCK_PROJECTS.forEach((p) => {
    let key = "";
    let link = "";
    if (activeTab === "district") {
      key = `${p.district}, ${p.state}`;
      link = `/projects?district=${encodeURIComponent(p.district)}`;
    } else if (activeTab === "constituency") {
      key = `${p.constituency} (${p.state})`;
      link = `/projects?q=${encodeURIComponent(p.constituency)}`;
    } else if (activeTab === "sector") {
      key = p.sector;
      link = `/projects?sector=${encodeURIComponent(p.sector)}`;
    }
    if (key) {
      if (!groups[key]) {
        groups[key] = { count: 0, sanctioned: 0, flagged: 0, link };
      }
      groups[key].count += 1;
      groups[key].sanctioned += p.sanctioned_amount;
      groups[key].flagged += p.findings.length;
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ecebe6] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1c2024] font-serif">
            Explore All India MPLADS Allocations
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Navigate all 28 States, 8 Union Territories, Member of Parliament profiles, and civic sectors across India.
          </p>
        </div>

        {/* Search input inside Explorer */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder={`Filter ${activeTab}...`}
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#dcdad0] bg-white text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ecebe6]">
        <div className="flex items-center gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setFilterQuery("");
                }}
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

        {/* State Type Filter (Only visible when tab === "state") */}
        {activeTab === "state" && (
          <div className="flex items-center gap-1.5 text-xs pb-2">
            <button
              onClick={() => setStateTypeFilter("all")}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors ${
                stateTypeFilter === "all" ? "bg-amber-100 text-amber-900 border-amber-300 font-bold" : "bg-white text-neutral-600 border-neutral-200"
              }`}
            >
              All (36)
            </button>
            <button
              onClick={() => setStateTypeFilter("State")}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors ${
                stateTypeFilter === "State" ? "bg-amber-100 text-amber-900 border-amber-300 font-bold" : "bg-white text-neutral-600 border-neutral-200"
              }`}
            >
              28 States
            </button>
            <button
              onClick={() => setStateTypeFilter("Union Territory")}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors ${
                stateTypeFilter === "Union Territory" ? "bg-amber-100 text-amber-900 border-amber-300 font-bold" : "bg-white text-neutral-600 border-neutral-200"
              }`}
            >
              8 Union Territories
            </button>
          </div>
        )}
      </div>

      {/* RENDER TAB 1: ALL 36 INDIAN STATES & UTs */}
      {activeTab === "state" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStates.map((st) => (
            <Link
              key={st.code}
              href={`/projects?q=${encodeURIComponent(st.name)}`}
              className="group bg-white rounded-2xl border border-[#e4e2da] hover:border-amber-400 p-5 shadow-card hover:shadow-soft transition-all duration-200 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                    {st.type} · {st.code}
                  </span>
                  <h3 className="text-base font-bold text-[#1c2024] group-hover:text-amber-800 transition-colors mt-1.5">
                    {st.name}
                  </h3>
                  <span className="text-xs text-neutral-500">Capital: {st.capital}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#8b95a1] group-hover:text-amber-800 transition-colors shrink-0" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-[#f0eee8]">
                <div>
                  <span className="text-[11px] text-[#8b95a1] block">LS Seats</span>
                  <span className="font-bold text-[#1c2024]">{st.lok_sabha_seats}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8b95a1] block">Sanctioned</span>
                  <span className="font-bold text-[#1c2024]">{formatCurrency(st.total_sanctioned)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8b95a1] block">Utilization</span>
                  <span className="font-bold text-emerald-700">{st.utilization_rate}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-neutral-500">
                <span>{st.total_projects.toLocaleString("en-IN")} Projects</span>
                <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                  {st.flagged_projects} Observations
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* RENDER TAB 2: MEMBERS OF PARLIAMENT */}
      {activeTab === "mp" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMPs.map((mp) => (
            <Link
              key={mp.id}
              href={`/mps?mp1=${mp.id}`}
              className="group bg-white rounded-2xl border border-[#e4e2da] hover:border-amber-400 p-5 shadow-card hover:shadow-soft transition-all duration-200 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: mp.party_color }}
                  >
                    {mp.avatar_initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold px-2 py-0.2 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                        {mp.party}
                      </span>
                      <span className="text-[11px] text-neutral-500">{mp.house}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1c2024] group-hover:text-amber-800 transition-colors mt-0.5">
                      {mp.name}
                    </h3>
                    <span className="text-xs text-neutral-500">{mp.constituency}, {mp.state}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#8b95a1] group-hover:text-amber-800 transition-colors shrink-0" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-[#f0eee8]">
                <div>
                  <span className="text-[11px] text-[#8b95a1] block">Sanctioned</span>
                  <span className="font-bold text-[#1c2024]">{formatCurrency(mp.sanctioned_amount)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8b95a1] block">Spent</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(mp.expenditure_amount)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8b95a1] block">Completion</span>
                  <span className="font-bold text-neutral-800">{mp.completion_rate}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-neutral-500">{mp.total_works_sanctioned} Works</span>
                {mp.delayed_works > 0 ? (
                  <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {mp.delayed_works} Delayed Works
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    On Schedule
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* RENDER TAB 3, 4, 5: DISTRICTS, CONSTITUENCIES, SECTORS */}
      {activeTab !== "state" && activeTab !== "mp" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groups)
            .filter(([name]) => !filterQuery.trim() || name.toLowerCase().includes(filterQuery.toLowerCase()))
            .map(([entityName, data]) => (
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
      )}
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
