// src/app/login/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyCredentials, setSession, toSessionUser } from "@/lib/store";

function FormularioLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [cadastrou, setCadastrou] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const destino = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (searchParams.get("registered")) setCadastrou(true);
  }, [searchParams]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const usuario = await verifyCredentials(email, senha);

      if (!usuario) {
        setErro("Email ou senha inválidos.");
        setCarregando(false);
        return;
      }

      setSession(toSessionUser(usuario));
      router.push(destino);
      router.refresh();
    } catch {
      setErro("Erro ao entrar. Tente novamente.");
      setCarregando(false);
    }
  }

  const campos =
    "w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2.5 text-sm text-[#1e293b] transition focus:border-[#3b82f6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4f8] px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3b82f6] text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight text-[#1e293b]">
            Biblioteca Escolar
          </span>
        </Link>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-7 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-[#1e293b]">Entrar</h1>
          <p className="mt-1 text-sm text-[#64748b]">Acesse sua conta da biblioteca</p>

          {cadastrou && (
            <div className="mt-5 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 ring-1 ring-emerald-200">
              Conta criada com sucesso! Agora faça login.
            </div>
          )}

          <form onSubmit={entrar} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#334155]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={campos}
                placeholder="seu@email.com"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#334155]">Senha</span>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={campos}
                placeholder="Sua senha"
                required
              />
            </label>

            {erro && (
              <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-full bg-[#3b82f6] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2563eb] disabled:opacity-60"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#64748b]">
            Não tem conta?{" "}
            <Link href="/register" className="font-semibold text-[#1d4ed8] hover:underline">
              Cadastre-se
            </Link>
          </p>

          <div className="mt-6 rounded-xl bg-[#f8fafc] p-4 text-xs text-[#64748b] ring-1 ring-[#e2e8f0]">
            <p className="font-semibold text-[#475569]">Contas de demonstração</p>
            <p className="mt-1">admin@biblioteca.com · admin123</p>
            <p>aluno@biblioteca.com · aluno123</p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#94a3b8]">
          <Link href="/" className="hover:text-[#475569]">
            ← Voltar para a biblioteca
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[#94a3b8]">
          Carregando...
        </div>
      }
    >
      <FormularioLogin />
    </Suspense>
  );
}
