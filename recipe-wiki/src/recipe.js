import { ajax } from "jquery";
import { apiUrl } from "./constants";

export class Ingredient {
  constructor(id, ingredientid, name, amount, listorder, notes) {
    this.id = id;
    this.ingredientid = ingredientid;
    this.name = name;
    this.amount = amount;
    this.listorder = listorder;
    this.notes = notes;
  }
}

export class Recipe {
  constructor(
    id,
    title,
    chefid,
    description,
    instructions,
    ingredients,
    minutes,
    image,
    tags
  ) {
    this.id = id;
    this.title = title;
    this.chefid = chefid;
    this.description = description;
    this.instructions = instructions;
    this.ingredients = ingredients;
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
  ajax(settings).then(
    (res, textStatus, ok) => {
      res = JSON.parse(res);
      let previews = res.map(
        (r) =>
          new Recipe(
            r.id,
            r.title,
            r.chefid,
            r.description,
            r.instructions,
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
    let i = [];
    let ing = r.ingredients.sort((a, b) => a.listorder - b.listorder);
    for (const n of ing) {
      i.push(
        new Ingredient(
          n.id,
          n.ingredientid,
          n.name,
          n.amount,
          n.listorder,
          n.notes
        )
      );
    }

    let nr = new Recipe(
      r.id,
      r.title,
      r.chefid,
      r.description,
      r.instructions,
      i,
      r.minutes,
      r.image,
      r.tags
    );
    callback(nr);
  });
};

export const removeRecipe = (id, callback) => {
  const url = `${apiUrl}/recipes/browse/${id}`;
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
  ajax(settings).then(
    (res, textStatus, ok) => {
      success(recipe);
    },
    (jqxhr, textStatus, errorthrown) => {
      alert(errorthrown);
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
  ajax(settings).then(
    (res, textStatus, ok) => {
      success(recipe);
    },
    (jqxhr, textStatus, errorthrown) => {
      alert(errorthrown + " " + textStatus);
    }
  );
};

export const searchIngredients = (term, success) => {
  let data = { searchterm: term };
  let endpoint = `${apiUrl}/ingredients`;
  let settings = {
    async: true,
    type: "GET",
    url: endpoint,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Referrer: "http://localhost:3000",
    },
    data: data,
  };
  ajax(settings).then(
    (res, textStatus, ok) => {
      console.log(res);
      let list = JSON.parse(res);
      console.log(list);
      success(list);
    },
    (jqxhr, textStatus, errorthrown) => {
      success([]);
    }
  );
};

export const createIngredient = (name, success) => {
  console.log(name);
  let data = { name: name };
  let endpoint = `${apiUrl}/ingredients`;
  let settings = {
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
  ajax(settings).then(
    (res, textStatus, ok) => {
      success(res.ingredientid, res.name);
    },
    (jqxhr, textStatus, errorthrown) => {
      alert(errorthrown);
    }
  );
};

export const foodemoji = [
  "🥐",
  "🥯",
  "🥖",
  "🥨",
  "🍳",
  "🍔",
  "🌭",
  "🍕",
  "🥪",
  "🥙",
  "🥗",
  "🌯",
  "🌮",
  "🧆",
  "🥘",
  "🍝",
  "🍜",
  "🍲",
  "🥟",
  "🍱",
  "🍛",
  "🍣",
  "🍤",
  "🍙",
  "🍚",
  "🍘",
  "🥠",
  "🍢",
  "🍡",
  "🍨",
  "🍧",
  "🍬",
  "🍰",
  "🥧",
  "🧁",
  "🎂",
  "🍭",
  "🍮",
  "🍩",
  "🍪",
  "🍿",
  "🍫",
  "☕️",
  "🍵",
  "🧉",
];
