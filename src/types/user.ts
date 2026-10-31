// src/types/user.ts
export type UserRole = "admin" | "aluno";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
