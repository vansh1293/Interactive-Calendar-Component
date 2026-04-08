'use client'

import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCalendarContext } from '@/components/Providers/CalendarProvider'
import { formatMonthName, formatYear } from '@/lib/dates'
import { MONTH_IMAGES } from '@/lib/constants'
import { MONTH_ENVIRONMENTS } from '@/lib/backgrounds'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import ClimateAlert from '@/components/UI/ClimateAlert'

const CalendarHeader = memo(function CalendarHeader() {
  const { state, goNextMonth, goPrevMonth, goToToday } = useCalendarContext()
  const { currentMonth, today } = state

  const monthIndex = currentMonth.getMonth()
  const imageSrc = MONTH_IMAGES[monthIndex]
  const monthKey = `${currentMonth.getFullYear()}-${monthIndex}`
  const env = MONTH_ENVIRONMENTS[monthIndex]
  const isCurrentMonth = currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth()

  // Pre-loading logic for professional smoothness
  const nextMonthIdx = (monthIndex + 1) % 12
  const prevMonthIdx = (monthIndex + 11) % 12
  const nextSrc = MONTH_IMAGES[nextMonthIdx]
  const prevSrc = MONTH_IMAGES[prevMonthIdx]

  return (
    <div className="relative overflow-hidden rounded-t-[24px]" style={{ height: '286px' }}>
      {/* ── Hero image with true crossfade ─────────────────── */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={monthKey}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <Image
            src={imageSrc}
            alt={`${formatMonthName(currentMonth)} hero image`}
            fill
            className="object-cover"
            priority={monthIndex === today.getMonth()}
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </motion.div>
      </AnimatePresence>

      {/* Hidden Pre-loaders for neighboring months */}
      <div className="hidden sr-only" aria-hidden="true">
        <Image src={nextSrc} alt="" width={1} height={1} priority={false} />
        <Image src={prevSrc} alt="" width={1} height={1} priority={false} />
      </div>

      {/* ── Gradient overlay ────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* ── Spiral binding ─────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 flex justify-evenly px-6 pt-2.5 z-10 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="w-[10px] h-[10px] rounded-full border-[2px] border-[color:var(--color-spiral)] bg-[color:var(--color-bg-card)]"
            style={{
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.05)'
            }}
          />
        ))}
      </div>

      {/* ── Dynamic Climate/Weather Alert ──────────────────── */}
      <div className="absolute top-14 right-6 z-20">
        <ClimateAlert month={monthIndex} />
      </div>

      <div className="absolute bottom-4 left-5 z-10">

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`label-${monthKey}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-white/70 text-sm font-semibold tracking-[0.2em] uppercase">
              {formatYear(currentMonth)}
            </p>
            <h2
              className="text-white font-display text-5xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {formatMonthName(currentMonth)}
            </h2>
            {/* Environment mood badge */}
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-[10px]">
                {env.particle === 'fog' ? '🌫️' :
                  env.particle === 'sparkles' ? '✨' :
                    env.particle === 'blossom' ? '🌸' :
                      env.particle === 'dust' ? '🌪️' :
                        env.particle === 'stormLeaves' ? '🌬️' :
                          env.particle === 'rain' ? '🌧️' : '·'}
              </span>
              <span className="text-[10px] font-semibold text-white tracking-wider">
                {env.mood}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation controls ────────────────────────────── */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        {!isCurrentMonth && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={goToToday}
            title="Jump to today"
            aria-label="Jump to today"
            className="
              p-1.5 rounded-full bg-white/20 backdrop-blur-sm
              text-white hover:bg-white/35 transition-colors duration-150
              focus-visible:ring-2 focus-visible:ring-white
            "
          >
            <RotateCcw size={14} strokeWidth={2.5} />
          </motion.button>
        )}

        <button
          onClick={goPrevMonth}
          aria-label="Previous month"
          className="
            p-2 rounded-full bg-white/20 backdrop-blur-sm
            text-white hover:bg-white/35 active:scale-95
            transition-all duration-150 focus-visible:ring-2 focus-visible:ring-white
          "
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        <button
          onClick={goNextMonth}
          aria-label="Next month"
          className="
            p-2 rounded-full bg-white/20 backdrop-blur-sm
            text-white hover:bg-white/35 active:scale-95
            transition-all duration-150 focus-visible:ring-2 focus-visible:ring-white
          "
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
})

export default CalendarHeader
