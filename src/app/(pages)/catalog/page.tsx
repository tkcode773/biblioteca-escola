// src/app/(pages)/catalog/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBooks } from "@/lib/store";
import { initialBooks } from "@/lib/books";
import { BookStatus } from "@/components/BookStatus";
import { CATEGORIES } from "@/types/book";
import type { Book } from "@/types/book";

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("todos");
  const [books, setBooks] = useState<Book[]>(initialBooks);

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  const q = searchQuery.toLowerCase().trim();
  const booksList = books.filter((b) => {
    if (filterCategory !== "todos" && b.category !== filterCategory) return false;
    if (!q) return true;
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#1E40AF] tracking-tight">
            <svg className="h-7 w-7 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span className="hidden sm:inline">Biblioteca Escolar</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#94A3B8]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar livros..."
                className="w-64 pl-10 pr-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6]"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">Catálogo de Livros</h1>
            <p className="text-sm text-[#64748B]">
              {booksList.length} livro{booksList.length !== 1 ? "s" : ""} encontrado{booksList.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory("todos")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === "todos"
                  ? "bg-[#3B82F6] text-white"
                  : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]"
              }`}
            >
              Todos
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterCategory === cat
                    ? "bg-[#3B82F6] text-white"
                    : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {booksList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#64748B]">Nenhum livro encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {booksList.map((book) => (
              <Link
                key={book.id}
                href={`/catalog/${book.id}`}
                className="group bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-48 bg-[#F8FAFC] flex items-center justify-center overflow-hidden">
                  <img
                    src={book.cover}
                    alt={`Capa de ${book.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  <div className="absolute bottom-2 right-2">
                    <BookStatus book={book} />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#1E293B] line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-[#64748B] font-medium">{book.author}</p>
                  <p className="mt-2 text-sm text-[#475569] line-clamp-2 leading-relaxed">{book.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
