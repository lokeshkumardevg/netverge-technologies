'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, Handshake, HelpCircle, Inbox, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Settings, Users, Briefcase, UserCog, X } from 'lucide-react';
import { api, tokenKey } from '@/lib/admin';

const nav = [
  { h: '/admin', l: 'Dashboard', i: LayoutDashboard },
  { h: '/admin/messages', l: 'Messages', i: Inbox },
  { g: 'Page Content' },
  { h: '/admin/content/home', l: 'Home Page', i: FileText },
  { h: '/admin/content/about', l: 'About Page', i: FileText },
  { h: '/admin/content/services', l: 'Services Page', i: FileText },
  { h: '/admin/content/leadership', l: 'Leadership Page', i: FileText },
  { h: '/admin/content/contact', l: 'Contact Page', i: FileText },
  { h: '/admin/content/faq', l: 'FAQ Section Text', i: FileText },
  { h: '/admin/content/testimonials', l: 'Testimonials Section Text', i: FileText },
  { h: '/admin/content/highlights', l: 'Highlights Strip', i: FileText },
  { h: '/admin/content/partners', l: 'Partners Section Text', i: FileText },
  { h: '/admin/content/industries', l: 'Industries We Serve', i: FileText },
  { h: '/admin/content/engagement', l: 'Engagement Models', i: FileText },
  { g: 'Manage' },
  { h: '/admin/services', l: 'Services', i: Briefcase },
  { h: '/admin/team', l: 'Team', i: Users },
  { h: '/admin/partners', l: 'Partners', i: Handshake },
  { h: '/admin/faqs', l: 'FAQs', i: HelpCircle },
  { h: '/admin/testimonials', l: 'Testimonials', i: MessageSquareQuote },
  { h: '/admin/content/settings', l: 'Site Settings', i: Settings },
  { h: '/admin/account', l: 'Account & Users', i: UserCog },
] as any[];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(tokenKey)) { router.replace('/admin/login'); return; }
    api('/auth/me').then(setUser).catch(() => router.replace('/admin/login'));
  }, []);
  useEffect(() => setOpen(false), [path]);

  if (!user) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading...</div>;

  const side = (
    <div className="flex h-full flex-col bg-navy text-slate-300">
      <div className="p-5"><span className="inline-block rounded px-2 py-1"><img src="/logo.png" alt="" className="h-8" /></span></div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {nav.map((n, idx) => n.g ? (
          <p key={idx} className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{n.g}</p>
        ) : (
          <Link key={n.h} href={n.h} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${path === n.h ? 'bg-brand text-white' : 'hover:bg-white/10'}`}><n.i className="h-4 w-4" />{n.l}</Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4 text-xs">
        <p className="truncate text-slate-400">{user.email}</p>
        <div className="mt-3 flex gap-4">
          <Link href="/" target="_blank" className="hover:text-white">View site ↗</Link>
          <button className="flex items-center gap-1 hover:text-white" onClick={() => { localStorage.removeItem(tokenKey); router.replace('/admin/login'); }}><LogOut className="h-3 w-3" /> Logout</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{side}</aside>
      {open && <div className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0 w-64">{side}</div></div>}
      <div className="lg:pl-64">
        <header className="flex h-14 items-center border-b bg-white px-4 lg:hidden"><button onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><span className="ml-3 text-sm font-semibold text-navy">NetVerge Admin</span></header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
