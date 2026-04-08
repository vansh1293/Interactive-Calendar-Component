'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { useThemeContext } from '@/components/Providers/CalendarProvider'
import { THEMES } from '@/lib/constants'
import type { Theme } from '@/types'

const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme } = useThemeContext()

  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-[color:var(--color-bg-notes)] border border-[color:var(--color-border)]" role="radiogroup" aria-label="Calendar theme">
      {THEMES.map(t => (
        <button
          key={t.id}
          role="radio"
          aria-checked={theme === t.id}
          aria-label={`${t.label} theme`}
          title={t.label}
          onClick={() => setTheme(t.id)}
          className={`
            relative px-2.5 py-1.5 rounded-xl text-[11px] font-semibold
            transition-colors duration-150 outline-none
            focus-visible:ring-2 focus-visible:ring-[color:var(--color-border-focus)]
            ${theme === t.id
              ? 'text-[color:var(--color-text-on-accent)]'
              : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]'
            }
          `}
        >
          {theme === t.id && (
            <motion.div
              layoutId="theme-pill"
              className="absolute inset-0 rounded-xl bg-[color:var(--color-primary)]"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            <span>{t.emoji}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </span>
        </button>
      ))}
    </div>
  )
})

export default ThemeToggle
