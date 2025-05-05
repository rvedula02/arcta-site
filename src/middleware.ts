import { NextRequest, NextResponse } from 'next/server';

// This middleware ensures NextAuth is properly configured on Vercel
export function middleware(request: NextRequest) {
  // Check if we're running on Vercel
  const isVercel = process.env.VERCEL === '1';
  const vercelUrl = process.env.VERCEL_URL;
  
  // On Vercel, ensure NEXTAUTH_URL is set to the deployment URL if not manually configured
  if (isVercel && !process.env.NEXTAUTH_URL && vercelUrl) {
    // Use https protocol with Vercel URL
    const secureUrl = `https://${vercelUrl}`;
    
    // Set environment variable for server-side operations
    process.env.NEXTAUTH_URL = secureUrl;
    
    console.log(`[Middleware] Set NEXTAUTH_URL to ${secureUrl}`);
  }

  // Continue with the request
  return NextResponse.next();
}

// Apply to all auth-related API routes and login pages
export const config = {
  matcher: [
    '/api/auth/:path*',
    '/auth/:path*',
  ],
}; 