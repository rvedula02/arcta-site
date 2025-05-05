import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test the prisma connection by counting users
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Prisma connection is working', 
      userCount,
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error('Prisma test error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Prisma connection failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 