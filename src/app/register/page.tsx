// src/app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/store";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    // Regras de controle de acesso definidas no projeto
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome.trim())) {
      setErro("O nome deve conter apenas letras, sem números.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErro("Informe um email válido (ex: paulo123@hotmail.com).");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (!/[A-Za-z]/.test(senha) || !/[0-9]/.test(senha) || !/[^A-Za-z0-9]/.test(senha)) {
      setErro("A senha deve conter letras, números e caracteres especiais.");
      return;
    }

    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      await createUser({ name: nome.trim(), email: email.trim(), password: senha, role: "aluno" });
      router.push("/login?registered=1");
      router.refresh();
    } catch (err: any) {
      setErro(err?.message ?? "Erro ao criar conta. Tente novamente.");
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
          <h1 className="text-2xl font-bold tracking-tight text-[#1e293b]">Criar conta</h1>
          <p className="mt-1 text-sm text-[#64748b]">Cadastre-se para usar a biblioteca</p>

          <form onSubmit={cadastrar} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#334155]">Nome completo</span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={campos}
                placeholder="Ex: Paulo Neto"
                required
              />
              <span className="mt-1 block text-xs text-[#94a3b8]">Somente letras.</span>
            </label>

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
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
              <span className="mt-1 block text-xs text-[#94a3b8]">
                Mínimo 8 caracteres, com letras, números e caractere especial.
              </span>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#334155]">Confirmar senha</span>
              <input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                className={campos}
                placeholder="Repita a senha"
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
              {carregando ? "Criando conta..." : "Cadastrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#64748b]">
            Já tem conta?{" "}
            <Link href="/login" className="font-semibold text-[#1d4ed8] hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
