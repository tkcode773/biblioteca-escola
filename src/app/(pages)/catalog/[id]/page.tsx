// src/app/(pages)/catalog/[id]/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBookById } from "@/lib/store";
import type { Book } from "@/types/book";

function BookDetailContent() {
  const params = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    setBook(getBookById(String(params.id)) ?? null);
    setReady(true);
  }, [params?.id]);

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-[#1E40AF]">
            📚 Biblioteca Escolar
          </Link>
          <Link href="/catalog" className="text-sm text-[#475569] hover:text-[#1E40AF]">
            ← Voltar ao catálogo
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {!ready && <p className="text-[#64748B]">Carregando...</p>}

        {ready && !book && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            Livro não encontrado.
          </div>
        )}

        {book && (
          <article className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-6 p-6">
              <div className="overflow-hidden rounded-xl bg-[#F8FAFC]">
                <img
                  src={book.cover}
                  alt={`Capa de ${book.title}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">{book.title}</h1>
                <p className="text-[#64748B] font-medium mt-1">{book.author}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {book.available ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 rounded-full px-2.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Disponível na estante
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full px-2.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      Alugado
                    </span>
                  )}
                  <span className="text-xs text-[#64748B] bg-[#F1F5F9] rounded-full px-2.5 py-1">
                    {book.category}
                  </span>
                  <span className="text-xs text-[#64748B] bg-[#F1F5F9] rounded-full px-2.5 py-1">
                    {book.year}
                  </span>
                </div>

                {!book.available && (book.loanDate || book.borrowedBy) && (
                  <div className="mt-3 space-y-1 text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                    {book.loanDate && <p>Data do empréstimo: {book.loanDate}</p>}
                    {book.borrowedBy && <p>Retirado por: {book.borrowedBy}</p>}
                  </div>
                )}

                <h2 className="mt-6 text-sm font-semibold text-[#334155] uppercase tracking-wide">
                  Descrição
                </h2>
                <p className="mt-2 text-[#475569] leading-relaxed">
                  {book.description || "Sem descrição cadastrada."}
                </p>
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

export default function BookDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-zinc-400">
          Carregando...
        </div>
      }
    >
      <BookDetailContent />
    </Suspense>
  );
}
