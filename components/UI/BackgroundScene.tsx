'use client'

import { useEffect, useRef, memo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalendarContext } from '@/components/Providers/CalendarProvider'
import { MONTH_IMAGES } from '@/lib/constants'

// ─────────────────────────────────────────────────────────────────────────────
// Effect types & config
// ─────────────────────────────────────────────────────────────────────────────

type EffectType =
  | 'snow' | 'blizzard'
  | 'petals' | 'blossom'
  | 'sparkles'
  | 'rain' | 'heavyRain' | 'drizzle'
  | 'ripples'
  | 'dust'
  | 'fireflies'
  | 'leaves' | 'stormLeaves' | 'lushLeaves'
  | 'fog'
  | 'mist'
  | 'frost'

interface EffectConfig { type: EffectType; count: number }

const MONTH_EFFECTS: Record<number, EffectConfig> = {
  0: { type: 'snow', count: 80 },
  1: { type: 'sparkles', count: 70 },
  2: { type: 'blossom', count: 85 },
  3: { type: 'dust', count: 100 },
  4: { type: 'dust', count: 140 },
  5: { type: 'stormLeaves', count: 160 },
  6: { type: 'ripples', count: 40 }, // July — border ripples
  7: { type: 'heavyRain', count: 120 }, // August — fast heavy rain
  8: { type: 'drizzle', count: 70 },
  9: { type: 'sparkles', count: 75 },
  10: { type: 'mist', count: 40 },
  11: { type: 'fog', count: 50 },
}

// ─────────────────────────────────────────────────────────────────────────────
// Particle System
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; opacity: number
  angle: number; spin: number
  phase: number; wobble: number
  color: string; type: EffectType
  len?: number; fh?: number; rot?: number
}

