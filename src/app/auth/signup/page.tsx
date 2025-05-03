'use client'; // Sign up page needs client-side interactivity

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use navigation hooks for App Router
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const target = event.target as typeof event.target & {
      name: { value: string };
      email: { value: string };
      password: { value: string };
    };

    const name = target.name.value;
    const email = target.email.value;
    const password = target.password.value;

    try {
      // The API endpoint is now /api/auth/signup (POST)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Sign up failed. Please try again.');
      } else {
        setSuccess(true);
        // Redirect to sign-in page after a short delay using App Router
        setTimeout(() => {
          router.push('/auth/signin'); 
        }, 1500);
      }
    } catch (err) {
       console.error("Sign up request failed:", err);
       setError('An unexpected error occurred. Please try again.');
    }
  };

  // Styling and form structure remain largely the same
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '25px' }}>Sign Up</h1>
      {error && (
        <p style={{ backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>
          Sign up successful! Redirecting to sign in...
        </p>
      )}
      {!success && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name</label>
            <input name="name" id="name" type="text" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}/>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
            <input name="email" id="email" type="email" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}/>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
            <input name="password" id="password" type="password" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}/>
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px 15px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold' }}>Sign Up</button>
        </form>
      )}
      {!success && (
          <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
            Already have an account? <Link href="/auth/signin" style={{ textDecoration: 'underline', color: '#0070f3', fontWeight: '500'}}>Sign In</Link>
          </p>
      )}
    </div>
  );
} 