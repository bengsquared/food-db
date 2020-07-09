import React, { useState } from "react";
import { userLogin } from "./user";

// export default class Login extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       username: "",
//       error: null,
//     };
//     this.handleChange = this.handleChange.bind(this);
//   }

//   login(username, e) {
//     userLogin(username, this.props.onLogin);
//     e.preventDefault();
//   }

//   handleChange(e) {
//     this.setState({ username: e.target.value });
//     e.preventDefault();
//   }

//   render() {
//     return (
//       <div id="login">
//         <div id="loginerror" style={{ backgroundColor: "red" }}>
//           {this.state.error}
//         </div>
//         <label>username:</label>
//         <input
//           id="username"
//           name="username"
//           required
//           size="10"
//           value={this.state.username}
//           onChange={this.handleChange}
//         />
//         <br />
//         <button
//           name="login"
//           onClick={this.login.bind(this, this.state.username)}
//         >
//           log in
//         </button>
//       </div>
//     );
//   }
// }

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUsername(e.target.value);
    e.preventDefault();
  };

  const login = (e) => {
    userLogin(username, onLogin).catch(e => {
      setError(e.responseText);
    });
    e.preventDefault();
  }

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