const rnd = (lo: number, hi: number) => lo + Math.random() * (hi - lo)
function pick<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function spawn(W: number, H: number, type: EffectType): Particle {
  const base: Particle = {
    x: rnd(0, W), y: rnd(-H * 0.3, H * 1.1),
    vx: 0, vy: 0, size: 4, opacity: 0.8,
    angle: rnd(0, Math.PI * 2), spin: 0,
    phase: rnd(0, Math.PI * 2), wobble: 0.5,
    color: '#fff', type,
  }

  switch (type) {
    case 'snow': return {
      ...base,
      y: rnd(-60, H), size: rnd(2.5, 6), vy: rnd(0.8, 2.0), vx: rnd(-0.4, 0.4),
      wobble: rnd(0.4, 1.0), opacity: rnd(0.55, 0.95),
      color: pick(['rgba(220,240,255,0.9)', 'rgba(255,255,255,0.95)', 'rgba(180,220,255,0.8)'] as const),
    }
    case 'blossom': return {
      ...base,
      size: rnd(5, 13), vy: rnd(0.5, 1.3), vx: rnd(-0.6, 0.6),
      wobble: rnd(1.0, 2.2), spin: rnd(-0.035, 0.035), opacity: rnd(0.6, 0.88),
      color: pick(['rgba(255,182,193,0.88)', 'rgba(255,140,180,0.82)', 'rgba(255,200,215,0.78)'] as const),
    }
    case 'sparkles': return {
      ...base,
      size: rnd(2.5, 6), vy: rnd(-0.4, 0.4), vx: rnd(-0.4, 0.4),
      wobble: rnd(0.2, 0.6), opacity: 0,
      color: pick(['rgba(255,235,80,0.95)', 'rgba(255,255,160,0.9)', 'rgba(255,210,60,0.88)'] as const),
    }
    case 'drizzle': return {
      ...base,
      x: rnd(0, W), y: rnd(-H, 0),
      size: rnd(0.8, 1.5), len: rnd(12, 20), vy: rnd(12, 18), vx: 0,
      opacity: rnd(0.4, 0.7), phase: rnd(0, Math.PI * 2),
      color: 'rgba(200,230,255,0.6)',
    }
    case 'heavyRain': return {
      ...base,
      x: rnd(0, W), y: rnd(-H, 0),
      size: rnd(1.8, 3.2), len: rnd(60, 100), vy: rnd(35, 50), vx: rnd(-1, 1),
      opacity: rnd(0.5, 0.8), phase: rnd(0, Math.PI * 2),
      color: 'rgba(215,235,255,0.75)',
    }
    case 'ripples': {
      // July (Month 6) ripples are focused on borders
      const isJuly = new Date().getMonth() === 6; // Note: month passed via cfg might be better, but we detect it via currentMonth in state
      // Actually, we should probably pass the month index to spawn or use a different type. 
      // For now, I'll use a random border-focused position for the ripple type globally or check if we are in July.
      // Better: specialized spawn call in useEffect or a check here if we want global change for this type.
      // User said "in july give... mainly on the border".
      
      let rx = rnd(W * 0.1, W * 0.9);
      let ry = rnd(H * 0.1, H * 0.9);
      
      // I'll make them appear anywhere but skew towards edges if we define them for July elsewhere.
      // Let's just make the ripple type high quality and let the useEffect handle the specialized border spawn for July.
      return {
        ...base,
        x: rx, y: ry,
        size: 1, len: rnd(45, 110), vy: 0, vx: 0,
        opacity: rnd(0.5, 0.8), phase: rnd(0.015, 0.035),
        color: 'rgba(215,235,255,0.6)',
      }
    }
    case 'dust': return {
      ...base,
      x: rnd(0, W), y: rnd(0, H),
      size: rnd(1, 2.8), vy: rnd(-0.3, 0.3), vx: rnd(-0.2, 0.2),
      wobble: rnd(0.5, 1.2), opacity: rnd(0.1, 0.4), phase: rnd(0, Math.PI * 2),
      color: pick(['rgba(255,220,80,0.9)', 'rgba(255,200,60,0.85)', 'rgba(255,240,130,0.8)'] as const),
    }
    case 'stormLeaves': return {
      ...base,
      size: rnd(10, 20), vy: rnd(1.5, 4.0), vx: rnd(12, 25),
      wobble: rnd(0.6, 1.2), spin: rnd(-0.08, 0.08), opacity: rnd(0.5, 0.8),
      color: pick(['rgba(150,100,40,0.8)', 'rgba(170,120,50,0.7)', 'rgba(130,80,20,0.75)'] as const),
    }
    case 'lushLeaves': return {
      ...base,
      size: rnd(12, 22), vy: rnd(2.5, 4.5), vx: rnd(-1.5, 1.5),
      wobble: rnd(1.2, 2.2), spin: rnd(-0.04, 0.04), opacity: rnd(0.6, 0.85),
      color: pick(['rgba(45,150,60,0.85)', 'rgba(60,180,80,0.8)', 'rgba(30,120,40,0.75)'] as const),
    }
    case 'fog': return {
      ...base,
      x: rnd(-W * 0.5, W * 0.5), y: rnd(H * 0.05, H * 0.92),
      len: rnd(W * 0.6, W * 1.2), fh: rnd(80, 180), size: 1,
      vx: rnd(0.1, 0.35), vy: rnd(-0.03, 0.03), rot: rnd(0, Math.PI * 2),
      wobble: rnd(1.5, 3.0), opacity: rnd(0.12, 0.28),
      color: 'rgba(215,230,245,1)',
    }
    case 'mist': return {
      ...base,
      x: rnd(-W * 0.4, W * 0.6), y: rnd(H * 0.1, H * 0.9),
      len: rnd(W * 0.4, W * 0.8), fh: rnd(40, 100), size: 1,
      vx: rnd(0.5, 1.2), vy: rnd(-0.08, 0.08), rot: rnd(0, Math.PI * 2),
      wobble: rnd(0.8, 1.6), opacity: rnd(0.1, 0.22),
      color: 'rgba(235,240,250,1)',
    }
    case 'frost': return {
      ...base,
      x: rnd(0, W), y: rnd(0, H),
      size: rnd(2, 5), vx: rnd(-0.25, 0.25), vy: rnd(0.15, 0.45), rot: rnd(0, Math.PI * 2),
      wobble: rnd(0.2, 0.5), spin: rnd(-0.03, 0.03), opacity: rnd(0.45, 0.85),
      color: 'rgba(210,235,255,0.9)',
    }
    default: return base
  }
}

