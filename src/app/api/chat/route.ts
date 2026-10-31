import { NextRequest, NextResponse } from "next/server";
import { RiverAiService, createRiverAi } from "@/lib/river-ai";
import { env } from "@/lib/env";

// Endpoint proxy do River AI
// Roda no servidor para NÃO expor a chave na frente

let riverAi: RiverAiService | null = null;

function getRiverAi(): RiverAiService | null {
  if (!riverAi && env.riverApiKey) {
    riverAi = createRiverAi({
      apiKey: env.riverApiKey,
      baseUrl: "https://api.river.ai/v1",
      model: env.riverModel,
    });
  }
  return riverAi;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages, maxTokens, temperature } = body as {
    messages: Array<{ role: string; content: string }>;
    maxTokens?: number;
    temperature?: number;
  };

  const service = getRiverAi();
  if (!service) {
    return NextResponse.json(
      { error: "Configuração da IA não encontrada. Adicione RIVER_API_KEY no .env.local" },
      { status: 500 }
    );
  }

  try {
    const formattedMessages: any[] = messages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    const response = await service.chat(formattedMessages, {
      maxTokens,
      temperature,
    });

    return NextResponse.json({
      content: response,
      success: true,
    });
  } catch (err: any) {
    console.error("Error calling River AI:", err);
    return NextResponse.json(
      { error: err.message ?? "Erro ao chamar a API da IA" },
      { status: 500 }
    );
  }
}
