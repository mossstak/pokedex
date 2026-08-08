import React from 'react'

export function LoadingSkeleton({ count = 20 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-72 rounded-2xl glass-card border border-white/5 p-5 flex flex-col justify-between animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="w-16 h-3 bg-slate-800 rounded" />
            <div className="w-24 h-5 bg-slate-800 rounded-md" />
          </div>
          <div className="my-auto flex justify-center">
            <div className="w-28 h-28 bg-slate-800 rounded-full" />
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-6 bg-slate-800 rounded-full" />
            <div className="w-16 h-6 bg-slate-800 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
