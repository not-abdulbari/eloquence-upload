'use client';

import { AdminLayout } from '@/components/admin-layout';
import { SubmissionsTable } from '@/components/submissions-table';

export default function ReelsPage() {
  return (
    <AdminLayout title="Submissions: Reels">
      <SubmissionsTable eventType="Reels & Photography" />
    </AdminLayout>
  );
}
