import Link from 'next/link';
import { Linkedin, Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import NetVergeLogo from './NetVergeLogo';
import { img } from '@/lib/api';

const quickLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Leadership', '/leadership'],
  ['Contact', '/contact'],
];

const defaultServiceLinks = [
  'Enterprise Network Solutions',
  'Cybersecurity Services',
  'Data Center Solutions',
  'Managed IT Services',
  'Cloud Solutions',
];

export default function Footer({
  settings: s,
  services,
}: {
  settings: any;
  services?: any[];
}) {
  const phone = s?.phone || '+91 98815 86360';
  const email = s?.email || 'vineet.mohan@netverge.tech';
  const address =
    s?.address ||
    'Plot No 502, Tower B 2, Tulip Violet, Badshahpur, Sector-69, Gurugram, Haryana, 122101, India';
  const footerText =
    s?.footerText ||
    'Building secure, scalable and intelligent technology solutions for a better tomorrow.';
  const social = s?.social || {};

  const serviceNames =
    Array.isArray(services) && services.length > 0
      ? services.filter((svc: any) => svc.isActive !== false).slice(0, 5).map((svc: any) => ({ name: svc.title, href: svc.slug ? `/services/${svc.slug}` : '/services' }))
      : defaultServiceLinks.map((name: string) => ({ name, href: '/services' }));

  return (
    <footer className="bg-[#070D19] text-slate-300 border-t border-white/10">
      {/* Main Footer Content */}
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 border-b border-white/10">
        {/* Column 1: Brand (4 cols) */}
        <div className="lg:col-span-4">
          <Link href="/" className="inline-block">
            {s?.logo ? (
              <img
                src={img(s.logo)}
                alt={s?.companyName || 'NetVerge'}
                className="h-8 max-w-[180px] object-contain"
              />
            ) : (
              <NetVergeLogo variant="dark" />
            )}
          </Link>
          <p className="mt-5 text-sm leading-relaxed text-slate-400 max-w-sm">
            {footerText}
          </p>

          {/* Social Links */}
          <div className="mt-6 flex items-center gap-2.5">
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-[#FF6B00] hover:text-white transition-all duration-200"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {(social.x || social.twitter) && (
              <a
                href={social.x || social.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-[#FF6B00] hover:text-white transition-all duration-200"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-[#FF6B00] hover:text-white transition-all duration-200"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-[#FF6B00] hover:text-white transition-all duration-200"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {!social.linkedin && !(social.x || social.twitter) && !social.facebook && !social.instagram && (
              <a
                href="https://www.linkedin.com/in/vineet-mohan-8650674"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-[#FF6B00] hover:text-white transition-all duration-200"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Quick Links (2 cols) */}
        <div className="lg:col-span-2">
          <h4 className="mb-5 text-sm font-semibold tracking-wider text-white">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {quickLinks.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-slate-400 hover:text-[#FF6B00] transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Our Services (3 cols) */}
        <div className="lg:col-span-3">
          <h4 className="mb-5 text-sm font-semibold tracking-wider text-white">Our Services</h4>
          <ul className="space-y-3 text-sm">
            {serviceNames.map(({ name, href }: { name: string; href: string }) => (
              <li key={name}>
                <Link
                  href={href}
                  className="text-slate-400 hover:text-[#FF6B00] transition-colors duration-200"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact With Us (3 cols) */}
        <div className="lg:col-span-3">
          <h4 className="mb-5 text-sm font-semibold tracking-wider text-white">Contact With Us</h4>
          <ul className="space-y-3.5 text-xs sm:text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#FF6B00]/10 text-[#FF6B00]">
                <Phone className="h-3.5 w-3.5" />
              </span>
              <span className="text-slate-400 font-medium">{phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#FF6B00]/10 text-[#FF6B00]">
                <Mail className="h-3.5 w-3.5" />
              </span>
              <a
                href={`mailto:${email}`}
                className="text-slate-400 hover:text-[#FF6B00] transition-colors break-all"
              >
                {email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#FF6B00]/10 text-[#FF6B00]">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              <span className="text-slate-400 leading-relaxed text-xs">
                {address}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} {s?.companyName || 'NetVerge Technologies (OPC) Pvt. Ltd.'}. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/contact" className="hover:text-[#FF6B00] transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-700">|</span>
          <Link href="/contact" className="hover:text-[#FF6B00] transition-colors">
            Terms &amp; Conditions
          </Link>
        </div>
      </div>

      {/* Developer credit */}
      <div className="border-t border-white/5">
        <p className="container-x py-4 text-center text-xs text-slate-500">
          Developed by{' '}
          <a
            href="https://wheedletechnologies.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-400 hover:text-[#FF6B00] transition-colors"
          >
            Wheedle Technologies
          </a>
        </p>
      </div>
    </footer>
  );
}