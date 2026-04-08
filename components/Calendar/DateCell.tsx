'use client'

import React, { memo, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalendarContext } from '@/components/Providers/CalendarProvider'
import { useEventsContext } from '@/components/Providers/CalendarProvider'
import { useNotesContext } from '@/components/Providers/CalendarProvider'
import type { SelectionState, Holiday } from '@/types'
import type { DateString } from '@/types'
import { FileText } from 'lucide-react'
import { isSameMonth, isInRange } from '@/lib/dates'
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
  const { notes, hoveredNoteId }  = useNotesContext()

  const isOtherMonth = selectionState === 'other-month'
  const isToday      = selectionState.startsWith('today')
  const isStart      = selectionState === 'start' || selectionState === 'today-start'
  const isEnd        = selectionState === 'end'   || selectionState === 'today-end'
  const isPartOfSelectionRange = selectionState === 'in-range' || selectionState === 'today-in-range'
  const isSelected   = isStart || isEnd

  const dayEvents = events
    .filter(e => e.date === dateStr)
    .slice(0, MAX_EVENTS_PER_DAY)

  const matchingNotes = useMemo(() => {
    return notes.dateNotes.filter(n => {
      const start = new Date(n.startDate)
      const end = n.endDate ? new Date(n.endDate) : start
      return isInRange(date, start, end)
    })
  }, [notes.dateNotes, date])

  const hasNote    = matchingNotes.length > 0
  const noteCount  = matchingNotes.length
  const hasHoliday = !!holiday

  const isHoveredByNote = useMemo(() => {
    if (!hoveredNoteId) return false
    const note = notes.dateNotes.find(n => n.id === hoveredNoteId)
    if (!note) return false
    const start = new Date(note.startDate)
    const end = note.endDate ? new Date(note.endDate) : start
    return isInRange(date, start, end)
  }, [notes.dateNotes, hoveredNoteId, date])

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
    if (isOtherMonth)  return 'opacity-50 cursor-default pointer-events-none'
    if (isStart || isEnd) return `
      bg-[color:var(--color-bg-selected)] text-[color:var(--color-text-on-accent)]
      shadow-[var(--shadow-cell)] scale-105 z-10
    `
    if (isPartOfSelectionRange) return `bg-[color:var(--color-bg-in-range)]`
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
    if (isPartOfSelectionRange)  return 'text-[color:var(--color-primary)]'
    return 'text-[color:var(--color-text-primary)]'
  })()

  return (
    <motion.div
      role="gridcell"
      tabIndex={isOtherMonth ? -1 : 0}
      aria-label={`${date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${isToday ? ', Today' : ''}${isStart ? ', Range Start' : ''}${isEnd ? ', Range End' : ''}${holiday ? `, Holiday: ${holiday.name}` : ''}`}
      aria-selected={isStart || isEnd || isPartOfSelectionRange}
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
      {isPartOfSelectionRange && (
        <div className="absolute inset-0 rounded-none bg-[color:var(--color-bg-in-range)] -z-10" />
      )}

      {/* Hover Highlight (Hover Sync) */}
      <AnimatePresence>
        {isHoveredByNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 border-2 border-[color:var(--color-primary)] rounded-[12px] shadow-[0_0_15px_rgba(var(--rgb-primary),0.3)] z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Day number */}
      <span className={`${numberBase} ${numberState}`}>
        {dayNumber}
      </span>

      {/* Holiday indicator */}
      {hasHoliday && (
        <motion.span
          title={holiday!.name}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs leading-none mb-0.5"
          aria-label={`Holiday: ${holiday!.name}`}
        >
          {holiday!.emoji}
        </motion.span>
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

      {/* Note indicator icon */}
      {hasNote && !isSelected && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 p-0.5 px-1 rounded-md bg-[color:var(--color-primary)] shadow-sm"
        >
          <FileText size={8} className="text-white" />
          {noteCount > 1 && (
            <span className="text-[7px] font-bold text-white leading-none">
              {noteCount}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  )
})

export default DateCell
