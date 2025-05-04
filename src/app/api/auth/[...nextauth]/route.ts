// Copied from src/pages/api/auth/[...nextauth].ts and adapted for App Router
import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "../../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from '@/lib/prisma'; // Use shared client

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
     async jwt({ token, user, account, profile }) {
      // Persist the user id and other fields from the database user record to the token right after sign in
      if (user) {
        token.id = user.id;
        // Add other user fields you want in the token
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (dbUser) {
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.company = dbUser.company;
            token.needsDescription = dbUser.needsDescription;
            token.demoBookingTime = dbUser.demoBookingTime?.toISOString(); // Store as ISO string
            token.demoBookingUri = dbUser.demoBookingUri;
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log("SESSION CALLBACK: Token received:", token);
      // Send properties to the client, ensure latest data is fetched
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        
        // --- Fetch latest user data from DB ---
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              firstName: true,
              lastName: true,
              email: true,
              company: true,
              needsDescription: true,
              demoBookingTime: true,
              demoBookingUri: true,
              image: true, // Include image if needed
            }
          });
          console.log("SESSION CALLBACK: User fetched from DB:", dbUser);

          if (dbUser) {
             // Merge latest DB data into session.user
            session.user.firstName = dbUser.firstName;
            session.user.lastName = dbUser.lastName;
            session.user.email = dbUser.email;
            session.user.company = dbUser.company;
            session.user.needsDescription = dbUser.needsDescription ?? undefined;
            session.user.demoBookingTime = dbUser.demoBookingTime ?? undefined;
            session.user.demoBookingUri = dbUser.demoBookingUri ?? undefined;
            session.user.image = dbUser.image ?? undefined;
             // remove default name if you prefer firstName/lastName
            delete (session.user as any).name; 
          } else {
             console.warn(`SESSION CALLBACK: User with id ${token.id} not found in DB.`);
             // Handle case where user might exist in token but not DB? Or clear session?
             // For now, we rely on token data as fallback if DB user not found
             session.user.email = token.email as string; 
             session.user.firstName = token.firstName as string;
             session.user.lastName = token.lastName as string;
             session.user.company = token.company as string;
             session.user.needsDescription = token.needsDescription as string | undefined;
             session.user.demoBookingTime = token.demoBookingTime ? new Date(token.demoBookingTime as string) : undefined;
             session.user.demoBookingUri = token.demoBookingUri as string | undefined;
             session.user.image = token.picture as string | undefined; 
          }
        } catch (error) {
          console.error("SESSION CALLBACK: Error fetching user from DB:", error);
          // Fallback to token data in case of DB error
          session.user.email = token.email as string;
          session.user.firstName = token.firstName as string;
          session.user.lastName = token.lastName as string;
          session.user.company = token.company as string;
          session.user.needsDescription = token.needsDescription as string | undefined;
          session.user.demoBookingTime = token.demoBookingTime ? new Date(token.demoBookingTime as string) : undefined;
          session.user.demoBookingUri = token.demoBookingUri as string | undefined;
          session.user.image = token.picture as string | undefined; 
        }
        // --- End fetch latest user data ---

      } else {
        console.log("SESSION CALLBACK: Token or session.user missing, returning default session.");
      }
      console.log("SESSION CALLBACK: Final session object:", session);
      return session;
    },
  }
};

// In the App Router, we export the handlers directly
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 