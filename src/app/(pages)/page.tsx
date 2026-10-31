// src/app/(pages)/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBooks } from "@/lib/store";
import { initialBooks } from "@/lib/books";
import { BookStatus } from "@/components/BookStatus";
import type { Book } from "@/types/book";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  // Renderiza o acervo de exemplo no servidor e troca pelo salvo no navegador.
  const [books, setBooks] = useState<Book[]>(initialBooks);

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  const q = searchQuery.toLowerCase().trim();
  const filteredBooks = q
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      )
    : books;

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#1E40AF] tracking-tight">
            <svg className="h-7 w-7 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span className="hidden sm:inline">Biblioteca Escolar</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/catalog" className="text-sm text-[#475569] hover:text-[#1E40AF] font-medium transition-colors">Catálogo</Link>
            <Link href="/chat" className="text-sm text-[#475569] hover:text-[#1E40AF] font-medium transition-colors">Chat IA</Link>
            <Link href="/team" className="text-sm text-[#475569] hover:text-[#1E40AF] font-medium transition-colors">Equipe</Link>
            <Link href="/dashboard" className="text-sm text-[#475569] hover:text-[#1E40AF] font-medium transition-colors">Painel</Link>
            <Link href="/login" className="text-sm text-[#475569] hover:text-[#1E40AF] font-medium transition-colors">Entrar</Link>
          </nav>
        </div>
      </header>

      {/* Search bar */}
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#94A3B8]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar livros por título ou autor..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] transition-shadow"
          />
        </div>
      </div>

      {/* Featured Books */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">📚 Destaque</h1>
            <p className="text-sm text-[#64748B]">
              {q
                ? `${filteredBooks.length} resultado${filteredBooks.length !== 1 ? "s" : ""} para "${searchQuery}"`
                : "Os livros mais pedidos da semana"}
            </p>
          </div>
          <Link href="/catalog" className="text-sm text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors">
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
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

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#64748B]">Nenhum livro encontrado com &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-center text-xs text-[#94A3B8]">
        Biblioteca Escolar — projeto de curso técnico · dados salvos no seu navegador
      </footer>
    </div>
  );
}
