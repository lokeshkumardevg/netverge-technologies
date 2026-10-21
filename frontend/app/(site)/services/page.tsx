import { get, img } from '@/lib/api';
import { PageHero, Icon } from '@/components/ui';
import Reveal from '@/components/Reveal';
import FaqSection from '@/components/FaqSection';
import TestimonialsSection from '@/components/testimonials-section';
import { EngagementSection } from '@/components/ProfileSections';
import { CtaBanner } from '@/components/sections';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Our Services | NetVerge Technologies' };

const defaultServices = [
  {
    _id: 's1',
    title: 'Enterprise Network Solutions',
    icon: 'network',
    description: 'Secure, scalable and reliable network infrastructure to keep your business connected.',
    items: [
      'Network Design & Architecture',
      'SD-WAN Implementation',
      'LAN/WAN Optimization',
      'Wireless Infrastructure',
    ],
  },
  {
    _id: 's2',
    title: 'Cybersecurity Services',
    icon: 'shield',
    description: 'Protect your business from evolving cyber threats with our comprehensive security solutions.',
    items: [
      'Threat Detection & Incident Response',
      'Risk Assessment & Vulnerability Management',
      'Identity & Access Management',
      'Security Architecture Design',
    ],
  },
  {
    _id: 's3',
    title: 'Data Center Solutions',
    icon: 'database',
    description: 'Optimize and modernize your data center infrastructure with scalable, secure and high-performance solutions.',
    items: [
      'Data Center Design & Architecture',
      'Virtualization & Consolidation',
      'Migration & Modernization',
      'Disaster Recovery & Backup Solutions',
    ],
  },
  {
    _id: 's4',
    title: 'Managed IT Services',
    icon: 'server',
    description: 'Proactive monitoring and support for seamless operations.',
    items: [
      '24/7 Network Monitoring',
      'Help Desk & Technical Support',
      'Patch Management & Updates',
      'IT Asset Management',
    ],
  },
  {
    _id: 's5',
    title: 'Cloud Solutions',
    icon: 'cloud',
    description: 'Accelerate your digital transformation with flexible, secure, and scalable cloud services.',
    items: [
      'Cloud Strategy & Consulting',
      'Cloud Migration & Deployment',
      'Hybrid & Multi-Cloud Architecture',
      'Cloud Security & Compliance',
    ],
  },
  {
    _id: 's6',
    title: 'IT Consulting',
    icon: 'users',
    description: 'Strategic guidance and expert advice to align your technology initiatives with business goals.',
    items: [
      'IT Strategy & Roadmap Development',
      'Technology Assessments & Audits',
      'Digital Transformation Planning',
      'Vendor Selection & Management',
    ],
  },
];

