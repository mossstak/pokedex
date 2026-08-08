import React from 'react'
import { STAT_LABELS, STAT_MAX } from '../utils/pokemonHelpers'

export function StatBar({ statName, value }) {
  const label = STAT_LABELS[statName] || statName.toUpperCase()
  const percentage = Math.min(100, Math.round((value / STAT_MAX) * 100))

  // Color logic based on value
  const getBarColor = (val) => {
    if (val >= 120) return 'bg-emerald-400 shadow-emerald-500/50'
    if (val >= 90) return 'bg-teal-400 shadow-teal-500/50'
    if (val >= 60) return 'bg-amber-400 shadow-amber-500/50'
    return 'bg-rose-400 shadow-rose-500/50'
  }

  return (
    <div className="grid grid-cols-12 items-center gap-2 text-sm my-1.5">
      <span className="col-span-3 font-semibold text-slate-300 text-xs uppercase tracking-wider">
        {label}
      </span>
      <span className="col-span-2 text-right font-bold text-white text-sm">
        {value}
      </span>
      <div className="col-span-7 h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${getBarColor(
            value
          )}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default StatBar
