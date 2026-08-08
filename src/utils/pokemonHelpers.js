export const TYPE_COLORS = {
  normal: { bg: '#A8A77A', border: '#79794E', text: '#FFFFFF', gradient: 'from-amber-700/40 to-slate-800/80' },
  fire: { bg: '#EE8130', border: '#9C4000', text: '#FFFFFF', gradient: 'from-orange-600/50 to-amber-900/80' },
  water: { bg: '#6390F0', border: '#2651B5', text: '#FFFFFF', gradient: 'from-blue-600/50 to-indigo-950/80' },
  electric: { bg: '#F7D02C', border: '#B09000', text: '#111827', gradient: 'from-amber-400/50 to-yellow-900/80' },
  grass: { bg: '#7AC74C', border: '#46891A', text: '#FFFFFF', gradient: 'from-emerald-600/50 to-teal-950/80' },
  ice: { bg: '#96D9D6', border: '#459995', text: '#111827', gradient: 'from-cyan-400/40 to-slate-900/80' },
  fighting: { bg: '#C22E28', border: '#761410', text: '#FFFFFF', gradient: 'from-red-700/50 to-stone-900/80' },
  poison: { bg: '#A33EA1', border: '#60165F', text: '#FFFFFF', gradient: 'from-purple-600/50 to-slate-950/80' },
  ground: { bg: '#E2BF65', border: '#987A26', text: '#FFFFFF', gradient: 'from-yellow-700/50 to-stone-900/80' },
  flying: { bg: '#A98FF3', border: '#6542CE', text: '#FFFFFF', gradient: 'from-indigo-500/50 to-slate-900/80' },
  psychic: { bg: '#F95587', border: '#B81347', text: '#FFFFFF', gradient: 'from-pink-600/50 to-purple-950/80' },
  bug: { bg: '#A6B91A', border: '#647200', text: '#FFFFFF', gradient: 'from-lime-600/50 to-emerald-950/80' },
  rock: { bg: '#B6A136', border: '#6F6116', text: '#FFFFFF', gradient: 'from-yellow-800/50 to-stone-900/80' },
  ghost: { bg: '#735797', border: '#3B2458', text: '#FFFFFF', gradient: 'from-violet-800/50 to-slate-950/80' },
  dragon: { bg: '#6F35FC', border: '#3B04C2', text: '#FFFFFF', gradient: 'from-purple-700/50 to-indigo-950/80' },
  dark: { bg: '#705746', border: '#3D2D22', text: '#FFFFFF', gradient: 'from-stone-700/60 to-zinc-950/90' },
  steel: { bg: '#B7B7CE', border: '#6E6E8B', text: '#FFFFFF', gradient: 'from-slate-500/50 to-slate-900/80' },
  fairy: { bg: '#D685AD', border: '#923D67', text: '#FFFFFF', gradient: 'from-rose-400/50 to-purple-950/80' },
}

export function capitalizeFirstLetter(string = '') {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, ' ')
}

export function formatPokemonId(id) {
  if (!id) return '#000'
  return `#${String(id).padStart(4, '0')}`
}

export function getPokemonImage(pokemon) {
  if (!pokemon) return ''
  return (
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.other?.home?.front_default ||
    pokemon.sprites?.front_default ||
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
  )
}

export function getEnglishFlavorText(speciesData) {
  if (!speciesData?.flavor_text_entries) return 'No description available for this Pokémon.'
  const englishEntry = speciesData.flavor_text_entries.find(
    (entry) => entry.language && entry.language.name === 'en'
  )
  if (!englishEntry) return 'No English description available.'
  return englishEntry.flavor_text.replace(/[\n\f\r]/g, ' ')
}

export const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'Sp. ATK',
  'special-defense': 'Sp. DEF',
  speed: 'SPD',
}

export const STAT_MAX = 255
