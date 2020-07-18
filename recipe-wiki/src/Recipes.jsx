import React, { useState } from "react";
import {
  searchRecipes,
  getRecipe,
  updateRecipe,
  createRecipe,
  removeRecipe,
  Recipe,
} from "./recipe";
import Search from "./Search";
import RecipeEditor from "./RecipeEditor";
import RecipeViewer from "./RecipeViewer";

const Recipes = ({ user, cookies, setCookie, removeCookie }) => {
  const [recipe, setRecipe] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [editing, setEditing] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  const updateRecipeList = (recipes) => {
    setResults(recipes);
    setCurrentList(recipes);
  };

  const deleteRecipe = () => {
    removeRecipe(recipe.id, closeRecipe);
    setCurrentList(currentList.filter((li) => li.id !== recipe.id));
  };

  const openRecipe = (id) => {
    getRecipe(id, setRecipe);
    window.scrollTo({ top: 0 });
  };

  const closeRecipe = () => {
    setRecipe("");
    setEditing(false);
    window.scrollTo({ top: 0 });
  };

  const searchCall = () => {
    searchRecipes([], searchTerm, id, updateRecipeList);
  };

  const handleSearchTermChange = (val) => {
    setSearchTerm(val);
  };

  const handleEdit = (val) => {
    if (val === false && recipe.id === "") {
      setRecipe("");
    }
    setEditing(val);
    window.scrollTo({ top: 0 });
  };

  const handleRecipeUpdate = (recipe) => {
    recipe.id === ""
      ? createRecipe(recipe, setRecipe)
      : updateRecipe(recipe, setRecipe);
    setEditing(false);
    window.scrollTo({ top: 0 });
  };

  const newRecipe = (recipe) => {
    let recipeTemplate = new Recipe(
      "",
      "New Recipe Title",
      user.id,
      "A quick, informative, searchable blurb",
      [],
      "Step 1:\n\n\nStep 2:\n\n\nStep 3:\n\n\n",
      15,
      "https://olddesignshop.com/wp-content/uploads/2017/11/Vintage-Recipes-Bread-Rolls-Old-Design-Shop.jpg",
      []
    );
    setRecipe(recipeTemplate);
    setEditing(true);
  };

  let id = user.id;
  let result;
  if (currentList.length === 0 && renderCount === 0 && searchTerm === "") {
    let a = renderCount;
    setRenderCount(a + 1);
    searchCall();
    console.log("call made automatically");
    console.log(renderCount);
  }
  if (recipe === "") {
    result = (
      <Search
        currentList={currentList}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchTermChange}
        openRecipe={openRecipe}
        searchCall={searchCall}
        newRecipe={newRecipe}
      />
    );
  } else {
    result = editing ? (
      <RecipeEditor
        recipe={recipe}
        setEditing={handleEdit}
        saveRecipe={handleRecipeUpdate}
        deleteRecipe={deleteRecipe}
      />
    ) : (
      <RecipeViewer
        recipe={recipe}
        closeRecipe={closeRecipe}
        setEditing={handleEdit}
      />
    );
  }
  return result;
};

export default Recipes;
