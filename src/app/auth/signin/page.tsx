'use client';

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || '/';
  const errorType = searchParams?.get("error");
  const message = searchParams?.get("message");
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set error/success message from URL parameters
  useEffect(() => {
    if (errorType === "CredentialsSignin") {
      setError("Invalid email or password");
    } else if (errorType) {
      setError(`Authentication error: ${errorType}`);
    }
    
    if (message) {
      setSuccess(message);
    }
  }, [errorType, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" 
          ? "Invalid email or password" 
          : `Sign in failed: ${result.error}`);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-950 via-dark-green to-gray-950 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Image 
            src="/arcta-logo.png" 
            alt="Arcta Logo" 
            width={70} 
            height={70}
            className="mb-6"
          />
        </Link>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
          Sign in
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Or{" "}
          <Link href="/auth/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-800">
          {success && (
            <div className="mb-4 rounded-md bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 