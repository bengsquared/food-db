import React, { useState } from "react";
import { Ingredient, searchIngredients, createIngredient } from "./recipe";

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
    let templist = editedRecipe.ingredients;
    templist = templist.filter((i) => i.ingredientid !== "");
    setEditedRecipe({ ...editedRecipe, ingredients: templist });
    saveRecipe(editedRecipe);
    e.preventDefault();
  };

  const cancel = (e) => {
    setEditing(false);
    e.preventDefault();
  };

  const editIngredient = (i, dex) => {
    let templist = editedRecipe.ingredients;
    templist[dex] = i;
    setEditedRecipe({ ...editedRecipe, ingredients: templist });
  };

  const newBlankIngredient = () => {
    let template = new Ingredient(
      "",
      "",
      "",
      "",
      recipe.ingredients.length,
      ""
    );
    let ingredientList = recipe.ingredients;
    ingredientList.push(template);
    setEditedRecipe({ ...recipe, ingredients: ingredientList });
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-8 relative">
      <div className="col-span-12 flex flex-col md:flex-row-reverse">
        <button
          className="md:flex-none align-center border px-4 w-auto border-black h-10 mb-4"
          onClick={cancel}
        >
          cancel
        </button>
        <div className="md:flex-grow border md:text-xl flex text-left mb-4 mr-4">
          <div className="flex-none inline w-auto mr-1">Title:</div>
          <div className="flex-grow inline funderline">
            <input
              type="text"
              name="title"
              className="w-full"
              value={editedRecipe.title}
              onChange={handleChange}
            ></input>
          </div>
        </div>
      </div>
      <div className="col-span-12 grid grid-cols-2 md:col-span-4">
        <div className="col-span-2 flex p-2 m-2">
          <label className="flex-none w-auto">{"image url: "}</label>
          <div className="flex-grow funderline">
            <input
              name="image"
              className="w-full"
              value={editedRecipe.image}
              onChange={handleChange}
            ></input>
          </div>
        </div>
        <div className="col-span-2 h-64">
          <img
            alt="finished dish"
            className="object-cover w-full h-full object-center"
            src={recipe.image}
          ></img>
        </div>
      </div>
      <div className="flex flex-col col-span-12 md:col-span-8 p-4 border">
        <div className="flex-none">
          {"Total time: "}
          <input
            type="number"
            name="hours"
            size="4"
            className="w-8 appearance-none"
            value={parseInt(Math.floor(editedRecipe.minutes / 60))}
            onChange={handleChange}
          ></input>
          {"h, "}
          <input
            type="number"
            name="minutes"
            size="4"
            className="w-8 appearance-none"
            value={parseInt(editedRecipe.minutes % 60)}
            onChange={handleChange}
          ></input>
          {"m"}
        </div>
        <div>
          description:{" "}
          <textarea
            name="description"
            className="w-full"
            onChange={handleChange}
            value={editedRecipe.description}
          ></textarea>
        </div>
      </div>

      <div className="col-span-12 align-center">
        <div className="mx-auto text-xl text-center mb-4">Ingredients:</div>
        <ul>
          {editedRecipe.ingredients.map((i, dex) => (
            <li key={i.id}>
              <IngredientEditEntry
                ingredient={i}
                dex={dex}
                editIngredient={editIngredient}
                recipeid={recipe.id}
              />
            </li>
          ))}
          <li>
            <button onClick={newBlankIngredient}>add ingredient</button>
          </li>
        </ul>
        <div className="mx-auto text-xl text-center mb-4">Instructions:</div>
        <div className="mx-auto w-2/3 sm:w-1/2 md:w-1/2 ">
          <textarea
            name="instructions"
            rows="15"
            className="w-full"
            value={editedRecipe.instructions}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <div className="col-span-12 flex justify-center">
        {recipe.id === "" ? (
          ""
        ) : (
          <button className="m-2 border border-black p-2" onClick={del}>
            delete
          </button>
        )}
        <button className="m-2 border border-black p-2" onClick={cancel}>
          cancel
        </button>
        <button className="m-2 border border-black p-2" onClick={save}>
          save
        </button>
      </div>
    </div>
  );
};

const IngredientEditEntry = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredient, setIngredient] = useState(props.ingredient);
  const [searchList, setSearchList] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [allowCreate, setAllowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  let saveTimeout = null;
  let searchTimeout = null;

  const search = () => {
    setLoading(true);
    searchIngredients(searchTerm, searchListUpdate);
  };

  const searchListUpdate = (list) => {
    setSearchList(list);
    setLoading(false);
    let create = true;
    if (searchTerm === "") {
      create = false;
    }
    for (const i of list) {
      if (i.name === searchTerm) {
        create = false;
      }
      console.log("i= ");
      console.log(i);
      console.log(searchTerm);
    }
    console.log(create);
    setAllowCreate(create);
  };

  const save = () => {
    props.editIngredient(ingredient, props.dex);
  };

  const startDrag = (e) => {
    e.dataTransfer.setData("text/plain", props.dex);
  };

  const searchKeyPress = (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(search, 700);
  };

  const chooseIngredient = (id, name) => {
    let newid = props.recipeid + id;
    console.log(id);
    setIngredient({ ...ingredient, id: newid, ingredientid: id, name: name });
    console.log(Ingredient);
    setSearchList([]);
    setSearchTerm(name);
    setEditingName(false);
    setAllowCreate(false);
    save();
  };

  function onBlurHandler() {
    saveTimeout = setTimeout(() => {
      save();
      setEditingName(false);
    }, 5);
  }

  // If a child receives focus, do not close the popover.
  function onFocusHandler() {
    clearTimeout(saveTimeout);
  }

  return (
    <div
      className="border"
      draggable="true"
      onDragOver="event.preventDefault()"
      onDragStart={startDrag}
    >
      <label>amount:</label>
      <input
        className="border"
        value={ingredient.amount}
        onBlur={save}
        onChange={(e) => {
          setIngredient({ ...ingredient, amount: e.target.value });
        }}
      ></input>

      <div>
        <label>ingredient:</label>
        <div
          className="border relative"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        >
          <input
            className="border"
            aria-haspopup="true"
            aria-expanded={editingName}
            value={editingName ? searchTerm : ingredient.name}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            onFocus={() => {
              setEditingName(true);
            }}
            onKeyDown={searchKeyPress}
          ></input>
          <button className="border" onClick={search}>
            search
          </button>
          {editingName && (
            <div className="border z-10">
              <div className="text-xs text-gray-400">
                enter a basic ingredient, then select from the list or create a
                new one
              </div>
              {searchList.map((l) => (
                <button
                  className="hover:bg-gray-400 block"
                  key={l.name + l.ingredientid}
                  onClick={() => {
                    console.log("yeet!");
                    chooseIngredient(l.ingredientid, l.name);
                  }}
                >
                  {l.name}
                </button>
              ))}
              <div className="text-s">
                {searchList === []
                  ? "press Enter or click Search to find an ingredient "
                  : ""}
              </div>
              <div>
                <button
                  className={allowCreate && searchTerm !== "" ? "" : "hidden"}
                  onClick={() =>
                    createIngredient(searchTerm.toLowerCase(), chooseIngredient)
                  }
                >
                  {"create ingredient "}
                  {searchTerm.toLowerCase()}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="border inline-block">{"notes: "}</div>
        <div className="inline-block funderline">
          <input
            value={ingredient.notes}
            onBlur={save}
            onChange={(e) => {
              setIngredient({ ...ingredient, notes: e.target.value });
            }}
          ></input>
        </div>
      </div>
    </div>
  );
};

export default RecipeEditor;
