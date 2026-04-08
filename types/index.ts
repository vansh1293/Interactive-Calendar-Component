// ============================================================
// TYPE DEFINITIONS — Single source of truth for all types.
// Strict TypeScript — no `any` anywhere in the codebase.
// ============================================================

// Branded types for extra type safety
export type DateString = string & { readonly _brand: 'DateString' }
export type MonthKey = string & { readonly _brand: 'MonthKey' }

// Helpers to create branded types safely
export const toDateString = (d: Date): DateString =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` as DateString

export const toMonthKey = (d: Date): MonthKey =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` as MonthKey

// ============================================================
// THEME
// ============================================================

export type Theme = 'classic' | 'dark' | 'sepia' | 'forest'

export interface ThemeConfig {
  id: Theme
  label: string
  emoji: string
}

// ============================================================
// CALENDAR STATE
// ============================================================

export type SelectionPhase = 'idle' | 'selecting' | 'toggling'
export type ViewMode = 'single' | 'double' | 'year'

export type SelectionState =
  | 'start'
  | 'end'
  | 'in-range'
  | 'today'
  | 'today-in-range'
  | 'today-start'
  | 'today-end'
  | 'default'
  | 'other-month'

export interface CalendarState {
  currentMonth: Date
  today: Date
  selectionStart: Date | null
  selectionEnd: Date | null
  hoverDate: Date | null
  selectionPhase: SelectionPhase
  isDragging: boolean
  viewMode: ViewMode
  focusMode: boolean
  showYearView: boolean
  activePicker: 'month' | 'year' | null
}

// ============================================================
// EVENTS
// ============================================================

export type EventCategory = 'work' | 'personal' | 'holiday' | 'other'

export interface CalendarEvent {
  id: string
  date: DateString
  title: string
  category: EventCategory
  createdAt: number
}

// ============================================================
// NOTES
// ============================================================

export interface Note {
  id: string
  content: string
  updatedAt: number
  startDate: DateString
  endDate?: DateString
}

export interface NotesState {
  monthMemos: Record<MonthKey, { content: string; updatedAt: number }>
  dateNotes: Note[]
}

// ============================================================
// HOLIDAYS
// ============================================================

export interface Holiday {
  date: string   // MM-DD format for repeating, or YYYY-MM-DD for one-time
  name: string
  type: 'national' | 'regional' | 'international'
  emoji: string
  tagline?: string
}

// ============================================================
// UNDO / REDO (generic)
// ============================================================

export interface UndoRedoState<T> {
  past: T[]
  present: T
  future: T[]
}

// ============================================================
// STATS
// ============================================================

export interface CalendarStats {
  totalEventsThisMonth: number
  totalNotesThisMonth: number
  daysUntilNextEvent: number | null
  selectedRangeDays: number | null
  daysRemainingInMonth: number
}
