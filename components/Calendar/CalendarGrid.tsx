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
  const { state } = useCalendarContext()
  const { currentMonth, today, selectionStart, selectionEnd, hoverDate } = state

  const grid = useMemo(() => buildMonthGrid(currentMonth), [currentMonth])
  const holidays = useMemo(
    () => getHolidaysForMonth(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  )

  const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`

  return (
    <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
      {/* Day headers */}
      <div
        role="row"
        className="grid grid-cols-7 mb-1"
        aria-label="Days of the week"
      >
        {DAYS_OF_WEEK.map((day, i) => (
          <div
            key={day}
            role="columnheader"
            aria-label={day}
            className={`
              text-center text-[11px] font-semibold tracking-widest uppercase py-1
              ${i >= 5 ? 'text-[color:var(--color-weekend)]' : 'text-[color:var(--color-text-muted)]'}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={monthKey}
          role="grid"
          aria-label={`Calendar grid for ${currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex flex-col gap-1"
        >
          {grid.map((week, wi) => (
            <div key={wi} role="row" className="grid grid-cols-7 gap-1">
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
        </motion.div>
      </AnimatePresence>
    </div>
  )
})

export default CalendarGrid
