'use client'

import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalendarContext } from '@/components/Providers/CalendarProvider'
import CalendarHeader from './CalendarHeader'
import CalendarGrid   from './CalendarGrid'
import NotesPanel     from '@/components/Notes/NotesPanel'
import { getRangeDayCount, formatShortDate } from '@/lib/dates'
import { X, Focus } from 'lucide-react'

const CalendarCard = memo(function CalendarCard() {
  const { state, clearSelection, toggleFocus } = useCalendarContext()
  const { selectionStart, selectionEnd, focusMode } = state
  const rangeDays = getRangeDayCount(selectionStart, selectionEnd)

  return (
    <div className="relative w-full max-w-[1330px] mx-auto">

      {/* ── Focus mode overlay ───────────────────────────────── */}
      <AnimatePresence>
        {focusMode && selectionStart && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-0 pointer-events-none"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Selection toolbar — only shows when a date is picked ── */}
      <AnimatePresence>
        {selectionStart && (
          <motion.div
            key="toolbar"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center mb-4"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                borderColor: 'var(--color-border-focus)',
              }}
            >
              <span className="font-semibold text-xs" style={{ color: 'var(--color-primary)' }}>
                {rangeDays && rangeDays > 1
                  ? `${formatShortDate(selectionStart)} → ${selectionEnd ? formatShortDate(selectionEnd) : '…'} (${rangeDays} days)`
                  : formatShortDate(selectionStart)
                }
              </span>
              <button
                onClick={toggleFocus}
                title={focusMode ? 'Exit focus' : 'Focus mode'}
                aria-label={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
                className="p-0.5 rounded transition-colors"
                style={{ color: 'var(--color-primary)' }}
              >
                <Focus size={12} />
              </button>
              <button
                onClick={clearSelection}
                aria-label="Clear date selection"
                className="p-0.5 rounded transition-colors"
                style={{ color: 'var(--color-primary)' }}
              >
                <X size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main card ─────────────────────────────────────────── */}
      <div
        className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_390px] rounded-[24px] overflow-hidden"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        {/* Calendar */}
        <article
          className="flex flex-col"
          style={{ backgroundColor: 'var(--color-bg-card)' }}
          aria-label="Interactive calendar"
        >
          <CalendarHeader />
          <CalendarGrid />
        </article>

        {/* Notes */}
        <aside
          className="p-7 flex flex-col gap-4 min-h-[320px] lg:min-h-0 border-t lg:border-t-0 lg:border-l"
          style={{
            backgroundColor: 'var(--color-bg-notes)',
            borderColor: 'var(--color-border)',
          }}
          aria-label="Notes and memos"
        >
          <header className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Notes</h2>
          </header>
          <NotesPanel />
        </aside>
      </div>

      {/* ── ARIA live region ─────────────────────────────────── */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {selectionStart && !selectionEnd && `Range start: ${selectionStart.toLocaleDateString()}. Click another date to complete range.`}
        {selectionStart && selectionEnd && `Range: ${formatShortDate(selectionStart)} to ${formatShortDate(selectionEnd)}, ${rangeDays} days.`}
      </div>
    </div>
  )
})

export default CalendarCard
