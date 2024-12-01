//Js code for monster page
import { serveData } from "./common/fetch.js";
import { useClickEvent, useClickEvents, useScrollEvent, useChangeEvent, useInputEvent, useMouseWheelEvent } from "./common/useEvent.js";
import { ALLMONSTERS_LSK } from "./common/localStorageKeys.js";
import { MonsterCard } from "./classes/MonsterCard.js";
import { isValidObjKey } from "./common/utilities.js";
import { renderSelect } from "./common/render.js";

const monsterContainer = document.getElementById("monsterContainer");
const sortDropDown = document.getElementById("sortDropdown");
const searchButtonGroup = document.getElementById("searchCategory");
const searchBtns = searchButtonGroup.getElementsByTagName("input");
const searchBox = document.getElementById("searchBox");
const searchSortContainer = document.getElementById("searchSortContainer");
const filterToggle = document.getElementById("filterToggle");

const ttl = 60;
let visibleMonsters = 20;
const monsterCards = [];
let monsters = [];
let searchCategory;

const ranks = [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  useClickEvent(filterToggle, toggleFilter);
  useClickEvents(searchBtns, setSearchCategory);
  useScrollEvent(monsterContainer, infiniteScroll);
  useChangeEvent(sortDropDown, showMonsters);
  useInputEvent(searchBox, searchMonsters);

  useData();
}

async function useData() {
  renderLoadingSkeletons(visibleMonsters);

  const promises = [serveData("allMonsters", undefined, monsterContainer, ALLMONSTERS_LSK, ttl), serveData("sortOptions", undefined, sortDropDown)];

  const responses = await Promise.all(promises);

  const monsterData = responses[0];
  const options = responses[1];

  monsters = monsterData.map((data) => ({ monster: data, visible: true }));

  showMonsters();
  renderSelect(sortDropDown, options);
}

function showAllMonsters() {
  const hasSearchQuery = searchBox.value !== "";
  if (hasSearchQuery) {
    monsters.forEach((monster) => (monster.visible = true));
    searchBox.value = "";
    renderMonsters();
  }
}

function showMonsters() {
  monsters.forEach((monster) => (monster.visible = true));

  const sortOrder = Number(sortDropDown.value);
  sortMonsters(sortOrder);

  monsters.forEach((monster, index) => {
    if (index >= visibleMonsters) {
      monster.visible = false;
    } else {
      monster.visible = true;
    }
  });

  renderMonsters();
}

function renderLoadingSkeletons(max) {
  for (let i = 0; i < max; i++) {
    const monsterCard = new MonsterCard();
    const assembleMonsterCard = monsterCard.getLoadingSkeletion();
    monsterCards.push(monsterCard);
    monsterContainer.appendChild(assembleMonsterCard);
  }
}

function renderMonsters() {
  monsterContainer.innerHTML = "";
  const tempTeams = ["a", "b", "c", "d"]; //change for later

  monsters.forEach((monsterObj) => {
    const isVisible = monsterObj.visible;
    const monster = monsterObj.monster;
    const id = monster.id;
    const allMonsters = [...monsters];
    const monsterCard = new MonsterCard(monster, allMonsters, tempTeams, id);

    if (ranks.length < monsters.length) {
      const monsterRank = monsterCard.getRank();
      ranks.push(monsterRank);
    }

    const assembledMonsterCard = monsterCard.assembleMonsterCard();
    if (isVisible) {
      monsterContainer.appendChild(assembledMonsterCard);
    }
  });
}

function infiniteScroll() {
  if (visibleMonsters < monsters.length) {
    visibleMonsters += 10;
    showMonsters();
  }
}

function setSearchCategory() {
  const selectedBtn = Array.from(searchBtns).find((btn) => btn.checked);
  searchCategory = selectedBtn.value;
  showAllMonsters();
}

