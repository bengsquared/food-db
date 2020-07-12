import React, { useState } from "react";

const Header = ({ setNav, user, logOut, currentSection }) => {
  const navigate = (e) => {
    setNav(e.target.getAttribute("name"));
    console.log(e.target.getAttribute("name"));
    console.log(e.target);
  };

  return (
    <div className="border flex">
      <div className="m-1 p-1">
        <h2>Recipe Wiki</h2>
      </div>
      <div className="flex flex-grow flex-row-reverse">
        <button name="logOut" className="flex m-1 p-1" onClick={logOut}>
          LogOut
        </button>
        <button name="Profile" className="flex m-1 p-1" onClick={navigate}>
          My Profile
        </button>
        <button name="Recipes" className="flex m-1 p-1" onClick={navigate}>
          Recipes
        </button>
      </div>
    </div>
  );
};

export default Header;
