'use client';

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Inner component that uses useSearchParams
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || '/';
  
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    error: null as string | null,
    success: null as string | null,
    isLoading: false
  });

  // Set error/success message from URL parameters
  useEffect(() => {
    const errorType = searchParams?.get("error");
    const message = searchParams?.get("message");
    
    if (errorType === "CredentialsSignin") {
      setFormState(prev => ({ ...prev, error: "Invalid email or password" }));
    } else if (errorType) {
      setFormState(prev => ({ ...prev, error: `Authentication error: ${errorType}` }));
    }
    
    if (message) {
      setFormState(prev => ({ ...prev, success: message }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formState.email,
        password: formState.password,
        callbackUrl,
      });

      if (result?.error) {
        setFormState(prev => ({ 
          ...prev, 
          error: result.error === "CredentialsSignin" 
            ? "Invalid email or password" 
            : `Sign in failed: ${result.error}`,
          isLoading: false
        }));
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (err) {
      setFormState(prev => ({ 
        ...prev, 
        error: "Authentication failed. Please try again.",
        isLoading: false
      }));
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
          {formState.success && (
            <div className="mb-4 rounded-md bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800">{formState.success}</p>
            </div>
          )}
          
          {formState.error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{formState.error}</p>
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
                value={formState.email}
                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
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
                value={formState.password}
                onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={formState.isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {formState.isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for suspense
function SignInLoading() {
  return (
    <div className="bg-gradient-to-b from-gray-950 via-dark-green to-gray-950 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="animate-pulse w-[70px] h-[70px] rounded-full bg-gray-700 mb-6" />
        </div>
        <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto animate-pulse mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-800">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded w-full animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded w-full animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-700 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInForm />
    </Suspense>
  );
} 