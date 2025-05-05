import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

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
    
    // Check password
    try {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return NextResponse.json({ 
          success: true, 
          message: 'Credentials valid',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          },
          dbStats: { userCount }
        });
      } else {
        return NextResponse.json({ 
          error: 'Invalid password',
          passwordLength: password.length,
          hashedPasswordLength: user.password.length
        }, { status: 401 });
      }
    } catch (bcryptError: any) {
      console.error('bcrypt error:', bcryptError);
      return NextResponse.json({ 
        error: 'Password verification error', 
        details: bcryptError.message 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Debug API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
} 