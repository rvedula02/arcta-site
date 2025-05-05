import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cookies = request.headers.get('cookie') || '';
  
  // Parse cookies into an object
  const parsedCookies = cookies.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key) {
      // Don't include actual values for sensitive cookies
      if (key.includes('next-auth.session-token') || key.includes('__Secure-next-auth.session-token')) {
        acc[key] = '[SESSION TOKEN PRESENT]';
      } else if (key.includes('csrf') || key.includes('callback')) {
        acc[key] = '[AUTH COOKIE PRESENT]';
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, {} as Record<string, string>);
  
  // Calculate NextAuth URLs
  const baseUrl = process.env.NEXTAUTH_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  (process.env.NODE_ENV === 'production' ? 'https://arcta.ai' : 'http://localhost:3000'));
  
  // Get domain and protocol
  let domain;
  let secure = false;
  try {
    const url = new URL(baseUrl);
    domain = url.hostname;
    secure = url.protocol === 'https:';
  } catch (error) {
    domain = 'parse-error';
  }
  
  // Check if we're using secure cookies
  const usingSecureCookies = secure;
  const expectedCookiePrefix = usingSecureCookies ? '__Secure-' : '';
  const expectedSessionCookie = `${expectedCookiePrefix}next-auth.session-token`;
  
  // Check for the expected cookies
  const hasSessionCookie = Object.keys(parsedCookies).some(key => 
    key === expectedSessionCookie || key === 'next-auth.session-token');
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    cookies: parsedCookies,
    hasSessionCookie,
    authConfig: {
      baseUrl,
      domain,
      secure,
      usingSecureCookies,
      expectedSessionCookie
    },
    headers: {
      host: request.headers.get('host'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer')
    }
  });
} 