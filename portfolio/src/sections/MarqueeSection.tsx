import { useEffect, useRef, useState } from 'react'
import { FACTS } from '../data'

const TILE = 420
const GAP = 12
const tones = [
  'linear-gradient(135deg,#1b1f27,#0f1115)',
  'linear-gradient(135deg,#2a1633,#120a18)',
  'linear-gradient(135deg,#102a2d,#0b1618)',
  'linear-gradient(135deg,#2d2110,#17110a)',
]

function Tile({ big, label, i }: { big: string; label: string; i: number }) {
  return (
    <div
      className="flex shrink-0 flex-col justify-between rounded-2xl border border-[#D7E2EA]/15 p-6"
      style={{ width: TILE, height: 270, background: tones[i % tones.length] }}
    >
      <span className="hero-heading text-7xl font-black uppercase leading-none">{big}</span>
      <span className="text-lg font-light leading-snug text-[#D7E2EA]">{label}</span>
    </div>
  )
}

function Row({ items, offset, dir }: { items: typeof FACTS; offset: number; dir: 1 | -1 }) {
  const tripled = [...items, ...items, ...items]
  const setWidth = items.length * (TILE + GAP)
  return (
    <div
      className="flex"
      style={{ gap: GAP, marginLeft: -setWidth, transform: `translateX(${dir * (offset - 200)}px)`, willChange: 'transform' }}
    >
      {tripled.map((f, i) => <Tile key={i} i={i % items.length} {...f} />)}
    </div>
  )
}

export default function MarqueeSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const top = (ref.current?.getBoundingClientRect().top ?? 0) + window.scrollY
      setOffset((window.scrollY - top + window.innerHeight) * 0.3)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={ref} className="flex flex-col gap-3 overflow-hidden pt-24 pb-10 sm:pt-32 md:pt-40" style={{ background: '#0C0C0C' }}>
      <Row items={FACTS.slice(0, 11)} offset={offset} dir={1} />
      <Row items={FACTS.slice(11)} offset={offset} dir={-1} />
    </section>
  )
}
