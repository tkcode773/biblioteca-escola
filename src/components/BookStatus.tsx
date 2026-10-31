import type { Book } from "@/types/book";

/**
 * Selo de situação do livro.
 * Regra do projeto: quando estiver alugado, mostrar SEMPRE a data do
 * empréstimo e quem retirou.
 *
 * variant="badge" -> pílula compacta (usada sobre as capas)
 * variant="full"  -> pílula + dados do empréstimo (páginas internas)
 */
export function BookStatus({
  book,
  variant = "full",
}: {
  book: Book;
  variant?: "badge" | "full";
}) {
  if (book.available) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Disponível na estante
      </span>
    );
  }

  if (variant === "badge") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Alugado
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Alugado
      </span>
      {book.loanDate && (
        <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
          Data do empréstimo: {book.loanDate}
        </span>
      )}
      {book.borrowedBy && (
        <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
          Retirado por: {book.borrowedBy}
        </span>
      )}
    </div>
  );
}
