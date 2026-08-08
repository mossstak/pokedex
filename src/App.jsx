import React, { useEffect, useState, useMemo } from 'react'
import API from './utils/api'
import PokemonCard from './components/PokemonCard'
import PokemonDetailModal from './components/PokemonDetailModal'
import FilterBar from './components/FilterBar'
import Pagination from './components/Pagination'
import LoadingSkeleton from './components/LoadingSkeleton'
import './App.css'

function App() {
  const [pokemonList, setPokemonList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPokemon, setSelectedPokemon] = useState(null)

  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState('id-asc')

  const pokemonPerPage = 20

  // Fetch standard paginated grid Pokémon
  const fetchPokemonGrid = async (page) => {
    setLoading(true)
    setError(null)
    try {
      const offset = (page - 1) * pokemonPerPage
      const res = await API.get(`/pokemon?limit=${pokemonPerPage}&offset=${offset}`)
      setTotalCount(res.data.count)

      // Fetch basic details for the 20 pokemon in parallel (WITHOUT heavy species/evolution endpoints!)
      const detailedList = await Promise.all(
        res.data.results.map(async (p) => {
          const detailRes = await API.get(p.url)
          return {
            ...detailRes.data,
            types: detailRes.data.types.map((t) => t.type.name),
          }
        })
      )

      setPokemonList(detailedList)
    } catch (err) {
      console.error('Failed to load Pokémon list:', err)
      setError('Failed to fetch Pokémon data. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  // Effect to load page data when page changes
  useEffect(() => {
    fetchPokemonGrid(currentPage)
  }, [currentPage])

  // Single Direct Search by Name or ID if user typed search query
  const [searchedPokemon, setSearchedPokemon] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    const trimmed = searchTerm.trim().toLowerCase()
    if (!trimmed) {
      setSearchedPokemon(null)
      return
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await API.get(`/pokemon/${trimmed}`)
        setSearchedPokemon([{
          ...res.data,
          types: res.data.types.map((t) => t.type.name),
        }])
      } catch (e) {
        // If exact search fails, try searching in current loaded list
        setSearchedPokemon([])
      } finally {
        setSearchLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Filter and Sort Processed List
  const displayedPokemon = useMemo(() => {
    let sourceList = searchTerm ? (searchedPokemon || []) : pokemonList

    // Filter by Search Term locally if search result array matches
    if (searchTerm) {
      const query = searchTerm.toLowerCase().trim()
      sourceList = sourceList.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          String(p.id).includes(query)
      )
    }

    // Filter by Element Type
    if (selectedType) {
      sourceList = sourceList.filter((p) => p.types.includes(selectedType))
    }

    // Sort
    const sorted = [...sourceList].sort((a, b) => {
      if (sortBy === 'id-asc') return a.id - b.id
      if (sortBy === 'id-desc') return b.id - a.id
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
      return 0
    })

    return sorted
  }, [pokemonList, searchedPokemon, searchTerm, selectedType, sortBy])

  const totalPages = Math.ceil(totalCount / pokemonPerPage)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <header className="w-full max-w-7xl flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3 mb-2">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Pokeball"
            className="w-10 h-10 animate-bounce"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-amber-400 to-indigo-400">
            Pokédex Explorer
          </h1>
        </div>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg font-medium">
          Discover Pokémon stats, elemental types, abilities, movesets, and evolution paths in real-time.
        </p>
      </header>

      {/* Main App Container */}
      <main className="w-full max-w-7xl flex flex-col items-center">
        {/* Filter & Search Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Error State */}
        {error && (
          <div className="w-full p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-center font-medium my-6">
            {error}
            <button
              onClick={() => fetchPokemonGrid(currentPage)}
              className="ml-4 px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-500"
            >
              Retry
            </button>
          </div>
        )}

        {/* Grid Content */}
        {loading || searchLoading ? (
          <LoadingSkeleton count={20} />
        ) : displayedPokemon.length === 0 ? (
          <div className="w-full py-20 text-center glass-card rounded-2xl border border-white/5">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-slate-200">No Pokémon Found</h3>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your search query or element type filters.
            </p>
            {(searchTerm || selectedType) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedType('')
                }}
                className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {displayedPokemon.map((p) => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                onClick={setSelectedPokemon}
              />
            ))}
          </div>
        )}

        {/* Pagination Bar (hidden when search filter active) */}
        {!searchTerm && !selectedType && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalCount}
          />
        )}
      </main>

      {/* Selected Pokemon Detail Modal */}
      {selectedPokemon && (
        <PokemonDetailModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onSelectPokemon={(newPokemon) => setSelectedPokemon(newPokemon)}
        />
      )}
    </div>
  )
}

export default App
