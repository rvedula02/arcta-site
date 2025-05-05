import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';  // Use direct prisma client

// Get database URL and convert if needed
let dbUrl = process.env.DATABASE_URL || 
          process.env.POSTGRES_PRISMA_URL || 
          process.env.POSTGRES_URL || 
          '[not set]';

// Convert postgres:// to postgresql:// if needed
if (dbUrl && dbUrl.startsWith('postgres://')) {
  dbUrl = dbUrl.replace(/^postgres:\/\//, 'postgresql://');
}

// Create a prisma client for this route with explicit database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl === '[not set]' ? undefined : dbUrl
    }
  }
});

// Test connection using the prisma client
export async function GET(): Promise<NextResponse> {
  try {
    // Log the DATABASE_URL (safely masked) for debugging
    const maskedUrl = dbUrl.replace(/:([^@]*)@/, ':****@');
    console.log('Database URL:', maskedUrl);
    console.log('Using protocol:', dbUrl.split(':')[0]);
    
    // Try a simple query using the shared client
    let result;
    try {
      // Use the prisma instance created above
      const count = await prisma.user.count();
      result = { success: true, userCount: count };
    } catch (queryError: any) {
      console.error('Query error:', queryError);
      result = { 
        success: false,
        error: queryError.message,
        code: queryError.code,
        meta: queryError.meta,
        clientVersion: queryError?.clientVersion
      };
    }
    
    // Extra environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL === '1' ? 'true' : 'false',
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DATABASE_URL_PREFIX: dbUrl.split(':')[0],
      PRISMA_VERSION: '5.9.1'
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      connection: result,
      environment: envInfo
    });
  } catch (error: any) {
    console.error('Connection test failed:', error);
    return NextResponse.json({
      error: 'Connection test failed',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
} 