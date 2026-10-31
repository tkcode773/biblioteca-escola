"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, clearSession, type SessionUser } from "@/lib/store";

const LINKS = [
  { label: "Início", href: "/" },
  { label: "Catálogo", href: "/catalog" },
  { label: "Equipe", href: "/team" },
  { label: "Painel", href: "/dashboard" },
];

/**
 * Cabeçalho fixo do site.
 * O link ativo vem por prop em vez de `usePathname()`: hooks de URL em Client
 * Component exigem <Suspense> e quebrariam o prerender das rotas dinâmicas.
 */
export function SiteHeader({ ativo = "" }: { ativo?: string }) {
  const [busca, setBusca] = useState("");
  const [usuario, setUsuario] = useState<SessionUser | null>(null);
  const router = useRouter();

  // A sessão vive no localStorage: lê depois de montar.
  useEffect(() => {
    setUsuario(getSession());
  }, []);

  const sair = () => {
    clearSession();
    setUsuario(null);
    router.push("/");
    router.refresh();
  };

  const enviarBusca = (e: React.FormEvent) => {
    e.preventDefault();
    const termo = busca.trim();
    router.push(termo ? `/search?q=${encodeURIComponent(termo)}` : "/catalog");
  };

  const estaAtivo = (href: string) => href === ativo;

  return (
    <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3b82f6] text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-[#1e293b] sm:inline">
            Biblioteca Escolar
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                estaAtivo(l.href)
                  ? "bg-[#eff6ff] text-[#1d4ed8]"
                  : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#1e293b]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={enviarBusca} className="relative ml-auto w-full max-w-xs">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#94a3b8]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar livro ou autor..."
            aria-label="Buscar livro ou autor"
            className="w-full rounded-full border border-[#e2e8f0] bg-[#f8fafc] py-2 pl-9 pr-3 text-sm text-[#1e293b] placeholder-[#94a3b8] transition focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25"
          />
        </form>

        {usuario ? (
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <span className="text-sm font-medium text-[#475569]">{usuario.name}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                usuario.role === "admin"
                  ? "bg-[#eff6ff] text-[#1d4ed8]"
                  : "bg-[#f1f5f9] text-[#64748b]"
              }`}
            >
              {usuario.role}
            </span>
            <button
              type="button"
              onClick={sair}
              className="text-sm text-[#94a3b8] transition hover:text-red-600"
            >
              Sair
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden shrink-0 rounded-full bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2563eb] sm:inline-block"
          >
            Entrar
          </Link>
        )}
      </div>

      <nav className="no-scrollbar flex gap-1 overflow-x-auto border-t border-[#f1f5f9] px-4 pb-2 md:hidden">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              estaAtivo(l.href) ? "bg-[#eff6ff] text-[#1d4ed8]" : "text-[#475569]"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
