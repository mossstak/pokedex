import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { capitalizeFirstLetter, getPokemonImage } from '../utils/pokemonHelpers'

export function EvolutionChain({ evolutionData, onSelectPokemon }) {
  const [chainNodes, setChainNodes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!evolutionData?.chain) return

    const parseChain = async () => {
      setLoading(true)
      const list = []
      let current = evolutionData.chain

      while (current) {
        const speciesName = current.species.name
        let pokemonDetails = null

        try {
          // Fetch basic info for artwork image
          const res = await API.get(`/pokemon/${speciesName}`)
          pokemonDetails = res.data
        } catch (e) {
          console.error('Could not fetch evolution sprite', e)
        }

        list.push({
          name: speciesName,
          details: pokemonDetails,
          minLevel: current.evolution_details?.[0]?.min_level || null,
          trigger: current.evolution_details?.[0]?.trigger?.name || null,
        })

        current = current.evolves_to?.[0] || null
      }

      setChainNodes(list)
      setLoading(false)
    }

    parseChain()
  }, [evolutionData])

  if (!evolutionData?.chain) {
    return (
      <div className="text-slate-400 text-sm py-4 text-center">
        This Pokémon does not evolve.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 py-4">
      {chainNodes.map((node, index) => (
        <React.Fragment key={node.name}>
          <div
            onClick={() => node.details && onSelectPokemon(node.details)}
            className="flex flex-col items-center group cursor-pointer p-3 rounded-xl bg-slate-900/60 border border-white/10 hover:border-rose-500/50 hover:bg-slate-800/80 transition-all"
          >
            {node.details ? (
              <img
                src={getPokemonImage(node.details)}
                alt={node.name}
                className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                ?
              </div>
            )}
            <span className="text-xs font-semibold text-slate-200 mt-2 capitalize group-hover:text-amber-400">
              {capitalizeFirstLetter(node.name)}
            </span>
          </div>

          {index < chainNodes.length - 1 && (
            <div className="flex flex-col items-center text-slate-500">
              <span className="text-lg font-bold">→</span>
              {node.minLevel && (
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono mt-0.5">
                  Lvl {node.minLevel}
                </span>
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default EvolutionChain
