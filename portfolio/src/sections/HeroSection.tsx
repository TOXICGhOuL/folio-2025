import FadeIn from '../components/FadeIn'
import FitText from '../components/FitText'
import Magnet from '../components/Magnet'
import RoadMap from '../components/RoadMap'
import { ME } from '../data'

const links = [['About', '#about'], ['Roles', '#roles'], ['Projects', '#projects'], ['Contact', '#contact']]
const rows: [string, string][] = [
  ['Programme', 'Bachelor of Management Studies, IIM Sirmaur, 2026 to 2030'],
  ['Group', 'Group 07, PERSPECTIV, Kotak Mahindra Bank report'],
  ['My contribution', 'Website developer and report author, one of six'],
]
const grad = 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)'

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col px-5 pb-8 sm:px-6 md:px-10 md:pb-10" style={{ overflowX: 'clip' }}>
      <div className="aurora" aria-hidden>
        <i style={{ background: '#B600A8', left: '-10%', top: '5%' }} />
        <i style={{ background: '#BE4C00', right: '-12%', top: '30%', animationDelay: '-6s' }} />
        <i style={{ background: '#2563EB', left: '35%', bottom: '-20%', animationDelay: '-12s' }} />
      </div>
      <div className="grain" aria-hidden />

      <FadeIn y={-20}>
        <nav className="relative z-10 flex justify-between pt-6 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:pt-8 md:text-lg lg:text-[1.4rem]">
          {links.map(([l, h]) => <a key={l} href={h} className="transition-opacity duration-200 hover:opacity-70">{l}</a>)}
        </nav>
      </FadeIn>

      <FadeIn y={40} delay={0.15} className="relative z-10 mt-6 w-full sm:mt-4 md:mt-2">
        <FitText className="hero-heading shimmer w-full whitespace-nowrap font-black uppercase leading-none tracking-tight">Hi, i’m manas</FitText>
      </FadeIn>

      <div className="relative z-10 mt-auto grid gap-4 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
        {/* Drive: the main call to action */}
        <FadeIn y={30} delay={0.35} className="lg:order-2">
          <div className="drive-panel relative flex h-full flex-col overflow-hidden rounded-[32px] border-2 border-white/80 sm:rounded-[44px]">
            <div className="px-5 pt-5 sm:px-8 sm:pt-7">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/80 sm:text-sm">Don’t just read it</p>
              <h2 className="hero-heading mt-1 text-4xl font-black uppercase leading-none sm:text-6xl">Drive through me</h2>
            </div>
            <div className="min-h-0 flex-1 px-2"><RoadMap /></div>
            <div className="flex flex-wrap items-center gap-4 px-5 pb-5 sm:px-8 sm:pb-7">
              <Magnet padding={80} strength={4}>
                <a href="./drive/" className="drive-btn inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-black uppercase tracking-widest text-white sm:px-12 sm:py-5 sm:text-xl" style={{ background: grad }}>
                  Start driving
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
              </Magnet>
              <span className="max-w-[16rem] text-xs font-light leading-snug text-[#D7E2EA] sm:text-sm">A 3D world of my CV. Optional, about 50 MB, best on a laptop.</span>
            </div>
          </div>
        </FadeIn>

        {/* Marker sheet */}
        <FadeIn y={30} delay={0.5} className="lg:order-1">
          <div className="grid h-full gap-4 rounded-[32px] border border-[#D7E2EA]/40 bg-black/40 p-4 backdrop-blur sm:grid-cols-[170px_1fr] sm:gap-6 sm:rounded-[44px] sm:p-6">
            <img src="./manas.jpg" alt="Manas Bajaj" className="mx-auto aspect-[4/5] w-[130px] rounded-t-[999px] rounded-b-2xl object-cover object-top sm:w-full" style={{ filter: 'grayscale(1) contrast(1.05)' }} />
            <div className="flex flex-col justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="text-2xl font-semibold text-[#D7E2EA] sm:text-3xl">Manas Rahul Bajaj</h2>
                <span className="rounded-full px-4 py-1 text-lg font-black tracking-widest text-white sm:text-xl" style={{ background: grad }}>{ME.roll}</span>
              </div>
              <dl className="grid gap-2 text-[#D7E2EA]">
                {rows.map(([k, v]) => (
                  <div key={k} className="border-b border-[#D7E2EA]/15 pb-2">
                    <dt className="text-[11px] font-light uppercase tracking-widest opacity-70">{k}</dt>
                    <dd className="text-sm font-medium sm:text-base">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-2">
                <a href={ME.cv} download className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#0C0C0C] transition-opacity hover:opacity-80 sm:text-sm">Download CV</a>
                <a href={ME.groupSite} className="rounded-full border-2 border-[#D7E2EA] px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 sm:text-sm">Group project</a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
