import { useLayoutEffect, useRef, useState } from 'react'

// Scales the font size so one line of text fills its container, whatever font loads.
export default function FitText({ children, className }: { children: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const txt = useRef<HTMLHeadingElement>(null)
  const [size, setSize] = useState(100)

  useLayoutEffect(() => {
    const fit = () => {
      const b = box.current, t = txt.current
      if (!b || !t) return
      const cur = parseFloat(getComputedStyle(t).fontSize) || 100
      const w100 = (t.getBoundingClientRect().width * 100) / cur
      if (w100 > 0) setSize((100 * b.clientWidth) / w100)
    }
    fit()
    window.addEventListener('resize', fit)
    document.fonts?.ready.then(fit)
    return () => window.removeEventListener('resize', fit)
  }, [children])

  return (
    <div ref={box} className="w-full overflow-hidden">
      <h1 ref={txt} className={className} style={{ fontSize: size, display: "inline-block", width: "auto" }}>{children}</h1>
    </div>
  )
}
