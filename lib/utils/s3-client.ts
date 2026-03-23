export interface UploadImageParams {
  file: File;
  key?: string;
  contentType?: string;
  prefix?: string;
}

/**
 * Uploads a file to S3 using pre-signed URLs to avoid CORS issues
 * This approach uses a server-side API route to generate a pre-signed URL,
 * then uploads the file directly from the client to S3 using that URL
 */
export async function uploadToS3({ file, prefix = 'blog-images' }: UploadImageParams) {
  try {
    console.log('Starting S3 upload process for file:', file.name);

    // Step 1: Get a pre-signed URL from our API
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '-'); // Sanitize filename
    console.log('Requesting pre-signed URL for:', sanitizedFilename);

    console.log('Requesting pre-signed URL...');
    const response = await fetch('/api/upload/presigned', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: sanitizedFilename,
        contentType: file.type,
        prefix
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to get pre-signed URL: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    const jsonResponse = await response.json();

    // Debug the actual response structure
    console.log('Received response:', JSON.stringify(jsonResponse, null, 2));

    // Support both standardized { success, data } and direct response formats
    let uploadData = jsonResponse;
    if (jsonResponse && typeof jsonResponse === 'object' && 'success' in jsonResponse && 'data' in jsonResponse) {
      console.log('Detected standardized API signature, extracting data...');
      uploadData = jsonResponse.data;
    }

    // Validate the response data
    if (!uploadData || (typeof uploadData === 'object' && Object.keys(uploadData).length === 0)) {
      console.error('Empty response data from upload API:', jsonResponse);
      throw new Error('No data received from upload API');
    }

    // Check if we have a presignedUrl in the response
    const presignedUrl = uploadData.presignedUrl || uploadData.presigned_url || uploadData.url;

    if (!presignedUrl) {
      console.error('Invalid response data (missing URL):', uploadData);
      throw new Error('Failed to get pre-signed URL from server. Response data is missing URL field.');
    }

    // Ensure we have the presignedUrl and other metadata for the rest of the code
    const data = {
      ...uploadData,
      presignedUrl
    };

    // Step 2: Upload the file directly to S3 using the pre-signed URL
    let uploadResponse;
    try {
      console.log('Uploading file to S3 using pre-signed URL...');

      // Validate the presignedUrl before attempting upload
      if (!data.presignedUrl || typeof data.presignedUrl !== 'string') {
        throw new Error('Invalid pre-signed URL received from server');
      }

      // Log partial URL for debugging (hide most of it for security)
      const urlForLogging = data.presignedUrl.substring(0, 60) + '...';
      console.log('Using pre-signed URL (partial):', urlForLogging);

      // Upload the file with proper content type
      uploadResponse = await fetch(data.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      // Check response status
      if (!uploadResponse.ok) {
        console.error('S3 upload failed:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText
        });

        // Try to get more error details if possible
        let errorDetails = '';
        try {
          const errorText = await uploadResponse.text();
          errorDetails = errorText ? ` - ${errorText}` : '';
        } catch {
          // Ignore error reading response body
        }

        throw new Error(`Failed to upload to S3: ${uploadResponse.status} ${uploadResponse.statusText}${errorDetails}`);
      }

      console.log('File uploaded successfully to S3');
      console.log('Upload successful, status:', uploadResponse.status);
    } catch (error: unknown) {
      console.error('Error uploading to S3:', error);
      // Use type assertion to handle the error message safely
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`S3 upload failed: ${errorMessage}`);
    }

    // Construct a direct URL to the uploaded file
    // This ensures we have a working URL even if the returned URL has issues
    // Use optional chaining to safely access nested properties
    let directUrl = '';
    try {
      // First try to use the URL provided by the API
      if (data.url && typeof data.url === 'string') {
        directUrl = data.url;
        console.log('Using API-provided URL:', directUrl);
      }
      // If no URL provided, try to construct one from debug info
      else if (data.debug?.bucket && data.debug?.region && data.debug?.key) {
        directUrl = `https://${data.debug.bucket}.s3.${data.debug.region}.amazonaws.com/${data.debug.key}`;
        console.log('Constructed direct URL from debug info:', directUrl);
      }
      // If no debug info, try to construct from bucket region and key directly
      else if (data.key) {
        // Try to extract bucket and region from presignedUrl
        const bucketMatch = data.presignedUrl.match(/https:\/\/([^.]+)\.s3\.([^.]+)\.amazonaws\.com/);
        if (bucketMatch && bucketMatch.length >= 3) {
          const [, bucket, region] = bucketMatch;
          directUrl = `https://${bucket}.s3.${region}.amazonaws.com/${data.key}`;
          console.log('Constructed URL from presignedUrl pattern:', directUrl);
        } else {
          // Last resort - use environment variables if available
          const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
          const region = process.env.NEXT_PUBLIC_AWS_REGION;
          if (bucket && region) {
            directUrl = `https://${bucket}.s3.${region}.amazonaws.com/${data.key}`;
            console.log('Constructed URL from environment variables:', directUrl);
          } else {
            console.warn('Could not construct direct URL, missing bucket/region information');
          }
        }
      } else {
        console.warn('Could not construct direct URL, missing key');
      }
    } catch (error) {
      console.error('Error constructing direct URL:', error);
    }

    // Validate that we have at least one URL
    if (!directUrl && !data.url) {
      console.warn('No URL available for the uploaded file, this may cause issues');
    }

    // Step 3: Return the file details with both URLs for safety
    return {
      url: directUrl || data.url || '', // Use the directly constructed URL or fallback
      originalUrl: data.url || directUrl || '', // Keep the original URL as a backup
      key: data.key || '',
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}
