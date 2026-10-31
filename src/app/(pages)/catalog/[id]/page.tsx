// src/app/(pages)/catalog/[id]/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBookById, getBooks } from "@/lib/store";
import { initialBooks } from "@/lib/books";
import { SiteHeader } from "@/components/SiteHeader";
import { BookRow } from "@/components/BookRow";
import { BookStatus } from "@/components/BookStatus";
import { formatYear } from "@/lib/format";
import type { Book } from "@/types/book";

function Detalhe() {
  const params = useParams<{ id: string }>();
  const [livro, setLivro] = useState<Book | null>(null);
  const [todos, setTodos] = useState<Book[]>(initialBooks);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    const id = String(params.id);
    setLivro(getBookById(id) ?? null);
    setTodos(getBooks());
    setPronto(true);
  }, [params?.id]);

  if (!pronto) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#94a3b8]">
        Carregando...
      </div>
    );
  }

  if (!livro) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-lg font-semibold text-[#475569]">Livro não encontrado</p>
        <p className="mt-1 text-sm text-[#94a3b8]">
          Esse título pode ter sido removido do acervo.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-block rounded-full bg-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
        >
          Voltar ao catálogo
        </Link>
      </main>
    );
  }

  const relacionados = todos
    .filter((b) => b.id !== livro.id && (b.category === livro.category || b.author === livro.author))
    .slice(0, 10);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <nav className="mb-4 text-sm text-[#94a3b8]">
        <Link href="/" className="hover:text-[#1d4ed8]">
          Início
        </Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="hover:text-[#1d4ed8]">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#475569]">{livro.title}</span>
      </nav>

      <section className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
        <img
          src={livro.cover}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/70" />

        <div className="relative flex flex-col gap-7 p-6 sm:flex-row sm:p-9">
          <img
            src={livro.cover}
            alt={`Capa de ${livro.title}`}
            className="h-72 w-48 shrink-0 self-start rounded-xl object-cover shadow-xl ring-1 ring-black/10 sm:h-96 sm:w-64"
          />

          <div className="min-w-0">
            <span className="inline-block rounded-full bg-[#eff6ff] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1d4ed8]">
              {livro.category}
            </span>

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#1e293b] sm:text-4xl">
              {livro.title}
            </h1>
            <p className="mt-1.5 text-base font-medium text-[#475569]">{livro.author}</p>
            <p className="mt-1 text-sm text-[#64748b]">
              Publicado em {formatYear(livro.year)}
            </p>

            <div className="mt-5">
              <BookStatus book={livro} />
            </div>

            <h2 className="mt-6 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              Sobre o livro
            </h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-[#475569]">
              {livro.description || "Sem descrição cadastrada."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="rounded-full border border-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-[#1d4ed8] transition hover:bg-[#3b82f6] hover:text-white"
              >
                Explorar o catálogo
              </Link>
              {!livro.available && (
                <span className="rounded-full bg-amber-50 px-5 py-2.5 text-sm font-medium text-amber-800 ring-1 ring-amber-200">
                  Fale com a biblioteca para reservar
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <div className="mt-10">
          <BookRow
            title="Você também pode gostar"
            subtitle={`Mais de ${livro.category.toLowerCase()} e de ${livro.author}`}
            books={relacionados}
          />
        </div>
      )}
    </main>
  );
}

export default function BookDetailPage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <SiteHeader ativo="/catalog" />
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center text-[#94a3b8]">
            Carregando...
          </div>
        }
      >
        <Detalhe />
      </Suspense>
    </div>
  );
}
