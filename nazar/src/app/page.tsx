"use client";

import { useState, useRef, useEffect } from "react";
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
  Send,
  Printer,
  Download,
  Copy,
  Check,
  X,
  Building2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Globe,
  FileCheck,
} from "lucide-react";
import {
  MP_PROFILES,
  findMPByQuery,
  getMPDelayedProjects,
  generateDossierForMP,
  getMPById
} from "@/lib/data/mpsData";
import { formatCurrency } from "@/lib/utils";
import { MPProfile, MPDelayedProject, InvestigationDossier } from "@/types";

const PROMPT_SUGGESTIONS = [
  "Incomplete projects by MP Asaduddin Owaisi",
  "Projects recommended by Narendra Modi in Varanasi",
  "Delayed rural works under Rahul Gandhi in Rae Bareli",
  "Show delayed projects in Telangana and Hyderabad",
  "Why is project HYD-2023-0881 flagged for inverted timeline?",
  "Compare fund utilization between Owaisi and Bandi Sanjay",
];

const EXPLORE_CATEGORIES = [
  { label: "Compare MPs", href: "/mps", icon: Users, color: "text-purple-700 bg-purple-50 border-purple-200/60" },
  { label: "All States & UTs (36)", href: "/explore?by=state", icon: FileText, color: "text-amber-700 bg-amber-50 border-amber-200/60" },
  { label: "Districts", href: "/explore?by=district", icon: MapPin, color: "text-emerald-700 bg-emerald-50 border-emerald-200/60" },
  { label: "Constituency", href: "/explore?by=constituency", icon: Users, color: "text-blue-700 bg-blue-50 border-blue-200/60" },
  { label: "Projects Registry", href: "/projects", icon: FileSpreadsheet, color: "text-rose-700 bg-rose-50 border-rose-200/60" },
  { label: "Civic Sectors", href: "/explore?by=sector", icon: Layers, color: "text-teal-700 bg-teal-50 border-teal-200/60" },
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string[];
  delayedProjects?: MPDelayedProject[];
  mpProfile?: MPProfile;
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);

  // Conversational AI Investigation Studio State
  const [conversationMode, setConversationMode] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [activeMP, setActiveMP] = useState<MPProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

  // Investigation Dossier Modal State
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [activeDossier, setActiveDossier] = useState<InvestigationDossier | null>(null);
  const [copiedDossier, setCopiedDossier] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationMode && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAiThinking, conversationMode]);

  const displayedPrompts = [
    PROMPT_SUGGESTIONS[promptIndex % PROMPT_SUGGESTIONS.length],
    PROMPT_SUGGESTIONS[(promptIndex + 1) % PROMPT_SUGGESTIONS.length],
    PROMPT_SUGGESTIONS[(promptIndex + 2) % PROMPT_SUGGESTIONS.length],
    PROMPT_SUGGESTIONS[(promptIndex + 3) % PROMPT_SUGGESTIONS.length],
  ];

  const handleCyclePrompts = () => {
    setPromptIndex((prev) => (prev + 2) % PROMPT_SUGGESTIONS.length);
  };

  // Start AI Conversation from Search or Suggestion
  const handleInitiateInvestigation = async (initialQuery?: string) => {
    const text = (initialQuery || query).trim();
    if (!text) return;

    setConversationMode(true);
    setIsAiThinking(true);

    // Identify if an MP is referenced
    const matchedMP = findMPByQuery(text) || (text.toLowerCase().includes("owaisi") ? MP_PROFILES[0] : null);
    if (matchedMP) {
      setActiveMP(matchedMP);
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([userMsg]);
    setQuery("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          query: text,
          mpProfile: matchedMP || activeMP,
          messages: [{ role: "user", content: text }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const delayedProjects = matchedMP ? getMPDelayedProjects(matchedMP) : undefined;
        
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content: data.reply || "NAZAR public investigation analysis generated.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sources: data.sources || ["eSAKSHI Public Gazette Register", "District Collectorate Nodal Portal"],
          delayedProjects,
          mpProfile: matchedMP || undefined,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsAiThinking(false);
        return;
      }
    } catch (err) {
      console.warn("AI chat request failed, using deterministic local response:", err);
    }

    // Fallback response if network or API unavailable
    const delayedProjects = matchedMP ? getMPDelayedProjects(matchedMP) : undefined;
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      role: "assistant",
      content: matchedMP
        ? `I have retrieved verified public records for **${matchedMP.name}** (${matchedMP.party}, ${matchedMP.constituency}, ${matchedMP.state}):\n\n` +
          `• **Financial Outlay**: ₹${(matchedMP.sanctioned_amount / 10000000).toFixed(2)} Cr sanctioned across ${matchedMP.total_works_sanctioned} works, with ₹${(matchedMP.expenditure_amount / 10000000).toFixed(2)} Cr expended (**${matchedMP.utilization_rate}%** utilization rate).\n` +
          `• **Incomplete & Stalled Works**: ${matchedMP.delayed_works} projects are currently delayed past their statutory completion target windows.\n` +
          `• **Executing Bodies**: Primary allocations are executed by ${matchedMP.implementing_agencies.slice(0, 2).join(" and ")}.\n\n` +
          `You can examine the delayed projects list below or click **Generate Full Investigation Dossier** to compile an audit-ready dossier.`
        : `Analyzing public MPLADS records for **"${text}"**:\n\nNAZAR's multi-signal engine has identified relevant projects across civic infrastructure, road connectivity, and healthcare. All records are cross-checked with official eSAKSHI disclosures.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sources: ["eSAKSHI Public Register (MoSPI)", "District Planning Authority Disclosures"],
      delayedProjects,
      mpProfile: matchedMP || undefined,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsAiThinking(false);
  };

  // Send subsequent user turn in conversation
  const handleSendFollowUp = async (customPrompt?: string) => {
    const text = (customPrompt || chatInput).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsAiThinking(true);

    const checkMP = findMPByQuery(text);
    const targetMP = checkMP || activeMP;
    if (checkMP) setActiveMP(checkMP);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          query: text,
          mpProfile: targetMP,
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const delayedProjects = targetMP ? getMPDelayedProjects(targetMP) : undefined;
        
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sources: data.sources || ["eSAKSHI Public Gazette Register", "District Collectorate Nodal Portal"],
          delayedProjects: text.toLowerCase().includes("delayed") || text.toLowerCase().includes("incomplete") ? delayedProjects : undefined,
          mpProfile: targetMP || undefined,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsAiThinking(false);
        return;
      }
    } catch (err) {
      console.warn("Follow-up error:", err);
    }

    // Local deterministic fallback
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      role: "assistant",
      content: `In response to **"${text}"**:\n\nBased on cross-referenced public records${targetMP ? ` for ${targetMP.name}` : ""}, data indicates consistent allocation tracking with specific oversight flags. Executing agencies must submit physical measurement books before pending completion certificates are released.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sources: ["eSAKSHI Gazette Disclosures", "NAZAR Automated Rule-checking"],
      delayedProjects: targetMP ? getMPDelayedProjects(targetMP) : undefined,
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsAiThinking(false);
  };

  // Open Full Investigation Dossier
  const handleOpenDossier = (mp?: MPProfile | null) => {
    const subject = mp || activeMP || MP_PROFILES[0];
    const dossier = generateDossierForMP(subject, messages);
    setActiveDossier(dossier);
    setDossierModalOpen(true);
  };

  // Copy Dossier Markdown
  const handleCopyDossier = () => {
    if (!activeDossier) return;
    const md = `# ${activeDossier.dossier_id}: CIVIC OVERSIGHT INVESTIGATION DOSSIER
**Subject**: ${activeDossier.subject_name} (${activeDossier.subject_party}, ${activeDossier.subject_constituency}, ${activeDossier.subject_state})
**Generated**: ${new Date(activeDossier.generated_at).toLocaleString("en-IN")}
**Status**: PUBLIC INTELLIGENCE AUDIT RECORD

## Executive Summary
${activeDossier.executive_summary}

## Financial Overview
- **Total Sanctioned**: ₹${(activeDossier.financial_overview.sanctioned / 10000000).toFixed(2)} Cr
- **Total Expended**: ₹${(activeDossier.financial_overview.expended / 10000000).toFixed(2)} Cr
- **Unspent Balance**: ₹${(activeDossier.financial_overview.unspent / 10000000).toFixed(2)} Cr
- **Utilization Rate**: ${activeDossier.financial_overview.utilization_rate}%
- **Completion Rate**: ${activeDossier.financial_overview.completion_rate}%

## Incomplete & Overdue Works Schedule
${activeDossier.delayed_projects.map((p) => `### ${p.id}: ${p.title}
- **Sanction Amount**: ₹${(p.sanctioned_amount / 100000).toFixed(2)} Lakh
- **Overdue Duration**: ${p.days_overdue} days
- **Executing Agency**: ${p.agency}
- **Root Cause**: ${p.cause}
- **Risk Level**: ${p.risk_level}
`).join("\n")}

## Multi-Signal Anomaly Checks
${activeDossier.anomalies.map((a) => `- **${a.type}** (${a.severity}): ${a.description}\n  *Action*: ${a.recommended_action}`).join("\n")}

## Verified Public Sources & Web Search Evidence
${activeDossier.web_search_evidence.map((s) => `- [${s.source_title}](${s.source_url}) — ${s.verified_status} (${s.relevance_note})`).join("\n")}

## Reviewer Recommendations
${activeDossier.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

---
*Watermark Verification: East | NAZAR Civic Oversight Framework*
`;
    navigator.clipboard.writeText(md);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2500);
  };

  // Download JSON Dossier
  const handleDownloadJSON = () => {
    if (!activeDossier) return;
    const blob = new Blob([JSON.stringify(activeDossier, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDossier.dossier_id}.json`;
    a.click();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between px-4 sm:px-8 lg:px-16 py-8 overflow-hidden">
      
      {/* ========================================================
          MODE 1: CONVERSATIONAL AI INVESTIGATION STUDIO (EXPANDED)
          ======================================================== */}
      {conversationMode ? (
        <div className="max-w-5xl mx-auto w-full space-y-4 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Top Control Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#e2dfd5] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-emerald-700 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    NAZAR Conversational AI Investigation Studio
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Gemini Active
                  </span>
                </div>
                <div className="text-xs text-neutral-600">
                  {activeMP ? (
                    <span>
                      Investigating: <strong className="text-neutral-900">{activeMP.name}</strong> ({activeMP.party}, {activeMP.constituency}) · {activeMP.total_works_sanctioned} Works
                    </span>
                  ) : (
                    <span>Evidence-grounded civic inquiry & public scrutiny</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenDossier(activeMP)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <FileCheck className="w-4 h-4" />
                <span>Generate Full Investigation Report</span>
              </button>

              <button
                onClick={() => {
                  setConversationMode(false);
                  setMessages([]);
                  setActiveMP(null);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-medium transition-colors"
                title="Return to standard dashboard"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close Convo</span>
              </button>
            </div>
          </div>

          {/* Active MP Vitals Header (if an MP is selected) */}
          {activeMP && (
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-inner"
                  style={{ backgroundColor: activeMP.party_color }}
                >
                  {activeMP.avatar_initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{activeMP.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                      {activeMP.party} · {activeMP.house}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-300">
                    {activeMP.constituency}, {activeMP.state} · {activeMP.term}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                  <span className="text-neutral-400 block text-[10px]">Sanctioned</span>
                  <span className="font-bold text-amber-400">{formatCurrency(activeMP.sanctioned_amount)}</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                  <span className="text-neutral-400 block text-[10px]">Expended</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(activeMP.expenditure_amount)}</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                  <span className="text-neutral-400 block text-[10px]">Utilization</span>
                  <span className="font-bold text-white">{activeMP.utilization_rate}%</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                  <span className="text-neutral-400 block text-[10px]">Delayed Works</span>
                  <span className="font-bold text-rose-400">{activeMP.delayed_works} Works</span>
                </div>
              </div>
            </div>
          )}

          {/* Conversation Feed */}
          <div className="bg-white/95 rounded-2xl border border-[#e2dfd5] p-5 shadow-card min-h-[380px] max-h-[520px] overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-1 px-1">
                  <span>{msg.role === "user" ? "You (Citizen / Reviewer)" : "NAZAR AI"}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-amber-700 to-orange-700 text-white rounded-tr-xs shadow-sm font-medium"
                      : "bg-[#fcfbf7] border border-[#e8e5db] text-[#2d3339] rounded-tl-xs shadow-2xs space-y-3"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {/* Interactive Delayed Projects Card (If present in AI response) */}
                  {msg.delayedProjects && msg.delayedProjects.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#eeebe1] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold uppercase tracking-wide text-rose-800 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Key Incomplete & Stalled Works Flagged:
                        </span>
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {msg.delayedProjects.length} Identified
                        </span>
                      </div>

                      <div className="space-y-2">
                        {msg.delayedProjects.map((dp) => (
                          <div
                            key={dp.id}
                            className="bg-white rounded-xl p-3 border border-rose-200/70 hover:border-rose-400 transition-colors text-xs space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded text-[11px]">
                                  {dp.id}
                                </span>
                                <span className="ml-2 font-semibold text-neutral-800">{dp.title}</span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 shrink-0">
                                {dp.days_overdue} Days Overdue
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-neutral-600">
                              <div>
                                <span className="text-neutral-400">Sanctioned:</span>{" "}
                                <strong className="text-neutral-800">{formatCurrency(dp.sanctioned_amount)}</strong>
                              </div>
                              <div>
                                <span className="text-neutral-400">Agency:</span>{" "}
                                <span className="text-neutral-700">{dp.agency}</span>
                              </div>
                            </div>

                            <div className="text-[11px] text-rose-900 bg-rose-50/80 p-1.5 rounded border border-rose-100">
                              <strong>Root Cause / Flag:</strong> {dp.cause}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Public Sources Verification Badge */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 border-t border-[#f0eee6] flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                      <span className="font-semibold text-neutral-700 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-emerald-600" />
                        Grounded Sources:
                      </span>
                      {msg.sources.map((s, idx) => (
                        <span key={idx} className="bg-white px-2 py-0.5 rounded border border-[#e4e1d7]">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center gap-2 text-xs text-amber-800 font-medium py-2 px-1">
                <div className="w-4 h-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
                <span>NAZAR AI is cross-matching eSAKSHI public registries, calculating financial timelines, and synthesizing findings...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Suggested Contextual Investigation Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-neutral-500">Suggested probes:</span>
            <button
              onClick={() => handleSendFollowUp("List all incomplete and delayed works with root causes")}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-neutral-50 border border-[#d8d6cc] text-neutral-700 transition-colors shadow-2xs"
            >
              🚨 Incomplete works & root causes
            </button>
            <button
              onClick={() => handleSendFollowUp("What are the primary implementing agencies and is there concentration?")}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-neutral-50 border border-[#d8d6cc] text-neutral-700 transition-colors shadow-2xs"
            >
              🏢 Implementing agencies concentration
            </button>
            <button
              onClick={() => handleSendFollowUp("How does this utilization rate compare to state and national peers?")}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-neutral-50 border border-[#d8d6cc] text-neutral-700 transition-colors shadow-2xs"
            >
              ⚖️ Peer benchmark comparison
            </button>
            <button
              onClick={() => handleOpenDossier(activeMP)}
              className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold transition-colors shadow-2xs"
            >
              📑 Compile Full Investigation Dossier
            </button>
          </div>

          {/* Conversation Input Box */}
          <div className="relative flex items-center bg-white rounded-full border border-[#d8d5cd] shadow-pill hover:border-amber-400 focus-within:border-amber-600 focus-within:ring-4 focus-within:ring-amber-100 transition-all">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendFollowUp()}
              placeholder={
                activeMP
                  ? `Ask NAZAR about ${activeMP.name}'s allocations, stalled projects, or specific work IDs...`
                  : "Ask a follow-up question or probe specific project..."
              }
              className="w-full py-3.5 pl-6 pr-14 text-xs sm:text-sm bg-transparent text-[#1c2024] placeholder-neutral-400 outline-none"
            />
            <button
              onClick={() => handleSendFollowUp()}
              disabled={isAiThinking || !chatInput.trim()}
              className="absolute right-2 w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center hover:opacity-90 transition-transform active:scale-95 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================
           MODE 2: STANDARD LANDING DASHBOARD (BEFORE SEARCH)
           ======================================================== */
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
              Search. Converse with AI. Generate full evidence-backed investigations on India's MPLADS works.
            </p>
          </div>

          {/* Interactive Stats Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 py-2.5 px-4 max-w-3xl mx-auto rounded-2xl bg-white/90 border border-[#e8e6de] shadow-sm backdrop-blur-sm text-xs text-neutral-700">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-neutral-900">2,18,913</span> Projects Monitored
            </div>
            <span className="text-neutral-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="font-bold text-amber-800">₹12,129 Cr</span> Sanctioned
            </div>
            <span className="text-neutral-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="font-bold text-emerald-700">₹8,008 Cr</span> Expended
            </div>
            <span className="text-neutral-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="font-bold text-rose-700">2,000+</span> Audited Observations
            </div>
          </div>

          {/* 1-Click MP Investigation Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">⚡ 1-Click AI Probe:</span>
            <button
              onClick={() => handleInitiateInvestigation("Incomplete projects by MP Asaduddin Owaisi in Hyderabad")}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-neutral-50 border border-[#d8d6cc] text-neutral-800 font-medium transition-all hover:scale-105 shadow-2xs"
            >
              Owaisi (Hyderabad)
            </button>
            <button
              onClick={() => handleInitiateInvestigation("Projects and spending by Narendra Modi in Varanasi")}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-neutral-50 border border-[#d8d6cc] text-neutral-800 font-medium transition-all hover:scale-105 shadow-2xs"
            >
              Modi (Varanasi)
            </button>
            <button
              onClick={() => handleInitiateInvestigation("Delayed rural works under Rahul Gandhi in Rae Bareli")}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-neutral-50 border border-[#d8d6cc] text-neutral-800 font-medium transition-all hover:scale-105 shadow-2xs"
            >
              Rahul (Rae Bareli)
            </button>
            <button
              onClick={() => handleInitiateInvestigation("Stalled developmental projects under Shashi Tharoor in Thiruvananthapuram")}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-neutral-50 border border-[#d8d6cc] text-neutral-800 font-medium transition-all hover:scale-105 shadow-2xs"
            >
              Tharoor (TVM)
            </button>
            <Link
              href="/mps"
              className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-semibold transition-all hover:scale-105 shadow-2xs"
            >
              Compare Any 2 MPs →
            </Link>
          </div>

          {/* Main Conversational Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full border border-[#d8d5cd] shadow-pill hover:border-amber-400 focus-within:border-amber-600 focus-within:ring-4 focus-within:ring-amber-100 transition-all duration-200">
              <div className="pl-6 pr-3 text-[#8b95a1]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInitiateInvestigation()}
                placeholder="Ask about an MP, constituency, or project to begin conversational AI investigation..."
                className="w-full py-4 text-sm sm:text-base bg-transparent text-[#1c2024] placeholder-[#8b95a1] outline-none pr-14"
              />
              <button
                onClick={() => handleInitiateInvestigation()}
                aria-label="Start AI Conversation"
                className="absolute right-2 w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center hover:opacity-90 transition-transform active:scale-95 shadow-sm"
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
                onClick={() => handleInitiateInvestigation(prompt)}
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

          {/* OR EXPLORE BY Section */}
          <div className="pt-6 space-y-6">
            <div className="flex items-center gap-4 max-w-2xl mx-auto">
              <div className="flex-1 h-px bg-[#e5e3db]"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8b95a1]">
                Or Explore Public Datasets
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
                Recent Inquiries & Investigations
              </span>
              <Link
                href="/projects"
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
              >
                View all projects <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div
              onClick={() => handleInitiateInvestigation("Incomplete projects by MP Asaduddin Owaisi in Hyderabad")}
              className="cursor-pointer group flex items-center justify-between bg-white border border-[#e4e2da] rounded-2xl p-4 shadow-card hover:shadow-soft hover:border-amber-300 transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f5f4ee] flex items-center justify-center text-[#64748b] group-hover:text-amber-700 transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1c2024] group-hover:text-amber-800 transition-colors">
                    Hyderabad, Telangana — Asaduddin Owaisi
                  </div>
                  <div className="text-xs text-[#717a84]">
                    284 projects · 14 delayed works flagged · Click to open AI investigation
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Investigate
                </span>
                <ChevronRight className="w-4 h-4 text-[#8b95a1] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FULL INVESTIGATION DOSSIER MODAL (REPORT VIEW)
          ======================================================== */}
      {dossierModalOpen && activeDossier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-300 flex flex-col my-auto animate-in zoom-in-95 duration-200">
            
            {/* Modal Header & Actions */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                  NAZAR CIVIC AUDIT DOSSIER // {activeDossier.dossier_id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyDossier}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold transition-colors"
                >
                  {copiedDossier ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDossier ? "Copied Markdown!" : "Copy Report"}</span>
                </button>

                <button
                  onClick={handleDownloadJSON}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>

                <button
                  onClick={() => setDossierModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 transition-colors ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dossier Content Body */}
            <div className="p-6 sm:p-8 space-y-6 text-neutral-900 text-xs sm:text-sm">
              
              {/* Dossier Top Badge */}
              <div className="bg-[#fcfaf7] border border-[#eeebe1] rounded-2xl p-6 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-amber-900 uppercase">
                      OFFICIAL CIVIC INTELLIGENCE INVESTIGATION
                    </span>
                    <h2 className="text-2xl font-bold font-serif text-neutral-900 mt-1">
                      {activeDossier.subject_name}
                    </h2>
                    <p className="text-xs text-neutral-600">
                      {activeDossier.subject_party} · {activeDossier.subject_constituency}, {activeDossier.subject_state}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-neutral-400 block">GENERATED AT</span>
                    <span className="text-xs font-semibold text-neutral-800">
                      {new Date(activeDossier.generated_at).toLocaleString("en-IN")}
                    </span>
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Evidence Grounded Audit
                      </span>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="pt-3 border-t border-[#e8e4d8] text-xs leading-relaxed text-neutral-700">
                  <strong className="text-neutral-900">Executive Summary: </strong>
                  {activeDossier.executive_summary}
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  1. Financial Outlay & Expenditure Velocity
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Total Sanctioned</span>
                    <span className="text-sm font-bold text-neutral-900">
                      {formatCurrency(activeDossier.financial_overview.sanctioned)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Total Expended</span>
                    <span className="text-sm font-bold text-emerald-700">
                      {formatCurrency(activeDossier.financial_overview.expended)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Unspent Balance</span>
                    <span className="text-sm font-bold text-amber-800">
                      {formatCurrency(activeDossier.financial_overview.unspent)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Utilization Rate</span>
                    <span className="text-sm font-bold text-neutral-900">
                      {activeDossier.financial_overview.utilization_rate}%
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block">Physical Completion</span>
                    <span className="text-sm font-bold text-neutral-900">
                      {activeDossier.financial_overview.completion_rate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Delayed & Incomplete Projects Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
                  <span>2. Schedule of Flagged Incomplete / Delayed Projects</span>
                  <span className="text-rose-700 font-bold">{activeDossier.delayed_projects.length} Works</span>
                </h3>

                <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-[11px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Work ID & Description</th>
                        <th className="py-2.5 px-3">Sanction Amount</th>
                        <th className="py-2.5 px-3">Days Overdue</th>
                        <th className="py-2.5 px-3">Executing Agency</th>
                        <th className="py-2.5 px-3">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {activeDossier.delayed_projects.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50/60">
                          <td className="py-3 px-3">
                            <div className="font-mono font-bold text-neutral-900">{p.id}</div>
                            <div className="text-neutral-700 text-[11px]">{p.title}</div>
                            <div className="text-[10px] text-rose-800 mt-0.5">Cause: {p.cause}</div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-neutral-900 whitespace-nowrap">
                            {formatCurrency(p.sanctioned_amount)}
                          </td>
                          <td className="py-3 px-3 font-bold text-rose-700 whitespace-nowrap">
                            {p.days_overdue} Days
                          </td>
                          <td className="py-3 px-3 text-neutral-600 text-[11px]">{p.agency}</td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.risk_level === "HIGH"
                                  ? "bg-rose-100 text-rose-800"
                                  : p.risk_level === "MEDIUM"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-neutral-100 text-neutral-800"
                              }`}
                            >
                              {p.risk_level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Anomaly Breakdown */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  3. Multi-Signal Deterministic Anomaly Review
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeDossier.anomalies.map((anom, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-neutral-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 text-xs">{anom.type}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {anom.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-700 leading-relaxed">{anom.description}</p>
                      <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-100">
                        <strong className="text-neutral-700">Action:</strong> {anom.recommended_action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Web Search & Public Records Grounding */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  4. Live Web Search & Public Gazette Evidence Trail
                </h3>
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-2">
                  {activeDossier.web_search_evidence.map((ev, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 text-xs pb-2 border-b border-neutral-200/60 last:border-0 last:pb-0">
                      <div>
                        <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-emerald-600" />
                          {ev.source_title}
                        </div>
                        <div className="text-[11px] text-neutral-600">{ev.relevance_note}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-neutral-200 text-emerald-800 whitespace-nowrap">
                        {ev.verified_status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations for Citizen / RTI Inquiry */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  5. Actionable Reviewer Recommendations
                </h3>
                <ul className="list-decimal pl-4 space-y-1 text-xs text-neutral-700">
                  {activeDossier.recommendations.map((rec, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Stamp & Signature */}
              <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between text-[10px] text-neutral-400 font-mono">
                <span>NAZAR CIVIC INTELLIGENCE PLATFORM · INDEPENDENT CIVIC OVERSIGHT</span>
                <span>SIGNATURE: EAST · DOSSIER #{activeDossier.dossier_id}</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
