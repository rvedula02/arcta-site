import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

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