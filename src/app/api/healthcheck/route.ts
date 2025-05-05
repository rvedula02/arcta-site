import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    let databaseStatus;
    try {
      const userCount = await prisma.user.count();
      databaseStatus = {
        connected: true,
        userCount,
      };
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      databaseStatus = {
        connected: false,
        error: dbError.message,
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
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: databaseStatus,
      environment: envCheck,
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
} 