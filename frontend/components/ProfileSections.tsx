import { Briefcase, Building2, Cpu, Factory, HeartPulse, Landmark, ShoppingCart } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { DarkSection, Eyebrow, Lead, LightSection, SectionTitle } from '@/components/sections';

/**
 * Content from the NetVerge Company Profile 2026 — both sections are dynamic:
 *  - IndustriesSection  : /content/industries   { eyebrow, title, highlight, text, items: string[] }
 *  - EngagementSection  : /content/engagement   { eyebrow, title, highlight, text, items: string[] }
 * Defaults below are used only when the content key does not exist yet; an empty `items` list hides the section.
 */

const DEFAULT_INDUSTRIES = [
  'Banking & Financial Services (BFSI)',
  'Manufacturing & Industrial Enterprises',
  'Retail & Distribution',
  'Healthcare & Life Sciences',
  'Public Sector & Utilities',
  'IT/ITES & Digital Services',
];

const DEFAULT_ENGAGEMENT = [
  'Consulting & Advisory',
  'Project-Based Delivery',
  'Managed Services & Long-Term Support',
  'Co-Delivery with Strategic Partners',
  'Outcome-Oriented Transformation Programs',
];

function industryIcon(name: string) {
  const n = name.toLowerCase();
  if (/bank|financ|bfsi|insur/.test(n)) return Landmark;
  if (/manufactur|industr/.test(n)) return Factory;
  if (/retail|distribut|commerce/.test(n)) return ShoppingCart;
  if (/health|life science|pharma/.test(n)) return HeartPulse;
  if (/public|govern|utilit/.test(n)) return Building2;
  if (/it\/|ites|digital|software|tech/.test(n)) return Cpu;
  return Briefcase;
}

