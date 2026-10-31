// src/app/(pages)/catalog/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { getBooks } from "@/lib/store";
import { initialBooks } from "@/lib/books";
import { SiteHeader } from "@/components/SiteHeader";
import { BookPoster } from "@/components/BookPoster";
import { CATEGORIES } from "@/types/book";
import type { Book } from "@/types/book";

type Ordem = "titulo" | "autor" | "ano" | "disponiveis";

export default function CatalogPage() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("todos");
  const [ordem, setOrdem] = useState<Ordem>("titulo");

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  const lista = useMemo(() => {
    const q = busca.toLowerCase().trim();
    let out = books.filter((b) => {
      if (categoria !== "todos" && b.category !== categoria) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    });

    out = [...out].sort((a, b) => {
      switch (ordem) {
        case "autor":
          return a.author.localeCompare(b.author, "pt-BR");
        case "ano":
          return a.year - b.year;
        case "disponiveis":
          return Number(b.available) - Number(a.available);
        default:
          return a.title.localeCompare(b.title, "pt-BR");
      }
    });

    return out;
  }, [books, busca, categoria, ordem]);

  const contagem = useMemo(() => {
    const mapa: Record<string, number> = {};
    for (const b of books) mapa[b.category] = (mapa[b.category] ?? 0) + 1;
    return mapa;
  }, [books]);

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <SiteHeader ativo="/catalog" />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#1e293b] sm:text-3xl">
            Catálogo de Livros
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
            {lista.length} {lista.length === 1 ? "título encontrado" : "títulos encontrados"} de{" "}
            {books.length} no acervo
          </p>
        </header>

        {/* Filtros */}
        <div className="mb-6 space-y-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#94a3b8]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Filtrar por título, autor ou categoria..."
                className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] py-2.5 pl-9 pr-3 text-sm focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25"
              />
            </div>

            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value as Ordem)}
              aria-label="Ordenar por"
              className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2.5 text-sm font-medium text-[#475569] focus:border-[#3b82f6] focus:outline-none"
            >
              <option value="titulo">Título (A–Z)</option>
              <option value="autor">Autor (A–Z)</option>
              <option value="ano">Ano (mais antigo)</option>
              <option value="disponiveis">Disponíveis primeiro</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoria("todos")}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                categoria === "todos"
                  ? "bg-[#3b82f6] text-white shadow-sm"
                  : "border border-[#e2e8f0] bg-white text-[#475569] hover:border-[#3b82f6] hover:text-[#1d4ed8]"
              }`}
            >
              Todos ({books.length})
            </button>
            {CATEGORIES.filter((c) => contagem[c]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoria(c)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  categoria === c
                    ? "bg-[#3b82f6] text-white shadow-sm"
                    : "border border-[#e2e8f0] bg-white text-[#475569] hover:border-[#3b82f6] hover:text-[#1d4ed8]"
                }`}
              >
                {c} ({contagem[c]})
              </button>
            ))}
          </div>
        </div>

        {/* Grade */}
        {lista.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] bg-white py-16 text-center">
            <p className="text-lg font-semibold text-[#475569]">Nenhum livro encontrado</p>
            <p className="mt-1 text-sm text-[#94a3b8]">
              Tente outro termo ou toque em “Todos”.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {lista.map((book) => (
              <BookPoster key={book.id} book={book} fluid />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
