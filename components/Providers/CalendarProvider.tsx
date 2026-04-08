'use client'

import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react'
import type { CalendarState, NotesState, CalendarEvent } from '@/types'
import { storage } from '@/lib/storage'

// ─── Calendar Context ─────────────────────────────────────────────────────────

interface CalendarContextValue {
  state:          CalendarState
  goNextMonth:    () => void
  goPrevMonth:    () => void
  goToToday:      () => void
  goToMonth:      (date: Date) => void
  onDateClick:    (date: Date) => void
  onDateHover:    (date: Date | null) => void
  onDragStart:    (date: Date) => void
  onDragEnter:    (date: Date) => void
  onDragEnd:      () => void
  clearSelection: () => void
  toggleFocus:    () => void
  toggleYearView: () => void
  setViewMode:    (mode: CalendarState['viewMode']) => void
}

const CalendarContext = createContext<CalendarContextValue | null>(null)

export function useCalendarContext(): CalendarContextValue {
  const ctx = useContext(CalendarContext)
  if (!ctx) throw new Error('useCalendarContext must be used within CalendarProvider')
  return ctx
}

// ─── Notes Context ────────────────────────────────────────────────────────────

interface NotesContextValue {
  notes:           NotesState
  setMonthMemo:    (key: string, content: string) => void
  setDateNote:     (key: string, content: string) => void
  deleteMonthMemo: (key: string) => void
  deleteDateNote:  (key: string) => void
}

const NotesContext = createContext<NotesContextValue | null>(null)

export function useNotesContext(): NotesContextValue {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotesContext must be used within CalendarProvider')
  return ctx
}

// ─── Events Context ───────────────────────────────────────────────────────────

