import React from 'react'
import {
  TYPE_COLORS,
  capitalizeFirstLetter,
  formatPokemonId,
  getPokemonImage,
} from '../utils/pokemonHelpers'

export function PokemonCard({ pokemon, onClick }) {
  const primaryType = pokemon.types?.[0] || 'normal'
  const typeStyle = TYPE_COLORS[primaryType] || TYPE_COLORS.normal
  const imageUrl = getPokemonImage(pokemon)

  return (
    <div
      onClick={() => onClick(pokemon)}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${typeStyle.gradient} p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-${primaryType}/20 cursor-pointer glass-card border border-white/10 flex flex-col justify-between`}
    >
      {/* Background Pokeball watermark decorative element */}
      <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/5 rounded-full pointer-events-none transition-transform group-hover:scale-125 duration-500" />

      {/* Header: ID and Name */}
      <div className="flex justify-between items-start z-10">
        <div>
          <span className="text-xs font-bold tracking-widest text-white/60 uppercase">
            {formatPokemonId(pokemon.id)}
          </span>
          <h3 className="text-xl font-extrabold text-white capitalize group-hover:text-amber-300 transition-colors">
            {capitalizeFirstLetter(pokemon.name)}
          </h3>
        </div>
      </div>

      {/* Pokemon Image */}
      <div className="relative py-4 my-2 flex justify-center items-center z-10">
        <div className="absolute w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500" />
        <img
          src={imageUrl}
          alt={pokemon.name}
          loading="lazy"
          className="w-36 h-36 object-contain pokemon-shadow group-hover:scale-110 transition-transform duration-500 z-10"
        />
      </div>

      {/* Type Badges */}
      <div className="flex flex-wrap gap-2 z-10 mt-auto">
        {pokemon.types?.map((type) => {
          const style = TYPE_COLORS[type] || TYPE_COLORS.normal
          return (
            <span
              key={type}
              className="px-3 py-1 text-xs font-semibold rounded-full shadow-sm flex items-center justify-center gap-1 backdrop-blur-md text-white border border-white/20"
              style={{ backgroundColor: style.bg }}
            >
              {capitalizeFirstLetter(type)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default PokemonCard
