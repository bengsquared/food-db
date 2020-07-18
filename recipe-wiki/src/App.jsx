import React from "react";
import Main from "./Main";
import { CookiesProvider } from "react-cookie";

const App = () => {
  return (
    <CookiesProvider>
      <Main className="container min-h-screen" />
    </CookiesProvider>
  );
};

export default App;
