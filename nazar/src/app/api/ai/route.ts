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
