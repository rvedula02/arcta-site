import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Simple security check - require admin token
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');
    
    if (token !== process.env.ADMIN_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json({ error: 'Database connection unavailable' }, { status: 500 });
    }

    // Fetch all demo requests
    const demoRequests = await prisma.demoRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Create CSV content
    const headers = [
      'ID',
      'Created At',
      'First Name', 
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'Message',
      'Status',
      'Booked Time',
      'Meeting Link'
    ];

    const csvRows = [
      headers.join(','),
      ...demoRequests.map(request => [
        `"${request.id}"`,
        `"${request.createdAt.toISOString()}"`,
        `"${request.firstName}"`,
        `"${request.lastName}"`,
        `"${request.email}"`,
        `"${request.phone || ''}"`,
        `"${request.company}"`,
        `"${request.message.replace(/"/g, '""')}"`, // Escape quotes in message
        `"${request.status}"`,
        `"${request.bookedTime ? request.bookedTime.toISOString() : ''}"`,
        `"${request.meetingLink || ''}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `demo-requests-${date}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
} 