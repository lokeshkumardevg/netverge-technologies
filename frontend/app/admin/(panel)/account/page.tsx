'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/admin';

export default function Account() {
  const [me, setMe] = useState<any>(null);
  const [pw, setPw] = useState({ current: '', next: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [nu, setNu] = useState({ name: '', email: '', password: '', role: 'editor' });
  const [uMsg, setUMsg] = useState('');

  const loadUsers = () => api('/auth/users').then(setUsers).catch(() => {});
  useEffect(() => { api('/auth/me').then((u) => { setMe(u); if (u.role === 'super_admin') loadUsers(); }); }, []);

  async function changePw(e: React.FormEvent) {
    e.preventDefault(); setPwMsg('');
    try { await api('/auth/password', { method: 'PUT', body: pw }); setPwMsg('Password updated ✓'); setPw({ current: '', next: '' }); } catch (x: any) { setPwMsg(x.message); }
  }
  async function addUser(e: React.FormEvent) {
    e.preventDefault(); setUMsg('');
    try { await api('/auth/users', { method: 'POST', body: nu }); setNu({ name: '', email: '', password: '', role: 'editor' }); loadUsers(); } catch (x: any) { setUMsg(x.message); }
  }
  async function delUser(id: string) {
    if (!confirm('Delete this user?')) return;
    try { await api('/auth/users/' + id, { method: 'DELETE' }); loadUsers(); } catch (x: any) { setUMsg(x.message); }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-semibold text-navy">Account & Users</h1>
      <form onSubmit={changePw} className="card space-y-4">
        <h2 className="font-semibold text-navy">Change Password</h2>
        <div><label className="label">Current password</label><input type="password" required className="input" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></div>
        <div><label className="label">New password (min 8 chars)</label><input type="password" required minLength={8} className="input" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
        <div className="flex items-center gap-3"><button className="btn btn-primary">Update</button><span className="text-sm text-slate-600">{pwMsg}</span></div>
      </form>

      {me?.role === 'super_admin' && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-navy">Admin Users</h2>
          {users.map((u) => (
            <div key={u._id} className="flex items-center justify-between border-t pt-3 text-sm">
              <div><p className="font-medium">{u.name} <span className="text-xs text-slate-400">({u.role})</span></p><p className="text-xs text-slate-500">{u.email}</p></div>
              {u._id !== me.id && <button onClick={() => delUser(u._id)} className="text-xs text-red-600">Delete</button>}
            </div>
          ))}
          <form onSubmit={addUser} className="grid gap-3 border-t pt-4 sm:grid-cols-2">
            <input required placeholder="Name" className="input" value={nu.name} onChange={(e) => setNu({ ...nu, name: e.target.value })} />
            <input required type="email" placeholder="Email" className="input" value={nu.email} onChange={(e) => setNu({ ...nu, email: e.target.value })} />
            <input required minLength={8} type="password" placeholder="Password" className="input" value={nu.password} onChange={(e) => setNu({ ...nu, password: e.target.value })} />
            <select className="input" value={nu.role} onChange={(e) => setNu({ ...nu, role: e.target.value })}><option value="editor">Editor</option><option value="super_admin">Super Admin</option></select>
            <div className="flex items-center gap-3 sm:col-span-2"><button className="btn btn-primary">Add User</button><span className="text-sm text-red-600">{uMsg}</span></div>
          </form>
        </div>
      )}
    </div>
  );
}
