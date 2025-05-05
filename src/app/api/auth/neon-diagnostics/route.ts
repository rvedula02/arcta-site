import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mask sensitive information in database URLs
function maskUrl(url: string): string {
  if (!url) return '[NOT SET]';
  try {
    return url.replace(/\/\/([^:]+):([^@]+)@/, '//[user]:[password]@');
  } catch {
    return '[ERROR MASKING URL]';
  }
}

// Check all possible Neon database environment variables
async function checkNeonEnvironment() {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? maskUrl(process.env.DATABASE_URL) : '[NOT SET]',
    DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED ? maskUrl(process.env.DATABASE_URL_UNPOOLED) : '[NOT SET]',
    POSTGRES_URL: process.env.POSTGRES_URL ? maskUrl(process.env.POSTGRES_URL) : '[NOT SET]',
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? maskUrl(process.env.POSTGRES_PRISMA_URL) : '[NOT SET]',
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? maskUrl(process.env.POSTGRES_URL_NON_POOLING) : '[NOT SET]',
    // Individual components
    PGHOST: process.env.PGHOST || '[NOT SET]',
    PGHOST_UNPOOLED: process.env.PGHOST_UNPOOLED || '[NOT SET]',
    PGUSER: process.env.PGUSER || '[NOT SET]',
    PGDATABASE: process.env.PGDATABASE || '[NOT SET]',
    PGPASSWORD: process.env.PGPASSWORD ? '[SET]' : '[NOT SET]',
    // Other important vars
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '[NOT SET]',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '[SET]' : '[NOT SET]',
    NODE_ENV: process.env.NODE_ENV || '[NOT SET]',
    VERCEL: process.env.VERCEL || '[NOT SET]'
  };

  // URL protocol check
  const protocolChecks = {
    DATABASE_URL_PROTOCOL: process.env.DATABASE_URL?.startsWith('postgres://') ? 'postgres://' : 
                         process.env.DATABASE_URL?.startsWith('postgresql://') ? 'postgresql://' : 
                         '[UNKNOWN/NOT SET]',
    POSTGRES_URL_PROTOCOL: process.env.POSTGRES_URL?.startsWith('postgres://') ? 'postgres://' : 
                         process.env.POSTGRES_URL?.startsWith('postgresql://') ? 'postgresql://' : 
                         '[UNKNOWN/NOT SET]',
    POSTGRES_PRISMA_URL_PROTOCOL: process.env.POSTGRES_PRISMA_URL?.startsWith('postgres://') ? 'postgres://' : 
                                process.env.POSTGRES_PRISMA_URL?.startsWith('postgresql://') ? 'postgresql://' : 
                                '[UNKNOWN/NOT SET]'
  };

  // SSL check
  const sslChecks = {
    DATABASE_URL_HAS_SSL: process.env.DATABASE_URL?.includes('sslmode=') || false,
    POSTGRES_URL_HAS_SSL: process.env.POSTGRES_URL?.includes('sslmode=') || false,
    POSTGRES_PRISMA_URL_HAS_SSL: process.env.POSTGRES_PRISMA_URL?.includes('sslmode=') || false
  };
  
  return {
    environmentVariables: envVars,
    protocolChecks,
    sslChecks
  };
}

// Test database connection with detailed error reporting
async function testConnection() {
  try {
    const startTime = Date.now();
    const count = await prisma.user.count();
    const duration = Date.now() - startTime;
    
    return {
      success: true,
      userCount: count,
      duration: `${duration}ms`,
      message: "Successfully connected to database"
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      message: "Failed to connect to database"
    };
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const neonEnvironment = await checkNeonEnvironment();
    const connectionTest = await testConnection();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      neonEnvironment,
      connectionTest,
      nodeVersion: process.version,
      prismaVersion: '5.9.1'
    });
  } catch (error: any) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: 'Neon diagnostics failed',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
} 