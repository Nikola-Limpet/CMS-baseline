export interface UploadParams {
  file: File;
  problemId?: string;
  type?: string;
}

export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  uploaded_at: string;
}

/**
 * Upload a file to S3 using presigned URLs
 * This function uses the S3 approach instead of local filesystem storage
 */
export async function uploadFile({
  file,
  problemId = 'general',
  type = 'general'
}: UploadParams): Promise<UploadResult> {
  try {
    console.log('Starting S3 upload process for file:', file.name);

    // Sanitize filename for S3
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');

    // Determine S3 prefix based on type and problemId
    let prefix = 'uploads';
    if (type === 'practice-problem-images') {
      prefix = `practice-problems/${problemId || 'general'}/images`;
    } else if (type === 'images') {
      prefix = `images/${problemId || 'general'}`;
    } else if (type === 'blog-images') {
      prefix = 'blog-images';
    } else {
      prefix = `uploads/${type}`;
    }

    // Step 1: Get presigned URL from API
    const response = await fetch('/api/upload/presigned', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: sanitizedFilename,
        contentType: file.type,
        prefix,
        problemId,
        type
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to get presigned URL: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response
    if (!data || !data.presignedUrl) {
      throw new Error('Invalid response from upload API: missing presigned URL');
    }

    // Step 2: Upload file directly to S3
    const uploadResponse = await fetch(data.presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`S3 upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    // Step 3: Construct the final URL
    let finalUrl = data.url;
    if (!finalUrl && data.key) {
      // Construct URL from bucket info if not provided
      const bucket = data.bucket || process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
      const region = data.region || process.env.NEXT_PUBLIC_AWS_REGION;
      if (bucket && region) {
        finalUrl = `https://${bucket}.s3.${region}.amazonaws.com/${data.key}`;
      }
    }

    if (!finalUrl) {
      throw new Error('Could not determine final URL for uploaded file');
    }

    console.log('File uploaded successfully to S3:', finalUrl);

    // Return in the expected format
    return {
      url: finalUrl,
      filename: data.key?.split('/').pop() || sanitizedFilename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploaded_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error instanceof Error ? error : new Error('Failed to upload file');
  }
}

/**
 * Upload an image file specifically for practice problems
 */
export async function uploadPracticeImage(file: File, problemId?: string): Promise<string> {
  const result = await uploadFile({
    file,
    problemId: problemId || 'practice-problem',
    type: 'practice-problem-images'
  });

  return result.url;
}

/**
 * Upload a general image file
 */
export async function uploadImage(file: File, context = 'general'): Promise<string> {
  const result = await uploadFile({
    file,
    problemId: context,
    type: 'images'
  });

  return result.url;
}

/**
 * Upload a blog image file
 */
export async function uploadBlogImage(file: File): Promise<string> {
  const result = await uploadFile({
    file,
    problemId: 'blog',
    type: 'blog-images'
  });

  return result.url;
} 