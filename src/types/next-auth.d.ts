import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      company: string;
      needsDescription?: string | null; // Match optional nature in schema
      demoBookingTime?: Date | null;
      demoBookingUri?: string | null;
    } & DefaultSession["user"]; // Keep the default fields like email, image
  }

  // Extend the built-in User type (used in JWT callback `user` parameter)
  interface User extends DefaultUser {
    id: string;
    firstName: string;
    lastName: string;
    company: string;
    needsDescription?: string | null;
    demoBookingTime?: Date | null;
    demoBookingUri?: string | null;
  }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    firstName?: string; // Mark as optional as they are added based on dbUser lookup
    lastName?: string;
    company?: string;
    needsDescription?: string | null;
    demoBookingTime?: string | null; // Stored as ISO string in token
    demoBookingUri?: string | null;
  }
} 