interface EventsContextValue {
  events:      CalendarEvent[]
  addEvent:    (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void
  deleteEvent: (id: string) => void
  editEvent:   (id: string, updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>) => void
}

const EventsContext = createContext<EventsContextValue | null>(null)

export function useEventsContext(): EventsContextValue {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEventsContext must be used within CalendarProvider')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function CalendarProvider({ children }: { children: React.ReactNode }) {
  const today = useRef(new Date()).current

  // ── Calendar State ───────────────────────────────────────────────────────
  const [state, setState] = useState<CalendarState>({
    currentMonth:   today,
    today,
    selectionStart: null,
    selectionEnd:   null,
    hoverDate:      null,
    selectionPhase: 'idle',
    isDragging:     false,
    viewMode:       'single',
    focusMode:      false,
    showYearView:   false,
  })

  // ── Notes & Events State ─────────────────────────────────────────────────
  const [notes,  setNotes]  = useState<NotesState>({ monthMemos: {}, dateNotes: {} })
  const [events, setEvents] = useState<CalendarEvent[]>([])

  // ── Hydrate from localStorage ────────────────────────────────────────────
  useEffect(() => {
    setNotes(storage.notes.get())
    setEvents(storage.events.get())
  }, [])

  // ── Sync data-month attribute → triggers CSS palette swap ────────────────
  useEffect(() => {
    const month = state.currentMonth.getMonth()
    document.documentElement.setAttribute('data-month', String(month))
  }, [state.currentMonth])

  // ── Calendar actions ─────────────────────────────────────────────────────
  const goNextMonth = useCallback(() => {
    setState(s => ({ ...s, currentMonth: new Date(s.currentMonth.getFullYear(), s.currentMonth.getMonth() + 1, 1) }))
  }, [])

  const goPrevMonth = useCallback(() => {
    setState(s => ({ ...s, currentMonth: new Date(s.currentMonth.getFullYear(), s.currentMonth.getMonth() - 1, 1) }))
  }, [])

  const goToToday = useCallback(() => {
    setState(s => ({ ...s, currentMonth: today }))
  }, [today])

  const goToMonth = useCallback((date: Date) => {
    setState(s => ({ ...s, currentMonth: date, showYearView: false }))
  }, [])

  const onDateClick = useCallback((date: Date) => {
    setState(s => {
      if (s.selectionPhase === 'idle' || (s.selectionStart && s.selectionEnd)) {
        return { ...s, selectionStart: date, selectionEnd: null, selectionPhase: 'selecting', hoverDate: null }
      }
      const [start, end] = s.selectionStart && date < s.selectionStart
        ? [date, s.selectionStart]
        : [s.selectionStart!, date]
      return { ...s, selectionEnd: end, selectionStart: start, selectionPhase: 'idle', hoverDate: null }
    })
  }, [])

  const onDateHover = useCallback((date: Date | null) => {
    setState(s => s.selectionPhase === 'selecting' ? { ...s, hoverDate: date } : s)
  }, [])

  const onDragStart = useCallback((date: Date) => {
    setState(s => ({ ...s, selectionStart: date, selectionEnd: null, selectionPhase: 'selecting', isDragging: true, hoverDate: date }))
  }, [])

  const onDragEnter = useCallback((date: Date) => {
    setState(s => s.isDragging ? { ...s, hoverDate: date } : s)
  }, [])

  const onDragEnd = useCallback(() => {
    setState(s => {
      if (!s.isDragging) return s
      const end = s.hoverDate
      if (!end || !s.selectionStart) return { ...s, isDragging: false, selectionPhase: 'idle' }
      const [start, finalEnd] = end < s.selectionStart ? [end, s.selectionStart] : [s.selectionStart, end]
      return { ...s, selectionStart: start, selectionEnd: finalEnd, hoverDate: null, isDragging: false, selectionPhase: 'idle' }
    })
  }, [])

  const clearSelection = useCallback(() => {
    setState(s => ({ ...s, selectionStart: null, selectionEnd: null, selectionPhase: 'idle', hoverDate: null }))
  }, [])

  const toggleFocus = useCallback(() => {
    setState(s => ({ ...s, focusMode: !s.focusMode }))
  }, [])

  const toggleYearView = useCallback(() => {
    setState(s => ({ ...s, showYearView: !s.showYearView }))
  }, [])

  const setViewMode = useCallback((mode: CalendarState['viewMode']) => {
    setState(s => ({ ...s, viewMode: mode }))
  }, [])

  // ── Notes actions ────────────────────────────────────────────────────────
  const setMonthMemo = useCallback((key: string, content: string) => {
    setNotes(prev => {
      const next: NotesState = {
        ...prev,
        monthMemos: { ...prev.monthMemos, [key]: { content, updatedAt: Date.now() } },
      }
      storage.notes.set(next)
      return next
    })
  }, [])

  const setDateNote = useCallback((key: string, content: string) => {
    setNotes(prev => {
      const next: NotesState = {
        ...prev,
        dateNotes: { ...prev.dateNotes, [key]: { content, updatedAt: Date.now() } },
      }
      storage.notes.set(next)
      return next
    })
  }, [])

  const deleteMonthMemo = useCallback((key: string) => {
    setNotes(prev => {
      const memos = { ...prev.monthMemos }
      delete memos[key]
      const next = { ...prev, monthMemos: memos }
      storage.notes.set(next)
      return next
    })
  }, [])

  const deleteDateNote = useCallback((key: string) => {
    setNotes(prev => {
      const dNotes = { ...prev.dateNotes }
      delete dNotes[key]
      const next = { ...prev, dateNotes: dNotes }
      storage.notes.set(next)
      return next
    })
  }, [])

  // ── Events actions ───────────────────────────────────────────────────────
  const addEvent = useCallback((event: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    const newEvent: CalendarEvent = { ...event, id: crypto.randomUUID(), createdAt: Date.now() }
    setEvents(prev => { const next = [...prev, newEvent]; storage.events.set(next); return next })
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => { const next = prev.filter(e => e.id !== id); storage.events.set(next); return next })
  }, [])

  const editEvent = useCallback((id: string, updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>) => {
    setEvents(prev => { const next = prev.map(e => e.id === id ? { ...e, ...updates } : e); storage.events.set(next); return next })
  }, [])

  return (
    <CalendarContext.Provider value={{
      state, goNextMonth, goPrevMonth, goToToday, goToMonth,
      onDateClick, onDateHover, onDragStart, onDragEnter, onDragEnd,
      clearSelection, toggleFocus, toggleYearView, setViewMode,
    }}>
      <NotesContext.Provider value={{ notes, setMonthMemo, setDateNote, deleteMonthMemo, deleteDateNote }}>
        <EventsContext.Provider value={{ events, addEvent, deleteEvent, editEvent }}>
          {children}
        </EventsContext.Provider>
      </NotesContext.Provider>
    </CalendarContext.Provider>
  )
}
