// src/app/team/page.tsx
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

type Integrante = {
  nome: string;
  funcao: string;
  bio: string;
  cor: string;
  /** Quando existir, usa a foto de public/equipe/. Sem ela, usa as iniciais. */
  foto?: string;
};

const EQUIPE: Integrante[] = [
  {
    nome: "Manoel Carlos",
    funcao: "Front-end e design",
    bio: "Responsável pelas telas, pela identidade visual e pela experiência de quem usa o site.",
    cor: "#3b82f6",
  },
  {
    nome: "Victor Gabriel",
    funcao: "Back-end e dados",
    bio: "Cuida do acervo, das regras de empréstimo e da estrutura de dados da biblioteca.",
    cor: "#0ea5e9",
  },
  {
    nome: "Bárbara Rafaely",
    funcao: "Interface e testes",
    bio: "Revisa a usabilidade das telas e testa as funcionalidades antes de cada entrega.",
    cor: "#6366f1",
  },
  {
    nome: "Gustavo Fernandes",
    funcao: "Documentação e apresentação",
    bio: "Organiza a documentação do projeto e prepara a apresentação para a banca.",
    cor: "#8b5cf6",
  },
];

/** Iniciais do nome: "Manoel Carlos" -> "MC" */
function iniciais(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <SiteHeader ativo="/team" />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-[#eff6ff] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1d4ed8]">
            Quem fez
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1e293b] sm:text-4xl">
            Nossa equipe
          </h1>
          <p className="mt-3 text-[#64748b]">
            Somos estudantes do curso técnico e desenvolvemos esta biblioteca online como projeto da
            disciplina — do levantamento dos requisitos até a publicação na Vercel.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EQUIPE.map((p) => (
            <article
              key={p.nome}
              className="rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {p.foto ? (
                <img
                  src={p.foto}
                  alt={`Foto de ${p.nome}`}
                  className="mx-auto h-20 w-20 rounded-2xl object-cover shadow-sm ring-2 ring-[#eff6ff]"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-sm"
                  style={{ background: p.cor }}
                >
                  {iniciais(p.nome)}
                </div>
              )}

              <h2 className="mt-4 text-lg font-bold text-[#1e293b]">{p.nome}</h2>
              <p className="text-sm font-semibold text-[#1d4ed8]">{p.funcao}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{p.bio}</p>
            </article>
          ))}
        </div>

        <section className="mx-auto mt-14 max-w-3xl rounded-2xl border border-[#e2e8f0] bg-white p-7 shadow-sm">
          <h2 className="text-lg font-bold text-[#1e293b]">Sobre o projeto</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#475569]">
            <li>
              • Site de biblioteca escolar com busca no acervo, catálogo por categoria e página de
              detalhes de cada livro.
            </li>
            <li>
              • Situação do exemplar sempre visível: disponível na estante ou alugado, com a data do
              empréstimo e quem retirou.
            </li>
            <li>
              • Controle de acesso com login, cadastro e validação de nome, email e senha — somente
              administradores gerenciam o acervo.
            </li>
            <li>• Painel administrativo para cadastrar, editar e excluir livros.</li>
            <li>• Desenvolvido em Next.js e publicado na Vercel.</li>
          </ul>

          <Link
            href="/catalog"
            className="mt-6 inline-block rounded-full bg-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
          >
            Ver o catálogo
          </Link>
        </section>
      </main>

      <footer className="border-t border-[#e2e8f0] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 py-8 text-center text-xs text-[#94a3b8] sm:px-6">
          <p className="text-sm font-semibold text-[#64748b]">📚 Biblioteca Escolar</p>
          <p>Projeto do curso técnico · dados guardados no seu navegador</p>
        </div>
      </footer>
    </div>
  );
}
