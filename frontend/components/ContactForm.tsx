'use client';
import { useState } from 'react';
import { API } from '@/lib/api';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [err, setErr] = useState('');
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const r = await fetch(API + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok) throw new Error(Array.isArray(d?.message) ? d.message.join(', ') : d?.message || 'Failed to send message');
      setState('ok');
      setF({ name: '', email: '', subject: '', message: '' });
    } catch (x: any) {
      setErr(x.message);
      setState('err');
    }
  }

  if (state === 'ok') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        <h4 className="text-base font-bold text-slate-900">Message Sent Successfully!</h4>
        <p className="text-xs text-slate-600 max-w-sm">
          Thank you for reaching out. We will get back to you shortly.
        </p>
        <button
          onClick={() => setState('idle')}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-[#FF6B00] px-4 py-2 text-xs font-semibold text-white hover:bg-[#E55F00] transition-colors"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Name and Email side-by-side */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Your Name *
          </label>
          <input
            required
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition-all focus:border-[#FF6B00] focus:bg-white focus:ring-1 focus:ring-[#FF6B00]"
            value={f.name}
            onChange={set('name')}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Your Email *
          </label>
          <input
            required
            type="email"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition-all focus:border-[#FF6B00] focus:bg-white focus:ring-1 focus:ring-[#FF6B00]"
            value={f.email}
            onChange={set('email')}
            placeholder="Enter your email"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Subject *
        </label>
        <input
          required
          className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition-all focus:border-[#FF6B00] focus:bg-white focus:ring-1 focus:ring-[#FF6B00]"
          value={f.subject}
          onChange={set('subject')}
          placeholder="Enter subject"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Your Message *
        </label>
        <textarea
          required
          rows={4}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition-all focus:border-[#FF6B00] focus:bg-white focus:ring-1 focus:ring-[#FF6B00] resize-none"
          value={f.message}
          onChange={set('message')}
          placeholder="Enter your message"
        />
      </div>

      {state === 'err' && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
          {err || 'Something went wrong. Please try again.'}
        </div>
      )}

      {/* Send Message Button */}
      <button
        disabled={state === 'sending'}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#E55F00] hover:shadow-orange-500/30 disabled:opacity-60 cursor-pointer"
        type="submit"
      >
        {state === 'sending' ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
