import { useEffect, useState } from 'react'
import { ME } from '../data'

// Keeps Drive and the CV one click away after the hero scrolls out of view.
export default function FloatingCV() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const base = `fixed bottom-4 z-50 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-widest shadow-lg transition-all duration-300 sm:bottom-6 sm:text-sm ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`
  return (
    <>
      <a
        href="./drive/"
        className={`${base} right-4 text-white sm:right-6`}
        style={{ background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)', outline: '2px solid #fff', outlineOffset: '-3px' }}
      >
        Drive through
      </a>
      <a href={ME.cv} download aria-label="Download CV" className={`${base} left-4 bg-white text-[#0C0C0C] sm:left-6`}>
        CV, {ME.roll}
      </a>
    </>
  )
}
