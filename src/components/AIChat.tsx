"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const SYSTEM_PROMPT =
  "Você é um assistente amigável da biblioteca escolar. Ajude os alunos a encontrar livros, responder dúvidas sobre empréstimos, horários de atendimento e eventos.";

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    const id = `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setMessages((prev) => [
      ...prev,
      { id, role, content, timestamp: new Date() },
    ]);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      addMessage("user", trimmed);
      setLoading(true);
      setError(null);
      abortRef.current = new AbortController();

      try {
        // Chamada à rota do servidor: a chave da IA nunca vai para o navegador.
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortRef.current.signal,
          body: JSON.stringify({
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: trimmed },
            ],
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.error || "Não foi possível obter uma resposta da IA.");
          return;
        }

        addMessage("assistant", data.content ?? "");
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Chat error:", err);
        setError("Erro de conexão com a IA.");
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [loading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
      setInput("");
    }
  };

  useEffect(() => {
    addMessage(
      "assistant",
      "Olá! 👋 Sou o assistente da biblioteca escolar. Posso ajudar com: encontrar livros, saber o estado de empréstimos, horários de atendimento e eventos. Como posso te ajudar hoje?"
    );
  }, [addMessage]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <h2 className="font-semibold text-zinc-800">📚 Assistente da Biblioteca</h2>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-xs text-zinc-400 hover:text-zinc-600">
            Limpar conversa
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400">
            <div className="mb-3 rounded-full bg-blue-100 p-4">
              <svg
                className="h-8 w-8 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <p>Comece uma conversa sobre a biblioteca.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-zinc-100 text-zinc-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
              <span className="block text-xs opacity-60 mt-1">
                {msg.timestamp.toLocaleTimeString("pt-BR")}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="h-3 w-3 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "0ms" }} />
              <span className="h-3 w-3 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "150ms" }} />
              <span className="h-3 w-3 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
              ⚠️ {error}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre a biblioteca..."
            className="flex-1 rounded-xl border border-zinc-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            disabled={loading}
            autoFocus
          />
          <button
            onClick={() => {
              handleSend(input);
              setInput("");
            }}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
