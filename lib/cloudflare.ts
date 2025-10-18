// Cloudflare R2 integration for file storage

export interface CloudflareR2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrlPrefix: string;
}

// This function will be used by the API routes to upload files to Cloudflare R2
export async function uploadFileToR2(
  file: File | Blob,
  fileName: string,
  contentType: string
): Promise<string> {
  // In a real implementation, this would use the Cloudflare R2 API
  // For now, we'll simulate a successful upload and return a URL
  
  // In production, you would:
  // 1. Get pre-signed URL from your Cloudflare Worker
  // 2. Upload the file directly to R2 using that URL
  // 3. Return the public URL of the uploaded file
  
  console.log(`Uploading file ${fileName} of type ${contentType} to R2`);
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a simulated public URL
  // In production, this would be the actual URL from Cloudflare R2
  return `https://storage.eloquence25.workers.dev/${fileName}`;
}

// Function to generate a unique file name to prevent overwriting
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);

  // Guard against undefined or empty originalName
  const name = typeof originalName === 'string' && originalName.length > 0 ? originalName : `${timestamp}`;
  const parts = name.split('.');
  const extension = parts.length > 1 ? parts.pop() : 'bin';

  return `${timestamp}-${randomString}.${extension}`;
}