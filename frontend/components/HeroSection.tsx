'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Cloud, Cpu, Database, Lock, Network, Server, ShieldCheck, Users } from 'lucide-react';
import { Icon } from '@/components/ui';

/* ───────────────────────── types ───────────────────────── */
type Cta = { label?: string; href?: string } | undefined;
type Badge = { title: string; text?: string; icon?: string };
type Stat = { value: string; label: string };

export type HeroProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  badges?: Badge[];
  bgImage?: string;
  /** Service names – used by the typing line and the bottom ticker */
  rotating?: string[];
  stats?: Stat[];
};

/* ───────────────────────── particle network (canvas) ───────────────────────── */
function ParticleNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, visible = true;
    const mouse = { x: -9999, y: -9999 };
    type Node = { x: number; y: number; vx: number; vy: number; r: number; orange: boolean };
    let nodes: Node[] = [];

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(95, Math.max(26, (w * h) / 15000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        r: Math.random() * 1.7 + 0.7,
        orange: Math.random() < 0.2,
      }));
      if (reduce) draw(false);
    };

    const LINK = 135;
    const draw = (step = true) => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (step) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -10) n.x = w + 10;
          if (n.x > w + 10) n.x = -10;
          if (n.y < -10) n.y = h + 10;
          if (n.y > h + 10) n.y = -10;
          // gentle attraction to the pointer
          const dx = mouse.x - n.x, dy = mouse.y - n.y, d2 = dx * dx + dy * dy;
          if (d2 < 22000) {
            n.x += dx * 0.0032;
            n.y += dy * 0.0032;
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(56,189,248,${(1 - d / LINK) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y, md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 170) {
          ctx.strokeStyle = `rgba(255,107,0,${(1 - md / 170) * 0.55})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.orange ? 'rgba(255,138,51,0.95)' : 'rgba(125,211,252,0.85)';
        ctx.shadowColor = n.orange ? 'rgba(255,107,0,0.9)' : 'rgba(56,189,248,0.8)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(host);
    window.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}

/* ───────────────────────── typing line ───────────────────────── */
function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!words.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(words[0]);
      return;
    }
    let wi = 0, ci = 0, del = false, t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[wi % words.length];
      if (!del) {
        ci++;
        setText(word.slice(0, ci));
        if (ci === word.length) {
          del = true;
          t = setTimeout(tick, 1700);
          return;
        }
        t = setTimeout(tick, 70);
      } else {
        ci--;
        setText(word.slice(0, ci));
        if (ci === 0) {
          del = false;
          wi++;
          t = setTimeout(tick, 350);
          return;
        }
        t = setTimeout(tick, 32);
      }
    };
    t = setTimeout(tick, 1800);
    return () => clearTimeout(t);
  }, [words]);

  return (
    <span className="inline-flex items-center">
      <span className="font-semibold text-white">{text || '\u00A0'}</span>
      <span className="hx-cursor ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[1px] bg-[#FF6B00]" />
    </span>
  );
}

/* ───────────────────────── animated counter ───────────────────────── */
function Counter({ value }: { value: string }) {
  const m = String(value).match(/^(\d+)(.*)$/);
  const target = m ? parseInt(m[1], 10) : null;
  const suffix = m ? m[2] : '';
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1800;
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return <span ref={ref}>{target === null ? value : `${n}${suffix}`}</span>;
}

/* ───────────────────────── orbit visual ───────────────────────── */
const INNER = [Network, Lock, Server];
const OUTER = [Cloud, Cpu, Database, Users];

function OrbitNode({ angle, children, reverse }: { angle: number; children: React.ReactNode; reverse?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <div style={{ transform: `rotate(${-angle}deg)` }}>
          <div className={reverse ? 'hx-unspin-rev' : 'hx-unspin'}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function NodeIcon({ Ico, orange }: { Ico: any; orange: boolean }) {
  return (
    <span
      className={`flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-md sm:h-12 sm:w-12 ${
        orange
          ? 'border-[#FF6B00]/50 bg-[#FF6B00]/15 text-[#FF8A33] shadow-[0_0_24px_rgba(255,107,0,0.45)]'
          : 'border-sky-400/40 bg-sky-400/10 text-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.35)]'
      }`}
    >
      <Ico className="h-5 w-5" />
    </span>
  );
}

function OrbitVisual({ badges, core = true }: { badges: Badge[]; core?: boolean }) {
  const card = (b: Badge, cls: string, anim: string, delay: number) => (
    <div
      key={b.title}
      style={{ animationDelay: `${delay}ms` }}
      className={`hero-pop absolute z-20 hidden sm:block ${cls}`}
    >
      <div className={`${anim} flex items-center gap-3 rounded-2xl border border-white/15 bg-[#0B1530]/70 px-3.5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl`}>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8A33] text-white shadow-lg shadow-orange-500/30">
          <Icon name={b.icon || 'shield'} className="h-[18px] w-[18px]" />
        </span>
        <div className="max-w-[150px]">
          <p className="text-xs font-bold leading-tight text-white">{b.title}</p>
          {b.text && <p className="mt-0.5 text-[10px] leading-tight text-slate-300">{b.text}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[470px] lg:max-w-[520px]">
      {/* backdrop glow */}
      {core && <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(29,111,224,0.38),transparent_68%)] blur-2xl" />}

      {/* outer thin ring with comet */}
      <div className="absolute inset-0 rounded-full border border-white/[0.07]" />
      <div className="hx-spin-fast absolute inset-0">
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6B00] shadow-[0_0_18px_6px_rgba(255,107,0,0.7)]" />
      </div>

      {/* outer orbit: 4 nodes, counter-clockwise */}
      <div className="hx-spin-rev absolute inset-[7%] rounded-full border border-dashed border-sky-400/25">
        {OUTER.map((Ico, i) => (
          <OrbitNode key={i} angle={(360 / OUTER.length) * i + 45} reverse>
            <NodeIcon Ico={Ico} orange={i % 2 === 1} />
          </OrbitNode>
        ))}
      </div>

      {/* inner orbit: 3 nodes, clockwise */}
      <div className="hx-spin absolute inset-[27%] rounded-full border border-[#FF6B00]/30">
        {INNER.map((Ico, i) => (
          <OrbitNode key={i} angle={(360 / INNER.length) * i}>
            <NodeIcon Ico={Ico} orange={i % 2 === 0} />
          </OrbitNode>
        ))}
      </div>

      {/* core (hidden when the photo is the centrepiece) */}
      {core && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="hx-ring absolute inset-0 rounded-full border border-[#FF6B00]/60" />
        <span className="hx-ring absolute inset-0 rounded-full border border-sky-400/50" style={{ animationDelay: '1.6s' }} />
        <div className="hx-orb relative flex h-24 w-24 items-center justify-center rounded-full border border-[#FF8A33]/60 bg-gradient-to-br from-[#FF6B00] via-[#FF7A1A] to-[#C2410C] text-white sm:h-28 sm:w-28">
          <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.8} />
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="hx-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </span>
        </div>
      </div>}

      {/* sparkles */}
      {[
        ['8%', '24%', '0s'], ['90%', '30%', '0.8s'], ['78%', '88%', '1.5s'], ['14%', '82%', '2.1s'], ['50%', '2%', '1.1s'],
      ].map(([l, t, d], i) => (
        <span key={i} className="hx-twinkle absolute h-1.5 w-1.5 rounded-full bg-white" style={{ left: l, top: t, animationDelay: d }} />
      ))}

      {/* floating glass cards (from admin: Home > Badges) */}
      {badges[0] && card(badges[0], '-left-4 top-[8%] lg:-left-10', 'hx-float-a', 1500)}
      {badges[1] && card(badges[1], '-right-4 top-[44%] lg:-right-10', 'hx-float-b', 1700)}
      {badges[2] && card(badges[2], '-bottom-[2%] left-[8%] lg:left-0', 'hx-float-c', 1900)}
    </div>
  );
}

