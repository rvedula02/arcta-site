import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import { testNeonConnection } from '../../../../lib/neon-adapter';
import bcrypt from 'bcrypt';

// Explicitly set Node.js runtime for this API route
export const runtime = 'nodejs';

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

interface DbStatus {
  connected: boolean;
  userCount?: number;
  error?: string;
  stack?: string;
}

interface EnvInfo {
  NODE_ENV: string | undefined;
  NEXTAUTH_URL: string | undefined;
  DATABASE_URL: string;
  NEXTAUTH_SECRET: string;
  HAS_SSL: string;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const testAuth = url.searchParams.get('auth') === 'true';
  
  try {
    // Basic environment info
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL === '1',
      nextAuthUrl: process.env.NEXTAUTH_URL || '[NOT SET]',
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      cookies: {
        secure: process.env.NEXTAUTH_URL?.startsWith('https://') || false,
        domain: process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).hostname : undefined,
      },
      databaseUrls: {
        // Mask sensitive parts of the URLs
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? 
          process.env.POSTGRES_PRISMA_URL.replace(/\/\/([^:]+):([^@]+)@/, '//[user]:[password]@') : '[NOT SET]',
        POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? 
          process.env.POSTGRES_URL_NON_POOLING.replace(/\/\/([^:]+):([^@]+)@/, '//[user]:[password]@') : '[NOT SET]',
        DATABASE_URL: process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.replace(/\/\/([^:]+):([^@]+)@/, '//[user]:[password]@') : '[NOT SET]',
      }
    };
    
    // Test direct database connection
    const directTest = await testNeonConnection();
    
    // Test Prisma connection
    let prismaTest;
    try {
      const startTime = Date.now();
      const count = await prisma.user.count();
      const duration = Date.now() - startTime;
      prismaTest = {
        success: true,
        count,
        duration: `${duration}ms`
      };
    } catch (error: any) {
      prismaTest = {
        success: false,
        error: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      };
    }
    
    // Test auth if email is provided
    let authTest = null;
    if (email && testAuth) {
      try {
        const user = await prisma.user.findUnique({
          where: { email }
        });
        
        if (user) {
          authTest = {
            success: true,
            userFound: true,
            hasPassword: !!user.password,
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`,
          };
        } else {
          authTest = {
            success: false,
            userFound: false,
            message: 'User not found'
          };
        }
      } catch (error: any) {
        authTest = {
          success: false,
          error: error.message,
          stack: error.stack?.split('\n').slice(0, 3).join('\n')
        };
      }
    }
    
    // Response with all info
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envInfo,
      directConnection: directTest,
      prismaConnection: prismaTest,
      authTest
    });
  } catch (error: any) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: 'Debug failed',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
}

interface LoginCredentials {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const credentials = await request.json() as Partial<LoginCredentials>;
    const { email, password } = credentials;
    
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }
    
    // Test DB connection
    let userCount;
    try {
      userCount = await prisma.user.count();
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: dbError.message 
      }, { status: 500 });
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (!user.password) {
      return NextResponse.json({ error: 'User has no password set' }, { status: 400 });
    }
    
    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    return NextResponse.json({
      success: isValidPassword,
      message: isValidPassword ? 'Authentication successful' : 'Invalid password',
      userExists: true,
      hasPassword: true,
      databaseConnected: true,
      userCount
    });
  } catch (error: any) {
    console.error('Auth debug error:', error);
    return NextResponse.json({
      error: 'Auth debug endpoint error',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
} 