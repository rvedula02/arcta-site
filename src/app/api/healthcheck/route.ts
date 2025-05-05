import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

// Create a Prisma client with explicit database URL
let dbUrl = process.env.DATABASE_URL || 
          process.env.POSTGRES_PRISMA_URL || 
          process.env.POSTGRES_URL;

// Fix protocol if needed
if (dbUrl && dbUrl.startsWith('postgres://')) {
  dbUrl = dbUrl.replace(/^postgres:\/\//, 'postgresql://');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
});

// Define types for database URL info
interface DbUrlInfo {
  configured: boolean;
  protocol?: string;
  host?: string;
  hasSSL?: boolean;
  pooled?: boolean;
}

// Forced database connection check with retries
async function checkDatabaseConnection(maxRetries = 3) {
  let lastError;
  let connected = false;
  let userCount = 0;
  let retryCount = 0;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      retryCount = attempt;
      userCount = await prisma.user.count();
      connected = true;
      break;
    } catch (err: any) {
      lastError = err;
      console.error(`Database connection attempt ${attempt} failed:`, err);
      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500 * attempt)); // Increasing delay
      }
    }
  }
  
  return {
    connected,
    retries: retryCount,
    userCount: connected ? userCount : null,
    error: connected ? null : lastError?.message,
    errorName: connected ? null : lastError?.name,
    errorStack: connected ? null : lastError?.stack?.split('\n').slice(0, 3).join('\n')
  };
}

// Define the runtime for this API route
export const runtime = 'nodejs';

/**
 * Health check endpoint that also validates environment configuration
 */
export async function GET() {
  try {
    // Check database connection
    const dbStatus = await checkDatabaseConnection();
    
    // Check environment variables
    const envStatus = {
      databaseUrl: !!process.env.DATABASE_URL,
      postgresUrl: !!process.env.POSTGRES_URL,
      postgresUrlNonPooling: !!process.env.POSTGRES_URL_NON_POOLING,
      nextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      vercel: process.env.VERCEL === '1',
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
    };

    // Check for packages without actually loading them
    const packageStatus = {
      tailwind: checkPackageExists('tailwindcss'),
      tailwindForms: checkPackageExists('@tailwindcss/forms'),
      nextAuth: checkPackageExists('next-auth'),
      neonServerless: checkPackageExists('@neondatabase/serverless'),
    };

    // Create a clean response object
    const healthStatus = {
      status: dbStatus.connected ? 'ok' : 'database_error',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: envStatus,
      packages: packageStatus,
    };

    return NextResponse.json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Helper function to check if a package exists without loading it
function checkPackageExists(packageName: string): string {
  try {
    // Check if package.json exists in node_modules
    const fs = require('fs');
    const path = require('path');
    const packagePath = path.resolve('node_modules', packageName, 'package.json');
    
    if (fs.existsSync(packagePath)) {
      // Read package.json to get version without loading the actual module
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return `installed (${packageJson.version})`;
    }
    return 'not found';
  } catch (error) {
    return `error: ${error instanceof Error ? error.message : String(error)}`;
  }
} 