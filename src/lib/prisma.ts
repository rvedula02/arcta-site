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
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create a new PrismaClient instance or use the existing one
export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// For clean process shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    console.log('Process beforeExit event - cleaning up Prisma connections');
  });
} 