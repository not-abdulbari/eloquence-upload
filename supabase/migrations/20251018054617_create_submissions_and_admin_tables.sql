/*
  # Create Event Submission System Tables

  ## Overview
  This migration creates the database schema for ELOQUENCE'25 event management system,
  including participant submissions and admin user management.

  ## New Tables
  
  ### `admin_users`
  - `id` (uuid, primary key) - Unique identifier for admin users
  - `email` (text, unique, not null) - Admin email address for login
  - `password_hash` (text, not null) - Hashed password for security
  - `created_at` (timestamptz) - Account creation timestamp
  
  ### `submissions`
  - `id` (uuid, primary key) - Unique identifier for each submission
  - `full_name` (text, not null) - Participant's full name
  - `college_name` (text, not null) - College/institution name
  - `year` (text, not null) - Academic year (1st, 2nd, 3rd, 4th, Other)
  - `branch` (text, not null) - Academic branch/department
  - `contact_email` (text, not null) - Contact email address
  - `contact_phone` (text, not null) - Contact phone number
  - `event_type` (text, not null) - Selected event (Paper Presentation, Web Designing, etc.)
  - `project_title` (text, not null) - Title of submission/project
  - `file_url_1` (text) - URL to first uploaded file (if applicable)
  - `file_url_2` (text) - URL to second uploaded file (for Reels & Photography)
  - `git_repository_url` (text) - Git repository URL (for Web Designing)
  - `submitted_at` (timestamptz) - Submission timestamp
  
  ## Security
  
  ### Row Level Security (RLS)
  - Both tables have RLS enabled
  - `admin_users` policies allow authenticated admins to read their own data
  - `submissions` policies allow public insert (for participant submissions) and authenticated read (for admin viewing)
  
  ## Notes
  - File uploads will be stored in Supabase Storage and URLs will be saved in the database
  - Password hashing will be handled in the application layer
  - Admin authentication will use a custom implementation with the admin_users table
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  college_name text NOT NULL,
  year text NOT NULL,
  branch text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  event_type text NOT NULL,
  project_title text NOT NULL,
  file_url_1 text,
  file_url_2 text,
  git_repository_url text,
  submitted_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admins can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Submissions policies
CREATE POLICY "Anyone can submit"
  ON submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_submissions_event_type ON submissions(event_type);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);