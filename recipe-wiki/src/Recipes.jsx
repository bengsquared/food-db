import React, { useState } from "react";
import Search from "./Search";
import RecipeEditor from "./RecipeEditor";
import RecipeViewer from "./RecipeViewer";
import { useQuery } from "@apollo/client";
import { Router, Link, navigate } from "@reach/router";
import {
  GET_FULL_RECIPE,
  useCurrentToken,
  useCurrentChefId,
  recipeTemplate,
} from "./serverfunctions";

const Recipes = () => {
  const openRecipe = (id) => {
    navigate(`/recipes/browse/${id}/`);
    window.scrollTo({ top: -20 });
  };

  const closeRecipe = () => {
    navigate("/recipes/browse");
    window.scrollTo({ top: -20 });
  };

  const newRecipe = () => {
    navigate("/recipes/create");
  };

  return (
    <Router>
      <RecipeEditor
        path="create"
        recipe={recipeTemplate}
        refetch={closeRecipe}
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
    return <div className="linear-wipe w-full h-full"></div>;
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
