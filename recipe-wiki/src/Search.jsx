import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  useCurrentToken,
  GET_CHEF_RECIPES,
  useCurrentChefId,
  foodemoji,
} from "./serverfunctions";

const Search = ({ openRecipe, newRecipe }) => {
  const token = useCurrentToken();
  const chefid = useCurrentChefId();
  const { loading, error, data, refetch } = useQuery(GET_CHEF_RECIPES, {
    variables: {
      id: chefid.currentUserID,
    },
    context: {
      headers: {
        authorization: "Bearer " + token.token,
      },
    },
    notifyOnNetworkStatusChange: true,
  });
  const [currentList, setCurrentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    searchFilter(e.target.value);
    e.preventDefault();
  };

  const searchFilter = (term) => {
    if (!!data && term !== "") {
      let terms_processed = new RegExp(term.trim().replace(/\W+/g, "|"), "gi");
      let rec = data.findChefByID.recipes.data;
      let concat = "";
      let datalist = [];
      let relevance = 0;
      for (let r of rec) {
        concat = String(r.title) + " " + String(r.description);
        relevance = concat.match(terms_processed);
        if (!!relevance) {
          datalist.push({ ...r, rel: relevance.length });
        }
      }
      setCurrentList(
        datalist === []
          ? []
          : datalist.sort((a, b) => {
              return b.rel - a.rel;
            })
      );
    }
  };

  return (
    <div className=" h-full grid grid-cols-12 gap-4 p-4">
      <div className="col-span-12 sm:col-span-8 md:col-span-10 items-center p-4 flex border ">
        <div className="funderline flex-grow">
          <input
            name="searchbox"
            placeholder="search"
            className="w-full"
            value={searchTerm}
            onChange={handleChange}
          ></input>
        </div>
        <button name="search" className="mx-2">
          <span className="inline" role="img" aria-label="search">
            🔍
          </span>
        </button>
      </div>
      <div className="col-span-12 sm:col-span-4 md:col-span-2 justify-center flex ">
        <button
          onClick={newRecipe}
          className="m-2 mx-auto border funderline border-black p-2"
        >
          new recipe
        </button>
      </div>
      <div className="col-span-12 h-full overflow-y-show grid gap-4">
        {!!loading ? (
          <div> {"Loading..."} </div>
        ) : !!error ? (
          <div> {String(Error)} </div>
        ) : searchTerm === "" && data.findChefByID.recipes.data.length > 0 ? (
          data.findChefByID.recipes.data.map((res) => (
            <ResultCard key={res._id} res={res} openRecipe={openRecipe} />
          ))
        ) : data.findChefByID.recipes.data.length === 0 ? (
          <div className="w-full text-center text-md p-4">
            <h2>
              {"you don't have any recipes right now, you should put some in!"}
              <br />
              <button className="funderline p-4" onClick={newRecipe}>
                create a new recipe
              </button>
            </h2>
          </div>
        ) : currentList.length === 0 ? (
          <div>
            <h2>No Matching Recipes :(</h2>
          </div>
        ) : (
          currentList.map((res) => (
            <ResultCard key={res._id} res={res} openRecipe={openRecipe} />
          ))
        )}
      </div>
    </div>
  );
};

const ResultCard = ({ res, openRecipe }) => {
  return (
    <div
      className="h-auto sm:h-56 recipecard p-4 gap-8 col-span-12 border flex flex-col-reverse sm:grid sm:grid-cols-12 cursor-pointer "
      onClick={() => {
        openRecipe(res._id);
      }}
    >
      <div className="flex-grow sm:col-span-8">
        <div className="text-xl font-bold block">{res.title}</div>
        <p className="text-xs">
          <span role="img" aria-label="time">
            ⏱
          </span>
          {Math.floor(res.time / 60)}h:{res.time % 60}m{" "}
        </p>
        <p className="text-base">{res.description}</p>
      </div>
      <div className="flex-none h-48 sm:col-span-4 sm:h-48 leading-relaxed text-center">
        {(res.image || "") === "" || foodemoji.includes(res.image) ? (
          <span
            role="img"
            style={{ fontSize: "8rem", lineHeight: "normal" }}
            aria-label="food emoji"
            className="align-middle"
          >
            {foodemoji.includes(res.image)
              ? res.image
              : foodemoji[Math.floor(Math.random() * foodemoji.length)]}
          </span>
        ) : (
          <img
            alt="preview"
            className="object-cover w-full h-full object-center"
            src={res.image}
          ></img>
        )}
      </div>
    </div>
  );
};

export default Search;
