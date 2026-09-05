"use client";

import { Sun, ChevronDown, ShieldCheck, Database } from "lucide-react";

export function Header() {
  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="h-16 border-b border-[#ecebe6] px-8 flex items-center justify-between bg-[#fbfbf9]/90 backdrop-blur-md sticky top-0 z-30">
      {/* Motto / Breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8b95a1]">
          Public Funds &nbsp;/&nbsp; Real Work &nbsp;/&nbsp; Greater Impact
        </span>
        <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Evidence-Grounded
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-5">
        <span className="text-xs text-[#717a84] font-medium hidden sm:inline">
          {todayFormatted}
        </span>

        {/* Demo data badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f3f1eb] border border-[#e2e0d8] text-[11px] font-medium text-[#5c6570]">
          <Database className="w-3 h-3 text-amber-600" />
          <span>Demo Dataset Active</span>
        </div>

        {/* Theme Toggle */}
        <button
          title="Toggle appearance"
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#6e7781] hover:bg-[#f1efe9] transition-colors border border-transparent hover:border-[#e2e0d8]"
        >
          <Sun className="w-4 h-4" />
        </button>

        {/* User profile dropdown */}
        <div className="flex items-center gap-2.5 pl-2 py-1 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[#ebe8e1] border border-[#d8d5cd] flex items-center justify-center text-xs font-bold text-[#2d3339]">
            AS
          </div>
          <div className="text-left hidden md:block leading-tight">
            <div className="text-xs font-semibold text-[#1c2024]">Arjun Singh</div>
            <div className="text-[10px] text-[#717a84] font-normal">
              Civic Reviewer · MoSPI Data
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#8b95a1]" />
        </div>
      </div>
    </header>
  );
}
