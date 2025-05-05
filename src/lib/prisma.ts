import { PrismaClient } from '../generated/prisma';

// Declare global variable for PrismaClient instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Helper to determine if running on Vercel
const isVercel = process.env.VERCEL === '1';

// Log PostgreSQL connection URL to help diagnose issues (masked for security)
function logConnectionInfo() {
  const url = process.env.DATABASE_URL || '';
  if (url) {
    // Create a safe version of the URL for logging
    const safeUrl = url.replace(/:([^@]*)@/, ':****@');
    console.log(`Database URL detected: ${safeUrl.substring(0, 10)}...${safeUrl.substring(safeUrl.indexOf('@'))}`);
    
    // Check for Prisma Accelerate URL format
    if (url.startsWith('prisma://')) {
      console.log('Using Prisma Accelerate URL format');
    } else {
      console.log('Using standard PostgreSQL URL format');
      
      // Check for SSL configuration in standard URL
      const hasSSL = url.includes('sslmode=');
      if (!hasSSL && process.env.NODE_ENV === 'production') {
        console.warn('Warning: Production database URL does not include SSL parameters');
      }
    }
  } else {
    console.error('DATABASE_URL environment variable is not set');
  }
}

// Get a properly configured DATABASE_URL for the current environment
function getDatabaseUrl() {
  let url = process.env.DATABASE_URL;
  if (!url) return url;

  // If using Prisma Accelerate format, don't modify the URL
  if (url.startsWith('prisma://')) {
    return url;
  }
  
  // Check if we have a direct Postgres URL as fallback
  const postgresUrl = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  if (postgresUrl && !postgresUrl.startsWith('prisma://')) {
    console.log('Using POSTGRES_PRISMA_URL instead of DATABASE_URL');
    url = postgresUrl;
  }

  // For production/Vercel: ensure SSL is enabled on standard PostgreSQL URLs
  if (process.env.NODE_ENV === 'production' && !url.startsWith('prisma://')) {
    // If URL doesn't include sslmode, add it
    if (!url.includes('sslmode=')) {
      const hasParams = url.includes('?');
      return `${url}${hasParams ? '&' : '?'}sslmode=require`;
    }
  }
  
  return url;
}

// Prepare connection options - SIMPLIFIED FOR PRODUCTION
function getPrismaClient() {
  // Production environment needs additional configuration
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    logConnectionInfo();
    console.log(`Running in production${isVercel ? ' on Vercel' : ''}`);

    // In production, use the simplest client initialization possible
    // This avoids issues with Prisma interpreting the DATABASE_URL
    return new PrismaClient({
      log: ['error'],
    });
  }
  
  // In development, use more verbose logging
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
}

// Prevent multiple instances of Prisma Client in development
const prismaClient = global.prisma || getPrismaClient();

// Set global prisma for development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

// For clean process shutdown (using process directly instead of Prisma's beforeExit)
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    console.log('Process beforeExit event - cleaning up Prisma connections');
  });
}

export const prisma = prismaClient; 