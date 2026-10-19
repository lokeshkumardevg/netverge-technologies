import { Quote, Star } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { img } from '@/lib/api';
import { DarkSection, Eyebrow, Lead, LightSection, SectionTitle } from '@/components/sections';

export type TestimonialItem = {
  _id?: string;
  name: string;
  designation?: string;
  company?: string;
  quote: string;
  photo?: string;
  rating?: number;
};

const initials = (name: string) =>
  name
    .replace(/^(mr|ms|mrs|dr)\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

/**
 * Dynamic testimonials section. Items come from the API (/testimonials?page=...),
 * heading text from /content/testimonials. Renders nothing when there are none for the page.
 * variant="dark" (default) or "light" so it can alternate with its neighbouring sections.
 */
export default function TestimonialsSection({
  items,
  content,
  variant = 'dark',
}: {
  items?: TestimonialItem[];
  content?: any;
  variant?: 'dark' | 'light';
}) {
  const list = (Array.isArray(items) ? items : []).filter((t) => t?.quote);
  if (!list.length) return null;
  const c = content || {};
  const dark = variant === 'dark';
  const Wrap = dark ? DarkSection : LightSection;

  return (
    <Wrap>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow dark={dark}>{c.eyebrow || 'Testimonials'}</Eyebrow>
        <SectionTitle title={c.title || 'What Our Clients'} highlight={c.highlight || 'Say About Us'} dark={dark} breakLine={false} />
        <Lead dark={dark} center>
          {c.text || 'Real feedback from the businesses we have helped to stay secure, scalable and smart.'}
        </Lead>
      </Reveal>

      <div className={`mt-14 grid gap-5 md:grid-cols-2 ${list.length === 1 ? 'mx-auto max-w-xl md:grid-cols-1' : ''} ${list.length > 2 ? 'lg:grid-cols-3' : ''}`}>
        {list.map((t, idx) => {
          const orange = idx % 2 === 0;
          const rating = Math.max(0, Math.min(5, Math.round(Number(t.rating ?? 5))));
          return (
            <Reveal key={t._id || idx} delay={(idx % 3) * 120} className="h-full">
              <figure
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                  dark
                    ? `border-white/10 bg-gradient-to-b from-[#0F1A30] to-[#0A1223] hover:shadow-2xl ${
                        orange ? 'hover:border-[#FF6B00]/50 hover:shadow-orange-500/10' : 'hover:border-[#0284C7]/60 hover:shadow-sky-500/10'
                      }`
                    : `border-slate-200/90 bg-white shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 ${
                        orange ? 'hover:border-[#FF6B00]/40' : 'hover:border-[#0284C7]/40'
                      }`
                }`}
              >
                <span
                  className={`absolute left-0 top-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${
                    orange ? 'bg-gradient-to-r from-[#FF6B00] to-transparent' : 'bg-gradient-to-r from-[#0284C7] to-transparent'
                  }`}
                />

                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                      orange
                        ? 'border-[#FF6B00]/25 bg-[#FF6B00]/10 text-[#FF6B00]'
                        : dark
                        ? 'border-blue-500/25 bg-blue-500/10 text-blue-400'
                        : 'border-blue-100 bg-blue-50 text-[#0284C7]'
                    }`}
                  >
                    <Quote className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating ? 'fill-[#FF6B00] text-[#FF6B00]' : dark ? 'text-white/20' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                </div>

                <blockquote className={`mt-5 flex-1 whitespace-pre-line text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                  “{t.quote}”
                </blockquote>

                <figcaption className={`mt-6 flex items-center gap-3 border-t pt-5 ${dark ? 'border-white/10' : 'border-slate-100'}`}>
                  {t.photo ? (
                    <img src={img(t.photo)} alt={t.name} className="h-11 w-11 shrink-0 rounded-full border border-white/20 object-cover object-top" />
                  ) : (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8A33] text-sm font-bold text-white">
                      {initials(t.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{t.name}</p>
                    <p className={`truncate text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {[t.designation, t.company].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>
    </Wrap>
  );
}
