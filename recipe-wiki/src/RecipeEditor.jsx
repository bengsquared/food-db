import React, { useState } from "react";

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
    <div className="grid grid-cols-12 gap-4 p-8 relative">
      <button
        className="absolute align-center border px-4 border-black h-10 top-0 right-0 m-8"
        onClick={cancel}
      >
        cancel
      </button>
      <div className="col-span-12 text-2xl flex text-left mb-4 mt-10 mr-10 ">
        <label className="flex-none w-auto">{"Title: "}</label>
        <div className="flex-grow funderline">
          <input
            type="text"
            name="title"
            className="funderline"
            value={editedRecipe.title}
            onChange={handleChange}
          ></input>
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
            class="w-full"
            onChange={handleChange}
            value={editedRecipe.description}
          ></textarea>
        </div>
      </div>

      <div className="col-span-12 align-center">
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
      </div>
    </div>
  );
};

export default RecipeEditor;
