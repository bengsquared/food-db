import { ajax } from "jquery";
import { apiUrl } from "./constants";

export class Recipe {
  constructor(
    id,
    title,
    chefid,
    description,
    instructions,
    minutes,
    image,
    tags
  ) {
    this.id = id;
    this.title = title;
    this.chefid = chefid;
    this.description = description;
    this.instructions = instructions;
    this.minutes = minutes;
    this.image = image;
    this.tags = tags;
  }
}

export const searchRecipes = (tags, searchterms, chefid, callback) => {
  let data = {
    searchterms: searchterms,
    tags: tags,
    chefid: chefid,
  };
  const url = `${apiUrl}/recipes/browse`;
  let settings = {
    url: url,
    async: true,
    type: "GET",
    method: "GET",
    data: data,
  };
  console.log("ok1");
  ajax(settings).then(
    (res, textStatus, ok) => {
      console.log("ok");
      console.log(res);
      console.log(textStatus);
      res = JSON.parse(res);
      let previews = res.map(
        (r) =>
          new Recipe(
            r.id,
            r.title,
            r.chefid,
            r.description,
            null,
            r.minutes,
            r.image,
            r.tags
          )
      );
      callback(previews);
    },
    (jqxhr, textStatus, errorthrown) => {
      console.log(jqxhr);
      console.log(textStatus);
      console.log(errorthrown);
      callback([]);
    }
  );
};

export const getRecipe = (id, callback) => {
  const url = `${apiUrl}/recipes/browse/${id}`;
  console.log(url);
  let settings = {
    async: true,
    type: "GET",
    url: url,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  ajax(settings).done((r) => {
    let nr = new Recipe(
      r.id,
      r.title,
      r.chefid,
      r.description,
      r.instructions,
      r.minutes,
      r.image,
      r.tags
    );
    callback(nr);
  });
};

export const removeRecipe = (id, callback) => {
  const url = `${apiUrl}/recipes/browse/${id}`;
  console.log(url);
  let settings = {
    async: true,
    type: "DELETE",
    url: url,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  ajax(settings).done((r) => {
    callback();
  });
};

export const updateRecipe = (recipe, success) => {
  let data = recipe;
  let endpoint = `${apiUrl}/recipes/browse/${recipe.id}`;
  let settings = {
    processData: false,
    async: true,
    type: "POST",
    url: endpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referrer: "http://localhost:3000",
    },
    data: JSON.stringify(data),
  };
  console.log(settings);
  ajax(settings).then(
    (res, textStatus, ok) => {
      console.log("ok");
      console.log(res);
      success(recipe);
    },
    (jqxhr, textStatus, errorthrown) => {
      console.log("got an error");
      console.log(jqxhr);
      console.log(textStatus);
      console.log(errorthrown);
    }
  );
};

export const createRecipe = (recipe, success) => {
  let data = recipe;
  let endpoint = `${apiUrl}/recipes/new-recipe`;
  let settings = {
    processData: false,
    async: true,
    type: "POST",
    url: endpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referrer: "http://localhost:3000",
    },
    data: JSON.stringify(data),
  };
  console.log(settings);
  ajax(settings).then(
    (res, textStatus, ok) => {
      console.log("ok");
      console.log(res);
      success(recipe);
    },
    (jqxhr, textStatus, errorthrown) => {
      console.log("got an error");
      alert(errorthrown + " " + textStatus);
    }
  );
};
