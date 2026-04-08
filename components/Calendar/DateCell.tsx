'use client'

import React, { memo, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useCalendarContext } from '@/components/Providers/CalendarProvider'
import { useEventsContext } from '@/components/Providers/CalendarProvider'
import { useNotesContext } from '@/components/Providers/CalendarProvider'
import type { SelectionState, Holiday } from '@/types'
import type { DateString } from '@/types'
import { toMonthKey } from '@/types'
import { isSameMonth } from '@/lib/dates'
import { MAX_EVENTS_PER_DAY } from '@/lib/constants'

interface DateCellProps {
  date:           Date
  dateStr:        DateString
  selectionState: SelectionState
  holiday:        Holiday | null
  isWeekend:      boolean
  dayNumber:      string
}

const DateCell = memo(function DateCell({
  date, dateStr, selectionState, holiday, isWeekend, dayNumber,
}: DateCellProps) {
  const { state, onDateClick, onDateHover, onDragStart, onDragEnter, onDragEnd } = useCalendarContext()
  const { events } = useEventsContext()
  const { notes }  = useNotesContext()

  const isOtherMonth = selectionState === 'other-month'
  const isToday      = selectionState.startsWith('today')
  const isStart      = selectionState === 'start' || selectionState === 'today-start'
  const isEnd        = selectionState === 'end'   || selectionState === 'today-end'
  const isInRange    = selectionState === 'in-range' || selectionState === 'today-in-range'
  const isSelected   = isStart || isEnd

  const dayEvents = events
    .filter(e => e.date === dateStr)
    .slice(0, MAX_EVENTS_PER_DAY)

  const hasNote    = !!notes.dateNotes[dateStr]?.content
  const hasHoliday = !!holiday

  // ── Event handlers ────────────────────────────────────────────
  const handleClick = useCallback(() => {
    if (!isOtherMonth) onDateClick(date)
  }, [isOtherMonth, onDateClick, date])

  const handleMouseEnter = useCallback(() => {
    onDateHover(date)
  }, [onDateHover, date])

  const handleMouseLeave = useCallback(() => {
    onDateHover(null)
  }, [onDateHover])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (!isOtherMonth) onDragStart(date)
  }, [isOtherMonth, onDragStart, date])

  const handleMouseEnterDrag = useCallback(() => {
    onDragEnter(date)
  }, [onDragEnter, date])

  const handleMouseUp = useCallback(() => {
    onDragEnd()
  }, [onDragEnd])

  // ── CSS classes ───────────────────────────────────────────────
  const cellBase = `
    relative flex flex-col items-center justify-start
    min-h-[58px] w-full pt-1.5 pb-1 px-1 rounded-[12px]
    cursor-pointer select-none outline-none
    transition-all duration-150 ease-out
  `

  const cellState = (() => {
    if (isOtherMonth)  return 'opacity-25 cursor-default pointer-events-none'
    if (isStart || isEnd) return `
      bg-[color:var(--color-bg-selected)] text-[color:var(--color-text-on-accent)]
      shadow-[var(--shadow-cell)] scale-105 z-10
    `
    if (isInRange) return `bg-[color:var(--color-bg-in-range)]`
    return `hover:bg-[color:var(--color-bg-cell-hover)]`
  })()

  const numberBase = `
    text-[15px] font-semibold leading-none mb-1
    w-8 h-8 flex items-center justify-center rounded-full
    transition-all duration-150
  `

  const numberState = (() => {
    if (isSelected) return 'text-[color:var(--color-text-on-accent)]'
    if (isToday)    return `
      text-[color:var(--color-secondary)] font-bold
      ring-2 ring-[color:var(--color-today-ring)] ring-offset-1
      animate-pulse-ring
    `
    if (isWeekend)  return 'text-[color:var(--color-text-weekend)]'
    if (isInRange)  return 'text-[color:var(--color-primary)]'
    return 'text-[color:var(--color-text-primary)]'
  })()

  return (
    <motion.div
      role="gridcell"
      tabIndex={isOtherMonth ? -1 : 0}
      aria-label={`${date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${isToday ? ', Today' : ''}${isStart ? ', Range Start' : ''}${isEnd ? ', Range End' : ''}${holiday ? `, Holiday: ${holiday.name}` : ''}`}
      aria-selected={isStart || isEnd || isInRange}
      aria-current={isToday ? 'date' : undefined}
      className={`${cellBase} ${cellState}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseEnterDrag}
      onMouseUp={handleMouseUp}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
      whileTap={{ scale: isOtherMonth ? 1 : 0.93 }}
    >
      {/* In-range left/right edge rounding */}
      {isInRange && (
        <div className="absolute inset-0 rounded-none bg-[color:var(--color-bg-in-range)] -z-10" />
      )}

      {/* Day number */}
      <span className={`${numberBase} ${numberState}`}>
        {dayNumber}
      </span>

      {/* Holiday indicator */}
      {hasHoliday && (
        <span
          title={holiday!.name}
          className="text-[9px] leading-none mb-0.5 text-[color:var(--color-holiday)]"
          aria-label={`Holiday: ${holiday!.name}`}
        >
          {holiday!.emoji}
        </span>
      )}

      {/* Event chips */}
      {dayEvents.length > 0 && (
        <div className="flex gap-0.5 flex-wrap justify-center w-full px-0.5">
          {dayEvents.map(ev => (
            <span
              key={ev.id}
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: `var(--color-event-${ev.category})` }}
              aria-label={ev.title}
            />
          ))}
        </div>
      )}

      {/* Note indicator dot */}
      {hasNote && !isSelected && (
        <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[color:var(--color-primary)] animate-dot-pop" />
      )}
    </motion.div>
  )
})

export default DateCell
