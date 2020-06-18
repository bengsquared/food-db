import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./apimethods";
import $ from "jquery";

class chef {
  constructor(id, username, name, bio, image) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.bio = bio;
    this.image = image;
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      error: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  login(username, e) {
    userLogin(username, this.props.onLogin);
    e.preventDefault();
  }

  handleChange(e) {
    this.setState({ username: e.target.value });
    e.preventDefault();
  }

  render() {
    let result = (
      <div id="login">
        <div id="loginerror" style={{ backgroundColor: "red" }}>
          {this.state.error}
        </div>
        <label>username:</label>
        <input
          id="username"
          name="username"
          required
          size="10"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <br />
        <button
          name="login"
          onClick={this.login.bind(this, this.state.username)}
        >
          log in
        </button>
      </div>
    );

    return result;
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chef: null };
    this.set_user = this.set_user.bind(this);
  }

  set_user(user) {
    if (user instanceof chef) {
      this.setState({ chef: user });
    }
  }

  render() {
    let result = <div>hii</div>;
    if (this.state.chef == null) {
      result = <Login onLogin={this.set_user} />;
    }

    if (this.state.chef instanceof chef) {
      result = <Profile onSave={this.set_user} chef={this.state.chef} />;
    }

    return result;
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Main />
      </div>
    );
  }
}

// function App() {
//   return ( <div className="App">
//             <Main />
//          </div> );
// }

export default App;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      chef: this.props.chef,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  edit_profile() {
    this.setState({ editing: true });
  }

  handleChange(e) {
    if (e.target.name == "name") {
      let newchef = this.state.chef;
      newchef.name = e.target.value;
      this.setState({ chef: newchef });
    }
    if (e.target.name == "bio") {
      let newchef = this.state.chef;
      newchef.bio = e.target.value;
      this.setState({ chef: newchef });
    }
    e.preventDefault();
  }

  save_profile() {
    userUpdate(this.state.chef, this.props.onSave);
  }

  render() {
    let result = <div>hii</div>;
    if (this.state.editing) {
      result = (
        <div id="profile" class="editing">
          <ul>
            <li>username:{this.state.chef.username}</li>
            <li>
              <label>name:</label>
              <input
                id="name"
                name="name"
                value={this.state.chef.name}
                onChange={this.handleChange}
              />
            </li>

            <li>
              <label>bio:</label>
              <input
                id="bio"
                name="bio"
                required
                size="10"
                value={this.state.chef.bio}
                onChange={this.handleChange}
              />
            </li>
          </ul>
          <button
            name="save"
            onClick={this.save_profile.bind(this, this.props.onSave)}
          >
            {" "}
            edit{" "}
          </button>
        </div>
      );
    } else {
      result = (
        <div id="profile">
          <ul>
            <li>username:{this.state.chef.username}</li>
            <li>name:{this.state.chef.name}</li>
            <li>bio:{this.state.chef.bio}</li>
          </ul>
          <button name="edit" onClick={this.edit_profile.bind(this)}>
            {" "}
            edit{" "}
          </button>
        </div>
      );
    }
    return result;
  }
}

function get_chef(id, callback) {
  const url = `http://127.0.0.1:5000/chef/${id}`;
  console.log(url);
  let settings = {
    async: true,
    type: "GET",
    url: url,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done((res) => {
    let user = new chef(res.id, res.username, res.name, res.bio, res.image);
    callback(user);
  });
}

function userLogin(un, success) {
  let data = {
    username: un,
  };
  let settings = {
    async: true,
    type: "POST",
    url: "http://127.0.0.1:5000/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  };
  $.ajax(settings).then((response) => {
    let id = response;
    console.log(id);
    get_chef(id, success);
  });
}

function userUpdate(userprofile, success) {
  let data = userprofile;
  let endpoint = `http://127.0.0.1:5000/chef/${userprofile.id}`;
  let settings = {
    async: true,
    type: "POST",
    url: endpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  };
  $.ajax(settings).then((response) => {
    let id = userprofile.id;
    get_chef(id, success);
  });
}
