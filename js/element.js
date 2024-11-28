//Js code for element page
import { serveData } from "./common/fetch.js";
import { useClickEvent } from "./common/useEvent.js";
import { renderDataAsUl } from "./common/render.js";
import { ELEMENTS_LSK, ABILITIES_LSK } from "./common/localStorageKeys.js";
import { capitalize } from "./common/utilities.js";

const elementsContainer = document.getElementById("elementsContainer");
const abilitiesContainer = document.getElementById("abilitiesContainer");
const fetchElementsBtn = document.getElementById("fetchElements");
const fetchAbilitiesBtn = document.getElementById("fetchAbilities");

//time in seconds for how long the data will be cached for before it will refetch
//this way we can limit the number of calls to the api for data that don't need
//constent updates
const ttl = 300; //5 min

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  useClickEvent(fetchElementsBtn, fetchElements);
  useClickEvent(fetchAbilitiesBtn, fetchAbilities);
}

async function fetchElements() {
  const response = await serveData("elements", undefined, elementsContainer, ELEMENTS_LSK, ttl);
  const elements = response.map((res) => res.name);
  renderDataAsUl(elementsContainer, "elementsContainer", elements);
}

async function fetchAbilities() {
  const response = await serveData("abilities", undefined, abilitiesContainer, ABILITIES_LSK, ttl);
  const abilities = response;
  const capatilizedAbilities = abilities.map((ability) => capitalize(ability));
  renderDataAsUl(abilitiesContainer, "elementsContainer", capatilizedAbilities);
}
