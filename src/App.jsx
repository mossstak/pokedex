import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

//Search Component
const SearchPokemon = ({
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  searchSection,
  setSearchSection,
}) => {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearchSectionChange = (e) => {
    setSearchSection(e.target.value);
  };

  return (
    <div className="text-center">
      <form action="">
        <div>
          <label>
            <input
              type="radio"
              value="name"
              checked={searchSection === "name"}
              onChange={handleSearchSectionChange}
              className="mx-3 px-3"
            />{" "}
            Search by Pokemon Name
          </label>{" "}
          <label>
            <input
              type="radio"
              value="type"
              checked={searchSection === "type"}
              onChange={handleSearchSectionChange}
              className="mx-3 px-3"
            />{" "}
            Search by Pokemon Type
          </label>
        </div>

        {searchSection === "name" && (
          <>
            Search Pokemon Name:{" "}
            <input
              className="my-3 mx-3 px-2 outline outline-2"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </>
        )}

        {searchSection === "type" && (
          <>
            Search Pokemon Type:{" "}
            <input
              className="my-3 mx-3 px-2 outline outline-2"
              type="text"
              value={searchType}
              onChange={handleSearchTypeChange}
            />
          </>
        )}
      </form>
    </div>
  );
};

//App Component
function App() {
  /* <<------ USE STATES ------>> */
  const [pokemonData, setPokemonData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchSection, setSearchSection] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 20;

  //This is a list of Colors Property which matches the Pokemon Types.
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

  const fetchData = async () => {
    try {
      const pokemonResponse = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=302"
      );
      const pokemonData = pokemonResponse.data.results;

      const allPokemonData = [];

      for (const result of pokemonData) {
        const pokemonResponse = await axios.get(result.url);
        const speciesResponse = await axios.get(
          result.url.replace("pokemon", "pokemon-species")
        );

        const pokemon = pokemonResponse.data;
        const species = speciesResponse.data;

        allPokemonData.push({ ...pokemon, speciesData: species });
      }
      console.log(allPokemonData);
      setPokemonData(allPokemonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

    const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  /* 
  <<------ USE EFFECTS ------>>
  This code uses the 'useEffect' hook from React to fetch data from an external API
  when the component mounts or updates
  */

  useEffect(() => {
    fetchData();
  }, []);

  /** <<------ PAGINATIONS FUNCTION ------>> **/
  let currentPokemonCards = [];
  let totalPages = 0;
  const filteredPokemon =
    pokemonData.length > 0
      ? pokemonData.filter((pokemon) => {
          const nameMatch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
          const typeMatch = searchType
            ? pokemon.types.some((type) => type.type.name.toLowerCase() === searchType.toLowerCase())
            : true;
          return searchSection === "name" ? nameMatch : typeMatch;
        })
      : [];

  if (filteredPokemon.length > 0) {
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    currentPokemonCards = filteredPokemon.slice(indexOfFirstCard, indexOfLastCard);
    totalPages = Math.ceil(filteredPokemon.length / cardsPerPage);
  }

  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-2 px-3 py-1 ${
            i === currentPage
              ? "bg-blue-500 text-white"
              : "bg-blue-200 text-black"
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  /** <<------ SEARCH FUNCTION ------>> **/

  return (
    <div>
      <h1 className="text-center mt-2 text-[32pt] font-bold">
        Pokemon: Gotta Catch Em All
      </h1>

      <SearchPokemon
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchType={searchType}
        setSearchType={setSearchType}
        searchSection={searchSection}
        setSearchSection={setSearchSection}
      />

      <div className="flex flex-wrap justify-center">
        {currentPokemonCards.length === 0 ? (
          <p> No pokemon Found, please try a different name! </p>
        ) : (
          currentPokemonCards.map((pokemon) => (
            <div
              className="flex group h-[467px] w-[350px] max-w-sm m-[20px] overflow-hidden shadow-[0_1px_10px_0_rgba(0,0,0,0.8)]"
              key={pokemon.id}
            >
              <div className="flex-col h-full w-full bg-red-300 transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="relative top-[10px] text-center">
                  <h1 className="text-[20pt] font-bold">{pokemon.name}</h1>

                  {/*Images */}
                  <div className="flex relative justify-center top-[20px] h-[300px]">
                    <img
                      src={pokemon.sprites.other.dream_world.front_default}
                      alt={pokemon.name}
                    />
                  </div>

                  {/* Pokemon Types */}
                  <span className="inline-block relative top-[50px] text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Types(s):{" "}
                    {pokemon.types.map((type) => (
                      <div
                        key={type.type.name}
                        style={{
                          backgroundColor: typeColors[type.type.name],
                        }}
                        className="px-3 mx-1 inline-block rounded-[5%] text-white"
                      >
                        <div className="">{type.type.name}</div>
                      </div>
                    ))}
                  </span>
                </div>

                <div className="absolute inset-0 h-[467px] w-[350px] bg-green-600 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="flex-col absolute right-0 left-0 top-[50px]">
                    <div className="h-[100px] m-3">
                      <p className="font-bold">Description:</p>

                      {pokemon.speciesData.flavor_text_entries[9].language
                        .name === "en" && (
                        <li
                          className="list-none text-justify"
                          key={pokemon.speciesData.version}
                        >
                          {
                            pokemon.speciesData.flavor_text_entries[9]
                              .flavor_text
                          }
                        </li>
                      )}
                    </div>
                    {/* Abilities */}
                    <span className="text-[12pt] font-semibold text-black">
                      Abilities:
                      <div className="gap-6 font-bold">
                        {pokemon.abilities
                          .map((abilities) => abilities.ability.name)
                          .join(" | ")}
                      </div>
                    </span>
                    <br />
                    {/* Stats */}
                    <span className="text-[12pt] font-semibold text-black">
                      {pokemon.stats[0].stat.name.toUpperCase()}:{" "}
                      {pokemon.stats[0].base_stat}
                    </span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-4">
        {renderPaginationButtons()}
      </div>
    </div>
  );
}

export default App;
