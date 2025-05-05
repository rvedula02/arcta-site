'use client'; // Make this a client component to use hooks

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="absolute top-4 right-4 z-50">
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="absolute top-4 right-4 z-50 flex items-center gap-x-2">
        <button
          onClick={() => signIn()}
          className="rounded-md bg-gray-700/50 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600/50 focus-visible:outline-gray-600 transition-colors"
        >
          Sign In
        </button>
        <Link
          href="/auth/signup"
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline-emerald-600 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-x-3">
      <Link
        href="/profile"
        className="text-sm text-gray-300 hover:text-white transition-colors"
      >
        <span className="underline">
          {session.user?.firstName || session.user?.email}
        </span>
      </Link>
      <button
        onClick={() => signOut()}
        className="rounded-md bg-gray-700/50 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600/50 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
} 