'use client';

import { AdminLayout } from '@/components/admin-layout';
import { SubmissionsTable } from '@/components/submissions-table';

export default function ReelsAndPhotographyPage() {
  return (
    <AdminLayout title="Submissions: Reels & Photography">
      <SubmissionsTable eventType="Reels & Photography" />
    </AdminLayout>
  );
}
