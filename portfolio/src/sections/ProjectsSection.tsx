import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import { LiveProjectButton } from '../components/Buttons'
import { ME, TEAM } from '../data'

interface Project {
  n: string
  category: string
  name: string
  button: { href: string; label: string }
  a: ReactNode
  b: ReactNode
  c: ReactNode
}

const big = 'hero-heading font-black uppercase leading-none'
const note = 'font-light leading-snug text-[#D7E2EA]'

const projects: Project[] = [
  {
    n: '01',
    category: 'Group research',
    name: 'PERSPECTIV 07, Kotak Mahindra Bank',
    button: { href: ME.groupSite, label: 'Live Project' },
    a: (<><span className={big} style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>6</span><span className={note}>first year BMS authors, Group 07</span></>),
    b: (<><span className="text-sm font-medium uppercase tracking-widest text-[#D7E2EA]/70">My part</span><span className="text-lg font-medium text-[#D7E2EA] sm:text-3xl">Website developer and report author</span><a className="mt-2 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] underline underline-offset-4" href={ME.report}>Download the report (DOCX)</a></>),
    c: (
      <div className="flex w-full flex-col justify-center gap-2 sm:gap-3">
        {TEAM.map((t) => (
          <div key={t.roll} className="flex items-baseline justify-between gap-4 border-b border-[#D7E2EA]/15 pb-2">
            <span className="text-sm font-medium text-[#D7E2EA] sm:text-2xl">{t.name}</span>
            <span className="text-sm font-black tracking-wide text-white sm:text-2xl">{t.roll}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: '02',
    category: 'Leadership',
    name: "NashCon '26, Director General",
    button: { href: ME.cv, label: 'See CV' },
    a: (<><span className={big} style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>30</span><span className={note}>member team across 6 departments</span></>),
    b: (<><span className={big} style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>125+</span><span className={note}>delegates at the second edition</span></>),
    c: (<p className="text-sm font-light leading-relaxed text-[#D7E2EA] sm:text-2xl">The confirmed venue was cancelled 12 to 15 hours before delegates reported. I negotiated and secured a replacement so the conference ran on schedule. I also directed marketing, PR and content, and personally closed 1 of 7 sponsors.</p>),
  },
  {
    n: '03',
    category: 'This website',
    name: 'Drive through my portfolio',
    button: { href: './drive/', label: 'Live Project' },
    a: (<><span className={big} style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>3D</span><span className={note}>optional drivable version, about 50 MB</span></>),
    b: (<><span className="text-sm font-medium uppercase tracking-widest text-[#D7E2EA]/70">Course</span><span className="text-lg font-medium text-[#D7E2EA] sm:text-3xl">Introduction to Information Systems, IIM Sirmaur</span></>),
    c: (<p className="text-sm font-light leading-relaxed text-[#D7E2EA] sm:text-2xl">Prefer to explore? Drive a car around my CV in a 3D world, with areas for education, experience and achievements. Built with Three.js and Rapier, inspired by Bruno Simon's portfolio. This page is the plain version for quick reading.</p>),
  },
]

function Card({ p, i, total, progress }: { p: Project; i: number; total: number; progress: MotionValue<number> }) {
  const targetScale = 1 - (total - 1 - i) * 0.03
  const scale = useTransform(progress, [i / total, 1], [1, targetScale])
  const radius = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]'
  const panel = `flex flex-col justify-between border border-[#D7E2EA]/15 p-6 sm:p-8 ${radius}`
  const tone = { background: 'linear-gradient(135deg,#1b1f27,#0f1115)' }
  return (
    <div className="sticky top-24 h-[85vh] md:top-32">
      <motion.div
        style={{ scale, top: `${i * 28}px` }}
        className={`relative flex h-full origin-top flex-col gap-4 border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 ${radius}`}
      >
        <div className="absolute inset-0 -z-10 rounded-[inherit]" style={{ background: '#0C0C0C' }} />
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 sm:px-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>{p.n}</span>
            <div className="flex flex-col text-[#D7E2EA]">
              <span className="text-xs font-light uppercase tracking-widest opacity-70 sm:text-sm">{p.category}</span>
              <span className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{p.name}</span>
            </div>
          </div>
          <LiveProjectButton href={p.button.href}>{p.button.label}</LiveProjectButton>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="flex flex-col gap-3 sm:w-[40%] sm:gap-4">
            <div className={`${panel} hidden flex-1 sm:flex`} style={tone}>{p.a}</div>
            <div className={`${panel} gap-2 sm:flex-[1.4]`} style={tone}>{p.b}</div>
          </div>
          <div className={`${panel} flex-1 justify-center sm:w-[60%] sm:flex-none`} style={tone}>{p.c}</div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10" style={{ background: '#0C0C0C' }}>
      <FadeIn y={40}>
        <h2 className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>Project</h2>
      </FadeIn>
      <div ref={ref} className="mx-auto max-w-7xl">
        {projects.map((p, i) => <Card key={p.n} p={p} i={i} total={projects.length} progress={scrollYProgress} />)}
      </div>
    </section>
  )
}
