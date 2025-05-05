/**
 * This file creates a Prisma client that uses the Neon serverless adapter
 * for better performance in serverless environments.
 */

import { PrismaClient, Prisma } from '@/generated/prisma';
import { neonConfig } from '@neondatabase/serverless';
import { getNeonUrl } from './neon-adapter';

// Declare global variable for PrismaClient instance
declare global {
  var prismaNeon: PrismaClient | undefined;
}

/**
 * Creates a Prisma client configured to use the Neon serverless driver
 */
function getPrismaNeonClient(): PrismaClient {
  try {
    // Configure Neon for serverless environments
    neonConfig.fetchConnectionCache = true;
    neonConfig.useSecureWebSocket = true;

    // Get the best URL
    const neonUrl = getNeonUrl();
    console.log('Using Neon serverless connection for Prisma');
    
    // Define log levels based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const options: Prisma.PrismaClientOptions = {
      log: isProduction 
        ? ['error' as Prisma.LogLevel] 
        : ['query' as Prisma.LogLevel, 'error' as Prisma.LogLevel, 'warn' as Prisma.LogLevel],
      datasources: {
        db: {
          url: neonUrl
        }
      }
    };

    // Enable Data Proxy explicitly for production
    if (isProduction) {
      // Set an environment variable that prisma will use
      process.env.PRISMA_PROXY = 'true';
    }

    // Initialize and return the client
    return new PrismaClient(options);
  } catch (error) {
    console.error('Failed to initialize Prisma with Neon serverless:', error);
    throw error;
  }
}

// Use singleton pattern to avoid multiple client instances
let prismaNeonClient: PrismaClient;

try {
  prismaNeonClient = global.prismaNeon || getPrismaNeonClient();
  
  // Use global for development to avoid multiple instances
  if (process.env.NODE_ENV !== 'production') {
    global.prismaNeon = prismaNeonClient;
  }
} catch (error) {
  console.error('FATAL: Failed to create Prisma Neon client:', error);
  // Create mock client that returns errors
  prismaNeonClient = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
      if (prop === 'connect' || prop === 'disconnect') {
        return () => Promise.resolve();
      }
      return () => Promise.reject(new Error('Database connection failed - operations unavailable'));
    }
  });
}

// Export the client
export const prismaNeon = prismaNeonClient;

/**
 * Helper functions for database operations using the Neon serverless client
 */
export const db = {
  // Example: db.findUsers() - wraps Prisma operations with proper error handling
  findUsers: async () => {
    try {
      return await prismaNeon.user.findMany();
    } catch (error: any) {
      console.error('Error finding users:', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  },
  
  // Add more helper methods as needed
  getUserCount: async (): Promise<number> => {
    try {
      return await prismaNeon.user.count();
    } catch (error: any) {
      console.error('Error counting users:', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }
}; 