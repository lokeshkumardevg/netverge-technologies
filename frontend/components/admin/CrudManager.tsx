'use client';
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '@/lib/admin';
import { img } from '@/lib/api';
import { ImageInput } from './DynamicForm';

export type FieldDef = { key: string; label: string; type: 'text' | 'textarea' | 'image' | 'lines' | 'bool' | 'multi' | 'number' | 'objects'; shape?: { key: string; label: string; type: 'text' | 'textarea' }[]; addLabel?: string; options?: { value: string; label: string }[]; hint?: string; min?: number; max?: number };
const hidden = ['_id', '__v', 'createdAt', 'updatedAt'];

export default function CrudManager({ title, endpoint, fields, titleKey, subKey, imageKey, defaults }: { title: string; endpoint: string; fields: FieldDef[]; titleKey: string; subKey?: string; imageKey?: string; defaults?: Record<string, any> }) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api(endpoint + '/admin/all').then(setItems).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const blank = () => ({ isActive: true, ...Object.fromEntries(fields.map((f) => [f.key, f.type === 'bool' ? false : f.type === 'lines' || f.type === 'multi' || f.type === 'objects' ? [] : f.type === 'number' ? 0 : ''])), ...(defaults || {}) });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const body: any = { ...form };
    hidden.forEach((k) => delete body[k]);
    fields.filter((f) => f.type === 'lines').forEach((f) => (body[f.key] = (body[f.key] || []).filter((x: string) => x.trim())));
    fields.filter((f) => f.type === 'objects').forEach((f) => (body[f.key] = (body[f.key] || []).filter((o: any) => Object.values(o || {}).some((v) => String(v ?? '').trim())).map((o: any) => Object.fromEntries((f.shape || []).map((sf) => [sf.key, o[sf.key] || ''])))));
    try {
      if (form._id) await api(`${endpoint}/${form._id}`, { method: 'PUT', body });
      else await api(endpoint, { method: 'POST', body: { ...body, order: items.length } });
      setForm(null); await load();
    } catch (x: any) { setErr(x.message); }
    setBusy(false);
  }
  async function remove(id: string) {
    if (!confirm('Delete this item?')) return;
    await api(`${endpoint}/${id}`, { method: 'DELETE' }); load();
  }
  async function toggle(it: any) { await api(`${endpoint}/${it._id}`, { method: 'PUT', body: { isActive: !it.isActive } }); load(); }
  async function move(i: number, d: number) {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    await api(endpoint + '/admin/reorder', { method: 'PATCH', body: { ids: next.map((x) => x._id) } });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-navy">{title}</h1>
        <button className="btn btn-primary" onClick={() => setForm(blank())}><Plus className="h-4 w-4" /> Add New</button>
      </div>
      {err && !form && <p className="mb-4 text-sm text-red-600">{err}</p>}

      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={it._id} className={`card flex items-center gap-4 !p-4 ${it.isActive ? '' : 'opacity-50'}`}>
            {imageKey && (it[imageKey] ? <img src={img(it[imageKey])} alt="" className="h-12 w-12 rounded object-cover object-top" /> : <div className="h-12 w-12 rounded bg-slate-100" />)}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-navy">{it[titleKey]}</p>
              {subKey && <p className="truncate text-xs text-slate-500">{it[subKey]}</p>}
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <button title="Up" onClick={() => move(i, -1)} className="p-1.5 hover:text-navy"><ArrowUp className="h-4 w-4" /></button>
              <button title="Down" onClick={() => move(i, 1)} className="p-1.5 hover:text-navy"><ArrowDown className="h-4 w-4" /></button>
              <button title={it.isActive ? 'Hide' : 'Show'} onClick={() => toggle(it)} className="p-1.5 hover:text-navy">{it.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
              <button title="Edit" onClick={() => setForm({ ...it })} className="p-1.5 hover:text-brand"><Pencil className="h-4 w-4" /></button>
              <button title="Delete" onClick={() => remove(it._id)} className="p-1.5 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-sm text-slate-500">Nothing here yet.</p>}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <form onSubmit={save} className="my-8 w-full max-w-2xl space-y-4 rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">{form._id ? 'Edit' : 'Add'} item</h2>
              <button type="button" onClick={() => setForm(null)}><X className="h-5 w-5" /></button>
            </div>
            {fields.map((f) => (
              <div key={f.key}>
                {f.type === 'bool' ? (
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />{f.label}</label>
                ) : (
                  <>
                    <span className="label">{f.label}{f.type === 'lines' && ' (one per line)'}</span>
                    {f.type === 'text' && <input className="input" required={f.key === titleKey} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
                    {f.type === 'textarea' && <textarea rows={3} className="input" value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
                    {f.type === 'lines' && <textarea rows={5} className="input" value={(form[f.key] || []).join('\n')} onChange={(e) => setForm({ ...form, [f.key]: e.target.value.split('\n') })} />}
                    {f.type === 'number' && <input type="number" className="input" min={f.min} max={f.max} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value === '' ? '' : Number(e.target.value) })} />}
                    {f.type === 'objects' && (
                      <div className="space-y-3">
                        {(form[f.key] || []).map((o: any, i: number) => (
                          <div key={i} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                            {(f.shape || []).map((sf) => sf.type === 'textarea' ? (
                              <textarea key={sf.key} rows={2} className="input" placeholder={sf.label} value={o[sf.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: form[f.key].map((x: any, j: number) => (j === i ? { ...x, [sf.key]: e.target.value } : x)) })} />
                            ) : (
                              <input key={sf.key} className="input" placeholder={sf.label} value={o[sf.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: form[f.key].map((x: any, j: number) => (j === i ? { ...x, [sf.key]: e.target.value } : x)) })} />
                            ))}
                            <div className="flex gap-3 text-xs">
                              <button type="button" className="text-slate-500 hover:text-navy" disabled={i === 0} onClick={() => { const a = [...form[f.key]]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; setForm({ ...form, [f.key]: a }); }}>↑ Up</button>
                              <button type="button" className="text-slate-500 hover:text-navy" disabled={i === form[f.key].length - 1} onClick={() => { const a = [...form[f.key]]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; setForm({ ...form, [f.key]: a }); }}>↓ Down</button>
                              <button type="button" className="text-red-600" onClick={() => setForm({ ...form, [f.key]: form[f.key].filter((_: any, j: number) => j !== i) })}>Remove</button>
                            </div>
                          </div>
                        ))}
                        <button type="button" className="btn btn-light !py-1.5" onClick={() => setForm({ ...form, [f.key]: [...(form[f.key] || []), Object.fromEntries((f.shape || []).map((sf) => [sf.key, '']))] })}><Plus className="h-4 w-4" /> {f.addLabel || 'Add'}</button>
                      </div>
                    )}
                    {f.type === 'multi' && (
                      <div className="flex flex-wrap gap-2">
                        {(f.options || []).map((o) => {
                          const on = (form[f.key] || []).includes(o.value);
                          return (
                            <label key={o.value} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${on ? 'border-brand bg-brand-50 text-brand' : 'border-slate-300 text-slate-600'}`}>
                              <input type="checkbox" className="hidden" checked={on} onChange={() => setForm({ ...form, [f.key]: on ? (form[f.key] || []).filter((x: string) => x !== o.value) : [...(form[f.key] || []), o.value] })} />
                              {on ? '✓ ' : ''}{o.label}
                            </label>
                          );
                        })}
                      </div>
                    )}
                    {f.hint && <p className="mt-1 text-xs text-slate-400">{f.hint}</p>}
                    {f.type === 'image' && <ImageInput value={form[f.key]} onChange={(v) => setForm({ ...form, [f.key]: v })} />}
                  </>
                )}
              </div>
            ))}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />Visible on website</label>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <div className="flex justify-end gap-3"><button type="button" className="btn btn-light" onClick={() => setForm(null)}>Cancel</button><button disabled={busy} className="btn btn-primary">{busy ? 'Saving...' : 'Save'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
