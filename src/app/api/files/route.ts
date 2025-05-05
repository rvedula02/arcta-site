import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '../../../lib/prisma';

// Explicitly set Node.js runtime for this API route
export const runtime = 'nodejs';

// GET endpoint to retrieve all files for the current user
export async function GET() {
  try {
    // Get current session
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const email = session.user.email as string;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get all files for the user
    const files = await prisma.userFile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    // Return the files
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error fetching files:', error);
    
    return NextResponse.json(
      { message: 'Failed to fetch files' },
      { status: 500 }
    );
  }
} 