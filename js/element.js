//Js code for element page
import { serveData } from "./common/fetch.js";
import { useClickEvent } from "./common/useEvent.js";
import { renderDataAsUl } from "./common/render.js";
import { ELEMENTS_LSK, ABILITIES_LSK } from "./common/localStorageKeys.js";
import { ELEMENTS_TTL } from "./common/ttl.js";
import { load, save, capitalize } from "./common/utilities.js";
import { renderCredits } from "./common/user.js";
import { USER_LSK } from "./common/localStorageKeys.js";

const elementContainer = document.getElementById("elementContainer");
const elementList = document.getElementById("elementList");

const userCredits = load(USER_LSK).credits;

let elements = [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  fetchElements();
  renderCredits(userCredits);
}

async function fetchElements() {
  elements = await serveData("elements", undefined, elementContainer, ELEMENTS_LSK, ELEMENTS_TTL);

  console.log("Elements: ", elements);

  renderElements();
}

function renderElements() {
  elementList.innerHTML = "";

  elements.forEach((element) => {
    const elementEl = document.createElement("li");

    elementEl.innerText = element.name;

    elementEl.setAttribute("class", "element");

    elementList.appendChild(elementEl);
  });
}
