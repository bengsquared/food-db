import React, { useState, useEffect } from "react";
import Chef from "./Chef";
import Login from "./Login";
import Profile from "./Profile";
import Recipes from "./Recipes";
import Header from "./Header";
import "./assets/main.css";
import "./assets/tailwind.css";
import config from "./sheetsConfig";
import SheetsDemo from "./SheetsDemo";
import { useCookies } from "react-cookie";

const Main = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["chef"]["list"]);
  let cookiechef = null;
  if (cookies ? cookies.chef : false) {
    cookiechef = new Chef(
      cookies.chef.id,
      cookies.chef.username,
      cookies.chef.name,
      cookies.chef.bio,
      cookies.chef.image
    );
  }
  const [chef, setChef] = useState(cookiechef);
  const [currentSection, setCurrentSection] = useState("");
  const [apiActive, setApiActive] = useState(false);

  const setUser = (user) => {
    if (user instanceof Chef) {
      setChef(user);
      setCookie("list", [], { path: "/" });
      setCookie("chef", user, { path: "/" });
    }
    console.log(cookies);
  };

  const logout = () => {
    removeCookie("chef");
    setChef(null);
  };

  const setPage = (page) => {
    console.log(page);
    switch (page) {
      case "Profile":
        setCurrentSection("Profile");
        break;
      case "Recipes":
        setCurrentSection("Recipes");
        break;
      default:
        setCurrentSection("Profile");
    }
  };

  let result;
  let content;
  switch (currentSection) {
    case "Profile":
      content = <Profile onSave={setUser} user={chef} />;
      break;
    case "Recipes":
      content = (
        <Recipes
          user={chef}
          cookies={cookies}
          setCookie={setCookie}
          removeCookie={removeCookie}
        />
      );
      break;
    default:
      content = (
        <Recipes
          user={chef}
          cookies={cookies}
          setCookie={setCookie}
          removeCookie={removeCookie}
        />
      );
  }
  if (chef instanceof Chef) {
    result = (
      <div className="bg-white min-h-screen">
        <Header
          setNav={setPage}
          currentSection={currentSection}
          user={chef}
          logOut={logout}
        />
        <div className="h-16" />
        {content}
      </div>
    );
  } else {
    result = <Login onLogin={setUser} />;
  }

  return result;
};

export default Main;
