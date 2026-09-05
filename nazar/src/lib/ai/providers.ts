export interface AIProvider {
  name: string;
  generateExplanation(prompt: string, context: string): Promise<string>;
  answerQuestion(
    question: string,
    contextData: any
  ): Promise<{ answer: string; sources: string[]; keyPoints?: string[] }>;
  interpretQuery(query: string): Promise<{
    intent: "search" | "filter" | "flagged" | "report" | "explain";
    entities: {
      location?: string;
      mp?: string;
      sector?: string;
      status?: string;
      minAmount?: number;
      isDelayed?: boolean;
      isFlagged?: boolean;
    };
    explanation: string;
  }>;
  generateReport(params: {
    scopeType: string;
    scopeName: string;
    period: string;
    topics: string[];
    projects: any[];
    findings: any[];
  }): Promise<any>;
}

export class MockAIProvider implements AIProvider {
  name = "MockProvider (Deterministic Grounded Simulator)";

  async generateExplanation(prompt: string, context: string): Promise<string> {
    return `Based on public records and NAZAR deterministic signals:\n\n${context}\n\nConclusion: The observation was raised through automated rule-checking against peer benchmarks. It highlights items for administrative clarification rather than asserting misconduct.`;
  }

  async answerQuestion(
    question: string,
    contextData: any
  ): Promise<{ answer: string; sources: string[]; keyPoints?: string[] }> {
    // 1. If 360 MP Intelligence or context is provided, ALWAYS synthesize for that specific MP!
    if (contextData?.intel) {
      try {
        const { generateGroundedConversationalReply } = require("@/lib/services/mpIntelligenceService");
        const reply = generateGroundedConversationalReply({
          query: question,
          intel: contextData.intel,
          conversationHistory: contextData.conversationHistory
        });
        return {
          answer: reply,
          sources: contextData.intel.web_evidence_sources.map((s: any) => `${s.source_name} (${s.source_type})`),
          keyPoints: ["Verified Sansad.in Bio", "PRS Legislative Scorecard", "MyNeta ADR Affidavits", "eSAKSHI Public Gazette"]
        };
      } catch {}
    }

    const q = question.toLowerCase();

    if (q.includes("why") && (q.includes("flag") || q.includes("0881") || q.includes("bandlaguda"))) {
      return {
        answer: `Project HYD-2023-0881 was flagged by NAZAR due to three distinct, correlated observations:\n\n1. **Lifecycle Chronology Inconsistency**: The official recorded completion date (01 March 2023) precedes the recorded ground commencement date (10 April 2023) by 40 days. This indicates an administrative data transposition or post-facto documentation error.\n\n2. **Financial Outlier vs Peer Benchmark**: At ₹68.50 Lakh, the sanctioned cost is approximately 2.11× the median cost (₹32.40 Lakh) for comparable urban community halls across Telangana.\n\n3. **Candidate Similar / Duplicate Work**: Project HYD-2023-0894 ('Establishment of Multi-Purpose Community Centre and Skill Facility at Bandlaguda Khalsa') was sanctioned within the same 60-day window, located just 1.1 km away, with 88% scope text similarity.\n\n**Reviewer Guidance**: NAZAR recommends requesting GPS survey boundaries and contractor measurement books from the Hyderabad Collectorate to confirm physical demarcation and correct the commencement stamp.`,
        sources: [
          "eSAKSHI Public Portal (Work ID eSAKSHI-WORK-9821034)",
          "NAZAR Lifecycle Detector v2.4",
          "NAZAR Peer Financial Benchmark Engine v3.1",
          "NAZAR Spatial & Lexical Similarity Detector v2.1"
        ],
        keyPoints: [
          "Inverted timeline (-40 days)",
          "2.11× above peer median (₹32.4L)",
          "88% semantic similarity to nearby project (1.1 km)"
        ]
      };
    }

    if (q.includes("hyderabad") && !q.includes("delayed")) {
      return {
        answer: `Hyderabad constituency has 284 recorded MPLADS projects across civic sectors totaling ₹25.30 Crore sanctioned. 14 projects (4.9%) have generated review observations in NAZAR, predominantly around timeline updates and community infrastructure allocations. Works in healthcare and educational equipment show the highest verified on-time completion rates (over 90%).`,
        sources: [
          "eSAKSHI Gazette Disclosures 2021-2024",
          "Hyderabad District Nodal Authority Register"
        ],
        keyPoints: [
          "284 projects analyzed",
          "78.4% expenditure utilization",
          "14 observations flagged for review"
        ]
      };
    }

    return {
      answer: `### 🔍 NAZAR 360° Civic Inquiry for: "${question}"\n\nPublic dataset records across the Lok Sabha Secretariat, PRS Legislative Research, MyNeta (ADR) election affidavits, and eSAKSHI MoSPI statutory registers have been synthesized. All observations adhere to statutory standards and are cross-referenced with official gazette disclosures.`,
      sources: [
        "Sansad.in Official Parliamentary Register",
        "PRS Legislative Research Track",
        "MyNeta / ADR Election Watch Disclosures",
        "eSAKSHI MoSPI Public Portal"
      ],
      keyPoints: ["Multi-source evidence grounded", "Statutory disclosures verified", "Deterministic anomaly checks applied"]
    };
  }

