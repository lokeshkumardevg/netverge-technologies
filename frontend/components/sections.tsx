import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

/**
 * Shared building blocks so every page uses the SAME theme:
 *  - LightSection : white → slate gradient, dotted pattern, soft orange/blue glows
 *  - DarkSection  : #070D19, grid pattern, blue/orange glows
 *  - Eyebrow, SectionTitle, Lead : pill label, big heading with orange highlight, bordered paragraph
 *  - CtaBanner    : closing dark call-to-action
 */

export const BRAND = '#FF6B00';

/** "Our Leadership Team" -> ['Our Leadership', 'Team'] when no explicit highlight is given. */
export function splitTitle(title?: string, highlight?: string): [string, string] {
  const t = (title || '').trim();
  if (highlight) return [t, highlight];
  const words = t.split(/\s+/);
  if (words.length < 2) return [t, ''];
  return [words.slice(0, -1).join(' '), words[words.length - 1]];
}

export function LightSection({
  children,
  id,
  className = '',
  glow = 'left',
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  glow?: 'left' | 'right';
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/60 to-white py-20 lg:py-28 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute ${glow === 'left' ? '-left-24' : '-right-24'} top-10 h-72 w-72 rounded-full bg-[#FF6B00]/10 blur-3xl`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute ${glow === 'left' ? '-right-24' : '-left-24'} bottom-0 h-80 w-80 rounded-full bg-[#0284C7]/10 blur-3xl`}
      />
      <div className="container-x relative">{children}</div>
    </section>
  );
}

export function DarkSection({
  children,
  id,
  className = '',
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`relative overflow-hidden bg-[#070D19] py-20 text-white lg:py-28 ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/15 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="container-x relative z-10">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF6B00] ${
        dark ? 'border-[#FF6B00]/30 bg-[#FF6B00]/10' : 'border-orange-200 bg-orange-50'
      }`}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF6B00]" />
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  highlight,
  dark = false,
  breakLine = true,
}: {
  title?: string;
  highlight?: string;
  dark?: boolean;
  breakLine?: boolean;
}) {
  return (
    <h2
      className={`mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.6rem] ${
        dark ? 'text-white' : 'text-slate-900'
      }`}
    >
      {title}
      {highlight && (
        <>
          {breakLine ? <br /> : ' '}
          {dark ? (
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FFA24D] bg-clip-text text-transparent">{highlight}</span>
          ) : (
            <span className="relative inline-block text-[#FF6B00]">
              {highlight}
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF6B00]/0" />
            </span>
          )}
        </>
      )}
    </h2>
  );
}

export function Lead({ children, dark = false, center = false }: { children: ReactNode; dark?: boolean; center?: boolean }) {
  if (center) {
    return (
      <p className={`mx-auto mt-5 max-w-2xl text-sm leading-relaxed sm:text-base ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
        {children}
      </p>
    );
  }
  return (
    <p
      className={`mt-6 border-l-2 pl-4 text-sm leading-relaxed sm:text-base ${
        dark ? 'border-[#FF6B00]/50 text-slate-300' : 'border-[#0284C7]/40 text-slate-600'
      }`}
    >
      {children}
    </p>
  );
}

export function CtaBanner({
  eyebrow = 'LET’S TALK',
  title,
  text,
  buttonText,
  href = '/contact',
  secondary,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  buttonText: string;
  href?: string;
  secondary?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[#070D19] py-20 text-white sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div className="pointer-events-none absolute right-1/4 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#FF6B00]/15 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container-x relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <Reveal direction="left" className="max-w-2xl">
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl">{title}</h2>
          {text && (
            <p className="mt-4 border-l-2 border-[#FF6B00]/50 pl-4 text-sm leading-relaxed text-slate-300 sm:text-base">{text}</p>
          )}
        </Reveal>

        <Reveal direction="right" delay={150} className="flex shrink-0 flex-wrap items-center gap-3">
          <Link
            href={href}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
          >
            {buttonText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          {secondary}
        </Reveal>
      </div>
    </section>
  );
}
