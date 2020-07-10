import React from "react";
import "./App.css";
import Main from "./Main";
import { CookiesProvider } from "react-cookie";

const App = () => (
  <CookiesProvider>
    <div className="App">
      <Main />
    </div>
  </CookiesProvider>
);

export default App;
