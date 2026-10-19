'use client';
import CrudManager from '@/components/admin/CrudManager';
export default function Page() {
  return <CrudManager title="Team / Leadership" endpoint="/team" titleKey="name" subKey="designation" imageKey="photo" fields={[
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'designation', label: 'Designation', type: 'text' },
    { key: 'bio', label: 'Short bio', type: 'textarea' },
    { key: 'photo', label: 'Photo', type: 'image' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
    { key: 'featured', label: 'Show on Home page (featured)', type: 'bool' },
  ]} />;
}
