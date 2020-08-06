import React from "react";
import { foodemoji } from "./serverfunctions";

const RecipeViewer = ({ recipe, closeRecipe, setEditing }) => {
  const ingredientsSorted = [...recipe.ingredients.data];
  ingredientsSorted.sort((a, b) => {
    return a.order - b.order;
  });
  const edit = () => {
    setEditing(true);
  };
  return (
    <div className="grid grid-cols-12 gap-4 p-8 relative lg:w-2/3 mx-auto">
      <button
        className="absolute align-center px-4  sm:border sm:border-black h-10 top-0 right-0 m-6 sm:m-8 "
        onClick={closeRecipe}
      >
        <svg
          className="inline stroke-current sm:hidden w-4 h-4 block"
          viewBox="0 0 50 50"
          strokeWidth="5"
          strokeLinecap="round"
        >
          <line x1="2" y1="2" x2="48" y2="48" stroke="black"></line>
          <line x1="2" y1="48" x2="48" y2="2" stroke="black"></line>
        </svg>
        <p className="hidden sm:inline">close</p>
      </button>
      <div className="col-span-12 flex text-xl sm:justify-center sm:text-2xl mb-8">
        <div className="w-3/4 sm:w-2/3 sm:text-center ">{recipe.title}</div>
      </div>

      {recipe.image === "" ? (
        ""
      ) : foodemoji.includes(recipe.image) ? (
        <div className="col-span-12 h-64 md:col-span-4 text-center">
          <span
            role="img"
            style={{ fontSize: "8rem", lineHeight: "normal" }}
            aria-label="food emoji"
            className="align-middle"
          >
            {recipe.image}
          </span>
        </div>
      ) : (
        <div className="col-span-12 h-64 md:col-span-4">
          <img
            alt="finished dish"
            className="object-contain w-full h-full object-center"
            src={recipe.image}
          ></img>
        </div>
      )}
      <div
        className={
          "flex flex-col col-span-12 p-4 border " +
          (recipe.image === "" ? "" : " md:col-span-8")
        }
      >
        <p>
          <span role="img" aria-label="time">
            ⏱
          </span>
          {Math.floor(recipe.time / 60)}h:{recipe.time % 60}m{" "}
        </p>
        <br />
        <p className="text-base">{recipe.description}</p>
        <br />
      </div>
      <div className="col-span-12 border align-center p-8">
        <div className="mx-auto text-xl mb-4 w-2/3">Ingredients:</div>
        <pre className="mx-auto w-2/3 ">
          {ingredientsSorted.map((i) => (
            <div key={i._id}>
              {"-> "}
              {i.amount} {i.name}
              {!!i.notes && i.notes !== "" && " - "}
              {i.notes}
            </div>
          ))}
        </pre>
      </div>
      <div className="col-span-12 align-center p-8">
        <div className="mx-auto text-xl mb-4 w-2/3 mb-8">Instructions:</div>
        <pre className="mx-auto w-2/3 ">{recipe.instructions}</pre>
      </div>
      <div className="col-span-12 flex justify-center">
        <button className="border px-4 border-black h-10 " onClick={edit}>
          edit
        </button>
      </div>
    </div>
  );
};

export default RecipeViewer;
