'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCalendarContext } from '@/components/Providers/CalendarProvider'
import { formatMonthName } from '@/lib/dates'

export default function QuickPicker() {
  const { state, setMonth, setYear, togglePicker } = useCalendarContext()
  const { activePicker, currentMonth } = state

  const months = Array.from({ length: 12 }, (_, i) => i)
  
  // Year range: +/- 10 years from current
  const startYear = currentMonth.getFullYear() - 7
  const years = Array.from({ length: 15 }, (_, i) => startYear + i)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="absolute inset-x-0 top-0 z-50 bg-[color:var(--color-bg-card)]/98 backdrop-blur-xl p-6 rounded-b-3xl border-b border-white/10 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight opacity-70 uppercase text-xs" style={{ color: 'var(--color-text-primary)' }}>
          Select {activePicker === 'year' ? 'Year' : 'Month'}
        </h2>
        <button
          onClick={() => togglePicker(null)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close picker"
        >
          <X size={20} />
        </button>
      </div>

      {/* View Selection */}
      <div className="min-h-[280px]">
        {activePicker === 'month' ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {months.map((m) => {
              const isSelected = currentMonth.getMonth() === m
              return (
                <button
                  key={m}
                  onClick={() => setMonth(m)}
                  className={`
                    h-16 rounded-xl flex items-center justify-center text-sm font-bold
                    transition-all duration-200 group relative overflow-hidden
                    ${isSelected 
                      ? 'bg-[color:var(--color-primary)] text-white shadow-lg shadow-[color:var(--color-primary)]/20' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20'
                    }
                  `}
                >
                  {new Date(2000, m, 1).toLocaleString('default', { month: 'short' }).toUpperCase()}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {years.map((y) => {
              const isSelected = currentMonth.getFullYear() === y
              return (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`
                    h-14 rounded-xl flex items-center justify-center text-sm font-bold
                    transition-all duration-200 group
                    ${isSelected 
                      ? 'bg-[color:var(--color-primary)] text-white shadow-lg shadow-[color:var(--color-primary)]/20' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20'
                    }
                  `}
                >
                  {y}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <button 
          onClick={() => togglePicker(activePicker === 'year' ? 'month' : 'year')}
          className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-primary)] hover:opacity-80 transition-opacity"
        >
          Tap to switch to {activePicker === 'year' ? 'Month' : 'Year'} view
        </button>
      </div>
    </motion.div>
  )
}
