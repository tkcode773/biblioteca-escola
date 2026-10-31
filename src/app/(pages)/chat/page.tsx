// src/app/(pages)/chat/page.tsx
"use client";

import Link from "next/link";
import { AIChat } from "@/components/AIChat";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-800">💬 Assistente da Biblioteca</h1>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
            ← Voltar ao início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <AIChat />
      </main>
    </div>
  );
}
