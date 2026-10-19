'use client';
import { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { uploadFile } from '@/lib/admin';
import { img } from '@/lib/api';

const isImg = (k: string) => /image|photo|logo/i.test(k);
const human = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
const blank = (v: any): any =>
  Array.isArray(v) ? [] : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)])) : typeof v === 'number' ? 0 : typeof v === 'boolean' ? false : '';

export function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setErr('');
    try { onChange(await uploadFile(f)); } catch (x: any) { setErr(x.message); }
    setBusy(false); e.target.value = '';
  }
  return (
    <div className="flex items-center gap-3">
      {value ? <img src={img(value)} alt="" className="h-14 w-14 rounded border object-cover" /> : <div className="h-14 w-14 rounded border bg-slate-100" />}
      <div className="flex-1">
        <input className="input" placeholder="Image URL or upload" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
      </div>
      <label className="btn btn-light cursor-pointer"><Upload className="h-4 w-4" />{busy ? '...' : 'Upload'}<input type="file" accept="image/*" className="hidden" onChange={pick} /></label>
    </div>
  );
}

function Field({ k, v, set }: { k: string; v: any; set: (x: any) => void }) {
  const label = human(k);
  if (typeof v === 'boolean')
    return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} />{label}</label>;

  if (Array.isArray(v))
    return (
      <div>
        <span className="label">{label}</span>
        <div className="space-y-3">
          {v.map((item, i) => (
            <div key={i} className={typeof item === 'object' ? 'rounded-lg border border-slate-200 bg-slate-50 p-3' : 'flex gap-2'}>
              {typeof item === 'object' ? (
                <div className="space-y-3">
                  <Obj v={item} set={(x) => set(v.map((o, j) => (j === i ? x : o)))} />
                  <button type="button" className="text-xs text-red-600" onClick={() => set(v.filter((_, j) => j !== i))}>Remove item</button>
                </div>
              ) : (
                <>
                  <textarea rows={2} className="input" value={item} onChange={(e) => set(v.map((o, j) => (j === i ? e.target.value : o)))} />
                  <button type="button" className="text-red-600" onClick={() => set(v.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></button>
                </>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-light !py-1.5" onClick={() => set([...v, v.length ? blank(v[0]) : ''])}><Plus className="h-4 w-4" /> Add</button>
        </div>
      </div>
    );

  if (v && typeof v === 'object')
    return (
      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-2 text-sm font-semibold text-navy">{label}</legend>
        <Obj v={v} set={set} />
      </fieldset>
    );

  if (typeof v === 'number') return <div><span className="label">{label}</span><input type="number" className="input" value={v} onChange={(e) => set(Number(e.target.value))} /></div>;
  if (isImg(k)) return <div><span className="label">{label}</span><ImageInput value={v} onChange={set} /></div>;
  const long = (v || '').length > 80 || /text|bio|description|paragraph|footer/i.test(k);
  return (
    <div>
      <span className="label">{label}</span>
      {long ? <textarea rows={3} className="input" value={v ?? ''} onChange={(e) => set(e.target.value)} /> : <input className="input" value={v ?? ''} onChange={(e) => set(e.target.value)} />}
    </div>
  );
}

function Obj({ v, set }: { v: Record<string, any>; set: (x: any) => void }) {
  return <div className="space-y-4">{Object.keys(v).map((k) => <Field key={k} k={k} v={v[k]} set={(x) => set({ ...v, [k]: x })} />)}</div>;
}

/** Renders an editable form for any JSON object (strings, images, lists, nested groups). */
export default function DynamicForm({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  return <Obj v={value} set={onChange} />;
}
