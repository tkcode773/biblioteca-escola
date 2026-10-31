// src/app/(pages)/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getBooks } from "@/lib/store";
import { initialBooks } from "@/lib/books";
import { SiteHeader } from "@/components/SiteHeader";
import { BookRow } from "@/components/BookRow";
import { BookStatus } from "@/components/BookStatus";
import { formatYear } from "@/lib/format";
import { CATEGORIES } from "@/types/book";
import type { Book } from "@/types/book";

// Livro do destaque principal (1984).
const DESTAQUE_ID = "b005";

export default function HomePage() {
  // Renderiza o acervo de exemplo no servidor e troca pelo salvo no navegador.
  const [books, setBooks] = useState<Book[]>(initialBooks);

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  const destaque = useMemo(
    () =>
      books.find((b) => b.id === DESTAQUE_ID) ??
      books.find((b) => b.available) ??
      books[0],
    [books]
  );

  const disponiveis = useMemo(() => books.filter((b) => b.available), [books]);
  const alugados = useMemo(() => books.filter((b) => !b.available), [books]);

  const porCategoria = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        categoria: cat,
        livros: books.filter((b) => b.category === cat),
      })).filter((c) => c.livros.length > 0),
    [books]
  );

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <SiteHeader ativo="/" />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
        {/* ---------------- Destaque principal ---------------- */}
        {destaque && (
          <section className="relative mb-8 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
            <img
              src={destaque.cover}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/60" />

            <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-9">
              <Link href={`/catalog/${destaque.id}`} className="shrink-0 self-start">
                <img
                  src={destaque.cover}
                  alt={`Capa de ${destaque.title}`}
                  className="h-56 w-36 rounded-xl object-cover shadow-xl ring-1 ring-black/10 transition hover:scale-[1.03] sm:h-72 sm:w-48"
                />
              </Link>

              <div className="min-w-0">
                <span className="inline-block rounded-full bg-[#eff6ff] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1d4ed8]">
                  Destaque da semana
                </span>
                <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#1e293b] sm:text-4xl">
                  {destaque.title}
                </h1>
                <p className="mt-1 text-sm font-medium text-[#475569] sm:text-base">
                  {destaque.author} · {formatYear(destaque.year)} · {destaque.category}
                </p>
                <p className="mt-3 line-clamp-4 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
                  {destaque.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/catalog/${destaque.id}`}
                    className="rounded-full bg-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2563eb]"
                  >
                    Ver detalhes
                  </Link>
                  <BookStatus book={destaque} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Números do acervo ---------------- */}
        <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { n: books.length, t: "livros no acervo" },
            { n: disponiveis.length, t: "disponíveis agora" },
            { n: alugados.length, t: "emprestados" },
            { n: porCategoria.length, t: "categorias" },
          ].map((s) => (
            <div
              key={s.t}
              className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-[#1d4ed8]">{s.n}</p>
              <p className="text-xs font-medium text-[#64748b]">{s.t}</p>
            </div>
          ))}
        </section>

        {/* ---------------- Prateleiras ---------------- */}
        <BookRow
          title="Em destaque"
          subtitle="Os livros mais procurados da estante"
          books={books.slice(0, 10)}
        />
        <BookRow
          title="Disponíveis agora"
          subtitle="Dá pra levar hoje mesmo"
          books={disponiveis}
        />
        <BookRow
          title="Emprestados no momento"
          subtitle="Voltam pra estante em breve"
          books={alugados}
        />

        {porCategoria.map((c) => (
          <BookRow
            key={c.categoria}
            title={c.categoria}
            subtitle={`${c.livros.length} ${c.livros.length === 1 ? "título" : "títulos"}`}
            books={c.livros}
          />
        ))}

        <div className="mt-2 text-center">
          <Link
            href="/catalog"
            className="inline-block rounded-full border border-[#3b82f6] px-6 py-3 text-sm font-semibold text-[#1d4ed8] transition hover:bg-[#3b82f6] hover:text-white"
          >
            Ver o catálogo completo
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#e2e8f0] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 py-8 text-center text-xs text-[#94a3b8] sm:px-6">
          <p className="text-sm font-semibold text-[#64748b]">📚 Biblioteca Escolar</p>
          <p>Projeto do curso técnico · dados guardados no seu navegador</p>
        </div>
      </footer>
    </div>
  );
}
