import React, { useState } from "react";
import Chef from "./Chef";
import Login from "./Login";
import Profile from "./Profile";
import Recipes from "./Recipes";
import Header from "./Header";
import "./assets/main.css";
import "./assets/tailwind.css";

import { useCookies } from "react-cookie";

const Main = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["chef"]);
  let cookiechef = null;
  if (cookies.chef) {
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

  const setUser = (user) => {
    if (user instanceof Chef) {
      setChef(user);
      setCookie("chef", user, { path: "/", maxAge: 1800 });
    }
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
      content = <Recipes user={chef} />;
      break;
    default:
      content = <Recipes user={chef} />;
  }
  if (chef instanceof Chef) {
    result = (
      <div className="bg-white h-screen">
        <Header setNav={setPage} user={chef} logOut={logout} />
        <div>{content}</div>
      </div>
    );
  } else {
    result = <Login onLogin={setUser} />;
  }

  return result;
};

export default Main;