/* ───────────────────────── hero ───────────────────────── */
export default function HeroSection({
  eyebrow,
  title,
  highlight,
  subtitle,
  primaryCta,
  secondaryCta,
  badges = [],
  bgImage,
  rotating = [],
  stats = [],
}: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const words = String(title || '').trim().split(/\s+/).filter(Boolean);

  // pointer parallax: sets --mx / --my (-1..1) on the section
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', String(((e.clientX - r.left) / r.width - 0.5) * 2));
      el.style.setProperty('--my', String(((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    el.addEventListener('pointermove', onMove, { passive: true });
    return () => el.removeEventListener('pointermove', onMove);
  }, []);

  const layer = (px: number): React.CSSProperties => ({
    transform: `translate3d(calc(var(--mx, 0) * ${px}px), calc(var(--my, 0) * ${px}px), 0)`,
  });

  const tickerItems = (rotating.length ? rotating : ['Cybersecurity', 'Cloud Solutions', 'Enterprise Networking', 'AI & Automation', 'Managed IT Services', 'Data Center']).concat([
    'Transform', 'Secure', 'Automate', 'Scale',
  ]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[calc(100svh-72px)] flex-col overflow-hidden rounded-b-[36px] bg-[#040A1A] text-white"
    >
      {/* ── animated background photo (same photo as before) ── */}
      <div className="hx-parallax absolute inset-0 -z-40" style={{ transform: 'translate3d(calc(var(--mx, 0) * -12px), calc(var(--my, 0) * -8px), 0) scale(1.06)' }}>
        <img
          src={bgImage || '/images/landing-hero-bg.png'}
          alt=""
          aria-hidden="true"
          className="hero-bg-zoom absolute select-none object-cover max-lg:inset-x-0 max-lg:top-0 max-lg:h-[58%] max-lg:w-full max-lg:object-[82%_center] lg:inset-0 lg:h-full lg:w-full"
        />
      </div>

      {/* living light on the photo (desktop): laptop screen glow, candle + lamp flicker, slow light pass */}
      <div className="pointer-events-none absolute inset-0 -z-[35] hidden overflow-hidden lg:block">
        <span className="hx-glow absolute left-[74%] top-[46%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(70,150,255,0.32),transparent_65%)]" />
        <span className="hx-flicker absolute left-[54%] top-[68%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,150,40,0.55),transparent_65%)]" style={{ mixBlendMode: 'screen' }} />
        <span className="hx-flicker absolute left-[34%] top-[44%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,140,40,0.35),transparent_65%)]" style={{ animationDelay: '1.2s', mixBlendMode: 'screen' }} />
        <span className="hx-flicker absolute left-[97%] top-[2%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,150,40,0.4),transparent_65%)]" style={{ animationDelay: '0.6s', mixBlendMode: 'screen' }} />
        <span className="hx-lightpass absolute inset-y-0 left-[35%] w-[30%] bg-[linear-gradient(100deg,transparent_0%,rgba(255,255,255,0.07)_50%,transparent_100%)]" />
      </div>

      {/* blue gradient: dark on the left for the text, photo clear on the right */}
      <div className="hero-fade-in absolute inset-0 -z-30 bg-[linear-gradient(90deg,#030B1E_0%,rgba(7,28,66,0.94)_26%,rgba(10,44,96,0.55)_50%,rgba(10,44,96,0.12)_72%,transparent_100%)] max-lg:bg-[linear-gradient(to_bottom,rgba(3,11,30,0.1)_0%,rgba(3,11,30,0.55)_30%,rgba(3,11,30,0.92)_52%,#030B1E_66%)]" />

      <div className="hx-aurora-a pointer-events-none absolute -left-40 top-0 -z-20 h-[560px] w-[560px] rounded-full bg-[#1D6FE0]/25 blur-[130px]" />
      <div className="hx-aurora-b pointer-events-none absolute -left-24 bottom-0 -z-20 h-[360px] w-[360px] rounded-full bg-[#FF6B00]/20 blur-[130px]" />

      {/* interactive particle network */}
      <div className="absolute inset-0 -z-10">
        <ParticleNetwork />
      </div>

      {/* ── content ── */}
      <div className="container-x relative z-10 flex w-full flex-1 items-center pb-24 pt-[44svh] sm:pt-[46svh] lg:pb-28 lg:pt-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* left: copy */}
          <div className="lg:col-span-7" style={layer(-6)}>
            <span
              style={{ animationDelay: '250ms' }}
              className="hero-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF8A33] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B00] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6B00] shadow-[0_0_10px_#FF6B00]" />
              </span>
              {eyebrow || 'Your Trusted Technology Partner'}
            </span>

            <h1
              aria-label={`${title} ${highlight || ''}`.trim()}
              className="mt-6 text-[2.5rem] font-extrabold leading-[1.06] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] sm:text-6xl xl:text-[4.25rem]"
            >
              {words.map((word, i) => (
                <span key={i} aria-hidden="true" className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                  <span className="hero-word inline-block" style={{ animationDelay: `${450 + i * 130}ms` }}>
                    {word}
                  </span>
                </span>
              ))}
              {highlight && (
                <>
                  <br />
                  <span aria-hidden="true" className="relative inline-block">
                    <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                      <span className="hero-word inline-block" style={{ animationDelay: `${450 + words.length * 130}ms` }}>
                        <span className="hero-shimmer-text">{highlight}</span>
                      </span>
                    </span>
                    <svg viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full" fill="none">
                      <path
                        d="M2 9 Q75 0 150 7 T298 6"
                        stroke="url(#hxu)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1"
                        style={{ animation: 'hx-draw 1s ease-out forwards', animationDelay: `${900 + words.length * 130}ms`, strokeDashoffset: 1 }}
                      />
                      <defs>
                        <linearGradient id="hxu" x1="0" x2="1">
                          <stop offset="0" stopColor="#FF6B00" />
                          <stop offset="1" stopColor="#FFA24D" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </>
              )}
            </h1>

            <p style={{ animationDelay: '1000ms' }} className="hero-fade-up mt-6 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
              {subtitle ||
                'Your trusted partner for secure infrastructure, cyber resilience and enterprise AI transformation.'}
            </p>

            {rotating.length > 0 && (
              <p style={{ animationDelay: '1150ms' }} className="hero-fade-up mt-4 flex flex-wrap items-center gap-x-2 text-sm text-slate-400 sm:text-base">
                <span className="inline-block h-px w-8 bg-gradient-to-r from-[#FF6B00] to-transparent" />
                We specialise in
                <Typewriter words={rotating} />
              </p>
            )}

            {/* CTAs */}
            <div style={{ animationDelay: '1300ms' }} className="hero-fade-up mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={primaryCta?.href || '/services'}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/50"
              >
                <span className="hx-sweep pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                <span className="relative">{primaryCta?.label || 'Our Services'}</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
              <Link
                href={secondaryCta?.href || '/contact'}
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.08] px-7 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/[0.16]"
              >
                {secondaryCta?.label || 'Contact Us'}
              </Link>
            </div>

            {/* mobile badge bar (desktop shows floating cards in the visual) */}
            {badges.length > 0 && (
              <div
                style={{ animationDelay: '1450ms' }}
                className="hero-fade-up mt-8 grid grid-cols-3 gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-3 py-3 backdrop-blur-xl sm:hidden"
              >
                {badges.slice(0, 3).map((b, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 text-center">
                    <Icon name={b.icon || 'shield'} className="h-6 w-6 text-[#FF6B00]" />
                    <h4 className="text-[10px] font-bold leading-tight text-white">{b.title}</h4>
                  </div>
                ))}
              </div>
            )}

            {/* animated stats */}
            {stats.length > 0 && (
              <div
                style={{ animationDelay: '1600ms' }}
                className="hero-fade-up mt-9 grid max-w-xl grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6"
              >
                {stats.slice(0, 3).map((s, i) => (
                  <div key={i} className={i === 0 ? 'pr-4' : 'px-4'}>
                    <p className="bg-gradient-to-r from-[#FF6B00] to-[#FFB070] bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                      <Counter value={s.value} />
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase leading-snug tracking-wider text-slate-400 sm:text-[11px]">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* orbit around the laptop (desktop only; the photo is the visual on mobile) */}
      <div className="pointer-events-none absolute left-[74%] top-[50%] z-10 hidden w-[min(40vw,560px)] -translate-x-1/2 -translate-y-1/2 lg:block">
        <div className="hx-parallax" style={layer(14)}>
          <OrbitVisual badges={badges} core={false} />
        </div>
      </div>

      {/* tagline in a glass card, bottom-right (desktop): outer keeps the tilt, middle fades in, inner floats */}
      <div className="pointer-events-none absolute bottom-[4.5rem] right-6 z-20 hidden -rotate-[4deg] select-none lg:block xl:right-16">
        <div style={{ animationDelay: '1700ms' }} className="hero-fade-up">
          <div className="hx-float-c relative overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] px-7 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_16px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <span aria-hidden className="hx-sweep pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <span className="relative block font-serif text-xl italic text-white drop-shadow-md">Innovative</span>
            <span className="relative block font-serif text-xl italic text-white drop-shadow-md">Technology</span>
            <span className="relative block font-serif text-xl italic text-white drop-shadow-md">Real Impact</span>
            <svg viewBox="0 0 160 24" className="relative mx-auto mt-1 h-5 w-40" fill="none">
              <path d="M4 18 Q80 -2 156 8" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#about"
        aria-label="Scroll down"
        style={{ animationDelay: '2100ms' }}
        className="hero-fade-in absolute bottom-14 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 transition-colors hover:text-[#FF6B00] lg:flex"
      >
        <span className="relative flex h-9 w-[22px] justify-center rounded-full border border-white/40 pt-1.5">
          <span className="h-2 w-[3px] animate-bounce rounded-full bg-[#FF6B00]" />
        </span>
      </a>

      {/* bottom ticker */}
      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-white/10 bg-black/25 py-3 backdrop-blur-md [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="hx-ticker flex w-max items-center gap-10 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300/80">
              {t}
              <span className={`h-1.5 w-1.5 rotate-45 ${i % 2 === 0 ? 'bg-[#FF6B00]' : 'bg-sky-400'}`} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}