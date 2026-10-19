import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check, Phone } from 'lucide-react';
import { get, img } from '@/lib/api';
import { Icon, PageHero } from '@/components/ui';
import Reveal from '@/components/Reveal';
import FaqSection from '@/components/FaqSection';
import TestimonialsSection from '@/components/testimonials-section';
import { CtaBanner, DarkSection, Eyebrow, LightSection, Lead, SectionTitle, splitTitle } from '@/components/sections';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

async function getService(slug: string) {
  return get<any>(`/services/slug/${encodeURIComponent(slug)}`, null);
}

export async function generateMetadata({ params }: Props) {
  const svc = await getService(params.slug);
  if (!svc) return { title: 'Service not found' };
  return { title: svc.title, description: svc.tagline || svc.description };
}

export default async function ServiceDetail({ params }: Props) {
  const [svc, all, settings, faqContent, testimonials, testimonialContent] = await Promise.all([
    getService(params.slug),
    get('/services', [] as any[]),
    get('/content/settings', {} as any),
    get('/content/faq', {} as any),
    get('/testimonials?page=services', [] as any[]),
    get('/content/testimonials', {} as any),
  ]);
  if (!svc) notFound();

  const items: string[] = (svc.items || []).filter(Boolean);
  const benefits = (svc.benefits || []).filter((b: any) => b?.title);
  const steps = (svc.process || []).filter((p: any) => p?.title);
  const tech: string[] = (svc.technologies || []).filter(Boolean);
  const faqs = (svc.faqs || []).filter((f: any) => f?.question);
  const paragraphs: string[] = String(svc.overview || svc.description || '')
    .split(/\n\s*\n/)
    .map((x: string) => x.trim())
    .filter(Boolean);
  const related = (Array.isArray(all) ? all : []).filter((x: any) => x._id !== svc._id && x.slug).slice(0, 3);
  const [ovTitle, ovHl] = splitTitle(svc.title);
  const phone = settings.phone || '';
  const telHref = `tel:${String(phone).replace(/[^\d+]/g, '')}`;

  return (
    <>
      <PageHero
        bgImage={svc.heroImage ? img(svc.heroImage) : '/images/services_banner.jpg'}
        eyebrow="OUR SERVICES"
        title={svc.title}
        text={svc.tagline || svc.description}
        crumb={svc.title}
        parent={{ label: 'Services', href: '/services' }}
      />

      {/* ───────── Overview + What we offer ───────── */}
      <LightSection glow="left">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal direction="left" className="lg:col-span-7">
            <Eyebrow>Overview</Eyebrow>
            <SectionTitle title={ovTitle} highlight={ovHl} breakLine={false} />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {svc.heroImage && (
              <div className="mt-8 overflow-hidden rounded-3xl border border-white shadow-2xl shadow-slate-900/10">
                <img src={img(svc.heroImage)} alt={svc.title} className="h-64 w-full object-cover sm:h-80" />
              </div>
            )}
          </Reveal>

          <Reveal direction="right" delay={120} className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xl shadow-slate-900/5">
                <span className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#FF6B00] to-[#0284C7]" />
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[#FF6B00]">
                    <Icon name={svc.icon || 'network'} className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">What we offer</p>
                    <p className="text-base font-bold text-slate-900">{svc.title}</p>
                  </div>
                </div>

                {items.length > 0 && (
                  <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${i % 2 === 0 ? 'bg-orange-100 text-[#FF6B00]' : 'bg-blue-100 text-[#0284C7]'}`}>
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
                  >
                    Request a Quote
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  {phone && (
                    <a href={telHref} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-[#FF6B00] hover:text-[#FF6B00]">
                      <Phone className="h-4 w-4" />
                      Call us
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </LightSection>

      {/* ───────── Benefits ───────── */}
      {benefits.length > 0 && (
        <DarkSection>
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow dark>Key Benefits</Eyebrow>
            <SectionTitle title="Why Choose Our" highlight={svc.title} dark breakLine={false} />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b: any, idx: number) => {
              const orange = idx % 2 === 0;
              return (
                <Reveal key={idx} delay={(idx % 4) * 100} className="h-full">
                  <div
                    className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0F1A30] to-[#0A1223] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      orange ? 'hover:border-[#FF6B00]/50 hover:shadow-orange-500/10' : 'hover:border-[#0284C7]/60 hover:shadow-sky-500/10'
                    }`}
                  >
                    <span className={`absolute left-0 top-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${orange ? 'bg-gradient-to-r from-[#FF6B00] to-transparent' : 'bg-gradient-to-r from-[#0284C7] to-transparent'}`} />
                    <div className="flex items-start justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${orange ? 'border-[#FF6B00]/25 bg-[#FF6B00]/10 text-[#FF6B00]' : 'border-blue-500/25 bg-blue-500/10 text-blue-400'}`}>
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold tracking-wider text-white/15">{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="mt-5 text-base font-bold text-white">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{b.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </DarkSection>
      )}

      {/* ───────── Process + Technologies ───────── */}
      {(steps.length > 0 || tech.length > 0) && (
        <LightSection glow="right">
          {steps.length > 0 && (
            <>
              <Reveal className="mx-auto max-w-2xl text-center">
                <Eyebrow>How We Work</Eyebrow>
                <SectionTitle title="Our" highlight="Approach" breakLine={false} />
                <Lead center>A simple, transparent process from first conversation to long-term support.</Lead>
              </Reveal>
              <div className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((st: any, idx: number) => (
                  <Reveal key={idx} delay={(idx % 4) * 100} className="h-full">
                    <div className="group relative h-full rounded-3xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/40 hover:shadow-2xl hover:shadow-slate-900/10">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8A33] text-sm font-extrabold text-white shadow-lg shadow-orange-500/30">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-5 text-base font-bold text-slate-900">{st.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{st.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {tech.length > 0 && (
            <Reveal className={steps.length ? 'mt-16 text-center' : 'text-center'}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Technologies &amp; Platforms</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {tech.map((t, i) => (
                  <span key={i} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-[#FF6B00]/50 hover:text-[#FF6B00]">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </LightSection>
      )}

      <TestimonialsSection items={testimonials} content={testimonialContent} variant="dark" />

      {/* ───────── Service-specific FAQs ───────── */}
      <FaqSection
        items={faqs}
        content={{ ...faqContent, title: `${svc.title}`, highlight: 'FAQs', text: `Common questions about ${svc.title}. Cannot find yours? Talk to us directly.` }}
        glow="right"
      />

      {/* ───────── Other services ───────── */}
      {related.length > 0 && (
        <LightSection glow="left" className="!py-16 lg:!py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>Explore More</Eyebrow>
            <SectionTitle title="Other" highlight="Services" breakLine={false} />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {related.map((r: any, idx: number) => (
              <Reveal key={r._id} delay={idx * 100} className="h-full">
                <Link
                  href={`/services/${r.slug}`}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/40 hover:shadow-2xl"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[#FF6B00] transition-all group-hover:bg-[#FF6B00] group-hover:text-white">
                      <Icon name={r.icon || 'network'} className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-base font-bold text-slate-900 group-hover:text-[#FF6B00]">{r.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{r.description}</p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00]">
                    Learn more <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </LightSection>
      )}

      <CtaBanner
        eyebrow="GET STARTED"
        title={svc.ctaTitle || `Interested in ${svc.title}?`}
        text={svc.ctaText || 'Tell us about your requirements and our team will get back to you with the right solution.'}
        buttonText="Talk to an Expert"
      />
    </>
  );
}
