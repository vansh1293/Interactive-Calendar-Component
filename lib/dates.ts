// Pure date utility functions — no side effects, fully testable.
// All functions operate on Date objects or the branded DateString/MonthKey types.

import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval,
  addMonths, subMonths, format, getDay, getDaysInMonth,
  differenceInCalendarDays, isAfter, isBefore, startOfDay,
} from 'date-fns'

import type { DateString, MonthKey, SelectionState } from '@/types'
import { toDateString, toMonthKey } from '@/types'

export { toDateString, toMonthKey }

// ────────────────────────────────────────────────
// Grid building
// ────────────────────────────────────────────────

/**
 * Returns a 2D array (weeks × days) of Date objects for a given month.
 * Pads with prev/next month days to fill the 7-column grid.
 * Week starts on Monday (locale: en-GB grid).
 */
export function buildMonthGrid(month: Date): Date[][] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
  const end   = endOfWeek(endOfMonth(month),     { weekStartsOn: 1 })
  const days  = eachDayOfInterval({ start, end })

  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

// ────────────────────────────────────────────────
// Selection state
// ────────────────────────────────────────────────

export interface SelectionParams {
  date:           Date
  today:          Date
  selectionStart: Date | null
  selectionEnd:   Date | null
  hoverDate:      Date | null
  currentMonth:   Date
}

/**
 * Determines the visual selection state of a given date cell.
 * Pure function — easily unit-testable.
 */
export function getSelectionState(params: SelectionParams): SelectionState {
  const { date, today, selectionStart, selectionEnd, hoverDate, currentMonth } = params

  if (!isSameMonth(date, currentMonth)) return 'other-month'

  const isToday = isSameDay(date, today)

  // Determine effective end (use hoverDate if mid-selection)
  const effectiveEnd = selectionEnd ?? hoverDate

  const isStart = selectionStart !== null && isSameDay(date, selectionStart)
  const isEnd   = selectionEnd   !== null && isSameDay(date, selectionEnd)

  if (isStart && isEnd)  return isToday ? 'today-start' : 'start'
  if (isStart)           return isToday ? 'today-start' : 'start'
  if (isEnd)             return isToday ? 'today-end'   : 'end'

  if (selectionStart && effectiveEnd && isInRange(date, selectionStart, effectiveEnd)) {
    return isToday ? 'today-in-range' : 'in-range'
  }

  return isToday ? 'today' : 'default'
}

/**
 * Checks whether a date falls within an inclusive range.
 * Normalises start > end cases automatically.
 */
export function isInRange(date: Date, start: Date, end: Date): boolean {
  const [lo, hi] = isAfter(start, end) ? [end, start] : [start, end]
  return isWithinInterval(startOfDay(date), { start: startOfDay(lo), end: startOfDay(hi) })
}

// ────────────────────────────────────────────────
// Navigation
// ────────────────────────────────────────────────

export const nextMonth = (d: Date): Date => addMonths(d, 1)
export const prevMonth = (d: Date): Date => subMonths(d, 1)

// ────────────────────────────────────────────────
// Formatting
// ────────────────────────────────────────────────

export const formatMonthYear    = (d: Date): string => format(d, 'MMMM yyyy')
export const formatMonthName    = (d: Date): string => format(d, 'MMMM')
export const formatYear         = (d: Date): string => format(d, 'yyyy')
export const formatDayNumber    = (d: Date): string => format(d, 'd')
export const formatFullDate     = (d: Date): string => format(d, 'EEEE, d MMMM yyyy')
export const formatShortDate    = (d: Date): string => format(d, 'd MMM yyyy')
export const formatAriaDate     = (d: Date): string => format(d, 'EEEE, MMMM d, yyyy')

// ────────────────────────────────────────────────
// Range utilities
// ────────────────────────────────────────────────

/**
 * Returns the number of days in a selected range (inclusive).
 */
export function getRangeDayCount(start: Date | null, end: Date | null): number | null {
  if (!start || !end) return null
  const diff = Math.abs(differenceInCalendarDays(end, start))
  return diff + 1
}

// ────────────────────────────────────────────────
// Stats helpers
// ────────────────────────────────────────────────

export function getDaysRemainingInMonth(today: Date): number {
  const totalDays = getDaysInMonth(today)
  return totalDays - today.getDate()
}

export function daysUntilDate(from: Date, target: Date): number {
  return Math.max(0, differenceInCalendarDays(target, from))
}

// ────────────────────────────────────────────────
// Misc
// ────────────────────────────────────────────────

export function isSameMonthYear(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export { isSameDay, isSameMonth, isAfter, isBefore, format, getDaysInMonth }
