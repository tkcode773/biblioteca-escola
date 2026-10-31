// src/app/team/page.tsx
import Link from "next/link";

const teamMembers = [
  {
    name: "Desenvolvedor 1",
    role: "Lead de Frontend",
    bio: "Responsável pela interface e experiência do usuário.",
    avatar: "https://via.placeholder.com/150/3B82F6/FFFFFF?text=D1",
  },
  {
    name: "Desenvolvedor 2",
    role: "Backend & IA",
    bio: "Focado em APIs, banco de dados e assistentes de IA.",
    avatar: "https://via.placeholder.com/150/10B981/FFFFFF?text=D2",
  },
  {
    name: "Desenvolvedor 3",
    role: "UX/UI Designer",
    bio: "Criação de protótipos e design de interfaces.",
    avatar: "https://via.placeholder.com/150/8B5CF6/FFFFFF?text=D3",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-zinc-800">
            📚 Biblioteca Escolar
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">Início</Link>
            <Link href="/catalog" className="text-sm text-zinc-500 hover:text-zinc-800">Catálogo</Link>
            <Link href="/chat" className="text-sm text-zinc-500 hover:text-zinc-800">Chat IA</Link>
            <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-800">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-zinc-800">Equipe de Desenvolvimento</h1>
          <p className="text-zinc-500 mt-2 max-w-xl mx-auto">
            Alguns destaques sobre quem construiu esta biblioteca online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-zinc-800">{member.name}</h2>
              <p className="text-blue-600 font-medium text-sm">{member.role}</p>
              <p className="text-sm text-zinc-500 mt-2">{member.bio}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-400">
            Projeto desenvolvido para o curso técnico de desenvolvimento web.
          </p>
        </div>
      </main>
    </div>
  );
}
