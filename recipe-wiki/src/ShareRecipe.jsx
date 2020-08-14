import React, { useState } from "react";
import RecipeViewer from "./RecipeViewer";
import { useQuery } from "@apollo/client";
import { Router, Link, navigate } from "@reach/router";
import {
  GET_FULL_RECIPE,
  useCurrentToken,
  useCurrentChefId,
  recipeTemplate,
} from "./serverfunctions";
import { defaultToken } from "./constants.js";

const ShareRecipe = ({ id }) => {
  console.log("share");
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
    return (
      <div className="mx-auto my-auto text-center pt-20">
        {
          "Recipe not found... the recipe may not exist or may have been deleted"
        }
        <br />
        <Link to="/" title="country roads">
          <u>take me home</u>
        </Link>
      </div>
    );
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

  const closeRecipe = () => {
    navigate("/recipes/browse/");
  };

  return (
    <RecipeViewer
      setEditing={toggleEdit}
      closeRecipe={closeRecipe}
      recipe={data.findRecipeByID}
      default
    />
  );
};

export default ShareRecipe;
