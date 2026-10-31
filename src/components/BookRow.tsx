"use client";

import { useRef, useState, useEffect } from "react";
import type { Book } from "@/types/book";
import { BookPoster } from "@/components/BookPoster";

/**
 * Prateleira horizontal (estilo streaming): título, setas de rolagem no
 * desktop e arrasto lateral no celular.
 */
export function BookRow({
  title,
  subtitle,
  books,
  destaque = false,
}: {
  title: string;
  subtitle?: string;
  books: Book[];
  destaque?: boolean;
}) {
  const trilha = useRef<HTMLDivElement>(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);

  const atualizarSetas = () => {
    const el = trilha.current;
    if (!el) return;
    setPodeVoltar(el.scrollLeft > 8);
    setPodeAvancar(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    atualizarSetas();
    const el = trilha.current;
    if (!el) return;
    el.addEventListener("scroll", atualizarSetas, { passive: true });
    window.addEventListener("resize", atualizarSetas);
    return () => {
      el.removeEventListener("scroll", atualizarSetas);
      window.removeEventListener("resize", atualizarSetas);
    };
  }, [books.length]);

  const rolar = (sentido: number) => {
    const el = trilha.current;
    if (!el) return;
    el.scrollBy({ left: sentido * Math.max(320, el.clientWidth * 0.8), behavior: "smooth" });
  };

  if (books.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#1e293b] sm:text-xl">{title}</h2>
          {subtitle && <p className="text-sm text-[#64748b]">{subtitle}</p>}
        </div>

        <div className="hidden shrink-0 gap-1.5 sm:flex">
          <button
            type="button"
            aria-label="Rolar para a esquerda"
            onClick={() => rolar(-1)}
            disabled={!podeVoltar}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#475569] shadow-sm transition hover:border-[#3b82f6] hover:text-[#3b82f6] disabled:opacity-35"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Rolar para a direita"
            onClick={() => rolar(1)}
            disabled={!podeAvancar}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#475569] shadow-sm transition hover:border-[#3b82f6] hover:text-[#3b82f6] disabled:opacity-35"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trilha}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 sm:gap-4"
      >
        {books.map((book) => (
          <BookPoster key={book.id} book={book} />
        ))}
      </div>

      {destaque && (
        <div className="mt-2 h-px w-full bg-gradient-to-r from-[#e2e8f0] to-transparent" />
      )}
    </section>
  );
}
