'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { img } from '@/lib/api';
import NetVergeLogo from './NetVergeLogo';

const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Leadership', '/leadership'],
  ['Contact', '/contact'],
];

export default function Navbar({ settings }: { settings?: any } = {}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Refs for the sliding pill indicator
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const active = (h: string) => (h === '/' ? path === '/' : path.startsWith(h));

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Compute the pill position whenever the route changes (or on resize)
  useLayoutEffect(() => {
    const updatePill = () => {
      const current = links.find(([, h]) => active(h));
      if (!current) return;

      const el = linkRefs.current[current[1]];
      const container = navRef.current;

      if (el && container) {
        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setPillStyle({
          left: elRect.left - containerRect.left,
          width: elRect.width,
          opacity: 1,
        });
      }
    };

    updatePill();
    // Recompute after fonts/layout settle
    const t = setTimeout(updatePill, 100);
    window.addEventListener('resize', updatePill);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updatePill);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, scrolled]);

  return (
    <>
      {/* Navbar wrapper — always at the TOP */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <header
          className={`relative mx-auto transition-all duration-500 ease-out ${
            scrolled
              ? 'max-w-3xl rounded-b-[42px] border-b border-x border-white/[0.08] bg-[#070D19]/60 backdrop-blur-xl shadow-2xl shadow-black/40'
              : 'max-w-full rounded-b-none border-b border-transparent bg-transparent'
          }`}
        >
          {/* Subtle orange glow when scrolled */}
          <div
            className={`pointer-events-none absolute inset-0 -z-10 rounded-b-2xl transition-opacity duration-500 ${
              scrolled ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 rounded-b-2xl bg-gradient-to-b from-[#FF6B00]/10 to-transparent" />
          </div>

          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              scrolled ? 'h-16 px-5' : 'container-x h-[72px]'
            }`}
          >
            {/* Logo — stays visible above the mobile overlay */}
            <Link
              href="/"
              className="relative z-[80] flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]"
              onClick={() => setOpen(false)}
            >
              {settings?.logo ? (
                <img
                  src={img(settings.logo)}
                  alt={settings?.companyName || 'NetVerge'}
                  className="h-8 max-w-[160px] object-contain"
                />
              ) : (
                <NetVergeLogo variant="dark" />
              )}
            </Link>

            {/* Desktop Nav – Pill Style with Sliding Indicator */}
            <nav className="hidden items-center md:flex">
              <div
                ref={navRef}
                className="relative flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-1.5 py-1.5 backdrop-blur-sm"
              >
                {/* Sliding active pill */}
                <span
                  className="absolute top-1.5 bottom-1.5 rounded-full bg-[#FF6B00]/90 shadow-md shadow-[#FF6B00]/25 transition-all duration-500 ease-out"
                  style={{
                    left: `${pillStyle.left}px`,
                    width: `${pillStyle.width}px`,
                    opacity: pillStyle.opacity,
                  }}
                />

                {links.map(([l, h]) => (
                  <Link
                    key={h}
                    href={h}
                    ref={(el) => {
                      linkRefs.current[h] = el;
                    }}
                    className={`relative z-10 px-4 py-1.5 text-[13px] font-medium tracking-wide rounded-full transition-colors duration-300 ${
                      active(h) ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-2 text-[13px] font-semibold text-white shadow-lg shadow-[#FF6B00]/25 transition-all duration-300 hover:bg-[#E55F00] hover:shadow-[#FF6B00]/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get in Touch
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Mobile Hamburger */}
              <button
                className="relative z-[80] flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 hover:bg-white/10 md:hidden"
                onClick={() => setOpen(!open)}
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                <span className="relative block h-5 w-5">
                  <Menu
                    className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                      open ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                    }`}
                  />
                  <X
                    className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                      open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu – Right-side Drawer with Solid Black Background */}
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[60] w-[85%] max-w-sm bg-black shadow-2xl shadow-black/60 transition-transform duration-400 ease-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header — Logo visible + Close on the right */}
        <div className="flex h-[72px] items-center justify-between border-b border-white/[0.08] px-5">
          {/* Logo (mirrors the top navbar logo) */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5"
          >
            {settings?.logo ? (
              <img
                src={img(settings.logo)}
                alt={settings?.companyName || 'NetVerge'}
                className="h-8 max-w-[140px] object-contain"
              />
            ) : (
              <NetVergeLogo variant="dark" />
            )}
          </Link>

          {/* Close icon — aligned to the right */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white transition-all duration-300 hover:bg-white/[0.12]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <nav className="flex h-[calc(100%-72px)] flex-col overflow-y-auto px-6 pt-6 pb-6">
          <div className="space-y-2">
            {links.map(([l, h], i) => (
              <Link
                key={h}
                href={h}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${i * 60 + 100}ms` : '0ms' }}
                className={`flex items-center justify-between rounded-xl px-5 py-4 text-base font-medium transition-all duration-300 ${
                  active(h)
                    ? 'text-white bg-[#FF6B00]/15 border border-[#FF6B00]/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                } ${open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
              >
                <span>{l}</span>
                {active(h) && <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />}
              </Link>
            ))}
          </div>

          <div
            className={`mt-8 transition-all duration-300 delay-300 ${
              open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            }`}
          >
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#FF6B00]/25 transition-all duration-200 hover:bg-[#E55F00]"
            >
              Get in Touch
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}