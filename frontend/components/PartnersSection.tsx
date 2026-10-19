import { BadgeCheck, Layers, Zap } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { PartnerLogoItem } from '@/components/PartnerLogos';
import { DarkSection, Eyebrow, Lead, SectionTitle } from '@/components/sections';

/**
 * Strategic partners — its own full-width section.
 * Partners come from the API (/partners), heading text + the three benefit points from /content/partners:
 *   { eyebrow, title, highlight, text, points: string[] }
 */
const DEFAULT_POINTS = ['Faster delivery', 'Access to specialized expertise', 'Reduced single-vendor dependency'];
const POINT_ICONS = [Zap, BadgeCheck, Layers];

export default function PartnersSection({ partners, content }: { partners?: any[]; content?: any }) {
  const list = (Array.isArray(partners) ? partners : []).filter((p) => p && p.name && p.isActive !== false);
  if (!list.length) return null;
  const c = content || {};
  const points: string[] = (Array.isArray(c.points) ? c.points : DEFAULT_POINTS).filter(Boolean);
  const rows = list.length >= 6 ? [0, 1] : [0];

  return (
    <DarkSection>
      <style>{`
        @keyframes nv-scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes nv-scroll-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .nv-marquee-up { animation: nv-scroll-left 30s linear infinite; }
        .nv-marquee-down { animation: nv-scroll-right 36s linear infinite; }
        .nv-marquee:hover .nv-marquee-up, .nv-marquee:hover .nv-marquee-down { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .nv-marquee-up, .nv-marquee-down { animation: none; flex-wrap: wrap; width: auto; justify-content: center; }
        }
      `}</style>

      <Reveal className="mx-auto max-w-3xl text-center">
        <Eyebrow dark>{c.eyebrow || 'Strategic Partnership'}</Eyebrow>
        <SectionTitle title={c.title || 'Our Strategic'} highlight={c.highlight || 'Partners'} dark breakLine={false} />
        <Lead dark center>
          {c.text ||
            'Our partnerships enable faster delivery, access to specialized expertise, and reduced dependency on single-vendor ecosystems.'}
        </Lead>
      </Reveal>

      {points.length > 0 && (
        <Reveal delay={100} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {points.map((pt, i) => {
            const Ico = POINT_ICONS[i % POINT_ICONS.length];
            return (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur"
              >
                <Ico className={`h-4 w-4 ${i % 2 === 0 ? 'text-[#FF6B00]' : 'text-sky-400'}`} />
                {pt}
              </span>
            );
          })}
        </Reveal>
      )}

      {/* Marquee: two rows moving in opposite directions, fades at the edges, pauses on hover */}
      <Reveal delay={200} className="nv-marquee relative mt-14 space-y-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {rows.map((row) => {
          const items = rows.length === 1 ? list : list.filter((_, i) => i % 2 === row);
          if (!items.length) return null;
          const base = Array.from({ length: Math.max(1, Math.ceil(8 / items.length)) }).flatMap(() => items);
          const track = [...base, ...base];
          return (
            <div key={row} className="overflow-hidden">
              <div className={`flex w-max gap-4 ${row === 0 ? 'nv-marquee-up' : 'nv-marquee-down'}`}>
                {track.map((p, idx) => (
                  <div key={`${p._id || p.name}-${row}-${idx}`} className="w-48 shrink-0">
                    <PartnerLogoItem partner={p} size="lg" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </Reveal>

      <p className="mt-8 text-center text-xs text-slate-500">
        {list.length} strategic technology {list.length === 1 ? 'partner' : 'partners'} across networking, security, cloud, AI and enterprise communication.
      </p>
    </DarkSection>
  );
}