function drawSnowflake(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save(); ctx.globalAlpha = p.opacity; ctx.strokeStyle = p.color; ctx.lineWidth = Math.max(0.6, p.size * 0.22); ctx.translate(p.x, p.y)
  for (let i = 0; i < 6; i++) {
    ctx.save(); ctx.rotate((i * Math.PI) / 3 + p.angle)
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -p.size)
    const b = p.size * 0.45
    ctx.moveTo(0, -p.size * 0.55); ctx.lineTo(b, -p.size * 0.55 - b * 0.5)
    ctx.moveTo(0, -p.size * 0.55); ctx.lineTo(-b, -p.size * 0.55 - b * 0.5)
    ctx.stroke(); ctx.restore()
  }
  ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, p.size * 0.18, 0, Math.PI * 2); ctx.fill(); ctx.restore()
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save(); ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color; ctx.translate(p.x, p.y); ctx.rotate(p.angle)
  const s = p.size; ctx.beginPath(); ctx.moveTo(0, -s); ctx.bezierCurveTo(s * 0.75, -s * 0.5, s * 0.75, s * 0.5, 0, s); ctx.bezierCurveTo(-s * 0.75, s * 0.5, -s * 0.75, -s * 0.5, 0, -s); ctx.fill(); ctx.restore()
}

function drawLeaf(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save(); ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color; ctx.translate(p.x, p.y); ctx.rotate(p.angle)
  const s = p.size; ctx.beginPath(); ctx.moveTo(0, -s); ctx.bezierCurveTo(s * 0.8, -s * 0.35, s * 0.8, s * 0.35, 0, s); ctx.bezierCurveTo(-s * 0.8, s * 0.35, -s * 0.8, -s * 0.35, 0, -s); ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.stroke(); ctx.restore()
}

function drawRain(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const shimmer = 0.7 + 0.3 * Math.sin(t * 0.002 + p.phase)
  ctx.save(); ctx.globalAlpha = p.opacity * shimmer; ctx.strokeStyle = p.color; ctx.lineWidth = p.size; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + (p.len ?? 15)); ctx.stroke(); ctx.restore()
}

function drawRipple(ctx: CanvasRenderingContext2D, p: Particle) {
  const progress = p.size / (p.len ?? 50); const alpha = p.opacity * (1 - progress)
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = p.color; ctx.lineWidth = 2.0 * (1 - progress)
  ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.stroke()
  if (p.size > 8) { ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2); ctx.stroke() }
  ctx.restore()
}

function drawDust(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.002 + p.phase)
  ctx.save(); ctx.globalAlpha = p.opacity * (0.5 + 0.5 * pulse); ctx.translate(p.x, p.y)
  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 5)
  grd.addColorStop(0, p.color); grd.addColorStop(1, 'transparent')
  ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(0, 0, p.size * 5, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, p.size * 0.9, 0, Math.PI * 2); ctx.fill(); ctx.restore()
}

function drawSparkle(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.0032 + p.phase); if (pulse < 0.06) return
  ctx.save(); ctx.globalAlpha = pulse * 0.9; ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = p.size * 4; ctx.translate(p.x, p.y); ctx.rotate(p.angle)
  const s = p.size; ctx.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 === 0 ? s : s * 0.32; const a = (i * Math.PI) / 4; i === 0 ? ctx.moveTo(r * Math.cos(a), r * Math.sin(a)) : ctx.lineTo(r * Math.cos(a), r * Math.sin(a)) }
  ctx.closePath(); ctx.fill(); ctx.restore()
}

