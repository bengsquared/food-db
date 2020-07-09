import Chef from "./Chef";
import { ajax } from "jquery";
import { apiUrl } from "./constants";

export const getChef = (id, callback) => {
  const url = `${apiUrl}/chef/${id}`;
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
  ajax(settings).done((res) => {
    let user = new Chef(res.id, res.username, res.name, res.bio, res.image);
    callback(user);
  });
};

export const userLogin = (un, success) => {
  let data = {
    username: un,
  };
  let settings = {
    async: true,
    type: "POST",
    url: `${apiUrl}/login`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  };
  return ajax(settings).then((response) => {
    let id = response;
    console.log(id);
    getChef(id, success);
  });
};

export const userUpdate = (userprofile, success) => {
  let data = userprofile;
  let endpoint = `${apiUrl}/chef/${userprofile.id}`;
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
  ajax(settings).then(() => {
    let id = userprofile.id;
    getChef(id, success);
  });
};