// Use the shared Prisma client
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    // Destructure new fields from the request body
    const { firstName, lastName, company, email, password, needsDescription } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !company || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields: firstName, lastName, company, email, password' }, { status: 400 });
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user with new fields
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        company,
        email,
        password: hashedPassword,
        needsDescription, // Include optional field
      },
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error("Sign up error:", error);
    // Check if it's a known error type if needed, otherwise generic error
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 