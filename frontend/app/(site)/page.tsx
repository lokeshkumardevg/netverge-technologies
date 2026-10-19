import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Shield,
  Cloud,
  Zap,
  Phone,
  Mail,
  MapPin,
  Laptop,
  Lock,
  Server,
  Compass,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Database,
  Users,
  Star,
  Quote,
  Plus
} from 'lucide-react';
import { get, img } from '@/lib/api';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import PartnersSection from '@/components/PartnersSection';
import { HighlightsStrip } from '@/components/ProfileSections';
import { Eyebrow, LightSection, Lead, SectionTitle } from '@/components/sections';
import { Icon } from '@/components/ui';
import FaqSection from '@/components/FaqSection';
import TestimonialsSection from '@/components/testimonials-section';

export const dynamic = 'force-dynamic';

const defaultBadges = [
  { title: 'Robust Security', text: 'Your data, our priority', icon: 'shield' },
  { title: 'Scalable Solutions', text: 'Built for future growth', icon: 'cloud' },
  { title: 'Expert Team', text: 'Turning ideas into reality', icon: 'zap' },
];

const defaultAboutCards = [
  {
    title: 'Digital Transformation',
    text: 'Modern solutions to help you work smarter and grow faster.',
    icon: 'laptop',
  },
  {
    title: 'Cybersecurity',
    text: 'Proactive protection for your digital assets.',
    icon: 'lock',
  },
  {
    title: 'Enterprise Application Services',
    text: 'Custom applications built for real business needs.',
    icon: 'server',
  },
  {
    title: 'IT Consulting & Support',
    text: 'Expert guidance for long-term sustainable success.',
    icon: 'compass',
  },
];

const defaultServices = [
  {
    title: 'Enterprise Network Solutions',
    description: 'Secure, scalable and reliable network infrastructure to keep your business connected.',
    icon: 'network',
  },
  {
    title: 'Cybersecurity Services',
    description: 'Protect your business from evolving cybersecurity threats.',
    icon: 'shield',
  },
  {
    title: 'Data Center Solutions',
    description: 'Optimize and modernize your data center infrastructure.',
    icon: 'database',
  },
  {
    title: 'Managed IT Services',
    description: 'Proactive monitoring and support for seamless operations.',
    icon: 'server',
  },
  {
    title: 'Cloud Solutions',
    description: 'Flexible, scalable and secure cloud platforms.',
    icon: 'cloud',
  },
  {
    title: 'IT Consulting',
    description: 'Strategic guidance for long-term growth and success.',
    icon: 'users',
  },
];

const defaultPartners = [
  { name: 'Microsoft' },
  { name: 'AWS' },
  { name: 'Cisco' },
  { name: 'Dell' },
  { name: 'VMware' },
  { name: 'Fortinet' },
];

const defaultFeaturedLeader = {
  name: 'Mr. Vineet Mohan',
  designation: 'Director',
  bio: '25+ Years of Experience in IT, Telecom, Retail, Healthcare, Manufacturing, and more.',
  photo: '/vinit.jpeg',
  linkedin: 'https://www.linkedin.com/in/vineet-mohan-98a0041a/',
};

