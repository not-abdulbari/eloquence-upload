'use client';

import { AdminLayout } from '@/components/admin-layout';
import { SubmissionsTable } from '@/components/submissions-table';

export default function PhotographyPage() {
  return (
    <AdminLayout title="Submissions: Photography">
      <SubmissionsTable eventType="Reels & Photography" />
    </AdminLayout>
  );
}
