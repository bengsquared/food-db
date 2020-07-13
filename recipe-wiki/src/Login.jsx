import React, { useState } from "react";
import { userLogin } from "./user";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUsername(e.target.value);
    e.preventDefault();
  };

  const enter = (e) => {
    if (e.key === "Enter") {
      login(e);
    }
  };

  const login = (e) => {
    setError(null);
    userLogin(username, onLogin).catch((e) => {
      setError(e.responseText);
    });
    e.preventDefault();
  };

  return (
    <div className="bg-white min-h-screen flex items-start justify-center">
      <div
        id="login"
        className="w-2/3 max-w-md -mt-48 p-12 flex flex-col self-center rounded bg-gray-200 overflow-hidden items-center shadow-lg"
      >
        <div className="m-1 text-xl p-1">Recipe Wiki</div>
        <div
          id="loginerror"
          className={
            (error ? "bg-red-700 " : "") +
            " text-center font-black px-2 h-6 flex-none text-white"
          }
        >
          {error}
        </div>
        <div className="">
          <label>username: </label>
          <div className="inline-block funderline">
            <input
              id="username"
              name="username"
              size="10"
              value={username}
              onChange={handleChange}
              onKeyDown={enter}
            />
          </div>
        </div>

        <button
          name="login"
          className="self-center funderline py-1 px-2 m-3 bg-green-200 border rounded"
          onClick={login}
        >
          log in
        </button>
      </div>
    </div>
  );
};

export default Login;