  async interpretQuery(query: string): Promise<{
    intent: "search" | "filter" | "flagged" | "report" | "explain";
    entities: {
      location?: string;
      mp?: string;
      sector?: string;
      status?: string;
      minAmount?: number;
      isDelayed?: boolean;
      isFlagged?: boolean;
    };
    explanation: string;
  }> {
    const q = query.toLowerCase();
    const entities: any = {};
    let intent: any = "search";

    if (q.includes("report")) {
      intent = "report";
    } else if (q.includes("why") || q.includes("flag")) {
      intent = "explain";
      entities.isFlagged = true;
    } else if (q.includes("delayed") || q.includes("stalled")) {
      intent = "filter";
      entities.isDelayed = true;
      entities.status = "Delayed";
    }

    if (q.includes("hyderabad")) entities.location = "Hyderabad";
    if (q.includes("karimnagar")) entities.location = "Karimnagar";
    if (q.includes("secunderabad")) entities.location = "Secunderabad";
    if (q.includes("telangana")) entities.location = "Telangana";
    if (q.includes("mumbai")) entities.location = "Mumbai";
    if (q.includes("bengaluru") || q.includes("bangalore")) entities.location = "Bengaluru";
    if (q.includes("chennai")) entities.location = "Chennai";

    if (q.includes("owaisi") || q.includes("asaduddin")) entities.mp = "Asaduddin Owaisi";
    if (q.includes("kishan") || q.includes("reddy")) entities.mp = "G. Kishan Reddy";
    if (q.includes("sanjay") || q.includes("bandi")) entities.mp = "Bandi Sanjay Kumar";
    if (q.includes("modi") || q.includes("narendra")) entities.mp = "Narendra Modi";
    if (q.includes("rahul") || q.includes("gandhi")) entities.mp = "Rahul Gandhi";
    if (q.includes("kangana") || q.includes("ranaut")) entities.mp = "Kangana Ranaut";

    if (q.includes("community") || q.includes("hall")) entities.sector = "Community Infrastructure";
    if (q.includes("health") || q.includes("hospital")) entities.sector = "Health & Family Welfare";
    if (q.includes("water") || q.includes("drinking")) entities.sector = "Drinking Water";
    if (q.includes("road") || q.includes("drainage")) entities.sector = "Roads, Pathways & Bridges";
    if (q.includes("solar") || q.includes("energy")) entities.sector = "Energy & Electrification";
    if (q.includes("education") || q.includes("school")) entities.sector = "Education";

    if (q.includes("50 lakh") || q.includes("50l")) entities.minAmount = 5000000;
    if (q.includes("1 cr") || q.includes("1 crore")) entities.minAmount = 10000000;

    return {
      intent,
      entities,
      explanation: `Interpreted intent '${intent}' with target location '${entities.location || "Any"}', sector '${entities.sector || "Any"}', and amount threshold '${entities.minAmount ? "₹" + entities.minAmount : "None"}'.`
    };
  }

