// Copied from src/pages/api/auth/[...nextauth].ts and adapted for App Router
import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "../../../../generated/prisma";
import bcrypt from "bcrypt";

// Prisma Client Instantiation (same as before)
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user) {
          console.error("No user found with email:", credentials.email);
          return null;
        }
        if (user.password) {
           const isValid = await bcrypt.compare(credentials.password, user.password);
           if (isValid) {
             console.log("Password valid for user:", user.email);
             const { password, ...userWithoutPassword } = user;
             return userWithoutPassword;
           } else {
             console.error("Invalid password for user:", user.email);
             return null;
           }
        } else {
            console.error("User found but password check not implemented or user has no password set.");
            return null;
        }
      }
    })
    // Add other providers here if needed
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', // Ensure this path matches your App Router sign-in page
  },
  callbacks: {
     async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
         // @ts-ignore // Need to extend Session type definition for id
        session.user.id = token.id;
      }
      return session;
    },
  }
};

// In the App Router, we export the handlers directly
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 