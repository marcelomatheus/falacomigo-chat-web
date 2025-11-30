import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { loginWithCredentials } from "./service";

import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const user = await loginWithCredentials({
          email: credentials.email as string,
          password: credentials.password as string,
        });
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.profile = user.profile;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        ...session.user,
        id: token.id as string,
        email: (token.email as string) ?? session.user?.email ?? "",
        profile:
          (token.profile as Session["user"]["profile"]) ??
          session.user?.profile ??
          {},
      };

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: '/login'
  },

  secret: process.env.AUTH_SECRET,
};