import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Router } from "@reach/router";
import { useLoginStatus, useCurrentToken } from "./serverfunctions";
import background from "./assets/loginBackground.svg";

const LOGIN_USER = gql`
  mutation Login($input: LoginChefInput!) {
    loginChef(input: $input)
  }
`;

const SIGNUP_USER = gql`
  mutation CreateChef($input: CreateChefInput!) {
    createChef(input: $input) {
      _id
    }
  }
`;

const Login = ({ onLogin, navigate }) => {
  const loggedin = useLoginStatus();
  if ((loggedin || { isLoggedIn: false }).isLoggedIn) {
    navigate("/");
  }
  return (
    <div
      className="min-h-screen w-full items-center bg-cover flex justify-center bg-local"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Router className="w-full min-h-screen flex justify-center">
        <LoginScreen path="/" onLogin={onLogin} />
        <SignUpScreen path="/signup" onLogin={onLogin} />
      </Router>
    </div>
  );
};

const LoginScreen = ({ onLogin, navigate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const token = useCurrentToken();
  const [errorMessage, setErrorMessage] = useState("");
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted(res) {
      onLogin(res.loginChef, false);
    },
    onError(err) {
      if (
        String(err).includes(
          "instance was not found or provided password was inc"
        )
      ) {
        setErrorMessage("incorrect username or password");
      }
    },
  });

  const handleChange = (e) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
    e.preventDefault();
  };

  const enter = (e) => {
    if (e.key === "Enter") {
      login({
        variables: {
          input: {
            username: username,
            password: password,
          },
        },
        context: {
          headers: {
            authorization: "Bearer " + token.token,
          },
        },
      });
    }
  };

  return (
    <div
      id="login"
      className="w-full self-center  sm:h-auto sm:w-auto sm:max-w-md sm:mt-20 md:mt-24 lg:mt-40 p-12 flex flex-col sm:self-start bg-white overflow-hidden items-center shadow-lg"
    >
      <div className="m-1 text-3xl text-center p-1">recipebox</div>
      <div
        id="loginerror"
        className={
          (error ? "text-red-700" : "") +
          " text-center text-sm px-2 w-64 h-12 block"
        }
      >
        {errorMessage}
      </div>
      <form className="w-full">
        <div className="block funderline">
          <input
            id="username"
            name="username"
            className="w-full"
            size="10"
            placeholder="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div className="block funderline pt-5">
          <input
            id="password"
            name="password"
            size="10"
            className="w-full"
            type="password"
            placeholder="password"
            value={password}
            onChange={handleChange}
            onKeyDown={enter}
          />
        </div>
      </form>

      <button
        name="login"
        className="self-center funderline py-1 px-2 mt-10 bg-green-200 border rounded"
        onClick={() => {
          login({
            variables: {
              input: {
                username: username,
                password: password,
              },
            },
            context: {
              headers: {
                authorization: "Bearer " + token.token,
              },
            },
          });
        }}
      >
        log in
      </button>
      <button
        className="m-3 mt-5"
        name="new user"
        onClick={() => {
          navigate("signup");
        }}
      >
        sign up!
      </button>
    </div>
  );
};

const SignUpScreen = ({ onLogin, navigate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const token = useCurrentToken();
  const [errorMessage, setErrorMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState("secret passphrase:");
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted(res) {
      onLogin(res.loginChef, true);
    },
  });
  const [createChef, { loading2, error2 }] = useMutation(SIGNUP_USER, {
    onCompleted({ createChef }) {
      login({
        variables: {
          input: {
            username: username,
            password: password,
          },
        },
        context: {
          headers: {
            authorization: "Bearer " + token.token,
          },
        },
      });
    },
    onError(err) {
      if (String(err).includes("Instance is not unique.")) {
        setErrorMessage(
          "oops, someone's already taken that... try a different Chef name"
        );
      }
    },
  });
  const pref = React.createRef();

  const handleChange = (e) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
    e.preventDefault();
  };

  const signupValidator = () => {
    const validator = /[^A-Za-z0-9_-]+/g;
    const unOK =
      40 > username.length &&
      username.length > 0 &&
      username.match(validator) === null;
    const passOK = password.length > 8;
    passOK
      ? setPasswordMessage("secret passphrase:")
      : setPasswordMessage("hey! a passphrase more than 8 char, please!");
    unOK
      ? setErrorMessage(null)
      : setErrorMessage(
          "your chef name may only have up to 40 numbers, letters, dashes (-) or underscores(_)"
        );
    if (unOK && passOK) {
      createChef({
        variables: {
          input: {
            username: username,
            password: password,
          },
        },
        context: {
          headers: {
            authorization: "Bearer " + token.token,
          },
        },
      });
    }
  };

  const enter = (e) => {
    if (e.key === "Enter") {
      signupValidator();
    }
  };

  return (
    <div className="w-full h-screen sm:h-auto sm:w-auto sm:max-w-md sm:-mt-48 p-12 flex flex-col self-center bg-white overflow-hidden items-center shadow-lg">
      <div className="m-1 text-3xl p-1">recipebox</div>
      <form>
        <p className={!!errorMessage ? "text-red-700" : ""}>
          {errorMessage ||
            "all right, let's get started! What's your unique Chef Name?"}
          <br />
        </p>
        <div className="block p-2 funderline">
          <input
            id="username"
            name="username"
            size="10"
            className="w-full"
            placeholder="username"
            value={username}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                pref.current.focus();
              }
            }}
          />
        </div>
        <p
          className={
            passwordMessage === "secret passphrase:" ? "" : "text-red-700"
          }
        >
          <br />
          {passwordMessage}
          <br />
          <span className="text-xs">(more than 8 characters, please!) </span>
          <br />
        </p>
        <div className="block p-2 funderline">
          <input
            id="cred"
            className="w-full"
            ref={pref}
            name="password"
            size="10"
            type="password"
            placeholder="password"
            value={password}
            onChange={handleChange}
            onKeyDown={enter}
          />
        </div>
      </form>
      <button
        name="submit"
        className="self-center funderline py-1 px-2 my-6 bg-green-200 border rounded"
        onClick={signupValidator}
      >
        sign up!
      </button>
      <p className="text-xs">
        {"if you realized you really do have a box already, you can "}
        <button
          name="back"
          className="inline funderline"
          onClick={() => {
            navigate("/login");
          }}
        >
          {"go back to login here"}
        </button>
      </p>
    </div>
  );
};

export default Login;