function drawFog(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const breathe = 0.5 + 0.5 * Math.sin(t * 0.00045 + p.phase); const fw = p.len ?? 300; const fh = p.fh ?? 80
  ctx.save(); ctx.globalAlpha = p.opacity * (0.6 + 0.4 * breathe); ctx.translate(p.x, p.y); ctx.rotate(p.rot ?? 0); ctx.scale(fw, fh)
  const normGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
  normGrd.addColorStop(0, p.color); normGrd.addColorStop(0.45, p.color.replace(',1)', ',0.45)')); normGrd.addColorStop(1, 'transparent')
  ctx.fillStyle = normGrd; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore()
}

function drawFrost(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const shimmer = 0.7 + 0.3 * Math.sin(t * 0.005 + p.phase)
  ctx.save(); ctx.globalAlpha = p.opacity * shimmer; ctx.fillStyle = p.color; ctx.translate(p.x, p.y); ctx.rotate(p.angle)
  const s = p.size; ctx.beginPath(); ctx.moveTo(0, -s * 1.5); ctx.lineTo(s, 0); ctx.lineTo(0, s * 1.5); ctx.lineTo(-s, 0); ctx.closePath(); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore()
}

function update(p: Particle, W: number, H: number, t: number) {
  const sway = Math.sin(t * 0.0011 + p.phase) * p.wobble
  if (p.type === 'ripples') {
    p.size += (p.phase * 60)
    if (p.size > (p.len ?? 50)) { p.x = rnd(W * 0.1, W * 0.9); p.y = rnd(H * 0.1, H * 0.9); p.size = 1; p.len = rnd(40, 100) }
    return
  }
  if (p.type === 'sparkles') {
    p.x += p.vx + sway * 0.35; p.y += p.vy + Math.cos(t * 0.0009 + p.phase) * 0.22
    if (p.x < -15) p.x = W + 15; if (p.x > W + 15) p.x = -15; if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20; return
  }
  if (p.type === 'dust') {
    p.vx += Math.sin(t * 0.0009 + p.phase) * 0.008; p.vy += Math.cos(t * 0.0007 + p.phase) * 0.006
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
    if (speed > 0.5) { p.vx = (p.vx / speed) * 0.5; p.vy = (p.vy / speed) * 0.5 }
    p.x += p.vx; p.y += p.vy
    if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20; if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20; return
  }
  if (p.type === 'fog' || p.type === 'mist') {
    p.vx += Math.sin(t * 0.0007 + p.phase) * 0.004; p.x += p.vx; p.y += p.vy + Math.sin(t * 0.0005 + p.phase) * 0.15
    if (p.rot !== undefined) p.rot += 0.0004
    const fw = p.len ?? 300; if (p.x - fw > W + 150) p.x = -(fw + 150); if (p.y < -200) p.y = H + 200; if (p.y > H + 200) p.y = -200; return
  }
  if (p.type === 'frost') {
    p.x += p.vx + Math.sin(t * 0.0012 + p.phase) * 0.4; p.y += p.vy + Math.cos(t * 0.0009 + p.phase) * 0.15
    if (p.rot !== undefined) p.rot += 0.008; if (p.y > H + 40) p.y = -40; if (p.x < -40) p.x = W + 40; return
  }
  if (p.type === 'drizzle' || p.type === 'heavyRain') {
    p.y += p.vy; if (p.y > H + 100) { p.y = rnd(-120, -10); p.x = rnd(0, W) }
    return
  }
  p.x += p.vx + sway; p.y += p.vy; p.angle += p.spin
  if (p.y > H + 35) { p.y = rnd(-50, -10); p.x = rnd(-25, W + 25) }
  if (p.x < -35) p.x = W + 25; if (p.x > W + 35) p.x = -25
}