export default async function Home() {
  const [c, team, services, partners, s, faqs, faqContent, testimonials, testimonialContent, partnersContent, highlightsContent] = await Promise.all([
    get('/content/home', {} as any),
    get('/team', [] as any[]),
    get('/services', [] as any[]),
    get('/partners', [] as any[]),
    get('/content/settings', {} as any),
    get('/faqs?page=home', [] as any[]),
    get('/content/faq', {} as any),
    get('/testimonials?page=home', [] as any[]),
    get('/content/testimonials', {} as any),
    get('/content/partners', {} as any),
    get('/content/highlights', {} as any),
  ]);

  const h = c.hero || {};
  const ab = c.about || {};
  const si = c.servicesIntro || {};
  const li = c.leadershipIntro || {};
  const cc = c.contactCta || {};

  const heroTitle = h.title !== undefined && h.title !== '' ? h.title : 'Transform. Secure. Automate.';
  const heroHighlight = h.highlight !== undefined && h.highlight !== '' ? h.highlight : 'Scale.';

  const phone = s.phone || '+91 9350183663';
  const email = s.email || 'vineet.mohan@netverge.tech';
  const address =
    s.address ||
    'Plot No. 502, Tower B 2, Tulip Violet, Badshahpur, Sector-69, Gurugram, Haryana, 122101, India';

  const rawBadges = Array.isArray(c.badges) && c.badges.length > 0 ? c.badges : defaultBadges;
  const badges = rawBadges.map((b: any, idx: number) => ({
    ...b,
    icon: b.icon || (idx === 0 ? 'shield' : idx === 1 ? 'cloud' : 'zap'),
  }));

  const aboutCards =
    Array.isArray(ab.features) && ab.features.length > 0 ? ab.features : defaultAboutCards;

  const activeServices =
    Array.isArray(services) && services.length > 0
      ? services.filter((svc: any) => svc.isActive !== false).slice(0, 6)
      : defaultServices;

  const featuredLeader =
    Array.isArray(team) && team.length > 0
      ? team.find((m: any) => m.featured && m.isActive !== false) ||
        team.find((m: any) => m.isActive !== false) ||
        team[0]
      : defaultFeaturedLeader;

  const titleWords = String(heroTitle).trim().split(/\s+/);

  const activePartners =
    Array.isArray(partners) && partners.length > 0
      ? partners.filter((p: any) => p.isActive !== false)
      : defaultPartners;
  const otherLeaders = (Array.isArray(team) ? team : [])
    .filter((m: any) => m.isActive !== false && m._id && m._id !== (featuredLeader as any)._id)
    .slice(0, 3);

  return (
    <>
      {/* ═══════════════════ 1. HERO ═══════════════════ */}
<section className="relative isolate flex min-h-[calc(100svh-72px)] items-end overflow-hidden bg-[#030B1E] text-white lg:items-center h-screen rounded-b-[42px]">
        {/* Background photo: zoom-out on load, then slow drift */}
        <img
          src={h.bgImage ? img(h.bgImage) : '/images/landing-hero-bg.png'}
          alt=""
          aria-hidden="true"
          className="hero-bg-zoom absolute -z-30 select-none object-cover max-lg:inset-x-0 max-lg:top-0 max-lg:h-[58%] max-lg:w-full max-lg:object-[82%_center] lg:inset-0 lg:h-full lg:w-full lg:object-center"
        />

        {/* Blue gradient */}
        <div className="hero-fade-in absolute inset-0 -z-10 bg-[linear-gradient(90deg,#030B1E_0%,rgba(7,28,66,0.94)_26%,rgba(10,44,96,0.62)_50%,rgba(10,44,96,0.16)_72%,transparent_100%)] max-lg:bg-[linear-gradient(0deg,#030B1E_0%,rgba(7,28,66,0.96)_40%,rgba(10,44,96,0.35)_62%,transparent_88%)]" />

        {/* Floating glows & accents (desktop) */}
        <div className="hero-float pointer-events-none absolute -left-32 top-1/3 -z-10 hidden h-[520px] w-[520px] rounded-full bg-[#1D6FE0]/25 blur-[130px] lg:block" />
        <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-1/2 bg-[radial-gradient(ellipse_at_10%_25%,rgba(56,189,248,0.2),transparent_60%)] lg:block" />
        <div className="hero-float2 pointer-events-none absolute -left-20 top-1/4 -z-10 hidden h-72 w-36 -skew-x-[30deg] bg-gradient-to-b from-[#FF6B00]/40 to-transparent blur-md lg:block" />
        <div className="hero-float pointer-events-none absolute -left-24 top-[58%] -z-10 hidden h-56 w-32 -skew-x-[30deg] bg-gradient-to-b from-[#FF6B00]/25 to-transparent blur-md lg:block" />

        <div className="container-x relative z-10 w-full pb-20 pt-[34svh] sm:pt-[40svh] lg:py-24">
          <div className="max-w-3xl">
            {/* Eyebrow glass chip */}
            <span
              style={{ animationDelay: '300ms' }}
              className="hero-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF6B00] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl sm:px-4 sm:text-xs"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B00] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6B00] shadow-[0_0_10px_#FF6B00]" />
              </span>
              {h.eyebrow || 'Your Trusted Technology Partner'}
            </span>

            {/* Heading: word-by-word masked reveal + shimmering highlight */}
            <h1
              aria-label={`${heroTitle} ${heroHighlight || ''}`.trim()}
              className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] sm:text-6xl lg:mt-8 lg:whitespace-nowrap lg:text-7xl"
            >
              {titleWords.map((word: string, i: number) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
                >
                  <span className="hero-word inline-block" style={{ animationDelay: `${500 + i * 130}ms` }}>
                    {word}
                  </span>
                </span>
              ))}
              <br/>
              {heroHighlight && (
                <span aria-hidden="true" className="relative">
                  <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                    <span
                      className="hero-word inline-block"
                      style={{ animationDelay: `${500 + titleWords.length * 130}ms` }}
                    >
                      <span className="hero-shimmer-text">{heroHighlight}</span>
                    </span>
                  </span>
                  <span
                    style={{ animationDelay: `${900 + titleWords.length * 130}ms` }}
                    className="hero-underline absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FFA24D] to-transparent"
                  />
                </span>
              )}
            </h1>

            {/* Subtitle */}
            <p
              style={{ animationDelay: '1000ms' }}
              className="hero-fade-up mt-4 max-w-lg text-sm leading-relaxed text-slate-200 sm:mt-6 sm:text-base"
            >
              {h.subtitle ||
                'Your trusted partner in Digital Transformation, Cybersecurity, and Enterprise Application Services.'}
            </p>

            {/* Buttons */}
            <div
              style={{ animationDelay: '1200ms' }}
              className="hero-fade-up mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4"
            >
              <Link
                href={h.primaryCta?.href || '/services'}
                className="hero-btn inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 ring-1 ring-white/25 transition-all hover:-translate-y-0.5 hover:shadow-orange-500/50 sm:px-8 sm:py-3.5"
              >
                {h.primaryCta?.label || 'Our Services'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={h.secondaryCta?.href || '/contact'}
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/[0.15] sm:px-8 sm:py-3.5"
              >
                {h.secondaryCta?.label || 'Contact Us'}
              </Link>
            </div>

            {/* Badges: bar fades in, each badge pops in one by one */}
            <div
              style={{ animationDelay: '1400ms' }}
              className="hero-fade-up mt-8 grid grid-cols-3 gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:mt-12 sm:inline-flex sm:items-center sm:gap-0 sm:px-6 sm:py-4"
            >
              {badges.map((b: any, idx: number) => (
                <div
                  key={idx}
                  style={{ animationDelay: `${1600 + idx * 160}ms` }}
                  className={`hero-pop flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-3 sm:px-5 sm:text-left ${
                    idx === 0 ? 'sm:pl-0' : 'sm:border-l sm:border-white/15'
                  } ${idx === badges.length - 1 ? 'sm:pr-0' : ''}`}
                >
                  <span className="hero-icon-bob shrink-0" style={{ animationDelay: `${idx * 400}ms` }}>
                    <Icon name={b.icon || 'shield'} className="h-6 w-6 text-[#FF6B00] sm:h-8 sm:w-8" />
                  </span>
                  <div>
                    <h4 className="text-[10px] font-bold leading-tight text-white sm:text-xs">{b.title}</h4>
                    <p className="mt-0.5 hidden text-[11px] text-slate-300 sm:block">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tilted script text (desktop only): outer keeps the tilt, inner animates */}
        <div className="pointer-events-none absolute right-6 top-16 z-20 hidden -rotate-[10deg] select-none text-center lg:block xl:right-16">
          <div style={{ animationDelay: '1700ms' }} className="hero-fade-up">
            <span className="block font-serif text-xl italic text-white drop-shadow-md">Innovative</span>
            <span className="block font-serif text-xl italic text-white drop-shadow-md">Technology</span>
            <span className="block font-serif text-xl italic text-white drop-shadow-md">Real Impact</span>
            <svg viewBox="0 0 160 24" className="mx-auto mt-1 h-5 w-40" fill="none">
              <path d="M4 18 Q80 -2 156 8" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Scroll down indicator with ping ring */}
        <a
          href="#about"
          aria-label="Scroll down"
          style={{ animationDelay: '2000ms' }}
          className="hero-fade-in absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/80 transition-colors hover:text-[#FF6B00] lg:bottom-8"
        >
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] sm:block">Scroll</span>
          <span className="hero-ping relative flex h-9 w-9 animate-bounce items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
            <ChevronDown className="h-5 w-5" />
          </span>
        </a>
      </section>

      {/* ═══════════════════ 2. ABOUT NETVERGE ═══════════════════ */}
<section
        id="about"
        className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white py-20 lg:py-28 border-b border-slate-200"
      >
        {/* Decorative background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FF6B00]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#0284C7]/10 blur-3xl" />

        <div className="container-x relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Left Column */}
            <Reveal direction="left" className="lg:col-span-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
                {ab.eyebrow || 'ABOUT NETVERGE'}
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] leading-[1.15]">
                {ab.title || 'About NetVerge'} <br />
                {ab.highlight && (
                  <span className="relative inline-block text-[#FF6B00]">
                    {ab.highlight}
                    <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF6B00]/0" />
                  </span>
                )}
              </h2>

              <p className="mt-6 text-sm sm:text-base text-slate-700 leading-relaxed">
                {ab.text ||
                  'NetVerge Technologies is your trusted partner in Digital Transformation, Cybersecurity, and Enterprise Application Services.'}
              </p>
              <p className="mt-3 border-l-2 border-[#0284C7]/40 pl-4 text-sm text-slate-600 leading-relaxed">
                {ab.subtext ||
                  'With a customer-first mindset, deep technical expertise, and strong business acumen, we deliver tailored solutions that solve complex challenges and drive meaningful outcomes.'}
              </p>

              <div className="mt-8">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>

            {/* Center Column */}
            <Reveal delay={150} className="lg:col-span-4 relative flex items-center justify-center">
              <div className="relative w-full px-3 pb-6 pt-3">
                {/* Offset accent frame */}
                <div
                  aria-hidden
                  className="absolute -left-0 -top-0 h-full w-full translate-x-0 rounded-3xl border-2 border-[#FF6B00]/30"
                  style={{ transform: 'translate(-6px, -6px)' }}
                />
                <div aria-hidden className="absolute -right-2 -bottom-2 h-24 w-24 rounded-2xl bg-gradient-to-br from-[#0284C7]/20 to-transparent" />

                <div className="group relative overflow-hidden rounded-3xl border border-white bg-white shadow-2xl shadow-slate-900/10">
                  <img
                    src={ab.image ? img(ab.image) : '/images/team_meeting.jpg'}
                    alt="NetVerge Team Collaboration"
                    className="h-[22rem] w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                </div>

                {/* Floating badge: bottom right */}
                <div className="absolute -bottom-2 right-0 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284C7] to-sky-400 text-white shadow-md shadow-sky-500/30">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-none">Digital Solutions</p>
                    <p className="mt-1 text-[10px] text-slate-500 leading-none">for a Smarter Tomorrow</p>
                  </div>
                </div>

                {/* Floating badge: top left */}
                <div className="absolute left-0 top-8 hidden items-center gap-2 rounded-full border border-orange-100 bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur sm:flex">
                  <span className="h-2 w-2 rounded-full bg-[#FF6B00]" />
                  <span className="text-[11px] font-semibold text-slate-800">Customer-First</span>
                </div>
              </div>
            </Reveal>

            {/* Right Column: feature cards */}
            <div className="lg:col-span-4 space-y-4">
              {aboutCards.map((card: any, idx: number) => (
                <Reveal key={idx} direction="right" delay={idx * 120}>
                  <div className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0284C7]/40 hover:shadow-xl hover:shadow-sky-900/5">
                    {/* Accent bar */}
                    <span className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-gradient-to-b from-[#FF6B00] to-[#0284C7] transition-transform duration-300 group-hover:scale-y-100" />

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-sky-100 text-[#0284C7] border border-blue-100 transition-all duration-300 group-hover:from-[#0284C7] group-hover:to-sky-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-sky-500/30">
                      <Icon name={card.icon || 'laptop'} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-[#0284C7]">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">{card.text}</p>
                    </div>
                    <span className="ml-auto self-start text-[11px] font-bold text-slate-200 transition-colors group-hover:text-[#FF6B00]/60">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Company highlights strip (dynamic: Admin > Highlights Strip) */}
          <HighlightsStrip content={highlightsContent} className="mt-14" />
        </div>
      </section>

      {/* ═══════════════════ 3. SERVICES ═══════════════════ */}
<section className="relative overflow-hidden bg-[#070D19] py-20 lg:py-28 text-white">
        {/* Background: grid + glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/15 blur-[130px]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="container-x relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Left Column */}
            <Reveal direction="left" className="lg:col-span-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
                {si.eyebrow || 'OUR SERVICES'}
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem] leading-[1.15]">
                {si.title || 'Comprehensive IT Solutions'} <br />
                {si.highlight && (
                  <span className="bg-gradient-to-r from-[#FF6B00] to-[#FFA24D] bg-clip-text text-transparent">
                    {si.highlight}
                  </span>
                )}
              </h2>

              <p className="mt-6 border-l-2 border-[#FF6B00]/50 pl-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                {si.text ||
                  'We provide end-to-end technology solutions to help businesses stay secure, agile, and ahead in a digital-first world.'}
              </p>

              <div className="mt-8">
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
                >
                  Explore All Services
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>

            {/* Right Column: cards grid */}
            <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeServices.map((service: any, idx: number) => {
                const isOrangeAccent = idx % 2 === 0;
                return (
                  <Reveal key={service._id || idx} delay={(idx % 3) * 120} className="h-full">
                    <Link
                      href={service.slug ? `/services/${service.slug}` : '/services'}
                      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0F1A30] to-[#0A1223] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                        isOrangeAccent
                          ? 'hover:border-[#FF6B00]/50 hover:shadow-orange-500/10'
                          : 'hover:border-[#0284C7]/60 hover:shadow-sky-500/10'
                      }`}
                    >
                      {/* Hover glow */}
                      <div
                        aria-hidden
                        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${
                          isOrangeAccent ? 'bg-[#FF6B00]/25' : 'bg-[#0284C7]/30'
                        }`}
                      />
                      {/* Top accent line */}
                      <span
                        className={`absolute left-0 top-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${
                          isOrangeAccent
                            ? 'bg-gradient-to-r from-[#FF6B00] to-transparent'
                            : 'bg-gradient-to-r from-[#0284C7] to-transparent'
                        }`}
                      />

                      <div className="relative">
                        <div className="mb-4 flex items-start justify-between">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 ${
                              isOrangeAccent
                                ? 'bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/25 group-hover:bg-[#FF6B00] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/25 group-hover:bg-[#0284C7] group-hover:text-white group-hover:shadow-lg group-hover:shadow-sky-500/30'
                            }`}
                          >
                            <Icon name={service.icon || 'network'} className="h-5 w-5" />
                          </div>
                          <span className="text-[11px] font-bold tracking-wider text-white/15 transition-colors group-hover:text-white/40">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h3
                          className={`text-sm font-bold text-white transition-colors leading-snug ${
                            isOrangeAccent ? 'group-hover:text-[#FF8A33]' : 'group-hover:text-sky-300'
                          }`}
                        >
                          {service.title}
                        </h3>
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>

                      <div className="relative mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-[11px] font-semibold text-slate-500 transition-colors group-hover:text-slate-300">
                          Learn more
                        </span>
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all duration-300 group-hover:text-white ${
                            isOrangeAccent
                              ? 'group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00]'
                              : 'group-hover:border-[#0284C7] group-hover:bg-[#0284C7]'
                          }`}
                        >
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. LEADERSHIP (own section) ═══════════════════ */}
      <LightSection glow="right">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal direction="left" className="lg:col-span-5">
            <Eyebrow>{li.eyebrow || 'OUR LEADERSHIP'}</Eyebrow>
            <SectionTitle title={li.title || 'Experienced Leaders.'} highlight={li.highlight} />
            <Lead>
              {li.text ||
                'Our leadership team brings decades of industry experience, innovation, and a passion for building technology solutions that make a real difference.'}
            </Lead>
            <div className="mt-8">
              <Link
                href="/leadership"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
              >
                Explore Our Team
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <Reveal direction="right" delay={150} className="lg:col-span-7">
            {/* Featured leader */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 sm:p-7">
              <span className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#FF6B00] via-[#FF8A33] to-[#0284C7]" />
              <div aria-hidden className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-[#0284C7]/10 via-sky-50/60 to-transparent" />
              <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <div className="relative w-44 shrink-0">
                  <div aria-hidden className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl border-2 border-[#FF6B00]/40" />
                  <div className="relative h-52 w-full overflow-hidden rounded-2xl border-4 border-white bg-slate-200 shadow-xl">
                    <img
                      src={featuredLeader.photo ? img(featuredLeader.photo) : '/vinit.jpeg'}
                      alt={featuredLeader.name}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-extrabold text-slate-900">{featuredLeader.name}</h3>
                  <span className="mt-2 inline-block rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0284C7]">
                    {featuredLeader.designation}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{featuredLeader.bio}</p>
                  {featuredLeader.linkedin && featuredLeader.linkedin !== '#' && (
                    <a
                      href={featuredLeader.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${featuredLeader.name} LinkedIn Profile`}
                      className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2] text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      in
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Rest of the leadership team */}
            {otherLeaders.length > 0 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {otherLeaders.map((m: any, i: number) => (
                  <Link
                    key={m._id}
                    href="/leadership"
                    className={`group flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                      i % 2 === 0 ? 'hover:border-[#FF6B00]/40' : 'hover:border-[#0284C7]/40'
                    }`}
                  >
                    <img
                      src={m.photo ? img(m.photo) : '/vinit.jpeg'}
                      alt={m.name}
                      className="h-12 w-12 shrink-0 rounded-full border-2 border-white object-cover object-top shadow"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{m.name}</p>
                      <p className="truncate text-[11px] font-semibold text-[#FF6B00]">{m.designation}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </LightSection>

      {/* ═══════════════════ 5. PARTNERS (own full-width section) ═══════════════════ */}
      <PartnersSection partners={activePartners} content={partnersContent} />

      {/* ═══════════════════ 6. TESTIMONIALS (dynamic) ═══════════════════ */}
      <TestimonialsSection items={testimonials} content={testimonialContent} variant="light" />

      {/* ═══════════════════ 7. FAQ (dynamic) ═══════════════════ */}
      <FaqSection items={faqs} content={faqContent} glow="right" />
    </>
  );
}