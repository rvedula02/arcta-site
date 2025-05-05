import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check runtime environment
    const isVercel = process.env.VERCEL === '1';
    const nodeEnv = process.env.NODE_ENV || 'unknown';
    const region = process.env.VERCEL_REGION || 'unknown';
    
    // Check database connection basics
    let dbTest = { success: false, error: null, count: null };
    try {
      const count = await prisma.user.count();
      dbTest = {
        success: true,
        error: null,
        count
      };
    } catch (err: any) {
      dbTest = {
        success: false,
        error: err.message,
        count: null
      };
    }
    
    // Check database URL configuration (masked)
    let dbUrlInfo = null;
    if (process.env.DATABASE_URL) {
      const url = process.env.DATABASE_URL;
      const maskedUrl = url.replace(/:([^@]*)@/, ':****@');
      dbUrlInfo = {
        set: true,
        protocol: url.split(':')[0],
        hasSSL: url.includes('sslmode='),
        isPgBouncer: maskedUrl.includes('-pooler'),
        host: maskedUrl.split('@')[1]?.split('/')[0] || 'unknown',
        masked: `${maskedUrl.substring(0, 15)}...${maskedUrl.substring(maskedUrl.indexOf('@'))}`,
      };
    } else {
      dbUrlInfo = { set: false };
    }
    
    // Check auth configuration
    const authConfig = {
      nextAuthUrl: process.env.NEXTAUTH_URL || 'not set',
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'set' : 'not set',
      baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'unknown'
    };
    
    return NextResponse.json({
      environment: {
        isVercel,
        nodeEnv,
        region,
        timestamp: new Date().toISOString()
      },
      database: dbTest,
      configuration: {
        database: dbUrlInfo,
        auth: authConfig
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: true,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
} 