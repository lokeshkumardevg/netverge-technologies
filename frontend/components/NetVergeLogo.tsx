import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export default function NetVergeLogo({
  className = '',
  variant = 'dark',
  showSubtitle = true,
}: LogoProps) {
  const isDark = variant === 'dark';
  // variant="dark" means on a dark/black background -> use white logo
  // variant="light" means on a light/white background -> use dark logo
  const logoSrc = isDark
    ? '/logo.png'
    : '/images/netverge-logo-dark.png';

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="NetVerge Technologies (OPC) Pvt. Ltd."
        className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
      />
    </div>
  );
}
