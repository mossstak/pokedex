import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "../App.css";
import Pagination from "./Components/Pagination";

// This is a list of Colors Property which matches the Pokemon Types.
const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const App = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;

      const fetchedPokemonData = await Promise.all(
        data.results.map(async (pokemon) => {
          const [pokemonResponse, speciesResponse] = await Promise.all([
            axios.get(pokemon.url),
            axios.get(pokemon.url.replace("pokemon", "pokemon-species")),
          ]);
          const pokemonData = pokemonResponse.data;
          const speciesData = speciesResponse.data;

          const evolutionChainUrl = speciesData.evolution_chain.url;

          const evolutionResponse = await axios.get(evolutionChainUrl);
          const evolutionData = evolutionResponse.data;

          const evolvesFrom = findEvolvesFromSpecies(evolutionData, pokemon.name);

          return {
            id: pokemonData.id,
            name: pokemonData.name,
            sprites: pokemonData.sprites,
            types: pokemonData.types.map((type) => type.type.name),
            height: pokemonData.height,
            weight: pokemonData.weight,
            species: speciesData,
            evolvesFrom: evolvesFrom,
          };
        })
      );

      setLoading(true);
      console.log(fetchedPokemonData);
      setPokemon(fetchedPokemonData);
      setPrevPageUrl(data.previous);
      setNextPageUrl(data.next);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const findEvolvesFromSpecies = (chainData, targetName) => {
    const findSpecies = (chain, targetName) => {
      if (chain.species.name === targetName) {
        return null; // If it's the target Pokémon, it doesn't evolve from any other
      }

      if (chain.evolves_to && chain.evolves_to.length > 0) {
        for (const entry of chain.evolves_to) {
          if (entry.species.name === targetName) {
            return chain.species.name;
          }
          const evolvesFrom = findSpecies(entry, targetName);
          if (evolvesFrom !== null) {
            return evolvesFrom;
          }
        }
      }

      return null;
    };

    return findSpecies(chainData.chain, targetName);
  };

  const gotoNextPage = () => {
    if (nextPageUrl) {
      fetchData(nextPageUrl);
    }
  };

  const gotoPrevPage = () => {
    if (prevPageUrl) {
      fetchData(prevPageUrl);
    }
  };

  useEffect(() => {
    fetchData("https://pokeapi.co/api/v2/pokemon");
  }, []);

  return (
    <div>
      {loading ? (
        <div className="container m-auto mb-3">
          <h1 className="text-center text-[32pt] font-bold">Pokemon Gotta Catch Em All</h1>

          <PokeList pokemonlist={pokemon} />

          <div>
            <Pagination
              gotoPrevPage={gotoPrevPage}
              gotoNextPage={gotoNextPage}
            />
          </div>
        </div>
      ) : (
        <div>
          <p className="absolute m-auto">Loading ...</p>
        </div>
      )}
    </div>
  );
};

const PokeList = ({ pokemonlist }) => {
  return (
    <div className="mb-3 md:grid md:grid-cols-2 lg:grid-cols-4 md:grid-flow-row md:gap-4">
      {pokemonlist.map((pokemonItem) => (
        <div
          className="container w-[300px] mb-3 group hover:drop-shadow-2xl"
          key={uuidv4()}
        >
          <div className="bg-gray-300 p-6 transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            <div className="flex">
              <p className="text-[32px] absolute right-3"># {pokemonItem.id}</p>
              <h1 className="text-[30px]">{pokemonItem.name}</h1>
            </div>

            <div>
              <img
                src={pokemonItem.sprites.other.dream_world.front_default}
                alt=""
                className="flex m-auto h-[300px] w-[200px]"
              />
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {pokemonItem.types.map((type, index) => (
                <div
                  className="rounded py-[2px] px-[20px] text-white"
                  key={index}
                  style={{ backgroundColor: typeColors[type] }}
                >
                  <p>{type}</p>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gray-100 [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <div className="m-auto">
                <p className="font-bold text-center">Description:</p>
                {pokemonItem.species.flavor_text_entries[9].language.name ===
                  "en" && (
                  <ul>
                    <li
                      className="list-none text-justify m-3"
                      key={pokemonItem.species.version}
                    >
                      {pokemonItem.species.flavor_text_entries[9].flavor_text}
                    </li>
                  </ul>
                )}

                <li className="list-none text-center">
                  Height: {pokemonItem.height}
                </li>
                <li className="list-none text-center">
                  Weight: {pokemonItem.weight}
                </li>

                <div className="">
                  {pokemonItem.evolvesFrom && (
                    <div className="flex justify-center gap-2">
                      <p className="font-bold">Evolves From:</p>
                      {pokemonItem.evolvesFrom}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
