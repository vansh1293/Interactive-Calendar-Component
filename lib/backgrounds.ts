// Month-specific environment metadata for the Indian Climate Calendar.
// These mood labels and icons are used in the CalendarHeader badge.

export type ParticleType =
  | 'snow'
  | 'petals'
  | 'leaves'
  | 'rain'
  | 'sparkles'
  | 'bubbles'
  | 'fireflies'
  | 'stars'
  | 'confetti'
  | 'mist'
  | 'fog'
  | 'frost'
  | 'blossom'
  | 'dust'
  | 'stormLeaves'

export interface MonthEnvironment {
  particle: ParticleType
  mood: string
}

/**
 * Metadata for the Indian Climate Calendar UI.
 * 0: Jan, 1: Feb, ..., 11: Dec
 */
export const MONTH_ENVIRONMENTS: Record<number, MonthEnvironment> = {
  0: {
    particle: 'frost',
    mood: 'Very Cold & Frosty Fog',
  },
  1: {
    particle: 'sparkles',
    mood: 'Cool & Pleasant',
  },
  2: {
    particle: 'blossom',
    mood: 'Warm & Comfortable',
  },
  3: {
    particle: 'dust',
    mood: 'Hot & Dry',
  },
  4: {
    particle: 'dust',
    mood: 'Extreme Heatwave',
  },
  5: {
    particle: 'stormLeaves',
    mood: 'Dry Heat & Dust Storms',
  },
  6: {
    particle: 'rain',
    mood: 'Heavy Monsoon Rains',
  },
  7: {
    particle: 'rain',
    mood: 'Rainy & Humid',
  },
  8: {
    particle: 'rain',
    mood: 'Lush Post-Monsoon',
  },
  9: {
    particle: 'sparkles',
    mood: 'Pleasant & Mild',
  },
  10: {
    particle: 'mist',
    mood: 'Cool & Misted Haze',
  },
  11: {
    particle: 'fog',
    mood: 'Cold & Foggy',
  },
}
