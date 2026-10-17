import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";

import prisma from "@/app/lib/prisma";

function isRole(value: unknown): value is "ADMIN" | "STAFF" | "USER" {
  return value === "ADMIN" || value === "STAFF" || value === "USER";
}

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (
        typeof credentials?.email !== "string" ||
        typeof credentials.password !== "string"
      ) {
        return null;
      }

      const email = credentials.email.trim().toLowerCase();
      const user = await prisma.user.findUnique({ where: { email } });

      if (
        !user ||
        !(await bcrypt.compare(credentials.password, user.passwordHash))
      ) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    },
  }),
];

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  trustHost:
    process.env.NODE_ENV !== "production" ||
    process.env.AUTH_TRUST_HOST === "true",
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const id = typeof token.id === "string" ? token.id : token.sub;

        if (!id) {
          throw new Error("Authentication token is missing a user ID.");
        }

        session.user.id = id;
        session.user.role = isRole(token.role) ? token.role : "USER";
      }

      return session;
    },
  },
  pages: {
    error: "/login",
    signIn: "/login",
  },
});
