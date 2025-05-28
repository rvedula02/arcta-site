import { PrismaClient } from '../generated/prisma';

// Format database URL (convert postgres:// to postgresql:// if needed)
let dbUrl = process.env.DATABASE_URL || 
          process.env.POSTGRES_PRISMA_URL || 
          process.env.POSTGRES_URL;

// Fix protocol if needed
if (dbUrl && dbUrl.startsWith('postgres://')) {
  dbUrl = dbUrl.replace(/^postgres:\/\//, 'postgresql://');
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

// Create a function to get or create the Prisma client
function createPrismaClient(): PrismaClient | null {
  if (!dbUrl) {
    console.warn('No database URL available - Prisma client not initialized');
    return null;
  }

  try {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl
        }
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
    return null;
  }
}

// Create a new PrismaClient instance or use the existing one
// Only create if we have a valid database URL
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

// For clean process shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    if (prisma) {
      console.log('Process beforeExit event - cleaning up Prisma connections');
      await prisma.$disconnect();
    }
  });
} 