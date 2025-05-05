// Helper to determine the correct NEXTAUTH_URL based on environment

/**
 * Gets the correct NEXTAUTH_URL based on environment variables
 * Falls back to sensible defaults when possible
 */
export function getNextAuthUrl(): string {
  // First check for explicitly set NEXTAUTH_URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // On Vercel, we can construct a URL from VERCEL_URL
  if (process.env.VERCEL === '1' && process.env.VERCEL_URL) {
    const url = `https://${process.env.VERCEL_URL}`;
    console.log(`Setting NEXTAUTH_URL from VERCEL_URL: ${url}`);
    // Actually set the environment variable for NextAuth to use
    process.env.NEXTAUTH_URL = url;
    return url;
  }
  
  // In production, try to guess based on headers
  if (process.env.NODE_ENV === 'production') {
    console.warn('NEXTAUTH_URL not set in production. Using fallback URL.');
    // Use a default production URL (you should set this to your actual domain)
    return 'https://arcta.ai'; 
  }
  
  // In development, use localhost
  return 'http://localhost:3000';
}

/**
 * Use this to log an error if NEXTAUTH_URL is not set correctly
 */
export function checkNextAuthUrl(): void {
  const url = getNextAuthUrl();
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction && !url.startsWith('https://')) {
    console.error('⚠️ NEXTAUTH_URL is not using HTTPS in production. This is insecure.');
  }
  
  if (!process.env.NEXTAUTH_URL) {
    console.warn(`⚠️ NEXTAUTH_URL not explicitly set. Using: ${url}`);
  }
}

// Export a default function to use this in your API routes
export default function ensureNextAuthUrl(): string {
  const url = getNextAuthUrl();
  checkNextAuthUrl();
  return url;
} 