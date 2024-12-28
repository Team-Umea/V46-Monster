//Js code for element page
import { serveData } from "./common/fetch.js";
import { useClickEvent } from "./common/useEvent.js";
import { imgAsBtn, renderIconWithNumber } from "./common/render.js";
import { ELEMENTS_LSK } from "./common/localStorageKeys.js";
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

    const elementStatsEl = document.createElement("div");
    const ratingEl = renderIconWithNumber(element.rating, "../../res/icons/trophy.svg", `${element.name} has an rating of ${element.rating}`);
    const priceEl = renderIconWithNumber(element.price, "../../res/icons/diamond.svg", `${element.name} costs ${element.price} credits`);

    const bannerEl = document.createElement("div");
    const elementIconEl = document.createElement("img");
    const elementNameEl = document.createElement("h2");
    const buyElementBtn = imgAsBtn("cart", `Buy ${element.name} for ${element.price} credits`);

    const abilityEl = document.createElement("div");
    const strongHeaderEl = document.createElement("p");
    const weakHeaderEl = document.createElement("p");
    const strongListEl = document.createElement("ul");
    const weakListEl = document.createElement("ul");

    elementEl.setAttribute("class", "element");
    elementStatsEl.setAttribute("class", "elementStats");
    ratingEl.classList.add("elementStat");
    priceEl.classList.add("elementStat");
    bannerEl.setAttribute("class", "banner");
    elementIconEl.setAttribute("class", "icon");
    elementNameEl.setAttribute("class", "name");
    buyElementBtn.classList.add("buyElementBtn", "primary-btn");
    abilityEl.setAttribute("class", "abilityContainer");
    strongHeaderEl.setAttribute("class", "abilityHeader");
    weakHeaderEl.setAttribute("class", "abilityHeader");
    strongListEl.setAttribute("class", "abilities");
    weakListEl.setAttribute("class", "abilities");

    elementIconEl.setAttribute("src", "../../res/img/elementPlaceholder.png");
    elementIconEl.setAttribute("alt", `${element.name}`);

    elementNameEl.innerText = element.name;
    strongHeaderEl.innerText = "Strong against";
    weakHeaderEl.innerText = "Weak against";

    element.strongAgainst.forEach((aby) => {
      const abyEl = document.createElement("li");
      abyEl.setAttribute("class", "ability");
      abyEl.innerText = aby;
      strongListEl.appendChild(abyEl);
    });

    element.weakAgainst.forEach((aby) => {
      const abyEl = document.createElement("li");
      abyEl.setAttribute("class", "ability");
      abyEl.innerText = aby;
      weakListEl.appendChild(abyEl);
    });

    useClickEvent(buyElementBtn, () => {
      console.log("Bought ", element.name);
    });

    elementStatsEl.append(ratingEl, priceEl);
    bannerEl.append(elementIconEl, elementNameEl, buyElementBtn);
    abilityEl.append(strongHeaderEl, weakHeaderEl, strongListEl, weakListEl);

    elementEl.append(elementStatsEl, bannerEl, abilityEl);

    elementList.appendChild(elementEl);
  });
}
