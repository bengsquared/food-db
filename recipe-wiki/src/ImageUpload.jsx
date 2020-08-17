import React, { useState } from "react";

const ImageUpload = ({ setImageUrl, url }) => {
  const [uploading, setUploading] = useState(false);
  const [method, setMethod] = useState(null);
  const upload = (e) => {
    const file = e.target.files[0];
    e.preventDefault();
    setUploading(true);
    let form = new FormData();
    let myHeaders = new Headers();

    form.append("image", file);
    form.append("album", "7OaZWHiL3vCHYbC");

    myHeaders.append(
      "Authorization",
      "Client-ID 7fb60a3f487db0c"
      //+ process.env.REACT_APP_IMGUR_CLIENT_ID
    );

    fetch("https://api.imgur.com/3/image", {
      method: "POST",
      body: form,
      //mode: "no-cors",
      headers: myHeaders,
    })
      .then((response) => (response ? response.json() : { success: false }))
      .then((r) => {
        if (r.success) {
          setImageUrl(r.data.link);
        }
        setUploading(false);
        setMethod(null);
      });
  };

  let options = (
    <div className="p-1 text-xs">
      <button
        className="font-bold funderline"
        onClick={() => {
          setMethod("url");
        }}
      >
        paste a URL
      </button>
      {" or "}
      <button
        className="font-bold funderline"
        onClick={() => {
          setMethod("upload");
        }}
      >
        upload a picture
      </button>
    </div>
  );
  if (method === "upload") {
    options = (
      <div className="p-1 text-xs flex">
        <div className="flex-grow">
          upload an image (via imgur)
          <input
            type="file"
            className="p-1"
            accept="image/*"
            capture="environment"
            onChange={upload}
          />
        </div>
        <button onClick={() => setMethod(null)}>
          <span role="img" aria-label="close">
            ✖️
          </span>
        </button>
      </div>
    );
  } else if (method === "url") {
    options = (
      <div className="flex text-xs w-full">
        <div className="flex flex-grow">
          <label className="flex-none w-auto">{"image url: "}</label>
          <div className="flex-grow funderline">
            <input
              name="image"
              className="w-full"
              placeholder="www.cdn.com/my-image"
              value={url || ""}
              onChange={(e) => {
                setImageUrl(e.target.value);
              }}
              onBlur={() => setMethod(null)}
            ></input>
          </div>
        </div>

        <button className="p-1 flex-none" onClick={() => setMethod(null)}>
          <span role="img" aria-label="close">
            ✖️
          </span>
        </button>
      </div>
    );
  }

  return uploading ? <div>{"uploading"}</div> : options;
};

export default ImageUpload;
