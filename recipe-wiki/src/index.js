import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./assets/main.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import { defaultToken } from "./constants";
import { CookiesProvider } from "react-cookie";
import { typeDefs, resolvers } from "./serverfunctions";

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: "https://graphql.fauna.com/graphql",
  cache: cache,
  typeDefs,
  resolvers,
});

client.writeQuery({
  query: gql`
    query GetState {
      isLoggedIn @client
      token @client
    }
  `,
  data: { isLoggedIn: false, token: defaultToken },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
