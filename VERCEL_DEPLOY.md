# Vercel Deployment Checklist for Arcta Site

## Required Environment Variables

Make sure you have the following environment variables set in your Vercel project settings:

### Database Configuration - IMPORTANT CORRECTION
You have two options for your database connection:

#### Option 1: Standard PostgreSQL Connection (Recommended)
- `DATABASE_URL`: Your Neon PostgreSQL connection string
  - Format: `postgres://username:password@hostname:port/database?sslmode=require`
  - Example: `postgres://neondb_owner:password@ep-still-hill-a4sluwp3-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
  - **Critical**: Make sure `sslmode=require` is included

#### Option 2: Prisma Accelerate (Only if you've set up Accelerate)
- If using Prisma Accelerate, your `DATABASE_URL` should be:
  - Format: `prisma://accelerate-endpoint-url`
  - You'll need to set up Prisma Accelerate separately for this option

### NextAuth Configuration
- `NEXTAUTH_SECRET`: A strong random string for session encryption
  - Example: `your-random-secure-string-here`
  - Can be generated with: `openssl rand -base64 32`
- `NEXTAUTH_URL`: (Optional) Your site's full URL
  - Will be automatically set by middleware if not provided
  - Example: `https://your-app.vercel.app`

## Verification Steps After Deployment

1. **Check Database Connection**:
   - Visit `/api/auth/vercel-debug` on your deployed site
   - Verify that database connection is successful
   - Check if SSL is enabled for the database connection

2. **Test Authentication**:
   - Try logging in with test credentials
   - Check for any errors in Vercel logs
   - Verify session persistence by navigating to protected pages

3. **Troubleshooting**:
   - If authentication fails, check the Vercel logs for detailed error messages
   - For database connection errors, verify that your database URL is in the correct format
   - Ensure `NEXTAUTH_SECRET` is properly configured for secure sessions

## Common Issues

1. **"URL must start with protocol prisma://" Error**:
   - This means you're trying to use Prisma Accelerate but haven't set it up correctly
   - Solution: Use a standard PostgreSQL URL with `postgres://` protocol or set up Prisma Accelerate properly

2. **Database Connection Failures**:
   - Most common cause: Missing SSL parameters in the connection string
   - Solution: Add `?sslmode=require` to the end of your standard PostgreSQL URL

3. **NextAuth URL Errors**:
   - Issue: Redirect after login fails due to incorrect callback URL
   - Solution: 
     - Let the middleware set NEXTAUTH_URL automatically, or
     - Manually set NEXTAUTH_URL to match your deployment domain

## Important Notes

- The application uses Prisma 6.7.0, which has specific URL format requirements
- Authentication cookies require HTTPS in production
- The middleware automatically sets NEXTAUTH_URL if it's missing
- SSL is required for standard PostgreSQL database connections in production 