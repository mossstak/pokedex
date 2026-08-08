import React from 'react'

export function Pagination({ currentPage, totalPages, onPageChange, totalItems }) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full glass-card p-4 rounded-2xl border border-white/10 mt-8">
      <div className="text-xs text-slate-400 font-medium">
        Showing Page <span className="text-white font-bold">{currentPage}</span> of{' '}
        <span className="text-white font-bold">{totalPages}</span>
        {totalItems ? ` (${totalItems} total Pokémon)` : ''}
      </div>

      <div className="flex items-center gap-1.5">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 border border-white/5 transition-colors"
          title="First Page"
        >
          ««
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 border border-white/5 transition-colors"
        >
          Previous
        </button>

        {/* Numeric Buttons */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                currentPage === pageNum
                  ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border-white/5'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 border border-white/5 transition-colors"
        >
          Next
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 border border-white/5 transition-colors"
          title="Last Page"
        >
          »»
        </button>
      </div>
    </div>
  )
}

export default Pagination