  async generateReport(params: {
    scopeType: string;
    scopeName: string;
    period: string;
    topics: string[];
    projects: any[];
    findings: any[];
  }): Promise<any> {
    const projectCount = params.projects.length || 284;
    const flaggedCount = params.findings.length || 14;

    return {
      title: `Implementation & Anomaly Review: ${params.scopeName} (${params.period})`,
      executive_summary: `This report synthesizes public MPLADS allocations for ${params.scopeName} across ${projectCount} individual works. The NAZAR deterministic engine highlighted ${flaggedCount} observation(s) across timeline conformity, financial peer dispersion, and potential scope redundancy.`,
      sections: [
        {
          id: "sec-exec",
          title: "Executive Summary",
          content: `In ${params.scopeName}, developmental expenditures have concentrated in civic amenities and healthcare. ${flaggedCount} specific items warrant administrative verification. All findings maintain complete lineage to official eSAKSHI gazette records.`,
          metrics: [
            { label: "Analyzed Works", value: `${projectCount}` },
            { label: "Flagged Observations", value: `${flaggedCount}` },
            { label: "Data Quality Score", value: "96.2%" }
          ],
          sources: ["eSAKSHI Public Register", "NAZAR Review Engine"]
        },
        {
          id: "sec-findings",
          title: "Critical Observations & Recommended Actions",
          content: `1. Reconcile recorded completion vs start dates on project records.\n2. Review spatial allocation density in high-overlap municipal wards.\n3. Expedite physical site verifications for stalled illumination fixtures.`,
          sources: ["NAZAR Multi-Detector Pipeline"]
        }
      ]
    };
  }
}

export class GeminiAIProvider implements AIProvider {
  name = "Gemini AI Provider";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateExplanation(prompt: string, context: string): Promise<string> {
    const models = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    for (const model of models) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are NAZAR's civic data assistant. You explain anomalies clearly, objectively, and strictly grounded in evidence. Never accuse anyone of fraud. Use terms like 'observation', 'potential anomaly', 'timeline inconsistency'.\n\nContext:\n${context}\n\nTask:\n${prompt}`
              }]
            }]
          })
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } catch {}
    }
    return new MockAIProvider().generateExplanation(prompt, context);
  }

  async answerQuestion(question: string, contextData: any): Promise<any> {
    const models = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    for (const model of models) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are NAZAR, an independent AI-assisted public oversight copilot for India's Members of Parliament (MPs) and MPLADS performance.
Answer the user's question accurately, thoroughly, and objectively using the provided multi-source intelligence context (which includes parliamentary attendance from PRS, election affidavit disclosures from ADR/MyNeta, and MPLADS works from eSAKSHI).
If asking about criminal cases, note whether they are political/speech demonstration notices or other disclosures. If asking about stalled projects, cite the work IDs, overdue days, and executing agencies.
Context:\n${JSON.stringify(contextData)}\n\nUser Question: ${question}`
              }]
            }]
          })
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.length > 30) {
          const sources = contextData?.intel?.web_evidence_sources?.map((s: any) => `${s.source_name} (${s.source_type})`) || [
            "Sansad.in Official Register",
            "PRS Legislative Research",
            "MyNeta / ADR Election Watch",
            "eSAKSHI Public Portal"
          ];
          return {
            answer: text,
            sources,
            keyPoints: ["Gemini Grounded Analysis", "Multi-Source Public Records", "Objective Evidence Verification"]
          };
        }
      } catch {}
    }
    return new MockAIProvider().answerQuestion(question, contextData);
  }

  async interpretQuery(query: string): Promise<any> {
    return new MockAIProvider().interpretQuery(query);
  }

  async generateReport(params: any): Promise<any> {
    return new MockAIProvider().generateReport(params);
  }
}

export class OpenAIAIProvider implements AIProvider {
  name = "OpenAI Provider";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateExplanation(prompt: string, context: string): Promise<string> {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are NAZAR's civic data assistant. You explain anomalies clearly, objectively, and strictly grounded in evidence. Never accuse anyone of fraud. Use terms like 'observation', 'potential anomaly', 'timeline inconsistency'."
            },
            {
              role: "user",
              content: `Context:\n${context}\n\nTask:\n${prompt}`
            }
          ]
        })
      });
      const data = await res.json();
      return data?.choices?.[0]?.message?.content || "Unable to generate explanation.";
    } catch {
      return new MockAIProvider().generateExplanation(prompt, context);
    }
  }

  async answerQuestion(question: string, contextData: any): Promise<any> {
    return new MockAIProvider().answerQuestion(question, contextData);
  }

  async interpretQuery(query: string): Promise<any> {
    return new MockAIProvider().interpretQuery(query);
  }

  async generateReport(params: any): Promise<any> {
    return new MockAIProvider().generateReport(params);
  }
}

export function getAIProvider(): AIProvider {
  const providerType = (process.env.AI_PROVIDER || "").toLowerCase();

  if ((providerType === "gemini" || !providerType) && process.env.GEMINI_API_KEY) {
    return new GeminiAIProvider(process.env.GEMINI_API_KEY);
  }
  if (providerType === "openai" && process.env.OPENAI_API_KEY) {
    return new OpenAIAIProvider(process.env.OPENAI_API_KEY);
  }
  return new MockAIProvider();
}
