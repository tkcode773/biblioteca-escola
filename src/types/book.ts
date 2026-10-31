// Tipo de dados de um livro da biblioteca

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  description: string;
  cover: string; // URL da capa
  available: boolean;
  /** Só quando `available` é false — formato DD/MM/AAAA */
  loanDate?: string;
  /** Quem está com o livro */
  borrowedBy?: string;
  clicks?: number;
  rating?: number;
  createdAt?: string;
};

export const CATEGORIES = [
  "Ficção",
  "Conto",
  "Clássicos",
  "Poesia",
  "Truques",
  "Biografia",
  "Ciência",
  "História",
  "Artes",
  "Mídia",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function getCategories(): Category[] {
  return [...CATEGORIES];
}