export function IndustriesSection({ content, variant = 'dark' }: { content?: any; variant?: 'dark' | 'light' }) {
  const c = content || {};
  const items: string[] = (Array.isArray(c.items) ? c.items : DEFAULT_INDUSTRIES).filter(Boolean);
  if (!items.length) return null;
  const dark = variant === 'dark';
  const Wrap = dark ? DarkSection : LightSection;

  return (
    <Wrap>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow dark={dark}>{c.eyebrow || 'Industries'}</Eyebrow>
        <SectionTitle title={c.title || 'Industries We'} highlight={c.highlight || 'Serve'} dark={dark} breakLine={false} />
        <Lead dark={dark} center>
          {c.text || 'We support organizations across regulated and enterprise environments with solutions tailored to their sector.'}
        </Lead>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((name, idx) => {
          const Icon = industryIcon(name);
          const orange = idx % 2 === 0;
          return (
            <Reveal key={idx} delay={(idx % 3) * 100} className="h-full">
              <div
                className={`group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                  dark
                    ? `border-white/10 bg-gradient-to-b from-[#0F1A30] to-[#0A1223] hover:shadow-2xl ${
                        orange ? 'hover:border-[#FF6B00]/50 hover:shadow-orange-500/10' : 'hover:border-[#0284C7]/60 hover:shadow-sky-500/10'
                      }`
                    : `border-slate-200/90 bg-white shadow-lg shadow-slate-900/5 hover:shadow-2xl ${
                        orange ? 'hover:border-[#FF6B00]/40' : 'hover:border-[#0284C7]/40'
                      }`
                }`}
              >
                <span
                  className={`absolute left-0 top-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${
                    orange ? 'bg-gradient-to-r from-[#FF6B00] to-transparent' : 'bg-gradient-to-r from-[#0284C7] to-transparent'
                  }`}
                />
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 ${
                    orange
                      ? 'border-[#FF6B00]/25 bg-[#FF6B00]/10 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white'
                      : dark
                      ? 'border-blue-500/25 bg-blue-500/10 text-blue-400 group-hover:bg-[#0284C7] group-hover:text-white'
                      : 'border-blue-100 bg-blue-50 text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className={`text-sm font-bold leading-snug ${dark ? 'text-white' : 'text-slate-900'}`}>{name}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Wrap>
  );
}

export function EngagementSection({ content, variant = 'dark' }: { content?: any; variant?: 'dark' | 'light' }) {
  const c = content || {};
  const items: string[] = (Array.isArray(c.items) ? c.items : DEFAULT_ENGAGEMENT).filter(Boolean);
  if (!items.length) return null;
  const dark = variant === 'dark';
  const Wrap = dark ? DarkSection : LightSection;

  return (
    <Wrap>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow dark={dark}>{c.eyebrow || 'How We Engage'}</Eyebrow>
        <SectionTitle title={c.title || 'Flexible'} highlight={c.highlight || 'Engagement Models'} dark={dark} breakLine={false} />
        <Lead dark={dark} center>
          {c.text || 'End-to-end technology capabilities spanning advisory, architecture, implementation, integration and ongoing managed support.'}
        </Lead>
      </Reveal>

      <div className="mt-14 flex flex-wrap justify-center gap-5">
        {items.map((name, idx) => {
          const orange = idx % 2 === 0;
          return (
            <Reveal key={idx} delay={(idx % 3) * 100} className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)]">
              <div
                className={`group relative h-full overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  dark
                    ? `border-white/10 bg-gradient-to-b from-[#0F1A30] to-[#0A1223] hover:shadow-2xl ${
                        orange ? 'hover:border-[#FF6B00]/50 hover:shadow-orange-500/10' : 'hover:border-[#0284C7]/60 hover:shadow-sky-500/10'
                      }`
                    : `border-slate-200/90 bg-white shadow-lg shadow-slate-900/5 hover:shadow-2xl ${
                        orange ? 'hover:border-[#FF6B00]/40' : 'hover:border-[#0284C7]/40'
                      }`
                }`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-lg ${
                    orange ? 'bg-gradient-to-br from-[#FF6B00] to-[#FF8A33] shadow-orange-500/30' : 'bg-gradient-to-br from-[#0284C7] to-sky-400 shadow-sky-500/30'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className={`mt-5 text-base font-bold leading-snug ${dark ? 'text-white' : 'text-slate-900'}`}>{name}</h3>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Wrap>
  );
}

/**
 * The 4-point highlights strip from the company profile (75+ years / Customer First / Enterprise Grade / Strategic Ecosystem).
 * Dynamic: /content/highlights  { items: [{ title, text }] }. An empty list hides it.
 */
const DEFAULT_HIGHLIGHTS = [
  { title: '75+ Years', text: 'Combined leadership experience' },
  { title: 'Customer First', text: 'Outcome-focused delivery' },
  { title: 'Enterprise Grade', text: 'Secure & scalable architectures' },
  { title: 'Strategic Ecosystem', text: 'Partner-enabled capabilities' },
];

export function HighlightsStrip({ content, className = '' }: { content?: any; className?: string }) {
  const c = content || {};
  const items: { title: string; text?: string }[] = (Array.isArray(c.items) ? c.items : DEFAULT_HIGHLIGHTS).filter((x: any) => x?.title);
  if (!items.length) return null;
  const cols = items.length >= 4 ? 'lg:grid-cols-4' : items.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';

  return (
    <Reveal className={className}>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5">
        <span className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#FF6B00] via-[#FF8A33] to-[#0284C7]" />
        <div className={`grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 ${cols}`}>
          {items.map((it, idx) => {
            const orange = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`group relative p-6 transition-colors duration-300 hover:bg-slate-50/70 sm:p-7 ${
                  idx > 0 ? 'lg:border-l lg:border-slate-100' : ''
                } ${idx % 2 === 1 ? 'sm:border-l sm:border-slate-100 lg:border-l' : ''} ${idx >= 2 ? 'sm:border-t sm:border-slate-100 lg:border-t-0' : ''}`}
              >
                <span
                  className={`mb-3 block h-1 w-8 rounded-full transition-all duration-300 group-hover:w-14 ${
                    orange ? 'bg-[#FF6B00]' : 'bg-[#0284C7]'
                  }`}
                />
                <p
                  className={`bg-gradient-to-r bg-clip-text text-xl font-extrabold leading-tight text-transparent sm:text-2xl ${
                    orange ? 'from-[#FF6B00] to-[#FFA24D]' : 'from-[#0284C7] to-sky-400'
                  }`}
                >
                  {it.title}
                </p>
                {it.text && <p className="mt-2 text-sm font-medium leading-snug text-slate-600">{it.text}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
