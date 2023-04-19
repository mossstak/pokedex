import { useState, useEffect } from "react";
import {  Tabs, TabsHeader, TabsBody, Tab, TabPanel,} from "@material-tailwind/react"
import axios from "axios";
import "../App.css";

function App() {
  /*
  This code initializes a state variable called 'pokemon' and a function called 'setPokemon' 
  to update the state. The 'useStates' hook from React is used to create this state variable and
  its initial value is set to an empty array '[]'
  */
  const [pokemon, setPokemon] = useState([]);
  /* 
  This code uses the 'useEffect' hook from React to fetch data from an external API
  when the component mounts or updates
  */
  useEffect(() => {
  /*  */
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => {
        const pokemonPromises = res.data.results.map((result) =>
          axios.get(result.url)
        );
        axios
          .all(pokemonPromises)
          .then((pokemon) => setPokemon(pokemon))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1 className="text-center mt-2 text-[32pt] font-bold">Pokemon: Gotta Catch Em All</h1>

      <div className="flex flex-wrap justify-center ">
        {pokemon.map((pokemon) => (
          <div
            className="max-w-sm m-[20px] rounded-b-lg overflow-hidden border-[5px] border-black shadow-[0_35px_60px_10px_rgba(0,0,0,0.6)] h-[400px] w-[350px]"
            key={pokemon.data.id}
          >
            <h1 className="font-bold text-[18pt] mb-2 mt-4 text-center">
              {pokemon.data.name}
            </h1>
            <div className="text-center">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                Types(s):{" "}
                <strong>
                  {pokemon.data.types.map((type) => type.type.name).join(" / ")}{" "}
                </strong>
              </span>
            </div>
            <div className="flex justify-center h-[150px]">
              <img
                src={pokemon.data.sprites.other.dream_world.front_default}
                alt={pokemon.data.name}
              />
            </div>
            <div className="text-center p-5">
            <span className="inline-block bg-gray-200 mt-1 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                Moves(s):{" "}
                <strong>
                  {pokemon.data.abilities.map((abilities) => abilities.ability.name).join(" / ")}{" "}
                </strong>
              </span>

              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                Moves(s):{" "}
                <strong>
                  {pokemon.data.moves.slice(0, 4).map((move) => move.move.name).join(" / ")}{" "}
                </strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
