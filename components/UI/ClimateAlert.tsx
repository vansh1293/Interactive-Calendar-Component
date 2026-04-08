'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CloudRain, Sun, Wind, ThermometerSnowflake } from 'lucide-react'

interface ClimateAlertProps {
  month: number
}

const CLIMATE_ALERTS: Record<number, { 
  type: 'info' | 'warning' | 'danger', 
  label: string, 
  icon: React.ElementType 
}> = {
  0:  { type: 'info',    label: 'Dense Fog Warning • High Visibility Impact', icon: ThermometerSnowflake },
  1:  { type: 'info',    label: 'Cool & Pleasant • Spring Transitions', icon: Sun },
  2:  { type: 'info',    label: 'Warm & Comfortable • Summer Onset', icon: Sun },
  3:  { type: 'warning', label: 'Hot & Dry • Rising Temperatures', icon: Sun },
  4:  { type: 'danger',  label: 'Severe Heatwave Alert • Stay Hydrated (42°C+)', icon: Sun },
  5:  { type: 'warning', label: 'Aandhi Expected • High Dust & Wind Speeds', icon: Wind },
  6:  { type: 'warning', label: 'Heavy Monsoon Downpours • Flood Risk', icon: CloudRain },
  7:  { type: 'warning', label: 'High Humidity • Heavy Rain Occasional', icon: CloudRain },
  8:  { type: 'info',    label: 'Monsoon Receding • Humid but Improving', icon: CloudRain },
  9:  { type: 'info',    label: 'Post-Monsoon • Pleasant Mild Skies', icon: Sun },
  10: { type: 'info',    label: 'Cool & Dry • Winter Onset Haze', icon: Wind },
  11: { type: 'info',    label: 'Cold Wave • Dense Foggy Mornings', icon: ThermometerSnowflake },
}

export default function ClimateAlert({ month }: ClimateAlertProps) {
  const alert = CLIMATE_ALERTS[month]
  if (!alert) return null

  const bgClass = 
    alert.type === 'danger'  ? 'bg-red-500/20 border-red-500/30 text-red-100' :
    alert.type === 'warning' ? 'bg-amber-500/20 border-amber-500/30 text-amber-100' :
    'bg-blue-500/20 border-blue-500/30 text-blue-100'

  const Icon = alert.icon

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`alert-${month}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md
          text-[10px] font-bold tracking-tight shadow-lg uppercase
          ${bgClass}
        `}
      >
        <Icon size={12} className="shrink-0" />
        <span>{alert.label}</span>
      </motion.div>
    </AnimatePresence>
  )
}
