import { get, img } from '@/lib/api';
import { PageHero, Icon } from '@/components/ui';
import Reveal from '@/components/Reveal';
import TestimonialsSection from '@/components/testimonials-section';
import { HighlightsStrip, IndustriesSection } from '@/components/ProfileSections';
import { CtaBanner } from '@/components/sections';
import Link from 'next/link';
import {
  ArrowRight,
  Target,
  Eye,
  Award,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'About Us | NetVerge Technologies' };

const defaultStats = [
  { value: '10+', label: 'Years of Experience' },
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Happy Clients' },
];

const defaultWhyChoose = [
  {
    title: 'Expert Team',
    text: 'Skilled professionals with diverse industry experience.',
    icon: 'users',
  },
  {
    title: 'Client-Centric Approach',
    text: 'Your success is our top priority at every step.',
    icon: 'heart',
  },
  {
    title: 'Innovative Solutions',
    text: 'Leveraging latest technologies to solve real challenges.',
    icon: 'trend',
  },
  {
    title: 'Long-Term Partnership',
    text: 'We grow with you as your dedicated technology ally.',
    icon: 'share',
  },
];

const defaultParagraphs = [
  'NetVerge Technologies (OPC) Pvt. Ltd. is a trusted partner in Digital Transformation, Cybersecurity, and Enterprise Application Services. We empower businesses with secure, scalable, and intelligent technology solutions that drive growth and efficiency.',
  'With a customer-first mindset, deep technical expertise, and strong business acumen, we deliver tailored solutions that solve complex challenges and create lasting value.',
];

