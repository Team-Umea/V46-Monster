//Js code for monster page
import { fetchFromApi } from "./common/endpoints.js";
import { loadEndpoints } from "./common/utilities.js";

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  initFetchBtn();
}

function initFetchBtn() {
  const btn = document.getElementById("fetchMonsters");

  btn.addEventListener("click", () => {
    fetchMonsters();
  });
}

async function fetchMonsters() {
  const response = await fetchFromApi("monsters", "&num=10");
  console.log("Response: ", response);
}
