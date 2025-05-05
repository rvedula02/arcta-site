# Vercel Deployment Checklist for Arcta Site

## Required Environment Variables

Make sure you have the following environment variables set in your Vercel project settings:

### Database Configuration
- `DATABASE_URL`: Your Neon PostgreSQL connection string
  - Example: `postgres://neondb_owner:password@ep-still-hill-a4sluwp3-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
  - **Important**: Make sure `sslmode=require` is included for production

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
   - For database connection errors, verify that `DATABASE_URL` is correctly set with SSL enabled
   - Ensure `NEXTAUTH_SECRET` is properly configured for secure sessions

## Common Issues

1. **Database Connection Failures**:
   - Most common cause: Missing SSL parameters in the connection string
   - Solution: Add `?sslmode=require` to the end of your connection string

2. **NextAuth URL Errors**:
   - Issue: Redirect after login fails due to incorrect callback URL
   - Solution: 
     - Let the middleware set NEXTAUTH_URL automatically, or
     - Manually set NEXTAUTH_URL to match your deployment domain

3. **Prisma Client Generation**:
   - Issue: Incompatible Prisma client between development and production
   - Solution: Vercel should automatically run `prisma generate` during build

## Important Notes

- The application uses Prisma 6.7.0, which requires specific configuration
- Authentication cookies require HTTPS in production
- The middleware automatically sets NEXTAUTH_URL if it's missing
- SSL is required for the database connection in production 