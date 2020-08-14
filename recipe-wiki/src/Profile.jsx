import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Router, navigate } from "@reach/router";
import {
  useCurrentToken,
  useCurrentChefId,
  GET_CHEF_PROFILE,
  UPDATE_CHEF,
} from "./serverfunctions";

const Profile = ({ onSave }) => {
  const token = useCurrentToken();
  const chefid = useCurrentChefId();
  const [editing, setEditing] = useState(false);
  console.log(chefid);
  const { loading, error, data } = useQuery(GET_CHEF_PROFILE, {
    context: {
      headers: {
        authorization: "Bearer " + token.token,
      },
    },
    variables: {
      id: chefid.currentUserID,
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    console.log("loading");
    return <LoadingProfile />;
  } else if (!!error) {
    return <div>{error.message}</div>;
  }

  const toggleEdit = (edit) => {
    console.log(edit);
    console.log(editing);
    if (edit) {
      navigate("/profile/me/edit");
      console.log("/profile/me/edit");
    } else {
      navigate("/profile/me");
      console.log("/profile/me");
    }
    setEditing(edit);
  };
  return (
    <Router>
      <EditProfile
        path="/edit"
        chef={data.findChefByID}
        setEditing={toggleEdit}
        token={token}
      />
      <ViewProfile
        path="/"
        setEditing={toggleEdit}
        chef={data.findChefByID}
        default
      />
    </Router>
  );
};

const EditProfile = ({ chef, setEditing }) => {
  const [newChef, setNewChef] = useState(chef);
  const token = useCurrentToken();
  const [updateChef, { updatedChef }] = useMutation(UPDATE_CHEF, {
    onCompleted(res) {
      setEditing(false);
    },
  });

  const handleChange = (e) => {
    if (e.target.getAttribute("name") === "name") {
      setNewChef({ ...newChef, name: e.target.value });
    } else if (e.target.getAttribute("name") === "bio") {
      setNewChef({ ...newChef, bio: e.target.value });
    } else if (e.target.getAttribute("name") === "image") {
      setNewChef({ ...newChef, image: e.target.value });
    }
    e.preventDefault();
  };

  return (
    <div className="pb-10">
      <img
        className="mx-auto block border rounded h-64 w-64 object-contain mt-4"
        src={
          (newChef.image || "") !== ""
            ? newChef.image
            : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/shallow-pan-of-food_1f958.png"
        }
        alt="profile avatar"
      ></img>
      <div className="w-2/3 mx-auto mb-8 text-xs ">
        {"paste a link to change your picture: "}
        <div className="funderline inline-block">
          <input
            name="image"
            className="w-full"
            value={!!newChef.image ? newChef.image : ""}
            onChange={handleChange}
          ></input>
        </div>
      </div>

      <div className="mx-auto content-left flex-grow w-2/3 text-gray-600">
        <pre className="inline">
          your chef name is{" "}
          <span className="text-green-700">{newChef.username}</span>, but what
          should we call you?
        </pre>
        <div className="text-blue-700 flex sm:w-1/2 mt-2 mb-4">
          {">"}
          <div className="funderline ml-2 w-auto flex-grow">
            <input
              name="name"
              className="w-full"
              value={!!newChef.name ? newChef.name : ""}
              onChange={handleChange}
            ></input>
          </div>
        </div>

        <pre>
          ok,{" "}
          <span className="text-blue-700">
            {!!newChef.name ? newChef.name : ""}
          </span>
          , what do you have to say for yourself?
        </pre>
        <textarea
          name="bio"
          className="w-full p-3 h-56 text-black max-w-full mt-4 appearance-none"
          placeholder="I only bake vegan chocolate croissants. always have, always will. It all began in the summer of '69..."
          value={!!newChef.bio ? newChef.bio : ""}
          onChange={handleChange}
        ></textarea>
        <pre>
          <button
            name="edit"
            className="inline funderline p-2"
            onClick={() => {
              if (newChef === chef) {
                setEditing(false);
              } else {
                updateChef({
                  context: {
                    headers: {
                      authorization: "Bearer " + token.token,
                    },
                  },
                  variables: {
                    id: newChef._id,
                    data: {
                      name: newChef.name,
                      username: newChef.username,
                      bio: newChef.bio,
                      image: newChef.image,
                    },
                  },
                });
              }
            }}
          >
            [save]
          </button>
          {" or "}
          <button
            name="edit"
            className="inline funderline p-2"
            onClick={() => {
              console.log("hit Cancel");
              setEditing(false);
            }}
          >
            [cancel]
          </button>
        </pre>
      </div>
    </div>
  );
};

const ViewProfile = ({ setEditing, chef }) => {
  return (
    <div className="pb-10">
      <img
        className="mx-auto block rounded h-64 w-64 my-8 object-contain "
        src={
          chef.image === ""
            ? "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/shallow-pan-of-food_1f958.png"
            : chef.image
        }
        alt="profile avatar"
      ></img>
      <div className="mx-auto flex-grow w-2/3 text-gray-600">
        <pre className="max-w-full ">
          {"This is "}
          <span className="text-blue-700">{chef.name}</span>
          {", otherwise known as Chef "}
          <span className="text-green-700">{chef.username}</span>
          {".\n"}
          <span className="text-gray-700">{chef.bio}</span>
        </pre>
        <button
          name="edit"
          className="inline funderline p-2"
          onClick={() => {
            setEditing(true);
          }}
        >
          [edit]
        </button>
      </div>
    </div>
  );
};

const LoadingProfile = () => {
  return (
    <div className="pb-10">
      <div className="mx-auto block rounded h-64 w-64 my-8 linear-wipe"></div>
      <div className="mx-auto flex-grow w-2/3 ">
        <pre className="max-w-full linear-wipe ">{"\n"}</pre>
        <pre className="max-w-full mt-1linear-wipe ">{"\n \n \n \n"}</pre>
      </div>
    </div>
  );
};

export default Profile;
