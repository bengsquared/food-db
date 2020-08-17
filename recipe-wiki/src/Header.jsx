import React, { useState } from "react";
import { navigate } from "@reach/router";
import { useCookies } from "react-cookie";
import { useApolloClient, gql } from "@apollo/client";
import { useCurrentToken } from "./serverfunctions";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useCurrentToken();
  const [cookies, setCookie, removeCookie] = useCookies(
    ["userToken"],
    ["currentUserID"]
  );
  const client = useApolloClient();
  const logOut = () => {
    client.clearStore().then(() => {
      removeCookie("userToken", { path: "/" });
      removeCookie("currentUserID", { path: "/" });
      client.mutate({
        mutation: gql`
          mutation logout {
            logoutChef
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + token.token,
          },
        },
      });
      client.writeQuery({
        query: gql`
          query GetState {
            isLoggedIn @client
            token @client
          }
        `,
        data: {
          isLoggedIn: false,
          token: process.env.REACT_APP_DEFAULT_TOKEN,
        },
      });
      navigate("/login");
    });
  };

  return (
    <div className="border z-10 items-center flex flex-col sm:flex-row p-3 fixed h-auto w-full bg-white">
      <button
        onClick={() => navigate("/recipes/browse")}
        className="mx-auto sm:mx-1  p-2 funky hover:font-bold hover:text-white"
      >
        <h2>RecipeBox</h2>
      </button>
      <button
        className="absolute top-0 right-0 w-5 h-5 m-5 sm:hidden overflow-visible "
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          className="block stroke-current"
          viewBox="0 0 63 63"
          strokeWidth="5"
          strokeLinecap="round"
        >
          <line x1="3" y1="3" x2="60" y2="3" stroke="black"></line>
          <line x1="3" y1="25" x2="60" y2="25" stroke="black"></line>
          <line x1="3" y1="47" x2="60" y2="47" stroke="black"></line>
        </svg>
      </button>
      <div
        className={
          (menuOpen ? "flex " : "sm:flex hidden") +
          " transform transition flex-col-reverse divide-y divide-y-reverse divide-grey-400 sm:flex-grow sm:flex-row-reverse sm:divide-x-reverse sm:divide-x sm:divide-y-0 "
        }
      >
        <button
          name="logOut"
          className="px-0 py-3 sm:px-3 sm:py-0 funderline"
          onClick={() => {
            setMenuOpen(false);
            logOut();
          }}
        >
          Log out
        </button>
        <button
          onClick={(e) => {
            setMenuOpen(false);
            window.scrollTo({ top: 0 });
            window.open(
              "https://www.notion.so/RecipeBox-86991e4e1964406d968e74cb85446da2"
            );
          }}
          className=" px-0 py-3 sm:px-3 sm:py-0 funderline"
        >
          About
        </button>
        <button
          name="Profile"
          className=" px-0 py-3 sm:px-3 sm:py-0 funderline"
          onClick={(e) => {
            setMenuOpen(false);
            window.scrollTo({ top: 0 });
            navigate("/profile/me/");
          }}
        >
          Profile
        </button>
        <button
          name="Recipes"
          className=" px-0 py-3 sm:px-3 sm:py-0 funderline"
          onClick={(e) => {
            setMenuOpen(false);
            window.scrollTo({ top: 0 });
            navigate("/recipes/browse");
          }}
        >
          Recipes
        </button>
      </div>
    </div>
  );
};

export default Header;
