import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { foodemoji, useCurrentChefId } from "./serverfunctions";

const RecipeViewer = ({ recipe, closeRecipe, setEditing }) => {
  const chef = useCurrentChefId();
  const [copied, setCopied] = useState(false);
  const [pdfHover, setPdfHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const ingredientsSorted = [...recipe.ingredients.data];
  ingredientsSorted.sort((a, b) => {
    return a.order - b.order;
  });
  const recipeRef = React.createRef();
  const imageRef = React.createRef();
  const fileTitle = recipe.title.replace(/(\/|\s|\.)/g, "_");
  let h =
    769 *
    ((window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight) /
      (window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth));

  const opt = {
    margin: 0.25,
    pagebreak: ["avoid-all"],
    filename: `${fileTitle}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      useCORS: true,
      allowTaint: true,
      scale: 4,
      windowWidth: 769,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: {
      format: "letter",
      orientation: "portrait",
    },
  };

  const worker = html2pdf().set(opt);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const edit = () => {
    setEditing(true);
  };

  const print = () => {
    worker.from(recipeRef.current).save();
  };

  const clickToCopy = (e) => {
    navigator.clipboard.writeText(
      `https://${window.location.host}/share/recipes/${recipe._id}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="grid grid-cols-12 gap-4 p-8 relative lg:w-2/3 mx-auto"
      ref={recipeRef}
    >
      <button
        className="absolute align-center px-4  sm:border sm:border-black h-10 top-0 right-0 m-6 sm:m-8 "
        onClick={closeRecipe}
        data-html2canvas-ignore
      >
        <svg
          className="inline stroke-current sm:hidden w-4 h-4 block"
          viewBox="0 0 50 50"
          strokeWidth="5"
          strokeLinecap="round"
        >
          <line x1="2" y1="2" x2="48" y2="48" stroke="black"></line>
          <line x1="2" y1="48" x2="48" y2="2" stroke="black"></line>
        </svg>
        <p className="hidden funderline sm:inline">close</p>
      </button>
      <div className="col-span-12 flex text-xl sm:justify-center sm:text-3xl mb-1">
        <div className="w-3/4 sm:w-2/3 sm:text-center ">{recipe.title}</div>
      </div>
      <div className="col-span-12 flex mb-6 sm:justify-center">
        <div className=" sm:w-2/3 sm:text-center text-sm">
          <p>
            {"a "}
            <span className="text-blue-700 font-bold">
              {!recipe.public ? "private" : "public"}
            </span>
            {" recipe by chef "}
            <span className="text-green-700 font-bold">
              {recipe.chef.username}
            </span>
          </p>
        </div>
      </div>

      {recipe.image === "" ? (
        ""
      ) : foodemoji.includes(recipe.image) ? (
        <div className="col-span-12 h-64 md:col-span-4 text-center">
          <span
            role="img"
            style={{ fontSize: "8rem", lineHeight: "normal" }}
            aria-label="food emoji"
            className="align-middle"
          >
            {recipe.image}
          </span>
        </div>
      ) : (
        <div className="col-span-12 h-64 flex md:col-span-4">
          <div className="h-full flex self-center">
            <img
              alt="finished dish"
              className="object-contain object-center"
              src={recipe.image}
            ></img>
          </div>
        </div>
      )}
      <div
        className={
          "flex flex-col col-span-12 p-4 border text-sm " +
          (recipe.image === "" ? "" : " md:col-span-8")
        }
      >
        <div className="flex text-xs" data-html2canvas-ignore>
          <span role="button" className="pr-3 funderline" onClick={print}>
            <span role="img" aria-label="download pdf">
              📄
            </span>
            {" download pdf"}
          </span>

          {recipe.public ? (
            copied ? (
              <span className="text-green-700 bold pl-3">
                <span role="img" aria-label="copy shareable link">
                  ✅
                </span>
                {" copied!"}
              </span>
            ) : (
              <span
                role="button"
                className="px-3 funderline"
                onClick={clickToCopy}
              >
                <span role="img" aria-label="link">
                  🔗
                </span>
                {" copy shareable link"}
              </span>
            )
          ) : (
            ""
          )}
        </div>
        <br />
        <p>
          <span role="img" aria-label="time">
            ⏱
          </span>
          {Math.floor(recipe.time / 60)}h:{recipe.time % 60}m{" "}
        </p>
        <br />
        <pre className="text-sm">{recipe.description}</pre>
      </div>
      <div className="col-span-12 border align-center p-4">
        <div className="mx-auto text-xl mb-4 w-2/3">Ingredients:</div>
        <pre className="mx-auto w-2/3 text-sm">
          {ingredientsSorted.map((i) => (
            <div key={i._id}>
              {"-> "}
              {i.amount} {i.name}
              {!!i.notes && i.notes !== "" && " - "}
              {i.notes}
            </div>
          ))}
        </pre>
      </div>
      <div className="col-span-12 align-center p-4">
        <div className="mx-auto text-xl mb-4 w-2/3 mb-8">Instructions:</div>
        <pre id="instructions" className="mx-auto w-2/3 text-sm">
          {recipe.instructions}
        </pre>
      </div>
      <div className="col-span-12 flex justify-center" data-html2canvas-ignore>
        {recipe.chef._id === (chef || { currentUserID: null }).currentUserID ? (
          <button
            className="border px-4 mx-4 border-black h-10 funderline"
            onClick={edit}
          >
            edit
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default RecipeViewer;
