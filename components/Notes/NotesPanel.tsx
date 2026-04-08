'use client'

import React, { memo, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalendarContext, useNotesContext } from '@/components/Providers/CalendarProvider'
import { toDateString, toMonthKey } from '@/types'
import { formatFullDate, formatMonthYear, getRangeDayCount } from '@/lib/dates'
import { getHoliday } from '@/lib/holidays'
import { MAX_NOTE_LENGTH } from '@/lib/constants'
import { FileText, Trash2, Calendar, BookOpen, PartyPopper } from 'lucide-react'

const NotesPanel = memo(function NotesPanel() {
  const { state }  = useCalendarContext()
  const { notes, setMonthMemo, setDateNote, deleteMonthMemo, deleteDateNote } = useNotesContext()
  const { currentMonth, selectionStart, selectionEnd } = state

  const monthKey  = toMonthKey(currentMonth)
  const startKey  = selectionStart ? toDateString(selectionStart) : null
  const endKey    = selectionEnd   ? toDateString(selectionEnd)   : null

  const monthMemo = notes.monthMemos[monthKey]?.content ?? ''
  const startNote = startKey ? (notes.dateNotes[startKey]?.content ?? '') : ''

  const rangeDays = getRangeDayCount(selectionStart, selectionEnd)
  const holiday   = selectionStart ? getHoliday(selectionStart) : null

  const handleMonthMemo = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    if (val.length > MAX_NOTE_LENGTH) return
    val ? setMonthMemo(monthKey, val) : deleteMonthMemo(monthKey)
  }, [monthKey, setMonthMemo, deleteMonthMemo])

  const handleDateNote = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!startKey) return
    const val = e.target.value
    if (val.length > MAX_NOTE_LENGTH) return
    val ? setDateNote(startKey, val) : deleteDateNote(startKey)
  }, [startKey, setDateNote, deleteDateNote])

  const textareaClass = `
    w-full resize-none rounded-xl border border-[color:var(--color-border)]
    bg-[color:var(--color-bg-card)] text-[color:var(--color-text-primary)]
    placeholder:text-[color:var(--color-text-muted)] text-sm leading-relaxed
    p-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-border-focus)]
    transition-shadow duration-150 shadow-[var(--shadow-notes)]
    scrollbar-thin
  `

  return (
    <div className="notes-panel flex flex-col gap-4 h-full overflow-y-auto px-1">

      {/* ── Month Memo ───────────────────────────────────────── */}
      <section aria-labelledby="month-memo-label">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={14} className="text-[color:var(--color-primary)]" />
          <h3 id="month-memo-label" className="text-xs font-bold tracking-wider uppercase text-[color:var(--color-text-secondary)]">
            {formatMonthYear(currentMonth)} Memo
          </h3>
          {monthMemo && (
            <button
              onClick={() => deleteMonthMemo(monthKey)}
              aria-label="Clear month memo"
              className="ml-auto p-1 rounded hover:bg-[color:var(--color-bg-cell-hover)] text-[color:var(--color-text-muted)] hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
        <textarea
          id="month-memo"
          value={monthMemo}
          onChange={handleMonthMemo}
          placeholder={`Jot down anything for ${formatMonthYear(currentMonth)}…`}
          rows={4}
          maxLength={MAX_NOTE_LENGTH}
          aria-label={`Notes for ${formatMonthYear(currentMonth)}`}
          className={textareaClass}
        />
        <p className="text-right text-[10px] text-[color:var(--color-text-muted)] mt-1">
          {monthMemo.length}/{MAX_NOTE_LENGTH}
        </p>
      </section>

      {/* ── Date-Specific Section ─────────────────────────────── */}
      <AnimatePresence mode="wait">
        {selectionStart && (
          <motion.section
            key={startKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            aria-labelledby="date-note-label"
            className="flex flex-col gap-4"
          >
            {/* Festive Banner */}
            {holiday && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative overflow-hidden p-4 rounded-2xl border bg-gradient-to-br from-[color:var(--color-primary-light)] to-[color:var(--color-bg-card)] border-[color:var(--color-primary)]/30 shadow-sm"
              >
                <div className="absolute -right-2 -top-2 opacity-10 rotate-12">
                  <PartyPopper size={64} />
                </div>
                <div className="relative z-10 flex items-start gap-3">
                  <span className="text-3xl" role="img" aria-label="festival icon">{holiday.emoji}</span>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-[color:var(--color-primary)] leading-tight">
                      {holiday.name}
                    </h4>
                    {holiday.tagline && (
                      <p className="text-[11px] italic font-medium text-[color:var(--color-text-secondary)] mt-1 opacity-80">
                        "{holiday.tagline}"
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[color:var(--color-secondary)]" />
                <h3 id="date-note-label" className="text-xs font-bold tracking-wider uppercase text-[color:var(--color-text-secondary)]">
                  {rangeDays && rangeDays > 1
                    ? `${rangeDays}-day range note`
                    : formatFullDate(selectionStart)
                  }
                </h3>
                {startNote && (
                  <button
                    onClick={() => startKey && deleteDateNote(startKey)}
                    aria-label="Clear date note"
                    className="ml-auto p-1 rounded hover:bg-[color:var(--color-bg-cell-hover)] text-[color:var(--color-text-muted)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              {rangeDays && rangeDays > 1 && (
                <p className="text-[11px] text-[color:var(--color-text-muted)] mb-2 ml-1">
                  {formatFullDate(selectionStart!)} → {formatFullDate(selectionEnd!)}
                </p>
              )}

              <textarea
                value={startNote}
                onChange={handleDateNote}
                placeholder={
                  rangeDays && rangeDays > 1
                    ? `Notes for this ${rangeDays}-day range…`
                    : `Add a note for ${selectionStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}…`
                }
                rows={4}
                maxLength={MAX_NOTE_LENGTH}
                aria-label={`Note for selected date`}
                className={textareaClass}
              />
              <p className="text-right text-[10px] text-[color:var(--color-text-muted)] mt-1">
                {startNote.length}/{MAX_NOTE_LENGTH}
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Empty state ──────────────────────────────────────── */}
      {!selectionStart && !monthMemo && (
        <div className="flex flex-col items-center justify-center py-6 text-center gap-2 opacity-75">
          <FileText size={28} className="text-[color:var(--color-text-muted)]" />
          <p className="text-xs text-[color:var(--color-text-muted)]">
            Click a date to add a note,<br />or use the month memo above
          </p>
        </div>
      )}
    </div>
  )
})

export default NotesPanel
