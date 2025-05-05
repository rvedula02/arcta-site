import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

// Explicitly set Node.js runtime for this API route
export const runtime = 'nodejs';

// This fallback endpoint uses direct Prisma connection without Neon serverless
export async function GET() {
  try {
    // Get all possible database URLs
    const dbUrls = {
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? 
        process.env.POSTGRES_PRISMA_URL.replace(/\/\/([^:]+):([^@]+)@/, '//[user]:[password]@') : '[NOT SET]',
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ?
        process.env.POSTGRES_URL_NON_POOLING.replace(/\/\/([^:]+):([^@]+)@/, '//[user]:[password]@') : '[NOT SET]',
      DATABASE_URL: process.env.DATABASE_URL ?
        process.env.DATABASE_URL.replace(/\/\/([^:]+):([^@]+)@/, '//[user]:[password]@') : '[NOT SET]',
      POSTGRES_URL: process.env.POSTGRES_URL ?
        process.env.POSTGRES_URL.replace(/\/\/([^:]+):([^@]+)@/, '//[user]:[password]@') : '[NOT SET]'
    };
    
    // Get database URL with best priority order
    let dbUrl = process.env.POSTGRES_PRISMA_URL || 
                process.env.DATABASE_URL || 
                process.env.POSTGRES_URL;
    
    if (!dbUrl) {
      return NextResponse.json({
        error: 'No database URL found in environment variables',
        availableEnvVars: Object.keys(process.env).filter(key => 
          key.includes('DATABASE') || key.includes('POSTGRES')
        )
      }, { status: 500 });
    }
    
    // Convert postgres:// to postgresql:// if needed
    if (dbUrl.startsWith('postgres://')) {
      dbUrl = dbUrl.replace(/^postgres:\/\//, 'postgresql://');
    }
    
    // Try to create a standard Prisma client
    console.log('Creating standard Prisma client');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl
        }
      }
    });
    
    // Test the connection
    console.log('Testing database connection');
    const startTime = Date.now();
    const userCount = await prisma.user.count();
    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      userCount,
      duration: `${duration}ms`,
      urlProtocol: dbUrl.split('://')[0],
      message: 'Successfully connected using direct Prisma client',
      allUrls: dbUrls,
      packageAvailability: {
        '@neondatabase/serverless': 'No - using fallback endpoint'
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Prisma connection failed',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      allEnvVars: Object.keys(process.env)
    }, { status: 500 });
  }
} 