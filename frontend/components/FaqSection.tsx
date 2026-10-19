import Link from 'next/link';
import { ArrowRight, Mail, Plus } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { Eyebrow, LightSection, Lead, SectionTitle } from '@/components/sections';

export type FaqItem = { _id?: string; question: string; answer: string };

/**
 * Dynamic FAQ section. Items come from the API (/faqs?page=...), heading text from /content/faq.
 * Renders nothing when there are no FAQs for the page.
 */
export default function FaqSection({ items, content, glow = 'left' }: { items?: FaqItem[]; content?: any; glow?: 'left' | 'right' }) {
  const list = (Array.isArray(items) ? items : []).filter((f) => f?.question);
  if (!list.length) return null;
  const fq = content || {};

  return (
    <LightSection glow={glow}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left: heading + help card */}
        <Reveal direction="left" className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>{fq.eyebrow || 'FAQ'}</Eyebrow>
            <SectionTitle title={fq.title || 'Frequently Asked'} highlight={fq.highlight || 'Questions'} />
            <Lead>{fq.text || 'Quick answers to the things people ask us most. Cannot find yours? Talk to us directly.'}</Lead>

            <div className="relative mt-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg shadow-slate-900/5">
              <span className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#FF6B00] to-[#0284C7]" />
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#0284C7]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{fq.helpTitle || 'Still have questions?'}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {fq.helpText || 'Our team is happy to help you find the right solution.'}
                  </p>
                </div>
              </div>
              <Link
                href="/contact"
                className="group mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
              >
                {fq.buttonText || 'Contact Us'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Right: accordion */}
        <div className="space-y-3.5 lg:col-span-8">
          {list.map((f, idx) => {
            const isOrange = idx % 2 === 0;
            return (
              <Reveal key={f._id || idx} delay={(idx % 4) * 90}>
                <details
                  className={`group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/5 open:shadow-xl open:shadow-slate-900/5 ${
                    isOrange ? 'hover:border-[#FF6B00]/40 open:border-[#FF6B00]/50' : 'hover:border-[#0284C7]/40 open:border-[#0284C7]/50'
                  }`}
                >
                  <span
                    className={`absolute left-0 top-0 h-full w-1 origin-top scale-y-0 transition-transform duration-300 group-open:scale-y-100 ${
                      isOrange ? 'bg-gradient-to-b from-[#FF6B00] to-[#FF8A33]' : 'bg-gradient-to-b from-[#0284C7] to-sky-400'
                    }`}
                  />
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                        isOrange ? 'border-orange-100 bg-orange-50 text-[#FF6B00]' : 'border-blue-100 bg-blue-50 text-[#0284C7]'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-sm font-bold leading-snug text-slate-900 sm:text-[15px]">{f.question}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-300 group-open:rotate-45 group-open:border-transparent group-open:text-white ${
                        isOrange ? 'group-open:bg-[#FF6B00]' : 'group-open:bg-[#0284C7]'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pl-[4.25rem] pr-14">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{f.answer}</p>
                  </div>
                </details>
              </Reveal>
            );
          })}
        </div>
      </div>
    </LightSection>
  );
}
