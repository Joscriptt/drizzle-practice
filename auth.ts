// // // import Google from "next-auth/providers/google";
// // import NextAuth from "next-auth";
// // import { DrizzleAdapter } from "@auth/drizzle-adapter";
// // import type { Adapter } from "next-auth/adapters";
// // import GitHub from "next-auth/providers/github";
// // import Credentials from "next-auth/providers/credentials";
// // import { db } from "@/db/drizzle";
// // import { authUsers, accounts, sessions, verificationTokens } from "@/db/schema";

// // export const { handlers, signIn, signOut, auth } = NextAuth({
// //   adapter: DrizzleAdapter(db, {
// //     usersTable: authUsers,
// //     accountsTable: accounts,
// //     sessionsTable: sessions,
// //     verificationTokensTable: verificationTokens,
// //   }) satisfies Adapter,
// //   session: { strategy: "database" },
// //   // pages: {
// //   //   signIn: "/login",
// //   // },
// //   callbacks: {
// //     async redirect({ url, baseUrl }) {
// //       if (url.startsWith("/")) return url;
// //       if (new URL(url).origin === baseUrl) return url;
// //       return baseUrl;
// //     },
// //   },
// //   providers: [
// //     GitHub({
// //       clientId: process.env.GITHUB_ID!,
// //       clientSecret: process.env.GITHUB_SECRET!,
// //     }),
// //     // Google({
// //     //   clientId: process.env.GOOGLE_ID!,
// //     //   clientSecret: process.env.GOOGLE_SECRET!,
// //     // }),
// //     Credentials({
// //       name: "Credentials",
// //       credentials: {
// //         email: { label: "Email", type: "email" },
// //         password: { label: "Password", type: "password" },
// //       },
// //       async authorize(credentials) {
// //         if (!credentials?.email || !credentials?.password) return null;
// //         return null;
// //       },
// //     }),
// //   ],
// // });

import NextAuth, { CredentialsSignin, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { compare } from "bcrypt-ts";

import GitHub from "next-auth/providers/github";

import { getUser } from "@/actions/user";
import { authConfig } from "./app/auth.config";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      // async authorize(credentials) {
      //   const email =
      //     typeof credentials?.email === "string"
      //       ? credentials.email
      //       : undefined;
      //   const password =
      //     typeof credentials?.password === "string"
      //       ? credentials.password
      //       : undefined;
      //   if (!email || !password) throw new InvalidLoginError();
      //   const user = await getUser(email);
      //   if (user.length === 0 || !user[0].password)
      //     throw new InvalidLoginError();
      //   const passwordsMatch = await compare(password, user[0].password!);
      //   if (passwordsMatch) return user[0] as User;
      //   throw new InvalidLoginError();
      // },
      async authorize(credentials) {
        // async authorize({ email, password }: any) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email
            : undefined;
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : undefined;
        const user = await getUser(email!);
        if (user.length === 0 || !user[0].password)
          throw new InvalidLoginError();
        const passwordsMatch = await compare(password!, user[0].password!);
        // if (passwordsMatch) return user[0] as User;
        if (passwordsMatch)
          return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name || user[0].email,
            // Add any other required user data
          } as User;
        throw new InvalidLoginError();
      },
    }),
  ],
});

// import NextAuth, { CredentialsSignin, User } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { compare } from "bcrypt-ts";
// import GitHub from "next-auth/providers/github";
// import { getUser } from "@/actions/user";
// import { authConfig } from "./app/auth.config";

// class InvalidLoginError extends CredentialsSignin {
//   code = "Invalid identifier or password";
// }

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   ...authConfig,
//   callbacks: {
//     async jwt({ token, user, account }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//         // Add any other user data you need
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           ...session.user,
//           id: token.id as string,
//           email: token.email as string,
//           name: token.name,
//         };
//       }
//       return session;
//     },
//   },
//   providers: [
//     GitHub({
//       allowDangerousEmailAccountLinking: true,
//     }),
//     Credentials({
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const email = credentials?.email;
//         const password = credentials?.password;

//         if (!email || !password) {
//           throw new InvalidLoginError();
//         }

//         const user = await getUser(email as string);

//         if (user.length === 0 || !user[0].password) {
//           throw new InvalidLoginError();
//         }

//         const passwordsMatch = await compare(
//           password as string,
//           user[0].password
//         );

//         if (passwordsMatch) {
//           // Return a standardized user object
//           return {
//             id: user[0].id,
//             email: user[0].email,
//             name: user[0].name || user[0].email,
//             // Add any other required user data
//           } as User;
//         }

//         throw new InvalidLoginError();
//       },
//     }),
//   ],
// });
