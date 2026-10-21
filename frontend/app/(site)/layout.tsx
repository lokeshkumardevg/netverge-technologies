import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { get } from '@/lib/api';
import Preloader from "@/components/Preloader";
import ChatWidget from '@/components/chatbot/ChatWidget'; // [CHATBOT]


export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([get('/content/settings', {} as any), get('/services', [] as any[])]);
  return (
    <>
      <Preloader />
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} services={services} />
      <ChatWidget /> {/* [CHATBOT] */}
    </>
  );
}