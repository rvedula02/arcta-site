/**
 * This file creates a Prisma client that uses the Neon serverless adapter
 * for better performance in serverless environments.
 */

import { PrismaClient, Prisma } from '../generated/prisma';
import { getNeonUrl } from './neon-adapter';

// Import neonConfig safely with fallback
let neonConfig: any;
try {
  const neonServerless = require('@neondatabase/serverless');
  neonConfig = neonServerless.neonConfig;
} catch (error) {
  console.warn('Failed to load @neondatabase/serverless for PrismaNeon client', error);
  neonConfig = {
    fetchConnectionCache: false,
    useSecureWebSocket: false
  };
}

// Declare global variable for PrismaClient instance
declare global {
  var prismaNeon: PrismaClient | undefined;
}

/**
 * Creates a Prisma client configured to use the Neon serverless driver
 */
function getPrismaNeonClient(): PrismaClient {
  try {
    // Configure Neon for serverless environments if available
    try {
      neonConfig.fetchConnectionCache = true;
      neonConfig.useSecureWebSocket = true;
      console.log('Configured Neon for serverless environment');
    } catch (neonConfigError) {
      console.warn('Could not configure Neon serverless options', neonConfigError);
    }

    // Get the best URL
    const neonUrl = getNeonUrl();
    console.log('Using Neon connection URL for Prisma');
    
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

    // Initialize and return the client
    return new PrismaClient(options);
  } catch (error) {
    console.error('Failed to initialize Prisma with Neon:', error);
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