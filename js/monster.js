//Js code for monster page
import { fetchFromApi } from "./common/endpoints.js";
import { useClickEvent } from "./common/useEvent.js";
import { renderDataAsUl, renderError, renderSpinner } from "./common/render.js";

const fetchBtn = document.getElementById("fetchMonsters");
const monsterContainer = document.getElementById("monsterContainer");

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  useClickEvent(fetchBtn, fetchMonsters);
}

async function fetchMonsters() {
  console.log("Loading...");
  renderSpinner(monsterContainer);
  const response = await fetchFromApi("monsters", "&num=10");
  setTimeout(() => {
    if (!response.hasError) {
      const monsters = response.data.monsters.map((res) => res.name);
      renderDataAsUl(monsterContainer, "monsterContainer", monsters);
    } else {
      const errorMessage = response.message;
      renderError(monsterContainer, errorMessage);
    }
  }, 1000);
}
