import { NextResponse } from 'next/server';
import { prismaNeon, db } from '@/lib/prisma-neon';

export async function GET(): Promise<NextResponse> {
  try {
    // Test Prisma connection with Neon adapter
    const startTime = Date.now();
    
    // Use the db helper
    const userCount = await db.getUserCount();
    
    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      message: 'Neon-powered Prisma test',
      result: {
        success: true,
        userCount,
        duration: `${duration}ms`
      },
      info: {
        usingNeonServerless: true,
        package: '@neondatabase/serverless',
        prismaClient: 'prismaNeon',
        description: 'This endpoint uses Prisma with the Neon serverless driver'
      }
    });
  } catch (error: any) {
    console.error('Neon Prisma test error:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: 'Neon Prisma test failed',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
} 