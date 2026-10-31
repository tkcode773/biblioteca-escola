// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getAllUsers,
  getUserByEmail,
  createUser,
} from "@/lib/users";

export async function GET() {
  try {
    const users = getAllUsers();
    return NextResponse.json({ data: users });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Erro ao carregar usuários" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body ?? {};

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        { error: "A senha deve ter no mínimo 8 caracteres" },
        { status: 400 }
      );
    }

    const existing = getUserByEmail(String(email));
    if (existing) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const newUser = createUser({
      name: String(name),
      email: String(email),
      password: String(password),
      role: role === "admin" ? "admin" : "aluno",
    });

    return NextResponse.json(
      { message: "Usuário criado com sucesso", data: newUser },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
