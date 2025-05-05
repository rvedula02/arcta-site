// Copied from src/pages/api/auth/[...nextauth].ts and adapted for App Router
import NextAuth, { NextAuthOptions, User, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma"; // Import centralized Prisma client
import ensureNextAuthUrl from "../helpers/next-auth-url"; // Import helper

// Explicitly set Node.js runtime for this API route
export const runtime = 'nodejs';

// Define a fallback secret for development
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "arcta_site_dev_secret_key_change_in_production";

// Ensure NEXTAUTH_URL is available with a fallback
const NEXTAUTH_URL = process.env.NEXTAUTH_URL ||
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                    'http://localhost:3002');

// Helper function to ensure database connection with retries
async function ensureDatabaseConnection(retries = 5, delay = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const count = await prisma.user.count();
      console.log(`Database connection successful (attempt ${attempt}). User count: ${count}`);
      return true;
    } catch (error) {
      lastError = error;
      console.error(`Database connection attempt ${attempt} failed:`, error);
      // Wait before retrying
      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for next attempt (exponential backoff)
        delay *= 1.5;
      }
    }
  }
  console.error(`Failed to connect to database after ${retries} attempts. Last error:`, lastError);
  throw new Error(`Database connection failed after ${retries} attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';

// Log environment settings for debugging
console.log(`NextAuth environment: ${process.env.NODE_ENV}, Vercel: ${isVercel}`);
console.log(`NEXTAUTH_URL: ${NEXTAUTH_URL || '[not set]'}`);
console.log(`Secret set: ${!!NEXTAUTH_SECRET}`);
console.log(`Domain for auth: ${new URL(NEXTAUTH_URL).hostname}`);

// Determine if we should use secure cookies (https)
const useSecureCookies = NEXTAUTH_URL.startsWith('https://');
const cookieDomain = isProduction ? (new URL(NEXTAUTH_URL).hostname.includes('.') ? new URL(NEXTAUTH_URL).hostname : undefined) : undefined;

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
          console.log("Login attempt for:", credentials?.email);
          
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing credentials - email or password is undefined");
            throw new Error("Missing credentials");
          }
          
          // Check database connection with retries
          try {
            await ensureDatabaseConnection();
          } catch (dbError) {
            console.error("Database connection failed:", dbError);
            throw new Error(`Database connection failed: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
          }
          
          // Find and validate user
          let user;
          try {
            user = await prisma.user.findUnique({
              where: { email: credentials.email }
            });
          } catch (err) {
            console.error("Error finding user:", err);
            throw new Error(`Database query failed: ${err instanceof Error ? err.message : String(err)}`);
          }
          
          if (!user) {
            console.error("No user found with email:", credentials.email);
            return null;
          }
          
          console.log("User found:", { 
            id: user.id, 
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            hasPassword: !!user.password 
          });
          
          if (!user.password) {
            console.error("User has no password set");
            return null;
          }
          
          try {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            console.log("Password check result:", isValid);
            
            if (isValid) {
              console.log("Login successful for user:", user.email);
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
          } catch (passwordError) {
            console.error("Error comparing passwords:", passwordError);
            throw new Error(`Password comparison failed: ${passwordError instanceof Error ? passwordError.message : String(passwordError)}`);
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          throw error; // Let NextAuth handle the error properly
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
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: cookieDomain
      }
    },
    callbackUrl: {
      name: `${useSecureCookies ? "__Secure-" : ""}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: cookieDomain
      }
    },
    csrfToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: cookieDomain
      }
    }
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser }) {
      try {
        // Persist the user id and other fields from the database user record to the token right after sign in
        if (user) {
          console.log("JWT callback - creating token for user:", user.email);
          token.id = user.id;
          token.email = user.email;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.company = user.company;
          
          // Fetch additional user data from the database
          try {
            const dbUser = await prisma.user.findUnique({ 
              where: { id: user.id },
              select: {
                needsDescription: true,
                demoBookingTime: true,
                demoBookingUri: true
              }
            });
            
            if (dbUser) {
              // Convert null to undefined to match the JWT type definition
              token.needsDescription = dbUser.needsDescription ?? undefined;
              token.demoBookingTime = dbUser.demoBookingTime?.toISOString();
              token.demoBookingUri = dbUser.demoBookingUri ?? undefined;
            }
          } catch (dbError) {
            console.error("Error fetching additional user data:", dbError);
            // Continue with the token we have
          }
        }
        return token;
      } catch (error) {
        console.error("Error in jwt callback:", error);
        return token;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      try {
        if (token && session.user) {
          console.log("Session callback - creating session for token with email:", token.email);
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
  debug: process.env.NODE_ENV !== 'production', // Only enable debug in non-production
};

// In the App Router, we export the handlers directly
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };