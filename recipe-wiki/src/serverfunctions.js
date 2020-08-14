import { useQuery, gql } from "@apollo/client";
import { defaultToken } from "./constants";
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    token: String!
  }
`;

const IS_LOGGED_IN = gql`
  query isLoggedIn {
    isLoggedIn @client
  }
`;

const GET_CURRENT_TOKEN = gql`
  query getCurrentToken {
    token @client
  }
`;

const GET_CURRENT_USER_ID = gql`
  query getCurrentUserID {
    currentUserID @client
  }
`;

export const GET_CHEF_RECIPES = gql`
  query getChef($id: ID!) {
    findChefByID(id: $id) {
      _id
      recipes {
        data {
          _id
          title
          description
          time
          image
          ingredients {
            data {
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_CHEF_FULL_ON_LOGIN = gql`
  query me {
    me {
      _id
      username
      name
      bio
      image
    }
  }
`;

export const MAIN_FETCH = gql`
  query main($id: ID!) {
    findChefByID(id: $id) {
      _id
      username
      name
      bio
      image
      recipes {
        data {
          _id
          title
          description
          time
          image
          ingredients {
            data {
              name
            }
          }
        }
      }
    }
  }
`;

// export const GET_CHEF_FULL_ON_LOGIN = gql`
//   query me {
//     me {
//       _id
//       username
//       name
//       bio
//       image
//       recipes {
//         data {
//           _id
//           title
//           description
//           time
//           image
//         }
//       }
//     }
//   }
// `;

export const GET_CHEF_PROFILE = gql`
  query getchef($id: ID!) {
    findChefByID(id: $id) {
      _id
      username
      name
      bio
      image
    }
  }
`;

export const GET_FULL_RECIPE = gql`
  query getRecipe($id: ID!) {
    findRecipeByID(id: $id) {
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
      chef {
        _id
        username
      }
      time
      image
      public
    }
  }
`;

export const recipeTemplate = {
  _id: "new",
  title: "New Recipe Title",
  description: "A quick, informative, searchable blurb",
  image:
    "https://olddesignshop.com/wp-content/uploads/2017/11/Vintage-Recipes-Bread-Rolls-Old-Design-Shop.jpg",
  instructions: "Step 1:\n\n\nStep 2:\n\n\nStep 3:\n\n\n",
  ingredients: { data: [] },
  time: 15,
  public: false,
};

export const UPDATE_CHEF = gql`
  mutation updateChef($id: ID!, $data: ChefInput!) {
    updateChef(id: $id, data: $data) {
      _id
      username
      name
      bio
      image
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation updateRecipe(
    $id: ID!
    $data: RecipeInput!
    $delete: [ID!]
    $update: [UpdateIngredientEntryInput!]
  ) {
    batchUpdateRecipeIngredients(input: $update) {
      _id
    }
    batchDeleteRecipeIngredients(input: $delete)
    updateRecipe(id: $id, data: $data) {
      _id
    }
  }
`;

export const NEW_RECIPE = gql`
  mutation newRecipe($data: NewRecipeInput!) {
    newRecipe(input: $data)
  }
`;

export const GET_ALL_INGREDIENTS = gql`
  query GetAllIngredients {
    allIngredients(_size: 100000) {
      data {
        _id
        name
      }
    }
  }
`;

export const CREATE_INGREDIENT = gql`
  mutation CreateIngredient($input: IngredientInput!) {
    createIngredient(data: $input) {
      _id
      name
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!, $delete: [ID!]) {
    deleteRecipe(id: $id) {
      _id
    }
    batchDeleteRecipeIngredients(input: $delete)
  }
`;

export function useLoginStatus() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data || false;
}

export function useCurrentChefId() {
  const { data } = useQuery(GET_CURRENT_USER_ID);
  return data || { currentUserID: null };
}

export function useCurrentToken() {
  const { data } = useQuery(GET_CURRENT_TOKEN);
  if (!(data || { token: null }).token) {
    return defaultToken;
  } else {
    return data;
  }
}

export const resolvers = {};

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
