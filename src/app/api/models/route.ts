import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { RiverAiService } from "@/lib/river-ai";

async function getModels(): Promise<string[]> {
  const apiKey = process.env.RIVER_API_KEY || "";
  if (!apiKey) return [];

  try {
    return await RiverAiService.listAllModels(apiKey);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const models = await getModels();

    return NextResponse.json({
      success: true,
      models,
    });
  } catch (err: any) {
    console.error("Error fetching models:", err);
    return NextResponse.json(
      { error: "Erro ao carregar modelos disponíveis" },
      { status: 500 }
    );
  }
}
