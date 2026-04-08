// Typed, safe localStorage wrapper.
// All reads return null (not throw) on missing/corrupt data.

import { STORAGE_KEYS } from '@/lib/constants'
import type { Theme, NotesState, CalendarEvent } from '@/types'

// ─── Generic helpers ───────────────────────────

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage quota exceeded — fail silently
    console.warn(`[storage] Failed to write key "${key}"`)
  }
}

function safeRemove(key: string): void {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(key) } catch { /* noop */ }
}

// ─── Theme ─────────────────────────────────────

export const storage = {
  theme: {
    get: (): Theme          => safeGet<Theme>(STORAGE_KEYS.THEME, 'classic'),
    set: (t: Theme): void   => safeSet(STORAGE_KEYS.THEME, t),
  },

  // ─── Notes ───────────────────────────────────
  notes: {
    get: (): NotesState => safeGet<NotesState>(STORAGE_KEYS.NOTES, {
      monthMemos: {},
      dateNotes:  {},
    }),
    set: (n: NotesState): void => safeSet(STORAGE_KEYS.NOTES, n),
  },

  // ─── Events ──────────────────────────────────
  events: {
    get: (): CalendarEvent[]              => safeGet<CalendarEvent[]>(STORAGE_KEYS.EVENTS, []),
    set: (events: CalendarEvent[]): void  => safeSet(STORAGE_KEYS.EVENTS, events),
  },

  // ─── Nuke all app data (for dev/testing) ─────
  clear: (): void => {
    Object.values(STORAGE_KEYS).forEach(safeRemove)
  },
}
