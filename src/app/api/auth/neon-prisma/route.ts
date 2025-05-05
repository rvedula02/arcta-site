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

// Simple database helper functions
const db = {
  getUserCount: async (): Promise<number> => {
    try {
      return await prisma.user.count();
    } catch (error: any) {
      console.error('Error counting users:', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }
};

export async function GET(): Promise<NextResponse> {
  try {
    // Test Prisma connection
    const startTime = Date.now();
    
    // Use the db helper
    const userCount = await db.getUserCount();
    
    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      message: 'Prisma test',
      result: {
        success: true,
        userCount,
        duration: `${duration}ms`
      },
      info: {
        usingNeonServerless: false,
        prismaClient: 'regular PrismaClient',
        description: 'This endpoint uses standard Prisma client'
      }
    });
  } catch (error: any) {
    console.error('Prisma test error:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: 'Prisma test failed',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
} 