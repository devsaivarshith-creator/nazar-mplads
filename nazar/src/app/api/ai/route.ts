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
    let { action, prompt, context, question, contextData, params } = body;
    const provider = getAIProvider();

    if (!action && (body.query || body.messages || body.prompt || body.question)) {
      action = "chat";
    }

    if (action === "chat") {
      const messages = body.messages || [];
      const userMessage = body.query || body.question || (messages[messages.length - 1]?.content) || "";
      
      const {
        findMPByQuery,
        isGeneralQuery,
        isStateMPListQuery,
        generateGeneralQueryAnswer,
        generateStateMPsRoster
      } = await import("@/lib/data/allIndiaMPsData");

      // 1. General Queries (e.g. "tell me about today or smth", "what is nazar", "hello")
      if (isGeneralQuery(userMessage)) {
        const answer = generateGeneralQueryAnswer(userMessage);
        return NextResponse.json({
          success: true,
          reply: answer,
          isGeneral: true,
          sources: ["NAZAR Operational Intelligence Desk", "18th Lok Sabha Directorate"],
          webSources: [],
          mpProfile: null,
          mp360: null,
          delayedWorks: [],
          provider: provider.name
        });
      }

      // 2. State-wide MP Listings (e.g. "list all mps of telanagana", "list mps of andhra")
      const stateCheck = isStateMPListQuery(userMessage);
      if (stateCheck.isStateList && stateCheck.stateName) {
        const answer = generateStateMPsRoster(stateCheck.stateName);
        return NextResponse.json({
          success: true,
          reply: answer,
          isStateList: true,
          sources: ["Election Commission of India (ECI 2024)", "Lok Sabha Secretariat Member Directory"],
          webSources: [],
          mpProfile: null,
          mp360: null,
          delayedWorks: [],
          provider: provider.name
        });
      }

      // 3. MP Resolution: check if the new message explicitly names an MP or constituency
      const explicitNewMP = findMPByQuery(userMessage);

      // Check if user is asking a follow-up about the active MP
      let activeCandidateMP = explicitNewMP || body.mpProfile;
      if (!activeCandidateMP && Array.isArray(messages) && messages.length > 0) {
        // Search previous messages (skipping the current question at the end)
        const startIndex = messages.length > 1 ? messages.length - 2 : 0;
        for (let i = startIndex; i >= 0; i--) {
          const msgContent = messages[i]?.content || messages[i]?.text || "";
          const found = findMPByQuery(msgContent);
          if (found) {
            activeCandidateMP = found;
            break;
          }
        }
      }

      const lowerQuery = userMessage.toLowerCase().trim();

      const isFollowUp = !explicitNewMP && activeCandidateMP && (
        lowerQuery.includes("delayed") ||
        lowerQuery.includes("work") ||
        lowerQuery.includes("project") ||
        lowerQuery.includes("criminal") ||
        lowerQuery.includes("case") ||
        lowerQuery.includes("court") ||
        lowerQuery.includes("affidavit") ||
        lowerQuery.includes("education") ||
        lowerQuery.includes("degree") ||
        lowerQuery.includes("college") ||
        lowerQuery.includes("attendance") ||
        lowerQuery.includes("debate") ||
        lowerQuery.includes("question") ||
        lowerQuery.includes("bill") ||
        lowerQuery.includes("asset") ||
        lowerQuery.includes("wealth") ||
        lowerQuery.includes("money") ||
        lowerQuery.includes("worth") ||
        lowerQuery.includes("rich") ||
        lowerQuery.includes("background") ||
        lowerQuery.includes("who is he") ||
        lowerQuery.includes("who is she") ||
        lowerQuery.includes("she") ||
        lowerQuery.includes("he") ||
        lowerQuery.includes("her") ||
        lowerQuery.includes("his") ||
        lowerQuery.includes("tell me more") ||
        lowerQuery.includes("more details") ||
        lowerQuery.includes("controvers") ||
        lowerQuery.includes("career") ||
        lowerQuery.includes("priority") ||
        lowerQuery.includes("expenditure") ||
        lowerQuery.includes("fund") ||
        lowerQuery.includes("spent")
      );

      const targetQuery = explicitNewMP?.name
        ? explicitNewMP.name
        : (isFollowUp && activeCandidateMP?.name)
          ? activeCandidateMP.name
          : userMessage;

      const { get360MPIntelligenceAsync, generateGroundedConversationalReply } = await import("@/lib/services/mpIntelligenceService");
      
      // Run async live web search across Wikipedia, DDG, Sansad, PRS, and ADR
      const intel = await get360MPIntelligenceAsync(targetQuery);
      const mpProfile = intel.mp;

      // Deep multi-source grounding context
      const systemContext = `You are NAZAR's conversational public data investigator and AI copilot.
You assist citizens, journalists, and oversight authorities in examining India's Members of Parliament (MPs) across:
1. Parliamentary Performance (Attendance %, Debates participated, Questions asked, Private Member Bills via PRS & Sansad.in)
2. Election Affidavits & Transparency (Educational qualification, declared profession, net assets in ₹ Crores, criminal/legal cases via MyNeta / ADR)
3. MPLADS Fund Execution (Sanctioned funds, Expenditure velocity, Unspent balance, Delayed/incomplete projects with work IDs, overdue days, executing agencies via eSAKSHI)
4. Public Stance, Ground Issues, and Media Citations.

Always remain objective, evidence-grounded, and polite. Never accuse individuals of crimes or fraud directly—cite discrepancies as 'observations', 'unresolved documentation flags', or 'timeline variances'.

CURRENT SUBJECT MP 360° INTELLIGENCE:
• Name: ${mpProfile.name}
• Party: ${mpProfile.party} (${mpProfile.house})
• State & Constituency: ${mpProfile.constituency}, ${mpProfile.state} [${mpProfile.term}]
• Parliamentary Record (PRS/Sansad): Attendance ${intel.parliamentary_scorecard.attendance}%, Debates ${intel.parliamentary_scorecard.debates}, Questions ${intel.parliamentary_scorecard.questions}, Bills ${intel.parliamentary_scorecard.bills}
• Affidavit Disclosures (ADR/MyNeta): Education '${intel.affidavit_disclosures.education}', Profession '${intel.affidavit_disclosures.profession}', Declared Assets ${intel.affidavit_disclosures.net_assets_formatted}, Criminal Cases: ${intel.affidavit_disclosures.criminal_cases} (${intel.affidavit_disclosures.criminal_cases_note})
• MPLADS Outlay: Sanctioned ₹${(mpProfile.sanctioned_amount / 10000000).toFixed(2)} Cr, Expended ₹${(mpProfile.expenditure_amount / 10000000).toFixed(2)} Cr (${mpProfile.utilization_rate}% utilization), Unspent ₹${((mpProfile.sanctioned_amount - mpProfile.expenditure_amount) / 10000000).toFixed(2)} Cr
• Delayed Works: ${mpProfile.delayed_works} projects past scheduled completion
• Key Delayed Works Sample: ${JSON.stringify(intel.mplads_lifecycle.delayed_projects_sample.map(p => ({ id: p.id, title: p.title, overdue_days: p.days_overdue, cause: p.cause, agency: p.agency })))}
• Key Implementing Bodies: ${mpProfile.implementing_agencies?.join(", ")}
• Observations: ${mpProfile.observations_summary}`;

      let answer = "";
      const sources = intel.web_evidence_sources.map(s => `${s.source_name} (${s.source_type})`);

      // Try Gemini via provider
      try {
        const result = await provider.answerQuestion(userMessage, {
          systemContext,
          intel,
          mpProfile,
          conversationHistory: messages
        });
        if (result?.answer && result.answer.length > 50) {
          answer = result.answer;
        }
      } catch (err) {
        console.warn("Gemini chat error, using 360 intelligence synthesis:", err);
      }

      if (!answer) {
        // High quality grounded synthesis from 360 MP service
        answer = generateGroundedConversationalReply({
          query: userMessage,
          intel,
          conversationHistory: messages
        });
      }

      return NextResponse.json({
        success: true,
        reply: answer,
        sources,
        webSources: intel.web_evidence_sources,
        mpProfile,
        mp360: intel,
        delayedWorks: intel.mplads_lifecycle.delayed_projects_sample,
        provider: provider.name
      });
    }

    if (action === "dossier") {
      const { mpProfile, query } = body;
      const { get360MPIntelligenceAsync } = await import("@/lib/services/mpIntelligenceService");
      const intel = await get360MPIntelligenceAsync(query || mpProfile?.name || "Asaduddin Owaisi");
      const targetMP = mpProfile || intel.mp;
      const { generateDossierForMP } = await import("@/lib/data/mpsData");
      
      const baseDossier = generateDossierForMP(targetMP);
      const full360Dossier = {
        ...baseDossier,
        parliamentary_record: intel.parliamentary_scorecard,
        affidavit_record: intel.affidavit_disclosures,
        web_search_evidence: intel.web_evidence_sources.map(s => ({
          source_title: s.source_name,
          source_url: s.source_url,
          verified_status: `Verified ${s.source_type}`,
          relevance_note: s.evidence_snippet
        }))
      };

      return NextResponse.json({
        success: true,
        dossier: full360Dossier,
        provider: provider.name
      });
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
