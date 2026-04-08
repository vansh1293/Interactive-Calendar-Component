import type { Theme, ThemeConfig } from '@/types'

// No magic numbers — everything lives here.

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export const MONTHS = [
  'January', 'February', 'March',     'April',   'May',      'June',
  'July',    'August',   'September', 'October', 'November', 'December',
] as const

export const THEMES: ThemeConfig[] = [
  { id: 'classic', label: 'Classic Blue', emoji: '🔵' },
  { id: 'dark',    label: 'Dark Mode',    emoji: '🌙' },
  { id: 'sepia',   label: 'Warm Sepia',   emoji: '☕' },
  { id: 'forest',  label: 'Forest',       emoji: '🌿' },
] satisfies ThemeConfig[]

export const DEFAULT_THEME: Theme = 'classic'

export const MAX_NOTE_LENGTH    = 500
export const MAX_EVENT_TITLE    = 60
export const MAX_EVENTS_PER_DAY = 3

export const STORAGE_KEYS = {
  THEME:         'cal_theme',
  NOTES:         'cal_notes',
  EVENTS:        'cal_events',
  SELECTED_DATE: 'cal_selected',
  VIEW_MODE:     'cal_view_mode',
} as const

// Month hero image paths (in /public/images/months/)
export const MONTH_IMAGES: Record<number, string> = {
  0:  '/images/months/january_v2.jpg',
  1:  '/images/months/february_v2.jpg',
  2:  '/images/months/march_v2.jpg',
  3:  '/images/months/april_v2.jpg',
  4:  '/images/months/may_v2.jpg',
  5:  '/images/months/june_v2.jpg',
  6:  '/images/months/july_v2.jpg',
  7:  '/images/months/august_v2.jpg',
  8:  '/images/months/september_v2.jpg',
  9:  '/images/months/october_v2.jpg',
  10: '/images/months/november_v3.jpg',
  11: '/images/months/december_v2.jpg',
}

// Month accent gradient overlays for hero image
export const MONTH_GRADIENTS: Record<number, string> = {
  0:  'from-blue-900/70 to-blue-600/40',
  1:  'from-pink-900/70 to-rose-500/40',
  2:  'from-green-900/70 to-emerald-500/40',
  3:  'from-purple-900/70 to-violet-500/40',
  4:  'from-yellow-900/60 to-amber-400/30',
  5:  'from-cyan-900/70 to-sky-500/40',
  6:  'from-orange-900/70 to-orange-400/40',
  7:  'from-teal-900/70 to-teal-500/40',
  8:  'from-indigo-900/70 to-indigo-500/40',
  9:  'from-red-900/70 to-red-500/40',
  10: 'from-slate-900/70 to-purple-900/50',
  11: 'from-slate-900/70 to-blue-900/50',
}

export const EVENT_CATEGORY_COLORS = {
  work:     'var(--color-event-work)',
  personal: 'var(--color-event-personal)',
  holiday:  'var(--color-holiday)',
  other:    'var(--color-event-other)',
} as const

export const EVENT_CATEGORY_LABELS = {
  work:     'Work',
  personal: 'Personal',
  holiday:  'Holiday',
  other:    'Other',
} as const

export const UNDO_REDO_LIMIT = 50
