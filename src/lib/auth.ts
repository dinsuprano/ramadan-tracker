import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const sql = getDb();
        const email = credentials.email as string;
        const rows = await sql`SELECT id, name, email, password, zone FROM users WHERE email = ${email}`;

        if (rows.length === 0) return null;

        const user = rows[0];
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );
        if (!valid) return null;

        return {
          id: user.id as string,
          name: user.name as string,
          email: user.email as string,
          zone: user.zone as string,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.zone = (user as Record<string, unknown>).zone as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as Record<string, unknown>).zone = token.zone as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
