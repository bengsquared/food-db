import React from "react";
import Main from "./Main";
import { CookiesProvider } from "react-cookie";

const App = () => (
  <CookiesProvider>
    <Main />
  </CookiesProvider>
);

export default App;
