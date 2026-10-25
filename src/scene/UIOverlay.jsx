import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { AVATARS, useScene } from '../context/SceneContext'
import { useThemeColors } from './useThemeColors'



function StatCard({ label, items, accent, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', delay },
    )
    return () => gsap.killTweensOf(ref.current)
  }, [delay])

  return (
    <div
      ref={ref}
      className="opacity-0 relative rounded border bg-black/60 backdrop-blur-md p-3"
      style={{ borderColor: `${accent}44` }}
    >
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: accent }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: accent }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: accent }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: accent }} />

      <p className="text-[10px] tracking-[0.25em] uppercase mb-2 font-semibold font-mono" style={{ color: accent }}>
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-1.5">
            <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <span className="text-white/85 text-[11px] leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SkillPills({ skills, accent, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(ref.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay })
    return () => gsap.killTweensOf(ref.current)
  }, [delay])

  return (
    <div ref={ref} className="opacity-0">
      <p className="text-[10px] tracking-[0.25em] uppercase mb-2 font-semibold font-mono" style={{ color: accent }}>
        Skills
      </p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="text-[10px] px-2 py-0.5 rounded border font-mono"
            style={{ borderColor: `${accent}66`, color: accent, backgroundColor: `${accent}11` }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

function DetailPanel({ avatar, colors }) {
  const { selected } = useScene()
  const isVisible = selected === avatar.id

  const panelRef = useRef(null)
  const accent = avatar.side === 'left' ? colors.left : colors.right
  const { data } = avatar

  const sideClass = avatar.side === 'left' ? 'left-4 top-1/2 -translate-y-1/2' : 'right-4 top-1/2 -translate-y-1/2'

  useEffect(() => {
    if (!panelRef.current) return

    if (isVisible) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: avatar.side === 'left' ? -40 : 40 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.25 },
      )
    } else {
      gsap.to(panelRef.current, {
        opacity: 0,
        x: avatar.side === 'left' ? -30 : 30,
        duration: 0.3,
        ease: 'power2.in',
        overwrite: true,
      })
    }
  }, [isVisible, avatar.side])

  if (!isVisible) return null

  return (
    <div
      ref={panelRef}
      className={`absolute ${sideClass} w-64 flex flex-col gap-2 opacity-0 pointer-events-auto`}
      style={{ maxHeight: '88vh', overflowY: 'auto' }}
    >
      <div className="px-4 py-3 bg-black/70 backdrop-blur-md rounded border" style={{ borderColor: `${accent}55` }}>
        <h2 className="text-white font-bold text-base tracking-wide">{avatar.name}</h2>
        <p className="text-[11px] tracking-[0.18em] uppercase mt-0.5 font-mono" style={{ color: accent }}>
          {avatar.title}
        </p>
      </div>

      <StatCard label="Strengths" items={data.strengths} accent={accent} delay={0.05} />
      <StatCard label="Weaknesses" items={data.weaknesses} accent={accent} delay={0.13} />
      <StatCard label="Experience" items={data.experience} accent={accent} delay={0.21} />
      <StatCard label="Achievements" items={data.achievements} accent={accent} delay={0.29} />
      <StatCard label="Education" items={data.education} accent={accent} delay={0.37} />

      <div className="relative rounded border bg-black/60 backdrop-blur-md p-3" style={{ borderColor: `${accent}44` }}>
        <SkillPills skills={data.skills} accent={accent} delay={0.45} />
      </div>
    </div>
  )
}

function BackButton() {
  const { selected, deselect } = useScene()

  if (!selected) return null

  return (
    <button
      onClick={deselect}
      className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2 border border-white/20 bg-black/50 backdrop-blur-sm text-white/70 text-xs tracking-[0.25em] uppercase font-mono hover:border-white/50 hover:text-white transition-all duration-300 rounded pointer-events-auto"
    >
      <span className="text-base leading-none">←</span> Back to Selection
    </button>
  )
}

function SelectPrompt() {
  const { selected } = useScene()

  if (selected) return null

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
      <p className="text-white/30 text-[11px] tracking-[0.35em] uppercase font-mono animate-pulse">Click to select</p>
    </div>
  )
}

export function UIOverlay() {
  const { selected } = useScene()
  const colors = useThemeColors()

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="absolute inset-0 bg-black transition-opacity duration-700" style={{ opacity: selected ? 0.35 : 0 }} />

      <BackButton />
      <SelectPrompt />

      {Object.values(AVATARS).map((avatar) => (
        <div key={avatar.id}>
          <DetailPanel avatar={avatar} colors={colors} />
        </div>
      ))}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
        }}
      />
    </div>
  )
}
