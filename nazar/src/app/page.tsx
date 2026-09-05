"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  RotateCw,
  FileText,
  MapPin,
  Users,
  User,
  Layers,
  FileSpreadsheet,
  Clock,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { MockAIProvider } from "@/lib/ai/providers";

const PROMPT_SUGGESTIONS = [
  "Show MPLADS works in Hyderabad",
  "Projects recommended by MP Asaduddin Owaisi",
  "Find delayed projects in Telangana",
  "Generate a report on Karimnagar constituency",
  "Why is project HYD-2023-0881 flagged?",
  "Find projects above ₹50 lakh with cost anomalies",
];

const EXPLORE_CATEGORIES = [
  { label: "State", href: "/explore?by=state", icon: FileText, color: "text-amber-700 bg-amber-50 border-amber-200/60" },
  { label: "District", href: "/explore?by=district", icon: MapPin, color: "text-emerald-700 bg-emerald-50 border-emerald-200/60" },
  { label: "Constituency", href: "/explore?by=constituency", icon: Users, color: "text-blue-700 bg-blue-50 border-blue-200/60" },
  { label: "MP", href: "/explore?by=mp", icon: User, color: "text-purple-700 bg-purple-50 border-purple-200/60" },
  { label: "Project", href: "/projects", icon: FileSpreadsheet, color: "text-rose-700 bg-rose-50 border-rose-200/60" },
  { label: "Sector", href: "/explore?by=sector", icon: Layers, color: "text-teal-700 bg-teal-50 border-teal-200/60" },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    answer: string;
    sources: string[];
    keyPoints?: string[];
  } | null>(null);

  const displayedPrompts = [
    PROMPT_SUGGESTIONS[promptIndex % PROMPT_SUGGESTIONS.length],
    PROMPT_SUGGESTIONS[(promptIndex + 1) % PROMPT_SUGGESTIONS.length],
    PROMPT_SUGGESTIONS[(promptIndex + 2) % PROMPT_SUGGESTIONS.length],
    PROMPT_SUGGESTIONS[(promptIndex + 3) % PROMPT_SUGGESTIONS.length],
  ];

  const handleCyclePrompts = () => {
    setPromptIndex((prev) => (prev + 2) % PROMPT_SUGGESTIONS.length);
  };

  const handleExecuteSearch = async (searchQuery?: string) => {
    const textToSearch = searchQuery || query;
    if (!textToSearch.trim()) return;

    setIsSearching(true);
    setAiResponse(null);

    const q = textToSearch.toLowerCase();

    // Check if it's an AI inquiry question ("why", "explain", "how many", "flagged")
    if (q.includes("why") || q.includes("explain") || q.includes("how") || q.includes("flag")) {
      const ai = new MockAIProvider();
      const res = await ai.answerQuestion(textToSearch, {});
      setAiResponse(res);
      setIsSearching(false);
      return;
    }

    // Check if it's report generation
    if (q.includes("generate report") || q.includes("report on")) {
      router.push(`/reports/new?scope=Karimnagar&period=2021-2024`);
      return;
    }

    // Normal navigational / faceted search: redirect to /projects with query
    router.push(`/projects?q=${encodeURIComponent(textToSearch)}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between px-6 sm:px-12 lg:px-20 py-10 overflow-hidden">
      {/* Top / Center Content */}
      <div className="max-w-4xl mx-auto w-full text-center space-y-8 pt-4">
        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1c2024]">
            Ask{" "}
            <span className="font-serif font-black tracking-normal bg-gradient-to-r from-amber-700 via-orange-600 to-emerald-800 bg-clip-text text-transparent">
              NAZAR
            </span>
            <span className="text-emerald-700 font-serif">.</span>
            <br />
            <span className="font-serif italic font-medium text-[#2d3339]">
              Get the bigger picture.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#64748b] font-normal max-w-lg mx-auto">
            Search. Analyse. Generate insights from MPLADS data.
          </p>
        </div>

        {/* Big Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-full border border-[#d8d5cd] shadow-pill hover:border-amber-400 focus-within:border-amber-600 focus-within:ring-4 focus-within:ring-amber-100 transition-all duration-200">
            <div className="pl-6 pr-3 text-[#8b95a1]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExecuteSearch()}
              placeholder="Search by State, District, Constituency, MP or ask a question..."
              className="w-full py-4 text-sm sm:text-base bg-transparent text-[#1c2024] placeholder-[#8b95a1] outline-none pr-14"
            />
            <button
              onClick={() => handleExecuteSearch()}
              disabled={isSearching}
              aria-label="Search"
              className="absolute right-2 w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center hover:opacity-90 transition-transform active:scale-95 shadow-sm disabled:opacity-50"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prompt Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto pt-1">
          {displayedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(prompt);
                handleExecuteSearch(prompt);
              }}
              className="text-xs bg-white text-[#475569] hover:text-[#1c2024] hover:bg-[#f5f4ef] border border-[#e4e2da] px-4 py-2 rounded-full shadow-xs transition-all duration-150 hover:shadow-sm"
            >
              {prompt}
            </button>
          ))}
          <button
            onClick={handleCyclePrompts}
            title="Cycle prompts"
            className="w-8 h-8 rounded-full border border-[#e4e2da] bg-white text-[#64748b] hover:text-[#1c2024] flex items-center justify-center hover:bg-[#f5f4ef] transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inline AI Answer Panel if question asked */}
        {aiResponse && (
          <div className="max-w-2xl mx-auto text-left bg-white rounded-2xl border border-amber-200/80 p-6 shadow-card space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-center justify-between border-b border-[#f1f0eb] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                NAZAR Evidence-Grounded Response
              </div>
              <button
                onClick={() => setAiResponse(null)}
                className="text-xs text-[#8b95a1] hover:text-[#1c2024]"
              >
                Dismiss
              </button>
            </div>
            <div className="text-sm text-[#334155] leading-relaxed whitespace-pre-line">
              {aiResponse.answer}
            </div>
            {aiResponse.keyPoints && (
              <div className="bg-[#fcfaf7] rounded-xl p-3 border border-[#ede9e1] space-y-1.5">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wide">
                  Key Observations
                </span>
                <ul className="text-xs space-y-1 text-[#334155]">
                  {aiResponse.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-2 border-t border-[#f1f0eb] flex flex-wrap items-center justify-between text-xs text-[#64748b]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#475569]">Sources:</span>
                {aiResponse.sources.join(" · ")}
              </div>
              <Link
                href="/projects/HYD-2023-0881"
                className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800"
              >
                Inspect Flagged Project <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* OR EXPLORE BY Section */}
        <div className="pt-6 space-y-6">
          <div className="flex items-center gap-4 max-w-2xl mx-auto">
            <div className="flex-1 h-px bg-[#e5e3db]"></div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8b95a1]">
              Or Explore By
            </span>
            <div className="flex-1 h-px bg-[#e5e3db]"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 max-w-3xl mx-auto">
            {EXPLORE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group bg-white hover:bg-[#faf9f5] border border-[#e5e3db] rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 shadow-card hover:shadow-soft transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cat.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[#2d3339] group-hover:text-[#1c2024]">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="max-w-2xl mx-auto text-left pt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Recent Activity
            </span>
            <Link
              href="/projects"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Link
            href="/projects?district=Hyderabad"
            className="group flex items-center justify-between bg-white border border-[#e4e2da] rounded-2xl p-4 shadow-card hover:shadow-soft hover:border-amber-300 transition-all duration-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f5f4ee] flex items-center justify-center text-[#64748b] group-hover:text-amber-700 transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1c2024] group-hover:text-amber-800 transition-colors">
                  Hyderabad, Telangana
                </div>
                <div className="text-xs text-[#717a84]">
                  284 projects · Last viewed 2 hours ago
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                14 Flagged
              </span>
              <ChevronRight className="w-4 h-4 text-[#8b95a1] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Decorative Bottom Aesthetic Waves & Civic Badge */}
      <div className="relative w-full pt-8 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8b95a1] border-t border-[#eeece6]/60">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#475569]">NAZAR Platform</span>
          <span>·</span>
          <span>Open Public Intelligence</span>
        </div>

        {/* Elegant Motto */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-[#64748b] mt-2 sm:mt-0">
          <span>— People · Projects · Progress</span>
        </div>
      </div>
    </div>
  );
}
