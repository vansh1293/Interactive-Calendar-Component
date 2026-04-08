'use client'

import React, { memo, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalendarContext, useNotesContext } from '@/components/Providers/CalendarProvider'
import { toDateString, toMonthKey, DateString, Note } from '@/types'
import { formatFullDate, formatMonthYear, getRangeDayCount, isInRange } from '@/lib/dates'
import { getHoliday } from '@/lib/holidays'
import { MAX_NOTE_LENGTH } from '@/lib/constants'
import { FileText, Trash2, Calendar, BookOpen, PartyPopper, Plus, Sparkles } from 'lucide-react'

// ─── Sub-component: Individual Note Card ─────────────────────────────────────

const NoteCard = memo(function NoteCard({ 
  note, onUpdate, onDelete, onHover, textareaClass 
}: { 
  note: Note, onUpdate: (val: string) => void, onDelete: () => void, onHover: (hovering: boolean) => void, textareaClass: string, selectionStart: Date 
}) {
  const rangeDays = getRangeDayCount(new Date(note.startDate), note.endDate ? new Date(note.endDate) : new Date(note.startDate)) || 1
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-[color:var(--color-bg-card)] border border-[color:var(--color-border)] shadow-sm hover:border-[color:var(--color-primary)] transition-colors group/card"
    >
       <div className="flex items-center gap-1.5 mb-0.5">
          <div className="p-1 rounded bg-[color:var(--color-bg-cell-hover)]">
            <Calendar size={9} className="text-[color:var(--color-primary)]" />
          </div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            {rangeDays > 1 ? `${rangeDays}-Day Range` : 'Single Day'}
          </span>
          <button 
            onClick={onDelete}
            aria-label="Delete note"
            className="ml-auto p-1 rounded-lg hover:bg-red-50 text-[color:var(--color-text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover/card:opacity-100"
          >
            <Trash2 size={11} />
          </button>
       </div>
       
       {rangeDays > 1 && (
         <div className="text-[10px] font-bold text-[color:var(--color-text-secondary)] mb-0.5 px-0.5">
            {formatFullDate(new Date(note.startDate))} → {formatFullDate(new Date(note.endDate!))}
         </div>
       )}

       <textarea
         value={note.content}
         onChange={(e) => onUpdate(e.target.value)}
         placeholder="Type your notes here..."
         rows={3}
         maxLength={MAX_NOTE_LENGTH}
         className={textareaClass}
       />
       <div className="text-[9px] font-medium text-right text-[color:var(--color-text-muted)] mt-1 px-1">
         {note.content.length}/{MAX_NOTE_LENGTH}
       </div>
    </motion.div>
  )
})

// ─── Main Component: Notes Panel ─────────────────────────────────────────────

