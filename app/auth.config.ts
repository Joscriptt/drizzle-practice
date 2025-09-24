import { NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/drizzle";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname.startsWith("/login");
      const isRegisterPage = nextUrl.pathname.startsWith("/register");

      if (!isLoggedIn && !(isLoginPage || isRegisterPage)) {
        return false;
      }
      return true;
    },
    async session({ session, token, trigger }) {
      session.user.image = token.picture;
      session.user.id = token.sub ?? "";
      session.user.email = token.email ?? "";
      session.user.name = token.name ?? "";

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    name?: string;
    email?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
