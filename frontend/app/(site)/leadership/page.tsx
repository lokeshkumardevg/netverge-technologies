import { get, img } from '@/lib/api';
import { PageHero } from '@/components/ui';
import Reveal from '@/components/Reveal';
import TestimonialsSection from '@/components/testimonials-section';
import { CtaBanner, Eyebrow, LightSection, Lead, SectionTitle, splitTitle } from '@/components/sections';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Our Leadership | NetVerge Technologies' };

const defaultLeaders = [
  {
    _id: 'l1',
    name: 'Mr. Vineet Mohan',
    designation: 'Director',
    photo: '/vinit.jpeg',
    bio: '25+ Years of Experience in IT, Telecom, Retail, Healthcare, Manufacturing, and more.',
    linkedin: 'https://www.linkedin.com/in/vineet-mohan-98a0041a/',
  },
  {
    _id: 'l2',
    name: 'Ms. Neha Sharma',
    designation: 'Operations Head',
    photo: '/images/neha.jpg',
    bio: 'Expert in process management, client relations and business growth.',
    linkedin: '#',
  },
  {
    _id: 'l3',
    name: 'Mr. Rahul Verma',
    designation: 'CTO',
    photo: '/images/rahul.jpg',
    bio: 'Specialist in cloud architecture, cybersecurity and enterprise solutions.',
    linkedin: '#',
  },
  {
    _id: 'l4',
    name: 'Ms. Pooja Singh',
    designation: 'HR Head',
    photo: '/images/pooja.jpg',
    bio: 'Focused on building strong teams and a positive work culture.',
    linkedin: '#',
  },
];

export default async function Leadership() {
  const [c, team, testimonials, testimonialContent] = await Promise.all([
    get('/content/leadership', {} as any),
    get('/team', [] as any[]),
    get('/testimonials?page=leadership', [] as any[]),
    get('/content/testimonials', {} as any),
  ]);

  const h = c?.hero || {};
  const intro = c?.intro || {};
  const cta = c?.cta || {};
  const [introTitle, introHighlight] = splitTitle(intro.title || 'Our Leadership Team', intro.highlight);

  const activeLeaders =
    Array.isArray(team) && team.length > 0
      ? team.filter((m: any) => m.isActive !== false)
      : defaultLeaders;

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          1. LEADERSHIP HERO BANNER
          ═══════════════════════════════════════════════════════════════════ */}
      <PageHero
        bgImage={h.image ? img(h.image) : '/images/leadership_banner.jpg'}
        eyebrow={h.eyebrow || 'OUR LEADERSHIP'}
        title={h.title || 'Meet Our Leaders'}
        highlight={h.highlight}
        text={h.text || 'Visionaries, Strategists, Problem Solvers.'}
        crumb="Leadership"
      />

      {/* ═══════════════════════════════════════════════════════════════════
          2. LEADERSHIP TEAM SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <LightSection glow="left">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>{intro.eyebrow || 'OUR TEAM'}</Eyebrow>
          <SectionTitle title={introTitle} highlight={introHighlight} breakLine={false} />
          <Lead center>
            {intro.text ||
              'Our leadership team brings decades of industry experience, innovation, and a passion for building technology solutions that make a real difference.'}
          </Lead>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activeLeaders.map((member: any, idx: number) => {
            const orange = idx % 2 === 0;
            return (
              <Reveal key={member._id || idx} delay={(idx % 4) * 100} className="h-full">
                <div
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 ${
                    orange ? 'hover:border-[#FF6B00]/40' : 'hover:border-[#0284C7]/40'
                  }`}
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${
                      orange ? 'from-[#FF6B00]/15 via-orange-50 to-transparent' : 'from-[#0284C7]/15 via-sky-50 to-transparent'
                    }`}
                    aria-hidden
                  />
                  <div className="relative">
                    <div className="mx-auto h-44 w-full max-w-[200px] overflow-hidden rounded-2xl border-4 border-white bg-slate-200 shadow-xl">
                      <img
                        src={member.photo ? img(member.photo) : '/vinit.jpeg'}
                        alt={member.name}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-5 text-base font-bold text-slate-900">{member.name}</h3>
                    <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">{member.designation}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{member.bio}</p>
                  </div>

                  <div className="relative mt-5 flex items-center border-t border-slate-100 pt-4">
                    {member.linkedin && member.linkedin !== '#' && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2] text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        in
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </LightSection>

      {/* ═══════════════════════════════════════════════════════════════════
          3. TESTIMONIALS (dynamic)
          ═══════════════════════════════════════════════════════════════════ */}
      <TestimonialsSection items={testimonials} content={testimonialContent} variant="dark" />

      {/* ═══════════════════════════════════════════════════════════════════
          4. CTA BANNER
          ═══════════════════════════════════════════════════════════════════ */}
      <CtaBanner
        eyebrow={cta.eyebrow || 'JOIN US'}
        title={cta.title || 'Great People Build Great Solutions'}
        text={cta.text || 'Join our team and be part of a culture that values innovation, growth and impact.'}
        buttonText={cta.buttonText || 'Explore Careers'}
      />
    </>
  );
}
