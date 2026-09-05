import { NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai/providers";

export async function GET() {
  const provider = getAIProvider();
  return NextResponse.json({
    status: "online",
    provider: provider.name,
    isGeminiActive: provider.name.includes("Gemini"),
    signature: "East"
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, prompt, context, question, contextData, params } = body;
    const provider = getAIProvider();

    if (action === "chat") {
      const messages = body.messages || [];
      const userMessage = body.query || body.question || (messages[messages.length - 1]?.content) || "";
      const mpProfile = body.mpProfile;
      
      // Grounded prompt for Gemini or Mock
      const systemContext = `You are NAZAR's conversational public data investigator and AI copilot.
You assist citizens, journalists, and oversight authorities in examining India's MPLADS expenditure, MP performance, incomplete and delayed projects, cost anomalies, and accountability.
Always remain objective, evidence-grounded, and polite. Never accuse individuals of crimes or fraud directly—cite discrepancies as 'observations', 'unresolved documentation flags', or 'timeline variances'.
Highlight specific figures (Crores, Lakhs, percentages, days delayed, work IDs, implementing agencies).
Subject MP: ${mpProfile ? `${mpProfile.name} (${mpProfile.party}, ${mpProfile.constituency}, ${mpProfile.state})` : "General MPLADS Inquiry"}.
MP Stats: ${mpProfile ? `Sanctioned: ₹${(mpProfile.sanctioned_amount / 10000000).toFixed(2)} Cr, Expended: ₹${(mpProfile.expenditure_amount / 10000000).toFixed(2)} Cr (${mpProfile.utilization_rate}%), Delayed Works: ${mpProfile.delayed_works}, Top Agencies: ${mpProfile.implementing_agencies?.join(", ")}` : "National Dataset"}.`;

      let answer = "";
      let sources = [
        "eSAKSHI Public Gazette Register (MoSPI)",
        "District Collectorate Nodal Authority Disclosures",
        "NAZAR Deterministic Anomaly Pipeline"
      ];

      // Try Gemini via provider
      try {
        const result = await provider.answerQuestion(userMessage, {
          systemContext,
          mpProfile,
          conversationHistory: messages
        });
        answer = result.answer;
        if (result.sources?.length) sources = result.sources;
      } catch (err) {
        console.warn("Gemini chat fallback:", err);
      }

      if (!answer) {
        if (mpProfile) {
          answer = `Regarding **${mpProfile.name}** (${mpProfile.constituency}, ${mpProfile.state}):\n\n` +
            `• **Allocation & Utilization**: Total sanctioned out of MPLADS is **₹${(mpProfile.sanctioned_amount / 10000000).toFixed(2)} Crore** with an expenditure of **₹${(mpProfile.expenditure_amount / 10000000).toFixed(2)} Crore** (**${mpProfile.utilization_rate}%** utilization rate).\n` +
            `• **Delayed & Stalled Works**: Public records identify **${mpProfile.delayed_works} projects** that have exceeded their target milestone timelines by more than 180 days.\n` +
            `• **Implementing Agencies**: Key nodal execution bodies are **${mpProfile.implementing_agencies?.slice(0, 2).join(" & ")}**.\n` +
            `• **Oversight Signal**: ${mpProfile.observations_summary}`;
        } else {
          answer = `NAZAR analysis for **"${userMessage}"**:\n\n` +
            `Analyzing the public MPLADS dataset across India's 28 States and 8 Union Territories. Active records reflect project life cycles from initial recommendation, administrative sanction, fund release, to physical completion.\n\n` +
            `You can investigate specific MPs (e.g., Asaduddin Owaisi, Narendra Modi, Rahul Gandhi, Shashi Tharoor, Tejasvi Surya) or examine stalled works, cost outliers, and implementing agency concentration.`;
        }
      }

      return NextResponse.json({
        success: true,
        reply: answer,
        sources,
        provider: provider.name
      });
    }

    if (action === "dossier") {
      const { mpProfile } = body;
      const { generateDossierForMP } = await import("@/lib/data/mpsData");
      if (mpProfile) {
        const dossier = generateDossierForMP(mpProfile);
        return NextResponse.json({
          success: true,
          dossier,
          provider: provider.name
        });
      }
      return NextResponse.json({ success: false, error: "No MP profile provided" }, { status: 400 });
    }

    if (action === "explain") {
      const explanation = await provider.generateExplanation(prompt || "", context || "");
      return NextResponse.json({
        success: true,
        explanation,
        provider: provider.name
      });
    }

    if (action === "answer") {
      const result = await provider.answerQuestion(question || "", contextData || {});
      return NextResponse.json({
        success: true,
        ...result,
        provider: provider.name
      });
    }

    if (action === "interpret") {
      const result = await provider.interpretQuery(prompt || question || "");
      return NextResponse.json({
        success: true,
        result,
        provider: provider.name
      });
    }

    if (action === "report") {
      const report = await provider.generateReport(params || {});
      return NextResponse.json({
        success: true,
        report,
        provider: provider.name
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
