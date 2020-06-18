'use strict';

class chef {
  constructor(id,username,name,bio,image) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.bio = bio;
    this.image = image;
  }
};

let CurrentUser = new chef(null,null,null,null,null);

export default function login(un,success){
    let data = {
        "username": un
    };
    var settings = {
      async: true,
      type: "POST",
      url: "http://127.0.0.1:5000/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      "data": JSON.stringify(data),
    }
    $.ajax(settings).then(function (response) {
            let id=response
            console.log(id)
            get_chef(id,success)
    });

}

function get_chef(id){
    const url = 'http://127.0.0.1:5000/chef/'+id;
    console.log(url);
    var settings = {
      async: true,
      type: "GET",
      url: url,
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
    $.ajax(settings).done((chef)=>{
        const profilebox = document.getElementById('profile');
        profilebox.style.display="block";
        const username = document.getElementById('untxt');
        const name = document.getElementById('ntxt');
        const bio = document.getElementById('btxt');
        const img = document.getElementById('propic');
        img.src=chef.image;
        username.textContent=chef.username;
        name.textContent=chef.name;
        bio.textContent=chef.bio;
    });
}
