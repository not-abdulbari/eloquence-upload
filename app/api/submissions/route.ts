import { NextResponse } from 'next/server';

// Mock data for submissions
const mockSubmissions = [
  {
    id: '1',
    fullName: 'John Doe',
    collegeName: 'ABC Engineering College',
    year: '3rd',
    branch: 'Computer Science',
    contactEmail: 'john.doe@example.com',
    contactPhone: '+91 9876543210',
    eventType: 'Paper Presentation',
    projectTitle: 'Machine Learning in Healthcare',
    fileUrls: ['https://storage.eloquence25.workers.dev/1234567890-abc123.pdf'],
    submittedAt: '2023-04-10T08:30:00Z'
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    collegeName: 'XYZ Institute of Technology',
    year: '2nd',
    branch: 'Information Technology',
    contactEmail: 'jane.smith@example.com',
    contactPhone: '+91 8765432109',
    eventType: 'Web Designing',
    projectTitle: 'E-commerce Platform',
    gitRepositoryUrl: 'https://github.com/janesmith/ecommerce-platform',
    fileUrls: [],
    submittedAt: '2023-04-11T10:15:00Z'
  },
  {
    id: '3',
    fullName: 'Raj Kumar',
    collegeName: 'PQR College',
    year: '4th',
    branch: 'Electronics',
    contactEmail: 'raj.kumar@example.com',
    contactPhone: '+91 7654321098',
    eventType: 'Reels & Photography',
    projectTitle: 'Urban Wildlife',
    fileUrls: [
      'https://storage.eloquence25.workers.dev/2345678901-def456.jpg',
      'https://storage.eloquence25.workers.dev/3456789012-ghi789.mp4'
    ],
    submittedAt: '2023-04-12T14:45:00Z'
  },
  {
    id: '4',
    fullName: 'Priya Sharma',
    collegeName: 'LMN University',
    year: '3rd',
    branch: 'Computer Science',
    contactEmail: 'priya.sharma@example.com',
    contactPhone: '+91 6543210987',
    eventType: 'Code Debugging',
    projectTitle: 'Algorithm Optimization',
    fileUrls: ['https://storage.eloquence25.workers.dev/4567890123-jkl012.zip'],
    submittedAt: '2023-04-13T09:20:00Z'
  },
  {
    id: '5',
    fullName: 'Alex Johnson',
    collegeName: 'International Tech University',
    year: '2nd',
    branch: 'Artificial Intelligence',
    contactEmail: 'alex.johnson@example.com',
    contactPhone: '+91 5432109876',
    eventType: 'Paper Presentation',
    projectTitle: 'Natural Language Processing',
    fileUrls: ['https://storage.eloquence25.workers.dev/5678901234-mno345.pdf'],
    submittedAt: '2023-04-14T11:30:00Z'
  }
];

export async function GET(request: Request) {
  // Get the URL object
  const url = new URL(request.url);
  
  // Get the eventType query parameter
  const eventType = url.searchParams.get('eventType');
  
  // Filter submissions by eventType if provided
  const filteredSubmissions = eventType 
    ? mockSubmissions.filter(submission => submission.eventType === eventType)
    : mockSubmissions;
  
  // Return the filtered submissions
  return NextResponse.json(filteredSubmissions);
}