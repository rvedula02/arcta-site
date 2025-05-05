// Copied from src/pages/api/auth/[...nextauth].ts and adapted for App Router
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma"; // Use shared client

// Define a fallback secret for development
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "arcta_site_dev_secret_key_change_in_production";

// Define authOptions as a constant, not as an export
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
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
              return {
                id: user.id,
                email: user.email,
                name: user.name || `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                company: user.company,
                image: user.image
              };
            } else {
              console.error("Invalid password for user:", user.email);
              return null;
            }
          } else {
            console.error("User found but password check not implemented or user has no password set.");
            return null;
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', // Ensure this path matches your App Router sign-in page
    error: '/auth/error', // Error page
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        // Persist the user id and other fields from the database user record to the token right after sign in
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.company = user.company;
          
          // Fetch additional user data from the database
          const dbUser = await prisma.user.findUnique({ 
            where: { id: user.id },
            select: {
              needsDescription: true,
              demoBookingTime: true,
              demoBookingUri: true
            }
          });
          
          if (dbUser) {
            token.needsDescription = dbUser.needsDescription;
            token.demoBookingTime = dbUser.demoBookingTime?.toISOString();
            token.demoBookingUri = dbUser.demoBookingUri;
          }
        }
        return token;
      } catch (error) {
        console.error("Error in jwt callback:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
          session.user.firstName = token.firstName as string;
          session.user.lastName = token.lastName as string;
          session.user.company = token.company as string;
          session.user.needsDescription = token.needsDescription as string | undefined;
          session.user.demoBookingTime = token.demoBookingTime ? new Date(token.demoBookingTime as string) : undefined;
          session.user.demoBookingUri = token.demoBookingUri as string | undefined;
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

// In the App Router, we export the handlers directly
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 