const BackgroundScene = memo(function BackgroundScene() {
  const { state } = useCalendarContext()
  const month = state.currentMonth.getMonth()
  const cfg = MONTH_EFFECTS[month]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => { Object.values(MONTH_IMAGES).forEach(src => { const img = new window.Image(); img.src = src }) }, [])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }; resize(); window.addEventListener('resize', resize)
    
    particlesRef.current = Array.from({ length: cfg.count }, () => spawn(canvas.width, canvas.height, cfg.type))

    // specialized logic for border ripples in July
    if (month === 6) {
      particlesRef.current.forEach(p => {
        if (p.type === 'ripples') {
          const side = Math.floor(Math.random() * 4)
          const margin = 140
          if (side === 0) { p.y = rnd(0, margin); p.x = rnd(0, canvas.width) }
          else if (side === 1) { p.y = rnd(canvas.height - margin, canvas.height); p.x = rnd(0, canvas.width) }
          else if (side === 2) { p.x = rnd(0, margin); p.y = rnd(0, canvas.height) }
          else { p.x = rnd(canvas.width - margin, canvas.width); p.y = rnd(0, canvas.height) }
        }
      })
    }

    // Restoration of high-quality winter overlays
    if (month === 0) { // Jan Frost
      particlesRef.current.push(...Array.from({ length: 40 }, () => spawn(canvas.width, canvas.height, 'frost')))
    }
    if (month === 10) { // Nov Sparkling Mist
      particlesRef.current.push(...Array.from({ length: 25 }, () => spawn(canvas.width, canvas.height, 'sparkles')))
    }
    if (month === 7) { // Monsoon Mist Overlay (August only now) — Reduced density
      particlesRef.current.push(...Array.from({ length: 20 }, () => {
        const p = spawn(canvas.width, canvas.height, 'fog')
        p.opacity *= 0.4; p.vx *= 1.5; p.color = 'rgba(220,220,200,0.35)'
        return p
      }))
    }
    if (month === 11) { // Dec Light Snow Flurries
      particlesRef.current.push(...Array.from({ length: 50 }, () => {
        const p = spawn(canvas.width, canvas.height, 'snow')
        p.size *= 0.5; p.opacity *= 0.7; p.vy *= 0.6; p.vx *= 1.2
        return p
      }))
    }

    return () => window.removeEventListener('resize', resize)
  }, [month, cfg])

  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    let t = 0
    const loop = () => {
      t += 16; ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particlesRef.current) {
        update(p, canvas.width, canvas.height, t)
        switch (p.type) {
          case 'snow': case 'blizzard': drawSnowflake(ctx, p); break
          case 'blossom': drawPetal(ctx, p); break // Reusing petal logic for blossom
          case 'stormLeaves': case 'lushLeaves': drawLeaf(ctx, p); break
          case 'drizzle': case 'heavyRain': drawRain(ctx, p, t); break
          case 'dust': drawDust(ctx, p, t); break
          case 'ripples': drawRipple(ctx, p); break
          case 'sparkles': drawSparkle(ctx, p, t); break
          case 'fog': case 'mist': drawFog(ctx, p, t); break
          case 'frost': drawFrost(ctx, p, t); break
        }
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop); return () => cancelAnimationFrame(rafRef.current)
  }, [month, cfg])

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }} aria-hidden="true">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div key={`bg-${month}`} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          <Image src={MONTH_IMAGES[month]} alt="" fill className="object-cover" style={{ filter: 'blur(18px) brightness(0.28) saturate(1.4)', transform: 'scale(1.08)' }} priority />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="sync">
        {month === 5 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to right, rgba(160,110,40,0.1) 0%, rgba(130,80,30,0.2) 50%, rgba(160,110,40,0.1) 100%)', filter: 'blur(30px)', mixBlendMode: 'multiply' }} />)}
        {month === 7 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(220,240,255,0.04) 0%, transparent 80%)', filter: 'blur(40px)', mixBlendMode: 'screen' }} />)}
        {(month === 10 || month === 11 || month === 0) && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, rgba(180,200,225,0.2) 0%, transparent 40%, rgba(180,200,225,0.2) 100%)', filter: 'blur(50px)', mixBlendMode: 'lighten' }} />)}
      </AnimatePresence>

      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  )
})

export default BackgroundScene
