-- Eloquence'25 Event Submission System Schema

-- Submissions table to store all event submissions
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  collegeName TEXT NOT NULL,
  branch TEXT NOT NULL,
  contactEmail TEXT NOT NULL,
  contactPhone TEXT NOT NULL,
  eventType TEXT NOT NULL,
  projectTitle TEXT NOT NULL,
  gitUrl TEXT,
  submittedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Files table to store uploaded file information
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  submissionId TEXT NOT NULL,
  fileName TEXT NOT NULL,
  fileType TEXT NOT NULL,
  fileSize INTEGER NOT NULL,
  fileUrl TEXT NOT NULL,
  uploadedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submissionId) REFERENCES submissions(id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_eventType ON submissions(eventType);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_files_submissionId ON files(submissionId);

-- Insert sample data for testing
INSERT INTO submissions (id, fullName, collegeName, branch, contactEmail, contactPhone, eventType, projectTitle, gitUrl, submittedAt, status)
VALUES 
('sub_001', 'John Doe', 'ABC Engineering College', 'Computer Science', 'john@example.com', '9876543210', 'Paper Presentation', 'Machine Learning in Healthcare', NULL, '2023-08-15 10:30:00', 'approved'),
('sub_002', 'Jane Smith', 'XYZ Institute of Technology', 'Information Technology', 'jane@example.com', '8765432109', 'Web Designing', 'E-commerce Platform', 'https://github.com/janesmith/ecommerce', '2023-08-16 14:45:00', 'pending'),
('sub_003', 'Alex Johnson', 'PQR College', 'Electronics', 'alex@example.com', '7654321098', 'Reels & Photography', 'Urban Wildlife', NULL, '2023-08-17 09:15:00', 'pending'),
('sub_004', 'Sarah Williams', 'LMN University', 'Computer Science', 'sarah@example.com', '6543210987', 'Code Debugging', 'Optimizing Algorithms', NULL, '2023-08-18 16:20:00', 'rejected');

-- Insert sample file data
INSERT INTO files (id, submissionId, fileName, fileType, fileSize, fileUrl, uploadedAt)
VALUES
('file_001', 'sub_001', 'research_paper.pdf', 'application/pdf', 2048576, 'https://pub-example.r2.dev/research_paper.pdf', '2023-08-15 10:30:00'),
('file_002', 'sub_003', 'wildlife_photo.jpg', 'image/jpeg', 1048576, 'https://pub-example.r2.dev/wildlife_photo.jpg', '2023-08-17 09:15:00'),
('file_003', 'sub_003', 'wildlife_reel.mp4', 'video/mp4', 5242880, 'https://pub-example.r2.dev/wildlife_reel.mp4', '2023-08-17 09:15:00'),
('file_004', 'sub_004', 'algorithm.js', 'text/javascript', 10240, 'https://pub-example.r2.dev/algorithm.js', '2023-08-18 16:20:00');