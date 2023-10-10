/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react'
import { PokemonCards } from './Components/PokemonCards'
import { SearchPokemon } from './Components/SearchPokemon'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState([])
  const [searchPokemon, setSearchPokemon] = useState('')
  const [filteredPokemon, setFilteredPokemon] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPokeData()
  }, [])

  const fetchPokeData = async () => {
    let endpoints = []
    for (let i = 1; i < 151; i++) {
      endpoints.push(`https://pokeapi.co/api/v2/pokemon/${i}`)
    }

    try {
      let res = await axios.all(
        endpoints.map((endpoint) => axios.get(endpoint))
      )

      //fetch species data for each pokemon
      const speciesPromises = res.map((pokemon) =>
        axios.get(pokemon.data.species.url)
      )
      const speciesData = await axios.all(speciesPromises)

      //combine Pokemon data with species data
      const combinedData = res.map((pokemon, index) => {
        return {
          ...pokemon,
          species: speciesData[index].data,
        }
      })
      setPokemon(combinedData)
      setFilteredPokemon(combinedData)
      setLoading(true)
      console.log(combinedData)
    } catch (error) {
      console.error('Failed to fetch pokemons:', error)
    }
  }

  const handleSearch = () => {
    if (searchPokemon === '') {
      setFilteredPokemon(pokemon)
    } else {
      setFilteredPokemon(
        pokemon.filter((pokemon) =>
          pokemon.data.name.toLowerCase().includes(searchPokemon.toLowerCase())
        )
      )
    }
  }

  const resetPokemon = () => {
    setFilteredPokemon(pokemon)
  }

  return (
    <div className="container m-auto p-3">
      {loading ? (
        <div>
          <h1 className="text-[32pt] font-bold text-center">
            Pokedex: Gotta Catch Em All
          </h1>
          <div className="flex gap-3 justify-center px-5">
            <SearchPokemon
              placeholder="search Pokemon Here"
              onChange={(e) => setSearchPokemon(e.target.value)}
              value={searchPokemon}
              onClick={handleSearch}
            />
            <button
              className="p-3 w-[100px] hover:bg-red-800 hover:text-white hover:transition: border border-red-600"
              onClick={resetPokemon}
            >
              Reset
            </button>
          </div>
          <div className="p-3 grid-cols-3 sm:grid md:grid-cols-3">
            {filteredPokemon.map((pokemon) => {
              const types = pokemon.data.types.map((type) => type.type.name)
              return (
                <PokemonCards
                  key={uuidv4()}
                  name={pokemon.data.name}
                  src={pokemon.data.sprites.other.dream_world.front_default}
                  types={types}
                  description={
                    pokemon.species.flavor_text_entries.filter(
                      (entry) => entry.language.name === 'en'
                    )[9].flavor_text
                  }
                  weight={pokemon.data.weight}
                  height={pokemon.data.height}
                />
              )
            })}
          </div>
        </div>
      ) : (
        <div>
          <p>LOADING ...</p>
        </div>
      )}
    </div>
  )
}

export default App
