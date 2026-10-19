import React from 'react';
import { img } from '@/lib/api';

export function MicrosoftLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 21 21">
        <rect x="1" y="1" width="9" height="9" fill="#F25022" />
        <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
        <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
      </svg>
      <span className="font-semibold text-slate-700 text-sm tracking-tight font-sans">Microsoft</span>
    </div>
  );
}

export function AwsLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg className="h-6 w-auto" viewBox="0 0 64 38" fill="none">
        <path d="M19.3 22.8c-2.3 0-4-.6-5.2-1.7-1.2-1.1-1.8-2.7-1.8-4.7 0-2 .6-3.6 1.8-4.7 1.2-1.1 2.9-1.7 5.2-1.7 2.3 0 4 .6 5.2 1.7 1.2 1.1 1.8 2.7 1.8 4.7 0 2-.6 3.6-1.8 4.7-1.2 1.1-2.9 1.7-5.2 1.7zm13.8 0l-5-14.2h3.5l3.2 10.3 3.3-10.3h3.4l-5 14.2h-3.4zm17.6-.2c-1.6 0-3-.3-4.1-1-.5-.3-.9-.7-1.2-1.2l2.6-2.1c.7.8 1.6 1.2 2.7 1.2.9 0 1.5-.2 1.9-.6.4-.4.6-.9.6-1.5 0-.5-.2-.9-.5-1.2-.4-.3-1-.6-2-.8-1.5-.4-2.6-.9-3.3-1.6-.7-.7-1-1.7-1-2.9 0-1.4.5-2.5 1.5-3.3 1-1 2.3-1.4 4-1.4 1.5 0 2.8.3 3.8.9.5.3.9.7 1.2 1.2l-2.5 2.1c-.6-.6-1.4-1-2.4-1-.8 0-1.4.2-1.8.6-.4.4-.6.8-.6 1.4 0 .5.2.9.5 1.2.3.3.9.5 1.9.8 1.6.4 2.8.9 3.5 1.6.7.7 1.1 1.7 1.1 3 0 1.4-.5 2.5-1.5 3.4-1 .9-2.4 1.3-4.2 1.3z" fill="#232F3E"/>
        <path d="M47.7 29.8C38.6 34.6 26.2 35.8 14.7 32c-1.4-.5-1.7-1.8-.6-2.4 9.8-5.3 22.8-5.5 32.7-1.1 1.5.7 1.8 1.8.9 2.3z" fill="#FF9900"/>
        <path d="M50.2 26.5c-1.1-.9-3.6-1.3-5.2-1.1-.5.1-.6-.4-.2-.7 2.6-1.8 6.9-1.3 7.8-.1.9 1.1.2 5.5-2.2 7.6-.4.4-.8.2-.6-.3.6-1.6 1.3-4.6.4-5.4z" fill="#FF9900"/>
      </svg>
    </div>
  );
}

export function CiscoLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg className="h-5 w-auto" viewBox="0 0 70 30" fill="#049FD9">
        <rect x="2" y="14" width="4" height="12" rx="2" />
        <rect x="10" y="8" width="4" height="18" rx="2" />
        <rect x="18" y="14" width="4" height="12" rx="2" />
        <rect x="26" y="2" width="4" height="24" rx="2" />
        <rect x="34" y="8" width="4" height="18" rx="2" />
        <rect x="42" y="2" width="4" height="24" rx="2" />
        <rect x="50" y="14" width="4" height="12" rx="2" />
        <rect x="58" y="8" width="4" height="18" rx="2" />
        <rect x="66" y="14" width="4" height="12" rx="2" />
      </svg>
      <span className="text-[10px] font-black tracking-widest text-[#049FD9] mt-0.5">CISCO</span>
    </div>
  );
}

export function FortinetLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 40 40" fill="#EE3124">
        <rect x="6" y="14" width="8" height="12" rx="1" />
        <rect x="16" y="8" width="8" height="24" rx="1" />
        <rect x="26" y="14" width="8" height="12" rx="1" />
      </svg>
      <span className="font-extrabold text-[#EE3124] text-xs tracking-wider font-sans">FORTINET</span>
    </div>
  );
}

export function DellLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-[#007DB8] text-lg tracking-tighter font-sans italic">DELL</span>
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">Technologies</span>
    </div>
  );
}

export function VmwareLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="font-bold text-slate-700 text-sm tracking-widest font-sans lowercase">vmware</span>
    </div>
  );
}

export function PartnerLogoItem({ partner, size = 'sm' }: { partner: { name: string; logo?: string; url?: string; description?: string }; size?: 'sm' | 'lg' }) {
  const lg = size === 'lg';
  const content = (() => {
    if (partner.logo) {
      return (
        <img
          src={img(partner.logo)}
          alt={partner.name}
          className={lg ? 'max-h-10 max-w-[150px] object-contain' : 'max-h-7 max-w-[110px] object-contain'}
        />
      );
    }
    const n = (partner.name || '').toLowerCase();
    if (n.includes('microsoft')) return <MicrosoftLogo className="scale-90" />;
    if (n.includes('aws') || n.includes('amazon')) return <AwsLogo className="scale-90" />;
    if (n.includes('cisco')) return <CiscoLogo className="scale-90" />;
    if (n.includes('dell')) return <DellLogo className="scale-90" />;
    if (n.includes('vmware')) return <VmwareLogo className="scale-90" />;
    if (n.includes('fortinet')) return <FortinetLogo className="scale-90" />;
    return <span className="font-bold text-slate-700 text-xs tracking-wide">{partner.name}</span>;
  })();

  const body = partner.description ? (
    <div className="flex min-w-0 flex-col items-center justify-center">
      {content}
      <span className={`mt-1 max-w-full truncate font-medium leading-none text-slate-400 ${lg ? 'text-[10px]' : 'text-[8px]'}`}>{partner.description}</span>
    </div>
  ) : (
    content
  );

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noreferrer"
        className={`flex items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-[#FF6B00]/40 ${lg ? 'h-20 px-5' : 'h-14 rounded-lg px-3'}`}
      >
        {body}
      </a>
    );
  }

  return (
    <div title={partner.description ? `${partner.name} — ${partner.description}` : partner.name} className={`flex items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md ${lg ? 'h-20 px-5' : 'h-14 rounded-lg px-3'}`}>
      {body}
    </div>
  );
}
