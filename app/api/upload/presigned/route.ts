import { NextRequest } from 'next/server';
import { requireAuth, isAuthError } from '@/lib/auth/require';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';

// Validate required environment variables
const requiredEnvVars = {
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
};

// Check for missing environment variables
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key, _]) => key);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
}

// Initialize S3 client only if all env vars are present
let s3Client: S3Client | null = null;

if (missingEnvVars.length === 0) {
  s3Client = new S3Client({
    region: requiredEnvVars.AWS_REGION,
    credentials: {
      accessKeyId: requiredEnvVars.AWS_ACCESS_KEY_ID!,
      secretAccessKey: requiredEnvVars.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

// File validation configuration
const VALIDATION_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/zip',
    'application/x-zip-compressed'
  ],
  allowedExtensions: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.zip'],
};

// File type validation
function validateFileType(filename: string, contentType: string): { valid: boolean; error?: string } {
  const fileExtension = '.' + filename.split('.').pop()?.toLowerCase();

  if (!VALIDATION_CONFIG.allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type ${fileExtension} is not allowed. Allowed types: ${VALIDATION_CONFIG.allowedExtensions.join(', ')}`
    };
  }

  if (!VALIDATION_CONFIG.allowedMimeTypes.includes(contentType)) {
    return {
      valid: false,
      error: `MIME type ${contentType} is not allowed`
    };
  }

  return { valid: true };
}

// File name validation
function validateFileName(fileName: string): { valid: boolean; error?: string } {
  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.(exe|bat|cmd|scr|pif|com)$/i,
    /[<>:"|?*]/,
    /^\./,
    /\.{2,}/
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fileName)) {
      return {
        valid: false,
        error: 'File name contains invalid characters or is potentially unsafe'
      };
    }
  }

  if (fileName.length > 255) {
    return {
      valid: false,
      error: 'File name is too long (maximum 255 characters)'
    };
  }

  return { valid: true };
}

// Generate secure S3 key
function generateS3Key(prefix: string, originalName: string, userId?: string): string {
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(8).toString('hex');
  const userPrefix = userId ? userId.slice(0, 8) : 'anon';
  const baseName = originalName.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9.-]/g, '-');

  return `${prefix}/${userPrefix}_${timestamp}_${baseName}_${randomSuffix}.${extension}`;
}

export async function POST(request: NextRequest) {
  try {
    // Check if S3 is properly configured
    if (!s3Client || missingEnvVars.length > 0) {
      return apiError('S3 configuration error', 500, {
        missing: missingEnvVars,
        required: ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME']
      });
    }

    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;
    const { userId } = authResult;

    const body = await parseJsonBody<Record<string, any>>(request);
    const { filename, contentType, prefix = 'uploads', problemId, type } = body;

    if (!filename || !contentType) {
      return apiError('Filename and content type are required', 400);
    }

    const nameValidation = validateFileName(filename);
    if (!nameValidation.valid) {
      return apiError(nameValidation.error!, 400);
    }

    const typeValidation = validateFileType(filename, contentType);
    if (!typeValidation.valid) {
      return apiError(typeValidation.error!, 400);
    }

    // Generate S3 key
    const s3Key = generateS3Key(prefix, filename, userId);

    // Create presigned URL
    const command = new PutObjectCommand({
      Bucket: requiredEnvVars.AWS_BUCKET_NAME!,
      Key: s3Key,
      ContentType: contentType,
      ContentLength: undefined, // Let S3 handle this
      Metadata: {
        userId,
        problemId: problemId || 'general',
        type: type || 'general',
        originalName: filename,
        uploadedAt: new Date().toISOString(),
      },
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    // Construct the final public URL
    const publicUrl = `https://${requiredEnvVars.AWS_BUCKET_NAME}.s3.${requiredEnvVars.AWS_REGION}.amazonaws.com/${s3Key}`;


    return apiSuccess({
      presignedUrl,
      url: publicUrl,
      key: s3Key,
      bucket: requiredEnvVars.AWS_BUCKET_NAME,
      region: requiredEnvVars.AWS_REGION,
    });

  } catch (error) {
    return handleApiError(error, 'Failed to generate presigned URL. Please try again.');
  }
}

// GET endpoint for upload configuration
export async function GET() {
  return apiSuccess({
    maxFileSize: VALIDATION_CONFIG.maxFileSize,
    allowedExtensions: VALIDATION_CONFIG.allowedExtensions,
    allowedMimeTypes: VALIDATION_CONFIG.allowedMimeTypes,
    bucketName: requiredEnvVars.AWS_BUCKET_NAME,
    region: requiredEnvVars.AWS_REGION,
  });
} 