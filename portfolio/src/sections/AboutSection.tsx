import FadeIn from '../components/FadeIn'
import AnimatedText from '../components/AnimatedText'
import { ContactButton } from '../components/Buttons'
import { ME } from '../data'

const badge = 'flex aspect-square flex-col items-center justify-center rounded-[28px] border border-[#D7E2EA]/20 text-center'
const bg = { background: 'radial-gradient(circle at 30% 25%, #2b3039, #101216 70%)', boxShadow: 'inset 4px 4px 14px rgba(187,204,215,0.12)' }

function Badge({ big, small, className, delay, x }: { big: string; small: string; className: string; delay: number; x: number }) {
  return (
    <FadeIn delay={delay} x={x} y={0} duration={0.9} className={`absolute ${className}`}>
      <div className={badge} style={bg}>
        <span className="hero-heading text-3xl font-black uppercase leading-none sm:text-4xl md:text-5xl">{big}</span>
        <span className="mt-1 px-2 text-[10px] font-light uppercase tracking-wide text-[#D7E2EA] sm:text-xs md:text-sm">{small}</span>
      </div>
    </FadeIn>
  )
}

export default function AboutSection() {
  return (
    <section id="about" className="relative flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-8 md:px-10" style={{ background: '#0C0C0C' }}>
      <Badge big="99.46" small="percentile, CET 2026" delay={0.1} x={-80} className="top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[110px] sm:w-[150px] md:w-[200px]" />
      <Badge big="AIR 23" small="CUET" delay={0.25} x={-80} className="bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]" />
      <Badge big="30" small="member team led" delay={0.15} x={80} className="top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[110px] sm:w-[150px] md:w-[200px]" />
      <Badge big="2nd" small="of 11, Mock Shark Tank" delay={0.3} x={80} className="bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[110px] sm:w-[160px] md:w-[210px]" />

      <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn y={40} delay={0}>
            <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
              About me
            </h2>
          </FadeIn>
          <AnimatedText
            className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
            text="I am a first year BMS student at IIM Sirmaur, from Nashik. I joined through a top percentile entrance record and have spent five years in Model United Nations, moving from delegate to Director General of NashCon '26, a conference for 125+ people. I like leading teams, raising sponsorship and fixing problems under pressure. Let's build something good together!"
          />
        </div>
        <ContactButton href={ME.cv} download>Download CV</ContactButton>
      </div>
    </section>
  )
}
