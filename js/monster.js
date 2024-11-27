//Js code for monster page
import { fetchFromApi } from "./common/endpoints.js";
import { useClickEvent } from "./common/useEvent.js";
import { renderDataAsUl } from "./common/render.js";

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
  const response = await fetchFromApi("monsters", "&num=10");
  if (!response.hasError) {
    const monsters = response.data.monsters.map((res) => res.name);
    renderDataAsUl(monsterContainer, "monsterContainer", monsters);
  } else {
  }
  console.log("Response: ", response);
}
