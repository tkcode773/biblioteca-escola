// src/lib/users.ts
// Gerenciamento de usuários (armazenamento em arquivo temporário do servidor)

import bcrypt from "bcryptjs";

const USERS_FILE = "/tmp/biblioteca-escola-users.json";

// Usuários de demonstração: garantem que as contas de exemplo do /login existam
// no mesmo repositório usado pelo cadastro e pelo login.
const DEFAULT_USERS = [
  {
    id: "1",
    name: "Admin",
    email: "admin@biblioteca.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Aluno",
    email: "aluno@biblioteca.com",
    password: bcrypt.hashSync("aluno123", 10),
    role: "aluno",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

function loadUsers(): any[] {
  try {
    const fs = require("fs");
    if (fs.existsSync(USERS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Erro ao carregar users:", e);
  }
  return DEFAULT_USERS.map((u) => ({ ...u }));
}

function saveUsers(users: any[]) {
  try {
    const fs = require("fs");
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error("Erro ao salvar users:", e);
  }
}

const usersCache: any[] = loadUsers();

/** Remove o hash da senha antes de qualquer resposta pública. */
function toPublic(user: any) {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
}

export function getAllUsers() {
  return usersCache.map(toPublic);
}

/** Uso interno (autenticação): devolve o registro completo, incluindo o hash. */
export function getUserByEmail(email: string) {
  return usersCache.find((u: any) => u.email === email);
}

export function getUserById(id: string) {
  const found = usersCache.find((u: any) => u.id === id);
  return toPublic(found);
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "aluno";
}) {
  const existing = usersCache.find((u: any) => u.email === data.email);
  if (existing) {
    throw new Error("Email já cadastrado");
  }
  const newUser = {
    id: `u_${Date.now()}`,
    name: data.name,
    email: data.email,
    password: bcrypt.hashSync(data.password, 10),
    role: data.role || "aluno",
    createdAt: new Date().toISOString(),
  };
  usersCache.push(newUser);
  saveUsers(usersCache);
  return toPublic(newUser);
}

export function updateUser(id: string, data: Partial<any>) {
  const index = usersCache.findIndex((u: any) => u.id === id);
  if (index === -1) return null;
  usersCache[index] = { ...usersCache[index], ...data };
  saveUsers(usersCache);
  return toPublic(usersCache[index]);
}

export function deleteUser(id: string) {
  const index = usersCache.findIndex((u: any) => u.id === id);
  if (index === -1) return false;
  usersCache.splice(index, 1);
  saveUsers(usersCache);
  return true;
}
