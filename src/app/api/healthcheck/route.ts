import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

export async function GET() {
  try {
    // Check database connection with retry logic
    const databaseStatus = await checkDatabaseConnection();
    
    // Extract database URL for diagnostic purposes (masked for security)
    let dbUrlInfo: DbUrlInfo = { configured: false };
    if (process.env.DATABASE_URL) {
      const url = process.env.DATABASE_URL;
      const masked = url.replace(/:([^@]*)@/, ':****@');
      const hasSSL = url.includes('sslmode=');
      dbUrlInfo = {
        configured: true,
        protocol: url.split(':')[0],
        host: masked.split('@')[1]?.split('/')[0] || 'unknown',
        hasSSL,
        pooled: masked.includes('-pooler'),
      };
    }

    // Check environment variables (mask sensitive values)
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DATABASE_URL: process.env.DATABASE_URL ? '[SET]' : '[NOT SET]',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '[SET]' : '[NOT SET]',
    };

    return NextResponse.json({
      status: databaseStatus.connected ? 'ok' : 'database_error',
      timestamp: new Date().toISOString(),
      database: databaseStatus,
      databaseUrlInfo: dbUrlInfo,
      environment: envCheck,
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
    }, { status: 500 });
  }
} 