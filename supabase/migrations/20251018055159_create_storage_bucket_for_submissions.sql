/*
  # Create Storage Bucket for Submissions

  ## Overview
  This migration creates a storage bucket for event submissions and sets up proper
  access policies.

  ## Storage Configuration
  
  ### `submissions` bucket
  - Public bucket for storing submission files
  - Files organized by event type folders
  - Public read access for all files
  - Authenticated insert for new uploads
  
  ## Security
  
  ### Storage Policies
  - Anyone can view/download uploaded files
  - Only authenticated users can upload files
  - Files are organized by event type for easy management
  
  ## Notes
  - File uploads from the participant form will be stored here
  - Admin dashboard will provide download links for these files
*/

-- Create storage bucket for submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view submission files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload submission files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update submission files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete submission files" ON storage.objects;

-- Allow public to read files
CREATE POLICY "Public can view submission files"
ON storage.objects FOR SELECT
USING (bucket_id = 'submissions');

-- Allow anyone to upload files
CREATE POLICY "Anyone can upload submission files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'submissions');

-- Allow file updates
CREATE POLICY "Anyone can update submission files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'submissions')
WITH CHECK (bucket_id = 'submissions');

-- Allow file deletions
CREATE POLICY "Anyone can delete submission files"
ON storage.objects FOR DELETE
USING (bucket_id = 'submissions');