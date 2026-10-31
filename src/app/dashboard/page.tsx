// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  resetBooks,
  getSession,
  clearSession,
  type SessionUser,
} from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { formatYear } from "@/lib/format";
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

const FORM_VAZIO: FormState = {
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
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(FORM_VAZIO);
  const [usuario, setUsuario] = useState<SessionUser | null>(null);
  const [busca, setBusca] = useState("");
  const router = useRouter();

  const recarregar = () => setBooks(getBooks());

  useEffect(() => {
    setUsuario(getSession());
    recarregar();
    // Next 16 (Cache Components): não ler `new Date()` durante o prerender.
    setForm((f) => ({ ...f, year: new Date().getFullYear() }));
    setPronto(true);
  }, []);

  const limparForm = (ano = new Date().getFullYear()) => setForm({ ...FORM_VAZIO, year: ano });

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!form.title.trim() || !form.author.trim() || !form.category) {
      setErro("Título, autor e categoria são obrigatórios.");
      return;
    }

    const dados: Omit<Book, "id" | "createdAt"> = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category,
      year: Number(form.year) || new Date().getFullYear(),
      description: form.description.trim(),
      cover: form.cover.trim(),
      available: form.available,
      loanDate: form.available ? undefined : form.loanDate.trim(),
      borrowedBy: form.available ? undefined : form.borrowedBy.trim(),
    };

    if (editandoId) updateBook(editandoId, dados);
    else addBook(dados);

    setMostrarForm(false);
    setEditandoId(null);
    limparForm();
    recarregar();
  };

  const editar = (b: Book) => {
    setEditandoId(b.id);
    setForm({
      title: b.title,
      author: b.author,
      category: b.category,
      year: b.year,
      description: b.description,
      cover: b.cover,
      available: b.available,
      loanDate: b.loanDate ?? "",
      borrowedBy: b.borrowedBy ?? "",
    });
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const excluir = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este livro?")) return;
    deleteBook(id);
    recarregar();
  };

  const sair = () => {
    clearSession();
    router.push("/");
    router.refresh();
  };

  const filtrados = books.filter((b) => {
    const q = busca.toLowerCase().trim();
    if (!q) return true;
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });

  // ---- Controle de acesso ----
  // Só administradores gerenciam o acervo. Alunos (e visitantes sem login)
  // não podem editar nem excluir nada.
  const ehAdmin = usuario?.role === "admin";

  if (!ehAdmin) {
    return (
      <div className="min-h-screen bg-[#f0f4f8]">
        <SiteHeader ativo="/dashboard" />
        <main className="mx-auto max-w-xl px-4 py-20 sm:px-6">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#1d4ed8]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#1e293b]">
              {usuario ? "Acesso restrito" : "Entre para continuar"}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-[#64748b]">
              {usuario ? (
                <>
                  Sua conta é de <strong className="text-[#1e293b]">{usuario.role}</strong>. Somente
                  contas de <strong className="text-[#1e293b]">administrador</strong> podem
                  cadastrar, editar ou excluir livros do acervo.
                </>
              ) : (
                <>
                  O painel de gerenciamento é exclusivo para administradores da biblioteca.
                </>
              )}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {!usuario && (
                <Link
                  href="/login?callbackUrl=/dashboard"
                  className="rounded-full bg-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2563eb]"
                >
                  Entrar
                </Link>
              )}
              {usuario && (
                <button
                  type="button"
                  onClick={sair}
                  className="rounded-full border border-[#e2e8f0] px-5 py-2.5 text-sm font-medium text-[#475569] transition hover:border-red-300 hover:text-red-600"
                >
                  Sair da conta
                </button>
              )}
              <Link
                href="/catalog"
                className="rounded-full border border-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-[#1d4ed8] transition hover:bg-[#3b82f6] hover:text-white"
              >
                Ver o catálogo
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[#94a3b8]">
            Conta de demonstração com acesso total: <strong>admin@biblioteca.com</strong> / admin123
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <SiteHeader ativo="/dashboard" />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1e293b] sm:text-3xl">
              Gerenciar acervo
            </h1>
            <p className="mt-1 text-sm text-[#64748b]">
              {usuario ? (
                <>
                  Conectado como <strong className="text-[#1d4ed8]">{usuario.name}</strong> ·{" "}
                  {usuario.role}
                </>
              ) : (
                <>
                  Você não está conectado.{" "}
                  <Link href="/login" className="font-semibold text-[#1d4ed8] underline">
                    Entrar
                  </Link>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {usuario && (
              <button
                type="button"
                onClick={sair}
                className="rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition hover:border-red-300 hover:text-red-600"
              >
                Sair
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (confirm("Restaurar o acervo de exemplo? As alterações feitas aqui serão perdidas.")) {
                  resetBooks();
                  recarregar();
                }
              }}
              className="rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition hover:border-[#3b82f6] hover:text-[#1d4ed8]"
            >
              Restaurar acervo
            </button>
            <button
              type="button"
              onClick={() => {
                setMostrarForm(!mostrarForm);
                setEditandoId(null);
                limparForm();
              }}
              className="rounded-full bg-[#3b82f6] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2563eb]"
            >
              {mostrarForm ? "Cancelar" : "+ Novo livro"}
            </button>
          </div>
        </header>

        {erro && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {mostrarForm && (
          <form
            onSubmit={salvar}
            className="mb-8 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-6"
          >
            <h2 className="mb-4 text-lg font-bold text-[#1e293b]">
              {editandoId ? "Editar livro" : "Novo livro"}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 block">
                <span className="mb-1 block text-sm font-medium text-[#334155]">Título *</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25"
                  required
                />
              </label>

              <label className="sm:col-span-2 block">
                <span className="mb-1 block text-sm font-medium text-[#334155]">Autor *</span>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#334155]">Categoria *</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm focus:border-[#3b82f6] focus:bg-white focus:outline-none"
                  required
                >
                  <option value="">Selecione...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#334155]">
                  Ano <span className="text-[#94a3b8]">(negativo = a.C.)</span>
                </span>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25"
                />
              </label>

              <label className="sm:col-span-2 block">
                <span className="mb-1 block text-sm font-medium text-[#334155]">Descrição</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25"
                />
              </label>

              <label className="sm:col-span-2 block">
                <span className="mb-1 block text-sm font-medium text-[#334155]">Capa (URL)</span>
                <input
                  type="text"
                  value={form.cover}
                  onChange={(e) => setForm({ ...form, cover: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#334155]">Situação</span>
                <select
                  value={form.available ? "disponivel" : "alugado"}
                  onChange={(e) => setForm({ ...form, available: e.target.value === "disponivel" })}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm focus:border-[#3b82f6] focus:bg-white focus:outline-none"
                >
                  <option value="disponivel">Disponível na estante</option>
                  <option value="alugado">Alugado</option>
                </select>
              </label>

              {!form.available && (
                <>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#334155]">
                      Data do empréstimo
                    </span>
                    <input
                      type="text"
                      value={form.loanDate}
                      onChange={(e) => setForm({ ...form, loanDate: e.target.value })}
                      placeholder="DD/MM/AAAA"
                      className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25"
                    />
                  </label>
                  <label className="sm:col-span-2 block">
                    <span className="mb-1 block text-sm font-medium text-[#334155]">Retirado por</span>
                    <input
                      type="text"
                      value={form.borrowedBy}
                      onChange={(e) => setForm({ ...form, borrowedBy: e.target.value })}
                      placeholder="Ex: Sala de Leituras"
                      className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25"
                    />
                  </label>
                </>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                className="rounded-full bg-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
              >
                {editandoId ? "Atualizar" : "Criar livro"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarForm(false);
                  setEditandoId(null);
                }}
                className="rounded-full border border-[#e2e8f0] px-5 py-2.5 text-sm font-medium text-[#475569] transition hover:bg-[#f8fafc]"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#64748b]">
            <strong className="text-[#1e293b]">{filtrados.length}</strong> de {books.length} livros
          </p>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Filtrar a lista..."
            className="w-full max-w-xs rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25"
          />
        </div>

        {!pronto ? (
          <p className="py-10 text-center text-[#94a3b8]">Carregando...</p>
        ) : filtrados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] bg-white py-16 text-center">
            <p className="text-lg font-semibold text-[#475569]">Nenhum livro aqui</p>
            <p className="mt-1 text-sm text-[#94a3b8]">Use “+ Novo livro” para adicionar.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((b) => (
              <li
                key={b.id}
                className="flex gap-3 rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-sm"
              >
                <img
                  src={b.cover}
                  alt=""
                  className="h-24 w-16 shrink-0 rounded-lg bg-[#e2e8f0] object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-[#1e293b]">{b.title}</h3>
                      <p className="truncate text-xs text-[#64748b]">{b.author}</p>
                      <p className="mt-0.5 text-[11px] text-[#94a3b8]">
                        {b.category} · {formatYear(b.year)}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => editar(b)}
                        title="Editar"
                        aria-label={`Editar ${b.title}`}
                        className="rounded-lg p-2 text-[#3b82f6] transition hover:bg-[#eff6ff]"
                      >
                        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-7.071 7.071a2 2 0 01-2.828-2.828l7.071-7.071z" />
                          <path d="M3 15a2 2 0 012-2h2l-4 4v-2z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => excluir(b.id)}
                        title="Excluir"
                        aria-label={`Excluir ${b.title}`}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                      >
                        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 6a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        b.available
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {b.available ? "Disponível" : "Alugado"}
                    </span>
                    {!b.available && b.loanDate && (
                      <span className="text-[10px] text-amber-700">Empréstimo: {b.loanDate}</span>
                    )}
                    <Link
                      href={`/catalog/${b.id}`}
                      className="ml-auto text-xs font-semibold text-[#1d4ed8] hover:underline"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
