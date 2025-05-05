'use client'; // Sign in page needs client-side interactivity

// Removed GetServerSideProps related imports
import { signIn } from "next-auth/react"; 
import { useRouter, useSearchParams } from "next/navigation"; // Use navigation hooks for App Router
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// We don't get csrfToken via props anymore in App Router client components easily.
// NextAuth.js handles CSRF automatically via a cookie for standard flows.
// If you needed the token for a custom fetch, you'd fetch it separately.

// Wrap the main component logic in a separate component
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // This hook needs to be used within Suspense

  // Check if searchParams is available
  if (!searchParams) {
    // You might want a more sophisticated loading state
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  const callbackUrl = searchParams.get("callbackUrl") || '/';
  const errorParam = searchParams.get("error");
  const message = searchParams.get("message");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set error from URL param on initial load
  useEffect(() => {
    if (errorParam === "CredentialsSignin") {
      setError("Invalid email or password.");
    } else if (errorParam) {
      setError(`Sign in failed: ${errorParam}`);
    }
    
    if (message) {
      setSuccess(message);
    }
  }, [errorParam, message]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors
    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    
    try {
      // No need for CSRF token input, NextAuth handles it
      const result = await signIn("credentials", {
        redirect: false, // Keep handling redirect manually
        email: target.email.value,
        password: target.password.value,
        callbackUrl: callbackUrl, // Pass the callbackUrl
      });

      if (result?.error) {
        // Error handling remains similar, using setError
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password.");
        } else {
          setError(`Sign in failed: ${result.error}`);
        }
      } else if (result?.url) {
        // Sign-in successful, redirect using App Router's router
        // Use result.url provided by signIn instead of the initial callbackUrl
        router.push(result.url);
        router.refresh(); // Optional: Refresh server components
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Styling and form structure remain largely the same
  return (
    <div className="bg-gradient-to-b from-gray-950 via-dark-green to-gray-950 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/arcta-logo.png" 
              alt="Arcta Logo" 
              width={70} 
              height={70}
              className="mb-6"
            />
          </Link>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Or{" "}
          <Link href="/auth/signup" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-800">
          {success && (
            <div className="mb-4 rounded-md bg-emerald-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-emerald-800">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-800 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-800 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// The default export now renders the form within a Suspense boundary
export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-950 via-dark-green to-gray-950">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}

// getServerSideProps is removed for App Router page 