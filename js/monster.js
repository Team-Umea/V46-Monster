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
  const response = await fetchFromApi("monsters", "&num=10", monsterContainer);
  if (response.ok) {
    const monsters = response.data.monsters.map((res) => res.name);
    renderDataAsUl(monsterContainer, "monsterContainer", monsters);
  }

  //simulate request timeout
  // setTimeout(() => {
  //   if (response.ok) {
  //     const monsters = response.data.monsters.map((res) => res.name);
  //     renderDataAsUl(monsterContainer, "monsterContainer", monsters);
  //   }
  // }, 10000);

  //simulate loading
  // setTimeout(() => {
  //   if (response.ok) {
  //     const monsters = response.data.monsters.map((res) => res.name);
  //     renderDataAsUl(monsterContainer, "monsterContainer", monsters);
  //   }
  // }, 1000);
}
