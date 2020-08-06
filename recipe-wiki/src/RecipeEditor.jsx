import React, { useState } from "react";
import {
  gql,
  useApolloClient,
  InMemoryCache,
  useMutation,
  useQuery,
} from "@apollo/client";
import { Ingredient, searchIngredients, createIngredient } from "./recipe";
import {
  UPDATE_RECIPE,
  CREATE_INGREDIENT,
  GET_ALL_INGREDIENTS,
  GET_CHEF_RECIPES,
  DELETE_RECIPE,
  NEW_RECIPE,
  useCurrentChefId,
  useCurrentToken,
  foodemoji,
} from "./serverfunctions";
import { Router, Link, navigate } from "@reach/router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import pluralize from "pluralize";
import IngredientEditEntry from "./IngredientEditEntry";

const RecipeEditor = ({
  recipe,
  setEditing,
  closeRecipe,
  refetch,
  refreshSearch,
}) => {
  const token = useCurrentToken();
  const chef = useCurrentChefId();
  const client = useApolloClient();
  const [counter, setCounter] = useState(0);
  let util_for_sort = [...recipe.ingredients.data];
  util_for_sort = util_for_sort.map((row) => {
    return { ...row, ref: React.createRef() };
  });
  const [editedRecipe, setEditedRecipe] = useState(recipe);
  const [finalIngredients, setFinalIngredients] = useState([]);
  const [refarray, setRefArray] = useState();
  const [deletedIngredients, setDeletedIngredients] = useState([]);
  const [editedIngredients, setEditedIngredients] = useState(
    util_for_sort.sort((a, b) => a.order - b.order)
  );
  const [updateRecipe, { updatedRecipe }] = useMutation(UPDATE_RECIPE, {
    onCompleted(res) {
      setEditing(false);
      refetch();
      navigate(`/recipes/browse/${recipe._id}`);
    },
  });
  const [newRecipe, { createdRecipe }] = useMutation(NEW_RECIPE, {
    onCompleted(res) {
      let a = client.writeQuery({
        query: gql`
          query($id: ID!) {
            findChefByID(id: $id) {
              recipes {
                data {
                  _id
                  title
                  description
                  instructions
                  ingredients {
                    data {
                      _id
                      amount
                      ingredient {
                        _id
                        name
                      }
                      name
                      notes
                      order
                    }
                  }
                  time
                  image
                }
              }
            }
          }
        `,
        variables: {
          id: chef.currentUserID,
        },
        data: {
          findChefByID: {
            recipes: {
              data: {
                _id: res.newRecipe,
                title: editedRecipe.title,
                description: editedRecipe.description,
                instructions: editedRecipe.instructions,
                ingredients: {
                  data: finalIngredients,
                },
                time: editedRecipe.time,
                image: editedRecipe.image,
              },
            },
          },
        },
      });
      navigate(`/recipes/browse/${res.newRecipe}`);
    },
  });

  const [deleteRecipe, { deletedRecipeId }] = useMutation(DELETE_RECIPE, {
    onCompleted(res) {
      client.cache.evict({ id: "Recipe:" + recipe._id });
      client.cache.gc();
      setEditing(false);
      closeRecipe();
    },
  });

  const handleChange = (e) => {
    let h = Math.floor(editedRecipe.time === "" ? "0" : editedRecipe.time / 60);
    let m = editedRecipe.time === "" ? "0" : editedRecipe.time % 60;
    if (e.target.getAttribute("name") === "title") {
      setEditedRecipe({ ...editedRecipe, title: e.target.value });
    } else if (e.target.getAttribute("name") === "image") {
      setEditedRecipe({ ...editedRecipe, image: e.target.value });
    } else if (e.target.getAttribute("name") === "minutes") {
      setEditedRecipe({
        ...editedRecipe,
        time: parseInt(e.target.value === "" ? "0" : e.target.value) + 60 * h,
      });
    } else if (e.target.getAttribute("name") === "hours") {
      setEditedRecipe({
        ...editedRecipe,
        time: parseInt(e.target.value === "" ? "0" : e.target.value) * 60 + m,
      });
    } else if (e.target.getAttribute("name") === "description") {
      setEditedRecipe({ ...editedRecipe, description: e.target.value });
    } else if (e.target.getAttribute("name") === "instructions") {
      setEditedRecipe({ ...editedRecipe, instructions: e.target.value });
    }
    e.preventDefault();
  };

  const del = (e) => {
    let allIDs = [...deletedIngredients];
    for (let el of editedIngredients) {
      if (el._id !== "") {
        allIDs = [...allIDs, el._id];
      }
    }
    deleteRecipe({
      context: {
        headers: {
          authorization: "Bearer " + token.token,
        },
      },
      variables: {
        id: recipe._id,
        delete: allIDs,
      },
    });
    e.preventDefault();
  };

  const save = (e) => {
    let inputIngredients = [];
    for (let i = 0; i < editedIngredients.length; i++) {
      if (editedIngredients[i].ingredient._id || "" !== "") {
        inputIngredients.push({
          id: editedIngredients[i]._id.startsWith("new")
            ? ""
            : editedIngredients[i]._id || "",
          name: editedIngredients[i].name || "",
          amount: editedIngredients[i].amount || "",
          notes: editedIngredients[i].notes || "",
          ingredientid: editedIngredients[i].ingredient._id,
          order: i,
          recipeid: editedRecipe._id,
        });
      }
    }
    if (recipe._id === "new") {
      let newRecipeObj = {
        ingredients: inputIngredients,
        title: editedRecipe.title,
        chef: { connect: chef.currentUserID },
        description: editedRecipe.description,
        instructions: editedRecipe.instructions,
        time: editedRecipe.time,
        image: editedRecipe.image,
      };
      newRecipe({
        context: {
          headers: { authorization: "Bearer " + token.token },
        },
        variables: {
          data: newRecipeObj,
        },
      });
    } else {
      updateRecipe({
        context: {
          headers: {
            authorization: "Bearer " + token.token,
          },
        },
        variables: {
          id: editedRecipe._id,
          data: {
            title: editedRecipe.title,
            description: editedRecipe.description,
            instructions: editedRecipe.instructions,
            time: editedRecipe.time,
            image: editedRecipe.image,
          },
          delete: deletedIngredients === [] ? null : deletedIngredients,
          update: inputIngredients === [] ? null : inputIngredients,
        },
      });
    }
    setEditedIngredients(inputIngredients);
    e.preventDefault();
  };

  const cancel = (e) => {
    setEditing();
    e.preventDefault();
  };

  const editIngredient = (i, dex) => {
    let templist = [...editedIngredients];
    templist[dex] = i;
    setEditedIngredients(templist);
  };

  const removeIngredient = (dex) => {
    if (editedIngredients[dex]._id !== "") {
      let dtemplist = deletedIngredients;
      dtemplist.push(editedIngredients[dex]._id);
      setDeletedIngredients(dtemplist);
    }
    let etemplist = [...editedIngredients];
    etemplist.splice(dex);
    for (let x = 0; x < etemplist.length; x++) {
      etemplist[x] = { ...etemplist[x], order: x };
    }
    setEditedIngredients(etemplist);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const newBlankIngredient = () => {
    let template = {
      _id: "new" + String(Date.now()),
      ingredient: {
        _id: "",
        name: "",
      },
      name: "",
      amount: "",
      notes: "",
      order: editedIngredients.length,
    };
    let ingredientList = [...editedIngredients, template];
    setEditedIngredients(ingredientList);
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    let ingredientList = [...editedIngredients];
    const ingredients = reorder(
      ingredientList,
      result.source.index,
      result.destination.index
    );

    setEditedIngredients(ingredients);
  };

  const nextLine = (dex) => {
    if (dex + 1 < editedIngredients.length) {
      editedIngredients[dex + 1].ref.current.focus();
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-8 relative lg:w-2/3 mx-auto ">
      <div className="col-span-12 flex flex-col md:flex-row-reverse">
        <button
          className="md:flex-none align-center border px-4 w-auto border-black h-10 mb-4"
          onClick={cancel}
        >
          cancel
        </button>
        <div className="md:flex-grow text-xl flex text-left mb-4 mr-4 px-5">
          <div className="flex-none inline w-auto mr-1">Title:</div>
          <div className="flex-grow inline funderline">
            <input
              type="text"
              name="title"
              className="w-full"
              value={editedRecipe.title || ""}
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
              placeholder="www.cdn.com/my-image"
              value={editedRecipe.image}
              onChange={handleChange}
            ></input>
          </div>
        </div>
        <div className="col-span-2 h-64 text-center">
          {foodemoji.includes(editedRecipe.image) ? (
            <button
              className="focus:border-none border-none"
              onClick={() => {
                let newemoji = foodemoji[counter + 1];
                if (counter + 3 > foodemoji.length) {
                  setCounter(0);
                } else {
                  setCounter(counter + 1);
                }

                setEditedRecipe({
                  ...editedRecipe,
                  image: newemoji,
                });
              }}
            >
              <span
                role="img"
                style={{ fontSize: "8rem", lineHeight: "normal" }}
                aria-label="food emoji"
                className="align-middle"
              >
                {editedRecipe.image}
              </span>
              <p className="text-xs text-grey-700">click to change</p>
            </button>
          ) : (
            <div className="w-full h-full p-4">
              <img
                alt="finished dish"
                className="object-contain w-full h-full object-center"
                src={recipe.image}
              ></img>
              <button
                className="text-xs"
                onClick={() => {
                  counter + 2 > foodemoji.length
                    ? setCounter(counter + 1)
                    : setCounter(0);
                  setEditedRecipe({
                    ...editedRecipe,
                    image: foodemoji[counter + 1],
                  });
                }}
              >
                use emoji
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col col-span-12 md:col-span-8 p-4 border">
        <div className="flex-none">
          {"Total time: "}
          <input
            type="number"
            name="hours"
            size="4"
            className="w-10 appearance-none"
            value={parseInt(Math.floor((editedRecipe.time || 0) / 60))}
            onChange={handleChange}
          ></input>
          {"h, "}
          <input
            type="number"
            name="minutes"
            size="4"
            className="w-10 appearance-none"
            value={parseInt((editedRecipe.time || 0) % 60)}
            onChange={handleChange}
          ></input>
          {"m"}
        </div>
        <div>
          description:{" "}
          <textarea
            name="description"
            className="w-full p-3"
            onChange={handleChange}
            value={editedRecipe.description || ""}
          ></textarea>
        </div>
      </div>

      <div className="col-span-12 align-center sm:m-4 ">
        <div className="mx-auto text-xl text-center mb-4 ">Ingredients:</div>
        <div className="hidden sm:grid sm:grid-cols-12 ">
          <div className="col-span-2 p-4">amount</div>
          <div className="col-span-3 p-4">ingredient</div>
          <div className="col-span-5 p-4">notes</div>
          <div className="col-span-2 block p-4"></div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={recipe._id}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 divide-y  divide-gray-400 w-full "
              >
                {editedIngredients.map((i, dex) => (
                  <Draggable
                    className="col-span-1"
                    key={i._id}
                    draggableId={i._id}
                    index={dex}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <IngredientEditEntry
                          ingredient={i}
                          dex={dex}
                          ref={i.ref}
                          nextLine={nextLine}
                          last={dex + 1 === editedIngredients.length}
                          removeIngredient={removeIngredient}
                          editIngredient={editIngredient}
                          createIngredient={newBlankIngredient}
                          recipeid={recipe._id}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button
            className="w-full hover:bg-gray-200 focus:bg-gray-200 col-span-12 p-4  flex justify-left"
            onClick={newBlankIngredient}
          >
            <p className="funderline w-auto italic text-left">
              {"  + new ingredient"}
            </p>
          </button>
        </DragDropContext>
        <div className="mx-auto text-xl text-center mb-4">Instructions:</div>
        <div className="mx-auto w-2/3 sm:w-1/2 md:w-1/2 ">
          <textarea
            name="instructions"
            rows="15"
            className="w-full p-3"
            value={editedRecipe.instructions || ""}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <div className="col-span-12 flex justify-center">
        {!recipe._id.startsWith("new") && (
          <button
            className="m-8 border border-black funderline p-2"
            onClick={del}
          >
            delete
          </button>
        )}
        <button
          className="m-8 border border-black funderline p-2"
          onClick={cancel}
        >
          cancel
        </button>
        <button
          className="m-8 border border-black funderline p-2"
          onClick={save}
        >
          save
        </button>
      </div>
    </div>
  );
};

export default RecipeEditor;
