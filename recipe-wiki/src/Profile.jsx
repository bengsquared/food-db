import React, { useState } from "react";
import { userUpdate } from "./user";

const Profile = ({ onSave, user }) => {
  const [editing, setEditing] = useState(false);
  const [chef, setChef] = useState(user);

  const editProfile = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    if (e.target.getAttribute("name") === "name") {
      setChef({ ...chef, name: e.target.value });
    } else if (e.target.getAttribute("name") === "bio") {
      setChef({ ...chef, bio: e.target.value });
    } else if (e.target.getAttribute("name") === "image") {
      setChef({ ...chef, image: e.target.value });
    }
    e.preventDefault();
  };

  const saveProfile = () => {
    userUpdate(chef, onSave);
    setEditing(false);
  };

  return editing ? (
    <div className="pb-10">
      <img
        className="mx-auto block border rounded h-64 w-64 object-contain mt-4 "
        src={chef.image}
        alt="profile picture"
      ></img>
      <div className="w-2/3 mx-auto mb-8 text-xs ">
        {"paste a link to change your picture: "}
        <div className="funderline inline-block">
          <input
            name="image"
            className="w-full"
            value={chef.image}
            onChange={handleChange}
          ></input>
        </div>
      </div>

      <div className="mx-auto content-left flex-grow w-2/3 text-gray-600">
        <pre className="inline">
          your chef name is{" "}
          <span className="text-green-700">{user.username}</span>, but what
          should we call you?
        </pre>
        <div className="text-blue-700 flex sm:w-1/2 mt-2 mb-4">
          {">"}
          <div className="funderline ml-2 w-auto flex-grow">
            <input
              name="name"
              className="w-full"
              value={chef.name}
              onChange={handleChange}
            ></input>
          </div>
        </div>

        <pre>
          ok, <span className="text-blue-700">{chef.name}</span>, what do you
          have to say for yourself?
        </pre>
        <textarea
          name="bio"
          className="w-full h-56 text-black max-w-full mt-4 appearance-none"
          placeholder="I only bake vegan chocolate croissants. always have, always will. It all began in the summer of '69..."
          value={chef.bio}
          onChange={handleChange}
          contentEditable
        ></textarea>
        <pre>
          <button
            name="edit"
            className="inline funderline p-2"
            onClick={saveProfile}
          >
            [save]
          </button>
          {" or "}
          <button
            name="edit"
            className="inline funderline p-2"
            onClick={saveProfile}
          >
            [cancel]
          </button>
        </pre>
      </div>
    </div>
  ) : (
    <div className="pb-10">
      <img
        className="mx-auto block rounded h-64 w-64 my-8 object-contain "
        src={user.image}
        alt="profile picture"
      ></img>
      <div className="mx-auto flex-grow w-2/3 text-gray-600">
        <pre className="max-w-full ">
          {"This is "}
          <span className="text-blue-700">{chef.name}</span>
          {", also known as "}
          <span className="text-green-700">{chef.username}</span>
          {".\n"}
          <span className="text-gray-700">{chef.bio}</span>
          <button
            name="edit"
            className="inline funderline p-2"
            onClick={editProfile}
          >
            [edit]
          </button>
        </pre>
      </div>
    </div>
  );
};

export default Profile;
