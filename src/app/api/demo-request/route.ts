import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, company, email, message, phone } = data;

    // Validation
    if (!firstName || !lastName || !company || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, company, and email are required' }, 
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if prisma is available
    if (!prisma) {
      console.error('Prisma client not available');
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 500 }
      );
    }

    // Create demo request
    const demoRequest = await prisma.demoRequest.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        company: company.trim(),
        email: email.toLowerCase().trim(),
        message: message ? message.trim() : '',
        phone: phone ? phone.trim() : null,
      },
    });

    return NextResponse.json(
      { success: true, id: demoRequest.id }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Demo request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit demo request' }, 
      { status: 500 }
    );
  }
} 