# Vercel Authentication Troubleshooting Guide

## Common Authentication Errors

### 401 Error (Unauthorized) on `/api/auth/callback/credentials`
This indicates that authentication is failing during the login process.

### 500 Error (Internal Server Error) on `/api/auth/signup`
This indicates a server error during the signup process.

## Quick Fixes

1. **Use the Neon Serverless Adapter**
   - We've added the `@neondatabase/serverless` package which is specifically designed for serverless environments
   - Test this with the `/api/auth/neon-direct` and `/api/auth/neon-prisma` endpoints

2. **Check Neon Environment Variables**
   - The enhanced Prisma client will now check multiple environment variables:
     - `POSTGRES_PRISMA_URL` (preferred for Prisma)
     - `DATABASE_URL_UNPOOLED` (for direct connections)
     - `DATABASE_URL` (standard)
     - `POSTGRES_URL` (Vercel Postgres format)
     - Individual components (`PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`)

3. **Verify NEXTAUTH Variables**
   - `NEXTAUTH_URL` - Must be set to your deployment URL (e.g., `https://arcta.ai`)
   - `NEXTAUTH_SECRET` - Must be set to a secure random string

## Vercel Environment Variables

You can keep your existing Neon database environment variables as they are. Our enhanced client will check all of them in order of preference:

1. `POSTGRES_PRISMA_URL` - Best for Prisma with all parameters included
2. `DATABASE_URL_UNPOOLED` - Good for production to avoid connection pooling issues
3. `DATABASE_URL` - Standard database URL
4. Individual connection parameters
5. `POSTGRES_URL` - Vercel-specific format

## Using the Neon Serverless Adapter (Recommended)

The app now includes the `@neondatabase/serverless` package, which provides these benefits:

1. **Better Connection Handling**: Designed specifically for serverless environments
2. **WebSocket Connection**: Uses WebSockets for more efficient connections
3. **Connection Pooling**: Improves performance and reduces connection errors
4. **Automatic Retries**: Handles temporary connection issues automatically

To use this in your authentication:

1. Test it with the new endpoints:
   - `/api/auth/neon-direct` - Tests direct SQL connection
   - `/api/auth/neon-prisma` - Tests Prisma with Neon adapter

2. If these tests work, but the regular endpoints don't, we should update the authentication routes to use the Neon adapter.

## Neon Database URL Format Issues

The app now handles these common issues automatically:

1. **Protocol Conversion**: Automatically converts `postgres://` to `postgresql://`
2. **SSL Parameters**: Adds `sslmode=require` if missing in production
3. **Connection Timeout**: Adds `connect_timeout=15` to avoid hanging connections

## Advanced Troubleshooting

### Database Connection Issues

If you're still seeing connection problems:

1. **Check the New Diagnostics**
   - Visit `/api/auth/neon-diagnostics` to see which environment variables are being used
   - Check if any connection fails and what error it reports

2. **Direct vs. Prisma Connection**
   - If `/api/auth/neon-direct` works but `/api/auth/neon-prisma` doesn't, the issue is with Prisma
   - If neither works, the issue is likely with your database credentials or network

3. **Pooled vs. Non-Pooled Connections**
   - If using pooled connections (URLs with `-pooler` in them) causes issues, try setting `DATABASE_URL_UNPOOLED` environment variable
   - The app will prefer non-pooled connections in production

### Authentication Flow Debugging

1. **View Vercel Logs**
   - Check the Function Logs in Vercel dashboard for detailed error information
   - Look for database connection failures or authorization errors

2. **Test Authentication API Directly**
   - Use the `/api/auth/debug` POST endpoint to test authentication with credentials
   
## How the Enhanced Prisma Client Works

The updated setup in this app includes:

1. **Regular Prisma Client**: For backward compatibility
2. **Neon-Powered Prisma Client**: For improved serverless performance
3. **Direct Neon Connection**: For low-level database operations

## Need More Help?

Check these diagnostic endpoints:
- `/api/auth/neon-direct` - Tests direct Neon connection (bypassing Prisma)
- `/api/auth/neon-prisma` - Tests Prisma with Neon adapter
- `/api/auth/neon-diagnostics` - For detailed Neon database environment checks
- `/api/auth/production-diagnostics` - For production environment diagnostics
- `/api/auth/debug` - For testing the authentication system directly 