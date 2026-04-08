import type { Holiday } from '@/types'

// Indian public holidays + major international days.
// Format: MM-DD for annually repeating, YYYY-MM-DD for one-off.

export const HOLIDAYS: Holiday[] = [
  // ── Indian National Holidays (Fixed) ──────────────────
  { date: '01-01', name: "New Year's Day",        type: 'national',      emoji: '🎆' },
  { date: '01-14', name: 'Makar Sankranti / Pongal', type: 'national',    emoji: '🪁' },
  { date: '01-26', name: 'Republic Day',           type: 'national',      emoji: '🇮🇳' },
  { date: '03-08', name: "International Women's Day", type: 'international', emoji: '💜' },
  { date: '04-14', name: 'Dr. Ambedkar Jayanti',   type: 'national',      emoji: '🏛️' },
  { date: '05-01', name: 'Labour Day',             type: 'national',      emoji: '⚒️' },
  { date: '08-15', name: 'Independence Day',       type: 'national',      emoji: '🇮🇳' },
  { date: '10-02', name: 'Gandhi Jayanti',         type: 'national',      emoji: '🕊️' },
  { date: '11-14', name: "Children's Day",        type: 'national',      emoji: '🎈' },
  { date: '12-25', name: 'Christmas Day',          type: 'international', emoji: '🎄' },

  // ── 2025 Lunar/Variable Festivals ──────────────────
  { date: '2025-02-26', name: 'Maha Shivratri',    type: 'national',      emoji: '🔱' },
  { date: '2025-03-14', name: 'Holi',              type: 'national',      emoji: '🎨' },
  { date: '2025-03-31', name: 'Eid al-Fitr',       type: 'national',      emoji: '🌙' },
  { date: '2025-08-16', name: 'Janmashtami',       type: 'national',      emoji: '🐚' },
  { date: '2025-10-20', name: 'Diwali',            type: 'national',      emoji: '🪔' },

  // ── 2026 Lunar/Variable Festivals ──────────────────
  { date: '2026-02-15', name: 'Maha Shivratri',    type: 'national',      emoji: '🔱' },
  { date: '2026-03-03', name: 'Holi',              type: 'national',      emoji: '🎨' },
  { date: '2026-03-20', name: 'Eid al-Fitr',       type: 'national',      emoji: '🌙' },
  { date: '2026-09-04', name: 'Janmashtami',       type: 'national',      emoji: '🐚' },
  { date: '2026-11-08', name: 'Diwali',            type: 'national',      emoji: '🪔' },
]

/**
 * Returns the holiday for a given date, if any.
 * Checks both MM-DD (annual) and YYYY-MM-DD (specific year) formats.
 */
export function getHoliday(date: Date): Holiday | null {
  const mm   = String(date.getMonth() + 1).padStart(2, '0')
  const dd   = String(date.getDate()).padStart(2, '0')
  const yyyy = String(date.getFullYear())

  const key1 = `${mm}-${dd}`          // "04-08"
  const key2 = `${yyyy}-${mm}-${dd}`  // "2026-04-08"

  return (
    HOLIDAYS.find(h => h.date === key1 || h.date === key2) ?? null
  )
}

/**
 * Returns all holidays for a given month as a Map: day → Holiday.
 */
export function getHolidaysForMonth(year: number, month: number): Map<number, Holiday> {
  const map = new Map<number, Holiday>()
  const mm  = String(month + 1).padStart(2, '0')
  const yyyy = String(year)

  for (const h of HOLIDAYS) {
    if (h.date.length === 5) {
      // MM-DD format
      if (h.date.startsWith(mm + '-')) {
        const day = parseInt(h.date.slice(3), 10)
        map.set(day, h)
      }
    } else {
      // YYYY-MM-DD format
      if (h.date.startsWith(`${yyyy}-${mm}-`)) {
        const day = parseInt(h.date.slice(8), 10)
        map.set(day, h)
      }
    }
  }

  return map
}
