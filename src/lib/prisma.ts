import { PrismaClient, Prisma } from '../generated/prisma';

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

// New function to get Neon database URL from various possible environment variables
function getNeonDatabaseUrl(): string {
  // First check if we have a Prisma-specific URL from Neon
  if (process.env.POSTGRES_PRISMA_URL) {
    console.log('Using POSTGRES_PRISMA_URL for database connection');
    return process.env.POSTGRES_PRISMA_URL;
  }
  
  // Next check if we should use a non-pooled connection
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && process.env.DATABASE_URL_UNPOOLED) {
    console.log('Using DATABASE_URL_UNPOOLED for production connection');
    return process.env.DATABASE_URL_UNPOOLED;
  }
  
  // Finally use the standard DATABASE_URL
  if (process.env.DATABASE_URL) {
    console.log('Using DATABASE_URL for database connection');
    return process.env.DATABASE_URL;
  }
  
  // If none of the above, try to construct a URL from individual params
  if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
    console.log('Constructing database URL from individual parameters');
    const host = process.env.PGHOST;
    const user = process.env.PGUSER;
    const password = process.env.PGPASSWORD;
    const database = process.env.PGDATABASE;
    return `postgresql://${user}:${password}@${host}/${database}?sslmode=require`;
  }
  
  // Last resort - check for Vercel Postgres format
  if (process.env.POSTGRES_URL) {
    console.log('Using POSTGRES_URL as fallback');
    return process.env.POSTGRES_URL;
  }
  
  console.error('No valid database URL found in environment variables');
  return '';
}

// Fix database URL protocol - crucial for Prisma compatibility
function getFixedDatabaseUrl() {
  // Get the best URL from available env vars
  const url = getNeonDatabaseUrl();
  
  if (!url) {
    console.error('No database URL found in environment variables');
    return '';
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
    console.log('Added sslmode=require to DATABASE_URL for production environment');
    return sslUrl;
  }
  
  // Add connection timeout if not present
  if (!url.includes('connect_timeout=') && process.env.NODE_ENV === 'production') {
    const separator = url.includes('?') ? '&' : '?';
    const timeoutUrl = `${url}${separator}connect_timeout=15`;
    console.log('Added connect_timeout=15 to DATABASE_URL');
    return timeoutUrl;
  }
  
  return url;
}

// Simple initialization with better error handling
function getPrismaClient() {
  // Log database URL info when client is created (useful for debugging)
  logConnectionInfo();
  
  // Fix the DATABASE_URL if needed
  const fixedUrl = getFixedDatabaseUrl();
  
  // Default log levels
  const isProduction = process.env.NODE_ENV === 'production';
  const options: Prisma.PrismaClientOptions = {
    log: isProduction 
      ? ['error' as Prisma.LogLevel] 
      : ['query' as Prisma.LogLevel, 'error' as Prisma.LogLevel, 'warn' as Prisma.LogLevel],
  };

  // Always use datasource override to ensure the correct URL is used
  console.log('Using datasource override with fixed database URL');
  options.datasources = {
    db: {
      url: fixedUrl
    }
  };

  // Create a new client with proper error handling
  try {
    console.log('Initializing PrismaClient');
    return new PrismaClient(options);
  } catch (error) {
    console.error('Failed to initialize PrismaClient:', error);
    throw error;
  }
}

// Prevent multiple instances of Prisma Client in development
let prismaClient: PrismaClient;
try {
  prismaClient = global.prisma || getPrismaClient();
  console.log('PrismaClient initialized successfully');
  
  // Set global prisma for development
  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prismaClient;
  }
} catch (error) {
  console.error('FATAL: Failed to create Prisma client:', error);
  // Create a mock client that throws errors for all operations
  prismaClient = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
      if (prop === 'connect' || prop === 'disconnect') {
        return () => Promise.resolve();
      }
      return () => Promise.reject(new Error('Database connection failed - operations unavailable'));
    }
  });
}

// For clean process shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    console.log('Process beforeExit event - cleaning up Prisma connections');
  });
}

export const prisma = prismaClient; 