# Cloud Storage Integration Guide

For production deployments on Vercel, you'll need to integrate a proper cloud storage solution. This guide provides instructions for integrating with popular cloud storage providers.

## AWS S3 Integration

### 1. Set Up AWS S3

1. Create an AWS account if you don't have one
2. Create an S3 bucket
3. Set up proper CORS configuration for your bucket
4. Create an IAM user with programmatic access and permissions to the bucket

### 2. Install Required Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 3. Environment Variables

Add these to your `.env.local` file and Vercel environment variables:

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_bucket_region
AWS_S3_BUCKET=your_bucket_name
```

### 4. Implementation Example

Create a file at `src/lib/s3.ts`:

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Upload file
export async function uploadFileToS3(fileBuffer: Buffer, fileName: string, fileType: string, userId: string) {
  const key = `${userId}/${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: key,
    Body: fileBuffer,
    ContentType: fileType,
  });
  
  await s3Client.send(command);
  return key; // Return the S3 key to store in your database
}

// Generate download URL (temporary signed URL)
export async function getSignedDownloadUrl(s3Key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: s3Key,
  });
  
  // URL expiry in seconds
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}

// Delete file
export async function deleteFileFromS3(s3Key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: s3Key,
  });
  
  await s3Client.send(command);
}
```

### 5. Modify API Routes

Replace your filesystem storage with S3 calls in:
- `src/app/api/files/upload/route.ts`
- `src/app/api/files/[fileId]/download/route.ts`
- `src/app/api/files/[fileId]/route.ts`

## Google Cloud Storage Integration

### 1. Set Up Google Cloud Storage

1. Create a Google Cloud account
2. Create a new project and storage bucket
3. Create a service account with Storage Admin role
4. Download the service account key as JSON

### 2. Install Required Dependencies

```bash
npm install @google-cloud/storage
```

### 3. Environment Variables

Set up the service account key:

```
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_BUCKET=your_bucket_name
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

For Vercel, you'll need to encode the service account key as a base64 string:

```
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_BUCKET=your_bucket_name
GOOGLE_APPLICATION_CREDENTIALS_JSON=base64_encoded_service_account_json
```

### 4. Implementation Example

Create a file at `src/lib/gcs.ts` with your storage logic.

## Cloudinary Integration

### 1. Set Up Cloudinary

1. Create a Cloudinary account
2. Get your API credentials

### 2. Install Required Dependencies

```bash
npm install cloudinary
```

### 3. Environment Variables

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Implementation Example

Create a file at `src/lib/cloudinary.ts` to handle uploads.

## General Steps to Modify the Application

1. Choose your preferred storage solution
2. Set up the required infrastructure
3. Install the necessary dependencies
4. Configure environment variables
5. Create helper functions for upload/download/delete operations
6. Update the three API routes:
   - Upload: Replace local file storage with cloud upload
   - Download: Replace local file reading with signed URLs or streamed downloads
   - Delete: Replace local file deletion with cloud deletion

7. Update the Prisma schema to store cloud storage references (if needed)
8. Update your UI to handle any changes in how files are retrieved

## Testing

Always test your cloud storage integration thoroughly:

1. Test uploads of various file types and sizes
2. Test downloads immediately after upload and after some time
3. Test file deletion
4. Test with multiple users
5. Test error cases (unauthorized access, missing files, etc.)

For more specific help on integration, consult the documentation for your chosen cloud provider. 