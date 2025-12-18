import { prisma } from "./prisma";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Shared session & JWT typings
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  }
}

export const authConfig: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {
    // Use NEXTAUTH_SECRET; enforce presence for security
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.isAdmin) {
          return null;
        }

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = (user as any).isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: (token.name as string) ?? "",
        isAdmin: Boolean(token.isAdmin),
      };
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


