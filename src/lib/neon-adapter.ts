/**
 * Neon Serverless Adapter for Prisma
 * 
 * This adapter uses the @neondatabase/serverless package which improves
 * database connectivity in serverless environments like Vercel.
 */

import { neon, neonConfig } from '@neondatabase/serverless';

// Get the best URL to use from various environment variables
export function getNeonUrl(): string {
  // We're NOT using Prisma Data Proxy
  const useDataProxy = false;

  // Check all possible Neon database URLs
  const possibleUrls = [
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL
  ].filter(Boolean);
  
  if (possibleUrls.length > 0) {
    const url = possibleUrls[0] as string;
    
    // Ensure we're using postgresql:// protocol (not postgres://)
    if (url.startsWith('postgres://')) {
      console.log('Converting postgres:// URL to postgresql:// for Prisma compatibility');
      return url.replace(/^postgres:\/\//, 'postgresql://');
    }
    
    return url;
  }
  
  // Try to construct from components if available
  if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
    return `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require`;
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
  // For the direct Neon connection, we need to use one of the unpooled URLs
  // and ensure it's in the postgresql:// format
  let url = process.env.POSTGRES_URL_NON_POOLING || 
            process.env.DATABASE_URL_UNPOOLED || 
            process.env.DATABASE_URL || 
            process.env.POSTGRES_URL;
  
  if (!url) {
    throw new Error('No database URL found for Neon connection');
  }
  
  // Ensure we have postgresql:// protocol for neon()
  if (url.startsWith('postgres://')) {
    url = url.replace(/^postgres:\/\//, 'postgresql://');
  } else if (url.startsWith('prisma://')) {
    url = url.replace(/^prisma:\/\//, 'postgresql://');
  }
  
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
    // Get an unpooled URL for direct connection
    let directUrl = process.env.POSTGRES_URL_NON_POOLING || 
                   process.env.DATABASE_URL_UNPOOLED;
    
    // Fall back to pooled URL if unpooled not available
    if (!directUrl) {
      directUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    }
    
    if (!directUrl) {
      throw new Error('No database URL found for direct connection test');
    }
    
    // Ensure we have the right protocol
    if (directUrl.startsWith('postgres://')) {
      directUrl = directUrl.replace(/^postgres:\/\//, 'postgresql://');
    } else if (directUrl.startsWith('prisma://')) {
      directUrl = directUrl.replace(/^prisma:\/\//, 'postgresql://');
    }

    // Configure neon
    neonConfig.fetchConnectionCache = true;
    neonConfig.useSecureWebSocket = true;
    
    // Create a direct SQL executor
    const sql = neon(directUrl);
    
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