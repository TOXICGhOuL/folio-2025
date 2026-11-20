import FadeIn from '../components/FadeIn'
import { ContactButton } from '../components/Buttons'
import { ME } from '../data'

const link = 'text-lg font-light text-[#D7E2EA] underline underline-offset-4 transition-opacity hover:opacity-70 sm:text-2xl break-all'

export default function ContactSection() {
  return (
    <section id="contact" className="flex flex-col items-center gap-10 px-5 pb-16 pt-32 text-center sm:px-8 md:px-10" style={{ background: '#0C0C0C' }}>
      <FadeIn y={40}>
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>Contact</h2>
      </FadeIn>
      <FadeIn className="flex flex-col items-center gap-3">
        <a className={link} href={`mailto:${ME.email}`}>{ME.email}</a>
        <a className={link} href={`mailto:${ME.gmail}`}>{ME.gmail}</a>
        <a className={link} href={ME.linkedin}>linkedin.com/in/manasrbajaj</a>
      </FadeIn>
      <FadeIn><ContactButton href={ME.cv} download>Download CV</ContactButton></FadeIn>
      <p className="mt-16 max-w-xl text-sm font-light leading-relaxed text-[#D7E2EA]/70">
        Manas Rahul Bajaj, {ME.roll}, Bachelor of Management Studies, IIM Sirmaur, batch 2026 to 2030. Course project for Introduction to Information Systems.
      </p>
    </section>
  )
}
