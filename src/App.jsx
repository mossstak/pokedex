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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        "https://pokeapi.co/api/v2/pokemon?limit=151 "
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

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY + windowHeight >= documentHeight - 100){
      //load more data
      const nextPage = currentPage + 1;
      if(nextPage <= totalPages){
        setCurrentPage(nextPage);
      }
    }
  }

  /* <<------ USE EFFECTS ------>> */
  useEffect(() => {
    fetchData();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** <<------ PAGINATIONS COMPONENT ------>> **/
  let currentPokemonCards = [];
  let totalPages = 0;
  const filteredPokemon =
    pokemonData.length > 0
      ? pokemonData.filter((pokemon) => {
          const nameMatch = pokemon.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const typeMatch = searchType
            ? pokemon.types.some(
                (type) =>
                  type.type.name.toLowerCase() === searchType.toLowerCase()
              )
            : true;
          return searchSection === "name" ? nameMatch : typeMatch;
        })
      : [];

  if (filteredPokemon.length > 0) {
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    currentPokemonCards = filteredPokemon.slice(
      indexOfFirstCard,
      indexOfLastCard
    );
    totalPages = Math.ceil(filteredPokemon.length / cardsPerPage);
  }

  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-2 mb-2 px-3 py-1 ${
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

  return (
    <div className="bg-gray-300">
      <div className="container relative m-auto">
        <h1 className="text-center text-[32pt] font-bold">
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
                className="flex group h-[467px] w-[300px] max-w-sm m-[20px] overflow-hidden shadow-[0_1px_10px_0_rgba(0,0,0,0.1)]"
                key={pokemon.id}
              >
                <div className="flex-col h-full w-full bg-gray-900 text-white transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]">
                  {/*Names */}
                  <div className="relative text-center">
                    <div className="bg-red-800 h-[60px] border-b-[10px] border-red-400">
                      <h1 className="container relative top-[5px] text-[20pt] font-bold">
                        {pokemon.name}
                      </h1>
                    </div>

                    {/*Images */}
                    <div className="flex relative m-auto top-[20px] w-full h-full">
                      <img
                        className="container relative m-auto w-[300px] h-[300px]"
                        src={pokemon.sprites.other.dream_world.front_default}
                        alt={pokemon.name}
                      />
                    </div>

                    {/* Pokemon Types */}
                    <span className="inline-block relative top-[30px] text-sm font-semibold mr-2 mb-2">
                      Types(s):{" "}
                      {pokemon.types.map((type) => (
                        <div
                          key={type.type.name}
                          style={{
                            backgroundColor: typeColors[type.type.name],
                          }}
                          className="px-3 mx-1 inline-block rounded-[5%]"
                        >
                          <div className="">{type.type.name}</div>
                        </div>
                      ))}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gray-900 text-center [transform:rotateX(180deg)] [backface-visibility:hidden]">
                    <div className="container relative m-auto top-[40px]">
                      <div className="m-auto w-[200px]">
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
                      <div className="container relative m-auto top-[25px]">
                        <span className="text-[12pt] font-semibold ">
                          Abilities:
                          <div className="gap-6 font-bold">
                            {pokemon.abilities
                              .map((abilities) => abilities.ability.name)
                              .join(" | ")}
                          </div>
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="container relative m-auto top-[50px]">
                        <h1 className="text-[12pt] font-bold">Stats: </h1>
                        <div className="container relative mx-[60px] grid grid-cols-2 gap-2">
                          <div className="text-justify">
                            {pokemon.stats[0].stat.name.toUpperCase()}
                          </div>
                          <div className="text-justify">
                            {pokemon.stats[0].base_stat}
                          </div>
                          <div className="text-justify">
                            {pokemon.stats[1].stat.name.toUpperCase()}
                          </div>
                          <div className="text-justify">
                            {pokemon.stats[1].base_stat}
                          </div>
                          <div className="text-justify">
                            {pokemon.stats[2].stat.name.toUpperCase()}
                          </div>
                          <div className="text-justify">
                            {pokemon.stats[2].base_stat}
                          </div>
                          <div className="text-justify">
                            {pokemon.stats[3].stat.name.toUpperCase()}
                          </div>
                          <div className="text-justify">
                            {pokemon.stats[3].base_stat}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-wrap justify-center container relative m-auto md:w-full">
          {renderPaginationButtons()}
        </div>
      </div>
    </div>
  );
}

export default App;
