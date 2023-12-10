import React, { useEffect, useState } from 'react'
import API from './utils/api'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedPokemon, setSelectedPokemon] = useState()
  const pokemonPerPage = 20
  const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  }

  const fetchPokemon = async () => {
    const response = await API.get(
      `/pokemon?limit=${pokemonPerPage}&offset=${
        (currentPage - 1) * pokemonPerPage
      }`
    )
    const fetchedPokemon = response.data.results

    // Fetch detailed data for each Pokemon
    const detailedPokemonData = await Promise.all(
      fetchedPokemon.map(async (p) => {
        const individualPokemonResponse = await API.get(p.url)
        const individualPokemon = individualPokemonResponse.data

        const types = individualPokemon.types.map((type) => type.type.name)

        // Fetch species data
        const speciesResponse = await API.get(individualPokemon.species.url)
        const speciesData = speciesResponse.data

        // Fetch evolution data
        let evolutionData = null
        if (speciesData.evolution_chain) {
          const evolutionResponse = await API.get(
            speciesData.evolution_chain.url
          )
          evolutionData = evolutionResponse.data
        }

        return {
          ...individualPokemon,
          types,
          species: speciesData,
          evolution: evolutionData,
        }
      })
    )

    setPokemon(detailedPokemonData)
    console.log(detailedPokemonData)
    setTotalPages(Math.ceil(response.data.count / pokemonPerPage))
  }

  useEffect(() => {
    fetchPokemon()
  }, [currentPage])

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const pokeDescription = async (pokemonId) => {
    try {
      // Fetch the basic details of the selected Pokemon
      const response = await API.get(`/pokemon/${pokemonId}`)
      const pokemonDetails = response.data

      // Fetch species data
      const speciesResponse = await API.get(pokemonDetails.species.url)
      const speciesData = speciesResponse.data

      // Fetch evolution data
      let evolutionData = null
      if (speciesData.evolution_chain) {
        const evolutionResponse = await API.get(speciesData.evolution_chain.url)
        evolutionData = evolutionResponse.data
      }

      // Set the state with all the fetched data
      setSelectedPokemon({
        ...pokemonDetails,
        species: speciesData,
        evolution: evolutionData,
      })
    } catch (error) {
      console.error('Error fetching details:', error)
      // Handle the error as appropriate
    }
  }

  function getEvolutionChain(evolutionData) {
    let chain = []
    let currentStage = evolutionData.chain

    // Loop through the evolution chain
    while (currentStage) {
      chain.push(currentStage.species.name)
      currentStage = currentStage.evolves_to[0] // Move to the next stage
    }

    return chain
  }

  return (
    <div className="flex flex-col container m-auto justify-center items-center">
      <h1 className="text-[3rem] text-center">Pokemon!</h1>
      <p>Gotta Catch em All! </p>
      {!selectedPokemon && (
        <div>
          <div className="grid-cols-3 sm:grid md:grid-cols-4 p-3 gap-[120px]">
            {pokemon.map((pokeman) => (
              <div
                className="flex justify-center items-center"
                key={pokeman.id}
              >
                <button
                  onClick={() => pokeDescription(pokeman.id)}
                  className="flex-col gap-3 justify-center items-center pointer bg-red-300 hover:bg-red-600 h-[400px] w-[300px] p-1"
                >
                  <div className="flex gap-3 justify-center items-center">
                    <p className="font-bold text-[30px]">
                      {capitalizeFirstLetter(pokeman.name)}
                    </p>
                    <p className="text-[30px] text-justify">{pokeman.id}</p>
                  </div>
                  <img
                    className="w-[240px] h-[280px]"
                    src={pokeman.sprites.other.dream_world.front_default}
                  />

                  <div className="flex justify-center gap-3">
                    {pokeman.types.map((type) => {
                      return (
                        <span
                          key={type}
                          className="p-1 w-[80px] rounded-xl relative top-[10px]"
                          style={{ backgroundColor: typeColors[type] }}
                        >
                          {capitalizeFirstLetter(type)}
                        </span>
                      )
                    })}
                  </div>
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 w-full gap-3">
            <button
              className="h-[50px] w-[100px] p-3 text-white bg-red-600"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="h-[50px] w-[100px] p-3 text-white bg-red-600"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedPokemon && (
        <div className="flex flex-col justify-center items-center bg-red-300 p-3 w-[800px]">
          <div className="mb-3">
            {/* Pokemon Name */}
            <div className="flex gap-[150px]">
              <p className="text-center font-bold text-[2em] w-[600px] mt-3">
                {capitalizeFirstLetter(selectedPokemon.name)}
              </p>
            </div>

            {/* Pokemon Image */}
            <div className="flex justify-center gap-[150px]">
              <img src={selectedPokemon.sprites.front_default} />
              <img src={selectedPokemon.sprites.back_default} />
            </div>
          </div>

          <div className="mb-3 w-[600px]">
            {/* Description */}
            <div className="text-justify">
              <p className="font-bold text-center text-[2em]">Description: </p>
              {selectedPokemon.species.flavor_text_entries[9].flavor_text}
            </div>

            {/* stats */}
            <p className="font-bold text-[2em] text-center">Stats</p>
            {selectedPokemon.stats.slice(0, 5).map((stat, index) => (
              <span
                key={stat.stat.id}
                className="flex justify-between gap-[100px] mt-3"
              >
                <p className="font-bold">{stat.stat.name}:</p>
                <p>{stat.base_stat}</p>
              </span>
            ))}
          </div>

          <div className="mb-3 flex flex-col items-center">
            {/* Abilities */}
            <span className="font-bold text-[2em]">Abilities: </span>
            <p className="flex gap-3 mb-3">
              {selectedPokemon.abilities.map((ability) => (
                <span key={ability.ability.id} className=" bg-green-300 py-2 px-6">
                  {capitalizeFirstLetter(ability.ability.name)}
                </span>
              ))}
            </p>

            {/* Moves */}
            <h1 className="text-[2em] font-bold">Moves</h1>
            <div className="grid-cols-2 sm:grid md:grid-cols-2 p-3 gap-[30px]">
              {selectedPokemon.moves.slice(0, 4).map((move) => (
                <span
                  key={move.move.id}
                  className="bg-gray-300 p-3 text-center rounded-3xl"
                >
                  {capitalizeFirstLetter(move.move.name)}
                </span>
              ))}
            </div>
          </div>

          {/* Evolution Chain */}
          <div className='mb-[25px]'>
            <h3 className="font-bold text-center text-[2em]">
              Evolution Chain:
            </h3>
            {selectedPokemon.evolution ? (
              <div className="flex gap-3 items-center justify-center">
                {getEvolutionChain(selectedPokemon.evolution).map(
                  (speciesName, index, array) => (
                    <React.Fragment key={speciesName.id}>
                      <span>{speciesName}</span>
                      {index < array.length - 1 && (
                        <span className="mx-2">→</span>
                      )}
                    </React.Fragment>
                  )
                )}
              </div>
            ) : (
              <p>This Pokémon does not evolve.</p>
            )}
          </div>

          <button
            className=" bg-red-400 h-[50px] px-[40px] hover:bg-red-500"
            onClick={() => {
              setSelectedPokemon(null)
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

export default App
