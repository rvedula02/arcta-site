import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import bcrypt from 'bcrypt';

// Explicitly set Node.js runtime for this API route
export const runtime = 'nodejs';

// Direct auth implementation without NextAuth
export async function POST(request: Request) {
  try {
    // Get credentials from request
    const data = await request.json();
    const { email, password } = data;
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    // Get database URL and convert if needed
    let dbUrl = process.env.DATABASE_URL || 
              process.env.POSTGRES_PRISMA_URL || 
              process.env.POSTGRES_URL;
    
    if (!dbUrl) {
      return NextResponse.json({ error: 'No database URL found' }, { status: 500 });
    }
    
    // Convert postgres:// to postgresql:// if needed
    if (dbUrl.startsWith('postgres://')) {
      dbUrl = dbUrl.replace(/^postgres:\/\//, 'postgresql://');
    }
    
    console.log(`Basic auth using database URL with protocol: ${dbUrl.split(':')[0]}`);
    
    // Create direct Prisma client
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl
        }
      }
    });
    
    // Find user
    console.log(`Looking for user with email: ${email}`);
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        company: true
      }
    });
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    if (!user.password) {
      console.log('User has no password set');
      return NextResponse.json({ error: 'Account has no password set' }, { status: 401 });
    }
    
    // Compare passwords
    const isValid = await bcrypt.compare(password, user.password);
    console.log(`Password validation result: ${isValid ? 'valid' : 'invalid'}`);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Return user info (excluding password)
    const { password: _, ...userInfo } = user;
    
    // Success
    return NextResponse.json({
      success: true,
      user: userInfo,
      message: 'Authentication successful'
    });
  } catch (error: any) {
    console.error('Authentication error:', error);
    return NextResponse.json({
      error: 'Authentication failed',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
} 