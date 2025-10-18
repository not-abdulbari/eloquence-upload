'use client';

import { AdminLayout } from '@/components/admin-layout';
import { SubmissionsTable } from '@/components/submissions-table';

export default function WebDesigningPage() {
  return (
    <AdminLayout title="Submissions: Web Designing">
      <SubmissionsTable eventType="Web Designing" />
    </AdminLayout>
  );
}
