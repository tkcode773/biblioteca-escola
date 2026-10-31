// src/app/(pages)/search/page.tsx
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getBooks } from "@/lib/store";
import { initialBooks } from "@/lib/books";
import { SiteHeader } from "@/components/SiteHeader";
import { BookPoster } from "@/components/BookPoster";
import type { Book } from "@/types/book";

function Resultados() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [pronto, setPronto] = useState(false);
  const searchParams = useSearchParams();

  const termo = searchParams.get("q")?.trim() ?? "";

  useEffect(() => {
    setBooks(getBooks());
    setPronto(true);
  }, []);

  const resultados = useMemo(() => {
    if (!termo) return books;
    const q = termo.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }, [books, termo]);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#1e293b] sm:text-3xl">
          {termo ? (
            <>
              Resultados para <span className="text-[#1d4ed8]">“{termo}”</span>
            </>
          ) : (
            "Todo o acervo"
          )}
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          {!pronto
            ? "Buscando..."
            : `${resultados.length} ${resultados.length === 1 ? "livro" : "livros"} encontrado${
                resultados.length === 1 ? "" : "s"
              }`}
        </p>
      </header>

      {pronto && resultados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cbd5e1] bg-white py-16 text-center">
          <p className="text-lg font-semibold text-[#475569]">Nada encontrado</p>
          <p className="mt-1 text-sm text-[#94a3b8]">
            Tente outro título, autor ou categoria.
          </p>
          <Link
            href="/catalog"
            className="mt-5 inline-block rounded-full bg-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
          >
            Ver catálogo completo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {resultados.map((book) => (
            <BookPoster key={book.id} book={book} fluid />
          ))}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <SiteHeader ativo="/catalog" />
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center text-[#94a3b8]">
            Buscando...
          </div>
        }
      >
        <Resultados />
      </Suspense>
    </div>
  );
}
