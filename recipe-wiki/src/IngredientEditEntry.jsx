import React, { useState } from "react";
import IngredientPicker from "./IngredientPicker";
import handle from "./assets/handle.svg";

const IngredientEditEntry = React.forwardRef((props, ref) => {
  const [ingredient, setIngredient] = useState({
    ...props.ingredient,
    order: props.dex,
  });
  let ingredientref = React.createRef();
  let notesref = React.createRef();

  const changeIngredient = (input) => {
    setIngredient(input);
    save(input);
  };

  const keyhandler = (e) => {
    if (e.key === "ArrowDown") {
    } else if (e.key === "ArrowUp") {
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (e.target.name === "notes") {
        if (props.last) {
          props.createIngredient();
        } else {
          props.nextLine(props.dex);
        }
      } else if (e.target.name === "amount") {
        ingredientref.current.focus();
      }
    }
  };

  const notesfocus = () => {
    notesref.current.focus();
  };

  const save = (input) => {
    props.editIngredient(input, props.dex);
  };

  return (
    <div className="grid grid-cols-6 w-full">
      <form className="col-span-5 sm:col-span-6 grid grid-cols-12 sm:divide-x sm:divide-gray-400 sm:w-full">
        <div className="col-span-12 flex sm:block sm:col-span-2 p-2 sm:p-4">
          <img
            alt=""
            className="absolute z-2 -ml-6 mt-12 sm:mt-1 w-2 object-contain"
            src={handle}
          ></img>
          <label className="sm:hidden">amount:</label>
          <div className="funderline overflow-hidden">
            <input
              placeholder="2 cups"
              name="amount"
              className="overflow-hidden"
              ref={ref}
              value={ingredient.amount || ""}
              onBlur={() => {
                save(ingredient);
              }}
              onChange={(e) => {
                changeIngredient({ ...ingredient, amount: e.target.value });
              }}
              onKeyDown={keyhandler}
            ></input>
          </div>
        </div>
        <IngredientPicker
          setIngredientLine={changeIngredient}
          ingredientLine={ingredient}
          notesfocus={notesfocus}
          ref={ingredientref}
        />
        <div className="col-span-12 flex sm:block p-2 sm:p-4 sm:col-span-5 overflow-hidden">
          <label className="sm:hidden">notes:</label>
          <div className="inline funderline">
            <input
              className="w-full"
              name="notes"
              ref={notesref}
              value={ingredient.notes || ""}
              placeholder="pre-prep note"
              onBlur={() => {
                save(ingredient);
              }}
              onChange={(e) => {
                changeIngredient({ ...ingredient, notes: e.target.value });
              }}
              onKeyDown={keyhandler}
            ></input>
          </div>
        </div>
        <div className="hidden sm:block col-span-2 p-2 sm:p-4">
          <button
            className="funderline"
            onClick={() => {
              props.removeIngredient(props.dex);
            }}
          >
            remove
          </button>
        </div>
      </form>
      <button
        className="col-span-1 sm:hidden"
        onClick={() => {
          props.removeIngredient(props.dex);
        }}
      >
        <span role="img" aria-label="close">
          ✖️
        </span>
      </button>
    </div>
  );
});

export default IngredientEditEntry;
