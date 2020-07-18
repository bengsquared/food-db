import React, { useState } from "react";

const Header = ({ setNav, user, logOut, currentSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (e) => {
    setNav(e.target.getAttribute("name"));
    console.log(e.target.getAttribute("name"));
    console.log(e.target);
  };

  return (
    <div className="border z-10 items-center flex flex-col sm:flex-row p-3 fixed h-auto w-full bg-white">
      <div className="mx-auto sm:mx-1 m-1 p3 ">
        <h2>Recipe Wiki</h2>
      </div>
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
          name="Profile"
          className=" px-0 py-3 sm:px-3 sm:py-0 funderline"
          onClick={(e) => {
            setMenuOpen(false);
            navigate(e);
          }}
        >
          Profile
        </button>
        <button
          name="Recipes"
          className=" px-0 py-3 sm:px-3 sm:py-0 funderline"
          onClick={(e) => {
            setMenuOpen(false);
            navigate(e);
          }}
        >
          Recipes
        </button>
      </div>
    </div>
  );
};

export default Header;
