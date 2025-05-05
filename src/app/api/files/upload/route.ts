import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '../../../../lib/prisma';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Explicitly set Node.js runtime for this API route
export const runtime = 'nodejs';

// Increase payload size limit for file uploads (default is 4mb)
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};

// Helper function to ensure upload directory exists
async function ensureUploadDir(userId: string) {
  // Check if running on Vercel production
  const isVercelProduction = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';
  
  if (isVercelProduction) {
    // In production on Vercel, return a dummy path (files won't actually be stored here)
    console.warn('Warning: Running on Vercel production. File storage will not persist.');
    return `/tmp/uploads/${userId}`;
  }
  
  // In development or other environments, use local filesystem
  const uploadDir = join(process.cwd(), 'uploads', userId);
  try {
    await mkdir(uploadDir, { recursive: true });
    return uploadDir;
  } catch (error) {
    console.error('Error creating upload directory:', error);
    throw new Error('Failed to create upload directory');
  }
}

// Helper function to read form data with file
async function readFormData(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const description = formData.get('description') as string | null;
  
  if (!file) {
    throw new Error('No file provided');
  }
  
  return { file, description };
}

export async function POST(req: NextRequest) {
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
    
    // Get file from request
    const { file, description } = await readFormData(req);
    
    // Get file properties
    const fileName = file.name;
    const fileType = file.type;
    const fileSize = file.size;
    
    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        { message: 'File is too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }
    
    // Get upload directory
    const uploadDir = await ensureUploadDir(user.id);
    
    // Generate unique filename
    const uniqueId = uuidv4();
    const fileExtension = fileName.split('.').pop() || '';
    const storedFileName = `${uniqueId}.${fileExtension}`;
    const storagePath = join(uploadDir, storedFileName);
    
    // Convert File to ArrayBuffer
    const buffer = await file.arrayBuffer();
    
    // Check if running on Vercel production
    const isVercelProduction = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';
    
    if (!isVercelProduction) {
      // Only write to filesystem if not on Vercel production
      await writeFile(storagePath, Buffer.from(buffer));
    } else {
      console.warn('File storage skipped in Vercel production environment');
    }
    
    // Create file record in database
    const userFile = await prisma.userFile.create({
      data: {
        fileName,
        fileSize,
        fileType,
        storagePath,
        description: description || undefined,
        userId: user.id,
      },
    });
    
    // Return success response with Vercel warning if applicable
    return NextResponse.json(
      { 
        message: isVercelProduction 
          ? 'File metadata stored. Note: For persistent file storage on Vercel, use a service like S3, Cloudinary, or Firebase Storage.' 
          : 'File uploaded successfully',
        fileId: userFile.id,
        vercelWarning: isVercelProduction
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    
    const message = error instanceof Error 
      ? error.message 
      : 'Failed to upload file';
    
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
} 