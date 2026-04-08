'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ParticleType } from '@/lib/backgrounds'

interface SeasonalParticlesProps {
  type: ParticleType
}

export default function SeasonalParticles({ type }: SeasonalParticlesProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={type}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {type === 'rain' && <RainEffect />}
          {type === 'fog' && <FogEffect type="fog" />}
          {type === 'mist' && <FogEffect type="mist" />}
          {type === 'frost' && <FrostEffect />}
          {type === 'blossom' && <FallingParticles color="#ffc0cb" count={25} speed={1} />}
          {type === 'stormLeaves' && <FallingParticles color="#8b4513" count={20} speed={2} horizontal={true} />}
          {type === 'sparkles' && <SparkleEffect />}
          {type === 'dust' && <DustEffect />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Rain ──────────────────────────────────────────────────────────────────

function RainEffect() {
  const drops = useMemo(() => Array.from({ length: 40 }), [])
  return (
    <div className="absolute inset-0">
      {drops.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/30"
          style={{
            width: '1px',
            height: `${Math.random() * 20 + 20}px`,
            left: `${Math.random() * 100}%`,
            top: '-50px',
          }}
          animate={{
            y: ['0px', '400px'],
          }}
          transition={{
            duration: Math.random() * 0.5 + 0.5,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// ─── Fog & Mist ────────────────────────────────────────────────────────────

function FogEffect({ type }: { type: 'fog' | 'mist' }) {
  const clouds = useMemo(() => Array.from({ length: 5 }), [])
  return (
    <div className="absolute inset-0">
      {clouds.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[60px]"
          style={{
            width: `${Math.random() * 300 + 200}px`,
            height: `${Math.random() * 200 + 100}px`,
            left: `${Math.random() * 100 - 20}%`,
            top: `${Math.random() * 100 - 20}%`,
            backgroundColor: type === 'fog' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)',
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 50 - 25],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Frost ──────────────────────────────────────────────────────────────────

function FrostEffect() {
  const particles = useMemo(() => Array.from({ length: 30 }), [])
  return (
    <div className="absolute inset-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/40 rounded-full blur-[1px]"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

// ─── General Falling (Blossom, Leaves) ──────────────────────────────────────

function FallingParticles({ color, count, speed, horizontal = false }: { color: string, count: number, speed: number, horizontal?: boolean }) {
  const items = useMemo(() => Array.from({ length: count }), [count])
  return (
    <div className="absolute inset-0">
      {items.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 6 + 4}px`,
            backgroundColor: color,
            left: `${Math.random() * (horizontal ? 120 : 100) - (horizontal ? 20 : 0)}%`,
            top: '-20px',
          }}
          animate={{
            y: ['0px', '400px'],
            x: horizontal ? ['0px', '-200px'] : ['0px', `${Math.random() * 40 - 20}px`],
            rotate: [0, 360],
          }}
          transition={{
            duration: (Math.random() * 2 + 3) / speed,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

// ─── Sparkles ───────────────────────────────────────────────────────────────

function SparkleEffect() {
  const dots = useMemo(() => Array.from({ length: 20 }), [])
  return (
    <div className="absolute inset-0">
      {dots.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: '2px',
            height: '2px',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.8)',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  )
}

// ─── Dust (Heatwave) ────────────────────────────────────────────────────────

function DustEffect() {
  const particles = useMemo(() => Array.from({ length: 30 }), [])
  return (
    <div className="absolute inset-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            backgroundColor: 'rgba(210, 180, 140, 0.3)', // Tan/Dust color
            left: `${Math.random() * 120 - 10}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: ['0px', '300px'],
            y: [`0px`, `${Math.random() * 20 - 10}px`],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}
