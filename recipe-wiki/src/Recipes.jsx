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
import { useQuery } from "@apollo/client";
import { Router, Link, Redirect, navigate } from "@reach/router";
import {
  GET_FULL_RECIPE,
  useCurrentToken,
  useCurrentChefId,
  recipeTemplate,
} from "./serverfunctions";

const Recipes = () => {
  const [recipe, setRecipe] = useState("");
  const [renderCount, setRenderCount] = useState(0);

  const openRecipe = (id) => {
    setRecipe(id);
    navigate(`/recipes/browse/${id}/`);
    window.scrollTo({ top: 0 });
  };

  const closeRecipe = () => {
    navigate("/recipes/browse");
    setRecipe("");
    window.scrollTo({ top: 0 });
  };

  const newRecipe = () => {
    setRecipe("new");
    navigate("/recipes/create");
  };

  return (
    <Router>
      <RecipeEditor
        path="create"
        recipe={recipeTemplate}
        refetch={setRecipe}
        setEditing={closeRecipe}
      />
      <RecipePage path="browse/:id/*" closeRecipe={closeRecipe} />
      <Search
        path="browse"
        openRecipe={openRecipe}
        newRecipe={newRecipe}
        default
      />
    </Router>
  );
};

const RecipePage = ({ id, closeRecipe }) => {
  const token = useCurrentToken();
  const chefid = useCurrentChefId();
  const [editing, setEditing] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_FULL_RECIPE, {
    context: {
      headers: {
        authorization: "Bearer " + token.token,
      },
    },
    variables: {
      id: id,
    },
  });

  if (loading) {
    return <div>loading...</div>;
  } else if (!!error) {
    return <div>{error.message}</div>;
  } else if (data.findRecipeByID === null) {
    return (
      <div className="mx-20 mt-20 text-xl">
        {"Not found :/"}
        <br />
        <Link to="/">
          <u>take me home</u>
        </Link>
      </div>
    );
  }

  const toggleEdit = () => {
    editing
      ? navigate(`/recipes/browse/${id}`)
      : navigate(`/recipes/browse/${id}/edit`);
    setEditing(!editing);
  };

  return (
    <Router>
      <RecipeEditor
        path="/edit"
        recipe={data.findRecipeByID}
        refetch={refetch}
        closeRecipe={closeRecipe}
        setEditing={toggleEdit}
      />
      <RecipeViewer
        path="/"
        setEditing={toggleEdit}
        closeRecipe={closeRecipe}
        recipe={data.findRecipeByID}
        default
      />
    </Router>
  );
};

export default Recipes;
