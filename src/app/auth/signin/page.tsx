'use client'; // Sign in page needs client-side interactivity

// Removed GetServerSideProps related imports
import { signIn } from "next-auth/react"; 
import { useRouter, useSearchParams } from "next/navigation"; // Use navigation hooks for App Router
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

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
    return <div>Loading...</div>; 
  }
  
  const callbackUrl = searchParams.get("callbackUrl") || '/';
  const errorParam = searchParams.get("error");
  const [error, setError] = useState<string | null>(null);

  // Set error from URL param on initial load
  useEffect(() => {
    if (errorParam === "CredentialsSignin") {
        setError("Invalid email or password.");
      } else if (errorParam) {
        setError(`Sign in failed: ${errorParam}`);
      }
  }, [errorParam]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    
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
  };

  // Styling and form structure remain largely the same
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '25px' }}>Sign In</h1>
      {error && (
        <p style={{ backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        {/* CSRF Token input removed */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
          <input name="email" id="email" type="email" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}/>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
          <input name="password" id="password" type="password" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}/>
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px 15px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold' }}>Sign in</button>
      </form>
      <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
        Don&apos;t have an account? <Link href="/auth/signup" style={{ textDecoration: 'underline', color: '#0070f3', fontWeight: '500' }}>Sign Up</Link>
      </p>
    </div>
  );
}

// The default export now renders the form within a Suspense boundary
export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}

// getServerSideProps is removed for App Router page 