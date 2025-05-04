import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id */
      id: string;
      /** The user's first name */
      firstName?: string;
      /** The user's last name */
      lastName?: string;
      /** The user's company */
      company?: string;
      /** Optional description of user needs */
      needsDescription?: string;
      /** When the demo is booked for */
      demoBookingTime?: Date;
      /** URI to the demo booking */
      demoBookingUri?: string;
    } & DefaultSession["user"];
  }

  interface User {
    firstName: string;
    lastName: string;
    company: string;
    needsDescription?: string;
  }
} 