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
      console.log(currentList);
    }
  };

  return (
    <div className=" h-full grid grid-cols-12 gap-4 p-4">
      <div className="col-span-12 sm:col-span-8 md:col-span-10 items-center p-4 flex border ">
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
      <div className="col-span-12 sm:col-span-4 md:col-span-2 justify-center flex ">
        <button
          onClick={newRecipe}
          className="m-2 mx-auto border funderline border-black p-2"
        >
          new recipe
        </button>
      </div>
      <div className="col-span-12 h-full overflow-y-show grid gap-4">
        {currentList === [] ? (
          <div>
            <h2>No recipes to show :(</h2>
          </div>
        ) : (
          currentList.map((res) => (
            <ResultCard key={res.id} res={res} openRecipe={openRecipe} />
          ))
        )}
      </div>
    </div>
  );
};

const ResultCard = ({ res, openRecipe }) => {
  console.log(res);
  console.log(res.minutes);
  return (
    <div
      className="h-auto sm:h-56 recipecard p-4 gap-8 col-span-12 border flex flex-col-reverse sm:grid sm:grid-cols-12 cursor-pointer "
      onClick={() => {
        openRecipe(res.id);
      }}
    >
      <div className="flex-grow sm:col-span-8">
        <div className="text-xl font-bold block">{res.title}</div>
        <p className="text-xs">
          <span role="img" aria-label="time">
            ⏱
          </span>
          {Math.floor(res.minutes / 60)}h:{res.minutes % 60}m{" "}
        </p>
        <p className="text-base">{res.description}</p>
      </div>
      <div className="flex-none h-48 sm:col-span-4 sm:h-48 leading-relaxed text-center">
        {res.image === "" ? (
          <span
            role="img"
            style={{ fontSize: "8rem", lineHeight: "normal" }}
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
