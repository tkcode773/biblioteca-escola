// src/lib/store.ts
// Armazenamento no NAVEGADOR (localStorage).
//
// Por que assim: na Vercel cada requisição pode cair numa instância diferente e
// o sistema de arquivos é temporário — então dados guardados no servidor
// desaparecem. Com localStorage os dados persistem no aparelho de quem usa,
// sem precisar de banco de dados.
//
// Todas as leituras são seguras no servidor (SSR): se `window` não existir,
// devolvemos o acervo de exemplo.

import { initialBooks } from "@/lib/books";
import type { Book } from "@/types/book";
import type { UserRole } from "@/types/user";

// A chave é versionada sempre que o acervo de exemplo muda (capas corrigidas,
// títulos novos). Sem isso, quem já visitou o site continuaria com o acervo
// antigo guardado no navegador. As chaves antigas são migradas e removidas.
const BOOKS_KEY = "biblioteca:books:v3";
const BOOKS_KEYS_ANTIGAS = ["biblioteca:books:v2", "biblioteca:books:v1"];
const USERS_KEY = "biblioteca:users:v1";
const SESSION_KEY = "biblioteca:session:v1";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  /** hash bcrypt — nunca guardamos a senha em texto puro */
  password: string;
  role: UserRole;
  createdAt: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

function hasStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readJSON<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage cheio ou bloqueado — ignora silenciosamente
  }
}

/* ------------------------------------------------------------------ */
/* Livros                                                             */
/* ------------------------------------------------------------------ */

export function getBooks(): Book[] {
  const stored = readJSON<Book[] | null>(BOOKS_KEY, null);
  if (stored && stored.length > 0) return stored;

  // Primeira visita (ou migração de um acervo antigo): começa do acervo de exemplo.
  // Livros que o usuário cadastrou por conta própria são preservados, mas os
  // registros antigos de exemplo são trocados pelos novos (capas corretas).
  const idsDoExemplo = new Set(initialBooks.map((b) => b.id));
  const adicionadosPeloUsuario: Book[] = [];

  for (const chaveAntiga of BOOKS_KEYS_ANTIGAS) {
    const antigo = readJSON<Book[] | null>(chaveAntiga, null);
    for (const b of antigo ?? []) {
      if (!idsDoExemplo.has(b.id)) adicionadosPeloUsuario.push(b);
    }
  }

  const acervo = [...initialBooks, ...adicionadosPeloUsuario];
  writeJSON(BOOKS_KEY, acervo);

  if (hasStorage()) {
    for (const chaveAntiga of BOOKS_KEYS_ANTIGAS) {
      try {
        window.localStorage.removeItem(chaveAntiga);
      } catch {
        /* ignora */
      }
    }
  }

  return acervo;
}

export function saveBooks(books: Book[]): void {
  writeJSON(BOOKS_KEY, books);
}

export function getBookById(id: string): Book | undefined {
  return getBooks().find((b) => b.id === id);
}

export function searchBooks(query: string): Book[] {
  const q = query.toLowerCase().trim();
  const books = getBooks();
  if (!q) return books;
  return books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
  );
}

export function getBooksByCategory(category: string): Book[] {
  return getBooks().filter((b) => b.category === category);
}

export function addBook(data: Omit<Book, "id" | "createdAt">): Book {
  const books = getBooks();
  const newBook: Book = {
    ...data,
    id: `b_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  saveBooks([...books, newBook]);
  return newBook;
}

export function updateBook(id: string, data: Partial<Book>): Book | null {
  const books = getBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return null;
  const updated = { ...books[index], ...data };
  books[index] = updated;
  saveBooks(books);
  return updated;
}

export function deleteBook(id: string): boolean {
  const books = getBooks();
  const next = books.filter((b) => b.id !== id);
  if (next.length === books.length) return false;
  saveBooks(next);
  return true;
}

/** Volta o acervo aos dados de exemplo. */
export function resetBooks(): Book[] {
  writeJSON(BOOKS_KEY, initialBooks);
  return [...initialBooks];
}

/* ------------------------------------------------------------------ */
/* Usuários                                                           */
/* ------------------------------------------------------------------ */

/**
 * Usuários de demonstração. Os hashes bcrypt são gerados no primeiro uso
 * (import dinâmico, porque bcryptjs é pesado para carregar junto do bundle).
 */
const DEMO_USERS: Array<{
  id: string;
  name: string;
  email: string;
  plain: string;
  role: UserRole;
}> = [
  { id: "1", name: "Admin", email: "admin@biblioteca.com", plain: "admin123", role: "admin" },
  { id: "2", name: "Aluno", email: "aluno@biblioteca.com", plain: "aluno123", role: "aluno" },
];

export function getUsers(): StoredUser[] {
  return readJSON<StoredUser[]>(USERS_KEY, []);
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const target = email.trim().toLowerCase();
  return getUsers().find((u) => u.email.toLowerCase() === target);
}

export function toSessionUser(user: StoredUser): SessionUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

/**
 * Garante que os usuários de demonstração existam (com hash) no localStorage.
 * Precisa ser chamada no cliente antes de qualquer login.
 */
export async function ensureUsersSeeded(): Promise<void> {
  if (!hasStorage()) return;
  const users = getUsers();

  const missing = DEMO_USERS.filter(
    (demo) => !users.some((u) => u.email.toLowerCase() === demo.email.toLowerCase())
  );
  const broken = users.filter(
    (u) => DEMO_USERS.some((d) => d.email.toLowerCase() === u.email.toLowerCase()) && !u.password
  );

  if (missing.length === 0 && broken.length === 0) return;

  const bcrypt = (await import("bcryptjs")).default;
  const next = [...users];

  for (const demo of missing) {
    next.push({
      id: demo.id,
      name: demo.name,
      email: demo.email,
      password: bcrypt.hashSync(demo.plain, 10),
      role: demo.role,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  }

  for (const b of broken) {
    const demo = DEMO_USERS.find((d) => d.email.toLowerCase() === b.email.toLowerCase())!;
    b.password = bcrypt.hashSync(demo.plain, 10);
  }

  writeJSON(USERS_KEY, next);
}

/** Cria uma conta. Lança erro se o email já existir. */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<StoredUser> {
  await ensureUsersSeeded();

  const email = data.email.trim();
  if (findUserByEmail(email)) {
    throw new Error("Email já cadastrado");
  }

  const bcrypt = (await import("bcryptjs")).default;
  const user: StoredUser = {
    id: `u_${Date.now()}`,
    name: data.name.trim(),
    email,
    password: bcrypt.hashSync(data.password, 10),
    role: data.role ?? "aluno",
    createdAt: new Date().toISOString(),
  };

  writeJSON(USERS_KEY, [...getUsers(), user]);
  return user;
}

/** Valida email + senha. Devolve o usuário ou null. */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<StoredUser | null> {
  await ensureUsersSeeded();
  const user = findUserByEmail(email);
  if (!user || !user.password) return null;

  const bcrypt = (await import("bcryptjs")).default;
  return bcrypt.compareSync(password, user.password) ? user : null;
}

/* ------------------------------------------------------------------ */
/* Sessão (quem está logado)                                          */
/* ------------------------------------------------------------------ */

export function getSession(): SessionUser | null {
  return readJSON<SessionUser | null>(SESSION_KEY, null);
}

export function setSession(user: SessionUser): void {
  writeJSON(SESSION_KEY, user);
}

export function clearSession(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignora */
  }
}
