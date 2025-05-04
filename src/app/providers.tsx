'use client'; // This directive makes it a Client Component

import { SessionProvider } from "next-auth/react";
import React from "react";

interface AuthProviderProps {
  children: React.ReactNode;
  // Session is not passed as a prop here, SessionProvider fetches it
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
} 