/**
 * Neon Serverless Adapter for Prisma
 * 
 * This adapter uses the @neondatabase/serverless package which improves
 * database connectivity in serverless environments like Vercel.
 */

import { neon, neonConfig } from '@neondatabase/serverless';

// Get the best URL to use from various environment variables
export function getNeonUrl(): string {
  // Check if we need to use Prisma Data Proxy format
  const useDataProxy = process.env.PRISMA_PROXY === 'true' || 
                     process.env.DATABASE_URL?.startsWith('prisma://') ||
                     process.env.POSTGRES_PRISMA_URL?.startsWith('prisma://');

  // Check all possible Neon database URLs
  const possibleUrls = [
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL
  ].filter(Boolean);
  
  if (possibleUrls.length > 0) {
    const url = possibleUrls[0] as string;
    
    // If using a standard Postgres URL but we need Data Proxy format
    if (useDataProxy && (url.startsWith('postgres://') || url.startsWith('postgresql://'))) {
      console.log('Converting standard Postgres URL to Prisma Data Proxy format');
      return url.replace(/^(postgres|postgresql):\/\//, 'prisma://');
    }
    
    return url;
  }
  
  // Try to construct from components if available
  if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
    const url = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require`;
    
    // Convert to Prisma format if needed
    if (useDataProxy) {
      return url.replace(/^postgresql:\/\//, 'prisma://');
    }
    
    return url;
  }
  
  throw new Error('No valid Neon database URL found in environment variables');
}

/**
 * Creates a SQL query executor for Neon serverless
 * 
 * Usage:
 * 
 * ```
 * import { createNeonQueryExecutor } from '@/lib/neon-adapter';
 * 
 * const sql = createNeonQueryExecutor();
 * 
 * // Example query
 * const result = await sql`SELECT * FROM users LIMIT 5`;
 * ```
 */
export function createNeonQueryExecutor() {
  const url = getNeonUrl();
  
  // Configure for serverless environment
  neonConfig.fetchConnectionCache = true;
  neonConfig.useSecureWebSocket = true;
  
  // Create and return the SQL executor
  return neon(url);
}

/**
 * Direct Neon database connection test
 * This bypasses Prisma and tests the direct Neon connection
 */
export async function testNeonConnection(): Promise<{
  success: boolean;
  result?: any;
  duration?: string;
  message?: string;
  error?: string;
  stack?: string;
}> {
  try {
    const sql = createNeonQueryExecutor();
    const startTime = Date.now();
    const result = await sql`SELECT count(*) FROM "User"`;
    const duration = Date.now() - startTime;
    
    return {
      success: true,
      result,
      duration: `${duration}ms`,
      message: 'Successfully connected to Neon database'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    };
  }
} 