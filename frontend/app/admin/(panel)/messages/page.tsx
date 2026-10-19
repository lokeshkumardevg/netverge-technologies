'use client';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { api } from '@/lib/admin';

export default function Messages() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const load = () => api('/messages').then(setItems);
  useEffect(() => { load(); }, []);

  async function toggle(m: any) {
    setOpen(open === m._id ? null : m._id);
    if (!m.isRead) { await api(`/messages/${m._id}/read`, { method: 'PATCH', body: { isRead: true } }); load(); }
  }
  async function del(id: string) {
    if (!confirm('Delete this message?')) return;
    await api('/messages/' + id, { method: 'DELETE' }); load();
  }
  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-semibold text-navy">Messages</h1>
      <div className="space-y-3">
        {items.map((m) => (
          <div key={m._id} className="card !p-0">
            <div className="flex cursor-pointer items-center gap-3 p-4" onClick={() => toggle(m)}>
              {!m.isRead && <span className="h-2 w-2 rounded-full bg-brand" />}
              <div className="min-w-0 flex-1"><p className={`truncate text-sm ${m.isRead ? '' : 'font-semibold'}`}>{m.name} — {m.subject || '(no subject)'}</p><p className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleString()}</p></div>
              <button onClick={(e) => { e.stopPropagation(); del(m._id); }} className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
            {open === m._id && (
              <div className="border-t bg-slate-50 p-4 text-sm">
                <p className="mb-2 text-xs text-slate-500">From: <a className="text-blue-600" href={`mailto:${m.email}`}>{m.email}</a></p>
                <p className="whitespace-pre-wrap text-slate-700">{m.message}</p>
              </div>
            )}
          </div>
        ))}
        {!items.length && <p className="text-sm text-slate-500">No messages yet.</p>}
      </div>
    </div>
  );
}
