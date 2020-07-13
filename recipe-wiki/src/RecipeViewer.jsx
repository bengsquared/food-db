import React from "react";

const RecipeViewer = ({ recipe, closeRecipe, setEditing }) => {
  const edit = () => {
    setEditing(true);
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-8 relative">
      <button
        className="absolute align-center border px-4 border-black h-10 top-0 right-0 m-8"
        onClick={closeRecipe}
      >
        close
      </button>
      <div className="col-span-12 text-2xl text-center mb-8">
        {recipe.title}
      </div>
      <div className="col-span-12 h-64 md:col-span-4">
        <img
          alt="finished dish"
          className="object-cover w-full h-full object-center"
          src={recipe.image}
        ></img>
      </div>
      <div className="flex flex-col col-span-12 md:col-span-8 p-4 border">
        <p>
          <span role="img" aria-label="time">
            ⏱
          </span>
          {Math.floor(recipe.minutes / 60)}h:{recipe.minutes % 60}m{" "}
        </p>
        <br />
        <p className="text-base">{recipe.description}</p>
        <br />
        <div>
          <span role="img" aria-label="tags">
            🏷
          </span>
          :{recipe.tags === [] ? recipe.tags : "no tags to show"}
        </div>
      </div>
      <div className="col-span-12 align-center">
        <div className="mx-auto text-xl text-center mb-4">Instructions:</div>
        <pre className="mx-auto w-2/3 sm:w-1/2 md:w-1/2 ">
          {recipe.instructions}
        </pre>
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
