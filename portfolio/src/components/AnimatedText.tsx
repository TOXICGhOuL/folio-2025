import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

function Char({ c, i, n, progress }: { c: string; i: number; n: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [i / n, (i + 1) / n], [0.2, 1])
  return (
    <span className="relative inline-block">
      <span className="opacity-0">{c}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">{c}</motion.span>
    </span>
  )
}

export default function AnimatedText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const chars = text.split('')
  let idx = 0
  const words = text.split(' ')
  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {w.split('').map((c) => <Char key={idx} c={c} i={idx++} n={chars.length} progress={scrollYProgress} />)}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </p>
  )
}
