import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '../../../../../lib/prisma';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

// Explicitly set Node.js runtime for this API route
export const runtime = 'nodejs';

export async function GET(
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
    
    // Check if running on Vercel production
    const isVercelProduction = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';
    
    if (isVercelProduction) {
      // In production on Vercel, return a message about storage limitations
      const message = `
        <html>
          <head>
            <title>File Download Unavailable</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; max-width: 600px; margin: 50px auto; padding: 20px; }
              h1 { color: #10b981; }
              p { margin-bottom: 15px; }
              .box { background-color: #f3f4f6; border-radius: 8px; padding: 15px; border-left: 4px solid #10b981; }
            </style>
          </head>
          <body>
            <h1>File Download Unavailable</h1>
            <div class="box">
              <p>This application is currently running on Vercel, which doesn't support persistent file storage.</p>
              <p>To implement permanent file storage, the application needs to be integrated with a cloud storage service like:</p>
              <ul>
                <li>AWS S3</li>
                <li>Google Cloud Storage</li>
                <li>Cloudinary</li>
                <li>Firebase Storage</li>
              </ul>
              <p>The file metadata exists in the database, but the actual file content is not available.</p>
            </div>
            <p><a href="/profile">Return to profile</a></p>
          </body>
        </html>
      `;
      
      return new NextResponse(message, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        }
      });
    }
    
    // Check if file exists in storage
    if (!existsSync(file.storagePath)) {
      return NextResponse.json(
        { message: 'File not found in storage' },
        { status: 404 }
      );
    }
    
    // Read file from storage
    const fileBuffer = await readFile(file.storagePath);
    
    // Set response headers
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${file.fileName}"`);
    headers.set('Content-Type', file.fileType || 'application/octet-stream');
    headers.set('Content-Length', fileBuffer.length.toString());
    
    // Return file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    
    const message = error instanceof Error 
      ? error.message 
      : 'Failed to download file';
    
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
} 