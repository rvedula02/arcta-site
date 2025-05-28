import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Database connection not available',
        time: new Date().toISOString()
      }, { status: 500 });
    }

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