export default async function About() {
  const [c, testimonials, testimonialContent, industriesContent, highlightsContent]: any[] = await Promise.all([
    get('/content/about', {} as any),
    get('/testimonials?page=about', [] as any[]),
    get('/content/testimonials', {} as any),
    get('/content/industries', {} as any),
    get('/content/highlights', {} as any),
  ]);
  const h = c.hero || {};
  const st = c.story || {};
  const mission = c.mission || {};
  const vision = c.vision || {};
  const values = c.values || {};
  const cta = c.cta || {};

  const stats =
    Array.isArray(c.stats) && c.stats.length > 0 ? c.stats : defaultStats;

  const whyChooseRaw =
    Array.isArray(c.whyChoose) && c.whyChoose.length > 0
      ? c.whyChoose
      : defaultWhyChoose;

  const whyChoose = whyChooseRaw.map((item: any, idx: number) => ({
    ...item,
    icon:
      item.icon ||
      (idx === 0 ? 'users' : idx === 1 ? 'heart' : idx === 2 ? 'trend' : 'share'),
  }));

  const storyParagraphs: string[] = (() => {
    if (Array.isArray(st.paragraphs) && st.paragraphs.length > 0) return st.paragraphs;
    if (typeof st.text === 'string' && st.text.trim()) return [st.text];
    return defaultParagraphs;
  })();

  const mvv = [
    {
      Icon: Target,
      title: mission.title || 'Our Mission',
      text:
        mission.text ||
        'To deliver innovative, secure, and scalable technology solutions that empower businesses to grow.',
      orange: true,
    },
    {
      Icon: Eye,
      title: vision.title || 'Our Vision',
      text:
        vision.text ||
        'To be a global leader in digital transformation and technology innovation.',
      orange: false,
    },
    {
      Icon: Award,
      title: values.title || 'Our Values',
      text:
        values.text ||
        'Integrity, excellence, collaboration, and a commitment to customer success.',
      orange: true,
    },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          1. ABOUT HERO BANNER
          ═══════════════════════════════════════════════════════════════════ */}
      <PageHero
        bgImage={h.image ? img(h.image) : '/images/team_meeting.jpg'}
        eyebrow={h.eyebrow || 'ABOUT US'}
        title={h.title || 'Who We Are'}
        highlight={h.highlight}
        text={
          h.text ||
          'We are more than just a tech company — we are a team of innovators, problem solvers, and digital transformation experts.'
        }
        crumb="About"
      />

      {/* ═══════════════════════════════════════════════════════════════════
          2. STORY & STATS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white py-20 lg:py-28 border-b border-slate-200">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FF6B00]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#0284C7]/10 blur-3xl" />

        <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
          {/* Left Text & Stats */}
          <Reveal direction="left" className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              {st.eyebrow || 'OUR STORY'}
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] leading-[1.15]">
              {st.title || 'Building a Smarter Digital Future'}
            </h2>

            <div className="mt-6 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              {storyParagraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={idx === 0 ? 'border-l-2 border-[#0284C7]/40 pl-4' : ''}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Stats Row */}
            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
              {stats.map((stat: any, idx: number) => {
                const orange = idx % 2 === 0;
                return (
                  <div
                    key={idx}
                    className={`group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 sm:p-5 ${
                      orange ? 'hover:border-[#FF6B00]/40' : 'hover:border-[#0284C7]/40'
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${
                        orange ? 'from-[#FF6B00] to-[#FF8A33]' : 'from-[#0284C7] to-sky-400'
                      }`}
                    />
                    <p
                      className={`bg-gradient-to-r bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl ${
                        orange ? 'from-[#FF6B00] to-[#FFA24D]' : 'from-[#0284C7] to-sky-400'
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-[11px] font-semibold leading-snug text-slate-600 sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Right Image + Badges */}
          <Reveal direction="right" delay={150} className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg px-3 pb-6 pt-3">
              <div
                aria-hidden
                className="absolute inset-0 rounded-3xl border-2 border-[#FF6B00]/30"
                style={{ transform: 'translate(-8px, -8px)' }}
              />
              <div aria-hidden className="absolute -bottom-2 -right-2 h-28 w-28 rounded-2xl bg-gradient-to-br from-[#0284C7]/20 to-transparent" />

              <div className="group relative overflow-hidden rounded-3xl border border-white bg-white shadow-2xl shadow-slate-900/10">
                <img
                  src={st.image ? img(st.image) : '/images/team_meeting.jpg'}
                  alt="NetVerge Team in Meeting"
                  className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[26rem]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-2 right-0 flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-xl backdrop-blur">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8A33] text-white shadow-md shadow-orange-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight text-slate-900">Your Growth</p>
                  <p className="text-[11px] font-semibold leading-tight text-[#FF6B00]">Our Mission</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Company highlights strip (dynamic: Admin > Highlights Strip) */}
        <div className="container-x relative mt-14">
          <HighlightsStrip content={highlightsContent} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. MISSION, VISION & VALUES
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#070D19] py-20 text-white lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/15 blur-[130px]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="container-x relative z-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              {c.mvvEyebrow || 'WHAT DRIVES US'}
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem] leading-[1.15]">
              <span className="text-sky-400">Our</span> Mission, Vision &amp;{' '}
              <span className="bg-gradient-to-r from-[#FF6B00] to-[#FFA24D] bg-clip-text text-transparent">
                Values
              </span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {mvv.map((item, idx) => {
              const Ico = item.Icon;
              return (
                <Reveal key={idx} delay={idx * 120} className="h-full">
                  <div
                    className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0F1A30] to-[#0A1223] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      item.orange
                        ? 'hover:border-[#FF6B00]/50 hover:shadow-orange-500/10'
                        : 'hover:border-[#0284C7]/60 hover:shadow-sky-500/10'
                    }`}
                  >
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${
                        item.orange ? 'bg-[#FF6B00]/25' : 'bg-[#0284C7]/30'
                      }`}
                    />
                    <span
                      className={`absolute left-0 top-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${
                        item.orange
                          ? 'bg-gradient-to-r from-[#FF6B00] to-transparent'
                          : 'bg-gradient-to-r from-[#0284C7] to-transparent'
                      }`}
                    />

                    <div className="relative flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110 ${
                          item.orange
                            ? 'border-[#FF6B00]/25 bg-[#FF6B00]/10 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30'
                            : 'border-blue-500/25 bg-blue-500/10 text-blue-400 group-hover:bg-[#0284C7] group-hover:text-white group-hover:shadow-lg group-hover:shadow-sky-500/30'
                        }`}
                      >
                        <Ico className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold tracking-wider text-white/15 transition-colors group-hover:text-white/40">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3
                      className={`relative mt-6 text-lg font-bold text-white transition-colors ${
                        item.orange ? 'group-hover:text-[#FF8A33]' : 'group-hover:text-sky-300'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="relative mt-3 text-sm leading-relaxed text-slate-400">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. WHY CHOOSE NETVERGE?
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white py-20 lg:py-28 border-b border-slate-200">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#FF6B00]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#0284C7]/10 blur-3xl" />

        <div className="container-x relative">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              {c.whyEyebrow || 'WHY US'}
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] leading-[1.15]">
              Why Choose{' '}
              <span className="relative inline-block text-[#FF6B00]">
                NetVerge?
                <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF6B00]/0" />
              </span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((feat: any, idx: number) => {
              const orange = idx % 2 === 0;
              return (
                <Reveal key={idx} delay={(idx % 4) * 100} className="h-full">
                  <div
                    className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 sm:text-left ${
                      orange ? 'hover:border-[#FF6B00]/40' : 'hover:border-[#0284C7]/40'
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100 ${
                        orange ? 'from-[#FF6B00] to-[#FF8A33]' : 'from-[#0284C7] to-sky-400'
                      }`}
                    />
                    <div className="flex items-start justify-between">
                      <div
                        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 sm:mx-0 ${
                          orange
                            ? 'border-orange-100 bg-orange-50 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30'
                            : 'border-blue-100 bg-blue-50 text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white group-hover:shadow-lg group-hover:shadow-sky-500/30'
                        }`}
                      >
                        <Icon name={feat.icon || 'users'} className="h-6 w-6" />
                      </div>
                      <span className="hidden text-xs font-bold text-slate-200 transition-colors group-hover:text-slate-300 sm:block">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-5 text-base font-bold text-slate-900">{feat.title}</h3>
                    <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-600">{feat.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. INDUSTRIES WE SERVE + TESTIMONIALS (dynamic)
          ═══════════════════════════════════════════════════════════════════ */}
      <IndustriesSection content={industriesContent} variant="dark" />
      <TestimonialsSection items={testimonials} content={testimonialContent} variant="light" />

      {/* ═══════════════════════════════════════════════════════════════════
          6. CTA BANNER
          ═══════════════════════════════════════════════════════════════════ */}
      <CtaBanner
        eyebrow={cta.eyebrow || 'LET\u2019S TALK'}
        title={cta.title || "Let's Build a Smarter Future Together"}
        text={cta.text || 'Partner with NetVerge and take the next step towards digital excellence.'}
        buttonText={cta.buttonText || 'Get in Touch'}
      />
    </>
  );
}