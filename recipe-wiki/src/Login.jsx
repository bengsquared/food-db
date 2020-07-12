import React, { useState } from "react";
import { userLogin } from "./user";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUsername(e.target.value);
    e.preventDefault();
  };

  const login = (e) => {
    userLogin(username, onLogin).catch((e) => {
      setError(e.responseText);
    });
    e.preventDefault();
  };

  return (
    <div id="login">
      <div id="loginerror" style={{ backgroundColor: "red" }}>
        {error}
      </div>
      <label>username:</label>
      <input
        id="username"
        name="username"
        size="10"
        value={username}
        onChange={handleChange}
      />
      <br />
      <button name="login" onClick={login}>
        log in
      </button>
    </div>
  );
};

export default Login;
