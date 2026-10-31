// src/app/api/books/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getBooks,
  getBookById,
  getBooksByCategory,
  searchBooks,
  addBook,
} from "@/lib/db";
import type { Category } from "@/types/book";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as Category | null;
    const q = searchParams.get("q")?.trim();
    const id = searchParams.get("id");

    let books: any[] = [];

    if (id) {
      const book = getBookById(id);
      if (!book) {
        return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
      }
      books = [book];
    } else if (category) {
      books = getBooksByCategory(category);
    } else if (q) {
      books = searchBooks(q);
    } else {
      books = getBooks();
    }

    return NextResponse.json({
      data: books,
      total: books.length,
      category: category ?? null,
      query: q ?? null,
    });
  } catch (err: any) {
    console.error("Error fetching books:", err);
    return NextResponse.json(
      { error: "Erro ao carregar livros" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, category, year, description, cover } = body as any;

    if (!title || !author || !category) {
      return NextResponse.json(
        { error: "Título, autor e categoria são obrigatórios" },
        { status: 400 }
      );
    }

    const newBook = addBook({
      title,
      author,
      category,
      year: year || new Date().getFullYear(),
      description: description || "",
      cover: cover || "",
      available: true,
    });

    return NextResponse.json({
      message: "Livro criado com sucesso",
      data: newBook,
    }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating book:", err);
    return NextResponse.json(
      { error: err.message ?? "Erro ao criar livro" },
      { status: 500 }
    );
  }
}
