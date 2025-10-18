'use client';

import { AdminLayout } from '@/components/admin-layout';
import { SubmissionsTable } from '@/components/submissions-table';

export default function PaperPresentationPage() {
  return (
    <AdminLayout title="Submissions: Paper Presentation">
      <SubmissionsTable eventType="Paper Presentation" />
    </AdminLayout>
  );
}
