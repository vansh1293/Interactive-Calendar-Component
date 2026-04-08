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
  const { state, goNextMonth, goPrevMonth, goToToday, togglePicker, setMonth, setYear } = useCalendarContext()
  const { currentMonth, today } = state

  React.useEffect(() => {
    if (state.activePicker === 'year') {
      const activeEl = document.getElementById('active-year-selection')
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    }
  }, [state.activePicker])

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
    <div className="relative overflow-hidden rounded-t-[24px] h-[190px] sm:h-[220px] lg:h-[254px] transition-all duration-500">
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
            sizes="(max-width: 768px) 100vw, 940px"
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
      <div className="absolute top-0 left-0 right-0 flex justify-evenly px-4 sm:px-6 pt-2 sm:pt-2.5 z-10 pointer-events-none opacity-60 sm:opacity-100">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="w-[6px] h-[6px] sm:w-[10px] sm:h-[10px] rounded-full border border-white/20 sm:border-[2px] border-[color:var(--color-spiral)] bg-[color:var(--color-bg-card)]"
            style={{
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.05)'
            }}
          />
        ))}
      </div>

      {/* ── Dynamic Climate/Weather Alert ──────────────────── */}
      <div className="absolute top-8 sm:top-10 right-4 sm:right-5 z-20">
        <ClimateAlert month={monthIndex} />
      </div>

      <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-6 z-20 max-w-[calc(100%-8rem)]">
        <div key={`header-nav-${monthKey}`} className="flex items-center gap-2 sm:gap-3 relative h-8 sm:h-10">

          {/* Month Range Selector */}
          <div className="relative group cursor-pointer" onClick={() => togglePicker(state.activePicker === 'month' ? null : 'month')}>
            <div className={`flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 border border-white/10 hover:bg-white/20 transition-all ${state.activePicker === 'month' ? 'ring-1 ring-white/30 bg-white/10' : ''}`}>
              <h2
                className="text-white font-serif text-lg sm:text-xl font-bold leading-none select-none"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {formatMonthName(currentMonth)}
              </h2>
              <ChevronLeft className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${state.activePicker === 'month' ? 'rotate-90' : '-rotate-90'}`} />
            </div>

            {/* Month Dropdown Menu */}
            <AnimatePresence>
              {state.activePicker === 'month' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full left-0 mb-3 w-48 sm:w-56 bg-black/70 shadow-2xl backdrop-blur-2xl rounded-2xl border border-white/20 p-2 grid grid-cols-3 gap-1 z-50 text-white"
                >
                  {Array.from({ length: 12 }, (_, i) => i).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMonth(m)}
                      className={`
                        px-1 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all
                        ${currentMonth.getMonth() === m
                          ? 'bg-[color:var(--color-primary)] text-white'
                          : 'text-white/70 hover:bg-white/10'}
                      `}
                    >
                      {new Date(2000, m, 1).toLocaleString('default', { month: 'short' })}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-[1px] h-4 sm:h-6 bg-white/10" />

          {/* Year Range Selector */}
          <div className="relative group cursor-pointer" onClick={() => togglePicker(state.activePicker === 'year' ? null : 'year')}>
            <div className={`flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 border border-white/10 hover:bg-white/20 transition-all ${state.activePicker === 'year' ? 'ring-1 ring-white/30 bg-white/10' : ''}`}>
              <span className="text-white/70 text-[11px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors group-hover:text-white select-none translate-y-[1px]">
                {formatYear(currentMonth)}
              </span>
              <ChevronLeft className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40 transition-transform duration-300 ${state.activePicker === 'year' ? 'rotate-90' : '-rotate-90'}`} />
            </div>

            {/* Year Dropdown Menu */}
            <AnimatePresence>
              {state.activePicker === 'year' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full left-0 mb-3 w-28 sm:w-32 bg-black/70 shadow-2xl backdrop-blur-2xl rounded-2xl border border-white/20 p-1.5 flex flex-col gap-0.5 z-50 text-white max-h-[160px] sm:max-h-[190px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20"
                >
                  {Array.from({ length: 51 }, (_, i) => 2000 + i).map((y) => (
                    <button
                      key={y}
                      id={state.activePicker === 'year' && currentMonth.getFullYear() === y ? 'active-year-selection' : undefined}
                      onClick={() => setYear(y)}
                      className={`
                        w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all shrink-0
                        ${currentMonth.getFullYear() === y
                          ? 'bg-[color:var(--color-primary)] text-white shadow-lg'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'}
                      `}
                    >
                      {y}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Environment mood badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10"
          >
            <span className="text-[10px]">
              {env.particle === 'fog' ? '🌫️' :
                env.particle === 'sparkles' ? '✨' :
                  env.particle === 'blossom' ? '🌸' :
                    env.particle === 'dust' ? '🌪️' :
                      env.particle === 'stormLeaves' ? '🌬️' :
                        env.particle === 'rain' ? '🌧️' : '·'}
            </span>
            <span className="text-[9px] font-bold text-white/50 tracking-[0.15em] uppercase">
              {env.mood}
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── Navigation controls ────────────────────────────── */}
      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 flex items-center gap-1 sm:gap-1.5">
        {!isCurrentMonth && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={goToToday}
            className="p-1 sm:p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 transition-colors duration-150"
          >
            <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
          </motion.button>
        )}

        <button
          onClick={goPrevMonth}
          className="p-1 sm:p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>

        <button
          onClick={goNextMonth}
          className="p-1 sm:p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 active:scale-95 transition-all"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
})

CalendarHeader.displayName = 'CalendarHeader'

export default CalendarHeader
