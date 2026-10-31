# 📚 Biblioteca Escolar

Site de biblioteca online para o projeto do curso técnico. Permite pesquisar o acervo,
ver a situação de cada livro (disponível ou alugado), gerenciar os livros (CRUD) e
conversar com um assistente de IA.

## 🚀 Tecnologias

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Vercel** para hospedagem

## 💾 Como os dados são guardados

Os dados (livros, usuários e sessão) ficam no **`localStorage` do navegador**
(`src/lib/store.ts`), com o acervo de exemplo em `src/lib/books.ts` como ponto de partida.

Motivo: na Vercel o sistema de arquivos é temporário e cada acesso pode cair numa
instância diferente — guardar no servidor faria os dados sumirem. Com `localStorage`
tudo funciona na Vercel sem precisar contratar banco de dados.

Consequência: **cada navegador tem os seus próprios dados.** O acervo de exemplo aparece
para todo mundo, mas livros adicionados ficam só no aparelho de quem adicionou.
Para dados compartilhados entre todos os visitantes seria necessário um banco
(Vercel Postgres, Neon, Supabase...).

## 🔑 Contas de demonstração

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | `admin@biblioteca.com` | `admin123` |
| Aluno | `aluno@biblioteca.com` | `aluno123` |

Também é possível criar uma conta nova em `/register` e entrar com ela.

## ✅ Regras de validação (controle de acesso)

- **Nome**: apenas letras (sem números)
- **Email**: precisa ter formato válido (`nome@dominio.com`)
- **Senha**: mínimo 8 caracteres, com letras, números e caractere especial

## 🗺️ Páginas

| Rota | O que faz |
|------|-----------|
| `/` | Início: barra de busca com lupa + grade de livros em destaque |
| `/catalog` | Catálogo completo, com filtro por categoria e busca |
| `/catalog/[id]` | Detalhes de um livro |
| `/chat` | Assistente de IA da biblioteca |
| `/team` | Página da equipe |
| `/login` | Login |
| `/register` | Cadastro |
| `/dashboard` | Painel: criar, editar e excluir livros |

## 🛠️ Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

Para testar como em produção:

```bash
npm run build
npm run start
```

## ☁️ Deploy na Vercel

1. Suba este repositório para o **GitHub**.
2. Em https://vercel.com/new, importe o repositório.
3. A Vercel detecta o Next.js sozinha — não precisa mudar nada no build.
4. (Opcional) Em **Settings → Environment Variables**, adicione:

   | Nome | Para que serve |
   |------|----------------|
   | `RIVER_API_KEY` | Chave da API do River AI — **só** necessária para o Chat IA funcionar |
   | `RIVER_MODEL` | Modelo usado pelo chat (ex: `Qwen/Qwen3.5-9B`) |

5. Clique em **Deploy**.

> O Chat IA responde pelo endpoint `/api/chat`, que roda no servidor justamente para
> **não expor a chave da API no navegador**.

## 📁 Estrutura

```
src/
├── app/
│   ├── (pages)/            # páginas públicas
│   │   ├── page.tsx        # início (busca + destaques)
│   │   ├── catalog/        # catálogo e detalhes
│   │   ├── chat/           # chat com IA
│   │   └── search/         # resultados de busca
│   ├── dashboard/          # painel CRUD
│   ├── login/ register/    # acesso
│   ├── team/               # equipe
│   └── api/                # rotas de servidor (chat IA e uma API REST)
├── components/             # BookCard, BookStatus, AIChat...
├── lib/
│   ├── store.ts            # ⭐ dados no localStorage (livros, usuários, sessão)
│   ├── books.ts            # acervo de exemplo
│   └── river-ai.ts         # cliente da API de IA
└── types/                  # tipos TypeScript
```

## 📝 Observações para quem for avaliar

- A pasta `src/app/api/` tem uma **API REST** (`/api/books`, `/api/users`) que guarda
  dados temporariamente no servidor. Ela continua funcionando, mas a interface do site
  usa o `localStorage` (por causa da hospedagem na Vercel, como explicado acima).
- A rota `/api/auth/...` (NextAuth) também segue no projeto, sem uso pela interface.
- **Nunca** suba o arquivo `.env.local` — ele já está no `.gitignore`.
