import Link from "next/link";
import type { Book } from "@/types/book";

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-100">
        <img
          src={book.cover}
          alt={`Capa de ${book.title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-semibold text-white ${
            book.available ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {book.available ? "Disponível" : "Emprestado"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-zinc-800 line-clamp-2">{book.title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{book.author}</p>
        <p className="mt-2 text-sm text-zinc-600 line-clamp-2">{book.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-zinc-400">{book.year}</span>
          <Link
            href={`/catalog/${book.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Detalhes
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10 11.23l2.77-2.77a.75.75 0 1 1 1.04 1.06l-3.25 3.25a.75.75 0 0 1-1.06-.02zM6.5 6.5L3.75 3.75"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
