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
  renderSpinner(elementsContainer);
  const response = await fetchFromApi("elements");
  setTimeout(() => {
    if (!response.hasError) {
      const elements = response.data.elements.map((res) => res.name);
      renderDataAsUl(elementsContainer, "elementsContainer", elements);
    } else {
      const errorMessage = response.message;
      renderError(elementsContainer, errorMessage);
    }
  }, 1000);
}

async function fetchAbilities() {
  renderSpinner(abilitiesContainer);
  const response = await fetchFromApi("abilities");
  setTimeout(() => {
    if (!response.hasError) {
      const abilities = response.data.abilities;
      renderDataAsUl(abilitiesContainer, "abilitiesContainer", abilities);
    } else {
      const errorMessage = response.message;
      renderError(abilitiesContainer, errorMessage);
    }
  }, 1000);
}
