import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { get } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([get('/content/settings', {} as any), get('/services', [] as any[])]);
  return (
    <>
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} services={services} />
    </>
  );
}
