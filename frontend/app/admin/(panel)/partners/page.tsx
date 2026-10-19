'use client';
import CrudManager from '@/components/admin/CrudManager';
export default function Page() {
  return <CrudManager title="Partners" endpoint="/partners" titleKey="name" imageKey="logo" fields={[
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'logo', label: 'Logo', type: 'image' },
    { key: 'description', label: 'Caption under logo (optional, e.g. Enterprise Communication)', type: 'text' },
    { key: 'url', label: 'Website URL', type: 'text' },
  ]} />;
}
