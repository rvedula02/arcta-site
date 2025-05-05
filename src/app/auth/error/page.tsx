'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, Suspense } from 'react';
import ArctaLogo from '@/components/ArctaLogo';

// Component that uses useSearchParams must be wrapped in Suspense
function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    const error = searchParams?.get('error');
    if (error === 'CredentialsSignin') {
      setErrorMessage('Invalid email or password.');
    } else if (error === 'Configuration') {
      setErrorMessage('There is a problem with the server configuration.');
    } else if (error === 'AccessDenied') {
      setErrorMessage('You do not have permission to access this resource.');
    } else if (error) {
      setErrorMessage(`Authentication error: ${error}`);
    } else {
      setErrorMessage('An unknown error occurred during authentication.');
    }
  }, [searchParams]);

  return (
    <div className="bg-gray-900 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-800">
      <div className="rounded-md bg-red-50 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-y-4">
        <Link
          href="/auth/signin"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
        >
          Return to Sign In
        </Link>
        <Link
          href="/"
          className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AuthError() {
  return (
    <div className="bg-gradient-to-b from-gray-950 via-dark-green to-gray-950 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center">
            <ArctaLogo variant="footer" imageSize={70} className="mb-6" />
          </Link>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
          Authentication Error
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={
          <div className="bg-gray-900 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-800">
            <div className="flex justify-center">
              <div className="animate-pulse h-6 w-48 bg-gray-700 rounded"></div>
            </div>
          </div>
        }>
          <AuthErrorContent />
        </Suspense>
      </div>
    </div>
  );
} 