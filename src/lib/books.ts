// Acervo inicial da biblioteca (dados de exemplo / seed).
// É gravado no navegador (localStorage) na primeira visita — ver src/lib/store.ts

import type { Book, Category } from "@/types/book";

export const initialBooks: Book[] = [
  {
    id: "b001",
    title: "A Revolução dos Bichos",
    author: "George Orwell",
    category: "Ficção",
    year: 1945,
    description:
      "Uma fábula sobre uma fazenda de animais que pode ser lida como crítica à ditadura e à corrupção do poder.",
    cover: "https://covers.openlibrary.org/b/id/1234567-L.jpg",
    available: true,
  },
  {
    id: "b002",
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    category: "Conto",
    year: 1943,
    description:
      "Uma história atemporal sobre uma criança que viaja entre planetas, aprendendo sobre amor, amizade e responsabilidade.",
    cover: "https://covers.openlibrary.org/b/id/7890123-L.jpg",
    available: false,
    loanDate: "10/09/2026",
    borrowedBy: "Sala de Leituras",
  },
  {
    id: "b003",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    category: "Ficção",
    year: 1899,
    description:
      "Clássico do romance brasileiro sobre um homem que busca explicar o passado e descobrir a verdade sobre sua vida.",
    cover: "https://covers.openlibrary.org/b/id/4567890-L.jpg",
    available: true,
  },
  {
    id: "b004",
    title: "A Divina Comédia",
    author: "Dante Alighieri",
    category: "Clássicos",
    year: 1320,
    description:
      "Épica que segue o viajante através do Inferno, Purgatório e Paraíso, simbolizando a jornada do homem em direção à sabedoria.",
    cover: "https://covers.openlibrary.org/b/id/9876543-L.jpg",
    available: false,
    loanDate: "22/09/2026",
    borrowedBy: "Acervo Reservado",
  },
  {
    id: "b005",
    title: "1984",
    author: "George Orwell",
    category: "Ficção",
    year: 1949,
    description:
      "Distopia que retrata um futuro sob um regime totalitário, explorando temas de vigilância, controle e liberdade individual.",
    cover: "https://covers.openlibrary.org/b/id/3456789-L.jpg",
    available: true,
  },
  {
    id: "b006",
    title: "O Homem que Calculava",
    author: "Malba Tahan",
    category: "Truques",
    year: 1949,
    description:
      "Contos matemáticos que misturam entretenimento e ensino, apresentando problemas de lógica com soluções criativas.",
    cover: "https://covers.openlibrary.org/b/id/2345678-L.jpg",
    available: true,
  },
  {
    id: "b007",
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    category: "Ficção",
    year: 1967,
    description:
      "A história da família Buendía ao longo de sete gerações na pequena vila de Macondo, misturando real e onírico.",
    cover: "https://covers.openlibrary.org/b/id/1111111-L.jpg",
    available: false,
    loanDate: "03/10/2026",
    borrowedBy: "Laboratório de IA",
  },
  {
    id: "b008",
    title: "O Pequeno Príncipe (Edição Ilustrada)",
    author: "Antoine de Saint-Exupéry",
    category: "Conto",
    year: 1943,
    description:
      "Edição ilustrada com capas coloridas e notas adicionais que enriquecem a experiência de leitura do clássico.",
    cover: "https://covers.openlibrary.org/b/id/9999999-L.jpg",
    available: true,
  },
];

export function getBooks(): Book[] {
  return [...initialBooks];
}

export function getBooksByCategory(category: Category): Book[] {
  return initialBooks.filter((b) => b.category === category);
}

export function searchBooks(query: string): Book[] {
  const q = query.toLowerCase().trim();
  if (!q) return [...initialBooks];
  return initialBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
  );
}

export function getBookById(id: string): Book | undefined {
  return initialBooks.find((b) => b.id === id);
}
