// src/lib/river-ai.ts
// Serviço de integração com a API do River AI
// Endpoint: https://api.river.ai/v1 (compatível com OpenAI)

export type RiverAiMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type RiverAiConfig = {
  apiKey: string; // Começa com rv_
  baseUrl?: string; // https://api.river.ai/v1
  model: string; // Ex: Qwen/Qwen3.5-9B
};

export class RiverAiService {
  private config: RiverAiConfig;

  constructor(config: RiverAiConfig) {
    if (!config.apiKey) {
      throw new Error("API key do River AI é obrigatória");
    }
    this.config = {
      ...config,
      baseUrl: config.baseUrl ?? "https://api.river.ai/v1",
    };
  }

  get headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
    };
  }

  async chat(messages: RiverAiMessage[], options: { maxTokens?: number; temperature?: number } = {}) {
    const body = {
      model: this.config.model,
      messages,
      max_tokens: options.maxTokens ?? 1024,
      temperature: options.temperature ?? 0.7,
      stream: false,
    };

    const res = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Erro no River AI: ${res.status} ${err.error?.message ?? ""}`);
    }

    const data = await res.json();
    const assistantMessage = data.choices?.[0]?.message;
    return assistantMessage?.content ?? "";
  }

  async models() {
    const res = await fetch(`${this.config.baseUrl}/models`, {
      method: "GET",
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error(`Erro ao listar modelos: ${res.status}`);
    }
    const data = await res.json();
    return data.data?.map((m: any) => m.id) ?? [];
  }

  static async listAllModels(apiKey: string, baseUrl: string = "https://api.river.ai/v1") {
    const res = await fetch(`${baseUrl}/models`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Erro ao listar modelos: ${res.status}`);
    }
    const data = await res.json();
    return data.data?.map((m: any) => m.id) ?? [];
  }
}

// Exporta um singleton para uso no app
export function createRiverAi(config: RiverAiConfig) {
  return new RiverAiService(config);
}
