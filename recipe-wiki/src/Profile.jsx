import React, { useState } from "react";
import { userUpdate } from "./user";

// export default class Profile extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       editing: false,
//       chef: this.props.chef,
//     };
//     this.handleChange = this.handleChange.bind(this);
//   }

//   edit_profile() {
//     this.setState({ editing: true });
//   }

//   handleChange(e) {
//     if (e.target.name == "name") {
//       let newchef = this.state.chef;
//       newchef.name = e.target.value;
//       this.setState({ chef: newchef });
//     }
//     if (e.target.name == "bio") {
//       let newchef = this.state.chef;
//       newchef.bio = e.target.value;
//       this.setState({ chef: newchef });
//     }
//     e.preventDefault();
//   }

//   save_profile() {
//     userUpdate(this.state.chef, this.props.onSave);
//   }

//   render() {
//     let result = <div>hii</div>;
//     if (this.state.editing) {
//       result = (
//         <div id="profile" class="editing">
//           <ul>
//             <li>username:{this.state.chef.username}</li>
//             <li>
//               <label>name:</label>
//               <input
//                 id="name"
//                 name="name"
//                 value={this.state.chef.name}
//                 onChange={this.handleChange}
//               />
//             </li>

//             <li>
//               <label>bio:</label>
//               <input
//                 id="bio"
//                 name="bio"
//                 required
//                 size="10"
//                 value={this.state.chef.bio}
//                 onChange={this.handleChange}
//               />
//             </li>
//           </ul>
//           <button
//             name="save"
//             onClick={this.save_profile.bind(this, this.props.onSave)}
//           >
//             {" "}
//             edit{" "}
//           </button>
//         </div>
//       );
//     } else {
//       result = (
//         <div id="profile">
//           <ul>
//             <li>username:{this.state.chef.username}</li>
//             <li>name:{this.state.chef.name}</li>
//             <li>bio:{this.state.chef.bio}</li>
//           </ul>
//           <button name="edit" onClick={this.edit_profile.bind(this)}>
//             {" "}
//             edit{" "}
//           </button>
//         </div>
//       );
//     }
//     return result;
//   }
// }

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
