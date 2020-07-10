import React, { useState } from "react";
import Chef from "./Chef";
import Login from "./Login";
import Profile from "./Profile";
import Recipes from "./Recipes";
import Header from "./Header";

import { useCookies } from "react-cookie";

// export default class Main extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { chef: null };
//     this.set_user = this.set_user.bind(this);
//   }

//   set_user(user) {
//     if (user instanceof Chef) {
//       this.setState({ chef: user });
//     }
//   }

//   render() {
//     let result = <div>hii</div>;
//     if (this.state.chef == null) {
//       result = <Login onLogin={this.set_user} />;
//     }

//     if (this.state.chef instanceof Chef) {
//       result = <Profile onSave={this.set_user} chef={this.state.chef} />;
//     }

//     return result;
//   }
// }

const Main = () => {
  const [cookies, setCookie] = useCookies(["chef"]);
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
      <div>
        <Header setNav={setPage} />
        <div>{content}</div>
      </div>
    );
  } else {
    result = <Login onLogin={setUser} />;
  }

  return result;
};

export default Main;
