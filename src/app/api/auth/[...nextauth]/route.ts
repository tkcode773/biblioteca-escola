// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// No NextAuth v5 (Auth.js), NextAuth() retorna { handlers, auth, signIn, signOut }.
// Os route handlers precisam ser exportados a partir de `handlers`.
const { handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;
