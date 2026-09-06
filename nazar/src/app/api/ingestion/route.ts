import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "src", "lib", "data", "liveScrapedData.json");
    if (fs.existsSync(dataPath)) {
      const content = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      return NextResponse.json({
        status: "available",
        source: content.source_authority,
        state: content.state,
        constituency: content.constituency,
        total_records: content.total_records,
        flagged_records: content.flagged_records,
        scraped_at: content.scraped_at,
      });
    }
    return NextResponse.json({ status: "not_ingested", total_records: 0 });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const state = body.state || "Telangana";
    const constituency = body.constituency || "HYDERABAD";

    const repoRoot = path.resolve(process.cwd(), "..");
    let command = "";
    if (body.national) {
      command = `py -m ingestion.cli --national`;
    } else if (body.allConstituencies) {
      command = `py -m ingestion.cli --state "${state}" --all-constituencies`;
    } else {
      command = `py -m ingestion.cli --state "${state}" --constituency "${constituency}"`;
    }

    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      exec(command, { cwd: repoRoot }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || stdout || error.message));
        } else {
          resolve({ stdout, stderr });
        }
      });
    });

    const dataPath = path.join(process.cwd(), "src", "lib", "data", "liveScrapedData.json");
    let summary = {};
    if (fs.existsSync(dataPath)) {
      summary = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ingested real records for ${constituency}, ${state}`,
      summary,
      output: result.stdout,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
