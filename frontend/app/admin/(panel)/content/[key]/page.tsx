'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Check, Save } from 'lucide-react';
import { api } from '@/lib/admin';
import DynamicForm from '@/components/admin/DynamicForm';

const titles: Record<string, string> = {
  home: 'Home Page Content',
  about: 'About Page Content',
  services: 'Services Page Content',
  leadership: 'Leadership Page Content',
  contact: 'Contact Page Content',
  faq: 'FAQ Section Text',
  testimonials: 'Testimonials Section Text',
  highlights: 'Highlights Strip (Home & About)',
  partners: 'Partners Section Text',
  industries: 'Industries We Serve',
  engagement: 'Engagement Models',
  settings: 'Site Settings & Brand',
};

const pageUrls: Record<string, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  leadership: '/leadership',
  contact: '/contact',
  faq: '/',
  testimonials: '/',
  highlights: '/',
  partners: '/',
  industries: '/about',
  engagement: '/services',
  settings: '/',
};

export default function ContentEditor() {
  const { key } = useParams<{ key: string }>();
  const [data, setData] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setData(null);
    setMsg('');
    api('/content/' + key).then(setData);
  }, [key]);

  async function save() {
    setBusy(true);
    setMsg('');
    try {
      await api('/content/' + key, { method: 'PUT', body: data });
      setMsg('Changes saved successfully ✓');
      setTimeout(() => setMsg(''), 4000);
    } catch (e: any) {
      setMsg(e.message || 'Failed to save changes');
    }
    setBusy(false);
  }

  if (!data) return <p className="text-sm text-slate-500">Loading editor...</p>;

  const pageUrl = pageUrls[key] || '/';

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">{titles[key] || key}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Changes made here will immediately reflect on the live website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={pageUrl}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Page
          </Link>
          {msg && (
            <span className={`text-xs font-medium ${msg.includes('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
              {msg}
            </span>
          )}
          <button
            onClick={save}
            disabled={busy}
            className="btn btn-primary inline-flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {busy ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      {Object.keys(data).length ? (
        <div className="card shadow-sm border border-slate-200/80 bg-white p-6 rounded-2xl">
          <DynamicForm value={data} onChange={setData} />
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No content found for this section.
        </p>
      )}
    </div>
  );
}
