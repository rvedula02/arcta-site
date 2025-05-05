import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '../../../../lib/prisma';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

// Explicitly set Node.js runtime for this API route
export const runtime = 'nodejs';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
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
    
    // Get file ID from request
    const fileId = params.fileId;
    
    // Get file from database
    const file = await prisma.userFile.findUnique({
      where: { id: fileId },
    });
    
    if (!file) {
      return NextResponse.json(
        { message: 'File not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the file
    if (file.userId !== user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Delete file from database
    await prisma.userFile.delete({
      where: { id: fileId },
    });
    
    // Check if running on Vercel production
    const isVercelProduction = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';
    
    // Delete file from storage if it exists and not on Vercel production
    if (!isVercelProduction && existsSync(file.storagePath)) {
      try {
        await unlink(file.storagePath);
      } catch (err) {
        console.error('Failed to delete file from storage:', err);
        // Continue even if file deletion fails
      }
    }
    
    // Return success response
    return NextResponse.json(
      { 
        message: 'File deleted successfully',
        note: isVercelProduction ? 'File metadata removed from database. Physical file deletion skipped in Vercel environment.' : undefined
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting file:', error);
    
    const message = error instanceof Error 
      ? error.message 
      : 'Failed to delete file';
    
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
} 