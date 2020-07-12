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
    }
    e.preventDefault();
  };

  const saveProfile = () => {
    userUpdate(chef, onSave);
    setEditing(false);
  };

  return editing ? (
    <div id="profile" className="editing">
      <ul>
        <li>username: {user.username}</li>
        <li>
          <label>name: </label>
          <input
            id="name"
            name="name"
            value={chef.name}
            onChange={handleChange}
          />
        </li>

        <li>
          <label>bio: </label>
          <input
            id="bio"
            name="bio"
            required
            size="10"
            value={chef.bio}
            onChange={handleChange}
          />
        </li>
      </ul>
      <button name="save" onClick={saveProfile}>
        save
      </button>
    </div>
  ) : (
    <div id="profile">
      <ul>
        <li>username: {user.username}</li>
        <li>name: {chef.name}</li>
        <li>bio: {chef.bio}</li>
      </ul>
      <button name="edit" onClick={editProfile}>
        edit
      </button>
    </div>
  );
};

export default Profile;
