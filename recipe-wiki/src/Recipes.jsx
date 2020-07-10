import React, { useState } from "react";

const Recipes = (user) => {
  const [recipe, setRecipe] = useState("");

  let result;
  if (recipe == "") {
    result = (
      <div id="recipeviewer">
        <h1> Recipes viewer</h1>
        <Search />
      </div>
    );
  } else {
    result = (
      <div id="recipeviewer">
        <h1> Recipes viewer</h1>
        <Search />
      </div>
    );
  }
  return result;
};

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("search");
  const searchresults = [
    { key: "ok", title: "pasta", description: "the best dish" },
    { key: "noway", title: "pizza", description: "the only dish" },
  ];

  const handleChange = (e) => {
    if (e.target.getAttribute("name") === "searchbox") {
      setSearchTerm(e.target.value);
    }
    e.preventDefault();
  };

  return (
    <div>
      <div id="searchbox">
        <input
          name="searchbox"
          value={searchTerm}
          onChange={handleChange}
        ></input>
        <button name="search">Go</button>
      </div>
      <div>
        <ul>
          {searchresults.map((res) => (
            <li key={res.key}>
              <h2>{res.title}</h2>
              <p>{res.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RecipeViewer = (recipe) => {
  return (
    <div>
      <div>{recipe.title}</div>
      <div>{recipe.description}</div>
    </div>
  );
};

export default Recipes;
