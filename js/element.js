//Js code for element page
import { serveData } from "./common/fetch.js";
import { useChangeEvent, useClickEvent, useInputEvent } from "./common/useEvent.js";
import { imgAsBtn, populateSelect, renderIconWithNumber } from "./common/render.js";
import { ELEMENTS_LSK, TEAMS_LSK } from "./common/localStorageKeys.js";
import { ELEMENTS_TTL } from "./common/ttl.js";
import { load, save, capitalize } from "./common/utilities.js";
import { renderCredits } from "./common/user.js";
import { USER_LSK } from "./common/localStorageKeys.js";
import { user, updateUser } from "./common/user.js";

const searchElementsEl = document.getElementById("searchElements");
const sortElementsEl = document.getElementById("sortElements");
const selectTeamEl = document.getElementById("selectTeam");
const filterMessage = document.getElementById("filterMessage");

const elementContainer = document.getElementById("elementContainer");
const elementList = document.getElementById("elementList");

const teams = load(TEAMS_LSK) || [];
const userCredits = load(USER_LSK).credits;

let elements = [];
let selectedTeam;
let sortOrder = 0;
let filterMessageTimeout;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getElements();
  render();
  selectTeam();
  setSortOrder();
  useInputEvent(searchElementsEl, searchElements);
  useChangeEvent(sortElementsEl, setSortOrder);
}

async function getElements() {
  elements = await serveData("elements", undefined, elementContainer, ELEMENTS_LSK, ELEMENTS_TTL);
  renderElements();
}

function render() {
  renderCredits(userCredits);
  populateSelect(sortElementsEl, ["A - Z", "Z - A", "Low - High Price", "High - Low Price", "Low - High Rating", "High - Low Rating"]);
  populateSelect(selectTeamEl, ["Select team", ...teams.map((team) => team.name)]);
}

function selectTeam() {
  useChangeEvent(selectTeamEl, () => {
    if (selectTeamEl.value !== 0) {
      selectedTeam = teams[selectTeamEl.value - 1].name;
      setFilterMessage("", "");

      const optionPlaceHolder = selectTeamEl.children[0];

      if (optionPlaceHolder && optionPlaceHolder.innerText === "Select team") {
        optionPlaceHolder.remove();
      }
    }
  });
}

function searchElements() {
  const searchQuery = searchElementsEl.value.trim().toLowerCase();

  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();

    elements = [...elements].sort((a, b) => {
      const aValue = a.name.toLowerCase();
      const bValue = b.name.toLowerCase();

      const aIncludesQuery = aValue.includes(lowerCaseQuery);
      const bIncludesQuery = bValue.includes(lowerCaseQuery);

      if (aIncludesQuery && !bIncludesQuery) return -1;
      if (!aIncludesQuery && bIncludesQuery) return 1;

      return sortBy(a, b);
    });
  }

  console.log(elements);

  renderElements();
}

function setSortOrder() {
  sortOrder = Number(sortElementsEl.value);
  sortElements();
  searchElements();
}

function sortElements() {
  elements = [...elements].sort((a, b) => sortBy(a, b));
}

function sortBy(a, b) {
  switch (sortOrder) {
    case 0:
      return a.name.localeCompare(b.name);
    case 1:
      return b.name.localeCompare(a.name);
    case 2:
      return a.price - b.price;
    case 3:
      return b.price - a.price;
    case 4:
      return a.rating - b.rating;
    case 5:
      return b.rating - a.rating;
    default:
      break;
  }
}

function setFilterMessage(className, message) {
  filterMessage.setAttribute("class", `filterMessage ${className}`);
  filterMessage.innerText = message;

  if (message !== "") {
    if (filterMessageTimeout) {
      clearTimeout(filterMessageTimeout);
    }

    filterMessageTimeout = setTimeout(() => {
      filterMessage.innerText = "";
      filterMessage.setAttribute("class", "filterMessage");
    }, 3000);
  }
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
      abyEl.innerText = capitalize(aby);
      strongListEl.appendChild(abyEl);
    });

    element.weakAgainst.forEach((aby) => {
      const abyEl = document.createElement("li");
      abyEl.setAttribute("class", "ability");
      abyEl.innerText = capitalize(aby);
      weakListEl.appendChild(abyEl);
    });

    useClickEvent(buyElementBtn, () => {
      if (selectTeamEl.children.length > 0 && selectTeamEl.firstElementChild.innerText != "Select team") {
        const currentCredits = user.credits;
        const newCredits = currentCredits - element.price;

        teams.forEach((t) => {
          if (t.name === selectedTeam) {
            t.elements = [...t.elements, { ...element }];
          }
        });

        save(TEAMS_LSK, teams);
        4;
        updateUser("credits", newCredits);
        setFilterMessage("success", `${element.name} added to team '${selectedTeam}'`);
      } else {
        setFilterMessage("error", "Select team to buy elements");
      }
    });

    elementStatsEl.append(ratingEl, priceEl);
    bannerEl.append(elementIconEl, elementNameEl, buyElementBtn);
    abilityEl.append(strongHeaderEl, weakHeaderEl, strongListEl, weakListEl);

    elementEl.append(elementStatsEl, bannerEl, abilityEl);

    elementList.appendChild(elementEl);
  });
}
