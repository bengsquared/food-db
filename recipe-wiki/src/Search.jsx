import React from "react";
import { foodemoji } from "./recipe";
const Search = ({
  currentList,
  searchTerm,
  setSearchTerm,
  openRecipe,
  searchCall,
  newRecipe,
}) => {
  const handleChange = (e) => {
    if (e.target.getAttribute("name") === "searchbox") {
      setSearchTerm(e.target.value);
    }
    e.preventDefault();
  };

  const searchonenter = (e) => {
    if (e.key === "Enter") {
      searchCall();
    }
  };

  return (
    <div className=" grid grid-cols-12 gap-4 p-4">
      <div className="col-span-12 sm:col-span-8 items-center p-4 flex border ">
        <div className="funderline flex-grow">
          <input
            name="searchbox"
            placeholder="search"
            className="w-full"
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={searchonenter}
          ></input>
        </div>
        <button name="search" onClick={searchCall} className="mx-2">
          <span className="inline" role="img" aria-label="search">
            🔍
          </span>
        </button>
      </div>
      <div className="col-span-12 sm:col-span-4 justify-center flex border">
        <button onClick={newRecipe} className="p-2 funderline">
          new recipe
        </button>
      </div>
      <div className="col-span-12 overflow-y-scroll grid gap-4">
        {currentList.map((res) => (
          <ResultCard key={res.id} res={res} openRecipe={openRecipe} />
        ))}
      </div>
    </div>
  );
};

const ResultCard = ({ res, openRecipe }) => {
  return (
    <div
      className="h-56 recipecard p-4 gap-8 col-span-12 border grid grid-cols-12 cursor-pointer "
      onClick={() => {
        openRecipe(res.id);
      }}
    >
      <div className="col-span-8">
        <div className="text-xl font-bold block">{res.title}</div>
        <p className="text-xs">
          <span role="img" aria-label="time">
            ⏱
          </span>
          {Math.floor(res.minutes / 60)}h:{res.minutes % 60}m{" "}
        </p>
        <p className="text-base">{res.description}</p>
      </div>
      <div className="col-span-4 h-48 leading-relaxed text-center">
        {res.image === "" ? (
          <span
            role="img"
            style={{ fontSize: "8rem" }}
            aria-label="food emoji"
            className="align-middle"
          >
            {foodemoji[Math.floor(Math.random() * foodemoji.length)]}
          </span>
        ) : (
          <img
            alt="preview"
            className="object-cover w-full h-full object-center"
            src={res.image}
          ></img>
        )}
      </div>
    </div>
  );
};

export default Search;
