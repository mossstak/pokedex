/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { PokemonCards } from "./Components/PokemonCards";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPokeData();
  }, []);

  const fetchPokeData = () => {
    let endpoints = [];
    for (let i = 1; i < 151; i++) {
      endpoints.push(`https://pokeapi.co/api/v2/pokemon/${i}`);
    }
    let response = axios
      .all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then((res) => {
        console.log(res);
        setLoading(true);
        setPokemon(res);
      });
    return response;
  };

  return (
    <div className="container m-auto p-3">
      {loading ? (
        <div>
          <h1 className="text-[32pt] font-bold text-center">Pokedex: Gotta Catch Em All</h1>
          <div className="p-3 grid-cols-3 sm:grid md:grid-cols-3">
            {pokemon.map((pokemon) => (
              <PokemonCards
                key={uuidv4()}
                name={pokemon.data.name}
                image={pokemon.data.sprites.other.dream_world.front_default}
                types={pokemon.data.types}
                speciesData={pokemon.data.species}
                weight={pokemon.data.weight}
                height={pokemon.data.height}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p>LOADING ...</p>
        </div>
      )}
    </div>
  );
}

export default App;
