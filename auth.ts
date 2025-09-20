// auth.ts (root) — v4
import NextAuth, { type NextAuthOptions, getServerSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    // 👇 tell the adapter the exact Drizzle tables to use
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: { params: { scope: "read:user user:email" } } as any,
        allowDangerousEmailAccountLinking: true,
      
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) (session.user as any).id = (user as any).id;
      return session;
    },
  },
};

export async function auth() {
  return getServerSession(authOptions);
}
