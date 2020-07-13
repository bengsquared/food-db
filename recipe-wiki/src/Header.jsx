import React from "react";

const Header = ({ setNav, user, logOut, currentSection }) => {
  const navigate = (e) => {
    setNav(e.target.getAttribute("name"));
    console.log(e.target.getAttribute("name"));
    console.log(e.target);
  };

  return (
    <div className="border z-10 items-center flex p-3 fixed w-full bg-white">
      <div className="m-1 p3">
        <h2>Recipe Wiki</h2>
      </div>
      <div className="flex flex-grow flex-row-reverse divide-x-reverse divide-x divide-grey-400">
        <button name="logOut" className=" px-3 funderline" onClick={logOut}>
          Log out
        </button>
        <button name="Profile" className=" px-3 funderline" onClick={navigate}>
          Profile
        </button>
        <button name="Recipes" className=" px-3 funderline" onClick={navigate}>
          Recipes
        </button>
      </div>
    </div>
  );
};

export default Header;
