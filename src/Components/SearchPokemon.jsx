import React, {useState } from "react";
import "../App.css";

export const SearchPokemon = ({ value, onChange, onClick, placeholder }) => {
  const [inputPlaceholder, setInputPlaceholder] = useState(placeholder);

  return (
    <div className="flex gap-3 justify-center">
      <input
        className="md:w-[500px] h-[50px] p-3 border border-red-600"
        type="text"
        placeholder={inputPlaceholder}
        value={value}
        onChange={onChange}
        onFocus={() => setInputPlaceholder("")}
        onBlur={() => setInputPlaceholder(placeholder)}
      />
      <button
        className="p-3 w-[100px] hover:bg-red-800 hover:text-white hover:transition: border border-red-600"
        onClick={onClick}
      >
        Search
      </button>
    </div>
  );
};
