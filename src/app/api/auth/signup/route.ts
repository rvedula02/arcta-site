// Use the shared Prisma client
import { prismaNeon as prisma } from '@/lib/prisma-neon';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// Explicitly set Node.js runtime for this API route
export const runtime = 'nodejs';

const SALT_ROUNDS = 10;

// Helper function to check database connection
async function checkDatabaseConnection() {
  try {
    await prisma.user.count();
    return { connected: true };
  } catch (error) {
    console.error("Database connection error in signup endpoint:", error);
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function POST(request: Request) {
  try {
    // Check database connection first
    const dbStatus = await checkDatabaseConnection();
    if (!dbStatus.connected) {
      console.error("Database connection failed during signup:", dbStatus.error);
      return NextResponse.json({ 
        message: 'Database connection failed',
        details: dbStatus.error
      }, { status: 500 });
    }
    
    // Destructure new fields from the request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json({ message: 'Invalid request body format' }, { status: 400 });
    }

    const { firstName, lastName, company, email, password, needsDescription } = body;

    // Validate required fields
    if (!firstName || !lastName || !company || !email || !password) {
      return NextResponse.json({ 
        message: 'Missing required fields: firstName, lastName, company, email, password',
        receivedFields: Object.keys(body) 
      }, { status: 400 });
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Check if user already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json({ message: 'Email already in use' }, { status: 409 }); // 409 Conflict
      }
    } catch (findError) {
      console.error("Error checking for existing user:", findError);
      return NextResponse.json({ 
        message: 'Database error while checking for existing user',
        details: findError instanceof Error ? findError.message : String(findError)
      }, { status: 500 });
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      return NextResponse.json({ message: 'Error processing password' }, { status: 500 });
    }

    // Create user with new fields
    try {
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
    } catch (createError) {
      console.error("Error creating user:", createError);
      return NextResponse.json({ 
        message: 'Error creating user account',
        details: createError instanceof Error ? createError.message : String(createError)
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Sign up error:", error);
    // Detailed error response
    return NextResponse.json({ 
      message: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 