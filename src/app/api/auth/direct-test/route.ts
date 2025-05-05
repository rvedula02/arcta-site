import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  try {
    // Get the database URL
    const originalUrl = process.env.DATABASE_URL || '';
    
    // Create a direct client without URL overrides
    // Prisma 5.x handles the URL better through environment variables
    const directClient = new PrismaClient({
      log: ['error' as const, 'info' as const]
    });

    // Try a simple query
    let result;
    try {
      const count = await directClient.user.count();
      result = {
        success: true,
        count,
        databaseUrlProtocol: originalUrl.split(':')[0]
      };
    } catch (error: any) {
      result = {
        success: false,
        error: error.message,
        code: error.code,
        meta: error.meta
      };
    } finally {
      await directClient.$disconnect();
    }

    // Basic environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL === '1' ? 'true' : 'false',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      PRISMA_VERSION: '5.9.1' // The specific version we downgraded to
    };
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      result,
      env: envInfo
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Test failed',
      message: error.message
    }, { status: 500 });
  }
} 