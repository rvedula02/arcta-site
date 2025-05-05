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

// Fix database URL protocol - crucial for Prisma 6.7.0
function getFixedDatabaseUrl() {
  const url = process.env.DATABASE_URL || '';
  
  if (!url) {
    console.error('DATABASE_URL is not set');
    return url;
  }
  
  // Force postgresql:// protocol
  if (url.startsWith('postgres://')) {
    const fixedUrl = 'postgresql://' + url.substring('postgres://'.length);
    console.log('Fixed DATABASE_URL protocol from postgres:// to postgresql://');
    return fixedUrl;
  }
  
  // Add sslmode if needed for production
  if (process.env.NODE_ENV === 'production' && !url.includes('sslmode=')) {
    const separator = url.includes('?') ? '&' : '?';
    const sslUrl = `${url}${separator}sslmode=require`;
    console.log('Added sslmode=require to DATABASE_URL');
    return sslUrl;
  }
  
  return url;
}

// Simple initialization - works better with Prisma 5.x
function getPrismaClient() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const options = {
    log: isProduction 
      ? ['error'] 
      : ['query', 'error', 'warn'],
  };

  // Create a new client with basic options
  // Prisma 5.x handles DATABASE_URL through env vars without needing datasources override
  return new PrismaClient(options);
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