const NotesPanel = memo(function NotesPanel() {
  const { state, onDateClick }  = useCalendarContext()
  const { notes, hoveredNoteId, setMonthMemo, setDateNote, deleteMonthMemo, deleteDateNote, setHoveredNoteId } = useNotesContext()
  const { currentMonth, selectionStart, selectionEnd } = state

  const monthKey  = toMonthKey(currentMonth)
  const startKey  = selectionStart ? toDateString(selectionStart) : null
  const endKey    = selectionEnd   ? toDateString(selectionEnd)   : null

  const monthMemoData = notes.monthMemos[monthKey]
  const monthMemo = monthMemoData?.content ?? ''

  const holiday = selectionStart ? getHoliday(selectionStart) : null

  const monthNotes = useMemo(() => {
    return notes.dateNotes
      .filter(n => n.startDate.startsWith(monthKey))
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
  }, [notes.dateNotes, monthKey])

  // Find ALL overlapping notes for the current selection
  const activeNotes = useMemo(() => {
    if (!selectionStart) return []
    return notes.dateNotes.filter(n => {
      const start = new Date(n.startDate)
      const end = n.endDate ? new Date(n.endDate) : start
      return isInRange(selectionStart, start, end)
    }).sort((a, b) => b.updatedAt - a.updatedAt) // Most recent first
  }, [selectionStart, notes.dateNotes])

  const handleMonthMemo = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    if (val.length > MAX_NOTE_LENGTH) return
    val ? setMonthMemo(monthKey, val) : deleteMonthMemo(monthKey)
  }, [monthKey, setMonthMemo, deleteMonthMemo])

  const handleAddNewNote = useCallback(() => {
    if (!startKey) return
    setDateNote(null, "", startKey, endKey || undefined)
  }, [startKey, endKey, setDateNote])

  const textareaClass = `
    w-full resize-none rounded-xl border border-[color:var(--color-border)]
    bg-[color:var(--color-bg-card)] text-[color:var(--color-text-primary)]
    placeholder:text-[color:var(--color-text-muted)] text-[13px] leading-relaxed
    p-2.5 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-border-focus)]
    transition-shadow duration-150 shadow-[var(--shadow-notes)]
    scrollbar-thin
  `

  return (
    <div className="notes-panel flex flex-col gap-5 lg:h-full lg:overflow-y-auto px-1 pb-8 scrollbar-thin">

      {/* ── Month Memo ───────────────────────────────────────── */}
      <section aria-labelledby="month-memo-label" className="space-y-2.5">
        <div className="flex items-center gap-2 mb-1.5 px-0.5">
          <BookOpen size={13} className="text-[color:var(--color-primary)]" />
          <h3 id="month-memo-label" className="text-[11px] font-bold tracking-widest uppercase text-[color:var(--color-text-secondary)]">
            {formatMonthYear(currentMonth)} Memo
          </h3>
          {monthMemo && (
            <button
              onClick={() => deleteMonthMemo(monthKey)}
              aria-label="Clear month memo"
              className="ml-auto p-1 rounded-lg hover:bg-red-50 text-[color:var(--color-text-muted)] hover:text-red-500 transition-colors"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
        <textarea
          id="month-memo"
          value={monthMemo}
          onChange={handleMonthMemo}
          placeholder={`Global notes for ${formatMonthYear(currentMonth)}…`}
          rows={3}
          maxLength={MAX_NOTE_LENGTH}
          aria-label={`Notes for ${formatMonthYear(currentMonth)}`}
          className={textareaClass}
        />
        <p className="text-right text-[9px] font-medium text-[color:var(--color-text-muted)] mt-1 px-1">
          {monthMemo.length}/{MAX_NOTE_LENGTH}
        </p>
      </section>

      {/* ── Dynamic Content Section (Selection vs Summary) ─────── */}
      <AnimatePresence mode="wait">
        {selectionStart ? (
          <motion.section
            key="date-editor-stack"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Festive Banner */}
            {holiday && (
              <motion.div className="relative overflow-hidden p-4 rounded-2xl border bg-gradient-to-br from-[color:var(--color-primary-light)] to-[color:var(--color-bg-card)] border-[color:var(--color-primary)]/30 shadow-sm">
                <div className="absolute -right-2 -top-2 opacity-10 rotate-12">
                  <PartyPopper size={64} />
                </div>
                <div className="relative z-10 flex items-start gap-3">
                  <span className="text-3xl" role="img">{holiday.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[color:var(--color-primary)] leading-tight">{holiday.name}</h4>
                    {holiday.tagline && <p className="text-[11px] italic font-medium text-[color:var(--color-text-secondary)] mt-1 opacity-80">"{holiday.tagline}"</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Selection Header */}
            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-1.5">
                 <Calendar size={13} className="text-[color:var(--color-secondary)]" />
                 <h3 className="text-[11px] font-extrabold tracking-widest uppercase text-[color:var(--color-text-secondary)]">
                   {activeNotes.length > 1 ? `Notes (${activeNotes.length})` : 'Day Notes'}
                 </h3>
               </div>
               <button 
                 onClick={handleAddNewNote}
                 className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-dark)] transition-all text-[9.5px] font-bold shadow-md active:scale-95"
               >
                 <Plus size={11} />
                 <span>ADD NEW</span>
               </button>
            </div>

            <div className="flex flex-col gap-4">
              {activeNotes.length > 0 ? (
                activeNotes.map((note, idx) => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onUpdate={(val) => setDateNote(note.id, val, note.startDate, note.endDate)}
                    onDelete={() => deleteDateNote(note.id)}
                    onHover={(hovering) => setHoveredNoteId(hovering ? note.id : null)}
                    textareaClass={textareaClass}
                    selectionStart={selectionStart}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                   <div className="p-3 bg-[color:var(--color-primary-light)] rounded-xl border border-[color:var(--color-primary)]/20 flex items-center gap-3">
                     <Sparkles size={16} className="text-[color:var(--color-primary)]" />
                     <p className="text-[11px] font-bold text-[color:var(--color-primary)] uppercase tracking-wider">
                       First time here? Just click below to start.
                     </p>
                   </div>
                   <button 
                     onClick={handleAddNewNote}
                     className="w-full p-8 rounded-[2rem] border-2 border-dashed border-[color:var(--color-border)] flex flex-col items-center justify-center text-center gap-3 bg-[color:var(--color-bg-card)]/30 hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-light)]/10 transition-all group"
                   >
                      <div className="p-4 rounded-full bg-[color:var(--color-bg-cell-hover)] text-[color:var(--color-text-muted)] group-hover:scale-110 transition-transform">
                        <Plus size={32} strokeWidth={2.5} />
                      </div>
                      <p className="text-xs text-[color:var(--color-text-muted)] font-bold group-hover:text-[color:var(--color-primary)]">
                        Tap here to create your first note<br/> 
                        <span className="opacity-60 font-medium">for {formatFullDate(selectionStart)}</span>
                      </p>
                   </button>
                </motion.div>
              )}
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="month-summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <FileText size={14} className="text-[color:var(--color-primary)]" />
              <h3 className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-text-secondary)]">
                Month Summary
              </h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {monthNotes.length > 0 ? (
                monthNotes.map((note) => {
                  const date = new Date(note.startDate)
                  const holiday = getHoliday(date)
                  return (
                    <motion.div
                      key={note.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onDateClick(date)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onDateClick(date)
                        }
                      }}
                      onMouseEnter={() => setHoveredNoteId(note.id)}
                      onMouseLeave={() => setHoveredNoteId(null)}
                      whileHover={{ x: 4 }}
                      className="flex flex-col gap-2 p-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] hover:border-[color:var(--color-primary)] transition-all text-left shadow-sm group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold text-[color:var(--color-primary)]">
                          {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          {note.endDate && (
                            <span className="ml-1 opacity-40">
                              → {new Date(note.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </span>
                        {holiday && <span className="text-xs">{holiday.emoji}</span>}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteDateNote(note.id)
                          }}
                          aria-label="Delete note"
                          className="ml-auto p-1.5 rounded-lg hover:bg-red-50 text-[color:var(--color-text-muted)] hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 scale-90 hover:scale-110"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <p className="text-xs text-[color:var(--color-text-secondary)] line-clamp-2 leading-relaxed font-medium">
                        {note.content}
                      </p>
                    </motion.div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4 opacity-50">
                  <FileText size={48} className="text-[color:var(--color-text-muted)]" strokeWidth={1} />
                  <p className="text-xs text-[color:var(--color-text-muted)] font-bold uppercase tracking-wider">
                    Empty Horizon
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
})

export default NotesPanel
