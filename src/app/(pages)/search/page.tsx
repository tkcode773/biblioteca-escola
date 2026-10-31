// src/app/(pages)/search/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookCard } from "@/components/BookCard";
import { searchBooks, getBooks, getBooksByCategory } from "@/lib/store";
import type { Book } from "@/types/book";

function SearchContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [ready, setReady] = useState(false);
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    // localStorage só existe no navegador — lê depois de montar.
    let result: Book[];
    if (category) {
      result = getBooksByCategory(category);
      if (query) {
        const q = query.toLowerCase();
        result = result.filter(
          (b) =>
            b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
        );
      }
    } else if (query) {
      result = searchBooks(query);
    } else {
      result = getBooks();
    }

    setBooks(result);
    setReady(true);
  }, [query, category]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    if (q && q.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <Link href="/" className="font-bold text-lg text-zinc-800">
            📚 Biblioteca Escolar
          </Link>
          <div className="flex flex-1 items-center gap-2 max-w-md">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                name="q"
                defaultValue={query}
                placeholder="Buscar livros..."
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">
            {query ? `Resultados para "${query}"` : "Catálogo de Livros"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {!ready
              ? "Carregando..."
              : `${books.length} livro${books.length !== 1 ? "s" : ""} encontrado${books.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {ready && books.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-lg">Nenhum livro encontrado.</p>
            <p className="text-sm mt-1">Tente buscar por outro termo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-zinc-400">
          Carregando...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
