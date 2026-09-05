"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  ShieldAlert,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Project, ProjectStatus } from "@/types";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialDistrict = searchParams.get("district") || "";
  const initialSector = searchParams.get("sector") || "";
  const initialFlagged = searchParams.get("flagged") === "true";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict || "All");
  const [selectedSector, setSelectedSector] = useState<string>(initialSector || "All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [onlyFlagged, setOnlyFlagged] = useState<boolean>(initialFlagged);
  const [sortBy, setSortBy] = useState<"amount_desc" | "amount_asc" | "findings_desc" | "date_desc">("findings_desc");

  // Filter options
  const states = ["All", ...Array.from(new Set(MOCK_PROJECTS.map((p) => p.state)))];
  const districts = ["All", ...Array.from(new Set(MOCK_PROJECTS.map((p) => p.district)))];
  const sectors = ["All", ...Array.from(new Set(MOCK_PROJECTS.map((p) => p.sector)))];
  const statuses = ["All", "Completed", "In Progress", "Delayed"];

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((p) => {
      // Text query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.project_name.toLowerCase().includes(q);
        const matchMp = p.mp_name.toLowerCase().includes(q);
        const matchDistrict = p.district.toLowerCase().includes(q);
        const matchConst = p.constituency.toLowerCase().includes(q);
        const matchId = p.id.toLowerCase().includes(q) || p.external_id.toLowerCase().includes(q);
        const matchSector = p.sector.toLowerCase().includes(q);
        if (!matchName && !matchMp && !matchDistrict && !matchConst && !matchId && !matchSector) {
          return false;
        }
      }

      if (selectedState !== "All" && p.state !== selectedState) return false;
      if (selectedDistrict !== "All" && p.district !== selectedDistrict) return false;
      if (selectedSector !== "All" && p.sector !== selectedSector) return false;
      if (selectedStatus !== "All" && p.status !== selectedStatus) return false;
      if (onlyFlagged && p.findings.length === 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "findings_desc") return b.findings.length - a.findings.length;
      if (sortBy === "amount_desc") return b.sanctioned_amount - a.sanctioned_amount;
      if (sortBy === "amount_asc") return a.sanctioned_amount - b.sanctioned_amount;
      if (sortBy === "date_desc") {
        const dateA = a.sanction_date ? new Date(a.sanction_date).getTime() : 0;
        const dateB = b.sanction_date ? new Date(b.sanction_date).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });
  }, [searchQuery, selectedState, selectedDistrict, selectedSector, selectedStatus, onlyFlagged, sortBy]);

  const totalSanctioned = filteredProjects.reduce((sum, p) => sum + p.sanctioned_amount, 0);
  const totalFindings = filteredProjects.reduce((sum, p) => sum + p.findings.length, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ecebe6] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1c2024] font-serif">
              MPLADS Project Registry
            </h1>
            <span className="text-xs bg-[#f2efe9] text-[#555e68] px-2.5 py-0.5 rounded-full font-semibold">
              {filteredProjects.length} Records
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-1">
            Browse and inspect public works, monitor lifecycle updates, and review automated NAZAR observations.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-xl border border-[#e5e3db] shadow-card">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#8b95a1] tracking-wider">
              Total Sanctioned
            </div>
            <div className="text-sm font-bold text-[#1c2024]">
              {formatCurrency(totalSanctioned)}
            </div>
          </div>
          <div className="h-6 w-px bg-[#ecebe6]"></div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-600" />
              Observations
            </div>
            <div className="text-sm font-bold text-amber-900">
              {totalFindings} Active
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#e4e2da] p-4 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8b95a1] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, ID, MP, district or sector..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#faf9f6] rounded-xl border border-[#dedcd4] focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-[#1c2024]"
            />
          </div>

          {/* Quick Flagged Toggle */}
          <button
            onClick={() => setOnlyFlagged(!onlyFlagged)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              onlyFlagged
                ? "bg-amber-50 text-amber-900 border-amber-300 shadow-xs"
                : "bg-[#faf9f6] text-[#64748b] border-[#dedcd4] hover:bg-white"
            }`}
          >
            <ShieldAlert className={`w-4 h-4 ${onlyFlagged ? "text-amber-600" : "text-[#8b95a1]"}`} />
            <span>Observations Only ({totalFindings})</span>
          </button>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#8b95a1]" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#faf9f6] border border-[#dedcd4] text-xs font-medium rounded-xl px-3 py-2.5 text-[#334155] outline-none"
            >
              <option value="findings_desc">Sort: Most Observations</option>
              <option value="amount_desc">Sort: Amount (High to Low)</option>
              <option value="amount_asc">Sort: Amount (Low to High)</option>
              <option value="date_desc">Sort: Latest Sanction</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#f2f0ea] text-xs">
          <div>
            <label className="block text-[10px] font-bold text-[#8b95a1] uppercase mb-1">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-[#faf9f6] border border-[#dedcd4] rounded-lg px-2.5 py-1.5 text-[#334155] outline-none"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8b95a1] uppercase mb-1">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-[#faf9f6] border border-[#dedcd4] rounded-lg px-2.5 py-1.5 text-[#334155] outline-none"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8b95a1] uppercase mb-1">
              Sector
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-[#faf9f6] border border-[#dedcd4] rounded-lg px-2.5 py-1.5 text-[#334155] outline-none"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8b95a1] uppercase mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#faf9f6] border border-[#dedcd4] rounded-lg px-2.5 py-1.5 text-[#334155] outline-none"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table / Card List */}
      <div className="space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e4e2da] p-8 space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-[#1c2024]">No matching projects found</h3>
            <p className="text-xs text-[#64748b] max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to browse the full register.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedState("All");
                setSelectedDistrict("All");
                setSelectedSector("All");
                setSelectedStatus("All");
                setOnlyFlagged(false);
              }}
              className="mt-2 text-xs font-semibold text-amber-700 hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const hasFindings = project.findings.length > 0;
            const isCriticalOrHigh = project.findings.some(
              (f) => f.severity === "high" || f.severity === "critical"
            );

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group block bg-white rounded-2xl border border-[#e4e2da] hover:border-amber-300 p-5 shadow-card hover:shadow-soft transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold text-[#64748b] bg-[#f5f4ee] px-2 py-0.5 rounded border border-[#e2e0d8]">
                        {project.id}
                      </span>
                      <span className="text-xs text-[#475569] font-medium">
                        {project.district}, {project.state}
                      </span>
                      <span className="text-xs text-[#8b95a1]">·</span>
                      <span className="text-xs text-[#475569] font-medium">
                        MP: {project.mp_name} ({project.mp_party || "LS"})
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-[#1c2024] group-hover:text-amber-800 transition-colors line-clamp-2">
                      {project.project_name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#64748b]">
                      <span>
                        <strong className="text-[#334155] font-semibold">Sector:</strong>{" "}
                        {project.sector}
                      </span>
                      <span>
                        <strong className="text-[#334155] font-semibold">Agency:</strong>{" "}
                        {project.implementing_agency}
                      </span>
                      {project.sanction_date && (
                        <span>
                          <strong className="text-[#334155] font-semibold">Sanctioned:</strong>{" "}
                          {formatDate(project.sanction_date)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right financials & findings badges */}
                  <div className="flex flex-row lg:flex-col lg:items-end justify-between items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#f0eee8] shrink-0">
                    <div className="text-left lg:text-right">
                      <div className="text-xs text-[#8b95a1] font-medium">Sanctioned Cost</div>
                      <div className="text-base font-bold text-[#1c2024]">
                        {formatCurrency(project.sanctioned_amount)}
                      </div>
                      <div className="text-[11px] text-[#64748b]">
                        Expended: {formatCurrency(project.expenditure_amount)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status badge */}
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                          project.status === "Completed"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : project.status === "Delayed"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-blue-50 text-blue-800 border-blue-200"
                        }`}
                      >
                        {project.status}
                      </span>

                      {/* Observations badge */}
                      {hasFindings && (
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            isCriticalOrHigh
                              ? "bg-amber-100 text-amber-900 border-amber-300"
                              : "bg-[#faf8f4] text-amber-800 border-amber-200"
                          }`}
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                          {project.findings.length} {project.findings.length === 1 ? "Finding" : "Findings"}
                        </span>
                      )}

                      <ChevronRight className="w-4 h-4 text-[#8b95a1] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Inline preview of top finding if present */}
                {hasFindings && (
                  <div className="mt-3.5 pt-3 border-t border-amber-100/70 bg-amber-50/40 -mx-5 -mb-5 px-5 py-2.5 rounded-b-2xl flex items-center justify-between text-xs text-amber-900">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0"></span>
                      <span className="font-semibold text-amber-950 truncate">
                        {project.findings[0].title}:
                      </span>
                      <span className="text-[#555e68] truncate hidden sm:inline">
                        {project.findings[0].description}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-800 shrink-0 group-hover:underline">
                      Review Evidence →
                    </span>
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#8b95a1]">Loading project registry...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
