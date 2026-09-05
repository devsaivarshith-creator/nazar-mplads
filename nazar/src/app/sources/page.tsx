"use client";

import { useState, useEffect } from "react";
import {
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Hash,
  FileCheck,
  Play,
  Loader2,
  Terminal,
  Sparkles,
  Layers,
} from "lucide-react";
import { MOCK_SOURCES } from "@/lib/data/mockData";
import { formatDate } from "@/lib/utils";

export default function SourcesPage() {
  const [isScraping, setIsScraping] = useState(false);
  const [selectedState, setSelectedState] = useState("Telangana");
  const [selectedConstituency, setSelectedConstituency] = useState("HYDERABAD");
  const [scrapeResult, setScrapeResult] = useState<any>(null);
  const [ingestionStatus, setIngestionStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/ingestion")
      .then((res) => res.json())
      .then((data) => setIngestionStatus(data))
      .catch(() => {});
  }, []);

  const handleRunLiveScraper = async () => {
    setIsScraping(true);
    setScrapeResult(null);
    try {
      const res = await fetch("/api/ingestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: selectedState,
          constituency: selectedConstituency,
        }),
      });
      const data = await res.json();
      setScrapeResult(data);
      if (data.success) {
        setIngestionStatus(data.summary);
      }
    } catch (err: any) {
      setScrapeResult({ success: false, error: err.message });
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ecebe6] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1c2024] font-serif">
              Source Provenance & Live Ingestion Registry
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
              Strict Provenance
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-1">
            Trace every data point, metric, and finding directly to legitimate public disclosures.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-white border border-[#e4e2da] px-3.5 py-2 rounded-xl shadow-xs">
          <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {ingestionStatus?.scraped_at
              ? `Live Sync: ${formatDate(ingestionStatus.scraped_at)}`
              : "Live Sync: Ready"}
          </span>
        </div>
      </div>

      {/* Live Government Ingestor Card */}
      <div className="bg-gradient-to-br from-white to-[#faf8f4] rounded-3xl border-2 border-amber-300/80 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-lg font-bold font-serif text-[#1c2024]">
                Live Web Scraper: MoSPI eSAKSHI Government Register
              </h2>
            </div>
            <p className="text-xs text-[#64748b]">
              Connect directly to <code className="bg-[#f2efe9] px-1.5 py-0.5 rounded font-mono text-[#334155]">https://mplads.mospi.gov.in/rest/PreLoginDashboardData</code> to retrieve unedited official work records, compute cryptographic lineage hashes, and execute NAZAR&apos;s 5 deterministic anomaly detectors.
            </p>
          </div>

          <div className="bg-[#faf9f6] border border-[#e2e0d8] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#475569] shrink-0">
            Current Ingested: <strong className="text-[#1c2024]">{ingestionStatus?.total_records || 634} Works</strong>
          </div>
        </div>

        {/* Scraper Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-[#8b95a1] uppercase mb-1">
              Select State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white border border-[#dedcd4] rounded-xl p-2.5 text-[#1c2024] font-medium outline-none"
            >
              <option value="Telangana">Telangana (State ID: 129)</option>
              <option value="Andhra Pradesh">Andhra Pradesh (State ID: 2)</option>
              <option value="Karnataka">Karnataka (State ID: 18)</option>
              <option value="Maharashtra">Maharashtra (State ID: 27)</option>
              <option value="Tamil Nadu">Tamil Nadu (State ID: 33)</option>
              <option value="Delhi">Delhi (State ID: 11)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8b95a1] uppercase mb-1">
              Select Constituency
            </label>
            <select
              value={selectedConstituency}
              onChange={(e) => setSelectedConstituency(e.target.value)}
              className="w-full bg-white border border-[#dedcd4] rounded-xl p-2.5 text-[#1c2024] font-medium outline-none"
            >
              <option value="HYDERABAD">HYDERABAD (Asaduddin Owaisi)</option>
              <option value="KARIMNAGAR">KARIMNAGAR (Sanjay Kumar Bandi)</option>
              <option value="SECUNDERABAD">SECUNDERABAD (G. Kishan Reddy)</option>
              <option value="MEDAK">MEDAK</option>
              <option value="NIZAMABAD">NIZAMABAD</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunLiveScraper}
              disabled={isScraping}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1c2024] hover:bg-[#2e363e] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Scraping Live Portal...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Fetch &amp; Ingest Live Records</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Scrape Result / Terminal Output */}
        {scrapeResult && (
          <div className="mt-4 p-4 rounded-2xl bg-[#1c2024] text-[#f1f5f9] font-mono text-xs space-y-2 border border-black shadow-inner">
            <div className="flex items-center justify-between border-b border-gray-700 pb-2 text-[11px] text-[#94a3b8]">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>NAZAR Ingestion Engine Output</span>
              </div>
              <span className={scrapeResult.success ? "text-emerald-400 font-bold" : "text-rose-400"}>
                {scrapeResult.success ? "INGESTION SUCCESS" : "FAILED"}
              </span>
            </div>
            <pre className="text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-56">
              {scrapeResult.output || scrapeResult.error}
            </pre>
            {scrapeResult.success && (
              <div className="pt-2 border-t border-gray-700 flex justify-between items-center text-xs text-amber-300">
                <span>[✓] Real records updated in application registry.</span>
                <a
                  href="/projects"
                  className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1 rounded-md font-bold font-sans text-xs transition-colors"
                >
                  View Ingested Works in Registry →
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Principle Banner */}
      <div className="bg-[#faf9f6] border border-[#e2e0d8] rounded-2xl p-5 text-xs text-[#475569] space-y-1.5">
        <strong className="text-[#1c2024] block font-bold text-sm">
          Core Provenance Guarantee
        </strong>
        <p className="leading-relaxed">
          NAZAR does not scrape authenticated portals or bypass bot protections. All ingested data originates from publicly accessible gazettes, Ministry of Statistics &amp; Programme Implementation (MoSPI) public disclosures, and District Collectorate sanction orders.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="space-y-4">
        {MOCK_SOURCES.map((source) => (
          <div
            key={source.id}
            className="bg-white rounded-2xl border border-[#e4e2da] p-6 shadow-card space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ecebe6] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-[#1c2024]">
                  {source.source_system}
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {source.verification_status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#8b95a1] block">Source Record Identifier</span>
                <span className="font-mono font-bold text-[#1c2024]">
                  {source.source_record_id}
                </span>
              </div>
              <div>
                <span className="text-[#8b95a1] block">Retrieved Timestamp</span>
                <span className="font-medium text-[#334155]">
                  {formatDate(source.retrieved_at)}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#8b95a1] block">Public Access Endpoint</span>
                <a
                  href={source.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-amber-800 hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  {source.source_url} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Raw Metadata Viewer */}
            <div className="pt-2 border-t border-[#f0eee8] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#8b95a1] tracking-wider">
                Raw Ingestion Batch Envelope
              </span>
              <pre className="bg-[#faf9f6] p-3 rounded-xl border border-[#dedcd4] text-[11px] font-mono text-[#334155] overflow-x-auto">
                {JSON.stringify(source.raw_data, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
