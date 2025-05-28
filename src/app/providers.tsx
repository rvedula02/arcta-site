'use client'; // This directive makes it a Client Component

import React from "react";

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return <>{children}</>;
} 