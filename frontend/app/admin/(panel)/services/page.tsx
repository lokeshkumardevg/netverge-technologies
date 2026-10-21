'use client';
import CrudManager from '@/components/admin/CrudManager';

const TITLE_TEXT = [{ key: 'title', label: 'Title', type: 'text' as const }, { key: 'text', label: 'Description', type: 'textarea' as const }];

export default function Page() {
  return <CrudManager title="Services" endpoint="/services" titleKey="title" subKey="description" fields={[
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'slug', label: 'Page URL slug (e.g. cloud-solutions)', type: 'text', hint: 'Detail page opens at /services/<slug>. Leave empty to generate automatically from the title.' },
    { key: 'icon', label: 'Icon (network, shield, database, server, cloud, users, laptop, lock, compass, zap, rocket)', type: 'text' },
    { key: 'description', label: 'Short description (shown on service cards)', type: 'textarea' },
    { key: 'items', label: 'What we offer (bullet points)', type: 'lines' },

    { key: 'heroImage', label: 'Service image (shown on service card + detail page)', type: 'image' },
    { key: 'tagline', label: 'Detail page tagline (under the title)', type: 'text' },
    { key: 'overview', label: 'Overview (leave a blank line between paragraphs)', type: 'textarea' },
    { key: 'benefits', label: 'Key benefits', type: 'objects', shape: TITLE_TEXT, addLabel: 'Add benefit' },
    { key: 'process', label: 'Our approach / process steps', type: 'objects', shape: TITLE_TEXT, addLabel: 'Add step' },
    { key: 'technologies', label: 'Technologies & platforms', type: 'lines' },
    { key: 'faqs', label: 'Service FAQs', type: 'objects', shape: [{ key: 'question', label: 'Question', type: 'text' }, { key: 'answer', label: 'Answer', type: 'textarea' }], addLabel: 'Add FAQ' },
    { key: 'ctaTitle', label: 'Bottom call-to-action title (optional)', type: 'text' },
    { key: 'ctaText', label: 'Bottom call-to-action text (optional)', type: 'textarea' },
  ]} />;
}
