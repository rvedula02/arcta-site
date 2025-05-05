import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Direct instantiation with detailed error reporting
export async function GET() {
  try {
    // Log the DATABASE_URL (safely masked) for debugging
    const dbUrl = process.env.DATABASE_URL || '[not set]';
    const maskedUrl = dbUrl.replace(/:([^@]*)@/, ':****@');
    console.log('Database URL:', maskedUrl);
    
    // Create a standalone Prisma client for direct testing
    const testClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      log: ['query', 'info', 'warn', 'error']
    });
    
    // Try a simple query
    let result;
    try {
      const count = await testClient.user.count();
      result = { success: true, userCount: count };
    } catch (queryError: any) {
      result = { 
        success: false,
        error: queryError.message,
        code: queryError.code,
        meta: queryError.meta,
        clientVersion: queryError.clientVersion
      };
    } finally {
      // Always disconnect
      await testClient.$disconnect();
    }
    
    // Extra environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      DATABASE_URL_PREFIX: dbUrl.split(':')[0]
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      connection: result,
      environment: envInfo
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Connection test failed',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
} 