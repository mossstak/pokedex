import React from 'react'
import { TYPE_COLORS, capitalizeFirstLetter } from '../utils/pokemonHelpers'

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
}) {
  const typesList = Object.keys(TYPE_COLORS)

  return (
    <div className="w-full glass-card p-4 sm:p-6 rounded-2xl border border-white/10 mb-8 space-y-4">
      {/* Search Input & Sort Selection */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            🔍
          </div>
          <input
            type="text"
            placeholder="Search by name or #ID (e.g. Pikachu, 25)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 focus:border-rose-500 focus:outline-none text-sm text-slate-100 placeholder-slate-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 focus:border-rose-500 focus:outline-none text-sm text-slate-200 cursor-pointer font-medium"
          >
            <option value="id-asc">Lowest ID (#1 → #1000)</option>
            <option value="id-desc">Highest ID (#1000 → #1)</option>
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
          </select>
        </div>
      </div>

      {/* Filter by Types Pills */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Filter by Element Type:
          </span>
          {selectedType && (
            <button
              onClick={() => onTypeChange('')}
              className="text-xs text-rose-400 hover:underline font-semibold"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto py-1 pr-1">
          <button
            onClick={() => onTypeChange('')}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
              selectedType === ''
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-white/5'
            }`}
          >
            All Types
          </button>
          {typesList.map((type) => {
            const isSelected = selectedType === type
            const style = TYPE_COLORS[type]
            return (
              <button
                key={type}
                onClick={() => onTypeChange(isSelected ? '' : type)}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all border ${
                  isSelected
                    ? 'text-white shadow-md scale-105 border-white'
                    : 'text-slate-300 hover:scale-105 border-white/10 opacity-75 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? style.bg : `${style.bg}22`,
                  borderColor: isSelected ? '#FFFFFF' : `${style.bg}55`,
                }}
              >
                {capitalizeFirstLetter(type)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FilterBar
