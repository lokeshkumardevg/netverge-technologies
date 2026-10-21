'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowRight, BarChart3, Eye, EyeOff, FileEdit, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { api, tokenKey } from '@/lib/admin';
import s from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false); // UI only: show / hide password

  // ── login logic: unchanged ──
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
    <div className={s.page}>
      <div className={s.grid} aria-hidden />
      <div className={`${s.orb} ${s.orbA}`} aria-hidden />
      <div className={`${s.orb} ${s.orbB}`} aria-hidden />

      <div className={s.shell}>
        {/* Brand panel (desktop) */}
        <aside className={s.brand}>
          <img src="/images/netverge-logo-white.png" alt="NetVerge Technologies" className={s.logo} />
          <div className={s.brandBody}>
            <p className={s.eyebrow}>Admin Portal</p>
            <h2 className={s.heading}>Transform. Secure. <span>Automate. Scale.</span></h2>
            <p className={s.lead}>Manage your website content, services, partners and enquiries from one secure place.</p>
            <ul className={s.points}>
              <li><span className={s.pointIcon}><FileEdit size={16} /></span>Update website content instantly</li>
              <li><span className={s.pointIcon}><BarChart3 size={16} /></span>Track messages and site activity</li>
              <li><span className={s.pointIcon}><ShieldCheck size={16} /></span>Protected, role-based access</li>
            </ul>
          </div>
          <p className={s.tag}>NETVERGE TECHNOLOGIES (OPC) PVT. LTD.</p>
        </aside>

        {/* Form panel */}
        <div className={s.formWrap}>
          <img src="/images/netverge-logo-white.png" alt="NetVerge Technologies" className={s.mobileLogo} />
          <h1 className={s.formTitle}>Admin Login</h1>
          <p className={s.formSub}>Sign in to access your dashboard</p>

          <form onSubmit={submit} className={s.form} noValidate={false}>
            <div className={s.field}>
              <label className={s.label} htmlFor="admin-email">Email</label>
              <div className={s.control}>
                <Mail className={s.icon} size={18} />
                <input id="admin-email" type="email" required autoComplete="username" placeholder="admin@netverge.tech"
                  className={s.input} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="admin-password">Password</label>
              <div className={s.control}>
                <Lock className={s.icon} size={18} />
                <input id="admin-password" type={show ? 'text' : 'password'} required autoComplete="current-password" placeholder="Enter your password"
                  className={s.input} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className={s.eye} onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {err && <div className={s.error} role="alert" key={err + busy}><AlertCircle size={16} /><span>{err}</span></div>}

            <button disabled={busy} className={s.submit}>
              {busy ? (<><Loader2 size={18} className={s.spin} /> Signing in...</>) : (<>Sign In <ArrowRight size={18} className={s.arrow} /></>)}
            </button>
          </form>

          <p className={s.secure}><ShieldCheck size={14} /> Secured admin access</p>
          <Link href="/" className={s.back}>← Back to website</Link>
        </div>
      </div>
    </div>
  );
}



// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { api, tokenKey } from '@/lib/admin';

// export default function Login() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [err, setErr] = useState('');
//   const [busy, setBusy] = useState(false);

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     setBusy(true); setErr('');
//     try {
//       const r = await api('/auth/login', { method: 'POST', body: { email, password } });
//       localStorage.setItem(tokenKey, r.accessToken);
//       router.replace('/admin');
//     } catch (x: any) { setErr(x.message); setBusy(false); }
//   }
//   return (
//     <div className="bg-hero flex min-h-screen items-center justify-center p-4">
//       <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow-xl">
//         <img src="/logo.png" alt="NetVerge" className="mx-auto h-12" />
//         <h1 className="text-center text-lg font-semibold text-navy">Admin Login</h1>
//         <div><label className="label">Email</label><input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
//         <div><label className="label">Password</label><input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
//         {err && <p className="text-sm text-red-600">{err}</p>}
//         <button disabled={busy} className="btn btn-primary w-full">{busy ? 'Signing in...' : 'Sign In'}</button>
//       </form>
//     </div>
//   );
// }
