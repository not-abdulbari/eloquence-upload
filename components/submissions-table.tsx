'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Download, ExternalLink, Loader2 } from 'lucide-react';
// Use Intl.DateTimeFormat with Asia/Kolkata timezone (GMT+5:30)


interface Submission {
  id: string;
  full_name: string;
  college_name: string;
  contact_email: string;
  project_title: string;
  submitted_at: string;
  file_url_1: string | null;
  file_url_2: string | null;
  git_repository_url: string | null;
}

interface SubmissionsTableProps {
  eventType: string;
}

export function SubmissionsTable({ eventType }: SubmissionsTableProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [eventType]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      // Use NEXT_PUBLIC_API_URL if set so the admin can query the Worker directly
      const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
      const endpoint = apiBase ? `${apiBase}/api/submissions?eventType=${encodeURIComponent(eventType)}` : `/api/submissions?eventType=${encodeURIComponent(eventType)}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();

      // The response may be { submissions: [...] } (Worker) or an array (mock)
      let rows: any[] = [];
      if (Array.isArray(data)) rows = data;
      else if (data && Array.isArray(data.submissions)) rows = data.submissions;
      else if (data && Array.isArray(data.results)) rows = data.results; // guard

      // Normalize each row to the UI's expected Submission shape
      const normalized: Submission[] = rows.map((r: any) => {
        const filesFromFilesArray = r.files?.map((f: any) => f.fileUrl).filter(Boolean) || r.fileUrls || r.file_urls || [];
        return {
          id: r.id || r.submissionId || r._id || '',
          full_name: r.fullName || r.full_name || r.name || '',
          college_name: r.collegeName || r.college_name || r.college || '',
          contact_email: r.contactEmail || r.contact_email || r.email || '',
          project_title: r.projectTitle || r.project_title || r.title || '',
          submitted_at: r.submittedAt || r.submitted_at || r.uploadedAt || r.submitted_at || new Date().toISOString(),
          file_url_1: filesFromFilesArray[0] || r.fileUrl || r.file_url_1 || null,
          file_url_2: filesFromFilesArray[1] || r.file_url_2 || null,
          git_repository_url: r.gitUrl || r.gitRepositoryUrl || r.git_repository_url || null,
        };
      });

      setSubmissions(normalized);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
    setIsLoading(false);
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No submissions yet for this event.</p>
      </div>
    );
  }

  const isWebDesigning = eventType === 'Web Designing';
  const hasMultipleFiles = eventType === 'Reels & Photography';

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Participant Name</TableHead>
            <TableHead className="font-semibold">College Name</TableHead>
            <TableHead className="font-semibold">Contact Email</TableHead>
            <TableHead className="font-semibold">Project Title</TableHead>
            <TableHead className="font-semibold">Submitted At</TableHead>
            <TableHead className="font-semibold">
              {isWebDesigning ? 'Git Repository URL' : 'Files'}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{submission.full_name}</TableCell>
              <TableCell>{submission.college_name}</TableCell>
              <TableCell>{submission.contact_email}</TableCell>
              <TableCell>{submission.project_title}</TableCell>
              <TableCell>
                {(() => {
                  try {
                    const dt = new Date(submission.submitted_at);
                    const fmt = new Intl.DateTimeFormat('en-GB', {
                      timeZone: 'Asia/Kolkata',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    });
                    return fmt.format(dt);
                  } catch (e) {
                    return submission.submitted_at;
                  }
                })()}
              </TableCell>
              <TableCell>
                {isWebDesigning ? (
                  submission.git_repository_url ? (
                    <a
                      href={submission.git_repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      Open Repository
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No URL</span>
                  )
                ) : (
                  <div className="flex flex-col gap-2">
                    {submission.file_url_1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(submission.file_url_1!, 'file_1')}
                        className="w-fit"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {hasMultipleFiles ? 'Download File 1' : 'Download File'}
                      </Button>
                    )}
                    {hasMultipleFiles && submission.file_url_2 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(submission.file_url_2!, 'file_2')}
                        className="w-fit"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download File 2
                      </Button>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
