import React, { useState } from "react";

const Header = ({ setNav, user }) => {
  const navigate = (e) => {
    setNav(e.target.getAttribute("name"));
    console.log(e.target.getAttribute("name"));
    console.log(e.target);
  };

  return (
    <div class="header">
      <div className="logo inline">
        <h2>Recipe Wiki</h2>
      </div>
      <div className="headeritems">
        <button
          name="Recipes"
          className="clickable inline headbutt"
          onClick={navigate}
        >
          Recipes
        </button>
        <button
          name="Profile"
          className="clickable inline headbutt"
          onClick={navigate}
        >
          My Profile
        </button>
      </div>
    </div>
  );
};

export default Header;
