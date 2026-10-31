# 📚 Biblioteca Escolar

Site de biblioteca online para o projeto do curso técnico. Tem busca no acervo, catálogo
por categoria, página de detalhes de cada livro, controle de acesso com login e cadastro,
e um painel para gerenciar o acervo.

## 🚀 Tecnologias

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Vercel** para hospedagem

## 🎨 Visual

Layout no estilo "streaming" de livros: um destaque principal com a capa grande, prateleiras
horizontais navegáveis por categoria e cartazes de capa com a descrição aparecendo ao passar
o mouse.

Paleta: azul claro `#3B82F6`, branco e cinza suave `#F0F4F8`. O modo escuro automático do
sistema foi desligado de propósito, porque deixava o site com fundo preto em celulares
configurados em modo escuro.

## 🖼️ Capas

Todas as capas são imagens reais do [Open Library](https://covers.openlibrary.org)
(hospedagem pública da Internet Archive), verificadas uma a uma antes de entrar no projeto.
Se alguma capa falhar ao carregar, o cartaz mostra automaticamente uma capa gerada por CSS
com o título e o autor, então nenhum livro aparece sem imagem.

## 💾 Como os dados são guardados

Os dados (livros, usuários e sessão) ficam no **`localStorage` do navegador**
(`src/lib/store.ts`), com o acervo de exemplo em `src/lib/books.ts` como ponto de partida.

Motivo: na Vercel o sistema de arquivos é temporário e cada acesso pode cair numa instância
diferente — guardar no servidor faria os dados sumirem. Com `localStorage` tudo funciona na
Vercel sem precisar contratar banco de dados.

Consequência: **cada navegador tem os seus próprios dados.** O acervo de exemplo aparece
para todo mundo, mas livros adicionados ficam só no aparelho de quem adicionou. Para dados
compartilhados entre todos os visitantes seria necessário um banco (Vercel Postgres, Neon,
Supabase...).

As senhas são guardadas com hash **bcrypt** (inclusive no navegador) — nunca em texto puro.

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
| `/` | Início: destaque da semana, números do acervo e prateleiras por categoria |
| `/catalog` | Catálogo completo, com busca, filtro por categoria e ordenação |
| `/catalog/[id]` | Detalhes do livro + sugestões relacionadas |
| `/search` | Resultados da busca (usada pelo campo do cabeçalho) |
| `/team` | Página da equipe e resumo do projeto |
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
3. A Vercel detecta o Next.js sozinha — não precisa configurar nada.
4. Clique em **Deploy**.

Não é preciso configurar nenhuma variável de ambiente: o site funciona por completo sem
chaves de API.

## 📁 Estrutura

```
src/
├── app/
│   ├── (pages)/            # páginas públicas
│   │   ├── page.tsx        # início (destaque + prateleiras)
│   │   ├── catalog/        # catálogo e detalhes
│   │   └── search/         # resultados de busca
│   ├── dashboard/          # painel de gerenciamento (CRUD)
│   ├── login/ register/    # acesso
│   ├── team/               # equipe
│   └── api/                # rotas de servidor
├── components/
│   ├── SiteHeader.tsx      # cabeçalho fixo com busca
│   ├── BookRow.tsx         # prateleira horizontal
│   ├── BookPoster.tsx      # cartaz de capa
│   └── BookStatus.tsx      # selo de disponível / alugado
├── lib/
│   ├── store.ts            # ⭐ dados no localStorage (livros, usuários, sessão)
│   ├── books.ts            # acervo de exemplo (com as capas)
│   └── format.ts           # formatação de ano (inclui a.C.)
└── types/                  # tipos TypeScript
```

## 📝 Observações para quem for avaliar

- A pasta `src/app/api/` mantém uma **API REST** (`/api/books`, `/api/users`) que guarda
  dados temporariamente no servidor. Ela funciona, mas a interface do site usa o
  `localStorage` (por causa da hospedagem na Vercel, como explicado acima).
- **Não há inteligência artificial integrada** ao site.
- **Nunca** versione o arquivo `.env.local` — ele já está no `.gitignore`.
