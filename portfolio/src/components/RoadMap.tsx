const path = 'M70 310 C 200 60, 330 380, 470 190 S 700 90, 730 280'
const pins = [
  { x: 70, y: 310, label: 'Education', dy: 36 },
  { x: 215, y: 170, label: 'Experience', dy: -26 },
  { x: 330, y: 270, label: 'Achievements', dy: 38 },
  { x: 470, y: 190, label: 'Group 07', dy: -26 },
  { x: 730, y: 280, label: "NashCon '26", dy: 38 },
]

export default function RoadMap() {
  return (
    <svg viewBox="0 0 800 400" role="img" aria-label="Animated map of the drive through route" className="block w-full">
      <defs>
        <path id="route" d={path} />
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#D7E2EA" strokeOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="800" height="400" fill="url(#grid)" />
      <use href="#route" fill="none" stroke="#1d222b" strokeWidth="46" strokeLinecap="round" />
      <use href="#route" fill="none" stroke="#D7E2EA" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="10 14" />
      {pins.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="9" fill="#B600A8" stroke="#fff" strokeWidth="2" />
          <text x={p.x} y={p.y + p.dy} textAnchor="middle" fill="#D7E2EA" fontSize="19" fontWeight="500" fontFamily="Kanit, sans-serif">{p.label}</text>
        </g>
      ))}
      <g>
        <rect x="-18" y="-10" width="36" height="20" rx="7" fill="#BE4C00" stroke="#fff" strokeWidth="2" />
        <rect x="3" y="-7" width="10" height="14" rx="2" fill="#0C0C0C" />
        <animateMotion dur="11s" repeatCount="indefinite" rotate="auto"><mpath href="#route" /></animateMotion>
      </g>
    </svg>
  )
}
