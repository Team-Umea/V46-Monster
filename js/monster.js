//Js code for monster page
import { serveData } from "./common/fetch.js";
import { MONSTERS_TTL } from "./common/ttl.js";
import { useClickEvent, useClickEvents, useChangeEvent, useInputEvent, useScrollEvent } from "./common/useEvent.js";
import { ALLMONSTERS_LSK, TEAMS_LSK } from "./common/localStorageKeys.js";
import { MonsterCard } from "./classes/MonsterCard.js";
import { load } from "./common/utilities.js";
import { populateSelect } from "./common/render.js";
import { Team } from "./classes/Team.js";
import { user, updateUser } from "./common/user.js";

const monsterContainer = document.getElementById("monsterContainer");
const sortDropDown = document.getElementById("sortDropdown");
const searchButtonGroup = document.getElementById("searchCategory");
const searchBtns = searchButtonGroup.getElementsByTagName("input");
const searchInput = document.getElementById("searchBox");
const searchSortContainer = document.getElementById("searchSortContainer");
const filterToggle = document.getElementById("filterToggle");

let visibleMonsters = 30;
let monsters = [];
let teams = [];

let searchCategory = "name";

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  useClickEvent(filterToggle, toggleFilter);
  useClickEvents(searchBtns, setSearchCategory);
  useChangeEvent(sortDropDown, setSortOrder);
  useInputEvent(searchInput, searchMonsters);
  useScrollEvent(monsterContainer, appendMonsters);
  getMonsters();
  loadTeamsFromLS();
  populateSelect(sortDropDown, ["A - Z", "Z - A", "Low - High Price", "High - Low Price", "Low - High Health", "High - Low Health", "Low - High Damage", "High - Low Damage", "Low - High Rank", "High - Low Rank"]);
}

async function getMonsters() {
  renderLoadingSkeletons(visibleMonsters);
  monsters = await serveData("allMonsters", undefined, monsterContainer, ALLMONSTERS_LSK, MONSTERS_TTL);
  sortMonsters(user.monsterSort || 0);
  renderMonsters();
}

function loadTeamsFromLS() {
  const loadedTeams = load(TEAMS_LSK);
  if (loadedTeams) {
    loadedTeams.forEach((loadedTeam) => {
      teams.push(Team.fromJSON(loadedTeam));
    });
  }
}

function renderLoadingSkeletons(max) {
  for (let i = 0; i < max; i++) {
    const monsterCard = new MonsterCard();
    const assembleMonsterCard = monsterCard.getMonsterCard();
    monsterContainer.appendChild(assembleMonsterCard);
  }
}

function appendMonsters() {
  visibleMonsters += 10;

  for (let i = 0; i < 10; i++) {
    const monster = monsters[i];
    const monsterCard = new MonsterCard(monster, teams).assembleMonsterCard();
    monsterContainer.appendChild(monsterCard);
  }
  closeFilter();
}

function renderMonsters(condition) {
  visibleMonsters = 30;
  monsterContainer.innerHTML = "";

  for (let i = 0; i < visibleMonsters; i++) {
    const monster = monsters[i];
    const monsterCard = new MonsterCard(monster, teams).assembleMonsterCard();

    if (condition === undefined || condition === null) {
      monsterContainer.appendChild(monsterCard);
    } else if (condition !== undefined && condition !== null) {
      if (typeof condition === "function") {
        if (condition(monster) === true) {
          monsterContainer.appendChild(monsterCard);
        }
      } else {
        if (condition === true) {
          monsterContainer.appendChild(monsterCard);
        }
      }
    }
  }
}

function setSearchCategory() {
  const selectedBtn = Array.from(searchBtns).find((btn) => btn.checked);
  searchCategory = selectedBtn.value.toLowerCase();
  searchInput.value = "";
  renderMonsters();
}

function setSortOrder() {
  const sortOrder = Number(sortDropDown.value);

  updateUser("monsterSort", sortOrder);
  sortMonsters(sortOrder);

  searchMonsters();
}

function searchMonsters() {
  const searchQuery = searchInput.value.trim().toLowerCase();

  const matchingQuery = (query) => {
    return String(query[searchCategory]).toLowerCase().includes(searchQuery);
  };

  renderMonsters(matchingQuery);
}

function sortMonsters(sortOrder) {
  switch (sortOrder) {
    case 0:
      monsters = [...monsters].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      break;
    case 1:
      monsters = [...monsters].sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      break;
    case 2:
      monsters = [...monsters].sort((a, b) => {
        const priceDifference = a.price - b.price;
        const rankDifference = priceDifference === 0 ? a.rank - b.rank : priceDifference;
        return rankDifference;
      });
      break;
    case 3:
      monsters = [...monsters].sort((a, b) => {
        const priceDifference = b.price - a.price;
        const rankDifference = priceDifference === 0 ? a.rank - b.rank : priceDifference;
        return rankDifference;
      });
      break;
    case 4:
      monsters = [...monsters].sort((a, b) => {
        const healthDifference = a.health - b.health;
        const rankDifference = healthDifference === 0 ? a.rank - b.rank : healthDifference;
        return rankDifference;
      });
      break;
    case 5:
      monsters = [...monsters].sort((a, b) => {
        const healthDifference = b.health - a.health;
        const rankDifference = healthDifference === 0 ? a.rank - b.rank : healthDifference;
        return rankDifference;
      });
      break;
    case 6:
      monsters = [...monsters].sort((a, b) => {
        const damageDifference = a.damage - b.damage;
        const rankDifference = damageDifference === 0 ? a.rank - b.rank : damageDifference;
        return rankDifference;
      });
      break;
    case 7:
      monsters = [...monsters].sort((a, b) => {
        const damageDifference = b.damage - a.damage;
        const rankDifference = damageDifference === 0 ? a.rank - b.rank : damageDifference;
        return rankDifference;
      });
      break;
    case 8:
      monsters = [...monsters].sort((a, b) => {
        const rankDifference = b.rank - a.rank;
        return rankDifference;
      });
      break;
    case 9:
      monsters = [...monsters].sort((a, b) => {
        const rankDifference = a.rank - b.rank;
        return rankDifference;
      });
      break;
    default:
      break;
  }
}

function closeFilter() {
  filterToggle.setAttribute("src", "../res/icons/downArrow.svg");
  filterToggle.setAttribute("alt", "Show filters");
  filterToggle.setAttribute("title", "Show filters");
  searchSortContainer.setAttribute("class", "hidden");
}

function toggleFilter() {
  const src = filterToggle.getAttribute("src");

  if (src.includes("downArrow")) {
    filterToggle.setAttribute("src", "../res/icons/upArrow.svg");
    filterToggle.setAttribute("alt", "Hide filters");
    filterToggle.setAttribute("title", "Hide filters");
    searchSortContainer.setAttribute("class", "searchSortContainer");
  } else {
    filterToggle.setAttribute("src", "../res/icons/downArrow.svg");
    filterToggle.setAttribute("alt", "Show filters");
    filterToggle.setAttribute("title", "Show filters");
    searchSortContainer.setAttribute("class", "hidden");
  }
}
