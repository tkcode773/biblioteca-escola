// src/lib/auth.ts
// Configuração do NextAuth.js v5 (Auth.js) com login por credenciais.

import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/users";

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email ? String(credentials.email) : "";
        const password = credentials?.password ? String(credentials.password) : "";

        if (!email || !password) return null;

        // Mesmo repositório usado pelo cadastro (/api/users), então quem se
        // cadastra consegue entrar imediatamente.
        const user = getUserByEmail(email);
        if (!user) return null;

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // Necessário para rodar em localhost / hosts sem HTTPS (a Vercel já confia por padrão).
  trustHost: true,
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
};
