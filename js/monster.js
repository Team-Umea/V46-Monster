//Js code for monster page
import { serveData } from "./common/fetch.js";
import { MONSTERS_TTL } from "./common/ttl.js";
import { useClickEvent, useClickEvents, useChangeEvent, useInputEvent, useScrollEvent } from "./common/useEvent.js";
import { ALLMONSTERS_LSK } from "./common/localStorageKeys.js";
import { MonsterCard } from "./classes/MonsterCard.js";
import { populateSelect } from "./common/render.js";
import { user, updateUser } from "./common/user.js";

const sortDropDown = document.getElementById("sortDropdown");
const searchButtonGroup = document.getElementById("searchCategory");
const searchBtns = searchButtonGroup.getElementsByTagName("input");
const searchInput = document.getElementById("searchBox");
const searchSortContainer = document.getElementById("searchSortContainer");
const filterToggle = document.getElementById("filterToggle");
const monsterSelectMessage = document.getElementById("monsterSelectMessage");
const monsterContainer = document.getElementById("monsterContainer");

const sortOptions = ["A - Z", "Z - A", "Low - High Price", "High - Low Price", "Low - High Health", "High - Low Health", "Low - High Damage", "High - Low Damage", "Low - High Rank", "High - Low Rank"];

let visibleMonsters = 30;
let monsters = [];

let searchCategory = "name";
let monsterSelectTimeOutId;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getMonsters();
  toggleFilerOnRefresh();
  useClickEvent(filterToggle, toggleFilter);
  useClickEvents(searchBtns, setSearchCategory);
  useChangeEvent(sortDropDown, setSortOrder);
  useInputEvent(searchInput, searchMonsters);
  useScrollEvent(monsterContainer, appendMonsters);
  populateSortSelect();
  quickScroll();
}

async function getMonsters() {
  renderLoadingSkeletons(visibleMonsters);
  monsters = await serveData("allMonsters", undefined, monsterContainer, ALLMONSTERS_LSK, MONSTERS_TTL);
  sortMonsters(user.monsterSort || 0);
  renderMonsters();
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
  const sortOrder = user.monsterSort || 0;
  const searchQuery = searchInput.value.trim().toLowerCase();

  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();

    monsters = [...monsters].sort((a, b) => {
      const aValue = String(a[searchCategory]).toLowerCase();
      const bValue = String(b[searchCategory]).toLowerCase();

      const aIncludesQuery = aValue.includes(lowerCaseQuery);
      const bIncludesQuery = bValue.includes(lowerCaseQuery);

      if (aIncludesQuery && !bIncludesQuery) return -1;
      if (!aIncludesQuery && bIncludesQuery) return 1;

      return sortBy(a, b, sortOrder);
    });
  }

  renderMonsters();
}

function sortMonsters(sortOrder) {
  monsters = [...monsters].sort((a, b) => {
    return sortBy(a, b, sortOrder);
  });
}

function sortBy(a, b, sortOrder) {
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
      return a.health - b.health;
    case 5:
      return b.health - a.health;
    case 6:
      return a.damage - b.damage;
    case 7:
      return b.damage - a.damage;
    case 8:
      return b.rank - a.rank;
    case 9:
      return a.rank - b.rank;
    default:
      return 0;
  }
}

function populateSortSelect() {
  populateSelect(sortDropDown, sortOptions);
  sortDropDown.value = user.monsterSort || 0;
}

function setMonsterSelectMessage(className, message) {
  monsterSelectMessage.setAttribute("class", `monsterSelectMessage ${className}`);
  monsterSelectMessage.innerText = message;

  renderMonsters();

  if (monsterSelectMessage.innerText !== "") {
    clearTimeout(monsterSelectTimeOutId);

    monsterSelectTimeOutId = setTimeout(() => {
      monsterSelectMessage.setAttribute("class", "monsterSelectMessage");
      monsterSelectMessage.innerText = "";
    }, 5000);
  }
}

function toggleFilerOnRefresh() {
  if (user.monsterPortalVisible) {
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

function toggleFilter() {
  const src = filterToggle.getAttribute("src");

  if (src.includes("downArrow")) {
    filterToggle.setAttribute("src", "../res/icons/upArrow.svg");
    filterToggle.setAttribute("alt", "Hide filters");
    filterToggle.setAttribute("title", "Hide filters");
    searchSortContainer.setAttribute("class", "searchSortContainer");
    updateUser("monsterPortalVisible", true);
  } else {
    filterToggle.setAttribute("src", "../res/icons/downArrow.svg");
    filterToggle.setAttribute("alt", "Show filters");
    filterToggle.setAttribute("title", "Show filters");
    searchSortContainer.setAttribute("class", "hidden");
    updateUser("monsterPortalVisible", false);
  }
}

function closeFilter() {
  filterToggle.setAttribute("src", "../res/icons/downArrow.svg");
  filterToggle.setAttribute("alt", "Show filters");
  filterToggle.setAttribute("title", "Show filters");
  searchSortContainer.setAttribute("class", "hidden");
}

function quickScroll() {
  const btns = Array.from(document.getElementById("quickScroll").getElementsByTagName("li"));

  btns.forEach((btn) => {
    const index = btns.indexOf(btn);

    btn.addEventListener("click", () => {
      let scrollHeight = calcScrollHeight(10);

      switch (index) {
        case 0:
          monsterContainer.scrollTop = 0;
          break;
        case 1:
          monsterContainer.scrollTop = Math.max(monsterContainer.scrollTop - scrollHeight, 0);
          break;
        case 2:
          monsterContainer.scrollTop = Math.max(monsterContainer.scrollTop + scrollHeight, 0);
          break;
        case 3:
          scrollHeight = calcScrollHeight(100);
          monsterContainer.scrollTop = Math.max(monsterContainer.scrollTop - scrollHeight, 0);
          break;
        case 4:
          scrollHeight = calcScrollHeight(100);
          monsterContainer.scrollTop = Math.max(monsterContainer.scrollTop + scrollHeight, 0);
          break;
        default:
          break;
      }
    });
  });
}

function calcScrollHeight(items) {
  const containerWidth = monsterContainer.clientWidth;
  const itemWidth = 400;
  const itemHeight = 667;

  const itemsPerCol = Math.floor(containerWidth / itemWidth);
  const itemsPerRow = Math.floor(items / itemsPerCol);

  const height = itemsPerRow * itemHeight;

  return height;
}

function appendMonsters() {
  if (visibleMonsters < monsters.length) {
    const start = visibleMonsters;
    const end = visibleMonsters + 10;

    visibleMonsters += 10;

    for (let i = start; i < end; i++) {
      const monster = monsters[i];
      const monsterCard = new MonsterCard(monster, setMonsterSelectMessage).assembleMonsterCard();
      monsterContainer.appendChild(monsterCard);
    }
  }

  closeFilter();
}

function renderLoadingSkeletons(max) {
  for (let i = 0; i < max; i++) {
    const monsterCard = new MonsterCard();
    const assembleMonsterCard = monsterCard.getMonsterCard();
    monsterContainer.appendChild(assembleMonsterCard);
  }
}

function renderMonsters() {
  visibleMonsters = 30;
  monsterContainer.innerHTML = "";

  for (let i = 0; i < visibleMonsters; i++) {
    const monster = monsters[i];
    const monsterCard = new MonsterCard(monster, setMonsterSelectMessage).assembleMonsterCard();

    monsterContainer.appendChild(monsterCard);
  }
}
