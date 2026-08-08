import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import StatBar from './StatBar'
import EvolutionChain from './EvolutionChain'
import {
  TYPE_COLORS,
  capitalizeFirstLetter,
  formatPokemonId,
  getEnglishFlavorText,
  getPokemonImage,
} from '../utils/pokemonHelpers'

export function PokemonDetailModal({ pokemon, onClose, onSelectPokemon }) {
  const [detailedData, setDetailedData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about') // 'about' | 'stats' | 'evolution' | 'moves'

  useEffect(() => {
    if (!pokemon) return

    const fetchFullDetails = async () => {
      setLoading(true)
      try {
        // Fetch species data
        const speciesRes = await API.get(pokemon.species.url)
        const speciesData = speciesRes.data

        // Fetch evolution data if available
        let evolutionData = null
        if (speciesData.evolution_chain?.url) {
          const evoRes = await API.get(speciesData.evolution_chain.url)
          evolutionData = evoRes.data
        }

        setDetailedData({
          ...pokemon,
          species: speciesData,
          evolution: evolutionData,
        })
      } catch (err) {
        console.error('Failed to load full Pokemon details:', err)
        setDetailedData(pokemon)
      } finally {
        setLoading(false)
      }
    }

    fetchFullDetails()
  }, [pokemon])

  if (!pokemon) return null

  const primaryType = pokemon.types?.[0]?.type?.name || pokemon.types?.[0] || 'normal'
  const typeStyle = TYPE_COLORS[primaryType] || TYPE_COLORS.normal
  const mainImage = getPokemonImage(pokemon)
  const description = detailedData?.species
    ? getEnglishFlavorText(detailedData.species)
    : 'Loading description...'

  // Total Base Stats Calculation
  const totalStats = pokemon.stats?.reduce((acc, curr) => acc + curr.base_stat, 0) || 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden glass-modal shadow-2xl border border-white/10 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Type Gradient */}
        <div
          className={`relative p-6 sm:p-8 bg-gradient-to-br ${typeStyle.gradient} flex flex-col justify-between overflow-hidden shrink-0`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10"
            aria-label="Close modal"
          >
            ✕
          </button>

          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-white/70 uppercase">
                {formatPokemonId(pokemon.id)}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white capitalize drop-shadow-md">
                {capitalizeFirstLetter(pokemon.name)}
              </h2>
            </div>
            {totalStats > 0 && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
                  BST Total
                </span>
                <p className="text-xl font-extrabold text-amber-300 font-mono">
                  {totalStats}
                </p>
              </div>
            )}
          </div>

          {/* Types Badges */}
          <div className="flex gap-2 mt-3 z-10">
            {(pokemon.types || []).map((t) => {
              const typeName = typeof t === 'string' ? t : t.type.name
              const style = TYPE_COLORS[typeName] || TYPE_COLORS.normal
              return (
                <span
                  key={typeName}
                  className="px-3.5 py-1 text-xs font-semibold rounded-full text-white shadow-md border border-white/20"
                  style={{ backgroundColor: style.bg }}
                >
                  {capitalizeFirstLetter(typeName)}
                </span>
              )
            })}
          </div>

          {/* Pokemon Center Image */}
          <div className="relative py-4 flex justify-center items-center z-10 my-2">
            <div className="absolute w-44 h-44 bg-white/15 rounded-full blur-2xl" />
            <img
              src={mainImage}
              alt={pokemon.name}
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain pokemon-shadow z-10 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-slate-900/90 text-sm font-semibold shrink-0">
          {[
            { id: 'about', label: 'About' },
            { id: 'stats', label: 'Base Stats' },
            { id: 'evolution', label: 'Evolution' },
            { id: 'moves', label: 'Moves' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center transition-colors relative ${
                activeTab === tab.id
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400 font-medium">
                Fetching Pokémon Pokédex data...
              </span>
            </div>
          ) : (
            <>
              {/* TAB 1: ABOUT */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                      Description
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-white/5">
                      {description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                        Height
                      </span>
                      <span className="text-base font-bold text-white font-mono">
                        {(pokemon.height / 10).toFixed(1)} m
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                        Weight
                      </span>
                      <span className="text-base font-bold text-white font-mono">
                        {(pokemon.weight / 10).toFixed(1)} kg
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                        Base XP
                      </span>
                      <span className="text-base font-bold text-amber-400 font-mono">
                        {pokemon.base_experience || 'N/A'}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                        Habitat / Growth
                      </span>
                      <span className="text-xs font-bold text-slate-300 capitalize truncate block">
                        {detailedData?.species?.habitat?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
                      Abilities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.abilities?.map((ab) => (
                        <div
                          key={ab.ability.name}
                          className="px-4 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2"
                        >
                          <span>{capitalizeFirstLetter(ab.ability.name)}</span>
                          {ab.is_hidden && (
                            <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-400 font-mono uppercase">
                              Hidden
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BASE STATS */}
              {activeTab === 'stats' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Stat Breakdown
                    </h3>
                    <span className="text-xs text-slate-500">Max stat: 255</span>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-1">
                    {pokemon.stats?.map((stat) => (
                      <StatBar
                        key={stat.stat.name}
                        statName={stat.stat.name}
                        value={stat.base_stat}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EVOLUTION */}
              {activeTab === 'evolution' && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
                    Evolution Chain
                  </h3>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                    <EvolutionChain
                      evolutionData={detailedData?.evolution}
                      onSelectPokemon={onSelectPokemon}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: MOVES */}
              {activeTab === 'moves' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Moveset Preview ({pokemon.moves?.length || 0} Total)
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                    {pokemon.moves?.slice(0, 24).map((m) => (
                      <div
                        key={m.move.name}
                        className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-xs text-slate-300 font-medium capitalize text-center truncate hover:border-slate-700 transition-colors"
                      >
                        {capitalizeFirstLetter(m.move.name)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PokemonDetailModal
