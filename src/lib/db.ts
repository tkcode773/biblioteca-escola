// src/lib/db.ts
// Gerenciamento de dados (in-memory + permanece no servidor)
// Para produção, substitua por um banco de dados real (PostgreSQL, etc.)

import type { Book } from "@/types/book";
import { initialBooks } from "@/lib/books";

const DB_FILE = "/tmp/biblioteca-escola-books.json";

function loadBooks(): Book[] {
  try {
    const fs = require("fs");
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Erro ao carregar books:", e);
  }
  // Primeira execução: começa com o acervo de exemplo.
  return [...initialBooks];
}

function saveBooks(books: Book[]) {
  try {
    const fs = require("fs");
    fs.writeFileSync(DB_FILE, JSON.stringify(books, null, 2));
  } catch (e) {
    console.error("Erro ao salvar books:", e);
  }
}

let booksCache: Book[] = loadBooks();

export function getBooks(): Book[] {
  return [...booksCache];
}

export function getBookById(id: string): Book | undefined {
  return booksCache.find((b) => b.id === id);
}

export function searchBooks(query: string): Book[] {
  const q = query.toLowerCase().trim();
  if (!q) return [...booksCache];
  return booksCache.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
  );
}

export function addBook(book: Omit<Book, "id">): Book {
  const newBook: Book = {
    ...book,
    id: `b_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  booksCache.push(newBook);
  saveBooks(booksCache);
  return newBook;
}

export function updateBook(id: string, data: Partial<Book>): Book | null {
  const index = booksCache.findIndex((b) => b.id === id);
  if (index === -1) return null;
  booksCache[index] = { ...booksCache[index], ...data };
  saveBooks(booksCache);
  return booksCache[index];
}

export function deleteBook(id: string): boolean {
  const index = booksCache.findIndex((b) => b.id === id);
  if (index === -1) return false;
  booksCache.splice(index, 1);
  saveBooks(booksCache);
  return true;
}

export function getBooksByCategory(category: string): Book[] {
  return booksCache.filter((b) => b.category === category);
}
