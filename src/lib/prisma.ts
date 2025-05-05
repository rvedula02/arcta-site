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
    
    // Check for SSL configuration in URL
    const hasSSL = url.includes('sslmode=');
    if (!hasSSL && process.env.NODE_ENV === 'production') {
      console.warn('Warning: Production database URL does not include SSL parameters');
    }
  } else {
    console.error('DATABASE_URL environment variable is not set');
  }
}

// Get a properly configured DATABASE_URL for the current environment
function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return url;

  // For production/Vercel: ensure SSL is enabled
  if (process.env.NODE_ENV === 'production') {
    // If URL doesn't include sslmode, add it
    if (!url.includes('sslmode=')) {
      const hasParams = url.includes('?');
      return `${url}${hasParams ? '&' : '?'}sslmode=require`;
    }
  }
  
  return url;
}

// Prepare connection options
function getPrismaClient() {
  // Production environment needs additional configuration
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    logConnectionInfo();
    console.log(`Running in production${isVercel ? ' on Vercel' : ''}`);
  }
  
  const prismaOptions: any = {
    log: isProduction 
      ? ['error'] 
      : ['query', 'error', 'warn'],
    // Use the potentially modified URL with SSL for production
    datasources: isProduction ? {
      db: {
        url: getDatabaseUrl(),
      },
    } : undefined,
  };

  // Create new client with configured options
  return new PrismaClient(prismaOptions);
}

// Prevent multiple instances of Prisma Client in development
const prismaClient = global.prisma || getPrismaClient();

// Set global prisma for development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

// Add error listener for better diagnostics
prismaClient.$on('error', (e) => {
  console.error('Prisma Client error:', e);
});

// For clean process shutdown (using process directly instead of Prisma's beforeExit)
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    console.log('Process beforeExit event - cleaning up Prisma connections');
  });
}

export const prisma = prismaClient; 