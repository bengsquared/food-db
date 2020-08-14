import React from "react";
import Main from "./Main";
import Login from "./Login";
import ShareRecipe from "./ShareRecipe";
import { useApolloClient, gql } from "@apollo/client";
import { defaultToken } from "./constants";
import { Router, navigate, Redirect } from "@reach/router";
import { useCookies } from "react-cookie";
import { GET_CHEF_FULL_ON_LOGIN } from "./serverfunctions";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "userToken",
    "currentUserID",
  ]);
  const client = useApolloClient();

  let cookieToken = defaultToken;
  if (cookies && cookies.userToken && cookies.currentUserID) {
    cookieToken = cookies.userToken;
    client.writeQuery({
      query: gql`
        query GetState {
          isLoggedIn
          token
          currentUserID
        }
      `,
      data: {
        isLoggedIn: true,
        token: cookieToken,
        currentUserID: cookies.currentUserID,
      },
    });
  }

  const login = (userToken, newuser) => {
    client.clearStore().then(() => {
      client
        .query({
          query: GET_CHEF_FULL_ON_LOGIN,
          context: {
            headers: {
              authorization: "Bearer " + userToken,
            },
          },
        })
        .then((result) => {
          client.writeQuery({
            query: gql`
              query GetState {
                isLoggedIn
                token
                currentUserID
              }
            `,
            data: {
              isLoggedIn: true,
              token: userToken,
              currentUserID: result.data.me._id,
            },
          });
          setCookie("currentUserID", result.data.me._id, { path: "/" });
          setCookie("userToken", userToken, { path: "/" });
          if (newuser) {
            navigate("/profile/me/edit");
          } else {
            navigate("/");
          }
        });
    });
  };

  return (
    <Router>
      <Main className="container min-h-screen" path="/*" />
      <Login onLogin={login} path="/login/*" />
      <ShareRecipe path="/share/recipes/:id" />
      <Redirect noThrow from="/signup" to="/login/signup" />
    </Router>
  );
};

export default App;
