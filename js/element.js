//Js code for element page
import { fetchFromApi } from "./common/endpoints.js";
import { useClickEvent } from "./common/useEvent.js";
import { renderDataAsUl, renderError, renderSpinner } from "./common/render.js";

const elementsContainer = document.getElementById("elementsContainer");
const abilitiesContainer = document.getElementById("abilitiesContainer");
const fetchElementsBtn = document.getElementById("fetchElements");
const fetchAbilitiesBtn = document.getElementById("fetchAbilities");

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  useClickEvent(fetchElementsBtn, fetchElements);
  useClickEvent(fetchAbilitiesBtn, fetchAbilities);
}

async function fetchElements() {
  const response = await fetchFromApi("elements", undefined, elementsContainer);
  if (response.ok) {
    const elements = response.data.elements.map((res) => res.name);
    renderDataAsUl(elementsContainer, "elementsContainer", elements);
  }
}

async function fetchAbilities() {
  const response = await fetchFromApi("abilities", undefined, abilitiesContainer);
  if (response.ok) {
    const abilities = response.data.abilities;
    renderDataAsUl(abilitiesContainer, "elementsContainer", abilities);
  }
}
