// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBooks, addBook, updateBook, deleteBook, resetBooks } from "@/lib/store";
import { getSession, clearSession, type SessionUser } from "@/lib/store";
import { CATEGORIES } from "@/types/book";
import type { Book } from "@/types/book";

type FormState = {
  title: string;
  author: string;
  category: string;
  year: number;
  description: string;
  cover: string;
  available: boolean;
  loanDate: string;
  borrowedBy: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  author: "",
  category: "",
  year: 0,
  description: "",
  cover: "",
  available: true,
  loanDate: "",
  borrowedBy: "",
};

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [user, setUser] = useState<SessionUser | null>(null);
  const router = useRouter();

  const refresh = () => setBooks(getBooks());

  useEffect(() => {
    setUser(getSession());
    refresh();
    // Next 16 (Cache Components): não ler `new Date()` durante o prerender.
    setFormData((f) => ({ ...f, year: new Date().getFullYear() }));
    setReady(true);
  }, []);

  const resetForm = (year = new Date().getFullYear()) =>
    setFormData({ ...EMPTY_FORM, year });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.author.trim() || !formData.category) {
      setError("Título, autor e categoria são obrigatórios.");
      return;
    }

    const payload: Omit<Book, "id" | "createdAt"> = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      category: formData.category,
      year: formData.year,
      description: formData.description.trim(),
      cover: formData.cover.trim(),
      available: formData.available,
      loanDate: formData.available ? undefined : formData.loanDate.trim(),
      borrowedBy: formData.available ? undefined : formData.borrowedBy.trim(),
    };

    if (editingId) {
      updateBook(editingId, payload);
    } else {
      addBook(payload);
    }

    setShowForm(false);
    setEditingId(null);
    resetForm();
    refresh();
  };

  const handleEdit = (book: Book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      year: book.year,
      description: book.description,
      cover: book.cover,
      available: book.available,
      loanDate: book.loanDate ?? "",
      borrowedBy: book.borrowedBy ?? "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este livro?")) return;
    deleteBook(id);
    refresh();
  };

  const handleLogout = () => {
    clearSession();
    router.push("/");
    router.refresh();
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-zinc-800">
            📚 Biblioteca Escolar
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:inline text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                {user.name} · {user.role}
              </span>
            )}
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
              Voltar
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="text-sm text-zinc-500 hover:text-red-600"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">
              {editingId ? "Editar Livro" : "Gerenciar Livros"}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {editingId ? "Atualize as informações do livro" : "Adicione, edite ou remova livros do acervo"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (confirm("Restaurar o acervo de exemplo? As alterações feitas aqui serão perdidas.")) {
                  resetBooks();
                  refresh();
                }
              }}
              className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 text-sm font-medium"
            >
              Restaurar acervo
            </button>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                resetForm();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {showForm ? "Cancelar" : "+ Novo Livro"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-zinc-800 mb-4">
              {editingId ? "Editar Livro" : "Novo Livro"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Autor *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Ano
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Capa (URL)
                </label>
                <input
                  type="text"
                  value={formData.cover}
                  onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Situação
                </label>
                <select
                  value={formData.available ? "disponivel" : "alugado"}
                  onChange={(e) =>
                    setFormData({ ...formData, available: e.target.value === "disponivel" })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="disponivel">Disponível na estante</option>
                  <option value="alugado">Alugado</option>
                </select>
              </div>

              {!formData.available && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Data do empréstimo
                    </label>
                    <input
                      type="text"
                      value={formData.loanDate}
                      onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="DD/MM/AAAA"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Retirado por
                    </label>
                    <input
                      type="text"
                      value={formData.borrowedBy}
                      onChange={(e) => setFormData({ ...formData, borrowedBy: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Ex: Sala de Leituras"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                {editingId ? "Atualizar" : "Criar Livro"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 border border-zinc-300 rounded-lg text-zinc-600 hover:bg-zinc-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {books.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-lg">Nenhum livro cadastrado ainda.</p>
            <p className="text-sm mt-1">Clique em &quot;+ Novo Livro&quot; para adicionar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <div key={book.id} className="border border-zinc-200 rounded-xl p-4 bg-white">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-800">{book.title}</h3>
                    <p className="text-sm text-zinc-500">{book.author}</p>
                    <p className="text-xs text-zinc-400 mt-1">{book.category} • {book.year}</p>
                    <span
                      className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                        book.available
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {book.available ? "Disponível" : "Alugado"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-1 hover:bg-blue-100 rounded text-blue-600"
                      title="Editar"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 012.828 0l.707.707a2 2 0 010 2.828l-7.071 7.071a8 8 0 11-1.414-1.414l7.071-7.071a2 2 0 010-2.828l-.707-.707zM6.586 6.586a2 2 0 012.828 0l3.536 3.536a2 2 0 010 2.828l-7.071 7.071a8 8 0 11-1.414-1.414l7.071-7.071a2 2 0 010-2.828l-.707-.707z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                      title="Excluir"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm0 6a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-zinc-600 line-clamp-2">{book.description}</p>
                {!book.available && (book.loanDate || book.borrowedBy) && (
                  <p className="mt-2 text-xs text-yellow-700">
                    {book.loanDate && <>Empréstimo: {book.loanDate} </>}
                    {book.borrowedBy && <>· {book.borrowedBy}</>}
                  </p>
                )}
                <Link href={`/catalog/${book.id}`} className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                  Ver detalhes
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
