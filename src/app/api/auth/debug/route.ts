import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    // Check database connection
    let dbStatus;
    try {
      const userCount = await prisma.user.count();
      dbStatus = {
        connected: true,
        userCount
      };
    } catch (dbError: any) {
      dbStatus = {
        connected: false,
        error: dbError.message,
        stack: dbError.stack?.split('\n').slice(0, 3).join('\n')
      };
    }
    
    // Environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DATABASE_URL: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 10)}...` : '[NOT SET]',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '[SET]' : '[NOT SET]',
      HAS_SSL: process.env.DATABASE_URL?.includes('sslmode=') ? 'Yes' : 'No'
    };
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      database: dbStatus,
      env: envInfo
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
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