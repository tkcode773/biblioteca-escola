// src/app/login/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { verifyCredentials, setSession, toSessionUser } from "@/lib/store";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (searchParams.get("registered")) setJustRegistered(true);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await verifyCredentials(email, password);

      if (!user) {
        setError("Email ou senha inválidos.");
        setLoading(false);
        return;
      }

      setSession(toSessionUser(user));
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Erro ao entrar. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-800">Biblioteca Escolar</h1>
          <p className="text-zinc-500 mt-1">Acesse sua conta</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
          {justRegistered && (
            <div className="mb-5 text-sm text-green-700 bg-green-50 rounded-lg p-3">
              Conta criada com sucesso! Faça login para continuar.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Sua senha"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            <p>Não tem conta? &nbsp;</p>
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Cadastre-se
            </Link>
          </div>

          <div className="mt-4 text-xs text-zinc-400 space-y-1">
            <p className="font-medium text-zinc-500">Contas de demonstração:</p>
            <p>admin@biblioteca.com / admin123</p>
            <p>aluno@biblioteca.com / aluno123</p>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          <Link href="/" className="hover:text-zinc-600">
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
        <div className="flex min-h-screen items-center justify-center text-zinc-400">
          Carregando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
