import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

// Explicitly set Node.js runtime for this API route
export const runtime = 'nodejs';

// This endpoint tests Prisma with direct Postgres URLs
export async function GET() {
  try {
    // Get database URL and convert if needed
    let dbUrl = process.env.POSTGRES_PRISMA_URL || 
                process.env.DATABASE_URL || 
                process.env.POSTGRES_URL;
    
    if (!dbUrl) {
      return NextResponse.json({
        error: 'No database URL found in environment variables'
      }, { status: 500 });
    }
    
    // Convert postgres:// to postgresql:// if needed
    if (dbUrl.startsWith('postgres://')) {
      dbUrl = dbUrl.replace(/^postgres:\/\//, 'postgresql://');
    }
    
    // Create a new PrismaClient with this URL
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl
        }
      }
    });
    
    // Test the connection
    const startTime = Date.now();
    const userCount = await prisma.user.count();
    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      userCount,
      duration: `${duration}ms`,
      urlProtocol: dbUrl.split('://')[0],
      message: 'Successfully connected using direct PostgreSQL URL'
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Prisma connection failed',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
} 