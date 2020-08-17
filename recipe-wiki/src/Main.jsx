import React from "react";
import Profile from "./Profile";
import Recipes from "./Recipes";
import Header from "./Header";
import "./assets/main.css";
import "./assets/tailwind.css";
import { useCookies } from "react-cookie";
import { Router, Redirect } from "@reach/router";
import {
  useLoginStatus,
  useCurrentChefId,
  useCurrentToken,
  MAIN_FETCH,
} from "./serverfunctions";
import { useApolloClient, gql } from "@apollo/client";

const NotFound = () => <div>Sorry, nothing here.</div>;

const Main = ({ navigate }) => {
  const client = useApolloClient();
  const token = useCurrentToken();
  const chef = useCurrentChefId();
  const loggedin = useLoginStatus();
  const [cookie, setCookie, removeCookie] = useCookies([
    "userToken",
    "currentUserID",
  ]);
  if (
    !(loggedin || { isLoggedIn: false }).isLoggedIn ||
    (token.token || process.env.REACT_APP_DEFAULT_TOKEN) ===
      process.env.REACT_APP_DEFAULT_TOKEN ||
    !chef.currentUserID
  ) {
    removeCookie("userToken", { path: "/" });
    removeCookie("currentUserID", { path: "/" });
    client.writeQuery({
      query: gql`
        query GetState {
          isLoggedIn @client
          token @client
          currentUserID @client
        }
      `,
      data: {
        isLoggedIn: false,
        token: process.env.REACT_APP_DEFAULT_TOKEN,
        currentUserID: null,
      },
    });
    navigate("/login");
    return <NotFound />;
  }

  client
    .query({
      query: MAIN_FETCH,
      variables: {
        id: chef.currentUserID,
      },
      context: {
        headers: {
          authorization: "Bearer " + token.token,
        },
      },
    })
    .then(
      (value) => {},
      (error) => {
        if (
          String(error).includes("Invalid authorization header") ||
          String(error).includes("Invalid database secret")
        ) {
          removeCookie("userToken", { path: "/" });
          removeCookie("currentUserID", { path: "/" });
          client.writeQuery({
            query: gql`
              query GetState {
                isLoggedIn @client
                token @client
                currentUserID @client
              }
            `,
            data: {
              isLoggedIn: false,
              token: process.env.REACT_APP_DEFAULT_TOKEN,
              currentUserID: null,
            },
          });
          navigate("/login");
        }
      }
    );

  return (
    <div>
      <Header />
      <Router className="pt-20">
        <Recipes path="/recipes/*" />
        <Profile path="/profile/me/*" />
        <Redirect noThrow from="/" to="/recipes/browse" default />
      </Router>
    </div>
  );
};

export default Main;
