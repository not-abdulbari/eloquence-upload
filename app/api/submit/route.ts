export const dynamic = "force-dynamic";
export const revalidate = 0;


import { NextResponse } from 'next/server';
import { uploadFileToR2, generateUniqueFileName } from '@/lib/cloudflare';

export async function POST(request: Request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    
    // Extract submission data
    const fullName = formData.get('fullName') as string;
    const collegeName = formData.get('collegeName') as string;
    const year = formData.get('year') as string;
    const branch = formData.get('branch') as string;
    const contactEmail = formData.get('contactEmail') as string;
    const contactPhone = formData.get('contactPhone') as string;
    const eventType = formData.get('eventType') as string;
    const projectTitle = formData.get('projectTitle') as string;
    const gitRepositoryUrl = formData.get('gitRepositoryUrl') as string || null;
    
    // Prepare submission data
    const submission = {
      fullName,
      collegeName,
      year,
      branch,
      contactEmail,
      contactPhone,
      eventType,
      projectTitle,
      gitRepositoryUrl,
      fileUrls: [] as string[],
      submittedAt: new Date().toISOString(),
    };
    
    // Debug: log incoming form keys to help diagnose missing fields
    try {
      const keys = Array.from(formData.keys());
      console.log('Form keys received:', keys);
    } catch (e) {
      console.log('Could not list form keys', e);
    }

    // Handle file uploads if present
    if (eventType !== 'Web Designing') {
      // Prefer the modern 'files' multi-key; but accept legacy file1,file2... keys
      let uploadedFiles: File[] = [];

      // Get files submitted with the same key 'files'
      const filesFromKey = formData.getAll('files').filter(Boolean) as File[];
      if (filesFromKey.length > 0) uploadedFiles = filesFromKey;

      // Fallback: check legacy file1, file2 keys
      if (uploadedFiles.length === 0) {
        const legacyKeys = Array.from(formData.keys()).filter((k) => /^file\d+$/.test(k));
        for (const k of legacyKeys) {
          const f = formData.get(k) as File;
          if (f) uploadedFiles.push(f);
        }
      }

      if (uploadedFiles.length === 0) {
        return NextResponse.json(
          { error: 'File upload is required for this event type' },
          { status: 400 }
        );
      }

      // Upload each file to Cloudflare R2 (using helper)
      for (const file of uploadedFiles) {
        try {
          const originalName = (file && (file as any).name) || '';
          const contentType = (file && (file as any).type) || 'application/octet-stream';
          const uniqueFileName = generateUniqueFileName(originalName);
          console.log('Uploading file', { originalName, contentType, uniqueFileName });
          const fileUrl = await uploadFileToR2(file, uniqueFileName, contentType);
          submission.fileUrls.push(fileUrl);
        } catch (err) {
          console.error('Error uploading a file:', err);
          // Continue uploading other files but record the failure
          submission.fileUrls.push(`error:${String(err)}`);
        }
      }
    } else if (!gitRepositoryUrl) {
      // Git URL is required for Web Designing
      return NextResponse.json(
        { error: 'Git repository URL is required for Web Designing submissions' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would store the submission in a database
    // For now, we'll just log it and return a success response
    console.log('Submission received:', submission);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Submission received successfully' 
    });
    
  } catch (error) {
    console.error('Error processing submission:', error);
    // In development, return the real error message and stack to ease debugging.
    const isDev = process.env.NODE_ENV !== 'production';
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      { error: isDev ? message : 'Failed to process submission', stack: isDev ? stack : undefined },
      { status: 500 }
    );
  }
}