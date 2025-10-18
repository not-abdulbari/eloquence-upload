import { NextResponse } from 'next/server';

// Mock data for submission statistics
const mockStats = {
  total: 42,
  paperPresentation: 12,
  webDesigning: 8,
  reelsAndPhotography: 15,
  codeDebugging: 7
};

export async function GET() {
  // In a real implementation, this would query a database
  // For now, we'll return mock statistics
  
  return NextResponse.json(mockStats);
}