import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

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

export const PokemonCards = ({
  name,
  src,
  types,
  height,
  weight,
  description,
}) => {
  return (
    <div>
      <div className="mx-3 mt-6 flex flex-col w-[300px] rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] sm:shrink-0 sm:grow sm:basis-0">
        <div className="container group hover:drop-shadow-2xl">
          <div className="bg-gray-300 rounded-xl p-6 transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            <div className="p-6 mb-4">
              <h5 className="mb-2 text-[18pt] text-center font-medium leading-tight">
                {name}
              </h5>
              <img
                className="rounded-t-lg w-[300px] h-[300px] relative top-3 m-auto"
                src={src}
                alt={name}
              />
            </div>
            <div className="mt-auto border-t-2 px-6 py-3 text-center border-black">
              <div className="flex gap-2 justify-center">
                {types.map((type) => (
                  <span
                    className="py-[10px] px-[30px] rounded-3xl"
                    style={{ backgroundColor: typeColors[type] }}
                    key={type}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute rounded-xl inset-0 bg-blue-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <div className="m-auto p-6">
                <li className="list-none text-center">Height: {height}</li>
                <li className="list-none text-center">Weight: {weight}</li>
                <div className="flex flex-col m-auto p-3">
                  <h6 className="font-bold text-center">Description:</h6>
                  <ul>
                    <li className="text-justify">{description}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
