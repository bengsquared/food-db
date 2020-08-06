import React, { useState } from "react";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Ingredient, searchIngredients, createIngredient } from "./recipe";
import {
  UPDATE_RECIPE,
  CREATE_INGREDIENT,
  GET_ALL_INGREDIENTS,
  DELETE_RECIPE,
  NEW_RECIPE,
  useCurrentChefId,
  useCurrentToken,
  foodemoji,
} from "./serverfunctions";
import { Router, Link, navigate } from "@reach/router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import pluralize from "pluralize";

const IngredientPicker = React.forwardRef(
  ({ ingredientLine, setIngredientLine, notesfocus }, ref) => {
    const token = useCurrentToken();
    const client = useApolloClient();
    const { loading, error, data } = useQuery(GET_ALL_INGREDIENTS, {
      context: {
        headers: {
          authorization: "Bearer " + token.token,
        },
      },
    });

    const [createIngredient, { newingredient }] = useMutation(
      CREATE_INGREDIENT,
      {
        onCompleted(res) {
          client.writeQuery({
            query: GET_ALL_INGREDIENTS,
            data: {
              allIngredients: {
                data: [...data.allIngredients.data, res.createIngredient],
              },
            },
          });
          chooseIngredient(res.createIngredient._id, res.createIngredient.name);
        },
      }
    );

    const [editingName, setEditingName] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const [ingredient, setIngredient] = useState(ingredientLine.ingredient);
    const [textName, setTextName] = useState(ingredientLine.name);
    const [searchTerm, setSearchTerm] = useState(ingredientLine.name);
    const [singular, setSingular] = useState(true);
    const [allowCreate, setAllowCreate] = useState(false);
    const [chosenel, setChosenel] = useState(0);
    let closeTimeout = null;
    let searchTimeout = null;

    const close = () => {
      setEditingName(false);
    };

    function onBlurHandler() {
      closeTimeout = setTimeout(() => {
        close();
      }, 50);
    }

    // If a child receives focus, do not close the popover.
    function onFocusHandler() {
      clearTimeout(closeTimeout);
    }

    const searchListUpdate = (s) => {
      if (s === "") {
        setSingular(true);
        setSearchList([]);
        setAllowCreate(false);
        return;
      }
      let term = pluralize.singular(s.toLowerCase());
      setSingular(pluralize.isSingular(s));
      let list = data.allIngredients.data;
      list = list.filter((i) => i.name.includes(term));
      setSearchList(list.slice(0, 20));
      let create = true;
      for (const i of list) {
        if (i.name === term) {
          create = false;
        }
      }
      setAllowCreate(create);
      setChosenel(0);
    };

    const keyhandler = (e) => {
      if (e.key === "ArrowDown") {
        if (
          chosenel < allowCreate ? searchList.length + 1 : searchList.length
        ) {
          setChosenel(chosenel + 1);
        }
      } else if (e.key === "ArrowUp") {
        if (chosenel > 0) {
          setChosenel(chosenel - 1);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (ingredient.name === searchTerm) {
          notesfocus();
        } else if (chosenel < searchList.length) {
          chooseIngredient(searchList[chosenel]._id, searchList[chosenel].name);
          notesfocus();
        } else if (chosenel === searchList.length && allowCreate) {
          create();
          notesfocus();
        }
      }
    };

    const create = () => {
      createIngredient({
        context: {
          headers: {
            authorization: "Bearer " + token.token,
          },
        },
        variables: {
          input: {
            name: singular
              ? searchTerm.toLowerCase()
              : pluralize.singular(searchTerm.toLowerCase()),
          },
        },
      });
    };

    const chooseIngredient = (id, name) => {
      setTextName(singular ? name : pluralize.plural(name));
      let a = { _id: id, name: name };
      setIngredient(a);
      setSearchList([]);
      setSearchTerm(singular ? name : pluralize.plural(name));
      setTextName(singular ? name : pluralize.plural(name));
      setAllowCreate(false);
      setIngredientLine({
        ...ingredientLine,
        ingredient: a,
        name: singular ? name : pluralize.plural(name),
      });
      setEditingName(false);
    };

    return (
      <div className="col-span-12 sm:col-span-3 flex content-center p-2 ">
        <div className="w-full sm:hidden">ingredient:</div>
        <div
          className={
            editingName
              ? "border border-black bg-white rounded-lg p-2 absolute my-auto"
              : "px-2 w-full sm:my-auto"
          }
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        >
          <div className="funderline ">
            <input
              ref={ref}
              className={!editingName && ingredient !== "" ? " font-bold" : ""}
              placeholder="ingredient"
              aria-haspopup="true"
              aria-expanded={editingName}
              value={editingName ? searchTerm : textName || ""}
              onChange={(e) => {
                clearTimeout(searchTimeout);
                setSearchTerm(e.target.value);
                if (e.target.value === "") {
                  setSingular(true);
                  setSearchList([]);
                } else {
                  searchTimeout = setTimeout(
                    searchListUpdate(e.target.value),
                    200
                  );
                }
              }}
              onFocus={() => {
                setEditingName(true);
              }}
              onKeyDown={keyhandler}
            ></input>
          </div>
          {editingName && (
            <div className="bg-white z-10">
              <div className="text-xs text-gray-700">
                enter a basic ingredient, then select from the list or create a
                new one
              </div>
              {loading
                ? "loading..."
                : searchList.map((l, dex) => (
                    <button
                      className={
                        "hover:bg-gray-400 block w-full text-left" +
                        (dex === chosenel ? " bg-gray-400" : "")
                      }
                      key={l._id}
                      onClick={() => {
                        chooseIngredient(l._id, l.name);
                      }}
                    >
                      {singular ? l.name : pluralize.plural(l.name)}
                    </button>
                  ))}
              <div className="text-s">
                {searchTerm === "" ? "type to find an ingredient " : ""}
              </div>
              <div>
                <button
                  className={
                    (allowCreate && searchTerm !== "" ? "" : "hidden") +
                    (chosenel === searchList.length ? " bg-gray-400" : "")
                  }
                  onClick={create}
                >
                  {"create ingredient "}
                  {searchTerm.toLowerCase()}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default IngredientPicker;
