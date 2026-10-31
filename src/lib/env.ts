// Config de ambientes - .env.local
// Copie para .env.local e preencha com sua chave do River AI
//
// RIVER_API_KEY=rv_...
// RIVER_MODEL=Qwen/Qwen3.5-9B

export const env = {
  riverApiKey: process.env.RIVER_API_KEY || "",
  riverModel: process.env.RIVER_MODEL || "Qwen/Qwen3.5-9B",
};

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}
