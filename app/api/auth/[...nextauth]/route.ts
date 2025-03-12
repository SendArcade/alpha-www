import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

// PrismaClient singleton implementation
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Make sure NEXTAUTH_SECRET is defined
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined");
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth",
    signOut: "/auth",
    error: "/auth", // Error code passed in query string as ?error=
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Test database connection
        await prisma.$connect();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
        });

        if (!existingUser) {
          // Create new user if they don't exist
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Detailed error in signIn callback:", error);
        return false;
      } finally {
        await prisma.$disconnect();
      }
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  // Explicitly configure JWT
  jwt: {
    // Maximum age of the session in seconds (30 days)
    maxAge: 30 * 24 * 60 * 60,
  },
  // Use the NEXTAUTH_SECRET environment variable
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
