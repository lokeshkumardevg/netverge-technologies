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
  return <CrudManager title="FAQs" endpoint="/faqs" titleKey="question" subKey="answer" fields={[
    { key: 'question', label: 'Question', type: 'text' },
    { key: 'answer', label: 'Answer', type: 'textarea' },
    { key: 'pages', label: 'Show on pages', type: 'multi', options: PAGES, hint: 'Select the pages where this FAQ should appear. Leave all unselected to show on every page that has an FAQ section.' },
  ]} />;
}
