import Link from 'next/link';
import {
  ArrowRight,
  Cloud,
  Cpu,
  Database,
  Network,
  Server,
  ShieldCheck,
  Users,
  Rocket,
  Handshake,
  Lightbulb,
  Target,
  Eye,
  Gem,
  Phone,
  Mail,
  MapPin,
  Laptop,
  Lock,
  Compass,
  Zap,
  TrendingUp,
  Heart,
  Share2,
  Sparkles,
  Award,
} from 'lucide-react';

const icons: Record<string, any> = {
  network: Network,
  shield: ShieldCheck,
  database: Database,
  server: Server,
  cloud: Cloud,
  users: Users,
  rocket: Rocket,
  handshake: Handshake,
  idea: Lightbulb,
  target: Target,
  eye: Eye,
  gem: Gem,
  phone: Phone,
  mail: Mail,
  pin: MapPin,
  laptop: Laptop,
  lock: Lock,
  compass: Compass,
  zap: Zap,
  trend: TrendingUp,
  heart: Heart,
  share: Share2,
  sparkles: Sparkles,
  award: Award,
};

export const Icon = ({ name, className = 'h-6 w-6' }: { name?: string; className?: string }) => {
  const key = (name || '').toLowerCase();
  const C = icons[key] || Cpu;
  return <C className={className} />;
};

/** Title with an orange highlighted tail word(s). */
export const Hl = ({ text, hl }: { text?: string; hl?: string }) => (
  <>
    {text}{' '}
    {hl && (
      <span className="text-[#FF6B00]">
        {hl}
      </span>
    )}
  </>
);

export function PageHero({
  eyebrow,
  title,
  highlight,
  text,
  crumb,
  parent,
  bgImage,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  text?: string;
  crumb?: string;
  parent?: { label: string; href: string };
  bgImage?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#070D19] text-white py-16 sm:py-24">
      {/* Background Image with Dark Vignette Overlay */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt="Hero Background"
            className="h-full w-full object-cover object-center opacity-30"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-[#070D19] via-[#070D19]/80 to-[#070D19]/60" /> */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-[#070D19] via-transparent to-transparent" /> */}
        </div>
      )}

      {/* Decorative Glows */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="pointer-events-none absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-[#FF6B00]/10 blur-[100px]" />

      <div className="container-x relative z-10">
        {eyebrow && (
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#FF6B00] flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#FF6B00] inline-block" />
            {eyebrow}
          </div>
        )}

        <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight text-white">
          <Hl text={title} hl={highlight} />
        </h1>

        {text && (
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {text}
          </p>
        )}

        {crumb && (
          <nav className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            {parent && (
              <>
                <Link href={parent.href} className="hover:text-white transition-colors">
                  {parent.label}
                </Link>
                <span className="text-slate-600">/</span>
              </>
            )}
            <span className="text-slate-200">{crumb}</span>
          </nav>
        )}
      </div>
    </section>
  );
}
