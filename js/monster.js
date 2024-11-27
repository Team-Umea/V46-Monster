//Js code for monster page
import { fetchFromApi } from "./common/endpoints.js";
import { useClickEvent } from "./common/useEvent.js";

const fetchBtn = document.getElementById("fetchMonsters");

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  useClickEvent(fetchBtn, fetchMonsters);
}

async function fetchMonsters() {
  console.log("Loading...");
  const response = await fetchFromApi("monsters", "&num=10");
  console.log("Response: ", response);
}
