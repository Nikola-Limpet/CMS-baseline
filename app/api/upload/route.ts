import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';

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
  maxFilesPerSubmission: 5,
  virusScanEnabled: process.env.NODE_ENV === 'production'
};

// File type validation
function validateFileType(file: File): { valid: boolean; error?: string } {
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

  if (!VALIDATION_CONFIG.allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type ${fileExtension} is not allowed. Allowed types: ${VALIDATION_CONFIG.allowedExtensions.join(', ')}`
    };
  }

  if (!VALIDATION_CONFIG.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `MIME type ${file.type} is not allowed`
    };
  }

  return { valid: true };
}

// File size validation
function validateFileSize(file: File): { valid: boolean; error?: string } {
  if (file.size > VALIDATION_CONFIG.maxFileSize) {
    const maxSizeMB = VALIDATION_CONFIG.maxFileSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size of ${maxSizeMB}MB`
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty'
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

// Content validation (basic checks)
async function validateFileContent(file: File): Promise<{ valid: boolean; error?: string }> {
  try {
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Check for common file signatures
    const signatures = {
      pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
      jpeg: [0xFF, 0xD8, 0xFF],
      png: [0x89, 0x50, 0x4E, 0x47],
      zip: [0x50, 0x4B, 0x03, 0x04],
      gif: [0x47, 0x49, 0x46, 0x38]
    };

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // Basic signature validation for common file types
    if (fileExtension === 'pdf' && !startsWithSignature(uint8Array, signatures.pdf)) {
      return { valid: false, error: 'File does not appear to be a valid PDF' };
    }

    if (['jpg', 'jpeg'].includes(fileExtension || '') && !startsWithSignature(uint8Array, signatures.jpeg)) {
      return { valid: false, error: 'File does not appear to be a valid JPEG' };
    }

    if (fileExtension === 'png' && !startsWithSignature(uint8Array, signatures.png)) {
      return { valid: false, error: 'File does not appear to be a valid PNG' };
    }

    if (fileExtension === 'gif' && !startsWithSignature(uint8Array, signatures.gif)) {
      return { valid: false, error: 'File does not appear to be a valid GIF' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Failed to validate file content' };
  }
}

function startsWithSignature(data: Uint8Array, signature: number[]): boolean {
  if (data.length < signature.length) return false;
  return signature.every((byte, index) => data[index] === byte);
}

// Generate secure file name
function generateSecureFileName(originalName: string, userId?: string): string {
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(8).toString('hex');
  const userPrefix = userId ? userId.slice(0, 8) : 'anon';

  return `${userPrefix}_${timestamp}_${randomSuffix}.${extension}`;
}

// Main upload handler
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? null;

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const problemId = formData.get('problem_id') as string | null;
    const submissionType = formData.get('type') as string || 'submission';

    if (!file) {
      return apiError('No file provided', 400);
    }

    if (!problemId) {
      return apiError('Problem ID is required', 400);
    }

    // Comprehensive file validation
    const validations = [
      validateFileName(file.name),
      validateFileType(file),
      validateFileSize(file),
      await validateFileContent(file)
    ];

    for (const validation of validations) {
      if (!validation.valid) {
        return apiError(validation.error!, 400);
      }
    }

    // Generate secure file name and path
    const secureFileName = generateSecureFileName(file.name, userId || undefined);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'submissions', submissionType, problemId || 'general');
    const filePath = path.join(uploadDir, secureFileName);

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Save file to local storage
    const buffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(buffer));

    // Generate public URL
    const publicUrl = `/uploads/submissions/${submissionType}/${problemId || 'general'}/${secureFileName}`;


    return apiSuccess({
      url: publicUrl,
      filename: secureFileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploaded_at: new Date().toISOString()
    });

  } catch (error) {
    return handleApiError(error, 'Upload failed. Please try again.');
  }
}

// GET endpoint for upload configuration
export async function GET() {
  return apiSuccess({
    maxFileSize: VALIDATION_CONFIG.maxFileSize,
    maxFilesPerSubmission: VALIDATION_CONFIG.maxFilesPerSubmission,
    allowedExtensions: VALIDATION_CONFIG.allowedExtensions,
    allowedMimeTypes: VALIDATION_CONFIG.allowedMimeTypes
  });
}
