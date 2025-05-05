import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

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

// Sanitize URL for logging (remove credentials)
function sanitizeUrl(url: string): string {
  if (!url) return '[NOT SET]';
  try {
    // Handle prisma:// URLs differently
    if (url.startsWith('prisma://')) {
      return 'prisma://[credentials-hidden]';
    }
    
    // For postgres/postgresql URLs, mask the password
    return url.replace(/\/\/([^:]+):([^@]+)@/, '//[username]:[password]@');
  } catch (error) {
    return 'Error: Unable to sanitize URL';
  }
}

// Test database connection with retries
async function testDatabaseConnection(retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const start = Date.now();
      const count = await prisma.user.count();
      const duration = Date.now() - start;
      return {
        success: true,
        attempt,
        userCount: count,
        duration: `${duration}ms`
      };
    } catch (error) {
      lastError = error;
      // Wait briefly before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  return {
    success: false,
    attempts: retries,
    error: lastError instanceof Error ? lastError.message : String(lastError),
    stack: lastError instanceof Error ? lastError.stack?.split('\n').slice(0, 3).join('\n') : undefined
  };
}

export async function GET(): Promise<NextResponse> {
  try {
    // Get environment info
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = process.env.VERCEL === '1';
    const url = process.env.DATABASE_URL || '';
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const hasSSL = url.includes('sslmode=');
    
    // Basic environment diagnostics
    const envInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      isVercel,
      nodeVersion: process.version,
      DATABASE_URL: sanitizeUrl(url),
      NEXTAUTH_URL: nextAuthUrl || '[NOT SET]',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '[SET]' : '[NOT SET]',
      hasSSLConfig: hasSSL,
      hostnameInfo: {
        host: url.match(/@([^:]+):/)?.[1] || 'unknown',
        protocol: url.startsWith('postgres://') ? 'postgres' : 
                 url.startsWith('postgresql://') ? 'postgresql' : 
                 url.startsWith('prisma://') ? 'prisma' : 'unknown'
      }
    };
    
    // Test database connection
    const dbResult = await testDatabaseConnection();
    
    return NextResponse.json({
      ...envInfo,
      databaseTest: dbResult,
      prismaClientVersion: "5.9.1", // Hardcoded based on your earlier downgrade
      message: dbResult.success ? 'Connection successful' : 'Connection failed'
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Error in diagnostics endpoint',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 3).join('\n') : undefined
    }, { status: 500 });
  }
} 