import { get, img } from '@/lib/api';
import { PageHero } from '@/components/ui';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Navigation,
  Clock,
  ArrowUpRight,
  ChevronDown,
  Headphones,
  Zap,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Plus
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import FaqSection from '@/components/FaqSection';
import TestimonialsSection from '@/components/testimonials-section';
import { CtaBanner, Eyebrow, LightSection, Lead, SectionTitle } from '@/components/sections';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Contact Us | NetVerge Technologies' };

export default async function Contact() {
  const [c, s, faqs, faqContent, testimonials, testimonialContent] = await Promise.all([
    get('/content/contact', {} as any),
    get('/content/settings', {} as any),
    get('/faqs?page=contact', [] as any[]),
    get('/content/faq', {} as any),
    get('/testimonials?page=contact', [] as any[]),
    get('/content/testimonials', {} as any),
  ]);

  const h = c?.hero || {};
  const phone = s.phone || '+91 98815 86360';
  const email = s.email || 'vineet.mohan@netverge.tech';
  const address =
    s.address ||
    'Plot No. 502, Tower B 2, Tulip Violet, Badshahpur, Sector-69, Gurugram, Haryana, 122101, India';
  const hours = s.hours || 'Mon - Fri: 9:00 AM - 6:00 PM';
  const social = s.social || {};
  const telHref = `tel:${String(phone).replace(/[^\d+]/g, '')}`;
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  const socials = [
    { key: 'linkedin', href: social.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { key: 'x', href: social.x || social.twitter, label: 'Twitter / X', Icon: Twitter },
    { key: 'facebook', href: social.facebook, label: 'Facebook', Icon: Facebook },
    { key: 'instagram', href: social.instagram, label: 'Instagram', Icon: Instagram },
  ].filter((i) => i.href);

  const quick = [
    {
      Icon: Phone,
      label: 'Call us',
      value: phone,
      sub: hours,
      href: telHref,
      cta: 'Call now',
    },
    {
      Icon: Mail,
      label: 'Email us',
      value: email,
      sub: "We'll respond within 24 hours",
      href: `mailto:${email}`,
      cta: 'Send email',
    },
    {
      Icon: MapPin,
      label: 'Visit us',
      value: 'Gurugram, Haryana',
      sub: 'Sector-69, Badshahpur',
      href: mapsHref,
      cta: 'Get directions',
    },
  ];

  const perks = [
    { Icon: Zap, title: 'Fast response', text: 'Replies within 24 hours' },
    { Icon: Headphones, title: 'Dedicated support', text: 'Real people, not bots' },
    { Icon: ShieldCheck, title: 'Your data is safe', text: 'Never shared or sold' },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          1. CONTACT HERO BANNER
          ═══════════════════════════════════════════════════════════════════ */}
      <PageHero
        bgImage={h.image ? img(h.image) : '/images/contact_banner.jpg'}
        eyebrow={h.eyebrow || 'CONTACT US'}
        title={h.title || 'Get In Touch'}
        highlight={h.highlight}
        text={
          h.text ||
          "We'd love to hear from you. Whether you have a project in mind, need support, or just want to say hello, we're here for you."
        }
        crumb="Contact"
      />

      {/* ═══════════════════════════════════════════════════════════════════
          2. QUICK CONTACT CARDS (overlapping the hero)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-white mt-20">
        <div className="container-x">
          <div className="-mt-10 grid gap-4 sm:-mt-14 md:grid-cols-3">
            {quick.map(({ Icon, label, value, sub, href, cta }) => (
              <a
                key={label}
                href={href}
                target={label === 'Visit us' ? '_blank' : undefined}
                rel={label === 'Visit us' ? 'noreferrer' : undefined}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FFDEC4] hover:shadow-xl"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#FF6B00] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#FFDEC4] bg-[#FFF5ED] text-[#FF6B00] transition-colors group-hover:bg-[#FF6B00] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-[#FF6B00]" />
                </div>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {label}
                </p>
                <p className="mt-1 break-words text-base font-bold text-slate-900">{value}</p>
                <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B00]">
                  {cta}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. MAIN CONTACT SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <LightSection glow="right">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            {/* Left: Information Column */}
            <div className="lg:col-span-5">
              <Eyebrow>{c?.info?.eyebrow || "Let's talk"}</Eyebrow>
              <SectionTitle title={c?.info?.title || 'Contact'} highlight={c?.info?.highlight || 'Information'} breakLine={false} />
              <Lead>
                {c?.info?.text ||
                  'Reach out through any channel below, or fill in the form and our team will get back to you with the right answers.'}
              </Lead>

              <div className="mt-8 space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FFDEC4] bg-[#FFF5ED] text-[#FF6B00]">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <a
                      href={telHref}
                      className="block text-sm font-bold text-slate-900 transition-colors hover:text-[#FF6B00]"
                    >
                      {phone}
                    </a>
                    <p className="mt-0.5 text-xs text-slate-500">{hours}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FFDEC4] bg-[#FFF5ED] text-[#FF6B00]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <a
                      href={`mailto:${email}`}
                      className="block break-all text-sm font-bold text-slate-900 transition-colors hover:text-[#FF6B00]"
                    >
                      {email}
                    </a>
                    <p className="mt-0.5 text-xs text-slate-500">{"We'll respond within 24 hours"}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FFDEC4] bg-[#FFF5ED] text-[#FF6B00]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <p className="max-w-sm text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">
                    {address}
                  </p>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FFDEC4] bg-[#FFF5ED] text-[#FF6B00]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Working Hours</p>
                    <p className="mt-0.5 text-xs text-slate-500">{hours}</p>
                  </div>
                </div>
              </div>

              {/* Perks */}
              <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {perks.map(({ Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <Icon className="h-4 w-4 text-[#FF6B00]" />
                    <p className="mt-2 text-xs font-bold text-slate-900">{title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{text}</p>
                  </div>
                ))}
              </div>

              {/* Follow Us */}
              <div className="mt-10 border-t border-slate-100 pt-6">
                <p className="mb-3 text-xs font-semibold text-slate-600">Follow us</p>
                <div className="flex gap-2.5">
                  {socials.map(({ key, href, label, Icon }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-[#FF6B00] hover:bg-[#FFF5ED] hover:text-[#FF6B00]"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                  {socials.length === 0 && (
                    <span className="text-xs text-slate-400">
                      Social channels configured in admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Form Card */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-9">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF6B00] to-[#FFB27A]" />
                <h3 className="text-lg font-bold text-slate-900">Send Us a Message</h3>
                <p className="mb-6 mt-1 text-xs text-slate-500">
                  Fill in the details below and we&apos;ll get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
      </LightSection>

      {/* ═══════════════════════════════════════════════════════════════════
          4. OUR LOCATION MAP SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <LightSection glow="left" className="!py-16 lg:!py-20">
          <div className="mb-10 text-center">
            <Eyebrow>{c?.map?.eyebrow || 'Find us'}</Eyebrow>
            <SectionTitle title={c?.map?.title || 'Our'} highlight={c?.map?.highlight || 'Location'} breakLine={false} />
          </div>

          {s.mapEmbedUrl ? (
            <div className="relative h-80 overflow-hidden rounded-2xl border border-slate-200 shadow-lg shadow-slate-900/5 sm:h-96">
              <iframe
                src={s.mapEmbedUrl}
                title="NetVerge Technologies location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 max-w-xs rounded-xl border border-slate-200/90 bg-white/95 p-4 shadow-lg backdrop-blur-md">
                <p className="text-xs font-medium leading-relaxed text-slate-700">{address}</p>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[#070D19] px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#FF6B00]"
                >
                  <Navigation className="h-3 w-3" />
                  Get Directions
                </a>
              </div>
            </div>
          ) : (
            <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#E8ECEF] shadow-lg shadow-slate-900/5 sm:h-80">
              <svg
                className="absolute inset-0 h-full w-full opacity-60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="city-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#CBD5E1" strokeWidth="1" />
                    <circle cx="25" cy="25" r="1.5" fill="#94A3B8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="#F1F5F9" />
                <rect width="100%" height="100%" fill="url(#city-grid)" />
                <path d="M -50 180 Q 250 140 800 220" stroke="#FFFFFF" strokeWidth="16" fill="none" />
                <path d="M -50 180 Q 250 140 800 220" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                <path d="M 400 -50 L 340 380" stroke="#FFFFFF" strokeWidth="20" fill="none" />
                <path d="M 400 -50 L 340 380" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                <rect x="120" y="40" width="140" height="90" rx="10" fill="#DCFCE7" opacity="0.7" />
                <text x="140" y="85" fill="#15803D" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                  Gurugram
                </text>
              </svg>

              {/* Pin Marker with pulse */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="absolute -top-1 h-8 w-8 animate-ping rounded-full bg-[#FF6B00]/30" />
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6B00] text-white shadow-md">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="mt-1 h-2 w-6 rounded-full bg-slate-400/40 blur-xs" />
              </div>

              {/* Floating Location Card */}
              <div className="absolute bottom-5 right-5 z-10 max-w-sm rounded-xl border border-slate-200/90 bg-white/95 p-4 shadow-lg backdrop-blur-md sm:bottom-6 sm:right-6 sm:p-5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  OUR LOCATION
                </span>
                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-700">{address}</p>
                <div className="mt-3">
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#070D19] px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#FF6B00]"
                  >
                    <Navigation className="h-3 w-3" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          )}
      </LightSection>

      {/* ═══════════════════════════════════════════════════════════════════
          5. TESTIMONIALS + FAQ SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <TestimonialsSection items={testimonials} content={testimonialContent} variant="dark" />
      <FaqSection items={faqs} content={faqContent} glow="left" />

      {/* ═══════════════════════════════════════════════════════════════════
          6. CTA BANNER
          ═══════════════════════════════════════════════════════════════════ */}
      <CtaBanner
        eyebrow={c?.cta?.eyebrow || 'PREFER TO TALK?'}
        title={c?.cta?.title || 'Prefer to talk it through?'}
        text={c?.cta?.text || `Give us a call and speak directly with our team. We're available ${hours}.`}
        buttonText={`Call ${phone}`}
        href={telHref}
        secondary={
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.08] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/[0.15]"
          >
            <Mail className="h-4 w-4" />
            Email us
          </a>
        }
      />
    </>
  );
}
