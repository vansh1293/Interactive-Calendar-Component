'use client'

import React, { memo, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalendarContext } from '@/components/Providers/CalendarProvider'
import { buildMonthGrid, getSelectionState, formatDayNumber } from '@/lib/dates'
import { getHolidaysForMonth } from '@/lib/holidays'
import { toDateString } from '@/types'
import DateCell from './DateCell'
import { DAYS_OF_WEEK } from '@/lib/constants'

const CalendarGrid = memo(function CalendarGrid() {
  const { state, onDragEnter, onDragEnd } = useCalendarContext()
  const { currentMonth, today, selectionStart, selectionEnd, hoverDate } = state

  const grid = useMemo(() => buildMonthGrid(currentMonth), [currentMonth])
  const holidays = useMemo(
    () => getHolidaysForMonth(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  )

  const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`

  // ─── Touch selection proxy ─────────────────────────────────────
  // Standard mouse events like onMouseEnter don't fire during touch moves.
  // This proxy uses elementFromPoint to track the finger across cells.
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!state.isDragging) return
    const touch = e.touches[0]
    const el = document.elementFromPoint(touch.clientX, touch.clientY)
    const dateStr = el?.getAttribute('data-date-str')
    if (dateStr) {
      // Need to handle the date object correctly from the ISO string
      onDragEnter(new Date(dateStr))
    }
  }

  const handleTouchEnd = () => {
    if (state.isDragging) onDragEnd()
  }

  return (
    <div 
      className="flex flex-col gap-1 px-3 sm:px-5 pb-3 sm:pb-3.5 pt-1.5 overflow-hidden touch-action-none sm:touch-pan-y"
      style={{ touchAction: 'pan-y' }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Day headers */}
      <div
        role="row"
        className="grid grid-cols-7 mb-0.5"
        aria-label="Days of the week"
      >
        {DAYS_OF_WEEK.map((day, i) => (
          <div
            key={day}
            role="columnheader"
            aria-label={day}
            className={`
              text-center text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] sm:tracking-widest uppercase py-1
              ${i >= 5 ? 'text-[color:var(--color-weekend)]' : 'text-[color:var(--color-text-muted)]'}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Date grid - Always stable height */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={monthKey}
          role="grid"
          aria-label={`Calendar grid for ${currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ 
            type: 'spring',
            stiffness: 200,
            damping: 35,
            opacity: { duration: 0.3 }
          }}
          className="flex flex-col gap-1 w-full min-h-[269px] sm:min-h-[317px]"
        >
          {grid.map((week, wi) => (
            <div key={wi} role="row" className="grid grid-cols-7 gap-1 h-[44px] sm:h-[52px]">
              {week.map((date) => {
                const selState = getSelectionState({
                  date, today, selectionStart, selectionEnd, hoverDate, currentMonth,
                })
                const holiday = holidays.get(date.getDate()) ?? null
                const dateStr = toDateString(date)
                const dayIndex = (date.getDay() + 6) % 7 // Mon=0, Sun=6
                const isWeekend = dayIndex >= 5

                return (
                  <DateCell
                    key={dateStr}
                    date={date}
                    dateStr={dateStr}
                    selectionState={selState}
                    holiday={holiday}
                    isWeekend={isWeekend}
                    dayNumber={formatDayNumber(date)}
                  />
                )
              })}
            </div>
          ))}

          {/* 
            Vertical Stability Guard: 
            Always renders enough empty rows to reach a total of 6.
          */}
          {Array.from({ length: 6 - grid.length }).map((_, i) => (
            <div key={`spacer-${i}`} className="grid grid-cols-7 gap-1 h-[44px] sm:h-[52px] opacity-0 pointer-events-none" aria-hidden="true">
              <div className="w-full h-full" />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
})

export default CalendarGrid
