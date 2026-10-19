'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/admin';

export default function Dashboard() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { api('/dashboard/stats').then(setS).catch(() => {}); }, []);
  if (!s) return <p className="text-sm text-slate-500">Loading...</p>;
  const cards = [['Total Messages', s.totalMessages], ['Unread Messages', s.unreadMessages], ['Services', s.services], ['Team Members', s.team], ['Partners', s.partners], ['FAQs', s.faqs ?? 0], ['Testimonials', s.testimonials ?? 0]];
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-navy">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([l, v]) => <div key={l as string} className="card"><p className="text-xs text-slate-500">{l}</p><p className="mt-1 text-3xl font-semibold text-navy">{v}</p></div>)}
      </div>
      <div className="card mt-8">
        <div className="mb-3 flex justify-between"><h2 className="font-semibold text-navy">Recent Messages</h2><Link href="/admin/messages" className="text-sm text-brand">View all</Link></div>
        {s.recent.length ? s.recent.map((m: any) => (
          <div key={m._id} className="flex items-center justify-between border-t py-3 text-sm">
            <div><p className={m.isRead ? '' : 'font-semibold'}>{m.name} <span className="text-xs text-slate-400">{m.email}</span></p><p className="text-xs text-slate-500">{m.subject || m.message.slice(0, 60)}</p></div>
            <span className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</span>
          </div>
        )) : <p className="text-sm text-slate-500">No messages yet.</p>}
      </div>
    </div>
  );
}
