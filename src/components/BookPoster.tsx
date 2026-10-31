"use client";

import { useState } from "react";
import Link from "next/link";
import type { Book } from "@/types/book";
import { formatYear } from "@/lib/format";

/** Cor estável a partir do título — usada na capa de reserva. */
function corDoTitulo(titulo: string): string {
  let h = 0;
  for (let i = 0; i < titulo.length; i++) h = (h * 31 + titulo.charCodeAt(i)) % 360;
  return `hsl(${h} 62% 46%)`;
}

/**
 * Cartaz do livro (estilo streaming): capa grande, título embaixo e, no hover,
 * a descrição por cima da imagem.
 */
export function BookPoster({ book, fluid = false }: { book: Book; fluid?: boolean }) {
  const [capaFalhou, setCapaFalhou] = useState(false);

  return (
    <Link
      href={`/catalog/${book.id}`}
      className={`group ${fluid ? "w-full" : "w-[142px] shrink-0 snap-start sm:w-[168px]"}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#e2e8f0] shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        {capaFalhou ? (
          <div
            className="flex h-full w-full flex-col justify-between p-3 text-white"
            style={{ background: `linear-gradient(150deg, ${corDoTitulo(book.title)}, #1e293b)` }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
              {book.category}
            </span>
            <span className="text-sm font-bold leading-snug">{book.title}</span>
            <span className="text-[11px] opacity-90">{book.author}</span>
          </div>
        ) : (
          <img
            src={book.cover}
            alt={`Capa de ${book.title}`}
            loading="lazy"
            onError={() => setCapaFalhou(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        )}

        <div className="absolute left-2 top-2">
          <BookStatusSelo book={book} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="line-clamp-4 text-[11px] leading-relaxed text-white/95">
            {book.description}
          </p>
        </div>
      </div>

      <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-[#1e293b]">{book.title}</h3>
      <p className="line-clamp-1 text-xs text-[#64748b]">
        {book.author} · {formatYear(book.year)}
      </p>
    </Link>
  );
}

/** Selo minúsculo que fica sobre a capa. */
function BookStatusSelo({ book }: { book: Book }) {
  return book.available ? (
    <span className="rounded-full bg-emerald-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow">
      Disponível
    </span>
  ) : (
    <span className="rounded-full bg-amber-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow">
      Alugado
    </span>
  );
}