function searchMonsters() {
  const searchQuery = searchBox.value.trim().toLowerCase();
  monsters.forEach((monsterObj) => {
    const monster = monsterObj.monster;

    if (searchCategory !== "rank") {
      if (searchCategory in monster) {
        const value = monster[searchCategory];
        let valueStrHasQuery;
        let valueArrHasQuery;

        if (typeof value === "string" || typeof value === "number") {
          valueStrHasQuery = value.toString().trim().toLowerCase().startsWith(searchQuery);
        } else {
          valueArrHasQuery = value.some((item) => item.toLowerCase().startsWith(searchQuery));
        }

        if (valueStrHasQuery || valueArrHasQuery) {
          monsterObj.visible = true;
        } else {
          monsterObj.visible = false;
        }
      }
    } else {
      const rank = ranks.find((m) => m.id === monster.id).rank.toString();

      if (rank.startsWith(searchQuery)) {
        monsterObj.visible = true;
      } else {
        monsterObj.visible = false;
      }
    }
  });

  renderMonsters();
}

function sortMonsters(sortOrder) {
  switch (sortOrder) {
    case 0:
      //A-Z;
      defaultSort("name");
      break;
    case 1:
      //Z-A
      reverseSort("name");
      break;
    case 2:
      //Lo-Hi Price
      defaultSort("price");
      break;
    case 3:
      //Hi-Lo Price
      reverseSort("price");
      break;
    case 4:
      //Lo-Hi Health
      defaultSort("health");
      break;
    case 5:
      //Hi-Lo Health
      reverseSort("health");
      break;
    case 6:
      //Lo-Hi Rank
      sortByLoHiRank();
      break;
    case 7:
      //Hi-Lo Rank
      sortByHiLoRank();
      break;
    case 8:
      //Lo-Hi Damage
      defaultSort("damage");
      break;
    case 9:
      //Hi-Lo Damage
      reverseSort("damage");
      break;
    case 10:
      //Few-Many Elements
      sortByFewToManyElements();
      break;
    case 11:
      //Many-Few Elements;
      sortByManyToFewElements();
      break;
    default:
      break;
  }
}

function defaultSort(key) {
  const tempMonsters = [...monsters].map((monster) => monster.monster);
  if (isValidObjKey(tempMonsters, key)) {
    monsters = [...monsters].sort((a, b) => {
      const valueA = a.monster[key];
      const valueB = b.monster[key];
      if (typeof valueA === "string") {
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      } else if (typeof valueA === "number") {
        const diff = valueA - valueB;
        return diff === 0 ? a.monster.name.toLowerCase().localeCompare(b.monster.name.toLowerCase()) : diff;
      }
    });
  }
}

function reverseSort(key) {
  const tempMonsters = [...monsters].map((monster) => monster.monster);
  if (isValidObjKey(tempMonsters, key)) {
    monsters = [...monsters].sort((a, b) => {
      const valueA = a.monster[key];
      const valueB = b.monster[key];
      if (typeof valueA === "string") {
        return valueB.localeCompare(valueA);
      } else if (typeof valueA === "number") {
        const diff = valueB - valueA;
        return diff === 0 ? a.monster.name.localeCompare(b.monster.name) : diff;
      }
    });
  }
}

function sortByLoHiRank() {
  monsters = [...monsters].sort((a, b) => {
    const monsterA = a.monster.id;
    const monsterB = b.monster.id;
    const rankA = ranks.length - ranks.find((rank) => rank.id === monsterA).rank;
    const rankB = ranks.length - ranks.find((rank) => rank.id === monsterB).rank;
    return rankA - rankB;
  });
}

function sortByHiLoRank() {
  monsters = [...monsters].sort((a, b) => {
    const monsterA = a.monster.id;
    const monsterB = b.monster.id;
    const rankA = ranks.length - ranks.find((rank) => rank.id === monsterA).rank;
    const rankB = ranks.length - ranks.find((rank) => rank.id === monsterB).rank;
    return rankB - rankA;
  });
}

function sortByFewToManyElements() {
  monsters = [...monsters].sort((a, b) => {
    const elementsA = a.monster.elements.length;
    const elementsB = b.monster.elements.length;
    const elementsDifference = elementsA - elementsB;
    return elementsDifference === 0 ? a.monster.name.localeCompare(b.monster.name) : elementsDifference;
  });
}

function sortByManyToFewElements() {
  monsters = [...monsters].sort((a, b) => {
    const elementsA = a.monster.elements.length;
    const elementsB = b.monster.elements.length;
    const elementsDifference = elementsB - elementsA;
    return elementsDifference === 0 ? a.monster.name.localeCompare(b.monster.name) : elementsDifference;
  });
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
