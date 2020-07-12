import React, { useState } from "react";
import {
  searchRecipes,
  getRecipe,
  updateRecipe,
  createRecipe,
  removeRecipe,
  Recipe,
} from "./recipe";

const Recipes = ({ user }) => {
  const [recipe, setRecipe] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [editing, setEditing] = useState(false);

  const updateRecipeList = (recipes) => {
    console.log(recipes);
    setResults(recipes);
    setCurrentList(recipes);
  };

  const deleteRecipe = () => {
    removeRecipe(recipe.id, closeRecipe);
  };

  const openRecipe = (id) => {
    getRecipe(id, setRecipe);
  };

  const closeRecipe = () => {
    setRecipe("");
    setEditing(false);
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
  };

  const handleRecipeUpdate = (recipe) => {
    recipe.id === ""
      ? createRecipe(recipe, setRecipe)
      : updateRecipe(recipe, setRecipe);
    setEditing(false);
  };

  const newRecipe = (recipe) => {
    let recipeTemplate = new Recipe(
      "",
      "New Recipe Title",
      user.id,
      "A quick, informative, searchable blurb",
      "Ingredients:\n-\n-\n\nStep 1:\n\n\nStep 2:\n\n\nStep 3:\n\n\n",
      15,
      "https://olddesignshop.com/wp-content/uploads/2017/11/Vintage-Recipes-Bread-Rolls-Old-Design-Shop.jpg",
      []
    );
    setRecipe(recipeTemplate);
    setEditing(true);
  };

  let id = user.id;
  let result;
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

///////////////////////////////////////////////////////////////////////////

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

  const handleClick = (e) => {
    openRecipe(e.target.name);
  };

  const searchonenter = (e) => {
    if (e.key === "Enter") {
      searchCall();
    }
  };

  return (
    <div className="flex-grow grid-cols-12 gap-4">
      <div className="col-span-12">test</div>
      <div className="col-span-8">
        <input
          name="searchbox"
          placeholder="search"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={searchonenter}
        ></input>
        <button name="search" onClick={searchCall} className="inline withSpace">
          Go
        </button>
      </div>
      <div className="col-span-2">
        <button onClick={newRecipe} className="inline withSpace">
          🆕create
        </button>
      </div>
      <div className="col-span-12 grid-cols-12">
        <ul>
          {currentList.map((res) => (
            <li key={res.id}>
              <h2>{res.title}</h2>
              <p>{res.description}</p>
              <img className="small" src={res.image}></img>
              <button
                name={res.id}
                className="inline withSpace"
                onClick={handleClick}
              >
                view recipe
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

///////////////////////////////////////////////////////////////////////////

const RecipeViewer = ({ recipe, closeRecipe, setEditing }) => {
  const edit = () => {
    setEditing(true);
  };

  return (
    <div className="flex flex-grow">
      <div className="">{recipe.title}</div>
      <img src={recipe.image}></img>
      <div>
        {recipe.minutes > 60
          ? Math.floor(recipe.minutes / 60) +
            (recipe.minutes > 120 ? " hours, " : " hour, ")
          : " "}
        {recipe.minutes % 60} minutes
      </div>
      <div>tags: {recipe.tags}</div>
      <br></br>

      <div>
        <pre>{recipe.description}</pre>
      </div>
      <br></br>

      <h1> instructions </h1>
      <div>
        <pre>{recipe.instructions}</pre>
      </div>
      <br></br>
      <button className="inline withSpace" onClick={closeRecipe}>
        close
      </button>
      <button className="inline withSpace" onClick={edit}>
        edit
      </button>
    </div>
  );
};

///////////////////////////////////////////////////////////////////////////

const RecipeEditor = ({ recipe, setEditing, saveRecipe, deleteRecipe }) => {
  const [editedRecipe, setEditedRecipe] = useState(recipe);

  const handleChange = (e) => {
    let h = Math.floor(
      editedRecipe.minutes === "" ? "0" : editedRecipe.minutes / 60
    );
    let m = editedRecipe.minutes === "" ? "0" : editedRecipe.minutes % 60;
    if (e.target.getAttribute("name") === "title") {
      setEditedRecipe({ ...editedRecipe, title: e.target.value });
    } else if (e.target.getAttribute("name") === "image") {
      setEditedRecipe({ ...editedRecipe, image: e.target.value });
    } else if (e.target.getAttribute("name") === "minutes") {
      setEditedRecipe({
        ...editedRecipe,
        minutes:
          parseInt(e.target.value === "" ? "0" : e.target.value) + 60 * h,
      });
    } else if (e.target.getAttribute("name") === "hours") {
      setEditedRecipe({
        ...editedRecipe,
        minutes:
          parseInt(e.target.value === "" ? "0" : e.target.value) * 60 + m,
      });
    } else if (e.target.getAttribute("name") === "description") {
      setEditedRecipe({ ...editedRecipe, description: e.target.value });
    } else if (e.target.getAttribute("name") === "instructions") {
      setEditedRecipe({ ...editedRecipe, instructions: e.target.value });
    }
    e.preventDefault();
  };

  const del = (e) => {
    deleteRecipe();
    e.preventDefault();
  };

  const save = (e) => {
    saveRecipe(editedRecipe);
    e.preventDefault();
  };

  const cancel = (e) => {
    setEditing(false);
    e.preventDefault();
  };

  return (
    <div>
      <form>
        <input
          type="text"
          name="title"
          value={editedRecipe.title}
          onChange={handleChange}
        ></input>
        <br />
        <input
          name="image"
          value={editedRecipe.image}
          onChange={handleChange}
        ></input>
        preview:<img src={editedRecipe.image}></img>
        <br />
        hours:
        <input
          type="number"
          name="hours"
          value={parseInt(Math.floor(editedRecipe.minutes / 60))}
          onChange={handleChange}
        ></input>
        {", "}minutes:
        <input
          type="number"
          name="minutes"
          value={parseInt(editedRecipe.minutes % 60)}
          onChange={handleChange}
        ></input>
        <br />
        <input
          type="text"
          name="description"
          onChange={handleChange}
          value={editedRecipe.description}
        ></input>
        <h1> instructions </h1>
        <textarea
          name="instructions"
          cols="92"
          rows="15"
          value={editedRecipe.instructions}
          onChange={handleChange}
        ></textarea>
        {recipe.id === "" ? (
          <button className="m-2 border border-black p-2" onClick={del}>
            delete
          </button>
        ) : (
          ""
        )}
        <button className="m-2 border border-black p-2" onClick={cancel}>
          cancel
        </button>
        <button className="m-2 border border-black p-2" onClick={save}>
          save
        </button>
      </form>
    </div>
  );
};

export default Recipes;
