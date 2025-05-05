import { NextRequest, NextResponse } from 'next/server';

// This middleware ensures NEXTAUTH_URL is set correctly on Vercel
export function middleware(request: NextRequest) {
  // On Vercel, ensure NEXTAUTH_URL is set to the deployment URL if not manually configured
  if (process.env.VERCEL === '1' && !process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    console.log(`Setting missing NEXTAUTH_URL to ${process.env.NEXTAUTH_URL}`);
  }

  // Continue with the request
  return NextResponse.next();
}

// Match all API routes related to authentication
export const config = {
  matcher: ['/api/auth/:path*'],
}; 