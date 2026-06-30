import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { cache } from "react";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { apiFetchPublic } from "@/lib/api/client";

type AuthUserResponse = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
};

type LoginResponse = {
  user: AuthUserResponse;
  token: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const data = await apiFetchPublic<LoginResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
            role: data.user.role,
            accessToken: data.token,
          };
        } catch {
          throw new Error("Invalid credentials");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      try {
        const data = await apiFetchPublic<LoginResponse>("/api/auth/oauth-upsert", {
          method: "POST",
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account?.provider ?? "oauth",
          }),
        });

        user.id = data.user.id;
        user.role = data.user.role;
        user.name = data.user.name;
        user.image = data.user.image;
        user.accessToken = data.token;

        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, user, trigger, session }) {
      // First login — copy user fields + backend JWT into the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }

      // Profile name/image update from client (EditProfileModal)
      if (trigger === "update") {
        if (typeof session?.name === "string") {
          token.name = session.name;
        }
        if (session?.image !== undefined) {
          token.picture = session.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      // Available on the server via getAuthSession() → apiFetchAuth()
      session.accessToken = token.accessToken;

      return session;
    },
  },
};

export const getAuthSession = cache(() => getServerSession(authOptions));
