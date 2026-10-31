// src/app/api/books/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getBookById,
  updateBook,
  deleteBook,
} from "@/lib/db";

// No Next.js 16, o context de route handlers tem `params` como Promise.
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const book = getBookById(id);
  if (!book) {
    return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ data: book });
}

export async function PUT(request: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const book = updateBook(id, body);
    if (!book) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Livro atualizado", data: book });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Erro ao atualizar" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const success = deleteBook(id);
    if (!success) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Livro deletado com sucesso" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Erro ao deletar" },
      { status: 500 }
    );
  }
}
