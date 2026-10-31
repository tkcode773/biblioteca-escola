"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session, User } from "next-auth";

type NavItem = {
  label: string;
  href: string;
  adminOnly?: boolean;
};

export function Navbar({ items }: { items: NavItem[] }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-800">
          <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className="hidden sm:inline">Biblioteca Escolar</span>
        </Link>
        <div className="flex items-center gap-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                (session?.user as any)?.role === "admin" && item.adminOnly
                  ? "bg-blue-600 text-white"
                  : session?.user
                  ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  : "text-zinc-400 cursor-not-allowed"
              }`}
              style={{ pointerEvents: session?.user ? "auto" : "none" }}
            >
              {item.label}
            </Link>
          ))}

          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-700">{session.user.name}</span>
              {(session.user as any).role && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {(session.user as any).role}
                </span>
              )}
              <button
                onClick={() => fetch("/api/auth/signout", { method: "POST" }).then(() => { window.location.href = "/"; })}
                className="text-sm text-zinc-500 hover:text-red-600"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900">Entrar</Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
