import type { Book } from "@/types/book";

/**
 * Selo de status do livro.
 * Regra do projeto: se estiver alugado, mostrar SEMPRE a data do empréstimo
 * e quem retirou.
 */
export function BookStatus({ book }: { book: Book }) {
  if (book.available) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 rounded-full px-2.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Disponível na estante
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full px-2.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
        Alugado
      </span>
      {book.loanDate && (
        <span className="text-[10px] font-medium text-yellow-800 bg-yellow-50 border border-yellow-200 rounded px-1.5 py-0.5">
          Data do empréstimo: {book.loanDate}
        </span>
      )}
      {book.borrowedBy && (
        <span className="text-[10px] font-medium text-yellow-800 bg-yellow-50 border border-yellow-200 rounded px-1.5 py-0.5">
          Retirado por: {book.borrowedBy}
        </span>
      )}
    </div>
  );
}
