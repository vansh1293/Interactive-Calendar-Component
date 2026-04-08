'use client'

import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalendarContext } from '@/components/Providers/CalendarProvider'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import NotesPanel from '@/components/Notes/NotesPanel'
import { getRangeDayCount, formatShortDate } from '@/lib/dates'
import { X, Focus } from 'lucide-react'

const CalendarCard = memo(function CalendarCard() {
  const { state, clearSelection, toggleFocus } = useCalendarContext()
  const { selectionStart, selectionEnd, focusMode } = state
  const rangeDays = getRangeDayCount(selectionStart, selectionEnd)

  return (
    <div className="relative w-full max-w-[940px] mx-auto transition-all duration-300 transform">

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
      <div className="min-h-8 mb-2 flex items-center">
        <AnimatePresence>
          {selectionStart && (
            <motion.div
              key="toolbar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center flex-wrap gap-2"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] shadow-sm max-w-[calc(100vw-4rem)]"
                style={{
                  backgroundColor: 'var(--color-primary-light)',
                  borderColor: 'var(--color-border-focus)',
                }}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-bold truncate" style={{ color: 'var(--color-primary)' }}>
                    {rangeDays && rangeDays > 1
                      ? `${formatShortDate(selectionStart)} → ${selectionEnd ? formatShortDate(selectionEnd) : '…'} (${rangeDays}d)`
                      : formatShortDate(selectionStart)
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1 border-l border-[color:var(--color-primary)]/20 pl-1.5 ml-0.5">
                  <button
                    onClick={toggleFocus}
                    title={focusMode ? 'Exit focus' : 'Focus mode'}
                    className="p-1 rounded hover:bg-white/20 transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <Focus size={11} />
                  </button>
                  <button
                    onClick={clearSelection}
                    className="p-1 rounded hover:bg-white/20 transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <X size={11} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main card ─────────────────────────────────────────── */}
      <div
        className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_310px] rounded-[24px] overflow-hidden"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        {/* Calendar */}
        <article
          className="flex flex-col overflow-hidden"
          style={{ backgroundColor: 'var(--color-bg-card)' }}
          aria-label="Interactive calendar"
        >
          <CalendarHeader />
          <CalendarGrid />
        </article>

        {/* Notes */}
        <aside
          className="p-4 sm:p-6 flex flex-col gap-3.5 min-h-[300px] lg:min-h-0 border-t lg:border-t-0 lg:border-l"
          style={{
            backgroundColor: 'var(--color-bg-notes)',
            borderColor: 'var(--color-border)',
          }}
          aria-label="Notes and memos"
        >
          <header className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>Notes</h2>
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
