'use client';
import CrudManager from '@/components/admin/CrudManager';

const PAGES = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'contact', label: 'Contact' },
];

export default function Page() {
  return <CrudManager title="Testimonials" endpoint="/testimonials" titleKey="name" subKey="quote" imageKey="photo" defaults={{ rating: 5 }} fields={[
    { key: 'name', label: 'Client name', type: 'text' },
    { key: 'designation', label: 'Designation', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'quote', label: 'Testimonial / feedback', type: 'textarea' },
    { key: 'photo', label: 'Photo (optional)', type: 'image' },
    { key: 'rating', label: 'Rating (1 to 5)', type: 'number', min: 1, max: 5 },
    { key: 'pages', label: 'Show on pages', type: 'multi', options: PAGES, hint: 'Select the pages where this testimonial should appear. Leave all unselected to show on every page.' },
  ]} />;
}
