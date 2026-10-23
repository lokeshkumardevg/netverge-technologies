import './globals.css';
import type { Metadata } from 'next';
import { get } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const s = await get('/content/settings', {} as any);
  const name = s.companyName || 'NetVerge Technologies';
  return {
    title: { default: `${name}${s.tagline ? ' | ' + s.tagline : ''}`, template: `%s | ${name}` },
    description: s.footerText || 'Digital Transformation, Cybersecurity and Enterprise Application Services.',
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <style>{`html:not(.nv-loaded) .nv-site-main *, html:not(.nv-loaded) .nv-site-main *::before, html:not(.nv-loaded) .nv-site-main *::after { animation-play-state: running !important; }`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
