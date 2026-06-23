import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";

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

        const supabase = createAdminClient();
        const { data: user, error } = await supabase
          .from("users")
          .select("id, email, name, image, role, password")
          .eq("email", credentials.email)
          .maybeSingle();

        if (error || !user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        await supabase
          .from("users")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", user.id);

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
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

      const supabase = createAdminClient();
      const { data: existingUser } = await supabase
        .from("users")
        .select("id, email, name, image, role")
        .eq("email", user.email)
        .maybeSingle();

      if (existingUser) {
        user.id = String(existingUser.id);
        user.role = existingUser.role;
        user.name = existingUser.name ?? user.name;
        user.image = existingUser.image ?? user.image;

        await supabase
          .from("users")
          .update({
            last_login_at: new Date().toISOString(),
            provider: account?.provider,
          })
          .eq("id", existingUser.id);

        return true;
      }

      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          email: user.email,
          name: user.name,
          image: user.image,
          provider: account?.provider,
          role: "USER",
          last_login_at: new Date().toISOString(),
        })
        .select("id, role")
        .single();

      if (error || !newUser) {
        return false;
      }

      user.id = String(newUser.id);
      user.role = newUser.role;

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // When the client calls useSession().update({ name }), propagate the
      // new name into the JWT so the session reflects it immediately.
      if (trigger === "update" && typeof session?.name === "string") {
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
