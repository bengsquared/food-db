import React, { useState } from "react";
import Chef from "./Chef";
import Login from "./Login";
import Profile from "./Profile";

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
  const [chef, setChef] = useState(null);

  const setUser = (user) => {
    if (user instanceof Chef) {
      setChef(user);
    }
  };

  let result;
  if (chef instanceof Chef) {
    result = (<Profile onSave={setUser} user={chef} />);
  } else {
    result = (<Login onLogin={setUser} />);
  }

  return result;
};

export default Main;