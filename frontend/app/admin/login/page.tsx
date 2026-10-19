'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, tokenKey } from '@/lib/admin';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const r = await api('/auth/login', { method: 'POST', body: { email, password } });
      localStorage.setItem(tokenKey, r.accessToken);
      router.replace('/admin');
    } catch (x: any) { setErr(x.message); setBusy(false); }
  }
  return (
    <div className="bg-hero flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow-xl">
        <img src="/logo.png" alt="NetVerge" className="mx-auto h-12" />
        <h1 className="text-center text-lg font-semibold text-navy">Admin Login</h1>
        <div><label className="label">Email</label><input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="label">Password</label><input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={busy} className="btn btn-primary w-full">{busy ? 'Signing in...' : 'Sign In'}</button>
      </form>
    </div>
  );
}