export default async function Services() {
  const [c, services, faqs, faqContent, testimonials, testimonialContent, engagementContent] = await Promise.all([
    get('/content/services', {} as any),
    get('/services', [] as any[]),
    get('/faqs?page=services', [] as any[]),
    get('/content/faq', {} as any),
    get('/testimonials?page=services', [] as any[]),
    get('/content/testimonials', {} as any),
    get('/content/engagement', {} as any),
  ]);

  const h = c?.hero || {};
  const intro = c?.intro || {};
  const cta = c?.cta || {};

  const activeServices =
    Array.isArray(services) && services.length > 0
      ? services.filter((s: any) => s.isActive !== false)
      : defaultServices;

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          1. SERVICES HERO BANNER
          ═══════════════════════════════════════════════════════════════════ */}
      <PageHero
        bgImage={h.image ? img(h.image) : '/images/services_banner.jpg'}
        eyebrow={h.eyebrow || 'OUR SERVICES'}
        title={h.title || 'Technology Solutions for a Stronger'}
        highlight={h.highlight !== undefined ? h.highlight : 'Tomorrow'}
        text={
          h.text ||
          'We offer a comprehensive range of IT services designed to help businesses stay secure, agile, and ahead in a digital-first world.'
        }
        crumb="Services"
      />

      {/* ═══════════════════════════════════════════════════════════════════
          2. SERVICES GRID
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white py-20 lg:py-28 border-b border-slate-200">
        {/* Decorative background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FF6B00]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#0284C7]/10 blur-3xl" />

        <div className="container-x relative">
          {/* Header */}
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              {intro.eyebrow || 'WHAT WE DO'}
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] leading-[1.15]">
              {intro.title || 'Our Services'}
            </h2>
            <p className="mt-3 text-base font-semibold text-[#0284C7]">
              {intro.subtitle || 'Tailored Solutions for Your Business Needs'}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {intro.text ||
                'From cloud infrastructure to cybersecurity, we provide end-to-end solutions that help you innovate, optimize and grow.'}
            </p>
          </Reveal>

          {/* Service Cards */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeServices.map((service: any, idx: number) => {
              const items = Array.isArray(service.items) ? service.items : [];
              const orange = idx % 2 === 0;
              return (
                <Reveal key={service._id || idx} delay={(idx % 3) * 120} className="h-full">
                  <div
                    className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-900/10 ${
                      orange ? 'hover:border-[#FF6B00]/40' : 'hover:border-[#0284C7]/40'
                    }`}
                  >
                    {/* Hover glow */}
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${
                        orange ? 'bg-[#FF6B00]/15' : 'bg-[#0284C7]/15'
                      }`}
                    />
                    {/* Top accent bar */}
                    <span
                      className={`absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100 ${
                        orange ? 'from-[#FF6B00] to-[#FF8A33]' : 'from-[#0284C7] to-sky-400'
                      }`}
                    />

                    <div className="relative">
                      {service.heroImage && (
                        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100">
                          <img
                            src={img(service.heroImage)}
                            alt={service.title}
                            loading="lazy"
                            className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="mb-6 flex items-start justify-between">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110 ${
                            orange
                              ? 'border-orange-100 bg-orange-50 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30'
                              : 'border-blue-100 bg-blue-50 text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white group-hover:shadow-lg group-hover:shadow-sky-500/30'
                          }`}
                        >
                          <Icon name={service.icon || 'network'} className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold tracking-wider text-slate-200 transition-colors group-hover:text-slate-300">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h3
                        className={`text-lg font-bold leading-snug text-slate-900 transition-colors ${
                          orange ? 'group-hover:text-[#FF6B00]' : 'group-hover:text-[#0284C7]'
                        }`}
                      >
                        {service.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{service.description}</p>

                      {items.length > 0 && (
                        <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
                          {items.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 sm:text-[13px]">
                              <span
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                                  orange ? 'bg-orange-100 text-[#FF6B00]' : 'bg-blue-100 text-[#0284C7]'
                                }`}
                              >
                                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="relative mt-7 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span
                        className={`text-xs font-bold ${orange ? 'text-[#FF6B00]' : 'text-[#0284C7]'}`}
                      >
                        Learn More
                      </span>
                      <Link
                        href={service.slug ? `/services/${service.slug}` : '/contact'}
                        aria-label={`Learn more about ${service.title}`}
                        className={`after:absolute after:inset-0 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-300 group-hover:text-white ${
                          orange
                            ? 'group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00]'
                            : 'group-hover:border-[#0284C7] group-hover:bg-[#0284C7]'
                        }`}
                      >
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. TESTIMONIALS + FAQ (dynamic)
          ═══════════════════════════════════════════════════════════════════ */}
      <EngagementSection content={engagementContent} variant="dark" />
      <TestimonialsSection items={testimonials} content={testimonialContent} variant="light" />
      <FaqSection items={faqs} content={faqContent} glow="right" />

      {/* ═══════════════════════════════════════════════════════════════════
          4. CUSTOM SOLUTION CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <CtaBanner
        eyebrow={cta.eyebrow || 'CUSTOM ARCHITECTURE'}
        title={cta.title || 'Need a Custom Solution?'}
        text={cta.text || 'Our team is ready to help you build the right technology solution for your unique business needs.'}
        buttonText={cta.buttonText || 'Schedule a Consultation'}
      />
    </>
  );
}