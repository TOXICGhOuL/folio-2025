import FadeIn from '../components/FadeIn'
import { ROLES } from '../data'

export default function RolesSection() {
  return (
    <section id="roles" className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]" style={{ background: '#FFFFFF' }}>
      <FadeIn y={40}>
        <h2 className="mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)', color: '#0C0C0C' }}>
          What I do
        </h2>
      </FadeIn>
      <ul className="mx-auto max-w-5xl">
        {ROLES.map((r, i) => (
          <FadeIn as="li" key={r.n} delay={i * 0.1} className="flex gap-4 border-t border-[rgba(12,12,12,0.15)] py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
            <span className="font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)', color: '#0C0C0C' }}>{r.n}</span>
            <div className="flex flex-col gap-2 pt-2" style={{ color: '#0C0C0C' }}>
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{r.name}</h3>
              <p className="max-w-2xl font-light leading-relaxed opacity-60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>{r.text}</p>
            </div>
          </FadeIn>
        ))}
      </ul>
    </section>
  )
}
