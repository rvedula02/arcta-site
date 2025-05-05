import { NextResponse } from 'next/server';
import { testNeonConnection, getNeonUrl } from '../../../../lib/neon-adapter';

// Mask sensitive information in database URLs
function maskUrl(url: string): string {
  if (!url) return '[NOT SET]';
  try {
    return url.replace(/\/\/([^:]+):([^@]+)@/, '//[user]:[password]@');
  } catch {
    return '[ERROR MASKING URL]';
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    // Test Neon direct connection
    const connectionTest = await testNeonConnection();
    
    // Get URL info
    let neonUrl: string;
    try {
      neonUrl = maskUrl(getNeonUrl());
    } catch (error: any) {
      neonUrl = `Error: ${error.message}`;
    }
    
    // Prepare response
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      message: 'Neon direct connection test',
      neonUrl,
      connectionTest,
      usingDirectNeonConnection: true,
      packageInfo: {
        name: '@neondatabase/serverless',
        version: '0.9.0',
        description: 'Optimized for serverless environments like Vercel'
      },
      note: 'This endpoint tests the direct Neon connection without Prisma, which can help isolate database connectivity issues'
    });
  } catch (error: any) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: 'Neon direct test failed',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
} 