'use client';

import { AdminLayout } from '@/components/admin-layout';
import { SubmissionsTable } from '@/components/submissions-table';

export default function CodeDebuggingPage() {
  return (
    <AdminLayout title="Submissions: Code Debugging">
      <SubmissionsTable eventType="Code Debugging" />
    </AdminLayout>
  );
}
